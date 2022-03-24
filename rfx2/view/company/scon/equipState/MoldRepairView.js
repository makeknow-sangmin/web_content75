//수리현황
Ext.define('Rfx2.view.company.scon.equipState.MoldRepairView', {
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

        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });

        buttonToolbar.insert(1, this.finishFixAction);
        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.finishFixAction.enable();
            } else {
                gMain.selPanel.finishFixAction.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items        : []
});

