console_log('loading ProcessInfo....');
/**
 * Item Store
 */
Ext.define('Mplm.store.ProcessInfoStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		console_log('ProcessInfoStore.initComponent');
    },
	fields:[     
	        { name: 'pcs_code', type: "string"  },
	        { name: 'pcs_name', type: "string"  }
	        ,{ name: 'pl_no', type: "string"  }
        	,{ name: 'mchnCode_userName', type: "string"  }
        	,{ name: 'operator_name', type: "string"  }
        	,{ name: 'is_complished', type: "string"  }
        	,{ name: 'description', type: "string" }
        	,{ name: 'partStatus', type: "string" }
        	//,{ name: 'serial_no', type: "string" }
        	,{ name: 'real_time', type: "string" }
        	,{ name: 'start_date', type: "date"  }
        	,{ name: 'view_serial_no', type: "string"  }
        	,{ name: 'end_date', type: "date"  }
	        ] ,
	         extraParams : {
	        	 cartmap_uid: '', //PR,PO,GR,RF
	        	 srcahd_uid: '',
	        	 pl_no: ''
	         },
	         
	 	 hasNull: false,
	 	 sorters: [{
	         //property: 'view_serial_no',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/pcsline.do?method=readProcessInfo',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
	
					};
					
					this.add(blank);
				}

			    },
			    beforeload: function(){
//			    	this.getProxy().setExtraParam('cartmap_uid', cartmap_uid);
//			    	this.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
//			    	this.getProxy().setExtraParam('pl_no', pl_no);
				}
		}
});