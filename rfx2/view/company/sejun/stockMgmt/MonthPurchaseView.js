

Ext.define('Rfx2.view.company.sejun.stockMgmt.MonthPurchaseView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'month-purchase-view',
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



    monthPurchaseStore: Ext.create('Rfx2.store.company.sejun.MonthPurchaseStore', {}),
    
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
            text: '년 월 원부자재매입현황',
            columns: [ {
                text:'구분',
                width: 100,
                sortable: false,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'class_code_ko',
          
            },
            {
                text:'상호',
                width: 150,
                sortable: false,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'supplier_name',
            },]
            ,
            locked : true,
        },
        {
            text:  '　',
            columns: [ 
                {
                    text:'품목',
                    width: 200,
                    sortable: false,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                },
               
                {
                    text:'단가<br/>(공급가액)',
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

        
        this.monthPurchaseStore.on('load', function (me, records, c, d) {
            // var planDates = me.getProxy().getExtraParams().plan_date;
            // var dateArr = planDates.replaceAll('%','').replaceAll('"','').split(':');
            // var sDateArr = dateArr[0].split('-');
            // var eDateArr = dateArr[1].split('-');
            var startDate = Ext.Date.getFirstDateOfMonth(gu.getCmp('start_date').getValue());
            var endDate = Ext.Date.getLastDateOfMonth(gu.getCmp('start_date').getValue());
            var year = startDate.getFullYear();
            var month = startDate.getMonth()+1;
            var day = startDate.getDate();
            // var startDate = new Date(gu.getCmp('start_date').getValue());
            // var endDate = new Date(gu.getCmp('start_date').getValue());
    
            // hard-corded
            var dbColumnCount = 2; // 고정 컬럼 개수
            // startDate.setFullYear(sDateArr[0],sDateArr[1]-1,sDateArr[2]);
            // endDate.setFullYear(eDateArr[0],eDateArr[1]-1,eDateArr[2]);
            // 고정 컬럼 외의 것 제거 & 날짜 컬럼 생성

            for (var i = gridColumns.length; i > dbColumnCount; i--) {
                gridColumns.pop();
            }

            endDate.setDate(endDate.getDate() + 1);
         

            while(startDate < endDate) {

                var year = startDate.getFullYear();
                var month = startDate.getMonth()+1;
                var day = startDate.getDate();
                
                gridColumns.push(
                    {
                    text: (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day),
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
                        text : "일일 매입량",
                        dataIndex: 'day_gr_qty_sum' + day,
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
                        text : "일일 매입액",
                        dataIndex: 'day_gr_price_sum' + day,
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
                startDate.setDate(startDate.getDate() + 1);
            }
            gridColumns.push(
                {
                text: '월 합계',
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
                    text : "월 매입량",
                    dataIndex: 'month_total_gr_qty',
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
                    text : "월 매입액",
                    dataIndex: 'month_total_gr_price',
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

            gm.me().westGrid.bodyWrap.component.config.columns[0].text = year +'년 ' + month +'월 ' + '원부자재매입현황';
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
            store: this.monthPurchaseStore,
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
                //     {
                //     ui: 'default-toolbar',
                //     xtype: 'button',
                //     cls: 'dock-tab-btn',
                //     text: 'Export to ...',
                //     menu: {
                //         defaults: {
                //             handler: 'exportTo1'
                //         },
                //         items: [
                //             {
                //             text: '엑셀출력',
                //             cfg: {
                //                 type: 'excel07',
                //                 ext: 'xlsx',
                //                 includeGroups: true,
                //                 includeSummary: true
                //             },
                //         }
                //     ]
                //     }
                // }
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

        // this.westGridTemplate = Ext.create('Ext.tab.Panel', {
        //     cls: 'rfx-panel',
        //     // layout: 'fit',
        //     width: 2000,
        //     height: 1000,
        //     scrollable: true,
        //     autoScroll: true,
        //     items: [{
        //         title: '떡 재고수량',
        //         items: [this.westGrid]
        //     }]
        // });


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
                            xtype: 'datefield',
                            name: 'start_plan_date',
                            format: 'Y-m-d',
                            id: gu.id('start_date'),
                            // minValue : '2022-01-14', 
                            format   : 'Y-m-d',
                            maxValue : new Date(), 
                            emptyText: '시작일자',
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
                        // '~',
                        // {
                        //     xtype: 'datefield',
                        //     name: 'end_plan_date',
                        //     format: 'Y-m-d',
                        //     id: gu.id('end_date'),
                        //     format   : 'Y-m-d',
                        //     // minValue : '2022-01-14', 
                        //     emptyText: '종료일자',
                        //     // fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자',
                        //     hideTrigger: false,
                        //     width: 200,
                        //     keyNavEnabled: true,
                        //     mouseWheelEnabled: true,
                        //     editable: true,
                        //     listeners: {
                        //         select: function () {

                        //         }

                        //     },
                        // },
                        // this.analysisPsi
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

        // this.stockHisRI.load({callback : function() {  gm.me().mergeCells(gm.me().westGrid,3);}});
        // this.stockHisNU.load({callback : function() {  gm.me().mergeCells(gm.me().eastGrid,3);}});
        // console.log('날짜 테스트',Ext.Date.format( Date.now(),  'Ymd'));
        // console.log(Ext.Date.format('2', 'Y-m-d'));
        // this.stockHisRI.load({start_date : Ext.Date.format(new Date(), 'Y-m-d')});
        // this.stockHisNU.load({start_date : Ext.Date.format(new Date(), 'Y-m-d')});
      
      
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

        if(gu.getCmp('start_date').getValue() !=null){
            var startDate = Ext.Date.getFirstDateOfMonth(gu.getCmp('start_date').getValue());
            var endDate = Ext.Date.getLastDateOfMonth(gu.getCmp('start_date').getValue());
            var month = startDate.getMonth()+1;
            gm.me().westGrid.getStore().getProxy().setExtraParam('start_date', startDate);
            gm.me().westGrid.getStore().getProxy().setExtraParam('end_date',endDate);
            gm.me().westGrid.getStore().load();
            // gm.me().eastGrid.getStore().getProxy().setExtraParam("start_date", gu.getCmp('start_date').getValue());
            // gm.me().eastGrid.getStore().load();
          this.titleName = month +'월 매입현황';
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