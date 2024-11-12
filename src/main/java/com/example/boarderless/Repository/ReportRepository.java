package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Report;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;

public interface ReportRepository extends JpaRepository<Report, Integer> {
	public Report findBySpotIdAndUserId(Spot spotId,User userId);
	public List<Report> findBySpotId(Spot spotId);
	
}
