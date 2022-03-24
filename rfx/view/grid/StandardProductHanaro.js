Ext.define('Rfx.view.grid.StandardProductHanaro', {
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
    	text: '제품코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '제품명',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_name',
        resizable: true,
        flex : 1,
        style: 'text-align:center',     
        align:'center'
    }/*,{
    	text: 'REV.',
    	cls:'rfx-grid-header', 
        dataIndex: 'alter_reason',
        resizable: true,
        //autoSizeColumn : true,
        width: 60,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '등록자',
    	cls:'rfx-grid-header', 
        dataIndex: 'creator',
        resizable: true,
        //autoSizeColumn : true,
        width: 60,
        style: 'text-align:center',     
        align:'center'
    }*/,{
    	text: '규격',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: gm.getMC('CMD_Order_Date', '등록일자'),
    	cls:'rfx-grid-header', 
        dataIndex: 'create_date',
        resizable: true,
        //autoSizeColumn : true,
        width: 120,
        style: 'text-align:center',     
        align:'center'
    }
]
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
