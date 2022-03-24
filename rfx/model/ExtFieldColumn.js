Ext.define('Rfx.model.ExtFieldColumn', {
	 extend: 'Ext.data.Model',
	 fields: [
	   	     { name: 'name', 	type: "string"    }           
	        ,{ name: 'type',   type: "string"    }
	        ,{ name: 'text', type: "string"    }
	        ,{ name: 'width',type: "int"        } 
	        ,{ name: 'sortable', type: "boolean"    }
	        ,{ name: 'dataIndex', type: "string" }
	        ,{ name: 'useYn', 	type: "string"    }
//	        ,{ name: 'order_code2',type: "int"        }
	],
	proxy: {
			type: 'ajax',
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