//주문작성

Ext.define('Rfx.view.purStock.CreatePoView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'create-po-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "요청기간" ,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	});    

//		this.addSearchField('maker_name');
		this.addSearchField('pj_code');
		this.addSearchField('pj_name');
		this.addSearchField('creator');
		this.addSearchField('item_name_dabp');
		
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
        this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        
        //PO Type View Type
        this.setAllPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '전체',
 			 tooltip: '전체목록',
 			 pressed: true,
 			 //ctCls: 'x-toolbar-grey-btn',
 			 toggleGroup: 'poViewType',
 			 handler: function() {
 				gMain.selPanel.createAddPoAction.disable();
 				gMain.selPanel.vSELECTED_UNIQUE_ID='';
 				gMain.selPanel.poviewType = 'ALL';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
 				gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
				 gMain.selPanel.store.load(function(){});
				 
 			 }
 		});
        
        this.setRawPoView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '원단',
  			 tooltip: '원단 주문',
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				gMain.selPanel.createAddPoAction.disable();
  				gMain.selPanel.createPoAction.enable();
  				gMain.selPanel.vSELECTED_UNIQUE_ID='';
  				gMain.selPanel.poviewType = 'RAW';
  				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'O');
  				gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
				 gMain.selPanel.store.load(function(){});
				 
  			 }
  		});
       this.setSubPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '부자재',
 			 tooltip: '부자재 주문',
 			 //ctCls: 'x-toolbar-grey-btn',
 			 toggleGroup: 'poViewType',
 			 handler: function() {
 				gMain.selPanel.createAddPoAction.disable();
 				gMain.selPanel.createPoAction.enable();
 				gMain.selPanel.vSELECTED_UNIQUE_ID='';
 				gMain.selPanel.poviewType = 'SUB';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
 				gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
				 gMain.selPanel.store.load(function(){});
				
 			 }
 		});
       this.setPaperPoView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '원지',
			 tooltip: '원지 주문',
			 //ctCls: 'x-toolbar-grey-btn',
			 toggleGroup: 'poViewType',
			 handler: function() {
				 gMain.selPanel.createAddPoAction.disable();
				 gMain.selPanel.createPoAction.enable();
				 gMain.selPanel.vSELECTED_UNIQUE_ID='';
				 gMain.selPanel.poviewType = 'PAPER';
				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
				 gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
				 gMain.selPanel.store.load(function(){});
				 
				 
			 }
		});
       
       this.setAddPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
  			 text: '주문이력',
  			 tooltip: '주문 이력',
  			 multiSelect: false,
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				 gMain.selPanel.poviewType = 'ADDPO';
  				 gMain.selPanel.vSELECTED_UNIQUE_ID='';
  				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
  				 gMain.selPanel.store.getProxy().setExtraParam('storeType', 'Y');
  				 gMain.selPanel.store.load(function(){});
  				
  			 }
  		});
       
     //주문작성 Action 생성
       this.createPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '주문 작성',
			 tooltip: '주문 작성',
			 disabled: false,
			 handler: function() {
				
				 switch(gMain.selPanel.poviewType) {
				 case 'ALL':
					 alert("자재를 먼저 선택해 주세요");
					 break;
				 case 'RAW':
					 gMain.selPanel.treatRawPo();
					 break;
				 case 'SUB':
					 gMain.selPanel.treatSubPo();
				 	break;
				 case 'ADDPO':
					 alert("복사 하기 버튼을 누르세요");
				 	break;
				 case 'PAPER':
					 gMain.selPanel.treatPaperPoRoll();
					 break;
				 default:
					 
				 }
				 
			 }//handler end...
			 
		});
       
     //추가 주문작성 Action 생성
       this.createAddPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '복사 하기',
			 tooltip: '복사 하기',
			 disabled: true,
			 handler: function() {
				
				 var sp_code = gMain.selPanel.vSELECTED_SP_CODE;
				 switch(sp_code) {
				 case 'R':
					 gMain.selPanel.purCopyAction();
					 break;
				 case 'S':
					 gMain.selPanel.purCopyAction();
					 break;
				 case 'O':
					 gMain.selPanel.purCopyAction();
					 break;
				 case 'K':
					 gMain.selPanel.purCopyAction();
				 	break;
				 default:
					 
				 }
				 
			 }//handler end...
			 
		});
       
       //버튼 추가.
       buttonToolbar.insert(5, '-');
       buttonToolbar.insert(5, this.setAddPoView);
       buttonToolbar.insert(5, this.setSubPoView);
       buttonToolbar.insert(5, this.setRawPoView);
       buttonToolbar.insert(5, this.setPaperPoView);
       buttonToolbar.insert(5, this.setAllPoView);
       buttonToolbar.insert(3, this.createAddPoAction);
       buttonToolbar.insert(3, this.createPoAction);
       buttonToolbar.insert(3, '-');
       
       

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
            console_logs('선택된 uid', this.cartmap_uids);
            
            switch(gMain.selPanel.poviewType){
            case 'ADDPO':
            	gMain.selPanel.createAddPoAction.enable();
           		gMain.selPanel.createPoAction.disable();
            	break;
            case 'RAW':
            	gMain.selPanel.createPoAction.enable();
           		gMain.selPanel.itemabst();
            	break;
            default :
            	gMain.selPanel.createPoAction.enable();
            	break;
            }
           	/*if(gMain.selPanel.poviewType == 'ADDPO'){
           		
           		gMain.selPanel.createAddPoAction.enable();
           		gMain.selPanel.createPoAction.disable();
           	}else{
           		gMain.selPanel.createPoAction.enable();
           	}*/
           	
           	
            } else {
           	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
           	gMain.selPanel.vSELECTED_PJ_UID = -1;
           	
           	if(gMain.selPanel.poviewType == 'ADDPO'){
           		gMain.selPanel.createAddPoAction.disable();
           		gMain.selPanel.createPoAction.enable();
           	}else{
           		//gMain.selPanel.createPoAction.disable();
           	}
           	
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
    
    purCopyAction: function () {
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	
    	if(uniqueId.length < 0){
    		alert('선택된 데이터가 없습니다.');
    	}else{
    	
    	Ext.Ajax.request({
    		url : CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
			params:{
				cartmapUids: this.cartmap_uids
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
    	} // end of if uniqueid
    },
    
    addRawPo: function () {
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	var next2 = gUtil.getNextday(2);
    	var form = null;
     	
    	form = Ext.create('Ext.form.Panel', {
    		id: gu.id('formPanel'),
    		xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items: [
            	{
                	xtype: 'component',
                	anchor: '100%'
            	},
            	/*{
            		fieldLabel: 'LOT 번호',
            		xtype: 'combo',    
            		anchor: '100%',
            		id: 'lot_information',
            		name: 'lot_information',
            		mode: 'local',
            		//value: 'supplier_name',
            		store: Ext.create('Mplm.store.ProjectStore'),
            		displayField:   'pj_name',
            		valueField: 'unique_id',
            		emptyText: '선택',
            		sortInfo: { field: 'create_date', direction: 'DESC' },
            	    typeAhead: false,
            	    //hideLabel: true,
            	    minChars: 1,
            		listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">{pj_code}|{pj_name}</div>';
            	      	}
            		},
            		listeners: {
            	           select: function (combo, record) {
            	           	console_logs('Selected Value : ' + combo.getValue());
            	           	console_logs('프로젝트: ', record );
            	       		
            	       		var unique_id = record.get('unique_id');
            	       		
            	   			var supplier_name = record.get('supplier_name');
            	   			
            	   			
            	   			//console_logs('sp_srchSupplier_uid : ', aa );
            	   			var sales_person1_name = record[0].get('sales_person1_name');
            	   			
            	   			selectedSupplierHandler(selectedSupast);

            					//Ext.getCmp('buyer').setValue(supplier_name);
            					//Ext.getCmp('sp_srchSupplier_name').setValue(supplier_name+' : '+sales_person1_name+' : '+sales_person1_mobilephone_no+' : '+sales_person1_email_address);
            	   			
            	           }
            	      }
            		
            	},*/
				    {
            		fieldLabel: '주문처',
            		xtype: 'combo',    
            		anchor: '100%',
            		id: 'supplier_information',
            		name: 'supplier_information',
            		mode: 'local',
            		//value: 'supplier_name',
            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard'}),
            		displayField:   'supplier_name',
            		valueField: 'unique_id',
            		emptyText: '선택',
            		sortInfo: { field: 'create_date', direction: 'DESC' },
            	    typeAhead: false,
            	    //hideLabel: true,
            	    minChars: 1,
            		listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
            	      	}
            		},
            		listeners: {
            	           select: function (combo, record) {
            	           	
            	           }
            	      }
            		
            	},{
            		fieldLabel: '납품장소', //ppo1_address,
            		xtype: 'combo',
            		//anchor: '100%',
            		width : 200,
            		value:'DABP' ,
            		id: 'delivery_address_1',
            		name: 'delivery_address_1',
            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'outstore'}),
            		displayField:   'supplier_name',
            		valueField: 'unique_id',
            		emptyText: '선택',
            		sortInfo: { field: 'create_date', direction: 'DESC' },
            	    typeAhead: false,
            	    //hideLabel: true,
            	    minChars: 1,
            		listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
            	      	}
            		},
            		listeners: {
            	           select: function (combo, record) {

            	           }
            	      }
            	},{
            	    	fieldLabel: '전달 특기사항',//ppo1_request,
            	     	xtype: 'textarea',
            	    	rows: 4,
            	    	anchor: '100%',
            	    	id:   'item_abst',
            	    	name: 'item_abst',
            	    	//value: '',
            	    	emptyText: '특기사항을 입력해주세요'
            	}
            	,{
            		fieldLabel: '지종배합',
	            	xtype: 'textfield',
	            	anchor: '100%',
	            	//value: '',
	            	id: 'item_name',
	            	name: 'item_name'
	            },{
            		fieldLabel: '폭',
	            	xtype: 'numberfield',
	            	rows: 2,
	            	anchor: '100%',
	            	//value: '',
	            	id: 'comment',
	            	name: 'comment'
	            }
	            ,{
        		fieldLabel: '장',
            	xtype: 'numberfield',
            	emptyText : 'mm',
            	anchor: '100%',
            	//value: '',
            	id: 'remark',
            	name: 'remark'
	            }
	            ,{
            		fieldLabel: '단가',
	            	xtype: 'numberfield',
	            	anchor: '100%',
	            	//value: '',
	            	id: 'sales_price',
	            	name: 'sales_price'
            },{
            	fieldLabel: '납품 기한',
            	id: 'request_date',
			    name: 'request_date',
			    xtype: 'datefield',
			    format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			    value : next2,
			    allowBlank: false
            }
	            ,{
	            		fieldLabel: '수량',
	            		xtype: 'numberfield',
	            		//value: '',
	            		anchor: '100%',
	            		id: 'bm_quan',
	            		name: 'bm_quan',
	            		minValue : 1
	            }
	            
	            ]//item end..
		
                    });//Panel end...
	
	    	
					myHeight = 550;
					myWidth = 650;
	     

				//prwin = this.prwinopen(form);
					this.prwinopen(form);
    },
    
    addSubPo: function () {
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	var next2 = gUtil.getNextday(2);
    	var form = null;
     	
    	form = Ext.create('Ext.form.Panel', {
    		id: gu.id('formPanel'),
    		xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items: [
            	{
                	xtype: 'component',
                	anchor: '100%'
            	},
				    {
            		fieldLabel: '주문처',
            		xtype: 'combo',    
            		anchor: '100%',
            		id: 'supplier_information',
            		name: 'supplier_information',
            		mode: 'local',
            		//value: 'supplier_name',
            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard' , supplierType: 'K'}),
            		displayField:   'supplier_name',
            		valueField: 'unique_id',
            		emptyText: '선택',
            		sortInfo: { field: 'create_date', direction: 'DESC' },
            	    typeAhead: false,
            	    //hideLabel: true,
            	    minChars: 1,
            		listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
            	      	}
            		},
            		listeners: {
            	           select: function (combo, record) {
            	           
            	           }
            	      }
            		
            	},{
            		fieldLabel: '납품장소', //ppo1_address,
            		xtype: 'combo',
            		//anchor: '100%',
            		width : 200,
            		//value:'unique_id' ,
            		id: 'delivery_address_1',
            		name: 'delivery_address_1',
            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'outstore'}),
            		displayField:   'supplier_name',
            		valueField: 'unique_id',
            		emptyText: '선택',
            		sortInfo: { field: 'create_date', direction: 'DESC' },
            	    typeAhead: false,
            	    //hideLabel: true,
            	    minChars: 1,
            		listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
            	      	}
            		},
            		listeners: {
            	           select: function (combo, record) {
            	           	
            	           }
            	      }
            	},{
            	    	fieldLabel: '전달 특기사항',//ppo1_request,
            	     	xtype: 'textarea',
            	    	rows: 4,
            	    	anchor: '100%',
            	    	id:   'item_abst',
            	    	name: 'item_abst',
            	    	//value: '',
            	    	emptyText: '특기사항을 입력해주세요'
            	}
            	,{
            		fieldLabel: '품명',
	            	xtype: 'textfield',
	            	anchor: '100%',
	            	//value: '',
	            	id: 'item_name',
	            	name: 'item_name'
	            },{
            		fieldLabel: '규격',
	            	xtype: 'numberfield',
	            	rows: 2,
	            	anchor: '100%',
	            	//value: '',
	            	id: 'comment',
	            	name: 'comment'
	            }
	            ,{
            		fieldLabel: '단가',
	            	xtype: 'numberfield',
	            	anchor: '100%',
	            	//value: '',
	            	id: 'sales_price',
	            	name: 'sales_price'
            },{
            	fieldLabel: '납품 기한',
            	id: 'request_date',
			    name: 'request_date',
			    xtype: 'datefield',
			    format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			    value : next2
            }
	            ,{
	            		fieldLabel: '수량',
	            		xtype: 'numberfield',
	            		//value: '',
	            		anchor: '100%',
	            		id: 'bm_quan',
	            		name: 'bm_quan',
	            		minValue : 1
	            }
	            
	            ]//item end..
		
                    });//Panel end...
	
	    	
					myHeight = 550;
					myWidth = 650;
	     

				//prwin = this.prwinopen(form);
					this.prwinopen(form);
    },
    
    treatRawPo: function() {
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	var next2 = gUtil.getNextday(2);
    	var form = null;
    	
    	var jsonStr = '';
    	var rollInfo = '';
    	var sheetInfo = '';
    	
     	
		 if(uniqueId == undefined || uniqueId < 0){
			 this.addRawPo();
			 //alert("구매물품을 선택해 주세요");
		 }else {
	    	var pj_uid = uniqueId;
	    	console_logs('gMain.selPanel.jsonInfo', gMain.selPanel.json.length);
	    	
	    	if(gMain.selPanel.json.length > 0){
		    	rollInfo = (gMain.selPanel.jsonInfo.datas[0])['ROLL'];
		    	sheetInfo =(gMain.selPanel.jsonInfo.datas[0])['SHEET'];
		    	console_logs('rollInfo', rollInfo);
		    	console_logs('sheetInfo', sheetInfo);
		    	
		    	var pur_type =rollInfo.pur_useYN;
		    	if(pur_type =="Y"){
		    		pur_type = "ROLL";
		    	}else{
		    		pur_type = "SHEET";
		    	}
	    	
	    	}

	    	//var form = null;
	    	//console_logs('gMain.selPanel.commonField', this.commonField);
	    	form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		//xtype: 'form-multicolumn',
	    		frame: true ,
	    		border: false,
	    		bodyPadding: 10,
	    		region: 'center',
	    		layout: 'column',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                layout: 'form',
	                xtype: 'container',
	                defaultType: 'textfield',
	                style: 'width: 50%'
	            },
	            items: [{
	            	 xtype: 'fieldset',
	                 title: '구매',
	                 width : 300,
	                 height : 450,
	                 margins: '0 20 0 0',
	                 collapsible: true,
	                 anchor: '100%',
	                 defaults: {
	                     labelWidth: 89,
	                     anchor: '100%',
	                     useThousandSeparator: false,
	                     layout: {
	                         type: 'hbox',
	                         defaultMargins: {top: 0, right: 100, bottom: 0, left: 10},
	                         anchor: '30%'
	                     }
	                 },
	                items: [{
	                	fieldLabel: 'LOT명',
		            	xtype: 'textfield',
		            	anchor: '100%',
		            	value: gMain.selPanel.vSELECTED_lot_name,
		            	
	                	},
	                    {
			            		fieldLabel: '주문처',
			            		xtype: 'combo',    
			            		anchor: '100%',
			            		id: 'supplier_information',
			            		name: 'supplier_information',
			            		mode: 'local',
			            		//value: 'supplier_name',
			            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard', supplierType: 'O'}),
			            		//store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_MAKER'}),  // 제조원
			            		displayField:   'supplier_name',
			            		valueField: 'unique_id',
			            		emptyText: '선택',
			            		sortInfo: { field: 'create_date', direction: 'DESC' },
			            	    typeAhead: false,
			            	    //hideLabel: true,
			            	    minChars: 1,
			            		listConfig:{
			            			loadingText: '검색중...',
			            	        emptyText: '일치하는 항목 없음.',
			            	      	getInnerTpl: function(){
			            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
			            	      	}
			            		},
			            		listeners: {
			            	           select: function (combo, record) {
			            	           	
			            	           }
			            	      }
			            		
			            	}, {
							    xtype: 'hiddenfield',
								id :'supplier_code',
							    name : 'supplier_code'
							},
							{
							    xtype: 'hiddenfield',
								id :'pur_paper_type',
							    name : 'pur_paper_type',
							    value: 'O'
							},
			            	
			            	{
			            		fieldLabel: '납품장소', //ppo1_address,
			            		xtype: 'combo',
			            		//anchor: '100%',
			            		width : 200,
			            		//value: 'DABP',
			            		id: 'delivery_address_1',
			            		name: 'delivery_address_1',
			            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'outstore', hasOwn: true}),
			            		displayField:   'supplier_name',
			            		valueField: 'unique_id',
			            		emptyText: 'DABP',
			            		sortInfo: { field: 'create_date', direction: 'DESC' },
			            	    //typeAhead: false,
			            	    //hideLabel: true,
			            	    minChars: 1,
			            		listConfig:{
			            			loadingText: '검색중...',
			            	        emptyText: '일치하는 항목 없음.',
			            	      	getInnerTpl: function(){
			            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
			            	      	}
			            		},
			            		listeners: {
			            	           select: function (combo, record) {
			            	           	
			            	           }
			            	      }
			            	},{
			            	    	fieldLabel: '비 고',//ppo1_request,
			            	     	xtype: 'textarea',
			            	    	rows: 4,
			            	    	anchor: '100%',
			            	    	id:   'item_abst',
			            	    	name: 'item_abst',
			            	    	value: gMain.selPanel.vSELECTED_req_info
			            	}
			            	,{
			            		fieldLabel: '지종배합',
				            	xtype: 'textfield',
				            	anchor: '100%',
				            	value: gMain.selPanel.vSELECTED_item_name,
				            	id: 'item_name',
				            	name: 'item_name'
				            },{
			            		fieldLabel: '장',
				            	xtype: 'textfield',
				            	anchor: '100%',
				            	value : gMain.selPanel.vSELECTED_remark,
				            	id: 'remark',
				            	name: 'remark'
			            },{
				            		fieldLabel: '폭',
					            	xtype: 'textfield',
					            	anchor: '100%',
					            	value : gMain.selPanel.vSELECTED_comment,
					            	id: 'comment',
					            	name: 'comment'
				            },
			            {
			            	fieldLabel: '납품 기한',
			            	id: 'request_date',
						    name: 'request_date',
						    xtype: 'datefield',
						    format: 'Y-m-d',
					    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    value: next2
			            },
			            {
				            		fieldLabel: '수량',
				            		xtype: 'numberfield',
				            		value: gMain.selPanel.vSELECTED_quan,
				            		anchor: '100%',
				            		id: 'pur_quan',
				            		name: 'pur_quan',
				            		minValue : 1,
				            		useThousandSeparator: false
				            }
	                   
	                ]
	            
	            },{

	            	xtype: 'fieldset',
	                title: '수주 정보',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 //fieldStyle: 'width:100%;',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                     labelWidth: 10,
	                     useThousandSeparator: false
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    //msgTarget: 'side',
							    layout: 'hbox',
							    defaults: {
							    	 labelWidth: 50,
							    	//width: 200
							    },
							    items: [{
							    	items: [{
						                xtype:'textfield',
						                fieldLabel: '지종',
						                id: 'orderPaperType',
						                value: rollInfo.commonPaperType,
						                readOnly: true,
						                width: 220
						            }, {
						                xtype:'textfield',
						                fieldLabel: '폭',
						                id: 'ordercomment',
						                name: 'ordercomment',
						                value: rollInfo.commoncomment,
						                readOnly: true,
						                width: 220
						            }]
						        }, {
						            items: [{
						                xtype:'textfield',
						                fieldLabel: '평량',
						                anchor: '100%',
						                id: 'orderdescription',
						                value: rollInfo.commondsecription,
						                readOnly: true,
						                width: 220
						            },{
						                xtype:'textfield',
						                fieldLabel: '장',
						                anchor: '100%',
						                id: 'orderremark',
						                name: 'orderremark',
						                value: rollInfo.commonremark,
						                readOnly: true,
						                width: 220
						            }]
							    },{
						            items: [{
						                xtype:'textfield',
						                fieldLabel: '칼날 Size',
						                anchor: '100%',
						                id: 'orderdescription1',
						                value: gMain.selPanel.vSELECTED_reserved_varcharb +' || ' + gMain.selPanel.vSELECTED_project_double3 +'개',
						                readOnly: true,
						                width: 220
						            },{
						                xtype:'textfield',
						                fieldLabel: '수량',
						                anchor: '100%',
						                id: 'orderquan1',
						                name: 'orderquan1',
						                value: rollInfo.commonquan,
						                readOnly: true,
						                width: 220
						            }]
							    }
							            
							    ]
							}
                      ]
	            },{

	            	xtype: 'fieldset',
	                 title: '재고',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    fieldLabel: '공통 규격',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 150,
							        useThousandSeparator: false
							    },
							    items: [
							            {
							        
							        flex : 1,
							        xtype: 'combo',
				            		//anchor: '100%',
				            		//width : 100,
				            		id: 'commonMaker',
				            		name: 'commonMaker',
				            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard'}),
				            		//store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_MAKER'}),  // 제조원
				            		displayField:   'supplier_name',
				            		//valueField: 'unique_id',
				            		emptyText: '제조원',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    value : rollInfo.commonMaker,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{unique_id}">{supplier_name}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	  //var system_code = record.get('system_code');
				            	        	   var system_code = record.get('area_code');
				            	        	   
				            	        	   Ext.getCmp('paperMaker_code').setValue(system_code);
				            	           }
				            	      }
							        
							    },   
							    {
							        xtype: 'hiddenfield',
									id :'commonPaperType_code',
							        name : 'commonPaperType_code'
								},
								{
							        xtype: 'hiddenfield',
									id :'paperMaker_code',
							        name : 'paperMaker_code'
										},
							    {
							    	fieldLabel: '지종',
			                    	xtype: 'combo',
				            		id: 'commonPaperType',
				            		name: 'commonPaperType',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '지종',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            	    value: rollInfo.commonPaperType,
				            	    //value: 'SC',
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		//return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      		return '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	   var system_code = record.get('system_code');
				            	        	   Ext.getCmp('commonPaperType_code').setValue(system_code);
				            	           }
				            	      }
							      
							    },
							    {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'commondsecription',
							        name : 'commondsecription',
							        value: rollInfo.commondsecription,
							        emptyText : '평량'
							      
							    }
							    ]
							}
                        ]
	               
	            },	
	            
	            
	            {
	            	xtype: 'fieldset',
	                 title: '롤 컷팅',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        anchor: '100%',
							        useThousandSeparator: false
							    },
							    items: [{
							    	
			                    	xtype: 'textfield',
				            		
				            		id: 'stock_type1',
				            		name: 'stock_type1',
				            		value: 'ROLL',
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_comment1',
							        name : 'stock_org_comment1',
							        value : rollInfo.stock_org_comment1,
							        emptyText : '폭',
							        
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_remark1',
							        name : 'stock_org_remark1',
							        emptyText : '장',
							        value : rollInfo.stock_org_remark1
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_quan1', 
							        name : 'stock_org_quan1',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : rollInfo.stock_org_quan1
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'textfield',
				            		id: 'stock_use1',
				            		name: 'stock_use1',
				            		value: '재단 있음',
				            		emptyText: '선택'
							    },{
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_comment1',
							        name : 'stock_aft_comment1',
							        //disabled : true,
							        emptyText : '폭',
							        value : rollInfo.stock_aft_comment1
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_remark1',
							        name : 'stock_aft_remark1',
							        emptyText : '장',
							        value : rollInfo.stock_aft_remark1
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_quan1',
							        name : 'stock_aft_quan1',
							        emptyText : '수량',
							        value : rollInfo.stock_aft_quan1
							      
							    }
							    ]
							},
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	
			                    	xtype: 'textfield',
				            		
				            		id: 'stock_type2',
				            		name: 'stock_type2',
				            		value: 'ROLL',
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_comment2',
							        name : 'stock_org_comment2',
							        emptyText : '폭',
							        value : rollInfo.stock_org_comment2
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_remark2',
							        name : 'stock_org_remark2',
							        emptyText : '장',
							        value : rollInfo.stock_org_remark2
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_quan2', 
							        name : 'stock_org_quan2',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : rollInfo.stock_org_quan2
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'textfield',
				            		id: 'stock_use2',
				            		name: 'stock_use2',
				            		value: '재단 있음',
				            		emptyText: '선택'
							    },{
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_comment2',
							        name : 'stock_aft_comment2',
							        //disabled : true,
							        emptyText : '폭',
							        value : rollInfo.stock_aft_comment2
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_remark2',
							        name : 'stock_aft_remark2',
							        emptyText : '장',
							        value : rollInfo.stock_aft_remark2
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_quan2',
							        name : 'stock_aft_quan2',
							        emptyText : '수량',
							        value : rollInfo.stock_aft_quan2
							      
							    }
							    ]
							}
                         ]
	               
	            },{
	            	xtype: 'fieldset',
	                 title: 'Sheet 재단',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                     useThousandSeparator: false
	                 },

	                 items :[{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type3',
				            		name: 'stock_type3',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 3,
				            	    value: sheetInfo.stock_type3
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_comment3',
							        name : 'stock_org_comment3',
							        emptyText : '폭',
							        value: sheetInfo.stock_org_comment3
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_remark3',
							        name : 'stock_org_remark3',
							        emptyText : '장',
							        value: sheetInfo.stock_org_remark3
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_quan3', 
							        name : 'stock_org_quan3',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value: sheetInfo.stock_org_quan3
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use3',
				            		name: 'stock_use3',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'ASC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 3,
				            	    value : sheetInfo.stock_use3
				            		
							    },{
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_comment3',
							        name : 'stock_aft_comment3',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.stock_aft_comment3
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_remark3',
							        name : 'stock_aft_remark3',
							        emptyText : '장',
							        value : sheetInfo.stock_aft_remark3
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_quan3',
							        name : 'stock_aft_quan3',
							        emptyText : '수량',
							        value : sheetInfo.stock_aft_quan3
							      
							    }
							    ]
							},{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type4',
				            		name: 'stock_type4',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 4,
				            	    value : sheetInfo.stock_type4
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_comment4',
							        name : 'stock_org_comment4',
							        emptyText : '폭',
							        value : sheetInfo.stock_org_comment4
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_remark4',
							        name : 'stock_org_remark4',
							        emptyText : '장',
							        value : sheetInfo.stock_org_remark4
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_quan4', 
							        name : 'stock_org_quan4',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : sheetInfo.stock_org_quan4
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use4',
				            		name: 'stock_use4',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 4,
				            	    value : sheetInfo.stock_use4
				            		
							    },{
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_comment4',
							        name : 'stock_aft_comment4',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.stock_aft_comment4
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_remark4',
							        name : 'stock_aft_remark4',
							        emptyText : '장',
							        value : sheetInfo.stock_aft_remark4
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_quan4',
							        name : 'stock_aft_quan4',
							        emptyText : '수량',
							        value : sheetInfo.stock_aft_quan4
							      
							    }
							    ]
							},{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type5',
				            		name: 'stock_type5',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            	    value : sheetInfo.stock_type5
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_comment5',
							        name : 'stock_org_comment5',
							        emptyText : '폭',
							        value : sheetInfo.stock_org_comment5
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_remark5',
							        name : 'stock_org_remark5',
							        emptyText : '장',
							        value : sheetInfo.stock_org_remark5
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_quan5', 
							        name : 'stock_org_quan5',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : sheetInfo.stock_org_quan5
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use5',
				            		name: 'stock_use5',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5				            		
							    },{
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_comment5',
							        name : 'stock_aft_comment5',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.stock_aft_comment5
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_remark5',
							        name : 'stock_aft_remark5',
							        emptyText : '장',
							        value : sheetInfo.stock_aft_remark5
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_quan5',
							        name : 'stock_aft_quan5',
							        emptyText : '수량',
							        value : sheetInfo.stock_aft_quan5
							      
							    }
							    ]
							}
                        ]
	               
	            },
	            {

	            	xtype: 'fieldset',
	                 title: '구매 재단규격',
	                 boder: false,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     //anchor: '100%'
	                	 useThousandSeparator: false
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'textfield',
				            		id: 'pur_type',
				            		name: 'pur_type',
				            		editable: false
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_comment',
							        name : 'pur_org_comment',
							        emptyText : '폭',
							        value : sheetInfo.pur_comment,
							        readOnly: true
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_remark',
							        name : 'pur_org_remark',
							        emptyText : '장',
							        value : sheetInfo.pur_remark,
							        readOnly: true
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_quan', 
							        name : 'pur_org_quan',
							        value : sheetInfo.pur_org_quan,
							        emptyText : '수량',
							        readOnly: true
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'pur_use',
				            		name: 'pur_use',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		//emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            	    value : sheetInfo.pur_use				            		
							    },{
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_comment',
							        name : 'pur_aft_comment',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.pur_aft_comment
							        //readOnly: true
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_remark',
							        name : 'pur_aft_remark',
							        emptyText : '장',
							        value : sheetInfo.pur_aft_remark
							        //readOnly: true
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_quan',
							        name : 'pur_aft_quan',
							        emptyText : '수량',
							        value : sheetInfo.pur_aft_quan,
							        editable: true
							      
							    }
							    ]
							}
	                     ]
	            }
	            ] // items
	                    });//Panel end...
					myHeight = 540;
					myWidth = 1200;
	     

				prwin = this.prwinopennotpaper(form);
			
		 } // uniqueId if end
    },
    treatSubPo: function() {
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	
    	var next2 = gUtil.getNextday(2);
    	var form = null;
    	 if(uniqueId == undefined || uniqueId == -1){
    		 this.addSubPo();
		 }else {
	    	var pj_uid = uniqueId;
	    
				form = Ext.create('Ext.form.Panel', {
			    		id: gu.id('formPanel'),
			    		xtype: 'form',
			    		frame: false ,
			    		border: false,
			    		bodyPadding: '3 3 0',
			    		region: 'center',
			            fieldDefaults: {
			                labelAlign: 'middle',
			                msgTarget: 'side'
			            },
			            defaults: {
			                anchor: '100%',
			                labelWidth: 100
			            },
			            items: [
			            	{
			                	xtype: 'component',
			                	anchor: '100%'
			            	},
			            	{
			            		fieldLabel: '주문처',
			            		xtype: 'combo',    
			            		anchor: '100%',
			            		id: 'supplier_information',
			            		name: 'supplier_information',
			            		mode: 'local',
			            		//value: 'supplier_name',
			            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard', supplierType: 'K'}),
			            		displayField:   'supplier_name',
			            		valueField: 'unique_id',
			            		emptyText: '선택',
			            		sortInfo: { field: 'create_date', direction: 'DESC' },
			            	    typeAhead: false,
			            	    //hideLabel: true,
			            	    minChars: 1,
			            		listConfig:{
			            			loadingText: '검색중...',
			            	        emptyText: '일치하는 항목 없음.',
			            	      	getInnerTpl: function(){
			            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
			            	      	}
			            		},
			            		listeners: {
			            	           select: function (combo, record) {
			            	           	
			            	           }
			            	      }
			            		
			            	},{
			            		fieldLabel: '납품장소', //ppo1_address,
			            		xtype: 'combo',
			            		//anchor: '100%',
			            		width : 200,
			            		//value:'' ,
			            		id: 'delivery_address_1',
			            		name: 'delivery_address_1',
			            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'outstore', hasOwn: true}),
			            		displayField:   'supplier_name',
			            		valueField: 'unique_id',
			            		emptyText: 'DABP',
			            		sortInfo: { field: 'create_date', direction: 'DESC' },
			            	    //typeAhead: false,
			            	    //hideLabel: true,
			            	    minChars: 1,
			            		listConfig:{
			            			loadingText: '검색중...',
			            	        emptyText: '일치하는 항목 없음.',
			            	      	getInnerTpl: function(){
			            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
			            	      	}
			            		},
			            		listeners: {
			            	           select: function (combo, record) {
			            	           	
			            	           }
			            	      }
			            	},{
			            	    	fieldLabel: '전달 특기사항',//ppo1_request,
			            	     	xtype: 'textarea',
			            	    	rows: 4,
			            	    	anchor: '100%',
			            	    	id:   'item_abst',
			            	    	name: 'item_abst',
			            	    	value: gMain.selPanel.vSELECTED_request_comment,
			            	    	emptyText: '특기사항을 입력해주세요'
			            	}
			            	,{
			            		fieldLabel: '품명',
				            	xtype: 'textfield',
				            	anchor: '100%',
				            	value: gMain.selPanel.vSELECTED_item_name,
				            	id: 'item_name',
				            	name: 'item_name'
				            },{
				            		fieldLabel: '규격',
					            	xtype: 'textfield',
					            	anchor: '100%',
					            	value: gMain.selPanel.vSELECTED_specification,
					            	id: 'specification',
					            	name: 'specification'
				            },
				            /*{
		            		fieldLabel: '단가',
		            		xtype: 'numberfield',
		            		//value: '',
		            		anchor: '100%',
		            		id: 'sales_price',
		            		name: 'sales_price',
		            		minValue : 1,
		            		useThousandSeparator: false
				            },*/
			            {
			            	fieldLabel: '납품 기한',
			            	id: 'request_date',
						    name: 'request_date',
						    xtype: 'datefield',
						    format: 'Y-m-d',
		    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		    		    	value: next2
						    
			            },
			            ,{
			            	fieldLabel: '수량',
		            		xtype: 'numberfield',
		            		value: gMain.selPanel.vSELECTED_quan,
		            		anchor: '100%',
		            		id: 'pur_quan',
		            		name: 'pur_quan',
		            		minValue : 1,
		            		useThousandSeparator: false
			            },
			            {
						    xtype: 'hiddenfield',
							id :'pur_paper_type',
						    name : 'pur_paper_type',
						    value: 'k'
						},
			            ]//item end..
					
			                    });//Panel end...
					myHeight = 350;
					myWidth = 650;
	     

				prwin = this.prwinopennotpaper(form);
			
		 } // uniqueId if end
    },
    
    //임의 주문(원지)
    treatPaperAddPoRoll: function() {
    	var next = gUtil.getNextday(0);
    	 form = Ext.create('Ext.form.Panel', {
			 id: gu.id('formPanel'),
			 xtype: 'form',
			 frame: true ,
	    		border: false,
	    		bodyPadding: 10,
	    		region: 'center',
	    		layout: 'column',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                layout: 'form',
	                xtype: 'container',
	                defaultType: 'textfield',
	                style: 'width: 50%'
	            },
	            items:[{
	            	xtype: 'fieldset',
                 title: '구매',
                 width : 400,
                 height : 400,
                 margins: '0 20 0 0',
                 collapsible: true,
                 anchor: '100%',
                 defaults: {
                     labelWidth: 89,
                     anchor: '100%',
                     layout: {
                         type: 'hbox',
                         defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                     }
                 },
                items: [
                    { fieldLabel: '주문처',
	            		xtype: 'combo',    
	            		anchor: '100%',
	            		/*id: 'stcok_pur_supplier_info',
	            		name: 'stcok_pur_supplier_info',*/
	            		id: 'supplier_information',
	            		name: 'supplier_information',
	            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard'}),
	            		displayField:   'supplier_name',
	            		valueField: 'unique_id',
	            		emptyText: '선택',
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    typeAhead: false,
	            	    //hideLabel: true,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
	            	      	}
	            		},
	            		listeners: {
	            	           select: function (combo, record) {
	            	        	   var reccode = record.get('area_code');
	            	        	   Ext.getCmp('maker_code').setValue(reccode);
	            	           }
	            	      }	
                    },
                    {
					    xtype: 'hiddenfield',
						id :'maker_code',
					    name : 'maker_code'
					},
                    { fieldLabel: '납품장소',
            		  xtype: 'combo',
	            		width : 200,
	            		value: 'DABP',
	            		id: 'delivery_address_1',
	            		name: 'delivery_address_1',
	            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'outstore', hasNull: true}),
	            		displayField:   'supplier_name',
	            		valueField: 'supplier_name',
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
	            	      	}
	            		},
	            		listeners: {

	            	      }
	            	},
                    { fieldLabel: '비고',
            	      xtype: 'textarea',
            	      rows: 4,
            	      anchor: '100%',
            	      id:   'item_abst',
            	      name: 'item_abst',
            	      
                    },
                    { fieldLabel: '롤 / 시트',
                    	xtype: 'combo',
	            		id: 'pur_paper_type',
	            		name: 'pur_paper_type',
	            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_TYPE', hasNull:false}),  // 지종 
	            		displayField:   'code_name_kr',
	            		valueField: 'system_code',
	            		emptyText: '선택',
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    typeAhead: false,
	            	    //hideLabel: true,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
	            	      	}
	            		},
	            		listeners: {
	            	           select: function (combo, record) {
	            	           	
	            	          var val = record.get('systemCode')
	            	          console_logs('여기 롤 val', val);
	            	          if(val == 'ROLL'){
	            	        	  Ext.getCmp('remark').setValue('0');
	            	        	 
	            	          }else{
	            	        	  Ext.getCmp('remark').setValue('');
	            	          }
	            	     
	            	           }
	            	      }
				    },
                    { fieldLabel: '지종',
                    	xtype: 'combo',
	            		//anchor: '100%',
                    	mode: 'local',
	            		width : 200,
	            		
	            		id: 'item_name',
	            		name: 'item_name',
	            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_TYPE'}),  // 지종 
	            		displayField:   'code_name_kr',
	            		valueField: 'code_name_kr',
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    typeAhead: false,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		//return '<div data-qtip="{code_name_kr}">{code_name_kr}</div>';
	            	      		return '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>';
	            	      	}
	            		},
                    },
                    { fieldLabel: '평량',
	                      xtype : 'numberfield',
	                      id : 'description',
	                      name : 'description',
	                      useThousandSeparator: false,
	                      minValue : 1,
	                      
	                },
                    { fieldLabel: '폭',
                      xtype : 'numberfield',
                      id : 'comment',
                      name : 'comment',
                      useThousandSeparator: false,
                     
                    },
                    { fieldLabel: '장',
                      xtype : 'numberfield',
                      id : 'remark',
                      name : 'remark',
                      useThousandSeparator: false,
                     
                      
                    },
                    { fieldLabel: '수량',
                      xtype : 'numberfield',
                      id : 'pur_quan',
                      name : 'pur_quan',
                      useThousandSeparator: false,
                     
                     
                    },
                    { fieldLabel: '납품기한',
                    	id: 'request_date',
					    name: 'request_date',
					    xtype: 'datefield',
					    //value: gMain.selPanel.request_date,
					    format: 'Y-m-d',
	    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'	
	    		    	value : next
                    }
                   
                ]
	            }]
		 })
		 myHeight = 500;
			myWidth = 420;

		prwin = this.prwinopennoid(form);
    },
    
    treatPaperPoRoll: function() {
    	
    	
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	
    	var next = gUtil.getNextday(0);
    	 
    	var request_date = gMain.selPanel.request_date;
    	var form = null;
    	
    	
		 if(uniqueId == undefined || uniqueId < 0){
			
			this.treatPaperAddPoRoll();
			 
		 }else {
	    	var pj_uid = uniqueId;
      	
	    	form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		//xtype: 'form-multicolumn',
	    		frame: true ,
	    		border: false,
	    		bodyPadding: 10,
	    		region: 'center',
	    		layout: 'column',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                layout: 'form',
	                xtype: 'container',
	                defaultType: 'textfield',
	                style: 'width: 50%'
	            },
	            items: [{
	            	 xtype: 'fieldset',
	                 title: '구매',
	                 width : 300,
	                 height : 450,
	                 margins: '0 20 0 0',
	                 collapsible: true,
	                 anchor: '100%',
	                 defaults: {
	                     labelWidth: 89,
	                     anchor: '100%',
	                     useThousandSeparator: false,
	                     layout: {
	                         type: 'hbox',
	                         defaultMargins: {top: 0, right: 100, bottom: 0, left: 10},
	                         anchor: '30%'
	                     }
	                 },
	                items: [{
	                	fieldLabel: 'LOT명',
		            	xtype: 'textfield',
		            	anchor: '100%',
		            	value: gMain.selPanel.vSELECTED_lot_name,
		            	
	                	},
	                    { fieldLabel: '주문처',
		            		xtype: 'combo',    
		            		anchor: '100%',
		            		id: 'supplier_information',
		            		name: 'supplier_information',
		            		//mode: 'local',
		            		//value: 'supplier_name',
		            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard'}),
		            		//store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_MAKER'}),  // 제조원
		            		displayField:   'supplier_name',
		            		valueField: 'unique_id',
		            		emptyText: '선택',
		            		sortInfo: { field: 'create_date', direction: 'DESC' },
		            	    typeAhead: false,
		            	    //hideLabel: true,
		            	    minChars: 1,
		            		listConfig:{
		            			loadingText: '검색중...',
		            	        emptyText: '일치하는 항목 없음.',
		            	      	getInnerTpl: function(){
		            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
		            	      	}
		            		},
		            		listeners: {
		            	           select: function (combo, record) {
		            	           
		            	       		//var system_code = record.get('system_code');
		            	       		
		            	   			var supplier_name = record.get('supplier_name');
		            	   			var system_code = record.get('area_code');
		            	   			
		            	   			
		            					Ext.getCmp('commonMaker').setValue(supplier_name);
		            					Ext.getCmp('paperMaker_code').setValue(system_code);
		            					
		            					Ext.getCmp('supplier_infoname').setValue(supplier_name);
		            					//Ext.getCmp('paperMaker_code').setValue(system_code);
		            				
		            					
		            	   			
		            	           }
		            	      }	
	                    },
	                    {
						    xtype: 'hiddenfield',
							id :'supplier_infoname',
						    name : 'supplier_infoname'
						},
	                    { fieldLabel: '납품장소',
	            		  xtype: 'combo',
		            		width : 200,
		            		value: 'DABP',
		            		id: 'delivery_address_1',
		            		name: 'delivery_address_1',
		            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'outstore', hasOwn: true}),
		            		displayField:   'supplier_name',
		            		valueField: 'supplier_name',
		            		sortInfo: { field: 'create_date', direction: 'DESC' },
		            	    minChars: 1,
		            		listConfig:{
		            			loadingText: '검색중...',
		            	        emptyText: '일치하는 항목 없음.',
		            	      	getInnerTpl: function(){
		            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
		            	      	}
		            		},
		            		listeners: {
		            	
		            	      }
		            	},
	                    { fieldLabel: '비고',
	            	      xtype: 'textarea',
	            	      rows: 4,
	            	      anchor: '100%',
	            	      id:   'item_abst',
	            	      name: 'item_abst',
	            	      value: gMain.selPanel.vSELECTED_req_info
	                    },
	                    { fieldLabel: '롤 / 시트',
	                    	xtype: 'combo',
		            		id: 'pur_paper_type',
		            		name: 'pur_paper_type',
		            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_TYPE'}),  // 지종 
		            		displayField:   'code_name_kr',
		            		valueField: 'system_code',
		            		emptyText: '선택',
		            		sortInfo: { field: 'create_date', direction: 'DESC' },
		            	    typeAhead: false,
		            	    minChars: 1,
		            		listConfig:{
		            			loadingText: '검색중...',
		            	        emptyText: '일치하는 항목 없음.',
		            	      	getInnerTpl: function(){
		            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
		            	      	}
		            		},
		            		listeners: {
		            	           select: function (combo, record) {
		            	           	console_logs('여기 롤 콤보', record);
		            	          var val = record.get('systemCode')
		            	          
		            	          if(val == 'ROLL'){
		            	        	  Ext.getCmp('remark').setValue('0');
		            	        	  Ext.getCmp('pur_org_quan').setValue('0');
		            	        	  Ext.getCmp('pur_quan').setValue('1');
		            	        	  
		            	        	  
		            	        	  //Ext.getCmp('remark').setReadOnly(true);
		            	        	  //Ext.getCmp('pur_org_quan').setReadOnly(true);
		            	          }else{
		            	        	  
		            	          }
		            	            
		            	        	Ext.getCmp('pur_type').setValue(val);
	            	           }
		            	      }
					    },
	                    { fieldLabel: '지종',
	                    	xtype: 'combo',
		            		//anchor: '100%',
	                    	mode: 'local',
		            		width : 200,
		            		value: gMain.selPanel.vSELECTED_item_name,
		            		id: 'item_name',
		            		name: 'item_name',
		            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_TYPE', hasOwn: true}),  // 지종 
		            		displayField:   'code_name_kr',
		            		//valueField: 'system_code',
		            		//emptyText: gMain.selPanel.vSELECTED_item_name,
		            		sortInfo: { field: 'create_date', direction: 'DESC' },
		            	    typeAhead: false,
		            	    //hideLabel: true,
		            	    minChars: 1,
		            		listConfig:{
		            			loadingText: '검색중...',
		            	        emptyText: '일치하는 항목 없음.',
		            	      	getInnerTpl: function(){
		            	      		//return '<div data-qtip="{code_name_kr}">{code_name_kr}</div>';
		            	      		return '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>';
		            	      	}
		            		},
		            		listeners: {
		            	           select: function (combo, record) {
		            	          
		            	           	var comcode = record.get('system_code');
		            	           	var comcodename = record.get('code_name_kr');
		            	           	console_logs('지종', comcodename);
	            	           	Ext.getCmp('commonPaperType').setValue(comcodename);
	            	           	Ext.getCmp('commonPaperType_code').setValue(comcode);
	            	           	
		            	           	
		            	           }
		            	      }
	                    },
	                    { fieldLabel: '평량',
		                      xtype : 'numberfield',
		                      id : 'description',
		                      name : 'description',
		                      useThousandSeparator: false,
		                      minValue : 1,
		                      value: gMain.selPanel.vSELECTED_description,
		                      listeners: {
		                          change: function(field, value) {
		                        	  Ext.getCmp('commondsecription').setValue(value);
		                          }
		                      }
		                },
	                    { fieldLabel: '폭',
	                      xtype : 'numberfield',
	                      id : 'comment',
	                      name : 'comment',
	                      useThousandSeparator: false,
	                      value : gMain.selPanel.vSELECTED_comment,
	                      listeners: {
	                          change: function(field, value) {
	                        	  var puruse = "재단있음";
	                        	  Ext.getCmp('pur_org_comment').setValue(value);
	                        	  Ext.getCmp('pur_use').setValue(puruse);
	                        	  
	                          }
	                      }
	                    },
	                    { fieldLabel: '장',
	                      xtype : 'numberfield',
	                      id : 'remark',
	                      name : 'remark',
	                      useThousandSeparator: false,
	                      value : gMain.selPanel.vSELECTED_remark,
	                      listeners: {
	                          change: function(field, value) {
	                        	  Ext.getCmp('pur_org_remark').setValue(value);
	                          }
	                      }
	                    },
	                    { fieldLabel: '수량',
	                      xtype : 'numberfield',
	                      id : 'pur_quan',
	                      name : 'pur_quan',
	                      useThousandSeparator: false,
	                      value: gMain.selPanel.vSELECTED_quan,
	                      listeners: {
	                          change: function(field, value) {
	                        	  Ext.getCmp('pur_org_quan').setValue(value);
	                          }
	                      }
	                    },
	                    /*{ fieldLabel: '단가',
		                      xtype : 'numberfield',
		                      id : 'sales_price',
		                      name : 'sales_price',
		                      useThousandSeparator: false,
		                      value : '0'
	                    },*/
	                    { fieldLabel: '납품기한',
	                    	id: 'request_date',
						    name: 'request_date',
						    xtype: 'datefield',
						    //value: gMain.selPanel.request_date,
						    format: 'Y-m-d',
		    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		    		    	value: next
	                    },
	                    { fieldLabel: '특이사항',
		            	      xtype: 'textarea',
		            	      rows: 5,
		            	      //grow: true,
 		            	      anchor: '100%',
		            	      id:   'pj_description',
		            	      name: 'pj_description',
		            	      value: gMain.selPanel.vSELECTED_pj_description,
		                    },
	                   
	                ]
	            
	            },{

	            	xtype: 'fieldset',
	                title: '수주 정보',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 //fieldStyle: 'width:100%;',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                     labelWidth: 10,
	                     useThousandSeparator: false
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    //msgTarget: 'side',
							    layout: 'hbox',
							    defaults: {
							    	 labelWidth: 50,
							    	//width: 200
							    },
							    items: [{
							    	items: [{
						                xtype:'textfield',
						                fieldLabel: '지종',
						                id: 'orderPaperType',
						                value: gMain.selPanel.vSELECTED_item_name,
						                readOnly: true,
						                width: 220
						            }, {
						                xtype:'textfield',
						                fieldLabel: '폭',
						                id: 'ordercomment',
						                name: 'ordercomment',
						                value: gMain.selPanel.vSELECTED_comment,
						                readOnly: true,
						                width: 220
						            }]
						        }, {
						            items: [{
						                xtype:'textfield',
						                fieldLabel: '평량',
						                anchor: '100%',
						                id: 'orderdescription',
						                value: gMain.selPanel.vSELECTED_description,
						                readOnly: true,
						                width: 220
						            },{
						                xtype:'textfield',
						                fieldLabel: '장',
						                anchor: '100%',
						                id: 'orderremark',
						                name: 'orderremark',
						                value: gMain.selPanel.vSELECTED_remark,
						                readOnly: true,
						                width: 220
						            }]
							    },{
						            items: [{
						                xtype:'textfield',
						                fieldLabel: '칼날 Size',
						                anchor: '100%',
						                id: 'orderdescription1',
						                value: gMain.selPanel.vSELECTED_reserved_varcharb +' || ' + gMain.selPanel.vSELECTED_project_double3 +'개',
						                readOnly: true,
						                width: 220
						            },{
						                xtype:'textfield',
						                fieldLabel: '수량',
						                anchor: '100%',
						                id: 'orderquan1',
						                name: 'orderquan1',
						                value: gMain.selPanel.vSELECTED_quan,
						                readOnly: true,
						                width: 220
						            }]
							    }
							            
							    ]
							}
                      ]
	            },{

	            	xtype: 'fieldset',
	                 title: '재고',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    fieldLabel: '공통 규격',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 150,
							        useThousandSeparator: false
							    },
							    items: [
							            {
							        
							        flex : 1,
							        xtype: 'combo',
				            		//anchor: '100%',
				            		//width : 100,
				            		id: 'commonMaker',
				            		name: 'commonMaker',
				            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard'}),
				            		//store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_MAKER'}),  // 제조원
				            		displayField:   'supplier_name',
				            		//valueField: 'unique_id',
				            		emptyText: '제조원',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{unique_id}">{supplier_name}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	  //var system_code = record.get('system_code');
				            	        	   var system_code = record.get('area_code');
				            	        	   
				            	        	   Ext.getCmp('paperMaker_code').setValue(system_code);
				            	           }
				            	      }
							        
							    },   
							    {
							        xtype: 'hiddenfield',
									id :'commonPaperType_code',
							        name : 'commonPaperType_code'
								},
								{
							        xtype: 'hiddenfield',
									id :'paperMaker_code',
							        name : 'paperMaker_code'
										},
							    {
							    	fieldLabel: '지종',
			                    	xtype: 'combo',
				            		id: 'commonPaperType',
				            		name: 'commonPaperType',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '지종',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            	    value: gMain.selPanel.vSELECTED_item_name,
				            	    //value: 'SC',
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		//return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      		return '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	   var system_code = record.get('system_code');
				            	        	   Ext.getCmp('commonPaperType_code').setValue(system_code);
				            	           }
				            	      }
							      
							    },
							    {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'commondsecription',
							        name : 'commondsecription',
							        value: gMain.selPanel.vSELECTED_description,
							        emptyText : '평량'
							      
							    }
							    ]
							}
                        ]
	               
	            },	
	            
	            
	            {
	            	xtype: 'fieldset',
	                 title: '롤 컷팅',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        anchor: '100%',
							        useThousandSeparator: false
							    },
							    items: [{
							    	
			                    	xtype: 'textfield',
				            		
				            		id: 'stock_type1',
				            		name: 'stock_type1',
				            		value: 'ROLL',
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_comment1',
							        name : 'stock_org_comment1',
							        emptyText : '폭',
							        listeners: {
				                          change: function(field, value) {
				                        	  if(value == null){
				                        		  Ext.getCmp('stock_org_remark1').setValue('');
					                        	  Ext.getCmp('stock_org_quan1').setValue('');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment1').setValue('');
					                        	  Ext.getCmp('stock_aft_remark1').setValue('');
					                        	  Ext.getCmp('stock_aft_quan1').setValue('');
				                        	  }else{
				                        		  Ext.getCmp('stock_org_remark1').setValue('0');
					                        	  Ext.getCmp('stock_org_quan1').setValue('0');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment1').setValue(value);
					                        	  Ext.getCmp('stock_aft_remark1').setValue(gMain.selPanel.vSELECTED_remark);
					                        	  Ext.getCmp('stock_aft_quan1').setValue(gMain.selPanel.vSELECTED_quan);
				                        	  }
				                          }
				                      }
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_remark1',
							        name : 'stock_org_remark1',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_quan1', 
							        name : 'stock_org_quan1',
							        fieldLabel: 'Last',
							        emptyText : '수량'
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'textfield',
				            		id: 'stock_use1',
				            		name: 'stock_use1',
				            		value: '재단 있음',
				            		emptyText: '선택'
							    },{
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_comment1',
							        name : 'stock_aft_comment1',
							        //disabled : true,
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_remark1',
							        name : 'stock_aft_remark1',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_quan1',
							        name : 'stock_aft_quan1',
							        emptyText : '수량'
							      
							    }
							    ]
							},
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	
			                    	xtype: 'textfield',
				            		
				            		id: 'stock_type2',
				            		name: 'stock_type2',
				            		value: 'ROLL',
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_comment2',
							        name : 'stock_org_comment2',
							        emptyText : '폭',
							        listeners: {
				                          change: function(field, value) {
				                        	  if(value == null){
				                        		  Ext.getCmp('stock_org_remark2').setValue('');
					                        	  Ext.getCmp('stock_org_quan2').setValue('');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment2').setValue('');
					                        	  Ext.getCmp('stock_aft_remark2').setValue('');
					                        	  Ext.getCmp('stock_aft_quan2').setValue('');
				                        	  }else{
				                        		  Ext.getCmp('stock_org_remark2').setValue('0');
					                        	  Ext.getCmp('stock_org_quan2').setValue('0');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment2').setValue(gMain.selPanel.vSELECTED_comment);
					                        	  Ext.getCmp('stock_aft_remark2').setValue(gMain.selPanel.vSELECTED_remark);
					                        	  Ext.getCmp('stock_aft_quan2').setValue(gMain.selPanel.vSELECTED_quan);
					                        	  
					                        	  
				                        	  }
				                        	  
				                          }
				                      }
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_remark2',
							        name : 'stock_org_remark2',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_quan2', 
							        name : 'stock_org_quan2',
							        fieldLabel: 'Last',
							        emptyText : '수량'
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'textfield',
				            		id: 'stock_use2',
				            		name: 'stock_use2',
				            		value: '재단 있음',
				            		emptyText: '선택'
							    },{
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_comment2',
							        name : 'stock_aft_comment2',
							        //disabled : true,
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_remark2',
							        name : 'stock_aft_remark2',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_quan2',
							        name : 'stock_aft_quan2',
							        emptyText : '수량'
							      
							    }
							    ]
							}
                         ]
	               
	            },{
	            	xtype: 'fieldset',
	                 title: 'Sheet 재단',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                     useThousandSeparator: false
	                 },

	                 items :[{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type3',
				            		name: 'stock_type3',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 3,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	           	console_logs('여기 롤 콤보', combo);
				            	           	console_logs('여기 롤 record', record);
				            	           	if(record.get('system_code') == 'NO'){
				            	           	 Ext.getCmp('stock_org_remark3').setValue('');
				                        	  Ext.getCmp('stock_org_quan3').setValue('');
				                        	  
				                        	  Ext.getCmp('stock_use3').setValue('선택');
				                        	  Ext.getCmp('stock_aft_comment3').setValue('');
				                        	  Ext.getCmp('stock_aft_remark3').setValue('');
				                        	  Ext.getCmp('stock_aft_quan3').setValue('');
				            	           	}else{
				            	           		//Ext.getCmp('stock_org_remark3').setValue('0');
					                        	//Ext.getCmp('stock_org_quan3').setValue('0');
				            	           		Ext.getCmp('stock_use3').setValue('재단 있음');
					                        	Ext.getCmp('stock_aft_comment3').setValue(gMain.selPanel.vSELECTED_comment);
					                        	Ext.getCmp('stock_aft_remark3').setValue(gMain.selPanel.vSELECTED_remark);
					                        	console_logs('>>>>>>>', gMain.selPanel.vSELECTED_remark);
					                        	Ext.getCmp('stock_aft_quan3').setValue(gMain.selPanel.vSELECTED_quan);
					                        	  
				            	           	}
				            	           }
				            	      }
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_comment3',
							        name : 'stock_org_comment3',
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_remark3',
							        name : 'stock_org_remark3',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_quan3', 
							        name : 'stock_org_quan3',
							        fieldLabel: 'Last',
							        emptyText : '수량'
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use3',
				            		name: 'stock_use3',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'ASC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 3,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	          
				            	           }
				            	      }
							    },{
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_comment3',
							        name : 'stock_aft_comment3',
							        //disabled : true,
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_remark3',
							        name : 'stock_aft_remark3',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_quan3',
							        name : 'stock_aft_quan3',
							        emptyText : '수량'
							      
							    }
							    ]
							},{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type4',
				            		name: 'stock_type4',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 4,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	   if(record.get('system_code') == 'NO'){
						            	           	 Ext.getCmp('stock_org_remark4').setValue('');
						                        	  Ext.getCmp('stock_org_quan4').setValue('');
						                        	  
						                        	  Ext.getCmp('stock_use4').setValue('선택');
						                        	  Ext.getCmp('stock_aft_comment4').setValue('');
						                        	  Ext.getCmp('stock_aft_remark4').setValue('');
						                        	  Ext.getCmp('stock_aft_quan4').setValue('');
						            	           	}else{
						            	           		//Ext.getCmp('stock_org_remark3').setValue('0');
							                        	//Ext.getCmp('stock_org_quan3').setValue('0');
						            	           		Ext.getCmp('stock_use4').setValue('재단 있음');
							                        	Ext.getCmp('stock_aft_comment4').setValue(gMain.selPanel.vSELECTED_comment);
							                        	Ext.getCmp('stock_aft_remark4').setValue(gMain.selPanel.vSELECTED_remark);
							                        	Ext.getCmp('stock_aft_quan4').setValue(gMain.selPanel.vSELECTED_quan);
							                        	  
						            	           	}
				            	           }
				            	      }
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_comment4',
							        name : 'stock_org_comment4',
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_remark4',
							        name : 'stock_org_remark4',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_quan4', 
							        name : 'stock_org_quan4',
							        fieldLabel: 'Last',
							        emptyText : '수량'
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use4',
				            		name: 'stock_use4',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 4,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	           	var system_code = record.get('system_code');
				            	           	console_logs('systemcode', system_code);
				            	           	if(system_code == 'NO'){
				            	           		var hipon = '없음';
				            	           		Ext.getCmp('stock_aft_comment4').setValue('');
				            	           		Ext.getCmp('stock_aft_remark4').setValue('');
				            	           		Ext.getCmp('stock_aft_quan4').setValue('');
				            	           		
				            	           		
				            	           		
				            	           	}else{
				            	           		Ext.getCmp('stock_aft_comment4').setValue(gMain.selPanel.vSELECTED_comment);
					                        	Ext.getCmp('stock_aft_remark4').setValue(gMain.selPanel.vSELECTED_remark);
					                        	Ext.getCmp('stock_aft_quan4').setValue(gMain.selPanel.vSELECTED_quan);
				            	           	}
				            	           	
				            	           }
				            	      }
							    },{
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_comment4',
							        name : 'stock_aft_comment4',
							        //disabled : true,
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_remark4',
							        name : 'stock_aft_remark4',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_quan4',
							        name : 'stock_aft_quan4',
							        emptyText : '수량'
							      
							    }
							    ]
							},{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type5',
				            		name: 'stock_type5',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	   if(record.get('system_code') == 'NO'){
						            	           	 Ext.getCmp('stock_org_remark5').setValue('');
						                        	  Ext.getCmp('stock_org_quan5').setValue('');
						                        	  
						                        	  Ext.getCmp('stock_use5').setValue('선택');
						                        	  Ext.getCmp('stock_aft_comment5').setValue('');
						                        	  Ext.getCmp('stock_aft_remark5').setValue('');
						                        	  Ext.getCmp('stock_aft_quan5').setValue('');
						            	           	}else{
						            	           		//Ext.getCmp('stock_org_remark3').setValue('0');
							                        	//Ext.getCmp('stock_org_quan3').setValue('0');
						            	           		Ext.getCmp('stock_use5').setValue('재단 있음');
							                        	Ext.getCmp('stock_aft_comment5').setValue(gMain.selPanel.vSELECTED_comment);
							                        	Ext.getCmp('stock_aft_remark5').setValue(gMain.selPanel.vSELECTED_remark);
							                        	Ext.getCmp('stock_aft_quan5').setValue(gMain.selPanel.vSELECTED_quan);
							                        	  
						            	           	}
				            	           }
				            	      }
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_comment5',
							        name : 'stock_org_comment5',
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_remark5',
							        name : 'stock_org_remark5',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_quan5', 
							        name : 'stock_org_quan5',
							        fieldLabel: 'Last',
							        emptyText : '수량'
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use5',
				            		name: 'stock_use5',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	   var system_code = record.get('system_code');
					            	           	console_logs('systemcode', system_code);
					            	           	if(system_code == 'NO'){
					            	           		var hipon = '없음';
					            	           		Ext.getCmp('stock_aft_comment4').setValue('');
					            	           		Ext.getCmp('stock_aft_remark4').setValue('');
					            	           		Ext.getCmp('stock_aft_quan4').setValue('');
					            	           		
					            	           		
					            	           		
					            	           	}else{
					            	           		Ext.getCmp('stock_aft_comment4').setValue(gMain.selPanel.vSELECTED_comment);
						                        	Ext.getCmp('stock_aft_remark4').setValue(gMain.selPanel.vSELECTED_remark);
						                        	Ext.getCmp('stock_aft_quan4').setValue(gMain.selPanel.vSELECTED_quan);
					            	           	}
				            	           	
				            	           }
				            	      }
							    },{
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_comment5',
							        name : 'stock_aft_comment5',
							        //disabled : true,
							        emptyText : '폭'
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_remark5',
							        name : 'stock_aft_remark5',
							        emptyText : '장',
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_quan5',
							        name : 'stock_aft_quan5',
							        emptyText : '수량'
							      
							    }
							    ]
							}
                        ]
	               
	            },
	            {

	            	xtype: 'fieldset',
	                 title: '구매 재단규격',
	                 boder: false,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     //anchor: '100%'
	                	 useThousandSeparator: false
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'textfield',
				            		id: 'pur_type',
				            		name: 'pur_type',
				            		editable: false
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_comment',
							        name : 'pur_org_comment',
							        emptyText : '폭',
							        value : gMain.selPanel.vSELECTED_comment,
							        readOnly: true
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_remark',
							        name : 'pur_org_remark',
							        emptyText : '장',
							        value: gMain.selPanel.vSELECTED_remark,
							        readOnly: true
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_quan', 
							        name : 'pur_org_quan',
							        value: gMain.selPanel.vSELECTED_quan,
							        emptyText : '수량',
							        readOnly: true
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'pur_use',
				            		name: 'pur_use',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		//emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	           	var system_code = record.get('system_code');
				            	           	console_logs('systemcode', system_code);
				            	           	if(system_code == 'N'){
				            	           		/*Ext.getCmp('pur_aft_comment').setValue('0');
				            	           		Ext.getCmp('pur_aft_comment').setReadOnly(true);
				            	           		
				            	           		Ext.getCmp('pur_aft_remark').setValue('0');
				            	           		Ext.getCmp('pur_aft_remark').setReadOnly(true);
				            	           		
				            	           		Ext.getCmp('pur_aft_quan').setValue(gMain.selPanel.vSELECTED_quan);
				            	           		Ext.getCmp('pur_aft_quan').setReadOnly(true);*/

				            	           	}else{
				            	           		/*Ext.getCmp('pur_aft_comment').setValue('');
				            	           		Ext.getCmp('pur_aft_comment').setReadOnly(false);
				            	           		
				            	           		//Ext.getCmp('pur_aft_remark').setValue('0');
				            	           		Ext.getCmp('pur_aft_remark').setReadOnly(false);*/
				            	           	}
				            	           	
				            	           }
				            	      }
							    },{
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_comment',
							        name : 'pur_aft_comment',
							        //disabled : true,
							        emptyText : '폭',
							        value : gMain.selPanel.vSELECTED_comment
							        //readOnly: true
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_remark',
							        name : 'pur_aft_remark',
							        emptyText : '장',
							        value : gMain.selPanel.vSELECTED_remark
							        //readOnly: true
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_quan',
							        name : 'pur_aft_quan',
							        emptyText : '수량',
							        value : gMain.selPanel.vSELECTED_quan,
							        editable: true
							      
							    }
							    ]
							}
	                     ]
	            }
	            ] // items
	                    });//Panel end...
  				    myHeight = 540;
					myWidth = 1100;

				//prwin = this.prwinopen(form);
					this.prwinopen(form);
			
		 } // uniqueId if end
	   
    },
    prwinopen: function(form) {
    	var prwin =	Ext.create('Ext.Window', {
			modal : true,
        title: '주문 작성',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '발주하시겠습니까?'
        		var myTitle = '주문 작성 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	
                    	if(btn == "no"){
                    		MessageBox.close();
                    	}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	//var form = gMain.selPanel.up('form').getForm();
                    	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                    	var cartmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    	var srcahduid = gMain.selPanel.vSELECTED_srcahduid;
                    	var coord_key1 = gMain.selPanel.vSELECTED_coord_key1;
                    	var coord_key2 = gMain.selPanel.vSELECTED_coord_key2;
                    	var coord_key3 = gMain.selPanel.vSELECTED_coord_key3;
                    	var ac_uid = gMain.selPanel.vSELECTED_PJ_UID;
                    	//var request_date = gMain.selPanel.request_date;
                    	
                    	var pur = '';
                    	var stock1 = '';
                    	var stock2 = '';
                    	var stock3 = '';
                    	var stock4 = '';
                    	var stock5 = '';
                    	
                    	var purUid = '';
                    	var stock1Uid = '';
                    	var stock2Uid = '';
                    	var stock3Uid = '';
                    	var stock4Uid = '';
                    	var stock5Uid = '';
                    	
                    	var datas = [];
                    	var srcahduids = [];
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	
                    	var check = val['commonPaperType_code'];
                    	console_logs('check', check);
                    	console_logs('check', check.length);
                    	if( check.length < 1 || check == 'undefined'){
                    		alert("지종을 다시 선택해주세요");
                    	}else{
                    	
                    	console_logs('val', val);
                    	
                    	var supplierinfo = val['supplier_information'];
                    	var comment = val['pur_org_comment'];
                    	
                    	/*if(makercode.length < 1){
                    		makercode = 
                    	}*/
                    	if(supplierinfo.length < 1 || supplierinfo == 'undefined'){
                    		comment = '0000';
                    	}
                    	//pur = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['description'], val['comment'], val['remark']); //공급사, 지종, 평량, 폭, 장
                    	pur = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['description'], comment, val['pur_org_remark']); //공급사, 지종, 평량, 폭, 장
                    	
                    	stock1 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment1'], val['stock_org_remark1']);
                    	stock2 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment2'], val['stock_org_remark2']);
                    	stock3 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment3'], val['stock_org_remark3']);
                    	stock4 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment4'], val['stock_org_remark4']);
                    	stock5 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment5'], val['stock_org_remark5']);
                    	
                    	datas.push(pur);
                    	datas.push(stock1);
                    	datas.push(stock2);
                    	datas.push(stock3);
                    	datas.push(stock4);
                    	datas.push(stock5);
                    	
                    	
                    		Ext.Ajax.request({
                    			url: CONTEXT_PATH + '/purchase/request.do?method=checkitemcode',				
                    			params:{
                    				datas : datas,
                    				cartmapuid: cartmapuid,
                    				srcahduid: srcahduid
                    			},
                    			
                    			success : function(response, request) {
                      					console_logs('response', response);
                      					var rec = Ext.JSON.decode(response.responseText);
                      					//console_logs('rec', rec);
                      					
                      				
                      					srcahduids = rec.datas;
                      					
                      					form.submit({
                                			url : CONTEXT_PATH + '/purchase/request.do?method=createmes',
                                			params:{
                                				po_user_uid : po_user_uid,
                                				unique_uid: cartmapuid,
                                				coord_key3 : coord_key3,
                                				coord_key2 : coord_key2,
                                				coord_key1 : coord_key1,
                                				sancType : 'YES',
                                				ac_uid: ac_uid,
                                				srcahduids: srcahduids,
                                				srcahduid: srcahduid
                                				
                                			},
                                			success: function(val, action){
                                				prwin.close();
                                				gMain.selPanel.store.load(function(){});
                                				
                                			},
                                			failure: function(val, action){
                                				
                                				prwin.close();
                                				 
                                			}
                                		})
                      					
                      					
                    			},//Ajax success
                    			failure: function(result, request) {
                      					alert('재고가 없습니다. 그래도 진행하시겠습니까?');
                    			},//Ajax failure
                    		}); 
                    		
                    	}  // end of formvalid
                    	
                    	} // 지종 of end
                    	} // btnIf of end
                   }//fn function(btn)
                    
                });//show
        		
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(btn){
        		var msg = '취소하시겠습니까?'
            	var myTitle = '주문 작성 확인';
            	Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                       
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                 fn: function(btn) {
                      	
                        	if(btn == "no"){
                        		MessageBox.close();
                        	}else{
                        	prwin.close();
                        	}
                 }
            	})
        	}
		}]
    });
	  prwin.show();
    },
    
    //임의 주문 submit
    prwinopennoid: function(form) {
    	var prwin =	Ext.create('Ext.Window', {
			modal : true,
        title: '주문 작성',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '발주하시겠습니까?'
        		var myTitle = '주문 작성 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	
                    	if(btn == "no"){
                    		prwin.close();
                    	}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	var cartmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    	var srcahduid = gMain.selPanel.vSELECTED_srcahduid;
                    	//var form = gMain.selPanel.up('form').getForm();
                    	/*var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                    	var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    	var coord_key1 = gMain.selPanel.vSELECTED_coord_key1;
                    	var coord_key2 = gMain.selPanel.vSELECTED_coord_key2;
                    	var coord_key3 = gMain.selPanel.vSELECTED_coord_key3;*/
                    	
                    	
                    	var pur = '';
                    	
                    	var datas = [];
                    	var srcahduids = [];
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	
                    	console_logs('val', val);
                    	
                    	pur = gUtil.makeAutoCodePaper(val['maker_code'], val['item_name'], val['description'], val['pur_org_comment'], val['pur_org_remark']); //공급사, 지종, 평량, 폭, 장
                    	
                    	console_logs('pur', pur);
                    	                    	
                    	datas.push(pur);
                    	
                    	
                    		Ext.Ajax.request({
                    			url: CONTEXT_PATH + '/purchase/request.do?method=checkitemcode',				
                    			params:{
                    				datas : datas
                    			},
                    			
                    			success : function(response, request) {
                      					console_logs('response', response);
                      					var rec = Ext.JSON.decode(response.responseText);
                      					//console_logs('rec', rec);
                      					
                      				
                      					srcahduids = rec.datas;
                      					
                      					form.submit({
                                			url : CONTEXT_PATH + '/purchase/request.do?method=createmesnoid',
                                			params:{
                                				sancType : 'YES',
                                				ac_uid: '-1',
                                				srcahduids: srcahduids,
                                				srcahduid: srcahduid
                                				
                                			},
                                			success: function(val, action){
                                				prwin.close();
                                				gMain.selPanel.store.load(function(){});
                                				
                                			},
                                			failure: function(val, action){
                                				
                                				 prwin.close();
                                				 
                                			}
                                		})
                      					
                      					
                    			},//Ajax success
                    			failure: function(result, request) {
                      					alert('재고가 없습니다. 그래도 진행하시겠습니까?');
                    			},//Ajax failure
                    		}); 
                    	}  // end of formvalid 
                    	} // btnIf of end
                   }//fn function(btn)
                    
                });//show
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prwin) {
        			
        			prwin.close();
        			
        		}
        	}
		}]
    });
	  prwin.show();
    },
    prwinopennotpaper: function(form) {
     var 	prwin =	Ext.create('Ext.Window', {
			modal : true,
        title: '주문 작성',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '발주하시겠습니까?'
        		var myTitle = '주문 작성 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	//console_logs('btn>>>>>>>>>', btn);
                    	if(btn == "no"){
                    		prwin.close();
                    	}else{
                  	
                    	var form = gu.getCmp('formPanel').getForm();
                    	//var form = gMain.selPanel.up('form').getForm();
                    	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                    	var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    	var coord_key1 = gMain.selPanel.vSELECTED_coord_key1;
                    	var coord_key2 = gMain.selPanel.vSELECTED_coord_key2;
                    	var coord_key3 = gMain.selPanel.vSELECTED_coord_key3;
                    	var ac_uid = gMain.selPanel.vSELECTED_PJ_UID;
                    	
                    	var srcahduid = gMain.selPanel.vSELECTED_srcahduid;
                    	//var request_date = gMain.selPanel.request_date;
                  
        					form.submit({
                                			url : CONTEXT_PATH + '/purchase/request.do?method=createmesnopaper',
                                			//url : CONTEXT_PATH + '/purchase/request.do?method=createmes',
                                			params:{
                                				po_user_uid : po_user_uid,
                                				unique_uid: catmapuid,
                                				coord_key3 : coord_key3,
                                				coord_key2 : coord_key2,
                                				coord_key1 : coord_key1,
                                				sancType : 'YES',
                                				ac_uid: ac_uid,
                                				srcahduid: srcahduid
                                			},
                                			success: function(val, action){
                                				prwin.close();
                                				gMain.selPanel.store.load(function(){});
                                				
                                			},
                                			failure: function(val, action){
                                				
                                				 prwin.close();
                                				 
                                			}
             		
                    		}); 
                    	}// btnIf of end
                   }//fn function(btn)
                    
                });//show
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prwin) {
        			
        			prwin.close();
        			
        		}
        	}
		}]
    });
	  prwin.show();
    },
   
    itemabst : function(){
    	
    	gMain.selPanel.jsonInfo = '';
    	gMain.selPanel.json = '';
    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/purchase/prch.do?method=readListWork',				
			params:{
				ac_uid : gMain.selPanel.vSELECTED_PJ_UID
			},
			
			success : function(response, request) {
				
				
  					var rec = Ext.JSON.decode(response.responseText);
  					
  					
  					gMain.selPanel.json = rec.datas;
  					console_logs('json>>>>>>>>>>>>', gMain.selPanel.json.length);
  					if(gMain.selPanel.json.length > 0){
  						jsonStr = rec.datas[0].item_abst;
  	  					console_logs('jsonStr', jsonStr);
  	  					
  	  				gMain.selPanel.jsonInfo = JSON.parse(jsonStr);
  	  			
  	  			
					
  					}
  					
  					
  					
  					
  					
			},//Ajax success
			failure: function(result, request) {
  					alert('재고가 없습니다. 그래도 진행하시겠습니까?');
			},//Ajax failure
		}); 
    } 	
    
    
});
