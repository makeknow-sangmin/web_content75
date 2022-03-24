//출하 현황
Ext.define('Rfx2.view.company.dabp01kr.delivery.DeliveryMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-mgmt-view',
    initComponent: function(){
    	
    	this.vMESSAGE.EDIT = '상세보기';
       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.

    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'regist_date',
			text: "기간",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	});    
    	
//		this.addSearchField (
//				{
//						field_id: 'pm_name'
//						,store: "UserDeptStoreOnly"
//	    			    ,displayField:   'user_name'
//	    			    ,valueField:   'user_name'
//	    			    ,value: vCUR_USER_UID
//						,innerTpl	: '<div data-qtip="{unique_id}">[{dept_name}] {user_name}</div>'
//						,params:{dept_code: '02'}
//							
//				});

		if(vCompanyReserved4 != 'KYNL01KR') {
            this.addSearchField (
                {
                    field_id: 'reserved_varchar2'
                    ,store: "CarTypeStore"
                    ,displayField:   'codeName'
                    ,valueField:   'codeName'
                    ,value: vCUR_USER_UID
                    ,innerTpl	: '<div data-qtip="{systemCode}">{codeName}</div>'

                });
//		this.addSearchField('buyer_name'); //minChars: 1, BuyerStore
            this.addSearchField (
                {
                    field_id: 'buyer_name'
                    ,store: "BuyerStore"
                    ,displayField:   'wa_name'
                    ,valueField:   'wa_name'
                    ,value: vCUR_USER_UID
//	    			    ,editable : true
//	    			    ,minChars: 2
                    ,innerTpl	: '<div data-qtip="{wa_code}">{wa_name}</div>'
                });
        } else {
            this.addSearchField({
                type: 'condition',
                width: 120,
                sqlName: 'rtgast-dl',
                tableName: 'project',
                emptyText: '프로젝트',
                field_id: 'pj_name',
                fieldName: 'pj_name',
                params: {

                }
            });
            this.addSearchField({
                type: 'condition',
                width: 120,
                sqlName: 'rtgast-dl',
                tableName: 'srcahd',
                emptyText: 'BLOCK',
                field_id: 'area_code',
                fieldName: 'area_code',
                params: {

                }
            });
		}


//		this.addSearchField('wa_name');
//		this.addSearchField('pj_code');
    	
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
    	//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        if(vCompanyReserved4 == 'KYNL01KR') {
            var buttonToolbar = this.createCommandToolbar({
                REMOVE_BUTTONS : [
                    'COPY', 'REMOVE'
                ],
            });
            (buttonToolbar.items).each(function(item,index,length){
                if(index==1 || index== 4) {
                    buttonToolbar.items.remove(item);
                }
            });
		} else {
            var buttonToolbar = this.createCommandToolbar({
                REMOVE_BUTTONS : [
                    'COPY'
                ],
                RENAME_BUTTONS : [
                    // { key: 'EDIT', text: '출고확인'},
                    // { key: 'REMOVE', text: '출하반려'}
                ]
            });
            (buttonToolbar.items).each(function(item,index,length){
                if(index==1) {
                    buttonToolbar.items.remove(item);
                }
			});
		}

        



        //모델 정의
        this.createStore('Rfx.model.DeliveryMgmt', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/,{
	        	create_date: 'r.create_date'
	        }
	        );

      //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip:'납품서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var rec = gm.me().vSELECTED_RECORD;

            	if(vCompanyReserved4 == 'DOOS01KR') {
                    rtgast_uid = rec.get('reserved_number5');
				}

            	console_logs('rec', rec);
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printDl',
            		params:{
            			rtgast_uid : rec.get('reserved_number5'),
						dl_uid : rtgast_uid,
            			po_no : po_no,
            			pdfPrint : 'pdfPrint'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_log(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            }
        });
        
        //버튼 추가.
		if(vCompanyReserved4 != 'KYNL01KR') {
            buttonToolbar.insert(3, this.printPDFAction);
            buttonToolbar.insert(3, '-');
        }
   
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        
        switch(vCompanyReserved4) {
        case 'HSGC01KR':
        	this.createGrid(searchToolbar, buttonToolbar, null,  [ 
            	{
         			locked: false,
         			arr: [0, 1, 2, 3, 4, 5, 6]
         		},
    		    {
    		    	text: '납품현황',
         			locked: false,
         			arr: [7, 8, 9, 10]
         		},
    		    {
    				locked: false,
    				arr: [11]
    		    }
    		    ]);
        	break;
        default :
            this.createGrid(arr);
        	break;
        }
        this.editAction.setText('상세보기');
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {

                var code_name = 'SDL1_SUB';

                if(vCompanyReserved4 == 'KYNL01KR') {
                    this.selected_rec = selections[0];
                    switch(this.selected_rec.data.pj_type) {
                        case 'ST':
                            code_name = 'SDL1_KM';
                            break;
                        case 'SS':
                            code_name = 'SDL1_KM2';
                            break;
                        case 'SP':
                            code_name = 'SDL1_KM3';
                            break;
                        case 'ET':
                            code_name = 'SDL1_KM4';
                            break;
                        default:
                            code_name = 'SDL1_SUB';
                    }
                }

                this.addTabdeliveryPendingGridPanel('상세정보', code_name, {
                        pageSize: 100,
                        //model: 'Rfx.model.HEAVY4WorkOrder',
                        //model: 'Rfx.model.ProductNewStock',
                        dockedItems: [

                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default3',
                                items: [
                                    /* printpdf_min,
                                     '-',
                                         addMinPo*/
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
                    'deliveryPendingGrid'//toolbar
                );

            	this.detailStore.getProxy().setExtraParam('rtgastuid', selections[0].get('reserved_number5'));
            	this.detailStore.getProxy().setExtraParam('parentCode', this.link);
            	this.detailStore.load();
            	var rec = selections[0];
            	console_logs('여기', rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
            	
            	gMain.selPanel.printPDFAction.enable();
            
            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	//gMain.selPanel.reReceiveAction.disable();
            	gMain.selPanel.printPDFAction.disable();
            }
        	
        });

        //디폴트 로드
        gMain.setCenterLoading(false);

        var code_name = 'SDL_SUB';

        if(vCompanyReserved4 == 'KYNL01KR') {
            this.store.getProxy().setExtraParam('rtg_group_flag', 'Y');
        }

        this.store.load(function(records){});

        this.addTabdeliveryPendingGridPanel('상세정보', code_name, {
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			//model: 'Rfx.model.ProductNewStock',
	        dockedItems: [

		        {
		            dock: 'top',
		            xtype: 'toolbar',
		            cls: 'my-x-toolbar-default3',
		            items: [
		                   /* printpdf_min,
		                    '-',
		 	   		    	addMinPo*/
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
        'deliveryPendingGrid'//toolbar
	);

    },
    addTabdeliveryPendingGridPanel: function(title, menuCode, arg, fc, id) {

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

		switch(vCompanyReserved4) {
			case 'KYNL01KR':
                this.detailStore = Ext.create('Mplm.store.DeliveryDetailStore');
                this.detailStore.getProxy().setExtraParam('dl_uid', this.selected_rec.data.id);
                this.detailStore.getProxy().setExtraParam('h_reserved43', this.selected_rec.data.h_reserved43);
				break;
			default:
                this.detailStore = Ext.create('Mplm.store.ProduceQtyStore');
				break;
		}

		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		
		Ext.each(columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'wh_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });
		
		var wh_qty_old = 0;
         var wh_qty_new = 0;
         var available_qty = 0;
         var unique_id = 0;
         var stoqty_uid = 0;
		
		var deliveryPendingGrid = Ext.create('Ext.grid.Panel', {
            store: this.detailStore,
            title: title,
        	cls : 'rfx-panel',
        	border: true,
        	resizable: true,
        	scroll: true,
        	multiSelect: true,
        	autoload: true,
            forceFit: false,
            collapsible: false,
            layout          :'fit',
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
        	    	 
        	    	 //gMain.selPanel.downListRecord(record);
        	     }, //endof itemdblclick
        	     cellkeydown:function (deliveryPendingGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }

 	            },
 	            itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
 	            	wh_qty_old = rec.get('wh_qty');
	                available_qty = rec.get('available_qty');
	                unique_id = rec.get('unique_id');
	                stoqty_uid = rec.get('stoqty_uid');
 	            },
 	            edit: function(view, rec, opts) {
 	            	
	                wh_qty_new = rec.value;

 	                 if(wh_qty_new - wh_qty_old > available_qty) {
 	                	Ext.Msg.alert('경고', '추가 신청하려는 수량이 현재 신청 가능한 수량보다 많습니다.');
 	                	this.store.rejectChanges();
 	                 } else {
 	                	Ext.Ajax.request({
 	 	                     url: CONTEXT_PATH + '/sales/product.do?method=updateProductQty',
 	 	                     params: {
 	 	                     	wh_qty : wh_qty_new,
 	 	                     	wh_qty_old : wh_qty_old - wh_qty_new,
 	 	                     	unique_id : unique_id,
 	 	                     	stoqty_uid : stoqty_uid
 	 	                     },
 	 	                     success: function(result, request) {
 	 	                        var result = result.responseText;
 	 	                        gm.me().deliveryPendingGrid.getStore().load();
 	 	                     },
 	 	                     failure: extjsUtil.failureMessage
 	 	                 });
 	                 }
 	            }
        	},//endof listeners
            columns: columns
        });
		gm.me().deliveryPendingGrid = deliveryPendingGrid;
		deliveryPendingGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        tabPanel.removeAll(false);
        tabPanel.add(deliveryPendingGrid);
        this.detailStore.load();
	},
	 editRedord: function(field, rec) {

    	switch(vCompanyReserved4) {
    	case 'DOOS01KR': 
			var value=rec.get(field);
	    	var tableName = gm.getTableName(field);
	    	var whereField = "dl_uid";
    		switch(gm.getTableName(field)) {
    		case 'sledel':
		    	var whereValue = rec.get("unique_id");	    
		    	gm.editAjax(tableName, field, value, whereField, whereValue,  {type:''});
    			break;
    		default:
    			gm.editRedord(field, rec);
    		}
    		this.getStore().load();
	    	break;
	    default:
	    	gm.editRedord(field, rec);
    	}
	},
    items : [],
	selected_rec : null,
    deliveryPendingGrid: null
});
