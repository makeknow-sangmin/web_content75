//Ext.override(Ext.grid.plugin.CellEditing, {
//        startEdit: function(record, columnHeader) {
//            if (columnHeader && columnHeader.isCheckerHd) {
//                return false;
//            }
//            return this.callOverridden(arguments);
//        }
//    });

Ext.define('Rfx.view.grid.ProductTableGridHeavySub', {
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
    	text: '조달구분',
    	cls:'rfx-grid-header', 
        dataIndex: 'request_comment',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '제품구분',
    	cls:'rfx-grid-header', 
        dataIndex: 'sp_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품목코드',
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
    	text: 'TYPE',
    	cls:'rfx-grid-header', 
        dataIndex: 'description',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '사양',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '상세사양',
    	cls:'rfx-grid-header', 
        dataIndex: 'comment',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '단위',
    	cls:'rfx-grid-header', 
        dataIndex: 'unit_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '단위중량',
    	cls:'rfx-grid-header', 
        dataIndex: 'unit_mass',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '단가',
    	cls:'rfx-grid-header', 
        dataIndex: 'sales_price',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '예약수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'stock_qty_useful',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '재고수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'stock_qty',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '적정재고수량',
    	cls:'rfx-grid-header', 
        dataIndex: 'stock_qty_safe',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '공정템플릿코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'remark',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '구매품여부',
    	cls:'rfx-grid-header', 
        dataIndex: 'buyer_request_flag',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BOM확정여부',
    	//xtype:  'textfield',
    	dataIndex: 'bom_flag',
        field: {
			xtype:  'textfield'
        }
    },{
    	text: 'BOM수량',
    	//xtype:  'textfield',
    	dataIndex: 'bm_quan',
        field: {
			xtype:  'numberfield'
        }
    },{
    	text: 'ID',
    	//xtype:  'textfield',
    	dataIndex: 'hier_pos',
        field: {
			xtype:  'textfield'
        }
    },{
    	text: 'LEVEL',
    	//xtype:  'textfield',
    	dataIndex: 'reserved_integer1',
        field: {
			xtype:  'textfield',
			value: '1'
        }
        
    }]

//,{
//    	text: '조달구분',
//        dataIndex: 'pcr_div',
//        field: {
//        	xtype:  'combo',
//        	displayField:   'codeName',
//			store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'PROCURE_TYPE'}),
//			valueField : 'systemCode',
//        }
//    }
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
