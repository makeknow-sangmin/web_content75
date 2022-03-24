Ext.define('Rfx2.view.company.hsct.equipState.MachineOperationView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'board-view',
    initComponent: function () {

        this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
        this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
        this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
        this.setDefValue('board_count', 0); //Hidden Value임.
        this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField(
            {
                emptyText: '설비',
                field_id: 'mchnUid'
                , store: 'MachineStore'
                , displayField: 'name_ko'
                , valueField: 'unique_id_long'
                , innerTpl: '<div data-qtip="{unique_id}">{name_ko} </div>'
            });
        this.addSearchField({
            type: 'dateRange',
            field_id: 'searchDate',
            text: "가동일",
            // sdate: Ext.Date.add(new Date(), Ext.Date.DAY, -1),
            sdate: new Date(),
            edate: new Date()
        });
        // this.addSearchField('board_title');
        // this.addSearchField('board_content');
        // this.addSearchField('board_name');
        // this.addSearchField('user_id');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델 정의
        this.createStore('Rfx2.model.MachineOperation', [{
                property: 'name_ko',
                direction: 'ASC'
            }],
            gMain.pageSize
            , {
                nameKo: 'name_ko',
                startTime: 'start_time'

            }
            , ['mchnopr']
        );
        this.store.getProxy().setExtraParams({
            sortCond: 'pcsmchn.name_ko:mchnopr.start_time',
            onlyMchnOpr: 'Y'
            // order_by:
        });
        // gu.getCmp('multisort1combo').setValue('name_ko');
        // gu.getCmp('multisort2combo').setValue('start_time');
        // gu.getCmp('sortCond-multisort').setValue('pcsmchn.name_ko:mchnopr.start_time');
        // console.log('동명', gUtil.getCmp('multisort1combo'));
        // console.log('동명', gUtil.getCmp('sortCond-multisort'));
        // console.log('동명', Ext.getCmp('sortCond-multisort'+this.link));

        this.updateMchnOprAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '가동/비가동 내역 수정',
            tooltip: '해당 가동현황의 내역을 수정합니다',
            disabled: false,
            handler: function () {
                gm.me().updateMchnOprHandler();
            }
        })

        buttonToolbar.insert(1, this.updateMchnOprAction);

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        // console.log('동명2', gUtil.getCmp('multisort1combo'));
        // console.log('동명2', gUtil.getCmp('sortCond-multisort'));
        // console.log('동명2', Ext.getCmp('sortCond-multisort'+this.link));
        // gu.getCmp('multisort1combo').setValue('pcsmchn.name_ko');
        // gu.getCmp('multisort2combo').setValue('mchnopr.start_time');
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        this.loadStoreAlways = true;
        //
        // switch (vCompanyReserved4) {
        // 	case 'BIOT01KR':
        // 		Ext.Ajax.request({
        // 			url: 'https://mail.protechsite.com/',
        // 			success : function(result, request) {
        // 			},
        // 			failure: extjsUtil.failureMessage
        // 		});
        // 		break;
        // }
    }, // end of init
    items: [],

    updateMchnOprHandler: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var is_operation = rec.get('isOperation'),
            start_time = rec.get('startTime'),
            end_time = rec.get('endTime'),
            name_ko = rec.get('nameKo'),
            mchn_uid = rec.get('mchnUid'),
            mchnopr_uid = rec.get('unique_id_long'),
            operation_cnt = rec.get('operationCnt'),
            defaultFieldStyle = {
                anchor: '100%',
                labelAlign: 'right',
                padding: 5,
                fieldStyle: 'background-color: #EAEAEA;',
                readOnly: true,
            };
        var infoHeader = Ext.create('Ext.form.FieldSet', {
            title: '설비가동정보',
            width: '99%',
            height: '40%',
            layout: {type: 'hbox'},
            defaults: defaultFieldStyle,
            items: [
                {
                    xtype: 'textfield',
                    value: name_ko,
                    flex: 0.6
                },
                {
                    xtype: 'textfield',
                    value: is_operation == 'Y' ? '가동' : is_operation == 'N' ? '비가동' : '',
                    flex: 0.5
                },
                {
                    xtype: 'textfield',
                    value: start_time,
                    flex: 1.2
                },
                {
                    xtype: 'textfield',
                    value: end_time,
                    flex: 1.2
                },
            ]
        })

        var form;

        if (is_operation == 'Y') {
            var produceOrderStore = Ext.create('Rfx2.store.ExtendPcsstepStrore', {autoLoad: false});
            produceOrderStore.getProxy().setExtraParams({
                'mchn_uid': mchn_uid,
                'start_time': start_time,
                'end_time': end_time
            });
            form = Ext.create('Ext.form.Panel', {
                title: '가동내역',
                width: '99%',
                height: '60%',
                layout: {type: 'vbox'},
                items: [
                    {
                        xtype: 'panel',
                        layout: 'hbox',
                        width: '99%',
                        height: '50%',
                        region: 'north',
                        defaults: defaultFieldStyle,
                        items: [
                            {
                                xtype: 'combo',
                                store: produceOrderStore,
                                // name: 'pcsstep_uid',
                                emptyText: '생산LOT번호 | 품번 - 품명',
                                flex: 1,
                                readOnly: false,
                                displayField: 'item_code',
                                valueField: 'pcsstep_uid',

                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{pcsstep_uid}">{lot_no} | {item_code} - {item_name}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        gu.getCmp('pcsstep_uid').setValue(record.get('unique_id_long'));
                                        gu.getCmp('mold_uid').setValue(record.get('mold_uid'));
                                        gu.getCmp('mold_code').setValue(record.get('mold_code'));
                                        gu.getCmp('item_name').setValue(record.get('item_name'));
                                    }
                                }
                            },
                            new Ext.form.Hidden({
                                id: gu.id('pcsstep_uid'),
                                name: 'pcsstep_uid',
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('mold_uid'),
                                name: 'mold_uid'
                            })
                        ]

                    },
                    {
                        xtype: 'panel',
                        layout: 'hbox',
                        width: '99%',
                        height: '50%',
                        region: 'south',
                        defaults: defaultFieldStyle,
                        items: [
                            {
                                id: gu.id('mold_code'),
                                xtype: 'textfield',
                                value: '금형코드',
                                flex: 1,
                            },
                            {
                                id: gu.id('item_name'),
                                xtype: 'textfield',
                                value: '품명',
                                flex: 1,
                            },
                            {
                                xtype: 'textfield',
                                value: '타발수 : ' + operation_cnt,
                                flex: 1,
                            }
                        ]
                    }
                ]
            })
        } else if (is_operation == 'N') {
            var typeCodeStore = Ext.create('Rfx.store.GeneralCodeStore', {parentCode: 'LOSS_TYPE', autoLoad: false});
            var detailCodeStore = Ext.create('Rfx.store.GeneralCodeStore', {autoLoad: false});
            form = Ext.create('Ext.form.Panel', {
                title: '비가동내역',
                width: '99%',
                height: '60%',
                layout: {type: 'hbox'},
                defaults: {
                    anchor: '100%',
                    padding: 10,
                    flex: 1
                },
                items: [
                    {
                        xtype: 'combo',
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        emptyText: '비가동내역',
                        store: typeCodeStore,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                                detailCodeStore.parentCode = combo.value;
                                detailCodeStore.load();
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        displayField: 'code_name_kr',
                        valueField: 'unique_id_long',
                        name: 'code_uid',
                        emptyText: '상세내역',
                        store: detailCodeStore,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        },
                    }
                ]
            })

        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '내역 입력',
            width: 450,
            height: 300,
            items: [
                infoHeader,
                form
            ],
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {

                        Ext.MessageBox.show({
                            title: '확인',
                            msg: '내역을 수정하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {
                                var formVal = form.getForm().getValues(false);
                                // console.log('동명', mchnopr_uid);
                                console.log('동명', formVal['pcsstep_uid']);
                                // console.log('동명', formVal['mold_uid']);
                                // console.log('동명', formVal['code_uid']);

                                if (result == 'yes') {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/machine.do?method=updateMchnOprHst',
                                        params: {
                                            'mchnopr_uid': mchnopr_uid,
                                            'pcsstep_uid': formVal['pcsstep_uid'],
                                            'mold_uid': formVal['mold_uid'],
                                            'code_uid': formVal['code_uid'],
                                        },

                                        success: function (result, request) {
                                            gm.me().store.load();
                                            Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
                                            });
                                            prWin.close();
                                        },//endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });//endofajax
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
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
    // 정렬 툴바 사용 여부
    // useValueCopyCombo: false, //값복사 사용
    // useDivisionCombo: false,  //사업부 콤보 시용
    // selectedSortComboCount: 0, //정렬 콤보 갯수
});