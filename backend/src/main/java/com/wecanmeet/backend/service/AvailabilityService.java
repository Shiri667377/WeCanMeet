package com.wecanmeet.backend.service;

import com.wecanmeet.backend.dto.availability.AvailabilityEntryResponse;
import com.wecanmeet.backend.dto.availability.AvailabilityWindowRequest;
import com.wecanmeet.backend.dto.availability.SaveAvailabilityRequest;
import com.wecanmeet.backend.model.AvailabilityEntry;
import com.wecanmeet.backend.model.Participant;
import com.wecanmeet.backend.repository.AvailabilityEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityEntryRepository availabilityEntryRepository;
    private final ParticipantService participantService;

    public AvailabilityService(
            AvailabilityEntryRepository availabilityEntryRepository,
            ParticipantService participantService) {
        this.availabilityEntryRepository = availabilityEntryRepository;
        this.participantService = participantService;
    }

    @Transactional
    public void saveAvailability(
            Long groupId,
            String participantToken,
            SaveAvailabilityRequest request) {
        Participant participant = participantService.getCurrentParticipantEntity(
                groupId,
                participantToken);

        validateAvailability(participant, request);

        availabilityEntryRepository
                .deleteByParticipantId(participant.getId());

        for (AvailabilityWindowRequest window : request.entries()) {
            AvailabilityEntry entry = new AvailabilityEntry();

            entry.setDate(window.date());
            entry.setStartTime(window.startTime());
            entry.setEndTime(window.endTime());
            entry.setParticipant(participant);

            availabilityEntryRepository.save(entry);
        }
    }

    private void validateAvailability(
            Participant participant,
            SaveAvailabilityRequest request) {
        for (AvailabilityWindowRequest window : request.entries()) {

            if (!window.startTime().isBefore(window.endTime())) {
                throw new IllegalArgumentException(
                        "Start time must be before end time");
            }

            if (window.date().isBefore(
                    participant.getGroup().getStartDate())) {
                throw new IllegalArgumentException(
                        "Availability date is before group start date");
            }

            if (window.date().isAfter(
                    participant.getGroup().getEndDate())) {
                throw new IllegalArgumentException(
                        "Availability date is after group end date");
            }
        }
    }

    public List<AvailabilityEntryResponse> getCurrentAvailability(
            Long groupId,
            String participantToken) {
        Participant participant = participantService.getCurrentParticipantEntity(
                groupId,
                participantToken);

        return availabilityEntryRepository
                .findByParticipantId(participant.getId())
                .stream()
                .map(entry -> new AvailabilityEntryResponse(
                        entry.getId(),
                        entry.getDate(),
                        entry.getStartTime(),
                        entry.getEndTime()))
                .toList();
    }
}