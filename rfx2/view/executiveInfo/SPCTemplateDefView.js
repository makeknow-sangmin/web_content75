Ext.define('Rfx2.view.executiveInfo.SPCTemplateDefView', {
    extend: 'Rfx2.base.BaseView',
    xType: 'spc-template-def-view',
    temper : 1,
    initComponent: function () {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.SPCTemplateDef', [{
                property: 'unique_id',
                direction: 'ASC'
            }],
            1000000
            ,{}
            , ['docutpl']
        );

        this.initSearchField();

        // this.addSearchField (
        // this.addSearchField (
        //     {
        //         type: 'combo'
        //         ,field_id: 'sbType'
        //         ,store: 'SbInTypeStore'
        //         ,displayField: 'name'
        //         ,emptyText: '유형'
        //         ,valueField: 'code'
        //         ,innerTpl	: '<div data-qtip="{code}">{name}</div>'
        //     });

        this.gridContent2 = Ext.create('Ext.panel.Panel', {
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
            items: [/*this.createMsTab('SIZE', 'SI'), */this.createMsTab('SIZE', 'SI')]
        });

        this.docuTplStore = Ext.create('Mplm.store.DocuTplStore', {});

        this.gridContent3 = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContent3'),
            store: this.docuTplStore,
            //bbar: getPageToolbar(this.docuTplStore),
            collapsible: false,
            //region: 'east',
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            //border: true,
            layout: 'fit',
            //forceFit: true,
            title: '상세 정보',
            flex: 2,
            columns: [],
            items: []
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
            items: [/*tabFileUpload, */this.gridContent2]
        };

        this.panelDataUpload2 = {
            //title: '데이터업로드2',
            collapsible: false,
            //frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1.5,
            items: [this.gridContent3]
        };

        this.addTemplateButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
                gm.me().addUserView();
            }
        });

        this.modifyTemplateButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().modifyUserView();
            }
        });

        this.storeSpcProduct = Ext.create('Mplm.store.SpcProductListStore', {});

        this.gridSpcProduct = Ext.create('Ext.grid.Panel', {
            //title: '분석표 목록',
            store: this.storeSpcProduct,
            cls : 'rfx-panel',
            //region:'west',
            //collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            //width: 300,
            border: true,
            //bbar: getPageToolbar(storeViewTable),
            //frame: true,
            padding: '0 0 0 0',
            flex: 1,
            layout          :'fit',
            forceFit: true,
            columns: [{
                text: '품목',
                flex: 1,
                dataIndex: 'item_name'
            }]
        });

        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar = this.createSearchToolbar();
        var arr = [];

        (buttonToolbar.items).each(function(item, index){
            if(index==1||index==3||index==2) {
                buttonToolbar.items.remove(item);
            }
        });

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(arr);

        buttonToolbar.insert(1, this.modifyTemplateButton);
        buttonToolbar.insert(1, this.addTemplateButton);

        //this.grid.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [
                this.grid,
                {
                    title: '템플릿 품목 리스트',
                    collapsible: true,
                    frame: true,
                    region: 'east',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '0 0 0 0',
                    width: 750,
                    items: [
                        this.gridSpcProduct]
                },
                ]
        });

        this.storeLoad(function(records) {

        });

        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {

                if(selections.length > 0) {
                    var rec = selections[0];
                    gm.me().storeSpcProduct.getProxy().setExtraParam("group_uid", rec.get('unique_id_long'));
                    gm.me().storeSpcProduct.load();
                }

                if(selections.length == 1) {
                    gm.me().modifyTemplateButton.enable();
                } else {
                    gm.me().modifyTemplateButton.disable();
                }
            }
        });
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
        fd.append('measure_type', gu.getCmp('measureType').lastValue.radio1);
        fd.append('product_type', 'SB');

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
            }

            gm.me().storeLoad();
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
                                                gm.me().postDocument(CONTEXT_PATH + '/xdview/spcMgmt.do?method=uploadCustomerSPCTemplate&file_itemcode=' + gUtil.RandomString(10),
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
    fields: [],

    addUserView: function() {

        var combstStore = Ext.create('Mplm.store.CombstStore', {});

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
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
                labelWidth: 100,
                margins: 10,
            },
            items: [
                {
                    id: gu.id('information'),
                    fieldLabel: '고객사',
                    field_id: 'company_name',
                    name: 'company_name',
                    xtype: 'combo',
                    emptyText: '업체코드로 검색',
                    store: combstStore,
                    displayField: 'wa_name',
                    valueField: 'unqiue_id',
                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                    sortInfo: {
                        field: 'company_name',
                        direction: 'ASC'
                    },
                    minChars: 1,
                    typeAhead: false,
                    hideLabel: false,
                    hideTrigger: true,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 결과가 없습니다.',
                        // Custom rendering template for each item
                        getInnerTpl: function () {
                            return '<div data-qtip="{company_name}">[{company_name}]{wa_name}</div>';
                        }
                    },
                    pageSize: 10,
                    listeners: {
                        select: function(combo, record) {
                            gu.getCmp('combst_uid').setValue(record.get('unique_id_long'));
                        }
                    }
                },
                // {
                //     fieldLabel: '고객사',
                //     xtype: 'textfield',
                //     name: 'company_name'
                // },
                {
                    fieldLabel: 'SPC 템플릿명',
                    xtype: 'textfield',
                    name: 'temp_name'
                },
                {
                    fieldLabel: '템플릿 파일',
                    xtype: 'filefield',
                    name: 'file_test'
                },
                {
                    xtype: 'hiddenfield',
                    id: gu.id('combst_uid'),
                    name : 'combst_uid',
                    value : 0
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 350,
            height: 170,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    if(btn == 'no') {
                        prWin.close();
                    } else {
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val', val);

                            form.submit({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=uploadSpcTemplate&table_name=docutpl&file_itemcode=' + gUtil.RandomString(10),
                                params: {
                                    docu_type : 'multi',
                                    product_type : 'B/W',
                                    temp_type : 'BW',
                                    docu_auth : '*',
                                    class_code : 'Q1SPC'
                                },
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function() {
                    if(prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    modifyUserView: function() {

        var combst = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
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
                labelWidth: 100,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '고객사',
                    xtype: 'textfield',
                    editable: false,
                    name: 'wa_name',
                    value: combst.get('wa_name')
                },
                {
                    fieldLabel: 'SPC 템플릿명',
                    xtype: 'textfield',
                    name: 'temp_name',
                    value: combst.get('temp_name')
                },
                {
                    fieldLabel: '템플릿 파일',
                    xtype: 'filefield',
                    name: 'file_test'
                },
                {
                    xtype: 'hiddenfield',
                    id: gu.id('combst_uid'),
                    name : 'combst_uid',
                    value : 0
                },
                {
                    xtype: 'hiddenfield',
                    name: 'docutpl_uid',
                    value: combst.get('unique_id_long')
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 350,
            height: 170,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    if(btn == 'no') {
                        prWin.close();
                    } else {
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val', val);

                            form.submit({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=uploadSpcTemplate&table_name=docutpl&file_itemcode=' + gUtil.RandomString(10),
                                params: {
                                    docu_type : 'multi',
                                    product_type : 'B/W',
                                    temp_type : 'BW',
                                    docu_auth : '*',
                                    class_code : 'Q1SPC'
                                },
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: extjsUtil.failureMessage
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function() {
                    if(prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },
});
