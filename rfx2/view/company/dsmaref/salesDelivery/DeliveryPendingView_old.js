//수주관리 메뉴
Ext.define('Rfx2.view.company.dsmaref.salesDelivery.DeliveryPendingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    preValue: 0,
    initComponent: function () {

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField ('reserved_varchar6');
        this.addSearchField('wa_name');
        this.addSearchField('reserved_varchara');
        this.addSearchField('reserved_varchar5');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');


        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.dlAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '출하',
            tooltip: '출하를 실시합니다',
            disabled: true,
            handler: function () {
                gm.me().prwinDl();
            }
        });

        // 바코드 검색 추가
        this.inputBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 입력',
            tooltip: '제품의 바코드를 입력하여 검색 합니다.',
            handler: function () {
                gm.me().inputBarcode();
            }
        });

        //출고요청
        this.addDeliveryConfirm = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '출고확인',
            tooltip: '출고확인 확정',
            disabled: true,
            handler: function() {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout:'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'component',
                            html: '미할당 재고 사용시 검색',
                            width: '100%',
                            style: 'color:#1549A7;text-align:center; align:center',
                        },
                        {
                            xtype:'numberfield',
                            fieldLabel:'재고수량',
                            id:'stock_quan',
                            name:'stock_quan',
                            readOnly:true,
                            width:'80%',
                            margin:'0 0 5px 0',
                            value: select.get('wh_qty')
                        },{
                            xtype:'button',
                            text:CMD_SEARCH/*'검색'*/,
                            margin:'0 0 5px 10px',
                            width:'17%',
                            listeners: {
                                click: function(btn) {
                                    gm.me().viewStockStatus(select);
                                }
                            }
                        },{
                            xtype:'numberfield',
                            fieldLabel:'출고수량',
                            id:'out_quan',
                            name:'out_quan',
                            width:'100%',
                            margin:'0 0 5px 0',
                            value: select.get('quan')
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
					modal: true,
                    title: gm.getMC('CMD_Release','출고'),
                    width: 400,
                    height: 180,
                    plain: true,
					items: form,
					buttons: [{
						text: CMD_OK,
						handler: function(btn) {
							 if (btn == "no") {
                                win.close();
                            } else {
                                // var form = Ext.getCmp('addPoForm').getForm();
                                // if(form.isValid()) {
                                //     var val = form.getValues(false);
                                    
                                //     Ext.Ajax.request({
                                //         url: CONTEXT_PATH + '/production/schdule.do?method=addProjectOnly',
                                //         params:{
                                //             reserved_varcharf:val['reserved_varcharf'],
                                //             pj_type:val['pj_type'],
                                //             reserved_varchark:val['reserved_varchark'],
                                //             pm_uid:val['pm_uid'],
                                //             delivery_plan:val['delivery_plan'],
                                //             pj_code:val['pj_code'],
                                //             pj_name:val['pj_name'],
                                //             order_com_unique:val['order_com_unique'],
                                //             reserved_varchar3:val['reserved_varchar3'],
                                //             reserved_varcharc:val['reserved_varcharc'],
                                //             reserved_varchar2:val['reserved_varchar2']
                                //         },
                                //         success: function(val, action) {
                                //             gm.me().store.load();
                                //             win.close();
                                //         },
                                //         failure: extjsUtil.failureMessage
                                //     });
                                    
                                // } else {
                                //     // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                //     Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                // }
                            }
                        }
                    }, {
						text: CMD_CANCEL,
                        handler: function(btn) {
                            win.close();
                        }
					}]
                });win.show();
            }
       });

        this.createStore('Rfx2.model.ProduceMgmtForBOM', [{
            property: 'unique_id',
            direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        this.store.getProxy().setExtraParam('pcr_div', 'MAKE');
        this.store.getProxy().setExtraParam('stoqty_pj_uid_over', true);

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.inputBarcodeAction);
        buttonToolbar.insert(1, this.dlAction);
        buttonToolbar.insert(2, this.addDeliveryConfirm);

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
                    break;
                case 'Y':
                    return 'blue-row';
                    break;
                case 'P':
                    return 'orange-row';
                    break;
                case 'DE':
                    return 'red-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
            }
        });


        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            switch(dataIndex) {
                case 'top_status':
                    o['renderer'] = function(value, meta, record) {
                        var route_type = null;
                        if(record != null && record.length>0) {
                            route_type = record.get('route_type');
                        }
                        return gm.me().getAssyStatus(value, meta, route_type);
                    }
                break;
            }

            if(o['dataType'] === 'number') {
                o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                    if(gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        if(summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                };
            }

        });

        var option = {
            features: [{
                ftype: 'summary',
                dock: 'top'
            }]
        };

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(searchToolbar, buttonToolbar, option);

        buttonToolbar.insert(4, '-');

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length == 1) {
                    gm.me().dlAction.enable();
                    gm.me().addDeliveryConfirm.enable();
                } else {
                    gm.me().dlAction.disable();
                    gm.me().addDeliveryConfirm.disable();
                }
            }
        });

        this.callParent(arguments);

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');

        this.store.load(function(record) {

        });

    },
    prwinDl: function () {

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];

        var status = selection.get('status');
        var wh_qty = selection.get('wh_qty');
        var available_qty = selection.get('wh_qty');
        var reserved_number8 = selection.get('reserved_number8');
        if(reserved_number8 < 0) {
            reserved_number8 = 0;
        }
        var aprv_date = selection.get('reserved_timestamp1');
        var lotNo = selection.get('reserved_varchar6');

        var store = Ext.create('Rfx2.store.company.kbtech.ReservedQtyStore', {});
        store.getProxy().setExtraParam('uid_srcahd', selection.get('srcahd_uid'));
        store.getProxy().setExtraParam('uid_project', selection.get('ac_uid'));
        store.load();

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            cls: 'rfx-panel',
            title: '출하 할 수량을 입력하십시오 ─────── 예약 잔량 : ' + reserved_number8 + '개',
            id: gu.id('reservedQtyGrid'),
            collapsible: false,
            multiSelect: false,
            width: 450,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: 'LOT NO',
                    width: '30%',
                    dataIndex: 'reserved2',
                    renderer : function(value) {
                        if(value == null || value.length < 1) {
                            return '없음';
                        } else {
                            return value;
                        }
                    },
                    sortable: false
                },
                {
                    text: '출하가능수량',
                    width: '25%',
                    dataIndex: 'wh_qty',
                    renderer : function(value) {
                        if(value == null || value.length < 1) {
                            return 0;
                        } else {
                            return value;
                        }
                    },
                    sortable: false
                },
                {
                    text: '출하할수량',
                    width: '25%',
                    dataIndex: 'out_qty',
                    editor: 'numberfield',
                    sortable: false
                },
                {
                    text: '비고',
                    width: '25%',
                    dataIndex: 'reserved3',
                    sortable: false
                },
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
                listeners: {
                    beforeedit: function(editor, context, eOpts) {
                        if(context.field === 'out_qty') {
                            gm.me().preValue = context.value == null ? 0 : context.value;
                        }
                    },
                    edit: function(editor, context, eOpts) {
                        if(context.field === 'out_qty') {
                            var records = context.store.data.items;
                            var value = context.value;
                            var curWhQty = context.record.get('wh_qty');
                            if (value > curWhQty) {
                                Ext.Msg.alert('경고', '출하 가능 수량을 초과할 수 없습니다.');
                                context.record.set('out_qty', gm.me().preValue);
                            } else {
                                var sum = 0;
                                var reservedSum = 0;
                                for(var i = 0; i < records.length; i++) {
                                    var curLotNo = records[i].get('reserved2');
                                    var outQty = records[i].get('out_qty');

                                    if(curLotNo !== lotNo && outQty !== undefined && outQty !== null) {
                                        reservedSum += outQty;
                                        if(reservedSum > reserved_number8) {
                                            reservedSum -= outQty;
                                            Ext.Msg.alert('경고', '예약 가능 수량을 초과할 수 없습니다.');
                                            context.record.set('out_qty', gm.me().preValue);
                                            break;
                                        }
                                    }
                                    if(outQty != null) {
                                        sum += records[i].get('out_qty');
                                    }
                                }

                                gu.getCmp('reservedQtyGrid').setTitle('출하 할 수량을 입력하십시오 ' +
                                    '─────── 예약 잔량 : ' + (reserved_number8 - reservedSum) + '개');
                                gu.getCmp('requestQty').setValue(sum);
                            }
                        }
                        gm.me().preValue = 0;
                    }
                }
            },
            autoScroll: true
        });

        if (available_qty > 0) {
            var form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'form',
                fieldDefaults: {
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: '출하를 실시합니다.',
                        items: [
                            grid,
                            {
                                fieldLabel: '출하수량',
                                xtype: 'textfield',
                                id: gu.id('requestQty'),
                                name: 'requestQty',
                                anchor: '97%',
                                value: 0,
                                editable: false
                            },
                            {
                                fieldLabel: '납품장소',
                                xtype: 'textarea',
                                id: gu.id('reserved_varchar3'),
                                name: 'reserved_varchar3',
                                anchor: '97%',
                                value: selection.get('reserved_varchar3')
                            },
                            {
                                fieldLabel: '납품방법',
                                xtype: 'textfield',
                                id: gu.id('reserved_varchar4'),
                                name: 'reserved_varchar4',
                                anchor: '97%',
                                value: selection.get('reserved_varchar4')
                            },
                            {
                                fieldLabel: '납품처정보',
                                xtype: 'textarea',
                                id: gu.id('reserved_varchark'),
                                name: 'reserved_varchark',
                                anchor: '97%',
                                value: selection.get('reserved_varchark')
                            },
                            {
                                xtype: 'datefield',
                                anchor: '97%',
                                name: 'aprv_date',
                                id: gu.id('aprv_date'),
                                fieldLabel: '출하날짜',
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                value: new Date(aprv_date)
                            }
                        ]
                    }
                ]
            });

            var myHeight = 600;
            var myWidth = 500;

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '출하',
                width: myWidth,
                height: myHeight,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        if (gu.getCmp('requestQty').getValue() <= selection.get('available_qty')) {
                            Ext.MessageBox.show({
                                title: '출하확정',
                                msg: '출하를 하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {

                                    if (result == 'yes') {

                                        prWin.setLoading(true);

                                        var selections = gm.me().grid.getSelectionModel().getSelection();
                                        var curLotNo = selections[0].get('reserved_varchar6');

                                        var srcahdArr = [];
                                        var requestQtyArr = [];
                                        var projectArr = [];

                                        var reservedQtyStore = gu.getCmp('reservedQtyGrid').getStore();
                                        var records = reservedQtyStore.data.items;

                                        var lotNoArr = [];
                                        var lotQtyArr = [];
                                        var reservedSum = 0;

                                        for (var i = 0; i < records.length; i++) {
                                            if(records[i].get('out_qty') != undefined
                                                && records[i].get('out_qty') != null
                                                && records[i].get('out_qty') !== 0) {
                                                lotNoArr.push(records[i].get('reserved2'));
                                                lotQtyArr.push(records[i].get('out_qty'));
                                                var lotNo = records[i].get('reserved2');
                                                if(curLotNo !== lotNo) {
                                                    reservedSum += records[i].get('out_qty');
                                                }
                                            }
                                        }

                                        if (gu.getCmp('requestQty').getValue() > 0) {
                                            for (var i = 0; i < selections.length; i++) {
                                                srcahdArr.push(selections[i].get('srcahd_uid'));
                                                requestQtyArr.push(gu.getCmp('requestQty').getValue());
                                                projectArr.push(selections[i].get('ac_uid'));
                                            }

                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=assignShipmentBySrcahd',
                                                params: {
                                                    srcahdUids: srcahdArr,
                                                    requestQtys: requestQtyArr,
                                                    projectArr: projectArr,
                                                    reserved_varchar3: gu.getCmp('reserved_varchar3').getValue(),
                                                    reserved_varchar4: gu.getCmp('reserved_varchar4').getValue(),
                                                    reserved_varchark: gu.getCmp('reserved_varchark').getValue(),
                                                    aprv_date: gu.getCmp('aprv_date').getValue(),
                                                    lotNoArr: lotNoArr,
                                                    lotQtyArr: lotQtyArr,
                                                    useReservedQty: reservedSum
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
                                                    gMain.selPanel.store.load(function () {
                                                    });
                                                    prWin.setLoading(false);
                                                    prWin.close();
                                                },
                                                failure: function (val, action) {
                                                    Ext.Msg.alert('', '출하 요청 도중 오류가 발생하였습니다.');
                                                    prWin.setLoading(false);
                                                    prWin.close();
                                                }
                                            });
                                        } else {
                                            Ext.Msg.alert('', '최소 1개 이상의 수량을 입력하시기 바랍니다.');
                                        }

                                    } else {
                                        prWin.close();
                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                            });
                        } else {
                            Ext.Msg.alert('', '요청수량이 출하가능 수량보다 더 많습니다.');
                        }

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
        } else {
            Ext.Msg.alert('', '출하 가능한 상품이 아닙니다.');
        }
    },
    inputBarcode: function () {

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '바코드를 스캔하시기 바랍니다.',
            frame: false,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'textarea',
                    id: gu.id('barcodeData'),
                    name: 'barcode',
                    anchor: '100%',
                    width: 480,
                    height: 370
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 입력',
            width: 500,
            height: 500,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var barcodeData = gu.getCmp('barcodeData').getValue().split('\n');
                    barcodeData.pop();  //마지막 공백 제거
                    var uniqueBarcodeData = barcodeData.reduce(function(a, b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);
                    gm.me().store.getProxy().setExtraParam('projectUids', uniqueBarcodeData);
                    gm.me().store.load(function(records) {
                        gm.me().store.getProxy().setExtraParam('projectUids', null);
                    });
                    if (prWin) {
                        prWin.close();
                    }
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
        gu.getCmp('barcodeData').focus(false, 500);
    },

    viewStockStatus: function(rec) {
        var win = Ext.create('ModalWindow', {
            title: '재고현황',
            width: 600,
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
                    id: 'stockGrid',
                    autoScroll: true,
                    autoWidth: true,
                    flex: 3,
                    padding: '5',
                    items:gm.me().getStockGrid()
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
    
    getStockGrid: function() {
        var STOCK_COLUMN = [];

        STOCK_COLUMN.push(
            { header:'No.', xtype:'rownumberer', width:'10%', align:'left', resizable:true, sortable:true },
            { header:'수주번호', dataIndex:'pj_code', width:'30%', align:'left', resizable:true, sortable:true },
            { header:'수주명', dataIndex:'pj_name', width:'30%', align:'left', resizable:true, sortable:true, 
                renderer: function(value) {
                    if(value == null || value.length < 1) {
                        return '미할당';
                    }
                }    
            },
            { header:'상태', dataIndex:'state', width:'15%', align:'left', resizable:true, sortable:true, renderer:function(value,meta) {return gm.me().getAssyStatus(value, meta)} },
            { header:'재고수량', dataIndex:'wh_qty', width:'15%', align:'left', resizable:true, sortable:true }
        )

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        this.stockStatusStore.getProxy().setExtraParam('uid_srcahd', rec.get('unique_id_long'));
        this.stockStatusStore.getProxy().setExtraParam('showAll', true);
        this.stockStatusStore.load();

        stockGrid = Ext.create('Ext.grid.Panel', {
            id: 'pr-div2',
            store: this.stockStatusStore,
            multiSelect: true,
            stateId: 'stateGridsub',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoScroll : true,
            autoHeight: true,
            filterable: true,
            height: 650,  // (getCenterPanelHeight()/5) * 4
    //        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/STOCK_COLUMN,
            plugins:[
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                }),{
                    ptype: 'gridfilters'
                }
            ],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            dockedItems: [
                {
                    dock : 'top',
                    xtype : 'toolbar',
                    items : [
                        // this.addPRDAction, this.removePRDAction
                    ]
                }
            ]
        });

        stockGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    console_logs('>>>>>>>>>Stock Grid Select', selections);
                } else {
                    
                }
            }
        });

    //     stockGrid.on('edit', function(editor, e) {
    //         console_logs('===prd_grid', 'pppp');
	// 	   var rec = e.record;
    //        var field = e['field'];
    //         console_logs('===rec', rec);
    //         console_logs('===field', field);

    //        var unique_id = rec.get('unique_id');
    //        var codeName = rec.get('codeName');
    //        var code_order = rec.get('code_order');
    //        console_logs('===codeName', codeName);

	// 	   Ext.Ajax.request({
    //             url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
    //             params: {
    //                 unique_id:unique_id,
    //                 type:'EDIT',
    //                 codeName:codeName,
    //                 code_order:code_order
    //             },
    //             success: function(result, request) {
	// 				var result = result.responseText;
	// 				gm.me().store.load();
    //                 // console_logs("", result);

    //             },
    //             failure: extjsUtil.failureMessage
    //         });
    //    })

        return stockGrid;
    },

    stockStatusStore: Ext.create('Mplm.store.CurStockStore', {}),
});
