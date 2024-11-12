package com.example.boarderless.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.boarderless.Entity.MessageFromAdmin;
import com.example.boarderless.Entity.Report;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;
import com.example.boarderless.repository.MessageFromAdminRepository;
import com.example.boarderless.repository.ReportRepository;
import com.example.boarderless.repository.SpotRepository;
import com.example.boarderless.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class MessageFromAdminService {
	final private MessageFromAdminRepository messageFromAdminRepository;
	final private SpotRepository spotRepository;
	final private UserRepository userRepository;
	final private ReportRepository reportRepository;
	
	public MessageFromAdminService(MessageFromAdminRepository messageFromAdminRepository,SpotRepository spotRepository,UserRepository userRepository,ReportRepository reportRepository) {
		this.messageFromAdminRepository=messageFromAdminRepository;
		this.spotRepository=spotRepository;
		this.userRepository=userRepository;
		this.reportRepository=reportRepository;
	}
	
	//SPOT承認メッセージの作成
	@Transactional
	public void createApproveSpotMessage(User user,Spot spot) {
		MessageFromAdmin message=new MessageFromAdmin();
		String spotUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString()+"/?spotId="+spot.getId();
		message.setUserId(user);
		message.setTitle("スポット:"+spot.getName()+"が承認されました");
		message.setContents("申請を頂いておりました"+spot.getName()+"をマップに反映いたしました。");
		message.setAlreadyRead(false);
		message.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		messageFromAdminRepository.save(message);
	}
	
	//SPOT承認メッセージの作成
		@Transactional
		public void createRejectSpotMessage(User user,Spot spot,String contents) {
			MessageFromAdmin message=new MessageFromAdmin();
			message.setUserId(user);
			message.setTitle("スポット:"+spot.getName()+"が申請拒否されました");
			message.setContents(contents);
			message.setAlreadyRead(false);
			message.setCreatedAt(new Timestamp(System.currentTimeMillis()));
			messageFromAdminRepository.save(message);
		}
	
	//メッセージの削除
		public void deleteMessageFromAdmin(User user)
		{
			
			
		        List<MessageFromAdmin> messages = messageFromAdminRepository.findAllByUserIdAndAlreadyReadOrderByIdAsc(user, true);
		        if (!messages.isEmpty()) {
		            MessageFromAdmin message = messages.get(0);
		            messageFromAdminRepository.delete(message);
		        }
        }
		
		
		//スポット削除メール
		public void deleteSpotMessage(Integer spotId)
		{
			System.out.println("spotdeleter:messagefromadmin");
			Spot spot=spotRepository.getReferenceById(spotId);
			User creator=spot.getUserId();
			
			MessageFromAdmin messageCreator=new MessageFromAdmin();
		
			
			messageCreator.setUserId(creator);
			messageCreator.setTitle("スポット:"+spot.getName()+"が削除されました");
			messageCreator.setContents(spot.getName()+"が削除されました。");
			messageCreator.setAlreadyRead(false);
			messageCreator.setCreatedAt(new Timestamp(System.currentTimeMillis()));
			messageFromAdminRepository.save(messageCreator);
			
			List<Report>  reportList=reportRepository.findBySpotId(spot);
			for(Report report : reportList) {
				User reporter=report.getUserId();
				
				MessageFromAdmin messageReporter=new MessageFromAdmin();
				messageReporter.setUserId(reporter);
				messageReporter.setTitle("スポット:"+spot.getName()+"が削除されました");
				messageReporter.setContents("御通報いただいておりました"+spot.getName()+"が削除されました。");
				messageReporter.setAlreadyRead(false);
				messageReporter.setCreatedAt(new Timestamp(System.currentTimeMillis()));
				messageFromAdminRepository.save(messageReporter);
				
				
			}
        }
	

}
