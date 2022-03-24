Ext.define('Mplm.store.BomverTreeStore2', {
    extend: 'Ext.data.TreeStore',
    root: {
        expanded: false
    },
    // children 구조 사용하지 않고 linear list 그대로 tree 구조로 mapping 해주는 속성
    // 최상위노드의 parentId 는 null 로 설정해야 함
    IdProperty: 'unique_id',
    parentIdProperty: 'parentId',
    proxy: {
        type: 'ajax',
        // url: 'http://localhost/web_content75/mplm/model/treeJsonTest_copy.json',
                // url: 'http://localhost/web_content75/mplm/model/treeJsonTest.json',
        url: CONTEXT_PATH + '/design/bom.do?method=getBomverLinearTreeList',
        reader: {
            type: 'json',
            rootProperty: function (node) {
                return node.datas || node.children;
            },
            // rootProperty: 'datas'
        }
    },
    listener: {
        beforeload: function (store, operation, eOpts) {
            console.log('beforeload!!!beforeload!!!beforeload!!!beforeload!!!beforeload!!!');
            if ('Root' != operation.node.data.text) {
                var unique_id_long = operation.node.data.unique_id_long;
                this.getProxy().setExtraParam('parent_uid', unique_id_long);
            } else {
                console.log('Root!!!!Root!!!!Root!!!!Root!!!!Root!!!!');
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
        },
    },
    autoLoad: false
});