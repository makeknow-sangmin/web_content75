Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

Ext.define('Rfx2.view.company.dsmaref.designPlan.AssyBOMTreeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'assy-bom-tree-view',
    initComponent: function () {

        this.columns.splice(0, 0, {
            //text: '유형',
            menuDisabled: true,
            sortable: false,
            useYn: true,
            xtype: 'actioncolumn',
            align: 'center',
            style: 'align:center;',
            width: 30,
            items: [{
                getClass: function (v, meta, rec) {
                    if (rec.get('standard_flag') == 'A') {
                        return 'assembly-col';
                    } else {
                        return 'part-col';
                    }
                },
                getTip: function (v, meta, rec) {
                    if (rec.get('standard_flag') == 'A') {
                        return 'Assembly';
                    } else {
                        return 'Part';
                    }
                },
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex),
                        action = (rec.get('standard_flag') == 'A' ? 'Assembly' : 'Part');

                    Ext.Msg.alert(action, action);
                }
            }]
        });

        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('pj_name');

        this.multiGrid = true;

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        // var commandToolbar = this.createCommandToolbar();

        // console_logs('this.fields', this.fields);


        console_logs('columns', this.columns);

        this.createStore('Rfx.model.PartLine', [{
                // property: 'pl_no',
                // direction: 'ASC'
            }],
            gm.pageSize /* pageSize */
            // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            // Orderby list key change
            // ordery create_date -> p.create로 변경.
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_uid'
            }
            // //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        var buttonToolbar1 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartAction,
                this.editPartAction,
                this.removePartAction,
                //this.addMyCartAction,
                '-',
                this.copyPartAction,
                this.pastePartAction,
                // '-',
                // this.printPDFAction,
                '-',
                this.usingProductAction,
                '->',
                // this.expandAllTreeAction
//                {
//                    xtype: 'component',
//                    html: "자재복사:",
//                    style: 'align:right;'
//                },
                this.printExcelAction,
                '-',
                {
                    xtype: 'component',
                    style: 'margin-right:5px;width:18px;text-align:right',
                    id: gu.id('childCount'),
                    style: 'color:#094C80;align:right;',
                    html: ''
                }

            ]
        });

        this.createGrid([buttonToolbar1/*, this.buttonToolbar2*/], {
            width: '65%'
        });

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                //console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
                gm.me().assymapUidbom = rec.get('unique_uid');
                gm.me().assymapPcr_div = rec.get('request_comment');
                gm.me().assymapBmQuan = rec.get('bm_quan');
                gm.me().assyId = rec.get('hier_pos');
                gm.me().assylevel = rec.get('reserved_integer1');
                gm.me().pl_no = rec.get('pl_no');
                gUtil.enable(gm.me().addPcsPlanAction);
                gUtil.enable(gm.me().editPartAction);
                gUtil.enable(gm.me().copyPartAction);
                gUtil.enable(gm.me().removePartAction);
                gUtil.enable(gm.me().addMyCartAction);
                gUtil.enable(gm.me().usingProductAction);
            } else if (selections.length == 1) {
                gUtil.enable(gm.me().usingProductAction);
            } else {
                gUtil.disable(gm.me().addPcsPlanAction);
                gUtil.disable(gm.me().editPartAction);
                gUtil.disable(gm.me().copyPartAction);
                gUtil.disable(gm.me().removePartAction);
                gUtil.disable(gm.me().addMyCartAction);
                gUtil.disable(gm.me().usingProductAction);
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });

        this.commonStandardStore.load(function (records) {
            for (var i = 0; i < records.length; i++) {
                var obj = records[i];
                // console_logs('commonStandardStore2['+i+']=', obj);
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
                        // console_logs('gm.me().cloudprojectStore.load records', records);
                        for (var i = 0; i < records.length; i++) {
                            var rec = records[i];
                            // console_logs('record ac_uid', rec.get('unique_id'));
                            if (rec.get('unique_id') == ac_uid) {
                                var combo = gu.getCmp('projectcombo');
                                //console_logs('combo', combo);
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

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
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
                case 'contract_price':
                case 'total_contract_price':
                    columnObj['renderer'] = function(value, meta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                    break;
                case 'bm_quan':
                case 'quan':
                    columnObj['renderer'] = function(value, meta) {
                        return Ext.util.Format.number(value, '0,00.00/i');
                    }
                    break;
                case 'pcr_div':
                    columnObj['renderer'] = function(value, meta, record) {
                        if(record != null && record.length > 0) {
                            var standard_flag = record.get('standard_flag');
                            switch(standard_flag) {
                                case 'R':
                                case 'M':
                                    return '구매';
                                case 'A':
                                    return '생산';
                                default:
                                    return '기타';
                            }
                        }
                    }
                    break;
            }

        });

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
                    console_logs('result datas assyline', assyline);
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
                    console_logs('result uids', uids);
                    gm.me().setCopiedPartQuan(uids.length);
                }
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax

    },

    ////
    ////**************************************************** END OF initComponent ************************************
    ////
    setRelationship: function (relationship) {
    },
    bomListStore: Ext.create('Mplm.store.BomListStore', { not_pl_no: '---' }),
    usingProductStore: Ext.create('Rfx2.store.company.kbtech.UsingProductStore'),
    parentBomStore: Ext.create('Rfx2.store.company.kbtech.ParentBomStore'),
    createCenter: function () {

        this.changeAssyAction = Ext.create('Ext.Action', {
            iconCls: 'af-arrow-right',
            text: 'ASSY 변경',
            tooltip: 'ASSY 변경',
            //disabled: true,
            handler: function () {
                gm.me().changeAssy();
            } //handler end...
        });

        this.bomListStore.getProxy().setExtraParam('not_ac_uid', true);

        this.bomAll =
            Ext.create('Rfx2.view.company.dsmaref.grid.BomGridHeavy', {
                id: gu.id('DBM7TREE-Assembly'),
                title: '전체 BOM',// cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.bomListStore,
                layout: 'fit',
                viewConfig: {
                    getRowClass : function(record, index) {
                        var standard_flag = record.get('standard_flag');
                        if(standard_flag == 'A') {
                            return 'yellow-row';
                        }
                    }
                },
                // bbar: Ext.create('Ext.PagingToolbar', {
                //     store: this.bomListStore,
                //     displayInfo: true,
                //     displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                //     emptyMsg: "표시할 항목이 없습니다."
                //     , listeners: {
                //         beforechange: function (page, currentPage) {
                //
                //         }
                //     }
                //
                // }),
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [this.printExcelActionAll,{
//						id: 'target-routeTitlename-DBM7',
                        xtype: 'component',
//					    html: "전체 BOM List",
                        width: 400,
                        style: 'font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                    }]
                }, {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            xtype: 'component',
                            style: 'font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                            html: "전체 BOM List"
                        },
                        {
                            columnWidth: .5,
                            id: gu.id('target_totalPrice'),
                            xtype: 'component',
                            style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                            html: "Assembly를 선택하세요."
                        }
                    ]
                }] //dockedItems of End


            });//productGrid of End

        this.parentAssyGrid =
            Ext.create('Rfx2.view.company.kbtech.grid.ParentAssyGrid', {
                id: gu.id('parentAssyGrid'),
                title: '사용중인 제품',// cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.parentBomStore,
                layout: 'fit',
                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.parentBomStore,
                    displayInfo: true,
                    displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                    emptyMsg: "표시할 항목이 없습니다."
                    , listeners: {
                        beforechange: function (page, currentPage) {

                        }
                    }

                }),
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.changeAssyAction
                    ]
                }, {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [{
//						id: 'target-routeTitlename-DBM7',
                        xtype: 'component',
                        html: "사용중인 제품 List",
                        width: 400,
                        style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'

                    }]
                }] //dockedItems of End


            });//productGrid of End

        this.inpuArea = Ext.widget({
            title: 'Excel Form',
            xtype: 'form',
            // disabled: true,
            collapsible: false,
            border: false,
            layout: 'fit',
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [{
                    iconCls: 'search',
                    text: CMD_INIT,
                    handler: function () {
                        Ext.MessageBox.show({
                            title: '초기화 확인',
                            msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                var result = MessageBox.msg('{0}', btn);
                                if (result == 'yes') {
                                    var o = gu.getCmp('bom_content');
                                    o.setValue(bomTableInfo);
                                }
                            }
                        });

                    }
                }, '-',
                    {
                        iconCls: 'textfield',
                        text: '모두 지우기',
                        handler: function () {
                            Ext.MessageBox.show({
                                title: '모두 지우기',
                                msg: '모두 지우시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function (btn) {
                                    var result = MessageBox.msg('{0}', btn);
                                    if (result == 'yes') {
                                        var o = gu.getCmp('bom_content');
                                        o.setValue('');
                                    }
                                }
                            });

                        }
                    }, '-', {
                        iconCls: 'application_view_tile',
                        text: '사전검증',
                        handler: function () {
                            var bom_content = gu.getCmp('bom_content');

                            var htmlContent = bom_content.getValue();

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
                                params: {
                                    pj_code: gm.me().selectedPjCode,
                                    assy_code: gm.me().selectedAssyCode,
                                    pj_uid: gm.me().selectedPjUid,

                                    parent: gm.me().selectedChild,
                                    parent_uid: gm.me().selectedAssyUid,

                                    pj_name: Ext.JSON.encode(gm.me().selectedPjName),
                                    assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
                                    htmlContent: htmlContent
                                },
                                success: function (result, request) {
                                    var val = result.responseText;
                                    bom_content.setValue(val);

                                },
                                failure: extjsUtil.failureMessage
                            });


                        }
                    }, '-', {
                        text: '디플로이',
                        iconCls: 'save',
                        handler: function () {
                            var bom_content = gu.getCmp('bom_content');

                            var htmlContent = bom_content.getValue();

                            gu.getCmp('bom_content').setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
                                params: {
                                    pj_code: gm.me().selectedPjCode,
                                    assy_code: gm.me().selectedAssyCode,
                                    pj_uid: gm.me().selectedPjUid,
                                    parent: gm.me().selectedChild,
                                    parent_uid: gm.me().selectedAssyUid,
                                    pj_name: Ext.JSON.encode(gm.me().selectedPjName),
                                    assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
                                    htmlContent: htmlContent
                                },
                                success: function (result, request) {

                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs('jsonData', jsonData);

                                    var result = jsonData['result'];

                                    if (result == 'true' || result == true) { // 정상이면
                                        // Reload.
                                        if (gm.me().selectedAssyDepth == 1) {
                                            gm.me().editAssyAction.disable();
                                            gm.me().removeAssyAction.disable();
                                            gm.me().copyAssemblyAction.disable();
                                        } else {
                                            gm.me().editAssyAction.enable();
                                            gm.me().removeAssyAction.enable();
                                            gm.me().copyAssemblyAction.enable();
                                        }
                                        gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                                        gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                                        gm.me().store.getProxy().setExtraParam('ac_uid', gm.me().selectedPjUid);
                                        gm.me().store.load(function (records) {
                                            gm.me().selectAssy();
                                            gm.me().setCopiedPartQuan(records.length);
                                            gm.me().setMakeTable(records);
                                        });
                                    } else {
                                        Ext.MessageBox.alert('오류', '입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
                                    }
                                    gu.getCmp('bom_content').setLoading(false);
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    }, '-',
                    '->'
                ]
            }],
            items: [{
                // fieldLabel: 'board_content.',
                // x: 5,
                // y: 0 + 2*lineGap,
                id: gu.id('bom_content'),
                name: 'bom_content',
                xtype: 'htmleditor',
                width: '100%',
                height: '100%',
                border: false,
                enableColors: false,
                enableAlignments: false,
                anchor: '100%',
                listeners: {
                    initialize: function (editor) {
                        console_logs('editor', editor);
                        var styles = {};


                        Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
                    }
                },
                value: this.initTableInfo


            }]
        });

        var myCartColumn = [];
        var myCartFields = [];

        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i].id = 'uid-' + Math.round(Math.random() * 100000000 * 16);
            switch (this.columns[i]['dataIndex']) {
                case 'req_info':
                case 'statusHangul':
                case 'sales_price':
                case 'goodsout_quan':
                    break;
                default:

                    myCartColumn.push(this.columns[i]);
            }
        }

        var selModelMycart = Ext.create("Ext.selection.CheckboxModel", {});

        var myCartModel = Ext.create('Rfx.model.MyCartLine', {
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


        this.gridMycart = Ext.create('Ext.grid.Panel', {
            title: 'My Cart',
            store: this.myCartStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelMycart,
            stateId: 'gridMycart' + /* (G) */ vCUR_MENU_CODE,
            // height: getCenterPanelHeight(),

            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.searchAction, '-', this.removeCartAction, '-', this.purchase_requestAction,
                    /*'-',
                     this.process_requestAction,'-',*/
                    '->'
                ]
            }

            ],
            columns: /* (G) */ myCartColumn,
            plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function (gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        this.gridMycart.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().onMygridSelection(selections);
            }
        });


        this.gridMycart.on('edit', function (editor, e) {
            // commit the changes right after editing finished

            var rec = e.record;
            // console_logs('rec', rec);
            var unique_uid = rec.get('unique_uid');
            var reserved_double1 = rec.get('reserved_double1');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
                params: {
                    assymap_uid: unique_uid,
                    pr_qty: reserved_double1
                },
                success: function (result, request) {

                    var result = result.responseText;
                    // console_logs("", result);

                },
                failure: extjsUtil.failureMessage
            });

            rec.commit();
        });

        this.myCartStore.load(function () {
        });
        /*******************************************************************************
         * Mycart Grid End
         */
        this.grid.setTitle('BOM');
        this.bomTab = Ext.create('Ext.tab.Panel', {
            layout: 'border',
            title: 'BOM',
            border: false,
            tabPosition: 'top',
            layoutConfig: {
                columns: 2,
                rows: 1
            },
            items: [this.grid, this.bomAll, this.inpuArea]
        });

        this.mycartTab = Ext.create('Ext.tab.Panel', {
            layout: 'border',
            title: 'My Cart',
            border: false,
            tabPosition: 'top',
            layoutConfig: {
                columns: 1,
                rows: 1
            },
            items: [this.gridMycart]
        });

        this.center = Ext.create('Ext.tab.Panel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '70%',
            tabPosition: 'top',
            items: [this.grid, this.bomAll, /*this.inpuArea, */this.parentAssyGrid],
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    if (tab.id === gu.id('DBM7TREE-Assembly')) {
                        var datas = [];
                        for(var i=1; i<gm.me().cloudAsStore.data.items.length; i++) {
                            var s = gm.me().cloudAsStore.data.items[i];
                            datas.push(s.get('unique_uid'));
                        }
                        gm.me().bomListStore.getProxy().setExtraParam('total_uids', datas);
                        gu.getCmp('DBM7TREE-Assembly').store.getProxy().setExtraParam('total_uids', datas);
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                    }
                }
            }
        });

        return this.center;

    },

    // ----------------------- END OF CENTER --------------------

    createWest: function () {

        Ext.tip.QuickTipManager.init();

        // this.cloudAsStore = Ext.create('Rfx2.store.company.dsmf.cloudSubAssemblyTreeStoreDSMF', {});
        this.cloudAsStore = Ext.create('Rfx2.store.company.kbtech.cloudSubAssemblyTreeStore', {});
        
        // Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a
        // tree.TreePanel
        this.assyGrid = Ext.create('Ext.tree.Panel', {
            title: 'Assembly',
            collapsible: true,
            useArrows: true,
            rootVisible: false,
            forceFit: true,
            store: this.cloudAsStore,
            multiSelect: true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    // this.addAssyAction,
                    // this.editAssyAction,
                    //this.editAssyAction,
                    // this.removeAssyAction,
                    // this.copyAssemblyAction,
                    // this.pasteAssyAction
                ]
            },

                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: '33%',
                            field_id: 'search_item_code',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_code'),
                            name: 'search_item_code',
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');

                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gu.getCmp('productcombo-DBM7_ASSY').store.getProxy().setExtraParam('item_code', '%' + e + '%');
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
                            width: '33%',
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
                                    gu.getCmp('productcombo-DBM7_ASSY').store.getProxy().setExtraParam('item_name', '%' + e + '%');
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
                            width: '33%',
                            field_id: 'search_specification',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_specification'),
                            name: 'search_specification',
                            xtype: 'triggerfield',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gu.getCmp('productcombo-DBM7_ASSY').store.getProxy().setExtraParam('specification', '%' + e + '%');
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        }
                    ]

                }, {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            id: gu.id('productcombo-DBM7_ASSY'),
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: true,
                            // allowBlank: false,
                            width: '100%',
                            queryMode: 'remote',
                            emptyText: 'Assy를 선택하세요',
                            displayField: 'item_name',
                            valueField: 'unique_id',
                            store: Ext.create('Rfx2.store.company.dsmf.AssyStoreDSMFAssy', {}),
                            sortInfo: {field: 'specification', direction: 'ASC'},
                            minChars: 1,
                            typeAhead: true,
                            hideLabel: true,
                            hideTrigger: false,
                            anchor: '100%',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목이 없습니다',
                                maxHeight: 350,
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                                }
                            },
                            pageSize: 20,
                            triggerAction: 'all',
                            listeners: {
                                // beforequery: function (queryEvent) {
                                //     gu.getCmp('productcombo-DBM7_ASSY').store.getProxy().setExtraParam('itemCodeOldAndNew',
                                //         gu.getCmp('productcombo-DBM7_ASSY').getValue());
                                //     gu.getCmp('productcombo-DBM7_ASSY').store.getProxy().setExtraParam('query', null);
                                // },
                                expand: function (field) {
                                    gu.getCmp('productcombo-DBM7_ASSY').getStore().load();
                                },
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    console_logs('record : ', record);
                                    // gm.me().claastReset(4);
                                    gm.me().assyTopParent = combo.getValue();
                                    var srcahd_uid = record.get('unique_id');
                                    gm.me().assyTopChild = srcahd_uid;
                                    gm.me().selectAssymapCombo(record);
                                },
                                pageSize: 10
                            }
                        }
                    ]
                },{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            id: gu.id('target-projectcode-DBM7_ASSY'),
                            xtype: 'component',
                            html: "미지정",
                            width: '100%',
                            style: 'color:white;align:right;'
                        },
                    ]
                }
            ], // dockedItems of End
            columns: [{
                xtype: 'treecolumn', // this is so we know which column
                // will show the tree
                text: 'BOM',
                width: 570,
                autoSizeColumn: true,
                sortable: true,
                dataIndex: 'text',
                locked: true
            }
            ]
            , viewConfig: {
                getRowClass: function (record, index) {
                    var refer_uid = record.get('refer_uid');
                    if (refer_uid != null && refer_uid > -1) {
                        record.set('icon', "x-grid-tree-node-expanded x-tree-icon-parent_link");
                        record.set('iconCls', "x-grid-tree-node-expanded x-tree-icon-parent_link");
                    }
                }
            }
            , listeners: {
                'afterrender': function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {

                    }, this);

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
                }
            }
        });

        this.assyGrid.getSelectionModel().on({  // selectedChild
            selectionchange: function (sm, selections) {
                gm.me().onAssemblyGridSelection(selections);
                if(selections!=null && selections.length>0) {
                    // var select = selections[0];
                    // gm.me().parentBomStore.getProxy().setExtraParam('child', select.get('child'));
                    // gm.me().parentBomStore.getProxy().setExtraParam('ac_uid', -1);
                    // gm.me().parentBomStore.getProxy().setExtraParam('ascDesc', "ASC");
                    // gm.me().parentBomStore.load(function (records) {
                    // });
                } else {
                    gm.me().selectedChild = -1;
                }
            }
        });

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            width: '30%',
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
    gridMycart: null,
    gridStock: null,
    store: null,
    myCartStore: null,
    stockStore: null,
    gItemGubunType: null,
    itemGubunType: null,
    inpuArea: null,
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

    CHECK_DUP: '-copied-',
    gGridMycartSelects: [],
    copyArrayMycartGrid: function (from) {

        this.gGridMycartSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridMycartSelects[i] = from[i];
            }
        }
    },
    gGridStockSelects: [],
    copyArrayStockGrid: function (from) {

        this.gGridStockSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridStockSelects[i] = from[i];
            }
        }
    },
    initTableInfo: '',
    INIT_TABLE_HEAD: function () {
        var a =
            '<style>' +
            ' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }' +
            ' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
            ' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
            ' </style>' +
            '<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
            '<colgroup>' +
            '<col width="80px">' +
            '<col width="90px">' +
            '<col width="*">' +

            '<col width="90px">' +
            '<col width="90px">' +
            '<col width="50px">' +
            '<col width="90px">' +

            '<col width="60px">' +
            '<col width="60px">' +
            '<col width="40px">' +

            '<col width="110px">' +
            '<col width="90px">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr  height="30" >' +
            '	  <td class="xl66" align=center>프로젝트코드</td>' +
            '	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
            '	  <td class="xl66" align=center>프로젝트이름</td>' +
            '	  <td class="xl67" align=center>' + this.selectedPjName + '</td>' +
            '<td colspan="8" rowspan="2">' +
            '</td>' +
            '	 </tr>' +
            '<tr  height="30" >' +
            '	  <td class="xl66" align=center>Assy코드</td>' +
            '	  <td class="xl67" align=center>' + this.selectedAssyCode + '</td>' +
            '	  <td class="xl66" align=center>Assy이름</td>' +
            '	  <td class="xl67" align=center>' + this.selectedAssyName + '</td>' +
            '	 </tr>' +
            '<tr  height="25" >' +
            '	  <td class="xl66" align=center>품번</td>' +
            '	  <td class="xl66" align=center>품명</td>' +
            '	  <td class="xl66" align=center>규격</td>' +

            '	  <td class="xl66" align=center>재질</td>' +
            '	  <td class="xl66" align=center>후처리</td>' +
            '	  <td class="xl66" align=center>열처리</td>' +
            '	  <td class="xl66" align=center>제조원</td>' +

            '	  <td class="xl66" align=center>예상가격</td>' +
            '	  <td class="xl66" align=center>수량</td>' +
            '	  <td class="xl66" align=center>구분</td>' +
            '	  <td class="xl66" align=center>품목코드</td>' +
            '	  <td class="xl66" align=center>UID</td>' +
            '	 </tr>';

        return a;
    },
    INIT_TABLE_TAIL: '</tbody></table><br><br>' +
    '<div style="color:blue;font-size:11px;position:relative; "><ul>' +
    '<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>' +
    '<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>' +
    '<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>' +
    '</ul></div>',
    makeInitTable: function () {
        var initTableLine =
            '	 <tr height="25" style="height:12.75pt">' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl67">&nbsp;</td>' +
            '	  <td class="xl67">&nbsp;</td>' +
            '	 </tr>';

        this.initTableInfo = INIT_TABLE_HEAD();
        this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
    },
    bomTableInfo: '',

    createLine: function (val, align, background, style) {
        return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>' + val + '</td>';
    },

    setCopiedPartQuan: function (n) {
        console_logs('setCopiedPartQuan', n);
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
                console_logs('this.selected_tree_record', this.selected_tree_record);
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

    createHtml: function (route_type, rqstType, catmapObj) {
        var htmlItems =
            '<style>' +
            ' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }' +
            ' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
            ' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
            ' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
            '<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
            '<colgroup>' +
            '<col width="10%">' +
            '<col width="10%">' +
            '<col width="10%">' +
            '<col width="20%">' +
            '<col width="40%">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr  height="25" >' +
            '	  <td class="xl67" align=center>품목코드</td>' +
            '	  <td class="xl67" align=center>필요수량</td>' +
            '	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
            '	  <td class="xl67" align=center>품명</td>' +
            '	  <td class="xl67" align=center>규격</td>' +
            '	 </tr>';
        for (var i = 0; i < catmapObj.length; i++) {
            var rec = catmapObj[i]; // grid.getSelectionModel().getSelection()[i];
            var item_code = rec.get('item_code');
            var quan = route_type == 'P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
            var new_pr_quan = rec.get('new_pr_quan');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');

            htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
            htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + '</tr>';

        }
        htmlItems = htmlItems + '</tbody></table></div>';
        return htmlItems;
    },

    setMakeTable: function (records) {
        this.bomTableInfo = this.INIT_TABLE_HEAD();
        if (records == null || records.length == 0) {
            // bomTableInfo = initTableInfo;
        } else {

            for (var i = 0; i < records.length; i++) {
                var rec = records[i];
                var unique_id = rec.get('unique_id');
                var unique_uid = rec.get('unique_uid');
                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                var specification = rec.get('specification');
                var standard_flag = rec.get('standard_flag');
                var sp_code = rec.get('sp_code'); // 표시는 고객사 선책톧로

                var model_no = rec.get('model_no');
                var description = rec.get('description');
                var pl_no = rec.get('pl_no');
                var comment = rec.get('comment');
                var maker_name = rec.get('maker_name');
                var bm_quan = rec.get('bm_quan');
                var unit_code = rec.get('unit_code');
                var sales_price = rec.get('sales_price');

                this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
                this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65'); // 품번
                this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65'); // 품명
                this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65'); // 규격
                this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65'); // 재질/모델
                this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65'); // 후처리
                this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65'); // 열처리
                this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65'); // 제조원
                this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65'); // 예상가(숫자)
                this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65'); // 수량(숫자)
                this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65'); // 구분기호
                this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67'); // 품목코드
                this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67'); // UID
                this.bomTableInfo = this.bomTableInfo + '	 </tr>';
            }
        }
        this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
        var o = gu.getCmp('bom_content');
        o.setValue(this.bomTableInfo);
    },

    insertStockStoreRecord: function (records) {
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
        if (this.copiedPartCnt > 0) {
            this.pastePartAction.enable();
        }
        this.pasteAssyAction.enable();
        this.inpuArea.enable();
        this.lightAssyCopyAction.enable();
        this.importAssyAction.enable();
        //gu.getCmp('addPartForm')).enable();
        //gu.getCmp('target-routeTitlename').update(this.routeTitlename);
        this.copyAssemblyAction.enable();

        if (this.depth == 1) {
            this.addPartAction.enable();
            this.editAssyAction.disable();
            this.removeAssyAction.disable();
        } else {
            this.addPartAction.disable();
            this.editAssyAction.enable();
            this.removeAssyAction.enable();
        }


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
        this.inpuArea.disable();
        this.lightAssyCopyAction.disable();
        this.importAssyAction.disable();
        gu.getCmp('bom_content').setValue(this.initTableInfo);

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
                parent: this.selectedChild,
                parent_uid: this.selectedAssyUid
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
            //gu.getCmp('addPartForm')).getForm().reset();
            // console_logs('getForm().reset()', 'ok');
        }
    }),

    pastePartAction: Ext.create('Ext.Action', {
        itemId: 'pasteActionButton',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function (widget, event) {

            var pj_uid = gm.me().selectedPjUid;
            var parent = gm.me().selectedChild;
            var parent_uid = gm.me().selectedAssyUid;
            var cnt = gm.me().copiedPartCnt;

            console_logs('pj_uid', pj_uid);
            console_logs('parent_uid', parent_uid);


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
                                    parent: gm.me().selectedChild,
                                    parent_uid: gm.me().selectedAssyUid,
                                    reserved_integer2: gm.me().selectedProduct,
                                    resetQty: val['resetQty'],
                                    resetPlno: val['resetPlno']
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
                                        gu.getCmp('DBM7TREE-Assembly').store.load();

                                    });
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

            console_logs('gm.me().selectedAssyUid', gm.me().selectedAssyUid);

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
                        console_logs('result', result);
                        gm.me().selectTreeGrid(null);
                        gm.me().refreshAssyCopy();
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                        gm.me().cloudProjectTreeStore.load({
                            callback: function (records, operation, success) {
                                console_log('load tree store');
                                console_log('ok');
                                //pjTreeGrid.setLoading(false);
                                // treepanel.expandAll();
                            }
                        });
                    },
                    failure: extjsUtil.failureMessage
                });

            }
        }
    }),

    lightAssyCopyAction: Ext.create('Ext.Action', {
        itemId: 'lightAssyCopyAction',
        iconCls: 'link',
        text: '참조',
        disabled: true,
        handler: function (widget, event) {
            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            console_logs('=====>acsca', gm.me().assyTopParent);


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
            var parent_uid = gm.me().selected_tree_record.get('parent_uid');
            var parent = gm.me().selected_tree_record.get('parent');
            var refer_uid = null;

            // if(parent_uid == -1 || parent == -1) {
            //     Ext.MessageBox.alert('Error', 'TopAssembly에서는 참조할 수 없습니다.', function callBack(id) {
            //         return
            //     });
            //     return;
            // }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno2',
                params: {
                    ac_uid: gm.me().selectedPjUid,
                    assybom: 'Y', //Y면 AssemblyBom N이나 널이면 ProjectBOM,
                    assymap_uid: unique_uid
                },
                success: function (result, request) {
                    console_logs('result.responseText', result);
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
                    var bHeight = 300;

                    var productcomboRefer = Ext.create('Mplm.store.ProductStoreRefer');
                    var inputItem = [];
                    inputItem.push({
                        xtype: 'textfield',
                        name: 'child',
                        fieldLabel: '모  UID',
                        allowBlank: false,
                        value: child,
                        anchor: '-5',
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    });
                    inputItem.push({
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '10 0 5 0',
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        items: [{
                            id: 'DBM7_ASSY-PRDLV1-ADD',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: false,
                            // allowBlank: false,
                            width: 150,
                            queryMode: 'remote',
                            emptyText: '대분류',
                            displayField: 'class_name',
                            valueField: 'class_code',
                            store: Ext.create('Mplm.store.ClaastStorePD', {level1: 1, identification_code: 'PD'}),
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    console_logs('record : ', record);
                                    var class_code = record.get('class_code');
                                    var claastlevel2 = Ext.getCmp('DBM7_ASSY-PRDLV2-ADD');
                                    var claastlevel3 = Ext.getCmp('DBM7_ASSY-PRDLV3-ADD');
                                    var claastlevel4 = Ext.getCmp('DBM7_ASSY-PRDLV4-ADD');

                                    claastlevel2.clearValue();
                                    claastlevel2.store.removeAll();
                                    claastlevel3.clearValue();
                                    claastlevel3.store.removeAll();
                                    claastlevel4.clearValue();
                                    claastlevel4.store.removeAll();

                                    claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
                                    claastlevel2.store.load();


                                    var productcombo = Ext.getCmp('DBM7_ASSY_srcahd_uid');

                                    productcombo.clearValue();
                                    productcombo.store.removeAll();
                                    productcombo.store.getProxy().setExtraParam('class_code', class_code);
                                    productcombo.store.load();

                                }
                            }

                        }, {
                            id: 'DBM7_ASSY-PRDLV2-ADD',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: false,
                            // allowBlank: false,
                            width: 150,
                            queryMode: 'remote',
                            emptyText: '중분류',
                            displayField: 'class_name',
                            valueField: 'class_code',
                            store: Ext.create('Mplm.store.ClaastStorePD', {level1: 2, identification_code: 'PD'}),
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    console_logs('record : ', record);

                                    var class_code = record.get('class_code');
                                    var claastlevel3 = Ext.getCmp('DBM7_ASSY-PRDLV3-ADD');
                                    var claastlevel4 = Ext.getCmp('DBM7_ASSY-PRDLV4-ADD');

                                    claastlevel3.clearValue();
                                    claastlevel3.store.removeAll();
                                    claastlevel4.clearValue();
                                    claastlevel4.store.removeAll();
                                    claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
                                    claastlevel3.store.load();

                                    var productcombo = Ext.getCmp('DBM7_ASSY_srcahd_uid');

                                    productcombo.clearValue();
                                    productcombo.store.removeAll();
                                    productcombo.store.getProxy().setExtraParam('class_code', class_code);
                                    productcombo.store.load();

                                }
                            }

                        }, {
                            id: 'DBM7_ASSY-PRDLV3-ADD',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: false,
                            // allowBlank: false,
                            width: 150,
                            queryMode: 'remote',
                            emptyText: '소분류',
                            displayField: 'class_name',
                            valueField: 'class_code',
                            store: Ext.create('Mplm.store.ClaastStorePD', {level1: 3, identification_code: 'PD'}),
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    console_logs('record : ', record);
                                    var class_code = record.get('class_code');
                                    var claastlevel4 = Ext.getCmp('DBM7_ASSY-PRDLV4-ADD');

                                    claastlevel4.clearValue();
                                    claastlevel4.store.removeAll();
                                    claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
                                    claastlevel4.store.load();

                                    var productcombo = Ext.getCmp('DBM7_ASSY_srcahd_uid');

                                    productcombo.clearValue();
                                    productcombo.store.removeAll();
                                    productcombo.store.getProxy().setExtraParam('class_code', class_code);
                                    productcombo.store.load();

                                }
                            }

                        }, {
                            id: 'DBM7_ASSY-PRDLV4-ADD',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            mode: 'local',
                            editable: false,
                            // allowBlank: false,
                            width: 150,
                            queryMode: 'remote',
                            emptyText: '상세분류',
                            displayField: 'class_name',
                            valueField: 'class_code',
                            store: Ext.create('Mplm.store.ClaastStorePD', {level1: 4, identification_code: 'PD'}),
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                }
                            }, listeners: {
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    console_logs('record : ', record);
                                    var class_code = record.get('class_code');

                                    var productcombo = Ext.getCmp('DBM7_ASSY_srcahd_uid');
                                    productcombo.clearValue();
                                    productcombo.store.removeAll();
                                    productcombo.store.getProxy().setExtraParam('class_code', class_code);
                                    productcombo.store.load();
                                }
                            }

                        }]
                    });

                    inputItem.push({
                        xtype: 'combo',
                        name: 'srcahd_uid',
                        id: 'DBM7_ASSY_srcahd_uid',
                        fieldLabel: '품목 선택',
                        emptyText: '품목',
                        allowBlank: false,
                        displayField: 'item_name',
                        valueField: 'unique_id',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//                            value: gm.me().selectedPjCode,
                        store: productcomboRefer,
                        anchor: '-5',
                        queryMode: 'remote',
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}/{comment}</font></small></div>';
                            }
                        },
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (t, e) {
                                if (e.keyCode == 13) {
                                    var srcahd = Ext.getCmp('DBM7_ASSY_srcahd_uid');
                                    productcomboRefer.getProxy().setExtraParam('item_code', srcahd.getValue());
                                    productcomboRefer.load();
                                }

                            },
                            select: function (combo, record) {
                                var item_code = Ext.getCmp('DBM7_ASSY_item_code');
                                var item_code2 = record.get('item_code');
                                item_code.setValue(item_code2);

                                var item_name = Ext.getCmp('DBM7_ASSY_assy_name');
                                var item_name2 = record.get('item_name');
                                item_name.setValue(item_name2);

                                console_logs('====>recrd', record);
                                refer_uid = record.get('assy_uid');

                                var srcahd_uid = record.get('unique_id');
                                if (gm.me().assyTopParent != null && gm.me().assyTopParent == srcahd_uid) {
                                    Ext.MessageBox.alert('Error', '동일한 Assembly를 선택할 수 없습니다.', function callBack(id) {
                                        item_code.setValue(null);
                                        item_name.setValue(null);
                                        Ext.getCmp('DBM7_ASSY_srcahd_uid').setValue(null);
                                    });
                                }
                            }
                        },


                    });
                    inputItem.push({
                        xtype: 'textfield',
                        name: 'item_code',
                        id: 'DBM7_ASSY_item_code',
                        fieldLabel: '품목 코드',
                        allowBlank: false,
                        readOnly: true,
                        fieldStyle: 'text-align: right;',
                        anchor: '-5'
                    });
//                        inputItem.push({
//                            xtype: 'textfield',
//                            name: 'pj_code',
//                            fieldLabel: '프로젝트  코드',
//                            allowBlank: false,
//                            value: gm.me().selectedPjCode,
//                            anchor: '-5',
//                            readOnly: true,
//                            fieldStyle: 'background-color: #ddd; background-image: none;'
//                        });
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
                        id: 'DBM7_ASSY_assy_name',
                        name: 'assy_name',
                        fieldLabel: '품명',
                        allowBlank: false,
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'numberfield',
                        name: 'bm_quan',
                        fieldLabel: '수량',
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
                            // anchor: '100%',
                            editable: true,
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: inputItem
                    });
                    var win = Ext.create('ModalWindow', {
                        title: 'Assy 참조',
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


                                    var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                                    gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                                    gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                                    gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                                    gm.me().selected_tree_record.set('text', text);

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/design/bom.do?method=cloudAssycreate',
                                        params: {
                                            parent_uid: val['unique_uid'],
                                            parent: val['child'],
                                            ac_uid: -1,
                                            pl_no: val['pl_no'],
                                            bm_quan: val['bm_quan'],
                                            child: val['srcahd_uid'],
                                            item_name: val['assy_name'],
                                            level: val['reserved_integer1'],
                                            assytopUid: val['reserved_integer2'],
                                            refer_check: 'refer',
                                            refer_uid: refer_uid
//                                                pj_code: val['pj_code']

                                        },
                                        success: function (result, request) {

                                            gm.me().reSelect();
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
            });


        },
        failure: extjsUtil.failureMessage
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

            // var searchStandardAssyStore = gm.me().searchStandardAssyStore;
            //searchStandardAssyStore.getProxy().setExtraParam('bom_flag', 'T');
            // searchStandardAssyStore.getProxy().setExtraParam('sg_code', 'BOM');
        }
    }),

    importAssyConfirm: function (result) {
        console_logs('====result', result);

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

            console_logs("가져오기 진입>>>>>>>>>>");
            gm.me().partlineStore.getProxy().setExtraParam("parent", child);
            gm.me().partlineStore.getProxy().setExtraParam("parent_uid", refer_uid);

            var myStore = gm.me().partlineStore;
            var uids = [];
            myStore.load(function () {
                console_logs('this rec', myStore.data.items);
                myStore.data.each(function (rec) {
                    console_logs('each rec', rec);
                    uids.push(rec.get('unique_uid'));
                });

                console_logs('import uids', uids);
                // return;
                if (uids.length == 0) {
                    Ext.MessageBox.alert('알림', '가져올 항목이 없습니다.');
                } else {
                    var pj_uid = gm.me().selectedPjUid;
                    var parent = gm.me().selectedChild;
                    var parent_uid = gm.me().selectedAssyUid;
                    var cnt = uids.length;

                    console_logs('pj_uid', pj_uid);
                    console_logs('parent_uid', parent_uid);

                    // return;
                    if (cnt < 1) {
                        Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
                    } else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                        Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
                    } else {
                        console_logs('====uids', uids);

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

        console_logs('is', id);
        //        this.modRegAction.enable();
        //        this.resetPartForm();

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id
            },
            success: function (result, request) {

                var jsonData = Ext.decode(result.responseText);
                // console_logs('jsonData', jsonData);
                var records = jsonData.datas;
                // console_logs('records', records);
                // console_logs('records[0]', records[0]);
                gm.me().setPartFormObj(records[0]);
            },
            failure: extjsUtil.failureMessage
        });

    },

    setPartFormObj: function (o) {
        console_logs('setPartFormObj o', o);

        //        // 규격 검색시 standard_flag를 sp_code로 사용하기
        //        Ext.Ajax.request({
        //            url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',
        //            success: function(result) {
        //                var text = result.responseText;
        //                console_logs('text', text);
        //                var o2 = JSON.parse(text, function(key, value) {
        //                    return value;
        //                });
        //
        //                // console_logs('o2', o2);
        //                gItemGubunType = o2['itemGubunType'];
        //                // console_logs('itemGubun', itemGubunType);
        //                // console_logs('itemGubun1', gItemGubunType);


        var standard_flag = 'P';
        //                if (gItemGubunType == 'standard_flag') {
        //                    standard_flag = o['standard_flag'];
        //                } else {
        //                    standard_flag = o['sp_code'];
        //                }


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

        //
        //
        //            },
        //            failure: extjsUtil.failureMessage
        //        });


    },

    setPartForm: function (record) {
        // console_logs('record:', record);

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
        // console_logs('ref_quan', ref_quan);
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
        var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');

        // gu.getCmp(gu.id('unique_id')).setValue('');
        // gu.getCmp('unique_uid').setValue('');
        // gu.getCmp(gu.id('item_code')).setValue('');
        // gu.getCmp(gu.id('item_name')).setValue('');
        // gu.getCmp(gu.id('specification')).setValue('');
        // gu.getCmp(gu.id('maker_name')).setValue('');
        
        Ext.getCmp(gu.id('bm_quan')).setValue('1');
        Ext.getCmp(gu.id('sales_price')).setValue('0');
        Ext.getCmp(gu.id('currency')).setValue('KRW');
        Ext.getCmp(gu.id('unit_code')).setValue('EA');
        Ext.getCmp(gu.id('reserved_varchar2')).setValue('');

        gm.me().toResetData();
        // gu.getCmp(gu.id('reserved_integer1')).setValue(reserved_integer1 + 1);
        
        // gu.getCmp('standard_flag').setValue('');
        // gu.getCmp('standard_flag_disp').setValue('');

        // gu.getCmp('model_no').setValue('');
        // gu.getCmp('description').setValue('');
        // gu.getCmp('pl_no').setValue('');
        // gu.getCmp('comment').setValue('');
        
        // gu.getCmp('unit_code').setValue('PC');
        // this.readOnlyPartForm(false);
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

    searchAction: Ext.create('Ext.Action', {
        itemId: 'searchButton',
        iconCls: 'af-search',
        text: '새로 고침',
        disabled: false,
        handler: function () {
            gm.me().myCartStore.load(function () {
            });
        }
    }),


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
    isExistMyCart: function (inId) {
        var bEx = false; // Not Exist
        this.myCartStore.data.each(function (item, index, totalItems) {
            console_logs('item', item);
            var uid = item.data['unique_uid'];
            console_logs('uid', uid);
            console_logs('inId', inId);
            if (inId == uid) {
                bEx = true; // Found
            }
        });

        return bEx;
    },
    loadStore: function (child) {

        this.store.getProxy().setExtraParam('child', child);

        this.store.load(function (records) {
            console_logs('==== storeLoadCallback records', records);
            console_logs('==== storeLoadCallback store', store);

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
    // selectedClass1 : '',
    // selectedClass2 : '',
    // selectedClass3 : '',
    selectedClassCode: '',
    materialStore: Ext.create('Mplm.store.MtrlSubStore'),
    productSubStore: Ext.create('Mplm.store.ProductSubStore')
    // makeClassCode : function() {
    // this.selectedClassCode = this.selectedClass1 + this.selectedClass2 +
    // this.selectedClass3
    // }


    ,
    partlineStore: Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),
    addMtrlGrid: null,
    addPrdGrid: null,
    deleteConfirm: function (result) {
        if (result == 'yes') {
            var arr = gm.me().selectionedUids;

            var selection = gm.me().grid.getSelectionModel().getSelection();

            if (selection.length > 0) {

                var assyChildArr = [];
                var bomChildArr = [];
                var bomUniqueIdArr = [];

                for (var i = 0; i < selection.length; i++) {
                    assyChildArr.push(selection[i].get('parent'));
                    bomChildArr.push(selection[i].get('unique_id_long'));
                    bomUniqueIdArr.push(selection[i].get('unique_uid'));
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=deleteChildBOMTreeWithUsedProduct',
                    params: {
                        parents: assyChildArr,
                        childs: bomChildArr,
                        assymap_uids: bomUniqueIdArr
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        gm.me().store.load();
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                        });
                        gu.getCmp('DBM7TREE-Assembly').store.load();
                    }
                });
            }
        }

        // }
    },

    srchTreeHandler: function (my_treepanel, cloudProjectTreeStore, widName, parmName, b) {
        // this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        console_logs("srchSingleHandler my_treepanel", my_treepanel);
        console_logs("srchSingleHandler cloudProjectTreeStore", cloudProjectTreeStore);
        console_logs("srchSingleHandler widName", widName);
        console_logs("srchSingleHandler parmName", parmName);
        console_logs("srchSingleHandler b", b);

        // var refer_uids = [];

        // var datas = cloudProjectTreeStore.data.items;

        this.assyGrid.setLoading(true);

        this.resetParam(this.cloudAsStore, this.searchField);
        var val = gu.getCmp(widName).getValue();
        console_log('val' + val);

        this.cloudAsStore.getProxy().setExtraParam(parmName, val);
        // this.cloudAsStore.getProxy().setExtraParam('child', -1);
        this.cloudAsStore.load({

            callback: function (records, operation, success) {
                console_logs('======> records', records);
                gm.me().assyGrid.setLoading(false);


                gm.me().selectTree();
                //gm.me().assyGrid.getSelectionModel().select(0);
                //gm.me().assyGrid.expandAll ();

                // for(var i=0; i<datas.length; i++) {
                // var refer_uid = datas[i].get('refer_uid');

                // refer_uids.push(refer_uid);
                // }
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

        gu.getCmp('target-projectcode-DBM7_ASSY').update(pj_code);

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
//        this.ac_uid = pjuid;
//        var pj_name = record.get('pj_name');
//        var pj_code = record.get('pj_code');

//        this.assy_pj_code = '';
//        this.selectedAssyCode = '';
//        this.selectedPjCode = pj_code;
//        this.selectedPjName = pj_name;
        this.selectedPjUid = -1;

        this.puchaseReqTitle = '[' + item_code + '] ' + item_name;

        var value = '';
        var specification = record.get('specification');
        value = '<font color="#FAEE0E">['+item_code+']  ' + item_name + 
                '<font/><br/><font color="white">' + specification + '</font>';

        gu.getCmp('target-projectcode-DBM7_ASSY').update(value);

        this.srchTreeHandler(this.assyGrid, this.cloudAsStore, 'productcombo-DBM7_ASSY', 'child', true);
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
    registPartFc: function (val, type) {
        gm.me().addNewAction(val, type);
    },
    addNewAction: function (val, type) {
        console_logs('>>>>>>????', gm.me().cloudAsStore);
        
        Ext.Ajax.request({
            // url: CONTEXT_PATH + '/design/bom.do?method=createNew',
            url: CONTEXT_PATH + '/design/bom.do?method=createNewBOM',
            params: val,
            success: function(result, request) {
                if(type == 'ASSY') {
                    gm.me().cloudAsStore.getProxy().setExtraParam('parent_uid', -1);
                    gm.me().cloudAsStore.getProxy().setExtraParam('pj_uid', -1);
                    gm.me().cloudAsStore.getProxy().setExtraParam('child', gm.me().assyTopChild);
                    gm.me().cloudAsStore.load(function() {
                        gm.me().assyGrid.expandAll();
                    });
                } else {
                    gm.me().store.load();
                }
                
                /*
                1. BOM 등록시 해당 모자재가 불출중인지 확인하고, 불출중이면 '설계 다시 되었다'고 상태값 바꾼다.
                2. 생산팀은 '추가신청필요'가 보이면 추가신청으로 불출 요청을 한다.
                3. 불출요청은 기존 같이 취소할 수 있다.
                4. 불출요청서는 기존에 '기불출'했던 자재와 같이 출력된다.
                 */
//                gm.me().cloudProjectTreeStore.load({
//
//                    callback: function(records, operation, success) {
//                        gm.me().selectTreeGrid(null);
//                    	//gm.me().assyGrid.expandAll();
//                    }
//                });

                //Ext.Msg.alert('결과', '저장 성공.');
            },
            failure: function(batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });
    },

    selectTree: function () {
        if (this.selected_tree_record != null) {
            //this.assyGrid.getSelectionModel().select(this.selected_tree_record);
        } else {
            //this.assyGrid.getSelectionModel().select(0);
        }
        this.assyGrid.expandAll();

    },

    selectTreeRecord: function (rec) {

        if (this.selected_tree_record != null && rec.id == this.selected_tree_record.id) {
            console_logs('===== matched', rec);
            this.assyGrid.getSelectionModel().select(rec);
        }
    },

    selectTreeGrid: function (rec) {
        console_logs('selectTreeGrid rec', rec);
        if (rec == null) {
            this.store.load(function (records) {
                gm.me().setMakeTable(records);
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

            this.selectedProduct = rec.get('reserved_integer2');    //제품(여기서는 ASSY명)

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
            this.store.getProxy().setExtraParam('orderBy', "pl_no");
            this.store.getProxy().setExtraParam('ascDesc', "ASC");
            this.store.getProxy().setExtraParam('ac_uid', this.selectedPjUid);

            pl_no = rec.get('pl_no');
            this.store.load(function (records) {
                gm.me().setMakeTable(records);

                var max_num = 0;

                for (var i = 0; i < records.length; i++) {

                    var reserved_integer3 = records[i].get('reserved_integer3');

                    if (max_num < reserved_integer3) {
                        max_num = reserved_integer3;
                    }
                }

                gm.me().mNum = max_num + 1;

                if (pl_no == '---') {
                    console_logs('전체BOM');
                    assytop_uid = rec.get('id');
                    console_logs('rec', rec);
                    console_logs('assytop_uid', assytop_uid);
                    BomGrid = gu.getCmp('DBM7TREE-Assembly');
                    BomGrid.store.getProxy().setExtraParam('reserved_integer2', assytop_uid);
                    BomGrid.store.getProxy().setExtraParam('total_bom', true);
                    BomGrid.store.getProxy().setExtraParam('orderBy', "pl_no");
                    BomGrid.store.getProxy().setExtraParam('ascDesc', "ASC");

                    var datas = [];
                    console_logs('???? cloudAsStore', gm.me().cloudAsStore);
                    for(var i=1; i<gm.me().cloudAsStore.data.items.length; i++) {
                        var s = gm.me().cloudAsStore.data.items[i];
                        datas.push(s.get('unique_uid'));
                    }
                    console_logs('???? datas', datas);
                    BomGrid.store.getProxy().setExtraParam('total_uids', datas);

                    BomGrid.store.load(function (records) {
                        var total_price = 0.0;

                        if(records != null && records.length>0 ) {
                            for (var i = 0; i < records.length; i++) {

                                // var total_sales_price = records[i].get('total_sales_price');
                                var total_sales_price = records[i].get('total_contract_price');
    
                                total_price += parseFloat(total_sales_price);
                            }
                        }
                        
                        var total_val = Ext.util.Format.number(total_price.toFixed(2), '0,00/i');

                        gu.getCmp('target_totalPrice').setHtml('총 금액 : ' + total_val + " 원");
                    });

                    gm.me().parentBomStore.getProxy().setExtraParam('child', gm.me().selectedChild);
                    gm.me().parentBomStore.getProxy().setExtraParam('ac_uid', -1);
                    gm.me().parentBomStore.getProxy().setExtraParam('ascDesc', "ASC");
                    gm.me().parentBomStore.load(function (records) {
                    });
                }
            });
        }


    },

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

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
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },

    doRequestAction: function (isGoodsin) {


        var selections = null;
        var rqstType = null;
        if (isGoodsin) {
            selections = this.gridStock.getSelectionModel().getSelection();
            rqstType = '반출요청';
            console_logs(rqstType, selections);
        } else {
            selections = this.gridMycart.getSelectionModel().getSelection();
            rqstType = '구매요청';
            console_logs(rqstType, selections);
        }

        console_logs('selections', selections);
        if (selections == null || selections.length == 0) {
            Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
        }

        var nique_uids = new Array();
        var new_pr_quans = new Array();

        var userStore = Ext.create('Mplm.store.UserStore', {
            hasNull: false
        });

        var route_type = isGoodsin == true ? 'G' : 'P';

        var puchaseReqTitle = '[' + this.selectedPjCode + '] ' + this.selectedPjName + ' : ' + rqstType;

        var unique_uids = [];
        var child_uids = [];
        var parent_uids = [];
        this.catmapObj = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];

            if (isGoodsin == false) {
                var ac_uid = rec.get('ac_uid');
                if (ac_uid + '' != this.selectedPjUid + '') {
                    Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + this.selectedPjName + '] 프로젝트에 속한 자재만 ' + rqstType + '할 수 있습니다.');
                    return;
                }
//                if (rec.get('goodsout_quan') > 0) {
//                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '" 아이템에 가용재고가 있습니다. 먼저 창고반출요청을 진행하세요.');
//                    return;
//                }

                new_pr_quans.push(rec.get('reserved_double1'));


            } else {
                if (rec.get('goodsout_quan') > rec.get('new_pr_quan')) {
                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 반출요청 수량이 필요수량보다 큽니다.');
                    return;
                } else if (rec.get('goodsout_quan') > rec.get('stock_qty_useful')) {
                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 반출요청 수량이 재고수량보다 큽니다.');
                    return;
                }
                new_pr_quans.push(rec.get('goodsout_quan'));
            }

            unique_uids[i] = rec.get('unique_uid');
            if (new_pr_quans[i] < 0.00000001) {
                Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 요청 수량이 0입니다.');
                return;
            }

            this.catmapObj[i] = rec;

            child_uids.push(rec.get('unique_id_long'));
            parent_uids.push(rec.get('parent'));

        }//emdoffor

        var item_name = rec.get('item_name');
        var item_code = rec.get('item_code');
        var item_qty = selections.length;

        var formItems = [{
            xtype: 'fieldset',
            title: '구매 요청',
            collapsible: false,
            width: '100%',
            style: 'padding:10px',
            //bodyStyle: 'padding:15px',
            defaults: {
                width: '100%',
                //labelWidth: 89,
                //anchor: '100%',
                layout: {
                    type: 'hbox'//,
                    // defaultMargins: {
                    //     top: 10,
                    //     right: 10,
                    //     bottom: 10,
                    //     left: 10
                    // }
                }
            },
            items: [
                new Ext.form.Hidden({
                    name: 'route_type',
                    value: route_type
                }),
                new Ext.form.Hidden({
                    name: 'pj_uid',
                    value: gm.me().selectedPjUid
                }),

                // new Ext.form.Hidden({
                // id: 'hid_userlist_role',
                // name: 'hid_userlist_role'
                // }),
                // new Ext.form.Hidden({
                //     id: 'hid_userlist',
                //     name: 'hid_userlist'
                // }),
                new Ext.form.Hidden({
                    id: 'pr_quan',
                    name: 'pr_quan',
                    value: new_pr_quans
                }),
                new Ext.form.Hidden({
                    id: 'unique_uids',
                    name: 'unique_uids',
                    value: unique_uids
                }),
                new Ext.form.Hidden({
                    id: 'child',
                    name: 'child',
                    value: child_uids
                }),
                new Ext.form.Hidden({
                    id: 'parent',
                    name: 'parent',
                    value: parent_uids
                }),
                new Ext.form.Hidden({
                    id: 'req_date',
                    name: 'req_date'
                }),
                new Ext.form.Hidden({
                    id: 'type',
                    name: 'type',
                    value: 'BOM'
                }),
                {
                    fieldLabel: '요청사항',
                    xtype: 'textarea',
                    rows: 4,
                    anchor: '100%',
                    name: 'req_info'
                }, {
                    xtype: 'datefield',
                    id: 'request_date',
                    name: 'request_date',
                    fieldLabel: toolbar_pj_req_date,
                    format: 'Y-m-d HH:mm:ss',
                    submitFormat: 'Y-m-d HH:mm:ss',// 'Y/m/d H:i:s',
                    dateFormat: 'Y-m-d HH:mm:ss',// 'Y/m/d H:i:s'
                    // value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
                    anchor: '100%'
                }
            ]
        }];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            // defaults: {
            //     layout: 'form',
            //     xtype: 'container',
            //     defaultType: 'textfield',
            //     style: 'width: 100%'
            // },
            items: formItems
        })
        var myHeight = (this.useRouting == true) ? 430 : 410;
        var myWidth = 600;

        var items = [form];
        if (this.useRouting == true) {

            this.rtgapp_store.load();
            var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
            var removeRtgapp = Ext.create('Ext.Action', {
                itemId: 'removeRtgapp',
                glyph: 'xf00d@FontAwesome',
                text: CMD_DELETE,
                disabled: true,
                handler: function (widget, event) {
                    Ext.MessageBox.show({
                        title: delete_msg_title,
                        msg: delete_msg_content,
                        buttons: Ext.MessageBox.YESNO,
                        fn: gm.me().deleteRtgappConfirm,
                        // animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });
                }
            });

            var updown =
                {
                    text: '이동',
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'actioncolumn',
                    width: 70,
                    align: 'center',
                    items: [{
                        icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                        tooltip: 'Up',
                        handler: function (agridV, rowIndex, colIndex) {
                            var record = gm.me().agrid.getStore().getAt(rowIndex);
                            console_log(record);
                            var unique_id = record.get('unique_id');
                            console_log(unique_id);
                            var direcition = -15;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                params: {
                                    direcition: direcition,
                                    unique_id: unique_id
                                },
                                success: function (result, request) {
                                    gm.me().rtgapp_store.load(function () {
                                    });
                                }
                            });

                        }


                    }, '-',
                        {
                            icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                            tooltip: 'Down',
                            handler: function (agridV, rowIndex, colIndex) {

                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = 15;
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                    params: {
                                        direcition: direcition,
                                        unique_id: unique_id
                                    },
                                    success: function (result, request) {
                                        gm.me().rtgapp_store.load(function () {
                                        });
                                    }
                                });
                            }

                        }]
                };

            var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

            this.agrid = Ext.create('Ext.grid.Panel', {
                //title: '결재경로',
                store: this.rtgapp_store,
                border: true,
                frame: true,
                style: 'padding-left:10px;padding-right:10px;',
                width: '100%',
                //layout: 'fit',
                scroll: true,
                selModel: selModel,
                columns: [
                    {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false}
                    , {dataIndex: 'user_id', text: '아이디', sortable: false}
                    , {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                    //,{ dataIndex : 'emp_no', text : '사번',  sortable : false	}
                    //,{ dataIndex : 'company_code', text : '회사 코드',  sortable : false	}
                    , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                    // ,{ dataIndex : 'dept_code', text : '부서 코드',  sortable : false	}
                    //,{ dataIndex : 'app_type', text : 'app_type',  sortable : false	}
                    , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                    // ,{ dataIndex : 'unique_id', text : 'unique_id',  sortable : false	}
                    //,{ dataIndex : 'create_date', text : '생성일자',  sortable : false	}
                    , updown
                ],
                border: false,
                multiSelect: true,
                frame: false,
                dockedItems: [{
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'label',
                            labelWidth: 20,
                            text: '결재 권한자 추가'//,
                            //style: 'color:white;'

                        }, {
                            id: 'user_name',
                            name: 'user_name',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            store: userStore,
                            labelSeparator: ':',
                            emptyText: dbm1_name_input,
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            sortInfo: {field: 'user_name', direction: 'ASC'},
                            typeAhead: false,
                            hideLabel: true,
                            minChars: 2,
                            width: 200,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목이 없습니다',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console_logs('Selected combo : ', combo);
                                    console_logs('Selected record : ', record);
                                    console_logs('Selected Value : ', record.get('unique_id'));

                                    var unique_id = record.get('unique_id');
                                    var user_id = record.get('user_id');
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                        params: {
                                            useruid: unique_id,
                                            userid: user_id
                                            , gubun: 'D'
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            console_log('result:' + result);
                                            if (result == 'false') {
                                                Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                            } else {
                                                gm.me().rtgapp_store.load(function () {
                                                });
                                            }
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }// endofselect
                            }
                        },
                        '->', removeRtgapp

                    ]// endofitems
                }] // endofdockeditems

            }); // endof Ext.create('Ext.grid.Panel',

            this.agrid.getSelectionModel().on({
                selectionchange: function (sm, selections) {
                    if (selections.length) {
                        removeRtgapp.enable();
                    } else {
                        removeRtgapp.disable();
                    }
                }
            });

            items.push(this.agrid);
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '구매 요청',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: items,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {

                    if (btn == "no") {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);

                            //결재사용인 경우 결재 경로 확인
                            if (gm.me().useRouting == true) {

                                var items = gm.me().rtgapp_store.data.items;
                                console_logs('items.length', items.length);
                                if (items.length < 2) {
                                    Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                    return;
                                }

                                var ahid_userlist = new Array();
                                var ahid_userlist_role = new Array();

                                for (var i = 0; i < items.length; i++) {
                                    var rec = items[i];
                                    console_logs('items rec', rec);
                                    ahid_userlist.push(rec.get('usrast_unique_id'));
                                    ahid_userlist_role.push(rec.get('gubun'));
                                }
                                val['hid_userlist'] = ahid_userlist;
                                val['hid_userlist_role'] = ahid_userlist_role;
                            }
                            console_logs('val', val);
                            form.submit({
                                url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
                                params: val,
                                success: function (val, action) {
                                    console_logs('----success----', val);
                                    prWin.close();
                                    gm.me().store.load(function () {
                                    });
                                    gm.me().myCartStore.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    console_logs('----failure----', val);
                                    prWin.close();
                                    gm.me().myCartStore.load(function () {
                                    });
                                    gm.me().store.load(function () {
                                    });

                                }
                            });

                        } // end of formvalid
                    } //else
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show(undefined, function () {
            var combo = gu.getCmp('target_supplier');
            console_logs('combo', combo);
            var selections = gm.me().grid.getSelectionModel().getSelection();
            if (selections == null || selections.length == 0) {
                return;
            }
            var rec = selections[0];
            console_logs('rec', rec);
            var supplier_uid = rec.get('coord_key1');
            var supplier_name = rec.get('supplier_name');


            if (combo != null) { //공급사 자동선택
                // combo.setValue(supplier_uid);
                // var record = combo.findRecordByValue(val);
                // if(record!=null) {
                //     combo.select(record);
                // }
                combo.store.load(function (records) {
                    console_logs('combo.store.load records', records);

                    if (records != null) {
                        for (var i = 0; i < records.length; i++) {
                            console_logs('obj', records[i]);

                            var obj = records[i];
                            try {
                                if (obj.get(combo.valueField) == supplier_uid) {
                                    combo.select(obj);
                                }
                            } catch (e) {
                            }
                        }
                    }//endofif

                });


            }//endof if(combo!=null) {
        });


//        var rtgapp_store = new Ext.data.Store({
//            pageSize: getPageSize(),
//            model: 'RtgApp'
//        });
//
//        var removeRtgapp = Ext.create('Ext.Action', {
//            itemId: 'removeRtgapp',
//            iconCls: 'remove',
//            text: CMD_DELETE,
//            disabled: true,
//            handler: function(widget, event) {
//                Ext.MessageBox.show({
//                    title: delete_msg_title,
//                    msg: delete_msg_content,
//                    buttons: Ext.MessageBox.YESNO,
//                    fn: deleteRtgappConfirm,
//                    // animateTarget: 'mb4',
//                    icon: Ext.MessageBox.QUESTION
//                });
//            }
//        });

    }, //ndofdorequest

    // Define process_request Action
    process_requestAction: Ext.create('Ext.Action', {
        itemId: 'process_requestButton',
        iconCls: 'production',
        text: '생산요청',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '제작요청',
                msg: '제작요청 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: process_requestConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    deleteCartConfirm: function (btn) {
        console_logs('deleteCartConfirm', btn);
        if (btn == 'yes') {
            var selections = gm.me().gridMycart.getSelectionModel().getSelection();
            if (selections) {

                console_logs('selections', selections);

                var targetUid = [];
                for (var i = 0; i < selections.length; i++) {
                    var unique_uid = selections[i].get('unique_uid');
                    targetUid.push(unique_uid);
                }

                console_logs('targetUid', targetUid);

                gm.me().gridMycart.setLoading(true);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=deleteMyCart',
                    params: {
                        assymap_uids: targetUid
                    },
                    success: function (result, request) {
                        gm.me().myCartStore.load(function (records) {

                            for (var i = 0; i < records.length; i++) {
                                var o = records[i];
                                var new_pr_quan = o.get('new_pr_quan');
                                o.set('reserved_double1', new_pr_quan);
                            }
                            gm.me().gridMycart.setLoading(false);

                        });
                    }
                });
            }
        }
    },

    removeCartAction: Ext.create('Ext.Action', {
        itemId: 'removeCartAction',
        iconCls: 'af-remove',
        text: 'Cart' + CMD_DELETE,
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: delete_msg_title,
                msg: delete_msg_content,
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteCartConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    purchase_requestAction: Ext.create('Ext.Action', {

        itemId: 'purchaseButton',
        iconCls: 'font-awesome_4-7-0_dollar_14_0_5395c4_none',
        text: PURCHASE_REQUEST,
        disabled: true,
        handler: function (widget, event) {
            gm.me().doRequestAction(false);

        }// endof handler
    }),


    contextMenuCart: Ext.create('Ext.menu.Menu', {
        items: [/* addElecAction, editAction, */ this.removeCartAction]
    }),

    copiedPartCnt: 0,

    onMygridSelection: function (selections) {
        console_logs('onMygridSelection selections', selections);
        this.selectionLength = selections.length;

        var disable = false; //fPERM_DISABLING()

        if (this.selectionLength > 0) {
            if (disable == true) {
                this.removeCartAction.disable();
                this.pastePartAction.disable();
                this.process_requestAction.disable();
                this.purchase_requestAction.disable();
            } else {
                this.removeCartAction.enable();
                if (this.copiedPartCnt > 0) {
                    this.pastePartAction.enable();
                }

                this.process_requestAction.enable();
                this.purchase_requestAction.enable();

            }
        } else {
            if (this.gGridMycartSelects.length > 1) {
                this.gridMycart.getView().select(this.gGridMycartSelects);
            }

            //this.collapseProperty();
            this.removeCartAction.disable();
            this.pastePartAction.disable();
            this.process_requestAction.disable();
            this.purchase_requestAction.disable();

        }

        this.copyArrayMycartGrid(selections);
    },
    onAssemblyGridSelection: function (selections) {

        if (selections != null && selections.length > 0) {
            var rec = selections[0];

            gUtil.enable(gm.me().addAssyAction);
            gUtil.enable(gm.me().editAssyAction);

            gm.me().selectTreeGrid(rec);

        } else {
            gm.me().selected_tree_record = null;
            gUtil.disable(gm.me().addAssyAction);
            gUtil.disable(gm.me().editAssyAction);

        }
    },
    reSelect: function () {
        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'productcombo-DBM7_ASSY', 'child', true);
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
                        console_logs('result', result.responseText);
                        gm.me().setCopiedAssyQuan(/*result.responseText*/);

                        var assyline = gm.me().selected_tree_record;
                        var type = (assyline.get('depth') > 1) ? 'Assembly' : '프로젝트';

                        gm.me().showToast('결과', result.responseText + ' ' + type + '가 복사되었습니다.');
                        //Ext.MessageBox.alert('경과', result.responseText + ' ' + type + '가 복사되었습니다.');

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
        handler: function(widget, event) {

            var select = gm.me().assyGrid.getSelectionModel().getSelection()[0];

            gm.me().searchStorePart.getProxy().setExtraParam('standard_flag', 'R');
            gm.me().searchStorePart.getProxy().setExtraParam('not_use_query', true);

            this.itemSearchAction = Ext.create('Ext.Action', {
                iconCls: 'af-search',
                text: CMD_SEARCH/*'검색'*/,
                tooltip: CMD_SEARCH/*'검색'*/,
                disabled: false,
                handler: function () {
                    var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                    if (Object.keys(extraParams).length == 0) {
                        Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                    } else {
                        gm.me().searchStorePart.load();
                    }
                }
            });

            var pl_no = gm.me().getPlNoPromise(select, 'R');
            console_logs('>>>>>result', pl_no);

            this.partGrid = Ext.create('Ext.grid.Panel', {
                store: gm.me().searchStorePart,
                cls : 'rfx-panel',
                multiSelect: false,
                autoScroll : true,
                border: false,
                height: 200,
                padding: '0 0 5 0',
                flex: 1,
                layout: 'fit',
                forceFit: false,
                listeners: {
                    select: function(selModel, record, index) {
                        console_logs('>>>>>>recordrecord', record);
                        var item_code = record.get('item_code');
                        var item_name = record.get('item_name');
                        var specification = record.get('specification');
                        var id = record.id;
                        Ext.getCmp(gu.id('item_code')).setValue(item_code);
                        Ext.getCmp(gu.id('item_name')).setValue(item_name);
                        Ext.getCmp(gu.id('specification')).setValue(specification);
                        Ext.getCmp('select_srcahd_uid').setValue(id);
                    }
                },
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        style: 'background-color: #EFEFEF;',
                        items: [
                            {
                                xtype:'checkboxfield',
                                align:'left',
                                fieldLabel:'화면유지',
                                labelWidth: 60,
                                id: 'win_check',
                                checked: gm.me().win_check == true ? true : false,
                                inputValue: '-1',
                                listeners:{
                                    change:function(checkbox, checked){
                                        if(checked) {
                                            gm.me().win_check = true;
                                        } else {
                                            gm.me().win_check = false;
                                        }
                                    }
                                }
                            }, {
                                field_id: 'search_item_code',
                                width: 190,
                                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                id: gu.id('search_item_code_part'),
                                name: 'search_item_code',
                                margin: '3 3 3 3',
                                xtype: 'triggerfield',
                                emptyText: '품번',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click : function() {
                                    this.setValue('');

                                },
                                listeners : {
                                    change : function(fieldObj, e) {
                                        if (e.trim().length > 0) {
                                            gm.me().searchStorePart.getProxy().setExtraParam('item_code', '%'+e+'%');
                                        } else {
                                            delete gm.me().searchStorePart.proxy.extraParams.item_code;
                                        }
                                    },
                                    render: function(c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    },
                                    specialkey: function(f, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                                            if (Object.keys(extraParams).length == 0) {
                                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                            } else {
                                                gm.me().searchStorePart.load();
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                field_id:  'search_item_name',
                                width: 190,
                                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                id: gu.id('search_item_name_part'),
                                name: 'search_item_name',
                                xtype: 'triggerfield',
                                margin: '3 3 3 3',
                                emptyText: '품명',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click : function() {
                                    this.setValue('');
                                },
                                listeners : {
                                    change : function(fieldObj, e) {
                                        if (e.trim().length > 0) {
                                            gm.me().searchStorePart.getProxy().setExtraParam('item_name', '%'+e+'%');
                                        } else {
                                            delete gm.me().searchStorePart.proxy.extraParams.item_name;
                                        }
                                    },
                                    render: function(c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    },
                                    specialkey: function(f, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                                            if (Object.keys(extraParams).length == 0) {
                                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                            } else {
                                                gm.me().searchStorePart.load();
                                            }
                                        }
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
                                            gm.me().searchStorePart.getProxy().setExtraParam('specification', '%'+e+'%');
                                        } else {
                                            delete gm.me().searchStorePart.proxy.extraParams.specification;
                                        }
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    },
                                    specialkey: function(f, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                                            if (Object.keys(extraParams).length == 0) {
                                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                            } else {
                                                gm.me().searchStorePart.load();
                                            }
                                        }
                                    }
                                }
                            },
                            '->',
                            this.itemSearchAction
                        ]
                    }
                ],
                columns: [
                    { text: '품번', width: 150, dataIndex: 'item_code' },
                    { text: '품명', width: 300, dataIndex: 'item_name',
                        renderer: function(value) {
                            return value.replace(/</gi,"&lt;");
                        }
                    },
                    { text: '규격', width: 340, dataIndex: 'specification' }
                ]
            });

            var viewAssemblyForm =  Ext.create('Ext.form.Panel', {
                xtype: 'form',
                width: 800,
                height: 600,
                bodyPadding: 10,
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
                    this.partGrid,
                    new Ext.form.Hidden({
                        name: 'parent',
                        value: select.get('child')
                    }),
                    new Ext.form.Hidden({
                        name: 'pj_uid',
                        value: -1
                    }),
                    new Ext.form.Hidden({
                        id: 'select_srcahd_uid',
                        name: 'srcahd_uid'
                    }),
                    new Ext.form.Hidden({
                        name: 'parent_uid',
                        value: select.id
                    }),
                    new Ext.form.Hidden({
                        name: 'standard_flag',
                        value: 'R'
                    }),
                    new Ext.form.Hidden({
                        name: 'not_sp_code',
                        value: 'B'
                    }),
                    new Ext.form.Hidden({
                        name: 'type',
                        value: 'PART'
                    }),
                    {
                        xtype: 'textfield',
                        name: 'item_code',
                        id: gu.id('item_code'),
                        fieldLabel: '품번',
                        readOnly: true,
                        allowBlank: false,
                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                    },{
                        xtype: 'textfield',
                        name: 'item_name',
                        id: gu.id('item_name'),
                        fieldLabel: '품명',
                        readOnly: true,
                        allowBlank: false,
                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                    },{
                        xtype: 'textfield',
                        fieldLabel: '규격',
                        id: gu.id('specification'),
                        name: 'specification',
                        readOnly: true,
                        allowBlank: true,
                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                    },{
                        xtype: 'numberfield',
                        minValue: 0,
                        width: '100%',
                        id: gu.id('bm_quan'),
                        name: 'bm_quan',
                        decimalPrecision: 3,
                        fieldLabel: gm.me().getColName('bm_quan'),
                        allowBlank: true,
                        value: '1',
                        margins: '0'
                    },{
                        xtype: 'textfield',
                        minValue: 0,
                        width: '100%',
                        id: gu.id('pl_no'),
                        name: 'pl_no',
                        fieldLabel: '순번', //gm.me().getColName('pl_no'),
                        allowBlank: true,
                        value: pl_no
                    }
                ]

            });

            var win = Ext.create('ModalWindow', {
                title: 'Part 추가',
                width: 800,
                height: 680,
                minWidth: 250,
                minHeight: 180,
                items: [viewAssemblyForm],
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = viewAssemblyForm;
                        console_logs('>>>>form', form);
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            gm.me().registPartFc(val, 'PART');
                            if(gm.me().win_check == false) {
                                if (win) {
                                    win.close();
                                }
                            } else {
                                pl_no = (pl_no*1) + 1;
                                Ext.getCmp(gu.id('pl_no')).setValue(pl_no);
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

        }
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
//                        	console_logs('result', result.responseText);
                        gm.me().setCopiedPartQuan(Number(result.responseText));
                        gm.me().showToast('결과', result.responseText + '개 자재가 복사되었습니다. ASSY는 복사되지 않습니다.');
//                            Ext.MessageBox.alert('경과', result.responseText + '개 자재가 복사되었습니다.');

                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax
            } else {
                Ext.MessageBox.alert('알림', '선택한 항목에 자재가 존재하지 않습니다. <br>Assembly 복사를 활용하세요.');
            }


        }
    }),

    //Mycart
    addMyCartAction: Ext.create('Ext.Action', {

        itemId: 'addMyCartAction',
        iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
        text: gm.getMC('CMD_Add_to_Cart', '카트담기'),
        disabled: true,
        handler: function (widget, event) {
            var my_child = new Array();
            var my_assymap_uid = new Array();
            var my_pl_no = new Array();
            var my_pr_quan = new Array();
            var my_item_code = new Array();
            var my_sales_price = new Array();

            var arrExist = [];

            var selections = gm.me().grid.getSelectionModel().getSelection();
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var unique_uid = rec.get('unique_uid');
                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                var pl_no = rec.get('pl_no');
                var sales_price = rec.get('sales_price');

                var bEx = gm.me().isExistMyCart(unique_uid);
                console_logs('bEx', bEx)
                if (bEx == false) {
                    my_child.push(rec.get('unique_id'));
                    my_assymap_uid.push(unique_uid);
                    my_pl_no.push(pl_no);
                    my_pr_quan.push(rec.get('new_pr_quan'));
                    my_item_code.push(item_code);
                    my_sales_price.push(sales_price);
                } else {
                    arrExist.push('[' + pl_no + '] \'' + item_name + '\'');
                }

            }

            if (arrExist.length > 0) {
                Ext.MessageBox.alert('경고', arrExist[0] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');
            }


            if (my_assymap_uid.length > 0) {
//                	var tab = gu.getCmp("main2");
//                	tab.setLoading(true);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
                    params: {
                        childs: my_child,
                        assymap_uids: my_assymap_uid,
                        pl_nos: my_pl_no,
                        pr_quans: my_pr_quan,
                        item_codes: my_item_code,
                        sales_prices: my_sales_price
                    },
                    success: function (result, request) {
                        gm.me().myCartStore.load(function (records) {
                            var tab = gm.me().center;
                            tab.setActiveTab(gm.me().gridMycart);
                            tab.setLoading(false);

                            if (records != null) {
                                for (var i = 0; i < records.length; i++) {
                                    var o = records[i];
                                    var new_pr_quan = o.get('new_pr_quan');
                                    o.set('reserved_double1', new_pr_quan);
                                }
                            }

                            gm.me().grid.setLoading(false);


                            Ext.MessageBox.alert('알림', '카트담기 성공.', function callBack(id) {
                                return;
                            });
                        });
                    }
                });
            }


        }//endofhandler

    }),

    // BOM수정
    editPartAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: 'Part 수정하기',
        disabled: true,
        handler: function (widget, event) {

            var uniqueId = gm.me().assymapUidbom;
            var pcr_div = gm.me().assymapPcr_div;
            var bm_quan = gm.me().assymapBmQuan;
            var hier_pos = gm.me().assyId;
            var pl_no = gm.me().pl_no;
            var reserved_integer1 = gm.me().assylevel;

            var lineGap = 30;
            var bHeight = 250;

            var inputItem = [];
            inputItem.push({
                xtype: 'textfield',
                name: 'hier_pos',
                fieldLabel: 'ID',
                anchor: '-5',
                // readOnly : true,
                // fieldStyle : 'background-color: #ddd;
                // background-image: none;',
                allowBlank: true,
//                    value: hier_pos,
                value: pl_no,
                editable: true
            });
            inputItem.push({
                xtype: 'textfield',
                name: 'level',
                fieldLabel: 'LEVEL',
                anchor: '-5',
                allowBlank: true,
                editable: true // ,
                ,
                value: reserved_integer1
                // readOnly : false
                // ,
                // fieldStyle : 'background-color: #ddd;
                // background-image: none;'
            });

            inputItem.push({
                fieldLabel: 'BOM수량',
                x: 5,
                y: 0 + 3 * lineGap,
                name: 'bm_quan',
                // readOnly : false,
                allowBlank: true,
                editable: true,
                value: bm_quan,
                anchor: '-5' // anchor width by
                // percentage
            });


            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('BomEditPanel'),
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                defaults: {
                    // anchor: '100%',
                    editable: false,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: inputItem
            });
            var win = Ext.create('ModalWindow', {
                title: 'BOM 수정',
                width: 400,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gu.getCmp('BomEditPanel').getForm();
                        if (form.isValid()) {
                            var val = form.getValues(false);

                            var selection = gm.me().grid.getSelectionModel().getSelection();

                            if (selection.length == 1) {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/material.do?method=updateChildBOMTreeWithUsedProduct',
                                    //url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
                                    params: {

                                        assymap_uid: uniqueId, // 유니크아이디
                                        id: val['hier_pos'], // ID
                                        level: val['level'], // Level
                                        pcrDiv: val['pcr_div'], // 조달구분
                                        bm_quan: val['bm_quan'], // bmQuan
                                        child: selection[0].get('unique_id_long'),
                                        parent: selection[0].get('parent')
                                    },
                                    success: function (result, request) {

                                        gm.me().store.load();
                                    },
                                    failure: extjsUtil.failureMessage
                                });

                            } else {
                                Ext.Msg.alert('안내', 'BOM 자재를 하나만 선택하십시오.');
                            }

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

    // PDF 파일 출력기능
    printPDFAction: Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: 'PDF',
        tooltip: 'PartList 출력',
        disabled: false,
        handler: function (widget, event) {
            var ac_uid = gm.me().ac_uid;
            var assy_uid = gm.me().assy_uid;
            console_logs('selected_tree_record', gm.me().selected_tree_record);
            console_logs('class_code', gm.me().classCode);
            console_logs('item_code', gm.me().selectedAssyCode);
            console_logs('model_no', gm.me().modelNo);
            console_logs('description', gm.me().description);
            console_logs('parent', gm.me().selectedChild);
            console_logs('parent_uid', gm.me().selectedAssyUid);

            console_logs('assy_uid', assy_uid);
            console_logs('ac_uid', ac_uid);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/pdf.do?method=printPl',
                params: {
                    rtgast_uid: gm.me().selectedAssyUid,
                    parent_uid: gm.me().selectedAssyUid,
                    po_no: ac_uid,
                    pdfPrint: 'pdfPrint',
                    is_rotate: 'N'
                },
                reader: {
                    pdfPath: 'pdfPath'
                },
                success: function (result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var pdfPath = jsonData.pdfPath;
                    console_logs(pdfPath);
                    if (pdfPath.length > 0) {
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                        top.location.href = url;
                    }
                },
                failure: extjsUtil.failureMessage
            });


        }
    }),

    // 자재를 사용중인 제품
    usingProductAction: Ext.create('Ext.Action', {
        iconCls: 'af-check',
        text: '자재를 사용중인 제품',
        tooltip: '해당 자재를 사용중인 제품 보기',
        disabled: true,
        handler: function (widget, event) {

            var updatePartAction = Ext.create('Ext.Action', {
                iconCls: 'af-check',
                text: '일괄자재변경',
                tooltip: '해당 자재를 다른 자재로 일괄 변경합니다',
                disabled: true,
                handler: function (widget, event) {

                    var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                    var standardFlag = rec.get('standard_flag');

                    if (standardFlag === 'A') {
                        Ext.Msg.alert('', 'ASSY는 삭제만 가능합니다.');
                        return null;
                    }

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

                    if(salesPrice == null || salesPrice === '') {
                        salesPrice = 0;
                    }

                    var records = gm.me().store.data.items;
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
                            console_logs('result.responseText', result);
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
                                        // gu.getCmp('maker_name').setValue(record.get('maker_name'));
                                        //gu.getCmp('unit_code').setValue(record.get('unit_code'));
                                        gu.getCmp('sales_price').setValue(record.get('sales_price'));
                                        //gu.getCmp('currency').setValue(record.get('currency'));
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
                                    labelWidth: 60
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
                                        name: 'past_item_code',
                                        id: gu.id('past_item_code'),
                                        fieldLabel: '기존품번',
                                        readOnly: true,
                                        allowBlank: false,
                                        fieldStyle: 'background-color: #333333; background-image: none; color: #FFFFFF;',
                                        value: itemCode
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'item_code',
                                        id: gu.id('item_code'),
                                        fieldLabel: '변경품번',
                                        readOnly: true,
                                        allowBlank: false,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                        value: ''
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'item_name',
                                        id: gu.id('item_name'),
                                        fieldLabel: '품명',
                                        readOnly: true,
                                        allowBlank: false,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '규격',
                                        id: gu.id('specification'),
                                        name: 'specification',
                                        readOnly: true,
                                        allowBlank: true,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: gm.me().getColName('maker_name'),
                                        id: gu.id('maker_name'),
                                        name: 'maker_name',
                                        readOnly: true,
                                        allowBlank: true,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                    }, {
                                        xtype: 'numberfield',
                                        width: '100%',
                                        id: gu.id('sales_price'),
                                        name: 'sales_price',
                                        fieldLabel: gm.me().getColName('sales_price'),
                                        allowBlank: true,
                                        margins: '0'
                                    }, /* {
                                        xtype: 'textfield',
                                        width: '100%',
                                        fieldLabel: '통화',
                                        id: gu.id('currency'),
                                        name: 'currency',
                                        allowBlank: true,
                                    }, {
                                        xtype: 'textfield',
                                        fieldLabel: '단위',
                                        name: 'unit_code',
                                        id: gu.id('unit_code'),
                                        width: '100%'
                                    },*/ {
                                        xtype: 'textfield',
                                        width: '100%',
                                        fieldLabel: '위치',
                                        margin: '0 0 70 0',
                                        name: 'reserved_varchar2'
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

                            var assymapUids = [];
                            var selections = usingProductGrid.getSelectionModel().getSelection();

                            for (var i = 0; i < selections.length; i++) {
                                assymapUids.push(selections[i].get('unique_uid'));
                            }

                            var winPart = Ext.create('ModalWindow', {
                                title: '일괄자재변경',
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

                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=changeAssyPartMulti',
                                                params: {
                                                    assymapUids: assymapUids,
                                                    reserved_varchar2: val['reserved_varchar2'],
                                                    item_code: val['item_code'],
                                                    child: val['unique_id'],
                                                    sales_price: val['sales_price']
                                                },
                                                success: function (result, request) {

                                                    gm.me().store.load();
                                                },
                                                failure: extjsUtil.failureMessage
                                            });

                                            if (winPart) {
                                                winPart.close();
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
            });

            var usingProductGrid =
                Ext.create('Rfx2.view.company.kbtech.grid.ParentAssyGrid', {
                    id: gu.id('parentAssyGrid'),
                    border: false,
                    resizable: false,
                    autoScroll: true,
                    autoHeight: true,
                    collapsible: false,
                    forceFit: true,
                    store: gm.me().usingProductStore,
                    selModel : 'checkboxmodel',
                    layout: 'fit',
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().usingProductStore,
                        displayInfo: true,
                        displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                        emptyMsg: "표시할 항목이 없습니다.",
                        listeners: {
                            beforechange: function (page, currentPage) {
                                this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * 1000000);
                                this.getStore().getProxy().setExtraParam('page', currentPage);
                                this.getStore().getProxy().setExtraParam('limit', 1000000);
                            }
                        }
                    }),
                    dockedItems: [{
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            updatePartAction
                        ]
                    }],
                    listeners: {
                        selectionchange: function (view, selections, options) {
                            if (selections.length > 0) {
                                updatePartAction.enable();
                            } else {
                                updatePartAction.disable();
                            }
                        }
                    }
                });//productGrid of End


            var productWin = Ext.create('Ext.Window', {
                title: '자재를 사용중인 제품',
                width: 850,
                height: 650,
                modal: true,
                plain: true,
                layout: 'fit',
                items: [
                    usingProductGrid
                ],
                buttons: [{
                    text: CMD_OK,
                    handler: function (btn) {
                        if (productWin) {
                            productWin.close();
                        }
                    }
                }]
            });

            var child = gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long');

            //gm.me().usingProductStore.getProxy().setExtraParam('sp_code_list', 'KB,KC,KL');
            gm.me().usingProductStore.getProxy().setExtraParam('usingProduct', child);
            gm.me().usingProductStore.getProxy().setExtraParam('ac_uid', -1);
            gm.me().usingProductStore.getProxy().setExtraParam('limit', 1000000);
            gm.me().usingProductStore.getProxy().setExtraParam('ascDesc', "ASC");

            gm.me().usingProductStore.load(function (records) {
            });

            productWin.show();
        }
    }),

    printExcelAction: Ext.create('Ext.Action', {
        itemId: 'printExcelAction',
        iconCls: null,
        glyph: 'f1c3@FontAwesome',
        text: 'Excel',
        disabled: false,
        handler: function (widget, event) {
            gu.printExcelHandler();
        }
    }),

    printExcelActionAll: Ext.create('Ext.Action', {
        itemId: 'printExcelActionAll',
        iconCls: null,
        glyph: 'f1c3@FontAwesome',
        text: 'Excel',
        disabled: false,
        handler: function (widget, event) {
            gu.printExcelHandler(gm.me().bomAll);
        }
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

            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

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
            // inputItem.push(
            // {
            // xtype: 'textfield',
            // name: 'assy_code',
            // fieldLabel: 'Assembly 코드',
            // allowBlank:false,
            // value: assy_code,
            // anchor: '-5',
            // readOnly : true,
            // fieldStyle : 'background-color: #ddd; background-image: none;'
            // });
            inputItem.push({
                xtype: 'textfield',
                name: 'pl_no',
                fieldLabel: '순번',
                allowBlank: false,
                value: pl_no,
                anchor: '-5'
            });
            inputItem.push({
                xtype: 'numberfield',
                name: 'bm_quan',
                fieldLabel: '소요량',
                allowBlank: false,
                value: bm_quan,
                anchor: '-5'
            });
            // inputItem.push({
            //     xtype: 'textfield',
            //     name: 'assy_name',
            //     fieldLabel: 'Assembly 명',
            //     allowBlank: false,
            //     value: assy_name,
            //     anchor: '-5'
            // });


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
                                    gm.me().assyGrid.getStore().getProxy().setExtraParam('child', gm.me().assyTopChild);
                                    gm.me().assyGrid.getStore().load(function() {
                                        gm.me().assyGrid.expandAll();
                                    });
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

    getPlNoPromise:  function(select, standard_flag) {
        var unique_id = select.id;
        var srcahd_uid = select.get('child');
        var ac_uid = select.get('ac_uid');
        var value = 0;
         Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=getLastPlNoDSMF',
            async: false,
            params: {
                assymap_uid:unique_id,
                srcahd_uid:srcahd_uid,
                ac_uid:ac_uid,
                standard_flag:standard_flag
            },
            success: function (result, request) {
                var jsonData = Ext.decode(result.responseText);
                value = jsonData.result;
            },
            failure: extjsUtil.failureMessage
        });
        return value;
    },

    addAssyAction: Ext.create('Ext.Action', {
        itemId: 'addAssyAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {

            var select = gm.me().assyGrid.getSelectionModel().getSelection()[0];

            gm.me().searchStoreAssy.getProxy().setExtraParam('standard_flag', 'A');
            gm.me().searchStoreAssy.getProxy().setExtraParam('not_use_query', true);

            var reserved_integer2 = select.get('reserved_integer2');
            if(reserved_integer2 == null || reserved_integer2 < 1) {
                reserved_integer2 = select.get('id');
            };

            this.itemSearchAction = Ext.create('Ext.Action', {
                iconCls: 'af-search',
                text: CMD_SEARCH/*'검색'*/,
                tooltip: CMD_SEARCH/*'검색'*/,
                disabled: false,
                handler: function () {
                    var extraParams = gm.me().searchStoreAssy.getProxy().getExtraParams();
                    if (Object.keys(extraParams).length == 0) {
                        Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                    } else {
                        gm.me().searchStoreAssy.load();
                    }
                }
            });

            var pl_no = gm.me().getPlNoPromise(select, 'A');

            this.assemblyGrid = Ext.create('Ext.grid.Panel', {
                store: gm.me().searchStoreAssy,
                cls : 'rfx-panel',
                multiSelect: false,
                autoScroll : true,
                border: false,
                height: 200,
                padding: '0 0 5 0',
                flex: 1,
                layout: 'fit',
                forceFit: false,
                listeners: {
                    select: function(selModel, record, index) {
                        console_logs('>>>>>>recordrecord', record);
                        var item_code = record.get('item_code');
                        var item_name = record.get('item_name');
                        var specification = record.get('specification');
                        var id = record.id;
                        Ext.getCmp(gu.id('item_code')).setValue(item_code);
                        Ext.getCmp(gu.id('item_name')).setValue(item_name);
                        Ext.getCmp(gu.id('specification')).setValue(specification);
                        Ext.getCmp('select_srcahd_uid').setValue(id);
                    }
                },
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        style: 'background-color: #EFEFEF;',
                        items: [
                            {
                                xtype:'checkboxfield',
                                align:'left',
                                fieldLabel:'화면유지',
                                labelWidth: 60,
                                id: 'win_check',
                                checked: gm.me().win_check == true ? true : false,
                                inputValue: '-1',
                                listeners:{
                                    change:function(checkbox, checked){
                                        if(checked) {
                                            gm.me().win_check = true;
                                        } else {
                                            gm.me().win_check = false;
                                        }
                                    }
                                }
                            }, {
                                field_id: 'search_item_code',
                                width: 190,
                                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                id: gu.id('search_item_code_part'),
                                name: 'search_item_code',
                                margin: '3 3 3 3',
                                xtype: 'triggerfield',
                                emptyText: '품번',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click : function() {
                                    this.setValue('');

                                },
                                listeners : {
                                    change : function(fieldObj, e) {
                                        if (e.trim().length > 0) {
                                            gm.me().searchStoreAssy.getProxy().setExtraParam('item_code', '%'+e+'%');
                                        } else {
                                            delete gm.me().searchStoreAssy.proxy.extraParams.item_code;
                                        }
                                    },
                                    render: function(c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    },
                                    specialkey: function(f, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            var extraParams = gm.me().searchStoreAssy.getProxy().getExtraParams();
                                            if (Object.keys(extraParams).length == 0) {
                                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                            } else {
                                                gm.me().searchStoreAssy.load();
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                field_id:  'search_item_name',
                                width: 190,
                                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                id: gu.id('search_item_name_part'),
                                name: 'search_item_name',
                                xtype: 'triggerfield',
                                margin: '3 3 3 3',
                                emptyText: '품명',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click : function() {
                                    this.setValue('');
                                },
                                listeners : {
                                    change : function(fieldObj, e) {
                                        if (e.trim().length > 0) {
                                            gm.me().searchStoreAssy.getProxy().setExtraParam('item_name', '%'+e+'%');
                                        } else {
                                            delete gm.me().searchStoreAssy.proxy.extraParams.item_name;
                                        }
                                    },
                                    render: function(c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    },
                                    specialkey: function(f, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            var extraParams = gm.me().searchStoreAssy.getProxy().getExtraParams();
                                            if (Object.keys(extraParams).length == 0) {
                                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                            } else {
                                                gm.me().searchStoreAssy.load();
                                            }
                                        }
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
                                            gm.me().searchStoreAssy.getProxy().setExtraParam('specification', '%'+e+'%');
                                        } else {
                                            delete gm.me().searchStoreAssy.proxy.extraParams.specification;
                                        }
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    },
                                    specialkey: function(f, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            var extraParams = gm.me().searchStoreAssy.getProxy().getExtraParams();
                                            if (Object.keys(extraParams).length == 0) {
                                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                            } else {
                                                gm.me().searchStoreAssy.load();
                                            }
                                        }
                                    }
                                }
                            },
                            '->',
                            this.itemSearchAction
                        ]
                    }
                ],
                columns: [
                    { text: '품번', width: 150, dataIndex: 'item_code' },
                    { text: '품명', width: 300, dataIndex: 'item_name',
                        renderer: function(value) {
                            return value.replace(/</gi,"&lt;");
                        }
                    },
                    { text: '규격', width: 340, dataIndex: 'specification' }
                ]
            });

            var viewAssemblyForm =  Ext.create('Ext.form.Panel', {
                xtype: 'form',
                width: 800,
                height: 600,
                bodyPadding: 10,
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
                    this.assemblyGrid,
                    new Ext.form.Hidden({
                        name: 'child',
                        value: select.get('child')
                    }),
                    new Ext.form.Hidden({
                        name: 'pj_uid',
                        value: -1
                    }),
                    new Ext.form.Hidden({
                        id: 'select_srcahd_uid',
                        name: 'srcahd_uid'
                    }),
                    new Ext.form.Hidden({
                        name: 'parent_uid',
                        value:select.id
                    }),
                    new Ext.form.Hidden({
                        name: 'standard_flag',
                        value: 'A'
                    }),
                    new Ext.form.Hidden({
                        name: 'not_sp_code',
                        value: 'B'
                    }),
                    new Ext.form.Hidden({
                        name: 'type',
                        value: 'ASSY'
                    }),
                    new Ext.form.Hidden({
                        name: 'reserved_integer1',
                        value: select.get('reserved_integer1') + 1
                    }),
                    new Ext.form.Hidden({
                        name: 'reserved_integer2',
                        value:reserved_integer2
                        // value: select.get('reserved_integer2') 
                    }),
                    {
                        xtype: 'textfield',
                        name: 'item_code',
                        id: gu.id('item_code'),
                        fieldLabel: '품번',
                        readOnly: true,
                        allowBlank: false,
                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                    },{
                        xtype: 'textfield',
                        name: 'item_name',
                        id: gu.id('item_name'),
                        fieldLabel: '품명',
                        readOnly: true,
                        allowBlank: false,
                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                    },{
                        xtype: 'textfield',
                        fieldLabel: '규격',
                        id: gu.id('specification'),
                        name: 'specification',
                        readOnly: true,
                        allowBlank: true,
                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                    },{
                        xtype: 'numberfield',
                        minValue: 0,
                        width: '100%',
                        id: gu.id('bm_quan'),
                        name: 'bm_quan',
                        decimalPrecision: 3,
                        fieldLabel: gm.me().getColName('bm_quan'),
                        allowBlank: true,
                        value: '1',
                        margins: '0'
                    },{
                        xtype: 'textfield',
                        minValue: 0,
                        width: '100%',
                        id: gu.id('pl_no'),
                        name: 'pl_no',
                        fieldLabel:'순번', // gm.me().getColName('pl_no'),
                        allowBlank: true,
                        value: pl_no
                    }
                ]

            });

            var win = Ext.create('ModalWindow', {
                title: 'Assy 추가',
                width: 800,
                height: 680,
                minWidth: 250,
                minHeight: 180,
                items: [viewAssemblyForm],
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = viewAssemblyForm;
                        console_logs('>>>>form', form);
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            // gm.me().registPartFc(val, 'ASSY');

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=cloudAssyCreateAndCopyBom',
                                params: {
                                    parent_uid: val['parent_uid'],
                                    parent: val['child'],
                                    ac_uid: -1,
                                    pl_no: val['pl_no'],
                                    bm_quan: val['bm_quan'],
                                    child: val['srcahd_uid'],
                                    item_name: val['item_name'],
                                    level: val['reserved_integer1'],
                                    assytopUid: val['reserved_integer2']
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

                            if(gm.me().win_check == false) {
                                if (win) {
                                    win.close();
                                }
                            } else {
                                // pl_no = (pl_no*1) + 1;
                                // Ext.getCmp(gu.id('pl_no')).setValue(pl_no);
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
        console_logs('record', record);
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

        console_logs('====selectedAssyUid', gm.me().selectedAssyUid);
        console_logs('====unique_uid', unique_uid);

        // refer_uid update(-1 : 참조해제)
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=updateSrcahdAssymap',
            params: {
                unique_uid: unique_uid,
                refer_uid: 1
            },
            success: function (result, request) {
                gm.me().cloudAsStore.load(function (records) {
                });
            },
            failure: extjsUtil.failureMessage
        });

        // 참조해제된 assy insert
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=addReferPartAssymap',
            params: {
                project_uid: gm.me().selectedPjUid,
                parent: gm.me().selectedChild,
                parent_uid: gm.me().selectedAssyUid,
                resetQty: 'false',
                resetPlno: 'false',
                uidList: uids,
                refer_uid: refer_uid
            },
            success: function (result, request) {
                gm.me().cloudAsStore.load(function () {
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

                    console_logs('target id', id);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=getChildQuan',
                        params: {
                            parent: id
                        },
                        success: function (result, request) {
                            console_logs('result', result);
                            var jsonData = Ext.decode(result.responseText);
                            console_logs('jsonData', jsonData);
                            var quan = jsonData['result'];
                            if (quan > 0) {
                                Ext.MessageBox.alert('오류', '하위 Assy 또는 BOM이 존재하여 삭제할 수 없습니다.');
                            } else {
                                var unique_uid = gm.me().selected_tree_record.data.unique_uid;

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/design/bom.do?method=deleteAssy',
                                    params: {
                                        assymap_uid: unique_uid
                                    },
                                    success: function (result, request) {
                                        console_logs('result', result);
                                        var jsonData = Ext.decode(result.responseText);
                                        console_logs('jsonData', jsonData);
                                        gm.me().reSelect();
                                        gu.getCmp('DBM7TREE-Assembly').store.load();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    },
    searchStoreAssy : Ext.create('Mplm.store.MaterialSearchStore'),
    searchStorePart : Ext.create('Mplm.store.MaterialSearchStore'),
    //결재 기능 사용
    useRouting: (vCompanyReserved4 == 'DABP01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,
    //설계요청한 프로벡트만
    requestedProjectOnly: (vCompanyReserved4 == 'KWLM01KR') ? true : false,
    scakaValve: (vCompanyReserved4 == 'SKNH01KR'),
    //도면/문서 기능사용여부
    useDocument: (vCompanyReserved4 == 'KWLM01KR' || vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,
    // ftpSetting: (vCompanyReserved4 == 'APM01KR') ? true : false
    ftpSetting: false,
    class_type: '',
    claastLoad: function () {

        var productcombo = Ext.getCmp(gu.id('productcombo-DBM7_ASSY'));
        productcombo.store.getProxy().setExtraParam({});
        var claastlevel1 = Ext.getCmp('DBM7_ASSY-PRDLV1').getValue();
        var claastlevel2 = Ext.getCmp('DBM7_ASSY-PRDLV2').getValue();
        var claastlevel3 = Ext.getCmp('DBM7_ASSY-PRDLV3').getValue();
        var claastlevel4 = Ext.getCmp('DBM7_ASSY-PRDLV4').getValue();

        productcombo.store.getProxy().setExtraParam('sp_code', claastlevel1);

        switch (claastlevel1) {

            case 'KC':
                productcombo.store.getProxy().setExtraParam('srcadt_varchar1', claastlevel2);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar2', claastlevel3);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar3', claastlevel4);
                break;
            case 'KB':
                productcombo.store.getProxy().setExtraParam('srcadt_varchar9', claastlevel2);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar10', claastlevel3);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar11', claastlevel4);
                break;
        }
        productcombo.store.load(function (records) {
        });

    },
    claastReset: function (no) {

    },
    claastLoad2: function () {

        var productcombo = Ext.getCmp('DBM7_ASSY_srcahd_uid');
        productcombo.store.getProxy().setExtraParam({});
        var claastlevel1 = Ext.getCmp('DBM7_ASSY-PRDLV1-ADD').getValue();
        var claastlevel2 = Ext.getCmp('DBM7_ASSY-PRDLV2-ADD').getValue();
        var claastlevel3 = Ext.getCmp('DBM7_ASSY-PRDLV3-ADD').getValue();
        var claastlevel4 = Ext.getCmp('DBM7_ASSY-PRDLV4-ADD').getValue();

        productcombo.store.getProxy().setExtraParam('sp_code', claastlevel1);

        switch (claastlevel1) {
            case 'KC':
                productcombo.store.getProxy().setExtraParam('srcadt_varchar1', claastlevel2);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar2', claastlevel3);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar3', claastlevel4);
                break;
            case 'KB':
                productcombo.store.getProxy().setExtraParam('srcadt_varchar9', claastlevel2);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar10', claastlevel3);
                productcombo.store.getProxy().setExtraParam('srcadt_varchar11', claastlevel4);
                break;
        }
        productcombo.store.load(function (records) {
        });

    },
    claastReset2: function (no) {
        var claastcombo1 = Ext.getCmp('DBM7_ASSY-PRDLV1-ADD').getValue();
        var claastcombo2 = Ext.getCmp('DBM7_ASSY-PRDLV2-ADD');
        var claastcombo3 = Ext.getCmp('DBM7_ASSY-PRDLV3-ADD');
        var claastcombo4 = Ext.getCmp('DBM7_ASSY-PRDLV4-ADD');

        switch (no) {

            case 1:
                claastcombo2.clearValue();
                claastcombo2.store.removeAll();
                claastcombo3.clearValue();
                claastcombo3.store.removeAll();
                claastcombo4.clearValue();
                claastcombo4.store.removeAll();
                break;
            case 2:
                claastcombo3.clearValue();
                claastcombo3.store.removeAll();
                claastcombo4.clearValue();
                claastcombo4.store.removeAll();
                break;
            case 3:
                claastcombo4.clearValue();
                claastcombo4.store.removeAll();
                break;
            case 4:
                claastcombo2.clearValue();
                claastcombo2.store.removeAll();
                claastcombo3.clearValue();
                claastcombo3.store.removeAll();
                claastcombo4.clearValue();
                claastcombo4.store.removeAll();

                break;
        }
    },
    mNum: 0,
    changeAssy: function () {

        var changeAssyForm = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: 5,
            region: 'center',
            layout: 'column',
            defaults: {
                layout: 'form',
                xtype: 'container',
                defaultType: 'textfield',
                style: 'width: 50%'
            },
            items: [{
                xtype: 'fieldset',
                title: 'ASSY 변경',
                width: 490,
                height: 100,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                    }
                },
                items: [
                    {
                        id: gu.id('changeAssy'),
                        xtype: 'combo',
                        fieldLabel: '변경할 ASSY',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        mode: 'local',
                        editable: true,
                        width: '85%',
                        queryMode: 'remote',
                        emptyText: '제품을 선택하세요.',
                        displayField: 'item_name',
                        valueField: 'unique_id',
                        store: Ext.create('Rfx2.store.company.dsmf.ChangeAssyStore', {}),
                        sortInfo: {field: 'specification', direction: 'ASC'},
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: false,
                        hideTrigger: true,
                        name: 'changeAssy',
                        anchor: '100%',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목이 없습니다',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                            }
                        },
                        pageSize: 20,
                        triggerAction: 'all',
                        listeners: {

                            beforequery: function (queryEvent) {
                                gu.getCmp('changeAssy').store.getProxy().setExtraParam('query', null);
                                gu.getCmp('changeAssy').store.getProxy().setExtraParam('itemCodeOldAndNew', gu.getCmp('changeAssy').getValue());
                            },
                            select: function (combo, record) {

                            },
                            pageSize: 10
                        }
                    }
                ]
            }]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'ASSY 변경',
            width: 500,
            height: 180,
            items: changeAssyForm,
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {

                        var form = changeAssyForm.getForm();
                        console_logs('form value', form.getValues());

                        var productMtrlArr = [];

                        var selections = gm.me().parentAssyGrid.getSelectionModel().getSelection();
                        console_logs('>>>>>>>>>>>Select', selections);
                        for (var i = 0; i < selections.length; i++) {
                            productMtrlArr.push(selections[i].get('parent_uid'));
                        }

                        prWin.setLoading(true);

                        form.submit({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=changeProductAssemblyMulti',
                            params: {
                                product_uids: productMtrlArr,
                                uid_srcahd : gm.me().selectedChild
                            },
                            success: function (val, action) {
                                prWin.setLoading(false);
                                prWin.close();
                                Ext.Msg.alert('성공', 'ASSY 변경을 완료 하였습니다.');
                                gm.me().parentBomStore.load();
                            },
                            failure: function (val, action) {
                                prWin.setLoading(false);
                                prWin.close();
                                Ext.Msg.alert('실패', 'ASSY 변경을 실패 하였습니다.');
                                gm.me().parentBomStore.load();
                            }
                        });
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
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
    win_check:true,
    toResetData: function() {
        gm.me().store.load(function (records) {
            // gm.me().setMakeTable(records);

            var max_num = 0;

            for (var i = 0; i < records.length; i++) {

                var reserved_integer3 = records[i].get('reserved_integer3');
                console_logs('>>>reserved_integer3', reserved_integer3);
                console_logs('>>>gm.me().mNum', gm.me().mNum);

                if (max_num < reserved_integer3) {
                    max_num = reserved_integer3;
                }
            }

            gm.me().mNum = max_num + 1;
            var rec = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var pl_no = rec.get('pl_no');
            if (pl_no == '---') {
                console_logs('전체BOM');
                assytop_uid = rec.get('id');
                console_logs('rec', rec);
                console_logs('assytop_uid', assytop_uid);
                BomGrid = gu.getCmp('DBM7TREE-Assembly');
                BomGrid.store.getProxy().setExtraParam('reserved_integer2', assytop_uid);
                BomGrid.store.getProxy().setExtraParam('orderBy', "pl_no");
                BomGrid.store.getProxy().setExtraParam('ascDesc', "ASC");
                BomGrid.store.load(function (records) {
                    var total_price = 0.0;

                    for (var i = 0; i < records.length; i++) {

                        var total_sales_price = records[i].get('total_sales_price');

                        total_price += parseFloat(total_sales_price);
                    }

                    gu.getCmp('target_totalPrice').setHtml('총 금액 : ' + total_price.toFixed(2));
                });

                gm.me().parentBomStore.getProxy().setExtraParam('child', gm.me().selectedChild);
                gm.me().parentBomStore.getProxy().setExtraParam('ac_uid', -1);
                gm.me().parentBomStore.getProxy().setExtraParam('ascDesc', "ASC");
                gm.me().parentBomStore.load(function (records) {
                });
            }
        });
    }

});