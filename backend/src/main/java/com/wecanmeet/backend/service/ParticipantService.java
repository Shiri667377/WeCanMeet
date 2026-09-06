package com.wecanmeet.backend.service;

import com.wecanmeet.backend.dto.participant.CreateParticipantRequest;
import com.wecanmeet.backend.model.Group;
import com.wecanmeet.backend.model.Participant;
import com.wecanmeet.backend.repository.GroupRepository;
import com.wecanmeet.backend.repository.ParticipantRepository;
import com.wecanmeet.backend.service.result.CreatedParticipantResult;
import com.wecanmeet.backend.security.TokenUtils;
import org.springframework.stereotype.Service;


@Service
public class ParticipantService {

    private static final long MAX_PARTICIPANTS = 50;

    private final ParticipantRepository participantRepository;
    private final GroupRepository groupRepository;

    public ParticipantService(
            ParticipantRepository participantRepository,
            GroupRepository groupRepository
    ) {
        this.participantRepository = participantRepository;
        this.groupRepository = groupRepository;
    }

    public CreatedParticipantResult createParticipant(
            Long groupId,
            CreateParticipantRequest request
    ) {
        Group group = groupRepository
                .findById(groupId)
                .orElseThrow();

        if (!group.isActive()) {
            throw new IllegalStateException("Group is closed");
        }

        long participantCount =
                participantRepository.countByGroupId(groupId);

        if (participantCount >= MAX_PARTICIPANTS) {
            throw new IllegalStateException(
                    "Maximum number of participants reached"
            );
        }

        Participant participant = new Participant();

        participant.setName(request.name());
        participant.setGroup(group);

        String participantToken =
                TokenUtils.generateToken();

        String participantTokenHash =
                TokenUtils.hashToken(participantToken);

        participant.setParticipantTokenHash(
                participantTokenHash
        );

        Participant savedParticipant =
                participantRepository.save(participant);

        return new CreatedParticipantResult(
                savedParticipant.getId(),
                participantToken
        );
    }
}