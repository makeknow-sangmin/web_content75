/**
 * MaterialStore
 */
Ext.define('Mplm.store.MaterialStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
		
		console_log('BoardStroreNotice.initComponent');
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
	        	hasNull: params.hasNull,
	        	pageSize: params.pageSize
	            // some else customization
	        });

    },
    boardType: '',
    pageSize: 5,
	fields:[     
	 	      { name: 'unique_id', type: "string" }
	 	     ,{ name: 'maker_name', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
	 	   ,{ name: 'image_path', type: "string"  }
	 	  ,{ name: 'maker_name_cng', type: "string"  }
	 	 ,{ name: 'specification_cng', type: "string"  }
	 	,{ name: 'supplier_name', type: "string"  }
	 	
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/poreceipt.do?method=readProduct&class_code=b2b_main',
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
							unique_id: '-1',
							maker_name: '*',
							description: ''
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(){
				this.getProxy().setExtraParam('gubun', this.boardType);
				this.getProxy().setExtraParam('uid_comast', 0);

			}
		}
});