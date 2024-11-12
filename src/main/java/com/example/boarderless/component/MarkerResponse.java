package com.example.boarderless.component;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.boarderless.Entity.Spot;

@Component
public class MarkerResponse {
	  private List<Spot> limitedByBoundSpotList;
	    private List<Spot> limitedByBoundSpotListForReviewer;

	    // コンストラクタ
	    public MarkerResponse(List<Spot> limitedByBoundSpotList, List<Spot> limitedByBoundSpotListForReviewer) {
	        this.limitedByBoundSpotList = limitedByBoundSpotList;
	        this.limitedByBoundSpotListForReviewer = limitedByBoundSpotListForReviewer;
	    }

	    // Getter and Setter
	    public List<Spot> getLimitedByBoundSpotList() {
	        return limitedByBoundSpotList;
	    }

	    public void setLimitedByBoundSpotList(List<Spot> limitedByBoundSpotList) {
	        this.limitedByBoundSpotList = limitedByBoundSpotList;
	    }

	    public List<Spot> getLimitedByBoundSpotListForReviewer() {
	        return limitedByBoundSpotListForReviewer;
	    }

	    public void setLimitedByBoundSpotListForReviewer(List<Spot> limitedByBoundSpotListForReviewer) {
	        this.limitedByBoundSpotListForReviewer = limitedByBoundSpotListForReviewer;
	    }
}
