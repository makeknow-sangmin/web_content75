/**
 * Buyer Store
 */
//console_logs('loading Mplm.store.BuyerStore....');

Ext.define('Mplm.store.BuyerCodeStore', {
    extend: 'Ext.data.Store',

	initComponent: function(params) {
		
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	cmpName: params.cmpName
            // some else customization
        });

    },
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'id', type: "int" }
	 	     ,{ name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'wa_code', type: "string"  }
	 	     ,{ name: 'wa_name', type: "string"  }
	 	     
	 	  ],
	 	 cmpName: 'wa_code',
	 	defaultVal: '-1',
	 	defaultDisp: '',
	 	queryMode: 'remote',
	 	 hasNull: false,
	 	sorters: [{
	        property: 'wa_name',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/buyer.do?method=query&paramName=BuyerStore',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
//	        metachange: function(store, meta) {
//	            console_logs("defaultVal " + meta.defaultVal);
//	            this.defaultVal = meta.defaultVal;
//	        },
			load: function(store, records, successful,operation, options) {
				//console_logs('Mplm.store.BuyerStore load');
				if(this.hasNull) {
					var blank ={
							unique_id: '-1',
							wa_code: '',
							wa_name: ''
					};
					
					this.add(blank);
				}
				
			},
			beforeload: function(){
				
//				console_logs('Mplm.store.BuyerStore beforeload');
//				console_logs(this.cmpName);
//				if(this.cmpName!=null&&this.cmpName.length>0){
//					var obj = Ext.getCmp(this.cmpName); 
//					console_logs(obj);
//						if(obj!=null) {
//							var val = obj.getValue();
//							console_logs(val);
//							if(val!=null) {
//								var enValue = Ext.JSON.encode(val);
//								console_logs("queryUtf8:" + enValue);
//								this.getProxy().setExtraParam('queryUtf8', enValue);
//							}else {
//								this.getProxy().setExtraParam('queryUtf8', '');
//							}//endofelse
//						}//endofif
//				}
			}//endofbeforeload
		}//endoflistener
});