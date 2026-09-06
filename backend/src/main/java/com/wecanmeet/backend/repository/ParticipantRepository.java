package com.wecanmeet.backend.repository;

import com.wecanmeet.backend.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParticipantRepository
        extends JpaRepository<Participant, Long> {

    long countByGroupId(Long groupId);

    Optional<Participant> findByGroupIdAndParticipantTokenHash(
            Long groupId,
            String participantTokenHash
    );
}