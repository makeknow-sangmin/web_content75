Ext.define('Rfx2.view.company.mjcm.qualityStandards.UDIMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'udi-mgmt-view',


    initComponent: function () {
        this.createCrudTab();

        // store
        this.udiLabelListStore = Ext.create('Rfx2.store.company.bioprotech.UdiLabelListStore', { pageSize: 100 });
        this.udiListStore = Ext.create('Rfx2.store.company.bioprotech.UDIListStore', { pageSize: 100 });
        this.classNameStore = Ext.create('Mplm.store.ClassNameStore', { pageSize: 100 });
        this.SubclassStore = Ext.create('Mplm.store.SubclassStore', { pageSize: 100 });

        this.combValidity = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '유효기간',
            store: ['1year', '2year', '3year', 'None' ],
            margin: '5 5 5 10',
            enable: true 
            
        });
    
           this.editValidity = Ext.create('Ext.panel.Panel', {
            width: 500,
            items : [this.combValidity]
        });

        // ---------------------------버튼
        // 엑셀출력 버튼
        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            tooltip: '등록된 판매 가격 전체를 Excel로 다운로드 합니다.',
            handler: function () {

                gm.setCenterLoading(true);

                var store = Ext.create('Rfx2.store.company.bioprotech.UdiMgmtExcelStore', { pageSize: 100000 });

                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", 'XDC2_EXL');

                var arrField = gm.me().gSearchField;

                try {
                    Ext.each(arrField, function (fieldObj, index) {
                        console_log(typeof fieldObj);
                        var dataIndex = '';
                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }

                        var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                        var value = Ext.getCmp(srchId).getValue();

                        if (value != null && value != '') {
                            if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value + '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch (noError) { }
                store.load({
                    scope: this,
                    callback: function (records, operation, success) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params: {
                                mc_codes: gUtil.getMcCodes()
                            },
                            success: function (response, request) {
                                gm.setCenterLoading(false);
                                //console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        // 저장 버튼
        this.editUdiBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-save',
            text: '저장',
            tooltip: this.getMC('msg_btn_prd_add', 'UDI 관리내역 저장'),
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '저장',
                    msg: '저장하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {
                            var selections = gm.me().udiLabelListGrid.getSelectionModel().getSelection();
                            var rec = selections[0];
                            var srcahd_uid = rec.get('unique_id_long');
                            var objs = [];
                            var columns = [];
                            var obj = {};
                            var store = gm.me().editUdiGrid.getStore();
                            var cnt = store.getCount();
                            var validity = gm.me().combValidity.getValue();
                            console_logs('cnt', cnt);
                            for (var i = 0; i < cnt; i++) {
                                var record = store.getAt(i);
                                var objv = {};
                                var udi = record.get('v000');
                                
                                objv['unique_id'] = record.get('unique_id_long');
                                objv['srcahd_uid'] = record.get('target_uid');
                                objv['udi'] = gm.me().chk_udi(udi, i);
                                objv['packing'] = record.get('v001');
                                objv['barcode'] = record.get('v002');
                                objv['barcode_type'] = record.get('v003');
                                columns.push(objv);
                            }
                            obj['datas'] = columns;
                            objs.push(obj);
                            var jsonData = Ext.util.JSON.encode(objs);

                            var udi_ajax = Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/qualitymgmt.do?method=editUdi',
                                params:{
                                    srcahd_uid : srcahd_uid,
                                    jsonData : jsonData,
                                    validity : validity
                                },
                                success : function(result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().udiLabelListStore.load();
                                    gm.me().udiListStore.load();
                                },
                                failure : extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 삭제
        this.delinspection = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: this.getMC('msg_btn_prd_add', 'UDI 관리 내역 삭제'),
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: 'UDI 관리 내역 삭제을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {

                            var selections = gm.me().editUdiGrid.getSelectionModel().getSelection();
                            var uniqueIds = [];
                            for (var i=0; i<selections.length; i++) {
                                var rec = selections[i];
                                var unique_id = rec.get('unique_id_long');
                                uniqueIds.push(unique_id);
                            }
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/qualitymgmt.do?method=deleteMabufferUniqueId',
                                params:{
                                    uniqueIds: uniqueIds
                                },
                                success : function(result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().udiLabelListStore.load();
                                    gm.me().udiListStore.load();
                                },
                                failure : extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 검색
        this.reSearch = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-search',
            text: '검색',
            handler: function() {
                gu.getCmp('class_name_combo').setValue('');
                gu.getCmp('sg_code_combo').setValue('');
            
                gm.me().udiLabelListStore.getProxy().setExtraParam('item_code', '');
                gm.me().udiLabelListStore.getProxy().setExtraParam('item_name', '');
                gm.me().udiLabelListStore.getProxy().setExtraParam('main_class_code', '');
                gm.me().udiLabelListStore.getProxy().setExtraParam('sub_class_code', '');
                gm.me().udiLabelListStore.load();
                
            }
        });

        // udi 입력을 위한 제품목록 grid
        this.udiLabelListGrid = Ext.create('Ext.grid.Panel', {
            store: this.udiLabelListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            // frame: true,
            bbar: getPageToolbar(this.udiLabelListStore),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.reSearch, this.downloadSheetAction
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: 120,
                            xtype: 'checkbox',
                            field_id: 'udi_not_null_chk',
                            id: gu.id('udi_not_null_chk'),
                            boxLabel: '<font style="color: white;">UDI있는 품목만</font>',
                            checked: true,
                            handler: function() {
                                var chk = gu.getCmp('udi_not_null_chk').getValue();
                                if(chk == false){
                                    gm.me().udiLabelListStore.getProxy().setExtraParam('chk', 'false');
                                    gm.me().udiLabelListStore.load();
                                } else {
                                    gm.me().udiLabelListStore.getProxy().setExtraParam('chk', '');
                                    gm.me().udiLabelListStore.load();
                                }
                            }
                        },
                        {
                            width: 130,
                            field_id: 'search_item_code',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_code'),
                            name: 'search_item_code',
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');

                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().udiLabelListStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                    gm.me().udiLabelListStore.load();
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
                            width: 130,
                            field_id: 'search_item_name',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_name'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().udiLabelListStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                    gm.me().udiLabelListStore.load();
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
                            width: 130,
                            field_id: 'search_description',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_description'),
                            name: 'search_description',
                            xtype: 'triggerfield',
                            emptyText: '기준모델',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().udiLabelListStore.getProxy().setExtraParam('description', '%' + e + '%');
                                    gm.me().udiLabelListStore.load();
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
                            id: gu.id('class_name_combo'),
                            emptyText : 'Please Select ...',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: false,
                            width: 150,
                            queryMode: 'remote',
                            displayField: 'class_name',
                            valueField: 'class_code',
                            emptyText: gm.getMC('CMD_Product', '제품군'),
                            store: this.classNameStore, 
                            sortInfo: {field: 'specification', direction: 'ASC'},
                            minChars: 1,
                            typeAhead: true,
                            hideLabel: true,
                            hideTrigger: false,
                            innerTpl: '<div data-qtip="{class_name}">{class_name}</div>',
                            listeners: {
                                select : function() {
                                    value: 'class_code'
                                    
                                    gm.me().SubclassStore.getProxy().setExtraParam('class_code', gu.getCmp('class_name_combo').getValue());
                                    gm.me().SubclassStore.load();

                                    gm.me().udiLabelListStore.getProxy().setExtraParam('main_class_code', gu.getCmp('class_name_combo').getValue());
                                    gm.me().udiLabelListStore.load();
                                }
                            }
                        },
                        {
                            id: gu.id('sg_code_combo'),
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: false,
                            width: 150,
                            queryMode: 'remote',
                            valueField: 'class_code',
                            store: this.SubclassStore,
                            minChars: 1,
                            typeAhead: true,
                            hideLabel: true,
                            hideTrigger: false,
                            displayField: 'class_name',
                            emptyText: '소분류',
                            innerTpl: '{class_name}',
                            listeners: {
                                select : function() {
                                    value: 'class_code'

                                    gm.me().udiLabelListStore.getProxy().setExtraParam('sub_class_code', gu.getCmp('sg_code_combo').getValue());
                                    gm.me().udiLabelListStore.load();
                                }
                            }
                        }
                    ]
                }
            ],
            columns: [
                { text: gm.getMC('CMD_Product', '제품군'), width: 100, style: 'text-align:center', align: 'left', dataIndex: 'main_class_name' },
                { text: '소분류', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'sub_class_name' },
                { text: '품번', width: 120, align: 'left', style: 'text-align:center', dataIndex: 'item_code' },
                { text: '품명', width: 200, align: 'left', style: 'text-align:center', dataIndex: 'item_name' },
                { text: '기준모델', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'description' },
                { text: 'OEM 고객명', width: 120, align: 'left', style: 'text-align:center', dataIndex: 'item_type' },
                { text: '규격', width: 230, align: 'left', style: 'text-align:center', dataIndex: 'specification' }
            ],
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'capamap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().udiLabelListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, { type: '' });
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, { type: '' });
                    gm.me().udiLabelListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().udiLabelListStore.load();
                }
            }
        });

        // udi 관리 grid
        this.editUdiGrid = Ext.create('Ext.grid.Panel', {
            store: this.udiListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {
                    xtype: 'rownumberer'
                },
                { 
                    text: 'UDI', 
                    width: 150, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'v000',
                    editor: {
                        allowBlank: false
                    }
                },
                { 
                    text: '포장재', 
                    width: 150, 
                    align: 'left', 
                    style: 'text-align:center', 
                    dataIndex: 'v001',
                    editor: {
                        xtype: 'combo',
                        store: Ext.create('Rfx2.store.company.bioprotech.UdiPropPKGListStore', { pageSize: 100 }),
                        value: 'class_name',
                        valueField: 'class_name',
                        displayField: 'class_name',
                        allowBlank: false
                    }
                },
                {   text: 'Barcode 형식', 
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center', 
                    dataIndex: 'v002',
                    editor: {
                        xtype: 'combo',
                        store: Ext.create('Rfx2.store.company.bioprotech.UdiPropBarcodeListStore', { pageSize: 100 }),
                        value: 'class_name',
                        valueField: 'class_name',
                        displayField: 'class_name',
                        allowBlank: false
                    }
                },
                { 
                    text: 'Type', 
                    width: 300, 
                    align: 'left', 
                    style: 'text-align:center', 
                    dataIndex: 'v003',
                    editor: {
                        xtype: 'combo',
                        store: Ext.create('Rfx2.store.company.bioprotech.UdiPropTypeListStore', { pageSize: 100 }),
                        value: 'class_name',
                        valueField: 'class_name',
                        displayField: 'class_name',
                    }
                }
            ],
            title: '상세정보',
            name: 'udi',
            autoScroll: true,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items : [
                       this.editUdiBtn, this.delinspection,
                        {
                            text: '+',
                            listeners: [{
                                click: function () {
                                    var store = gm.me().editUdiGrid.getStore();
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'wth_uid': -1,
                                        'etc_date': '',
                                        'etc_items': '',
                                        'etc_price': '0'
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gm.me().editUdiGrid.getSelectionModel().getSelected().items[0];
                                    gm.me().editUdiGrid.getStore().removeAt(gm.me().editUdiGrid.getStore().indexOf(record));                            
                                }
                            }]
                        }
                    ]
                },
                {
                    items: [this.editValidity]
                }
            ],
            listeners: {
                selectionchange: 'onSelectionChange'
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
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
                        width: '100%',
                        flex: 0,
                        items: [this.udiLabelListGrid]
                    }]
                }, 
                this.editUdiGrid
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.udiLabelListStore.load();

        
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.editUdiBtn.enable();
                var rec = selections[0];
                var srcahd_uid = rec.get('unique_id_long');
                this.udiListStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                this.udiListStore.load(function (record) {
                    gm.me().combValidity.setValue(record[0].get('v004'));
                });
            } else {
                this.editUdiBtn.disable();
            }
        });

        this.udiLabelListGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    gm.me().editUdiBtn.enable();
                    var rec = selections[0];
                    var srcahd_uid = rec.get('unique_id_long');
                    gm.me().udiListStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                    gm.me().udiListStore.load(function (selections) {
                        if(selections.length) {
                            gm.me().combValidity.setValue(selections[0].get('v004'));
                        } else {
                            gm.me().combValidity.setValue('');
                        }
                    });
                } else {
                    gm.me().editUdiBtn.disable();
                }
            }
        });


        this.editUdiGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    gm.me().delinspection.enable();
                } else {
                    gm.me().delinspection.disable();
                }
            }
        });


    },

    chk_udi : function(udi, i){

        var odd = 0;
        var even = 0;
        var result_num = 0;

        for(var x=0; x<udi.length-1; x++){
            if(x % 2 == 0){
                odd += parseInt(udi.charAt(x));
            } else {
                even += parseInt(udi.charAt(x));
            }
        }

        odd = odd * 3;
        result_num = odd + even + parseInt(udi.charAt(udi.length-1));

        if(result_num % 10 == 0){
            return udi;
        } else {
            Ext.Msg.alert('경고', i+1 + '번째 UDI를 다시 확인해주세요.');
            return fail;
        }
    
    }
});