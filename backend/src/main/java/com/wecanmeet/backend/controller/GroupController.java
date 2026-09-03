package com.wecanmeet.backend.controller;

import com.wecanmeet.backend.service.GroupService;

import com.wecanmeet.backend.dto.group.CreateGroupResponse;

import org.springframework.web.bind.annotation.RestController;

import com.wecanmeet.backend.dto.group.CreateGroupRequest;
import com.wecanmeet.backend.model.Group;
import com.wecanmeet.backend.service.result.CreatedGroupResult;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

import org.springframework.http.ResponseEntity;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PatchMapping;

@RestController
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/groups")
    public ResponseEntity<CreateGroupResponse> createGroup(
            @RequestBody CreateGroupRequest request) {
        CreatedGroupResult result = groupService.createGroup(request);

        ResponseCookie adminCookie = ResponseCookie.from(
                "wecanmeet_admin_" + result.response().getId(),
                result.adminToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .build();

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        adminCookie.toString())
                .body(result.response());
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupService.getGroupById(id);

        if (group.isPresent()) {
            return ResponseEntity.ok(group.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/groups/{id}/close")
    public ResponseEntity<Void> closeGroup(
            @PathVariable Long id,
            HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return ResponseEntity.status(403).build();
        }

        String cookieName = "wecanmeet_admin_" + id;
        String adminToken = null;

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                adminToken = cookie.getValue();
                break;
            }
        }

        if (adminToken == null) {
            return ResponseEntity.status(403).build();
        }

        boolean closed = groupService.closeGroup(id, adminToken);

        if (!closed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
