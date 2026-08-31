package com.wecanmeet.backend.repository;

import com.wecanmeet.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {
    
}
