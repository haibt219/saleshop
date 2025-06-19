package com.example.saleshop_be.repository;

import com.example.saleshop_be.entity.Role;
import com.example.saleshop_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(String username);

  Optional<User> findByUsernameAndActiveTrue(String username);

  List<User> findByRole(Role role);

  List<User> findByActiveTrue();

  @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.active = true")
  List<User> findByRoleNameAndActiveTrue(String roleName);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);
}
