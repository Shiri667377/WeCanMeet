package com.wecanmeet.backend.service.result;

public record CreatedGroupResult(
        Long groupId,
        String adminToken
) {
}