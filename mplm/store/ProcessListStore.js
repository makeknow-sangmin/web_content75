console_log('loading ProcessListStore....');
/**
 * Item Store
 */
Ext.define('Mplm.store.ProcessListStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('ProcessListStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields:[     
	 	      { name: 'mchn_code', type: "string" }
	 	     ,{ name: 'name_cn', type: "string"  }
	 	     ,{ name: 'name_en', type: "string"  }
	 	     ,{ name: 'mchn_type', type: "string"  }
	 	     ,{ name: 'maker', type: "string"  }
	 	   	 ,{ name: 'group_name', type: "string"  }
	 	  ],	
	 	 hasNull: false,
	 	 sorters: [{
	         property: 'mchn_code',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/machine.do?method=read',
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
							mchn_code:''
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