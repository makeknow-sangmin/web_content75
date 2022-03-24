/**
 * Process Name Store
 */

Ext.define('Mplm.store.CodeErpTabStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	useYn: params.useYn
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
        url: CONTEXT_PATH + '/code.do?method=read&parentCode=ERP1_TAB',
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
			if(this.useYn == 'N') {
				this.getProxy().setExtraParam('useYn', 'N');
			} else if(this.useYn == 'Y') {
				this.getProxy().setExtraParam('useYn', 'Y');
			}
		}
}
});