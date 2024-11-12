package com.example.boarderless.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

	public Role findByRoleName(String roleName);
}
