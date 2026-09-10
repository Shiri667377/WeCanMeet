package com.wecanmeet.backend.controller;

import com.wecanmeet.backend.dto.availability.SaveAvailabilityRequest;
import com.wecanmeet.backend.service.AvailabilityService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(
            AvailabilityService availabilityService
    ) {
        this.availabilityService = availabilityService;
    }

    @PutMapping("/groups/{groupId}/availability")
    public ResponseEntity<Void> saveAvailability(
            @PathVariable Long groupId,
            @RequestBody SaveAvailabilityRequest request,
            HttpServletRequest httpRequest
    ) {
        Cookie[] cookies = httpRequest.getCookies();

        if (cookies == null) {
            return ResponseEntity.status(403).build();
        }

        String cookieName =
                "wecanmeet_participant_" + groupId;

        String participantToken = null;

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                participantToken = cookie.getValue();
                break;
            }
        }

        if (participantToken == null) {
            return ResponseEntity.status(403).build();
        }

        availabilityService.saveAvailability(
                groupId,
                participantToken,
                request
        );

        return ResponseEntity.noContent().build();
    }
}