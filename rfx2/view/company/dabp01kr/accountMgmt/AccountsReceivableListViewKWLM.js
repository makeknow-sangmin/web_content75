//주문작성

Ext.define('Rfx2.view.company.dabp01kr.accountMgmt.AccountsReceivableListViewKWLM', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-list-viewKWLM',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
//    	this.addSearchField ({
//            type: 'dateRange',
//            field_id: 'gr_date',
//            text: "요청기간" ,
//            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//            edate: new Date()
//    	});    

//		this.addSearchField('maker_name');
//		this.addSearchField('pj_code');
//		this.addSearchField('pj_name');
//		this.addSearchField('creator');
//		this.addSearchField('item_name_dabp');
		
//		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');
//		this.addReadonlyField('user_id');
//		this.addReadonlyField('board_count');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.CreatePo', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
      
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        
        //this.editAction.setText('주문작성');
//        this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });

       this.callParent(arguments);
       
     //grid를 선택했을 때 Callback
       this.setGridOnCallback(function(selections) {
           if (selections.length) {
           	
        	   var rec = selections[0];
        	   gMain.selPanel.rec = rec;
        	   console_logs('rec 데이터', rec);
           	var standard_flag = rec.get('standard_flag');
           	standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제 
           	
           	console_logs('그리드온 데이터', rec);
           	gMain.selPanel.request_date = rec.get('req_date'); // 납기일
           	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
           	gMain.selPanel.vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
           	gMain.selPanel.vSELECTED_SP_CODE = rec.get('sp_code');
           	gMain.selPanel.vSELECTED_STANDARD = rec.get('standard_flag');
           	gMain.selPanel.vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
           	gMain.selPanel.vSELECTED_coord_key2 = rec.get('coord_key2');
           	gMain.selPanel.vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
           	gMain.selPanel.vSELECTED_po_user_uid = rec.get('po_user_uid');
           	gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 원지: 지종,  원단 : 지종배합, 부자재 : 품명
           	gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
           	gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
           	gMain.selPanel.vSELECTED_req_date = rec.get('delivery_plan');
           	gMain.selPanel.vSELECTED_quan = rec.get('pr_quan');
           	gMain.selPanel.vSELECTED_comment = rec.get('comment');   // 폭
           	gMain.selPanel.vSELECTED_req_info = rec.get('req_info');  //비고
           	gMain.selPanel.vSELECTED_request_comment = rec.get('request_comment');  //전달 특기사항
           	gMain.selPanel.vSELECTED_reserved_varcharb = rec.get('reserved_varcharb'); //칼날 사이즈
           	gMain.selPanel.vSELECTED_project_double3 = rec.get('project_double3'); //판걸이 수량
           	gMain.selPanel.vSELECTED_specification = rec.get('specification');  //부자재 규격
           	gMain.selPanel.vSELECTED_pj_description = rec.get('pj_description');
           	gMain.selPanel.vSELECTED_srcahduid = rec.get('unique_id');  //srcahd uid
           	gMain.selPanel.vSELECTED_lot_name = rec.get('pj_name');

           	//gMain.selPanel.itemabst();
        	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
        	this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
        	//this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
            /*for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        		console_logs('rec1', rec1);
        	   }*/
            } else {
           	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
           	gMain.selPanel.vSELECTED_PJ_UID = -1;
           	
           	
           	//this.store.removeAll();
           	this.cartmap_uids = [];
           	for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        	   }
           	
           	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
           	console_logs('언체크', this.cartmap_uids);
           }
       	
       })

        //디폴트 로드
       gMain.setCenterLoading(false);
       this.store.load(function(records){
    	   console_logs('디폴트 데이터', records);
    	   
       });
    },
    items : [],
    poviewType: 'ALL',
    cartmap_uids : [],
    deleteClass: ['cartmap'],
    jsonType : '',
    
});
