Ext.define('Rfx.view.salesDelivery.HEAVY4_TestStandardExcelView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'received-mgmt-excel-view',
    initComponent: function(){
    	
		//검색툴바 필드 초기화
    	this.initSearchField();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	        	        'COPY','EDIT','SEARCH','DELETE'
        	],
        	RENAME_BUTTONS : [
        	        { key: 'REGIST', text: '엑셀 업로드'}
        	]
        });
        
        
        
        this.saveAction = Ext.create('Ext.Action', {
        	iconCls: 'fa-save_14_0_5395c4_none',
            xtype : 'button',
            text : '저장',
            disabled: true,
   			 handler: function() {
   				Ext.Ajax.request({
             		url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=createConfirmPoBuffer',
         			params:{
         				parentCode : gMain.selPanel.parentCode,
         				group_uid: vCUR_USER_UID + 1000*gMain.selNode.id
         			},
         			
         			success : function(result, request) { 
         				Ext.Msg.alert('저장', '엑셀업로드 처리중입니다.\n 데이터양이 많은경우 수십초 정도 소요 될 수 있습니다. \n 업로드 내용은 검사기준보기에서 확인가능합니다.', function() {});
         				
         				//첨부파일 삭제시 delete 이벤트
         				gMain.selPanel.doDeleteFile('Y');
         				
         				gMain.selPanel.store.removeAll();
         	
         			},//endofsuccess
         			failure: extjsUtil.failureMessage
         		});//endofajax
   			 }
		});
        
        
        buttonToolbar.insert(2, this.saveAction);
        
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
         				gMain.selPanel.setLoading(false);
         				gMain.selPanel.store.load(function(records) {
         	            });
         			},//endofsuccess
         			
         			failure: extjsUtil.failureMessage
         		});//endofajax
   				 
   				gUtil.enable(gMain.selPanel.saveAction);
   				 

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
 		gMain.addTabFileAttachGridPanel('파일', 'FILE_ATTACH', {NO_INPUT: null}, function(selections) {
 	            if (selections.length) {
 	            	var rec = selections[0];
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
 	        			
 	        			if(fileRecord!=null){
 	 	        			gMain.selPanel.setLoading(true);
 	 	        			gUtil.disable(gMain.selPanel.saveAction);
 	 	        			
 	 	        			gMain.selPanel.readExcelHeader(fileobject_uid,pj_code);
 	 	        		
 	 	        			}
 	 	        		}
 	 	        		
 	 	        	}
 	 	        }
 	 		);

 		this.callParent(arguments);
// 		
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
           		o.set('no', i);
            	}
            	
           });
        }
        this.storeLoad();
 		
    },
    items : [],
    parentCode: null,
    //parentCode: this.link,
		//체크된 파일 저장시 첨부파일 삭제
   doDeleteFile : function(saveYN) {
    	
	   	var fileGrid = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach');
	    var selections = fileGrid.getSelectionModel().getSelection();
	    var uids = [];
	    var record = null;
	    if (selections) {
	    	console_logs('fileGrid selections', selections);
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
	    			var fileGrid = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach');

					fileGrid.getStore().remove(record);
	    			
	    		},
	    		failure: function (rec, op)  {
	    			Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});
	    			
	    		}
	    	});
	    }	
   },
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
				
		parseExcel : function(fileobject_uid, pj_code){
						   Ext.Ajax.request({

								url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=readExcelPoBuffer&fileObjectUid='+fileobject_uid + 
								"&pj_code="+pj_code,
								params:{
									parentCode : gMain.selPanel.link,
									group_uid: vCUR_USER_UID + 1000*gMain.selNode.id
								},
								
								success : function(result, request) {
									
									//console_logs("result", result);
									var text = result.responseText;
									//console_logs('text', text);
									var o = Ext.decode(text);
									console_logs('text', text);
									if(o!=undefined && o!=null) {
										var datas = o["datas"];
										if(o==undefined || datas==null || datas.length==0) {
											Ext.MessageBox.alert('경고','레코드 갯수가 0입니다.');
										} else {
											gMain.selPanel.store.removeAll();
												            						
						 					for(var i=0; i<datas.length; i++) {
						 						var data = datas[i];
						 						data['no'] = i;
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
    
    


