package com.example.boarderless.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{

}
