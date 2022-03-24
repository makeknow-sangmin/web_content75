Ext.define('Rfx.view.grid.MaterialSpGrid', {
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
    	text: '장비코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'mchn_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '장비명',
    	cls:'rfx-grid-header', 
        dataIndex: 'name_ko',
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
    	text: '제조원',
    	cls:'rfx-grid-header', 
        dataIndex: 'maker',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '위치',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_varchar4',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }
    
    // ,{
    // 	text: '제조일자',
    // 	cls:'rfx-grid-header', 
    //     dataIndex: 'make_date',
    //     resizable: true,
    //     //autoSizeColumn : true,
    //     width: 120,
    //     style: 'text-align:center',     
    //     align:'center'
    // }
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
