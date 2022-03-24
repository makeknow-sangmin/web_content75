//원지 관리
Ext.define('Rfx2.view.company.daeji.developmentMgmt.MaterialMgmtWJView', {
    extend: 'Rfx2.base.company.daeji.BaseView',
    xtype: 'material-mgmt-wj-view',
    initComponent: function () {
        this.orderbyAutoTable = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'notify_flag_use',
        //     items: [
        //         {
        //             boxLabel: '사용중지 포함',
        //             checked: false
        //         },
        //     ],
        // });

        // this.addSearchField(
        //     {
        //         xtype: 'combo'
        //         , anchor: '100%'
        //         , width: 200
        //         , field_id: 'sg_code'
        //         , store: 'ClaastStore'
        //         , displayField: 'class_name'
        //         , valueField: 'class_code'
        //         , params: {level1: '1', identification_code: 'MT'}
        //         , innerTpl: '[{class_code}]{class_name}'
        //     });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        // this.addSearchField('specification');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();

        this.addCallback('GET-SG-CODE', function (combo, record) {
            gm.me().inputClassCode = record;
            let target_item_code = gm.me().getInputTarget('item_code');
            let class_code = gm.me().inputClassCode.get('system_code');
            target_item_code.setValue(target_item_code.getValue() + class_code.substring(0, 1) + '-');
        });

        this.addCallback('GET-CODE-HEAD', function (combo, record) {

            gm.me().inputBuyer = record;
            let target_item_code = gm.me().getInputTarget('item_code');
            let wa_code = record.get('wa_code');
            if (target_item_code != null && wa_code != null && wa_code.length > 2) {
                target_item_code.setValue(wa_code.substring(0, 1));
            }
            let address_1 = record.get('address_1');
            let target_address_1 = gm.me().getInputTarget('delivery_info');
            target_address_1.setValue(address_1);
            combo.select(record);
        });

        this.addCallback('GET-SUP-HEAD', function (combo, record) {
            let seller_name = gm.me().getInputTarget('seller_code');
            seller_name.setValue(record.get('supplier_code'));
        });

        // 품목번호 자동생성
        this.addCallback('AUTO_ITEMCODE', function () {
            if (this.crudMode === 'EDIT') { // EDIT
                console_logs('preCreateCallback', 'IN EDIT');
            } else {// CREATE,COPY
                // 마지막 자재번호 가져오기
                let target2 = gm.me().getInputTarget('item_code');
                let class_code = gm.me().inputClassCode.get('system_code');
                let wa_code = gm.me().inputBuyer.get('wa_code');
                let item_first = wa_code.substring(0, 1) + class_code.substring(0, 1) + '-';

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
                    params: {
                        item_first: item_first,
                        codeLength: 3
                    },
                    success: function (result) {
                        target2.setValue(result.responseText);
                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax
            }
        });

        this.addCallback('CHECK_CODE', function () {
            let target = gm.me().getInputJust('extendsrcahd|item_code');
            console_logs('====target', target);
            let code = target.getValue();
            let uppercode = code.toUpperCase();

            if (code.length < 1) {
                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function () {
                });
            } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom',
                    params: {
                        item_code: code
                    },
                    success: function (result) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        let datas = jsonData.datas;

                        let isExist = false;

                        for (let i = 0; i < datas.length; i++) {
                            if (code === datas[i].item_code) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist) {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function () {
                            });
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                            });

                            let sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();
                            let item_type = gm.me().getInputJust('extendsrcahd|item_type').getValue();
                            if (sg_code == null) {
                                sg_code = '';
                            }
                            let item_code_field = gm.me().getInputJust('extendsrcahd|item_code');
                            item_code_field.setValue(sg_code + item_type);
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
        // 분류코드로 품번 HEAD 만들기
        this.addCallback('GET-CLASS-CODE', function (combo, record) {
            console_logs('GET-CLASS-CODE record>>>>>>>>>>>>>>>', record);
            gm.me().inputClassCode = record;
            console_logs('gm.me().inputClassCode>>>>>>>>>>>>>>>', gm.me().inputClassCode);
            let target_item_code = gm.me().getInputJust('srcahd|item_code');
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
        this.createStore('Rfx2.model.company.bioprotech.MaterialMgmt',
            [{
                property: 'unique_id',
                direction: 'DESC',
            }],
            gm.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

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

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
        this.createCrudTab();
        this.addCallback('SET_ITEM_CODE', function () {

            let sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();
            let item_type = gm.me().getInputJust('extendsrcahd|item_type').getValue();
            if (sg_code == null) {
                sg_code = '';
            }
            if (item_type == null) {
                item_type = '';
            }
            let item_code_field = gm.me().getInputJust('extendsrcahd|item_code');
            item_code_field.setValue(sg_code + item_type);
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid/*, this.crudTab*/]
        });

        this.changeUsingStatusAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-exchange',
            //text: '사용여부 변경',
            text: this.getMC('CMD_CHANGE_USEYN', '사용여부 변경'),
            tooltip: '사용중인 제품은 미사용으로, 미사용중인 제품은 사용으로 변경합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('changeUsingStatusAction'),
            handler: function () {

                Ext.MessageBox.show({
                    title: '사용여부 변경',
                    msg: '사용여부를 변경하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {

                        if (result === 'yes') {

                            let negative_uids = [];
                            let positive_uids = [];

                            let selections = gm.me().grid.getSelectionModel().getSelection();

                            for (let i = 0; i < selections.length; i++) {
                                let rec = selections[i];
                                let notify_flag = rec.get('notify_flag');

                                if (notify_flag === 'Y') {
                                    positive_uids.push(rec.get('unique_id_long'));
                                } else {
                                    negative_uids.push(rec.get('unique_id_long'));
                                }
                            }

                            let is_show_msg = true;

                            if (negative_uids.length > 0) {
                                gm.me().editAjax('srcahd', 'notify_flag', 'Y', 'unique_id', negative_uids, {type: ''}, null, is_show_msg);
                                is_show_msg = false;
                            }
                            if (positive_uids.length > 0) {
                                gm.me().editAjax('srcahd', 'notify_flag', 'N', 'unique_id', positive_uids, {type: ''}, null, is_show_msg);
                            }

                            gm.me().store.load();

                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //버튼 추가.
        buttonToolbar.insert(6, this.changeUsingStatusAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                gm.me().createPoAction.enable();
                gm.me().readHistoryAction.enable();
                gm.me().excelUploadAction.enable();
                gm.me().fileattachAction.enable();
                gm.me().changeUsingStatusAction.enable();
                gm.me().cartoon_barcode.enable();
            } else {
                gm.me().createPoAction.disable();
                gm.me().readHistoryAction.disable();
                gm.me().excelUploadAction.disable();
                gm.me().fileattachAction.disable();
                gm.me().changeUsingStatusAction.disable();
                gm.me().cartoon_barcode.disable();
            }
        })
        // //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('notify_flag_use', 'false');
        this.store.load(function (records) {
        });
    },

    selectedClassCode: '',

    refreshItemCodeInner: function (sp_code, cuClass_Code) {
        let target_item_code = gm.me().getInputJust('srcahd|item_code');
        let item_code_pre = sp_code == null ? '' : sp_code;
        if (cuClass_Code != null && cuClass_Code.length > 0) {
            item_code_pre = item_code_pre + cuClass_Code;
        }
        target_item_code.setValue(item_code_pre);
    },

    refreshItemCode: function () {
        let sp_code;
        let o = gm.me().inputSpCode;

        if (o != null) {
            sp_code = o.get('systemCode');
        } else {
            let o1 = gm.me().getInputJust('srcahd|sp_code');
            sp_code = o1.getValue();
        }

        let target_class_code = gm.me().getInputJust('srcahd|class_code');
        let cuClass_Code = target_class_code.getValue();

        this.refreshItemCodeInner(sp_code, cuClass_Code);

    },

    copyCallback: function () {
        this.refreshItemCode();
    },

    items: [],
    matType: 'RAW',
    stockviewType: "ALL",

    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, sync_mode, is_show_msg) {

        if (tableName == null || tableName === '') {
            return;
        }
        gm.me().recCount++;

        let params = {};
        if (in_params != null) {
            for (let key in in_params) {
                params[key] = in_params[key];
            }
        }

        let whereValue = [];
        whereValue.push(in_whereValue);

        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        params['valueType'] = gm.getColType(field);

        gm.me().sync_mode = sync_mode;

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
            params: params,
            success: function (result) {
                if (result.responseText != null) {
                    let o = Ext.util.JSON.decode(result.responseText);
                    if (o != null) {
                        if (is_show_msg) {
                            switch (field) {
                                case 'notify_flag':
                                    // gm.me().showToast('셀수정 결과', '사용여부 상태가 변경되었습니다.');
                                    break;
                                default:
                                // gm.me().showToast('셀수정 결과', msg);
                            }
                        }

                        gm.me().recCount--;

                        gm.setCenterLoading(false);

                        if (gm.me().sync_mode === false || gm.me().sync_mode === undefined) {
                            gm.me().sync_mode = null;
                        } else {
                            try {
                                gm.me().getStore().sync();
                            } catch (e) {
                            }
                        }


                    }
                }

            }
        });
    },
    storecount: 0,
    fields: [],
    dwgTypeStore: Ext.create('Mplm.store.DwgTypeStore', {}),
    purchaseYnStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PURCHASE_INS_YN'}),
});

