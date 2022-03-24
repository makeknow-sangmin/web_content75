Ext.define('Rfx2.view.company.kbtech.produceMgmt.ProduceMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-mgmt-view',
    initComponent: function() {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField (
        {
            type: 'combo'
            ,field_id: 'status'
            ,store: "RecevedStateStore"
            ,displayField: 'codeName'
            ,valueField: 'systemCode'
            ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        this.addSearchField('reserved_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.ProduceMgmt', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            /*pageSize*/
            gMain.pageSize
            ,{}
            , ['cartmap']
        );

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function() {
                gm.me().producePlanOp();
            }
        });

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function() {

            }
        });

        buttonToolbar.insert(1, this.prEstablishAction);

        //그리드 생성
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

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length == 1) {
                    gm.me().prEstablishAction.enable();
                } else {
                    gm.me().prEstablishAction.disable();
                }
            }
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function(records) {});
    },

    producePlanOp: function() {

        var arr = [];

        for(var i = 0; i < gUtil.mesTplProcessBig.length; i++) {

            var o = gUtil.mesTplProcessBig[i];
            console_logs('o', o);

            var pcsCode = o['code'];

            console_logs('pcsCode=', pcsCode);
            var o1 = gUtil.mesTplProcessAll;
            console_logs('o1=', o1);
            var subArr = o1[pcsCode];
            console_logs('subArr=', subArr);

            var pcsnames = '';

            for(var j = 0; j < subArr.length; j++) {
                var o2 = subArr[j];

                if(pcsnames!='') {
                    pcsnames = pcsnames + ' -> ';
                }
                pcsnames = pcsnames + o2['name'];
            }

            arr.push({
                inputValue: pcsCode,
                boxLabel: o['name'] /*+ '  (' + pcsnames +')'*/,
                name:'big_pcs_code',
                cls: 'font-gray',
                checked: (i == 0) ? true : false,
                listeners: {

                }
            });
        }

        var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: 'PCO'});

        var selection = this.grid.getSelectionModel().getSelection()[0];
        var spCode = selection.get('sp_code');
        var bmQuan = selection.get('bm_quan');

        var myWidth = 450;
        var myHeight = 290;

        switch(spCode) {
            case 'KL':
                myWidth = 700;
                myHeight = 560;

                var contents = [];

                var contentsNames = ['SET 수량', 'PCB 작업수량', '랭크', '출고수량', '소요량', '잔량'];
                var moduleQuan = selection.get('srcadt_varchar18');
                var chipQuan = selection.get('srcadt_varchar26');

                for (var i = 0; i <= 6; i++) {
                    for (var j = 0; j <= 6; j++) {
                        if (i == 0) {
                            if (j != 6) {
                                contents.push({
                                    xtype: 'box',
                                    html: j,
                                    style: 'text-align: center'
                                });
                            } else {
                                contents.push({
                                    xtype: 'box',
                                    html: '과부족',
                                    style: 'text-align: center'
                                });   
                            }
                        } else {
                            if (j == 0) {
                                contents.push({
                                    xtype: 'box',
                                    width: 104,
                                    html: contentsNames[i-1] + ':',
                                    style: 'text-align: right'
                                });
                            } else if (j == 6) {
                                if (i == 1) {
                                    contents.push({
                                        xtype: 'box',
                                        id: gu.id('contents-' + '0' + i + '-0' + j),
                                        width: 50,
                                        html: '-' + gm.me().renderNumber(bmQuan),
                                        xPos: j,
                                        style: 'color: blue; font-weight: bold; text-align: center'
                                    });
                                } else if (i == 2) {
                                    contents.push({
                                        xtype: 'box',
                                        id: gu.id('contents-' + '0' + i + '-0' + j),
                                        width: 50,
                                        html: '-' + gm.me().renderNumber(bmQuan * moduleQuan),
                                        xPos: j,
                                        style: 'color: blue; font-weight: bold; text-align: center'
                                    });
                                } else {
                                    contents.push({
                                        xtype: 'box',
                                        width: 50,
                                        html: '-',
                                        style: 'text-align: center'
                                    });
                                }
                            } else {
                                if (i == 4) {
                                    contents.push({
                                        xtype: 'numberfield',
                                        id: gu.id('contents-' + '0' + i + '-0' + j),
                                        name: 'contents-' + '0' + i + '-0' + j,
                                        xPos: j,
                                        hideLabel: true,
                                        width: 88,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: function (t, e) {
                                                var value = t.value;
                                                var setQuan = gu.getCmp('contents-' + '01-0' + this.xPos);
                                                var pcbQuan = gu.getCmp('contents-' + '02-0' + this.xPos);
                                                var costQuan = gu.getCmp('contents-' + '05-0' + this.xPos);
                                                var remainQuan = gu.getCmp('contents-' + '06-0' + this.xPos);

                                                var molSetQuan = gu.getCmp('contents-' + '01-06');
                                                var molPcbQuan = gu.getCmp('contents-' + '02-06');

                                                var newSetQuan = parseInt(value / moduleQuan / chipQuan);
                                                var newPcbQuan = parseInt(value / chipQuan);
                                                var newCostQuan = newSetQuan * moduleQuan * chipQuan;
                                                var newRemainQuan = value - newCostQuan;

                                                setQuan.setValue(newSetQuan);
                                                pcbQuan.setValue(newPcbQuan);
                                                costQuan.setValue(newCostQuan);
                                                remainQuan.setValue(newRemainQuan);

                                                var totalSetQuan = 0;
                                                var totalPcbQuan = 0;

                                                for (var k = 1; k <= 5; k++) {

                                                    var curSetQuan = gu.getCmp('contents-' + '01-0' + k).getValue();
                                                    var curPcbQuan = gu.getCmp('contents-' + '02-0' + k).getValue();

                                                    if (curSetQuan !== null && curSetQuan > -1) {
                                                        totalSetQuan += parseInt(curSetQuan);
                                                    }
                                                    if (curPcbQuan !== null && curPcbQuan > -1) {
                                                        totalPcbQuan += parseInt(curPcbQuan);
                                                    }
                                                }

                                                var newMolSetQuan = totalSetQuan - bmQuan;
                                                var newMolPcbQuan = totalPcbQuan - (bmQuan * moduleQuan);





                                                molSetQuan.setHtml(gm.me().renderNumber(newMolSetQuan));
                                                molPcbQuan.setHtml(gm.me().renderNumber(newMolPcbQuan));

                                                if (bmQuan > totalSetQuan) {
                                                    molSetQuan.setStyle({'color': 'blue'});
                                                } else if (bmQuan < totalSetQuan) {
                                                    molSetQuan.setHtml('+' + gm.me().renderNumber(newMolSetQuan));
                                                    molSetQuan.setStyle({'color': 'red'});
                                                } else {
                                                    molSetQuan.setStyle({'color': 'green'});
                                                }

                                                if ((bmQuan * moduleQuan) > totalPcbQuan) {
                                                    molPcbQuan.setStyle({'color': 'blue'});
                                                } else if ((bmQuan * moduleQuan) < totalPcbQuan) {
                                                    molPcbQuan.setHtml('+' + gm.me().renderNumber(newMolPcbQuan));
                                                    molPcbQuan.setStyle({'color': 'red'});
                                                } else {
                                                    molPcbQuan.setStyle({'color': 'green'});
                                                }
                                            }
                                        }
                                    });
                                } else if (i != 3) {
                                    contents.push({
                                        xtype: 'numberfield',
                                        id: gu.id('contents-' + '0' + i + '-0' + j),
                                        name: 'contents-' + '0' + i + '-0' + j,
                                        hideLabel: true,
                                        renderer: function(value) {
                                            return gm.me().renderNumber(value);
                                        },
                                        width: 88
                                    });
                                } else {
                                    contents.push({
                                        xtype: 'textfield',
                                        id: gu.id('contents-' + '0' + i + '-0' + j),
                                        name: 'contents-' + '0' + i + '-0' + j,
                                        hideLabel: true,
                                        width: 88
                                    });
                                }
                            }

                        }
                    }
                }

                gm.me().requestform = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false ,
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
                            title: '작업지시일과 특이사항을 기재하시기 바랍니다.',
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: [
                                {
                                    xtype: 'hiddenfield',
                                    name: 'big_pcs_code',
                                    columnWidth: 0.5,
                                    value: selection.get('sp_code')
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'out_maker',
                                    columnWidth: 0.5,
                                    value: 79090000015
                                },
                                {
                                    xtype: 'datefield',
                                    name: 'aprv_date',
                                    fieldLabel: '작업지시일',
                                    format: 'Y-m-d',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    value: new Date(),
                                    columnWidth: 0.983
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '97%',
                                    name: 'specialNote',
                                    fieldLabel: '특이사항',
                                    columnWidth: 0.983
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    anchor: '97%',
                                    name: 'bm_quan',
                                    fieldLabel: '생산요청수량',
                                    value: bmQuan,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                                    columnWidth: 0.983
                                },{
                                    xtype: 'numberfield',
                                    anchor: '97%',
                                    name: 'srcadt_varchar18',
                                    fieldLabel: '모듈수량',
                                    value: moduleQuan,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                                    columnWidth: 0.983
                                },{
                                    xtype: 'numberfield',
                                    anchor: '97%',
                                    name: 'srcadt_varchar26',
                                    fieldLabel: 'CHIP 수량',
                                    value: chipQuan,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                                    columnWidth: 0.983
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            layout: {
                                type: 'table',
                                columns: 7
                            },
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items: contents
                        }
                    ]
                });
                break;
            default:
                gm.me().requestform = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false ,
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
                            title: '공정별 담당사(라인)와 작업지시일을 기재하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'hiddenfield',
                                    name: 'big_pcs_code',
                                    value: selection.get('sp_code')
                                },
                                {
                                    fieldLabel: '인서트',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'out_maker',
                                    allowBlank: false,
                                    id: gu.id('out_maker'),
                                    mode: 'local',
                                    displayField: 'dept_name',
                                    store: aStore,
                                    sortInfo: {field: 'create_date', direction: 'DESC'},
                                    valueField: 'unique_id_long',
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            gu.getCmp('out_maker2').setValue(record.get('unique_id_long'));
                                            gu.getCmp('out_maker3').setValue(record.get('unique_id_long'));
                                        }
                                    }
                                },
                                {
                                    fieldLabel: '리터치',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'out_maker2',
                                    allowBlank: false,
                                    id: gu.id('out_maker2'),
                                    mode: 'local',
                                    displayField: 'dept_name',
                                    store: aStore,
                                    sortInfo: {field: 'create_date', direction: 'DESC'},
                                    valueField: 'unique_id_long',
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            gu.getCmp('out_maker3').setValue(record.get('unique_id_long'));
                                        }
                                    }
                                },
                                {
                                    fieldLabel: '조립검사',
                                    xtype: 'combo',
                                    anchor: '97%',
                                    name: 'out_maker3',
                                    allowBlank: false,
                                    id: gu.id('out_maker3'),
                                    mode: 'local',
                                    displayField: 'dept_name',
                                    store: aStore,
                                    sortInfo: {field: 'create_date', direction: 'DESC'},
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
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    value: new Date()
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '97%',
                                    name: 'specialNote',
                                    fieldLabel: '특이사항'
                                }
                            ]
                        }
                    ]
                });
                break;
        }

        var prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: gm.getMC('CMD_Production_Order', '계획수립'),
            width: myWidth,
            height: myHeight,
            items: gm.me().requestform,
            buttons: [
                {
                    text: CMD_OK,
                    scope:this,
                    handler:function(){

                        prWin.setLoading(true);

                        var form = gm.me().requestform.getForm();

                        console_logs('form value', form.getValues());

                        var val = form.getValues();

                        var selectedgrid = gm.me().grid.getSelectionModel().getSelection();
                        var lot_value = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_varchar6');

                        var cartmaparr =[];
                        var po_quan = 0;
                        var reserved_double4 = 0;
                        var selections = selectedgrid;

                        for(var i = 0; i< selections.length; i++) {

                            var rec = selections[i];
                            var uid =  rec.get('unique_id_long');  //CARTMAP unique_id

                            cartmaparr.push(uid);

                            var po_quan_unit = rec.get('quan');  // 소그룹 po 수량

                            po_quan = po_quan + po_quan_unit;

                            var tmp_weight = rec.get('mass');   //  소그룹 po 중량

                            reserved_double4 = reserved_double4 + tmp_weight;
                        }

                        var order_com_unique = selections[0].get('order_com_unique');

                        var ac_uid = selections[0].get('ac_uid');

                        var out_makers = [];

                        out_makers.push(val['out_maker']);
                        out_makers.push(val['out_maker2']);
                        out_makers.push(val['out_maker3']);

                        var objs = [];
                        var canProducePlan = true;
                        var otherContents = null;

                        var spCode = selectedgrid[0].get('sp_code');

                        if (spCode == 'KL') {

                            var molHtml = gu.getCmp('contents-01-06').html;

                            if (molHtml === '0') {
                                for (var i = 1; i <= 5; i++) {

                                    var setQuan = gu.getCmp('contents-01-0' + i).getValue();

                                    if (setQuan == null || setQuan.length < 1) {
                                        break;
                                    }

                                    var objv = {};

                                    objv['setQuan'] = gu.getCmp('contents-01-0' + i).getValue();
                                    objv['pcbQuan'] = gu.getCmp('contents-02-0' + i).getValue();
                                    objv['rank'] = gu.getCmp('contents-03-0' + i).getValue();
                                    objv['outQuan'] = gu.getCmp('contents-04-0' + i).getValue();
                                    objv['costQuan'] = gu.getCmp('contents-05-0' + i).getValue();
                                    objv['remainQuan'] = gu.getCmp('contents-06-0' + i).getValue();

                                    objs.push(objv);
                                }

                                otherContents = Ext.JSON.encode(objs);
                            } else {
                                canProducePlan = false;
                            }
                        }

                        if (canProducePlan) {
                            Ext.Ajax.request({
                                url : CONTEXT_PATH + '/index/process.do?method=addProcessPlanWithOutMaker',
                                params:{
                                    po_no: lot_value,
                                    cartmap_uids: cartmaparr,
                                    ac_uid: ac_uid,
                                    reserved_varchar3 : val['big_pcs_code'],
                                    bigPcsCodes : val['big_pcs_code'],
                                    po_quan: po_quan,
                                    reserved_double4 : reserved_double4,
                                    order_com_unique : order_com_unique,
                                    aprv_date: val['aprv_date'],
                                    out_makers: out_makers,
                                    reserved_varchar2: val['specialNote'],
                                    otherContents: otherContents
                                },
                                success: function(val, action){
                                    if(prWin){
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                    gm.me().store.load();
                                },
                                failure: function(val, action) {
                                    if(prWin){
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gMain.selPanel.store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                    gMain.selPanel.store.load();
                                }
                            });
                        } else {
                            prWin.setLoading(false);
                            Ext.Msg.alert('', '과부족량을 확인하시기 바랍니다.');
                        }

                    }},

                {text: CMD_CANCEL,
                    scope:this,
                    handler:function(){
                        if(prWin){
                            prWin.close();
                        }
                    }}
            ]
        });

        prWin.show();
    },

    renderNumber: function(value, p, record) {
        var isNumber = true;
        if(value == null) {
            value = 0;
        }
        for(var i = 0; i < value.length; i++) {
            var charValue = value.charCodeAt(i);
            if(charValue < 48 || charValue > 57) {
                isNumber = false;
            }
        }

        if(typeof value == 'number' || isNumber){
            return Ext.util.Format.number(value, '0,00/i');
        } else {
            return value;
        }
    }
});