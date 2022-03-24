Ext.define('Rfx2.view.company.ynju.produceMgmt.ProduceWorkOrderView', {
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
        // this.addSearchField(
        //     {
        //         field_id: 'state_name'
        //         , store: "DDStateStore"
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{code_name_kr}">[{systemCode}]{code_name_kr}</div>'
        //     });

        // this.addSearchField(
        //     {
        //         field_id: 'emergency'
        //         , store: "HeavyEmergency"
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
        //     });

        // this.addSearchField('lot_no');
        // this.addSearchField('item_code');
        
        // this.addSearchField('product_line');
        // this.addSearchField('element_item_name');
        // this.addSearchField('description');
        this.addSearchField('item_code');
        this.addSearchField('item_name');


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


        this.createStore('Rfx2.model.company.bioprotech.ProduceWorkOrder', [{
            property: 'rtgast.creator',
            direction: 'DESC'
        }],
            //gMain.pageSize
            gMain.pageSize  //pageSize
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
            // features: [{
            //     ftype: 'summary',
            //     dock: 'top'
            // }]
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

        workOrder = this.addWorkOrder;

        is_rotate = 'N';

        var processes = null;
        if (gUtil.mesTplProcessBig != null && gUtil.mesTplProcessBig.length > 0) {
            processes = gUtil.mesTplProcessBig;
        } else {
        }

        if (processes != null) {

            for (var i = processes.length - 1; i >= 0; i--) {
                var o = processes[i];
                var big_pcs_code = o['code'];
                var title = /*'[' + o['code'] + ']' +*/ o['name'];
                console_logs('title', title);

                var action = Ext.create('Ext.Action', {
                    xtype: 'button',
                    text: title,
                    tooltip: title + ' 공정',
                    big_pcs_code: big_pcs_code,
                    toggleGroup: this.link + 'bigPcsType',
                    handler: function () {
                        gm.me().setBigPcsCode(this.big_pcs_code);
                    }
                });

                buttonToolbar.insert(4, action);
            }
            var action = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '전체',
                tooltip: '전체',
                big_pcs_code: '',
                pressed: true,
                toggleGroup: this.link + 'bigPcsType',
                handler: function () {
                    gm.me().setBigPcsCode(this.big_pcs_code);
                }
            });

            buttonToolbar.insert(4, action);
        }

        //버튼 추가.
        buttonToolbar.insert(1, this.printProduceExcelAction);
        // buttonToolbar.insert(1, this.printPDFAction);
        buttonToolbar.insert(1, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        // buttonToolbar.insert(1, this.modifyDepartment);
        buttonToolbar.insert(1, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            // gm.me().denyWorkOrder.disable();
            if (selections.length) {
                var rec = selections[0];

                gm.me().big_pcs_code = rec.get('po_type');

                gm.me().vSELECTED_RTGAST_UID = rec.get('unique_id');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                console_logs('rec>>>>>>>>>', rec);
                gm.me().vSELECTED_PO_NO = rec.get('pj_code');
                // gm.me().printPDFAction.enable();
                gm.me().vSELECTED_PCS_CODE = rec.get('pcs_code');
                gm.me().vSELECTED_STATE = rec.get('state'); //product의 item_code
                console_logs('>>>>>>> SELECTED_STATE', rec.get('state'))

                if (gm.me().vSELECTED_STATE == 'I') {
                    this.refreshButtons(true);
                    gm.me().addWorkOrder.enable();
                    gm.me().denyWorkOrder.enable();
                   // gm.me().printPDFAction.disable();
                } else if (gm.me().vSELECTED_STATE == 'N') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.disable();
                   // gm.me().printPDFAction.enable();
                    // gm.me().finishWorkOrder.enable();
                } else {
                    gm.me().addWorkOrder.disable();
                    gm.me().denyWorkOrder.disable();
                   // gm.me().printPDFAction.enable();
                    // gm.me().finishWorkOrder.enable();
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

    addTabworkOrderGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { menuCode: menuCode },
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },

    addWorkOrderFc: function () {

        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
            params: {
                rtgastUid: rtgastUid
            },

            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax

    },

    denyWorkOrderFc: function () {
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        // console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
        var po_type = this.vSELECTED_RECORD.get('po_type');
        if(po_type === 'HOD' || po_type === 'COD') {
            var cartmap_uid = this.vSELECTED_RECORD.get('coord_key1');
            var item_quan = this.vSELECTED_RECORD.get('item_quan');
            // var assymap_uid = this.vSELECTED_RECORD.get('coord_key'); 
            // 수주 생산일 경우
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderProd',
                params: {
                    rtgastUid: rtgastUid,
                    cartmap_uid : cartmap_uid,
                    item_quan : item_quan
                },
                success: function (result, request) {
                    gm.me().store.load();
                    Ext.Msg.alert('안내', '요청하였습니다.', function () {
                    });
                },
                failure: extjsUtil.failureMessage
            });
        } else if(po_type === 'HSC' || po_type === 'CSC') {
            var srcahd_uid = this.vSELECTED_RECORD.get('uid_srcahd');
            var prev_rtgast_uid = this.vSELECTED_RECORD.get('coord_key2');
            var rtgast_uid = this.vSELECTED_RECORD.get('unique_id_long');
            // 계획생산 일 경우
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderAssy',
                params: {
                    srcahd_uid: srcahd_uid,
                    prev_rtgast_uid : prev_rtgast_uid,
                    rtgast_uid : rtgast_uid
                },
                success: function (result, request) {
                    gm.me().store.load();
                    Ext.Msg.alert('안내', '요청하였습니다.', function () {
                    });
                },
                failure: extjsUtil.failureMessage
            });
        }
        
    },

    treatWorkStart: function (o, rec) {
        console_logs('rec ????', rec)
        //다수협력사지정
        var itemsPartner = [];
        var pcs_steel = [];
        var big_pcs_code = o;

        for (var i = 0; i < big_pcs_code['datas'].length; i++) {
            pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
        }

        itemsPartner.push(
            {
                fieldLabel: '작업지시일',
                xtype: 'datefield',
                anchor: '100%',
                name: 'reserved_timestamp1',
                fieldStyle: 'background-color: #ddd; background-image: none;',
                value: new Date(),
                format: 'Y-m-d',
                readOnly: true,
                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            });

        itemsPartner.push({

            fieldLabel: '긴급여부',//ppo1_request,
            xtype: 'combo',
            anchor: '100%',
            name: 'recv_flagname',
            mode: 'local',
            value: '일반',
            store: Ext.create('Mplm.store.HeavyEmergency'),
            sortInfo: { field: 'create_date', direction: 'DESC' },
            //valueField : 'system_code',
            displayField: 'code_name_kr',
            typeAhead: false,
            minChars: 1,
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function () {
                    return '<div data-qtip="{unique_id}">[{system_code}] {code_name_kr}</div>';
                }
            },
            listeners: {
                select: function (combo, record) {
                    var reccode = record.get('system_code');
                    Ext.getCmp('recv_flag').setValue(reccode);
                }
            }


        }, {
            xtype: 'hiddenfield',
            id: 'recv_flag',
            name: 'recv_flag',
            value: 'GE'


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
        myHeight = 170;
        myWidth = 320;

        prwin = gm.me().prwinopen(form);
    },
    pdfprintHandler: function () {
        var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
        var po_no = gm.me().vSELECTED_PO_NO;
        var pcs_code = gm.me().vSELECTED_PCS_CODE;
        var ac_uid = gm.me().vSELECTED_AC_UID;
        console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/pdf.do?method=printWo',
            params: {
                rtgast_uid: rtgast_uid,
                po_no: po_no,
                pcs_code: pcs_code,
                ac_uid: ac_uid,
                is_heavy: 'Y',	 //중공업:Y  기타:N
                is_rotate: 'Y', //가로양식:Y 세로양식:N
                specification: gm.me().selectSpecification,
                pdfPrint: 'pdfPrint'
            },
            reader: {
                pdfPath: 'pdfPath'
            },
            success: function (result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                var pdfPath = jsonData.pdfPath;
                console_logs(pdfPath);
                if (pdfPath.length > 0) {
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                    top.location.href = url;
                }
            },
            failure: extjsUtil.failureMessage
        });
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
                                var ac_uid = gm.me().vSELECTED_AC_UID;
                                var rtgastUid = gm.me().vSELECTED_RTGAST_UID;
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var rtgastUids = [];
                                var ac_uids = [];
                                var order_number = ''
                                var srcahd_uid = '';
                                var pi_number = '';
                                var item_quan = '';
                                var po_type = '';
                                var specification = '';
                                var line_code = '';
                                var assymap_uid = '';
                                var cartmap_uid = '';
                                var reserved_varchar2 = '';
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    console_logs('rec', rec);
                                    var uid = rec.get('unique_id');  //rtgast_uid
                                    rtgastUids.push(uid);
                                    var ac_uid = rec.get('coord_key3');   //프로젝트 uid
                                    ac_uids.push(ac_uid);
                                    order_number = rec.get('order_number');
                                    srcahd_uid = rec.get('srcahd_uid');
                                    pi_number = rec.get('reserved_varchar1');
                                    item_quan = rec.get('item_quan');
                                    po_type = rec.get('po_type');
                                    specification = rec.get('specification');
                                    line_code = rec.get('name');
                                    assymap_uid = rec.get('coord_key');
                                    cartmap_uid = rec.get('coord_key1'); // cartmap_uid
                                    reserved_varchar2 = rec.get('reserved_varchar2');
                                }

                                prWin.setLoading(true);
                                form.submit({
                                    url: CONTEXT_PATH +  '/index/process.do?method=addWorkOrderGeneral',
                                    params: {
                                        order_number: order_number,
                                        srcahd_uid: srcahd_uid,
                                        item_quan: item_quan,
                                        po_type: po_type,
                                        specification: specification,
                                        ac_uid: ac_uid,
                                        rtgastUid: rtgastUid,
                                        assymap_uid: assymap_uid,
                                        cartmap_uid : cartmap_uid
                                    },
                                    success: function (val, action) {
                                        var myWin = prWin;
                                        workOrder.disable();
                                        // denyOrder.disable();
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
    treatWorkFinish: function () {
        var rtgast_uids = [];
        var selections = this.grid.getSelectionModel().getSelection();
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            rtgast_uids.push(uid);
        }
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=finishWorkOrderHeavy',
            params: {
                rtgastUids: rtgast_uids
            },
            reader: {},
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

            },
            failure: extjsUtil.failureMessage
        });
    },
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
                // this.modifyDepartment.enable();
            } else if (gm.me().vSELECTED_STATE == 'P') {
                this.addWorkOrder.enable();
            }
        } else {
            // this.modifyDepartment.disable();
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
    treatModifyDepartment: function (o) {
        //다수협력사지정
        var itemsPartner = [];
        var pcs_steel = [];
        var big_pcs_code = o;
        for (var i = 0; i < big_pcs_code['datas'].length; i++) {
            pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
        }
        for (var i = 0; i < pcs_steel.length; i++) {
            var o = pcs_steel[i];
            var pcs_code = o['code'];
            var pcs_name = o['name'];
            console_logs('itemspartner', o);
            var aStore = Ext.create('Mplm.store.DeptStore', { dept_group: 'PCO' });
            var myId = this.link + pcs_code + 'h_outmaker';
            this.madeComboIds.push(myId);
            itemsPartner.push({
                fieldLabel: pcs_name,//ppo1_request,
                xtype: 'combo',
                anchor: '100%',
                name: pcs_code + 'h_outmaker',
                id: myId,
                mode: 'local',
                displayField: 'dept_name',
                store: aStore,
                sortInfo: { field: 'create_date', direction: 'DESC' },
                valueField: 'dept_code',
                typeAhead: false,
                minChars: 1,
                listConfig: {
                    loadingText: '검색중...',
                    emptyText: '일치하는 항목 없음.',
                    getInnerTpl: function () {
                        return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                    }
                }
            });
        }//endoffor


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
                    title: '협력사를 재설정합니다.',
                    defaultType: 'textfield',
                    items: itemsPartner
                },
            ]//item end..
        });//Panel end...
        myWidth = 320;
        myHeight = 200;
        prwin = gm.me().prwinanotheropen(form);
    },
    prwinanotheropen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '협력사재설정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '협력사를 재설정 하시겠습니까?'
                    var myTitle = '협력사재설정';
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
                                var cartmaparr = gm.me().cartmap_uids;
                                var ac_uid = gm.me().vSELECTED_AC_UID;
                                var rtgastUid = gm.me().vSELECTED_RTGAST_UID;

                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var rtgastUids = [];
                                var ac_uids = [];

                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    console_logs('rec', rec);

                                    var uid = rec.get('unique_id');  //rtgast_uid
                                    rtgastUids.push(uid);

                                    var ac_uid = rec.get('coord_key3');   //프로젝트 uid
                                    ac_uids.push(ac_uid);
                                }

                                prWin.setLoading(true);
                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=modifyDepartmentHeavy',
                                    params: {
                                        cartmap_uids: cartmaparr,
                                        ac_uid: ac_uid,
                                        reserved_varchar3: 'PRD',
                                        rtgastUid: rtgastUid,
                                        ac_uids: ac_uids,
                                        rtgastUids: rtgastUids
                                    },
                                    success: function (val, action) {
                                        var myWin = prWin;
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
                        }
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

    // itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    //     var dataIndex = eventObject.position.column.dataIndex;
    //     switch (dataIndex) {
    //         case 'emergency':
    //         case 'reserved_varchar2':
    //             break;
    //         default:
    //             gm.me().doOpenWorkOrder();
    //     }
    // },

    doOpenWorkOrder: function () {
        var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
        var po_no = gm.me().vSELECTED_PO_NO;
        var pcs_code = gm.me().vSELECTED_PCS_CODE;
        var ac_uid = gm.me().vSELECTED_AC_UID;
        console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
        console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
        console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);
        gMain.setCenterLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/pdf.do?method=printWo',
            params: {
                rtgast_uid: rtgast_uid,
                po_no: po_no,
                pcs_code: pcs_code,
                ac_uid: ac_uid,
                is_heavy: 'Y',	 //중공업:Y  기타:N
                is_rotate: is_rotate, //가로양식:Y 세로양식:N
                wo_type: 'P',
                pdfPrint: 'pdfPrint'
            },
            reader: {
                pdfPath: 'pdfPath'
            },
            success: function (result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                var pdfPath = jsonData.pdfPath;
                console_logs(pdfPath);
                if (pdfPath.length > 0) {
                    var pdfPathSplit = pdfPath.split('/');
                    var fileName = pdfPathSplit[pdfPathSplit.length - 1];
                    var pageScale = (window.screen.width / 1000).toFixed(1);
                    var pdfView = Ext.create('PdfViewer.view.panel.PDF', {
                        width: window.screen.width / 5 * 3 + 20,
                        height: window.screen.height / 4 * 3 - 35,
                        pageScale: pageScale,
                        showPerPage: true,
                        pageBorders: false,
                        disableTextLayer: true,
                        src: '/download/PDF/' + fileName,
                        renderTo: Ext.getBody()
                    });
                    var woWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '작업지시서 PDF 미리보기',
                        width: window.screen.width / 5 * 3 + 20,
                        height: window.screen.height / 4 * 3,
                        plain: true,
                        items: [
                            pdfView
                        ]
                    });
                    gMain.setCenterLoading(false);
                    woWin.show();
                }
            },
            failure: function (val, action) {
                gMain.setCenterLoading(false);
                Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
            }
        });
    },
    formatDate: function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    },

    editRedord: function (field, rec) {
        var params = {};
        switch (field) {
            case 'emergency':
                var emergency = rec.get('emergency');
                switch (emergency) {
                    case 'EM':
                        rec.set('emergency', '긴급');
                        break;
                    case 'GE':
                        rec.set('emergency', '일반');
                        break;
                    default:
                        break;
                }
                gm.editAjax('rtgast', 'recv_flag', emergency, 'unique_id', rec.get('unique_id_long'), true);
                //gm.me().store.load();
                break;
            default:
                gm.editRedord(field, rec);
                break;
        }
    },
    workOrder: null,
    denyOrder: null,
    selMode: 'SINGLE'
});