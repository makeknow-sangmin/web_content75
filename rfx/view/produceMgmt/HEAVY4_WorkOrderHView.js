Ext.define('Rfx.view.produceMgmt.HEAVY4_WorkOrderHView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'workorder-h-view',
   
    initComponent: function(){
    	
    	switch(vCompanyReserved4){
        /*case 'SHNH01KR' :
        	this.potype = 'PRD'
            break;*/
        case 'PNL01KR' :
        	this.potype = 'WLD'
            break;
        default :
        	this.potype = 'PRD'
        	break;

        }
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
       	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
    		//진행상태 검색툴바
		this.addSearchField (
				{		 
						field_id: 'state'
						,store: "DDStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	

				this.addSearchField (
						{
							type: 'combo'
							,field_id: 'lot_no'
							,store: "RtgastPonoStore"
							,displayField: 'lot_no'
							,valueField: 'lot_no'
							,innerTpl	:'<div data-qtip="{lot_no}">{lot_no}</div>'
						});

		/*this.addSearchField (
				{
						field_id: 'pm_name'
						,store: "UserDeptStoreOnly"
	    			    ,displayField:   'user_name'
	    			    ,valueField:   'unique_id'
	    			    ,value: vCUR_USER_UID
						,innerTpl	: '<div data-qtip="{unique_id}">[{dept_name}] {user_name}</div>'
						,params:{dept_code: '02'}
				});	*/
		//this.addSearchField ('lot_no');	
		
		this.addSearchField('buyer_pj_code');
		
//		this.addSearchField('emergency');
		
		this.addSearchField (
				{
						field_id: 'emergency'
						,store: "HeavyEmergency"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	


		this.addSearchField('unique_id');
		
        
        
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
       /* (buttonToolbar.items).each(function(item,index,length){
        	if(index==1) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); */     
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        });
        
        //콘솔 로그
        //console_logs('this.fields', this.fields);
        //모델 정의
        /*this.createStore('Rfx.model.HEAVY4WorkOrder', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSizepageSize
        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	//Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'rtgast.creator',
        	unique_id: 'rtgast.unique_id'
        }
    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['rtgast']
        );*/
        
        switch(vCompanyReserved4){
        case "DDNG01KR":
        case "CHNG01KR":
        case "SHNH01KR":
        case "DOOS01KR":
        	 this.createStoreSimple({
         		modelClass: 'Rfx.model.HEAVY4WorkOrder',
     	        pageSize: 100,//gMain.pageSize,
     	        sorters: [{
     	        	property: 'rtgast.creator',
     	            direction: 'DESC'
     	        }]
     	        
     	    }, {
     	    	groupField: 'buyer_name'
         });
        	break;
  default:
        	this.createStore('Rfx.model.HEAVY4WorkOrder', [{
                property: 'po_no',
                direction: 'DESC'
            }],
            gMain.pageSizepageSize
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
        	break;
        }


        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
for(var i=0; i< this.columns.length; i++) {
        	
        	var o = this.columns[i];
        	console_logs('this.columns' + i, o);
        	
        	var dataIndex = o['dataIndex'];
        	
        	switch(dataIndex) {
        	case 'mass':
        	case 'reserved_double4':
        		o['summaryType'] = 'sum';
        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                	value = Ext.util.Format.number(value, '0,00.000/i');
                	
                	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
                	return value;
                };
        		break;
        	case 'reserved_double2':
        	case 'reserved_double3':
        	case 'item_quan':
        	case 'bm_quan':
        		o['summaryType'] = 'sum';
        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;"> 합계: '+value +'</font></div>'
                	return value;
                };
        		break;
        	/*case 'lot_no':
        		o['summaryType'] = 'count';
        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                	value = '<div align="center" style="font: bold 2.0em/1.0em 맑은고딕;"><font style="font-size:15pt; color:blue;">'+value+'건</font></div>'
                	return value;
                };
        		break;*/
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
        for(var i=0; i< this.columns.length; i++) {
        	var o = this.columns[i];
        	console_logs('this.columns' + i, o);
        }
        
		var option = {
				features: [{
		            id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name} :: </font><font color=#FF0040>({rows.length} 건)</font></div>',
		            hideGroupedHeader: true,
		            enableGroupingMenu: false
		        }]
				
		};
        
  
	        
        
        switch(vCompanyReserved4){
        case "DDNG01KR":
        case "SHNH01KR":
        	this.createGridCore(arr, option);
        	break;
        default:
        	this.createGrid(searchToolbar, buttonToolbar);
        break;
        }
        
        if(vCompanyReserved4 == 'DDNG01KR'){
        	this.editAction.setText('소그룹보기');
        }else{
        	this.editAction.setText('상세보기');
        }
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
        
        //작업완료 Action 생성
        this.finishWorkOrder = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '작업완료',
			 tooltip: '작업완료 확정',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatWorkFinish();
				 
			 }
		});
      
        
       
        this.printPdfActions = [];
        
		var hyundai_pcs = gUtil.mesTplProcessAll['HPRD'];
	    
		for(var i=0; i<hyundai_pcs.length; i++) {
    		var o = hyundai_pcs[i];
    		var pcs_code = o['code'];
    		var pcs_name = o['name'];
    		this.printPdfActions[i] = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: pcs_name,
            tooltip:pcs_name + ' 출력',
            disabled: true,
            pcs_code: pcs_code,
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
            	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;

            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pcs_code : this.pcs_code,
            			ac_uid : ac_uid,
            			is_heavy : 'Y',	 //중공업:Y  기타:N
            			is_rotate : 'N', //가로양식:Y 세로양식:N
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
		}
		
//		
//        
//      //PDF 파일 출력기능
//        this.printPDFAction2 = Ext.create('Ext.Action',{
//            iconCls: 'af-pdf',
//            text: '조립',
//            
//            tooltip:'조립지시서 출력',
//            disabled: true,
//            
//            handler: function(widget, event) {
//            	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
//            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
//            	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
//            	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
//            	console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
//            	Ext.Ajax.request({
//            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
//            		params:{
//            			rtgast_uid : rtgast_uid,
//            			po_no : po_no,
//            			pcs_code : pcs_code,
//            			ac_uid : ac_uid,
//            			is_heavy : 'Y',	 //중공업:Y  기타:N
//            			is_rotate : 'N', //가로양식:Y 세로양식:N
//            			pdfPrint : 'pdfPrint'
//            		},
//            		reader: {
//            			pdfPath: 'pdfPath'
//            		},
//            		success : function(result, request) {
//                	        var jsonData = Ext.JSON.decode(result.responseText);
//                	        var pdfPath = jsonData.pdfPath;
//                	        console_logs(pdfPath);      	        
//                	    	if(pdfPath.length > 0) {
//                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
//                	    		top.location.href=url;	
//                	    	}
//            		},
//            		failure: extjsUtil.failureMessage
//            	});
//            	
//            	
//            }
//        });
        //버튼 추가.
        /*buttonToolbar.insert(4, this.addWorkOrder);
        buttonToolbar.insert(4, '-');*/
        if(vCompanyReserved4 == 'SHNH01KR'){
        	buttonToolbar.insert(2, this.finishWorkOrder);
        }
       
        buttonToolbar.insert(2, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        
        
        buttonToolbar.insert(2, '-');
        
    	for(var i=0; i<this.printPdfActions.length; i++) {
    		buttonToolbar.insert(6, this.printPdfActions[i]);
    	}
    	

//        buttonToolbar.insert(8, this.printPDFAction);
//        if(vCompanyReserved4 == 'DDNG01KR'){
//        	buttonToolbar.insert(9, this.printPDFAction2);	
//        }
//        
        buttonToolbar.insert(9, '-');
//        for(var j=0; j<this.printPdfActions.length; j++) {
//    		buttonToolbar.insert(8, this.printPdfActionsAssy[j]);
//    	}
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('coord_key3');
            	//console_logs('rec>>>>>>>>>', rec);
            	//console_logs('ac_uid>>>>>>>>>', gMain.selPanel.vSELECTED_AC_UID);
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('pj_code');
            	gMain.selPanel.addWorkOrder.enable();
            	//gMain.selPanel.addAssyWorkOrder.enable();
            	gMain.selPanel.denyWorkOrder.enable();
            	gMain.selPanel.enablePdfActions();
            	
            	//gMain.selPanel.enablePdfActionsAssy();
            	//gMain.selPanel.printPDFAction.enable();
            	//gMain.selPanel.printPDFAction2.enable();
            	gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code');
            	gMain.selPanel.vSELECTED_STATE = rec.get('state'); //product의 item_code
            	
            	if(gMain.selPanel.vSELECTED_STATE == 'P'){
            		
            		//gMain.selpanel.addAssyWorkOrder.enable();
            		//gMain.selPanel.addWorkOrder.enable();
            		//gMain.selPanel.denyWorkOrder.enable();
            		
            		gMain.selPanel.disablePdfActions();
            		//gMain.selPanel.disablePdfActionsAssy();
            		//gMain.selPanel.printPDFAction.disable();
            		//gMain.selPanel.printPDFAction2.disable();
            		
            	}else{
            		
            		
            		gMain.selPanel.addWorkOrder.disable();
            		
            		//gMain.selPanel.addAssyWorkOrder.disable();
            		gMain.selPanel.denyWorkOrder.disable();
            		//gMain.selPanel.addAssyWorkOrder.enable();
            		
            		//gMain.selPanel.finishWorkOrder.disable();
            		//gMain.selpanel.addAssyWorkOrder.disable();  
            		
            		//gMain.selPanel.printPDFAction.enable();
            		//gMain.selPanel.printPDFAction2.enable();
            		//gMain.selPanel.enablePdfActions();
            	}
            	this.workOrderGrid.getStore().getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);
            	switch(vCompanyReserved4){
            	case "DDNG01KR" :
            		this.workOrderGrid.getStore().getProxy().setExtraParam('pcs_code', "TRAY");
            		
            	break;
            	case "SHNH01KR" :
            		this.workOrderGrid.getStore().getProxy().setExtraParam('pcs_code', "PRD");
            		
            		break;
            	default :
            		this.workOrderGrid.getStore().getProxy().setExtraParam('pcs_code', "");
            	break;
            	}
            	this.workOrderGrid.getStore().load();
            	//gMain.selPanel.workListStore.load();
            	/*var fileGrid = Ext.getCmp(id);
        		fileGrid.getStore().getProxy().setExtraParam('unique_id', targetUid);*/
            	//gMain.selPanel.workOrderGrid.getStore().load();
            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.addWorkOrder.disable();
            	//gMain.selPanel.addAssyWorkOrder.disable();
            	gMain.selPanel.denyWorkOrder.disable();
            	gMain.selPanel.disablePdfActions();
            	//gMain.selPanel.disablePdfActionsAssy();
            	gMain.selPanel.finishWorkOrder.disable();
            	//gMain.selPanel.finishAssyWorkOrder.disable();
            	//gMain.selPanel.printPDFAction.disable();
            	
            }
        	
        })

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        //작업 그룹 목록 그리드탭
        
        // 소그룹 PDF 출력은 대동에서만 사용
        var printpdf_min = null;
        if(vCompanyReserved4 == 'DDNG01KR'){
        	console_logs('min-pdf');
         printpdf_min = Ext.create('Ext.Action', {
			 iconCls: 'af-pdf',
			 text: '소그룹PDF',
			 tooltip: 'purchase order requestion',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.pdfprintHandler
			});
        }else{
        	//console_logs('min-pdf=null');
        	printpdf_min = null;
        }
        
        // 소그룹 추가 버튼
        var addMinPo = null;
        if(vCompanyReserved4 == 'DDNG01KR'){
        	console_logs('min-pdf');
        	addMinPo = Ext.create('Ext.Action', {
			 iconCls: 'af-plus-circle',
			 text: '소그룹추가',
			 tooltip: '소그룹 추가 하기',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.addMinPoHandler
			});
        }else{
        	//console_logs('min-pdf=null');
        	addMinPo = null;
        }
        
        this.addTabworkOrderGridPanel('소그룹', 'EPC5_SUB', {  
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			model: 'Rfx.store.HeavyWorkListStore',
	        dockedItems: [
		     
		        {
		            dock: 'top',
		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
		            cls: 'my-x-toolbar-default3',
		            items: [
		                    printpdf_min,
		                    '-',
		 	   		    	addMinPo
		                    ]
			        }
		        ],
				sorters: [{
		           property: 'serial_no',
		           direction: 'ASC'
		       }]
		}, 
		function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
            	gMain.selPanel.selectPcsRecord = rec;
            	gMain.selPanel.selectSpecification = rec.get('specification');
            	gMain.selPanel.parent = rec.get('parent');
            	
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
		if(vCompanyReserved4=='DDNG01KR'){
			this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000259');
		}
        this.store.load();
    },
        


   

    selectPcsRecord: null,

        
 
    
   
  
    items : [],

    potype : 'PRD',

    potype: '',

    
    addTabworkOrderGridPanel: function(title, menuCode, arg, fc, id) {

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
		
		// 대동에서 아래 부분에서 에러남
		/*var model = Ext.create(modelClass, {
        	fields: fields
        });*/
		
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
		//console_logs('cellEditing>>>>>>>>>>', cellEditing); 
		gMain.selPanel.workListStore = Ext.create('Rfx.store.HeavyWorkListStore');
		 //console_logs('workListStore>>>>>>>>>>');
		 gMain.selPanel.workListStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);
		//console_logs('rtgastuid >>>>>>>>>>>>>>>', gMain.selPanel.vSELECTED_RTGAST_UID);
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
            //layout          :'fit',
            //forceFit: true,
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
        	    	 
        	    	 gMain.selPanel.downListRecord(record);
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

    	//다수협력사지정
    	var itemsPartner = [];
    	
    		var hyundai_pcs = gUtil.mesTplProcessAll['HPRD'];
    
    		for(var i=0; i<hyundai_pcs.length; i++) {
        		var o = hyundai_pcs[i];
        		var pcs_code = o['code'];
        		var pcs_name = o['name'];
        		console_logs('itemspartner',o);
        		var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});
        		

        			var myId = this.link + pcs_code+  'h_outmaker';
        			this.madeComboIds.push(myId);
        			itemsPartner.push(
        					
        					{
        	                    xtype: 'container',
        	                    layout: 'hbox',
        	                    defaultType: 'numberfield',
        	                    margin: '0 0 5 0',
        	                    items: [
        					
        					
        				{
	        				fieldLabel: pcs_name,//ppo1_request,
	        			 	xtype: 'combo',
	        			 	flex: 1,
	        				name: pcs_code+  'h_outmaker',
	        				id: myId,
	        				mode: 'local',
	        				displayField:   'dept_name',
	        				store: aStore,
	        				sortInfo: { field: 'create_date', direction: 'DESC' },
	        				valueField : 'dept_code',
	                	    typeAhead: false,
	                	    minChars: 1,
	                	    margin: '0 5 0 0',
	                	    listConfig:{
	                			loadingText: '검색중...',
	                	        emptyText: '일치하는 항목 없음.',
	                	      	getInnerTpl: function(){
	                	      		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
	                	      	}
	                		}				
	        			},
	        			{
	        				emptyText: '중량',
	                        name: pcs_code+  'h_weight',
	                        id: this.link + pcs_code+  'h_weight',
	                        width: 80,
	                        margin: '0 5 0 0',
	                        allowBlank: false,
	                        listeners: {
	                        	change : function (f, e){
	                        		console_logs('f.id', f.id);
	                        		console_logs('e', e);
	                        		
	                        		var h_weight = f.id;//EPJ1_DD1TRAYh_weight
	                        		//console_logs('h_weight', h_weight);
	                        		var h_price = f.id.replace('h_weight', 'h_price');
	                        		//console_logs('h_price', h_price);
	                        		var h_total = f.id.replace('h_weight', 'h_total');
	                        		//console_logs('h_total', h_total);
	                        		
	                        		var s_price = Ext.getCmp(h_price).getValue();
	                        		var v_price = s_price==''?0 : Number(s_price);
	                        		var total = v_price*e;
	                        		
	                        		Ext.getCmp(h_total).setValue(total+'');
	                        		
	                        	}
	                        }
	                    },
	        			{
	                    	emptyText: '단가',
	                        name: pcs_code+  'h_price',
	                        id: this.link + pcs_code+  'h_price',
	                        width: 80,
	                        minValue:0,
	                        margin: '0 5 0 0',
	                        allowBlank: false,
	                        listeners: {
	                        	change : function (f, e){
	                        		console_logs('f.id', f.id);
	                        		console_logs('e', e);
	                        		
	                        		var h_price = f.id;
	                        		//console_logs('h_price', h_price);
	                        		var h_weight = f.id.replace('h_price', 'h_weight');
	                        		//console_logs('h_weight', h_weight);
	                        		var h_total = f.id.replace('h_price', 'h_total');
	                        		//console_logs('h_total', h_total);
	                        		
	                        		var h_weight = Ext.getCmp(h_weight).getValue();
	                        		var v_price = h_weight==''?0 : Number(h_weight);
	                        		var total = v_price*e;
	                        		
	                        		Ext.getCmp(h_total).setValue(total+'');
	                        		
	                        	}
	                        }
	                    },
	        			{
	                        name: pcs_code+  'h_total',
	                        id: this.link + pcs_code+  'h_total',
	                        width: 80,
	                        minValue:0,
	                        emptyText: '가격',
	                        readOnly : true,
	                        xtype: 'numberfield',
	                        fieldStyle: 'background-color: #F0F0F0; background-image: none;text-align:right;',
	                        allowBlank: false
	                    }
        				
        				
        				
        				]
        					});

    		
    			
        	}//endoffor
    	
    		itemsPartner.push({
    			fieldLabel: '제작검사예정일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestampa',
    			format: 'Y-m-d',
    			value: new Date(),
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},
    		{
    			fieldLabel: '제작완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			value: new Date(),
    			name: 'reserved_timestamp1',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},{
    			fieldLabel: '조립완료요청일',
    			xtype: 'datefield',
    			anchor: '100%',
    			value: new Date(),
    			name: 'reserved_timestamp3',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},{
    			fieldLabel: '조립완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			value: new Date(),
    			id: 'reserved_timestamp4',
    			name: 'reserved_timestamp4',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		});

    	
    		
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
    	
    	
    	var form = Ext.create('Ext.form.Panel', {
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
	            items: [/*{
          		xtype: 'fieldLabel',
          		value : ''
	            	},*/
	            	{
	            		xtype: 'fieldset',
	                    title: '작업지시내용',
	                    defaultType: 'textfield',
	                    /*boder : true,
	                    defaults: {
	                        width: 280
	                    },*/
	                    items: itemsPartner
	            	},
		          
		            ]//item end..
			
	                    });//Panel end...
			myHeight = 460;
			myWidth = 520;
			prwin = gMain.selPanel.prwinopen(form);
    },
    
    
//    	
//    	
//    	var form = Ext.create('Ext.form.Panel', {
//	    		id: gu.id('formPanel'),
//	    		xtype: 'form',
//	    		frame: false ,
//	    		border: false,
//	    		bodyPadding: '3 3 0',
//	    		region: 'center',
//	            fieldDefaults: {
//	                labelAlign: 'right',
//	                msgTarget: 'side'
//	            },
//	            defaults: {
//	                anchor: '100%',
//	                labelWidth: 60,
//	                margins: 10,
//	            },
//	            items: [/*{
//          		xtype: 'fieldLabel',
//          		value : ''
//	            	},*/
//	            	{
//	            		xtype: 'fieldset',
//	                    title: '조립지시내용',
//	                    defaultType: 'textfield',
//	                    /*boder : true,
//	                    defaults: {
//	                        width: 280
//	                    },*/
//	                    items: itemsPartner
//	            	},
//		          
//		            ]//item end..
//			
//	                    });//Panel end...
//			myHeight = 460;
//			myWidth = 520;
//			
//			
//			prwin = gMain.selPanel.prwinopenAssy(form);
//    },
//    
    
  //////  
    
    
    
    pdfprintHandler : function(){
    	
      	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
    	var po_no = gMain.selPanel.vSELECTED_PO_NO;
    	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
//    	Ext.Msg.alert('저장', pcs_code, function() {});
//    	console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printWo',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pcs_code : pcs_code,
    			ac_uid : ac_uid,
    			is_heavy : 'Y',	 //중공업:Y  기타:N
    			is_rotate : 'N', //가로양식:Y 세로양식:N
    			specification : gMain.selPanel.selectSpecification,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {
    			Ext.Msg.alert('저장', pcs_code, function() {});
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
  
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: gm.getMC('CMD_Job_Confirm', '작업지시'),
        width: myWidth,
        height: myHeight,	
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
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3: 'PRD',
                                				rtgastUid: rtgastUid,
                                				
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
    	console_logs('start');
  	  prWin.show(
  		  undefined, function(){

    })
    
    console_logs('start');
  	  prWin.show(
  		  undefined, function(){
  			  var arr = gMain.selPanel.madeComboIds;
  			  for(var i=0; i<arr.length; i++) {
  				  var comboId = arr[i];
  				  console_logs('comboId', comboId);
  				  Ext.getCmp(comboId).store.load(function(records) {			
          					if(records!=null && records.length>0) {
          						var rec = records[0];
          						var mycomboId = gMain.selPanel.link + rec.get('pcs_code')+  'h_outmaker';
          						console_logs('record', records[0]);
      			            	Ext.getCmp(mycomboId).select(records[0]);         						
          					}
  			        });  
  			  }
  		    }
  		);
  	  console_logs('end');
    
    },


    //소그룹 리스트 보기
downListRecord: function(record) {
    	
    	this.selectedReckRecord = record;
    	console_logs('record', record);
    	
    	var parent = record.get("parent");
    	
		gMain.extFieldColumnStore.load({
		    //params: { 	menuCode: 'SRO5_DDG'  },
			params: { 	menuCode: 'EPC5'  },
		    callback: function(records, operation, success) {
		    	if(success ==true) {
		    		
		    		console_logs('SRO5_DDG records', records);
		    		
		    		var myRecords = [];
		    		for(var i=0;i<records.length; i++) {
		    			var o1 = records[i];
		    			switch(o1.get('dataIndex')) {
		    			case 'stock_pos':
		    			case 'alter_reason':
		    				break;
		    				default:
		    					myRecords.push(o1);
		    			}

		    		}
		    		
		    		var o = gMain.parseGridRecord(myRecords, 'stockRackEdit');		
		    		console_logs('ooooo', o);
		    		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		    		
		        	//var unassignedPalletStore = Ext.create('Rfx.store.UnassignedPalletStore', {});
		    		
		            var assyListModel = Ext.create('Rfx.model.assyListStock', {
		            	fields: fields
		            });
		            
		        	 this.downListStore = new Ext.data.Store({  
		    			pageSize: 100,
		    			model: assyListModel,
		    		    sortOnLoad: true,
		    		    remoteSort: true,
		    			listeners: {
		    				
		    				beforeload: function(store, operation, eOpts){

		    				},
		    				//Store의 Load 이벤트 콜백
		    				load: function(store, records, successful,operation, options) {
		    					
		    					

		    				}
		    			}
		    		});
		        	 console_logs('downListStore 후', this.downListStore);
		        	
		        	
//		            this.unassignedPalletStore.load(function(records){
//		          	   console_logs('unassignedPalletStore', records);
//		          	   
//		             });
		        	 
		        	 this.downListStore.proxy.setExtraParam('parent', gMain.selPanel.parent);
		        	this.downListStore.load(function(records, operation, success) {
		        		
		        	//	console_logs('unassignedPalletStore.load records', records);
		    	        var downListGrid = Ext.create('Ext.grid.Panel', {
		    	            layout: 'fit',
		    	            forceFit: true,
		    		        store: gMain.selPanel.downListStore,
		    		        height: '200', 
		    		        border: true,
		    		        autoScroll : true,
		    			    autoHeight: true,
		    		        columns: columns,
		    		        collapsible: false,
		    		        viewConfig: {
		    		            stripeRows: true,
		    		            enableTextSelection: false
		    		        }
		    		    });
		    	    	
		    	    	
		    	    	var win = Ext.create('ModalWindow', {
		    	            title: '자재리스트',
		    	            layout: 'fit',
		    	            forceFit: true,
		    	            width: 1200,
		    	            height: 400,
		    	            layout: 'absolute',
		    	            autoScroll : true,
		    	            plain:true,
		    	            tbar: [
                          
		                    ],
		    	            items: [downListGrid],
		    	            buttons: [{
		    	                text: CMD_OK,
		    	                handler: function(){
		    	            		if(win) {
		    	            			win.close();
		    	            		}
		    	            		win = null;
		    	                  }
		    	            }]
		    	        });
		    	    	win.show();	 
		        	
		        	});
		        	
		        	
		    		
		    		
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
    madeComboIds: [],
    treatWorkFinish: function(){
    	var rtgast_uids = [];
    	var selections = this.grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var uid =  rec.get('unique_id');
    		rtgast_uids.push(uid);
    	}
	 Ext.Ajax.request({
    		url: CONTEXT_PATH + '/index/process.do?method=finishWorkOrderHeavy',
    		params:{
    			rtgastUids : rtgast_uids
    			   		},
    		reader: { 		},
    		success : function(result, request) {
    			gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
        	        
    		},
    		failure: extjsUtil.failureMessage
	    });
    },
    
    
    
    
    addMinPoHandler : function(){
    	
		gMain.extFieldColumnStore.load({
		    //params: { 	menuCode: 'SRO5_DDG'  },
			params: { 	menuCode: 'EPC5'  },
		    callback: function(records, operation, success) {
		    	if(success ==true) {
		    		
		    		var myRecords = [];
		    		for(var i=0;i<records.length; i++) {
		    			var o1 = records[i];
		    			switch(o1.get('dataIndex')) {
		    			case 'stock_pos':
		    			case 'alter_reason':
		    				break;
		    				default:
		    					myRecords.push(o1);
		    			}

		    		}
		    		
		    		var o = gMain.parseGridRecord(myRecords, 'ADDMINPO');		
		    		console_logs('ooooo', o);
		    		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		    		
		        	//var unassignedPalletStore = Ext.create('Rfx.store.UnassignedPalletStore', {});
		    		
		            var minPoListModel = Ext.create('Rfx.model.HEAVY4ProducePlan', {
		            	fields: fields
		            });
		            
		        	var addMinPoListStore = new Ext.data.Store({  
		    			pageSize: 100,
		    			model: minPoListModel,
		    		    sortOnLoad: true,
		    		    remoteSort: true,
		    			listeners: {
		    				
		    				beforeload: function(store, operation, eOpts){

		    				},
		    				//Store의 Load 이벤트 콜백
		    				load: function(store, records, successful,operation, options) {
		    					
		    					

		    				}
		    			}
		    		});
		        	 console_logs('addMinPoListStore 후', addMinPoListStore);
		        	
		        	
//		            this.unassignedPalletStore.load(function(records){
//		          	   console_logs('unassignedPalletStore', records);
//		          	   
//		             });
		        	 
		        	 addMinPoListStore.proxy.setExtraParam('parent', gMain.selPanel.parent);
		        	 addMinPoListStore.proxy.setExtraParam('reserved_varchar3', 'PRD');
		        	 addMinPoListStore.load(function(records, operation, success) {
		        		var minPoSelModel = Ext.create("Ext.selection.CheckboxModel", {} );
		        		console_logs('addMinPoListStore>>>>>>>>', records);
		    	        var addMinPoListGrid = Ext.create('Ext.grid.Panel', {
		    	            layout: 'fit',
		    	            forceFit: true,
		    		        store: addMinPoListStore,  
		    		        height: '200', 
		    		        border: true,
		    		        selModel: minPoSelModel,
		    		        autoScroll : true,
		    			    autoHeight: true,
		    		        columns: columns,
		    		        collapsible: false,
		    		        viewConfig: {
		    		            stripeRows: true,
		    		            enableTextSelection: false
		    		        }
		    		    });
		    	        
		    	        addMinPoListGrid.getSelectionModel().on({
		    	        	selectionchange: function(sm, selections) {
		    	        		console_logs('selections>>>>>', selections);
		    	        		gMain.selPanel.cartmaparr = [];
		    	        		gMain.selPanel.po_quan = 0;
		    	        		gMain.selPanel.reserved_double4 = 0;
		    	        		
		    	        		for(var i=0; i< selections.length; i++) {
		    	            		var rec = selections[i];
		    	            		var uid =  rec.get('unique_uid');  //CARTMAP unique_id
		    	            		gMain.selPanel.cartmaparr.push(uid);
		    	            		
		    	            		var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
		    	            		
		    	            		console_logs('unit 수량', po_quan_unit);
		    	            		gMain.selPanel.po_quan = gMain.selPanel.po_quan + po_quan_unit;
		    	            		console_logs('po_quan 수량', gMain.selPanel.po_quan);
		    	            		var tmp_weight = rec.get('mass');   //  소그룹 po 중량
		    	            		gMain.selPanel.reserved_double4 = gMain.selPanel.reserved_double4 + tmp_weight;
		    	            		console_logs('중량', gMain.selPanel.reserved_double4);
		    	            		
		    	            	}
		    	        		
		    	        		console_logs('cartmaparr>>>>>', gMain.selPanel.cartmaparr);
		    	        	}
		    	        });
		    	        
		    	        
		    	    	var win = Ext.create('ModalWindow', {
		    	            title: '소그룹리스트',
		    	            layout: 'fit',
		    	            forceFit: true,
		    	            width: 1200,
		    	            height: 400,
		    	            layout: 'absolute',
		    	            autoScroll : true,
		    	            plain:true,
		    	            tbar: [
		    	                   /*{
		    	                	   xtype:'button',
                                       text: '추가',
                                       style: 'margin-left: 3px;',
                                       width: 50,
                                       handler: function(){
                                    	   gMain.selPanel.addMinPoAction();
                                       }
		    	                   }*/
		                    ],
		    	            items: [addMinPoListGrid],
		    	            buttons: [{
		    	                text: CMD_OK,
		    	                handler: function(){
		    	            		if(win) {
		    	            			if(gMain.selPanel.cartmaparr == undefined){
		    	            				win.close();
		    	            			}else{
		    	            				gMain.selPanel.addMinPoAction();
			    	            			win.close();
		    	            			}
		    	            			
		    	            			
		    	            		}
		    	            		win = null;
		    	                  }
		    	            }]
		    	        });
		    	    	win.show();	 
		        	
		        	});
		        	
		        	
		    		
		    		
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
    disablePdfActions: function() {
    	for(var i=0; i<this.printPdfActions.length; i++) {
    		this.printPdfActions[i].disable();
    	}
    },
    enablePdfActions: function() {
    	for(var i=0; i<this.printPdfActions.length; i++) {
    		this.printPdfActions[i].enable();
    	}
    },
//  
    addMinPoAction: function(selections){
    	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
    	var po_no = gMain.selPanel.vSELECTED_PO_NO;
    	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
    	//var cartmaparr = [];
    	
    	
    	
    	
    	
    	console_logs('cartmaparr>>>>>>>>>>', gMain.selPanel.cartmaparr);
    	console_logs('cartmaparr>>>>>>>>>>', gMain.selPanel.po_quan);
    	console_logs('cartmaparr>>>>>>>>>>', gMain.selPanel.reserved_double4);
    	
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/index/process.do?method=addMinPoAction',
			 params:{
				 rtgastuid : rtgast_uid,
				 cartmaparr : gMain.selPanel.cartmaparr,
				 po_quan : gMain.selPanel.po_quan,
				 reserved_double4 : gMain.selPanel.reserved_double4
			 		},
			success : function(response, request) {
				Ext.Msg.alert('안내', '소그룹 추가 완료', function() {
					gMain.selPanel.workOrderGrid.getStore().load();
        			console_logs('gMain.selPanel_grid', gMain.selPanel.workOrderGrid);
				});
				console_logs('소그룹추가성공');
			},
			failure: function(val, action){
 				 alert('ajax실패');
   			}
    	})  // end of ajax
    }
 
});