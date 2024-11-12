package com.example.boarderless.controller;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.boarderless.Entity.User;
import com.example.boarderless.Entity.VerificationToken;
import com.example.boarderless.event.SignupEventPublisher;
import com.example.boarderless.form.SignupForm;
import com.example.boarderless.security.UserDetailsServiceImpl;
import com.example.boarderless.service.UserService;
import com.example.boarderless.service.VerificationTokenService;

import jakarta.servlet.http.HttpServletRequest;

@Controller

public class AuthController {
	private final UserService userService;
	private final SignupEventPublisher signupEventPublisher;
	private final VerificationTokenService verificationTokenService;
	private final UserDetailsServiceImpl userDetailsServiceImpl;
	
	public AuthController(UserService userService,SignupEventPublisher signupEventPublisher,
			VerificationTokenService verificationTokenService,UserDetailsServiceImpl userDetailsServiceImpl)
	{
		this.userService=userService;
		this.signupEventPublisher=signupEventPublisher;
		this.verificationTokenService=verificationTokenService;
		this.userDetailsServiceImpl=userDetailsServiceImpl;

	}
	
	

	 @GetMapping("/login")
	 public String login()
	 {
		 
		 return "auth/login";
	 }
	
	@GetMapping("/signup")
	public String signup(Model model)
	{
		model.addAttribute("signupForm",new SignupForm());
		return "auth/signup";
	}
	

	@PostMapping("/signup")
	public String signup(@ModelAttribute @Validated SignupForm signupForm,BindingResult bindingResult,RedirectAttributes redirectAttributes,HttpServletRequest httpServletRequest)
	{
		 if(userService.isNameRegistered(signupForm.getName()))
		 {
			  FieldError fieldError=new FieldError(bindingResult.getObjectName(), "name", "ニックネームは使用されています。");
			  bindingResult.addError(fieldError);
		 }
		 
		 if(userService.isEmailRegistered(signupForm.getEmail()))
			 {
				  FieldError fieldError=new FieldError(bindingResult.getObjectName(), "email", "すでに登録済みのメールアドレスです。");
				  bindingResult.addError(fieldError);
			 }
		 
		 if((signupForm.getPassword()!=null||signupForm.getConfirmPassword()!=null)&&!userService.isSamePassword(signupForm.getPassword(), signupForm.getConfirmPassword()))
		 {
			 FieldError fieldError=new FieldError(bindingResult.getObjectName(), "password", "パスワードが一致しません。");
		  		bindingResult.addError(fieldError);
		 }
		 
		 if(bindingResult.hasErrors())
		 {
			 return "auth/signup";
		 }
		 
		 System.out.println("signupPOST:SUCCESS");
		 
		 User user=userService.createUser(signupForm);
		 
		 String requestUrl = new String(httpServletRequest.getRequestURL());
		 
         signupEventPublisher.publishSignupEvent(user, requestUrl);
         
         
		 redirectAttributes.addFlashAttribute("successMessage","ご入力いただいたメールアドレスに認証メールを送信しました。メールに記載されているリンクをクリックし、会員登録を完了してください。");
		 
		 return "redirect:";
		
	

//	@PostMapping("/signup")
//	public String signup(@ModelAttribute @Validated SignupForm signupForm,BindingResult bindingResult,RedirectAttributes redirectAttributes,HttpServletRequest httpServletRequest)
//	{
//		 if(userService.isEmailRegistered(signupForm.getEmail()))
//		 {
//			  FieldError fieldError=new FieldError(bindingResult.getObjectName(), "email", "すでに登録済みのメールアドレスです。");
//			  bindingResult.addError(fieldError);
//		 }
//		 
//		 if((signupForm.getPassword()!=null||signupForm.getConfirmPassword()!=null)&&!userService.isSamePassword(signupForm.getPassword(), signupForm.getConfirmPassword()))
//		 {
//			 FieldError fieldError=new FieldError(bindingResult.getObjectName(), "password", "パスワードが一致しません。");
//		  		bindingResult.addError(fieldError);
//		 }
//		 
//		 if(bindingResult.hasErrors())
//		 {
//			 return "auth/signup";
//		 }
//		 
//		 System.out.println("signupPOST:SUCCESS");
//		 
//		 User user=userService.createUser(signupForm);
//		 
//		 String requestUrl = new String(httpServletRequest.getRequestURL());
//		 
//         signupEventPublisher.publishSignupEvent(user, requestUrl);
//         
//         
//		 redirectAttributes.addFlashAttribute("successMessage","ご入力いただいたメールアドレスに認証メールを送信しました。メールに記載されているリンクをクリックし、会員登録を完了してください。");
//		 
//		 return "redirect:";
//		
	}
	
	 @GetMapping("/signup/verify")
     public String verify(@RequestParam(name = "token") String token, Model model) {
         VerificationToken verificationToken = verificationTokenService.getVerificationToken(token);
         
         System.out.println("verification:Entry");
         if (verificationToken != null) {
             User user = verificationToken.getUser();  
             userService.enableUser(user);
             System.out.println("verification:SUCCESS");
             // 認証情報を設定
             UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(user.getEmail());
             UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,userDetails.getClass(),userDetails.getAuthorities());
             SecurityContextHolder.getContext().setAuthentication(authentication);

             // ログイン成功後のリダイレクト先
             return "redirect:/?loggedIn"; // 成功ハンドラーでリダイレクトされるURL         
         } else {
             String errorMessage = "トークンが無効です。";
             model.addAttribute("errorMessage", errorMessage);
         }
         
         return "auth/verify";         
     }    
	 
}

