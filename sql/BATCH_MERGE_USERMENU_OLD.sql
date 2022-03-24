-- ================================================
-- BATCH_MERGE_USERMENU.sql
-- ================================================
USE [jman31mke]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		kyungwon.park
-- Create date: 2018-08-09
-- Description: 사용자별 Menu정보를 MERGE하는 프로시져
-- =============================================
ALTER PROCEDURE dbo.BATCH_MERGE_USERMENU  
   @USERUID numeric(30, 0)
AS 
BEGIN
      SET  XACT_ABORT  ON

      SET  NOCOUNT  ON

	  DECLARE db_cursor CURSOR LOCAL FOR 
			select 
				SRC.parent_uid, 
				SRC.code_order, 
				SRC.width, 
				SRC.sortable, 
				SRC.visible
			from
			(
			select * from     J8_MENUUSER where owner_uid=-1
			) SRC
			left join
			(
			select * from     J8_MENUUSER where owner_uid=@USERUID
			) TGT on SRC.parent_uid = TGT.parent_uid
			where 
			TGT.unique_id is null
	
	  declare @cur_val BIGINT

	  DECLARE @vParentUid numeric(20, 0)
	  DECLARE @vCodeorder numeric(10, 0)
	  DECLARE @vWidth numeric(10, 0)
	  DECLARE @vSortable varchar(20)
	  DECLARE @vVisible varchar(20)
	  
	  EXEC dbo.nextval 'SEQ_MENUUSER', @cur_val OUTPUT

	  OPEN db_cursor 

      FETCH db_cursor
          INTO 
            @vParentUid, 
            @vCodeorder, 
            @vWidth, 
            @vSortable,
            @vVisible
	  	
	  WHILE @@fetch_status = 0
      
      BEGIN
	  /*
		INSERT J8_MENUUSER(
				unique_id,
				parent_uid,
				owner_uid,
				code_order,
				width,
				sortable,
				visible,
				creator,
				create_date,
				changer,
				change_date
				  )
                  VALUES (
                     @cur_val, 
				@vParentUid,
				@USERUID,
				@vCodeorder,
				@vWidth,
				@vSortable,
				@vVisible,
				'root',
				CURRENT_TIMESTAMP,
				'root',
				CURRENT_TIMESTAMP
			)
			*/
		SET @cur_val = @cur_val +1
		select @cur_val

		FETCH NEXT FROM db_cursor
		 INTO 
            @vParentUid, 
            @vCodeorder, 
            @vWidth, 
            @vSortable,
            @vVisible
	  END
	
	CLOSE db_cursor  
	DEALLOCATE db_cursor

	      WHILE @@TRANCOUNT > 0
      
         COMMIT 

END
GO
