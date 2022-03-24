//원단 관리
Ext.define('Rfx2.view.company.daeji.developmentMgmt.MaterialMgmtWDView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-wd-view',
    initComponent: function () {
        this.orderbyAutoTable = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField({
            type: 'checkbox',
            field_id: 'notify_flag_use',
            items: [
                {
                    boxLabel: '사용중지 포함',
                    checked: false
                },
            ],
        });

        this.addSearchField(
            {
                xtype: 'combo'
                , anchor: '100%'
                , width: 200
                , field_id: 'sg_code'
                , store: 'ClaastStore'
                , displayField: 'class_name'
                , valueField: 'class_code'
                , params: {level1: '1', identification_code: 'MT'}
                , innerTpl: '[{class_code}]{class_name}'
            });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');


        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();
        this.addCallback('GET-SG-CODE', function (combo, record) {
            gMain.selPanel.inputClassCode = record;
            let target_item_code = gMain.selPanel.getInputTarget('item_code');
            let class_code = gMain.selPanel.inputClassCode.get('system_code');
            target_item_code.setValue(target_item_code.getValue() + class_code.substring(0, 1) + '-');
        });

        this.addCallback('GET-CODE-HEAD', function (combo, record) {

            gMain.selPanel.inputBuyer = record;
            let target_item_code = gMain.selPanel.getInputTarget('item_code');
            let wa_code = record.get('wa_code');
            if (target_item_code != null && wa_code != null && wa_code.length > 2) {
                target_item_code.setValue(wa_code.substring(0, 1));
            }
            let address_1 = record.get('address_1');
            let target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
            target_address_1.setValue(address_1);
            combo.select(record);
        });

        this.addCallback('GET-SUP-HEAD', function (combo, record) {
            let seller_name = gMain.selPanel.getInputTarget('seller_code');
            seller_name.setValue(record.get('supplier_code'));
        });

        // 품목번호 자동생성
        this.addCallback('AUTO_ITEMCODE', function () {
            if (this.crudMode === 'EDIT') { // EDIT
                console_logs('preCreateCallback', 'IN EDIT');
            } else {// CREATE,COPY
                // 마지막 자재번호 가져오기
                let target2 = gMain.selPanel.getInputTarget('item_code');
                let class_code = gMain.selPanel.inputClassCode.get('system_code');
                let wa_code = gMain.selPanel.inputBuyer.get('wa_code');
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
            let target = gMain.selPanel.getInputJust('extendsrcahd|item_code');
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

                            // let sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();
                            //
                            // if(sg_code == null) {
                            //     sg_code = '';
                            // }
                            //
                            // let item_code_field = gm.me().getInputJust('extendsrcahd|item_code');
                            //
                            // item_code_field.setValue('');

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
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.setRowClass(function (record) {
            let c = record.get('srcadt_varchar40');
            let a = record.get('standard_flag');
            switch (c) {
                case 'Y':
                    if (a === 'A') {
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

        let option = {
            listeners: {
                itemdblclick: this.bomlistView
            }
        }

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar, option);
        this.createCrudTab();
        this.addCallback('SET_ITEM_CODE', function (o) {

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
            items: [this.grid, this.crudTab]
        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                // gm.me().store.getProxy().setExtraParam('sp_code', 'ASSY');
                gm.me().store.load(function () {
                });
            }
        });

        this.setAssyMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'ASSY',
            tooltip: 'ASSEMBLY',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
                gm.me().store.getProxy().setExtraParam('sp_code', 'ASSY');
                gm.me().store.load(function () {
                });
            }
        });

        this.setSetMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'SET',
            tooltip: 'SET',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sg_code', 'SET00');
                gm.me().store.load(function () {
                });
            }
        });

        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
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

        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
            }
        });

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

                let selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    let uids = [];
                    for (let i = 0; i < selections.length; i++) {
                        let rec = selections[i];
                        let unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result) {
                            let resultText = result.responseText;

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

                let selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    let uids = [];
                    for (let i = 0; i < selections.length; i++) {
                        let rec = selections[i];
                        let unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            let resultText = result.responseText;

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
                let selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('selections', selections);
                if (selections) {
                    let uids = [];
                    for (let i = 0; i < selections.length; i++) {
                        let rec = selections[i];
                        let unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            let resultText = result.responseText;
                            Ext.Msg.alert('안내', '자재 출고 완료.', function () {
                            });
                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }
            }

        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            tooltip: '등록된 자재의 도면 또는 기타 파일을 다운로드 합니다.',
            text: this.getMC('CMD_STANDART_DOCUMENT', '표준서관리'),
            hidden: gu.setCustomBtnHiddenProp('fileattachAction'),
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });

        this.excelUploadAction = Ext.create('Ext.Action', {
            iconCls: 'af-upload-white',
            disabled: true,
            text: '파일업로드',
            tooltip: this.getMC('등록된 자재의 도면을 일괄 업로드 합니다.'),
            handler: function () {
                let gridContent = Ext.create('Ext.panel.Panel', {
                    cls: 'rfx-panel',
                    id: gu.id('gridContent2'),
                    collapsible: false,
                    region: 'east',
                    multiSelect: false,
                    //autoScroll: true,
                    autoHeight: true,
                    frame: false,
                    layout: 'vbox',
                    forceFit: true,
                    flex: 1,
                    items: [gm.me().createMsTab('SIZE', 'SI')]
                });
                let prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('CMD_FILE_UPLOAD', '파일 업로드'),
                    id: gu.id('uploadPrWin'),
                    width: 600,
                    height: 500,
                    items: {
                        collapsible: false,
                        frame: false,
                        region: 'center',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0 0 5 0',
                        flex: 1,
                        items: [gridContent]
                    }
                });

                prWin.show();
            }
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

                        if (result == 'yes') {

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
        buttonToolbar.insert(5, this.fileattachAction);
        buttonToolbar.insert(6, this.changeUsingStatusAction);
        buttonToolbar.insert(7, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                gm.me().createPoAction.enable();
                gm.me().readHistoryAction.enable();
                gm.me().excelUploadAction.enable();
                gm.me().fileattachAction.enable();
                gm.me().changeUsingStatusAction.enable();
            } else {
                gm.me().createPoAction.disable();
                gm.me().readHistoryAction.disable();
                gm.me().excelUploadAction.disable();
                gm.me().fileattachAction.disable();
                gm.me().changeUsingStatusAction.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('notify_flag_use', 'false');
        this.store.load(function (records) {
        });
    },

    selectedClassCode: '',

    reflashClassCode: function (class_code) {
        console_logs('reflashClassCode class_code', class_code);
        this.selectedClassCode = class_code;
        let target_class_code = gm.me().getInputJust('srcahd|class_code');
        console_logs('target_class_code', target_class_code);
        target_class_code.setValue(class_code);
        gm.me().refreshItemCode();
    },

    refreshItemCodeInner: function (sp_code, cuClass_Code) {
        let target_item_code = gm.me().getInputJust('srcahd|item_code');
        let item_code_pre = sp_code == null ? '' : sp_code;
        if (cuClass_Code != null && cuClass_Code.length > 0) {
            item_code_pre = item_code_pre + cuClass_Code;
        }
        target_item_code.setValue(item_code_pre);
    },

    refreshItemCode: function () {
        let sp_code = null;

        //console_logs('gm.me().inputSpCode>>>>>>>>>>>>>>>', gm.me().inputSpCode);
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

    bomlistView: function () {
        if (vCompanyReserved4 != 'APM01KR') {
            return null;
        }
        let selection = gm.me().grid.getSelectionModel().getSelection();
        let rec = selection[0];

        console_logs('===rec', rec);

        let srcahd_uid = rec.get('unique_id_long');

        let win = Ext.create('ModalWindow', {
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
        let BOM_COLUMN = [];

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
        let rec = Ext.getCmp('bom_grid_panel').getSelectionModel().getSelection()[0];

        if (rec != null) {

            let pj_uid = rec.get('ac_uid');
            let parent_uid = rec.get('parent_uid');
            let child = rec.get('unique_uid');

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

    attachFile: function () {
        let record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                let o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        let selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '파일을 첨부 후 나머지 내용을 작성 후 반영확인을 클릭하십시오.<br><br>첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            id: gu.id('attachedFileGrid'),
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일첨부',
                        scale: 'small',
                        iconCls: 'af-upload-white',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            let url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            let uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });

                            let uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                                this.attachedFileStore.load();
                            }, this);
                            uploadDialog.show();

                        }
                    },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                let unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                let file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    let o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }

                        }
                    },
                    {
                        xtype: 'button',
                        text: '새로고침',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            gm.me().attachedFileStore.load();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '반영확인',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            // gm.me().attachedFileStore.load();
                            let store = gu.getCmp('attachedFileGrid').getStore();
                            console_logs('>>>> store', store);
                            let size = store.data.items.length;
                            let uniqueIds = [];
                            let docTypes = [];
                            let docNos = [];
                            let docNames = [];
                            let docVers = [];
                            let docPurcYns = [];

                            if (size > 0) {
                                for (let i = 0; i < size; i++) {
                                    let item = store.data.items[i];
                                    console_logs('>> doc_type', item.get('file_usage'));
                                    let doctype = '';
                                    switch (item.get('file_usage')) {
                                        case '기구도면':
                                            doctype = 'INS';
                                            break;
                                        case '디자인도면':
                                            doctype = 'DES';
                                            break;
                                        case '생산작업지도서':
                                            doctype = 'WIS';
                                            break;
                                        case '포장작업지도서':
                                            doctype = 'PIS';
                                            break;
                                        case '포장사양서' :
                                            doctype = 'PSN';
                                            break;
                                        case '수입검사기준서' :
                                            doctype = 'IIS';
                                            break;
                                    }
                                    if (doctype.length === 0) {
                                        Ext.MessageBox.alert('알림', '문서종류가 부적절한 값이 들어갔거나 존재하지 않습니다.')
                                        return;
                                    } else {
                                        console_logs('>> doctype', doctype);
                                        docTypes.push(doctype);
                                    }
                                    let docNo = item.get('srccst_varchar1');
                                    if (docNo !== undefined) {
                                        docNos.push(docNo);
                                    } else {
                                        docNos.push('NOT');
                                    }

                                    let docName = item.get('srccst_varchar3');
                                    if (docName !== undefined) {
                                        docNames.push(docName);
                                    } else {
                                        docNames.push('NOT');
                                    }

                                    let docVer = item.get('srccst_varchar4')
                                    if (docVer !== undefined) {
                                        docVers.push(docVer);
                                    } else {
                                        docVers.push('NOT');
                                    }

                                    let prc_yn = item.get('srccst_varchar5')
                                    if (prc_yn !== undefined) {
                                        docPurcYns.push(prc_yn);
                                    } else {
                                        docPurcYns.push('NOT');
                                    }
                                    uniqueIds.push(item.get('id'))
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=reflectFileContent',
                                    params: {
                                        uniqueIdsArr: uniqueIds,
                                        docPurcYnArr: docPurcYns,
                                        docVers: docVers,
                                        docNames: docNames,
                                        docNos: docNos,
                                        docTypes: docTypes
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('확인', '반영 되었습니다.');
                                        gm.me().attachedFileStore.load(function (records) {
                                            if (records != null) {
                                                let o = gu.getCmp('file_quan');
                                                if (o != null) {
                                                    o.update('파일 수 : ' + records.length);
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert('알림', '첨부파일 내역이 존재하지 않습니다.');
                            }

                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '파일 수 : 0'
                    },

                ]
            }

            ],
            columns: [
                // {
                //     text: '파일 일련번호',
                //     width: 100,
                //     style: 'text-align:center',
                //     sortable: true,
                //    visible : false,
                //     dataIndex: 'id'
                // },
                {
                    text: '문서종류',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.5,
                    sortable: true,
                    dataIndex: 'file_usage',
                    editor: {
                        xtype: 'combobox',
                        displayField: 'codeName',
                        css: 'edit-cell',
                        editable: false,
                        // forceSelection: true,
                        // mode: 'local',
                        store: gm.me().dwgTypeStore,
                        triggerAction: 'all',
                        valueField: 'codeName'
                    },
                },
                {
                    text: '문서번호',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.7,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar1'
                },
                {
                    text: '문서명',
                    style: 'text-align:center',
                    width: '18%',
                    // flex: 0.7,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar3'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    width: '20%',
                    // flex: 0.5,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '문서버전',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.3,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar4'
                },
                {
                    text: '주문서등록여부',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.3,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        displayField: 'codeName',
                        css: 'edit-cell',
                        editable: false,
                        // forceSelection: true,
                        // mode: 'local',
                        store: gm.me().purchaseYnStore,
                        triggerAction: 'all',
                        valueField: 'systemCode',
                        listeners: {
                            expand: function () {
                                let store = gu.getCmp('attachedFileGrid').getStore();
                                let record = gu.getCmp('attachedFileGrid').getSelectionModel().getSelected().items[0];
                                let doc_type = record.get('file_usage');
                                console_logs('>>> doc_type : ', doc_type);
                                if (doc_type === '기구도면' || doc_type === '디자인도면') {
                                    this.store.load();
                                } else {
                                    Ext.MessageBox.alert('알림', '문서종류를 기구도면 또는 디자인도면을 선택했을 경우 선택가능합니다.');
                                }
                            },
                        }
                    },
                    dataIndex: 'srccst_varchar5'
                },
                {
                    text: '작성자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'creator'
                },
                {
                    text: '작성일자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'create_date'
                },
            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
        });

        let win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1280,
            height: 600,
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
                this.fileGrid
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


    // attachFile: function () {
    //     let record = gm.me().grid.getSelectionModel().getSelection()[0];

    //     this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
    //     // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
    //     this.attachedFileStore.load(function (records) {
    //         if (records != null) {
    //             let o = gu.getCmp('file_quan');
    //             if (o != null) {
    //                 o.update('파일 수 : ' + records.length);
    //             }

    //         }
    //     });

    //     let selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
    //     this.fileGrid = Ext.create('Ext.grid.Panel', {
    //         title: '첨부된 파일 리스트',
    //         store: this.attachedFileStore,
    //         collapsible: false,
    //         multiSelect: true,
    //         // hidden : ! this.useDocument,
    //         // selModel: selFilegrid,
    //         stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
    //         dockedItems: [{
    //             dock: 'top',
    //             xtype: 'toolbar',
    //             cls: 'my-x-toolbar-default2',
    //             items: [
    //                 // {
    //                 //     xtype: 'button',
    //                 //     text: '파일 업로드',
    //                 //     scale: 'small',
    //                 //     iconCls: 'af-upload-white',
    //                 //     scope: this.fileGrid,
    //                 //     handler: function () {
    //                 //         console_logs('=====aaa', record);
    //                 //         let url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
    //                 //         let uploadPanel = Ext.create('Ext.ux.upload.Panel', {
    //                 //             uploader: 'Ext.ux.upload.uploader.FormDataUploader',
    //                 //             uploaderOptions: {
    //                 //                 url: url
    //                 //             },
    //                 //             synchronous: true
    //                 //         });

    //                 //         let uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
    //                 //             dialogTitle: '파일첨부',
    //                 //             panel: uploadPanel
    //                 //         });

    //                 //         this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
    //                 //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
    //                 //             console_logs('this.mon uploadcomplete manager', manager);
    //                 //             console_logs('this.mon uploadcomplete items', items);
    //                 //             console_logs('this.mon uploadcomplete errorCount', errorCount);
    //                 //             gm.me().uploadComplete(items);
    //                 //             uploadDialog.close();
    //                 //         }, this);
    //                 //         uploadDialog.show();
    //                 //     }
    //                 // },
    //                 {
    //                     xtype: 'button',
    //                     text: '파일삭제',
    //                     scale: 'small',
    //                     iconCls: 'af-remove',
    //                     scope: this.fileGrid,
    //                     handler: function () {
    //                         console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
    //                         if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
    //                             let unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
    //                             let file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
    //                             if (unique_id != null) {
    //                                 Ext.Ajax.request({
    //                                     url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
    //                                     params: {
    //                                         file_path: file_path,
    //                                         unique_id: unique_id
    //                                     },
    //                                     success: function (result, request) {
    //                                         Ext.MessageBox.alert('확인', '삭제 되었습니다.');
    //                                         gm.me().attachedFileStore.load(function (records) {
    //                                             if (records != null) {
    //                                                 let o = gu.getCmp('file_quan');
    //                                                 if (o != null) {
    //                                                     o.update('파일 수 : ' + records.length);
    //                                                 }
    //                                             }
    //                                         });
    //                                     }
    //                                 });
    //                             }
    //                         } else {
    //                             Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
    //                         }
    //                     }
    //                 },
    //                 this.removeActionFile,
    //                 '-',
    //                 this.sendFileAction,
    //                 '->',
    //                 {
    //                     xtype: 'component',
    //                     id: gu.id('file_quan'),
    //                     style: 'margin-right:5px;width:100px;text-align:right',
    //                     html: '파일 수 : 0'
    //                 },

    //             ]
    //         }

    //         ],
    //         columns: [
    //             {
    //                 text: '파일 일련번호',
    //                 width: 100,
    //                 style: 'text-align:center',
    //                 sortable: true,
    //                 dataIndex: 'id'
    //             },
    //             {
    //                 text: '파일명',
    //                 style: 'text-align:center',
    //                 flex: 0.7,
    //                 sortable: true,
    //                 dataIndex: 'object_name'
    //             },
    //             {
    //                 text: '파일유형',
    //                 style: 'text-align:center',
    //                 width: 70,
    //                 sortable: true,
    //                 dataIndex: 'file_ext'
    //             },
    //             {
    //                 text: '업로드 날짜',
    //                 style: 'text-align:center',
    //                 width: 160,
    //                 sortable: true,
    //                 dataIndex: 'create_date'
    //             },
    //             {
    //                 text: 'size',
    //                 width: 100,
    //                 sortable: true,
    //                 xtype: 'numbercolumn',
    //                 format: '0,000',
    //                 style: 'text-align:center',
    //                 align: 'right',
    //                 dataIndex: 'file_size'
    //             },
    //             {
    //                 text: '도면번호',
    //                 width: 100,
    //                 sortable: true,
    //                 // xtype: 'numbercolumn',
    //                 // format: '0,000',
    //                 style: 'text-align:center',
    //                 // align: 'right',
    //                 dataIndex: 'srccst_varchar1'
    //             },
    //             {
    //                 text: '도면종류',
    //                 width: 100,
    //                 sortable: true,
    //                 // xtype: 'numbercolumn',
    //                 // format: '0,000',
    //                 style: 'text-align:center',
    //                 // align: 'right',
    //                 dataIndex: 'file_usage'
    //             },
    //             {
    //                 text: '등록자',
    //                 style: 'text-align:center',
    //                 width: 70,
    //                 sortable: true,
    //                 dataIndex: 'creator'
    //             },
    //         ]
    //     });

    //     let win = Ext.create('ModalWindow', {
    //         title: '첨부파일',
    //         width: 1300,
    //         height: 600,
    //         minWidth: 250,
    //         minHeight: 180,
    //         autoScroll: true,
    //         layout: {
    //             type: 'vbox',
    //             align: 'stretch'
    //         },
    //         xtype: 'container',
    //         plain: true,
    //         items: [
    //             this.fileGrid
    //         ],
    //         buttons: [{
    //             text: CMD_OK,
    //             handler: function () {
    //                 if (win) {
    //                     win.close();
    //                 }
    //             }
    //         }]
    //     });
    //     win.show();
    // },


    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),
    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        let output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title: '파일업로드 완료',
            icon: Ext.MessageBox['INFO'],
            msg: '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width: 450
        });

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                let o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
    },

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

        let poHistoryStore = new Ext.data.Store({
            pageSize: 50,
            model: 'XpoAstHistory',
            sorters: [{
                property: 'po_date',
                direction: 'DESC'
            }]
        });

        let selection = gm.me().grid.getSelectionModel().getSelection()[0];
        let uid_srcahd = selection.get('unique_id_long');

        poHistoryStore.getProxy().setExtraParam('uid_srcahd', uid_srcahd);
        poHistoryStore.load();


        let bomHistoryGrid = Ext.create('Ext.grid.Panel', {
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

        let win = Ext.create('ModalWindow', {
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

    createMsTab: function (title, tabname) {
        let record = gm.me().grid.getSelectionModel().getSelection()[0];
        if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status', 'srccst_varchar1', 'srccst_varchar2']
            }));
        }
        let sc = this.storecount/*++*/;
        let tabDataUpload = Ext.create('Ext.panel.Panel', {
            //title: title,
            tabPosition: 'bottom',
            plain: true,
            width: '100%',
            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            items: [{
                                multiSelect: true,
                                xtype: 'grid',
                                id: 'UploadGrid' + [sc],
                                selModel: Ext.create("Ext.selection.CheckboxModel"),
                                columns: [{
                                    header: gm.me().getMC('mes_sro5_pln_column_file_name', '파일명'),
                                    dataIndex: 'name',
                                    style: 'text-align:center',
                                    flex: 1
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                    dataIndex: 'size',
                                    style: 'text-align:center',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_status', '상태'),
                                    dataIndex: 'status',
                                    flex: 1,
                                    style: 'text-align:center',
                                    renderer: this.rendererStatus
                                }, {
                                    // header: gm.me().getMC('mes_sro5_pln_column_status', '도면번호'),
                                    header: '도면번호',
                                    dataIndex: 'srccst_varchar1',
                                    style: 'text-align:center',
                                    editor: 'textfield',
                                    flex: 1,
                                    // renderer: this.rendererStatus
                                }, {
                                    // header: gm.me().getMC('mes_sro5_pln_column_status', '도면종류'),
                                    header: '도면종류',
                                    dataIndex: 'srccst_varchar2',
                                    style: 'text-align:center',
                                    flex: 1,
                                    editor: {
                                        xtype: 'combobox',
                                        displayField: 'codeName',
                                        css: 'edit-cell',
                                        editable: false,
                                        // forceSelection: true,
                                        // mode: 'local',
                                        store: gm.me().dwgTypeStore,
                                        triggerAction: 'all',
                                        valueField: 'codeName'
                                    }
                                    // renderer: this.rendererStatus

                                }],
                                viewConfig: {
                                    emptyText: gm.me().getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
                                    height: 700,
                                    deferEmptyText: false
                                },
                                plugins: {
                                    ptype: 'cellediting',
                                    clicksToEdit: 2,
                                },
                                store: this.stores[sc],

                                listeners: {

                                    drop: {
                                        element: 'el',
                                        fn: 'drop'
                                    },

                                    dragstart: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragenter: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragover: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragleave: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                    dragexit: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                },

                                noop: function (e) {
                                    e.stopEvent();
                                },

                                addDropZone: function (e) {
                                    if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                        return;
                                    }
                                    e.stopEvent();
                                    this.addCls('drag-over');
                                },

                                removeDropZone: function (e) {
                                    let el = e.getTarget(),
                                        thisEl = this.getEl();
                                    e.stopEvent();
                                    if (el === thisEl.dom) {
                                        this.removeCls('drag-over');
                                        return;
                                    }

                                    while (el !== thisEl.dom && el && el.parentNode) {
                                        el = el.parentNode;
                                    }

                                    if (el !== thisEl.dom) {
                                        this.removeCls('drag-over');
                                    }

                                },

                                drop: function (e) {

                                    e.stopEvent();
                                    Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                                        gm.me().stores[0].add({
                                            file: file,
                                            name: file.name,
                                            size: file.size,
                                            status: '대기'

                                        });
                                    });
                                    this.removeCls('drag-over');
                                },

                                tbar: [{
                                    text: gm.me().getMC('mes_sro5_pln_btn_upload', '업로드'),
                                    handler: function () {
                                        let l_store = gm.me().stores[0];
                                        for (let i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                                                l_store.getData().getAt(i).data.status = gm.me().getMC('mes_sro5_pln_btn_uploading', '업로드중');
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long'),
                                                    l_store, i, tabname);
                                            }
                                        }
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_all', '전체삭제'),
                                    handler: function () {
                                        let l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                    handler: function () {
                                        let l_store = gm.me().stores[0];
                                        l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                    }
                                }]
                            }],
                        }
                    ]
                }
            ]
        });
        return tabDataUpload;
    },

    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, sync_mode, is_show_msg) {

        if (tableName == null || tableName == '') {
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
            success: function (result, request) {

                let resultText = result.responseText;
                if (resultText !== null) {
                    let o = Ext.util.JSON.decode(resultText);
                    if (o != null) {
                        let field_name = gm.getColName(o['setField']);
                        let field_type = gm.getColType(o['setField']);
                        let value = o['setValue'];
                        let id = o['whereValue'];

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

                        if (gm.me().sync_mode == false || gm.me().sync_mode == undefined) {
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
    postDocument: function (url, store, i) {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        let fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type','DWG');

        let srccst_varchar2 = store.getData().getAt(i).data.srccst_varchar2;
        if (srccst_varchar2 === '디자인도면') {
            srccst_varchar2 = 'DES';
        } else if (srccst_varchar2 === '기구도면') {
            srccst_varchar2 = 'INS';
        } else {
            srccst_varchar2 = store.getData().getAt(i).data.srccst_varchar2;
        }
        fd.append('srccst_varchar1', store.getData().getAt(i).data.srccst_varchar1);
        fd.append('srccst_varchar2', store.getData().getAt(i).data.srccst_varchar2);
        //fd.append('product_type', 'BW');
        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }
                    for (let j = 0; j < store.data.items.length; j++) {
                        let record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                let data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (let j = 0; j < store.data.items.length; j++) {
                    let record = store.getData().getAt(j);
                    store.remove(record);
                    j--;
                }
                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }
        };
        xhr.send(fd);
    },
    stores: [],
    ingredientList: [],
    storecount: 0,
    fields: [],
    dwgTypeStore: Ext.create('Mplm.store.DwgTypeStore', {}),
    purchaseYnStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PURCHASE_INS_YN'}),
});