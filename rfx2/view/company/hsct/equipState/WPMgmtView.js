Ext.define('Rfx2.view.company.hsct.equipState.WPMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-ver-view',

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField('item_code');
        
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });
        let redStar = '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: this.getMC('mes_order_recv_btn', '금형등록'),
            tooltip: this.getMC('mes_order_recv_btn_msg', '금형등록'),
            disable: true,
            handler: function () {
                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('msg_order_dia_header_title', '기본 금형정보를 입력하십시오.'),
                            width: '99%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: false,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'item_code',
                                            name: 'item_code',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: redStar + '금형번호',
										},
										{
                                            xtype: 'textfield',
                                            id: 'add_mtrl',
                                            name: 'add_mtrl',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '사용재료',
										},
										{
                                            xtype: 'textfield',
                                            id: 'specification',
                                            name: 'specification',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '규격',
										},
										{
                                            xtype: 'textfield',
                                            id: 'item_name',
                                            name: 'item_name',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: redStar + '금형명',
										},
										{
                                            xtype: 'textfield',
                                            id: 'maker',
                                            name: 'maker',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '제작처',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'make_date',
                                            name: 'make_date',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '제작연도',
                                            format: 'Y-m-d',
                                            // value: new Date()
										},
										{
                                            xtype: 'numberfield',
                                            id: 'cavity',
                                            name: 'cavity',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: 'Cavity',
										},
										{
                                            xtype: 'numberfield',
                                            id: 'quan',
                                            name: 'quan',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '벌수',
										},
										{
                                            xtype: 'textfield',
                                            id: 'division',
                                            name: 'division',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '구분',
                                        },
                                        {
                                            id: gu.id('rack_uid'),
                                            name: 'rack_uid',
                                            fieldLabel:'Rack',
                                            xtype: 'combo',
                                            width: '99%',
                                            padding: '0 0 10px 0',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().rackStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'class_code',
                                            valueField: 'unique_id',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{class_code}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
										{
                                            xtype: 'numberfield',
                                            id: 'core',
                                            name: 'core',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '코어갯수',
										},
										{
                                            xtype: 'numberfield',
                                            id: 'punc_cnt',
                                            name: 'punc_cnt',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '타발횟수',
                                        },
										{
                                            xtype: 'textfield',
                                            id: 'description',
                                            name: 'description',
                                            padding: '0 0 10px 0',
                                            width: '99%',
                                            fieldLabel: '비고',
                                        },
                                    ]
                                },

                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '금형등록'),
                    width: 600,
                    height: 600,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addMoldInfo',
                                        success: function (val, action) {
                                            console_logs('val >>>>', val);
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });
                                } else {
                                    console_logs('jbj',form);
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });

        this.editPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: this.getMC('mes_order_edit_btn', '금형수정'),
            tooltip: this.getMC('mes_order_edit_btn_msg', '금형수정'),
            disabled: true,
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                gm.me().rackStore.load();
                var form = Ext.create('Ext.form.Panel', {
                    id: 'editPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('mes_order_edit_btn', '공통정보 수정'),
                            width: '100%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'item_code',
                                            name: 'item_code',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('item_code'),
                                            fieldLabel: redStar + '금형번호',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'used_mtrl',
                                            name: 'used_mtrl',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('used_mtrl'),
                                            fieldLabel: '사용재료',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'specification',
                                            name: 'specification',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('specification'),
                                            fieldLabel: '규격',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'item_name',
                                            name: 'item_name',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('item_name'),
                                            fieldLabel: redStar + '금형명',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'maker',
                                            name: 'maker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('maker'),
                                            fieldLabel: '제작처',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'make_date',
                                            name: 'make_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            format: 'Y-m-d',
                                            value: select.get('make_date'),
                                            fieldLabel: '제작연도',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'fix_date',
                                            name: 'fix_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            format: 'Y-m-d',
                                            value: select.get('fix_date'),
                                            fieldLabel: '수리일',
                                            hidden: true,
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'cavity',
                                            name: 'cavity',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('cavity'),
                                            fieldLabel: 'Cavity',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'quan',
                                            name: 'quan',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('quan'),
                                            fieldLabel: '벌수',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'division',
                                            name: 'division',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('division'),
                                            fieldLabel: '구분'
                                        },
                                        {
                                            id: gu.id('rack_uid'),
                                            name: 'rack_uid',
                                            fieldLabel:'Rack',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().rackStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'class_code',
                                            valueField: 'unique_id',
                                            typeAhead: false,
                                            minChars: 1,
                                            value : select.get('rack_uid'),
                                            fieldLabel: 'rack',
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{class_code}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'core',
                                            name: 'core',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('core'),
                                            fieldLabel: '코어갯수'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'punc_cnt',
                                            name: 'punc_cnt',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('punc_cnt'),
                                            fieldLabel: '타발횟수',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'limit_press',
                                            name: 'limit_press',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('limit_press'),
                                            fieldLabel: '한계타발수',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'description',
                                            name: 'description',
                                            padding: '0 0 5px 30px',
                                            width: '95%',
                                            value: select.get('description'),
                                            fieldLabel: '비고',
                                        }

                                    ]
                                },

                            ]
                        },
                       
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '금형수정'),
                    width: 650,
                    height: 380,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('editPoForm').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    form.submit({
                                        url: CONTEXT_PATH + '/index/process.do?method=editMoldInfo',
                                        params: {
                                            unique_id : select.get('unique_id_long')
                                        },
                                        success: function (val, action) {
                                            gm.me().store.load();
                                            win.setLoading(false);
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    Ext.MessageBox.alert('알림', '금형 수정 원인을 확인해주세요.');
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });

        this.createStore('Rfx2.model.company.mjcm.Mold', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['mold']
        );

        buttonToolbar.insert(1, this.addPoAction);
        buttonToolbar.insert(2, this.editPoAction);

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.mjcm.ProductStoreByMold', {});

        this.addPoPrdPlus = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: CMD_ADD,
            tooltip: this.getMC('msg_btn_prd_add', '제품추가'),
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                console_logs('top_srcahd_uid', selections.get('srcahd_uid'));
                console_logs('assymap_uid', selections.get('unique_uid'));
                console_logs('ac_uid', selections.get('ac_uid'));
                var pj_uid = selections.get('unique_uid');

                var productGridExtra = Ext.create('Ext.grid.Panel', {
                    store: new Ext.data.Store(),
                    cls: 'rfx-panel',
                    id: gu.id('productGridExtra'),
                    collapsible: false,
                    multiSelect: false,
                    width: 750,
                    autoScroll: true,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    layout: 'fit',
                    forceFit: true,
                    columns: [
                        {
                            text: gm.me().getMC('msg_order_grid_prd_name', '품목코드'),
                            width: '25%',
                            dataIndex: 'item_code',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_name', '제품명'),
                            width: '25%',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_desc', '규격'),
                            width: '15%',
                            dataIndex: 'specification',
                            style: 'text-align:center',
                            sortable: false
                        },
                        
                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    listeners: {
                    },
                    autoScroll: true,
                    dockedItems: [
                        Ext.create('widget.toolbar', {
                            plugins: {
                                boxreorderer: false
                            },
                            cls: 'my-x-toolbar-default2',
                            margin: '0 0 0 0',
                            items: [
                                '->',
                                gm.me().getPrdExtraAdd(),
                                {
                                    text: CMD_DELETE,
                                    iconCls: 'af-remove',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('productGridExtra').getSelectionModel().getSelected().items[0];
                                            gu.getCmp('productGridExtra').getStore().removeAt(gu.getCmp('productGridExtra').getStore().indexOf(record));
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var record = gu.getCmp('productGridExtra').getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = gu.getCmp('productGridExtra').getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= gu.getCmp('productGridExtra').getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            gu.getCmp('productGridExtra').getStore().remove(record);
                                            gu.getCmp('productGridExtra').getStore().insert(index, record);
                                            gu.getCmp('productGridExtra').getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var record = gu.getCmp('productGridExtra').getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = gu.getCmp('productGridExtra').getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= gu.getCmp('productGridExtra').getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            gu.getCmp('productGridExtra').getStore().remove(record);
                                            gu.getCmp('productGridExtra').getStore().insert(index, record);
                                            gu.getCmp('productGridExtra').getSelectionModel().select(index, true);
                                        }
                                    }]
                                }
                            ]
                        })
                    ]
                });

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: gm.me().getMC('msg_btn_prd_extra_add', '추가제품등록'),
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                productGridExtra
                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('msg_btn_prd_extra_add', '추가 제품등록'),
                    width: 800,
                    height: 500,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var storeData = gu.getCmp('productGridExtra').getStore();
                                var srcahdUids = [];
                                for (var j = 0; j < storeData.data.items.length; j++) {
                                    var item = storeData.data.items[j];
                                    srcahdUids.push(item.get('srcahd_uid'))
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addMoldMap',
                                    params: {
                                        srcahdUids : srcahdUids,
                                        moldUid : selections.get('unique_id_long')
                                    },
                                    success: function (result, request) {
                                        var resultTxt = result.responseText;
                                        console_logs('result >>>', resultTxt);
                                        form.setLoading(false);
                                        var resultText = result.responseText;
                                            console_log('result:' + resultText);
                                            if(resultText === 'success') {
                                                Ext.MessageBox.alert('알림', '등록처리 되었습니다.');
                                            } else if (resultText === 'false') {
                                                Ext.MessageBox.alert('알림', '등록처리가 실패되었습니다<br>같은 증상 지속 시 시스템 관리자에게 문의하세요.');
                                            } else if (resultText === 'duplicate') {
                                                Ext.MessageBox.alert('알림', '중복제품이 등록되었습니다.<br>다시 확인해주세요.');
                                            }
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            gm.me().poPrdDetailStore.load();
                                            win.close();

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });


        this.deletePrdAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '제품삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: gm.me().getMC('msg_btn_prd_delete_title', '제품삭제'),
                    msg: gm.me().getMC('msg_btn_prd_delete_msg', '선택한 제품을 삭제하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var grid = gu.getCmp('gridContractCompany');
                            var record = grid.getSelectionModel().getSelected().items[0];
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=deleteMoldMap',
                                params: {
                                    unique_id: record.get('unique_id_long'),
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractCompany').getStore().load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
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
            flex: 1,
            frame: true,
            bbar: getPageToolbar(this.poPrdDetailStore),
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
                            html: this.getMC('msg_reg_prd_info_detail', '등록된 금형정보를 선택하십시오.'),
                            // html: "등록된 수주건을 선택하십시오.",
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addPoPrdPlus,
                        this.deletePrdAction
                    ]
                }
            ],
            columns: [
                { text: this.getMC('msg_order_grid_prd_fam', '제품코드'), width: 100, style: 'text-align:center', dataIndex: 'item_code', sortable: false },
                { text: this.getMC('msg_order_grid_prd_name', '제품명'), width: 150, style: 'text-align:center', dataIndex: 'item_name', sortable: false },
                { text: this.getMC('msg_order_grid_prd_name', '규격'), width: 150, style: 'text-align:center', dataIndex: 'specification', sortable: false },
            ],
            title: this.getMC('mes_reg_prd_info_msg', '해당 금형을 사용하는 제품'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    var tableName = 'sloast';
                    console_logs('e.record >>>>>>> ', e.record);
                    var unique_id = e.record.get('assymap_uid');
                    var ac_uid = e.record.get('ac_uid');
                    var value = e.value;
                    if (columnName === 'payment_condition') {
                        columnName = 'reserved3';
                    }

                    if (columnName === 'reserved_timestamp1_str') {
                        columnName = 'gr_date';
                    }
                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.me().poPrdDetailStore.load();
                    var store = gm.me().poPrdDetailStore;
                    var item = store.data.items;
                    console_logs('item >>>>', item);
                    var pj_total_price = 0.0;
                    for (var i = 0; i < item.length; i++) {
                        var item_desc = item[i];
                        var sales_amount = item_desc.get('sales_amount');
                        var sales_price = item_desc.get('sales_price');
                        pj_total_price = Number(pj_total_price) + (Number(sales_amount) * Number(sales_price));
                    }
                    gm.me().editAssytopPrice(pj_total_price, ac_uid);
                    gm.me().store.load();
                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_amount':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved_timestamp1_str':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved1':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved2':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'payment_condition':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_amount':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                        // return value;
                    };
                    break;
                case 'reserved_timestamp1_str':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'reserved1':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'reserved2':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'payment_condition':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections) {
                    gm.me().deletePrdAction.enable();
                } else {
                    gm.me().deletePrdAction.disable();
                }
            }
        });

        //grid 생성.
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
                    width: '73%',
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

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();
            }
            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                var status = rec.get('status');
                gm.me().addPoPrdPlus.enable();
                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_PJ_UID = rec.get('pj_uid');
                gUtil.enable(gMain.selPanel.editPoAction);
                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                gu.getCmp('selectedMtrl').setHtml('[' + item_code + '] ' + item_name);
                this.poPrdDetailStore.getProxy().setExtraParam('mold_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();
                
            } else {
                gUtil.disable(gMain.selPanel.editPoAction);
                gm.me().addPoPrdPlus.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC,BR');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);

        this.store.load(function (records) {
        });
       
    },

    getPrdExtraAdd: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            text: gm.me().getMC('msg_btn_prd_extra_add', '제품추가'),
            handler: function (widget, event) {

                var rec = gm.me().grid.getSelectionModel().getSelected().items[0];

                gm.me().searchProductStore.load();

                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchProductStore,
                    layout: 'fit',
                    title: gm.me().getMC('msg_product_add_dia_header_title1', '제품검색'),
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        { text: gm.me().getMC('msg_product_add_dia_model', '품묵코드'), flex: 1.5, style: 'text-align:center', dataIndex: 'item_code', sortable: true },
                        { text: gm.me().getMC('msg_product_add_dia_model', '품명'), flex: 1.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        { text: gm.me().getMC('msg_product_add_search_field3', '규격'), flex: 1.8, style: 'text-align:center', dataIndex: 'specification', sortable: true },
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 526,
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().searchProductStore,
                        displayInfo: true,
                        displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                        emptyMsg: "표시할 항목이 없습니다."
                        , listeners: {
                            beforechange: function (page, currentPage) {

                            }
                        }

                    }),
                    viewConfig: {
                        listeners: {
                            'itemdblClick': function (view, record) {
                                record.commit();
                                console_logs('>>> ddd', record);
                                saveStore.add(record);
                            }
                        },
                        emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
                        // emptyText: 'No data...'
                    },
                    dockedItems: [
                        {
                            dock: 'top',
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default1',
                            items: [
                                {
                                    width: partGridWidth,
                                    field_id: 'search_item_code',
                                    id: gu.id('search_item_code'),
                                    name: 'search_item_code',
                                    xtype: 'triggerfield',
                                    emptyText: gm.me().getMC('msg_product_add_search_field1', '품목코드'),
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore();
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id: 'search_item_name',
                                    id: gu.id('search_item_name'),
                                    name: 'search_item_name',
                                    xtype: 'triggerfield',
                                    emptyText: gm.me().getMC('msg_product_add_search_field2', '품명'),
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore();
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id: 'search_specification',
                                    id: gu.id('search_specification'),
                                    name: 'search_specification',
                                    xtype: 'triggerfield',
                                    emptyText: gm.me().getMC('msg_product_add_search_field3', '규격'),
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore();
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                            ]
                        }] // endofdockeditems
                }); // endof Ext.create('Ext.grid.Panel',

                searchItemGrid.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                    }
                });

                searchItemGrid.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];

                    rec.set(field, rec.get(field));

                });

                var saveStore = null;

                var saveStore = new Ext.data.Store({
                    model: gm.me().searchDetailStoreOnlySrcMap
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id: gu.id('saveFormGrid'),
                    layout: 'fit',
                    title: gm.me().getMC('msg_product_add_dia_header_title2', '저장목록'),
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        { text: gm.me().getMC('msg_product_add_dia_model', '품목코드'), flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true },
                        { text: gm.me().getMC('msg_product_add_dia_model', '품명'), flex: 2, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        { text: gm.me().getMC('msg_product_add_search_field3', '규격'), flex: 1, dataIndex: 'specification', style: 'text-align:center', sortable: true },
                    ],
                    renderTo: Ext.getBody(),
                    autoScroll: true,
                    dockedItems: [
                        Ext.create('widget.toolbar', {
                            plugins: {
                                boxreorderer: false
                            },
                            cls: 'my-x-toolbar-default2',
                            margin: '0 0 0 0',
                            items: [
                                '->',
                                {
                                    text: '저장목록 삭제',
                                    iconCls: 'af-remove',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('saveFormGrid').getSelectionModel().getSelected().items[0];
                                            if (record == null) {
                                                Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                                return;
                                            } else {
                                                gu.getCmp('saveFormGrid').getStore().removeAt(gu.getCmp('saveFormGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                            ]
                        })
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 400,
                    height: 600
                }); // endof Ext.create('Ext.grid.Panel',

                saveForm.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    rec.set(field, rec.get(field));
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: gm.me().getMC('msg_btn_prd_add', '제품추가'),
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, saveForm
                    ],
                    buttons: [{
                        text: CMD_ADD,
                        handler: function (btn) {
                            var selects = searchItemGrid.getSelectionModel().getSelection();
                            for (var i = 0; i < selects.length; i++) {
                                var record = selects[i];
                                saveStore.add(record);
                            }
                        }
                    }, {
                        text: CMD_OK,
                        handler: function (btn) {
                            winProduct.setLoading(true);
                            if (btn == "no") {
                                winProduct.setLoading(false);
                                winProduct.close();
                            } else {
                                var items = saveStore.data.items;
                                console_logs('items >>>>> ', items);
                                var store = gu.getCmp('productGridExtra').getStore();
                               
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    var id = item.get('unique_id_long');
                                    var item_code = item.get('item_code');
                                    var item_name = item.get('item_name');
                                    var specification = item.get('specification');
                                    
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'srcahd_uid': id,
                                        'item_code': item_code,
                                        'item_name': item_name,
                                        'specification': specification
                                    }));
                                }
                                
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            winProduct.close();
                        }
                    }]
                });
                winProduct.show();
            }
        });

        return action;
    },

    clearSearchStore: function () {
        var store = gm.me().searchDetailStoreOnlySrcMap;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 100);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },

    redrawSearchStore: function () {

        this.clearSearchStore();

        var item_code = null;
        var item_name = null;
        var specification = null;
        var model_no = null;

        var store = gm.me().searchProductStore;
        item_code = gu.getValue('search_item_code');
        item_name = gu.getValue('search_item_name');
        specification = gu.getValue('search_specification');
        model_no = gu.getValue('search_model_no');

        var supplier_name = '';
        try {
            supplier_name = gu.getValue('search_supplier_name');
        } catch (error) {

        }

        console_logs('item_code', item_code);
        console_logs('item_name', item_name);
        console_logs('specification', specification);
        console_logs('model_no', model_no);

        var bIn = false;
        if (item_code.length > 0) {
            store.getProxy().setExtraParam('item_code', '%'+item_code+'%');
            bIn = true;
        }

        if (item_name.length > 0) {
            store.getProxy().setExtraParam('item_name', '%'+item_name+'%');
            bIn = true;
        }

        if (specification.length > 0) {
            store.getProxy().setExtraParam('specification', '%'+specification+'%');
            bIn = true;
        }

        if (model_no.length > 0) {
            store.getProxy().setExtraParam('model_no', '%'+model_no+'%');
            bIn = true;
        }

        if (supplier_name.length > 0) {
            store.getProxy().setExtraParam('supplier_name', '%'+supplier_name+'%');
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 250);

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }
    },
    
    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    // searchProductStore : Ext.create('Mplm.store.ProductForMoldStore', {}),
    searchProductStore : Ext.create('Mplm.store.MaterialAStore', {}),
    rackStore : Ext.create('Rfx.store.RackSelectStore', {}),
    stores: [],
    ingredientList: [],
    storecount: 0,
    fields: []
});