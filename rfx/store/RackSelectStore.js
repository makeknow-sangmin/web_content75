/**
 * CMM_CODE Store
 */
Ext.define('Rfx.store.RackSelectStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	parentCode: params.parentCode,
        	hasNull: params.hasNull
        });

    },
	fields : [ 
	    {
			name : 'division_code',
			type : "string"
		}, {
			name : 'division_name',
			type : "string"
		}

	],
	parentCode: '',
	hasNull: true,
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/stdClass.do?method=readMaterial&identification_code=RC',
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
			
//			console_logs('records', records);
			
			if(this.hasNull) {
				
				var blank ={
					code: '',
					codeName: '[전체]',
					codeOrder: -1
				};
				this.add(blank);
			}

		}
}
});
