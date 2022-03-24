Ext.define('Rfx2.view.company.chmr.equipState.WPMoldView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'recv-po-ver-view',

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField('item_name');
        this.addSearchField('specification');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        // remove the items
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            text: '파일관리',
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });


        this.moldAdd = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            // itemId: 'fileattachAction',
            disabled: true,
            text: 'TAG번호 추가',
            handler: function (widget, event) {
                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    region       : 'left',
                    layout       : 'form',
                    autoScroll   : true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            flex    : 0.5,
                            title   : '추가할 TAG번호를 숫자로 입력하십시오.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('disposal_reason'),
                                    name      : 'tag_no',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 95%',
                                    allowBlank: false,
                                    fieldLabel: 'TAG 번호',
                                },
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : 'TAG 추가',
                    width  : 450,
                    height : 200,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                var selection = currentTab.getSelectionModel().getSelection()[0];
                                Ext.MessageBox.show({
                                    title  : '확인',
                                    msg    : '입력한 Tag를 추가 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn     : function (result) {
                                        if (result == 'yes') {
                                            prWin.setLoading(true);
                                            Ext.Ajax.request({
                                                url   : CONTEXT_PATH + '/production/mcfix.do?method=addMoldTag',
                                                params: {
                                                    add_uid : selection.get('unique_id_long'),
                                                    add_tag_no : gu.getCmp('disposal_reason').getValue()
                                                },
                                                success: function (result, request) {
                                                    prWin.setLoading(false);
                                                    gm.me().store.load();
                                                    Ext.Msg.alert('안내', '등록되었습니다.', function () {
                                                    });
                                                    currentTab.getStore().load();
                                                    gu.getCmp('gridContractCompany').getStore().load();
                                                    prWin.close();
                                                },//endofsuccess
                                                failure: extjsUtil.failureMessage
                                            });//endofajax
                                        }
                                    },
                                    icon   : Ext.MessageBox.QUESTION
                                });
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
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

        this.moldDisposal = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            disabled: true,
            text: '금형폐기',
            handler: function (widget, event) {
                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    region       : 'left',
                    layout       : 'form',
                    autoScroll   : true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            flex    : 0.5,
                            title   : '폐기 사유를 입력하세요.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('disposal_reason'),
                                    name      : 'tag_no',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 95%',
                                    allowBlank: true,
                                    fieldLabel: '페기사유',
                                },
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '폐기처리',
                    width  : 450,
                    height : 200,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                var selection = currentTab.getSelectionModel().getSelection()[0];
                                Ext.MessageBox.show({
                                    title  : '확인',
                                    msg    : '선택한 금형을 폐기처리 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn     : function (result) {
                                        if (result == 'yes') {
                                            prWin.setLoading(true);
                                            var record = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                                            Ext.Ajax.request({
                                                url   : CONTEXT_PATH + '/production/mcfix.do?method=moldDisposal',
                                                params: {
                                                    unique_id : record.get('unique_id_long'),
                                                    disposal_reason : gu.getCmp('disposal_reason').getValue()
                                                },
                                                success: function (result, request) {
                                                    prWin.setLoading(false);
                                                    gm.me().store.load();
                                                    Ext.Msg.alert('안내', '등록되었습니다.', function () {
                                                    });
                                                    currentTab.getStore().load();
                                                    gu.getCmp('gridContractCompany').getStore().load();
                                                    prWin.close();
                                                },//endofsuccess
                                                failure: extjsUtil.failureMessage
                                            });//endofajax
                                        }
                                    },
                                    icon   : Ext.MessageBox.QUESTION
                                });
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
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

        this.deleteMoldAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '금형삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: gm.me().getMC('msg_btn_mold_delete_title', '금형삭제'),
                    msg: gm.me().getMC('msg_btn_mold_delete_msg', '선택한 금형을 삭제하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var record = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/mcfix.do?method=moldDelete',
                                params: {
                                    unique_id: record.get('unique_id_long'),
                                    //parent_uid : record.get('parent_uid')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    Ext.Msg.alert('안내', '삭제되었습니다.', function () {
                                    });
                                    currentTab.getStore().load();
                                    gu.getCmp('gridContractCompany').getStore().load();
                                    prWin.close();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            disabled: false,
            handler: function () {
                gm.setCenterLoading(true);
                var store = Ext.create('Rfx2.store.company.chmr.MoldDetailByUidStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam("menuCode", 'EMC8_EXL');

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

        //console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.company.chmr.MoldInfo', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['mold']
        );
        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // buttonToolbar.insert(1, this.fileattachAction);
        buttonToolbar.insert(3, this.downloadSheetAction);
        arr.push(searchToolbar);




        this.poPrdDetailStore = Ext.create('Rfx2.store.company.chmr.MoldDetailByUidStore', {});

        this.moldFixHistoryRegAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '금형 수리이력 등록',
            tooltip: '금형 수리이력 등록',
            disabled: true,
            handler: function () {
                var record = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                console_logs('>>>>>>', record.get('unique_id_long'));
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
                            title: '기본정보를 입력해주시기 바랍니다.',
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
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            fieldLabel: '금형UID',
                                            xtype: 'hiddenfield',
                                            anchor: '100%',
                                            width: '99%',
                                            name: 'mold_uid',
                                            value : record.get('unique_id_long')
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'fix_date',
                                            name: 'fix_date',
                                            padding: '0 0 5px 30px',
                                            width: '90%',
                                            anchor: '100%',
                                            format: 'Y-m-d',
                                            allowBlank: false,
                                            fieldLabel: '수리일자',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'occ_reason',
                                            name: 'occ_reason',
                                            padding: '0 0 5px 30px',
                                            anchor: '100%',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: '수리내역',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'fix_desc',
                                            name: 'fix_desc',
                                            padding: '0 0 5px 30px',
                                            anchor: '100%',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: '수리처',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'fix_mchn',
                                            name: 'fix_mchn',
                                            padding: '0 0 5px 30px',
                                            anchor: '100%',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: '수리자',
                                        },{
                                            xtype: 'textfield',
                                            id: 'occ_desc',
                                            name: 'occ_desc',
                                            padding: '0 0 5px 30px',
                                            anchor: '100%',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: '비고',
                                        }
                                    ]
                                },

                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: '수리이력 등록',
                    width: 500,
                    height: 300,
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
                                        url: CONTEXT_PATH + '/index/process.do?method=addMoldFixHistory',
                                        success: function (val, action) {
                                            console_logs('val >>>>', val);
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                            gm.me().store.load();
                                        }
                                    });
                                } else {

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
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.moldAdd,
                        this.moldDisposal,
                        this.deleteMoldAction,
                        this.moldFixHistoryRegAction,
                        this.fileattachAction
                    ]
                }
            ],
            columns: [
                {
                    text: 'TAG 번호',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_code',
                    sortable: false
                },
                {
                    text: '품명',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                    sortable: false
                },
                {
                    text: '규격',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'specification',
                    sortable: false
                },
                {
                    text: '단가',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_price',
                    align : 'right',
                    sortable: false,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'item_price') {
                            context.record.set('item_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '사용횟수',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'punc_cnt',
                    align : 'right',
                    sortable: false,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'punc_cnt') {
                            context.record.set('punc_cnt', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },

            ],
            title: '금형 TAG 정보',
            name: 'po',
            autoScroll: true,
            listeners: {

            }
        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length) {
                    gm.me().moldFixHistoryRegAction.enable();
                    gm.me().moldDisposal.enable();
                    gm.me().fileattachAction.enable();
                    gm.me().deleteMoldAction.enable();
                } else {
                    gm.me().moldFixHistoryRegAction.disable();
                    gm.me().moldDisposal.disable();
                    gm.me().fileattachAction.disable();
                    gm.me().deleteMoldAction.disable();
                }
            }
        });

        Ext.each(this.columns, function (columnObj, index) {
            console.log(this.columns);
            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                console.log('dataType!!!!', o['text'] + ' : ' + o['dataType']);
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        console.log('summary', summary);
                        console.log('summary.length', summary.length);
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            console.log('return', Ext.util.Format.number(objSummary[dataIndex], '0,00/i'));
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
            features: [
                {
                    ftype: 'summary',
                    dock: 'top',
                },
            ],
        };

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar, option);
        const currentTab = this.grid;
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

        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                var specification = rec.get('specification');
                var item_name = rec.get('item_name');
                gu.getCmp('selectedMtrl').setHtml('[' + item_name + '] ' + specification);
                this.poPrdDetailStore.getProxy().setExtraParam('parent_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();
                this.moldAdd.enable();
            } else {
                this.moldAdd.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC,BR');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.getProxy().setExtraParam('sp_code', 'P');
        this.store.load(function (records) {
        });
    },

    attachFile: function () {
        var record = gm.me().gridContractCompany.getSelectionModel().getSelection()[0];
        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일업로드',
                        scale: 'small',
                        iconCls: 'af-upload-white',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel: uploadPanel
                            });
                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                            }, this);
                            uploadDialog.show();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }
                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '파일 수 : 0'
                    },
                ]
            }

            ],
            columns: [
                {
                    text: '파일 일련번호',
                    width: 100,
                    style: 'text-align:center',
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    flex: 0.7,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '업로드 날짜',
                    style: 'text-align:center',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'file_size'
                },
                {
                    text: '등록자',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]

        });
        win.show();
    },


    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    store.remove(record);
                    j--;
                }
                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }
        };
        xhr.send(fd);
    },

    uploadComplete: function (items) {
        console_logs('uploadComplete items', items);
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title: '파일업로드 완료',
            icon: Ext.MessageBox['INFO'],
            msg: '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width: 450
        });
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }
            }
        });
    },

    searchDetailStore          : Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),

});



