package com.example.boarderless.service;

import org.springframework.stereotype.Service;

import com.example.boarderless.Entity.User;
import com.example.boarderless.Entity.VerificationToken;
import com.example.boarderless.repository.VerificationTokenRepository;

import jakarta.transaction.Transactional;

@Service
public class VerificationTokenService {

private final VerificationTokenRepository verificationTokenRepository;
    
    
    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository) {        
        this.verificationTokenRepository = verificationTokenRepository;
    } 
    
    
//    トークンの生成
    @Transactional
    public void createSignupToken(User user, String token) {
        VerificationToken verificationToken = new VerificationToken();
        
        verificationToken.setUser(user);
        verificationToken.setToken(token);        
        
        verificationTokenRepository.save(verificationToken);
    }   
    
    //メール認証したトークンを探す
    public VerificationToken getVerificationToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }
}
