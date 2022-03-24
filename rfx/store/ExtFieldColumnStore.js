Ext.define('Rfx.store.ExtFieldColumnStore', {
	extend : 'Ext.data.Store',
//    constructor: function(cfg) {
//    	console.log('cfg', cfg);
//    },
   fields: [
		   	     { name: 'name', 		type: "string"    }           
		        ,{ name: 'type',   		type: "string"    }
		        ,{ name: 'text', 		type: "string"    }
		        ,{ name: 'width',		type: "int"        } 
		        ,{ name: 'sortable', 	type: "boolean"    }
		        ,{ name: 'dataIndex', 	type: "string" }
		        ,{ name: 'useYn', 		type: "string"    }
		        ,{ name: 'member_type', type: "string"    }
		        ,{ name: 'input_type', type: "string"    }  
		        ,{ name: 'modify_ep_id', type: "string"    }  
				,{ name: 'menu_code', type: "string"    }  
				,{ name: 'description', type: "string"    }  
//		        ,{ name: 'order_code2',type: "int"        }
		],
	proxy: {
			type: 'ajax',
			async: false,
	        api: {
	            read: CONTEXT_PATH + '/dispField.do?method=read'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			}
	}
});
