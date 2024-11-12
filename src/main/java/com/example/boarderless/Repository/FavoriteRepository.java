package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Favorite;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer>{

	public Favorite findBySpotIdAndUserId(Spot spotId,User userId);
	public List<Favorite> findByUserId(User userId);
}
