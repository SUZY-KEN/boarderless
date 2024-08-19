package com.example.boarderless.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Spot;

public interface SpotRepository extends JpaRepository<Spot, Integer>{
	public List<Spot>findAll();
	
	public List<Spot>findAllByLatBetweenAndLngBetween(Double latmin,Double latmax,Double lngmin,Double lngmax);
	public List<Spot>findAllByLatBetweenAndLngBetweenAndCategoryId(Double latmin,Double latmax,Double lngmin,Double lngmax,Category category);
}
