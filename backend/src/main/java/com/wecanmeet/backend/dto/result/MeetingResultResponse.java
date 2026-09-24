package com.wecanmeet.backend.dto.result;

import java.time.LocalDate;
import java.time.LocalTime;

public record MeetingResultResponse(
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        int availableParticipants,
        int totalParticipants
) {
}