var isHiddenNation = vCompanyReserved4 == 'BIOT01KR' ? false : true;
var isHiddenAddress = vCompanyReserved4 == 'BIOT01KR' ? true : false;

Ext.define('Rfx.view.grid.AccountPayableGrid', {
    extend : 'Ext.grid.Panel',
    requires : [
        'Ext.grid.feature.Grouping'
    ],
    cls : 'rfx-panel',
    initComponent: function () {
        this.callParent();
    },
    autoScroll   : true,
    columns      : [
        {
            "text"     : "공급사명",
            "width"    : 100,
            "sortable": true,
            "dataIndex": "supplier_name",
            "style"    : 'text-align:center',
            "listeners"   : {},
            "triStateSort": false,

        },
        {
            "text"     : "사업자등록번호",
            "width"    : 100,
            "sortable": true,
            "dataIndex": "business_registration_no",
            "style"    : 'text-align:center',
            "listeners": {}, "triStateSort": false
        },
        {
            "text"        : "대표자명",
            "width"       : 80,
            "sortable"    : true,
            "style"       : 'text-align:center',
            "dataIndex"   : "president_name",
            "listeners"   : {},
            "triStateSort": false
        },
        {
            "text"        : "국가",
            "width"       : 100,
            "sortable"    : true,
            "style"       : 'text-align:center',
            "dataIndex"   : "group_type",
            "listeners"   : {},
            "triStateSort": false,
            hidden : isHiddenNation
        },
        {
            "text"        : "소재지",
            "width"       : 200,
            "sortable"    : true,
            "style"       : 'text-align:center',
            "dataIndex"   : "address_1",
            "listeners"   : {},
            "triStateSort": false,
            hidden : isHiddenAddress
        },
        {
            "text"        : "휴대폰번호",
            "width"       : 80,
            "sortable"    : true,
            "style"       : 'text-align:center',
            "dataIndex"   : "sales_person1_mobilephone_no",
            "listeners"   : {},
            "triStateSort": false
        },
        {
            "text"        : "이름",
            "width": 80,
            "style": 'text-align:center',
            "sortable"    : true,
            "dataIndex": "sales_person1_name",
            "listeners"   : {},
            "triStateSort": false
        },
        {
            "text"     : "회사코드",
            "style": 'text-align:center',
            "width"    : 80,
            "sortable": true,
            "dataIndex": "supplier_code",
            "listeners": {},
            "triStateSort": false
        }]
});
