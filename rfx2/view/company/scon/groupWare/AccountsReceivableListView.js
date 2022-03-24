//주문작성

Ext.define('Rfx2.view.company.scon.groupWare.AccountsReceivableListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-list-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
   	// this.addSearchField ({
    //        type: 'dateRange',
    //        field_id: 'gr_date',
    //        text: "입고기간" ,
    //        sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
    //        edate: new Date()
   	// });      

        // this.addSearchField('wa_name');
        this.addSearchField('name');
//		this.addSearchField('pj_code');
//		this.addSearchField('pj_name');
//		this.addSearchField('creator');
//		this.addSearchField('item_name_dabp');
		
//		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');
//		this.addReadonlyField('user_id');
//		this.addReadonlyField('board_count');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.RtgAstAd', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
      
            this.store.getProxy().setExtraParam('state', 'A');
        
        var arr=[];
        arr.push(buttonToolbar);
		arr.push(searchToolbar);
		
		// //모델 정의
		// this.createStore('Rfx.model.AccountsReceivableList', [{
        //       property: 'unique_id',
        //       direction: 'DESC'
        //   }],
        //   gMain.pageSize/*pageSize*/
        //   );

        //grid 생성.
        var option = {
            // features: [groupingFeature],
            listeners: {
                itemdblclick: this.comfirmDeliveryDetail
            }
        };

        // this.createGrid(arr);
        this.createGridCore(arr, option);
		this.createCrudTab();
		
		this.printPDFAction = Ext.create('Ext.Action',{
        	iconCls: 'af-pdf',
            text: 'PDF',
            disabled: true,
            handler: function(widget, event) {
			//  var rec = this.grid.getSelectionModel().getSelection()[0];
			 var rtgast_uid = gMain.selPanel.rec.get('unique_id');
			 var po_no = gMain.selPanel.rec.get('po_no');
              Ext.Ajax.request({
                url: CONTEXT_PATH + '/pdf.do?method=printAC',
                params:{
                  rtgast_uid : rtgast_uid,
                  po_no : po_no,
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

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

		this.editAction.setText('상세보기');

        this.addTabsledelLineGridPanel('상세보기', 'SDL1_SUB', {
                pageSize: 100,
                model: 'Rfx.store.SleDelStore',
                dockedItems: [

                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '->',
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
            'sledelLineGrid'//toolbar
        );
        
        //this.editAction.setText('주문작성');
//        this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
		});
		
		// buttonToolbar.insert(3, this.printPDFAction);

       this.callParent(arguments);
       
     //grid를 선택했을 때 Callback
       this.setGridOnCallback(function(selections) {
           if (selections.length) {
           	
        	   var rec = selections[0];
        	   gMain.selPanel.rec = rec;
        	   console_logs('rec 데이터', rec);
           	var standard_flag = rec.get('standard_flag');
           	standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제 
           	
           	console_logs('그리드온 데이터', rec);
           	gMain.selPanel.request_date = rec.get('req_date'); // 납기일
           	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
           	gMain.selPanel.vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
           	gMain.selPanel.vSELECTED_SP_CODE = rec.get('sp_code');
           	gMain.selPanel.vSELECTED_STANDARD = rec.get('standard_flag');
           	gMain.selPanel.vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
           	gMain.selPanel.vSELECTED_coord_key2 = rec.get('coord_key2');
           	gMain.selPanel.vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
           	gMain.selPanel.vSELECTED_po_user_uid = rec.get('po_user_uid');
           	gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 원지: 지종,  원단 : 지종배합, 부자재 : 품명
           	gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
           	gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
           	gMain.selPanel.vSELECTED_req_date = rec.get('delivery_plan');
           	gMain.selPanel.vSELECTED_quan = rec.get('pr_quan');
           	gMain.selPanel.vSELECTED_comment = rec.get('comment');   // 폭
           	gMain.selPanel.vSELECTED_req_info = rec.get('req_info');  //비고
           	gMain.selPanel.vSELECTED_request_comment = rec.get('request_comment');  //전달 특기사항
           	gMain.selPanel.vSELECTED_reserved_varcharb = rec.get('reserved_varcharb'); //칼날 사이즈
           	gMain.selPanel.vSELECTED_project_double3 = rec.get('project_double3'); //판걸이 수량
           	gMain.selPanel.vSELECTED_specification = rec.get('specification');  //부자재 규격
           	gMain.selPanel.vSELECTED_pj_description = rec.get('pj_description');
           	gMain.selPanel.vSELECTED_srcahduid = rec.get('unique_id');  //srcahd uid
           	gMain.selPanel.vSELECTED_lot_name = rec.get('pj_name');
			gm.me().printPDFAction.enable();
           	//gMain.selPanel.itemabst();
        	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
			this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
			// console_logs('===zzzzzz', rec);
			this.sledelLineStore.getProxy().setExtraParam('ad_uid', rec.get('unique_id'));
			this.sledelLineStore.load();

        	//this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
            /*for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        		console_logs('rec1', rec1);
        	   }*/
            } else {
           	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
           	gMain.selPanel.vSELECTED_PJ_UID = -1;
           	gm.me().printPDFAction.disable();
           	
           	//this.store.removeAll();
           	this.cartmap_uids = [];
           	for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        	   }
           	
           	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
           	console_logs('언체크', this.cartmap_uids);
           }
       	
       })

        //디폴트 로드
       gMain.setCenterLoading(false);
       this.store.load(function(records){
    	   console_logs('디폴트 데이터', records);
    	   
       });
    },
    items : [],
    poviewType: 'ALL',
    cartmap_uids : [],
    deleteClass: ['rtgast'],
	jsonType : '',
	
	addTabsledelLineGridPanel: function(title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
//		    	 setEditPanelTitle();
                if(success ==true) {
                    try { this.callBackWorkListCHNG(title, records, arg, fc, id); } catch(e) { console_logs('callBackWorkListCHNG error', e);}

                    this.sledelLineGrid.on('edit', function(editor, e) {
                        var rec = e.record;

                        var out_blocking_qty = rec.get('gr_blocking_qty') == undefined ? 0 : rec.get('gr_blocking_qty');
                        var sales_price = rec.get('sales_price');
                        var unique_id = rec.get('unique_id');
                        var dl_uid = rec.get('dl_uid');
                        var pj_uid = rec.get('pj_uid');
                        var gr_qty = rec.get('gr_qty');

                        if(gr_qty < out_blocking_qty) {
                            Ext.Msg.alert('안내', '납품수량 보다 많습니다.', function(){});
                            out_blocking_qty = gr_qty;
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/delivery.do?method=destroy',
                            params: {
                                out_blocking_qty:out_blocking_qty,
                                sales_price:sales_price,
                                sledel_uid:unique_id,
                                dl_uid:dl_uid,
                                pj_uid:pj_uid
                            },
                            success: function(result, request) {
                                gm.me().sledelLineStore.load();
                                gm.me().store.load();
                                gm.me().showToast('안내', '수정되었습니다.');
                            },
                            failure: extjsUtil.failureMessage
                        });
                        rec.commit();
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
	
	callBackWorkListCHNG: function(title, records, arg, fc, id) {
        var gridId = id== null? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
		var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        this.sledelLineStore = Ext.create('Rfx.store.SleDelStore');
        
        Ext.each(columns, function(columnObj, index) {
		var dataIndex = columnObj["dataIndex"];
		// console_logs('===columnObj', columnObj);
        var qty = 0;
	});

        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
        this.sledelLineGrid = Ext.create('Ext.grid.Panel', {
            //id: gridId,
            store: this.sledelLineStore,
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
                cellkeydown:function (sledelLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.sledelLineGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                fc(selections);
            }
        });
        var view = this.sledelLineGrid.getView();

        // var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
        //     down: function(e) {
        //         var selectionModel = this.sledelLineGrid.getSelectionModel();
        //         var select = 0; // select first if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.sledelLineGrid.getSelectionModel().getSelection()[0].index + 1;
        //         }
        //         view.select(select);

        //     },
        //     up: function(e) {
        //         var selectionModel = this.sledelLineGrid.getSelectionModel();
        //         var select = this.sledelLineGrid.store.totalCount - 1; // select last element if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.sledelLineGrid.getSelectionModel().getSelection()[0].index - 1;
        //         }
        //         view.select(select);

        //     }
        // });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.sledelLineGrid);
    },

    comfirmDeliveryDetail: function() {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>> detail', select);
        var ad_uid = select.get('unique_id_long');
        gm.me().billStore.getProxy().setExtraParam('ad_rtgastUid', ad_uid);
        gm.me().billStore.load();
        gm.me().detailItemStore.removeAll();

        var billGridSel =   Ext.create("Ext.selection.CheckboxModel", {} );
        var billGrid = Ext.create('Ext.grid.Panel', {
            title: '납품서 목록',
            store: gm.me().billStore,
            collapsible: false,
            // cls : 'rfx-panel',
            // width: '30%',
            // region: 'west',
            autoScroll : true,
            autoHeight: true,
            border: true,
            // layout: 'border',
            // forceFit: true,
            selModel: billGridSel,
            region: 'center',
            // width:'30%',
            // region: 'west',
            stateId: 'billGrid' + /* (G) */ vCUR_MENU_CODE,
            // dockedItems: [{
            //     dock: 'top',
            //     xtype: 'toolbar',
            //     cls: 'my-x-toolbar-default2',
            //     items: ['->',
            //            {
            //                 xtype: 'component',
            //                 id: gu.id('total_bill_amount'),
            //                 style: 'margin-right:5px;width:100px;text-align:right',
            //                 html: '총금액 : 0'
            //             }
            //         ]
            //     }

            // ],
            columns: [
            	{
                    text     : '순번',
                    xtype: 'rownumberer',
                    width     : 60,
                    align: 'center',
                    sortable : true
                },
            	{
                    text     : '납품서번호',
                    width     : 120,
                    sortable : true,
                    align: 'center',
                    dataIndex: 'po_no'
                },
                {
                    text     : '합계금액',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'center',
                    dataIndex: 'total_price'
                },
                // {
                //     text     : '건수',
                //     width     : 100,
                //     sortable : true,
                //     align: 'center',
                //     dataIndex: 'item_quan'
                // },
                {
                    text     : '납품날짜',
                    width     : 120,
                    sortable : true,
                    align: 'center',
                    dataIndex: 'reserved_timestamp1'
                },
                // {
                //     text     : 'size',
                //     width     : 100,
                //     sortable : true,
                //     xtype: 'numbercolumn',
                //     format: '0,000',
                //     style: 'text-align:right',
                //     align: 'right',
                //     dataIndex: 'file_size'
                // }
            ]
        });

        billGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections!=null && selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>>> bill rec', rec);
                    var dl_uid = rec.get('unique_id_long');
                    gm.me().detailItemStore.getProxy().setExtraParam('dl_uid', dl_uid);
                    gm.me().detailItemStore.load();
                } else {
                    gm.me().detailItemStore.removeAll();
                }
            }
        })

        var detailItemSel =   Ext.create("Ext.selection.CheckboxModel", {} );
        var detailGrid = Ext.create('Ext.grid.Panel', {
            title: '납품정보',
            store: gm.me().detailItemStore,
            collapsible: false,
            // cls : 'rfx-panel',
            // width: '70%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            // region: 'center',
            // layout: 'border',
            // forceFit: true,
            selModel:detailItemSel,
            stateId: 'detailGrid' + /* (G) */ vCUR_MENU_CODE,
            // dockedItems: [{
            //     dock: 'top',
            //     xtype: 'toolbar',
            //     cls: 'my-x-toolbar-default2',
            //     items: ['->',
            //            {
            //                 xtype: 'component',
            //                 id: gu.id('total_detail_amount'),
            //                 style: 'margin-right:5px;width:100px;text-align:right',
            //                 html: '총금액 : 0'
            //             }
            //         ]
            //     }

            // ],
            columns: [
            	{
                    text     : '순번',
                    xtype: 'rownumberer',
                    width     : 60,
                    align: 'center',
                    sortable : true
                },
            	{
                    text     : '제품명',
                    width     : 120,
                    sortable : true,
                    align: 'center',
                    dataIndex: 'item_name'
                },
                {
                    text     : '규격',
                    width     : 120,
                    sortable : true,
                    align: 'center',
                    dataIndex: 'specification'
                },{
                    text     : '수량',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'center',
                    dataIndex: 'gr_qty'
                },{
                    text     : '단가',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'center',
                    dataIndex: 'sales_price'
                },{
                    text     : '금액',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'center',
                    dataIndex: 'total_price'
                }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
            width: 1400,
            height: 800,
            minWidth: 250,
            minHeight: 180,
            // autoScroll: true,
            layout: {
                type: 'hbox',
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
                width:'30%',
                // flex: 3,
                padding: '5',
                items:billGrid
            }
            , {
                xtype: 'panel',
                id: 'Second grid',
                // flex: 2,
                autoScroll: true,
                width:'70%',
                padding: '5',
                items:detailGrid
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
    }, // Function End

    billStore: Ext.create('Mplm.store.DeliveryNoteStore'),

    detailItemStore: Ext.create('Rfx.store.SleDelStore'),
    
});
