Ext.define('Rfx2.base.company.daeji.BaseView', {
    extend: 'Rfx2.base.BaseView',
    forms: null,
    initComponent: function() {
        this.forms = this.createFormPane();
        this.callOverridden();
    },
    createCommandToolbar: function () {

        this.searchAction = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: '검색',
            hidden: false,
            handler: function () {
                gm.me().redrawStore(true);
            }
        });

        this.registAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            disabled: false,
            text: '등록',
            handler: function () {
                gm.me().doCreate();
                gm.me().fillEditForm(gm.me().selected_records, 'CREATE');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            disabled: true,
            text: '수정',
            handler: function () {
                gm.me().doEdit();
                gm.me().fillEditForm(gm.me().selected_records, 'EDIT');
            }
        });

        this.copyAction = Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            disabled: true,
            text: '복사등록',
            handler: function () {
                gm.me().doCreate();
                gm.me().fillEditForm(gm.me().selected_records, 'EDIT');
            }
        });

        this.removeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            disabled: true,
            text: '삭제',
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: CMD_DELETE,
                    msg: gm.me().getMC('vst1_delete', '선택한 항목을 삭제하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: []
        });

        this.buttonToolbar.insert(0, '->');
        this.buttonToolbar.insert(4, this.searchAction);
        this.buttonToolbar.insert(5, this.registAction);
        this.buttonToolbar.insert(6, this.editAction);
        this.buttonToolbar.insert(7, this.copyAction);
        this.buttonToolbar.insert(8, this.removeAction);

        return this.buttonToolbar;
    },
    createFormPane: function () {

        let tabTitleArr = [];

        for (let i = 0; i < this.fields.length; i++) {
            let o = this.fields[i];
            let tabTitle = o['tabTitle'];
            if (tabTitle !== undefined && tabTitle !== null && tabTitle.length > 0) {
                tabTitleArr.push(tabTitle);
            }
        }
        //중복제거
        tabTitleArr = extjsUtil.mergeDuplicateArray(tabTitleArr);

        this.formItems = [];

        for (let i = 0; i < tabTitleArr.length; i++) {

            let forms = this.getFormPane(tabTitleArr[i]);

            if (i === 0) {
                forms.insert({
                    cmpId: this.link + '-' + 'selectedUidFrom',
                    xtype: 'hiddenfield',
                    name: 'default' + '|' + 'unique_id'
                });

            }
            this.formItems.push(forms);
        }

        let myId = gMain.geTabPanelId();

        let panel = Ext.create('Ext.panel.Panel', {
            id: myId,
            cmpId: myId,
            height: 500,
            layout: 'border',
            border: false,
            autoScroll: true,
            defaults: {
                collapsible: true,
                split: true,
                cmargins: '5 0 0 0',
                margins: '0 0 0 0'
            },
            items: []
        });

        for (let i = 0; i < this.formItems.length; i++) {

            // if (this.formItems[i].title === '상세정보') {

                let formPanel = this.formItems[i];
                formPanel.title = '';

                panel.items.insert(0, formPanel);
           // }
        }

        this.selectedUidFrom = Ext.getCmp(this.link + '-' + 'selectedUidFrom');

        if (this.defOnlyCreate === false || this.crudMode === 'CREATE') {

            for (let key in this.defComboValues) {
                let o = this.defComboValues[key];
                let combo = Ext.getCmp(gMain.selectedMenuId + '-' + key);

                if (combo != null) {

                    combo.store.load(function (records) {
                        for (let i = 0; i < records.length; i++) {
                            let obj = records[i];
                            try {
                                if (obj.get(combo.valueField) === o['value']) {
                                    combo.select(obj);
                                }
                            } catch (e) {
                            }
                        }
                    });
                }
            }
        }

        return panel;
    },
    doEdit: function() {
        gm.me().crudMode = 'CREATE';

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 640,
            height: 600,
            items: gm.me().forms,
            closable: false,
            onEsc: function() {
                this.hide();
            },
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {
                        gm.me().crudMode = 'EDIT';
                        gm.me().doCreateCore(prWin);
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        if (prWin) {
                            prWin.hide();
                        }
                    }
                }
            ]
        });

        prWin.show();
    },
    doCreate: function() {

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '등록',
            width: 640,
            height: 600,
            items: gm.me().forms,
            closable: false,
            onEsc: function() {
                this.hide();
            },
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {
                        gm.me().crudMode = 'CREATE';
                        gm.me().doCreateCore(prWin);
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        if (prWin) {
                            prWin.hide();
                        }
                    }
                }
            ]
        });

        prWin.show();
    },
    doCreateCore: function (prWin) {

        let sendValue = {};
        let CLASS_ALIAS = [];
        let fileForm = null;

        if (gm.me().formItems != null) {

            for (let i = 0; i < this.formItems.length; i++) {
                let form = this.formItems[i];
                let b = form['hasFileAttach'];
                if (b === true) {
                    fileForm = form;
                }
                if (form.isValid()) {

                    let value = form.getValues(false);

                    value = this.replaceComma(form.getForm().getFields(), value);

                    for (let key in value) {
                        let aliasArr = key.split('|');
                        let readOnly = false;
                        if (aliasArr.length > 1) {
                            CLASS_ALIAS.push(aliasArr[0]);

                            let o = (aliasArr.length === 2) ? this.getFieldObj(aliasArr[1]) : this.getFieldObj(aliasArr[1] + '|' + aliasArr[2]);
                            if (o != null) {
                                readOnly = o['readOnly'] == null ? false : o['readOnly'];
                            }
                        }

                        if (key === 'default|unique_id') {
                            let rec = this.vSELECTED_RECORD;
                            sendValue[key] = rec == null ? -1 : rec.get(this.UPDATE_FIELD_NAME);
                        } else {
                            if (readOnly === false) {
                                sendValue[key] = gUtil.stripQuot(value[key]);
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert('안내', '필수입력 항목을 확인하세요.', function () {
                    });
                    gm.me().createAction.enable();
                    Ext.getBody().unmask();
                    return;
                }
            }
        }
        CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);

        sendValue['CLASS_ALIAS'] = CLASS_ALIAS;

        sendValue['CRUD_MODE'] = this.crudMode;
        gm.me().crudMode = this.crudMode;
        sendValue['MENU_LINK'] = this.link;

        if (fileForm == null) {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/generalData.do?method=create',
                params: sendValue,
                method: 'POST',
                success: function () {

                    if (prWin) {
                        prWin.hide();
                    }

                    if (gm.me().crudMode === 'EDIT') {
                        gMain.setCrPaneToolbarMsg('수정되었습니다.');
                    } else {
                        gMain.setCrPaneToolbarMsg('등록되었습니다.');
                    }

                    gm.me().redrawStore(sendValue);
                    gm.me().postCreateCallback(sendValue);
                },
                failure: function (result, op) {
                    let jsonData = Ext.util.JSON.decode(result.responseText);
                    let resultMessage = jsonData.data.result;

                    Ext.getBody().unmask();
                    gm.me().createAction.enable();
                    gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                    Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function () {
                    });

                }
            });
        }
    }
});