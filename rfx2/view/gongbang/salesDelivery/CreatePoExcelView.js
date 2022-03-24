Ext.define('Rfx2.view.gongbang.salesDelivery.CreatePoExcelView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'create-po-excel-view',
    initComponent: function () {

        this.initSearchField();

        gm.pageSize = 300;

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.company.kbtech.CreatePoKbTech', [{
                property: 'unique_id',
                direction: 'ASC'
            }],
            gm.pageSize
            , {}
            , ['buffer']
        );

        this.gridContent = Ext.create('Ext.panel.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContent'),
            collapsible: false,
            region: 'east',
            multiSelect: false,
            autoHeight: true,
            frame: false,
            layout: 'vbox',
            forceFit: true,
            flex: 1,
            items: [this.createMsTab('EXCEL', 'PO')]
        });

        this.panelDataUpload = {
            title: '수주업로드',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 5 0',
            flex: 1,
            items: [this.gridContent]
        };

        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar = this.createSearchToolbar();
        var arr = [];

        (buttonToolbar.items).each(function (item, index) {
            if (index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(arr);

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [
                {
                    title: '업로드 실패 리스트',
                    collapsible: true,
                    frame: true,
                    region: 'east',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    flex: 2.5,
                    items: [this.grid]
                },
                this.panelDataUpload
            ]
        });

        this.store.getProxy().setExtraParam('limit', 300);

        this.store.load(function (records) {

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
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', 'PO');
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                //handle the answer, in order to detect any server side error

                //Ext.decode(xhr.responseText).success);

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
                                    header: '파일명',
                                    dataIndex: 'name',
                                    flex: 2
                                }, {
                                    header: '파일크기',
                                    dataIndex: 'size',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: '상태',
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: this.rendererStatus
                                }],
                                viewConfig: {
                                    emptyText: '이곳에 파일을 끌어 놓으세요',
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
                                    text: "업로드",
                                    handler: function () {

                                        var l_store = gm.me().stores[0];

                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === "완료")) {
                                                l_store.getData().getAt(i).data.status = "업로드중";
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/production/schdule.do?method=uploadPoWowTech&file_itemcode=' + gUtil.RandomString(10),
                                                    l_store, i, tabname);
                                            }
                                        }

                                    }
                                }, {
                                    text: "전체삭제",
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, {
                                    text: "선택삭제",
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
    stores: [],
    ingredientList: [],
    storecount: 0,
    gridContent2: null,
    fields: []
});