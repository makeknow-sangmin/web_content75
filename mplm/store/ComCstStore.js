/**
 * CMM_CODE Store
 */
Ext.define('Mplm.store.ComCstStore', {
	extend : 'Ext.data.Store',
	autoLoad:true,
	initComponent: function(params) {
        Ext.apply(this, {
        	parentCode: params.parentCode,
        	hasNull: params.hasNull
        });

    },
	fields : [ 
		{
			name: 'unique_id',
			type: 'string'
		},
	    {
			name : 'division_code',
			type : "string"
		}, {
			name : 'division_name',
			type : "string"
		}, {
			name : 'wa_code',
			type : "string"
		}

	],
	parentCode: '',
	hasNull: true,
	sorters: [{
        property: 'division_name',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/comcst.do?method=read',
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
					division_code: '',
					division_name: '[전체]',
					wa_code: -1
				};
				// this.add(blank);
			}

		}
}
});
