Ext.define('Rfx.view.grid.ProductTableGridHeavy', {
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
    	text: 'PARTLIST NO',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품명',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_name',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'REV.',
    	cls:'rfx-grid-header', 
        dataIndex: 'alter_reason',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'SIGN / APPR',
    	cls:'rfx-grid-header', 
        dataIndex: 'comment',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'REF.DRWG.NO',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'MODEL',
    	cls:'rfx-grid-header', 
        dataIndex: 'model_no',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },
    {
    	text: 'DATE OF ISSUE',
    	cls:'rfx-grid-header', 
        dataIndex: 'create_date',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }]
//    ,
//      bbar: getPageToolbar(this.store, true, null, function () {
//                    	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                    }),
//	  listeners: {
//	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
//	    	 console_logs('여기오냐?',record);
//		 }//endof itemdblclick
//
//	  }//endof listeners
});
