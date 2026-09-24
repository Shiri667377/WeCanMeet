package com.wecanmeet.backend.controller;

import com.wecanmeet.backend.dto.result.MeetingResultResponse;
import com.wecanmeet.backend.service.MeetingMatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MeetingResultController {

    private final MeetingMatchingService meetingMatchingService;

    public MeetingResultController(
            MeetingMatchingService meetingMatchingService
    ) {
        this.meetingMatchingService = meetingMatchingService;
    }

    @GetMapping("/groups/{groupId}/results")
    public ResponseEntity<List<MeetingResultResponse>> getResults(
            @PathVariable Long groupId
    ) {
        List<MeetingResultResponse> results =
                meetingMatchingService.getResults(groupId);

        return ResponseEntity.ok(results);
    }
}