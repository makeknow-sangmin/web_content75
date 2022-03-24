Ext.define('B2bLounge.store.UnspscSegSimpleStore', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
        	lang: params.lang
        });

    },
    fields: [     
       		{ name: 'code', type: "string" }
       		,{ name: 'name_ko', type: "string"  }
       		,{ name: 'name_de', type: "string"  }
       		,{ name: 'name_zh', type: "string"  }
       		,{ name: 'name_jp', type: "string"  }
       		,{ name: 'name_en', type: "string"  }
       	  	  ],
    lang: '',
	 sorters: [{
         property: 'code',
         direction: 'ASC'
	     }],
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/lounge.do?method=getUnspscSegment',
         reader: {
             type: 'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
           
     },
    autoLoad: true,
	listeners: {
	    beforeload: function(sender,node,records){
	    	alert(this.lang);
	    	this.getProxy().setExtraParam('lang', this.lang);
	    },
	    load: function(sender,node,records){
	    }//endofload
	}
});
