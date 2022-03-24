/**
 * 일반 주문 작성
 *
 */
Ext.define('Rfx2.view.company.dsmaref.purStock.HEAVY4_CreatePoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'create-po-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가

        if(vCompanyReserved4 == 'DSMF01KR') {
                this.addSearchField({
                type: 'radio',
                field_id :'date_check',
                items: [
                    {
                        text :  '포함',
                        name : 'date_check',
                        value: 'N',
                        checked: true
                    },
                    {
                        text :  '미포함',
                        name : 'date_check',
                        value: 'Y'
                    }
                ]
            });
        }

        this.addSearchField({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "요청기간",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        if(vCompanyReserved4 == 'DSMF01KR') {
            this.addSearchField({
                type: 'radio',
                field_id :'cartmap_reserved1',
                items: [
                    {
                        text :  '전체',
                        name : 'cartmap_reserved1',
                        value: 'N',
                        checked: true
                    },
                    {
                        text :  '임시저장',
                        name : 'cartmap_reserved1',
                        value: 'Y'
                    }
                ]
            });
        }
  

        switch(vCompanyReserved4) {
            case 'DABP01KR':
                this.addSearchField('item_name_dabp');
                this.addSearchField('specification');
                break;
            case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'po-rf-cartline-heavy',
                    tableName: 's',
                    field_id: 'supplier_name',
                    fieldName: 'supplier_name',
                    params: {
                        route_type: 'P'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'po-rf-cartline-heavy',
                    tableName: 'b',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                        route_type: 'P'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'po-rf-cartline-heavy',
                    tableName: 'b',
                    field_id: 'specification',
                    fieldName: 'specification',
                    params: {
                        route_type: 'P'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'po-rf-cartline-heavy',
                    tableName: 'cr',
                    field_id: 'creator',
                    fieldName: 'creator',
                    params: {
                        route_type: 'P'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'po-rf-cartline-heavy',
                    tableName: 'b',
                    field_id: 'item_code',
                    fieldName: 'item_code',
                    params: {
                        route_type: 'P'
                    }
                });
                break;
                case 'DSMF01KR':
                    this.addSearchField('pj_name');
                    this.addSearchField('pr_no');
                    this.addSearchField('item_name');
                    this.addSearchField('specification');
                    this.addSearchField('model_no');
                    this.addSearchField('creator');
                    this.addSearchField('po_user_name');
                break;
            default:
                this.addSearchField('pr_no');
                this.addSearchField('pj_name');
                this.addSearchField('supplier_name');
                this.addSearchField('remark');
                this.addSearchField('item_name');
                this.addSearchField('specification');
                this.addSearchField('creator');
                this.addSearchField('item_code');
        }

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        switch (vCompanyReserved4) {
            case "HAEW01KR":
            case "DAEH01KR":
                this.createStoreSimple({
                    modelClass: 'Rfx.model.HEAVY4CreatePoHW',
                    pageSize: 500,
                    sorters: [{
                        property: 'parent_code',
                        direction: 'asc'
                    }],
                    byReplacer: {

                    },
                    deleteClass: ['cartmap']

                }, {
                    //groupField: 'parent_code'
                });
                break;
            case "DSMF01KR":
                this.createStoreSimple({
                    modelClass: 'Rfx.model.HEAVY4CreatePo',
                    pageSize: 500,
                    sorters: [{
                        property: 'cartmap_reserved2',
                        direction: 'asc'
                    }],
                    byReplacer: {

                    },
                    deleteClass: ['cartmap']

                }, {
                    //groupField: 'parent_code'
                });
            break;
            default:
                this.createStoreSimple({
                    modelClass: 'Rfx.model.HEAVY4CreatePo',
                    pageSize: 500,
                    sorters: [{
                        property: 'parent_code',
                        direction: 'asc'
                    }],
                    byReplacer: {

                    },
                    deleteClass: ['cartmap']

                }, {
                    //groupField: 'parent_code'
                });

                if (this.changeSupplier == false) {
                    this.setRowClass(function(record, index) {

                        // console_logs('record', record);
                        var contract_supplier = record.get('contract_supplier');
                        var supplier_name = record.get('supplier_name');
                        var item_type = record.get('item_type');

                        if (contract_supplier == supplier_name) {
                            return 'green-row';
                        } else if (item_type == 'S') {
                            return 'gray-row';
                        }
                    });
                }

                break;
        }

        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        switch(vCompanyReserved4) {
            case 'DSMF01KR':
                arr.push(this.buttonToolbar3);

                var PrdClassStore = Ext.create('Mplm.store.PrdClassStore', {parentCode:"PRD_CLASS_CODE"});

                var SrcmapStore = this.SrcmapStore;

                Ext.each(this.columns, function(columnObj, index) {
                    var dataIndex = columnObj["dataIndex"];
                    console_logs('>>dataIndex', columnObj);
                    switch(dataIndex) {
                        case 'cartmap_reserved2':
                        columnObj['renderer'] = function(value) {
                            return value;
                        }
                        break;
                        case 'item_code':
                            columnObj['renderer'] = function(value) {return '<a href="javascript:gMain.selPanel.renderMoveBom()">' + value + '</a>'};
                        break;
                        case 'static_sales_price':
                            
                            columnObj["renderer"] = function(value, meta) {
                                meta.css =  important==true ? 'custom-column-orange': 'custom-column';
                                return Ext.util.Format.number(value, '0,00.00/i');
                            };
                        break;
                         //case 'sales_amount':
                        // columnObj['style'] = 'background-color:#0271BC; text-align:center',
                        // columnObj["editor"] = {
                        //     selectOnFocus: true,
                        //     listeners: {
                        //         specialkey: function(f, e) {
                        //                 // 다음 row의 cell editing
                        //                 if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                        //                     var grid = gm.me().grid;
                        //                     var code = e.getCharCode();
                                    
                        //                     var maxRows = grid.store.data.length;
                        //                     var maxColumns = grid.columns.length;
                        //                     var rowSelected = f.column.field.container.component.context.rowIdx;
                        //                     var colSelected = f.column.field.container.component.context.colIdx;
                        //                     // gm.me().nextRowCell(e.getKey(),f);
                        //                     if(maxRows > rowSelected) {
                        //                         grid.editingPlugin.startEditByPosition({row:rowSelected+1,column:colSelected});
                        //                         grid.selModel.doSelect(grid.store.data.items[rowSelected+1]);
                        //                         grid.editingPlugin.edit();
                        //                     }
                        //                 }
                        //             }
                        //     }
                        // };
                        //columnObj["css"] = 'edit-cell';
                        //columnObj["renderer"] = function(value, meta) {
                         //   meta.css = 'custom-column';
                        //    return value;
                        //};
                        // break;
                        case 'reserved_varchar3':
                            columnObj["editor"] = {
                            xtype:'combo',
                            store:PrdClassStore,
                            displayField:'systemCode',
                            valueField:'systemCode',
                            id:'input_type',
                            listConfig:{
                                getInnerTpl: function(){
                                    return '<div data-qtip="{systemCode}">{systemCode}</div>';
                                }
                            },
                            // listeners: {
                            //     specialkey : function(fieldObj, e) {
                            //         if (e.getKey() == Ext.EventObject.ENTER) {
                            //             console_logs('=dasdasd', 'aasdasd');

                            //             var record = gm.me().grid.getSelectionModel().getSelection()[0];
                                        
                            //             var val = record.get('reserved_varchar3');
                            //             var recordIndex = gm.me().grid.store.indexOf(record);
                            //             var nextRecord = gm.me().store.getAt(recordIndex + 1);
                            //             var selModel = gm.me().grid.getSelectionModel();
                            //             selModel.select(nextRecord);
                            //             var position = gm.me().grid.getView()['eventPosition']['colIdx'];
                            //             var editor = gm.me().grid.getPlugin();
                            //             alert('nextRecord: ' + nextRecord + ' / position: ' + position);
                            //             console_logs('==nextRecord', gm.me().grid.editingPlugin);
                            //             var edit_plug = gm.me().grid.editingPlugin;
                            //             edit_plug['events']['beforeedit'] = true;
                            //             console_logs('===ccc', edit_plug['events']['beforeedit']);
                            //             // edit_plug['events']['beforeedit'] = function() {

                            //             // }
                            //             // rowEditing.startEdit(nextRecord, position);
                            //             gm.me().grid.editingPlugin.startEdit(nextRecord, position);
                            //         }
                            //     }
                            // }
                        };
                        columnObj["css"] = 'edit-cell';
                        columnObj["renderer"] = function(value, meta) {
                            meta.css = 'custom-column';
                            return value;
                        };
                        break;
                        case 'supplier_name':
                        // case 'contract_supplier':
                        case 'contract_supplier':
                        // case 'contract_supplier':
                        //         columnObj["editor"] = {
                        //             xtype:'combo',
                        //             id: gu.id('supastStore'),
                        //             name:'ctrl_supplier',
                        //             store: SrcmapStore,
                        //             displayField: 'supplier_name',
                        //             valueField: 'supplier_name',
                        //             value : 'supast_uid',
                        //             minChars:1,
                        //             enableKeyEvents: true,
                        //             editable: true, 
                        //             listConfig: {
                        //                 loadingText: '검색중...',
                        //                 emptyText: '일치하는 항목 없음.',
                        //                 getInnerTpl: function() {
                        //                     return '<div data-qtip="{supast_uid}">{supplier_name}</div>';
                        //                 }
                        //             },
                        //             listeners : {
                        //                 // keyup: function(combo, e, eOpts) {
                        //                 //     clearTimeout(gm.me().myVar);
                        //                 //     gm.me().supastSearchActivation(combo, e, eOpts);
                        //                 // },
                        //                 focus: function(a,b,c) {
                        //                     var select = gm.me().grid.getSelectionModel().getSelection()[0];
                        //                     var srcahd_uid = select.get('child');

                        //                     gm.me().SrcmapStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                        //                     gm.me().SrcmapStore.load();
                        //                 },
                        //                 change: function(combo, val, index){
                                            
                        //                     var totalData = combo.store.data.items;var selectData = val;
                        //                     var vals = [];
                        //                     var pos;

                        //                     Ext.each(totalData, function(o, index) {
                        //                     if(val == o.get('supplier_name')){
                        //                         pos = index;
                        //                     }
                        //                     //vals.push(o.get('supplier_name'));     
                        //                     });
                                           
                        //                     var price = totalData[pos].get('sales_price');

                        //                     var select = gm.me().grid.getSelectionModel().getSelection()[0];
                        //                     var cartUid = select.get('id');

                        //                     gm.editAjax("cartmap", "sales_price", price, "unique_id", cartUid);

                                            
                        //                 }
                        //                 // select: function(c, r) {
                        //                 //     var value = c.value; // supast unique id
                        //                 //     var rawValue = c.rawValue; // supast name
                        //                 //     r.set('supplier_unique_id', value);
                        //                 //     r.set('supplier_name', rawValue);
                        //                 // }
                        //             }
                        //         };
                        //         columnObj['style'] = 'background-color:#0271BC; text-align:center',
                        //         columnObj["css"] = 'edit-cell';
                        //         columnObj["renderer"] = function(value, meta) {
                        //             meta.css = 'custom-column';
                        //             return value;
                        //         };
                        //     break;
                        case 'supplier_name':
                                columnObj["editor"] = {
                                    xtype:'combo',
                                    id: gu.id('supastStore'),
                                    name:'ctrl_supplier',
                                    store: SrcmapStore,
                                    displayField: 'supplier_name',
                                    valueField: 'supplier_name',
                                    value : 'supast_uid',
                                    minChars:1,
                                    enableKeyEvents: true,
                                    editable: true, 
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{supast_uid}">{supplier_name}</div>';
                                        }
                                    },
                                    listeners : {
                                        // keyup: function(combo, e, eOpts) {
                                        //     clearTimeout(gm.me().myVar);
                                        //     gm.me().supastSearchActivation(combo, e, eOpts);
                                        // },
                                        focus: function(a,b,c) {
                                            var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                            var srcahd_uid = select.get('child');

                                            gm.me().SrcmapStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                                            gm.me().SrcmapStore.load();
                                        },
                                        change: function(combo, val, index){
                                            
                                            if(val.length > 0){
                                                var totalData = combo.store.data.items;
                                                var pos;
    
                                                Ext.each(totalData, function(o, index) {
                                                if(val == o.get('supplier_name')){
                                                    pos = index;
                                                }
                                                //vals.push(o.get('supplier_name'));     
                                                });
                                               
                                                var price = totalData[pos].get('sales_price');
                                                var supast_uid = totalData[pos].get('supast_uid');
    
                                                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                                var cartUid = select.get('id');
    
                                                gm.editAjax("cartmap", "sales_price", price, "unique_id", cartUid);
                                                gm.editAjax("cartmap", "coord_key1", supast_uid, "unique_id", cartUid);
                                            }
                                                                                        
                                        }
                                        // select: function(c, r) {
                                        //     var value = c.value; // supast unique id
                                        //     var rawValue = c.rawValue; // supast name
                                        //     r.set('supplier_unique_id', value);
                                        //     r.set('supplier_name', rawValue);
                                        // }
                                    }
                                };
                                columnObj['style'] = 'background-color:#0271BC; text-align:center',
                                columnObj["css"] = 'edit-cell';
                                columnObj["renderer"] = function(value, meta) {
                                    meta.css = 'custom-column';
                                    return value;
                                };
                            break;
                            // case 'child':
                            //     columnObj["renderer"] = function(value, meta) {
                            //         SrcmapStore.getProxy().setExtraParam('srcahd_uid', value);
                            //         SrcmapStore.load();
                            //         return value;
                            //     };
                            // break;
                    }
                });
                break;
            default:
                break;
        }

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
        });

        var option = {
            // features: [groupingFeature],
            listeners: {
                itemdblclick: this.attachFileView,
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridContextMenu(this).showAt(e.getXY());
                    return false;
                },
            }
        };

        switch(vCompanyReserved4) {
            case 'SKNH01KR':
                this.setRowClass(function(record, index) {

                // console_logs('record', record);
                var contract_supplier = record.get('contract_supplier');
                var supplier_name = record.get('supplier_name');
                var item_type = record.get('item_type');

                if (contract_supplier.length > 0 && contract_supplier == supplier_name) {
                    return 'green-row';
                } else if (item_type == 'S') {
                    return 'gray-row';
                }
            });
            break;
            default:
            break;
        }
        

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();
        
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

    //     this.grid.on('edit', function(editor, e) {
    //         console_logs('===grid', gm.me().grid.columns);
	// 	   var rec = e.record;
    //        var field = e['field'];
    //         console_logs('===rec', rec);
    //         console_logs('===field', field);

    //        var unique_id = rec.get('unique_id');
    //        var codeName = rec.get('codeName');
    //        var code_order = rec.get('code_order');
    //        console_logs('===codeName', codeName);

	// 	   Ext.Ajax.request({
    //             url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
    //             params: {
    //                 unique_id:unique_id,
    //                 type:'EDIT',
    //                 codeName:codeName,
    //                 code_order:code_order
    //             },
    //             success: function(result, request) {
	// 				var result = result.responseText;
	// 				gm.me().store.load();
    //                 // console_logs("", result);

    //             },
    //             failure: extjsUtil.failureMessage
    //         });
    //    })


        //this.editAction.setText('주문작성');
        // this.removeAction.setText('반려');

        // remove the items

        switch(vCompanyReserved4) {
            case 'SKNH01KR':
                (buttonToolbar.items).each(function(item, index, length) {
                    if (index == 1 || index == 3) {
                        buttonToolbar.items.remove(item);
                    }
                });
                break;
            default:
                (buttonToolbar.items).each(function(item, index, length) {
                    if (index == 1 || index == 2 || index == 3 || index == 5) {
                        buttonToolbar.items.remove(item);
                    }
                });
                break;
        }

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '전체',
            tooltip: '전체',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                gMain.selPanel.stockviewType = 'ALL';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function(){});
            }
        });


        this.setRawMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '원자재',
            tooltip: '원자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'RAW';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
                gMain.selPanel.store.load(function(){});
            }
        });

        this.setPaintMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: 'PAINT자재',
            tooltip: 'PAINT자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'PNT';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
                gMain.selPanel.store.load(function(){});
            }
        });

        this.setSaMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '공구',
            tooltip: '공구 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'SUB';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                gMain.selPanel.store.load(function(){});
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류' : '기타소모품',
            tooltip: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류 재고' : '기타소모품 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'MRO';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
                gMain.selPanel.store.load(function(){});
            }
        });

        //PO Type View Type
        this.setAllPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체목록',
            pressed: true,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function() {
                gm.me().createAddPoAction.disable();
                gm.me().vSELECTED_UNIQUE_ID = '';
                gm.me().poviewType = 'ALL';
                gm.me().store.getProxy().setExtraParam('standard_flag', '');
                gm.me().store.getProxy().setExtraParam('sp_code', '');
                gm.me().store.load(function() {});

            }
        });

        if (vCompanyReserved4 == 'DABP01KR') {

            this.setRawPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '원지',
                tooltip: '원지',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().createInPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().updateCartmapReqdate.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'RAW';
                    //     				gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'R');
                    gm.me().store.getProxy().setExtraParam('srch_filter', null);
                    //     				gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().suplier_type = 'R';
                    gm.me().store.load(function() {});

                }
            });
            this.setSubPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '원단',
                tooltip: '원단',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().updateCartmapReqdate.disable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'SUB';
                    //    				gm.me().store.getProxy().setExtraParam('standard_flag', 'O');
                    //    				gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'O');
                    gm.me().store.getProxy().setExtraParam('srch_filter', null);
                    gm.me().suplier_type = 'O';
                    gm.me().store.load(function() {});

                }
            });
            this.setMroPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '부자재',
                tooltip: '부자재',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().updateCartmapReqdate.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'PAPER';
                    //   				 gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                    //   				 gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'K');
                    gm.me().store.getProxy().setExtraParam('srch_filter', null);
                    gm.me().suplier_type = 'Z';
                    gm.me().store.load(function() {});


                }
            });
            this.setCatonPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '카톤',
                tooltip: '부자재',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().updateCartmapReqdate.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'CARTON';
                    //   				 gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                    //   				 gm.me().store.getProxy().setExtraParam('storeType', '');
//                    gm.me().store.getProxy().setExtraParam('sp_code', 'PRD');
                    gm.me().store.getProxy().setExtraParam('class_code', 'B');
//                    gm.me().store.getProxy().setExtraParam('outbound_flag', 'Y');
                    gm.me().store.getProxy().setExtraParam('srch_filter', 'B');
                    gm.me().suplier_type = 'C';
                    gm.me().store.load(function() {});


                }
            });
        } else {

            this.setRawPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '원자재',
                tooltip: '원자재',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().createInPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().updateCartmapReqdate.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'RAW';
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
                    gm.me().store.getProxy().setExtraParam('sp_code', '');
                    gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.load(function() {});

                }
            });
            this.setSubPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '공구류',
                tooltip: '공구류 주문',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().updateCartmapReqdate.disable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'SUB';
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                    gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'K1');
                    gm.me().store.load(function() {});

                }
            });
            this.setMroPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '기타 소모품',
                tooltip: '기타 소모품',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().updateCartmapReqdate.enable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'PAPER';
                    gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
                    gm.me().store.getProxy().setExtraParam('storeType', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', 'K3');
                    gm.me().store.load(function() {});


                }
            });

        }


        this.setAddPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '주문이력',
            tooltip: '주문 이력',
            multiSelect: false,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function() {
                gm.me().poviewType = 'ADDPO';
                gm.me().vSELECTED_UNIQUE_ID = '';
                gm.me().store.getProxy().setExtraParam('standard_flag', '');
                gm.me().store.getProxy().setExtraParam('storeType', 'Y');
                gm.me().store.load(function() {});

            }
        });

        //사내발주 Action 생성
        this.createInPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '사내 발주',
            tooltip: '사내 발주',
            disabled: true,
            handler: function() {
                gm.me().treatInPo();
            } //handler end...

        });
        //주문작성 Action 생성
        this.createPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문 작성',
            tooltip: '주문 작성',
            disabled: true,
            handler: function() {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                    check_name = selections[0].get('pj_name');
                for(var i=0; i<selections.length; i++) {
                    var rec = selections[i];
                        pj_name = rec.get('pj_name');
                        if(check_name != pj_name) {
                            Ext.Msg.alert('안내', '다른 수주가 있습니다.', function() {});
                            return;
                        }
                }

                //OR17060001
                var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                var codeLength = 4;

                if (month.length == 1) {
                    month = '0' + month;
                }

                var first = "OR" + fullYear.substring(2, 4) + month;
                if(vCompanyReserved4 == 'DSMF01KR') {
                    var day = Ext.Date.format(new Date(), 'y-m-d');
                    day = day.split('-').join('');
                    first = "OR" + day + '-';
                    codeLength = 3
                }
                console_logs('first', first);

                if(vCompanyReserved4 == 'DSMF01KR') {
                    gm.me().treatPo('');
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                        params: {
                            first: first,
                            codeLength: codeLength
                        },
                        success: function(result, request) {
                            var po_no = result.responseText;

                            gm.me().treatPo(po_no);

                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                }); // endofajax
                }
                // 마지막 수주번호 가져오기
                


            } //handler end...

        });

        this.createPoAllAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '일괄 주문 작성',
            tooltip: '일괄 주문 작성',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title:'일괄 주문 작성',
                    msg: '일괄 주문 작성하시겠습니까?'+
                            '<br/>현재 체크한 품목을 자동으로 주문 작성을 실시합니다.' +
                            '<br/>공급사를 지정하지 않은 품목은 주문이 되지 않습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {

                            var selections = gm.me().grid.getSelectionModel().getSelection();

                            var keys = [];

                            for(var i = 0; i < selections.length; i++) {

                                var coord_key1 = selections[i].get('coord_key1');
                                var isExist = false;

                                for (var j = 0; j < keys.length; j++) {
                                    if(coord_key1 == keys[j]) {
                                        isExist = true;
                                        break;
                                    }
                                }

                                if(!isExist) {
                                    keys.push(coord_key1);
                                }
                            }

                            gm.me().treatPoAll(0, keys, selections);
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip:'견적서 출력',
            disabled: true,
            
            handler: function(widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var route_type = gMain.selPanel.vSELECTED_ROUT_TYPE;
                var cartmap_uids = null;

                for(var i=0; i<selections.length; i++) {
                    var cartmap_uid = selections[i].get('unique_uid');
                    cartmap_uids = cartmap_uids == null || cartmap_uids == '' ? cartmap_uid : cartmap_uids + ',' + cartmap_uid;
                }
                console_logs('=casdqw', selections[0]);
                var po_no = selections[0].get('po_no');

            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printRf',
            		params:{
                        cartmap_uids: cartmap_uids,
            			pdfPrint : 'pdfPrint',
                        is_rotate: 'N',
                        po_no : po_no,
                        route_type:'P'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_log(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	is_rotate = '';
            	
            }
        });

        //임시저장
        this.createTempAction = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '임시저장',
            tooltip: '임시저장',
            disabled: true,
            handler: function() {

                var unique_ids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                 console_logs('===>selections', selections);
                for(var i=0; i<selections.length; i++) {
                    var rec = selections[i];
                     console_logs('===>rec', rec);
                    var unique_uid = rec.get('unique_uid');

                    unique_ids.push(unique_uid);
                }

                // 임시저장
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/request.do?method=setTemporaryStorage',
                    params: {
                        unique_ids:unique_ids
                    },
                    success: function(result, request) {
                        gm.me().store.load();

                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                }); // endofajax


            } //handler end...

        });

        //합계금액 계산 변경 Action 생성
        this.massAmountAction = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '중량계산',
            tooltip: '중량계산',
            disabled: true,
            handler: function() {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '금액 계산식을 <br/>중량<예><br/>수량<아니오><br/> 로 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var unique_ids = [];
                        for(var i=0; i<selections.length; i++) {
                            var unique_id = selections[i].get('unique_uid');
                            unique_ids.push(unique_id);
                        }

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids:unique_ids,
                                    ctr_flag:'M'
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids:unique_ids,
                                    ctr_flag:'N'
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 수량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
                
            } //handler end...

        });

        //제품분류 Action 생성
        this.prdClassification = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '제품분류',
            tooltip: '제품분류',
            disabled: false,
            handler: function() {

                var win = Ext.create('ModalWindow', {
                    title: CMD_VIEW + '::' + /*(G)*/'제품분류코드',
                    width: 560,
                    height: 700,
                    minWidth: 250,
                    minHeight: 180,
                    autoScroll: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    xtype:'container',
                    plain: true,
                    items: [
                        {
                        xtype: 'panel',
                        id: 'PRD Grid',
                        autoScroll: true,
                        autoWidth: true,
                        flex: 3,
                        padding: '5',
                        items:gm.me().prdClassForm()
                    }
                    ],
                    buttons: [{
                        text: CMD_OK,
                        handler: function() {
                            if(win) {win.close();}
                        }
                    }]
                });
	win.show();
                
            } //handler end...

        });

        //제품분류 일시에 변경 Action 생성
        this.modifyPdCategoryAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '제품분류 변경',
            tooltip: '제품분류 변경',
            disabled: true,
            handler: function() {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var cartmap_uids = [];
                var req_date = null;

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
                    items: [{
                        fieldLabel: '제품그룹',
                        xtype:'combo',
                        store: gm.me().PdCategoryTypeStore,
                        id:'pd_category',
                        name: 'pd_category',
                        anchor: '80%',
                        valueField: 'systemCode',
                        displayField: 'codeName',
                        emptyText: '선택해주세요.',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음',
                            getInnerTpl: function() {
                                return '<div data-qtip="{}">{codeName}</div>';
                            }
                        }
                    }]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '제품분류 변경',
                    width: 350,
                    height: 150,
                    plain : true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {
                            if(btn == 'no') {
                                prWin.close();
                            } else {
                                for(var i=0; i<selections.length; i++) {
                                    var cartmap_uid = selections[i].get('unique_uid');

                                    cartmap_uids.push(cartmap_uid);
                                }

                                var reserved_varchar3 = Ext.getCmp('pd_category').getValue(); // cartmap 제품분류 코드

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=updateSelectedPdCategory',
                                    params: {
                                        unique_ids: cartmap_uids,
                                        reserved_varchar3: reserved_varchar3
                                    },
                                    success: function(result, request) {
                                        gm.me().store.load();
                                        if(prWin) {
                                            prWin.close();
                                        }
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); // endofajax
                            }
                        }
                    }, {
                            text: CMD_CANCEL,
                            handler: function(btn) {
                                prWin.close();
                            }
                        }]
                });
                prWin.show();

            } //handler end...

        });

        // 선택된 항목의 요청번호에 할인항목을 추가함. (SrcAhd -> CartMap)
        this.addDisCountItem = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '할인 추가',
            tooltip: '할인 항목 추가',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '할인 추가',
                    msg: '선택하신 요청번호에 할인 항목을 추가하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                        if(btn == 'yes') {
                            var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                unique_id = select.get('unique_uid'); // cartmap_uid

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=addDisCountCartMap',
                                params: {
                                    cartmap_uid : unique_id
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '할인항목이 추가되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
            }
        });

        //납기일 변경 Action 생성
        this.modifyDeliveryAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '납기일 변경',
            tooltip: '납기일 변경',
            disabled: true,
            handler: function() {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var cartmap_uids = [];
                var req_date = null;

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
                    items: [{
                        xtype: 'datefield',
                        id: 'request_date',
	                	name: 'request_date',
		            	fieldLabel: toolbar_pj_req_date,
		            	format: 'Y-m-d',
				    	submitFormat: 'Y-m-d',// 'Y/m/d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y/m/d H:i:s'
		            	// value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
	            		anchor: '100%'
                    }]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '납기일 변경',
                    width: 350,
                    height: 150,
                    plain : true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {
                            if(btn == 'no') {
                                prWin.close();
                            } else {
                                for(var i=0; i<selections.length; i++) {
                                    var cartmap_uid = selections[i].get('unique_uid');

                                    cartmap_uids.push(cartmap_uid);
                                }

                                req_date = Ext.getCmp('request_date').getValue();
                                req_date = Ext.Date.format(req_date, 'Y-m-d');

                                Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateSelectedReqDate',
                                params: {
                                    unique_ids: cartmap_uids,
                                    req_date: req_date
                                },
                                success: function(result, request) {
                                    gm.me().store.load();
                                    if(prWin) {
                                        prWin.close();
                                    }
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            }); // endofajax
                            }
                        }
                    }, {
                            text: CMD_CANCEL,
                            handler: function(btn) {
                                prWin.close();
                            }
                        }]
                });
                prWin.show();

            } //handler end...

        });

        //단가일괄 변경
        this.modifySalesPriceAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '단가 일괄변경',
            tooltip: '단가 일괄변경',
            disabled: true,
            handler: function() {

                var selections = gm.me().grid.getSelectionModel().getSelection();

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('salesPriceForm'),
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
                    items: [{
                        xtype: 'numberfield',
                        id: 'sales_prices',
	                	name: 'sales_prices',
                        fieldLabel: '단가 지정',
                        allowBlank:false,
	            		anchor: '100%'
                    }]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '단가 일괄변경',
                    width: 350,
                    height: 150,
                    plain : true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {
                            if(btn == 'no') {
                                prWin.close();
                            } else {
                                if(form.isValid()) {
                                    var val = form.getValues(false);
                                    var sales_price = val['sales_prices'];

                                    for(var i=0; i<selections.length; i++) {
                                        var select = selections[i];
                                        var unique_id = select.get('unique_uid');
                                        sales_price = sales_price.replace(',', '');
                                        gm.editAjax('cartmap', 'sales_price', sales_price, 'unique_id', unique_id,  {type:''});
                                    }
                                    gm.me().store.load(function() {
                                        if(prWin) {
                                            prWin.close();
                                        }
                                    });
                                }
                            }
                        }
                    }, {
                            text: CMD_CANCEL,
                            handler: function(btn) {
                                prWin.close();
                            }
                        }]
                });
                prWin.show();

            } //handler end...

        });

        this.cartDEAction = Ext.create('Ext.Action',{
            iconCls: 'af-remove',
            text: '반려',
            disabled: true,
            handler: function(widget, event) {
                var rec = gm.me().grid.getSelectionModel().getSelection();

                var cartmap_uids = [];

                for(var i = 0; i < rec.length; i++) {
                    cartmap_uids.push(rec[i].get('unique_uid'));
                }

                // var rtg_flag = null;
                // if(vCompanyReserved4 == 'DSMF01KR') {
                //     rtg_flag = 'Y';
                // }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/prch.do?method=orderRemove',
                    params:{
                        cartmap_uids:cartmap_uids,
                        status:'DE',
                        // rtg_flag:rtg_flag
                    },
                    success : function(result, request) {
                        gm.me().store.load();
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        //견적요청 Action 생성
        this.createRfAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '견적 요청',
            tooltip: '견적 요청',
            disabled: true,
            handler: function() {

                //OR17060001
                var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                if (month.length == 1) {
                    month = '0' + month;
                }

                var first = "FQ" + fullYear.substring(2, 4) + month;
                console_logs('first', first);

                // 마지막 수주번호 가져오기
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                    params: {
                        first: first,
                        codeLength: 4
                    },
                    success: function(result, request) {
                        var rf_no = result.responseText;

                        gm.me().treatRf(rf_no);

                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                }); // endofajax


            } //handler end...

        });

        //계약 갱신/
        this.updateCartmapContract = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '계약 갱신',
            tooltip: '계약 갱신',
            disabled: true,
            handler: function() {
                gm.me().treatCartmapContract();

            } //handler end...

        });

        //계약 갱신/
        this.updateCartmapReqdate = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '납기일 변경',
            tooltip: '납기일자 변경',
            disabled: true,
            handler: function() {
                gm.me().treatCartmapReqdate();

            } //handler end...

        });

        //추가 주문작성 Action 생성
        this.createAddPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '복사 하기',
            tooltip: '복사 하기',
            disabled: true,
            handler: function() {

                var sp_code = gm.me().vSELECTED_SP_CODE;
                switch (sp_code) {
                    case 'R':
                        gm.me().purCopyAction();
                        break;
                    case 'O':
                        gm.me().purCopyAction();
                        break;
                    case 'K':
                        gm.me().purCopyAction();
                        break;
                    default:

                }

            } //handler end...

        });
        // buttonToolbar.insert(3, this.createInPoAction);
        // buttonToolbar.insert(5, this.createRfAction);
        // buttonToolbar.insert(6, this.prdClassification);
        // buttonToolbar.insert(9, this.printPDFAction);
        // buttonToolbar.insert(12, this.modifyPdCategoryAction);
        
        buttonToolbar.insert(2, this.cartDEAction);

        // buttonToolbar.insert(4, this.massAmountAction);
        buttonToolbar.insert(3, this.createTempAction);
        buttonToolbar.insert(4, this.modifyDeliveryAction);
        // buttonToolbar.insert(7, this.modifySalesPriceAction);
        buttonToolbar.insert(5, this.AttachFileViewAction);
        buttonToolbar.insert(6, this.addDisCountItem);

        buttonToolbar.insert(12, this.createPoAction);
        buttonToolbar.insert(13, this.createPoAllAction);
        

        //결재사용인 경우 결재 경로 store 생성
        if(this.useRouting==true) {

            this.rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});

        }

        this.callParent(arguments);
		this.loadStoreAlways = true;
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            console_logs('>>selections', selections);

            if(vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'DSMF01KR') {
                var total_price_sum = 0;
                var total_qty = 0;


                for(var i = 0; i < selections.length; i++) {
                    var t_rec = selections[i];
                    if(vCompanyReserved4 == 'DSMF01KR') {
                        var sales_amount = t_rec.get('sales_amount');
                        try {
                            sales_amount = sales_amount.replace(/,/gi,'');
                        } catch (error) {
                            
                        }
                        sales_amount = parseFloat(sales_amount);
                        total_price_sum += sales_amount;
                    } else {
                        total_price_sum += t_rec.get('total_price');
                    }
                    total_qty += t_rec.get('quan');
                }

                this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
            }

            if (selections.length) {

                var rec = selections[0];
                gm.me().rec = rec;
                console_logs('rec 데이터', rec);
                this.checkEqualPjNames(rec);
                var standard_flag = rec.get('standard_flag');
                standard_flag = gUtil.stripHighlight(standard_flag); //하이라이트 삭제

                console_logs('그리드온 데이터', rec);
                gm.me().request_date = rec.get('req_date'); // 납기일
                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
                gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
                gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
                gm.me().vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
                gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
                gm.me().vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
                gm.me().vSELECTED_coord_key3 = rec.get('coord_key3'); // pj_uid
                gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
                gm.me().vSELECTED_coord_key1 = rec.get('coord_key1'); // 공급사
                gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
                gm.me().vSELECTED_item_name = rec.get('item_name'); // 품명
                gm.me().vSELECTED_item_code = rec.get('item_code'); // 품번
                gm.me().vSELECTED_specification = rec.get('specification'); // 규격
                //gm.me().vSELECTED_description = rec.get('description');   // 평량
                //gm.me().vSELECTED_remark = rec.get('remark');    // 장
                gm.me().vSELECTED_pj_name = rec.get('pj_name');
                gm.me().vSELECTED_req_date = rec.get('delivery_plan');
                gm.me().vSELECTED_pr_quan = rec.get('pr_quan');
                gm.me().vSELECTED_QUAN = rec.get('quan');
                gm.me().vSELECTED_PRICE = rec.get('sales_price');
                gm.me().vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');
                gm.me().vSELECTED_SRCAHD_UID = rec.get('child');

                
                console_logs("gu.getCmp('supastStore')", gu.getCmp('supastStore'));
                //gu.getCmp('supastStore').store.getProxy().setExtraParam('srcahd_uid', gm.me().vSELECTED_SRCAHD_UID);
                //gu.getCmp('supastStore').store.load();
                // gm.me().SrcmapStore.getProxy().setExtraParam('srcahd_uid', gm.me().vSELECTED_SRCAHD_UID);
                // gm.me().SrcmapStore.load();
                //combo.expand();

                var pj_name = gm.me().vSELECTED_pj_name

                console_logs('유니크아이디', gm.me().vSELECTED_UNIQUE_ID);
                this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);

                //this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);
                /*for(var i=0; i<selections.length; i++){
                	   var rec1 = selections[i];
                	 var uids = rec1.get('id');
                	this.cartmap_uids.push(uids);
                	console_logs('rec1', rec1);
                   }*/
                console_logs('선택된 uid', this.cartmap_uids);
                console_logs('pj_name++++++', pj_name);
                if (pj_name == undefined || pj_name == "" || pj_name == null) {
                    gm.me().createInPoAction.disable();
                } else {
                    gm.me().createInPoAction.enable();


                }

                if (gm.me().poviewType == 'ADDPO') {

                    gm.me().createAddPoAction.enable();
                    gm.me().createPoAction.disable();
                    gm.me().createPoAllAction.disable();
                    gm.me().createTempAction.disable();
                    gm.me().printPDFAction.disable();
                    // gm.me().createRfAction.disable();
                    gm.me().modifyDeliveryAction.disable();
                    gm.me().massAmountAction.disable();
                    gm.me().cartDEAction.disable();
                    gm.me().AttachFileViewAction.disable();
                    gm.me().modifyPdCategoryAction.disable();
                    gm.me().addDisCountItem.disable();
                    // gm.me().createPoSupAction.disable();
                    gm.me().createInPoAction.disable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().updateCartmapReqdate.disable();

                } else {
                    gm.me().createPoAction.enable();
                    gm.me().createPoAllAction.enable();
                    gm.me().createTempAction.enable();
                    gm.me().printPDFAction.enable();
                    // gm.me().createRfAction.enable();
                    gm.me().cartDEAction.enable();
                    gm.me().AttachFileViewAction.enable();
                    gm.me().modifyPdCategoryAction.enable();
                    gm.me().addDisCountItem.enable();
                    gm.me().modifySalesPriceAction.enable();
                    gm.me().modifyDeliveryAction.enable();
                    gm.me().massAmountAction.enable();
                    // gm.me().createPoSupAction.enable();
                    gm.me().createInPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().updateCartmapReqdate.enable();
                }

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PJ_UID = -1;

                if (gm.me().poviewType == 'ADDPO') {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().createPoAllAction.enable();
                    gm.me().createTempAction.enable();
                    gm.me().printPDFAction.enable();
                    // gm.me().createRfAction.enable();
                    gm.me().cartDEAction.enable();
                    gm.me().AttachFileViewAction.enable();
                    gm.me().modifyPdCategoryAction.enable();
                    gm.me().addDisCountItem.enable();
                    gm.me().modifyDeliveryAction.enable();
                    gm.me().massAmountAction.enable();
                    // gm.me().createPoSupAction.enable();
                    gm.me().createInPoAction.enable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().updateCartmapReqdate.disable();
                } else {
                    gm.me().createPoAction.disable();
                    gm.me().createPoAllAction.disable();
                    gm.me().createTempAction.disable();
                    gm.me().printPDFAction.disable();
                    // gm.me().createRfAction.disable();
                    gm.me().cartDEAction.disable();
                    gm.me().AttachFileViewAction.disable();
                    gm.me().modifyPdCategoryAction.disable();
                    gm.me().addDisCountItem.disable();
                    gm.me().modifySalesPriceAction.disable();
                    gm.me().modifyDeliveryAction.disable();
                    gm.me().massAmountAction.disable();
                    // gm.me().createPoSupAction.disable();
                    gm.me().createInPoAction.disable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().updateCartmapReqdate.disable();
                }

                //this.store.removeAll();
                this.cartmap_uids = [];
                this.currencies = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var currencies = rec1.get('currency');
                    this.cartmap_uids.push(uids);
                    this.currencies.push(currencies);
                }

                console_logs('this.currencies>>>', currencies);
                //	console_logs('언체크', this.cartmap_uids);
            }

        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        if(vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'DSMF01KR') {
            gMain.pageSize = 500;
        }

        this.storeLoad(function(rec){
            // console_logs("this.storeLoad   ", rec);

            // console_logs("gu.getCmp('supastStore')", gu.getCmp('supastStore'));
            //     //gu.getCmp('supastStore').store.getProxy().setExtraParam('srcahd_uid', gm.me().vSELECTED_SRCAHD_UID);
            //     //gu.getCmp('supastStore').store.load();
            //     SrcmapStore.getProxy().setExtraParam('srcahd_uid', rec);
            //     SrcmapStore.load();
            //     //combo.expand();
        });

    //     this.grid.on('edit', function(editor, e) {
	// 	   var rec = e.record;
	// 	   var field = e['field'];

    //        var unique_id = rec.get('unique_uid');
    //        var value = e.value;

	// 	   Ext.Ajax.request({
    //             url: CONTEXT_PATH + '/purchase/request.do?method=editCreatePo',
    //             params: {
	// 				unique_uid:unique_id,
    //                 reserved_varchar3:value
    //             },
    //             success: function(result, request) {
	// 				var result = result.responseText;
	// 				gm.me().store.load();
    //                 // console_logs("", result);

    //             },
    //             failure: extjsUtil.failureMessage
    //         });
	//    })

        /*this.store.load(function(records) {
            console_logs('디폴트 데이터', records);

        });*/
    },
    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],

    purCopyAction: function() {
        var uniqueId = gm.me().vSELECTED_PJ_UID;

        if (uniqueId.length < 0) {
            alert('선택된 데이터가 없습니다.');
        } else {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
                params: {
                    cartmapUids: this.cartmap_uids
                },

                success: function(result, request) {
                    gm.me().store.load();
                    Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

                }, //endofsuccess
                failure: extjsUtil.failureMessage
            }); //endofajax
        } // end of if uniqueid
    },


    //사내발주 폼
    treatPaperAddInPoRoll: function() {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var cartmapUids = [];
        var selections = gm.me().grid.getSelectionModel().getSelection();

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var unique_id = rec.get('unique_id');
            var child = rec.get('child');
            var item_name = rec.get('item_name');
            var pj_name = rec.get('pj_name');
            var stock_qty_useful = rec.get('stock_qty_useful');
            var quan = rec.get('quan');
            var sales_price = rec.get('sales_price');
            cartmapUids.push(rec.get('unique_uid'));
            //	        		total = total+total_price;
            arrExist.push(item_name);

            console_logs('arrTotalPrice----------------', arrTotalPrice);

            console_logs('arrExist----------------', arrExist);
            console_logs('arrCurrency----------------', arrCurrency);
        }

        var reserved_varcharb = null;

        if(vCompanyReserved4 == 'DSMF01KR') {
            reserved_varcharb = selections[0].get('rtgast_varcharb');
        }


        //		    }
        var orderBy = "";

        switch(vCompanyReserved4) {
            case "DSMF01KR":
                orderBy = "광림마린테크";
                break;
            case 'SKNH01KR':
                orderBy = '스카나코리아';
                break;
            default:
                orderBy = "사내";
                break;
        }

        switch(vCompanyReserved4) {
            case 'SKNH01KR':
            case 'DSMF01KR':
                var formItems = [{
                    xtype: 'fieldset',
                    title: '사내발주',
                    collapsible: false,
                    width: '100%',
                    style: 'padding:10px',
                    defaults: {
                        width: '100%',
                        layout: {
                            type: 'hbox'
                        }
                    },
                    items: [
                        {
                            fieldLabel: '프로젝트',
                            name:'pj_name',
                            xtype: 'textfield',
                            value: selections[0].get('pj_name'),
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            readOnly: true
                        },
                        {
                            fieldLabel: '요약',
                            xtype: 'textfield',
                            name: 'item_abst',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            readOnly: true
                        },{
                            fieldLabel: '주문처',
                            xtype: 'textfield',
                            value: orderBy,
                            readOnly: true
                        },
                        {
                            fieldLabel: '납품장소',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar1',
                            value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                        },
                        {
                            fieldLabel: '비고',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar2'
                        },{
                            fieldLabel: '청구서명',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varcharb',
                            hidden: vCompanyReserved4 == 'DSMF01KR' ? false : true,
                            value: reserved_varcharb
                        },
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: cartmapUids
                        }), new Ext.form.Hidden({
                            name: 'coord_key3',
                            value: selections[0].get('coord_key3')
                        }), new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: selections[0].get('ac_uid')
                        }), new Ext.form.Hidden({
                            name: 'req_date',
                            value: selections[0].get('req_date')
                        })
                    ]
                }];
                form = Ext.create('Ext.form.Panel', {
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
                    items: formItems
                });
                switch(vCompanyReserved4) {
                    case 'DSMF01KR':
                        myHeight = 400;
                        myWidth = 600;
                    break;
                    default:
                        myHeight = 330;
                        myWidth = 600;
                    break;
                }
                
                break;
            default:
                form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: true,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    defaults: {
                        layout: 'form',
                        xtype: 'container',
                        defaultType: 'textfield',
                        style: 'width: 50%'
                    },
                    items: [{
                        xtype: 'fieldset',
                        title: '사내발주',
                        width: 400,
                        height: 400,
                        margins: '0 20 0 0',
                        collapsible: true,
                        anchor: '100%',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {
                                    top: 0,
                                    right: 100,
                                    bottom: 0,
                                    left: 10
                                }
                            }
                        },
                        items: [{
                            fieldLabel: '주문처',
                            xtype: 'textfield',
                            anchor: '100%',
                            /*id: 'stcok_pur_supplier_info',
                             name: 'stcok_pur_supplier_info',*/
                            id: 'in_supplier',
                            name: 'in_supplier',
                            value: orderBy,//'스카나코리아',
                            //	            		emptyText: '스카나코리아',
                            allowBlank: false,
                            typeAhead: false,
                            editable: false,
                        },
                            {
                                fieldLabel: '프로젝트',
                                name: 'pj_name',
                                fieldLabel: '프로젝트',
                                anchor: '-5',
                                //readOnly : true,
                                //fieldStyle : 'background-color: #ddd; background-image: none;',
                                allowBlank: true,
                                editable: false,
                                value: pj_name
                            },

                            {
                                fieldLabel: '납품장소',
                                xtype: 'textfield',
                                rows: 4,
                                anchor: '100%',
                                id: 'reserved_varchar1',
                                name: 'reserved_varchar1',
                                value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                            },

                            {
                                fieldLabel: '비고',
                                xtype: 'textarea',
                                rows: 4,
                                anchor: '100%',
                                id: 'reserved_varchar2',
                                name: 'reserved_varchar2',

                            },
                            {
                                fieldLabel: '품명',
                                xtype: 'textfield',
                                id: 'item_name',
                                name: 'item_name',
                                value: arrExist,
                                //                        	arrExist[0] + ' 포함 ' + arrExist.length + '건',
                                readOnly: true

                            },
                            {
                                fieldLabel: '가용재고',
                                xtype: 'textfield',
                                id: 'stock_qty_useful',
                                name: 'stock_qty_useful',
                                value: stock_qty_useful,
                                readOnly: true

                            },
                            {
                                fieldLabel: '주문수량',
                                xtype: 'textfield',
                                id: 'quan',
                                name: 'quan',
                                value: quan,
                                fieldStyle: 'background-color:#FBF8E8; background-image: none;',
                                editable: true

                            }
                        ]
                    }]
                });
                myHeight = 500;
                myWidth = 420;
                break;
        }

        prwin = this.Inprwinopen(form);
    },

    treatCartmapContract: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {

            var cartmapUids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                cartmapUids.push(rec.get('id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=updateCartmapContract',
                params: {
                    unique_ids: cartmapUids
                },
                success: function(result, request) {

                    var result = result.responseText;
                    console_logs("success", result);
                    gm.me().store.load(function() {});

                },
                failure: extjsUtil.failureMessage
            });
        }

    },

    treatCartmapReqdate: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {

            var cartmapUids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                cartmapUids.push(rec.get('id'));
            }

            var o = gu.getCmp('req_date');

            var req_date =  o.getValue();

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=updateReqsate',
                params: {
                	unique_uids: cartmapUids,
                    req_date: req_date
                },
                success: function(result, request) {

                    var result = result.responseText;
                    console_logs("success", result);
                    gm.me().store.load(function() {});

                },
                failure: extjsUtil.failureMessage
            });
        }

    },

    treatRf: function(rf_no) {

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;


        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
            return;
        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var notDefinedSup = false;

            var price_is_zero = 0;
            var qty_is_zero = 0;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var coord_key1 = rec.get('coord_key1');
                if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
                    notDefinedSup = true;
                }
                pjArr.push(rec.get('pj_code'));
                supArr.push(coord_key1);
                cartmapUids.push(rec.get('id'));

                var quan = rec.get('quan');
                var static_sales_price = rec.get('static_sales_price');
                if(quan<0.0000001) {
                	qty_is_zero++;
                }
                if(static_sales_price<0.0000001) {
                	price_is_zero++;
                }

            }

            var reserved_number2 = selections[0].get('reserved_number2');

            //중복제거
            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            console_logs('pjArr', pjArr);
            console_logs('supArr', supArr);
            console_logs('cartmapUids', cartmapUids);


            if (pjArr.length > 1 && gm.me().canDupProject == false) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function() {});
            } else if (supArr.length > 1 && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function() {});
            } else if (notDefinedSup == true && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function() {});
            } else {
                var next = gUtil.getNextday(0);

                var total = 0;
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var total_price = rec.get('total_price');
                    total = total + total_price;

                }

                var supplierStore = Ext.create('Mplm.store.SupastStore', {
                    supplierType: gm.me().suplier_type
                });

                var this_date = Ext.Date.add (new Date(),Ext.Date.DAY,14);

                this_date = Ext.Date.format(this_date, 'Y-m-d');

                var formItems = [{
                    xtype: 'fieldset',
                    title: '견적 내역',
                    collapsible: false,
                    width: '100%',
                    style: 'padding:10px',
                    defaults: {
                        width: '100%',
                        layout: {
                            type: 'hbox'
                        }
                    },
                    items: [{
                        fieldLabel: '프로젝트',
                        name:'pj_name',
                        xtype: 'textfield',
                        value: selections[0].get('pj_name'),
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        readOnly: true
                    },
                        {
                            fieldLabel: '합계금액',
                            name:'total_price',
                            xtype: 'textfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('cart_currency'),
                            readOnly: true
                        },
                        {
                            fieldLabel: '요약',
                            xtype: 'textfield',
                            name: 'item_abst',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            readOnly: true
                        },{
                            fieldLabel: '견적번호',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'rf_no',
                            value: rf_no
                        },
                        // {
                        //     fieldLabel: '요청사항',
                        //     xtype: 'textarea',
                        //     rows: 4,
                        //     anchor: '100%',
                        //     name: 'reserved_varchar2'
                        // },
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: cartmapUids
                        }), new Ext.form.Hidden({
                            name: 'coord_key3',
                            value: selections[0].get('coord_key3')
                        }), new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: selections[0].get('ac_uid')
                        }), new Ext.form.Hidden({
                            name: 'req_date',
                            value: selections[0].get('req_date')  == null ? this_date : selections[0].get('req_date'),
                            // value: Ext.Date.format(selections[0].get('req_date'), 'Y-m-d') //selections[0].get('req_date')
                        }), new Ext.form.Hidden({
                            name: 'sales_price',
                            value: total
                        }), new Ext.form.Hidden({
                            name: 'status', //견적 요청시에 상태변경
                            value: 'FQ'
                        })
                    ]
                }];


                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanelRf'),
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
                var myHeight = 480;
                var myWidth = 600;

                var items = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '견적 작성',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);
                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontractRf',
                                        params: val,
                                        success: function(val, action) {
                                            prWin.close();
                                            gm.me().store.load(function() {});
                                        },
                                        failure: function(val, action) {

                                            prWin.close();
                                            gm.me().store.load(function() {});

                                        }
                                    });

                                } // end of formvalid
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function(btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show(undefined, function(){
                    var combo = gu.getCmp('target_supplier');
                    console_logs('combo', combo);
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    if(selections==null || selections.length==0) {
                        return;
                    }
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if(combo!=null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function(records) {
                            console_logs('combo.store.load records', records);

                            if(records!=null) {
                                  for (var i=0; i<records.length; i++){
                                    console_logs('obj', records[i]);

                                         var obj = records[i];
                                         try {
                                              if(obj.get(combo.valueField)==supplier_uid ) {
                                                  combo.select(obj);
                                              }
                                         } catch(e){}
                                  }
                            }//endofif

                          });


                    }//endof if(combo!=null) {
                });
            }

        }

    },

    treatPo: function(po_no) {

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;


        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
            return;
        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var notDefinedSup = false;

            var price_is_zero = 0;
            var qty_is_zero = 0;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var coord_key1 = rec.get('coord_key1');
                if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
                    notDefinedSup = true;
                }
                pjArr.push(rec.get('pj_code'));
                supArr.push(coord_key1);
                cartmapUids.push(rec.get('id'));

                var quan = rec.get('quan');
                var static_sales_price = rec.get('static_sales_price');
                if(quan<0.0000001) {
                	qty_is_zero++;
                }
                if(static_sales_price<0.0000001) {
                	price_is_zero++;
                }

            }

            var reserved_number2 = selections[0].get('reserved_number2');

            //중복제거
            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            //console_logs('pjArr', pjArr);
            //console_logs('supArr', supArr);
            //console_logs('cartmapUids', cartmapUids);

            switch(vCompanyReserved4) {
                case 'DABP01KR':  // DABP는 단가 0원 진행 => 말일 결산
                case 'DSMF01KR':
                    if(qty_is_zero>0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero +'건 있습니다.', function() {});
                        return;
                    }
                break;
                default:
                    if(qty_is_zero>0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero +'건 있습니다.', function() {});
                        return;
                    } else if(price_is_zero>0) {
                        Ext.Msg.alert('알림', '주문단가 0인 항목이 ' + price_is_zero +'건 있습니다.', function() {});
                        return;
                    }
                break;
            }

            // if(qty_is_zero>0) {
            // 	Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero +'건 있습니다.', function() {});
            // 	return;
            // } else if(price_is_zero>0) {
            // 	Ext.Msg.alert('알림', '주문단가 0인 항목이 ' + price_is_zero +'건 있습니다.', function() {});
            // 	return;
            // }

            if(vCompanyReserved4 == 'DSMF01KR') {
                pjArr = 1;
            }
            if (pjArr.length > 1 && gm.me().canDupProject == false) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function() {});
            } else if (supArr.length > 1 && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function() {});
            } else if (notDefinedSup == true && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function() {});
            } else {
                var next = gUtil.getNextday(0);

                var total = 0;
                for (var i = 0; i < selections.length; i++) {
                    var total_price = 0;
                    var rec = selections[i];
                    var sales_price = rec.get('static_sales_price');
                    var po_qty = rec.get('quan');
                    total_price = sales_price * po_qty;
                    total = total + total_price;
                }
                console_logs('>>>>Total value', Ext.util.Format.number(total, '0,00/i'));

                var cart_currency = selections[0].get('cart_currency');
                if(cart_currency==null||cart_currency.length<1) cart_currency = 'KRW';

                var supplierStore = Ext.create('Mplm.store.SupastStore', {
                    supplierType: gm.me().suplier_type
                });

                var this_date = Ext.Date.add (new Date(),Ext.Date.DAY,14);

                this_date = Ext.Date.format(this_date, 'Y-m-d');

                var reserved_varcharb = selections[0].get('rtgast_varcharb');

                gm.me().comcstStore.getProxy().setExtraParam('orderBy', 'sort_seq');
                    var formItems = [{
                        xtype: 'fieldset',
                        title: '주문 내역',
                        collapsible: false,
                        width: '100%',
                        style: 'padding:10px',
                        defaults: {
                            width: '100%',
                            labelWidth: 130,
                            layout: {
                                type: 'hbox'
                            }
                        },
                        items: [
                            {
                                fieldLabel: '프로젝트',
                                name:'pj_name',
                                xtype: 'textfield',
                                value: selections[0].get('pj_name'),
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                readOnly: true
                            },
                            {
                                fieldLabel: '합계금액',
                                id: gu.id('total_price'),
                                name:'total_price',
                                xtype: 'textfield',
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                value: Ext.util.Format.number(total, '0,00/i') + ' ' + cart_currency,
                                readOnly: true
                            },
                            // {
                            //     fieldLabel: 'NEGO금액',
                            //     id: gu.id('nego_price'),
                            //     name:'nego_price',
                            //     xtype: 'numberfield',
                            //     value: 0,
                            //     listeners: {
                            //         'change': function () {
                            //             var final_price = Ext.util.Format.number(total - Ext.getCmp(gu.id('nego_price')).getValue(), '0,00/i')
                            //                 + ' ' + selections[0].get('cart_currency');
                            //             Ext.getCmp(gu.id('final_price')).setValue(final_price);
                            //         }
                            //     }
                            // },
                            new Ext.form.Hidden({
                                name: 'po_user_uid',
                                value: vCUR_USER_UID
                            }),
                            {
                                fieldLabel: '구매담당자',
                                xtype: 'textfield',
                                id: 'po_user_name',
                                name: 'po_user_name',
                                readOnly:true,
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                value: vCUR_USER_NAME
                            },
                            // {
                            //     fieldLabel: '다음 구매시 할인 반영',
                            //     name:'discount_yn',
                            //     xtype: 'checkbox',
                            //     value: 0
                            // },
                            {
                                fieldLabel: '최종발주금액',
                                id: gu.id('final_price'),
                                name:'final_price',
                                xtype: 'textfield',
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                value: Ext.util.Format.number(total, '0,00/i') + ' ' + cart_currency,
                                readOnly: true
                            },
                            // {
                            //     fieldLabel: '요약',
                            //     xtype: 'textfield',
                            //     name: 'item_abst',
                            //     fieldStyle: 'background-color: #ddd; background-image: none;',
                            //     // value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            //     value: reserved_varcharb,
                            //     readOnly: true
                            // },
                            {
                                fieldLabel: '주문처',
                                xtype: 'combo',
                                id: gu.id('target_supplier'),
                                anchor: '100%',
                                name: 'coord_key1',
                                store: supplierStore,
                                displayField: 'supplier_name',
                                valueField: 'unique_id',
                                emptyText: '선택',
                                allowBlank: false,
                                sortInfo: {
                                    field: 'create_date',
                                    direction: 'DESC'
                                },
                                pageSize: 200,
                                triggerAction: 'all',
                                typeAhead: false,
                                readOnly : true,
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                // fieldStyle: (this.changeSupplier) ?
                                //     'background-color: #fff; background-image: none;':
                                //     'background-color: #ddd; background-image: none;'
                                // ,
                                //hideLabel: true,
                                minChars: 2,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                                    }
                                },
                                listeners: {
                                    select: function(combo, record) {
                                        //    			            	        	   var reccode = record.get('area_code');
                                        coord_key1 = record.get('unique_id');
                                        //    			            	        	   Ext.getCmp('maker_code').setValue(reccode);
                                    }
                                }
                            },{
                                fieldLabel: '주문번호',
                                xtype: 'textfield',
                                rows: 4,
                                anchor: '100%',
                                name: 'po_no',
                                id: 'po_no',
                                hidden: true
                            },
                            // {
                            //     fieldLabel: '사업장',
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'wa_code',
                            //     // value: 'DSMF01KR',
                            //     store: gm.me().comcstStore,
                            //     displayField: 'division_name',
                            //     valueField: 'wa_code',
                            //     emptyText: '선택',
                            //     allowBlank: false,
                            //     typeAhead: false,
                            //     minChars: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function() {
                            //             return '<div data-qtip="{wa_code}">{division_name}</div>';
                            //         }
                            //     },
                            //     listeners: {
                            //         select: function(combo, record) {},
                            //         beforeload: function(a,b) {
                            //             console_logs('=>>>>a',a);
                            //             console_logs('=>>>>b',b);
                            //         }
                            //     }
                            // },
                            // {
                            //     fieldLabel: '납품장소',
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'delivery_place',
                            //     // value: 'DSMF01KR',
                            //     store: gm.me().DeliveryPlaceStore,
                            //     displayField: 'code_name_kr',
                            //     valueField: 'code_name_kr',
                            //     emptyText: '선택',
                            //     allowBlank: false,
                            //     typeAhead: false,
                            //     minChars: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function() {
                            //             return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            //         }
                            //     },
                            //     listeners: {
                            //         select: function(combo, record) {},
                            //         beforeload: function(a,b) {
                            //             console_logs('=>>>>a',a);
                            //             console_logs('=>>>>b',b);
                            //         }
                            //     }
                            // },
                            {
                                fieldLabel: '청구서명',
                                xtype: 'textarea',
                                rows: 4,
                                anchor: '100%',
                                name: 'reserved_varcharb',
                                hidden: vCompanyReserved4 == 'DSMF01KR' ? false : true,
                                value: reserved_varcharb
                            },
                            {
                                fieldLabel: '요청사항',
                                xtype: 'textarea',
                                rows: 4,
                                anchor: '100%',
                                name: 'reserved_varchar2'
                            },
                            {
                                fieldLabel: '결제 조건',
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'pay_condition',
                                store: gm.me().payConditionStore,
                                displayField: 'codeName',
                                valueField: 'codeName',
                                emptyText: '선택',
                                allowBlank: true,
                                typeAhead: false,
                                value: '정기결제',
                                minChars: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function(combo, record) {}
                                }
                            },
                            // {
                            //     fieldLabel: '결재 추가사항',
                            //     xtype: 'textarea',
                            //     rows: 4,
                            //     anchor: '100%',
                            //     name: 'reserved_varchar6'
                            // },
                            {
                                fieldLabel: '검사조건',
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'reserved_varchar7',
                                store: gm.me().CheckConditionStore,
                                displayField: 'codeName',
                                valueField: 'codeName',
                                emptyText: '선택',
                                allowBlank: true,
                                typeAhead: false,
                                value: 'Q.M',
                                hidden: vCompanyReserved4 == 'DSMF01KR' ? false : true,
                                minChars: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function(combo, record) {}
                                }
                            },
                            {
                                fieldLabel: '인도조건',
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'reserved_varchar8',
                                store: gm.me().DeliveryConditionStore,
                                displayField: 'codeName',
                                valueField: 'codeName',
                                emptyText: '선택',
                                allowBlank: true,
                                typeAhead: false,
                                value: '당사도착도',
                                hidden: vCompanyReserved4 == 'DSMF01KR' ? false : true,
                                minChars: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function(combo, record) {}
                                }
                            },
                            new Ext.form.Hidden({
                                name: 'unique_uids',
                                value: cartmapUids
                            }), new Ext.form.Hidden({
                                name: 'coord_key3',
                                value: selections[0].get('coord_key3')
                            }), new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: selections[0].get('ac_uid')
                            }), new Ext.form.Hidden({
                                name: 'req_date',
                                value: selections[0].get('req_date')  == null ? this_date : selections[0].get('req_date'),
                                // value: Ext.Date.format(selections[0].get('req_date'), 'Y-m-d') //selections[0].get('req_date')
                            }), new Ext.form.Hidden({
                                name: 'sales_price',
                                value: total
                            }), new Ext.form.Hidden({
                                name: 'reserved_number2', //사업부
                                value: reserved_number2
                            }), new Ext.form.Hidden({
                                name: 'check_status',
                                value: 'Y'
                            })
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
                var myHeight = (this.useRouting==true) ? 750: 650;
                // if(vCompanyReserved4 == 'DSMF01KR') {
                //     myHeight = 900;
                // }
                var myWidth = 600;

                var items = [form];
                if(this.useRouting==true) {

                    this.rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId: 'removeRtgapp',
                        glyph: 'xf00d@FontAwesome',
                        text: CMD_DELETE,
                        disabled: true,
                        handler: function(widget, event) {
                            Ext.MessageBox.show({
                                title:delete_msg_title,
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
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/up.png',
                            tooltip: 'Up',
                            handler: function(agridV, rowIndex, colIndex) {
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = -15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {
                                        gm.me().rtgapp_store.load(function() {});
                                     }
                                   });

                                }


                        },'-',
                        {
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/down.png',
                            tooltip: 'Down',
                            handler: function(agridV, rowIndex, colIndex) {

                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = 15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {
                                         gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                            }

                        }]
                    };

                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

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
                        columns : [
                            { dataIndex : 'seq_no', text : '순서', width:70,  sortable : false	}
                            ,{ dataIndex : 'user_id', text : '아이디',  sortable : false	}
                            ,{ dataIndex : 'user_name', text : '이름', flex : 1,  sortable : false	}
                            //,{ dataIndex : 'emp_no', text : '사번',  sortable : false	}
                            //,{ dataIndex : 'company_code', text : '회사 코드',  sortable : false	}
                            ,{ dataIndex : 'dept_name', text : '부서 명', width:90	,  sortable : false}
                           // ,{ dataIndex : 'dept_code', text : '부서 코드',  sortable : false	}
                            //,{ dataIndex : 'app_type', text : 'app_type',  sortable : false	}
                            ,{ dataIndex : 'gubun', text : '구분', width:50	,  sortable : false}
                            // ,{ dataIndex : 'unique_id', text : 'unique_id',  sortable : false	}
                            //,{ dataIndex : 'create_date', text : '생성일자',  sortable : false	}
                            ,updown
                        ],
                        border: false,
                        multiSelect: true,
                        frame: false ,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default2',
                            items: [
                               {
                                    xtype:'label',
                                    labelWidth: 20,
                                    text: '결재 권한자 추가'//,
                                    //style: 'color:white;'

                            },{
                                id :'user_name',
                                name : 'user_name',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: userStore,
                                labelSeparator: ':',
                                emptyText:   dbm1_name_input,
                                displayField:   'user_name',
                                valueField:   'unique_id',
                                sortInfo: { field: 'user_name', direction: 'ASC' },
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 2,
                                width: 200,
                                listConfig:{
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function() {
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
                                             params:{
                                                 useruid : unique_id,
                                                 userid : user_id
                                                 ,gubun    : 'D'
                                             },
                                             success : function(result, request) {
                                                 var result = result.responseText;
                                                console_log('result:' + result);
                                                if(result == 'false'){
                                                    Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                }else{
                                                    gm.me().rtgapp_store.load(function() {});
                                                }
                                             },
                                             failure: extjsUtil.failureMessage
                                         });
                                    }// endofselect
                                }
                            },
                            '->',removeRtgapp

                            ]// endofitems
                        }] // endofdockeditems

                    }); // endof Ext.create('Ext.grid.Panel',

                    this.agrid.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
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
                    title: '주문 작성',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
                    buttons: [{
                        text: CMD_OK,
                        id:'prBtn',
                        handler: function(btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    
                                    //결재사용인 경우 결재 경로 확인
                                    if(gm.me().useRouting==true) {

                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if(items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }

                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for(var i=0; i<items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] =  ahid_userlist;
                                        val['hid_userlist_role'] =  ahid_userlist_role;
                                    }
                                    console_logs('val', val);
                                    switch(vCompanyReserved4) {
                                        case 'DSMF01KR':
                                        Ext.getCmp('prBtn').setDisabled(true);
                                        gm.me().grid.setLoading(true);
                                        var fullYear = gUtil.getFullYear() + '';
                                        var month = gUtil.getMonth() + '';
                                        var codeLength = 4;

                                        if (month.length == 1) {
                                            month = '0' + month;
                                        }

                                        var first = "OR" + fullYear.substring(2, 4) + month;
                                        var day = Ext.Date.format(new Date(), 'y-m-d');
                                            day = day.split('-').join('');
                                            first = "OR" + day + '-';
                                            codeLength = 3
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                                            params: {
                                                first: first,
                                                codeLength: codeLength
                                            },
                                            success: function(result, request) {
                                                var po_no = result.responseText;

                                                Ext.getCmp('po_no').setValue(po_no);
                                                // gm.me().showToast('발주번호', po_no);
                                                // Ext.toast({
                                                //     title: '발주번호',
                                                //     html: po_no,
                                                //     autoCloseDelay: 6000,
                                                //     closable: true,
                                                //     align: 't',
                                                //     slideInDuration: 400,
                                                //     minWidth: 400
                                                // });
                                                Ext.Msg.alert('발주번호', po_no);
                                                form.submit({
                                                    url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontract',
                                                    params: val,
                                                    success: function(val, action) {
                                                        prWin.close();
                                                        gm.me().store.load(function() {
                                                            gm.me().grid.setLoading(false);
                                                            
                                                        });
                                                        
                                                    },
                                                    failure: function(val, action) {

                                                        prWin.close();
                                                        gm.me().store.load(function() {
                                                            gm.me().grid.getSelectionModel().deselectAll();
                                                            gm.me().grid.setLoading(false);
                                                        });

                                                    }
                                                });

                                            }, // endofsuccess
                                            failure: extjsUtil.failureMessage
                                    }); // endofajax
                                        break;
                                        default:
                                        form.submit({
                                            url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontract',
                                            params: val,
                                            success: function(val, action) {
                                                prWin.close();
                                                gm.me().store.load(function() {});
                                            },
                                            failure: function(val, action) {

                                                prWin.close();
                                                gm.me().store.load(function() {});

                                            }
                                        });
                                        break;
                                    }
                                    

                                } // end of formvalid
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function(btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show(undefined, function(){
                    var combo = gu.getCmp('target_supplier');
                    console_logs('combo', combo);
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    if(selections==null || selections.length==0) {
                        return;
                    }
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if(combo!=null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function(records) {
                            //console_logs('combo.store.load records', records);

                            if(records!=null) {
                                  for (var i=0; i<records.length; i++){
                                    //console_logs('obj', records[i]);

                                         var obj = records[i];
                                         try {
                                              if(obj.get(combo.valueField)==supplier_uid ) {
                                                  combo.select(obj);
                                              }
                                         } catch(e){}
                                  }
                            }//endofif

                          });


                    }//endof if(combo!=null) {
                });
            }

        }

    },
    treatInPo: function() {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gm.me().request_date;
        var pj_name = gm.me().vSELECTED_pj_name;
        var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;

        var selections = gm.me().grid.getSelectionModel().getSelection();

        var isDifferent = false;


        if(selections.length > 1) {
            for (var i = 0; i < selections.length - 1; i++) {
                if(selections[i].get('ac_uid') != selections[i+1].get('ac_uid')) {
                    isDifferent = true;
                    break;
                }
            }
        }

        var form = null;

        switch(vCompanyReserved4) {
            case 'DSMF01KR':
            if (uniqueId == undefined || uniqueId < 0) {
                    Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                } else {
                    if (isDifferent) {
                        Ext.Msg.alert('알림', '같은 프로젝트를 선택해주세요.', function() {});
                    } else {
                        this.treatPaperAddInPoRoll();
                    }
                }
            break;
            default:
                if (uniqueId == undefined || uniqueId < 0) {
                    Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                } else {
                    if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                        Ext.Msg.alert("알림", "가용재고가 없습니다. 확인해주세요.");
                    } else if (isDifferent) {
                        Ext.Msg.alert('알림', '같은 프로젝트를 선택해주세요.', function() {});
                    } else {
                        this.treatPaperAddInPoRoll();
                    }
                }
            break;
        }
        

    },

    

    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'quan':
            case 'static_sales_price':
            case 'req_date':
            case 'cart_currency':
            case 'cartmap_comment1':
            case 'mass':
            case 'reserved_varchar3':
            case 'sales_amount':
                this.updateDesinComment(rec, field);
                break;
            // case 'supplier_name':
            //     var tableName = 'cartmap';
            //     var value = rec.get('supplier_name');
            //     var unique_id = rec.get('unique_uid');
            //     gm.editAjax(tableName, 'coord_key1', value, 'unique_id', unique_id, {type: ''});
            //     gm.me().store.load();
            //     break;
        }
    },
    updateDesinComment: function(rec, field) {
        console_logs('rec>>>', rec);
        var child = rec.get('child');
        
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = Ext.Date.format(rec.get('req_date'), 'Y-m-d');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        var comment1 = rec.get('cartmap_comment1');
        var mass = rec.get('mass');
        var reserved_varchar3 = rec.get('reserved_varchar3');
        var sales_amount = rec.get('sales_amount');
        // var unit_code = rec.get('unit_code');
        var ac_uid = rec.get('ac_uid');

        if(vCompanyReserved4 != 'DSMF01KR')  {
            if(static_sales_price != null && static_sales_price < 0) {
                static_sales_price = 0;
            }
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
                quan: quan,
                child: child,
                static_sales_price: static_sales_price,
                cart_currency: cart_currency,
                req_date: req_date,
                unique_id: unique_id,
                comment1: comment1,
                mass:mass,
                reserved_varchar3:reserved_varchar3,
                reserved_double1:sales_amount,
                // unit_code:unit_code,
                field:field,
                // ac_uid:ac_uid
            },
            success: function(result, request) {
                var result = result.responseText;

                var sales_price = rec.get('static_sales_price');
                var quan = rec.get('quan');
                var unit_mass = rec.get('unit_mass');
                
                switch(vCompanyReserved4) {
                    case 'DSMF01KR':
                        var u_code = '';
                        if(rec.get('unit_code') != null && rec.get('unit_code').length > 0) {
                            u_code = rec.get('unit_code').toUpperCase();
                        }
                    if(field != null && (field == 'sales_price' || field == 'quan' || field == 'static_sales_price' || field == 'mass')) {
                        if(u_code == 'KG' && field == 'mass') {
                            rec.set('sales_amount', Math.floor(sales_price*mass));
                            rec.set('mass', mass);
                        } else if(u_code == 'KG' && (field == 'sales_price' || field == 'static_sales_price' )) {
                            rec.set('sales_amount', Math.floor(sales_price*mass));
                            rec.set('mass', mass);
                        } else {
                            rec.set('sales_amount', Math.floor(sales_price*quan));
                            rec.set('mass', unit_mass*quan);
                        }
                        
                    } 
                    // else if(field == 'mass') {
                    //     rec.set('sales_amount', sales_price*mass);
                    // }
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var total_price_sum = 0;
                    var total_qty = 0;
                    for(var i=0; i<selections.length; i++) {
                        var ctr_flag = selections[i].get('ctr_flag');
                        var sales_amount = selections[i].get('sales_amount');
                        try {
                            sales_amount = sales_amount.replace(",", "");
                        } catch (error) {
                            
                        }
                        
                        sales_amount = parseFloat(sales_amount);
                        
                        total_price_sum += sales_amount;
                        var qty = selections[i].get('quan');
                        total_qty += qty;
                    }
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
                    break;
                    default:
                        rec.set('sales_amount', sales_price*quan);
                        rec.set('mass', unit_mass*quan);
                    break;
                }
                

                // gm.me().store.load();
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },


    calcAge: function(quan, sales_price) {
        return quan * sales_price;


    },
    getPrice: function(total_price) {
        console_logs('total_price++++++++', total_price);
        var uniqueId = gm.me().vSELECTED_PJ_UID;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
            params: {
                cartmapUids: this.cartmap_uids,
                total_price: total_price
            },

            success: function(result, request) {
                gm.me().store.load();
                //				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

            }, //endofsuccess
            failure: extjsUtil.failureMessage
        }); //endofajax
    },

    getTableName: function(field_name) {
        //		console_logs('getTableName field_name', field_name);
        var fields = this.getFields();
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
            //			console_logs('getTableName o', o);
            if (field_name == o['name']) {
                return o['tableName'];
            }
        }
        return null;
    },

    checkEqualPjNames: function(rec) {
        console_logs('rec+++++++++++++in check' + rec);
    },
    // 사내발주 submit
    Inprwinopen: function(form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사내 발주',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    var msg = '사내 발주하시겠습니까?';
                    var myTitle = '주문 작성 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var po_user_uid = gm.me().vSELECTED_po_user_uid;
                                var srcahdArr = [];
                                var cartmapArr = [];
                                var nameArr = [];
                                var priceArr = [];
                                var curArr = [];
                                var quanArr = [];
                                var coordArr = [];
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var ac_uid = selections[0].get('ac_uid');
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];

                                    var uid = rec.get('id');
                                    var srcahd_uid = rec.get('unique_id');
                                    var coord_key3 = rec.get('coord_key3');
                                    var currency = rec.get('cart_currency');
                                    var item_name = rec.get('item_name');
                                    var static_sales_price = rec.get('static_sales_price');
                                    var request_info = rec.get('request_info');
                                    var quan = rec.get('quan');
                                    quanArr.push(quan);
                                    cartmapArr.push(uid);
                                    srcahdArr.push(srcahd_uid);
                                    curArr.push(currency);
                                    priceArr.push(static_sales_price);
                                    nameArr.push(item_name);
                                    coordArr.push(coord_key3);

                                }
                                var pj_name = rec.get('pj_name');
                                var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    prWin.setLoading(true);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGo',
                                        params: {
                                            sancType: 'YES',
                                            //reserved_varchar2: reserved_varchar2,
                                            //reserved_varchar1: reserved_varchar1,
                                            item_name: item_name,
                                            cartmaparr: cartmapArr,
                                            srcahdarr: srcahdArr,
                                            quans: quanArr,
                                            currencies: curArr,
                                            names: nameArr,
                                            coord_key3s: coordArr,
                                            sales_prices: priceArr,
                                            pj_name: pj_name,
                                            mp_status: 'GR',
                                            ac_uid: ac_uid
                                        },
                                        success: function(val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function() {});
                                            gm.me().store.load(function() {});
                                            prWin.setLoading(false);
                                            //this.store.load();
                                            //gm.me().store.load();
                                        },
                                        failure: function(val, action) {

                                            prWin.close();

                                        }
                                    })
                                } // end of formvalid
                            } // btnIf of end
                        } //fn function(btn)

                    }); //show
                } //btn handler
            }, {
                text: CMD_CANCEL,
                handler: function() {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    rtgapp_store: null,
    //결재조건
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {
        hasNull: false
    }),
    CheckConditionStore: Ext.create('Mplm.store.CheckConditionStore', {
        hasNull: false
    }),
    DeliveryConditionStore: Ext.create('Mplm.store.DeliveryConditionStore', {
        hasNull: false
    }),
    comcstStore: Ext.create('Mplm.store.ComCstStore', {
        hasNull: false
    }),

    deleteRtgappConfirm: function (result){
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if(result=='yes') {

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');

                    if(user_id==vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function() {});
                        return;
                    }
                }

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp',
                            params: {
                                unique_id: unique_id
                            },
                            success: function(result, request) {
                                gm.me().agrid.store.load();
                            }, // endofsuccess
                            failure: extjsUtil.failureMessage
                        }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },

    attachFileView: function() {
        var fieldPohistory = [
            { name: 'account_code', type: "string" },
            { name: 'account_name', type: "string" },
            { name: 'po_no', type: "string" },
            { name: 'po_date', type: "string" },
            { name: 'seller_code', type: "string" },
            { name: 'seller_name', type: "string" },
            { name: 'sales_price', type: "string" },
            { name: 'pr_qty', type: "string" }
        ];



        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if(selections) {
            var coord_key3 = selections[0].get('coord_key3');

            if(coord_key3 != null && coord_key3 > -1) {
                gm.me().attachedFileStore.getProxy().setExtraParam('group_code', coord_key3);
                gm.me().attachedFileStore.load(function(records) {

                    console_logs('attachedFileStore records', records);
                    if(records!=null) {
                        var o = gu.getCmp('file_quan');
                        if (o != null) {
                            o.update( '총수량 : ' + records.length);
                        }
                    }
                });
            }
            

            var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );

            var fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: gm.me().attachedFileStore,
            collapsible: true,
            multiSelect: true,
            selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                       {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : 'UID',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'id'
                },
            	{
                    text     : '파일명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    width     : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '날짜',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        Ext.define('XpoAstHistory', {
		    		   	 extend: 'Ext.data.Model',
		    		   	 fields: /*(G)*/fieldPohistory,
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

            poHistoryStore.getProxy().setExtraParam('uid_srcahd', selections[0].get('child'));
            poHistoryStore.load();
        var selhistoryGrid =   Ext.create("Ext.selection.CheckboxModel", {} );
        var historyGrid = Ext.create('Ext.grid.Panel', {
            title: '구매이력',
            store: poHistoryStore,
            collapsible: true,
            multiSelect: true,
            selModel: selhistoryGrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                // items: [

                //     ]
                }

            ],
            columns: [
            	{
                    text     : '프로젝트코드',
                    sortable : true,
                    width     : 120,
                    dataIndex: 'account_code'
                },
                {
                    text     : '프로젝트명',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'account_name',
                    flex:1
                },
                // {
                //     text     : 'Assembly',
                //     width     : 160,
                //     sortable : true,
                //     dataIndex: 'create_date'
                // },
                {
                    text     : '발주번호',
                    width     : 130,
                    sortable : true,
                    dataIndex: 'po_no'
                },
                {
                    text     : '주문일자',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'po_date'
                },
                {
                    text     : '공급사명',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'seller_name'
                },
                {
                    text     : '주문단가',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'sales_price'
                },
                {
                    text     : '주문수량',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'pr_qty'
                }
            ]
        });

            var prWin =	Ext.create('Ext.Window', {
                modal : true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: [
                    fileGrid,
                    historyGrid
                ],
                buttons: [
                    {text: CMD_OK,
                        //scope:this,
                        handler:function(){
                            if(prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    renderMoveBom: function() {

        var rec = this.grid.getSelectionModel().getSelection()[0];

        if(rec != null) {

            var wa_name  = rec.get('wa_name');
            var pj_name  = rec.get('pj_name');
            var pj_code  = rec.get('pj_code');
            var pj_uid  = rec.get('ac_uid');
            var parent_uid  = rec.get('parent_uid');
            var child = rec.get('coord_key3');

            if(pj_uid == null || pj_uid < 0) {
                Ext.Msg.alert('안내', '프로젝트가 없습니다.', function() {});
                return;
            }   

            return gm.me().renderBom(wa_name, pj_name, pj_code, pj_uid, parent_uid, child);
        }


			// Ext.Ajax.request({
			// 		url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
			// 		params:{
			// 			paramName : 'CommonProjectAssy',
			// 			paramValue : pjuid + ';' + '-1'
			// 		},

			// 		success : function(result, request) {
			// 			console_log('success defaultSet');
			// 			// lfn_gotoMenu('DBM7_PLM', 'designPlan', 'BOM Tree', '/rfx/view/designPlan/DesignBomTreeView.js', 0);
			// 			//lfn_gotoMenu('DBM7', 'designPlan', 'BOM Tree', '/rfx/view/designPlan/DesignBomTreeView.js', 3, 'design');

			// 		    var url = CONTEXT_PATH + '/index/main.do#design-plan:DBM7_PLM';
			//     		location.href=url;


			// 		},
			// 		failure: function(result, request){
			// 			console_log('fail defaultSet');
			// 		}
			// 	});
	},

    attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

    // 공급사 유형 필터
    suplier_type: (vCompanyReserved4 == 'DSMF01KR') ? null : 'R',

    //프로젝트 중복 혀용 여부
    canDupProject: (vCompanyReserved4 == 'DABP01KR') ? true : false,

    //주문시 공급사 지정
    changeSupplier:  (vCompanyReserved4 == 'SKNH01KR') ? false : true,

    //결재 기능 사용
    useRouting:  false,

    buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    prdClassForm: function() {

         this.removePRDAction= Ext.create('Ext.Action',{
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            disabled: true,

            handler: function(widget, event) {
                var selections = prd_grid.getSelectionModel().getSelection()[0];
                var unique_id = selections.get('unique_id');

                Ext.MessageBox.show({
                        title:'확인',
                        msg: '삭제 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn:  function(result) {
                            if(result=='yes') {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
                                    params: {
                                        unique_id:unique_id,
                                        type:'REMOVE'
                                    },
                                    success: function(result, request) {
                                        var result = result.responseText;
                                        gm.me().prd_class_store.load();
                                        // console_logs("", result);

                                    },
                                    failure: extjsUtil.failureMessage
                                });
                            }
                        }
                });
                
            }
    });

        var PRD_COLUMN = [];

        PRD_COLUMN.push(
            {
				header:'No.', xtype: 'rownumberer',	
                width : 100,  align: 'left',resizable:true,sortable : true,
			},
            {
				header:'대분류', dataIndex: 'codeName',	
                width : 200,  align: 'left',resizable:true,sortable : true,
                css: 'edit-cell', renderer: function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                },
                editor: {},
                filter: {
                    type: 'list',
                    // store: this.prd_class_store
                },
            },
            {
				header:'순서', dataIndex: 'code_order',	
                width : 100,  align: 'left',resizable:true,sortable : true,
                css: 'edit-cell', renderer: function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                },
                editor: {},
                filter: {
                    type: 'list',
                    // store: this.prd_class_store
                },
			},{
				header:'비고', dataIndex: '',	
				width : 100,  align: 'left',resizable:true,sortable : true,
			}
        );
            
        this.prd_class_store.load(function(){});

        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        prd_grid = Ext.create('Ext.grid.Panel', {
            id: 'pr-div2',
            store: this.prd_class_store,
            multiSelect: true,
            stateId: 'stateGridsub',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoScroll : true,
            autoHeight: true,
            filterable: true,
            height: 650,  // (getCenterPanelHeight()/5) * 4
    //        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/PRD_COLUMN,
            plugins:[cellEditing,{
                    ptype: 'gridfilters'
            }],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            dockedItems: [
                {
                    dock : 'top',
                    xtype : 'toolbar',
                    items : [
                        this.addPRDAction, this.removePRDAction
                    ]
                }
            ]
        });

        prd_grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    // gm.me().addPRDAction.enable();
                    // gm.me().editPRDAction.enable();
                    gm.me().removePRDAction.enable();
                } else {
                    // gm.me().addPRDAction.disable();
                    // gm.me().editPRDAction.disable();
                    gm.me().removePRDAction.disable();
                }
            }
        });

        prd_grid.on('edit', function(editor, e) {
            console_logs('===prd_grid', 'pppp');
		   var rec = e.record;
           var field = e['field'];
            console_logs('===rec', rec);
            console_logs('===field', field);

           var unique_id = rec.get('unique_id');
           var codeName = rec.get('codeName');
           var code_order = rec.get('code_order');
           console_logs('===codeName', codeName);

		   Ext.Ajax.request({
                url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
                params: {
                    unique_id:unique_id,
                    type:'EDIT',
                    codeName:codeName,
                    code_order:code_order
                },
                success: function(result, request) {
					var result = result.responseText;
					gm.me().store.load();
                    // console_logs("", result);

                },
                failure: extjsUtil.failureMessage
            });
       })

        return prd_grid;

    },

    prd_class_store: Ext.create('Mplm.store.PrdClassStore', {}),

    addPRDAction: Ext.create('Ext.Action',{
            iconCls: 'af-plus-circle',
            text: '신규생성',
            disabled: false,

            handler: function(widget, event) {

                var form = Ext.create('Ext.form.Panel', {
                    id: 'formBack',
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    width: 400,
                    height: 250,
                    defaults: {
                        // anchor: '100%',
                        editable:true,
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'codeName',
                            id: 'codeName',
                            allowBlank: false,
                            fieldLabel:'대분류'
                        }, {
                            xtype: 'textfield',
                            name: 'code_order',
                            id: 'code_order',
                            allowBlank: true,
                            fieldLabel:'순서'
                        }
                    ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '신규 생성',
                    width: 400,
                    height: 250,
                    minWidth: 250,
                    minHeight: 180,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(){
                            var form = Ext.getCmp('formBack');
                            var codeName = form.items.items[0].getValue();
                            var code_order = form.items.items[1].getValue();
                            console_logs('==codeName', codeName);
                            console_logs('==code_order', code_order);
                            // var val = form.items.items[0].getValue();
                            // console_logs('==val', val);
                            //start
                            Ext.MessageBox.show({
                                title:'확인',
                                msg: '추가 하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn:  function(result) {
                                    if(result=='yes') {
                                        
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
                                            params: {
                                                type:'REGIST',
                                                codeName:codeName,
                                                code_order:code_order,
                                                parent_system_code:'PRD_CLASS_CODE'
                                            },
                                            success: function(result, request) {
                                                var result = result.responseText;
                                                gm.me().prd_class_store.load();
                                                // console_logs("", result);

                                            },
                                            failure: extjsUtil.failureMessage
                                        });

                                    }
                                },
                                //animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                           //end
                            win.close();
        //		      		});
                        }
                    },{
                        text: CMD_CANCEL,
                        handler: function() {
                            if(win) {
                                win.close();
                                }
                        }
                    }]
                });
                win.show(/* this, function(){} */);
            }
    }),

    nextRow: vCompanyReserved4 == 'DSMF01KR' ? true : false,

    AttachFileViewAction : Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: '첨부파일',
        tooltip: '첨부파일',
        disabled: true,
        handler: function(widget, event) {
            var selections = gm.me().grid.getSelectionModel().getSelection()[0];
            gm.me().attachFileView();
        }
    }),
    supastSearchActivation: function (combo, e, eOpts) {
        gm.me().myVar = setTimeout(function() {
            gu.getCmp('supastStore').store.getProxy().setExtraParam('supplier_name', '%' + combo.value + '%');
            gu.getCmp('supastStore').store.load();
            combo.expand();
        }, 500);
    },

    treatPoAll: function(pos, keys, sel) {

        gm.me().setLoading(true);

        //OR17060001
        var fullYear = gUtil.getFullYear() + '';
        var month = gUtil.getMonth() + '';
        var codeLength = 4;

        if (month.length == 1) {
            month = '0' + month;
        }

        var first = "OR" + fullYear.substring(2, 4) + month;

        console_logs('first', first);

        var poNoList = [];

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
            params: {
                first: first,
                codeLength: codeLength
            },
            success: function (result, request) {
                var po_no = result.responseText;
                var sup_uid = keys[pos];
                var selections = [];
                for(var i = 0; i < sel.length; i++) {
                    if(sel[i].get('coord_key1') == sup_uid) {
                        selections.push(sel[i]);
                    }
                }

                var uniqueId = selections[0].get('id');
                var next = gUtil.getNextday(0);
                var request_date = gm.me().request_date;

                if (uniqueId == undefined || uniqueId < 0) {
                    Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                    return;
                } else {

                    var form = null;
                    var pjArr = [];
                    var supArr = [];
                    var cartmapUids = [];
                    var notDefinedSup = false;

                    var price_is_zero = 0;
                    var qty_is_zero = 0;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('rec', rec);
                        var coord_key1 = rec.get('coord_key1');

                        if (coord_key1 > 1) {
                            pjArr.push(rec.get('pj_code'));
                            supArr.push(coord_key1);
                            cartmapUids.push(rec.get('id'));

                            var quan = rec.get('quan');
                            var static_sales_price = rec.get('static_sales_price');
                            if (quan < 0.0000001) {
                                qty_is_zero++;
                            }
                            if (static_sales_price < 0.0000001) {
                                price_is_zero++;
                            }
                        }
                    }

                    var reserved_number2 = selections[0].get('reserved_number2');

                    //중복제거
                    pjArr = gu.removeDupArray(pjArr);
                    supArr = gu.removeDupArray(supArr);
                    console_logs('pjArr', pjArr);
                    console_logs('supArr', supArr);
                    console_logs('cartmapUids', cartmapUids);

                    if (qty_is_zero > 0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero + '건 있습니다.', function () {
                        });
                        return;
                    }

                    var next = gUtil.getNextday(0);

                    var total = 0;
                    for (var i = 0; i < selections.length; i++) {
                        var total_price = 0;
                        var rec = selections[i];
                        var coord_key1 = rec.get('coord_key1');

                        if (coord_key1 > 1) {
                            total_price = rec.get('total_price');
                            total = total + total_price;
                        }
                    }

                    var this_date = Ext.Date.add(new Date(), Ext.Date.DAY, 14);

                    this_date = Ext.Date.format(this_date, 'Y-m-d');

                    var reserved_varcharb = selections[0].get('rtgast_varcharb');

                    // console_logs('===================== 파라미터 확인 ======================', '');
                    // console_logs('pj_name == ', selections[0].get('pj_name'));console_logs('total11 == ', Ext.util.Format.number(total, '0,00/i'));
                    // console_logs('item_name == ', selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건');
                    // console_logs('coord_key1 == ', selections[0].get('coord_key1'));
                    // console_logs('po_no == ', po_no);console_logs('cartmapUids == ', cartmapUids);
                    // console_logs('coord_key3 == ', selections[0].get('coord_key3'));console_logs('ac_uid == ', selections[0].get('ac_uid'));
                    // console_logs('req_date == ', selections[0].get('req_date') == null ? this_date : selections[0].get('req_date'));
                    // console_logs('total == ', total); console_logs('reserved_number2 == ', reserved_number2);
                    // return;
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=createContractByCopy',
                        params: {
                            pj_name: selections[0].get('pj_name'),
                            total_price: Ext.util.Format.number(total, '0,00/i'),
                            item_abst: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            coord_key1: selections[0].get('coord_key1'),
                            po_no: po_no,
                            reserved_varchar1: '사내',
                            unique_uids: cartmapUids,
                            coord_key3: selections[0].get('coord_key3'),
                            ac_uid: selections[0].get('ac_uid'),
                            req_date: selections[0].get('req_date') == null ? this_date : selections[0].get('req_date'),
                            sales_price: total,
                            reserved_number2: reserved_number2

                        },
                        success: function (val, action) {
                            if(keys.length - 1 > pos) {
                                gm.me().treatPoAll(++pos, keys, sel);
                            } else {
                                gm.me().setLoading(false);
                                gm.me().store.load();
                            }
                        },
                        failure: function (val, action) {
                            if(keys.length - 1 > pos) {
                                gm.me().treatPoAll(++pos, keys, sel);
                            } else {
                                gm.me().setLoading(false);
                                gm.me().store.load();
                            }
                        }
                    });
                }

            }, // endofsuccess
            failure: extjsUtil.failureMessage
        }); // endofajax
    },

    PdCategoryTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRD_CLASS_CODE'} ),
    DeliveryPlaceStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'DELIVERY_PLACE'} ),
    SrcmapStore : Ext.create('Rfx2.store.company.dsmf.SrcmapComboStore')
    
});