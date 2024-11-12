package com.example.boarderless.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
@RequestMapping("/editor")
public class EditorController {
	@Value("${spring.mail.username}")
	private String address;
	
	@GetMapping("/show")
	public String showEditor(Model model) {
		
		model.addAttribute("address", address);

		return "editor/show";
	}
}
