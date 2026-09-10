package com.wecanmeet.backend.dto.availability;

import java.util.List;

public record SaveAvailabilityRequest(
        List<AvailabilityWindowRequest> entries
) {
}