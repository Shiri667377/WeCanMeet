package com.wecanmeet.backend.dto;

import java.time.LocalDate;

public class CreateGroupRequest {

    private String name;
    private String creatorName;
    private Integer minimumMeetingDuration;
    private LocalDate startDate;
    private LocalDate endDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public Integer getMinimumMeetingDuration() {
        return minimumMeetingDuration;
    }

    public void setMinimumMeetingDuration(Integer minimumMeetingDuration) {
        this.minimumMeetingDuration = minimumMeetingDuration;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}