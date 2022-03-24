
//구매요청
Ext.define('Rfx.view.designPlan.PurchaseRequestConditionView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'purchase-request-condition-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'req_date',
            text: this.getMC('CMD_Order_Date', '등록일자') ,
            sdate: new Date(),
            edate: new Date()
    	});    

		this.addSearchField({
			field_id:		'state',
	        displayField:   'codeName',
	        valueField:     'systemCode',
	        store: 			'PrchStateStore',
	        innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'	
		});
		
		this.addSearchField('name');
		this.addSearchField('content');
        this.addSearchField('user_name');
        this.addSearchField('pj_name');
		this.addSearchField('po_no');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        console_logs('this.fields', this.fields);

        Ext.define('CartMap', {
            extend: 'Ext.data.Model',
            fields: [{name: 'route_type', 	type: "string" },
                {name: 'sp_code', 	type: "string" },
                {name: 'item_code', 	type: "string" },
                {name: 'item_name', 	type: "string" },
                {name: 'specification', 	type: "string" },
                {name: 'maker_name', 	type: "string" },
                {name: 'quan', 	type: "string" },
                {name: 'static_sales_price', 	type: "string" },
                {name: 'total_price', 	type: "string" },
                {name: 'model_no', 	type: "string" },
                {name: 'comment', 	type: "string" },
                {name: 'creator', 	type: "string" },
                {name: 'pr_reason', 	type: "string" }
                ],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=detailCartMap',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
        });
	
        Ext.define('SrcCst', {
            extend: 'Ext.data.Model',
            fields: [{name: 'object_name', 	type: "string" },
                {name: 'file_path', 	type: "string" },
                {name: 'file_size', 	type: "string" }],
                proxy: {
                    type: 'ajax',
                    api: {
                        read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=detailSrcCst',
                    },
                    reader: {
                        type: 'json',
                        root: 'datas',
                        totalProperty: 'count',
                        successProperty: 'success',
                        excelPath: 'excelPath'
                    }
                }
        });

        this.createStore('Rfx.model.PurchaseRequest', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
//	        ['cartmap']
            );
      this.store.getProxy().setExtraParam('state', 'A');

       cart_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'CartMap',
		sorters: [{
			property: 'unique_id',
			direction: 'DESC'
		    }]
	    });
	
        file_store = new Ext.data.Store({  
            pageSize: getPageSize(),
            model: 'SrcCst',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }]
        });

      switch(vCompanyReserved4) {
            case 'KWLM01KR':
                Ext.each(this.columns, function(columnObj, index) {
                var dataIndex = columnObj["dataIndex"];

                switch(dataIndex) {
                    case 'po_no':
                    columnObj['renderer'] = function(value) {
                        return '<a href="javascript:gm.me().renderDetailView()">' + value + '</a>'
                    };
                }
            });
            break;
            default:
            break;
        }
        
      var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        

        this.createCrudTab();

        Ext.apply(this, { 
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

//        this.removeAction.setText('반려');
        this.editAction.setText('상세보기');

        this.addTabCartLineGridPanel('상세보기', 'PPR3_SUB', {
                pageSize: 100,
                model: 'Rfx.store.CartMapStore',
                dockedItems: [

                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '->',
//		 	   		    	excelPrint,
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
                    var rtg_state = gMain.selPanel.vSELECTED_STATE;
                    if(rtg_state == "D"){
                        gMain.selPanel.restorePurAction.enable();
                    }
                    
                    var rec = selections[0];
                    console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
                    gMain.selPanel.selectPcsRecord = rec;
                    gMain.selPanel.parent = rec.get('parent');
                    gMain.selPanel.selectSpecification = rec.get('specification');

                } else {
                    gMain.selPanel.restorePurAction.disable();
                }
            },
            'cartLineGrid'//toolbar
        );

        //반려 자재 재주문하기
        this.restorePurAction = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '재구매',
            tooltip:'재구매요청',
            disabled: true,
            
            handler: function(widget, event) {
                
                var selections = this.up("grid").getSelectionModel().getSelection();

                var user_id = selections[0].get('creator');

                console_logs("user_id  >> ", user_id);
                console_logs("vCUR_USER_ID  >> ", vCUR_USER_ID);

                if(vCUR_USER_ID ='root'){
                    user_id = vCUR_USER_ID;
                }

                if(selections.length < 0){
                    Ext.Msg.alert('안내','선택한 자재가 없습니다.', function() {});
                }else if(user_id != vCUR_USER_ID){
                    Ext.Msg.alert('안내','본인이 요청한 주문이 아닙니다.', function() {});
                }else{
                    var my_child = new Array();
                    var my_assymap_uid = new Array();
                    var my_pl_no = new Array();
                    var my_pr_quan = new Array();
                    var my_item_code = new Array();
                    var my_sales_price = new Array();

                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var unique_uid = rec.get('coord_key3');
                        var item_code = rec.get('item_code');
                        var item_name = rec.get('item_name');
                        var pl_no = rec.get('pl_no');
                        var sales_price = rec.get('sales_price');
        
                        
                            my_child.push( rec.get('child'));
                            my_assymap_uid.push( unique_uid );
                            my_pl_no.push( pl_no );
                            my_pr_quan.push( rec.get('pr_quan'));
                            my_item_code.push( item_code);
                            my_sales_price.push(sales_price);                       
        
                    }

            if(my_assymap_uid.length>0) {

                
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
                    params:{
                        childs : my_child,
                        assymap_uids : my_assymap_uid,
                        pl_nos : my_pl_no,
                        pr_quans : my_pr_quan,
                        item_codes: my_item_code,
                        sales_prices: my_sales_price
                    },
                    success : function(result, request) {
                       
                            
                            Ext.MessageBox.alert('알림', '카트담기 성공.', function callBack(id) {
                                return;
                            });
                      
                    }
                });
            }
                }

            	
            }
        });
        
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip:'구매요청서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	var rtg_type = gMain.selPanel.vSELECTED_RTG_TYPE;
                var is_rotate = 'N';        
                
                if(vCompanyReserved4=='SKNH01KR' && rtg_type == 'PR') {
                	is_rotate = 'Y';
                }
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printPr',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pdfPrint : 'pdfPrint',
            			is_rotate : is_rotate,
            			rtg_type : rtg_type,
						parent_code: gm.me().link
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                            console_log(pdfPath); 
                            console_logs('rtgast_uid 출력 >>> ' , rtgast_uid); 
                            console_logs('po_no  출력 >>> ' , po_no);  
                            console_logs('rtg_type  출력 >>> ' , rtg_type); 
                           
                                   	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });

        // 구매담당자 변경
        this.changePoUser = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '담당자 변경',
            tooltip: '구매담당자 변경',
            disabled: true,
            handler: function() {
                var selections = gm.me().grid.getSelectionModel().getSelection();

                gm.me().poUserStore.getProxy().setExtraParam('user_type', 'PUR');
                gm.me().poUserStore.load();

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [{
                        fieldLabel: '구매담당자',
                        xtype: 'combo',
                        id: gu.id('po_user_uid'),
                        anchor: '100%',
                        name: 'po_user_uid',
                        store: gm.me().poUserStore,
                        displayField: 'user_name',
                        valueField: 'unique_id',
                        emptyText: '선택',
                        allowBlank: false,
                        sortInfo: {
                            field: 'user_name',
                            direction: 'ASC'
                        },
                        minChars: 2,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id}">{user_name}</div>';
                            }
                        },
                        listeners: {
                            select: function(combo, record) {
                                // coord_key1 = record.get('unique_id');
                            }
                        }
                    }]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '구매담당자 변경',
                    width: 350,
                    height: 150,
                    plain : true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {
                            if(btn == 'no') {
                                prWin.close();
                            } else {
                                if(form.isValid()) {
                                    var val = form.getValues(false);
                                        value = val['po_user_uid'];
                                        rtgast_uids = [];
                                    for(var i=0; i<selections.length; i++) {
                                        var rtgast_uid = selections[i].get('unique_id_long');
                                        rtgast_uids.push(rtgast_uid);
                                    }

                                    Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=updatePrchPoUser',
                                    params: {
                                        po_user_uid : value,
                                        rtgast_uids : rtgast_uids
                                    },
                                    success: function(result, request) {
                                        gm.me().store.load();
                                        if(prWin) {
                                            prWin.close();
                                        }
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); // endofajax

                                }
                                
                            }
                        }
                    }, {
                            text: CMD_CANCEL,
                            handler: function(btn) {
                                prWin.close();
                            }
                        }]
                });
                prWin.show();
            }
        });
        
      //요청접수 Action 생성
        this.reReceiveAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '요청 접수',
			 tooltip: '요청 접수',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '요청 접수 하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {

	            	        	//var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
	            	        	var uniqueuid = gMain.selPanel.rtgast_uids;
	            	        	console_logs("uniqueuid", uniqueuid);
	            	        	Ext.Ajax.request({
	            					url: CONTEXT_PATH + '/purchase/prch.do?method=createOrder',
	            					params:{
	            						unique_id: uniqueuid
	            					},
	            					
	            					success : function(result, request) { 
	            						gMain.selPanel.store.load();
	            						Ext.Msg.alert('안내', '요청접수 되었습니다.', function() {});
	            						
	            					},//endofsuccess
	            					failure: extjsUtil.failureMessage
	            				});//endofajax
	            	        	
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
//       
        //주문작성 Action 생성
        this.createPoAction = Ext.create('Ext.Action', {
 			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
 			 text: '주문 작성',
 			 tooltip: '주문 작성',
 			 disabled: false,
 			 handler: function() {
 				 gMain.selPanel.treatPo();
 				 /*switch(gMain.selPanel.poviewType) {
 				 case 'ALL':
 					 alert("자재를 먼저 선택해 주세요");
 					 break;
 				 case 'RAW':
 					 gMain.selPanel.treatPo();
 					 //gMain.selPanel.treatRawPo();
 					 break;
 				 case 'SUB':
 					 gMain.selPanel.treatPo();
 					 //gMain.selPanel.treatSubPo();
 				 	break;
 				 case 'ADDPO':
 					 alert("복사 하기 버튼을 누르세요");
 				 	break;
 				 case 'PAPER':
 					 gMain.selPanel.treatPo();
 					 break;
 				 default:
 					 
 				 }*/
 				 
 			 }//handler end...
 			 
 		});
        
        //반려 Action 생성
        this.removeBAction = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: '반려',
			 tooltip: '반려',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '반려 하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
								var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
								for(var i =0; i<selections.length; i++) {
									var state = selections[i].get('state');
									if(state != 'A') {
										Ext.Msg.alert('안내', '접수대기 상태가 아닙니다.', function() {});
									    return;
									}
								}
	            	        	//var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
	            	        	var uniqueuid = gMain.selPanel.rtgast_uids;
	            	        	console_logs("uniqueuid", uniqueuid);
	            	        	Ext.Ajax.request({
	            					url: CONTEXT_PATH + '/purchase/prch.do?method=destroyOrder',
	            					params:{
	            						unique_id: uniqueuid
	            					},
	            					
	            					success : function(result, request) { 
	            						gMain.selPanel.store.load();
	            						Ext.Msg.alert('안내', '반려 되었습니다.', function() {});
	            						
	            					},//endofsuccess
	            					failure: extjsUtil.failureMessage
	            				});//endofajax
	            	        	
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		}); 				 

      // remove the items
      (buttonToolbar.items).each(function(item,index,length){
 	 if(index==1||index==3||index==4||index==5) {
          	buttonToolbar.items.remove(item);
    	  }
      });
      
      //버튼 추가.
      //buttonToolbar.insert(1, this.reReceiveAction);
      //buttonToolbar.insert(1, '-');
      buttonToolbar.insert(1, this.printPDFAction);
      buttonToolbar.insert(1, '-');
      buttonToolbar.insert(3, '-');
      buttonToolbar.insert(4, '-');
      buttonToolbar.insert(4, this.changePoUser);
      

	  switch(vCompanyReserved4) { // 광림 설계팀에서 구매요청 시 반려 가능하도록 수정
		  case 'KWLM01KR':
			buttonToolbar.insert(3, this.removeBAction);
      		buttonToolbar.insert(3, '-');
			break;
		  default:
			break;
	  }
      
        this.callParent(arguments);
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	this.rtgast_uids=[];
            	   for(var i=0; i<selections.length; i++){
            		   var rec1 = selections[i];
            		 var uids = rec1.get('id');
            		this.rtgast_uids.push(uids);
            	   }
            	var rec = selections[0];
            	
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gMain.selPanel.vSELECTED_RTG_TYPE = rec.get('rtg_type');
                gMain.selPanel.vSELECTED_STATE = rec.get('state');
            	
                gMain.selPanel.reReceiveAction.enable();
                gMain.selPanel.changePoUser.enable();
            	gMain.selPanel.printPDFAction.enable();
            	gMain.selPanel.removeBAction.enable();
            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.reReceiveAction.disable();
            	gMain.selPanel.printPDFAction.disable();
                gMain.selPanel.removeBAction.disable();
                gMain.selPanel.changePoUser.disable();
            }
        	this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
            console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);

            this.cartLineGrid.getStore().load();
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        if(vCompanyReserved4=='DABP01KR'){
        	this.store.getProxy().setExtraParam('purcnt', "yes");
        }
        
        this.store.load(function(records){});
    },
    items : [],
    rtgast_uids : [],
    
    addTabCartLineGridPanel: function(title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
//		    	 setEditPanelTitle();
                if(success ==true) {
                    try { this.callBackWorkListCHNG(title, records, arg, fc, id); } catch(e) { console_logs('callBackWorkListCHNG error', e);}
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
	callBackWorkListCHNG: function(title, records, arg, fc, id) {
        var gridId = id== null? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        this.cartLineStore = Ext.create('Rfx.store.CartMapStore');
        this.cartLineStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_UNIQUE_ID);

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
            //dockedItems: dockedItems,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.restorePurAction,
                    '->'
                    // {
                    //     xtype: 'component',
                    //     id: gu.id('valve_quan'),
                    //     style: 'margin-right:5px;width:100px;text-align:right',
                    //     html: '총수량 : 0'
                    // }
                ]
            }

            ],
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
                    //gMain.selPanel.downListRecord(record);
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

    renderDetailView: function(value) {
    var rec = this.grid.getSelectionModel().getSelection()[0];
	console_logs('rd', rec);
	var unique_id = rec.get('unique_id');
	var po_no = rec.get('po_no');
	
	cart_store.getProxy().setExtraParam('po_no',po_no);
    file_store.getProxy().setExtraParam('rtg_uid',unique_id);
    
    var gPr_uid = rec.get('unique_id');
	
	var win = Ext.create('ModalWindow', {
		title: CMD_VIEW + '::' + /*(G)*/'요청자재/첨부파일',
		width: 1400,
		height: 700,
		minWidth: 250,
		minHeight: 180,
		autoScroll: true,
		layout: {
	        type: 'vbox',
	        align: 'stretch'
	    },
	    xtype:'container',
		plain: true,
		items: [
			{
	        xtype: 'panel',
	        id: 'First Grid',
	        autoScroll: true,
	        autoWidth: true,
	        flex: 3,
	        padding: '5',
	        items:gm.me().createViewForm()
        }
        , {
	        xtype: 'panel',
	        id: 'Second grid',
	        flex: 2,
	        autoScroll: true,
	        padding: '5',
	        items:gm.me().createFileForm()
	    }
	    ],
		buttons: [{
			text: CMD_OK,
			handler: function() {
				if(win) {win.close();}
			}
		}]
	});
	win.show();
		
    },

    modifyReqAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: '납기일 일괄변경',
        tooltip: '외주등록',
        disabled: true,
        handler: function() {		 	
            var reqForm = Ext.create('Ext.form.Panel', {
                xtype:'form',
                width:250,
                height:100,
                items: [
                    {
                        xtype:'datefield',
                        fieldLabel:'납기일 지정',
                        id:'changeReq',
                        name:'changeReq',
                        value:new Date(),
                        anchor:'100%',
                        allowBlank:false
                    }
                ]
            });

            var win = Ext.create('ModalWindow', {
                title:'납기일 일괄변경',
                width:300,
                height:130,
                items: reqForm,
                buttons: [{
                    text: CMD_OK,
                    handler: function() {
                        var form = reqForm;
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            var req_date = val['changeReq'];

                            var selects = gm.me().cart_grid.getSelectionModel().getSelection();
                            for(var i=0;i<selects.length; i++) {
                                var select = selects[i];
                                var status = select.get('status');
                                if(status != 'PR') {
                                    Ext.Msg.alert('안내', '요청상태가 아닙니다.', function() {});
                                    return;
                                }
                                var uid = select.get('unique_uid');
                                gm.editAjax('cartmap', 'req_date', req_date, 'unique_id', uid,  {type:''});
                                select.set('req_date', req_date);
                            };
                            if (win) {
                                win.close();
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function() {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            }); win.show();
        }
    }),

    createViewForm: function() {
	var CART_COLUMN = [];
	
	CART_COLUMN.push(
            {
                header:'순번', dataIndex: 'cartmap_reserved2',	
				width : 40,  align: 'left',resizable:true,sortable : true,
            },
            {
                header:'상태', dataIndex: 'statusHangul',	
				width : 40,  align: 'left',resizable:true,sortable : true,
            },
			{
				header:'구분', dataIndex: 'sp_code',	
				width : 40,  align: 'left',resizable:true,sortable : true,
			},{
				header:'구매', dataIndex: 'notify_flag',	
                width : 80,  align: 'left',resizable:true,sortable : true,
                renderer: function(value) {
                    switch(value) {
                        case 'Y':
                        return '사내구매';
                        case 'N':
                        return '외주구매';
                        default:
                        return value;
                    }
                }
			},{
				header:'품목코드', dataIndex: 'item_code',	
				width : 100,  align: 'left',resizable:true,sortable : true,
			},{
				header:'품명', dataIndex: 'item_name',	
                width : 180,  align: 'left',resizable:true,sortable : true,
                flex:1
			},{
				header:'규격', dataIndex: 'specification',	
				width : 130,  align: 'left',resizable:true,sortable : true,
            },{
				header:'제조원', dataIndex: 'maker_name',	
				width : 130,  align: 'left',resizable:true,sortable : true,
			},{
				header:'중량', dataIndex: 'mass',	
				width : 40,  align: 'left',resizable:true,sortable : true,
			},{
				header:'블록', dataIndex: 'area_code',	
				width : 80,  align: 'left',resizable:true,sortable : true,
			},{
				header:'설계번호', dataIndex: 'alter_item_code',	
				width : 120,  align: 'left',resizable:true,sortable : true,
            },{
				header:'수량', dataIndex: 'quan',	
				width : 50,  align: 'left',resizable:true,sortable : true,
			},{
				header:'단위', dataIndex: 'unit_code',	
				width : 40,  align: 'left',resizable:true,sortable : true,
			},{
				header:'단가', dataIndex: 'static_sales_price',	
				width : 70,  align: 'left',resizable:true,sortable : true,
            },{
				header:'총중량', dataIndex: 'mass',	
				width : 60,  align: 'left',resizable:true,sortable : true,
			},{
				header:'합계', dataIndex: 'total_price',	
				width : 80,  align: 'left',resizable:true,sortable : true,
			},{
				header:'재질', dataIndex: 'model_no',	
				width : 130,  align: 'left',resizable:true,sortable : true,
			},{
				header:'납기일', dataIndex: 'req_date',	
                width : 130,  align: 'left',resizable:true,sortable : true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
			},{
				header:'등록자', dataIndex: 'creator',	
				width : 80,  align: 'left',resizable:true,sortable : true,
			}
	);
	
	cart_store.load(function(){});
	
	gm.me().cart_grid = Ext.create('Ext.grid.Panel', {
		id: 'pr-div2',
        store: cart_store,
        multiSelect: true,
        stateId: 'stateGridsub',
        autoScroll : true,
        autoHeight: true,
        selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
        height: 400,
        region: 'center',
        columns: /*(G)*/CART_COLUMN,
        dockedItems: [
            {
                dock:'top',
                xtype:'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.modifyReqAction
                ]
            }
        ],
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true,
            listeners: {
                itemdblclick: this.setBom
            }
        },
    });
    
    gm.me().cart_grid.getSelectionModel().on({
        selectionchange: function(sm, selections) {
            if(selections != null && selections.length > 0 ) {
                var rec = selections[0];
                var coord_key3 = rec.get('coord_key3');
                if(coord_key3 > -1) {
                    gm.me().attachedFileStore.getProxy().setExtraParam('group_code', coord_key3);
                    gm.me().attachedFileStore.load();
                }
                gm.me().modifyReqAction.enable();
            } else {
                gm.me().modifyReqAction.disable();
            }
        }
    });
	
	return gm.me().cart_grid;
},

createFileForm :function() {
	var FILE_COLUMN = [];
	
	
	FILE_COLUMN.push(
			{
				header:'파일명', dataIndex: 'object_name',	
                width : 150,  align: 'left',resizable:true,sortable : true,
                flex:1
			},{
				header:'경로', dataIndex: 'file_path',	
				width : 300,  align: 'left',resizable:true,sortable : true,
			},{
				header:'크기', dataIndex: 'file_size',	
				width : 150,  align: 'left',resizable:true,sortable : true,
			}
	);
	
	file_store.load(function(){});
	
	file_grid = Ext.create('Ext.grid.Panel', {
		id: 'pr-div3',
		store: file_store,
		multiSelect: true,
		stateId: 'stateGridsub2',
//        selModel: selModel,
		autoScroll : true,
		autoHeight: true,
		height: 400,// (getCenterPanelHeight()/5) * 4,
//        bbar: getPageToolbar(store),
		region: 'center',
		columns: /*(G)*/FILE_COLUMN,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true,
		},
	});
	
	return file_grid;
},

setBom: function() {
    var selections = gm.me().cart_grid.getSelectionModel().getSelection();
    console_logs('====selections', selections);
    if(selections) {
        var wa_name = selections[0].get('order_com_unique');
        var pj_name = selections[0].get('pj_name');
        var pj_code = selections[0].get('pj_code');
        var pj_uid = selections[0].get('ac_uid');
        var parent_uid = selections[0].get('parent_uid');
        var child = selections[0].get('coord_key3');

        return gm.me().renderBom(wa_name, pj_name, pj_code, pj_uid, parent_uid, child);
    }
},

attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),
poUserStore: Ext.create('Mplm.store.UserStore', {user_type: 'PUR'} ), 

});
