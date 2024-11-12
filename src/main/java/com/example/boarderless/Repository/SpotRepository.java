package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.Category;
import com.example.boarderless.Entity.Spot;
import com.example.boarderless.Entity.User;

public interface SpotRepository extends JpaRepository<Spot, Integer>{
	public List<Spot>findAllByEnableOrderByEvaluesDoubleDesc(Boolean enable);
	public List<Spot>findAllByCategoryIdAndEnableOrderByEvaluesDoubleDesc(Category category,Boolean enable);

	
	public List<Spot>findAllByLatBetweenAndLngBetweenAndEnableOrderByEvaluesDoubleDesc(Double latmin,Double latmax,Double lngmin,Double lngmax,Boolean enable);
	public List<Spot>findTop700ByLatBetweenAndLngBetweenAndEnableOrderByEvaluesDoubleDesc(Double latmin,Double latmax,Double lngmin,Double lngmax,Boolean enable);
	public List<Spot>findAllByLatBetweenAndLngBetweenAndCategoryIdAndEnableOrderByEvaluesDoubleDesc(Double latmin,Double latmax,Double lngmin,Double lngmax,Category category,Boolean enable);
	public Spot findByIdAndEnable(Integer spotId,Boolean enable);
	public List<Spot>findAllByUserIdAndEnableOrderByEvaluesDoubleDesc(User user,Boolean enable);
	public List<Spot>findAllByEnableAndIsRejected(Boolean enable,Boolean isRejected);
	public List<Spot>findAllByEnableAndIsReported(Boolean enable,Boolean isReported);
	
	
}
