package com.wecanmeet.backend.service;

import com.wecanmeet.backend.dto.group.CreateGroupRequest;
import com.wecanmeet.backend.model.Group;
import com.wecanmeet.backend.repository.GroupRepository;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public Group createGroup(CreateGroupRequest request) {
        Group group = new Group();

        group.setName(request.getName());
        group.setCreatorName(request.getCreatorName());
        group.setMinimumMeetingDuration(
            request.getMinimumMeetingDuration()
        );
        group.setStartDate(request.getStartDate());
        group.setEndDate(request.getEndDate());

        return groupRepository.save(group);
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }
}