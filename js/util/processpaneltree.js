Ext.require(['*']);

var callType = '', id = '';
var member_type = '';
var parent = '';
var source = '';
var use_drop = false;
var div = '';
var psTreeGrid = null;
var storeMenu = Ext.create('Ext.data.TreeStore', {
	expanded: true,
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/machine.do?method=processtree',
         reader: {
             type: 'json',
             root: 'datas'
         }
           
     },
	listeners: {
		beforeload: function(sender,node,records){
	    	console_log('beforeload: -----------------');
    		parent=node.node.data.text;
    		id=node.node.data.id;
    		
	    	console_log('parent : ');
	    	console_log(parent);
	    	console_log('id:');
	    	console_log(id);
	    	
	    	if(parent!='Root'){
	    		//console_log('not root');
		    	if(id.substr(0,1) == 'H'){
		    		member_type = "HUMAN";
		    	} else if(id.substr(0,1) == 'M'){
		    		member_type = "MACHINE";
		    	} else if(id.substr(0,1) == 'G'){
		    		member_type = "GROUP";
		    	} else {
		    		alert('unknown case');
		    	}
	    		var subParent = parent;
	    		div = id;
	    		 storeMenu.proxy.extraParams.callType = 'CHILD';
	    		 storeMenu.proxy.extraParams.parent = subParent;
	    	     storeMenu.proxy.extraParams.level = '2';
	    	     storeMenu.proxy.extraParams.member_type = member_type;
	    	     callType = "CHILD";
	    	}else {
	    		//console_log('root');
	    		storeMenu.proxy.extraParams.callType = 'TOP';
	    		storeMenu.proxy.extraParams.level = '1';
	    		callType = 'TOP';
	    		console_log("2");
	    	}
	    	
	    	
	    	
	    },
		load: function(sender,node,records){
			if(use_drop==true){
				treatCommonProjectAssy(div);
			}
		}
	}
});

function treatCommonProjectAssy(div) {
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/production/machine.do?method=processtree',		
		params:{
			callType : 'TOP',
//			parent : mainParent,
			level : '1'
//			member_type : member_type
		},
		success : function(result, request) {
			var obj = Ext.getCmp('tempport');
			console_log('tempport!!!!!');
			console_log(obj);
			var treePanel = obj.store.tree;
			var root = treePanel.getRootNode();
			var children = root.childNodes;
//			console_log(children);
			for(var i=0; i<children.length; i++) {
    			var parent = children[i];
    			parent_id = parent.internalId;
    			if(div == parent_id){
    				parent.expand(false, function(){});
    			}
			}
		},
		failure: function(result, request){
			console_log('fail project');
		} /*extjsUtil.failureMessage*/
	});
}


 psTreeGrid = Ext.create('Ext.tree.Panel', {
	id : 'tempport',
    title: getMenuTitle(),
//    height: 300,
    region: 'west',
    width:'20%',
    store: storeMenu,
    split: true,
    rootVisible: false,
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            dropGroup: 'moveWork'//,
            //enableDrag: false,
            //appendOnly: true
        },
    	listeners: {
            beforedrop: function(node, data, overModel, dropPos, opts) {
            	console_log('--------------beforedrop');
    			console_log(node);
    			console_log(overModel);
    			console_log(dropPos);
    			console_log(opts);
    			console_log("1>>>>"+uidList);
                this.droppedRecords = data.records;
                data.records = [];
                console_log('--------------end');
            },
    		drop: function(node, data, dropRec, dropPosition) {
    			console_log('--------------drop');
    			console_log(node);
    			console_log(data);
    			console_log(dropRec);
    			console_log(dropPosition);
    			console_log('--------------end');
    			console_log("2>>>>"+uidList);
    			console_log("mchn_code>>>>"+dropRec.data.text);
    			console_log("mchn_user_uid>>>>"+dropRec.data.id);
    			
    			var parent_id = dropRec.data.id;
		    	var arr = parent_id.split(':');
		     	console_log('2drop>>>>parent_id:'+parent_id);
	
		    	var id = parent_id;
		    	var target = '';
		    	if(arr.length>1) {
		    		target = arr[0];
		    		id = arr[1];
		    	}
		    	
		    	console_log('2drop>>>>end target:'+target);
		    	
		    	if(target==''){
		    		target = dropRec.data.text;
		    	}
		    	
		      	console_log('2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!source:'+source);
		    	console_log('2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!target:'+target);
		    	
		    	if(target != source){
		    		target = '';
		    		alert('对不起,不能拖放工件！');
		    		return;
		    	}
	
    			
    			
    			if(member_type == 'HUMAN'){
    				Ext.Ajax.request({
                		url: CONTEXT_PATH + '/production/pcsline.do?method=changeWorker',
                		params:{
                			unique_id_str : uidList,
                			worker_uid : id //dropRec.data.id
                		},
                		success : function(result, request) {
                			var result = result.responseText;
    						console_log('result:' + result);
    						if(result != ''){
    							Ext.MessageBox.alert('OK, 已经移动 '+dropRec.data.text+' 数量:',result);
    							store.load(function() {});
    							use_drop = true;
    							storeMenu.load({});
    						}else{
    							Ext.MessageBox.alert('Check','Did not move any part!');
    						}
                		},
                		failure: extjsUtil.failureMessage
                	});	
    			} else {
    				Ext.Ajax.request({
                		url: CONTEXT_PATH + '/production/pcsline.do?method=changeMachine',
                		params:{
                			unique_id_str : uidList,
                			pcsmchn_uid : id //dropRec.data.id
                		},
                		success : function(result, request) {
                			var result = result.responseText;
    						console_log('result:');
    						console_log(result);
    						if(result != ''){
    							Ext.MessageBox.alert('OK, 已经移动 '+dropRec.data.text+' 数量:',result);
    							store.load(function() {});
    							use_drop = true;
    							storeMenu.load({});
    						}else{
    							Ext.MessageBox.alert('Sorry','不能移动任何工件!');
    						}
                		},
                		failure: extjsUtil.failureMessage
                	});	
    			}
        	
    			
    			
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
               //console_lpg("Drag from left to right: " + 'Dropped ' + data.records[0].get('name') + dropOn);
            },
		    itemclick: function(view, record, item, index, e, eOpts) {   
		    	console_log('itemclick:');
		    	console_log(record);
		    	//reset store proxy
		    	store.getProxy().setExtraParam('page', '1'); 
		    	store.getProxy().setExtraParam('start', '0'); 
		    	
		    	console_log('page and start is reset to' + '1 & 0');
		    	
		    	store.getProxy().setExtraParam('pcs_no', null); 
		    	store.getProxy().setExtraParam('mchn_code', null); 
		    	store.getProxy().setExtraParam('unique_id', null); 
		    	store.getProxy().setExtraParam('notAssigned', null); 
		    	
		    	if(record.data.text.substring(0,4)=='W-HT'){
		    		 mchn_code = 'W-HT';
		    	} else {
			    	 mchn_code = record.data.text.substring(0,5);
		    	}

		    	var new_member_type = record.data.parentId.substring(0,1);
		    	var parent_id = record.data.id;
		    	console_log('3>>>>parent_id:'+parent_id);    // C1
		    	
		    	var arr = parent_id.split(':');
		    	var id = parent_id;
		    	var group_code = '';
		    	if(arr.length>1) {
		    		group_code = arr[0];   
		    		id = arr[1];
		    	}
		    	console_log('3>>>>id:'+id);
		    	if(group_code==''){
		    		source = mchn_code;
		    	} else {
		    		source = group_code;
		    	}
		    	
		    	console_log('3!!!!!!!!!!!!!!!!!!!!!!!!!!!source:'+source);
		    	console_log('3>>>>mchn_code:'+mchn_code);
		    	console_log('3>>>>member_type:'+member_type);


		    	if(id != undefined && id!=null && record.data.text !='') {
			    	if(new_member_type == 'H'){ //    member_type:human
			    		 console_log("5>>>>mchn_code:"+mchn_code);
			    		 
			    		 store.getProxy().setExtraParam('pcs_no', group_code);    
			    		 store.getProxy().setExtraParam('mchn_code', null);
					     store.getProxy().setExtraParam('unique_id', id);    // 3480001532 
					 } else if(new_member_type == 'M') {
						 store.getProxy().setExtraParam('pcs_no', group_code);                           //C1
					     store.getProxy().setExtraParam('mchn_code', mchn_code);  // member_type:machine  //CNC02
					
					 } else if(new_member_type == 'G') {
						 store.getProxy().setExtraParam('pcs_no', group_code);                           //C1
					     store.getProxy().setExtraParam('mchn_code', mchn_code);  // member_type:machine  //CNC02
					
					 } else {
						 store.getProxy().setExtraParam('pcs_no', mchn_code);  //english  
						 store.getProxy().setExtraParam('notAssigned', "Y");
						 
	
					 }
					 store.load({});
		    	}
		    	uidList = "";
		    }//end itemclick
    	}//end listeners
	}
});	
