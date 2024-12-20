package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer>{

	
	public List<Category>findAll();
	
}

