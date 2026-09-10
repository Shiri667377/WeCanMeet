package com.wecanmeet.backend.dto.availability;

import java.time.LocalDate;
import java.time.LocalTime;

public record AvailabilityEntryResponse(
        Long id,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime
) {
}