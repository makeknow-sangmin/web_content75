Ext.define('Rfx2.view.grid.MkeTypeGrid', {
    extend: 'Ext.grid.Panel',
    cls : 'rfx-panel',

	autoScroll: true,
    columns: [{
    	text: '세금선코드',
    	cls:'rfx-grid-header', 
        dataIndex: 'class_name',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'Type',
    	cls:'rfx-grid-header', 
        dataIndex: 'class_type',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'um φ',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_double1',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BL Min(gr)',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_double2',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BL Max(gr)',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_varchar3',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'E/L  Min(%)',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_double4',
        style: 'text-align:center',     
        align:'center'        
    },{
    	text: 'E/L Max(%)',
    	cls:'rfx-grid-header', 
        dataIndex: 'reserved_double5',
        style: 'text-align:center',     
        align:'center'        
    }]

});
