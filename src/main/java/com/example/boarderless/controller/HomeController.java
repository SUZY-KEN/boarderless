package com.example.boarderless.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Repository.CategoryRepository;
import com.example.boarderless.Repository.SpotRepository;

@Controller

public class HomeController {
	
	private final SpotRepository spotRepository;
	private final CategoryRepository categoryRepository;
	
	public HomeController(SpotRepository spotRepository,CategoryRepository categoryRepository)
	{
		this.spotRepository=spotRepository;
		this.categoryRepository=categoryRepository;
	}
	
	
	@GetMapping("/")
	public String index(Model model)
	{
		

		List<Category>categorylist=categoryRepository.findAll();
		
		
		
		model.addAttribute("categoryList",categorylist);
		return "index";
	}

}
