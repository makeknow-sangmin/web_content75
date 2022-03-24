//디자인 파일
Ext.define('Rfx2.view.company.dabp01kr.designPlan.DocuFileView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'docu-file-view',
    
    //File첨부 폼
    attachform: null,
    vFILE_ITEM_CODE: null,
    
    initComponent: function(){
    	//order by 에서 자동 테이블명 붙이기 끄기. 
    	this.orderbyAutoTable = false;
    	
    	this.setDefValue('regist_date', new Date());

    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');//세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');//목형유형
    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');//목형유형
    	
    	//this.setDefValue('pj_code', 'test');
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: gm.getMC('CMD_Order_Date', '등록일자'),
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});	
		
		this.addSearchField (
		{
			type: 'combo',
			field_id: 'status'
			,store: "RecevedStateStore"
			,displayField: 'codeName'
			,valueField: 'systemCode'
			,emptyText: '진행상태'
			,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
		});	
		
		this.addSearchField (
		{
			type: 'combo'
			,field_id: 'wa_name'
			,store: "BuyerStore"
			,displayField: 'wa_name'
			,valueField: 'wa_name'
			,emptyText: '고객사'
			,innerTpl	: '<div data-qtip="{wa_name}">{wa_name}</div>'
		});
		
		this.addSearchField (
		{
			type: 'area'
			,field_id: 'tag_no'
			,emptyText: 'TAG NO'
		});
		this.addSearchField (
				{
					type: 'area'
					,field_id: 'pj_code'
					,emptyText: 'SPOOL NO'
				});
		
//		this.addSearchField ({
//				type: 'combo'
//				,field_id: 'pm_name'
//				,store: "UserStore"
//			    ,displayField:   'user_name'
//			    ,valueField:   'user_name'
//			    ,value: vCUR_USER_NAME
//				,innerTpl	: '<div data-qtip="{dept_name}">{user_name} [{dept_name}]</div>'
//		});	
		
		/*this.addSearchField('pm_name');
		this.addSearchField('wa_name');
		this.addSearchField('item_name');
		this.addSearchField('pj_code');*/
		switch(vCompanyReserved4){
		case "SWON01KR":
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			break;
		case "PNLC01KR":
			break;
		case "DDNG01KR":
			this.addSearchField('pj_code');//P/O번호
			this.addSearchField('area_code');//블록
			this.addSearchField('h_reserved44');//ACTIVITY	
			this.addSearchField('reserved1');//도장외부스펙1
			this.addSearchField('h_reserved9');  // 제작메모2
			this.addSearchField('comment');   //자재내역1
			
			break;
		case "SHNH01KR":
			this.addSearchField('pj_name');    // 프로젝트
			this.addSearchField('area_code');  // 블럭
			this.addSearchField('description');   //자재그룹(물성)
			this.addSearchField('reserved1');	// 도장외부스펙1
			this.addSearchField('moldel_name');	// 도장외부스펙2
			this.addSearchField('h_reserved60');	// 시공 W/C
			this.addSearchField('pj_code');
			break;
		default :
			this.addSearchField('area_code');
			this.addSearchField('h_reserved44');	
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
		}
		
		
		
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		/*
		 	{key: 'SEARCH', text: CMD_SEARCH/*'검색'*/},
	        {key: 'REGIST', text: '신규등록'},
	       	{key: 'EDIT', 	text: gm.getMC('CMD_MODIFY', '수정')},
	       	{key: 'COPY', 	text: '복사등록'},
	       	{key: 'REMOVE', text: gm.getMC('CMD_DELETE', '삭제')},
	       	{key: 'VIEW', 	text: '보기'}
		 */
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	       'REGIST', 'COPY', 'REMOVE'
        	],
        	RENAME_BUTTONS : [
        	        { key: 'EDIT', text: '파일첨부'}
        	]
        });
        
        
        //모델 정의
        this.createStore('Rfx.model.HEAVY4RecvPoViewModel', [{
	            property: 'pj_code',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_id'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['assymap']
	        );
        
        //상태가 BM이 아닐 것.
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
//        arr.push(dateToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	gMain.selPanel.vSELECTED_RECORD = rec;
        	console_logs('gMain.selPanel.vSELECTED_RECORD >>>>>>>>>>>>>>>>',gMain.selPanel.vSELECTED_RECORD);
        	if(rec!=undefined && rec!=null) {
            	gMain.loadFileAttach(rec.get('ac_uid'), gMain.selectedMenuId + 'designFileAttach');        		
        	}

        });
        

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        //파일첨부 그리드탭 추가
		gMain.addTabFileAttachGridPanel('파일', 'FILE_ATTACH', {NO_INPUT: null}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	//console_logs(rec);
	            } else {
	            	
	            }
	        },
	        gMain.selectedMenuId + 'designFileAttach',
	        {
	        	selectionchange: function(sm, selections) {        		
	        		var fileRecord = (selections!=null && selections.length>0) ? selections[0] : null;
	        		console_logs(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		
	        		var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		if(fileRecord==null) {
	        			gUtil.disable(delButton);
	        		} else {
	        			gUtil.enable(delButton);
	        		}
	        		
	        	}
	        }
		);

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.storeLoad();
        
    },
    items : []
});
