/**
 * Process Name Store
 */

Ext.define('Rfx2.store.company.bioprotech.PcsTplLevel1Store', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	parentCode: params.parentCode
        });

    },
	fields : [ {
		name : 'pcs_code',
		type : "string"
		}, {
			name : 'pcs_name',
			type : "string"
		}, {
			name : 'unique_id',
			type : "string"
		}

	],
	hasNull: false,
	parentCode: 'NULL',
	sorters: [{
        property: 'pcs_name',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/production/pcstpl.do?method=read&pcs_level=1',
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
			console_logs('hasNull',this.hasNull);
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
			this.proxy.setExtraParam('pcs_level', 0);
		}
}
});