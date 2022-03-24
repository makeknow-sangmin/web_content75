Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.OutProduceView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'outProduce-view',
    initComponent: function(){


      	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField ('pj_code');	
		this.addSearchField (
				{
						field_id: 'pj_code'
						,store: "ProjectStore"
	    			    ,displayField:   'pj_name'
	    			    ,valueField:   'unique_id'
	    			    ,value: vCUR_USER_NAME
						,innerTpl	: '<div data-qtip="{unique_id}">{pj_name}</div>'
				});	
		this.addSearchField('item_code');
		
		this.addSearchField('buyer_name');
		
		this.addSearchField('supplier_name');
		
		this.addSearchField (
				{
						field_id: 'is_complished'
						,store: "CommonCodeStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,params: {parentCode:'IS_COMPLISHED', hasNull:true}	
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
//		this.addSearchField('wa_code');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
	    		modelClass: 'Rfx.model.OutProduce',
	    		sorters: [{
		        	property: 'supplier_name',
		        	direction: 'ASC'
		        }],
		        pageSize: gMain.pageSize,/*pageSize*/
		        byReplacer: {
		        	'item_code': 'srcahd.item_code',
		        	'step': 'step.pcs_code'
		        	,'supplier_name': 'supast.supplier_name'
		        },
		        deleteClass: ['pcsstep']
			        
		    }, {
		    	groupField: 'supplier_name'
        });
        
      
//	        //완료처리
//	        this.pcsCompleteAction = Ext.create('Ext.Action', {
//	   		 iconCls: '',
//	   		 text: '완료처리',
//	   		 tooltip: '완료처리 하기',
//	   		 disabled: true,
//	   		 handler: function() {
//	   	    	console_logs('treatPcsInfo---------------',gMain.selPanel.vSELECTED_PCS_CODE);
//	    		Ext.Ajax.request({
//					url: CONTEXT_PATH + '/production/popcontroller.do?method=ProcessInput02Machine',
//					params:{
//						pcs_code: gMain.selPanel.vSELECTED_PCS_CODE,
//						lot_no: gMain.selPanel.vSELECTED_PJ_CODE,
//						sup_code: gMain.selPanel.vSELECTED_SUP_CODE
//					},
//					
//					success : function(result, request) {   	
//
//						var oStr = result.responseText;
//						var arr = Ext.decode(oStr);
//						var o = arr.datas[0];
//				        var lot_no = '';
//	                   if(o!=null) {
//	                   	console_logs('o**************', o);
//	                   		gMain.selPanel.returnValue(o);
//	              			gMain.selPanel.treatPcsInfo();
//	                   }
//	                   
//
//						
//					},//end of success
//					failure: extjsUtil.failureMessage
//				});//end of ajax
//
//	   		 	}
//	        });
	        
      //외주입고완료처리
        this.pcsCompleteAction = Ext.create('Ext.Action', {
   		 iconCls: '',
   		 text: '외주입고처리',
   		 tooltip: '외주입고처리 하기',
   		 disabled: true,
   		 handler: function() {
              			
   			 gMain.selPanel.treatPcsInfo();
                   
   		 	}
        });
        
	        //수량변경
        this.pcsQtyAction = Ext.create('Ext.Action', {
    		 iconCls: '',
    		 text: '수량변경',
    		 tooltip: '수량변경 하기',
    		 disabled: true,
    		 handler: function(widget, event) {
    			gMain.selPanel.modifyPcsQty();

    		 }
         });
	        
	        //상태변경
	        this.pcsOutAction = Ext.create('Ext.Action', {
				 iconCls: '',
				 text: '외주가공요청',
				 tooltip: '외주가공 요청하기',
				 disabled: true,
				 handler: function(widget, event) {
		    			gMain.selPanel.modifyPcsQty();

		    		 }
			});    
	        
	        //외주입고완료처리
	        this.pcsModifyAction = Ext.create('Ext.Action', {
	   		 iconCls: '',
	   		 text: '외주처변경',
	   		 tooltip: '외주처변경',
	   		 disabled: true,
	   		handler: function(widget, event) {
    			gMain.selPanel.modifyPcsSeller();

    		 }
	        });
	        
	        buttonToolbar.insert(6, this.pcsCompleteAction);
	        buttonToolbar.insert(7, this.pcsModifyAction);
	        buttonToolbar.insert(7, this.pcsQtyAction);
//	        buttonToolbar.insert(6, this.pcsStateAction);
	        
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
	        groupHeaderTpl: '<div><b><font color=#003471>{name}</b></font> :: {[values.rows[0].data.supplier_code]} ({[values.rows[0].data.seller_uid]})  {[values.rows[0].data.item_name]} {[values.rows[0].data.specification]}  ({rows.length} 공정)</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
        
        //grid 생성.
		//Ext.Msg.alert('Status', 'Changes saved successfully.');
        this.createGridCore(arr, option);
		//this.doSample();


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
            	gMain.selPanel.vSELECTED_SUP_CODE = rec.get('supplier_code');
            	gMain.selPanel.supastStore.getProxy().setExtraParam('pcs_code', gMain.selPanel.vSELECTED_PCS_CODE);
            	gMain.selPanel.supastStore.load();
				console_logs('setGridOnCallback---------------',gMain.selPanel.vSELECTED_PJ_CODE);
				
            	if(rec.get('is_complished')!='Y'){
            		gMain.selPanel.pcsCompleteAction.enable();
            	} else {
					gMain.selPanel.pcsCompleteAction.disable();
				}

            	if(rec.get('is_complished')=='Y'){
                	this.pcsQtyAction.enable();
				} else {
					this.pcsQtyAction.disable();
				}

            	if(rec.get('is_complished')=='P'){
            		gMain.selPanel.pcsModifyAction.enable();
                	} else {
						gMain.selPanel.pcsModifyAction.disable();
					}
            	
            } else {
//            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
//            	gMain.selPanel.addWorkOrder.disable();
//            	gMain.selPanel.printPDFAction.disable();
//            	gMain.selPanel.workCancleAction.disable();
//            	gMain.selPanel.rejectAction.disable();
//            	this.pcsStateAction.disable();
            	this.pcsQtyAction.disable();
            	this.pcsCompleteAction.disable();
            	this.pcsModifyAction.disable();
            	
            	
            }
//        	var processGrid = Ext.getCmp('workOrderGrid');
//        	processGrid.getStore().load(function (records){
//        		console_logs('records', records);
        		
//        	});
        })
        this.callParent(arguments);
        

    	this.store.getProxy().setExtraParam('orderBy', "supast.supplier_name");
    	this.store.getProxy().setExtraParam('ascDesc', "ASC");  
        //디폴트 로드
    	gMain.setCenterLoading(false);
        this.store.load(function(records){
        	console_logs('OutAdjustView records', records);
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
    //외주가공요청
    pcsOutChange: function() {
    	
    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

    	var pcsstepUid = this.vSELECTED_RECORD.get('unique_id');
    	var acUid = this.vSELECTED_RECORD.get('ac_uid');
    	
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/pcsline.do?method=stateOutChange',
			params:{
				unique_id: pcsstepUid,
				ac_uid: acUid
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
	   		console_logs('returnValue', lot_no);

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
		
    	var form = null;
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
                labelWidth: 100,
                margins: 10,
            },
	        items: [{
				fieldLabel: '반출일',
				xtype: 'datefield',
				anchor: '100%',
				name: 'start_date',
				format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			},{
				fieldLabel: '반입일',
				xtype: 'datefield',
				anchor: '100%',
				name: 'end_date',
				format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			},{
				fieldLabel: '수량',
				xtype: 'textfield',
				anchor: '100%',
				name: 'outpcs_qty'
			}]
	        	
	    	});//Panel end...
	    myHeight = 180;
	    myWidth = 300;
	    prwin = this.prwinopen(form);
	   
    },
    modifyPcsSeller: function() {
		var form = null;
	    form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanelpcsQty'),
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
                labelWidth: 100,
                margins: 10,
            },
	        items: [
	        	{
					fieldLabel: '외주가공처',
					xtype: 'combo',
					anchor: '100%',
					name: 'seller_uid',
					//value: operator_name,
		            displayField:   'supplier_name',
			        valueField:     'unique_id',
			        store: gMain.selPanel.supastStore,
				    width: 220,
				    fieldStyle: 'background-color: #FBF8E6; background-image: none;'
					}
	        ]
	        	
	    	});//Panel end...
	    myHeight = 100;
	    myWidth = 300;
	    prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '외주가공처변경',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '외주가공처를 변경하시겠습니까?'
        		var myTitle = '외주가공처변경처리';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	var form = gu.getCmp('formPanelpcsQty').getForm();
                    	
//                    	gMain.selPanel.vSELECTED_STEP_UID//stepuid
//                    	gMain.selPanel.vSELECTED_STEP_STAT //step 진행상태
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	console_logs('val', val);
                    	Ext.Ajax.request({
	            			url: CONTEXT_PATH + '/index/process.do?method=pcsModifySeller',
	            			params:{
	            				
	            				unique_id : gMain.selPanel.vSELECTED_STEP_UID,	//pcsstep_uid
	            				seller_uid : val['seller_uid']						//변경외주가공처 uid

	            			},
	            			success : function(result, request) {

                                if (prWin) {
                                    prWin.close();
                                }
	            				gMain.selPanel.store.load();
	            			},
	            			failure: extjsUtil.failureMessage
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
},modifyPcsQty: function() {
		var form = null;
	    form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanelpcsQty'),
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
                labelWidth: 100,
                margins: 10,
            },
	        items: [
				{
				fieldLabel: '수량',
				xtype: 'textfield',
				anchor: '100%',
				name: 'modify_qty'
			}]
	        	
	    	});//Panel end...
	    myHeight = 100;
	    myWidth = 300;
	    prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '수량변경',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '수량을 변경하시겠습니까?'
        		var myTitle = '수량변경처리';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	var form = gu.getCmp('formPanelpcsQty').getForm();
                    	
//                    	gMain.selPanel.vSELECTED_STEP_UID//stepuid
//                    	gMain.selPanel.vSELECTED_STEP_STAT //step 진행상태
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	console_logs('val', val);
                    	Ext.Ajax.request({
	            			url: CONTEXT_PATH + '/index/process.do?method=PcsModifyQty',
	            			params:{
	            				
	            				unique_id : gMain.selPanel.vSELECTED_STEP_UID,	//pcsstep_uid
	            				modify_qty : val['modify_qty']						//변경수량
//	            				pcs_code : gMain.selPanel.vSELECTED_PCS_CODE,	//공정코드
//	            				operator_id  : val['pcsOperator'],				//작업자ID
//	            				mchn_code : val['pcsMchn'],					//설비코드
//	            				state : gMain.selPanel.vSELECTED_STEP_STAT,		//진행상태
//                    			work_qty : val['work_qty'],						//생산수량
//                    			defect_qty : val['defect_qty'],					//불량수량
//                    			defect_detail : gMain.selPanel.sumDefectDetail(),

	            			},
	            			success : function(result, request) {
                                if (prWin) {
                                    prWin.close();
                                }
	            				gMain.selPanel.store.load();
	            			},
	            			failure: extjsUtil.failureMessage
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
},
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '외주입고처리',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '완료하시겠습니까?'
            		var myTitle = '외주입고처리';
            		Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {
                        	var form = gu.getCmp('formPanel').getForm();
                        	
//                        	gMain.selPanel.vSELECTED_STEP_UID//stepuid
//                        	gMain.selPanel.vSELECTED_STEP_STAT //step 진행상태
                        	if(btn == "no"){
                        		MessageBox.close();
                        	}else{
                        	if(form.isValid()){	
                        	var val = form.getValues(false);
                        	console_logs('val', val);
                        	Ext.Ajax.request({
    	            			url: CONTEXT_PATH + '/index/process.do?method=PcsOutsideOrderIn',
    	            			params:{
    	            				
    	            				unique_id : gMain.selPanel.vSELECTED_STEP_UID,	//pcsstep_uid 
    	            				start_date : val['start_date'],					//설비코드
    	            				outpcs_qty : val['outpcs_qty'],						//생산수량
                        			end_date : val['end_date']					//불량수량

    	            			},
    	            			success : function(result, request) {
                                    if (prWin) {
                                        prWin.close();
                                    }
    	            				gMain.selPanel.store.load();
    	            			},
    	            			failure: extjsUtil.failureMessage
    	            		});
                        	
                          					
                        		
                        	}  // end of formvalid 
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
	  prWin.show();
    },

    items : [],
    supastStore : Ext.create('Mplm.store.SupastStore',{hasOwn:true}),
    doSample: function() {
    	
        var dateToolbar = Ext.create('Ext.toolbar.Toolbar', {
    		cls: 'my-x-toolbar-default1',
        	items: [
            	        //searchAction, '-',
            	        	{
    	      					
          					    xtype:'label',
    							width: 75,
          					    text: "검색일자 : ",
          					    style: 'color:white;'
    	      					 
    				        },
          					{ 
          		                name: 's_date',
          		                format: 'Y-m-d',
          		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
          				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
          				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
          					    	allowBlank: true,
          					    	xtype: 'datefield',
          					    	value: new Date(),
          					    	width: 100,
          						handler: function(){
          						}
          					},
          					{
          					    xtype:'label',
          					    text: " ~ ",
          					    style: 'color:white;'
          					    
          					 },
          					{ 
          		                name: 'e_date',
          		                format: 'Y-m-d',
          		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
          				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
          				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
          					    	allowBlank: true,
          					    	xtype: 'datefield',
          					    	value: new Date(),
          					    	width: 99,
          						handler: function(){
          						}
          					}
        	        ]
        });
        
        
    	 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
    	        groupHeaderTpl: '<b><font color=#003471>{name}</b></font> ({rows.length} 종)'
    	    });
        	
    }
});
 
