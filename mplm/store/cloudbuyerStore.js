/**
 * Process Name Store
 */

Ext.define('Mplm.store.cloudbuyerStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [
		{
			name : 'id',
			type : "string"
		},
		{
			name : 'unique_id',
			type : "string"
		}, {
			name : 'wa_code',
			type : "string"
		}, {
			name : 'wa_name',
			type : "string"
		}, {
			name : 'president_name',
			type : "string"
		}, {
			name : 'sales_email1',
			type : "string"
		}, {
			name : 'sales_fax1',
			type : "string"
		}, {
			name : 'sales_hp1',
			type : "string"
		}, {
			name : 'sales_name1',
			type : "string"
		}, {
			name : 'sales_tel1',
			type : "string"
		}, {
			name : 'biz_no',
			type : "string"
		}, {
			name : 'address_1',
			type : "string"
		}, {
			name : 'biz_category',
			type : "string"
		}, {
			name : 'biz_condition',
			type : "string"
		}
	],
	hasNull: true,
	sorters: [{
        property: 'wa_code',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/sales/buyer.do?method=query',
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
						id: '',
						unique_id: '',
						wa_code: ' ',
						wa_name: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});