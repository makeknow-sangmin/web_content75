//자재 관리
Ext.define('Rfx2.view.company.hsct.purStock.MaterialMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-view',
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.setDefComboValue('standard_flag', 'valueField', 'R');
        this.addSearchField({
            type: 'combo'
           ,field_id:'sp_code'
           , displayField: 'codeName'
           , valueField: 'systemCode'
           , store: 'spCodeStore2'
           ,innerTpl: '<div data-qtip="{systemCode}"> {codeName}</div>'
       });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.hsct.HEAVY4_MaterialMgmt', [{
                property: 'item_code',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahd', {
            fields: this.fields
        });

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model: myCartModel,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });

        //grid 생성.
        this.createGrid(arr);

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.myCartStore.load(function () {
        });

        this.prAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls : 'fa-cart-arrow-down_14_0_5395c4_none',
            text : '구매 요청 ',
            tooltip : '구매를 요청',
            disabled : true,
            handler : function (widget, event) {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('강건마의 selection 값 확인법', selections);

                var item_code = selections[0].data.item_code;
                var item_name = selections[0].data.item_name;
                var specification = selections[0].data.specification;
                var unit_code = selections[0].data.unit_code;

                var formItems = Ext.create('Ext.form.Panel',{
                    id : gu.id('formItems'),
                    xtype : 'form',
                    frame : false,
                    border : false,
                    bodyPadding : 5,
                    region : 'center',
                    layout: 'form',
                    fieldDefaults : {
                        labelAlign : 'right',
                        msgTarget : 'side'
                    },
                    items : [
                        {
                            fieldLabel : '품번',
                            xtype : 'textfield',
                            anchor : '100%',
                            width : '99%',
                            name : 'item_code',
                            editable : false,
                            fieldStyle : 'background-color: #ddd; background-image: none;',
                            value : item_code
                        },
                        {
                            fieldLabel : '품명',
                            xtype : 'textfield',
                            anchor : '100%',
                            width : '99%',
                            name : 'item_name',
                            editable : false,
                            fieldStyle : 'background-color: #ddd; background-image: none;',
                            value : item_name
                        },
                        {
                            fieldLabel : '규격',
                            xtype : 'textfield',
                            anchor : '100%',
                            width : '99%',
                            name : 'specification',
                            editable : false,
                            fieldStyle : 'background-color: #ddd; background-image: none;',
                            value : specification
                        },
                        {
                            fieldLabel : '단위',
                            xtype : 'textfield',
                            anchor : '100%',
                            width : '99%',
                            name : 'unit_code',
                            editable : false,
                            fieldStyle : 'background-color: #ddd; background-image: none;',
                            value : unit_code
                        },
                        {
                            fieldLabel : '요청수량',
                            id : gu.id ('pr_quan'),
                            name : 'pr_quan',
                            xtype : 'numberfield',
                            anchor : '100%',
                            width : '99%',
                        },
                        {
                            fieldLabel : '요청일자',
                            id : gu.id ('pr_date'),
                            name : 'pr_date',
                            xtype : 'datefield',
                            anchor : '100%',
                            width : '99%',
                            submitFormat : 'Y-m-d',
                            dateFormat : 'Y-m-d',
                            format : 'Y-m-d',
                            value : new Date()
                        }
                    ] // item
                }); //formItems

                var form = Ext.create('Ext.form.Panel',{
                    id : gu.id('formPanel'),
                    xtype : 'form',
                    frame : false,
                    border : false,
                    region : 'center',
                    layout: 'form',
                    items : formItems
                }); // form

                var items = [form];
                var prWin = Ext.create('Ext.Window',{
                    modal : true,
                    title : '구매 요청',
                    width : 500,
                    height : 280,
                    plain : true,
                    items : items,
                    buttons : [{
                        text : CMD_OK,
                        handler : function(btn){
                            if(btn == "no"){
                                prWin.close();
                            }else{
                                if(form.isValid()){
                                    var val = form.getValues(false);
                                    var srcahd_uid = selections[0].data.unique_id;
                                    var item_abst = selections[0].get('item_name') + '외' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건';

                                    Ext.Ajax.request({
                                        url : CONTEXT_PATH + '/purchase/request.do?method=addprAction',
                                        params : {
                                            srcahd_uid : srcahd_uid,
                                            item_abst : item_abst,
                                            pr_quan : val.pr_quan,
                                            pr_date : val.pr_date
                                        },
                                        success : function (result, request) {
                                            Ext.Msg.alert('안내', '구매 요청하였습니다.', function () {
                                            });
                                            prWin.close();
                                        },
                                        failure: extjsUtil.failureMessage
                                    })// Ajax
                                }// else 안 if
                            }// if
                        }//handler
                    },{
                        text : CMD_CANCEL,
                        handler : function (btn){
                            prWin.close();
                        }
                    }]//buttons
                });// prWin
                prWin.show();
            } // handler
        }); // create

        //버튼 추가.
        buttonToolbar.insert(2, '-');
        buttonToolbar.insert(3, this.prAction);

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1) {
                buttonToolbar.items.remove(item);
            }
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().prAction.enable();
            } else {
                gm.me().prAction.disable();
            }
        })

        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('sp_code_list','S');
        this.store.load(function (records) {
        });
    },
    items: [],

    claastStore: Ext.create('Mplm.store.ClaAstStoreMt', {
        hasNull: false
    }),
    
});



