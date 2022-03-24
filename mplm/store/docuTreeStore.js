Ext.define('Mplm.store.docuTreeStore', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
			hasNull: params.hasNull,
        	lang: params.lang
        });

    },
    model: 'Mplm.model.DocuTreeModel',
    hasNull: false,
 	sorters: [],
    type: 'tree',
	listeners: {
	    beforeload: function(sender,node,records){
			var parent=node.node.data.text;
	    	var id = node.node.data.id;
	    	var context = node.node.data.context;
			var folder = node.node.data.folder;
			var depth = node.node.data.depth;
			var level = node.node.data.level;
			var class_code = node.node.data.class_code;

			console_logs('==node', node);
			console_logs('==level', level);

			if(parent == 'Root') {
				this.getProxy().setExtraParam('level', 1);
			} else {
				this.getProxy().setExtraParam('level', level + 1);
				this.getProxy().setExtraParam('parent_class_code', class_code);
			}
	    },
	    load: function(sender,node,records){

	    }//endofload
	},
	// proxy: {
	// 	type: 'ajax',
	// 	url: 'http://localhost/web_content75/index/docuTreeJson.json'
	// },
});
