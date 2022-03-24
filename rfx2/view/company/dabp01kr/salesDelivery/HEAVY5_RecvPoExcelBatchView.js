Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.HEAVY5_RecvPoExcelBatchView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'received-mgmt-excel-view',
    initComponent: function(){
    	
		//검색툴바 필드 초기화
    	this.initSearchField();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	        	        'COPY','SEARCH','DELETE','CREATE'
        	],
        	RENAME_BUTTONS : [
        	        { key: 'REGIST', text: '엑셀 업로드'}
        	]
        });
        
        
        
       /* this.saveAction = Ext.create('Ext.Action', {
        	iconCls: 'fa-save_14_0_5395c4_none',
            xtype : 'button',
            text : '공정 저장',
            disabled: true,
   			 handler: function() {
   				Ext.Ajax.request({
             		url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=createConfirmPoBuffer',
         			params:{
         				parentCode : gMain.selPanel.parentCode,
         				group_uid: vCUR_USER_UID + 1000*gMain.selNode.id
         			},
         			
         			success : function(result, request) { 
         				Ext.Msg.alert('저장', '엑셀업로드 처리중입니다.\n 데이터양이 많은경우 수십초 정도 소요 될 수 있습니다. \n 업로드 내용은 수주관리에서 확인가능합니다.', function() {});
         				
         				//첨부파일 삭제시 delete 이벤트
         				gMain.selPanel.doDeleteFile('Y');
         				gMain.selPanel.store.removeAll();
         	
         			},//endofsuccess
         			failure: extjsUtil.failureMessage
         		});//endofajax
   			 }
		});*/
        
        
      //  buttonToolbar.insert(2, this.saveAction);
        
        buttonToolbar.insert(2, {
        	iconCls: 'fa-retweet_14_0_5395c4_none',
            xtype : 'button',
            text : '사전 검증',
   			 handler: function() {
   				
   				gMain.selPanel.setLoading(true);
   				Ext.Ajax.request({
             		url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=validateBuffer',
         			params:{
         				parentCode : gMain.selPanel.parentCode,
         				group_uid: vCUR_USER_UID + 1000*gMain.selNode.id
         			},
         			
         			success : function(result, request) {				
         				gm.me().ponoStore.load();
         		        gMain.selPanel.setActiveCrudPanel('EDIT');
         		        gMain.selPanel.toggleSelectedUidForm();
         				gMain.selPanel.setLoading(false);
         				gMain.selPanel.store.load(function(records) {
         					
         	            });
         			},//endofsuccess
         			
         			failure: extjsUtil.failureMessage
         		});//endofajax
   				 
   				
   			 }
        });
		

        //모델 정의
        this.createStore('Rfx.model.HEAVY4ExcelModel', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        ,{

	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['excelline']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
       this.setRowClass(function(record, index) {

            var no = record.get('no');
            var validate = record.get('validate');
            
            console_logs('validate>>>>>>>>>>>>>>>',validate);
            if(no==0) {
            	
            	return 'green-row';
            
            }
       });

        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        //파일첨부 그리드탭 추가
 		gMain.addTabFileAttachGridPanel('파일', 'FILE_ATTACH', {NO_INPUT:null}, function(selections) {
 				
 	            if (selections.length) {
 	            	var rec = selections[0];
 	            	var noLink = 'true'; 
 	            	gm.me().store.getProxy().setExtraParam('noLink', noLink);
	            	//console_logs(rec);
 	            } else {
 	            	
 	            }
 	        },
 	      
 	        gMain.selectedMenuId + 'designFileAttach',
 	        {
 	  	
 	        	
 	        	selectionchange: function(sm, selections) {  
 	        		var uids = [];
 	        		var file_name = '';
 	        		var fileobject_uid = '';
 	        		var pj_code = 'PHANTOM';
 	        
 	        		for(var i=0; i<selections.length; i++){
 	        			var record = selections[i];
 	        			//console_logs('record id', record.get('id'));
 	        			uids.push(record.get('id'));
 	        			/*file_path = record.data['file_path'];
 	        			file_name = record.data['file_name'];*/
 	        			
 	        			fileobject_uid = record.data['fileobject_uid'];
 	        		}
 	        		var fileRecord = (selections!=null && selections.length>0) ? selections[0] : null;
 	        		
 	        		var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
 	        		
 	        		if(fileRecord==null) {
 	        			gUtil.disable(delButton);
 	        		} else {
 	        			gUtil.enable(delButton);
 	        			 	        		
 	        			
 	        			gMain.selPanel.setLoading(true);
 	        			gUtil.disable(gMain.selPanel.saveAction);
 	        			gMain.selPanel.readExcelHeader(fileobject_uid,pj_code);
 	        			
 	        			}
 	        		}
 	        		
 	        	
 	        }
 		);
   
   
 		/*
	                  아래에 로드 
	 	   epc5sub_fields: null,
		   epc5sub_columns: null,
		   epc5sub_tooltips: null,
 		 */
 		this.loadJ2codeForPono();
 	      
 		this.callParent(arguments);
 		
        //디폴트 로드
        gMain.setCenterLoading(false);
        
        //console_logs('this.parentCode', this.parentCode);
        
        this.store.getProxy().setExtraParam('parentCode', this.link);
        this.store.getProxy().setExtraParam('group_uid', vCUR_USER_UID + 1000*gMain.selNode.id);

        
        this.parentCode = this.link;

        gMain.setCenterLoading(false);
        this.storeLoad = function() {
            this.store.load(function(records) {
           	
            	for(var i=0; i<records.length; i++) {
            		var o = records[i];
            		console_logs('record[' + i + ']', o);
            	}
            	
            });
        }
        this.storeLoad();
 		
    },
    items : [],
    parentCode: null,
    //parentCode: this.link,
		//체크된 파일 저장시 첨부파일 삭제
  /* doDeleteFile : function(saveYN) {
    	
	   	var ponoGrid = gm.me().ponoGrid;
	    var selections = ponoGrid.getSelectionModel().getSelection();
	    var uids = [];
	    //var record = null;
	    if (selections) {
	    	console_logs('ponoGrid selections', selections);
	    	for(var i=0; i<selections.length; i++){
	    		record = selections[i];
	    		uids.push(record.get('id'));
	    	}
	    }
	    if(saveYN=='Y' && selections.length>0){
	    	
	    	Ext.Ajax.request({
	    		url: CONTEXT_PATH + '/fileObject.do?method=deleteAll',
	    		params : {
	    			unique_uids : uids
	    		},
	    		method: 'POST',
	    		success: function(rec, op) {
	    			var ponoGrid = gm.me().ponoGrid;
	    			ponoGrid.getStore().remove(record);
	    			
	    		},
	    		failure: function (rec, op)  {
	    			Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});
	    			
	    		}
	    	});
	    }
   },*/	
   readExcelHeader : function(fileobject_uid,pj_code){
   Ext.Ajax.request({

		url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=readExcelHeader&fileObjectUid='+fileobject_uid + "&pj_code="+pj_code,
		params:{
			parentCode : gMain.selPanel.link,
			group_uid: vCUR_USER_UID + 1000*gMain.selNode.id
		},
		
		success : function(result, request) {
			
			gMain.selPanel.setLoading(false);
			gUtil.disable(gMain.selPanel.saveAction);
			
			//console_logs("result", result);
			var text = result.responseText;
			//console_logs('text', text);
			var o = Ext.decode(text);
			console_logs('text', text);
			if(o!=undefined && o!=null) {
				var datas = o["datas"];
				var count = o["count"];
				if(datas==null || datas.length==0) {
					Ext.MessageBox.alert('경고','로딩실패! 파일이 유효한지 확인하세요.');
				} else {
					var msg='<font color=green><b>엑셀필드 정보<br></b></font>';
					for(var i=0;i<datas.length && i<8;i++){
						msg = msg+ datas[i] + '|';
					}
					msg = msg + '....<br><hr><br>';
					msg = msg + '엑셀파일 레코드 갯수는 '+ count +' 입니다. 계속하시겠습니까?';
					
					Ext.MessageBox.confirm('필드확인', msg, function(btn){
						if(btn=='yes'){
							gMain.selPanel.setLoading(true);
							gMain.selPanel.parseExcel(fileobject_uid,pj_code);
						}else{
							
						}
						});
					}
				}else{
					Ext.MessageBox.alert('오류','결과 값을 확인할 수 없습니다.');
				}
				},
				failure: extjsUtil.failureMessage
	});
	},
	   epc5sub_fields: null,
	   epc5sub_columns: null,
	   epc5sub_tooltips: null,
	   loadJ2codeForPono: function() {

			gMain.extFieldColumnStore.load({
			    params: { 	menuCode: 'EPC5_SUB'  },
			    callback: function(records, operation, success) {
			    	console_logs('records>>>>>>>>>>', records);
			    	if(success ==true) {

						var o = gMain.parseGridRecord(records, 'EPC5_SUB');		
						gm.me().epc5sub_fields=o['fields'];
						gm.me().epc5sub_columns=o['columns'];
						gm.me().epc5sub_tooltips=o['tooltips'];
						
						Ext.each( gm.me().epc5sub_columns,	function(o, index) {
							
							
							
							switch(o['dataIndex']) {
							case 'big_pcs_code':
								console_logs('gm.me().epc5sub_columns index', index);
								console_logs('gm.me().epc5sub_columns o', o);
		         				var bigPcsStore = Ext.create('Mplm.store.BigPcsCodeStore', {hasNull:true} );
		         				 
								o['editor']=
	                            {
	                                xtype: 'combo',
	                                store:  bigPcsStore,
	                                displayField: 'pcs_name',
	                                valueField: 'pcs_code'
	                            };
								
								break;
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

         				
         				gm.me().ponoStore = Ext.create('Rfx.store.PoNoStore', {hasNull:true} );
         				
        				
         				this.ponoGrid = Ext.create('Ext.grid.Panel', {
         		        	//id: gridId,
         		            store: gm.me().ponoStore,
         		            //store: store,
         		            title: gm.getMC('CMD_Job_Confirm', '작업지시'),
         		        	cls : 'rfx-panel',
         		        	border: true,
         		        	resizable: true,
         		        	scroll: true,
         		        	multiSelect: true,
         		            collapsible: false,
         		            layout          :'fit',
         		            forceFit: false,
          		           selModel: Ext.create('Ext.selection.CheckboxModel', {
	         		        	  mode: 'SINGLE'
	         		              //checkOnly: 'true',
	         		              //allowDeselect: true,                              
	         		       }),
	         		      dockedItems: [{
	  			            dock: 'top',
				            xtype: 'toolbar',
				            cls: 'my-x-toolbar-default3',
				            items: [
				                    '->',
				                    '-',
				 	   		    	savePcsStep,
				                    '-',
				                    resetPcsStep]

	         					        }],
	         					        
     
         		             plugins: [
         		                    Ext.create('Ext.grid.plugin.CellEditing', {
         		                        clicksToEdit: 1
         		                    })
         		                ],
         		            columns: gm.me().epc5sub_columns
         		        });
         				
         				var tabPanel = Ext.getCmp(gMain.geTabPanelId());
         		        
         		        tabPanel.add(this.ponoGrid);
			    		
         		       this.ponoGrid.getSelectionModel().on({
         		         	selectionchange: function(sm, selections) {  
         		         		try{
         		         		if(selections!=null){ 
         		         			
         		         		  
         		 	        		 var rec = selections[0];
         		 	        		 
         		 	        		 
         		 	        		 console_logs('ponoGrid rec>>>>>>>>>>>>>',rec);
         		 	        		 var rtg_poNo = rec.get('po_no');
         		 	        		 var unique_id = rec.get('unique_id');
         		 	        		 var item_abst = rec.get('item_abst');
         		 	        		 var big_pcs_code = rec.get('big_pcs_code');
         		 	        		 
         		 	        		
         		 	        		 var reserved_varchar2 = rec.get('reserved_varchar2');
         		 	        		 var reserved_varchar3 = rec.get('reserved_varchar3');
         		 	        		 console_logs('big_pcs_code>>>>>>>>>>>>>',big_pcs_code);
         		 	        		 console_logs('item_abst>>>>>>>>>>>>>',item_abst);
         		 	        		 console_logs('rtg_poNo>>>>>>>>>>>>>',rtg_poNo);
         		 	        		 console_logs('unique_id>>>>>>>>>>>>>',unique_id);
         		 	        		 
//         		 	        		 this.store.getProxy().setExtraParam('parentCode', this.link.gridId);
//         		 	        		 console_logs('parentCode>>>>>>>>>>>>>',parentCode);
         		 	        		 gMain.selPanel.store.getProxy().setExtraParam('item_abst', item_abst);
         		 	        		 gMain.selPanel.store.getProxy().setExtraParam('po_no2', rtg_poNo);
         		 	        		 gMain.selPanel.store.getProxy().setExtraParam('po_type', big_pcs_code);
         		 	        		 gMain.selPanel.store.load();
         		 	        		 
         		         	}else{
         		         		gUtil.disable(gMain.selPanel.savePcsStep);
         		         	}
         		         		}catch(e){
         		     				console_logs('e',e);
         		     			}
         		         		
         		     		}
         		         });
			    		
			    	} else {//endof if(success..
						Ext.MessageBox.show({
				            title: '연결 종료',
				            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
				            buttons: Ext.MessageBox.OK
				            
				        });
			    	}
			    },
			    scope: this
			});	
	        	
		},
		   resetPcsstdHandler : function(){
			    var selections = gm.me().ponoGrid.getSelectionModel().getSelection();
			    var uids = [];
			    var record = null;
			    if (selections) {
			    	console_logs('fileGrid selections', selections);
			    	for(var i=0; i<selections.length; i++){
			    		record = selections[i];
			    		uids.push(record.get('id'));
			    	}
			    }

			    Ext.Ajax.request({
					url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdReset',
					params:{
						from_uid: 100,
						to_uid:uids
					},
					success : function(result, request) {   
						
						this.ponoGrid.getStore().getProxy().setExtraParam('assymap_uid', uids);//선택된 CARTMAP_UID
						this.ponoGrid.getStore().load();
					}
			    });
		  
		},
		    savePcsstdHandler : function() {
				 var ponoGrid = gm.me().ponoGrid;
				 //console_logs('gridPcsStd', gridPcsStd);
				 
			    	
			    	var selections = ponoGrid.getSelectionModel().getSelection(); 
			    	
				
			    	var uids = []; 
						    if (selections) {
						    	for(var i=0; i<selections.length; i++){
						    		record = selections[i];
						    		var po_no2 = record.get('po_no');
						    		var item_abst = record.get('item_abst');
        		 	        		var big_pcs_code = record.get('big_pcs_code');
						    		uids.push(po_no2);
						    		console_logs('uids>>>>>>>>>>>>>', uids);
						    		console_logs('item_abst>>>>>>>>>>>>>', item_abst);
						    		console_logs('big_pcs_code>>>>>>>>>>>>>', big_pcs_code);
						    	}
						    }

			    	  //var tomCheck = false;
			    	 /* for (var i = 0; i <ponoGrid.store.data.items.length; i++)
			    	  {
			    	        var record = ponoGrid.store.data.items [i];
			           		var item_abst =  record.get('item_abst');
			           		var LOT_NO = record.get('po_no');
			           		var reserved_varchar3 = record.get('reserved_varchar3') //납품기준일
			           		var reserved_varchar2 = record.get('reserved_varchar2');//블록번호
			           		var big_pcs_code = record.get('big_pcs_code');//대공정

			    	        if (record.dirty) {
			    	        	ponoGrid.store.getProxy().setExtraParam('unique_id', uids);
			    	           	console_logs(record);
	
			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
			    		           	obj['item_abst'] = record.get('item_abst');
			    		           	obj['po_no'] = record.get('po_no');

			    		           	obj['reserved_varchar3'] = record.get('reserved_varchar3');
			    		           	obj['reserved_varchar2'] = record.get('reserved_varchar2');
			    		           	obj['big_pcs_code'] = record.get('big_pcs_code');
			    		 
			    		           	modifiend.push(obj);
			    	           	} else {
			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
			    		           	
			    		           	
			    		           	obj['item_abst'] = '';
			    		           	obj['po_no'] = '';

			    		           	obj['reserved_varchar3'] = '';
			    		           	obj['reserved_varchar2'] = '';
			    		           	obj['big_pcs_code'] = '';
			    		           	modifiend.push(obj);
			    	           	}

			    	        }*/
			    	  
						    console_logs('uids.length>>>>>>>>>>>>>>>>>>>>', uids.length);
			    	  if(uids.length>0) {
			    		  console_log(uids);
			    		 /*var str =  Ext.encode(modifiend);
			    		  console_log(str);
			    		  console_log('modify>>>>>>>>');*/
			    		    Ext.Ajax.request({
			    				url: CONTEXT_PATH + '/sales/excelRecvPo.do?method=createConfirmPoBuffer',
			    				params:{
			         				parentCode : gMain.selPanel.parentCode,
			         				group_uid: vCUR_USER_UID + 1000*gMain.selNode.id,
			         				po_no2:uids,
			         				item_abst:item_abst,
			         				po_type:big_pcs_code
			         			},
			         			success : function(result, request) { 
			         				Ext.Msg.alert('저장', '<< 삼성엑셀 >> 업로드 처리중입니다.\n 데이터양이 많은경우 수십초 정도 소요 될 수 있습니다. \n 업로드 내용은 **에서 확인가능합니다.', function() {});
			         				
			         				//첨부파일 삭제시 delete 이벤트
			         				//gMain.selPanel.doDeleteFile('Y');
			         				//gMain.selPanel.store.removeAll();
			         	
			         			},//endofsuccess
			         			failure: extjsUtil.failureMessage
			         		});//endofajax
			   			 }
					
			 },		
	parseExcel : function(fileobject_uid,pj_code){
					   Ext.Ajax.request({

							url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=readExcelPoBuffer&fileObjectUid='+fileobject_uid + "&pj_code="+pj_code,
							params:{
								parentCode : gMain.selPanel.link,
								group_uid: vCUR_USER_UID + 1000*gMain.selNode.id
							},
							
							success : function(result, request) {
								
								//console_logs("result", result);
								var text = result.responseText;
								//console_logs('text', text);
								var o = Ext.decode(text);
								//console_logs('text', text);
								//console_logs('o', o);
								if(o!=undefined && o!=null) {
									var datas = o["datas"];
									console_logs('datas',datas);
									if(o==undefined || datas==null || datas.length==0) {
										Ext.MessageBox.alert('경고','레코드 갯수가 0입니다.');
									} else {
										gMain.selPanel.store.removeAll();
											            						
					 					for(var i=0; i<datas.length; i++) {
					 						var data = datas[i];
					 						data['no'] = i;
					 						console_logs('data', data);
					 						gMain.selPanel.store.add(new Ext.data.Record(data));
					 					} 	
					 					gMain.selPanel.setLoading(false);									}
								} else {
									Ext.MessageBox.alert('오류','결과 값을 확인할 수 없습니다.');
								}   				

							},//endofsuccess
							failure: extjsUtil.failureMessage
						});//endofajax
	}
});
