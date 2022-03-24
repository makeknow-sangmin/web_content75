Ext.define('Rfx2.view.grid.MkeItemGridTc', {
    extend: 'Ext.grid.Panel',
    cls : 'rfx-panel',

	autoScroll: true,
	
	
	 
    columns: [{
    	text: '품목',
    	cls:'rfx-grid-header', 
        dataIndex: 'pk',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BL Min(내부)',
    	cls:'rfx-grid-header', 
        dataIndex: 'innerbl_min',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BL Max(내부)',
    	cls:'rfx-grid-header', 
        dataIndex: 'innerbl_max',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'EL Min(내부)',
    	cls:'rfx-grid-header', 
        dataIndex: 'innerel_min',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'EL Max(내부)',
    	cls:'rfx-grid-header', 
        dataIndex: 'innerel_max',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'EL Target',
    	cls:'rfx-grid-header', 
        dataIndex: 'el_goal',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'MKE Size 하한',
    	cls:'rfx-grid-header', 
        dataIndex: 'mk_size_low',
        style: 'text-align:center',     
        align:'center'        
    },{
    	text: 'MKE Size 상한',
    	cls:'rfx-grid-header', 
        dataIndex: 'mk_size_high',
        style: 'text-align:center',     
        align:'center'        
    },{
    	text: 'MKE Size 중간',
    	cls:'rfx-grid-header', 
        dataIndex: 'mk_size_mid',
        style: 'text-align:center',     
        align:'center'        
    }]

});
