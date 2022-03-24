Ext.define('Rfx.view.grid.PaintPlanDetailGridHeavy', {
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
    	text: '프로젝트',
    	cls:'rfx-grid-header', 
        dataIndex: 'buyer_pj_code',
//        resizable: true,
//        autoSizeColumn : true,
        width: 80,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '도장SPEC',
    	cls:'rfx-grid-header', 
        dataIndex: 'paint_spec',
//        resizable: true,
//        autoSizeColumn : true,
        width: 80,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '구분자',
    	cls:'rfx-grid-header', 
        dataIndex: 'lot_no',
//        resizable: true,
//        autoSizeColumn : true,
        width: 80,
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
    	text: '총수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_quan',
//        resizable: true,
//        autoSizeColumn : true,
        width: 60,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '총중량',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_double4',
//        resizable: true,
//        autoSizeColumn : true,
        width: 80,
        style: 'text-align:center',     
        align:'center'
    }
//    ,{
//    	text: '요청일자',
//    	cls:'rfx-grid-header', 
//        dataIndex: 'create_date',
////        resizable: true,
////        autoSizeColumn : true,
//        width: 120,
//        style: 'text-align:center',     
//        align:'center'
//    }
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
