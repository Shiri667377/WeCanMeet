package com.wecanmeet.backend.dto.group;

public class CreateGroupResponse {

    private Long id;

    public CreateGroupResponse(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}