/**
 * 수주정보 상태구분 Store
 */

Ext.define('Mplm.store.ProductionWorkTypeStore', {
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
			name : 'codeOrder',
			type : "int"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH +  '/code.do?method=read&parentCode=SRO1_PRD_DAYNIGHT',
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
			
			//if(this.hasNull) {
				
				var blank ={
						unique_id:-1,
						systemCode: '',
						codeName: '전체',
						codeNameEn: '',
						//codeOrder: -1
					};
					
					// this.add(blank);
			//}

		},
		beforeload: function(){
		}
}
});