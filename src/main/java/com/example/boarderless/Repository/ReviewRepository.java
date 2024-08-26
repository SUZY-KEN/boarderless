package com.example.boarderless.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Review;
import com.example.boarderless.Entity.Spot;

public interface ReviewRepository extends JpaRepository<Review, Integer>{

	public List<Review>findAllBySpotId(Spot spot);
}
