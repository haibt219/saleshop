package com.example.saleshop_be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "permissions")
public class Permission {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String name;

  @Column(nullable = false)
  private String displayName;

  @Column(nullable = false)
  private String module;

  @Column(nullable = false)
  private Boolean active = true;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @ManyToMany(mappedBy = "permissions")
  private List<Role> roles;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}
