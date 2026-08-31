package com.wecanmeet.backend.controller;

import com.wecanmeet.backend.service.GroupService;
import org.springframework.web.bind.annotation.RestController;

import com.wecanmeet.backend.model.Group;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

import org.springframework.http.ResponseEntity;

@RestController
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/groups")
    public Group createGroup(@RequestBody Group group) {
        return groupService.createGroup(group);
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupService.getGroupById(id);

        if (group.isPresent()) {
            return ResponseEntity.ok(group.get());
        }

        return ResponseEntity.notFound().build();
    }
}
