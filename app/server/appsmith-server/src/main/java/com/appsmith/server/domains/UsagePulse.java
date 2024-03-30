package com.appsmith.server.domains;

import com.appsmith.external.models.BaseDomain;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Getter
@Setter
@Entity
@Where(clause = "deleted_at IS NULL")
public class UsagePulse extends BaseDomain {

    private String email;

    // Hashed user email
    private String user;
    private String instanceId;
    private String tenantId;
    private Boolean viewMode;
    private Boolean isAnonymousUser;
}
