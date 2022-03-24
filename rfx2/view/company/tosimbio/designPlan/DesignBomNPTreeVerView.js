Ext.define('Rfx2.view.company.bioprotech.designPlan.DesignBomNPTreeVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'design-bom-np-tree-ver-view',
    initComponent: function () {

        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('pj_name');

        this.multiGrid = true;

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];

            switch (dataIndex) {
                case 'req_info':
                case 'reserved_varchar1':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }

        });

        this.createStore('Rfx2.model.company.bioprotech.PartLineNP', [{
                property: 'reserved_integer3',
                direction: 'ASC'
            }],
            gm.unlimitedPageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_uid'
            }
            , ['assymap']
        );

        var buttonToolbar1 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.syncMbomAction,
                '-',
                this.addPartAction,
                this.editPartAction,
                this.removePartAction,
                '-',
                // this.copyPartAction,
                // this.pastePartAction,
                '->',
                {
                    xtype: 'component',
                    style: 'margin-right:5px;width:18px;text-align:right',
                    id: gu.id('childCount'),
                    style: 'color:#094C80;align:right;',
                    html: ''
                }

            ]
        });
        this.createGrid([buttonToolbar1/*, this.buttonToolbar2 */], {
            width: '65%'
        });

        this.setGridOnCallback(function (selections) {
            if (selections.length /*&& gm.me().depth == 1*/) {
                rec = selections[0];

                gm.me().assymapUidbom = rec.get('unique_uid');
                gm.me().assymapPcr_div = rec.get('request_comment');
                gm.me().assymapBmQuan = rec.get('bm_quan');
                gm.me().assyId = rec.get('hier_pos');
                gm.me().assylevel = rec.get('reserved_integer1');
                gm.me().pl_no = rec.get('pl_no');
                gu.enable(gm.me().addPcsPlanAction);
                gu.enable(gm.me().editPartAction);
                gu.enable(gm.me().copyPartAction);
                gu.enable(gm.me().removePartAction);
                gu.enable(gm.me().usingProductAction);
            } else if (selections.length == 1) {
                gu.enable(gm.me().usingProductAction);
            } else {
                gu.disable(gm.me().addPcsPlanAction);
                gu.disable(gm.me().editPartAction);
                gu.disable(gm.me().copyPartAction);
                gu.disable(gm.me().removePartAction);
                gu.disable(gm.me().usingProductAction);
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });


        this.commonStandardStore.load(function (records) {
            for (var i = 0; i < records.length; i++) {
                var obj = records[i];

                gm.me().standard_flag_datas.push(obj);
            }
        });

        //Default Value 가져오기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',
            params: {
                paramName: 'CommonProjectAssy'
            },
            success: function (result, request) {
                console_log('success defaultGet');
                var id = result.responseText;
                var arr = id.split(';');
                var ac_uid = arr[0];

                gm.me().cloudprojectStore.load(function (records) {
                    if (records != null && records.length > 0) {

                        for (var i = 0; i < records.length; i++) {
                            var rec = records[i];

                            if (rec.get('unique_id') == ac_uid) {
                                var combo = gu.getCmp('projectcombo');

                                if (combo != undefined) {
                                    combo.select(rec);
                                    gm.me().selectProjectCombo(rec);
                                }

                            }
                        }

                    }//

                });
            },
            failure: function (result, request) {
                console_log('fail defaultGet');
            } /*extjsUtil.failureMessage*/
        });

        this.refreshAssyCopy();
        this.refreshPartCopy();

        this.callParent(arguments);
    },

    refreshAssyCopy: function () {

        //복사한 Assembly 정보읽기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=readCopyBomAssembly',
            params: {},
            success: function (response, request) {

                var o = Ext.JSON.decode(response.responseText);

                var count = o['count'];
                var assyline = o['datas'];
                if (count > 0) {

                    var o = Ext.create('Mplm.model.TreeModel', assyline);

                    gm.me().selected_tree_record = o;
                } else {
                    gm.me().selected_tree_record = null;
                }
                gm.me().setCopiedAssyQuan(/*assyline['part_path']*/);
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax
    },

    refreshPartCopy: function () {
        //복사한 파트정보 읽기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=readCopyBomPart',
            params: {},
            success: function (response, request) {

                var o = Ext.JSON.decode(response.responseText);

                var count = o['count'];
                var uids = o['datas'];
                if (count > 0) {

                    gm.me().setCopiedPartQuan(uids.length);
                }
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax

    },

    setRelationship: function (relationship) {

    },
    bomListStore: Ext.create('Mplm.store.BomListStore', {not_pl_no: '---'}),
    usingProductStore: Ext.create('Rfx2.store.company.kbtech.UsingProductStore'),
    createCenter: function () {

        this.bomListStore.on('beforeload', function (store) {
            store.getProxy().setExtraParam('not_pl_no', '---');
        });

        var printExcelAction = Ext.create('Ext.Action', {
            iconCls: null,
            glyph: 'f1c3@FontAwesome',
            html: 'Excel',
            handler: function () {

                var store = gu.getCmp('DBM7TREE-Assembly').store;

                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", gm.me().link);

                var arrField = gm.me().gSearchField;

                try {
                    Ext.each(arrField, function (fieldObj, index) {

                        console_log(typeof fieldObj);

                        var dataIndex = '';

                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }

                        var srchId = gMain.getSearchField(dataIndex);
                        var value = Ext.getCmp(srchId).getValue();

                        if (value != null && value != '') {
                            if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value + '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch (noError) {
                }

                store.load({
                    scope: this,
                    callback: function (records, operation, success) {

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params: {
                                mc_codes: gu.getMcCodes()
                            },
                            success: function (response, request) {

                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });

            }
        });

        this.requestGoAction = Ext.create('Ext.Action', {
            cls: 'rfx-panel',
            itemId: 'requestGo',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '출고요청',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('requestGoAction'),
            handler: function (widget, event) {

                var selection = gm.me().assyCartGrid.getSelectionModel().getSelection();

                var assymap_uids = [];
                var prdplan_uids = [];
                var lot_no_list = [];
                var pr_quans = [];
                var firstPoNo = '';
                var isPoNoSame = true;
                var isPjTypeOu = false;
                var isDiffPjType = false;
                var uid_comcst = -1;

                for (var i = 0; i < selection.length; i++) {

                    var rec = selection[i];

                    assymap_uids.push(rec.get('assymap_uid'));
                    prdplan_uids.push(rec.get('pr_uid'));
                    lot_no_list.push(rec.get('po_no'));
                    pr_quans.push(rec.get('request_quan'));
                    /**
                     * 아래 코드는 바이오프로테크에서만 사용되므로 flag 사용 요망
                     */
                    var poNo = rec.get('po_no').substring(0, 1);
                    var pjType = rec.get('pj_type');

                    if (i === 0) {
                        firstPoNo = poNo;
                    } else {
                        if (firstPoNo !== poNo) {
                            isPoNoSame = false;
                            break;
                        }
                    }

                    if (pjType === 'OU') {
                        isPjTypeOu = true;
                    }

                    if (isPjTypeOu && pjType !== 'OU') {
                        isDiffPjType = true;
                        break;
                    }
                }

                
                if (isDiffPjType) {
                    Ext.Msg.alert('경고', '외주 품목과 일반 생산 품목을 같이 요청할 수 없습니다.');
                    return;
                }

                if (!isPoNoSame) {
                    Ext.Msg.alert('경고', 'Site가 일치하지 않는 품목이 있습니다.');
                    return;
                } else {
                    uid_comcst = selection[selection.length - 1].get('uid_comcst');
                }

                Ext.MessageBox.show({
                    title: '출고요청',
                    msg: '선택하신 제품을 출고 요청하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {

                        if (btn == "yes") {

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=createGoByGb',
                                params: {
                                    uid_comcst: uid_comcst,
                                    reserved_integer4: 1,
                                    assymap_uids: assymap_uids,
                                    prdplan_uids: prdplan_uids,
                                    lot_no_list: lot_no_list,
                                    pr_quans: pr_quans
                                },
                                success: function (val, action) {
                                    gm.me().assyTopStore.load();
                                    gm.me().produceWorkStore.load();
                                    gm.me().gbCartStore.load();
                                },
                                failure: function (val, action) {
                                    gm.me().gbCartStore.load();
                                }
                            });
                        }
                    }//fn function(btn)

                });//show
            }
        });

        this.mtrlListAction = Ext.create('Ext.Action', {
            cls: 'rfx-panel',
            itemId: 'mtrlList',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '자재리스트',
            hidden: gu.setCustomBtnHiddenProp('mtrlListAction'),
            disabled: false,
            handler: function (widget, event) {

                gm.me().openMergedPartlineWindow();
            }
        });

        this.removeCartAction = Ext.create('Ext.Action', {
            cls: 'rfx-panel',
            itemId: 'removeCart',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeCartAction'),
            handler: function (widget, event) {
                gm.me().removeCart();
            }
        });

        this.gbCartStore = Ext.create('Rfx2.store.company.bioprotech.GbCartStore', {pageSize: 99999});

        this.assyCartGrid = Ext.create('Rfx2.base.BaseGrid', {
            id: gu.id('assyCartGrid'),
            title: '출고LOT',
            border: true,
            resizable: true,
            scroll: true,
            collapsible: false,
            store: this.gbCartStore,
            selModel: 'checkboxmodel',
            layout: 'fit',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            listeners: {},
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false/*,
                preserveScrollOnReload: true*/
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.requestGoAction,
                        this.mtrlListAction,
                        this.removeCartAction
                    ]
                }
            ],
            columns: [
                {
                    text: '제품명',
                    dataIndex: 'item_name',
                    width: 150,
                    style: 'text-align:center'
                },
                {
                    text: '최종고객명',
                    dataIndex: 'wa_name',
                    width: 110,
                    renderer: function (value, record) {
                        if (value === 'null') {
                            return '';
                        }
                        return value;
                    },
                    style: 'text-align:center'
                },
                {
                    text: '수주번호',
                    dataIndex: 'order_number',
                    width: 80,
                    renderer: function (value, record) {
                        if (value === 'N/A') {
                            return '';
                        }
                        return value;
                    },
                    style: 'text-align:center'
                },
                {
                    text: 'LOT NO',
                    dataIndex: 'po_no',
                    width: 60,
                    style: 'text-align:center'
                },
                {
                    text: '시작일자',
                    dataIndex: 'reserved_timestamp1',
                    width: 90,
                    xtype: 'datecolumn',
                    format: 'Y-m-d',
                    style: 'text-align:center'
                },
                {
                    text: '신청수량', // 이부분 텍스트 에디트
                    css: 'edit-cell',
                    dataIndex: 'request_quan',
                    width: 120,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'right',
                    style: 'text-align:center; background-color:#0271BC;',
                    tdCls: 'custom-column',
                    editor: 'numberfield'
                },
                {
                    text: '잔여수량',
                    dataIndex: 'remain_quan',
                    width: 120,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'right',
                    style: 'text-align:center'
                }
            ]
        });

        this.assyCartGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections.length > 0) {
                    gm.me().removeCartAction.enable();
                } else {
                    gm.me().removeCartAction.disable();
                }

            }
        });

        this.gbCartStore.load();

        this.grid.setTitle('BOM');

        this.center = Ext.create('Ext.tab.Panel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '70%',
            tabPosition: 'top',
            items: [this.grid, this.assyCartGrid],
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    if (tab.id === gu.id('DBM7TREE-Assembly')) {
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                    }
                    gm.me().gbCartStore.load();
                }
            }
        });

        return this.center;

    },

    // ----------------------- END OF CENTER --------------------

    createWest: function () {

        Ext.tip.QuickTipManager.init();

        this.cloudAssemblyTreeStore = Ext.create('Mplm.store.cloudAssemblyVerTreeStore', {});

        this.produceWorkStore = Ext.create('Ext.data.Store', {
            model: Ext.create('Rfx2.model.ProduceOrder', {}),
            autoLoad: true,
            pageSize: gm.unlimitedPageSize
        });
        this.produceWorkStore.getProxy().setExtraParam('isReady', 'true');
        this.produceWorkStore.getProxy().setExtraParam('isProcess', 'true');

        this.assyTopStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: CONTEXT_PATH + '/production/schdule.do?method=readPartline',
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success'
                }
            },
            autoLoad: false
        });

        this.assyListSrch = Ext.create('Ext.Action', {
            cls: 'rfx-panel',
            itemId: 'assyListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {

                gm.me().produceWorkStore.getProxy().setExtraParams({});

                gm.me().produceWorkStore.getProxy().setExtraParam('isReady', 'true');
                gm.me().produceWorkStore.getProxy().setExtraParam('isProcess', 'true');


                gm.me().produceWorkStore.getProxy().setExtraParam('limit', gm.unlimitedPageSize);

                var item_name = gu.getCmp('search_item_name').getValue();
                var final_customer_name = gu.getCmp('search_wa_name').getValue();
                var order_number = gu.getCmp('search_pj_code').getValue();
                var pcs_desc_group_assy = gu.getCmp('search_lot_no').getValue();
                var product_group = gu.getCmp('product_group').getValue();

                if (item_name != null && item_name.length > 0) {
                    gm.me().produceWorkStore.getProxy().setExtraParam('item_name', '%' + item_name + '%');
                }

                if (final_customer_name != null && final_customer_name.length > 0) {
                    gm.me().produceWorkStore.getProxy().setExtraParam('final_customer_name', '%' + final_customer_name + '%');
                }

                if (order_number != null && order_number.length > 0) {
                    gm.me().produceWorkStore.getProxy().setExtraParam('order_number', '%' + order_number + '%');
                }

                if (pcs_desc_group_assy != null && pcs_desc_group_assy.length > 0) {
                    gm.me().produceWorkStore.getProxy().setExtraParam('pcs_desc_group_assy', '%' + pcs_desc_group_assy + '%');
                }

                if (product_group != null && product_group.length > 0) {
                    gm.me().produceWorkStore.getProxy().setExtraParam('product_group', '%' + product_group + '%');
                }

                gm.me().produceWorkStore.load();
            }
        });

        this.addGbCartAction = Ext.create('Ext.Action', {
            itemId: 'addMyCartAction',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: gm.getMC('CMD_Add_to_Cart', '카트담기'),
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addGbCartAction'),
            handler: function (widget, event) {

                var srcahd_uids = new Array();
                var assymap_uids = new Array();
                var pr_quans = new Array();
                var lot_nos = new Array();

                var selections = gm.me().assyGrid.getSelectionModel().getSelection();

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];

                    var reserved_varchard = rec.get('reserved_varchard');

                    if (reserved_varchard === 'Y') {
                        Ext.Msg.alert('', '이미 출고요청이 들어간 LOT가 있습니다.');
                        return;
                    }

                    assymap_uids.push(rec.get('assymap_uid'));
                    srcahd_uids.push(rec.get('child'));
                    pr_quans.push(rec.get('item_quan'));
                    lot_nos.push(rec.get('po_no'));
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addGbCart',
                    params: {
                        assymap_uids: assymap_uids,
                        srcahd_uids: srcahd_uids,
                        pr_quans: pr_quans,
                        lot_nos: lot_nos
                    },
                    success: function (result, request) {
                        Ext.MessageBox.alert('알림', '카트담기 성공.');

                        gm.me().gbCartStore.load();
                    }
                });
            }//endofhandler

        });

        this.produceWorkStore.getProxy().setExtraParam('limit', gm.unlimitedPageSize);

        this.assyGrid = Ext.create('Rfx2.base.BaseGrid', {
            title: '생산계획',
            collapsible: true,
            store: this.produceWorkStore,
            multiSelect: false,
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false/*,*/
                // preserveScrollOnReload: true
            },
            listeners: {
                'afterrender': function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    // elments.each(function (el) {

                    // }, this);

                },
                activate: function (tab) {
                    setTimeout(function () {
                        // gu.getCmp('main-panel-center').setActiveTab(0);
                        // alert(tab.title + ' was activated.');
                    }, 1);
                },
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                },
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                }
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.assyListSrch,
                        this.addGbCartAction
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: '50%',
                            field_id: 'search_item_name',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_name'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('item_name', '%' + e + '%');
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().assyGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            width: '50%',
                            field_id: 'search_wa_name',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_wa_name'),
                            name: 'search_wa_name',
                            xtype: 'triggerfield',
                            emptyText: '최종고객명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');

                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('final_customer_name', '%' + e + '%');

                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().assyGrid.getStore().load();
                                    }
                                }
                            }
                        },


                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: '50%',
                            field_id: 'search_pj_code',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_pj_code'),
                            name: 'search_pj_code',
                            xtype: 'triggerfield',
                            emptyText: '수주번호',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');

                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    var paramVal = '%' + e + '%';
                                    if (!!e) {
                                    } else {
                                        paramVal = '';
                                    }
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('order_number', paramVal);
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().assyGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            width: '50%',
                            field_id: 'search_lot_no',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_lot_no'),
                            name: 'search_lot_no',
                            xtype: 'triggerfield',
                            emptyText: 'LOT NO',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('po_no', '%' + e + '%');
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().assyGrid.getStore().load();
                                    }
                                }
                            }
                        },

                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: '50%',
                            field_id: 'product_group',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id: gu.id('product_group'),
                            name: 'product_group',
                            xtype: 'combo',
                            emptyText: gm.getMC('CMD_Product', '제품군'),
                            store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRD_GROUP'}),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>',

                            listeners: {
                                select: function (fieldObj, e, a, b) {
                                    var paramVal = fieldObj.getValue();
                                    if (!!e) {
                                    } else {
                                        paramVal = '';
                                    }
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('product_group', paramVal);
                                    gm.me().assyGrid.getStore().load();
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().assyGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            width: '50%',
                            field_id: 'site',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id: gu.id('site'),
                            name: 'site',
                            xtype: 'combo',
                            emptyText: 'Site',
                            store: Ext.create('Mplm.store.ProductionSiteStore'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>',

                            listeners: {
                                select: function (fieldObj, e, a, b) {
                                    var paramVal = fieldObj.getValue();
                                    if (!!e) {
                                    } else {
                                        paramVal = '';
                                    }
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('po_type', paramVal);
                                    gm.me().assyGrid.getStore().load();
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().assyGrid.getStore().load();
                                    }
                                }
                            }
                        },
                    ]
                },

            ],
            columns: [
                {
                    text: '종류',
                    dataIndex: 'pj_type',
                    width: 60,
                    style: 'text-align:center',
                    renderer: function (value, meta, record, rowIndex) {
                        switch(value) {
                            case 'OU':
                                return '외주';
                            default:
                                return '일반';
                        }
                    },
                },
                {
                    text: '출고상태',
                    width: 80,
                    renderer: function (value, meta, record, rowIndex) {
                        var item_quan = record.get('item_quan');
                        var remain_quan = record.get('remain_quan');

                        if (remain_quan === 0) {
                            return '요청완료';
                        }

                        if (remain_quan === item_quan) {
                            return '요청대기';
                        }

                        return '일부요청';
                    },
                    style: 'text-align:center'
                },
                {
                    text: '생산상태',
                    width: 80,
                    dataIndex: 'state',
                    renderer: function (value, meta, record, rowIndex) {
                        switch(value) {
                            case 'N':
                                return '생산중';
                            case 'P':
                                return '생산대기';
                            case 'Y':
                                return '생산완료';
                            default:
                                return value;
                        }
                    },
                    style: 'text-align:center'
                },
                {
                    text: '제품명',
                    dataIndex: 'item_name',
                    width: 150,
                    style: 'text-align:center'
                },
                {
                    text: '최종고객명',
                    dataIndex: 'wa_name',
                    width: 105,
                    renderer: function (value, record) {
                        if (value === 'null') {
                            return '';
                        }
                        return value;
                    },
                    style: 'text-align:center'
                },
                {
                    text: '수주번호',
                    dataIndex: 'order_number',
                    width: 80,
                    renderer: function (value, record) {
                        if (value === 'N/A') {
                            return '';
                        }
                        return value;
                    },
                    style: 'text-align:center'
                },
                {
                    text: 'LOT NO',
                    dataIndex: 'po_no',
                    width: 60,
                    style: 'text-align:center'
                },
                {
                    text: 'BOM수정일',
                    dataIndex: 'assy_change_date',
                    format: 'Y-m-d',
                    width: 80,
                    style: 'text-align:center',
                    renderer: function (value, record) {

                        if (value == null || value.length < 10) {
                            return value;
                        }

                        return value.substring(0, 10);
                    }
                },
                {
                    text: '시작일자',
                    dataIndex: 'reserved_timestamp1',
                    width: 80,
                    xtype: 'datecolumn',
                    format: 'Y-m-d',
                    style: 'text-align:center'
                },
                {
                    text: '수량',
                    dataIndex: 'item_quan',
                    width: 80,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'right',
                    style: 'text-align:center'
                },
                {
                    text: '잔여수량',
                    dataIndex: 'remain_quan',
                    width: 80,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    align: 'right',
                    style: 'text-align:center'
                },
            ]
        });

        this.assyGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().onAssemblyGridSelection(selections);

                if (selections.length > 0) {

                    gm.me().addGbCartAction.enable();

                    gm.me().assyTopStore.getProxy().setExtraParams({
                        prdplan_uid: selections[0].get('unique_id_long'),
                        reserved_integer4: 0,
                        is_new: 'Y',
                        ac_uid: selections[0].get('ac_uid')
                    });
                    gm.me().assyTopStore.load(function (records) {
                        if (!!records && records.length > 0) {
                            gm.me().selectedAssyTop = records[0];
                            gm.me().selectedAssyTopUid = records[0].get('unique_uid');
                        }
                    })
                } else {
                    gm.me().addGbCartAction.disable();
                }
            }
        });

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            width: '45%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },

            items: [this.assyGrid]
        });

        return this.west;
    },
    cellEditing: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing1: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing2: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    // *****************************GLOBAL VARIABLE**************************/
    gridStock: null,
    store: null,
    stockStore: null,
    gItemGubunType: null,
    itemGubunType: null,
    bomAll: null,

    sales_price: '',
    quan: '',
    lineGap: 35,

    selectedPjUid: '',
    selectedAssyUid: '',
    selectedChild: '',

    selectionLength: 0,

    assy_pj_code: '',
    selectedAssyCode: '',
    selectedPjCode: '',
    selectedPjName: '',
    selectedAssyDepth: 0,
    selectedAssyName: '',
    selectedparent: '',
    ac_uid: '',
    selectedPjQuan: 1,
    selectedAssyQuan: 1,
    selectedMakingQuan: 1,

    addpj_code: '',
    is_complished: false,
    routeTitlename: '',
    puchaseReqTitle: '',

    selectedAssyTop: '',
    selectedAssyTopUid: '',

    CHECK_DUP: '-copied-',

    gGridStockSelects: [],
    copyArrayStockGrid: function (from) {

        this.gGridStockSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridStockSelects[i] = from[i];
            }
        }
    },

    bomTableInfo: '',

    createLine: function (val, align, background, style) {
        return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>' + val + '</td>';
    },

    setCopiedPartQuan: function (n) {

        var o = gu.getCmp('childCount');
        if (o != null) {
            o.update(n + '건 복사됨.');
        }

        this.copiedPartCnt = n;

        if (this.copiedPartCnt > 0) {
            this.pastePartAction.enable();
        } else {
            this.pastePartAction.disable();
        }

    },

    setCopiedAssyQuan: function () {
        var o = gu.getCmp('assy_quan');
        if (o != null) {

            var assyline = this.selected_tree_record;
            if (assyline != null) {

                if (assyline.get('parentId') == 'root') {
                    o.update(assyline.get('pj_code') + ' 프로젝트' + ' 복사');
                } else {
                    o.update(assyline.get('pj_code') + '/' + assyline.get('part_path') + ' 복사');
                }


            }

        } else {
            //o.update('');
        }
    },
    setProjectQuan: function (n) {
        var o = gu.getCmp('pj_quan');
        if (o != null) {
            o.update('' + n);
        }
    },

    setMaking_quan: function (n) {
        var o = gu.getCmp('making_quan');
        if (o != null) {
            o.update('' + n);
        }

    },

    cloudprojectStore: Ext.create('Mplm.store.cloudProjectStore', {}),
    mesProjectTreeStore: Ext.create('Mplm.store.MesProjectTreeStore', {}),
    routeGubunTypeStore: Ext.create('Mplm.store.RouteGubunTypeStore', {}),
    routeGubunTypeStore_W: Ext.create('Mplm.store.RouteGubunTypeStore_W', {}),
    commonStandardStore: Ext.create('Mplm.store.CommonStandardStore', {
        hasNull: true
    }),


    renderCarthistoryPlno: function (value, p, record) {
        var unique_uid = record.get('unique_uid');

        return Ext.String.format(
            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
            unique_uid, value
        );
    },


    getPosStandard: function (id) {

        for (var i = 0; i < this.standard_flag_datas.length; i++) {
            if (this.standard_flag_datas[i].get('systemCode') == id) {
                return this.standard_flag_datas[i];
            }
        }
        return null;
    },

    selectAssy: function () {

        this.addAssyAction.enable();
        this.addPartAction.enable();
        this.syncMbomAction.enable();
        if (this.copiedPartCnt > 0) {
            this.pastePartAction.enable();
        }
        this.pasteAssyAction.enable();
        this.importAssyAction.enable();
        this.copyAssemblyAction.enable();
        // if (this.depth > 0) {
        //     this.addPartAction.enable();
        //     this.editAssyAction.disable();
        //     this.removeAssyAction.enable();
        // } else {
        //     this.addPartAction.disable();
        //     this.editAssyAction.disable();
        //     this.removeAssyAction.enable();
        //     this.pastePartAction.disable();
        // }
    },

    unselectAssy: function () {
        // this.addAction.disable();
        this.addAssyAction.disable();
        this.addPartAction.disable();
        this.pastePartAction.disable();
        this.pasteAssyAction.disable();
        this.editAssyAction.disable();
        this.removeAssyAction.disable();
        this.copyAssemblyAction.disable();
        this.importAssyAction.disable();
        this.syncMbomAction.disable();
    },


    item_code_dash: function (item_code) {
        if (item_code == null || item_code.length < 13) {
            return item_code;
        } else {
            return item_code.substring(0, 12);
        }
    },

    setReadOnlyName: function (name, readonly) {
        this.setReadOnly(gu.getCmp(name), readonly);
    },

    setReadOnly: function (o, readonly) {
        if (o != undefined && o != null) {
            o.setReadOnly(readonly);
            if (readonly) {
                o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
            } else {
                o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
            }
        }


    },

    getPl_no: function (systemCode) {
        var prefix = systemCode;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
            params: {
                first: prefix,
                parent: this.selectedAssyTop.get('srcahd_uid'),
                parent_uid: this.selectedAssyTopUid
            },
            success: function (result, request) {
                var result = result.responseText;
                var str = result; // var str = '293';

                if (systemCode == 'O') {
                    str = str.substring(0, str.length - 1) + '0'; //'O'를 0 으로 교체.
                }

                gu.getCmp('pl_no').setValue(str);


            },
            failure: extjsUtil.failureMessage
        });
    },


    fPERM_DISABLING_Complished: function () {
        // 1. 권한있음.
        if (fPERM_DISABLING() == false && is_complished == false) {
            return false;
        } else { // 2.권한 없음.
            return true;
        }
    },

    // Define reset Action
    resetAction: Ext.create('Ext.Action', {
        itemId: 'resetButton',
        iconCls: 'af-remove',
        text: CMD_INIT,
        handler: function (widget, event) {
            resetPartForm();
        }
    }),

    pastePartAction: Ext.create('Ext.Action', {
        itemId: 'pasteActionButton',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function (widget, event) {

            var pj_uid = gm.me().selectedPjUid;
            var parent = gm.me().selectedAssyTop.get('srcahd_uid');
            var parent_uid = gm.me().selectedAssyTopUid;
            var cnt = gm.me().copiedPartCnt;

            if (cnt < 1) {
                Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
            } else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
            } else {

                var fp = Ext.create('Ext.FormPanel', {
                    id: gu.id('formPanelSelect'),
                    frame: true,
                    border: false,
                    fieldDefaults: {
                        labelWidth: 80
                    },
                    width: 300,
                    height: 220,
                    bodyPadding: 10,
                    items: [{
                        xtype: 'component',
                        html: '복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
                    },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '10 10 10',
                            items: [{
                                xtype: 'fieldset',
                                flex: 1,
                                border: false,
                                // title: '복사 수행시 수량을 1로 초기화하거나
                                // 품번을 대상 Assy에 맞게 재 부여할 수
                                // 있습니다.',
                                defaultType: 'checkbox', // each
                                // item
                                // will
                                // be a
                                // checkbox
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%',
                                    hideEmptyLabel: false
                                },
                                items: [{
                                    fieldLabel: '복사 옵션',
                                    boxLabel: '수량을 1로 초기화',
                                    name: 'resetQty',
                                    checked: true,
                                    inputValue: 'true'
                                }, {
                                    boxLabel: '품번 재부여',
                                    name: 'resetPlno',
                                    checked: true,
                                    inputValue: 'true'
                                }, new Ext.form.Hidden({
                                    name: 'hid_null_value'
                                })]
                            }]
                        }
                    ]
                });

                w = Ext.create('ModalWindow', {
                    title: CMD_ADD + ' :: ' + /* (G) */ vCUR_MENU_NAME,
                    width: 300,
                    height: 220,
                    plain: true,
                    items: fp,
                    buttons: [{
                        text: '복사 실행',
                        disabled: false,
                        handler: function (btn) {
                            var form = gu.getCmp('formPanelSelect').getForm();
                            var val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=addPastePartAssymap',
                                params: {
                                    project_uid: gm.me().selectedPjUid,
                                    parent: gm.me().selectedAssyTop.get('srcahd_uid'),
                                    parent_uid: gm.me().selectedAssyTopUid,
                                    reserved_integer2: gm.me().selectedAssyTopUid,
                                    resetQty: val['resetQty'],
                                    resetPlno: val['resetPlno'],
                                    pr_uid: gm.me().selected_tree_record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    if (w) {
                                        w.close();
                                    }
                                    var result = result.responseText;
                                    //this.store.load(function() {});
                                    // Ext.MessageBox.alert('결과','총
                                    // ' + result + '건을
                                    // 복사하였습니다.');
                                    gm.me().store.load(function (records) {
                                        // gm.me().insertStockStoreRecord(records);
                                        gm.me().setCopiedPartQuan(0);
                                    });
                                    gu.getCmp('DBM7TREE-Assembly').store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }


                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (w) {
                                w.close();
                            }
                        }
                    }]
                });
                w.show();


            }
        }
    }),

    pasteAssyAction: Ext.create('Ext.Action', {
        itemId: 'pasteAssyAction',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function (widget, event) {

            if (gm.me().selectedAssyUid == null || gm.me().selectedAssyUid == '' || gm.me().selectedPjUid == null || gm.me().selectedPjUid == '') {
                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
            } else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addPasteAssyAssymap',
                    params: {
                        to_pj_uid: gm.me().selectedPjUid,
                        to_assy_uid: gm.me().selectedAssyUid,
                        to_parent: gm.me().selectedChild
                    },
                    success: function (result, request) {
                        var result = result.responseText;

                        gm.me().selectTreeGrid(null);
                        gm.me().refreshAssyCopy();
                        gm.me().cloudProjectTreeStore.load();
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                    },
                    failure: extjsUtil.failureMessage
                });

            }
        }
    }),

    importAssyAction: Ext.create('Ext.Action', { //설계관리> BOM Tree > 가져오기
        itemId: 'importAssyAction',
        iconCls: 'ban',
        text: '참조해제',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '참조해제',
                msg: '해제 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().importAssyConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    importAssyConfirm: function (result) {

        if (result == 'yes') {
            var parent_uid = gm.me().selectedAssyUid;
            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '해제할  Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }

            var selection = gm.me().selected_tree_record;

            var parent = selection.get('parent');
            var child = selection.get('child');
            var unique_uid = selection.get('unique_uid');
            var refer_uid = selection.get('refer_uid');
            var is_refer = selection.get('is_refer');

            if (refer_uid == null || refer_uid == -1) {
                Ext.MessageBox.alert('Error', '참조된 Assembly가 아닙니다.', function callBack(id) {
                    return
                });
                return;
            }

            gm.me().partlineStore.getProxy().setExtraParam("parent", child);
            gm.me().partlineStore.getProxy().setExtraParam("parent_uid", refer_uid);

            var myStore = gm.me().partlineStore;
            var uids = [];
            myStore.load(function () {

                myStore.data.each(function (rec) {

                    uids.push(rec.get('unique_uid'));
                });

                if (uids.length == 0) {
                    Ext.MessageBox.alert('알림', '가져올 항목이 없습니다.');
                } else {
                    var pj_uid = gm.me().selectedPjUid;
                    var parent = gm.me().selectedChild;
                    var parent_uid = gm.me().selectedAssyUid;
                    var cnt = uids.length;

                    if (cnt < 1) {
                        Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
                    } else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                        Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
                    } else {

                        gm.me().pastePartActionHandler(uids, unique_uid, refer_uid);
                        gm.me().partlineStore.removeAll();
                    }
                }
            });
        }
    },

    // 수정등록
    modRegAction: Ext.create('Ext.Action', {
        itemId: 'modRegAction',
        iconCls: 'page_copy',
        text: '값 복사',
        disabled: true,
        handler: function (widget, event) {
            gm.me().unselectForm();
            grid.getSelectionModel().deselectAll();
        }
    }),
    cleanComboStore: function (cmpName) {
        var component = gu.getCmp(cmpName);

        component.setValue('');
        component.setDisabled(false);
        component.getStore().removeAll();
        component.setValue(null)
        component.getStore().commitChanges();
        component.getStore().totalLength = 0;
    },

    resetParam: function () {
        this.store.getProxy().setExtraParam('unique_id', '');
        this.store.getProxy().setExtraParam('item_code', '');
        this.store.getProxy().setExtraParam('item_name', '');
        this.store.getProxy().setExtraParam('specification', '');
    },

    loadTreeAllDef: function () {
        this.loadTreeAll(this.selectedPjUid);
    },
    loadTreeAll: function (pjuid) {
        // this.this.assyGrid.setLoading(true);

        this.mesProjectTreeStore.removeAll(true);
        this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
        this.mesProjectTreeStore.load({
            callback: function (records, operation, success) {

            }
        });
    },

    setBomData: function (id) {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id
            },
            success: function (result, request) {

                var jsonData = Ext.decode(result.responseText);
                var records = jsonData.datas;

                gm.me().setPartFormObj(records[0]);
            },
            failure: extjsUtil.failureMessage
        });

    },

    setPartFormObj: function (o) {

        var standard_flag = 'P';

        gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);

        gu.getCmp('standard_flag').setValue(standard_flag);
        gu.getCmp('standard_flag_disp').select(gm.me().getPosStandard(standard_flag));
        gu.getCmp('model_no').setValue(o['model_no']);
        gu.getCmp('description').setValue(o['description']);

        gu.getCmp('comment').setValue(o['comment']);
        gu.getCmp('maker_name').setValue(o['maker_name']);
        gu.getCmp('bm_quan').setValue('1');
        gu.getCmp('unit_code').setValue(o['unit_code']);
        gu.getCmp('sales_price').setValue(o['sales_price']);


        gm.me().getPl_no(standard_flag);

        var currency = o['currency'];
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp('currency').setValue(currency);
        this.readOnlyPartForm(true);
    },

    setPartForm: function (record) {

        gu.getCmp('unique_id').setValue(record.get('unique_id'));
        gu.getCmp('unique_uid').setValue(record.get('unique_uid'));
        gu.getCmp('item_code').setValue(record.get('item_code'));
        gu.getCmp('item_name').setValue(record.get('item_name'));
        gu.getCmp('specification').setValue(record.get('specification'));

        var standard_flag = record.get('standard_flag');
        gu.getCmp('standard_flag').setValue(standard_flag);

        gu.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
        gu.getCmp('model_no').setValue(record.get('model_no'));
        gu.getCmp('description').setValue(record.get('description'));
        gu.getCmp('pl_no').setValue(record.get('pl_no'));
        gu.getCmp('comment').setValue(record.get('comment'));
        gu.getCmp('maker_name').setValue(record.get('maker_name'));
        gu.getCmp('bm_quan').setValue(record.get('bm_quan'));
        gu.getCmp('unit_code').setValue(record.get('unit_code'));
        gu.getCmp('sales_price').setValue(record.get('sales_price'));


        var currency = record.get('currency');
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp('currency').setValue(currency);

        var ref_quan = record.get('ref_quan');

        if (ref_quan > 1) {
            this.readOnlyPartForm(true);
            gu.getCmp('isUpdateSpec').setValue('false');
        } else {
            this.readOnlyPartForm(false);
            this.setReadOnlyName('item_code', true);
            this.setReadOnlyName('standard_flag_disp', true);
            gu.getCmp('isUpdateSpec').setValue('true');
        }

    },

    resetPartForm: function () {

        gu.getCmp('unique_id').setValue('');
        gu.getCmp('unique_uid').setValue('');
        gu.getCmp('item_code').setValue('');
        gu.getCmp('item_name').setValue('');
        gu.getCmp('specification').setValue('');
        gu.getCmp('standard_flag').setValue('');
        gu.getCmp('standard_flag_disp').setValue('');

        gu.getCmp('model_no').setValue('');
        gu.getCmp('description').setValue('');
        gu.getCmp('pl_no').setValue('');
        gu.getCmp('comment').setValue('');
        gu.getCmp('maker_name').setValue('');
        gu.getCmp('bm_quan').setValue('1');
        gu.getCmp('unit_code').setValue('');
        gu.getCmp('sales_price').setValue('0');

        gu.getCmp('currency').setValue('KRW');
        gu.getCmp('unit_code').setValue('PC');
        this.readOnlyPartForm(false);
    },

    unselectForm: function () {

        gu.getCmp('unique_id').setValue('');
        gu.getCmp('unique_uid').setValue('');
        gu.getCmp('item_code').setValue('');

        var cur_val = gu.getCmp('specification').getValue();
        var cur_standard_flag = gu.getCmp('standard_flag').getValue();

        if (cur_standard_flag != 'O') {
            gu.getCmp('specification').setValue(cur_val + ' ' + this.CHECK_DUP);
        }

        gu.getCmp('currency').setValue('KRW');

        this.getPl_no(gu.getCmp('standard_flag').getValue());
        this.readOnlyPartForm(false);
    },

    readOnlyPartForm: function (b) {

        this.setReadOnlyName('item_code', b);
        this.setReadOnlyName('item_name', b);
        this.setReadOnlyName('specification', b);
        this.setReadOnlyName('standard_flag', b);
        this.setReadOnlyName('standard_flag_disp', b);

        this.setReadOnlyName('model_no', b);
        this.setReadOnlyName('description', b);
        // this.setReadOnlyName('pl_no', b);
        this.setReadOnlyName('comment', b);
        this.setReadOnlyName('maker_name', b);

        this.setReadOnlyName('currency', b);
        this.setReadOnlyName('unit_code', b);

        gu.getCmp('search_information').setValue('');

    },

    Item_code_dash: function (item_code) {
        return item_code.substring(0, 5) + "-" + item_code.substring(5, 9) + "-" +
            item_code.substring(9, 12);
    },

    getColName: function (key) {
        return gm.getColNameByField(this.fields, key);
    },

    getTextName: function (key) {
        return gm.getColNameByField(this.fields, key);
    },

    standard_flag_datas: [],
    assyGrid: null,
    expandAllTree: function () {
        if (this.assyGrid != null) {
            this.assyGrid.expandAll();
        }
    },
    loadStore: function (child) {

        this.store.getProxy().setExtraParam('child', child);

        this.store.load(function (records) {
        });

    },
    arrAssyInfo: function (o1, o2, o3, o4, o5, o6, o7, o8) {
        gm.me().mtrlChilds = o1;
        gm.me().bmQuans = o2;
        gm.me().itemCodes = o3;
        gm.me().spCode = o4;
        gm.me().ids = o5;
        gm.me().levels = o6;
        gm.me().bomYNs = o7;
        gm.me().pcr_divs = o8;
    },
    selectedClassCode: '',
    materialStore: Ext.create('Mplm.store.MtrlSubStore'),
    productSubStore: Ext.create('Mplm.store.ProductSubStore'),
    partlineStore: Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),
    addMtrlGrid: null,
    addPrdGrid: null,
    deleteConfirm: function (result) {
        if (result == 'yes') {
            var arr = gm.me().selectionedUids;

            var isAssy = false;

            var selections = gm.me().grid.getSelectionModel().getSelection();
            for (var i = 0; i < selections.length; i++) {
                var standard_flag = selections[i].get('standard_flag');
                if (standard_flag === 'A') {
                    isAssy = true;
                    break;
                }
            }

            if (arr.length > 0) {

                var CLASS_ALIAS = gm.me().deleteClass;

                if (CLASS_ALIAS == null) {
                    CLASS_ALIAS = [];
                    for (var i = 0; i < gm.me().fields.length; i++) {
                        var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
                        if (tableName != 'map') {
                            CLASS_ALIAS.push(tableName);
                        }

                    }
                    CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
                }

                gm.setCenterLoading(true);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=deleteAssyAndBom',
                    params: {
                        assy_uids: arr,
                        pr_uid: gm.me().selected_tree_record.get('unique_id_long')
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        gm.me().store.load();
                        gm.setCenterLoading(false);

                        if (isAssy) {
                            var record = gu.getCmp('productcombo-DBM7_TREE').selection;

                            var child = record.get('unique_id');
                            gm.me().srchTreeHandler(gm.me().assyGrid, gm.me().cloudAssemblyTreeStore,
                                'productcombo-DBM7_TREE', 'child', true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
                                params: {
                                    paramName: 'CommonProjectAssy',
                                    paramValue: child + ';' + '-1'
                                },

                                success: function (result, request) {
                                    console_log('success defaultSet');
                                },
                                failure: function (result, request) {
                                    console_log('fail defaultSet');
                                }
                            });
                        } else {
                            gu.getCmp('DBM7TREE-Assembly').store.load();
                        }
                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                        });
                        gm.setCenterLoading(false);
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                    }
                });

            }
        }
    },

    srchTreeHandler: function (my_treepanel, cloudProjectTreeStore, widName, parmName, b/*, last_selected_tree_id*/) {

        this.assyGrid.setLoading(true);

        this.resetParam(this.cloudAssemblyTreeStore, this.searchField);
        var val = gu.getCmp(widName).getValue();
        console_log('val' + val);

        this.cloudAssemblyTreeStore.getProxy().setExtraParam(parmName, val);
        this.cloudAssemblyTreeStore.load({

            callback: function (records, operation, success) {

                if (records.length == 0) {
                    gm.me().assyGrid.setLoading(false);
                    return;
                }

                var assytop_uid = records[0].get('id');

                var BomGrid = gu.getCmp('DBM7TREE-Assembly');
                BomGrid.store.getProxy().setExtraParam('reserved_integer2', assytop_uid);
                BomGrid.store.getProxy().setExtraParam('orderBy', "reserved_integer3");
                BomGrid.store.getProxy().setExtraParam('ascDesc', "ASC");
                BomGrid.store.load(function (records) {
                    var total_price = 0.0;

                    for (var i = 0; i < records.length; i++) {

                        var total_sales_price = records[i].get('total_sales_price');

                        total_price += parseFloat(total_sales_price);
                    }

                    gu.getCmp('target_totalPrice').setHtml('총 금액 : ' + total_price.toFixed(2));
                });

                gm.me().assyGrid.setLoading(false);

                gm.me().selectTree();
            }
        });

    },

    selectProjectCombo: function (record) {

        var pjuid = record.get('unique_id');
        this.ac_uid = pjuid;
        var pj_name = record.get('pj_name');
        var pj_code = record.get('pj_code');

        this.assy_pj_code = '';
        this.selectedAssyCode = '';
        this.selectedPjCode = pj_code;
        this.selectedPjName = pj_name;
        this.selectedPjUid = pjuid;

        this.puchaseReqTitle = '[' + pj_code + '] ' + pj_name;

        gu.getCmp('target-projectcode-DBM7_TREE').update(pj_code);

        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        this.store.removeAll();
        this.unselectAssy();
        // Default Set
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
            params: {
                paramName: 'CommonProjectAssy',
                paramValue: pjuid + ';' + '-1'
            },

            success: function (result, request) {
                console_log('success defaultSet');
            },
            failure: function (result, request) {
                console_log('fail defaultSet');
            }
        });
    },
    selectAssymapCombo: function (record) {

        var pjuid = -1;
        var child = record.get('unique_id');
        var item_code = record.get('item_code');
        var item_name = record.get('item_name');
        var specification = record.get('specification');

        this.selectedPjUid = -1;

        this.puchaseReqTitle = '[' + item_code + '] ' + item_name;

        if (specification.length === 0) {
            specification = '(규격 정보 없음)';
        }

        var targetPjCode = '<div>' + item_code + '<font color=yellow><br/>' + item_name + ' / ' + specification + '</font></div>';

        gu.getCmp('target-projectcode-DBM7_TREE').update(targetPjCode);

        this.srchTreeHandler(this.assyGrid, this.cloudAssemblyTreeStore, 'productcombo-DBM7_TREE', 'child', true);
        this.store.removeAll();
        this.unselectAssy();
        //         Default Set
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
            params: {
                paramName: 'CommonProjectAssy',
                paramValue: child + ';' + '-1'
            },

            success: function (result, request) {
                console_log('success defaultSet');
            },
            failure: function (result, request) {
                console_log('fail defaultSet');
            }
        });
    },
    registPartFc: function (val) {

        var standard_flag = val['standard_flag'];

        if (standard_flag === 'A') {
            // Ext.MessageBox.alert('알림', '현재 Assembly 추가 기능 개선 중입니다.');
            // if (winPart) {
            //     winPart.close();
            // }
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=cloudAssyCreateAndCopyBom',
                params: {
                    parent_uid: gm.me().selectedAssyTopUid,
                    parent: gm.me().selectedAssyTop.get('srcahd_uid'),
                    ac_uid: gm.me().selected_tree_record.get('ac_uid'),
                    pl_no: val['pl_no'],
                    bm_quan: val['bm_quan'],
                    child: val['unique_id'],
                    item_name: val['item_name'],
                    level: val['reserved_integer1'],
                    assytopUid: gm.me().selectedAssyTopUid,
                    reserved_integer3: val['reserved_integer3'] !== null ? val['reserved_integer3'] : gm.me().mNum,
                    reserved6: val['reserved6'],
                    reserved7: val['reserved7'],
                    pr_uid: gm.me().selected_tree_record.get('unique_id_long'),
                    is_new: 'Y'
                },
                success: function (result, request) {
                    gm.me().setLoading(false);
                    //gm.me().reSelect();
                    // gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                    // gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                    // gm.me().store.getProxy().setExtraParam('ac_uid', -1);
                    gm.me().store.load(function (records) {
                        var max_num = 0;

                        for (var i = 0; i < records.length; i++) {

                            var reserved_integer3 = records[i].get('reserved_integer3');

                            if (max_num < reserved_integer3) {
                                max_num = reserved_integer3;
                            }
                        }

                        gm.me().mNum = max_num + 1;
                    });

                    Ext.MessageBox.alert('성공', '자재가 정상적으로 등록 되었습니다.');

                    var record = gu.getCmp('productcombo-DBM7_TREE').selection;

                    var child = record.get('unique_id');
                    gm.me().srchTreeHandler(gm.me().assyGrid, gm.me().cloudAssemblyTreeStore,
                        'productcombo-DBM7_TREE', 'child', true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
                        params: {
                            paramName: 'CommonProjectAssy',
                            paramValue: child + ';' + '-1'
                        },

                        success: function (result, request) {
                            console_log('success defaultSet');
                        },
                        failure: function (result, request) {
                            console_log('fail defaultSet');
                        }
                    });
                },
                failure: function () {
                    gm.me().setLoading(false);
                    gu.getCmp('DBM7TREE-Assembly').store.load();
                    extjsUtil.failureMessage;
                }
            });

        } else {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/material.do?method=addChildBOMTreeWithPr',
                params: {
                    parent_uid: gm.me().selectedAssyTopUid,
                    parent: gm.me().selectedAssyTop.get('srcahd_uid'),
                    bm_quan: val['bm_quan'],
                    child: val['unique_id'],
                    item_code: val['item_code'],
                    pl_no: val['pl_no'],
                    level: val['reserved_integer1'],
                    assytop_uid: gm.me().selectedAssyTopUid,
                    reserved_varchar2: val['reserved_varchar2'],
                    reserved_integer3: gm.me().mNum,
                    reserved_integer4: 1,
                    reserved6: val['reserved6'],
                    reserved7: val['reserved7'],
                    pr_uid: gm.me().selected_tree_record.get('unique_id_long'),
                    ac_uid: gm.me().selectedAssyTop.get('ac_uid'),
                    is_new: 'Y'
                },

                success: function (result, request) {

                    // gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                    // gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                    // gm.me().store.getProxy().setExtraParam('ac_uid', -1);
                    gm.me().store.load(function (records) {
                        var max_num = 0;

                        for (var i = 0; i < records.length; i++) {

                            var reserved_integer3 = records[i].get('reserved_integer3');

                            if (max_num < reserved_integer3) {
                                max_num = reserved_integer3;
                            }
                        }

                        gm.me().mNum = max_num + 1;
                    });
                    gu.getCmp('DBM7TREE-Assembly').store.load();
                    Ext.MessageBox.alert('성공', '자재가 정상적으로 등록 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
        }


    },
    addNewAction: function (val) {

        var partLine = Ext.create('Rfx.model.PartLine');
        for (var attrname in val) {
            //partLine[attrname] = val[attrname];
            partLine.set(attrname, val[attrname]);
        }


        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=createNew',
            params: val,
            success: function (result, request) {
                gm.me().selectTreeGrid(null);
            },
            failure: function (batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });

    },

    selectTree: function () {

        this.assyGrid.expandAll();

        if (this.selected_tree_record != null) {
            this.assyGrid.getSelectionModel().select(this.selected_tree_record);
        } else {
            this.assyGrid.getSelectionModel().select(0);
        }

    },

    selectTreeRecord: function (rec) {

        if (this.selected_tree_record != null && rec.id == this.selected_tree_record.id) {

            this.assyGrid.getSelectionModel().select(rec);
        }
    },

    selectTreeGrid: function (rec) {

        if (rec == null) {
            this.store.load(function (records) {
            });
        } else {
            this.selected_tree_record = rec;

            this.classCode = rec.get('class_code');
            this.selectedAssyCode = rec.get('assy_code');
            this.modelNo = rec.get('model_no');
            this.description = rec.get('description');
            this.selectedparent = rec.get('parent');
            this.selectedChild = rec.get('child');
            this.selectedAssyUid = rec.get('unique_uid');
            this.assy_uid = rec.get('parent');
            this.reserved_varchar1 = rec.get('item_code');
            this.selectedAssyName = rec.get('assy_name');
            this.selectedPjUid = rec.get('ac_uid');
            this.selectedPjCode = rec.get('pj_code');
            this.refer_uid = rec.get('refer_uid') == undefined || rec.get('refer_uid') == null ? -1 : rec.get('refer_uid');

            this.selectedProduct = rec.get('reserved_integer2');    //제품


            this.routeTitlename = rec.get('part_folder'); //'[' + rec.get('pl_no') + '] ' + rec.get('assy_name');
            this.depth = rec.get('depth');
            this.selectAssy();

            var parent = rec.get('unique_id_long');

            if (this.refer_uid != undefined && this.refer_uid != null && this.refer_uid > 1) {
                this.store.getProxy().setExtraParam('parent', null);
                this.store.getProxy().setExtraParam('parent_uid', this.refer_uid);
                this.store.getProxy().setExtraParam('refer_uid', this.refer_uid);
            } else {
                this.store.getProxy().setExtraParam('refer_uid', null);
                this.store.getProxy().setExtraParam('parent', this.selectedChild);
                this.store.getProxy().setExtraParam('parent_uid', this.selectedAssyUid);
            }

            this.store.getProxy().setExtraParam('orderBy', "reserved_integer3");
            this.store.getProxy().setExtraParam('ascDesc', "ASC");
            this.store.getProxy().setExtraParam('ac_uid', this.selectedPjUid);

            this.store.getProxy().setExtraParam('prdplan_uid', rec.get('unique_id_long'));
            this.store.getProxy().setExtraParam('reserved_integer4', 1);
            this.store.getProxy().setExtraParam('is_new', 'Y');

            pl_no = rec.get('pl_no');

            this.store.load(function (records) {

                var max_num = 0
                //var total_price = 0.0;

                for (var i = 0; i < records.length; i++) {

                    var reserved_integer3 = records[i].get('reserved_integer3');

                    if (max_num < reserved_integer3) {
                        max_num = reserved_integer3;
                    }
                }
                gm.me().mNum = max_num + 1;
            });
        }


    },

    editRedord: function (field, rec) {

        switch (field) {
            case 'req_info':
                this.updateDesinComment(rec);
                break;
            case 'reserved_varchar1':
                this.updateDesinComment(rec);
                break;
            case 'reserved_integer1':
                this.updateDesinComment(rec);
                break;
            case 'bm_quan':
                this.updateDesinComment(rec);
                break;
            case 'pl_no':
                this.updateDesinComment(rec);
                break;
        }
    },
    updateDesinComment: function (rec) {
        var unique_uid = rec.get('unique_uid');
        var req_info = rec.get('req_info');
        var reserved_varchar1 = rec.get('reserved_varchar1');
        var reserved_integer1 = rec.get('reserved_integer1');
        var bm_quan = rec.get('bm_quan');
        var pl_no = rec.get('pl_no');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
            params: {
                id: unique_uid,
                req_info: req_info,
                reserved_varchar1: reserved_varchar1,
                reserved_integer1: reserved_integer1,
                bm_quan: bm_quan,
                pl_no: pl_no
            },
            success: function (result, request) {

                var result = result.responseText;

            },
            failure: extjsUtil.failureMessage
        });
    },

    contextMenuCart: Ext.create('Ext.menu.Menu', {
        items: [/* addElecAction, editAction, */ this.removeCartAction]
    }),

    copiedPartCnt: 0,

    onAssemblyGridSelection: function (selections) {

        if (selections != null && selections.length > 0) {
            var rec = selections[0];
            console.log('Selected ASSY : ', rec);
            gu.enable(gm.me().addAssyAction);
            gu.enable(gm.me().editAssyAction);

            gm.me().selectTreeGrid(rec);

        }
    },
    reSelect: function () {
        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'productcombo-DBM7_TREE', 'child', true);
        //this.selectProjectCombo(this.selected_tree_record);
    },
    copyAssemblyAction: Ext.create('Ext.Action', {
        iconCls: 'af-copy',
        text: '복사',
        disabled: true,
        handler: function (widget, event) {
            var selectedTreeRecord = gm.me().selected_tree_record;
            if (selectedTreeRecord != null) {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=copyBomAssembly',
                    params: {
                        id: selectedTreeRecord.get('child'),
                        parent: selectedTreeRecord.get('parent'),
                        unique_uid: selectedTreeRecord.get('unique_uid'),
                        ac_uid: selectedTreeRecord.get('ac_uid'),
                        assy_code: selectedTreeRecord.get('assy_code'),
                        pl_no: selectedTreeRecord.get('pl_no'),
                        bm_quan: selectedTreeRecord.get('bm_quan'),
                        part_folder: selectedTreeRecord.get('part_folder'),
                        part_path: selectedTreeRecord.get('part_path'),
                        pj_code: selectedTreeRecord.get('pj_code')
                    },
                    success: function (result, request) {

                        gm.me().setCopiedAssyQuan(/*result.responseText*/);

                        var assyline = gm.me().selected_tree_record;
                        var type = (assyline.get('depth') > 1) ? 'Assembly' : '프로젝트';

                        gm.me().showToast('결과', result.responseText + ' ' + type + '가 복사되었습니다.');

                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax
            }

        }
    }),
    addPcsPlanAction: Ext.create('Ext.Action', {
        iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        text: '공정 설계',
        tooltip: '',
        disabled: true,

        handler: function () {


        }
    }),

    removePartAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        hidden: gu.setCustomBtnHiddenProp('removePartAction'),
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        hidden: gu.setCustomBtnHiddenProp('addPartAction'),
        handler: function (widget, event) {

            var records = gm.me().store.data.items;

            var max_num = 0;

            for (var i = 0; i < records.length; i++) {

                var reserved_integer3 = records[i].get('reserved_integer3');

                if (max_num < reserved_integer3) {
                    max_num = reserved_integer3;
                }
            }

            gm.me().mNum = max_num + 1;

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return;
                });
                return;
            }
            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var top_pl_no = gm.me().selected_tree_record.get('pl_no');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno2',
                params: {
                    ac_uid: gm.me().selectedPjUid,
                    assybom: 'Y', //Y면 AssemblyBom N이나 널이면 ProjectBOM,
                    assymap_uid: unique_uid
                },
                success: function (result, request) {

                    var str = result.responseText;
                    switch (top_pl_no) {
                        case '---':
                            top_pl_no = '';
                            break;
                        case '':
                            top_pl_no = '';
                            break;
                        default:
                            top_pl_no = top_pl_no + '-';
                    }
                    var pl_no = top_pl_no + str;


                    var bHeight = 750;
                    var bWidth = 700;

                    var refer_uid = gm.me().selected_tree_record.get('refer_uid');

                    gm.me().searchStore.removeAll();

                    this.itemSearchAction = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: CMD_SEARCH/*'검색'*/,
                        tooltip: CMD_SEARCH/*'검색'*/,
                        disabled: false,
                        handler: function () {
                            var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                            if (Object.keys(extraParams).length == 0) {
                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                            } else {
                                gm.me().searchStore.load();
                            }
                        }
                    });

                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().searchStore,
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        height: 200,
                        padding: '0 0 5 0',
                        flex: 1,
                        layout: 'fit',
                        forceFit: false,
                        listeners: {
                            select: function (selModel, record, index, options) {
                                gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                                gu.getCmp('item_code').setValue(record.get('item_code'));
                                gu.getCmp('item_name').setValue(record.get('item_name'));
                                gu.getCmp('specification').setValue(record.get('specification'));
                                gu.getCmp('maker_name').setValue(record.get('maker_name'));
                                gu.getCmp('unit_code').setValue(record.get('unit_code'));
                                //gu.getCmp('sales_price').setValue(record.get('sales_price'));
                                gu.getCmp('currency').setValue(record.get('currency'));
                                gu.getCmp('standard_flag').setValue(record.get('standard_flag'));
                            }
                        },
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                style: 'background-color: #EFEFEF;',
                                items: [
                                    {
                                        field_id: 'search_item_code',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_code_part'),
                                        name: 'search_item_code',
                                        margin: '3 3 3 3',
                                        xtype: 'triggerfield',
                                        emptyText: '품번',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');

                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_code;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_item_name',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_name_part'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: '품명',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_name;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_specification',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_specification_part'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: '규격',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.specification;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    '->',
                                    this.itemSearchAction
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: '품번',
                                width: 120,
                                dataIndex: 'item_code'
                            },
                            {
                                text: '품명',
                                width: 270,
                                dataIndex: 'item_name',
                                renderer: function (value) {
                                    return value.replace(/</gi, "&lt;");
                                }
                            },
                            {
                                text: '규격',
                                width: 270,
                                dataIndex: 'specification'
                            }
                        ]
                    });

                    var ynStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'YN'});
                    var prodStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PROCESS_TYPE'});

                    gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: bWidth,
                        height: bHeight,
                        bodyPadding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            this.gridViewTable,
                            new Ext.form.Hidden({
                                name: 'parent',
                                value: gm.me().selectedChild
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: gm.me().selectedPjUid
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_code'),
                                name: 'pj_code',
                                value: gm.me().selectedPjCode
                            }),
                            new Ext.form.Hidden({
                                id: 'assy_code',
                                name: 'assy_code',
                                value: gm.me().selectedAssyCode
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('standard_flag'),
                                name: 'standard_flag'
                            }),
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                readOnly: true,
                                hidden: true,
                                width: 300,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_code',
                                id: gu.id('item_code'),
                                fieldLabel: '품번',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_name',
                                id: gu.id('item_name'),
                                fieldLabel: '품명',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '규격',
                                id: gu.id('specification'),
                                name: 'specification',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('maker_name'),
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                name: 'reserved_integer3',
                                id: gu.id('reserved_integer3'),
                                fieldLabel: '순번',
                                allowBlank: false
                            },
                            {
                                xtype: 'numberfield',
                                minValue: 0,
                                width: '100%',
                                id: gu.id('bm_quan'),
                                name: 'bm_quan',
                                fieldLabel: gm.me().getColName('bm_quan'),
                                decimalPrecision: 5,
                                allowBlank: true,
                                value: '1',
                                margins: '0'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: gm.me().getColName('unit_code'),
                                id: gu.id('unit_code'),
                                name: 'unit_code',
                                allowBlank: true
                            }, /*{
                             xtype: 'numberfield',
                             width: '100%',
                             id: gu.id('sales_price'),
                             name: 'sales_price',
                             decimalPrecision: 5,
                             fieldLabel: gm.me().getColName('sales_price'),
                             allowBlank: true,
                             value: '0',
                             margins: '0'
                             }, */{
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '통화',
                                id: gu.id('currency'),
                                name: 'currency',
                                allowBlank: true
                            }, {
                                fieldLabel: 'Level',
                                xtype: 'textfield',
                                hidden: true,
                                width: '100%',
                                emptyText: 'Level',
                                name: 'reserved_integer1',
                                // value: reserved_integer1 + 1,
                                value: 1
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '단위',
                                emptyText: '단위',
                                name: 'unit_code',
                                id: gu.id('unit_code'),
                                width: '100%',
                                value: 'EA'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '위치',
                                name: 'reserved_varchar2',
                            }, {
                                fieldLabel: '사용공정',
                                xtype: 'combo',
                                width: '100%',
                                name: 'reserved6',
                                displayField: 'code_name_kr',
                                store: prodStore,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                valueField: 'system_code',
                                typeAhead: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div>[{system_code}] {code_name_kr}</div>';
                                    }
                                }
                            }, {
                                fieldLabel: 'LOT추적여부',
                                xtype: 'combo',
                                width: '100%',
                                name: 'reserved7',
                                displayField: 'code_name_kr',
                                store: ynStore,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                valueField: 'system_code',
                                typeAhead: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div>{code_name_kr}</div>';
                                    }
                                },
                                margin: '0 0 70 0'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('parent'),
                                name: 'parent',
                                emptyText: '제품 UID',
                                value: gm.me().selectedChild,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('unique_uid'),
                                name: 'unique_uid',
                                emptyText: 'BOM UID',
                                value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: 'AssyTopUID',
                                xtype: 'textfield',
                                name: 'reserved_integer2',
                                value: reserved_integer2,
                                emptyText: '제품ASSY_UID',
                                readOnly: true,
                                hidden: true,
                                width: '100%',
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                emptyText: '순번',
                                hidden: true,
                                name: 'pl_no',
                                id: gu.id('pl_no'),
                                fieldLabel: '순번',
                                value: pl_no
                            },
                            {
                                xtype: 'button',
                                text: '초기화',
                                scale: 'small',
                                width: 50,
                                maxWidth: 80,
                                style: {
                                    marginTop: '7px',
                                    marginLeft: '550px'
                                },
                                // size:50,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                listeners: {
                                    click: function () {
                                        gm.me().resetPartForm();
                                    }
                                }

                            }, {
                                xtype: 'container',
                                type: 'hbox',
                                padding: '5',
                                pack: 'end',
                                align: 'left',
                                defaults: {},
                                margin: '0 0 0 0',
                                border: false

                            }
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '품목 추가',
                        width: bWidth,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        items: [gm.me().createPartForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().createPartForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var refer_uid = gm.me().selected_tree_record.get('refer_uid');
                                    if (refer_uid > -1) {
                                        Ext.MessageBox.show({
                                            title: '경고',
                                            msg: '참조된 Assy입니다.',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function (result) {
                                                if (result == 'yes') {

                                                    gm.me().registPartFc(val);

                                                    if (winPart) {
                                                        winPart.close();
                                                    }
                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });

                                    } else {

                                        gm.me().registPartFc(val);

                                        if (winPart) {
                                            winPart.close();
                                        }
                                    }

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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
            });


        },
        failure: extjsUtil.failureMessage
    }),

    copyPartAction: Ext.create('Ext.Action', {
        iconCls: 'af-copy',
        text: '복사',
        disabled: true,
        handler: function (widget, event) {
            var grid = gm.me().grid;
            // make uidlist
            var uidList = [];
            var selections = grid.getSelectionModel().getSelection();
            if (selections) {
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var standard_flag = rec.get('standard_flag');
                    if (standard_flag != 'A') {//파트복사는 Assembly 제외
                        uidList.push(rec.get('unique_uid'));
                    }
                }
            }

            if (uidList.length > 0) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=copyBomPart',
                    params: {
                        uidList: uidList
                    },
                    success: function (result, request) {

                        gm.me().setCopiedPartQuan(Number(result.responseText));
                        gm.me().showToast('결과', result.responseText + '개 자재가 복사되었습니다. ASSY는 복사되지 않습니다.');

                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax
            } else {
                Ext.MessageBox.alert('알림', '선택한 항목에 자재가 존재하지 않습니다. <br>Assembly 복사를 활용하세요.');
            }


        }
    }),

    editPartAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: 'Part 수정하기',
        disabled: true,
        hidden: gu.setCustomBtnHiddenProp('editPartAction'),
        handler: function (widget, event) {

            var rec = gm.me().grid.getSelectionModel().getSelection()[0];

            var standardFlag = rec.get('standard_flag');

            // if (standardFlag === 'A') {
            //     Ext.Msg.alert('', 'ASSY는 삭제만 가능합니다.');
            //     return null;
            // }

            var bomUid = rec.getId();
            var child = rec.get('unique_id_long');
            var bmQuan = rec.get('bm_quan');
            var itemCode = rec.get('item_code');
            var itemName = rec.get('item_name');
            var specification = rec.get('specification');
            var unitCode = rec.get('unit_code');
            var currency = rec.get('currency');
            var makerName = rec.get('maker_name');
            var reservedVarchar2 = rec.get('reserved_varchar2');
            var reservedInteger3 = rec.get('reserved_integer3');
            var salesPrice = rec.get('sales_price');
            var pl_no = rec.get('pl_no');

            if (salesPrice == null || salesPrice === '') {
                salesPrice = 0;
            }

            var records = gm.me().store.data.items;
            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            // var top_pl_no = gm.me().selected_tree_record.get('pl_no');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            var reserved6 = rec.get('reserved6');
            var reserved7 = rec.get('reserved7');

            var standard_flag = gm.me().selected_tree_record.get('standard_flag');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno2',
                params: {
                    ac_uid: gm.me().selectedPjUid,
                    assybom: 'Y', //Y면 AssemblyBom N이나 널이면 ProjectBOM,
                    assymap_uid: unique_uid
                },
                success: function (result, request) {

                    var str = result.responseText;
                    // switch (top_pl_no) {
                    //     case '---':
                    //         top_pl_no = '';
                    //         break;
                    //     case '':
                    //         top_pl_no = '';
                    //         break;
                    //     default:
                    //         top_pl_no = top_pl_no + '-';
                    // }
                    // var pl_no = top_pl_no + str;

                    var bHeight = 750;
                    var bWidth = 700;

                    var refer_uid = gm.me().selected_tree_record.get('refer_uid');

                    gm.me().searchStore.removeAll();

                    this.itemSearchAction = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: CMD_SEARCH/*'검색'*/,
                        tooltip: CMD_SEARCH/*'검색'*/,
                        disabled: false,
                        handler: function () {
                            var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                            if (Object.keys(extraParams).length == 0) {
                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                            } else {
                                gm.me().searchStore.load();
                            }
                        }
                    });

                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().searchStore,
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        height: 200,
                        padding: '0 0 5 0',
                        flex: 1,
                        layout: 'fit',
                        forceFit: false,
                        listeners: {
                            select: function (selModel, record, index, options) {
                                gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                                gu.getCmp('item_code').setValue(record.get('item_code'));
                                gu.getCmp('item_name').setValue(record.get('item_name'));
                                gu.getCmp('specification').setValue(record.get('specification'));
                                gu.getCmp('maker_name').setValue(record.get('maker_name'));
                                gu.getCmp('unit_code').setValue(record.get('unit_code'));
                                //gu.getCmp('sales_price').setValue(record.get('sales_price'));
                                gu.getCmp('currency').setValue(record.get('currency'));
                                gu.getCmp('standard_flag').setValue(record.get('standard_flag'));
                            }
                        },
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                style: 'background-color: #EFEFEF;',
                                items: [
                                    {
                                        field_id: 'search_item_code',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_code_part'),
                                        name: 'search_item_code',
                                        margin: '3 3 3 3',
                                        xtype: 'triggerfield',
                                        emptyText: '품번',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');

                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_code;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_item_name',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_name_part'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: '품명',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_name;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_specification',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_specification_part'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: '규격',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.specification;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    '->',
                                    this.itemSearchAction
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: '품번',
                                width: 120,
                                dataIndex: 'item_code'
                            },
                            {
                                text: '품명',
                                width: 270,
                                dataIndex: 'item_name',
                                renderer: function (value) {
                                    return value.replace(/</gi, "&lt;");
                                }
                            },
                            {
                                text: '규격',
                                width: 270,
                                dataIndex: 'specification'
                            }
                        ]
                    });

                    var ynStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'YN'});
                    var prodStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PROCESS_TYPE'});

                    gm.me().editPartForm = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: bWidth,
                        height: bHeight,
                        bodyPadding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            this.gridViewTable,
                            new Ext.form.Hidden({
                                name: 'parent',
                                value: gm.me().selectedChild
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: gm.me().selectedPjUid
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_code'),
                                name: 'pj_code',
                                value: gm.me().selectedPjCode
                            }),
                            new Ext.form.Hidden({
                                id: 'assy_code',
                                name: 'assy_code',
                                value: gm.me().selectedAssyCode
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('standard_flag'),
                                name: 'standard_flag',
                                value: standard_flag
                            }),
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                readOnly: true,
                                hidden: true,
                                width: 300,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: child
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_code',
                                id: gu.id('item_code'),
                                fieldLabel: '품번',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: itemCode
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_name',
                                id: gu.id('item_name'),
                                fieldLabel: '품명',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: itemName
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '규격',
                                id: gu.id('specification'),
                                name: 'specification',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: specification
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('maker_name'),
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: makerName
                            },
                            {
                                xtype: 'textfield',
                                name: 'reserved_integer3',
                                id: gu.id('reserved_integer3'),
                                fieldLabel: '순번',
                                allowBlank: false,
                                value: reservedInteger3
                            },
                            {
                                xtype: 'numberfield',
                                minValue: 0,
                                width: '100%',
                                id: gu.id('bm_quan'),
                                name: 'bm_quan',
                                decimalPrecision: 5,
                                fieldLabel: gm.me().getColName('bm_quan'),
                                allowBlank: true,
                                value: bmQuan,
                                margins: '0'
                            }, /*{
                             xtype: 'numberfield',
                             width: '100%',
                             id: gu.id('sales_price'),
                             name: 'sales_price',
                             decimalPrecision : 5,
                             fieldLabel: gm.me().getColName('sales_price'),
                             allowBlank: true,
                             value: salesPrice,
                             margins: '0'
                             },*/ {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '통화',
                                id: gu.id('currency'),
                                name: 'currency',
                                allowBlank: true,
                                value: currency
                            }, {
                                fieldLabel: 'Level',
                                xtype: 'textfield',
                                hidden: true,
                                width: '100%',
                                emptyText: 'Level',
                                name: 'reserved_integer1',
                                value: reserved_integer1 + 1,
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '단위',
                                name: 'unit_code',
                                id: gu.id('unit_code'),
                                width: '100%',
                                value: unitCode
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '위치',
                                name: 'reserved_varchar2',
                                value: reservedVarchar2
                            }, {
                                fieldLabel: '사용공정',
                                xtype: 'combo',
                                width: '100%',
                                name: 'reserved6',
                                displayField: 'code_name_kr',
                                store: prodStore,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                valueField: 'system_code',
                                value: reserved6,
                                typeAhead: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div>[{system_code}] {code_name_kr}</div>';
                                    }
                                }
                            }, {
                                fieldLabel: 'LOT추적여부',
                                xtype: 'combo',
                                width: '100%',
                                name: 'reserved7',
                                displayField: 'code_name_kr',
                                store: ynStore,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                valueField: 'system_code',
                                value: reserved7,
                                typeAhead: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div>{code_name_kr}</div>';
                                    }
                                },
                                margin: '0 0 70 0'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('parent'),
                                name: 'parent',
                                emptyText: '제품 UID',
                                value: gm.me().selectedChild,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('unique_uid'),
                                name: 'unique_uid',
                                emptyText: 'BOM UID',
                                value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: 'AssyTopUID',
                                xtype: 'textfield',
                                name: 'reserved_integer2',
                                value: reserved_integer2,
                                emptyText: '제품ASSY_UID',
                                readOnly: true,
                                hidden: true,
                                width: '100%',
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                emptyText: '순번',
                                hidden: true,
                                name: 'pl_no',
                                id: gu.id('pl_no'),
                                fieldLabel: '순번',
                                value: pl_no
                            }, {
                                xtype: 'container',
                                type: 'hbox',
                                padding: '5',
                                pack: 'end',
                                align: 'left',
                                defaults: {},
                                margin: '0 0 0 0',
                                border: false
                            }
                        ]
                    });


                    ynStore.load();
                    prodStore.load();


                    var winPart = Ext.create('ModalWindow', {
                        title: '품목 수정',
                        width: bWidth,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        items: [gm.me().editPartForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().editPartForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    var selectedSF = gu.getCmp('standard_flag').getValue();

                                    var editedItemCode = gu.getCmp('item_code').getValue();

                                    var isEqualItemCode = itemCode === editedItemCode;

                                    // 대상이 어셈블리거나 기존이 어셈블리인경우;;;
                                    if ((standardFlag === 'A' || selectedSF === 'A') && !isEqualItemCode) {
                                        // 어셈블리는 지우고 생성
                                        gm.me().deleteConfirm('yes');
                                        gm.me().registPartFc(val);
                                        // Ext.MessageBox.alert('알림', '현재 Assembly 추가 기능 개선 중입니다.');
                                        // if (winPart) {
                                        //     winPart.close();
                                        // }
                                    } else {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
                                            params: {
                                                unique_id: bomUid,
                                                reserved_integer3: val['reserved_integer3'],
                                                bmQuan: val['bm_quan'],
                                                item_code: val['item_code'],
                                                child: val['unique_id'],
                                                reserved_varchar2: val['reserved_varchar2'],
                                                reserved6: val['reserved6'],
                                                reserved7: val['reserved7'],
                                                pr_uid: gm.me().selected_tree_record.get('unique_id_long')
                                            },
                                            success: function (result, request) {
                                                gm.me().store.load();
                                                if (winPart) {
                                                    winPart.close();
                                                }
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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
            });


        },
        failure: extjsUtil.failureMessage
    }),

    removeAssyAction: Ext.create('Ext.Action', {
        itemId: 'removeAssyAction',
        iconCls: 'af-remove',
        text: CMD_DELETE,
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: delete_msg_title,
                msg: delete_msg_content,
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteAssyConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    editAssyAction: Ext.create('Ext.Action', {
        itemId: 'editAssyAction',
        iconCls: 'af-edit',
        disabled: true,
        text: gm.getMC('CMD_MODIFY', '수정'),
        handler: function (widget, event) {

            if (gm.me().selected_tree_record == null) {
                return;
            }
            var unique_id = gm.me().selected_tree_record.get('child');
            var assy_code = gm.me().selected_tree_record.get('assy_code');
            var assy_name = gm.me().selected_tree_record.get('assy_name');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var parent = gm.me().selected_tree_record.get('parent');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var pl_no = gm.me().selected_tree_record.get('pl_no');
            var bm_quan = gm.me().selected_tree_record.get('bm_quan');
            var lineGap = 30;
            var bHeight = 300;


            var inputItem = [];
            inputItem.push({
                xtype: 'textfield',
                name: 'unique_uid',
                fieldLabel: 'Unique UID',
                allowBlank: false,
                value: unique_uid,
                anchor: '-5',
                readOnly: true,
                fieldStyle: 'background-color: #ddd; background-image: none;'
            });
            inputItem.push({
                xtype: 'textfield',
                name: 'unique_id',
                fieldLabel: 'Child UID',
                allowBlank: false,
                value: unique_id,
                anchor: '-5',
                readOnly: true,
                fieldStyle: 'background-color: #ddd; background-image: none;'
            });
            inputItem.push({
                xtype: 'textfield',
                name: 'pl_no',
                fieldLabel: '파트순번',
                allowBlank: false,
                value: pl_no,
                anchor: '-5'
            });
            inputItem.push({
                xtype: 'numberfield',
                name: 'bm_quan',
                fieldLabel: '수량',
                allowBlank: false,
                decimalPrecision: 5,
                value: bm_quan,
                anchor: '-5'
            });
            inputItem.push({
                xtype: 'textfield',
                name: 'assy_name',
                fieldLabel: 'Assembly 명',
                allowBlank: false,
                value: assy_name,
                anchor: '-5'
            });

            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('modformPanel'),
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                defaults: {
                    // anchor: '100%',
                    editable: true,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: inputItem
            });

            var win = Ext.create('ModalWindow', {
                title: 'Assy 수정',
                width: 400,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gu.getCmp('modformPanel').getForm();
                        if (form.isValid()) {
                            var val = form.getValues(false);


                            var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                            gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                            gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                            gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                            gm.me().selected_tree_record.set('text', text);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=updateSrcahdAssymap',
                                params: {

                                    unique_uid: val['unique_uid'],
                                    unique_id: val['unique_id'],
                                    pl_no: val['pl_no'],
                                    bm_quan: val['bm_quan'],
                                    item_name: val['assy_name']

                                },
                                success: function (result, request) {

                                    // productlist.store.getProxy().setExtraParam('class_code',
                                    // gm.me().classCode);
                                    // productlist.store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                            if (win) {
                                win.close();
                            }
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                        }

                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show(/* this, function(){} */);
        } // endofhandler
    }),

    addAssyAction: Ext.create('Ext.Action', {
        itemId: 'addAssyAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }
            var child = gm.me().selected_tree_record.get('child');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var top_pl_no = gm.me().selected_tree_record.get('pl_no');
            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno2',
                params: {
                    ac_uid: gm.me().selectedPjUid,
                    assybom: 'Y', //Y면 AssemblyBom N이나 널이면 ProjectBOM,
                    assymap_uid: unique_uid
                },
                success: function (result, request) {

                    var str = result.responseText;
                    switch (top_pl_no) {
                        case '---':
                            top_pl_no = '';
                            break;
                        case '':
                            top_pl_no = '';
                            break;
                        default:
                            top_pl_no = top_pl_no + '-';
                    }
                    var pl_no = top_pl_no + str;

                    var lineGap = 30;
                    var bHeight = 350;

                    var inputItem = [];

                    inputItem.push({
                        xtype: 'textfield',
                        name: 'child',
                        fieldLabel: '모 UID',
                        allowBlank: false,
                        value: child,
                        anchor: '-5',
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    });

                    inputItem.push(new Ext.form.Hidden({
                        name: 'srcahd_uid',
                        id: gu.id('srcahd_uid')
                    }));

                    inputItem.push({
                            id: gu.id('productcombo-DBM7_AST'),
                            xtype: 'combo',
                            name: 'combo_item_code',
                            fieldLabel: '자재코드로 검색',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            emptyText: 'ASSY를 검색하세요.',
                            displayField: 'item_name',
                            valueField: 'unique_id',
                            store: Ext.create('Rfx2.store.company.bioprotech.AssyStore', {}),
                            sortInfo: {field: 'specification', direction: 'ASC'},
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: true,
                            anchor: '-5',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforequery: function (queryEvent) {
                                    gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('item_code',
                                        '%' + gu.getCmp('productcombo-DBM7_AST').getValue() + '%');
                                },
                                select: function (combo, record) {

                                    var srcahd_uid = gu.getCmp('productcombo-DBM7_AST').getValue();
                                    var srcahd_uid2 = gu.getCmp('srcahd_uid');
                                    srcahd_uid2.setValue(srcahd_uid);

                                    var item_code = gu.getCmp('DBM7_TREE_item_code');
                                    var item_code2 = record.get('item_code');
                                    item_code.setValue(item_code2);

                                    var item_name = gu.getCmp('DBM7_TREE_assy_name');
                                    var item_name2 = record.get('item_name');
                                    item_name.setValue(item_name2);

                                    var specification = gu.getCmp('DBM7_TREE_specification');
                                    var specification2 = record.get('specification');
                                    specification.setValue(specification2);
                                },
                                pageSize: 10
                            }
                        }
                    );

                    inputItem.push({
                        id: gu.id('productcombo-DBM7_AST2'),
                        xtype: 'combo',
                        name: 'combo_item_name',
                        fieldLabel: '자재명으로 검색',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        mode: 'local',
                        editable: true,
                        allowBlank: true,
                        queryMode: 'remote',
                        emptyText: 'ASSY를 검색하세요.',
                        displayField: 'item_name',
                        valueField: 'unique_id',
                        store: Ext.create('Rfx2.store.company.bioprotech.AssyStore', {}),
                        sortInfo: {field: 'specification', direction: 'ASC'},
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: false,
                        hideTrigger: true,
                        anchor: '-5',
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                            }
                        },
                        pageSize: 25,
                        triggerAction: 'all',
                        listeners: {
                            beforequery: function (queryEvent) {
                                gu.getCmp('productcombo-DBM7_AST2').store.getProxy().setExtraParam('item_name',
                                    '%' + gu.getCmp('productcombo-DBM7_AST2').getValue() + '%');
                            },
                            select: function (combo, record) {

                                var srcahd_uid = gu.getCmp('productcombo-DBM7_AST2').getValue();
                                var srcahd_uid2 = gu.getCmp('srcahd_uid');
                                srcahd_uid2.setValue(srcahd_uid);

                                var item_code = gu.getCmp('DBM7_TREE_item_code');
                                var item_code2 = record.get('item_code');
                                item_code.setValue(item_code2);

                                var item_name = gu.getCmp('DBM7_TREE_assy_name');
                                var item_name2 = record.get('item_name');
                                item_name.setValue(item_name2);

                                var specification = gu.getCmp('DBM7_TREE_specification');
                                var specification2 = record.get('specification');
                                specification.setValue(specification2);
                            },
                            pageSize: 10
                        }
                    });

                    inputItem.push({
                        id: gu.id('productcombo-DBM7_AST3'),
                        xtype: 'combo',
                        name: 'combo_specification',
                        fieldLabel: '규격으로 검색',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        mode: 'local',
                        editable: true,
                        allowBlank: true,
                        queryMode: 'remote',
                        emptyText: 'ASSY를 검색하세요.',
                        displayField: 'item_name',
                        valueField: 'unique_id',
                        store: Ext.create('Rfx2.store.company.bioprotech.AssyStore', {}),
                        sortInfo: {field: 'specification', direction: 'ASC'},
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: false,
                        hideTrigger: true,
                        anchor: '-5',
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                            }
                        },
                        pageSize: 25,
                        triggerAction: 'all',
                        listeners: {
                            beforequery: function (queryEvent) {
                                gu.getCmp('productcombo-DBM7_AST3').store.getProxy().setExtraParam('specification',
                                    '%' + gu.getCmp('productcombo-DBM7_AST3').getValue() + '%');
                            },
                            select: function (combo, record) {

                                var srcahd_uid = gu.getCmp('productcombo-DBM7_AST3').getValue();
                                var srcahd_uid2 = gu.getCmp('srcahd_uid');
                                srcahd_uid2.setValue(srcahd_uid);

                                var item_code = gu.getCmp('DBM7_TREE_item_code');
                                var item_code2 = record.get('item_code');
                                item_code.setValue(item_code2);

                                var item_name = gu.getCmp('DBM7_TREE_assy_name');
                                var item_name2 = record.get('item_name');
                                item_name.setValue(item_name2);

                                var specification = gu.getCmp('DBM7_TREE_specification');
                                var specification2 = record.get('specification');
                                specification.setValue(specification2);
                            },
                            pageSize: 10
                        }
                    });

                    inputItem.push({
                        xtype: 'textfield',
                        name: 'item_code',
                        id: gu.id('DBM7_TREE_item_code'),
                        fieldLabel: '품목 코드',
                        allowBlank: false,
                        readOnly: true,
                        fieldStyle: 'text-align: right;',
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'textfield',
                        name: 'pl_no',
                        fieldLabel: 'ID',
                        value: pl_no,
                        allowBlank: false,
                        fieldStyle: 'text-align: right;',
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'textfield',
                        id: gu.id('DBM7_TREE_assy_name'),
                        name: 'assy_name',
                        fieldLabel: '품명',
                        allowBlank: false,
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'textfield',
                        name: 'specification',
                        id: gu.id('DBM7_TREE_specification'),
                        fieldLabel: '규격',
                        readOnly: true,
                        allowBlank: true,
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'numberfield',
                        name: 'bm_quan',
                        fieldLabel: '수량',
                        decimalPrecision: 5,
                        allowBlank: false,
                        value: 1,
                        anchor: '-5'
                    });

                    inputItem.push(new Ext.form.Hidden({
                        name: 'unique_uid',
                        value: unique_uid
                    }));

                    inputItem.push(new Ext.form.Hidden({
                        name: 'reserved_integer1',
                        value: reserved_integer1 + 1
                    }));

                    inputItem.push(new Ext.form.Hidden({
                        name: 'reserved_integer2',
                        value: reserved_integer2
                    }));

                    inputItem.push(new Ext.form.Hidden({
                        name: 'unique_uid',
                        value: unique_uid
                    }));

                    gm.me().createAsyForm = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        width: 625,
                        height: bHeight,
                        defaults: {
                            editable: true,
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: inputItem
                    });
                    var win = Ext.create('ModalWindow', {
                        title: 'Assy 추가',
                        width: 625,
                        height: bHeight,
                        minWidth: 625,
                        minHeight: 180,
                        items: gm.me().createAsyForm,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().createAsyForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    gm.me().setLoading(true);

                                    var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                                    gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                                    gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                                    gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                                    gm.me().selected_tree_record.set('text', text);

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/design/bom.do?method=cloudAssyCreateAndCopyBom',
                                        params: {
                                            parent_uid: gm.me().selectedAssyTopUid,
                                            parent: gm.me().selectedAssyTop.get('srcahd_uid'),
                                            ac_uid: gm.me().selected_tree_record.get('ac_uid'),
                                            pl_no: val['pl_no'],
                                            bm_quan: val['bm_quan'],
                                            child: val['srcahd_uid'],
                                            item_name: val['assy_name'],
                                            level: val['reserved_integer1'],
                                            assytopUid: gm.me().selectedAssyTopUid,
                                            pr_uid: gm.me().selected_tree_record.get('unique_id_long')
                                        },
                                        success: function (result, request) {
                                            gm.me().setLoading(false);
                                            gm.me().reSelect();
                                            gu.getCmp('DBM7TREE-Assembly').store.load();
                                        },
                                        failure: function () {
                                            gm.me().setLoading(false);
                                            gu.getCmp('DBM7TREE-Assembly').store.load();
                                            extjsUtil.failureMessage;
                                        }
                                    });

                                    if (win) {
                                        win.close();
                                    }
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }

                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (win) {
                                    win.close();
                                }
                            }
                        }]
                    });
                    win.show(/* this, function(){} */);
                } // endofhandler
            });


        },
        failure: extjsUtil.failureMessage
    }),

    syncMbomAction: Ext.create('Ext.Action', {
        iconCls: 'af-copy',
        text: 'MBOM 동기화',
        tooltip: 'Synchronize MBOM with the latest EBOM',
        disabled: true,
        hidden: gu.setCustomBtnHiddenProp('syncMbomAction'),
        handler: function (widget, event) {
            if (gm.me().selected_tree_record === null) {
                Ext.MessageBox.alert('알림', '선택한 생산작업이 없습니다.');
                return;
            }
            Ext.MessageBox.show({
                title: 'MBOM 동기화',
                msg: '선택한 작업의 MBOM을 EBOM과 동기화 하시겠습니까?<br>이전에 수정된 MBOM은 저장되지 않습니다.',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function () {
                    gm.me().setLoading(true);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=synchronizeMbom',
                        params: {
                            rtgastUidOp: gm.me().selected_tree_record.get('unique_id_long'),
                            acUid: gm.me().selected_tree_record.get('ac_uid'),
                            srcahdUid: gm.me().selected_tree_record.get('child'),
                            itemQuan: gm.me().selected_tree_record.get('item_quan'),
                        },
                        success: function (result, request) {
                            gm.me().setLoading(false);
                            var responseText = Ext.util.JSON.decode(result.responseText);
                            // console.log('결과 : ', responseText.datas);
                            var resultMessage = '';
                            switch (responseText.datas) {
                                case 'U':
                                    resultMessage = '동기화 완료되었습니다.'
                                    break;
                                case 'L':
                                    resultMessage = '이미 최신 버전입니다.'
                                    break;
                                case 'E':
                                    resultMessage = '설계BOM이 비어있습니다.'
                                    break;
                            }
                            Ext.MessageBox.alert('결과', resultMessage);
                            gm.me().store.load();
                        }, // endof success for ajax
                        failure: function () {
                            gm.me().setLoading(false);
                            extjsUtil.failureMessage
                        }
                    }); // endof Ajax
                },
            });
        }
    }),

    // Context Popup Menu
    assyContextMenu: Ext.create('Ext.menu.Menu', {
        items: [
            this.editAssyAction,
            this.removeAssyAction,
            this.copyAssemblyAction
        ]
    }),

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {}),

    productStore: Ext.create('Mplm.store.ProductStore', {}),

    commonUnitStore: Ext.create('Mplm.store.CommonUnitStore2', {
        hasNull: false
    }),
    commonCurrencyStore: Ext.create('Mplm.store.CommonCurrencyStore', {
        hasNull: false
    }),
    commonModelStore: Ext.create('Mplm.store.CommonModelStore', {
        hasNull: false
    }),
    commonDescriptionStore: Ext.create('Mplm.store.CommonDescriptionStore', {
        hasNull: false
    }),
    commonStandardStore2: Ext.create('Mplm.store.CommonStandardStore', {
        hasNull: false
    }),
    gubunStore: Ext.create('Mplm.store.GubunStore', {
        hasNull: false
    }),

    supastStore: Ext.create('Mplm.store.SupastStore', {}),
    mtrlFlagStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'MTRL_FLAG_SEW'}),

    buttonToolbar2: Ext.create('widget.toolbar', {
        cls: 'my-x-toolbar-default1',
        layout: 'column',
        style: 'color:white;',
        items: [
            {
                columnWidth: 1.0,
                //id: gu.id('target_totalPrice'),
                xtype: 'component',
                style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                html: "Assembly를 선택하세요."
            }
        ]
    }),
    selectRec: function (record) {

        unique_id = Ext.getCmp(gu.id('unique_id'));
        unique_id.setValue(record.get('unique_id'));
        item_code = Ext.getCmp(gu.id('item_code'));
        item_code.setValue(record.get('item_code'));
        item_name = Ext.getCmp(gu.id('item_name'));
        item_name.setValue(record.get('item_name'));
        specification = Ext.getCmp(gu.id('specification'));
        specification.setValue(record.get('specification'));
        unit_code = Ext.getCmp(gu.id('unit_code'));
        unit_code.setValue(record.get('unit_code'));

    },

    pastePartActionHandler: function (uids, unique_uid, refer_uid) {

        this.grid.setLoading(false);

        // refer_uid update(-1 : 참조해제)
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=updateSrcahdAssymap',
            params: {
                unique_uid: unique_uid,
                refer_uid: 1
            },
            success: function (result, request) {
                gm.me().cloudAssemblyTreeStore.load(function (records) {
                });
            },
            failure: extjsUtil.failureMessage
        });

        // 참조해제된 assy insert
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=addReferPartAssymap',
            params: {
                project_uid: gm.me().selectedPjUid,
                parent: gm.me().selectedAssyTop.get('srcahd_uid'),
                parent_uid: gm.me().selectedAssyTopUid,
                resetQty: 'false',
                resetPlno: 'false',
                uidList: uids,
                refer_uid: refer_uid
            },
            success: function (result, request) {
                gm.me().cloudAssemblyTreeStore.load(function () {
                });
                gm.me().store.load(function () {
                    gm.me().grid.setLoading(false);
                    gm.me().assyGrid.expandAll();
                });
            },
            failure: extjsUtil.failureMessage
        });
    },

    deleteAssyConfirm: function (result) {

        if (result == 'yes') {
            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
                return;
            } else {
                var name = gm.me().selected_tree_record.data.text;
                var id = gm.me().selected_tree_record.data.id;
                var depth = gm.me().selected_tree_record.data.depth;

                if (depth < 2) {
                    Ext.MessageBox.alert('선택 확인', '최상위 Assy는 삭제할 수 없습니다.');
                    return;
                } else {

                    gm.me().setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=deleteAssyAndItsBom',
                        params: {
                            assy_uid: id
                        },
                        success: function (result, request) {
                            gm.me().setLoading(false);
                            gm.me().reSelect();
                            gu.getCmp('DBM7TREE-Assembly').store.load();
                        },
                        failure: function () {
                            gm.me().setLoading(false);
                            gu.getCmp('DBM7TREE-Assembly').store.load();
                        }
                    });
                }
            }
        }
    },

    openMergedPartlineWindow: function () {

        var selections = gm.me().assyCartGrid.getSelectionModel().getSelection();

        var prdplanUids = [];
        var prQuans = [];
        var isPoNoSame = true;
        var firstPoNo = '';

        for (var i = 0; i < selections.length; i++) {
            prdplanUids.push(selections[i].get('pr_uid'));
            prQuans.push(selections[i].get('request_quan'));

            /**
             * 아래 코드는 바이오프로테크에서만 사용되므로 flag 사용 요망
             */
            var poNo = selections[i].get('po_no').substring(0, 1);

            if (i === 0) {
                firstPoNo = poNo;
            } else {
                if (firstPoNo !== poNo) {
                    isPoNoSame = false;
                    break;
                }
            }
        }

        if (!isPoNoSame) {
            Ext.Msg.alert('경고', 'Site가 일치하지 않는 품목이 있어 계산할 수 없습니다.');
            return;
        }

        this.mergedPartlineStore = Ext.create('Rfx2.store.company.bioprotech.MergedPartlineStore',
            {
                sorters: {
                    property: 'item_code',
                    direction: 'asc'
                }
            });

        this.mergedPartlineStore.getProxy().setExtraParam('prdplan_uids', prdplanUids);
        this.mergedPartlineStore.getProxy().setExtraParam('pr_quans', prQuans);
        this.mergedPartlineStore.getProxy().setExtraParam('reserved_integer4', 1);

        this.mergedPartGrid = Ext.create('Rfx2.base.BaseGrid', {
            id: gu.id('mergedPartGrid'),
            border: false,
            resizable: true,
            scroll: true,
            height: 520,
            collapsible: false,
            forceFit: true,
            store: this.mergedPartlineStore,
            layout: 'fit',
            listeners: {},
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false/*,
                preserveScrollOnReload: true*/
            },
            dockedItems: [],
            columns: [
                {
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 100,
                    style: 'text-align:center'
                },
                {
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 200,
                    style: 'text-align:center'
                },
                {
                    text: '규격',
                    dataIndex: 'specification',
                    width: 200,
                    style: 'text-align:center'
                },
                {
                    text: '예상 출고 요청량',
                    dataIndex: 'pr_quan',
                    width: 150,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00.#####');
                    }
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '산출한 예상 출고 요청 리스트',
            width: 1000,
            height: 600,
            items: [this.mergedPartGrid],
            buttons: [
                {
                    text: CMD_OK,
                    //scope:this,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        })
        prWin.show();
        this.mergedPartlineStore.load();
    },

    removeCart: function () {

        var selections = gm.me().assyCartGrid.getSelectionModel().getSelection();

        if (selections.length > 0) {

            Ext.MessageBox.show({
                title: '카트에서 제외',
                msg: '선택하신 제품을 카트에서 제외하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function (btn) {

                    if (btn == "yes") {

                        var selection = gm.me().assyCartGrid.getSelectionModel().getSelection();

                        var assymap_uids = [];
                        var prdplan_uids = [];
                        var lot_no_list = [];
                        var pr_quans = [];

                        for (var i = 0; i < selection.length; i++) {

                            var rec = selection[i];

                            assymap_uids.push(rec.get('assymap_uid'));

                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/request.do?method=removeCartGb',
                            params: {
                                assymap_uids: assymap_uids
                            },
                            success: function (val, action) {
                                gm.me().assyTopStore.load();
                                gm.me().gbCartStore.load();
                            },
                            failure: function (val, action) {
                                gm.me().gbCartStore.load();
                            }
                        });
                    }
                }//fn function(btn)

            });//show
        }
    },

    class_type: '',
    mNum: 0,
    listeners: {
        /**
         * 페이지를 이동할 때 새로운 내용이 반영이 되게 한다.
         */
        show: function () {
            if (gm.me().assyTopParent != undefined) {
                this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'productcombo-DBM7_TREE', 'child', true);
                gm.me().grid.getStore().load();
            }
        }
    }
});