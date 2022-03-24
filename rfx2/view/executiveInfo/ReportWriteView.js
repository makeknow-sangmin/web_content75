Ext.define('Rfx2.view.executiveInfo.ReportWriteView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'report-write-view',
    initComponent: function() {

//        Ext.Ajax.setTimeout(10000000);
        Ext.Ajax.timeout= 1000000;

        //Ext.layout.FormLayout.prototype.trackLabels = true;
        Ext.each(this.columns, function(columnObj, index) {
            columnObj["editor"] = {clicksToEdit:2};
        });

        this.initSearchField();

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'v000',
            text: '요청일자',
            labelWidth: 50,
            sdate: new Date(),
            edate: Ext.Date.add(new Date(), Ext.Date.DAY, + 4),
        });

        this.addSearchField('v001');
        this.addSearchField('v003');
        this.addSearchField('output_lot');

        switch(this.link) {
            case 'XDT3':
                this.addSearchField (
                    {
                        type: 'combo'
                        ,field_id: 'bondingWireType'
                        ,store: "BondingWireTypeStore"
                        ,displayField: 'codeName'
                        ,emptyText: 'BW 구분'
                        ,valueField: 'systemCode'
                        ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
                    });
                break;
            case 'XDT6':
                this.addSearchField('customer');
                break;
            default:
                //모델을 통한 스토어 생성
                this.createStore('Rfx.model.ReportWrite', [{
                        property: 'user_name',
                        direction: 'ASC'
                    }],
                    gm.pageSize
                    ,{}
                    ,[]
                );
                break;
        }

        var cellediting = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        //사내발주 Action 생성
        this.calculateCpkAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-columns',
            text: 'Cpk계산',
            tooltip: 'Cpk계산',
            disabled: false,
            handler: function () {

            }
        });

        this.docuTplStore = Ext.create('Mplm.store.DocuTplStore', {});
        this.docEntityReportStore = Ext.create('Mplm.store.DocEntityReportStore', {});
        this.bufferDataStore = Ext.create('Mplm.store.PopIfReportStore', {});
        this.docDataArrayStore = Ext.create('Mplm.store.DocDataArrayStore', {});
        this.cpkStore = Ext.create('Mplm.store.CpkStore', {});
        this.storeTemplate = Ext.create('Mplm.store.RpFileInfoReportStore', {});
        this.ingredientStore = Ext.create('Mplm.store.TplDtlStore', {});
        this.pdStore = Ext.create('Mplm.store.PdStore', {});
        this.sbInfoStore = Ext.create('Mplm.store.SbInfoStore');

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            store: this.docuTplStore,
            cls : 'rfx-panel',
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            padding: '0 0 0 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            plugins: [cellediting],
            dockedItems : [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default',
                    margin: '0 0 0 0',
                    items: [{
                        width: '100%',
                        xtype: 'textfield',
                        id: gu.id('template_srch'),
                        name: 'template_srch',
                        enableKeyEvents: true,
                        emptyText: '템플릿',
                        readOnly: true,
                        fieldStyle: 'background-color: #EEEEEE; background-image: none;',
                        flex: 1,
                        listeners: {
                            change: function(f) {
                                if(f.value.length > 0) {
                                    gm.me().docuTplStore.getProxy().setExtraParam('temp_name', f.value);
                                    gm.me().docuTplStore.load();
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp(this.id).setValue('');
                            gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                            gm.me().storeViewTable.load();
                        }
                    }
                    ]
                })
            ],
            columns: [{
                text: '검색된 템플릿',
                flex: 1,
                dataIndex: 'temp_name'
            }]
        });

        this.gridTemplate = Ext.create('Ext.grid.Panel', {
            store: this.storeTemplate,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeTemplate),
            frame: false,
            border: true,
            layout          :'fit',
            forceFit: true,
            margin: '10 0 0 0',
            columns: [
                {
                    text: '템플릿(자재)명',
                    dataIndex: 'fname'
                },
                {
                    text: '작성일시',
                    dataIndex: 'create_date'
                },
                {
                    text: '작성자',
                    dataIndex: 'creator'
                }
            ],
            title: '성적서 출력',
            autoScroll: true,
            dockedItems : [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        {
                            id: gu.id('select_title'),
                            xtype: 'tbtext',
                            text: ''
                        },
                        '->',
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text:'다운로드',
                            listeners : [{
                                click: function() {

                                    var reportSelection = gm.me().gridTemplate.getSelectionModel().getSelection();

                                    if(reportSelection.length > 0) {

                                        var sel = reportSelection[0];
                                        var docuSplit = sel.get('fname').split('-');
                                        var value_key = docuSplit[docuSplit.length - 1];

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/examTest.do?method=printExamTest',
                                            params:{
                                                target_uid : sel.getId(),
                                                group_uid : sel.get('parent'),
                                                value_key : value_key,
                                                temp_name : sel.get('fname')
                                            },
                                            success : function(result, request) {
                                                var jsonData = Ext.JSON.decode(result.responseText);
                                                var excelPath = jsonData.excelPath;
                                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                top.location.href = url;
                                            },//Ajax success
                                            failure: function(result, request) {
                                                Ext.Msg.alert('오류', '성적서를 출력할 수 없습니다. 엑셀 템플릿 관리에서 각 항목 위치가 정확한지 확인하세요.');
                                            }
                                        });
                                    } else {
                                        Ext.Msg.alert('경고', '성적서를 선택하세요.');
                                    }
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('form'),
            bodyPadding: 10,
            autoScroll: true,
            flex: 1,
            fieldDefaults: {
                labelAlign: "right",
                labelWidth: 100,
            },
            enableDragDrop: true,
            viewConfig: {
                plugins: {
                    gridviewdragdrop: {
                        ddGroup: 'form-to-grid',
                        enableDrop: false
                    }
                }
            },
            items: [
                {
                    xtype: 'fieldset',
                    style: 'background-color: #F6F6F6; background-image: none;',
                    defaults: {
                        componentCls: "",
                        width: '100%',
                    },
                    layout: {
                        type: 'table',
                        columns: 2,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [
                        {
                            id: gu.id('temp_name'),
                            name:'temp_name',
                            xtype: 'textfield',
                            width: '100%',
                            readOnly: true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            fieldLabel: '품목',
                            value: ''
                        },
                        {
                            xtype: 'datefield',
                            id: gu.id('create_date'),
                            name:'create_date',
                            fieldLabel: '작성일자',
                            width: '100%',
                            value: new Date()
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'CELL 속성',
                    id: gu.id('cellProperty'),
                    style: 'background-color: #F6F6F6; background-image: none;',
                    defaults: {
                        componentCls: "",
                        width: '100%',
                    },
                    layout: {
                        type: 'table',
                        columns: 2,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: []
                },
                {
                    xtype: 'fieldset',
                    defaultType: 'textfield',
                    hidden: this.link == 'XDT3' ? false : true,
                    id: gu.id('arrayProperty'),
                    title: 'Sampling 속성',
                    style: 'background-color: #F6F6F6; background-image: none;',
                    layout: {
                        type: 'table',
                        columns: 7,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    defaults: {
                        componentCls: "",
                        width: '100%'
                    },
                    items: []
                },
                {
                    xtype: 'fieldset',
                    defaultType: 'textfield',
                    hidden: this.link == 'XDT3' ? false : true,
                    id: gu.id('cpkProperty'),
                    title: 'Cpk',
                    style: 'background-color: #F6F6F6; background-image: none;',
                    layout: {
                        type: 'table',
                        columns: 2,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    defaults: {
                        componentCls: "",
                        width: '100%'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            id: gu.id('c01'),
                            name: 'c01',
                            labelWidth: 120,
                            fieldLabel: 'B/L Cpk(단기)',
                            listeners: { 'render': function() { this.hide() } }
                        },
                        {
                            xtype: 'textfield',
                            id: gu.id('c02'),
                            name: 'c02',
                            labelWidth: 120,
                            fieldLabel: 'B/L Cpk(장기)',
                            listeners: { 'render': function() { this.hide() } }
                        },
                        {
                            xtype: 'textfield',
                            id: gu.id('c03'),
                            name: 'c03',
                            labelWidth: 120,
                            fieldLabel: 'E/L Cpk(단기)',
                            listeners: { 'render': function() { this.hide() } }
                        },
                        {
                            xtype: 'textfield',
                            id: gu.id('c04'),
                            name: 'c04',
                            labelWidth: 120,
                            fieldLabel: 'E/L Cpk(장기)',
                            listeners: { 'render': function() { this.hide() } }
                        },
                        {
                            xtype: 'textfield',
                            id: gu.id('c05'),
                            name: 'c05',
                            labelWidth: 120,
                            fieldLabel: 'Dia Cpk(단기)',
                            listeners: { 'render': function() { this.hide() } }
                        },
                        {
                            xtype: 'textfield',
                            id: gu.id('c06'),
                            name: 'c06',
                            labelWidth: 120,
                            fieldLabel: 'Dia Cpk(장기)',
                            listeners: { 'render': function() { this.hide() } }
                        },
                        {
                            xtype:'button',
                            id: gu.id('c_button'),
                            glyph: 'f019@FontAwesome',
                            text: 'Cpk 재계산',
                            width: '97%',
                            margin: '10 10 10 10',
                            disabled: true,
                            handler: function() {

                                var blArray = [];
                                var elArray = [];
                                var diaArray = [];

                                for(var i = 1; i <= 7; i++) {
                                    var labelValue = gu.getCmp('a0' + i);

                                    if(labelValue !== undefined && labelValue.html != null && labelValue.html.length > 1) {
                                        for(var j = 1; j <= 13; j++) {
                                            var value = gu.getCmp('a0' + i + '-val' + j).getValue();

                                            if(value !== undefined && value != null && value.length > 0) {
                                                switch(labelValue.html) {
                                                    case 'B/L':
                                                        blArray.push(value);
                                                        break;
                                                    case 'E/L':
                                                        elArray.push(value);
                                                        break;
                                                    case 'Diameter':
                                                        diaArray.push(value);
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                }

                                if(blArray.length != elArray.length) {
                                    Ext.Msg.alert('오류', 'B/L과 E/L의 샘플링 숫자가 맞지 않습니다');
                                } else if(blArray.length == 0 || elArray.length == 0) {
                                    Ext.Msg.alert('오류', 'B/L혹은 E/L의 샘플링 수가 0입니다');
                                } else {

                                    gm.me().tabView.getEl().mask("데이터 생성중...","x-mask-loading");

                                    gm.me().cpkStore.getProxy().setExtraParam('blList', blArray);
                                    gm.me().cpkStore.getProxy().setExtraParam('elList', elArray);

                                    gm.me().cpkStore.getProxy().setExtraParam('s_date', gu.getCmp('s_date_cpk').getValue());
                                    gm.me().cpkStore.getProxy().setExtraParam('e_date', gu.getCmp('e_date_cpk').getValue());

                                    gm.me().cpkStore.getProxy().setExtraParam('diaList', diaArray);
                                    gm.me().cpkStore.getProxy().setExtraParam('item_code',
                                        gm.me().grid.getSelectionModel().getSelection()[0].get('v003'));
                                    gm.me().cpkStore.getProxy().setExtraParam('output_lot',
                                        gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));

                                    //Cpk 로딩
                                    gm.me().cpkStore.load(function (record) {
                                        var data = record[0].data;
                                        var keys = Object.keys(data)

                                        for(var i = 0; i < keys.length; i++) {
                                            if(keys[i] != 'id') {
                                                var labelValue = gu.getCmp(keys[i]);
                                                labelValue.setValue(record[0].get(keys[i]).toFixed(3));
                                                //labelValue.show();
                                            }
                                        }

                                        for(var i = 1; i <= 6; i++) {
                                            var labelValue = gu.getCmp('c0'+i);
                                            labelValue.show();
                                            if(labelValue.getValue() == null || labelValue.getValue().length == 0) {
                                                var temp = 0;
                                                labelValue.setValue(temp.toFixed(3));
                                            }
                                        }
                                    });

                                    gm.me().tabView.getEl().unmask();
                                }
                            },
                            listeners: { 'render': function() { this.hide() } }
                        },
                    ]
                }
            ]
        });

        var itemApply = {
            frame: true,
            id: gu.id('gridContent'),
            title: '성적서 작성',
            region: 'east',
            tbar: {
                layout:'column',
                items: [
                    {
                        id: gu.id('output_lot'),
                        name:'output_lot',
                        xtype: 'textfield',
                        labelWidth: 50,
                        margin: '2 2 2 2',
                        width: 180,
                        readOnly: true,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                        fieldLabel: '출하LOT',
                        value: '',
                        listeners: {
                            change: function(f) {

                                if(f.value.length > 0) {
                                    if(gm.me().sbinfoData != null) {

                                        if(gm.me().grid.getSelectionModel().getSelection()[0].get('v003').substring(0, 2) != '1S') {
                                            gm.me().ingredientStore.getProxy().setExtraParam('output_lot', gm.me().sbinfoData.get('lot_no'));
                                        } else {
                                            gm.me().ingredientStore.getProxy().setExtraParam('v001', gm.me().sbinfoData.get('lot_no'));
                                            gm.me().ingredientStore.getProxy().setExtraParam('sb_lot', f.value);
                                        }

                                        gm.me().ingredientStore.load(function(record) {

                                            if(record.length > 0) {

                                                var tempArray = [];

                                                if(gm.me().grid.getSelectionModel().getSelection()[0].get('v003').substring(0, 2) == '1S') {

                                                    for(var i = 0; i < record.length; i++) {

                                                        if(gm.me().sbinfoData.get('lot_no') == record[i].get('lotNo')) {
                                                            tempArray.push(record[i]);
                                                        } else if(gu.getCmp('output_lot').value == record[i].get('lotNo')) {
                                                            tempArray.push(record[i]);
                                                        }

                                                    }
                                                    gm.me().selected_ingredient = tempArray;
                                                } else {
                                                    tempArray.push(record[0]);
                                                    gm.me().selected_ingredient = tempArray;
                                                }
                                            } else {
                                                gm.me().selected_ingredient = null;
                                            }
                                        });
                                    } else {

                                        var v003 = gm.me().grid.getSelectionModel().getSelection()[0].get('v003');

                                        var doLoadIngredientStore = true;

                                        if(gm.me().link == 'XDT3') {
                                            var manuf_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('v013');
                                            var output_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot');
                                            var manuf_lot_code = manuf_lot.substring(0, 2);
                                            var pk_code = v003.substring(0, 2);

                                            gm.me().ingredientStore.getProxy().setExtraParam('output_lot', output_lot);

                                            switch(pk_code) {
                                                case '11':
                                                case '13':
                                                case '15':
                                                    switch(manuf_lot_code) {
                                                        case 'AP':
                                                        case 'PC':
                                                        case 'PI':
                                                        case 'HA':
                                                            manuf_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('v024');
                                                            if(manuf_lot == null || manuf_lot.length < 1) {
                                                                doLoadIngredientStore = false;
                                                            }
                                                            gm.me().ingredientStore.getProxy().setExtraParam('manu_lot', manuf_lot.substring(0, manuf_lot.length - 1));
                                                            gm.me().ingredientStore.getProxy().setExtraParam('output_lot', null);
                                                            gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                                            gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                                                            break;
                                                        default:
                                                            gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                                                            gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                                            break;
                                                    }
                                                    break;
                                                case '10':
                                                case '14':
                                                    gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                                                    gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                                    break;
                                                default:
                                                    gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                                                    gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                                    break;
                                            }
                                        }


                                        if(doLoadIngredientStore) {
                                            gm.me().ingredientStore.load(function(record) {

                                                if(record.length > 0) {
                                                    // if(temp_name.substring(0, 2) == '1S') {
                                                    //     var tempArray = [];
                                                    //     for(var i = 0; i < record.length; i++) {
                                                    //         if(gm.me().sbinfoData.get('lot_no') == record[i].get('lotNo')) {
                                                    //             tempArray.push(record[i]);
                                                    //         } else if(gu.getCmp('output_lot').value == record[i].get('lotNo')) {
                                                    //             tempArray.push(record[i]);
                                                    //         }
                                                    //     }
                                                    //     gm.me().selected_ingredient = tempArray;
                                                    // } else {
                                                        var tempArray = [];
                                                        tempArray.push(record[0]);
                                                        gm.me().selected_ingredient = tempArray;
                                                    //}
                                                } else {
                                                    gm.me().selected_ingredient = null;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        },
                    },

                    {
                        id: gu.id('s_date_cpk'),
                        name: 's_date',
                        labelWidth: 50,
                        fieldLabel: '장기Cpk',
                        format: 'Y-m-d',
                        margin: '2 2 2 2',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                        xtype: 'datefield',
                        hidden: this.link == 'XDT3' ? false : true,
                        //value: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
                        width: 158
                    }, {
                        xtype: 'label',
                        text: "~",
                        style: 'color:black;',
                        hidden: this.link == 'XDT3' ? false : true,
                        margin: '2 2 2 2'
                    }, {
                        id: gu.id('e_date_cpk'),
                        name: 'e_date',
                        format: 'Y-m-d',
                        margin: '2 2 2 2',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                        xtype: 'datefield',
                        hidden: this.link == 'XDT3' ? false : true,
                        value: new Date(),
                        width: 98
                    },

                    '->',
                    {
                         xtype:'button',
                         glyph: 'f0c7@FontAwesome',
                         text: '인터페이스 호출',
                         margin: '2 2 2 2',
                         handler: function() {
                             gm.me().callInterFaceHandler();
                         }
                     },
                    {
                        xtype:'button',
                        glyph: 'f019@FontAwesome',
                        hidden: gMain.menu_check == true ? false : true,
                        text: this.link == 'XDT3' ? '성분불러오기' : '성분/SIZE불러오기',
                        margin: '2 2 2 2',
                        handler: function() {
                            gm.me().prwinopen();
                        }
                    },
                    {
                        xtype:'button',
                        glyph: 'f019@FontAwesome',
                        text: 'Pd함량',
                        hidden: (this.link == 'XDT3' && gMain.menu_check == true) ? false : true,
                        margin: '2 2 2 2',
                        handler: function() {
                            gm.me().prwin2open();
                        }
                    },
                    {
                        iconCls: null,
                        glyph: 'f0c5@FontAwesome',
                        text: '불러오기',
                        hidden: gMain.menu_check == true ? false : true,
                        margin: '2 2 2 2',
                        handler: function() {

                            var temp_name = gm.me().temp_name;
                            var item_type = gm.me().grid.getSelectionModel().getSelection()[0].get('v003').substring(0, 2) == '1S' ? 'SB' : 'BW';

                            if(item_type == 'BW') {

                                if(temp_name=='' || gm.me().gridViewTable.getSelectionModel().getSelection().length == 0) {
                                    Ext.Msg.alert('경고', '품목 및 템플릿을 먼저 선택하세요.');
                                    return;
                                } else {

                                    gm.me().getEl().mask("데이터 생성중...","x-mask-loading");

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=makeSamplingData',
                                        params: {
                                            "item_code": gm.me().grid.getSelectionModel().getSelection()[0].get('v003'),
                                            "temp_name": temp_name,
                                            "out_lot": gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot')
                                        },
                                        scope : this,
                                        success : function(result, request) {
                                            var json = Ext.util.JSON.decode(result.responseText);
                                            console_logs('json', json);

                                            gm.me().loadData();

                                            if(json != null && json.reason[0] != null && json.reason[0].length > 0) {
                                                Ext.Msg.alert('안내', json.reason[0]);
                                            }
                                        },
                                        failure: function (result, request) {
                                            gm.me().loadData();
                                        }
                                    });
                                }
                            } else {
                                gm.me().loadData();
                            }
                        }
                    },
                    {
                        iconCls: null,
                        glyph: 'f0c7@FontAwesome',
                        text: '저장',
                        hidden: gMain.menu_check == true ? false : true,
                        margin: '2 2 2 2',
                        handler: function() {

                            var msg = '저장 하시겠습니까?';
                            var myTitle = '';
                            Ext.MessageBox.show({
                                title: myTitle,
                                msg: msg,
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function (btn) {
                                    if (btn == "no") {
                                        MessageBox.close();
                                    } else {
                                        var docu_entity_uids = [];
                                        var values = [];
                                        var poses = [];
                                        var cellLength = gu.getCmp('cellProperty').items.items.length;

                                        for (var i = 1; i <= cellLength; i++) {

                                            if (i < 10) {
                                                var labelValue = gu.getCmp('v0' + i);
                                            } else {
                                                var labelValue = gu.getCmp('v' + i);
                                            }


                                            if(labelValue.name != null && labelValue.name > 0) {
                                                docu_entity_uids.push(labelValue.name);
                                                values.push(labelValue.getValue());
                                                poses.push(0);
                                            }
                                        }

                                        for (var i = 1; i <= 7; i++) {
                                            var labelValue = gu.getCmp('a0' + i);
                                            if(labelValue != undefined && labelValue.html != null && labelValue.html.length > 1) {
                                                for(var j = 1; j <= 13; j++) {
                                                    var value = gu.getCmp('a0' + i + '-val' + j);
                                                    docu_entity_uids.push(labelValue.name);
                                                    values.push(value.getValue());
                                                    poses.push(j-1);
                                                }
                                            }
                                        }
                                        var item_type = gm.me().grid.getSelectionModel().getSelection()[0].get('v003').substring(0, 2) == '1S' ? 'SB' : 'BW';
                                        var r_date = gm.me().grid.getSelectionModel().getSelection()[0].get('v000');

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/examTest.do?method=insertReportValues',
                                            params:{
                                                "docu_entity_uids": docu_entity_uids,
                                                "values": values,
                                                "docutpl_uid": gm.me().docutpl_uid,
                                                "temp_name": gm.me().temp_name,
                                                "output_lot": gu.getCmp('output_lot').getValue(),
                                                "poses": poses,
                                                "item_type": item_type,
                                                "request_date": r_date
                                            },
                                            success : function(result, request) {
                                                gm.me().storeTemplate.getProxy().setExtraParam('parent', gm.me().docutpl_uid);
                                                gm.me().storeTemplate.load();
                                                Ext.Msg.alert('결과', '저장 되었습니다.');
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }
                                }//fn function(btn)
                            });
                        }
                    }]
            },
            layout: {
                type: 'card'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [form],
            activeItem: 0
        };

        this.tabView = Ext.create('Ext.tab.Panel', {
            region: 'center',
            collapsible: false,
            border: true,
            // title: '성적서 작성',
            width: '65%',
            margin: '5 0 0 0',
            items: [
                itemApply,
                this.gridTemplate
            ]
            ,
            listeners: {
                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
                    //gm.me().tabchangeHandlerDoc(tabPanel, newTab, oldTab, eOpts);
                }
            }
        });

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE', 'EDIT', 'VIEW'
            ],
            RENAME_BUTTONS: []
        });

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(arr);

        var today = Ext.Date.format(new Date(), "Y-m-d");
        var afterday = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, + 4), "Y-m-d");

        this.store.getProxy().setExtraParam('v000', '%' + today + ':' + afterday + '%');
        this.storeLoad();

        Ext.apply(this, {
            layout: 'border',
            //bodyBorder: true,
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '55%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '75%',
                        items: [this.grid]
                    }, this.gridViewTable]
                },
                this.tabView

            ]
        });

        this.grid.forceFit = false;

        this.grid.getSelectionModel().on({

            selectionchange: function(sm, selections) {

                var rec = (selections != null && selections.length > 0) ? selections[0] : null;

                if(rec != null) {
                    console_logs('rec', rec);

                    gm.me().selected_ingredient = null;

                    gm.me().bufferDataStore.getProxy().setExtraParam('unique_id_long', rec.get('unique_id_long'));

                    var temp_name = rec.get('v003');

                    gm.me().output_lot = rec.get('output_Lot');
                    gm.me().manu_lot = rec.get('v013');

                    gm.me().ingredientStore.getProxy().setExtraParams({});
                    // gm.me().ingredientStore.getProxy().setExtraParam('output_lot', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('v001', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('sb_lot', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('manu_lot', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('type', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('s_date', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('e_date', null);
                    // gm.me().ingredientStore.getProxy().setExtraParam('not_only_first_manu_lot', null);


                    //제조 LOT에 따른 성분 스토어 LOAD
                    if(isNaN(gm.me().output_lot)) {
                        gm.me().ingredientStore.getProxy().setExtraParam('output_lot', gm.me().output_lot);
                    }
                    if(gm.me().sbinfoData != null) {
                        gm.me().ingredientStore.getProxy().setExtraParam('v001', gm.me().sbinfoData.get('lot_no'));
                        if(isNaN(gm.me().output_lot)) {
                            gm.me().ingredientStore.getProxy().setExtraParam('sb_lot', gm.me().output_lot);
                        }
                    }

                    var v003 = selections[0].get('v003');

                    var doLoadIngredientStore = true;

                    if(gm.me().link == 'XDT3') {
                        var manuf_lot = selections[0].get('v013');
                        var manuf_lot_code = manuf_lot.substring(0, 2);
                        var pk_code = v003.substring(0, 2);

                        switch(pk_code) {
                            case '11':
                            case '13':
                            case '15':
                                switch(manuf_lot_code) {
                                    case 'AP':
                                    case 'PC':
                                    case 'PI':
                                    case 'HA':
                                        manuf_lot = selections[0].get('v024');
                                        if(manuf_lot == null || manuf_lot.length < 1) {
                                            doLoadIngredientStore = false;
                                        }
                                        gm.me().ingredientStore.getProxy().setExtraParam('manu_lot', manuf_lot.substring(0, manuf_lot.length - 1));
                                        gm.me().ingredientStore.getProxy().setExtraParam('output_lot', null);
                                        gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                        gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                                        break;
                                    default:
                                        gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                                        gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                        break;
                                }
                                break;
                            case '10':
                            case '14':

                                gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                                gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                break;
                            default:
                                gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                                gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                                break;
                        }
                    }

                    if(doLoadIngredientStore) {
                        gm.me().ingredientStore.load(function(record) {

                            if(record.length > 0) {
                                if(temp_name.substring(0, 2) == '1S') {
                                    var tempArray = [];
                                    for(var i = 0; i < record.length; i++) {
                                        if(gm.me().sbinfoData.get('lot_no') == record[i].get('lotNo')) {
                                            tempArray.push(record[i]);
                                        } else if(gu.getCmp('output_lot').value == record[i].get('lotNo')) {
                                            tempArray.push(record[i]);
                                        }
                                    }
                                    gm.me().selected_ingredient = tempArray;
                                } else {
                                    var tempArray = [];
                                    tempArray.push(record[0]);
                                    gm.me().selected_ingredient = tempArray;
                                }
                            } else {
                                gm.me().selected_ingredient = null;
                            }
                        });
                    }

                    switch(temp_name.substring(0, 2)) {
                        case '1S':
                            gm.me().sbInfoStore.getProxy().setExtraParam('item_code', rec.get('v003'));
                            gm.me().sbInfoStore.getProxy().setExtraParam('sid', rec.get('v023'));
                            gm.me().sbInfoStore.load(function(record) {
                                gm.me().sbinfoData = record[0];
                            });

                            gu.getCmp('template_srch').setReadOnly(true);
                            gu.getCmp('output_lot').setReadOnly(false);
                            gu.getCmp('output_lot').setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            gu.getCmp('template_srch').setFieldStyle('background-color: #F0F0F0; background-image: none;');
                            gm.me().docuTplStore.getProxy().setExtraParam('temp_type', 'SB');
                            gm.me().docuTplStore.getProxy().setExtraParam('temp_name', '');
                            gu.id('template_srch').value = '';
                            gm.me().docuTplStore.load();
                            break;
                        default:
                            gu.getCmp('template_srch').setReadOnly(false);
                            gu.getCmp('output_lot').setReadOnly(true);
                            gu.getCmp('output_lot').setValue(gm.me().output_lot);
                            gu.getCmp('template_srch').setValue(temp_name);
                            gm.me().docuTplStore.getProxy().setExtraParam('temp_type', '');
                            gu.getCmp('output_lot').setFieldStyle('background-color: #F0F0F0; background-image: none;');
                            gu.getCmp('template_srch').setFieldStyle('background-color: #D6E8F6; background-image: none;');
                            break;
                    }
                }
            }
        });

        this.gridViewTable.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                var selections = gm.me().gridViewTable.getSelectionModel().getSelection();
                var rec = (selections != null && selections.length > 0) ? selections[0] : null;

                if(rec != null) {

                    var gridSelection = gm.me().grid.getSelectionModel().getSelection()[0];

                    gm.me().docutpl_uid = selections[0].getId();
                    gm.me().temp_name = selections[0].get('temp_name');

                    gu.getCmp('output_lot').setValue(gm.me().output_lot);

                    // //제조 LOT에 따른 성분 스토어 LOAD
                    // if(isNaN(gm.me().output_lot)) {
                    //     gm.me().ingredientStore.getProxy().setExtraParam('output_lot', gm.me().output_lot);
                    // }
                    // if(gm.me().sbinfoData != null) {
                    //     gm.me().ingredientStore.getProxy().setExtraParam('v001', gm.me().sbinfoData.get('lot_no'));
                    //     if(isNaN(gm.me().output_lot)) {
                    //         gm.me().ingredientStore.getProxy().setExtraParam('sb_lot', gm.me().output_lot);
                    //     }
                    // }
                    //
                    // var v003 = gm.me().grid.getSelectionModel().getSelection()[0].get('v003');
                    //
                    // var doLoadIngredientStore = true;
                    //
                    // if(gm.me().link == 'XDT3') {
                    //     var manuf_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('v013');
                    //     var manuf_lot_code = manuf_lot.substring(0, 2);
                    //     var pk_code = v003.substring(0, 2);
                    //
                    //     switch(pk_code) {
                    //         case '11':
                    //         case '13':
                    //         case '15':
                    //             switch(manuf_lot_code) {
                    //                 case 'AP':
                    //                 case 'PC':
                    //                 case 'PI':
                    //                 case 'HA':
                    //                     manuf_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('v024');
                    //                     if(manuf_lot == null || manuf_lot.length < 1) {
                    //                         doLoadIngredientStore = false;
                    //                     }
                    //                     gm.me().ingredientStore.getProxy().setExtraParam('manu_lot', manuf_lot.substring(0, manuf_lot.length - 1));
                    //                     gm.me().ingredientStore.getProxy().setExtraParam('output_lot', null);
                    //                     gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                    //                     gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                    //                     break;
                    //                 default:
                    //                     gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                    //                     gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                    //                     break;
                    //             }
                    //             break;
                    //         case '10':
                    //         case '14':
                    //             gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                    //             gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                    //             break;
                    //         default:
                    //             gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                    //             gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                    //             break;
                    //     }
                    // }
                    //
                    //
                    // if(doLoadIngredientStore) {
                    //     gm.me().ingredientStore.load(function(record) {
                    //
                    //         if(record.length > 0) {
                    //             if(temp_name.substring(0, 2) == '1S') {
                    //                 var tempArray = [];
                    //                 for(var i = 0; i < record.length; i++) {
                    //                     if(gm.me().sbinfoData.get('lot_no') == record[i].get('lotNo')) {
                    //                         tempArray.push(record[i]);
                    //                     } else if(gu.getCmp('output_lot').value == record[i].get('lotNo')) {
                    //                         tempArray.push(record[i]);
                    //                     }
                    //                 }
                    //                 gm.me().selected_ingredient = tempArray;
                    //             } else {
                    //                 var tempArray = [];
                    //                 tempArray.push(record[0]);
                    //                 gm.me().selected_ingredient = tempArray;
                    //             }
                    //         } else {
                    //             gm.me().selected_ingredient = null;
                    //         }
                    //     });
                    // }


                    //템플릿 스토어 LOAD
                    gm.me().storeTemplate.getProxy().setExtraParam('parent', gm.me().docutpl_uid);
                    gm.me().storeTemplate.load();

                    var temp_name = gridSelection.get('v003');
                    var real_temp_name = gm.me().gridViewTable.getSelectionModel().getSelection()[0].get('temp_name');
                    var f1 = gu.getCmp('temp_name');
                    f1.setValue(temp_name);

                    gm.me().docEntityReportStore.getProxy().setExtraParam('group_uid', rec.get('unique_id_long'));
                    gm.me().docEntityReportStore.load(function (record) {

                        var cell_count = 1;
                        var array_count = 1;

                        gm.me().removeCellProperty();
                        gm.me().removeArrayProperty();

                        for (var j = 0; j < record.length; j++) {
                            var rec = record[j];
                            var position = rec.get('position');
                            var colspan = rec.get('colspan');
                            var rowspan = rec.get('rowspan');
                            var max_cnt = rec.get('max_cnt');

                            if(position.length > 0) {
                                if (max_cnt > 1) {

                                    gm.me().addArrayProperty(array_count);

                                    var labelValue = gu.getCmp('a0' + array_count);

                                    labelValue.name = rec.getId();
                                    labelValue.viewprop_uid = rec.get('viewprop_uid');
                                    labelValue.update(rec.get('title'));
                                    array_count++;
                                } else {
                                    gm.me().addCellProperty(cell_count);

                                    if (cell_count < 10) {
                                        var labelValue = gu.getCmp('v0' + cell_count);
                                    } else {
                                        var labelValue = gu.getCmp('v' + cell_count);
                                    }

                                    labelValue.setValue('');

                                    labelValue.name = rec.getId();
                                    labelValue.viewprop_uid = rec.get('viewprop_uid');
                                    labelValue.show();
                                    labelValue.labelEl.update(rec.get('title'));
                                    cell_count++;
                                }
                            }
                        }
                        // 배열 데이터
                        gm.me().docDataArrayStore.getProxy().setExtraParam('value_key',
                            real_temp_name + '-' + gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
                        gm.me().docDataArrayStore.getProxy().setExtraParam('group_uid', -1);
                        gm.me().docDataArrayStore.load(function (record) {

                            for(var i = 1; i <= 7; i++) {

                                var labelValue = gu.getCmp('a0' + i);

                                if(labelValue != undefined && labelValue.html.length > 1) {

                                    labelValue.show();

                                    for(var j = 1; j <= 13; j++) {
                                        var textValue = gu.getCmp('a0' + i + '-val' + j);
                                        textValue.show();
                                    }
                                }
                            }


                        });

                        for(var i = 0; i < 6; i++) {
                            gu.getCmp('c0'+(i+1)).setValue('');
                        }

                        gu.getCmp('c_button').setDisabled(true);
                    });
                }
            }
        });

        this.callParent(arguments);
    },//샘플데이터중 단일 데이터일때
    resetForm: function() {
        for (var i = 1; i < 13; i++) {

            if (i < 10) {
                var labelValue = gu.getCmp('v0' + i);
            } else {
                var labelValue = gu.getCmp('v' + i);
            }

            labelValue.setValue('');
            labelValue.name = '';
            labelValue.labelEl.update('.');
        }
        for (var i = 1; i <= 7; i++) {
            var labelValue = gu.getCmp('a0' + i);
            labelValue.update('');
        }
    },

    callInterFaceHandler: function() {
        Ext.MessageBox.show({
            title: '확인',
            msg: '호출하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {
                if (btn == 'yes') {
                    gMain.setCenterLoading(true);
//                    Ext.Msg.alert('알림', '업데이트 중입니다. 잠시만 기다려주세요.', function() {});
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/database/if.do?method=callInterFaceDb',
                        success: function(result, request) {
                        	console_logs('>> result', result);
                        	console_logs('>> request', request);
                            // var jsonData = Ext.JSON.decode(result.responseText);
                            // var result = jsonData.datas;
                            // // alert(result);
                            // if(result == 1) {
                            //     gMain.setCenterLoading(false);
                            //     Ext.Msg.alert('에러발생', '개발자에게 문의해주세요.', function() {});
                            //     return;
                           // } else {
                                gm.me().showToast('알림', '완료되었습니다.');
                                gMain.setCenterLoading(false);
                            //}
                        },
                        failure: extjsUtil.failureMessage
                    });
                } else {
                    return;
                }
            }
        });
    },

    prwinopen: function() {

        var action = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: '조건 검색',
            handler: function () {
                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    gm.me().ingredientStore.getProxy().setExtraParam(item.name, item.value);
                }

                gm.me().ingredientStore.getProxy().setExtraParam('type', gm.me().link == 'XDT3' ? 'BW' : 'SB');

                if(gu.getCmp('manu_lot').value.length > 0) {
                    gm.me().ingredientStore.getProxy().setExtraParam('output_lot', null);
                    if(gm.me().link == 'XDT3') {
                        gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                        gm.me().ingredientStore.getProxy().setExtraParam('s_date', null);
                        gm.me().ingredientStore.getProxy().setExtraParam('e_date', null);
                    }
                } else {
                    gm.me().ingredientStore.getProxy().setExtraParam('output_lot', gm.me().output_lot);
                }

                gm.me().ingredientGrid.getStore().load();
            }
        });

        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [action]
        });

        this.typeStore = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data : [
                {"code":"SISB", "name":"SIZE"},
                {"code":"INSB", "name":"성분"}
            ]
        });

        var searchToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default1',
            style:'color:white;',
            items: [
                {
                    xtype: 'label',
                    width: 50,
                    text: '작성시간',
                    style: 'color:white;'
                }, {
                    id: gu.id('s_date_arv'),
                    name: 's_date',
                    format: 'Y-m-d',
                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    xtype: 'datefield',
                    value: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
                    width: 98
                }, {
                    xtype: 'label',
                    text: "~",
                    style: 'color:white;'
                }, {
                    id: gu.id('e_date_arv'),
                    name: 'e_date',
                    format: 'Y-m-d',
                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    xtype: 'datefield',
                    value: new Date(),
                    width: 98
                },
                {
                    xtype: 'combo',
                    name: 'sbType',
                    hidden: this.link == 'XDT3' ? true : false,
                    emptyText: '성분/SIZE 구분',
                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                    width: 120,
                    store: this.typeStore,
                    // id:'temp_type',
                    anchor: '80%',
                    valueField: 'code',
                    displayField: 'name',
                    //emptyText: '선택해주세요.',
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function () {
                            return '<div data-qtip="{code}">{name}</div>';
                        }
                    }
                },{
                    xtype: 'textfield',
                    id: gu.id('manu_lot'),
                    name: 'manu_lot',
                    emptyText: 'LOT 번호',
                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                    width: 180,
                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger'
                },
                '->'
            ]
        });

        gm.me().ingredientGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().ingredientStore,
            cls : 'rfx-panel',
            dockedItems : [buttonToolbar, searchToolbar],
            selModel : Ext.create("Ext.selection.CheckboxModel", {mode : 'SINGLE'}),
            multiSelect: false,
            bbar: getPageToolbar(gm.me().ingredientStore),
            autoScroll : true,
            height: 408,
            border: true,
            padding: '0 0 0 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            columns: [{
                text: 'LOT번호',
                width: 150,
                dataIndex: 'lotNo'
            },
                {
                    text: '작성시간',
                    width: 120,
                    dataIndex: 'Date'
                },
                {
                    text: '주요값',
                    width: 400,
                    dataIndex: 'keys'
                }]
        });

        gm.me().ingredientStore.getProxy().setExtraParam('type', this.link == 'XDT3' ? 'BW' : 'SB');

        var v003 = gm.me().grid.getSelectionModel().getSelection()[0].get('v003');

        var doLoadIngredientStore = true;

        if(this.link == 'XDT3') {
            var manuf_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('v013');
            var manuf_lot_code = manuf_lot.substring(0, 2);
            var pk_code = v003.substring(0, 2);

            gm.me().ingredientStore.getProxy().setExtraParam('not_only_first_manu_lot', 'Y');

            switch(pk_code) {
                case '11':
                case '13':
                case '15':
                    switch(manuf_lot_code) {
                        case 'AP':
                        case 'PC':
                        case 'PI':
                        case 'HA':
                            manuf_lot = gm.me().grid.getSelectionModel().getSelection()[0].get('v024');
                            manuf_lot = manuf_lot.substring(0, manuf_lot.length - 1);
                            if(manuf_lot == null || manuf_lot.length < 1) {
                                doLoadIngredientStore = false;
                                Ext.Msg.alert('경고', '해당하는 Bare Lot가 존재하지 않습니다.');
                            }
                            gm.me().ingredientStore.getProxy().setExtraParam('manu_lot', manuf_lot);
                            gm.me().ingredientStore.getProxy().setExtraParam('output_lot', null);
                            gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                            gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                            break;
                        default:
                            gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                            gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                            break;
                    }
                    break;
                case '10':
                case '14':
                    gm.me().ingredientStore.getProxy().setExtraParam('v003', v003);
                    gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                    break;
                default:
                    gm.me().ingredientStore.getProxy().setExtraParam('type', 'INBW');
                    gm.me().ingredientStore.getProxy().setExtraParam('v003', null);
                    break;
            }
        }


        if(doLoadIngredientStore) {
            gm.me().ingredientStore.load(function(record) {
                if(record.length > 0) {
                    if(gm.me().temp_name.substring(0, 2) == '1S') {
                        var tempArray = [];
                        for(var i = 0; i < record.length; i++) {
                            if(gm.me().sbinfoData.get('lot_no') == record[i].get('lotNo')) {
                                tempArray.push(record[i]);
                            } else if(gu.getCmp('output_lot').value == record[i].get('lotNo')) {
                                tempArray.push(record[i]);
                            }
                        }
                        gm.me().selected_ingredient = tempArray;
                    } else {
                        var tempArray = [];
                        tempArray.push(record[0]);
                        gm.me().selected_ingredient = null;
                    }
                } else {
                    gm.me().selected_ingredient = null;
                }
            });

            var myWin =	Ext.create('Ext.Window', {
                modal : true,
                title: 'LOT 번호를 통한 성분 선택',
                width: 790,
                height: 480,
                plain:true,
                items: [gm.me().ingredientGrid],
                buttons: [{
                    text: CMD_OK,
                    handler: function(btn){
                        var selection = gm.me().ingredientGrid.getSelectionModel().getSelection();
                        if(selection.length > 0) {
                            var tempArray = [];
                            tempArray.push(selection[0]);
                            gm.me().selected_ingredient = tempArray;
                            if(myWin) {
                                myWin.close();
                            }
                        } else {
                            Ext.Msg.alert('오류', '성분 데이터를 하나 선택해주세요');
                        }
                    }
                },{
                    text: CMD_CANCEL,
                    handler: function(){
                        if(myWin) {
                            myWin.close();
                        }
                    }
                }]
            });
            myWin.show();
        }
    },

    prwin2open: function() {

        gm.me().pdGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().pdStore,
            cls : 'rfx-panel',
            //selModel : Ext.create("Ext.selection.CheckboxModel", {mode : 'SINGLE'}),
            multiSelect: false,
            bbar: getPageToolbar(gm.me().pdStore),
            autoScroll : true,
            height: 408,
            border: true,
            plugins : [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit:2
                })
            ],
            padding: '0 0 0 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            columns: [
            {
                text: 'BareLot',
                width: 120,
                dataIndex: 'bare_lot',
                editor: 'textfield'
            },
            {
                text: '제품No.',
                width: 150,
                dataIndex: 'bare_no',
                editor: 'textfield'
            },
            {
                text: '제조Lot',
                width: 150,
                dataIndex: 'ap_lot',
                editor: 'textfield'
            },
            {
                text: '타겟',
                width: 150,
                dataIndex: 'target_content',
                editor: 'textfield'
            },
            {
                text: '특이사항',
                width: 150,
                dataIndex: 'comment',
                editor: 'textfield'
            },
            {
                text: 'Pd함량',
                width: 150,
                dataIndex: 'pd_content',
                editor: 'textfield'
            },
            {
                text: 'PC직경',
                width: 150,
                dataIndex: 'pc_diameter',
                editor: 'textfield'
            },
            {
                text: 'Au도금보빈',
                width: 150,
                dataIndex: 'au_gilt_bobbing',
                editor: 'textfield'
            },
            {
                text: 'Au 도금 LOT No',
                width: 150,
                dataIndex: 'au_gilt_lot_no',
                editor: 'textfield'
            }
            ]
        });

        //gm.me().pdStore.getProxy().setExtraParam('output_Lot', gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
        gm.me().pdStore.getProxy().setExtraParam('manu_lot', gm.me().grid.getSelectionModel().getSelection()[0].get('v013'));
        gm.me().pdStore.getProxy().setExtraParam('n_date', gm.me().grid.getSelectionModel().getSelection()[0].get('v000'));
        gm.me().pdStore.load();

        var myWin =	Ext.create('Ext.Window', {
            modal : true,
            title: 'Pd함량 선택',
            width: 900,
            height: 480,
            plain:true,
            items: [gm.me().pdGrid],
            buttons: [{
                text: CMD_OK,
                handler: function(btn){
                    var selection = gm.me().pdGrid.getSelectionModel().getSelection();
                    if(selection.length > 0) {
                        gm.me().selectionPd = selection[0].get('pd_content');
                        if(myWin) {
                            myWin.close();
                        }
                    } else {
                        Ext.Msg.alert('오류', '성분 데이터를 하나 선택해주세요');
                    }
                }
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(myWin) {
                        myWin.close();
                    }
                }
            }]
        });
        myWin.show();
    },
    addCellProperty: function(n) {

        var cellProperty = gu.getCmp('cellProperty');
        var cellPropertyId = n < 10 ? 'v0' + n : 'v' + n;

        cellProperty.add({
            xtype: 'textfield',
            id: gu.id(cellPropertyId),
            name: cellPropertyId,
            labelWidth: 120,
            fieldLabel: '.', listeners: { 'render': function() { this.hide() } }
        });
    },
    addArrayProperty: function(n) {

        var arrayProperty = gu.getCmp('arrayProperty');

        arrayProperty.add({
            id: gu.id('a0' + n),
            xtype: 'tbtext',
            text: '.',
            listeners: { 'render': function() { this.hide() } }
        });

        for(var i = 1; i <= 13; i++) {
            arrayProperty.add({
                id: gu.id('a0' + n + '-val' + i),
                style : 'text-align:center',
                hideLabel: true,
                listeners: { 'render': function() { this.hide() } }
            });
        }
    },
    removeArrayProperty: function() {
        var arrayProperty = gu.getCmp('arrayProperty');
        arrayProperty.removeAll();
    },
    removeCellProperty: function() {
        var cellProperty = gu.getCmp('cellProperty');
        cellProperty.removeAll();
    },
    selected_ingredient: null,
    bufferData: null,
    sbinfoData: null,
    docutpl_uid: 0,
    temp_name: null,
    output_lot: null,
    manu_lot: null,
    doc_data: null,
    selectionPd: null,
    ingredientGrid: null,
    loadData: function() {

        gm.me().bufferDataStore.load(function (record) {

            gm.me().bufferData = record[0];
            //측정데이터

            gm.me().doc_data = gm.me().selected_ingredient;

            var selections = gm.me().gridViewTable.getSelectionModel().getSelection();
            var rec = (selections != null && selections.length > 0) ? selections[0] : null;

            var temp_name = gm.me().grid.getSelectionModel().getSelection()[0].get('v003');
            var real_temp_name = gm.me().gridViewTable.getSelectionModel().getSelection()[0].get('temp_name');
            var f1 = gu.getCmp('temp_name');
            f1.setValue(temp_name);

            gm.me().docEntityReportStore.getProxy().setExtraParam('group_uid', rec.get('unique_id_long'));
            gm.me().docEntityReportStore.load(function (record) {

                var cell_count = 1;
                var array_count = 1;

                for (var j = 0; j < record.length; j++) {
                    var rec = record[j];

                    var position = rec.get('position');
                    var colspan = rec.get('colspan');
                    var rowspan = rec.get('rowspan');
                    var max_cnt = rec.get('max_cnt');

                    if(position.length > 0) {

                        if (max_cnt > 1) {
                            array_count++;
                        } else {
                            if (cell_count < 10) {
                                var labelValue = gu.getCmp('v0' + cell_count);
                            } else {
                                var labelValue = gu.getCmp('v' + cell_count);
                            }

                            labelValue.setValue('');

                            if (rec.get('buffer_pos').length > 0) {
                                //출하 LOT
                                if(rec.get('buffer_pos') == 'v005') {
                                    labelValue.setValue(gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
                                } else {
                                    labelValue.setValue(gm.me().bufferData.get(rec.get('buffer_pos')));
                                }
                            } else {

                                if(rec.get('title') == 'Pd함량') {
                                    if(gm.me().selectionPd != null) {
                                        labelValue.setValue(gm.me().selectionPd);
                                    }
                                }

                                if(gm.me().doc_data != null && gm.me().doc_data.length > 0) {

                                    for(var g = 0; g < gm.me().doc_data.length; g++) {

                                        var keys = Ext.Object.getKeys(gm.me().doc_data[g].data);

                                        var item_name = gm.me().grid.getSelectionModel().getSelection()[0].get('v003');

                                        switch(item_name.substring(0, 2)) {

                                            case '1S':
                                                for(var k = 0; k < keys.length; k++) {

                                                    if(rec.get('title').toUpperCase() == keys[k].toUpperCase()
                                                        || rec.get('prop_key').toUpperCase() == keys[k].toUpperCase()) {

                                                        var val = gm.me().doc_data[g].get(keys[k]).split(';');

                                                        if(val.length > 1) {
                                                            labelValue.setValue(val[1]);
                                                        } else {
                                                            labelValue.setValue(gm.me().doc_data[g].get(keys[k]));
                                                        }
                                                        break;
                                                    }
                                                }

                                                switch(rec.get('title')) {
                                                    case '고객명':
                                                        labelValue.setValue(gm.me().sbinfoData.get('customer'));
                                                        break;
                                                    case 'SID':
                                                        labelValue.setValue(gm.me().sbinfoData.get('sid'));
                                                        break;
                                                    case 'Supplier Batch':
                                                        labelValue.setValue(gu.getCmp('output_lot').value);
                                                        break;
                                                }
                                                break;
                                            default:

                                                for(var k = 0; k < keys.length; k++) {

                                                    if(keys[k] == 'Total') {
                                                        keys[k] = 'TOTAL IMPURITY';
                                                    }

                                                    if(rec.get('title') == keys[k]) {
                                                        if(keys[k] == 'TOTAL IMPURITY') {
                                                            labelValue.setValue(gm.me().doc_data[g].get('Total'));
                                                        } else if(rec.get('viewprop_uid') == 80020000138) {
                                                            labelValue.setValue('');
                                                        } else {
                                                            labelValue.setValue(gm.me().doc_data[g].get(keys[k]));
                                                        }
                                                        break;
                                                    }
                                                }
                                                break;
                                        }
                                    }
                                }
                            }

                            cell_count++;
                        }
                    }
                }
                // 배열(샘플) 데이터
                gm.me().docDataArrayStore.getProxy().setExtraParam('value_key',
                    real_temp_name + '-' + gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));
                gm.me().docDataArrayStore.getProxy().setExtraParam('group_uid', -1);
                gm.me().docDataArrayStore.load(function (record) {

                    var sampleSizeList = new Map();
                    var blList = [];
                    var elList = [];
                    var diaList = [];

                    for(var i = 0; i < record.length; i++) {
                        var samplePos = record[i].get('pos');
                        if(samplePos == -1) {
                            sampleSizeList.set(record[i].get('target_uid'), record[i].get('val'));
                        }
                    }

                    var cellPropertyLength = gu.getCmp('cellProperty').items.indexGeneration;

                    //샘플데이터중 단일 데이터일때
                    for(var i = 0; i < record.length; i++) {

                        var target_uid = record[i].get('target_uid');

                        if(!sampleSizeList.has(target_uid)) {

                            for(var j = 0; j < cellPropertyLength; j++) {

                                var labelValue = gu.getCmp((j+1) > 9 ? 'v' + (j+1) : 'v0' + (j+1));

                                try {
                                    if(labelValue.viewprop_uid != undefined && labelValue.viewprop_uid == record[i].get('target_uid')) {
                                        labelValue.setValue(record[i].get('val'));
                                    }
                                } catch(e) {

                                }
                            }
                        }
                    }

                    //DiesNo가 있을 때 (DiesNo = 80020000138)
                    if(sampleSizeList.has(80020000138)) {

                        for(var i = 0; i < record.length; i++) {

                            if(record[i].get('target_uid') == 80020000138 && record[i].get('pos') == 1) {

                                for(var j = 0; j < cellPropertyLength; j++) {

                                    var labelValue = gu.getCmp((j+1) > 9 ? 'v' + (j+1) : 'v0' + (j+1));

                                    try {
                                        if(labelValue.viewprop_uid != undefined && labelValue.viewprop_uid == record[i].get('target_uid')) {
                                            labelValue.setValue(record[i].get('val'));
                                        }
                                    } catch(e) {

                                    }
                                }
                            }

                        }
                    }

                    //샘플데이터중 다중 데이터일때
                    for(var i = 1; i <= 7; i++) {

                        var labelValue = gu.getCmp('a0' + i);

                        if(labelValue != undefined && labelValue.html != undefined && labelValue.html.length > 1) {

                            for(var j = 1; j <= 13; j++) {

                                var textValue = gu.getCmp('a0' + i + '-val' + j);
                                textValue.setValue('');

                                for(var k = 0; k < record.length; k++) {

                                    var rec = record[k];

                                    if(rec.get('target_uid') == labelValue.viewprop_uid && rec.get('pos') == (j-1)) {

                                        var sampleSize = sampleSizeList.get(rec.get('target_uid'));

                                        if(sampleSize != undefined && sampleSize != null) {
                                            if(sampleSize >= j) {
                                                switch(rec.get('target_uid')) {
                                                    case 80020000011:
                                                        blList.push(rec.get('val'));
                                                        break;
                                                    case 80020000012:
                                                        elList.push(rec.get('val'));
                                                        break;
                                                    case 80020000004:
                                                        diaList.push(rec.get('val'));
                                                        break;
                                                }
                                                textValue.setValue(rec.get('val'));
                                            }
                                        } else {
                                            textValue.setValue(rec.get('val'));
                                        }
                                    }
                                }
                            }
                        }
                    }

                    gm.me().cpkStore.getProxy().setExtraParam('blList', blList);
                    gm.me().cpkStore.getProxy().setExtraParam('elList', elList);

                    gm.me().cpkStore.getProxy().setExtraParam('s_date', gu.getCmp('s_date_cpk').getValue());
                    gm.me().cpkStore.getProxy().setExtraParam('e_date', gu.getCmp('e_date_cpk').getValue());

                    gm.me().cpkStore.getProxy().setExtraParam('diaList', diaList);
                    gm.me().cpkStore.getProxy().setExtraParam('item_code',
                        gm.me().grid.getSelectionModel().getSelection()[0].get('v003'));
                    gm.me().cpkStore.getProxy().setExtraParam('output_lot',
                        gm.me().grid.getSelectionModel().getSelection()[0].get('output_Lot'));

                    //Cpk 로딩
                    gm.me().cpkStore.load(function (record) {
                        var data = record[0].data;
                        var keys = Object.keys(data);

                        for(var i = 0; i < keys.length; i++) {
                            if(keys[i] != 'id') {
                                var labelValue = gu.getCmp(keys[i]);
                                labelValue.setValue(record[0].get(keys[i]).toFixed(3));
                            }
                        }

                        for(var i = 1; i <= 6; i++) {
                            var labelValue = gu.getCmp('c0'+i);
                            labelValue.show();
                            if(labelValue.getValue() == null || labelValue.getValue().length == 0) {
                                var temp = 0;
                                labelValue.setValue(temp.toFixed(3));
                            }
                        }

                        gu.getCmp('c_button').show();
                        gu.getCmp('c_button').setDisabled(false);
                    });



                    gm.me().getEl().unmask();
                });
            });
        });
    }
});
