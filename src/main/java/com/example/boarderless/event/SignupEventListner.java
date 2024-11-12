package com.example.boarderless.event;

import java.util.UUID;

import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.example.boarderless.Entity.User;
import com.example.boarderless.service.VerificationTokenService;

@Component
public class SignupEventListner {

	private final VerificationTokenService verificationTokenService;
	private final JavaMailSender javaMailSender;
	
	public SignupEventListner(VerificationTokenService verificationTokenService,JavaMailSender javaMailSender)
	{
		this.verificationTokenService=verificationTokenService;
		this.javaMailSender=javaMailSender;
		
	}
	
	

	@EventListener
	private void onSignupEvent(SignupEvent signupEvent)
	{
		
		User user=signupEvent.getUser();
		String token=UUID.randomUUID().toString();
		verificationTokenService.createSignupToken(user, token);
		
		 String recipientAddress = user.getEmail();
         String subject = "[メール認証]boaderless.comにご登録いただきありがとうございます。";
         String confirmationUrl = signupEvent.getRequestUrl() + "/verify?token=" + token;
         String userName=user.getName()+"様";
         String message = "boaderless.comにご登録いただきありがとうございます。\n以下のリンクをクリックして会員登録を完了してください。";
         
         SimpleMailMessage mailMessage = new SimpleMailMessage(); 
         mailMessage.setTo(recipientAddress);
         mailMessage.setSubject(subject);
         mailMessage.setText(userName+"\n"+message + "\n" + confirmationUrl);
         javaMailSender.send(mailMessage);
     }
}
