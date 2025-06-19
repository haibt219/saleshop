package com.example.saleshop_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionDTO {
    private Long id;
    private String name;
    private String displayName;
    private String description;
    private String module;
    private Boolean active;
    private LocalDateTime createdAt;
}
