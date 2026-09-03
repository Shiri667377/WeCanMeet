package com.wecanmeet.backend.dto.group;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class GroupResponse {

    private Long id;
    private String name;
    private String creatorName;
    private Integer minimumMeetingDuration;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
    private LocalDateTime createdAt;

    public GroupResponse(
            Long id,
            String name,
            String creatorName,
            Integer minimumMeetingDuration,
            LocalDate startDate,
            LocalDate endDate,
            boolean active,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.creatorName = creatorName;
        this.minimumMeetingDuration = minimumMeetingDuration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public Integer getMinimumMeetingDuration() {
        return minimumMeetingDuration;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}