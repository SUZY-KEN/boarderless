package com.example.boarderless.Entity;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="message_from_admin")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MessageFromAdmin {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private User userId;
	
	@Column(name="title")
	private String title;
	
	@Column(name="contents")
	private String contents;
	
	@Column(name="already_read")
	private Boolean alreadyRead;
	
	@Column(name="created_at")
	private Timestamp createdAt;
}
