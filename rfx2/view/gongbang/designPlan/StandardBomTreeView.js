Ext.define('Rfx2.view.gongbang.designPlan.StandardBomTreeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'standard-bom-tree-view',
    initComponent: function () {

        this.columns.splice(0, 0, {
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

        // bomdtl store로 변경해야함
        // this.createStore('Rfx2.model.company.bioprotech.PartLineNP', [{
        //     property: 'pl_no',
        //     direction: 'ASC'
        // }],
        //     gm.pageSize
        //     , {
        //         creator: 'a.creator',
        //         unique_id: 'a.unique_uid'
        //     }
        //     , ['assymap']
        // );

        this.createStore('Rfx2.model.company.bioprotech.Bomdtl', [{
                // property: 'pl_no',
                // direction: 'ASC'
            }],
            gm.pageSize
            , {
                // creator: 'a.creator',
                // unique_id: 'a.unique_uid'
            }
            , ['bomdtl']
        );


        var buttonToolbar1 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartAction,
                this.editPartAction,
                this.removePartAction,
                '-',
                // this.copyPartAction,
                // this.pastePartAction,
                // '-',
                // this.printPDFAction,
                '-',
                // this.usingProductAction,
                // this.downloadSheetAction,
                this.getHistoryAction,
                // this.dlBomParentChildExcelAction,
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
            // 버튼 제어
            if (selections.length /*&& gm.me().depth == 1*/) {
                rec = selections[0];

                gm.me().assymapUidbom = rec.get('unique_uid');
                gm.me().assymapPcr_div = rec.get('request_comment');
                gm.me().assymapBmQuan = rec.get('bm_quan');
                gm.me().assyId = rec.get('hier_pos');
                gm.me().assylevel = rec.get('reserved_integer1');
                gm.me().pl_no = rec.get('pl_no');
                gu.enable(gm.me().addPcsPlanAction);
                // 
                if (gm.me().selected_tree_record.get('depth') <= 1) {
                    // gu.enable(gm.me().editPartAction);
                    gm.me().editPartAction.enable();
                    gm.me().removePartAction.enable();
                } else {
                    gm.me().editPartAction.disable();
                    gm.me().removePartAction.disable();
                }
                // gu.enable(gm.me().copyPartAction);
                // gu.enable(gm.me().removePartAction);
                // gu.enable(gm.me().usingProductAction);
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

        var search =
            Ext.create('Ext.panel.Panel', {
                region: 'north',
                //height: 30,
                width: 200,
                bodyStyle: 'background: #F5F5F5;padding-bottom:0; margin-bottom:0',
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            {
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
                                    specialkey: function (fieldObj, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().productStore.load(function (o) {
                                                console_logs('o', o);
                                            });
                                        }
                                    },
                                    change: function (fieldObj, e) {
                                        gm.me().productStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    }
                                }
                            }/*, '->',{
                        iconCls: 'arrow_up_black',
                        scale: 'small',
                        //text: '<',
                        cls: 'my-menu-item',
                        handler: function(btn) {
                            gm.me().north.collapse();
                        }
                    }*/]
                    },
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            {

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
                                    specialkey: function (fieldObj, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().productStore.load(function (o) {
                                                console_logs('o', o);
                                            });
                                        }
                                    },
                                    change: function (fieldObj, e) {
                                        gm.me().productStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    }
                                }
                            }]
                    },
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            {

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
                                    specialkey: function (fieldObj, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().productStore.load(function (o) {
                                                console_logs('o', o);
                                            });
                                        }
                                    },
                                    change: function (fieldObj, e) {
                                        gm.me().productStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    }
                                }
                            }, {
                                id: gu.id('productcombo-DBM7_TREE'),
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                mode: 'local',
                                editable: false,
                                hidden: true,
                                width: '100.5%',
                                queryMode: 'remote',
                                emptyText: '제품을 선택하세요.',
                                displayField: 'item_name',
                                valueField: 'unique_id',
                                store: Ext.create('Rfx2.store.company.bioprotech.ProductStore', {}),
                                sortInfo: {field: 'specification', direction: 'ASC'},
                                minChars: 1,
                                typeAhead: true,
                                hideLabel: true,
                                hideTrigger: false,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                                    }
                                },
                                pageSize: 50,
                                triggerAction: 'all',
                                listeners: {
                                    keyup: function () {
                                        var value = gu.getCmp('productcombo-DBM7_TREE').getValue();
                                        gm.me().claastReset(0);
                                    },
                                    expand: function (field) {
                                        gu.getCmp('productcombo-DBM7_TREE').store.getProxy().setExtraParam('sp_code_list', 'G,F,H,A');
                                        gu.getCmp('productcombo-DBM7_TREE').getStore().load();
                                    },
                                    select: function (combo, record) {
                                        gm.me().assyTopParent = combo.getValue();
                                        var srcahd_uid = record.get('unique_id');
                                        gm.me().selected_tree_record = null;
                                        gm.me().selectAssymapCombo(record);
                                    },
                                    pageSize: 10
                                }
                            }



                            /*,
                             {
                             width: '25%',
                             field_id: 'search_old_item_code',
                             fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                             id: gu.id('search_old_item_code'),
                             name: 'search_old_item_code',
                             xtype: 'triggerfield',
                             emptyText: '기존품명',
                             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                             onTrigger1Click: function () {
                             this.setValue('');
                             },
                             listeners: {
                             change: function (fieldObj, e) {
                             gu.getCmp('productcombo-DBM7_TREE').store.getProxy().setExtraParam('old_item_code', '%' + e + '%');
                             },
                             render: function (c) {
                             Ext.create('Ext.tip.ToolTip', {
                             target: c.getEl(),
                             html: c.emptyText
                             });
                             }
                             }
                             }*/
                        ]
                    },
                    {
                        dock: 'bottom',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: ['->',
                            {
                                iconCls: 'af-search',
                                text: CMD_SEARCH,
                                tooltip: CMD_SEARCH,
                                handler: function () {
                                    gm.me().verReset();
                                    gm.me().productStore.load(function (o) {
                                        console_logs('o', o);
                                    });
                                    gm.me().bomverStore.removeAll();
                                    // gu.getCmp('target-projectcode-DBM7_TREE').update(null);
                                    gu.getCmp('target-projectcode-DBM7_TREE').update('미지정');
                                    gm.me().bomverTreeStore2.getRootNode().removeAll();
                                    // gm.me().bomverTreeStore2.removeAll();
                                    gm.me().store.removeAll();
                                    // gm.me().redrawStore(true);
                                    gm.me().verAddAction.disable();
                                }
                            }
                        ]
                    }

                ],
                items: []
            });

        //this.ProductStore =  Ext.create('Rfx2.store.company.bioprotech.ProductStore', {});
        var o = {
            store: this.productStore,
            //selModel: selModel,
            flex: 2,
            border: false,
            resizable: false,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            forceFit: true,
            layout: 'fit',
            columns: [
                {
                    text: '제품코드',
                    sortable: true,
                    width: 100,
                    dataIndex: 'item_code'
                },
                {
                    text: '품명',
                    flex: 2,
                    sortable: true,
                    dataIndex: 'item_name'
                },
                {
                    text: '규격',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'specification'
                },
                {
                    text: '등록자',
                    sortable: true,
                    width: 100,
                    dataIndex: 'user_name'
                }
            ],
            listeners: {
                'selectionchange': function (view, records) {
                    console_logs('selectionchange records', records);
                    gm.me().store.removeAll();
                    gu.getCmp('target-projectcode-DBM7_TREE').update('미지정');
                    gm.me().bomverTreeStore2.getRootNode().removeAll();
                    if (records != null && records.length > 0) {
                        var record = records[0];
                        console_logs('recoed', record);
                        gm.me().assyTopParent = record.get('unique_id_long');
                        console_logs('gm.me().assyTopParent', record);
                        gm.me().selected_tree_record = null;
                        gm.me().selectedProductRecord = record;
                        // gm.me().selectAssymapCombo(record);
                        // bomverTreeStore에 파라미터 전달
                        // this.bomverTreeStore.getProxy().setExtraParam('srcahd_uid', record.get('unique_id'));
                        // bomverStore에 파라미터 전달&로드
                        // var bomverListStore = gm.me().bomverList.getStore();
                        // var bomverListStore = gm.me().bomverStore;
                        gm.me().bomverStore.removeAll();
                        gm.me().bomverStore.getProxy().setExtraParam('srcahd_uid', record.get('unique_id'));
                        gm.me().bomverStore.load(
                            {
                                // callback: function(a, b, c) {
                                //     console.log('ggggggggggg', a);
                                //     console.log('ggggggggggg', b);
                                //     console.log('ggggggggggg', c);
                                // }
                                // callBack: function(){
                                //     gm.me().store.removeAll();
                                //     // gm.me().assyGrid2.getStore().removeAll();
                                //     console.log('ssssssssssssssssssssssssss',gm.me().assyGrid2);
                                //     gm.me().assyGrid2.getStore().load();

                                // }
                            }
                        );
                        gm.me().verAddAction.enable();
                        gm.me().verReset();
                    } else {
                        gm.me().verAddAction.disable();
                    }

                    //grid.down('#removeEmployee').setDisabled(!records.length);
                },

            }
        };
        o['loadMask'] = true;
        var bomList = Ext.create('Rfx.base.BaseGrid', o);

        this.bomverStore = Ext.create('Mplm.store.BomverListStore', {autoLoad: false});
        var bomverGridOption = {
            store: this.bomverStore,
            //selModel: selModel,
            flex: 1,
            border: false,
            resizable: false,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            forceFit: true,
            allowDeselect: true,
            //hidden: true,
            //layout: 'fit',
            bodyStyle: 'margin: 10',
            columns: [
                {
                    text: 'Version',
                    dataIndex: 'ver'
                },
                {
                    text: 'Revision',
                    dataIndex: 'minor'
                },
                {
                    text: '날짜',
                    dataIndex: 'create_date',
                    xtype: 'datecolumn',
                    format: 'Y-m-d'
                },
                {
                    text: '수정자',
                    dataIndex: 'changer'
                }
            ],
            listeners: {
                'selectionchange': function (view, records) {
                    if (records != null && records.length > 0) {
                        var rec = records[0];
                        var major = rec.get('ver');
                        var minor = rec.get('minor');
                        var version = rec.get('version');
                        var rev = rec.get('cur_rev');
                        // console_logs('=====> selectionchange rec', rec);
                        // console_logs('=====> selectionchange major', major);
                        // console_logs('=====> selectionchange minor', minor);
                        // console_logs('=====> selectionchange rev', rev);

                        var o = gu.getCmp('bomVer');
                        if (o != null) {
                            o.update('<small><center>Ver.<br>' + version + '<br>Rev.<br>' + rev + '</center></small>');
                        }

                        gm.me().selectedVer = rec;

                        gm.me().verCopyAction.enable();

                        // 선택한 bomver 정보 assyGrid 툴바에 표시
                        var item_code = gm.me().selectedProductRecord.get('item_code');
                        var item_name = gm.me().selectedProductRecord.get('item_name');
                        version = 'Ver. ' + major + '.' + minor;
                        var target = '<div>' + item_code + '<font color=yellow><br/>' + item_name + ' / ' + version + '</font></div>';
                        gu.getCmp('target-projectcode-DBM7_TREE').update(target);

                        // assyGrid 트리스토어에 파라미터 전달
                        var store = gm.me().assyGrid2.getStore();
                        store.removeAll();
                        store.getProxy().setExtraParams({
                            bomver_uid: records[0].get('unique_id_long'),
                            is_refer: records[0].get('is_refer'),
                            refer_uid: records[0].get('refer_uid')
                        });
                        store.load(
                            //     {callback: function(a,b,c){
                            //         console.log('kkkkkkkkkkkkkkka',a);
                            //         console.log('kkkkkkkkkkkkkkkb',b);
                            //         console.log('kkkkkkkkkkkkkkkc',c);
                            //     }}
                        );
                        // gm.me().assyGrid2.expandAll();
                        gm.me().unselectAssy();
                        gm.me().refreshButtonState();
                        gm.me().store.removeAll();
                    }
                }
            }
        };
        bomverGridOption['loadMask'] = true;


        this.verCopyAction = Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            //text: '버전복사,
            tooltip: '버전복사',
            scale: 'small',
            disabled: true,
            width: 35,
            style: {
                marginTop: '10px',
                marginLeft: '0px',
                marginright: '0px'
            },
            // size:50,
            //hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
            handler: function (widget, event) {
                var major = gm.me().selectedVer.get('ver');
                var minor = gm.me().selectedVer.get('minor');
                minor++;

                // Ext.Msg.alert('알림', '버전복사 하시겠습니까? (신규버전: '  +  major + '.' + minor + ')');
                Ext.MessageBox.show({
                    title: '알림',
                    msg: '버전복사 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            // var unique_id_long =  gm.me().selectedVer.get('unique_id_long');
                            console.log('버전복사 선택 : ', gm.me().selectedVer.get('unique_id_long'));
                            console.log('버전복사 선택 : ', gm.me().selectedVer.get('refer_uid'));
                            console.log('버전복사 선택 : ', gm.me().selectedVer.get('is_refer'));
                            console.log('버전복사 선택 : ', gm.me().selectedVer.get('posterity'));
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=copyBomver',
                                params: {
                                    bomver_uid: gm.me().selectedVer.get('unique_id_long'),
                                    refer_uid: gm.me().selectedVer.get('refer_uid'),
                                    is_refer: gm.me().selectedVer.get('is_refer'),
                                    posterity: gm.me().selectedVer.get('posterity')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    // console_log('result:' + resultText);
                                    // gm.me().store.load();
                                    gm.me().bomverStore.load();
                                    gm.me().bomverTreeStore2.getRootNode().clear();
                                    gm.me().store.removeAll();

                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.verAddAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            tooltip: '버전생성',
            scale: 'small',
            disabled: true,
            width: 35,
            style: {
                marginTop: '20px',
                marginLeft: '0px',
                marginright: '0px'
            },
            // size:50,
            //hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
            handler: function (widget, event) {
                var src_selection = bomList.getSelectionModel().getSelection();
                if (src_selection.length == 0) {
                    return;
                }
                src_selection = src_selection[0];
                // console.log(bomList);

                // var major = gm.me().selectedVer.get('ver');
                // var minor = gm.me().selectedVer.get('minor'); minor++;

                // Ext.Msg.alert('알림', '버전생성 하시겠습니까? ( : '  +  src_selection[0].get('item_name') + ' / ' + src_selection[0].get('specification') + ')');
                Ext.MessageBox.show({
                    title: '알림',
                    msg: '새로운 버전을 생성하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            // var unique_id_long =  gm.me().selectedVer.get('unique_id_long');
                            // console.log('버전복사 선택 : ', gm.me().selectedVer.get('unique_id_long'));
                            // console.log('버전복사 선택 : ', gm.me().selectedVer.get('refer_uid'));
                            // console.log('버전복사 선택 : ', gm.me().selectedVer.get('is_refer'));
                            // console.log('버전복사 선택 : ', gm.me().selectedVer.get('posterity'));
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=createBomver',
                                params: {
                                    // bomver_uid: gm.me().selectedVer.get('unique_id_long'),
                                    // refer_uid: gm.me().selectedVer.get('refer_uid'),
                                    // is_refer: gm.me().selectedVer.get('is_refer'),
                                    // posterity: gm.me().selectedVer.get('posterity')
                                    child: src_selection.get('unique_id_long'),
                                    bm_quan: 1
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    // console_log('result:' + resultText);
                                    // gm.me().store.load();
                                    gm.me().bomverStore.load();
                                    gm.me().bomverTreeStore2.getRootNode().clear();
                                    gm.me().store.removeAll();

                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.verReset = function () {
            var o = gu.getCmp('bomVer');
            if (o != null) {
                o.update('<small><center>버전을<br>선택<br>하세요</center></small>');
            }
            gm.me().selectedVer = null;
            gm.me().verCopyAction.disable();
        };

        var bomverList = Ext.create('Rfx.base.BaseGrid', bomverGridOption);


        this.north =
            Ext.create('Ext.panel.Panel', {
                region: 'north',
                // title: '제품 탐색',
                // headerPosition: 'bottom',
                // tools: [{
                //     type: 'nav'
                // }],
                height: 180,
                frame: true,
                bodyPadding: 7,
                bodyStyle: 'background: #F5F5F5;marin-top:0',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },

                defaults: {
                    frame: true,
                    //  bodyPadding: 5
                },


                items: [search,
                    bomList,
                    {width: 5, html: '<br>'}, //Gap
                    bomverList,
                    {
                        width: 50,
                        bodyStyle: 'background: #F5F5F5;padding-bottom:0; margin-bottom:0',
                        dockedItems: [
                            {
                                dock: 'right',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default2',
                                items: [

                                    {
                                        xtype: 'component',
                                        id: gu.id('bomVer'),
                                        height: 50,
                                        html: '<small><center>버전을<br>선택<br>하세요</center></small>',// '<br><br><br>', // '<center><b>0.0</b></center>',
                                        style: {
                                            marginTop: '7px',
                                            marginLeft: '0px',
                                            marginright: '0px'
                                        },

                                    },
                                    this.verAddAction,
                                    this.verCopyAction,
                                    '->',
                                    {
                                        iconCls: 'arrow_up_black',
                                        scale: 'small',
                                        cls: 'my-menu-item',
                                        handler: function (btn) {
                                            gm.me().north.collapse();
                                        }
                                    }]
                            }],
                        html: '<br>'
                    }]
            });

        Ext.apply(this, {
            layout: 'border',
            items: [this.north, this.createWest(), this.createCenter()]
        });


        this.commonStandardStore.load(function (records) {
            for (var i = 0; i < records.length; i++) {
                var obj = records[i];

                gm.me().standard_flag_datas.push(obj);
            }
        });

        // this.searchStore.getProxy().setExtraParam('standard_flag', 'R');

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
    }, // end of init

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
                        ; //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
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

        // this.bomAll =
        //     Ext.create('Rfx2.view.company.kbtech.grid.BomGridHeavy', {
        //         id: gu.id('DBM7TREE-Assembly'),
        //         title: '전체 BOM',// cloud_product_class,
        //         border: true,
        //         resizable: true,
        //         scroll: true,
        //         collapsible: false,
        //         store: this.bomListStore,
        //         layout: 'fit',
        //         listeners: {
        //             cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
        //                 if (eOpts.ctrlKey && eOpts.keyCode === 67) {
        //                     var tempTextArea = document.createElement("textarea");
        //                     document.body.appendChild(tempTextArea);
        //                     tempTextArea.value = eOpts.target.innerText;
        //                     tempTextArea.select();
        //                     document.execCommand('copy');
        //                     document.body.removeChild(tempTextArea);
        //                 }
        //             }
        //         },
        //         dockedItems: [
        //             {
        //                 dock: 'bottom',
        //                 xtype: 'toolbar',
        //                 cls: 'my-x-toolbar-default2',
        //                 style: 'margin-top: 3px;',
        //                 layout: {
        //                     type: 'hbox',
        //                     pack: 'end'
        //                 },
        //                 items: [printExcelAction]
        //             },
        //             {
        //                 dock: 'top',
        //                 xtype: 'toolbar',
        //                 cls: 'my-x-toolbar-default1',
        //                 layout: 'column',
        //                 items: [
        //                     {
        //                         columnWidth: .5,
        //                         xtype: 'component',
        //                         style: 'font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
        //                         html: "전체 BOM List"
        //                     },
        //                     {
        //                         columnWidth: .5,
        //                         id: gu.id('target_totalPrice'),
        //                         xtype: 'component',
        //                         style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
        //                         html: "Assembly를 선택하세요."
        //                     }
        //                 ]
        //             }] //dockedItems of End] //dockedItems of End


        //     });//productGrid of End

        this.grid.setTitle('BOM');

        this.center = Ext.create('Ext.tab.Panel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '70%',
            tabPosition: 'top',
            items: [this.grid, this.bomAll],
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    if (tab.id === gu.id('DBM7TREE-Assembly')) {
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

        // this.cloudAssemblyTreeStore = Ext.create('Mplm.store.cloudAssemblyTreeStore', {});
        // this.bomverTreeStore = Ext.create('Mplm.store.BomverTreeStore', {});
        // Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a
        // tree.TreePanel
        // this.assyGrid = Ext.create('Ext.tree.Panel', {
        //     // xtype: 'lineardata-tree',
        //     title: 'Assembly',
        //     collapsible: true,
        //     useArrows: true,
        //     rootVisible: false,
        //     // rootVisible: true,
        //     forceFit: true,
        //     // store: this.cloudAssemblyTreeStore,
        //     store: this.bomverTreeStore,
        //     multiSelect: true,
        //     // columns: [
        //     //     {
        //     //         xtype: 'treecolumn',
        //     //         text: 'BomversionTree',
        //     //         dataIndex: 'unique_id_long',
        //     //         flex: 1,

        //     //     }
        //     // ],
        //     listeners: {
        //         'afterrender': function (grid) {
        //             var elments = Ext.select(".x-column-header", true);
        //             elments.each(function (el) {

        //             }, this);

        //         },
        //         activate: function (tab) {
        //             setTimeout(function () {
        //                 // gu.getCmp('main-panel-center').setActiveTab(0);
        //                 // alert(tab.title + ' was activated.');
        //             }, 1);
        //         },
        //         itemcontextmenu: function (view, rec, node, index, e) {
        //             e.stopEvent();
        //             gm.me().assyContextMenu.showAt(e.getXY());
        //             return false;
        //         },
        //         afteritemexpand: function() {
        //             if (gm.me().selected_tree_record != null) {
        //                 var node = gm.me().assyGrid.getStore().getNodeById(gm.me().selected_tree_record.id);
        //                 gm.me().assyGrid.getSelectionModel().select(node);
        //             } else {
        //                 gm.me().assyGrid.getSelectionModel().select(0);
        //             }
        //         }
        //     },
        //     dockedItems: [{
        //         dock: 'top',
        //         xtype: 'toolbar',
        //       //  cls: 'my-x-toolbar-default2',
        //         items: [
        //             this.addAssyAction,
        //             this.removeAssyAction,
        //             this.copyAssemblyAction,
        //             this.pasteAssyAction,
        //             '->',{
        //                 iconCls: 'arrow_left_black',
        //                 scale: 'small',
        //                 //text: '<',
        //                 cls: 'my-menu-item',
        //                 handler: function(btn) {
        //                     gm.me().west.collapse();
        //                 }
        //             }

        //         ]
        //     },
        //         // {
        //         //     dock: 'top',
        //         //     xtype: 'toolbar',
        //         //     cls: 'my-x-toolbar-default1',
        //         //     items: [

        //         //     ]
        //         // }, 

        //         {
        //             dock: 'top',
        //             xtype: 'toolbar',
        //             cls: 'my-x-toolbar-default1',
        //             items: [
        //                 {
        //                     id: gu.id('target-projectcode-DBM7_TREE'),
        //                     xtype: 'component',
        //                     html: "미지정",
        //                     width: '100%',
        //                     style: 'color:white;align:right;'
        //                 }
        //             ]
        //         }
        //     ], // dockedItems of End
        //     /*columns: [{
        //         xtype: 'treecolumn', // this is so we know which column
        //         // will show the tree
        //         text: 'BOM',
        //         width: 570,
        //         autoSizeColumn: true,
        //         sortable: true,
        //         dataIndex: 'text',
        //         locked: true
        //     }],*/ viewConfig: {
        //         getRowClass: function (record, index) {
        //             var refer_uid = record.get('refer_uid');
        //             if (refer_uid != null && refer_uid > -1) {
        //                 record.set('icon', "x-grid-tree-node-expanded x-tree-icon-parent_link");
        //                 record.set('iconCls', "x-grid-tree-node-expanded x-tree-icon-parent_link");
        //             }
        //         }
        //     }
        // });


        // this.assyGrid.getSelectionModel().on({
        //     selectionchange: function (sm, selections) {
        //         // gm.me().onAssemblyGridSelection(selections);
        //         console.log('selected assembly :', selections[0]);
        //         // var record = selections[0];
        //         // gm.me().store.getProxy().setExtraParams(
        //         //     {

        //         //     }
        //         // );
        //         // gm.me().store.load();
        //     }
        // });

        // this.bomverTreeStore2 = new Ext.data.TreeStore({
        //     root: {
        //         expanded: true
        //     },
        //     parentIdProperty: 'parentId',
        //     proxy: {
        //         type: 'ajax',
        //         // url: 'http://localhost/web_content75/mplm/model/treeJsonTest.json',
        //         // url: 'http://localhost/web_content75/mplm/model/treeJsonTest_copy.json',
        //         url: CONTEXT_PATH + '/design/bom.do?method=getBomverLinearTreeList'
        //         ,
        //         // +'&parent_uid=11030103001439',
        //         reader: {
        //             type: 'json',
        //             // rootProperty: function (node) {
        //             //     return node.datas
        //             //      || node.children
        //             //      || node.data
        //             //      ;
        //             // },
        //             rootProperty: 'datas'
        //         }
        //     },
        //     autoLoad: false
        // });
        this.bomverTreeStore2 = Ext.create('Mplm.store.BomverTreeStore2',
            {
                autoLoad: false,
                listeners: {
                    load: function () {
                        console.log('bomverTreeStore2 is LOADEDDDDDD');
                        gm.me().grid.getStore().removeAll();
                        gm.me().moveToSelectedAssyAction.disable();
                        // gm.me().store.load();
                    },
                }
            });
        // this.bomverTreeStore2.on('load', function(store, records, success, eOpts){
        //     gm.me().store.data.clear();
        // })
        this.assyGrid2 = Ext.create('Ext.tree.Panel', {
            // xtype: 'lineardata-tree',
            title: 'Assembly',
            rootVisible: false,
            store: this.bomverTreeStore2,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    //  cls: 'my-x-toolbar-default2',
                    items: [
                        // this.addAssyAction,
                        // this.addReferBomverAction,
                        // this.removeAssyAction,
                        // this.convReferAssyAction,
                        // this.getOriginAssyAction,
                        // this.copyAssemblyAction,
                        // this.pasteAssyAction,
                        // this.moveToSelectedAssyAction,
                        // this.moveToPrevAssyAction,
                        '->', {
                            iconCls: 'arrow_left_black',
                            scale: 'small',
                            //text: '<',
                            cls: 'my-menu-item',
                            handler: function (btn) {
                                gm.me().west.collapse();
                            }
                        }

                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            id: gu.id('target-projectcode-DBM7_TREE'),
                            xtype: 'component',
                            html: "미지정",
                            width: '100%',
                            style: 'color:white;align:right;'
                        }
                    ]
                }
            ], // dockedItems of End
            viewConfig: {
                stripeRows: false,
                getRowClass: function (record) {
                    var work_state = record.get('work_state');
                    if (work_state == 'R') {
                        return 'gray-row';
                    } else if (work_state != 'R' && record.get('is_refer') == 'Y') {
                        return 'yellow-row';
                    }
                }
            },
            columns: [
                {
                    xtype: 'treecolumn',
                    text: '계층',
                    width: 350,
                    dataIndex: 'text',
                    locked: true
                },
                {
                    text: '상태',
                    dataIndex: 'work_state',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var work_state = value,
                            is_refer = record.get('is_refer');
                        if (work_state != 'R' && is_refer == 'Y') {
                            return '참조';
                        } else if (work_state == 'R') {
                            return '수정불가';
                        }
                    }
                }
            ]

        });
        this.assyGrid2.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().onAssemblyGridSelection(selections);
                if (selections.length > 0) {
                    var rec = selections[0];

                    console.log('selected assembly2 :', rec);
                    gm.me().store.getProxy().setExtraParams({
                        bomver_uid: rec.get('unique_id_long'),
                        is_refer: rec.get('is_refer'),
                        refer_uid: rec.get('refer_uid')
                    });
                    gm.me().store.load();
                    // var record = selections[0];
                    // gm.me().store.getProxy().setExtraParams(
                    //     {

                    //     }
                    // );
                    // gm.me().store.load();
                    // gm.me().selectAssy();
                    gm.me().selected_tree_record = rec;
                    // gm.me().selectTreeGrid(rec);
                    // 버튼 제어

                } else {
                    gm.me().unselectAssy();
                    gm.me().addAssyAction.disable();
                    gm.me().addPartAction.disable();
                    gm.me().addReferBomverAction.disable();
                    gm.me().removeAssyAction.disable();
                    gm.me().printPDFAction.disable();
                    gm.me().store.clearData();
                }
                gm.me().refreshButtonState();
            }
        });
        // if(this.flag1 =='Y') {
        //     this.assyGrid2.add({items: {addAssyAction, addReferBomverAction}});
        // }

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            width: '30%',
            // layoutConfig: {
            //     columns: 2,
            //     rows: 1
            // },


            // items: [this.assyGrid]
            items: [this.assyGrid2]
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

    selectedProductRecord: null,

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

    gGridStockSelects: [],
    prev_tree_record: '',

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

        console.log('selected_tree_record', this.selected_tree_record);
        console.log('selected_tree_recorddddddddd', this.selected_tree_record)
        if (this.copiedPartCnt > 0) {
            // this.pastePartAction.enable();
        }
        // this.pasteAssyAction.enable();
        this.importAssyAction.enable();
        // this.copyAssemblyAction.enable();

        if (this.selected_tree_record.data.depth > 0 && this.selected_tree_record.get('work_state') != 'R') {
            if (this.selected_tree_record.get('is_refer') == 'N') {
                this.addReferBomverAction.enable();
                this.addPartAction.enable();
            }
            // this.editAssyAction.enable();
            this.removeAssyAction.enable();
        } else {
            this.addReferBomverAction.disable();
            this.addPartAction.disable();
            // this.editAssyAction.disable();
            this.removeAssyAction.disable();
            // this.pastePartAction.disable();
        }

    },

    unselectAssy: function () {
        // this.addAction.disable();
        this.selected_tree_record = null;
        this.addReferBomverAction.disable();
        this.addPartAction.disable();
        this.pastePartAction.disable();
        this.pasteAssyAction.disable();
        this.editAssyAction.disable();
        this.removeAssyAction.disable();
        this.copyAssemblyAction.disable();
        this.importAssyAction.disable();
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

                // Ext.Ajax.request({
                //     url: CONTEXT_PATH + '/design/bom.do?method=deleteAssyAndBom',
                //     params: {
                //         assy_uids: arr
                //     },
                //     method: 'POST',
                //     success: function (rec, op) {
                //         gm.me().store.load();
                //         gm.setCenterLoading(false);

                //         if (isAssy) {
                //             var record = gu.getCmp('productcombo-DBM7_TREE').selection;

                //             var child = record.get('unique_id');
                //             gm.me().srchTreeHandler(gm.me().assyGrid, gm.me().cloudAssemblyTreeStore,
                //                 'productcombo-DBM7_TREE', 'child', true);

                //             Ext.Ajax.request({
                //                 url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
                //                 params: {
                //                     paramName: 'CommonProjectAssy',
                //                     paramValue: child + ';' + '-1'
                //                 },

                //                 success: function (result, request) {
                //                     console_log('success defaultSet');
                //                 },
                //                 failure: function (result, request) {
                //                     console_log('fail defaultSet');
                //                 }
                //             });
                //         } else {
                //             gu.getCmp('DBM7TREE-Assembly').store.load();
                //         }
                //     },
                //     failure: function (rec, op) {
                //         Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                //         });
                //         gm.setCenterLoading(false);
                //         gu.getCmp('DBM7TREE-Assembly').store.load();
                //     }
                // });
                // 추가추가추
                Ext.Ajax.request({
                    // url: CONTEXT_PATH + '/design/bom.do?method=deleteConfirm',
                    params: {
                        assy_uids: arr
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
    deleteBomdtlConfirm: function (result) {
        if (result == 'yes') {

            var selections = gm.me().grid.getSelectionModel().getSelection();
            // var bomdtl_uids = [];
            // selections.forEach(el => {
            //     bomdtl_uids.push(el.get('unique_id_long'));
            // });
            // console.log('selected bomdtl uids : ', bomdtl_uids);

            gm.setCenterLoading(true);

            var bomdtl_uid = selections[0].get('unique_id_long');
            var standard_flag = selections[0].get('standard_flag');

            if ("A" === standard_flag) {
                Ext.MessageBox.alert('선택 확인', 'Assembly 는 좌측 그리드에서 삭제가능합니다.');
                gm.setCenterLoading(false);
                return;
            } else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=deleteBomdtl',
                    params: {
                        // bomdtl_uids: bomdtl_uids
                        bomdtl_uid: bomdtl_uid
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        gm.me().store.load();

                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                        });
                        // gm.setCenterLoading(false);
                        // gu.getCmp('DBM7TREE-Assembly').store.load();
                    }
                });
            }

            gm.setCenterLoading(false);
            gu.getCmp('DBM7TREE-Assembly').store.load();


        }
    },

    srchTreeHandler: function (my_treepanel, cloudProjectTreeStore, widName, parmName, b/*, last_selected_tree_id*/) {

        this.assyGrid.setLoading(true);

        this.resetParam(this.cloudAssemblyTreeStore, this.searchField);
        var val = gu.getCmp(widName).getValue();
        if (val == null) {
            val = gm.me().selectedProductRecord.get('unique_id_long');
        }
        console_logs('widName:', widName);
        console_logs('parmName:', parmName);
        console_logs('val:', val);
        // Assembly 탭
        this.cloudAssemblyTreeStore.getProxy().setExtraParam(parmName, val);
        this.cloudAssemblyTreeStore.load({

            callback: function (records, operation, success) {

                if (records != null && records.length > 0) {
                    var assytop_uid = records[0].get('id');
                    // 전체 BOM 탭
                    var BomGrid = gu.getCmp('DBM7TREE-Assembly');
                    BomGrid.store.getProxy().setExtraParam('reserved_integer2', assytop_uid);
                    BomGrid.store.getProxy().setExtraParam('orderBy', "pl_no");
                    BomGrid.store.getProxy().setExtraParam('ascDesc', "ASC");
                    BomGrid.store.load(function (records) {
                        gm.me().assyGrid.setLoading(false);
                        var total_price = 0.0;

                        for (var i = 0; i < records.length; i++) {

                            var total_sales_price = records[i].get('total_sales_price');

                            total_price += parseFloat(total_sales_price);
                        }

                        gu.getCmp('target_totalPrice').setHtml('총 금액 : ' + total_price.toFixed(2));
                    });

                    gm.me().selectTree();
                } else {
                    gm.me().assyGrid.setLoading(false);
                }


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

        console_logs('selectAssymapCombo record', record);

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
    // 
    selectAssymapCombo2: function (record_srcahd, record_bomver) {

        console_logs('selectAssymapCombo2 record1', record_srcahd);
        console_logs('selectAssymapCombo2 record2', record_bomver);

        var pjuid = -1;
        var child = record_srcahd.get('unique_id');
        var item_code = record_srcahd.get('item_code');
        var item_name = record_srcahd.get('item_name');
        var specification = record_srcahd.get('specification');

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
        // 어셈블리추가
        if (standard_flag == 'A') {
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=createBomver',
                params: {
                    // parent_uid: val['unique_uid'],
                    parent_uid: gm.me().selected_tree_record.get('unique_id_long'),
                    parent: val['child'],
                    // ac_uid: val['ac_uid'],
                    pl_no: val['pl_no'],
                    bm_quan: val['bm_quan'],
                    item_name: val['assy_name'],
                    // pj_code: val['pj_code'],
                    child: val['target_child'],
                    reserved_integer1: gm.me().selected_tree_record.get('posterity') * 1 + 1,
                },
                success: function (result, request) {
                    gm.me().assyGrid2.getStore().load();
                    gm.me().store.load();
                    // gm.me().reSelect();
                },
                failure: extjsUtil.failureMessage
            });

        } else {

            // 추가추가추
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=addBomdtl',
                params: {
                    ver_parent_uid: gm.me().selected_tree_record.get('unique_id_long'),
                    parent: gm.me().selected_tree_record.get('child'),
                    reserved_integer1: gm.me().selected_tree_record.get('posterity') * 1 + 1,
                    reserved_integer3: val['pl_no'],
                    bm_quan: val['bm_quan'],
                    child: val['unique_id'],
                    bomdtl_uid: val['bomdtl_uid'],
                },

                success: function (result, request) {

                    gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                    gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                    gm.me().store.getProxy().setExtraParam('ac_uid', -1);
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
                    // Ext.MessageBox.alert('성공', '자재가 정상적으로 등록 되었습니다.');
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
                //                gm.me().cloudProjectTreeStore.load({
                //
                //                    callback: function(records, operation, success) {
                //                        gm.me().selectTreeGrid(null);
                //                    	//gm.me().assyGrid.expandAll();
                //                    }
                //                });

                //Ext.Msg.alert('결과', '저장 성공.');
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

            // this.classCode = rec.get('class_code');
            // this.selectedAssyCode = rec.get('assy_code');
            // this.modelNo = rec.get('model_no');
            // this.description = rec.get('description');
            // this.selectedparent = rec.get('parent');
            // this.selectedChild = rec.get('child');
            // this.selectedAssyUid = rec.get('unique_uid');
            // this.assy_uid = rec.get('parent');
            // this.reserved_varchar1 = rec.get('item_code');
            // this.selectedAssyName = rec.get('assy_name');
            // this.selectedPjUid = rec.get('ac_uid');
            // this.selectedPjCode = rec.get('pj_code');
            // this.refer_uid = rec.get('refer_uid') == undefined || rec.get('refer_uid') == null ? -1 : rec.get('refer_uid');

            // this.selectedProduct = rec.get('reserved_integer2');    //제품


            // this.routeTitlename = rec.get('part_folder'); //'[' + rec.get('pl_no') + '] ' + rec.get('assy_name');
            // this.depth = rec.get('depth');

            this.selectAssy();

            // var parent = rec.get('unique_id_long');
        }


    },

    // editRedord: function (field, rec) {

    //     switch (field) {
    //         case 'req_info':
    //             this.updateDesinComment(rec);
    //             break;
    //         case 'reserved_varchar1':
    //             this.updateDesinComment(rec);
    //             break;
    //         case 'reserved_integer1':
    //             this.updateDesinComment(rec);
    //             break;
    //         case 'bm_quan':
    //             this.updateDesinComment(rec);
    //             break;
    //         case 'pl_no':
    //             this.updateDesinComment(rec);
    //             break;
    //     }


    // },

    // updateDesinComment: function (rec) {
    //     var unique_uid = rec.get('unique_uid');
    //     var req_info = rec.get('req_info');
    //     var reserved_varchar1 = rec.get('reserved_varchar1');
    //     var reserved_integer1 = rec.get('reserved_integer1');
    //     var bm_quan = rec.get('bm_quan');
    //     var pl_no = rec.get('pl_no');
    //     Ext.Ajax.request({
    //         url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
    //         params: {
    //             id: unique_uid,
    //             req_info: req_info,
    //             reserved_varchar1: reserved_varchar1,
    //             reserved_integer1: reserved_integer1,
    //             bm_quan: bm_quan,
    //             pl_no: pl_no
    //         },
    //         success: function (result, request) {

    //             var result = result.responseText;

    //         },
    //         failure: extjsUtil.failureMessage
    //     });
    // },

    contextMenuCart: Ext.create('Ext.menu.Menu', {
        items: [/* addElecAction, editAction, */ this.removeCartAction]
    }),

    copiedPartCnt: 0,

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
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                // fn: gm.me().deleteConfirm,
                fn: gm.me().deleteBomdtlConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {
            gm.me().addSrcHandler('PART');
            //     var records = gm.me().store.data.items;

            //     var max_num = 0;

            //     for (var i = 0; i < records.length; i++) {

            //         var reserved_integer3 = records[i].get('reserved_integer3');

            //         if (max_num < reserved_integer3) {
            //             max_num = reserved_integer3;
            //         }
            //     }

            //     gm.me().mNum = max_num + 1;

            //     if (gm.me().selected_tree_record == null) {
            //         Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
            //             return;
            //         });
            //         return;
            //     }
            //     var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            //     var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            //     var bHeight = 700;
            //     var bWidth = 700;

            //     var refer_uid = gm.me().selected_tree_record.get('refer_uid');

            //     gm.me().searchStore.removeAll();
            //     gm.me().searchStore.getProxy().setExtraParam('standard_flag', 'R');

            //     this.itemSearchAction = Ext.create('Ext.Action', {
            //         iconCls: 'af-search',
            //         text: CMD_SEARCH/*'검색'*/,
            //         tooltip: CMD_SEARCH/*'검색'*/,
            //         disabled: false,
            //         handler: function () {
            //             var extraParams = gm.me().searchStore.getProxy().getExtraParams();
            //             if (Object.keys(extraParams).length == 0) {
            //                 Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
            //             } else {
            //                 gm.me().searchStore.load();
            //             }
            //         }
            //     });

            //     this.gridViewTable = Ext.create('Ext.grid.Panel', {
            //         store: gm.me().searchStore,
            //         cls: 'rfx-panel',
            //         multiSelect: false,
            //         autoScroll: true,
            //         border: false,
            //         height: 200,
            //         padding: '0 0 5 0',
            //         flex: 1,
            //         layout: 'fit',
            //         forceFit: false,
            //         listeners: {
            //             select: function (selModel, record, index, options) {
            //                 gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
            //                 gu.getCmp('item_code').setValue(record.get('item_code'));
            //                 gu.getCmp('item_name').setValue(record.get('item_name'));
            //                 gu.getCmp('specification').setValue(record.get('specification'));
            //                 // gu.getCmp('maker_name').setValue(record.get('maker_name'));
            //                 gu.getCmp('unit_code').setValue(record.get('unit_code'));
            //                 //gu.getCmp('sales_price').setValue(record.get('sales_price'));
            //                 gu.getCmp('currency').setValue(record.get('currency'));
            //                 gu.getCmp('standard_flag').setValue(record.get('standard_flag'));
            //                 // gu.getCmp('reserved6').setValue(record.get('reserved6'));
            //                 // gu.getCmp('reserved7').setValue(record.get('reserved7'));
            //             }
            //         },
            //         dockedItems: [
            //             {
            //                 dock: 'top',
            //                 xtype: 'toolbar',
            //                 style: 'background-color: #EFEFEF;',
            //                 items: [
            //                     {
            //                         field_id: 'search_item_code',
            //                         width: 190,
            //                         fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            //                         id: gu.id('search_item_code_part'),
            //                         name: 'search_item_code',
            //                         margin: '3 3 3 3',
            //                         xtype: 'triggerfield',
            //                         emptyText: '품번',
            //                         trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //                         onTrigger1Click: function () {
            //                             this.setValue('');

            //                         },
            //                         listeners: {
            //                             specialkey: function (fieldObj, e) {
            //                                 if (e.getKey() == Ext.EventObject.ENTER) {
            //                                     gm.me().searchStore.load();
            //                                 }
            //                             },
            //                             change: function (fieldObj, e) {
            //                                 if (e.trim().length > 0) {
            //                                     gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
            //                                 } else {
            //                                     delete gm.me().searchStore.proxy.extraParams.item_code;
            //                                 }
            //                             },
            //                             render: function (c) {
            //                                 Ext.create('Ext.tip.ToolTip', {
            //                                     target: c.getEl(),
            //                                     html: c.emptyText
            //                                 });
            //                             }
            //                         }
            //                     },
            //                     {
            //                         field_id: 'search_item_name',
            //                         width: 190,
            //                         fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            //                         id: gu.id('search_item_name_part'),
            //                         name: 'search_item_name',
            //                         xtype: 'triggerfield',
            //                         margin: '3 3 3 3',
            //                         emptyText: '품명',
            //                         trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //                         onTrigger1Click: function () {
            //                             this.setValue('');
            //                         },
            //                         listeners: {
            //                             specialkey: function (fieldObj, e) {
            //                                 if (e.getKey() == Ext.EventObject.ENTER) {
            //                                     gm.me().searchStore.load();
            //                                 }
            //                             },
            //                             change: function (fieldObj, e) {
            //                                 if (e.trim().length > 0) {
            //                                     gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
            //                                 } else {
            //                                     delete gm.me().searchStore.proxy.extraParams.item_name;
            //                                 }
            //                             },
            //                             render: function (c) {
            //                                 Ext.create('Ext.tip.ToolTip', {
            //                                     target: c.getEl(),
            //                                     html: c.emptyText
            //                                 });
            //                             }
            //                         }
            //                     },
            //                     {
            //                         field_id: 'search_specification',
            //                         width: 190,
            //                         fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            //                         id: gu.id('search_specification_part'),
            //                         name: 'search_specification',
            //                         xtype: 'triggerfield',
            //                         margin: '3 3 3 3',
            //                         emptyText: '규격',
            //                         trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //                         onTrigger1Click: function () {
            //                             this.setValue('');
            //                         },
            //                         listeners: {
            //                             specialkey: function (fieldObj, e) {
            //                                 if (e.getKey() == Ext.EventObject.ENTER) {
            //                                     gm.me().searchStore.load();
            //                                 }
            //                             },
            //                             change: function (fieldObj, e) {
            //                                 if (e.trim().length > 0) {
            //                                     gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
            //                                 } else {
            //                                     delete gm.me().searchStore.proxy.extraParams.specification;
            //                                 }
            //                             },
            //                             render: function (c) {
            //                                 Ext.create('Ext.tip.ToolTip', {
            //                                     target: c.getEl(),
            //                                     html: c.emptyText
            //                                 });
            //                             }
            //                         }
            //                     },
            //                     '->',
            //                     this.itemSearchAction
            //                 ]
            //             }
            //         ],
            //         columns: [
            //             {
            //                 text: '품번',
            //                 width: 120,
            //                 dataIndex: 'item_code'
            //             },
            //             {
            //                 text: '품명',
            //                 width: 270,
            //                 dataIndex: 'item_name',
            //                 renderer: function (value) {
            //                     return value.replace(/</gi, "&lt;");
            //                 }
            //             },
            //             {
            //                 text: '규격',
            //                 width: 270,
            //                 dataIndex: 'specification'
            //             }
            //         ]
            //     });
            //     gm.me().createPartForm = Ext.create('Ext.form.Panel', {
            //         xtype: 'form',
            //         width: bWidth,
            //         height: bHeight,
            //         bodyPadding: 10,
            //         layout: {
            //             type: 'vbox',
            //             align: 'stretch' // Child items are stretched to full width
            //         },
            //         defaults: {
            //             allowBlank: true,
            //             msgTarget: 'side',
            //             labelWidth: 60
            //         },
            //         items: [
            //             this.gridViewTable,
            //             new Ext.form.Hidden({
            //                 name: 'parent',
            //                 value: gm.me().selectedChild
            //             }),
            //             new Ext.form.Hidden({
            //                 name: 'ac_uid',
            //                 value: gm.me().selectedPjUid
            //             }),
            //             new Ext.form.Hidden({
            //                 id: gu.id('pj_code'),
            //                 name: 'pj_code',
            //                 value: gm.me().selectedPjCode
            //             }),
            //             new Ext.form.Hidden({
            //                 id: 'assy_code',
            //                 name: 'assy_code',
            //                 value: gm.me().selectedAssyCode
            //             }),
            //             new Ext.form.Hidden({
            //                 id: gu.id('standard_flag'),
            //                 name: 'standard_flag'
            //             }),
            //             {
            //                 fieldLabel: gm.me().getColName('unique_id'),
            //                 xtype: 'textfield',
            //                 id: gu.id('unique_id'),
            //                 name: 'unique_id',
            //                 emptyText: '자재 UID',
            //                 readOnly: true,
            //                 hidden: true,
            //                 width: 300,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             },
            //             {
            //                 xtype: 'textfield',
            //                 name: 'item_code',
            //                 id: gu.id('item_code'),
            //                 fieldLabel: '품번',
            //                 readOnly: true,
            //                 allowBlank: false,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             },
            //             {
            //                 xtype: 'textfield',
            //                 name: 'item_name',
            //                 id: gu.id('item_name'),
            //                 fieldLabel: '품명',
            //                 readOnly: true,
            //                 allowBlank: false,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             },
            //             {
            //                 xtype: 'textfield',
            //                 fieldLabel: '규격',
            //                 id: gu.id('specification'),
            //                 name: 'specification',
            //                 readOnly: true,
            //                 allowBlank: true,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             }, {
            //                 xtype: 'numberfield',
            //                 minValue: 0,
            //                 width: '100%',
            //                 id: gu.id('bm_quan'),
            //                 name: 'bm_quan',
            //                 fieldLabel: gm.me().getColName('bm_quan'),
            //                 decimalPrecision: 5,
            //                 allowBlank: true,
            //                 value: '1',
            //                 margins: '0'
            //             }, {
            //                 xtype: 'textfield',
            //                 width: '100%',
            //                 fieldLabel: gm.me().getColName('unit_code'),
            //                 id: gu.id('unit_code'),
            //                 name: 'unit_code',
            //                 allowBlank: true
            //             }, /*{
            //                         xtype: 'numberfield',
            //                         width: '100%',
            //                         id: gu.id('sales_price'),
            //                         name: 'sales_price',
            //                         decimalPrecision: 5,
            //                         fieldLabel: gm.me().getColName('sales_price'),
            //                         allowBlank: true,
            //                         value: '0',
            //                         margins: '0'
            //                     }, */{
            //                 fieldLabel: 'Level',
            //                 xtype: 'textfield',
            //                 hidden: true,
            //                 width: '100%',
            //                 emptyText: 'Level',
            //                 name: 'reserved_integer1',
            //                 value: reserved_integer1 + 1,
            //             }, {
            //                 xtype: 'textfield',
            //                 fieldLabel: '단위',
            //                 emptyText: '단위',
            //                 name: 'unit_code',
            //                 id: gu.id('unit_code'),
            //                 width: '100%',
            //                 value: 'EA'
            //             }, {
            //                 xtype: 'textfield',
            //                 id: gu.id('parent'),
            //                 name: 'parent',
            //                 emptyText: '제품 UID',
            //                 value: gm.me().selectedChild,
            //                 width: '100%',
            //                 readOnly: true,
            //                 hidden: true,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             }, {
            //                 xtype: 'textfield',
            //                 id: gu.id('unique_uid'),
            //                 name: 'unique_uid',
            //                 emptyText: 'BOM UID',
            //                 value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
            //                 width: '100%',
            //                 readOnly: true,
            //                 hidden: true,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             }, {
            //                 xtype: 'textfield',
            //                 id: gu.id('bomdtl_uid'),
            //                 name: 'bomdtl_uid',
            //                 emptyText: 'BOMDTL UID',
            //                 value: -1, // 추가시 -1
            //                 width: '100%',
            //                 readOnly: true,
            //                 hidden: true,
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             }, {
            //                 fieldLabel: 'AssyTopUID',
            //                 xtype: 'textfield',
            //                 name: 'reserved_integer2',
            //                 value: reserved_integer2,
            //                 emptyText: '제품ASSY_UID',
            //                 readOnly: true,
            //                 hidden: true,
            //                 width: '100%',
            //                 fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            //             }, {
            //                 xtype: 'textfield',
            //                 width: '100%',
            //                 emptyText: '순번',
            //                 hidden: true,
            //                 name: 'pl_no',
            //                 id: gu.id('pl_no'),
            //                 fieldLabel: '순번',
            //                 value: gm.me().store.data.items.length + 1
            //             },
            //             {
            //                 xtype: 'button',
            //                 text: '초기화',
            //                 scale: 'small',
            //                 width: 50,
            //                 maxWidth: 80,
            //                 style: {
            //                     marginTop: '7px',
            //                     marginLeft: '550px'
            //                 },
            //                 // size:50,
            //                 hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
            //                 listeners: {
            //                     click: function () {
            //                         gm.me().resetPartForm();
            //                     }
            //                 }
            //             }, {
            //                 xtype: 'container',
            //                 type: 'hbox',
            //                 padding: '5',
            //                 pack: 'end',
            //                 align: 'left',
            //                 defaults: {},
            //                 margin: '0 0 0 0',
            //                 border: false

            //             }
            //         ]
            //     });

            //     var winPart = Ext.create('ModalWindow', {
            //         title: '품목 추가',
            //         width: bWidth,
            //         height: bHeight,
            //         minWidth: 250,
            //         minHeight: 180,
            //         items: [gm.me().createPartForm
            //         ],
            //         buttons: [{
            //             text: CMD_OK,
            //             handler: function () {
            //                 var form = gm.me().createPartForm;
            //                 if (form.isValid()) {
            //                     var val = form.getValues(false);
            //                     var refer_uid = gm.me().selected_tree_record.get('refer_uid');
            //                     if (refer_uid > -1) {
            //                         Ext.MessageBox.show({
            //                             title: '경고',
            //                             msg: '참조된 Assy입니다.',
            //                             buttons: Ext.MessageBox.YESNO,
            //                             fn: function (result) {
            //                                 if (result == 'yes') {

            //                                     gm.me().registPartFc(val);

            //                                     if (winPart) {
            //                                         winPart.close();
            //                                     }
            //                                 }
            //                             },
            //                             icon: Ext.MessageBox.QUESTION
            //                         });

            //                     } else {

            //                         gm.me().registPartFc(val);

            //                         if (winPart) {
            //                             winPart.close();
            //                         }
            //                     }

            //                 } else {
            //                     Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
            //                 }

            //             }
            //         }, {
            //             text: CMD_CANCEL,
            //             handler: function () {
            //                 if (winPart) {
            //                     winPart.close();
            //                 }
            //             }
            //         }]
            //     });
            //     winPart.show(/* this, function(){} */);
        } // endofhandler
        //     });


        // },
        // failure: extjsUtil.failureMessage
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
        handler: function (widget, event) {

            var rec = gm.me().grid.getSelectionModel().getSelection()[0];

            var standardFlag = rec.get('standard_flag');

            if (standardFlag === 'A') {
                Ext.Msg.alert('', 'ASSY는 삭제만 가능합니다.');
                return null;
            }

            var bomUid = rec.getId();
            var child = rec.get('child');
            var bmQuan = rec.get('bm_quan');
            var itemCode = rec.get('item_code');
            var itemName = rec.get('item_name');
            var specification = rec.get('specification');
            var unitCode = rec.get('unit_code');
            var reservedInteger3 = rec.get('reserved_integer3');
            var salesPrice = rec.get('sales_price');
            var pl_no = rec.get('pl_no');

            if (salesPrice == null || salesPrice === '') {
                salesPrice = 0;
            }

            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            var standard_flag = gm.me().selected_tree_record.get('standard_flag');

            var bHeight = 550;
            var bWidth = 700;

            var refer_uid = gm.me().selected_tree_record.get('refer_uid');

            gm.me().searchStore.removeAll();
            gm.me().searchStore.getProxy().setExtraParam('standard_flag', 'R');

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
                height: 300,
                padding: '0 0 5 0',
                // flex: 1,
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
                        // gu.getCmp('currency').setValue(record.get('currency'));
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
            var prodStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PROCESS_TYPE'});
            var ynStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'YN'});

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
                        xtype: 'textfield',
                        id: gu.id('bomdtl_uid'),
                        name: 'bomdtl_uid',
                        emptyText: 'BOMDTL UID',
                        // value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                        valud: rec.get('unique_id_long'),
                        width: '100%',
                        readOnly: true,
                        // hidden: true,
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

            prodStore.load();
            ynStore.load();

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

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=addBomdtl',
                                params: {
                                    bomdtl_uid: bomUid,
                                    reserved_integer3: val['reserved_integer3'],
                                    bm_quan: val['bm_quan'],
                                    item_code: val['item_code'],
                                    child: val['unique_id'],
                                    reserved_integer1: rec.get('reserved_integer1')
                                    // reserved_varchar2: val['reserved_varchar2'] // ?
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    if (winPart) {
                                        winPart.close();
                                    }
                                },
                                failure: extjsUtil.failureMessage
                            });
                            // }
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


        },
        failure: extjsUtil.failureMessage
    }),

    // PDF 파일 출력기능
    printPDFAction: Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: 'PDF',
        tooltip: 'PartList 출력',
        disabled: true,
        handler: function (widget, event) {
            var ac_uid = gm.me().ac_uid;
            var assy_uid = gm.me().assy_uid;

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

                    if (pdfPath.length > 0) {
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                        top.location.href = url;
                    }
                },
                failure: extjsUtil.failureMessage
            });
        }
    }),

    downloadSheetAction: Ext.create('Ext.Action', {
        xtype: 'button',
        iconCls: 'af-download',
        text: 'BOM 업로드 양식',
        tooltip: 'BOM 업로드 양식받기',
        handler: function () {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=printBomTemplate',
                params: {},
                success: function (result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var excelPath = jsonData.excelPath;
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                    top.location.href = url;
                    prWin.close();
                },//Ajax success
                failure: function (result, request) {
                    Ext.Msg.alert('오류', 'BOM 업로드 템플릿을 출력할 수 없습니다.');
                    prWin.close();
                }
            });
        }
    }),

    dlBomParentChildExcelAction: Ext.create('Ext.Action', {
        xtype: 'button',
        iconCls: 'af-excel',
        text: 'BOM 리스트 받기',
        tooltip: '업로드 된 모든 BOM 리스트를 다운로드 합니다(모자관계)',
        handler: function () {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=printBomParentChildExcel',
                params: {},
                success: function (result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var excelPath = jsonData.excelPath;
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                    top.location.href = url;
                    prWin.close();
                },//Ajax success
                failure: function (result, request) {
                    Ext.Msg.alert('오류', 'BOM 업로드 템플릿을 출력할 수 없습니다.');
                    prWin.close();
                }
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

                    if (salesPrice == null || salesPrice === '') {
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
                                    }, /*{
                                        xtype: 'numberfield',
                                        width: '100%',
                                        id: gu.id('sales_price'),
                                        name: 'sales_price',
                                        decimalPrecision: 5,
                                        fieldLabel: gm.me().getColName('sales_price'),
                                        allowBlank: true,
                                        margins: '0'
                                    },*/ /* {
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
                    selModel: 'checkboxmodel',
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

    removeAssyAction: Ext.create('Ext.Action', {
        itemId: 'removeAssyAction',
        iconCls: 'af-remove',
        text: CMD_DELETE,
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: delete_msg_title,
                msg: gm.me().selected_tree_record.get('depth') < 2 ? '최상위 BOM을 삭제하시겠습니까?' : delete_msg_content,
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteBomverConfirm,
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
        handler: function () {
            // gm.me().addSrcHandler('ASSY');


            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            //console_logs('versionCheck: gm.me().versionCheck', gm.me().versionCheck);

            console_logs('pj uid >>>> ', gm.me().selectedPjUid);

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }
            var child = gm.me().selected_tree_record.get('child');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var unique_uid = gm.me().selected_tree_record.get('unique_id_long');
            var assy_name = gm.me().selected_tree_record.get('text');
            // Ext.Ajax.request({
            //     url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno3',
            //     params: {
            //         ac_uid: gm.me().selectedPjUid
            //         // ac_uid: ac_uid
            //     },
            //     success: function (result, request) {
            // console_logs('result.responseText', result);
            // var str = result.responseText;
            // var num = Number(str);

            // if (str.length == 3) {
            //     num = num;
            // } else if (str.length == 2) {
            //     num = '0' + num;
            // } else if (str.length == 1) {
            //     num = '00' + num;
            // } else {
            //     num = num % 1000;
            // }
            // var pl_no = 'A' + num;

            var pl_no = gm.me().store.data.items.length + 1;
            var bHeight = 300;


            var inputItem = [];

            inputItem.push({
                xtype: 'component',
                html: '상위 Assembly : ' + assy_name,
                style: 'text-align:right;',
                anchor: '-5'
            });
            inputItem.push({
                xtype: 'component',
                html: '<hr>',
                anchor: '-5'
            });

            //                        inputItem.push({
            //                            xtype: 'displayfield',
            //                            value: '먼저 등록된 자재인지 검색하세요.'
            //                        });
            inputItem.push({
                id: gu.id('search_information_assy_add'),
                fieldLabel: '종전자재',
                field_id: 'search_information_assy_add',
                allowBlank: true,
                name: 'search_information_assy_add',
                xtype: 'combo',
                emptyText: 'Assembly 검색',
                anchor: '-5',
                store: gm.me().productSearchStore,
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
                    getInnerTpl: function () {
                        // return '<div><a class="search-item" href="javascript:gm.me().setBomDataAssy({id},\'{item_code}\',\'{item_name}\');">' +
                        //     '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                        //     '</a></div>';
                        return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                    }
                },
                pageSize: 10,
                listeners: {
                    beforequery: function (queryEvent) {
                        gu.getCmp('search_information_assy_add').store.getProxy().setExtraParams({
                            item_name: '%' + gu.getCmp('search_information_assy_add').getValue() + '%',
                            standard_flag: 'A'
                        });
                        // gu.getCmp('search_information_assy_add').store.getProxy().setExtraParam('item_name',
                        //     '%' + gu.getCmp('search_information_assy_add').getValue() + '%');
                    },
                    select: function (combo, record) {
                        var item_code = record.get('item_code'),
                            item_name = record.get('item_name'),
                            id = record.get('id');
                        gu.getCmp('target_item_code').setValue(item_code);
                        gu.getCmp('target_assy_name').setValue(item_name);
                        gu.getCmp('search_information_assy_add').setValue(item_name);
                        gu.getCmp('target_child').setValue(id);
                        console.log('combo selected !!!!!!!!!! : ', id);
                    }
                }
            });
            inputItem.push(new Ext.form.Hidden({
                value: child,
                name: 'child'
            }));
            inputItem.push(new Ext.form.Hidden({
                value: ac_uid,
                name: 'ac_uid'
            }));
            inputItem.push(new Ext.form.Hidden({
                value: gm.me().selectedPjCode,
                name: 'pj_code'
            }));

            switch (vCompanyReserved4) {
                case 'APM01KR':
                    inputItem.push(new Ext.form.Hidden({
                        xtype: 'textfield',
                        id: gu.id('target_item_code'),
                        name: 'target_item_code',
                        emptyText: '자동 생성',
                        fieldLabel: 'Assembly 코드',
                        allowBlank: true,
                        anchor: '-5',
                    }));
                    inputItem.push({
                        xtype: 'textfield',
                        name: 'pl_no',
                        fieldLabel: 'Assy 코드',
                        value: pl_no,
                        allowBlank: false,
                        fieldStyle: 'text-align: right;',
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'textfield',
                        id: gu.id('target_assy_name'),
                        name: 'assy_name',
                        fieldLabel: 'Assembly 명',
                        allowBlank: false,
                        anchor: '-5'
                    });

                    inputItem.push(new Ext.form.Hidden({
                        id: gu.id('target_child'),
                        name: 'target_child',
                        value: -1
                    }));

                    inputItem.push(new Ext.form.Hidden({
                        name: 'unique_uid',
                        value: unique_uid
                    }));
                    inputItem.push({
                        xtype: 'numberfield',
                        name: 'bm_quan',
                        fieldLabel: '수량',
                        allowBlank: false,
                        value: 1,
                        anchor: '-5'
                    });
                    break;
                default:
                    inputItem.push({
                        xtype: 'textfield',
                        id: gu.id('target_item_code'),
                        name: 'target_item_code',
                        emptyText: '자동 생성',
                        fieldLabel: 'Assembly 코드',
                        allowBlank: true,
                        anchor: '-5',
                    });
                    inputItem.push({
                        xtype: 'textfield',
                        id: gu.id('target_assy_name'),
                        name: 'assy_name',
                        fieldLabel: 'Assembly 명',
                        allowBlank: false,
                        anchor: '-5'
                    });

                    inputItem.push(new Ext.form.Hidden({
                        id: gu.id('target_child'),
                        name: 'target_child',
                        value: -1
                    }));

                    inputItem.push(new Ext.form.Hidden({
                        name: 'unique_uid',
                        value: unique_uid
                    }));

                    inputItem.push({
                        xtype: 'textfield',
                        name: 'pl_no',
                        fieldLabel: 'Assy 순번',
                        value: pl_no,
                        allowBlank: false,
                        fieldStyle: 'text-align: right;',
                        anchor: '-5',
                        hidden: true
                    });
                    inputItem.push({
                        xtype: 'numberfield',
                        name: 'bm_quan',
                        fieldLabel: '수량',
                        allowBlank: false,
                        value: 1,
                        anchor: '-5'
                    });
                    break;
            }


            gm.me().createAssyForm = Ext.create('Ext.form.Panel', {
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                bodyPadding: 15,
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
                title: 'Assembly 추가',
                //                            header: {
                //                                titlePosition: 2//,
                //                                //titleAlign: 'center'
                //                            },
                width: 400,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                //maximizable: true,
                items: gm.me().createAssyForm,

                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gm.me().createAssyForm;
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=createBomver',
                                params: {
                                    parent_uid: val['unique_uid'],
                                    parent: val['child'],
                                    ac_uid: val['ac_uid'],
                                    pl_no: val['pl_no'],
                                    bm_quan: val['bm_quan'],
                                    item_name: val['assy_name'],
                                    pj_code: val['pj_code'],
                                    child: val['target_child'],
                                    reserved_integer1: gm.me().selected_tree_record.get('posterity') * 1 + 1
                                    // versionCheck: gm.me().versionCheck


                                },
                                success: function (result, request) {
                                    gm.me().assyGrid2.getStore().load();
                                    // gm.me().reSelect();
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
            win.show( /* this, function(){} */);
            //     } // endofhandler
            // });
        },
        failure: extjsUtil.failureMessage
    }),

    addSrcHandler: function (ASSYorPART) {
        var search_standard_flag = 'ASSY' == ASSYorPART ? 'A' : 'PART' == ASSYorPART ? 'R' : '';

        gm.me().searchStore.removeAll();
        gm.me().searchStore.getProxy().setExtraParam('standard_flag', search_standard_flag);

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
        var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
        var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

        var bHeight = 550;
        var bWidth = 700;

        var refer_uid = gm.me().selected_tree_record.get('refer_uid');


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
            height: 300,
            padding: '0 0 5 0',
            // flex: 1,
            layout: 'fit',
            forceFit: false,
            listeners: {
                select: function (selModel, record, index, options) {
                    gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                    gu.getCmp('item_code').setValue(record.get('item_code'));
                    gu.getCmp('item_name').setValue(record.get('item_name'));
                    gu.getCmp('specification').setValue(record.get('specification'));
                    // gu.getCmp('maker_name').setValue(record.get('maker_name'));
                    gu.getCmp('unit_code').setValue(record.get('unit_code'));
                    //gu.getCmp('sales_price').setValue(record.get('sales_price'));
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
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().searchStore.load();
                                    }
                                },
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
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().searchStore.load();
                                    }
                                },
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
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().searchStore.load();
                                    }
                                },
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
                }, {
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
                    emptyText: '단위',
                    name: 'unit_code',
                    id: gu.id('unit_code'),
                    width: '100%',
                    value: 'EA'
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
                    xtype: 'textfield',
                    id: gu.id('bomdtl_uid'),
                    name: 'bomdtl_uid',
                    emptyText: 'BOMDTL UID',
                    value: -1, // 추가시 -1
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
                    value: gm.me().store.data.items.length + 1
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


    },

    addReferBomverAction: Ext.create('Ext.Action', {
        itemId: 'addReferBomverAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '참조',
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


            var bHeight = 550;
            var bWidth = 700;

            var refer_uid = gm.me().selected_tree_record.get('refer_uid');

            gm.me().searchStore.removeAll();
            gm.me().searchStore.getProxy().setExtraParam('standard_flag', 'A');
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
                height: 300,
                padding: '0 0 5 0',
                // flex: 1,
                layout: 'fit',
                forceFit: false,
                listeners: {
                    select: function (selModel, record, index, options) {
                        gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                        gu.getCmp('item_code').setValue(record.get('item_code'));
                        gu.getCmp('item_name').setValue(record.get('item_name'));
                        gu.getCmp('specification').setValue(record.get('specification'));
                        // gu.getCmp('maker_name').setValue(record.get('maker_name'));
                        gu.getCmp('unit_code').setValue(record.get('unit_code'));
                        //gu.getCmp('sales_price').setValue(record.get('sales_price'));
                        // gu.getCmp('currency').setValue(record.get('currency'));
                        gu.getCmp('standard_flag').setValue(record.get('standard_flag'));
                        // gu.getCmp('reserved6').setValue(record.get('reserved6'));
                        // gu.getCmp('reserved7').setValue(record.get('reserved7'));
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
                                    specialkey: function (fieldObj, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().searchStore.load();
                                        }
                                    },
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
                                    specialkey: function (fieldObj, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().searchStore.load();
                                        }
                                    },
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
                                    specialkey: function (fieldObj, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().searchStore.load();
                                        }
                                    },
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
            // var prodStore = Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PROCESS_TYPE' });
            // var ynStore = Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'YN' });

            gm.me().addRefAssyForm = Ext.create('Ext.form.Panel', {
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
                    }, {
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
                        emptyText: '단위',
                        name: 'unit_code',
                        id: gu.id('unit_code'),
                        width: '100%',
                        value: 'EA'
                        // }, {
                        //     fieldLabel: '사용공정',
                        //     xtype: 'combo',
                        //     width: '100%',
                        //     name: 'reserved6',
                        //     id: gu.id('reserved6'),
                        //     displayField: 'code_name_kr',
                        //     store: prodStore,
                        //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                        //     valueField: 'system_code',
                        //     typeAhead: false,
                        //     allowBlank: false,
                        //     listConfig: {
                        //         loadingText: '검색중...',
                        //         emptyText: '일치하는 항목 없음.',
                        //         getInnerTpl: function () {
                        //             return '<div>[{system_code}] {code_name_kr}</div>';
                        //         }
                        //     },
                        //     value: 'M' // 생산
                        // }, {
                        //     fieldLabel: 'LOT추적여부',
                        //     xtype: 'combo',
                        //     width: '100%',
                        //     name: 'reserved7',
                        //     id: gu.id('reserved7'),
                        //     displayField: 'code_name_kr',
                        //     store: ynStore,
                        //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                        //     valueField: 'system_code',
                        //     typeAhead: false,
                        //     allowBlank: false,
                        //     listConfig: {
                        //         loadingText: '검색중...',
                        //         emptyText: '일치하는 항목 없음.',
                        //         getInnerTpl: function () {
                        //             return '<div>{code_name_kr}</div>';
                        //         }
                        //     },
                        //     margin: '0 0 70 0',
                        //     value: 'Y' // 예
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
                        xtype: 'textfield',
                        id: gu.id('bomdtl_uid'),
                        name: 'bomdtl_uid',
                        emptyText: 'BOMDTL UID',
                        value: -1, // 추가시 -1
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
                        // value: pl_no
                        value: gm.me().store.data.items.length + 1
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
            // prodStore.load();
            // ynStore.load();

            var win = Ext.create('ModalWindow', {
                title: '품목 추가',
                width: bWidth,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: [gm.me().addRefAssyForm
                ],
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gm.me().addRefAssyForm;
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            gm.me().setLoading(true);

                            // var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                            gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                            // gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                            // gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                            // gm.me().selected_tree_record.set('text', text);

                            // 추가추가추 봄버전에 추가
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=addReferBomver',
                                params: {
                                    // srcahd_uid: val['srcahd_uid'],
                                    srcahd_uid: val['unique_id'],
                                    bm_quan: val['bm_quan'],
                                    // refer_uid: gm.me().selected_tree_record.get('refer_uid'),
                                    // is_refer: gm.me().selected_tree_record.get('is_refer'),
                                    to_parent_uid: gm.me().selected_tree_record.get('unique_id'),
                                    pl_no: val['pl_no'],
                                    // reserved6: val['reserved6'],
                                    // reserved7: val['reserved7'],
                                    reserved_integer1: val['reserved_integer1']
                                },
                                success: function (result, request) {
                                    gm.me().setLoading(false);
                                    // gm.me().reSelect();
                                    gu.getCmp('DBM7TREE-Assembly').store.load();
                                    // gm.me().assyGrid2.getStore().load();
                                    gm.me().assyGrid2.getStore().reload();
                                    gm.me().bomverStore.load();
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
            //===========================================================


            // var lineGap = 30;
            // var bHeight = 350;

            // var inputItem = [];

            // inputItem.push({
            //     xtype: 'textfield',
            //     name: 'child',
            //     fieldLabel: '모 UID',
            //     allowBlank: false,
            //     value: child,
            //     anchor: '-5',
            //     readOnly: true,
            //     fieldStyle: 'background-color: #ddd; background-image: none;',
            //     hidden: true
            // });

            // inputItem.push(new Ext.form.Hidden({
            //     name: 'srcahd_uid',
            //     id: gu.id('srcahd_uid')
            // }));

            // inputItem.push({
            //     id: gu.id('productcombo-DBM7_AST'),
            //     xtype: 'combo',
            //     name: 'combo_item_code',
            //     fieldLabel: '자재코드로 검색',
            //     fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            //     mode: 'local',
            //     editable: true,
            //     allowBlank: true,
            //     queryMode: 'remote',
            //     // emptyText: 'ASSY를 검색하세요.',
            //     displayField: 'item_name',
            //     valueField: 'unique_id',
            //     store: Ext.create('Rfx2.store.company.bioprotech.AssyStore', {}),
            //     sortInfo: { field: 'specification', direction: 'ASC' },
            //     minChars: 1,
            //     typeAhead: false,
            //     hideLabel: false,
            //     hideTrigger: true,
            //     anchor: '-5',
            //     listConfig: {
            //         loadingText: 'Searching...',
            //         emptyText: 'No matching posts found.',
            //         // Custom rendering template for each item
            //         getInnerTpl: function () {
            //             return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
            //         }
            //     },
            //     pageSize: 25,
            //     triggerAction: 'all',
            //     listeners: {
            //         beforequery: function (queryEvent) {
            //             gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('item_code',
            //                 '%' + gu.getCmp('productcombo-DBM7_AST').getValue() + '%');
            //         },
            //         select: function (combo, record) {

            //             var srcahd_uid = gu.getCmp('productcombo-DBM7_AST').getValue();
            //             var srcahd_uid2 = gu.getCmp('srcahd_uid');
            //             srcahd_uid2.setValue(srcahd_uid);

            //             var item_code = gu.getCmp('DBM7_TREE_item_code');
            //             var item_code2 = record.get('item_code');
            //             item_code.setValue(item_code2);

            //             var item_name = gu.getCmp('DBM7_TREE_assy_name');
            //             var item_name2 = record.get('item_name');
            //             item_name.setValue(item_name2);

            //             var specification = gu.getCmp('DBM7_TREE_specification');
            //             var specification2 = record.get('specification');
            //             specification.setValue(specification2);
            //         },
            //         pageSize: 10
            //     }
            // }
            // );

            // inputItem.push({
            //     id: gu.id('productcombo-DBM7_AST2'),
            //     xtype: 'combo',
            //     name: 'combo_item_name',
            //     fieldLabel: '자재명으로 검색',
            //     fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            //     mode: 'local',
            //     editable: true,
            //     allowBlank: true,
            //     queryMode: 'remote',
            //     // emptyText: 'ASSY를 검색하세요.',
            //     displayField: 'item_name',
            //     valueField: 'unique_id',
            //     store: Ext.create('Rfx2.store.company.bioprotech.AssyStore', {}),
            //     sortInfo: { field: 'specification', direction: 'ASC' },
            //     minChars: 1,
            //     typeAhead: false,
            //     hideLabel: false,
            //     hideTrigger: true,
            //     anchor: '-5',
            //     listConfig: {
            //         loadingText: 'Searching...',
            //         emptyText: 'No matching posts found.',
            //         // Custom rendering template for each item
            //         getInnerTpl: function () {
            //             return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
            //         }
            //     },
            //     pageSize: 25,
            //     triggerAction: 'all',
            //     listeners: {
            //         beforequery: function (queryEvent) {
            //             gu.getCmp('productcombo-DBM7_AST2').store.getProxy().setExtraParam('item_name',
            //                 '%' + gu.getCmp('productcombo-DBM7_AST2').getValue() + '%');
            //         },
            //         select: function (combo, record) {

            //             var srcahd_uid = gu.getCmp('productcombo-DBM7_AST2').getValue();
            //             var srcahd_uid2 = gu.getCmp('srcahd_uid');
            //             srcahd_uid2.setValue(srcahd_uid);

            //             var item_code = gu.getCmp('DBM7_TREE_item_code');
            //             var item_code2 = record.get('item_code');
            //             item_code.setValue(item_code2);

            //             var item_name = gu.getCmp('DBM7_TREE_assy_name');
            //             var item_name2 = record.get('item_name');
            //             item_name.setValue(item_name2);

            //             var specification = gu.getCmp('DBM7_TREE_specification');
            //             var specification2 = record.get('specification');
            //             specification.setValue(specification2);
            //         },
            //         pageSize: 10
            //     }
            // });

            // inputItem.push({
            //     id: gu.id('productcombo-DBM7_AST3'),
            //     xtype: 'combo',
            //     name: 'combo_specification',
            //     fieldLabel: '규격으로 검색',
            //     fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            //     mode: 'local',
            //     editable: true,
            //     allowBlank: true,
            //     queryMode: 'remote',
            //     // emptyText: 'ASSY를 검색하세요.',
            //     displayField: 'item_name',
            //     valueField: 'unique_id',
            //     store: Ext.create('Rfx2.store.company.bioprotech.AssyStore', {}),
            //     sortInfo: { field: 'specification', direction: 'ASC' },
            //     minChars: 1,
            //     typeAhead: false,
            //     hideLabel: false,
            //     hideTrigger: true,
            //     anchor: '-5',
            //     listConfig: {
            //         loadingText: 'Searching...',
            //         emptyText: 'No matching posts found.',
            //         // Custom rendering template for each item
            //         getInnerTpl: function () {
            //             return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
            //         }
            //     },
            //     pageSize: 25,
            //     triggerAction: 'all',
            //     listeners: {
            //         beforequery: function (queryEvent) {
            //             gu.getCmp('productcombo-DBM7_AST3').store.getProxy().setExtraParam('specification',
            //                 '%' + gu.getCmp('productcombo-DBM7_AST3').getValue() + '%');
            //         },
            //         select: function (combo, record) {

            //             var srcahd_uid = gu.getCmp('productcombo-DBM7_AST3').getValue();
            //             var srcahd_uid2 = gu.getCmp('srcahd_uid');
            //             srcahd_uid2.setValue(srcahd_uid);

            //             var item_code = gu.getCmp('DBM7_TREE_item_code');
            //             var item_code2 = record.get('item_code');
            //             item_code.setValue(item_code2);

            //             var item_name = gu.getCmp('DBM7_TREE_assy_name');
            //             var item_name2 = record.get('item_name');
            //             item_name.setValue(item_name2);

            //             var specification = gu.getCmp('DBM7_TREE_specification');
            //             var specification2 = record.get('specification');
            //             specification.setValue(specification2);
            //         },
            //         pageSize: 10
            //     }
            // });

            // inputItem.push({
            //     xtype: 'textfield',
            //     name: 'item_code',
            //     id: gu.id('DBM7_TREE_item_code'),
            //     fieldLabel: '품목 코드',
            //     allowBlank: false,
            //     readOnly: true,
            //     fieldStyle: 'text-align: right;',
            //     anchor: '-5'
            // });
            // // inputItem.push({
            // //     xtype: 'textfield',
            // //     name: 'pl_no',
            // //     fieldLabel: 'ID',
            // //     value: pl_no,
            // //     allowBlank: false,
            // //     fieldStyle: 'text-align: right;',
            // //     anchor: '-5'
            // // });
            // inputItem.push({
            //     xtype: 'textfield',
            //     id: gu.id('DBM7_TREE_assy_name'),
            //     name: 'assy_name',
            //     fieldLabel: '품명',
            //     allowBlank: false,
            //     anchor: '-5'
            // });
            // inputItem.push({
            //     xtype: 'textfield',
            //     name: 'specification',
            //     id: gu.id('DBM7_TREE_specification'),
            //     fieldLabel: '규격',
            //     readOnly: true,
            //     allowBlank: true,
            //     anchor: '-5'
            // });
            // inputItem.push({
            //     xtype: 'numberfield',
            //     name: 'bm_quan',
            //     fieldLabel: '수량',
            //     decimalPrecision: 5,
            //     allowBlank: false,
            //     value: 1,
            //     anchor: '-5'
            // });

            // inputItem.push(new Ext.form.Hidden({
            //     name: 'unique_uid',
            //     value: unique_uid
            // }));

            // inputItem.push(new Ext.form.Hidden({
            //     name: 'reserved_integer1',
            //     value: reserved_integer1 + 1
            // }));

            // inputItem.push(new Ext.form.Hidden({
            //     name: 'reserved_integer2',
            //     value: reserved_integer2
            // }));

            // gm.me().createAsyForm = Ext.create('Ext.form.Panel', {
            //     defaultType: 'textfield',
            //     border: false,
            //     bodyPadding: 15,
            //     width: 625,
            //     height: bHeight,
            //     defaults: {
            //         editable: true,
            //         allowBlank: false,
            //         msgTarget: 'side',
            //         labelWidth: 100
            //     },
            //     items: inputItem
            // });
            // var win = Ext.create('ModalWindow', {
            //     title: 'Assy 추가',
            //     width: 625,
            //     height: bHeight,
            //     minWidth: 625,
            //     minHeight: 180,
            //     items: gm.me().createAsyForm,
            //     buttons: [{
            //         text: CMD_OK,
            //         handler: function () {
            //             var form = gm.me().createAsyForm;
            //             if (form.isValid()) {
            //                 var val = form.getValues(false);
            //                 gm.me().setLoading(true);

            //                 // var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
            //                 gm.me().selected_tree_record.set('assy_name', val['assy_name']);
            //                 // gm.me().selected_tree_record.set('pl_no', val['pl_no']);
            //                 // gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
            //                 // gm.me().selected_tree_record.set('text', text);

            //                 // 기존 assymap 에 추가 요청 전송
            //                 // Ext.Ajax.request({
            //                 //     url: CONTEXT_PATH + '/design/bom.do?method=cloudAssyCreateAndCopyBom',
            //                 //     params: {
            //                 //         parent_uid: val['unique_uid'],
            //                 //         parent: val['child'],
            //                 //         ac_uid: -1,
            //                 //         pl_no: val['pl_no'],
            //                 //         bm_quan: val['bm_quan'],
            //                 //         child: val['srcahd_uid'],
            //                 //         item_name: val['assy_name'],
            //                 //         level: val['reserved_integer1'],
            //                 //         assytopUid: val['reserved_integer2']
            //                 //     },
            //                 //     success: function (result, request) {
            //                 //         gm.me().setLoading(false);
            //                 //         gm.me().reSelect();
            //                 //         gu.getCmp('DBM7TREE-Assembly').store.load();
            //                 //     },
            //                 //     failure: function () {
            //                 //         gm.me().setLoading(false);
            //                 //         gu.getCmp('DBM7TREE-Assembly').store.load();
            //                 //         extjsUtil.failureMessage;
            //                 //     }
            //                 // });
            //                 // 추가추가추 봄버전에 추가
            //                 Ext.Ajax.request({
            //                     url: CONTEXT_PATH + '/design/bom.do?method=addReferBomver',
            //                     params: {
            //                         srcahd_uid: val['srcahd_uid'],
            //                         bm_quan: val['bm_quan'],
            //                         // refer_uid: gm.me().selected_tree_record.get('refer_uid'),
            //                         // is_refer: gm.me().selected_tree_record.get('is_refer'),
            //                         to_parent_uid: gm.me().selected_tree_record.get('unique_id')
            //                     },
            //                     success: function (result, request) {
            //                         gm.me().setLoading(false);
            //                         // gm.me().reSelect();
            //                         gu.getCmp('DBM7TREE-Assembly').store.load();
            //                         gm.me().assyGrid2.getStore().load();
            //                         gm.me().bomverStore.load();
            //                     },
            //                     failure: function () {
            //                         gm.me().setLoading(false);
            //                         gu.getCmp('DBM7TREE-Assembly').store.load();
            //                         extjsUtil.failureMessage;
            //                     }
            //                 });

            //                 if (win) {
            //                     win.close();
            //                 }
            //             } else {
            //                 Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
            //             }

            //         }
            //     }, {
            //         text: CMD_CANCEL,
            //         handler: function () {
            //             if (win) {
            //                 win.close();
            //             }
            //         }
            //     }]
            // });
            // win.show(/* this, function(){} */);
            //     } // endofhandler
            // });


        },
        failure: extjsUtil.failureMessage
    }),
    // 추가추가추
    convReferAssyAction: Ext.create('Ext.Action', {
        itemId: 'convReferAssyAction',
        iconCls: 'af-plus',
        text: '참조변환',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '참조 BOM 변환',
                msg: '참조 BOM을 변환 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().convReferAssyConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    convReferAssyConfirm: function (result) {

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

                    // gm.me().setLoading(true);

                    // Ext.Ajax.request({
                    //     url: CONTEXT_PATH + '/design/bom.do?method=deleteAssyAndItsBom',
                    //     params: {
                    //         assy_uid: id
                    //     },
                    //     success: function (result, request) {
                    //         gm.me().setLoading(false);
                    //         gm.me().reSelect();
                    //         gu.getCmp('DBM7TREE-Assembly').store.load();
                    //     },
                    //     failure: function () {
                    //         gm.me().setLoading(false);
                    //         gu.getCmp('DBM7TREE-Assembly').store.load();
                    //     }
                    // });
                    // console.log('추가추가추', gm.me().selected_tree_record.data.unique_id_long);
                    // console.log('추가추가추', gm.me().selected_tree_record.data.posterity);
                    // Ext.Ajax.request({
                    //     url: CONTEXT_PATH + '/design/bom.do?method=deleteBomver',
                    //     params: {
                    //         bomver_uid: gm.me().selected_tree_record.data.unique_id_long,
                    //         posterity: gm.me().selected_tree_record.data.posterity,
                    //     },
                    //     success: function (result, request) {
                    //         gm.me().setLoading(false);
                    //         gm.me().reSelect();
                    //         gu.getCmp('DBM7TREE-Assembly').store.load();
                    //     },
                    //     failure: function () {
                    //         gm.me().setLoading(false);
                    //         gu.getCmp('DBM7TREE-Assembly').store.load();
                    //     }
                    // });
                }
            }
        }
    },

    moveToSelectedAssyAction: Ext.create('Ext.Action', {
        itemId: 'moveToSelectedAssyAction',
        iconCls: 'af-search',
        text: '이동',
        tooltip: '선택한 ASSY로 이동',
        disabled: true,
        handler: function (widget, event) {
            var rec = gm.me().selected_tree_record;
            gm.me().moveToSelectedAssyHandler(rec);
            // gm.me().assyGrid2.getStore().getProxy().setExtraParams({
            //     bomver_uid : rec.get('unique_id_long'),
            //     is_refer : rec.get('is_refer'),
            //     refer_uid : rec.get('refer_uid')
            // })
            // gm.me().assyGrid2.getStore().load();

            // gm.me().unselectAssy();
            // gm.me().store.removeAll();
        }
    }),

    moveToPrevAssyAction: Ext.create('Ext.Action', {
        itemId: 'moveToPrevAssyAction',
        iconCls: 'af-search',
        text: '이전',
        tooltip: '이전 ASSY로 이동',
        disabled: true,
        handler: function (widget, event) {
            gm.me().moveToSelectedAssyHandler(gm.me().prev_tree_record);
        }
    }),

    getHistoryAction: Ext.create('Ext.Action', {
        itemId: 'getHistoryAction',
        iconCls: 'af-search',
        text: '히스토리',
        tooltip: 'GET HISTORY',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().selected_tree_record == null) {
                return;
            }

            var bomhstStore = Ext.create('Rfx2.store.BomhstStore', {});
            bomhstStore.getProxy().setExtraParam('bomver_uid', gm.me().selected_tree_record.get('unique_id_long'));
            bomhstStore.load();
            var bWidth = 600;
            var bHeight = 300;

            var historyGrid = Ext.create('Ext.grid.Panel', {
                id: gu.id('historyGrid'),
                cls: 'rfx-panel',
                store: bomhstStore,
                border: false,
                // bodyPadding: 15,
                width: bWidth,
                height: bHeight,
                multiSelect: false,
                autoScroll: true,
                padding: '0 0 5 0',
                flex: 1,
                layout: 'fit',
                forceFit: false,
                columns: [
                    {
                        text: 'TYPE',
                        dataIndex: 'change_type',
                        width: 40
                    },
                    {
                        text: '변경내역',
                        dataIndex: 'description',
                        width: 310
                    },
                    {
                        text: '작업자',
                        dataIndex: 'creator',
                        width: 110
                    },
                    {
                        text: '작업시간',
                        dataIndex: 'create_date',
                        width: 140
                    }
                ]
            });

            var win = Ext.create('ModalWindow', {
                title: 'BOM 히스토리',
                width: bWidth,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: historyGrid,
                buttons: [{
                    text: CMD_OK,
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

    moveToSelectedAssyHandler: function (tree_record) {
        var assyStore = gm.me().assyGrid2.getStore();
        var root = assyStore.getRoot().lastChild;
        // console.log('moveToSelectedAssyHandler tree_record : ', tree_record);
        // console.log('moveToSelectedAssyHandler root : ', root);
        gm.me().prev_tree_record = root;
        assyStore.getProxy().setExtraParams({
            bomver_uid: tree_record.get('unique_id_long'),
            is_refer: tree_record.get('is_refer'),
            refer_uid: tree_record.get('refer_uid')
        })
        assyStore.reload();
        gm.me().assyGrid2.getSelectionModel().deselectAll();
        gm.me().unselectAssy();
        gm.me().store.removeAll();
    },

    getOriginAssyAction: Ext.create('Ext.Action', {
        itemId: 'getOriginAssyAction',
        iconCls: 'af-search',
        text: '원본조회',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '참조 BOM 원본 조회',
                msg: '참조 BOM의 원본으로 이동하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().getOriginAssyConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    getOriginAssyConfirm: function (result) {

        if (result == 'yes') {
            var rec = gm.me().selected_tree_record;
            // var name = rec.data.text,
            //     id = rec.data.id,
            //     depth = rec.data.depth;
            if (rec == null) {
                Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
                return;
            } else if (/*rec.data.work_state == 'R' || */rec.data.is_refer == 'N') {
                Ext.MessageBox.alert('선택 확인', '참조 BOM 이 아닙니다.');
                return;
            } else {
                // gm.me().setLoading(true);
                gm.me().assyGrid2.getStore().getProxy().setExtraParams({
                    bomver_uid: rec.data.refer_uid,
                    // is_refer : records[0].get('is_refer'),
                    // refer_uid : records[0].get('refer_uid')
                });
                gm.me().assyGrid2.getStore().load();
                /*
                
                
                */

                // Ext.Ajax.request({
                //     url: CONTEXT_PATH + '/design/bom.do?method=deleteAssyAndItsBom',
                //     params: {
                //         assy_uid: id
                //     },
                //     success: function (result, request) {
                //         gm.me().setLoading(false);
                //         gm.me().reSelect();
                //         gu.getCmp('DBM7TREE-Assembly').store.load();
                //     },
                //     failure: function () {
                //         gm.me().setLoading(false);
                //         gu.getCmp('DBM7TREE-Assembly').store.load();
                //     }
                // });
                // console.log('추가추가추', gm.me().selected_tree_record.data.unique_id_long);
                // console.log('추가추가추', gm.me().selected_tree_record.data.posterity);
                // Ext.Ajax.request({
                //     url: CONTEXT_PATH + '/design/bom.do?method=deleteBomver',
                //     params: {
                //         bomver_uid: gm.me().selected_tree_record.data.unique_id_long,
                //         posterity: gm.me().selected_tree_record.data.posterity,
                //     },
                //     success: function (result, request) {
                //         gm.me().setLoading(false);
                //         gm.me().reSelect();
                //         gu.getCmp('DBM7TREE-Assembly').store.load();
                //     },
                //     failure: function () {
                //         gm.me().setLoading(false);
                //         gu.getCmp('DBM7TREE-Assembly').store.load();
                //     }
                // });
            }
        }
    },

    // Context Popup Menu
    assyContextMenu: Ext.create('Ext.menu.Menu', {
        items: [
            this.editAssyAction,
            this.removeAssyAction,
            this.copyAssemblyAction
        ]
    }),

    searchStore: Ext.create('Rfx2.store.company.kbtech.ExtendSrcahdStore', {}),

    productStore: Ext.create('Mplm.store.ProductStore', {}),

    productSearchStore: Ext.create('Mplm.store.ProductStore', {}),

    // commonUnitStore: Ext.create('Mplm.store.CommonUnitStore2', {
    //     hasNull: false
    // }),
    // commonCurrencyStore: Ext.create('Mplm.store.CommonCurrencyStore', {
    //     hasNull: false
    // }),
    // commonModelStore: Ext.create('Mplm.store.CommonModelStore', {
    //     hasNull: false
    // }),
    // commonDescriptionStore: Ext.create('Mplm.store.CommonDescriptionStore', {
    //     hasNull: false
    // }),
    // commonStandardStore2: Ext.create('Mplm.store.CommonStandardStore', {
    //     hasNull: false
    // }),
    // gubunStore: Ext.create('Mplm.store.GubunStore', {
    //     hasNull: false
    // }),

    // supastStore: Ext.create('Mplm.store.SupastStore', {}),
    // mtrlFlagStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'MTRL_FLAG_SEW'}),

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
                parent: gm.me().selectedChild,
                parent_uid: gm.me().selectedAssyUid,
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

    deleteBomverConfirm: function (result) {

        if (result == 'yes') {
            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
                return;
            } else {
                var name = gm.me().selected_tree_record.data.text;
                var id = gm.me().selected_tree_record.data.id;
                var depth = gm.me().selected_tree_record.data.depth;

                if (depth < 2) {
                    // Ext.MessageBox.alert('선택 확인', '최상위 Assy는 삭제할 수 없습니다.');
                    // return;
                } else {

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=deleteBomver',
                        params: {
                            bomver_uid: gm.me().selected_tree_record.data.unique_id_long,
                            posterity: gm.me().selected_tree_record.data.posterity,
                        },
                        success: function (result, request) {
                            gm.me().setLoading(false);
                            gm.me().assyGrid2.getStore().load();
                            // gm.me().reSelect();
                            gu.getCmp('DBM7TREE-Assembly').store.load();
                            gm.me().bomAll.getStore().load();
                            gm.me().store.load();
                        },
                        failure: function () {
                            gm.me().setLoading(false);
                            gu.getCmp('DBM7TREE-Assembly').store.load();
                            gm.me().bomAll.getStore().load();
                            gm.me().store.load();
                        }
                    });
                }
            }
        }
    },
    refreshButtonState: function () {
        var rec = gm.me().selected_tree_record;

        // console.log('depth : ', rec.get('depth'));
        if (!rec) {
            console.log('선택된 assy가 없습니다.');
            gm.me().addAssyAction.disable();
            gm.me().addPartAction.disable();
            gm.me().addReferBomverAction.disable();
            gm.me().removeAssyAction.disable();
            gm.me().printPDFAction.disable();
            gm.me().moveToSelectedAssyAction.disable();
            gm.me().getHistoryAction.disable();
            gm.me().unselectAssy();
            gm.me().store.clearData();
            return;

        } else {
            // 버튼 제어
            gm.me().moveToSelectedAssyAction.enable();
            gm.me().getHistoryAction.enable();
            if (gm.me().prev_tree_record) {
                gm.me().moveToPrevAssyAction.enable();
            } else {
                gm.me().moveToPrevAssyAction.disable();
            }

            if (rec.get('depth') == 1) {
                gm.me().addAssyAction.enable();
                gm.me().addReferBomverAction.enable();
                gm.me().printPDFAction.enable()
                // if(!!rec.get('depth') && selections[0].get('depth') > 1){
                //     gm.me().removeAssyAction.enable();
                // } else{
                // gm.me().removeAssyAction.disable();
                // }

                if (rec.get('work_state') != 'R') {
                    // gm.me().removeAssyAction.enable();
                    if (rec.get('is_refer') != 'Y') {
                        gm.me().addPartAction.enable();
                    } else {
                        // gm.me().addReferBomverAction.enable();
                        // gm.me().removeAssyAction.enable();
                        // gm.me().addAssyAction.enable();

                        gm.me().addAssyAction.disable();
                        gm.me().addPartAction.disable();
                        gm.me().addReferBomverAction.disable();
                        // gm.me().removeAssyAction.disable();
                    }
                } else { // 수정 불가
                    gm.me().addAssyAction.disable();
                    gm.me().addPartAction.disable();
                    gm.me().addReferBomverAction.disable();
                    gm.me().removeAssyAction.disable();
                }
            } else if (rec.get('depth') == 2) {
                gm.me().addAssyAction.disable();
                gm.me().addPartAction.disable();
                gm.me().addReferBomverAction.disable();
                if (rec.get('work_state') != 'R') {
                    gm.me().removeAssyAction.enable();
                } else {
                    gm.me().removeAssyAction.disable();
                }
            } else { // 수정 불가
                gm.me().addAssyAction.disable();
                gm.me().addPartAction.disable();
                gm.me().addReferBomverAction.disable();
                gm.me().removeAssyAction.disable();
            }
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