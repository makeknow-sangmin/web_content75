//수주관리 메뉴
Ext.define('Rfx2.view.company.hanjung.salesDelivery.RecvMgmtKbTechView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
    inputBuyer: null,
    wthContentStore: Ext.create('Rfx2.store.company.hanjung.WthDrawEtcStore', {}),
    wthContentRecords: null,
    initComponent: function () {
        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'combo'
            , field_id: 'status'
            , emptyText: '진행상태'
            , store: "RecevedStateStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField({
            type: 'combo'
            , field_id: 'pm_uid'
            , emptyText: '영업담당자'
            , store: "UserDeptStore"
            , displayField: 'user_name'
            , valueField: 'unique_id'
            , value: vCUR_USER_UID
            , params: { dept_code: "D102" }
            , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
        });


        this.addSearchField('reserved_varchar2');
        this.addSearchField('reserved_varchar1');

        this.addSearchField (
        {
            field_id: 'date_type'
            ,store: "DatetypeStoreSRO5"
            ,displayField: 'codeName'
            ,emptyText: '기준기간'
            ,valueField: 'systemCode'
            ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'search_date',
            //text: gm.getMC('CMD_Order_Date', '등록일자'),
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        // this.addSearchField({
        //     type: 'dateRange',
        //     field_id: 'regist_date',
        //     text: gm.getMC('CMD_Order_Date', '등록일자'),
        //     sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
        //     edate: new Date()
        // });
        //
        // this.addSearchField({
        //     type: 'dateRange',
        //     field_id: 'reserved_timestamp1',
        //     text: "입고일자",
        //     sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
        //     edate: new Date()
        // });



        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        this.defaultOrderAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문미납현항',
            tooltip: '주문미납현항',
            disabled: false,
            handler: function () {

            }
        });
        this.createStore('Rfx2.model.RecvMgmtHanjung', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
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

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수주수정',
            tooltip: '수주정보를 수정합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                console_logs('zzzzzzzz','zzzzzzzzz');
                gm.me().addPoEditWindow(rec);
            }
        });

        this.pdfAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '수주대장',
            tooltip: '수주대장을 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var rtgast_uid = 'ORDER_' + rec.get('reserved_varcharh');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printOb',
                    params: {
                        rtgast_uid: rtgast_uid,
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        sum_wthdraw_flag: 'Y',
                        detail_flag: 'Y',
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        var pdfPathSplit = pdfPath.split('/');
                        var fileName = pdfPathSplit[pdfPathSplit.length - 1];

                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=makePdfImage',
                                params: {
                                    fileName: pdfPath,
                                    extension: 'png'
                                },
                                reader: {
                                    pdfPath: 'pdfPath'
                                },
                                success: function (result, request) {
                                    var jsonData = Ext.JSON.decode(result.responseText);
                                    var pdfPath = jsonData.pdfPath;
                                    console_log(pdfPath);
                                    if (pdfPath.length > 0) {
                                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                        top.location.href = url;
                                    }
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    failure: extjsUtil.failureMessage
                });
            }
        });

        this.attachCertification = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '사업자등록증 첨부',
            tooltip: '사업자등록증 첨부',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var type = 'CERTI'
                var reserved_varcharc = rec.get('reserved_varcharc');
                if (reserved_varcharc == 'Y') {
                    Ext.MessageBox.show({
                        title: '사업자등록증 첨부',
                        msg: '기존 첨부된 파일이 존재합니다. 파일 첨부를 진행하시겠습니까?<br>기존 첨부된 파일은 삭제 처리 후 업로드 진행됩니다.',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                gm.me().attachedCertificate(pj_uid, type);
                            } else {
                                prWin.close();
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    })
                } else {
                    gm.me().attachedCertificate(pj_uid, type);
                }
            }
        });

        this.attachIdCard = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '신분증 첨부',
            tooltip: '신분증 첨부',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var reserved_varchard = rec.get('reserved_varchard');
                var type = 'ID'
                if (reserved_varchard == 'Y') {
                    Ext.MessageBox.show({
                        title: '신분증 첨부',
                        msg: '기존 첨부된 파일이 존재합니다. 파일 첨부를 진행하시겠습니까?<br>기존 첨부된 파일은 삭제 처리 후 업로드 진행됩니다.',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                gm.me().attachedIdCard(pj_uid, type);
                            } else {
                                prWin.close();
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    })
                } else {
                    gm.me().attachedIdCard(pj_uid, type);
                }
            }
        });

        this.certifiview = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '사업자등록증 다운로드',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var type = 'CERTI';
                var reserved_varcharc = rec.get('reserved_varcharc');

                if (reserved_varcharc == 'Y') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/filedown.do?method=fileprojectHj',
                        params: {
                            pj_uid: pj_uid,
                            type: type
                        },
                        reader: {
                            pdfPath: 'pdfPath'
                        },
                        success: function (result, request) {
                            console_logs('result', result);
                            var jsonData = Ext.JSON.decode(result.responseText);
                            var filePath = jsonData.datas;
                            console_log(filePath);
                            if (filePath.length > 0) {
                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + filePath;
                                top.location.href = url;
                            }
                        },
                        failure: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 정보의 파일을 찾지 못했습니다. 파일을 첨부하여 주십시오.')
                        }
                    });
                } else {
                    Ext.MessageBox.alert('알림', '파일이 첨부되지 않았습니다. 파일업로드 진행 후 다운로드 하세요.');
                }
            }
        });

        this.idCardview = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '신분증 다운로드',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var reserved_varchard = rec.get('reserved_varchard');
                var type = 'ID';

                if (reserved_varchard == 'Y') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/filedown.do?method=fileprojectHj',
                        params: {
                            pj_uid: pj_uid,
                            type: type
                        },
                        reader: {
                            pdfPath: 'pdfPath'
                        },
                        success: function (result, request) {
                            console_logs('result', result);
                            var jsonData = Ext.JSON.decode(result.responseText);
                            var filePath = jsonData.datas;
                            console_log(filePath);
                            if (filePath.length > 0) {
                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + filePath;
                                top.location.href = url;
                            }
                        },
                        failure: function (result, request) {
                            Ext.MessageBox.alert('알림', '파일 다운로드 실패!<br>반복증상이 지속될경우 시스템 관리자에게 문의하세요.');
                        }
                    });
                } else {
                    Ext.MessageBox.alert('알림', '파일이 첨부되지 않았습니다. 파일업로드 진행 후 다운로드 하세요.');
                }
            }
        });


        buttonToolbar.insert(6, this.pdfAction);
        buttonToolbar.insert(7, this.editAction);
        buttonToolbar.insert(8, this.attachCertification);
        buttonToolbar.insert(9, this.attachIdCard);
        buttonToolbar.insert(10, this.certifiview);
        buttonToolbar.insert(11, this.idCardview);
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });
        //buttonToolbar.insert(1, this.defaultOrderAction);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                this.pdfAction.enable();
                this.attachCertification.enable();
                this.attachIdCard.enable();
                this.certifiview.enable();
                this.idCardview.enable();
                if (rec.get('ac_uid') != null && rec.get('ac_uid') != '') {
                    gm.me().wthContentStore.getProxy().setExtraParam('pj_uid', rec.get('ac_uid'));
                    gm.me().wthContentStore.getProxy().setExtraParam('type', 'ETC');
                    gm.me().wthContentStore.load(function (record) {
                        console_logs('record >>>> ', record);
                        objs = [];
                        gm.me().wthContentRecords = record;
                        var obj = {};
                        console_logs('>>>> wthContentRecords ', gm.me().wthContentRecords);
                        var recc = gm.me().wthContentRecords;
                        var columns = [];
                        if (recc != null) {
                            for (var i = 0; i < recc.length; i++) {
                                var sel = recc[i];
                                var objv = {};
                                var wth_uid = sel.get('unique_id');
                                var etc_date = sel.get('requestDateStr');
                                var etc_items = sel.get('description');
                                var etc_price = sel.get('price');
                                objv['wth_uid'] = wth_uid;
                                objv['etc_date'] = etc_date;
                                objv['etc_items'] = etc_items;
                                objv['etc_price'] = etc_price;
                                columns.push(objv);
                            }
                            console_logs('>>>objv', columns);
                            obj['datas'] = columns;
                            objs.push(obj);
                            console_logs('>>>> objs >>>>> ', objs);
                        }
                    })
                }
            } else {
                this.pdfAction.disable();
                this.attachCertification.disable();
                this.attachIdCard.disable();
                this.certifiview.disable();
                this.idCardview.disable();
            }
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
        });
    },
    addPoEditWindow: function (rec) {
        gm.me().gridIds = [];

        var ijPatternStore = Ext.create('Ext.data.Store', {
            fields: ['injung_code', 'injung_kr'],
            data: [
                { "injung_code": "CONTI", "injung_kr": "계속" },
                { "injung_code": "FIRST", "injung_kr": "최초" },
                { "injung_code": "N", "injung_kr": "없음" },
            ]
        });

        var blackboxSelStore = Ext.create('Ext.data.Store', {
            fields: ['blackbox_code', 'blackbox_sel'],
            data: [
                { "blackbox_code": "1", "blackbox_sel": "1" },
                { "blackbox_code": "2", "blackbox_sel": "2" },
                { "blackbox_code": "3", "blackbox_sel": "3" }
            ]
        });

        var naviSelStore = Ext.create('Ext.data.Store', {
            fields: ['navi_code', 'navi_sel'],
            data: [
                { "navi_code": "CARGO", "navi_sel": "화물용" },
                { "navi_code": "NORMAL", "navi_sel": "일반용" },
            ]
        });


        var etc_grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 900,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '날짜',
                    width: '30%',
                    dataIndex: 'etc_date',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    editor: new Ext.form.DateField({
                        disabled: false,
                        format: 'Y-m-d'
                    }),
                    sortable: false,
                    renderer: function (field) {
                        var formated = Ext.util.Format.date(field, 'Y-m-d');
                        return formated;
                    }
                },
                {
                    text: '항목',
                    width: '80%',
                    dataIndex: 'etc_items',
                    editor: 'textfield',
                    sortable: false
                },
                {
                    text: '가격',
                    width: '20%',
                    dataIndex: 'etc_price',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'etc_price') {
                            context.record.set('etc_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (context.field == 'etc_date') {
                        context.record.set('etc_date', '');
                    }
                    if (context.field == 'etc_items') {
                        context.record.set('etc_items', '');
                    }
                    if (context.field == 'etc_price') {
                        context.record.set('etc_price', '');
                    }
                }
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
                        {
                            text: '+',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('etc_grid').getStore();
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'wth_uid': -1,
                                        'etc_date': '',
                                        'etc_items': '',
                                        'etc_price': '0'
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var poEditForm = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            tabBarPosition: 'top',
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side',
                labelWidth: 110
            },
            items: [{
                title: '기본 정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본정보',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '수주번호',
                        allowBlank: false,
                        value: rec.get('reserved_varcharh'),
                        name: 'reserved_varcharh',
                        editable: false,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    }, {
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        mode: 'local',
                        id: gu.id('companycombo-SRO5_HJ1'),
                        editable: true,
                        fieldLabel: '지입사',
                        queryMode: 'remote',
                        displayField: 'company_name',
                        valueField: 'company_name',
                        store: Ext.create('Mplm.store.ComCstHjStore', {}),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        value: rec.get('reserved_varchar1'),
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: false,
                        hideTrigger: false,
                        name: 'reserved_varchar1',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{company_name}">{company_name} </font></div>';
                            }
                        },
                        pageSize: 25,
                        triggerAction: 'all',
                        listeners: {
                            beforeload: function () {
                                gu.getCmp('companycombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                    '%' + gu.getCmp('companycombo-SRO5_HJ1').getValue() + '%');
                            },
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '고객명',
                        allowBlank: true,
                        value: rec.get('reserved_varchar2'),
                        name: 'reserved_varchar2'
                    }, {
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        mode: 'local',
                        id: gu.id('carmakercombo-SRO5_HJ1'),
                        editable: true,
                        fieldLabel: '차량제조사',
                        queryMode: 'remote',
                        displayField: 'code_name_kr',
                        valueField: 'code_name_kr',
                        store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        value: rec.get('carMaker'),
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: false,
                        hideTrigger: false,
                        name: 'reserved_varchar4',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                            }
                        },
                        pageSize: 25,
                        triggerAction: 'all',
                        listeners: {
                            beforeload: function () {
                                gu.getCmp('carmakercombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                    '%' + gu.getCmp('carmakercombo-SRO5_HJ1').getValue() + '%');
                            },
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '차종',
                        allowBlank: false,
                        value: rec.get('reserved_varchar3'),
                        name: 'reserved_varchar3'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '톤',
                        allowBlank: true,
                        value: rec.get('h_reserved8'),
                        name: 'h_reserved8'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '영업사원',
                        allowBlank: false,
                        displayField: 'user_name',
                        valueField: 'user_name',
                        store: Ext.create('Mplm.store.UserSalerStore', {}),
                        name: 'pm_name',
                        value: rec.get('pm_name'),
                    }, {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        fieldLabel: '입고일',
                        value: rec.get('reserved_timestamp1_str'),
                        name: 'reserved_timestamp1'
                    }, {
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        fieldLabel: '적재함',
                        mode: 'local',
                        id: gu.id('jukjaecombo-SRO5_HJ1'),
                        editable: true,
                        queryMode: 'remote',
                        displayField: 'code_name_kr',
                        valueField: 'code_name_kr',
                        store: Ext.create('Rfx2.store.company.hanjung.JukjaeFlagStore', {}),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        value: rec.get('jukjaeStatus'),
                        name: 'reserved_varchar5',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '검사용적재함 길이',
                        name: 'trunk_length',
                        id: gu.id('trunk_length'),
                        name: 'reserved_varchar6',
                        value: rec.get('reserved_varchar6')
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '차대번호',
                        value: rec.get('reserved_varchari'),
                        name: 'reserved_varchari'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '가변축종류',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        mode: 'local',
                        id: gu.id('shaftcombo-SRO5_HJ1'),
                        editable: true,
                        queryMode: 'remote',
                        displayField: 'code_name_kr',
                        valueField: 'code_name_kr',
                        store: Ext.create('Rfx2.store.company.hanjung.VariableShaftTypeStore', {}),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        value: rec.get('shaftType'),
                        name: 'h_reserved7',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '비고',
                        value: rec.get('reserved32'),
                        name: 'reserved32'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '차량가격',
                        value: rec.get('carTotalPrice'),
                        name: 'h_reserved11'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '주민번호',
                        placeholder: 'xxxxxx-xxxxxxx',
                        inputMask: '999999-9999999',
                        value: rec.get('h_reserved12'),
                        name: 'h_reserved12'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '타이어',
                        value: rec.get('h_reserved18'),
                        name: 'h_reserved18'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '휠',
                        value: rec.get('h_reserved19'),
                        name: 'h_reserved19'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '그외',
                        value: rec.get('h_reserved20'),
                        name: 'h_reserved20'
                    }]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '견적가',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: '적재함',
                        value: rec.get('reserved_doublea'),
                        id: gu.id('estPrice_option1'),
                        name: 'reserved_doublea'

                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '축',
                        value: rec.get('reserved_doublec'),
                        id: gu.id('estPrice_option2'),
                        name: 'reserved_doublec'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '컨테이너',
                        value: rec.get('reserved_doublef'),
                        id: gu.id('estPrice_option3'),
                        name: 'reserved_doublef'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '냉동기',
                        value: rec.get('reserved_doubleb'),
                        id: gu.id('estPrice_option4'),
                        name: 'reserved_doubleb'
                    }, {
                        xtype: 'fieldcontainer',
                        anchor: '100%',
                        width: 444,
                        layout: 'hbox',
                        defaults: {
                            margin: '5 5 5 5'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                value: rec.get('h_reserved35'),
                                width: 100,
                                name: 'h_reserved35',
                                emptyText: '추가금액사양1'
                            },{
                                xtype: 'numberfield',
                                //fieldLabel: '추가옵션',
                                width: 300,
                                value: rec.get('reserved_doublee'),
                                id: gu.id('estPrice_option5'),
                                name: 'reserved_doublee'
                            }
                        ]

                    },{ 
                        xtype: 'fieldcontainer',
                        anchor: '100%',
                        width: 444,
                        layout: 'hbox',
                        defaults: {
                            margin: '5 5 5 5'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                value: rec.get('h_reserved48'),
                                width: 100,
                                name: 'h_reserved48',
                                emptyText: '추가금액사양2'
                            },  {
                                xtype: 'numberfield',
                                //fieldLabel: '기타사항',
                                width: 300,
                                value: rec.get('reserved_doubled'),
                                id: gu.id('estPrice_option6'),
                                name: 'reserved_doubled'
                            }
                        ]

                    }, 
                    {
                        xtype: 'fieldcontainer',
                        anchor: '100%',
                        width: 444,
                        layout: 'hbox',
                        defaults: {
                            margin: '5 5 5 5'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                value: rec.get('h_reserved31'),
                                width: 100,
                                name: 'h_reserved31',
                                emptyText: '추가금액사양3'
                            },
                            {
                                xtype: 'numberfield',
                                value: rec.get('estiOptionTPrice'),
                                id: gu.id('estPrice_option7'),
                                width: 300,
                                name: 'reserved33'
                            }
                        ]

                    },
                    {
                        xtype: 'fieldcontainer',
                        anchor: '100%',
                        width: 444,
                        layout: 'hbox',
                        defaults: {
                            margin: '5 5 5 5'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                value: rec.get('h_reserved32'),
                                width: 100,
                                name: 'h_reserved32',
                                emptyText: '추가금액사양4'
                            },
                            {
                                xtype: 'numberfield',
                                value: rec.get('estiOptionFPrice'),
                                id: gu.id('estPrice_option8'),
                                width: 230,
                                name: 'reserved34',
                                listeners: {
                                    specialkey: function (f, e) {
                                        if (e.getKey() == e.ENTER) {
                                            var target = gu.getCmp('estPrice_field');
                                            var est1 = gu.getCmp('estPrice_option1').getValue();
                                            var est2 = gu.getCmp('estPrice_option2').getValue();
                                            var est3 = gu.getCmp('estPrice_option3').getValue();
                                            var est4 = gu.getCmp('estPrice_option4').getValue();
                                            var est5 = gu.getCmp('estPrice_option5').getValue();
                                            var est6 = gu.getCmp('estPrice_option6').getValue();
                                            var est7 = gu.getCmp('estPrice_option7').getValue();
                                            var est8 = gu.getCmp('estPrice_option8').getValue();
                                            var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                                            var tax = total_estPrice * 0.1;
                                            target.setValue(total_estPrice + tax);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                //width: 100,
                                text: '견적가 계산',
                                listeners: {
                                    click: function () {
                                        var target = gu.getCmp('estPrice_field');
                                        var est1 = gu.getCmp('estPrice_option1').getValue();
                                        var est2 = gu.getCmp('estPrice_option2').getValue();
                                        var est3 = gu.getCmp('estPrice_option3').getValue();
                                        var est4 = gu.getCmp('estPrice_option4').getValue();
                                        var est5 = gu.getCmp('estPrice_option5').getValue();
                                        var est6 = gu.getCmp('estPrice_option6').getValue();
                                        var est7 = gu.getCmp('estPrice_option7').getValue();
                                        var est8 = gu.getCmp('estPrice_option8').getValue();
                                        var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                                        var tax = total_estPrice * 0.1;
                                        target.setValue(total_estPrice + tax);
                                    }
                                }
                            }
                        ]

                    }
                    // {
                    //     layout: {
                    //         type: 'column',
                    //         align: 'left'
                    //     },
                    //     items: [
                    //         {
                    //             xtype: 'numberfield',
                    //             fieldLabel: '추가금액2',
                    //             width: '39.5%',
                    //             margin: '0 3 0 0',
                    //             allowBlank: false,
                    //             name: 'reserved34',
                    //             value: rec.get('estiOptionFPrice'),
                    //             id: gu.id('estPrice_option8'),
                    //             listeners: {
                    //                 specialkey: function (f, e) {
                    //                     if (e.getKey() == e.ENTER) {
                    //                         var target = gu.getCmp('estPrice_field');
                    //                         var est1 = gu.getCmp('estPrice_option1').getValue();
                    //                         var est2 = gu.getCmp('estPrice_option2').getValue();
                    //                         var est3 = gu.getCmp('estPrice_option3').getValue();
                    //                         var est4 = gu.getCmp('estPrice_option4').getValue();
                    //                         var est5 = gu.getCmp('estPrice_option5').getValue();
                    //                         var est6 = gu.getCmp('estPrice_option6').getValue();
                    //                         var est7 = gu.getCmp('estPrice_option7').getValue();
                    //                         var est8 = gu.getCmp('estPrice_option8').getValue();
                    //                         var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                    //                         var tax = total_estPrice * 0.1;
                    //                         target.setValue(total_estPrice + tax);
                    //                     }
                    //                 }
                    //             }
                    //         },
                    //         {
                    //             xtype: 'button',
                    //             text: '견적가 계산',
                    //             listeners: {
                    //                 click: function () {
                    //                     var target = gu.getCmp('estPrice_field');
                    //                     var est1 = gu.getCmp('estPrice_option1').getValue();
                    //                     var est2 = gu.getCmp('estPrice_option2').getValue();
                    //                     var est3 = gu.getCmp('estPrice_option3').getValue();
                    //                     var est4 = gu.getCmp('estPrice_option4').getValue();
                    //                     var est5 = gu.getCmp('estPrice_option5').getValue();
                    //                     var est6 = gu.getCmp('estPrice_option6').getValue();
                    //                     var est7 = gu.getCmp('estPrice_option7').getValue();
                    //                     var est8 = gu.getCmp('estPrice_option8').getValue();
                    //                     var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                    //                     var tax = total_estPrice * 0.1;
                    //                     target.setValue(total_estPrice + tax);
                    //                 }
                    //             }
                    //         }
                    //     ]
                    // }
                    ]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '견적가 합',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: '견적가 합<br>(부가세포함)',
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        id: gu.id('estPrice_field'),
                        value: rec.get('preEstiPrice') == 0.0 ? rec.get('totalPrice') + rec.get('totalPrice') * 0.1 : rec.get('preEstiPrice'),
                        name: 'h_reserved4',
                        editable: false,
                    }]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '실견적',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: '축견적',
                        id: gu.id('real_option1'),
                        value: rec.get('assy_reserved_double1'),
                        name: 'assy_reserved_double1'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '윙바디견적',
                        id: gu.id('real_option2'),
                        value: rec.get('wbPrice'),
                        name: 'reserved35'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '그외견적',
                        width: '35.5%',
                        allowBlank: false,
                        name: 'assy_reserved_double2',
                        id: gu.id('real_option3'),
                        value: rec.get('assy_reserved_double2'),
                        listeners: {
                            specialkey: function (f, e) {
                                if (e.getKey() == e.ENTER) {
                                    var target = gu.getCmp('realPrice_field');
                                    var real1 = gu.getCmp('real_option1').getValue();
                                    var real2 = gu.getCmp('real_option2').getValue();
                                    var real3 = gu.getCmp('real_option3').getValue();
                                    var total_rPrice = real1 + real2 + real3;
                                    var tax = total_rPrice * 0.1
                                    var rP = total_rPrice + tax;
                                    target.setValue(rP);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: '실견적/차액금 계산',
                        width: '15%',
                        listeners: {
                            click: function () {
                                var target = gu.getCmp('realPrice_field');
                                var real1 = gu.getCmp('real_option1').getValue();
                                var real2 = gu.getCmp('real_option2').getValue();
                                var real3 = gu.getCmp('real_option3').getValue();
                                var total_rPrice = (real1 + real2 + real3) + (real1 + real2 + real3) * 0.1;
                                target.setValue(total_rPrice);

                                var target2 = gu.getCmp('diffPrice');
                                var estP = gu.getCmp('estPrice_field').getValue();
                                var realP = total_rPrice
                                var diffPrice = estP - realP;
                                target2.setValue(diffPrice);
                            }
                        }
                    },
                    ]
                },
                {
                    xtype: 'fieldset',
                    frame: true,
                    title: '실견적 합',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        id: gu.id('realPrice_field'),
                        fieldLabel: '실견적 합<br>(부가세 포함)',
                        editable: false,
                        value: rec.get('estiPriceReal'),
                        name: 'h_reserved5'
                    }]
                },
                {
                    xtype: 'fieldset',
                    frame: true,
                    title: '차액금(UP)',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        fieldStyle: 'background-color: #fa879c; background-image: none;',
                        xtype: 'numberfield',
                        fieldLabel: '가격',
                        id: gu.id('diffPrice'),
                        value: rec.get('upTotalPrice'),
                        name: 'h_reserved6'
                    }]
                },
                {
                    xtype: 'fieldset',
                    frame: false,
                    title: '검사종류',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        mode: 'local',
                        fieldLabel: '인증',
                        id: gu.id('injungcombo-SRO5_HJ1'),
                        editable: true,
                        queryMode: 'remote',
                        displayField: 'code_name_kr',
                        valueField: 'code_name_kr',
                        store: Ext.create('Rfx2.store.company.hanjung.AssignFlagStore', {}),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        value: rec.get('assignStatus'),
                        name: 'reserved_varchar7',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                            }
                        },
                    },
                    {
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        mode: 'local',
                        fieldLabel: '구변여부',
                        id: gu.id('gubuyncombo-SRO5_HJ1'),
                        editable: true,

                        queryMode: 'remote',
                        displayField: 'code_name_kr',
                        valueField: 'code_name_kr',
                        store: Ext.create('Rfx2.store.company.hanjung.GubyunFlagStore', {}),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        value: rec.get('gubynStatus'),
                        name: 'reserved_varchar9',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                            }
                        },
                    },
                    {
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                        mode: 'local',
                        fieldLabel: '종류',
                        id: gu.id('injungtypecombo-SRO5_HJ1'),
                        editable: true,
                        queryMode: 'remote',
                        displayField: 'injung_kr',
                        valueField: 'injung_code',
                        store: ijPatternStore,
                        value: rec.get('injungStatus'),
                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                        // value: rec.get('assignStatus'),
                        name: 'reserved_varchar8',
                        listConfig: {
                            loadingText: '검색 중...',
                            emptyText: '검색 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{injung_code}">{injung_kr} </font></div>';
                            }
                        },
                    },

                    {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        fieldLabel: '구변날짜',
                        name: 'reserved_timestamp2',
                        value: rec.get('reserved_timestamp2_str')
                    },
                    {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        fieldLabel: '인증날짜',
                        name: 'h_reserved16',
                        value: rec.get('h_reserved16')
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '비고',
                        name: 'h_reserved17',
                        value: rec.get('h_reserved17')
                    }]
                }
                ]
            }, {
                title: '연락처 정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '고객 연락처',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '휴대폰번호',
                        name: 'reserved_varchara',
                        value: rec.get('reserved_varchara')
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '차주 명',
                        hidden: true,
                        name: 'h_reserved34',
                        value: rec.get('h_reserved34')
                    },{
                        xtype: 'textfield',
                        fieldLabel: '전화번호',
                        name: 'reserved_varcharb',
                        value: rec.get('reserved_varcharb')
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '팩스번호',
                        name: 'h_reserved10',
                        value: rec.get('h_reserved10')
                    }]
                },
                {
                    xtype: 'fieldset',
                    frame: true,
                    title: '연락처(회사)',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: '휴대폰번호',
                            name: 'hp_no',
                            value: rec.get('corp_hp')
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '전화번호',
                            name: 'tel_no',
                            value: rec.get('corp_tel')
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '팩스번호',
                            name: 'fax_no',
                            value: rec.get('corp_fax')
                        },{
                            xtype: 'textfield',
                            fieldLabel: '비고',
                            hidden: true,
                            name: 'h_reserved33',
                            value: rec.get('h_reserved33')
                        }]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '캐피탈',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '캐피탈 명',
                        name: 'capital_corp_name',
                        value: rec.get('capital_name')
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '휴대폰번호',
                        value: rec.get('capital_hp'),
                        name: 'capital_hp_no'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '전화번호',
                        value: rec.get('capital_tel'),
                        name: 'capital_tel_no'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '팩스번호',
                        name: 'capital_fax_no',
                        value: rec.get('capital_fax')
                    }]
                }]
            },
            {
                title: '영업정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('companycombo-SRO5_HJ1_SALE'),
                            editable: true,
                            fieldLabel: '성명',
                            queryMode: 'remote',
                            displayField: 'president_name',
                            valueField: 'president_name',
                            store: Ext.create('Mplm.store.ComCstSalerStore', {}),
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            value : rec.get('delear_name'),
                            name: 'delear_name',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{president_name}">{president_name} </font></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforeload: function () {
                                    gu.getCmp('companycombo-SRO5_HJ1_SALE').store.getProxy().setExtraParam('president_name',
                                        '%' + gu.getCmp('companycombo-SRO5_HJ1_SALE').getValue() + '%');
                                },
                            }
                        }
                        // {
                        //     xtype: 'textfield',
                        //     fieldLabel: '이름',
                        //     name: 'reserved1',
                        //     value: rec.get('reserved1')
                        // }, {
                        //     xtype: 'textfield',
                        //     fieldLabel: '휴대폰번호',
                        //     name: 'reserved2',
                        //     value: rec.get('reserved2')
                        // }, {
                        //     xtype: 'textfield',
                        //     fieldLabel: '계좌번호',
                        //     name: 'h_reserved13',
                        //     value: rec.get('h_reserved13'),
                        // }, {
                        //     xtype: 'textfield',
                        //     fieldLabel: 'FAX',
                        //     name: 'h_reserved14',
                        //     value: rec.get('h_reserved14'),
                        // }, {
                        //     xtype: 'textfield',
                        //     fieldLabel: '주민번호',
                        //     name: 'h_reserved15',
                        //     value: rec.get('h_reserved15'),
                        // }
                    ]
                }]
            },
            {
                title: '출고정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            fieldLabel: '출고요청일',
                            name: 'delivery_plan',
                            value: rec.get('delivery_plan_str')
                        }, {
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            fieldLabel: '출고일자',
                            name: 'delivery_date',
                            value: rec.get('delivery_date_str')
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '주소',
                            name: 'reserved3',
                            value: rec.get('reserved3')
                        }]
                }]
            },
            {
                title: '기타',
                items: [
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '등록서류',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '번호판',
                                name: 'reserved4', // 새로 입력
                                value: rec.get('reserved4')
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                fieldLabel: '일자',
                                name: 'reserved_timestamp3', // 새로 입력
                                value: rec.get('reserved_timestamp3_str')
                            },
                            {
                                fieldLabel: '등록서류',
                                xtype: 'textfield',
                                name: 'reserved5', // 새로 입력
                                value: rec.get('reserved5')
                            }, {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                fieldLabel: '일자',
                                name: 'reserved_timestamp4', // 새로 입력
                                value: rec.get('reserved_timestamp4_str')
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '비고',
                                name: 'reserved6', // 새로 입력
                                value: rec.get('reserved6')
                            }, {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                fieldLabel: '일자',
                                name: 'reserved_timestamp5', // 새로 입력
                                value: rec.get('reserved_timestamp5_str')
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '네비外',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '33%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '1.네비',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        store: naviSelStore,
                                        name: 'h_reserved9',
                                        value: rec.get('naviUsingType'),
                                        displayField: 'navi_sel',
                                        valueField: 'navi_code',
                                        allowBlank: true,
                                        width: 150,
                                        innerTpl: "<div>[{navi_code}] {navi_sel}</div>",
                                        emptyText : '용도'
                                    },
                                    {
                                        xtype: 'combo',
                                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                        mode: 'local',
                                        // id: gu.id('navcombo-SRO5_HJ1'),
                                        editable: true,
                                        queryMode: 'remote',
                                        displayField: 'code_name_kr',
                                        valueField: 'code_name_kr',
                                        store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                                        value: rec.get('firstSelectStatus'),
                                        width: 150,
                                        name: 'reserved7',
                                        listConfig: {
                                            loadingText: '검색 중...',
                                            emptyText: '검색 결과가 없습니다.',
                                            // Custom rendering template for each item
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                            }
                                        },
                                        emptyText : '담당'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved8',
                                        id: gu.id('rev6'),
                                        width: 150,
                                        value: rec.get('naviPrice'),
                                        emptyText : '가격'
                                    },
                                    {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'reserved_timestamp6',
                                        width: 150,
                                        value: rec.get('reserved_timestamp6_str'),
                                        emptyText : '설치일자'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved21',
                                        width: 150,
                                        value: rec.get('h_reserved21'),
                                        emptyText : '업체명'
                                    }
                                ],
                            }]

                        }, {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '2.후방',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                        mode: 'local',
                                        // id: gu.id('backcombo-SRO5_HJ1'),
                                        editable: true,
                                        queryMode: 'remote',
                                        displayField: 'code_name_kr',
                                        valueField: 'code_name_kr',
                                        store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                                        value: rec.get('secondSelectStatus'),
                                        width: 150,
                                        name: 'reserved10',
                                        listConfig: {
                                            loadingText: '검색 중...',
                                            emptyText: '검색 결과가 없습니다.',
                                            // Custom rendering template for each item
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                            }
                                        },
                                        emptyText : '담당'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved11',
                                        id: gu.id('rev7'),
                                        width: 150,
                                        value: rec.get('backcamPrice'),
                                        emptyText : '가격'
                                    }, {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'reserved_timestamp7',
                                        width: 150,
                                        value: rec.get('reserved_timestamp7_str'),
                                        emptyText : '설치일자'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved22',
                                        width: 150,
                                        value: rec.get('h_reserved22'),
                                        emptyText : '업체명'
                                    }
                                ]
                            }]
                        }, {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '3.블랙박스',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        multiSelect: true,
                                        store: blackboxSelStore,
                                        // width : '30%',
                                        name: 'reserved12',
                                        value: rec.get('reserved12'),
                                        displayField: 'blackbox_sel',
                                        valueField: 'blackbox_code',
                                        width: 150,
                                        allowBlank: true,
                                        innerTpl: "<div>[{blackbox_code}] {blackbox_sel}</div>",
                                        emptyText : '1,2,3'
                                    },
                                    {
                                        xtype: 'combo',
                                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                        mode: 'local',
                                        // id: gu.id('blackcombo-SRO5_HJ1'),
                                        editable: true,
                                        queryMode: 'remote',
                                        displayField: 'code_name_kr',
                                        valueField: 'code_name_kr',
                                        store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                                        value: rec.get('thirdSelectStatus'),
                                        name: 'reserved13',
                                        width: 150,
                                        listConfig: {
                                            loadingText: '검색 중...',
                                            emptyText: '검색 결과가 없습니다.',
                                            // Custom rendering template for each item
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                            }
                                        },
                                        emptyText : '담당'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved14',
                                        width: 150,
                                        value: rec.get('bboxPrice'),
                                        emptyText : '가격'
                                    },
                                    {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'reserved_timestampa',
                                        width: 150,
                                        value: rec.get('reserved_timestampa_str'),
                                        emptyText : '설치일자'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved23',
                                        width: 150,
                                        value: rec.get('h_reserved23'),
                                        emptyText : '업체명'
                                    }
                                ]
                            }]
                        }, {
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '4.썬팅',
                                    anchor: '100%',
                                    width: '100%',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            // id: gu.id('suncombo-SRO5_HJ1'),
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                                            // value: rec.get('forthSelectStatus'),
                                            name: 'reserved15',
                                            width: 150,
                                            value: rec.get('forthSelectStatus'),
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText : '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved16',
                                            width: 150,
                                            value: rec.get('suntingPrice'),
                                            emptyText : '가격'

                                        },
                                        {
                                            xtype: 'datefield',
                                            format: 'Y-m-d',
                                            name: 'reserved_timestampb',
                                            width: 150,
                                            value: rec.get('reserved_timestampb_str'),
                                            emptyText : '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved24',
                                            width: 150,
                                            value: rec.get('h_reserved24'),
                                            emptyText : '업체명'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '5.띠',
                                    anchor: '100%',
                                    width: '100%',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            // id: gu.id('suncombo-SRO5_HJ1'),
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                                            value: rec.get('fifthSelectStatus'),
                                            width: 150,
                                            name: 'reserved17',
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText : '담당'
                                            
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved18',
                                            value: rec.get('beltPrice'),
                                            width: 150,
                                            emptyText : '가격'
                                            // id: gu.id('rev9')
                                        },
                                        {
                                            xtype: 'datefield',
                                            format: 'Y-m-d',
                                            name: 'reserved_timestampc',
                                            width: 150,
                                            emptyText : '설치일자',
                                            value: rec.get('reserved_timestampc_str')
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved25',
                                            width: 150,
                                            value: rec.get('h_reserved25'),
                                            emptyText : '업체명'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '6.썬바이저',
                                    anchor: '100%',
                                    width: '100%',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            // id: gu.id('suncombo-SRO5_HJ1'),
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                                            value: rec.get('sixthSelectStatus'),
                                            name: 'reserved19',
                                            width: 150,
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText : '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved20',
                                            width: 150,
                                            value: rec.get('sunvisorPrice'),
                                            emptyText : '가격'
                                            // id: gu.id('rev9')
                                        },
                                        {
                                            xtype: 'datefield',
                                            format: 'Y-m-d',
                                            name: 'reserved_timestampd',
                                            width: 150,
                                            value: rec.get('reserved_timestampd_str'),
                                            emptyText : '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved26',
                                            width: 150,
                                            value: rec.get('h_reserved26'),
                                            emptyText : '업체명'
                                        }
                                    ]
                                }
                            ]
                        }, {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '7.배선',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                        mode: 'local',
                                        // id: gu.id('detecncombo-SRO5_HJ1'),
                                        editable: true,
                                        queryMode: 'remote',
                                        displayField: 'code_name_kr',
                                        valueField: 'code_name_kr',
                                        store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                                        value: rec.get('seventhSelectStatus'),
                                        name: 'reserved21',
                                        width: 150,
                                        listConfig: {
                                            loadingText: '검색 중...',
                                            emptyText: '검색 결과가 없습니다.',
                                            // Custom rendering template for each item
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                            }
                                        },
                                        emptyText : '담당'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved22',
                                        value: rec.get('routePrice'),
                                        width: 150,
                                        emptyText : '가격'
                                        // id: gu.id('reva')
                                    }, {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'reserved_timestampe',
                                        width: 150,
                                        value: rec.get('reserved_timestampe_str'),
                                        emptyText : '설치일자'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved27',
                                        width: 150,
                                        value: rec.get('h_reserved27'),
                                        emptyText : '업체명'
                                    }
                                ]
                            }]

                        }, {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '8.모니터',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                        mode: 'local',
                                        // id: gu.id('moncombo-SRO5_HJ1'),
                                        editable: true,
                                        queryMode: 'remote',
                                        displayField: 'code_name_kr',
                                        valueField: 'code_name_kr',
                                        store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                        sortInfo: { field: 'unique_id', direction: 'ASC' },
                                        value: rec.get('eightSelectStatus'),
                                        name: 'reserved23',
                                        width: 150,
                                        listConfig: {
                                            loadingText: '검색 중...',
                                            emptyText: '검색 결과가 없습니다.',
                                            // Custom rendering template for each item
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                            }
                                        },
                                        emptyText : '담당'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved24',
                                        // id: gu.id('revb'),
                                        width: 150,
                                        value: rec.get('monPrice'),
                                        emptyText : '가격'
                                    }, {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'reserved_timestampf',
                                        width: 150,
                                        value: rec.get('reserved_timestampf_str'),
                                        emptyText : '설치일자'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved28',
                                        width: 150,
                                        value: rec.get('h_reserved28'),
                                        emptyText : '업체명'
                                    }
                                ]
                            }]
                        }, {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '9.기타 1',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved25',
                                        width: 150,
                                        value: rec.get('reserved25')
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved26',
                                        // id: gu.id('revb'),
                                        width: 150,
                                        value: rec.get('etcPrice')
                                    }, {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'assy_reserved_timestamp1',
                                        width: 150,
                                        value: rec.get('assymap_timestamp1_str')
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved29',
                                        width: 150,
                                        value: rec.get('h_reserved29')
                                    }
                                ]
                            }]
                        }, {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '10.기타 2',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved27',
                                        width: 150,
                                        value: rec.get('reserved27')
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'reserved28',
                                        width: 150,
                                        // id: gu.id('revb'),
                                        value: rec.get('etcSPrice')
                                    }, {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'assy_reserved_timestamp2',
                                        width: 150,
                                        value: rec.get('assymap_timestamp2_str')
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'h_reserved30',
                                        width: 150,
                                        value: rec.get('h_reserved30')
                                    }
                                ]
                            }]
                        }

                        ]
                    }]
            },
            {
                title: '탁송외 비용',
                items: [
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '',
                        width: '100%',
                        height: '100%',
                        layout: 'fit',
                        defaults: {
                            margin: '2 2 2 2'
                        },
                        items: [
                            etc_grid // json 파싱 wthdraw에 ETC 코드로 입력
                        ]
                    }]
            },
            {
                title: '기타',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '특이사항 1',
                        name: 'reserved29',
                        value: rec.get('reserved29')
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '특이사항 2',
                        name: 'reserved30',
                        value: rec.get('reserved30')
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '특이사항 3',
                        name: 'reserved31',
                        value: rec.get('reserved31')
                    }]

                }]
            }
            ]
        });

        if (gm.me().wthContentRecords != null) {
            for (var i = 0; i < gm.me().wthContentRecords.length; i++) {
                var recc = gm.me().wthContentRecords[i];
                var etc_price = recc.get('price');
                var unique_id = recc.get('unique_id_long');
                var etc_date = recc.get('requestDateStr');
                var etc_items = recc.get('description');
                var store = gu.getCmp('etc_grid').getStore();
                store.insert(store.getCount(), new Ext.data.Record({
                    'wth_uid': unique_id,
                    'etc_date': etc_date,
                    'etc_items': etc_items,
                    'etc_price': etc_price
                }));
            }
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수주수정',
            width: 950,
            height: 700,
            plain: true,
            items: poEditForm,
            overflowY: 'scroll',
            buttons: [{
                text: '수주수정',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                        estimate_wb = 0;
                        estimate_ch = 0;
                        estimate_re = 0;
                        estimate_etc = 0;
                    } else {
                        if (poEditForm.isValid()) {
                            var objs = [];
                            var columns = [];
                            var obj = {};
                            var store = gu.getCmp('etc_grid').getStore();
                            var cnt = store.getCount();
                            console_logs('cnt', cnt);
                            for (var i = 0; i < cnt; i++) {
                                var record = store.getAt(i);
                                var objv = {};
                                objv['pj_uid'] = rec.get('ac_uid');
                                objv['wth_uid'] = record.get('wth_uid');
                                objv['etc_items'] = record.get('etc_items');
                                objv['etc_price'] = record.get('etc_price');
                                objv['etc_date'] = record.get('etc_date');
                                columns.push(objv);
                            }
                            obj['datas'] = columns;
                            objs.push(obj);
                            var jsonData = Ext.util.JSON.encode(objs);

                            var project_uid = rec.get('ac_uid');
                            var assymap_uid = rec.get('unique_uid');
                            var srcahd_uid = rec.get('srcahd_uid');
                            var cap_unique_id = rec.get('reserved_numbera');
                            var comcst_uid = rec.get('srcahd_uid2');

                            poEditForm.submit({
                                submitEmptyText : false,
                                url: CONTEXT_PATH + '/sales/buyer.do?method=updateRecvPo',
                                waitMsg: '수정 중 입니다.',
                                params: {
                                    project_uid: project_uid,
                                    assymap_uid: assymap_uid,
                                    srcahd_uid: srcahd_uid,
                                    jsonData: jsonData,
                                    cap_unique_id: cap_unique_id,
                                    comcst_uid: comcst_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().store.load();
                                    gm.me().wthContentStore.load(function (record) {
                                        gm.me().wthContentRecords = record;
                                    })
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.alert('확인', '필수 입력항목이 입력되지 않았습니다.');
                        }
                    }
                }
            }
                , {
                text: '취소',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        this.addPoEditWindow(rec);
    },

    attachedCertificate: function (pj_uid, type) {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '첨부할 사업자 등록증 파일을 첨부하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '파일첨부',
                            xtype: 'filefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'fileupload',
                            buttonText: '찾아보기',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사업자등록증 첨부',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj',
                                waitMsg: '파일 첨부중 입니다.',
                                params: {
                                    pj_uid: pj_uid,
                                    pj_code: type
                                },
                                success: function (val, action) {
                                    var loadPage = new Ext.LoadMask({
                                        msg: 'Loading',
                                        visible: true,
                                        target: prWin
                                    });
                                    loadPage.show();
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=updateUploadCertiStatus',
                                        params: {
                                            type: 'CERTI',
                                            pj_uid: pj_uid,
                                        },
                                        success: function (result, request) {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                            Ext.MessageBox.alert('확인', '첨부 되었습니다.');
                                        }

                                    });
                                    gm.me().store.load();
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    attachedIdCard: function (pj_uid, type) {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '첨부할 신분증 파일을 첨부하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '파일첨부',
                            xtype: 'filefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'fileupload',
                            buttonText: '찾아보기',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신분증 첨부',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj',
                                waitMsg: '파일 첨부중 입니다.',
                                params: {
                                    pj_uid: pj_uid,
                                    pj_code: type
                                },
                                success: function (val, action) {
                                    var loadPage = new Ext.LoadMask({
                                        msg: 'Loading',
                                        visible: true,
                                        target: prWin
                                    });
                                    loadPage.show();
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=updateUploadCertiStatus',
                                        params: {
                                            type: 'ID',
                                            pj_uid: pj_uid,
                                        },
                                        success: function (result, request) {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                            Ext.MessageBox.alert('확인', '첨부 되었습니다.');
                                        }
                                    });
                                    gm.me().store.load();
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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
