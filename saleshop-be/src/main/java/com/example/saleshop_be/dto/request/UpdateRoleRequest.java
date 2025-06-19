package com.example.saleshop_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateRoleRequest {
    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 100, message = "Display name must be between 2 and 100 characters")
    private String displayName;
    private Boolean active;
    private List<Long> permissionIds;
}
