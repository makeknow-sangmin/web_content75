Ext.define('Rfx2.view.company.chmr.salesDelivery.ClosingSalesView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'closing-sales-view',
    initComponent: function(){

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.company.kbtech.ClosingSales', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            100000
            ,{}
            , ['closal']
        );

        //매출마감
        this.closingSalesAction = Ext.create('Ext.Action',{
            iconCls: 'af-list-ul',
            text: '매출마감',
            tooltip:'매출마감',
            disabled: true,

            handler: function(widget, event) {
                gm.me().prwinCs();
            }
        });

        //이월처리
        this.carryOverAction = Ext.create('Ext.Action',{
            iconCls: 'af-list-ul',
            text: '이월처리',
            tooltip:'이월처리',
            disabled: true,
            handler: function(widget, event) {
                gm.me().doCarryOver();
            }
        });

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField ({
            type: 'checkbox',
            field_id: 'hasNotCloseSales',
            items: [
                {
                    boxLabel: '미마감 수주만',
                    checked: true
                },
            ],
        });


        this.addSearchField ({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: "출하기간",
            sdate: Ext.Date.getFirstDateOfMonth(new Date()),
            edate: Ext.Date.getLastDateOfMonth(new Date())
        });

        this.addSearchField('wa_name');
        this.addSearchField('project_varchar6');
        this.addSearchField('project_varchar5');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : [
                'REGIST', 'COPY',/* 'EDIT', */'REMOVE'
            ],
            RENAME_BUTTONS : [
            ]
        });

        buttonToolbar.insert(1, this.carryOverAction);
        buttonToolbar.insert(1, this.closingSalesAction);

        this.setRowClass(function (record, index) {

            var c = record.get('aprv_date');

            if (c !== null) {
                return 'green-row';
            }

        });

        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if(o['dataType'] === 'number') {
                o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                    if(gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        if(summary.length > 0) {
                            var objSummary = Ext.decode(summary);
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
            features: [{
                ftype: 'summary',
                dock: 'top'
            }]
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
                gm.me().closingSalesAction.enable();
                gm.me().carryOverAction.enable();
            } else {
                gm.me().closingSalesAction.disable();
                gm.me().carryOverAction.enable();
            }

        });

        //디폴트 로드
        gm.setCenterLoading(false);

        var sDate = Ext.Date.getFirstDateOfMonth(new Date());
        var eDate = Ext.Date.getLastDateOfMonth(new Date());

        sDate = Ext.Date.format(sDate, 'Y-m-d');
        eDate = Ext.Date.format(eDate, 'Y-m-d');

        this.store.getProxy().setExtraParam('aprv_date', sDate + ':' + eDate);
        this.store.load();

    },
    prwinCs: function () {

        var selection = gm.me().grid.getSelectionModel().getSelection();

        if(selection.length > 0) {

            var form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'form',
                fieldDefaults: {
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: '매출 마감을 실시합니다.',
                        items: [
                            {
                                xtype: 'datefield',
                                anchor: '97%',
                                name: 'closing_date',
                                id: gu.id('closing_date'),
                                fieldLabel: '마감날짜',
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                value: new Date()
                            }
                        ]
                    }
                ]
            });

            var myHeight = 200;
            var myWidth = 500;

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '매출마감',
                width: myWidth,
                height: myHeight,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        Ext.MessageBox.show({
                            title: '매출마감',
                            msg: '매출 마감을 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {

                                if (result == 'yes') {

                                    prWin.setLoading(true);

                                    var selections = gm.me().grid.getSelectionModel().getSelection();
                                    var closalArr = [];

                                    for (var i = 0; i < selections.length; i++) {
                                        closalArr.push(selections[i].get('unique_id_long'));
                                    }

                                    form.submit({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=closingSales',
                                        params: {
                                            closalArr: closalArr
                                        },
                                        success: function (val, action) {
                                            Ext.Msg.alert('완료', '매출마감이 처리 되었습니다.');
                                            gMain.selPanel.store.load(function () {
                                            });
                                            prWin.setLoading(false);
                                            prWin.close();
                                        },
                                        failure: function (val, action) {
                                            Ext.Msg.alert('', '매출마감을 처리하던 도중 오류가 발생하였습니다.');
                                            prWin.setLoading(false);
                                            prWin.close();
                                        }
                                    });

                                } else {
                                    prWin.close();
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }//btn handler
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }]
            });
            prWin.show();
        } else {
            Ext.Msg.alert('', '출하 가능한 상품이 아닙니다.');
        }
    },
    doCarryOver: function () {

        var selection = gm.me().grid.getSelectionModel().getSelection();

        if(selection.length > 0) {

            Ext.MessageBox.show({
                title: '이월처리',
                msg: '이월처리는 선택한 마감 정보를 그대로 복사하나</br>' +
                '복사한 정보는 마감번호 및 마감일이 초기화 됩니다.</br>' +
                '</br>이월처리 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: function (result) {

                    if (result == 'yes') {

                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var closalArr = [];

                        for (var i = 0; i < selections.length; i++) {
                            closalArr.push(selections[i].get('unique_id_long'));
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/delivery.do?method=doCarryOver',
                            params: {
                                closalArr: closalArr
                            },
                            success: function (val, action) {
                                Ext.Msg.alert('완료', '이월 처리 되었습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                                prWin.setLoading(false);
                            },
                            failure: function (val, action) {
                                Ext.Msg.alert('', '이월 처리 도중 오류가 발생하였습니다.');
                                prWin.setLoading(false);
                            }
                        });

                    }
                },
                icon: Ext.MessageBox.QUESTION
            });
        } else {
            Ext.Msg.alert('', '출하 가능한 상품이 아닙니다.');
        }
    }/*,
    selMode : 'SINGLE',
    checkOnly: true,
    selAllowDeselect: true*/
});
