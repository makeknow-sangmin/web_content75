Ext.define('Rfx.view.produceMgmt.HEAVY5_ProducePlanViewCHNS', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produceplanCHNS-view',
    initComponent: function(){
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	var useMultitoolbar = true;
       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: gm.getMC('CMD_Order_Date', '등록일자'),
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'rtgast', 
			field_id: 'rtgast_varchar2',       
			fieldName: 'reserved_varchar2'
			
		});
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'rtgast', 
			field_id: 'reserved_varcharb',       
			fieldName: 'reserved_varcharb'
			
		});
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'srcahd', 
			field_id: 'specification',       
			fieldName: 'specification'
			
		});
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'project', 
			field_id: 'pj_code',       
			fieldName: 'pj_code'
			
		});
      
		//검색툴바 생성
//		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
      
            
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); 
        
        
        
        
        switch(vCompanyReserved4){
        case "CHNG01KR":
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY5ProducePlanCHNS',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
    	        	property: 'wa_name, assymap.unique_id',
    	            direction: 'DESC'
    	        }]
    	        
    	    }, {
    	    	groupField: 'wa_name'
        }
        );
        	break;

        default:
        	//모델 정의
            this.createStore('Rfx.model.HEAVY4ProducePlan', [{
                property: 'item_code',
                direction: 'DESC'
            }],
            	['100']/*pageSize*/
            ,{
            	creator: 'a.item_code',
            	unique_id: 'a.unique_id'
            }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['cartmap']
            );
        	break;
        }
        
        
	/*	for(var i=0; i< this.columns.length; i++) {
		        	
		        	var o = this.columns[i];
		        	//console_logs('this.columns' + i, o);
		        	
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
		        	case 'reserved_double2':
		        	case 'reserved_double3':
		        	case 'quan':
		        	case 'bm_quan':
		        		o['summaryType'] = 'sum';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
		                	return value;
		                };
		        		break;
		        	case 'h_reserved9':
		        		o['summaryType'] = 'count';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:15pt; color:blue;">합계</font></div>'
		                	return value;
		                };
		        	case 'po_type':
		        		o['summaryType'] = 'count';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
		                	return value;
		                };

		        		default:
		        		/*o['summaryType'] = 'count';
		          		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		          			console_logs('value', value);
		          			console_logs('summaryData', summaryData);
		          			console_logs('dataIndex', dataIndex);
		                    return ((value === 0 || value > 1) ? '(' + value + ' 개)' : '(1 개)');
		                };
		        	}
		        	
		        }*/

		
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
//        arr.push(searchToolbar);
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
        //grid 생성.
        switch(vCompanyReserved4){
        case "DDNG01KR":
    		var option = {
				features: [{
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
		            hideGroupedHeader: true,
		        }]
			};
        	this.createGridCore(arr, option);
        	break;
        case "CHNG01KR":
    		var option = {
				features: [{
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}:: </font> ({rows.length} 공정)</div>',
		            hideGroupedHeader: true,
		        }]
			};
        	this.createGridCore(arr, option);
        	break;

        default:
        	 this.createGrid(arr, function(){});
        break;
        }
       
        
        //this.removeAction.setText('반려');
        //Action Button 이름 변경.
        //this.editAction.setText('계획수립');
       // 
        //this.setEditPanelTitle('계획수립');

       var viewName = this.link;
    /*   buttonToolbar.insert(3, '-');  
       var ALL = Ext.create('Ext.Action', {
        	 xtype : 'button',
  			 text: '전체 목록',
  			 tooltip: '전체 목록',
  			 req_flag: 'G',
  			 status: 'CR',
  			 pressed: true,
  			 toggleGroup: this.link + 'reqFlagType',
  			 handler: function() {
  				console_logs('actino setDenyChns function))))))))))');
  				console_logs('store))))))))))',this.store);
  				 gm.me().setALLCh(this.req_flag, this.status);
  			
  			 }
       
  		});
       buttonToolbar.insert(3, ALL);
       buttonToolbar.insert(3, '-');  
       var action = Ext.create('Ext.Action', {
        	 xtype : 'button',
  			 text: '삼성 반려목록',
  			 tooltip: '삼성반려목록',
  			 req_flag: 'S',
  			 status: 'BM',
  			 store:'Rfx.store.CartLineStore',
  			 pressed: true,
  			 toggleGroup: this.link + 'reqFlagType',
  			 handler: function() {
  				
  				gm.me().setDenyChns(this.req_flag, this.status);
  			
  			 }
       
  		});
       
       buttonToolbar.insert(3, action);
       buttonToolbar.insert(4, '-');  */
   /*    var Allaction = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '기타 반려목록',
			 tooltip: '기타반려목록',
			 req_flag: 'G',
			 status: 'BM',
			 pressed: true,
			 toggleGroup: this.link + 'reqFlagType',
			 handler: function() {
				 gm.me().setDenyChng(this.req_flag, this.status);
			
			 }
     
		});
       buttonToolbar.insert(4, Allaction);*/
      //Lot 구성 Action 생성
        this.addLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '제작 Lot 구성',
			 tooltip: '제작 Lot 구성',
			 disabled: true,
			 handler: function() {
				/* var req_flag = gm.me().vSELECTED_REQ_FLAG;
				 if(req_flag == 'S'){
					 Ext.Ajax.request({
						 url: CONTEXT_PATH + '/index/process.do?method=bringlastlotname',
						 params:{
						 		},
	         			 success : function(response, request) {
	         				var rec = Ext.JSON.decode(response.responseText);
	         				
	         				gm.me().lotname = rec['datas'];
	         				
	         				gm.me().treatLotOp();
	         			},
	         			failure: function(val, action){
	          				 alert('ajax실패');
	            			}
					 });
				 }else{*/
					 gm.me().treatLotOp();
//				 }
				 }
				 
		});
        
        //도장 Lot 구성 Action 생성
        this.addPaintLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '도장 Lot 구성',
			 tooltip: '작업 그룹 구성',
			 disabled: true,
			 handler: function() {
				 gm.me().mtr_type = 'PNT';
				 gm.me().treatLotOp();
				 }
		});
        
      //Lot 해체 Action 생성
        this.cancleLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '소그룹 해체',
			 tooltip: '소그룹 해체',
			 disabled: true,
			 handler: function() {
				 
				 gm.me().cancleLotOp();
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
        buttonToolbar.insert(2, this.addLotAction);
        var processes = null;
        
      /*  switch(vCompanyReserved4) {
        case 'DDNG01KR':
        	break;
        	default:
		        if(gUtil.checkUsePcstpl()==true) {
		        	var processes = gUtil.mesTplProcessBig;
		
		        	 buttonToolbar.insert(4, '->'); 
		        	 for(var i=0; i<processes.length; i++) {
		             	var o = processes[i];
		             	var big_pcs_code = o['code'];
		             	var title = '[' + o['code'] + ']' + o['name'];
		             	console_logs('title', title);
		             	
		                 var action = Ext.create('Ext.Action', {
		                	 xtype : 'button',
		          			 text: title,
		          			 tooltip: title + '공정',
		          			 big_pcs_code: big_pcs_code,
		          			 toggleGroup: this.link + 'bigPcsType',
		          			 handler: function() {
		          				gm.me().setBigPcsCode(this.big_pcs_code);
		          			 }
		          		});
		               
		                 buttonToolbar.insert(4, action);
		             	
		             }
		             var action = Ext.create('Ext.Action', {
		              	 xtype : 'button',
		        			 text: '전체 공정',
		        			 tooltip: '전체 공정' + '공정',
		        			 big_pcs_code: null,
		        			 pressed: true,
		        			 toggleGroup: this.link + 'bigPcsType',
		        			 handler: function() {
		        				 gm.me().setBigPcsCode(this.big_pcs_code);
		        			 }
		        		});
		             
		               buttonToolbar.insert(4, action);
		        }
            	console_logs('buttonToolbar', buttonToolbar);
        }*/
        

       
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	//button enable/disable
            //	this.refreshButtons(true);
            	
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
            	gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id'); //cartmap의 child
            	gm.me().vSELECTED_PARENT = rec.get('parent'); //cartmap의 parent => assymap의 unique_id(대동일 경우)
            	gm.me().vSELECTED_AC_UID = rec.get('ac_uid'); 
            	gm.me().vSELECTED_TYPE = rec.get('reserved_varchar3');  // 제작/도장 구분
            	gm.me().vSELECTED_UNIQUE_UID = rec.get('unique_uid'); //선택된 CARTMAP_UID
            	gm.me().vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); //선택된 ASSYMAP_UID
            	gm.me().vSELECTED_REQ_FLAG = rec.get('req_flag');
            	gm.me().vSELECTED_CHILD = rec.get('child');
            	console_logs('setGridOnCallback_req_flag', gm.me().vSELECTED_REQ_FLAG );
            	console_logs('setGridOnCallback', gm.me().vSELECTED_UNIQUE_UID);
            	
	            	if(rec!=null){
	            		console_logs('pcsstd 불러오기',rec);
		                var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
		                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gm.me().vSELECTED_ASSYMAP_UID );
		                processGrid.getStore().getProxy().setExtraParam('ac_uid',  gm.me().vSELECTED_AC_UID);
		                processGrid.getStore().getProxy().setExtraParam('child',  gm.me().vSELECTED_CHILD);
		                processGrid.getStore().getProxy().setExtraParam('req_flag',  gm.me().vSELECTED_REQ_FLAG);
		                
		                console_logs('child', gm.me().vSELECTED_CHILD );
		                console_logs('assymap_uid', gm.me().vSELECTED_ASSYMAP_UID );
		                console_logs('ac_uid', gm.me().vSELECTED_AC_UID );
		                //console_logs('unique_id', gm.me().gm.me().vSELECTED_UNIQUE_ID );
		               // console_logs('unique_id', gm.me().gm.me().vSELECTED_UNIQUE_ID );
		                processGrid.getStore().load();
	            	}
	            	gMain.selPanel.addLotAction.enable();
	       	
            	}else{
            	//button enable/disable
            //	this.refreshButtons(false);
            		gMain.selPanel.addLotAction.disable();
            }
        	
        });

        
        this.createCrudTab();


        
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
		var calcNumber = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '수량계산',
			 tooltip: '수량 계산하기',
			 handler: function() {
				 var gridPcsStd = Ext.getCmp('producePlanGrid');
				 //console_logs('gridPcsStd', gridPcsStd);
				 //console_logs('gm.me().vSELECTED_UNIQUE_ID', gm.me().vSELECTED_UNIQUE_ID);
				 
			    	var modifiend =[];
			    	//var rec = gridPcsStd.getSelectionModel().getSelection()[0];
			    	//var unique_id = rec.get('unique_id');
			    	
			    	var target_bm_quan = null;
			    	var target_bm_quan2 = null;
			    	
			    	try {
				    	target_bm_quan = gm.me().getInputTarget('bm_quan', '1');
				    	target_bm_quan2 = gm.me().getInputTarget('bm_quan', '2');
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
	    	           		
			    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gm.me().vSELECTED_UNIQUE_ID);
			    	           	console_logs(record);
			    	           	var pcs_code = record.get('pcs_code').toUpperCase();
			    	           	if(gMain.checkPcsName(pcs_code)) {
			    	           		
			    	           		var plan_date = record.get('plan_date');
			    	           		var yyyymmdd ='';
			    	           		if(plan_date!=null) {
			    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '/');
			    	           		}
			    	           		
//		    	           			if(tomCheck==true) {
//		    	           				var target_reserved_double3 = gm.me().getInputTarget('reserved_double3');
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
//			                    addPcsStep,
//			                    '-',

			                    '->',
			                    calcNumber,
			                    '-',
			                    resetPcsStep
//			                    {
//			                    	id: 'splitbuttonTemplate' + this.link,
//			                    	iconCls: 'fa-bitbucket_14_0_5395c4_none',
//		    						xtype: 'splitbutton',
//		    					   	text: '템플리트',
//		    					   	selectedMennu: -1,
//		    					   	tooltip: '표준공정 템플리트',
//		    					   	handler: function() {}, // handle a click on the button itself
//		    					   	menu: new Ext.menu.Menu({
//		    					   		id: 'producePlanview' + '-mainmenu'
//		    					   	})
//			    				 }
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
       
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.storeLoad = function() {
            this.store.load(function(records) {
            });
        };
        
        if(gUtil.checkUsePcstpl()==false) {//pcstpl 사용하지 않으면
	        this.mtr_type = 'PRD';
		    if (viewName == "EPC5_T") {
		    	this.mtr_type = 'TPRD';
		    } 
        }
        if(this.mtr_type!=null) {
        	this.grid.getStore().getProxy().setExtraParam('mtr_type', this.mtr_type);
        }

        switch(vCompanyReserved4) {
        case 'DDNG01KR':
        	this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000300');
        	break;
    	default:
    		break;
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
    
    treatLotOp: function(){
    	var form = null;
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
	                           fieldLabel: 'Lot 명',
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
        title: 'LOT 명',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
            id: gu.id('prwinopen-OK-button'),
            disabled: true,
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gm.me().checkname);
        		if(gm.me().checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	var cartmaparr =[];
                    	var po_quan = 0;
                    	var reserved_double4 = 0;
                    	var selections = gm.me().grid.getSelectionModel().getSelection();
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
                    		var req_flag = rec.get('req_flag');
                    		var reserved_varcharb = rec.get('reserved_varcharb');
                    		var reserved_varchar2 = rec.get('reserved_varchar2');
                    		var bigPcsCode = rec.get('bigPcsCode');
                    		console_logs('bigPcsCode', bigPcsCode);
                    	}
                    	console_logs('cartmaparr', cartmaparr);
                    	//var cartmaparr = gm.me().cartmap_uids;
                    		var ac_uid = gm.me().vSELECTED_AC_UID;
                    	
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                             params:{
				                            	 reserved_varcharb:reserved_varcharb,
				                            	 reserved_varchar2:reserved_varchar2,
                            	 				reserved_varchar3:bigPcsCode,
                            	 				req_flag:req_flag,
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3 : gm.me().getProcessType(),
                                				po_quan: po_quan,
                                				reserved_double4 : reserved_double4,
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				gm.me().storeLoad();
                                			},
                                			failure: function(val, action){
                                				 prWin.close();
                                			}
                    		}); 
    			}// checkname of end
        	
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
	    	
	    	var target_bm_quan = gm.me().getInputTarget('reserved_double2');
	    	
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
	    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gm.me().vSELECTED_UNIQUE_ID);
	    	           	console_logs(record);
	    	           	var pcs_code = record.get('pcs_code').toUpperCase();
	    	           	var pcs_name = record.get('pcs_name');
	    	           	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	           		var plan_date = record.get('plan_date');
	    	           		var yyyymmdd ='';
	    	           		if(plan_date!=null) {
	    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '/');
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
	/* refreshButtons: function(bSelected) {
		console_logs('this.big_pcs_code++++++++++++', this.big_pcs_code);
		console_logs('bSelected++++++++++++++', bSelected);
		if(bSelected!=undefined && bSelected!=null) {
			this.bSelected = bSelected;
		}
		
		if( bSelected == true && 
			this.big_pcs_code!=undefined && 
			this.big_pcs_code!=null && 
			this.big_pcs_code!='') {
			console_logs('in refreshButtons enable before++++++++++++++');
		     	this.addLotAction.enable();
		     	this.addPaintLotAction.enable();			
		} else {
				this.addLotAction.disable();
				this.addPaintLotAction.disable();			
		}
		

		
	 },*/
	 setDenyChns: function(req_flag,status){
		
		 console_logs('req_flag', req_flag); 
		 console_logs('assymap.status', status); 
		 
		 this.req_flag = req_flag;
		 this.status = status;
			this.cartLineStore = Ext.create('Rfx.store.CartLineStore');
			this.cartLineStore.getProxy().setExtraParam('req_flag', this.req_flag);
			this.cartLineStore.getProxy().setExtraParam('status', this.status);
		 this.storeLoad();
	 },
	 setALLCh:function(req_flag,status){
		 this.req_flag = req_flag;
		 this.status = status;
		 this.store.getProxy().setExtraParam('req_flag', this.req_flag);
		 this.store.getProxy().setExtraParam('status', this.status);
		 this.storeLoad();

	 },
	 setDenyChng: function(req_flag,status){
		 console_logs('req_flag', req_flag); 
		 console_logs('assymap.status', status); 
		 this.req_flag = req_flag;
		 this.status = status;
		 this.store.getProxy().setExtraParam('req_flag', this.req_flag);
		 this.store.getProxy().setExtraParam('status', this.status);
		 this.storeLoad();
	 },
	 setBigPcsCode: function(big_pcs_code) {
		 console_logs('big_pcs_code', big_pcs_code);
		 this.big_pcs_code = big_pcs_code;
		 this.refreshButtons();
		 this.store.getProxy().setExtraParam('big_pcs_code', this.big_pcs_code);
		 this.storeLoad();
	 },
	 getProcessType : function() {
		 return this.big_pcs_code==null ? this.mtr_type : this.big_pcs_code;
	 }
 
});