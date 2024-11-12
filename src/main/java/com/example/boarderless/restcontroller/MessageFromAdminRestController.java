package com.example.boarderless.restcontroller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.boarderless.Entity.MessageFromAdmin;
import com.example.boarderless.repository.MessageFromAdminRepository;
import com.example.boarderless.security.UserDetailsImpl;

@RestController
@RequestMapping("/message/user")
public class MessageFromAdminRestController {
	private final MessageFromAdminRepository messageFromAdminRepository;
	
	public MessageFromAdminRestController(MessageFromAdminRepository messageFromAdminRepository)
	{
		this.messageFromAdminRepository=messageFromAdminRepository;
	}
	

	@GetMapping("/show/badge")
	public long showBadge(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		long count=messageFromAdminRepository.countByUserIdAndAlreadyRead(userDetailsImpl.getUser(), false);
		System.out.println("/show/badge");
		return count;
	}
	
	@GetMapping("/change/read")
	public void changeMessageRead(@RequestParam Integer messageId)
	{
		System.out.println("/change/read");
		MessageFromAdmin message=messageFromAdminRepository.getReferenceById(messageId);
		message.setAlreadyRead(true);
		messageFromAdminRepository.save(message);
		
	}
	
	@GetMapping("/delete/message/read")
	public void deleteMessageRead(@RequestParam Integer messageId)
	{ 
		System.out.println("/delete/message/read");
		MessageFromAdmin message=messageFromAdminRepository.getReferenceById(messageId);
		
		messageFromAdminRepository.delete(message);
		
	}
	
	
}
