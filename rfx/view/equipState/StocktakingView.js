//자재 관리
Ext.define('Rfx.view.equipState.StocktakingView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'stocktaking-view',

    initComponent: function() {

        //검색툴바 필드 초기화
        this.initSearchField();

        // 창고 목록
        /*
        this.addSearchField({
            type: 'combo'
            , field_id: 'whouse_uid'
            , emptyText: '창고'
            , store: "WhouseStore"
            , displayField: 'wh_name'
            , valueField: 'unique_id'
            , value: 'unique_id'
            , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        });
        */

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.Stocktaking', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            ,{}
            , ['rtgast']
        );

        // 창고 입고
        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: '재고조사표 양식',
            tooltip: '재고조사표 양식받기',
            handler: function () {

                gm.setCenterLoading(true);

                //var store = Ext.create('Mplm.store.MaterialRStore', {});
                var store = Ext.create('Rfx.store.StoqtyLineStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", 'PMS2_EXL');
                store.getProxy().setExtraParam('orderBy', 'item_code');

                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    store.getProxy().setExtraParam(item.name, item.value);
                }

                var arrField = gm.me().gSearchField;

                try {
                    Ext.each(arrField, function(fieldObj, index) {

                        console_log(typeof fieldObj);

                        var dataIndex = '';

                        if(typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }

                        var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                        var value = Ext.getCmp(srchId).getValue();

                        if(value!=null && value!='') {
                            if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value+ '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch(noError){}

                store.load({
                    scope: this,
                    callback: function(records, operation, success) {

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params:{
                                mc_codes : gUtil.getMcCodes()
                            },
                            success : function(response, request) {
                                gm.setCenterLoading(false);
                                // console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                // console_logs('excelPAth>>>>>>>>>>>>>>>', excelPath);
                                if(excelPath!=null && excelPath.length>0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
                                    console_logs('url>>>>>>>>>>>>>>>>>>', url);
                                    top.location.href=url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        // 창고 입고
        this.uploadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-upload-white',
            text: '재고조사표 업로드',
            tooltip: '재고조사표 업로드',
            handler: function () {

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    width: 500,
                    bodyPadding: 15,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        {
                            fieldLabel: '재고조사일',
                            labelWidth: 100,
                            xtype: 'datefield',
                            id: gu.id('aprv_date'),
                            name: 'aprv_date',
                            format: 'Y-m-d',
                            value: new Date()
                        },
                        {
                            fieldLabel: '조사자',
                            labelWidth: 100,
                            xtype: 'combo',
                            id: gu.id('pr_uid'),
                            name: 'pr_uid',
                            store: Ext.create('Mplm.store.UserStore'),
                            displayField: 'user_name',
                            valueField: 'unique_id_long',
                            emptyText: '선택',
                            allowBlank: false,
                            sortInfo: {field: 'create_date', direction: 'DESC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{user_id}] {user_name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            fieldLabel: '비고',
                            labelWidth: 100,
                            xtype: 'textfield',
                            id: gu.id('reserved_varchar1'),
                            name: 'reserved_varchar1'
                        },
                        {
                            fieldLabel: '첨부파일',
                            labelWidth: 100,
                            xtype: 'filefield',
                            allowBlank: false,
                            id: gu.id('stocktaking_file'),
                            name: 'stocktaking_file'
                        },
                    ]
                });

                var winPart = Ext.create('ModalWindow', {
                    title: '재고조사',
                    width: 500,
                    height: 250,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {

                            if (form.isValid()) {
                                var val = form.getValues(false);

                                form.submit({
                                    url: CONTEXT_PATH + '/sales/sps1.do?method=uploadStocktakingTemplate&file_itemcode=' + gUtil.RandomString(10),
                                    //waitMsg: '재고조사 반영 중입니다...',
                                    params: {

                                    },
                                    success: function(result, request) {
                                        gm.me().startTask();
                                         
                                        if(winPart) {
                                            winPart.close();
                                        }
                                    }, //endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); //endofajax

                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
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

        this.adjustStockAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-check',
            text: '재고반영',
            tooltip: '재고반영',
            disabled: true,
            handler: function () {

                var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                var state = selection.get('state');
                var rtgastUid = selection.get('unique_id_long');
                var fileObjectUid = selection.get('fileobject_uid');

                if (state == 'A') {

                    Ext.MessageBox.show({
                        title:'확인',
                        msg: '재고를 반영하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn:  function(result) {

                            if (result == 'yes') {

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/sps1.do?method=adjustStocktaking',
                                    params:{
                                        rtgastUid: rtgastUid,
                                        fileObjectUid: fileObjectUid
                                    },

                                    success : function(result, request) {
                                        gm.me().store.load();
                                        Ext.Msg.alert('안내', '재고를 반영중입니다.', function() {});

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Msg.alert('', '이미 재고조사가 반영 된 파일입니다.');
                }
            }
        });

        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        buttonToolbar.insert(1, this.uploadSheetAction);
        buttonToolbar.insert(1, this.downloadSheetAction);
        buttonToolbar.insert(1, '-');

        this.setGridOnCallback(function(selections) {

            if (selections.length) {
                this.adjustStockAction.enable();
            } else {
                this.adjustStockAction.disable();
            }
        });
        
        this.stochkListStore = Ext.create('Rfx.store.StochkListStore', { pageSize: 100 });

        //gridCartList
        this.gridStochkList = Ext.create('Ext.grid.Panel', {
            store: this.stochkListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            bbar: getPageToolbar(this.stochkListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            columns: [
                { text: '자재번호', width: 90, style: 'text-align:center', align: 'left', dataIndex: 'item_code' },
                { text: '품명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_name' },
                { text: '규격', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'specification' },
                { text: '단위', width: 60, align: 'left', style: 'text-align:center', dataIndex: 'unit_code' },
                { text: '기초재고', align: 'left', style: 'text-align:center', dataIndex: 'base_qty' },
                { text: '당기입고', align: 'left', style: 'text-align:center', dataIndex: 'in_qty' },
                { text: '생산출고', xtype: "numbercolumn", style: 'text-align:center', format: "0,000", width: 80, dataIndex: 'prod_out_qty', align: "right" },
                { text: '기타출고', xtype: "numbercolumn", style: 'text-align:center', format: "0,000", align: 'center', dataIndex: 'etc_out_qty', align: "right" },
                { text: '기말재고', xtype: "numbercolumn", style: 'text-align:center', format: "0,000", align: 'center', dataIndex: 'system_qty', align: "right" },
                { text: '재고조사', xtype: "numbercolumn", style: 'text-align:center', format: "0,000", align: 'center', dataIndex: 'check_qty', align: "right" },
            ],
            title: '전체',
            name: 'cart',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'stochk';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().cartListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, { type: '' });
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, { type: '' });
                    gm.me().cartListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cartListStore.load();
                }
            }
        });

        this.tabView = Ext.create('Ext.tab.Panel', {
            region: 'center',
            collapsible: false,
            border: true,
            width: '100%',
            margin: '5 0 0 0',
            flex: 2,
            items: [
                this.gridStochkList,
            ]
            ,
            listeners: {
                tabchange: function (tabPanel, newTab, oldTab, eOpts) {

                    gm.me().currentTab = newTab.name;
                    console_logs('>>>>> zzzzzz', gm.me().currentTab);

                    var selections = gm.me().grid.getSelectionModel().getSelection();
                }
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    flex: 0,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '35%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                },
                this.tabView
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);
        

        this.storeLoad();

        this.setGridOnCallback(function (selections){
            if (selections.length) {
                this.rtgast_uids = [];
                this.states = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var state = rec1.get('state');
                    this.rtgast_uids.push(uids);
                    this.states.push(state);
                }
                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);

                this.gridStochkList.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
                console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);
                var totalPrice = 0;
                this.gridStochkList.getStore().load(function (record) {
                });

            }
        });

    
    var runner = new Ext.util.TaskRunner();
    this.task = runner.newTask({
        run: function() {
            gm.me().myFunction();
        },
        interval: 1000
    });

        this.startTask();
    },
    
    task : null,
     
    startTask: function() {
        this.task.start();
    },
    endTask: function() {
        cur_cnt = 0;
        this.task.stop();
    },

    loding_msg : function() {
        Ext.MessageBox.wait('재고 조사 반영 중 입니다...','재고조사');
    },
    stop_msg : function() {
        Ext.MessageBox.hide();
    },
    myFunction: function() {
            /*
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/sps1.do?method=getStateStocktakingTemplate',
                params:{

                },
                success : function(result, request) {
                    var result = result.responseText;
                    console_logs('result >>>>', result);

                    if(result == 'start')
                    {
                        gm.me().loding_msg();
                    }

                    if(result == 'end')
                    {    
                        gm.me().stop_msg();
                        gm.me().endTask();
                        Ext.MessageBox.alert('재고조사', '업로드가 완료되었습니다.');
                    } 

                }
            });
            */
    }
});



