/**
 * PjMemberStore Store
 */
Ext.define('Mplm.store.PjMemberStorePnl', {
    extend: 'Ext.data.Store',
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'pj_code', type: "string"  }
     		,{ name: 'user_name', type: "string"  }
     		,{ name: 'weld_pos1', type: "string"  }
     		,{ name: 'weld_pos2', type: "string"  }
     		,{ name: 'weld_method1', type: "string"  }
     		,{ name: 'weld_method2', type: "string"  }
     		,{ name: 'weld_pole1', type: "string"  }
     		,{ name: 'weld_pole1', type: "string"  }
     		,{ name: 'wps_no', type: "string"  }
     		,{ name: 'finish_date', type: "date"  }
     		,{ name: 'finish_time', type: "string"  }
     	  	  ],
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=createPJMemeberCLD',
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
							user_id: '',
							user_name: '',
							email: '',
							role_type: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
			}
		}//endoflistner
});