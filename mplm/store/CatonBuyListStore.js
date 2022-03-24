/**
 * AssemblySearchStore Store
 */

Ext.define('Mplm.store.CatonBuyListStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
    },
	fields:[     
	      { name: 'unique_id', type: "string" }
	 	 ,{ name: 'srcahd_uid', type: "string"  }
	 	 ,{ name: 'pj_code', type: "string"  }
	 	 ,{ name: 'item_code', type: "string"  }
	 	 ,{ name: 'item_name', type: "string"  }
	 	 ,{ name: 'description', type: "string"  }
	 	 ,{ name: 'cost_qty', type: "string"  }
	 	,{ name: 'po_qty', type: "string"  }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopCaton&sp_code=PRD&not_restart=Y',
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
				console_logs('load records', records);

			},
				beforeload: function(){
					if(this.cmpName!=null&&this.cmpName.length>0){
						var obj = Ext.getCmp(this.cmpName); 
						console_logs(obj);
							if(obj!=null) {
								var val = obj.getValue();
								if(val!=null) {
									var enValue = Ext.JSON.encode(val);
									if(val.length!=11){
										this.getProxy().setExtraParam('queryUtf8', enValue);
									}
									
								}else {
									this.getProxy().setExtraParam('queryUtf8', '');
								}//endofelse
							}//endofif
					}
				}
		}
});