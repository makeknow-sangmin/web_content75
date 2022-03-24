//설비현황
Ext.define('Rfx2.view.company.chmr.equipState.EquipMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        // this.addSearchField({
        //     type          : 'combo'
        //     , field_id    : 'mchn_type'
        //     , emptyText   : '라인유형'
        //     , store       : "PcsLineTypeStore"
        //     , displayField: 'codeName'
        //     , valueField  : 'systemCode'
        //     , value       : 'mchn_type'
        //     , innerTpl    : '<div data-qtip="{codeNameEn}">{codeName}</div>'
        // });

        this.addSearchField('mchn_code');
        this.addSearchField('name_ko');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.CuringMchn', [{
                property : 'name_ko',
                direction: 'ASC'
            }],
            gMain.pageSize
            , {}
            , ['pcsmchn']
        );

        this.defectRegiAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : '설비수리등록',
            tooltip : '설비수리 내역을 입력합니다.',
            disabled: true,
            handler : function () {

                var selections = currentTab.getSelectionModel().getSelection();


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
                            title   : '기본정보를 입력하십시오.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                {
                                    xtype     : 'datefield',
                                    id        : gu.id('occ_date'),
                                    name      : 'occ_date',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: true,
                                    fieldLabel: '수리예정일',
                                    format    : 'Y-m-d',
                                    value     : new Date()
                                },
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('occ_reason'),
                                    name      : 'occ_reason',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: true,
                                    fieldLabel: '수리부분',
                                },
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('fix_desc'),
                                    name      : 'fix_desc',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: true,
                                    fieldLabel: '수리회사',
                                },
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('fix_mchc'),
                                    name      : 'fix_mchc',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: true,
                                    fieldLabel: '담당자',
                                },
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '설비수리등록',
                    width  : 450,
                    height : 290,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                var selection = currentTab.getSelectionModel().getSelection()[0];
                                var occ_date = gu.getCmp('occ_date').getValue();
                                var occ_reason = gu.getCmp('occ_reason').getValue();
                                var fix_desc = gu.getCmp('fix_desc').getValue();
                                var fix_mchc = gu.getCmp('fix_mchc').getValue();
                                var unique_id = selection.get('unique_id');
                                var msg = '수리이력을 등록하시겠습니까?';
                                Ext.MessageBox.show({
                                    title  : '확인',
                                    msg    : msg,
                                    buttons: Ext.MessageBox.YESNO,
                                    fn     : function (result) {
                                        if (result == 'yes') {
                                            prWin.setLoading(true);
                                            Ext.Ajax.request({
                                                url    : CONTEXT_PATH + '/production/mcfix.do?method=equipRepair',
                                                params : {
                                                    'occ_date'  : occ_date,
                                                    'occ_reason': occ_reason,
                                                    'fix_desc'  : fix_desc,
                                                    'fix_mchc'  : fix_mchc,
                                                    'unique_id' : unique_id,
                                                },
                                                success: function (result, request) {
                                                    prWin.setLoading(false);
                                                    gm.me().store.load();
                                                    Ext.Msg.alert('안내', '등록되었습니다.', function () {
                                                    });
                                                    currentTab.getStore().load();
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

        this.machineCheckAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : '설비 점검결과 입력',
            tooltip : '설비 점검결과를 입력합니다.',
            disabled: true,
            handler : function () {
                let selection = currentTab.getSelectionModel().getSelection()[0];
                gm.me().checkListStore.getProxy().setExtraParam('pcsmchn_uid', selection.get('unique_id_long'));
                gm.me().checkListStore.getProxy().setExtraParam('orderBy', 'pcscheck.sort_order');
                gm.me().checkListStore.load();

                let checkResult = Ext.create('Ext.grid.Panel', {
                    store      : gm.me().checkListStore,
                    cls        : 'rfx-panel',
                    id         : gu.id('checkResult'),
                    collapsible: false,
                    multiSelect: false,
                    width      : 780,
                    height     : 480,
                    autoScroll : true,
                    autoHeight : true,
                    frame      : false,
                    border     : true,
                    layout     : 'fit',
                    forceFit   : false,
                    viewConfig : {
                        markDirty: false
                    },
                    columns    : [

                        {
                            text     : '점검/급유개소',
                            width    : '15%',
                            dataIndex: 'machine_place',
                            style    : 'text-align:center',
                            align    : 'left',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검/급유항목',
                            width    : '15%',
                            dataIndex: 'machine_section',
                            style    : 'text-align:center',
                            align    : 'left',
                            listeners: {},
                            sortable : false
                        },

                        {
                            text     : '점검/급유기준',
                            width    : '15%',
                            dataIndex: 'machine_baseline',
                            style    : 'text-align:center',
                            align    : 'left',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검/급유방법',
                            width    : '13%',
                            dataIndex: 'check_method',
                            style    : 'text-align:center',
                            align    : 'left',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검시기',
                            width    : '15%',
                            dataIndex: 'check_period_kr',
                            style    : 'text-align:center',
                            align    : 'left',
                            sortable : false
                        },
                        {
                            text     : '점검주기',
                            width    : '10%',
                            dataIndex: 'check_duration',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : 'textfield',
                            listeners: {},
                            sortable : false
                        },
                        {
                            text     : '점검결과',
                            width    : '13%',
                            dataIndex: 'result',
                            style    : 'text-align:center',
                            align    : 'left',
                            editor   : {
                                xtype         : 'combobox',
                                displayField  : 'codeName',
                                editable      : false,
                                forceSelection: true,
                                store         : gm.me().mcCheckResultStore,
                                triggerAction : 'all',
                                valueField    : 'systemCode'
                            },
                            listeners: {},
                            renderer: function (val) {
                                let recordIndex = gm.me().mcCheckResultStore.find('systemCode', val);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                return gm.me().mcCheckResultStore.getAt(recordIndex).get('codeName');
                            },
                            sortable : false
                        },
                    ],
                    selModel   : 'cellmodel',
                    plugins    : {
                        ptype       : 'cellediting',
                        clicksToEdit: 2
                    },
                    listeners  : {},
                    autoScroll : true,

                });


                let form = Ext.create('Ext.form.Panel', {
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
                            title   : '기본정보를 입력하십시오.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('mchn_code'),
                                    name      : 'mchn_code',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: false,
                                    editable : false,
                                    fieldLabel: '설비코드',
                                    value : selection.get('mchn_code')
                                },
                                {
                                    xtype     : 'textfield',
                                    id        : gu.id('name_ko'),
                                    name      : 'name_ko',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: false,
                                    editable : false,
                                    fieldLabel: '설비명',
                                    value : selection.get('name_ko')
                                },
                                {
                                    xtype     : 'datefield',
                                    id        : gu.id('check_date'),
                                    name      : 'check_date',
                                    padding   : '0 0 5px 10px',
                                    style     : 'width: 90%',
                                    allowBlank: true,
                                    fieldLabel: '점검일자',
                                    format    : 'Y-m-d',
                                    value     : new Date()
                                },
                            ]
                        },
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            flex    : 0.5,
                            title   : '점검결과를 입력하시기 바랍니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                checkResult
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '설비 점검결과 입력',
                    width  : 800,
                    height : 800,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                var msg = '점검결과를 입력하시겠습니까?';
                                Ext.MessageBox.show({
                                    title  : '확인',
                                    msg    : msg,
                                    buttons: Ext.MessageBox.YESNO,
                                    fn     : function (result) {
                                        if (result == 'yes') {
                                            prWin.setLoading(true);
                                            let checkUids = [];
                                            let results = [];
                                            let store = gu.getCmp('checkResult').getStore();
                                            let store_cnt = gu.getCmp('checkResult').getStore().getCount();
                                            for (let i = 0; i < store_cnt; i++) {
                                                let item = store.data.items[i];
                                                checkUids.push(item.get('unique_id_long'));
                                                results.push(item.get('result'));
                                            }

                                            let check_date = gu.getCmp('check_date').getValue();
                                            let check_date_str = check_date.getFullYear() + '-' +((check_date.getMonth() + 1) < 10 ? '0' + (check_date.getMonth() + 1) : (check_date.getMonth() + 1)) +
                                                '-' + ((check_date.getDate()) < 10 ? '0' + (check_date.getDate()) : (check_date.getDate()))

                                            Ext.Ajax.request({
                                                url    : CONTEXT_PATH + '/production/machine.do?method=addMachineCheckList',
                                                params : {
                                                    'pcsmchn_uid' : selection.get('unique_id_long'),
                                                    'check_uids' : checkUids,
                                                    'results' : results,
                                                    'check_date' : check_date_str
                                                },
                                                success: function (result, request) {
                                                    prWin.setLoading(false);
                                                    gm.me().store.load();
                                                    Ext.Msg.alert('안내', '등록처리 되었습니다.', function () {
                                                    });
                                                    currentTab.getStore().load();
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

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls : 'af-download',
            itemId  : 'fileattachAction',
            disabled: true,
            text    : '파일관리',
            handler : function (widget, event) {
                gm.me().attachFile();
            }
        });

        buttonToolbar.insert(1, this.fileattachAction);
        buttonToolbar.insert(6, this.defectRegiAction);
        buttonToolbar.insert(7, this.machineCheckAction);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr, function () {
        });
        const currentTab = this.grid;

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                this.defectRegiAction.enable();
                this.fileattachAction.enable();
                this.machineCheckAction.enable();
            } else {
                this.defectRegiAction.disable();
                this.fileattachAction.disable();
                this.machineCheckAction.disable();
            }
        })

        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('mchn_type', 'MACHINE');
        this.store.load(function (records) {
        });
    },
    items        : [],
    attachFile   : function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
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
            title      : '첨부된 파일 리스트',
            store      : this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId    : 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                cls  : 'my-x-toolbar-default2',
                items: [
                    {
                        xtype  : 'button',
                        text   : '파일업로드',
                        scale  : 'small',
                        iconCls: 'af-upload-white',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader       : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous    : true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel      : uploadPanel
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
                        xtype  : 'button',
                        text   : '파일삭제',
                        scale  : 'small',
                        iconCls: 'af-remove',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params : {
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
                        id   : gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html : '파일 수 : 0'
                    },
                ]
            }

            ],
            columns    : [
                {
                    text     : '파일 일련번호',
                    width    : 100,
                    style    : 'text-align:center',
                    sortable : true,
                    dataIndex: 'id'
                },
                {
                    text     : '파일명',
                    style    : 'text-align:center',
                    flex     : 0.7,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '업로드 날짜',
                    style    : 'text-align:center',
                    width    : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width    : 100,
                    sortable : true,
                    xtype    : 'numbercolumn',
                    format   : '0,000',
                    style    : 'text-align:center',
                    align    : 'right',
                    dataIndex: 'file_size'
                },
                {
                    text     : '등록자',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title     : '첨부파일',
            width     : 1300,
            height    : 600,
            minWidth  : 250,
            minHeight : 180,
            autoScroll: true,
            layout    : {
                type : 'vbox',
                align: 'stretch'
            },
            xtype     : 'container',
            plain     : true,
            items     : [
                this.fileGrid
            ],
            buttons   : [{
                text   : CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text   : CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]

        });
        win.show();
    },

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

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
            title  : '파일업로드 완료',
            icon   : Ext.MessageBox['INFO'],
            msg    : '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width  : 450
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
    mcCheckResultStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'MC_RESULT'}),
    checkListStore : Ext.create('Rfx2.store.company.chmr.MachineCheckListStore', {})
});
