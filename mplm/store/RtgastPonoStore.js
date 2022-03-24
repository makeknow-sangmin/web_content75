/**
 * RoutingStrore Store
 */
Ext.define('Mplm.store.RtgastPonoStore', {
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
				
				console_logs('records>>>>>>>>>>>>>>>>>>>>>', records)
				if(this.hasNull) {
					var blank ={
							
							lot_no: '전체'
						
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(records){
				console_logs('po_type>>>>>>>>>>>', gMain.selPanel.potype);
				this.getProxy().setExtraParam('po_type', gMain.selPanel.potype);
				this.getProxy().setExtraParam('rtg_type', 'OD');
//				this.getProxy().setExtraParam('uid_comast', 0);
			}
		}
});