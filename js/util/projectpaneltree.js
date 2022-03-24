Ext.require(['*']);

var callType = '';
var storeMenu = Ext.create('Ext.data.TreeStore', {
	expanded: false,
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/poreceipt.do?method=projectTree',
         reader: {
             type: 'json',
             root: 'datas'
         }
           
     },
	listeners: {
	    beforeload: function(sender,node,records){
	    	console_log('beforeload: -----------------');
	    	var parent=node.node.data.text;
	    	if(parent!='Root'){
	    		 var subParent = parent.substring(0,9);
	    		 storeMenu.proxy.extraParams.callType = 'CHILD';
	    		 storeMenu.proxy.extraParams.parent = subParent;
	    	     storeMenu.proxy.extraParams.level = '2';
	    	     callType = "CHILD";
	    	}else {
	    		storeMenu.proxy.extraParams.callType = 'TOP';
	    		callType = 'TOP';
	    	}
	    },
	    load: function(sender,node,records){
//	    	callbackToolbarRenderrer(callType);
	    }//endofload
	}
});

//var pjTreeGrid = Ext.create('Ext.tree.Panel', {
//    id: 'pjTreeGrid',
//    title: getMenuTitle(),
////    height: 300,
////    width: 300,
//    region: 'west',
//    width:'20%',
//    store: storeMenu,
//    rootVisible: false,
//    viewConfig: {
//    	listeners: {
////	    	itemcontextmenu: function(view, rec, node, index, e) {
////		    	selectedNodeId = rec.getId();
////		    	e.stopEvent();
////		    	contextMenu.showAt(e.getXY());
////		    	return false;
////		    },
//		    itemclick: function(view, record, item, index, e, eOpts) {                      
////		    	rec.get('leaf'); // 이렇게 데이터 가져올 수 있음
//		    	var pj_code = record.data.text;
//		    	var id = record.data.id;
//		    	//console_log(id);
//		    	if(id != undefined && id!=null && record.data.text !='') {
//			    	var sub_PjCode = pj_code.substring(0,12);
//			    	store.getProxy().setExtraParam('pj_code', sub_PjCode);
//     				store.load({});
//		    	}
//		    	
//		    }//end itemclick
//    	}//end listeners
//	}
//});	
