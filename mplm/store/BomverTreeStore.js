// Deprecated - BomverTreeStore2 로 대체됨
// RECURSIVE 하게 조회
Ext.define('Mplm.store.BomverTreeStore', {
    extend: 'Ext.data.TreeStore',
    initComponent: function (params) {
        Ext.apply(this, {
            lang: params.lang,
            // parent_uid: params.parent_uid
        });
    },
    // model: 'Mplm.model.BomverTreeModel',
    // field: [
    //     'unique_id_long',
    //     'parent_uid'
    // ],

    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/design/bom.do?method=getBomverTreeList',
        // url: CONTEXT_PATH + '/design/bom.do?method=getBomverList',
        reader: {
            type: 'json',
            //  root: 'datas',
            //  rootProperty: function(data) {
            //      return data.unique_id_long || data.
            //  }
            // rootProperty: 'unique_id_long'
            rootProperty: 'children',
            // root: 'children'
            // typeProperty: 'unique_id_long'
        }
    },
    // autoLoad: false,
    listeners: {
        beforeload: function (store, operation, eOpts) {
            // console.log('==========operation : ', operation);
            // console.log('==========store : ', store);
            // console.log('==========eOpts : ', eOpts);
            // console.log('==========store.data : ', store.data);
            // console.log('==========store.data.items : ', store.data.items);
            // console.log('==========store.data.items[0] : ', store.data.items[0]);

            // console.log('==========operation.node.data.text : ', operation.node.data.text);
            // console.log('==========operation.node.data.unique_id : ', operation.node.data.unique_id);

            if ('Root' != operation.node.data.text) {
                var unique_id_long = operation.node.data.unique_id_long;
                this.getProxy().setExtraParam('parent_uid', unique_id_long);
            }
            // var array = store.data.items;
            // array.forEach(el => {
            //     console.log('aaaaaaaaaaaaaaaaaaaaaaa',el)
            // });
            //	    	var parent=operation.node.data.text;
            // var id = operation.node.data.unique_id_long;
            //	    	var context = operation.node.data.context;
            //
            //	    	console_log('records:'+id);
            //	    	if(parent!='Root'){
            //	    		var callType = '';
            // this.getProxy().setExtraParam('parent_uid', id);
            //		    	this.getProxy().setExtraParam('callType', callType);	    	
            //	    	}
            //	    	else{
            //	    		var callType = 'TOP';
            //		    	this.getProxy().setExtraParam('callType', callType);
            //	    	}
        },
        load: function (a, records, isSuccess) {
            // console.log('BomTreeStore Is Loded!!!!', a);
            // console.log('BomTreeStore Is Loded!!!!', records);
        }//endofload
    }
    , root: {
        text: 'BomVersionTreeStoreTest',
        id: -1,
        expanded: false,
    },
    // nodeParam: 'unique_id_long',
    // parentIdProperty: 'parent_uid'
});
