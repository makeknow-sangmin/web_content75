Ext.define('Rfx.view.produceMgmt.HEAVY4_PaintPlanDetailView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'paintplan-detail-view',
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
//
//		this.addSearchField ('buyer_pj_code');	
//		this.addSearchField('paint_spec');
//		this.addSearchField('lot_no');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

//        this.createStoreSimple({
//    		modelClass: 'Rfx.model.HEAVY4PaintPlanDetail',
//	        pageSize: gMain.pageSize,/*pageSize*/
//	        sorters: [{
//	        	property: 'lot_no',
//	        	direction: 'asc'
//	        }],
//	        byReplacer: {
//
//	        },
//	        deleteClass: ['rtgast']
//		        
//	    }, {
//	    	groupField: 'lot_no'
//    });
        
        this.createStore('Rfx.model.HEAVY4PaintPlanDetail', [{
            property: 'h_reserved105',
            direction: 'DESC'
        }],
        gMain.pageSize/*pageSize*/

    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'a.item_code',
        	unique_id: 'a.unique_id'
        }
    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['rtgast']
        );
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
//        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
//	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
//	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
//		}); 
        
//		var option = {
//				features: [groupingFeature]
//		};
        
        //grid 생성.
//		this.createGridCore(arr, option);
        this.createGrid(arr, function(){});
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==0||index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
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
        
//        buttonToolbar.insert(2, this.addLotAction);
//        buttonToolbar.insert(2, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	this.rtgast_uids = [];
            	for(var i=0; i<selections.length; i++){
            		var rec1 = selections[i];
            		var uids = rec1.get("unique_uid");
            		this.rtgast_uids.push(uids);
            		console_logs('rec1', rec1);
            	}
            	console_logs('그리드온 uid', this.rtgast_uids);
            	
            	var rec = selections[0];
            	
            	console_logs('rec',rec)
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //assymap의 child
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
            	
            	gMain.selPanel.addLotAction.enable();
          	
            } else {
            	
            	gMain.selPanel.addLotAction.disable();
            }
        	
        });

        
//        this.createCrudTab();
//
//        Ext.apply(this, {
//            layout: 'border',
//            items: [this.grid,  this.crudTab]
//        });
    	this.pntListSrch = Ext.create('Ext.Action', {
    		itemId: 'pntListSrch',
    	    iconCls: 'af-search',
    	    text: CMD_SEARCH/*'검색'*/,
    	    disabled: false,
    	    handler: function(widget, event) {
//    	    	var s_date = Ext.getCmp('s_date_PPO1TURN').getValue();
//    	    	var e_date = Ext.getCmp('e_date_PPO1TURN').getValue();
//    	    	var lot_no = Ext.getCmp('lot_no_PPO1TURN').getValue();
//    	    	var wa_code = Ext.getCmp('wa_code_PPO1TURN').getValue();
//    	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('sdate', s_date);
//    	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('edate', e_date);
//    	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('req_date', s_date+":"+e_date);
//    	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('name', lot_no);
//    	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('wa_code', wa_code);
    	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('po_type', 'PND');
    	    	gMain.selPanel.PaintPlanDetailStore.load();
    	    }
    	});
    	this.createCrudTab();
        
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter(),  this.crudTab]
        });

        
        
        this.callParent(arguments);
//        디폴트 로딩
//      gMain.setCenterLoading(false);
//      this.grid.getStore().getProxy().setExtraParam('po_type', 'PND');
//      this.storeLoad();
  
    },
	
    rtgast_uid_arr : [],
    setRelationship: function (relationship) {},
    createCenter: function() {/*도장계획[상세] 그리드*/
    	this.grid.setTitle('구분자 상세목록');
    	this.center =  Ext.widget('tabpanel', {
    		layout:'border',
    		border: true,
    		region: 'center',
    		width: '75%',
    		items: [this.grid]
    	});
			
		return this.center;
    },
    createWest: function() {
    	this.PaintPlanDetailStore = Ext.create('Mplm.store.PaintPlanDetailStore');
		this.PaintPlanDetailGrid =
	    	Ext.create('Rfx.view.grid.PaintPlanDetailGridHeavy', {
	    	 id: gu.id('paintPlanDetail'),
//			 id: 'PPO1_TURN_PREQ',
	    	 title: '구분자목록',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
	         store: this.PaintPlanDetailStore,
	         //layout          :'fit',
	         //forceFit: true,
	         multiSelect: true,
	         selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.PaintPlanDetailStore,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	//		                        //--- Get Proxy ------//
	//		                        var myProxy = this.store.getProxy();                        
	//		                 //--- Define Your Parameter for send to server ----//
	//		                        myProxy.params = {
	//		                            MENU_NAME: '',
	//		                            MENU_DETAIL: ''
	//		                        };
	//		                  //--- Set value to your parameter  ----//
	//		                        myProxy.setExtraParam('MENU_NAME', '222222');
	//		                        myProxy.setExtraParam('MENU_DETAIL', '555555');
	                    }
	                }
		         
		        }),
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						this.pntListSrch, 
						this.addLotAction,
						this.removeAction//, 
					        //this.removeAssyAction, 
					        //'->', 
					        //this.expandAllTreeAction 
					        ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default1',
					items: [{
					    xtype:'label',
					    width:40,
					    text: '납기일',
					    style: 'color:white;'
						 
			    	},{
						  id: gu.id('s_date'),
			              name: 's_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						    	width: 98

			        },{
					    xtype:'label',
					    text: "~",
					    style: 'color:white;'
			        },{
						  id: gu.id('e_date'),
			              name: 'e_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: new Date(),
						    	width: 98

			        } ,{
			    		id: gu.id('lot_no'),
				    	xtype: 'textfield',
				    	fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				        mode: 'local',
				        editable:true,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'LOT번호',
				        enableKeyEvents: true,
				        trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'	,
			            listeners : {
			            	render: function( component ) {
			            		component.getEl().on('keydown', function() {
			            			var s_date = Ext.getCmp('s_date_PPO1TURN').getValue();
			            	    	var e_date = Ext.getCmp('e_date_PPO1TURN').getValue();
			            	    	var lot_no = Ext.getCmp('lot_no_PPO1TURN').getValue();
//			            	    	var wa_code = Ext.getCmp('wa_code_PPO1TURN').getValue();
//			            	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('sdate', s_date);
//			            	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('edate', e_date);
//			            	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('req_date', s_date+":"+e_date);
			            	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('name', '%'+lot_no+'%');
//			            	    	gMain.selPanel.PaintPlanDetailStore.getProxy().setExtraParam('wa_code', wa_code);
			            	    	gMain.selPanel.PaintPlanDetailStore.load();
			            		});
			            	}
			            }
			    	},
//			    	{
//			    		id: 'wa_code_PPO1TURN',
//				    	xtype: 'combo',
//				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//				        mode: 'local',
//				        editable:false,
//				        // allowBlank: false,
//				        width: '25%',
//				        queryMode: 'remote',
//				        emptyText:'발주업체',
//				        displayField:   'wa_name',
//				        valueField:     'wa_code',
//				        store: 	Ext.create('Mplm.store.BuyerStore'),
//				        listConfig:{
//				            	getInnerTpl: function(){
//				            		return '<div data-qtip="{wa_name}">[{wa_code}] <small><font color=blue>{wa_name}</font></small></div>';
//				            	}
//				           },
//					        listeners: {
//						           select: function (combo, record) {
//					                 	
//						           }
//					        }
//			    	
//			    	},
			    	]
				}
	    	] //dockedItems of End
			
		
		});//PaintPlanDetailGrid of End
		this.PaintPlanDetailGrid.getStore().getProxy().setExtraParam('po_type', 'PND');
		this.PaintPlanDetailGrid.store.load();
//		 this.PaintPlanDetailGrid.store.on('load',function (store, records, successful, eOpts ){
//	        	var arr = [];
//	        	var prev_rec = null;
//	        	for(var i=0; i< records.length; i++) {
//	        		var cur = records[i];
//	        		prev_rec = {};
//	        		for (var key in cur['data']) { 
//	    				prev_rec[key] = cur.get(key); 
//	    			}
//	        		var unique_id = cur.get('unique_id');
//	        		prev_rec['unique_id'] =unique_id;
//	        		var state = cur.get('state');
//	        		
//	        		if(state.indexOf('I')>-1){
//	        			state = '대기';
//	        		}else if(state.indexOf('A')>-1){
//	        			state = '접수중';
//	        		}
//	        		else{
//	        			state = '접수완료';
//	        		}
//	        		prev_rec['state'] = state;
//	        		
//	        		var po_no = cur.get('po_no');
//	        		prev_rec['po_no'] =po_no;
//	        		
//	        		var name = cur.get('name');
//	        		prev_rec['name'] =name;
//	        		
//	        		var item_quan = cur.get('item_quan');
//	        		prev_rec['item_quan'] =item_quan;
//	        		
//	        		var creator = cur.get('creator');
//	        		prev_rec['creator'] =creator;
//	        		
//	        		var create_date = cur.get('create_date');
//	        		prev_rec['create_date'] =create_date;
//	        		
//
//		         	
//	        		arr.push(prev_rec);
//	        	} 	
//	        	records = arr;
//	        	console_logs('==== storeLoadCallback arr', arr);
//	        	
//	        	store.removeAll();
//	        	store.add(arr);
//	       });
        this.PaintPlanDetailGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {  
        		gUtil.enable(gMain.selPanel.addLotAction);
        		gUtil.enable(gMain.selPanel.removeAction);
        		try{
        		if(selections!=null){
        			
	        		 var rec = selections[0];
	        		 console_logs('rec>>>>>>>>>>>>>',rec)
	        		 gMain.selPanel.SELECTED_UID = rec.get('unique_id');
	        		 var unique_id = rec.get('unique_id');
	        		 var lot_no = rec.get('lot_no');
	        		 gMain.selPanel.store.getProxy().setExtraParam('po_no', lot_no);
	        		 gMain.selPanel.store.getProxy().setExtraParam('po_type', 'PND');
	        		 gMain.selPanel.store.load();
	        		 
        	}
        		}catch(e){
    				console_logs('e',e);
    			}
    		}
        });
		
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '35%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.PaintPlanDetailGrid /*, myFormPanel*/]
			});
    	
    	return this.west;
    },
    selectPcsRecord: null,
    items : [],
    rtgast_uids : [],
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
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                	  /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
//	                                		   console_logs('입력 제한 >>>>', v);
//	                                		   v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
//	                                	   }*/
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }
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
                    	var rtgastUids = [];
                    	gMain.selPanel.po_quan = 0;
                    	gMain.selPanel.reserved_double4 = 0;
                    	paintPlanDetail = gu.getCmp('paintPlanDetail');
                    	var selections = paintPlanDetail.getSelectionModel().getSelection();
                    	console_logs('섹렉션데이터',selections);
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid = rec.get('unique_id');
                    		rtgastUids.push(uid);
                    		console_logs('pnt_rec>>>>>>>>', rec);
                    		var po_quan_unit = rec.get('item_quan');
                    		gMain.selPanel.po_quan = gMain.selPanel.po_quan + po_quan_unit;
                    		
                    		var tmp_weight = rec.get('reserved_double4');
                    		gMain.selPanel.reserved_double4 = gMain.selPanel.reserved_double4 + tmp_weight;
                    		
                    	}
                    	
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombinePntLotHeavy',
                             params:{
                            	 				rtgastUids: rtgastUids,
                                				reserved_varchar3: 'PNT',
                                				po_quan : gMain.selPanel.po_quan,
                                				reserved_double4 : gMain.selPanel.reserved_double4,
                                				join_type : 'srcahd'
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.pcstype = 'P';
                                				gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PND');
                                				gMain.selPanel.store.load(function(){});
                                				paintPlanDetail = gu.getCmp('paintPlanDetail');
                                				paintPlanDetail.store.load();
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
    }
});
