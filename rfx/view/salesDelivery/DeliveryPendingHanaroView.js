//출하 대기
Ext.define('Rfx.view.salesDelivery.DeliveryPendingHanaroView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'delivery-pending-view',
    detailStore: null,
    initComponent: function () {

        //this.vMESSAGE.EDIT = '출하수량 수정';
        // 검색툴바 필드 초기화
        this.initSearchField();


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE', 'EDIT'
            ],
            RENAME_BUTTONS: []
        });

        //모델 정의
        this.createStore('Rfx.model.Heavy4DeliveryHanaroPending', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/, {
                car_name: 'r.coord_key1'
            }
        );

        //그리드 생성
        var arr = [];

//        this.addSearchField({
//            type: 'condition',
//            width: 140,
//            sqlName: 'rtgast-do',
//            tableName: 'itemdetail',
//            field_id: 'h_reserved43',
//            fieldName: 'h_reserved43',
//            params: {}
//        });
//        this.addSearchField('wa_name');
        this.addSearchField('item_name');
        
        
        arr.push(buttonToolbar);
        arr.push(this.createSearchToolbar());
        //arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        // switch (vCompanyReserved4) {
        //     case 'KYNL01KR':
        //         this.editAction.setText('상세정보');
        //         break;
        //     default:
        //         this.editAction.setText('출하수량 수정');
        //         break;
        // }

        //출고지시 Action 생성
        this.addDeliveryConfirm = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '출고확인',
            tooltip: '출고확인 확정',
            disabled: true,
            handler: function() {
               var rec = gMain.selPanel.vSELECTED_RECORD;
               var selections = gm.me().grid.getSelectionModel().getSelection();
               var check_wa_name = selections[0].get('wa_name');

               var real_out_qty = [];
               var reserved_double1s = [];
               var reserved_double2s = [];
               var rtgast_uids = [];
               var order_com_uniques = [];

               for(var i=0; i<selections.length; i++) {
                   var sel = selections[i];

                   var wa_name = sel.get('wa_name');
                   
                   var new_out_quan = sel.get('new_out_quan');
                   if(check_wa_name != wa_name) {
                       Ext.MessageBox.alert(error_msg_prompt, '고객사가 다릅니다.');
                       return;
                   }
                   
                   if(new_out_quan == undefined || new_out_quan == '') {
                       Ext.MessageBox.alert(error_msg_prompt, '납품수량을 확인해 주세요.');
                       return;
                   }

                   // var qty = sel.get('reserved_double8') - sel.get('delivery_qty');
                   var qty = sel.get('new_out_quan');
                   var delivery_date = sel.get('delivery_date');
                   var reserved_double1 = (delivery_date == null) ? sel.get('pj_double1') : 0; // 개발비
                   var reserved_double2 = sel.get('pj_double2');
                   var rtgast_uid = sel.get('unique_id');
                   var order_com_unique = sel.get('order_com_unique');
                   real_out_qty.push(qty);
                   reserved_double1s.push(reserved_double1);
                   reserved_double2s.push(reserved_double2);
                   rtgast_uids.push(rtgast_uid);
                   order_com_uniques.push(order_com_unique);
               }

               var msg = '납품서 생성을 위한 출고를 확정합니다.<br>이 작업은 취소할 수 없습니다.';
               msg = msg + '<hr>';
               msg = msg + '<font color=#163F69><b>고객사(수주일):</b></font> ' + selections[0].get('wa_name') + ' 外 ' + (selections.length - 1) + ' 건' +'<br>';
               msg = msg + '<font color=#163F69><b>제품:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('item_code') + ' | ' + rec.get('specification') +'<br>';
              //  msg = msg + '<font color=#163F69><b>배송목적지:&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('reserved_varchar1') +'<br>';
              //  msg = msg + '<font color=#163F69><b>배송차량:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></font> ' + rec.get('reserved_varchar2') +'<hr>';
               
               // var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
               // var delivery_date = rec.get('delivery_date');
               // var reserved_double1 = (delivery_date == null) ? rec.get('pj_double1') : 0; // 개발비
               // var reserved_double2 = rec.get('pj_double2'); // 물류비

               // var real_out_qty = rec.get('reserved_double8') - rec.get('delivery_qty');

               var form = Ext.create('Ext.form.Panel', {
                   defaultType: 'textfield',
                   border: false,
                   bodyPadding: 15,
                   region: 'center',
                   defaults: {
                       anchor: '100%',
                       allowBlank: false,
                       msgTarget: 'side',
                       labelWidth: 80
                   },
                    items: [
                               {
                                   xtype: 'component',
                                   html: msg,
                                   anchor: '100%'
                               },
                               new Ext.form.Hidden({
                                   name: 'rtgastUids',
                                   value: rtgast_uids
                               }),
                               new Ext.form.Hidden({
                                   name: 'out_qtys',
                                   value: real_out_qty
                               }),
                               new Ext.form.Hidden({
                                   name: 'reserved_double2s',
                                   value: reserved_double2s
                               }),
                               new Ext.form.Hidden({
                                   name: 'reserved_double1s',
                                   value: reserved_double1s
                               }),
                               new Ext.form.Hidden({
                                   name: 'order_com_uniques',
                                   value: order_com_uniques
                               })
                               // {
                               // 	xtype: 'numberfield',
                               // 	fieldLabel: '출고수량',
                               // 	name: 'out_qtys',
                               // 	value:  real_out_qty,
                               // 	anchor: '100%'
                               // },{
                               // 	xtype: 'numberfield',
                               // 	fieldLabel: '물류비',
                               // 	name: 'reserved_double2s',
                               // 	value:  reserved_double2s,
                               // 	anchor: '100%'
                               // },{
                               // 	xtype: 'numberfield',
                               // 	fieldLabel: '개발비',
                               // 	name: 'reserved_double1s',
                               // 	value:  reserved_double1s,
                               // 	readOnly: true,
                               // 	anchor: '100%'
                               // }
                            ]
               });
               var win = Ext.create('ModalWindow', {
                   title: '출고 확인',
                   width: 400,
                   height: 200,
                   minWidth: 400,
                   minHeight: 200,
                   items: form,
                   buttons: [{
                       text: CMD_OK,
                       handler: function(){
                           var val = form.getValues(false);
                           console_logs('====val', val);			

                            gMain.selPanel.addDeliveryConfirmFc(val);
                               if(win) {
                                   win.close();
                               }
                       }
                   },
                   {
                       text: '취소',
                       handler: function(){
                           if(win) {
                               win.close();
                           }
        

                       }
                   }]
               });
               win.show();
//				var dlg = Ext.MessageBox.prompt(
//			            CMD_OK,
//			            msg,
//			            gMain.selPanel.addDeliveryConfirmFc
//			        );
//				var textboxEl = dlg.getEl().query('input')[0];
//				textboxEl.setAttribute('maxlength', 10);
//				//textboxEl.setAttribute('maskRe', /[0-9.]/);
//				
//				var reserved_double1 = rec.get('reserved_double1');
//				console_logs('reserved_double1', reserved_double1);
//				textboxEl.setAttribute('value', ''+ reserved_double1);
//				
            }
       });

       //바코드 출력 추가작성

       this.barcodePrintAction = Ext.create('Ext.Action', {
        iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        text: '바코드출력', 
        handler: function () {
            gm.me().printBarcode();
        }
    
        });


        //출고지시 Action 생성
        this.addDeliveryConfirmPart = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '출하지시',
            tooltip: '출하지시',
            disabled: true,
            handler: function () {
                var rec = gMain.selPanel.vSELECTED_RECORD;
                var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
                if (vCompanyReserved4 == 'KYNL01KR') {
                    var form = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [{
                            xtype: 'datefield',
                            fieldLabel: '불출일',
                            name: 'h_reserved51',
                            anchor: '100%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '불출메모',
                            name: 'h_reserved52',
                            anchor: '100%'
                        }
                        ]
                    });
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 80
                        }
                    });
                }

                switch (vCompanyReserved4) {
                    case 'KYNL01KR':

                        var rtgastUid = gm.me().selected_rec[0].data.id;
                        var stock_pos = gm.me().selected_rec[0].data.po_no;
                        var reserved_varchar1 = gm.me().selected_rec[0].data.reserved_varchar1;
                        var stoqty_uids = [];
                        var specifications = [];

                        for (var i = 0; i < gm.me().selected_sub_rec.length; i++) {
                            stoqty_uids.push(gm.me().selected_sub_rec[i].data.id);
                            specifications.push(gm.me().selected_sub_rec[i].data.specification);
                        }

                        var win = Ext.create('ModalWindow', {
                            title: '출하지시',
                            width: 400,
                            height: 150,
                            minWidth: 400,
                            minHeight: 150,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function () {
                                    var val = form.getValues(false);
                                    var myWin = win;
                                    myWin.setLoading(true);
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqstHeavy',
                                        params: {
                                            rtgastUid: rtgastUid,
                                            out_qty: val['out_qty'],
                                            stock_pos: stock_pos,
                                            reserved_varchar1: reserved_varchar1,
                                            stoqty_uids: stoqty_uids,
                                            specifications: specifications,
                                            h_reserved51: val['h_reserved51'],
                                            h_reserved52: val['h_reserved52']
                                        },

                                        success: function (result, request) {
                                            myWin.setLoading(false);
                                            Ext.Msg.alert('출고', '출고처리 하였습니다.');
                                            win.close();
                                            gm.me().detailStore.load();
                                            gm.me().store.load();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            },
                                {
                                    text: '취소',
                                    handler: function () {
                                        if (win) {
                                            win.close();
                                        }
                                    }
                                }]
                        });
                        break;
                    default:
                        var win = Ext.create('ModalWindow', {
                            title: '메시지',
                            html: '<br><p style="text-align:center;">출하 지시를 내리시겠습니까?</p>',
                            width: 300,
                            height: 120,
                            buttons: [{
                                text: '예',
                                handler: function () {
                                    var val = form.getValues(false);
                                    gMain.selPanel.addDeliveryConfirmFc(val['out_qty'], val['reserved_varchar1']);
                                    if (win) {
                                        win.close();
                                    }
                                }
                            },
                                {
                                    text: '아니오',
                                    handler: function () {
                                        if (win) {
                                            win.close();
                                        }
                                    }
                                }]
                        });
                }
                win.show();
            }
        });


        this.removeDeliveryConfirm = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: '출하반려',
			tooltip: '출하반려 요청',
			disabled: true,
			handler: function() {
				var selections = gm.me().grid.getSelectionModel().getSelection();
				var unique_ids = [];
				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];
					unique_ids.push(rec.get('unique_id_long'));
				}
				var form = Ext.create('Ext.form.Panel', {
					id: 'form',
					defaultType: 'textfield',
					border: false,
					bodyPadding: 15,
					width: 400,
					height: 250,
					defaults: {
						// anchor: '100%',
						editable:true,
						allowBlank: false,
						msgTarget: 'side',
						labelWidth: 100
					},
					items: [
						new Ext.form.Hidden({
							name: 'unique_ids',
							id: 'unique_ids',
							value: unique_ids
						}),
						{
							xtype: 'combo',
							name: 'back_info',
							id: 'back_info',
							allowBlank: false,
							fieldLabel: '반려사유',
							store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'DELIVERY_BACK'}),
							displayField:   'codeName',
							valueField:  'codeName',
							listeners : {
								select: function(field, value) {
									console_logs('>>>>field' + ' ' + field, value);
								}
							}
						}, {
							xtype: 'textarea',
							fieldLabel: '기타 비고',
							height: 100,
							name: 'etc', 
							id: 'etc',
							allowBlank: true
						}
					]
				});

				var win = Ext.create('ModalWindow', {
					title: '출하반려',
					width : 400,
					height: 300,
					items: form,
					buttons: [{
                        text: CMD_OK,
                        handler: function(){
							var form = Ext.getCmp('form');
							if (form.isValid()) {
								var val = form.getValues(false);

								console_logs('==val', val);

								Ext.Ajax.request({
									url: CONTEXT_PATH + '/sales/delivery.do?method=backDeliveryRequest',
									params: val,
									success: function(result, request) {
										if(win) {
											win.close();
										}
										gm.me().store.load();
									}, // endof success for ajax
									failure: extjsUtil.failureMessage
								});
							} else {
								Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
							}
						}
					},{
						text: CMD_CANCEL,
                        handler: function() {
                            if(win) {
                                win.close();
                                }
                        }
					}]
				});
				win.show();
			}
		});
		    	
		buttonToolbar.insert(1, this.removeDeliveryConfirm);
        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.addDeliveryConfirm);
        buttonToolbar.insert(1, '-');
        //추가작성
        buttonToolbar.insert(3, this.barcodePrintAction);
        buttonToolbar.insert(3, '-');

        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                var submenu = '';
                this.selected_rec = selections;
                this.pallet_no = selections[0].data.po_no;
                switch (selections[0].data.pj_type) {
                    case '해양':
                        submenu = 'SDL2_KM';
                        break;
                    case '조선':
                        submenu = 'SDL2_KM2';
                        break;
                    case '도장':
                        submenu = 'SDL2_KM3';
                        break;
                    case '기타':
                        submenu = 'SDL2_KM4';
                        break;
                    default:
                        submenu = 'SDL2_SUB';
                }

                this.addTabdeliveryPendingGridPanel('상세정보', submenu, {
                        pageSize: 100,
                        //model: 'Rfx.model.HEAVY4WorkOrder',
                        //model: 'Rfx.model.ProductNewStock',
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default3',
                                items: [
                                    this.addDeliveryConfirmPart
                                ]
                            }
                        ],
                        sorters: [{
                            property: 'serial_no',
                            direction: 'ASC'
                        }]
                    },
                    function (selections) {
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
                if (selections.length) {
                    gMain.selPanel.addDeliveryConfirm.enable();
                    gMain.selPanel.removeDeliveryConfirm.enable();
                } else {
                    gMain.selPanel.addDeliveryConfirm.disable();
                    gMain.selPanel.removeDeliveryConfirm.disable();
                }
            }
        });
        //입력/상세 창 생성.
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                this.store.getProxy().setExtraParam('rtg_group_flag', 'Y');
                break;
            default:
                break;
        }
        this.store.load(function (records) {
        });

    },
    addDeliveryConfirmFc: function(value) {
    	if(this.vSELECTED_RECORD==null) {
    		Ext.MessageBox.alert('오류', '선택한 항목를 찾을 수 없습니다.');
    		
    	} else {
        	var rtgastUid = this.vSELECTED_RECORD.get('id');
        	
    	    Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqst',
				params: value,
    			
    			success : function(result, request) { 
    				gMain.selPanel.store.load(function(records){
    					
    				});
    				Ext.Msg.alert('안내', '납품서를 생성하였습니다. <br>[출하현황] 메뉴를 확인하세요.', function() {});
    				
    			},//endofsuccess
    			failure: extjsUtil.failureMessage
    		});//endofajax
    	}

    },
    addTabdeliveryPendingGridPanel: function (title, menuCode, arg, fc, id) {
        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    // this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },
    callBackWorkList: function (title, records, arg, fc, id) {
        var gridId = id == null ? this.getGridId() : id;
        var o = gMain.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];
        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});      
        this.detailStore = Ext.create('Mplm.store.ProduceQtyStore');
        this.detailStore.getProxy().setExtraParam('rtgastuid', this.selected_rec[0].get('id'));
        this.detailStore.getProxy().setExtraParam('parentCode', this.link);
        this.detailStore.getProxy().setExtraParam('limit', 1000);

        Ext.each(columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'wh_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
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
            cls: 'rfx-panel',
            selModel: vCompanyReserved4 == 'KYNL01KR' ? Ext.create("Ext.selection.CheckboxModel", {}) : null,
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            autoload: true,
            collapsible: false,
            layout: 'fit',
            dockedItems: dockedItems,
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
                    
                }, //endof itemdblclick
                cellkeydown: function (deliveryPendingGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
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
                edit: function (view, rec, opts) {
                    wh_qty_new = rec.value;
                    if (wh_qty_new - wh_qty_old > available_qty) {
                        Ext.Msg.alert('경고', '추가 신청하려는 수량이 현재 신청 가능한 수량보다 많습니다.');
                        this.store.rejectChanges();
                    } else {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/product.do?method=updateProductQty',
                            params: {
                                wh_qty: wh_qty_new,
                                wh_qty_old: wh_qty_old - wh_qty_new,
                                unique_id: unique_id,
                                stoqty_uid: stoqty_uid
                            },
                            success: function (result, request) {
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
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().addDeliveryConfirmPart.enable();
                } else {
                    gm.me().addDeliveryConfirmPart.disable();
                }
                fc(selections);
                //서브그리드
                gm.me().selected_sub_rec = selections;
            }
        });
        var view = deliveryPendingGrid.getView();
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = deliveryPendingGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if (selectionModel.hasSelection()) {
                    select = deliveryPendingGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);
            },
            up: function (e) {
                var selectionModel = deliveryPendingGrid.getSelectionModel();
                var select = deliveryPendingGrid.store.totalCount - 1; // select last element if no record is selected
                if (selectionModel.hasSelection()) {
                    select = deliveryPendingGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);
            }
        });
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        tabPanel.removeAll(false);
        tabPanel.add(deliveryPendingGrid);
        this.detailStore.load(function (rec) {
            this.sub_rec_count = rec.length;
        });
    },
    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
    console_logs('====> edited record', rec);
    
    var selections = gm.me().grid.getSelectionModel().getSelection();
    var reserved_double1 = selections[0].get('reserved_double1');
    var new_out_quan = selections[0].get('new_out_quan');

        // switch (field) {
        //     case 'new_out_quan':
    //     if(reserved_double1 < new_out_quan) {
    //       Ext.Msg.alert('안내', '납품예정수량 보다 많을 수 없습니다.');
    //       selections[0].set('new_out_quan', reserved_double1);
    //       // Ext.getCmp('new_out_quan').setValue(reserved_double1);
    //     }
        //         break;
        // }
    },
//    editRedord: function (field, rec) {
//        console_logs('====> edited field', field);
//        console_logs('====> edited record', rec);
//        switch (field) {
//            case 'po_no':
//                gm.editAjax('itemdetail', 'h_reserved43', rec.get(field), 'h_reserved43', this.pallet_no, {type: ''});
//                gm.editRedord(field, rec);
//                break;
//            case 'h_reserved46':
//            case 'h_reserved47':
//            case 'h_reserved58':
//                var assy_uids = [];
//                for (var i = 0; i < this.detailStore.data.items.length; i++) {
//                    assy_uids.push(this.detailStore.data.items[i].data.assymap_uid);
//                }
//                gm.editAjax('itemdetail', field, rec.get(field), 'unique_id', assy_uids, {type: ''});
//                break;
//            default:
//                gm.editRedord(field, rec);
//                break;
//        }
//    },
    items: [],
    rtgastuid: 0,
    selected_rec: null,
    selected_sub_rec: null,
    sub_rec_count: 0,
    deliveryPendingGrid: null,
    pallet_no: null,

    //추가작성 바코드 메소드
    printBarcode: function () {

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
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
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        //1장만 출력해서 전표에 붙이므로 출력매수는 삭제
                        {

                            xtype: 'fieldcontainer',
                            fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'vbox',
                            
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '0 5 0 5',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                },

                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: '출력 구분',
                                    margin: '0 5 0 5',
                                    width: 200,
                                    allowBlank: false,

                                        //1장만 출력

                                    items: [
                                        {boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true}
                                        // ,{boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
                                    ]

                                }


                            ]  // end of itmes

                        }  // end of fieldcontainer

                    ]
                }
            ]

        });//Panel end...

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },

//     //바코드 추가작성
    prbarcodeopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    var bararr = [];
                    var po_no_arr = [];
                    var reserved_double1_arr = [];
                    var pj_code_arr = [];
  
                    //회사이름 추가작성
                    var wa_nameArr = [];

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                     //추가작성 01 28
                    console_logs("셀렉션 i 출력 >>> " , selections[i] );
                        
                        var uid = rec.get('unique_id_long');  //Product unique_id

                        var item_code = rec.get('item_code');
                        var item_name = rec.get('item_name'); 
                        var specification = rec.get('specification'); 
                        
                        var reserved_double1 = rec.get('reserved_double1'); 
                        //추가작성
                        var wa_name = rec.get('wa_name'); 
                        wa_nameArr.push(wa_name);

                        var bar_spec =  
                        '<' + item_code + '>'+ '|' + item_name + '|' +specification;

                        uniqueIdArr.push(uid);
                        bararr.push(bar_spec);
                        reserved_double1_arr.push(reserved_double1);
                        
                        //추가작성
                        var po_no = rec.get('po_no');
                        po_no_arr.push(po_no);
                        console_logs( 'po_no >>>>>>>>>>>>>>' , po_no);

                        var pj_code = rec.get('pj_code');
                        pj_code_arr.push(pj_code)
                        console_logs( 'pj_code >>>>>>>>>>>>>>' , pj_code);
                    }

                    var form = gu.getCmp('formPanel').getForm();


                    //바코드 출력 회사별 분기
                
                    if(vCompanyReserved4=='MJCM01KR') {
                        console_logs("MJCM01KR  분기 출력 >>>", reserved_double1_arr)
                        form.submit({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',
                            params: {
                                rtgastUids: uniqueIdArr,
                                barcodes: bararr,
                                po_no : po_no_arr,

                                //원본
                                order_multiple : reserved_double1_arr,
                                //order_multiple : 1,

                                
                                pj_code_arr : pj_code_arr,
                                wa_name : wa_nameArr
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                            },
                            failure: function (val, action) {
                                prWin.close();
                                Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                            }
                        });

                    }else {
                            //국송
                        form.submit({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',
                            params: {
                                rtgastUids: uniqueIdArr,
                                barcodes: bararr,
                                po_no : po_no_arr,
                                order_multiple : reserved_double1_arr,
                                pj_code_arr : pj_code_arr,
                                wa_name : wa_nameArr
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                            },
                            failure: function (val, action) {
                                prWin.close();
                                Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                            }
                        });


                      }//else 끝

                   


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
      prWin.show();
 }//바코드관련 끝

//바코드 추가작성
// prbarcodeopen: function (form) {

//     prWin = Ext.create('Ext.Window', {
//         modal: true,
//         title: '바코드 출력 매수',
//         plain: true,
//         items: form,
//         buttons: [{
//             text: CMD_OK,
//             handler: function () {

//                 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

//                 var uniqueIdArr = [];
//                 var po_no_arr = [];

//                 for (var i = 0; i < selections.length; i++) {
//                     var rec = selections[i];

//                     //원본
//                     //var uid = rec.get('uid_srcahd');  //Material unique_id
//                     var uid =  rec.get('unique_id_long');

//                     uniqueIdArr.push(uid);

//                     //console_logs( 'rec.get(unique_id) 출력테스트 >>>>' , rec.get(unique_id_long)   )
//                     console_logs( 'rec.get(unique_id) 출력테스트 >>>>' , uid   )
                   

//                     //추가작성
//                         var po_no = rec.get('po_no');
//                         po_no_arr.push(po_no);
//                         console_logs( '새로바뀐 함수의 po_no >>>>>>>>>>>>>>' , po_no);
                        
//                 }

//                 var form = gu.getCmp('formPanel').getForm();

                    
//                 form.submit({

//                     //url : CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',
//                     url : CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeSrcahd2',
//                     params:{
//                         unique_ids: uniqueIdArr,
//                         po_no : po_no
//                     },
//                     success: function(val, action){
//                         prWin.close();
//                         gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
//                         gMain.selPanel.store.load(function(){});
//                     },
//                     failure: function(val, action){
//                         prWin.close();
//                         Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
//                         gMain.selPanel.store.load(function(){});
//                     }
//                 });


//             }//btn handler
//         }, {
//             text: CMD_CANCEL,
//             handler: function () {
//                 if (prWin) {

//                     prWin.close();

//                 }
//             }
//         }]
//     });
//     prWin.show();
// },

});