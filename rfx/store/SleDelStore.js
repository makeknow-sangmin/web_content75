/**
 * Process Name Store
 */
Ext.define('Rfx.store.SleDelStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [ {
			name : 'item_name',    // 품명t
			type : "string"
		}, 
		{
			name : 'origin_qty',    
			type : "string"
		},
		{
			name : 'h_reserved3',    
			type : "string"
		},
		{
			name : 'sales_price',    
			type : "string"
		},
				{
			name : 'specification',    
			type : "string"
		},
				{
			name : 'description',    
			type : "string"
		},
		{
			name : 'reserved_double1',    
			type : 'number'
		},
		{
			name : 'reserved_double2',    
			type : "number"
		},
		{
			name : 'pj_name',    
			type : "string"
		},
	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url: CONTEXT_PATH + '/sales/delivery.do?method=readSleDel',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : true
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			console_logs('store');
			if(this.hasNull) {
				
				var blank ={
						systemCode: '',
						codeName: '[]',
						codeNameEn: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});