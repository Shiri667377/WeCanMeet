package com.wecanmeet.backend.service;

import com.wecanmeet.backend.repository.GroupRepository;
import org.springframework.stereotype.Service;
import com.wecanmeet.backend.model.Group;
import java.util.Optional;

@Service
public class GroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository){
        this.groupRepository = groupRepository;
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public Optional<Group> getGroupById(Long id) {
    return groupRepository.findById(id);
}

}
