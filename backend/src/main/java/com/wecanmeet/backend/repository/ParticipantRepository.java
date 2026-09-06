package com.wecanmeet.backend.repository;

import com.wecanmeet.backend.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository
        extends JpaRepository<Participant, Long> {

    long countByGroupId(Long groupId);

}
