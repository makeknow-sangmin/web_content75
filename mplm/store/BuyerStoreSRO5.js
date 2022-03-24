/**
 * Buyer Store
 */
//console_logs('loading Mplm.store.BuyerStore....');

Ext.define('Mplm.store.BuyerStoreSRO5', {
    extend: 'Ext.data.Store',

	initComponent: function(params) {
		
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	groupBy: params.groupBy
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
	 	 cmpName: 'buyer_uid',
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
	         url: CONTEXT_PATH + '/production/schdule.do?method=readAssyMap',
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
				
				this.getProxy().setExtraParam('groupBy', this.groupBy);
			}
		}
});