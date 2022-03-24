Ext.define('Rfx2.view.company.dabp01kr.designPlan.DesignBomTreeView_DABP', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'design-bom-tree-view-dabp',
    initComponent: function () {

        this.multiSortHidden = true;
        this.stateCodeStore.load();

        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('pj_name');

        var pcr_divs = new Ext.data.ArrayStore({
            fields: ['name', 'code'],
            data: [
                ['구매', 'PU'], //PU
                ['재고', 'ST'],	//ST
                ['외주재단(구매)', 'OU-P'], //OU
                ['외주재단(재고)', 'OU-S'], //OU
                ['PE코팅(구매)', 'PE-P'],	//PE
                ['PE코팅(재고)', 'PE-S'],	//PE
                ['슬리팅(구매)', 'SL-P'],		//SL
                ['슬리팅(재고)', 'SL-S'],		//SL
                ['사입', 'PG'],//PG 재료. 고객 -> 가공
            ]
        });
        //ROLL/SHEET
        var item_types = new Ext.data.ArrayStore({
            fields: ['code', 'name'],
            data: [
                ['ROLL', 'ROLL'],
                ['SHEET', 'SHEET']
            ]
        });

        var start_date;

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];

            switch (dataIndex) {
                case 'item_code':
                case 'req_info':
                    columnObj["align"] = 'center';
                    columnObj["textAlign"] = 'center';

                    break;
                case 'pcr_div': {
                    columnObj['align'] = 'center';
                    columnObj['style'] = 'align:center;';
                    //columnObj['xtype'] = 'actioncolumn';
                    //  M:제작, O:Out, S:Stock, P: 구매
                    columnObj["editor"] = new Ext.form.ComboBox({
                        displayField: 'name',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: pcr_divs,
                        triggerAction: 'all',
                        valueField: 'code',
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{code}">{name}</div>';
                            },
                        },
                        selectOnFocus: true,
                    });
                    columnObj['renderer'] = function (val, a, o) {
                        var pcr_div = o.get('pcr_div');
                        var val = '';
                        var arr = pcr_divs.data.items;
                        for (var i = 0; i < arr.length; i++) {
                            var o = arr[i];
                            //console_logs('o', o);
                            if (o.get('code') == pcr_div) {
                                val = o.get('name');
                            }
                        }

                        return '<span style="display:inline-block;width:18px;color:' + "#163F69" + ';">' + val + '</span>';
                    };
                }
                    break;
                case 'item_type': {

                    //  ROLL/SHEET
                    columnObj['align'] = 'center';
                    columnObj['style'] = 'align:center;';
                    columnObj['xtype'] = 'actioncolumn';
                    columnObj["editor"] = new Ext.form.ComboBox({
                        displayField: 'name',
                        editable: true,
                        align: 'center',
                        style: 'align:center;',
                        forceSelection: true,
                        mode: 'local',
                        store: item_types,
                        triggerAction: 'all',
                        valueField: 'code',
                        selectOnFocus: true,
                    });
                    columnObj['items'] = [{
                        getClass: function (v, meta, rec) {
                            //console_logs('getClass rec', rec);
                            if (rec.get('item_type') == 'ROLL') {
                                return 'paper-roll';
                            } else {
                                return 'paper-sheet';
                            }


                        }
                    }];

                }
                    break;

                case 'reserved1':

                    columnObj['text'] = '재단있음';
                    columnObj['menuDisabled'] = true;
                    columnObj['sortable'] = false;
                    columnObj['useYn'] = true;
                    columnObj['xtype'] = 'actioncolumn';
                    columnObj['align'] = 'center';
                    columnObj['style'] = 'align:center;';
                    columnObj['width'] = 80;
                    columnObj['editor'] = {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor',
                        selectOnFocus: true,
                    };
                    columnObj['items'] = [{
                        getClass: function (v, meta, rec) {
                            //console_logs('getClass rec', rec);
                            if (rec.get('reserved1') != null && (rec.get('reserved1') == 'true' || rec.get('reserved1') == true )) {
                                gm.me().assyReserved1 = true;
                                return 'dabp-arrow-right';
                            } else {
                                gm.me().assyReserved1 = false;
                                return 'dabp-close';
                            }
                        }
                    }];

                    break;
                case 'reserved2':
                    columnObj["editor"] = {
                        xtype: 'textareafield',
                        emptyText: '슬리팅은 ,로 구분',
                        height: 25,
                        selectOnFocus: true,
                    };
//	            	columnObj["editor"] = //{ xtype: 'textarea', height: 3, tdCls: 'wrapText' };
//	            	{
//	                        xtype: 'textareafield',
//	                        allowblank: true,
//	                        maxLength: 165,
//	                        enforceMaxLength: true,
//	                        height: 50,
//	                        grow: true,
//	                        completeOnEnter: false,
//	                        enableKeyEvents: true, //Listen to keyevents
//	                        listeners: {
//	                            keydown: function(field, e) {
//	                                if (e.getKey() == e.ENTER) {
//	                                    e.stopEvent(); // Stop event propagation
//	                                }
//	                            }
//	                        }
//	                    };
                    break;
//	            case 'bm_quan':
//	            case 'comment':
//	            	columnObj['renderer'] = function(val,a,o) {
//	                    return (val==null?'':val) + '<span style="color:' + "#163F69" + ';"> ' + 'mm' + '</span>';
//	                };
//	                columnObj["editor"] = {};
//	            	break;
                case 'remark':
                    columnObj['renderer'] = function (val, a, o) {
                        var item_type = o.get('item_type');

                        var unit = item_type == 'ROLL' ? 'M' : 'mm';
                        return (val == null ? '' : val) + '<span style="display:inline-block;width:18px;color:' + "#163F69" + ';">' + unit + '</span>';
                    };
                    columnObj["editor"] = {
                        selectOnFocus: true,
                    };
                    break;
////	            case 'reserved3':
//	            case 'reserved4':
//	            	columnObj['editor'] = {
//	                    xtype: 'numberfield',
//	                    allowBlank: true,
//	                    minValue: 0,
//	                    maxValue: 15000000
//	                };
//	            	break;
                case 'stock_qty':
                    columnObj['renderer'] = function (val, a, o) {
                        var stock_qty = o.get('stock_qty');
                        var stock_qty_useful = o.get('stock_qty_useful');
                        var title = '유효:' + stock_qty_useful + ' / 총:' + stock_qty;
                        return '<span title="' + title + '">' + stock_qty_useful + '</span>';

                    };
                    break;
                case 'statusHangul':
                case 'item_code':
                case 'reserved_double1':
                case 'reserved_double2':
                    break;
                default:
                    columnObj["editor"] = {
                        selectOnFocus: true,
                    };
            }

        });

        this.copyWondanField(this.columns);

        console_logs('columns', this.columns);

        //원지 스토어
        this.createStore('Rfx.model.PartLine', [{
                property: 'pl_no',
                direction: 'ASC'
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

        this.store.getProxy().setExtraParam('not_is_def', 'Y');

        //원단스토어
        this.storeO = this.createStoreSub('Rfx.model.PartLine', [{
            property: 'pl_no',
            direction: 'ASC'
        }], gm.pageSize, {
            creator: 'a.creator',
            unique_id: 'a.unique_uid'
        }, ['assymap'], 'sp_code', 'O', {});

        //부자재 스토어
        this.storeK = this.createStoreSub('Rfx.model.PartLine', [{
            property: 'pl_no',
            direction: 'ASC'
        }], gm.pageSize, {
            creator: 'a.creator',
            unique_id: 'a.unique_uid'
        }, ['assymap'], 'sp_code', 'K', {});

        this.buttonToolbarR = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartActionR,
                this.removePartActionR,
                '-',
                this.planConfirmActionR,
                '->',
                {
                    xtype: 'component',
                    id: gu.id('spctinfo' + 'R'),
                    style: 'margin-right:5px;width:18px;text-align:right',
                    style: 'color:#094C80;align:right;',
                    html: ''
                }

            ]
        });

        this.buttonToolbarO = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartActionO,
                this.removePartActionO,
                '-',
                this.planConfirmActionO,
                '->',
                {
                    xtype: 'component',
                    id: gu.id('spctinfo' + 'O'),
                    style: 'margin-right:5px;width:18px;text-align:right',
                    style: 'color:#094C80;align:right;',
                    html: ''
                }

            ]
        });
        this.buttonToolbarK = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartActionK,
                this.removePartActionK,
                '-',
                this.planConfirmActionK,
                '->',
                {
                    xtype: 'component',
                    id: gu.id('spctinfo' + 'K'),
                    style: 'margin-right:5px;width:18px;text-align:right',
                    style: 'color:#094C80;align:right;',
                    html: ''
                }

            ]
        });

        Ext.grid.RowEditor.prototype.saveBtnText = "확인";
        Ext.grid.RowEditor.prototype.cancelBtnText = "취소";
        this.rowEditingR = Ext.create('Ext.grid.plugin.RowEditing', {
            // clicksToMoveEditor: 1,
            autoCancel: false,
            clicksToEdit: 1,
        });
        this.rowEditingO = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,

        });
        this.rowEditingK = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });

        this.cellEditingR = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
        this.cellEditingO = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
        this.cellEditingK = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        var toolbarsR = [this.buttonToolbarR, this.labelToolbarR];

        var useColumn = [];
        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];

            var dataIndex = o['dataIndex'];

            if (dataIndex == 'num') {
                //o["style"] ='background-color:#EAEAEA;text-align:center';
                o["tdCls"] = 'custom-column-grey';
            }

            if (o['useYn'] == true) {
                useColumn.push(o);
            }

        }

        var viewConfig = {
            stripeRows: true,
            markDirty: false,
            enableTextSelection: true
        };

        if (this.rowClassFc != null) {
            viewConfig['getRowClass'] = this.rowClassFc;
        }

        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: this.selMode == 'SINGLE' ? 'SINGLE' : 'multi',
            checkOnly: this.selCheckOnly == true ? true : false,
            allowDeselect: this.selAllowDeselect == false ? false : true
        });

        var o = {
            title: '원지계획',
            store: this.store,
            selModel: selModel,
            dockedItems: toolbarsR,
            columns: this.getFields('R'),
            defaultFocus: 'textfield[name=inputa]',
            viewConfig: viewConfig,
            width: '60%',
            plugins: [this.rowEditingR, this.cellEditingR],
            listeners: {
                'selectionchange': function (view, records) {
                    console_logs('selectionchange records', records);

                    var spctinfo = gu.getCmp('spctinfo' + 'R');
                    if (records.length) {
                        var rec = records[0];
                        gm.me().assymapUidbom = rec.get('unique_uid');
                        gm.me().assymapPcr_div = rec.get('request_comment');
                        gm.me().assymapBmQuan = rec.get('bm_quan');
                        gm.me().assymapPlNo = rec.get('pl_no');
                        gm.me().assyId = rec.get('hier_pos');
                        gm.me().assylevel = rec.get('reserved_integer1');
                        gm.me().assySp_code = rec.get('sp_code');
                        gm.me().assymapParentUid = rec.get('parent_uid');


                        gUtil.enable(gm.me().removePartActionR);
                        gUtil.enable(gm.me().planConfirmActionR);
                        gUtil.enable(gm.me().removePartActionO);
                        gUtil.enable(gm.me().planConfirmActionO);
                        gUtil.enable(gm.me().removePartActionK);
                        gUtil.enable(gm.me().planConfirmActionK);

                        spctinfo.update(rec.get('specification'));

                    } else {
                        gUtil.disable(gm.me().removePartActionR);
                        gUtil.disable(gm.me().planConfirmActionR);
                        gUtil.disable(gm.me().removePartActionO);
                        gUtil.disable(gm.me().planConfirmActionO);
                        gUtil.disable(gm.me().removePartActionK);
                        gUtil.disable(gm.me().planConfirmActionK);

                        spctinfo.update('');
                    }


                    gm.me().selectPartline(records);
                }
            }
        };
        o['loadMask'] = true;

        this.grid = Ext.create('Rfx.base.BaseGrid', o);

        this.grid.editBaseGrid = this.editBaseGrid;

        var me = this;

        Ext.apply(me, {
            layout: 'border',
            items: [me.createWest(), me.createCenter()]
        });

        this.cloudprojectStore.getProxy().setExtraParam('start_date_isnull', null);
        this.cloudprojectStore.getProxy().setExtraParam('status_isnotN', 'true');
        this.reloadProject();

        me.callParent(arguments);

    },

    reloadProject: function () {
        this.cloudprojectStore.load(function (records) {
            if (records != null) {

                var o = gu.getCmp('assy_quan');
                if (o != null) {
                    o.update('<blink>' + records.length + '</blink>');
                }

            }
        });
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


    createCenter: function () {


        var myCartColumn = [];
        var myCartFields = [];

        for (var i = 0; i < this.columns.length; i++) {

            switch (this.columns[i]['dataIndex']) {
                case 'pa_pl_no':
                case 'pj_code':
                //case 'reserved_double1':
                case 'making_quan': {
                    var nO = gUtil.copyObj(this.columns[i]);
                    nO["width"] = 60;
                    myCartColumn.push(nO);
                }
                    break;

                case 'req_info':
                case 'statusHangul':
                case 'sales_price':
                case 'static_sales_price':
                case 'goodsout_quan':
                case 'reserved_varchar1':
                case 'ref_quan':
                case 'comment':
                case 'description':
                case 'remark':
                case 'model_no':
                case 'sp_code':
                case 'route_type':
                    //case 'user_name':
                    break;
                case 'reserved_double1': {
                    var columnObj = gUtil.copyObj(this.columns[i]);
                    columnObj["width"] = 60;
                    columnObj["editor"] = {
                        selectOnFocus: true,
                    };
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    myCartColumn.push(columnObj);

                }
                    break;
                case 'bm_quan': {
                    var columnObj = gUtil.copyObj(this.columns[i]);
                    columnObj["editor"] = {
                        selectOnFocus: true,
                    },
                        columnObj["css"] = null;
                    columnObj["renderer"] = null
                    myCartColumn.push(columnObj);
                    break;
                }

                default:
                    myCartColumn.push(this.columns[i]);
            }
        }


        var selModelO = Ext.create("Ext.selection.CheckboxModel", {
            mode: this.selMode == 'SINGLE' ? 'SINGLE' : 'multi',
            checkOnly: this.selCheckOnly == true ? true : false,
            allowDeselect: this.selAllowDeselect == false ? false : true
        });
        var selModelK = Ext.create("Ext.selection.CheckboxModel", {
            mode: this.selMode == 'SINGLE' ? 'SINGLE' : 'multi',
            checkOnly: this.selCheckOnly == true ? true : false,
            allowDeselect: this.selAllowDeselect == false ? false : true
        });

        var toolbarsO = [this.buttonToolbarO, this.labelToolbarO];
        this.gridO = Ext.create('Rfx.base.BaseGrid', {
            title: '원단계획',
            store: this.storeO,
            collapsible: true,
            multiSelect: true,
            selModel: selModelO,
            stateId: 'gridO' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: toolbarsO,
            columns: /* (G) */ this.getFields('O'),
            plugins: [this.rowEditingO],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'selectionchange': function (view, records) {
                        console_logs('selectionchange records', records);

                        var spctinfo = gu.getCmp('spctinfo' + 'O');

                        if (records.length) {
                            var rec = records[0];
                            gm.me().assymapUidbom = rec.get('unique_uid');
                            gm.me().assymapPcr_div = rec.get('request_comment');
                            gm.me().assymapBmQuan = rec.get('bm_quan');
                            gm.me().assymapPlNo = rec.get('pl_no');
                            gm.me().assyId = rec.get('hier_pos');
                            gm.me().assylevel = rec.get('reserved_integer1');
                            gm.me().assySp_code = rec.get('sp_code');
                            gm.me().assymapParentUid = rec.get('parent_uid');

                            gm.me().assyReserved4 = rec.get('reserved4');
                            gm.me().assyBm_quan = rec.get('bm_quan');
                            gm.me().assySp_code = rec.get('sp_code');

                            gUtil.enable(gm.me().removePartActionR);
                            gUtil.enable(gm.me().planConfirmActionR);
                            gUtil.enable(gm.me().removePartActionO);
                            gUtil.enable(gm.me().planConfirmActionO);
                            gUtil.enable(gm.me().removePartActionK);
                            gUtil.enable(gm.me().planConfirmActionK);

                            spctinfo.update(rec.get('specification'));

                        } else {
                            gUtil.disable(gm.me().removePartActionR);
                            gUtil.disable(gm.me().planConfirmActionR);
                            gUtil.disable(gm.me().removePartActionO);
                            gUtil.disable(gm.me().planConfirmActionO);
                            gUtil.disable(gm.me().removePartActionK);
                            gUtil.disable(gm.me().planConfirmActionK);

                            spctinfo.update('');
                        }
                    },
                    'afterrender': function (gridO) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        return false;
                    }
                }
            }
            , listeners: {
                'selectionchange': function (view, records) {
                    gm.me().selectPartline(records);
                }
            }
        });

        this.gridO.editBaseGrid = this.editBaseGrid;

        this.gridO.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                //	gm.me().onMygridSelection(selections);
            }
        });


        this.gridO.on('edit', function (editor, e) {
            // commit the changes right after editing finished

            // var rec = e.record;
            //  console_logs('rec', rec);
            // var unique_uid = rec.get('unique_uid');
            // var reserved_double1 = rec.get('reserved_double1');

            // Ext.Ajax.request({
            //     url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
            //     params: {
            //         assymap_uid: unique_uid,
            //         pr_qty: reserved_double1,
            //         child: rec.get('unique_id_long')
            //     },
            //     success: function(result, request) {

            //         var result = result.responseText;
            //         // console_logs("", result);

            //     },
            //     failure: extjsUtil.failureMessage
            // });

            // rec.commit();
        });


        /*******************************************************************************
         * 원단 Grid End
         */
            //this.grid.setTitle('원지계획');


        var toolbarsK = [this.buttonToolbarK, this.labelToolbarK];
        this.gridK = Ext.create('Rfx.base.BaseGrid', {
            title: '부자재계획',
            store: this.storeK,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelK,
            stateId: 'gridK' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: toolbarsK,
            columns: /* (G) */ this.getFields('K'),
            plugins: [this.rowEditingK],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'selectionchange': function (view, records) {
                        console_logs('selectionchange records', records);
                        if (records.length) {
                            var rec = records[0];
                            gm.me().assymapUidbom = rec.get('unique_uid');
                            gm.me().assymapPcr_div = rec.get('request_comment');
                            gm.me().assymapBmQuan = rec.get('bm_quan');
                            gm.me().assymapPlNo = rec.get('pl_no');
                            gm.me().assyId = rec.get('hier_pos');
                            gm.me().assylevel = rec.get('reserved_integer1');
                            gm.me().assySp_code = rec.get('sp_code');
                            gm.me().assymapParentUid = rec.get('parent_uid');

                            gm.me().assySp_code = rec.get('sp_code');

                            gUtil.enable(gm.me().removePartActionR);
                            gUtil.enable(gm.me().planConfirmActionR);
                            gUtil.enable(gm.me().removePartActionO);
                            gUtil.enable(gm.me().planConfirmActionO);
                            gUtil.enable(gm.me().removePartActionK);
                            gUtil.enable(gm.me().planConfirmActionK);

                        } else {
                            gUtil.disable(gm.me().removePartActionR);
                            gUtil.disable(gm.me().planConfirmActionR);
                            gUtil.disable(gm.me().removePartActionO);
                            gUtil.disable(gm.me().planConfirmActionO);
                            gUtil.disable(gm.me().removePartActionK);
                            gUtil.disable(gm.me().planConfirmActionK);
                        }
                    },
                    'afterrender': function (gridO) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        return false;
                    }
                }
            }
            , listeners: {
                'selectionchange': function (view, records) {
                    gm.me().selectPartline(records);
                }
            }
        });

        this.gridK.editBaseGrid = this.editBaseGrid;

//        this.cutplanTab = Ext.widget('tabpanel', {
//            layout: 'border',
//            title: '재단계획',
//            border: false,
//            tabPosition: 'top',
//            layoutConfig: {
//                columns: 1,
//                rows: 1
//            },
//            items: []
//        });
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '60%',
            tabPosition: 'top',
            dockedItems: [{
                dock: 'bottom',
                xtype: 'toolbar',
                items: [{
                    id: gu.id('projectinfo'),
                    xtype: 'component',
                    fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F5F5F5; background-image: none; border: none;',
                    style: 'border: none;',
                    hideBorders: true,
                    height: 110,
                    width: '100%',
                    border: false,
                    readOnly: true
                }
                ]
            }],
            items: [this.grid, this.gridO, this.gridK]
        });

        return this.center;

    },

    // ----------------------- END OF CENTER --------------------

    createWest: function () {

        Ext.tip.QuickTipManager.init();

        this.cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});

        var makersR = Ext.create('Mplm.store.SupastStore');
        makersR.getProxy().setExtraParam('supplier_type', 'R');
        var makersO = Ext.create('Mplm.store.SupastStore');
        makersO.getProxy().setExtraParam('supplier_type', 'O');
        var makersK = Ext.create('Mplm.store.SupastStore');
        makersK.getProxy().setExtraParam('supplier_type', 'K');

        this.supplierStore = Ext.create('Mplm.store.SupastStore');

        this.cloudprojectStore.getProxy().setExtraParam('is_closed', 'N');
        this.assyGrid = Ext.create('Ext.tree.Panel', {
            collapsible: true,
            useArrows: true,
            rootVisible: false,
            preventHeader: true,
            store: this.cloudProjectTreeStore,
            multiSelect: true,
            region: 'center',
            height: '60%',
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1}),
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.finishAction,
                        '->',
                        {
                            id: gu.id('makercombo'),
                            xtype: 'combo',
                            mode: 'local',
                            editable: false,
                            width: 160,
                            queryMode: 'remote',
                            emptyText: '제조원 변경',
                            displayField: 'supplier_name',
                            valueField: 'supplier_name',
                            editable: false,
                            forceSelection: true,
                            store: this.supplierStore,
                            triggerAction: 'all',
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{supplier_code} : {area_code}"><small>{supplier_name}</small></div>';
                                }
                            },
                            triggerAction: 'all',
                            listeners: {
                                select: function (combo, record) {
                                    //console_logs('makercombo value', combo);
                                    //console_logs('makercombo record', record);
                                    var supplier_code = record.get('supplier_code');
                                    var supplier_name = record.get('supplier_name');
                                    var area_code = record.get('area_code');

                                    console_logs('makercombo supplier_code', supplier_code);
                                    console_logs('makercombo supplier_name', supplier_name);
                                    console_logs('makercombo area_code', area_code);

                                    if (gm.me().selected_tree_record == null) {
                                        Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
                                        return;
                                    } else {
                                        var name = gm.me().selected_tree_record.data.text;
                                        var id = gm.me().selected_tree_record.data.id;
                                        var depth = gm.me().selected_tree_record.data.depth;

                                        console_logs('makercombo name', name);
                                        console_logs('makercombo id', id);
                                        console_logs('makercombo depth', depth);

                                        if (depth < 2) {
                                            Ext.MessageBox.alert('선택 확인', '최상위 Assy는 수정할 수 없습니다.');
                                            return;
                                        } else {

                                            var rec = gm.me().selected_tree_record;

                                            rec.set('reserved3', supplier_code);
                                            rec.set('reserved4', supplier_name);
                                            rec.set('reserved5', area_code);

                                            rec.commit();


                                            console_logs('rec commit', rec);

                                            var unique_uid = gm.me().selected_tree_record.data.unique_uid;
                                            console_logs('target unique_uid', unique_uid);
                                            //tells the Proxy to save the Model. In this case it will perform a PUT request to /users/123 as this Model already has an id
                                            var gridStore = gm.me().cloudProjectTreeStore;
                                            gridStore.getProxy().setExtraParam("srch_type", "updateAssymap");
                                            gridStore.getProxy().setExtraParam("reserved3", supplier_code);
                                            gridStore.getProxy().setExtraParam("reserved4", supplier_name);
                                            gridStore.getProxy().setExtraParam("reserved5", area_code);
                                            gridStore.getProxy().setExtraParam("unique_id", unique_uid);
                                            rec.save({
                                                success: function () {
                                                    console.log('Tree was updated');
                                                    gridStore.getProxy().setExtraParam("srch_type", null);
                                                    gridStore.getProxy().setExtraParam("reserved3", null);
                                                    gridStore.getProxy().setExtraParam("reserved4", null);
                                                    gridStore.getProxy().setExtraParam("reserved5", null);
                                                    gridStore.getProxy().setExtraParam("unique_id", null);
                                                }
                                            });

                                        }
                                    }
                                }
                            }
                        }

                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1-1',
                    style: 'color:white;',
                    items: [
                        {
                            id: gu.id('target-projectcode'),
                            xtype: 'component',
                            style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                            html: "----------",
                        },
                        {
                            id: gu.id('projectcombo'),
                            xtype: 'combo',
                            mode: 'remote',
                            editable: true,
                            width: '65%',
                            queryMode: 'remote',
                            emptyText: '프로젝트',
                            displayField: 'pj_name',
                            valueField: 'unique_id',
                            store: this.cloudprojectStore,
                            sortInfo: {field: 'unique_id', direction: 'DESC'},
                            minChars: 2,
                            typeAhead: true,
                            hideLabel: true,
                            hideTrigger: false,
                            anchor: '100%',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{pj_name}"><small><font color=blue>{pj_code}</font> {pj_name}</small></div>';
                                }
                            },
                            pageSize: 200,
                            triggerAction: 'all',
                            listeners: {
                                select: function (combo, record) {

                                    gm.me().selectProjectCombo(record);
                                },
                                el: {
                                    click: function (combo) {
                                        gu.getCmp('projectcombo').clearValue();
                                    },
                                    scope: this
                                }
                            }
                        }, {
                            xtype: 'component',
                            html: "대기건수:",
                            style: 'color:#fff;align:right;height:25px;padding-top:5px; padding-left:10px; width:70px; text-align:left;'
                        },
                        {
                            id: gu.id('assy_quan'),
                            xtype: 'component',
                            html: "",
                            style: 'color:#fff;align:right;height:25px;padding-top:5px; width:20px; text-align:right;'
                        }
                    ]
                }
            ], // dockedItems of End
            columns: [{
                xtype: 'treecolumn', // this is so we know which column
                // will show the tree
                text: '항목',
                width: 180,
                sortable: true,
                dataIndex: 'text',
                locked: true
            }, {
                xtype: 'checkcolumn',
                text: gm.getMC('sro1_completeAction', '완료'),
                dataIndex: 'is_closed',
                width: 50,
                style: 'text-align:center',
                align: 'center',
                listeners: {
                    checkchange: {
                        fn: function (obj, rowIndex, checked, eOpts) {
                            gm.me().checkTreeNode(obj, rowIndex, checked);


                        }
                    }
                },
                stopSelection: true
            }, {
                text: '상태',
                dataIndex: 'status',
                width: 0,
                style: 'text-align:center',
                align: 'center',
                stopSelection: false
            }, {
                text: '품명',
                width: 60,
                dataIndex: 'item_name',
                sortable: true
            }, {
                text: '규격',
                width: 100,
                dataIndex: 'specification',
                sortable: true
            }, {
                text: '평량(배합)',
                width: 80,
                dataIndex: 'description',
                sortable: true
            }, {
                // xtype: 'checkcolumn',
                text: '수량',
                dataIndex: 'bm_quan',
                width: 60,
                style: 'text-align:right',
                align: 'right',
                stopSelection: false
            },
                {
                    text: '제조원',
                    width: 180,
                    dataIndex: 'reserved4',
                    sortable: true
                }
            ],
            listeners: {
                'afterrender': function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {
                    }, this);
                },
                activate: function (tab) {
                    setTimeout(function () {
                    }, 1);
                },
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                }
            }
        });


        this.assyGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().onAssemblyGridSelection(selections);
            }
        });

        var stockColumn = [
            {text: '재고위치', width: 70, dataIndex: 'alter_reason', style: 'text-align:center', sortable: false},
            {
                text: '규격 | 모델명 / [설명]',
                width: 300,
                dataIndex: 'spec_model_desc',
                style: 'text-align:center',
                sortable: false
            },
            {text: '품명', width: 180, dataIndex: 'item_name', style: 'text-align:center', sortable: false},
            {text: '재고수량', width: 80, dataIndex: 'wh_qty', style: 'text-align:center', sortable: false,
                align: 'right',
                renderer: function (value, context, tmeta) {
                    return Ext.util.Format.number(value, '0,00/i');
                }
            }
        ];

        var stockStore = Ext.create('Rfx.model.StockLine', {
            fields: stockColumn
        });

        this.storeStockWonji = new Ext.data.Store({
            pageSize: 100,
            model: stockStore,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });


        this.storeStockWondan = new Ext.data.Store({
            pageSize: 100,
            model: stockStore,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });

        this.storeStockSubpart = new Ext.data.Store({
            pageSize: 100,
            model: stockStore,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });

        this.gridStockWonji = Ext.create('Ext.grid.Panel', {
            store: this.storeStockWonji,
            title: '원지',
            border: true,
            collapsible: true,
            multiSelect: true,
            columns: /* (G) */ stockColumn,
            //plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function (gridO) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                        var child_uid = gm.me().assyChildUid;
                        var ac_uid = gm.me().assyAcUid;
                        var parent_uid = gm.me().unique_uid;
                        var order_com_unique = gm.me().order_com_unique_id;
                        var srcahd_uid = record['data']['uid_srcahd'];
                        var assySelect = gm.me().checkStockAssemblySelection(record, child_uid, ac_uid, order_com_unique, srcahd_uid);
                        var node = JSON.parse(assySelect);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/generalData.do?method=addStockAssy',
                            params: {
                                srcahd_uid: srcahd_uid,
                                parent_uid: parent_uid,
                                child_uid: child_uid,
                                ac_uid: ac_uid,
                                order_com_unique: order_com_unique,
                                sp_code: 'R',
                                pcr_div: 'ST'
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                gm.me().store.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().store.getProxy().setExtraParam('orderBy', "pl_no");
                                gm.me().store.getProxy().setExtraParam('ascDesc', "ASC");
                                gm.me().store.getProxy().setExtraParam('ac_uid', ac_uid);
                                gm.me().store.getProxy().setExtraParam('sp_code', 'R');
                                gm.me().store.load(function (records) {
                                });
                            },
                            failure: extjsUtil.failureMessage
                        }); // endAjax
                    }, //endof itemdblclick
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        return false;
                    }
                }
            }
        });
        this.gridStockWondan = Ext.create('Ext.grid.Panel', {
            store: this.storeStockWondan,
            title: '원단',
            border: true,
            collapsible: true,
            multiSelect: true,
            columns: /* (G) */ stockColumn,
            //plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function (gridO) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                        var child_uid = gm.me().assyChildUid;
                        var ac_uid = gm.me().assyAcUid;
                        var parent_uid = gm.me().unique_uid;
                        var order_com_unique = gm.me().order_com_unique_id;
                        var srcahd_uid = record['data']['uid_srcahd'];
                        var assySelect = gm.me().checkStockAssemblySelection(record, child_uid, ac_uid, order_com_unique, srcahd_uid);
                        var node = JSON.parse(assySelect);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/generalData.do?method=addStockAssy',
                            params: {
                                srcahd_uid: srcahd_uid,
                                parent_uid: parent_uid,
                                child_uid: child_uid,
                                ac_uid: ac_uid,
                                order_com_unique: order_com_unique,
                                sp_code: 'O',
                                pcr_div: 'ST'
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                gm.me().storeO.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().storeO.getProxy().setExtraParam('orderBy', "pl_no");
                                gm.me().storeO.getProxy().setExtraParam('ascDesc', "ASC");
                                gm.me().storeO.getProxy().setExtraParam('sp_code', 'O')
                                gm.me().storeO.getProxy().setExtraParam('ac_uid', ac_uid);
                                gm.me().storeO.load(function (records) {
                                });
                            },
                            failure: extjsUtil.failureMessage
                        }); // endAjax
                    }, //endof itemdblclick
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        return false;
                    }
                }
            }
        });
        this.gridStockSubpart = Ext.create('Ext.grid.Panel', {
            store: this.storeStockSubpart,
            title: '부자재',
            border: true,
            collapsible: true,
            multiSelect: true,
            columns: /* (G) */ stockColumn,
            //plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function (gridO) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                        var child_uid = gm.me().assyChildUid;
                        var ac_uid = gm.me().assyAcUid;
                        var parent_uid = gm.me().unique_uid;
                        var order_com_unique = gm.me().order_com_unique_id;
                        var srcahd_uid = record['data']['uid_srcahd'];
                        var assySelect = gm.me().checkStockAssemblySelection(record, child_uid, ac_uid, order_com_unique, srcahd_uid);
                        var node = JSON.parse(assySelect);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/generalData.do?method=addStockAssy',
                            params: {
                                srcahd_uid: srcahd_uid,
                                parent_uid: parent_uid,
                                child_uid: child_uid,
                                ac_uid: ac_uid,
                                order_com_unique: order_com_unique,
                                sp_code: 'K',
                                pcr_div: 'ST'
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                gm.me().storeK.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().storeK.getProxy().setExtraParam('orderBy', "pl_no");
                                gm.me().storeK.getProxy().setExtraParam('ascDesc', "ASC");
                                gm.me().storeK.getProxy().setExtraParam('ac_uid', ac_uid);
                                gm.me().storeK.getProxy().setExtraParam('sp_code', 'K');
                                gm.me().storeK.load(function (records) {
                                });
                            },
                            failure: extjsUtil.failureMessage
                        }); // endAjax
                    }, //endof itemdblclick
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        return false;
                    }
                }
            }
        });

        // 원지 선택 시
        this.gridStockWonji.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {

                }
            }
        });

        // 원단 선택시
        this.gridStockWondan.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {

                }
            }
        });

        // 부자재 선택시
        this.gridStockSubpart.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {

                }
            }
        });

        this.stockstateTab = Ext.widget('tabpanel', {
            collapsible: true,
            title: '재고 현황',
            layout: 'border',
            region: 'south',
            height: '40%',
            titleCollapsed: true,
            collapsed: true,
            animate: true,
            style: {
                border: '1px solid #133160'//,
                //borderStyle: 'dotted'
            },
            tabPosition: 'top',
            layoutConfig: {
                columns: 1,
                rows: 1
            },
            items: [this.gridStockWonji, this.gridStockWondan, this.gridStockSubpart]
        });

        var panel = Ext.create('Ext.panel.Panel', {
            id: gu.id('bomTab'),
            layout: 'border',
            title: '수주정보',
            border: false,
            tabPosition: 'bottom',
            layoutConfig: {columns: 2, rows: 1},
            items: [this.assyGrid, this.stockstateTab]
        });


        this.west = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '40%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },
            items: [panel]
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
    gridO: null,
    store: null,
    storePurchase: null,
    storeStockWonji: null,
    storeStockWondan: null,
    storeStockSubpart: null,
    stockStore: null,
    gItemGubunType: null,
    itemGubunType: null,

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

    cloudprojectStore: Ext.create('Mplm.store.cloudProjectStore', {
        pageSize: 200
    }),
    mesProjectTreeStore: null,
    routeGubunTypeStore: null,
    routeGubunTypeStore_W: null,
    commonStandardStore: null,
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

    selectAssy: function (record) {
        console_logs('this.depth', this.depth);
        console_logs('selectAssy record', record);
        var start_date_select_assay = new Date();
        console.log('>>> start_date_select_assay', start_date_select_assay);
        var myLink = gu.link;
        var sp_code = record['data']['sp_code'];

        if (this.depth > 1) {
            gu.getCmp('target-routeTitlename' + record.get('sp_code')).update(this.routeTitlename);

            this.editAssyAction.enable();
            this.removeAssyAction.enable();
            this.changeMakerAction.enable();

            this.addPartActionR.enable();
            this.addPartActionO.enable();
            this.addPartActionK.enable();

        } else {
            this.editAssyAction.disable();
            this.removeAssyAction.disable();
            this.changeMakerAction.disable();

            this.addPartActionR.disable();
            this.addPartActionO.disable();
            this.addPartActionK.disable();

            return;
        }

        //제조원 store reload

        var emptyText = '';
        // 원지,원자재: R 원단,가공품:O 부자재,일반 구매품:K
        if (sp_code == 'R') {
            this.storeStockWonji.getProxy().setExtraParam('standard_flag', 'R');
            this.storeStockWonji.getProxy().setExtraParam('pj_uid_stoqty', -1);
            this.storeStockWonji.load();

            this.stockstateTab.expand();
            this.center.setActiveTab(0);
            this.stockstateTab.setActiveTab(0);

            emptyText = '원지';
        } else if (sp_code == 'O') {
            this.storeStockWondan.getProxy().setExtraParam('standard_flag', 'O');
            this.storeStockWondan.getProxy().setExtraParam('pj_uid_stoqty', -1);
            this.storeStockWondan.load();

            this.stockstateTab.expand();
            this.center.setActiveTab(1);
            this.stockstateTab.setActiveTab(1);

            emptyText = '원단';
        } else if (sp_code == 'K') {
            this.storeStockSubpart.getProxy().setExtraParam('standard_flag', 'K');
            this.storeStockSubpart.getProxy().setExtraParam('pj_uid_stoqty', -1);
            this.storeStockSubpart.load();

            this.stockstateTab.expand();
            this.center.setActiveTab(2);
            this.stockstateTab.setActiveTab(2);
            emptyText = '부자재';
        } else {
            this.stockstateTab.collapse();
        }

        //maker store relod
        this.supplierStore.removeAll();
        this.supplierStore.getProxy().setExtraParam('supplier_type', sp_code);
        this.supplierStore.load();

        //change emptyText;
        var field = gu.getCmp('makercombo');
        field.emptyText = emptyText + ' 제조원 변경';
        // field.applyEmptyText();

        var end_date_select_assay = new Date();
        console.log('>>> end_date_select_assay', end_date_select_assay);
        var elased_time_select_assy = end_date_select_assay - start_date_select_assay;
        console.log('elapsed_time_select_assay', elased_time_select_assy);

    },

    selectStockAssy: function (record) {
        console_logs('this.depth', this.depth);
        console_logs('selectAssy record', record);
        gu.getCmp('target-routeTitlename').update(this.routeTitlename);
        var myLink = gu.link;
        var sp_code = record['data']['sp_code'];

        if (this.depth == 1) {
            this.editAssyAction.disable();
            this.removeAssyAction.disable();
        } else {
            this.editAssyAction.enable();
            this.removeAssyAction.enable();

        }
        if (this.depth == 1) {

            this.addPartActionR.disable();
            this.addPartActionO.disable();
            this.addPartActionK.disable();
        } else {

            this.addPartActionR.enable();
            this.addPartActionO.enable();
            this.addPartActionK.enable();
        }


    },

    unselectAssy: function (record) {

        this.addPartActionR.disable();
        this.addPartActionO.disable();
        this.addPartActionK.disable();
        this.editAssyAction.disable();
        this.removeAssyAction.disable();

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


    pastePartActionHandler: function (uids) {

        this.grid.setLoading(true);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=addPastePartAssymap',
            params: {
                project_uid: gm.me().selectedPjUid,
                parent: gm.me().selectedChild,
                parent_uid: gm.me().selectedAssyUid,
                resetQty: 'false',
                resetPlno: 'false',
                uidList: uids
            },
            success: function (result, request) {
//                if (w) {
//                    w.close();
//                }
//                var result = result.responseText;
                //this.store.load(function() {});
                // Ext.MessageBox.alert('결과','총
                // ' + result + '건을
                // 복사하였습니다.');
                gm.me().store.load(function (records) {

                    gm.me().grid.setLoading(false);
                });
            },
            failure: extjsUtil.failureMessage
        });

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

        gm.me().createPartForm.setLoading(true);


        console_logs('setBomData id=', id);
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

                gm.me().createPartForm.setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });

    },

    setBomDataAssy: function (id, item_code, item_name) {
        gu.getCmp('target_item_code').setValue(item_code);
        gu.getCmp('target_assy_name').setValue(item_name);
        gu.getCmp('search_information_assy_add').setValue(item_name);
        gu.getCmp('target_child').setValue(id);
    },
    setBomDataImport: function (id, item_code, item_name) {

        console_logs('id', id);
        console_logs('item_code', item_code);
        console_logs('item_name', item_name);

//        gu.getCmp('target_uid').setValue(id);
//        gu.getCmp('target_item_code').setValue(item_code);
        //gu.getCmp('assy_name').setValue(item_name);
        try {
            gu.getCmp('information_assy').setValue(item_name);
        } catch (e) {
            console_logs('setBomDataImport e', e);
        }

        gm.me().partlineStore.getProxy().setExtraParam('parent', id);
        gm.me().partlineStore.getProxy().setExtraParam('ac_uid', -1);
        gm.me().partlineStore.getProxy().setExtraParam('parent_uid', -1);
        gm.me().partlineStore.getProxy().setExtraParam('orderBy', "pl_no");
        gm.me().partlineStore.getProxy().setExtraParam('ascDesc', "ASC");
        gm.me().partlineStore.load();

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


        var standard_flag = 'R';
        //                if (gItemGubunType == 'standard_flag') {
        //                    standard_flag = o['standard_flag'];
        //                } else {
        //                    standard_flag = o['sp_code'];
        //                }

        gu.getCmp('unique_id').setValue(o['unique_id_long']);
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
        gu.getCmp('unit_code').setValue('EA');
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

        gu.getCmp('information').setValue('');

    },


    Item_code_dash: function (item_code) {
        return item_code.substring(0, 5) + "-" + item_code.substring(5, 9) + "-" +
            item_code.substring(9, 12);
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
    addMtrlGrid: null,
    addPrdGrid: null,

    deleteConfirmR: function (result) {
        console_logs('deleteConfirmR', result);
        if (result == 'yes') {
            gm.me().deletePartConfirm(gm.me().grid);
        }
    },

    deleteConfirmO: function (result) {
        console_logs('deleteConfirmO', result);
        if (result == 'yes') {
            gm.me().deletePartConfirm(gm.me().gridO);
        }
    },

    deleteConfirmK: function (result) {
        console_logs('deleteConfirmK', result);
        if (result == 'yes') {
            gm.me().deletePartConfirm(gm.me().gridK);
        }
    },

    deletePartConfirm: function (g) {

        if (g == null) {
            alert('grid is null');
            return;
        }
        console_logs('deletePartConfirm g', g);
        // make uidlist
        var uidList = [];
        var selections = g.getSelectionModel().getSelection();
        if (selections) {
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                uidList.push(rec.get('unique_uid'));
            }
        } else {
            return;
        }

        if (uidList.length > 0) {

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

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                params: {
                    DELETE_CLASS: CLASS_ALIAS,
                    uids: uidList
                },
                method: 'POST',
                success: function (rec, op) {
                    // console_logs('success rec', rec);
                    // console_logs('success op', op);
                    // gm.me().redrawStore();
                    switch (gm.me().sp_code) {
                        case 'R':
                            gm.me().store.load();
                            break;
                        case 'O':
                            gm.me().storeO.load();
                            break;
                        case 'K':
                            gm.me().storeK.load();
                            break;
                    }


                },
                failure: function (rec, op) {
                    Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                    });

                }
            });

        }
        // }
    },

    srchTreeHandler: function (my_treepanel, cloudProjectTreeStore, widName, parmName, b) {

        console_logs("srchSingleHandler my_treepanel", my_treepanel);
        console_logs("srchSingleHandler cloudProjectTreeStore", cloudProjectTreeStore);
        console_logs("srchSingleHandler widName", widName);
        console_logs("srchSingleHandler parmName", parmName);
        console_logs("srchSingleHandler b", b);

        //this.assyGrid.setLoading(true);

        this.resetParam(this.cloudProjectTreeStore, this.searchField);
        var val = gu.getCmp(widName).getValue();
        console_log('val' + val);

        try {
            this.cloudProjectTreeStore.getProxy().setExtraParam(parmName, val);
            this.cloudProjectTreeStore.load({

                callback: function (records, operation, success) {
                    console_logs('======> records', records);
                    gm.me().assyGrid.setLoading(false);

                    gm.me().selectTree();
                    //gm.me().assyGrid.getSelectionModel().select(0);
                    //gm.me().assyGrid.expandAll ();
                    var end_date = new Date();
                    console.log('>>> end_date', end_date);
                    var elapsed_time = end_date - start_date;
                    console.log('>>>> elapsed_time', elapsed_time);
                }
            });
        } catch (e) {
            console_logs('catch e', e);
        }


    },

    selectProjectCombo: function (record) {

        console_logs('selectProjectCombo record', record);
        start_date = new Date();
        console.log('>>>> start_date', start_date);
        var pjuid = record.get('unique_id');
        this.ac_uid = pjuid;
        var pj_name = record.get('pj_name');
        var pj_code = record.get('pj_code');
        var pm_name = record.get('pm_name');
        var delivery_plan_str = record.get('delivery_plan_str');

        var reserved_varchara = record.get('reserved_varchara');
        var reserved_varcharb = record.get('reserved_varcharb'); //칼날Size
        var reserved_varcharc = record.get('reserved_varcharc'); //판걸이단위
        var reserved_varchard = record.get('reserved_varchard'); //제품Size
        var reserved_varchare = record.get('reserved_varchare'); //단가정보
        var reserved_varcharf = record.get('reserved_varcharf');

        gm.me().order_com_unique_id = record.get('order_com_unique');


        var description = '<u><b>담당자: ' + pm_name + ', 납품예정일:' + delivery_plan_str + '</b></u><br>';
        description = description + '칼날Size: <b>' + reserved_varcharb + '</b>, 판걸이단위: <b>' + reserved_varcharc + '</b>, 제품Size: <b>' + reserved_varchard + '</b><br>';
        description = description + record.get('description');
        if (reserved_varchare != null && reserved_varchare.length > 0) {
            description = description + ' (단가정보: <b>' + reserved_varchare + '</b>)';
        }


        this.assy_pj_code = '';
        this.selectedAssyCode = '';
        this.selectedPjCode = pj_code;
        this.selectedPjName = pj_name;
        this.selectedPjUid = pjuid;

        this.puchaseReqTitle = '[' + pj_code + '] ' + pj_name;

        gu.getCmp('target-projectcode').update(pj_code);

        gu.getCmp('projectinfo').update(description);


        this.finishAction.enable();

        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        this.store.removeAll();
        this.unselectAssy(record);


    },
    registPartFc: function (val) {
        console_logs('registPartFc val', val);
        gm.me().addNewAction(val);
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

    onShowSpcodeClick: function (sp_code, assy_uid) {
        var grid = this.grid;
        var store = gm.me().store;
        console_logs('onShowSpcodeClick sp_code', sp_code);
        console_logs('onShowSpcodeClick assy_uid', assy_uid);
        var fields = gm.me().getFields(sp_code);
        grid.reconfigure(store, fields);

        //grid.getView().refresh();
        Ext.resumeLayouts(true);
    },

    selectTreeGrid: function (rec) {
        gm.me().assyRecord = rec;
        console_logs('selectTreeGrid rec', rec);
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
            this.reserved_varchar1 = rec.get('reserved_varchar1');
            this.selectedAssyName = rec.get('assy_name');
            this.selectedPjUid = rec.get('ac_uid');
            this.selectedPjCode = rec.get('pj_code');
            this.routeTitlename = '[' + rec.get('pl_no') + '] ' + rec.get('item_name') + ' / ' + rec.get('specification');
            this.depth = rec.get('depth');
            this.selectAssy(rec);

            gm.me().sp_code = rec.get('sp_code');
            gm.me().assyChildUid = rec.get('child');
            gm.me().assyAcUid = rec.get('ac_uid');
            gm.me().assyParent = rec.get('parent');
            gm.me().unique_uid = rec.get('unique_uid');
            var parent = rec.get('unique_id_long');

            var store = null;
            switch (gm.me().sp_code) {
                case 'R':
                    store = this.store;
                    break;
                case 'O':
                    store = this.storeO;
                    break;
                case'K':
                    store = this.storeK;
                    break;
            }

            if (store == null) {// root tree 선택
                // alert('알 수 없는 경우. store is null');
            } else {
                store.getProxy().setExtraParam('parent_uid', this.selectedAssyUid);
                store.getProxy().setExtraParam('orderBy', "pl_no");
                store.getProxy().setExtraParam('ascDesc', "ASC");
                store.getProxy().setExtraParam('ac_uid', this.selectedPjUid);
                store.load(function (records) {
                });
            }


        }

    },

    selectStockGrid: function (rec) {
        console_logs('selectStockGrid rec', rec);
        if (rec == null) {
            this.createStore.load(function (records) {
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
            this.reserved_varchar1 = rec.get('reserved_varchar1');
            this.selectedAssyName = rec.get('assy_name');
            this.selectedPjUid = rec.get('ac_uid');
            this.selectedPjCode = rec.get('pj_code');
            this.routeTitlename = '[' + rec.get('pl_no') + '] ' + rec.get('item_name') + ' / ' + rec.get('specification');
            this.depth = rec.get('depth');
            this.selectStockAssy(rec);

            gm.me().assyChildUid = rec.get('child');
            gm.me().assyAcUid = rec.get('ac_uid');
            var parent = rec.get('unique_id_long');
            this.createStore.getProxy().setExtraParam('parent', this.selectedChild);
            this.createStore.getProxy().setExtraParam('parent_uid', this.selectedAssyUid);
            this.createStore.getProxy().setExtraParam('orderBy', "pl_no");
            this.createStore.getProxy().setExtraParam('ascDesc', "ASC");
            this.createStore.getProxy().setExtraParam('ac_uid', this.selectedPjUid);
            this.createStore.load(function (records) {
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
            default:
                gm.editRedord(field, rec);

        }


    },

    updateDesinComment: function (rec) {
        var unique_uid = rec.get('unique_uid');
        var req_info = rec.get('req_info');
        var reserved_varchar1 = rec.get('reserved_varchar1');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
            params: {
                id: unique_uid,
                req_info: req_info,
                reserved_varchar1: reserved_varchar1
            },
            success: function (result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },

    // Define process_request Action
    process_requestAction: Ext.create('Ext.Action', {
        itemId: 'process_requestButton',
        iconCls: 'chevron-circle-right',
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
        var selections = gm.me().gridO.getSelectionModel().getSelection();
        if (selections) {

            console_logs('selections', selections);

            var targetUid = [];
            for (var i = 0; i < selections.length; i++) {
                var unique_uid = selections[i].get('unique_uid');
                targetUid.push(unique_uid);
            }

            console_logs('targetUid', targetUid);

            gm.me().gridO.setLoading(true);
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=deleteMyCart',
                params: {
                    assymap_uids: targetUid
                },
                success: function (result, request) {

                    gm.me().gridO.setLoading(false);

                }
            });


        }
    },

    createDabPlan: function (pcr_div, arr, assy_sp_code, assy_item_name) {

        var curArr = [];
        var my_child = [];
        var assymap_uids = [];
        var bmQuans = [];
        var reserved1s = [];
        var pcr_arr = [];
        var item_name = arr[0].get('item_name');
        var description = arr[0].get('description');
        var specification = arr[0].get('specification');

        for (var i = 0; i < arr.length; i++) {
            var o = arr[i];
            my_child.push(o.get('unique_id'));
            curArr.push(o.get('currency'));
            assymap_uids.push(o.get('id'));
            bmQuans.push(o.get('bm_quan'));
            reserved1s.push(o.get('reserved1'));
            pcr_arr.push(o.get('pcr_div'));
        }
        console_logs('assymap_uids', assymap_uids);
        console_logs('my_child', my_child);
        console_logs('pcr_arr', pcr_arr);

        var title = '';
        var msg = '';
        var content = '';
        switch (pcr_div) {
            case 'RO':
                title = 'ROLL CUT';
                content = 'ROLL CUT 제작요청에 요청합니다.';
                msg = 'ROLL CUT 제작요청에 요청에 성공하였습니다.';
                break;
            case 'SH':
                title = '시트 재단';
                content = '시트 재단 제작요청에 요청합니다.';
                msg = '시트재단 제작 요청에 성공하였습니다.';
                break;
            case 'PU':
                title = '구매요청';
                content = '구매요청 요청합니다.';
                msg = '구매요청에 성공하였습니다.';
                break;
            case 'ST':
                title = '출고요청';
                content = '출고요청 요청합니다.';
                msg = '출고요청에 요청에 성공하였습니다.';
                break;
            case 'OU':
                title = '외주제작';
                content = '외주제작 요청합니다.';
                msg = '외주제작에 요청에 성공하였습니다.';
                break;
            case 'PG':
                title = '사입제작';
                content = '사입제작 요청합니다.';
                msg = '사입제닥에 요청에 성공하였습니다.';
                break;
        }
        // content = '[' + assy_item_name + '] ' + content;
        switch (vCompanyReserved4) {
            case 'DABP01KR':
                content = '[' + item_name + ' / ' + description + ' / ' + specification + '] ';
                break;
            default:
                content = '[' + item_name + ' / ' + description + ' / ' + specification + '] ' + ' 外 ' + (arr.length - 1) + '건 ' + content;
                break;
        }

        var outer_scope = this;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=createDabPlan',
            params: {
                pcr_div: pcr_div,
                type: 'BOM',
                assy_sp_code: assy_sp_code,
                child: my_child,
                pr_quan: bmQuans,
                src_currencies: curArr,
                assymap_uids: assymap_uids,
                pj_uid: gm.me().selectedPjUid,
                reserved1s: reserved1s,
                title: title,
                content: content,
                pcr_arr: pcr_arr
            },
            scope: outer_scope,
            success: function (result, request) {
                switch (assy_sp_code) {
                    case 'R':
                        gm.me().store.load();
                        break;
                    case 'O':
                        gm.me().storeO.load();
                        break;
                    case 'K':
                        gm.me().storeK.load();
                        break;
                }
                gm.me().showToast(title, msg);

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax


    },

    planConfirmActionR: Ext.create('Ext.Action', {

        itemId: 'purchaseButton',
        iconCls: 'af-play',
        text: '계획확정',
        disabled: true,
        handler: function (widget, event) {
            gm.me().planConfirm(gm.me().grid, 'R');
        }
    }),

    planConfirmActionO: Ext.create('Ext.Action', {

        itemId: 'purchaseButton',
        iconCls: 'af-play',
        text: '계획확정',
        disabled: true,
        handler: function (widget, event) {
            gm.me().planConfirm(gm.me().gridO, 'O');
        }
    }),

    planConfirmActionK: Ext.create('Ext.Action', {

        itemId: 'purchaseButton',
        iconCls: 'af-play',
        text: '계획확정',
        disabled: true,
        handler: function (widget, event) {
            gm.me().planConfirm(gm.me().gridK, 'K');
        }
    }),
    planConfirm: function (grid, type) {

        var selections = grid.getSelectionModel().getSelection();
        var rqstType = '계획확정';

        console_logs('selections', selections);
        if (selections == null || selections.length == 0) {
            Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
        }

        //var unique_uids = [];
        var catmapPurchase = [];
        var catmapOutsource = [];
        var catmapStockout = [];
        var catmapPcsRoll = [];
        var catmapPcsSheet = [];
        var catmapPrivategive = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];

            //console_logs('selected rec', rec);

            var pcr_div = rec.get('pcr_div');
            var item_type = rec.get('item_type');
            var reserved1 = rec.get('reserved1') + '';
            console_logs('pcr_div reserved1', pcr_div);
//                    console_logs('item_type reserved1', item_type);
//                    console_logs('selected reserved1', reserved1);

            switch (pcr_div) {
                case 'OU-S'://외주
                case 'OU-P'://외주
                case 'PE-S'://PE코팅
                case 'PE-P'://PE코팅
                case 'SL-S'://슬리팅
                case 'SL-P'://슬리팅
                    break;
                default:
                    if (reserved1 != null && reserved1 == 'true' && type != null && type == 'R') {//재단있음.
                        var newO = gu.copyObj(rec);
                        if (item_type == 'ROLL') {
                            catmapPcsRoll.push(newO);
                        } else {
                            catmapPcsSheet.push(newO);
                        }
                    }
                    break;
            }

            switch (pcr_div) {
                case 'PU'://구매
                    catmapPurchase.push(rec);
                    break;
                case 'ST'://재고
                    catmapStockout.push(rec);
                    break;
                case 'OU'://외주
                case 'PE'://PE코팅
                case 'SL'://슬리팅
                case 'OU-S'://외주
                case 'OU-P'://외주
                case 'PE-S'://PE코팅
                case 'PE-P'://PE코팅
                case 'SL-S'://슬리팅
                case 'SL-P'://슬리팅
                    catmapOutsource.push(rec);
                    break;
                case 'PG'://사입가공
                    catmapPrivategive.push(rec);

            }

        }//emdoffor

        Ext.MessageBox.show({
            title: '구매요청',
            msg: '계획확정 하시겠습니까?<hr>'
            + '구매요청: ' + catmapPurchase.length + '건<br>'
            + '재고사용: ' + catmapStockout.length + '건<br>'
            + '외주가공(PE코팅, 슬리팅 포함): ' + catmapOutsource.length + '건<br>'
            + '사입가공: ' + catmapPrivategive.length + '건<br>'
            + '롤컷: ' + catmapPcsRoll.length + '건<br>'
            + '시트재단: ' + catmapPcsSheet.length + '건'
            ,
            buttons: Ext.MessageBox.YESNO,
            fn: function (result) {
                console_logs('구매요청 result', result);
                if (result == 'yes') {


                    var assy_sp_code = gm.me().selected_tree_record.get('sp_code');
                    var assy_item_name = gm.me().selected_tree_record.get('item_name');

                    if (catmapPcsRoll.length > 0) {
                        gm.me().createDabPlan('RO', catmapPcsRoll, assy_sp_code, assy_item_name);
                        gu.sleep(500);
                    }
                    if (catmapPcsSheet.length > 0) {
                        gm.me().createDabPlan('SH', catmapPcsSheet, assy_sp_code, assy_item_name);
                        gu.sleep(500);
                    }
                    if (catmapPurchase.length > 0) {
                        gm.me().createDabPlan('PU', catmapPurchase, assy_sp_code, assy_item_name);
                        gu.sleep(500);
                    }
                    if (catmapStockout.length > 0) {
                        gm.me().createDabPlan('ST', catmapStockout, assy_sp_code, assy_item_name);
                        gu.sleep(500);
                    }
                    if (catmapOutsource.length > 0) {
                        gm.me().createDabPlan('OU', catmapOutsource, assy_sp_code, assy_item_name);
                        gu.sleep(500);
                    }
                    if (catmapPrivategive.length > 0) {
                        gm.me().createDabPlan('PG', catmapPrivategive, assy_sp_code, assy_item_name);
                        gu.sleep(500);
                    }

                }
            },
            icon: Ext.MessageBox.QUESTION
        });

    }// endof handler
    ,


    copiedPartCnt: 0,

    onMygridSelection: function (selections) {
        console_logs('onMygridSelection selections', selections);
        this.selectionLength = selections.length;

        var disable = false; //fPERM_DISABLING()

        if (this.selectionLength > 0) {
            if (disable == true) {
                this.process_requestAction.disable();
                this.planConfirmActionR.disable();
                this.planConfirmActionO.disable();
                this.planConfirmActionK.disable();
            } else {

                this.process_requestAction.enable();
                this.planConfirmActionR.enable();
                this.planConfirmActionO.enable();
                this.planConfirmActionK.enable();
            }
        } else {
            if (this.gGridMycartSelects.length > 1) {
                this.gridO.getView().select(this.gGridMycartSelects);
            }

            //this.collapseProperty();
            this.process_requestAction.disable();
            this.planConfirmActionR.disable();
            this.planConfirmActionO.disable();
            this.planConfirmActionK.disable();
        }

        this.copyArrayMycartGrid(selections);
    },
    onAssemblyGridSelection: function (selections) {

        if (selections != null && selections.length > 0) {

            gUtil.enable(gm.me().editAssyAction);
            var rec = selections[0];
            gm.me().selectTreeGrid(rec);

        } else {
            gm.me().selected_tree_record = null;

            gUtil.disable(gm.me().editAssyAction);

        }
    },
    onStockGridSelection: function (selections) {

        if (selections != null && selections.length > 0) {

            gUtil.enable(gm.me().editAssyAction);
            var rec = selections['assy'][0];
            gm.me().selectStockGrid(rec);

        } else {
            // gm.me().selected_tree_record = null;

            gUtil.disable(gm.me().editAssyAction);

        }
    },
    checkStockAssemblySelection: function (selections, child_uid, ac_uid, order_com_unique, srcahd_uid) {
        var check = false;
        var results = [];

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=checkStockAssy',
            async: false,
            params: {
                child_uid: child_uid,
                ac_uid: ac_uid,
                order_com_unique: order_com_unique,
                srcahd_uid: srcahd_uid
            },
            success: function (result, request) {

                var result = result.responseText;

                results.push(result);
                console_logs('resulasd', results.length);
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax

        if (results.length > 0) {
            check = true;
        } else {
            check = false;
        }
        return results;
    },
    reSelect: function () {
        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        //this.selectProjectCombo(this.selected_tree_record);
    },


    removePartActionR: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirmR,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    removePartActionO: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirmO,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    removePartActionK: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirmK,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),
    removePartActionO: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirmO,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    removePartActionK: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirmK,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    handlerAddAction: function (grid, store, rowEditing, sp_code) {

        if (gm.me().assyRecord == null) {
            Ext.MessageBox.alert('알림', '선택한 ssembly가 없습니다.');
            return;
        }

        var pRecord = gm.me().assyRecord;
        console_logs('pRecord', pRecord);

        var cnt = store.getCount();

        var d = new Date();
        var n = d.getTime();
        var pl_no = (cnt + 1) + '';
        if (pl_no.length == 1) {
            pl_no = '0' + pl_no;
        }
        // Create a model instance
        var r = null;
        switch (sp_code) {
            case 'R':
                r = Ext.create('Rfx.model.PartLine', {
                    //route_type: '--->',
                    id: n,
                    pl_no: pl_no,
                    unique_id: -1,
                    unique_uid: -1,
                    pcr_div: 'PU',
                    item_type: 'SHEET',
                    item_name: pRecord.get('item_name'),
                    comment: pRecord.get('comment'),
                    description: pRecord.get('description'),
                    specification: pRecord.get('specification'),
                    remark: pRecord.get('remark'),
                    reserved_double1: null,
                    reserved_double2: null,
                    bm_quan: pRecord.get('bm_quan'),
                    reserved1: 'true',
                    reserved2: pRecord.get('comment'),
                    reserved3: pRecord.get('remark'),
                    reserved4: pRecord.get('bm_quan'),
                    stock_qty: 0,
                    stock_qty_useful: 0,
                    isNew: 1
                });
                break;
            case 'O':
                r = Ext.create('Rfx.model.PartLine', {
                    //route_type: '--->',
                    id: n,
                    pl_no: pl_no,
                    unique_id: -1,
                    unique_uid: -1,
                    pcr_div: 'PU',
                    item_type: 'SHEET',
                    item_name: pRecord.get('item_name'),
                    comment: pRecord.get('comment'),
                    description: pRecord.get('description'),
                    specification: pRecord.get('specification'),
                    remark: pRecord.get('remark'),
                    reserved_double1: null,
                    reserved_double2: null,
                    bm_quan: pRecord.get('bm_quan'),
                    reserved1: 'false',
                    reserved2: pRecord.get('comment'),
                    reserved3: pRecord.get('remark'),
                    reserved4: pRecord.get('bm_quan'),
                    stock_qty: 0,
                    stock_qty_useful: 0,
                    isNew: 1
                });
                break;
            case 'K':
                r = Ext.create('Rfx.model.PartLine', {
                    //route_type: '--->',
                    id: n,
                    pl_no: pl_no,
                    unique_id: -1,
                    unique_uid: -1,
                    pcr_div: 'PU',
                    item_type: null,
                    item_name: pRecord.get('item_name'),
                    comment: pRecord.get('comment'),
                    description: pRecord.get('description'),
                    specification: pRecord.get('specification'),
                    remark: pRecord.get('remark'),
                    maker_name: pRecord.get('maker_name'),
                    reserved_double1: null,
                    reserved_double2: null,
                    bm_quan: pRecord.get('bm_quan'),
                    reserved1: null,
                    reserved2: null,
                    reserved3: null,
                    reserved4: null,
                    stock_qty: 0,
                    stock_qty_useful: 0,
                    isNew: 1
                });
                break;
            default:
                alert('sp_code가 알 수 없는 경우입니다. (' + sp_code + ')');
        }
        r.set('sp_code', sp_code);
        console_logs('addPartAction' + sp_code, r);
        gm.me().dblclickedRecord = r;

        try {
            store.insert(cnt, r);
            // store.sync();
            console_logs('============== inserted record', r);
            grid.getView().focusRow(r);
            gu.sleep(100);
            try {
                rowEditing.startEdit(cnt, 0);
            } catch (e1) {
                console_logs('startEdit error', e1);
            }

        } catch (e) {
            console_logs('insert error', e);
        }
    },
    addPartActionR: Ext.create('Ext.Action', {
        itemId: 'addPartActionR',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {
            console_logs('addPartActionR event', event);
            gm.me().handlerAddAction(gm.me().grid, gm.me().store, gm.me().rowEditingR, 'R');
        }
    }),

    addPartActionO: Ext.create('Ext.Action', {
        itemId: 'addPartActionR',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {
            console_logs('addPartActionR event', event);
            gm.me().handlerAddAction(gm.me().gridO, gm.me().storeO, gm.me().rowEditingO, 'O');
        }
    }),

    addPartActionK: Ext.create('Ext.Action', {
        itemId: 'addPartActionR',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {
            console_logs('addPartActionR event', event);
            gm.me().handlerAddAction(gm.me().gridK, gm.me().storeK, gm.me().rowEditingK, 'K');
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

            if (gm.me().checkClosed() == true) {
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
            var reserved_varchar1 = gm.me().selected_tree_record.get('reserved_varchar1');
            var pclass_code = gm.me().selected_tree_record.get('pclass_code');
            var lineGap = 30;
            var bHeight = 300;
            var bWidth = 400;

            var area = gu.Comma2Area(reserved_varchar1);


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
            inputItem.push(
                {
                    xtype: 'textfield',
                    name: 'assy_code',
                    fieldLabel: 'Assembly 코드',
                    allowBlank: false,
                    value: assy_code,
                    anchor: '-5',
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                });
            inputItem.push({
                xtype: 'textfield',
                name: 'assy_name',
                fieldLabel: 'Assembly 명',
                allowBlank: false,
                value: assy_name,
                anchor: '-5'
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
                value: bm_quan,
                anchor: '-5'
            });


            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('modformPanel'),
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                region: 'center',
                defaults: {
                    // anchor: '100%',
                    editable: true,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: inputItem
            });

            var winItems = [form];


            var win = Ext.create('ModalWindow', {
                title: 'Assembly 수정',
                width: bWidth,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: winItems,
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

    finishAction: Ext.create('Ext.Action', {
        itemId: 'finishAction',
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        disabled: true,
        text: '계획완료',
        handler: function (widget, event) {

            if (gm.me().selectedPjUid == null || gm.me().selectedPjUid == '' || gm.me().selectedPjUid == '-1') {
                Ext.MessageBox.alert('선택 확인', '선택한 수주 항목이 없습니다.');
                return;
            }

            Ext.MessageBox.show({
                title: '재단계획 완료',
                msg: '재단계획 완료처리 하시겠습니까? 이 작업은 취소할 수 없습니다.',
                buttons: Ext.MessageBox.YESNO,
                fn: function (result) {
                    if (result == 'yes') {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design/project.do?method=updateStartdate',
                            params: {
                                unique_id: gm.me().selectedPjUid
                            },
                            success: function (result, request) {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
                                    params: {
                                        paramName: 'CommonProjectAssy',
                                        paramValue: -1 + ';' + '-1'
                                    },

                                    success: function (result, request) {
                                        location.reload();
                                    },
                                    failure: function (result, request) {
                                        console_log('fail defaultSet');
                                    }
                                });
                            }
                        });
                    }
                },
                icon: Ext.MessageBox.QUESTION
            });


        },
        failure: extjsUtil.failureMessage
    }),

    changeMakerAction: Ext.create('Ext.Action', {
        itemId: 'changeMakerAction',
        iconCls: 'af-edit',
        disabled: true,
        text: gm.getMC('CMD_MODIFY', '수정'),
        handler: function (widget, event) {


            if (gm.me().checkClosed() == true) {
                return;
            }

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
                return;
            } else {
                var name = gm.me().selected_tree_record.data.text;
                var id = gm.me().selected_tree_record.data.id;
                var depth = gm.me().selected_tree_record.data.depth;

                if (depth < 2) {
                    Ext.MessageBox.alert('선택 확인', '최상위 Assy는 수정할 수 없습니다.');
                    return;
                } else {

                    console_logs('target id', id);
                    var unique_uid = gm.me().selected_tree_record.data.unique_uid;

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=changeMakerAssy',
                        params: {
                            assymap_uid: unique_uid
                        },
                        success: function (result, request) {
                            console_logs('result', result);
                            var jsonData = Ext.decode(result.responseText);
                            console_logs('jsonData', jsonData);
                            gm.me().reSelect();
                        }
                    });

                }
            }


        },
        failure: extjsUtil.failureMessage
    }),

    // Context Popup Menu
    assyContextMenu: Ext.create('Ext.menu.Menu', {
        items: [
            this.editAssyAction,
            this.removeAssyAction
        ]
    }),
    searchDetailStore: Ext.create('Mplm.store.MaterialDetailSearchStore', {}),

    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),

    searchAssyStore: Ext.create('Mplm.store.AssemblySearchStore', {
        myLink: 'T'

    }),

    searchStandardAssyStore: Ext.create('Mplm.store.AssemblySearchStore', {
        myLink: 'F'

    }),

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

    labelToolbarR: Ext.create('widget.toolbar', {
        cls: 'my-x-toolbar-default1',
        style: 'color:white;',
        items: [
            {
                id: gu.id('target-routeTitlename' + 'R'),
                xtype: 'component',
                style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                html: "<i>자재항목을  선택하세요.</i>",
            },
            '->'
        ]
    }),
    labelToolbarO: Ext.create('widget.toolbar', {
        cls: 'my-x-toolbar-default1',
        style: 'color:white;',
        items: [
            {
                id: gu.id('target-routeTitlename' + 'O'),
                xtype: 'component',
                style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                html: "<i>자재항목을  선택하세요.</i>",
            },
            '->'
        ]
    }),
    labelToolbarK: Ext.create('widget.toolbar', {
        cls: 'my-x-toolbar-default1',
        style: 'color:white;',
        items: [
            {
                id: gu.id('target-routeTitlename' + 'K'),
                xtype: 'component',
                style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                html: "<i>자재항목을  선택하세요.</i>",
            },
            '->'
        ]
    }),

    parentRecursive: function (o) {
        //console_logs('parentRecursive o', o);
        o.set('is_closed', false);
        var id = o.get('unique_uid');
        //console_logs('id', id);

        gm.editAjax(
            "assymap",
            "is_closed",
            "N",
            "unique_id",
            id
        );


        var parentNode = o['parentNode'];
        if (parentNode != null) {
            this.parentRecursive(parentNode);
        }

    },

    eachRecursive: function (o, checked) {
        //console_logs('eachRecursive o', o);
        o.set('is_closed', checked);

        var id = o.get('id');
        //console_logs('id', id);

        gm.editAjax(
            "assymap",
            "is_closed",
            checked ? "Y" : "N",
            "unique_id",
            id
        );

        this.timerRefresh(o.get('assy_name'), checked, o);

        //console_logs('recCount', this.recCount);

        var childNodes = o['childNodes'];
        if (childNodes != null) {
            for (var i = 0; i < childNodes.length; i++) {
                this.eachRecursive(childNodes[i], checked);
            }
        }

    },

    timerRefresh: function (assy_name, checked, o) {
        console_logs('timerRefresh', checked);
        gUtil.timer(function () {
            console_logs('gm.me().recCount', gm.me().recCount);
            //gm.me().srchTreeHandler(gm.me().assyGrid, gm.me().cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
            if (gm.me().recCount > 0) {
                console_logs('recCount', gm.me().recCount);
                gm.me().timerRefresh();
            } else {
                gm.me().togToast = true;
                gm.me().showToast('결과', '[' + assy_name + '] Assy가 ' + (checked ? '<완료>' : '<진행중>') + ' 처리 되었습니다.');

                //console_logs('o', o);
            }
        }, 1000);
    },

    checkTreeNode: function (obj, rowIndex, checked) {
        this.togToast = false;
        this.recCount = 0;
        if (obj != null) {
            var o = obj.up('grid').getStore().getAt(rowIndex);
            this.eachRecursive(o, checked);
            if (checked == false) {
                var parentNode = o['parentNode'];
                if (parentNode != null)
                    this.parentRecursive(parentNode);
            }
            //markDirty 체크
            obj.up('grid').getStore().sync();
        }

    },

    deleteAssyConfirm: function (result) {
        if (gm.me().checkClosed() == true) {
            return;
        }
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
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    },

    partlineStore: Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),


    clearSearchStore: function () {
        var store = gm.me().searchDetailStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 100);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },

    stateCodeStore: Ext.create('Rfx.store.GeneralCodeStore', {hasNull: false, parentCode: 'SRO1_CLD_STATE'}),
    redrawSearchStore: function () {

        this.clearSearchStore();

        var store = gm.me().searchDetailStore;

        var item_code = gu.getValue('search_item_code');
        var item_name = gu.getValue('search_item_name');
        var specification = gu.getValue('search_specification');
        var model_no = gu.getValue('search_model_no');

        //var field_id = fieldObj['field_id'];
        console_logs('item_code', item_code);
        console_logs('item_name', item_name);
        console_logs('specification', specification);
        console_logs('model_no', model_no);

        var bIn = false;
        if (item_code.length > 0) {
            store.getProxy().setExtraParam('item_code', item_code);
            bIn = true;
        }

        if (item_name.length > 0) {
            store.getProxy().setExtraParam('item_name', item_name);
            bIn = true;
        }

        if (specification.length > 0) {
            store.getProxy().setExtraParam('specification', specification);
            bIn = true;
        }

        if (model_no.length > 0) {
            store.getProxy().setExtraParam('model_no', model_no);
            bIn = true;
        }

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }


    },

    checkClosed: function () {
        var is_closed = false;

        try {
            is_closed = gm.me().selected_tree_record.get('is_closed');

        } catch (e) {
        }


        if (is_closed == true) {
            Ext.MessageBox.alert('알림', '이미 완료처리 되었습니다.');
        }
        return is_closed;
    },

    dblclickedRecord: null, //더블 클릭 수정레코드

    getFields: function (sp_code) {

        console_logs('getFields sp_code', sp_code);

        var fields = null;
        switch (sp_code) {
            case 'R':
                fields = this.copyWonjiField();
                break;
            case 'O':
                fields = this.copyWondanField();
                break;
            case 'K':
                fields = this.copySubpartField();
                break;
        }

        return fields;


    },
    copyWonjiField: function () {
        if (this.fields_wonji.length == 0) {
            for (var i = 0; i < this.columns.length; i++) {
                var rec = gu.copyObj(this.columns[i]); // gu.copyObj(this.columns[i]); //Object 복사해야 함.
                var dataIndex = rec['dataIndex'];
                switch (dataIndex) {
                    case 'spec_model_desc':
                    case 'item_name':
                    case 'description':
                        break;
                    default:
                        rec.id = rec.id + 'R';
                        this.fields_wonji.push(rec);
                        break;
                }
            }

            this.fields_wonji.splice(3, 0, {
                align: "left",
                dataIndex: "item_name",
                dataType: "string",
                // editor :    {},
                sortable: true,
                style: "text-align:center",
                text: "지종",
                width: 120,
                editor: new Ext.form.ComboBox({
                    displayField: 'codeName',
                    editable: true,
                    align: 'center',
                    style: 'align:center;',
                    forceSelection: true,
                    store: Ext.create('Mplm.store.PaperTypeStore'),
                    triggerAction: 'all',
                    allowBlank: false,
                    valueField: 'codeName',
                    minChars: 1,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }
                    },
                    selectOnFocus: true,
                }),

            });

            this.fields_wonji.splice(4, 0, {
                align: "left",
                dataIndex: "description",
                dataType: "string",
                editor: {},
                sortable: true,
                style: "text-align:center",
                text: "평량",
                width: 120,
                editor: {
                    selectOnFocus: true,
                    listeners: {
                        specialkey: function (f, e) {
                            if (e.getKey() == Ext.EventObject.TAB) {
                                console_logs('>>>> dddd', this);
                            }
                        }
                    }
                }
            });

            console_logs('>>>>> cacasdasd', this.fields_wonji);

        }

        return this.fields_wonji;
    },

    copyWondanField: function () {
        if (this.fields_wondan.length == 0) {
            for (var i = 0; i < this.columns.length; i++) {
                var rec = gu.copyObj(this.columns[i]); //gu.copyObj(this.columns[i]); //Object 복사해야 함.
                var dataIndex = rec['dataIndex'];
                switch (dataIndex) {
                    case 'item_type':
                    case 'spec_model_desc':
                    // case 'description':
                    case 'remark':
                    case 'comment':
                    case 'bm_quan':
                    case 'reserved2':
                    case 'reserved3':
                        break;
                    case 'reserved1':
                        // console_logs(' ?? >> ', rec);
                        // rec['hidden'] = true;
                        // rec['renderer'] = function(value, meta) {

                        //     return false;
                        // }
                        break;
                    // case 'item_name':
                    // rec['text'] = '지종';
                    // this.fields_wondan.push(rec);
                    // break;
                    default:
                        rec['id'] = rec['id'] + 'O';
                        this.fields_wondan.push(rec);
                        break;
                }
            }

            this.fields_wondan.splice(3, 0, {
                align: "left",
                dataIndex: "item_name",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "지종",
                width: 200
            });

            this.fields_wondan.splice(4, 0, {
                align: "left",
                dataIndex: "remark",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "장",
                width: 60
            });
            this.fields_wondan.splice(5, 0, {
                align: "left",
                dataIndex: "comment",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "폭",
                width: 60
            });
            this.fields_wondan.splice(6, 0, {
                align: "left",
                dataIndex: "bm_quan",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "투입수량",
                width: 60
            });
            this.fields_wondan.splice(8, 0, {
                align: "left",
                dataIndex: "reserved3",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "장",
                width: 60
            });

            this.fields_wondan.splice(9, 0, {
                align: "left",
                dataIndex: "reserved2",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "폭",
                width: 60
            });
        }
        return this.fields_wondan;
    },
    copySubpartField: function () {

        if (this.fields_sub.length == 0) {

            var pcr_divs_sub = new Ext.data.ArrayStore({
                fields: ['name', 'code'],
                data: [
                    ['구매', 'PU'], //PU
                    ['재고', 'ST']	//ST
                ]
            });

            for (var i = 0; i < this.columns.length; i++) {
                var rec = gu.copyObj(this.columns[i]); //gu.copyObj(this.columns[i]); //Object 복사해야 함.
                //console_logs('this.columns rec', rec);
                var dataIndex = rec['dataIndex'];
                switch (dataIndex) {
                    case 'statusHangul':
                    case 'pl_no':
                        rec['width'] = 60;
                        rec['id'] = rec['id'] + 'K';
                        this.fields_sub.push(rec);
                        break;
                    case 'pcr_div':
                        rec['width'] = 80;
                        rec['editor'] = new Ext.form.ComboBox({
                            displayField: 'name',
                            editable: true,
                            forceSelection: true,
                            mode: 'local',
                            store: pcr_divs_sub,
                            triggerAction: 'all',
                            valueField: 'code',
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code}">{name}</div>';
                                },
                                selectOnFocus: true,
                            }
                        });
                        rec['id'] = rec['id'] + 'K';
                        this.fields_sub.push(rec);
                        break;

                        //                   case 'item_name':
                        //                   case 'bm_quan':
                        //                   case 'spec_model_desc':
                        break;
                    default:
                        break;
                }
            }

            this.fields_sub.push({
                align: "left",
                dataIndex: "item_name",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "품명",
                width: 150
            });
            this.fields_sub.push({
                align: "left",
                dataIndex: "specification",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "규격",
                width: 200
            });
            this.fields_sub.push({
                align: "left",
                dataIndex: "description",
                dataType: "string",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:center",
                text: "설명",
                width: 150
            });
            this.fields_sub.push({
                align: "right",
                dataIndex: "bm_quan",
                dataType: "integer",
                editor: {selectOnFocus: true,},
                sortable: true,
                style: "text-align:right",
                text: "수량",
                width: 60
            });

        }


        return this.fields_sub;
    },
    fields_wonji: [],
    fields_wondan: [],
    fields_sub: []
    ,
    editBaseGrid: function (editor, e, eOpts) {
        console_logs('====> editor', editor);
        console_logs('====> e', e);
        console_logs('====> eOpts', eOpts);
        console_logs('gMain.selectedMenuId', gMain.selectedMenuId);
        var o = e.newValues;
        console_logs('o', o);
        //gm.me().store.insert(0, o);

        var send_data = {
            tableName: 'partline',
            ac_uid: gm.me().selectedPjUid,
            isNew: 0, //종전자재, 1:신규자재
            parent: gm.me().selectedChild,
            parent_uid: gm.me().selectedAssyUid,
            item_name: gm.me().selected_tree_record.get('assy_name'), //디폴트는 parent로부터 가져옴.
            specification: gm.me().selected_tree_record.get('specification'),
            sp_code: gm.me().selected_tree_record.get('sp_code'),
            description: gm.me().selected_tree_record.get('description'),
            item_name: o['item_name']
        };

        var r = e.record;

        //new record에서 현 record에 데이타 셋틴.
        for (var key in r.data) { //레코드가 있으면 엎어씀.
            if (o[key] != null) {
                console_logs('o[' + key + ']', o[key]);
                r.set(key, o[key]);
            }
        }
        console_logs('r', r);

        //현 레코드로부터 send date를 만든다.
        for (var key in r.data) {
            send_data[key] = r.get(key);
        }

        //신규자재이면 id unique_uid reset
        var isNew = send_data['isNew'];
        if (isNew == 1) {
            send_data['id'] = -1;
            send_data['unique_uid'] = -1;
        } else {

        }

        console_logs('send_data', send_data);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralObject',
            params: send_data,
            success: function (result, request) {
                var r = result.responseText;
                console_logs('editRedord result', r);
                var o = Ext.JSON.decode(r);
                console_logs('editRedord o', o);
                var unique_id = o['unique_id'];
                var unique_uid = o['unique_uid'];
                gm.me().dblclickedRecord.set('id', unique_uid);
                gm.me().dblclickedRecord.set('unique_uid', unique_uid);
                gm.me().dblclickedRecord.set('unique_id_long', unique_id);
                gm.me().dblclickedRecord.set('unique_id', unique_id + '');
                gm.me().store.load();

                console_logs('gm.me().dblclickedRecord', gm.me().dblclickedRecord);
            }
        });
    }

    , selectPartline: function (records) {

        console_logs('selectPartline selectionchange records', records);
        if (records.length) {
            var rec = records[0];
            gm.me().assymapUidbom = rec.get('unique_uid');
            gm.me().assymapPcr_div = rec.get('request_comment');
            gm.me().assymapBmQuan = rec.get('bm_quan');
            gm.me().assymapPlNo = rec.get('pl_no');
            gm.me().assyId = rec.get('hier_pos');
            gm.me().assylevel = rec.get('reserved_integer1');
            gm.me().assySp_code = rec.get('sp_code');
            gm.me().assymapParentUid = rec.get('parent_uid');

            switch (gm.me().sp_code) {
                case 'R':
                    gUtil.enable(gm.me().removePartActionR);
                    gUtil.enable(gm.me().planConfirmActionR);
                    break;
                case 'O':
                    gUtil.enable(gm.me().removePartActionO);
                    gUtil.enable(gm.me().planConfirmActionO);
                    break;
                case 'K':
                    gUtil.enable(gm.me().removePartActionK);
                    gUtil.enable(gm.me().planConfirmActionK);
                    break;
            }

        } else {
            switch (gm.me().sp_code) {
                case 'R':
                    gUtil.disable(gm.me().removePartActionR);
                    gUtil.disable(gm.me().planConfirmActionR);
                    break;
                case 'O':
                    gUtil.disable(gm.me().removePartActionO);
                    gUtil.disable(gm.me().planConfirmActionO);
                    break;
                case 'K':
                    gUtil.disable(gm.me().removePartActionK);
                    gUtil.disable(gm.me().planConfirmActionK);
                    break;
            }
        }
    }
});