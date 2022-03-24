Ext.define('Rfx2.view.company.dabp01kr.accountMgmt.PaySystem', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'paysystem-view',
    selected_rec : null,
    selected_sub_rec : null,
    initComponent: function(){

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.PaySystem', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            1000000
            ,{}
            , ['salinfo']
        );

        //검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('division_name');
		this.addSearchField('user_name');
        this.addSearchField (
        {
            field_id: 'sal_system'
            ,store: "SalarySystemStore"
            ,displayField: 'codeName'
            ,valueField: 'systemCode'
            ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });
        this.addSearchField({
            type: 'radio',
            field_id :'work_yn',
            items: [
                {
                    text :  '모두',
                    value: '',
                    name : 'work_yn',
                    checked: true
                },
                {
                    text :  '재직',
                    name : 'work_yn',
                    value: 'Y',
                    checked: false
                },
                {
                    text :  '퇴사',
                    name : 'work_yn',
                    value: 'N',
                    checked: false
                }
            ]
        });
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || /*index == 2 ||*/ index == 3 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addPaySystemAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '급여체계를 수정합니다.',
            disabled: false,
            handler: function() {
                gm.me().addPaySystem();
            }
        });

        //그리드 생성
        var arr=[];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        buttonToolbar.insert(1, this.addPaySystemAction);

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.editAction.setText('급여변경내역' );
            console_logs('>>>>grid', this.grid);
        this.addTabpayDetailGridPanel('급여변경내역', 'SST_SUB', {
                pageSize: 100,
                model: 'Rfx.store.PayDetailListStore',
                scroll: true,
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            Ext.create('Ext.Action', {
                                iconCls: 'af-plus-circle',
                                text: '급여갱신',
                                tooltip: '해당 사용자의 급여를 갱신합니다',
                                handler: this.updatePay
                            }),
                            Ext.create('Ext.Action', {
                                iconCls: 'af-remove',
                                text: '내역삭제',
                                tooltip: '해당 사용자의 급여 내역을 삭제합니다',
                                handler: this.removePay
                            }),
                        ]
                    }
                ],
                sorters: [{
                    property: 'serial_no',
                    direction: 'ASC'
                }]
            },
            function(selections) {

            },
            'payDetailGrid'//toolbar
        );

        this.callParent(arguments);
        
        //디폴트 로드
        g``

        //(과부하 방지를 위해)첫 로딩때만 인사정보 업데이트 한다. CMD_SEARCH/*'검색'*/누르면 업데이트 X
        this.store.getProxy().setExtraParam('refresh_paysystem', 'Y');
        this.store.getProxy().setExtraParam('orderBy', 'user_name');
        this.store.getProxy().setExtraParam('work_yn', 'Y');
        this.store.getProxy().setExtraParam('ascDesc', 'ASC LIMIT 18446744073709551615');

		this.storeLoad();

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if (selections.length) {
                var rec = selections[0];
                this.selected_rec = rec;
                gm.me().payDetailStore.getProxy().setExtraParam('uid_usrast', rec.get('uid_usrast'));
                gm.me().payDetailStore.getProxy().setExtraParam('orderBy', 'user_name');
                this.payDetailGrid.getStore().load({
                    callback: function(records, operation, success) {
                        gm.me().selected_sub_rec = records;
                    }
                });
            }
        })

    },

    addTabpayDetailGridPanel: function(title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if(success ==true) {
                    this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function() {

                        }
                    });
                }
            },
            scope: this
        });

    },

    callBackWorkList: function(title, records, arg, fc, id) {
        var gridId = id== null? this.getGridId() : id;

        var o = gm.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });

        gm.me().payDetailStore = Ext.create('Rfx.store.PayDetailListStore');

        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}

        var forcefitSide = true;

        switch(vCompanyReserved4){
            case 'KYNL01KR' :
                forcefitSide = false;
                break;
        }

        this.payDetailGrid = Ext.create('Ext.grid.Panel', {
            //id: gridId,
            store: gm.me().payDetailStore,
            //store: store,
            title: title,
            cls : 'rfx-panel',
            border: true,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout          :'fit',
            //forceFit: forcefitSide,
            dockedItems: dockedItems,
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function(selModel, record, index, options){

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gm.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown:function (payDetailGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.payDetailGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                fc(selections);
            }
        });

        var tabPanel = Ext.getCmp(gm.geTabPanelId());

        tabPanel.add(this.payDetailGrid);
    },

    editRedord: function (field, rec) {

        var params = {};

        switch (field) {
            case 'basic_pay':
            case 'daily_pay':
            case 'duty_pay':
            case 'extension_pay':
            case 'welding_pay':
            case 'tel_charge':
            case 'med_insurance':
            case 'pension':
            case 'earned_tax':
            case 'resident_tax':
            case 'condol_cost':
            case 'overtime_pay':
            case 'annual_allowance':
            case 'etc_allowance':
            case 'med_calculate':
            case 'nurse_insurance':
            case 'nurse_calculate':
            
                params['basic_pay'] = rec.get('basic_pay');
                params['daily_pay'] = rec.get('daily_pay');
                params['duty_pay'] = rec.get('duty_pay');
                params['extension_pay'] = rec.get('extension_pay');
                params['welding_pay'] = rec.get('welding_pay');
                params['tel_charge'] = rec.get('tel_charge');
                params['med_insurance'] = rec.get('med_insurance');
                params['pension'] = rec.get('pension');
                params['earned_tax'] = rec.get('earned_tax');
                params['resident_tax'] = rec.get('resident_tax');
                params['condol_cost'] = rec.get('condol_cost');
                params['overtime_pay'] = rec.get('overtime_pay');
                params['annual_allowance'] = rec.get('annual_allowance');
                params['etc_allowance'] = rec.get('etc_allowance');
                params['med_calculate'] = rec.get('med_calculate');
                params['nurse_insurance'] = rec.get('nurse_insurance');
                params['nurse_calculate'] = rec.get('nurse_calculate');
                params['uid_usrast'] = rec.get('uid_usrast');
                
                // params[field] = rec.get(field);
                params['unique_id'] = rec.get('unique_id');
                console_logs('>>>>param', rec);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/account/attitude.do?method=updatePaySystem',
                    params: params,
                    success: function(result, request) {
                        gm.me().storeLoad();
                    },
                    failure: extjsUtil.failureMessage
                });
                break;
            case 'join_date':
            var value = rec.get(field);
            if(value != null && value != undefined) {  
                gm.editAjax('usrast', field, rec.get(field), 'unique_id', rec.get('uid_usrast'),  {type:''});
            }      
            break;      
            case 'resign_date':
            case 'address_1':
            case 'reg_no':
            case 'zip_code':
                gm.editAjax('usrast', field, rec.get(field), 'unique_id', rec.get('uid_usrast'),  {type:''});
                break;
            case 'work_yn':
                gm.editAjax('salinfo', field, rec.get(field) == '재직' ? 'Y' : 'N', 'unique_id', rec.get('unique_id_long'),  {type:''});
                break;
            case 'work_division':
                var work_division = '미정';
                if(rec.get(field) == '사무직') {
                    work_division = 'O';
                } else if(rec.get(field) == '생산직') {
                    work_division = 'P';
                } else if(rec.get(field) == '외국인') {
                    work_division = 'F';
                }
                gm.editAjax('usrast', 'ep_suborg_name', work_division, 'unique_id', rec.get('uid_usrast'),  {type:''});
                break;
            case 'sal_system_kr':
                var sal_system = '미정';
                if(rec.get(field) == '월급제') {
                    sal_system = 'M';
                } else if(rec.get(field) == '일당제') {
                    sal_system = 'D';
                } else if(rec.get(field) == '일용직') {
                    sal_system = 'L';
                }
                gm.editAjax('salinfo', 'sal_system', sal_system, 'unique_id', rec.get('unique_id_long'),  {type:''});
                break;
            default:
                gm.editRedord(field, rec);
                break;
        }
    },

    updatePay: function() {

        var previous_pay = gm.me().selected_sub_rec[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false ,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '급여갱신 내역을 추가합니다',
                    defaultType: 'textfield',
                    items: [
                        {
                            xtype: 'datefield',
                            id: 'create_date',
                            name: 'create_date',
                            value: new Date(),
                            fieldLabel: '급여변경일',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'basic_pay',
                            name: 'basic_pay',
                            value: previous_pay.get('basic_pay'),
                            fieldLabel: '기본급',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'daily_pay',
                            name: 'daily_pay',
                            value: previous_pay.get('daily_pay'),
                            fieldLabel: '일급',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'duty_pay',
                            name: 'duty_pay',
                            value: previous_pay.get('duty_pay'),
                            fieldLabel: '직책수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'extension_pay',
                            name: 'extension_pay',
                            value: previous_pay.get('extension_pay'),
                            fieldLabel: '연장수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'welding_pay',
                            name: 'welding_pay',
                            value: previous_pay.get('welding_pay'),
                            fieldLabel: '용접수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'tel_charge',
                            name: 'tel_charge',
                            value: previous_pay.get('tel_charge'),
                            fieldLabel: '통신비',
                            allowBlank: false
                        }
                    ]
                },

            ]//item end..

        });//Panel end...

        var prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '급여갱신',
            width: 320,
            height: 400,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn){
                    var msg = '급여를 갱신하시겠습니까?';
                    var myTitle = '급여갱신';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {
                            if(btn == "no"){
                                MessageBox.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                var unique_id = gm.me().selected_sub_rec[0].get('unique_id');
                                var myWin = prWin;

                                myWin.setLoading(true);
                                form.submit({
                                    url : CONTEXT_PATH + '/account/attitude.do?method=updatePaySystem',
                                    params:{
                                        unique_id : unique_id
                                    },
                                    success: function(val, action){
                                        gm.me().payDetailStore.getProxy().setExtraParam('uid_usrast', gm.me().selected_sub_rec[0].get('uid_usrast'));
                                        gm.me().payDetailGrid.getStore().load({
                                            callback: function(records, operation, success) {
                                                gm.me().selected_sub_rec = records;
                                            }
                                        });
                                        gm.me().storeLoad();
                                        myWin.close();
                                    },
                                    failure: function(val, action){
                                        myWin.close();
                                    }
                                });
                            }
                        }//fn function(btn)

                    });//show
                }//btn handler
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(prWin) {

                        prWin.close();

                    }
                }
            }]
        });

        prWin.show();
    },

    removePay: function() {
        var win = Ext.create('ModalWindow', {
            title: '메시지',
            html: '<br><p style="text-align:center;">해당 급여 갱신내역을 삭제하시겠습니까?</p>',
            width: 300,
            height: 120,
            buttons: [{
                text: '예',
                handler: function(){

                    var selections = gm.me().payDetailGrid.getSelectionModel().getSelection();
                    var payDetailStore = gm.me().payDetailGrid.getStore().data.items;

                    if(payDetailStore.length == selections.length) {
                        Ext.Msg.alert('경고',
                            '급여 내역은 최소 하나 이상 존재해야 합니다.</br>' +
                            '새로 등록하시려면 먼저 급여 내역을 등록 후 기존 내역을 삭제하시기 바랍니다.');
                    } else {
                        for(var i = 0; i < selections.length; i++) {
                            gm.editAjax('salinfo', 'delete_flag', 'Y', 'unique_id', selections[i].id,  {type:''});
                        }
                    }
                    if(win) {
                        gm.me().payDetailGrid.getStore().reload();
                        win.close();
                    }
                }
            },
                {
                    text: '아니오',
                    handler: function(){
                        if(win) {
                            win.close();
                        }
                    }
                }]
        });
        win.show();
    },


    addPaySystem: function() {

        var UserStore = Ext.create('Mplm.store.UserStore');

        var placeStore = null;

        var salaryStore = Ext.create('Ext.data.Store', {

            fields: ['system_name', 'sal_system'],
            data : [
                {"system_name":"월급제", "sal_system":"M"},
                {"system_name":"일급제", "sal_system":"D"}
            ]

        });

        switch(vCompanyReserved4) {
            case 'KWLM01KR':
                placeStore = Ext.create('Ext.data.Store', {
                    fields: ['name'],
                    data : [
                        {"name":"광림마린테크"},
                        {"name":"에스엔피"},
                        {"name":"인더스트리"}
                    ]
                });
                break;
            default:
                placeStore = Ext.create('Ext.data.Store', {
                    fields: ['month'],
                    data : [
                        {"name":"본사"}
                    ]
                });
                break;
        }

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false ,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items: [

                {
                    xtype: 'fieldset',
                    title: '급여체계 내역을 수정합니다',
                    defaultType: 'textfield',
                    items: [
                        {
                            fieldLabel: '사업부',
                            xtype: 'combo',
                            id: gu.id('target_supplier2'),
                            name: 'coord_key1',
                            store: placeStore,
                            displayField: 'name',
                            valueField: 'name',
                            emptyText: '선택',
                            allowBlank: false,
                            sortInfo: {
                                field: 'create_date',
                                direction: 'DESC'
                            },
                            typeAhead: false,
                            minChars: 2,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function() {
                                    return '<div data-qtip="{name}">{name}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {
                                    UserStore.getProxy().setExtraParam('division_name', record.get('name'));
                                    UserStore.load();
                                }
                            }
                        },
                        {
                            fieldLabel: '사용자명',
                            xtype: 'combo',
                            id: gu.id('uid_usrast'),
                            name: 'uid_usrast',
                            store: UserStore,
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            emptyText: '사용자를 선택하세요',
                            allowBlank: false,
                            sortInfo: {
                                field: 'create_date',
                                direction: 'DESC'
                            },
                            typeAhead: false,
                            minChars: 2,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function() {
                                    return '<div data-qtip="{unique_id}">{user_id} - {user_name}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {

                                }
                            }
                        },
                        {
                            fieldLabel: '급여체계',
                            xtype: 'combo',
                            id: gu.id('sal_system'),
                            name: 'sal_system',
                            store: salaryStore,
                            displayField: 'system_name',
                            valueField: 'sal_system',
                            emptyText: '급여체계를 선택하세요',
                            allowBlank: false,
                            sortInfo: {
                                field: 'create_date',
                                direction: 'DESC'
                            },
                            typeAhead: false,
                            minChars: 2,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function() {
                                    return '<div data-qtip="{unique_id}">{system_name}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {

                                }
                            }
                        },
                        {
                            xtype: 'datefield',
                            id: 'create_date',
                            name: 'create_date',
                            value: new Date(),
                            fieldLabel: '급여변경개시일',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'basic_pay',
                            name: 'basic_pay',
                            value: '',
                            fieldLabel: '기본급',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'daily_pay',
                            name: 'daily_pay',
                            value: '',
                            fieldLabel: '일급',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'duty_pay',
                            name: 'duty_pay',
                            value: '',
                            fieldLabel: '직책수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'annual_allowance',
                            name: 'annual_allowance',
                            value: '',
                            fieldLabel: '연차수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'extension_pay',
                            name: 'extension_pay',
                            value: '',
                            fieldLabel: '연장수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'overtime_pay',
                            name: 'overtime_pay',
                            value: '',
                            fieldLabel: '특근수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'welding_pay',
                            name: 'welding_pay',
                            value: '',
                            fieldLabel: '용접수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'etc_allowance',
                            name: 'etc_allowance',
                            value: '',
                            fieldLabel: '기타수당',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'tel_charge',
                            name: 'tel_charge',
                            value: '',
                            fieldLabel: '통신비',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'earned_tax',
                            name: 'earned_tax',
                            value: '',
                            fieldLabel: '갑근세',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'med_insurance',
                            name: 'med_insurance',
                            value: '',
                            fieldLabel: '건강보험',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'med_calculate',
                            name: 'med_calculate',
                            value: '',
                            fieldLabel: '건강정산',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'nurse_insurance',
                            name: 'nurse_insurance',
                            value: '',
                            fieldLabel: '요양보험',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'nurse_calculate',
                            name: 'nurse_calculate',
                            value: '',
                            fieldLabel: '요양정산',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'pension',
                            name: 'pension',
                            value: '',
                            fieldLabel: '국민연금',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'condol_cost',
                            name: 'condol_cost',
                            value: '',
                            fieldLabel: '상조회비',
                            allowBlank: false
                        }
                    ]
                },

            ]//item end..

        });//Panel end...

        var prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '급여체계수정',
            width: 450,
            height: 720,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn){
                    var msg = '급여체계를 수정하시겠습니까?';
                    var myTitle = '급여체계 수정';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {
                            if(btn == "no"){
                                MessageBox.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                var myWin = prWin;

                                myWin.setLoading(true);
                                form.submit({
                                    url : CONTEXT_PATH + '/account/attitude.do?method=updatePaySystem',
                                    params:{

                                    },
                                    success: function(val, action){
                                        gm.me().storeLoad();
                                        myWin.close();
                                    },
                                    failure: function(val, action){
                                        myWin.close();
                                    }
                                });
                            }
                        }//fn function(btn)

                    });//show
                }//btn handler
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(prWin) {

                        prWin.close();

                    }
                }
            }]
        });

        prWin.show();
    }

});
