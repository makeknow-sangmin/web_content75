Ext.define('Rfx.view.produceMgmt.HEAVY4_WorkOrderViewCHNG', {
    extend: 'Rfx.base.BaseView',
    xtype: 'workorderCHNG-view',
   
    initComponent: function(){
    	
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	gUtil.setDistinctFilters(this.link, ['pj_name', 'specification', 'pj_code']);

    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
       	//검색툴바 필드 초기화
    	this.initSearchField();
    	var useMultitoolbar = false;
    	
    	//검색툴바 추가
    		//진행상태 검색툴바
				this.addSearchField({
					type: 'distinct',
					width: 140,
					tableName: 'rtgast', 
					field_id: 'state',       
					fieldName: 'state'
					
				});
				this.addSearchField({
					type: 'distinct',
					width: 140,
					tableName: 'rtgast', 
					field_id: 'lot_no',       
					fieldName: 'po_no'
					
				});
				this.addSearchField({
					type: 'distinct',
					width: 140,
					tableName: 'rtgast', 
					field_id: 'reserved_varchar2',       
					fieldName: 'reserved_varchar2'
				});
				this.addSearchField (
						{
								field_id: 'emergency'
								,store: "HeavyEmergency"
								,displayField: 'codeName'
								,valueField: 'systemCode'
								,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
						});	


		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        });
        
        
        switch(vCompanyReserved4){
       
        case "DDNG01KR":
        case "SHNH01KR":
        case "DOOS01KR":
        	 this.createStoreSimple({
         		modelClass: 'Rfx.model.HEAVY4WorkOrder',
//     	        pageSize: 300,//gMain.pageSize,
     	        sorters: [{
     	        	property: 'rtgast.creator',
     	            direction: 'DESC'
     	        }]
     	        
     	    }, {
     	    	groupField: 'buyer_name'
         });
        	break;
        case "CHNG01KR":
        	 this.createStoreSimple({
          		modelClass: 'Rfx.model.HEAVY4WorkOrder_CHNS',
//      	        pageSize: 300,//gMain.pageSize,
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
//        arr.push(searchToolbar);
        
        //검색툴바 생성
    	if(	useMultitoolbar == true ) {
    		var multiToolbar =  this.createMultiSearchToolbar({first:7, length:8});
    		console_logs('multiToolbar>>>>>>>>>>>>>>', multiToolbar);
            for(var i=0; i<multiToolbar.length; i++) {
        		arr.push(multiToolbar[i]);
            }
    	} else {
    		 console_logs('arr>>>>>>>>>>>>>>>>>>', arr);
    		var searchToolbar =  this.createSearchToolbar();
    		arr.push(searchToolbar);
    	}
    	
this.setRowClass(function(record, index) {
        	
        	// console_logs('record', record);
            var c = record.get('state');
            // console_logs('c', c);
            switch(c) {
                case 'P':
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
        		default:
        		break;
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
        
       	this.createGrid(searchToolbar, buttonToolbar);

    	this.editAction.setText('상세보기');
    	
    	this.setEditPanelTitle('상세보기');
        
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
        
        var textname = "";

        	textname = 'PDF';

    		is_rotate = 'N';
   
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            /*text: '제작',*/
            text: textname,
            tooltip:'작업 지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
            	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
            	var menu_code = 'EPJ1_CHNG';
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pcs_code : pcs_code,
            			menu_code : menu_code,
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
        
      //PDF 파일 출력기능
        this.printPDFAction2 = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '조립',
            
            tooltip:'조립지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
            	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
            	var menu_code = 'EPJ1_CHNG';
            	console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pcs_code : pcs_code,
            			menu_code:menu_code,
            			ac_uid : ac_uid,
            			is_heavy : 'Y',	 //중공업:Y  기타:N
            			is_rotate : 'N', //가로양식:Y 세로양식:N
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

        buttonToolbar.insert(2, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        buttonToolbar.insert(2, '-');
        buttonToolbar.insert(8, this.printPDFAction);
        buttonToolbar.insert(9, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
            if (selections.length) {
            	var rec = selections[0];
				var selections = this.grid.getSelectionModel().getSelection();

            	var uids=[];
            	for(var i =0; i < selections.length; i++) {
            		 var rec = selections[i];
                     var unique_uid = rec.get('unique_id');
//                     var req_flag = rec.get('req_flag');
                     uids.push(unique_uid);
                     console_logs('uids>>>>>>>>>>', uids);
            	}
            	gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('coord_key3');
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('pj_code');
            	gMain.selPanel.addWorkOrder.enable();
            	gMain.selPanel.printPDFAction.enable();
            	gMain.selPanel.printPDFAction2.enable();
            	gMain.selPanel.vSELECTED_ONE_MAKER=rec.get('one_maker');
            	gMain.selPanel.vSELECTED_PCS_CODE = rec.get('po_type');
            	gMain.selPanel.vSELECTED_REQ_FLAG = rec.get('req_flag');
            	gMain.selPanel.vSELECTED_STATE = rec.get('state'); //product의 item_code
            	
//            	uids.push(gMain.selPanel.vSELECTED_RTGAST_UID);
            	if(gMain.selPanel.vSELECTED_STATE == 'P'){
            		gMain.selPanel.addWorkOrder.enable();
            		gMain.selPanel.denyWorkOrder.enable();
            		gMain.selPanel.printPDFAction.disable();
            		gMain.selPanel.printPDFAction2.disable();
            	}else{
            		gMain.selPanel.addWorkOrder.disable();
            		gMain.selPanel.denyWorkOrder.disable();
            		gMain.selPanel.printPDFAction.enable();
            		gMain.selPanel.printPDFAction2.enable();
            		gMain.selPanel.finishWorkOrder.enable();
            	}
//            	gMain.selPanel.uids = uids;
                
            	this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', uids);
        		this.cartLineGrid.getStore().load();
            }
        	
        });

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            multiSelect : true,
            items: [this.grid,  this.crudTab]
        });
        var excelPrint = Ext.create('Ext.Action',{
        	iconCls: 'af-excel',
			 text: 'Excel',
			 tooltip: '다운로드',
  		  handler: this.printExcelHandler

        });

        this.addTabCartLineGridPanel('', 'EPC5_SUB', {
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			model: 'Rfx.store.CartLineStore',
	        dockedItems: [
		     
		        {
		            dock: 'top',
		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
		            cls: 'my-x-toolbar-default3',
		            items: [
		                    '->',
		 	   		    	excelPrint,
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
            	gMain.selPanel.parent = rec.get('parent');
            	gMain.selPanel.selectSpecification = rec.get('specification');
            	
            } else {
            	
            }
        },
        'cartLineGrid'//toolbar
	);


        
        this.callParent(arguments);
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.store.load();
    },

    selectPcsRecord: null,


    items : [],

    setEditPanelTitle: function(t) {
		//this.vEDIT_PANEL_TITLE = t;
		this.vMESSAGE['상세보기'] = t;
	},
	addTabCartLineGridPanel: function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	console_logs('records>>>>>>>>>>', records);
//		    	 setEditPanelTitle();
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

		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
		this.cartLineStore = Ext.create('Rfx.store.CartLineStore');
		this.cartLineStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);

		
		
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		this.cartLineGrid = Ext.create('Ext.grid.Panel', {
        	//id: gridId,
            store: this.cartLineStore,
            //store: store,
            title: title,
        	cls : 'rfx-panel',
        	border: true,
        	resizable: true,
        	scroll: true,
        	multiSelect: true,
            collapsible: false,
            layout          :'fit',
            forceFit: true,
            dockedItems: dockedItems,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
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
        	     cellkeydown:function (cartLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }


 	            }
        	},//endof listeners
            columns: columns
        });
		this.cartLineGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });
        var view = this.cartLineGrid.getView();
        
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function(e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);
               
            },
            up: function(e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);
             
            }
        });
        
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        
        tabPanel.add(this.cartLineGrid);
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
    	var req_flag = this.vSELECTED_RECORD.get('req_flag');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderHeavyCHNG',
			params:{
				rtgastUid: rtgastUid,
				req_flag: req_flag
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
    	    
	            			itemsPartner.push({
	            				fieldLabel:  ' 협력사',//ppo1_request,
	            			 	xtype: 'combo',
	            				anchor: '100%',
	            				name:   'one_maker',
	            				id: 'one_maker',
	            				mode: 'local',
	            				displayField:   'dept_name',
	            				store: Ext.create('Mplm.store.DeptStoreCHNG'),
	            				sortInfo: { field: 'create_date', direction: 'DESC' },
	            				valueField : 'unique_id',
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
	            			itemsPartner.push({
	            				fieldLabel:  ' 대공정',//ppo1_request,
	            			 	xtype: 'combo',
	            				anchor: '100%',
	            				name:   'auto_big_pcs_code',
	            				id: 'auto_big_pcs_code',
	            				mode: 'local',
	            				displayField:   'pcs_name',
	            				store: Ext.create('Mplm.store.BigPcsCodeStore'),
	            				sortInfo: { field: 'create_date', direction: 'DESC' },
	            				valueField : 'pcs_code',
	                    	    typeAhead: false,
	                    	    minChars: 1,
	                    	    listConfig:{
	                    			loadingText: '검색중...',
	                    	        emptyText: '일치하는 항목 없음.',
	                    	      	getInnerTpl: function(){
	                    	      		return '<div data-qtip="{unique_id}">[{pcs_code}] {pcs_name}</div>';
	                    	      	}
	                    		}
	            			});
	        			itemsPartner.push({
	                    			 fieldLabel: '검사예정일',
                                     xtype: 'datefield',
                                     anchor: '100%',
                                     name: 'reserved_timestampa',
                                     format: 'Y-m-d',
                               submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                               dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    		},{
	                    			fieldLabel: '완료일',
                                    xtype: 'datefield',
                                    anchor: '100%',
                                    name: 'reserved_timestamp1',
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
	                    			fieldLabel: '메 모',
                                    xtype: 'textarea',
                                    anchor: '100%',
                                    id:'reserved_varchar1',
                                    name: 'reserved_varchar1',
                                
	                    		}
	        			
	        			,{
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
     
        items: [
        	{
        		xtype: 'fieldset',
                title: '작업지시내용',
                defaultType: 'textfield',
                items: itemsPartner,
               
        	},	
		          
    	]
        
   
	                    });//Panel end...
			myHeight = 400;
			myWidth = 320;
			
			
			prwin = gMain.selPanel.prwinopen(form);
			
			
    	    		
    }
    	    		,
    
    pdfprintHandler : function(){
    	
      	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
    	var po_no = gMain.selPanel.vSELECTED_PO_NO;
    	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
    	console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printWo',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			big_pcs_code : pcs_code,
    			ac_uid : ac_uid,
    			is_heavy : 'Y',	 //중공업:Y  기타:N
    			is_rotate : 'Y', //가로양식:Y 세로양식:N
    			specification : gMain.selPanel.selectSpecification,
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
  
    },
    setEditPanelTitle: function(t) {
		//this.vEDIT_PANEL_TITLE = t;
		this.vMESSAGE['EDIT'] = t;
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
//                    	   	gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');
                    	var form = gu.getCmp('formPanel').getForm();
                    	var cartmaparr = gMain.selPanel.cartmap_uids;
                    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                    	var rtgastUid = gMain.selPanel.vSELECTED_RTGAST_UID;
                    	 console_logs('rtgastUid>>>>>>>>>>>>>>>', rtgastUid);
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
                           
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uids: ac_uid,
                                				//reserved_varchar3: 'PRD',
                                				rtgastUids: rtgastUid
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				//gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'auto_big_pcs_code');
                                				//gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'one_maker');
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
		},
		
		
		{
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
		        	 addMinPoListStore.proxy.setExtraParam('reserved_varchar3', '');
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
    printExcelHandler: function() {
    	
    	var store = Ext.create('Rfx.store.CartLineStore');
    	store.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);
    	console_logs('rtgastuid>>>>>', gMain.selPanel.vSELECTED_RTGAST_UID);
    	console_logs('store>>>>>', store);
    	
    	store.getProxy().setExtraParam("srch_type", 'excelPrint');
    	store.getProxy().setExtraParam("srch_fields", 'major');
    	store.getProxy().setExtraParam("srch_rows", 'all');
    	store.getProxy().setExtraParam("menuCode", gm.me().link);  
    	store.load({
    		scope: this,
    		callback: function(records, operation, success) {
    			try {
    				var count = Number(store.getProxy().getReader().rawData.count);
    				console_logs('try count>>>>>'+count);
    				if(count > 255) {
    				    Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
    				    function callBack(id) {
    				    	gm.me().excelPrintFc ();
    					}		
    				} else {
    					console_logs('else count>>>>>'+count);
//    					gm.me().excelPrintFc ();
    					var arrField = this.gSearchField;
    					try {
    						Ext.each(arrField, function(fieldObj, index) {
    							
    							var dataIndex = '';
    							
    							if(typeof fieldObj == 'string') { //text search
    								dataIndex = fieldObj;
    							} else {
    								dataIndex = fieldObj['field_id'];
    							}
    							
    							var srchId = gMain.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
    							var value = Ext.getCmp(srchId).getValue();
    							
    							if(value!=null && value!='') {
    								if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
    										store.getProxy().setExtraParam(dataIndex, value);
    								} else {
    									var enValue = Ext.JSON.encode('%' + value+ '%');
    									console_info(enValue);
    									store.getProxy().setExtraParam(dataIndex, enValue);
    								}//endofelse
    							}//endofif

    						});
    					} catch(noError){}
//    					store.load({
//    					    scope: this,
//    					    callback: function(records, operation, success) {
    					    	console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
    					    	var excelPath = store.getProxy().getReader().rawData.excelPath;
    					    	if(excelPath!=null && excelPath.length > 0) {
    					    		console_logs("excelPath>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",excelPath);
    					    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
    					    		top.location.href=url;	
    					    	} else {
    					    		alert('다운로드 경로를 찾을 수 없습니다.');
    					    	}
//    					    }
//    					});
    				}			
    			} catch(e){}
    		}
    	});
    },
    
	excelPrintFc : function () {
		
		var arrField = this.gSearchField;
		console_log("arrField>>>>>>>>>>>>>"+arrField);
		
    	var store = Ext.create('Rfx.store.CartLineStore');
    	store.getProxy().setExtraParam('rtgastuid', gMain.selPanel.uids);
    	
		try {
			Ext.each(arrField, function(fieldObj, index) {
				
				var dataIndex = '';
				
				if(typeof fieldObj == 'string') { //text search
					dataIndex = fieldObj;
				} else {
					dataIndex = fieldObj['field_id'];
				}
				
				var srchId = gMain.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
				var value = Ext.getCmp(srchId).getValue();
				
				if(value!=null && value!='') {
					if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
							store.getProxy().setExtraParam(dataIndex, value);
					} else {
						var enValue = Ext.JSON.encode('%' + value+ '%');
						console_info(enValue);
						store.getProxy().setExtraParam(dataIndex, enValue);
					}//endofelse
				}//endofif

			});
		} catch(noError){}

		
		store.load({
		    scope: this,
		    callback: function(records, operation, success) {
		    	console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
		    	var excelPath = store.getProxy().getReader().rawData.excelPath;
		    	if(excelPath!=null && excelPath.length > 0) {
		    		console_logs("excelPath>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",excelPath);
		    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
		    		top.location.href=url;	
		    	} else {
		    		alert('다운로드 경로를 찾을 수 없습니다.');
		    	}
		    }
		});
	},
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