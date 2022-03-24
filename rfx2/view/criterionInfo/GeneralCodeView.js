Ext.define('Rfx2.view.criterionInfo.GeneralCodeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'general-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.CodeView'}],
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id_long');
        this.addReadonlyField('create_date');
        
        //검색툴바 생성
         this.addSearchField('system_code');
        this.addSearchField('code_name_kr');
        var searchToolbar =  this.createSearchToolbar();
        

        // 툴바 버튼 옵션 설정
        var removeButtons = ['EXCEL'];
        // var renameButtons = [f{'REGIST': '코드등록'}];
        var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar(toolbarOptions);

        // 툴바 버튼 조회
        // var itemArr = buttonToolbarSub.items.items;
        // for (let index = 0; index < itemArr.length; index++) {
        //     console_logs('==============???index : ', index);
        //     console_logs('==============???howdoudo : ', itemArr[index].iconCls);
        // }
        
        // 서브그리드 명령툴바 기본 버튼 제거
        // 기본 버튼 제거 후 새 버튼 추가 참고 페이지 > 
        //      견적관리(SRO1) : Rfx2.view.company.bioprotech.salesDelivery.RecvPoEsDetailView
        // (buttonToolbarSub.items).each(function (item, index, length) {
        //     switch (index) {
        //         case 0: case 14: case 15:
        //             buttonToolbarSub.items.remove(item);
        //             break;
        //         default:
        //             break;
        //     }
        // });
            
        // 메인 스토어 생성
        this.createStore('Rfx.model.GeneralCode', [
            {
                property: 'system_code',
                direction: 'ASC'
	        }],
            gMain.pageSize/*pageSize*/,
            {},
            ['code']
        );

        // 서브그리드 스토어 생성
        this.generalCodeDetailStore = Ext.create('Mplm.store.GeneralCodeDetailStore', {});
                    
        // 입력, 수정창에 사용할 스토어 생성
        var roleCodeStore = Ext.create('Mplm.store.RoleCodeStore',{});
        Ext.define('Temp.store.useYnStore',{
            extend: 'Ext.data.Store',
            storeId: 'useYnStore',
            fields:[
                "diplay",
                "value"
            ],
            data: [
                {
                    diplay: 'Y',
                    value: 'Y'
                },
                {
                    diplay: 'N',
                    value: 'N'
                }
            ]
        
        });
        var useYnStore = Ext.create('Temp.store.useYnStore', {});
                    
        // /////////////////////////오른쪽 단 버튼
        // 하위 코드 등록 버튼
        this.addChildCodeBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: gm.getMC('CMD_Enrollment', '등록'),
            tooltip: '코드정보 등록',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addChildCodeBtn'),
            handler: function () {
                // 선택한 system_code 정보 가져오기
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                console_logs('코드정보 등록입니다', selections.get('unique_id_long'));
                if (selections.get('state') !== 'A') {
                    console_logs('parent_system_code AKA selected_system_code', selections.get('system_code'));
                    // 추가 제품을 등록하기 위한 parent_system_code
                    var parent_system_code = selections.get('system_code');

                    var childCodeForm = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 340,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: [
                            {
                                fieldLabel: '메뉴그룹',
                                xtype: 'textfield',
                                id: gu.id('parent_system_code'),
                                name: 'parent_system_code',
                                value: parent_system_code,
                                readOnly: true
                            },
                            {
                                fieldLabel: '메뉴코드',
                                xtype: 'textfield',
                                id: gu.id('system_code'),
                                name: 'system_code'
                            },
                            {
                                fieldLabel: '컬럼명',
                                xtype: 'textfield',
                                id: gu.id('code_name_kr'),
                                name: 'code_name_kr'
                            },
                            {
                                fieldLabel: '영문 컬럼명',
                                xtype: 'textfield',
                                id: gu.id('code_name_en'),
                                name: 'code_name_en'
                            },
                            {
                                fieldLabel: '중문 컬럼명',
                                xtype: 'textfield',
                                id: gu.id('code_name_zh'),
                                name: 'code_name_zh'
                            },
                            // {
                            //     fieldLabel: '너비&이동',
                            //     xtype: 'textfield',
                            //     id: gu.id('description'),
                            //     name: 'description'
                            // },
                            {
                                fieldLabel: '순서',
                                id: gu.id('code_order'),
                                name: 'code_order',
                                xtype: 'numberfield'
                            },
                            {
                                fieldLabel: '표시여부',
                                id: gu.id('use_yn'),
                                name: 'use_yn',
                                xtype: 'combo',
                                store: useYnStore,
                                displayField: 'value',
                                valueField: 'value',
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{value}">{value}</div>';
                                    }
                                },
                                listeners: {
                                    // select: function (combo, record) {},                                
                                },
                            },
                            {
                                fieldLabel: '데이터 유형',
                                id: gu.id('role_code'),
                                name: 'role_code',
                                xtype: 'combo',
                                store: roleCodeStore,
                                displayField: 'codeName',
                                valueField: 'systemCode',
                                flex: 1,
                                emptyText: '선택해주세요.',
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">[{system_code}] {codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {},                                
                                },
                            }
                        ],
                    });

                    var win = Ext.create('Ext.Window', {
                        modal: true,
                        title: '하위코드 등록',
                        width: 350,
                        height: 330,
                        plain: true,
                        items: childCodeForm,
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                if (btn == "no") {
                                    win.close();
                                } else {
                                    var form = childCodeForm;
                                    if (form.isValid()) {
                                        var val = form.getValues(false);
                                        // 등록 함수 호출
                                        gm.me().addChildCode(val, win);
                                        // var storeData = gu.getCmp('childCodeGridExtra').getStore();
                                        // var objs = [];
                                        // var obj = {};
                                        // var columns = [];
                                        // for (var j = 0; j < storeData.data.items.length; j++) {
                                        //     var item = storeData.data.items[j];
                                        //     var objv = {};
                                        //     objv['parent_system_code'] = item.get('parent_system_code');
                                        //     objv['system_code'] = item.get('system_code');
                                        //     objv['code_name_kr'] = item.get('code_name_kr');
                                        //     objv['code_order'] = item.get('code_order');
                                        //     objv['use_yn'] = item.get('use_yn');
                                        //     objv['role_code'] = item.get('role_code');
                                        //     columns.push(objv);
                                        // }
                                        // obj['datas'] = columns;
                                        // objs.push(obj);
                                        // var jsonData = Ext.util.JSON.encode(objs);
                                        // form.submit({
                                        //     submitEmptyText: false,
                                        //     url: CONTEXT_PATH + '/admin/codeStructure.do?method=readAmc1',
                                        //     params: {
                                        //         productJsonExtra: jsonData,
                                        //         parent_system_code: parent_system_code
                                        //     },
                                        //     success: function (val, action) {
                                        //         win.setLoading(false);
                                        //         gm.me().store.load();
                                        //         gm.me().estiContentStore.load();
                                        //         win.close();
                                        //     },
                                        //     failure: function () {
                                        //         win.setLoading(false);
                                        //         extjsUtil.failureMessage();
                                        //     }
                                        // });
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
                } else {
                    Ext.MessageBox.alert('알림', '승인된 상태의 견적서는 수정이 불가합니다.')
                }
            }
        });

        // 하위 코드 수정 버튼
        this.updateChildCodeBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '하위 코드 수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('updateChildCodeBtn'),
            handler: function() {
                // 메인 그리드에서 선택한 system_code 정보 가져오기
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                
                // 서브 그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selectionFromChild = gm.me().gridGeneralCodeChilds.getSelectionModel().getSelection()[0];
                console_logs('코드정보 수정입니다', selectionFromChild.get('role_code'));

                // if (selesctions.length > 0) {
                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 340,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }, defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 100
                        }, items: [
                            {
                                fieldLabel: '메뉴그룹',
                                xtype: 'textfield',
                                id: gu.id('parent_system_code'),
                                name: 'parent_system_code',
                                value: selectionFromChild.get('parent_system_code'),
                                readOnly: true
                            },
                            {
                                fieldLabel: '메뉴코드',
                                xtype: 'textfield',
                                id: gu.id('system_code'),
                                name: 'system_code',
                                value: selectionFromChild.get('system_code'),
                                readOnly: true
                            },
                            {
                                fieldLabel: '컬럼명',
                                xtype: 'textfield',
                                id: gu.id('code_name_kr'),
                                name: 'code_name_kr',
                                value: selectionFromChild.get('code_name_kr'),
                            },
                            {
                                fieldLabel: '영문컬럼명',
                                xtype: 'textfield',
                                id: gu.id('code_name_en'),
                                name: 'code_name_en',
                                value: selectionFromChild.get('code_name_en'),
                            },
                            {
                                fieldLabel: '중문컬럼명',
                                xtype: 'textfield',
                                id: gu.id('code_name_zh'),
                                name: 'code_name_zh',
                                value: selectionFromChild.get('code_name_zh'),
                            },
                            // {
                            //     fieldLabel: '너비&이동',
                            //     xtype: 'textfield',
                            //     id: gu.id('description'),
                            //     name: 'description',
                            //     value: selectionFromChild.get('description'),
                            // },
                            {
                                fieldLabel: '순서',
                                id: gu.id('code_order'),
                                name: 'code_order',
                                xtype: 'numberfield',
                                value: selectionFromChild.get('code_order'),
                            },
                            {
                                fieldLabel: '표시여부',
                                id: gu.id('use_yn'),
                                name: 'use_yn',
                                xtype: 'combo',
                                store: useYnStore,
                                value: selectionFromChild.get('use_yn'),
                                displayField: 'value',
                                valueField: 'value',
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{value}">{value}</div>';
                                    }
                                }
                            },
                            {
                                fieldLabel: '데이터 유형',
                                id: gu.id('role_code'),
                                name: 'role_code',
                                xtype: 'combo',
                                store: roleCodeStore,
                                value: selectionFromChild.get('role_code'),
                                displayField: 'codeName',
                                valueField: 'systemCode',
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">[{system_code}] {codeName}</div>';
                                    }
                                }
                            }
                        ]

                    });

                    roleCodeStore.load();

                    var winPart = Ext.create('Ext.Window', {
                        modal: true,
                        title: '하위코드 수정',
                        width: 350,
                        height: 350,
                        plain: true,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                if (btn == "no") {
                                    winPart.close();
                                } else {
                                    if (form.isValid()) {
                                        winPart.setLoading(true);
                                        var val = form.getValues(false);
                                        var unique_id = selectionFromChild.get('unique_id_long');
                                        console_logs('unique_id_long', unique_id)
                                        // 수정 함수 호출
                                        gm.me().updateChildCode(val, unique_id, winPart);
                                    }
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function (btn) {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show();

                //  }
                 
                    
                
            }
        });

        // 하위 코드 삭제 버튼
        this.deleteChildCodeBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '선택한 하위 코드 삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('deleteChildCodeBtn'),
            handler: function() {
                Ext.MessageBox.show({
                    title: '하위 코드 삭제',
                    msg: '선택한 코드 정보를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {

                            var selectionFromChild = gm.me().gridGeneralCodeChilds.getSelectionModel().getSelection()[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/gencode.do?method=destroy',
                                params:{
                                    unique_id: selectionFromChild.get('unique_id_long')
                                },
                                success : function(result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                    gm.me().generalCodeDetailStore.load();
                                },
                                failure : extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 툴바 버튼 옵션 설정
        // var removeButtons = ['SEARCH', 'EXCEL'];
        // // var renameButtons = [{'REGIST': '코드등록'}];
        // var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};

        // 오른쪽단 그리드
        this.gridGeneralCodeChilds = Ext.create('Ext.grid.Panel', {
        cls: 'rfx-panel',
        id: gu.id('gridGeneralCodeChilds'),
        store: this.generalCodeDetailStore,
        viewConfig: {
            markDirty: false
        },
        collapsible: false,
        multiSelect: false,
        region: 'center',
        autoScroll: true,
        autoHeight: true,
        flex: 0.5,
        frame: true,
        bbar: getPageToolbar(this.generalCodeDetailStore),
        border: true,
        layout: 'fit',
        forceFit: false,
        selModel: Ext.create("Ext.selection.CheckboxModel", {}),
        margin: '0 0 0 0',
        dockedItems: [
            // BaseView 기본 툴바
            // this.createCommandToolbar(toolbarOptions),
            {
                dock: 'top',
                xtype: 'toolbar',
                items: [
                    this.addChildCodeBtn,
                    this.updateChildCodeBtn,
                    this.deleteChildCodeBtn
                ]
            }
        ],
        columns: [
            { text: '메뉴그룹', width: 130, style: 'text-align:center', dataIndex: 'parent_system_code', sortable: false },
            { text: '메뉴코드', width: 130, style: 'text-align:center', dataIndex: 'system_code', sortable: false },
            { text: '컬럼명', width: 130, style: 'text-align:center', dataIndex: 'code_name_kr', sortable: false },
            { text: '영문컬럼명', width: 130, style: 'text-align:center', dataIndex: 'code_name_en', sortable: false },
            { text: '중문컬럼명', width: 130, style: 'text-align:center', dataIndex: 'code_name_zh', sortable: false },
            // { text: '너비&이동', width: 210, style: 'text-align:center', dataIndex: 'description', sortable: false },
            { text: '순서', width: 70, style: 'text-align:center', dataIndex: 'code_order', sortable: false },
            { text: '표시여부', width: 70, style: 'text-align:center', dataIndex: 'use_yn', sortable: false },
            { text: '데이터 유형', width: 100, style: 'text-align:center', dataIndex: 'role_code', sortable: false },
        ],
        title: '하위 코드 목록',
        name: 'po',
        autoScroll: true
        });
        this.gridGeneralCodeChilds.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    console_logs('----------selection : ', selections);
                }
            }
        });

        

        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성
        this.createGrid(arr);    
        this.createCrudTab();
        
        // 오른쪽 단
        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.crudTab, this.gridGeneralCodeChilds
            ]
        });

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [this.grid,  this.crudTab]
        // });
        
        this.callParent(arguments);

        // 그리드 선택 했을 시 콜백
        this.setGridOnCallback(function(selections){
            if (selections.length) {
                // console_logs('??????????????', selections);
                var rec = selections[0];
                // console_logs('selections\' unique_id : ', rec.get('unique_id'));
                this.generalCodeDetailStore.getProxy().setExtraParams(
                        {
                        selected_uid: rec.get('unique_id_long'),
                        parent_system_code: rec.get('system_code'),
                        // system_code: rec.get('system_code')
                        uid: rec.get('unique_id_long'),
                        }
                    );
                // 오른쪽 단 스토어 로드
                this.generalCodeDetailStore.load();
                this.addChildCodeBtn.enable();
                this.deleteChildCodeBtn.disable();
                this.updateChildCodeBtn.disable();
            } else {
                this.addChildCodeBtn.disable();
            }
        })

        // 서브 그리드 선택 시 
        this.gridGeneralCodeChilds.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length > 0) {
                    gm.me().deleteChildCodeBtn.enable();
                    gm.me().updateChildCodeBtn.enable();
                } else {
                    gm.me().deleteChildCodeBtn.disable();
                    gm.me().updateChildCodeBtn.disable();
                }
            }
        })
        
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
        
    },

    // 하위코드 등록 팝업창에서 확인버튼 클릭시 호출되는 함수
    addChildCode: function (val, win) {
        Ext.MessageBox.show({
            title:'등록',
            msg: '제품별 하위 코드를 등록하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    win.setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/gencode.do?method=create',
                        params:{
                            unique_id: -1,
                            parent_system_code: val['parent_system_code'],
                            system_code: val['system_code'],
                            code_name_kr : val['code_name_kr'],
                            code_name_en : val['code_name_en'],
                            code_name_zh : val['code_name_zh'],
                            use_yn : val['use_yn'],
                            code_order : val['code_order'],
                            role_code : val['role_code']
                        },
                        success : function(result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().generalCodeDetailStore.load();
                            if(win) {
                                win.close();
                            }
                        },
                        failure : extjsUtil.failureMessage
                    });//endof ajax request
                } else {
                    if(win) {
                        win.close();
                    }
                }
            },
            icon: Ext.MessageBox.QUESTION
        })


        
        // form.submit({
            //     submitEmptyText: false,
            //     url: CONTEXT_PATH + '/admin/codeStructure.do?method=readAmc1',
            //     params: {
        //         productJsonExtra: jsonData,
        //         parent_system_code: parent_system_code
        //     },
        //     success: function (val, action) {
        //         win.setLoading(false);
        //         gm.me().store.load();
        //         gm.me().estiContentStore.load();
        //         win.close();
        //     },
        //     failure: function () {
            //         win.setLoading(false);
            //         extjsUtil.failureMessage();
            //     }
            // });
            
            
    },
    // 하위코드 수정 팝업창에서 확인버튼 클릭시 호출되는 함수
    updateChildCode: function (val, unique_id, win) {
        console_logs('unique_id from function : ', unique_id);
        Ext.MessageBox.show({
            title:'수정',
            msg: '제품별 하위 코드를 수정하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/gencode.do?method=create',
                        params:{
                            parent_system_code: val['parent_system_code'],
                            system_code: val['system_code'],
                            code_name_kr : val['code_name_kr'],
                            code_name_en : val['code_name_en'],
                            code_name_zh : val['code_name_zh'],
                            description : val['description'],
                            use_yn: val['use_yn'],
                            code_order: val['code_order'],
                            role_code: val['role_code'],
                            unique_id: unique_id
                        },
                        success : function(result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().generalCodeDetailStore.load();
                            if(win) {
                                win.close();
                            }
                        },
                        failure : extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        })
    },

    items : [],

    // tempModel: Ext.define('tempModel', {
    //     extend: 'Ext.data.Model',
    //     fields: [
    //         {name: 'key', type: 'string'},
    //         {name: 'value', type: 'string'}
    //     ]
    // }),

    // useYnStore: Ext.create('Ext.data.Store', {
    //     model: 'tempModel',
    //     data: [
    //         {key: 'Y', value: 'Y'},
    //         {key: 'N', value: 'N'}
    //     ]
    // })

});