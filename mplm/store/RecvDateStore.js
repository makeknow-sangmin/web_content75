/**
 * MaterialStore
 */
Ext.define('Mplm.store.RecvDateStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			 order_com_unique: params.order_com_unique
	        });

    },
	fields:[     
	 	      { name: 'regist_date', type: "string" }
	 	     ,{ name: 'item_code', type: "string"  }
	 	     ,{ name: 'item_name', type: "string"  }
	 	   ,{ name: 'specification', type: "string"  }
	 	  ,{ name: 'gap', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'regist_date',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=getRecvDateSrcahd',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			beforeload: function(){
				//this.getProxy().setExtraParam('order_com_unique', this.order_com_unique);

			}
		}
});