/**
 * 수주정보 상태구분 Store
 */

Ext.define('Mplm.store.InstallStateStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ 'h_reserved102', 'h_reserved103'
	],
	hasNull: false,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
    data : [
        {"h_reserved102":"O"},
        {"h_reserved102":"X"},
        {"h_reserved102":"확인중"},
        {"h_reserved103":"O"},
        {"h_reserved103":"X"},
        {"h_reserved103":"확인중"}
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