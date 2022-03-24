Ext.define('Rfx2.view.company.scon.qualityMgmt.AcceptanceTestingCodeView', {
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
        
        this.addSearchField('item_code');
         this.addSearchField('item_name');
         this.addSearchField('specification');
        var searchToolbar =  this.createSearchToolbar();
        

        // 툴바 버튼 옵션 설정
        var removeButtons = ['EXCEL','REGIST','EDIT','REMOVE','COPY'];
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
        this.createStore('Rfx.model.readSimpleMaterial', [
            {
                property: 'unique_id',
                direction: 'desc'
	        }],
            gMain.pageSize/*pageSize*/,
            {},
            ['srcahd']
        );
        this.store.getProxy().setExtraParam('standard_flag','R');
        this.store.getProxy().setExtraParam('orderBy', 'unique_id');
        this.store.getProxy().setExtraParam('ascDesc', 'desc');
        // 서브그리드 스토어 생성
        this.generalCodeDetailStore = Ext.create('Mplm.store.SpcColumnSearchStore', {});
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
                            labelWidth: 120
                        },
                        items: [ 
                            {
                                fieldLabel: '검사항목',
                                xtype: 'textfield',
                                id: gu.id('legend_code_kr'),
                                name: 'legend_code_kr'
                            },
                            {
                                fieldLabel: '단위',
                                xtype: 'textfield',
                                id: gu.id('unit_name'),
                                name: 'unit_name'
                            },
                            {
                                fieldLabel: '기준치',
                                xtype: 'textfield',
                                id: gu.id('baseline'),
                                name: 'baseline'
                            }
                        ],
                    });

                    var win = Ext.create('Ext.Window', {
                        modal: true,
                        title: '등록',
                        width: 350,
                        height: 200,
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
                            labelWidth: 120
                        }, items: [
                            
                            {
                                fieldLabel: '검사항목',
                                xtype: 'textfield',
                                id: gu.id('legend_code_kr'),
                                name: 'legend_code_kr',
                                value: selectionFromChild.get('legend_code_kr')
                            },
                            {
                                fieldLabel: '단위',
                                xtype: 'textfield',
                                id: gu.id('unit_name'),
                                name: 'unit_name',
                                value: selectionFromChild.get('unit_name')
                            },
                            {
                                fieldLabel: '기준치',
                                xtype: 'textfield',
                                id: gu.id('baseline'),
                                name: 'baseline',
                                value: selectionFromChild.get('baseline')
                            }
                        ]

                    });

                    roleCodeStore.load();

                    var winPart = Ext.create('Ext.Window', {
                        modal: true,
                        title: '하위코드 수정',
                        width: 350,
                        height: 200,
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
                                        console_logs('unique_id', unique_id)
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
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroy',
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
            //{ text: 'parent_system_code', width: 130, style: 'text-align:center', dataIndex: 'parent_system_code', sortable: false },
            { text: '검사항목', width: 130, style: 'text-align:center', dataIndex: 'legend_code_kr', sortable: false },
            { text: '단위', width: 130, style: 'text-align:center', dataIndex: 'unit_name', sortable: false },
            { text: '기준치', width: 130, style: 'text-align:center', dataIndex: 'baseline', sortable: false },
            
        ],
        title: '분류 목록',
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
                        srcahd_uid: rec.get('unique_id_long'),

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
            msg: '품목별 관리선설정을 등록하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    win.setLoading(true);
                    var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcColumnNMgmt',
                        params:{
                            legend_code_kr : val['legend_code_kr'],
                            unit_name : val['unit_name'],
                            baseline : val['baseline'],
                            srcahd_uid : selections.get('unique_id_long')
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
                        url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcColumnNMgmt',
                        params:{
                            legend_code_kr : val['legend_code_kr'],
                            unit_name : val['unit_name'],
                            baseline : val['baseline'],
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