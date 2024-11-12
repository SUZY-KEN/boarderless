package com.example.boarderless.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.boarderless.Entity.Role;
import com.example.boarderless.Entity.User;
import com.example.boarderless.form.SignupForm;
import com.example.boarderless.repository.RoleRepository;
import com.example.boarderless.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	
	public UserService(UserRepository userRepository,RoleRepository roleRepository,PasswordEncoder passwordEncoder)
	{
		this.userRepository=userRepository;
		this.roleRepository=roleRepository;
		this.passwordEncoder=passwordEncoder;
	}
	
	//新規登録時
		@Transactional
		public User createUser(SignupForm signupForm)
		{
			User user=new User();
			Role role=roleRepository.findByRoleName("ROLE_GENERAL");
			
			user.setName(signupForm.getName());
			user.setEmail(signupForm.getEmail());
			user.setPassword(passwordEncoder.encode(signupForm.getPassword()));
			user.setRole(role);
			user.setEnabled(false);
			
			return userRepository.save(user);
		}
	
	//新規登録時メール整合
	public Boolean isEmailRegistered(String email)
	{
		User user=userRepository.findByEmail(email);
		return user!=null;
	}
	
	public Boolean isNameRegistered(String name)
	{
		User user=userRepository.findByName(name);
		return user!=null;
	}
	
	
	//パスワード整合
	 public boolean isSamePassword(String password, String confirmPassword) {
         return password.equals(confirmPassword);
     } 
	 
	 //メール照合
	  @Transactional
	     public void enableUser(User user) 
	  {
	   user.setEnabled(true); 
        userRepository.save(user);
	  }   
}
