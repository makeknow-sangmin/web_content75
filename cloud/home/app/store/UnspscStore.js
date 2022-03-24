Ext.define('B2bLounge.store.UnspscStore', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
        	lang: params.lang
        });

    },
    lang: '',
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/lounge.do?method=unspsc',
         reader: {
             type: 'json',
             root: 'datas'
         }
           
     },
	listeners: {
	    beforeload: function(sender,node,records){
	    	this.getProxy().setExtraParam('lang', this.lang);
	    },
	    load: function(sender,node,records){
	    }//endofload
	}
});
