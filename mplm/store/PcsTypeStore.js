/**
 * PcsLevel Store(0:대공정, 1:소공정)
 */

Ext.define('Mplm.store.PcsTypeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	pcs_type: params.pcs_type
            // some else customization
        });

    },
	fields : [ {
		name : 'systemCode',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'codeNameEn',
			type : "string"
		}

	],
//	hasNull: false,
	useYn: '',
	sorters: [{
        property: 'codeOder',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=read&parentCode=PcsType',
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
						codeName: 'ALL',
						codeNameEn: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
			if(this.pcs_level == '0') {
				this.getProxy().setExtraParam('pcs_level', '0');
			} else if(this.useYn == '1') {
				this.getProxy().setExtraParam('pcs_level', '1');
			}
		}
}
});