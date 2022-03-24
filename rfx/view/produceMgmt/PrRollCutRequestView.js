
//구매요청
Ext.define('Rfx.view.produceMgmt.PrRollCutRequestView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'purchase-request-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField ({
            type: 'dateRange',
            field_id: 'req_date',
            text: gm.getMC('CMD_Order_Date', '등록일자') ,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
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
        if(vCompanyReserved4!='SKNH01KR') {
            this.addSearchField('content');
        }
        this.addSearchField('user_name');
        if(vCompanyReserved4=='SKNH01KR') {
            this.addSearchField('pj_name');
        }


        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.PurchaseRequest', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
//	        ['cartmap']
        );

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

                if((vCompanyReserved4=='SKNH01KR' || vCompanyReserved4=='HSGC01KR') && rtg_type == 'PR') {
                    is_rotate = 'Y';
                }

                if(vCompanyReserved4=='HSGC01KR') {
                    Ext.MessageBox.show({
                        title:'확인',
                        msg: '서명란을 포함하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn:  function(result) {
                            if(result=='yes') {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/pdf.do?method=printPr',
                                    params:{
                                        rtgast_uid : rtgast_uid,
                                        po_no : po_no,
                                        pdfPrint : 'pdfPrint',
                                        is_rotate : is_rotate,
                                        rtg_type : rtg_type,
                                        contain_sign : 'Y'
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
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/pdf.do?method=printPr',
                                    params:{
                                        rtgast_uid : rtgast_uid,
                                        po_no : po_no,
                                        pdfPrint : 'pdfPrint',
                                        is_rotate : is_rotate,
                                        rtg_type : rtg_type,
                                        contain_sign : 'N',
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
                        },
                        //animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printPr',
                        params:{
                            rtgast_uid : rtgast_uid,
                            po_no : po_no,
                            pdfPrint : 'pdfPrint',
                            is_rotate : is_rotate,
                            rtg_type : rtg_type
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

//	            	        	var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                            var uniqueuid = gMain.selPanel.rtgast_uids;

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=createOrder',
                                params:{
//	            						unique_id: rtgast_uid
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
        buttonToolbar.insert(1, this.reReceiveAction);
        //buttonToolbar.insert(1, '-');
        buttonToolbar.insert(2, this.printPDFAction);
        //buttonToolbar.insert(2, '-');
        buttonToolbar.insert(3, this.removeBAction);
        //buttonToolbar.insert(3, '-');
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
                console_logs("gMain.selPanel.vSELECTED_UNIQUE_ID>>>>>>>>>>", gMain.selPanel.vSELECTED_UNIQUE_ID);
                gMain.selPanel.reReceiveAction.enable();
                gMain.selPanel.printPDFAction.enable();
                gMain.selPanel.removeBAction.enable();

            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                gMain.selPanel.reReceiveAction.disable();
                gMain.selPanel.printPDFAction.disable();
                gMain.selPanel.removeBAction.disable();
            }
            this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
            console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);

            this.cartLineGrid.getStore().load();

        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('state', "A");

        if(vCompanyReserved4=='DABP01KR'){
            this.store.getProxy().setExtraParam('purcnt', "yes");
            this.store.getProxy().setExtraParam('po_type_DABP', 'P,U');
        }
        this.store.getProxy().setExtraParam('menuCode', this.link);
        this.store.load(function(records){});
    },
    items : [],
    rtgast_uids : [],
    //주문 작성 폼
//    treatPaperAddPoRoll: function() {
//    	var next = gUtil.getNextday(0);
//    	 form = Ext.create('Ext.form.Panel', {
//			 id: gu.id('formPanel'),
//			 xtype: 'form',
//			 frame: true ,
//	    		border: false,
//	    		bodyPadding: 10,
//	    		region: 'center',
//	    		layout: 'column',
//	            fieldDefaults: {
//	                labelAlign: 'right',
//	                msgTarget: 'side'
//	            },
//	            defaults: {
//	                layout: 'form',
//	                xtype: 'container',
//	                defaultType: 'textfield',
//	                style: 'width: 50%'
//	            },
//	            items:[{
//	            	xtype: 'fieldset',
//                 title: '구매',
//                 width : 400,
//                 height : 400,
//                 margins: '0 20 0 0',
//                 collapsible: true,
//                 anchor: '100%',
//                 defaults: {
//                     labelWidth: 89,
//                     anchor: '100%',
//                     layout: {
//                         type: 'hbox',
//                         defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
//                     }
//                 },
//                items: [
//                    { fieldLabel: '주문처',
//	            		xtype: 'combo',    
//	            		anchor: '100%',
//	            		/*id: 'stcok_pur_supplier_info',
//	            		name: 'stcok_pur_supplier_info',*/
//	            		id: 'supplier_information',
//	            		name: 'supplier_information',
//	            		store: Ext.create('Mplm.store.SupastStore'),
//	            		displayField:   'supplier_name',
//	            		valueField: 'unique_id',
//	            		emptyText: '선택',
//	            		allowBlank: false,
//	            		sortInfo: { field: 'create_date', direction: 'DESC' },
//	            	    typeAhead: false,
//	            	    //hideLabel: true,
//	            	    minChars: 1,
//	            		listConfig:{
//	            			loadingText: '검색중...',
//	            	        emptyText: '일치하는 항목 없음.',
//	            	      	getInnerTpl: function(){
//	            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
//	            	      	}
//	            		},
//	            		listeners: {
//	            	           select: function (combo, record) {
//	            	        	   var reccode = record.get('area_code');
//	            	        	   Ext.getCmp('maker_code').setValue(reccode);
//	            	           }
//	            	      }	
//                    },
//                    { fieldLabel: '납품장소',
//            	      xtype: 'textfield',
//            	      rows: 4,
//            	      anchor: '100%',
//            	      id:   'delivery_address1',
//            	      name: 'delivery_address1',
//            	      value : '사내'
//                    },
//                    
//                    { fieldLabel: '비고',
//            	      xtype: 'textarea',
//            	      rows: 4,
//            	      anchor: '100%',
//            	      id:   'item_abst',
//            	      name: 'item_abst',
//            	      
//                    },
//                    { fieldLabel: '품명',
//                        xtype : 'textfield',
//                        id : 'item_name',
//                        name : 'item_name',
//                        value : gMain.selPanel.vSELECTED_item_name,
//                        readOnly: true
//                      }
//                    ]
//	            }]
//		 })
//		 myHeight = 500;
//			myWidth = 420;
//
//		prwin = this.prwinopen(form);
//    },
//    
//    treatPo: function() {
//    	
//    	
//    	var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
//    	console_logs('uniqueId>>>', uniqueId);
//    	
//    	var next = gUtil.getNextday(0);
//    	 
//    	var request_date = gMain.selPanel.request_date;
//    	var form = null;
//    	
//    	if(uniqueId == undefined || uniqueId < 0){
//    		alert("선택된 자재가 없습니다.");
//    	}else{
//    		this.treatPaperAddPoRoll();
//    	}
// 	   
//    },
//   
//    
//    // 주문 submit
//    prwinopen: function(form) {
//    	prWin =	Ext.create('Ext.Window', {
//			modal : true,
//        title: '주문 작성',
//        width: myWidth,
//        
//        height: myHeight,	
//        plain:true,
//        items: form,
//        buttons: [{
//            text: CMD_OK,
//        	handler: function(btn){
//        		var msg = '발주하시겠습니까?'
//        		var myTitle = '주문 작성 확인';
//        		Ext.MessageBox.show({
//                    title: myTitle,
//                    msg: msg,
//                    
//                    buttons: Ext.MessageBox.YESNO,
//                    icon: Ext.MessageBox.QUESTION,
//                    fn: function(btn) {
//                    	
//                    	if(btn == "no"){
//                    		prWin.close();
//                    	}else{
//                    	var form = gu.getCmp('formPanel').getForm();
//                    	//var form = gMain.selPanel.up('form').getForm();
//                    	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
//                    	//var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
//                    	var cartmaparr = [];
//                    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
//                    	for(var i=0; i< selections.length; i++) {
//                    		var rec = selections[i];
//                    		var uid = rec.get('id');
//                    		cartmaparr.push(uid);
//                    		
//                    	}
//                    	
//                    	
//                    	if(form.isValid()){	
//                    	var val = form.getValues(false);
//                    	
//                    	console_logs('val', val);
//                    	                    	
//                    	form.submit({
//                			url : CONTEXT_PATH + '/purchase/request.do?method=createheavy',
//                			params:{
//                				sancType : 'YES',
//                				//cartmapUid: catmapuid,
//                				cartmaparr: cartmaparr
//                			},
//                			success: function(val, action){
//                				prWin.close();
//                				gMain.selPanel.store.load(function(){});
//                				
//                			},
//                			failure: function(val, action){
//                				
//                				 prWin.close();
//                				 
//                			}
//                		})
//                    	}  // end of formvalid 
//                    	} // btnIf of end
//                   }//fn function(btn)
//                    
//                });//show
//        	}//btn handler
//		},{
//            text: CMD_CANCEL,
//        	handler: function(){
//        		if(prWin) {
//        			
//        			prWin.close();
//        			
//        		}
//        	}
//		}]
//    });
//	  prWin.show();
//    },
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
});
