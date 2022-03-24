//자재 관리
Ext.define('Hanaro.view.designPlan.ProductMgmtHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'product-mgmt-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        //this.setDefComboValue('standard_flag', 'valueField', 'A');

        /*this.addSearchField (
         {
         field_id: 'standard_flag'
         ,store: "StandardFlagStore"
         ,displayField:   'code_name_kr'
         ,valueField:   'system_code'
         ,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
         });	*/

        // this.addSearchField (
        //     {
        //         field_id: 'stock_check'
        //         ,store: "CodeYnStore"
        //         ,displayField: 'codeName'
        //         ,valueField: 'systemCode'
        //         ,innerTpl	: '{codeName}'
        //     });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        //this.addSearchField('maker_name');
        this.addSearchField('old_item_code');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : [
                                'REMOVE'
                    ]		
        });
        this.myRemoveAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '삭제하기',
            disabled: true,
            handler: function(widget, event) {
                   Ext.MessageBox.show({
                       title: '삭제하기',
                       msg: '선택한 항목을 삭제하시겠습니까?',
                       buttons: Ext.MessageBox.YESNO,
                       fn: gm.me().deleteConfirm,
                       icon: Ext.MessageBox.QUESTION
                   });
            }
       });

       this.buttonToolbar.insert(4, this.myRemoveAction);

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.company.hanaro.ProductMgmtHanaro', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            ,{
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['assymap']
        );

        this.store.getProxy().setExtraParam('bom_flag', 'T');
		this.store.getProxy().setExtraParam('sg_code', 'BOM');
		this.store.getProxy().setExtraParam('parent', '-1');
		this.store.getProxy().setExtraParam('parent_uid', '-1');

        this.setRowClass(function(record, index) {

            var c = record.get('srcadt_varchar40');

            switch(c) {
                case 'Y':
                    return 'orange-row';
                    break;
                default:
                    break;
            }

        });

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.addCallback('SET_ITEM_CODE', function (o) {

            //KC 컨버터
            var srcadt_varchars = [];
            var sp_code = gm.me().getInputJust('extendsrcahd|sp_code').getValue();

            if(sp_code == null) {
                sp_code = '';
            }

            srcadt_varchars.push(sp_code);

            switch(sp_code) {
                case 'KC':
                    for(var i = 1; i < 8; i++) {
                        var val = gm.me().getInputJust('extendsrcahd|srcadt_varchar' + i).getValue();
                        if(val == null) {
                            val = '';
                        }
                        srcadt_varchars.push(val);
                    }

                    var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

                    var item_code = srcadt_varchars[0] + '-' + srcadt_varchars[1] + '-'
                        + srcadt_varchars[2] + srcadt_varchars[3] + '-' + srcadt_varchars[4] + srcadt_varchars[5]
                        + srcadt_varchars[6] + (srcadt_varchars[7].length > 0 ? '-' + srcadt_varchars[7] : '');

                    item_code_field.setValue(item_code);
                    break;
                case 'KB':
                    for(var i = 1; i < 9; i++) {
                        var val = gm.me().getInputJust('extendsrcahd|srcadt_varchar' + (i+8)).getValue();
                        if(val == null) {
                            val = '';
                        }
                        srcadt_varchars.push(val);
                    }

                    var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

                    var item_code = srcadt_varchars[0] + '-' + srcadt_varchars[1] + srcadt_varchars[2]
                        + srcadt_varchars[3] + '-' + srcadt_varchars[4] + srcadt_varchars[5] + srcadt_varchars[6]
                        + srcadt_varchars[7] + (srcadt_varchars[8].length > 0 ? '-' + srcadt_varchars[8] : '');

                    item_code_field.setValue(item_code);
            }




        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.addProductAction = Ext.create('Ext.Action',{
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '제품입고',
            tooltip: '제품 입고',
            disabled: true,
            handler: function() {
                gm.selPanel.addProduct();
            }
        });
        
                // 창고 입고
                this.addGoodsinAction = Ext.create('Ext.Action', {
                    xtype: 'button',
                    iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
                    text: '제품입고 ',
                    tooltip: '제품 입고',
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
                                        value: rec.get('unique_id'),
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
                                        title: '수량' + ' | ' + '적재 위치',
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
                });

                
        this.setAllMatAction = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', null);
                gm.me().store.load(function(){});
            }
        });

        this.setKCMatAction = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '컨버터',
            tooltip: '컨버터',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'KC');
                gm.me().store.load(function(){});
            }
        });

        this.setKBMatAction = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '안정기',
            tooltip: '안정기',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'KB');
                gm.me().store.load(function(){});
            }
        });

        this.setKLMatAction = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '모듈',
            tooltip: '모듈',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'KL');
                gm.me().store.load(function(){});
            }
        });



        this.createPoAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
            text: '주문카트 ',
            tooltip: '주문카트 담기',
            disabled: true,
            handler: function() {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success : function(result, request){
                            var resultText = result.responseText;

                            Ext.Msg.alert('안내', '카트 담기 완료.', function() {});

                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }
            }
        });

        // 출고 버튼
        this.outGoAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '자재출고 ',
            tooltip: '자재출고',
            disabled: true,
            handler: function() {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
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

                }


//  				 switch(gMain.selPanel.stockviewType) {
//  				 case 'ALL':
//  					 alert("자재를 먼저 선택해 주세요");
//  					 break;
//  				 default:
//  					 break;
//  				 }
            }
        });


        // 바코드 출력 버튼
        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });



        //카트담기,
            switch(vCompanyReserved4) {
             case "KSCM01KR":
                 console_logs("vCompanyReserved4 출력 >>>>" , vCompanyReserved4);
                 this.add_Cart = Ext.create('Ext.Action', {
                    iconCls: 'barcode',
                    text: '제품 카트담기',
                    tooltip: '선택 제품을 담습니다.',
                    disabled: true,
                    handler: function () {
                        //gm.me().clearSession();
                        //gm.me().projectAdd();
                        gm.me().selectAddCart();
        
                    }
                });

                break;

                  default : break;

            }


        //카트담기,
        

         //현재 닫아놓음, 제품관리
        //  this.sessionCart = Ext.create('Ext.Action', {
        //     iconCls: 'barcode',
        //     text: '카트 담기',
        //     tooltip: '제품을 카트에 담습니다.',
        //     disabled: true,
        //     handler: function () {
        //         gm.me().addSessionCart();
        //     }
        // });


        // //버튼 추가.
        // buttonToolbar.insert(7, '-');
        // switch(vCompanyReserved4) {
        //     case "SWON01KR":
        //         break;
        //     case "SKNH01KR":
        //         buttonToolbar.insert(6, this.outGoAction);
        //         buttonToolbar.insert(6, this.createPoAction);
        //         buttonToolbar.insert(8, this.barcodePrintAction);
        //         buttonToolbar.insert(6, '-');
        //         break;
        //     default :
        //         //buttonToolbar.insert(6, this.outGoAction);
        //         //buttonToolbar.insert(6, this.createPoAction);
        //         buttonToolbar.insert(9, this.setKLMatAction);
        //         buttonToolbar.insert(9, this.setKBMatAction);
        //         buttonToolbar.insert(9, this.setKCMatAction);
        //         buttonToolbar.insert(9, this.setAllMatAction);
        // }

        buttonToolbar.insert(5, this.barcodePrintAction);
        if(vCompanyReserved4 =='KSCM01KR'){
            buttonToolbar.insert(6, this.add_Cart);
        }
        buttonToolbar.insert(5, this.addGoodsinAction/*addProductAction*/);
        
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(7, this.sessionCart); 
       


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            
            var rec = selections[0];

            console_logs('rec', rec);
            if (selections.length) {
                gm.me().createPoAction.enable();
                gm.me().myRemoveAction.enable();
                gm.me().barcodePrintAction.enable();
                gm.me().add_Cart.enable();
                gm.me().sessionCart.enable();

                console_logs('myRemoveAction', 'myRemoveAction enabled');

                var copy_uid = gm.me().getInputJust('srcahd|copy_uid');

                if(copy_uid != null) {
                    copy_uid.setValue(rec.get('id'));
                }
                this.selectedRecord = rec;
                gMain.selPanel.addGoodsinAction/*addProductAction*/.enable();
            } else {
                gm.me().createPoAction.disable();
                gm.me().myRemoveAction.disable();
                gm.me().barcodePrintAction.disable();
                gm.me().add_Cart.disable();
                gm.me().sessionCart.disable();

                console_logs('myRemoveAction', 'myRemoveAction disable');
                this.selectedRecord = null;
                gMain.selPanel.addGoodsinAction/*addProductAction*/.disable();
            }


        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function(records){});
    },
    printBarcode: function () {

        var form = Ext.create('Ext.form.Panel', {
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
                            layout: 'vbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '0 5 0 5',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'lot_no',
                                    fieldLabel: '구분기호',
                                    emptyText: 'LOT 번호',
                                    margin: '0 5 0 5',
                                    width: 200,
                                    allowBlank: true,
                                    value: '',
                                },
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: '출력 구분',
                                    margin: '0 5 0 5',
                                    width: 200,
                                    allowBlank: false,
                                    items: [
                                        {boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true},
                                        {boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
                                    ]
                                }
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
            var uid = rec.get('unique_id');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },


        //제품관리쪽 수주제품 세션에담기
    addSessionCart : function (form) {


        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var item_codess = [];

       addSCartKscm : Ext.MessageBox.show({
           title:'제품 담기',
           msg: '고르신 제품을 세션에 담으시겠습니까?', 
           buttons: Ext.MessageBox.YESNO,
       
           fn: function(btn) {
               if(btn=='yes') {
                   
                for (var i = 0; i < selections.length; i++) {
                    var select = selections[i];
                    var itemCode = select.get("item_code");
        
                    item_codess.push(itemCode);
        
                }

                //조립쪽세션없애기

                // Ext.state.Manager.clear("product_values");
                // Ext.util.Cookies.clear ( 'product_values');
                // Ext.util.Cookies.clear ("product_values");

                
        // var now = new Date();
        // var expiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

        //         Ext.util.Cookies.set('product_values', null, expiry);
                Ext.util.Cookies.clear('product_values', item_codess);

                

                
                console_log('>> 클리어  >>>>  ');
                console_log, ('>> 이전에 담긴값  >>>>  ', Ext.state.Manager.get('product_values'));
           
                Ext.state.Manager.setProvider(new Ext.state.CookieProvider());


                //Ext.state.Manager.set('product_values', "");
                //var sss = new Ext.data.Session();
                //session = new Ext.data.Session();

                //var ffff = session.setAttribute("ppp", item_codess); 

                //session = me.getSession(),

                //(new Ext.session.setProvider())
                var sss = new Ext.data.Session();
                
                
                // console_logs('>> 진짜 세션 ppp  >>>>  ',  ffff );


                // test에다 1개 변수에다만 담는게 맞을듯???

        Ext.state.Manager.set('product_manage', item_codess, new Date());

        var test11 = Ext.state.Manager.set('test', item_codess);

                var bb =  Ext.state.Manager.get('product_manage');
                
                console_logs('>> 제품 관리 담은것 리스트  >>>>  ', bb);
                console_logs('>> test11 리스트  >>>>  ', test11);

               }
           }
       })
    

    },


    selectAddCart : function (form) {

        //카트추가
    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
     var item_codess = [];
    //var item_codeOne = selections[0].get("item_code");

    selectAddCartModal : Ext.MessageBox.show({
        title:'카트 담기',
        msg: '고르신 제품을 카트에 담으시겠습니까?', 
        buttons: Ext.MessageBox.YESNO,
    
        fn: function(btn) {

            if(btn=='yes') {

                //var targetId = 'gridValveList' + vCUR_MENU_CODE;
                console_log('국송 카트에 제품 담기 ');
    
                var selections = gm.me().grid.getSelectionModel().getSelection();

                var new_arr = [];
                var ks_itemCodeList = [];
                var my_assymap_uid = new Array();
                var my_child = new Array();

                var item_name_list = new Array();
                var specifi_list = new Array();

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];

                    var srcahd_uid = rec.get("srcahd_uid");
                    var unique_id = rec.get('unique_id');
                    var item_code = rec.get('item_code');
                    var item_name = rec.get('item_name');
                    var specification = rec.get('specification');
                    
                    new_arr.push(rec);
                    ks_itemCodeList.push(item_code)
                    my_child.push(unique_id);
                    item_name_list.push(item_name);
                    specifi_list.push(specification);

                }

                gm.me().vCart_KsItemCodeList=ks_itemCodeList;

                if(ks_itemCodeList.length > 0) {
                    Ext.Ajax.request({

                        //입력 메소드
                        url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
                        //url: CONTEXT_PATH + '/purchase/material.do?method=addMyCart',

                        params:{
                            ks_itemCodeList : ks_itemCodeList,
                            item_codes : ks_itemCodeList,
                            childs : my_child,
                            pcs_code: gm.me().pClassCode,

                            item_name_list : item_name_list,
                            specifi_list : specifi_list

                        },
                        
    
                        success : function(result, request) {

                                Ext.MessageBox.alert('알림', '카트담기 성공.', function callBack(id) {

                                                return ;
                                });
                        },
                        });
                        }}
        }
    })
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
                    var bararr = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('product_uid');  //Product unique_id
                        var item_code = rec.get('item_code');
                        var item_name = rec.get('item_name'); 
                        var specification = rec.get('specification'); 
                        var bar_spec =  item_code + '|' + item_name + '|' +specification;
                        uniqueIdArr.push(uid);
                        bararr.push(bar_spec);
                    }

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',
                        params: {
                            productUids: uniqueIdArr,
                            barcodes: bararr
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            // gMain.selPanel.store.load(function () {
                            // });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            // gMain.selPanel.store.load(function () {
                            // });
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
        
    selectedClassCode: '',
    reflashClassCode : function(o){
        this.selectedClassCode = o;
        var target_class_code = gm.me().getInputJust('srcahd|class_code');
        var target_item_code = gm.me().getInputJust('srcahd|item_code');

        target_class_code.setValue(o);
        target_item_code.setValue(o);

    },
    deleteConfirm: function(result) {
        if(result=='yes') {
            if(gm.me().selectedRecord == null) {
                Ext.MessageBox.alert('선택 확인', '선택한 제품이 없습니다.');
                return;
            } else {
                var unique_uid = gm.me().selectedRecord.get('unique_uid');
                var child = gm.me().selectedRecord.get('child');
                Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=deleteAssy',
                        params:{
                            assymap_uid : unique_uid,
                            child: child
                        },
                        success : function(result, request) {   
                            console_logs('result', result);
                        var jsonData = Ext.decode(result.responseText);
                        console_logs('jsonData', jsonData);
// gm.me().reSelect();
                        gm.me().store.load();
                        },
                        failure: function(rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

                    }
                    });
                }
            }

    },
    addStockIn: function(val) {
        Ext.MessageBox.show({
            title:'창고 반입',
            msg: '창고로 반입하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',				
                        params:{
                            unique_id: val['unique_id'],
                            barcode:  val['unique_id'],
                            stock_pos :  val['stock_pos'],
                            innout_desc :  val['innout_desc'],
                            wh_qty :  val['wh_qty'],
                            whouse_uid : 100,
                            is_sell : 'Y' //제품으로 입고함.
                        },
                        
                        success : function(result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            
                            
                            gm.me().getStore().load(function() {});
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
    addProduct: function() {
		gm.me().addSrcahdForm = Ext.create('Ext.form.Panel', {
			title: '제품등록',
			xtype:'form',
			width:500,
			height:500,
			bodyPadding:15,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			default: {
				allowBlank: true,
				msgTarget:'side',
				labelWidth:60
			},
			items: [
				{
					id: gu.id('information'),
					fieldLabel: '종전자재',
					field_id:  'information',
					name: 'information',
					xtype: 'combo',
					emptyText: '코드나 규격으로 검색',
					store: gm.me().searchStore,
					displayField: 'specification',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					sortInfo: {
						field: 'specification',
						direction: 'ASC'
					},
					minChars: 1,
					typeAhead: false,
					hideLabel: true,
					hideTrigger: true,
					anchor: '100%',

					listConfig: {
						loadingText: '검색중...',
						emptyText: '일치하는 결과가 없습니다.',

						// Custom rendering template for each item
						getInnerTpl: function() {
							return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
								'<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
								'</a></div>';
						}
					},
					pageSize: 10
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('item_code'),
					id: gu.id('item_code'),
					name: 'item_code',
					allowBlank: true
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('item_name'),
					id: gu.id('item_name'),
					name: 'item_name',
					allowBlank: true
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('specification'),
					id: gu.id('specification'),
					name: 'specification',
					allowBlank: true
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('wh_qty'),
					id: gu.id('wh_qty'),
					name: 'wh_qty',
					allowBlank: true
				},{
					id: gu.id('pj_info'),
					fieldLabel: '호선',
					field_id:  'pj_info',
					name: 'pj_info',
					xtype: 'combo',
					emptyText: '호선으로 검색',
					store: gm.me().projectStore,
					displayField: 'specification',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					sortInfo: {
						field: 'specification',
						direction: 'ASC'
					},
					minChars: 1,
					anchor: '100%',

					listConfig: {
						loadingText: '검색중...',
						emptyText: '일치하는 결과가 없습니다.',

						// Custom rendering template for each item
						getInnerTpl: function() {
							return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
								'<font color=#999><small>{pj_name}</small></font> <font color=#999>{pj_name}</font><br /></font>' +
								'</a></div>';
						}
					},
					pageSize: 10
				}
			]
		});

		var winForm = Ext.create('ModalWindow', {
			title: CMD_NEW_CREATE,
			width: 500,
			height: 500,
			minWidth: 250,
			minHeight: 180,
			items:
				[{
					region: 'center',
					xtype: 'tabpanel',
					items: gm.me().addSrcahdForm
				}],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					var form = gm.me().addSrcahdForm;
					if (form.isValid()) {
						var val = form.getValues(false);
					form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=create',
                        params: val,
                        success: function(val, action) {
                        	winForm.close();
                            gm.me().store.load(function() {});
                        },
                        failure: function(val, action) {

                        	winForm.close();
                            gm.me().store.load(function() {});

                        }
                    });
					}
					
					// var form = gm.me().createPartForm;
					// if (form.isValid()) {
					// 	var val = form.getValues(false);
					// 	console_logs('form val', val);

					// 	gm.me().registPartFc(val);

					// 	if (winPart) {
					// 		winPart.close();
					// 	}
					// } else {
					// 	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
					// }

				}
			}, {
				text: CMD_CANCEL,
				handler: function() {
					if (winForm) {
						winForm.close();
					}
				}
			}]
		});
		winForm.show( /* this, function(){} */ );
	},
    selectedRecord : null,
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

