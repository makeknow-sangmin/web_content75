Ext.define('Rfx2.view.company.sejun.purStock.StockHistoryView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-history-view',



    counsumeRateMtrl: Ext.create('Rfx2.store.company.sejun.PartLineNpStore', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    consumeRateAssy: Ext.create('Rfx2.model.company.sejun.ProduceWorkDefect', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    stockHisRI: Ext.create('Rfx2.store.company.sejun.StockHistoryStore', { saveType:'STOCK-RI', classCode :' RI' }),
    stockHisNU: Ext.create('Rfx2.store.company.sejun.StockHistoryStore', { saveType: 'STOCK-NU', classCode :'NU'}),
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

        this.expDateAssign = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'expDateAssign',
            text: '일부인 지정',
            disabled: true,
            handler: function (widget, event) {
            }
        });

        this.requestProduceAssy = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'requestProduceAssy',
            text: '자재소모',
            disabled: true,
            handler: function (widget, event) {
            }
        });

        this.downloadPDF = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'requestProduceAssy',
            text: 'PDF 다운로드',
            disabled: false,
            handler: function (widget, event) {
            }
        });

        // 소모가 되지 않는 상태에서 실제 할당을 취소한다.
        this.backAssignAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            itemId: 'backProduceAssy',
            text: '배분취소',
            disabled: true,
            handler: function (widget, event) {
            }
        });

        // 전체 출고기능
        this.cancelOutAll = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            itemId: 'cancelOutMaterial',
            text: '전체 출고취소',
            disabled: true,
            handler: function (widget, event) {
            }
        });

        // 소모가 된 상태에서 실제 사용되지 않은 자재에 대한
        // 자재 수량 원복처리 기능
        this.returnMaterial = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            itemId: 'returnMaterialAction',
            text: '반납처리',
            disabled: true,
            handler: function (widget, event) {
            }
        });



        this.westGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('westGrid'),
            // selModel: 'checkboxmodel',
            width: '50%',
            store: this.stockHisRI,
            style: 'padding-left:0px;',
            autoScroll: true,
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 35,
                },
                {
                    text: this.getMC('번역미정', '품 목'),
                    columns: [ {
                        text: this.getMC('번역미정', ''),
                        width: 200,
                        sortable: false,
                        align: "left",
                        style: 'text-align:center',
                        dataIndex: 'item_name'
                    },
                    {
                        text: this.getMC('번역미정', ''),
                        width: 50,
                        sortable: false,
                        align: "right",
                        style: 'text-align:center',
                        dataIndex: 'need_qty'
                    },]
                },
               
                {
                    text: this.getMC('번역미정', '반제품'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty5',
                   rowSpan: params => params.data.country === 'Russia' ? 3 : 3,
                },

                {
                    text: this.getMC('번역미정', '현재고'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty1'
                },
                {
                    text: this.getMC('번역미정', '금일예정'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty4'
                },
                {
                    text: this.getMC('번역미정', '미출고'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty3'
                },
                {
                    text: this.getMC('번역미정', '금일발주'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty2'
                },
             
            ],
            scrollable: true,
            flex: 1,
            // bbar: Ext.create('Ext.PagingToolbar', {
            //     store: this.consumeRateAssy,
            //     displayInfo: true,
            //     displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
            //     emptyMsg: "표시할 항목이 없습니다.",
            //     listeners: {
            //         beforechange: function (page, currentPage) {
            //         }
            //     }

            // }),
            width: 915,
            height: 720,
            listeners: {

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

        this.westGridTemplate = Ext.create('Ext.tab.Panel', {
            cls: 'rfx-panel',
            layout: 'fit',
            width: '100%',
            height: '100%',
            plain: true,
            items: [{
                title: '떡 재고수량',
                items: [this.westGrid]
            }]
        });


        var westGridtemp = {
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.5,

            items: [this.westGridTemplate],
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
                            id: gu.id('saveDate'),
                            minValue : '2022-01-14', 
                            maxValue : new Date(), 
                            emptyText: '검색일자',
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
                        '->',
                        // this.analysisPsi
                    ]
                },
            ]
        };



        this.eastGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            xtype: 'row-numberer',
            id: gu.id('eastGrid'),
            // selModel: 'checkboxmodel',
            width: '50%',
            store: this.stockHisNU,
            style: 'padding-left:0px;',
            autoScroll: true,
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 35,
                },
                {
                    text: this.getMC('번역미정', '품 목'),
                    columns: [ {
                        text: this.getMC('번역미정', ''),
                        width: 200,
                        sortable: false,
                        align: "left",
                        style: 'text-align:center',
                        dataIndex: 'item_name'
                    },
                    {
                        text: this.getMC('번역미정', ''),
                        width: 50,
                        sortable: false,
                        align: "right",
                        style: 'text-align:center',
                        dataIndex: 'need_qty'
                    },]
                },
               
                {
                    text: this.getMC('번역미정', '반제품'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty5',
                   rowSpan: params => params.data.country === 'Russia' ? 3 : 3,
                },

                {
                    text: this.getMC('번역미정', '현재고'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty1'
                },
                {
                    text: this.getMC('번역미정', '금일예정'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty4'
                },
                {
                    text: this.getMC('번역미정', '미출고'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty3'
                },
                {
                    text: this.getMC('번역미정', '금일발주'),
                    width: 100,
                    sortable: false,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'generic_qty2'
                },
             
            ],
            scrollable: true,
            flex: 1,
            width: 915,
            height: 720,
            listeners: {

            }
        });

        this.eastGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
            
            }
        });

        this.eastGridTemplate = Ext.create('Ext.tab.Panel', {
            cls: 'rfx-panel',
            layout: 'fit',
            width: '100%',
            height: '100%',
            plain: true,
            items: [{
                title: '누룽지 재고수량',
                items: [this.eastGrid]
            }]
        });


        var eastGridTemp = {
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.5,

            items: [this.eastGridTemplate],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                     
                        // this.requestPurchase,
                        '->',
                        this.downloadPDF,
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
            items: [westGridtemp, eastGridTemp]
        });
        this.callParent(arguments);

        // this.stockHisRI.load({callback : function() {  gm.me().mergeCells(gm.me().westGrid,3);}});
        // this.stockHisNU.load({callback : function() {  gm.me().mergeCells(gm.me().eastGrid,3);}});
        // console.log('날짜 테스트',Ext.Date.format( Date.now(),  'Ymd'));
        // console.log(Ext.Date.format('2', 'Y-m-d'));
        // this.stockHisRI.load({saveDate : Ext.Date.format(new Date(), 'Y-m-d')});
        // this.stockHisNU.load({saveDate : Ext.Date.format(new Date(), 'Y-m-d')});
      
      
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

        if(gu.getCmp('saveDate').getValue() !=null){
            gm.me().westGrid.getStore().getProxy().setExtraParam("saveDate", gu.getCmp('saveDate').getValue());
            gm.me().westGrid.getStore().load();
            gm.me().eastGrid.getStore().getProxy().setExtraParam("saveDate", gu.getCmp('saveDate').getValue());
            gm.me().eastGrid.getStore().load();
        }
        
    },

       mergeCells : function( grid, cols) {

            var columns = grid.columns;
            var  view = grid.getView();
            var store = grid.getStore();
           

            var rowCount = store.getCount();
                
           
            // console_logs('테스트111 : ', store.data);
            // console_logs('테스트111 : ', rowCount);
            // console_logs('테스트222 : ',store.data.items);
            column = columns[3];
            dataIndex = column.dataIndex;
            console_logs('테스트111 : ', columns);
            spanCell = null;
            spanCount = null;
            spanValue = null;
            
            for (var row = 0; row < rowCount; ++row) {
                var cell = view.getCellByPosition({ row: row, column: 3 }).dom;
                    record = store.getAt(row);
                    value = record.get(dataIndex);
                
                if (spanValue != value) {
                    if (spanCell !== null) {
                        spanCell.rowSpan = spanCount;
                    }
                    console_logs('테스트 : ', cell);
                    Ext.fly(cell).setStyle('display', '');
                    spanCell = cell;
                    spanCount = 1;
                    spanValue = value;
                } else {
                    spanCount++;
                    Ext.fly(cell).colSpan=2
                    Ext.fly(cell).setStyle('display', '');
                }
            }
            
            if (spanCell !== null) {
                spanCell.rowSpan = spanCount;
            }


         

      },
//       mergeCells2 : function( grid, row, col) {


//         var id = grid.view.getId(); // Get the ID of grid in the document
//         var viewDiv = document.getElementById(id); // get div control
//         var tables = viewDiv.getElementsByTagName("table");//Get the table control from the div, and then operate on this table[]
//                    if (tables.length==0) {  
//                        return;  
//                    }  
           
      
//         var vars  = tables[0].getElementsByTagName("tr"); // return all rows
        
//         // console.log('trs : ', tables);
//         var begin = vars[row].getElementsByTagName("td")[col]; // start merged cells

        
//         var span = 1; // merged span
//         console.log('테스트  td: ',vars);
//         for (var i = row; i < tables.length; i++) {  
//             var tr = tables[i].getElementsByTagName("tr")[0];  
//             var td = tr.getElementsByTagName("td")[col];  
          
//             // console.log('테스트 tr: ',tr);
//             if (!td) {  
//                 continue;  
//             }  
//              if (td.innerHTML == begin.innerHTML) {/// If the cell contents are equal, merge them, otherwise skip
                
//                 if (i > row) {  
//                     span++;  
//                     begin.rowSpan = span; /// merge down num rows
//                     begin.style["vertical-align"] = "middle"; 
                  
//                     tr.removeChild(td); // delete the overwritten cell
//                     // console.log('테스트 : ',td.innerHTML);
//                     // console.log('테스트 : ',begin.innerHTML);
//                 }
//                 else {  
//                     begin= td;  
//                     span= 1;  
//                 }  
//              }  
                
//         }

//   },


    //   function coalescing(grid, row, col) {  
       
        
    //     });  


      



});