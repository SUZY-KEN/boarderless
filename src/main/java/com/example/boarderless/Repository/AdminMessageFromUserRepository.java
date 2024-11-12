package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.AdminMessageFromUser;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;

public interface AdminMessageFromUserRepository extends JpaRepository<AdminMessageFromUser, Integer> {
	public long countByAlreadyRead(Boolean alreadyRead);
	public List<AdminMessageFromUser> findAllByUserIdAndAlreadyRead(User user,Boolean alreadyRead);
	public Page<AdminMessageFromUser>findAll(Pageable pageable);
	public List<AdminMessageFromUser> findBySpotId(Spot spotId);
}
