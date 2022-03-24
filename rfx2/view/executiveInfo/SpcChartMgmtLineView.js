Ext.define('Rfx2.view.executiveInfo.SpcChartMgmtLineView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-chart-mgmtline-view',
    initComponent: function(){

        Ext.each(this.columns, function(columnObj, index) {
            columnObj["editor"] = {clicksToEdit:2};
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.SpcChartMgmtLine', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            /*pageSize*/
            gm.pageSize
            ,{
                process_type_kr: 'spcchart.process_type',
                measuring_type_kr: 'measuring_type',
                item_type_kr: 'item_type'
            }
            , ['spcchart']
        );

        this.addSpcChartButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
                gm.me().addUserView();
            }
        });

        this.modifySpcChartButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
                gm.me().modifyUserView();
            }
        });

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField (
        {
            field_id: 'item_type'
            ,store: 'SPCProductTypeStore'
            ,displayField: 'name'
            ,valueField: 'code'
            ,innerTpl	: '<div data-qtip="{name}">{name}</div>'
        });

        this.addSearchField (
        {
            field_id: 'process_type'
            ,store: 'SPCProcessStore'
            ,displayField: 'name'
            ,valueField: 'code'
            ,innerTpl	: '<div data-qtip="{name}">{name}</div>'
        });

        this.addSearchField (
        {
            field_id: 'legend_code'
            ,width: 170
            ,store: 'SpcColumnNameStore'
            ,displayField: 'legend_code_kr'
            ,valueField: 'unique_id_long'
            ,innerTpl: '<div data-qtip="{legend_code}">[{item_type_kr}] {legend_code_kr}</div>'
        });

        this.addSearchField('item_name');
        
        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        buttonToolbar.items.each(function(item, index, length) {
            if(index == 1 || index == 2 || index == 3 || index == 4) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.modifySpcChartButton);
        buttonToolbar.insert(1, this.addSpcChartButton);

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

    },

    addUserView: function() {

        var combstStore = Ext.create('Mplm.store.CombstStore', {});
        var spcChartProductTypeStore = Ext.create('Mplm.store.SpcChartProductTypeStore', {});
        var spcChartProcessStore = Ext.create('Mplm.store.SpcChartProcessStore', {});
        var spcColumnNameStore = Ext.create('Mplm.store.SpcColumnNameStore', {});


        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
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
                    fieldLabel: gm.getMC('CMD_Product', '제품군'),
                    xtype: 'combo',
                    id: 'item_type_kr',
                    name: 'item_type_kr',
                    store: spcChartProductTypeStore,
                    displayField:   'name',
                    valueField: 'code',
                    hideLabel: false,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{code}">{name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            spcColumnNameStore.getProxy().setExtraParam('item_type', record.get('code'));
                            spcColumnNameStore.load();
                            gu.getCmp('process_type_kr').clearValue();
                            gu.getCmp('spccolumn_uid').clearValue();
                        }
                    }
                },
                {
                    fieldLabel: '공정',
                    xtype: 'combo',
                    id: gu.id('process_type_kr'),
                    name: 'process_type_kr',
                    store: spcChartProcessStore,
                    displayField:   'name',
                    valueField: 'code',
                    hideLabel: false,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{code}">{name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            spcColumnNameStore.getProxy().setExtraParam('process_type', record.get('code'));
                            spcColumnNameStore.load();
                            gu.getCmp('spccolumn_uid').clearValue();
                        }
                    }
                },
                {
                    fieldLabel: '항목',
                    xtype: 'combo',
                    id: gu.id('spccolumn_uid'),
                    name: 'spccolumn_uid',
                    store: spcColumnNameStore,
                    displayField:   'legend_code_kr',
                    valueField: 'unique_id_long',
                    hideLabel: false,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{unique_id_long}">{legend_code_kr}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {

                        }
                    }
                },
                {
                    fieldLabel: '품목명',
                    xtype: 'textfield',
                    name: 'item_name'
                },
                {
                    fieldLabel: 'UCL',
                    xtype: 'textfield',
                    name: 'ucl'
                },
                {
                    fieldLabel: 'LCL',
                    xtype: 'textfield',
                    name: 'lcl'
                },
                {
                    fieldLabel: 'USL',
                    xtype: 'textfield',
                    name: 'usl'
                },
                {
                    fieldLabel: 'LSL',
                    xtype: 'textfield',
                    name: 'lsl'
                }
            ]
        });

        //spcChartProductTypeStore.load();

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 350,
            height: 330,
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
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcChartMgmt',
                                params: {
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

    modifyUserView: function() {

        var combstStore = Ext.create('Mplm.store.CombstStore', {});
        var spcChartProductTypeStore = Ext.create('Mplm.store.SpcChartProductTypeStore', {});
        var spcChartProcessStore = Ext.create('Mplm.store.SpcChartProcessStore', {});
        var spcColumnNameStore = Ext.create('Mplm.store.SpcColumnNameStore', {});
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];


        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
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
                    fieldLabel: gm.getMC('CMD_Product', '제품군'),
                    xtype: 'textfield',
                    name: 'item_type_kr',
                    value: rec.get('item_type_kr'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '공정',
                    xtype: 'textfield',
                    name: 'process_type_kr',
                    value: rec.get('process_type_kr'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '항목',
                    xtype: 'textfield',
                    name: 'legend_code_kr',
                    value: rec.get('legend_code_kr'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '품목명',
                    xtype: 'textfield',
                    name: 'item_name',
                    value: rec.get('item_name')
                },
                {
                    fieldLabel: 'UCL',
                    xtype: 'textfield',
                    name: 'ucl',
                    value: Ext.util.Format.number(rec.get('ucl'), '0.##')

                },
                {
                    fieldLabel: 'LCL',
                    xtype: 'textfield',
                    name: 'lcl',
                    value: Ext.util.Format.number(rec.get('lcl'), '0.##')
                },
                {
                    fieldLabel: 'USL',
                    xtype: 'textfield',
                    name: 'usl',
                    value: Ext.util.Format.number(rec.get('usl'), '0.##')
                },
                {
                    fieldLabel: 'LSL',
                    xtype: 'textfield',
                    name: 'lsl',
                    value: Ext.util.Format.number(rec.get('lsl'), '0.##')
                },
                {
                    xtype: 'hiddenfield',
                    name: 'unique_id_long',
                    value: rec.get('unique_id_long')
                }
            ]
        });

        //spcChartProductTypeStore.load();

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 350,
            height: 330,
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
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=updateSpcChartMgmt',
                                params: {
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
