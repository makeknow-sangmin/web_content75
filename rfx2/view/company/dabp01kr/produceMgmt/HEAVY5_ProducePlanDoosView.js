Ext.define('RRfx2.view.company.dabp01kr.produceMgmtHEAVY5_ProducePlanDoosView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produceplan-doos-view',
    selectedgrid: null,
	current_pcs_code: null,
	is_loaded: false,
    initComponent: function(){

       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	
		/*this.addSearchField ('item_name');	
		this.addSearchField('wa_name');*/
    	
    	switch(vCompanyReserved4) {
    	case 'KYNL01KR':
            this.addSearchField({
                type: 'condition',
                width: 140,
                sqlName: 'heavylotlist',
                tableName: 'project',
                field_id: 'pj_name',
                fieldName: 'pj_name',
                params: {
                }
            });
            this.addSearchField({
                type: 'condition',
                width: 140,
                sqlName: 'heavylotlist',
                tableName: 'project',
                field_id: 'pj_code',
                fieldName: 'pj_code',
                params: {
                }
            });
            this.addSearchField({
                type: 'condition',
                width: 140,
                sqlName: 'heavylotlist',
                tableName: 'assymap',
                field_id: 'req_date',
                fieldName: 'req_date',
                params: {
                }
            });
            this.addSearchField({
                type: 'condition',
                width: 150,
                sqlName: 'heavylotlist',
                tableName: 'itemdetail',
                field_id: 'h_reserved15',
                fieldName: 'h_reserved15',
                params: {
                }
            });
            this.addSearchField({
                type: 'condition',
                width: 200,
                sqlName: 'heavylotlist',
                tableName: 'assymap',
                field_id: 'reserved1',
                fieldName: 'reserved1',
                params: {
                }
            });
			break;
        case 'HSGC01KR':
            this.addSearchField('pj_name'); //프로젝트
            this.addSearchField('reserved_varchar2');
            this.addSearchField('reserved_varchar3');
            this.addSearchField('specification');
            break;
    	default:
    		this.addSearchField('pj_name'); //프로젝트
			this.addSearchField('class_code'); //소조번호
			this.addSearchField('area_code'); //블록
    	}
      
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        if(vCompanyReserved4 == 'KYNL01KR') {
        	// remove the items
            (buttonToolbar.items).each(function(item,index,length){
            	if(index==1||index==2||index==3||index==4/*||index==5*/) {
                	buttonToolbar.items.remove(item);        		
            	}

            }); 
        } else {
        	// remove the items
            (buttonToolbar.items).each(function(item,index,length){
            	if(index==1||index==3||index==4||index==5) {
                	buttonToolbar.items.remove(item);        		
            	}

            }); 
        }
        
        switch(vCompanyReserved4){
        case 'KYNL01KR':
        case 'HSGC01KR':
        	this.createStoreSimple({
            	modelClass: 'Rfx.model.HEAVY5ProducePlanKYNL',
            	pageSize: gMain.pageSize,/*pageSize*/
            	 sorters: [{
            		 property: 'bigPcsCodes',
                     direction: 'DESC'
    		        }],
    		        byReplacer: {
    		        },
    	        deleteClass: ['cartmap']
            }, {
        
        	groupField: 'bigPcsCodes'
            });
        	break;
        default:
        	this.createStoreSimple({
            	modelClass: 'Rfx.model.HEAVY5_ProducePlanCHNG',
            	pageSize: gMain.pageSize,/*pageSize*/
            	 sorters: [{
            		 property: 'bigPcsCodes',
                     direction: 'DESC'
    		        }],
    		        byReplacer: {
    		        },
    	        deleteClass: ['cartmap']
            }, {
        
        	groupField: 'bigPcsCodes'
            });
        }
        

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
       
		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 건)</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
		
		switch(vCompanyReserved4) {
		
		case 'HSGC01KR':
			this.createGrid(null, null, null,  [ 
            	{
         			locked: false,
         			arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
         		},
         		{
         			text: '수량',
    				locked: false,
    				arr: [10, 11]
    		    },
    		    {
         			locked: false,
         			arr: [12]
         		},
    		    {
    				text: '중량',
    				locked: false,
    				arr: [13, 14]
    		    },
    		    {
    				locked: false,
    				arr: [15, 16]
    		    },
    		   /* {
    		    	text: '단가',
    				locked: false,
    				arr: [17, 18]
    		    },
    		    {
    				locked: false,
    				arr: [19, 20]
    		    },
    		    {
    		    	text: 'P/O금액',
    				locked: false,
    				arr: [21, 22]
    		    },*/
    		    {
    				locked: false,
    				arr: [23, 24, 25, 26, 27, 28]
    		    },
    		    ]);
			break;
		case'KYNL01KR':
			break;
		default:
			this.createGridCore(arr/*, option*/);
		}

		 this.createCrudTab();
		    Ext.apply(this, {
	            layout: 'border',
	            items: [this.grid,  this.crudTab]
	     });
       
        
        //this.removeAction.setText('반려');
        //Action Button 이름 변경.
        //this.editAction.setText('계획수립');
       // 
        //this.setEditPanelTitle('계획수립');
        
       var viewName = this.link;
        
      //Lot 구성 Action 생성
        this.addLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '제작 Lot 구성',
			 tooltip: '제작 Lot 구성',
			 disabled: true,
			 handler: function() {
				 switch(vCompanyReserved4){
				 case 'DOOS01KR':
					 if (viewName == 'EPC5_T') {
						 gMain.selPanel.reserved_varchar3 = 'TPRD';
					 } else {
						 gMain.selPanel.reserved_varchar3 = 'PRD';
					 }
					 break;
				 default:
					 gMain.selPanel.reserved_varchar3 = 'PRD';
					 break;
				 }
				 gMain.selPanel.treatLotOp();
				 
			 }
		});
        
        // 작업지시요청 생성
        this.addRequestWorkOrderAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '작업지시요청',
			 tooltip: '작업지시요청',
			 disabled: true,
			 handler: function() {
				 
			     gMain.selPanel.reserved_varchar3 = 'PRD';	
				 gMain.selPanel.treatRequestWorkOrder();
				 
			 }
		});
        
        //도장 Lot 구성 Action 생성
        this.addPaintLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '도장 Lot 구성',
			 tooltip: '작업 그룹 구성',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.reserved_varchar3 = 'PNT';
				 gMain.selPanel.treatLotOp();
				 }
		});
        
        //Lot 해체 Action 생성
        this.cancleLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '소그룹 해체',
			 tooltip: '소그룹 해체',
			 disabled: true,
			 handler: function() {
				 
				 gMain.selPanel.cancleLotOp();
			 }
		});

        //생산계획수립->수주관리로 다시 Back
        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '반려',
            tooltip: '수주관리로 이동',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title:'확인',
                    msg: '해당 수주를 수주 관리로 이동 시키겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn:  function(result) {
                        if(result=='yes') {
                            gm.me().denyWorkOrderFc();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //생산계획수립에서 공정을 변경하기
        this.changeWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_refresh_14_0_5395c4_none',
            text: '공정변경',
            tooltip: '공정을 변경합니다',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '구조 생산요청을 철의장으로 혹은 철의장 생산요청으로 구조로 이동하시겠습니까?<br>' +
                    '체크한 수주 뿐 만 아니라 체크한 수주의 P/O와 번호가 같은 수주도 같이 이동 됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(result) {
                        if(result=='yes') {
                            gm.me().changeWorkOrderFc();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });
        
        //버튼 추가.
        switch(vCompanyReserved4){
        case 'DDNG01KR':
        	buttonToolbar.insert(2, this.cancleLotAction);
        break;
        case 'SHNH01KR':
        	buttonToolbar.insert(2, this.addPaintLotAction);
        break;
        default:
        	
        }
       /* if(vCompanyReserved4 =='DDNG01KR'){
        	buttonToolbar.insert(2, this.cancleLotAction);
        }*/
        buttonToolbar.insert(2, '->'); 
        switch(vCompanyReserved4){
        case 'HSGC01KR':
        	buttonToolbar.insert(2, this.addRequestWorkOrderAction);
        	buttonToolbar.insert(2, this.changeWorkOrder);
        	break;
        case 'KYNL01KR':
        	buttonToolbar.insert(1, this.addLotAction);
        	buttonToolbar.insert(1, this.denyWorkOrder);
        	break;
        default:
        	buttonToolbar.insert(2, this.addLotAction);
        }

        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
        	processes = gUtil.mesTplProcessBig;
        } else {
        }

        var button_pos = 0;

        switch(vCompanyReserved4) {
            case 'KYNL01KR':
                button_pos = 6;
                break;
            case 'HSGC01KR':
                button_pos = 5;
                break;
            default:
                button_pos = 4;
        }
        
        if(processes!=null) {

        	for(var i = processes.length - 1; i >= 0; i--) {
				var o = processes[i];
				var big_pcs_code = o['code'];
				var title = '[' + o['code'] + ']' + o['name'];
				console_logs('title', title);
				
				var action = Ext.create('Ext.Action', {
					xtype : 'button',
					text: title,
					tooltip: title + ' 공정',
					big_pcs_code: big_pcs_code,
					toggleGroup: this.link + 'bigPcsType',
					handler: function() { 	          				 
						gm.me().setBigPcsCode(this.big_pcs_code);
					}
				});

				buttonToolbar.insert(button_pos, action);
             }
             var action = Ext.create('Ext.Action', {
              	 xtype : 'button',
        			 text: '전체 대공정',
        			 tooltip: '전체 대공정',
        			 big_pcs_code: '',
        			 pressed: true,
        			 toggleGroup: this.link + 'bigPcsType',
        			 handler: function() {
        				 gm.me().setBigPcsCode(this.big_pcs_code);
        			 }
        		});


               buttonToolbar.insert(button_pos, action);
        }
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	selectedgrid = selections;

            if (selections.length) {
            	
            	this.refreshButtons(true);
            	
            	this.cartmap_uids = [];
            	for(var i=0; i<selections.length; i++){
            		var rec1 = selections[i];
            		var uids = rec1.get("unique_uid");
            		this.cartmap_uids.push(uids);
            		console_logs('rec1', rec1);
            	}
            	console_logs('그리드온 uid', this.cartmap_uids);
            	
            	
            	console_logs('selections', selections[0]);
            	var rec = selections[0];
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id'); //cartmap의 child
            	gMain.selPanel.vSELECTED_PARENT = rec.get('parent'); //cartmap의 parent => assymap의 unique_id(대동일 경우)
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
            	gMain.selPanel.vSELECTED_TYPE = rec.get('reserved_varchar3');  // 제작/도장 구분
            	gMain.selPanel.vSELECTED_UNIQUE_UID = rec.get('unique_uid'); //선택된 CARTMAP_UID
            	gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); //선택된 ASSYMAP_UID
            	gMain.selPanel.vSELECTED_PROJECT_NAME = rec.get('pj_name');
            	gMain.selPanel.vSELECTED_PROJECT_NAME_COUNT = rec.get('pj_name_count');
            	
            	console_logs('setGridOnCallback', gMain.selPanel.vSELECTED_UNIQUE_UID);
            	
            	if(rec!=null){
            		console_logs('pcsstd 불러오기',rec);
	                var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
	                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_ASSYMAP_UID);//선택된 ASSYMAP_UID
	                processGrid.getStore().load();
            	}
            	/*gMain.selPanel.addLotAction.enable();
            	gMain.selPanel.cancleLotAction.enable();
            	gMain.selPanel.addLotAction.enable();
            	gMain.selPanel.addPaintLotAction.enable();*/
            	
          	
            } else {
            	
            	this.refreshButtons(false);
            	/*gMain.selPanel.addLotAction.disable();
            	gMain.selPanel.cancleLotAction.disable();
            	gMain.selPanel.addPaintLotAction.disable();*/
            }
        	
        });

        
        this.createCrudTab();

        this.tab_info = [];

        if(vCompanyReserved4=='KYNL01KR' || vCompanyReserved4=='HSGC01KR') {
        	 for(var i = 0; i < gUtil.mesProductCategory.length; i++) {

        		var o = gUtil.mesProductCategory[i];

             	this.tab_info.push({
             		code: o['code'],
             		name: o['name'],
             		title: o['name']
             	});
             }

        	 var ti = this.tab_info;
             for(var i=0; i<ti.length; i++) {

             	var tab = ti[i];
             	console_logs('this.tab',tab);
             	console_logs('this.columns_map',this.columns_map);

             	var tab_code = tab['code'];
             	var myColumn = this.columns_map[tab_code];
             	var myField =  this.fields_map[tab_code];
             	//유형별 필드 추가하기
             	this.addExtraColumnBypcscode(myColumn, myField, tab_code);

             }

             var items = [];

             var tab = this.createTabGrid('Rfx.model.HEAVY5ProducePlanKYNL', items, 'big_pcs_code', arr, function(curTab, prevtab) {

            	 var multi_grid_id = curTab.multi_grid_id;

                 gm.me().multi_grid_id = multi_grid_id;

                 var store = gm.me().store_map[multi_grid_id];
                 gMain.selPanel.store = store;
                 store.getProxy().setExtraParams({});

                 if(vCompanyReserved4 == 'KYNL01KR' && this.is_loaded) {

                     while(gm.me().searchField.length > 0) {
                         gm.me().searchField.pop();
                     }

					 switch(gm.me().multi_grid_id) {
						 case 'ST':
						 case 'SP':
						 case 'ET':
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'project',
                                 field_id: 'pj_name',
                                 fieldName: 'pj_name',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'project',
                                 field_id: 'pj_code',
                                 fieldName: 'pj_code',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'assymap',
                                 field_id: 'req_date',
                                 fieldName: 'req_date',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 150,
                                 sqlName: 'heavylotlist',
                                 tableName: 'itemdetail',
                                 field_id: 'h_reserved15',
                                 fieldName: 'h_reserved15',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 200,
                                 sqlName: 'heavylotlist',
                                 tableName: 'assymap',
                                 field_id: 'reserved1',
                                 fieldName: 'reserved1',
                                 params: {
                                 }
                             });
						 	break;
						 case 'SS':
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'assymap',
								 emptyText: 'LOT NO',
                                 field_id: 'reserved5',
                                 fieldName: 'reserved5',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'project',
                                 field_id: 'pj_name',
                                 fieldName: 'pj_name',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'assymap',
                                 emptyText: 'W/O일',
                                 field_id: 'reserved2',
                                 fieldName: 'reserved2',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'assymap',
                                 emptyText: '납품기준일',
                                 field_id: 'req_date',
                                 fieldName: 'req_date',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'srcahd',
                                 emptyText: 'BLOCK',
                                 field_id: 'area_code',
                                 fieldName: 'area_code',
                                 params: {
                                 }
                             });
                             gm.me().addSearchField({
                                 type: 'condition',
                                 width: 140,
                                 sqlName: 'heavylotlist',
                                 tableName: 'itemdetail',
                                 emptyText: '도장 OUT',
                                 field_id: 'h_reserved84',
                                 fieldName: 'h_reserved84',
                                 params: {
                                 }
                             });
						 	break;
					 }

                     gm.me().tabGenPanel.dockedItems.removeAt(0);
					 var searchToolbar2 = gm.me().createSearchToolbar();
                     gm.me().tabGenPanel.addDocked(searchToolbar2, 1);
                 }

                 this.is_loaded = true;

                 switch(vCompanyReserved4) {
                 case 'HSGC01KR':
            		 if(gm.me().multi_grid_id == 'SAM') {
            			 store.getProxy().setExtraParam('order_com_unique', '79070000002');
                		 if(gm.me().current_big_pcs_code == 'ASB') {
                    		 store.getProxy().setExtraParam('pj_type', 'S');
                		 } else if(gm.me().current_big_pcs_code == 'STE') {
                			 store.getProxy().setExtraParam('pj_type', 'T');
                		 }
                	 } else if (gm.me().multi_grid_id == 'DAE') {
                		 store.getProxy().setExtraParam('order_com_unique', '79070000003');
                		 if(gm.me().current_big_pcs_code == 'ASB') {
                			 store.getProxy().setExtraParam('pj_type', 'DS');
                		 } else if(gm.me().current_big_pcs_code == 'STE') {
                			 store.getProxy().setExtraParam('pj_type', 'DT');
                		 }
                	 } else if (gm.me().multi_grid_id == 'ETC') {
                         store.getProxy().setExtraParam('pj_type', 'ES');
                	 }
                	 break;
                 case 'KYNL01KR':
                     store.getProxy().setExtraParam('pj_type', multi_grid_id);
                     if(gm.me().link == 'EPC5_HIS') {
                         store.getProxy().setExtraParam('status', 'Y');
                     }
                     break;
                 default:
            			store.getProxy().setExtraParam('pj_type', multi_grid_id);
                 }

                 gm.me().storeLoad();

             });

             Ext.apply(this, {
             	layout: 'border',
             	items: [tab,  this.crudTab]
             });
        } else {
            Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
            });
        }

        this.store.getProxy().setExtraParam('big_pcs_code', this.current_pcs_code);

		var calcNumber = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '수량계산',
			 tooltip: '수량 계산하기',
			 handler: function() {
				 var gridPcsStd = Ext.getCmp('producePlanGrid');
				 //console_logs('gridPcsStd', gridPcsStd);
				 //console_logs('gMain.selPanel.vSELECTED_UNIQUE_ID', gMain.selPanel.vSELECTED_UNIQUE_ID);

			    	var modifiend =[];
			    	//var rec = gridPcsStd.getSelectionModel().getSelection()[0];
			    	//var unique_id = rec.get('unique_id');

			    	var target_bm_quan = null;
			    	var target_bm_quan2 = null;

			    	try {
				    	target_bm_quan = gMain.selPanel.getInputTarget('bm_quan', '1');
				    	target_bm_quan2 = gMain.selPanel.getInputTarget('bm_quan', '2');
			    	} catch(e) {
			    		console_logs('calcNumber e', e);

			    	}

			    	if(target_bm_quan==null) {
			    		console_logs('target_bm_quan', 'is null');
			    		return;
			    	}

			    	if(target_bm_quan2==null) {
			    		console_logs('target_bm_quan2', 'is null');
			    		return;
			    	}



			    	if(target_bm_quan.getValue()>1){
			    	  var prevQty = Number(target_bm_quan.getValue());
			    	}else{
			    		var prevQty = Number(target_bm_quan2.getValue());
			    	}
			    	 // var tomCheck = false;
			    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
			    	  {
			    	        var record = gridPcsStd.store.data.items [i];
	    	           		var pcs_no =  record.get('pcs_no');
	    	           		var pcs_code = record.get('pcs_code');
	    	           		var serial_no = Number(pcs_no) / 10;
	    	           		var plan_qty = record.get('plan_qty');

			    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
			    	           	console_logs(record);
			    	           	var pcs_code = record.get('pcs_code').toUpperCase();
			    	           	if(gMain.checkPcsName(pcs_code)) {

			    	           		var plan_date = record.get('plan_date');
			    	           		var yyyymmdd ='';
			    	           		if(plan_date!=null) {
			    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
			    	           		}

//		    	           			if(tomCheck==true) {
//		    	           				var target_reserved_double3 = gMain.selPanel.getInputTarget('reserved_double3');
//		    	           				prevQty = prevQty*Number(target_reserved_double3.getValue());
//		    	           				tomCheck = false;
//		    	           			}
		    	           			plan_qty = prevQty;

			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
			    		           	obj['serial_no'] = serial_no;
			    		           	obj['pcs_code'] = record.get('pcs_code');
			    		           	obj['pcs_name'] = record.get('pcs_name');

			    		           	obj['description'] = record.get('description');
			    		           	obj['comment'] = record.get('comment');
			    		           	obj['machine_uid'] = record.get('machine_uid');
			    		           	obj['seller_uid'] = record.get('seller_uid');

			    		           	obj['std_mh'] = record.get('std_mh');
			    		           	obj['plan_date'] = yyyymmdd;
			    		           	obj['plan_qty'] = plan_qty;

			    		           	modifiend.push(obj);

//		    	           			if(pcs_code=='TOM' && tomCheck==false) {
//		    	           				tomCheck = true;
//		    	           			}

			    	        }
			    	        prevQty = plan_qty;
			    	  }

			    	  if(modifiend.length>0) {

			    		  console_logs(modifiend);
			    		  var str =  Ext.encode(modifiend);
			    		  console_logs(str);
			    		  console_logs('modify>>>>>>>>');
			    		    Ext.Ajax.request({
			    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
			    				params:{
			    					modifyIno: str,
			    					assymap_uid:gm.me().vSELECTED_UNIQUE_ID
			    				},
			    				success : function(result, request) {
			    					gridPcsStd.store.load(function() {
			    						//alert('come');
			    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
			    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});

			    					});
			    				}
			    		    });
			    	  }
			 }
			});

		var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '공정저장',
			 tooltip: '공정설계 내용 저장',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.savePcsstdHandler
			});

		var resetPcsStep = Ext.create('Ext.Action', {
			 iconCls: 'af-rotate-left',
			 text: '공정초기화',
			 tooltip: '공정설계 내용 초기화',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.resetPcsstdHandler
			});

        //공정설계 gridPcsStd Tab 추가.
		gMain.addTabGridPanel('공정설계', 'EPC1', {
				pageSize: 100,
				model: 'Rfx.model.PcsStd',
		        dockedItems: [

			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default4',
			            items: [
			                    {
			                    	id: this.link + '-'+ 'grid-top-spoQty',
			 	   		        	xtype:'tbtext',
			 	   		        	text:'수량: 0'
			 	   		        },
				 	   		    {
				    				id: this.link + '-'+ 'grid-top-paperQty',
				 	   		        xtype:'tbtext',
				 	   		        text:'중량: 0'
				 	   		    }
	      				     ]
				        }

			        ,
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			                    '-',
			 	   		    	savePcsStep
			    				 ,
			                    '->',
			                    calcNumber,
			                    '-',
			                    resetPcsStep
	      				        ]
				        }
			        ],
					sorters: [{
			           property: 'serial_no',
			           direction: 'ASC'
			       }]
			}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	//console_logs(rec);
	            	gm.me().selectPcsRecord = rec;
	            } else {

	            }
	        },
	        'producePlanGrid'//toolbar
		);



        this.callParent(arguments);

        //디폴트 로딩
        gMain.setCenterLoading(false);

        if(vCompanyReserved4 != 'KYNL01KR') {
            this.store.getProxy().setExtraParam('big_pcs_code', '');
        } else {
            if(this.link == 'EPC5_HIS') {
                this.store.getProxy().setExtraParam('status', 'Y');
            }
            this.store.getProxy().setExtraParam('big_pcs_code', this.current_pcs_code);
        }
        this.storeLoad();
    },

    selectPcsRecord: null,
    items : [],
    cartmap_uids : [],
    setCheckname: function(b) {
    	this.checkname=b;
    	
    	var btn = gu.getCmp('prwinopen-OK-button');
    	if(b==true) {
    		btn.enable();
    	} else {
    		btn.disable();
    	}
    	
    },
    checkname : false,
    
    treatRequestWorkOrder: function() {
    	if(gm.me().multi_grid_id == 'DAE') {
    		
    		var selections = selectedgrid;
    		var is_closing = false;
    		for (var k = 0; k < selections.length; k++) {
    			var is_closed = selections[k].get('assy_is_closed_2');
    			if (is_closed == '설계중') {
    				Ext.Msg.alert('경고', '설계가 완료 되지 않은 수주가 있습니다.');
    				is_closing = true;
    				break;
    			}
    		}
    		
    		if(!is_closing) {
    			this.treatRequestWorkOrderMessage();
    		}
    	} else {
    		this.treatRequestWorkOrderMessage();
    	}
    },
    
    treatRequestWorkOrderMessage: function() {
    	Ext.MessageBox.show({
            title:'확인',
            msg: '작업지시를 요청하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn:  function(result) {
    	        if(result=='yes') {
    	        	//var form = gu.getCmp('formPanel').getForm();
                	var cartmaparr =[];
                	var po_quan = 0;
                	var reserved_double4 = 0;
                	var selections = selectedgrid;
                	for(var i=0; i< selections.length; i++) {
                		var rec = selections[i];
                		var uid =  rec.get('unique_uid');  //CARTMAP unique_id
                		cartmaparr.push(uid);
                		var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
                		console_logs('unit 수량', po_quan_unit);
                		po_quan = po_quan + po_quan_unit;
                		console_logs('po_quan 수량', po_quan);
                		var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                		reserved_double4 = reserved_double4 + tmp_weight;
                		console_logs('중량', reserved_double4);
                	}

                	console_logs('cartmaparr', cartmaparr);
                	var ac_uid = gm.me().vSELECTED_AC_UID;
                	//gu.getCmp('prwinopen-OK-button').setDisabled(true);
                        switch(vCompanyReserved4) {
                            case 'HSGC01KR':
                                //HSG는 하나의 cartmap당 하나의 rtgast로 생성
                                for(var k = 0; k < selections.length; k++) {
                                    Ext.Ajax.request({
                                        url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                                        params:{
                                            cartmap_uids: cartmaparr[k],
                                            ac_uid: ac_uid,
                                            reserved_varchar3 : rec.get('bigPcsCode'),
                                            bigPcsCodes : rec.get('bigPcsCodes'),
                                            po_quan: po_quan,
                                            reserved_double4 : reserved_double4
                                        },
                                        success: function(val, action){
                                            //prWin.close();
                                            gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                            gMain.selPanel.store.load(function(){});
                                        },
                                        failure: function(val, action){
                                            //prWin.close();
                                            gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                            gMain.selPanel.store.load(function(){});
                                        }
                                    });
                                }
                                break;
                            default:
                                Ext.Ajax.request({
                                    url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                                    params:{
                                        cartmap_uids: cartmaparr,
                                        ac_uid: ac_uid,
                                        reserved_varchar3 : rec.get('bigPcsCode'),
                                        bigPcsCodes : rec.get('bigPcsCodes'),
                                        po_quan: po_quan,
                                        reserved_double4 : reserved_double4
                                    },
                                    success: function(val, action){
                                        //prWin.close();
                                        gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                        gMain.selPanel.store.load(function(){});
                                    },
                                    failure: function(val, action){
                                        //prWin.close();
                                        gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                        gMain.selPanel.store.load(function(){});
                                    }
                                });
                                break;
                        }

                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    treatLotOp: function(){
    	var form = null;
    	var lot_value = null;
    	var pj_value = '';
    	var count_value = '';
    	
    	switch(vCompanyReserved4) {
    	case 'DOOS01KR':
    		lot_value = Ext.Date.format(new Date(), 'ymd-His');
    		break;
    	case 'KYNL01KR':
        	
        	if(gMain.selPanel.vSELECTED_PROJECT_NAME.length > 4) {
        		pj_value += gMain.selPanel.vSELECTED_PROJECT_NAME.substring(
        				gMain.selPanel.vSELECTED_PROJECT_NAME.length - 4);
        	} else {
        		pj_value = gMain.selPanel.vSELECTED_PROJECT_NAME;
        	}
        	
        	if(gMain.selPanel.vSELECTED_PROJECT_NAME_COUNT < 100) {
        		count_value += '0';
        		if(gMain.selPanel.vSELECTED_PROJECT_NAME_COUNT < 10) {
        			count_value += '0';
        		}
        		count_value += gMain.selPanel.vSELECTED_PROJECT_NAME_COUNT;
        	}
        	
    		lot_value = pj_value + '-' + count_value;
    		break;
    	default:
    		lot_value = Ext.Date.format(new Date(), 'ymd-His');
    		break;
    	}

		//var checkname = false;
		 form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                //labelWidth: 60,
	                //margins: 10,
	            },
	            items   : [
	            {
	                xtype: 'fieldset',
	                title: '입력',
	                collapsible: true,
	                defaults: {
	                    labelWidth: 40,
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
	                       {
	                           xtype: 'fieldcontainer',
	                           fieldLabel: 'LOT 명',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true,
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id: gu.id('po_no'),
	                                   name      : 'po_no',
	                                   fieldLabel: 'LOT 명',
	                                   margin: '0 5 0 0',
	                                   width: 300,
	                                   allowBlank: true,
	                                   //value :gm.me().lotname,
	                                   fieldStyle: 'text-transform:uppercase',
	                                   maxlength: '1',
	                                   value: lot_value,
	                                   readOnly: false//,
	                                   //emptyText: '영문대문자와 숫자만 입력',
	                                   /*validator: function(v) {
	                                       if (/[^A-Z0-9_-]/g.test(v)) {
	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
	                                       }
	                                	 
	                                       this.setValue(v.toUpperCase());
	                                       return true;
	                                   }*/
	                               },
	                               {
	                                   xtype:'button',
	                                   style: 'margin-left: 3px;',
	                                   width : 50,
	                                   text: '중복'+CMD_CONFIRM,
	                                   //style : "width : 50px;",
	                                   handler : function(){
	                                	   
	                                	   var po_no = gu.getCmp('po_no').getValue();
	                                	   console_logs('po_no', po_no);
	                                	   if(po_no==null || po_no.length==0) {
	                                		   gm.me().setCheckname(false);
	                                	   } else {
	                                       //중복 코드 체크
	                                       	Ext.Ajax.request({
	                                			url: CONTEXT_PATH + '/index/process.do?method=checkName',				
	                                			params:{
	                                				po_no : po_no
	                                			},
	                                			
	                                			success : function(result, request) {
	                                				var resultText = result.responseText;
	                                				if(resultText=='0') {
	                                					gm.me().setCheckname(true);
	                                					Ext.MessageBox.alert('정상', '사용가능합니다.');
	                                					//alert('사용가능합니다.');
	                                				}else {
	                                					gm.me().setCheckname(false);
	                                					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
	                                					//alert('코드를 확인하세요.');
	                                				}
	                                				
	                                				console_log('resultText', gMain.selPanel.checkname);
	                        
	                                			},//Ajax success
	                                			failure: extjsUtil.failureMessage
	                                		}); 
	                                	   
	                                	   }
	                   						
	                                   }//endofhandler
	                                }
	                           ]
	                       },
	            
	                               
	                           ]
	            }
	                   ]
			
	                    });//Panel end...
			myHeight = 120;
			myWidth = 390;
			
			
				prwin = gm.me().prwinopen(form);
		
    },
    
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: 'LOT 번호는 다음과 같습니다',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
            id: gu.id('prwinopen-OK-button'),
            disabled: false,
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gMain.selPanel.checkname);
        		/*if(gMain.selPanel.checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{*/
                    	var form = gu.getCmp('formPanel').getForm();
                    	var cartmaparr =[];
                    	var po_quan = 0;
                    	var reserved_double4 = 0;
                    	var selections = selectedgrid;

                    	var mat_arr = [];

                    	if(vCompanyReserved4 == 'KYNL01KR') {
                            for(var i = 0; i < selections.length; i++) {
                                mat_arr.push(selections[i].get('h_reserved6'));
                            }

                            mat_arr.sort();

                            for(var i = 0; i < selections.length; i++) {
                                for(var j = 0; j < mat_arr.length; j++) {
                                    var rec = selections[j];
                                    if(rec.get('h_reserved6') == mat_arr[i]) {
                                        var isDup = false;
                                        for(var k = 0; k < cartmaparr.length; k++) {
                                            //중복값 삭제
                                            if(cartmaparr[k] == rec.get('unique_uid')) {
                                                isDup = true;
                                            }
                                        }
                                        if(!isDup) {
                                            cartmaparr.push(rec.get('unique_uid'));
                                            var po_quan_unit = rec.get('quan');
                                            po_quan = po_quan + po_quan_unit;
                                            var tmp_weight = rec.get('mass');
                                            reserved_double4 = reserved_double4 + tmp_weight;
                                        }
                                    }
                                }
                            }
                        } else {
                            for(var i = 0; i< selections.length; i++) {
                                var rec = selections[i];
                                var uid =  rec.get('unique_uid');  //CARTMAP unique_id
                                cartmaparr.push(uid);
                                var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
                                console_logs('unit 수량', po_quan_unit);
                                po_quan = po_quan + po_quan_unit;
                                console_logs('po_quan 수량', po_quan);
                                var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                                reserved_double4 = reserved_double4 + tmp_weight;
                                console_logs('중량', reserved_double4);
                            }
                            var order_com_unique = selections[0].get('order_com_unique');
                        }

                    	console_logs('cartmaparr', cartmaparr);
                    	//var cartmaparr = gMain.selPanel.cartmap_uids;
                    	var ac_uid = gm.me().vSELECTED_AC_UID;
                    	gu.getCmp('prwinopen-OK-button').setDisabled(true);
                            prWin.setLoading(true);
                            form.submit({
        					url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                             params:{
                    				cartmap_uids: cartmaparr,
                    				ac_uid: ac_uid,
                    				//reserved_varchar3: 'PRD',
                    				reserved_varchar3 : rec.get('bigPcsCode'),
                    				bigPcsCodes : rec.get('bigPcsCodes'),
                    				po_quan: po_quan,
                    				reserved_double4 : reserved_double4,
                                    order_com_unique : order_com_unique
                   				},
                    			success: function(val, action){
        					        var myWin = prWin;
                    				gMain.selPanel.store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                    				gMain.selPanel.store.load(function(){
                    				    myWin.close();
                                    });
                    			},
                    			failure: function(val, action){
                    				prWin.close();
                    				gMain.selPanel.store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                    				gMain.selPanel.store.load(function(){});
                    			}
                    		});
    			}// checkname of end
        	
        	//}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prWin) {
        			
        			prWin.close();
        			
        		}
        	}
		}]
    });
	  prWin.show();
    },
    resetPcsstdHandler : function(){
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdReset',
			params:{
				from_uid: 100,
				to_uid:gm.me().vSELECTED_ASSYMAP_UID
			},
			success : function(result, request) {   
//				gridPcsStd.store.load(function() {
//					//alert('come');
//       				//var idxGrid = storePcsStd.getTotalCount() -1;
//       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
//					
//				});
				var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gm.me().vSELECTED_ASSYMAP_UID);//선택된 CARTMAP_UID
                processGrid.getStore().load();
			}
	    });
  
},
    savePcsstdHandler : function() {
		 var gridPcsStd = Ext.getCmp('producePlanGrid');
		 //console_logs('gridPcsStd', gridPcsStd);
		 
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gMain.selPanel.getInputTarget('reserved_double2');
	    	
	    	  var prevQty = Number(target_bm_quan.getValue());
	    	  //var tomCheck = false;
	    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
	    	  {
	    	        var record = gridPcsStd.store.data.items [i];
	           		var pcs_no =  record.get('pcs_no');
	           		var pcs_code = record.get('pcs_code');
	           		var serial_no = Number(pcs_no) / 10;
	           		var plan_qty = record.get('plan_qty');
	    	        if (record.dirty) {
	    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	           	console_logs(record);
	    	           	var pcs_code = record.get('pcs_code').toUpperCase();
	    	           	var pcs_name = record.get('pcs_name');
	    	           	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	           		var plan_date = record.get('plan_date');
	    	           		var yyyymmdd ='';
	    	           		if(plan_date!=null) {
	    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
	    	           		}

	    	           		if(plan_qty==0) {
	    	           			plan_qty = prevQty;
	    	           		}
	    	           		
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	obj['pcs_code'] = record.get('pcs_code');
	    		           	obj['pcs_name'] = record.get('pcs_name');

	    		           	obj['description'] = record.get('description');
	    		           	obj['comment'] = record.get('comment');
	    		           	obj['machine_uid'] = record.get('machine_uid');
	    		           	obj['seller_uid'] = record.get('seller_uid');

	    		           	obj['std_mh'] = record.get('std_mh');
	    		           	obj['plan_date'] = yyyymmdd;
	    		           	obj['plan_qty'] = plan_qty;
	    		           	
	    		           	modifiend.push(obj);
	    	           	} else {
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	
	    		           	obj['pcs_code'] = '';
	    		           	obj['pcs_name'] = '';

	    		           	obj['description'] = '';
	    		           	obj['comment'] = '';
	    		           	obj['machine_uid'] = '-1';
	    		           	obj['seller_uid'] = '-1';

	    		           	obj['std_mh'] = '0';
	    		           	obj['plan_date'] = '';
	    		           	obj['plan_qty'] = '0';
	    		           	modifiend.push(obj);
	    	           	}

	    	        }
	    	        prevQty = plan_qty;
	    	  }
	    	  
	    	  if(modifiend.length>0) {
	    		  console_log(modifiend);
	    		  var str =  Ext.encode(modifiend);
	    		  console_log(str);
	    		  console_log('modify>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
	    				params:{
	    					modifyIno: str,
	    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
	    				},
	    				success : function(result, request) {   
	    					gridPcsStd.store.load(function() {
	    						//alert('come');
	    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
	    						
	    					});
	    				}
	    		    });
	    	  }
	 },
	 
	 // Lot 햬체 
	 cancleLotOp: function(){
			
			console_logs('assyuid', gm.me().vSELECTED_ASSYMAP_UID );
			console_logs('srcuid', gm.me().vSELECTED_UNIQUE_ID );
			console_logs('cartuid', gm.me().vSELECTED_UNIQUE_UID);
		 Ext.Ajax.request({
			 url: CONTEXT_PATH + '/index/process.do?method=cancleLot',
			 params:{
				 assymapuid:gm.me().vSELECTED_ASSYMAP_UID,
					srcahduid : gm.me().vSELECTED_UNIQUE_ID,
					cartmapuid : gm.me().vSELECTED_UNIQUE_UID
				},
			 success : function(result, request) {
				 gm.me().store.load(function(){});
 			},
 			failure: function(val, action){
 				 alert('Lot 해체 실패');
 			}
		
		 });
	 },
	 bSelected: false,
	 refreshButtons: function(bSelected) {
		 
		console_logs('this.big_pcs_code', this.big_pcs_code);
		 
		if(bSelected!=undefined && bSelected!=null) {
			this.bSelected = bSelected;
		}
		
		if( this.bSelected == true && 
			this.big_pcs_code!=undefined && 
			this.big_pcs_code!=null && 
			this.big_pcs_code!='') {
		     	this.addLotAction.enable();
		     	this.addRequestWorkOrderAction.enable();
		     	this.changeWorkOrder.enable();
		     	this.cancleLotAction.enable();
		     	this.addPaintLotAction.enable();
		     	this.denyWorkOrder.enable();
		} else {
				this.addLotAction.disable();
				this.addRequestWorkOrderAction.disable();
				this.changeWorkOrder.disable();
				this.cancleLotAction.disable();
				this.addPaintLotAction.disable();
                this.denyWorkOrder.disable();
		}
	 },
	 setBigPcsCode: function(big_pcs_code) {
		 console_logs('big_pcs_code', big_pcs_code);
		 this.big_pcs_code = big_pcs_code;
		 this.current_pcs_code = big_pcs_code;
		 this.refreshButtons();
		 gm.me().current_big_pcs_code = this.big_pcs_code;
		 switch(vCompanyReserved4) {
         case 'HSGC01KR':
    		 if(gm.me().multi_grid_id == 'SAM') {	 
    			 this.store.getProxy().setExtraParam('order_com_unique', '79070000002'); 
        		 if(gm.me().current_big_pcs_code == 'ASB') {
            		 this.store.getProxy().setExtraParam('pj_type', 'S'); 
        		 } else if(gm.me().current_big_pcs_code == 'STE') {
        			 this.store.getProxy().setExtraParam('pj_type', 'T'); 
        		 }
        	 } else if (gm.me().multi_grid_id == 'DAE') {
        		 this.store.getProxy().setExtraParam('order_com_unique', '79070000003'); 
        		 if(gm.me().current_big_pcs_code == 'ASB') {
        			 this.store.getProxy().setExtraParam('pj_type', 'DS'); 
        		 } else if(gm.me().current_big_pcs_code == 'STE') {
        			 this.store.getProxy().setExtraParam('pj_type', 'DT'); 
        		 }
        	 } else if (gm.me().multi_grid_id == 'ETC') {
        		 if(gm.me().current_big_pcs_code == 'ASB') {
        			 //this.store.getProxy().setExtraParam('order_com_unique', '79070000004');
        			 this.store.getProxy().setExtraParam('pj_type', 'ES');
        		 }
        	 }
        	 break;
         default:
    			this.store.getProxy().setExtraParam('pj_type', gm.me().multi_grid_id);
         }

		 this.store.getProxy().setExtraParam('big_pcs_code', this.big_pcs_code);

         this.storeLoad();
	 },
	 getProcessType : function() {
		 return this.big_pcs_code==null ? this.mtr_type : this.big_pcs_code;
	 },
		createPcsToobars : function(code) {
			console_logs('createPcsToobars code', code);
			var buttonItems = [];
			
			buttonItems.push(
			{   name: code + 'finish_date',
	            cmpId: code + 'finish_date',
	             format: 'Y-m-d',
	              fieldStyle: 'background-color: #D6E8F6; background-image: none;',
			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
				    	allowBlank: true,
				    	xtype: 'datefield',
				    	value: new Date() ,
				    	width: 100,
					handler: function(){
					}
				});
	       	var smallPcs = gUtil.mesTplProcessAll[code];
	       	console_logs('-------------->  smallPcs', smallPcs);
	       	if(smallPcs!=null && smallPcs.length>0) {
	       	for(var i=0; i <smallPcs.length; i++) {
	       		var o1 = smallPcs[i];
	       		var code1  = o1['code'];
	       		var name1 = o1['name'];
	       		console_logs('createPcsToobars code1', code1);
	       		console_logs('createPcsToobars name1', name1);
	       		
				var action = {
						xtype: 'button',
						iconCls: 'af-check',
						cmpId: code+code1,
						text: name1 + ' 완료',
						big_pcs_code: code,
						pcs_code: code1,
						disabled: true,
						handler: function() {
							console_logs('createPcsToobars', this.cmpId + ' clicked');
							console_logs('big_pcs_code', this.big_pcs_code);
							console_logs('pcs_code', this.pcs_code);
							
							var text = gm.me().findToolbarCal(this.big_pcs_code);
							console_logs('text', text);
							if(text==null) {
								Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
							} else {
								var date = text.getValue();
								console_logs('val', date);
								var selections = gm.me().tab_selections[this.big_pcs_code];
								console_logs('selections', selections);
								if(selections!=null) {
									var whereValue = [];
									var field = this.pcs_code + '|' + 'end_date';
									for( var i=0; i<selections.length; i++) {
										var o = selections[i];
										o.set(field, date);
										console_logs('o', o);
										var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
										whereValue.push(step_uid);
									}
									console_logs('createPcsToobars', whereValue);
									gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue,  {type:'update_pcsstep'});
							    	
								}
								
							}
							
						}
				};
				buttonItems.push(action);
	       	}//endoffor
	       	}//endofif
	       	
	       	console_logs('createPcsToobars buttonItems', buttonItems);
	        var buttonToolbar1 = Ext.create('widget.toolbar', {
	    		items: buttonItems
	    	});
	        
	        console_logs('createPcsToobars buttonToolbar', buttonToolbar1);
	        
	        return buttonToolbar1;
		},

		 //유형별 필드 추가 
	    addExtraColumnBypcscode: function(myColumn, myField, tab_code) {
	   	
	    	var columnGroup = [];
	    	
	    	switch(vCompanyReserved4) {
	        case 'HSGC01KR':
	        	if(tab_code == 'SAM') {
	        		columnGroup = [ {
	         			locked: false,
	         			arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	         		},
	         		{
	         			text: '수량',
	    				locked: false,
	    				arr: [14, 15]
	    		    },
	    		    {
	         			locked: false,
	         			arr: [16]
	         		},
	    		    {
	    				text: '중량',
	    				locked: false,
	    				arr: [17, 18]
	    		    },
	    		    {
	    				locked: false,
	    				arr: [19, 20]
	    		    },
	    		    {
	    				locked: false,
	    				arr: [27, 28, 29]
	    		    }];
	        	} else {
	        		break;
	        	}
	        break;
	        default:
	    	}
	    
	    	this.column_group_map[tab_code] = columnGroup;
	    },

    denyWorkOrderFc: function() {

        var cartmaparr = [];
        for(var i = 0; i < selectedgrid.length; i++){
            var rec = selectedgrid[i];
            cartmaparr.push(rec.get('unique_uid'));
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=denyProducePlan',
            params:{
                cartmapUids: cartmaparr
            },

            success : function(result, request) {
                gm.me().storeLoad();
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    changeWorkOrderFc: function() {

         //cartmap, rtgast, pcsstd 추가용
         var assymaparr = [];
         var projectarr = [];
         var pj_types = [];
         //project 필요한 것
         var parent_code = this.link;
         var big_pcs_code = selectedgrid[0].data.bigPcsCode;

         if(vCompanyReserved4 == 'HSGC01KR') {
             switch(big_pcs_code) {
                 case 'ASB':
                     big_pcs_code = 'STE';
                     break;
                 case 'STE':
                     big_pcs_code = 'ASB';
                     break;
             }
         }

        for(var i = 0; i < selectedgrid.length; i++){
            var rec = selectedgrid[i];
            assymaparr.push(rec.data.assymap_uid);
            projectarr.push(rec.data.ac_uid);
            pj_types.push(rec.data.pj_type);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
            method: 'POST',
            params: {
                assymap_uids: assymaparr,
                parent_code: parent_code,
                big_pcs_codes: big_pcs_code,
                ac_uids: projectarr,
                pj_types: pj_types
            },

            success : function(result, request) {
                Ext.Msg.alert('안내', '공정을 변경하였습니다.');
                gm.me().store.load(function(records) {
                    gm.me().setLoading(false);
                    console_logs('gm.me().store.load records', records);

                    if(myWin!=null){
                        myWin.close();
                    }
                });
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax
    }
});