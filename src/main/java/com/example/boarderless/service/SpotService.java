package com.example.boarderless.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.repository.CategoryRepository;
import com.example.boarderless.repository.SpotRepository;
import com.example.boarderless.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class SpotService {
	@Value("${cloud.aws.s3.repository}")
	private  String bucketName;
	
	private final SpotRepository spotRepository;
	private final CategoryRepository categoryRepository;
	private final UserRepository userRepository;
	private final AmazonS3 amazonS3;
	private final MessageFromAdminService messageFromAdminService;
	private final MessageFromUserService messageFromUserService;

	public SpotService(SpotRepository spotRepository, CategoryRepository categoryRepository,
			UserRepository userRepository,AmazonS3 amazonS3,MessageFromAdminService messageFromAdminService,MessageFromUserService messageFromUserService) {
		this.spotRepository = spotRepository;
		this.categoryRepository = categoryRepository;
		this.userRepository = userRepository;
		this.amazonS3=amazonS3;
		this.messageFromAdminService=messageFromAdminService;
		this.messageFromUserService=messageFromUserService;
	}

	//spot登録
//	@Transactional
//	public void create(String spotName, Double spotLatPos, Double spotLngPos, Integer spotUserId,
//			String spotPriceAmount, String spotDescription, Integer spotCategory, MultipartFile spotImage) {
//		Spot spot = new Spot();
//
//		Category category;
//		if (spotCategory != null) {
//			category = categoryRepository.getReferenceById(spotCategory);
//		} else {
//			category = null;
//		}
//
//		try {
//			Integer spotPriceAmountInt = Integer.valueOf(spotPriceAmount);
//
//			spot.setPrice(spotPriceAmountInt);
//		} catch (Exception e) {
//			spot.setPrice(null);
//		}
//
//		if (!spotImage.isEmpty()) {
//
//			String fileName = spotImage.getOriginalFilename();
//			String hashedFileName = generateNewFile(fileName);
//			Path filePath = Paths.get("src/main/resources/static/spotImageStorage/" + hashedFileName);
//
//			copyImageFile(spotImage, filePath);
//
//			// 画像ファイルの保存
//
//			spot.setImagefileId(hashedFileName);
//		}
//
//		spot.setUserId(userRepository.getReferenceById(spotUserId));
//		spot.setLat(spotLatPos);
//		spot.setLng(spotLngPos);
//		spot.setCategoryId(category);
//		spot.setName(spotName);
//		spot.setDescription(spotDescription);
//
//		spot.setCreatedAt(new Timestamp(System.currentTimeMillis()));
//		spot.setEnable(false);
//		spot.setIsRejected(false);
//		spot.setIsReported(false);
//		spotRepository.save(spot);
//	};
//
//	//ファイル名の生成
//	public String generateNewFile(String fileName) {
//		String[] fileNames = fileName.split("\\.");
//		for (int i = 0; i < fileNames.length - 1; i++) {
//			fileNames[i] = UUID.randomUUID().toString();
//		}
//		String hashedFileName = String.join(".", fileNames);
//
//		return hashedFileName;
//	}
//
//	public void copyImageFile(MultipartFile imageFile, Path filePath) {
//		try {
//			Files.copy(imageFile.getInputStream(), filePath);
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//	}
	
	@Transactional
	public void create(String spotName, Double spotLatPos, Double spotLngPos, Integer spotUserId,
			String spotPriceAmount, String spotDescription, Integer spotCategory, MultipartFile spotImage) {
		Spot spot = new Spot();
		

		Category category;
		if (spotCategory != null) {
			category = categoryRepository.getReferenceById(spotCategory);
		} else {
			category = null;
		}

		try {
			Integer spotPriceAmountInt = Integer.valueOf(spotPriceAmount);

			spot.setPrice(spotPriceAmountInt);
		} catch (Exception e) {
			spot.setPrice(null);
		}

		if (!spotImage.isEmpty()) {

			String fileName = spotImage.getOriginalFilename();
			String hashedFileName = generateNewFile(fileName);
			Path filePath=createFilePath(hashedFileName);
			copyImageFile(spotImage, filePath);

			amazonS3.putObject(new PutObjectRequest(bucketName,"spotImage/"+ hashedFileName, filePath.toFile()).withCannedAcl(CannedAccessControlList.PublicRead));
			deleteFilePath(filePath);
			
			spot.setImagefileId(hashedFileName);
		}

		spot.setUserId(userRepository.getReferenceById(spotUserId));
		spot.setLat(spotLatPos);
		spot.setLng(spotLngPos);
		spot.setCategoryId(category);
		spot.setName(spotName);
		spot.setDescription(spotDescription);

		spot.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		spot.setEnable(false);
		spot.setIsRejected(false);
		spot.setIsReported(false);
		spotRepository.save(spot);
	};

	//ファイル名の生成
	public String generateNewFile(String fileName) {
		String[] fileNames = fileName.split("\\.");
		for (int i = 0; i < fileNames.length - 1; i++) {
			fileNames[i] = UUID.randomUUID().toString();
		}
		String hashedFileName = String.join(".", fileNames);

		return hashedFileName;
	}

	public void copyImageFile(MultipartFile imageFile, Path filePath) {
		try {
			Files.copy(imageFile.getInputStream(),filePath,StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	//画像ファイル
	public Path createFilePath(String hashedFileName)
	{
		try {
			Path tempFilePath = Files.createTempFile("temp", hashedFileName);
			return tempFilePath;
		}
		catch(IOException e){
			e.printStackTrace();
			return null;
		}
	}
			
	//画像ファイル
	public void deleteFilePath(Path filePath)
	{
		try {
			Files.delete(filePath);
			
		}
		catch(IOException e){
			e.printStackTrace();
			
		}
	}



	//スポット登録バリデーション
	public Map<String, Object> validateRegisterSpotForm(String spotName, String spotPriceAmount, String spotDescription,
			Integer spotCategory, MultipartFile spotImage, String spotIsPrice) {
		Map<String, Object> validate = new HashMap<String, Object>();
		if (spotDescription.isEmpty()) {
			validate.put("errorDescription", "説明を記述してください");
		}

		if (spotName.isEmpty()) {
			validate.put("errorName", "スポット名を記述してください");
		} else if (isSameName(spotName)) {

			validate.put("errorName", "同名のスポット名が存在しています");
		}

		if (spotIsPrice == null) {
			validate.put("errorSpotIsPrice", "料金を指定してください");
		} else if (!spotIsPrice.equals("on")) {
			if (spotPriceAmount == null) {
				validate.put("errorSpotPriceAmount", "金額を指定してください");

			} else {
				try {
					Integer spotPriceAmountInt = Integer.valueOf(spotPriceAmount);
					if (spotPriceAmountInt < 1 || 1000000 < spotPriceAmountInt) {
						validate.put("errorSpotPriceAmount", "金額が不適切です");
					}

				} catch (Exception e) {
					validate.put("errorSpotPriceAmount", "金額が不適切です");
				}

			}
		}

	
		return validate;
	}

	public Boolean isSameName(String spotName) {
		List<Spot> spotList = spotRepository.findAllByEnableAndIsRejected(true, false);
		for (Spot spot : spotList) {
			if (spot.getName().equals(spotName)) {
				return true;
			}
		}

		return false;
	}
	
	@Transactional
	public void reportedSpot(Integer spotId) {
		Spot spot=spotRepository.getReferenceById(spotId);
		spot.setIsReported(true);
		spotRepository.save(spot);
		
	}
	
	public void deleteSpot(Integer spotId) {
		Spot spot=spotRepository.getReferenceById(spotId);
		
		messageFromAdminService.deleteSpotMessage(spotId);
//		messageFromUserService.deleteReportMessage(spotId);
		spotRepository.delete(spot);
	}

}
