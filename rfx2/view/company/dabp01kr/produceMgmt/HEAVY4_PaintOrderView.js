Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.HEAVY4_PaintOrderView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'paintorder-view',
   
    initComponent: function(){
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
       	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
    	this.addSearchField (
				{		 
						field_id: 'state'
						,store: "DDStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	
    	switch(vCompanyReserved4){
    	case 'SHNH01KR' :
    		this.addSearchField (
    				{
    					type: 'combo'
    					,field_id: 'lot_no'
    					,store: "RtgastPonoStore"
    					,displayField: 'po_no'
    					,valueField: 'po_no'
    					,innerTpl	:'<div data-qtip="{po_no}">{po_no}</div>'
    				});
    		break;
    		default : 
    			break;
    	}
		
		
		this.addSearchField (
				{
						field_id: 'emergency'
						,store: "HeavyEmergency"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});
//		this.addSearchField ('item_name');	
		
//		this.addSearchField('item_code');
		
//		this.addSearchField('wa_name');


//		this.addSearchField('pj_code');
		
        
        
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        /*(buttonToolbar.items).each(function(item,index,length){
        	if(index==1) {
            	buttonToolbar.items.remove(item);        		
        	}

        });   */   
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        });
        
        //콘솔 로그
        //console_logs('this.fields', this.fields);
        //모델 정의
        this.createStore('Rfx.model.HEAVY4PaintOrder', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/*pageSize*/
        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	//Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'rtgast.creator',
        	unique_id: 'rtgast.unique_id'
        }
    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['rtgast']
        );


        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.setRowClass(function(record, index) {
        	
        	// console_logs('record', record);
            var c = record.get('state');
            // console_logs('c', c);
            switch(c) {
                case 'P':
                	return 'red-row';
                	break;
                case 'N':
                	return 'yellow-row';
                	break;
                case 'Y':
                	return 'green-row';
                	break;
                default:
                	return 'red-row';
            }

        });
//        this.setRowClass(function(record, index) {
//        	
//        	// console_logs('record', record);
//            var c = record.get('status');
//            // console_logs('c', c);
//            switch(c) {
//                case 'CR':
//                	return 'yellow-row';
//                	break;
//                case 'P':
//                	return 'orange-row';
//                	break;
//                case 'DE':
//                	return 'red-row';
//                	break;
//                case 'BM':
//                	break;
//                default:
//                	return 'green-row';
//            }
//
//        });
        //grid 생성.
        this.createGrid(arr/*, function(){}*/);
        
        this.editAction.setText('상세보기');
        //this.removeAction.setText('작업반려');
        
        //작업반려 Action 생성
        this.denyWorkOrder = Ext.create('Ext.Action', {
        	iconCls: 'af-remove',
			 text: '작업반려',
			 tooltip: 'LOT 해체',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: 'LOT를 재구성하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.denyWorkOrderFc();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
        switch(vCompanyReserved4){
	    	case 'DDNG01KR' :
	    		is_rotate = 'N';
	    		break;
	    	case 'SWON01KR' :
	    		is_rotate = 'Y';
	    		break;
	    	case 'SHNH01KR' :
	    		is_rotate = 'Y';
	    		break;
	    	default : 
	    		is_rotate = 'N';
    }
        
        //작업지시 Action 생성
        this.addWorkOrder = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: gm.getMC('CMD_Job_Confirm', '작업지시'),
			 tooltip: '작업지시 확정',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatWorkStart();
			 }
		});
        
        
        this.printPdfActions = [];
        
        for(var i=0; i<gUtil.mesStdProcess; i++) {
        	var o = gUtil.mesStdProcess[i];
        	var code = o['code'];
        	var name = o['name'];
        	this.printPdfActions[i] = Ext.create('Ext.Action',{
                iconCls: 'af-pdf',
                text: name,
                
                tooltip:name + '작업지시서 출력',
                disabled: true,
                
                handler: function(widget, event) {
                	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
                	var po_no = gMain.selPanel.vSELECTED_PO_NO;
                	Ext.Ajax.request({
                		url: CONTEXT_PATH + '/pdf.do?method=printWo',
                		params:{
                			rtgast_uid : rtgast_uid,
                			po_no : po_no,
                			pcs_code: code,
                			is_heavy : 'Y',
                			pdfPrint : 'pdfPrint',
                			is_rotate : is_rotate //가로양식:Y 세로양식:N
                		},
                		reader: {
                			pdfPath: 'pdfPath'
                		},
                		success : function(result, request) {
                    	        var jsonData = Ext.JSON.decode(result.responseText);
                    	        var pdfPath = jsonData.pdfPath;
                    	        console_logs(pdfPath);      	        
                    	    	if(pdfPath.length > 0) {
                    	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                    	    		top.location.href=url;	
                    	    	}
                		},
                		failure: extjsUtil.failureMessage
                	});
                	
                	
                }
            });
        }
        

      	 switch(vCompanyReserved4){
           case "SHNH01KR":
        	textname = 'PDF';
       		is_rotate = 'Y';
       		J2_CODE='EPC5_PNT';
       		//this.workOrderGrid.getStore().getProxy().setExtraParam('pcs_code', "PNT");
           	break;
           case 'DDNG01KR' :
        		textname = '제작';
        		is_rotate = 'N';
        		break;
           case "SWON01KR":
       		textname = 'PDF';
       		is_rotate = 'Y';
       		J2_CODE='EPC5_SUB';
           	break;
           default:
        	textname = 'PDF';
       		is_rotate = 'N';
       		J2_CODE='EPC5_SUB';
       		//this.workOrderGrid.getStore().getProxy().setExtraParam('pcs_code', "PNT");
           	break;
           }
        
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            /*text: '제작',*/
            text: textname,
            tooltip:'작업지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
            	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
            	if(vCompanyReserved4=='SHNH01KR'){
            		pcs_code = 'PNT';
            	}else{
            		pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
            	}
            	console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
            	console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
            	console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pcs_code : pcs_code,
            			ac_uid : ac_uid,
            			is_heavy : 'Y',	 //중공업:Y  기타:N
            			is_rotate : is_rotate, //가로양식:Y 세로양식:N
            			wo_type : 'P',
            			pdfPrint : 'pdfPrint'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_logs(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });
        
        
     	 var my_model = Ext.create('Rfx.model.HEAVY4PaintOrder', {});
	 	 var my_store = new Ext.data.Store({  
			pageSize: 50,
		    //groupField: 'class_name',
		    sorters: ['unique_id'],
			model:  my_model
		 });
       this.printExcel1Action = Ext.create('Ext.Action',
               {
//               	xtype: 'button',
               	iconCls: 'af-excel',
               	text:'전처리요약',
               	my_store: my_store,
                   //html: '<div class="inputBT"><button type="button" onClick="redrawProduceChart1();"><span class="search">검색</span></button></div>'
               	handler: function(a,b,c,d) {
                   	var me = this;

                   	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
                   	var po_no = gMain.selPanel.vSELECTED_PO_NO;
                   	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
                   	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                   	
               		this.my_store.getProxy().setExtraParam("srch_type", 'excelPrint');
               		this.my_store.getProxy().setExtraParam("srch_fields", 'major');
               		this.my_store.getProxy().setExtraParam("srch_rows", 'all');
               		this.my_store.getProxy().setExtraParam("rtgast_uid", rtgast_uid);
               		this.my_store.getProxy().setExtraParam("po_no", po_no);
               		this.my_store.getProxy().setExtraParam("pcs_code", pcs_code);
               		this.my_store.getProxy().setExtraParam("ac_uid", ac_uid);
               		
               		this.my_store.getProxy().setExtraParam("menuCode", 'EPJ1_LTC');  //제목 컬럼
               		
               		var count = Number(this.my_store.getProxy().getReader().rawData.count);
               			console_logs('===count===', count);
               			
               			var me = this;
               			this.my_store.load({
               			    scope: this,
               			    callback: function(records, operation, success) {
               			    	console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
               			    	var excelPath = me.my_store.getProxy().getReader().rawData.excelPath;
               			    	if(excelPath!=null && excelPath.length > 0) {
               			    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
               			    		top.location.href=url;	
               			    	} else {
               			    		alert('다운로드 경로를 찾을 수 없습니다.');
               			    	}
               			    }
               			});

               	}
               	

       });
       
       this.printExcel2Action = Ext.create('Ext.Action',
               {
//               	xtype: 'button',
               	iconCls: 'af-excel',
               	text:'배제List',
               	my_store: my_store,
                   //html: '<div class="inputBT"><button type="button" onClick="redrawProduceChart1();"><span class="search">검색</span></button></div>'
               	handler: function(a,b,c,d) {
               		
                   	var me = this;
               		var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
                   	var po_no = gMain.selPanel.vSELECTED_PO_NO;
                   	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
                   	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                   	
               		this.my_store.getProxy().setExtraParam("srch_type", 'excelPrint');
               		this.my_store.getProxy().setExtraParam("srch_fields", 'major');
               		this.my_store.getProxy().setExtraParam("srch_rows", 'all');
               		this.my_store.getProxy().setExtraParam("rtgast_uid", rtgast_uid);
               		this.my_store.getProxy().setExtraParam("po_no", po_no);
               		this.my_store.getProxy().setExtraParam("pcs_code", pcs_code);
               		this.my_store.getProxy().setExtraParam("ac_uid", ac_uid);

               		this.my_store.getProxy().setExtraParam("srch_type", 'excelPrint');
               		this.my_store.getProxy().setExtraParam("srch_fields", 'major');
               		this.my_store.getProxy().setExtraParam("srch_rows", 'all');
               		this.my_store.getProxy().setExtraParam("menuCode", 'EPJ1_LTD');  
               		
               			var count = Number(this.my_store.getProxy().getReader().rawData.count);
               			console_logs('===count===', count);
               			
               			var me = this;
               			this.my_store.load({
               			    scope: this,
               			    callback: function(records, operation, success) {
               			    	console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
               			    	var excelPath = me.my_store.getProxy().getReader().rawData.excelPath;
               			    	if(excelPath!=null && excelPath.length > 0) {
               			    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
               			    		top.location.href=url;	
               			    	} else {
               			    		alert('다운로드 경로를 찾을 수 없습니다.');
               			    	}
               			    }
               			});

               	}
               	

       });

        
        //버튼 추가.

        buttonToolbar.insert(2, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        buttonToolbar.insert(2, '-');

        for(var i=0; i< this.printPdfActions.length; i++) {
            buttonToolbar.insert(8, this.printPdfActions[i]);
  
        }

        buttonToolbar.insert(8, '-');
        switch(vCompanyReserved4){
        case "SWON01KR":
            buttonToolbar.insert(9, this.printPDFAction);
            buttonToolbar.insert(9, '-');
        	break;
        case "SHNH01KR":
            buttonToolbar.insert(9, this.printPDFAction);
            buttonToolbar.insert(9, '-');
            buttonToolbar.insert(9, this.printExcel1Action);
            buttonToolbar.insert(10, this.printExcel2Action);
        	break;
        default:
        	break;
        }
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');
            	//gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no');
            	gMain.selPanel.addWorkOrder.enable();
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('coord_key3');
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('pj_code');
            	gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code');
            	
            	gMain.selPanel.printPDFAction.enable();
            	gMain.selPanel.vSELECTED_PROJECT_UID = rec.get('ac_uid');//project의 uid
            	gMain.selPanel.vSELECTED_PRODUCT_CODE = rec.get('item_code'); //product의 item_code
            	gMain.selPanel.vSELECTED_STATE = rec.get('state'); //product의 item_code
				
				console_logs('=====das', gMain.selPanel.vSELECTED_STATE);
            	if(gMain.selPanel.vSELECTED_STATE == 'P'){
            		gMain.selPanel.addWorkOrder.enable();
            		//gMain.selPanel.printPDFAction.disable();
            		gMain.selPanel.denyWorkOrder.enable();
            	}else{
            		gMain.selPanel.addWorkOrder.disable();
            		//gMain.selPanel.printPDFAction.enable();
            		gMain.selPanel.denyWorkOrder.disable();
            	}
            	switch(vCompanyReserved4){
                
	                case "SHNH01KR":
	                	this.workOrderGrid.getStore().getProxy().setExtraParam('pcs_code', "PNT");
	                	break;
	                default:
	                	
            	}
            	
            	this.workOrderGrid.getStore().getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);
            	this.workOrderGrid.getStore().load();
            	//gMain.selPanel.workListStore.load();
            	/*var fileGrid = Ext.getCmp(id);
        		fileGrid.getStore().getProxy().setExtraParam('unique_id', targetUid);*/
            	//gMain.selPanel.workOrderGrid.getStore().load();
            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.addWorkOrder.disable();
            	//gMain.selPanel.printPDFAction.disable();
            }
        	
        })

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        //작업 그룹 목록 그리드탭

        this.addTabpaintOrderGridPanel('작업그룹', J2_CODE, {  
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			model: 'Rfx.store.HeavyWorkListStore',
	        dockedItems: [
		     
		        {
		            dock: 'top',
		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
		            cls: 'my-x-toolbar-default3',
		        
			        }
		        ],
				sorters: [{
		           property: 'reserved1',
		           direction: 'ASC'
		       }]
		}, 
		function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
            	this.selPanel.selectPcsRecord = rec;
            } else {
            	
            }
        },
        'workOrderGrid'//toolbar
	);


        this.callParent(arguments);
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        switch(vCompanyReserved4){
        case 'SWON01KR' :
        	this.grid.getStore().getProxy().setExtraParam('po_type', 'MAT');
        	break;
    	case 'SHNH01KR' :
        this.grid.getStore().getProxy().setExtraParam('po_type', 'PNT');
        break;
        default :
        	break;
        }
        
        this.store.load();
        
        


    },

    selectPcsRecord: null,
    potype : 'PNT',
    items : [],
    
    
    addTabpaintOrderGridPanel: function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	console_logs('records>>>>>>>>>>', records);
		    	if(success ==true) {
		    		this.callBackWorkList(title, records, arg, fc, id);
		    	} else {//endof if(success..
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {

			            }
			        });
		    	}
		    },
		    scope: this
		});	
        	
	},
	
	callBackWorkList: function(title, records, arg, fc, id) {
		var gridId = id== null? this.getGridId() : id;
		
		var o = gMain.parseGridRecord(records, gridId);		
		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		
		var modelClass = arg['model'];
		var pageSize = arg['pageSize'];
		var sorters = arg['sorters'];
		var dockedItems = arg['dockedItems'];
		var model = Ext.create(modelClass, {
        	fields: fields
        });
		/*var workListStore = new Ext.data.Store({  
			pageSize: pageSize,
			model: model,
			sorters: sorters
		});*/
		
		/*var mySorters = [{
	           property: 'p.serial_no',
	           direction: 'ASC'
	       }];*/
		
		//store.getProxy().setExtraParam('sort', JSON.stringify(mySorters));
		
		
		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
		
		 this.workListStore = Ext.create('Rfx.store.HeavyWorkListStore');
		
		this.workListStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);
		//this.workListStore.getProxy().setExtraParam('pcs_code', 'PNT');
		console_logs('rtgastuid >>>>>>>>>>>>>>>', gMain.selPanel.vSELECTED_RTGAST_UID);
		/*workListStore.load( function(records) {
			console_log('작업리스트>>>>>>>>>>', records); 
			if(records != undefined ) {

                 for (var i=0; i<records.length; i++){ 
	                	var obj = records[i];

	                	var system_code = obj.get('systemCode');
	                	
                   }
			 }
	    });*/
		
		//var workOrderGrid =null;
		
		
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		this.workOrderGrid = Ext.create('Ext.grid.Panel', {
        	//id: gridId,
            store: this.workListStore,
            //store: store,
            title: title,
        	cls : 'rfx-panel',
        	border: true,
        	resizable: true,
        	scroll: true,
        	multiSelect: true,
            collapsible: false,
            layout          :'fit',
            forceFit: false,
            //flex : 1,
            dockedItems: dockedItems,
            plugins: [cellEditing],
        	listeners: {
        		 itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    contextMenu.showAt(e.getXY());
	                    return false;
	                },
	                select: function(selModel, record, index, options){
	                    
	                },
        	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        	
        	     }, //endof itemdblclick
        	     cellkeydown:function (workOrderGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }


 	            }
        	},//endof listeners
            columns: columns
        });
		this.workOrderGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });
        var view = this.workOrderGrid.getView();
        
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function(e) {
                var selectionModel = this.workOrderGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.workOrderGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);
               
            },
            up: function(e) {
                var selectionModel = this.workOrderGrid.getSelectionModel();
                var select = this.workOrderGrid.store.totalCount - 1; // select last element if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.workOrderGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);
             
            }
        });
        
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        
        tabPanel.add(this.workOrderGrid);
	},
    
    
    addWorkOrderFc: function() {
    	
    	
//    	var target_reserved_double3 = this.getInputTarget('unique_id');
//    	var assymapUid = target_reserved_double3.getValue()
//    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

    	var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
			params:{
				rtgastUid: rtgastUid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax

    },
    
    denyWorkOrderFc: function() {
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

    	var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderHeavy',
			params:{
				rtgastUid: rtgastUid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
    },
    treatWorkStart: function(){
    		var itemsPartner = [];
    		switch(vCompanyReserved4){
            /*case 'SHNH01KR' :
            	this.potype = 'PRD'
                break;*/
            case 'SWON01KR' :
                break;
            default :
	    	for(var i=0; i<gUtil.mesStdProcess.length; i++) {
	    		
	    		var o = gUtil.mesStdProcess[i];
	    		var pcs_code = o['code'];
	    		var pcs_name = o['name'];
	    		console_logs('itemspartner',o);
	    		var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});
	    		
	    		switch(pcs_code){
	    		case 'PRD':
	    		case 'ISP':
	    			break;
	    		case 'IPP':
	    			var myId = this.link + pcs_code+  'h_outmaker';
	    			this.madeComboIds.push(myId);
	    			itemsPartner.push({
	    				fieldLabel: pcs_name + ' 협력사',//ppo1_request,
	    			 	xtype: 'hiddenfield',
	    				anchor: '100%',
	    				name: pcs_code+  'h_outmaker',
	    				id: myId
	         						
	    			});
	    			break;
	    		case 'PNT':
	    			var myId = this.link + pcs_code+  'h_outmaker';
	    			this.madeComboIds.push(myId);
	    			itemsPartner.push({
	    				fieldLabel: pcs_name + ' 협력사',//ppo1_request,
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
	            		},
	            		listeners: {
	         	           select: function (combo, record) {
	         	       		var dept_code = record.get('dept_code');
	         	       		Ext.getCmp('EPJ1_MESIPPh_outmaker').setValue(dept_code);
	 
	         	   			
	         	           }
	         	      }
	    			});
	    			break;
	    		default:
	    			var myId = this.link + pcs_code+  'h_outmaker';
				this.madeComboIds.push(myId);
				itemsPartner.push({
					fieldLabel: pcs_name + ' 협력사',//ppo1_request,
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
				break;
	    			break;
	    		}
	    		
	    		/*if(pcs_code == 'PRD'|| pcs_code == 'ISP'){
					
				}else{
					var myId = this.link + pcs_code+  'h_outmaker';
	    			this.madeComboIds.push(myId);
	    			itemsPartner.push({
	    				fieldLabel: pcs_name + ' 협력사',//ppo1_request,
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
				}*/
	    	}
	    }
    	

    	switch(vCompanyReserved4){
    	
	    	case 'SHNH01KR':
	    		
	    		itemsPartner.push({
	    			fieldLabel: '도장착수일',
	    			xtype: 'datefield',
	    			anchor: '100%',
	    			name: 'reserved_timestamp3',
	    			format: 'Y-m-d',
	    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	    		});
		    	
	    		itemsPartner.push({
					fieldLabel: '완료요청일',
					xtype: 'datefield',
					anchor: '100%',
					name: 'reserved_timestamp5',
					format: 'Y-m-d',
			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
				});
	    	
		    	itemsPartner.push(
					{
						fieldLabel: '검사예정일',
						xtype: 'datefield',
						anchor: '100%',
						name: 'reserved_timestamp4',
						format: 'Y-m-d',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
					});
	    	break;
    	default:
    		itemsPartner.push({
				fieldLabel: '완료요청일',
				xtype: 'datefield',
				anchor: '100%',
				name: 'reserved_timestamp4',
				format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			});

    	}
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
	            items : itemsPartner
	            /*items: [{
          		xtype: 'fieldLabel',
          		value : ''
	            	},
	            	{
	            		xtype: 'fieldset',
	                    title: 'Information',
	                    defaultType: 'textfield',
	                    boder : true,
	                    defaults: {
	                        width: 280
	                    },
	                    items: [
							{
								fieldLabel: '도장협력사',//ppo1_request,
							 	xtype: 'combo',
								anchor: '100%',
								id:   'h_outmaker',
								name: 'h_outmaker',
								mode: 'local',
								displayField:   'dept_name',
								store: Ext.create('Mplm.store.DeptStore'),
								sortInfo: { field: 'create_date', direction: 'DESC' },
								valueField : 'unique_id',
			            	    typeAhead: false,
			            	    minChars: 1,
			            	    listConfig:{
			            			loadingText: '검색중...',
			            	        emptyText: '일치하는 항목 없음.',
			            	      	getInnerTpl: function(){
			            	      		return '<div data-qtip="{unique_id}">{dept_code}|{dept_name}</div>';
			            	      	}
			            		},
			            		listeners: {
			            	           select: function (combo, record) {
			            	           	
			            	           }
			            	      }
							},{
								fieldLabel: '도장검사예정일',
								xtype: 'datefield',
								anchor: '100%',
								id: 'reserved_timestampa',
								name: 'reserved_timestampa',
								format: 'Y-m-d',
						    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
						    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
							},
							{
								fieldLabel: '도장완료일',
								xtype: 'datefield',
								anchor: '100%',
								id: 'end_date',
								name: 'end_date',
								format: 'Y-m-d',
						    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
						    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
							},{
								fieldLabel: '긴급여부',//ppo1_request,
							 	xtype: 'combo',
								anchor: '100%',
								id:   'recv_flagname',
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
			            	      		return '<div data-qtip="{unique_id}">{system_code}|{code_name_kr}</div>';
			            	      	}
			            		},
			            		listeners: {
			            	           select: function (combo, record) {
			            	        	   var reccode = record.get('system_code');
			            	        	   Ext.getCmp('recv_flag').setValue(reccode);
			            	           }
			            	      }
							},
							{
								xtype: 'hiddenfield',
								id :'recv_flag',
								name : 'recv_flag',
								value : 'GE'
								
							}
	                    ]
	            	},
		          
		            ]//item end..
			*/
	                    });//Panel end...
			//myHeight = 320;
			myWidth = 400;
			
			prwin = gMain.selPanel.prwinopen(form);
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: gm.getMC('CMD_Job_Confirm', '작업지시'),
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
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
                    	var cartmaparr = gMain.selPanel.cartmap_uids;
                    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                    	//var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
                    	var rtgastUid = gMain.selPanel.vSELECTED_RTGAST_UID
                    	
                    	var selections = gm.me().grid.getSelectionModel().getSelection();
                    	var rtgastUids =[];
                    	var ac_uids =[];
                    	
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		console_logs('rec', rec);
                    		
                    		var uid =  rec.get('unique_id');  //rtgast_uid
                    		rtgastUids.push(uid);
                    		
                    		var ac_uid = rec.get('coord_key3');   //프로젝트 uid
                    		ac_uids.push(ac_uid);
                    	}
                    	
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3: 'PNT',
                                				rtgastUid: rtgastUid,
                                				
                                				ac_uids: ac_uids,
                                				rtgastUids: rtgastUids
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
                                				gMain.selPanel.store.load(function(){});
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
	  prWin.show();
    },
    madeComboIds: []
 
});