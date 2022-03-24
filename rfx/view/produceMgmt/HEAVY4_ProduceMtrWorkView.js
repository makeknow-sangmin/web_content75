//수주등록된 전체 자재 메뉴
Ext.define('Rfx.view.produceMgmt.HEAVY4_ProduceMtrWorkView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-mtr-work-view',
    vFILE_ITEM_CODE: null,
    inputBuyer : null,
    initComponent: function(){
    	
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	
    	gUtil.setDistinctFilters(this.link, ['pj_name', 'specification', 'pj_code']);
    	//console_logs('gUtil.getDistinctFilters(this.link)', gUtil.getDistinctFilters(this.link));
    	
    	this.setDefValue('regist_date', new Date());
    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	var useMultitoolbar = false;
    	
    	switch(vCompanyReserved4){
		case 'HAEW01KR':
		case 'DAEH01KR':
			useMultitoolbar = true;
			this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: "W/O일",
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});
		break;
		case 'SHNH01KR':
			useMultitoolbar = false;
			break;
		default :
			this.addSearchField ({
				type: 'dateRange',
				field_id: 'regist_date',
				text: gm.getMC('CMD_Order_Date', '등록일자'),
				sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
				edate: new Date()
			});
		break;
    	}
		
		this.addSearchField (
		{
			type: 'combo'
			,field_id: 'po_no'
			,store: "WorkorderPonoStore"
			,displayField: 'po_no'
			,valueField: 'po_no'
			,width: 160
			,innerTpl	:'<div data-qtip="{po_no}">{po_no}</div>'
		});
		
		switch(vCompanyReserved4){
		case "SWON01KR":
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			break;
		case "SHNH01KR":
			this.addSearchField('pj_name');    // 프로젝트
			this.addSearchField('specification');
			this.addSearchField('alter_item_code');
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'itemdetail', //Table 명
				field_id: 'h_reserved43',       // js에서의 필드 명
				fieldName: 'h_reserved43' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'srcahd', //Table 명
				field_id: 'area_code',       // js에서의 필드 명
				fieldName: 'area_code' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'srcahd', //Table 명
				field_id: 'description',       // js에서의 필드 명
				fieldName: 'description' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'assymap', //Table 명
				field_id: 'reserved1',       // js에서의 필드 명
				fieldName: 'reserved1' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'assymap', //Table 명
				field_id: 'reserved2',       // js에서의 필드 명
				fieldName: 'reserved2' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'itemdetail', //Table 명
				field_id: 'h_reserved60',       // js에서의 필드 명
				fieldName: 'h_reserved60' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'project', //Table 명
				field_id: 'pj_code',       // js에서의 필드 명
				fieldName: 'pj_code' //실재 Table Field Name
			});
			break;
		default :
			this.addSearchField('area_code');
			this.addSearchField('h_reserved44');	
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
		}
	
		//Function Callback 정의
        //redirect
    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
    		if(selectOn==true) {
    			this.propertyPane.setSource(source); // Now load data
    			this.selectedUid = unique_id;
    			gUtil.enable(this.removeAction);
    			gUtil.enable(this.editAction);
    			gUtil.enable(this.copyAction);
    			gUtil.enable(this.viewAction);
    			//gUtil.disable(this.registAction);
    			
    		} else {//not selected
            	this.propertyPane.setSource(source);
            	this.selectedUid = '-1';
            	gUtil.disable(this.removeAction);
            	gUtil.disable(this.editAction);
            	gUtil.disable(this.copyAction);
            	gUtil.disable(this.viewAction);
            	gUtil.enable(this.registAction);
            	this.crudTab.collapse();
    		}

    		//console_logs('this.crudMode', this.crudMode);
    		this.setActiveCrudPanel(this.crudMode);
    	};
        
		//Readonly Field 정의 --> 사용하지 않음.
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');

        switch(vCompanyReserved4){
//        case "DDNG01KR":
//        	this.createStoreSimple({
//        		modelClass: 'Rfx.model.HEAVY4RecvPoSubViewModel',
//    	        pageSize: 100,//gMain.pageSize,
//    	        sorters: [{
//    	        	property: 'assymap.unique_id',
//    	            direction: 'DESC'
//    	        }]
//    	        
//    	    }, {
//    	    	groupField: 'wa_name'
//        });
//        	break;
        case "SWON01KR":
        	
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4_ProduceWork',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
    	        	property: 'cartmap.unique_id',
    	            direction: 'DESC'
    	        }],
    	        byReplacer: {
		        	'state_name': 'rtgast.state',
		        }
    	        
    	    }, {
    	    	
	        });
	    	break;
        default:
        	
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4_ProduceWork',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
    	        	property: 'cartmap.unique_id',
    	            direction: 'DESC'
    	        }],
    	        byReplacer: {
		        	'state_name': 'rtgast.state',
		        }
    	        
    	    }, {
    	    	
	        });
        	break;
        }

        
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        		REMOVE_BUTTONS : [
        		        	        /*'REGIST',*/'COPY'
        			]		
        });
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        //arr.push(dateToolbar);
        
        //검색툴바 생성
    	if(	useMultitoolbar == true ) {
    		var multiToolbar =  this.createMultiSearchToolbar({first:7, length:8});
    		console_logs('multiToolbar', multiToolbar);
            for(var i=0; i<multiToolbar.length; i++) {
        		arr.push(multiToolbar[i]);
            }
    	} else {
    		var searchToolbar =  this.createSearchToolbar();
    		arr.push(searchToolbar);
    	}

        console_logs('arr', arr);
        this.setRowClass(function(record, index) {
    		var r = record.get('fields');
    		var rowid = record.get('assymap_uid');
    		var color = record.get(r);
    		//console_logs('r', r);
    		//console_logs('color', color);
    		
    		/*if(color == ''){
    			return 'orange-row';
    		}*/
    		
    		if(r!=''){
    			return 'orange-row';
    		}
    	
    		
        	/*switch(r) {
        	case dataIndex :
        		return 'orange-row';
        	break;
        	default :
        		return 'green-row';
        		break;
        	}*/
    		
    	
            	

            });	
		
		
        //grid 생성.
    //   this.createGrid(arr);
		for(var i=0; i< this.columns.length; i++) {
		        	
        	var o = this.columns[i];
        	var dataIndex = o['dataIndex'];
    	
        	switch(dataIndex) {
	        	case 'mass':
	        	case 'reserved_double1':
	        		o['summaryType'] = 'sum';
	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
	                	value = Ext.util.Format.number(value, '0,00.000/i');
	                	
	                	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
	                	return value;
	                };
	        		break;
	        	//case 'reserved_double2':
	        	//case 'reserved_double3':
	        	case 'quan':
	        	case 'bm_quan':
	        		o['summaryType'] = 'sum';
	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
	                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
	                	return value;
	                };
	        		break;
	        	/*case 'h_reserved9':
	        		o['summaryType'] = 'count';
	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
	                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:15pt; color:blue;">합계</font></div>'
	                	return value;
	                };*/
	        		
	        		default:
        	}
	  }//endoffor		

		
		

		// var tabStore = Ext.create('Rfx.store.ExtFieldColumnStore', {});
		
//		if(gUtil.checkUsePcstpl()==true) {
//			processList = gUtil.mesTplProcessBig;
//		} else {
		switch(vCompanyReserved4){
		case 'SWON01KR':
			// tabStore.getProxy().setExtraParam('menuCode', 'STD_PROCESS_NAME');
			this.processList = [];
			var d = [];
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/dispField.do?method=read',
				params: {
					menuCode: 'STD_PROCESS_NAME'
				},
				async: false,
				success: function(result, request) {
					var value = Ext.decode(result.responseText);
					d.push(value.datas);	
								
				},
				failure: extjsUtil.failureMessage
			});
			
			var da = d[0];
			for(var i=0; i<da.length; i++) {
				var v = da[i];
				var parent = v != undefined ? v['description']:null;
				if(parent== 'MAT') {
					var o1 = {
					pcsTemplate: v['name'],
					code: v['name'],
					process_price:0,
					name: v['text']
					};
				this.processList.push(o1);
				}
			}
			break;
	default:
		
		processList = [];
		for(var i=0; i<gUtil.mesStdProcess.length; i++) {
			var o = gUtil.mesStdProcess[i];
			console_logs('processList', o);
			if(o['parent']==o['code']) {
				var o1 = {
						pcsTemplate: o['code'],
						code: o['code'],
						process_price:0,
						name: o['name']
				};
				console_logs('o1',o1);
				processList.push(o1);
			}
		}
	}
			
//		}
		
	    //프로세스정보 읽기
       // if(gUtil.checkUsePcstpl()==true) {
			this.tab_info = []; 
			var processList = this.processList;
			console_logs('====zzzas', processList);
        	for(var i=0; i<processList.length; i++) {
		           	var o = processList[i];
		           	var code = o['code'];
		           	var name = o['name'];
		           	var title = name;
		           	var a = this.createPcsToobars(code);
		            console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
		           	this.tab_info.push({
		           		code: code,
		           		name: name,
		           		title: title,
		           		toolbars: [a]
		           	});
	      	 }
        	//해원의 겨우 철의장 전체 탭을 추가한다.
        	if(vCompanyReserved4 == 'HAEW01KR') {
        		var oAllSteel = {};
        		
        		oAllSteel['code'] = 'ALL-STL';
        		oAllSteel['name'] = '전체(철의장)';
        		oAllSteel['title'] = '전체(철의장)';
        		oAllSteel['toolbars'] = [];

        		this.tab_info.splice(1, 0, oAllSteel);
        	}
        	
        		      	 
//	      	 console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>this.tab_info', this.tab_info);
//		        for(var i=0; i<this.tab_info.length; i++) {
//		           	var o = this.tab_info[i];
//		           	var code = o['code'];
//		           	var name = o['name'];
//		           	var title = o['title'];
//		           	var pcsToolbars = o['toolbars'];
//		           	console_logs('createTabGrid code', code);
//		           	console_logs('createTabGrid pcsToolbars', pcsToolbars);
//		        }
	    //} 
    	var ti = this.tab_info;
        for(var i=0; i<ti.length; i++) {
        	console_logs('vCompanyReserved4>>>>>>>>>>>>>>>>>>>>>>>', vCompanyReserved4);
        	switch(vCompanyReserved4){
//        		case 'SHNH01KR':
//        			break;
        		default:
        			var tab = ti[i];
        			console_logs('this.tab',tab);
        			console_logs('this.columns_map',this.columns_map);
        	
        			var tab_code = tab['code'];
        			var myColumn = this.columns_map[tab_code];
        			var myField =  this.fields_map[tab_code];
        			var pos = tab_code=='STL'? 6:5;
        			this.addExtraColumnBypcscode(myColumn, myField, tab_code, 'end_date', true, pos);        		
 
        	}
        }
		 
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        //속성입력 Action 생성
        this.properInputActionShinhwa = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '속성 입력',
			 tooltip: '속성 입력',
			 disabled: true,
			 handler: function() {
				 gm.me().attributeInputShinhwa();
			 }
		});
        this.properInputAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '속성 입력',
			 tooltip: '속성 입력',
			 disabled: true,
			 handler: function() {
				 gm.me().attributeInput();
			 }
		});
        
      //속성입력 Action 생성 -- 대동
        this.properInputActionDD = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '속성 입력',
			 tooltip: '속성 입력',
			 disabled: true,
			 handler: function() {
				 gm.me().attributeInputDD();
			 }
		});
        
        //실적입력 Action 생성 -- 해원
        this.properInputActionHW = Ext.create('Ext.Action', {
        	iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        	text: '실적 입력',
        	tooltip: '실적 입력',
        	disabled: false,
        	handler: function() {
        		gm.me().attributeInputHW();
        	}
        });
        
        // 생산 요청(전체수주현황) -- 해원
        //작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '생산 요청',
			 tooltip: '생산 요청',
			 disabled: true,
			 
			 handler: function() {
				 gm.me().workdoHW();
			 }
		});

        //작업지시 Action 생성
        this.addWorkOrder = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: gm.getMC('CMD_Job_Confirm', '작업지시'),
			 tooltip: '작업지시 확정',
			 disabled: true,
			 handler: function() {
				 gm.me().treatWorkStart();
			 }
		});
        
        // TAG NO 조회(전체수주현황) -- 해원
        this.barcodeAction = Ext.create('Ext.Action', {
        	iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        	text: 'TAG NO 조회',
        	tooltip: 'TAG NO 조회',
        	disabled: false,
        	
        	handler: function() {
        		gm.me().barcodeHW();
        	}
        });
        
      //자재코드 Action 생성 -- 신화
        this.specConfirmAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '자재코드',
			 tooltip: '자재코드',
			 disabled: false,
			 handler: function() {
				 gm.me().specConfirm();
			 }
		});
        
     
        //버튼 추가.
        switch(vCompanyReserved4){
        case 'SHNH01KR' :
//        	 buttonToolbar.insert(1, this.specConfirmAction);
//        	 buttonToolbar.insert(1, this.properInputActionShinhwa);
//             buttonToolbar.insert(1, '-');
             break;
        case 'SWON01KR' :
            break;     
        default:
        	buttonToolbar.insert(1, this.properInputAction);
            buttonToolbar.insert(2, '->'); 
            buttonToolbar.insert(2, this.addLotAction);

            break;
        }
       
       
      
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('selections', selections);
        	console_logs('gm.me().selected_tab', gm.me().selected_tab);
        	console_logs('info...	', gm.me().tab_info);

        	var code = gm.me().selected_tab;
        	
        	if(code!=undefined) {
            	gm.me().tab_selections[code] = selections;
        	}
        	
        	
        	var toolbar = null;
        	var items = null;
        	if(code!=undefined) {
        		var infos = gm.me().tab_info;
        		console_logs('infos', infos);
        		if(infos!=null) {
        			for(var i=0; i<infos.length; i++) {
        				var o = infos[i];
        				if(o['code'] == code) {
        					var toolbars = o['toolbars'];
        					toolbar = toolbars[0];
        					items = toolbar.items.items;
        				}
            			
        			}
        		}
        		
        	}
        	
        	console_logs('toolbar', toolbar);
        	console_logs('toolbar items', items);
        	
            if (selections.length) {
            	
            	var rec = selections[0];

				gUtil.enable(gm.me().removeAction);
				gUtil.enable(gm.me().editAction);    
				gUtil.enable(gm.me().properInputActionShinhwa);
				gUtil.enable(gm.me().properInputAction);
				gUtil.enable(gm.me().addWorkOrder);
				
				gUtil.enable(gm.me().properInputActionDD);
				gUtil.enable(gm.me().moldidAction);
				gUtil.enable(gm.me().minLotAction);
				
				gm.me().vSELECTED_AC_UID = rec.get('ac_uid'); 
				gm.me().vSELECTED_PJ_CODE = rec.get('pj_code'); 
				gm.me().vSELECTED_PJ_CODE = gUtil.stripHighlight(gm.me().vSELECTED_PJ_CODE); 
				var ac_uid = gm.me().vSELECTED_AC_UID;
				gm.me().pj_code = gm.me().vSELECTED_PJ_CODE+"-" ;
				
				if(items!=null) {
					for(var i=0; i<items.length; i++) {
						gUtil.enable(items[i]);
					}
				}
				
				//console_logs('activite', gm.me().vSELECTED_ACTIVITY);
        	
            } else {
				gUtil.disable(gm.me().removeAction);
				gUtil.disable(gm.me().editAction);   
				gUtil.disable(gm.me().properInputActionShinhwa);
				gUtil.disable(gm.me().properInputAction);
				gUtil.disable(gm.me().moldidAction);
				gUtil.disable(gm.me().minLotAction);
				gUtil.disable(gm.me().addWorkOrder);
				
				if(items!=null) {
					for(var i=0; i<items.length; i++) {
						gUtil.disable(items[i]);
					}
				}
            }

        });
        
        
        
        this.createCrudTab();
        
        
        console_logs('tab_info', this.tab_info);
		
	    //Tab을 만들지 않는 경우.
	    if(this.tab_info.length==0/* || vCompanyReserved4=='SHNH01KR' || vCompanyReserved4=='DDNG01KR'*/) {
            this.createGrid(arr);	
	    	Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
			});
	        this.callParent(arguments);
	        //디폴트 로드
	        gMain.setCenterLoading(false);
	        this.storeLoad(function(records){
//	        	console_logs('디폴트 데이터',  main);
	     	   for(var i=0; i < records.length; i++){
	     		   var specunit = records[i].get('specification');
	     		   gm.me().spec.push(specunit);
	     		 
	     	   }
	        });
             
	    } else { //Tab그리드를 사용한는 경우.

//	    	if(vCompanyReserved4=='HAEW01KR') {
//		    	this.grid.setTitle('전체(배관)');
//	    	} else {
//		    	this.grid.setTitle('전체');
//	    	}
	    	var items = [];
//	        items.push(this.grid);
	        
//	        for(var i=0; i<this.tab_info.length; i++) {
//	           	var o = this.tab_info[i];
//	           	var code = o['code'];
//	           	var name = o['name'];
//	           	var title = o['title'];
//	           	var pcsToolbars = o['toolbars'];
//	           	console_logs('createTabGrid code', code);
//	           	console_logs('createTabGrid pcsToolbars', pcsToolbars);
//	        }
	        
	    	var tab = this.createTabGrid('Rfx.model.HEAVY4RecvPoSubViewModel', items, 'big_pcs_code', arr, function(curTab, prevtab) {
	        	var multi_grid_id = curTab.multi_grid_id;
	    		gm.me().multi_grid_id = multi_grid_id;

				if(multi_grid_id == undefined) { //Main grid		
//	        		gm.me().storeLoad();
	        	} else {//추가 탭그리드
	        		var store = gm.me().store_map[multi_grid_id];
        			store.getProxy().setExtraParam('big_pcs_code', multi_grid_id);
        			store.getProxy().setExtraParam('status', null);
//        			store.getProxy().setExtraParam('ac_uid_plus', 'T');
	            	switch(vCompanyReserved4){
	        			case 'SHNH01KR':
	        				switch(multi_grid_id) {
		        				case 'PRD':
		        					this.potype = 'PNT';
//		        					gm.me().store.getProxy().setExtraParam('pj_type', 'D');
		    						store.getProxy().setExtraParam('js_pcs_code',multi_grid_id);
		    						store.getProxy().setExtraParam('orderBy', 'unique_id');
			        		        store.getProxy().setExtraParam('ascDesc', 'ASC');
		        				break;
		        				case 'PNT':
		        					this.potype = 'PNT';
//		        					gm.me().store.getProxy().setExtraParam('pj_type', 'D');
		        					store.getProxy().setExtraParam('js_pcs_code', multi_grid_id);
		        					store.getProxy().setExtraParam('orderBy', 'unique_id');
			        		        store.getProxy().setExtraParam('ascDesc', 'ASC');
		    					break;
		        			}
	        				break;
	        			case 'SWON01KR':
	        				switch(multi_grid_id) {
		        				case 'ASY':
		        				case 'ISP':
		        				case 'PNT':
		        				case 'PRT':
		        					this.potype = 'PRD';
//		        					gm.me().store.getProxy().setExtraParam('pj_type', 'D');
		    						store.getProxy().setExtraParam('js_pcs_code',multi_grid_id);
		    						store.getProxy().setExtraParam('orderBy', 'unique_id');
			        		        store.getProxy().setExtraParam('ascDesc', 'ASC');
//			        		        store.getProxy().setExtraParam('big_pcs_code', this.potype);
		        				break;
		        				case 'ACH':
		        				case 'ATM':
		        				case 'BND':
		        				case 'CUT':
		        				case 'PRC':
		        				case 'WLD':
		        					this.potype = 'MAT';
//		        					gm.me().store.getProxy().setExtraParam('pj_type', 'D');
		        					store.getProxy().setExtraParam('js_pcs_code', multi_grid_id);
		        					store.getProxy().setExtraParam('orderBy', 'unique_id');
			        		        store.getProxy().setExtraParam('ascDesc', 'ASC');
//			        		        store.getProxy().setExtraParam('big_pcs_code', this.potype);
		    					break;
		        			}
	        				break;	
	            	}

        			
		        		store.load(function(records) {
		        			gm.me().storeLoadCallbackSub(records);
		        		});
        			}
	        	
	        });
	    	
	        Ext.apply(this, {
	            layout: 'border',
	            items: [tab,  this.crudTab]
	        });
	        this.callParent(arguments);
	        //디폴트 로드
	        gMain.setCenterLoading(false);
	    }

    },

    
    selectPcsRecord: null,
    items : [],
    potype : 'PRD',
    pj_code: null,
    spec : [],
//    assymap_uids : [],
    
    attributeInput: function(){
    	
    	var tab_code = gm.me().multi_grid_id;
    	
    	
    	var fields = (tab_code==undefined) ? this.fields: this.fields_map[tab_code];
    	
    	var oItems = [];
    	
    	var line=0;
    	var arr = null;
    	for(var i=0; i<fields.length; i++ ) {
    		var o = fields[i];
    		if(o['canEdit']==true) {
    			console_logs('fields o', o);
    			if(line%3 == 0) {
    				if(o1!=null) {
    					oItems.push(arr);
    				}
    				arr=[];
    				
    			}
    			var xtype = null;
    			switch(o['type']) {
    			case 'sdate':
    			case 'date':
    				xtype = 'datefield';
    				break;
    			case 'number':
    			case 'digit':
    			case 'integer':
    				xtype = 'numberfield';
    				break;
				default:
					xtype = 'textfield';
    			
    			}
    			var o1 = {
		            	
		                xtype: xtype,
		                width: 250,
		                name: o['name'],
		                fieldLabel: o['text']
		        };
    			switch(o['type']) {
    			case 'sdate':
    			case 'date':
    				o1['value'] = new Date();
    				break;
				default:
    			
    			}
    			
    			arr.push(o1);
    			
    			line++;
    		}
    	}
		if(o1!=null) {
			oItems.push(o1);
		}
		console_logs('oItems', oItems);
    			
		var items = [];
		for(var i=0; i<oItems.length; i++) {
			items.push(
			{
		        xtype: 'container',
		        layout: 'hbox',
		        defaults: {
		        	margin: '0, 5, 5, 0,',
		        	items: oItems[i]
                 },
                 items: oItems[i]
			});
			
		}
		console_logs('items', items);
		
    	var form = Ext.create('Ext.form.Panel', {
	    		id: gu.id(gu.id('formPanel')),
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
	                margins: 10,
	            },
	            items   : items
			
	                    });//Panel end...
			prwin = gm.me().prwinopen(form);
    	
    },
        
    treatWorkStart: function() {
    	
    	console_logs('==============> gUtil.mesStdProcess', gUtil.mesStdProcess);
    	
      	//다수협력사지정
    	var itemsPartner = [];
    	
    	itemsPartner.push({
            xtype: 'fieldcontainer',
            fieldLabel: '작업지시 번호',
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
                    width: 320,
                    allowBlank: true,
                    value : gm.me().lotname,
                    fieldStyle: 'text-transform:uppercase',
                    emptyText: '영문 대문자 및 숫자',
                    validator: function(v) {
                 	   gm.me().setCheckname(false);
                        if (/[^a-zA-Z0-9_-]/g.test(v)) {
                     	   v = v.replace(/[^a-zA-Z0-9_-]/g,'');
                        }
                        this.setValue(v.toUpperCase());
                        return true;
                    }
                },
                {
                    xtype:'button',
                    style: 'margin-left: 3px;',
                    flex: 1,
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
                     					
                     				}else {
                     					gm.me().setCheckname(false);
                     					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
                     				}
                     				
             
                     			},//Ajax success
                     			failure: extjsUtil.failureMessage
                     		}); 
                     	   	                                		   
                 	   }
    						
                    }//endofhandler
                 }
            ]
        });
    	
    	var arrPcs = this.getPcsRadio();
    	console_logs('arrPcs', arrPcs);
    	var big_pcs_code = (arrPcs[0])['inputValue'];
    	console_logs('***big_pcs_code', big_pcs_code);
    	var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
    	if(smallPcs==null) {
    		for(var i=0; i<gUtil.mesStdProcess.length; i++) {
        		var o = gUtil.mesStdProcess[i];
        		var pcs_code = o['code'];
        		var pcs_name = o['name'];
        		console_logs('itemspartner',o);
        		var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});
        		
    			var myId = this.link + pcs_code+  'h_outmaker';
    			console_logs('myId', myId);
    			this.madeComboIds.push(myId);
    			itemsPartner.push({
    				fieldLabel: pcs_name,//ppo1_request,
    			 	xtype: 'combo',
    				anchor: '100%',
    				name: pcs_code+  'h_outmaker',
    				id: myId,
    				mode: 'local',
    				displayField:   'dept_name',
    				store: aStore,
    				sortInfo: { field: 'create_date', direction: 'DESC' },
    				valueField : 'dept_code',
            	    typeAhead: false,
            	    minChars: 1,
            	    listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
            	      	}
            		}				
    			});

    		
    			
        	}//endoffor
        	
    	} else {
    		for(var i=0; i<smallPcs.length; i++) {
        		var o = smallPcs[i];
        		var pcs_code = o['code'];
        		var pcs_name = o['name'];
        		console_logs('itemspartner',o);
        		var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});
        		
    			var myId = this.link + pcs_code+  'h_outmaker';
    			console_logs('myId', myId);
    			this.madeComboIds.push(myId);
    			itemsPartner.push({
    				fieldLabel: pcs_name,//ppo1_request,
    			 	xtype: 'combo',
    				anchor: '100%',
    				name: pcs_code+  'h_outmaker',
    				id: myId,
    				mode: 'local',
    				displayField:   'dept_name',
    				store: aStore,
    				sortInfo: { field: 'create_date', direction: 'DESC' },
    				valueField : 'dept_code',
            	    typeAhead: false,
            	    minChars: 1,
            	    listConfig:{
            			loadingText: '검색중...',
            	        emptyText: '일치하는 항목 없음.',
            	      	getInnerTpl: function(){
            	      		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
            	      	}
            		}				
    			});

    		
    			
        	}//endoffor
    	}
		
    	

    		itemsPartner.push({
    			fieldLabel: '제작완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestampa',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    	    	value: new Date(),
    		},
    		{
    			fieldLabel: '용접완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestamp1',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    	    	value: new Date(),
    		});

    	itemsPartner.push({
    		
    			fieldLabel: '긴급여부',//ppo1_request,
    		 	xtype: 'combo',
    			anchor: '100%',
    			name: 'recv_flagname',
    			mode: 'local',
    			value: '일반',
    			store: Ext.create('Mplm.store.HeavyEmergency'),
    			sortInfo: { field: 'create_date', direction: 'DESC' },
    			//valueField : 'system_code',
    			displayField : 'code_name_kr',
        	    typeAhead: false,
        	    minChars: 1,
        	    listConfig:{
        			loadingText: '검색중...',
        	        emptyText: '일치하는 항목 없음.',
        	      	getInnerTpl: function(){
        	      		return '<div data-qtip="{unique_id}">[{system_code}] {code_name_kr}</div>';
        	      	}
        		},
        		listeners: {
        	           select: function (combo, record) {
        	        	   var reccode = record.get('system_code');
        	        	   Ext.getCmp('recv_flag').setValue(reccode);
        	           }
        	      }
    		
    			
    		},{
    			xtype: 'hiddenfield',
    			id :'recv_flag',
    			name : 'recv_flag',
    			value : 'GE'
    			
    		
    	});
    	
    	
    
    	
    	var form = Ext.create('Ext.form.Panel', {
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
	                labelWidth: 60,
	                margins: 10,
	            },
	            items: [
	                	{
	                        xtype: 'fieldset',
	                        title: '생산 공정유형',
	                        items: [{
	                            xtype: 'radiogroup',
	                            bind:{
	                            	value:'{switchItem}'
	                            },
	                            defaults: {
	                                name: 'big_pcs_code'
	                            },
	                            columns:1,
	                            items: arrPcs
	                        }]
	                    },
	            	{
	            		xtype: 'fieldset',
	                    title: '작업지시내용',
	                    defaultType: 'textfield',
	                    /*boder : true,
	                    defaults: {
	                        width: 280
	                    },*/
	                    items: itemsPartner
	            	},
		          
		            ]//item end..
			
	                    });//Panel end...
			myHeight = 400;
			myWidth = 400;
			var prWin =	Ext.create('Ext.Window', {
				modal : true,
	        title: gm.getMC('CMD_Job_Confirm', '작업지시'),
	        width: myWidth,
	        
	        height: myHeight,	
	        plain:true,
	        items: form,
	        buttons: [{
	            text: CMD_OK,
	            id: gu.id('prwinopen-OK-button'),
	        	handler: function(btn){
	        		var msg = '작업지시를 하시겠습니까?'
	        		var myTitle = '작업지시';
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
	                    	var assymapUids = [];
			            	console_logs('===form value', form.getValues());
			            	
//	                    	var assymapUids = gm.me().cartmap_uids;
	                    	var ac_uid = gm.me().vSELECTED_AC_UID;
//	                    	var assymapUids = gm.me().vSELECTED_ASSYMAP_UID;
	                    	var selections = gm.me().grid.getSelectionModel().getSelection();
	                    	for(var i=0; i< selections.length; i++) {
	                    		var rec = selections[i];
	                    		console_logs('===rec', rec);
	                    		var uid =  rec.get('id');  //CARTMAP unique_id
	                    		assymapUids.push(uid);
	                    	};
	                    	
	                    	if(vCompanyReserved4 == "HAEW01KR") {
	                    	if(gm.me().big_pcs_code == null) {
	                    		gm.me().big_pcs_code = 'SSP'
	                    	}
	                    } else if(vCompanyReserved4 == "DAEH01KR") {
	                    	if(gm.me().big_pcs_code == null) {
	                    		gm.me().big_pcs_code = 'PRD'
	                    	}
	                    } else {
	                    	if(gm.me().big_pcs_code == null) {
	                    		gm.me().big_pcs_code = null
	                    	}
	                    }
	                    	
	                    	console_logs('====ac_uid', ac_uid);
	                    	console_logs('====assymapUids', assymapUids);
	                    	console_logs('gm.me().big_pcs_code', gm.me().big_pcs_code);
	                    	
	                    		var reserved_varchar3 = 
	            					form.submit({
	                                 url : CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavyBatch',
	                                 params:{
//	                                    				cartmap_uids: assymapUids,
	                                    				ac_uid: ac_uid,
	                                    				reserved_varchar3: gm.me().big_pcs_code,
	                                    				parent_code: 'SRO5_SUB',
	                                    				assymapUids: assymapUids,
	                                   				},
	                                    			success: function(val, action){
	                                    				prWin.close();
	                                    				gMain.selPanel.store.load(function(){});
//	                                    				gm.me().grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
//	                                    				gm.me().store.load(function(){});
//	                                    				var rec = Ext.JSON.decode(response.responseText);
//	                        	         				gm.me().lotname = rec['datas'];
//	                        	         				gm.me().treatLotOp();
	                                    			},
	                                    			failure: function(val, action){
	                                    				 prWin.close();
	                                    			}
	                        		}); 

	                    	}
	                   }//fn function(btn)
	                    
	                });//show
	        	}//btn handler
			},{
	            text: CMD_CANCEL,
	        	handler: function(){
	        		if(prWin) {
	        			
	        			prWin.close();
	        			
	        		}
	        	}
			}]
	    });
	    console_logs('start');
		  prWin.show(
			  undefined, function(){
				  
				  
				  var arr = gm.me().madeComboIds;
				  for(var i=0; i<arr.length; i++) {
					  var comboId = arr[i];
					  console_logs('comboId', comboId);
					  Ext.getCmp(comboId).store.load(function(records) {			
	        					if(records!=null && records.length>0) {
	        						var rec = records[0];
	        						var mycomboId = gm.me().link + rec.get('pcs_code')+  'h_outmaker';
	        						console_logs('record', records[0]);
	    			            	Ext.getCmp(mycomboId).select(records[0]);         						
	        					}
				        });
					  
				  }
			    }
			);
		  console_logs('end');
    },
    
    getPcsRadio: function() {
       	
       	var arr = [];
		 
		 var n=0;
console_logs('================= START =============', arr);
		 
		 for(var i=0; i<gUtil.mesTplProcessBig.length; i++) {
			 var o = gUtil.mesTplProcessBig[i];
			 console_logs('o', o);
			 
			 var pcsCode = o['code'];
			 var pcsTemplate = o['pcsTemplate'];
			 console_logs('pcsTemplate=', pcsTemplate);
			 console_logs('pcsCode=', pcsCode);
			 var o1 = gUtil.mesTplProcessAll;
			 console_logs('o1=', o1);
			 var subArr = o1[pcsCode];		
			 console_logs('subArr=', subArr);
			 
			 var big_pcs_code = 'SPL';
			 if(vCompanyReserved4 == "HAEW01KR") {
				 if(this.multi_grid_id=='STL' || this.multi_grid_id=='ALL-STL') {
					 big_pcs_code = 'STL'
				 }
			 }
			 console_logs('===+this.multi_grid_id', this.multi_grid_id);
			 if(vCompanyReserved4 == "DAEH01KR") {
				 if(this.multi_grid_id==undefined) {
					 big_pcs_code = 'TPL'
				 }
			 }
			 
			 console_logs('===+big_pcs_code', big_pcs_code);

			 console_logs('===+pcsTemplate', pcsTemplate);
			 if(pcsTemplate == big_pcs_code) {
				 var pcsnames = ''
					 for(j=0; j<subArr.length; j++) {
						 var o2 = subArr[j];
						 
						 if(pcsnames!='') {
							 pcsnames = pcsnames + ' -> ';
						 }
						 pcsnames = pcsnames + o2['name'];
					 }
					 arr.push({
						
	                     inputValue: o['code'],
	                     boxLabel: o['name'] + '  (' + pcsnames +')',
	                     name:'big_pcs_code',
	                     checked: (n==0)?true:false,
                       
	                    		 listeners: {
                               
                               }
	                 });
						n++;	
			 }
			 	
		 }
		 console_logs('================= END =============', arr);
		 return arr;
    },
    
    
    attributeInputShinhwa: function(){
    	var form = null;
		//var checkname = false;
		 form = Ext.create('Ext.form.Panel', {
	    		id: gu.id(gu.id('formPanel')),
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
	                margins: 10,
	            },
	            items   : [{
								    xtype: 'fieldset',
								    title: '입력',
								    margin: '5',
								    
								    defaults: {
					                     anchor: '100%',
					                 },
								    items: [{
								        xtype: 'container',
								        
								        layout: 'hbox',
								        defaults: {
								        	//margin: '5'
								        	margin: '0, 5, 5, 0,'
								        	
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								            	
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved105',
								                fieldLabel: '구분자 순번'
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            labelWidth:'50',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved32',
								                fieldLabel: '도장착수 예정일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            labelWidth:'50',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved80',
								                fieldLabel: '적치자',
								                
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            labelWidth:'50',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved20',
								                fieldLabel: 'SHI청구자재2'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            labelWidth:150,
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved30',
								                fieldLabel: '도장불량완료여부'
								            }]
								        }]
								    
								    },{
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved70',
								                fieldLabel: '제작 착수일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved75',
								                fieldLabel: '도장착수일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved83',
								                fieldLabel: '최종납품PALLET'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved23',
								                fieldLabel: '결품 사유',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved31',
								                fieldLabel: '도장실패비용',
								            }]
								        }]
								 
							        },
								    
								    {
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved72',
								                fieldLabel: '제작 검사 예정일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved76',
								                fieldLabel: '1차도장완료일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved16',
								                fieldLabel: 'D렉번호',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved24',
								                fieldLabel: '제작불량사유1',
								            }]
								        }]
								    },{
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved73',
								                fieldLabel: '제작 완료일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved77',
								                fieldLabel: '2차도장완료일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved18',
								                fieldLabel: '납품장소',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved25',
								                fieldLabel: '제작불량사유2',
								            }]
								        }]
								    },{
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved100',
								                fieldLabel: '메모1',
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved78',
								                fieldLabel: '도장완료일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved87',
								                fieldLabel: '불출일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved26',
								                fieldLabel: '제작불량완료여부',
								            }]
								        }]
								    },{
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved101',
								                fieldLabel: '메모2',
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved102',
								                fieldLabel: '메모3',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved35',
								                fieldLabel: '공급일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved27',
								                fieldLabel: '제작실패비용',
								            }]
								        }]
								    },{
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved15',
								                fieldLabel: 'C렉번호',
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved103',
								                fieldLabel: '메모4',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved104',
								                fieldLabel: '메모5',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved28',
								                fieldLabel: '도장불량사유1',
								            }]
								        }]
								    },{
								        xtype: 'container',
								        layout: 'hbox',
								        defaults: {
								        	margin: '0, 5, 5, 0'
						                 },
								        
								        items: [{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved74',
								                fieldLabel: '도장사 인수일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        }, {
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'datefield',
								                width: 250,
								                name: 'h_reserved79',
								                fieldLabel: '적치일',
								                format: 'Y-m-d',
										    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
										    	dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved19',
								                fieldLabel: 'SHI청구자재1',
								            }]
								        },{
								            xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								                xtype: 'textfield',
								                width: 250,
								                name: 'h_reserved29',
								                fieldLabel: '도장불량사유2',
								            }]
								        }]
								    }]
								}
								]
	                   
			
	                    });//Panel end...
			prwin = gm.me().prwinopen(form);
		
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
		modal : true,
        title: '정보 수정',
        plain:true,
        items: form,
       	margin: 5,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
               	var form = gu.getCmp(gu.id('formPanel')).getForm();
               	var srcahd_uids = [];
            	var selections = gm.me().grid.getSelectionModel().getSelection();
            	console_logs('=====>selections', selections);
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var uid =  rec.get('id');
            		console_logs('=====>uid', uid);
            		srcahd_uids.push(uid);
            	}
                    	
  					form.submit({
                    url : CONTEXT_PATH + '/index/process.do?method=updateItemdetail',
                         params:{
                        	 srcahduids: srcahd_uids
                         				},
                                			success: function(val, action){
                                				prWin.close();
                                				gm.me().storeLoad(function(){});
                                			},
                                			failure: function(val, action){
                                				 prWin.close();
                                			}
                    		}); 
    		
        	
        	}//btn handler
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
    specConfirm : function(){
    	
    	var form = null;
    	form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel-spec',
    		xtype: 'form',
    		bodyPadding: '3 3 0',
    		region: 'center',
    		items:[
    			{
    				xtype: 'textareafield',
    				width: 300,
    				height: 300,
    				value: gm.me().spec
    			}
    		]
    	});
    	
    	this.specwinopen(form);
    	
    },
    
    extoutJson: function(multi_grid_id, records, fname) {
    	
    	if(records==null || records.length==0) {
    		return;
    	}
    	var big_pcs_code = multi_grid_id==undefined? 'SSP' : multi_grid_id;
    	
    	switch(vCompanyReserved4){
		case 'SWON01KR':
			processList = [];
			for(var i=0; i<gUtil.mesStdProcess.length; i++) {
				var o = gUtil.mesStdProcess[i];
				console_logs('processList', o);
				if(o['code']==multi_grid_id) {
					var o1 = {
							pcsTemplate: o['code'],
							code: o['code'],
							process_price:0,
							name: o['name']
					};
					console_logs('o1',o1);
					processList.push(o1);
				}
			}
			var smallPcs = processList;
			break;
		default:
			var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
	}
//    	var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
    	
    	for(var j=0; j<smallPcs.length; j++) {
    		var o1 = smallPcs[j];
    		var pcsCode = o1['code'];
    		
    		
        	for(var i=0; i<records.length; i++) {
        		var o = records[i];
        		o.set(pcsCode+'|'+fname, null);
        	}
    		
    	}
    	
    	
    	for(var i=0; i<records.length; i++) {
    		var o = records[i];
    		o.set('update_pcsstep', 'FULL_MAKE');//공정처리
    		var js_fname = o.get('js_' + fname);
    		
    		for(var key in js_fname) {
    			//console_logs('key', key);
    			var arr = js_fname[key];
    			if(arr instanceof Array) {
    				o.set(key+'|'+fname, arr[0]);
    			} else {
    				o.set(key+'|'+fname, arr);
    			}
    		}
    		
    	}
    },changeFieldNameSHNH: function(big_pcs_code, name, new_c, key) {
			switch(name) {
			case '제작':
				new_c[key] = '제작 완료일';
				break;
			case '제작검사':
				new_c[key] = '제작검사 완료일';
				break;
			case '도장':
				new_c[key] = '도장 완료일';
				break;
			case '도장검사':
				new_c[key] = '도장검사 완료일';
				break;
			}
    },changeFieldNameSWON: function(big_pcs_code, name, new_c, key) {
		switch(name) {
		case '제관':
			new_c[key] = '제관 완료일';
			break;
		case '도장':
			new_c[key] = '검사 완료일';
			break;
		case '조립':
			new_c[key] = '조립 완료일';
			break;
		case '검사':
			new_c[key] = '검사 완료일';
			break;
		case '기계가공':
			new_c[key] = '기계가공 완료일';
			break;
		case '벤딩':
			new_c[key] = '벤딩 완료일';
			break;
		case '절단':
			console_logs('==new_c', new_c);
			new_c[key] = '절단 완료일';
			break;
		case '취부':
			new_c[key] = '취부 완료일';
			break;
		case '용접':
			new_c[key] = '용접 완료일';
			break;
	}
},
    addExtraColumnBypcscode: function(myColumn, myField, big_pcs_code, step_field, editable,pos) {
    	console_logs('addExtraColumnBypcscode big_pcs_code', big_pcs_code);
    	var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
    	
	   switch(vCompanyReserved4){
			case 'SWON01KR':
				processList = [];
				// for(var i=0; i<gUtil.mesStdProcess.length; i++) {
				for(var i=0; i<this.processList.length; i++) {
					var o = this.processList[i];
					console_logs('processList', o);
					if(o['code']==big_pcs_code) {
						var o1 = {
								pcsTemplate: o['code'],
								code: o['code'],
								process_price:0,
								name: o['name']
						};
						console_logs('o1',o1);
						processList.push(o1);
					}
				}
				var smallPcs = processList;
				break;
			default:
		    	if(smallPcs==undefined || smallPcs.length==0) {
		    		return;
		    	}
		}
    	console_logs('smallPcs', smallPcs);
    	//복사대상
    	var c  = myColumn[0];
    	var f = myField[0];
    	for(var j=0; j<smallPcs.length; j++) {
    		var o = smallPcs[j];
    		
    		var new_c = {};
    		for(var key in c) {
    			switch(key) {
    			case 'dataIndex':
    				new_c[key] = o['code']+'|' + step_field;
    				break;
    			case 'text':
    				new_c[key] = o['name'];
    				
    				switch(vCompanyReserved4) {
    				case 'HAEW01KR':
    				case 'DAEH01KR':
    					this.changeFieldNameHaewon(big_pcs_code, o['name'], new_c, key);
    					break;
    				case 'DOOS01KR':
    					this.changeFieldNameDoosung(big_pcs_code, o['name'], new_c, key);
    					break;
    				case 'SHNH01KR':
    					this.changeFieldNameSHNH(big_pcs_code, o['name'], new_c, key);
    					break;
					case 'SWON01KR':
					console_logs('====new', new_c);
					console_logs('=====qqq', key);
    					this.changeFieldNameSWON(big_pcs_code, o['name'], new_c, key);
    					break;
    				}
    				break;
				default:
					new_c[key] = c[key];
    				
    			}
    		}
    		var new_f = {};
    		console_logs('smallPcs o', o);
    		for(var key in f) {
    			switch(key) {
    			case 'text':
    				new_f[key] = o['name'];
    				break;
    			case 'name':
    				new_f[key] = o['code']+'|' + step_field;
    				break;
				default:
					new_f[key] = f[key];
    				
    			}
    		}
    		new_c['canEdit'] = editable;
    		new_c['dataType'] = 'sdate';
    		new_c['important'] = true;
    		new_f['tableName'] = 'pcsstep';
    		new_f['type'] = 'date';
    		new_f['useYn'] = 'Y';
    		new_c['width'] = 120;
        	console_logs('-----------new_c', new_c);
        	console_logs('--------------new_f', new_f);
    		myColumn.splice(pos+j, 0, new_c);
        	myField.splice(pos+j, 0, new_f);

    	}
    	console_logs('-----------myColumn', myColumn);
    	console_logs('--------------myField', myField);
    },
    
    specwinopen : function(form){
    	specwin =	Ext.create('Ext.Window', {
    		modal : true,
            title: '정보 수정',
            plain:true,
            items: form,
           	margin: 5,
           	width: 340,
           	height: 400,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
            		specwin.close();
            		
            	}//btn handler
    		}]
    	});
    	specwin.show();
    },
	//10일 이전:초록, 5일이전 노랑 3일이전 빨강. 지나면 검정
	highlightCell: function(o, gap, value, field) {
		if(gap!='') {
			var n = Number(gap);
			var background = 'white';
			var color = 'black';
			if(n>9) {
				background = '#6CB33E';
				color = 'white';
			} else if(n>5&&n<10) {
				background = '#FFE8A6';
				color = 'black';
			} else if(n<4&&n>-1) {
				background = '#E82030';
				color = 'white';
			} else {
				background = '#333333';
				color = 'white';
			}
//			switch(n){
//			case n<11 :
//				background = '#6CB33E';
//				color = 'white';		
//			case n<6 :
//				background = '#FFE8A6';
//				color = 'black';	
//			case n<4 :
//				background = '#E82030';
//				color = 'white';
//				break;
//			default:
//				background = '#333333';
//				color = 'white';
//			}

			o.set(field, '<span style="background:' +background + ';color:' + color + ';">' + value + '</span>');
		}
	},
	highlightCodes: ['reserved6', 'h_reserved45', 'h_reserved46'],
	multi_grid_id: undefined,
	
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
			    	value: new Date(),
			    	width: 100,
				handler: function(){
				}
			});
	switch(vCompanyReserved4){
		case 'SWON01KR':
			// processList = [];
			// for(var i=0; i<gUtil.mesStdProcess.length; i++) {
			// 	var o = gUtil.mesStdProcess[i];
			// 	console_logs('processList', o);
			// 	if(o['code']==code) {
			// 		var o1 = {
			// 				pcsTemplate: o['code'],
			// 				code: o['code'],
			// 				process_price:0,
			// 				name: o['name']
			// 		};
			// 		console_logs('o1',o1);
			// 		processList.push(o1);
			// 	}
			// }
			var processList = [];
			for(var i=0; i<this.processList.length; i++) {
				var o = this.processList[i];
				if(o['code'] == code) {
					var o1 = {
						pcsTemplate: o['code'],
						code: o['code'],
						process_price:0,
						name: o['name']
					};
					processList.push(o1);
				}
			}
			var smallPcs = processList;
			break;
		default:
			var smallPcs = gUtil.mesTplProcessAll[code];
	}
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
							switch(vCompanyReserved4){
								case 'SHNH01KR':
									d = new Date(date);
//									
									  var year = d.getFullYear(); 
									  var month =  d.getMonth() + 1;
									  var day = d.getDate();
									  
									  if(month<10){
										  month = '0'+ month;
									  }
									  
									  if(day<10){
										  day = '0'+ day;
									  }
									  date = year+'-'+month+'-'+day;

									break;
							}
							console_logs('val', date);
							var selections = gm.me().tab_selections[this.big_pcs_code];
							console_logs('selections>>>>>>>>', selections);
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
	
doRequest: function(o) {
    	
    	
    	var assymap_uids = [];
    	var selections = this.grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var uid =  rec.get('unique_id');
    		assymap_uids.push(uid);
    	
    	}
    	
    	o['assymap_uids'] = assymap_uids;
    	o['parent_code'] = this.link;

    	
	    Ext.Ajax.request({		
			url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
			params: o,
			/*{
				assymap_uids: assymap_uids
			},*/
			
			success : function(result, request) { 
				gm.me().store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			
			failure: extjsUtil.failureMessage
		});//endofajax	

    },
	
	findToolbarCal: function(big_pcs_code) {
    	var toolbar = null;
    	var items = null;
    	if(big_pcs_code!=undefined) {
    		var infos = gm.me().tab_info;
    		console_logs('infos', infos);
    		if(infos!=null) {
    			for(var i=0; i<infos.length; i++) {
    				var o = infos[i];
    				if(o['code'] == big_pcs_code) {
    					var toolbars = o['toolbars'];
    					toolbar = toolbars[0];
    					items = toolbar.items.items;
    					 
    				}
        			
    			}
    		}
    		
    	}
    	
		if(items!=null && items.length>0) {
			return items[0];
		} else {
			return null;
		}
    	
    	console_logs('toolbar', toolbar);
    	console_logs('toolbar items', items);
	},
    
	tab_selections: {},
	
	prevTagnoIn : '',
    setCheckname: function(b) {
    	this.checkname=b;
    	
    	var btn = gu.getCmp('prwinopen-OK-button');
    	if(b==true) {
    		btn.enable();
    	} else {
    		btn.disable();
    	}
    	
	},
	processList : null,
    madeComboIds: [],
    poType: 'MTR',
    //storeLoad callback ocerride
    storeLoadCallbackSub: function(records) {
		console_logs('records', records);
		
		//gm.me().multi_grid_id = multi_grid_id;
		var multi_grid_id = gm.me().multi_grid_id;
        console_logs('디폴트 데이터', multi_grid_id);
        
        if(multi_grid_id==undefined) {
       	   for(var i=0; i < records.length; i++){
      		   
       		  var keyCode = multi_grid_id;
       		  if(vCompanyReserved4=='HAEW01KR') {
       			 keyCode = 'SSP';
       		  }
       		   
       		   var specunit = records[i].get('specification');
       		   gm.me().spec.push(specunit);
     	        	
       	   }
        } else {
			var keyCode = multi_grid_id;
 			if(vCompanyReserved4=='HAEW01KR') {
 				if(keyCode=='ALL-STL') {
 					keyCode = 'STL';
 				}
     		}
        }
        
		gm.me().extoutJson(multi_grid_id, records, 'dept_name');
		//gm.me().extoutJson(multi_grid_id, records, 'start_date');
		gm.me().extoutJson(multi_grid_id, records, 'end_date');
		//gm.me().extoutJson(multi_grid_id, records, 'give_date');
		//gm.me().extoutJson(multi_grid_id, records, 'real_mh');
		//gm.me().extoutJson(multi_grid_id, records, 'std_mh');
		gm.me().extoutJson(multi_grid_id, records, 'step_uid');
    	console_logs('extoutJson records', records);

	}
//	bSelected: false,
//	 refreshButtons: function(bSelected) {
//		 
//		console_logs('this.big_pcs_code', this.big_pcs_code);
//		 
//		if(this.selections!=undefined && this.selections!=null) {
//			this.bSelected = bSelected;
//		}
//		
//		
//		if(vCompanyReserved4 == 'HAWE01KR') {
//			if( this.bSelected == true && 
//        			this.selections!=undefined && 
//        			this.selections!=null && 
//        			this.selections!='') {
//        			attributeInputHW().enable();
//        		} else {
//        			attributeInputHW().disable();       		}
//		}
//	 },
});
