/**
 * Supast Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Mplm.store.PrinterListStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // Ext.apply(this, {
        // 	role_code: params.role_code
        // });

    },
    fields: [     
     		{ name: 'system_code', type: "string" }
     		,{ name: 'code_name_kr', type: "string"  }
     		,{ name: 'code_name_en', type: "string"  }
     	  	  ],
 	sorters: [{
         property: 'system_code',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/admin/code/code.do?method=getPrinterlist',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: true
     },
     listeners: {
			
			load: function(store, records, successful,operation, options) {
					
					var blank ={
							system_code: '',
							code_name_kr: '미지정(디폴트)',
							code_name_en: ''
						};
						
						this.add(blank);

						


			},//endofload
			beforeload: function(){
				//this.getProxy().setExtraParam('pcs_code', this.pcs_code);
				//this.getProxy().setExtraParam('role_code', this.role_code);

//				console_logs('Mplm.store.SupastStore beforeload');
//				console_log(this.cmpName);
//				var obj = Ext.getCmp('supplier_information'); 
//				console_log('else문', obj);
//				if(obj!=null) {
//					console_logs('supast beforeload', obj);
//					var val = obj.getValue();
//					console_log(val);
//					if(val!=null) {
//						var enValue = Ext.JSON.encode(val);
//						console_log("queryUtf8:"+enValue);
//						this.getProxy().setExtraParam('queryUtf8', enValue);
//					}else {
//						this.getProxy().setExtraParam('queryUtf8', '');
//					}
//				} else {
//					console_logs('supast beforeload', 'obj is null');
//				}
			
			}
		}//endoflistner
});