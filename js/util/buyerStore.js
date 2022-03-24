console_log('loading buyerStore in util....');
var buyerStore = new Ext.create('Ext.data.Store', {
 	fields:[     
 	      { name: 'unique_id', type: "string" }
 	     ,{ name: 'wa_code', type: "string"  }
 	     ,{ name: 'wa_name', type: "string"  }
 	     
 	  ],
// 	 cmpName: 'buyerUid',
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/buyer.do?method=query',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     }
	/*listeners: {
		load: function(store, records, successful,operation, options) {
//			var obj = Ext.getCmp('buyerUid'); 
//			var val = obj.getValue();
//			console_log(val);
//			var enValue = Ext.JSON.encode(val);
//			console_log(enValue);
//			this.getProxy().setExtraParam('query_', enValue);
		    },
		beforeload: function(){
			var obj = Ext.getCmp(this.cmpName); 
			var val = obj.getValue();
			console_log(val);
			if(val!=null) {
				var enValue = Ext.JSON.encode(val);
				console_log(enValue);
				this.getProxy().setExtraParam('queryUtf8', enValue);
			}else {
				this.getProxy().setExtraParam('queryUtf8', '');
			}
		}
	}*/

 });