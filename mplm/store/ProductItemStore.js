Ext.define('Mplm.store.ProductItemStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('ItemStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'srcahd_item_code', type: "string"  }
	 	     ,{ name: 'srcahd_item_name', type: "string"  }
	 	     ,{ name: 'late_sales_price', type: "string"  }
	 	     ,{ name: 'srcahd_quan', type: "string"  }
	 	     ,{ name: 'srcahd_specification', type: "string"  }
	 	  ],
	 	 hasNull: false,
	 	 sorters: [{
	         property: 'srcahd_item_name',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=getProductMadeItem',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							unique_id:'',
							item_code: '',
							item_name: ''
					};
					
					this.add(blank);
				}

			    },
			    beforeload: function(){
					var obj = Ext.getCmp(this.cmpName); 
					if(obj!=null) {
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
				}
		}
});