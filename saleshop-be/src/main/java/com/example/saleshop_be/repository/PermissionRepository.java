package com.example.saleshop_be.repository;

import com.example.saleshop_be.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

  Optional<Permission> findByName(String name);

  List<Permission> findByModule(String module);

  List<Permission> findByActiveTrue();
}
