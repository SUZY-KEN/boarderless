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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="spot")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Spot {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;
	
	@Column(name="lat")
	private Double lat;
	
	@Column(name="lng")
	private Double lng;
	
	
//	リレーションシップでつなぐ
	@Column(name="imagefile_id")
	private String imagefileId;
	
	@ManyToOne
	@JoinColumn(name="category_id")
	private Category categoryId; 
	
	@OneToOne
	@JoinColumn(name="user_id")
	private User userId;
	
	@Column(name="name")
	private String name;
	
	@Column(name="description")
	private String description;
	
	@Column(name="evalues")
	private Integer evalues;
	
	@Column(name="evalues_double")
	private Double evaluesDouble;
	
	@Column(name="price")
	private Integer price;
	
	@Column(name="enable")
	private Boolean enable;
	
	@Column(name="is_rejected")
	private Boolean isRejected;
	
	@Column(name="is_reported")
	private Boolean isReported;
	
	@Column(name="created_at")
	private Timestamp createdAt;
	
	
	
}


