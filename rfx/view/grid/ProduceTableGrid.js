Ext.define('Rfx.view.grid.ProduceTableGrid', {
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
    	text: '수주일<br>담당자',
    	cls:'rfx-grid-header', 
        dataIndex: 'col1',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '수주번호',
    	cls:'rfx-grid-header', 
        dataIndex: 'col2',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },
//    {
//    	dataIndex: 'lot_disp', 
//    	text: '수주 | 제품번호',
//    	style: 'text-align:center', 
//    	align: 'center'
//    },
    {
    	text: '고객사<br>제품명(규격)',
    	cls:'rfx-grid-header', 
        dataIndex: 'col3',
        resizable: true,
        autoSizeColumn : true,
        width : 250,
        style: 'text-align:center',     
        align:'center'
    }/*, {
    	text: '제품',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_disp',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }*/, {
		text: '원지<br>원단',
		cls:'rfx-grid-header', 
        dataIndex: 'col4',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        }
//    }, {
//		text: '설명',
//		cls:'rfx-grid-header', 
//        dataIndex: 'description',
//        resizable: true,
//        autoSizeColumn : true,
//        style: 'text-align:center',     
//        align:'center',
//        field: {
//            xtype: 'textfield'
//        }
//    }, {
//		text: gm.getMC('CMD_Wearing','입고'),
//		cls:'rfx-grid-header', 
//        dataIndex: 'gr_date_supplier',
//        resizable: true,
//        autoSizeColumn : true,
//        style: 'text-align:center',     
//        align:'center',
//        field: {
//            xtype: 'textfield'
//        }
    }, {
		text: '01', 
		cls:'rfx-grid-header', 
        dataIndex: 'col5',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',
        width : 160,
        align:'center'
    }, {
    	text: '02',
		cls:'rfx-grid-header', 
        dataIndex: 'col6',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',
        width : 160,
        align:'center'
    }, {
    	text: '03',
		cls:'rfx-grid-header', 
        dataIndex: 'col7',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',
        width : 160,
        align:'center'
    }, {
		text: '04', 
		cls:'rfx-grid-header', 
        dataIndex: 'col8',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '05', 
		cls:'rfx-grid-header', 
        dataIndex: 'col9',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '06', dataIndex: 'pcs060',
		cls:'rfx-grid-header', 
        dataIndex: 'col10',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
		text: '07', 
		cls:'rfx-grid-header', 
        dataIndex: 'col11',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '08', 
		cls:'rfx-grid-header', 
        dataIndex: 'col12',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '09', 
		cls:'rfx-grid-header', 
        dataIndex: 'col13',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '수주수량<br>생산수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'col14',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right'
    },  {
		text: '예정납기일<br>생산완료',
		cls:'rfx-grid-header', 
        dataIndex: 'col15',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        }
    }]
//    ,
//      bbar: getPageToolbar(this.store, true, null, function () {
//                    	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                    }),
//	  listeners: {
//	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
//		 }//endof itemdblclick
//
//	  }//endof listeners
});
