//Ext.override(Ext.grid.plugin.CellEditing, {
//        startEdit: function(record, columnHeader) {
//            if (columnHeader && columnHeader.isCheckerHd) {
//                return false;
//            }
//            return this.callOverridden(arguments);
//        }
//    });

Ext.define('Rfx.view.grid.RecvDateGrid', {
    extend: 'Ext.grid.Panel',
//    requires: [
//           	   'Ext.grid.plugin.CellEditing'
//	     	],
//    xtype: 'cell-editing',
    cls : 'rfx-panel',
//    initComponent: function() {
//
//    	
//    	this.callParent();
//
//
//    },
	autoScroll: true,
    columns: [{
    	text: gm.getMC('CMD_Order_Date', '등록일자'),
    	cls:'rfx-grid-header', 
        dataIndex: 'regist_date',
//        resizable: true,
//        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품목코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
//        resizable: true,
//        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품명',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_name',
//        resizable: true,
//        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '규격',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
//        resizable: true,
//        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '발주일수',
    	cls:'rfx-grid-header', 
        dataIndex: 'gap',
//        resizable: true,
//        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'        
    }]

});
