/**
 * Product Store
 */
Ext.define('Mplm.store.ProductStoreHanaro', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			 class_code: params.class_code,
			 cmpName: params.cmpName
	        });

    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'specification', type: "string"  }
	 	     ,{ name: 'class_code', type: "string"  }
	 	    ,{ name: 'item_code', type: "string"  }
	 	   ,{ name: 'description', type: "string"  }
	 	  ,{ name: 'model_no', type: "string"  }
	 	 ,{ name: 'comment', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'class_code',
	        direction: 'ASC'
	    }],
	    queryMode: 'remote',
	     proxy: {
	         type: 'ajax',
	         //url: CONTEXT_PATH + '/purchase/material.do?method=readHeavy&standard_flag=A',
	         url: CONTEXT_PATH + '/sales/poreceipt.do?method=getHanaroManufact',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			beforeload: function(){
					this.getProxy().setExtraParam('class_code2', this.class_code);
					
					console_logs('Mplm.store.ProductStore beforeload');
					console_logs(this.cmpName);
					var obj = Ext.getCmp(this.cmpName); 
					console_logs(obj);
					if(obj!=null) {
						var val = obj.getValue();
						console_logs(val);
						if(val!=null) {
							var enValue = Ext.JSON.encode(val);
							console_logs("queryUtf8:" + enValue);
							this.getProxy().setExtraParam('queryUtf8', enValue);
						}else {
							this.getProxy().setExtraParam('queryUtf8', '');
						}//endofelse
					}
			}
		}
});