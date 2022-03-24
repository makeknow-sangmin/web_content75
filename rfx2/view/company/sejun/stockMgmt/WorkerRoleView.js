Ext.define('Rfx2.view.company.sejun.stockMgmt.WorkerRoleView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'defectiveCode-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('system_code');
        this.addSearchField('code_name_kr');
        //if (this.useCodeZh()) this.addSearchField('code_name_zh');
		//this.addSearchField('modify_ep_id');
		//this.setDefValue('use_yn','Y');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');
		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 탭1 > 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 3: case 4:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        //gMain.pageSize = 9999;
        this.localSize = 9999;
        // 탭1 > 메인스토어 생성
        this.createStore('Rfx2.store.company.sejun.WorkRoleStore', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
            this.localSize
	        ,{}
	        , ['code']
        );


        this.addCode = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: this.getMC('mes_order_edit_btn', '등록'),
            tooltip: this.getMC('mes_order_edit_btn_msg', '등록'),
            disabled: false,
            handler: function () {
                var form = Ext.create('Ext.form.Panel', {
                    id: 'editPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('mes_order_edit_btn', '공통정보 입력'),
                            width: '100%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'code',
                                            name: 'code',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: '작업코드',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'role',
                                            name: 'role',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            fieldLabel: '작업임무',
                                        },
                                    ]
                                },

                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '등록'),
                    width: 650,
                    height: 200,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('editPoForm').getForm();
                                if (form.isValid()) {

                                    win.setLoading(true);

                                    var val = form.getValues(false);

                                    form.submit({
                                        url: CONTEXT_PATH + '/admin/mescode.do?method=addWorkerRoleCode',
                                        params: {
                                            'parent_system_code' : 'WORKER_ROLE'
                                        },
                                        success: function (val, action) {
                                            gm.me().store.load();
                                            win.setLoading(false);
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
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
            }
        });

        buttonToolbar.insert(1, this.addCode);

        // 탭1 > 메인그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // 탭1 > 메인그리드 하단 스크롤 생성
        this.grid.flex = 1;
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                this.grid, this.crudTab
            ]
        });

        


        // 탭1 > 메인그리드 선택 했을 시 콜백
        this.setGridOnCallback(function(selections){
            if (selections.length) {
                // gm.me().addCode.enable();

            } else {

            }
        })

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],

    useCodeZh: function() {
        switch (vCompanyReserved4) {
            case 'BIOT01KR':
                return true;
            default:
                return false;
        }
    }
});