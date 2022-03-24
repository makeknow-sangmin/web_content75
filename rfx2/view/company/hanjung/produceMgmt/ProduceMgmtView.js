Ext.define('Rfx2.view.company.hanjung.produceMgmt.ProduceMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-mgmt-view',
    aStore  : Ext.create('Mplm.store.DeptStore', { dept_group: 'PCO' }),
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            type: 'combo'
            , field_id: 'status'
            , store: "RecevedStateStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });
        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });
        // this.addSearchField('reserved_varchar6');
        // this.addSearchField (
        //     {
        //         type: 'combo'
        //         ,field_id: 'pm_uid'
        //         ,store: "UserDeptStore"
        //         ,displayField: 'user_name'
        //         ,valueField: 'unique_id'
        //         ,value : vCUR_USER_UID
        //         ,params:{dept_code: "D104"}
        //         ,innerTpl	: '<div data-qtip="{dept_name}">{user_name}</div>'
        //     });
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.ProduceMgmt', [{
            property: 'create_date',
            direction: 'ASC'
        }],
            /*pageSize*/
            gMain.pageSize
            , {}
            , ['cartmap']
        );

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.denyWorkPlan = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '계획반려',
            tooltip: '계획반려',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 데이터를 수주등록 단계로 이동하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gm.me().denyWorkPlanFc(rec);
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function () {

            }
        });
       
        buttonToolbar.insert(1, this.prEstablishAction);
        buttonToolbar.insert(2, this.denyWorkPlan);

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
        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length == 1) {
                    gm.me().prEstablishAction.enable();
                    gm.me().denyWorkPlan.enable();
                } else {
                    gm.me().prEstablishAction.disable();
                    gm.me().denyWorkPlan.disable();
                }
            }
        });
        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) { });
    },

    producePlanOp: function () {
        this.aStore.getProxy().setExtraParam('menuLink', 'EPC5');
        //var aStore = Ext.create('Mplm.store.DeptStore', { dept_group: 'PCO' });
        gm.me().requestform = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            // title:'공정 선택',
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
                    title: '담당사와 작업지시일을 기재하십시오.',
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'big_pcs_code',
                            value: this.grid.getSelectionModel().getSelection()[0].get('sp_code')
                        },
                        {
                            fieldLabel: '담당사',
                            xtype: 'combo',
                            anchor: '97%',
                            name: 'out_maker',
                            allowBlank: false,
                            id: gu.id('out_maker'),
                            mode: 'local',
                            displayField: 'dept_name',
                            store: this.aStore,
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                }
                            }
                        },
                        {
                            xtype: 'datefield',
                            anchor: '97%',
                            name: 'aprv_date',
                            fieldLabel: '작업지시일',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
                        },
                        {
                            xtype: 'textfield',
                            anchor: '97%',
                            name: 'specialNote',
                            fieldLabel: '특이사항'
                        }, {
                            xtype: 'label',
                            width: 500,
                            height: 20,
                            text: '☞ 담당사가 없을 시 담당사 추가로 추가 입력 후 재 선택 해주세요.',
                            style: 'color:blue; align:right'
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Production_Order', '계획수립'),
            width: 450,
            height: 270,
            items: gm.me().requestform,
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {
                        prWin.setLoading(true);
                        var form = gm.me().requestform.getForm();
                        console_logs('form value', form.getValues());
                        var val = form.getValues();
                        var selectedgrid = gm.me().grid.getSelectionModel().getSelection();
                        var lot_value = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_varcharh');
                        var cartmaparr = [];
                        var po_quan = 0;
                        var reserved_double4 = 0;
                        var selections = selectedgrid;
                        for (var i = 0; i < selections.length; i++) {
                            var rec = selections[i];
                            var uid = rec.get('unique_id_long');  //CARTMAP unique_id
                            cartmaparr.push(uid);
                            var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
                            console_logs('unit 수량', po_quan_unit);
                            po_quan = po_quan + po_quan_unit;
                            console_logs('po_quan 수량', po_quan);
                            var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                            reserved_double4 = reserved_double4 + tmp_weight;
                            console_logs('중량', reserved_double4);
                        }
                        var order_com_unique = selections[0].get('order_com_unique');
                        console_logs('cartmaparr', cartmaparr);
                        var ac_uid = selections[0].get('ac_uid');
                        var out_makers = [];

                        var bigPcsCode = gm.me().grid.getSelectionModel().getSelection()[0].get('pj_type');
                        var pcsCodeCnt = gu.mesTplProcessAll[bigPcsCode].length;
                        var out_maker_uid = val['out_maker'];
                        for (var i = 0; i < pcsCodeCnt; i++) {
                            out_makers.push(out_maker_uid);
                        }
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/process.do?method=addProcessPlanWithOutMaker',
                            params: {
                                po_no: lot_value,
                                cartmap_uids: cartmaparr,
                                ac_uid: ac_uid,
                                reserved_varchar3: bigPcsCode,
                                bigPcsCodes: bigPcsCode,
                                po_quan: po_quan,
                                reserved_double4: reserved_double4,
                                order_com_unique: order_com_unique,
                                aprv_date: val['aprv_date'],
                                out_makers: out_makers,
                                reserved_varchar2: val['specialNote']
                            },
                            success: function (val, action) {
                                if (prWin) {
                                    prWin.setLoading(false);
                                    prWin.close();
                                }
                                gm.me().store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                gm.me().store.load();
                            },
                            failure: function (val, action) {
                                if (prWin) {
                                    prWin.setLoading(false);
                                    prWin.close();
                                }
                                gMain.selPanel.store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                gMain.selPanel.store.load();
                            }
                        });
                    }
                }, {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }, {
                    text: '담당사 추가',
                    scope: this,
                    handler: function () {
                        gm.me().addOutMakers();
                    }
                }
            ]
        });
        prWin.show();
    },

    addOutMakers: function () {
        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '추가할 담당사 명을 입력해 주세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '담당사',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '98%',
                            name: 'corp_nane',
                        }
                    ]
                }
            ]
        });

        var subWin = Ext.create('Ext.Window', {
            modal: true,
            title: '담당사 추가',
            width: 300,
            height: 150,
            plain: true,
            items: form,
            autoScroll: true,
            buttons: [
                {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            subWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var corpname = val['corp_nane'];
                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=addOutMakerName',
                                    waitMsg: '등록 중 입니다.',
                                    params: {
                                        corpname: corpname,
                                        deptgroup : 'PCO'
                                    },
                                    success: function (val, action) {
                                        if (subWin) {
                                            subWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '등록되었습니다.');
                                        gm.me().aStore.load(function () {
                                        });
                                    },
                                    failure: function (val, action) {
                                        if (subWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '등록이 실패되었습니다.');
                                            gm.me().aStore.load(function () {
                                            });
                                        }
                                    }
                                });
                            } else {
                                if (subWin) {
                                    subWin.close();
                                }
                            }
                        }
                    }
                }, {
                    text: '취소',
                    handler: function () {
                        if (subWin) {
                            subWin.close();
                        }
                    }
                }]
        });
        subWin.show();
    },

    denyWorkPlanFc: function (rec) {
        var project_uid = rec.get('ac_uid');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=backPrdPlanToOrignPj',
            params: {
                project_uid : project_uid
            },
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },
});