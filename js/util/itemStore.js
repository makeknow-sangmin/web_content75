console_log('loading itemStore....');
var itemStore = new Ext.create('Ext.data.Store', {
 	fields:[     
 	      { name: 'unique_id', type: "string" }
 	     ,{ name: 'item_code', type: "string"  }
 	     ,{ name: 'item_name_zh', type: "string"  }
 	     ,{ name: 'cavity', type: "string"  }
 	     ,{ name: 'model_size', type: "string"  }
 	     ,{ name: 'item_name', type: "string"  }
 	     
 	  ],
// 	 cmpName: 'itemUid',
 	 sorters: [{
         property: 'item_code',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/stdname.do?method=query',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     }
 });