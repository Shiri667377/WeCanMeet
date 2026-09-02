package com.wecanmeet.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String creatorName;

    private Integer minimumMeetingDuration;
    private LocalDate startDate;
    private LocalDate endDate;

    private boolean active = true;

    private LocalDateTime createdAt;
    private String adminTokenHash;

    public Group() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Group(String name, String creatorName) {
        this.name = name;
        this.creatorName = creatorName;
    }

    public Long getId() {
        return id;
    }

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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAdminTokenHash() {
        return adminTokenHash;
    }

    public void setAdminTokenHash(String adminTokenHash) {
        this.adminTokenHash = adminTokenHash;
    }
}
