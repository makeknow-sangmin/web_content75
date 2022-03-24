Ext.define('Rfx.view.produceMgmt.HEAVY4_WorkOrderKynlView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'workorder-kynl-view',
    selection: null,
    initComponent: function(){
    	
    	switch(vCompanyReserved4){
        case 'PNLC01KR' :
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
						field_id: 'state_name'
						,store: "DDStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{code_name_kr}">[{systemCode}]{code_name_kr}</div>'
				});
		if(vCompanyReserved4 != 'KYNL01KR') {
            this.addSearchField (
                {
                    type: 'combo'
                    ,field_id: 'lot_no'
                    ,store: "RtgastPonoStore"
                    ,displayField: 'lot_no'
                    ,valueField: 'lot_no'
                    ,innerTpl	:'<div data-qtip="{lot_no}">{lot_no}</div>'
                });
		} else {
            this.addSearchField({
                type: 'condition',
                width: 140,
                sqlName: 'heavyRtgList',
                tableName: 'rtgast',
                emptyText: '책권번호',
                field_id: 'po_no',
                fieldName: 'po_no',
                params: {
                    rtg_type: 'OD'
                }
            });
        }


		this.addSearchField('buyer_pj_code');

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
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==4||index==5||index==6) {
            	buttonToolbar.items.remove(item);        		
        	}

        });

        switch(vCompanyReserved4){
        case "DDNG01KR":
        case "CHNG01KR":
        case "SHNH01KR":
        	 this.createStoreSimple({
         		modelClass: 'Rfx.model.HEAVY4WorkOrder',
     	        pageSize: 100,//gMain.pageSize,
     	        sorters: [{
     	        	property: 'rtgast.creator',
     	            direction: 'DESC'
     	        }]
     	        
     	    }, {
     	    	groupField: 'state_name'
         });
        	break;
  default:
	  this.createStore('Rfx.model.HEAVY4WorkOrder', [{
		  property: 'rtgast.creator',
           direction: 'DESC'
       }],
       //gMain.pageSize
       gMain.pageSize  //pageSize
       , {
		  creator: 'rtgast.creator',
      	unique_id: 'rtgast.unique_id',
      	state_name: 'rtgast.state'
	  }
   	//삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
   	, ['rtgast']
       );
  	break;

        }


        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 건)</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};

        switch(vCompanyReserved4){
        case "DDNG01KR":
        case "SHNH01KR":
        //case "DOOS01KR":
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

		var deny_work_title = '작업반려';

		if(vCompanyReserved4 == 'KYNL01KR') {
            deny_work_title = '반려';
		}

        this.denyWorkOrder = Ext.create('Ext.Action', {
        	iconCls: 'af-remove',
			 text: deny_work_title,
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
		    	Ext.Ajax.request({
		 			url: CONTEXT_PATH + '/index/process.do?method=getBigPcsCodeByRtgAst',
		 			params:{
		 				rtgastUid: gMain.selPanel.vSELECTED_RTGAST_UID
		 			},
		 			success : function(result, request) { 
		 		    	datas = Ext.util.JSON.decode(result.responseText);
		 				gMain.selPanel.treatWorkStart(datas);
		 			},//endofsuccess
		 			failure: extjsUtil.failureMessage
		 		});//endofajax
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
        
      //협력사재설정 Action 생성
        this.modifyDepartment = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '수정지시',
			 tooltip: '수정 지시',
			 disabled: true,
			 handler: function() {
		    	Ext.Ajax.request({
		 			url: CONTEXT_PATH + '/index/process.do?method=getBigPcsCodeByRtgAst',
		 			params:{
		 				rtgastUid: gMain.selPanel.vSELECTED_RTGAST_UID
		 			},
		 			success : function(result, request) { 
		 		    	datas = Ext.util.JSON.decode(result.responseText);
		 				gMain.selPanel.treatModifyDepartment(datas);
		 			},//endofsuccess
		 			failure: extjsUtil.failureMessage
		 		});//endofajax
			 }
		});
        
        var textname = "";
        if(vCompanyReserved4 == 'DDNG01KR'){
        	textname = '제작';
        }else{
        	textname = 'PDF';
        }
        switch(vCompanyReserved4){
        	case 'DDNG01KR' :
        		textname = '제작';
        		is_rotate = 'N';
        	break;
        	case 'SWON01KR' :
        		textname = 'PDF';
        		is_rotate = 'Y';
        	break;
        	default : 
        		textname = 'PDF';
        		is_rotate = 'N';
        }

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            /*text: '제작',*/
            text: textname,
            tooltip:'제작지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
            	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
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
            	console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pcs_code : pcs_code,
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
        
        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
        	processes = gUtil.mesTplProcessBig;
        } else {
        }
        
        if(processes!=null) {

        	for(var i = processes.length - 1; i >= 0; i--) {
				var o = processes[i];
				var big_pcs_code = o['code'];
				if(vCompanyReserved4 == 'KYNL01KR') {
                    var title = o['name'];
				} else {
                    var title = '[' + o['code'] + ']' + o['name'];
				}
				console_logs('title', title);
				
				var action = Ext.create('Ext.Action', {
					xtype : 'button',
					text: title,
					tooltip: title + ' 공정',
					big_pcs_code: big_pcs_code,
					toggleGroup: this.link + 'bigPcsType',
					handler: function() { 	          				 
						gm.me().setBigPcsCode(this.big_pcs_code);
					}
				});
				 
				buttonToolbar.insert(4, action);
             }

             var full_process_name = '전체 대공정';

             if(vCompanyReserved4 == 'KYNL01KR') {
                 full_process_name = '전체';
			 }

             var action = Ext.create('Ext.Action', {
              	 xtype : 'button',
        			 text: full_process_name,
        			 tooltip: '전체 대공정',
        			 big_pcs_code: '',
        			 pressed: true,
        			 toggleGroup: this.link + 'bigPcsType',
        			 handler: function() {
        				 gm.me().setBigPcsCode(this.big_pcs_code);
        			 }
        		});
             
               buttonToolbar.insert(4, action);
        }
        
        
        //버튼 추가.
        /*buttonToolbar.insert(4, this.addWorkOrder);
        buttonToolbar.insert(4, '-');*/
        if(vCompanyReserved4 == 'SHNH01KR'){
        	buttonToolbar.insert(2, this.finishWorkOrder);
        }
        

        buttonToolbar.insert(2, this.printPDFAction);
        buttonToolbar.insert(2, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        buttonToolbar.insert(2, this.modifyDepartment);
        buttonToolbar.insert(2, '-');

        if(vCompanyReserved4 == 'DDNG01KR'){
        	buttonToolbar.insert(9, this.printPDFAction2);	
        }
        
        buttonToolbar.insert(9, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	gMain.selPanel.denyWorkOrder.disable();
            if (selections.length) {
            	var rec = selections[0];

           	 var submenu = '';
            	
            	switch(selections[0].get('pj_type')) {
            	case 'ST':
            		submenu = 'EPJ1_SUB1';
            		break;
            	case 'SS':
            		submenu = 'EPJ1_SUB2';
            		break;
            	case 'SP':
            		submenu = 'EPJ1_SUB3';
            		break;
            	case 'ET':
            		submenu = 'EPJ1_SUB4';
            		break;
            	default:
            		submenu = 'EPJ1_SUB1';
            	}

            	 this.addTabworkOrderGridPanel('상세정보', submenu, {  
          			pageSize: 100,
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
            	
            	gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('coord_key3');
            	console_logs('rec>>>>>>>>>', rec);
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('pj_code');
            	gMain.selPanel.printPDFAction.enable();
            	gMain.selPanel.printPDFAction2.enable();
            	gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code');
            	gMain.selPanel.vSELECTED_STATE = rec.get('state'); //product의 item_code       	

            	if(gMain.selPanel.vSELECTED_STATE == 'P'){
                	this.refreshButtons(true);
            		gMain.selPanel.denyWorkOrder.enable();
            		gMain.selPanel.printPDFAction.disable();
            		gMain.selPanel.printPDFAction2.disable();
            	} else if(gMain.selPanel.vSELECTED_STATE == 'N') {
            		this.refreshButtons(true);
            		gMain.selPanel.denyWorkOrder.enable();
            		gMain.selPanel.printPDFAction.enable();
            		gMain.selPanel.printPDFAction2.enable();
            		gMain.selPanel.finishWorkOrder.enable();		
            	} else{
					gMain.selPanel.denyWorkOrder.disable();
            		gMain.selPanel.printPDFAction.enable();
            		gMain.selPanel.printPDFAction2.enable();
            		gMain.selPanel.finishWorkOrder.enable();
            	}

            } else {
            	this.refreshButtons(false);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1
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
			 handler: this.addMinPoHandler
			});
        }else{
        	addMinPo = null;
        }

        this.callParent(arguments);

        //디폴트 로딩
        gMain.setCenterLoading(false);

        switch(vCompanyReserved4){
        
        case 'DDNG01KR':
        	this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000300');
        	break;
        case 'DOOS01KR':
        case 'KYNL01KR':
        case 'HSGC01KR':
        	this.grid.getStore().getProxy().setExtraParam('rtg_type', 'OD');
        	break;
        default:
        	this.grid.getStore().getProxy().setExtraParam('po_type', 'PRD');
        	break;
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

		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
	
		gMain.selPanel.workListStore = Ext.create('Rfx.store.HeavyWorkListStore');
	
		gMain.selPanel.workListStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_RTGAST_UID);
        gMain.selPanel.workListStore.getProxy().setExtraParam('orderBy', 'reserved_integer3');
		
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		
		var forcefitSide = true;
		
		switch(vCompanyReserved4){
		case 'KYNL01KR' :
			forcefitSide = false;
			break;
		}

        Ext.each(columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'reserved_integer3':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });

		var assymap_uid = '';
		
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
            forceFit: forcefitSide,
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
                itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
                    assymap_uid = rec.get('assymap_uid');
                },
        	     cellkeydown:function (workOrderGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }


 	            },

                edit: function(view, rec, opts) {

                    gm.editAjax('assymap', 'reserved_integer3', rec.value, 'unique_id', assymap_uid,  {type:''});

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
    	tabPanel.removeAll(false); 
        tabPanel.add(this.workOrderGrid);
        this.workListStore.load();
	},
    
    
    addWorkOrderFc: function() {

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

    	switch(vCompanyReserved4) {
			case 'KYNL01KR':
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderHeavyHsg',
                    params:{
                        rtgastUid: rtgastUid
                    },

                    success : function(result, request) {
                        gMain.selPanel.store.load();
                        Ext.Msg.alert('안내', '요청하였습니다.', function() {});

                    },//endofsuccess
                    failure: extjsUtil.failureMessage
                });//endofajax
				break;
			default:
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
				break;
		}
    },
    
    treatWorkStart: function(o){  	
    	//다수협력사지정
    	var itemsPartner = [];
    	var pcs_steel = [];
    	var big_pcs_code = o;

		for(var i = 0; i < big_pcs_code['datas'].length; i++) {
			pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
		}

		for(var i=0; i< pcs_steel.length; i++) {
    		var o = pcs_steel[i];
    		var pcs_code = o['code'];
    		var pcs_name = o['name'];
    		console_logs('itemspartner',o);
    		var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});
    		
    		switch(vCompanyReserved4){
        		case 'SHNH01KR':
        			//if(vCompanyReserved4 == 'SHNH01KR'){
        			if(pcs_code == 'PNT'|| pcs_code == 'IPP'){
        				
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
        			}
        			break;
        		case 'DAEH01KR':
        			var myId = this.link + pcs_code+  'h_outmaker';
        			this.madeComboIds.push(myId);
        			itemsPartner.push({
        				fieldLabel: pcs_name,//ppo1_request,
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
        		case 'HAEW01KR':
        			var myId = this.link + pcs_code+  'h_outmaker';
        			this.madeComboIds.push(myId);
        			itemsPartner.push({
        				fieldLabel: pcs_name,//ppo1_request,
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
        			case 'CHNG01KR':
					break;
        			case 'SWON01KR':
        				break;
        			default :
        				var myId = this.link + pcs_code+  'h_outmaker';
        			this.madeComboIds.push(myId);
        			itemsPartner.push({
        				fieldLabel: pcs_name,//ppo1_request,
        			 	xtype: 'combo',
        				anchor: '100%',
        				name: pcs_code+  'h_outmaker',
        				id: myId,
        				displayField:   'dept_name',
        				mode: 'local',
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
    		}
		
			
    	}//endoffor
    	
    	switch(vCompanyReserved4){
    	
    	case "DDNG01KR" :
    		itemsPartner.push({
    			fieldLabel: '제작검사예정일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestampa',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},
    		{
    			fieldLabel: '제작완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestamp1',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},{
    			fieldLabel: '조립완료요청일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestamp3',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},{
    			fieldLabel: '조립완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			id: 'reserved_timestamp4',
    			name: 'reserved_timestamp4',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		});
    		break;
    	case "HAEW01KR" :
    		itemsPartner.push({
    			fieldLabel: '제작완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestampa',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},
    		{
    			fieldLabel: '용접완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestamp1',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		});
    		break;
    	case 'SHNH01KR' :

    		itemsPartner.push({
    			fieldLabel: '제작착수일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'h_reserved70',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		},
    		{
    			fieldLabel: '제작완료일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestamp1',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		});
    		break;
			case 'KYNL01KR':
                itemsPartner.push(
                    {
                        fieldLabel: '책권별 납품기준일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp1',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    });
                break;
    	default:
    		itemsPartner.push(
    		{
    			fieldLabel: '완료요청일',
    			xtype: 'datefield',
    			anchor: '100%',
    			name: 'reserved_timestamp1',
    			format: 'Y-m-d',
    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		});  	
    		break;
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
			myHeight = 400;
			myWidth = 320;
			
			if(vCompanyReserved4=='PNLC01KR') {
				myHeight = 300;
			} else if (vCompanyReserved4=='DOOS01KR') {
				myHeight = 400;
			}
			
			prwin = gMain.selPanel.prwinopen(form);
    },
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
    			pcs_code : pcs_code,
    			ac_uid : ac_uid,
    			is_heavy : 'Y',	 //중공업:Y  기타:N
    			is_rotate : 'Y', //가로양식:Y 세로양식:N
    			specification : gMain.selPanel.selectSpecification,
    			pdfPrint : 'pdfPrint',
				orderBy : 'reserved_integer3'
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
                    	var rtgastUid = gMain.selPanel.vSELECTED_RTGAST_UID;
                    	
                    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
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
                                				reserved_varchar3: 'PRD',
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
    addMinPoAction: function(selections){
    	var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
    	var po_no = gMain.selPanel.vSELECTED_PO_NO;
    	var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
    	
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
    },
    bSelected: false,
	 refreshButtons: function(bSelected) {
		 
		console_logs('this.big_pcs_code', this.big_pcs_code);
		 
		if(bSelected!=undefined && bSelected!=null) {
			this.bSelected = bSelected;
		}
		
		if( this.bSelected == true && 
			this.big_pcs_code!=undefined && 
			this.big_pcs_code!=null && 
			this.big_pcs_code!='') {
			if(gMain.selPanel.vSELECTED_STATE == 'N') {
				this.modifyDepartment.enable();
			} else {
				this.addWorkOrder.enable();	
			}     	
		} else {
			this.modifyDepartment.disable();
				this.addWorkOrder.disable();
		}
	 },
	 setBigPcsCode: function(big_pcs_code) {
		 console_logs('big_pcs_code', big_pcs_code);
		 this.big_pcs_code = big_pcs_code;
		 this.refreshButtons();
		 this.store.getProxy().setExtraParam('po_type', this.big_pcs_code);
		 this.store.getProxy().setExtraParam('rtg_type', 'OD');
		 this.storeLoad();
	 },
	 treatModifyDepartment: function(o){  	
	    	//다수협력사지정
	    	var itemsPartner = [];
	    	var pcs_steel = [];
	    	var big_pcs_code = o;

			for(var i = 0; i < big_pcs_code['datas'].length; i++) {
				pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
			}

			for(var i=0; i< pcs_steel.length; i++) {
	    		var o = pcs_steel[i];
	    		var pcs_code = o['code'];
	    		var pcs_name = o['name'];
	    		console_logs('itemspartner',o);
	    		var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});
	    		
        			var myId = this.link + pcs_code+  'h_outmaker';
        			this.madeComboIds.push(myId);
        			itemsPartner.push({
        				fieldLabel: pcs_name,//ppo1_request,
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
				
	    	}//endoffor
	    	
	    	
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
		                    title: '협력사를 재설정합니다.',
		                    defaultType: 'textfield',
		                    /*boder : true,
		                    defaults: {
		                        width: 280
		                    },*/
		                    items: itemsPartner
		            	},
			          
			            ]//item end..
				
		                    });//Panel end...
				myHeight = 400;
				myWidth = 320;
				myHeight = 320;

				prwin = gMain.selPanel.prwinanotheropen(form);
	    },
	    prwinanotheropen: function(form) {
	    	prWin =	Ext.create('Ext.Window', {
				modal : true,
	        title: '협력사재설정',
	        width: myWidth,
	        height: myHeight,	
	        plain:true,
	        items: form,
	        buttons: [{
	            text: CMD_OK,
	        	handler: function(btn){
	        		var msg = '협력사를 재설정 하시겠습니까?'
	        		var myTitle = '협력사재설정';
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
	                    	var rtgastUid = gMain.selPanel.vSELECTED_RTGAST_UID;
	                    	
	                    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
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
	                             url : CONTEXT_PATH + '/index/process.do?method=modifyDepartmentHeavy',
	                             params:{
	                                				cartmap_uids: cartmaparr,
	                                				ac_uid: ac_uid,
	                                				reserved_varchar3: 'PRD',
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

});