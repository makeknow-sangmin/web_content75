//수주등록된 전체 제품 메뉴
Ext.define('Rfx2.view.company.scon.salesDelivery.HEAVY4_RecvPoSubView', {
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

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: "작업지시일",
            labelWidth: 60,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        // this.addSearchField('po_no');
        // this.addSearchField('project_varchar4');
        // this.addSearchField('project_varchar3');

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

        // 바코드 출력
        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gMain.selPanel.printBarcode();
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

                gm.me().machineStore.getProxy().setExtraParam('division_code', 'CH01');
                gm.me().comcstStore.load();

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
                                title: '공정과 진행수량을 정확히 입력하시기 바랍니다.<br>실적수량을 입력하면 입력수량으로 자동입고를 시행합니다.',
                                defaults: {
                                    margin: '3 3 3 3'
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        width: 400,
                                        height: 35,
                                        html: '<p style="text-align:left;">&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp<b>실적을 입력할 제품 : ' + selection.get('concat_item_desc') + '</b>',
                                        style: 'color:black;'
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
                                        fieldLabel: '입력시간',
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
                                        xtype: 'combo',
                                        id: gu.id('division'),
                                        name: 'division',
                                        displayField: 'division_name',
                                        store: gm.me().comcstStore,
                                        valueField: 'division_code',
                                        allowBlank: false,
                                        typeAhead: false,
                                        hideLabel: false,
                                        hideTrigger: false,
                                        width: '96%',
                                        allowBlank: true,
                                        value: 'CH01',
                                        fieldLabel: '공장선택',
                                        listeners: {
                                            select: function (field, newValue, oldValue) {
                                                // console_logs('>>>> newValue', newValue);
                                                gm.me().machineStore.getProxy().setExtraParam('division_code', gu.getCmp('division').getValue());
                                                gm.me().machineStore.load();
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'combo',
                                        id: gu.id('machine_code'),
                                        name: 'machine_code',
                                        displayField: 'name_ko',
                                        store: gm.me().machineStore,
                                        valueField: 'mchn_code',
                                        allowBlank: false,
                                        typeAhead: false,
                                        hideLabel: false,
                                        hideTrigger: false,
                                        width: '96%',
                                        allowBlank: true,
                                        fieldLabel: '양생실'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('complete_qty'),
                                        width: '96%',
                                        name: 'complete_qty',
                                        value: 0,
                                        fieldLabel: '진행수량'
                                    },
                                    // {
                                    //     xtype: 'numberfield',
                                    //     id: gu.id('defect_qty'),
                                    //     width: '96%',
                                    //     name: 'defect_qty',
                                    //     value: 0,
                                    //     fieldLabel: '불량수량'
                                    // },
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
                        height: 430,
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
                                    var process_date = gu.getCmp('process_date').getValue();
                                    var process_time = gu.getCmp('process_time').getValue();

                                    var work_type = gu.getCmp('work_type').getValue();

                                    var cartmap_uid = selection.get('unique_id_long');

                                    var machineCode = gu.getCmp('machine_code').getValue();
                                    var division = gu.getCmp('division').getValue();

                                    console_logs('>>> machineCode', machineCode);
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
                                    // var defect_qty = gu.getCmp('defect_qty').getValue();


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
                                                            'defect_qty': 0,
                                                            'work_type': work_type,
                                                            'machine_code': machineCode,
                                                            'division_code': division
                                                        },

                                                        success: function (result, request) {
                                                            gm.me().store.load();
                                                            // gm.me().pcsworkStore.load();
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


        // this.inAction = Ext.create('Ext.Action', {
        //     iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        //     text: gm.getMC('CMD_Warehousing', '입고등록'),
        //     tooltip: '입고완료',
        //     disabled: false,
        //     handler: function () {

        //         var selections = currentTab.getSelectionModel().getSelection();

        //         if (selections.length === 0) {
        //             Ext.Msg.alert('', '제작번호를 선택 하시기 바랍니다.');
        //             return;
        //         } else if (selections.length > 1) {
        //             Ext.Msg.alert('', '한번에 하나의 제작번호만 지정 가능합니다.');
        //             return;
        //         }

        //         var selection = selections[0];

        //         var ngr_quan = selection.get('ngr_quan');

        //         if (ngr_quan > 0) {
        //             var form = Ext.create('Ext.form.Panel', {
        //                 xtype: 'form',
        //                 frame: false,
        //                 border: false,
        //                 bodyPadding: 10,
        //                 region: 'center',
        //                 layout: 'form',
        //                 fieldDefaults: {
        //                     labelAlign: 'right',
        //                     msgTarget: 'side'
        //                 },
        //                 items: [
        //                     {
        //                         xtype: 'fieldset',
        //                         title: '제작 수량과 날짜를 정확히 입력하시기 바랍니다.',
        //                         items: [
        //                             {
        //                                 xtype: 'numberfield',
        //                                 id: gu.id('gr_quan'),
        //                                 anchor: '97%',
        //                                 name: 'gr_quan',
        //                                 value: selection.get('ngr_quan'),
        //                                 fieldLabel: '제작수량'
        //                             },
        //                             {
        //                                 xtype: 'datefield',
        //                                 id: gu.id('goods_in_date'),
        //                                 anchor: '97%',
        //                                 name: 'goods_in_date',
        //                                 value: new Date(),
        //                                 format : 'Y-m-d',
        //                                 fieldLabel: '출고날짜'
        //                             }
        //                         ]
        //                     }
        //                 ]
        //             });

        //             var prWin = Ext.create('Ext.Window', {
        //                 modal: true,
        //                 title: '제작완료',
        //                 width: 450,
        //                 height: 210,
        //                 items: form,
        //                 buttons: [
        //                     {
        //                         text: CMD_OK,
        //                         scope: this,
        //                         handler: function () {
        //                             //첫번째만 갖고 와야 한다.
        //                             //var selection = selected_rec[0];

        //                             var gr_quan = selection.get('gr_quan');
        //                             var pr_quan = selection.get('pr_quan');
        //                             var ngr_quan = selection.get('ngr_quan');
        //                             var cur_gr_quan = gu.getCmp('gr_quan').getValue();
        //                             var goods_in_date = gu.getCmp('goods_in_date').getValue();

        //                             var cartmap_uid = selection.get('coord_key3');

        //                             if (cur_gr_quan > ngr_quan) {
        //                                 Ext.Msg.alert('', '입력 수량이 미입고 수량보다 더 많습니다.');
        //                             } else {
        //                                 Ext.Ajax.request({
        //                                     url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
        //                                     params: {
        //                                         'cartmap_uid': cartmap_uid,
        //                                         'gr_quan': cur_gr_quan,
        //                                         'goods_in_date': goods_in_date
        //                                     },
        //                                     success: function (val, action) {
        //                                         if (prWin) {
        //                                             prWin.close();
        //                                         }
        //                                         gm.me().getStore().load();
        //                                     },
        //                                     failure: function (val, action) {
        //                                         if (prWin) {
        //                                             prWin.close();
        //                                         }
        //                                     }
        //                                 });
        //                             }
        //                         }
        //                     },
        //                     {
        //                         text: CMD_CANCEL,
        //                         scope: this,
        //                         handler: function () {
        //                             if (prWin) {
        //                                 prWin.close();
        //                             }
        //                         }
        //                     }
        //                 ]
        //             });

        //             prWin.show();
        //         } else {
        //             Ext.Msg.alert('', '제품이 모두 출고되어 있습니다.');
        //         }
        //     }
        // });
        //buttonToolbar.insert(6, this.printBarcodeAction);
        buttonToolbar.insert(1, this.doProductionAction);
        buttonToolbar.insert(2, this.changePlan);
        buttonToolbar.insert(3, '->');
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
                gUtil.enable(gm.me().printBarcodeAction);

                gUtil.enable(gm.me().moldidAction);
                gUtil.enable(gm.me().minLotAction);
                gUtil.enable(gm.me().changePlan);

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

                //console_logs('activite', gm.me().vSELECTED_ACTIVITY);

            } else {
                gUtil.disable(gm.me().removeAction);
                gUtil.disable(gm.me().editAction);
                gUtil.disable(gm.me().properInputAction);
                gUtil.disable(gm.me().moldidAction);
                gUtil.disable(gm.me().minLotAction);
                gUtil.disable(gm.me().printBarcodeAction);
                gUtil.disable(gm.me().changePlan);
                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gUtil.disable(items[i]);
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
            Ext.apply(this, {
                layout: 'border',
                items: [tab/** /, this.crudTab**/]
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
        // var c = myColumn[0];
        // var f = myField[0];
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

    printBarcode: function () {
        var form = null;
        var selections = null;
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
                items: [
                    {
                        xtype: 'fieldset',
                        title: '입력',
                        collapsible: true,
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
                                xtype: 'radiogroup',
                                fieldLabel: '출력방법',
                                columns: 2,
                                margin: '3 3 3 3',
                                vertical: true,
                                items: [
                                    { boxLabel: '묶음출력', name: 'is_auto', inputValue: '1', checked: true },
                                    { boxLabel: '낱개출력', name: 'is_auto', inputValue: '2' }
                                ]
                            },
                            {
                                xtype: 'numberfield',
                                id: 'package_unit_qty',
                                name: 'package_unit_qty',
                                fieldLabel: '포장단위',
                                margin: '3 3 3 3',
                                width: 200,
                                allowBlank: false,
                                value: rec.get('project_number7')
                            },
                            {
                                xtype: 'numberfield',
                                id: 'print_qty',
                                name: 'print_qty',
                                fieldLabel: '출력매수',
                                margin: '3 3 3 3',
                                width: 200,
                                allowBlank: false,
                                value: 1
                            }
                        ]
                    }
                ]
            });//Panel end...
            var counts = 0;
            var productarr = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var uid = rec.get('unique_id');  //Product unique_id
                var qty = rec.get('request_qty');
                var stock_qty = rec.get('stock_qty');
                if (qty > stock_qty) counts++;
                productarr.push(uid);
            }
            if (productarr.length > 0) {
                prwin = gMain.selPanel.prbarcodeopen(form);
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
                    var assyTopArr = [];
                    var selections = null;
                    if (gm.me().multi_grid_id != undefined) {
                        selections = gm.me().tab_selections[gm.me().multi_grid_id];
                    } else {
                        selections = gm.me().grid.getSelectionModel().getSelection();
                    }
                    var counts = 0;
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var assyTopUid = rec.get('unique_id_long');
                        assyTopArr.push(assyTopUid);
                    }
                    var form = gu.getCmp('formPanel').getForm();
                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printProductBarcodeByAssyTop',
                        params: {
                            assyTopArr: assyTopArr
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

    machineStore: Ext.create('Mplm.store.MachineCuringStore', {}),
    comcstStore: Ext.create('Rfx.store.ComCstStore', {}),
});
