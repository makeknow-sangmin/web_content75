/**
 * Process Name Store
 */
Ext.define('Rfx.store.ExcelSetStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [{
			name : 'code_name_kr',  
			type : "string"
		}, 
		{
			name : 'excel_set',    
			type : "string"
		}
	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url: CONTEXT_PATH + '/dispField.do?method=readExcelSet',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : true
	},
	listeners: {
		// load: function(store, records, successful,operation, options) {
		// 	console_logs('store');
		// 	if(this.hasNull) {
				
		// 		var blank ={
		// 				systemCode: '',
		// 				codeName: '[]',
		// 				codeNameEn: ''
		// 			};
					
		// 			this.add(blank);
		// 	}

		// },
		// beforeload: function(){
		// }
}
});