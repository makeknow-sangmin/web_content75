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

	  declare @cur_val BIGINT

	  -- 1개는 삭제 하므로.... 한칸 작게
	  select @cur_val = sequence_cur_value-1 from SEQUENCE_DATA where  sequence_name='SEQ_MENUUSER';
	  
	  -- 임시테이블 생성
	  Create Table #TempTbl(
		    unique_id DECIMAL(20,0) NOT NULL IDENTITY(1,1),
			parent_uid DECIMAL(20,0),
			code_order DECIMAL(20,0),
			width DECIMAL(10,0),
			sortable NVARCHAR(10),
			visible NVARCHAR(10)
		)
	   --- seq 값으로 unique_id 초기화	
		SET IDENTITY_INSERT #TempTbl ON
		insert into #TempTbl (unique_id ) values (@cur_val);
		SET IDENTITY_INSERT #TempTbl OFF

		-- 임시테이블에 insert
		insert into #TempTbl
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

		-- 초기화 레코드는 삭제
		delete from #TempTbl where unique_id=@cur_val;

		-- insert 되었는지 체크
		declare @max_uid DECIMAL(20,0);
		select @max_uid = max(unique_id)+1 from #TempTbl;

		-- insert 되었으면
		if  @max_uid is not null
		 begin

			update SEQUENCE_DATA set sequence_cur_value = @max_uid
				   where sequence_name='SEQ_MENUUSER';

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
			select  unique_id,
					parent_uid,
					@USERUID,
					code_order,
					width,
					sortable,
					visible,
					'root' as creator,
					CURRENT_TIMESTAMP as create_date,
					'root' as changer,
					CURRENT_TIMESTAMP as change_date
				from  #TempTbl;

		end
	
		-- 임시테이블 삭제.
		drop table #TempTbl;      		

END
GO
