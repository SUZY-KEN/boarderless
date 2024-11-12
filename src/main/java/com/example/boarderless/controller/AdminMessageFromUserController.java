package com.example.boarderless.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.boarderless.Entity.AdminMessageFromUser;
import com.example.boarderless.repository.AdminMessageFromUserRepository;
import com.example.boarderless.security.UserDetailsImpl;
import com.example.boarderless.service.MessageFromUserService;

@Controller
@RequestMapping("/admin/message")

public class AdminMessageFromUserController {

	final private AdminMessageFromUserRepository adminMessageFromUserRepository;
	final private MessageFromUserService messageFromUserService;
	
	public AdminMessageFromUserController(AdminMessageFromUserRepository adminMessageFromUserRepository,MessageFromUserService messageFromUserService)
	{
		this.adminMessageFromUserRepository=adminMessageFromUserRepository;
		this.messageFromUserService=messageFromUserService;
	}

	@GetMapping("/show")
	public String show(@PageableDefault(page=0,size=30,sort="id")Pageable pageable,Model model,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) 
	{
		if(userDetailsImpl!=null) {

			
		
			Page<AdminMessageFromUser> MessageFromUserPage=adminMessageFromUserRepository.findAll(pageable);
			long unReadAmount=adminMessageFromUserRepository.countByAlreadyRead(false);
			
			model.addAttribute("MessageFromAdminPage",MessageFromUserPage);
			model.addAttribute("unReadAmount",unReadAmount);
			
			
		};
		return  "admin/message/show";
	}
}
