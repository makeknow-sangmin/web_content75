/**
 * CMM_CODE Store
 */
Ext.define('Rfx.store.CmmCodeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	parentCode: params.parentCode,
        	hasNull: params.hasNull
        });

    },
	fields : [ 
	    {
			name : 'CODE',
			type : "string"
		}, {
			name : 'CODE_NAME',
			type : "string"
		}, {
			name : 'SORT_SEQUENCE',
			type : "int"
		}

	],
	parentCode: '',
	hasNull: true,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/code/code.do?method=getCmmCode',
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

		},
		beforeload: function(){
			if(this.parentCode!=null && this.parentCode!='' && this.parentCode!=undefined) {
				this.proxy.setExtraParam('parentCode', this.parentCode);
			}
		}
}
});
