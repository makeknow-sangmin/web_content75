Ext.define('B2bLounge.store.MakerStore', {
    extend: 'Ext.data.TreeStore',
	expanded: false,
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/lounge.do?method=maker',
         reader: {
             type: 'json',
             root: 'datas'
         }
           
     },
	listeners: {
	    beforeload: function(sender,node,records){
//	    	console_log('beforeload: -----------------');
//	    	var parent=node.node.data.text;
//	    	if(parent!='Root'){
//	    		 var subParent = parent.substring(0,9);
//	    		 storeMenu.proxy.extraParams.callType = 'CHILD';
//	    		 storeMenu.proxy.extraParams.parent = subParent;
//	    	     storeMenu.proxy.extraParams.level = '2';
//	    	     callType = "CHILD";
//	    	}else {
//	    		storeMenu.proxy.extraParams.callType = 'TOP';
//	    		callType = 'TOP';
//	    	}
	    },
	    load: function(sender,node,records){
//	    	callbackToolbarRenderrer(callType);
	    }//endofload
	}
});
