/**
 * Gen Store
 */

Ext.define('Mplm.store.GenCodeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	gubunType: params.gubunType
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
	hasNull: false,
	gubunType: '',
	sorters: [{
        property: 'systemCode',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=read',
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
						systemCode: '-1',
						codeName: '-미지정-',
						codeNameEn: 'NOT-DEFINED'
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
			if(this.gubunType == null){
				this.getProxy().setExtraParam('parentCode','');
			}else{
				this.getProxy().setExtraParam('parentCode', this.gubunType);
			}
		}
}
});