package com.example.boarderless.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Spot;

public interface SpotRepository extends JpaRepository<Spot, Integer>{
	public List<Spot>findAll();
	
}
