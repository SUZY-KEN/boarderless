package com.example.boarderless.Entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="favorite")
@Data
public class Favorite {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;
	
	@OneToOne
	@JoinColumn(name="user_id")
	private User userId;
	
	@OneToOne
	@JoinColumn(name="spot_id")
	private Spot spotId;
	
	@Column(name="created_at")
	private Timestamp createdAt;

}
