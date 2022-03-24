//수주관리 메뉴
Ext.define('Rfx2.view.company.rfx.designPlan.ProjectPlmMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'project-plm-mgmt-view',
    inputBuyer : null,
    initComponent: function(){
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	useMultitoolbar = true;
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
			text: "등록일자",
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});	
		this.addSearchField ({
            type: 'distinct',
            width: 140,
            tableName: 'project',
			field_id: 'reserved_varchar3',     
			fieldName: 'reserved_varchar3'
    	}); 
		this.addSearchField ({
            type: 'distinct',
            width: 140,
            tableName: 'combst',
			field_id: 'wa_name',     
			fieldName: 'wa_name'
    	}); 


		//검색툴바 생성
//		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성

		if(vCompanyReserved4 == 'HSGC01KR') {
            var buttonToolbar = this.createCommandToolbar({
                REMOVE_BUTTONS : [
                    'REGIST','COPY','REMOVE', 'EDIT'
                ]
            });
		} else {

            var buttonToolbar = this.createCommandToolbar();
		}

        //console_logs('this.fields', this.fields);

        //모델 정의
        this.createStore('Rfx.model.ProjectMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'creator',
	        	unique_id: 'unique_id'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['project']
	        );
        
//        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
//            //console_logs('tabpanel newTab', newTab);
//            //console_logs('tabpanel newTab newTab.title', newTab.title);
//
//            switch(newTab.title) {
//            case '구매요청':
//                gMain.selPanel.refreshBladeInfoAll();
//                break;
//            case '공정설계':
//            	gMain.selPanel.refreshProcess();
//            	break;
//            }
//            
//            
//        };
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        //arr.push(dateToolbar);
//        arr.push(searchToolbar);
        //grid 생성.
      // this.createGrid(searchToolbar, dateToolbar,buttonToolbar);
   	 //검색툴바 생성
       	if(	useMultitoolbar == true ) {
       		var multiToolbar =  this.createMultiSearchToolbar({first:9, length:11});
       		console_logs('multiToolbar', multiToolbar);
               for(var i=0; i<multiToolbar.length; i++) {
           		arr.push(multiToolbar[i]);
               }
       	} else {
       		var searchToolbar =  this.createSearchToolbar();
       		arr.push(searchToolbar);
       	}

        Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];

			switch(dataIndex) {
				case 'pj_code_dash':
				columnObj['renderer'] = function(value) {return '<a href="javascript:gMain.selPanel.renderMoveBom()">' + value + '</a>'};
			}
		});

        this.createGrid(arr);
        
        //작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '생산 요청',
			 tooltip: '생산 및 구매 요청',
			 disabled: true,
			 
			 handler: function() {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '생산 및 구매요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.doRequest();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
		//버튼 추가.
		switch(vCompanyReserved4) {
			case 'APM01KR':
				break;
            case 'SKNH01KR':
			case 'KWLM01KR':
                buttonToolbar.insert(4, this.requestAction);
                buttonToolbar.insert(4, '-');
                break;
			default:
				buttonToolbar.insert(4, this.requestAction);
				buttonToolbar.insert(4, '-');
			
				buttonToolbar.insert(4, '-');
				break;
		}
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	var processGrid = Ext.getCmp('recvPoPcsGrid');
            if (selections.length) {
            	var rec = selections[0];
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //assymap의 child
            	
                
                
    			var status = rec.get('status');
    		
                
                
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
            	gMain.selPanel.requestAction.disable();
			}
       
        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        

		
		
        this.callParent(arguments);
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.store.load(function() {

        });


    },
    selectPcsRecord: null,
    items : [],
   
  
    //구매/제작요청
    doRequest: function() {
    	
    	
//    	var target_reserved_double3 = this.getInputTarget('unique_id');
//    	var assymapUid = target_reserved_double3.getValue()
//    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
    	
    	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
    	var assymapUid = this.vSELECTED_RECORD.get('unique_uid');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=addRequest',
			params:{
				assymapUid: assymapUid,
				ac_uid: ac_uid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
    	
    	
    	

    }
    
});
