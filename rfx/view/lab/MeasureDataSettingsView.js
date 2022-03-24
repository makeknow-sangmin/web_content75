Ext.define('Rfx.view.lab.MeasureDataSettingsView', {
    extend: 'Ext.panel.Panel',
    xtype: 'measure-data-settings-view',
    temper: 1,
    initComponent: function () {

        var storeTemplate = Ext.create('Mplm.store.CubeStore', {});

        this.storeContent = Ext.create('Mplm.store.MeasureDataStore', {});

        var gridTemplate = Ext.create('Ext.grid.Panel', {
            store: storeTemplate,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(storeTemplate),
            frame: false,
            layout: 'fit',
            forceFit: true,
            margin: '0 10 0 0',
            width: '100%',
            columns: [{
                text: '검사명',
                dataIndex: 'name'
            }]
        });

        storeTemplate.load();

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
                        pack: 'start',
                    },
                    items: [{
                        xtype: 'radiogroup',
                        id: gu.id('productType'),
                        fieldLabel: '제품 구분',
                        items: [
                            {boxLabel: 'Solder Ball', name: 'radio1', inputValue: 'SB'},
                            {boxLabel: 'Bonding Wire', name: 'radio1', inputValue: 'BW'},
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

        gridTemplate.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gu.getCmp('radiogroupInsType').removeAll();

                var storeCubeDim = Ext.create('Mplm.store.CubeDimStore', {});

                storeCubeDim.load({
                    callback: function (records, operation, success) {

                        for (var i = 0; i < records.length; i++) {

                            var rec = records[i].data;

                            gu.getCmp('radiogroupInsType').add({
                                boxLabel: rec.dim_name,
                                name: 'instype',
                                inputValue: i
                            });
                        }
                    }
                });
            }
        });

        this.gridContent = Ext.create('Ext.grid.Panel', {
            store: this.storeContent,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            selModel: Ext.create("Mplm.util.SelModelCheckbox", {
                mode: 'SINGLE',
                multiSelect: false
            }),
            bbar: getPageToolbar(this.storeContent),
            frame: false,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            columns: this.columns,

            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default',
                    margin: '0 0 0 0',
                    items: [
                        {
                            fieldLabel: "<font color=white>검사일자</font>",
                            xtype: "datefield",
                            labelWidth: 60,
                            width: 170,
                            value: new Date()
                        },
                        {
                            emptyText: "검사구분",
                            xtype: "textfield",
                            width: 100
                        },
                        {
                            emptyText: "Lot 번호",
                            xtype: "textfield",
                            width: 100
                        },
                        {
                            xtype: 'tbtext',
                            id: 'label2',
                            text: ''
                        }
                    ]
                })
            ]
        });

        this.gridContent.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                var id = selections[0].data.id;

                if (id > -1) {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=readMeasureDataDetail',
                        params: {
                            rtgast_uid: id
                        },
                        success: function (result, request) {
                            var jsonData = Ext.decode(result.responseText);
                            var data = jsonData.datas;
                            switch (jsonData.datas[0].type) {
                                case 'SISB':
                                    for (var j = 0; j < data.length; j++) {
                                        var size = data[j].v000.split(":");
                                        var roundness = data[j].v001.split(":");
                                        gm.me().storeDataSize.insert(0, new Ext.data.Record(
                                            {
                                                lotNo: selections[0].data.po_no,
                                                SIZE: size[1],
                                                ROUNDNESS: roundness[1]
                                            }));
                                    }
                                    gm.me().storeDataSize.sync();
                                    break;
                                case 'INSB':
                                case 'INBW':
                                    for (var j = 0; j < data.length; j++) {

                                        var columns = [];

                                        columns['lotNo'] = selections[0].data.po_no;

                                        for (var key in data[j]) {
                                            if (data[j].hasOwnProperty(key)) {

                                                if(key.match('v0')) {

                                                    var dataofkey = data[j][key];
                                                    if(dataofkey != null && dataofkey.length > 0) {

                                                        var test = dataofkey.split(':');
                                                        columns[test[0]] = test[1];
                                                    }
                                                }
                                            }
                                        }


                                        gm.me().storeData.insert(0, new Ext.data.Record(columns));
                                    }
                                    gm.me().storeData.sync();
                                    break;
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });

        this.storeContent.load();

        this.gridContent2 = Ext.create('Ext.tab.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContent2'),
            collapsible: false,
            region: 'east',
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            layout: 'vbox',
            forceFit: true,
            flex: 1,
            items: [this.createMsTab('SIZE', 'SI'), this.createMsTab('성분', 'IN')]
        });

        var panelInsCategory = {
            title: '검사 유형',
            collapsible: true,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridTemplate]
        };

        var panelDetails = {
            //title: '상세내용',
            //frame: true,
            id: gu.id('gridContent'),
            region: 'center',
            tbar: {
                plugins: {
                    boxreorderer: true
                },
                items: [

                    '->',
                    {
                        iconCls: null,
                        glyph: 'f002@FontAwesome',
                        text: '조회'
                    }, {
                        iconCls: null,
                        glyph: 'f014@FontAwesome',
                        text: gm.getMC('CMD_DELETE', '삭제')
                    }

                ]
            },
            layout: {
                type: 'card'
            },
            margin: '0 0 0 0',
            flex: 2,
            items: [this.gridContent],
            activeItem: 0
        };

        var panelDataUpload = {
            title: '데이터업로드',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 4,
            items: [tabFileUpload, this.gridContent2]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [
                {
                    title: '상세내용',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '0 0 0 0',
                    flex: 2,
                    items: [panelDetails]
                },
                /*panelDetails, */panelDataUpload]
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
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('product_type', gu.getCmp('productType').lastValue.radio1);
        fd.append('measure_type', tabname);

        //xhr.setRequestHeader("Content-Type","multipart/form-data");
        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //handle the answer, in order to detect any server side error

                //Ext.decode(xhr.responseText).success);

                if (xhr.responseText.length > 1) {
                    store.getData().getAt(i).data.status = "완료";
                } else {
                    store.getData().getAt(i).data.status = "오류";
                }
                store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;

                var keys = Object.keys(data[0]);

                var textareadata = gu.getCmp(tabname + '_ingredientData').getValue();

                var start = 0;

                if (textareadata.substring(0, 6) == 'LOT NO') {
                    start = 1;
                    textareadata += '\n';
                }

                for (var j = start; j < data.length; j++) {
                    for (var k in keys) {
                        textareadata += data[j][keys[k]] + '    ';
                    }
                    if (j != data.length - 1) {
                        textareadata += '\n';
                    }
                }

                gu.getCmp(tabname + '_ingredientData').setValue(textareadata);

                switch (gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())) {
                    case 0:
                        for (var j = 1; j < data.length; j++) {
                            gm.me().storeDataSize.insert(0, new Ext.data.Record(
                                {
                                    lotNo: data[j].lotNo,
                                    SIZE: data[j].SIZE,
                                    ROUNDNESS: data[j].ROUNDNESS
                                }));
                        }
                        gm.me().storeDataSize.sync();
                        break;
                    case 1:
                        for (var j = 1; j < data.length; j++) {
                            gm.me().storeData.insert(0, new Ext.data.Record(data[j]));
                        }
                        gm.me().storeData.sync();
                        break;
                }

            } else if (xhr.readyState == 4 && xhr.status == 404) {
                store.getData().getAt(i).data.status = "오류";
                store.getData().getAt(i).commit();
            }
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

        var dataGrid = Ext.create('Ext.grid.Panel', {
            title: '그리드 뷰',
            store: this.storeData,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            //border: true,
            frame: false,
            //flex: 1,
            layout: 'fit',
            //region: 'center',
            forceFit: false,
            margin: '0 0 0 0',
            flex: 1,

            dockedItems: [

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text: '저장',
                            align: 'right',
                            listeners: [{
                                click: function () {

                                    var store = gm.me().storeData.getRange();
                                    var storeData = [];

                                    for (var i = 0; i < store.length; i++) {
                                        storeData.push(store[i].data);
                                    }

                                    var jsonData = Ext.JSON.encode(storeData);

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=saveMeasureData',
                                        params: {
                                            jsonData: jsonData,
                                            productType: gu.getCmp('productType').lastValue.radio1,
                                            measureType: 'IN'
                                        },
                                        success: function (result, request) {
                                            Ext.Msg.alert('결과', '저장 되었습니다.');
                                            gm.me().storeData.removeAll();
                                            gm.me().storeData.sync();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });

                                }
                            }]
                        }]
                })
            ],

            columns: [{
                text: 'LOTNO',
                dataIndex: 'lotNo',
                width: 200
            }, {
                text: 'Pb',
                dataIndex: 'Pb',
                align: 'right'
            }, {
                text: 'Sb',
                dataIndex: 'Sb',
                align: 'right'
            }, {
                text: 'Cu',
                dataIndex: 'Cu',
                align: 'right'
            }, {
                text: 'Ag',
                dataIndex: 'Ag',
                align: 'right'
            }, {
                text: 'Cd',
                dataIndex: 'Cd',
                align: 'right'
            }, {
                text: 'In',
                dataIndex: 'In',
                align: 'right'
            }, {
                text: 'Zn',
                dataIndex: 'Zn',
                align: 'right'
            }, {
                text: 'Bi',
                dataIndex: 'Bi',
                align: 'right'
            }, {
                text: 'As',
                dataIndex: 'As',
                align: 'right'
            }, {
                text: 'Al',
                dataIndex: 'Al',
                align: 'right'
            }, {
                text: 'Fe',
                dataIndex: 'Fe',
                align: 'right'
            }, {
                text: 'Ni',
                dataIndex: 'Ni',
                align: 'right'
            }, {
                text: 'Co',
                dataIndex: 'Co',
                align: 'right'
            }, {
                text: 'Au',
                dataIndex: 'Au',
                align: 'right'
            }, {
                text: 'Ge',
                dataIndex: 'Ge',
                align: 'right'
            }, {
                text: 'P',
                dataIndex: 'P',
                align: 'right'
            }, {
                text: 'S',
                dataIndex: 'S',
                align: 'right'
            }, {
                text: 'Sn',
                dataIndex: 'Sn',
                align: 'right'
            }]
        });

        var dataGridSize = Ext.create('Ext.grid.Panel', {
            title: '그리드 뷰',
            id: gu.id('dataGridSize'),
            store: this.storeDataSize,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            //border: true,
            frame: false,
            //flex: 1,
            layout: 'fit',
            //region: 'center',
            forceFit: false,
            margin: '0 0 0 0',
            flex: 1,

            dockedItems: [

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text: '저장',
                            align: 'right',
                            listeners: [{
                                click: function () {

                                    var store = gm.me().storeDataSize.getRange();

                                    var storeData = [];

                                    for (var i = 0; i < store.length; i++) {
                                        storeData.push(store[i].data);
                                    }

                                    var jsonData = Ext.JSON.encode(storeData);

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=saveMeasureData',
                                        params: {
                                            jsonData: jsonData,
                                            productType: gu.getCmp('productType').lastValue.radio1,
                                            measureType: 'SI'
                                        },
                                        success: function (result, request) {
                                            Ext.Msg.alert('결과', '저장 되었습니다.');
                                            gm.me().storeDataSize.removeAll();
                                            gm.me().storeDataSize.sync();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            }]
                        }]
                })
            ],
            columns: [{
                text: 'LOTNO',
                dataIndex: 'lotNo',
                width: 200
            }, {
                text: 'Size',
                dataIndex: 'SIZE',
                // xtype: 'numbercolumn',
                // format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Roundness',
                dataIndex: 'ROUNDNESS',
                // xtype: 'numbercolumn',
                // format: '0,000.0000',
                align: 'right'
            }]
        });

        var tabDataUpload = Ext.create('Ext.tab.Panel', {
            title: title,
            tabPosition: 'bottom',
            plain: true,
            items: [
                {
                    xtype: 'form',
                    title: 'Raw 데이터',
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
                                        gm.me().stores[gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())].add({
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

                                        var l_store = gm.me().stores[gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())];

                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === "완료")) {
                                                l_store.getData().getAt(i).data.status = "업로드중";
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/xdview/xdmMeasure.do?method=uploadMeasureData&file_itemcode=' + gUtil.RandomString(10),
                                                    l_store, i, tabname);
                                            }
                                        }

                                    }
                                }, {
                                    text: "전체삭제",
                                    handler: function () {
                                        var l_store = gm.me().stores[gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())];
                                        l_store.reload();
                                    }
                                }, {
                                    text: "업로드 한 파일 삭제",
                                    handler: function () {
                                        var l_store = gm.me().stores[gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())];
                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            var record = l_store.getData().getAt(i);
                                            if ((record.data.status === "Uploaded")) {
                                                l_store.remove(record);
                                                i--;
                                            }
                                        }
                                    }
                                }, {
                                    text: "선택삭제",
                                    handler: function () {
                                        var l_store = gm.me().stores[gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())];
                                        l_store.remove(Ext.getCmp('UploadGrid' + gm.me().gridContent2.items.indexOf(gm.me().gridContent2.getActiveTab())).getSelection());

                                    }
                                }]


                            }],
                        },
                        {
                            bodyPadding: 5,
                            defaults: {
                                border: true,
                                flex: 1,
                            },
                            layout: 'fit',
                            items: [
                                {
                                    xtype: "textarea",
                                    flex: 1,
                                    width: 500,
                                    height: 500,
                                    id: gu.id(tabname + '_ingredientData'),
                                    autoScroll: true,
                                    emptyText: '엑셀에서 필드를 포함해서 [복사/붙여넣기] 하세요.',
                                    //anchor: '100%',
                                    grow: true,
                                    scroll: 'vertical',
                                    defaults: {
                                        scroll: 'vertical'
                                    },
                                    value: sc == 0 ? this.sizeRoundness : this.ingredientData,
                                    fieldStyle: "background: #FAE480 !important;"
                                }
                            ]
                        }

                    ]
                },
                sc == 0 ? dataGridSize : dataGrid
            ]
        });

        return tabDataUpload;
    },
    stores: [],
    ingredientList: [],
    storecount: 0,
    gridContent2: null,
    storeDataSize: Ext.create('Ext.data.Store', {
        autoLoad: false,
        root: 'datas',
        fields: [
            {name: 'lotNo', type: 'string'}
            , {name: 'SIZE', type: 'string'}
            , {name: 'ROUNDNESS', type: 'string'}
        ],
        data: []
    }),
    storeData: Ext.create('Ext.data.Store', {
        autoLoad: false,
        fields: [
            {name: 'lotNo', type: 'string'}
            , {name: 'Pb', type: 'string'}
            , {name: 'Sb', type: 'string'}
            , {name: 'Cu', type: 'string'}
            , {name: 'Ag', type: 'string'}
            , {name: 'Cd', type: 'string'}
            , {name: 'In', type: 'string'}
            , {name: 'Zn', type: 'string'}
            , {name: 'Bi', type: 'string'}
            , {name: 'As', type: 'string'}
            , {name: 'Al', type: 'string'}
            , {name: 'Fe', type: 'string'}
            , {name: 'Ni', type: 'string'}
            , {name: 'Co', type: 'string'}
            , {name: 'Au', type: 'string'}
            , {name: 'Ge', type: 'string'}
            , {name: 'P', type: 'string'}
            , {name: 'S', type: 'string'}
            , {name: 'Sn', type: 'string'}
        ]
    })
});