

Ext.define('Rfx2.view.company.sejun.stockMgmt.YearSalesView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'year-sales-view',
    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.TSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xml',
        'Ext.exporter.excel.Xlsx',
        'Ext.grid.plugin.Exporter'
    ],

    exportTo: function(btn) {
        var cfg = Ext.merge({
            title: 'Grid export demo',
            fileName: 'GridExport' + '.' + ('xlsx' || 'excel07')
        }, 'excel07');

        var p = Ext.ComponentQuery.query('grid')[0];
        p.saveDocumentAs(cfg)
    },

    onBeforeDocumentSave: function(view) {
        this.timeStarted = Date.now();
        view.mask('Document is prepared for export. Please wait ...');
        Ext.log('export started');
    },

    onDocumentSave: function(view) {
        view.unmask();
        Ext.log('export finished; time passed = ' + (Date.now() - this.timeStarted));
    },

    onDataReady: function() {
        Ext.log('data ready; time passed = ' + (Date.now() - this.timeStarted));
    },



    yearSalesStore: Ext.create('Rfx2.store.company.sejun.YearSalesStore', { }),
    
    isYnStore: Ext.create('Mplm.store.YnFlagStore', {}),
    // storeViewProp: Ext.create('Rfx2.store.company.bioprotech.MaterialPurchaseRateStore', {}),

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var arr = [];
        var gridColumns =  [];

        gridColumns.push(
            {
            text: '년 판매현황',
            columns: [ {
                text:'구분',
                width: 100,
                sortable: false,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'class_code_ko',
          
            },
            {
                text:'품목',
                width: 200,
                sortable: false,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'item_name',
            },]
            ,
            locked : true,
        },
        {
            text:  '　',
            columns: [ 
                {
                    text:'품목코드',
                    width: 100,
                    sortable: false,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code',
                },
                {
                    text:'납품처',
                    width: 100,
                    sortable: false,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'wa_name',
                },
                {
                    text:'ea 납품가<br/>(vat 별도)',
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'unit_price',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'unit_price') {
                            context.record.set('unit_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text:'box납품가<br/>(vat 별도)',
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'box_price',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'box_price') {
                            context.record.set('box_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }, 
            ]
            ,
            locked : true,
        },
        
        
        );

       
    


        arr.push(buttonToolbar);
        arr.push(searchToolbar);


        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: '검색',
            disabled: false,
            handler: function (widget, event) {
                gm.me().searchEvent()
            }
        });

        
        this.yearSalesStore.on('load', function (me, records, c, d) {
          
    
            // hard-corded
            var dbColumnCount = 2; // 고정 컬럼 개수
            var selectYear = gu.getCmp('select_year').getValue();
            // 고정 컬럼 외의 것 제거 & 날짜 컬럼 생성
            for (var i = gridColumns.length; i > dbColumnCount; i--) {
                gridColumns.pop();
            }

        
           
            var i =1;
            while(i < 13) {
                gridColumns.push(
                    {
                    text:  i + '월',
                    // dataIndex: 'date_' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day),
                    width: 300,
                    style: 'text-align:center',
                    align: 'right',
                    // locked: true,
                    // lockable: true,
                    renderer: gm.me().renderNumber,
                    columns : [{
                        width: 150,
                        style: 'text-align:center',
                        align: 'right',
                        text : "월 판매량",
                        dataIndex: 'month_gr_qty_sum' + i,
                        summaryType: 'sum',
                        renderer: function (value, context, tmeta) {
                            if (context.field == 'unit_price') {
                                context.record.set('unit_price', Ext.util.Format.number(value, '0,00/i'));
                            }
                            if (value == null || value.length < 1) {
                                value = 0;
                            }
                            return Ext.util.Format.number(value, '0,00/i');
                        },
                        summaryRenderer: function (value, summaryData, dataIndex) {
                            return renderDecimalNumber(value);
                        }
                        
                        
                    },
                    {
                        width: 150,
                        style: 'text-align:center',
                        align: 'right',
                        text : "월 매출액",
                        dataIndex: 'month_gr_price_sum' + i,
                        summaryType: 'sum',
                        renderer: function (value, context, tmeta) {
                            if (context.field == 'unit_price') {
                                context.record.set('unit_price', Ext.util.Format.number(value, '0,00/i'));
                            }
                            if (value == null || value.length < 1) {
                                value = 0;
                            }
                            return Ext.util.Format.number(value, '0,00/i');
                        },
                        summaryRenderer: function (value, summaryData, dataIndex) {
                            return renderDecimalNumber(value);
                        }
                    }]
                });
                // startDate.setDate(startDate.getDate() + 1);
                i++;
            }
            gridColumns.push(
                {
                text: '년 합계',
                // dataIndex: 'date_' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day),
                width: 300,
                style: 'text-align:center',
                align: 'right',
                // locked: true,
                // lockable: true,
                renderer: gm.me().renderNumber,
                columns : [{
                    width: 150,
                    style: 'text-align:center',
                    align: 'right',
                    text : "년 판매량",
                    dataIndex: 'year_total_gr_qty',
                    summaryType: 'sum',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'unit_price') {
                            context.record.set('unit_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    }
                },
                {
                    width: 150,
                    style: 'text-align:center',
                    align: 'right',
                    text : "년 매출액",
                    dataIndex: 'year_total_gr_price',
                    summaryType: 'sum',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'unit_price') {
                            context.record.set('unit_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    }
                }]
            });
            // var gridColumns = [{text :'1'}] ;
            //= gm.me().westGrid.columns;
            gm.me().westGrid.bodyWrap.component.config.columns[0].text = selectYear +'년' + ' 판매현황';
            gm.me().westGrid.reconfigure(undefined, gridColumns);
            // gm.me().westGrid
            // 데이터 모양 변경
            var newRecords = [];
        });

        



        this.westGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('westGrid'),
            // selModel: 'checkboxmodel',
            width: '100%',
            height : '100%',
            store: this.yearSalesStore,
            viewConfig: {
                markDirty: false
              },
            plugins: {
                gridexporter: true
            },
            style: 'padding-left:0px;',
            // autoScroll: true,
            columnLines: true,
            syncRowHeight: false,
            // renderTO : Ext.getBody(),
            signTpl: '<span style="' +
            'color:{value:sign(\'"#cf4c35"\',\'"#73b51e"\')}"' +
        '>{text}</span>',
        features: [{
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: false,
            enableGroupingMenu: false
        }, {
            ftype: 'summary',
            dock: 'bottom'
        }],

            columns: gridColumns,
            scrollable: true,
            listeners: {


            },
            header: {
                itemPosition: 1, // after title before collapse tool
                items: [
                {
	               xtype: 'button',
	               text: 'Excel 다운로드',
	               handler: function (button) {

	                   var grid = button.up('grid');
	                   grid.saveDocumentAs({
	                       type: 'xlsx',
	                       title: 'Sheet1',
                           includeGroups: true,
                           includeSummary: true,
	                       fileName: new Date() + '.xlsx'
	                   });

	               }
                }
            ]
            }
        });

        this.westGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    // gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                   
                } else {
                
                }
            }
        });


        var yearStore = Ext.create('Ext.data.Store', {
            fields: ['year', 'view'],
            data: [
                {"year": "2020", "view": "2020년"},
                {"year": "2021", "view": "2021년"},
                {"year": "2022", "view": "2022년"},
                {"year": "2023", "view": "2023년"},
                {"year": "2024", "view": "2024년"},
                {"year": "2025", "view": "2025년"},
                {"year": "2026", "view": "2026년"},
                {"year": "2027", "view": "2027년"},
                {"year": "2028", "view": "2028년"},
                {"year": "2029", "view": "2029년"},
                {"year": "2030", "view": "2030년"}
            ]
        });

        var westGridtemp = {
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'hbox',
                pack: 'start',
            },
            margin: '0 0 0 0',
            flex: 0.5,
            width: 2000,
            height : 1000,
            autoScroll: true,
            // scrollable: true,
            items: [this.westGrid],
           
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                       

                        {
                            xtype: 'combo',
                            name: 'select_year',
                            format: 'Y-m-d',
                            id: gu.id('select_year'),
                            store : yearStore,
                            // minValue : '2022-01-14', 
                            // format   : 'Y-m-d',
                            // maxValue : new Date(), 
                            emptyText: '년도',
                            displayField: 'view',
                            valueField: 'year',
                            value: new Date().getFullYear(),
                            // fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자',
                            hideTrigger: false,
                            width: 200,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                select: function () {

                                }

                            },
                        },
                    ]
                },
            ]
        };



      
        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [westGridtemp]
        });
        this.callParent(arguments);
    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300
    },
    items: null,

    searchEvent : function (){

        if(gu.getCmp('select_year').getValue() !=null){
            var selectYear = gu.getCmp('select_year').getValue();
            gm.me().westGrid.getStore().getProxy().setExtraParam('select_year', selectYear);
            gm.me().westGrid.getStore().load();
            // gm.me().eastGrid.getStore().getProxy().setExtraParam("start_date", gu.getCmp('start_date').getValue());
            // gm.me().eastGrid.getStore().load();
        }
        
    },
    renderNumber: function (value) {
        if (value !== null && value > 0) {
            return Ext.util.Format.number(value, '0,000.#####');
        } else {
            return value;
        }
    },

   

       




});