/**
 * PurCode Store
 */
Ext.define('Rfx.store.PurCodeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	parentCode: params.parentCode,
        	hasNull: params.hasNull,
        	hasOwn: params.hasOwn
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
			
//			console_logs('records', records);
			
			if(this.hasNull) {
				
				var blank ={
					system_code: 'NO',
					code_name_kr: '선택',
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
			
			/*if(this.parentCode = "POP1_PAPER_TYPE"){
			var obj = Ext.getCmp('commonPaperType');
			//console_log('objType', objType);
			if(hasOwn = true){
				obj = Ext.getCmp('item_name');
				console_log('구매지종', obj);
			}else if(hasOwn = false){
				obj = Ext.getCmp('commonPaperType'); 
				console_log('공통지종', obj);
			}
			
			console_log(obj);
			if(obj!=null) {
				var val = obj.getValue();
				console_log(val);
				if(val!=null) {
					var enValue = Ext.JSON.encode(val);
					console_log("queryUtf8:"+enValue);
					this.getProxy().setExtraParam('queryUtf8', enValue);
				}else {
					this.getProxy().setExtraParam('queryUtf8', '');
				}
			}
			
		}*/
		}// end of hasOwn if
}
});
