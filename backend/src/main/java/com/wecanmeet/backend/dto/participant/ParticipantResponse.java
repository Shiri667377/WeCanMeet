package com.wecanmeet.backend.dto.participant;

public record ParticipantResponse(
        Long id,
        String name,
        boolean active
) {
}