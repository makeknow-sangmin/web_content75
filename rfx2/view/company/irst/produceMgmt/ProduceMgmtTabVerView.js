//수주등록된 전체 제품 메뉴
Ext.define('Rfx2.view.company.irst.produceMgmt.ProduceMgmtTabVerView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-mgmt-tab-ver-view',
    vFILE_ITEM_CODE: null,
    inputBuyer: null,
    currentTab: null,
    currentPopUpTab: null,
    selected_rec: null,
    lastProcess: null,
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        gu.setDistinctFilters(this.link, ['pj_name', 'specification', 'pj_code']);

        this.setDefValue('regist_date', new Date());
        //삭제할때 사용할 필드 이름.
        this.setDeleteFieldName('unique_uid');

        let next7 = gu.getNextday(7);
        this.setDefValue('delivery_plan', next7);

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        this.setDefComboValue('pj_type', 'valueField', 'P');
        this.setDefComboValue('newmodcont', 'valueField', 'N');
        this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: "작업지시일",
            labelWidth: 60,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        //Function Callback 정의
        this.refreshActiveCrudPanel = function (source, selectOn, unique_id) {
            if (selectOn) {
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
        let buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['COPY']
        });

        //그리드 생성
        let arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.setRowClass(function (record) {

            if (record.get('state') === 'Y') {
                return 'orange-row';
            }
        });

        //grid 생성.
        for (let obj of this.columns) {
            let dataIndex = obj['dataIndex'];

            switch (dataIndex) {
                case 'mass':
                case 'reserved_double1':
                    obj['summaryType'] = 'sum';
                    obj['summaryRenderer'] = function (value) {
                        value = Ext.util.Format.number(value, '0,00.000/i');

                        value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><span style="font-size:10pt; color:#FF0040;">' + value + '(KG)</span></div>'
                        return value;
                    };
                    break;
                case 'quan':
                case 'bm_quan':
                    obj['summaryType'] = 'sum';
                    obj['summaryRenderer'] = function (value) {
                        value = '<div style="text-align: center; font: bold 2.0em/1.0em 굴림체;">' +
                            '<span style="font-size:10pt; color:#FF0040;">' + value + '</span></div>'
                        return value;
                    };
                    break;
                default:
            }
        }

        let processList;

        if (gu.checkUsePcstpl()) {
            processList = gu.mesTplProcessBig;
        } else {
            processList = [];

            for (let obj of gu.mesStdProcess) {
                if (obj['parent'] === obj['code']) {
                    let o1 = {
                        pcsTemplate: obj['code'],
                        code: obj['code'],
                        process_price: 0,
                        name: obj['name']
                    };
                    processList.push(o1);
                }
            }
        }

        this.tab_info = [];
        let start = 0;
        let process_length = processList.length;

        for (let processPos = start; processPos < process_length; processPos++) {
            let o = processList[processPos];
            let code = o['code'];
            let name = o['name'];
            let title = name;
            let a = this.createPcsToobars(code);
            this.tab_info.push({
                code: code,
                name: name,
                title: title,
                toolbars: [a]
            });
        }

        let ti = this.tab_info;

        for (let tabSub of ti) {

            let tab_code = tabSub['code'];
            let temp_code = '';
            let myColumn = this.columns_map[tab_code];
            console_logs("테스트트1", tab_code);
            console_logs("테스트트2",myColumn);
            let myField = this.fields_map[tab_code];
            let pos = tab_code === 'STL' ? 6 : 5;
            if (this.flag2 === 'Y') {
                this.addExtraColumnBypcscode(myColumn, myField, tab_code, temp_code, 'end_date', false, pos);
            } else {
                this.addExtraColumnBypcscode(myColumn, myField, tab_code, temp_code, 'end_date', true, pos);
            }
        }

        this.createGrid();

        // remove the items
        (buttonToolbar.items).each(function (item, index) {
            if (index === 1 || index === 2 || index === 3 || index === 4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.properInputAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '속성 입력',
            tooltip: '속성 입력',
            disabled: true,
            handler: function () {
                gm.me().attributeInput();
            }
        });

        this.processInputAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '바코드로 처리',
            tooltip: '바코드로 처리',
            disabled: false,
            handler: function () {
                gm.me().processInput();
            }
        });

        //자재코드 Action 생성 -- 신화
        this.specConfirmAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '자재코드',
            tooltip: '자재코드',
            disabled: false,
            handler: function () {
                gm.me().specConfirm();
            }
        });

        this.doProcessAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '공정 처리',
            tooltip: '공정 처리',
            disabled: false,
            handler: function () {
                gm.me().doProcessForm();
            }
        });

        // 바코드 출력 버튼
        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '생산바코드',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.inAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Warehousing', '입고등록'),
            tooltip: '입고처리',
            disabled: false,
            handler: function () {

                let selections = gm.me().currentTab.getSelectionModel().getSelection();

                if (selections.length === 0) {
                    Ext.Msg.alert('', '입고할 수주 건을 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }

                let selection = selections[0];

                let ngr_quan = selection.get('ngr_quan');
                let rtgast_od_state = selection.get('rtgast_od_state');

                if (rtgast_od_state === 'P') {
                    Ext.Msg.alert('경고', '생산대기인 상태에서 입고처리를 할 수 없습니다.');
                    return;
                }

                if (ngr_quan > 0) {
                    let form = Ext.create('Ext.form.Panel', {
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
                                title: '수량과 날짜를 정확히 입력하시기 바랍니다.',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('gr_quan'),
                                        anchor: '97%',
                                        name: 'gr_quan',
                                        value: selection.get('ngr_quan'),
                                        fieldLabel: '입고수량'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('defect_qty'),
                                        anchor: '97%',
                                        name: 'defect_qty',
                                        value: 0,
                                        fieldLabel: '불량수량'
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('goods_in_date'),
                                        anchor: '97%',
                                        name: 'goods_in_date',
                                        value: new Date(),
                                        format: 'Y-m-d',
                                        fieldLabel: '입고날짜'
                                    }
                                ]
                            }
                        ]
                    });

                    let prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '생산완료',
                        width: 450,
                        height: 230,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {
                                    //첫번째만 갖고 와야 한다.
                                    // let selection = selected_rec[0];

                                    if (selection.get('pj_type') === 'A' || selection.get('pj_type') === 'AO') {
                                        let processCodeSub = 'process_';
                                        let outpcsQtySub = selection.get(processCodeSub + '0|outpcs_qty');
                                        let defectQty = 0;

                                        if (outpcsQtySub === undefined) {
                                            outpcsQtySub = 0;
                                        }

                                        let grQuanSub = selection.get('gr_quan');
                                        let curGrQuanSub = gu.getCmp('gr_quan').getValue();
                                        let goodsInDateSub = gu.getCmp('goods_in_date').getValue();

                                        let cartmapUidSub = selection.get('unique_id_long');

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
                                            params: {
                                                'cartmap_uid': cartmapUidSub,
                                                'gr_quan': curGrQuanSub,
                                                'goods_in_date': goodsInDateSub
                                            },
                                            success: function () {
                                                if (prWin) {
                                                    prWin.setLoading(false);
                                                    prWin.close();
                                                }
                                                gm.me().getStore().load();
                                            },
                                            failure: function () {
                                                if (prWin) {
                                                    prWin.setLoading(false);
                                                    prWin.close();
                                                }
                                            }
                                        });
                                        if (curGrQuanSub + grQuanSub > Number(outpcsQtySub)) {
                                            Ext.Msg.alert('', '입력 수량이 마지막 공정 완료 수량보다 많습니다.');
                                        } else if (defectQty > curGrQuanSub + grQuanSub) {
                                            Ext.Msg.alert('', '불량 수량이 입력 수량보다 많습니다.');
                                        } else {

                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
                                                params: {
                                                    'cartmap_uid': cartmapUidSub,
                                                    'gr_quan': curGrQuanSub,
                                                    'goods_in_date': goodsInDateSub
                                                },
                                                success: function () {
                                                    if (prWin) {
                                                        prWin.setLoading(false);
                                                        prWin.close();
                                                    }
                                                    gm.me().getStore().load();
                                                },
                                                failure: function () {
                                                    if (prWin) {
                                                        prWin.setLoading(false);
                                                        prWin.close();
                                                    }
                                                }
                                            });
                                        }
                                    } else {

                                        let processCode = 'process_';

                                        let outpcsQty = selection.get(/*maxPcsCode.code*/
                                            processCode + (gu.mesTplProcessAll[gu.mesTplProcessBig[0].code].length - 1) + '|outpcs_qty');

                                        if (outpcsQty === undefined) {
                                            outpcsQty = 0;
                                        }

                                        let gr_quan = selection.get('gr_quan');
                                        let cur_gr_quan = gu.getCmp('gr_quan').getValue();
                                        let goods_in_date = gu.getCmp('goods_in_date').getValue();

                                        let cartmap_uid = selection.get('unique_id_long');
                                        let defect_qty = gu.getCmp('defect_qty').getValue();

                                        if (vCompanyReserved4 === 'HSST01KR' || vCompanyReserved4 === 'YNJU01KR') {
                                            let pr_quan = selection.get('ngr_quan');
                                            if (gu.getCmp('gr_quan').getValue() > pr_quan) {
                                                Ext.Msg.alert('', '입고 가능한 수량을 초과 하였습니다.');
                                            } else if (gu.getCmp('gr_quan').getValue() <= 0) {
                                                Ext.Msg.alert('', '입고 수량을 잘못 입력 하였습니다.');
                                            } else {
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
                                                    params: {
                                                        'cartmap_uid': cartmap_uid,
                                                        'gr_quan': cur_gr_quan,
                                                        'goods_in_date': goods_in_date,
                                                        'defect_qty': defect_qty
                                                    },
                                                    success: function () {
                                                        if (prWin) {
                                                            prWin.setLoading(false);
                                                            prWin.close();
                                                        }
                                                        gm.me().redrawStore();
                                                    },
                                                    failure: function () {
                                                        if (prWin) {
                                                            prWin.setLoading(false);
                                                            prWin.close();
                                                        }
                                                    }
                                                });
                                            }
                                        } else {
                                            if (cur_gr_quan + gr_quan > Number(outpcsQty)) {
                                                Ext.Msg.alert('', '입력 수량이 마지막 공정 완료 수량보다 많습니다.');
                                            } else {
                                                prWin.setLoading(true);

                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
                                                    params: {
                                                        'cartmap_uid': cartmap_uid,
                                                        'gr_quan': cur_gr_quan,
                                                        'goods_in_date': goods_in_date
                                                    },
                                                    success: function () {
                                                        if (prWin) {
                                                            prWin.setLoading(false);
                                                            prWin.close();
                                                        }
                                                        gm.me().getStore().load();
                                                    },
                                                    failure: function () {
                                                        if (prWin) {
                                                            prWin.setLoading(false);
                                                            prWin.close();
                                                        }
                                                    }
                                                });
                                            }
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
                } else {
                    Ext.Msg.alert('', '제품이 모두 출고되어 있습니다.');
                }
            }
        });

        this.doProductionAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Work_Qty', '실적등록'),
            tooltip: '각 공정의 수량을 최신화 합니다.',
            disabled: false,
            handler: function () {

                let defaultQty = 0;

                let selections = gm.me().currentTab.getSelectionModel().getSelection();

                let pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];
                let processCode = 'process_';

                if (selections.length === 0) {
                    Ext.Msg.alert('', '수주를 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }

                let selection = selections[0];

                let ngr_quan = selection.get('ngr_quan');

                let radioValues = [];

                for (let i = 0; i < pcs_codes.length; i++) {

                    let radioValue = {
                        boxLabel: pcs_codes[i].name,
                        name: 'pcs_radio',
                        inputValue: selection.get(processCode + i + '|step_uid'),
                        checked: i === 0
                    };

                    radioValues.push(radioValue);
                }

                if (ngr_quan > 0) {
                    let form = Ext.create('Ext.form.Panel', {
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
                                    title: '공정과 진행수량, 불량수량을 정확히 입력하시기 바랍니다.<br>실적수량을 입력하면 입력수량으로 자동입고를 시행합니다.',
                                    defaults: {
                                        margin: '2 3 3 3'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiogroup',
                                            id: gu.id('pcsCodeGroup'),
                                            fieldLabel: '공정',
                                            items: radioValues,
                                            defaults: {
                                                margin: '0 5 0 0'
                                            },
                                            listeners: {
                                                change: function (field, newValue) {

                                                    for (let pcsCodePos = 0; pcsCodePos < pcs_codes.length; pcsCodePos++) {

                                                        let stepUid = selection.get(processCode + pcsCodePos + '|step_uid');

                                                        if (stepUid === newValue.pcs_radio) {

                                                            let processQtySub = selection.get(processCode + pcsCodePos + '|process_qty');
                                                            let outpcsQtySub = selection.get(processCode + pcsCodePos + '|outpcs_qty');
                                                            defaultQty = processQtySub - outpcsQtySub < 0 ? 0 : processQtySub - outpcsQtySub;

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
                                            readOnly: true,
                                            name: 'ref_date',
                                            value: Ext.Date.add(new Date(), 'Y-m-d'),
                                            submitFormat: 'Y-m-d',
                                            dateFormat: 'Y-m-d',
                                            format: 'Y-m-d',
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',
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
                                                change: function () {
                                                    gm.me().setRefDate();
                                                }
                                            }
                                        },
                                        {
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
                                                change: function () {
                                                    gm.me().setRefDate();
                                                }
                                            }
                                        }, {
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
                                                change: function () {
                                                    gm.me().setRefDate();
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('complete_qty'),
                                            width: '96%',
                                            name: 'complete_qty',
                                            value: 0,
                                            fieldLabel: '진행수량',
                                            maskRe: /[0-9.-]/,
                                            validator: function (v) {
                                                return /^-?\d*(\.\d{1,2})?$/.test(v) ? true : 'Only positive/negative float (x.yy)/int formats allowed!';
                                            },
                                            listeners: {
                                                change: function (e, text, prev) {
                                                    if (!/^-?\d*(\.\d{0,2})?$/.test(text)) {
                                                        this.setValue(prev);
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('defect_qty'),
                                            width: '96%',
                                            name: 'defect_qty',
                                            value: 0,
                                            fieldLabel: '불량수량'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: gu.id('punchingQty'),
                                            width: '96%',
                                            name: 'punchingQty',
                                            value: 0,
                                            fieldLabel: '공타수량'
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
                        }
                    );

                    // 기본수량 설정
                    let processQty = selection.get(/*pcs_codes[0].code*/processCode + '0' + '|process_qty');
                    let outpcsQty = selection.get(/*pcs_codes[0].code*/processCode + '0' + '|outpcs_qty');
                    defaultQty = processQty - outpcsQty < 0 ? 0 : processQty - outpcsQty;

                    gu.getCmp('complete_qty').setValue(defaultQty);

                    let prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: gm.getMC('CMD_Work_Qty', '실적등록'),
                        width: 800,
                        height: 400,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {

                                    let selectionSub = gm.me().currentTab.getSelectionModel().getSelection()[0];

                                    let do_complete = gu.getCmp('do_complete').getValue();
                                    let complete_qty = gu.getCmp('complete_qty').getValue();
                                    let pcsCodeGroup = gu.getCmp('pcsCodeGroup').getValue();
                                    let defectQytSub = gu.getCmp('defect_qty').getValue();
                                    let punchingQty = gu.getCmp('punchingQty').getValue();
                                    let ref_date = gu.getCmp('ref_date').getValue();
                                    let process_date = gu.getCmp('process_date').getValue();
                                    let process_time = gu.getCmp('process_time').getValue();

                                    let work_type = gu.getCmp('work_type').getValue();

                                    let isExceedQty = complete_qty > defaultQty;
                                    let isEqualQty = defaultQty === complete_qty;

                                    let pcsCodesSub = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                                    let isExceedPreStep = false;
                                    let isDefect_qty = false;

                                    for (let pcsCodesSubPos = 0; pcsCodesSubPos < pcsCodesSub.length; pcsCodesSubPos++) {

                                        let stepUid = selectionSub.get(processCode + pcsCodesSubPos + '|step_uid');

                                        if (Number(stepUid) === pcsCodeGroup.pcs_radio - 1) {

                                            let outpcsQtySub = selectionSub.get(processCode + pcsCodesSubPos + '|outpcs_qty');

                                            if (complete_qty > outpcsQtySub) {
                                                isExceedPreStep = true;
                                            }

                                        }
                                    }
                                    if (defectQytSub > complete_qty) {
                                        isDefect_qty = 1;
                                    }
                                    let defect_qty = gu.getCmp('defect_qty').getValue();

                                    let msg;

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

                                    if (vCompanyReserved4 === 'HSST01KR' || vCompanyReserved4 === 'WOWT01KR' || vCompanyReserved4 === 'YNJU01KR') {
                                        Ext.MessageBox.show({
                                            title: '확인',
                                            msg: msg,
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function (result) {
                                                if (result === 'yes') {

                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/index/process.do?method=processAndCompleteQtyWithStock',
                                                        params: {
                                                            'pcsstep_uid': pcsCodeGroup.pcs_radio,
                                                            'gr_quan': complete_qty,
                                                            'do_complete': do_complete,
                                                            'ref_date': ref_date,
                                                            'process_date': process_date,
                                                            'process_time': process_time,
                                                            'defect_qty': defect_qty,
                                                            'work_type': work_type,
                                                            'punchingQty': punchingQty
                                                        },

                                                        success: function () {
                                                            Ext.Msg.alert('안내', '해당 공정의 수량이 처리 되었습니다.');
                                                            prWin.close();
                                                            gm.me().redrawStore();
                                                        },//endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });//endofajax

                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    } else {
                                        if (isDefect_qty) {
                                            Ext.Msg.alert('', '불량 입력 수량이 진행수량 수량보다 많습니다.');
                                        } else {
                                            if (!isExceedPreStep) {
                                                Ext.MessageBox.show({
                                                    title: '확인',
                                                    msg: msg,
                                                    buttons: Ext.MessageBox.YESNO,
                                                    fn: function (result) {
                                                        if (result === 'yes') {

                                                            Ext.Ajax.request({
                                                                url: CONTEXT_PATH + '/index/process.do?method=processAndCompleteQtyWithStock',
                                                                params: {
                                                                    'pcsstep_uid': pcsCodeGroup.pcs_radio,
                                                                    'gr_quan': complete_qty,
                                                                    'do_complete': do_complete,
                                                                    'ref_date': ref_date,
                                                                    'process_date': process_date,
                                                                    'process_time': process_time,
                                                                    'defect_qty': defect_qty,
                                                                    'work_type': work_type
                                                                },

                                                                success: function () {
                                                                    Ext.Msg.alert('안내', '해당 공정의 수량이 처리 되었습니다.');
                                                                    prWin.close();
                                                                    gm.me().redrawStore();
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

        this.backToPrdPlan = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: this.getMC('CMD_CANCEL_ORDER', '지시취소'),
            tooltip: '생산대기 상태의 건을 작업지시 전 상태로 변경합니다.',
            disabled: true,
            handler: function () {
                let selection = selected_rec;
                let rec = selection[0];
                let state = rec.get('rtgast_od_state');
                if (state === 'P') {
                    Ext.MessageBox.show({
                        title: '',
                        msg: '선택 한 건을 작업지시 전 상태로 변경하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn !== "no") {
                                let rtgast_uid = rec.get('rtgast_od_uid');
                                let cartmap_uid = rec.get('unique_id');
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=cancelProduction',
                                    params: {
                                        rtgast_uid: rtgast_uid,
                                        cartmap_uid: cartmap_uid
                                    },
                                    success: function () {
                                        Ext.MessageBox.alert('알림', '해당 건이 상태가 변경되었습니다.');
                                        gm.me().currentTab.getStore().load();
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
            }
        });

        if (vCompanyReserved4 === 'SSCC01KR') {
            buttonToolbar.insert(1, this.doProcessAction);
        }

        if (this.flag1 === 'Y') {
            buttonToolbar.insert(1, this.doProductionAction);
            buttonToolbar.insert(2, this.inAction);
            buttonToolbar.insert(3, this.backToPrdPlan);
        } else {
            buttonToolbar.insert(1, this.barcodePrintAction);
            buttonToolbar.insert(1, this.doProductionAction);
            buttonToolbar.insert(2, this.inAction);
        }

        this.LabelSizeStore = Ext.create('Mplm.store.LabelSizeStore');

        // buttonToolbar.insert(2, '->');
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            gm.me().selected_rec = selections;

            let codeSub = gm.me().selected_tab;

            if (codeSub !== undefined) {
                gm.me().tab_selections[codeSub] = selections;
            }

            let quan = 0;

            for (let selection of selections) {
                quan += selection.get('bm_quan');
            }

            let toolbarSub = null;
            let itemsSub = null;
            if (codeSub !== undefined) {
                let infos = gm.me().tab_info;
                if (infos != null) {

                    for (let obj of infos) {

                        if (obj['code'] === codeSub) {
                            let toolbars = obj['toolbars'];
                            switch (vCompanyReserved4) {
                                case 'KBTC01KR':
                                case 'HJSV01KR':
                                case 'WOWT01KR':
                                case 'MSTP01KR':
                                case 'HSST01KR':
                                case 'KMCA01KR':
                                case 'YNJU01KR':
                                case 'SSCC01KR':
                                case 'DMEC01KR':
                                    toolbarSub = toolbars[1];
                                    break;
                                default:
                                    toolbarSub = toolbars[0];
                            }

                            itemsSub = toolbarSub.items.items;
                        }
                    }
                }
            }

            if (selections.length) {

                let rec = selections[0];

                gu.enable(gm.me().removeAction);
                gu.enable(gm.me().editAction);
                gu.enable(gm.me().properInputAction);
                gu.enable(gm.me().barcodePrintAction);
                gu.enable(gm.me().moldidAction);
                gu.enable(gm.me().minLotAction);
                gu.enable(gm.me().backToPrdPlan);
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gm.me().vSELECTED_PJ_CODE = rec.get('pj_code');
                gm.me().vSELECTED_PJ_CODE = gu.stripHighlight(gm.me().vSELECTED_PJ_CODE);
                gm.me().pj_code = gm.me().vSELECTED_PJ_CODE + "-";

                if (itemsSub != null) {
                    for (let itemSub of itemsSub) {
                        gu.enable(itemSub);
                    }
                }

            } else {
                gu.disable(gm.me().removeAction);
                gu.disable(gm.me().editAction);
                gu.disable(gm.me().properInputAction);
                gu.disable(gm.me().moldidAction);
                gu.disable(gm.me().minLotAction);
                gu.disable(gm.me().backToPrdPlan);
                gu.disable(gm.me().barcodePrintAction);
                if (itemsSub != null) {
                    for (let itemSub of itemsSub) {
                        gu.disable(itemSub);
                    }
                }
            }

        });
        this.createCrudTab();
        //Tab을 만들지 않는 경우.

        if (this.tab_info.length === 0) {
            Ext.apply(this, {
                layout: 'border',
                items: [this.grid, this.crudTab]
            });
            this.callParent(arguments);
            //디폴트 로드
            gMain.setCenterLoading(true);
            this.grid.store.getProxy().setExtraParam('orderBy', 'unique_id');
            this.grid.store.getProxy().setExtraParam('ascDesc', 'ASC');
            this.storeLoad(function (records) {
                for (let record of records) {
                    let specunit = record.get('specification');
                    gm.me().spec.push(specunit);
                }
            });
        } else { //Tab그리드를 사용하는 경우.
            this.grid.setTitle('전체');
            let items = [];
            items.push(this.grid);
            let tab = this.createTabGrid('Rfx2.model.company.bioprotech.ProduceWork', items, 'big_pcs_code', arr, function (curTab) {
                gm.me().currentTab = curTab;
                let multi_grid_id = curTab.multi_grid_id;
                gm.me().multi_grid_id = multi_grid_id;
                if (multi_grid_id === undefined) { //Main grid
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);
                    switch (vCompanyReserved4) {
                        case 'KBTC01KR':
                        case 'HJSV01KR':
                        case 'WOWT01KR':
                        case 'HSST01KR':
                        case 'MSTP01KR':
                        case 'KMCA01KR':
                        case 'YNJU01KR':
                        case 'SSCC01KR':
                        case 'DMEC01KR':
                            gm.me().store.getProxy().setExtraParam('recv_flag', 'GE');
                            gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                            gm.me().store.getProxy().setExtraParam('js_pcs_code', null);
                            break;
                        default:
                            break;
                    }
                    gm.me().storeLoad();
                } else {//추가 탭그리드
                    let store = gm.me().store_map[multi_grid_id];
                    store.getProxy().setExtraParam('big_pcs_code', multi_grid_id);
                    store.getProxy().setExtraParam('status', null);
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);

                    if (multi_grid_id === 'STL') {
                        gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                    }
                    gm.me().storeLoad();
                }
            });
            //모든 스토어에 디폴트 조건
            Ext.apply(this, {
                layout: 'border',
                items: [tab]
            });
            this.callParent(arguments);
            //디폴트 로드
            gMain.setCenterLoading(false);
        }
    },

    selectPcsRecord: null,
    items: [],
    potype: 'PRD',
    pj_code: null,
    spec: [],
    processInput: function () {
        let form = Ext.create('Ext.form.Panel', {
            id: gu.id(gu.id('formPanel')),
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
                margins: 10,
            },
            items: [{
                xtype: 'fieldset',
                title: '입력',
                margin: '3',

                defaults: {
                    anchor: '100%',
                },
                items: [{
                    xtype: 'container',

                    layout: 'hbox',
                    defaults: {
                        //margin: '5'
                        margin: '0, 3, 3, 0,'

                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [{
                            xtype: 'textarea',
                            width: 250,
                            height: 300,
                            name: 'barcodes',
                            fieldLabel: '바코드번호'
                        }]
                    },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [{
                                id: 'process_name',
                                width: 300,
                                xtype: 'radiogroup',
                                fieldLabel: '공정선택',
                                // Arrange radio buttons into three columns, distributed vertically
                                columns: 1,
                                vertical: true,
                                items: [
                                    {boxLabel: '제작', name: 'pcs_code', inputValue: 'PRD'},
                                    {boxLabel: '도금', name: 'pcs_code', inputValue: 'GLT'},
                                    {boxLabel: '도장', name: 'pcs_code', inputValue: 'PNT'},
                                ]
                            }
                            ]

                        }]
                }]
            }
            ]
        });//Panel end...
        prwin = gm.me().prwinbarcodeopen(form);
    },

    attributeInput: function () {

        let tab_code = gm.me().multi_grid_id;

        let fields = (tab_code === undefined) ? this.fields : this.fields_map[tab_code];

        let oItems = [];

        let line = 0;
        let arr = [];

        for (let obj of fields) {

            if (obj['canEdit']) {

                if (line % 3 === 0) {
                    oItems.push(arr);
                    arr = [];

                }
                let xtype = null;
                switch (obj['type']) {
                    case 'sdate':
                    case 'date':
                        xtype = 'datefield';
                        break;
                    case 'number':
                    case 'digit':
                    case 'integer':
                        xtype = 'numberfield';
                        break;
                    default:
                        xtype = 'textfield';

                }
                let objSub = {

                    xtype: xtype,
                    width: 250,
                    name: obj['name'],
                    fieldLabel: obj['text']
                };
                switch (obj['type']) {
                    case 'sdate':
                    case 'date':
                        objSub['value'] = '';
                        break;
                    default:

                }

                arr.push(objSub);

                line++;
            }
        }

        if (objSub != null) {
            oItems.push(objSub);
        }

        let items = [];

        for (let oItem of oItems) {
            items.push({
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    margin: '0, 5, 5, 0,',
                    items: oItem
                },
                items: oItem
            });
        }

        let form = Ext.create('Ext.form.Panel', {
            id: gu.id(gu.id('formPanel')),
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
                margins: 10,
            },
            items: items

        });//Panel end...
        prwin = gm.me().prwinopen(form);

    },

    getPcsRadio: function () {

        let arr = [];

        let n = 0;

        for (let obj of gu.mesTplProcessBig) {

            let pcsCode = obj['code'];
            let pcsTemplate = obj['pcsTemplate'];
            let o1 = gu.mesTplProcessAll;
            let subArr = o1[pcsCode];

            let big_pcs_code = 'SPL';
            if (pcsTemplate === big_pcs_code) {
                let pcsnames = ''

                for (let objSub of subArr) {

                    if (pcsnames !== '') {
                        pcsnames = pcsnames + ' -> ';
                    }
                    pcsnames = pcsnames + objSub['name'];
                }

                arr.push({
                    inputValue: obj['code'],
                    boxLabel: obj['name'] + '  (' + pcsnames + ')',
                    name: 'big_pcs_code',
                    checked: n === 0,
                    listeners: {
                        change: function (radiogroup, radio, checked) {
                            Ext.MessageBox.alert('click', checked);
                        }
                    }
                });
                n++;
            }
        }
        return arr;
    },

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
                    let formSub = gu.getCmp(gu.id('formPanel')).getForm();
                    let srcahd_uids = [];
                    selections = selected_rec;

                    for (let rec of selections) {
                        let uid = rec.get('itemdetail_uid');
                        srcahd_uids.push(uid);
                    }

                    formSub.submit({
                        url: CONTEXT_PATH + '/index/process.do?method=updateItemdetail',
                        params: {
                            srcahduids: srcahd_uids
                        },
                        success: function () {
                            prWin.close();
                            gm.me().storeLoad();
                        },
                        failure: function () {
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

    prwinbarcodeopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드로 처리',
            plain: true,
            items: form,
            margin: 5,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    let formSub = gu.getCmp(gu.id('formPanel')).getForm();
                    formSub.submit({
                        url: CONTEXT_PATH + '/index/process.do?method=updateProcessWork',

                        success: function () {
                            prWin.close();
                            gm.me().storeLoad();
                        },
                        failure: function () {
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

    specConfirm: function () {

        let form = Ext.create('Ext.form.Panel', {
            id: 'formPanel-spec',
            xtype: 'form',
            bodyPadding: '3 3 0',
            region: 'center',
            items: [
                {
                    xtype: 'textareafield',
                    width: 300,
                    height: 300,
                    value: gm.me().spec
                }
            ]
        });

        this.specwinopen(form);

    },

    extoutJson: function (multi_grid_id, records) {
        if (records == null || records.length === 0) {
            return;
        }
        let big_pcs_code = multi_grid_id === undefined ? 'SSP' : multi_grid_id;
        let smallPcs = gu.mesTplProcessAll[big_pcs_code];
        let column_name = ['end_date', 'step_uid'];
        for (let k = 0; k < 2; k++) {
            let fNameLocal = column_name[k];
            if (smallPcs != null && smallPcs.length > 0) {
                for (let obj of smallPcs) {
                    let pcsCode = obj['code'];

                    for (let objSub of records) {
                        objSub.set(pcsCode + '|' + fNameLocal, null);
                    }
                }
            }

            for (let obj of records) {
                obj.set('update_pcsstep_and_work', 'FULL_MAKE');//공정처리
                let js_fname = obj.get('js_' + fNameLocal);
                for (let key in js_fname) {
                    let arr = js_fname[key];
                    if (arr instanceof Array) {
                        obj.set(key + '|' + fNameLocal, arr[0]);
                    } else {
                        obj.set(key + '|' + fNameLocal, arr);
                    }
                }
            }
        }
    },
    addExtraColumnBypcscode: function (myColumn, myField, big_pcs_code, temp_code, step_field, editable, pos) {

        let smallPcs = gu.mesTplProcessAll[big_pcs_code];
        if (smallPcs === undefined || smallPcs.length === 0) {
            return;
        }
        //복사대상

        let column = myColumn[0];
       
        let field = myField[0];
        for (let j = 0; j < smallPcs.length; j++) {
            for (let k = 1; k < 2; k++) {
                let o = smallPcs[j];
                let new_c = {};
                for (let columnKey in column) {
                    switch (columnKey) {
                        case 'dataIndex':
                            new_c[columnKey] = o['code'] + '|' + (k % 2 === 0 ? 'start_date' : 'end_date');
                            break;
                        case 'text':
                            new_c[columnKey] = o['name'] + (k % 2 === 0 ? ' 시작' : ''/*' 완료'*/);
                            break;
                        default:
                            new_c[columnKey] = column[columnKey];

                    }
                }
                let new_f = {};
                for (let fieldKey in field) {
                    switch (fieldKey) {
                        case 'text':
                            new_f[fieldKey] = o['name'];
                            break;
                        case 'name':
                            new_f[fieldKey] = o['code'] + '|' + (k % 2 === 0 ? 'start_date' : 'end_date');
                            break;
                        default:
                            new_f[fieldKey] = field[fieldKey];
                    }
                }

                new_c['canEdit'] = editable;
                new_c['dataType'] = 'sdate';
                new_c['important'] = true;
                new_c['id'] = 'uid-' + Math.floor((Math.random() * 10000000000) + 1);
                new_f['tableName'] = 'pcsstep';
                new_f['type'] = 'date';
                new_f['useYn'] = 'Y';
                new_c['width'] = 50 + (new_c['text'].length * 10);
                myColumn.splice(pos + (j /** 2*/) + k, 0, new_c);
                myField.splice(pos + (j /** 2*/) + k, 0, new_f);
            }
        }

    },

    specwinopen: function (form) {
        let specwin = Ext.create('Ext.Window', {
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
    //10일 이전:초록, 5일이전 노랑 3일이전 빨강. 지나면 검정
    highlightCell: function (o, gap, value, field) {
        if (gap !== '') {
            let n = Number(gap);
            let background;
            let color;

            if (n > 9) {
                background = '#6CB33E';
                color = 'white';
            } else if (n > 5 && n < 10) {
                background = '#FFE8A6';
                color = 'black';
            } else if (n < 4 && n > -1) {
                background = '#E82030';
                color = 'white';
            } else {
                background = '#333333';
                color = 'white';
            }

            o.set(field, '<span style="background:' + background + ';color:' + color + ';">' + value + '</span>');
        }
    },
    highlightCodes: ['reserved6', 'h_reserved45', 'h_reserved46'],
    multi_grid_id: undefined,

    createPcsToobars: function (code) {
        let buttonItems = [];
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
            width: 100
        });

        let smallPcs = gu.mesTplProcessAll[code];
        if (smallPcs != null && smallPcs.length > 0) {

            for (let obj of smallPcs) {
                let code1 = obj['code'];
                let name1 = obj['name'];

                let action = {
                    xtype: 'button',
                    iconCls: 'af-check',
                    cmpId: code + code1,
                    text: name1,
                    big_pcs_code: code,
                    pcs_code: code1,
                    disabled: true,
                    handler: function () {
                        let text = gm.me().findToolbarCal(this.big_pcs_code);
                        if (text == null) {
                            Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.');
                        } else {
                            let date = text.getValue();
                            let selections = gm.me().tab_selections[this.big_pcs_code];
                            if (selections != null) {
                                let whereValue = [];
                                let field = this.pcs_code + '|' + 'end_date';

                                for (let objSub of selections) {
                                    objSub.set(field, date);
                                    let step_uid = objSub.get(this.pcs_code + '|' + 'step_uid');
                                    whereValue.push(step_uid);
                                }

                                gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue, {type: 'update_pcsstep_and_work'});
                                gm.me().storeLoad();
                            }
                        }
                    }
                };
                buttonItems.push(action);
            }
        }

        let buttonToolbar1 = Ext.create('widget.toolbar', {
            items: buttonItems
        });
        return buttonToolbar1;
    },

    //생산중단
    workOrderStop: function () {
        let code = gm.me().selected_tab;
        let selections = gm.me().tab_selections[code];
        let state = this.vSELECTED_RECORD.get('state');

        let ac_uids = [];
        let cartmapUids = [];

        for (let rec of selections) {
            let uids = rec.get('ac_uid');
            let c_uids = rec.get('coord_key3');
            ac_uids.push(uids);
            cartmapUids.push(c_uids);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=delStopOrder',
            params: {
                ac_uid: ac_uids,
                status: state,
            },
            success: function () {
                gm.me().storeLoad();
                Ext.Msg.alert('안내', '생산작업을 취소하였습니다.');

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    doRequest: function (o) {
        let assymap_uids = [];
        let code = gm.me().selected_tab;
        let selections;
        if (code !== undefined) {
            selections = gm.me().tab_selections[code];
        } else {
            selections = this.grid.getSelectionModel().getSelection();
        }

        for (let rec of selections) {
            let uid = rec.get('unique_id');
            assymap_uids.push(uid);
        }

        o['assymap_uids'] = assymap_uids;
        o['parent_code'] = this.link;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
            params: o,
            success: function () {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.');

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },
    findToolbarCal: function (big_pcs_code) {
        let toolbar = null;
        let items = null;
        if (big_pcs_code !== undefined) {
            let infos = gm.me().tab_info;
            if (infos != null) {
                for (let obj of infos) {
                    if (obj['code'] === big_pcs_code) {
                        let toolbars = obj['toolbars'];
                        switch (vCompanyReserved4) {
                            case 'KBTC01KR':
                            case 'HJSV01KR':
                            case 'WOWT01KR':
                            case 'MSTP01KR':
                            case 'HSST01KR':
                            case 'KMCA01KR':
                            case 'YNJU01KR':
                            case 'SSCC01KR':
                            case 'DMEC01KR':
                                toolbar = toolbars[1];
                                break;
                            default:
                                toolbar = toolbars[0];
                        }
                        items = toolbar.items.items;
                    }
                }
            }
        }

        if (items !== null && items.length > 0) {
            return items[0];
        } else {
            return null;
        }
    },

    tab_selections: {},

    prevTagnoIn: '',
    setCheckname: function (b) {
        this.checkname = b;
        let btn = gu.getCmp('prwinopen-OK-button');
        if (b) {
            btn.enable();
        } else {
            btn.disable();
        }
    },
    madeComboIds: [],

    //storeLoad callback override
    storeLoadCallbackSub: function (records) {
        let multi_grid_id = gm.me().multi_grid_id;
        if (multi_grid_id === undefined) {

            for (let record of records) {
                gm.me().spec.push(record.get('specification'));
            }
        }
        gm.me().extoutJson(multi_grid_id, records, null);
    },

    addProcessButtonKynl: function (smallPcs, code, buttonItems, i) {
        if (smallPcs != null && smallPcs.length > 0) {
            let o1 = smallPcs[i];
            let code1 = o1['code'];
            let name1 = o1['name'];

            let action = {
                xtype: 'button',
                iconCls: 'af-check',
                cmpId: code + code1,
                text: name1 + '완료일',
                big_pcs_code: code,
                pcs_code: code1,
                disabled: true,
                handler: function () {
                    gMain.setCenterLoading(true);
                    let text = gm.me().findToolbarCal(this.big_pcs_code);
                    if (text == null) {
                        Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.');
                    } else {
                        let date = text.getValue();
                        let selections = gm.me().tab_selections[this.big_pcs_code];
                        if (selections != null) {
                            let whereValue = [];
                            let field = this.pcs_code + '|' + 'end_date';

                            for (let obj of selections) {
                                obj.set(field, date);
                                let step_uid = obj.get(this.pcs_code + '|' + 'step_uid');
                                whereValue.push(step_uid);
                            }

                            gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue, {type: 'update_pcsstep_and_work'});

                            gm.me().currentTab.getStore().load();
                        }
                    }
                }
            };
            buttonItems.push(action);
        }
    },

    getThirtyMinites: function (time) {

        let hour = time.getHours();
        let minute = time.getMinutes();

        if (minute >= 30) {
            return hour + ':30';
        } else {
            return hour + ':00';
        }
    },

    setRefDate: function () {
        let work_type = gu.getCmp('work_type').getValue().work_type;

        let process_date;

        if (work_type === 'night') {
            let process_time = gu.getCmp('process_time').getValue();
            let hour = process_time.getHours();
            process_date = new Date(gu.getCmp('process_date').getValue());

            if (hour < 12) {
                process_date.setDate(process_date.getDate() - 1);
            }

            gu.getCmp('ref_date').setValue(process_date);
        } else {
            process_date = new Date(gu.getCmp('process_date').getValue());
            gu.getCmp('ref_date').setValue(process_date);
        }
    },

    printBarcode: function () {
        let form = null;
        let cartmapArr = [];
        let itemCodeArr = [];
        let itemNameArr = [];
        let combstArr = [];
        let orderNumArr = [];
        let selections;

        if (gm.me().multi_grid_id !== undefined) {
            selections = gm.me().tab_selections[gm.me().multi_grid_id];
        } else {
            selections = gm.me().grid.getSelectionModel().getSelection();
        }
        if (selections.length > 1) {
            Ext.Msg.alert('', '하나의 제품을 선택하시기 바랍니다.');
        } else {
            form = Ext.create('Ext.form.Panel', {
                id: gu.id('formPanel'),
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: '3 3 3',
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
                items: [
                    {
                        xtype: 'fieldset',
                        title: '입력',
                        collapsible: true,
                        defaults: {
                            labelWidth: 75,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                id: 'print_qty',
                                name: 'print_qty',
                                fieldLabel: '출력매수',
                                margin: '3 3 3 3',
                                width: 200,
                                allowBlank: false,
                                value: 1
                            },
                            {
                                xtype: 'combobox',
                                id: 'label_size',
                                name: 'label_size',
                                fieldLabel: '라벨사이즈',
                                store: gm.me().LabelSizeStore,
                                margin: '3 3 3 3',
                                width: 200,
                                allowBlank: false,
                                displayField: 'system_code',
                                valueField: 'system_code',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{code_name_kr}">{code_name_kr}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (grid, data) {
                                        Ext.getCmp('label_size').setValue(data.get('system_code'));
                                    }
                                }
                            },
                            {
                                xtype: 'datefield',
                                name: 'end_date',
                                id: gu.id('end_date'),
                                fieldLabel: '생산종료일',
                                hideTrigger: false,
                                keyNavEnabled: true,
                                format: 'Y-m-d',
                                margin: '3 3 3 3',
                                width: 200,
                                mouseWheelEnabled: true,
                                editable: true,
                                listeners: {}
                            },
                        ]
                    }
                ]
            });//Panel end...

            for (let recSub of selections) {
                cartmapArr.push(recSub.get('unique_id_long'));
                if (recSub.get('item_code') === null) {
                    itemCodeArr.push('unknown');
                } else {
                    itemCodeArr.push(recSub.get('item_code'));
                }
                if (recSub.get('item_name') === null) {
                    itemNameArr.push('unknown');
                } else {
                    itemNameArr.push(recSub.get('item_name'));
                }
                combstArr.push(recSub.get('customer_name'));
                orderNumArr.push(recSub.get('orderNumber'));
            }

            if (cartmapArr.length > 0) {
                prwin = gMain.selPanel.prbarcodeopen(form, cartmapArr, itemCodeArr, itemNameArr, combstArr, orderNumArr);
            }
        }
    },

    prbarcodeopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    let selections = gm.me().grid.getSelectionModel().getSelection();

                    let cartmapUidArr = [];
                    let srcahdUidArr = [];
                    let itemNameArrSub = [];
                    let itemCodeArrSub = [];
                    let specificationArr = [];
                    let qtyArr = [];
                    let customerArr = [];

                    for (let rec of selections) {
                        let cartmap_uid = rec.get('unique_id_long');
                        let child = rec.get('child');
                        let item_name = rec.get('item_name');
                        let item_code = rec.get('item_code');
                        let specification = rec.get('specification');
                        let order_quan = rec.get('pr_quan');
                        let final_wa_name = rec.get('customer_name');

                        cartmapUidArr.push(cartmap_uid);
                        srcahdUidArr.push(child);
                        itemNameArrSub.push(item_name);
                        itemCodeArrSub.push(item_code);
                        specificationArr.push(specification);
                        qtyArr.push(order_quan);
                        customerArr.push(final_wa_name);
                    }

                    let formSub = gu.getCmp('formPanel').getForm();
                    let val = formSub.getValues(false);

                    formSub.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printDataMatrixBarcode',
                        params: {
                            barcodeUidArr: cartmapUidArr,
                            print_type: 'CARTMAP_PRD', //생산바코드로 단품(제품)출하
                            print_qty: val.print_qty,
                            end_date: val.end_date,
                            srcahdUidArr: srcahdUidArr,
                            itemNameArr: itemNameArrSub,
                            itemCodeArr: itemCodeArrSub,
                            specificationArr: specificationArr,
                            qtyArr: qtyArr,
                            customerArr: customerArr
                        },
                        success: function () {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                            gMain.selPanel.store.load();
                        },
                        failure: function () {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load();
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

    doProcessForm: function () {
        let selection = gm.me().grid.getSelectionModel().getSelection()[0];

        let processAll = gu.mesTplProcessAll[selection.get('po_type')];

        let mixName = selection.get('item_code') + '|배합';
        let mixMass = 0;

        let formList = [];

        this.innerStores = [];
        this.innerGrids = [];

        let bigPcsCode = '';

        for (let i = 0; i < processAll.length; i++) {
            let preSmallPcs = i === 0 ? null : processAll[i - 1];
            let smallPcs = processAll[i];

            let prePcsCode = i === 0 ? null : preSmallPcs['code'].split('-')[1];
            let pcsCode = smallPcs['code'].split('-')[1];

            if (i === processAll.length - 1) {
                gm.me().lastProcess = pcsCode;
            }

            if (i === 0) {

                bigPcsCode = smallPcs['parent_code'];

                this.innerStores.push(new Ext.create('Ext.data.Store', {
                    proxy: {
                        type: 'ajax',
                        url: CONTEXT_PATH + '/design/bom.do?method=cloudread',
                        reader: {
                            type: 'json',
                            root: 'datas',
                            totalProperty: 'count',
                            successProperty: 'success'
                        }
                    },
                    autoLoad: false
                }));

                gm.me().innerStores[i].getProxy().setExtraParams({
                    parent_uid: selection.get('assymap_uid'),
                    reserved_integer4: 2,
                    is_new: 'Y',
                    orderBy: 'reserved_integer3',
                    ascDesc: 'ASC',
                    ac_uid: selection.get('ac_uid'),
                    limit: 10000,
                    prdplan_uid: selection.get('assymap_uid')
                });

                this.innerGrids.push(Ext.create('Ext.grid.Panel', {
                    store: this.innerStores[i],
                    id: gu.id('innerGrids_' + pcsCode),
                    style: 'padding-left:10px;padding-right:10px;',
                    width: '100%',
                    height: 200,
                    scroll: true,
                    columns: [
                        {text: '원재료', width: 300, dataIndex: 'item_name'},
                        {text: '단위', width: 100, dataIndex: 'unit_code'},
                        {text: '소모량', width: 100, dataIndex: 'bm_quan'},
                        {text: '단가', width: 100, dataIndex: 'sales_price'}
                    ],
                    border: false,
                    multiSelect: true,
                    frame: false,
                    forceFit: true,
                    dockedItems: []
                }));
            } else {
                this.innerStores.push(new Ext.create('Ext.data.Store', {
                    proxy: {
                        type: 'ajax',
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=readDetailStockTest',
                        reader: {
                            type: 'json',
                            root: 'datas',
                            totalProperty: 'count',
                            successProperty: 'success'
                        }
                    },
                    autoLoad: false
                }));

                let srchICodeComb = '';

                if (prePcsCode === 'MIX') {
                    srchICodeComb = '|배합';
                } else if (prePcsCode === 'EXT') {
                    srchICodeComb = '|압출';
                } else if (prePcsCode === 'PRT') {
                    srchICodeComb = '|인쇄';
                }


                gm.me().innerStores[i].getProxy().setExtraParams({
                    'item_code': '%' + selection.get('item_code') + '%',
                    'srchICodeComb': '%' + srchICodeComb + '%'
                });

                this.innerGrids.push(Ext.create('Ext.grid.Panel', {
                    store: this.innerStores[i],
                    id: gu.id('innerGrids_' + pcsCode),
                    style: 'padding-left:10px;padding-right:10px;',
                    width: '100%',
                    height: 200,
                    scroll: true,
                    columns: [
                        {text: '원재료', width: 300, dataIndex: 'item_code'},
                        {text: '단위', width: 100, dataIndex: 'unit_code'},
                        {text: '잔량', width: 100, dataIndex: 'dtl_qty'},
                        {text: '단가', width: 100, dataIndex: 'sales_price'}
                    ],
                    border: false,
                    multiSelect: true,
                    frame: false,
                    forceFit: true,
                    dockedItems: []
                }));
            }

            switch (pcsCode) {
                case 'MIX':
                    let formMIX = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanelMIX'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        title: '배합',
                        bodyPadding: '3 3 0',
                        region: 'center',
                        autoScroll: true,
                        width: 800,
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'right'
                                },
                                width: '100%',
                                items: [
                                    this.innerGrids[i],
                                    {
                                        xtype: 'container',
                                        style: {
                                            background: '#EAEAEA',
                                            'text-align': 'right'
                                        },
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                            align: 'middle'
                                        },
                                        width: '100%',
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: '원재료'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '→'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '16px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: mixName
                                            },
                                            {
                                                xtype: 'label',
                                                id: gu.id('mixMass'),
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 0 + ' kg'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '잔량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                id: gu.id('remainMass'),
                                                height: 40,
                                                readOnly: true,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                },
                                                value: 0
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '사용량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                id: gu.id('insertMass'),
                                                height: 40,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                }
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    }
                                ]
                            }/*)*/
                        ]//item end..
                    });//Panel end...

                    let mixMass = selection.get('reserved_double1');
                    let remainMass = selection.get('reserved_double2');

                    gm.me().innerStores[i].load(function (records) {

                        gu.getCmp('mixMass').setText(Ext.util.Format.number(mixMass, '0,00/i') + ' kg');
                        gu.getCmp('remainMass').setValue(Ext.util.Format.number(remainMass, '0,00/i'));
                    });
                    formList.push(formMIX);
                    break;
                case 'EXT':

                    let extGrid = Ext.create('Ext.grid.Panel', {
                        store: new Ext.data.Store(),
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        id: gu.id('extGrid'),
                        height: 200,
                        scroll: true,
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 2,
                        },
                        columns: [
                            {text: '재공명', width: 300, dataIndex: 'item_code'},
                            {
                                text: '폭', width: 100, dataIndex: 'width',
                                editor: 'numberfield'
                            },
                            {text: '계산 중량', width: 100, dataIndex: 'extQuan'}
                        ],
                        listeners: {
                            edit: function (editor, e) {
                                if (e.field === 'width') {
                                    let value = e.value;
                                    let specification = 1;
                                    let item_code = selection.get('item_code');
                                    this.store.getAt(e.rowIdx).set('item_code', item_code + '|압출|' + value + 'mm');
                                    this.store.getAt(e.rowIdx).set('extQuan', value * specification);

                                    let totalExtMass = 0;

                                    for (let k = 0; k < this.store.getCount(); k++) {
                                        totalExtMass += this.store.getAt(k).get('extQuan');
                                    }

                                    gu.getCmp('insertMassExt').setValue(totalExtMass);
                                }
                            }
                        },
                        border: false,
                        multiSelect: true,
                        frame: false,
                        forceFit: true,
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default2',
                                items: [
                                    Ext.create('Ext.Action', {
                                        iconCls: 'af-plus',
                                        text: '추가',
                                        handler: function() {
                                            gu.getCmp('extGrid').getStore().add({
                                                'item_code': selection.get('item_code') + '|압출|0mm'
                                            });
                                        }
                                    }),
                                    Ext.create('Ext.Action', {
                                        iconCls: 'af-remove',
                                        text: '삭제',
                                        handler: function () {

                                        }
                                    })
                                ]
                            }]
                    });

                    let formEXT = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanelEXT'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        title: '압출',
                        bodyPadding: '3 3 0',
                        region: 'center',
                        autoScroll: true,
                        width: 800,
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'right'
                                },
                                width: '100%',
                                items: [
                                    this.innerGrids[i],
                                    {
                                        xtype: 'container',
                                        style: {
                                            background: '#EAEAEA',
                                            'text-align': 'right'
                                        },
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                            align: 'middle'
                                        },
                                        width: '100%',
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: '배합재공'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '→'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: selection.get('item_code') + '|압출'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: ' 10R/L'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '잔량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                id: gu.id('remainMassExt'),
                                                height: 40,
                                                readOnly: true,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                },
                                                value: 0
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '총사용량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                id: gu.id('insertMassExt'),
                                                height: 40,
                                                readOnly: true,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                },
                                                value: 0
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    },
                                    extGrid
                                ]
                            }/*)*/
                        ]//item end..
                    });//Panel end...
                    gm.me().innerStores[i].load(function (records) {
                        if (records.length > 0) {
                            gu.getCmp('remainMassExt').setValue(records[0].get('dtl_qty'));
                        }
                    });
                    formList.push(formEXT);
                    break;
                case 'SLT':
                    let formSLT = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanelSLT'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        title: '슬리팅',
                        bodyPadding: '3 3 0',
                        region: 'center',
                        autoScroll: true,
                        width: 800,
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'right'
                                },
                                width: '100%',
                                items: [
                                    this.innerGrids[i],
                                    {
                                        xtype: 'container',
                                        style: {
                                            background: '#EAEAEA',
                                            'text-align': 'right'
                                        },
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                            align: 'middle'
                                        },
                                        width: '100%',
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: 'OD12345678 LG화학|압출'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '→'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: '50×1500×20 LG화학|인쇄'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: ' 10R/L'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '잔량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                height: 40,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                },
                                                id: gu.id('remainMassSlt'),
                                                value: 0
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '사용량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                id: gu.id('insertMassSlt'),
                                                height: 40,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                }
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    }
                                ]
                            }
                        ]//item end..
                    });//Panel end...
                    gm.me().innerStores[i].load(function (records) {
                        if (records.length > 0) {
                            gu.getCmp('remainMassSlt').setValue(records[0].get('dtl_qty'));
                        }
                    });
                    formList.push(formSLT);
                    break;
                case 'PRT':
                    let formPRT = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanelPRT'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        title: '인쇄',
                        bodyPadding: '3 3 0',
                        region: 'center',
                        autoScroll: true,
                        width: 800,
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'right'
                                },
                                width: '100%',
                                items: [
                                    this.innerGrids[i],
                                    {
                                        xtype: 'container',
                                        style: {
                                            background: '#EAEAEA',
                                            'text-align': 'right'
                                        },
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                            align: 'middle'
                                        },
                                        width: '100%',
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: 'OD12345678 LG화학|압출'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '→'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: '50×1500×20 LG화학|인쇄'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: ' 10R/L'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '잔량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                height: 40,
                                                id: gu.id('remainMassPrt'),
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                },
                                                value: '1,500'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '사용량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                id: gu.id('insertMassPrt'),
                                                height: 40,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                }
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    }
                                ]
                            }
                        ]//item end..
                    });//Panel end...
                    gm.me().innerStores[i].load(function (records) {
                        if (records.length > 0) {
                            gu.getCmp('remainMassPrt').setValue(records[0].get('dtl_qty'));
                        }
                    });
                    formList.push(formPRT);
                    break;
                case 'RSL':

                    let formRSL = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanelRSL'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        title: '슬리팅(재)',
                        bodyPadding: '3 3 0',
                        region: 'center',
                        autoScroll: true,
                        width: 800,
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'right'
                                },
                                width: '100%',
                                items: [
                                    this.innerGrids[i],
                                    {
                                        xtype: 'container',
                                        style: {
                                            background: '#EAEAEA',
                                            'text-align': 'right'
                                        },
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                            align: 'middle'
                                        },
                                        width: '100%',
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: 'OD12345678 LG화학|압출'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '→'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 40,
                                                padding: '10 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'background': '#333333',
                                                    'color': 'white',
                                                    'border-radius': '5px'
                                                },
                                                text: '50×1500×20 LG화학|인쇄'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: ' 10R/L'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '잔량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                height: 40,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                },
                                                value: '1,500'
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '15 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'right',
                                            align: 'middle'
                                        },
                                        height: 50,
                                        items: [
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: '사용량'
                                            },
                                            {
                                                xtype: 'textfield',
                                                labelWidth: '30%',
                                                height: 40,
                                                fieldStyle: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold',
                                                    'text-align': 'right'
                                                }
                                            },
                                            {
                                                xtype: 'label',
                                                labelWidth: '30%',
                                                height: 50,
                                                padding: '20 10 10 10',
                                                style: {
                                                    'font-size': '24px',
                                                    'font-weight': 'bold'
                                                },
                                                text: 'kg'
                                            }]
                                    }
                                ]
                            }
                            /*  )*/
                        ]//item end..
                    });//Panel end...
                    formList.push(formRSL);
                    break;
                default:
                    break;
            }
        }

        this.tabProcess = Ext.create('Ext.tab.Panel', {
            cls: 'rfx-panel',
            id: gu.id('tabProcess'),
            collapsible: false,
            region: 'east',
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            layout: 'vbox',
            forceFit: true,
            flex: 1,
            items: formList,
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    gm.me().currentPopUpTab = tab;
                }
            }
        });

        gm.me().currentPopUpTab = this.tabProcess.items.items[0];

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '공정처리',
            height: 600,
            plain: true,
            items: this.tabProcess,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    let processType = '';
                    let assymapUid = selection.get('assymap_uid');
                    let cartmapUid = selection.get('unique_id_long');
                    let rtgastUid = selection.get('rtgast_od_uid');
                    let srcahdUid = selection.get('child');
                    let originQty = selection.get('reserved_double1');
                    let remainQty = selection.get('reserved_double2');
                    let mixQuan = gu.getCmp('insertMass').getValue();
                    let extQuan = gu.getCmp('insertMassExt').getValue();

                    let extObj = {};
                    let prtObj = {};
                    let sltObj = {};
                    let rstObj = {};

                    let prtQuan = 0;

                    let sltQuan = 0;

                    let rstQuan = 0;

                    switch (gm.me().currentPopUpTab.id) {
                        case gu.id('formPanelMIX'):
                            processType = 'MIX';
                            break;
                        case gu.id('formPanelEXT'):
                            processType = 'EXT';

                            let extPreStore = gu.getCmp('innerGrids_' + processType).getStore();
                            let extAftStore = gu.getCmp('extGrid').getStore();
                            let mixQuanExt = extPreStore.getAt(0).get('dtl_qty');
                            let mixStodtlUid = extPreStore.getAt(0).get('unique_id_long');
                            extObj['mixQuan'] = mixQuanExt;
                            extObj['mixStodtlUid'] = mixStodtlUid;
                            extObj['datas'] = [];

                            for (let extAftPos = 0; extAftPos < extAftStore.getCount(); extAftPos++) {
                                let extObjSub = {};
                                let rec = extAftStore.getAt(extAftPos);
                                extObjSub['itemCodeExt'] = rec.get('item_code');
                                extObjSub['extQuan'] = rec.get('extQuan');
                                extObjSub['width'] = rec.get('width');
                                extObj['datas'].push(extObjSub);
                            }
                            break;
                        case gu.id('formPanelPRT'):
                            processType = 'PRT';

                            let prtPreStore = gu.getCmp('innerGrids_' + processType).getStore();
                            let extQuanPrt = prtPreStore.getAt(0).get('dtl_qty');
                            let extStodtlUid = prtPreStore.getAt(0).get('unique_id_long');
                            let extItemCode = prtPreStore.getAt(0).get('item_code');
                            prtObj['extQuan'] = extQuanPrt;
                            prtObj['extStodtlUid'] = extStodtlUid;
                            prtObj['datas'] = [];

                            let prtObjSub = {};
                            prtObjSub['itemCodePrt'] = extItemCode.replace('압출', '인쇄');
                            prtObjSub['prtQuan'] = gu.getCmp('insertMassPrt').getValue();
                            prtObj['datas'].push(prtObjSub);
                            break;
                        case gu.id('formPanelSLT'):
                            processType = 'SLT';

                            let sltPreStore = gu.getCmp('innerGrids_' + processType).getStore();
                            let prtQuanSlt = sltPreStore.getAt(0).get('dtl_qty');
                            let prtStodtlUid = sltPreStore.getAt(0).get('unique_id_long');
                            let prtItemCode = sltPreStore.getAt(0).get('item_code');
                            sltObj['prtQuan'] = prtQuanSlt;
                            sltObj['prtStodtlUid'] = prtStodtlUid;
                            sltObj['datas'] = [];

                            let sltObjSub = {};
                            sltObjSub['itemCodeSlt'] = prtItemCode.replace('인쇄', '슬리팅');
                            sltObjSub['sltQuan'] = gu.getCmp('insertMassSlt').getValue();
                            sltObj['datas'].push(sltObjSub);
                            break;
                        case gu.id('formPanelRST'):
                            processType = 'RST';

                            let rstPreStore = gu.getCmp('innerGrids_' + processType).getStore();
                            let rstAftStore = gu.getCmp('prtGrid').getStore();
                            let sltQuanRst = rstPreStore.getAt(0).get('dtl_qty');
                            let sltStodtlUid = rstPreStore.getAt(0).get('unique_id_long');
                            rstObj['sltQuan'] = sltQuanRst;
                            rstObj['sltStodtlUid'] = sltStodtlUid;
                            rstObj['datas'] = [];

                            for (let rstAftPos = 0; rstAftPos < rstAftStore.getCount(); rstAftPos++) {
                                let rstObjSub = {};
                                let rec = rstAftStore.getAt(rstAftPos);
                                rstObjSub['itemCodeExt'] = rec.get('item_code');
                                rstObjSub['sltQuan'] = rec.get('sltQuan');
                                rstObjSub['width'] = rec.get('width');
                                rstObj['datas'].push(rstObjSub);
                            }
                            break;
                        default:
                            if (prWin) {
                                prWin.close();
                            }
                    }

                    extObj = Ext.JSON.encode(extObj);
                    prtObj = Ext.JSON.encode(prtObj);
                    sltObj = Ext.JSON.encode(sltObj);
                    rstObj = Ext.JSON.encode(rstObj);

                    let isLastProcess = gm.me().lastProcess === processType;

                    let pcsstepUid = selection.get(bigPcsCode + '-' + processType + '|step_uid');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=makeWorkInProcess',
                        params: {
                            processType: processType,
                            assymapUid: assymapUid,
                            cartmapUid: cartmapUid,
                            pcsstepUid: pcsstepUid,
                            rtgastUid: rtgastUid,
                            srcahdUid: srcahdUid,
                            originQty: originQty,
                            remainQty: remainQty,
                            mixQuan: mixQuan,
                            extQuan: extQuan,
                            prtQuan: prtQuan,
                            sltQuan: sltQuan,
                            rstQuan: rstQuan,
                            extObj: extObj,
                            prtObj: prtObj,
                            sltObj: sltObj,
                            rstObj: rstObj,
                            isLastProcessStr: isLastProcess
                        },
                        success: function () {
                            if (prWin) {
                                gm.me().store.load();
                                prWin.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
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
    }
});
