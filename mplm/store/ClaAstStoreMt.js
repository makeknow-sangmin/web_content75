Ext.define('Mplm.store.ClaAstStoreMt', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
        	lang: params.lang,
        	class_code: params.class_code
        });

    },
    fields:[     
//                 {name : 'id'}
//                 ,{name : 'unique_id'}
                 //,
                 {name : 'class_name'}
//                 ,{name : 'class_name_eng'}
                 ,{name : 'class_code'}
//                 ,{name : 'text'}
//                 ,{name : 'context'}
//                 ,{name : 'node'}
	 	  ],
    lang: '',
    proxy: {
         type: 'ajax',
//         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaast&callType=TOP&identification_code=MT',
         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaast&identification_code=MT',
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
	    	if(this.class_code!=null){
				this.getProxy().setExtraParam('class_code', this.class_code);
			}
	    },
	    load: function(sender,node,records){
	    }//endofload
	}
});
