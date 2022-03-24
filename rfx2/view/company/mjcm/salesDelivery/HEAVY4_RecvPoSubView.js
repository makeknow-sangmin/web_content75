//수주등록된 전체 제품 메뉴
Ext.define('Rfx2.view.company.mjcm.salesDelivery.HEAVY4_RecvPoSubView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'receved-mgmt-view',
    vFILE_ITEM_CODE: null,
    inputBuyer: null,
    currentTab: null,
    selected_rec: null,
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        gUtil.setDistinctFilters(this.link, ['pj_name', 'specification', 'pj_code']);
        //console_logs('gUtil.getDistinctFilters(this.link)', gUtil.getDistinctFilters(this.link));

        this.setDefValue('regist_date', new Date());
        //삭제할때 사용할 필드 이름.
        this.setDeleteFieldName('unique_uid');

        var next7 = gUtil.getNextday(7);
        this.setDefValue('delivery_plan', next7);

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        this.setDefComboValue('pj_type', 'valueField', 'P');
        this.setDefComboValue('newmodcont', 'valueField', 'N');
        this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');

        //검색툴바 필드 초기화
        this.initSearchField();

        var useMultitoolbar = false;

        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'isReady',
        //     items: [
        //         {
        //             boxLabel: gm.getMC('CMD_Waiting', '생산대기'),
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
        //             boxLabel: gm.getMC('CMD_GR_COMPLETE', '생산완료'),
        //             checked: false
        //         },
        //     ],
        // });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: "작업지시일",
            labelWidth: 60,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        this.addSearchField('po_no_solo');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        // this.addSearchField({
        //     type: 'distinct',
        //     width: 100,
        //     // tableName: 'rtgast',
        //     field_id: 'state',
        //     fieldName: 'state'

        // });
        // this.addSearchField({
        //     type: 'combo',
        //     width: 100
        //     , field_id: 'state_order'
        //     , emptyText: ''
        //     , store: "CommonCodeStore"
        //     , params: { parentCode: 'PRD_GROUP' }
        //     , displayField: 'code_name_kr'
        //     , valueField: 'system_code'
        //     , value: 'code_name_kr'
        //     , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        // });
        // this.addSearchField (
        //     {
        //         type: 'combo',
        //         field_id: 'state_order'
        //         ,store: "RecevedStateStore"
        //         ,displayField: 'codeName'
        //         ,valueField: 'systemCode'
        //         ,emptyText: '진행상태'
        //         ,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
        //     });	
        //Function Callback 정의
        //redirect
        this.refreshActiveCrudPanel = function (source, selectOn, unique_id, record) {
            if (selectOn == true) {
                this.propertyPane.setSource(source); // Now load data
                this.selectedUid = unique_id;
                gUtil.enable(this.removeAction);
                gUtil.enable(this.editAction);
                gUtil.enable(this.copyAction);
                gUtil.enable(this.viewAction);
                //gUtil.disable(this.registAction);

            } else {//not selected
                this.propertyPane.setSource(source);
                this.selectedUid = '-1';
                gUtil.disable(this.removeAction);
                gUtil.disable(this.editAction);
                gUtil.disable(this.copyAction);
                gUtil.disable(this.viewAction);
                gUtil.enable(this.registAction);
                this.crudTab.collapse();
            }

            //console_logs('this.crudMode', this.crudMode);
            this.setActiveCrudPanel(this.crudMode);
        };

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.ProduceWork',
            pageSize: 300,
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
                /*'REGIST',*/'COPY'
            ]
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        //arr.push(dateToolbar);

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = null;

            this.createMultiSearchToolbar({ first: 9, length: 11 });

            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();
            arr.push(searchToolbar);
        }

        console_logs('arr', arr);

        this.setRowClass(function (record, index) {

            var c = record.get('state');

            switch (c) {
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

        if (gUtil.checkUsePcstpl() == true) {
            processList = gUtil.mesTplProcessBig;
            console_logs('processList', processList);
        } else {
            processList = [];
            var pcs_length = gUtil.mesStdProcess.length;

            for (var i = 0; i < gUtil.mesStdProcess.length; i++) {
                var o = gUtil.mesStdProcess[i];
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
        var process_length = processList.length;

        for (var i = start; i < process_length; i++) {
            var o = processList[i];
            var code = o['code'];
            var name = o['name'];
            var title = name;
            var a = this.createPcsToobars(code);
            console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
            this.tab_info.push({
                code: code,
                name: name,
                title: title,
                toolbars: [a]
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
            var pos = tab_code == 'STL' ? 6 : 5;
            this.addExtraColumnBypcscode(myColumn, myField, tab_code, temp_code, 'end_date', true, pos);
        }

        this.createGrid();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4) {
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

        //속성입력 Action 생성 -- 두성
        this.properInputActionDS = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '속성 입력',
            tooltip: '속성 입력',
            disabled: true,
            handler: function () {
                gm.me().attributeInputDS();
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

        /*
            바코드 출력
            deprecated
         */
        this.productBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '완제품바코드',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gMain.selPanel.printProductBarcode();
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

        // 바코드 출력 버튼
        this.printProductBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '완제품바코드',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printProductBarcodeHandler();
            }
        });

        // this.barcodePrintActionCap = Ext.create('Ext.Action', {
        //     //store:gm.me().combstBranchStore,
        //     iconCls: 'barcode',
        //     text: '청동캡바코드',
        //     tooltip: '청동캡의 바코드를 출력합니다.',
        //     disabled: true,
        //     handler: function () {
        //         gm.me().printBarcodeCap();
        //     }
        // });

        this.doProductionAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Work_Qty', '실적등록'),
            tooltip: '각 공정의 수량을 최신화 합니다.',
            disabled: false,
            handler: function () {

                var defaultQty = 0;

                var selections = currentTab.getSelectionModel().getSelection();

                var big_pcs_code = currentTab.multi_grid_id;

                // var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];
                var processCode = 'process_';

                if (selections.length === 0) {
                    Ext.Msg.alert('', '생산작업을 선택 하시기 바랍니다.');
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
                                // title: '공정과 진행수량, 불량수량을 정확히 입력하시기 바랍니다.<br>실적수량을 입력하면 입력수량으로 자동입고를 시행합니다.',
                                title: '생산 실적 입력',
                                defaults: {
                                    margin: '3 3 3 3'
                                },
                                items: [
                                    {
                                        xtype: 'radiogroup',
                                        id: gu.id('pcsCodeGroup'),
                                        fieldLabel: '공정',
                                        hidden: true,
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
                                    // {
                                    //     xtype: 'datefield',
                                    //     id: gu.id('ref_date'),
                                    //     width: '96%',
                                    //     readOnly: true,
                                    //     name: 'ref_date',
                                    //     value: Ext.Date.add(new Date(), 'Y-m-d'),
                                    //     submitFormat: 'Y-m-d',
                                    //     dateFormat: 'Y-m-d',
                                    //     format: 'Y-m-d',
                                    //     fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    //     fieldLabel: '실적기준일자'
                                    // },
                                    {
                                        xtype: 'radiogroup',
                                        id: gu.id('work_type'),
                                        fieldLabel: '조구분',
                                        hidden: true,
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
                                        fieldLabel: '시작시간',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
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
                                            change: function (field, newValue, oldValue) {
                                                gm.me().setRefDate();
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('ref_date'),
                                        width: '65%',
                                        name: 'ref_date',
                                        value: Ext.Date.add(new Date(), 'Y-m-d'),
                                        dateFormat: 'Y-m-d',
                                        submitFormat: 'Y-m-d',
                                        format: 'Y-m-d',
                                        fieldLabel: '종료시간',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                gm.me().setRefDate();
                                            }
                                        }
                                    }, {
                                        xtype: 'timefield',
                                        name: 'ref_time',
                                        id: gu.id('ref_time'),
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
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('complete_qty'),
                                        width: '96%',
                                        name: 'complete_qty',
                                        value: 0,
                                        fieldLabel: '진행수량'
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
                                        id: gu.id('ct'),
                                        width: '96%',
                                        name: 'ct',
                                        value: 0,
                                        fieldLabel: 'C/T'
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
                        title: gm.getMC('CMD_Work_Qty', '실적등록'),
                        width: 450,
                        height: 350,
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
                                    var ref_time = gu.getCmp('ref_time').getValue();
                                    var refDate = new Date(ref_date);
                                    var refTime = new Date(ref_time);
                                    refDate.setHours(refTime.getHours());
                                    refDate.setMinutes(refTime.getMinutes());
                                    ref_date = refDate;
                                    var process_date = gu.getCmp('process_date').getValue();
                                    var process_time = gu.getCmp('process_time').getValue();

                                    var work_type = gu.getCmp('work_type').getValue();

                                    var cartmap_uid = selection.get('unique_id_long');

                                    var isExceedQty = complete_qty > defaultQty;
                                    var isEqualQty = defaultQty == complete_qty;

                                    var big_pcs_code = currentTab.multi_grid_id;

                                    //var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                                    var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

                                    var isExceedPreStep = false;
                                    var ct = gu.getCmp('ct').getValue();
                                    for (var i = 0; i < pcs_codes.length; i++) {

                                        var stepUid = selection.get(/*pcs_codes[i].code*/processCode + i + '|step_uid');

                                        if (Number(stepUid) === pcsCodeGroup.pcs_radio - 1) {

                                            var outpcsQty = selection.get(/*pcs_codes[i].code*/processCode + i + '|outpcs_qty');

                                            if (complete_qty > outpcsQty) {
                                                isExceedPreStep = true;
                                            }
                                        }
                                    }
                                    var defect_qty = gu.getCmp('defect_qty').getValue();


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
                                                            'ct' : ct
                                                        },

                                                        success: function (result, request) {
                                                            gm.me().store.load();
                                                            gm.me().pcsworkStore.load();
                                                            Ext.Msg.alert('안내', '해당 공정의 수량이 처리 되었습니다.', function () { });
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

        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_Cancel_Plan', '계획취소'),
            tooltip: '요청된 작업지시 건을 생산계획 수립으로 변경 및 스케줄 확정을 취소처리합니다.',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 건을 생산계획 수립으로 이동하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gm.me().denyWorkOrderFc();
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.completePrdAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '완료처리',
            tooltip: '생산을 완료 처리합니다',
            disabled: true,
            handler: function () {
                var selection = selected_rec;
                var rec = selection[0];
                var state = rec.get('rtgast_od_state');
                //         switch (this.rtgast_od_state) {
                //             case "P":
                //                 state_name = "생산대기";
                //                 break;
                //             case "N":
                //                 state_name = "생산중";
                //                 break;
                //             case "I":
                //                 state_name = "반려";
                //                 break;
                //             case "O":
                // //				state_name = "LOT마감";
                // //				break;
                //             case "Y":
                //                 state_name = "생산완료";
                //                 break;
                //             }
                if (state === 'P' || state === 'N') {
                    Ext.MessageBox.show({
                        title: '',
                        msg: '선택 한 건을 완료 처리 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                var rtgast_uid = rec.get('rtgast_od_uid');
                                var cartmap_uid = rec.get('unique_id');
                                // console.log('동명', rtgast_uid);
                                // console.log('동명', cartmap_uid);
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
                    Ext.MessageBox.alert('알림', '완료 가능한 상태가 아닙니다.');
                }
                // gm.me().printBarcode();
            }
        });

        buttonToolbar.insert(1, '->');
        buttonToolbar.insert(1, this.completePrdAction);
        buttonToolbar.insert(1, this.denyWorkOrder);
        buttonToolbar.insert(1, this.printProductBarcodeAction);
        // buttonToolbar.insert(1, this.productBarcodeAction);
        buttonToolbar.insert(1, this.barcodePrintAction);
        buttonToolbar.insert(1, this.doProductionAction);

        // buttonToolbar.insert(1, this.barcodePrintActionCap);


        this.pcsworkStore = Ext.create('Rfx2.store.company.bioprotech.PcsWorkStore', {});
        this.pcsworkDefectStore = Ext.create('Rfx2.store.company.bioprotech.PcsWorkStore', {});

        this.modifyProductionAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('CMD_PERFORMANCE_REVISE', '실적수정'),
            tooltip: '해당 작업의 실적을 수정합니다',
            disabled: true,
            // hidden: gu.setCustomBtnHiddenProp('modifyProductionAction'),
            hidden: true,
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
                var state = selection.get('rtgast_od_state');
                if (state === 'Y') {
                    Ext.MessageBox.alert('알림', '생산완료된 실적은 수정이 불가합니다.')
                    return;
                }

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
                                    hidden: true,
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
                                    hidden: true,
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
                                            if(process_code.includes('PKG')) {
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
                                                        if(result_test === 'true') {
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
                                                            Ext.MessageBox.alert('알림','포장수량은 생산수량을 초과할 수 없습니다.<br>다시 확인해주세요.');
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
                // {
                //     text: this.getMC('CMD_WORK_TYPE', '작업반'),
                //     width: 80,
                //     style: 'text-align:center',
                //     dataIndex: 'work_type',
                //     sortable: true,
                //     renderer: function (value, meta, record) {
                //         switch (value) {
                //             case 'day':
                //                 return '주간';
                //             default:
                //                 return '야간';
                //         }
                //     }
                // },
                {
                    text: this.getMC('CMD_PROCESS_NAME', '공정명'),
                    width: 60,
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
                // {
                //     text: this.getMC('CMD_DEFECT_QUAN', '불량수량'),
                //     width: 80,
                //     style: 'text-align:center',
                //     dataIndex: 'defect_total_qty',
                //     sortable: true,
                //     align: 'right',
                //     renderer: function (value, meta, record) {
                //         return Ext.util.Format.number(value, '0,00/i');
                //     }
                // },
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

            this.buttonToolbar3.items.items[1].update('총 선택 : ' + selections.length + ' / 총 수량 : ' + quan);

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
                            switch (vCompanyReserved4) {
                                case 'KBTC01KR':
                                case 'HJSV01KR':
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

            console_logs('toolbar', toolbar);
            console_logs('toolbar items', items);

            if (selections.length) {

                var rec = selections[0];

                gUtil.enable(gm.me().removeAction);
                gUtil.enable(gm.me().editAction);
                gUtil.enable(gm.me().properInputAction);
                gUtil.enable(gm.me().printProductBarcodeAction);

                gUtil.enable(gm.me().moldidAction);
                gUtil.enable(gm.me().minLotAction);

                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gm.me().vSELECTED_PJ_CODE = rec.get('pj_code');
                gm.me().vSELECTED_PJ_CODE = gUtil.stripHighlight(gm.me().vSELECTED_PJ_CODE);
                var ac_uid = gm.me().vSELECTED_AC_UID;
                gm.me().pj_code = gm.me().vSELECTED_PJ_CODE + "-";

                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gUtil.enable(items[i]);
                    }
                }

                gm.me().pcsworkStore.getProxy().setExtraParam('cartmap_uid', rec.get('unique_id_long'));
                gm.me().pcsworkStore.getProxy().setExtraParam('result', 'Y');
                gm.me().pcsworkStore.load();

                //console_logs('activite', gm.me().vSELECTED_ACTIVITY);
                gm.me().barcodePrintAction.enable();
                // gm.me().barcodePrintActionCap.enable();
                gm.me().denyWorkOrder.enable();
                gm.me().completePrdAction.enable();

            } else {
                gUtil.disable(gm.me().removeAction);
                gUtil.disable(gm.me().editAction);
                gUtil.disable(gm.me().properInputAction);
                gUtil.disable(gm.me().moldidAction);
                gUtil.disable(gm.me().minLotAction);
                gUtil.disable(gm.me().printProductBarcodeAction);

                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gUtil.disable(items[i]);
                    }
                }
                gm.me().barcodePrintAction.disable();
                // gm.me().barcodePrintActionCap.disable();
                gm.me().denyWorkOrder.disable();
                gm.me().completePrdAction.disable();
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
            gMain.setCenterLoading(true);
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
            this.grid.setTitle('전체');
            var items = [];
            items.push(this.grid);
            var tab = this.createTabGrid('Rfx2.model.company.bioprotech.ProduceWork', items, 'big_pcs_code', arr, function (curTab, prevtab) {
                currentTab = curTab;
                var multi_grid_id = curTab.multi_grid_id;
                gm.me().multi_grid_id = multi_grid_id;
                console_logs('multi_grid_id: ', curTab);
                console_logs('multi_grid_id: ', multi_grid_id);
                if (multi_grid_id == undefined) { //Main grid
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);
                    switch (vCompanyReserved4) {
                        case 'KBTC01KR':
                        case 'HJSV01KR':
                            gm.me().store.getProxy().setExtraParam('recv_flag', 'GE');
                            gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                            gm.me().store.getProxy().setExtraParam('js_pcs_code', null);
                            break;
                        default:
                            break;
                    }
                    gm.me().storeLoad();
                } else {//추가 탭그리드
                    var store = gm.me().store_map[multi_grid_id];
                    store.getProxy().setExtraParam('big_pcs_code', multi_grid_id);
                    store.getProxy().setExtraParam('status', null);
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);
                    switch (multi_grid_id) {
                        case 'STL':
                            gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                            break;
                        default:
                            break;
                    }
                    gm.me().storeLoad();
                }
            });
            //모든 스토어에 디폴트 조건
            // Ext.apply(this, {
            //     layout: 'border',
            //     items: [tab, this.crudTab]
            // });
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
                            height: '100%',
                            items: [this.workListGrid]
                        },
                        // {
                        //     collapsible: false,
                        //     frame: false,
                        //     split: true,
                        //     region: 'center',
                        //     layout: {
                        //         type: 'hbox',
                        //         pack: 'start',
                        //         align: 'stretch'
                        //     },
                        //     height: '50%',
                        //     items: [this.defectListGrid]
                        // }
                    ]
                }/** /, this.crudTab**/]
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
    // produceOrderStore = Ext.create('Rfx2.store.ExtendPcsstepStrore', {autoLoad:false});
    //'Rfx2.model.company.bioprotech.ProduceWork'
    produceOrderStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Rfx2.model.company.bioprotech.ProduceWork'),
        autoLoad:false
    }),
    processInput: function () {
        var form = null;
        form = Ext.create('Ext.form.Panel', {
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
                                { boxLabel: '제작', name: 'pcs_code', inputValue: 'PRD' },
                                { boxLabel: '도금', name: 'pcs_code', inputValue: 'GLT' },
                                { boxLabel: '도장', name: 'pcs_code', inputValue: 'PNT' },
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

        var tab_code = gm.me().multi_grid_id;


        var fields = (tab_code == undefined) ? this.fields : this.fields_map[tab_code];

        var oItems = [];

        var line = 0;
        var arr = null;
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
            if (o['canEdit'] == true) {
                console_logs('fields o', o);
                if (line % 3 == 0) {
                    if (o1 != null) {
                        oItems.push(arr);
                    }
                    arr = [];

                }
                var xtype = null;
                switch (o['type']) {
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
                var o1 = {

                    xtype: xtype,
                    width: 250,
                    name: o['name'],
                    fieldLabel: o['text']
                };
                switch (o['type']) {
                    case 'sdate':
                    case 'date':
                        o1['value'] = '';
                        break;
                    default:

                }

                arr.push(o1);

                line++;
            }
        }
        if (o1 != null) {
            oItems.push(o1);
        }
        console_logs('oItems', oItems);

        var items = [];
        for (var i = 0; i < oItems.length; i++) {
            items.push(
                {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        margin: '0, 5, 5, 0,',
                        items: oItems[i]
                    },
                    items: oItems[i]
                });

        }
        console_logs('items', items);

        var form = Ext.create('Ext.form.Panel', {
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

        var arr = [];

        var n = 0;
        console_logs('================= START =============', arr);

        for (var i = 0; i < gUtil.mesTplProcessBig.length; i++) {
            var o = gUtil.mesTplProcessBig[i];
            console_logs('o', o);

            var pcsCode = o['code'];
            var pcsTemplate = o['pcsTemplate'];
            console_logs('pcsTemplate=', pcsTemplate);
            console_logs('pcsCode=', pcsCode);
            var o1 = gUtil.mesTplProcessAll;
            console_logs('o1=', o1);
            var subArr = o1[pcsCode];
            console_logs('subArr=', subArr);

            var big_pcs_code = 'SPL';

            console_logs('===+this.multi_grid_id', this.multi_grid_id);

            console_logs('===+big_pcs_code', big_pcs_code);

            console_logs('===+pcsTemplate', pcsTemplate);
            if (pcsTemplate == big_pcs_code) {
                var pcsnames = ''
                for (j = 0; j < subArr.length; j++) {
                    var o2 = subArr[j];

                    if (pcsnames != '') {
                        pcsnames = pcsnames + ' -> ';
                    }
                    pcsnames = pcsnames + o2['name'];
                }
                arr.push({
                    inputValue: o['code'],
                    boxLabel: o['name'] + '  (' + pcsnames + ')',
                    name: 'big_pcs_code',
                    checked: (n == 0) ? true : false,
                    listeners: {
                        change: function (radiogroup, radio, checked) {
                            Ext.MessageBox.alert('click', checked);
                        }
                    }
                });
                n++;
            }
        }
        console_logs('================= END =============', arr);
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
                    var form = gu.getCmp(gu.id('formPanel')).getForm();
                    form.submit({
                        url: CONTEXT_PATH + '/index/process.do?method=updateProcessWork',
                        /* params:{
                         srcahduids: srcahd_uids
                         },*/
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

    specConfirm: function () {

        var form = null;
        form = Ext.create('Ext.form.Panel', {
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

    extoutJson: function (multi_grid_id, records, fname) {
        if (records == null || records.length == 0) {
            return;
        }
        var big_pcs_code = multi_grid_id == undefined ? 'SSP' : multi_grid_id;
        var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
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
                o.set('update_pcsstep_and_work', 'FULL_MAKE');//공정처리
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
        var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
        if (smallPcs == undefined || smallPcs.length == 0) {
            return;
        }
        console_logs('smallPcs', smallPcs);
        //복사대상
        var c = myColumn[0];
        var f = myField[0];
        // for (var j = 0; j < smallPcs.length; j++) {
        //     for (var k = 0; k < 2; k++) {
        //         var o = smallPcs[j];
        //         var new_c = {};
        //         for (var key in c) {
        //             switch (key) {
        //                 case 'dataIndex':
        //                     new_c[key] = o['code'] + '|' + (k % 2 == 0 ? 'start_date' : 'end_date');
        //                     break;
        //                 case 'text':
        //                     new_c[key] = o['name'] + (k % 2 == 0 ?  ' 시작' : ' 완료');
        //                     break;
        //                 default:
        //                     new_c[key] = c[key];

        //             }
        //         }
        //         var new_f = {};
        //         console_logs('smallPcs o', o);
        //         for (var key in f) {
        //             switch (key) {
        //                 case 'text':
        //                     new_f[key] = o['name'];
        //                     break;
        //                 case 'name':
        //                     new_f[key] = o['code'] + '|' + (k % 2 == 0 ? 'start_date' : 'end_date');
        //                     break;
        //                 default:
        //                     new_f[key] = f[key];
        //             }
        //         }

        //         new_c['canEdit'] = editable;
        //         new_c['dataType'] = 'sdate';
        //         new_c['important'] = true;
        //         new_c['id'] = 'uid-' + Math.floor((Math.random() * 10000000000) + 1);
        //         new_f['tableName'] = 'pcsstep';
        //         new_f['type'] = 'date';
        //         new_f['useYn'] = 'Y';
        //         new_c['width'] = 30 + (new_c['text'].length * 10);
        //         console_logs('-----------new_c', new_c);
        //         console_logs('--------------new_f', new_f);
        //         myColumn.splice(pos + (j * 2) + k, 0, new_c);
        //         myField.splice(pos + (j * 2) + k, 0, new_f);
        //     }
        // }
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
    //10일 이전:초록, 5일이전 노랑 3일이전 빨강. 지나면 검정
    highlightCell: function (o, gap, value, field) {
        if (gap != '') {
            var n = Number(gap);
            var background = 'white';
            var color = 'black';
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

        var temp_code = code;
        var smallPcs = gUtil.mesTplProcessAll[temp_code];
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
                    cmpId: code + code1,
                    text: name1 + '시작',
                    big_pcs_code: code,
                    pcs_code: code1,
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
                                gm.editAjax('pcsstep', 'start_date', date, 'unique_id', whereValue, { type: 'update_pcsstep_and_work' });
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
                    pcs_code: code1,
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
                                gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue, { type: 'update_pcsstep_and_work' });
                            }
                        }
                    }
                };
                // buttonItems.push(action1);
                // buttonItems.push(action);

            }//endoffor
        }

        console_logs('createPcsToobars buttonItems', buttonItems);
        var buttonToolbar1 = Ext.create('widget.toolbar', {
            items: buttonItems
        });
        console_logs('createPcsToobars buttonToolbar', buttonToolbar1);
        return buttonToolbar1;
    },

    //생산중단
    workOrderStop: function () {
        var code = gm.me().selected_tab;
        var selections = gm.me().tab_selections[code];
        console_logs('===>selections====>', selections);
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        var cartmapUid = this.vSELECTED_RECORD.get('coord_key3');
        var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
        var state = this.vSELECTED_RECORD.get('state');

        var ac_uids = [];
        var cartmapUids = [];
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uids = rec.get('ac_uid');
            var c_uids = rec.get('coord_key3');
            console_logs('==uids==', uids);
            ac_uids.push(uids);
            cartmapUids.push(c_uids);
        }
        console_logs('==ac_uids==>>', ac_uids);
        console_logs('==cartmapUids==>>', cartmapUids);
        console_logs('==state==>>', state);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=delStopOrder',
            params: {
                ac_uid: ac_uids,
                status: state,
            },
            success: function (result, request) {
                gm.me().storeLoad(function () {
                });
                Ext.Msg.alert('안내', '생산작업을 취소하였습니다.', function () {
                });

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    doRequest: function (o) {
        var assymap_uids = [];
        var code = gm.me().selected_tab;
        if (code != undefined) {
            var selections = gm.me().tab_selections[code];
        } else {
            var selections = this.grid.getSelectionModel().getSelection();
        }
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            assymap_uids.push(uid);

        }
        o['assymap_uids'] = assymap_uids;
        o['parent_code'] = this.link;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
            params: o,
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
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
                        switch (vCompanyReserved4) {
                            case 'KBTC01KR':
                            case 'HJSV01KR':
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

        if (items != null && items.length > 0) {
            return items[0];
        } else {
            return null;
        }
        console_logs('toolbar', toolbar);
        console_logs('toolbar items', items);
    },

    tab_selections: {},

    prevTagnoIn: '',
    setCheckname: function (b) {
        this.checkname = b;
        var btn = gu.getCmp('prwinopen-OK-button');
        if (b == true) {
            btn.enable();
        } else {
            btn.disable();
        }
    },
    madeComboIds: [],

    //storeLoad callback override
    storeLoadCallbackSub: function (records) {
        console_logs('records', records);
        //gm.me().multi_grid_id = multi_grid_id;
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

    addProcessButtonKynl: function (smallPcs, code, buttonItems, i) {
        if (smallPcs != null && smallPcs.length > 0) {
            //   for(var i=0; i <smallPcs.length; i++) {
            var o1 = smallPcs[i];
            var code1 = o1['code'];
            var name1 = o1['name'];
            console_logs('createPcsToobars code1', code1);
            console_logs('createPcsToobars name1', name1);

            var action = {
                xtype: 'button',
                iconCls: 'af-check',
                cmpId: code + code1,
                text: name1 + '완료일',
                big_pcs_code: code,
                pcs_code: code1,
                disabled: true,
                handler: function () {
                    gMain.setCenterLoading(true);
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
                            var assymapValue = [];
                            var field = this.pcs_code + '|' + 'end_date';
                            for (var i = 0; i < selections.length; i++) {
                                var o = selections[i];
                                o.set(field, date);
                                console_logs('o', o);
                                console_logs('this.pcs_code', this.pcs_code);
                                var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
                                whereValue.push(step_uid);
                                console_logs('step_uid', selections);
                                assymapValue.push(o.get('unique_id'));
                            }
                            console_logs('createPcsToobars', whereValue);
                            gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue, { type: 'update_pcsstep_and_work' });

                            currentTab.getStore().load();
                        }
                    }
                }
            };
            buttonItems.push(action);
        }//endoffor
        //  }//endofif
    },

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FF7F27; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    // printBarcode: function () {
    //     var form = null;
    //     var selections = null;
    //     if (gm.me().multi_grid_id != undefined) {
    //         selections = gm.me().tab_selections[gm.me().multi_grid_id];
    //     } else {
    //         selections = gm.me().grid.getSelectionModel().getSelection();
    //     }
    //     if (selections.length > 1) {
    //         Ext.Msg.alert('', '하나의 제품을 선택하시기 바랍니다.');
    //     } else {
    //         var rec = selections[0];
    //         form = Ext.create('Ext.form.Panel', {
    //             id: gu.id('formPanel'),
    //             xtype: 'form',
    //             frame: false,
    //             border: false,
    //             bodyPadding: '3 3 0',
    //             region: 'center',
    //             fieldDefaults: {
    //                 labelAlign: 'right',
    //                 msgTarget: 'side'
    //             },
    //             defaults: {
    //                 anchor: '100%',
    //                 labelWidth: 60,
    //                 margins: 10,
    //             },
    //             items: [
    //                 {
    //                     xtype: 'fieldset',
    //                     title: '입력',
    //                     collapsible: true,
    //                     defaults: {
    //                         labelWidth: 60,
    //                         anchor: '100%',
    //                         layout: {
    //                             type: 'hbox',
    //                             defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
    //                         }
    //                     },
    //                     items: [
    //                         {
    //                             xtype: 'radiogroup',
    //                             fieldLabel: '출력방법',
    //                             columns: 2,
    //                             margin: '3 3 3 3',
    //                             vertical: true,
    //                             items: [
    //                                 { boxLabel: '묶음출력', name: 'is_auto', inputValue: '1', checked: true },
    //                                 { boxLabel: '낱개출력', name: 'is_auto', inputValue: '2' }
    //                             ]
    //                         },
    //                         {
    //                             xtype: 'numberfield',
    //                             id: 'package_unit_qty',
    //                             name: 'package_unit_qty',
    //                             fieldLabel: '포장단위',
    //                             margin: '3 3 3 3',
    //                             width: 200,
    //                             allowBlank: false,
    //                             value: rec.get('project_number7')
    //                         },
    //                         {
    //                             xtype: 'numberfield',
    //                             id: 'print_qty',
    //                             name: 'print_qty',
    //                             fieldLabel: '출력매수',
    //                             margin: '3 3 3 3',
    //                             width: 200,
    //                             allowBlank: false,
    //                             value: 1
    //                         }
    //                     ]
    //                 }
    //             ]
    //         });//Panel end...
    //         var counts = 0;
    //         var productarr = [];
    //         for (var i = 0; i < selections.length; i++) {
    //             var rec = selections[i];
    //             var uid = rec.get('unique_id');  //Product unique_id
    //             var qty = rec.get('request_qty');
    //             var stock_qty = rec.get('stock_qty');
    //             if (qty > stock_qty) counts++;
    //             productarr.push(uid);
    //         }
    //         if (productarr.length > 0) {
    //             prwin = gMain.selPanel.prbarcodeopen(form);
    //         }
    //     }
    // },
    // 구버전
    // prbarcodeopen: function (form) {
    //     prWin = Ext.create('Ext.Window', {
    //         modal: true,
    //         title: '바코드 출력 매수',
    //         plain: true,
    //         items: form,
    //         buttons: [{
    //             text: CMD_OK,
    //             handler: function () {
    //                 var assyTopArr = [];
    //                 var selections = null;
    //                 if (gm.me().multi_grid_id != undefined) {
    //                     selections = gm.me().tab_selections[gm.me().multi_grid_id];
    //                 } else {
    //                     selections = gm.me().grid.getSelectionModel().getSelection();
    //                 }
    //                 var counts = 0;
    //                 for (var i = 0; i < selections.length; i++) {
    //                     var rec = selections[i];
    //                     var assyTopUid = rec.get('unique_id_long');
    //                     assyTopArr.push(assyTopUid);
    //                 }
    //                 var form = gu.getCmp('formPanel').getForm();
    //                 form.submit({
    //                     url: CONTEXT_PATH + '/sales/productStock.do?method=printProductBarcodeByAssyTop',
    //                     params: {
    //                         assyTopArr: assyTopArr
    //                     },
    //                     success: function (val, action) {
    //                         prWin.close();
    //                         Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
    //                         gMain.selPanel.store.load(function () {
    //                         });
    //                     },
    //                     failure: function (val, action) {
    //                         prWin.close();
    //                         Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
    //                         gMain.selPanel.store.load(function () {
    //                         });
    //                     }
    //                 });
    //             }//btn handler
    //         }, {
    //             text: CMD_CANCEL,
    //             handler: function () {
    //                 if (prWin) {
    //                     prWin.close();
    //                 }
    //             }
    //         }]
    //     });
    //     prWin.show();
    // },
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
    printProductBarcode: function () {
        var item_code = null;
        var product_uid = null;
        var order_multiple = null;
        var specification = null;
        var item_name = null;
        var lot_nos = '';
        var lot_nos_disp = '';
        var selections = gm.me().grid.getSelectionModel().getSelection();

        var productStore = Ext.create('Rfx2.store.company.kbtech.ExtendSrcahdStore', {});
        productStore.getProxy().setExtraParams({
            'item_type': 'PROD',
            standard_flag: 'A'
        });

        var rtg_uid = '';

        for (var i = 0; i < selections.length; i++) {
            var selection = selections[i];
            var lot_no = !selection.get('lot_no') ? selection.get('po_no') : selection.get('lot_no');
            if (item_code == null) {
                // item_code = selection.get('parent_item_code');
                // specification = selection.get('parent_specification');
                // item_name = selection.get('parent_item_name');
                // product_uid = selection.get('parent_product_uid');
                // order_multiple = selection.get('order_multiple');

                item_code = selection.get('item_code');
                specification = selection.get('specification');
                item_name = selection.get('item_name');
                product_uid = selection.get('srcahd_uid');
                order_multiple = selection.get('finance_rate'); // 포장단위

                lot_nos = !selection.get('lot_no') ? selection.get('po_no') : selection.get('lot_no');
                lot_nos_disp = lot_nos;

            } else {
                // if(item_code != selection.get('parent_item_code')) {
                //     Ext.MessageBox.alert('사용불가', '제품코드가 다른 자재가 선택되었습니다.');
                //     return;
                // }
                if (i == 3 || i == 6) {
                    lot_nos = lot_nos + '|';
                    lot_nos_disp = lot_nos_disp + '\n';
                } else {
                    lot_nos = lot_nos + ' ';
                    lot_nos_disp = lot_nos_disp + ' ';
                }
                lot_nos = lot_nos + lot_no;
                lot_nos_disp = lot_nos_disp + lot_no;
            }
        }

        console_logs('lot_nos', lot_nos);
        console_logs('lot_nos_disp', lot_nos_disp);
        console_logs('finance_rate', order_multiple);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '5 5 5 5',
            region: 'center',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
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
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: '15 15 15 15',
                    items: [
                        {
                            xtype: 'textfield',
                            margin: '3 3 3 3',
                            allowBlank: true,
                            hidden: true,
                            name: 'product_uid',
                            id: gu.id('barcode_srcahd_uid'),
                            value: product_uid
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '품번',
                            margin: '3 3 3 3',
                            name: 'item_code',
                            id: gu.id('item_code'),
                            store: productStore,
                            displayField: 'item_code',
                            valuField: 'item_code',
                            // innerTpl: '<div data-qtip="{item_code}">[{item_code}]{item_name}-{specification}</div>',
                            minChars: 2,
                            queryMode: 'remote',
                            queryParam: 'item_code',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div>[{item_code}]{item_name} | {specification}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    // console.log('srcahd_uid >>>>> ',record.get('unique_id_long'));
                                    gu.getCmp('barcode_srcahd_uid').setValue(record.get('unique_id_long'));
                                    gu.getCmp('specification').setValue(record.get('specification'));
                                    gu.getCmp('finance_rate').setValue(record.get('finance_rate'));
                                    gu.getCmp('item_name').setValue(record.get('item_name'));
                                }
                            }

                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '품명',
                            margin: '3 3 3 3',
                            name: 'item_name',
                            id: gu.id('item_name'),
                            store: productStore,
                            displayField: 'item_name',
                            valuField: 'item_name',
                            // innerTpl: '<div data-qtip="{item_code}">[{item_code}]{item_name}-{specification}</div>',
                            minChars: 2,
                            queryMode: 'remote',
                            queryParam: 'queryUtf8',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div>[{item_code}]{item_name} | {specification}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    gu.getCmp('barcode_srcahd_uid').setValue(record.get('unique_id_long'));
                                    gu.getCmp('specification').setValue(record.get('specification'));
                                    gu.getCmp('finance_rate').setValue(record.get('finance_rate'));
                                    gu.getCmp('item_code').setValue(record.get('item_code'));
                                }
                            }

                        },
                        // {
                        //     xtype: 'textfield',
                        //     fieldLabel: '제품번호',
                        //     margin: '3 3 3 3',
                        //     allowBlank: true,
                        //     name: 'item_code',
                        //     value: item_code,
                        //     // readOnly: true,
                        //     fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                        // }
                        // ,
                        // {
                        //     xtype: 'textfield',
                        //     fieldLabel: '품명',
                        //     margin: '3 3 3 3',
                        //     allowBlank: true,
                        //     name: 'item_name',
                        //     value: item_name,
                        //     // readOnly: true,
                        //     fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',

                        // },
                        {
                            xtype: 'textfield',
                            fieldLabel: '규격',
                            margin: '3 3 3 3',
                            name: 'specification',
                            id: gu.id('specification'),
                            value: specification,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                        }
                    ]
                },

                {

                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '제품 바코드',
                            collapsible: false,
                            margin: '10 10 10 10',
                            flex: 1,
                            height: 160,
                            defaults: {
                                labelWidth: 60,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                                }
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '5 5 5 5',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                },
                                // {
                                //     xtype: 'radiogroup',
                                //     fieldLabel: '출력 구분',
                                //     margin: '5 5 5 5',
                                //     width: 200,
                                //     allowBlank: false,
                                //     items: [
                                //         {boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true},
                                //         {boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
                                //     ]
                                // },
                                {
                                    xtype: 'numberfield',
                                    name: 'order_multiple',
                                    id: gu.id('finance_rate'),
                                    fieldLabel: '포장단위',
                                    emptyText: '포장단위',
                                    margin: '5 5 5 5',
                                    width: 200,
                                    allowBlank: true,
                                    // value: order_multiple,
                                }
                            ]
                        }, //endof fieldset
                        {
                            xtype: 'fieldset',
                            title: 'LOT 번호',
                            collapsible: false,
                            margin: '10 10 10 10',
                            width: 340,
                            height: 160,
                            defaults: {
                                labelWidth: 60,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                                }
                            },
                            items: [
                                {
                                    xtype: 'hiddenfield',
                                    name: 'lot_nos',
                                    value: lot_nos
                                },
                                {
                                    xtype: 'textarea',
                                    margin: '5 5 5 5',
                                    width: 200,
                                    readOnly: true,
                                    value: lot_nos_disp,
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',

                                }
                            ]
                        }//endof fieldset
                    ]
                }
            ]
        });//Panel end...
        prwin = gMain.selPanel.prbarcodeopen2(form);
    },

    // 기존버전
    prbarcodeopen2: function (form) {

        // rtg unique id 보내기 위함
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var rtg_uid = '';
        var rtgUidAray = [];

        var cartmapUidArr = [],
            itemCodeArr = [],
            itemNameArr = [],
            specificationArr = [],
            waNameArr = []
        qtyArr = [];

        for (var i = 0; i < selections.length; i++) {
            var selection = selections[i];

            //추가작성
            rtg_uid = selection.get('unique_id_long');
            rtgUidAray.push(rtg_uid);

            console_logs('rtg_uid Array select >>>>> ', rtgUidAray);

            cartmapUidArr.push(selection.get('unique_id_long'));
            itemCodeArr.push(selection.get('item_code'));
            itemNameArr.push(selection.get('item_name'));
            specificationArr.push(selection.get('specification'));
            qtyArr.push(gu.getCmp('finance_rate').getValue());
            waNameArr.push('');
        }

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력',
            plain: true,
            width: 600,
            height: 400,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    var bararr = [];

                    var form = gu.getCmp('formPanel').getForm();
                    var val = form.getValues(false);
                    console_logs('val=', val);
                    if (val.product_uid == null) {
                        Ext.MessageBox.alert('사용불가', '잘못된 정보입니다.');
                        return;
                    }
                    uniqueIdArr.push(val.product_uid);
                    bararr.push(val.item_code + '|' + val.item_name + '|' + val.specification
                        + '  (포장:' + val.order_multiple + ')');
                    var checkLot = val.lot_nos;

                    // console_logs('PRINT uniqueIdArr', uniqueIdArr);
                    // console_logs('PRINT bararr', bararr);
                    // console_logs('PRINT checkLot', checkLot);
                    // console_logs('PRINT rtgUidAray', rtgUidAray);
                    console_logs('PRINT qtyArr', qtyArr);

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printDataMatrixBarcode',
                        params: {
                            barcodeUidArr: cartmapUidArr,
                            print_type: 'CARTMAP', //생산바코드로 단품(제품)출하
                            print_qty: val['print_qty'],
                            itemNameArr: itemNameArr,
                            itemCodeArr: itemCodeArr,
                            specificationArr: specificationArr,
                            customerArr: waNameArr,
                            qtyArr: qtyArr,
                            label_size: 'M70x40'
                            /*
                            barcodeUidArr: cartmapUidArr,
                            print_type: 'CARTMAP',
                            print_qty: val['print_qty'],
                            itemNameArr: itemNameArr,
                            itemCodeArr: itemCodeArr,
                            specificationArr: specificationArr,
                            customerArr: waNameArr,
                            label_size: '70X40',
                            qtyArr: qtyArr
                            */
                        },
                        success: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
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

    // 완제품 바코드
    printProductBarcodeHandler: function () {
        var recodes = gm.me().grid.getSelectionModel().getSelection();
        if (recodes.length != 1) {
            Ext.MessageBox.show({
                title: '오류',
                msg: '하나의 생산계획을 선택해주세요.',
                buttons: Ext.MessageBox.OK
            })
            return;
        }

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        // if (rec.get('') != 1) {
        //     Ext.MessageBox.show({
        //         title: '오류',
        //         msg: '완제품이 아닙니다.',
        //         buttons: Ext.MessageBox.OK
        //     })
        //     return;
        // }

		var defaultFieldStyle = {
				anchor: '100%',
				labelAlign: 'right',
				padding: 5,
				fieldStyle: 'background-color: #EAEAEA;',
				readOnly: true,
			};
		var infoHeader = Ext.create('Ext.form.FieldSet', {
			title: '완제품정보',
			width: '99%',
			height: '90',
            flex: 15,
			layout: { type: 'hbox' },
			defaults: defaultFieldStyle,
			items: [
				{
					xtype: 'textfield',
					value: rec.get('item_code'),
					flex: 7
				},
				{
					xtype: 'textfield',
					value: rec.get('item_name'),
					flex: 15
				},
				{
					xtype: 'textfield',
					value: '포장수량 : ' + rec.get('finance_rate'),
					flex: 7
				},
                {
                    fieldLabel: '출력매수',
                    name: 'print_qty',
                    id: gu.id('print_qty'),
                    labelWidth: 60,
					xtype: 'numberfield',
					value: 1,
					flex: 10,
                    readOnly: false,
                    fieldStyle: ''
				},
			]
		})

		var form;

        var selectedStore = new Ext.data.Store({
            model: gm.me().produceOrderStore.getModel()
        })

        var lotGrid = Ext.create('Ext.grid.Panel', {
            // cls: 'rfx-panel',
            title: '자재 LOT 검색',
            store: gm.me().produceOrderStore,
            // layout: 'fit',
            width: '70%',
            height: 450,
            margin: '5%',
            collapsible: false,
            scrollable: true,
            autoScroll: true,
            border: true,
            frame: true,
            layout: 'fit',
            bbar: getPageToolbar(gm.me().produceOrderStore),
            columns: [
                {
                    text: 'LOT NO',
                    dataIndex: 'po_no',
                    flex: 8
                },
                {
                    text: '품목코드',
                    dataIndex: 'item_code',
                    flex: 5
                },
                {
                    text: '품명',
                    dataIndex: 'item_name',
                    flex: 10
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: '25%',
                            field_id: 'search_lot_no',
                            id: gu.id('search_lot_no'),
                            name: 'search_lot_no',
                            xtype: 'triggerfield',
                            emptyText: 'LOT NO',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            width: '25%',
                            field_id: 'search_item_code',
                            id: gu.id('search_item_code'),
                            name: 'search_item_code',
                            xtype: 'triggerfield',
                            emptyText: gm.me().getMC('msg_product_add_search_field1', '품목코드'),
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            width: '25%',
                            field_id: 'search_item_name',
                            id: gu.id('search_item_name'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            emptyText: gm.me().getMC('msg_product_add_search_field2', '품명'),
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            text: CMD_ADD,
                            iconCls: 'af-plus-circle',
                            handler: function (btn) {
                                var selects = lotGrid.getSelectionModel().getSelection();
                                for (var i = 0; i < selects.length; i++) {
                                    var record = selects[i];
                                    selectedStore.add(record);
                                }
                            }
                        }
                    ]
                }
            ]

        })

        var selectedGrid = Ext.create('Ext.grid.Panel', {
            title: '사용 자재 LOT',
            store: selectedStore,
            border: true,
            frame: true,
            layout: 'fit',
            width: '30%',
            margin: '5%',
            columns: [
                {
                    text: 'LOT NO',
                    dataIndex: 'po_no',
                    flex: 1
                }
            ],
            dockedItems:[
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            text: CMD_DELETE,
                            iconCls: 'af-remove',
                            handler: function (btn) {
                                var selects = selectedGrid.getSelectionModel().getSelection();
                                for (var i = 0; i < selects.length; i++) {
                                    var record = selects[i];
                                    selectedStore.remove(record);
                                }
                            }
                        }
                    ]
                }
            ]
            
        })
        
		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: '완제품 바코드 출력',
			width: 600,
			height: 600,
			items: [
				infoHeader,
				{
                    layout: {
                        type: 'hbox',
                    },
                    flex: 1,
                    items: [
                        lotGrid, selectedGrid
                    ]
                }
			],
			buttons: [
				{
					text: '출력',
					scope: this,
					handler: function () {

						Ext.MessageBox.show({
							title: '확인',
							msg: '바코드를 출력하시겠습니까?',
							buttons: Ext.MessageBox.YESNO,
							fn: function (result) {
                                if (result == 'yes') {
                                    var cartmapUidArr = [],
                                        itemCodeArr = [],
                                        itemNameArr = [],
                                        specificationArr = [],
                                        customerArr = [],
                                        qtyArr = [],
                                        lotStr = '',
                                        lotStrArr = [],
                                        print_qty
                                        ;
                                    cartmapUidArr.push(rec.get('unique_id_long'));
                                    itemCodeArr.push(rec.get('item_code'));
                                    itemNameArr.push(rec.get('item_name'));
                                    // specificationArr.push(rec.get('specification'));
                                    specificationArr.push(rec.get('po_no'));
                                    qtyArr.push(rec.get('finance_rate'));

                                    var mtrlLots = selectedStore.data.items;
                                    mtrlLots.forEach(element => {
                                        customerArr.push(element.get('po_no'));
                                    });
                                    lotStr = customerArr.join(';');
                                    lotStrArr.push(lotStr);
                                    print_qty = gu.getCmp('print_qty').getValue();
                                    
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/productStock.do?method=printDataMatrixBarcode',
                                        params: {
                                            barcodeUidArr: cartmapUidArr,
                                            print_type: 'CARTMAP',
                                            print_qty: print_qty,
                                            itemNameArr: itemNameArr,
                                            itemCodeArr: itemCodeArr,
                                            specificationArr: specificationArr,
                                            customerArr: lotStrArr,
                                            label_size: '70X40',
                                            qtyArr: qtyArr
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                                            gMain.selPanel.store.load(function () {
                                            });
                                        },
                                        failure: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                                            gMain.selPanel.store.load(function () {
                                            });
                                        }
                                    });
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
    },



    // 공방 새버전
    printBarcode: function () {
        var form = null;
        var cartmapArr = [];
        var itemCodeArr = [];
        var itemNameArr = [];
        var combstArr = [];
        var orderNumArr = [];
        var selections = null;
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var myWidth = 465;
        var myHeight = 300;

        if (gm.me().multi_grid_id != undefined) {
            selections = gm.me().tab_selections[gm.me().multi_grid_id];
        } else {
            selections = gm.me().grid.getSelectionModel().getSelection();
        }
        if (selections.length > 1) {
            Ext.Msg.alert('', '하나의 제품을 선택하시기 바랍니다.');
        } else {
            var rec = selections[0];
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
                        defaults: {
                            labelWidth: 75,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                            }
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'po_no',
                                id: gu.id('po_no'),
                                fieldLabel: 'LOT NO',
                                // emptyText: '포장단위',
                                margin: '3 3 3 3',
                                width: 200,
                                allowBlank: true,
                                // value: selection.get('finance_rate'),
                                value: selection.get('po_no'),
                                readOnly: true
                            },
                            // {
                            //     xtype: 'numberfield',
                            //     id: 'package_unit_qty',
                            //     name: 'package_unit_qty',
                            //     fieldLabel: '포장단위',
                            //     margin: '3 3 3 3',
                            //     width: 200,
                            //     allowBlank: false,
                            //     value: rec.get('project_number7')
                            // },
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
                            // {
                            //     xtype: 'combobox',
                            //     id: 'label_size',
                            //     name: 'label_size',
                            //     fieldLabel: '라벨사이즈',
                            //     store: gm.me().LabelSizeStore,
                            //     margin: '3 3 3 3',
                            //     width: 200,
                            //     allowBlank: false,
                            //     displayField:   'code_name_kr',
                            //     valueField: 'system_code',
                            //     listConfig:{
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function(){
                            //             return '<div data-qtip="{code_name_kr}">{code_name_kr}</div>';
                            //         }
                            //     },
                            //     listeners: {
                            //         select: function(grid, data) {
                            //             Ext.getCmp('label_size').setValue(data.get('code_name_kr'));
                            //             //Ext.getCmp('value').setValue(data.get('value'));

                            //         }
                            //     }
                            // },
                            // {
                            //     xtype: 'datefield',
                            //     name: 'end_date',
                            //     id: gu.id('end_date'),
                            //     fieldLabel: '생산종료일',
                            //     hideTrigger: false,
                            //     keyNavEnabled: true,
                            //     format: 'Y-m-d',
                            //     margin: '3 3 3 3',
                            //     width: 200,
                            //     mouseWheelEnabled: true,
                            //     editable: true,
                            //     listeners: {

                            //     }
                            // },
                        ]
                    }
                ]
            });//Panel end...
            var counts = 0;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                cartmapArr.push(rec.get('unique_id_long'));
                if (rec.get('item_code') === null) {
                    itemCodeArr.push('unknown');
                } else {
                    itemCodeArr.push(rec.get('item_code'));
                }
                if (rec.get('item_name') === null) {
                    itemNameArr.push('unknown');
                } else {
                    itemNameArr.push(rec.get('item_name'));
                }
                combstArr.push(rec.get('customer_name'));
                orderNumArr.push(rec.get('orderNumber'));
            }
            if (cartmapArr.length > 0) {
                prwin = gMain.selPanel.prbarcodeopen(form, cartmapArr, itemCodeArr, itemNameArr, combstArr, orderNumArr);
            }
        }
    },

    prbarcodeopen: function (form, cartmapArr, itemCodeArr, itemNameArr, combstArr, orderNumArr) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var assyTopArr = [];
                    // var selections = null;

                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    // var cartmapUidArr = [];
                    // var srcahdUidArr = [];
                    // var itemNameArr = [];
                    // var itemCodeArr = [];
                    // var specificationArr = [];
                    // var qtyArr = [];
                    // var customerArr = [];

                    // for(var i=0; i<selections.length; i++) {
                    //     var rec = selections[i];
                    //     var cartmap_uid = rec.get('unique_id_long');
                    //     var child = rec.get('child');
                    //     var item_name = rec.get('item_name');
                    //     var item_code = rec.get('item_code');
                    //     var specification = rec.get('specification');
                    //     // var order_quan = rec.get('order_quan');
                    //     var order_quan = rec.get('pr_quan');
                    //     var final_wa_name = rec.get('customer_name');

                    //     cartmapUidArr.push(cartmap_uid);
                    //     srcahdUidArr.push(child);
                    //     itemNameArr.push(item_name);
                    //     itemCodeArr.push(item_code);
                    //     specificationArr.push(specification);
                    //     qtyArr.push(order_quan);
                    //     customerArr.push(final_wa_name);

                    // }
                    var cartmapUidArr = [],
                        itemCodeArr = [],
                        itemNameArr = [],
                        specificationArr = [],
                        waNameArr = [],
                        srcahdUidArr = []
                    qtyArr = []
                        ;

                    for (var i = 0; i < selections.length; i++) {
                        var selection = selections[i];

                        //추가작성
                        // rtg_uid = selection.get('unique_id_long');
                        // rtgUidAray.push(rtg_uid);
                        cartmapUidArr.push(selection.get('unique_id_long'));
                        itemCodeArr.push(selection.get('item_code'));
                        itemNameArr.push(selection.get('item_name'));
                        specificationArr.push(selection.get('specification'));
                        waNameArr.push('');
                        qtyArr.push(selection.get('finance_rate'));
                        // srcahdUidArr.push(-1);
                    }

                    var form = gu.getCmp('formPanel').getForm();
                    var val = form.getValues(false);
                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printDataMatrixBarcode',
                        params: {
                            barcodeUidArr: cartmapUidArr,
                            print_type: 'CARTMAP',
                            print_qty: val['print_qty'],
                            itemNameArr: itemNameArr,
                            itemCodeArr: itemCodeArr,
                            specificationArr: specificationArr,
                            customerArr: waNameArr,
                            label_size: '70X40',
                            qtyArr: qtyArr
                            // srcahdUidArr: srcahdUidArr
                        },
                        success: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
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


    // 하나로에서 복사 끝
    denyWorkOrderFc: function () {
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        // console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        // var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
        var rtgastUid = this.vSELECTED_RECORD.get('rtgast_od_uid');
        var po_type = this.vSELECTED_RECORD.get('po_type');
        // if(po_type === 'FN' || po_type === 'PJ') {
        if (po_type === 'PJ') {
            var cartmap_uid = this.vSELECTED_RECORD.get('unique_id');
            var item_quan = this.vSELECTED_RECORD.get('production_qty_sum');
            // var assymap_uid = this.vSELECTED_RECORD.get('coord_key'); 

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderProd',
                params: {
                    rtgastUid: rtgastUid,
                    cartmap_uid: cartmap_uid,
                    item_quan: item_quan
                },
                success: function (result, request) {
                    gm.me().store.load();
                    Ext.Msg.alert('안내', '실행되었습니다.', function () {
                    });
                },
                failure: extjsUtil.failureMessage
            });
            // 수주 생산일 경우

        } else if (po_type === 'FN' || po_type === 'HSC' || po_type === 'CSC') {
            var srcahd_uid = this.vSELECTED_RECORD.get('child');
            var prev_rtgast_uid = this.vSELECTED_RECORD.get('coord_key2');
            var rtgast_uid = this.vSELECTED_RECORD.get('pr_uid');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=cancelProduction',
                params: {
                    rtgast_uid: this.vSELECTED_RECORD.get('rtgast_od_uid'),
                    cartmap_uid: this.vSELECTED_RECORD.get('unique_id')
                },
                success: function (result, request) {
                    // Ext.MessageBox.alert('알림', '해당 건이 상태가 변경되었습니다.');
                    // currentTab.getStore().load();
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderAssy',
                        params: {
                            srcahd_uid: srcahd_uid,
                            prev_rtgast_uid: prev_rtgast_uid,
                            rtgast_uid: rtgast_uid
                        },
                        success: function (result, request) {
                            gm.me().store.load();
                            Ext.Msg.alert('안내', '요청하였습니다.', function () {
                            });
                        },
                        failure: extjsUtil.failureMessage
                    });
                }, // endofsuccess
                failure: extjsUtil.failureMessage
            });
            // 계획생산 일 경우

        }

    },
    clearSearchStore: function () {
        var store = gm.me().produceOrderStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 14);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('po_no', '');
        // store.getProxy().removeExtraParam('item_code');
        // store.getProxy().removeExtraParam('item_name');
        // store.getProxy().removeExtraParam('po_no');
    },
    redrawSearchStore: function () {
        

        this.clearSearchStore();

        var item_code = null;
        var item_name = null;
        var lot_no = null;

        var store = gm.me().produceOrderStore;
        item_code = gu.getValue('search_item_code');
        item_name = gu.getValue('search_item_name');
        lot_no = gu.getValue('search_lot_no');

        
        var bIn = false;
        if (item_code.length > 0) {
            item_code = '%'+item_code+'%';
            store.getProxy().setExtraParam('item_code', item_code);
            bIn = true;
        }

        if (item_name.length > 0) {
            item_name = '%'+item_name+'%';
            store.getProxy().setExtraParam('item_name', item_name);
            bIn = true;
        }

        if (lot_no.length > 0) {
            var lotArr = [];
            lot_no = '%'+lot_no+'%';
            // lotArr.push(lot_no);
            store.getProxy().setExtraParam('po_no_solo', lot_no);
            bIn = true;
        }
        store.getProxy().setExtraParam('aprv_date', '');
        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 14);

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }
    },
});
