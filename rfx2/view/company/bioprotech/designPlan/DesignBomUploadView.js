Ext.define('Rfx2.view.company.bioprotech.designPlan.DesignBomUploadView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'design-bom-upload-view',
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
                        fieldLabel: '구분',
                        items: [
                            {boxLabel: 'BOM_BIO', name: 'radio1', inputValue: 'BOM_BIO', checked: true}
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
            title: '데이터업로드',
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
        xhr.timeout = 30000; // time in milliseconds
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
                                                gm.me().postDocument(CONTEXT_PATH + '/design/bom.do?method=uploadBomKbTech&file_itemcode=' + gUtil.RandomString(10),
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
                                }, /*{
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