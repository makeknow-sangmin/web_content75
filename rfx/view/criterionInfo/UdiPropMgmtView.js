Ext.define('Rfx.view.criterionInfo.UdiPropMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'udi-prop-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('class_name');

        this.addSearchField({
            field_id: 'udi_prop'
            , store: 'UdiPropListStore'
            , displayField: 'udi_prop'
            , valueField: 'udi_prop'
            , value: 'udi_prop'
            , innerTpl: '<div data-qtip="{udi_prop}">{udi_prop}</div>'
        });

        //this.addSearchField('udi_prop');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //모델을 통한 스토어 생성/
        this.createStore('Rfx2.store.company.bioprotech.UdiPropMgmtStore', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        // ---------------------------버튼
        // 등록
        this.addUdiProp = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
                gm.me().addUdiPropFnc();
            }
        });

        // 수정
        this.modifyUdiProp = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().modifyUdiPropFnc();
            }
        });

        // 삭제
        this.deleteUdiProp = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('deleteUdiProp'),
            handler: function() {
                Ext.MessageBox.show({
                    title: 'UDI 속성 삭제',
                    msg: '해당 속성을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {
                            var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/qualitymgmt.do?method=udiPropDel',
                                params:{
                                    unique_id: rec.get('unique_id_long')
                                },
                                success : function(result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                },
                                failure : extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        buttonToolbar.insert(1, this.deleteUdiProp);
        buttonToolbar.insert(1, this.modifyUdiProp);
        buttonToolbar.insert(1, this.addUdiProp);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

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
                    width: '100%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.modifyUdiProp.enable();
                this.deleteUdiProp.enable();
                
            } else {
                this.modifyUdiProp.disable();
                this.deleteUdiProp.disable();
            }
        });

    },

    addUdiPropFnc: function() {

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '5 5 5 5',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 50,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '분류',
                    xtype: 'combo',
                    store: ['포장재', 'Barcode 형식', 'Type'],
                    id: gu.id('udi_prop'),
                    name: 'udi_prop',
                    flex: 1,
                    emptyText: '선택해주세요.',
                    typeAhead: false,
                    minChars: 1
                },
                {
                    fieldLabel: '속성명',
                    xtype: 'textfield',
                    id: gu.id('class_name'),
                    name: 'class_name',
                    flex: 1
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 300,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val', val);
                            form.submit({
                                url: CONTEXT_PATH + '/quality/qualitymgmt.do?method=udiPropInsert',
                                params: {
                                    udi_prop: val['udi_prop'],
                                    class_name: val['class_name']
                                },
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
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

    modifyUdiPropFnc: function() {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '5 5 5 5',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 50,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '분류',
                    xtype: 'combo',
                    store: ['포장재', 'Barcode 형식', 'Type'],
                    id: gu.id('udi_prop'),
                    name: 'udi_prop',
                    flex: 1,
                    value: rec.get('udi_prop'),
                    typeAhead: false,
                    minChars: 1
                },
                {
                    fieldLabel: '속성명',
                    xtype: 'textfield',
                    id: gu.id('class_name'),
                    name: 'class_name',
                    value: rec.get('class_name'),
                    flex: 1
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 300,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val', val);

                            form.submit({
                                url: CONTEXT_PATH + '/quality/qualitymgmt.do?method=udiPropUpdate',
                                params: {
                                    udi_prop: val['udi_prop'],
                                    class_name: val['class_name'],
                                    unique_id: rec.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
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