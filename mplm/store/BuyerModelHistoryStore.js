
Ext.define('Mplm.store.BuyerModelHistoryStore', {
	 extend: 'Ext.data.Store',
	 fields:[     
		        { name: 'unique_id', type: "string" }
		 	   ,{ name: 'create_date', type: "string"  }
		 	   ,{ name: 'customer_code', type: "string"  }
		 	   ,{ name: 'customer_name', type: "string"  }
		 	   ,{ name: 'model_name', type: "string"  }
		 	   ,{ name: 'class_name', type: "string"  }
		 	   ,{ name: 'user_name', type: "string"  }
		 	  ],
	 extraParams : {
		
     },
	    proxy: {
			type: 'ajax',
	            url: CONTEXT_PATH + '/sales/buyerModel.do?method=queryBuyerModelHistory', /*1recoed, search by cond, search */

			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'					
			},
			autoLoad: true
		} , 
		listeners: {

			load: function(store, records, successful,operation, options) {
				
				if(this.hasNull) {
					
					var blank = {
							unique_id:  '',
							create_date:  '',
							customer_code: '',
							customer_name: '',
							model_name: '',
							class_name: '',
							user_name: ''
						};
						
						this.add(blank);
				}
			},
			beforeload: function(){
				this.getProxy().setExtraParam('group_uid_str', group_uid_str);
			}
		}
});