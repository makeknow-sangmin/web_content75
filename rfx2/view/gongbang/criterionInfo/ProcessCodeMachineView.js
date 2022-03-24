Ext.define('Rfx2.view.gongbang.criterionInfo.ProcessCodeMachineView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'processCode-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.orderbyAutoTable = true;
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('parent_code');
        this.addSearchField('code_name_kr');
        //검색툴바 생성
        this.setDefValue('use_yn', 'Y');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addReadonlyField('creator');
        this.addReadonlyField('creator_uid');
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'EDIT', 'COPY', 'REMOVE'
            ],
        });
        var searchToolbar = this.createSearchToolbar();

        this.setGridOnCallback(function (selections) {
            this.copyCallback();
            // var processGrid = Ext.getCmp('ProcessCodeSubGrid');
            //var mainmenu = Ext.getCmp( 'PcsStdTempleteView' + '-mainmenu' );
            if (selections.length) {
                var rec = selections[0];
                console_logs('===== pcs_code', rec.get('pcs_code'));
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id'); //pcstpl의 unique_id
                gMain.selPanel.vSELECTED_PARENT_CODE = rec.get('pcs_code'); //pcstple의 모자재코드
                gMain.selPanel.vSELECTED_PCS_LEVEL = rec.get('pcs_level') + 1

                this.editHeaderAction.enable();
                this.removeHeaderAction.enable();
                gm.me().createAddChildProcessAction.enable();
                gu.getCmp('selectedMtrl').setHtml('[' + gMain.selPanel.vSELECTED_PARENT_CODE + '] ' + rec.get('pcs_name'));
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID * (-100);
                this.editHeaderAction.disable();
                this.removeHeaderAction.disable();
                this.createAddChildProcessAction.disable();
            }
            this.lineDetailStore.getProxy().setExtraParam('parent_code', gMain.selPanel.vSELECTED_PARENT_CODE);
            this.lineDetailStore.getProxy().setExtraParam('pcs_level', gMain.selPanel.vSELECTED_PCS_LEVEL);
            this.lineDetailStore.load();
        });

        this.createStore('Rfx.model.ProcessCodeSub', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            , {}

            , ['pcstpl']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        this.lineDetailStore = Ext.create('Rfx2.store.company.bioprotech.LineDesignStore', {});

        this.createAddChildProcessAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: '공정추가',
            tooltip: '소공정 추가',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                gm.me().addChildProcess(rec);
            }
        });

        this.modifyChildProcessAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '공정수정',
            tooltip: '소공정 수정',
            disabled: true,
            handler: function () {
                var grid = gm.me().grid.getSelectionModel().getSelection();
                var rec = grid[0];
                var pr_code = rec.get('pcs_code');
                var parent_code = rec.get('parent_code');
                console_logs('pcs_code >>>>', pr_code);
                var selection = gm.me().gridPcsstd.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('rec >>>>> ', rec);
                gm.me().editChildProcess(rec, pr_code, parent_code);
            }
        });

        this.removeChildProcessAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '공정삭제',
            tooltip: '소공정 삭제',
            disabled: true,
            handler: function () {
                var selection = gm.me().gridPcsstd.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('rec >>>>> ', rec);
                var unique_id = rec.get('unique_id_long');
                gm.me().removeHeaderProcess(unique_id);
            }
        });


        this.gridPcsstd = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('ProcessCodeSubGrid'),
            store: this.lineDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'east',
            autoScroll: true,
            autoHeight: true,
            width: '50%',
            frame: true,
            // bbar: getPageToolbar(this.lineDetailStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedMtrl'),
                            html: "설계할 대공정을 선택하십시오.",
                            width: 700,
                            style: 'color:yelllow;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.createAddChildProcessAction,
                        this.modifyChildProcessAction,
                        this.removeChildProcessAction
                    ]
                }
            ],
            columns: [
                {text: '순서', style: 'text-align:center', width: '5%', dataIndex: 'code_order', sortable: false},
                {text: '공정코드', style: 'text-align:center', width: '20%', dataIndex: 'pcs_code', sortable: false},
                {text: '공정명', style: 'text-align:center', width: '20%', dataIndex: 'pcs_name', sortable: false},
                // { text: '설비명', style: 'text-align:center', dataIndex: 'name_ko', sortable: false },
                // { text: '표준 CAPA', style: 'text-align:center', dataIndex: 'plan_qty', sortable: false, align: 'right' },
                // { text: '표준단가', style: 'text-align:center', dataIndex: 'process_price', sortable: false, align: 'right' },

                {text: '자원유형', style: 'text-align:center', width: '20%', dataIndex: 'pcs_name', sortable: false},
                {text: '자원', style: 'text-align:center', width: '20%', dataIndex: 'pcs_name', sortable: false},
                // { text: '설명', style: 'text-align:center', dataIndex: 'description', sortable: false }
            ],
            title: '공정설계',
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    var tableName = 'assymap';
                    console_logs('e.record >>>>>>> ', e.record);
                    var unique_id = e.record.get('assymap_uid');
                    var ac_uid = e.record.get('ac_uid');
                    // var unique_id = e.record.getId();
                    var value = e.value;
                    if (columnName === 'payment_condition') {
                        columnName = 'reserved3';
                    }
                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().poPrdDetailStore.load();
                    var store = gm.me().poPrdDetailStore;
                    var item = store.data.items;
                    console_logs('item >>>>', item);
                    var pj_total_price = 0.0;
                    for (var i = 0; i < item.length; i++) {
                        var item_desc = item[i];
                        var bm_quan = item_desc.get('bm_quan');
                        var sales_price = item_desc.get('sales_price');
                        pj_total_price = Number(pj_total_price) + (Number(bm_quan) * Number(sales_price));
                    }
                    gm.me().editAssytopPrice(pj_total_price, ac_uid);
                    gm.me().store.load();
                }
            }
        });

        this.gridPcsstd.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length) {
                    gm.me().modifyChildProcessAction.enable();
                    gm.me().removeChildProcessAction.enable();
                } else {
                    gm.me().modifyChildProcessAction.disable();
                    gm.me().removeChildProcessAction.disable();
                }

            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.gridPcsstd]
        });

        var savePcsStep = Ext.create('Ext.Action', {
            iconCls: 'fa-save_14_0_5395c4_none',
            text: '공정저장',
            tooltip: '공정설계 내용 저장',
            //toggleGroup: 'toolbarcmd',
            handler: this.savePcsstdHandler
        });

        this.createAddHeaderAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '추가',
            disabled: true, // 강제
            tooltip: '대공정 추가',
            handler: function () {
                gm.me().addHeaderProcess();
            }
        });

        this.editHeaderAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '대공정 수정',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                console_logs('>>>>>> REC', rec);
                gm.me().editHeaderProcess(rec);
            }
        });

        this.removeHeaderAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '대공정 삭제',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var unique_id = rec.get('unique_id');
                gm.me().removeHeaderProcess(unique_id);
            }
        });

        //buttonToolbar.insert(1, this.createAddHeaderAction);	//안정화 되면 해제
        buttonToolbar.insert(/*3*/1, this.removeHeaderAction);
        buttonToolbar.insert(/*2*/1, this.editHeaderAction);

        //공정설계 gridPcsTpl Tab 추가.
        gMain.addTabGridPanel('공정설계', 'AMC6_SUB', {
                pageSize: 100,
                model: 'Rfx.model.ProcessCodeSub2',
                dockedItems: [

                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default4',
                        items: []
                    }, {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '-',
                            savePcsStep
                            ,
                        ]
                    }
                ],
                sorters: [{
                    property: 'serial_no',
                    direction: 'ASC'
                }]
            }, function (selections) {
                if (selections.length) {
                    var rec = selections[0];
                    //console_logs(rec);
                    gMain.selPanel.selectPcsRecord = rec;
                } else {

                }
            },
            'ProcessCodeSubGrid'//toolbar
        );

        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items: [],
    savePcsstdHandler: function () {
        var gridPcsTpl = Ext.getCmp('ProcessCodeSubGrid');
        var modifiend = [];

        var items = gridPcsTpl.store.data.items;
        for (var i = 0; i < items.length; i++) {
            var rec = items[i];
            console_logs('======rec', rec);

            var unique_id = rec.get('unique_id'); // pcstpl_uid
            var pcs_code = rec.get('pcs_code'); // 공정코드
            var pcs_type = rec.get('pcs_type'); // 템플릿 유형
            var is_replace = rec.get('is_replace'); //is_replace
            var pcs_name = rec.get('pcs_name'); // 공정명
            var std_mh = rec.get('std_mh'); // 표준 시간
            var plan_qty = rec.get('plan_qty'); // 기본수량
            var process_price = rec.get('process_price'); // 표준단가
            var price_type = rec.get('price_type'); // 단가유형
            var sub_qty = rec.get('sub_qty'); // 서브공정 개수
            var prev_stock_reduce = rec.get('prev_stock_reduce'); // 전공정 재고 삭감여부
            var description = rec.get('description'); // 설명
            var comment = rec.get('comment'); // 설명2
            var pcs_level = rec.get('pcs_level') // pcs_level
            var parent_code = rec.get('parent_code') // parent_code
            var owner_uid = rec.get('owner_uid') // owner_uid
            var uid_comast = rec.get('uid_comast') // uid_comast
            var serial_no = rec.get('serial_no'); // serial_no

            if (plan_qty == 0) {
                plan_qty = 1;
            }

            if (pcs_code != null || pcs_code != undefined || pcs_code != '') {
                var obj = {};

                obj['unique_id'] = unique_id;
                obj['pcs_code'] = pcs_code;
                obj['pcs_type'] = pcs_type;
                obj['is_replace'] = is_replace;

                obj['pcs_name'] = pcs_name;
                obj['std_mh'] = std_mh;
                obj['plan_qty'] = plan_qty;
                obj['process_price'] = process_price;

                obj['price_type'] = price_type;
                obj['sub_qty'] = sub_qty;
                obj['prev_stock_reduce'] = prev_stock_reduce;

                obj['description'] = description;
                obj['comment'] = comment;
                obj['serial_no'] = serial_no;

                obj['uid_comast'] = uid_comast;
                obj['owner_uid'] = owner_uid;
                obj['parent_code'] = parent_code;

                obj['pcs_level'] = pcs_level;

                modifiend.push(obj);
            }
        }

        console_logs('=====z', modifiend);

        if (modifiend.length > 0) {

            console_log(modifiend);
            var str = Ext.encode(modifiend);
            console_log(str);
            console_log('modify>>>>>>>>');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/pcstpl.do?method=modifyTplList',
                params: {
                    modifiend: str
                },
                success: function (result, request) {
                    gridPcsTpl.store.load(function () {

                    });
                }
            });
        }
    },

    addHeaderProcess: function () {
        gm.me().headerCodeStore.getProxy().setExtraParam('identification_code', 'PRD_CLS_CODE');
        gm.me().headerCodeStore.getProxy().setExtraParam('level1', 2);
        gm.me().headerCodeStore.load();

        // gm.me().templateCodeStore.getProxy().setExtraParam('parentCode', 'Pcs Type');
        gm.me().templateCodeStore.load();

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
                    title: '대공정 정보추가',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정그룹',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: false,
                            store: gm.me().headerCodeStore,
                            width: '99%',
                            emptyText: '선택해주세요.',
                            name: 'parent_code',
                            displayField: 'class_code',
                            valueField: 'class_code',
                            sortInfo: {field: 'class_code', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{class_code}] {class_name}</div>';
                                }
                            },
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>라인코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'pcs_code'
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>탬플릿유형',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'pcs_type',
                            store: gm.me().templateCodeStore,
                            emptyText: '선택해주세요.',
                            displayField: 'system_code',
                            valueField: 'system_code',
                            sortInfo: {field: 'system_code', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{system_code}</div>';
                                }
                            },
                        },
                        {
                            fieldLabel: 'Site',
                            xtype: 'combo',
                            anchor: '100%',
                            store: gm.me().comcstStore,
                            allowBlank: true,
                            width: '99%',
                            name: 'description',
                            emptyText: '선택해주세요.',
                            displayField: 'division_name',
                            valueField: 'division_name',
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{division_name}</div>';
                                }
                            },
                        },
                        // {
                        // 	fieldLabel: '라인약호',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	store: gm.me().lineAbbStore,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'comment',
                        // 	emptyText: '선택해주세요.',
                        // 	displayField: 'system_code',
                        // 	valueField: 'system_code',
                        // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{system_code}</div>';
                        // 		}
                        // 	},
                        // },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'pcs_name',
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정레벨',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            value: 0,
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            editable: false,
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            name: 'pcs_level',
                        },
                        {
                            // 	fieldLabel: '기본수량',
                            // 	xtype: 'numberfield',
                            // 	anchor: '100%',
                            // 	allowBlank: true,
                            // 	width: '99%',
                            // 	name: 'plan_qty',
                            // },
                            // {
                            // 	fieldLabel: '표준단가',
                            // 	xtype: 'numberfield',
                            // 	anchor: '100%',
                            // 	allowBlank: true,
                            // 	width: '99%',
                            // 	name: 'process_price',
                            // },
                            // {
                            // 	fieldLabel: '표준시간',
                            // 	xtype: 'numberfield',
                            // 	anchor: '100%',
                            // 	allowBlank: true,
                            // 	width: '99%',
                            // 	name: 'std_mh',
                            // }, {
                            // 	fieldLabel: '단가유형',
                            // 	xtype: 'textfield',
                            // 	anchor: '100%',
                            // 	allowBlank: true,
                            // 	width: '99%',
                            // 	valueField: 'unique_id',
                            // 	displayField: 'user_name',
                            // 	name: 'price_type'
                            // }, {
                            // 	fieldLabel: '서브공정개수',
                            // 	xtype: 'numberfield',
                            // 	anchor: '100%',
                            // 	allowBlank: true,
                            // 	width: '99%',
                            // 	name: 'sub_qty',
                            // },
                            // {
                            // 	fieldLabel: '전공정 삭감여부',
                            // 	xtype: 'combo',
                            // 	anchor: '100%',
                            // 	allowBlank: true,
                            // 	width: '99%',
                            // 	store: gm.me().ynFlagStore,
                            // 	emptyText: '선택해주세요.',
                            // 	displayField: 'system_code',
                            // 	valueField: 'system_code',
                            // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                            // 	typeAhead: false,
                            // 	minChars: 1,
                            // 	listConfig: {
                            // 		loadingText: 'Searching...',
                            // 		emptyText: 'No matching posts found.',
                            // 		getInnerTpl: function () {
                            // 			return '<div data-qtip="{unique_id}">{system_code}</div>';
                            // 		}
                            // 	},
                            // 	name: 'prev_stock_reduce',

                        }
                    ]
                },
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '추가',
            width: 600,
            height: 490,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/production/schdule.do?method=addHeaderPrdProcess',
                                    waitMsg: '저장중입니다.',
                                    // params: {
                                    // 	jsonData: jsonData
                                    // },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 입력 항목값이 입력되지 않았습니다.');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
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

    editHeaderProcess: function (rec) {
        gm.me().headerCodeStore.getProxy().setExtraParam('identification_code', 'PRD_CLS_CODE');
        gm.me().headerCodeStore.getProxy().setExtraParam('level1', 2);
        gm.me().headerCodeStore.load();

        // gm.me().templateCodeStore.getProxy().setExtraParam('parentCode', 'Pcs Type');
        gm.me().templateCodeStore.load();

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
                    title: '대공정 정보수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>모공정코드',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: false,
                            store: gm.me().headerCodeStore,
                            width: '99%',
                            emptyText: '선택해주세요.',
                            name: 'parent_code',
                            value: rec.get('parent_code'),
                            displayField: 'class_code',
                            valueField: 'class_code',
                            sortInfo: {field: 'class_code', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{class_code}</div>';
                                }
                            },
                        }, {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>라인코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            value: rec.get('pcs_code'),
                            allowBlank: false,
                            width: '99%',
                            name: 'pcs_code'
                        },
                        // {
                        // 	fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>탬플릿유형',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	allowBlank: false,
                        // 	width: '99%',
                        // 	name: 'pcs_type',
                        // 	store: gm.me().templateCodeStore,
                        // 	emptyText: '선택해주세요.',
                        // 	value: rec.get('pcs_type'),
                        // 	displayField: 'system_code',
                        // 	valueField: 'system_code',
                        // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{system_code}</div>';
                        // 		}
                        // 	},
                        // },
                        {
                            fieldLabel: 'Site',
                            xtype: 'combo',
                            anchor: '100%',
                            store: gm.me().comcstStore,
                            allowBlank: true,
                            width: '99%',
                            name: 'description',
                            emptyText: '선택해주세요.',
                            displayField: 'division_name',
                            valueField: 'division_name',
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{division_name}</div>';
                                }
                            },
                            value: rec.get('description'),
                        },
                        // {
                        // 	fieldLabel: '라인약호',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	store: gm.me().lineAbbStore,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'comment',
                        // 	emptyText: '선택해주세요.',
                        // 	displayField: 'system_code',
                        // 	valueField: 'system_code',
                        // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{system_code}</div>';
                        // 		}
                        // 	},
                        // 	value: rec.get('comment'),
                        // },

                        // {
                        // 	fieldLabel: 'is_replace',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	store: gm.me().ynFlagStore,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'is_replace',
                        // 	value: rec.get('is_replace'),
                        // 	emptyText: '선택해주세요.',
                        // 	displayField: 'system_code',
                        // 	valueField: 'system_code',
                        // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{system_code}</div>';
                        // 		}
                        // 	},
                        // },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            value: rec.get('pcs_name'),
                            name: 'pcs_name',
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정레벨',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            value: 0,
                            value: rec.get('pcs_level'),
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            editable: false,
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            name: 'pcs_level',
                        },
                        // {
                        // 	fieldLabel: '기본수량',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value: rec.get('plan_qty'),
                        // 	name: 'plan_qty',
                        // },
                        // {
                        // 	fieldLabel: '표준단가',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value: rec.get('process_price'),
                        // 	name: 'process_price',
                        // },
                        // {
                        // 	fieldLabel: '표준시간',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value: rec.get('std_mh'),
                        // 	name: 'std_mh',
                        // },
                        // {
                        // 	fieldLabel: '단가유형',
                        // 	xtype: 'textfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value: rec.get('price_type'),
                        // 	valueField: 'unique_id',
                        // 	displayField: 'user_name',
                        // 	name: 'price_type'
                        // },
                        // {
                        // 	fieldLabel: '서브공정개수',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value: rec.get('sub_qty'),
                        // 	name: 'sub_qty',
                        // },
                        // {
                        // 	fieldLabel: '전공정 삭감여부',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value: rec.get('prev_stock_reduce'),
                        // 	store: gm.me().ynFlagStore,
                        // 	emptyText: '선택해주세요.',
                        // 	displayField: 'system_code',
                        // 	valueField: 'system_code',
                        // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{system_code}</div>';
                        // 		}
                        // 	},
                        // 	name: 'prev_stock_reduce',

                        // },

                    ]
                },
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 600,
            height: 300,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/production/schdule.do?method=editHeaderPrdProcess',
                                    waitMsg: '수정중입니다.',
                                    params: {
                                        unique_id: rec.get('unique_id_long')
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 입력 항목값이 입력되지 않았습니다.');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
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

    removeHeaderProcess: function (unique_id) {
        Ext.MessageBox.show({
            title: '삭제',
            msg: '선택 건을 삭제하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=removeHeaderPrdProcess',
                        params: {
                            unique_id: unique_id
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '삭제 되었습니다.');
                            gm.me().store.load();
                            gm.me().lineDetailStore.load();
                            gm.me().templateCodeStore.removeAll();
                            gm.me().editHeaderAction.disable();
                            gm.me().removeHeaderAction.disable();

                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },


    addChildProcess: function (rec) {
        gm.me().processCodeStore.load();
        gm.me().templateCodeStore.load();
        gm.me().machineStore.getProxy().setExtraParam('pcs_code', rec.get('parent_code'));
        gm.me().machineStore.load();

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
                    title: '소공정 정보추가',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>모 공정코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            editable: false,
                            name: 'parent_code',
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            value: rec.get('pcs_code')
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'pcs_code',
                            // store: gm.me().processCodeStore,
                            // displayField: 'system_code',
                            // valueField: 'system_code',
                            // sortInfo: { field: 'system_code', direction: 'ASC' },
                            // typeAhead: false,
                            // minChars: 1,
                            // listConfig: {
                            // 	loadingText: 'Searching...',
                            // 	emptyText: 'No matching posts found.',
                            // 	getInnerTpl: function () {
                            // 		return '<div data-qtip="{unique_id}">[{system_code}]{code_name_kr}</div>';
                            // 	}
                            // },
                            // listeners: {
                            // 	select: function (combo, record) {
                            // 		gu.getCmp('pcsName').setValue(record.get('code_name_kr'));
                            // 	}
                            // }
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정명',
                            xtype: 'textfield',
                            id: gu.id('pcsName'),
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            editable: true,
                            // fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            name: 'pcs_name',
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정레벨',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            value: 1,
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            editable: false,
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            name: 'pcs_level',
                        },
                        // {
                        // 	fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>CAPA',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank : false,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'plan_qty',
                        // },
                        // {
                        // 	fieldLabel: '표준단가',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'process_price',
                        // },
                        // {
                        // 	fieldLabel: '설비',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	store: gm.me().machineStore,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'owner_uid',
                        // 	emptyText: '선택해주세요.',
                        // 	displayField: 'name_ko',
                        // 	valueField: 'unique_id_long',
                        // 	sortInfo: { field: 'system_code', direction: 'ASC' },
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{name_ko}</div>';
                        // 		}
                        // 	},
                        // 	listeners: {
                        // 		select: function (combo, record) {
                        // 			console_logs('설비UID', record.get('unique_id_long'))
                        // 			// gu.getCmp('pcsName').setValue(record.get('name_kr'));
                        // 		}
                        // 	}
                        // },
                        // {
                        // 	fieldLabel: '설명',
                        // 	xtype: 'textfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'description',
                        // }
                    ]
                },
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '추가',
            width: 600,
            height: 250,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/production/schdule.do?method=addChildPrdProcess',
                                    waitMsg: '저장중입니다.',
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                        gm.me().store.load();
                                        gm.me().lineDetailStore.load();
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 입력 항목값이 입력되지 않았습니다.');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
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


    editChildProcess: function (rec, pr_code, parent_code) {
        gm.me().processCodeStore.load();
        gm.me().templateCodeStore.load();
        gm.me().machineStore.getProxy().setExtraParam('pcs_code', parent_code);
        gm.me().machineStore.load();

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
                    title: '소공정 정보수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>순서',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            editable: true,
                            name: 'code_order',
                            value: rec.get('code_order'),
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>모 공정코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            editable: false,
                            name: 'parent_code',
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            value: pr_code
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'pcs_code',
                            store: gm.me().processCodeStore,
                            value: rec.get('pcs_code'),
                            displayField: 'system_code',
                            valueField: 'system_code',
                            sortInfo: {field: 'system_code', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            // listConfig: {
                            // 	loadingText: 'Searching...',
                            // 	emptyText: 'No matching posts found.',
                            // 	getInnerTpl: function () {
                            // 		return '<div data-qtip="{unique_id}">[{system_code}]{code_name_kr}</div>';
                            // 	}
                            // },
                            // listeners: {
                            // 	select: function (combo, record) {
                            // 		gu.getCmp('pcsNameEdit').setValue(record.get('code_name_kr'));
                            // 	}
                            // }
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정명',
                            xtype: 'textfield',
                            id: gu.id('pcsNameEdit'),
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            value: rec.get('pcs_name'),
                            editable: true,
                            // fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            name: 'pcs_name',
                        },
                        {
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>공정레벨',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            value: 1,
                            value: rec.get('pcs_level'),
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                            editable: false,
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            name: 'pcs_level',
                        },
                        // {
                        // 	fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>CAPA',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank : false,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value : rec.get('plan_qty'),
                        // 	name: 'plan_qty',
                        // },
                        // {
                        // 	fieldLabel: '표준단가',
                        // 	xtype: 'numberfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	value : rec.get('process_price'),
                        // 	name: 'process_price',
                        // },
                        // {
                        // 	fieldLabel: '설비',
                        // 	xtype: 'combo',
                        // 	anchor: '100%',
                        // 	store: gm.me().machineStore,
                        // 	allowBlank: true,
                        // 	width: '99%',
                        // 	name: 'owner_uid',
                        // 	emptyText: '선택해주세요.',
                        // 	displayField: 'name_ko',
                        // 	value : rec.get('owner_uid'),
                        // 	valueField: 'unique_id_long',
                        // 	typeAhead: false,
                        // 	minChars: 1,
                        // 	listConfig: {
                        // 		loadingText: 'Searching...',
                        // 		emptyText: 'No matching posts found.',
                        // 		getInnerTpl: function () {
                        // 			return '<div data-qtip="{unique_id}">{name_ko}</div>';
                        // 		}
                        // 	},
                        // 	listeners: {
                        // 		select: function (combo, record) {
                        // 			console_logs('설비UID', record.get('unique_id_long'))
                        // 		}
                        // 	}
                        // },
                        // {
                        // 	fieldLabel: '설명',
                        // 	xtype: 'textfield',
                        // 	anchor: '100%',
                        // 	allowBlank: true,
                        // 	value : rec.get('description'),
                        // 	width: '99%',
                        // 	name: 'description',
                        // }
                    ]
                },
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 600,
            height: 300,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/production/schdule.do?method=editChildPrdProcess',
                                    waitMsg: '저장중입니다.',
                                    params: {
                                        unique_id: rec.get('unique_id_long')
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                        gm.me().store.load();
                                        gm.me().lineDetailStore.load();
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 입력 항목값이 입력되지 않았습니다.');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
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
    templateCodeStore: Ext.create('Mplm.store.TemplateCodeStore'),
    ynFlagStore: Ext.create('Mplm.store.YnFlagStore'),
    lineAbbStore: Ext.create('Mplm.store.LineAbbStore'),
    processCodeStore: Ext.create('Mplm.store.ProcessCodeStore'),
    machineStore: Ext.create('Mplm.store.MachineTypeStore'),
    headerCodeStore: Ext.create('Mplm.store.HeaderProcessCodeStore', {identification_code: 'PRD_CLS_CODE', level1: 2}),
    comcstStore: Ext.create('Mplm.store.ComCstStore', {pageSize: 2000}),

    useValueCopyCombo: false, //값복사 사용
    useDivisionCombo: false,  //사업부 콤보 시용
    selectedSortComboCount: 0, //정렬 콤보 갯수
});
