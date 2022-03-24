Ext.define('Rfx2.view.company.sejun.qualityMgmt.StandardOperationMgmtView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'board-view',
	initComponent: function () {

		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
		this.setDefValue('board_count', 0); //Hidden Value임.
		this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.

		//검색툴바 필드 초기화
		this.initSearchField();
		//검색툴바 추가
		// this.addSearchField (
		// {
		// 		field_id: 'gubun'
		// 		,store: 'BoardGubunStore'
		// 		,displayField: 'codeName'
		// 		,valueField: 'systemCode'
		// 		,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
		// });	
		// this.addSearchField('unique_id');
		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		// this.addSearchField('user_id');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();


		//명령툴바 생성
		// var buttonToolbar = this.createCommandToolbar();
		var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });


		this.createStore('Rfx2.model.company.bioprotech.ProductMgmt', [{
			property: 'unique_id',
			direction: 'DESC'
		}],
			gMain.pageSize/*pageSize*/
			//order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
			, {
				item_code_dash: 's.item_code',
				comment: 's.comment1',
				sg_code: 'sg_code_kr_name'
			},
			['srcahd']
		);

		// //모델 정의
		// this.createStore('Rfx.model.Board', [{
		// 	property: 'create_date',
		// 	direction: 'DESC'
		// }],
		// 	/*pageSize*/
		// 	gMain.pageSize
		// 	//order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
		// 	//Orderby list key change
		// 	//ordery create_date -> p.create로 변경.
		// 	, {
		// 		board_content: 'b.board_content',
		// 		board_count: 'b.board_count',
		// 		board_email: 'b.board_email',
		// 		board_title: 'b.board_title',
		// 		create_date: 'b.create_date',
		// 		creator: 'b.creator',
		// 		gubun: 'b.gubun',
		// 		unique_id: 'b.unique_id',
		// 		user_id: 'b.user_id'
		// 	}
		// 	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
		// 	, ['board']
		// );

		this.uploadFileAction = Ext.create('Ext.Action', {
            iconCls: 'af-upload-white',
            disabled : true,
            text: '파일업로드',
            tooltip: this.getMC('성적서 등 필요문서를 업로드 합니다.'),
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
                    title: gm.me().getMC('CMD_FILE_UPLOAD','파일 업로드'),
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

        this.downloadFileAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            text: this.getMC('mes_order_file_btn', '파일다운로드'),
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });
		buttonToolbar.insert(1, this.uploadFileAction);
		buttonToolbar.insert(2, this.downloadFileAction);
		var btnsNeedSelection = [];
		btnsNeedSelection.push(this.uploadFileAction);
		btnsNeedSelection.push(this.downloadFileAction);
		//그리드 생성
		var arr = [];
		arr.push(buttonToolbar);
		arr.push(searchToolbar);
		//grid 생성.
		this.createGrid(arr);

		//입력/상세 창 생성.
		this.createCrudTab();

		Ext.apply(this, {
			layout: 'border',
			items: [this.grid, this.crudTab]
		});


		this.callParent(arguments);

		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.load(function (records) { });
		this.loadStoreAlways = true;

		this.setGridOnCallback(function (selections) {
            if (selections.length) {
                btnsNeedSelection.forEach(el => {
                    el.enable();
                });
                // this.editSampleResult.enable();
                // this.editLotResult.enable();
                // this.deleteInspection.enable();
            } else {
                btnsNeedSelection.forEach(el => {
                    el.disable();
                });
                // this.editSampleResult.disable();
                // this.editLotResult.disable();
                // this.deleteInspection.disable();
            }
        });

	},
	items: [],
	itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
		//console_logs('boardview itemdblclick record', record);z

		Rfx.model.Board.load(record.get('unique_id'), {
			success: function (board) {
				console_logs('board', board);
				var form = gm.me().createViewForm(board);
				var win = Ext.create('ModalWindow', {
					title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
					width: 700,
					height: 530,
					minWidth: 250,
					minHeight: 180,
					layout: 'absolute',
					plain: true,
					items: form,
					buttons: [{
						text: CMD_OK,
						handler: function () {
							if (win) {
								win.close();
							}
						}
					}]
				});
				win.show();
			}
		});


	},
	createViewForm: function (board) {
		//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
		console_logs('board', board);
		//    	var lineGap = 30;
		var unique_id = board.get('unique_id');
		var user_id = board.get('user_id');
		var board_email = board.get('board_email');
		var board_title = board.get('board_title');
		var board_content = board.get('board_content');
		var htmlFileNames = board.get('htmlFileNames');
		var fileQty = board.get('fileQty');
		var form = Ext.create('Ext.form.Panel', {
			defaultType: 'displayfield',
			bodyPadding: 3,
			height: 650,
			defaults: {
				anchor: '100%',
				allowBlank: false,
				msgTarget: 'side',
				labelWidth: 60
			},
			items: [{
				fieldLabel: '등록자',
				value: user_id + '(' + board_email + ')'
			}, {
				fieldLabel: gm.getColName('board_title'),
				value: board_title,
				name: 'board_title'
			}, {
				fieldLabel: '첨부파일',
				value: htmlFileNames
			}, {
				value: board_content,
				xtype: 'textarea',
				fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
				height: 340,
				readOnly: true,
				anchor: '100%'
			}
			]
		}); //endof form

		return form;
	},
	createMsTab: function (title, tabname) {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status']
            }));
        }
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
                                                gm.me().postDocument(CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long'),
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
    stores: [],
    ingredientList: [],
    storecount: 0,
    fields: []

});
