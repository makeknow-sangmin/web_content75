/**
 * IsComplished Store
 */

Ext.define('Mplm.store.DistinctPjName', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {
			name : 'pj_name',
			type : "string"
		}
	],
	hasNull: true,
	sorters: [{
        property: 'systemCode',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/production/schdule.do?method=getDataDistinct&gubun=project.pj_name',
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
				// var blank ={
				// 		systemCode: 'R',
				// 		codeName: '설계요청',
				// 		codeNameEn: ''
				// 	};
					
				// 	this.add(blank);
			}

		},
		beforeload: function(){
			
		}
}
});