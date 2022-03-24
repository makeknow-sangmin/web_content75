/**
 * RoutingStrore Store
 */
Ext.define('Mplm.store.BlockStore', {
    extend: 'Ext.data.Store',
	fields:[     
	 	    { name: 'area_code', type: "string" },
	 	   { name: 'unique_id_long', type: "int" }
 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'area_code',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/design/project.do?method=listSrcahdBlock',
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
							
							area_code: '[전체보기]ALL'
						
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(records){
				console_logs('link>>>>>>>>>', gMain.selPanel.link);
				this.getProxy().setExtraParam('menucode', gMain.selPanel.link);
//				this.getProxy().setExtraParam('uid_comast', 0);
			}
		}
});