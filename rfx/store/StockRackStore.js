/**
 * StockRackStore
 */
Ext.define('Rfx.store.StockRackStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {

        Ext.apply(this, {
        });

    },
	fields : [ 
	    {
			name : 'class_code',
			type : "string"
		}, {
			name : 'class_name',
			type : "string"
		}, {
			name : 'parent_class_code',
			type : "string"
		}, {
			name : 'pallet_no',
			type : "string"
		}, {
			name : 'top_class_code',
			type : "string"
		}
	],
	hasNull: false,
	sorters: [{
        property: 'code_order',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/admin/stdClass.do?method=read',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			
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
