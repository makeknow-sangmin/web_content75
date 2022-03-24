Ext.define('Rfx.view.grid.ListSubVersion', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {

    	
    	this.callParent();


    },
    autoScroll: true,
    columns: [/*{
    	text: '분류코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'class_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },*/{
    	text: 'uid',
    	cls:'rfx-grid-header', 
        dataIndex: 'id',
        hidden : true,
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품목코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        flex : 1,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품명',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_name',
        resizable: true,
        flex : 1,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '규격',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        //autoSizeColumn : true,
        width: 60,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '주문수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'quan',
        resizable: true,
        //autoSizeColumn : true,
        width: 60,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '변경수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'bm_quan',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }
]
});
