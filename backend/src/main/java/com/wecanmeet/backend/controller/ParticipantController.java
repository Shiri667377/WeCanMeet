package com.wecanmeet.backend.controller;

import com.wecanmeet.backend.dto.participant.CreateParticipantRequest;
import com.wecanmeet.backend.service.result.CreatedParticipantResult;
import com.wecanmeet.backend.service.ParticipantService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.wecanmeet.backend.dto.participant.ParticipantResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(
            ParticipantService participantService) {
        this.participantService = participantService;
    }

    @PostMapping("/groups/{groupId}/participants")
    public ResponseEntity<Long> createParticipant(
            @PathVariable Long groupId,
            @RequestBody CreateParticipantRequest request) {
        CreatedParticipantResult result = participantService.createParticipant(
                groupId,
                request);

        ResponseCookie participantCookie = ResponseCookie.from(
                "wecanmeet_participant_" + groupId,
                result.participantToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .build();

        return ResponseEntity
                .status(201)
                .header(
                        HttpHeaders.SET_COOKIE,
                        participantCookie.toString())
                .body(result.participantId());
    }

    @GetMapping("/groups/{groupId}/participants/me")
    public ResponseEntity<ParticipantResponse> getCurrentParticipant(
            @PathVariable Long groupId,
            HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return ResponseEntity.notFound().build();
        }

        String cookieName = "wecanmeet_participant_" + groupId;

        String participantToken = null;

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                participantToken = cookie.getValue();
                break;
            }
        }

        if (participantToken == null) {
            return ResponseEntity.notFound().build();
        }

        ParticipantResponse participant = participantService.getCurrentParticipant(
                groupId,
                participantToken);

        return ResponseEntity.ok(participant);
    }
}