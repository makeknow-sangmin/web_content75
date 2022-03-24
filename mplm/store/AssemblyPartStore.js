/**
 * Process Name Store
 */

Ext.define('Mplm.store.AssemblyPartStore', {
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
			name: 'id', 
			type: "int" 
		},{
			name : 'unique_id',
			type : "string"
		},{
			name : 'pl_no',
			type : "string"
		}, {
			name : 'sp_code',
			type : "string"
		}, {
			name : 'item_name',
			type : "string"
		}, {
			name : 'description_src',
			type : "string"
		}, {
			name : 'specification',
			type : "string"
		}, {
			name : 'bm_quan',
			type : "int"
		}, {
			name: 'srcahd_uid',
			type: 'int'
		}

	],
	hasNull: false,
	sorters: [{
        property: 'sp_code',
        direction: 'desc'
    }],
    pageSize:100,
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/production/schdule.do?method=readAssyTop',
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
			// if(vCompanyReserved4 == 'DABP01KR') {
			// 	if(records != null && records.length > 0) {
			// 		for(var i=0; i<records.length; i++) {
			// 			var sp_code = records[i].get('sp_code');
			// 			// console_logs('>>> spCode', sp_code);
			// 			switch(sp_code) {
			// 				case 'R':
			// 				records[i].set('sp_code_kr', '원지');
			// 				break;
			// 				case 'O':
			// 				records[i].set('sp_code_kr', '원단');
			// 				break;
			// 				case 'K':
			// 				records[i].set('sp_code_kr', '부자재');
			// 				break;
			// 			}
			// 		}
			// 	}
			// }
//			if(this.hasNull) {
//				
//				var blank ={
//						systemCode: '',
//						codeName: '',
//						codeNameEn: '',
//						codeOrder: -1
//					};
//					
//					this.add(blank);
//			}

		},
		beforeload: function(){
		}
}
});