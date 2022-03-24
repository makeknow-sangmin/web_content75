Ext.define('Mplm.store.ClaAstTreeStore2', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
        	lang: params.lang
        });

    },
    fields:[     
                 {name : 'id'}
                 ,{name : 'unique_id'}
                 ,{name : 'class_name'}
                 ,{name : 'class_name_eng'}
                 ,{name : 'class_code'}
                 ,{name : 'text'}
                 ,{name : 'context'}
                 ,{name : 'node'}
	 	  ],
    lang: '',
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=claasttree&class_code=MB',
         reader: {
             type: 'json',
             root: 'datas'
         }
     },
	listeners: {
	    beforeload: function(sender,node,records){
//	    	var parent=node.node.data.text;
//	    	var id = node.node.data.id;
//	    	var context = node.node.data.context;
//
//	    	console_log('records:'+id);
//	    	if(parent!='Root'){
//	    		var callType = '';
//	    		this.getProxy().setExtraParam('parent', id);
//		    	this.getProxy().setExtraParam('callType', callType);	    	
//	    	}
//	    	else{
//	    		var callType = 'TOP';
//		    	this.getProxy().setExtraParam('callType', callType);
//	    	}
	    },
	    load: function(sender,node,records){
	    }//endofload
	}
});
