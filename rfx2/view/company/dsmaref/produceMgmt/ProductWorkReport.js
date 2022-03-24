Ext.define('Rfx2.view.company.dsmaref.produceMgmt.ProductWorkReport', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-workreport-view',
    initComponent: function () {

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // var MakeStateStore = Ext.create('Mplm.store.DDStateStore',{});
        // MakeStateStore.load();
        this.setDateCombo();
        var y = Ext.Date.format(new Date(), 'Y');
        searchToolbar.insert(0, {
            xtype:'combo',
            id:'yearCombo',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            mode:'local',
            editable:true,
            width:'7%',
            queryMode:'remote',
            emptyText:'연도',
            displayField:'years',
            valueField:'years',
            store: this.yearComboStore,
            minChars: 1,
            value:y,
            sortInfo: { field: 'years', direction: 'DESC' },
            listConfig:{
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function(){
                    return '<div data-qtip="{years}">{years}</div>';
                }			                	
            },
            triggerAction: 'all',
            listeners: {
                select: function (combo, record) {
                    var value = combo.value;
                    gm.me().store.getProxy().setExtraParam('year', value);
                }
            }
        });
        var m = Ext.Date.format(new Date(), 'm');
        searchToolbar.insert(1, {
            xtype:'combo',
            id:'monthCombo',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            mode:'local',
            editable:true,
            width:'7%',
            queryMode:'remote',
            emptyText:'월',
            displayField:'field',
            valueField:'month',
            store: this.monthComboStore,
            minChars: 1,
            value:m,
            sortInfo: { field: 'month', direction: 'DESC' },
            listConfig:{
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function(){
                    return '<div data-qtip="{month}">{field}</div>';
                }			                	
            },
            triggerAction: 'all',
            listeners: {
                select: function (combo, record) {
                    console_logs('>>>>>>>>>>>>combo', combo);
                    console_logs('>>>>>>>>>>>>record', record);
                    var value = combo.value;
                    gm.me().store.getProxy().setExtraParam('month', value);
                }
            }
        });

        this.setSearchFieldCombo();

        searchToolbar.insert(2, {
            xtype:'combo',
            id:'searchField',
            name:'searchField',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            mode:'local',
            editable:true,
            width:'7%',
            // queryMode:'remote',
            emptyText:'검색조건',
            displayField:'field',
            valueField:'value',
            store: this.columnsFieldStore,
            minChars: 1,
            listConfig:{
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function(){
                    return '<div data-qtip="{value}">{field}</div>';
                }			                	
            },
            triggerAction: 'all',
            listeners: {
                select: function (combo, record) {
                    // var value = record[0].get('years');
                    // cloudprojectStore.getProxy().setExtraParam('years', value);
                    // cloudprojectStore.load();
                }
            }
        });

        searchToolbar.insert(3, {
            xtype:'triggerfield',
            emptyText:'입력하세요.',
            id:'filterField',
            name:'filterField',
            listeners: {
                specialkey: function(field, e) {
                    if(e.getKey() == Ext.EventObject.ENTER) {
                        var f = Ext.getCmp('searchField').getValue();
                        if(f == null || f == undefined || f.length<1) {
                            Ext.MessageBox.alert('알림', '검색조건을 선택해주세요.');
                            return;
                        }
                        var v = field.value;
                        gm.me().store.clearFilter();
                        gm.me().store.filter({
                            property: f,
                            value: v,
                            anyMatch: true,
                            caseSensitive: false
                        })
                    }
                }
            },
            trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
            onTrigger1Click: function(click) {
                var f = Ext.getCmp('searchField').getValue();
                if(f == null || f == undefined || f.length<1) {
                    Ext.MessageBox.alert('알림', '검색조건을 선택해주세요.');
                    return;
                }
                var v = click.value;
                gm.me().store.clearFilter();
                gm.me().store.filter({
                    property: f,
                    value: v,
                    anyMatch: true,
                    caseSensitive: false
                });
            }
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }

        });

        this.createStore('Rfx2.model.company.dsmf.ProduceWorkReport', [{
                property: 'item_code',
                direction: 'ASC'
            }],
            gMain.pageSize
        );

        // this.store.getProxy().setExtraParam('state_name', 'Y');
        this.store.getProxy().setExtraParam('year', y);
        this.store.getProxy().setExtraParam('month', m);

        this.store.getProxy().setExtraParam('standard_flag', 'A');

        //그리드 생성
        Ext.each(this.columns, function(columnObj, index) {
            var o = columnObj;
            var dataIndex = o['dataIndex'];

            o['locked'] = true;

            if(dataIndex != null && dataIndex == 'sum_qty') {
                o['summaryType'] = 'sum';
                o['summaryRenderer'] = function(value) {
                    return gUtil.renderNumber(value);
                }
            }
        });

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{columnName}:{name} / 납품예정일: {[values.rows[0].data.delivery_plan_str]} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
            hideGroupedHeader: false,
            startCollapsed: false,
            // id: 'restaurantGrouping'
        });

        var option = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridContextMenu(this).showAt(e.getXY());
                    return false;
                },
            },
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            // features: [groupingFeature]
            // features: [{ftype:'grouping'}],
            // features: [{
            //     ftype: 'summary',
            //     dock: 'top'
            // }]
        };

        //그리드 생성
        this.usePagingToolbar = false; // 페이지바 삭제
        this.createGrid(searchToolbar, buttonToolbar, option);

        // 생산일보
        this.productReportAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: '생산일보',
            tooltip: '생산일보 출력',
            disabled: false,
            handler: function () {
                
                var win = Ext.create('ModalWindow', {
                    title:'생산일보',
                    width:300,
                    height:150,
                    minWidth: 250,
                    minHeight: 150,
                    plain: true,
                    items: [
                        {
                            xtype: 'panel',
                            id: 'detailStatus',
                            autoScroll: true,
                            autoWidth: true,
                            flex: 3,
                            padding: '5',
                            items:[
                                {
                                    xtype:'datefield',
                                    id:'product_date',
                                    name:'product_date',
                                    value:Ext.Date.format(new Date(), 'Y-m-d'),
                                    fieldLabel:'생산날짜',
                                    format: 'Y-m-d',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                }
                            ]
                        }
                    ],
                    buttons: [{
                        text: CMD_OK,
                        handler: function() {
                            var date = Ext.getCmp('product_date').getValue();
                            if(date == null || date.length < 1) return;
                            gm.me().getProductDailyReport(date);
                            if(win) {win.close();}
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if(win) {win.close();}
                        }
                    }]
                }); win.show();
            }
        });

        buttonToolbar.insert(1, this.productReportAction);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                var rec = selections[0];
                console_logs('>>>>>>>>>>>>>>>Rec',rec);
                
            } else {

            }

        });

        this.setDayColumns();

        Ext.apply(this, {
            layout: 'border',
			items: [
				{
					collapsible: false,
					frame: true,
					region: 'center',
                    layout:'fit',
					items: [this.grid]
				}
			]
        });

        this.callParent(arguments);

        //디폴트 로딩
        gMain.setCenterLoading(true);

        this.grid.getStore().getProxy().setExtraParam('po_type', '');
        this.store.getProxy().setExtraParam('state_name', 'P');
        this.storeLoad();
        this.store.clearFilter();
    },

    getProductDailyReport: function(date) {
        date = Ext.Date.format(date, 'Y-m-d');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=getDailyProductReport',
            params: {
                product_date:date
            },
            reader: {
                excelPath: 'excelPath'
            },
            success: function (result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                var excelPath = jsonData.excelPath;
                if (excelPath != null && excelPath != undefined && excelPath.length > 0) {
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                    top.location.href = url;
                } else {
                    Ext.Msg.alert('알림', '조회된 데이터가 없습니다.');
                    return;
                }
            },
            failure: extjsUtil.failureMessage
        });
    },

    createCenter: function() {

        // var requestMakeAction = this.getRequestMake();
        // var addAttachAction = this.getAttachAdd();

        // this.workPartListStore = Ext.create('Rfx2.store.company.dsmf.workPartListStore', {});
        this.partBomStore = Ext.create('Rfx2.store.company.dsmf.cloudProducePartLine', {});
        this.partListGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: true,
            store: this.partBomStore,
            // bbar: getPageToolbar(this.prdStore),
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            viewConfig: {
                // getRowClass : function(record, index) {
                //     var child_cnt = record.get('child_cnt');
                //     if(child_cnt < 1) {
                //         return 'red-row';
                //     }
                // }
            },
            dockedItems: [{
                
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                    //    '->',addAttachAction
                        // this.printFinalPDFAction
                    ],
                
            }],
            columns: [
                {
                    text: '구분',
                    dataIndex: 'standard_flag',
                    width: 30,
                    align:'center',
                    sortable: true,
                    renderer: function(value, meta) {
                        switch(value) {
                        case 'A':
                            meta.css = 'custom-column-assembly';
                            return 'Assy';
                        case 'R':
                            return 'Part';
                        default:
                            return value;
                        }
                    }
                },{
                    text: '진행상태',
                    dataIndex: 'status',
                    width: 60,
                    align:'center',
                    sortable: true,
                    renderer: function(value, meta, record) {
                        var route_type = record.get('route_type');
                        return gm.me().getAssyStatus(value, meta, route_type);
                    }
                },{
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 100,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 100,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '단위',
                    dataIndex: 'unit_code',
                    width: 60,
                    style: 'text-align:center',
                    align: 'left'
                }
                // ,{
                //     text: 'ASSY총량',
                //     dataIndex: 'quan',
                //     width: 40,
                //     style: 'text-align:center',
                //     align: 'right'
                // }
                ,{
                    text: 'BOM수량',
                    dataIndex: 'bm_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '필요수량',
                    dataIndex: 'quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '실생산수량',
                    dataIndex: 'make_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function(value, meta, record) {
                        var standard_flag = record.get('standard_flag');
                        if(standard_flag == 'A') {
                            var quan = record.get('quan');
                            var rc_quan = record.get('rc_quan');

                            return quan - rc_quan;
                        } else {
                            return 0;
                        }
                    }
                },{
                    text: '재고할당',
                    dataIndex: 'rc_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '구매요청',
                    dataIndex: 'pr_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function(value, meta, record) {
                        var gr_quan = record.get('cartmap_grQuan');
                        if(gr_quan > 0) {
                            return value - gr_quan;
                        } else {
                            return value;
                        }
                    }
                },{
                    text: '입고예정일',
                    dataIndex: 'req_delivery_date',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                    // renderer: function(value, meta) {

                    //     return value;
                    // }
                },{
                    text: '입고수량',
                    dataIndex: 'cartmap_grQuan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right'
                }
            ],
            listeners: {
                celldblClick: function(view, th, col_idx, record, tr, row_idx) {
                    gm.me().viewMtrlDetailStatus(col_idx, row_idx);
                }
            }
        });

        this.partListGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length>0) {
                    console_logs('>>> selections', selections);
                } else {

                }
            }
        });
        
        return this.partListGrid;
    },

    years_arr:[],
    month_arr:[],

    setDateCombo:function() {
        var now = Ext.Date.format(new Date(), 'Y');
        var y=2000;
        while(y<=now) {
            var ys = {
                    years:now
            };
            this.years_arr.push(ys);
            now--;
        };
        var i=0;
        while(i<12) {
            var m = {
                field: i+1 + '월',
                month: i+1
            };
            this.month_arr.push(m);
            i++;
        }

        this.yearComboStore = Ext.create('Ext.data.Store', {
            fields: ['years'],
            data: this.years_arr
        });

        this.monthComboStore = Ext.create('Ext.data.Store', {
            fields: ['month'],
            data: this.month_arr
        });
    },

    setDayColumns:function() {
        var i=0;
        var len = this.columns.length + 1;
        while(i<31) {
            var col = {
                header: (i+1) + '일',
                width:40,
                sortable:true,
                align:'center',
                dataIndex:'day' + (i+1),
                summaryType : 'sum',
                summaryRenderer : function(value) {
                    return gUtil.renderNumber(value);
                },
                renderer: function(value) {
                    if(value == 0) {
                        value = "";
                    }
                    return value;
                }
            }
            this.grid.view.normalGrid.headerCt.insert(len+i, col);
            i++;
        };
        this.grid.getView().refresh();
    },

    setSearchFieldCombo: function() {
        var field_arrs = [];
        Ext.each(this.columns, function(columnObj, index) {
            var s = {
                field:columnObj['text'],
                value:columnObj['dataIndex']
            };
            field_arrs.push(s);
        });

        this.columnsFieldStore = Ext.create('Ext.data.Store', {
            fields: ['field', 'value'],
            data: field_arrs
        });
    }
});