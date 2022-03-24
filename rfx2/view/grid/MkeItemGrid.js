Ext.define('Rfx2.view.grid.MkeItemGrid', {
    extend: 'Ext.grid.Panel',
    cls : 'rfx-panel',

	autoScroll: true,
	
	
	 
    columns: [{
    	text: '개정일',
    	cls:'rfx-grid-header', 
        dataIndex: 'revDate',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '품목',
    	cls:'rfx-grid-header', 
        dataIndex: 'pk',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '기준길이',
    	cls:'rfx-grid-header', 
        dataIndex: 'f_Length',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '단위',
    	cls:'rfx-grid-header', 
        dataIndex: 'unit',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '권선방향',
    	cls:'rfx-grid-header', 
        dataIndex: 'wd_Direction',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'Ground',
    	cls:'rfx-grid-header', 
        dataIndex: 'ground',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'Add_Sticker',
    	cls:'rfx-grid-header', 
        dataIndex: 'add_Sticker',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'Start_Tape',
    	cls:'rfx-grid-header', 
        dataIndex: 'start_Tape',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'End_Tape',
    	cls:'rfx-grid-header', 
        dataIndex: 'end_Tape',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '마무리위치',
    	cls:'rfx-grid-header', 
        dataIndex: 'finishing',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '찍힘Tape',
    	cls:'rfx-grid-header', 
        dataIndex: 'printed',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'Spool',
    	cls:'rfx-grid-header', 
        dataIndex: 'sppk',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'Double_Tape',
    	cls:'rfx-grid-header', 
        dataIndex: 'double_tape',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BL Min(고객)',
    	cls:'rfx-grid-header', 
        dataIndex: 'custbl_min',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'BL Max(고객)',
    	cls:'rfx-grid-header', 
        dataIndex: 'custbl_max',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'EL Min(고객)',
    	cls:'rfx-grid-header', 
        dataIndex: 'custel_min',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: 'EL Max(고객)',
    	cls:'rfx-grid-header', 
        dataIndex: 'custel_max',
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
    	text: '실제Size',
    	cls:'rfx-grid-header', 
        dataIndex: 'rsize',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '고객Size 하한',
    	cls:'rfx-grid-header', 
        dataIndex: 'cust_size_low',
        style: 'text-align:center',     
        align:'center'
    },{
    	text: '고객Size 상한',
    	cls:'rfx-grid-header', 
        dataIndex: 'cust_size_high',
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
