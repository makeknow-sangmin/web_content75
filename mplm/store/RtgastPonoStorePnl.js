/**
 * RoutingStrore Store
 */
Ext.define('Mplm.store.RtgastPonoStorePnl', {
    extend: 'Ext.data.Store',
	fields:[     
	 	    { name: 'lot_no', type: "string" },
	 	   { name: 'unique_id', type: "string" }
 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'lot_no',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=heavy4Workorder&po_type=PRD',
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
							
							lot_no: '[전체보기]ALL'
						
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