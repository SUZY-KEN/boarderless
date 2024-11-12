package com.example.boarderless.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{

	public User findByEmail(String email);
	public User findByEmailAndEnabled(String email,Boolean enabled);
	public User findByName(String name);
}
