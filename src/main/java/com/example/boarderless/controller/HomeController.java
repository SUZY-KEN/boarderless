package com.example.boarderless.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Repository.SpotRepository;

@Controller

public class HomeController {
	
	private final SpotRepository spotRepository;
	public HomeController(SpotRepository spotRepository)
	{
		this.spotRepository=spotRepository;
	}
	
	
	@GetMapping("/")
	public String index(Model model)
	{
		List<Spot> spotList=spotRepository.findAll();
		
		System.out.println(spotList);
		for(Spot spot : spotList)
		{
			System.out.println(spot);
		}
		
		model.addAttribute("spotList",spotList);
		return "index";
	}

}
