Ext.define('Rfx.view.produceMgmt.HEAVY4_SEW_PaintPlanView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produceplan-view',
    initComponent: function(){

       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	
//    	this.addSearchField (
//				{
//						field_id: 'pcr_div'
//						,store: 'CommonCodeStore'
//						,params:{parentCode: 'PROCURE_TYPE'}
//						,displayField: 'codeName'
//						,valueField: 'systemCode'
//						,innerTpl	: '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>'
//				});	
		
    	this.addSearchField ('item_name');	
		this.addSearchField('wa_name');
		this.addSearchField('pj_code');
      
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1) {
            	buttonToolbar.items.remove(item);        		
        	}

        });      
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==2) {
            	buttonToolbar.items.remove(item);        		
        	}

		});
		
		Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            //console_logs('columnObj', columnObj);
            switch (dataIndex) {
                case 'reserved_varchar2':
                    columnObj["renderer"] = function(value, meta) {
						switch(vCompanyReserved4) {
							case 'SWON01KR':
							try {
								var value1 = value.split('_')[1];
								return value1;
							} catch (error) {
								return value;
							}	
							default:
							return value;
						}
                        // meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }

        });

        //모델 정의
//        this.createStore('Rfx.model.HEAVY4SEWPaintPlan', [{
//            property: 'item_code',
//            direction: 'DESC'
//        }],
//        gMain.pageSize/*pageSize*/
//
//    	// ordery create_date -> p.create로 변경.
//        ,{
//        	creator: 'a.item_code',
//        	unique_id: 'a.unique_id'
//        }
//    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
//    	, ['cartmap']
//        );

        this.createStoreSimple({
    		modelClass: 'Rfx.model.HEAVY4SEWPaintPlan',
    		sorters: [{
    			property: 'product_code',
              direction: 'DESC'
	        }],
	        pageSize: gMain.pageSize,/*pageSize*/
	        byReplacer: {
	        	creator: 'a.item_code',
	        	unique_id: 'a.unique_id'
	        },
	        deleteClass: ['cartmap']
		        
		}/*, {
	    	groupField: 'product_code'
    }*/);
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
			// id:'group1',
			groupHeaderTpl: '<div><b><font color=#003471>{name}</font></b> :: {[values.rows[0].data.buyer_name]} ({[values.rows[0].data.pj_code]}) ({rows.length} 공정)</div>'
			// groupHeaderTpl: '<div><b><font color=#003471>{name}</b></font> :: {[values.rows[0].data.buyer_name]} ({[values.rows[0].data.pj_code]}) ({rows.length} 공정)</div>'
		}); 
        
		var option = {
				// features: [groupingFeature]
		};
		
		this.columns.splice(0, 0, {
			xtype: 'rownumberer',
			useYn: true,
			text:'순번',
			width: 50,
			sortable: true,
			align: 'center',
			// locked: true
		});

		this.store.getProxy().setExtraParam('cart_status', 'PR,P');
		
		//grid 생성.
		// this.createGrid(arr);
        this.createGridCore(arr, option);
        //grid 생성.
//        this.createGrid(arr, function(){});
        
        this.removeAction.setText('반려');
        //Action Button 이름 변경.
        //this.editAction.setText('계획수립');
       // 
        //this.setEditPanelTitle('계획수립');
        
       
      //Lot 구성 Action 생성
        this.addLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: 'Lot 구성',
			 tooltip: '작업 그룹 구성',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatLotOp();
			 }
		});
        //버튼 추가.
        this.procureAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '구매요청',
			 tooltip: '해당제품을 구매요청합니다.',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatProcure();
			 }
		});
        
        buttonToolbar.insert(4, this.procureAction);
        buttonToolbar.insert(5, this.addLotAction);
        buttonToolbar.insert(5, '-');
        
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	this.cartmap_uids = [];
            	this.pur_qtys=[];
            	for(var i=0; i<selections.length; i++){
            		var rec1 = selections[i];
            		var uids = rec1.get("unique_uid");
            		var qtys = rec1.get("pur_qty");
            		this.cartmap_uids.push(uids);
            		this.pur_qtys.push(qtys);
            		console_logs('rec1', rec1);
            	}
            	console_logs('그리드온 uid', this.cartmap_uids);
            	
            	var rec = selections[0];
            	
            	console_logs('rec',rec)

            	
            	
            	if(rec!=null) {
                	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id'); //assymap의 child
                	gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
                	gMain.selPanel.vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); //cartmap_uid
                	
                	var pcr_div = rec.get('request_comment');
                	if(pcr_div=='TWO'){
                		gMain.selPanel.procureAction.enable();
                	}else{
                		gMain.selPanel.procureAction.disable();
                	}
                	
                	if(pcr_div=='PRD'||pcr_div=='NDS'||pcr_div=='TWO'){
                		gMain.selPanel.addLotAction.enable();
                	}else{
                		gMain.selPanel.addLotAction.disable();
                	}
                	
                	
            		gMain.selPanel.vSELECTED_BM_QUAN = rec.get('bm_quan');
	                var processGrid = Ext.getCmp('paintPlanGrid'/*gMain.getGridId()*/);
	                
	                switch(vCompanyReserved4){
            		case "SWON01KR":
            			gMain.selPanel.vSELECTED_UNIQUE_UID = rec.get('temple_uid'); //선택된 CARTMAP_UID
            			console_logs('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@templete_uid',gMain.selPanel.vSELECTED_UNIQUE_UID)
            			processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_UID );//선택된 CARTMAP_UID
            		break;
            			default:
            				gMain.selPanel.vSELECTED_UNIQUE_UID = rec.get('unique_uid'); //선택된 CARTMAP_UID
            			processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_ASSYMAP_UID);//선택된 CARTMAP_UID
                	}
	                //processGrid.getStore().getProxy().setExtraParam('type', 'MTR');
                	processGrid.getStore().getProxy().setExtraParam('reserved_varchar3', 'MTR');
	                processGrid.getStore().load();
            	}
            	
            	
            } else {
            	
            	gMain.selPanel.addLotAction.disable();
            	gMain.selPanel.procureAction.disable();
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
				 var gridPcsStd = Ext.getCmp('paintPlanGrid');
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
			    		  consol_logs('modifiend',gMain.selPanel.vSELECTED_UNIQUE_ID);
			    		  console_logs('modify>>>>>>>>');
			    		    Ext.Ajax.request({
			    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
			    				params:{
			    					modifyIno: str,
			    					assymap_uid:gMain.selPanel.vSELECTED_ASSYMAP_UID
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
	        'paintPlanGrid'//toolbar
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
//									toUid: gMain.selPanel.vSELECTED_UNIQUE_UID
//								},
//								
//								success : function(result, request) { 
//							          //gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
//							          var processGrid = Ext.getCmp('paintPlanGrid'/*gMain.getGridId()*/);
//							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_UID);//선택된 CARTMAP_UID
//							          processGrid.getStore().getProxy().setExtraParam('type', 'MTR');
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
        this.grid.getStore().getProxy().setExtraParam('pcr_div', 'PRD');
        gMain.setCenterLoading(false);
        this.storeLoad = function() {
            this.store.load(function(records) {

              });	
        };
        this.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'MAT');
        this.storeLoad();
    },

    selectPcsRecord: null,
    items : [],
    cartmap_uids : [],
    checkname: false,
    
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
	                labelWidth: 60,
	                margins: 10,
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
	                                					//alert('사용가능합니다.');
	                                				}else {
	                                					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
	                                					//alert('코드를 확인하세요.');
	                                				}
	                                				gMain.selPanel.checkname = true;
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
			
			gMain.selPanel.textName = 'Lot구성';
				prwin = gMain.selPanel.prwinopen(form);
		
    },
    treatProcure: function(){
		var selections = gm.me().grid.getSelectionModel().getSelection();
		var req_dates = [];
		var pur_qtys = [];
		for(var i=0; i<selections.length; i++) {
			var rec = selections[i]
			var req_date = rec.get('req_date');
			var pr_qty = rec.get('pr_quan');

			if(req_date == null || req_date == undefined || req_date == '') {
				Ext.MessageBox.alert('경고', '요청납기일이 비어있는 항목이 있습니다.');
				return;
			} else {
				req_dates.push(req_date);
			}

			if(pr_qty == null || pr_qty == undefined || pr_qty == '') {
				Ext.MessageBox.alert('경고', '구매요청수량이 비어있는 항목이 있습니다.');
				return;
			} else {
				pur_qtys.push(pr_qty);
			}
		}

    	var cartmaparr = gMain.selPanel.cartmap_uids;
		var purqtyarr = gMain.selPanel.pur_qtys;
    	
	    Ext.Ajax.request({
            url : CONTEXT_PATH + '/index/process.do?method=addPurReqSEW',
            params:{
						cartmap_uids: cartmaparr,
						pur_qtys: pur_qtys,
						req_dates: req_dates,
						identification_code: 'MT'
              				},
               			success: function(val, action){
               				gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PNT');
               				gMain.selPanel.store.load(function(){});
               			},
               			failure: function(val, action){
               				Ext.MessageBox.alert('경고', '구매요청 실패');
               			}
   		});//endofajax

    
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: gMain.selPanel.textName,
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
                    	var cartmaparr = gMain.selPanel.cartmap_uids;
                    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                    	switch(vCompanyReserved4){
                    		case 'SWON01KR' : 
                    			var reserved_varchar3='MAT'
                    			break;
	                    	default : 
	                    		var reserved_varchar3='PNT'
    					}
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3: reserved_varchar3
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PNT');
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
  					from_uid: 200,
  					to_uid:gMain.selPanel.vSELECTED_UNIQUE_UID
  				},
  				success : function(result, request) {
//  					gridPcsStd.store.load(function() {
//  						//alert('come');
//  	       				//var idxGrid = storePcsStd.getTotalCount() -1;
//  	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
//  						
//  					});
					var processGrid = Ext.getCmp('paintPlanGrid'/*gMain.getGridId()*/);
	                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_UID);//선택된 CARTMAP_UID
	                processGrid.getStore().load();
  				}
  		    });
  	  
    },
    savePcsstdHandler : function() {
		 var gridPcsStd = Ext.getCmp('paintPlanGrid');
		 //console_logs('gridPcsStd', gridPcsStd);
		 console_logs('gridPcsStd', gridPcsStd);
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gMain.selPanel.getInputTarget('reserved_number1');
	    	
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
	    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_UID
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
	 textName : null
 
});