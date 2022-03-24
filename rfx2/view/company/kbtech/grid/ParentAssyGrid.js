Ext.define('Rfx2.view.company.kbtech.grid.ParentAssyGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    collapsible: true,
    initComponent: function() {

    	this.callParent();

    },
    autoScroll: true,
    columns: [
    {
        text: 'LEVEL',
        cls:'rfx-grid-header',
        dataIndex: 'reserved_integer1',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',
        align:'center'
    },
    {
    	text: '품번',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        width: 150,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '규격',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_name',
        resizable: true,
        width: 200,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '사양',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        width: 200,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '단위',
    	cls:'rfx-grid-header', 
        dataIndex: 'unit_code',
        resizable: true,
        width: 50,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '단가',
    	cls:'rfx-grid-header', 
        dataIndex: 'sales_price',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '가격',
    	cls:'rfx-grid-header', 
        dataIndex: 'total_sales_price',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '비고',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_varchar2',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }]

});
