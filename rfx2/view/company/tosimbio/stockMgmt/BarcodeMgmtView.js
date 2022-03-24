//자재 관리
Ext.define('Rfx2.view.company.bioprotech.stockMgmt.BarcodeMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'barcode-mgmt-view',
    initComponent: function () {
        this.orderbyAutoTable = false;

        //검색툴바 필드 초기화
        this.initSearchField();
        // this.addSearchField(
        //     {
        //         xtype: 'combo',
        //         fieldStyle: 'background-color: #FFFFFF; background-image: none;',
        //         fieldLabel: '프린터 선택',
        //         displayField: 'code_name_kr',
        //         valueField: 'code_name_kr',
        //         store:'PrinterListStore',
        //         listConfig: {
        //             loadingText: '검색 중...',
        //             emptyText: '검색 결과가 없습니다.',
        //             // Custom rendering template for each item
        //             getInnerTpl: function () {
        //                 return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
        //             }
        //         }
        //     });

        //검색툴바 추가
        this.addSearchField(
            {
                xtype: 'combo'
                , anchor: '100%'
                , width: 160
                , field_id: 'is_srcahd'
                , store: 'YnFlagStore'
                , emptyText: '자재 여부'
                , displayField: 'system_code'
                , valueField: 'system_code'
                , params: {}
                , innerTpl: '[{system_code}]{code_name_kr}'
            });


        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //    //검색툴바 추가
        //    this.addSearchField(
        //     {
        //         xtype: 'combo'
        //         , anchor: '100%'
        //         , width: 260
        //         , field_id: 'printer_ip_addr'
        //         , store: 'PrinterListStore'
        //         , emptyText: '프린터 선택'
        //         , displayField: 'system_code'
        //         , valueField: 'system_code'
        //         , params: {  }
        //         , innerTpl: '[{system_code}]{code_name_kr}'
        //     });

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5
            ) {
                buttonToolbar.items.remove(item);
            }
        });
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

        this.addCallback('CHECK_CODE', function (o) {
            var target = gMain.selPanel.getInputJust('extendsrcahd|item_code');
            console_logs('====target', target);
            var code = target.getValue();
            var uppercode = code.toUpperCase();

            if (code.length < 1) {
                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function () {
                });
            } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom',
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
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function () {
                            });
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                            });

                            // var sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();
                            //
                            // if(sg_code == null) {
                            //     sg_code = '';
                            // }
                            //
                            // var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');
                            //
                            // item_code_field.setValue('');

                            var sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();
                            var item_type = gm.me().getInputJust('extendsrcahd|item_type').getValue();
                            if (sg_code == null) {
                                sg_code = '';
                            }
                            var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');
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

        this.setRowClass(function (record, index) {
            var c = record.get('srcadt_varchar40');
            var a = record.get('standard_flag');
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
            var item_type = gm.me().getInputJust('extendsrcahd|item_type').getValue();
            if (sg_code == null) {
                sg_code = '';
            }
            if (item_type == null) {
                item_type = '';
            }
            var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');
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
            text: '바코드 출력22',
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

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            tooltip: '등록된 자재의 도면 또는 기타 파일을 다운로드 합니다.',
            text: '다운로드',
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
                var gridContent = Ext.create('Ext.panel.Panel', {
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
                var prWin = Ext.create('Ext.Window', {
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


        // 바코드 출력 버튼
        this.generalBarcode = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '재고조사 바코드 출력',
            tooltip: '바코드를 출력합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('generalBarcode'),
            handler: function () {
                gm.me().printBarcode();
            }
        });


        //버튼 추가.
        // buttonToolbar.insert(4, this.excelUploadAction);
        // buttonToolbar.insert(5, this.fileattachAction);
        // buttonToolbar.insert(7, '-');

        buttonToolbar.insert(1, this.generalBarcode);

        // buttonToolbar.insert(7, this.setUsedMatView);
        // buttonToolbar.insert(7, this.setMROView);
        // buttonToolbar.insert(7, this.setSubMatView);
        // buttonToolbar.insert(7, this.setSaMatView);
        // buttonToolbar.insert(7, this.setAssyMatView);
        // buttonToolbar.insert(7, this.setAllMatView);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                gm.me().createPoAction.enable();
                gm.me().readHistoryAction.enable();
                gm.me().excelUploadAction.enable();
                gm.me().fileattachAction.enable();
                gm.me().generalBarcode.enable();
            } else {
                gm.me().createPoAction.disable();
                gm.me().readHistoryAction.disable();
                gm.me().excelUploadAction.disable();
                gm.me().fileattachAction.disable();
                gm.me().generalBarcode.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        // this.store.load(function (records) {
        // });
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

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    // {
                    //     xtype: 'button',
                    //     text: '파일 업로드',
                    //     scale: 'small',
                    //     iconCls: 'af-upload-white',
                    //     scope: this.fileGrid,
                    //     handler: function () {
                    //         console_logs('=====aaa', record);
                    //         var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                    //         var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                    //             uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                    //             uploaderOptions: {
                    //                 url: url
                    //             },
                    //             synchronous: true
                    //         });

                    //         var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                    //             dialogTitle: '파일첨부',
                    //             panel: uploadPanel
                    //         });

                    //         this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                    //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                    //             console_logs('this.mon uploadcomplete manager', manager);
                    //             console_logs('this.mon uploadcomplete items', items);
                    //             console_logs('this.mon uploadcomplete errorCount', errorCount);
                    //             gm.me().uploadComplete(items);
                    //             uploadDialog.close();
                    //         }, this);
                    //         uploadDialog.show();
                    //     }
                    // },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
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
                                                    var o = gu.getCmp('file_quan');
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
                {
                    text: '파일 일련번호',
                    width: 100,
                    style: 'text-align:center',
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    flex: 0.7,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '업로드 날짜',
                    style: 'text-align:center',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'file_size'
                },
                {
                    text: '도면번호',
                    width: 100,
                    sortable: true,
                    // xtype: 'numbercolumn',
                    // format: '0,000',
                    style: 'text-align:center',
                    // align: 'right',
                    dataIndex: 'srccst_varchar1'
                },
                {
                    text: '도면종류',
                    width: 100,
                    sortable: true,
                    // xtype: 'numbercolumn',
                    // format: '0,000',
                    style: 'text-align:center',
                    // align: 'right',
                    dataIndex: 'file_usage'
                },
                {
                    text: '등록자',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1300,
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


    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),
    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
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
                var o = gu.getCmp('file_quan');
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


//바코드 출력

    printBarcode: function () {

        //var selections = selected_rec;
        var selections = gm.me().grid.getSelectionModel().getSelection();

        //var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];
        var item_name = '';

        var item_name_Arr = [];
        var compare_Arr = [];
        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            item_name = rec.get('item_name');
            uniqueIdArr.push(uid);
            item_name_Arr.push(item_name);

            compare_Arr.push(item_name);
        }

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


        });//Panel end...

        //원본
        // if (uniqueIdArr.length > 0) {
        //     prwin = gMain.selPanel.prbarcodeopen(form);
        // }


        var compare = [];
        var checkCompare = 0;

        for (var i = 0; i < item_name_Arr.length; i++) {
            for (var j = 0; j < compare_Arr.length; j++) {
                if (item_name_Arr[i] == compare_Arr[j]) {
                } else {
                    checkCompare = j + j;
                }
            }
        }

        console_logs('checkCompare 비교 값   >>>', checkCompare);

        if (uniqueIdArr.length > 0) {
            if (checkCompare > 0) {
                Ext.Msg.alert('안내', '동일한 품명을 선택해주세요', function () {
                });

            }
            if (checkCompare == 0) {
                //prwin = gMain.selPanel.prbarcodeopen(form);
                prwin = gMain.selPanel.barcodeModal(form);

            }
        }

    },

// 바코드 모달


    barcodeModal: function (form) {

        //셀렉션붙임 시작
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

        var uniqueIdArr = [];
        var bararr = [];

        var cartmap_uid_array = [];
        var srcahd_uid_array = [];
        var item_code_uid_array = [];
        var item_name_uid_array = [];
        var po_no_arr = [];
        var pj_uids = [];
        var gr_quan_arr = [];
        var pcs_desc_arr = [];


        var countPlus = 0;


        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            console_logs('rec', rec);
            var uid = rec.get('unique_id');  //rtgast unique_id???
            var item_code = rec.get('item_code');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            var lot_no = rec.get('lot_no');
            var bar_spec = item_code + '|' + item_name + '|' + specification;

            //원본
            //var srcahd_uid = rec.get('srcahd_uid');
            var srcahd_uid = rec.get('unique_id');


            //var GrQuan = rec.get(('gr_quan'));
            var GrQuan = rec.get(('pr_qty'));
            var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');

            // srcahd.finance_rate,
            //  srcahd.cost_qty,

            pcs_desc_arr.push(pcs_desc_group_assy);
            gr_quan_arr.push(GrQuan);

            uniqueIdArr.push(uid);
            bararr.push(bar_spec);
            cartmap_uid_array.push(uid);
            srcahd_uid_array.push(srcahd_uid);

            item_code_uid_array.push(item_code);
            item_name_uid_array.push(item_name);

        }
        //셀렉션 붙임 끝


        var boxPacking = null;

        var printQuan = null;

        var etc_grid = Ext.create('Ext.grid.Panel', {


            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 750,
            height: 500,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,

            columns: [
                {
                    id: gu.id('countVale'),

                    //text: item_code,
                    text: '포장수량 설정',

                    width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    //value : this.value,

                    listeners: {},

                    renderer: function (value) {

                        gm.me().vEachValueee = value;
                        boxPacking = gm.me().vEachValueee;
                        console_logs('  boxPacking 첫번째 ', boxPacking);

                        return value;
                    },

                    value: boxPacking,

                    sortable: false
                },

                {
                    //text: '품명(' + item_name + ') 입고 수량 :' + gr_quan_arr,
                    text: '출력 매수',
                    //value : gu.id('countVale') * gr_quan_arr,
                    width: '20%',
                    dataIndex: 'each',
                    //editor: 'textfield',
                    editor: 'numberfield',
                    sortable: false,

                    renderer: function (value) {

                        console_logs(' 렌더 value   ', value);

                        gm.me().vprintQuan = value;
                        printQuan = gm.me().vprintQuan;

                        return value;
                    },

                    value: printQuan,

                },
                {
                    text: '출력 자재 총 수량  ',
                    width: '30%',

                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,

                    renderer: function (value) {
                        //console_logs(' ' , );

                        return printQuan * boxPacking;

                        //return value * 5;
                    }
                },

                {
                    text: 'Lot 입력 ',
                    width: '30%',
                    id: gu.id('OrderGoodsLotInputForm'),

                    //dataIndex: 'supplyerLot',
                    dataIndex: 'input_lot',
                    name: 'input_lot',

                    editor: 'textfield',
                    sortable: false,

                    // renderer : function(value) {
                    //     return printQuan * boxPacking;

                    // }
                },


            ],


            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                //clicksToEdit: 2,
                clicksToEdit: 6,
            },
            listeners: {

                click: function () {

                }
            },
            autoScroll: true,
            dockedItems: [


                Ext.create('widget.toolbar', {

                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [

                        {
                            fieldLabel: '프린터',
                            labelWidth: 50,
                            width: 180,
                            xtype: 'combo',
                            margin: '5 5 5 5',
                            id: gu.id('printer'),
                            name: 'printIpAddress',
                            store: Ext.create('Mplm.store.PrinterStore'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            emptyText: '프린터 선택',
                            allowBlank: false
                        },
                        {
                            fieldLabel: '프린트 라벨',
                            labelWidth: 80,
                            width: 220,
                            xtype: 'combo',
                            margin: '5 5 5 5',
                            id: gu.id('print_label'),
                            name: 'labelSize',
                            store: Ext.create('Mplm.store.PrintLabelStore'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            emptyText: '라벨 선택',
                            allowBlank: false
                        },
                        '->',
                        {
                            xtype: 'textfield',
                            labelWidth: 40,
                            name: 'print_qty',
                            fieldLabel: '품명',
                            margin: '0 7 0 7',
                            editable: false,
                            width: 180,
                            allowBlank: false,
                            value: item_name,
                            maxlength: '1',
                        },

                        {
                            text: '+',
                            listeners: [{
                                click: function () {

                                    // var store = gu.getCmp('etc_grid').getStore();

                                    //  store.insert(store.getCount(), new Ext.data.Record({
                                    //      'packing': '0', 'each': '0'
                                    //  }));

                                    var store = gu.getCmp('etc_grid').getStore();
                                    var getCount = store.getCount();

                                    console_logs('item index >> ', getCount);


                                    //+ 버튼은 한번만 입력되도록

                                    // if(getCount==0 ) {

                                    //     console_log('item index >> null ');
                                    //     store.insert(store.getCount(), new Ext.data.Record({
                                    //         'packing': '0', 'each': '0'
                                    //     }));

                                    //  };

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'packing': '0', 'each': '0'
                                    }));

                                    var obj = gu.getCmp('countVale');
                                    var grValue = obj['value'];

                                    console_logs('연산한 값 3333>>>>', grValue);

                                    countPlus = countPlus + 1;
                                    //console_logs('countPlus 출력 >>>> ', countPlus);

                                }
                            }]
                        },

                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                }
                            }]
                        },


                        // {
                        //     xtype: 'textfield',
                        //     dataIndex: 'input_lot',
                        //     name: 'input_lot',
                        //     fieldLabel: 'Lot 입력',
                        //     margin: '1 7 1 6',
                        //     editable: true,
                        //     width: 200,
                        //     allowBlank: false,
                        //     //value: item_name,
                        //     maxlength: '1',
                        // },

                        // {
                        //     xtype: 'textfield',
                        //     id: 'reserved_varchard',
                        //     name: 'reserved_varchard',
                        //     padding: '0 0 5px 30px',
                        //     width: '45%',
                        //     allowBlank: true,
                        //     fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '고객 PO번호'),
                        // },


                    ]
                }),

                //여기부터

                Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        frame: false,
                        border: false,
                        bodyPadding: 10,
                        region: 'center',
                        layout: 'form',
                        autoScroll: true,
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget: 'side'
                        },
                    }
                ),


            ]
        });
        var comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == '192.168.20.11') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        var comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == 'L100x80') {
                        comboLabel.select(record);
                    }
                });
            }
        );

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '자재 입고 바코드 출력  ',
            width: 770,
            height: 500,
            plain: true,
            //items: poEditForm,
            //items: form,

            items: etc_grid,

            overflowY: 'scroll',

            buttons: [{
                text: '바코드 출력',

                handler: function (btn) {

                    var store = gu.getCmp('etc_grid').getStore();
                    var totalIndex = store.getCount();

                    //     store.insert(store.getCount(), new Ext.data.Record({
                    //     'packing': '0', 'each': '0'
                    //  }));

                    //      var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                    //                 gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));

                    var packingTotal = [];
                    var printTotal = [];

                    var packingCount = 0;
                    var printCount = 0;
                    var multiple = 0;

                    var intputLotno = [];


                    var quanArray = []; //포장수량 배열
                    var lotArray = []; //로트 배열
                    var printQuanArray = [];   //출력 매수 배열


                    for (i = 0; i < totalIndex; i++) {
                        packingCount = packingCount + store.data.items[i].get('packing');
                        printCount = printCount + store.data.items[i].get('each');
                        multiple = multiple + store.data.items[i].get('packing') * store.data.items[i].get('each');
                        //packingTotal.push(packingCount);
                        //printTotal.push(printCount);
                        intputLotno = multiple + store.data.items[i].get('input_lot');


                        var packing = store.data.items[i].get('packing');
                        var each = store.data.items[i].get('each');
                        var input_lot = store.data.items[i].get('input_lot');

                        quanArray.push(packing);
                        printQuanArray.push(each);
                        lotArray.push(input_lot);

                    }


                    // var testLot = gu.getCmp('OrderGoodsLotInputForm');
                    // var LotValue = testLot['value'];


                    var LotValue = intputLotno

                    //원본 (+ 0번째만)
                    //var checkValue = printQuan * boxPacking;

                    //prwin = gm.me().checkSumOpen(form);

                    console_logs('GrQuan 출력 >>', GrQuan);
                    console_logs('LotValue 출력 >>', LotValue);

                    if (multiple < GrQuan) {
                        // console_log('총 수량 보다 적습니다'  );
                        // prwin = gm.me().checkSumOpen(form);

                        Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');

                    } else {

                        var objs = [];
                        var columns = [];
                        var obj = {};
                        var store = gu.getCmp('etc_grid').getStore();

                        //cnt는 상관없음
                        //var cnt = store.getCount();

                        var packingArr = [];
                        var packingArray = [];

                        var each = 0;
                        Boolean = true;
                        var sumQty = 0;

                        sumQty = printQuan * boxPacking;

                        console_logs('printQuan  >>>>>>>>  ', printQuan);
                        console_logs('boxPacking  >>>>>>>>  ', boxPacking);


                        for (var x = 0; x < sumQty; x++) {
                            //리스트별로 포장수량 입력
                            packingArray.push(boxPacking);
                        }

                        if (btn == 'no') {
                            prWin.close();

                        } else {
                            var printIpAddress = gu.getCmp('printer').getValue();
                            var labelSize = gu.getCmp('print_label').getValue();


                            Ext.Ajax.request({
                                //url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
                                url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',

                                params: {

                                    print_type: 'EACH',

                                    countPlus: printQuan,
                                    print_qty: printQuan,

                                    printIpAddress: printIpAddress,
                                    labelSize: labelSize,

                                    packingArr: packingArray,

                                    lotrtgastUids: uniqueIdArr,
                                    barcodes: bararr,
                                    lot_no: lot_no,
                                    cartmap_uid_list: cartmap_uid_array,
                                    srcahd_uid_list: srcahd_uid_array,
                                    item_code_uid_list: item_code_uid_array,
                                    item_name_uid_list: item_name_uid_array,
                                    //gr_quan_arr : gr_quan_list
                                    gr_quan_list: gr_quan_arr,
                                    pcs_desc_list: pcs_desc_arr,
                                    input_lot: LotValue,
                                    //Boolean : Boolean,

                                    //labelType : 'order',
                                    //값은 SRCAHD인데 cartmap으로 가서 바코드생성이안됨
                                    labelType: 'stock',


                                    quanArray: quanArray,
                                    printQuanArray: printQuanArray,
                                    lotArray: lotArray
                                },


                                success: function (result, request) {

                                    prWin.close();

                                },
                                failure: extjsUtil.failureMessage
                            });

                        }

                    }   //else 끝
                }
            },

                , {
                    text: '취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        });
        prWin.show();
    },


    createMsTab: function (title, tabname) {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status', 'srccst_varchar1', 'srccst_varchar2']
            }));
        }
        var sc = this.storecount/*++*/;
        var tabDataUpload = Ext.create('Ext.panel.Panel', {
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
                                    var el = e.getTarget(),
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
                                        var l_store = gm.me().stores[0];
                                        for (var i = 0; i < l_store.data.items.length; i++) {
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
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
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

    postDocument: function (url, store, i, tabname) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'DWG');

        var srccst_varchar2 = store.getData().getAt(i).data.srccst_varchar2;
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
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
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
    // gridContent2: null,
    fields: [],
    dwgTypeStore: Ext.create('Mplm.store.DwgTypeStore', {}),
});

