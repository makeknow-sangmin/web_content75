//자재 관리
Ext.define('Rfx2.view.company.dsmaref.designPlan.ProductMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-mgmt-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('old_item_code');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.addCallback('CHECK_CODE', function(o){
            var target = gMain.selPanel.getInputJust('extendsrcahd|item_code');
            console_logs('====target', target);
            var code = target.getValue();
            var uppercode = code.toUpperCase();

            if(code.length < 1){
                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function() {});
            } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=A',  // &sp_code_list=KA,KB,KC,KL
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
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
                            target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.ProductMgmtExtend', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            ,{
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.setRowClass(function(record, index) {

            var c = record.get('child_cnt');

            if(c < 1) {
                return 'orange-row';
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
                case 'DSU':
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
                case 'DSR':
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
                    break;
                case 'DSC':
                    for(var i = 1; i < 12; i++) {
                        var val = gm.me().getInputJust('extendsrcahd|srcadt_varchar' + (i+16)).getValue();
                        if(val == null) {
                            val = '';
                        }
                        srcadt_varchars.push(val);
                    }

                    var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

                    var item_code = srcadt_varchars[0] + srcadt_varchars[1] + '-' + srcadt_varchars[2]
                        + srcadt_varchars[3] + '-' + 'S' + srcadt_varchars[4] + '-' + srcadt_varchars[5] + srcadt_varchars[6]
                        + srcadt_varchars[7] + '-' + srcadt_varchars[8] + '-' + srcadt_varchars[9] + srcadt_varchars[10];

                    if(srcadt_varchars[11].length > 0) {
                        item_code += '-' + srcadt_varchars[11];
                    }

                    item_code_field.setValue(item_code);
                    break;
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
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
            text: '제품',
            tooltip: '제품',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'A');
                // gm.me().store.getProxy().setExtraParam('sp_code', 'DSU');
                gm.me().store.load(function(){});
            }
        });

        this.setKBMatAction = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '재공',
            tooltip: '재공',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'ASSY');
                // gm.me().store.getProxy().setExtraParam('sp_code', 'DSR');
                gm.me().store.load(function(){});
            }
        });

        this.setKLMatAction = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'productType',
            handler: function() {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                // gm.me().store.getProxy().setExtraParam('sp_code', 'DSC');
                gm.me().store.load(function(){});
            }
        });

        // this.setASSYMatAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     text: 'ASSY',
        //     tooltip: 'ASSY',
        //     toggleGroup: 'productType',
        //     handler: function() {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'ASSY');
        //         gm.me().store.load(function(){});
        //     }
        // });

        // this.setDSXMatAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     text: '기타',
        //     tooltip: '기타',
        //     toggleGroup: 'productType',
        //     handler: function() {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'DSX');
        //         gm.me().store.load(function(){});
        //     }
        // });

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
            xtype : 'button',
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '바코드를 바코드 프린터로 출력합니다',
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
        //         buttonToolbar.insert(9, this.setDSXMatAction);
        //         buttonToolbar.insert(9, this.setASSYMatAction);
        //         buttonToolbar.insert(9, this.setKLMatAction);
        //         buttonToolbar.insert(9, this.setKBMatAction);
        //         buttonToolbar.insert(9, this.setKCMatAction);
        //         buttonToolbar.insert(9, this.setAllMatAction);
        // }

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
        this.setGridOnCallback(function(selections) {

            var rec = selections[0];

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

        this.store.load(function(records){});
    },
    selectedClassCode: '',
    reflashClassCode : function(o){
        this.selectedClassCode = o;
        var target_class_code = gm.me().getInputJust('srcahd|class_code');
        var target_item_code = gm.me().getInputJust('srcahd|item_code');

        target_class_code.setValue(o);
        target_item_code.setValue(o);

    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
    enableCode:false,

    manageFn: function(type) {
        gm.me().enableCode = false;
        var select = null;
        var title = '';
        switch(type) {
            case 'add':
                title = '제품등록';
            break;
            case 'edit':
                title = '제품수정';
                select = gm.me().grid.getSelectionModel().getSelection()[0];
            break;
            case 'copy':
                title = '제품복사등록';
                select = gm.me().grid.getSelectionModel().getSelection()[0];
            break;
        }

        gm.me().claastStorePrd.getProxy().setExtraParam('identification', 'PRD_CLS_CODE');
        gm.me().claastStoreDetail.getProxy().setExtraParam('identification', 'PRD_CLS_CODE');
        gm.me().claastStoreDetailSUB.getProxy().setExtraParam('identification', 'PRD_CLS_CODE');
        gm.me().claastStorePrd.getProxy().setExtraParam('level1', 1);
        gm.me().claastStorePrd.load();
        if(type == 'edit' || type == 'copy') {
            gm.me().claastStorePrd.load();
            gm.me().claastStoreDetail.load();
            gm.me().claastStoreDetailSUB.load();
            gm.me().workingAreaStore.load();
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
                    value: 'A'
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
                                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=A',  // &sp_code_list=KA,KB,KC,KL
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
                    title: '제품정보',
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
                                    store: gm.me().claastStorePrd,
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
                                            Ext.getCmp('sg_code').setValue(null);
                                            Ext.getCmp('class_code').setValue(null);
                                            var value = combo.value;
                                            gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            gm.me().claastStoreDetail.load();
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
                                    store: gm.me().claastStoreDetail,
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
                                            gm.me().claastStoreDetailSUB.getProxy().setExtraParam('level1', 3);
                                            gm.me().claastStoreDetailSUB.getProxy().setExtraParam('parent_class_code', value);
                                            gm.me().claastStoreDetailSUB.load();
                                        },
                                        // afterrender: function(a,b) {
                                        //     var sp_code = Ext.getCmp('sp_code').getValue();
                                        //     if(sp_code != null && sp_code != undefined) {
                                        //         gm.me().claastStoreDetailSUB.getProxy().setExtraParam('level1', 3);
                                        //         gm.me().claastStoreDetailSUB.getProxy().setExtraParam('parent_class_code', sp_code);
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
                                    padding: '0 0 5px 0px',
                                    allowBlank:true,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().claastStoreDetailSUB,
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
                                    xtype:'numberfield',
                                    id:'sales_price',
                                    name:'sales_price',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'표준판가',
                                    value:type=='edit'||type=='copy' ? select.get('sales_price') : 0
                                },{
                                    xtype:'textfield',
                                    id:'currency',
                                    name:'currency',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'통화',
                                    value:type=='edit'||type=='copy' ? select.get('currency') : 'KRW'
                                },{
                                    id:'working_area',
                                    name:'working_area',
                                    fieldLabel:'공정',                                      
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 30px',
                                    // allowBlank:false,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().workingAreaStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'pcs_name',
                                    valueField:   'pcs_code',
                                    // sortInfo: { field: 'codeName', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{pcs_code}">{pcs_name}</div>';
                                        }			                	
                                    },
                                    value:type=='edit'||type=='copy' ? select.get('working_area') : ''
                                }, {
                                    xtype:'textfield',
                                    id:'unit_code',
                                    name:'unit_code',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'단위',
                                    value:type=='edit'||type=='copy' ? select.get('unit_code') : 'EA'
                                },{
                                    xtype:'numberfield',
                                    id:'stock_qty_safe',
                                    name:'stock_qty_safe',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'안전재고',
                                    value:type=='edit'||type=='copy' ? select.get('stock_qty_safe') : 0
                                }
                            ]
                        },
                        
                    ]
                }, {
                xtype: 'fieldset',
                collapsible: false,
                title: '상세정보',
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
                                id :'reserved1',
                                name : 'reserved1',
                                fieldLabel: '전기사양',                                            
                                // xtype: 'combo',
                                xtype:'textfield',
                                width:'45%',
                                padding: '0 0 5px 0',
                                allowBlank:true,
                                fieldStyle: 'background-image: none;',
                                // store: gm.me().ProjectTypeStore,
                                // emptyText: '선택해주세요.',
                                // displayField:   'class_name',
                                // valueField:   'class_code',
                                // // sortInfo: { field: 'codeName', direction: 'ASC' },
                                // typeAhead: false,
                                // minChars: 1,
                                // listConfig:{
                                //     loadingText: 'Searching...',
                                //     emptyText: 'No matching posts found.',
                                //     getInnerTpl: function() {
                                //         return '<div data-qtip="{class_code}">{class_name}</div>';
                                //     }			                	
                                // },
                                // listeners: {
                                //     select: function (combo, record) {
                                        
                                //     }// endofselect
                                // },
                                value:type=='edit'||type=='copy'?select.get('reserved1'):''
                            },{
                                id :'reserved2',
                                name : 'reserved2',
                                fieldLabel: '냉매',                                            
                                // xtype: 'combo',
                                xtype:'textfield',
                                width:'45%',
                                padding: '0 0 5px 30px',
                                allowBlank:true,
                                fieldStyle: 'background-image: none;',
                                // store: gm.me().ProjectTypeStore,
                                // emptyText: '선택해주세요.',
                                // displayField:   'class_name',
                                // valueField:   'class_code',
                                // // sortInfo: { field: 'codeName', direction: 'ASC' },
                                // typeAhead: false,
                                // minChars: 1,
                                // listConfig:{
                                //     loadingText: 'Searching...',
                                //     emptyText: 'No matching posts found.',
                                //     getInnerTpl: function() {
                                //         return '<div data-qtip="{class_code}">{class_name}</div>';
                                //     }			                	
                                // },
                                // listeners: {
                                //     select: function (combo, record) {
                                        
                                //     }// endofselect
                                // },
                                value:type=='edit'||type=='copy'?select.get('reserved2'):''
                            }
                            // ,{
                            //     id :'reserved3',
                            //     name : 'reserved3',
                            //     fieldLabel: '오일',                                            
                            //     // xtype: 'combo',
                            //     xtype: 'textfield',
                            //     width:'45%',
                            //     padding: '0 0 5px 0',
                            //     allowBlank:true,
                            //     fieldStyle: 'background-image: none;',
                            //     // store: gm.me().ProjectTypeStore,
                            //     // emptyText: '선택해주세요.',
                            //     // displayField:   'class_name',
                            //     // valueField:   'class_code',
                            //     // // sortInfo: { field: 'codeName', direction: 'ASC' },
                            //     // typeAhead: false,
                            //     // minChars: 1,
                            //     // listConfig:{
                            //     //     loadingText: 'Searching...',
                            //     //     emptyText: 'No matching posts found.',
                            //     //     getInnerTpl: function() {
                            //     //         return '<div data-qtip="{class_code}">{class_name}</div>';
                            //     //     }			                	
                            //     // },
                            //     // listeners: {
                            //     //     select: function (combo, record) {
                                        
                            //     //     }// endofselect
                            //     // },
                            //     value:type=='edit'||type=='copy'?select.get('reserved3'):''
                            // }
                            // ,{
                            //     id :'reserved4',
                            //     name : 'reserved4',
                            //     fieldLabel: '전자밸브',                                            
                            //     // xtype: 'combo',
                            //     xtype: 'textfield',
                            //     width:'45%',
                            //     padding: '0 0 5px 30px',
                            //     allowBlank:true,
                            //     fieldStyle: 'background-image: none;',
                            //     // store: gm.me().ProjectTypeStore,
                            //     // emptyText: '선택해주세요.',
                            //     // displayField:   'class_name',
                            //     // valueField:   'class_code',
                            //     // // sortInfo: { field: 'codeName', direction: 'ASC' },
                            //     // typeAhead: false,
                            //     // minChars: 1,
                            //     // listConfig:{
                            //     //     loadingText: 'Searching...',
                            //     //     emptyText: 'No matching posts found.',
                            //     //     getInnerTpl: function() {
                            //     //         return '<div data-qtip="{class_code}">{class_name}</div>';
                            //     //     }			                	
                            //     // },
                            //     // listeners: {
                            //     //     select: function (combo, record) {
                                        
                            //     //     }// endofselect
                            //     // },
                            //     value:type=='edit'||type=='copy'?select.get('reserved4'):''
                            // }
                            ,{
                                id :'reserved5',
                                name : 'reserved5',
                                fieldLabel: '배관방향',                                            
                                // xtype: 'combo',
                                xtype: 'textfield',
                                width:'45%',
                                padding: '0 0 5px 0',
                                allowBlank:true,
                                fieldStyle: 'background-image: none;',
                                // store: gm.me().ProjectTypeStore,
                                // emptyText: '선택해주세요.',
                                // displayField:   'class_name',
                                // valueField:   'class_code',
                                // // sortInfo: { field: 'codeName', direction: 'ASC' },
                                // typeAhead: false,
                                // minChars: 1,
                                // listConfig:{
                                //     loadingText: 'Searching...',
                                //     emptyText: 'No matching posts found.',
                                //     getInnerTpl: function() {
                                //         return '<div data-qtip="{class_code}">{class_name}</div>';
                                //     }			                	
                                // },
                                // listeners: {
                                //     select: function (combo, record) {
                                        
                                //     }// endofselect
                                // },
                                value:type=='edit'||type=='copy'?select.get('reserved5'):''
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
        })

        // Ext.Ajax.request({
        //     url: CONTEXT_PATH + '/production/schdule.do?method=manageProductItem',
        //     params:{
        //         reserved_varcharf:val['reserved_varcharf'],
        //         pj_type:val['pj_type'],
        //         reserved_varchark:val['reserved_varchark'],
        //         pm_uid:val['pm_uid'],
        //         delivery_plan:val['delivery_plan'],
        //         pj_code:val['pj_code'],
        //         pj_name:val['pj_name'],
        //         order_com_unique:val['order_com_unique'],
        //         reserved_varchar3:val['reserved_varchar3'],
        //         reserved_varcharc:val['reserved_varcharc'],
        //         reserved_varchar2:val['reserved_varchar2']
        //     },
        //     success: function(val, action) {
        //         gm.me().store.load();
        //         win.close();
        //     },
        //     failure: extjsUtil.failureMessage
        // });
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

    claastStorePrd: Ext.create('Mplm.store.ClaastStore', {}),
    claastStoreDetail: Ext.create('Mplm.store.ClaastStore', {}),
    claastStoreDetailSUB: Ext.create('Mplm.store.ClaastStore', {}),
    workingAreaStore: Ext.create('Mplm.store.PcsTplStore', {}),

});

