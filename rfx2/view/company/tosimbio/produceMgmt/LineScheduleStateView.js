Ext.define('Rfx2.view.company.bioprotech.produceMgmt.LineScheduleStateView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'machine-view',
	initComponent: function () {

        var isPlanRenderer = function (value) {
            if(value) {
                return '계획';
            } else {
                return '실적';
            }
        }
        var dataTypeColumn = this.columns.find(el => el.dataIndex === 'isPlan');
        if(!!dataTypeColumn) {
            dataTypeColumn.renderer = isPlanRenderer;
            dataTypeColumn.exportRenderer = isPlanRenderer;
            dataTypeColumn.align = 'center';
        }

        // this.setRowClass(function (record, index) {
        //     var isPlan = record.get('isPlan');
        //     if (isPlan) {
        //         return 'gray-row';
        //     } else {
        //         return 'white-row';
        //     }
        // });

		//검색툴바 필드 초기화
		this.initSearchField();
        var startDay = new Date();
        startDay.setDate(1);
        var endDay = new Date();
        endDay.setMonth(endDay.getMonth() + 1);
        endDay.setDate(0)
		this.addSearchField({
			type: 'dateRange',
			field_id: 'plan_date',
			text: gm.getMC('CMD_DATE', '날짜'),
			sdate: startDay,
			edate: endDay
		});
        this.addSearchField({
            type: 'combo'
            , field_id: 'reserved_varchar2'
            , store: 'ProductionSiteStore'
            , displayField: 'codeName'
            , valueField: 'codeName'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });
		this.addSearchField({
            type: 'combo'
            , field_id: 'mchn_type'
            , emptyText: '라인유형'
            , store: "PcsLineTypeStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , value: 'mchn_type'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

		//  라인명 검색조건
		this.addSearchField('name_ko');
		this.addSearchField('lot_no');

		this.addSearchField('item_name');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();

		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
		});
        this.localSize = 99999;
		this.createStore('Rfx2.model.company.bioprotech.LineSchedule', [{
			property: 'name_ko',
			direction: 'ASC'
		}],
            this.localSize
			, {}
			, ['pcsmchn']
		);

		this.uploadFileAction = Ext.create('Ext.Action', {
            iconCls: 'af-upload-white',
            disabled : false,
            text: '스케쥴업로드',
            // hidden: gu.setCustomBtnHiddenProp('uploadFileAction'),
            tooltip: this.getMC('라인별 계획을 업로드합니다.'),
            handler: function() {
                var gridContent = Ext.create('Ext.panel.Panel', {
                    cls: 'rfx-panel',
                    id: gu.id('gridContent2'),
                    collapsible: false,
                    region: 'east',
                    multiSelect: false,
                    //autoScroll: true,
                    autoHeight: true,
                    frame: false,
                    layout: 'vbox',
                    forceFit: true,
                    flex: 1,
                    items: [gm.me().createMsTab('SIZE', 'SI')]
                });
                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('CMD_FILE_UPLOAD','스케쥴업로드'),
                    id: gu.id('uploadPrWin'),
                    width: 500,
                    height: 500,
                    items: {
                        collapsible: false,
                        frame: false,
                        region: 'center',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0 0 5 0',
                        flex: 1,
                        items: [gridContent]
                    }
                });

                prWin.show();
            }
        });
        this.exportExcelAction = Ext.create('Ext.Action', {
			iconCls: 'af-excel',
			text: 'Excel',
			tooltip: 'Save Grid As Excel File',
			disabled: false,
			handler: function() {
				gm.me().grid.saveDocumentAs({
                    type: 'xlsx',
                    title:  gm.me().title,
                    fileName: gm.me().link + '.xlsx'
                });
            }
        });

        buttonToolbar.insert(6, this.exportExcelAction);
		buttonToolbar.insert(1, this.uploadFileAction);

		var arr = [];
        var option = {
            'exporter': true
        }
        arr.push(option)
		arr.push(buttonToolbar);
		arr.push(searchToolbar);
        // arr.push(option);

        
		//grid 생성.
		this.createGrid(arr, null, option);
        this.grid.addPlugin('gridexporter');
		this.createCrudTab();
		Ext.apply(this, {
            layout: 'border',
			items: [this.grid, this.crudTab]
		});
        
		this.callParent(arguments);

        // searchField value 가져오기
        var dateRangeId = this.link + '-' + gMain.getSearchField('plan_date');
        var sDateField = Ext.getCmp(dateRangeId + '-s');
        var eDateField = Ext.getCmp(dateRangeId + '-e');
        var sDate = Ext.Date.format(sDateField.getValue(), 'Y-m-d');
        var eDate = Ext.Date.format(eDateField.getValue(), 'Y-m-d');
        this.store.getProxy().setExtraParams({
            plan_date : sDate + ':' + eDate
        });
        startDay.setDate(startDay.getDate()+93);
        endDay.setDate(endDay.getDate()-93);
        eDateField.setMaxValue(startDay);
        sDateField.setMinValue(endDay);
        
		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.load(function (records) {});
		// this.setGridOnCallback(function (selections) {
        //     if (selections.length) {
        //     } else {
        //     }
        // });

        // searchfield 날짜제한
        sDateField.on('change', function (field, newVal, oldVal) {
            newVal.setDate(newVal.getDate()+93);
            eDateField.setMaxValue(newVal);
        });
        eDateField.on('change', function (field, newVal, oldVal) {
            newVal.setDate(newVal.getDate()-93);
            sDateField.setMinValue(newVal);
        });

        this.store.on('load', function (me, records, c, d) {
            var planDates = me.getProxy().getExtraParams().plan_date;
            var dateArr = planDates.replaceAll('%','').replaceAll('"','').split(':');
            var sDateArr = dateArr[0].split('-');
            var eDateArr = dateArr[1].split('-');
            var startDate = new Date();
            var endDate = new Date();
            // hard-corded
            var dbColumnCount = 5; // 고정 컬럼 개수
            startDate.setFullYear(sDateArr[0],sDateArr[1]-1,sDateArr[2]);
            endDate.setFullYear(eDateArr[0],eDateArr[1]-1,eDateArr[2]);
            // 고정 컬럼 외의 것 제거 & 날짜 컬럼 생성
            for (var i = gm.me().columns.length; i > dbColumnCount; i--) {
                gm.me().columns.pop();
            }
            endDate.setDate(endDate.getDate() + 1);
            while(startDate < endDate) {
                var year = startDate.getFullYear();
                var month = startDate.getMonth()+1;
                var day = startDate.getDate();
                gm.me().columns.push({
                    text: (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day),
                    dataIndex: 'date_' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day),
                    width: 60,
                    style: 'text-align:center',
                    align: 'right',
                    // locked: true,
                    // lockable: true,
                    renderer: gm.me().renderNumber,
                });
                startDate.setDate(startDate.getDate() + 1);
            }
            gm.me().grid.reconfigure(undefined, gm.me().columns);
            // 데이터 모양 변경
            var newRecords = [];
            records.forEach(el => {
                var planDate = el.get('plan_date');
                var columnName = 'date_' + planDate.substring(5);
                var newRecordPlan = newRecords.find(rec => rec.get('lot_no')===el.get('lot_no')
                    && rec.get('mchn_code')===el.get('mchn_code')
                    && rec.get('isPlan'));
                var newRecordWork = newRecords.find(rec => rec.get('lot_no')===el.get('lot_no')
                    && rec.get('mchn_code')===el.get('mchn_code')
                    && !rec.get('isPlan'));
                
                if (!!newRecordPlan) {
                    var val = el.get('plan_qty');
                    newRecordPlan.set(columnName, val);
                } else {
                    var val = el.get('plan_qty');
                    var newRec = el.copy(el.get('id')+'_plan');
                    newRec.set('isPlan', true);
                    newRec.set(columnName, val);
                    newRecords.push(newRec);
                }

                if (!!newRecordWork) {
                    var val = el.get('work_qty_sum');
                    newRecordWork.set(columnName, val);
                } else {
                    var val = el.get('work_qty_sum');
                    var newRec = el.copy(el.get('id')+'_work');
                    newRec.set('isPlan', false);
                    newRec.set(columnName, val);
                    newRecords.push(newRec);
                }
            });
            me.setData(newRecords);
        });
	},
	items: [],
	createMsTab: function (title, tabname) {
        // var record = gm.me().grid.getSelectionModel().getSelection()[0];
        // if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status']
            }));
        // }
        var sc = this.storecount/*++*/;
        var tabDataUpload = Ext.create('Ext.panel.Panel', {
            //title: title,
            tabPosition: 'bottom',
            plain: true,
            width: '100%',
            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            items: [{
                                multiSelect: true,
                                xtype: 'grid',
                                id: 'UploadGrid' + [sc],
                                selModel: Ext.create("Ext.selection.CheckboxModel"),
                                columns: [{
                                    header: gm.me().getMC('mes_sro5_pln_column_file_name', '파일명'),
                                    dataIndex: 'name',
                                    flex: 2
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                    dataIndex: 'size',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_status', '상태'),
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: this.rendererStatus
                                }],
                                viewConfig: {
                                    emptyText: gm.me().getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
                                    height: 700,
                                    deferEmptyText: false
                                },
                                store: this.stores[sc],

                                listeners: {

                                    drop: {
                                        element: 'el',
                                        fn: 'drop'
                                    },

                                    dragstart: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragenter: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragover: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragleave: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                    dragexit: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                },

                                noop: function (e) {
                                    e.stopEvent();
                                },

                                addDropZone: function (e) {
                                    if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                        return;
                                    }
                                    e.stopEvent();
                                    this.addCls('drag-over');
                                },

                                removeDropZone: function (e) {
                                    var el = e.getTarget(),
                                        thisEl = this.getEl();
                                    e.stopEvent();
                                    if (el === thisEl.dom) {
                                        this.removeCls('drag-over');
                                        return;
                                    }

                                    while (el !== thisEl.dom && el && el.parentNode) {
                                        el = el.parentNode;
                                    }

                                    if (el !== thisEl.dom) {
                                        this.removeCls('drag-over');
                                    }

                                },

                                drop: function (e) {

                                    e.stopEvent();
                                    Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                                        gm.me().stores[0].add({
                                            file: file,
                                            name: file.name,
                                            size: file.size,
                                            status: '대기'

                                        });
                                    });
                                    this.removeCls('drag-over');
                                },

                                tbar: [{
                                    text: gm.me().getMC('mes_sro5_pln_btn_upload', '업로드'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                                                l_store.getData().getAt(i).data.status = gm.me().getMC('mes_sro5_pln_btn_uploading', '업로드중');
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/admin/defineCalendar.do?method=uploadLineSchedule&group_code=' + gUtil.RandomString(10),
                                                    l_store, i, tabname);
                                            }
                                        }
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_all', '전체삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                    }
                                }]
                            }],
                        }
                    ]
                }
            ]
        });
        return tabDataUpload;
    },

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    store.remove(record);
                    j--;
                }
                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }
        };
        xhr.send(fd);
    },
    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),
    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
        // var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
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
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
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

    uploadComplete: function (items) {
        console_logs('uploadComplete items', items);
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title: '파일업로드 완료',
            icon: Ext.MessageBox['INFO'],
            msg: '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width: 450
        });
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }
            }
        });
    },
    renderNumber: function (value) {
        if (value !== null && value > 0) {
            return Ext.util.Format.number(value, '0,000.#####');
        } else {
            return value;
        }
    },
    stores: [],
    ingredientList: [],
    storecount: 0,
    fields: [],
});
