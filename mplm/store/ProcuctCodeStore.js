/**
 * Procuct Code Store
 */

Ext.define('Mplm.store.ProcuctCodeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
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
		}, {
			name : 'unique_id',
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'systemCode',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/sales/poreceipt.do?method=productCode',
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
						unique_id:'',
						systemCode: '',
						codeName: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
			var obj = Ext.getCmp(this.cmpName); 
			if(obj!=null) {
				var val = obj.getValue();
				console_log(val);
				if(val!=null) {
					var enValue = Ext.JSON.encode(val);
					console_log(enValue);
					this.getProxy().setExtraParam('queryUtf8', enValue);
				}else {
					this.getProxy().setExtraParam('queryUtf8', '');
				}
			}
		}
}
});