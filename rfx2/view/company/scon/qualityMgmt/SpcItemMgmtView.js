// 검사항목관리
Ext.define('Rfx2.view.company.scon.qualityMgmt.SpcItemMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-item-mgmt-view-bioprotech',
    initComponent: function() {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.SpcItemMgmt', [{
                property: 'item_type',
                direction: 'ASC'
            }],
            /*pageSize*/
            gMain.pageSize
            ,{}
            , ['spccolumn']
        );


        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        
        // this.addSearchField (
        // {
        //     field_id: 'process_type'
        //     ,emptyText: '검사종류'
        //     ,store: 'SpcChartProcessStore2'
        //     ,displayField: 'name'
        //     ,valueField: 'code'
        //     ,innerTpl	: '<div data-qtip="{name}">{name}</div>'
        // });
        // this.addSearchField(
        //     {
        //         field_id: 'measuring_type'
        //         , store: 'SpcChartTypeStore2'
        //         , displayField: 'name'
        //         , valueField: 'code'
        //         , innerTpl: '<div data-qtip="{name}">{name}</div>'
        //     }
        // );
        this.addSearchField('item_type');
        this.addSearchField('class_name');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        // 일부 명령 툴바 버튼 제거
        buttonToolbar.items.each(function(item, index, length) {
            if(index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        // 명령툴바 - 신규등록 버튼
        this.addSpcChartButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
                gm.me().addSpcItemView();
            }
        });

        // 툴바에 버튼 추가
        buttonToolbar.insert(1, this.addSpcChartButton);
        // buttonToolbar.insert(2, this.modifySpcChartButton);

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        var selectionIdx = 0;

        // main grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                // this.modifySpcChartButton.enable();
                this.modifySpcItemButton.disable();
                this.deleteSpcItemButton.disable();
                var record = selections[0];
                // console.log('그리드 클릭 : ',record.get('item_type'));
                // 서브그리드 스토어에 파라미터 전달 & 로드
                this.subGridStore.getProxy().setExtraParam('item_type', record.get('item_type'));
                this.subGridStore.load();
                // 새로고침
                console.log(this.store.indexOf(record));
                selectionIdx = this.store.indexOf(record);

            } else {
                this.modifySpcItemButton.disable();
                this.deleteSpcItemButton.disable();
                // this.modifySpcChartButton.disable();
                // this.subGridStore.clear();
            }
        });
        

        //입력/상세 창 생성.
        // this.createCrudTab();

        //==================================== SubGrid

        // 수정 버튼
        this.modifySpcItemButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().modifySpcItemView();
            }
        });

        // 삭제 버튼
        this.deleteSpcItemButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().deleteSpcItemView();
            }
        });

        this.subGridStore = Ext.create('Mplm.store.SpcItemStore',{autoLoad:false});
        // this.subGridStore.setAutoLoad(false);

        this.gridSub = Ext.create('Ext.grid.Panel', {
            title: '검사항목 목록',
            cls: 'rfx-panel',
            id: gu.id('gridSub'),
            store: this.subGridStore,
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
            bbar: getPageToolbar(this.subGridStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                      this.modifySpcItemButton, this.deleteSpcItemButton
                    ]
                }
            ],
            columns: [
                { text: '검사종류', width: 120, style: 'text-align:center', dataIndex: 'process_type_kr2', sortable: false },
                { text: '항목', width: 200, style: 'text-align:center', dataIndex: 'legend_code_kr', sortable: false },
                { text: '측정방식', width: 100, style: 'text-align:center', dataIndex: 'measuring_type_kr2', sortable: false },
                { text: '단위', width: 70, style: 'text-align:center', dataIndex: 'unit_name', sortable: false },
            ],
            // name: 'po',
            autoScroll: true
        });

        // 서브 그리드 선택 시
        this.gridSub.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length > 0) {
                    // gm.me().deleteChildCodeBtn.enable();
                    // gm.me().updateChildCodeBtn.enable();
                    gm.me().modifySpcItemButton.enable();
                    gm.me().deleteSpcItemButton.enable();
                } else if (selections.length = 0){
                    gm.me().modifySpcItemButton.disable();
                    gm.me().deleteSpcItemButton.disable();
                } else {
                    gm.me().modifySpcItemButton.disable();
                    gm.me().deleteSpcItemButton.disable();
                }
            }
        })

        //================= End of SubGrid

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [this.grid,  this.crudTab]
        // });

        // 서브그리드 포함 적용
        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, 
                // this.crudTab, 
                this.gridSub
            ]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.storeLoad();

        // 스토에 내부에 정의되어있는 파라미터 초기화
        // var params = {identification_code: 'PRD_CLS_CODE', level1: 3};
        // this.claastStorePD = Ext.create('Mplm.store.ClaastStorePD', params);
        // this.claastStorePD.identification_code = 'PRD_CLS_CODE';
        // this.claastStorePD.level1 = '2';
        // this.claastStore = Ext.create('Rfx.store.StockRackStore', {pageSize: 1000});
        // params = {identification_code: 'MT', level1: 2};
        // this.claastStore = Ext.create('Mplm.store.ClaastStorePD', {});
        this.claastStoreMT = Ext.create('Mplm.store.ClaastStoreMTPD', {});
        // this.claastStore.proxy.extraparams = params;
        // this.claastStore.load();

        
        this.spcChartProcessStore2 = Ext.create('Mplm.store.SpcChartProcessStore2', {});
        this.spcColumnNameStore = Ext.create('Mplm.store.SpcColumnNameStore', {});
        this.spcChartTypeStore2 = Ext.create('Mplm.store.SpcChartTypeStore2', {});
    },

    addSpcItemView: function() {

        // var combstStore = Ext.create('Mplm.store.CombstStore', {});
        // var spcChartProcessStore = Ext.create('Mplm.store.SpcChartProcessStore', {});

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
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
                labelWidth: 70,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '검사종류',
                    xtype: 'combo',
                    id: gu.id('process_type'),
                    name: 'process_type',
                    store: gm.me().spcChartProcessStore2,
                    displayField: 'name',
                    valueField: 'code',
                    hideLabel: false,
                    forceSelection: true,
                    autoSelectLast: true,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{code}">{name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
    
                            var inspection = record.get('name');
                            if(inspection=='수입검사') {
                                // console.log('수입검사선택');
                                // gm.me().claastStore.identification_code = 'MT';
                                // gm.me().claastStore.level1 = 2;
                                // gm.me().claastStore.load();
                                gm.me().claastStoreMT.identification_code_1 = 'MT';
                                gm.me().claastStoreMT.level1_1 = 2;
                                gm.me().claastStoreMT.identification_code_2 = 'PRD_CLS_CODE';
                                gm.me().claastStoreMT.level1_2 = 3;
                                gm.me().claastStoreMT.load();
                            } else if(inspection=='최종검사') {
                                // console.log('최종검사선택');
                                // gm.me().claastStore.identification_code = 'PRD_CLS_CODE';
                                // gm.me().claastStore.level1 = 3;
                                // gm.me().claastStore.load();
                                gm.me().claastStoreMT.identification_code_1 = 'PRD_CLS_CODE';
                                gm.me().claastStoreMT.level1_1 = 3;
                                gm.me().claastStoreMT.identification_code_2 = null;
                                gm.me().claastStoreMT.level1_2 = null;
                                gm.me().claastStoreMT.load();
                            }
                            gu.getCmp('item_type').clearValue();
                            // 그리드에서 선택한 값이 있을 경우 해당하는 분류 기본 선택
                            var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                            if(!!selection){
                                gu.getCmp('item_type').setValue(selection.data.item_type);
                            }
                        }
                    }
                },
                {
                    fieldLabel: '품목군',
                    xtype: 'combo',
                    id: gu.id('item_type'),
                    name: 'item_type',
                    forceSelection: true,
                    autoSelectLast: true,
                    store: gm.me().claastStoreMT,
                    displayField:   'class_name',
                    valueField: 'class_code',
                    hideLabel: false,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            gm.me().spcColumnNameStore.getProxy().setExtraParam('item_type', record.get('class_code'));
                            gm.me().spcColumnNameStore.load();
                            // gu.getCmp('process_type_kr').clearValue();
                        },
                        // 그리드에서 선택한 값이 있을 경우 해당하는 분류 기본 선택
                        afterRender: function (combo) {
                            var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                            // !selection ? console.log('hhhhhhhhhhh', 'No selection') : me.setValue(selection.data.item_type);
                            if(!!selection){
                                // 스토어 autoLoad : false 인 경우에 (스토어가 로드되지 않았을 경우) setValue 안 됨
                                combo.store.load();
                                combo.setValue(selection.data.item_type);
                            }
                            
                        }
                    }
                },
                {
                    fieldLabel: '검사항목',
                    xtype: 'textfield',
                    name: 'legend_code'
                },
                {
                    fieldLabel: '측정방식',
                    xtype: 'combo',
                    id: gu.id('measuring_type'),
                    name: 'measuring_type',
                    store: gm.me().spcChartTypeStore2,
                    displayField: 'name',
                    valueField: 'code',
                    hideLabel: false,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{name}">{name}</div>';
                        }
                    },
                    listeners: {
                        // OK/NG 일때는 단위를 입력하지 않도록
                        select: function (combo, record) {
                            var unit = Ext.getCmp('unit_name');
                            if(record.get('name')=='OK/NG'){
                                unit.setValue(null);
                                unit.hide();
                            } else {
                                unit.show();
                            }
                        }
                    }
                },
                {
                    fieldLabel: '단위',
                    xtype: 'textfield',
                    id: 'unit_name',
                    name: 'unit_name'
                }
                
            ]
        });

        //spcChartProductTypeStore.load();

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 350,
            height: 250,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val_create', val);

                            form.submit({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcItem',
                                params: {
                                },
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                    // 새로고침
                                    gm.me().store.getSelectionModel().select(selectionIdx);
                                    
                                    gm.me().subGridStore.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
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


    modifySpcItemView: function() {

        // var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var rec = gm.me().gridSub.getSelectionModel().getSelection()[0];
        // console.log('sdfadfsdfsdf', rec.get('legend_code_kr'));
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
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
                labelWidth: 70,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '검사종류',
                    xtype: 'textfield',
                    name: 'process_type',
                    value: rec.get('process_type'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '품목군',
                    xtype: 'textfield',
                    name: 'item_type_kr',
                    value: rec.get('item_type'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '검사항목',
                    xtype: 'textfield',
                    name: 'legend_code',
                    value: rec.get('legend_code_kr'),
                },
                {
                    fieldLabel: '측정방식',
                    xtype: 'combo',
                    id: gu.id('measuring_type'),
                    name: 'measuring_type',
                    store: gm.me().spcChartTypeStore2,
                    displayField: 'name',
                    valueField: 'code',
                    hideLabel: false,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function(){
                            return '<div data-qtip="{name}">{name}</div>';
                        }
                    },
                    listeners: {
                        // OK/NG 일때는 단위를 입력하지 않도록
                        select: function (combo, record) {
                            var unit = Ext.getCmp('unit_name');
                            if(record.get('name')=='OK/NG'){
                                unit.setValue(null);
                                unit.hide();
                            } else {
                                unit.show();
                            }
                        }
                    },
                    value: rec.get('measuring_type')
                },
                {
                    fieldLabel: '단위',
                    xtype: 'textfield',
                    id: 'unit_name',
                    name: 'unit_name',
                    value: rec.get('unit_name'),
                    listeners: {
                        afterRender: function(){
                            if(rec.get('measuring_type') == 1){
                                // console.log('handlerhandlerhandlerhandler : ', rec.get('measuring_type'));
                                // Ext.getCmp('unit_name').hide();
                                this.hide();
                            }
                        }
                    }
                },
                {
                    xtype: 'hiddenfield',
                    name: 'unique_id_long',
                    value: rec.get('unique_id_long')
                },
            ]
        });

        //spcChartProductTypeStore.load();

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 350,
            height: 250,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val_modify', val);

                            form.submit({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcItem',
                                params: {
                                },
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
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
    deleteSpcItemView: function() {

        // var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        // var recOfSub = gm.me().gridSub.getSelectionModel().getSelection()[0];
        var records = gm.me().gridSub.getSelectionModel().getSelection();
        Ext.MessageBox.show({
            title: '검사항목 삭제',
            msg: '검사항목을 삭제하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    var uids = [];
                    records.forEach(element => {
                        uids.push(element.get('unique_id_long'));
                    });
                    // Ext.Ajax.request({
                    //     url: CONTEXT_PATH + '',
                    //     params:{
                    //         unique_id: rec.get('unique_id_long')
                    //     },
                    //     success : function(result, request) {
                    //         var resultText = result.responseText;
                    //         console_log('result:' + resultText);
                    //         gm.me().store.load();
                    //         gm.me().subGridStore.load();
                    //     },
                    //     failure : extjsUtil.failureMessage
                    // });

                    // console.log('삭제-확인버튼 클릭, uids : ', rec.get('unique_id_long'));
                    // console.log('삭제-확인버튼 클릭, menuCode : ', gm.me().link);
                    
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                        params : {
                            DELETE_CLASS: 'spccolumn',
                            // uids: recOfSub.get('unique_id_long'),
                            uids: uids,
                            menuCode: gm.me().link
                        },
                        method: 'POST',
                        success: function(rec, op) {
                            //console_logs('success rec', rec);
                            //console_logs('success op', op);
                            gm.me().redrawStore();
                            gm.me().subGridStore.load();
                        },
                        failure: function (rec, op)  {
                            Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});
                        }
                    });

                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },
    
    
    useValueCopyCombo: false, //값복사 사용
    useDivisionCombo: false,  //사업부 콤보 시용
    selectedSortComboCount : 0, //정렬 콤보 갯수
});