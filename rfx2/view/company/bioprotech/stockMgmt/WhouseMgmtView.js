//창고 관리
Ext.define('Rfx2.view.company.bioprotech.stockMgmt.WhouseMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wh-mgmt-view',


    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.company.bioprotech.WhouseMgmt', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
//                item_code_dash: 's.item_code',
//                comment: 's.comment1'
            },
            ['whouse']
        );


        //메인 grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        /**  ----------------------------------------------------------------- 버튼(시작) ----------------------------------------------------------------- **/
        // 추가
        this.addBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_Enrollment', '등록'),
            tooltip: this.getMC('msg_btn_prd_add', '창고 Location 등록'),
            hidden: gu.setCustomBtnHiddenProp('addBtn'),
            disabled: true,
            handler: function () {
                // 메인그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selections = gm.me().grid.getSelectionModel().getSelection();
                if (selections.length <= 1) {
                    console_log('test', selections.length);
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 330,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        }, items: [
                            {
                                fieldLabel: '위치명',
                                xtype: 'textfield',
                                id: gu.id('class_name'),
                                name: 'class_name',
                                flex: 1
                            },
                            {
                                fieldLabel: '위치설명',
                                xtype: 'textfield',
                                id: gu.id('reserved_varchar2'),
                                name: 'reserved_varchar2',
                                flex: 1
                            }
                        ]

                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '추가',
                        width: 350,
                        height: 150,
                        items: form,
                        buttons: [{
                            text: '확인',
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var whouse_uid = rec.get('unique_id_long');
                                    gm.me().editFnc(val, whouse_uid, winPart, "add");
                                } else {
                                    Ext.MessageBox.alert(rror_msg_prompt, error_msg_content)
                                }
                            }
                        }, {
                            text: '취소',
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show();
                }
            }

        });

        // 수정
        this.updateBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: this.getMC('msg_btn_prd_add', '창고 Location 수정'),
            hidden: gu.setCustomBtnHiddenProp('updateBtn'),
            disabled: true,
            handler: function () {

                // 메인그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selections = gm.me().grid.getSelectionModel().getSelection();

                // 서브 그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selectionsSub = gm.me().locationGrid.getSelectionModel().getSelection()[0];

                if (selections.length <= 1) {
                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 330,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        }, items: [
                            {
                                fieldLabel: '위치명',
                                xtype: 'textfield',
                                id: gu.id('class_name'),
                                name: 'class_name',
                                value: selectionsSub.get('class_name'),
                                flex: 1
                            },
                            {
                                fieldLabel: '위치설명',
                                xtype: 'textfield',
                                id: gu.id('reserved_varchar2'),
                                name: 'reserved_varchar2',
                                value: selectionsSub.get('reserved_varchar2'),
                                flex: 1
                            }
                        ]

                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '수정',
                        width: 350,
                        height: 150,
                        items: form,
                        buttons: [{
                            text: '확인',
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var unique_id = selectionsSub.get('unique_id_long');
                                    gm.me().editFnc(val, unique_id, winPart, "update");
                                } else {
                                    Ext.MessageBox.alert(rror_msg_prompt, error_msg_content)
                                }
                            }
                        }, {
                            text: '취소',
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show();

                }


            }
        });

        // 삭제
        this.deleteBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: this.getMC('msg_btn_prd_add', 'location 삭제'),
            hidden: gu.setCustomBtnHiddenProp('deleteBtn'),
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: 'Location 관리',
                    msg: 'Location을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn === 'yes') {

                            var selectionsSub = gm.me().locationGrid.getSelectionModel().getSelection()[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/warehoused.do?method=editLocation',
                                params: {
                                    location_uid: selectionsSub.get('unique_id_long'),
                                    type: "delete"
                                },
                                success: function (result) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    gm.me().locationStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });


        // 바코드 프린터
        //구매자재 입고 포장별 바코드 출력 생성
        this.barcodeBtn = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: 'Location 바코드를 출력합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('barcodeBtn'),
            handler: function () {
                gMain.selPanel.printBarcode();
            }
        });

        // location 관리 store
        this.locationStore = Ext.create('Rfx2.store.company.bioprotech.WhouseLocationStore', {pageSize: 100});

        // Location 관리 grid 생성
        this.locationGrid = Ext.create('Ext.grid.Panel', {
            store: this.locationStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoHeight: true,
            frame: true,
            bbar: getPageToolbar(this.locationStore),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [this.addBtn, this.updateBtn, this.deleteBtn, this.barcodeBtn]
                }
            ],
            columns: [
                {text: 'Barcode', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'unique_id_long'},
                {text: '위치명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'class_name'},
                {text: '위치설명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'reserved_varchar2'},
                {text: '등록일', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'create_date'},
                {text: '등록자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'user_name'},

            ],
            title: 'Location 관리',
            name: 'whouse_location',
            autoScroll: true,
            listeners: {}
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '53%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, this.crudTab, this.locationGrid
            ]
        });


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                var whouse_uid = rec.get('unique_id_long');

                this.addBtn.enable();

                this.locationGrid.getStore().getProxy().setExtraParam('whouse_uid', whouse_uid);
                this.locationGrid.getStore().load();

            } else {
                this.addBtn.disable();
            }
        });

        this.locationGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    gm.me().updateBtn.enable();
                    gm.me().deleteBtn.enable();
                    gm.me().barcodeBtn.enable();
                    gm.me().locationGrid.getStore().load();
                } else {
                    gm.me().updateBtn.disable();
                    gm.me().deleteBtn.disable();
                    gm.me().barcodeBtn.disable();
                }
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load();

    },

    editFnc: function (val, unique_id, win, type) {
        Ext.MessageBox.show({
            title: 'Location 관리',
            msg: type === 'add' ? 'Location을 등록하시겠습니까?' : 'Location을 수정하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/warehoused.do?method=editLocation',
                        params: {
                            class_name: val['class_name'],
                            reserved_varchar2: val['reserved_varchar2'],
                            whouse_uid: unique_id,
                            location_uid: unique_id,
                            type: type
                        },
                        success: function (result) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().locationStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    printBarcode: function () {
        var selections = gm.me().locationGrid.getSelection();

        var udiArr = [];
        var classNameArr = [];
        var spcStr = "";

        for (var i = 0; i < selections.length; i++) {

            var rec = selections[i];
            var barcode_uid = rec.get('unique_id_long');
            var class_name = rec.get('class_name');
            var reserved_varchar2 = rec.get('reserved_varchar2');

            if (i != selections.length - 1) {
                spcStr += reserved_varchar2 + "^"
            } else {
                spcStr += reserved_varchar2;
            }

            udiArr.push(barcode_uid);
            classNameArr.push(class_name);
        }

        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: 500,
            height: 250,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '90%',
                        padding: '3 3 3 3',
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            fieldLabel: '프린터',
                            labelWidth: 80,
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
                            labelWidth: 80,
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
                            xtype: 'textfield',
                            name: 'class_name',
                            fieldLabel: '위치명',
                            margin: '5 5 5 5',
                            editable: false,
                            labelWidth: 80,
                            allowBlank: false,
                            value: class_name,
                            maxlength: '1',
                        },
                        {
                            xtype: 'numberfield',
                            name: 'print_qty',
                            fieldLabel: '출력매수',
                            labelWidth: 80,
                            margin: '5 5 5 5',
                            allowBlank: false,
                            value: 1,
                            maxlength: '1',
                        },
                    ]

                }

            ]
        });

        var selections = gm.me().locationGrid.getSelection();

        if (selections.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },

    prbarcodeopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '위치 바코드 출력',
            width: 500,
            height: 250,
            plain: true,
            items: form,
            buttons: [{
                text: '바코드 출력',
                handler: function () {

                    var selectionsMain = gm.me().grid.getSelection()[0];
                    var wh_name = selectionsMain.get('wh_name');

                    var selections = gm.me().locationGrid.getSelection();

                    var udiArr = [];
                    var locationNameArr = [];

                    for (var i = 0; i < selections.length; i++) {

                        var rec = selections[i];
                        var barcode_uid = rec.get('unique_id_long');
                        var location_name = rec.get('class_name');

                        udiArr.push(barcode_uid);
                        locationNameArr.push(location_name);
                    }

                    var form = gu.getCmp('formPanel').getForm();
                    var val = form.getValues(false);

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeLocation',
                        params: {
                            barcodeUids: udiArr,
                            print_type: 'LOCATION',
                            print_qty: val.print_qty,
                            location_names: locationNameArr,
                            wh_name: wh_name
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
    }
});



