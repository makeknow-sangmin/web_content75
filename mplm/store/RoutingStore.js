/**
 * RoutingStrore Store
 */
Ext.define('Mplm.store.RoutingStore', {
    extend: 'Ext.data.Store',
	fields:[     
	 	    { name: 'rtgwrk_unique_id', type: "string" }
	 	    ,{ name: 'user_id', type: "string"  }
	 	    ,{ name: 'user_name', type: "string"  }
	 	    ,{ name: 'dept_code', type: "string"  }
	 	    ,{ name: 'dept_name', type: "string"  }
	 	    ,{ name: 'serial', type: "string"  }
	 	    ,{ name: 'comment', type: "string"  }
	 	    ,{ name: 'state', type: "string" }
	 	    ,{ name: 'result', type: "string"  }
	 	    ,{ name: 'role', type: "string"  }
	 	    ,{ name: 'po_user_uid', type: "string"  }
	 	    ,{ name: 'content', type: "string"  }
	 	    ,{ name: 'submit_date', type: "string"  }
	 	     
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'serial',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=listRouting',
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
							unique_id: '',
							name: '',
							content: '',
							user_id: '',
							user_name: '',
							dept_code: '',
							dept_name: '',
							serial: ''
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(records){
//				this.getProxy().setExtraParam('gubun', this.boardType);
//				this.getProxy().setExtraParam('uid_comast', 0);
			}
		}
});