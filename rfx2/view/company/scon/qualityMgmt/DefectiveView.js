// 검사항목관리
Ext.define('Rfx2.view.company.scon.qualityMgmt.DefectiveView', {
    extend          : 'Rfx2.base.BaseView',
    xtype           : 'defective-view',
    initComponent   : function () {
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField('pj_code');
        // this.addSearchField('work_type');
        this.addSearchField('item_code');
        // this.addSearchField('item_name');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 툴바 버튼 옵션 설정
        var removeButtons = ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'VIEW'];
        // var renameButtons = [{'REGIST': '코드등록'}];
        var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar(toolbarOptions);

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.chmr.ProduceWorkDefect',
            pageSize  : 100,
            sorters   : [{
                property : 'cartmap.unique_id',
                direction: 'DESC'
            }],
            byReplacer: {
                'state_name': 'rtgast.state',
            }
        }, {});
        this.defectCodeStore = Ext.create('Rfx2.store.company.bioprotech.DefectCodeStore', {parentCode: 'DEFECTIVE'});
        this.defectRegiAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : gm.getMC('CMD_Defect_Qty', '불량등록'),
            tooltip : '불량수량을 입력합니다.',
            disabled: false,
            handler : function () {

                this.defectRegiGrid = Ext.create('Ext.grid.Panel', {
                    store      : gm.me().defectCodeStore,
                    cls        : 'rfx-panel',
                    multiSelect: false,
                    autoScroll : true,
                    viewConfig : {
                        markDirty: false
                    },
                    height     : 250,
                    border     : true,
                    overflowY  : 'scroll',
                    padding    : '0 0 0 0',
                    width      : 420,
                    layout     : 'fit',
                    forceFit   : true,
                    plugins    : {
                        ptype       : 'cellediting',
                        clicksToEdit: 2
                    },
                    columns    : [{
                        text     : '불량코드',
                        style    : 'text-align:center',
                        flex     : 1.0,
                        dataIndex: 'system_code'
                    }, {
                        text     : '불량명',
                        style    : 'text-align:center',
                        flex     : 1.5,
                        dataIndex: 'code_name_kr'
                    }, {
                        text     : '수량',
                        flex     : 1,
                        dataIndex: 'defect_total_qty',
                        style    : 'text-align:center',
                        align    : 'right',
                        editor   : {
                            xtype: 'numberfield'
                        },
                        renderer : function (value, context, tmeta) {
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
                    Ext.Msg.alert('', '작업을 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }

                var selection = selections[0];

                var radioValues = [];

                for (var i = 0; i < pcs_codes.length; i++) {

                    var radioValue = {
                        boxLabel  : pcs_codes[i].name,
                        name      : 'pcs_radio',
                        inputValue: selection.get(processCode + i + '|step_uid'),
                        checked   : i == 0 ? true : false
                    };

                    radioValues.push(radioValue);
                }

                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'form',
                    autoScroll   : true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            flex    : 0.5,
                            title   : '불량원인,불량수량을 정확히 입력하시기 바랍니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [

                                {
                                    xtype       : 'datefield',
                                    id          : gu.id('ref_date'),
                                    width       : '96%',
                                    readOnly    : false,
                                    name        : 'ref_date',
                                    value       : Ext.Date.add(new Date(), 'Y-m-d'),
                                    submitFormat: 'Y-m-d',
                                    dateFormat  : 'Y-m-d',
                                    format      : 'Y-m-d',
                                    fieldStyle  : 'background-color: #EAEAEA; background-image: none;',
                                    fieldLabel  : '기준일자'
                                },
                            ]
                        },

                        {
                            xtype : 'container',
                            layout: 'column',
                            title : gm.getMC('CMD_Defect_Qty', '불량등록'),
                            //height: 250,
                            // defaults: {
                            //     margin: '3 3 3 3'
                            // },
                            items: [
                                this.defectRegiGrid
                            ]
                        }
                    ]
                });
                gm.me().defectCodeStore.getProxy().setExtraParam('parent_uid', selection.get('srcahd_uid'));
                gm.me().defectCodeStore.load();

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : gm.getMC('CMD_Defect_Qty', '불량등록'),
                    width  : 450,
                    height : 500,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {

                                var selection = currentTab.getSelectionModel().getSelection()[0];

                                var ref_date = gu.getCmp('ref_date').getValue();
                                var pcsstep_uid = selection.get('pcsstep_uid');
                                var srcahd_uid = selection.get('srcahd_uid');
                                var item_code = selection.get('item_code');
                                var cartmap_uid = selection.get('unique_id_long');
                                var big_pcs_code = currentTab.multi_grid_id;
                                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];
                                var work_qty = selection.get('work_qty');
                                var msg = '불량 수량을 처리하시겠습니까?';

                                // if(defect_qty >  selection.get('gr_quan')) {
                                //     Ext.MessageBox.alert('알림','불량수량이 입고수량보다 초과입력되었습니다.');
                                //     return;
                                // }

                                var defect_total_qty_arr = [];
                                var defect_detail_arr = [];
                                var total_qty = 0;
                                for (var i = 0; i < gm.me().defectCodeStore.getCount(); i++) {
                                    var rec = gm.me().defectCodeStore.getAt(i);

                                    var defect_total_qty = rec.get('defect_total_qty');
                                    var defect_detail = rec.get('system_code');
                                    var total_qty = total_qty + defect_total_qty;
                                    if (defect_total_qty > 0) {
                                        defect_total_qty_arr.push(defect_total_qty);
                                        defect_detail_arr.push(defect_detail);
                                    }
                                }

                                if (defect_total_qty_arr.length > 0) {
                                    if (total_qty <= work_qty) {
                                        Ext.MessageBox.show({
                                            title  : '확인',
                                            msg    : msg,
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (result) {
                                                if (result == 'yes') {

                                                    prWin.setLoading(true);

                                                    Ext.Ajax.request({
                                                        url   : CONTEXT_PATH + '/index/process.do?method=defectQtySimple',
                                                        params: {
                                                            'ref_date'            : ref_date,
                                                            'defect_total_qty_arr': defect_total_qty_arr,
                                                            'defect_detail'       : defect_detail_arr,
                                                            'pcsstep_uid'         : pcsstep_uid,
                                                            'srcahd_uid'          : srcahd_uid,
                                                            'item_code'           : item_code
                                                        },

                                                        success: function (result, request) {
                                                            prWin.setLoading(false);
                                                            gm.me().store.load();
                                                            gm.me().subGrid.getStore().load();
                                                            Ext.Msg.alert('안내', '해당 공정의 불량수량이 처리 되었습니다.', function () {
                                                            });
                                                            // currentTab.getStore().load();
                                                            prWin.close();
                                                        },//endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });//endofajax

                                                }
                                            },
                                            icon   : Ext.MessageBox.QUESTION
                                        });
                                    } else {
                                        Ext.Msg.alert('', '불량수량이 생산수량을 초과했습니다.');
                                    }
                                } else {
                                    Ext.Msg.alert('', '최소 한 개의 불량유형의 개수가 1 이상이어야 합니다.');
                                }
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
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
        buttonToolbar.insert(1, this.defectRegiAction);


        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        const currentTab = this.grid;
        //입력/상세 창 생성.
        // this.createCrudTab();

        // main grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var record = selections[0];

                console.log(record.get('lot_no'));
                console.log(record.get('work_type'));
                console.log(record.get('pcs_code'));
                console.log(record.get('end_date'));
                // 서브그리드 스토어에 파라미터 전달 & 로드
                this.pcsDetailStore.getProxy().setExtraParams({
                    cartmap_uid   : record.get('cartmap_uid'),
                    defect_detail : '%DEFECTIVE%',
                    defective_only: "Y"
                });
                this.pcsDetailStore.load();
            } else {
                this.pcsDetailStore.clear();
            }
        });

        let modifyDefectAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : gm.getMC('CMD_Defect_edit', '불량수량수정'),
            tooltip : '해당 작업의 불량수량을 수정합니다',
            disabled: true,
            handler : function () {
                var rec = gm.me().subGrid.getSelectionModel().getSelection()[0];

                var pcs_name = rec.get('pcs_name');
                var work_type = rec.get('work_type');
                var work_qty = rec.get('work_qty');
                var pcswork_uid = rec.get('unique_id_long');
                var change_date = rec.get('change_date');
                var start_date = rec.get('start_date');

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
                        boxLabel  : pcs_codes[i].name,
                        name      : 'pcs_radio',
                        readOnly  : true,
                        inputValue: selection.get(/*pcs_codes[i].code*/ processCode + i + '|step_uid'),
                        checked   : pcs_codes[i].name == pcs_name ? true : false
                    };

                    radioValues.push(radioValue);
                }

                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            title   : '불량수량을 정확히 입력하시기 바랍니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                {
                                    xtype     : 'radiogroup',
                                    id        : gu.id('pcsCodeGroup'),
                                    fieldLabel: '공정',
                                    items     : radioValues,
                                    defaults  : {
                                        margin: '0 30 0 0'
                                    },
                                    listeners : {
                                        change: function (field, newValue, oldValue) {

                                        }
                                    }
                                },
                                {
                                    fieldLabel  : '불량유형',
                                    xtype       : 'combo',
                                    anchor      : '100%',
                                    id          : gu.id('defect_detail'),
                                    name        : 'defect_detail',
                                    displayField: 'code_name_kr',
                                    valueField  : 'system_code',
                                    store       : gm.me().defectCodeStore,
                                    value       : defect_detail,
                                    width       : '96%',
                                    listConfig  : {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{system_code}"><small>[{system_code}] {code_name_kr}</small></div>';
                                        }
                                    }
                                },
                                {
                                    xtype       : 'datefield',
                                    id          : gu.id('ref_date'),
                                    width       : '96%',
                                    readOnly    : false,
                                    name        : 'ref_date',
                                    value       : Ext.Date.add(new Date(), 'Y-m-d'),
                                    submitFormat: 'Y-m-d',
                                    dateFormat  : 'Y-m-d',
                                    format      : 'Y-m-d',
                                    fieldStyle  : 'background-color: #EAEAEA; background-image: none;',
                                    fieldLabel  : '기준일자'
                                },
                                {
                                    xtype     : 'numberfield',
                                    id        : gu.id('defect_total_qty'),
                                    width     : '96%',
                                    name      : 'defect_total_qty',
                                    value     : defect_total_qty,
                                    fieldLabel: '불량수량'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : gm.getMC('CMD_Defect_edit', '불량수량수정'),
                    width  : 450,
                    height : 300,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {

                                var selection = currentTab.getSelectionModel().getSelection()[0];

                                var defect_total_qty = gu.getCmp('defect_total_qty').getValue();
                                var ref_date = gu.getCmp('ref_date').getValue();
                                var defect_detail = gu.getCmp('defect_detail').getValue();
                                var msg = '불량 수량을 수정하시겠습니까?';

                                Ext.MessageBox.show({
                                    title  : '확인',
                                    msg    : msg,
                                    buttons: Ext.MessageBox.YESNO,
                                    fn     : function (result) {
                                        if (result == 'yes') {

                                            Ext.Ajax.request({
                                                url   : CONTEXT_PATH + '/index/process.do?method=updateDefect',
                                                params: {
                                                    'defect_total_qty': defect_total_qty,
                                                    'defect_detail'   : defect_detail,
                                                    'ref_date'        : ref_date,
                                                    'pcswork_uid'     : pcswork_uid
                                                },

                                                success: function (result, request) {
                                                    gm.me().store.load();
                                                    gm.me().subGrid.getStore().load();
                                                    Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
                                                    });
                                                    // currentTab.getStore().load();
                                                    prWin.close();
                                                },//endofsuccess
                                                failure: extjsUtil.failureMessage
                                            });//endofajax

                                            // gm.me().pcsworkDefectStore.load();
                                        }
                                    },
                                    icon   : Ext.MessageBox.QUESTION
                                });
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
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

        let removeDefectAction = Ext.create('Ext.Action', {
            iconCls : 'af-remove',
            text    : gm.getMC('CMD_DEFECT_QUAN_DELETE', '불량수량삭제'),
            tooltip : '해당 작업의 불량수량을 삭제합니다',
            disabled: true,
            handler : function () {
                var rec = gm.me().subGrid.getSelectionModel().getSelection()[0];
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
                    title  : '확인',
                    msg    : '불량수량을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/index/process.do?method=removeDefectQty',
                                params : {
                                    pcswork_uid: pcswork_uid,
                                    pcsstep_uid: pcsstep_uid
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    gm.me().subGrid.getStore().load();
                                    Ext.Msg.alert('안내', '삭제 되었습니다.', function () {
                                    });
                                    // currentTab.getStore().load();
                                    // gm.me().removeProductionAction.enable();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
                // }

                // prWin.show();
            }
        });

        // 서브그리드 패널에 적용할 스토어 생성
        this.pcsDetailStore = Ext.create('Rfx2.store.company.bioprotech.PcsInspectionRSDetailStore', {});

        this.subGrid = Ext.create('Ext.grid.Panel', {
            title      : '상세 검사 결과',
            cls        : 'rfx-panel',
            id         : gu.id('subGrid'),
            store      : this.pcsDetailStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 0.5,
            frame      : true,
            // bbar: getPageToolbar(this.pcsDetailStore),
            border  : true,
            layout  : 'fit',
            forceFit: false,
            // selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin   : '0 0 0 0',
            columns  : [
                {text: '불량코드', width: 120, style: 'text-align:center', dataIndex: 'defect_detail', sortable: false},
                {text: '불량원인', width: 120, style: 'text-align:center', dataIndex: 'code_name_kr', sortable: false},
                {
                    text     : '불량수량',
                    width    : 100,
                    align    : 'right',
                    style    : 'text-align:center',
                    dataIndex: 'defect_total_qty',
                    sortable : false,
                    renderer : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    xtype    : 'datecolumn',
                    format   : 'Y-m-d',
                    text     : '입력시간',
                    width    : 120,
                    style    : 'text-align:center',
                    dataIndex: 'start_date',
                    sortable : false
                },
            ],
            tbar     : [
                modifyDefectAction,
                removeDefectAction
            ],
            listeners: {
                // select: function(selectionModel, records, rowNumber, listeners){},
                selectionchange: function (selectionModel, records, listeners) {
                    // console.log('동명', records.length);
                    if (records.length > 0) {
                        modifyDefectAction.enable();
                        removeDefectAction.enable();
                    } else {
                        modifyDefectAction.disable();
                        removeDefectAction.disable();
                    }
                }
            }

        });

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [this.grid,  this.crudTab]
        // });
        // 서브그리드 포함 적용
        Ext.apply(this, {
            layout: 'border',
            items : [
                {
                    collapsible: false,
                    frame      : false,
                    region     : 'west',
                    layout     : {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    margin     : '5 0 0 0',
                    width      : '65%',
                    items      : [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width : '100%',
                        items : [this.grid]
                    }]
                },
                // this.crudTab, 
                this.subGrid
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        // this.loadStoreAlways = true;

    },
    items           : [],
    getThirtyMinites: function (time) {

        var hour = time.getHours();
        var minute = time.getMinutes();

        if (minute >= 30) {
            return hour + ':30';
        } else {
            return hour + ':00';
        }
    },
    setRefDate      : function () {
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

    useValueCopyCombo     : false, //값복사 사용
    useDivisionCombo      : false,  //사업부 콤보 시용
    selectedSortComboCount: 0, //정렬 콤보 갯수
});