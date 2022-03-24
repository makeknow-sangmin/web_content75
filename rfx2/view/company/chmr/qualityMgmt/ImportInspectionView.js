Ext.define('Rfx2.view.company.chmr.qualityMgmt.ImportInspectionView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'import-inspection-view',


    initComponent  : function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type    : 'checkbox',
            field_id: 'isDeterminant',
            items   : [
                {
                    boxLabel: '판정처리 완료만',
                    checked : false
                },
            ],
        });

        this.addSearchField({
            type    : 'dateRange',
            field_id: 'search_date',
            text    : "입고일",
            sdate   : Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate   : new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls : 'af-download',
            itemId  : 'fileattachAction',
            disabled: true,
            text    : '파일관리',
            handler : function (widget, event) {
                gm.me().attachFile();
            }
        });
        buttonToolbar.insert(1, this.fileattachAction);
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.chmr.ImportInspection',
            sorters   : [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            pageSize  : gMain.pageSize,/*pageSize*/
        }, {});

        this.store.getProxy().setExtraParam('is_ok', 'Y');
        this.store.getProxy().setExtraParams({
            'standard_flag': 'R',
        });

        this.reportsPrint = Ext.create('Ext.Action', {
            iconCls : 'af-pdf',
            text    : '성적서 출력',
            tooltip : '성적서 출력을 합니다.',
            disabled: true,
            handler : function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var v028 = rec.get('v028');
                console_logs('>>> v028', v028.length);
                if (v028.length > 0) {
                    var spec_need_flag = rec.get('spec_need_flag');
                    if (spec_need_flag.length > 0) {
                        var wgrastUid = rec.get('unique_id_long');
                        var srcahdUid = rec.get('srcahd_uid');
                        var manufacturer = rec.get('manufacturer');
                        Ext.Ajax.request({
                            url    : CONTEXT_PATH + '/pdf.do?method=reportsPrint',
                            params : {
                                wgrastUid   : wgrastUid,
                                srcahdUid   : srcahdUid,
                                manufacturer: manufacturer,
                                is_rotate   : 'N'
                            },
                            success: function (result, request) {
                                var jsonData = Ext.JSON.decode(result.responseText);
                                var pdfPath = jsonData.pdfPath;
                                console_log(pdfPath);
                                if (pdfPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                    top.location.href = url;
                                }
                                // gm.me().pdfDownload(size, reportSelection, ++pos);
                            },
                            failure: function (result, request) {
                                var result = result.responseText;
                                Ext.MessageBox.alert('알림', result);
                            }
                        });
                    } else {
                        Ext.MessageBox.alert('알림', '준비중인 성적서 입니다.');
                    }

                } else {
                    Ext.MessageBox.alert('알림', '판정결과가 없는 항목의 성적서는 출력이 불가능 합니다.');
                }

            }
        });

        buttonToolbar.insert(1, this.reportsPrint);

        this.addTakeResult = Ext.create('Ext.Action', {
            iconCls : 'af-plus-circle',
            text    : '성적서 결과입력',
            disabled: true,
            handler : function () {
                gm.me().doOpenInspectReport();
            }
        });

        this.addTestData = Ext.create('Ext.Action', {
            iconCls : 'af-plus-circle',
            text    : '시험데이터 입력',
            disabled: true,
            handler : function () {
                gm.me().doOpenTestData();
            }
        });

        // 검사 삭제 버튼
        this.deleteInspection = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : '검사삭제',
            tooltip : this.getMC('msg_btn_prd_add', '수입검사 내역 삭제'),
            disabled: true,
            handler : function () {
                Ext.MessageBox.show({
                    title  : '삭제',
                    msg    : '선택한 차수의 수입검사 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (btn) {
                        if (btn == 'yes') {
                            var record = gm.me().grid.getSelectionModel().getSelection()[0].data;
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroyInspection',
                                params : {
                                    target_uid   : record.unique_id_long,
                                    type         : !record.type ? 'I' : record.type, // 기본값 2(최종검사)
                                    inspection_no: !record.v027 ? 1 : record.v027 // 기본값 1차 검사
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });
        buttonToolbar.insert(1, this.addTakeResult);

        buttonToolbar.insert(2, this.addTestData);

        var btnsNeedsSelection = [];

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        this.testStore = Ext.create('Rfx2.store.company.bioprotech.ImportInspectionStore', {pageSize: 10});

        Ext.apply(this, {
            layout: 'border',
            items : this.grid
        });

        this.callParent(arguments);

        var dateRangeId = this.link + '-' + gMain.getSearchField('search_date');
        sDateField = Ext.getCmp(dateRangeId + '-s');
        eDateField = Ext.getCmp(dateRangeId + '-e');
        sDateField.setMaxValue(new Date());
        eDateField.setMaxValue(new Date());

        //디폴트 로드
        this.store.getProxy().setExtraParams({
            isReady: true,
        });
        gm.setCenterLoading(false);
        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                gm.me().addTakeResult.enable();
                gm.me().fileattachAction.enable();
                gm.me().addTestData.enable();
                gUtil.enable(gMain.selPanel.reportsPrint);

            } else {
                gm.me().addTakeResult.disable();
                gm.me().fileattachAction.disable();
                gm.me().addTestData.disable();
                gUtil.disable(gMain.selPanel.reportsPrint);
            }
        });

    }, // end of init
    inspectList    : Ext.create('Rfx2.store.company.chmr.MaterialInspectionListStore'),
    granularityList: Ext.create('Rfx2.store.company.chmr.MaterialGranularityListStore'),
    decisionStore  : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'INPSECT_DECISION'}),
    combstStore    : Ext.create('Mplm.store.SupastStore', {}),
    selectCombst   : function () {
        // var detailStore = Ext.create('Rfx2.store.company.chmr.MoneyInStoreByBill', {});
        // detailStore.getProxy().setExtraParam('project_uid', rec.get('ac_uid'));
        // detailStore.getProxy().setExtraParam('combst_uid', rec.get('order_com_unique'));
        gm.me().combstStore.getProxy().setExtraParam('wa_name', '');
        gm.me().combstStore.getProxy().setExtraParam('biz_no', '');
        gm.me().combstStore.load();
        // gm.me().combstStore.load();

        // paytype.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store    : gm.me().combstStore,
            selModel : Ext.create("Ext.selection.CheckboxModel", {}),
            id       : gu.id('loadForm'),
            layout   : 'fit',
            title    : '',
            region   : 'center',
            style    : 'padding-left:0px;',
            plugins  : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            bbar     : getPageToolbar(gm.me().combstStore),
            columns  : [
                {
                    id       : gu.id('supplier_name'),
                    text     : "공급사명",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'supplier_name',
                    sortable : true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text     : "사업자번호",
                    flex     : 1,
                    dataIndex: 'business_registration_no',
                    // align: 'right',
                    style   : 'text-align:center',
                    sortable: true,

                },
                {
                    text     : "대표자명",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'president_name',
                    sortable : true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },

                {
                    text     : "본사주소",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'address_1',
                    sortable : true,
                },

            ],
            listeners: {
                itemdblclick: function (dv, record, item, index, e) {
                    var selections = loadForm.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('>>>> rec dbclick', rec);
                    var order_com_unique = rec.get('unique_id');
                    let supplier_name = rec.get('supplier_name');
                    let address = rec.get('address_1');
                    console_logs('>>>>>>>>address', address);
                    gu.getCmp('v004').setValue(supplier_name);
                    gu.getCmp('v001').setValue(address);
                    gu.getCmp('supast_uid').setValue(order_com_unique);

                    winProduct.setLoading(false);
                    winProduct.close();

                    //공급사 선택 후 검사항목 및 체가름 관리선 설정 road
                    var select = gm.me().grid.getSelectionModel().getSelection()[0];

                    gm.me().inspectList.getProxy().setExtraParam('srcahd_uid', select.get('srcahd_uid'));
                    gm.me().inspectList.getProxy().setExtraParam('wgrast_uid', select.get('unique_id_long'))
                    gm.me().inspectList.getProxy().setExtraParam('inspection_standard', 'D');
                    gm.me().inspectList.getProxy().setExtraParam('type', 'D');
                    gm.me().inspectList.getProxy().setExtraParam('supast_uid', rec.get('unique_id_long'));

                    gm.me().granularityList.getProxy().setExtraParam('srcahd_uid', select.get('srcahd_uid'));
                    gm.me().granularityList.getProxy().setExtraParam('wgrast_uid', select.get('unique_id_long'))
                    gm.me().granularityList.getProxy().setExtraParam('inspection_standard', 'G');
                    gm.me().granularityList.getProxy().setExtraParam('type', 'G');
                    gm.me().granularityList.getProxy().setExtraParam('supast_uid', rec.get('unique_id_long'));

                    gm.me().inspectList.load();
                    gm.me().granularityList.load();
                    var record = gm.me().grid.getSelectionModel().getSelection()[0];
                    Ext.Ajax.request({
                        url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionTestBaseInfo',
                        params : {
                            target_uid: record.get('unique_id_long'),
                        },
                        success: function (result, request) {
                            var result = result.responseText;

                            console_logs('>>>>> result', result);
                            if (result != 'null') {
                                var result_split = result.split('|', 10);
                                console_logs('>>>>> result', result_split);
                                console_logs('>>>>> result_split', result_split[3]);
                                let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                                let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                                let v002 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                                let v003 = result_split[3];
                                let v005 = result_split[4];
                                let v006 = result_split[5] === "null" || result_split[5] === "" ? '' : result_split[5];
                                let v007 = result_split[6] === "null" || result_split[6] === "" ? vCUR_USER_NAME : result_split[6];
                                let v008 = result_split[7] === "null" || result_split[7] === "" ? '' : result_split[7];
                                let v009 = result_split[8] === "null" || result_split[8] === "" ? '' : result_split[8];
                                let v010 = result_split[9] === "null" || result_split[9] === "" ? '' : result_split[9];

                                if (v004.length > 0) {
                                    gu.getCmp('v004').setValue(v004);
                                }
                                if (v001.length > 0) {
                                    gu.getCmp('v001').setValue(v001);
                                }
                                if (v002.length > 0) {
                                    gu.getCmp('v002').setValue(v002);
                                }
                                if (v003.length > 0) {
                                    gu.getCmp('v003').setValue(v003 === "null" || v003 === "" ? '' : new Date(v003));
                                }
                                if (v004.length > 0) {
                                    gu.getCmp('v004').setValue(v004);
                                }
                                if (v005.length > 0) {
                                    gu.getCmp('v005').setValue(v005);
                                    gu.getCmp('v005').setValue(v005 === "null" || v005 === "" ? '' : new Date(v005));
                                }
                                if (v006.length > 0) {
                                    gu.getCmp('v006').setValue(v006);
                                }
                                if (v007.length > 0) {
                                    gu.getCmp('v007').setValue(v007);
                                }
                                if (v008.length > 0) {
                                    gu.getCmp('v008').setValue(v008);
                                }
                                if (v009.length > 0) {
                                    gu.getCmp('v009').setValue(v009);
                                }
                                if (v010.length > 0) {
                                    gu.getCmp('v010').setValue(v010);
                                }

                                gu.getCmp('gr_qty').setValue(record.get('gr_qty'));


                            } else {
                                console_logs('>>>>> check', '기본정보가 없으므로 마지막 정보를 출력하는 모드 변경');
                                Ext.Ajax.request({
                                    url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionLastHeaderInfo',
                                    params : {
                                        srcahd_uid: record.get('srcahd_uid'),
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        console_logs('>>>>> result', result);
                                        if (result != 'null') {
                                            var result_split = result.split('|', 7);
                                            let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                                            let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                                            let v006 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                                            let v007 = vCUR_USER_NAME;
                                            if (v004.length > 0) {
                                                gu.getCmp('v004').setValue(v004);
                                            }
                                            if (v001.length > 0) {
                                                gu.getCmp('v001').setValue(v001);
                                            }
                                            if (v006.length > 0) {
                                                gu.getCmp('v006').setValue(v006);
                                            }
                                            if (v007.length > 0) {
                                                gu.getCmp('v007').setValue(v007);
                                            }
                                            gu.getCmp('gr_qty').setValue(record.get('gr_qty'));
                                        } else {
                                            gu.getCmp('v007').setValue(vCUR_USER_NAME);
                                            gu.getCmp('gr_qty').setValue(record.get('gr_qty'));
                                        }
                                    }, //endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    },
                                });
                            }
                        }, //endofsuccess
                        failure: function (result, request) {
                            var result = result.responseText;
                            Ext.MessageBox.alert('알림', result);
                        },
                    });

                }
            },

            renderTo   : Ext.getBody(),
            autoScroll : true,
            multiSelect: true,
            pageSize   : 100,
            width      : 300,
            height     : 300,
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls  : 'my-x-toolbar-default1',
                    items: [
                        {
                            width          : 200,
                            field_id       : 'wa_name',
                            id             : gu.id('wa_name_search'),
                            name           : 'wa_name',
                            xtype          : 'triggerfield',
                            emptyText      : '회사명',
                            trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().combstStore.load();
                            },
                            listeners      : {
                                change: function (fieldObj, e) {
                                    //if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().combstStore.getProxy().setExtraParam('wa_name', gu.getCmp('wa_name_search').getValue());
                                    gm.me().combstStore.load();
                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                    //}
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html  : c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            width          : 200,
                            field_id       : 'biz_no',
                            id             : gu.id('biz_no_search'),
                            name           : 'biz_no',
                            xtype          : 'triggerfield',
                            emptyText      : '사업자번호',
                            trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().combstStore.load();
                            },
                            listeners      : {
                                change: function (fieldObj, e) {
                                    //if (e.getKey() == Ext.EventObject.ENTER) {

                                    gm.me().combstStore.getProxy().setExtraParam('biz_no', gu.getCmp('biz_no_search').getValue());
                                    gm.me().combstStore.load();
                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                    //}
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html  : c.emptyText
                                    });
                                }
                            }
                        },
                        '->',
                        this.addCombst
                    ]
                }] // endofdockeditems
        });

        loadForm.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                } else {

                }
            }
        });

        var winProduct = Ext.create('ModalWindow', {
            title    : '공급사를 선택후 확인버튼을 클릭하세요.',
            width    : 700,
            height   : 600,
            minWidth : 600,
            minHeight: 300,
            items    : [
                // searchPalletGrid, 
                loadForm
            ],
            buttons  : [{
                text   : CMD_OK,
                handler: function (btn) {
                    var sel = loadForm.getSelectionModel().getSelected().items[0];
                    console_logs('>>> sel >>>>', sel);
                    if (sel !== undefined) {
                        console_logs('>>> sel111', sel);
                        var unique_id_long = sel.get('unique_id_long');
                        let supplier_name = sel.get('supplier_name');
                        console_logs('supplier_name', supplier_name);
                        gu.getCmp('v004').setValue(supplier_name);
                        winProduct.setLoading(false);
                        winProduct.close();
                    } else {
                        Ext.MessageBox.alert('알림', '고객사가 선택되지 않았습니다.');
                        return;
                    }
                }
            }]
        });
        winProduct.show();
    },

    doOpenInspectReport: function () {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];

        let spec_need_flag = select.get('spec_need_flag');

        gm.me().inspectList.getProxy().setExtraParam('srcahd_uid', select.get('srcahd_uid'));
        gm.me().inspectList.getProxy().setExtraParam('wgrast_uid', select.get('unique_id_long'))
        gm.me().inspectList.getProxy().setExtraParam('inspection_standard', 'D');
        gm.me().inspectList.getProxy().setExtraParam('type', 'D');
        gm.me().inspectList.getProxy().setExtraParam('supast_uid', select.get('manufacturer'));

        gm.me().granularityList.getProxy().setExtraParam('srcahd_uid', select.get('srcahd_uid'));
        gm.me().granularityList.getProxy().setExtraParam('wgrast_uid', select.get('unique_id_long'))
        gm.me().granularityList.getProxy().setExtraParam('inspection_standard', 'G');
        gm.me().granularityList.getProxy().setExtraParam('type', 'G');
        gm.me().granularityList.getProxy().setExtraParam('supast_uid', select.get('manufacturer'));


        gm.me().inspectList.load();
        gm.me().granularityList.load();

        var productGrid = Ext.create('Ext.grid.Panel', {
            store      : gm.me().inspectList,
            cls        : 'rfx-panel',
            id         : gu.id('inspectGrid'),
            collapsible: false,
            multiSelect: false,
            width      : 1000,
            margin     : '0 0 20 0',
            autoHeight : true,
            frame      : false,
            border     : true,
            forceFit   : false,
            columns    : [
                {
                    text     : 'No',
                    width    : '5%',
                    dataIndex: 'order_number',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '검사항목',
                    width    : '30%',
                    dataIndex: 'legend_code_kr',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '단위',
                    width    : '10%',
                    dataIndex: 'unit_name',
                    style    : 'text-align:center',
                    sortable : false,
                },
                {
                    text     : '기준치',
                    width    : '10%',
                    dataIndex: 'baseline',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '측정치',
                    width    : '10%',
                    dataIndex: 'measure',
                    editor   : 'textfield',
                    style    : 'text-align:center',
                    align    : 'left',
                    sortable : false,
                },
                {
                    text     : '판정',
                    width    : '10%',
                    css      : 'edit-cell',
                    dataIndex: 'decision',
                    style    : 'text-align:center',
                    sortable : false,
                    editor   : {
                        xtype         : 'combobox',
                        id            : gu.id('decision'),
                        displayField  : 'codeName',
                        editable      : true,
                        forceSelection: true,
                        store         : gm.me().decisionStore,
                        triggerAction : 'all',
                        valueField    : 'systemCode'
                    },
                    renderer : function (val) {
                        var recordIndex = gm.me().decisionStore.find('systemCode', val);
                        console_logs('>>>> recordIndex ', recordIndex);
                        if (recordIndex === -1) {
                            return '';
                        }
                        return gm.me().decisionStore.getAt(recordIndex).get('codeName');
                    },
                },
                {
                    text     : '비고',
                    width    : '25%',
                    css      : 'edit-cell',
                    dataIndex: 'comment',
                    style    : 'text-align:center',
                    editor   : 'textfield',
                    sortable : false
                },
            ],
            selModel   : 'cellmodel',
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            listeners  : {
                edit: function (editor, e, eOpts) {

                }
            },

        });

        var granularityGrid = Ext.create('Ext.grid.Panel', {
            store      : gm.me().granularityList,
            cls        : 'rfx-panel',
            id         : gu.id('granularityGrid'),
            collapsible: false,
            multiSelect: false,
            width      : 1000,
            margin     : '0 0 20 0',
            autoHeight : true,
            frame      : false,
            border     : true,
            forceFit   : false,
            columns    : [
                {
                    text     : 'No',
                    width    : '5%',
                    dataIndex: 'order_number',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '체크기',
                    width    : '5%',
                    dataIndex: 'unit_name',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '시방범위',
                    width    : '10%',
                    dataIndex: 'baseline',
                    style    : 'text-align:center',
                    sortable : false
                },
                {
                    text     : '통과율(%)',
                    width    : '10%',
                    dataIndex: 'measure',
                    editor   : 'textfield',
                    style    : 'text-align:center',
                    align    : 'left',
                    sortable : false,
                },

            ],
            selModel   : 'cellmodel',
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            listeners  : {
                edit: function (editor, e, eOpts) {

                }
            },

        });

        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        Ext.Ajax.request({
            url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionTestBaseInfo',
            params : {
                target_uid: record.get('unique_id_long'),
            },
            success: function (result, request) {
                var result = result.responseText;

                console_logs('>>>>> result', result);
                if (result != 'null') {
                    var result_split = result.split('|', 10);
                    console_logs('>>>>> result', result_split);
                    console_logs('>>>>> result_split', result_split[3]);
                    let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                    let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                    let v002 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                    let v003 = result_split[3];
                    let v005 = result_split[4];
                    let v006 = result_split[5] === "null" || result_split[5] === "" ? '' : result_split[5];
                    let v007 = result_split[6] === "null" || result_split[6] === "" ? vCUR_USER_NAME : result_split[6];
                    let v008 = result_split[7] === "null" || result_split[7] === "" ? '' : result_split[7];
                    let v009 = result_split[8] === "null" || result_split[8] === "" ? '' : result_split[8];
                    let v010 = result_split[9] === "null" || result_split[9] === "" ? '' : result_split[9];

                    if (v004.length > 0) {
                        gu.getCmp('v004').setValue(v004);
                    }
                    if (v001.length > 0) {
                        gu.getCmp('v001').setValue(v001);
                    }
                    if (v002.length > 0) {
                        gu.getCmp('v002').setValue(v002);
                    }
                    if (v003.length > 0) {
                        gu.getCmp('v003').setValue(v003 === "null" || v003 === "" ? '' : new Date(v003));
                    }
                    if (v004.length > 0) {
                        gu.getCmp('v004').setValue(v004);
                    }
                    if (v005.length > 0) {
                        gu.getCmp('v005').setValue(v005);
                        gu.getCmp('v005').setValue(v005 === "null" || v005 === "" ? '' : new Date(v005));
                    }
                    if (v006.length > 0) {
                        gu.getCmp('v006').setValue(v006);
                    }
                    if (v007.length > 0) {
                        gu.getCmp('v007').setValue(v007);
                    }
                    if (v008.length > 0) {
                        gu.getCmp('v008').setValue(v008);
                    }
                    if (v009.length > 0) {
                        gu.getCmp('v009').setValue(v009);
                    }
                    if (v010.length > 0) {
                        gu.getCmp('v010').setValue(v010);
                    }

                    gu.getCmp('gr_qty').setValue(record.get('gr_qty'));


                } else {
                    console_logs('>>>>> check', '기본정보가 없으므로 마지막 정보를 출력하는 모드 변경');
                    Ext.Ajax.request({
                        url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionLastHeaderInfo',
                        params : {
                            srcahd_uid: record.get('srcahd_uid'),
                        },
                        success: function (result, request) {
                            var result = result.responseText;
                            console_logs('>>>>> result', result);
                            if (result != 'null') {
                                var result_split = result.split('|', 7);
                                let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                                let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                                let v006 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                                let v007 = vCUR_USER_NAME;
                                if (v004.length > 0) {
                                    gu.getCmp('v004').setValue(v004);
                                }
                                if (v001.length > 0) {
                                    gu.getCmp('v001').setValue(v001);
                                }
                                if (v006.length > 0) {
                                    gu.getCmp('v006').setValue(v006);
                                }
                                if (v007.length > 0) {
                                    gu.getCmp('v007').setValue(v007);
                                }
                                gu.getCmp('gr_qty').setValue(record.get('gr_qty'));
                            } else {
                                gu.getCmp('v007').setValue(vCUR_USER_NAME);
                                gu.getCmp('gr_qty').setValue(record.get('gr_qty'));
                            }
                        }, //endofsuccess
                        failure: function (result, request) {
                            var result = result.responseText;
                            Ext.MessageBox.alert('알림', result);
                        },
                    });
                }
            }, //endofsuccess
            failure: function (result, request) {
                var result = result.responseText;
                Ext.MessageBox.alert('알림', result);
            },
        });

        if (spec_need_flag === 'G') {
            var form = Ext.create('Ext.form.Panel', {
                id         : 'addTakeResult',
                store      : '',
                xtype      : 'form',
                frame      : false,
                border     : false,
                width      : '100%',
                layout     : 'column',
                bodyPadding: 10,
                items      : [
                    {
                        xtype      : 'fieldset',
                        collapsible: false,
                        title      : gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                        width      : '100%',
                        style      : 'padding:10px',
                        defaults   : {
                            labelStyle: 'padding:10px',
                            anchor    : '100%',
                            layout    : {
                                type: 'column'
                            }
                        },
                        items      : [
                            {
                                xtype         : 'container',
                                width         : '100%',
                                border        : true,
                                defaultMargins: {
                                    top   : 0,
                                    right : 0,
                                    bottom: 0,
                                    left  : 10
                                },
                                items         : [
                                    new Ext.form.Hidden({
                                        name: 'supast_uid',
                                        id  : gu.id('supast_uid'),
                                    }),
                                    {
                                        xtype     : 'fieldcontainer',
                                        fieldLabel: '공급사',
                                        anchor    : '99%',
                                        width     : '90%',
                                        padding   : '0 0 5px 30px',
                                        // height: '10%',
                                        layout  : 'hbox',
                                        defaults: {
                                            margin: '2 2 2 2'
                                        },
                                        items   : [
                                            // {
                                            //     xtype     : 'textfield',
                                            //     id        : 'v004',
                                            //     name      : 'v004',
                                            //     padding   : '0 0 5px 30px',
                                            //     width     : '45%',
                                            //     allowBlank: false,
                                            //     fieldLabel: '공급사',
                                            //     fieldStyle: 'background-color: #FFFCCC;',
                                            //     value : select.get('seller_name')
                                            // },
                                            {
                                                id  : gu.id('v004'),
                                                name: 'v004',
                                                // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                                allowBlank: true,
                                                xtype     : 'textfield',
                                                width     : 300,
                                                editable  : false,
                                                // padding: '0 0 5px 30px',
                                                fieldStyle: 'background-color: #FFFCCC;',
                                                // store: gm.me().combstStore,
                                                emptyText   : '우측버튼을 클릭하여 공급사를 선택 후 입력.',
                                                displayField: 'wa_name',
                                                valueField  : 'unique_id',
                                                sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                                typeAhead   : false,
                                                minChars    : 1,
                                                listConfig  : {
                                                    loadingText: 'Searching...',
                                                    emptyText  : 'No matching posts found.',
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                                    }
                                                },
                                                listeners   : {
                                                    change: function (combo, record) {

                                                    }// endofselect
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                text : '클릭하여 선택',
                                                width: 120,
                                                // margin: '0 10 10 380',
                                                scale  : 'small',
                                                handler: function () {
                                                    gm.me().selectCombst();
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id        : gu.id('v000'),
                                        name      : 'v000',
                                        allowBlank: true,
                                        fieldLabel: '종류 / 규격',
                                        xtype     : 'textfield',
                                        width     : '45%',
                                        padding   : '0 0 5px 30px',
                                        editable  : false,
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        value     : select.get('item_name') + (select.get('specification') !== '' ? ' / ' + select.get('specification') : '')
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v001'),
                                        name      : 'v001',
                                        width     : '45%',
                                        allowBlank: true,
                                        padding   : '0 0 5px 30px',
                                        fieldLabel: '채취장소'
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v002'),
                                        name      : 'v002',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        allowBlank: true,
                                        fieldLabel: 'LOT No'
                                    },

                                    {
                                        fieldLabel  : '채취일자',
                                        xtype       : 'datefield',
                                        padding     : '0 0 5px 30px',
                                        width       : '45%',
                                        name        : 'v003',
                                        format      : 'Y-m-d',
                                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                        dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                                        allowBlank  : false,
                                        id          : gu.id('v003'),
                                        listeners   : {
                                            change: function (sender, newValue, oldValue, opts) {
                                                var v003 = gu.getCmp('v003').getValue();
                                                v003 = Ext.Date.format(v003, 'Y-m-d');
                                                var vat = v003.replace(/-/gi, "");
                                                gu.getCmp('v002').setValue(vat);

                                            }
                                        }
                                    },

                                    {
                                        fieldLabel: '시험일자',
                                        xtype     : 'datefield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v005',
                                        format    : 'Y-m-d',
                                        allowBlank: false,
                                        id        : gu.id('v005')
                                    },
                                    {
                                        fieldLabel: '시험방법',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v006',
                                        format    : 'Y-m-d',
                                        allowBlank: false,
                                        id        : gu.id('v006')
                                    },
                                    {
                                        fieldLabel: '검사자',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v007',
                                        allowBlank: false,
                                        id        : gu.id('v007')
                                    },
                                    {
                                        fieldLabel: '검사로트',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v008',
                                        allowBlank: true,
                                        id        : gu.id('v008')
                                    },
                                    {
                                        fieldLabel: '특이사항',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v009',
                                        allowBlank: true,
                                        id        : gu.id('v009')
                                    },
                                    {
                                        fieldLabel: '입고수량',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'gr_qty',
                                        allowBlank: false,
                                        editable  : false,
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        id        : gu.id('gr_qty'),
                                        value     : record.get('gr_qty')
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        xtype      : 'fieldset',
                        frame      : true,
                        title      : '검사항목 입력',
                        width      : '100%',
                        height     : '100%',
                        layout     : 'fit',
                        bodyPadding: 10,
                        items      : [
                            productGrid
                        ]
                    },
                    {
                        xtype      : 'fieldset',
                        frame      : true,
                        title      : '체가름 밀도분포 데이터 입력',
                        width      : '100%',
                        height     : '100%',
                        layout     : 'fit',
                        bodyPadding: 10,
                        items      : [
                            granularityGrid
                        ]
                    },
                ]
            });
        } else {
            var form = Ext.create('Ext.form.Panel', {
                id         : 'addTakeResult',
                store      : '',
                xtype      : 'form',
                frame      : false,
                border     : false,
                width      : '100%',
                layout     : 'column',
                bodyPadding: 10,
                items      : [
                    {
                        xtype      : 'fieldset',
                        collapsible: false,
                        title      : gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                        width      : '100%',
                        style      : 'padding:10px',
                        defaults   : {
                            labelStyle: 'padding:10px',
                            anchor    : '100%',
                            layout    : {
                                type: 'column'
                            }
                        },
                        items      : [
                            {
                                xtype         : 'container',
                                width         : '100%',
                                border        : true,
                                defaultMargins: {
                                    top   : 0,
                                    right : 0,
                                    bottom: 0,
                                    left  : 10
                                },
                                items         : [
                                    new Ext.form.Hidden({
                                        name: 'supast_uid',
                                        id  : gu.id('supast_uid'),
                                    }),
                                    {
                                        xtype     : 'fieldcontainer',
                                        fieldLabel: '제조원',
                                        anchor    : '99%',
                                        width     : '90%',
                                        padding   : '0 0 5px 30px',
                                        // height: '10%',
                                        layout  : 'hbox',
                                        defaults: {
                                            margin: '2 2 2 2'
                                        },
                                        items   : [
                                            // {
                                            //     xtype     : 'textfield',
                                            //     id        : 'v004',
                                            //     name      : 'v004',
                                            //     padding   : '0 0 5px 30px',
                                            //     width     : '45%',
                                            //     allowBlank: false,
                                            //     fieldLabel: '공급사',
                                            //     fieldStyle: 'background-color: #FFFCCC;',
                                            //     value : select.get('seller_name')
                                            // },
                                            {
                                                id  : gu.id('v004'),
                                                name: 'v004',
                                                // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                                allowBlank: true,
                                                xtype     : 'textfield',
                                                width     : 300,
                                                editable  : false,
                                                // padding: '0 0 5px 30px',
                                                fieldStyle: 'background-color: #FFFCCC;',
                                                // store: gm.me().combstStore,
                                                emptyText   : '우측버튼을 클릭하여 공급사를 선택 후 입력.',
                                                displayField: 'wa_name',
                                                valueField  : 'unique_id',
                                                sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                                typeAhead   : false,
                                                minChars    : 1,
                                                listConfig  : {
                                                    loadingText: 'Searching...',
                                                    emptyText  : 'No matching posts found.',
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                                    }
                                                },
                                                listeners   : {
                                                    change: function (combo, record) {
                                                        // var buyer = gu.getCmp('order_com_unique').getValue();
                                                        // console_logs('>>> buyer', buyer);
                                                        // gu.getCmp('customer_name').setValue(buyer);
                                                    }// endofselect
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                text : '클릭하여 선택',
                                                width: 120,
                                                // margin: '0 10 10 380',
                                                scale  : 'small',
                                                handler: function () {
                                                    gm.me().selectCombst();
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id        : gu.id('v000'),
                                        name      : 'v000',
                                        allowBlank: true,
                                        fieldLabel: '종류 / 규격',
                                        xtype     : 'textfield',
                                        width     : '45%',
                                        padding   : '0 0 5px 30px',
                                        editable  : false,
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        value     : select.get('item_name') + (select.get('specification') !== '' ? ' / ' + select.get('specification') : '')
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v001'),
                                        name      : 'v001',
                                        width     : '45%',
                                        allowBlank: true,
                                        padding   : '0 0 5px 30px',
                                        fieldLabel: '제조원'
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v010'),
                                        name      : 'v010',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        allowBlank: true,
                                        fieldLabel: '로트크기'
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v002'),
                                        name      : 'v002',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        allowBlank: true,
                                        fieldLabel: 'LOT No'
                                    },

                                    {
                                        fieldLabel  : '입고일자',
                                        xtype       : 'datefield',
                                        padding     : '0 0 5px 30px',
                                        width       : '45%',
                                        name        : 'v003',
                                        format      : 'Y-m-d',
                                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                        dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                                        allowBlank  : false,
                                        id          : gu.id('v003'),
                                        listeners   : {
                                            change: function (sender, newValue, oldValue, opts) {
                                                var v003 = gu.getCmp('v003').getValue();
                                                v003 = Ext.Date.format(v003, 'Y-m-d');
                                                var vat = v003.replace(/-/gi, "");
                                                gu.getCmp('v002').setValue(vat);

                                            }
                                        }
                                    },

                                    // {
                                    //     fieldLabel: '시험일자',
                                    //     xtype: 'datefield',
                                    //     padding: '0 0 5px 30px',
                                    //     width: '45%',
                                    //     name: 'v005',
                                    //     format: 'Y-m-d',
                                    //     allowBlank: false,
                                    //     id: gu.id('v005')
                                    // },
                                    // {
                                    //     fieldLabel: '시험방법',
                                    //     xtype: 'textfield',
                                    //     padding: '0 0 5px 30px',
                                    //     width: '45%',
                                    //     name: 'v006',
                                    //     format: 'Y-m-d',
                                    //     allowBlank: false,
                                    //     id: gu.id('v006')
                                    // },
                                    {
                                        fieldLabel: '검사원',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v007',
                                        allowBlank: false,
                                        id        : gu.id('v007')
                                    },
                                    {
                                        fieldLabel: '검사로트',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v008',
                                        allowBlank: true,
                                        id        : gu.id('v008')
                                    },
                                    {
                                        fieldLabel: '특이사항',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v009',
                                        allowBlank: true,
                                        id        : gu.id('v009')
                                    },
                                    {
                                        fieldLabel: '입고수량',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'gr_qty',
                                        allowBlank: false,
                                        editable  : false,
                                        fieldStyle: 'background-color: #FFFCCC; text-align: right',
                                        id        : gu.id('gr_qty'),
                                        value     : record.get('gr_qty')
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        xtype      : 'fieldset',
                        frame      : true,
                        title      : '검사항목 입력',
                        width      : '100%',
                        height     : '100%',
                        layout     : 'fit',
                        bodyPadding: 10,
                        items      : [
                            productGrid
                        ]
                    },
                ]
            });
        }


        var win = Ext.create('Ext.Window', {
            modal    : true,
            title    : '성적서 검사입력',
            width    : 1100,
            height   : 680,
            plain    : true,
            items    : form,
            overflowY: 'scroll',
            buttons  : [{
                text   : CMD_OK,
                handler: function (btn) {
                    if (btn == "no") {
                        win.close();
                    } else {
                        var form = Ext.getCmp('addTakeResult').getForm();
                        if (form.isValid()) {
                            win.setLoading(true);
                            var val = form.getValues(false);
                            var storeData = gu.getCmp('inspectGrid').getStore();
                            var granularityStoreData = gu.getCmp('granularityGrid').getStore();
                            const spccolumn_uids = [];
                            const passcolumn_uids = [];
                            const inspetion_values = [];
                            const unit_names = [];
                            const baselines = [];
                            const measure_values = [];
                            const decisions = [];
                            const comments = [];
                            const passrates = [];
                            const specification = [];
                            const sieve_size = [];
                            var isEmptyMeasure = false;
                            var isEmptyDecision = false;
                            for (var j = 0; j < storeData.data.items.length; j++) {
                                var item = storeData.data.items[j];
                                spccolumn_uids.push(item.get('unique_id_long'));
                                const legend_code_kr = item.get('legend_code_kr');
                                if (legend_code_kr == undefined || legend_code_kr == null || (legend_code_kr.replace(/(\s*)/g, "")).length === 0) {
                                    // isEmptyMeasure = true;
                                    inspetion_values.push('-');
                                } else {
                                    inspetion_values.push(item.get('legend_code_kr'));
                                }
                                const unit_name = item.get('unit_name');
                                if (unit_name == undefined || unit_name == null || (unit_name.replace(/(\s*)/g, "")).length === 0) {
                                    // isEmptyMeasure = true;
                                    unit_names.push('-');
                                } else {
                                    unit_names.push(item.get('unit_name'));
                                }
                                const baseline = item.get('baseline');
                                if (baseline == undefined || baseline == null || (baseline.replace(/(\s*)/g, "")).length === 0) {
                                    // isEmptyMeasure = true;
                                    baselines.push('-');
                                } else {
                                    baselines.push(item.get('baseline'));
                                }
                                const measure = item.get('measure');
                                if (measure == undefined || measure == null || (measure.replace(/(\s*)/g, "")).length === 0) {
                                    isEmptyMeasure = true;
                                } else {
                                    measure_values.push(item.get('measure'));
                                }
                                const decision = item.get('decision');
                                if (decision == undefined || decision == null || (decision.replace(/(\s*)/g, "")).length === 0) {
                                    isEmptyDecision = true;
                                } else {
                                    decisions.push(item.get('decision'));
                                }
                                const comment = item.get('comment');
                                if (comment == undefined || comment == null || (comment.replace(/(\s*)/g, "")).length === 0) {
                                    comments.push('');
                                } else {
                                    comments.push(item.get('comment'));
                                }
                            }

                            for (var j = 0; j < granularityStoreData.data.items.length; j++) {
                                var item = granularityStoreData.data.items[j];
                                passcolumn_uids.push(item.get('unique_id_long'));

                                const passrate = item.get('measure');
                                if (passrate == undefined || passrate == null || (passrate.replace(/(\s*)/g, "")).length === 0) {
                                    isEmptyDecision = true;
                                } else {
                                    passrates.push(item.get('measure'));
                                }
                                const unit_name = item.get('unit_name');
                                if (unit_name == undefined || unit_name == null || (unit_name.replace(/(\s*)/g, "")).length === 0) {
                                    isEmptyDecision = true;
                                } else {
                                    specification.push(item.get('unit_name'));
                                }
                                const baseline = item.get('baseline');
                                if (baseline == undefined || baseline == null || (baseline.replace(/(\s*)/g, "")).length === 0) {
                                    isEmptyDecision = true;
                                } else {
                                    sieve_size.push(item.get('baseline'));
                                }

                            }
                            if (isEmptyMeasure === true) {
                                Ext.MessageBox.alert('알림', '측정값이 공란인 곳이 있습니다.');
                                win.setLoading(false);
                                return;
                            } else if (isEmptyDecision === true) {
                                Ext.MessageBox.alert('알림', '판정값이 공란인 곳이 있습니다.');
                                win.setLoading(false);
                                return;
                            } else {
                                form.submit({
                                    submitEmptyText: false,
                                    url            : CONTEXT_PATH + '/quality/cementInspect.do?method=insertIncomeResultValue',
                                    waitMsg        : '데이터를 저장중입니다.',
                                    params         : {
                                        spccolumn_uids  : spccolumn_uids,
                                        passcolumn_uids : passcolumn_uids,
                                        inspetion_values: inspetion_values,
                                        unit_names      : unit_names,
                                        baselines       : baselines,
                                        measure_values  : measure_values,
                                        comments        : comments,
                                        decisions       : decisions,
                                        passrates       : passrates,
                                        sieve_size      : sieve_size,
                                        specification   : specification,

                                        wgrast_uid: select.get('unique_id_long')
                                    },
                                    success        : function (val, action) {
                                        if (win) {
                                            win.close();
                                        }
                                        Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure        : function (val, action) {
                                        if (win) {
                                            console_log('failure');
                                            win.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }, {
                text   : CMD_CANCEL,
                handler: function (btn) {
                    win.close();
                }
            }]
        });
        win.show();
    },

    doOpenTestData: function () {
        let select = gm.me().grid.getSelectionModel().getSelection()[0];

        gm.me().granularityList.getProxy().setExtraParam('srcahd_uid', select.get('srcahd_uid'));
        gm.me().granularityList.getProxy().setExtraParam('wgrast_uid', select.get('unique_id_long'))
        gm.me().granularityList.getProxy().setExtraParam('supast_uid', select.get('manufacturer'))
        gm.me().granularityList.getProxy().setExtraParam('inspection_standard', 'T');
        gm.me().granularityList.getProxy().setExtraParam('type', 'T');

        gm.me().granularityList.load();
        let storelist = gm.me().granularityList;
        console_logs('>>>> storelist', storelist);

        let columnsData = storelist.data.items;
        console_logs('>>>>>> columnData ㅋㅋㅋㅋㅋㅋㅋㅋㅋ', columnsData);
        
// //granularityList 스토어 조회 후 시험데이터가 있을 경우 id값을 찾아 값을 넣어준다.
// for(let i = 0; i<columnsData.length; i++){
//     let dataType = columnsData[i].get('unit_name');
//     switch (dataType) {
//         case "TB": 
//         var tb_num1 = columnsData[0].get('v025')==="null" || columnsData[0].get('v025')===""? '' : columnsData[0].get('v025');
//         gu.getCmp('TB_NUM1').setValue(tb_num1);
//         break;
//     }
// }
        // 잔골재 시험데이터 입력 
        if (select.get('spec_need_flag') === 'G') {

            var record = gm.me().grid.getSelectionModel().getSelection()[0];
            Ext.Ajax.request({
                url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionTestBaseInfo',
                params : {
                    target_uid: record.get('unique_id_long'),
                },
                success: function (result, request) {
                    var result = result.responseText;

                    if (result != 'null') {
                        var result_split = result.split('|', 10);
                        let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                        let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                        let v002 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                        let v003 = result_split[3];
                        let v005 = result_split[4];
                        let v006 = result_split[5] === "null" || result_split[5] === "" ? '' : result_split[5];
                        let v007 = result_split[6] === "null" || result_split[6] === "" ? vCUR_USER_NAME : result_split[6];
                        let v008 = result_split[7] === "null" || result_split[7] === "" ? '' : result_split[7];
                        let v009 = result_split[8] === "null" || result_split[8] === "" ? '' : result_split[8];
                        let v010 = result_split[9] === "null" || result_split[9] === "" ? '' : result_split[9];

                        // if (v001.length > 0) {
                        //     gu.getCmp('v001').setValue(v001);
                        // }
                        // if (v002.length > 0) {
                        //     gu.getCmp('v002').setValue(v002);
                        // }
                        // if (v003.length > 0) {
                        //     gu.getCmp('v003').setValue(v003 === "null" || v003 === "" ? '' : new Date(v003));
                        // }
                        // if (v004.length > 0) {
                        //     gu.getCmp('v004').setValue(v004);
                        // }
                        // if (v005.length > 0) {
                        //     gu.getCmp('v005').setValue(v005 === "null" || v005 === "" ? '' : new Date(v005));
                        // }
                        // if (v006.length > 0) {
                        //     gu.getCmp('v006').setValue(v006);
                        // }
                        // if (v007.length > 0) {
                        //     gu.getCmp('v007').setValue(v007);
                        // }
                        // if (v008.length > 0) {
                        //     gu.getCmp('v008').setValue(v008);
                        // }
                        // if (v009.length > 0) {
                        //     gu.getCmp('v009').setValue(v009);
                        // }
                        // if (v010.length > 0) {
                        //     gu.getCmp('v010').setValue(v010);
                        // }
                        //
                        // gu.getCmp('gr_qty').setValue(record.get('gr_qty'));


                    } else {
                        console_logs('>>>>> check', '기본정보가 없으므로 마지막 정보를 출력하는 모드 변경');
                        Ext.Ajax.request({
                            url    : CONTEXT_PATH + '/quality/cementInspect.do?method=getInspectionLastHeaderInfo',
                            params : {
                                srcahd_uid: record.get('srcahd_uid'),
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                console_logs('>>>>> result', result);
                                if (result != 'null') {
                                    var result_split = result.split('|', 7);
                                    let v004 = result_split[0] === "null" || result_split[0] === "" ? '' : result_split[0];
                                    let v001 = result_split[1] === "null" || result_split[1] === "" ? '' : result_split[1];
                                    let v006 = result_split[2] === "null" || result_split[2] === "" ? '' : result_split[2];
                                    let v007 = vCUR_USER_NAME;
                                    if (v004.length > 0) {
                                        gu.getCmp('v004').setValue(v004);
                                    }
                                    if (v001.length > 0) {
                                        gu.getCmp('v001').setValue(v001);
                                    }
                                    if (v006.length > 0) {
                                        gu.getCmp('v006').setValue(v006);
                                    }
                                    if (v007.length > 0) {
                                        gu.getCmp('v007').setValue(v007);
                                    }
                                    gu.getCmp('gr_qty').setValue(record.get('gr_qty'));
                                } else {
                                    gu.getCmp('v007').setValue(vCUR_USER_NAME);
                                    gu.getCmp('gr_qty').setValue(record.get('gr_qty'));
                                }
                            }, //endofsuccess
                            failure: function (result, request) {
                                var result = result.responseText;
                                Ext.MessageBox.alert('알림', result);
                            },
                        });
                    }

                    


                }, //endofsuccess
                failure: function (result, request) {
                    var result = result.responseText;
                    Ext.MessageBox.alert('알림', result);
                },
            });

            var form = Ext.create('Ext.form.Panel', {
                id         : 'addTakeResult',
                store      : '',
                xtype      : 'form',
                frame      : false,
                border     : false,
                width      : '100%',
                layout     : 'column',
                bodyPadding: 10,
                items      : [
                    {
                        xtype      : 'fieldset',
                        collapsible: false,
                        title      : gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                        width      : '100%',
                        style      : 'padding:10px',
                        defaults   : {
                            labelStyle: 'padding:10px',
                            anchor    : '100%',
                            layout    : {
                                type: 'column'
                            }
                        },
                        items      : [
                            {
                                xtype         : 'container',
                                width         : '100%',
                                border        : true,
                                defaultMargins: {
                                    top   : 0,
                                    right : 0,
                                    bottom: 0,
                                    left  : 10
                                },
                                items         : [
                                    {
                                        xtype     : 'fieldcontainer',
                                        fieldLabel: '공급사',
                                        anchor    : '99%',
                                        width     : '90%',
                                        padding   : '0 0 5px 30px',
                                        // height: '10%',
                                        layout  : 'hbox',
                                        defaults: {
                                            margin: '2 2 2 2'
                                        },
                                        items   : [
                                            {
                                                id  : gu.id('v004'),
                                                name: 'v004',
                                                // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                                allowBlank: true,
                                                xtype     : 'textfield',
                                                width     : 300,
                                                editable  : false,
                                                // padding: '0 0 5px 30px',
                                                fieldStyle: 'background-color: #FFFCCC;',
                                                // store: gm.me().combstStore,
                                                emptyText   : '우측버튼을 클릭하여 공급사를 선택 후 입력.',
                                                displayField: 'wa_name',
                                                valueField  : 'unique_id',
                                                sortInfo    : {field: 'wa_name', direction: 'ASC'},
                                                typeAhead   : false,
                                                minChars    : 1,
                                                listConfig  : {
                                                    loadingText: 'Searching...',
                                                    emptyText  : 'No matching posts found.',
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                                    }
                                                },
                                                listeners   : {
                                                    change: function (combo, record) {

                                                    }// endofselect
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                text : '클릭하여 선택',
                                                width: 120,
                                                // margin: '0 10 10 380',
                                                scale  : 'small',
                                                handler: function () {
                                                    gm.me().selectCombst();
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id        : gu.id('v000'),
                                        name      : 'v000',
                                        allowBlank: true,
                                        fieldLabel: '종류 / 규격',
                                        xtype     : 'textfield',
                                        width     : '45%',
                                        padding   : '0 0 5px 30px',
                                        editable  : false,
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        value     : select.get('item_name') + (select.get('specification') !== '' ? ' / ' + select.get('specification') : '')
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v001'),
                                        name      : 'v001',
                                        width     : '45%',
                                        allowBlank: true,
                                        padding   : '0 0 5px 30px',
                                        fieldLabel: '채취장소'
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('v002'),
                                        name      : 'v002',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        allowBlank: true,
                                        fieldLabel: 'LOT No'
                                    },

                                    {
                                        fieldLabel  : '채취일자',
                                        xtype       : 'datefield',
                                        padding     : '0 0 5px 30px',
                                        width       : '45%',
                                        name        : 'v003',
                                        format      : 'Y-m-d',
                                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                        dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                                        allowBlank  : false,
                                        id          : gu.id('v003'),
                                        listeners   : {
                                            change: function (sender, newValue, oldValue, opts) {
                                                var v003 = gu.getCmp('v003').getValue();
                                                v003 = Ext.Date.format(v003, 'Y-m-d');
                                                var vat = v003.replace(/-/gi, "");
                                                gu.getCmp('v002').setValue(vat);

                                            }
                                        }
                                    },

                                    {
                                        fieldLabel: '시험일자',
                                        xtype     : 'datefield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v005',
                                        format    : 'Y-m-d',
                                        allowBlank: false,
                                        id        : gu.id('v005')
                                    },
                                    {
                                        fieldLabel: '시험방법',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v006',
                                        format    : 'Y-m-d',
                                        allowBlank: false,
                                        id        : gu.id('v006')
                                    },
                                    {
                                        fieldLabel: '검사자',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v007',
                                        allowBlank: false,
                                        id        : gu.id('v007')
                                    },
                                    {
                                        fieldLabel: '검사로트',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v008',
                                        allowBlank: false,
                                        id        : gu.id('v008')
                                    },
                                    {
                                        fieldLabel: '특이사항',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'v009',
                                        allowBlank: false,
                                        id        : gu.id('v009')
                                    },
                                    {
                                        fieldLabel: '입고수량',
                                        xtype     : 'textfield',
                                        padding   : '0 0 5px 30px',
                                        width     : '45%',
                                        name      : 'gr_qty',
                                        allowBlank: false,
                                        editable  : false,
                                        fieldStyle: 'background-color: #FFFCCC;',
                                        id        : gu.id('gr_qty')
                                    },
                                ]
                            },
                        ]
                    },
                    // 시험데이터 입력
                    {
                        xtype      : 'fieldset',
                        frame      : true,
                        title      : '잔입자(0.08mm체 통과)',
                        width      : '100%',
                        height     : '100%',
                        layout     : 'fit',
                        bodyPadding: 10,
                        defaults   : {
                            margin: '2 0 0 0'
                        },
                        items      : [
                            {
                                fieldLabel: columnsData[0].get('unit_name')+' : '+columnsData[0].get('baseline'),
                                xtype     : 'textfield',
                                id        : gu.id('TB_NUM1'),
                                name      : 'tb_num1',
                                labelWidth: 250,
                                width     : '30%',
                            },
                            {
                                fieldLabel: columnsData[1].get('unit_name')+' : '+columnsData[1].get('baseline'),
                                xtype     : 'textfield',
                                id        : gu.id('TC_NUM1'),
                                name      : 'tc_num1',
                                labelWidth: 250,
                                width     : '30%',

                                listeners: {
                                    change: function () {
                                        var B = gu.getCmp('TB_NUM1').getValue();
                                        var C = gu.getCmp('TC_NUM1').getValue();
                                        var TA_NUM1 = (B - C) / B * 100;

                                        gu.getCmp('TA_NUM1').setValue(TA_NUM1.toFixed(1));
                                        gu.getCmp('BB_NUM1').setValue(C);
                                        gu.getCmp('BB_NUM2').setValue(C);
                                    }
                                }
                            },
                            {
                                fieldLabel: columnsData[2].get('unit_name')+' : '+columnsData[2].get('baseline'),
                                xtype     : 'textfield',
                                id        : gu.id('TA_NUM1'),
                                name      : 'ta_num1',
                                labelWidth: 250,
                                width     : '30%',
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                readOnly  : true
                            }
                        ]
                    },
                    {
                        xtype      : 'fieldset',
                        frame      : true,
                        title      : '단위용적질량',
                        width      : '100%',
                        height     : '100%',
                        layout     : 'fit',
                        bodyPadding: 10,
                        defaults   : {
                            margin: '2 0 0 0'
                        },
                        items      : [
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[3].get('unit_name')+' : '+columnsData[3].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('MT_NUM1'),
                                        name      : 'mt_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('MT_NUM2'),
                                        name      : 'mt_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[4].get('unit_name')+' : '+columnsData[4].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('MV_NUM1'),
                                        name      : 'mv_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('MV_NUM2'),
                                        name      : 'mv_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[5].get('unit_name')+' : '+columnsData[5].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('MG_NUM1'),
                                        name      : 'mg_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        listeners : {
                                            change: function () {
                                                var G = gu.getCmp('MG_NUM1').getValue();
                                                var T = gu.getCmp('MT_NUM1').getValue();
                                                var V = gu.getCmp('MV_NUM1').getValue();
                                                var MM_NUM1 = (G - T) / V;

                                                gu.getCmp('MM_NUM1').setValue(MM_NUM1.toFixed(0));
                                            }
                                        }
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('MG_NUM2'),
                                        name      : 'mg_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        listeners : {
                                            change: function () {
                                                var G = gu.getCmp('MG_NUM2').getValue();
                                                var T = gu.getCmp('MT_NUM2').getValue();
                                                var V = gu.getCmp('MV_NUM2').getValue();

                                                var MM_NUM1 = gu.getCmp('MM_NUM1').getValue();

                                                var MM_NUM2 = (G - T) / V;
                                                var MM_NUM3 = (Number(MM_NUM1) + Number(MM_NUM2.toFixed(0))) / 2

                                                gu.getCmp('MM_NUM2').setValue(MM_NUM2.toFixed(0));
                                                gu.getCmp('MM_NUM3').setValue(MM_NUM3.toFixed(0));
                                            }
                                        }
                                    },

                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[6].get('unit_name')+' : '+columnsData[6].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('MM_NUM1'),
                                        name      : 'mm_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('MM_NUM2'),
                                        name      : 'mm_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('MM_NUM3'),
                                        name      : 'mm_num3',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        xtype      : 'fieldset',
                        frame      : true,
                        title      : '밀도 및 흡수율',
                        width      : '100%',
                        height     : '100%',
                        layout     : 'fit',
                        bodyPadding: 10,
                        defaults   : {
                            margin: '2 0 0 0'
                        },
                        items      : [
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[7].get('unit_name')+' : '+columnsData[7].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BA_NUM1'),
                                        name      : 'ba_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BA_NUM2'),
                                        name      : 'ba_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[8].get('unit_name')+' : '+columnsData[8].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BB_NUM1'),
                                        name      : 'bb_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true

                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BB_NUM2'),
                                        name      : 'bb_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[9].get('unit_name')+' : '+columnsData[9].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BC_NUM1'),
                                        name      : 'bc_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BC_NUM2'),
                                        name      : 'bc_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[10].get('unit_name')+' : '+columnsData[10].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BD_NUM1'),
                                        name      : 'bd_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        listeners : {
                                            change: function () {

                                                var B = Number(gu.getCmp('BB_NUM1').getValue());
                                                var C = Number(gu.getCmp('BC_NUM1').getValue());
                                                var A = Number(gu.getCmp('BA_NUM1').getValue());
                                                var D = Number(gu.getCmp('BD_NUM1').getValue());

                                                var BJ_NUM1 = B / (C + A - D);
                                                var BP_NUM1 = A / (C + A - D);
                                                var BH_NUM1 = (A - B) / B * 100;

                                                gu.getCmp('BJ_NUM1').setValue(BJ_NUM1.toFixed(2));
                                                gu.getCmp('BP_NUM1').setValue(BP_NUM1.toFixed(2));
                                                gu.getCmp('BH_NUM1').setValue(BH_NUM1.toFixed(2));
                                            }
                                        }
                                    },

                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BD_NUM2'),
                                        name      : 'bd_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        listeners : {
                                            change: function () {

                                                var B = Number(gu.getCmp('BB_NUM2').getValue());
                                                var C = Number(gu.getCmp('BC_NUM2').getValue());
                                                var A = Number(gu.getCmp('BA_NUM2').getValue());
                                                var D = Number(gu.getCmp('BD_NUM2').getValue());

                                                var BJ_NUM1 = Number(gu.getCmp('BJ_NUM1').getValue());
                                                var BP_NUM1 = Number(gu.getCmp('BP_NUM1').getValue());
                                                var BH_NUM1 = Number(gu.getCmp('BH_NUM1').getValue());

                                                var BJ_NUM2 = B / (C + A - D);
                                                var BP_NUM2 = A / (C + A - D);
                                                var BH_NUM2 = (A - B) / B * 100;

                                                var BJ_NUM3 = (BJ_NUM1 + Number(BJ_NUM2)) / 2;
                                                var BP_NUM3 = (BP_NUM1 + Number(BP_NUM2)) / 2;
                                                var BH_NUM3 = (BH_NUM1 + Number(BH_NUM2)) / 2;

                                                gu.getCmp('BJ_NUM2').setValue(BJ_NUM2.toFixed(2));
                                                gu.getCmp('BP_NUM2').setValue(BP_NUM2.toFixed(2));
                                                gu.getCmp('BH_NUM2').setValue(BH_NUM2.toFixed(2));

                                                gu.getCmp('BJ_NUM3').setValue(BJ_NUM3.toFixed(2));
                                                gu.getCmp('BP_NUM3').setValue(BP_NUM3.toFixed(2));
                                                gu.getCmp('BH_NUM3').setValue(BH_NUM3.toFixed(2));
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[11].get('unit_name')+' : '+columnsData[11].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BJ_NUM1'),
                                        name      : 'bj_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BJ_NUM2'),
                                        name      : 'bj_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BJ_NUM3'),
                                        name      : 'bj_num3',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[12].get('unit_name')+' : '+columnsData[12].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BP_NUM1'),
                                        name      : 'bp_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BP_NUM2'),
                                        name      : 'bp_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BP_NUM3'),
                                        name      : 'bp_num3',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                ]
                            },
                            {
                                xtype     : 'fieldcontainer',
                                fieldLabel: columnsData[13].get('unit_name')+' : '+columnsData[13].get('baseline'),
                                anchor    : '99%',
                                width     : '50%',
                                labelWidth: 250,
                                layout    : 'hbox',
                                defaults  : {},
                                items     : [
                                    {
                                        id        : gu.id('BH_NUM1'),
                                        name      : 'bh_num1',
                                        allowBlank: true,
                                        xtype     : 'textfield',
                                        width     : 58,
                                        typeAhead : false,
                                        minChars  : 1,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BH_NUM2'),
                                        name      : 'bh_num2',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                    {
                                        xtype     : 'textfield',
                                        id        : gu.id('BH_NUM3'),
                                        name      : 'bh_num3',
                                        labelWidth: 250,
                                        width     : 58,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        readOnly  : true
                                    },
                                ]
                            },

                        ]
                    },
                ]
            });

            var win = Ext.create('Ext.Window', {
                modal    : true,
                title    : '성적서 검사입력',
                width    : 1100,
                height   : 680,
                plain    : true,
                items    : form,
                overflowY: 'scroll',
                buttons  : [{
                    text   : CMD_OK,
                    handler: function (btn) {
                        if (btn == "no") {
                            win.close();
                        } else {
                            var form = Ext.getCmp('addTakeResult').getForm();
                            var select = gm.me().grid.getSelectionModel().getSelection()[0];
                            if (form.isValid()) {
                                win.setLoading(true);
                                var val = form.getValues(false);
                                var spccolumn_uid = [];
                                var unit_name = [];
                                for(let i = 0; i< columnsData.length; i++) {
                                    console_logs('rwqrwqr>>>>>',i); 
                                    let rec = columnsData[i];
                                    spccolumn_uid.push(rec.get('unique_id'));
                                    unit_name.push(rec.get('unit_name'));
                                }
                                form.submit({
                                    submitEmptyText: false,
                                    url            : CONTEXT_PATH + '/quality/cementInspect.do?method=insertAggregateValue',
                                    waitMsg        : '데이터를 저장중입니다.',
                                    params         : {
                                        val,
                                        spccolumn_uid : spccolumn_uid,
                                        unit_name : unit_name,
                                        wgrastUid: select.get('unique_id_long')
                                    },

                                    success        : function (val, action) {
                                        if (win) {
                                            win.close();
                                        }
                                        Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure        : function (val, action) {
                                        if (win) {
                                            console_log('failure');
                                            win.close();
                                        }
                                    }
                                });

                            }
                        }
                    }
                }, {
                    text   : CMD_CANCEL,
                    handler: function (btn) {
                        win.close();
                    }
                }]
            });
            win.show();
        } else {
            Ext.MessageBox.alert('확인', '잔골재에 해당하지 않습니다.');
        }
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        gm.me().doOpenInspectReport();
    },

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
            title      : '첨부된 파일 리스트',
            store      : this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId    : 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                cls  : 'my-x-toolbar-default2',
                items: [
                    {
                        xtype  : 'button',
                        text   : '파일업로드',
                        scale  : 'small',
                        iconCls: 'af-upload-white',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader       : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous    : true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel      : uploadPanel
                            });
                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                            }, this);
                            uploadDialog.show();
                        }
                    },
                    {
                        xtype  : 'button',
                        text   : '파일삭제',
                        scale  : 'small',
                        iconCls: 'af-remove',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params : {
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
                        id   : gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html : '파일 수 : 0'
                    },
                ]
            }

            ],
            columns    : [
                {
                    text     : '파일 일련번호',
                    width    : 100,
                    style    : 'text-align:center',
                    sortable : true,
                    dataIndex: 'id'
                },
                {
                    text     : '파일명',
                    style    : 'text-align:center',
                    flex     : 0.7,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '업로드 날짜',
                    style    : 'text-align:center',
                    width    : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width    : 100,
                    sortable : true,
                    xtype    : 'numbercolumn',
                    format   : '0,000',
                    style    : 'text-align:center',
                    align    : 'right',
                    dataIndex: 'file_size'
                },
                {
                    text     : '등록자',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title     : '첨부파일',
            width     : 1300,
            height    : 600,
            minWidth  : 250,
            minHeight : 180,
            autoScroll: true,
            layout    : {
                type : 'vbox',
                align: 'stretch'
            },
            xtype     : 'container',
            plain     : true,
            items     : [
                this.fileGrid
            ],
            buttons   : [{
                text   : CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text   : CMD_CANCEL,
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

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
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

    uploadComplete: function (items) {
        console_logs('uploadComplete items', items);
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title  : '파일업로드 완료',
            icon   : Ext.MessageBox['INFO'],
            msg    : '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width  : 450
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
});
