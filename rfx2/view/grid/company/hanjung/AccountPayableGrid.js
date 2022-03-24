Ext.define('Rfx2.view.grid.company.hanjung.AccountPayableGrid', {
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
            "text": "수주번호",
            "width": 80, "sortable": true,
            "dataIndex": "reserved_varcharh",
            "listeners": {},
            "triStateSort": false,
            "align" : "left"
        },
        {
            "text": "고객명",
            "width": 60, "sortable": true,
            "dataIndex": "reserved_varchar2",
            "listeners": {}, "triStateSort": false,
            "align" : "left"
        },
        {
            "text": "차명",
            "width": 150,
            "sortable": true,
            "dataIndex": "reserved_varchar3",
            "listeners": {},
            "triStateSort": false,
            "align" : "left"
        },
        {
            "text": "영업사원",
            "width": 60,
            "sortable": true,
            "dataIndex": "pm_name",
            "listeners": {},
            "triStateSort": false,
            "align" : "left"
        },
        {
            "text": "실견적가",
            "width": 80,
            "sortable": true,
            "dataIndex": "estiPrice",
            "listeners": {},
            "triStateSort": false,
            "xtype": "numbercolumn", 
            "format":"0,000",
            "align" : "right"
        },
        {
            "text": "입금액",
            "width": 80,
            "sortable": true,
            "dataIndex": "deposit_price",
            "listeners": {},
            "triStateSort": false,
            "xtype": "numbercolumn", 
            "format":"0,000",
            "align" : "right"
        },
        {
            "text": "미수금",
            "width": 80,
            "sortable": true,
            "dataIndex": "receivables",
            "listeners": {},
            "triStateSort": false,
            "xtype": "numbercolumn", 
            "align" : "right",
            renderer : function(value, meta) {
                if(value > 0){
                    meta.style = "background-color:red;color:#ffffff;text-align:right;text-format:0,000";
                }
                value = Ext.util.Format.number(value,'0,000');
                return value;
            },
            "format":"0,000",
        },
        {
            "text": "출금액",
            "width": 80,
            "sortable": true,
            "dataIndex": "withdraw_price",
            "listeners": {},
            "triStateSort": false,
            "xtype": "numbercolumn", 
            "format":"0,000",
            "align" : "right"
        }
        ]
});
