var stdProcessNameStore = new Ext.create('Ext.data.Store', {
 	fields:[     
 	       { name: 'systemCode', type: "string" }
 	      ,{ name: 'codeName', type: "string"  } 
 	      ,{ name: 'pcs_code', type: "string"  }          
 	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/pcsstd.do?method=pcsStdName',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     	}
 });