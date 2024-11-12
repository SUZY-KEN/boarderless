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

import com.example.boarderless.Entity.Report;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.repository.ReportRepository;
import com.example.boarderless.repository.SpotRepository;
import com.example.boarderless.repository.UserRepository;
import com.example.boarderless.security.UserDetailsImpl;
import com.example.boarderless.service.MessageFromAdminService;
import com.example.boarderless.service.SpotService;

@RestController
@RequestMapping("/admin/map")
public class AdinMapRestController {
	private final SpotRepository spotRepository;
	private final MessageFromAdminService messageFromAdminService;	
	private final ReportRepository reportRepository;
	private final UserRepository userRepository;
	private final SpotService spotService;
	
	
	public AdinMapRestController(SpotRepository spotRepository,MessageFromAdminService messageFromAdminService,ReportRepository reportRepositor,UserRepository userRepositor,SpotService spotService)
	{
		this.spotRepository=spotRepository;
		this.messageFromAdminService=messageFromAdminService;
		this.reportRepository=reportRepositor;
		this.userRepository=userRepositor;
		this.spotService=spotService;
	}
	

	
	@GetMapping("/marker/list")
	public List<Spot> createNotAllowedMarkerList ()
	{
		
		List<Spot>notAllowedSpotList=new ArrayList<Spot>();
		
	
		if(spotRepository.findAllByEnableAndIsRejected(false,false)!=null)
		{
			notAllowedSpotList=spotRepository.findAllByEnableAndIsRejected(false,false);
		}else {
			notAllowedSpotList=null;
		}
			
			
		System.out.println("createMarkerList:"+spotRepository.findAllByEnableAndIsRejected(false,false));
		
		
		
		
		return notAllowedSpotList;
	} 
	
	//spotの承認
	@GetMapping("/approve/spot/notallowed")
	public void approveNotAllowedSpot(@RequestParam Integer spotId) 
	{
		
		Spot spot=spotRepository.getReferenceById(spotId);
		spot.setEnable(true);
		spotRepository.save(spot);
		
		messageFromAdminService.createApproveSpotMessage(spot.getUserId(), spot);
		
		
	}
	
	//spotの却下
	@PostMapping("/reject/spot/notallowed")
	public void rejectNotAllowedSpot(@RequestBody Map<String, Object>rejectedFormData) {
		Integer rejectedSpotId=Integer.valueOf(rejectedFormData.get("rejectedSpotId").toString());
		String rejectedContents=rejectedFormData.get("rejectedContents").toString();
		
		Spot spot=spotRepository.getReferenceById(rejectedSpotId);
		spot.setIsRejected(true);
		spotRepository.save(spot);
		
		messageFromAdminService.createRejectSpotMessage(spot.getUserId(), spot,rejectedContents);
	}
	
	@GetMapping("/report")
	public List<Map<String,Object>> displayReport(@RequestParam Integer spotId,UserDetailsImpl userDetailsImpl)
	{
		List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();
		
			List<Report> reportList=reportRepository.findBySpotId(spotRepository.getReferenceById(spotId));
			
			for(Report report :reportList) {
				Map<String, Object> mapList=new HashMap<String, Object>();
				mapList.put("userId",report.getUserId().getId());
				mapList.put("userName",report.getUserId().getName());
				mapList.put("contents", report.getContents());
				list.add(mapList);
			}
		
		
		return list;
	}
	
	@GetMapping("/spot/delete")
	public void deleteSpot(@RequestParam Integer spotId){
		System.out.println("spotdeleter");
		spotService.deleteSpot(spotId);
	}
	
}
