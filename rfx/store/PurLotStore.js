/**
 * PurLot Store  //Lot 콤보에 cartmap 정보 가져오기(PPO1_CLD)
 */
Ext.define('Rfx.store.PurLotStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	parentCode: params.parentCode,
        	standard_flag: params.standard_flag,
        	storeType: params.storeType,
        	hasNull: params.hasNull
        });

    },
	fields : [ 
	    {
			name : 'CODE',
			type : "string"
		}, {
			name : 'CODE_NAME_KR',
			type : "string"
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
        url: CONTEXT_PATH + '/purchase/request.do?method=read&route_type=P',
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
					system_code: '',
					code_name_kr: '',
					codeOrder: -1
				};
				this.add(blank);
			}

		},
		beforeload: function(){
			if(this.parentCode!=null && this.parentCode!='' && this.parentCode!=undefined) {
				this.proxy.setExtraParam('parentCode', this.parentCode);
				
				this.proxy.setExtraParam('useYn', 'Y');
			}
			
			if(this.standard_flag!=null && this.standard_flag!='' && this.standard_flag!=undefined) {
				
				this.proxy.setExtraParam('standard_flag', this.standard_flag);
				this.proxy.setExtraParam('useYn', 'Y');
				this.proxy.setExtraParam('storeType', this.storeType);
			}
		}
}
});
