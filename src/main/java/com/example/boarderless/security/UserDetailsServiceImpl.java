package com.example.boarderless.security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.boarderless.Entity.User;
import com.example.boarderless.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

private UserRepository userRepository;
	
	public UserDetailsServiceImpl(UserRepository userRepository)
	{
		this.userRepository=userRepository;
	}

	//ユーザー認証
	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException
	{
		try {
			User user=userRepository.findByName(name);
			
			String userRoleName=user.getRole().getRoleName();
			
			Collection<GrantedAuthority>authorities=new ArrayList<>();
			
			authorities.add(new SimpleGrantedAuthority(userRoleName));
			System.out.println("ユーザ－情報:"+user);
			return new UserDetailsImpl(user,authorities );
		}
		catch(Exception e)
		{
			System.out.println("ユーザ－情報:");
			 throw new UsernameNotFoundException("ユーザーが見つかりませんでした。");
			 
		}
	}
	
	//ユーザー認証（メールアドレス）
//	@Override
//	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException
//	{
//		try {
//			User user=userRepository.findByEmail(email);
//			
//			String userRoleName=user.getRole().getRoleName();
//			
//			Collection<GrantedAuthority>authorities=new ArrayList<>();
//			
//			authorities.add(new SimpleGrantedAuthority(userRoleName));
//			System.out.println("ユーザ－情報:"+user);
//			return new UserDetailsImpl(user,authorities );
//		}
//		catch(Exception e)
//		{
//			System.out.println("ユーザ－情報:");
//			 throw new UsernameNotFoundException("ユーザーが見つかりませんでした。");
//			 
//		}
//	}
}
