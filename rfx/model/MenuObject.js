Ext.define('Rfx.model.MenuObject', {
 extend: 'Rfx.model.Base',
 fields: [
     	    { name: 'menu_key', 	type: "string"    }           
            ,{ name: 'service_name', 		type: "string"    }
            ,{ name: 'menu_type', type: "string"    }
            ,{ name: 'displayName', type: "string"    }
            ,{ name: 'linkPath', 	type: "string"    }
            ,{ name: 'permType', 	type: "int"    }
            ,{ name: 'child', 	type: 'array'   }
            ,{ name: 'parentName', 	type: "string"    }
            ,{ name: 'flag1', type: "string"  }
            ,{ name: 'flag2', type: "string"  }
            ,{ name: 'flag3', type: "string"  }
            ,{ name: 'flag4', type: "string"  }
            ,{ name: 'flag5', type: "string"  }
    ],
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