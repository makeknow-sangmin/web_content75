//수주등록된 전체 제품 메뉴
Ext.define('Rfx2.view.gongbang.salesDelivery.HEAVY4_PrdProcessStateView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'receved-mgmt-view',
    currentTab: null,
    selected_rec: null,
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        gu.setDistinctFilters(this.link, ['pj_name', 'specification', 'pj_code']);

        this.setDefValue('regist_date', new Date());
        //삭제할때 사용할 필드 이름.
        this.setDeleteFieldName('unique_uid');

        var next7 = gu.getNextday(7);
        this.setDefValue('delivery_plan', next7);

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        this.setDefComboValue('pj_type', 'valueField', 'P');
        this.setDefComboValue('newmodcont', 'valueField', 'N');
        this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');

        this.defectCodeStore = Ext.create('Rfx2.store.company.bioprotech.DefectCodeStore', {parentCode: 'DEFECTIVE_CODE'});

        //검색툴바 필드 초기화
        this.initSearchField();


        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'isReady',
        //     items: [
        //         {
        //             boxLabel: gm.getMC('CMD_PRODUCTION_WAITING', '생산대기'),
        //             checked: true
        //         },
        //     ],
        // });

        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'isProcess',
        //     items: [
        //         {
        //             boxLabel: gm.getMC('CMD_PRODUCTION_ING', '생산중'),
        //             checked: true
        //         },
        //     ],
        // });

        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'isFinish',
        //     items: [
        //         {
        //             boxLabel: gm.getMC('CMD_GR_COMPLETE', '입고완료'),
        //             checked: false
        //         },
        //     ],
        // });

        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'isPrdFinish',
        //     items: [
        //         {
        //             boxLabel: this.getMC('CMD_LOT_DEADLINE', 'LOT마감'),
        //             checked: false
        //         },
        //     ],
        // });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'reserved_timestamp1',
            text: this.getMC('CMD_EXPECTED_DATE', "예정일"),
            labelWidth: 37,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -10),
            edate: Ext.Date.add(new Date(), Ext.Date.MONTH, +2)
        });

        // this.addSearchField({
        //     type: 'combo',
        //     width: 100
        //     , field_id: 'pcsmchn_assy_uid'
        //     , emptyText: this.getMC('CMD_PRODUCT_LINE', '생산라인')
        //     , store: "MachineProdStore"
        //     , displayField: 'name_ko'
        //     , valueField: 'unique_id_long'
        //     , value: 'unique_id_long'
        //     , innerTpl: '<div data-qtip="{unique_id_long}">{name_ko}</div>'
        // });
        //
        // this.addSearchField({
        //     type: 'combo',
        //     width: 100
        //     , field_id: 'product_group'
        //     , emptyText: this.getMC('CMD_PRODUCTS', gm.getMC('CMD_Product', '제품군'))
        //     , store: "CommonCodeStore"
        //     , params: { parentCode: 'PRD_GROUP' }
        //     , displayField: 'code_name_kr'
        //     , valueField: 'system_code'
        //     , value: 'code_name_kr'
        //     , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        // });

        // this.addSearchField('po_no');
        // this.addSearchField('order_number');
        // this.addSearchField('final_customer_name');
        // this.addSearchField('item_name');

        this.refreshActiveCrudPanel = function (source, selectOn, unique_id, record) {
            if (selectOn == true) {
                this.propertyPane.setSource(source); // Now load data
                this.selectedUid = unique_id;
                gu.enable(this.removeAction);
                gu.enable(this.editAction);
                gu.enable(this.copyAction);
                gu.enable(this.viewAction);

            } else {//not selected
                this.propertyPane.setSource(source);
                this.selectedUid = '-1';
                gu.disable(this.removeAction);
                gu.disable(this.editAction);
                gu.disable(this.copyAction);
                gu.disable(this.viewAction);
                gu.enable(this.registAction);
                this.crudTab.collapse();
            }

            this.setActiveCrudPanel(this.crudMode);
        };

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.ProduceWork',
            pageSize: 100,
            sorters: [{
                property: 'cartmap.unique_id',
                direction: 'DESC'
            }],
            byReplacer: {
                'state_name': 'rtgast.state',
            }
        }, {});

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'COPY'
            ]
        });


        this.inAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_GR_PROCESS', '입고처리'),
            tooltip: this.getMC('CMD_GR_PROCESS', '입고처리'),
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('inAction'),
            handler: function () {
                var remainQty = 0.0; // 입력시 바뀔 변수
                var selections = currentTab.getSelectionModel().getSelection();
                if (selections.length === 0) {
                    Ext.Msg.alert('', '입고할 수주 건을 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }
                var selection = selections[0];
                if (vCompanyReserved4 === 'DMEC01KR') {
                    var ngr_quan = selection.get('third_proc_qty_sum') - selection.get('gr_quan');
                } else {
                    var ngr_quan = selection.get('package_qty_sum') - selection.get('gr_quan');
                }

                if (ngr_quan > 0) {
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
                                title: '입고일자와 입고수량을 정확히 입력하시기 바랍니다.',
                                items: [
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('goods_in_date'),
                                        anchor: '97%',
                                        name: 'goods_in_date',
                                        value: new Date(),
                                        format: 'Y-m-d',
                                        fieldLabel: '입고날짜'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('gr_quan'),
                                        anchor: '97%',
                                        name: 'gr_quan',
                                        value: ngr_quan,
                                        fieldLabel: '입고수량',
                                        listeners: {
                                            change: function () {

                                            }
                                        }
                                    },
                                ]
                            }
                        ],

                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '입고처리',
                        width: 500,
                        height: 200,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {
                                    //첫번째만 갖고 와야 한다.
                                    var selection = selected_rec[0];
                                    var big_pcs_code = currentTab.multi_grid_id;
                                    console_logs('gu.mesTplProcessBig[0].code >>', gu.mesTplProcessBig[0].code);
                                    var maxPcsCode = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code][gu.mesTplProcessAll[gu.mesTplProcessBig[0].code].length - 1];
                                    console_logs('gu.mesTplProcessAll[gu.mesTplProcessBig[0].code].length - 1 >>', gu.mesTplProcessAll[gu.mesTplProcessBig[0].code].length - 1);
                                    var processCode = 'process_';
                                    //var maxPcsCode = gu.mesTplProcessAll[big_pcs_code][gu.mesTplProcessAll[big_pcs_code].length - 1];
                                    var outpcsQty = selection.get(/*maxPcsCode.code*/
                                        processCode + (gu.mesTplProcessAll[gu.mesTplProcessBig[0].code].length - 1) + '|outpcs_qty');
                                    if (outpcsQty === undefined) {
                                        outpcsQty = 0;
                                    }
                                    var gr_quan = selection.get('gr_quan');
                                    var pr_quan = selection.get('pr_quan');
                                    var ngr_quan = selection.get('ngr_quan');
                                    var cur_gr_quan = gu.getCmp('gr_quan').getValue();
                                    var goods_in_date = gu.getCmp('goods_in_date').getValue();
                                    var cartmap_uid = selection.get('unique_id_long');
                                    console_logs('>>> outpcsQty', outpcsQty);
                                    console_logs('>>> ngr_quan', ngr_quan);
                                    console_logs('>>> gr_quan', gr_quan);
                                    console_logs('>>> cur_gr_quan', gr_quan);
                                    console_logs('>>> cur_gr_quan + gr_quan', cur_gr_quan + gr_quan);
                                    if (cur_gr_quan + gr_quan > Number(outpcsQty)) {
                                        Ext.Msg.alert('', '입력 수량이 마지막 공정 완료 수량보다 많습니다.');
                                    } else {
                                        prWin.setLoading(true);
                                        var ngr_quan_present = 0.0;
                                        var ngr_quan_present = selection.get('package_qty_sum') - selection.get('gr_quan');
                                        if (cur_gr_quan > ngr_quan_present) {
                                            Ext.MessageBox.alert('알림', '현 실적보다 큰 수의 입고처리는 불가합니다.')
                                        } else {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
                                                params: {
                                                    'cartmap_uid': cartmap_uid,
                                                    'gr_quan': cur_gr_quan,
                                                    'goods_in_date': goods_in_date
                                                },
                                                success: function (val, action) {
                                                    if (prWin) {
                                                        prWin.setLoading(false);
                                                        prWin.close();
                                                    }
                                                    gm.me().getStore().load();
                                                },
                                                failure: function (val, action) {
                                                    if (prWin) {
                                                        prWin.setLoading(false);
                                                        prWin.close();
                                                    }
                                                }
                                            });
                                        }
                                    }
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
            }
        });

        this.doProductionAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_INPUT_PERFORMANCE', '실적입력'),
            tooltip: '각 공정의 수량을 최신화 합니다.',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('doProductionAction'),
            handler: function () {

                var defaultQty = 0;

                var selections = currentTab.getSelectionModel().getSelection();

                var big_pcs_code = currentTab.multi_grid_id;

                // var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];
                var processCode = 'process_';

                if (selections.length === 0) {
                    Ext.Msg.alert('', '수주를 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }

                var selection = selections[0];

                var ngr_quan = selection.get('ngr_quan');

                var radioValues = [];

                for (var i = 0; i < pcs_codes.length; i++) {

                    var radioValue = {
                        boxLabel: pcs_codes[i].name,
                        name: 'pcs_radio',
                        inputValue: selection.get(/*pcs_codes[i].code*/processCode + i + '|step_uid'),
                        checked: i == 0 ? true : false
                    };

                    radioValues.push(radioValue);
                }

                var reference_date = '';
                var today = new Date();
                var hours = today.getHours();
                if (hours < 10) {
                    console_logs('>>> 상태', '어제날짜');
                    reference_date = new Date(today.setDate(today.getDate() - 1));
                } else {
                    console_logs('>>> 상태', '오늘날짜');
                    reference_date = today;
                }

                if (ngr_quan > 0) {
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
                                layout: 'column',
                                title: '공정과 진행수량을 정확히 입력하시기 바랍니다.',
                                defaults: {
                                    margin: '3 3 3 3'
                                },
                                items: [
                                    {
                                        xtype: 'radiogroup',
                                        id: gu.id('pcsCodeGroup'),
                                        fieldLabel: '공정',
                                        items: radioValues,
                                        defaults: {
                                            margin: '0 30 0 0'
                                        },
                                        listeners: {
                                            change: function (field, newValue, oldValue) {

                                                for (var i = 0; i < pcs_codes.length; i++) {

                                                    var stepUid = selection.get(/*pcs_codes[i].code*/processCode + i + '|step_uid');

                                                    if (stepUid === newValue.pcs_radio) {

                                                        var processQty = selection.get(/*pcs_codes[i].code*/processCode + i + '|process_qty');
                                                        var outpcsQty = selection.get(/*pcs_codes[i].code */processCode + i + '|outpcs_qty');
                                                        defaultQty = processQty - outpcsQty < 0 ? 0 : processQty - outpcsQty;

                                                        gu.getCmp('complete_qty').setValue(defaultQty);
                                                    }
                                                }

                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('ref_date'),
                                        width: '96%',
                                        readOnly: false,
                                        name: 'ref_date',
                                        // value: Ext.Date.add(new Date(), 'Y-m-d'),
                                        value: reference_date,
                                        submitFormat: 'Y-m-d',
                                        dateFormat: 'Y-m-d',
                                        format: 'Y-m-d',
                                        // fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        fieldLabel: '실적기준일자'
                                    },
                                    {
                                        xtype: 'radiogroup',
                                        id: gu.id('work_type'),
                                        fieldLabel: '조구분',
                                        items: [
                                            {
                                                boxLabel: '주간',
                                                name: 'work_type',
                                                inputValue: 'day',
                                                checked: true
                                            },
                                            {
                                                boxLabel: '야간',
                                                name: 'work_type',
                                                inputValue: 'night'
                                            }
                                        ],
                                        defaults: {
                                            margin: '0 30 0 0'
                                        },
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                // gm.me().setRefDate();
                                            }
                                        }
                                    },
                                    // {
                                    //     xtype: 'datefield',
                                    //     id: gu.id('process_date'),
                                    //     width: '65%',
                                    //     name: 'process_date',
                                    //     value: Ext.Date.add(new Date(), 'Y-m-d'),
                                    //     dateFormat: 'Y-m-d',
                                    //     submitFormat: 'Y-m-d',
                                    //     format: 'Y-m-d',
                                    //     fieldLabel: '입력시간',
                                    //     listeners: {
                                    //         change: function (field, newValue, oldValue) {
                                    //             // gm.me().setRefDate();
                                    //         }
                                    //     }
                                    // }, 
                                    // {
                                    //     xtype: 'timefield',
                                    //     name: 'process_time',
                                    //     id: gu.id('process_time'),
                                    //     width: '29.6%',
                                    //     minValue: '0:00',
                                    //     maxValue: '23:30',
                                    //     format: 'H:i',
                                    //     dateFormat: 'H:i',
                                    //     submitFormat: 'H:i',
                                    //     value: gm.me().getThirtyMinites(new Date()),
                                    //     increment: 30,
                                    //     anchor: '50%',
                                    //     listeners: {
                                    //         change: function (field, newValue, oldValue) {
                                    //             gm.me().setRefDate();
                                    //         }
                                    //     }
                                    // },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('complete_qty'),
                                        width: '96%',
                                        name: 'complete_qty',
                                        value: 0,
                                        fieldLabel: '진행수량'
                                    },
                                    {
                                        xtype: 'checkboxfield',
                                        name: 'do_complete',
                                        id: gu.id('do_complete'),
                                        boxLabel: '이 공정을 완료 처리 합니다.',
                                        hidden: true,
                                        checked: false
                                    }
                                ]
                            }
                        ]
                    });

                    // 기본수량 설정
                    var processQty = selection.get(/*pcs_codes[0].code*/processCode + '0' + '|process_qty');
                    var outpcsQty = selection.get(/*pcs_codes[0].code*/processCode + '0' + '|outpcs_qty');
                    defaultQty = processQty - outpcsQty < 0 ? 0 : processQty - outpcsQty;

                    gu.getCmp('complete_qty').setValue(defaultQty);

                    var prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: gm.me().getMC('CMD_INPUT_PERFORMANCE', '실적입력'),
                        width: 450,
                        height: 300,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {

                                    var selection = currentTab.getSelectionModel().getSelection()[0];

                                    var do_complete = gu.getCmp('do_complete').getValue();
                                    var complete_qty = gu.getCmp('complete_qty').getValue();
                                    var pcsCodeGroup = gu.getCmp('pcsCodeGroup').getValue();

                                    var ref_date = gu.getCmp('ref_date').getValue();
                                    // var process_date = gu.getCmp('process_date').getValue();
                                    // var process_time = gu.getCmp('process_time').getValue();

                                    var work_type = gu.getCmp('work_type').getValue();

                                    var cartmap_uid = selection.get('unique_id_long');

                                    var isExceedQty = complete_qty > defaultQty;
                                    var isEqualQty = defaultQty == complete_qty;

                                    var big_pcs_code = currentTab.multi_grid_id;

                                    //var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                                    var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                                    var isExceedPreStep = false;

                                    for (var i = 0; i < pcs_codes.length; i++) {

                                        var stepUid = selection.get(/*pcs_codes[i].code*/processCode + i + '|step_uid');

                                        if (Number(stepUid) === pcsCodeGroup.pcs_radio - 1) {

                                            var outpcsQty = selection.get(/*pcs_codes[i].code*/processCode + i + '|outpcs_qty');

                                            if (complete_qty > outpcsQty) {
                                                isExceedPreStep = true;
                                            }
                                        }
                                    }


                                    var msg = '수량 처리하시겠습니까?';

                                    if (do_complete) {
                                        if (isExceedQty) {
                                            msg = '생산 요청 수량 보다 많은 수량을 처리하려고 시도 중입니다.</br>' +
                                                '수량 처리와 동시에 공정을 완료 처리하시겠습니까?';
                                        } else if (!isExceedQty && isEqualQty) {
                                            msg = '수량 처리와 동시에 공정을 완료 처리하시겠습니까?';
                                        } else {
                                            msg = '생산 요청 수량 보다 처리 예정 수량이 적습니다</br>' +
                                                '수량 처리와 동시에 공정을 완료 처리하시겠습니까?';
                                        }
                                    } else {
                                        if (isExceedQty) {
                                            msg = '생산 요청 수량 보다 많은 수량을 처리하려고 시도 중입니다.</br>' +
                                                '계속 진행하시겠습니까?';
                                        } else {
                                            msg = '수량 처리하시겠습니까?';
                                        }
                                    }

                                    if (!isExceedPreStep) {
                                        Ext.MessageBox.show({
                                            title: '확인',
                                            msg: msg,
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function (result) {
                                                if (result == 'yes') {

                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/index/process.do?method=processAndCompleteQty',
                                                        params: {
                                                            'pcsstep_uid': pcsCodeGroup.pcs_radio,
                                                            'gr_quan': complete_qty,
                                                            'do_complete': do_complete,
                                                            'ref_date': ref_date,
                                                            'process_date': '',
                                                            'process_time': '',
                                                            'work_type': work_type
                                                        },

                                                        success: function (result, request) {
                                                            gm.me().store.load();
                                                            gm.me().pcsworkStore.load();
                                                            Ext.Msg.alert('안내', '해당 공정의 수량이 처리 되었습니다.', function () {
                                                            });
                                                            currentTab.getStore().load();
                                                            prWin.close();
                                                        },//endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });//endofajax

                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    } else {
                                        Ext.Msg.alert('', '전 공정 생산수량을 넘어선 수량으로 처리할 수 없습니다.');
                                    }
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
                } else {
                    Ext.Msg.alert('', '제품이 모두 출고되어 있습니다.');
                }
            }
        });

        this.defectRegiAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_INPUT_DEFECT_QUAN', '불량수량입력'),
            tooltip: '불량수량을 입력합니다.',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('defectRegiAction'),
            handler: function () {

                this.defectRegiGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().defectCodeStore,
                    cls: 'rfx-panel',
                    multiSelect: false,
                    autoScroll: true,
                    viewConfig: {
                        markDirty: false
                    },
                    height: 250,
                    border: true,
                    padding: '0 0 0 0',
                    width: 420,
                    layout: 'fit',
                    forceFit: true,
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2
                    },
                    columns: [{
                        text: '불량코드',
                        style: 'text-align:center',
                        flex: 1.0,
                        dataIndex: 'system_code'
                    }, {
                        text: '불량명',
                        style: 'text-align:center',
                        flex: 1.5,
                        dataIndex: 'code_name_kr'
                    }, {
                        text: '수량',
                        flex: 1,
                        dataIndex: 'defect_total_qty',
                        style: 'text-align:center',
                        align: 'right',
                        editor: {
                            xtype: 'numberfield'
                        },
                        renderer: function (value, context, tmeta) {
                            if (value == null) {
                                return 0;
                            }
                            return Ext.util.Format.number(value, '0,00/i');
                        }
                    }
                    ]
                });

                var defaultQty = 0;

                var selections = currentTab.getSelectionModel().getSelection();

                var big_pcs_code = currentTab.multi_grid_id;

                // var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];
                var processCode = 'process_';

                if (selections.length === 0) {
                    Ext.Msg.alert('', '수주를 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }

                var selection = selections[0];

                var radioValues = [];

                if(vCompanyReserved4 === 'DMEC01KR') {
                    for (var i = 0; i < pcs_codes.length - 1; i++) {
                        var radioValue = {
                            boxLabel: pcs_codes[i].name,
                            name: 'pcs_radio',
                            inputValue: selection.get(processCode + i + '|step_uid'),
                            checked: i == 0 ? true : false
                        };
                        radioValues.push(radioValue);
                    }
                } else {
                    for (var i = 0; i < pcs_codes.length; i++) {
                        var radioValue = {
                            boxLabel: pcs_codes[i].name,
                            name: 'pcs_radio',
                            inputValue: selection.get(processCode + i + '|step_uid'),
                            checked: i == 0 ? true : false
                        };
                        radioValues.push(radioValue);
                    }
                }


                var reference_date = '';
                var today = new Date();
                var hours = today.getHours();
                if (hours < 10) {
                    console_logs('>>> 상태', '어제날짜');
                    reference_date = new Date(today.setDate(today.getDate() - 1));
                } else {
                    console_logs('>>> 상태', '오늘날짜');
                    reference_date = today;
                }

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'form',
                    autoScroll: true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            layout: 'column',
                            flex: 0.5,
                            title: '불량수량을 정확히 입력하시기 바랍니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('pcsCodeGroup'),
                                    fieldLabel: '공정',
                                    items: radioValues,
                                    defaults: {
                                        margin: '0 30 0 0'
                                    },
                                    listeners: {
                                        change: function (field, newValue, oldValue) {

                                            // for (var i = 0; i < pcs_codes.length; i++) {
                                            //
                                            //     var stepUid = selection.get(processCode + i + '|step_uid');
                                            //
                                            //     if (stepUid === newValue.pcs_radio) {
                                            //
                                            //         var processQty = selection.get(processCode + i + '|process_qty');
                                            //         var outpcsQty = selection.get(processCode + i + '|outpcs_qty');
                                            //         defaultQty = processQty - outpcsQty < 0 ? 0 : processQty - outpcsQty;
                                            //
                                            //         gu.getCmp('complete_qty').setValue(defaultQty);
                                            //     }
                                            // }

                                        }
                                    }
                                },
                                // {
                                //     fieldLabel: '불량원인',
                                //     xtype: 'combo',
                                //     anchor: '100%',
                                //     id: gu.id('defect_detail'),
                                //     name: 'defect_detail',
                                //     displayField: 'code_name_kr',
                                //     valueField: 'system_code',
                                //     store: gm.me().defectCodeStore,
                                //     width: '96%',
                                //     listConfig: {
                                //         getInnerTpl: function () {
                                //             return '<div data-qtip="{system_code}"><small>[{system_code}] {code_name_kr}</small></div>';
                                //         }
                                //     }
                                // },
                                {
                                    xtype: 'datefield',
                                    id: gu.id('ref_date'),
                                    width: '96%',
                                    readOnly: false,
                                    name: 'ref_date',
                                    value: reference_date,
                                    // value: Ext.Date.add(new Date(), 'Y-m-d'),
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    // fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    fieldLabel: '기준일자'
                                },
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('work_type'),
                                    fieldLabel: '조구분',
                                    items: [
                                        {
                                            boxLabel: '주간',
                                            name: 'work_type',
                                            inputValue: 'day',
                                            checked: true
                                        },
                                        {
                                            boxLabel: '야간',
                                            name: 'work_type',
                                            inputValue: 'night'
                                        }
                                    ],
                                    defaults: {
                                        margin: '0 30 0 0'
                                    },
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            // gm.me().setRefDate();
                                        }
                                    }
                                },
                                /*,{
                                    xtype: 'datefield',
                                    id: gu.id('process_date'),
                                    width: '65%',
                                    name: 'process_date',
                                    value: Ext.Date.add(new Date(), 'Y-m-d'),
                                    dateFormat: 'Y-m-d',
                                    submitFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    fieldLabel: '입력시간',
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            gm.me().setRefDate();
                                        }
                                    }
                                }, 
                                {
                                    xtype: 'timefield',
                                    name: 'process_time',
                                    id: gu.id('process_time'),
                                    width: '29.6%',
                                    minValue: '0:00',
                                    maxValue: '23:30',
                                    format: 'H:i',
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    value: gm.me().getThirtyMinites(new Date()),
                                    increment: 30,
                                    anchor: '50%',
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            gm.me().setRefDate();
                                        }
                                    }
                                }
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('defect_total_qty'),
                                    width: '96%',
                                    name: 'defect_total_qty',
                                    value: 0,
                                    fieldLabel: '불량수량'
                                }*/
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'column',
                            title: gm.me().getMC('CMD_INPUT_DEFECT_QUAN', '불량수량입력'),
                            //height: 250,
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: [
                                this.defectRegiGrid
                            ]
                        }
                    ]
                });

                gm.me().defectCodeStore.load();

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('CMD_INPUT_DEFECT_QUAN', '불량수량입력'),
                    width: 450,
                    height: 550,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                var selection = currentTab.getSelectionModel().getSelection()[0];
                                //var defect_total_qty = gu.getCmp('defect_total_qty').getValue();
                                var pcsCodeGroup = gu.getCmp('pcsCodeGroup').getValue();
                                var ref_date = gu.getCmp('ref_date').getValue();
                                // var process_date = gu.getCmp('process_date').getValue();
                                // var process_time = gu.getCmp('process_time').getValue();
                                var work_type = gu.getCmp('work_type').getValue();
                                //var defect_detail = gu.getCmp('defect_detail').getValue();
                                var cartmap_uid = selection.get('unique_id_long');
                                var big_pcs_code = currentTab.multi_grid_id;
                                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                                var msg = '불량 수량을 처리하시겠습니까?';

                                var defect_total_qty_arr = [];
                                var defect_detail_arr = [];

                                for (var i = 0; i < gm.me().defectCodeStore.getCount(); i++) {
                                    var rec = gm.me().defectCodeStore.getAt(i);

                                    var defect_total_qty = rec.get('defect_total_qty');
                                    var defect_detail = rec.get('system_code');

                                    if (defect_total_qty > 0) {
                                        defect_total_qty_arr.push(defect_total_qty);
                                        defect_detail_arr.push(defect_detail);
                                    }
                                }

                                if (defect_total_qty_arr.length > 0) {
                                    Ext.MessageBox.show({
                                        title: '확인',
                                        msg: msg,
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {

                                                prWin.setLoading(true);

                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/index/process.do?method=defectQty',
                                                    params: {
                                                        'pcsstep_uid': pcsCodeGroup.pcs_radio,
                                                        'defect_total_qty_arr': defect_total_qty_arr,
                                                        'defect_detail_arr': defect_detail_arr,
                                                        'ref_date': ref_date,
                                                        'process_date': '',
                                                        'process_time': '',
                                                        'work_type': work_type
                                                    },

                                                    success: function (result, request) {
                                                        prWin.setLoading(false);
                                                        gm.me().store.load();
                                                        gm.me().pcsworkDefectStore.load();
                                                        Ext.Msg.alert('안내', '해당 공정의 불량수량이 처리 되었습니다.', function () {
                                                        });
                                                        currentTab.getStore().load();
                                                        prWin.close();
                                                    },//endofsuccess
                                                    failure: extjsUtil.failureMessage
                                                });//endofajax

                                            }
                                        },
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                } else {
                                    Ext.Msg.alert('', '최소 한 개의 불량유형의 개수가 1 이상이어야 합니다.');
                                }
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
        });

        // 바코드 출력 버튼
        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: this.getMC('CMD_INNERBOX_BARCODE', '이너박스바코드(생산)'),
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('barcodePrintAction'),
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.backToPrdPlan = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: this.getMC('CMD_CANCEL_ORDER', '지시취소'),
            tooltip: '생산대기 상태의 건을 작업지시 전 상태로 변경합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('backToPrdPlan'),
            handler: function () {
                var selection = selected_rec;
                var rec = selection[0];
                var state = rec.get('rtgast_od_state');
                if (state === 'P') {
                    Ext.MessageBox.show({
                        title: '',
                        msg: '선택 한 건을 작업지시 전 상태로 변경하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                var rtgast_uid = rec.get('rtgast_od_uid');
                                var cartmap_uid = rec.get('unique_id');
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=cancelProduction',
                                    params: {
                                        rtgast_uid: rtgast_uid,
                                        cartmap_uid: cartmap_uid
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('알림', '해당 건이 상태가 변경되었습니다.');
                                        currentTab.getStore().load();
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                });
                            }
                        }
                    });
                } else if (state === 'I') {
                    Ext.MessageBox.alert('알림', '해당건은 이미 반려 처리 되었습니다.');
                } else {
                    Ext.MessageBox.alert('알림', '생산대기 이후의 상태는 취소가 불가합니다.');
                }
                // gm.me().printBarcode();
            }
        });

        this.changePlan = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Edit_Plan', '계획변경'),
            tooltip: '생산대기, 생산중인 제품에 대하여 생산요청수량을 변경합니다.',
            disabled: true,
            handler: function () {
                var selection = selected_rec;
                var rec = selection[0];
                var state = rec.get('rtgast_od_state');
                console_logs('state >>>', state);
                var selections = currentTab.getSelectionModel().getSelection();
                if (selections.length === 0) {
                    Ext.Msg.alert('', '수주를 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }
                var selection = selections[0];
                console_logs('>>>> selection', selection);
                console_logs('process_0|comp_qty', selection.get('process_0|comp_qty'));

                var comp_qty = Number(selection.get('process_0|comp_qty').replace(/,/g, ""));

                var pr_quan = Number(selection.get('pr_quan'));


                console_logs('process_0|comp_qty_number', comp_qty);


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
                            title: '<font color=black>변경할 생산요청수량을 입력하시기 바랍니다.</font>',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('change_qty'),
                                    anchor: '97%',
                                    name: 'change_qty',
                                    fieldLabel: '생산요청수량',
                                    value: pr_quan
                                }
                            ]
                        }]

                });

                var winPart = Ext.create('ModalWindow', {
                    title: gm.getMC('CMD_Edit_Plan', '계획변경'),
                    width: 450,
                    height: 180,
                    items: form,
                    buttons: [{
                        text: '확인',
                        handler: function () {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                // console_logs('present_qty', Number(present_qty));
                                // console_logs('input_qty', Number(input_qty.replace(/,/g, "")));

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=modifyPlanQty',
                                    params: {
                                        change_qty : gu.getCmp('change_qty').getValue(),
                                        cartmap_uid : rec.get('unique_id_long'),
                                        pcsstep_uid : rec.get('PCS-A|step_uid'),
                                        od_uid : rec.get('rtgast_od_uid')
                                    },
                                    success: function (result, request) {
                                        var resultTxt = result.responseText;
                                        console_logs('result >>>', resultTxt);
                                        form.setLoading(false);
                                        winPart.close();
                                        Ext.MessageBox.alert('알림', '처리 완료되었습니다.');
                                        currentTab.getStore().load();
                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });
                            } else {
                                Ext.MessageBox.alert(rror_msg_prompt, error_msg_content)
                            }
                        }
                    }, {
                        text: '취소',
                        handler: function () {
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    }]
                });
                winPart.show();
            }
        });

        this.setExpAction = Ext.create('Ext.Action', {
            iconCls: 'af-calendar',
            text: gm.getMC('CMD_EXP_DATE_SET', '유효기간 설정'),
            tooltip: '유효기간 지정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('setExpAction'),
            handler: function () {
                var selections = currentTab.getSelectionModel().getSelection()[0];
                var rtgast_od_uid = selections.get('rtgast_od_uid');
                console_logs('>>>> rtgast_od_uid', rtgast_od_uid);
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
                            title: '유효기간을 지정합니다.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('exp_date'),
                                    anchor: '97%',
                                    name: 'exp_date',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    value: new Date(),
                                    fieldLabel: '유효기간'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '유효기간 설정',
                    width: 450,
                    height: 200,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '유효기간 설정',
                                    msg: '선택 한 건의 유효기간을 지정하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=setProduceExpDate',
                                                params: {
                                                    rtgast_uid: rtgast_od_uid,
                                                    exp_date: val['exp_date']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '유효기간이 지정되었습니다.');
                                                    currentTab.getStore().load();
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
        });

        this.completePrdAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_DECIDE_PROCESS', '완료/취소처리'),
            tooltip: '생산을 완료 혹은 완료취소 처리합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('completePrdAction'),
            handler: function () {
                var selection = selected_rec;
                var rec = selection[0];
                var state = rec.get('rtgast_od_state');

                if (state === 'Y' || state === 'O' || state === 'N') {
                    Ext.MessageBox.show({
                        title: '',
                        msg: '선택 한 건을 완료 혹은 완료 취소 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                var rtgast_uid = rec.get('rtgast_od_uid');
                                var cartmap_uid = rec.get('unique_id');
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=completeProduction',
                                    params: {
                                        rtgast_uid: rtgast_uid,
                                        cartmap_uid: cartmap_uid
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('알림', '상태가 변경 되었습니다.');
                                        currentTab.getStore().load();
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                });
                            }
                        }
                    });
                } else {
                    Ext.MessageBox.alert('알림', '완료 혹은 완료 취소 가능한 상태가 아닙니다.');
                }
                // gm.me().printBarcode();
            }
        });

        this.mesBarcodeCreate = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: 'MES바코드 강제 생산',
            // tooltip: '생산을 완료 혹은 완료취소 처리합니다',
            disabled: false,
            // hidden: gu.setCustomBtnHiddenProp('completePrdAction'),
            handler: function () {
                // var selection = selected_rec;
                // var rec = selection[0];
                // var state = rec.get('rtgast_od_state');

                // if (state === 'Y' || state === 'O' || state === 'N') {
                //     Ext.MessageBox.show({
                //         title: '',
                //         msg: '선택 한 건을 완료 혹은 완료 취소 하시겠습니까?',
                //         buttons: Ext.MessageBox.YESNO,
                //         icon: Ext.MessageBox.QUESTION,
                //         fn: function (btn) {
                //             if (btn == "no") {
                //                 return;
                //             } else {
                //                 var rtgast_uid = rec.get('rtgast_od_uid');
                //                 var cartmap_uid = rec.get('unique_id');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=mesBarcodeCreate',
                    // params: {
                    //     rtgast_uid: rtgast_uid,
                    //     cartmap_uid: cartmap_uid
                    // },
                    success: function (result, request) {
                        // Ext.MessageBox.alert('알림', '상태가 변경 되었습니다.');
                        // currentTab.getStore().load();
                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                });
                // }
                // }
                // });
                // } else {
                //     Ext.MessageBox.alert('알림', '완료 혹은 완료 취소 가능한 상태가 아닙니다.');
                // }
                // gm.me().printBarcode();
            }
        });

        this.prdGoStore = Ext.create('Rfx2.store.company.bioprotech.PrdGoStore', {});

        this.requestGoAction = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '불출요청',
            tooltip: '불출요청',
            disabled: true,
            handler: function () {

                this.goGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().prdGoStore,
                    id: gu.id('goGrid'),
                    cls: 'rfx-panel',
                    collapsible: false,
                    multiSelect: false,
                    autoScroll: true,
                    autoHeight: true,
                    selModel: 'checkboxmodel',
                    //bbar: getPageToolbar(this.storeTemplate),
                    frame: false,
                    border: false,
                    layout: 'fit',
                    forceFit: true,
                    height: '100%',
                    columns: [
                        {text: '품번', width: 100, dataIndex: 'item_code'},
                        {text: '품명', width: 150, dataIndex: 'item_name'},
                        {
                            text: '필요수량', width: 100, dataIndex: 'bm_quan',
                            renderer: function (value, meta) {
                                if (value != null && value > 0) {
                                    value = Ext.util.Format.number(value, '0,00/i');
                                } else {
                                    value = 0;
                                }
                                return value;
                            }
                        },
                        {
                            text: '불출가능수량', width: 100, dataIndex: 'available_qty',
                            renderer: function (value, meta) {
                                if (value != null && value > 0) {
                                    value = Ext.util.Format.number(value, '0,00/i');
                                } else {
                                    value = 0;
                                }
                                return value;
                            }
                        },
                        {
                            text: '불출한수량', width: 100, dataIndex: 'requested_qty',
                            renderer: function (value, meta) {
                                if (value != null && value > 0) {
                                    value = Ext.util.Format.number(value, '0,00/i');
                                } else {
                                    value = 0;
                                }
                                return value;
                            }
                        },
                    ],
                    autoScroll: true,
                    dockedItems: []
                });


                var rec = currentTab.getSelectionModel().getSelection()[0];

                var pj_uid = rec.get('ac_uid');
                var tr_uid = rec.get('unique_id_long');
                var parent = rec.get('child');
                var pr_uid = rec.get('pr_uid');
                var pj_name = rec.get('pj_name');

                gm.me().prdGoStore.getProxy().setExtraParam('pj_uid', pj_uid);
                gm.me().prdGoStore.getProxy().setExtraParam('tr_uid', tr_uid);
                gm.me().prdGoStore.getProxy().setExtraParam('parent', parent);
                gm.me().prdGoStore.getProxy().setExtraParam('pr_uid', pr_uid);

                gm.me().prdGoStore.load();

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '불출요청',
                    width: 800,
                    height: 500,
                    items: this.goGrid,
                    buttons: [
                        {
                            text: '불출요청',
                            scope: this,
                            handler: function () {

                                var selections = gm.me().goGrid.getSelectionModel().getSelection();

                                if (selections.length > 0) {
                                    Ext.MessageBox.show({
                                        title: '확인',
                                        msg: '불출 요청하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {

                                                var po_user_uid = vCUR_USER_UID;
                                                var srcahdArr = [];
                                                var cartmapArr = [];
                                                var nameArr = [];
                                                var priceArr = [];
                                                var curArr = [];
                                                var quanArr = [];
                                                var coordArr = [];

                                                var ac_uid = pj_uid;
                                                for (var i = 0; i < selections.length; i++) {
                                                    var rec = selections[i];
                                                    var cartmap_uid = rec.get('cartmap_uid');
                                                    var srcahd_uid = rec.get('srcahd_uid');
                                                    var coord_key3 = rec.get('coord_key3');
                                                    var currency = rec.get('currency');
                                                    var item_name = rec.get('item_name');
                                                    var static_sales_price = rec.get('sales_price');

                                                    //불출수량의 수량 = reserved_double1
                                                    var quan = rec.get('bm_quan');

                                                    quanArr.push(quan);
                                                    cartmapArr.push(cartmap_uid);
                                                    srcahdArr.push(srcahd_uid);
                                                    curArr.push(currency);
                                                    priceArr.push(static_sales_price);
                                                    nameArr.push(item_name);
                                                    coordArr.push(coord_key3);

                                                }

                                                if (form.isValid()) {
                                                    var val = form.getValues(false);

                                                    console_logs('val', val);

                                                    prWin.setLoading(true);

                                                    form.submit({
                                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGoAtPo',
                                                        params: {
                                                            sancType: 'YES',
                                                            item_name: item_name,
                                                            cartmaparr: cartmapArr,
                                                            srcahdarr: srcahdArr,
                                                            quans: quanArr,
                                                            currencies: curArr,
                                                            names: nameArr,
                                                            coord_key3s: coordArr,
                                                            sales_prices: priceArr,
                                                            pj_name: pj_name,
                                                            mp_status: 'GR',
                                                            ac_uid: ac_uid
                                                        },
                                                        success: function (val, action) {
                                                            prWin.close();
                                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function () {
                                                            });
                                                            gm.me().goCartListStore.load();
                                                            prWin.setLoading(false);
                                                        },
                                                        failure: function (val, action) {

                                                            prWin.close();

                                                        }
                                                    })
                                                } // end of formvalid
                                            }
                                        },
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                } else {
                                    Ext.Msg.alert('', '최소 한 개의 자재를 선택하시기 바랍니다.');
                                }
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
        });

        //그리드 생성
        var arr = [];

        var searchToolbar = this.createSearchToolbar();

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        console_logs('arr', arr);

        this.setRowClass(function (record, index) {

            var c = record.get('rtgast_od_state');

            switch (c) {
                case 'O':
                    return 'green-row';
                    break;
                case 'Y':
                    return 'orange-row';
                    break;
                default:
                    break;
            }
        });

        //grid 생성.
        for (var i = 0; i < this.columns.length; i++) {

            var o = this.columns[i];
            var dataIndex = o['dataIndex'];

            switch (dataIndex) {
                case 'mass':
                case 'reserved_double1':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.000/i');
                        value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">' + value + '(KG)</font></div>'
                        return value;
                    };
                    break;
                case 'quan':
                case 'bm_quan':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">' + value + '</font></div>'
                        return value;
                    };
                    break;
                default:
            }
        }//endoffor

        var processList = null;

        if (gu.checkUsePcstpl()) {
            processList = gu.mesTplProcessBig;
            console_logs('processList', processList);
        } else {
            processList = [];
            var pcs_length = gu.mesStdProcess.length;

            for (var i = 0; i < gu.mesStdProcess.length; i++) {
                var o = gu.mesStdProcess[i];
                console_logs('processList', o);
                if (o['parent'] == o['code']) {
                    var o1 = {
                        pcsTemplate: o['code'],
                        code: o['code'],
                        process_price: 0,
                        name: o['name']
                    };
                    console_logs('o1', o1);
                    processList.push(o1);
                }
            }
        }

        this.tab_info = [];
        var start = 0;

        this.divisionCodes = [];

        var rDatas = null;

        Ext.Ajax.request({
            async: false,
            url: CONTEXT_PATH + '/admin/comcst.do?method=read',
            params: {},
            success: function (result, request) {
                var result = result.responseText;
                var jsonData = Ext.JSON.decode(result);
                rDatas = jsonData.datas;
            },//endofsuccess
        });//endofajax

        var hqList = [];
        var hqListName = [];
        for (var i = 0; i < rDatas.length; i++) {
            //for (var i = 0; i < rDatas.length; i++) {
            hqList.push(rDatas[i].division_code);
            hqListName.push(rDatas[i].division_name);
        }

        var process_length = hqList.length;

        console_logs('>>>> hqList ', hqList);

        // for (var i = start; i < process_length; i++) {
        //     var o = processList[i];
        //     var code = o['code'];
        //     var name = o['name'];
        //     var title = name;
        //     var a = this.createPcsToobars(code);
        //     console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
        //     this.tab_info.push({
        //         code: code,
        //         name: name,
        //         title: title,
        //         toolbars: [a]
        //     });
        // }

        for (var i = start; i < process_length; i++) {
            var code = hqList[i];
            var name = hqListName[i];
            var title = name;
            // var a = this.createPcsToobars(/*processList[0].code*/hqList[i]);
            // console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
            this.tab_info.push({
                code: code,
                name: name,
                title: title/*,
                toolbars: [a]*/
            });
        }

        var ti = this.tab_info;

        for (var i = 0; i < ti.length; i++) {
            console_logs('vCompanyReserved4>>>>>>>>>>>>>>>>>>>>>>>', vCompanyReserved4);

            var tab = ti[i];
            var tab_code = tab['code'];
            var temp_code = '';
            console_logs('this.tab', tab);
            console_logs('this.columns_map', this.columns_map);
            var myColumn = this.columns_map[tab_code];
            var myField = this.fields_map[tab_code];
            var pos = tab_code == 'STL' ? 9 : 8;
            //this.addExtraColumnBypcscode(myColumn, myField, processList[0].code, temp_code, 'end_date', true, pos);
        }

        this.createGrid();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.backToPrdPlan);
        buttonToolbar.insert(2, this.doProductionAction);
        buttonToolbar.insert(3, this.defectRegiAction);
        buttonToolbar.insert(4, this.inAction);
        // buttonToolbar.insert(5, this.completePrdAction);
        // buttonToolbar.insert(6, this.changePlan);

        this.pcsworkStore = Ext.create('Rfx2.store.company.bioprotech.PcsWorkStore', {});
        this.pcsworkDefectStore = Ext.create('Rfx2.store.company.bioprotech.PcsWorkStore', {});

        this.modifyProductionAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_PERFORMANCE_REVISE', '실적수정'),
            tooltip: '해당 작업의 실적을 수정합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyProductionAction'),
            handler: function () {

                var rec = gm.me().workListGrid.getSelectionModel().getSelection()[0];
                console_logs('>>>> rec', rec);
                var pcs_name = rec.get('pcs_name');
                var process_code = rec.get('pcs_code');
                var work_type = rec.get('work_type');
                var work_qty = rec.get('work_qty');
                var pcswork_uid = rec.get('unique_id_long');
                var change_date = rec.get('change_date');
                var start_date = rec.get('start_date');


                var selections = currentTab.getSelectionModel().getSelection();
                var big_pcs_code = currentTab.multi_grid_id;
                //var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                var processCode = 'process_';

                var selection = selections[0];

                var radioValues = [];

                for (var i = 0; i < pcs_codes.length; i++) {

                    var radioValue = {
                        boxLabel: pcs_codes[i].name,
                        name: 'pcs_radio',
                        readOnly: true,
                        inputValue: selection.get(/*pcs_codes[i].code*/ processCode + i + '|step_uid'),
                        checked: pcs_codes[i].name == pcs_name ? true : false
                    };

                    radioValues.push(radioValue);
                }

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
                            layout: 'column',
                            title: '기준 날짜와 작업 입력 시간을 수정합니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: [
                                {
                                    xtype: 'hiddenfield',
                                    id: gu.id('pcswork_uid'),
                                    value: pcswork_uid
                                },
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('pcsCodeGroup'),
                                    fieldLabel: '공정',
                                    items: radioValues,
                                    defaults: {
                                        margin: '0 30 0 0'
                                    },
                                    listeners: {
                                        change: function (field, newValue, oldValue) {

                                            // for (var i = 0; i < pcs_codes.length; i++) {
                                            //
                                            //     var stepUid = selection.get(/*pcs_codes[i].code*/ processCode + i + '|step_uid');
                                            //
                                            //     if (Number(stepUid) === newValue.pcs_radio) {
                                            //
                                            //         var processQty = selection.get(/*pcs_codes[i].code*/ processCode + i + '|process_qty');
                                            //         var outpcsQty = selection.get(/*pcs_codes[i].code*/ processCode + i + '|outpcs_qty');
                                            //         defaultQty = processQty - outpcsQty < 0 ? 0 : processQty - outpcsQty;
                                            //
                                            //         gu.getCmp('complete_qty').setValue(defaultQty);
                                            //     }
                                            // }

                                        }
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    id: gu.id('ref_date'),
                                    width: '96%',
                                    readOnly: false,
                                    name: 'ref_date',
                                    value: Ext.Date.add(new Date(start_date), 'Y-m-d'),
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    // fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    fieldLabel: '실적기준일자'
                                },
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('work_type'),
                                    fieldLabel: '조구분',
                                    items: [
                                        {
                                            boxLabel: '주간',
                                            name: 'work_type',
                                            readOnly: false,
                                            inputValue: 'day',
                                            checked: work_type == 'day' ? true : false
                                        },
                                        {
                                            boxLabel: '야간',
                                            name: 'work_type',
                                            readOnly: false,
                                            inputValue: 'night',
                                            checked: work_type == 'night' ? true : false
                                        }
                                    ],
                                    defaults: {
                                        margin: '0 30 0 0'
                                    },
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            // gm.me().setRefDate();
                                        }
                                    }
                                },
                                // {
                                //     xtype: 'datefield',
                                //     id: gu.id('process_date'),
                                //     width: '65%',
                                //     name: 'process_date',
                                //     value: Ext.Date.add(new Date(change_date), 'Y-m-d'),
                                //     dateFormat: 'Y-m-d',
                                //     submitFormat: 'Y-m-d',
                                //     format: 'Y-m-d',
                                //     fieldLabel: '입력시간',
                                //     listeners: {
                                //         change: function (field, newValue, oldValue) {
                                //             gm.me().setRefDate();
                                //         }
                                //     }
                                // }, 
                                // {
                                //     xtype: 'timefield',
                                //     name: 'process_time',
                                //     id: gu.id('process_time'),
                                //     width: '29.6%',
                                //     minValue: '0:00',
                                //     maxValue: '23:30',
                                //     format: 'H:i',
                                //     dateFormat: 'H:i',
                                //     submitFormat: 'H:i',
                                //     value: gm.me().getThirtyMinites(new Date(change_date)),
                                //     increment: 30,
                                //     anchor: '50%',
                                //     listeners: {
                                //         change: function (field, newValue, oldValue) {
                                //             gm.me().setRefDate();
                                //         }
                                //     }
                                // },
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('complete_qty'),
                                    width: '96%',
                                    name: 'complete_qty',
                                    value: work_qty,
                                    //readOnly: true,
                                    //fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    fieldLabel: '진행수량'
                                },
                                {
                                    xtype: 'hiddenfield',
                                    id: gu.id('previous_qty'),
                                    name: 'previous_qty',
                                    value: work_qty
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('CMD_EDIT_PERFORMANCE', '실적수정'),
                    width: 450,
                    height: 300,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.MessageBox.show({
                                    title: '확인',
                                    msg: '실적을 수정하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function (result) {
                                        if (result == 'yes') {

                                            var ref_date = gu.getCmp('ref_date').getValue();
                                            // var process_date = gu.getCmp('process_date').getValue();
                                            // var process_time = gu.getCmp('process_time').getValue();
                                            var pcswork_uid = gu.getCmp('pcswork_uid').getValue();
                                            var complete_qty = gu.getCmp('complete_qty').getValue();
                                            var previous_qty = gu.getCmp('previous_qty').getValue();
                                            var work_type = gu.getCmp('work_type').getValue();
                                            console_logs('>>>> process_code', process_code);
                                            if (process_code.includes('PKG')) {
                                                // 포장수량을 수정할 경우 포장수량 전체와 생산수량의 전체를 확인한다.
                                                // 단, 재포장 공정은 생략한다.
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/index/process.do?method=determinePrevProcessQty',
                                                    params: {
                                                        'gr_quan': complete_qty,
                                                        'previous_qty': previous_qty,
                                                        'cartmap_uid': selection.get('unique_id_long')
                                                    },
                                                    success: function (result, request) {
                                                        var result_test = result.responseText;
                                                        if (result_test === 'true') {
                                                            // 여기서 수정
                                                            Ext.Ajax.request({
                                                                url: CONTEXT_PATH + '/index/process.do?method=updateProcessWorkPc',
                                                                params: {
                                                                    //'pcsstep_uid': pcsCodeGroup.pcs_radio,
                                                                    'gr_quan': complete_qty,
                                                                    'previous_qty': previous_qty,
                                                                    //'do_complete': do_complete,
                                                                    'ref_date': ref_date,
                                                                    'process_date': '',
                                                                    'process_time': '',
                                                                    'work_type': work_type,
                                                                    'pcswork_uid': pcswork_uid
                                                                },

                                                                success: function (result, request) {
                                                                    gm.me().store.load();
                                                                    gm.me().pcsworkStore.load();
                                                                    Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
                                                                    });
                                                                    currentTab.getStore().load();
                                                                    prWin.close();
                                                                },//endofsuccess
                                                                failure: extjsUtil.failureMessage
                                                            });//endofajax

                                                        } else {
                                                            Ext.MessageBox.alert('알림', '포장수량은 생산수량을 초과할 수 없습니다.<br>다시 확인해주세요.');
                                                            return;
                                                        }
                                                    },//endofsuccess
                                                    failure: extjsUtil.failureMessage
                                                });//endofajax
                                            } else {
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/index/process.do?method=updateProcessWorkPc',
                                                    params: {
                                                        //'pcsstep_uid': pcsCodeGroup.pcs_radio,
                                                        'gr_quan': complete_qty,
                                                        'previous_qty': previous_qty,
                                                        //'do_complete': do_complete,
                                                        'ref_date': ref_date,
                                                        'process_date': '',
                                                        'process_time': '',
                                                        'work_type': work_type,
                                                        'pcswork_uid': pcswork_uid
                                                    },

                                                    success: function (result, request) {
                                                        gm.me().store.load();
                                                        gm.me().pcsworkStore.load();
                                                        Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
                                                        });
                                                        currentTab.getStore().load();
                                                        prWin.close();
                                                    },//endofsuccess
                                                    failure: extjsUtil.failureMessage
                                                });//endofajax
                                            }

                                            gm.me().pcsworkStore.load();
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
        });

        this.removeProductionAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: this.getMC('CMD_PERFORMANCE_DELETE', '실적삭제'),
            tooltip: '해당 작업의 실적을 삭제합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeProductionAction'),
            handler: function () {
                var rec = gm.me().workListGrid.getSelectionModel().getSelection()[0];
                console_logs('rec >>>>', rec);
                var pcswork_uid = rec.get('unique_id_long');
                var pcsstep_uid = rec.get('pcsstep_uid');
                var selections = currentTab.getSelectionModel().getSelection()[0];
                console_logs('selections', selections);
                var state = selections.get('rtgast_od_state');
                if (state === 'Y') {
                    Ext.MessageBox.alert('알림', '생산완료된 실적은 삭제가 불가합니다.')
                    return;
                } else {
                    Ext.MessageBox.show({
                        title: '확인',
                        msg: '실적을 삭제하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=removeProdPerform',
                                    params: {
                                        pcswork_uid: pcswork_uid,
                                        pcsstep_uid: pcsstep_uid,
                                        rtgast_od_uid: selections.get('rtgast_od_uid')
                                    },
                                    success: function (result, request) {
                                        gm.me().store.load();
                                        gm.me().pcsworkStore.load();
                                        Ext.Msg.alert('안내', '삭제 되었습니다.', function () {
                                        });
                                        currentTab.getStore().load();
                                        gm.me().removeProductionAction.enable();
                                    },
                                    failure: extjsUtil.failureMessage
                                });
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                }

                // prWin.show();
            }
        });

        this.workListGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('workListGrid'),
            store: this.pcsworkStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.modifyProductionAction,
                        this.removeProductionAction
                    ]
                }
            ],
            columns: [
                {
                    text: this.getMC('CMD_WORK_DATE', '생산일자'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'start_date',
                    sortable: true,
                    renderer: function (value, meta, record) {

                        if (value !== null && value.length > 10) {
                            return value.substring(0, 10);
                        } else {
                            return null;
                        }

                    }
                },
                {
                    text: this.getMC('CMD_WORK_TYPE', '작업반'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'work_type',
                    sortable: true,
                    renderer: function (value, meta, record) {
                        switch (value) {
                            case 'day':
                                return '주간';
                            default:
                                return '야간';
                        }
                    }
                },
                {
                    text: this.getMC('CMD_PROCESS_NAME', '공정명'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'pcs_name',
                    sortable: true
                },
                {
                    text: this.getMC('CMD_PERFORMANCE_QUAN', '생산수량'),
                    width: 90,
                    xtype: 'numbercolumn',
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'work_qty',
                    sortable: true,
                    renderer: function (value, meta, record) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: this.getMC('ppo2_user_name', '입력자'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'user_name',
                    sortable: true
                },
                {
                    text: this.getMC('crt4_create_date', '입력시간'),
                    width: 130,
                    style: 'text-align:center',
                    dataIndex: 'change_date',
                    sortable: true,
                    renderer: function (value, meta, record) {
                        if (value !== null && value.length > 16) {
                            return value.substring(0, 16);
                        } else {
                            return null;
                        }
                    }
                },

            ],
            title: this.getMC('CMD_PERFORMANCE_HISTORY', '생산 실적 히스토리'),
            autoScroll: true,
            listeners: {}
        });

        this.modifyDefectAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_DEFECT_QUAN_REVISE', '불량수량수정'),
            tooltip: '해당 작업의 불량수량을 수정합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyDefectAction'),
            handler: function () {

                var rec = gm.me().defectListGrid.getSelectionModel().getSelection()[0];
                console_logs('>>>>>>> rec', rec);

                var pcs_name = rec.get('pcs_name');
                var work_type = rec.get('work_type');
                var work_qty = rec.get('work_qty');
                var pcswork_uid = rec.get('unique_id_long');
                var change_date = rec.get('change_date');
                var start_date = rec.get('start_date');
                var start_date_str = rec.get('start_date_str');
                var defect_detail = rec.get('defect_detail');
                var defect_total_qty = rec.get('defect_total_qty');


                var selections = currentTab.getSelectionModel().getSelection();
                var big_pcs_code = currentTab.multi_grid_id;
                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                var processCode = 'process_';

                var selection = selections[0];

                var radioValues = [];

                for (var i = 0; i < pcs_codes.length; i++) {

                    var radioValue = {
                        boxLabel: pcs_codes[i].name,
                        name: 'pcs_radio',
                        readOnly: true,
                        inputValue: selection.get(/*pcs_codes[i].code*/ processCode + i + '|step_uid'),
                        checked: pcs_codes[i].name == pcs_name ? true : false
                    };

                    radioValues.push(radioValue);
                }

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
                            layout: 'column',
                            title: '불량수량을 정확히 입력하시기 바랍니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('pcsCodeGroup'),
                                    fieldLabel: '공정',
                                    items: radioValues,
                                    defaults: {
                                        margin: '0 30 0 0'
                                    },
                                    listeners: {
                                        change: function (field, newValue, oldValue) {

                                        }
                                    }
                                },
                                {
                                    fieldLabel: '불량유형',
                                    xtype: 'combo',
                                    anchor: '100%',
                                    id: gu.id('defect_detail'),
                                    name: 'defect_detail',
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    store: gm.me().defectCodeStore,
                                    value: defect_detail,
                                    width: '96%',
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{system_code}"><small>[{system_code}] {code_name_kr}</small></div>';
                                        }
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    id: gu.id('ref_date'),
                                    width: '96%',
                                    readOnly: false,
                                    name: 'ref_date',
                                    value: start_date_str,
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    // fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    fieldLabel: '기준일자'
                                },
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('work_type'),
                                    fieldLabel: '조구분',
                                    items: [
                                        {
                                            boxLabel: '주간',
                                            name: 'work_type',
                                            inputValue: 'day',
                                            checked: work_type == 'day' ? true : false
                                        },
                                        {
                                            boxLabel: '야간',
                                            name: 'work_type',
                                            inputValue: 'night',
                                            checked: work_type == 'night' ? true : false
                                        }
                                    ],
                                    defaults: {
                                        margin: '0 30 0 0'
                                    },
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            // gm.me().setRefDate();
                                        }
                                    }
                                },
                                /**{
                                    xtype: 'datefield',
                                    id: gu.id('process_date'),
                                    width: '65%',
                                    name: 'process_date',
                                    value: Ext.Date.add(new Date(change_date), 'Y-m-d'),
                                    dateFormat: 'Y-m-d',
                                    submitFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    fieldLabel: '입력시간',
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            // gm.me().setRefDateDefect();
                                        }
                                    }
                                },
                                 {
                                    xtype: 'timefield',
                                    name: 'process_time',
                                    id: gu.id('process_time'),
                                    width: '29.6%',
                                    minValue: '0:00',
                                    maxValue: '23:30',
                                    format: 'H:i',
                                    dateFormat: 'H:i',
                                    submitFormat: 'H:i',
                                    value: gm.me().getThirtyMinites(new Date(change_date)),
                                    increment: 30,
                                    anchor: '50%',
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            // gm.me().setRefDateDefect();
                                        }
                                    }
                                },**/
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('defect_total_qty'),
                                    width: '96%',
                                    name: 'defect_total_qty',
                                    value: defect_total_qty,
                                    fieldLabel: '불량수량'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('CMD_DEFECT_QUAN_REVISE', '불량수량수정'),
                    width: 450,
                    height: 350,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                var selection = currentTab.getSelectionModel().getSelection()[0];

                                var defect_total_qty = gu.getCmp('defect_total_qty').getValue();
                                var pcsCodeGroup = gu.getCmp('pcsCodeGroup').getValue();

                                var ref_date = gu.getCmp('ref_date').getValue();
                                // var process_date = gu.getCmp('process_date').getValue();
                                // var process_time = gu.getCmp('process_time').getValue();

                                var work_type = gu.getCmp('work_type').getValue().work_type;
                                console_logs('>>>>> work_type', work_type);

                                var defect_detail = gu.getCmp('defect_detail').getValue();


                                var cartmap_uid = selection.get('unique_id_long');

                                var big_pcs_code = currentTab.multi_grid_id;

                                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                                var msg = '불량 수량을 수정하시겠습니까?';

                                Ext.MessageBox.show({
                                    title: '확인',
                                    msg: msg,
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function (result) {
                                        if (result == 'yes') {

                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=updateDefect',
                                                params: {
                                                    'defect_total_qty': defect_total_qty,
                                                    'defect_detail': defect_detail,
                                                    'ref_date': ref_date,
                                                    'process_date': '',
                                                    'process_time': '',
                                                    'pcswork_uid': pcswork_uid,
                                                    'work_type': work_type
                                                },

                                                success: function (result, request) {
                                                    gm.me().store.load();
                                                    gm.me().pcsworkDefectStore.load();
                                                    Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
                                                    });
                                                    currentTab.getStore().load();
                                                    prWin.close();
                                                },//endofsuccess
                                                failure: extjsUtil.failureMessage
                                            });//endofajax

                                            gm.me().pcsworkDefectStore.load();
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
        });

        this.removeDefectAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: this.getMC('CMD_DEFECT_QUAN_DELETE', '불량수량삭제'),
            tooltip: '해당 작업의 불량수량을 삭제합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeDefectAction'),
            handler: function () {
                var rec = gm.me().defectListGrid.getSelectionModel().getSelection()[0];
                console_logs('rec >>>>', rec);
                var pcswork_uid = rec.get('unique_id_long');
                var pcsstep_uid = rec.get('pcsstep_uid');
                var selections = currentTab.getSelectionModel().getSelection()[0];
                console_logs('selections', selections);
                var state = selections.get('state');
                // if(state === 'Y') {
                //     Ext.MessageBox.alert('알림', '생산완료된 실적은 삭제가 불가합니다.')
                //     return;
                // } else {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '불량수량을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=removeDefectQty',
                                params: {
                                    pcswork_uid: pcswork_uid,
                                    pcsstep_uid: pcsstep_uid
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    gm.me().pcsworkDefectStore.load();
                                    Ext.Msg.alert('안내', '삭제 되었습니다.', function () {
                                    });
                                    currentTab.getStore().load();
                                    gm.me().removeProductionAction.enable();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
                // }

                // prWin.show();
            }
        });

        this.defectListGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('defectListGrid'),
            store: this.pcsworkDefectStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.modifyDefectAction,
                        this.removeDefectAction
                    ]
                }
            ],
            columns: [
                {
                    text: this.getMC('CMD_WORK_DATE', '생산일자'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'start_date',
                    sortable: true,
                    renderer: function (value, meta, record) {

                        if (value.length > 10) {
                            return value.substring(0, 10);
                        } else {
                            return null;
                        }

                    }
                },
                {
                    text: this.getMC('CMD_WORK_TYPE', '작업반'),
                    width: 75,
                    style: 'text-align:center',
                    dataIndex: 'work_type',
                    sortable: true,
                    renderer: function (value, meta, record) {
                        switch (value) {
                            case 'day':
                                return '주간';
                            default:
                                return '야간';
                        }
                    }
                },
                {
                    text: this.getMC('CMD_DEFECT_DETAIL', '불량유형'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'defect_name',
                    sortable: true
                },
                {
                    text: this.getMC('CMD_DEFECT_QUAN', '불량수량'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'defect_total_qty',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, meta, record) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: this.getMC('CMD_DEFECT_CODE', '불량코드'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'defect_detail',
                    sortable: true
                },
                {
                    text: this.getMC('ppo2_user_name', '등록자'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'user_name',
                    sortable: true
                },
                // { text: this.getMC('CMD_PROCESS_NAME','공정명'), width: 80, style: 'text-align:center', dataIndex: 'pcs_name', sortable: false },

                {
                    text: this.getMC('crt4_create_date', '등록시간'),
                    width: 130,
                    style: 'text-align:center',
                    dataIndex: 'change_date',
                    sortable: true,
                    renderer: function (value, meta, record) {
                        if (value.length > 16) {
                            return value.substring(0, 16);
                        } else {
                            return null;
                        }
                    }
                },


            ],
            title: this.getMC('CMD_DEFECT_HISTORY', '불량 히스토리'),
            autoScroll: true,
            listeners: {}
        });

        this.workListGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().modifyProductionAction.enable();
                    gm.me().removeProductionAction.enable();
                } else {
                    gm.me().modifyProductionAction.disable();
                    gm.me().removeProductionAction.enable();
                }
            }
        });

        this.defectListGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().modifyDefectAction.enable();
                    gm.me().removeDefectAction.enable();
                } else {
                    gm.me().modifyDefectAction.disable();
                    gm.me().removeDefectAction.disable();
                }
            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            selected_rec = selections;
            console_logs('selections', selections);
            console_logs('gm.me().selected_tab', gm.me().selected_tab);
            console_logs('info...	', gm.me().tab_info);

            var code = gm.me().selected_tab;

            if (code != undefined) {
                gm.me().tab_selections[code] = selections;
            }

            var quan = 0;
            for (var i = 0; i < selections.length; i++) {
                quan += selections[i].get('bm_quan');
            }

            var toolbar = null;
            var items = null;
            if (code != undefined) {
                var infos = gm.me().tab_info;
                console_logs('infos', infos);
                if (infos != null) {
                    for (var i = 0; i < infos.length; i++) {
                        var o = infos[i];
                        if (o['code'] == code) {
                            var toolbars = o['toolbars'];
                            // toolbar = toolbars[1];
                            //
                            // items = toolbar.items.items;
                        }

                    }
                }

            }

            console_logs('toolbar', toolbar);
            console_logs('toolbar items', items);


            gm.me().barcodePrintAction.enable();


            if (selections.length) {

                var rec = selections[0];

                // gm.me().defectCodeStore.getProxy().setExtraParam('role_code', '%' + rec.get('sg_code').substring(0, 2) + '%');

                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gm.me().vSELECTED_PJ_CODE = rec.get('pj_code');
                gm.me().vSELECTED_PJ_CODE = gu.stripHighlight(gm.me().vSELECTED_PJ_CODE);
                var ac_uid = gm.me().vSELECTED_AC_UID;
                gm.me().pj_code = gm.me().vSELECTED_PJ_CODE + "-";
                gm.me().barcodePrintAction.enable();
                gm.me().backToPrdPlan.enable();
                gm.me().requestGoAction.enable();
                gm.me().changePlan.enable();
                gm.me().completePrdAction.enable();
                gm.me().setExpAction.enable();

                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gu.enable(items[i]);
                    }
                }

                gm.me().pcsworkStore.getProxy().setExtraParam('cartmap_uid', rec.get('unique_id_long'));
                gm.me().pcsworkStore.getProxy().setExtraParam('result', 'Y');
                gm.me().pcsworkStore.load();

                gm.me().pcsworkDefectStore.getProxy().setExtraParam('cartmap_uid', rec.get('unique_id_long'));
                gm.me().pcsworkDefectStore.getProxy().setExtraParam('result', 'N');
                gm.me().pcsworkDefectStore.load();

            } else {
                gm.me().backToPrdPlan.disable();
                gm.me().barcodePrintAction.disable();
                gm.me().requestGoAction.disable();
                gm.me().changePlan.disable();
                gm.me().completePrdAction.disable();
                gm.me().setExpAction.disable();
                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gu.disable(items[i]);
                    }
                }
            }

        });

        this.createCrudTab();
        console_logs('tab_info', this.tab_info);
        //Tab을 만들지 않는 경우.
        if (this.tab_info.length == 0) {
            Ext.apply(this, {
                layout: 'border',
                items: [this.grid, this.crudTab]
            });
            this.callParent(arguments);
            //디폴트 로드
            gm.setCenterLoading(true);

            this.grid.store.getProxy().setExtraParam('orderBy', 'unique_id');
            this.grid.store.getProxy().setExtraParam('ascDesc', 'ASC');
            this.storeLoad(function (records) {
                console_logs('디폴트 데이터', main);
                for (var i = 0; i < records.length; i++) {
                    var specunit = records[i].get('specification');
                    gm.me().spec.push(specunit);

                }
            });

        } else { //Tab그리드를 사용하는 경우.
            this.grid.setTitle(this.getMC('CMD_ALL', '전체'));
            var items = [];
            items.push(this.grid);
            var tab = this.createTabGrid('Rfx2.model.company.bioprotech.ProduceWork', items, 'big_pcs_code', arr, function (curTab, prevtab) {
                currentTab = curTab;
                var multi_grid_id = curTab.multi_grid_id;
                gm.me().multi_grid_id = multi_grid_id;
                console_logs('multi_grid_id: ', curTab);
                console_logs('multi_grid_id: ', multi_grid_id);
                gm.me().store.getProxy().setExtraParam('isReady', 'true');
                gm.me().store.getProxy().setExtraParam('isProcess', 'true');
                if (multi_grid_id == undefined) { //Main grid
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);
                    gm.me().store.getProxy().setExtraParam('recv_flag', 'GE');
                    gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                    gm.me().store.getProxy().setExtraParam('js_pcs_code', null);
                    // gm.me().store.getProxy().setExtraParam('project_varcharg', null);
                    gm.me().store.getProxy().setExtraParam('rtgast_od_po_types', null);
                    gm.me().storeLoad();
                } else {//추가 탭그리드
                    var store = gm.me().store_map[multi_grid_id];
                    console_logs('multi_grid_id ????', multi_grid_id);
                    if (multi_grid_id === 'BPH') {
                        gm.me().store.getProxy().setExtraParam('rtgast_od_po_types', 'HOD|HSC');
                    } else if (multi_grid_id === 'BPC') {
                        gm.me().store.getProxy().setExtraParam('rtgast_od_po_types', 'COD|CSC');
                    }
                    //store.getProxy().setExtraParam('big_pcs_code', multi_grid_id);
                    store.getProxy().setExtraParam('status', null);
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);
                    gm.me().storeLoad();
                }
            });

            //모든 스토어에 디폴트 조건
            Ext.apply(this, {
                layout: 'border',
                items: [{
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '73%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [tab]
                    }]
                }, {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: 'border',
                    margin: '5 0 0 0',
                    width: '20%',
                    items: [
                        {
                            collapsible: false,
                            frame: false,
                            region: 'north',
                            split: true,
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            height: '50%',
                            items: [this.workListGrid]
                        },
                        {
                            collapsible: false,
                            frame: false,
                            split: true,
                            region: 'center',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            height: '50%',
                            items: [this.defectListGrid]
                        }
                    ]
                }/** /, this.crudTab**/]
            });
            this.callParent(arguments);
            //디폴트 로드
            gm.setCenterLoading(false);
        }
    },
    selectPcsRecord: null,
    items: [],
    pj_code: null,
    spec: [],

    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '정보 수정',
            plain: true,
            items: form,
            margin: 5,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var form = gu.getCmp(gu.id('formPanel')).getForm();
                    var srcahd_uids = [];
                    //var selections = gm.me().grid.getSelectionModel().getSelection();
                    selections = selected_rec;
                    console_logs('=====>selections', selections);
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('itemdetail_uid');
                        console_logs('=====>uid', uid);
                        srcahd_uids.push(uid);
                    }
                    form.submit({
                        url: CONTEXT_PATH + '/index/process.do?method=updateItemdetail',
                        params: {
                            srcahduids: srcahd_uids
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().storeLoad(function (records) {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                        }
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
    },

    extoutJson: function (multi_grid_id, records, fname) {
        if (records == null || records.length == 0) {
            return;
        }
        var big_pcs_code = multi_grid_id == undefined ? 'SSP' : multi_grid_id;
        var smallPcs = gu.mesTplProcessAll[big_pcs_code];
        var column_name = ['end_date', 'step_uid'];
        for (var k = 0; k < 2; k++) {
            fname = column_name[k];
            if (smallPcs != null && smallPcs.length > 0) {
                for (var j = 0; j < smallPcs.length; j++) {
                    var o1 = smallPcs[j];
                    var pcsCode = o1['code'];
                    for (var i = 0; i < records.length; i++) {
                        var o = records[i];
                        o.set(pcsCode + '|' + fname, null);
                    }
                }
            }
            for (var i = 0; i < records.length; i++) {
                var o = records[i];
                o.set('update_pcsstep', 'FULL_MAKE');//공정처리
                var js_fname = o.get('js_' + fname);
                for (var key in js_fname) {
                    //console_logs('key', key);
                    var arr = js_fname[key];
                    if (arr instanceof Array) {
                        o.set(key + '|' + fname, arr[0]);
                    } else {
                        o.set(key + '|' + fname, arr);
                    }
                }
            }
        }
    },

    addExtraColumnBypcscode: function (myColumn, myField, big_pcs_code, temp_code, step_field, editable, pos) {

        console_logs('big_pcs_code', big_pcs_code);
        console_logs('myColumn', myColumn);
        console_logs('myField', myField);
        var columnGroup = [];
        var smallPcs = gu.mesTplProcessAll[big_pcs_code];
        if (smallPcs == undefined || smallPcs.length == 0) {
            return;
        }
        console_logs('smallPcs', smallPcs);
        //복사대상
        var c = myColumn[0];
        var f = myField[0];

        var processCode = 'process_';

        for (var j = 0; j < smallPcs.length; j++) {
            for (var k = 0; k < 2; k++) {
                var o = smallPcs[j];
                var new_c = {};
                for (var key in c) {
                    switch (key) {
                        case 'dataIndex':
                            new_c[key] = processCode + j + '|' + (k % 2 == 0 ? 'start_date' : 'end_date');
                            break;
                        case 'text':
                            new_c[key] = o['name'] + (k % 2 == 0 ? ' 시작' : ' 완료');
                            break;
                        default:
                            new_c[key] = c[key];

                    }
                }
                var new_f = {};
                console_logs('smallPcs o', o);
                for (var key in f) {
                    switch (key) {
                        case 'text':
                            new_f[key] = o['name'];
                            break;
                        case 'name':
                            new_f[key] = processCode + j + '|' + (k % 2 == 0 ? 'start_date' : 'end_date');
                            break;
                        default:
                            new_f[key] = f[key];
                    }
                }

                new_c['canEdit'] = editable;
                new_c['dataType'] = 'sdate';
                new_c['important'] = true;
                new_c['id'] = 'uid-' + Math.floor((Math.random() * 10000000000) + 1);
                new_f['tableName'] = 'pcsstep';
                new_f['type'] = 'date';
                new_f['useYn'] = 'Y';
                new_c['width'] = 10 /**+ (new_c['text'].length * 2)**/;
                console_logs('-----------new_c', new_c);
                console_logs('--------------new_f', new_f);
                // myColumn.splice(pos + (j * 2) + k, 0, new_c);
                myField.splice(pos + (j * 3) + k, 0, new_f);
            }
        }

        for (var j = 0; j < smallPcs.length; j++) {

            var o = smallPcs[j];
            var new_c = {};
            for (var key in c) {
                switch (key) {
                    case 'dataIndex':
                        new_c[key] = processCode + j + '|' + 'comp_qty';
                        break;
                    case 'text':
                        new_c[key] = o['name'] + '수량';
                        break;
                    default:
                        new_c[key] = c[key];

                }
            }

            console_logs('smallPcs o', o);
            for (var key in f) {
                switch (key) {
                    case 'text':
                        new_f[key] = o['name'];
                        break;
                    case 'name':
                        new_f[key] = processCode + j + '|' + 'comp_qty';
                        break;
                    default:
                        new_f[key] = f[key];
                }
            }

            new_c['dataType'] = 'sdate';
            new_c['important'] = true;
            new_c['id'] = 'uid-' + Math.floor((Math.random() * 10000000000) + 1);
            new_c['align'] = 'right';
            new_c['style'] = 'text-align:center';
            new_f['tableName'] = 'pcsstep';
            new_f['type'] = 'date';
            new_f['useYn'] = 'Y';
            new_f['align'] = 'center';
            new_c['width'] = 40 + (new_c['text'].length * 10);
            console_logs('-----------new_c', new_c);
            console_logs('--------------new_f', new_f);
            myColumn.splice(pos + j, 0, new_c);
            myField.splice(pos + j, 0, new_f);
        }


        console_logs('-----------myColumn', myColumn);
        console_logs('--------------myField', myField);

    },

    specwinopen: function (form) {
        specwin = Ext.create('Ext.Window', {
            modal: true,
            title: '정보 수정',
            plain: true,
            items: form,
            margin: 5,
            width: 340,
            height: 400,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    specwin.close();

                }//btn handler
            }]
        });
        specwin.show();
    },

    multi_grid_id: undefined,

    createPcsToobars: function (code) {
        console_logs('createPcsToobars code', code);
        var buttonItems = [];

        buttonItems.push({
            name: code + 'finish_date',
            cmpId: code + 'finish_date',
            format: 'Y-m-d',
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            allowBlank: true,
            xtype: 'datefield',
            value: new Date(),
            width: 100,
            handler: function () {
            }
        });

        var temp_code = gu.mesTplProcessBig[0].code;
        var smallPcs = gu.mesTplProcessAll[temp_code];

        var processCode = 'process_';

        console_logs('-------------->  smallPcs', smallPcs);
        if (smallPcs != null && smallPcs.length > 0) {
            for (var i = 0; i < smallPcs.length; i++) {
                var o1 = smallPcs[i];
                var code1 = o1['code'];
                var name1 = o1['name'];
                console_logs('createPcsToobars code1', code1);
                console_logs('createPcsToobars name1', name1);
                var action1 = {
                    xtype: 'button',
                    iconCls: 'af-check',
                    cmpId: code + /*code1*/ processCode,
                    text: name1 + '시작',
                    big_pcs_code: code,
                    // pcs_code: code1,
                    pcs_code: processCode + i,
                    disabled: true,
                    handler: function () {
                        gm.setCenterLoading(true);
                        console_logs('createPcsToobars', this.cmpId + ' clicked');
                        console_logs('big_pcs_code', this.big_pcs_code);
                        console_logs('pcs_code', this.pcs_code);

                        var text = gm.me().findToolbarCal(this.big_pcs_code);
                        console_logs('text', text);
                        if (text == null) {
                            Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function () {
                            });
                        } else {
                            var date = text.getValue();
                            console_logs('val', date);
                            var selections = gm.me().tab_selections[this.big_pcs_code];
                            console_logs('selections>>>>>>>>', selections);
                            if (selections != null) {
                                var whereValue = [];
                                var field = this.pcs_code + '|' + 'start_date';
                                for (var i = 0; i < selections.length; i++) {
                                    var o = selections[i];

                                    o.set(field, date);
                                    console_logs('o', o);
                                    console_logs('this.pcs_code', this.pcs_code);

                                    var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
                                    whereValue.push(step_uid);
                                }
                                console_logs('createPcsToobars', whereValue);
                                gm.editAjax('pcsstep', 'start_date', date, 'unique_id', whereValue, {type: 'update_pcsstep_and_work'});
                            }
                        }
                    }
                };
                var action = {
                    xtype: 'button',
                    iconCls: 'af-check',
                    cmpId: code + code1,
                    text: name1 + '완료',
                    big_pcs_code: code,
                    pcs_code: processCode + i,
                    disabled: true,
                    handler: function () {
                        gm.setCenterLoading(true);
                        console_logs('createPcsToobars', this.cmpId + ' clicked');
                        console_logs('big_pcs_code', this.big_pcs_code);
                        console_logs('pcs_code', this.pcs_code);
                        var text = gm.me().findToolbarCal(this.big_pcs_code);
                        console_logs('text', text);
                        if (text == null) {
                            Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function () {
                            });
                        } else {
                            var date = text.getValue();
                            console_logs('val', date);
                            var selections = gm.me().tab_selections[this.big_pcs_code];
                            console_logs('selections>>>>>>>>', selections);
                            if (selections != null) {
                                var whereValue = [];
                                var field = this.pcs_code + '|' + 'end_date';
                                for (var i = 0; i < selections.length; i++) {
                                    var o = selections[i];
                                    o.set(field, date);
                                    console_logs('o', o);
                                    console_logs('this.pcs_code', this.pcs_code);
                                    var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
                                    whereValue.push(step_uid);
                                }
                                console_logs('createPcsToobars', whereValue);
                                gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue, {type: 'update_pcsstep_and_work'});
                            }
                        }
                    }
                };
                buttonItems.push(action1);
                buttonItems.push(action);

            }//endoffor
        }

        console_logs('createPcsToobars buttonItems', buttonItems);
        var buttonToolbar1 = Ext.create('widget.toolbar', {
            items: buttonItems
        });
        console_logs('createPcsToobars buttonToolbar', buttonToolbar1);
        return buttonToolbar1;
    },

    findToolbarCal: function (big_pcs_code) {
        var toolbar = null;
        var items = null;
        if (big_pcs_code != undefined) {
            var infos = gm.me().tab_info;
            console_logs('infos', infos);
            if (infos != null) {
                for (var i = 0; i < infos.length; i++) {
                    var o = infos[i];
                    if (o['code'] == big_pcs_code) {
                        var toolbars = o['toolbars'];
                        toolbar = toolbars[1];
                        items = toolbar.items.items;
                    }
                }
            }
        }

        if (items != null && items.length > 0) {
            return items[0];
        } else {
            return null;
        }
        console_logs('toolbar', toolbar);
        console_logs('toolbar items', items);
    },

    tab_selections: {},

    setCheckname: function (b) {
        this.checkname = b;
        var btn = gu.getCmp('prwinopen-OK-button');
        if (b) {
            btn.enable();
        } else {
            btn.disable();
        }
    },

    //storeLoad callback override
    storeLoadCallbackSub: function (records) {
        console_logs('records', records);

        var multi_grid_id = gm.me().multi_grid_id;
        console_logs('디폴트 데이터', multi_grid_id);
        if (multi_grid_id == undefined) {
            for (var i = 0; i < records.length; i++) {
                var keyCode = multi_grid_id;
                var specunit = records[i].get('specification');
                gm.me().spec.push(specunit);
            }
        } else {
            var keyCode = multi_grid_id;
        }
        gm.me().extoutJson(multi_grid_id, records, null);
    },

    getThirtyMinites: function (time) {

        var hour = time.getHours();
        var minute = time.getMinutes();

        if (minute >= 30) {
            return hour + ':30';
        } else {
            return hour + ':00';
        }
    },

    setRefDate: function () {
        var work_type = gu.getCmp('work_type').getValue().work_type;

        if (work_type == 'night') {
            var process_time = gu.getCmp('process_time').getValue();
            var hour = process_time.getHours();
            var process_date = new Date(gu.getCmp('process_date').getValue());

            if (hour < 12) {
                process_date.setDate(process_date.getDate() - 1);
            }

            gu.getCmp('ref_date').setValue(process_date);
        } else {
            var process_date = new Date(gu.getCmp('process_date').getValue());
            gu.getCmp('ref_date').setValue(process_date);
        }
    },


    //바코드 출력

    printBarcode: function () {

        //var selections = selected_rec;
        var selections = gm.me().grid.getSelectionModel().getSelection();

        //var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];
        var item_name = '';

        var item_name_Arr = [];
        var compare_Arr = [];
        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            item_name = rec.get('item_name');
            uniqueIdArr.push(uid);
            item_name_Arr.push(item_name);

            compare_Arr.push(item_name);
        }

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
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
                labelWidth: 60,
                margins: 10,
            },


        });//Panel end...

        //원본
        // if (uniqueIdArr.length > 0) {
        //     prwin = gMain.selPanel.prbarcodeopen(form);
        // }


        var compare = [];
        var checkCompare = 0;

        for (var i = 0; i < item_name_Arr.length; i++) {
            for (var j = 0; j < compare_Arr.length; j++) {
                if (item_name_Arr[i] == compare_Arr[j]) {
                } else {
                    checkCompare = j + j;
                }
            }
        }

        console_logs('checkCompare 비교 값   >>>', checkCompare);

        if (uniqueIdArr.length > 0) {
            if (checkCompare > 0) {
                Ext.Msg.alert('안내', '동일한 품명을 선택해주세요', function () {
                });

            }
            if (checkCompare == 0) {
                //prwin = gMain.selPanel.prbarcodeopen(form);
                prwin = gMain.selPanel.barcodeModal(form);

            }
        }

    },

    // 바코드 모달


    barcodeModal: function (form) {

        //셀렉션붙임 시작
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

        var uniqueIdArr = [];
        var bararr = [];

        var cartmap_uid_array = [];
        var srcahd_uid_array = [];
        var item_code_uid_array = [];
        var item_name_uid_array = [];
        var item_name_zh_list = [];
        var po_no_arr = [];
        var pj_uids = [];
        var gr_quan_arr = [];
        var pcs_desc_arr = [];
        var gr_date_arr = [];

        var bm_quan_list = [];

        var countPlus = 0;

        var productLotArray = [];
        var lotNoSelect = [];

        var specArr = [];

        var lotinPut = null;
        var itemCodeinPut = null;
        var itemNameinPut = null;
        var srcahdUidinput = -1;

        var gr_date = '';

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            console_logs('rec', rec);
            var uid = rec.get('unique_id');  //rtgast unique_id???
            var item_code = rec.get('item_code');
            var item_name = rec.get('item_name');
            var srcahd_uid = rec.get('srcahd_uid');
            var item_name_zh = rec.get('mid_code');
            var specification = rec.get('specification');
            var description = rec.get('description');
            var bm_quan = rec.get('bm_quan');
            gr_date = rec.get('goods_in_date');
            //var lot_no = rec.get('lot_no');

            var lot_no = rec.get('pcs_desc_group_assy');
            var lotinPut = rec.get('pcs_desc_group_assy');
            itemCodeinPut = item_code;
            itemNameinPut = item_name;

            if (specification == null) {
                specArr.push(specification);
            } else {
                specArr.push(description);
            }


            console_logs('lot_no  >>>2346346  ', lot_no);

            var bar_spec = item_code + '|' + item_name + '|' + specification;

            srcahdUidinput = srcahd_uid;

            //var GrQuan = rec.get(('gr_quan'));
            var GrQuan = rec.get(('pr_qty'));
            var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');

            // srcahd.finance_rate,
            //  srcahd.cost_qty,

            pcs_desc_arr.push(pcs_desc_group_assy);
            gr_quan_arr.push(GrQuan);

            uniqueIdArr.push(uid);
            bararr.push(bar_spec);
            cartmap_uid_array.push(uid);
            srcahd_uid_array.push(srcahd_uid);
            if (gr_date == null) {
                gr_date = '0000-00-00';
            }
            gr_date_arr.push(gr_date);

            item_code_uid_array.push(item_code);
            item_name_uid_array.push(item_name);
            item_name_zh_list.push(item_name_zh);
            bm_quan_list.push(bm_quan);
            productLotArray.push(lot_no);

        }
        //셀렉션 붙임 끝


        var boxPacking = null;

        var printQuan = null;

        var etc_grid = Ext.create('Ext.grid.Panel', {


            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 750,
            height: 500,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,

            columns: [
                {
                    id: gu.id('countVale'),

                    //text: item_code,
                    text: '포장수량 설정',

                    //width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    //value : this.value,

                    listeners: {},

                    renderer: function (value) {

                        gm.me().vEachValueee = value;
                        boxPacking = gm.me().vEachValueee;
                        console_logs('  boxPacking 첫번째 ', boxPacking);

                        return value;
                    },

                    value: boxPacking,

                    sortable: false
                },

                {
                    text: '출력 매수',
                    //value : gu.id('countVale') * gr_quan_arr,
                    // width: '20%',
                    dataIndex: 'each',
                    //editor: 'textfield',
                    editor: 'numberfield',
                    sortable: false,

                    renderer: function (value) {

                        console_logs(' 렌더 value   ', value);

                        gm.me().vprintQuan = value;
                        printQuan = gm.me().vprintQuan;

                        return value;
                    },

                    value: 1,

                },
                {
                    text: '출력 자재 총 수량  ',
                    //width: '30%',

                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,

                    renderer: function (value) {
                        //console_logs(' ' , );

                        return printQuan * boxPacking;

                        //return value * 5;
                    }
                },

                {
                    text: '제품 Lot ',
                    // width: '30%',
                    id: gu.id('SaleGoodsLotNumber'),
                    dataIndex: 'input_lot',
                    name: 'input_lot',
                    editable: false,

                    editor: 'textfield',
                    sortable: false,
                    value: lotinPut,

                    renderer: function (value) {
                        return lotinPut;

                    }
                },
                {
                    text: '품목코드 ',
                    // width: '30%',
                    dataIndex: 'input_item_code',
                    name: 'input_item_code',
                    editable: false,

                    editor: 'textfield',
                    sortable: false,
                    value: itemCodeinPut,

                    renderer: function (value) {
                        return itemCodeinPut;

                    }
                },

                {
                    text: '품명 ',
                    // width: '30%',
                    dataIndex: 'input_item_name',
                    name: 'input_item_name',
                    editable: false,

                    editor: 'textfield',
                    sortable: false,
                    value: itemNameinPut,
                    renderer: function (value) {
                        return itemNameinPut;

                    }
                },
                {
                    text: '자재 UID ',
                    // width: '30%',
                    dataIndex: 'input_srcahd_uid',
                    name: 'input_srcahd_uid',
                    editable: false,

                    editor: 'textfield',
                    sortable: false,
                    value: srcahdUidinput,
                    renderer: function (value) {
                        return srcahdUidinput;

                    }
                },
            ],


            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                //clicksToEdit: 2,
                clicksToEdit: 3,
            },
            listeners: {

                click: function () {

                }
            },
            autoScroll: true,
            dockedItems: [


                Ext.create('widget.toolbar', {

                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [

                        {
                            fieldLabel: '프린터',
                            labelWidth: 50,
                            xtype: 'combo',
                            margin: '5 5 5 5',
                            id: gu.id('printer'),
                            name: 'printIpAddress',
                            store: Ext.create('Mplm.store.PrinterStore'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            emptyText: '프린터 선택',
                            allowBlank: false
                        },
                        {
                            fieldLabel: '프린트 라벨',
                            labelWidth: 80,
                            xtype: 'combo',
                            margin: '5 5 5 5',
                            id: gu.id('print_label'),
                            name: 'labelSize',
                            store: Ext.create('Mplm.store.PrintLabelStore'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            emptyText: '라벨 선택',
                            allowBlank: false
                        },

                        '->',

                        {
                            xtype: 'textfield',
                            name: 'print_qty',
                            fieldLabel: '품명',
                            margin: '5 5 5 5',
                            editable: false,
                            labelWidth: 40,
                            width: 150,
                            allowBlank: false,
                            value: item_name,
                            maxlength: '1',
                        },

                        {
                            text: '+',
                            listeners: [{
                                click: function () {

                                    // var store = gu.getCmp('etc_grid').getStore();

                                    //  store.insert(store.getCount(), new Ext.data.Record({
                                    //      'packing': '0', 'each': '0'
                                    //  }));

                                    var store = gu.getCmp('etc_grid').getStore();
                                    var getCount = store.getCount();

                                    console_logs('item index >> ', getCount);


                                    //+ 버튼은 한번만 입력되도록

                                    // if(getCount==0 ) {

                                    //     console_log('item index >> null ');
                                    //     store.insert(store.getCount(), new Ext.data.Record({
                                    //         'packing': '0', 'each': '0'
                                    //     }));

                                    //  };

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'packing': '0', 'each': '0'
                                    }));

                                    var obj = gu.getCmp('countVale');
                                    var grValue = obj['value'];

                                    console_logs('연산한 값 3333>>>>', grValue);

                                    countPlus = countPlus + 1;
                                    //console_logs('countPlus 출력 >>>> ', countPlus);

                                }
                            }]
                        },

                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                }
                            }]
                        },

                    ]
                }),

                //여기부터

                Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        frame: false,
                        border: false,
                        bodyPadding: 10,
                        region: 'center',
                        layout: 'form',
                        autoScroll: true,
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget: 'side'
                        },

                    }
                ),


            ]
        });

        var comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == '192.168.20.11') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        var comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == 'L100x80') {
                        comboLabel.select(record);
                    }
                });
            }
        );

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '제품 바코드 출력  ',
            width: 770,
            height: 500,
            plain: true,
            //items: poEditForm,
            //items: form,

            items: etc_grid,

            overflowY: 'scroll',

            buttons: [{
                text: '바코드 출력',

                handler: function (btn) {

                    var store = gu.getCmp('etc_grid').getStore();
                    var totalIndex = store.getCount();

                    //     store.insert(store.getCount(), new Ext.data.Record({
                    //     'packing': '0', 'each': '0'
                    //  }));

                    //      var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                    //                 gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));

                    var packingTotal = [];
                    var printTotal = [];

                    var packingCount = 0;
                    var printCount = 0;
                    var multiple = 0;

                    var intputLotno = [];


                    var quanArray = []; //포장수량 배열
                    var lotArray = []; //로트 배열
                    var printQuanArray = [];   //출력 매수 배열
                    var packingArray = [];

                    var itemCodeArray = [];
                    var itemNameArray = [];
                    var srcahdUidArray = [];
                    var cartmapUidArray = [];

                    for (i = 0; i < totalIndex; i++) {
                        packingCount = packingCount + store.data.items[i].get('packing');
                        printCount = printCount + store.data.items[i].get('each');
                        multiple = multiple + store.data.items[i].get('packing') * store.data.items[i].get('each');
                        //packingTotal.push(packingCount);
                        //printTotal.push(printCount);
                        intputLotno = multiple + store.data.items[i].get('input_lot');


                        var packing = store.data.items[i].get('packing');
                        var each = store.data.items[i].get('each');
                        var input_lot = store.data.items[i].get('input_lot');

                        printCount = printCount + store.data.items[i].get('each');

                        quanArray.push(packing);
                        printQuanArray.push(each);

                        //lotArray.push(input_lot);

                        lotArray.push(lot_no);
                        itemCodeArray.push(item_code_uid_array[0]);
                        itemNameArray.push(item_name_uid_array[0]);
                        srcahdUidArray.push(srcahd_uid_array[0]);
                        cartmapUidArray.push(cartmap_uid_array[0]);
                    }


                    // var testLot = gu.getCmp('OrderGoodsLotInputForm');
                    // var LotValue = testLot['value'];


                    var LotValue = intputLotno

                    //원본 (+ 0번째만)
                    //var checkValue = printQuan * boxPacking;

                    //prwin = gm.me().checkSumOpen(form);

                    console_logs('GrQuan 출력 >>', GrQuan);
                    console_logs('LotValue 출력 >>', LotValue);

                    if (multiple < GrQuan) {
                        // console_log('총 수량 보다 적습니다'  );
                        // prwin = gm.me().checkSumOpen(form);

                        Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');

                    } else {

                        var objs = [];
                        var columns = [];
                        var obj = {};
                        var store = gu.getCmp('etc_grid').getStore();

                        //cnt는 상관없음
                        //var cnt = store.getCount();

                        var packingArr = [];

                        var each = 0;
                        Boolean = true;
                        var sumQty = 0;

                        sumQty = printQuan * boxPacking;

                        console_logs('printQuan  >>>>>>>>  ', printQuan);
                        console_logs('boxPacking  >>>>>>>>  ', boxPacking);

                        //console_logs(' productLotArray >>> 새로 >>>'  + productLotArray);


                        // for (var x = 0; x < sumQty; x++) {
                        //     //리스트별로 포장수량 입력
                        //     packingArray.push(boxPacking);
                        // }

                        if (btn == 'no') {
                            prWin.close();

                        } else {


                            if (printQuanArray == null || printQuanArray.length == 0) {
                                gm.me().showToast('오류', "출력할 항목을 추가하세요.");
                                return;
                            }

                            var printIpAddress = gu.getCmp('printer').getValue();
                            var labelSize = gu.getCmp('print_label').getValue();

                            Ext.Ajax.request({
                                //url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
                                url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBiotNewVer',
                                // url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',

                                params: {
                                    barcode_type: 'CARTMAP',
                                    printIpAddress: printIpAddress,
                                    labelSize: labelSize,
                                    print_qty: printQuan,
                                    item_code_list: itemCodeArray,
                                    item_name_list: itemNameArray,
                                    item_name_zh_list: item_name_zh_list,
                                    lot_no_list: lot_no,
                                    spec_list: specArr,
                                    qaun_list: quanArray,
                                    gr_date_list: gr_date_arr,
                                    srcahd_uid_list: srcahdUidArray,
                                    cartmap_uid_list: cartmapUidArray,
                                    bm_quan_list: bm_quan_list

                                    /*
                                    print_type: 'EACH',

                                    countPlus: printQuan,
                                    print_qty: printQuan,

                                    printIpAddress: printIpAddress,
                                    labelSize: labelSize,

                                    //packingArr: packingArray,

                                    lotrtgastUids: uniqueIdArr,
                                    barcodes: bararr,
                                    lot_no: lot_no,
                                    cartmap_uid_list: cartmapUidArray, //cartmap_uid_array,
                                    srcahd_uid_list: srcahdUidArray, //srcahd_uid_array,
                                    item_code_uid_list: itemCodeArray, //item_code_uid_array,
                                    item_name_uid_list: itemNameArray, //item_name_uid_array,
                                    //gr_quan_arr : gr_quan_list
                                    gr_quan_list: gr_quan_arr,
                                    pcs_desc_list: pcs_desc_arr,
                                    input_lot: LotValue,
                                    //Boolean : Boolean,
                                    labelType: 'sales',
                                    gr_date: gr_date,
                                    quanArray: quanArray,
                                    printQuanArray: printQuanArray,
                                    //원본
                                    //lotArray : lotArray
                                    // lotArray : productLotArray,
                                    lotArray: lotArray,

                                    specArr: specArr
                                    */

                                },


                                success: function (result, request) {

                                    var s = result.responseText;
                                    try {
                                        var jsonData = Ext.decode(s);
                                        console_logs('jsonData', jsonData);
                                        var error = jsonData.error;
                                        console_logs('error', error);
                                        if (error != null && error.length > 0) {
                                            console_logs('오류', error);
                                            gm.me().showToast('오류', error);
                                            return;
                                        }

                                    } catch (e) {
                                    }

                                    prWin.close();

                                },
                                failure: extjsUtil.failureMessage
                            });

                        }

                    }   //else 끝
                }
            },

                , {
                    text: '취소',
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


});
