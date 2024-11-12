package com.example.boarderless.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

//	 @Bean
//	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//		 http.csrf().disable();
//		 
//		 return http.build();
//	 }
	 
	  @Autowired
	    private CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
	
	  
	  @Autowired
	    private DataSource dataSource;

		@Bean
		public SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
			  http
	          .authorizeHttpRequests((requests) -> requests                
	              .requestMatchers("/css/**", "/","/image/**","/spotImageStorage/**", "/js/**","/signup","/signup/verify","/map/general/**","/editor/**","/info/**").permitAll()  // すべてのユーザーにアクセスを許可するURL           
	              .requestMatchers("/admin/**","/admin/user/show").hasRole("ADMIN")  // 管理者にのみアクセスを許可するURL
	              .anyRequest().authenticated()                   // 上記以外のURLはログインが必要（会員または管理者のどちらでもOK）
	          )
			
	          .formLogin((form) -> form
	                  .loginPage("/login")              // ログインページのURL
	                  .loginProcessingUrl("/login")     // ログインフォームの送信先URL
	                  .successHandler(customAuthenticationSuccessHandler)  // ログイン成功時のリダイレクト先URL
	                  .failureUrl("/login?error")       // ログイン失敗時のリダイレクト先URL
	                  .permitAll()
	              )
	          
	          .logout((logout) -> logout
	                  .logoutSuccessUrl("/?loggedOut")  // ログアウト時のリダイレクト先URL
	                  .permitAll()
	        	)
	          .rememberMe((rememberMe) -> rememberMe  
	                  .tokenRepository(persistentTokenRepository())
	                  .tokenValiditySeconds(14 * 24 * 60 * 60)//14日
	                  .key("uniqueAndSecretKey")
	              );
	         
			  http.csrf().disable();
	             
			
			  
			return http.build();
		}
		
		 @Bean
		    public PersistentTokenRepository persistentTokenRepository() {
		        JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
		        tokenRepository.setDataSource(dataSource);  
		        return tokenRepository;
		    }
		
		 @Bean
	     public PasswordEncoder passwordEncoder() {
	         return new BCryptPasswordEncoder();
	     }
	 
}

