Ext.define('Rfx2.view.company.hanjung.produceMgmt.ProduceWorkOrderView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-workorder-view',
    estiContentStore: Ext.create('Rfx2.store.company.hanjung.EstiContentWorkOrderStore', {}),
    estiContentRecords: null,
    rec: null,
    gridIds: [],
    requires: [
        'PdfViewer.view.panel.PDF'
    ],
    form: Ext.create('Ext.form.Panel', {
        id: gu.id('barcodeformPanel'),
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
                title: '수량/인증명을 입력하세요.',
                collapsible: false,
                defaults: {
                    labelWidth: 70,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                    }
                },
                items: [
                    {
                        xtype: 'numberfield',
                        id: gu.id('print_qty'),
                        name: 'print_qty',
                        fieldLabel: '출력매수',
                        margin: '3 3 3 3',
                        width: 350,
                        allowBlank: false,
                        value: 1
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('injung_name'),
                        name: 'injung_name',
                        fieldLabel: '인증명',
                        margin: '3 3 3 3',
                        width: 350,
                        allowBlank: false,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function (form, e) {
                                gm.me().getBarcodeHtml(rec, gu.getCmp('injung_name').getValue());
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '바코드 미리보기',
                collapsible: false,
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
                        xtype: 'component',
                        id: gu.id('barcodeHtml'),
                        width: 380,
                        height: 190,
                        html: ''
                    },
                ]
            }
        ]

    }),
    initComponent: function () {
        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        //진행상태 검색툴바
        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'status'
                , store: "RecevedStateStore"
                , displayField: 'codeName'
                , emptyText: '상태'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField('project_varcharh');
        this.addSearchField('project_varchar3');
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
        this.createStore('Rfx2.model.company.kbtech.ProduceWorkOrder', [{
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
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 건)</div>'
        });

        var option = {
            features: [groupingFeature]
        };

        this.createGrid(searchToolbar, buttonToolbar);

        this.editAction.setText('상세보기');

        //작업반려 Action 생성
        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '제작반려',
            tooltip: '제작',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 데이터를 제작계획수립 단계로 이동하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
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

        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '차량관리바코드',
            tooltip: '차량관리바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                rec = selection[0];
                gMain.selPanel.printBarcode(rec);
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
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=getBigPcsCodeByRtgAst',
                    params: {
                        rtgastUid: gm.me().vSELECTED_RTGAST_UID
                    },
                    success: function (result, request) {
                        datas = Ext.util.JSON.decode(result.responseText);
                        gm.me().treatWorkStart(datas);
                    },//endofsuccess
                    failure: extjsUtil.failureMessage
                });//endofajax
            }
        });

        workOrder = this.addWorkOrder;

        //작업완료 Action 생성
        this.finishWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '작업완료',
            tooltip: '작업완료 확정',
            disabled: true,
            handler: function () {
                gm.me().treatWorkFinish();

            }
        });

        //협력사재설정 Action 생성
        this.modifyDepartment = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '협력사재설정',
            tooltip: '협력사 재설정',
            disabled: true,
            handler: function () {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=getBigPcsCodeByRtgAst',
                    params: {
                        rtgastUid: gm.me().vSELECTED_RTGAST_UID
                    },
                    success: function (result, request) {
                        datas = Ext.util.JSON.decode(result.responseText);
                        gm.me().treatModifyDepartment(datas);
                    },//endofsuccess
                    failure: extjsUtil.failureMessage
                });//endofajax
            }
        });

        is_rotate = 'N';

        //제작 인식표 출력
        this.printPDFTag = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '차량 인식표 ',
            tooltip: '차량 인식표를 출력합니다.',
            disabled: true,
            handler: function (widget, event) {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var reserved_varcharh = rec.get('project_varcharh');
                console_logs('reserved_varcharh>>>', reserved_varcharh);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printBC',
                    params: {
                        rtgast_uid: reserved_varcharh,
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
                        is_rotate: 'Y', //가로양식:Y 세로양식:N
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
            }
        });
        var rtgast_uid_est;

        this.modifyWoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '작업지시서 수정',
            tooltip: '작업지시서 수정',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                rec = selections[0];
                gm.me().modifyWoWindow(rec);
            }
        });

        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '작업지시서',
            tooltip: '작업지시서 출력',
            disabled: true,
            handler: function (widget, event) {
                if (gm.me().estiContentRecords != null && gm.me().estiContentRecords.length > 0) {
                    var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
                    var po_no = gm.me().vSELECTED_PO_NO;
                    var pcs_code = gm.me().vSELECTED_PCS_CODE;
                    var ac_uid = gm.me().vSELECTED_AC_UID;
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var rec = selections[0];
                    var unique_uid = rec.get('unique_uid');
                    var pj_uid = rec.get('ac_uid');
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printWoHJ',
                        params: {
                            rtgast_uid: rtgast_uid,
                            po_no: po_no,
                            pcs_code: pcs_code,
                            ac_uid: ac_uid,
                            unique_uid: unique_uid,
                            is_rotate: 'N', //가로양식:Y 세로양식:N
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
                } else {
                    Ext.MessageBox.alert('알림', '작업지시서가 작성되지 않았습니다.');
                }
            }
        });

        var processes = null;
        if (gUtil.mesTplProcessBig != null && gUtil.mesTplProcessBig.length > 0) {
            processes = gUtil.mesTplProcessBig;
        } else {

        }

        if (processes != null) {
            for (var i = processes.length - 1; i >= 0; i--) {
                var o = processes[i];
                var big_pcs_code = o['code'];
                var title = '[' + o['code'] + ']' + o['name'];
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
                text: '전체 대공정',
                tooltip: '전체 대공정',
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
        buttonToolbar.insert(1, this.addWorkOrder);
        buttonToolbar.insert(1, this.denyWorkOrder);
        buttonToolbar.insert(2, this.printBarcodeAction);
        buttonToolbar.insert(2, this.printPDFTag);
        buttonToolbar.insert(2, this.modifyWoAction);
        buttonToolbar.insert(3, this.printPDFAction);
        buttonToolbar.insert(16, '-');
        buttonToolbar.insert(1, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            gm.me().denyWorkOrder.enable();
            if (selections.length) {
                var rec = selections[0];
                gm.me().big_pcs_code = rec.get('po_type');
                gm.me().vSELECTED_RTGAST_UID = rec.get('unique_id');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                console_logs('rec>>>>>>>>>', rec);
                gm.me().vSELECTED_PO_NO = rec.get('pj_code');
                gm.me().vSELECTED_PCS_CODE = rec.get('pcs_code');
                gm.me().vSELECTED_STATE = rec.get('state'); //product의 item_code
                // if (gm.me().vSELECTED_STATE == 'P') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.enable();
                 if (gm.me().vSELECTED_STATE == 'Y') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.disable();
                    gm.me().finishWorkOrder.enable();
                } else {
                    gm.me().denyWorkOrder.enable();
                    gm.me().finishWorkOrder.enable();
                }
                gm.me().printPDFTag.enable();
                gm.me().printBarcodeAction.enable();
                gm.me().printPDFAction.enable();
                gm.me().modifyWoAction.enable();
                gm.me().estiContentStore.getProxy().setExtraParam('pj_uid', gm.me().vSELECTED_AC_UID);
                gm.me().estiContentStore.getProxy().setExtraParam('rtgast_uid', '-1');
                gm.me().estiContentStore.load(function (record) {
                    objs = [];
                    gm.me().estiContentRecords = record;
                    var obj = {};
                    console_logs('>>>> estiContentRecords ', gm.me().estiContentRecords);
                    var rec = gm.me().estiContentRecords;
                    var columns = [];
                    for (var i = 0; i < rec.length; i++) {
                        var sel = rec[i];
                        var objv = {};
                        // console_logs('>>> sel', sel);
                        var code_uid = sel.get('code_uid');
                        var total_price = sel.get('total_price');
                        rtgast_uid_est = sel.get('rtgast_uid');

                        objv['code_uid'] = code_uid;
                        objv['total_price'] = total_price;
                        columns.push(objv);
                    }
                    console_logs('>>>objv', columns);
                    obj['datas'] = columns;
                    objs.push(obj);
                    console_logs('>>>> objs >>>>> ', objs);
                })
            } else {
                this.refreshButtons(false);
                gm.me().vSELECTED_UNIQUE_ID = -1
                gm.me().printPDFTag.disable();
                gm.me().printBarcodeAction.disable();
                gm.me().printPDFAction.disable();
                gm.me().modifyWoAction.disable();
            }
        });

        this.createCrudTab();
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
        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
        var state = this.vSELECTED_RECORD.get('state');
        var srcahd_uid = this.vSELECTED_RECORD.get('srcahd_uid');
        var assymap_uid = this.vSELECTED_RECORD.get('unique_uid');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderHeavyHanjung',
            params: {
                state : state,
                rtgastUid: rtgastUid,
                srcahd_uid : srcahd_uid,
                assymap_uid : assymap_uid
            },
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    treatWorkStart: function (o) {
        var itemsPartner = [];
        var pcs_steel = [];
        var big_pcs_code = o;
        for (var i = 0; i < big_pcs_code['datas'].length; i++) {
            pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
        }
        itemsPartner.push(
            {
                fieldLabel: '완료요청일',
                xtype: 'datefield',
                anchor: '100%',
                name: 'reserved_timestamp1',
                format: 'Y-m-d',
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
            items: [{
                xtype: 'fieldset',
                title: '작업지시내용',
                defaultType: 'textfield',
                /*boder : true,
                 defaults: {
                 width: 280
                 },*/
                items: itemsPartner
            }
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
                                var cartmaparr = gm.me().cartmap_uids;
                                var ac_uid = gm.me().vSELECTED_AC_UID;
                                //var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
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
                                    url: CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
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
                                        workOrder.disable();
                                        denyOrder.disable();
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
                this.modifyDepartment.enable();
            } else if (gm.me().vSELECTED_STATE == 'P') {
                this.addWorkOrder.enable();
            }
        } else {
            this.modifyDepartment.disable();
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
                }
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
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
        var po_no = gm.me().vSELECTED_PO_NO;
        var pcs_code = gm.me().vSELECTED_PCS_CODE;
        var ac_uid = gm.me().vSELECTED_AC_UID;
        var unique_uid = rec.get('unique_uid');

        gm.me().estiContentStore.getProxy().setExtraParam('pj_uid', gm.me().vSELECTED_AC_UID);
        gm.me().estiContentStore.getProxy().setExtraParam('rtgast_uid', '-1');
        gm.me().estiContentStore.load(function (record) {
            objs = [];
            gm.me().estiContentRecords = record;
            var obj = {};
            console_logs('>>>> estiContentRecords ', gm.me().estiContentRecords);
            var rec = gm.me().estiContentRecords;
            var columns = [];
            for (var i = 0; i < rec.length; i++) {
                var sel = rec[i];
                var objv = {};
                // console_logs('>>> sel', sel);
                var code_uid = sel.get('code_uid');
                var total_price = sel.get('total_price');
                rtgast_uid_est = sel.get('rtgast_uid');

                objv['code_uid'] = code_uid;
                objv['total_price'] = total_price;
                columns.push(objv);
            }
            console_logs('>>>objv', columns);
            obj['datas'] = columns;
            objs.push(obj);
            console_logs('>>>> objs >>>>> ', objs);
        });

        if (gm.me().estiContentRecords.length > 0) {
            gMain.setCenterLoading(true);
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/pdf.do?method=printWoHJ',
                params: {
                    rtgast_uid: rtgast_uid,
                    po_no: po_no,
                    pcs_code: pcs_code,
                    ac_uid: ac_uid,
                    unique_uid: unique_uid,
                    is_rotate: 'N', //가로양식:Y 세로양식:N
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
                        console_logs('>>>>>> fileName', fileName);
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
        } else {
            Ext.Msg.alert('알림', '작업지시서가 작성되지 않았습니다.');
        }
    },

    formatDate: function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('/');
    },

    printBarcode: function (rec) {
        var selections = null;
        selections = gm.me().grid.getSelectionModel().getSelection();
        if (selections.length > 1) {
            Ext.Msg.alert('알림', '바코드를 출력할 정보를 선택하십시오.');
        } else {
            var uid = rec.get('srcahd_uid'); // 바코드 일련번호
            var make_no = rec.get('project_varcharh'); // 수주번호
            var wearing_date = rec.get('project_timestamp1'); // 입고일
            var customer_name = rec.get('project_varchar2'); // 고객명
            var car_name = rec.get('project_varchar3'); // 차명
            var delivery_plan = '';// 출고 예정일
            var project_number1 = rec.get('project_number1');
            delivery_plan = rec.get('delivery_plan');
            var injung_name = '';
            if (delivery_plan == null) {
                delivery_plan = '';
            }
            gm.me().getBarcodeHtml(rec, injung_name);
            gm.me().prbarcodeopen(gm.me().form, rec);
        }
    },
    prbarcodeopen: function (form, rec) {
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '차량관리바코드 출력',
            closeAction: 'hide',
            plain: true,
            items: [
                form
            ],
            buttons: [{
                text: '출력하기',
                handler: function () {
                    var form = gu.getCmp('barcodeformPanel').getForm();
                    var val = form.getValues(false);
                    var uid = rec.get('srcahd_uid');
                    var delivery_plan = rec.get('delivery_plan');
                    var make_no = rec.get('project_varcharh');
                    var order_type = rec.get('order_type');
                    var delivery_plan_date = gm.me().formatDate(delivery_plan);
                    var reserved_timestamp1 = rec.get('project_timestamp1_str');
                    var injung_name = val['injung_name'];
                    var reserved_timestamp1_date = '';
                    if (reserved_timestamp1.length > 0) {
                        reserved_timestamp1_date = gm.me().formatDate(reserved_timestamp1);
                    }
                    var desc = rec.get('project_varchar2');
                    var car_name = rec.get('project_varchar3');
                    var project_number1 = rec.get('project_varchari');
                    var pmWithCount = rec.get('pmWithCount');
                    var print_qty = gu.getCmp('print_qty').getValue();

                    console_logs('>>>>> delivery_plan', delivery_plan);
                    form.submit({
                        url: CONTEXT_PATH + '/production/schdule.do?method=printPrdBarcodeBySrcahd',
                        params: {
                            unique_id: uid,
                            injung_name: injung_name,
                            make_no: make_no,
                            wearing_date: reserved_timestamp1_date,
                            delivery_plan: delivery_plan_date,
                            desc: desc,
                            project_number1: project_number1,
                            print_qty: print_qty,
                            order_type: order_type,
                            car_name: car_name,
                            pmWithCount: pmWithCount
                        },
                        success: function (val, action) {
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                        },
                        failure: function (val, action) {
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                        }
                    });
                }
            }, {
                text: '닫기',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    getBarcodeHtml: function (rec, injung_name) {
        var customerName = rec.get('project_varchar2');      // 고객명
        var project_varcharh = rec.get('project_varcharh');  // 수주번호
        var reserved_timestamp1 = rec.get('project_timestamp1_str');  // 입고일
        var project_varchar3 = rec.get('project_varchar3');
        var delivery_plan = rec.get('delivery_plan'); // 출고일
        var reserved_timestamp1_date = '';
        if (reserved_timestamp1.length > 0) {
            reserved_timestamp1_date = gm.me().formatDate(reserved_timestamp1);
        } else {
            reserved_timestamp1_date = '';
        }

        var delivery_plan_date = gm.me().formatDate(delivery_plan);
        var proejct_varchari = rec.get('project_varchari');
        var order_type = rec.get('order_type');
        var pmWithCount = rec.get('pmWithCount');

        if (delivery_plan == null) {
            delivery_plan_date = '';
        }
        var htmlData =
            '<div style = "margin: 10px auto; width: 350px; height: 180px; box-shadow: 0 0 10px #999999; border-radius: 5px;">'
            + '<table>'
            + '<tr>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="4" style="vertical-align: top; ">' +
            '<div style ="margin: 7px; font-weight: bold; font-family: 맑은 고딕 !important; font-size:20px; width: 350px; height: 20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'
            //+'<div style ="padding: 10px 0px 0px 0px; font-family: 맑은 고딕 !important; font-size:30px; height: 30px; width: 350px; white-space:nowrap; ">'
            + project_varcharh +
            '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
            + pmWithCount + '</div>'
            //+ '</div>'
            + '</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '차대번호:' + proejct_varchari /**+ '&nbsp&nbsp입고:' + reserved_timestamp1_date +'&nbsp&nbsp출고:' + delivery_plan_date**/ + '</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '제작명: ' + order_type + '/' + project_varchar3 + '&nbsp&nbsp&nbsp&nbsp</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '인증명:' + injung_name + '</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '입고일:' + reserved_timestamp1_date + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp출고요청일: ' + delivery_plan_date + '</div>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td cellpadding="30px" colspan="6" style ="font-weight: bold;">' +
            '<div style="width: 345px; height: 30px; background-color: #333333; font-family: 맑은 고딕 !important; ' +
            'color: white; text-align: center;">' +
            'Barcode 공간</div>' +
            '</td>' +
            '</tr>' +
            '</div>';

        if (gu.getCmp('barcodeHtml') != undefined && gu.getCmp('barcodeHtml') != null) {
            gu.getCmp('barcodeHtml').setHtml(htmlData);
        }
    },

    createEsFieldSet: function (system_code, system_name, code_uid, mode) {
        var grid = gm.me().createEsGrid(system_code, code_uid);
        var fieldset = {
            xtype: 'fieldset',
            id: gu.id('fieldset-' + system_code),
            title: system_name,
            frame: true,
            width: '100%',
            height: '100%',
            layout: 'fit',
            defaults: {
                margin: '2 2 2 2'
            },
            items: [
                grid,
                {
                    xtype: 'hiddenfield',
                    name: 'codeUid-' + system_code,
                    value: code_uid
                }
            ]
        };
        var store = grid.getStore();
        if (mode === 'ADD') {
            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': -1,
                'item_name': '',
                // 'sales_price': '0'
            }));
        }
        return fieldset;
    },

    createEsGrid: function (system_code) {
        var grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('grid-' + system_code),
            collapsible: false,
            multiSelect: false,
            width: 900,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '항목',
                    width: '80%',
                    dataIndex: 'item_name',
                    editor: 'textfield',
                    sortable: false
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (context.field == 'item_name') {
                        //context.record.set('item_name', '');
                    }
                }
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '항목삭제',
                            listeners: [{
                                click: function () {
                                    Ext.MessageBox.show({
                                        title: '항목삭제',
                                        msg: '해당 항목을 삭제하시겠습니까?<br>항목의 모든 내용이 삭제 됩니다.',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {
                                                gu.getCmp('fieldset-' + system_code).destroy();
                                                var idIndex = gm.me().gridIds.indexOf(system_code);
                                                if (idIndex !== -1) {
                                                    gm.me().gridIds.splice(idIndex, 1);
                                                }
                                            }
                                        },
                                        //animateTarget: this,
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }
                            }]
                        },
                        {
                            text: '+',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('grid-' + system_code).getStore();
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'esti_uid': -1,
                                        'item_name': '',
                                        // 'sales_price': '0'
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('grid-' + system_code).getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('grid-' + system_code).getStore();
                                    if(record == null) {
                                        gu.getCmp('grid-' + system_code).getStore().remove(store.last());
                                    } else {
                                        gu.getCmp('grid-' + system_code).getStore().removeAt(gu.getCmp('grid-' + system_code).getStore().indexOf(record));
                                    }
                                }
                            }]
                        },
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var grid = gu.getCmp('grid-' + system_code);
                                    var record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }
                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var grid = gu.getCmp('grid-' + system_code);
                                    var record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }
                                    var index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }
                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);
                                }
                            }]
                        }
                    ]
                })
            ]
        });
        gm.me().gridIds.push(system_code);
        return grid;
    },
    addElement: function () {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('elementFormPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '추가할 사양을 선택해 주세요',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '사양 선택',
                            id: gu.id('sel_option'),
                            xtype: 'combo',
                            anchor: '100%',
                            width: '98%',
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.EstiSelStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            name: 'sel_option',
                            listeners: {
                                select: function (combo, records, eOpts) {
                                    var sel_option_code = gu.getCmp('sel_option').getValue();
                                    var sel_option_name = gu.getCmp('sel_option').getRawValue();
                                    var code_uid = records.id;
                                    gu.getCmp('code_name_kr').setValue(sel_option_name);
                                    gu.getCmp('code_uid').setValue(code_uid);
                                }
                            }

                        },
                        {
                            xtype: 'hiddenfield',
                            id: gu.id('code_name_kr'),
                            name: 'code_name_kr',
                            value: ''
                        },
                        {
                            xtype: 'hiddenfield',
                            id: gu.id('code_uid'),
                            name: 'code_uid',
                            value: ''
                        }
                    ]
                }
            ]
        });

        var subWin = Ext.create('Ext.Window', {
            modal: true,
            title: '항목추가',
            width: 500,
            height: 150,
            plain: true,
            items: form,
            autoScroll: true,
            buttons: [{
                text: '확인',
                handler: function (btn) {
                    if (btn == 'no') {
                        subWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var systemCode = val['sel_option'];
                            var code_name_kr = val['code_name_kr'];
                            var code_uid = val['code_uid'];
                            var formPanelKeys = gu.getCmp('formPanel').items.keys;
                            var isIncludeItem = false;
                            for (var i = 0; i < formPanelKeys.length; i++) {
                                if (formPanelKeys[i].includes(gu.id(systemCode))) {
                                    isIncludeItem = true;
                                    break;
                                }
                            }
                            if (!isIncludeItem) {
                                gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 1,
                                    gm.me().createEsFieldSet(systemCode, code_name_kr, code_uid, 'ADD'));
                                if (subWin) {
                                    subWin.close();
                                }
                            } else {
                                Ext.Msg.alert('오류', '같은 항목을 중복으로 삽입할 수 없습니다.');
                            }
                        } else {
                            if (subWin) {
                                subWin.close();
                            }
                        }
                    }
                }
            }, {
                text: '취소',
                handler: function () {
                    if (subWin) {
                        subWin.close();
                    }
                }
            }]
        });
        subWin.show();
    },

    modifyWoWindow: function (rec) {
        gm.me().gridIds = [];
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '기본정보',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            editable: false,
                            fieldLabel: '제작명',
                            width: '99%',
                            value: rec.get('order_type'),
                            name: 'item_name',
                            anchor: '100%',
                        },
                        {
                            xtype: 'textfield',
                            editable: false,
                            fieldLabel: '고객명',
                            width: '99%',
                            value: rec.get('project_varchar2'),
                            name: 'customer_name',
                            anchor: '100%',
                        },
                        {
                            xtype: 'textfield',
                            editable: false,
                            fieldLabel: '차량제조사',
                            width: '99%',
                            value: rec.get('carMaker'),
                            name: 'car_maker',
                            anchor: '100%',
                        }, {
                            fieldLabel: '차종',
                            editable: false,
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'car_name',
                            value: rec.get('project_varchar3')
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'pj_uid',
                            value: rec.get('ac_uid')
                        }
                    ]
                },
                Ext.create('Ext.Button', {
                    text: '항목 추가',
                    width: '100%',
                    renderTo: Ext.getBody(),
                    handler: function () {
                        gm.me().addElement();
                    }
                })
            ]
        });
        for (var i = 0; i < gm.me().estiContentRecords.length; i++) {
            var rec = gm.me().estiContentRecords[i];
            var system_code = rec.get('code_name');
            var system_name = rec.get('code_name_kr');
            var code_uid = rec.get('code_uid');
            if (gm.me().gridIds.indexOf(system_code) < 0) {
                gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 1,
                    gm.me().createEsFieldSet(system_code, system_name, code_uid, 'MODIFY'));
                var curFieldSet = gu.getCmp('fieldset-' + system_code);
                var curFieldItems = curFieldSet.items.items;
                for (var j = 0; j < curFieldItems.length; j++) {
                    if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'totalPrice-' + system_code) {
                        curFieldItems[j].setValue(rec.get('total_price'));
                    } else if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'codeUid-' + system_code) {
                        curFieldItems[j].setValue(rec.get('code_uid'));
                    }
                }
            }
            var store = gu.getCmp('grid-' + system_code).getStore();
            var item_name = rec.get('item_name');
            // var sales_price = rec.get('item_price');
            var esti_uid = rec.get('unique_id_long');
            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': esti_uid,
                'item_name': item_name,
                // 'sales_price': sales_price
            }));
        }
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '작업지시서 수정',
            width: 950,
            height: 700,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [
                {
                    text: '작업지시서 수정',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var objs = [];
                                for (var i = 0; i < gm.me().gridIds.length; i++) {
                                    var id = gm.me().gridIds[i];
                                    var storeData = gu.getCmp('grid-' + id).getStore();
                                    var obj = {};
                                    // obj['totalPrice'] = val['totalPrice-' + id].replace(/,/g, '');
                                    obj['codeUid'] = val['codeUid-' + id];
                                    var columns = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        objv['esti_uid'] = item.get('esti_uid');
                                        objv['item_name'] = item.get('item_name');
                                        // objv['sales_price'] = item.get('sales_price');
                                        columns.push(objv);
                                    }
                                    obj['datas'] = columns;
                                    objs.push(obj);
                                }
                                var reserved_number3 = rec.get('reserved_number3');
                                var jsonData = Ext.util.JSON.encode(objs);
                                form.submit({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=modifyWoHJ',
                                    waitMsg: '수정중입니다.',
                                    params: {
                                        jsonData: jsonData,
                                        // reserved_number3: reserved_number3
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                        gm.me().store.load();
                                        gm.me().estiContentStore.load(function (record) {
                                            gm.me().estiContentRecords = record;
                                        })
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: '수정 취소',
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
    workOrder: null,
    denyOrder: null
});