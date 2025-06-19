package com.example.saleshop_be.mapper;

import com.example.saleshop_be.dto.RoleDTO;
import com.example.saleshop_be.dto.request.CreateRoleRequest;
import com.example.saleshop_be.dto.request.UpdateRoleRequest;
import com.example.saleshop_be.entity.Role;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(
    componentModel = "spring",
    uses = {PermissionMapper.class},
    injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface RoleMapper {

  @Mapping(target = "userCount", source = "users", qualifiedByName = "usersToCount")
  RoleDTO toDTO(Role role);

  @Mapping(target = "userCount", ignore = true)
  List<RoleDTO> toDTOList(List<Role> roles);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "users", ignore = true)
  @Mapping(target = "permissions", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "active", constant = "true")
  @Mapping(target = "name", source = "name", qualifiedByName = "upperCaseName")
  Role toEntity(CreateRoleRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "name", ignore = true)
  @Mapping(target = "users", ignore = true)
  @Mapping(target = "permissions", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  void updateEntityFromRequest(UpdateRoleRequest request, @MappingTarget Role role);

  @Named("usersToCount")
  default Integer usersToCount(List<?> users) {
    return users != null ? users.size() : 0;
  }

  @Named("upperCaseName")
  default String upperCaseName(String name) {
    return name != null ? name.toUpperCase() : null;
  }
}
