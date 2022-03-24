Ext.define('Rfx2.view.company.hanjung.grid.BomGridHeavy', {
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
    	text: '레벨',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_integer1',
        width: 50,
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right'
//        renderer: function(value){
//            return value - 1;
//        }
    },{
    	text: '순번',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_integer3',
        width: 50,
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right'
    },{
    	text: '품목코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        width: 150,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '품명',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_name',
        resizable: true,
        width: 200,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '규격',
    	cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        width: 200,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '단위',
    	cls:'rfx-grid-header', 
        dataIndex: 'unit_code',
        resizable: true,
        width: 50,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '소요량',
    	cls:'rfx-grid-header', 
        dataIndex: 'bm_quan',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right'
    },{
    	text: '단가',
    	cls:'rfx-grid-header', 
        dataIndex: 'sales_price',
        resizable: true,
        width: 90,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right',
        xtype : 'numbercolumn',  
        format: "0,000", 
    },{
    	text: '가격',
    	cls:'rfx-grid-header', 
        dataIndex: 'total_sales_price',
        resizable: true,
        width: 90,
        autoSizeColumn : true,
        style: 'text-align:center',  
        xtype : 'numbercolumn',  
        format: "0,000", 
        align:'right'
    },{
    	text: '조달',
    	cls:'rfx-grid-header', 
        dataIndex: 'pcr_div',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left',
        renderer: function(value, meta) {
            switch(value) {
                case 'PUR':
                    return '구매';
                case 'PRD':
                    return '생산';
                default:
                    return '기타';
            }
        }
    },{
    	text: '계정',
    	cls:'rfx-grid-header', 
        dataIndex: 'sg_code',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '임가공',
    	cls:'rfx-grid-header', 
        dataIndex: 'standard_flag',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left',
        renderer: function(value, meta) {
            switch(value) {
                case 'A':
                    return 'ASSY';
                case 'R':
                    return '자재';
                default:
                    return '기타';
            }
        }
    },{
    	text: '비고',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_varchar2',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'left'
    }],

    viewConfig: {
        getRowClass: function(record, index) {
            var c = record.get('reserved_integer1');
            if (c == '1') {
                var standard_flag =  record.get('standard_flag');
                if(standard_flag == 'R') {
                    return 'green-row';
                } else { 
                    return 'yellow-row';
                }
            } 
        }
    },

});
