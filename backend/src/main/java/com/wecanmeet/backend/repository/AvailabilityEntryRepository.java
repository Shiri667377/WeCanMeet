package com.wecanmeet.backend.repository;

import com.wecanmeet.backend.model.AvailabilityEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityEntryRepository
        extends JpaRepository<AvailabilityEntry, Long> {

    List<AvailabilityEntry> findByParticipantGroupId(Long groupId);

    List<AvailabilityEntry> findByParticipantId(Long participantId);

    void deleteByParticipantId(Long participantId);
}