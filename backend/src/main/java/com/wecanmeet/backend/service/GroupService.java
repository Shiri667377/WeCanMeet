package com.wecanmeet.backend.service;

import com.wecanmeet.backend.dto.group.CreateGroupRequest;
import com.wecanmeet.backend.model.Group;
import com.wecanmeet.backend.repository.GroupRepository;
import com.wecanmeet.backend.dto.group.CreateGroupResponse;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public CreateGroupResponse createGroup(CreateGroupRequest request) {
        Group group = new Group();

        group.setName(request.getName());
        group.setCreatorName(request.getCreatorName());
        group.setMinimumMeetingDuration(
                request.getMinimumMeetingDuration());
        group.setStartDate(request.getStartDate());
        group.setEndDate(request.getEndDate());

        Group savedGroup = groupRepository.save(group);

        return new CreateGroupResponse(
                savedGroup.getId(),
                savedGroup.getName(),
                savedGroup.getCreatorName(),
                savedGroup.getMinimumMeetingDuration(),
                savedGroup.getStartDate(),
                savedGroup.getEndDate(),
                savedGroup.isActive(),
                savedGroup.getCreatedAt(),
                null);
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }
}