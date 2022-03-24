Ext.define('Rfx2.view.company.dabp01kr.purStock.HEAVY3_OrderMoneyView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'order-money-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;
        //검색툴바 필드 초기화
        this.initSearchField();

        switch (vCompanyReserved4) {
            case 'HSGC01KR':
                switch (this.link) {
                    case 'PPO3_MK':
                        var po_type = 'MK';
                        break;
                    default:
                        var po_type = 'MN';
                }
                this.addSearchField({
                    type: 'condition',
                    width: 170,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'r',
                    field_id: 'reserved_varcharb',
                    fieldName: 'reserved_varcharb',
                    params: {
                        rtg_type: 'O',
                        po_type: po_type
                    }
                });
                break;
            default:
                this.addSearchField(
                    {
                        field_id: 'date_type'
                        , store: "DatetypeStore"
                        , displayField: 'codeName'
                        , valueField: 'systemCode'
                        , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
                    });

                this.addSearchField({
                    type: 'dateRange',
                    field_id: 'listpodate',
                    labelWidth: 0,
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });

                this.addSearchField({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'project_varchar3',
                    fieldName: 'reserved_varchar3'
                });
                this.addSearchField({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'po_no',
                    fieldName: 'po_no'
                });
                this.addSearchField({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'seller_name',
                    fieldName: 'seller_name'
                });
                this.addSearchField({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'item_name',
                    fieldName: 'item_name'
                });

                switch (vCompanyReserved4) {
                    case 'DDNG01KR':
                        this.addSearchField('product_name_dabp');
                        break;
                    default:
                        break;
                }
                //Readonly Field 정의
                this.initReadonlyField();
                this.addReadonlyField('unique_id');
                this.addReadonlyField('create_date');
                this.addReadonlyField('creator');
                this.addReadonlyField('creator_uid');
                this.addReadonlyField('user_id');
                this.addReadonlyField('board_count');

                break;
        }

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Heavy3OrderMoney', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            , {}
            , ['xpoast']
        );
        this.store.getProxy().setExtraParam('route_type', null);

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = this.createMultiSearchToolbar({first: 9, length: 11});
            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();
            arr.push(searchToolbar);
        }

        this.createGrid(arr);

        // remove the items
        switch (vCompanyReserved4) {
            case 'HSGC01KR':
                (buttonToolbar.items).each(function (item, index, length) {
                    if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                        buttonToolbar.items.remove(item);
                    }
                });
                break;
            default:
                (buttonToolbar.items).each(function (item, index, length) {
                    if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                        buttonToolbar.items.remove(item);
                    }
                });
        }

        this.createPjOrderMoneyAction = Ext.create('Ext.Action',{
            iconCls: 'af-plus',
            text: '프로젝트 추가',
            tooltip: '프로젝트를 추가합니다.',
            disabled: false,
            handler: function() {
                gm.me().prwinopen();
            }
        });

        buttonToolbar.insert(0, this.createPjOrderMoneyAction);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        if (vCompanyReserved4 == 'HSGC01KR') {
            this.store.getProxy().setExtraParam('po_type', "MN");
        }
        this.store.load(function (records) {
        });

        this.grid.getSelectionModel().on({});
    },

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        switch (field) {
            case 'reserved_double1':
                gm.editAjax('rtgast', 'reserved_double1', rec.data.reserved_double1, 'reserved_varcharb', record.data.reserved_varcharb, {type: ''});
                gm.me().getStore().load();
                break;
            default:
                gm.editRedord(field, rec);

        }
    },

    prwinopen: function() {
        var prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '새로운 프로젝트 발주금액 등록',
            width: 400,
            height: 130,
            plain:true,
            items: this.formProject(),
            buttons: [{
                text: CMD_OK,
                handler: function(btn){

                    var form = gu.getCmp('formPanel').getForm();
                    var val = form.getValues(false);
                    var records = gm.me().grid.getStore().data.items;
                    var pj_flag = true;

                    if(val['reserved_varcharb'] == null) {
                        alert('프로젝트명을 입력하세요.');
                        pj_flag = false;
                    } else {
                        for(var i = 0; i < records.length; i++) {
                            if(val['reserved_varcharb'] == records[i].get('reserved_varcharb')) {
                                alert('프로젝트명이 중복 되었습니다.');
                                pj_flag = false;
                            }
                        }
                    }
                    if(pj_flag) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/prch.do?method=createPjOrderMoney',
                            params:{
                                reserved_varcharb: val['reserved_varcharb'],
                                reserved_double1 : val['reserved_double1'],
                            },
                            success: function(){
                                gm.me().getStore().load();
                            },
                            failure: function(){
                            }
                        });
                        if(prWin) {
                            prWin.close();
                        }
                    }
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

    formProject: function() {

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
                labelWidth: 80,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '프로젝트명',//ppo1_request,
                    xtype: 'textfield',
                    rows: 4,
                    anchor: '100%',
                    name: 'reserved_varcharb',
                    emptyText: '프로젝트명을 입력하세요'
                },
                {
                    fieldLabel: '원청발주금액',
                    xtype:'numberfield',
                    name:'reserved_double1'
                }
            ]//item end..
        });//Panel end...

        return form;
    }
});


