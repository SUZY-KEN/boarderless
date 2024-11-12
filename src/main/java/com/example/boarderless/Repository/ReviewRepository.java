package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Review;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;

public interface ReviewRepository extends JpaRepository<Review, Integer>{

	public List<Review>findAllBySpotId(Spot spot);
	
	
	public Long countBySpotId(Spot spotId);
	public Long countBySpotIdAndEvalues(Spot spotId,Integer evalues);
	public Review findByUserIdAndSpotId(User userid,Spot spotId);
	
	
	
}
