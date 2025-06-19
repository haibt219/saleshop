package com.example.saleshop_be.repository;

import com.example.saleshop_be.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByName(String name);

  Optional<Role> findByNameIgnoreCase(String name);

  List<Role> findByActiveTrue();

  @Query("SELECT r FROM Role r WHERE r.active = true ORDER BY r.name")
  List<Role> findAllActiveRoles();

  boolean existsByName(String name);
}
