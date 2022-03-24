Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.HEAVY4_ProduceAdjustPcsView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produceadjustpcs-view',
    initComponent: function(){

      	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField ('pj_code');	
/*		this.addSearchField (
				{
						field_id: 'pj_code'
						,store: "ProjectStore"
	    			    ,displayField:   'pj_name'
	    			    ,valueField:   'unique_id'
	    			    ,value: vCUR_USER_NAME
						,innerTpl	: '<div data-qtip="{unique_id}">{pj_name}</div>'
				});	*/
		this.addSearchField('item_code');
		
		this.addSearchField('buyer_name');

		this.addSearchField (
				{
						field_id: 'status'
						,store: "RecevedStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
		this.addSearchField('pcs_name');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4_ProduceAdjustPcs',
		        pageSize: gMain.pageSize,/*pageSize*/
		        sorters: [{
		        	property: 'pcs_code',
		        	direction: 'asc'
		        }],
		        byReplacer: {
		        },
		        deleteClass: ['pcsstep']
			        
		    }, {
		    	groupField: 'pcs_code'
        });
        
        //완료처리
        this.pcsCompleteAction = Ext.create('Ext.Action', {
   		 iconCls: '',
   		 text: '완료처리',
   		 tooltip: '완료처리 하기',
   		 disabled: true,
   		 handler: function() {
   	    	console_logs('treatPcsInfo---------------',gMain.selPanel.vSELECTED_PCS_CODE);
    		Ext.Ajax.request({
				url: CONTEXT_PATH + '/production/popcontroller.do?method=ProcessInput02Machine',
				params:{
					pcs_code: gMain.selPanel.vSELECTED_PCS_CODE,
					lot_no: gMain.selPanel.vSELECTED_PJ_CODE
				},
				
				success : function(result, request) {   	

					var oStr = result.responseText;
					var arr = Ext.decode(oStr);
					var o = arr.datas[0];
			        var lot_no = '';
                   if(o!=null) {
                   	console_logs('o**************', o);
//                   		lot_no =  o['popLotNo'];// ==> o.getStock_qty_useful(); o.get('stock_qty_useful');
//                   		operator_name = o['operator_name'];
//                   		buyer_name = o['popBuyerName'];
//                   		pj_name = o['popPjName'];
//                   		bm_quan = o['bm_quan'];
//                   		lot_qty = o['lot_qty'];
//                   		wonji = o['wonji'];
//                   		wondan = o['wondan'];
//                   		kal_size = o['kal_size'];
//                   		pstep_status = o['pstep_status'];
//                   		nstep_name = o['nstep_name'];
//                   		description = o['description'];
//                   		unit_code = o['unit_code'];
//                   		unit_qty = o['reserved_double5'];
                   		gMain.selPanel.returnValue(o);
              			gMain.selPanel.treatPcsInfo();
                   }
                   

					
				},//end of success
				failure: extjsUtil.failureMessage
			});//end of ajax

   		 	}
        });
        
        //수량변경
        this.pcsQtyAction = Ext.create('Ext.Action', {
   		 iconCls: '',
   		 text: '수량변경',
   		 tooltip: '수량변경 하기',
   		 disabled: true,
   		 handler: function(widget, event) {
   		    	Ext.MessageBox.show({
   		            title: '수량변경',
   		            msg: '수량변경 하시겠습니까?',
   		            buttons: Ext.MessageBox.YESNO,
   		            fn: function(result) {
            	        if(result=='yes') {
            	        	//gMain.selPanel.planReject();
            	        }
   		            	
   		            },
   		            icon: Ext.MessageBox.QUESTION
   		        });
   		 }
        });
        
        //상태변경
        this.pcsStateAction = Ext.create('Ext.Action', {
			 iconCls: '',
			 text: '상태변경',
			 tooltip: '상태변경 하기',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '해당 공정을 상태변경하시겠습니까?<br>!!!상태변경할 경우 해당공정이 대기상태로 변경됩니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.pcsStateChange();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
//		console_logs('createStore modelClass', 'Rfx.model.ProduceAdjust1');
//		console_logs('createStore this.fields', this.fields);
//		this.modelClass = 'Rfx.model.ProduceAdjust';
//        this.model = Ext.create('Rfx.model.ProduceAdjust', {
//        	fields: this.fields
//        });

 //       this.removeAction.setText('작업취소');
//        buttonToolbar.insert(6, this.pcsCompleteAction);
//        buttonToolbar.insert(6, this.pcsQtyAction);
//        buttonToolbar.insert(6, this.pcsStateAction);
	        // remove the items
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==2||index==5||index==3||index==4) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        
        
		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 공정)</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
        
        //grid 생성.
        this.createGridCore(arr, option);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('setGridOnCallback***********************',rec);
            	gMain.selPanel.vSELECTED_STEP_UID = rec.get('unique_id');
            	gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code'); 
            	gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
            	console_logs('setGridOnCallback---------------',gMain.selPanel.vSELECTED_PJ_CODE);
            	if(rec.get('is_complished')=='W'||rec.get('is_complished')=='I'){
            	gMain.selPanel.pcsCompleteAction.enable();
            	}
            	if(rec.get('is_complished')=='Y'){
                	this.pcsQtyAction.enable();
                	}
            	if(rec.get('is_complished')=='Y'){
                	this.pcsStateAction.enable();
                	}

            	
            } else {
//            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
//            	gMain.selPanel.addWorkOrder.disable();
//            	gMain.selPanel.printPDFAction.disable();
//            	gMain.selPanel.workCancleAction.disable();
//            	gMain.selPanel.rejectAction.disable();
            	this.pcsStateAction.disable();
            	this.pcsQtyAction.disable();
            	this.pcsCompleteAction.disable();
            	
            }
//        	var processGrid = Ext.getCmp('workOrderGrid');
//        	processGrid.getStore().load(function (records){
//        		console_logs('records', records);
        		
//        	});
        })

        this.callParent(arguments);
        
    	this.store.getProxy().setExtraParam('orderBy', "pcs_code");
    	this.store.getProxy().setExtraParam('ascDesc', "ASC");  
        //디폴트 로드
    	gMain.setCenterLoading(false);
        this.store.load(function(records){
        	console_logs('ProduceAdjustView1 records', records);
        });
    },
    //완료처리
    pcsCompleteAction: function() {
    	
    	
//    	var target_reserved_double3 = this.getInputTarget('unique_id');
//    	var assymapUid = target_reserved_double3.getValue()
//    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

    	var cartmapUid = this.vSELECTED_RECORD.get('unique_uid');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=addWorkOrder',
			params:{
				cartmapUid: cartmapUid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax

    },
    //수량변경
    pcsQtyAction: function() {
    	
    	
//    	var target_reserved_double3 = this.getInputTarget('unique_id');
//    	var assymapUid = target_reserved_double3.getValue()
//    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

    	var cartmapUid = this.vSELECTED_RECORD.get('unique_uid');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=addWorkOrder',
			params:{
				cartmapUid: cartmapUid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax

    },
    //상태변경
    pcsStateChange: function() {
    	
    	
//    	var target_reserved_double3 = this.getInputTarget('unique_id');
//    	var assymapUid = target_reserved_double3.getValue()
//    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

    	var pcsstepUid = this.vSELECTED_RECORD.get('unique_id');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/pcsline.do?method=stateChange',
			params:{
				unique_id: pcsstepUid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '완료상태를 생산대기상태로 변경하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax

    },
    returnValue: function(o){
	   		lot_no =  o['popLotNo'];// ==> o.getStock_qty_useful(); o.get('stock_qty_useful');
	   		operator_name = o['operator_name'];
	   		buyer_name = o['popBuyerName'];
	   		pj_name = o['popPjName'];
	   		bm_quan = o['bm_quan'];
	   		lot_qty = o['lot_qty'];
	   		wonji = o['wonji'];
	   		wondan = o['wondan'];
	   		kal_size = o['kal_size'];
	   		pstep_status = o['pstep_status'];
	   		nstep_name = o['nstep_name'];
	   		description = o['description'];
	   		unit_code = o['unit_code'];
	   		unit_qty = o['reserved_double5'];
	   		

    }
    ,
    sumDefectQty : function(){
    		q1 = Ext.getCmp('qty1').getValue();
    		q2 = Ext.getCmp('qty2').getValue();
    		q3 = Ext.getCmp('qty3').getValue();
    		q4 = Ext.getCmp('qty4').getValue();
    		q5 = Ext.getCmp('qty5').getValue();
    		if(q1==undefined || q1==null) {
    			q1=0;
			}
    		if(q2==undefined || q2==null) {
    			q2=0;
			}
    		if(q3==undefined || q3==null) {
    			q3=0;
			}
    		if(q4==undefined || q4==null) {
    			q4=0;
			}
    		if(q5==undefined || q5==null) {
    			q5=0;
			}
    		Ext.getCmp('defect_qty').setValue(q1+q2+q3+q4+q5);
    		
    },
    calWorkQty : function(){
		pqty = Ext.getCmp('process_qty').getValue();
		dqty = Ext.getCmp('defect_qty').getValue();
		if(pqty==undefined || pqty==null) {
			pqty=0;
		}
		if(dqty==undefined || dqty==null) {
			dqty=0;
		}
		Ext.getCmp('work_qty').setValue(pqty-dqty);
		
},
    treatPcsInfo: function() {
    	console_logs('treatPcsInfo', operator_name);
    	var form = null;
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
	            title: '수주 정보',
	            boder: true,
	            collapsible: true,
	            margin: '5',
	            //fieldStyle: 'width:100%;',
	            width: '100%',
	            defaults: {
	            	anchor: '100%',
	                labelWidth: 10,
	                useThousandSeparator: false
	            },
                 items :[{
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
						     fieldLabel: '수주번호',
						     id: 'pcsPjcode',
						     value: lot_no,
						     readOnly: true,
						     width: 220
						  },{
							  xtype:'textfield',
						      fieldLabel: '작업자',
						      id: 'pcsOperator',
				              name: 'pcsOperator',
						      value: operator_name,
						      readOnly: true,
						      width: 220
						  }]
					},{
						items: [{
							xtype:'textfield',
							fieldLabel: '고객사',
							anchor: '100%',
							id: 'pcsWaname',
							value: buyer_name,
							readOnly: true,
							width: 440
						},{
							xtype:'textfield',
							fieldLabel: '품명',
							anchor: '100%',
							id: 'pcsItemname',
							value: pj_name,
							readOnly: true,
							width: 440
						}]
					},{
						items: [{
							xtype:'textfield',
						    fieldLabel: '계획수량',
						    anchor: '100%',
						    id: 'pcsProjectQuan',
						    name: 'pcsProjectQuan',
						    value: bm_quan,
						    readOnly: true,
						    width: 220
						},{
							xtype:'textfield',
						    fieldLabel: 'LOT생산수량',
						    anchor: '100%',
						    id: 'pcsProcessQty',
						    name: 'pcsProcessQty',
						    value: lot_qty,
						    readOnly: true,
						    width: 220
						}]
					}]
                 }]
	        },{
	        	xtype: 'fieldset',
	        	title: '수량 입력',
	        	boder: true,
	        	collapsible: true,
	        	margin: '5',
	        	width: '100%',
	        	defaults: {
	        		anchor: '100%',
	        		labelWidth: 10,
	        		useThousandSeparator: false
	        	},
	        	items :[{
	        		xtype : 'fieldcontainer',
	        		combineErrors: true,
	        		//msgTarget: 'side',
	        		layout: 'hbox',
	        		defaults: {
	        			labelWidth: 70,
	        			//width: 200
	        		},
	        		items: [{
	        			xtype: 'numberfield',
	        			margin : '0 20 10 40',
	        			fieldLabel: '생산수량:',
	        			anchor: '100%',
	        			width: 220,
	        			id : 'process_qty',
	        			name : 'process_qty',
	        				listeners: {
		                          change: function(field, value) {
		                        	  gMain.selPanel.calWorkQty();
		                        	  
		                          }
		                      }
	        		},{
	        			xtype: 'numberfield',
	        			margin : '0 0 10 40',
	        			fieldLabel: '양품수량:',
	        			width: 220,
	        			anchor: '100%',
	        			id : 'work_qty',
	        			name : 'work_qty',
	        			readOnly : true
	        		},{
	        			xtype: 'numberfield',
	        			margin : '0 0 10 60',
	        			fieldLabel: '불량수량:',
	        			anchor: '100%',
	        			width: 220,
	        			id : 'defect_qty',
	        			name : 'defect_qty',
	        			value: '',
	        			readOnly : true,
	        			listeners: {
	                          change: function(field, value) {
	                        	  gMain.selPanel.calWorkQty();
	                        	  
	                          }
	                      }
	        		}]
	        	}]
	        	},{
	        		items :[{
	        			xtype: 'fieldset',
	        			title: '생산 정보',
	        			boder: true,
	        			collapsible: true,
	        			margin: '5',
	        			width : 600,
	        			height : 250,
	        			defaults: {
	        				anchor: '100%',
	        				useThousandSeparator: false,
	        				layout: {
	        					type: 'hbox',
	        					anchor: '70%'
	        				}
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
	        					width: 600,
	        					anchor: '100%',
	        					//labelWidth: 50,
	        					useThousandSeparator: false
	        				},
	        				items: [{
	        					items: [{
		        						xtype:'textfield',
		        						fieldLabel: '원지',
		        						id: 'wonji',
		        						value: wonji,
		        						readOnly: true,
		        						width: 550
	        						},{
	        							xtype:'textfield',
							            fieldLabel: '원단',
							            id: 'wondan',
							            name: 'wondan',
							            value: wondan,
							            readOnly: true,
							            width: 550
							        }, {
							            xtype:'textfield',
							            fieldLabel: '칼Size',
							            id: 'kal_size',
							            name: 'kal_size',
							            value: kal_size,
							            readOnly: true,
							            width: 550
							        }, {
							            xtype:'textfield',
							            fieldLabel: '전공정상태',
							            id: 'prevstep_state',
							            name: 'prevstep_state',
							            value: pstep_status,
							            readOnly: true,
							            width: 550
							        }, {
							            xtype:'textfield',
							            fieldLabel: '후공정',
							            id: 'nextstep_state',
							            name: 'nextstep_state',
							            value: nstep_name,
							            readOnly: true,
							            width: 550
							        }, {
							            xtype:'textfield',
							            fieldLabel: '공정특성',
							            id: 'pcs_uniqueness',
							            name: 'pcs_uniqueness',
							            value: description,
							            readOnly: true,
							            width: 550
							        }, {
				        				xtype : 'fieldcontainer',
				        				layout: 'hbox',
										items :[{
						        				xtype: 'textfield',
						        				fieldLabel: '포장단위',
						        				readOnly: true,
										        id : 'unit_code',
										        name : 'unit_code',
										        //margin : '5 5 0 15',
										        value : unit_code,
										        emptyText : '단위',
										        //anchor: '40%',
										        width: 180
											},
											{
												xtype: 'numberfield',
												readOnly: true,
										        id : 'unit_qty',
										        name : 'unit_qty',
										        margin : '0 0 0 5',
										        value : unit_qty,
										        emptyText : '수량',
										        //anchor: '30%'
										        width: 50
										}]
				        			}]
	        				}]
	        			}]
	               
	        		}]
	        	},{
	        		items:[{
	        			xtype: 'fieldset',
	        			title: gm.getMC('CMD_Defect_Qty', '불량등록'),
	        			width : 330,
	        			height : 250,
	        			margin : '5 5 5 140',
	        			collapsible: true,
	        			anchor: '100%',
	        			layout: 'vbox',
	        			items : [{
	        				xtype : 'fieldcontainer',
	        				layout: 'hbox',
			        		items :[{
			        				xtype: 'combo',
							        id : 'defect_code1',
							        name : 'defect_code1',
							        margin : '5 5 0 15',
							        emptyText : '불량원인',
							        //anchor: '40%',
							        width: 150,
							        mode: 'local',
				            		//value: 'supplier_name',
				            		store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		sortInfo: { field: 'system_code', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{code_name_en}">[]{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	           	
				            	           }
				            	      }
								},{
									xtype: 'numberfield',
							        id : 'qty1',
							        name : 'qty1',
							        margin : '5 0 0 0',
							        emptyText : '수량',
							        //anchor: '30%'
							        width: 100,
							        listeners: {
				                          change: function(field, value) {
				                        	  gMain.selPanel.sumDefectQty();
				                          }
				                      }
							}]
	        			},{
	        				xtype : 'fieldcontainer',
	        				layout: 'hbox',
							items :[{
			        				xtype: 'combo',
							        id : 'defect_code2',
							        name : 'defect_code2',
							        margin : '5 5 0 15',
							        emptyText : '불량원인',
							        //anchor: '40%',
							        width: 150,
							        mode: 'local',
				            		//value: 'supplier_name',
				            		store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		sortInfo: { field: 'system_code', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{code_name_en}">[]{code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	           	
				            	           }
				            	      }
								},
								{
									xtype: 'numberfield',
							        id : 'qty2',
							        name : 'qty2',
							        margin : '5 0 0 0',
							        emptyText : '수량',
							        //anchor: '30%'
							        width: 100,
							        listeners: {
				                          change: function(field, value) {
//				                        	  if(value == null){
//				                        		  Ext.getCmp('defect_qty').setValue('0');
//
//				                        	  }else{
//				                        		  qty1 = Ext.getCmp('qty1').getValue();
//				                        		  defect_qty = Ext.getCmp('defect_qty').setValue(qty1+value);
//				                        	  }
				                        	  gMain.selPanel.sumDefectQty();				                        	  
				                          }
											
				                      }
							}]
	        			},{
	        				xtype : 'fieldcontainer',
	        				layout: 'hbox',
							items :[{
			        				xtype: 'combo',
							        id : 'defect_code3',
							        name : 'defect_code3',
							        margin : '5 5 0 15',
							        emptyText : '불량원인',
							        //anchor: '40%',
							        width: 150,
							        mode: 'local',
				            		//value: 'supplier_name',
				            		store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		sortInfo: { field: 'system_code', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{code_name_en}">[]{code_name_kr}</div>';
				            	      	}
				            		}
								},
								{
									xtype: 'numberfield',
							        id : 'qty3',
							        name : 'qty3',
							        margin : '5 0 0 0',
							        emptyText : '수량',
							        //anchor: '30%'
							        width: 100,
							        listeners: {
				                          change: function(field, value) {
				                        	  gMain.selPanel.sumDefectQty();
				                          }
				                      }
							}]
	        			},{
	        				xtype : 'fieldcontainer',
	        				layout: 'hbox',
			        		items :[{
			        				xtype: 'combo',
							        id : 'defect_code4',
							        name : 'defect_code4',
							        margin : '5 5 0 15',
							        emptyText : '불량원인',
							        //anchor: '40%',
							        width: 150,
							        mode: 'local',
				            		//value: 'supplier_name',
				            		store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		sortInfo: { field: 'system_code', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{code_name_en}">[]{code_name_kr}</div>';
				            	      	}
				            		}
								},
								{
									xtype: 'numberfield',
							        id : 'qty4',
							        name : 'qty4',
							        margin : '5 0 0 0',
							        emptyText : '수량',
							        //anchor: '30%'
							        width: 100,
							        listeners: {
				                          change: function(field, value) {
				                        	  gMain.selPanel.sumDefectQty();
				                          }
				                      }
							}]
	        			},{
	        				xtype : 'fieldcontainer',
	        				layout: 'hbox',
			        		items :[{
			        				xtype: 'combo',
							        id : 'defect_code5',
							        name : 'defect_code5',
							        margin : '5 5 0 15',
							        emptyText : '불량원인',
							        //anchor: '40%',
							        width: 150,
							        mode: 'local',
				            		//value: 'supplier_name',
				            		store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		sortInfo: { field: 'system_code', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{code_name_en}">[]{code_name_kr}</div>';
				            	      	}
				            		}
								},
								{
									xtype: 'numberfield',
							        id : 'qty5',
							        name : 'qty5',
							        margin : '5 0 0 0',
							        emptyText : '수량',
							        //anchor: '30%'
							        width: 100,
							        listeners: {
				                          change: function(field, value) {
				                        	  gMain.selPanel.sumDefectQty();
				                          }
				                      }
							}]
		        		}]
		        	}]		
	        	}] // items
	    	});//Panel end...
	    myHeight = 540;
	    myWidth = 960;
	    prwin = this.prwinopen(form);
	   
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '완료 처리',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '완료하시겠습니까?'
        		var myTitle = '주문 작성 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	var form = gu.getCmp('formPanel').getForm();
                    	//var form = gMain.selPanel.up('form').getForm();
                    	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                    	var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
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
                    	if( check.length < 1){
                    		alert("지종을 다시 선택해주세요");
                    	}
                    	
                    	console_logs('val', val);
                    	
                    	pur = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['description'], val['comment'], val['remark']); //공급사, 지종, 평량, 폭, 장
                    	
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
                    				datas : datas
                    			},
                    			
                    			success : function(response, request) {
                      					console_logs('response', response);
                      					var rec = Ext.JSON.decode(response.responseText);
                      					//console_logs('rec', rec);
                      					
                      				
                      					srcahduids = rec;
                      					
                      					form.submit({
                                			url : CONTEXT_PATH + '/purchase/request.do?method=createmes',
                                			params:{
                                				po_user_uid : po_user_uid,
                                				unique_uid: catmapuid,
                                				coord_key3 : coord_key3,
                                				coord_key2 : coord_key2,
                                				coord_key1 : coord_key1,
                                				sancType : 'YES',
                                				ac_uid: ac_uid,
                                				srcahduids: srcahduids
                                				
                                			},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.store.load(function(){});
                                				
                                			},
                                			failure: function(val, action){
                                				
                                				 prWin.close();
                                				 
                                			}
                                		})
                      					
                      					
                    			},//Ajax success
                    			failure: function(result, request) {
                      					alert('재고가 없습니다. 그래도 진행하시겠습니까?');
                    			},//Ajax failure
                    		}); 
                    		
                    	}  // end of formvalid 
                    	
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
	  prWin.show();
    }
    
        
	
});
