package com.example.boarderless.restcontroller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Repository.CategoryRepository;
import com.example.boarderless.Repository.SpotRepository;

@RestController
@RequestMapping("/map")
public class MapRestcontroller {
	
	private final SpotRepository spotRepository;
	private final CategoryRepository categoryRepository;
	
	public MapRestcontroller(SpotRepository spotRepository,CategoryRepository categoryRepository)
	{
		this.spotRepository=spotRepository;
		this.categoryRepository=categoryRepository;
	}
	
	@PostMapping("/list/marker")
	public List<Spot> listMarker (@RequestBody Map<String,Object>markerConfigData)
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
	
	

}

