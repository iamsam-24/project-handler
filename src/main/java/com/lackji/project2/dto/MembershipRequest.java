package com.lackji.project2.dto;

import java.util.UUID;

public class MembershipRequest {

    private UUID userId;

    private UUID orgId;



    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getOrgId() {
        return orgId;
    }

    public void setOrgId(UUID orgId) {
        this.orgId = orgId;
    }
}
