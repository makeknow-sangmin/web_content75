Ext.define('Rfx2.view.company.hanjung.groupWare.IssueWorkingExpenseMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',

    poStore: Ext.create('Rfx2.store.company.hanjung.PoStore', {
        sorters: [{
            property: 'reserved_varcharh',
            direction: 'DESC'
        }]
    }),
    storeCubeDim: Ext.create('Rfx2.store.company.hanjung.WthOutWorkingExpStore', {}),
    storeViewProp: Ext.create('Rfx2.store.company.hanjung.WorkingBillIssueListStore', {}),
    fileContentStore: Ext.create('Rfx2.store.company.hanjung.FileContentStore', {}),
    fileContentRecords: null,
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var coord_key3;
        // var pj_uid;
        var unique_id;
        var reserved_timestamp1_str;
        var requestor;
        var total_price;
        var description;
        var reserved_varcharc;
        var reserved_varchard;
        var taxPrice;
        var supPrice;

        var out_wth_uid;
        var out_date;
        var out_requestor;
        var out_price;
        var out_description;

        // var sub_type;

        this.pdfAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '수주대장',
            tooltip: '수주대장을 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                //var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = gm.me().selectedRecord; //selections[0];
                console_logs('===============> rec', rec)
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var rtgast_uid = 'ORDER_' + rec.get('reserved_varcharh');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printOb',
                    params: {
                        rtgast_uid: rtgast_uid,
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        sum_wthdraw_flag: 'Y',
                        detail_flag: 'Y',
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        var pdfPathSplit = pdfPath.split('/');
                        var fileName = pdfPathSplit[pdfPathSplit.length - 1];

                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=makePdfImage',
                                params: {
                                    fileName: pdfPath,
                                    extension: 'png'
                                },
                                reader: {
                                    pdfPath: 'pdfPath'
                                },
                                success: function (result, request) {
                                    console_logs("result.responseText: ", result.responseText);
                                    try {
                                        var jsonData = Ext.JSON.decode(result.responseText);
                                        var pdfPath = jsonData.pdfPath;
                                        console_log(pdfPath);
                                        if (pdfPath.length > 0) {
                                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                            top.location.href = url;
                                        } 
                                    } catch(e) {
                                        console_logs("result.responseText \decod error: ", result.responseText);
                                    }

                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    failure: extjsUtil.failureMessage
                });
            }
        });
        var addWdOutHistory = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '작업비내역 작성',
            tooltip: '작업비내역 작성',
            disabled: true,
            handler: function () {
                var selection = poStatusTemplate.getSelectionModel().getSelection();
                var rec = selection[0];
                var pj_uid = rec.get('ac_uid');
                gm.me().addWthOutWindow(pj_uid);
            }
        });

        
        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = gu.getCmp('s_date_arv').getValue();
                    var e_date = gu.getCmp('e_date_arv').getValue();
                    var reserved_varcharh = '';
                    var project_varchar2 = '';
                    var project_varchar3 = '';

                    if(Ext.getCmp('reserved_varcharh').getValue().length > 0){
                        reserved_varcharh = Ext.getCmp('reserved_varcharh').getValue();
                    }

                    if(Ext.getCmp('project_varchar2').getValue().length > 0){
                        project_varchar2 = Ext.getCmp('project_varchar2').getValue();
                    }

                    if(Ext.getCmp('project_varchar3').getValue().length > 0){
                        project_varchar3 = Ext.getCmp('project_varchar3').getValue();
                    }
                } catch (e) { 

                }
                gm.me().poStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
                gm.me().poStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
                gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%'+reserved_varcharh+'%');
                gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%'+project_varchar2+'%');
                gm.me().poStore.getProxy().setExtraParam('project_varchar3', '%'+project_varchar3+'%');
                gm.me().poStore.load();
            }
        });
        var editWdOutHistory = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '내역 수정',
            tooltip: '내역 수정',
            disabled: true,
            handler: function () {

                
                console_logs('>>>> pj_uid >>>', pj_uid);
                console_logs('out_wth_uid >>>', out_wth_uid);
                console_logs('out_date >>> ', out_date);
                console_logs('out_requestor >>> ', out_requestor);
                console_logs('out_description >>>', out_description);
                console_logs('out_price >>>', out_price);
                console_logs('sub_type >>>', sub_type);
                gm.me().editWthOutWindow(out_wth_uid, out_date, out_requestor, out_description, out_price, pj_uid, sub_type);
            }
        });

        var deleteWdOutAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '작업비내역 삭제',
            tooltip: '작업비내역 삭제',
            disabled: true,
            handler: function () {
                console_logs('out_wth_uid >>>', out_wth_uid);
                Ext.MessageBox.show({
                    title: '내역 삭제',
                    msg: '선택한 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=deleteHistory',
                                params: {
                                    unique_id: out_wth_uid
                                },
                                success: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 내역이 삭제 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });

        var deleteWdInAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '내역 삭제',
            tooltip: '내역 삭제',
            disabled: true,
            handler: function () {
                console_logs('in_wth_uid >>>', out_wth_uid);
                Ext.MessageBox.show({
                    title: '내역 삭제',
                    msg: '선택한 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=deleteHistory',
                                params: {
                                    unique_id: out_wth_uid
                                },
                                success: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 내역이 삭제 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });

        var addIssueBillHistory = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '내역작성',
            tooltip: '계산서내역 작성',
            disabled: true,
            handler: function () {
                var selection = poStatusTemplate.getSelectionModel().getSelection();
                var rec = selection[0];
                var pj_uid = rec.get('ac_uid');
                if(pj_uid  < 0) {
                    Ext.MessageBox.alert('알림', '수주내역에서 데이터를 재선택 하십시오');
                    return;
                }  else {
                    gm.me().addBillList(pj_uid);
                }
            }
        });

        var editBillOutHistory = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '내역수정',
            tooltip: '계산서내역 수정',
            disabled: true,
            handler: function () {
                var selection = poStatusTemplate.getSelectionModel().getSelection();
                var rec = selection[0];
                var pj_uid = rec.get('ac_uid');
                console_logs('>>>> reserved_varchar1 >>>', requestor);
                console_logs('reserved_varchar2 >>>', description);
                console_logs('reserved_timestamp1_str', reserved_timestamp1_str);
                console_logs('total_price', total_price);
                console_logs('unique_id >>> ', unique_id);
                console_logs('pj_uid >>> ', pj_uid);
                gm.me().editBillHistoryWindow(requestor, description, reserved_timestamp1_str, total_price, supPrice, taxPrice, unique_id, pj_uid);
            }
        });

        var deleteWdOutAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '내역삭제',
            tooltip: '계산서내역 삭제',
            disabled: true,
            handler: function () {
                console_logs('unique_id >>>', unique_id);
                Ext.MessageBox.show({
                    title: '내역 삭제',
                    msg: '선택한 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=deleteBillList',
                                params: {
                                    unique_id: unique_id
                                },
                                success: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 내역이 삭제 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });


        var attachCertification = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '사업자등록증 첨부',
            tooltip: '사업자등록증 첨부',
            disabled: true,
            handler: function () {
                console_logs('pj_uid>>>', pj_uid);
                var type = 'CERTI'
                if (reserved_varcharc == 'Y') {
                    Ext.MessageBox.show({
                        title: '사업자등록증 첨부',
                        msg: '기존 첨부된 파일이 존재합니다. 파일 첨부를 진행하시겠습니까?<br>기존 첨부된 파일은 삭제 처리 후 업로드 진행됩니다.',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                gm.me().attachedCertificate(pj_uid, type);
                            } else {
                                prWin.close();
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    })
                } else {
                    gm.me().attachedCertificate(pj_uid, type);
                }
            }
        });


        var attachIdCard = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '신분증 첨부',
            tooltip: '신분증 첨부',
            disabled: true,
            handler: function () {
                console_logs('pj_uid>>>', pj_uid);
                var type = 'ID'
                if (reserved_varchard == 'Y') {
                    Ext.MessageBox.show({
                        title: '신분증 첨부',
                        msg: '기존 첨부된 파일이 존재합니다. 파일 첨부를 진행하시겠습니까?<br>기존 첨부된 파일은 삭제 처리 후 업로드 진행됩니다.',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                gm.me().attachedIdCard(pj_uid, type);
                            } else {
                                prWin.close();
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    })
                } else {
                    gm.me().attachedIdCard(pj_uid, type);
                }
            }
        });

        var downloadCertification = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-pdf',
            text: '사업자등록증 다운로드',
            tooltip: '사업자등록증 다운로드',
            disabled: true,
            handler: function () {
                console_logs('pj_uid>>>', pj_uid);
                var type = 'CERTI'
                Ext.MessageBox.show({
                    title: gm.getMC('CMD_FILE_DOWNLOAD','파일 다운로드'),
                    msg: '선택 데이터의 사업자등록증을 다운로드 받으시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/filedown.do?method=fileprojectHj',
                                params: {
                                    pj_uid: pj_uid,
                                    type: type
                                },
                                reader: {
                                    pdfPath: 'pdfPath'
                                },
                                success: function (result, request) {
                                    console_logs('result', result);
                                    var jsonData = Ext.JSON.decode(result.responseText);
                                    var filePath = jsonData.datas;
                                    console_log(filePath);
                                    if (filePath.length > 0) {
                                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + filePath;
                                        top.location.href = url;
                                    }
                                },
                                failure: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 정보의 파일을 찾지 못했습니다. 파일을 첨부하여 주십시오.')
                                }
                            });
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });


        var downloadIdCard = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-pdf',
            text: '신분증 다운로드',
            tooltip: '신분증 다운로드',
            disabled: true,
            handler: function () {
                console_logs('pj_uid>>>', pj_uid);
                var type = 'ID'
                Ext.MessageBox.show({
                    title: gm.getMC('CMD_FILE_DOWNLOAD','파일 다운로드'),
                    msg: '선택 데이터의 신분증을 다운로드 받으시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/filedown.do?method=fileprojectHj',
                                params: {
                                    pj_uid: pj_uid,
                                    type: type
                                },
                                reader: {
                                    pdfPath: 'pdfPath'
                                },
                                success: function (result, request) {
                                    console_logs('result', result);
                                    var jsonData = Ext.JSON.decode(result.responseText);
                                    var filePath = jsonData.datas;
                                    console_log(filePath);
                                    if (filePath.length > 0) {
                                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + filePath;
                                        top.location.href = url;
                                    } else {
                                        Ext.MessageBox.alert('알림', '파일 다운로드 실패.')
                                    }
                                },
                                failure: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 정보의 파일을 찾지 못했습니다. 파일을 첨부하여 주십시오.')
                                }
                            });
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });

        var poStatusTemplate = Ext.create('Ext.grid.Panel', {
            store: this.poStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", { mode: 'SINGLE'}),
            bbar: getPageToolbar(this.poStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '수주번호',
                width: 70,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'reserved_varcharh'
            }, {
                text: '고객명/지입사',
                width: 80,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'project_varchar2_Only_WithDrawVariable'
            }, {
                text: '차명',
                width: 70,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'reserved_varchar3'
            }, {
                text: '영업사원',
                width: 70,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'pmWithCount'
            }, {
                text: '실견적가(VAT)',
                width: 70,
                sortable: true,
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                style: 'text-align:center',
                dataIndex: 'estiPrice'
            }, {
                text: '작업비',
                width: 70,
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                style: 'text-align:center',
                dataIndex: 'work_exp'
            }
            ]
        });
        this.poStore.getProxy().setExtraParam('detail_flag', 'Y');
        this.poStore.getProxy().setExtraParam('not_pj_type', 'NP');
        this.poStore.load();
        // this.crudMode = 'CREATE';

        var downloadFiles = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: gm.getMC('CMD_FILE_DOWNLOAD','파일 다운로드'),
            tooltip: '파일 다운로드',
            disabled: true,
            handler: function (widget, event) {
                if (gm.me().fileContentRecords.length > 0) {
                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().fileContentRecords,
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        width: '99%',
                        height: '80%',
                        flex: 1,
                        layout: 'fit',
                        forceFit: false,
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'rfx-panel',
                                items: [
                                    {
                                        xtype: 'label',
                                        width: 500,
                                        height: 20,
                                        text: '먼저 다운로드 할 파일명을 선택 후 다운로드버튼을 클릭하세요.',
                                        style: 'color:black;'
                                    },
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: '파일명',
                                width: 500,
                                dataIndex: 'object_name',
                            }
                        ]
                    });

                    var file_path = '';
                    var unique_id = '';
                    this.gridViewTable.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            console_logs('>>>>>> records', selections[0]);
                            var rec = selections[0]
                            file_path = rec.get('file_path');
                            unique_id = rec.get('unique_id');
                            console_logs('file_path', file_path);
                        }
                    });

                    gm.me().fileDownloadForm = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        height: 400,
                        bodyPadding: 10,
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
                            this.gridViewTable,
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: gm.getMC('CMD_FILE_DOWNLOAD','파일 다운로드'),
                        width: 500,
                        height: 400,
                        minWidth: 500,
                        minHeight: 400,
                        items: [gm.me().fileDownloadForm],
                        buttons: [{
                            text: '다운로드',
                            handler: function () {
                                gMain.setCenterLoading(true);
                                if (file_path.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + file_path;
                                    top.location.href = url;
                                    gMain.setCenterLoading(false);
                                } else {
                                    gMain.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '다운로드 할 파일이 선택되지 않았습니다.');
                                }
                            }
                        }, {
                            text: '파일삭제',
                            handler: function () {
                                if (unique_id.length > 0) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().fileContentStore.getProxy().setExtraParam('file_code', rtgast_uid + '_SAL_WTH');
                                            gm.me().fileContentStore.load(function (record) {
                                                objs = [];
                                                gm.me().fileContentRecords = record;
                                                var obj = {};
                                                console_logs(gm.me().fileContentRecords);
                                                var rec = gm.me().fileContentRecords;
                                                var columns = [];
                                                for (var i = 0; i < rec.length; i++) {
                                                    var sel = rec[i];
                                                    var objv = {};
                                                    console_logs('>>> sel', sel);
                                                    var file_path = sel.get('file_path');
                                                    var object_name = sel.get('object_name');
                                                    var file_ext = sel.get('file_ext');
                                                    objv['file_path'] = file_path;
                                                    objv['object_name'] = object_name;
                                                    objv['file_ext'] = file_ext;
                                                    columns.push(objv);
                                                }
                                                obj['datas'] = columns;
                                                objs.push(obj);
                                                console_logs('>>>> objs >>>>> ', objs);
                                            })
                                            if(winPart){
                                                winPart.close();
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
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
                    winPart.show(/* this, function(){} */);
                } else {
                    Ext.MessageBox.alert('알림', '해당 데이터의 파일데이터가 존재하지 않습니다.<br>파일 업로드를 진행 후 다운로드 하세요.')
                }
            }
        });

        poStatusTemplate.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections.length > 0) {
                    gm.me().selectedRecord = selections[0];
                    gm.me().pdfAction.enable();
                    gm.me().storeCubeDim.getProxy().setExtraParam('pj_uid', selections[0].get('ac_uid'));
                    gm.me().storeCubeDim.load();
                    gm.me().storeViewProp.getProxy().setExtraParam('pj_uid', selections[0].get('ac_uid'));
                    gm.me().storeViewProp.load();
                    addIssueBillHistory.enable();
                    // pj_uid = selections[0].get('ac_uid');
                    reserved_varcharc = selections[0].get('reserved_varcharc');
                    reserved_varchard = selections[0].get('reserved_varchard');
                    //attachCertification.enable();
                    //downloadCertification.enable();
                    //attachIdCard.enable();
                    //downloadIdCard.enable();
                    addWdOutHistory.enable();
                } else {
                    gm.me().pdfAction.disable();
                }

            }
        });



        var temp = {
            title: '수주내역',
            collapsible: true,
            frame: true,
            region: 'north',
            layout : 'fit',
            margin: '0 0 0 0',
            flex: 1,
            items: [poStatusTemplate],
            dockedItems: [
                {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						this.purListSrch,
                        this.pdfAction
					]
				},
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [{
                        xtype: 'label',
                        width: 40,
                        text: '기간',
                        style: 'color:white;'

                    }, {
                        id: gu.id('s_date_arv'),
                        name: 's_date',
                        format: 'Y-m-d',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                        xtype: 'datefield',
                        value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
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
                    }, {
                        xtype:'triggerfield',
                        emptyText: '수주번호',
                        id: gu.id('reserved_varcharh'),
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners : {
                            specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%'+gu.getCmp('reserved_varcharh').getValue()+'%');
                                    gm.me().poStore.load(function() {});
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp('reserved_varcharh').setValue('');
                            this.poStore.getProxy().setExtraParam('reserved_varcharh', gu.getCmp('reserved_varcharh').getValue());
                            this.poStore.load(function() {});
                        }
                    },{
                        xtype:'triggerfield',
                        emptyText: '고객명',
                        id: gu.id('project_varchar2'),
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners : {
                            specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%'+gu.getCmp('project_varchar2').getValue()+'%');
                                    gm.me().poStore.load(function() {});
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp('project_varchar2').setValue('');
                            this.poStore.getProxy().setExtraParam('project_varchar2', gu.getCmp('project_varchar2').getValue());
                            this.poStore.load(function() {});
                        }
                    },{
                        xtype:'triggerfield',
                        emptyText: '차명',
                        id: gu.id('project_varchar3'),
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners : {
                            specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().poStore.getProxy().setExtraParam('project_varchar3', '%'+gu.getCmp('project_varchar3').getValue()+'%');
                                    gm.me().poStore.load(function() {});
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp('project_varchar3').setValue('');
                            this.poStore.getProxy().setExtraParam('project_varchar3', gu.getCmp('project_varchar3').getValue());
                            this.poStore.load(function() {});
                        }
                    }]
                }
            ]
        };

        var gridDimension = Ext.create('Ext.grid.Panel', {
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            collapsible: true,
            multiSelect: false,
            autoScroll: true,
            title: '작업비관리',
            autoHeight: true,
            frame: true,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [{
                text: '요청일',
                xtype: 'datecolumn',
                format: 'Y-m-d',
                align: 'left',
                width: 20,
                style: 'text-align:center',
                dataIndex: 'request_date'
            }, {
                text: '구분',
                width: 20,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'sub_type_kr'
            }, {
                text: '출금액',
                width: 20,
                align: 'right',
                xtype: "numbercolumn",
                format: "0,000",
                style: 'text-align:center',
                dataIndex: 'price'
            }, {
                text: '계좌번호',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'acc_no'
            },{
                text: '예금주',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'requestor'
            }, {
                text: '비고',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'description'
            }],
            dockedItems: [
            {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [addWdOutHistory, editWdOutHistory, deleteWdInAction,/*checkedIssueBillIn*/]
            }
        ]
        });

        gridDimension.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    pj_uid = selections[0].get('ac_uid');
                    out_wth_uid = selections[0].get('unique_id');
                    out_date = selections[0].get('requestDateStr');
                    out_requestor = selections[0].get('requestor');
                    out_price = selections[0].get('price');
                    out_description = selections[0].get('description');
                    sub_type = selections[0].get('sub_type_kr');
                    editWdOutHistory.enable();
                    deleteWdInAction.enable();
                }
            }
        });

        var gridViewprop = Ext.create('Ext.grid.Panel', {
            title: '계산서관리',
            cls: 'rfx-panel',
            collapsible: true,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            store: this.storeViewProp,

            reigon: 'south',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [{
                text: '발행일',
                xtype: 'datecolumn',
                format: 'Y-m-d',
                align: 'left',
                width: 5,
                style: 'text-align:center',
                dataIndex: 'reserved_timestamp1'
            }, {
                text: '담당자',
                width: 8,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'reserved_varchar1'
            }, {
                text: '품목',
                width: 20,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'reserved_varchar2'
            }, {
                text: '발행금액',
                width: 5,
                align: 'right',
                xtype: "numbercolumn",
                format: "0,000",
                style: 'text-align:center',
                dataIndex: 'total_price'
            }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [addIssueBillHistory, editBillOutHistory, deleteWdOutAction, downloadFiles]
                }
            ]
        });


        gridViewprop.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    coord_key3 = selections[0].get('coordkey_3');
                    bill_date = selections[0].get('reserved_timestamp1_str');
                    requestor = selections[0].get('reserved_varchar1');
                    description = selections[0].get('reserved_varchar2');
                    total_price = selections[0].get('total_price');
                    reserved_timestamp1_str = selections[0].get('reserved_timestamp1_str');
                    supPrice = selections[0].get('reserved_double1');
                    taxPrice = selections[0].get('reserved_double2');
                    unique_id = selections[0].get('unique_id');
                    editBillOutHistory.enable();
                    deleteWdOutAction.enable();
                    var reserved_varchar2 = selections[0].get('reserved_varchar2');
                    gm.me().fileContentStore.getProxy().setExtraParam('file_code', unique_id + '_SAL_WTH');
                    gm.me().fileContentStore.load(function (record) {
                        objs = [];
                        gm.me().fileContentRecords = record;
                        var obj = {};
                        console_logs(gm.me().fileContentRecords);
                        var rec = gm.me().fileContentRecords;
                        var columns = [];
                        for (var i = 0; i < rec.length; i++) {
                            var sel = rec[i];
                            var objv = {};
                            console_logs('>>> sel', sel);
                            var file_path = sel.get('file_path');
                            var object_name = sel.get('object_name');
                            var file_ext = sel.get('file_ext');
                            objv['file_path'] = file_path;
                            objv['object_name'] = object_name;
                            objv['file_ext'] = file_ext;
                            columns.push(objv);
                        }
                    obj['datas'] = columns;
                    objs.push(obj);
                    console_logs('>>>> objs >>>>> ', objs);
                })
                downloadFiles.enable();
                    // checkedIssueBillOut.enable();
                }
            }
        });

        var temp2 = {
            //title: '출금관리',
            collapsible: false,
            frame: false,
            region: 'center',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridDimension, gridViewprop]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [temp, temp2, arr]
        });
        this.callParent(arguments);
    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300
    },
    items: null,

    addWthInWindow: function (pj_uid) {

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
                    title: '입금내역',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            editable : false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunWeTypeStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                        },
                        {
                            fieldLabel: '입금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: new Date()
                        }, {
                            fieldLabel: '담당자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: vCUR_USER_NAME
                        }, {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price'
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description'
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입금내역 작성',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=insertWdHistory&type=I',
                                waitMsg: '입금내역을 저장중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    pj_uid: pj_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
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

    addBillList: function (pj_uid) {
        var vform = Ext.create('Ext.form.Panel', {
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
                    title: '내역작성',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '발행일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            allowBlank : false,
                            format : 'Y-m-d',
                            value: new Date()
                        }, {
                            fieldLabel: '상호',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            allowBlank : true,
                            name: 'requestor',
                        }, {
                            fieldLabel: '품목',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            allowBlank : false,
                            name: 'description'
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'left'
                            },
                            items: [
                                {
                                    fieldLabel: '공급가액',
                                    xtype: 'numberfield',
                                    margin: '0 3 0 0',
                                    width: 600,
                                    name: 'supplier_price',
                                    allowBlank : true,
                                    id: gu.id('supplier_price_field')
                                },
                                {
                                    xtype: 'button',
                                    width: 160,
                                    text: '세액/합계금액 계산',
                                    listeners: {
                                        click: function () {
                                            var target1 = gu.getCmp('tax_price_field');
                                            var target2 = gu.getCmp('total_price_field');
                                            var sup = gu.getCmp('supplier_price_field').getValue();
                                            var tax = sup * 0.1;
                                            var total = sup + tax;
                                            target1.setValue(tax);
                                            target2.setValue(total);
                                        }
                                    }
                                }
                            ]

                        }, {
                            fieldLabel: '세액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'tax_price',
                            allowBlank : true,
                            id: gu.id('tax_price_field')
                        },{
                            fieldLabel: '합계금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            allowBlank : true,
                            id: gu.id('total_price_field'),
                            listeners: {
                                specialkey: function (f, e) {
                                    if (e.getKey() == e.ENTER) {
                                        var target1 = gu.getCmp('supplier_price_field');
                                        var ratio = 11/10;
                                        var includeTaxPrice = gu.getCmp('total_price_field').getValue();
                                        var exceptTaxPrice =  includeTaxPrice / ratio;
                                        target1.setValue(exceptTaxPrice);

                                        var target2 = gu.getCmp('tax_price_field');
                                        var taxPrice = includeTaxPrice - exceptTaxPrice ;
                                        target2.setValue(taxPrice);
                                    }
                                }
                            }
                        }, {
                            xtype: 'label',
                            width: 500,
                            height: 20,
                            text: '☞ 합계금액(부가세 포함) 금액을 입력 후 Enter를 누르면 공급가, 세액을 자동계산합니다.',
                            style: 'color:blue; align:right'
                        }
                    ]
                }
            ]


        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '계산서 내역 작성',
            width: 800,
            height: 300,
            plain: true,
            items: vform,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (vform.isValid()) {
                            var val = vform.getValues(false);
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var sup_price = val['supplier_price'];
                            var tax_price = val['tax_price'];
                            var description = val['description'];
                            vform.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=insertWorkingExpBillList',
                                waitMsg: '내역을 저장중입니다.',
                                params: {
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    sup_price: sup_price,
                                    tax_price: tax_price,
                                    pj_uid: pj_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            },{
                text: '파일첨부',
                handler: function () {
                    if (vform.isValid()) {
                        var val = vform.getValues(false);
                        var description = val['description'];
                        var type = 'SAL_WTH'
                        gm.me().attachedFile(pj_uid, type, description);
                    } else {
                        Ext.MessageBox.alert('알림','필수 입력 정보를 입력 후 파일 첨부를 해주세요.')
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    attachedFile : function (pj_uid, type, description) {
        var form = Ext.create('Ext.ux.upload.Panel', {
            uploader: 'Ext.ux.upload.uploader.FormDataUploader',
            // id: gu.id('formPanel'),
            synchronous: true,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            uploaderOptions: {
                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj&pj_code='+type+'_'+description+'&pj_uid='+pj_uid,
            },
        });
        var subWin = Ext.create('Ext.Window', {
            modal: true,
            title: '파일 첨부',
            width: 800,
            height: 600,
            plain: true,
            items: form,
            buttons: [{
                text: '닫기',
                handler: function (btn) {
                    if (btn == 'no') {
                        subWin.close();
                    } else {
                        subWin.close();
                    }
                }
            }]
        });
        subWin.show();
    },

    editWthInWindow: function (in_wth_uid, in_date, in_requestor, in_description, in_price, sub_type) {
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
                    title: '입금내역',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            editable : false,
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunInTypeStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                            value: sub_type
                        },
                        {
                            fieldLabel: '입금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: in_date
                        }, {
                            fieldLabel: '입/출금자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: in_requestor
                        }, {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            value: in_price
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description',
                            value: in_description
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입금내역 수정',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=editWdHistory&type=O',
                                waitMsg: '입금내역을 수정중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    unique_id: in_wth_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
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
    editBillHistoryWindow: function (requestor, description, reserved_timestamp1_str, total_price, supPrice, taxPrice, unique_id, pj_uid) {
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
                    title: '내역수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '발행일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: reserved_timestamp1_str
                        }, {
                            fieldLabel: '상호',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: requestor
                        }, {
                            fieldLabel: '품목',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description',
                            value: description
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'left'
                            },
                            items: [
                                {
                                    fieldLabel: '공급가액',
                                    xtype: 'numberfield',
                                    margin: '0 3 0 0',
                                    width: 600,
                                    name: 'supplier_price',
                                    id: gu.id('supplier_price_field_edit'),
                                    value: supPrice
                                },
                                {
                                    xtype: 'button',
                                    width: 160,
                                    text: '세액/합계금액 계산',
                                    listeners: {
                                        click: function () {
                                            var target1 = gu.getCmp('tax_price_field_edit');
                                            var target2 = gu.getCmp('total_price_field_edit');
                                            var sup = gu.getCmp('supplier_price_field_edit').getValue();
                                            var tax = sup * 0.1;
                                            var total = sup + tax;
                                            target1.setValue(tax);
                                            target2.setValue(total);
                                        }
                                    }
                                }
                            ]

                        }, {
                            fieldLabel: '세액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'tax_price',
                            id: gu.id('tax_price_field_edit'),
                            value: taxPrice
                        }, {
                            fieldLabel: '합계금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            value: total_price,
                            id: gu.id('total_price_field_edit')
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '계산서내역 수정',
            width: 800,
            height: 300,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            var taxPrice = val['tax_price'];
                            var supplier_price = val['supplier_price'];
                            form.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=modifyBillList',
                                waitMsg: '수정중입니다.',
                                params: {
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    pj_uid: pj_uid,
                                    unique_id: unique_id,
                                    tax_price: taxPrice,
                                    sup_price: supplier_price,
                                    coord_key3: pj_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
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

    addBillDate: function (wth_uid, pj_uid) {
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
                    title: '계산서 발행일을 입력하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '발행일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'bill_reg_date',
                            value: new Date()
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '계산서발행일 등록',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var bill_reg_date = val['bill_reg_date'];

                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=addBillDate',
                                waitMsg: '계산서 발행일을 등록중입니다.',
                                params: {
                                    bill_reg_date: bill_reg_date,
                                    pj_uid: pj_uid,
                                    unique_id: wth_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '등록되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
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

    addWthOutWindow: function (pj_uid) {
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
                    title: '출금내역',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            editable : false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunWeTypeStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                        },
                        {
                            fieldLabel: '출금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            format : 'Y-m-d',
                            width: '99%',
                            name: 'request_date',
                            value: new Date()
                        },{
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price'
                        },{
                            fieldLabel: '계좌번호',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'account_no'
                        },{
                            fieldLabel: '예금주',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor'
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description'
                        },{
                            xtype: 'checkbox',
                            anchor: '100%',
                            width: '99%',
                            id: gu.id('incomeReportYn'),
                            field_id: 'incomeReportYn',
                            boxLabel: '소득신고여부',
                            checked: true
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '작업비내역 작성',
            width: 500,
            height: 300,
            plain: true,
            items: form,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            var reportYn = 'N'
                            if(gu.getCmp('incomeReportYn').checked) {
                                reportYn = 'Y';
                            }
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=insertWdHistory&type=W',
                                waitMsg: '작업비내역을 저장중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    pj_uid: pj_uid,
                                    reportYn : reportYn
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
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

    editWthOutWindow: function (out_wth_uid, out_date, out_requestor, out_description, out_price, sub_type) {
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
                    title: '출금내역 수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            editable : false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunWeTypeStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                            value: sub_type
                        },
                        {
                            fieldLabel: '출금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            format : 'Y-m-d',
                            name: 'request_date',
                            value: out_date
                        }, {
                            fieldLabel: '출금자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: out_requestor
                        }, {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            value: out_price
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description',
                            value: out_description
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '출금내역 수정',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=editWdHistory&type=O',
                                waitMsg: '출금내역을 수정중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    unique_id: out_wth_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
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
                text: '취소',
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

    attachedCertificate: function (pj_uid, type) {
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
                    title: '첨부할 사업자 등록증 파일을 첨부하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '파일첨부',
                            xtype: 'filefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'fileupload',
                            buttonText: '찾아보기',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사업자등록증 첨부',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj',
                                waitMsg: '파일 첨부중 입니다.',
                                params: {
                                    pj_uid: pj_uid,
                                    pj_code: type
                                },
                                success: function (val, action) {
                                    var loadPage = new Ext.LoadMask({
                                        msg: 'Loading',
                                        visible: true,
                                        target: prWin
                                    });
                                    loadPage.show();
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=updateUploadCertiStatus',
                                        params: {
                                            type: 'CERTI',
                                            pj_uid: pj_uid,
                                        },
                                        success: function (result, request) {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                            Ext.MessageBox.alert('확인', '첨부 되었습니다.');
                                        }
                                    });
                                    gm.me().poStore.load(function () {
                                    });
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
                text: '취소',
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

    attachedIdCard: function (pj_uid, type) {
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
                    title: '첨부할 신분증 파일을 첨부하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '파일첨부',
                            xtype: 'filefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'fileupload',
                            buttonText: '찾아보기',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신분증 첨부',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj',
                                waitMsg: '파일 첨부중 입니다.',
                                params: {
                                    pj_uid: pj_uid,
                                    pj_code: type
                                },
                                success: function (val, action) {
                                    var loadPage = new Ext.LoadMask({
                                        msg: 'Loading',
                                        visible: true,
                                        target: prWin
                                    });
                                    loadPage.show();
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=updateUploadCertiStatus',
                                        params: {
                                            type: 'ID',
                                            pj_uid: pj_uid,
                                        },
                                        success: function (result, request) {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                            Ext.MessageBox.alert('확인', '첨부 되었습니다.');
                                        }
                                    });
                                    gm.me().poStore.load(function () {
                                    });
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
                text: '취소',
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