package com.wecanmeet.backend.service;

import com.wecanmeet.backend.dto.result.MeetingResultResponse;
import com.wecanmeet.backend.model.AvailabilityEntry;
import com.wecanmeet.backend.model.Group;
import com.wecanmeet.backend.repository.AvailabilityEntryRepository;
import com.wecanmeet.backend.repository.GroupRepository;
import com.wecanmeet.backend.repository.ParticipantRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

@Service
public class MeetingMatchingService {

    private final GroupRepository groupRepository;
    private final AvailabilityEntryRepository availabilityEntryRepository;
    private final ParticipantRepository participantRepository;

    public MeetingMatchingService(
            GroupRepository groupRepository,
            AvailabilityEntryRepository availabilityEntryRepository,
            ParticipantRepository participantRepository
    ) {
        this.groupRepository = groupRepository;
        this.availabilityEntryRepository = availabilityEntryRepository;
        this.participantRepository = participantRepository;
    }

    public List<MeetingResultResponse> getResults(Long groupId) {

        Group group = groupRepository
                .findById(groupId)
                .orElseThrow();

        List<AvailabilityEntry> entries =
                availabilityEntryRepository
                        .findByParticipantGroupId(groupId);

        int totalParticipants =
                (int) participantRepository.countByGroupId(groupId);

        Map<LocalDate, List<AvailabilityEntry>> entriesByDate =
                new HashMap<>();

        for (AvailabilityEntry entry : entries) {
            entriesByDate
                    .computeIfAbsent(
                            entry.getDate(),
                            date -> new ArrayList<>()
                    )
                    .add(entry);
        }

        List<MeetingResultResponse> results =
                new ArrayList<>();

        for (Map.Entry<LocalDate, List<AvailabilityEntry>> day
                : entriesByDate.entrySet()) {

            List<CandidateWindow> dayResults =
                    calculateResultsForDay(
                            day.getValue(),
                            group.getMinimumMeetingDuration()
                    );

            for (CandidateWindow candidate : dayResults) {
                results.add(
                        new MeetingResultResponse(
                                day.getKey(),
                                candidate.startTime(),
                                candidate.endTime(),
                                candidate.participantIds().size(),
                                totalParticipants
                        )
                );
            }
        }

        results.sort(
                Comparator
                        .comparingInt(
                                MeetingResultResponse::availableParticipants
                        )
                        .reversed()
                        .thenComparing(
                                Comparator.comparingLong(
                                        (MeetingResultResponse result) ->
                                                Duration.between(
                                                        result.startTime(),
                                                        result.endTime()
                                                ).toMinutes()
                                ).reversed()
                        )
                        .thenComparing(MeetingResultResponse::date)
                        .thenComparing(MeetingResultResponse::startTime)
        );

        return results;
    }

    private List<CandidateWindow> calculateResultsForDay(
            List<AvailabilityEntry> entries,
            int minimumMeetingDuration
    ) {

        TreeSet<LocalTime> timePoints = new TreeSet<>();

        for (AvailabilityEntry entry : entries) {
            timePoints.add(entry.getStartTime());
            timePoints.add(entry.getEndTime());
        }

        List<LocalTime> times =
                new ArrayList<>(timePoints);

        Map<Long, List<AvailabilityEntry>> entriesByParticipant =
                new HashMap<>();

        for (AvailabilityEntry entry : entries) {
            entriesByParticipant
                    .computeIfAbsent(
                            entry.getParticipant().getId(),
                            id -> new ArrayList<>()
                    )
                    .add(entry);
        }

        List<CandidateWindow> candidates =
                new ArrayList<>();

        for (int startIndex = 0;
             startIndex < times.size();
             startIndex++) {

            for (int endIndex = startIndex + 1;
                 endIndex < times.size();
                 endIndex++) {

                LocalTime startTime =
                        times.get(startIndex);

                LocalTime endTime =
                        times.get(endIndex);

                long duration =
                        Duration.between(
                                startTime,
                                endTime
                        ).toMinutes();

                if (duration < minimumMeetingDuration) {
                    continue;
                }

                Set<Long> availableParticipants =
                        new HashSet<>();

                for (Map.Entry<Long, List<AvailabilityEntry>>
                        participant : entriesByParticipant.entrySet()) {

                    if (isAvailableForWholeWindow(
                            participant.getValue(),
                            startTime,
                            endTime
                    )) {
                        availableParticipants.add(
                                participant.getKey()
                        );
                    }
                }

                if (!availableParticipants.isEmpty()) {
                    candidates.add(
                            new CandidateWindow(
                                    startTime,
                                    endTime,
                                    Set.copyOf(
                                            availableParticipants
                                    )
                            )
                    );
                }
            }
        }

        return keepMaximalWindows(candidates);
    }

    private boolean isAvailableForWholeWindow(
            List<AvailabilityEntry> entries,
            LocalTime requestedStart,
            LocalTime requestedEnd
    ) {

        List<AvailabilityEntry> sortedEntries =
                new ArrayList<>(entries);

        sortedEntries.sort(
                Comparator.comparing(
                        AvailabilityEntry::getStartTime
                )
        );

        LocalTime coveredUntil = requestedStart;

        for (AvailabilityEntry entry : sortedEntries) {

            if (!entry.getEndTime().isAfter(coveredUntil)) {
                continue;
            }

            if (entry.getStartTime().isAfter(coveredUntil)) {
                return false;
            }

            if (entry.getEndTime().isAfter(coveredUntil)) {
                coveredUntil = entry.getEndTime();
            }

            if (!coveredUntil.isBefore(requestedEnd)) {
                return true;
            }
        }

        return false;
    }

    private List<CandidateWindow> keepMaximalWindows(
            List<CandidateWindow> candidates
    ) {

        List<CandidateWindow> maximalWindows =
                new ArrayList<>();

        for (CandidateWindow candidate : candidates) {

            boolean containedInLargerWindow = false;

            for (CandidateWindow other : candidates) {

                if (candidate == other) {
                    continue;
                }

                if (!candidate.participantIds()
                        .equals(other.participantIds())) {
                    continue;
                }

                boolean startsBeforeOrSame =
                        !other.startTime()
                                .isAfter(candidate.startTime());

                boolean endsAfterOrSame =
                        !other.endTime()
                                .isBefore(candidate.endTime());

                boolean actuallyLarger =
                        other.startTime()
                                .isBefore(candidate.startTime())
                        ||
                        other.endTime()
                                .isAfter(candidate.endTime());

                if (startsBeforeOrSame
                        && endsAfterOrSame
                        && actuallyLarger) {

                    containedInLargerWindow = true;
                    break;
                }
            }

            if (!containedInLargerWindow) {
                maximalWindows.add(candidate);
            }
        }

        return maximalWindows;
    }

    private record CandidateWindow(
            LocalTime startTime,
            LocalTime endTime,
            Set<Long> participantIds
    ) {
    }
}