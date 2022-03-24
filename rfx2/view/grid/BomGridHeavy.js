Ext.define('Rfx2.view.grid.BomGridHeavy', {
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
    columns: [{
    	text: 'LEVEL',
    	cls:'rfx-grid-header', 
        dataIndex: 'coord_key1',
        width: 50,
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        renderer: function(value){
            return value - 1;
        }
    },{
    	text: 'ID',
    	cls:'rfx-grid-header', 
        dataIndex: 'pl_no',
        width: 50,
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품목코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        width: 150,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품명',
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
    	text: '총재고',
    	cls:'rfx-grid-header', 
        dataIndex: 'stock_qty',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }]

});
