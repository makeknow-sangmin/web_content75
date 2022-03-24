Ext.define('Mplm.store.cloudAssemblyTreeStore', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
        	lang: params.lang
        });

    },
    model: 'Mplm.model.TreeModel',
	listeners: {
	    beforeload: function(sender,node,records){
	    	var parent=node.node.data.text;
	    	var id = node.node.data.id;
	    	var context = node.node.data.context;
			var folder = node.node.data.folder;
			var refer_uid = node.node.data.refer_uid;
			var depth = node.node.data.depth;

//	    	if(parent!='Root'){
				var callType = '';
				console_logs('====node', node);
				this.getProxy().setExtraParam('refer_uid', refer_uid);
				this.getProxy().setExtraParam('depth', depth);
	    		this.getProxy().setExtraParam('parent_uid', id);
				this.getProxy().setExtraParam('callType', callType);
				switch(vCompanyReserved4) {
					case 'KBTC01KR':
                    case 'BIOT01KR':
					case 'DSMF01KR':
					case 'SKNH01KR' :
					case 'CHMR01KR':
						
							this.getProxy().setExtraParam('ac_uid_minus_one', 'Y');
						break;
					case 'HJSV01KR':
							this.getProxy().setExtraParam('vCompanyReserved4', vCompanyReserved4);
					break;
				}
		    	
		    	folder = Ext.JSON.encode(folder);
		    	
		    	this.getProxy().setExtraParam('parentFolder', folder);
//	    	}
//	    	else{
//	    		var callType = 'TOP';
//		    	this.getProxy().setExtraParam('callType', callType);
//	    	}
	    },
	    load: function(sender,node,records){
	    	for(var i=0; i<records.length; i++) {
	    		var rec = records[i];
	    		
	    		console_logs('rec', rec);
	    		
	    		gm.me().selectTreeRecord(rec);
	    	}	    		
    

	    }//endofload
	}
});
