package com.example.boarderless.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.boarderless.Entity.MessageFromAdmin;
import com.example.boarderless.Entity.User;

public interface MessageFromAdminRepository extends JpaRepository<MessageFromAdmin, Integer>  {
	
	public long countByUserIdAndAlreadyRead(User user,Boolean alreadyRead);
	public List<MessageFromAdmin> findAllByUserIdAndAlreadyReadOrderByIdDesc(User user,Boolean alreadyRead);
	public Page<MessageFromAdmin>findAllByUserId(User user,Pageable pageable);
	public List<MessageFromAdmin> findAllByUserIdAndAlreadyReadOrderByIdAsc(User user,Boolean alreadyRead);
	
	
	// ユーザーごとに最小のIDを持つメッセージを取得するクエリメソッド
//	 @Query("SELECT m FROM MessageFromAdmin m WHERE m.userId = :user AND m.alreadyRead = :alreadyRead ORDER BY m.id ASC")
//	    public List<MessageFromAdmin> findMinIdMessageByUserIdAndAlreadyRead(@Param("user") User user, @Param("alreadyRead") Boolean alreadyRead, Pageable pageable);
	

}
