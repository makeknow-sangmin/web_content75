Ext.define('Rfx.view.produceMgmt.HEAVY4_InspectView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produceadjustpcs-view',
    selected_rec : null,
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        if(vCompanyReserved4 == 'HSGC01KR') {
            this.addSearchField ('pj_name');
            this.addSearchField ('reserved_varchar2');
            this.addSearchField ('reserved_varchar3');
            this.addSearchField ('reserved_varchard');
        } else {
            this.addSearchField ('pj_code');
            this.addSearchField('item_code');
            this.addSearchField('buyer_name');
            this.addSearchField (
                {
                    field_id: 'status'
                    ,store: "RecevedStateStore"
                    ,displayField: 'codeName'
                    ,valueField: 'systemCode'
                    ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
                });
            this.addSearchField('pcs_name');
        }


        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var groupField = '';

        switch(vCompanyReserved4){
            case 'KYNL01KR':
            case 'HSGC01KR':
                groupField = 'pcs_name';
                break;
            default:
                groupField = 'pcs_code';
        }

        this.createStoreSimple({
            modelClass: 'Rfx.model.Inspect',
            pageSize: gMain.pageSize,
            sorters: [{
                //property: 'pcs_code',
                property: 'pj_name',
                direction: 'asc'
            }],
            byReplacer: {
                'item_code': 'srcahd.item_code',
                'step': 'step.pcs_code'
            },
            deleteClass: ['pcsstep']

        }, {
            groupField: groupField
        });

        //완료처리
        this.pcsInspectAction = Ext.create('Ext.Action', {
            iconCls: '',
            text: '검사하기',
            tooltip: '검사 하기',
            disabled: true,
            handler: function() {
                gMain.selPanel.treatInspect();
            }
        });

        buttonToolbar.insert(6, this.pcsInspectAction);
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==5||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);


        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.count]} </b></font>{[values.rows[0].data.count]}  ({rows.length} )</div>'
        });

        var option = {
            features: [groupingFeature]
        };

        //grid 생성.
        this.createGridCore(arr, option);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if (selections.length) {

                selected_rec = selections;

                var rec = selections[0];
                console_logs('setGridOnCallback***********************',rec);
                gMain.selPanel.vSELECTED_STEP_UID = rec.get('pcsstep_uid');
                gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code');
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_PRO_QTY = rec.get('process_qty');
                gMain.selPanel.vSELECTED_SRC_UID = rec.get('srcahd_uid');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                console_logs('setGridOnCallback---------------',gMain.selPanel.vSELECTED_PJ_CODE);

                gMain.selPanel.pcsInspectAction.enable();



            } else {

                this.pcsInspectAction.disable();

            }

        })

        this.testFormItems = [];

        this.callParent(arguments);

        this.store.getProxy().setExtraParam('orderBy', "pcs_code");
        this.store.getProxy().setExtraParam('ascDesc', "ASC");
        switch(vCompanyReserved4) {
            case 'HSGC01KR' :
                this.store.getProxy().setExtraParam('not_in_project', 'ES');
                this.store.getProxy().setExtraParam('not_in_process', 'PRD');
                break;
            default:
                break;
        }
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){
            console_logs('Inspect records', records);
        });
    },

    //양품수량계산
    sumPassfc : function() {
        inspart = gMain.selPanel.vSELECTED_PRO_QTY;
        inspart1 = Ext.getCmp('ins_qty1').getValue();
        inspart2 = Ext.getCmp('ins_qty2').getValue();
        inspart3 = Ext.getCmp('ins_qty3').getValue();
        inspart4 = Ext.getCmp('ins_qty4').getValue();
        inspart5 = Ext.getCmp('ins_qty5').getValue();

        if(inspart1 == undefined || inspart1 == null){
            inspart1 = 0;
        }
        if(inspart2 == undefined || inspart2 == null){
            inspart2 = 0;
        }
        if(inspart3 == undefined || inspart3 == null){
            inspart3 = 0;
        }
        if(inspart4 == undefined || inspart4 == null){
            inspart4 = 0;
        }
        if(inspart5 == undefined || inspart5 == null){
            inspart5 = 0;
        }

        Ext.getCmp('ins_good').setValue(inspart - inspart1 - inspart2 - inspart3 - inspart4 - inspart5);


    },

    treatInspect: function() {
        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: true ,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                layout: 'form',
                xtype: 'container',
                defaultType: 'textfield',
                style: 'width: 50%'
            },
            items:[
                {
                    xtype: 'fieldset',
                    title: '정보',
                    //width : 280,
                    height : 70,
                    margin: '5',
                    width: '100%',
                    collapsible: true,
                    anchor: '100%',
                    defaults: {
                        labelWidth: 100,
                        anchor: '50%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                        }
                    },
                    items: [
                        { fieldLabel: '양품수량',
                            xtype : 'numberfield',
                            id : 'ins_good',
                            name : 'ins_good',
                            useThousandSeparator: false,
                            minValue : 0,
                            value : gMain.selPanel.vSELECTED_PRO_QTY
                        }
                    ]
                },

                {
                    xtype: 'fieldset',
                    title: '불량항목',
                    boder: true,
                    collapsible: true,
                    margin: '5',
                    width: '100%',
                    defaults: {
                        anchor: '100%',
                        useThousandSeparator: false
                    },

                    items :[{
                        xtype : 'fieldcontainer',
                        combineErrors: true,
                        msgTarget: 'side',
                        layout: 'hbox',
                        defaults: {
                            hideLabel: true,
                            margin: '0 5 0 0',
                            width: 120,
                            useThousandSeparator: false
                        },
                        items: [{
                            xtype: 'combo',
                            id: 'ins1',
                            name: 'ins1',
                            store: Ext.create('Rfx.store.HeavyDefectStore', {parentCode: 'DEFECTIVE_CODE'}),  // 불량코드
                            displayField:   'code_name_kr',
                            valueField: 'system_code',
                            //emptyText: '선택',
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            typeAhead: false,
                            //hideLabel: true,
                            minChars: 1,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                            {
                                xtype: 'numberfield',
                                flex : 3,
                                id : 'ins_qty1',
                                name : 'ins_qty1',
                                emptyText : '0',
                                listeners: {
                                    change: function(field, value) {
                                        gMain.selPanel.sumPassfc();
                                    }
                                }

                            }
                        ]
                    },{
                        xtype : 'fieldcontainer',
                        combineErrors: true,
                        msgTarget: 'side',
                        layout: 'hbox',
                        defaults: {
                            hideLabel: true,
                            margin: '0 5 0 0',
                            width: 120,
                            useThousandSeparator: false
                        },
                        items: [{
                            xtype: 'combo',
                            id: 'ins2',
                            name: 'ins2',
                            store: Ext.create('Rfx.store.HeavyDefectStore', {parentCode: 'DEFECTIVE_CODE'}),  // 지종
                            displayField:   'code_name_kr',
                            valueField: 'system_code',
                            //emptyText: '선택',
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            typeAhead: false,
                            //hideLabel: true,
                            minChars: 3,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                            {
                                xtype: 'numberfield',
                                flex : 3,
                                id : 'ins_qty2',
                                name : 'ins_qty2',
                                emptyText : '0',
                                listeners: {
                                    change: function(field, value) {
                                        gMain.selPanel.sumPassfc();
                                    }
                                }

                            }
                        ]
                    },{
                        xtype : 'fieldcontainer',
                        combineErrors: true,
                        msgTarget: 'side',
                        layout: 'hbox',
                        defaults: {
                            hideLabel: true,
                            margin: '0 5 0 0',
                            width: 120,
                            useThousandSeparator: false
                        },
                        items: [{
                            xtype: 'combo',
                            id: 'ins3',
                            name: 'ins3',
                            store: Ext.create('Rfx.store.HeavyDefectStore', {parentCode: 'DEFECTIVE_CODE'}),  // 지종
                            displayField:   'code_name_kr',
                            valueField: 'system_code',
                            //emptyText: '선택',
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            typeAhead: false,
                            //hideLabel: true,
                            minChars: 3,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                            {
                                xtype: 'numberfield',
                                flex : 3,
                                id : 'ins_qty3',
                                name : 'ins_qty3',
                                emptyText : '0',
                                listeners: {
                                    change: function(field, value) {
                                        gMain.selPanel.sumPassfc();
                                    }
                                }

                            }
                        ]
                    },{
                        xtype : 'fieldcontainer',
                        combineErrors: true,
                        msgTarget: 'side',
                        //fieldLabel: '재고 사용',
                        layout: 'hbox',
                        defaults: {
                            hideLabel: true,
                            margin: '0 5 0 0',
                            width: 120,
                            useThousandSeparator: false
                        },
                        items: [{
                            xtype: 'combo',
                            id: 'ins4',
                            name: 'ins4',
                            store: Ext.create('Rfx.store.HeavyDefectStore', {parentCode: 'DEFECTIVE_CODE'}),  // 지종
                            displayField:   'code_name_kr',
                            valueField: 'system_code',
                            //emptyText: '선택',
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            typeAhead: false,
                            //hideLabel: true,
                            minChars: 4,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                            {
                                xtype: 'numberfield',
                                flex : 4,
                                id : 'ins_qty4',
                                name : 'ins_qty4',
                                emptyText : '0',
                                listeners: {
                                    change: function(field, value) {
                                        gMain.selPanel.sumPassfc();
                                    }
                                }

                            }
                        ]
                    },{
                        xtype : 'fieldcontainer',
                        combineErrors: true,
                        msgTarget: 'side',
                        //fieldLabel: '재고 사용',
                        layout: 'hbox',
                        defaults: {
                            hideLabel: true,
                            margin: '0 5 0 0',
                            width: 120,
                            useThousandSeparator: false
                        },
                        items: [{
                            xtype: 'combo',
                            id: 'ins5',
                            name: 'ins5',
                            store: Ext.create('Rfx.store.HeavyDefectStore', {parentCode: 'DEFECTIVE_CODE'}),  // 지종
                            displayField:   'code_name_kr',
                            valueField: 'system_code',
                            //emptyText: '선택',
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            typeAhead: false,
                            //hideLabel: true,
                            minChars: 5,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                            {
                                xtype: 'numberfield',
                                flex : 5,
                                id : 'ins_qty5',
                                name : 'ins_qty5',
                                emptyText : '0',
                                listeners: {
                                    change: function(field, value) {
                                        gMain.selPanel.sumPassfc();
                                    }
                                }

                            }
                        ]
                    }
                    ]

                }
            ]

        })
        myHeight = 400;
        myWidth = 320;

        prwin = this.prwininspect(form);
    },

    prwininspect: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '검사 처리',
            width: myWidth,

            height: myHeight,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn){
                    var msg = '저장하시겠습니까?'
                    var myTitle = '검사 처리 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {

                            if(btn == "no"){
                                prWin.close();
                            }else{
                                var form = gu.getCmp('formPanel').getForm();

                                if(form.isValid()){
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    for(var k = 0 ; k < selected_rec.length; k++) {
                                        form.submit({
                                            url: CONTEXT_PATH + '/production/pcsline.do?method=InspectDefect',
                                            params: {
                                                sancType: 'YES',
                                                ac_uid: '-1',
                                                pcsstep_uid: selected_rec[k].get('pcsstep_uid'),
                                                srcahd_uid: selected_rec[k].get('srcahd_uid'),
                                                ac_uid: selected_rec[k].get('ac_uid')
                                            },
                                            success: function (val, action) {
                                                prWin.close();
                                                gMain.selPanel.store.load(function () {
                                                });

                                            },
                                            failure: function (val, action) {
                                                alert('저장에 실패했습니다.');
                                                prWin.close();

                                            }
                                        })
                                    }
                                }  // end of formvalid
                            } // btnIf of end
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

});
