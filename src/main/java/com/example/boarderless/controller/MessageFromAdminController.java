package com.example.boarderless.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.boarderless.Entity.MessageFromAdmin;
import com.example.boarderless.repository.MessageFromAdminRepository;
import com.example.boarderless.security.UserDetailsImpl;
import com.example.boarderless.service.MessageFromAdminService;


@Controller
@RequestMapping("/message")
public class MessageFromAdminController {
	final private MessageFromAdminRepository messageFromAdminRepository;
	final private MessageFromAdminService messageFromAdminService;
	
	public MessageFromAdminController(MessageFromAdminRepository messageFromAdminRepository,MessageFromAdminService messageFromAdminService)
	{
		this.messageFromAdminRepository=messageFromAdminRepository;
		this.messageFromAdminService=messageFromAdminService;
	}

	@GetMapping("/show")
	public String show(@PageableDefault(page=0,size=30,sort="id",direction=Direction.DESC)Pageable pageable,Model model,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) 
	{
		if(userDetailsImpl!=null) {

			
			//ユーザー多くなったら
//			while(messageFromAdminRepository.countByUserIdAndAlreadyRead(userDetailsImpl.getUser(),true)>150)//既読メッセージ150件まで保持
//			{
//			
//				messageFromAdminService.deleteMessageFromAdmin(userDetailsImpl.getUser());
//			};
//		
			Page<MessageFromAdmin> MessageFromAdminPage=messageFromAdminRepository.findAllByUserId(userDetailsImpl.getUser(),pageable);
			long unReadAmount=messageFromAdminRepository.countByUserIdAndAlreadyRead(userDetailsImpl.getUser(), false);
			
			model.addAttribute("MessageFromAdminPage",MessageFromAdminPage);
			model.addAttribute("unReadAmount",unReadAmount);
			
			
		};
		return  "message/show";
	}
	
@GetMapping("/change/read/all")
	public String changeReadAll(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl){
	List<MessageFromAdmin> messageList=messageFromAdminRepository.findAllByUserIdAndAlreadyReadOrderByIdDesc(userDetailsImpl.getUser(),false);
	
	for(MessageFromAdmin message : messageList) {
		message.setAlreadyRead(true);
		
		messageFromAdminRepository.save(message);
	}
	
	return "redirect:/message/show";
	}


@GetMapping("/delete/read/all")
public String deleteReadAll(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl){
List<MessageFromAdmin> messageList=messageFromAdminRepository.findAllByUserIdAndAlreadyReadOrderByIdDesc(userDetailsImpl.getUser(),true);

for(MessageFromAdmin message : messageList) {
	messageFromAdminRepository.delete(message);
}

return "redirect:/message/show";
}
	
}
