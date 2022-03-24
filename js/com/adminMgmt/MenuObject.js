Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var fields = [
 	    { name: 'menu_key', 	type: "string"    }           
        ,{ name: 'service_name', 		type: "string"    }
        ,{ name: 'menu_type', type: "string"    }
        ,{ name: 'displayName', type: "string"    }
		,{ name: 'linkPath', 	type: "string"    }
		,{ name: 'flag1', 	type: "string"    }
		,{ name: 'flag2', 	type: "string"    }
		,{ name: 'flag3', 	type: "string"    }
		,{ name: 'flag4', 	type: "string"    }
		,{ name: 'flag5', 	type: "string"    }
];

Ext.define('MenuStruct', {
	 extend: 'Ext.data.Model',
	 fields: fields,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/admin/menu.do?method=readStruct'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				successProperty: 'success'
			}
		}
});

var fieldsObject = [
       	    { name: 'menu_key', 	type: "string"    }           
              ,{ name: 'service_name', 		type: "string"    }
              ,{ name: 'menu_type', type: "string"    }
              ,{ name: 'displayName', type: "string"    }
              ,{ name: 'linkPath', 	type: "string"    }
              ,{ name: 'permType', 	type: "int"    }
              ,{ name: 'child', 	type: 'array'   }
			  ,{ name: 'parentName', 	type: "string"    }
			  ,{ name: 'flag1', 	type: "string"    }
			  ,{ name: 'flag2', 	type: "string"    }
			  ,{ name: 'flag3', 	type: "string"    }
			  ,{ name: 'flag4', 	type: "string"    }
			  ,{ name: 'flag5', 	type: "string"    }
      ];
Ext.define('MenuObject', {
	 extend: 'Ext.data.Model',
	 fields: fieldsObject,

	    proxy: {
			type: 'ajax',
			extraParams:{menuStruct:''},
	        api: {
	            read: CONTEXT_PATH + '/admin/menu.do?method=readObject'
	        },
	        
			reader: {
				type: 'json',
				root: 'datas',
				successProperty: 'success'
			}
		}
});
