
Ext.define('DEMO.store.Tasks', {
    extend : 'Gnt.data.TaskStore',
    model : 'DEMO.model.Task',
        autoload: true,
        autoSync: true,
        sorters : {
            property : 'Id',
            direction : 'ASC'
        },
    proxy: {
        type: 'ajax',
        api: {
        	read: CONTEXT_PATH + '/statistics/task.do?method=readTask',
            create : CONTEXT_PATH + '/statistics/task.do?method=create.action',
            update: CONTEXT_PATH + '/statistics/task.do?method=update.action',
            destroy: CONTEXT_PATH + '/statistics/task.do?method=delete.action'
        },
        extraParams : {
        	ac_uid : '3280003791'
    	},
    	method: 'POST',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: false,
            root: 'data'
        },
        listeners: {
			beforeload: function(sender,node,records){
	    		var parent=node.node.data.text;
	    		var id = node.node.data.id;
	    		var context = node.node.data.context;
	    	
	    		console.log(sender);
	    		console.log(node);
	    		console.log(records);
	    		console.log(parent);
	    		console.log(id);
	    		console.log(context);
	    		alert('beforeload');
	    		
			},
			load: function(sender,node,records){
	    		alert('load');
	    	},
	    	exception: function(proxy, response, operation){
            	var error = null;
            	if (!operation.getError()){
            		error = Ext.JSON.decode(response.responseText);
            		error = error.message;
            	} else {
            		error = operation.getError().statusText;
            	}
            	
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: error,
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        }
    }
});