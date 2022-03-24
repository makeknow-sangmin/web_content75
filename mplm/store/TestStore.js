/**
 * RoutingStrore Store
 */
Ext.define('Mplm.store.TestStore', {
    extend: 'Ext.data.Store',
	fields:[     
	 	    { name: 'h_reserved1', type: "string" },
	 	   { name: 'unique_id_long', type: "int" }
 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'h_reserved1',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=getDistinctTestStatus',
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
				if(this.hasNull) {
					var blank ={
							
							h_reserved1: '[전체보기]ALL'
						
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(records){
//				this.getProxy().setExtraParam('uid_comast', 0);
			}
		}
});