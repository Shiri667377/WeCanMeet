package com.wecanmeet.backend.service.result;

public record CreatedParticipantResult(
        Long participantId,
        String participantToken
) {
}