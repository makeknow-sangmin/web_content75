//수주관리 메뉴
Ext.define('Rfx.view.designPlan.ProjectPlmMgmtView', {
    extend: 'Rfx.base.BaseView',
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
			text: gm.getMC('CMD_Order_Date', '등록일자'),
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
//		this.addSearchField (
//		{
//			type: 'combo'
//			,field_id: 'status'
//			,store: "RecevedStateStore"
//			,displayField: 'codeName'
//			,valueField: 'systemCode'
//			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
//		});	
//    	this.addSearchField('wa_name');
//		this.addSearchField('item_name');
//		this.addSearchField('pj_code');
        
		//Readonly Field 정의 --> 사용하지 않음.
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');

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

        switch(vCompanyReserved4) {
            case 'SKNH01KR':
            case 'KWLM01KR':
                break;
            default:
                this.setRowClass(function(record, index) {

                    //console_logs('record', record);
                    var c = record.get('status');
                    //console_logs('c', c);
                    switch(c) {
                        case 'CR':
                            return 'yellow-row';
                            break;
                        case 'P':
                            return 'orange-row';
                            break;
                        case 'DE':
                            return 'red-row';
                            break;
                        case 'BM':
                            break;
                        default:
                            return 'green-row';
                    }
                });
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
        
        
        //작업지시 Action 생성
        this.checkCycleAction = Ext.create('Ext.Action', {
			 iconCls: 'fa-subscript_14_0_5395c4_none',
			 text: '발주 주기',
			 tooltip: '발주주기 확인',
			 disabled: true,
			 
			 handler: function() {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '준비중인기능입니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
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
				buttonToolbar.insert(4, this.checkCycleAction);
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
    			//console_logs('status', status);
//    			if(status=='BM') {
//    				gUtil.enable(gMain.selPanel.removeAction);
//    				gUtil.enable(gMain.selPanel.editAction);    
//    				gUtil.enable(gMain.selPanel.requestAction);
//    			} else {
//    				gUtil.disable(gMain.selPanel.removeAction);
//    				gUtil.disable(gMain.selPanel.editAction);   
//    				gUtil.disable(gMain.selPanel.requestAction);
//    			}
                
                
                
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
            	gMain.selPanel.requestAction.disable();
			}
        	// processGrid.getStore().getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
        	// processGrid.getStore().load();
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

//          gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
//          var processGrid = Ext.getCmp('recvPoPcsGrid'/*gMain.getGridId()*/);
         // processGrid.getStore().getProxy().setExtraParam('srcahd_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
          //processGrid.getStore().load();

        });


    },
    selectPcsRecord: null,
    items : [],
    computeProduceQty: function(cur) {
		//console_logs('computeProduceQty cur', cur);
		var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
		var target_bm_quan = this.getInputTarget('bm_quan');
		
		var val = cur - target_stock_qty_useful.getValue();
		if(val<0) {
			val = 0;
		}
		target_bm_quan.setValue(val);
    },

    refreshBladeInfo: function() {
		var val = gMain.getBladeInfo();
		var target = this.getInputTarget('blade_size_info');
		target.setValue(val);
    },
    
    refreshBladeInfoAll: function() {
    	var val1 = gMain.getBladeInfoAll();
    	var target1 = this.getInputTarget('blade_size_info1');
    	target1.setValue(val1);
    },
    //원지/원단 수량 설정
    refreshBmquan: function(cur) {
		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(cur);
		z
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(cur);
    },
    refreshProcess: function() {
    	
		var target_bm_quan = this.getInputTarget('bm_quan');
		var bm_quan = target_bm_quan.getValue();
		
		var o = Ext.getCmp(	this.link + '-'+ 'grid-top-spoQty' ).setText('생산수량: ' + bm_quan);
		
    	
		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		var bm_quan1 = target_bm_quan1.getValue();
		Ext.getCmp(	this.link + '-'+ 'grid-top-paperQty' ).setText('원지수량: ' + bm_quan1);

		
		var val = gMain.getBladeInfo();
		Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo' ).setText(val);
		

	},
	renderMoveBom: function() {
	
		var pjuid = this.grid.getSelectionModel().getSelection()[0].get('id');
		
			Ext.Ajax.request({
					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
					params:{
						paramName : 'CommonProjectAssy',
						paramValue : pjuid + ';' + '-1'
					},
					
					success : function(result, request) {
						console_log('success defaultSet');
						// lfn_gotoMenu('DBM7_PLM', 'designPlan', 'BOM Tree', '/rfx/view/designPlan/DesignBomTreeView.js', 0);
						//lfn_gotoMenu('DBM7', 'designPlan', 'BOM Tree', '/rfx/view/designPlan/DesignBomTreeView.js', 3, 'design');
						
					    var url = CONTEXT_PATH + '/index/main.do#design-plan:DBM7_PLM';
			    		location.href=url;			
								
								
					},
					failure: function(result, request){
						console_log('fail defaultSet');
					}
				});
	},
    //판걸이 수량이 변경된 andler
    handlerChangePanQty: function() {
    	//console_logs('handlerChangePanQty', 'in');
		var target_bm_quan = this.getInputTarget('bm_quan');
		var target_reserved_double3 = this.getInputTarget('reserved_double3');
		var target_reserved_double4 = this.getInputTarget('reserved_double4');
		
		var qty = Number(target_bm_quan.getValue()) / Number(target_reserved_double3.getValue());
		//console_logs('qty', qty);
		target_reserved_double4.setValue(qty);
		
//		var val = gMain.getBladeInfo();
//		var target = this.getInputTarget('blade_size_info');
//		target.setValue(val);

		this.refreshBladeInfo();
		this.refreshBladeInfoAll();
		
//		target_reserved_varcharc.setValue(target_reserved_double3.getValue()+'ea');
    },
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
