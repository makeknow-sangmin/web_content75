//수주관리 메뉴
Ext.define('Rfx.view.salesDelivery.HEAVY5_RecvPoView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'receved-mgmt-view',
    /*requires: [
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.form.field.Number',
		'Ext.form.field.Date',
		'Ext.tip.QuickTipManager'
	     	],*/
    
  //File첨부 폼
   // attachform: null,
   // Heavy_attachform: null,
    vFILE_ITEM_CODE: null,
    
    inputBuyer : null,
    initComponent: function(){
    	
    	//order b 에서 자동 테이블명 붙이기 끄기. 
    	this.orderybyAutoTable = false;
    	
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
		
		switch(vCompanyReserved4){
		case "DDNG01KR":
		case "SHNH01KR":
			break;
		default :
			this.addSearchField (
				{
					type: 'combo',
					field_id: 'status'
					,store: "RecevedStateStore"
					,displayField: 'codeName'
					,valueField: 'systemCode'
					,emptyText: '진행상태'
					,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	
				
				this.addSearchField (
				{
					type: 'combo'
					,width:175
					,field_id: 'wa_code'
					,store: "BuyerStore"
					,displayField: 'wa_name'
					,valueField: 'wa_code'
					,emptyText: '고객사'
					,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
				});
		}
		
		switch(vCompanyReserved4){

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
    			gUtil.disable(this.registAction);
    			
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

    		console_logs('this.crudMode', this.crudMode);
    		this.setActiveCrudPanel(this.crudMode);
    	};


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		console_logs('searchToolbar', searchToolbar);
		
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        		REMOVE_BUTTONS : [
        		        	        /*'REGIST',*/'COPY'
        			]		
        });

 
        switch(vCompanyReserved4){

        default:
        	 this.createStore('Rfx.model.HEAVY4RecvPoViewModel', [{
 	            property: 'specification',
 	            direction: 'asc'
 	        }],
 	        //gMain.pageSize
 	        [100]  //pageSize
 	        , this.sortBy
         	//삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
         	, ['assymap']
 	        );
        	break;
        }
       
              
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            //console_logs('tabpanel newTab', newTab);
            //console_logs('tabpanel newTab newTab.title', newTab.title);

            switch(newTab.title) {
            case '구매요청':
                gMain.selPanel.refreshBladeInfoAll();
                break;
            case '공정설계':
           	gMain.selPanel.refreshProcess();
            	break;
            }
            
            
        };
        
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        
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
        buttonToolbar.insert(4, this.requestAction);
        buttonToolbar.insert(4, '-');
        
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
        buttonToolbar.insert(4, this.checkCycleAction);
        buttonToolbar.insert(4, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	this.copyCallback();
        	
        	var processGrid = Ext.getCmp('recvPoPcsGrid');
        	var mainmenu = Ext.getCmp( 'heavy5_RecvPoView' + '-mainmenu' );
        	


            if (selections.length) {
            	var rec = selections[0];
                //gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid'); //assymap의 child
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); //assymap의 child
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
    			var status = rec.get('status');
    			
    			gMain.selPanel.prchHistory(rec.get('ac_uid'));
    			//console_logs('status', status);
    			if(status=='BM') {
    				gUtil.enable(gMain.selPanel.removeAction);
    				gUtil.enable(gMain.selPanel.editAction);    
    				gUtil.enable(gMain.selPanel.requestAction);
    			} else {
    				gUtil.disable(gMain.selPanel.removeAction);
    				gUtil.disable(gMain.selPanel.editAction);   
    				gUtil.disable(gMain.selPanel.requestAction);
    			}
                
    			//mainmenu.disable();
                
                
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
            	gMain.selPanel.requestAction.disable();
            	mainmenu.enable();
            }
        	processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
        	processGrid.getStore().load();
        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
		this.preCreateCallback = function() {
			console_logs('this.crudMode;', this.crudMode);

	    	if(this.crudMode=='EDIT') { //EDIT
	    		console_logs('preCreateCallback', 'IN EDIT');
	    		return true;
	    	} else {//CREATE,COPY
	    		console_logs('preCreateCallback', 'CREATE,COPY');
	    		
	    		var target_pj_code = this.getInputTarget('pj_code');
	        	var pj_code = target_pj_code.getValue();
	        	
	        	//var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
	        	//console_log=('pj_code', gMain.selPanel.vSELECTED_PJ_CODE);
	        	console_log('pj_code', target_pj_code.getValue());
	        	
	        	var crudMode = this.crudMode;
	        	Ext.Ajax.request({
	    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
	    			params:{  				pj_code : pj_code  			},
	    			success : function(result, request) {	

	    				//console_logs('-------------------->success', 'success goto doCreate()');
	    				if(result.responseText+''=='0'){
	    					
	                		if(crudMode=='COPY'){// 공정복사
	                			Ext.MessageBox.show({
	        			            title:'확인',
	        			            msg: '복사등록을 위한 공정복사를 진행하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
	        			            buttons: Ext.MessageBox.YESNO,
	        			            fn:  function(result) {
	        	            	        if(result=='yes') {
	        	            	        	Ext.Msg.alert('안내', '복사등록을 위한 공정복사를 진행합니다.',  function() {
	        									Ext.Ajax.request({
	        										url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
	        										params:{
	        											fromUid: gMain.selPanel.vSELECTED_UNIQUE_ID ,
	        											toUid: vCUR_USER_UID*(-100)
	        										},
	        										
	        										success : function(result, request) { 
	        											//console_logs('-------------------->gMain.selPanel.doCreateCore()', result);
	        											gm.me().doCreateCore();
	        											
	        										},// endofsuccess
	        										failure: function(a,b,c,d){console_logs('-----------------a', a), console_log('b', b), console_log('c', c),console_log('d', d)}
	        									});// endofajax
	        								});
	        	            	        }
	        			            },
	        			            //animateTarget: 'mb4',
	        			            icon: Ext.MessageBox.QUESTION
	        			        });
								
	                		} else {
	                			//console_logs('-------------------->else ', '신규등록');
	                			gm.me().doCreateCore();
	                		}
	    				} else {//end of if
	    					failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {})
	    				}
				
	    			},// Ajax success
	    			//failure: function(a,b,c,d){console_logs('a', a), console_log('b', b), console_log('c', c),console_log('d', d)}
	    			 
	    			//failure:Ext.Msg.alert('안내', '알수없는 오류입니다. </br>관리자에게 문의하세요.', function() {})
	    		}); 
	        	console_logs('preCreateCallback', 'return false');
	           	return false;    		
	    	}

		}
			        
        
//		var addPcsStep = Ext.create('Ext.Action', {
//			 iconCls: 'af-plus-circle',
//			 text: '추가',
//			 tooltip: '공정 추가하기',
//			 //toggleGroup: 'toolbarcmd',
//			 handler: function() {
//			 }
//			});
		
		var calcNumber = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '수량계산',
			 tooltip: '수량 계산하기',
			 handler: function() {
				 var gridPcsTpl = Ext.getCmp('recvPoPcsGrid');
				 //console_logs('gridPcsTpl', gridPcsTpl);
				 //console_logs('gMain.selPanel.vSELECTED_UNIQUE_ID', gMain.selPanel.vSELECTED_UNIQUE_ID);
				 
			    	var modifiend =[];
			    	//var rec = gridPcsTpl.getSelectionModel().getSelection()[0];
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
			    	  for (var i = 0; i <gridPcsTpl.store.data.items.length; i++)
			    	  {
			    	        var record = gridPcsTpl.store.data.items [i];
	    	           		var pcs_no =  record.get('pcs_no');
	    	           		var pcs_code = record.get('pcs_code');
	    	           		var serial_no = Number(pcs_no) / 10;
	    	           		var plan_qty = record.get('plan_qty');
	    	           		
			    	         	gridPcsTpl.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
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
			    					gridPcsTpl.store.load(function() {
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
		
        //공정설계 gridPcsTpl Tab 추가.
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
			 	   		        	text:'생산수량: 50000'
			 	   		        },
				 	   		    {
				    				id: this.link + '-'+ 'grid-top-paperQty',
				 	   		        xtype:'tbtext',
				 	   		        text:'원지수량: 50000'
				 	   		    },
			      				{
			    					  id: this.link + '-'+ 'grid-top-bladeinfo',
			 	   		        	  xtype:'tbtext',
			 	   		        	  text:'칼 000 * 000 1EA'
			 	   		        	 // style:'text-align:right;',
			 	   		        	 // width: 70,
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
			                    {
			                    	id: 'splitbuttonTemplate' + this.link,
			                    	iconCls: 'fa-bitbucket_14_0_5395c4_none',
		    						xtype: 'splitbutton',
		    					   	text: '템플리트',
		    					   	selectedMennu: -1,
		    					   	tooltip: '표준공정 템플리트',
		    					   	handler: function() {}, // handle a click on the button itself
		    					   	menu: new Ext.menu.Menu({
		    					   		id: 'recvPoview' + '-mainmenu'
		    					   	})
			    				 }
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
	        'recvPoPcsGrid'//toolbar
		);

        this.callParent(arguments);
  		this.pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
        this.pcsTemplateStore.load( function(records) {
			console_logs('pcsTemplateStore', records);
			
			var mainmenu = Ext.getCmp( 'heavy5_RecvPoView' + '-mainmenu' );
			
			for(var i=0; i<records.length; i++ ) {	
				var o = records[i];
				var o1 = {
						text: o.get('systemCode') + ' - ' + o.get('codeName'),
						dataIndex: o.get('unique_id'),
						handler: function(o) {
							var selectedTemplate = this['dataIndex'];
							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
							
							oTemplate.setText(this['text']);
							oTemplate['selectedTemplate'] = this['dataIndex'];
							
							console_logs('menu this', selectedTemplate);
							
						    Ext.Ajax.request({
								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
								params:{
									fromUid: selectedTemplate ,
									toUid: gMain.selPanel.vSELECTED_UNIQUE_ID
								},
								
								success : function(result, request) { 
							          //gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
							          var processGrid = Ext.getCmp('recvPoPcsGrid'/*gMain.getGridId()*/);
							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
							          processGrid.getStore().load();
									
								},//endofsuccess
								failure: extjsUtil.failureMessage
							});//endofajax
							
						}
				}
				mainmenu.add(o1);

			}
			
        });
        
        this.store.on('load',function (store, records, successful, eOpts ){
        	gMain.selPanel.StoreLoadRecordSet(records);
       });

        //디폴트 로딩
        gMain.setCenterLoading(false);
        
        this.storeLoad = function() {
            this.store.load(function(records) {

            	gMain.selPanel.StoreLoadRecordSet(records);
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
                var processGrid = Ext.getCmp('recvPoPcsGrid'/*gMain.getGridId()*/);
                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
                processGrid.getStore().load();
              });	
        };
        
        this.storeLoad();
        

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
		
    	//칼날사이즈
    	var target_reserved_varcharb = this.getInputTarget('reserved_varcharb');
    	var reserved_varcharb = target_reserved_varcharb.getValue();
    	console_logs('reserved_varcharb', reserved_varcharb);
    	//원지
    	reserved_varcharb = reserved_varcharb.replace('X','*');
    	var reserved_varcharb_arr = reserved_varcharb.split('*');
    	console_log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',reserved_varcharb);
    	var target_comment1 = this.getInputTarget('comment', '1');
    	var comment1 = target_comment1.getValue();
    	var target_remark1 = this.getInputTarget('remark', '1');
    	var remark1 = target_remark1.getValue();
    	target_remark1.setValue(reserved_varcharb_arr[1]*1+15);
    	target_comment1.setValue(reserved_varcharb_arr[0]*1+20);
    	//원단
    	var target_comment2 = this.getInputTarget('comment', '2');
    	var comment2 = target_comment2.getValue();
    	var target_remark2 = this.getInputTarget('remark', '2');
    	var remark2 = target_remark2.getValue();
    	target_comment2.setValue(reserved_varcharb_arr[1]*1+15);
    	target_remark2.setValue(reserved_varcharb_arr[0]*1+10);
    },
    
    refreshReqBom: function() {

    	//판걸이수량
    	var target_reserved_double3 = this.getInputTarget('reserved_double3');
    	var reserved_double3 = target_reserved_double3.getValue();
    	//수주수량
    	var target_bm_quan = this.getInputTarget('bm_quan');
    	var bm_quan = target_bm_quan.getValue();
    	//원지구매수량
    	var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(bm_quan/reserved_double3);
		//원단구매수량
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(bm_quan/reserved_double3);
    	
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
		
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(cur);
		
		var target_prch_his = this.getInputTarget('prch_history');
		target_prch_his.setValue();
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
    //판걸이 수량이 변경된 handler
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

    },
    
    preCreateCallback: function() {
    	
    	console_logs('crudMode', this.crudMode);
    	if(this.crudMode!='CREATE') {
    		return true;
    	} else {
        	console_log=('pj_code',gMain.selPanel.vSELECTED_PJ_CODE);
        	var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
           	Ext.Ajax.request({
    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
    			params:{
    				pj_code : pj_code
    			},
    			
    			success : function(result, request) {
                   	projectmold.save({
                		success : function(result, request) {		                			
                			gm.me().doCreateCore();

                		}//success
                	 });//save    					
    				console_log('requested ajax...');
    				this.preCreateCallback = function() {
    					gm.me().doCreateCore();
    					return true;
    				};
    			},//Ajax success
    			//failure: extjsUtil.failureMessage
    			 failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {
     				this.preCreateCallback = function() {
     					gm.me().doCreateCore();
    					return true;
    				};
    			 })
    		}); 
           	
           	return false;    		
    	}
    	

    },
    replaceZero: function(o) {
    	if(o.substr(0,1)=='0'){
    		
    		return o.replace('0','');
    	}else{
    		return o;
    	}
    	
    },
    replaceNumberType: function(o) {
    	console_logs('replaceNumberType',o.length);
    	switch(o.length){
    	
    		case 4 :
    			return o = o.substr(0,1)+','+o.substr(1,4);
    			break;
    		case 5 :
    			return o = o.substr(0,2)+','+o.substr(2,5);
    			break;
    		case 6 :
    			return o = o.substr(0,3)+','+o.substr(3,6);
    			break;
    		case 7 :
    			return o = o.substr(0,1)+','+o.substr(1,4)+','+o.substr(4,7);
    			break;
    		default :
    			return o;
    		
    	}

    	
    },
    //구매내역
    prchHistory: function(ac_uid) {
    	console_logs('ac_uid',ac_uid);
    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/schdule.do?method=getPrchHistory',
			params:{
				ac_uid: ac_uid
			},
			
			success : function(result, request) { 
		
				var result = result.responseText;
				console_logs('result:', result);
				 var jsonData = Ext.JSON.decode(result);
				 
				 var datas = jsonData['datas'];
				 var mtrlInfo = '';
				for(var i=0; i<datas.length; i++) {
					 switch(datas[i].standard_flag){
					 	case 'R' :
					 		if(datas[i].item_name!=''){
					 		mtrlInfo = mtrlInfo+'원지: '+gMain.selPanel.replaceZero(datas[i].item_name)+ 
					 		gMain.selPanel.replaceNumberType(gMain.selPanel.replaceZero(datas[i].description))+' '+ 
					 		gMain.selPanel.replaceNumberType(gMain.selPanel.replaceZero(datas[i].comment))+'X'+ 
					 		gMain.selPanel.replaceNumberType(gMain.selPanel.replaceZero(datas[i].remark))+
					 		' 수량: '+gMain.selPanel.replaceNumberType(datas[i].bm_quan.replace('.000',''))+'\n\n';
					 		}
					 	break;
					 	
					 	case 'O' :
					 		if(datas[i].item_name!=''){
					 		mtrlInfo = mtrlInfo+'원단: '+datas[i].item_name+' '+
					 		gMain.selPanel.replaceNumberType(datas[i].remark)+'X'+
					 		gMain.selPanel.replaceNumberType(datas[i].comment)+
					 		' 수량: '+gMain.selPanel.replaceNumberType(datas[i].bm_quan.replace('.000',''))+'\n\n';
					 		}
					 	break;
					 	
					 	case 'K' :
					 		if(datas[i].item_name!=''){
					 			
					 		mtrlInfo = mtrlInfo+'부자재: '+datas[i].item_name+' 규격: '+datas[i].specification+' 수량: '+gMain.selPanel.replaceNumberType(datas[i].bm_quan.replace('.000',''))+'\n\n';
					 		}
					 	break;
					 	}
					 	
				 }
				gMain.selPanel.prchHistoryIn(mtrlInfo);
				console_logs('prchHistory>>>>>>>>>>',mtrlInfo);
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax	

    },
    prchHistoryIn: function(mtrlInfo) {
    	var target_prch_history = this.getInputTarget('prch_history');
	 	target_prch_history.setValue(mtrlInfo);
    },
    StoreLoadRecordSet: function(records){
       	for(var i=0; records!=null && i<records.length; i++) {
    		var rec = records[i];

    		//console_logs('rec', rec);
    	}
    },
    savePcsstdHandler: function() {
		 var gridPcsTpl = Ext.getCmp('recvPoPcsGrid');
		 //console_logs('gridPcsTpl', gridPcsTpl);
		 
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan', '1');
	    	
	    	  var prevQty = Number(target_bm_quan.getValue());
	    	  //var tomCheck = false;
	    	  for (var i = 0; i <gridPcsTpl.store.data.items.length; i++)
	    	  {
	    	        var record = gridPcsTpl.store.data.items [i];
	           		var pcs_no =  record.get('pcs_no');
	           		var pcs_code = record.get('pcs_code');
	           		var serial_no = Number(pcs_no) / 10;
	           		var plan_qty = record.get('plan_qty');
	           		
	    	        if (record.dirty) {
	    	         	gridPcsTpl.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
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
	    					gridPcsTpl.store.load(function() {
	    						//alert('come');
	    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
	    						
	    					});
	    				}
	    		    });
	    	  }
	 }
    
});

