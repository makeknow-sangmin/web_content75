Ext.define('Rfx2.view.company.bioprotech.designPlan.DesignBomVerUploadView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'design-bomver-upload-view',
    temper: 1,
    initComponent: function () {

        var tabFileUpload = {
            padding: 10,
            items: [
                {
                    bodyPadding: 5,
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'start'
                    },
                    items: [{
                        xtype: 'radiogroup',
                        id: gu.id('measureType'),
                        fieldLabel: this.getMC('CMD_GUBUN', '구분'),
                        items: [
                            {boxLabel: 'BOM_EXCEL', name: 'radio1', inputValue: 'BOM_BIO', checked: true}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (newValue.radio1) {
                                    case 'BW':
                                        break;
                                    case 'SB':
                                        break;
                                }
                            }
                        }
                    }]
                }
            ]
        };

        this.gridContent2 = Ext.create('Ext.panel.Panel', {
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
            items: [this.createMsTab('SIZE', 'SI')]
        });

        this.panelDataUpload = {
            title: this.getMC('CMD_DATA_UPLOAD', '데이터업로드'),
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 5 0',
            flex: 1,
            items: [tabFileUpload, this.gridContent2]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [this.panelDataUpload]
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
        labelWidth: 300 //Only Support this
        //labelWidth: "100"     //Doesn't render with 100 Pixel Size
        //labelWidth: "100px"	//Suffix with px won't work
        //, height:20
    },
    items: null,
    rendererStatus: function (value, metaData, record, rowIndex, colIndex, store) {
        var color = "grey";
        if (value === "대기") {
            color = "blue";
        } else if (value === "업로드중") {
            color = "orange";
        } else if (value === "완료") {
            color = "green";
        } else if (value === "오류") {
            color = "red";
        }
        metaData.tdStyle = 'color:' + color + ";";
        return value;
    },

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 600000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', gu.getCmp('measureType').lastValue.radio1);
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                //handle the answer, in order to detect any server side error

                //Ext.decode(xhr.responseText).success);
                // console.log(xhr.responseText);

                var responseText = Ext.util.JSON.decode(xhr.responseText);
                if (responseText.datas.length > 0) {
                    var winPart = Ext.create('ModalWindow', {
                        title: '업로드 결과',
                        width: 420,
                        height: 600,
                        autoScroll: true,
                        items: [
                            Ext.create('Ext.grid.Panel', {
                                multiSelect: true,
                                autoScroll: true,
                                store: Ext.create('Ext.data.Store', {
                                    data: responseText.datas
                                }),
                                columns: [
                                    {text: '결과', dataIndex: 'result', width: 60},
                                    {text: '모 품번', dataIndex: 'item_code', width: 90},
                                    {text: '비고', dataIndex: 'description', width: 240}
                                ],
                                listeners: {
                                    cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                                        if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                                            var tempTextArea = document.createElement("textarea");
                                            document.body.appendChild(tempTextArea);
                                            tempTextArea.value = eOpts.target.innerText;
                                            tempTextArea.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(tempTextArea);
                                        }
                                    },
                                    // rowkeydown: function (me, record, element, rowIndex, e, eOpts) {
                                    //     if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                                    //         var tempTextArea = document.createElement("textarea");
                                    //         document.body.appendChild(tempTextArea);
                                    //         tempTextArea.value = eOpts.target.innerText;
                                    //         tempTextArea.select();
                                    //         document.execCommand('copy');
                                    //         document.body.removeChild(tempTextArea);
                                    //     }
                                    // }
                                },
                            })
                        ],
                        layout: {
                            xtype: 'vbox',
                            align: 'stretch'
                        },
                        buttons: [{
                            text: '닫기',
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                }
                if (xhr.responseText.length > 1) {
                    store.getData().getAt(i).data.status = "완료";
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === '완료')) {
                            store.remove(record);
                            j--;
                        }
                    }

                } else {
                    store.getData().getAt(i).data.status = "오류";
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;


            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = "오류";
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    //if ((record.data.status === '완료')) {
                    store.remove(record);
                    j--;
                    //}
                }
            }

            //gm.me().storeLoad();
        };
        // Initiate a multipart/form-data upload
        xhr.send(fd);
    },
    ingredientData: '',
    sizeRoundness: '',
    createMsTab: function (title, tabname) {

        this.stores.push(Ext.create('Ext.data.Store', {
            fields: ['name', 'size', 'file', 'status']
        }));
        var sc = this.storecount++;

        var downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: this.getMC('CMD_BOM_UPLOAD_FORM', 'BOM 업로드 양식'),
            tooltip: 'BOM 업로드 양식받기',
            hidden: gu.setCustomBtnHiddenProp('downloadSheetAction'),
            handler: function () {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=printBomTemplate',
                    params: {},
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var excelPath = jsonData.excelPath;
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                        top.location.href = url;
                        prWin.close();
                    },//Ajax success
                    failure: function (result, request) {
                        Ext.Msg.alert('오류', 'BOM 업로드 템플릿을 출력할 수 없습니다.');
                        prWin.close();
                    }
                });
            }
        });

        var dlBomParentChildExcelAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'BOM 리스트 받기',
            tooltip: '업로드 된 모든 BOM 리스트를 다운로드 합니다(모자관계)',
            hidden: gu.setCustomBtnHiddenProp('dlBomParentChildExcelAction'),
            handler: function () {
                gm.setCenterLoading(true);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=printBomParentChildExcel',
                    params: {},
                    success: function (result, request) {
                        gm.setCenterLoading(false);
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var excelPath = jsonData.excelPath;
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                        top.location.href = url;
                        prWin.close();
                    },//Ajax success
                    failure: function (result, request) {
                        gm.setCenterLoading(false);
                        Ext.Msg.alert('오류', 'BOM 업로드 템플릿을 출력할 수 없습니다.');
                        prWin.close();
                    }
                });
            }
        });

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
                                    header: this.getMC('mes_sro5_pln_column_fi le_name', '파일명'),
                                    dataIndex: 'name',
                                    flex: 2
                                }, {
                                    header: this.getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                    dataIndex: 'size',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: this.getMC('mes_sro5_pln_column_status', '상태'),
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: this.rendererStatus
                                }],
                                viewConfig: {
                                    emptyText: this.getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
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
                                    text: this.getMC('CMD_UPLOAD', "업로드"),
                                    btnName: 'uploadButton',
                                    hidden: gu.setCustomBtnHiddenProp('uploadButton'),
                                    handler: function () {

                                        var l_store = gm.me().stores[0];
                                        console.log(l_store.data.items);

                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === "완료")) {
                                                l_store.getData().getAt(i).data.status = "업로드중";
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/design/bom.do?method=uploadBomVer&file_itemcode=' + gUtil.RandomString(10),
                                                    l_store, i, tabname);
                                            }
                                        }

                                    }
                                }, {
                                    text: this.getMC('CMD_ALL_DELETE', "전체삭제"),
                                    btnName: 'allDeleteButton',
                                    hidden: gu.setCustomBtnHiddenProp('allDeleteButton'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                },
                                    /*{
                                    text: "업로드 한 파일 삭제",
                                    handler: function () {

                                    var l_store = gm.me().stores[0];

                                    for (var i = 0; i < l_store.data.items.length; i++) {
                                    var record = l_store.getData().getAt(i);
                                    if ((record.data.status === '완료')) {
                                    l_store.remove(record);
                                    i--;
                                    }
                                    }
                                    }
                                    }, */{
                                        text: this.getMC('CMD_SELECT_DELETE', "선택삭제"),
                                        btnName: 'selectDeleteButton',
                                        hidden: gu.setCustomBtnHiddenProp('selectDeleteButton'),
                                        handler: function () {
                                            var l_store = gm.me().stores[0];

                                            l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                        }
                                    },
                                    downloadSheetAction,
                                    dlBomParentChildExcelAction
                                ]
                            }],
                        }
                    ]
                }
            ]
        });

        return tabDataUpload;
    },
    stores: [],
    ingredientList: [],
    storecount: 0,
    gridContent2: null,
    fields: []
});