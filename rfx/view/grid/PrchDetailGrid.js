Ext.define('Rfx.view.grid.PrchDetailGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.feature.Grouping'
    ],
    cls: 'rfx-panel',
    initComponent: function () {


        this.callParent();


    },
    autoScroll: true,
    columns: [
        {
            "text": "품번",
            "width": 120, 
            "sortable": true,
            "dataIndex": "item_code",
            "listeners": {},
            "align":"center",
            "triStateSort": false
        },
        {
            "text": "품명",
            "width": 120, 
            "sortable": true,
            "align":"center",
            "dataIndex": "item_name",
            "listeners": {}, "triStateSort": false
        },
        {
            "text": "규격",
            "width": 100,
            "sortable": true,
            "align":"center",
            "dataIndex": "specification",
            "listeners": {},
            "triStateSort": false
        },
        {
            "text": "주문수량",
            "width": 80,
            "sortable": true,
            "align":"right",
            "dataIndex": "po_qty",
            "listeners": {},
            "triStateSort": false
        },
        {
            "text": "취소수량",
            "width": 80,
            "sortable": true,
            "align":"right",
            "dataIndex": "po_blocking_qty",
            "listeners": {},
            "triStateSort": false
        },
        {
            "text": "입고수량", 
            "width": 80,
            "sortable": true,
            "align":"right",
            "dataIndex": "gr_qty",
            "listeners": {},
            "triStateSort": false
        },
        {
            "text": "주문단가",
            "width": 100, 
            "sortable": true,
            "align":"right",
            "dataIndex": "sales_price",
            "listeners": {}, 
            "triStateSort": false
        },
        {
            "text": "주문금액",
            "width": 100, 
            "sortable": true,
            "align":"right",
            "dataIndex": "po_amount",
            "listeners": {}, 
            "triStateSort": false
        },
        {
            "text": "납품일자",
            "width": 100, 
            "align":"center",
            "sortable": true,
            "dataIndex": "req_delivery_date",
            "listeners": {}, 
            "triStateSort": false
        }
    ]
});
