Ext.define('Rfx.view.grid.BomGridHeavy', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    collapsible: true,
    initComponent: function() {

    	this.callParent();


    },
    autoScroll: true,
    columns: [{
    	text: 'LEVEL',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_integer1',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'ID',
    	cls:'rfx-grid-header', 
        dataIndex: 'pl_no',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '자품목구분',
    	cls:'rfx-grid-header', 
        dataIndex: 'assy_sp_code_kr',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '제품군구분',
    	cls:'rfx-grid-header', 
        dataIndex: 'sp_code_prd',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '자재군구분',
    	cls:'rfx-grid-header', 
        dataIndex: 'sp_code_mtrl',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '자품목코드',
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
        align:'left'
    },{
    	text: '사양',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '단위',
    	cls:'rfx-grid-header', 
        dataIndex: 'unit_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BOM확정여부',
    	cls:'rfx-grid-header', 
        dataIndex: 'notify_flag',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '소요량',
    	cls:'rfx-grid-header', 
        dataIndex: 'bm_quan',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '조달구분',
    	cls:'rfx-grid-header', 
        dataIndex: 'request_comment_kr',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '리드타임',
    	cls:'rfx-grid-header', 
        dataIndex: 'lead_time',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '공급사',
    	cls:'rfx-grid-header', 
        dataIndex: 'supplier_name',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '총재고',
    	cls:'rfx-grid-header', 
        dataIndex: 'stock_qty',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '공정템플릿코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'remark_kr',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }]

});
