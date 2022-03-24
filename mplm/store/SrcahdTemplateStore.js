/**
 * Buyer Store
 */
//console_logs('loading Mplm.store.BuyerStore....');

Ext.define('Mplm.store.SrcahdTemplateStore', {
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
	 	     ,{ name: 'item_code', type: "string"  }
	 	     ,{ name: 'item_name', type: "string"  }
	 	     ,{ name: 'specification', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
	 	     
	 	  ],
	 	 cmpName: '',
	 	defaultVal: '-1',
	 	defaultDisp: '',
	 	queryMode: 'remote',
	 	 hasNull: false,
	 	sorters: [{
	        property: 'item_name',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readHeavy&standard_flag=A&bom_flag=T&class_code=PRD',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {
				//console_logs('Mplm.store.BuyerStore load');
				if(this.hasNull) {
					var blank ={
							unique_id: '-1',
							item_code: '',
							item_name: ''
					};
					
					this.add(blank);
				}
				
			},
			beforeload: function(){
				
			}//endofbeforeload
		}//endoflistener
});