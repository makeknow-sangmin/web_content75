//자재 관리
Ext.define('Rfx2.view.company.dsmaref.designPlan.MaterialMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-view1',
    initComponent: function () {
        this.orderbyAutoTable = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.addCallback('GET-SG-CODE', function (combo, record) {

            gMain.selPanel.inputClassCode = record;

            var target_item_code = gMain.selPanel.getInputTarget('item_code');
            var class_code = gMain.selPanel.inputClassCode.get('system_code');
            target_item_code.setValue(target_item_code.getValue() + class_code.substring(0, 1) + '-');

        });


        this.addCallback('GET-CODE-HEAD', function (combo, record) {

            gMain.selPanel.inputBuyer = record;

            var target_item_code = gMain.selPanel.getInputTarget('item_code');
            var wa_code = record.get('wa_code');
            if (target_item_code != null && wa_code != null && wa_code.length > 2) {
                target_item_code.setValue(wa_code.substring(0, 1));
            }

            var address_1 = record.get('address_1');
            var target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
            target_address_1.setValue(address_1);

            combo.select(record);
        });

        this.addCallback('GET-SUP-HEAD', function (combo, record) {
            var seller_name = gMain.selPanel.getInputTarget('seller_code');
            seller_name.setValue(record.get('supplier_code'));
        });

        // 품목번호 자동생성
        this.addCallback('AUTO_ITEMCODE', function (o) {
            if (this.crudMode == 'EDIT') { // EDIT
                console_logs('preCreateCallback', 'IN EDIT');
            } else {// CREATE,COPY
                // 마지막 자재번호 가져오기
                var target2 = gMain.selPanel.getInputTarget('item_code');

                var class_code = gMain.selPanel.inputClassCode.get('system_code');
                var wa_code = gMain.selPanel.inputBuyer.get('wa_code');

                var item_first = wa_code.substring(0, 1) + class_code.substring(0, 1) + '-';

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
                    params: {
                        item_first: item_first,
                        codeLength: 3
                    },
                    success: function (result, request) {
                        var result = result.responseText;


                        console_logs('result 2', result);

                        target2.setValue(result);

                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax


            }

        });

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });


        // 분류코드로 품번 HEAD 만들기
        this.addCallback('GET-CLASS-CODE', function (combo, record) {

            console_logs('GET-CLASS-CODE record>>>>>>>>>>>>>>>', record);
            gm.me().inputClassCode = record;
            console_logs('gm.me().inputClassCode>>>>>>>>>>>>>>>', gm.me().inputClassCode);
            var target_item_code = gm.me().getInputJust('srcahd|item_code');


            if (target_item_code != null) {
                target_item_code.setValue(gm.me().inputSpCode.data.system_code + gm.me().inputClassCode);
            }

        });

        this.addCallback('GET-SP-CODE', function (combo, record) {
            console_logs('GET-SP-CODE record>>>>>>>>>>>>>>>', record);
            gm.me().inputSpCode = record;
            gm.me().refreshItemCode();
        });
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('MTRL_FLAG_SEW', function (o) {
            console_logs('addCallback_MTRL_FLAG_SEW>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.dsmf.MaterialMgmt',
            [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.setRowClass(function(record, index) {

            var c = record.get('srcadt_varchar40');
            var a = record.get('standard_flag');

            switch(c) {
                case 'Y':
                    if(a === 'A') {
                        return 'orange-row';
                    }
                    break;
                default:
                    break;
            }

        });

        Ext.define('AssyMap', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'sp_code', type: "string"},
                {name: 'item_code', type: "string"},
                {name: 'item_name', type: "string"},
                {name: 'specification', type: "string"},
                {name: 'maker_name', type: "string"},
                {name: 'quan', type: "string"},
                {name: 'sales_price', type: "string"},
                {name: 'model_no', type: "string"},
                {name: 'comment', type: "string"},
                {name: 'creator', type: "string"},
            ],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/material.do?method=bomlistAssyMap',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
        });

        bom_store = new Ext.data.Store({
            pageSize: getPageSize(),
            model: 'AssyMap',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }]
        });

        var option = {
            listeners: {
                itemdblclick: this.bomlistView
            }
        }

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar, option);

        this.createCrudTab();

        this.addCallback('SET_ITEM_CODE', function (o) {

            var sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();

            if(sg_code == null) {
                sg_code = '';
            }

            var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

            item_code_field.setValue(sg_code + '-');

        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        // this.setAssyMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: 'ASSY',
        //     tooltip: 'ASSEMBLY',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sg_code', 'AASSY');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        // this.setSetMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: 'SET',
        //     tooltip: 'SET',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sg_code', 'SET00');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: '소모성',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        // this.setUsedMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: '상품',
        //     tooltip: '상품',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         this.matType = 'SUB';
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'P');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });

        //DABP 버튼 분류
        this.setAllSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
//				gm.me().stockviewType = 'ALL';
                gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMtrlView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                gm.me().store.getProxy().setExtraParam('outbound_flag', 'N');
                gm.me().store.getProxy().setExtraParam('class_code_is_null', 'Y');
                gm.me().store.load(function () {
                });
            }
        });

        this.createPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: '주문카트 ',
            tooltip: '주문카트 담기',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;

                            Ext.Msg.alert('안내', '카트 담기 완료.', function () {
                            });

                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }

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

                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;

                            Ext.Msg.alert('안내', '자재 출고 완료.', function () {
                            });

                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }


            }
        });

        // 바코드 출력 버튼
        this.barcodePrintAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '바코드를 바코드 프린터로 출력합니다',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;

                            Ext.Msg.alert('안내', '자재 출고 완료.', function () {
                            });

                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }
            }

        });

        /**
         * =======================================================================
         * 대성마리프 추가/삭제/수정/복사등록 버튼 추가
         */
        this.registAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규 제품을 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().manageFn('add');
            }
        });

        this.modifyAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '제품 정보를 수정합니다.',
            disabled: true,
            handler: function() {
                gm.me().manageFn('edit');
            }
        });

        this.deleteAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '제품 정보를 삭제합니다.',
            disabled: true,
            handler: function() {
                gm.me().removeFn();
            }
        });

        this.duplicateAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-copy',
            text: '복사등록',
            tooltip: '제품 정보를 복사 후 수정하여 등록합니다.',
            disabled: true,
            handler: function() {
                gm.me().manageFn('copy');
            }
        });
        /**
         * 종료
         * ========================================================================
         */

        //버튼 추가.
        // buttonToolbar.insert(7, '-');
        // buttonToolbar.insert(7, this.setUsedMatView);
        // buttonToolbar.insert(7, this.setMROView);
        // buttonToolbar.insert(7, this.setSubMatView);
        // buttonToolbar.insert(7, this.setSaMatView);
        // // buttonToolbar.insert(7, this.setSetMatView);
        // buttonToolbar.insert(7, this.setAssyMatView);
        // buttonToolbar.insert(7, this.setAllMatView);
        // buttonToolbar.insert(6, this.outGoAction);
        // buttonToolbar.insert(6, this.createPoAction);
        //buttonToolbar.insert(6, this.readHistoryAction);

        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });

        buttonToolbar.insert(1, this.registAction);
        buttonToolbar.insert(2, this.modifyAction);
        buttonToolbar.insert(3, this.deleteAction);
        buttonToolbar.insert(4, this.duplicateAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                gUtil.enable(this.modifyAction);
                gUtil.enable(this.deleteAction);
                gUtil.enable(this.duplicateAction);

            } else {
                gUtil.disable(this.modifyAction);
                gUtil.disable(this.deleteAction);
                gUtil.disable(this.duplicateAction);
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');

        this.store.load(function (records) {
        });
    },
    enableCode:false,
    claastStoreMt: Ext.create('Mplm.store.ClaastStore', {}),
    claastStoreMtDetail: Ext.create('Mplm.store.ClaastStore', {}),
    claastStoreMtDetailSUB: Ext.create('Mplm.store.ClaastStore', {}),
    IncomSpecStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode:'RECV_INS_TYPE'}),
    ynCodeStore: Ext.create('Mplm.store.CodeYnStore'),
    
    manageFn: function(type) {
        gm.me().enableCode = false;
        var select = null;
        var title = '';
        switch(type) {
            case 'add':
                title = '자재등록';
            break;
            case 'edit':
                title = '자재수정';
                select = gm.me().grid.getSelectionModel().getSelection()[0];
            break;
            case 'copy':
                title = '자재복사등록';
                select = gm.me().grid.getSelectionModel().getSelection()[0];
            break;
        }

        gm.me().claastStoreMt.getProxy().setExtraParam('identification', 'MT');
        gm.me().claastStoreMtDetail.getProxy().setExtraParam('identification', 'MT');
        gm.me().claastStoreMtDetailSUB.getProxy().setExtraParam('identification', 'MT');
        gm.me().claastStoreMt.getProxy().setExtraParam('level1', 1);
        gm.me().claastStoreMt.load();

        gm.me().IncomSpecStore.load();
        gm.me().ynCodeStore.load();
        
        if(type == 'edit' || type == 'copy') {
            gm.me().claastStoreMtDetail.load();
            gm.me().claastStoreMtDetailSUB.load();
        }

        var form = Ext.create('Ext.form.Panel', {
            id: 'manageItemForm',
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            layout:'column',
            bodyPadding: 10,
            items: [
                new Ext.form.Hidden({
                    name: 'type',
                    value: type
                }),
                new Ext.form.Hidden({
                    name: 'standard_flag',
                    value: 'R'
                }),
                new Ext.form.Hidden({
                    name: 'unique_id',
                    value: type=='edit'||type=='copy'?select.get('assymap_uid'):-1
                }),
                new Ext.form.Hidden({
                    name: 'srcahd_uid',
                    value: type=='edit'||type=='copy'?select.get('unique_id_long'):-1
                }),
                {
                    xtype:'textfield',
                    id:'item_code',
                    name:'item_code',
                    width:'85%',
                    allowBlank:false,
                    padding: '0 0 5px 0',
                    // fieldLabel:'품번',
                    fieldLabel:'<font color=red>*</font>품번',
                    fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                    value:type=='edit'||type=='copy' ? select.get('item_code') : '',
                    readOnly:type=='edit' ? true : false
                },{
                    xtype:'button',
                    text:'중복확인',
                    width:'10%',
                    listeners: {
                        click: function(btn) {
                            var target = Ext.getCmp('item_code');
                            console_logs('====target', target);
                            var code = target.getValue();
                            var uppercode = code.toUpperCase();

                            if(code.length < 1){
                                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function() {});
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=R',  // &sp_code_list=KA,KB,KC,KL
                                    params: {
                                        item_code: code
                                    },
                                    success : function(result, request){
                                        var jsonData = Ext.JSON.decode(result.responseText);
                                        var datas = jsonData.datas;

                                        var isExist = false;

                                        for(var i = 0; i < datas.length; i++) {
                                            if(code == datas[i].item_code) {
                                                isExist = true;
                                                break;
                                            }
                                        }

                                        if(!isExist) {
                                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
                                            target.setValue(uppercode);
                                            gm.me().enableCode = true;
                                        } else {
                                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
                                            target.setValue('');
                                            gm.me().enableCode = false;
                                        }
                                    },
                                    failure: extjsUtil.failureMessage
                                }); //end of ajax
                            }
                        }
                    }
                },
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '자재정보',
                    width: '100%',
                    style: 'padding:10px',
                    defaults: {
                        labelStyle: 'padding:10px',
                        anchor: '100%',
                        layout: {
                            type: 'column',
                            // defaultMargins: {
                            //     top: 0,
                            //     right: 0,
                            //     bottom: 0,
                            //     left: 10
                            // }
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            // margin: '0 10 10 1',
                            border:true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items:[
                                {
                                    id :'sp_code',
                                    name : 'sp_code',
                                    fieldLabel: '대분류',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    allowBlank:true,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().claastStoreMt,
                                    emptyText: '선택해주세요.',
                                    displayField:   'class_name',
                                    valueField:   'class_code',
                                    // sortInfo: { field: 'codeName', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{class_code}">{class_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            Ext.getCmp('class_code').setValue(null);
                                            Ext.getCmp('sg_code').setValue(null);
                                            var value = combo.value;
                                            gm.me().claastStoreMtDetail.getProxy().setExtraParam('identification', 'MT');
                                            gm.me().claastStoreMtDetail.getProxy().setExtraParam('level1', 2);
                                            gm.me().claastStoreMtDetail.getProxy().setExtraParam('parent_class_code', value);
                                            gm.me().claastStoreMtDetail.load();
                                        }
                                    },
                                    fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    readOnly:type=='edit' ? true : false,
                                    value:type=='edit'||type=='copy' ? select.get('sp_code') : ''
                                },{
                                    id :'sg_code',
                                    name : 'sg_code',
                                    fieldLabel: '중분류',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 30px',
                                    allowBlank:true,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().claastStoreMtDetail,
                                    emptyText: '선택해주세요.',
                                    displayField:   'class_name',
                                    valueField:   'class_code',
                                    // sortInfo: { field: 'codeName', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{class_code}">{class_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            Ext.getCmp('class_code').setValue(null);
                                            var value = combo.value;
                                            gm.me().claastStoreMtDetail.getProxy().setExtraParam('identification', 'MT');
                                            gm.me().claastStoreMtDetailSUB.getProxy().setExtraParam('level1', 3);
                                            gm.me().claastStoreMtDetailSUB.getProxy().setExtraParam('parent_class_code', value);
                                            gm.me().claastStoreMtDetailSUB.load();
                                        },
                                        // afterrender: function(a,b) {
                                        //     var sp_code = Ext.getCmp('sp_code').getValue();
                                        //     if(sp_code != null && sp_code != undefined) {
                                        //         gm.me().claastStoreMtDetail.getProxy().setExtraParam('level1', 2);
                                        //         gm.me().claastStoreMtDetail.getProxy().setExtraParam('parent_class_code', sp_code);
                                        //     }
                                        // }
                                    },
                                    fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    readOnly:type=='edit' ? true : false,
                                    value:type=='edit'||type=='copy' ? select.get('sg_code') : ''
                                },{
                                    id :'class_code',
                                    name : 'class_code',
                                    fieldLabel: '소분류',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    // padding: '0 0 5px 30px',
                                    padding: '0 0 5px 0',
                                    allowBlank:true,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().claastStoreMtDetailSUB,
                                    emptyText: '선택해주세요.',
                                    displayField:   'class_name',
                                    valueField:   'class_code',
                                    // sortInfo: { field: 'codeName', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{class_code}">{class_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            
                                        },
                                        afterrender: function(a,b) {
                                            // var sg_code = Ext.getCmp('sg_code').getValue();
                                            // if(sg_code != null && sg_code != undefined) {
                                            //     gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 3);
                                            //     gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', sg_code);
                                            // }
                                        }
                                    },
                                    fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    readOnly:type=='edit' ? true : false,
                                    value:type=='edit'||type=='copy' ? select.get('class_code') : ''
                                }, {
                                    xtype:'textfield',
                                    id:'item_name',
                                    name:'item_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'<font color=red>*</font>품명',
                                    fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    readOnly:type=='edit' ? true : false,
                                    value:type=='edit'||type=='copy' ? select.get('item_name') : ''
                                },{
                                    xtype:'textfield',
                                    id:'specification',
                                    name:'specification',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'<font color=red>*</font>규격',
                                    fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    readOnly:type=='edit' ? true : false,
                                    value:type=='edit'||type=='copy' ? select.get('specification') : ''
                                    // fieldLabel:'규격'
                                },{
                                    xtype:'textfield',
                                    id:'maker_name',
                                    name:'maker_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:true,
                                    fieldLabel:'제조사',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='edit'||type=='copy' ? select.get('maker_name') : ''
                                    // fieldLabel:'규격'
                                },{
                                    xtype:'textfield',
                                    id:'unit_code',
                                    name:'unit_code',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'단위',
                                    value:type=='edit'||type=='copy' ? select.get('unit_code') : 'EA'
                                },{
                                    xtype:'textfield',
                                    id:'stock_qty',
                                    name:'stock_qty',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'총재고',
                                    value:type=='edit'||type=='copy' ? select.get('stock_qty') : 0
                                },{
                                    id :'remark',
                                    name : 'remark',
                                    fieldLabel: '수입검사구분',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    allowBlank:true,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().IncomSpecStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'codeName',
                                    valueField:   'systemCode',
                                    // sortInfo: { field: 'codeName', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }			                	
                                    },
                                    value:type=='edit'||type=='copy' ? select.get('remark') : 'N'
                                },{
                                    xtype:'textfield',
                                    id:'currency',
                                    name:'currency',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'통화',
                                    value:type=='edit'||type=='copy' ? select.get('currency') : 'KRW'
                                },{
                                    xtype:'numberfield',
                                    id:'stock_qty_safe',
                                    name:'stock_qty_safe',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'안전재고',
                                    value:type=='edit'||type=='copy' ? select.get('stock_qty_safe') : 0
                                },{
                                    id :'notify_flag',
                                    name : 'notify_flag',
                                    fieldLabel: '사용유무',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 30px',
                                    allowBlank:true,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().ynCodeStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'codeName',
                                    valueField:   'systemCode',
                                    // sortInfo: { field: 'codeName', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    value:type=='edit'||type=='copy' ? select.get('notify_flag') : 'Y'
                                }
                            ]
                        },
                        
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: title,
            id:'manageItemWin',
            width: 800,
            height: 500,
            plain: true,
            items: form,
            autoScroll:true,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                     if (btn == "no") {
                        win.close();
                    } else {
                        if(!gm.me().enableCode && type != 'edit') {
                            Ext.MessageBox.alert('알림', '중복확인을 눌러주세요.');
                            return;
                        }
                        var form = Ext.getCmp('manageItemForm').getForm();
                        if(form.isValid()) {
                            // var val = form.getValues(false);

                            gm.me().manageHandler(form);
                        } else {
                            // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            Ext.MessageBox.alert('알림', '필수입력을 확인해주세요.');
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function(btn) {
                    win.close();
                }
            }]
        });win.show();
    },

    manageHandler: function(form) {
        console_logs('>>>>>>>val', val);
        var val = form.getValues(false);
        form.submit({
            url: CONTEXT_PATH + '/production/schdule.do?method=manageProductItem',
            params: val,
            success: function(val, action) {
                gm.me().enableCode = false;
                var win = Ext.getCmp('manageItemWin');
                if(win) {
                    win.close();
                }
                gm.me().store.load(function() {});
            },
            failure: function(val, action) {
                var win = Ext.getCmp('manageItemWin');
                if(win) {
                    win.close();
                }
                gm.me().enableCode = false;
                gm.me().store.load(function() {});

            }
        });
    },

    removeFn: function() {
        Ext.MessageBox.show({
            title:'삭제',
            msg: '선택하신 항목들을 삭제하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    var selects = gm.me().grid.getSelectionModel().getSelection();
                    var uids = [];
                    for(var i=0; i<selects.length; i++) {
                        var select = selects[i];
                        var id = select.get('unique_id_long');
                        console_logs('>>>>>>>>>>removeFn id : ', id);
                        uids.push(id);
                    };
            
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=removeItems',
                        params:{
                            
                        },
                        success: function(){
                            gm.me().showToast('결과', uids.length + ' 건 삭제완료.' );
                            gm.me().store.load();
                        },
                        failure: function(){
                            gm.me().showToast('결과', '삭제실패' );
                        }
                     });
                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    selectedClassCode: '',

    reflashClassCode: function (class_code) {
        console_logs('reflashClassCode class_code', class_code);
        this.selectedClassCode = class_code;
        var target_class_code = gm.me().getInputJust('srcahd|class_code');
        console_logs('target_class_code', target_class_code);
        target_class_code.setValue(class_code);

        gm.me().refreshItemCode();

    },

    refreshItemCodeInner: function (sp_code, cuClass_Code) {
        var target_item_code = gm.me().getInputJust('srcahd|item_code');

        var item_code_pre = sp_code == null ? '' : sp_code;
        if (cuClass_Code != null && cuClass_Code.length > 0) {
            item_code_pre = item_code_pre + cuClass_Code;
        }

        target_item_code.setValue(item_code_pre);

    },

    refreshItemCode: function () {
        var sp_code = null;

        //console_logs('gm.me().inputSpCode>>>>>>>>>>>>>>>', gm.me().inputSpCode);
        var o = gm.me().inputSpCode;

        if (o != null) {
            sp_code = o.get('systemCode');
        } else {
            var o1 = gm.me().getInputJust('srcahd|sp_code');
            sp_code = o1.getValue();
        }

        var target_class_code = gm.me().getInputJust('srcahd|class_code');
        var cuClass_Code = target_class_code.getValue();

        this.refreshItemCodeInner(sp_code, cuClass_Code);

    },

    copyCallback: function () {
        this.refreshItemCode();
    },

    bomlistView: function () {
        if (vCompanyReserved4 != 'APM01KR') {
            return null;
        }
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];

        console_logs('===rec', rec);

        var srcahd_uid = rec.get('unique_id_long');

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'BOM LIST',
            width: 1400,
            height: 700,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                {
                    xtype: 'panel',
                    id: 'First Grid',
                    autoScroll: true,
                    autoWidth: true,
                    flex: 3,
                    padding: '5',
                    items: gm.me().bomlistViewForm(srcahd_uid)
                }
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    bomlistViewForm: function (srcahd_uid) {
        var BOM_COLUMN = [];

        BOM_COLUMN.push(
            {
                header: '구분', dataIndex: 'sp_code',
                width: 40, align: 'left', resizable: true, sortable: true,
            }, {
                header: '품목코드', dataIndex: 'item_code',
                width: 100, align: 'left', resizable: true, sortable: true,
            }, {
                header: '품명', dataIndex: 'item_name',
                width: 180, align: 'left', resizable: true, sortable: true,
                flex: 1
            }, {
                header: '규격', dataIndex: 'specification',
                width: 130, align: 'left', resizable: true, sortable: true,
            }, {
                header: '제조원', dataIndex: 'maker_name',
                width: 130, align: 'left', resizable: true, sortable: true,
            }, {
                header: '블록', dataIndex: 'area_code',
                width: 80, align: 'left', resizable: true, sortable: true,
            }, {
                header: '수량', dataIndex: 'quan',
                width: 50, align: 'left', resizable: true, sortable: true,
            }, {
                header: '단위', dataIndex: 'unit_code',
                width: 40, align: 'left', resizable: true, sortable: true,
            }, {
                header: '단가', dataIndex: 'static_sales_price',
                width: 70, align: 'left', resizable: true, sortable: true,
            }, {
                header: '재질', dataIndex: 'model_no',
                width: 130, align: 'left', resizable: true, sortable: true,
            }, {
                header: '등록자', dataIndex: 'creator',
                width: 80, align: 'left', resizable: true, sortable: true,
            }
        );

        bom_store.getProxy().setExtraParam('unique_id', srcahd_uid);
        bom_store.load(function () {
        });

        console_logs('==dasdasd', bom_store);

        bom_grid = Ext.create('Ext.grid.Panel', {
            id: 'bom_grid_panel',
            store: bom_store,
            multiSelect: true,
            stateId: 'stateGridsub',
//        selModel: selModel,
            autoScroll: true,
            autoHeight: true,
            height: 400,  // (getCenterPanelHeight()/5) * 4
//        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/BOM_COLUMN,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            listeners: {
                itemdblclick: function () {
                    gm.me().renderMoveBom();
                }
            }
        });

        return bom_grid;
    },

    renderMoveBom: function () {
        // console_logs('=====wwww', Ext.getCmp('bom_grid_panel').getSelectionModel().getSelection()[0]);
        var rec = Ext.getCmp('bom_grid_panel').getSelectionModel().getSelection()[0];

        if (rec != null) {

            // var wa_name  = rec.get('wa_name');
            // var pj_name  = rec.get('pj_name');
            // var pj_code  = rec.get('pj_code');
            var pj_uid = rec.get('ac_uid');
            var parent_uid = rec.get('parent_uid');
            var child = rec.get('unique_uid');

            return gm.me().renderBom(null, null, null, pj_uid, parent_uid, child);
        }
    },

    readHistoryAction: Ext.create('Ext.Action', {
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '이력조회',
        tooltip: '이력조회',
        disabled: true,
        handler: function (widget, event) {
            gm.me().readHistroyView();
        }
    }),

    readHistroyView: function () {
        Ext.define('XpoAstHistory', {
            extend: 'Ext.data.Model',
            fields: /*(G)fieldPohistory*/'',
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/request.do?method=readPohistory'
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                },
                writer: {
                    type: 'singlepost',
                    writeAllFields: false,
                    root: 'datas'
                }
            }
        });

        var poHistoryStore = new Ext.data.Store({
            pageSize: 50,
            model: 'XpoAstHistory',
            sorters: [{
                property: 'po_date',
                direction: 'DESC'
            }]
        });

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];
        var uid_srcahd = selection.get('unique_id_long');

        poHistoryStore.getProxy().setExtraParam('uid_srcahd', uid_srcahd);
        poHistoryStore.load();

        var bomHistoryGrid = Ext.create('Ext.grid.Panel', {
            store: poHistoryStore,
            stateId: 'bomHistoryGrid',
            layout: 'fit',
            border: false,
            frame: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            sortable: false,
            multiSelect: false,
            autoScroll: true,
            heigth: 300,
            columns: [
                {text: '프로젝트 코드', dataIndex: 'account_code', width: 100},
                {text: '프로젝트 명', dataIndex: 'account_name', width: 80},
                {text: 'Assembly', dataIndex: 'pl_no', width: 80},
                {text: '발주번호', dataIndex: 'po_no', width: 120},
                {text: '주문일자', dataIndex: 'po_date', width: 120},
                {text: '공급사 코드', dataIndex: 'seller_code', width: 80},
                {text: '공급사 명', dataIndex: 'seller_name', width: 120},
                {text: '주문단가', dataIndex: 'sales_price', width: 80},
                {text: '주문수량', dataIndex: 'po_qty', width: 80},
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'주문 P/O 이력',
            width: 900,
            height: 700,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                bomHistoryGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    items: [],
    matType: 'RAW',
    stockviewType: "ALL",
});

