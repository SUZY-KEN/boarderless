package com.example.boarderless.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Spot;
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
	public String index(@RequestParam(name="categoryId",required=false)Integer categoryId,Model model)
	{
		List<Spot> spotList=new ArrayList<Spot>();
		
		if(categoryId!=null)
		{
			spotList=spotRepository.findByCategoryId(categoryRepository.getReferenceById(categoryId));
		}
		else
		{
			spotList=spotRepository.findAll();
		}
		

		List<Category>categorylist=categoryRepository.findAll();
		System.out.println(spotList);
		
		model.addAttribute("spotList",spotList);
		model.addAttribute("categoryList",categorylist);
		return "index";
	}

}
