package com.example.boarderless.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.VerificationToken;

public interface VerificationTokenRepository  extends JpaRepository<VerificationToken, Integer>{
	 public VerificationToken findByToken(String token);
}
