/**
 * Process Name Store
 */

Ext.define('Mplm.store.MonthStore', {
	extend : 'Ext.data.Store',
	autoLoad : true,
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	parentCode: params.parentCode,
        	cmpName: params.cmpName
        });

    },
	fields : [ {
		name : 'systemCode',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'code_name_en',
			type : "string"
		}, {
			name : 'code_order',
			type : "int"
		}

	],
	hasNull: false,
	parentCode: 'NULL',
	sorters: [{
        property: 'code_order',
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
		autoLoad : true
		
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			console_logs('hasNull',this.hasNull);
			// if(this.hasNull) {
			// 	var blank ={
			// 			systemCode: '',
			// 			codeName: '',
			// 			codeNameEn: ''
			// 		};
			// 	this.add(blank);
			// }

		},
		beforeload: function(){
			this.proxy.setExtraParam('parentCode', this.parentCode);
			console_logs(this.cmpName);
			if(this.cmpName!=null&&this.cmpName.length>0){
				var obj = Ext.getCmp(this.cmpName);
				console_logs(obj);
					if(obj!=null) {
						var val = obj.getValue();
						if(val!=null) {
							var enValue = Ext.JSON.encode(val);
								this.getProxy().setExtraParam('query', enValue);

						}else {
							this.getProxy().setExtraParam('codeName', '');
						}//endofelse
					}//endofif
			}
		}//endofbeforeload
	}//endoflistener
			
});