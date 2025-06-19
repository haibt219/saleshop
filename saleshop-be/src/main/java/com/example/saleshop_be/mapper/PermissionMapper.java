package com.example.saleshop_be.mapper;

import com.example.saleshop_be.dto.PermissionDTO;
import com.example.saleshop_be.entity.Permission;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(
        componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR
)
public interface PermissionMapper {

    PermissionDTO toDTO(Permission permission);

    List<PermissionDTO> toDTOList(List<Permission> permissions);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Permission toEntity(PermissionDTO dto);
}
