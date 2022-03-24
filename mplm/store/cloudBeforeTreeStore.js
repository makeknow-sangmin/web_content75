Ext.define('Mplm.store.cloudBeforeTreeStore', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
		
		Ext.apply(this, {
			hasNull: params.hasNull,
        	lang: params.lang
        });

	},
	fields: ['text', {
		name: 'checked',
		defaultValue: false
	}],
    model: 'Mplm.model.TreeCopyModel',
    hasNull: false,
 	sorters: [{
        property: 'pj_name',
        direction: 'ASC'
    }],
	listeners: {
	    beforeload: function(sender,node,records){
	    	
	    	var parent=node.node.data.text;
	    	var id = node.node.data.id;
	    	var context = node.node.data.context;
	    	var folder = node.node.data.folder;
	    	var ac_uid = node.node.data.ac_uid;
			var child = node.node.data.child;



	    	if(parent!='Root'){
	    		var callType = '';
	    		switch(vCompanyReserved4) {
	    		case 'APM01KR':
	    			this.getProxy().setExtraParam('parent', ac_uid);
	    			this.getProxy().setExtraParam('assy_code', child);
	    			this.getProxy().setExtraParam('callType', callType);
	    			this.getProxy().setExtraParam('vCompanyReserved4', vCompanyReserved4);
	    			break;
	    		default:
	    			this.getProxy().setExtraParam('parent_uid', id);
			    	this.getProxy().setExtraParam('callType', callType);
	    			break;
	    		}
		    	
		    	folder = Ext.JSON.encode(folder);
		    	
		    	this.getProxy().setExtraParam('parentFolder', folder);
	    	}
	    	else{
	    		var callType = 'TOP';
		    	this.getProxy().setExtraParam('callType', callType);
	    	}
	    },
	    load: function(sender,node,records){
			
	    }//endofload
	}
});
