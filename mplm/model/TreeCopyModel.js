Ext.define('Mplm.model.TreeCopyModel', {
	extend: 'Ext.data.Model',
    alias: 'mplmTreeCopyModel',
    fields:[     
        {name : 'id'}
        ,{name : 'callType'}
        ,{name : 'context'}
        ,{name : 'parent'}
        ,{name : 'node'}
        ,{name : 'text'}
        ,{name : 'ac_uid'}
        ,{name : 'pl_no'}
        ,{name : 'unique_uid'}
        ,{name : 'folder'}
        ,{name : 'reserved_integer1'}
		,{name : 'reserved_integer2'}
		,{name : 'varchar1'}
		,{name : 'varchar2'}
		,{name : 'varchar3'}
		,{name : 'varchar4'}
		,{name : 'varchar5'}
		,{name : 'user_name'}
	//   { name: 'context', type: "string" },
	//    { name: 'id', type: "int" }
	//     ,{ name: 'name', type: "string"  }
	//     ,{ name: 'node', type: "string"  }
	//     ,{ name: 'parent', type: "string"  }
	//     ,{ name: 'callType', type: "string"  }
	////     ,{ name: 'description', type: "string"  }
	////	 ,{ name: 'cav_no', type: "string"  }
	////	 ,{ name: 'regist_date', type: "string"  }
	////    ,{ name: 'delivery_plan', type: "string"  }
	////    ,{ name: 'pj_type', type: "string"  }
	////    ,{ name: 'model_name', type: "string"  }
	////    ,{ name: 'pm_id', type: "string"  }
	////    ,{ name: 'is_complished', type: "string"  }
	////    ,{ name: 'selling_price', type: "string"  }
	////    ,{ name: 'reserved_double5', type: "string"  }
	//    
	  ],
	lang: '',
	proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/sales/poreceipt.do?method=getBomtreeByParentUid',
		reader: {
		    type: 'json',
			root: 'datas'
		},
		writer: {
		  type: 'json'
		}	  
	}

});