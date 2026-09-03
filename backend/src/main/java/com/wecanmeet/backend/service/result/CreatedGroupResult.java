package com.wecanmeet.backend.service.result;

import com.wecanmeet.backend.dto.group.CreateGroupResponse;

public record CreatedGroupResult(
        CreateGroupResponse response,
        String adminToken
) {
}