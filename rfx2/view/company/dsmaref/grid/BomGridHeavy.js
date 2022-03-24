Ext.define('Rfx2.view.company.dsmaref.grid.BomGridHeavy', {
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
        width: 50,
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
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
        align:'center'
    },{
    	text: '품목코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'item_code',
        resizable: true,
        width: 150,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
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
        align:'right',
        renderer: function(value, meta) {
            return Ext.util.Format.number(value, '0,00.00/i');
        }
    },{
    	text: '단가',
    	cls:'rfx-grid-header', 
        // dataIndex: 'sales_price',
        dataIndex: 'contract_price',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right',
        renderer: function(value, meta) {
            return Ext.util.Format.number(value, '0,00/i');
        }
    },{
    	text: '금액',
        cls:'rfx-grid-header', 
        dataIndex: 'total_contract_price',
        // dataIndex: 'total_sales_price',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'right',
        renderer: function(value, meta) {
            return Ext.util.Format.number(value, '0,00/i');
        }
    },{
    	text: '조달',
    	cls:'rfx-grid-header', 
        // dataIndex: 'pcr_div',
        dataIndex: 'standard_flag',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        renderer: function(value, meta) {
            switch(value) {
                case 'R':
                case 'M':
                    return '구매';
                case 'A':
                    return '생산';
                default:
                    return '기타';
            }
            // switch(value) {
            //     case 'PUR':
            //         return '구매';
            //     case 'PRD':
            //         return '생산';
            //     default:
            //         return '기타';
            // }
        }
    },{
    	text: '계정',
    	cls:'rfx-grid-header', 
        dataIndex: 'sp_code',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        renderer: function(value, meta) {
            switch(value) {
                case 'FG':
                    return '제품';
                case 'RM':
                    return '원재료';
                case 'WIP':
                    return '재공품';
                case 'OM':
                    return '부재료';
                case 'SP':
                    return '저장품';
                case 'SFG':
                    return '반제품';
                case 'MD':
                    return '상품';
                
            }
        }
    }
    // ,{
    // 	text: '임가공',
    // 	cls:'rfx-grid-header', 
    //     dataIndex: 'standard_flag',
    //     resizable: true,
    //     width: 70,
    //     autoSizeColumn : true,
    //     style: 'text-align:center',     
    //     align:'center',
    //     renderer: function(value, meta) {
    //         switch(value) {
    //             case 'A':
    //                 return 'ASSY';
    //             case 'R':
    //                 return '자재';
    //             default:
    //                 return '기타';
    //         }
    //     }
    // }
    ,{
    	text: '비고',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_varchar2',
        resizable: true,
        width: 70,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }]

});
