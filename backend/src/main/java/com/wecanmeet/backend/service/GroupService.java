package com.wecanmeet.backend.service;

import com.wecanmeet.backend.dto.group.CreateGroupRequest;
import com.wecanmeet.backend.model.Group;
import com.wecanmeet.backend.repository.GroupRepository;
import com.wecanmeet.backend.dto.group.GroupResponse;
import com.wecanmeet.backend.security.TokenUtils;
import com.wecanmeet.backend.service.result.CreatedGroupResult;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public CreatedGroupResult createGroup(CreateGroupRequest request) {
        Group group = new Group();

        group.setName(request.getName());
        group.setCreatorName(request.getCreatorName());
        group.setMinimumMeetingDuration(
                request.getMinimumMeetingDuration());
        group.setStartDate(request.getStartDate());
        group.setEndDate(request.getEndDate());

        String adminToken = TokenUtils.generateToken();
        String adminTokenHash = TokenUtils.hashToken(adminToken);

        group.setAdminTokenHash(adminTokenHash);

        Group savedGroup = groupRepository.save(group);

        return new CreatedGroupResult(
                savedGroup.getId(),
                adminToken);
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public Optional<GroupResponse> getGroupResponseById(Long id) {
        return groupRepository
                .findById(id)
                .map(group -> new GroupResponse(
                        group.getId(),
                        group.getName(),
                        group.getCreatorName(),
                        group.getMinimumMeetingDuration(),
                        group.getStartDate(),
                        group.getEndDate(),
                        group.isActive(),
                        group.getCreatedAt()));
    }

    public boolean closeGroup(Long id, String adminToken) {
        Optional<Group> optionalGroup = groupRepository.findById(id);

        if (optionalGroup.isEmpty()) {
            return false;
        }

        Group group = optionalGroup.get();

        String tokenHash = TokenUtils.hashToken(adminToken);

        if (!tokenHash.equals(group.getAdminTokenHash())) {
            throw new SecurityException(
                    "Invalid admin token");
        }

        group.setActive(false);

        groupRepository.save(group);

        return true;
    }
}