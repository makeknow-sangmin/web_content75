//수리현황
Ext.define('Rfx2.view.company.chmr.equipState.MoldRepairView', {
    extend       : 'Rfx2.base.BaseView',
    xtype        : 'repair-view',
    initComponent: function () {

        this.setDefValue('occ_date', new Date());

        var next7 = gUtil.getNextday(7);
        this.setDefValue('fix_date', next7);

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField(
        //     {
        //         field_id      : 'mchn_uid'
        //         , store       : 'PcsMchnStore'
        //         , displayField: 'name_ko'
        //         , valueField  : 'unique_id'
        //         , width       : 260
        //         , innerTpl    : '<div data-qtip="{mchn_code}">[{mchn_code}] {name_ko}</div>'
        //     });
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        // PDF
        // buttonToolbar.insert(2, this.printPDFAction);
        this.createStore('Rfx2.model.company.chmr.MoldRepair', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            , {}
            , ['pcsmcfix']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('state');
            switch (c) {
                case 'Y':
                    return 'yellow-row';
                    break;
                default:
                    return 'white-row';
                    break;
            }
        });


        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        this.finishFixAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : '수리완료 처리',
            tooltip : '금형 수리내역을 완료처리 합니다.',
            disabled: true,
            handler : function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('>>>> rec', rec);
                if (selection.length > 1) {
                    Ext.MessageBox.alert('알림', '하나의 요청건만 선택 후 실행 가능한 기능입니다.<br>한 개의 건만 선택해주십시오,');
                    return;
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        xtype        : 'form',
                        frame        : false,
                        border       : false,
                        bodyPadding  : 10,
                        region       : 'center',
                        layout       : 'form',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget : 'side'
                        },
                        items        : [
                            {
                                xtype: 'fieldset',
                                title: '수리완료일자를 입력하여 해당 내역을 완료처리 합니다.',
                                items: [
                                    {
                                        xtype     : 'datefield',
                                        fieldLabel: '수리완료일자',
                                        id        : gu.id('fix_date'),
                                        anchor    : '97%',
                                        name      : 'fix_date',
                                        editable  : true,
                                        format    : 'Y-m-d',
                                        value     : new Date()
                                    },
                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '수리완료 처리',
                        width  : 500,
                        height : 200,
                        items  : form,
                        buttons: [
                            {
                                text   : CMD_OK,
                                scope  : this,
                                handler: function () {
                                    Ext.MessageBox.show({
                                        title  : '',
                                        msg    : '해당 건에 대하여 완료처리 하겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon   : Ext.MessageBox.QUESTION,
                                        fn     : function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                var fix_date = gu.getCmp('fix_date').getValue();
                                                var sYear = fix_date.getFullYear();
                                                var sMonth = fix_date.getMonth() + 1;
                                                if (sMonth < 10) {
                                                    sMonth = '0' + sMonth;
                                                }
                                                var sDay = fix_date.getDate();
                                                if (sDay < 10) {
                                                    sDay = '0' + sDay;
                                                }

                                                var full_date = sYear + '-' + sMonth + '-' + sDay;
                                                Ext.Ajax.request({
                                                    url    : CONTEXT_PATH + '/production/mcfix.do?method=moldfixfinish',
                                                    params : {
                                                        unique_id: rec.get('unique_id'),
                                                        fix_date : full_date
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', '처리 되었습니다.');
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
            }
        });

        
        this.updateFixAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : '수리수정 처리',
            tooltip : '금형 수리내역을 수정처리 합니다.',
            disabled: true,
            handler : function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('>>>> rec', rec);
                console_logs('>>>> occ_Date ', new Date(rec.get('occ_date')));
                if(rec.get('state')==='I'){
                if (selection.length > 1) {
                    Ext.MessageBox.alert('알림', '하나의 요청건만 선택 후 실행 가능한 기능입니다.<br>한 개의 건만 선택해주십시오,');
                    return;
                } else {
                        var form = Ext.create('Ext.form.Panel', {
                            xtype        : 'form',
                            frame        : false,
                            border       : false,
                            bodyPadding  : 10,
                            region       : 'center',
                            layout       : 'form',
                            fieldDefaults: {
                                labelAlign: 'right',
                                msgTarget : 'side'
                            },
                            items        : [
                                {
                                    xtype: 'fieldset',
                                    title: '수정 값을 입력하여 해당 내역을 수정 합니다.',
                                    items: [
                                        // {
                                        //     fieldLabel: '금형UID',
                                        //     xtype: 'hiddenfield',
                                        //     // anchor: '100%',
                                        //     width: '99%',
                                        //     name: 'mold_uid',
                                        //     value : record.get('unique_id_long')
                                        // },
                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'mold_code',
                                        //     name: 'mold_code',
                                        //     padding: '0 0 5px 30px',
                                        //     // anchor: '100%',
                                        //     width: '80%',
                                        //     allowBlank: true,
                                        //     fieldLabel: 'TAG번호',
                                        //     value: rec.get('mold_code')
                                        // },
                                        {
                                            xtype: 'datefield',
                                            id: gu.id('occ_date'),
                                            name: 'occ_date',
                                            padding: '0 0 5px 30px',
                                            width: '80%',
                                            // anchor: '100%',
                                            format: 'Y-m-d',
                                            allowBlank: true,
                                            fieldLabel: '수리일자',
                                            value: new Date(rec.get('occ_date'))
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: gu.id('occ_reason'),
                                            name: 'occ_reason',
                                            padding: '0 0 5px 30px',
                                            // anchor: '100%',
                                            width: '80%',
                                            allowBlank: true,
                                            fieldLabel: '수리내역',
                                            value: rec.get('occ_reason')
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: gu.id('fix_desc'),
                                            name: 'fix_desc',
                                            padding: '0 0 5px 30px',
                                            // anchor: '100%',
                                            width: '80%',
                                            allowBlank: true,
                                            fieldLabel: '수리처',
                                            value: rec.get('fix_desc')
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: gu.id('fix_mchn'),
                                            name: 'fix_mchn',
                                            padding: '0 0 5px 30px',
                                            // anchor: '100%',
                                            width: '80%',
                                            allowBlank: true,
                                            fieldLabel: '수리자',
                                            value: rec.get('fix_mchn')
                                        },{
                                            xtype: 'textfield',
                                            id: gu.id('occ_desc'),
                                            name: 'occ_desc',
                                            padding: '0 0 5px 30px',
                                            // anchor: '100%',
                                            width: '80%',
                                            allowBlank: true,
                                            fieldLabel: '비고',
                                            value: rec.get('occ_desc')
                                        }
                                    ]
                                }
                            ]
                        });
                   
                    var prWin = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '수리수정 처리',
                        width  : 500,
                        height : 330,
                        items  : form,
                        buttons: [
                            {
                                text   : CMD_OK,
                                scope  : this,
                                handler: function () {
                                    Ext.MessageBox.show({
                                        title  : '',
                                        msg    : '해당 건에 대하여 수정 완료처리 하겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon   : Ext.MessageBox.QUESTION,
                                        fn     : function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                Ext.Ajax.request({
                                                    url    : CONTEXT_PATH + '/production/mcfix.do?method=moldfixUpdate',
                                                    params : {
                                                        unique_id: rec.get('unique_id'),
                                                        occ_date: gu.getCmp('occ_date').getValue(),
                                                        occ_reason: gu.getCmp('occ_reason').getValue(),
                                                        fix_desc: gu.getCmp('fix_desc').getValue(),
                                                        fix_mchn: gu.getCmp('fix_mchn').getValue(),
                                                        occ_desc: gu.getCmp('occ_desc').getValue()
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', '처리 되었습니다.');
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
                }else{
                    Ext.MessageBox.alert('알림', '완료된 건에 대해서는 수정이 불가능합니다.');
                }
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });

        buttonToolbar.insert(1, this.finishFixAction);
        buttonToolbar.insert(2, this.updateFixAction);
        
        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.finishFixAction.enable();
                gMain.selPanel.updateFixAction.enable();
            } else {
                gMain.selPanel.finishFixAction.disable();
                gMain.selPanel.updateFixAction.disable();
            }

        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items        : []
});

