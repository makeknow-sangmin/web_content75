Ext.define('Rfx.view.produceMgmt.HEAVY4_InspectKynlView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produceadjustpcs-kynl-view',
    selected_rec : null,
    current_pcs_code: null,
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField({
            type: 'condition',
            width: 140,
            sqlName: 'lotdetail',
            tableName: 'pcsstep',
            emptyText: '공정명',
            field_id: 'pcs_name',
            fieldName: 'pcs_name',
            params: {
                ky_flag: 'Y',
                is_complished: 'Y'
            }
        });

        this.addSearchField({
            type: 'condition',
            width: 140,
            sqlName: 'lotdetail',
            tableName: 'project',
            field_id: 'pj_code',
            fieldName: 'pj_code',
            params: {
                ky_flag: 'Y',
                is_complished: 'Y'
            }
        });
        this.addSearchField({
            type: 'condition',
            width: 140,
            sqlName: 'lotdetail',
            tableName: 'pjdsub',
            field_id: 'h_reserved2',
            fieldName: 'h_reserved2',
            params: {
                ky_flag: 'Y',
                is_complished: 'Y'
            }
        });
        this.addSearchField({
            type: 'condition',
            width: 140,
            sqlName: 'lotdetail',
            tableName: 'srcahd',
            field_id: 'area_code',
            fieldName: 'area_code',
            params: {
                ky_flag: 'Y',
                is_complished: 'Y'
            }
        });
        this.addSearchField({
            type: 'condition',
            width: 200,
            sqlName: 'lotdetail',
            tableName: 'assymap',
            field_id: 'reserved1',
            fieldName: 'reserved1',
            params: {
                ky_flag: 'Y',
                is_complished: 'Y'
            }
        });


        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var groupField = '';

        switch(vCompanyReserved4){
            case 'KYNL01KR':
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

        /*this.createStore('Rfx.model.Inspect', [{
            property: 'pcs_code',
            direction: 'DESC'
        }],
        gMain.pageSizepageSize
        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	//Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'step.creator',
        	unique_id: 'step.unique_id'
        }
    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['pcsstep']
    	, {
    		groupField: 'pcs_code'
    	}
        );*/


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
        /*buttonToolbar.insert(6, this.pcsQtyAction);
        buttonToolbar.insert(6, this.pcsStateAction);*/
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==5||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
            processes = gUtil.mesTplProcessBig;
        } else {
        }

        if(processes!=null) {

            for(var i = processes.length - 1; i >= 0; i--) {
                var o = processes[i];
                var big_pcs_code = o['code'];
                var title = '[' + o['code'] + ']' + o['name'];
                console_logs('title', title);

                var action = Ext.create('Ext.Action', {
                    xtype : 'button',
                    text: title,
                    tooltip: title + ' 공정',
                    big_pcs_code: big_pcs_code,
                    toggleGroup: this.link + 'bigPcsType',
                    handler: function() {
                        gm.me().setBigPcsCode(this.big_pcs_code);
                    }
                });

                buttonToolbar.insert(4, action);
            }
            var action = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '전체 대공정',
                tooltip: '전체 대공정',
                big_pcs_code: '',
                pressed: true,
                toggleGroup: this.link + 'bigPcsType',
                handler: function() {
                    gm.me().setBigPcsCode(this.big_pcs_code);
                }
            });

            buttonToolbar.insert(4, action);
        }

        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);


        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.po_no]} </b></font> ({[values.rows[0].data.po_no]})</div>'*/
            groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.count]} </b></font>{[values.rows[0].data.count]}  ({rows.length} )</div>'
        });

        var option = {
           features: [groupingFeature]
        };



        //grid 생성.
        this.createGridCore(arr, option);


        this.createCrudTab();

        this.tab_info = [];

        if(vCompanyReserved4=='KYNL01KR' || vCompanyReserved4=='HSGC01KR') {
            for(var i = 0; i < gUtil.mesProductCategory.length; i++) {

                var o = gUtil.mesProductCategory[i];

                this.tab_info.push({
                    code: o['code'],
                    name: o['name'],
                    title: o['name']
                });
            }

            var ti = this.tab_info;
            for(var i=0; i<ti.length; i++) {

                var tab = ti[i];
                console_logs('this.tab',tab);
                console_logs('this.columns_map',this.columns_map);

                var tab_code = tab['code'];
                var myColumn = this.columns_map[tab_code];
                var myField =  this.fields_map[tab_code];
                //유형별 필드 추가하기
                this.addExtraColumnBypcscode(myColumn, myField, tab_code);

            }

            var items = [];

            var tab = this.createTabGrid('Rfx.model.Inspect', items, 'big_pcs_code', arr, function(curTab, prevtab) {

                var multi_grid_id = curTab.multi_grid_id;

                gm.me().multi_grid_id = multi_grid_id;

                var store = gm.me().store_map[multi_grid_id];
                gMain.selPanel.store = store;

                gm.me().store.getProxy().setExtraParam('pj_type', multi_grid_id);

                gm.me().storeLoad();

            }); /*,{ groupField: groupField
            }, groupingFeature); */

            Ext.apply(this, {
                layout: 'border',
                items: [tab,  this.crudTab]
            });
        } else {
            Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
            });
        }

        this.store.getProxy().setExtraParam('big_pcs_code', this.current_pcs_code);

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
                //gMain.selPanel.vSELECTED_PRO_QTY = 20;
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
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.storeLoad();
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
                                                pcsstep_uid: selected_rec[k].get('pcsstep_uid')/*gMain.selPanel.vSELECTED_STEP_UID*/,
                                                srcahd_uid: selected_rec[k].get('srcahd_uid')/*gMain.selPanel.vSELECTED_SRC_UID*/,
                                                ac_uid: selected_rec[k].get('ac_uid')/*gMain.selPanel.vSELECTED_AC_UID*/
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

                                        if(vCompanyReserved4 == 'KYNL01KR') {
                                            var date = Ext.Date.format(new Date,'Y-m-d');
                                            var pcs_code = selected_rec[k].get('pcs_code');
                                            switch(selected_rec[k].get('pcs_name')) {
                                                case '제작':
                                                    gm.editAjax('itemdetail', 'h_reserved24', date, 'unique_id', selected_rec[k].get('detail_unique_id'),  {type:''});
                                                    if(pcs_code == 'P-PRD') {
                                                        gm.editAjax('itemdetail', 'h_reserved31', date, 'unique_id', selected_rec[k].get('detail_unique_id'),  {type:''});
                                                    }
                                                    break;
                                                case '도금':
                                                    gm.editAjax('itemdetail', 'h_reserved29', date, 'unique_id', selected_rec[k].get('detail_unique_id'),  {type:''});
                                                    if(pcs_code == 'C-GLT') {
                                                        gm.editAjax('itemdetail', 'h_reserved31', date, 'unique_id', selected_rec[k].get('detail_unique_id'),  {type:''});
                                                    }
                                                    break;
                                                case '도장':
                                                    break;
                                            }

                                        }
                                    }

                                    /*form.submit({
                                    url : CONTEXT_PATH + '/production/pcsline.do?method=InspectDefect',
                                        params:{
                                        sancType : 'YES',
                                            ac_uid: '-1',
                                            pcsstep_uid: gMain.selPanel.vSELECTED_STEP_UID,
                                            srcahd_uid: gMain.selPanel.vSELECTED_SRC_UID,
                                            ac_uid: gMain.selPanel.vSELECTED_AC_UID
                                    },
                                    success: function(val, action){
                                        prWin.close();
                                        gMain.selPanel.store.load(function(){});

                                    },
                                    failure: function(val, action){
                                        alert('저장에 실패했습니다.');
                                        prWin.close();

                                    }*/
                               // })  // end of form

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

    //유형별 필드 추가
    addExtraColumnBypcscode: function(myColumn, myField, tab_code) {

        var columnGroup = [];
        this.column_group_map[tab_code] = columnGroup;
    },

    setBigPcsCode: function(big_pcs_code) {
        console_logs('big_pcs_code', big_pcs_code);
        this.big_pcs_code = big_pcs_code;
        this.refreshButtons();
        gm.me().current_big_pcs_code = this.big_pcs_code;


        switch(vCompanyReserved4) {
            case 'HSGC01KR':
                if(gm.me().multi_grid_id == 'SAM') {
                    this.store.getProxy().setExtraParam('order_com_unique', '79070000002');
                    if(gm.me().current_big_pcs_code == 'ASB') {
                        this.store.getProxy().setExtraParam('pj_type', 'S');
                    } else if(gm.me().current_big_pcs_code == 'STE') {
                        this.store.getProxy().setExtraParam('pj_type', 'T');
                    }
                } else if (gm.me().multi_grid_id == 'DAE') {
                    this.store.getProxy().setExtraParam('order_com_unique', '79070000003');
                    if(gm.me().current_big_pcs_code == 'ASB') {
                        this.store.getProxy().setExtraParam('pj_type', 'DS');
                    } else if(gm.me().current_big_pcs_code == 'STE') {
                        this.store.getProxy().setExtraParam('pj_type', 'DT');
                    }
                } else if (gm.me().multi_grid_id == 'ETC') {
                    if(gm.me().current_big_pcs_code == 'ASB') {
                        this.store.getProxy().setExtraParam('order_com_unique', '79070000004');
                        this.store.getProxy().setExtraParam('pj_type', 'ET');
                    }
                }
                break;
            default:
                this.store.getProxy().setExtraParam('pj_type', gm.me().multi_grid_id);
        }


        this.store.getProxy().setExtraParam('big_pcs_code', this.big_pcs_code);
        this.storeLoad();
    },
    refreshButtons: function(bSelected) {

        console_logs('this.big_pcs_code', this.big_pcs_code);

        if(bSelected!=undefined && bSelected!=null) {
            this.bSelected = bSelected;
        }

        if( this.bSelected == true &&
            this.big_pcs_code!=undefined &&
            this.big_pcs_code!=null &&
            this.big_pcs_code!='') {
            /*this.addLotAction.enable();
            this.addRequestWorkOrderAction.enable();
            this.cancleLotAction.enable();
            this.addPaintLotAction.enable();*/
        } else {
           /* this.addLotAction.disable();
            this.addRequestWorkOrderAction.disable();
            this.cancleLotAction.disable();
            this.addPaintLotAction.disable();*/
        }
    }

});
