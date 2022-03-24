//자재 관리
Ext.define('Rfx2.view.company.hanjung.designPlan.ProductMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-mgmt-view',
    initComponent: function () {

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
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.addCallback('CHECK_CODE', function (o) {
            var target = gMain.selPanel.getInputJust('extendsrcahd|item_code');
            console_logs('====target', target);
            var code = target.getValue();
            var uppercode = code.toUpperCase();

            if (code.length < 1) {
                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function () { });
            } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=A&sp_code_list=KA,KB,KC,KL',
                    params: {
                        item_code: code
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var datas = jsonData.datas;

                        var isExist = false;

                        for (var i = 0; i < datas.length; i++) {
                            if (code == datas[i].item_code) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist) {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function () { });
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () { });
                            target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.company.hanjung.ProductMgmt', [{
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

        this.setRowClass(function (record, index) {

            var c = record.get('srcadt_varchar40');

            switch (c) {
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

            if (sp_code == null) {
                sp_code = '';
            }

            srcadt_varchars.push(sp_code);

            switch (sp_code) {
                case 'KC':
                    for (var i = 1; i < 8; i++) {
                        var val = gm.me().getInputJust('extendsrcahd|srcadt_varchar' + i).getValue();
                        if (val == null) {
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
                    for (var i = 1; i < 9; i++) {
                        var val = gm.me().getInputJust('extendsrcahd|srcadt_varchar' + (i + 8)).getValue();
                        if (val == null) {
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
                case 'KL':
                    for (var i = 1; i < 12; i++) {
                        var val = gm.me().getInputJust('extendsrcahd|srcadt_varchar' + (i + 16)).getValue();
                        if (val == null) {
                            val = '';
                        }
                        srcadt_varchars.push(val);
                    }

                    var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

                    var item_code = srcadt_varchars[0] + srcadt_varchars[1] + '-' + srcadt_varchars[2]
                        + srcadt_varchars[3] + '-' + 'S' + srcadt_varchars[4] + '-' + srcadt_varchars[5] + srcadt_varchars[6]
                        + srcadt_varchars[7] + '-' + srcadt_varchars[8] + '-' + srcadt_varchars[9] + srcadt_varchars[10];

                    if (srcadt_varchars[11].length > 0) {
                        item_code += '-' + srcadt_varchars[11];
                    }

                    item_code_field.setValue(item_code);
                    break;
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        // this.setAllMatAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     text: '전체',
        //     tooltip: '전체',
        //     toggleGroup: 'productType',
        //     handler: function() {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', null);
        //         gm.me().store.load(function(){});
        //     }
        // });

        // this.setKCMatAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     text: '컨버터',
        //     tooltip: '컨버터',
        //     toggleGroup: 'productType',
        //     handler: function() {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'KC');
        //         gm.me().store.load(function(){});
        //     }
        // });

        // this.setKBMatAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     text: '안정기',
        //     tooltip: '안정기',
        //     toggleGroup: 'productType',
        //     handler: function() {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'KB');
        //         gm.me().store.load(function(){});
        //     }
        // });

        // this.setKLMatAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     text: '모듈',
        //     tooltip: '모듈',
        //     toggleGroup: 'productType',
        //     handler: function() {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'KL');
        //         gm.me().store.load(function(){});
        //     }
        // });



        this.createPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: '주문카트 ',
            tooltip: '주문카트 담기',
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


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            Ext.Msg.alert('안내', '카트 담기 완료.', function () { });

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

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

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

                            Ext.Msg.alert('안내', '자재 출고 완료.', function () { });

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
            xtype: 'button',
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '바코드를 바코드 프린터로 출력합니다',
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


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;

                            Ext.Msg.alert('안내', '자재 출고 완료.', function () { });

                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }
            }

        });


        //버튼 추가.
        buttonToolbar.insert(7, '-');
        switch (vCompanyReserved4) {
            case "SWON01KR":
                break;
            case "SKNH01KR":
                buttonToolbar.insert(6, this.outGoAction);
                buttonToolbar.insert(6, this.createPoAction);
                buttonToolbar.insert(8, this.barcodePrintAction);
                buttonToolbar.insert(6, '-');
                break;
            default:
                //buttonToolbar.insert(6, this.outGoAction);
                //buttonToolbar.insert(6, this.createPoAction);
                buttonToolbar.insert(9, this.setKLMatAction);
                buttonToolbar.insert(9, this.setKBMatAction);
                buttonToolbar.insert(9, this.setKCMatAction);
                buttonToolbar.insert(9, this.setAllMatAction);
        }

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            var rec = selections[0];

            if (selections.length) {
                gMain.selPanel.createPoAction.enable();

                var copy_uid = gm.me().getInputJust('srcahd|copy_uid');

                if (copy_uid != null) {
                    copy_uid.setValue(rec.get('id'));
                }
            } else {
                gMain.selPanel.createPoAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function (records) { });
    },
    selectedClassCode: '',
    reflashClassCode: function (o) {
        this.selectedClassCode = o;
        var target_class_code = gm.me().getInputJust('srcahd|class_code');
        var target_item_code = gm.me().getInputJust('srcahd|item_code');

        target_class_code.setValue(o);
        target_item_code.setValue(o);

    },
    items: [],
    matType: 'RAW',
    stockviewType: "ALL"
});

