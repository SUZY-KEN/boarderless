package com.example.boarderless.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.repository.CategoryRepository;
import com.example.boarderless.repository.MessageFromAdminRepository;
import com.example.boarderless.repository.SpotRepository;
import com.example.boarderless.security.UserDetailsImpl;

@Controller

public class HomeController {
	@Value("${google.maps.api.key}")
	private String googleMapsApiKey;
	private final SpotRepository spotRepository;
	private final CategoryRepository categoryRepository;
	private final MessageFromAdminRepository messageFromAdminRepository;

	public HomeController(SpotRepository spotRepository, CategoryRepository categoryRepository,
			MessageFromAdminRepository messageFromAdminRepository) {

		this.spotRepository = spotRepository;
		this.categoryRepository = categoryRepository;
		this.messageFromAdminRepository = messageFromAdminRepository;
	}

	@GetMapping("/")
	public String index(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, Model model) {

		List<Category> categorylist = categoryRepository.findAll();

		model.addAttribute("googleMapsApiKey", googleMapsApiKey);
		model.addAttribute("categoryList", categorylist);
		return "index";
	}

}
