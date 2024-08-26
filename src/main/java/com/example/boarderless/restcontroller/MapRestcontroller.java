package com.example.boarderless.restcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Review;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Repository.CategoryRepository;
import com.example.boarderless.Repository.ReviewRepository;
import com.example.boarderless.Repository.SpotRepository;

@RestController
@RequestMapping("/map")
public class MapRestcontroller {
	
	private final SpotRepository spotRepository;
	private final CategoryRepository categoryRepository;
	private final ReviewRepository reviewRepository;
	
	
	public MapRestcontroller(SpotRepository spotRepository,CategoryRepository categoryRepository,
			ReviewRepository reviewRepository)
	{
		this.spotRepository=spotRepository;
		this.categoryRepository=categoryRepository;
		this.reviewRepository=reviewRepository;
	}
	
	@PostMapping("/marker/list")
	public List<Spot> createMarkerList (@RequestBody Map<String,Object>markerConfigData)
	{
		List<Spot>limitedByBoundSpotList=new ArrayList<Spot>();
		
		 Double minLat=(Double)markerConfigData.get("minLat");
	 Double maxLat=(Double)markerConfigData.get("maxLat");
		Double minLng=(Double)markerConfigData.get("minLng");
		Double maxLng=(Double)markerConfigData.get("maxLng");
	
	
		if(markerConfigData.get("categoryId")!=null)
		{
			
			
			try {
				Integer categoryId = Integer.valueOf(markerConfigData.get("categoryId").toString());
				Category cateogry=categoryRepository.getReferenceById((Integer)categoryId);
				

				limitedByBoundSpotList=spotRepository.findAllByLatBetweenAndLngBetweenAndCategoryId(minLat,maxLat,minLng,maxLng,cateogry);
			}catch (Exception e) {
				limitedByBoundSpotList=spotRepository.findAllByLatBetweenAndLngBetween(minLat,maxLat,minLng,maxLng);
			}
			
		}else
		{
			limitedByBoundSpotList=spotRepository.findAllByLatBetweenAndLngBetween(minLat,maxLat,minLng,maxLng);
		}
		
		
		
		System.out.println("displaySpotMarker:"+limitedByBoundSpotList);
		
		return limitedByBoundSpotList;
	}
	
	@GetMapping("/marker/detail")
	public Spot createMarker(@RequestParam Integer spotId)
	{
		System.out.println("markerDetail:spotId"+spotId);
		 
		return spotRepository.getReferenceById(spotId);
	}
	
	
	@GetMapping("/review/show")
	public List<Map<String,Object>>createReviewShow(@RequestParam Integer spotId)
	{
		List<Review>reviewList=reviewRepository.findAllBySpotId(spotRepository.getReferenceById(spotId));
		List<Map<String,Object>>reviewDataList=new ArrayList<Map<String,Object>>();
		
		System.out.println("reviewListl:"+reviewList);
		if(reviewList.isEmpty())
		{
			return null;
		}
		
		for(Review reviews:reviewList)
		{
			
			Map<String,Object>reviewData=new HashMap<String, Object>();
			reviewData.put("user_name", reviews.getUserId().getName());
			reviewData.put("evalues", reviews.getEvalues());
			reviewData.put("contents", reviews.getContents());
			
			reviewDataList.add(reviewData);
		}
		
		return reviewDataList;
	}

}

