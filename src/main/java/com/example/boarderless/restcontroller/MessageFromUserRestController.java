package com.example.boarderless.restcontroller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.boarderless.Entity.AdminMessageFromUser;
import com.example.boarderless.repository.AdminMessageFromUserRepository;
import com.example.boarderless.security.UserDetailsImpl;

@RestController
@RequestMapping("/admin/message")
public class MessageFromUserRestController {
	
private final AdminMessageFromUserRepository adminMessageFromUserRepository;
	
	public MessageFromUserRestController(AdminMessageFromUserRepository adminMessageFromUserRepository)
	{
		this.adminMessageFromUserRepository=adminMessageFromUserRepository;
	}

	
	@GetMapping("/show/badge")
	public long showBadge(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		long count=adminMessageFromUserRepository.countByAlreadyRead(false);
		System.out.println("/show/badge");
		return count;
	}
	
	
	@GetMapping("/change/read")
	public void changeMessageRead(@RequestParam Integer messageId)
	{
		System.out.println("/change/read");
		AdminMessageFromUser message=adminMessageFromUserRepository.getReferenceById(messageId);
		message.setAlreadyRead(true);
		adminMessageFromUserRepository.save(message);
		
	}
	
	@GetMapping("/delete/message/read")
	public void deleteMessageRead(@RequestParam Integer messageId)
	{ 
		System.out.println("/delete/message/read");
		AdminMessageFromUser message=adminMessageFromUserRepository.getReferenceById(messageId);
		
		adminMessageFromUserRepository.delete(message);
		
	}
}
