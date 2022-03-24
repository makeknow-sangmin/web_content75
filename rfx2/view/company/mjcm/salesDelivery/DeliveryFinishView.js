//생산완료 현황
Ext.define('Rfx2.view.company.mjcm.salesDelivery.DeliveryFinishView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    preValue: 0,
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isDelProcess',
            items: [
                {
                    boxLabel: '납품완료포함',
                    checked: false
                },
            ],
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'req_date',
            text: "요청일자",
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        this.addSearchField({
            type: 'text',
            field_id: 'po_no',
            emptyText: '요청번호'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });

        

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4: case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        this.createStore('Rfx2.model.company.bioprotech.DeliveryFinish', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['project']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentPackingListStore', {});

        this.attcheContainerAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa_4-7-0_cubes_16_0_094c80_none',
            text: gm.getMC('CMD_Enter_container_information', '컨테이너 정보입력'),
            tooltip: this.getMC('msg_btn_prd_add', '컨테이너 입력'),
            disabled: false,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                if (rec.get('reserved_varchar1') === 'OC') {
                    var containerType = Ext.create('Mplm.store.ContainerTypeStore');
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
                                title: 'Contanier 종류, Container No, Seal Number를 기재하십시오.',
                                items: [
                                    {
                                        xtype: 'combo',
                                        fieldLabel: 'Container 종류',
                                        id: gu.id('container_type'),
                                        anchor: '97%',
                                        store: containerType,
                                        name: 'container_type',
                                        valueField: 'system_code',
                                        displayField: 'code_name_kr',
                                        emptyText: '선택해주세요.',
                                        // value: reservedVarchar1,
                                        listConfig: {
                                            loadingText: '검색중...',
                                            emptyText: '일치하는 항목 없음',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: gu.id('container_no'),
                                        anchor: '97%',
                                        name: 'container_no',
                                        fieldLabel: 'Container No'
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: gu.id('seal_no'),
                                        anchor: '97%',
                                        name: 'seal_no',
                                        fieldLabel: 'Seal Number'
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: 'Container 정보입력',
                        width: 450,
                        height: 250,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {
                                    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                    Ext.MessageBox.show({
                                        title: 'Container 정보입력',
                                        msg: '입력한 정보로 Container 정보를 기재하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                var val = form.getValues(false);
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/sales/delivery.do?method=createContainer',
                                                    params: {
                                                        do_uid: rec.get('unique_id_long'),
                                                        cont_type: val['container_type'],
                                                        cont_no: val['container_no'],
                                                        seal_no: val['seal_no']
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', 'Container 생성이 완료되었습니다.');
                                                        gm.me().store.load();
                                                        if (prWin) {
                                                            prWin.close();
                                                        }
                                                    },
                                                    failure: function (val, action) {

                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            },
                            {
                                text: CMD_CANCEL,
                                scope: this,
                                handler: function () {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            }
                        ]
                    });
                    prWin.show();
                } else {
                    Ext.MessageBox.alert('알림', '운송방법이 Ocean일 경우 Container 지정이 가능합니다.');
                }

            }
        });

        this.assignContainerAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa_4-7-0_cubes_16_0_094c80_none',
            text: gm.getMC('CMD_Container_designation', '컨테이너 지정'),
            tooltip: this.getMC('msg_btn_prd_add', '컨테이너 지정'),
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                if (rec.get('reserved_varchar1') === 'OC') {
                    if (Number(rec.get('container_cnt')) === 0) {
                        Ext.MessageBox.alert('알림', '해당 요청건에 대하여 컨테이너 생성이 되지 않았습니다.<br>컨테이너 선택 후 컨테이너를 지정하십시오.');
                    } else if (Number(rec.get('container_cnt')) === 1 && Number(rec.get('pallet_cnt')) === 1) {
                        console_logs('status', '컨테이너 자동할당');
                        Ext.MessageBox.show({
                            title: 'Container 지정',
                            msg: '해당 요청건에 구성된 팔레트를 컨테이너에 구성하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                if (btn == "no" || btn == "cancel") {
                                    return;
                                } else {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=designatedContainerSingle',
                                        params: {
                                            do_uid: rec.get('unique_id_long'),
                                            pallet_uid: rec.get('dl_uids')
                                        },
                                        success: function (val, action) {
                                            Ext.Msg.alert('완료', 'Container 지정이 완료되었습니다.');
                                            gm.me().store.load();
                                            gm.me().poPrdDetailStore.load();
                                            if (prWin) {
                                                prWin.close();
                                            }
                                        },
                                        failure: function (val, action) {

                                        }
                                    });
                                }
                            }
                        });
                    } else if (Number(rec.get('container_cnt')) > 1 || Number(rec.get('pallet_cnt')) > 1) {
                        console_logs('status', '컨테이너, 팔레트 선택기능으로 넘어감.');
                        var containerList = Ext.create('Ext.grid.Panel', {
                            cls: 'rfx-panel',
                            store: gm.me().containerListStore,
                            autoScroll: true,
                            autoHeight: true,
                            collapsible: false,
                            overflowY: 'scroll',
                            multiSelect: false,
                            width: '50%',
                            title: '생성 Container 리스트',
                            autoScroll: true,
                            margin: '0 0 0 10',
                            autoHeight: true,
                            frame: false,
                            border: false,
                            layout: 'fit',
                            forceFit: true,
                            viewConfig: {
                                markDirty: false
                            },
                            columns: [
                                {
                                    text: 'Container No',
                                    width: '50%',
                                    dataIndex: 'reserved_varchar2',
                                    style: 'text-align:center',
                                    valueField: 'no',
                                    typeAhead: false,
                                    allowBlank: false,
                                    sortable: true,
                                },
                                {
                                    text: 'Seal No',
                                    width: '50%',
                                    dataIndex: 'reserved_varchar3',
                                    style: 'text-align:center',
                                    typeAhead: false,
                                    allowBlank: false,
                                    sortable: true,
                                }

                            ],
                            listeners: {

                            },
                            autoScroll: true,
                            // dockedItems: [
                            //     Ext.create('widget.toolbar', {
                            //         plugins: {
                            //             boxreorderer: false
                            //         },
                            //         cls: 'my-x-toolbar-default2',
                            //         margin: '0 0 0 0',
                            //         items: [
                            //             '->',
                            //         ]
                            //     })
                            // ]
                        });

                        var palletList = Ext.create('Ext.grid.Panel', {
                            cls: 'rfx-panel',
                            store: gm.me().palletListStore,
                            autoScroll: true,
                            autoHeight: true,
                            collapsible: false,
                            overflowY: 'scroll',
                            multiSelect: false,
                            width: '50%',
                            title: '팔레트 List',
                            autoScroll: true,
                            margin: '0 0 0 10',
                            autoHeight: true,
                            frame: false,
                            border: false,
                            layout: 'fit',
                            forceFit: true,
                            viewConfig: {
                                markDirty: false
                            },
                            columns: [
                                {
                                    text: '팔레트 ID',
                                    width: '30%',
                                    dataIndex: 'po_no',
                                    style: 'text-align:center',
                                    valueField: 'no',
                                    typeAhead: false,
                                    allowBlank: false,
                                    sortable: true,
                                },
                                {
                                    text: '팔레트 종류',
                                    width: '40%',
                                    dataIndex: 'biot_pallet_name',
                                    style: 'text-align:center',
                                    typeAhead: false,
                                    allowBlank: false,
                                    sortable: true,
                                }
                
                            ],
                            listeners: {
                
                            },
                            autoScroll: true,
                            // dockedItems: [
                            //     Ext.create('widget.toolbar', {
                            //         plugins: {
                            //             boxreorderer: false
                            //         },
                            //         cls: 'my-x-toolbar-default2',
                            //         margin: '0 0 0 0',
                            //         items: [
                            //             '->',
                            //         ]
                            //     })
                            // ]
                        });

                        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                        if (rec.get('reserved_varchar1') === 'OC') {
                            gm.me().containerListStore.getProxy().setExtraParam('reserved_number1', rec.get('unique_id_long'));
                            gm.me().containerListStore.load();

                            gm.me().palletListStore.getProxy().setExtraParam('reserved_number2', rec.get('unique_id_long'));
                            gm.me().palletListStore.getProxy().setExtraParam('isContainerEmpty', 'Y');
                            gm.me().palletListStore.load();

                            var form = Ext.create('Ext.form.Panel', {
                                xtype: 'form',
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
                                        xtype: 'label',
                                        width: 750,
                                        height: 20,
                                        html: '&nbsp&nbsp<b>생성된 컨테이너 리스트와 팔레트 리스트를 선택하여 컨테이너 지정을 하십시오.</b>',
                                        style: 'color:black;'
                                    },
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        width: '99%',
                                        margin: '3 3 3 3',
                                        items: [
                                            containerList,
                                            palletList
                                        ]
                                    },
                                ]
                            });

                            var prWin = Ext.create('Ext.Window', {
                                modal: true,
                                title: 'Container 지정',
                                width: 800,
                                height: 500,
                                items: form,
                                plain: true,
                                overflowY: 'scroll',
                                buttons: [
                                    {
                                        text: CMD_OK,
                                        scope: this,
                                        handler: function () {
                                            var container = containerList.getSelectionModel().getSelection()[0];
                                            var pallet = palletList.getSelectionModel().getSelected().items[0];
                                            Ext.MessageBox.show({
                                                title: 'Container 지정',
                                                msg: '팔레트에 선택한 Container를 지정하시겠습니까?',
                                                buttons: Ext.MessageBox.YESNO,
                                                icon: Ext.MessageBox.QUESTION,
                                                fn: function (btn) {
                                                    if (btn == "no" || btn == "cancel") {
                                                        return;
                                                    } else {
                                                        Ext.Ajax.request({
                                                            url: CONTEXT_PATH + '/sales/delivery.do?method=designatedContainer',
                                                            params: {
                                                                palletUid: pallet.get('unique_id_long'),
                                                                containerUid: container.get('unique_id_long')
                                                            },
                                                            success: function (val, action) {
                                                                Ext.Msg.alert('완료', 'Container 지정이 완료되었습니다.');
                                                                gm.me().store.load();
                                                                gm.me().palletListStore.load();
                                                                // if (prWin) {
                                                                //     prWin.close();
                                                                // }
                                                            },
                                                            failure: function (val, action) {

                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    },
                                    {
                                        text: CMD_CANCEL,
                                        scope: this,
                                        handler: function () {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                        }
                                    }
                                ]
                            });
                            prWin.show();
                        } else {
                            Ext.MessageBox.alert('알림', '운송방법이 Ocean일 경우 Container 생성이 가능합니다.')
                        }
                    }
                } else {
                    Ext.MessageBox.alert('알림', '운송방법이 Ocean일 경우에 컨테이너 지정이 가능합니다.')
                }
            }
        });

        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            disabled: true,
            text: gm.getMC('CMD_Pallet_barcode_printing', 'Pallet바코드 출력'),
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.deliveryFinishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            disabled: true,
            text: gm.getMC('CMD_complete', '납품완료'),
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelected().items[0];
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
                            title: '납품일자를 지정하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('delivery_date'),
                                    anchor: '97%',
                                    name: 'delivery_date',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    value: new Date(),
                                    fieldLabel: '납품일자'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '납품완료',
                    width: 450,
                    height: 200,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '납품완료',
                                    msg: '선택한 제품을 입력한 일자로 납품처리 하시겠습니까?<br><br><font color=red><b>해당 제품의 재고가 존재하지 않거나<br>생산된 수량과 요청수량과 불일치 시 처리되지 않습니다.</b></font>',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            gMain.setCenterLoading(true);
                                            gm.me().loding_msg();
                                            Ext.Ajax.request({
                                                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                                                url: CONTEXT_PATH + '/sales/delivery.do?method=makedeliveryCompleteMulti',
                                                params: {
                                                    dl_uids: selection.get('dl_uids'),
                                                    pj_uid: selection.get('coord_key3'),
                                                    delivery_date: val['delivery_date'],
                                                    do_uid: selection.get('unique_id_long')
                                                },
                                                success: function (result, request) {
                                                    gMain.setCenterLoading(false);
                                                    gm.me().stop_msg();
                                                    Ext.MessageBox.alert('알림', '처리완료 되었습니다.');
                                                    gm.me().store.load();
                                                    gm.me().poPrdDetailStore.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                        form.close();
                                                    }
                                                }, // endofsuccess
                                                failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                });
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });

                prWin.show();
            }
        });

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: gm.getMC('CMD_Place_loading_list', '팔레트 적재리스트'),
            tooltip: '팔레트 적재현황을 다운로드 합니다.',
            disabled: true,
            handler: function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelected().items[0];
                var store = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentPackingListStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam('dl_uids', rec.get('dl_uids'))
                store.getProxy().setExtraParam("menuCode", 'SDL3_EXL');

                // store.getProxy().setExtraParam('orderBy', 'item_code');
                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    store.getProxy().setExtraParam(item.name, item.value);
                }
                var arrField = gm.me().gSearchField;
                try {
                    Ext.each(arrField, function (fieldObj, index) {
                        console_log(typeof fieldObj);
                        var dataIndex = '';
                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }
                        var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                        var value = Ext.getCmp(srchId).getValue();
                        if (value != null && value != '') {
                            if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value + '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch (noError) { }

                store.load({
                    scope: this,
                    callback: function (records, operation, success) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params: {
                                mc_codes: gUtil.getMcCodes()
                            },
                            success: function (response, request) {
                                gm.setCenterLoading(false);
                                //console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            // bbar: getPageToolbar(this.poPrdDetailStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedMtrl'),
                            html: this.getMC('msg_reg_prd_info_detail', '요청번호를 선택하십시오.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        },

                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.assignContainerAction
                        // this.rejectDeliveryOrder
                    ]

                }
            ],
            columns: [
                { text: this.getMC('msg_order_grid_prd_fam', '납품여부'), width: 100, style: 'text-align:center', dataIndex: 'delivery_process_yn', sortable: true },
                { text: this.getMC('msg_order_grid_prd_fam', 'Pallet No'), width: 100, style: 'text-align:center', dataIndex: 'po_no', sortable: true },
                { text: this.getMC('msg_order_grid_prd_name', '제품명'), width: 120, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                { text: this.getMC('msg_order_grid_prd_name', '기준모델'), width: 120, style: 'text-align:center', dataIndex: 'description', sortable: true },
                { text: this.getMC('msg_order_grid_prd_name', '규격'), width: 150, style: 'text-align:center', dataIndex: 'specification', sortable: true },
                { text: this.getMC('msg_order_grid_prd_name', 'LOT NO'), width: 100, style: 'text-align:center', dataIndex: 'pcs_desc_group', sortable: true },
                {
                    text: this.getMC('msg_order_grid_prd_name', '수량'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'gr_qty',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'gr_qty') {
                            context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: this.getMC('msg_order_grid_prd_name', 'BOX수'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'sledel_double1',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sledel_double1') {
                            context.record.set('sledel_double1', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_name', '무게'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'sledel_double2',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sledel_double1') {
                            context.record.set('sledel_double1', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { text: 'description', width: 150, style: 'text-align:center', dataIndex: 'sledel_description', sortable: false },
                { text: 'Container No', width: 150, style: 'text-align:center', dataIndex: 'cn_varchar2', sortable: false }

            ],
            title: this.getMC('mes_reg_prd_info_msg', '상세정보'),
            name: 'po',
            autoScroll: true,
        });
        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {

                }
            }
        });

        //grid 생성.
        // this.usePagingToolbar=false;
        // this.createGrid(searchToolbar, buttonToolbar/** */, option);
        this.createGrid(arr);
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,

                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        //버튼 추가.

        this.callParent(arguments);
        buttonToolbar.insert(1, this.barcodePrintAction);
        buttonToolbar.insert(2, this.deliveryFinishAction);
        buttonToolbar.insert(3, this.downloadSheetAction);
        buttonToolbar.insert(4, this.attcheContainerAction);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                gUtil.enable(gMain.selPanel.barcodePrintAction);
                gUtil.enable(gMain.selPanel.deliveryFinishAction);
                this.assignContainerAction.enable();
                this.downloadSheetAction.enable();
                var rec = selections[0];
                console_logs('rec ???', rec)
                gu.getCmp('selectedMtrl').setHtml('No : ' + rec.get('po_no') + ' / 운송방법 : ' + rec.get('transit_method'));
                console_logs('dl_uids ???', rec.get('dl_uids').length);
                if (rec.get('dl_uids').length > 0) {
                    this.poPrdDetailStore.getProxy().setExtraParam('ctr_flags', 'L|Y');
                    this.poPrdDetailStore.getProxy().setExtraParam('dl_uids', rec.get('dl_uids'));
                    // var chk = gu.getCmp('except_del').getValue();
                    // if (chk == true) {
                    // gm.me().poPrdDetailStore.getProxy().setExtraParam('except_del', 'N');
                    // } else {
                    // gm.me().poPrdDetailStore.getProxy().setExtraParam('except_del', 'N');
                    // }
                } else {
                    this.poPrdDetailStore.getProxy().setExtraParam('dl_uids', '-1');
                }
                this.poPrdDetailStore.load();
            } else {
                gUtil.disable(gMain.selPanel.barcodePrintAction);
                gUtil.disable(gMain.selPanel.deliveryFinishAction);
                this.assignContainerAction.disable();
                this.downloadSheetAction.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('exist_pallet_cnt', true);
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.getProxy().setExtraParam('state', 'I');
        this.store.load(function (records) {
        });
    },

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),
    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),
    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' }),
    containerListStore: Ext.create('Rfx2.store.company.bioprotech.ContainerListStore'),
    palletListStore: Ext.create('Rfx2.store.company.bioprotech.PalletListStore'),

    printBarcode: function () {
        var selection = gm.me().grid.getSelectionModel().getSelected().items[0];
        console_logs('>>> printBarcode selection', selection)
        var dl_uids = selection.get('dl_uids');
        if (dl_uids.length > 0) {
            gm.me().palletListStore.getProxy().setExtraParam('reserved_number2', selection.get('unique_id_long'));
            gm.me().palletListStore.getProxy().setExtraParam('is_not_state', 'Y')
        } else {
            gm.me().palletListStore.getProxy().setExtraParam('unique_ids', '-1');
        }
        gm.me().palletListStore.load();
        var palletList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().palletListStore,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '99%',
            title: '출력할 Pallet 번호를 선택하십시오.',
            autoScroll: true,
            margin: '0 0 0 10',
            autoHeight: true,
            frame: false,
            border: false,
            id: gu.id('palletList'),
            layout: 'fit',
            forceFit: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'Pallet No',
                    width: '50%',
                    dataIndex: 'po_no',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                }
            ],
            listeners: {

            },
            autoScroll: true,

        });

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: 500,
            height: 300,
            overflowY: 'scroll',
            multiSelect: false,
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
                palletList,
                {
                    xtype: 'fieldset',
                    // title: '입력',
                    broder: false,
                    collapsible: false,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: { top: 100, right: 5, bottom: 0, left: 0 }
                        }
                    },
                    items: [
                        //1장만 출력해서 전표에 붙이므로 출력매수는 삭제
                        {

                            xtype: 'fieldcontainer',
                            //fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'vbox',

                            // defaults: {
                            //     flex: 1,
                            //    // hideLabel: true,
                            // },

                            items: [
                                {
                                    fieldLabel: '프린터',
                                    xtype: 'combo',
                                    margin: '5 5 5 5',
                                    id: gu.id('printer'),
                                    name: 'printIpAddress',
                                    store: Ext.create('Mplm.store.PrinterStore'),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '프린터 선택',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: '프린트 라벨',
                                    xtype: 'combo',
                                    margin: '5 5 5 5',
                                    id: gu.id('print_label'),
                                    name: 'labelSize',
                                    store: Ext.create('Mplm.store.PrintLabelStore'),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '라벨 선택',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '5 5 5 5',
                                    //width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                },

                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: '출력 구분',
                                    margin: '5 5 5 5',
                                    //width: 200,
                                    allowBlank: false,
                                    items: [
                                        { boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true }
                                    ]
                                }


                            ]
                        }
                    ]
                }
            ]
        });//Panel end...

        var comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == '192.168.20.12') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        var comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == 'L100x150') {
                        comboLabel.select(record);
                    }
                });
            }
        );

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

    prbarcodeopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '팔레트바코드 출력',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var selectionsBarcode = gu.getCmp('palletList').getSelectionModel().getSelected().items[0];
                    var uniqueIdArr = [];
                    var bararr = [];
                    var po_no_arr = [];
                    var reserved_double1_arr = [];
                    var pj_code_arr = [];
                    var biotPoNo = [];
                    //회사이름 추가작성
                    var wa_nameArr = [];
                    if (selectionsBarcode !== undefined) {
                        var pallet_arr = [];
                        for (var x = 0; x < selectionsBarcode.length; x++) {
                            var rec = selectionsBarcode[x];
                            var uid = rec.get('unique_id_long');
                            uniqueIdArr.push(uid);
                            var po_no = rec.get('po_no');
                            po_no_arr.push(po_no);

                            console_logs('po_no >>>>>>>>>>>>>>', po_no);
                            console_logs('uniqueIdArr >>>>>>>>>>>>>>', uniqueIdArr);
                        }
                        for (var i = 0; i < selections.length; i++) {
                            var rec = selections[i];
                            console_logs("셀렉션 i 출력 >>> ", selections[i]);
                            var uid = rec.get('unique_id_long');  //Product unique_id
                            var item_code = rec.get('item_code');
                            var item_name = rec.get('item_name');
                            var specification = rec.get('specification');
                            var reserved_double1 = rec.get('reserved_double1');
                            var wa_name = rec.get('wa_name');
                            var pallet_name = rec.get('pallet_name');

                            var poNumber = rec.get('po_no');
                            biotPoNo.push(poNumber);
                            //console_logs('pallet_name >>>'  , pallet_name);
                            pallet_arr.push(pallet_name);
                            wa_nameArr.push(wa_name);
                            var bar_spec =
                                '<' + item_code + '>' + '|' + item_name + '|' + specification;
                            bararr.push(bar_spec);
                            reserved_double1_arr.push(reserved_double1);
                            var pj_code = rec.get('pj_code');
                            pj_code_arr.push(pj_code)
                            console_logs('pj_code >>>>>>>>>>>>>>', pj_code);
                        }
                        var form = gu.getCmp('formPanel').getForm();

                        console_logs('poNumber >>>>>>>>>>>>>>', poNumber);

                        //바코드 출력 회사별 분기


                        switch (vCompanyReserved4) {

                            case 'MJCM01KR':
                                console_logs("MJCM01KR  분기 출력 >>>", reserved_double1_arr)
                                form.submit({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',
                                    params: {
                                        rtgastUids: uniqueIdArr,
                                        barcodes: bararr,
                                        po_no: po_no_arr,
                                        //원본
                                        order_multiple: reserved_double1_arr,
                                        //order_multiple : 1,
                                        pj_code_arr: pj_code_arr,
                                        wa_name: wa_nameArr
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

                                break;

                            case 'BIOT01KR':
                                var printIpAddress = gu.getCmp('printer').getValue();
                                var labelSize = gu.getCmp('print_label').getValue();

                                //바이오
                                form.submit({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',
                                    //url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',
                                    params: {

                                        //원본
                                        rtgastUids: selectionsBarcode.get('unique_id_long'),
                                        barcodes: bararr,
                                        po_no: selectionsBarcode.get('po_no'),          //파레트 넘버
                                        order_multiple: reserved_double1_arr,
                                        pj_code_arr: pj_code_arr,
                                        wa_name: wa_nameArr,
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        palletList: pallet_arr,
                                        labelType: 'pallet',
                                        biotPoNo: biotPoNo,        //출하 요청번호

                                        //labelType: 'sales',
                                        //하단 임의 추가
                                        //srcahd_uid_list: selectionsBarcode.get('unique_id_long'),
                                        //item_code_uid_list: selectionsBarcode.get('unique_id_long'),
                                        //item_name_uid_list: selectionsBarcode.get('unique_id_long'),

                                        //임의로 출력되게 자재바코드에 맞게 해놓음
                                        //srcahd_uid_list : [11030225002037],

                                        // srcahd_uid_list : [selectionsBarcode.get('unique_id_long')],
                                        // lotrtgastUids : selectionsBarcode.get('unique_id_long'),
                                        // lotArray : null,
                                        // labelType : 'pallet',
                                        // print_type : 'EACH',
                                        // print_qty:1,
                                        // printQuanArray:1,
                                        // specArr : null,
                                        // quanArray : [2000],
                                        // item_code_uid_list : 'EP370002',
                                        // item_name_uid_list : ['test'],
                                        // cartmap_uid_list : [selectionsBarcode.get('unique_id_long')],


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
                                })
                                break;


                            default:
                                var printIpAddress = gu.getCmp('printer').getValue();
                                var labelSize = gu.getCmp('print_label').getValue();

                                //국송
                                form.submit({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',

                                    params: {
                                        rtgastUids: selectionsBarcode.get('unique_id_long'),
                                        barcodes: bararr,
                                        po_no: selectionsBarcode.get('po_no'),
                                        order_multiple: reserved_double1_arr,
                                        pj_code_arr: pj_code_arr,
                                        wa_name: wa_nameArr,
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        palletList: pallet_arr,


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
                                })
                                break;


                        }




                    } else {
                        Ext.MessageBox.alert('알림', 'Pallet 번호를 선택하십시오.')
                    }

                    // }//else 끝
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
    },//바코드관련 끝

    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },

    stop_msg: function () {
        Ext.MessageBox.hide();
    },
});