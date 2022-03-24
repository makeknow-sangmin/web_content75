console_log('loading MyPartStore....');
/**
 * Item Store
 */
Ext.define('Mplm.store.MyPartStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('MyPartStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields:[     
	 	      { name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'unique_id', type: "string" }
	 	     ,{ name: 'item_code', type: "string"  }
	 	     ,{ name: 'specification', type: "string"  }
	 	     ,{ name: 'item_name', type: "string"  }
	 	     ,{ name: 'standard_flag', type: "string"  }
		 	 ,{ name: 'class_code', type: "string"  }
			 ,{ name: 'description', type: "string"  }
			 ,{ name: 'model_no', type: "string"  }
			 ,{ name: 'comment', type: "string"  }
			 ,{ name: 'maker_name', type: "string"  }
			 ,{ name: 'unit_code', type: "string"  }
			 ,{ name: 'currency', type: "string"  }
			 ,{ name: 'sales_price', type: "float"  }
			 ,{ name: 'image_no', type: "string"  }
			 ,{ name: 'remark', type: "string"  }
			 ,{ name: 'request_comment', type: "string"  }
			 ,{ name: 'image_path', type: "string"  }
			 ,{ name: 'static_seller_name', type: "string"  }
			 ,{ name: 'image_path', type: "string"  }
			 ,{ name: 'sg_code', type: "string"  }
			 ,{ name: 'alter_reason', type: "string"  }
	 	  ],
	 	 hasNull: true,
	 	 sorters: [{
	         property: 'item_code',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readMypart',
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
							unique_id:'-1',
							item_code: ' Select My Part ',
							item_name: '||||||||||||||||||||',
							specification: '',
							description: '',
							comment:  ''
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