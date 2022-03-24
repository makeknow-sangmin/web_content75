Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx.view.stockMgmt.StockMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'stock-mgmt-view',


    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        /*this.addSearchField (
         {
         field_id: 'standard_flag'
         ,store: "StandardFlagStore"
         ,displayField:   'code_name_kr'
         ,valueField:   'system_code'
         ,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
         });	*/

        /*this.addSearchField (
         {
         field_id: 'stock_check'
         ,store: "CodeYnStore"
         ,displayField: 'codeName'
         ,valueField: 'systemCode'
         ,innerTpl	: '{codeName}'
         });*/
        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                this.addSearchField('item_code');
                this.addSearchField('item_name');
                this.addSearchField('specification');
                break;
            default:
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'stocklinesrcahd',
                    tableName: 's',
                    field_id: 'item_code',
                    fieldName: 'item_code',
                    params: {
                        delete_flag: 'N'

                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'stocklinesrcahd',
                    tableName: 's',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                        delete_flag: 'N'

                    }
                });

                break;
        }

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gMain.selPanel.refreshStandard_flag(record);

        });

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.StockLine', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            vCompanyReserved4 == 'SKNH01KR' ? 10000000 : gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });
        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahdGo', {
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

        this.insertStockAction = Ext.create('Ext.Action',{
            iconCls: 'af-plus',
            text: '임의입고',
            disabled: false,
            handler: function(widget, event) {

                gm.me().insertStockForm();
            }
        });

        this.createStockAction = Ext.create('Ext.Action',{
            iconCls: 'af-plus',
            text: '자재추가',
            disabled: true,
            handler: function(widget, event) {

                gm.me().stockForm();
            }
        });

        this.printPDFSiAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '재고조사표',
            disabled: false,
            handler: function(widget, event) {

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
                            fieldLabel: '재고조사일',
                            xtype:'datefield',
                            name:'req_date',
                            format: 'Y-m-d',
                            value: new Date()
                        }
                    ]//item end..

                });//Panel end...
                prwin = gMain.selPanel.prwinopen2(form);
            }
        });

         // 창고 입고
         this.addGoodsinAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '자재입고 ',
            tooltip: '자재 입고',
            disabled: true,
            handler: function () {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        //                    		        // border: 0,
                        //                    	            dockedItems: [
                        //                    	              {
                        //                    				      dock: 'top',
                        //                    				    xtype: 'toolbar',
                        //                    					items: [this.resetAction, '-', this.modRegAction/*, '-', copyRevAction*/]
                        //                    				  }],
                        items: [

                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('uid_srcahd'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('maker_name'),
                                xtype: 'textfield',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                value: rec.get('maker_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('model_no'),
                                xtype: 'textfield',
                                id: gu.id('model_no'),
                                name: 'model_no',
                                value: rec.get('model_no'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('description'),
                                xtype: 'textfield',
                                id: gu.id('description'),
                                name: 'description',
                                value: rec.get('description'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            }, {
                                fieldLabel: gm.me().getColName('comment'),
                                xtype: 'textfield',
                                id: gu.id('comment'),
                                name: 'comment',
                                value: rec.get('comment'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            }, {
                                xtype: 'fieldset',
                                border: true,
                                // style: 'border-width: 0px',
                                title: panelSRO1186 + ' | ' + '적재 위치',
                                collapsible: false,
                                defaults: {
                                    labelWidth: 100,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'numberfield',
                                            minValue: 0,
                                            width: 100,
                                            id: gu.id('wh_qty'),
                                            name: 'wh_qty',
                                            fieldLabel: gm.me().getColName('bm_quan'),
                                            allowBlank: true,
                                            value: '1',
                                            margins: '5'
                                        }, {
                                            flex: 1,
                                            name: 'stock_pos',
                                            xtype: 'textfield',
                                            fieldLabel: '위치'

                                        }
                                        ]
                                    }
                                ]
                            }, {


                                fieldLabel: '입고사유',
                                xtype: 'textfield',
                                name: 'innout_desc',
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 입고',
                        width: 500,
                        height: 430,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);

                                    gm.me().addStockIn(val);

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        }); // 창고 입고


        this.reReceiveAction2 = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출 요청',
            tooltip: '불출 요청',
            disabled: true,
            handler: function() {
                var my_child = new Array();
                
                var selections = gm.me().grid.getSelectionModel().getSelection();
                
                console_logs('selections>>불출요청 in', selections);
                if (selections.length) {
                       var rec = selections[0];
                       gMain.selPanel.rec = rec;
                         var stoqty_uids=[];
                         var pr_quans=[];
                         var whs=[];
                         var item_names=[];
                         var childs=[];
                         var mycart_uids=[];
                         for(var i=0;i<selections.length;i++){
                             var o = selections[i];
                             mycart_uids.push(o.get('uid_srcahd'));
                             childs.push(o.get('child'));
                             //whs.push(o.get('wh_qty'));
                             //pr_quans.push(o.get('pr_quan'));
                             item_names.push(o.get('item_name'));
                             console_logs("stoqty_uids>>>"+stoqty_uids);
                             console_logs("pr_quans>>>>>>>"+pr_quans);
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
                                fieldLabel: '수량',
                                xtype:'numberfield',
                                name:'pr_quan'
                                
                            },
                            {
                                fieldLabel: '불출요청일자',
                                xtype:'datefield',
                                name:'req_date',
                                format: 'Y-m-d',
                                value: new Date()
                            }

                        ]//item end..

                    });//Panel end...

                    prWin = Ext.create('Ext.Window', {
                        modal : true,
                        title: '불출 요청',
                        width: 600,
                        height: 150,
                        plain:true,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function(btn){

                                var form = gu.getCmp('formPanel').getForm();
                                var val = form.getValues(false)
                                gMain.setCenterLoading(true);
                                for(var i=0;i<selections.length;i++){
                                    pr_quans.push(val['pr_quan']);
                                };
                             

                                
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequestGo',
                                        params:{
                                            mycart_uids:mycart_uids,
                                            stoqty_uids: stoqty_uids,
                                            child:childs,
                                            pr_quan: pr_quans,
                                            item_name:item_names[0],
                                            wh_qtys:whs,
                                            reserved1:'Y',
                                            req_date:val['req_date']
                                        },

                                        success : function(result, request) {
                                            Ext.Msg.alert('안내', '요청하었습니다.', function() {});
                                            gMain.selPanel.store.load(function() {
                                               gMain.setCenterLoading(false);
                                            });
                                        },//endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });//endofajax
                                

                                if(prWin) {
                                    prWin.close();
                                }

                            }//btn handler
                        },{
                            text: CMD_CANCEL,
                            handler: function(){
                                if(prWin) {
                                    gMain.setCenterLoading(false);
                                    prWin.close();
                                }
                            }
                        }]
                    });
                    prWin.show();

               }//endof if selectios
            }
       });

       this.createGoutAction = Ext.create('Ext.Action', {
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        text: '출고 확인',
        tooltip: '출고 확인',
        disabled: false,
        handler: function () {

            var uids = [];
            var quanArr = [];
            var priceArr = [];
            var childArr = [];
            var stoqArr = [];
            var whArr = [];
            var usefulArr = [];
            var stocArr = [];
            var acUids = [];
            var stockPosArr = [];
            var selections = gm.me().grid.getSelectionModel().getSelection();

            if (selections.length) {
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];

                    var cartmapuids = rec.get('id');
                    var quans = rec.get('quan');
                    //var sales_prices = rec.get('sales_price');
                    var childs = rec.get('child');
                    var stoqty_uids = rec.get('stoqty_uid');
                    //var wh_qtys = rec.get('wh_qty');
                    //var stock_qty_usefuls = rec.get('stock_qty_useful');
                    var stock_qtys = rec.get('stock_qty');
                    var ac_uid = rec.get('ac_uid');
                    var stock_pos = rec.get('stock_pos');
                    uids.push(cartmapuids);
                   // quanArr.push(quans);
                   // priceArr.push(sales_prices);
                    childArr.push('null');
                    stoqArr.push(stoqty_uids);
                    //whArr.push(wh_qtys);
                    //usefulArr.push(stock_qty_usefuls);
                    stocArr.push(stock_qtys);
                    acUids.push('null');
                    stockPosArr.push(stock_pos);
                    //console_logs("quanArr>>>>>>>>>>>>>출고확인 여러개" + quanArr);
                    //console_logs("uids>>>>>>>>>>>>>출고확인 여러개" + uids);

                }

                if (uids == undefined || uids < 0) {
                    Ext.Msg.alert("알 림", "선택선택된 자재가 없습니다.");
                } else {

                    var form = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanel'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        bodyPadding: 15,
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
                                fieldLabel: '수량',
                                xtype:'numberfield',
                                name:'pr_quan'
                                
                            },
                            {
                                fieldLabel: '출고 날짜',
                                xtype: 'datefield',
                                id: gu.id('reserved_timestamp1'),
                                name: 'reserved_timestamp1',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                format: 'Y-m-d',
                                value: new Date()
                            },
                        ]//item end..

                    });//Panel end...
                    myHeight = 125;

                  

                    prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '출고 확인',
                        width: 400,
                        height: myHeight,
                        plain: true,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                var msg = '출고 확인하시겠습니까?'
                                var myTitle = '출고 확인';
                                Ext.MessageBox.show({
                                    title: myTitle,
                                    msg: msg,

                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {

                                        if(btn=='yes') {
                                            var form = gu.getCmp('formPanel').getForm();

                                            var val = form.getValues(false);
                                            //prWin.setLoading(true);
                                            for(var i=0;i<selections.length;i++){
                                                quanArr.push(val['pr_quan']);
                                            };
                                            form.submit({
                                                url: CONTEXT_PATH + '/purchase/request.do?method=createOutGrEasyMes',
                                                waitMsg : '출고 중입니다...',
                                                params: {
                                                    cartmap_uids: uids,
                                                    quans: quanArr,
                                                    childs: childArr,
                                                    stoqty_uids: stoqArr,
                                                    wh_qtys: whArr,
                                                    //stock_qty_usefuls: usefulArr,
                                                    stock_qtys: stocArr,
                                                    ac_uids: acUids,
                                                    stock_positions: stockPosArr
                                                },
                                                success: function () {
                                                    Ext.Msg.alert('안내', '출고 확인하였습니다.');
                                                    gm.me().storeLoad();
                                                    prWin.close();
                                                 },
                                                 failure: function (e) {
                                                    console_logs('----failure----', e); 
                                                    Ext.Msg.alert('안내', '출고에 실패하였습니다.');
                                                     //Ext.Msg.alert('안내', e);
                                                     gm.me().storeLoad();
                                                     prWin.close();
                                                 }
                                            });
                                        } else {
                                            prWin.close();
                                        }

                                    }//fn function(btn)

                                });//show
                            }//btn handler
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }]
                    });
                    prWin.show();
                }

            }

          

        }//handler end...

    });
        

        this.editAction.setText('상세보기');

        this.addTabCartLineGridPanel('상세보기', 'PMS1_SUB', {
                pageSize: 100,
                //model: 'Rfx.store.CartMapStore',
                dockedItems: [

                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '->',
//		 	   		    	excelPrint,
                        ]
                    }
                ],
                sorters: [{
                    property: 'serial_no',
                    direction: 'ASC'
                }]
            },

            function(selections) {
                if (selections.length) {
                    var rec = selections[0];
                    console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
                    gMain.selPanel.selectPcsRecord = rec;
                    gMain.selPanel.parent = rec.get('parent');
                    gMain.selPanel.selectSpecification = rec.get('specification');

                } else {

                }
            },
            'cartLineGrid'//toolbar
        );


        this.setRowClass(function (record, index) {

            //console_logs('record', record);
            var c = record.get('item_type');
            //console_logs('c', c);
            switch (c) {
                case 'S':
                    return 'gray-row';
                    break;
                default:
                    break;
            }

        });

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                gMain.selPanel.stockviewType = 'ALL';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function () {
                });
            }
        });

        this.setRawMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'RAW';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '공구',
            tooltip: '공구 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'SUB';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R1');
                gMain.selPanel.store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '기타소모품',
            tooltip: '기타소모품 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'MRO';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
                gMain.selPanel.store.load(function () {
                });
            }
        });

        this.myCartStore.load(function () {
        });

        this.updateStockMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-upload_14_0_5395c4_none',
            text: 'STOCK등록/해제',
            tooltip: 'STOCK 자재로 등록합니다. 이미 등록이 되어 있으면 해제합니다',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var srcahd_uid = rec.get('uid_srcahd');
                    var item_type = rec.get('item_type');

                    if(item_type == 'S') {
                        gm.editAjax('srcahd', 'item_type', 'N', 'unique_id', srcahd_uid,  {type:''});
                    } else {
                        gm.editAjax('srcahd', 'item_type', 'S', 'unique_id', srcahd_uid,  {type:''});
                    }

                }

                gm.me().showToast('셀수정 결과', '선택한 자재를 STOCK 자재로 등록 혹은 해제 하였습니다.');
                gm.me().grid.getSelectionModel().deselectAll();
                gm.me().storeLoad();
            }
        });

        this.createPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: gm.getMC('CMD_Out_cart_in', '불출카트 담기'),
            tooltip: '불출요청용 카트 담기',
            disabled: true,
            handler: function (widget, event) {

                var srcahd_uids = new Array();
                var stoqty_uids = new Array();
                var item_codes = new Array();
                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
//				    if (selections) {
                var arrExist = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    //var stoqty_uid = rec.get('unique_id');
                    var stoqty_uid = rec.get('stoqty_uid');
                    var srcahd_uid = rec.get('uid_srcahd');
                    var item_name = rec.get('item_name');
                    var item_code = rec.get('item_code');
                    var delete_flag = rec.get('delete_flag');
                    console_logs('delete_flag----------------', delete_flag);
                    arrExist.push(srcahd_uid);

                    console_logs('stoqty_uid----------------', stoqty_uid);
                    console_logs('isExistMyCart 전----------------');
                    var bEx = gm.me().isExistMyCart(stoqty_uid);
                    console_logs('isExistMyCart 후----------------');
                    console_logs('bEx----------------결과', bEx);

                    if (bEx == 'false') {
                        console_logs('stoqty_uid----------------false안', stoqty_uid);
                        srcahd_uids.push(srcahd_uid);
                        stoqty_uids.push(stoqty_uid);
                        item_codes.push(item_code);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
                            params: {
                                srcahd_uids: srcahd_uids,
                                item_codes: item_codes,
                                stoqty_uids: stoqty_uids,
                                reserved1: 'N'
                            },
                            success: function (result, request) {
                                gm.me().myCartStore.load(function () {
                                    var resultText = result.responseText;
                                    Ext.Msg.alert('안내', '카트 담기 완료.', function () {
                                    });
                                });
                            },

                        }); //end of ajax

                    } else {
                        arrExist.push('[' + item_code + '] \'' + item_name + '\'');

                        Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 불출요청 카트에 담겨져 있습니다.<br/> 불출 요청 후 다시 불출요청 카트에 담아주세요.');

                    }

                }

                /*	if(stoqty_uids.length>0) {
                 Ext.Ajax.request({
                 url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
                 params: {
                 srcahd_uids: srcahd_uids,
                 item_codes: item_codes,
                 stoqty_uids: stoqty_uids
                 },
                 success : function(result, request){
                 gm.me().myCartStore.load(function() {
                 var resultText = result.responseText;
                 Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
                 });
                 },

                 }); //end of ajax
                 }else{

                 Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 불출요청 카트에 담겨져 있습니다.<br/> 불출 요청 후 다시 불출요청 카트에 담아주세요.');
                 }*/


//				 switch(gMain.selPanel.stockviewType) {
//				 case 'ALL':
//					 alert("자재를 먼저 선택해 주세요");
//					 break;
//				 default:
//					 break;
//				 }
            }
        });


        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gMain.selPanel.printBarcode();
            }
        });

        this.assignMaterialAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '할당',
            tooltip: '할당',
            disabled: true,
            handler: function () {
                gMain.selPanel.assginMaterial();
            }
        });

        this.withdrawMaterialAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '할당해제',
            tooltip: '할당해제',
            disabled: true,
            handler: function () {
                var win = Ext.create('ModalWindow', {
                    title: '메시지',
                    html: '<br><p style="text-align:center;">프로젝트 할당을 해제 하시겠습니까?</p>',
                    width: 300,
                    height: 120,
                    buttons: [{
                        text: '예',
                        handler: function () {
                            gMain.selPanel.withdrawMaterial();
                            if (win) {
                                win.close();
                            }
                        }
                    },
                        {
                            text: '아니오',
                            handler: function () {
                                if (win) {
                                    win.close();
                                }
                            }
                        }]
                });
                win.show();
            }
        });

        //요청접수 Action 생성
        this.reReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '구매 요청',
            tooltip: '구매 요청',
            disabled: true,
            handler: function () {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {

                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        var child = rec.get('child');
                        uids.push(unique_id);
                        uids.push(child);
                    }

                    Ext.MessageBox.show({
                        title: '확인',
                        msg: '요청 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {

                                Ext.Ajax.request({
//	            					url: CONTEXT_PATH + '/purchase/prch.do?method=create',
                                    url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
                                    params: {
                                        unique_uids: uids,
                                        child: uids
                                    },

                                    success: function (result, request) {
                                        gMain.selPanel.store.load();
                                        Ext.Msg.alert('안내', '요청접수 되었습니다.', function () {
                                        });

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax

                            }
                        },
                        //animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });

                }//endof if selectios
            }
        });
        // 출고 버튼
        this.outGoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '자재출고 ',
            tooltip: '자재출고',
            disabled: true,
            handler: function () {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    /*Ext.Ajax.request({
                     url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                     params: {
                     srcahd_uids: uids
                     },
                     success : function(result, request){
                     var resultText = result.responseText;

                     Ext.Msg.alert('안내', '자재 출고 완료.', function() {});

                     },
                     failure: extjsUtil.failureMessage
                     }); //end of ajax
                     */
                }


            }
        });

        //버튼 추가.
        buttonToolbar.insert(2, '-');
//       buttonToolbar.insert(7, this.setMisMatView);
//       buttonToolbar.insert(7, this.setSubMatView);
//       buttonToolbar.insert(7, this.setSaMatView);
//       buttonToolbar.insert(7, this.setRawMatView);
//       buttonToolbar.insert(7, this.setAllMatView);

        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                buttonToolbar.insert(1, this.printPDFSiAction);
                buttonToolbar.insert(1, this.createStockAction);
                
                break;
            default:
                buttonToolbar.insert(1, this.withdrawMaterialAction);
                buttonToolbar.insert(1, this.assignMaterialAction);
                break;
        }
        buttonToolbar.insert(1, this.printBarcodeAction);
        buttonToolbar.insert(1, this.createPoAction);
        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.addGoodsinAction);
        buttonToolbar.insert(1, this.createGoutAction);
        
        // buttonToolbar.insert(8,'-');
        //buttonToolbar.insert(8,this.reReceiveAction);
        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];

                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gMain.selPanel.vSELECTED_STOCK_UID = rec.get('stoqty_uid');
                gMain.selPanel.createPoAction.enable();
                gMain.selPanel.updateStockMatAction.enable();
                gMain.selPanel.printBarcodeAction.enable();
                gm.me().addGoodsinAction.enable();
                gm.me().createGoutAction.enable();
                if (rec.get('pj_uid') < 0) {
                    gMain.selPanel.assignMaterialAction.enable();
                    gMain.selPanel.withdrawMaterialAction.disable();
                } else {
                    gMain.selPanel.withdrawMaterialAction.enable();
                    gMain.selPanel.assignMaterialAction.disable();
                }

                this.cartLineGrid.getStore().getProxy().setExtraParam('item_code', rec.get('item_code'));
                this.cartLineGrid.getStore().getProxy().setExtraParam('is_combined', 'N');
                this.cartLineGrid.getStore().load();

            } else {
                gMain.selPanel.createPoAction.disable();
                gMain.selPanel.printBarcodeAction.disable();
                gMain.selPanel.updateStockMatAction.disable();
                gMain.selPanel.assignMaterialAction.disable();
                gMain.selPanel.withdrawMaterialAction.disable();
                gm.me().addGoodsinAction.disable();
                gm.me().createGoutAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        
        
         this.store.load(function (records) {
         });


    },
    items: [],
    matType: 'RAW',
    stockviewType: "ALL",
    refreshStandard_flag: function (record) {
        console_logs('val', record);
        var spcode = record.get('systemCode');
        var s_flag = spcode.substring(0, 1);
        console_logs('spcode', s_flag);


        var target = this.getInputTarget('standard_flag');
        target.setValue(s_flag);

    },
    isExistMyCart: function (inId) {
        console_logs('inId--------------------------------', inId);
//        	 STOQTY_UID == INID
        var bEx = false; // Not Exist
        console_logs('inId 직후--------------------------------');

        Ext.Ajax.request({
            async: false, 
            url: CONTEXT_PATH + '/purchase/request.do?method=getMycartByStoqtyUid',
            params: {
                stoqty_uid: inId
            },

            success: function (result, request) {
                console_logs('ajax 안 --------------------------------');
                var result = result.responseText;
                var jsonData = Ext.JSON.decode(result);
                console_logs('jsonData++++++++++++++', jsonData);
                bEx = jsonData.result;
                console_logs('bEx++++++++++++++', bEx);

            },//endofsuccess

        });//endofajax
        return bEx;


    },
    loadStore: function (child) {

        this.store.getProxy().setExtraParam('child', child);

        this.store.load(function (records) {
            console_logs('==== storeLoadCallback records', records);
            console_logs('==== storeLoadCallback store', store);

        });

    },

    printBarcode: function () {

        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
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
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                }  // end of xtype
                            ]  // end of itmes
                        }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('pj_barcode');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },

    prbarcodeopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('uid_srcahd');  //Material unique_id
                        uniqueIdArr.push(uid);
                    }

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url : CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeSrcahd',
                        params:{
                            unique_ids: uniqueIdArr
                        },
                        success: function(val, action){
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function(){});
                        }
                    });


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    assginMaterial: function () {

        var form = null;
        var mStore = Ext.create('Mplm.store.ProjectStore');

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            width: 600,
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
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        {
                            fieldLabel: '할당프로젝트',
                            labelWidth: 80,
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'ac_uid_to',
                            mode: 'local',
                            displayField: 'pj_name',
                            store: mStore,
                            sortInfo: {field: 'pj_name', direction: 'DESC'},
                            valueField: 'unique_id',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{pj_code}] {pj_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '할당수량',
                            labelWidth: 80,
                            xtype: 'numberfield',
                            name: 'target_qty',
                            width: 150,
                            allowBlank: false
                        }
                    ]
                }
            ]

        });//Panel end...

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.assginmaterialopen(form);
        }
    },

    assginmaterialopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '할당 할 프로젝트를 지정하십시오',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var rec = selections[0];

                    var stoqty_uid = rec.get('unique_id');  //Product unique_id
                    var uid_srcahd = rec.get('uid_srcahd');

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url: CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
                        params: {
                            uid_srcahd: uid_srcahd,
                            stoqty_uid: stoqty_uid
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '할당 프로젝트를 지정하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '할당 프로젝트 지정에 실패하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        }
                    });


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    withdrawMaterial: function () {

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];

        var stoqty_uid = rec.get('unique_id');  //Product unique_id
        //var project_uid = rec.get('pj_uid');
        var uid_srcahd = rec.get('uid_srcahd');
        var target_qty = rec.get('wh_qty');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
            params: {
                stoqty_uid: stoqty_uid,
                ac_uid_to: -1,
                target_qty: target_qty,
                uid_srcahd: uid_srcahd
            },
            success: function (val, action) {
                Ext.Msg.alert('완료', '프로젝트 할당을 해제하였습니다.');
                gMain.selPanel.store.load(function () {
                });
            },
            failure: function (val, action) {

            }
        });
    },

    addTabCartLineGridPanel: function(title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
//		    	 setEditPanelTitle();
                if(success ==true) {
                    try { this.callBackWorkListCHNG(title, records, arg, fc, id); } catch(e) { console_logs('callBackWorkListCHNG error', e);}
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
    callBackWorkListCHNG: function(title, records, arg, fc, id) {
        var gridId = id== null? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        this.cartLineStore = Ext.create('Rfx.store.StockMtrlStore');
        //this.cartLineStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_UNIQUE_ID);

        var ClaastStore = Ext.create('Mplm.store.ClaastStore', {});
        ClaastStore.getProxy().setExtraParam('stock_pos', 'ND');

        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            store: this.cartLineStore,
            title: title,
            cls : 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout :'fit',
            //forceFit: true,
            dockedItems: dockedItems,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            plugins: [cellEditing],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        id: gu.id('stock_pos'),
                        fieldLabel: '재고선택',
                        width: 200,
                        field_id:  'unique_id_long',
                        allowBlank: true,
                        name: 'stock_pos',
                        xtype: 'combo',
                        emptyText: '재고 위치 검색',
                        anchor: '-5',
                        store: ClaastStore,
                        displayField: 'class_code',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        sortInfo: {
                            field: 'item_code',
                            direction: 'ASC'
                        },
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: true,
                        hideTrigger: true,
                        anchor: '100%',
                        valueField: 'class_code',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function() {
                                return '<div><a class="search-item">' +
                                    '<font color=#999><small>{unique_id}</small></font> <font color=#333>{class_code}</font><br />' +
                                    '</a></div>';
                            }
                        }//,
                        //pageSize: 10
                    },
                    {
                        xtype:'button',
                        text: '추가',
                        iconCls : 'af-plus-circle',
                        style: 'margin-left: 3px;',
                        handler: function() {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=copystockqty',
                                params:{
                                    stoqty_uid: gm.me().cartLineGrid.getStore().data.items[0].id,
                                    class_code: gu.getCmp('stock_pos').value
                                },
                                success : function(result, request) {
                                    gm.me().cartLineGrid.getStore().load();
                                },
                                failure: function(val, action){

                                }
                            });
                        }
                    },
                    {
                        xtype:'button',
                        text: '변경',
                        iconCls : 'af-refresh',
                        style: 'margin-left: 3px;',
                        handler: function() {

                            var cartLineGrid_t = gm.me().cartLineGrid.getStore().data.items;
                            var is_duplicated = false;
                            var selected_stock_pos = gu.getCmp('stock_pos').getValue();
                            var selectionModel = gm.me().cartLineGrid.getSelectionModel().getSelection()[0];

                            if(selected_stock_pos == selectionModel.get('stock_pos')) {
                                is_duplicated = true;
                            } else {
                                for (var i = 0; i < cartLineGrid_t.length; i++) {
                                    if (selected_stock_pos == cartLineGrid_t[i].data.stock_pos) {
                                        is_duplicated = true;
                                    }
                                }
                            }

                            if(is_duplicated) {
                                Ext.Msg.alert('경고', '선택하신 재고 위치는 이미 할당 되어 있습니다.');
                            } else {
                                gm.editAjax('stoqty', 'stock_pos', selected_stock_pos, 'unique_id', selectionModel.getId(),  {type:''});
                                gm.me().cartLineGrid.getStore().load();
                            }
                        }
                    },
                    {
                        xtype:'button',
                        text: gm.getMC('CMD_DELETE', '삭제'),
                        iconCls : 'af-remove',
                        style: 'margin-left: 3px;',
                        handler: function(){
                            var stoqty_uids = [];

                            if(gm.me().selected_rec != null && gm.me().selected_rec.length > 0) {
                                for(var i = 0; i < gm.me().selected_rec.length; i++) {
                                    stoqty_uids.push(gm.me().selected_rec[i].data.id);
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                                    params: {
                                        DELETE_CLASS: 'stoqty',
                                        uids: stoqty_uids
                                    },
                                    success : function(result, request) {
                                        gm.me().cartLineGrid.getStore().load();
                                    },
                                    failure: function(val, action){

                                    }
                                });
                            }
                        }
                    }
                ] }],
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function(selModel, record, index, options){

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gMain.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown:function (cartLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gm.me().selected_rec = selections;
            }
        });
        var view = this.cartLineGrid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function(e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);

            },
            up: function(e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);

            }
        });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.cartLineGrid);
    },
    prwinopen2: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '재고조사표 작성',
            width: 400,
            height: 100,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn){

                    var form = gu.getCmp('formPanel').getForm();
                    var result_length = gm.me().store.data.length;
                    var val = form.getValues(false);

                    if(result_length > 0) {
                        var rec = gm.me().grid.getSelectionModel().getSelection();

                        var srcahd_uids = [];

                        for(var i = 0; i < rec.length; i++) {
                            srcahd_uids.push(rec[i].get('uid_srcahd'));
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/pdf.do?method=printSi',
                            params:{
                                srcahd_uids : srcahd_uids,
                                req_date : val['req_date'],
                                pdfPrint : 'pdfPrint',
                                is_rotate : 'N'
                            },
                            reader: {
                                pdfPath: 'pdfPath'
                            },
                            success : function(result, request) {
                                var jsonData = Ext.JSON.decode(result.responseText);
                                var pdfPath = jsonData.pdfPath;
                                console_log(pdfPath);
                                if(pdfPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                                    top.location.href=url;
                                }
                            },
                            failure: extjsUtil.failureMessage
                        });
                    } else {
                        Ext.Msg.alert('경고', '검색 결과가 없는 상태에서 PDF를 출력 할 수 없습니다.');
                    }

                    if(prWin) {
                        prWin.close();
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
    
    stockForm : function(){
        var checkItem_code = false;
        var checkItem_name = false;
        
        var createPartForm = Ext.create('Ext.form.Panel', {
            title: '입력폼',
            xtype: 'form',
            width: 600,
            height: 500,
            bodyPadding: 15,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            defaults: {
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [
            {
                xtype: 'displayfield',
                value: '신규 자재를 등록합니다.'
            }, {
                xtype: 'fieldset',
                    title: '필수항목', 
                    collapsible: false,
                    defaults: {
                        labelWidth: 40,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {
                                top: 0,
                                right: 3,
                                bottom: 0,
                                left: 0
                            }
                        }
                    },
                    items:[
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '10 0 5 0',
                            defaults: {
                                    msgTarget: 'side',
                                    allowBlank: true,
                                    labelWidth: 60
                                },
                            items: [{
                                    fieldLabel: gm.me().getColName('item_code') + '*',
                                    xtype: 'textfield',
                                    id: gu.id('item_code'),
                                    name: 'item_code',
                                    emptyText: '품목코드',
                                    flex: 1,
                                    readOnly: false,
                                    width: '50%',
                                    allowBlank : false
                                },
                                {
                                    xtype: 'button',
                                    text:'중복체크',
                                    anchor: '20%',
                                    margin: '0 17 0 20',
                                    handler: function(a,b) {
                                        
                                        var allData = gm.me().grid.getStore().data.items;
                                        var allItems = [];
                                        for(var i=0; i<allData.length; i++){
                                            allItems.push(allData[i].get('item_code'));
                                        }

                                        var isItem = (allItems.indexOf(item_code)!== -1);

                                        if(isItem){
                                            Ext.MessageBox.alert('알림', '중복코드입니다.');
                                        }else{
                                            Ext.MessageBox.alert('알림', '사용가능');
                                            checkItem_code = true;
                                        }

                                        }
                                    }
                                ]
                        },
                        {
                            xtype: 'container',
                            msgTarget: 'side',
                            layout:'vbox',
                            anchor: '100%',
                            defaults: {
                                msgTarget: 'side',
                                allowBlank: true,
                                labelWidth: 60
                            },
                            items:[
                                {
                                    xtype: 'textfield',
                                    labelWidth: 60,
                                    fieldLabel: gm.me().getColName('item_name') + '*',
                                    id: gu.id('item_name'),
                                    name: 'item_name',
                                    allowBlank: false,
                                    width: '84%'
                                },
                                {
                                    xtype: 'textfield',
                                    labelWidth: 60,
                                    fieldLabel: gm.me().getColName('specification') + '*',
                                    id: gu.id('specification'),
                                    name: 'specification',
                                    allowBlank: false,
                                    width: '84%'
                                },
                                {
                                    xtype: 'textfield',
                                    labelWidth: 60,
                                    fieldLabel: '모델명',
                                    id: gu.id('model_no'),
                                    name: 'model_no',
                                    allowBlank: true,
                                    width: '84%'
                                },
                                {
                                    xtype: 'textfield',
                                    labelWidth: 60,
                                    fieldLabel: '자재위치',
                                    id: gu.id('stock_pos'),
                                    name: 'stock_pos',
                                    allowBlank: true,
                                    width: '84%'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '수량*',
                                    minValue: 0,
                                    id: gu.id('bm_quan'),
                                    name: 'bm_quan',
                                    allowBlank: true,
                                    value: '1',
                                    margins: '0'
                                },
                                
                                
                            ]

                        }
                        
                        
                    ]
            },
            {
                xtype: 'fieldset',
                    title: '옵션', 
                    collapsible: false,
                    margin: '10 0 5 0',
                    defaults: {
                        labelWidth: 40,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {
                                top: 0,
                                right: 3,
                                bottom: 0,
                                left: 0
                            }
                        }
                    },
                    items:[
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {
                                    msgTarget: 'side',
                                    allowBlank: true,
                                    labelWidth: 60
                                },
                            items:[
                                {
                                    xtype: 'textfield',
                                    fieldLabel: gm.me().getColName('maker_name'),
                                    id: gu.id('maker_name'),
                                    name: 'maker_name',
                                    allowBlank: true
                                },
                                {
                                    id: gu.id('unit_code'),
                                    name: 'unit_code',
                                    xtype: 'combo',
                                    margin: '0 0 0 50',
                                    mode: 'local',
                                    editable: true,
                                    allowBlank: true,
                                    queryMode: 'remote',
                                    displayField: 'codeName',
                                    valueField: 'codeName',
                                    value: 'EA',
                                    triggerAction: 'all',
                                    fieldLabel: gm.me().getColName('unit_code'),
                                    store: gm.me().commonUnitStore,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            console_log('Selected Value : ' + combo.getValue());
                                            var systemCode = record.get('systemCode');
                                            var codeNameEn = record.get('codeNameEn');
                                            var codeName = record.get('codeName');
                                            console_log('systemCode : ' + systemCode +
                                                ', codeNameEn=' + codeNameEn +
                                                ', codeName=' + codeName);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '10 0 5 0',
                            defaults: {
                                msgTarget: 'side',
                                allowBlank: true,
                                labelWidth: 60
                            },
                            items:[
                                {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    //flex: 1,
                                    id: gu.id('sales_price'),
                                    name: 'sales_price',
                                    fieldLabel: gm.me().getColName('sales_price'),
                                    allowBlank: true,
                                    value: '0'
                                },
                                {
                                    id: gu.id('currency'),
                                    name: 'currency',
                                    xtype: 'combo',
                                    margin: '0 0 0 50',
                                    mode: 'local',
                                    editable: true,
                                    allowBlank: true,
                                    queryMode: 'remote',
                                    displayField: 'codeName',
                                    valueField: 'codeName',
                                    value: 'KRW',
                                    triggerAction: 'all',
                                    fieldLabel: gm.me().getColName('currency'),
                                    store: gm.me().commonCurrencyStore,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            console_log('Selected Value : ' + combo.getValue());
                                            var systemCode = record.get('systemCode');
                                            var codeNameEn = record.get('codeNameEn');
                                            var codeName = record.get('codeName');
                                            console_log('systemCode : ' + systemCode +
                                                ', codeNameEn=' + codeNameEn +
                                                ', codeName=' + codeName);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '10 0 5 0',
                            defaults: {
                                msgTarget: 'side',
                                allowBlank: true,
                                labelWidth: 60
                            },
                            items:[
                                
                                {
                                    xtype: 'textfield',
                                    width: '100%',
                                    fieldLabel: gm.me().getColName('comment'),
                                    id: gu.id('comment'),
                                    name: 'comment',
                                    allowBlank: true
                                },
                            ]
                        }
                        
                    ]
                }
                
                
                
            ]
        });

        var winPart = Ext.create('ModalWindow', {
            title: '자재 추가',
            width: 700,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            items:
                [{
                    region: 'center',
                    xtype: 'tabpanel',
                    items: createPartForm
                }],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    
                    var form = gm.me().createPartForm;

                    if(!checkItem_code) {
                            Ext.MessageBox.alert('알림','품목코드 중복체크를 실행해주세요');
                        }else if(!checkItem_name){
                            Ext.MessageBox.alert('알림','품명및 규격 중복체크를 실행해주세요');
                        } else {
                            var box = Ext.MessageBox.wait('자재 추가중...', '알림');
                            // Ext.Ajax.request({
                            //     url: CONTEXT_PATH + '/design/bom.do?method=addPartUids',
                            //     params: {
                                   
                            //     },
                            //     success: function(result, request) {
                            //         box.hide();
                            //         winPart.close();
                            //         gm.me().store.load(function() {
                    
                            //             gm.me().grid.setLoading(false);
                            //         });

                            //     },
                            //     failure: extjsUtil.failureMessage
                            // });
                        }

                        if (winPart) {
                            winPart.close();
                        }
                      

                }
            }, {
                text: CMD_CANCEL,
                handler: function() {
                    if (winPart) {
                        winPart.close();
                    }
                }
            }]
        });
        winPart.show( /* this, function(){} */ );
    },

    addStockIn: function (val) {
        Ext.MessageBox.show({
            title: '창고 반입',
            msg: '창고로 반입하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',
                        params: {
                            unique_id: val['unique_id'],
                            barcode: val['unique_id'],
                            stock_pos: val['stock_pos'],
                            innout_desc: val['innout_desc'],
                            wh_qty: val['wh_qty'],
                            whouse_uid: 100
                        },

                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);


                            gm.me().getStore().load(function () {
                            });
                            //alert('finished..');

                        },
                        failure: extjsUtil.failureMessage

                    });//endof ajax request
                }


            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    insertStockForm : function(){
        var selections = gm.me().grid.getSelectionModel().getSelection();

        
    },
    selMode: 'MULTI',
    selCheckOnly: true,
    selAllowDeselect: true,
    selected_rec: null
});



