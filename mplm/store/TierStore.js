/**
 * 티어 스토어
 */

Ext.define('Mplm.store.TierStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ 'tier' ],
	hasNull: false,
	sorters: [{
        property: 'tier',
        direction: 'ASC'
    }],
    data : [
        {"tier":1},
        {"tier":2},
        {"tier":3}
    ]
	/*proxy : {
		type : 'ajax',
		url : CONTEXT_PATH +  '/code.do?method=read&parentCode=SRO1_CLD_STATE',
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
						systemCode: '',
						codeName: '',
						codeNameEn: '',
						//codeOrder: -1
					};
					
					this.add(blank);
			//}

		},
		beforeload: function(){
		}
}*/
});