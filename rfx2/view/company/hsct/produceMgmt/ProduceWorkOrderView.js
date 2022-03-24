Ext.define('Rfx2.view.company.hsct.produceMgmt.ProduceWorkOrderView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-workorder-view',
    requires: [
        'PdfViewer.view.panel.PDF'
    ],
    initComponent: function () {

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        //진행상태 검색툴바
        this.addSearchField('srcahd_od_item_code');
        this.addSearchField('srcahd_od_item_name');
        this.addSearchField('wa_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });


        this.createStore('Rfx2.model.company.hsct.ProduceWorkOrder', [{
                property: 'rtgast.creator',
                direction: 'DESC'
            }],
            gm.PageSize
            , {
                creator: 'rtgast.creator',
                unique_id: 'rtgast.unique_id',
                state_name: 'rtgast.state'
            }
            //삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['rtgast']
        );

        //그리드 생성
        Ext.each(this.columns, function (columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('bm_quan');
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            // return 0;
                        }
                    } else {
                        // return 0;
                    }
                };
            }

        });

        var option = {
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        this.editAction.setText('상세보기');

        //작업반려 Action 생성
        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_Cancel_Plan', '계획취소'),
            tooltip: '요청된 작업지시 건을 생산계획 수립으로 변경 및 스케줄 확정을 취소처리합니다.',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 건을 생산계획 수립로 이동하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
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

        denyOrder = this.denyWorkOrder;

        //작업지시 Action 생성
        this.addWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Job_Confirm', '작업지시'),
            tooltip: '작업지시 확정',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=getBigPcsCodeByRtgAst',
                    params: {
                        rtgastUid: gm.me().vSELECTED_RTGAST_UID
                    },
                    success: function (result, request) {
                        datas = Ext.util.JSON.decode(result.responseText);
                        gm.me().treatWorkStart(datas, rec);
                    },//endofsuccess
                    failure: extjsUtil.failureMessage
                });//endofajax
            }
        });

        //LOT마감
        this.lotEnd = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Lot_End', 'LOT마감'),
            tooltip: 'LOT 마감 합니다',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 건을 LOT 마감 처리 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gm.me().lotEndFc();
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            } // handler
        });

        workOrder = this.addWorkOrder;

        is_rotate = 'N';

        var processes = null;
        if (gUtil.mesTplProcessBig != null && gUtil.mesTplProcessBig.length > 0) {
            processes = gUtil.mesTplProcessBig;
        } else {
        }

        //버튼 추가.
        buttonToolbar.insert(1, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        buttonToolbar.insert(3, this.lotEnd);
        buttonToolbar.insert(1, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                var rec = selections[0];

                gm.me().big_pcs_code = rec.get('po_type');

                gm.me().vSELECTED_RTGAST_UID = rec.get('unique_id');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                console_logs('rec>>>>>>>>>', rec);
                gm.me().vSELECTED_PO_NO = rec.get('pj_code');
                gm.me().vSELECTED_PCS_CODE = rec.get('pcs_code');
                gm.me().vSELECTED_STATE = rec.get('state'); //product의 item_code
                console_logs('>>>>>>> SELECTED_STATE', rec.get('state'))

                if (gm.me().vSELECTED_STATE == 'I') {
                    this.refreshButtons(true);
                    gm.me().addWorkOrder.enable();
                    gm.me().denyWorkOrder.enable();
                    gm.me().lotEnd.enable();
                } else if (gm.me().vSELECTED_STATE == 'N') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.disable();
                } else {
                    gm.me().addWorkOrder.disable();
                    gm.me().denyWorkOrder.disable();
                    gm.me().lotEnd.disable()
                }

            } else {
                this.refreshButtons(false);
                gm.me().vSELECTED_UNIQUE_ID = -1
            }

        });

        this.createCrudTab();

        this.grid.preserveScrollOnRefresh = true;

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로딩
        gMain.setCenterLoading(true);

        this.grid.getStore().getProxy().setExtraParam('po_type', '');
        this.storeLoad();
    },

    selectPcsRecord: null,

    items: [],

    potype: '',

    denyWorkOrderFc: function () {
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
        var po_type = this.vSELECTED_RECORD.get('po_type');
        var cartmap_uid = this.vSELECTED_RECORD.get('coord_key1');
        var item_quan = this.vSELECTED_RECORD.get('item_quan');
        var sloast_uid = this.vSELECTED_RECORD.get('uid_sloast');
        // 수주 생산일 경우
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderProd',
            params: {
                rtgastUid: rtgastUid,
                cartmap_uid: cartmap_uid,
                item_quan: item_quan,
                sloast_uid: sloast_uid
            },
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '실행되었습니다.', function () {
                });
            },
            failure: extjsUtil.failureMessage
        });

    },

    lotEndFc : function () {
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        var rtgast_uid = this.vSELECTED_RECORD.get('unique_id');
        var state = 'O';
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=changeRtgastState',
            params: {
                rtgast_uid: rtgast_uid,
                state: state
            },
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '실행되었습니다.', function () {
                });
            },
            failure: extjsUtil.failureMessage
        }); // ajax
    },

    treatWorkStart: function (o, rec) {
        console_logs('rec ????', rec)
        //다수협력사지정
        var itemsPartner = [];
        var pcs_steel = [];
        var big_pcs_code = o;

        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        gm.me().moldInfoStore.getProxy().setExtraParam('srcahd_uid', selection.get('srcahd_od_uid'));

        for (var i = 0; i < big_pcs_code['datas'].length; i++) {
            pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
        }

        itemsPartner.push(
        {
            fieldLabel: '작업지시일',
            xtype: 'datefield',
            id : gu.id('reserved_timestamp1'),
            anchor: '100%',
            name: 'reserved_timestamp1',
            fieldStyle: 'background-color: #ddd; background-image: none;',
            value: new Date(),
            format: 'Y-m-d',
            readOnly: true,
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        },
        {
            fieldLabel: '설비설정',//ppo1_request,
            xtype: 'combo',
            id : gu.id('pcsmchn_uid'),
            anchor: '100%',
            name: 'pcsmchn_uid',
            emptyText: '선택해주세요.',
            valueField: 'unique_id',
            store: Ext.create('Mplm.store.MachineStore'),
            sortInfo: {field: 'unique_id', direction: 'DESC'},
            displayField: 'mchn_code',
            typeAhead: false,
            minChars: 1,
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function () {
                    return '<div data-qtip="{unique_id}">[{mchn_code}] {name_ko}</div>';
                }
            },
        },
        {
            fieldLabel : '설비시작시간',
            anchor : '100%',
            xtype : 'timefield',
            id : gu.id('start_time'),
            name : 'start_time',
            minValue : '00:00',
            maxValue : '24:00',
            increment : 10,
            format : 'H:i',
            dateFormat : 'H:i',
            submitFormat: 'H:i',
        },
        {
            fieldLabel: '금형설정',
            xtype: 'combo',
            id : gu.id('mold_uid'),
            anchor: '100%',
            name: 'mold_uid',
            emptyText: '선택해주세요.',
            valueField: 'unique_id',
            store: gm.me().moldInfoStore,
            sortInfo: {field: 'unique_id', direction: 'DESC'},
            displayField: 'mold_code',
            typeAhead: false,
            minChars: 1,
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function () {
                    return '<div data-qtip="{unique_id}">[{mold_code}}] {mold_name}</div>';
                }
            },
        },
        {
            xtype : 'hiddenfield',
            id : gu.id('item_quan'),
            name : 'item_quan',
            value : 0
        });

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
            items: [
                {
                    xtype: 'fieldset',
                    title: gm.getMC('CMD_Job_Confirm', '작업지시'),
                    defaultType: 'textfield',
                    items: itemsPartner
                },
            ]//item end..
        });//Panel end...
        myHeight = 230;
        myWidth = 320;

        prwin = gm.me().prwinopen(form);
    },
    
    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Job_Confirm', '작업지시'),
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '작업지시를 하시겠습니까?'
                    var myTitle = '작업지시';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                MessageBox.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var srcahd_uid = '';
                                var po_type = '';
                                var cartmap_uid = '';
                                var assymap_uid = '';
                                var project_uid = '';
                                var rtgast_uid = '';
                                var comcst_uid = '';
                                var pj_code = '';
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    console_logs('rec', rec);
                                    srcahd_uid = rec.get('srcahd_od_uid');
                                    po_type = rec.get('po_type');
                                    cartmap_uid = rec.get('coord_key1'); // cartmap_uid
                                    assymap_uid = rec.get('coord_key'); // assymap_uid
                                    project_uid = rec.get('coord_key3'); // project_uid 
                                    rtgast_uid = rec.get('unique_id'); // rtgast_uid
                                    comcst_uid = rec.get('uid_comcst'); // comcst_uid
                                    pj_code = rec.get('order_number'); // pj_code
                                }

                                prWin.setLoading(true);
                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=startMchnWork',
                                    params: {
                                        item_quan: gu.getCmp('item_quan').getValue(),
                                        start_date : gu.getCmp('reserved_timestamp1').getValue(), 
                                        start_time : gu.getCmp('start_time').getValue(),
                                        cartmap_uid: cartmap_uid,
                                        srcahd_uid: srcahd_uid,
                                        assymap_uid : assymap_uid,
                                        project_uid : project_uid,
                                        rtgast_uid : rtgast_uid,
                                        comcst_uid : comcst_uid,
                                        po_type: po_type,
                                        pj_code: pj_code,
                                        pcsmchn_uid : gu.getCmp('pcsmchn_uid').getValue(),
                                        mold_uid : gu.getCmp('mold_uid').getValue()
                                    },
                                    success: function (val, action) {
                                        var myWin = prWin;
                                        workOrder.disable();
                                        gm.me().grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
                                        gm.me().store.load(function () {
                                            myWin.close();
                                        });
                                    },
                                    failure: function (val, action) {
                                        prWin.close();
                                    }
                                });
                            }
                        }//fn function(btn)
                    });//show
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
        console_logs('start');
        prWin.show(
            undefined, function () {
                var arr = gm.me().madeComboIds;
                for (var i = 0; i < arr.length; i++) {
                    var comboId = arr[i];
                    console_logs('comboId', comboId);
                    Ext.getCmp(comboId).store.load(function (records) {
                        if (records != null && records.length > 0) {
                            var rec = records[0];
                            var mycomboId = gm.me().link + rec.get('pcs_code') + 'h_outmaker';
                            console_logs('record', records[0]);
                            Ext.getCmp(mycomboId).select(records[0]);
                        }
                    });
                }
            }
        );
        console_logs('end');
    },

    madeComboIds: [],
    
    bSelected: false,
    refreshButtons: function (bSelected) {
        console_logs('this.big_pcs_code', this.big_pcs_code);
        if (bSelected != undefined && bSelected != null) {
            this.bSelected = bSelected;
        }

        if (this.bSelected == true &&
            this.big_pcs_code != undefined &&
            this.big_pcs_code != null &&
            this.big_pcs_code != '') {
            if (gm.me().vSELECTED_STATE == 'N') {
            } else if (gm.me().vSELECTED_STATE == 'P') {
                this.addWorkOrder.enable();
            }
        } else {
            this.addWorkOrder.disable();
        }
    },
    setBigPcsCode: function (big_pcs_code) {
        console_logs('big_pcs_code', big_pcs_code);
        this.big_pcs_code = big_pcs_code;
        this.refreshButtons();
        this.store.getProxy().setExtraParam('po_type', this.big_pcs_code);
        this.store.getProxy().setExtraParam('rtg_type', 'OD');
        this.storeLoad();
    },

    formatDate: function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    },
    workOrder: null,
    denyOrder: null,

    moldInfoStore : Ext.create('Mplm.store.MoldInfoStore',{})
});