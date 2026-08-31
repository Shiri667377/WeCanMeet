package com.wecanmeet.backend.controller;

import com.wecanmeet.backend.service.GroupService;
import org.springframework.web.bind.annotation.RestController;

import com.wecanmeet.backend.model.Group;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
}
