/**
 * CMM_CODE Store
 */
Ext.define('Rfx.store.SalesNameStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
//        Ext.apply(this, {
//        	parentCode: params.parentCode
//        });

    },
	fields : [ 
	    {
			name : 'unique_id',
			type : "int"
		}, {
			name : 'sales_name',
			type : "string"
		}, {
			name : 'combst_uid',
			type : "int"
		}

	],
//	parentCode: '',
	hasNull: true,
	sorters: [{
        property: 'unique_id',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/purchase/supplier.do?method=suphst',
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
			
//			if(this.hasNull) {
//				
//				var blank ={
//					systemCode: '------',
//					codeName: '전체',
//					codeOrder: -1
//				};
//				this.add(blank);
//			}

		},
		beforeload: function(){
//		 	var projectType = Ext.getCmp('projectHistory-projectType').getValue();
//		 	var oem = Ext.getCmp('projectHistory-SearchOem').getValue();
//		 	var modelname = Ext.getCmp('projectHistory-SearchCarmodel').getValue();
//		 
//			this.proxy.setExtraParam('oem', oem);
//			this.proxy.setExtraParam('modelname', modelname);
//			this.proxy.setExtraParam('projectType', projectType);
		}
}
});
