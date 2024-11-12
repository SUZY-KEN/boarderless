package com.example.boarderless.restcontroller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Favorite;
import com.example.boarderless.Entity.Report;
import com.example.boarderless.Entity.Review;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;
import com.example.boarderless.component.MarkerResponse;
import com.example.boarderless.form.DetailReview;
import com.example.boarderless.repository.CategoryRepository;
import com.example.boarderless.repository.FavoriteRepository;
import com.example.boarderless.repository.ReportRepository;
import com.example.boarderless.repository.ReviewRepository;
import com.example.boarderless.repository.SpotRepository;
import com.example.boarderless.repository.UserRepository;
import com.example.boarderless.security.UserDetailsImpl;
import com.example.boarderless.service.MessageFromUserService;
import com.example.boarderless.service.SpotService;

@RestController
@RequestMapping("/map")
public class MapRestcontroller {
	
	private final SpotRepository spotRepository;
	private final CategoryRepository categoryRepository;
	private final ReviewRepository reviewRepository;
	private final UserRepository userRepository;
	private final FavoriteRepository favoriteRepository;
	private final ReportRepository reportRepository;
	private final SpotService spotService;
	private final MessageFromUserService messageFromUserService;
	
	
	public MapRestcontroller(SpotRepository spotRepository,CategoryRepository categoryRepository,
			ReviewRepository reviewRepository,UserRepository userRepository,FavoriteRepository favoriteRepository,
			ReportRepository reportRepository,SpotService spotService,MessageFromUserService messageFromUserService)
	{
		this.spotRepository=spotRepository;
		this.categoryRepository=categoryRepository;
		this.reviewRepository=reviewRepository;
		this.userRepository=userRepository;
		this.favoriteRepository=favoriteRepository;
		this.reportRepository=reportRepository;
		this.spotService=spotService;
		this.messageFromUserService=messageFromUserService;
	}
	
	
	
	@PostMapping("/general/marker/list")
	public MarkerResponse  createMarkerList (@RequestBody Map<String,Object>markerConfigData,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		System.out.println("createMarkerList");
		System.out.println("f:"+markerConfigData.get("sortFavorite"));
		System.out.println("c:"+markerConfigData.get("sortCreatedAt"));
		System.out.println("zoom:"+markerConfigData.get("zoomLevel"));
		System.out.println("sortFavorite:"+markerConfigData.get("sortFavorite"));
		List<Spot>limitedByBoundSpotList=new ArrayList<Spot>();
		List<Spot>limitedByBoundSpotListForReviewer=new ArrayList<Spot>();

		
		 Double minLat=(Double)markerConfigData.get("minLat");
		 Double maxLat=(Double)markerConfigData.get("maxLat");
		Double minLng=(Double)markerConfigData.get("minLng");
		Double maxLng=(Double)markerConfigData.get("maxLng");
		Integer zoomLevel=Integer.valueOf(markerConfigData.get("zoomLevel").toString());
		
		
		
		
		
		
		

		if(markerConfigData.get("sortFavorite").equals(true))//	favorite分岐
		{
			
			 List<Favorite> favoriteList=favoriteRepository.findByUserId(userDetailsImpl.getUser());
			 
			 for (Favorite favorite : favoriteList) {
				 
				 
				 
		            limitedByBoundSpotList.add(favorite.getSpotId());
		        }
		

		}else if(markerConfigData.get("sortMySpot").equals(true)) //myspot分岐
		{
			limitedByBoundSpotList=spotRepository.findAllByUserIdAndEnableOrderByEvaluesDoubleDesc(userDetailsImpl.getUser(), true);
		}else if(markerConfigData.get("sortReportBox").equals(true))
		{
			limitedByBoundSpotList=spotRepository.findAllByEnableAndIsReported(true,true);
		}else {	
			limitedByBoundSpotList=spotRepository.findTop700ByLatBetweenAndLngBetweenAndEnableOrderByEvaluesDoubleDesc(minLat,maxLat,minLng,maxLng,true);//最大７００件		
		}

		
		
		System.out.println("sliceCate");
		//該当カテゴリーではないものをスライスする
		if(markerConfigData.get("categoryId")!=null)
		{
		 try {
				Integer categoryId = Integer.valueOf(markerConfigData.get("categoryId").toString());
				Category category=categoryRepository.getReferenceById(categoryId);
				
				 Iterator<Spot> iterator = limitedByBoundSpotList.iterator();
		            while (iterator.hasNext()) {
		                Spot spot = iterator.next();
		                if (spot.getCategoryId()==null||!spot.getCategoryId().equals(category)) {
		                    iterator.remove(); // 安全にリストから削除
	                }
		                
		                
	            }
		            System.out.println("sliceCate:OK");
		            
			}catch (Exception e) {
				 e.printStackTrace();
		            System.out.println("sliceCate:Error:"+Integer.valueOf(markerConfigData.get("categoryId").toString()));

			}

		}
		
		
		
		
		limitedByBoundSpotListForReviewer=new ArrayList<>(limitedByBoundSpotList);//レビュアーのスポットリストへ転写

		
	
			
		//描写しているマーカーをリストから削除		 
		 List<Map<String,Object>> markerDataList = (List<Map<String,Object>>)markerConfigData.get("markerDataList");
		 List<Integer>markerId=new ArrayList<Integer>();
		 Integer countIterate=0;
		 for(Map<String,Object> marker : markerDataList)
		 {
			 
			 markerId.add((Integer)marker.get("id"));

		 }
		
		 System.out.println("beforeIterate:limitedByBoundSpotList:"+limitedByBoundSpotList);
		    // limitedByBoundSpotListからmarkerDataListのIDと一致するスポットを削除
		    Iterator<Spot> iterator = limitedByBoundSpotList.iterator();
		    while (iterator.hasNext()) {
		    	
		        Spot spot = iterator.next();
		       
		        if (markerId.contains(spot.getId())) {
		            iterator.remove(); // 安全にリストから削除
		            countIterate++;
		        }
		    }
		    System.out.println("afterIterate:count:"+countIterate);
			 System.out.println("afterIterate:limitedByBoundSpotList:"+limitedByBoundSpotList);

		
		
	
		
//	createdAt並び替え
		if(markerConfigData.get("sortCreatedAt").equals(true)) {
			limitedByBoundSpotListForReviewer.sort(Comparator.comparing(Spot::getCreatedAt).reversed());
		}

		
		if (limitedByBoundSpotListForReviewer.size() > 100) {
			limitedByBoundSpotListForReviewer= limitedByBoundSpotListForReviewer.subList(0, 100);
	    }
		
		System.out.println("レビュアーの数:"+limitedByBoundSpotListForReviewer.size());
		
	    return new MarkerResponse(limitedByBoundSpotList, limitedByBoundSpotListForReviewer);
	}
	
	
	
	@GetMapping("/general/marker/detail")
	public DetailReview createMarker(@RequestParam Integer spotId,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		System.out.println("map/general/marker/detail:markerDetail:spotId"+spotId);
		
		Boolean isFavorite;
		Boolean isReport;
		
		Spot spot=spotRepository.getReferenceById(spotId);
		String userName=spot.getUserId().getName();
		if(userDetailsImpl!=null) {
			Integer userId=userDetailsImpl.getUser().getId();
			
			if(favoriteRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId))!=null) {
				isFavorite=true;
			}else {
				isFavorite=false;
			}
			
			if(reportRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId))!=null) {
				isReport=true;
			}else {
				isReport=false;
			}

			
			
			
		}else {
			isFavorite=false;
			isReport=false;

		}
		

		 
		if (spot != null) {
	        return new DetailReview(spot, isFavorite, isReport,userName);
	    } else {
	        throw new RuntimeException("Spot not found with ID: " + spotId); // Spotが見つからない場合
	    }
	}
	
	@GetMapping("/general/marker/approve")
	public Boolean isApprovedSpot(@RequestParam Integer spotId)
	{
		Spot spot=spotRepository.getReferenceById(spotId);
		System.out.println(spotId+":approve:"+spot.getEnable());
		
		 
		return spot.getEnable();
	}
	
	
	@GetMapping("/general/review/show")
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
	
	@GetMapping("/general/review/statics")
	public Map<String,Object>createReviewStatics(@RequestParam Integer spotId)
	{
		
		
		Map<String,Object>staticsData=new HashMap<String, Object>();
		
		Spot spot=spotRepository.getReferenceById(spotId);
		Long allReviewCount=reviewRepository.countBySpotId(spot);
		Double ave=spotRepository.getReferenceById(spotId).getEvaluesDouble();
		
		
		if(allReviewCount==0)
		{
			return null;
		}
		staticsData.put("none",reviewRepository.countBySpotIdAndEvalues(spot, 0));
		staticsData.put("single",reviewRepository.countBySpotIdAndEvalues(spot, 1));
		staticsData.put("double",reviewRepository.countBySpotIdAndEvalues(spot, 2));
		staticsData.put("triple",reviewRepository.countBySpotIdAndEvalues(spot, 3));
		staticsData.put("fourth",reviewRepository.countBySpotIdAndEvalues(spot, 4));
		staticsData.put("fifth",reviewRepository.countBySpotIdAndEvalues(spot, 5));
		staticsData.put("all",allReviewCount);
		staticsData.put("ave",ave);
		
		
		return staticsData;
	}
	
	@PostMapping("/general/pos")
	public  Map<String,Object>createPos(@RequestBody Integer spotId)
	{
		Map<String,Object>latlng=new HashMap<String, Object>();
		
		Spot spot=spotRepository.findByIdAndEnable(spotId, true);
		
		if(spot!=null)
		{
			latlng.put("lat", spot.getLat());
			latlng.put("lng", spot.getLng());
		}else {
			latlng=null;
		}
		
		return latlng;
	}
	
	@GetMapping("/permit/authenticUser")
	public Integer authenticUser(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		Integer userId=userDetailsImpl.getUser().getId();
		System.out.println("authenticUser:userId:"+userId);
		return userId;
	}
	
	//spot情報のSQL登録処理
		@PostMapping("/permit/spot/register")
		public Map<String,Object> spotRegister(@RequestParam("spotName") String spotName,
        @RequestParam("spotLatPos") Double spotLatPos,
        @RequestParam("spotLngPos") Double spotLngPos,
        @RequestParam("spotUserId") Integer spotUserId,
        @RequestParam(value = "spotPriceAmount", required = false) String spotPriceAmount,
        @RequestParam(value = "spotDescription", required = false) String spotDescription,
        @RequestParam(value = "spotCategory", required = false) Integer spotCategory,
        @RequestParam(value="spotIsPrice",required = false)String spotIsPrice,
        @RequestParam(value = "spotImage", required = false) MultipartFile spotImage)
	    {
			
			System.out.println(spotImage);		
			
			Map<String,Object> validate=spotService.validateRegisterSpotForm(spotName, spotPriceAmount, spotDescription, spotCategory, spotImage,spotIsPrice);
			
			if(validate.isEmpty())
			{
				spotService.create(spotName, spotLatPos, spotLngPos, spotUserId, spotPriceAmount, spotDescription, spotCategory, spotImage);
				validate=null;
			}
			
			System.out.println("resister-validated:"+validate);

			 return validate;
	    }
	
	

	
	@PostMapping("/permit/review/detect")
	public Map<String,Object> detectReview(@RequestBody Map<String,Object>reviewUserData)
	{
		System.out.println("reviewUserData:"+reviewUserData);
		
		User user=userRepository.getReferenceById(Integer.valueOf(reviewUserData.get("userId").toString()));
		Spot spot=spotRepository.getReferenceById(Integer.valueOf(reviewUserData.get("spotId").toString()));
		Map<String,Object>reviewUserList=new HashMap<String, Object>();
		
		if(reviewRepository.findByUserIdAndSpotId(user, spot)!=null)
		{
			reviewUserList.put("id",reviewRepository.findByUserIdAndSpotId(user, spot).getId());
			reviewUserList.put("evalues",reviewRepository.findByUserIdAndSpotId(user, spot).getEvalues());
			reviewUserList.put("contents",reviewRepository.findByUserIdAndSpotId(user, spot).getContents());
			reviewUserList.put("spotName", spot.getName());
		}
		System.out.println("spot:"+spot.getName());
		return reviewUserList;
	}
	
	
	@PostMapping("/permit/review/delete")
	public void reviewDelete(@RequestBody Map<String,Object>reviewUserData)
	{
		System.out.println("reviewDeletePermit:");
		Integer reviewId=Integer.valueOf(reviewUserData.get("id").toString());
		
		Review review=reviewRepository.getReferenceById(reviewId);
		reviewRepository.delete(review);
		
	}
	
	
	//review情報のSQL登録処理
	@PostMapping("/permit/review/register")
	public Integer reviewRegister(@RequestBody Map<String,Object>reviewUserData)
    {
		System.out.println("reviewRegisterPermit:"+reviewUserData);
		
		
		Integer reviewId=Integer.valueOf(reviewUserData.get("reviewId").toString());
		Integer reviewUserId=Integer.valueOf(reviewUserData.get("reviewUserId").toString());
		Integer reviewSpotId=Integer.valueOf(reviewUserData.get("reviewSpotId").toString());
		Integer reviewEvalues= Integer.valueOf(reviewUserData.get("reviewEvalues").toString());
		String reviewContents;
		
		
		
		if(reviewUserData.get("reviewContents")!=null)
		{
			
			reviewContents=reviewUserData.get("reviewContents").toString();
		}else
		{
			reviewContents=null;
		}
		
		
		
		if(reviewId!=0)
		{
			
			
			Review review=reviewRepository.getReferenceById(reviewId);
			review.setEvalues(reviewEvalues);
			review.setContents(reviewContents);
			review.setCreatedAt(new Timestamp(System.currentTimeMillis()));
			reviewRepository.save(review);
			
			
		}else {
			System.out.println("reviewRegister:yet");
			Review review=new Review();
			review.setUserId(userRepository.getReferenceById(reviewUserId));
			review.setSpotId(spotRepository.getReferenceById(reviewSpotId));
			review.setEvalues(reviewEvalues);
			review.setContents(reviewContents);
			review.setCreatedAt(new Timestamp(System.currentTimeMillis()));
			reviewRepository.save(review);
			
			
		}
		
		
		//評価の平均の計算
		
		List<Review>reviewList=reviewRepository.findAllBySpotId(spotRepository.getReferenceById(reviewSpotId));
		Integer reviewSum=0;
		for(Review review:reviewList)
		{
			
			reviewSum+=review.getEvalues();
		}
		System.out.println("reviewRegister:"+reviewSum+":"+reviewList.size());
		Double reviewEvaluesDouble=(double)reviewSum/reviewList.size();
		
		
		Spot spot=spotRepository.getReferenceById(reviewSpotId);
		spot.setEvaluesDouble(reviewEvaluesDouble);
		spotRepository.save(spot);
		System.out.println("reviewEvaluiesDouble:"+reviewEvaluesDouble);
		
		
		return reviewSpotId;
		 
    }
	
	@PostMapping("/permit/favorite")
	public Boolean favorite(@RequestBody Map<String,Object>favoriteUserData,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		
//		Integer userId=Integer.valueOf(favoriteUserData.get("userId").toString());
		Integer userId=userDetailsImpl.getUser().getId();
		Integer spotId=Integer.valueOf(favoriteUserData.get("spotId").toString());
		Boolean pushed=Boolean.valueOf(favoriteUserData.get("pushed").toString());
		System.out.println("favoriteBoolean"+userId+":"+spotId);
		
		if(pushed)
		{
			System.out.println("favoriteBooleanAlreadyPushed"+userId+":"+spotId);
			if(favoriteRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId))==null)
			{
				Favorite favorite=new Favorite();
				favorite.setUserId(userRepository.getReferenceById(userId));
				favorite.setSpotId(spotRepository.getReferenceById(spotId));
				favorite.setCreatedAt(new Timestamp(System.currentTimeMillis()));
				
				favoriteRepository.save(favorite);
			}else {
				Favorite favorite=favoriteRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId));
				favoriteRepository.delete(favorite);
			}
		}
		
		
		if(favoriteRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId))==null)
		{
			return false;
		}else {
			return true;
		}
	}
	
	@PostMapping("/permit/report")
	public Boolean report(@RequestBody Map<String,Object>reportUserData,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		
//		Integer userId=Integer.valueOf(reportUserData.get("userId").toString());
		Integer userId=userDetailsImpl.getUser().getId();
		Integer spotId=Integer.valueOf(reportUserData.get("spotId").toString());
		System.out.println("reportBoolean"+userId+":"+spotId);
		
		if(reportRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId))==null)
		{
			return false;
		}else {
			return true;
		}
	}
	

	@PostMapping("/permit/report/register")
	public Map<String,Object> registerReport(@RequestBody Map<String,Object>reportUserData,@AuthenticationPrincipal UserDetailsImpl userDetailsImpl)
	{
		
		System.out.println("/permit/report/register");
		Map<String,Object> result=new HashMap<String, Object>();
//		Integer userId=Integer.valueOf(reportUserData.get("reportUserId").toString());
		Integer userId=userDetailsImpl.getUser().getId();

		Integer spotId=Integer.valueOf(reportUserData.get("reportSpotId").toString());
		Object reportContents=reportUserData.get("reportContents");
		
	if(reportRepository.findBySpotIdAndUserId(spotRepository.getReferenceById(spotId),userRepository.getReferenceById(userId))!=null)
		{
			result.put("bool",false);
			result.put("str","あなたはもうすでに通報申請をしています。" );
		}else if(reportContents.toString().isEmpty()){
			result.put("bool",false);
			result.put("str","通報内容を記入してください" );
		}else {
			
			
			messageFromUserService.registerReportMessage(userRepository.getReferenceById(userId),spotRepository.getReferenceById(spotId), reportContents.toString());
			spotService.reportedSpot(spotId);
			
			
			
			Report report=new Report();
			report.setUserId(userRepository.getReferenceById(userId));
			report.setSpotId(spotRepository.getReferenceById(spotId));
			report.setContents(reportContents.toString());
			report.setCreatedAt(new Timestamp(System.currentTimeMillis()));
			
			
			reportRepository.save(report);
			
			result.put("bool",true);
		}
		System.out.println("Boolean"+result);
		return result;
	}
	
	@GetMapping("/general/identify/category")
	public Category identifyCategory(@RequestParam Integer spotId)
	{
		System.out.println("idebtfyCategory");
		Spot spot=spotRepository.getReferenceById(spotId);
		return spot.getCategoryId();
	}
	
}



