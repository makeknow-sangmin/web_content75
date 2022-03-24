Ext.define('Rfx2.view.grid.company.hanjung.AccountInTypeGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.feature.Grouping'
    ],
    cls: 'rfx-panel',
    region: 'center',
    
    initComponent: function () {
        this.callParent();
    },
    autoScroll: true,
        columns: [
        {
            "text": "입금자",
            "width": 60, "sortable": true,
            "dataIndex": "requestor",
            "listeners": {}, "triStateSort": false,
            "align" : "left"
        },
        {
            "text": "요청일",
            "width": 150,
            "sortable": true,
            "dataIndex": "request_date",
            "listeners": {},
            "triStateSort": false,
            "align" : "left"
        },
        {
            "text": "금액",
            "width": 80,
            "sortable": true,
            "dataIndex": "price",
            "listeners": {},
            "triStateSort": false,
            "xtype": "numbercolumn", 
            "format":"0,000",
            "align" : "right"
        },
        {
            "text": "설명",
            "width": 60,
            "sortable": true,
            "dataIndex": "description",
            "listeners": {},
            "triStateSort": false,
            "align" : "left"
        }
        
        ],
        
});
