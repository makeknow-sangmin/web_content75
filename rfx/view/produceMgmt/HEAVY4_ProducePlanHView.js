Ext.define('Rfx.view.produceMgmt.HEAVY4_ProducePlanHView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'productplan-h-view',
    initComponent: function(){

       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	
		/*this.addSearchField ('item_name');	
		this.addSearchField('wa_name');*/
		
		
		switch(vCompanyReserved4){
		case "SWON01KR":
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			break;
		case "PNLC01KR":
			break;
		case "DDNG01KR":
			this.addSearchField('item_code');
			this.addSearchField('pj_name');
			this.addSearchField('area_code');
			/*this.addSearchField('h_reserved44');	
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');*/
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

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); 
        /*(buttonToolbar.items).each(function(item,index,length){
        	if(index==1) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); */
        // remove the items
        /*(buttonToolbar.items).each(function(item,index,length){
        	if(index==2) {
            	buttonToolbar.items.remove(item);        		
        	}

        });*/
        
        switch(vCompanyReserved4){
        case "DDNG01KR":
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4ProducePlan',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
    	        	property: 'wa_name, assymap.unique_id',
    	            direction: 'DESC'
    	        }]
    	        
    	    }, {
    	    	groupField: 'wa_name'
        });
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
        
        
		for(var i=0; i< this.columns.length; i++) {
		        	
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
		        		
		        		default:
		        		/*o['summaryType'] = 'count';
		          		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		          			console_logs('value', value);
		          			console_logs('summaryData', summaryData);
		          			console_logs('dataIndex', dataIndex);
		                    return ((value === 0 || value > 1) ? '(' + value + ' 개)' : '(1 개)');
		                };*/
		        	}
		        	
		        }
   
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
       
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
        default:
        	 this.createGrid(arr, function(){});
        break;
        }
       
        
        //this.removeAction.setText('반려');
        //Action Button 이름 변경.
        //this.editAction.setText('계획수립');
       // 
        //this.setEditPanelTitle('계획수립');
        
       
      //Lot 구성 Action 생성
        this.addLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '제작 Lot 구성',
			 tooltip: '제작 Lot 구성',
			 disabled: true,
			 handler: function() {
				
				 switch(vCompanyReserved4){
				 case "DDNG01KR": 
					 //현대 대공정코드
					 gMain.selPanel.reserved_varchar3 = 'HPRD';
					 Ext.Ajax.request({
						 url: CONTEXT_PATH + '/index/process.do?method=bringlastlotname',
						 params:{
						 		},
	         			success : function(response, request) {
	         				var rec = Ext.JSON.decode(response.responseText);
	         				
	         				gMain.selPanel.lotname = rec['datas'];
	         				
	         				gMain.selPanel.treatLotOp();
	         			},
	         			failure: function(val, action){
	          				 alert('ajax실패');
	            			}
					 });
				 break;
				 default:
					gMain.selPanel.reserved_varchar3 = 'PRD';
					 gMain.selPanel.treatLotOp();
				break;
				 }
				 
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
        
        //버튼 추가.
        switch(vCompanyReserved4){
//        case 'DDNG01KR':
//        	buttonToolbar.insert(2, this.cancleLotAction);
//        break;
        case 'SHNH01KR':
        	buttonToolbar.insert(2, this.addPaintLotAction);
        break;
        default:
        	
        }
       /* if(vCompanyReserved4 =='DDNG01KR'){
        	buttonToolbar.insert(2, this.cancleLotAction);
        }*/
        buttonToolbar.insert(2, this.addLotAction);
        buttonToolbar.insert(2, '-'); 
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
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
            	
            	console_logs('setGridOnCallback', gMain.selPanel.vSELECTED_UNIQUE_UID);
            	
            	if(rec!=null){
            		console_logs('pcsstd 불러오기',rec);
	                var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
	                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_ASSYMAP_UID);//선택된 ASSYMAP_UID
	                processGrid.getStore().load();
            	}
            	gMain.selPanel.addLotAction.enable();
            	gMain.selPanel.cancleLotAction.enable();
            	gMain.selPanel.addLotAction.enable();
            	gMain.selPanel.addPaintLotAction.enable();
            	
          	
            } else {
            	
            	gMain.selPanel.addLotAction.disable();
            	gMain.selPanel.cancleLotAction.disable();
            	gMain.selPanel.addPaintLotAction.disable();
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
	            	gMain.selPanel.selectPcsRecord = rec;
	            } else {
	            	
	            }
	        },
	        'producePlanGrid'//toolbar
		);

        this.callParent(arguments);
        
//  		this.pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
//        this.pcsTemplateStore.load( function(records) {
//			console_logs('pcsTemplateStore', records);
//			
//			var mainmenu = Ext.getCmp( 'producePlanview' + '-mainmenu' );
//			
//			for(var i=0; i<records.length; i++ ) {	
//				var o = records[i];
//				var o1 = {
//						text: o.get('systemCode') + ' - ' + o.get('codeName'),
//						dataIndex: o.get('unique_id'),
//						handler: function(o) {
//							var selectedTemplate = this['dataIndex'];
//							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
//							
//							oTemplate.setText(this['text']);
//							oTemplate['selectedTemplate'] = this['dataIndex'];
//							
//							console_logs('menu this', selectedTemplate);
//							
//						    Ext.Ajax.request({
//								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
//								params:{
//									fromUid: selectedTemplate ,
//									toUid: vCUR_USER_UID*(-100)
//								},
//								
//								success : function(result, request) { 
//							          gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
//							          var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
//							          processGrid.getStore().getProxy().setExtraParam('srcahd_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
//							          processGrid.getStore().load();
//									
//								},//endofsuccess
//								failure: extjsUtil.failureMessage
//							});//endofajax
//							
//						}
//				}
//				mainmenu.add(o1);
//
//			}
//			
//        });
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.storeLoad = function() {
            this.store.load(function(records) {
            });
        };
        
       //this.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
		if(vCompanyReserved4=='DDNG01KR'){
			this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000259');
		}
        this.storeLoad();
    },

    selectPcsRecord: null,
    items : [],
    cartmap_uids : [],
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
	                                   id : 'po_no',
	                                   name      : 'po_no',
	                                   fieldLabel: 'LOT 명',
	                                   margin: '0 5 0 0',
	                                   width: 300,
	                                   allowBlank: false,
	                                   value : gMain.selPanel.lotname,
	                                   maxlength: '1',
	                                   emptyText: '영문대문자와 숫자만 입력',
	                                   validator: function(v) {
	                                       if (/[^A-Z0-9_-]/g.test(v)) {
	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
	                                       }
	                                	  /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
	                                		   console_logs('입력 제한 >>>>', v);
	                                		   v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
	                                	   }*/
	                                       this.setValue(v);
	                                       return true;
	                                   }
	                               },
	                               {
	                            	   id: 'dupCheckButton',
	                                   xtype:'button',
	                                   style: 'margin-left: 3px;',
	                                   width : 50,
	                                   text: '중복'+CMD_CONFIRM,
	                                   //style : "width : 50px;",
	                                   handler : function(){
	                                	   
	                                	   var po_no = Ext.getCmp('po_no').getValue();
	                                      	
	                                       //중복 코드 체크
	                                       	Ext.Ajax.request({
	                                			url: CONTEXT_PATH + '/index/process.do?method=checkName',				
	                                			params:{
	                                				po_no : po_no
	                                			},
	                                			
	                                			success : function(result, request) {
	                                				var resultText = result.responseText;
	                                				if(resultText=='0') {
	                                					Ext.MessageBox.alert('정상', '사용가능합니다.');
	                                					gMain.selPanel.checkname = true;
	                                					//alert('사용가능합니다.');
	                                				}else {
	                                					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
	                                					//alert('코드를 확인하세요.');
	                                				}
	                                				
	                                				console_log('resultText', gMain.selPanel.checkname);
	                        
	                                			},//Ajax success
	                                			failure: extjsUtil.failureMessage
	                                		}); 
	                                	   
	                                	   
	                   						
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
			
			
				prwin = gMain.selPanel.prwinopen(form);
		
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
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gMain.selPanel.checkname);
        		if(gMain.selPanel.checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	var cartmaparr =[];
                    	var po_quan = 0;
                    	var reserved_double4 = 0;
                    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
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
                    	//var cartmaparr = gMain.selPanel.cartmap_uids;
                    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                    	
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3 : gMain.selPanel.reserved_varchar3,
                                				po_quan: po_quan,
                                				reserved_double4 : reserved_double4
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3',  gMain.selPanel.reserved_varchar3);
                                				gMain.selPanel.store.load(function(){});
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
				to_uid:gMain.selPanel.vSELECTED_ASSYMAP_UID
			},
			success : function(result, request) {   
//				gridPcsStd.store.load(function() {
//					//alert('come');
//       				//var idxGrid = storePcsStd.getTotalCount() -1;
//       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
//					
//				});
				var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_ASSYMAP_UID);//선택된 CARTMAP_UID
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
			
		console_logs('assyuid', gMain.selPanel.vSELECTED_ASSYMAP_UID );
		console_logs('srcuid', gMain.selPanel.vSELECTED_UNIQUE_ID );
		console_logs('cartuid', gMain.selPanel.vSELECTED_UNIQUE_UID);
		 Ext.Ajax.request({
			 url: CONTEXT_PATH + '/index/process.do?method=cancleLot',
			 params:{
					assymapuid:gMain.selPanel.vSELECTED_ASSYMAP_UID,
					srcahduid : gMain.selPanel.vSELECTED_UNIQUE_ID,
					cartmapuid : gMain.selPanel.vSELECTED_UNIQUE_UID
				},
			 success : function(result, request) {
				 gMain.selPanel.store.load(function(){});
 			},
 			failure: function(val, action){
 				 alert('Lot 해체 실패');
 			}
		
		 });
	 }
 
});