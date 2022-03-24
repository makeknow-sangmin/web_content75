Ext.define('Rfx2.view.company.dsmaref.produceMgmt.ProduceWorkOrderView', {
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
        //         , value:'P'
        //         , innerTpl: '<div data-qtip="{code_name_kr}">[{systemCode}]{code_name_kr}</div>'
        //     });

        this.addSearchField(
            {
                field_id: 'emergency'
                , store: "HeavyEmergency"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
            });

        this.addSearchField('lot_no');
        this.addSearchField('item_code');
        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        var MakeStateStore = Ext.create('Mplm.store.DDStateStore',{});
        MakeStateStore.load();

        searchToolbar.insert(0, {
            xtype:'combo',
            field_id:'state_name',
            width:130,
            store:MakeStateStore,
            displayField: 'codeName',
            valueField: 'systemCode',
            value:'P',
            fieldStyle:'background-color: #FBF8E6;',
            innerTpl: '<div data-qtip="{code_name_kr}">{code_name_kr}</div>',
            listeners: {
                select: function(combo, record) {
                    var value = combo.getValue();
                    gm.me().store.getProxy().setExtraParam('state_name', value);
                    gm.me().store.load();
                }
            }
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }

        });

        this.createStore('Rfx2.model.company.dsmf.ProduceWorkOrder', [{
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
            };

        });

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{columnName}:{name} / 납품예정일: {[values.rows[0].data.delivery_plan_str]} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
            hideGroupedHeader: false,
            startCollapsed: false,
            // id: 'restaurantGrouping'
        });

        var option = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridContextMenu(this).showAt(e.getXY());
                    return false;
                },
            },
            features: [groupingFeature]
            // features: [{ftype:'grouping'}],
            // features: [{
            //     ftype: 'summary',
            //     dock: 'top'
            // }]
        };

        //그리드 생성
        this.usePagingToolbar = false; // 페이지바 삭제
        this.createGrid(searchToolbar, buttonToolbar, option);

        this.store.group('buyer_pj_code');

        // this.grid.getStore().group();

        this.editAction.setText('상세보기');

        // 제작의뢰서  ==> 수주단위
        this.makeReqAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '제품제작의뢰서',
            tooltip: '제품제작의뢰서 출력',
            disabled: true,
            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var pcs_code = gm.me().vSELECTED_PCS_CODE;
                var ac_uid = gm.me().grid.getSelectionModel().getSelection()[0].get('ac_uid');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPrdReq',
                    params: {
                        pj_uid: ac_uid,
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

        // 작업지시서 ==> 0레벨
        this.workReqAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '작업지시서',
            tooltip: '작업지시서',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgast_uid = rec.get('unique_id_long');
                var po_no = rec.get('lot_no');
                var pcs_code = rec.get('po_type');
                var ac_uid = rec.get('ac_uid');
                
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printWo',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pcs_code: pcs_code,
                        ac_uid: ac_uid,
                        is_heavy: 'Y',	 //중공업:Y  기타:N
                        is_rotate: 'N', //가로양식:Y 세로양식:N
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
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });
            }
        });

        // 도면 다운
        this.pjFileAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '첨부',
            tooltip: '첨부파일 다운',
            disabled: true,
            handler: function () {
                gm.me().attachFile();
            }
        });

        //작업반려 Action 생성
        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '작업반려',
            tooltip: 'LOT 해체',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: 'LOT를 생산계획수립 단계로 이동하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
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

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '작업지시서 출력',
            disabled: true,

            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var pcs_code = gm.me().vSELECTED_PCS_CODE;
                var ac_uid = gm.me().vSELECTED_AC_UID;
                console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
                console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
                console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printWo',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pcs_code: pcs_code,
                        ac_uid: ac_uid,
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
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        //PDF 파일 출력기능
        this.printProduceExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: '생산계획표',
            tooltip: '생산계획표 출력',
            handler: function (widget, event) {

                var today = new Date();

                gm.me().produceExcel = Ext.create('Ext.form.Panel', {
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
                            title: '생산계획표의 기준 날짜을 선택하시기 바랍니다.',
                            items: [
                                {
                                    fieldLabel: '기준날짜',
                                    id: gu.id('sDate'),
                                    xtype: 'datefield',
                                    anchor: '95%',
                                    value: today,
                                    name: 'sDate',
                                    format: 'Y-m-d',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.getMC('CMD_Production_Order', '계획수립'),
                    width: 450,
                    height: 180,
                    items: gm.me().produceExcel,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                var form = gm.me().produceExcel.getForm();
                                var sDate = gu.getCmp('sDate').getValue();

                                var todayWeek = sDate.getDay();
                                sDate.setDate(sDate.getDate() - (sDate.getDay() - 1));

                                var sDateDay = sDate.getDay();

                                prWin.setLoading(true);
                                var eDate = new Date(sDate.valueOf());

                                eDate.setDate(eDate.getDate() + 5);

                                sDate = gm.me().formatDate(sDate);
                                eDate = gm.me().formatDate(eDate);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=printProduceExcel',
                                    params: {
                                        sDate: sDate,
                                        eDate: eDate
                                    },
                                    success: function (result, request) {
                                        var jsonData = Ext.JSON.decode(result.responseText);
                                        var excelPath = jsonData.excelPath;
                                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                        top.location.href = url;
                                        prWin.close();
                                    },//Ajax success
                                    failure: function (result, request) {
                                        Ext.Msg.alert('오류', '생산계획표를 출력 할 수 없습니다.');
                                        prWin.close();
                                    }
                                });
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
                var title = o['name']; // '[' + o['code'] + ']' + o['name'];
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
        // buttonToolbar.insert(1, this.printProduceExcelAction);
        // buttonToolbar.insert(1, this.printPDFAction);
        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.pjFileAction);
        buttonToolbar.insert(1, this.workReqAction);
        buttonToolbar.insert(1, this.makeReqAction);

        buttonToolbar.insert(1, this.denyWorkOrder);
        buttonToolbar.insert(1, this.addWorkOrder);
        // buttonToolbar.insert(1, this.modifyDepartment);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            gm.me().denyWorkOrder.disable();
            if (selections.length) {
                var rec = selections[0];

                var unique_uid = rec.get('unique_uid');  // 현재AssyUid
                var ac_uid = rec.get('ac_uid');  // 현재AssyUid
                var child = rec.get('srcahd_uid');  // 현재AssyUid
                gm.me().partBomStore.getProxy().setExtraParam('parent', child);
                gm.me().partBomStore.getProxy().setExtraParam('parent_uid', unique_uid);
                gm.me().partBomStore.getProxy().setExtraParam('orderBy', "pl_no");
                gm.me().partBomStore.getProxy().setExtraParam('ascDesc', "ASC");
                gm.me().partBomStore.getProxy().setExtraParam('ac_uid', ac_uid);

                gm.me().partBomStore.load();

                gm.me().big_pcs_code = rec.get('po_type');

                gm.me().vSELECTED_RTGAST_UID = rec.get('unique_id');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gm.me().vSELECTED_PO_NO = rec.get('pj_code');
                gm.me().printPDFAction.enable();
                gm.me().vSELECTED_PCS_CODE = rec.get('pcs_code');
                gm.me().vSELECTED_STATE = rec.get('state'); //product의 item_code

                if (gm.me().vSELECTED_STATE == 'P') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.enable();
                    gm.me().printPDFAction.disable();
                } else if (gm.me().vSELECTED_STATE == 'N') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.disable();
                    gm.me().printPDFAction.enable();
                    gm.me().finishWorkOrder.enable();
                } else {
                    gm.me().denyWorkOrder.disable();
                    gm.me().printPDFAction.enable();
                    gm.me().finishWorkOrder.enable();
                }

                this.makeReqAction.enable();
                var lv = rec.get('assy_level');
                if(lv == 0) {
                    this.workReqAction.enable();
                }

                this.pjFileAction.enable();

            } else {
                this.refreshButtons(false);
                gm.me().vSELECTED_UNIQUE_ID = -1

                this.makeReqAction.disable();
                this.workReqAction.disable();
                this.pjFileAction.disable();
            }

        });

        this.createCrudTab();

        this.grid.preserveScrollOnRefresh = true;
        
        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [this.grid, this.crudTab]
        // });

        Ext.apply(this, {
            layout: 'border',
			items: [
				{
					collapsible: false,
					frame: true,
					region: 'center',
                    height: '50%',
                    layout:'fit',
					items: [this.grid]
				}, 
				{
                    id:'woPartList',
					collapsible: false,
					frame: true,
					region: 'south',
					layout: 'fit',
					height: '50%',
					items: [this.createCenter()]  
				}
			]
        });

        this.callParent(arguments);

        //디폴트 로딩
        gMain.setCenterLoading(true);

        this.grid.getStore().getProxy().setExtraParam('po_type', '');
        this.store.getProxy().setExtraParam('state_name', 'P');
        this.storeLoad();
    },

    selectPcsRecord: null,

    items: [],

    potype: '',

    addTabworkOrderGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
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

        Ext.Ajax.request({
            // url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderHeavyHsg',
            url: CONTEXT_PATH + '/index/process.do?method=goBackOrderForMake',
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

    treatWorkStart: function (o) {
        //다수협력사지정
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
            sortInfo: {field: 'create_date', direction: 'DESC'},
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
            items: [/*{
             xtype: 'fieldLabel',
             value : ''
             },*/
                {
                    xtype: 'fieldset',
                    title: '작업지시내용',
                    defaultType: 'textfield',
                    /*boder : true,
                     defaults: {
                     width: 280
                     },*/
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
                                        if(gm.me().socket!=null) {
                                            gm.me().socket.emit('callPOP', {});
                                            gm.me().socket.emit('monitor', {});
                                        }
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
            var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: 'PCO'});

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
                sortInfo: {field: 'create_date', direction: 'DESC'},
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
            items: [/*{
             xtype: 'fieldLabel',
             value : ''
             },*/
                {
                    xtype: 'fieldset',
                    title: '협력사를 재설정합니다.',
                    defaultType: 'textfield',
                    /*boder : true,
                     defaults: {
                     width: 280
                     },*/
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

        var dataIndex = eventObject.position.column.dataIndex;

        switch(dataIndex) {
            case 'emergency':
            case 'reserved_varchar2':
                break;
            default:
                // gm.me().doOpenWorkOrder();
        }


    },
    doOpenWorkOrder: function() {
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
                switch(emergency) {
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

    createCenter: function() {

        // var requestMakeAction = this.getRequestMake();
        // var addAttachAction = this.getAttachAdd();

        // this.workPartListStore = Ext.create('Rfx2.store.company.dsmf.workPartListStore', {});
        this.partBomStore = Ext.create('Rfx2.store.company.dsmf.cloudProducePartLine', {});
        this.partListGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: true,
            store: this.partBomStore,
            // bbar: getPageToolbar(this.prdStore),
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            viewConfig: {
                // getRowClass : function(record, index) {
                //     var child_cnt = record.get('child_cnt');
                //     if(child_cnt < 1) {
                //         return 'red-row';
                //     }
                // }
            },
            dockedItems: [{
                
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                    //    '->',addAttachAction
                        // this.printFinalPDFAction
                    ],
                
            }],
            columns: [
                {
                    text: '구분',
                    dataIndex: 'standard_flag',
                    width: 30,
                    align:'center',
                    sortable: true,
                    renderer: function(value, meta) {
                        switch(value) {
                        case 'A':
                            meta.css = 'custom-column-assembly';
                            return '반제품';
                        case 'R':
                            return '자재';
                        case 'M':
                            return '상품';
                        default:
                            return value;
                        }
                    }
                },{
                    text: '진행상태',
                    dataIndex: 'status',
                    width: 60,
                    align:'center',
                    sortable: true,
                    renderer: function(value, meta, record) {
                        var route_type = record.get('route_type');
                        return gm.me().getAssyStatus(value, meta, route_type);
                    }
                },{
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 100,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 100,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '단위',
                    dataIndex: 'unit_code',
                    width: 60,
                    style: 'text-align:center',
                    align: 'left'
                }
                // ,{
                //     text: 'ASSY총량',
                //     dataIndex: 'quan',
                //     width: 40,
                //     style: 'text-align:center',
                //     align: 'right'
                // }
                ,{
                    text: 'BOM수량',
                    dataIndex: 'bm_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '필요수량',
                    dataIndex: 'quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '실생산수량',
                    dataIndex: 'make_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function(value, meta, record) {
                        var standard_flag = record.get('standard_flag');
                        if(standard_flag == 'A') {
                            var quan = record.get('quan');
                            var rc_quan = record.get('rc_quan');

                            return quan - rc_quan;
                        } else {
                            return 0;
                        }
                    }
                },{
                    text: '재고할당',
                    dataIndex: 'rc_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '구매요청',
                    dataIndex: 'pr_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function(value, meta, record) {
                        var gr_quan = record.get('cartmap_grQuan');
                        if(gr_quan > 0) {
                            return value - gr_quan;
                        } else {
                            return value;
                        }
                    }
                },{
                    text: '입고예정일',
                    dataIndex: 'req_delivery_date',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                    // renderer: function(value, meta) {

                    //     return value;
                    // }
                },{
                    text: '입고수량',
                    dataIndex: 'cartmap_grQuan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                }
            ],
            listeners: {
                celldblClick: function(view, th, col_idx, record, tr, row_idx) {
                    gm.me().viewMtrlDetailStatus(col_idx, row_idx);
                }
            }
        });

        this.partListGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length>0) {
                    console_logs('>>> selections', selections);
                } else {

                }
            }
        });
        
        return this.partListGrid;
    },

    viewMtrlDetailStatus: function(col_idx, row_idx) {
        var column = gm.me().partListGrid.getColumns()[col_idx];
        var dataIndex = column.dataIndex;
        var text = column.text;
        switch(dataIndex) {
            // case 'make_quan':
            // case 'quan':
            // case 'pr_quan':
            case 'rc_quan':
            break;
            default:
            return;
        }
        var title = text + ' 현황';
        var win = Ext.create('ModalWindow', {
            title: title,
            width: 800,
            height: 700,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype:'container',
            plain: true,
            items: [
                {
                    xtype: 'panel',
                    id: 'detailStatus',
                    autoScroll: true,
                    autoWidth: true,
                    flex: 3,
                    padding: '5',
                    items:gm.me().detailStatusView()
                }
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        }); win.show();
    },

    curStockStore: Ext.create('Mplm.store.CurStockStore'),

    detailStatusView: function() {
        var select = gm.me().partListGrid.getSelectionModel().getSelection()[0];
        var item_name = select.get('item_name');
        var item_code = select.get('item_code');
        var specification = select.get('specification');
        var totalQaun = 0;
        var useful_quan = 0;
        var srcahd_uid = select.get('unique_id_long');
        gm.me().curStockStore.getProxy().setExtraParam('uid_srcahd', srcahd_uid);
        gm.me().curStockStore.load({
            scope:this,
            callback: function(records) {
                // var a = gm.me().curStockStore.getProxy().getReader().rawData.totalQaun;
            }
        });

        this.detailStatusGrid = Ext.create('Ext.grid.Panel', {
            collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            id:'detailStatusGrid',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: true,
            store: gm.me().curStockStore,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            dockedItems: [{
                xtype:'toolbar',
                cls: 'my-x-toolbar-default2',
                items:[
                    {
                        xtype:'container',
                        plain:true,
                        layout:{ type:'vbox', align:'stretch' },
                        items:[
                            {
                                xtype:'component',
                                id:'allo_code',
                                html:'<b>품번: ' + item_code + '<b/>',
                                // style: 'width:100px'
                            },{
                                xtype:'component',
                                id:'allo_name',
                                html:'품명: ' + item_name,
                                // style: 'width:100px'
                            },{
                                xtype:'component',
                                id:'allo_specification',
                                html:'규격: ' + specification,
                                // style: 'width:100px'
                            },{
                                xtype:'component',
                                id:'allo_totalQaun',
                                html:'총 재고: ' + totalQaun + ' / 총 가용재고: ' + useful_quan,
                                // style: 'width:100px'
                            }
                        ]
                    }
                ]
            }],
            columns: [
                {
                    text:'상태',
                    dataIndex:'state',
                    width:70,
                    align:'center',
                    sortable:true,
                    renderer: function(value, meta) {
                        switch(value) {
                            case 'A':
                                return '불출대기';
                            case 'R':
                                return '불출접수';
                            default:
                                return value;
                        }                        
                    }
                },{
                    text:'제작번호',
                    dataIndex:'reserved2',
                    width:100,
                    align:'center',
                    sortable:true
                },{
                    text:'프로젝트명',
                    dataIndex:'pj_name',
                    width:100,
                    align:'center',
                    sortable:true
                },{
                    text:'할당수량',
                    dataIndex:'wh_qty',
                    width:60,
                    align:'center',
                    sortable:true
                },{
                    text:'요청일자',
                    dataIndex:'create_date',
                    width:80,
                    align:'center',
                    sortable:true
                },{
                    text:'요청자',
                    dataIndex:'request_user_name',
                    width:80,
                    align:'center',
                    sortable:true
                }
            ]
        });

        return this.detailStatusGrid;
    },

    attachFile: function() {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('ac_uid'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
		});
		

        var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype : 'button',
                        text : '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope : this.fileGrid,
                        handler : function() {

                            console_logs('=====aaa', record);
                            var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('ac_uid');
                            // var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('top_srcahd_uid');

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions : {
                                    url : url
                                },
                                synchronous : true
                            });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle : '파일 첨부',
                                    panel : uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {
                                	
                                	console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                	console_logs('this.mon uploadcomplete manager', manager);
                                	console_logs('this.mon uploadcomplete items', items);
                                	console_logs('this.mon uploadcomplete errorCount', errorCount);
                                	
                                	gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                        uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile, 
                        '-',
                        this.sendFileAction,
                        '->',
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : 'UID',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'id'
                },
            	{
                    text     : '파일명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    width     : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '날짜',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1100,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype:'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        });
	    win.show();
        
        
        // this.fileGrid.getSelectionModel().on({
	    // 	selectionchange: function(sm, selections) {

	    // 		if(selections!=null && selections.length>0) {
		//     		gm.me().removeActionFile.enable();
		//     		gm.me().sendFileAction.enable();
	    // 		} else {
	    // 			gm.me().removeActionFile.disable();
	    // 			gm.me().sendFileAction.disable();
	    // 		}

	    // 	}
        // });
    },
    
    attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

    uploadComplete : function(items) {
    	
    	console_logs('uploadComplete items', items);
    	
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function(item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        
        console_logs('파일업로드 결과', output);
        
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });
    },
});