Ext.define('Rfx.view.grid.PurchseRequestGridHeavy', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {

    	
    	this.callParent();


    },
    autoScroll: true,
    columns: [{
    	text: '진행상태',
    	cls:'rfx-grid-header', 
        dataIndex: 'state',
//        resizable: true,
//        autoSizeColumn : true,
        width: 80,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'PO NO.',
    	cls:'rfx-grid-header', 
        dataIndex: 'po_no',
//        resizable: true,
//        autoSizeColumn : true,
        width: 120,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'LOT NO.',
    	cls:'rfx-grid-header', 
        dataIndex: 'name',
//        resizable: true,
//        autoSizeColumn : true,
        width: 150,
        style: 'text-align:center',     
        align:'center'
    }/*,{
    	text: '내용',
    	cls:'rfx-grid-header', 
        dataIndex: 'content',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }*/,{
    	text: '총건수',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_quan',
//        resizable: true,
//        autoSizeColumn : true,
        width: 60,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '요청자',
    	cls:'rfx-grid-header', 
        dataIndex: 'creator',
//        resizable: true,
//        autoSizeColumn : true,
        width: 80,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '요청일자',
    	cls:'rfx-grid-header', 
        dataIndex: 'create_date',
//        resizable: true,
//        autoSizeColumn : true,
        width: 120,
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
