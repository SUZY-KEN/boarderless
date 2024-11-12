package com.example.boarderless.form;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupForm {
	@NotBlank(message="ニックネームを入力してください。")
	@Length(max=20,message="20文字以内で入力してください")
	private String name;
	
	@NotBlank(message = "メールアドレスを入力してください")
	@Email(message="メールアドレスは正しい形式で入力してください")
	private String email;
	
	@NotBlank(message = "パスワードを入力してください")
	@Length(min=8,message = "パスワードは8文字以上で入力してください")
	private String password;
	
	@NotBlank(message="確認用パスワードを入力してください")
	private String confirmPassword;
}
