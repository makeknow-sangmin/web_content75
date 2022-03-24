//자재 관리
Ext.define('Rfx2.view.company.daeji.developmentMgmt.ProductMgmtView', {
    extend: 'Rfx2.base.company.daeji.BaseView',
    xtype: 'product-ver-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField({
            type: 'checkbox',
            field_id: 'notify_flag_use',
            items: [
                {
                    boxLabel: '사용중지 포함',
                    checked: false
                },
            ],
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();

        buttonToolbar.items.each(function (item, index) {
            if (index === 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addCallback('CHECK_CODE', function () {
            let target = gm.me().getInputJust('extendsrcahd|item_name');
            console_logs('====target', target);
            let code = target.getValue();
            let uppercode = code.toUpperCase();

            if (code.length < 1) {
                Ext.Msg.alert('안내', '품명을 입력하시기 바랍니다', function () {
                });
            } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=A&sp_code_list=F,G,H,A',
                    params: {
                        item_name: code
                    },
                    success: function (result) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        let datas = jsonData.datas;

                        let isExist = false;

                        for (let i = 0; i < datas.length; i++) {
                            if (code === datas[i].item_name) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist) {
                            Ext.Msg.alert('안내', '사용가능한 품명입니다', function () {
                            });
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 품명입니다', function () {
                            });

                            let sp_code = gm.me().getInputJust('extendsrcahd|sp_code').getValue();

                            if (sp_code == null) {
                                sp_code = '';
                            }

                            let sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();

                            if (sg_code == null) {
                                sg_code = '';
                            }

                            let item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

                            let item_code = sp_code + sg_code;

                            item_code_field.setValue(item_code);

                            //target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.addCallback('GET_SG_CODE', function (o) {

            let sg_code = Ext.getCmp('design-plan-' + gm.me().link + '-sg_code');
            let store = sg_code.getStore();

            sg_code.setValue(null);
            store.getProxy().setExtraParam('parent_class_code', o.value);

            store.load();
        });

        this.createStore('Rfx2.model.company.daeji.ProductVerMgmt', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.addCallback('SET_ITEM_CODE', function () {

            let sp_code = gm.me().getInputJust('extendsrcahd|sp_code').getValue();

            if (sp_code == null) {
                sp_code = '';
            }

            let sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();

            if (sg_code == null) {
                sg_code = '';
            }

            let item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

            let item_code = sp_code + sg_code;

            item_code_field.setValue(item_code);
        });

        this.createCrudTab();

        let wdGridStore = Ext.create('Rfx2.store.BomDtlStore', {});

        /* 원단 설계 정보 그리드  */
        let wdGrid = Ext.create('Ext.grid.Panel', {
            store: wdGridStore,
            style: 'padding-left:10px;padding-right:10px;',
            width: '60%',
            id: gu.id('wdGrid'),
            title: '원단',
            scroll: true,
            columns: [
                {xtype: 'rownumberer', width: 40},
                {text: '원단명', width: 200, align: 'center', dataIndex: 'item_name'},
                {text: '골', width: 75, align: 'center', dataIndex: 'column03'},
                {text: '총장', width: 50, align: 'center', dataIndex: 'column04'},
                {text: '총폭', width: 50, align: 'center', dataIndex: 'column05'},
                {text: '장', width: 50, align: 'center', dataIndex: 'column06'},
                {text: '폭', width: 50, align: 'center', dataIndex: 'column07'},
                {text: '절수', width: 50, align: 'center', dataIndex: 'column08'},
                {text: '재단규격', width: 80, align: 'center', dataIndex: 'column09'},
                {text: '㎡/개', width: 60, align: 'center', dataIndex: 'column10'},
                {text: '표준단가', width: 150, align: 'center', dataIndex: 'sales_price'}
            ],
            listeners: {},
            border: false,
            multiSelect: true,
            frame: true,
            forceFit: false,
            dockedItems: []
        });

        /* 공정 정보 그리드 */
        let pcsstdStore = Ext.create('Rfx2.store.PcsStdTemplateStore');
        let pcsTplStore = Ext.create('Mplm.store.PcsTplStore');
        let processGrid = Ext.create('Ext.grid.Panel', {
            store: pcsstdStore,
            style: 'padding-left:10px;padding-right:10px;',
            id: gu.id('processGrid'),
            title: '공정',
            scroll: true,
            viewConfig: {
                markDirty: false
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
                listeners: {
                    beforeedit: function (e, context) {
                        let recSub = context.record;
                        switch (context.colIdx) {
                            case 0:
                            case 1:
                                return recSub.get('is_new_row');
                            default:
                                return true;
                        }
                    }
                }
            },
            columns: [
                {xtype: 'rownumberer', width: 40},
                {
                    text: '공정명', width: 180, dataIndex: 'pcs_name',
                    style: 'text-align:center',
                    sortable: false,
                    editor: {
                        xtype: 'combo',
                        store: pcsTplStore,
                        displayField: 'pcs_name',
                        valueField: 'pcs_name',
                        editable: false,
                        selectOnFocus: true,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return '<div>[{pcs_code}] {pcs_name}</div>';
                            }
                        },
                        listeners: {
                            focus: function () {
                                let combo = this;
                                combo.expand();
                            },
                            select: function (combo, record) {
                                let rowIdx = combo.ownerCt.context.rowIdx;
                                let storeIdx = gu.getCmp('processGrid').getStore().getAt(rowIdx);
                                storeIdx.set('pcs_code', record.get('pcs_code'));
                                storeIdx.set('pcs_name', record.get('pcs_name'));
                                this.blur();
                            }
                        }
                    }
                },
                {text: '작업단위', width: 80, align: 'center', dataIndex: 'price_origin', editor: 'textfield'},
                {text: '수량단위', width: 75, align: 'center', dataIndex: 'price_type', editor: 'textfield'},
                {text: '표준단가', width: 75, align: 'center', dataIndex: 'process_price', editor: 'textfield'},
                {text: '비고', width: 150, align: 'center', dataIndex: 'comment', editor: 'textfield'},
                {text: '외주처', width: 150, align: 'center', dataIndex: 'description', editor: 'textfield'}
            ],
            listeners: {},
            border: false,
            multiSelect: true,
            frame: true,
            forceFit: false,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            text: '+',
                            listeners: [{
                                click: function () {

                                    let store = gu.getCmp('processGrid').getStore();

                                    store.add(new Ext.data.Record({
                                        'pcs_code': '',
                                        'pcs_name': '',
                                        'price_origin': '',
                                        'price_type': '',
                                        'process_price': '',
                                        'comment1': '',
                                        'description': '',
                                        'serial_no': store.getCount() + 1
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    let record = gu.getCmp('processGrid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('processGrid').getStore().removeAt(gu.getCmp('processGrid').getStore().indexOf(record));
                                }
                            }]
                        },
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    let direction = -1;
                                    let grid = gu.getCmp('processGrid');
                                    let record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    let index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    let cnt = grid.getStore().getCount();
                                    for (let i = 0; i < cnt; i++) {
                                        let record = grid.getStore().getAt(i);
                                        record.set('serial_no', i + 1);
                                    }
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    let direction = 1;
                                    let grid = gu.getCmp('processGrid');
                                    let record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    let index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    let cnt = grid.getStore().getCount();
                                    for (let i = 0; i < cnt; i++) {
                                        let record = grid.getStore().getAt(i);
                                        record.set('serial_no', i + 1);
                                    }
                                }
                            }]
                        },
                        {
                            text: '저장',
                            iconCls: 'af-save',
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '저장하기',
                                    msg: '저장하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: gm.me().saveProcessStd,
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }
                        }
                    ]
                }
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'north',
                    margin: '0 0 0 0',
                    height: '65%',
                    layout: 'fit',
                    items: [this.grid]
                },
                {
                    region: 'center',
                    layout: 'border',
                    items: [{
                        collapsible: false,
                        frame: false,
                        region: 'west',
                        margin: '0 0 5 0',
                        width: '53%',
                        layout: 'fit',
                        split: true,
                        items: [wdGrid]
                    },{
                        collapsible: false,
                        frame: false,
                        region: 'center',
                        margin: '0 0 5 0',
                        width: '47%',
                        layout: 'fit',
                        items: [processGrid]
                    }]
                }
            ]
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            tooltip: '등록된 제품의 도면 또는 그외 파일을 업로드 및 다운로드 합니다.',
            text: this.getMC('CMD_ATTACHMENTS', '첨부문서'),
            hidden: gu.setCustomBtnHiddenProp('fileattachAction'),
            handler: function () {
                gm.me().attachFile();
            }
        });

        this.fileattachViewAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachViewAction',
            disabled: true,
            tooltip: '등록된 제품의 도면 또는 그외 파일을 업로드 및 다운로드 합니다.',
            text: this.getMC('CMD_FILE_VIEW', '첨부보기'),
            hidden: gu.setCustomBtnHiddenProp('fileattachViewAction'),
            handler: function () {
                gm.me().attachFileView();
            }
        });

        this.productDeleteAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            itemId: 'productDeleteAction',
            disabled: true,
            tooltip: '선택 제품을 삭제합니다.',
            text: this.getMC('CMD_DELETE', '삭제'),
            hidden: gu.setCustomBtnHiddenProp('productDeleteAction'),
            handler: function () {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 제품을 삭제하시겠습니까?<br><b>현 기능은 "SYS" 권한이 부여된 사용자만 실행됩니다.</b>',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        let record = gm.me().grid.getSelectionModel().getSelection()[0];
                        if (result === 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=deleteProduct',
                                params: {
                                    srcahd_uid: record.get('unique_id_long')
                                },
                                success: function () {
                                    Ext.Msg.alert('안내', '처리완료 되었습니다.', function () {
                                    });
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            }); //end of ajax
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.changeUsingStatusAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-exchange',
            text: this.getMC('CMD_CHANGE_USEYN', '사용여부 변경'),
            tooltip: '사용중인 제품은 미사용으로, 미사용중인 제품은 사용으로 변경합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('changeUsingStatusAction'),
            handler: function () {

                Ext.MessageBox.show({
                    title: '사용여부 변경',
                    msg: '사용여부를 변경하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {

                        if (result === 'yes') {

                            let negative_uids = [];
                            let positive_uids = [];

                            let selections = gm.me().grid.getSelectionModel().getSelection();

                            for (let i = 0; i < selections.length; i++) {
                                let rec = selections[i];
                                let notify_flag = rec.get('notify_flag');

                                if (notify_flag === 'Y') {
                                    positive_uids.push(rec.get('unique_id_long'));
                                } else {
                                    negative_uids.push(rec.get('unique_id_long'));
                                }
                            }

                            if (negative_uids.length > 0) {
                                gm.me().editAjax('srcahd', 'notify_flag', 'Y', 'unique_id', negative_uids, {type: ''}, null);
                            }
                            if (positive_uids.length > 0) {
                                gm.me().editAjax('srcahd', 'notify_flag', 'N', 'unique_id', positive_uids, {type: ''}, null);
                            }

                            gm.me().store.load();

                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //버튼 추가.
        buttonToolbar.insert(4, this.changeUsingStatusAction);
        buttonToolbar.insert(5, this.fileattachAction);
        buttonToolbar.insert(6, this.fileattachViewAction);

        buttonToolbar.insert(7, this.productDeleteAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                gm.me().changeUsingStatusAction.enable();
                gm.me().fileattachAction.enable();
                gm.me().productDeleteAction.enable();
                gm.me().fileattachViewAction.enable();

                wdGridStore.getProxy().setExtraParam('ver_child', selections[0].get('unique_id_long'));
                wdGridStore.load();
                pcsstdStore.getProxy().setExtraParam('srcahd_uid', selections[0].get('unique_id_long'));
                pcsstdStore.load();
            } else {
                gm.me().changeUsingStatusAction.disable();
                gm.me().fileattachAction.disable();
                gm.me().productDeleteAction.disable();

                gm.me().fileattachViewAction.disable();
                pcsstdStore.clear();
                wdGridStore.clear();
            }
        })

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.getProxy().setExtraParam('notify_flag_use', 'false');
        this.store.load(function (records) {
        });
    },
    selectedClassCode: '',
    reflashClassCode: function (o) {
        this.selectedClassCode = o;
        let target_class_code = gm.me().getInputJust('srcahd|class_code');
        let target_item_code = gm.me().getInputJust('srcahd|item_code');

        target_class_code.setValue(o);
        target_item_code.setValue(o);

    },
    items: [],
    matType: 'RAW',
    stockviewType: "ALL",

    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, sync_mode) {

        if (tableName == null || tableName === '') {
            return;
        }
        gm.me().recCount++;

        let params = {};
        if (in_params != null) {
            for (let key in in_params) {
                params[key] = in_params[key];
            }
        }

        let whereValue = [];
        whereValue.push(in_whereValue);

        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        params['valueType'] = gm.getColType(field);

        gm.me().sync_mode = sync_mode;

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
            params: params,
            success: function (result) {

                result = result.responseText;
                if (result != null) {
                    let o = Ext.util.JSON.decode(result);
                    if (o != null) {

                        gm.me().recCount--;

                        gm.setCenterLoading(false);

                        if (gm.me().sync_mode === false || gm.me().sync_mode === undefined) {
                            gm.me().sync_mode = null;
                        } else {
                            try {
                                gm.me().getStore().sync();
                            } catch (e) {
                            }
                        }
                    }
                }
            }
        });
    },

    attachFile: function () {
        let record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                let o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '파일을 첨부 후 나머지 내용을 작성 후 반영확인을 클릭하십시오.<br><br>첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            id: gu.id('attachedFileGrid'),
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
                        text: '파일첨부',
                        scale: 'small',
                        iconCls: 'af-upload-white',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            let url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            let uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });

                            let uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
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
                                this.attachedFileStore.load();
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
                                let unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                let file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function () {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    let o = gu.getCmp('file_quan');
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
                    {
                        xtype: 'button',
                        text: '새로고침',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            gm.me().attachedFileStore.load();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '반영확인',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            // gm.me().attachedFileStore.load();
                            let store = gu.getCmp('attachedFileGrid').getStore();
                            console_logs('>>>> store', store);
                            let size = store.data.items.length;
                            let uniqueIds = [];
                            let docTypes = [];
                            let docNos = [];
                            let docNames = [];
                            let docVers = [];
                            let docPurcYns = [];

                            if (size > 0) {
                                for (let i = 0; i < size; i++) {
                                    let item = store.data.items[i];
                                    console_logs('>> doc_type', item.get('file_usage'));
                                    let doctype = '';
                                    switch (item.get('file_usage')) {
                                        case '기구도면':
                                            doctype = 'INS';
                                            break;
                                        case '디자인도면':
                                            doctype = 'DES';
                                            break;
                                        case '생산작업지도서':
                                            doctype = 'WIS';
                                            break;
                                        case '포장작업지도서':
                                            doctype = 'PIS';
                                            break;
                                        case '포장사양서' :
                                            doctype = 'PSN';
                                            break;
                                        case '수입검사기준서' :
                                            doctype = 'IIS';
                                            break;
                                    }
                                    if (doctype.length === 0) {
                                        Ext.MessageBox.alert('알림', '문서종류가 부적절한 값이 들어갔거나 존재하지 않습니다.')
                                        return;
                                    } else {
                                        console_logs('>> doctype', doctype);
                                        docTypes.push(doctype);
                                    }
                                    let docNo = item.get('srccst_varchar1');
                                    if (docNo !== undefined) {
                                        docNos.push(docNo);
                                    } else {
                                        docNos.push('NOT');
                                    }

                                    let docName = item.get('srccst_varchar3');
                                    if (docName !== undefined) {
                                        docNames.push(docName);
                                    } else {
                                        docNames.push('NOT');
                                    }

                                    let docVer = item.get('srccst_varchar4')
                                    if (docVer !== undefined) {
                                        docVers.push(docVer);
                                    } else {
                                        docVers.push('NOT');
                                    }

                                    let prc_yn = item.get('srccst_varchar5')
                                    if (prc_yn !== undefined) {
                                        docPurcYns.push(prc_yn);
                                    } else {
                                        docPurcYns.push('NOT');
                                    }
                                    uniqueIds.push(item.get('id'))
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=reflectFileContent',
                                    params: {
                                        uniqueIdsArr: uniqueIds,
                                        docPurcYnArr: docPurcYns,
                                        docVers: docVers,
                                        docNames: docNames,
                                        docNos: docNos,
                                        docTypes: docTypes
                                    },
                                    success: function () {
                                        Ext.MessageBox.alert('확인', '반영 되었습니다.');
                                        gm.me().attachedFileStore.load(function (records) {
                                            if (records != null) {
                                                let o = gu.getCmp('file_quan');
                                                if (o != null) {
                                                    o.update('파일 수 : ' + records.length);
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert('알림', '첨부파일 내역이 존재하지 않습니다.');
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
                    text: '문서종류',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.5,
                    sortable: true,
                    dataIndex: 'file_usage',
                    editor: {
                        xtype: 'combobox',
                        displayField: 'codeName',
                        css: 'edit-cell',
                        editable: false,
                        // forceSelection: true,
                        // mode: 'local',
                        store: gm.me().dwgTypeStore,
                        triggerAction: 'all',
                        valueField: 'codeName'
                    },
                },
                {
                    text: '문서번호',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.7,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar1'
                },
                {
                    text: '문서명',
                    style: 'text-align:center',
                    width: '18%',
                    // flex: 0.7,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar3'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    width: '20%',
                    // flex: 0.5,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '문서버전',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.3,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar4'
                },
                {
                    text: '주문서등록여부',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.3,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        displayField: 'codeName',
                        css: 'edit-cell',
                        editable: false,
                        // forceSelection: true,
                        // mode: 'local',
                        store: gm.me().purchaseYnStore,
                        triggerAction: 'all',
                        valueField: 'systemCode',
                        listeners: {
                            expand: function () {
                                let record = gu.getCmp('attachedFileGrid').getSelectionModel().getSelected().items[0];
                                let doc_type = record.get('file_usage');
                                console_logs('>>> doc_type : ', doc_type);
                                if (doc_type === '기구도면' || doc_type === '디자인도면') {
                                    this.store.load();
                                } else {
                                    Ext.MessageBox.alert('알림', '문서종류를 기구도면 또는 디자인도면을 선택했을 경우 선택가능합니다.');
                                }
                            },
                        }
                    },
                    dataIndex: 'srccst_varchar5'
                },
                {
                    text: '작성자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'creator'
                },
                {
                    text: '작성일자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'create_date'
                },
            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
        });

        let win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1280,
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
            }]
        });
        win.show();
    },


    attachFileView: function () {
        let record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                let o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            id: gu.id('attachedFileGrid'),
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '새로고침',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            gm.me().attachedFileStore.load();
                        }
                    },
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
                    text: '문서종류',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'file_usage'
                },
                {
                    text: '문서번호',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'srccst_varchar1'
                },
                {
                    text: '문서명',
                    style: 'text-align:center',
                    width: '18%',
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar3'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    width: '20%',
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '문서버전',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'srccst_varchar4'
                },
                {
                    text: '주문서등록여부',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'srccst_varchar5'
                },
                {
                    text: '작성자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'creator'
                },
                {
                    text: '작성일자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'create_date'
                },
            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
        });

        let win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1280,
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
            }]
        });
        win.show();
    },

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        let output = 'Uploaded files: <br>';
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
                let o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
    },
    dwgTypeStore: Ext.create('Mplm.store.DwgTypeStore', {}),
    purchaseYnStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PURCHASE_INS_YN'}),

    saveProcessStd: function (result) {
        if (result === 'yes') {
            let data = gu.getCmp('processGrid').getStore().getDataSource();
            let processDatas = [];
            let srcahdUid = gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long');

            data.items.forEach(el => {
                processDatas.push({
                    'pcs_code': el.get('pcs_code'),
                    'pcs_name': el.get('pcs_name'),
                    'price_origin': el.get('price_origin'),
                    'price_type': el.get('price_type'),
                    'process_price': el.get('process_price'),
                    'comment': el.get('comment'),
                    'description': el.get('description')
                });
            });

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=saveProcessStd',
                method: 'POST',
                params: {
                    processDatas: Ext.JSON.encode(processDatas),
                    srcahdUid: srcahdUid
                },
                success: function () {
                    gm.me().store.load();
                },
            });
        }
    }

});

