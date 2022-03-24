Ext.define('Rfx.view.grid.RfidpathTemplateGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {

    	
    	this.callParent();


    },
    autoScroll: true,
    columns : [{
        "text":"템플리트 코드",
        "width":"50%","sortable":true,
        "dataIndex":"systemCode",
        "listeners":{},
        "triStateSort":false},
        {"text":"템프리트 이름",
        "width":"50%","sortable":true,
        "dataIndex":"codeName",
        "listeners":{},"triStateSort":false}
    ]
});
