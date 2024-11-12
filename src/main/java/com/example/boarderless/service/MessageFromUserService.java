package com.example.boarderless.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.boarderless.Entity.AdminMessageFromUser;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;
import com.example.boarderless.repository.AdminMessageFromUserRepository;
import com.example.boarderless.repository.MessageFromUserCategoryRepository;
import com.example.boarderless.repository.SpotRepository;

import jakarta.transaction.Transactional;

@Service
public class MessageFromUserService {

	private final AdminMessageFromUserRepository adminMessageFromUserRepository;
	private final SpotRepository spotRepository;
	private final MessageFromUserCategoryRepository messageFromUserCategoryRepository;
	
	
	public MessageFromUserService(AdminMessageFromUserRepository adminMessageFromUserRepository,SpotRepository spotRepository
			,MessageFromUserCategoryRepository messageFromUserCategoryRepository) {
		this.adminMessageFromUserRepository=adminMessageFromUserRepository;
		this.spotRepository=spotRepository;
		this.messageFromUserCategoryRepository=messageFromUserCategoryRepository;
	}
	
	@Transactional
	public void registerReportMessage(User userId,Spot spotId,String contents) {
		System.out.println(messageFromUserCategoryRepository.getReferenceById(2));
		System.out.println("id"+userId+spotId+contents);
		AdminMessageFromUser adminMessageFromUser=new AdminMessageFromUser();
		adminMessageFromUser.setUserId(userId);
		adminMessageFromUser.setSpotId(spotId);
		adminMessageFromUser.setContents(contents);
		adminMessageFromUser.setTitle(spotId.getName()+"の通報");
		adminMessageFromUser.setAlreadyRead(false);
		adminMessageFromUser.setCategoryId(messageFromUserCategoryRepository.getReferenceById(2));
		adminMessageFromUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		adminMessageFromUserRepository.save(adminMessageFromUser);
		
	}
	
	//reportされたスポットに関するメッセージの削除
	public void deleteReportMessage(Integer spotId) {
		Spot spot =spotRepository.getReferenceById(spotId);
		List<AdminMessageFromUser>  messageList=adminMessageFromUserRepository.findBySpotId(spot);
		for(AdminMessageFromUser message :messageList) {
			adminMessageFromUserRepository.delete(message);
		}
	}
	
	
	
}
