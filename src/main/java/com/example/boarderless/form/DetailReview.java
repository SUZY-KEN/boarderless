package com.example.boarderless.form;

import com.example.boarderless.Entity.Spot;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DetailReview {
	private Spot spot;
	private Boolean isFavorite;
	private Boolean isReport;
	private String userName;
}
