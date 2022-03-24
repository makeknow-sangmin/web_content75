Ext.define('Rfx.view.grid.AccountsReceivableGrid', {
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
    	text: '고객사명',
    	cls:'rfx-grid-header', 
        dataIndex: 'wa_name',
//        resizable: true,
//        autoSizeColumn : true,
        width: 150,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '담당자',
    	cls:'rfx-grid-header', 
        dataIndex: 'site_manager_name',
//        resizable: true,
//        autoSizeColumn : true,
        width: 120,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '담당자 번호',
    	cls:'rfx-grid-header', 
        dataIndex: 'site_manager_tel_no',
//        resizable: true,
//        autoSizeColumn : true,
        width: 150,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '종목',
    	cls:'rfx-grid-header', 
        dataIndex: 'biz_category',
//        resizable: true,
//        autoSizeColumn : true,
        width: 150,
        style: 'text-align:center',     
        align:'left'
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
