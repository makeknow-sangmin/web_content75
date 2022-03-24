/**
 * RoutingStrore Store
 */
Ext.define('Mplm.store.WorkorderPonoStore', {
    extend: 'Ext.data.Store',
	fields:[     
	 	    { name: 'lot_no', type: "string" },
	 	   { name: 'unique_id_long', type: "int" }
 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'lot_no',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=listRtgastPono',
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
							
							lot_no: '전체'
						
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(records){
				this.getProxy().setExtraParam('reqKey', gm.me().reqKey);
				this.getProxy().setExtraParam('rtg_type', 'OD');
			}
		}
});