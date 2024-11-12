package com.example.boarderless.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.boarderless.Entity.User;

public class UserDetailsImpl implements UserDetails {

	
	private final User user;
	private final Collection<GrantedAuthority> authorities;
	
	public UserDetailsImpl(User user,Collection<GrantedAuthority> authorities)
	{
		this.user=user;
		this.authorities=authorities;
	}
	
	 public User getUser() {
		 
         return user;
     }
	 
	 @Override
	 public String getPassword()
	 {
		 System.out.println("Getting Password: " + user.getPassword());
		 return user.getPassword();
	 }
	 
	 @Override
	 public String getUsername()
	 {
	    	System.out.println("Getting Name: " + user.getName());

		 return user.getName();
	 }
	 
	 @Override
     public Collection<? extends GrantedAuthority> getAuthorities() {
    	 System.out.println("Getting Authorities: " + authorities);

         return authorities;
     }
	 
	 // アカウントが期限切れでなければtrueを返す
     @Override
     public boolean isAccountNonExpired() {
         return true;
     }
     
     // ユーザーがロックされていなければtrueを返す
     @Override
     public boolean isAccountNonLocked() {
         return true;
     }    
     
     // ユーザーのパスワードが期限切れでなければtrueを返す
     @Override
     public boolean isCredentialsNonExpired() {
         return true;
     }
     
     @Override
     public boolean isEnabled() {
         return user.getEnabled();
     }
}
