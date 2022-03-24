//수주관리 메뉴
Ext.define('Rfx2.view.company.hsct.salesDelivery.RecvMgmtKbTechVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-ver-view',
    inputBuyer: null,
    wthContentStore: Ext.create('Rfx2.store.company.hanjung.WthDrawEtcStore', {}),
    wthContentRecords: null,
    onSortChange: function (container, column, direction, eOpts) {
        console_logs('column', column);
        console_logs('direction', direction);
    },
    initComponent: function () {
        console_logs('<<-----------------------------------', 1);
        this.on('sortchange', this.onSortChange, this);
        console_logs('<<-----------------------------------', 1);

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_day', '오더일'),
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        this.addSearchField('item_name');
        this.addSearchField('order_number');
        this.addSearchField('wa_name');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.rollbackPoOnlyPrdAceeptAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            disabled: true,
            text: gm.getMC('CMD_CONFIRM_CANCELLATION', '확정취소'),
            tooltip: '수주확정 후 계획 전 단계의 수주건을 취소합니다.',
            hidden: gu.setCustomBtnHiddenProp('rollbackPoOnlyPrdAceeptAction'),
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                for (var i = 0; i < record.length; i++) {
                    var rec = record[i];
                    var status = rec.get('status_bio');
                    if (status === 'CR') {
                        gm.me().rejectConfirm(record);
                    } else if (status === 'CA') {
                        Ext.MessageBox.alert('알림', '취소된 수주는 확정취소 할 수 없습니다.')
                    } else {
                        Ext.MessageBox.alert('알림', '수주확정 이후 수주건은 취소할 수 없습니다.')
                    }
                }
            }
        });

        this.changePo = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            disabled: true,
            text: this.getMC('CMD_ORDER_REVISION', '수주변경'),
            tooltip: '선택한 수주에 대하여 수주변경을 실시합니다.',
            hidden: gu.setCustomBtnHiddenProp('changePo'),
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                var rec = record[0];

                var siteStore = Ext.create('Ext.data.Store', {
                    fields: ['year', 'view'],
                    data: [
                        {"site": "HSA", "view": "화승켐택"},
                        {"site": "HSB", "view": "화승화학"},
                    ]
                });

                if (rec.get('status_bio') === 'DC' /**|| rec.get('status_bio') === 'DS'**/) {
                    Ext.MessageBox.alert('알림', '출하 완료상태에서는 수주변경이 불가합니다.')
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        id: 'editPoForm',
                        xtype: 'form',
                        frame: false,
                        border: false,
                        width: '100%',
                        layout: 'column',
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'fieldset',
                                collapsible: false,
                                title: gm.me().getMC('msg_order_dia_header_title', '변경정보를 입력하십시오.'),
                                width: '100%',
                                style: 'padding:10px',
                                defaults: {
                                    labelStyle: 'padding:10px',
                                    anchor: '100%',
                                    layout: {
                                        type: 'column',
                                        align: 'middle'
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        width: '100%',
                                        border: true,
                                        defaultMargins: {
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 10
                                        },
                                        items: [
                                            {
                                                xtype: 'label',
                                                width: 400,
                                                height: 60,
                                                html: '<p style="text-align:left;">&nbsp&nbsp&nbsp&nbsp&nbsp수주번호 : ' + rec.get('order_number') + '<br>&nbsp&nbsp&nbsp&nbsp&nbsp고객사 : ' + rec.get('wa_name') + '<br>&nbsp&nbsp&nbsp&nbsp&nbsp제품명 / 기준모델 : ' + rec.get('item_name') + ' / ' + rec.get('description_src') + '</p>',
                                                style: 'color:black;'
                                            },
                                            {
                                                xtype: 'datefield',
                                                id: 'gr_date',
                                                name: 'gr_date',
                                                padding: '0 0 5px 30px',
                                                width: '90%',
                                                allowBlank: true,
                                                fieldLabel: '고객요청일',
                                                format: 'Y-m-d',
                                                value: rec.get('gr_date_str')
                                            },
                                            {
                                                xtype: 'numberfield',
                                                id: 'bm_quan',
                                                name: 'bm_quan',
                                                padding: '0 0 5px 30px',
                                                width: '90%',
                                                allowBlank: true,
                                                fieldLabel: '요청수량',
                                                value: rec.get('po_qty')
                                            },
                                            {
                                                xtype: 'combo',
                                                id: 'site',
                                                name: 'reserved5',
                                                padding: '0 0 5px 30px',
                                                displayField: 'view',
                                                store: siteStore,
                                                valueField: 'site',
                                                allowBlank: false,
                                                typeAhead: false,
                                                hideLabel: false,
                                                hideTrigger: false,
                                                width: '90%',
                                                allowBlank: true,
                                                fieldLabel: 'Site',
                                                value: rec.get('reserved5')
                                            },
                                            {
                                                xtype: 'textfield',
                                                id: 'comment',
                                                name: 'reserved1',
                                                padding: '0 0 5px 30px',
                                                width: '90%',
                                                allowBlank: true,
                                                fieldLabel: '수주특이사항',
                                                value: rec.get('reserved1')
                                            },
                                        ]
                                    }
                                ]
                            },

                        ]
                    });

                    var win = Ext.create('Ext.Window', {
                        modal: true,
                        title: gm.me().getMC('CMD_ORDER_REVISION', '수주변경'),
                        width: 500,
                        height: 330,
                        plain: true,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                if (btn == "no" || btn == "cancel") {
                                    win.close();
                                } else {
                                    var form = Ext.getCmp('editPoForm').getForm();
                                    if (form.isValid()) {
                                        win.setLoading(true);
                                        var val = form.getValues(false);
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/production/schdule.do?method=changePo',
                                            params: {
                                                bm_quan: val['bm_quan'],
                                                delivery_plan: val['gr_date'],
                                                assymap_uid: rec.get('assymap_uid'),
                                                sloast_uid: rec.get('unique_uid'),
                                                ac_uid: rec.get('ac_uid'),
                                                project_varchard: val['reserved_varchard'],
                                                reserved5: val['reserved5'],
                                                reserved1: val['reserved1']
                                            },
                                            success: function (val, action) {
                                                console_logs('val >>>>', val);
                                                win.setLoading(false);
                                                gm.me().store.load();
                                                win.close();
                                            },
                                            failure: function () {
                                                win.setLoading(false);
                                                extjsUtil.failureMessage();
                                            }
                                        });
                                    } else {
                                        // Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                    }
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function (btn) {
                                win.close();
                            }
                        }]
                    });
                    win.show();
                }
            }
        });

        this.createStore('Rfx2.model.RecvMgmtVerBioProtech', [{
                property: 'unique_id',
                direction: 'DESC2'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['sloast']
        );

        // this.setRowClass(function (record, index) {
        //     var c = record.get('status_bio');
        //     switch (c) {
        //         case 'CR':
        //         case 'BC':
        //             return 'white-row';
        //             break;
        //         case 'CA':
        //             return 'red-row';
        //             break;
        //         case 'BM':
        //             return 'green-row';
        //             break;
        //         case 'OP':
        //             return 'yellow-row';
        //             break;
        //         case 'W':
        //             return 'blue-row';
        //             break;
        //         case 'DS':
        //             return 'gray-row';
        //             break;
        //         case 'DC':
        //             return 'orange-row';
        //             break;
        //         default:
        //             return 'green-row';
        //             break;
        //     }
        // });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.rollbackPoOnlyPrdAceeptAction);
        buttonToolbar.insert(2, this.changePo);

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGridCore(arr/** , option**/);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                this.rollbackPoOnlyPrdAceeptAction.enable();
                this.changePo.enable();
            } else {
                this.rollbackPoOnlyPrdAceeptAction.disable();
                this.changePo.disable();
            }
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'A');
        this.store.load(function (records) {
            console_logs("테스트==========", records)
        });
    },
    rejectConfirm: function (rec) {
        Ext.MessageBox.show({
            title: gm.getMC('CMD_CONFIRM_CANCELLATION', '확정취소'),
            msg: '선택 한 건을 수주 확정취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    var sloastUids = [];
                    var statusArr = [];
                    var projectUids = [];
                    var cartmapUids = [];
                    for (var i = 0; i < rec.length; i++) {
                        var selections = rec[i];
                        sloastUids.push(selections.get('unique_uid'));
                        statusArr.push(selections.get('status_bio'));
                        projectUids.push(selections.get('ac_uid'));
                        if (selections.get('cartmap_uid') === null || selections.get('cartmap_uid') === undefined) {
                            cartmapUids.push(-1);
                        } else {
                            cartmapUids.push(selections.get('cartmap_uid'));
                        }
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=rejectPoOnlyCRMultiVer',
                        params: {
                            sloastUids: sloastUids,
                            statusArr: statusArr,
                            projectUids: projectUids,
                            cartmapUids: cartmapUids
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 건이 확정취소 되었습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },

    cancelPoAct: function (rec) {
        Ext.MessageBox.show({
            title: gm.getMC('CMD_ORDER_CANCELLATION', '수주취소'),
            msg: '선택 한 건을 수주취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    var assymapUids = [];
                    for (var i = 0; i < rec.length; i++) {
                        var selections = rec[i];
                        var assymap_uid = selections.get('unique_uid');
                        assymapUids.push(assymap_uid);
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=cancelPo',
                        params: {
                            assymapUids: assymapUids
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 건이 확정취소 되었습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },

    pdfDownload: function (size, reportSelection, pos) {
        if (size > pos) {
            var ac_uid = reportSelection[pos].get('ac_uid');
            var parent_uid = reportSelection[pos].get('parent_uid');
            Ext.Ajax.request({
                waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/pdf.do?method=printProforma',
                params: {
                    pdfPrint: 'pdfPrint',
                    is_rotate: 'N',
                    ac_uid: ac_uid,
                    rtgast_uids: ac_uid,
                    parent_uid: parent_uid
                },
                reader: {
                    pdfPath: 'pdfPath'
                },
                success: function (result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var pdfPath = jsonData.pdfPath;
                    console_log(pdfPath);
                    if (pdfPath.length > 0) {
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                        top.location.href = url;
                    }
                    gm.me().pdfDownload(size, reportSelection, ++pos);
                },

            });
        }
    },

    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('ac_uid'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    // {
                    //     xtype: 'button',
                    //     text: '파일업로드',
                    //     scale: 'small',
                    //     iconCls: 'af-upload-white',
                    //     scope: this.fileGrid,
                    //     handler: function () {
                    //         console_logs('=====aaa', record);
                    //         var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                    //         var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                    //             uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                    //             uploaderOptions: {
                    //                 url: url
                    //             },
                    //             synchronous: true
                    //         });
                    //         var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                    //             dialogTitle: '파일첨부',
                    //             panel: uploadPanel
                    //         });
                    //         this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                    //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                    //             console_logs('this.mon uploadcomplete manager', manager);
                    //             console_logs('this.mon uploadcomplete items', items);
                    //             console_logs('this.mon uploadcomplete errorCount', errorCount);
                    //             gm.me().uploadComplete(items);
                    //             uploadDialog.close();
                    //         }, this);
                    //         uploadDialog.show();
                    //     }
                    // },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }
                        }
                    },
                    // this.removeActionFile,
                    '-',
                    // this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '파일 수 : 0'
                    },
                ]
            }

            ],
            columns: [
                {
                    text: '파일 일련번호',
                    width: 100,
                    style: 'text-align:center',
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    flex: 0.7,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '업로드 날짜',
                    style: 'text-align:center',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'file_size'
                },
                {
                    text: '등록자',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]

        });
        win.show();
    },

    viewFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('ac_uid'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    // {
                    //     xtype: 'button',
                    //     text: '파일업로드',
                    //     scale: 'small',
                    //     iconCls: 'af-upload-white',
                    //     scope: this.fileGrid,
                    //     handler: function () {
                    //         console_logs('=====aaa', record);
                    //         var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                    //         var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                    //             uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                    //             uploaderOptions: {
                    //                 url: url
                    //             },
                    //             synchronous: true
                    //         });
                    //         var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                    //             dialogTitle: '파일첨부',
                    //             panel: uploadPanel
                    //         });
                    //         this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                    //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                    //             console_logs('this.mon uploadcomplete manager', manager);
                    //             console_logs('this.mon uploadcomplete items', items);
                    //             console_logs('this.mon uploadcomplete errorCount', errorCount);
                    //             gm.me().uploadComplete(items);
                    //             uploadDialog.close();
                    //         }, this);
                    //         uploadDialog.show();
                    //     }
                    // },
                    // {
                    //     xtype: 'button',
                    //     text: '파일삭제',
                    //     scale: 'small',
                    //     iconCls: 'af-remove',
                    //     scope: this.fileGrid,
                    //     handler: function () {
                    //         console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                    //         if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                    //             var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                    //             var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                    //             if (unique_id != null) {
                    //                 Ext.Ajax.request({
                    //                     url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                    //                     params: {
                    //                         file_path: file_path,
                    //                         unique_id: unique_id
                    //                     },
                    //                     success: function (result, request) {
                    //                         Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                    //                         gm.me().attachedFileStore.load(function (records) {
                    //                             if (records != null) {
                    //                                 var o = gu.getCmp('file_quan');
                    //                                 if (o != null) {
                    //                                     o.update('파일 수 : ' + records.length);
                    //                                 }
                    //                             }
                    //                         });
                    //                     }
                    //                 });
                    //             }
                    //         } else {
                    //             Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                    //         }
                    //     }
                    // },
                    // this.removeActionFile,
                    // '-',
                    // this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '파일 수 : 0'
                    },
                ]
            }

            ],
            columns: [
                {
                    text: '파일 일련번호',
                    width: 100,
                    style: 'text-align:center',
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    flex: 0.7,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '업로드 날짜',
                    style: 'text-align:center',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'file_size'
                },
                {
                    text: '등록자',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]

        });
        win.show();
    },
});
