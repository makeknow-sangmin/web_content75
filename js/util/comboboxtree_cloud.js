Ext.require(['*']);

/*
Tree combo
Use with 'Ext.data.TreeStore'


If store root note has 'checked' property tree combo becomes multiselect combo (tree store must have records with 'checked' property)


Has event 'itemclick' that can be used to capture click


Options:
selectChildren - if set true and if store isn't multiselect, clicking on an non-leaf node selects all it's children
canSelectFolders - if set true and store isn't multiselect clicking on a folder selects that folder also as a value


Use:


single leaf node selector:
selectChildren: false
canSelectFolders: false
- this will select only leaf nodes and will not allow selecting non-leaf nodes


single node selector (can select leaf and non-leaf nodes)
selectChildren: false
canSelectFolders: true
- this will select single value either leaf or non-leaf


children selector:
selectChildren: true
canSelectFolders: true
- clicking on a node will select it's children and node, clicking on a leaf node will select only that node


This config:
selectChildren: true
canSelectFolders: false
- is invalid, you cannot select children without node


*/

//function fillProjectTree() {
//	
//	
//	console_log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6');
//	
//	
//	var obj = Ext.getCmp('mytree');
//	
//	obj.setValue('3280002718');
//	
//	/*
//	: function(valueInit)
//	var treePanel = obj.tree;
//	 var node = treePanel.getStore().getNodeById('3280002718'); //JA13M0003
//	    console_log(node);
//
//	
//	    treePanel.getSelectionModel().select(node);
//
//	   // console_log(node.getPath() + ' is finished');
//	   */
//}

var callType = '';
var text_value='';
var is_complish = '';
Ext.define('Ext.ux.TreeCombo',
{
	extend: 'Ext.form.field.Picker',
	alias: 'widget.treecombo',
	tree: false,
	
	
	constructor: function(config)
	{
		this.addEvents(
		{
			"itemclick" : true
		});
		
//		console_log(config);
//		console_log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6');
//		console_log(config.listeners);

		this.listeners = config.listeners;
		this.callParent(arguments);
		
		//getStore().getNodeById('123')
		
//	    var nodePath = this.getPath/*getNodeById*/("15");
//	    //console.log(nodePath);
//	    this.tree.expandPath(nodePath); 
//	    var node = this.tree.getStore().getNodeById('15');
//	    //console.log(node);
//	    this.tree.getSelectionModel().select(node);
//	   
//	    this.itemTreeClick(view, record, item, index, e, eOpts, me);
		
	},
	records: [],
	recursiveRecords: [],
	ids: [],
	id :'combotree',
	selectChildren: true,
	canSelectFolders: true,
	multiselect: false,
	displayField: 'pl_no',
	valueField: 'id',
	treeWidth: 300,
	matchFieldWidth: false,
//	treeHeight: 400,
	masN: 0,
	recursivePush: function(node, setIds)
	{
		var	me = this;


		me.addRecRecord(node);
		if(setIds) me.addIds(node);
		
		node.eachChild(function(nodesingle)
		{
			if(nodesingle.hasChildNodes() == true)
			{
				me.recursivePush(nodesingle, setIds);
			}
			else
			{
				me.addRecRecord(nodesingle);
				if(setIds) me.addIds(nodesingle);
			}
		});
	},
	recursiveUnPush: function(node)
	{
		var	me = this;
		me.removeIds(node);
		
		node.eachChild(function(nodesingle)
		{
			if(nodesingle.hasChildNodes() == true)
			{
				me.recursiveUnPush(nodesingle);
			}
			else me.removeIds(nodesingle);
		});
	},
	addRecRecord: function(record)
	{
		var	me = this;


		for(var i=0,j=me.recursiveRecords.length;i<j;i++)
		{
			var item = me.recursiveRecords[i];
			if(item)
			{
				if(item.getId() == record.getId()) return;
			}
		}
		me.recursiveRecords.push(record);
	},
	
	afterLoadSetValue: false,
	setValue: function(valueInit)
	{
//		console_log('1 valueInit:' + valueInit);
		if(typeof valueInit == 'undefined') return;
		
		var	me = this,
			tree = this.tree,
			values = (valueInit == '') ? [] : valueInit.split(','),
			valueFin = [];
			
		inputEl = me.inputEl;

		if(tree.store.isLoading())
		{
			me.afterLoadSetValue = valueInit;
		}


		if(inputEl && me.emptyText && !Ext.isEmpty(values))
		{
			inputEl.removeCls(me.emptyCls);
		}


		if(tree == false) return false;
		
		var node = tree.getRootNode();
		if(node == null) return false;
		
		me.recursiveRecords = [];
		me.recursivePush(node, false);
		
		me.records = [];
		Ext.each(me.recursiveRecords, function(record)
		{
			var	 id = record.get(me.valueField);
			
//			console_log('setValue values : '+values);
//			console_log('setValue id '+id);
			if(values == id) { //IE 호환성 유지.
				var text_pjcode = record.get(me.displayField);
				var sub_text_pjcode = text_pjcode;
//				valueFin.push(record.get(me.displayField));
				valueFin.push(sub_text_pjcode);
				if(me.multiselect == true) record.set('checked', true);
				me.addRecord(record);
				
			} else{
				var index = -1;
				try{
					index = values.indexOf(''+id);
				 }catch(e){}
	
				if(me.multiselect == true) record.set('checked', false);
				
				if(index != -1)
				{
					valueFin.push(record.get(me.displayField));
					if(me.multiselect == true) record.set('checked', true);
					me.addRecord(record);
				}
			}
		});
//		console_log('2 valueInit:' + valueInit);
		me.value = valueInit;
//		console_log(valueFin.join(', '));
		me.setRawValue(valueFin.join(', '));//combobox에 value값 띄우는곳.
		me.checkChange();
		me.applyEmptyText();
		return me;
	},
	getValue: function() 
	{
		return this.value;
	},
	getSubmitValue: function()
	{
		return this.value;
	},
	checkParentNodes: function(node)
	{
		if(node == null) return;
		
		var	me = this,
			checkedAll = true;


		node.eachChild(function(nodesingle)
		{
			var	id = nodesingle.getId(),
				index = me.ids.indexOf(''+id);
				
			if(index == -1) checkedAll = false;
		});
		
		if(checkedAll == true)
		{
			me.addIds(node);
			me.checkParentNodes(node.parentNode);
		}
		else
		{
			me.removeIds(node);
			me.checkParentNodes(node.parentNode);
		}
	},
	initComponent: function() 
	{
		var	me = this;
		
		me.tree = Ext.create('Ext.tree.Panel',
		{
			alias: 'widget.assetstree',
			hidden: true,
			rootVisible: (typeof me.rootVisible != 'undefined') ? me.rootVisible : true,
			floating: true,
			useArrows: true,
			width: me.treeWidth,
			autoScroll: true,
			height: me.treeHeight,
			store: me.store,
			trackMouseOver: true,  
            height: 300,  
            lines: true,  
            singleExpand: true,
			listeners:
			{
				load: function(store, records)
				{
//					console.log('records : '+records);
//			    	console.log('records.data : '+records.data);
//			    	console.log('records.data.text : '+records.data.text);
//			    	console.log('records.data.id :'+records.data.id);
//			    	console.log('records.data.leaf: '+records.data.leaf);
//			    	console.log('store : '+store);
//			    	console.log('store.data : '+store.data);
//			    	console.log(store.data.text);
//			    	console.log(store.data.id);
//			    	console.log(store.data.leaf);
					if(me.afterLoadSetValue != false)
					{
						me.setValue(me.afterLoadSetValue);
					}
				},
				itemclick:  function(view, record, item, index, e, eOpts)
				{
//					console.log('itemclick: -----------------');
//			    	console.log(record);
//			    	console.log(record.data);
			    	//console.log(record.data.text);
			    	//console.log(record.data.id);
			    	//console.log(record.data.leaf);
			    	
			    	//record.data.text = '1234';
			    	//console.log('------------------');
			    	//console.log(view);
//			    	console.log(index);
//			    	console.log(e);
//			    	console.log(eOpts);
			    	var pj_code = record.data.text;
			    	var rec= record.data.id;
			    	var hier_pos = record.data.context;
			    	var ac_uid = record.data.ac_uid;
			    	var pl_no = record.data.pl_no;
			    	var depth = record.data.depth;
//			    	addAction.enable();
//			    	console_log('%%%%%%%%%%%%%%%%%%');
//			    	console.log(record.data);
					if(rec != undefined){
						
						var id = rec.substring(0,10);
				    	var order_com_unique = rec.substring(11,21);
				    	var uid_srcahd = rec.substring(22,33);
				    	var sub_PjCode = pj_code.substring(0,12);
						
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread',
							params:{
								id : id
							},
							success : function(result, request) {
								var obj = Ext.decode(result.responseText);
								console_log('*****************');
//								var description = obj.datas[0].description;
//								var cav_no = obj.datas[0].cav_no;
//								var regist_date = obj.datas[0].regist_date;
//								var delivery_plan = obj.datas[0].delivery_plan;
//								var pm_id = obj.datas[0].pm_id;
//								var item_code = obj.datas[0].pj_code;
//								is_complish = obj.datas[0].is_complished;
								
								if(vCUR_MENU_CODE == 'DBM1' ){
									if(is_complish=='Y'){
										addAction.disable();
										addNxExcel.disable();
										removeAction.disable();
						            	process_requestAction.disable();
						            	purchase_requestAction.disable();
						            	editAction.disable();
						            	//addElecAction.disable();
									}else{
										addAction.enable();
										addNxExcel.enable();
										removeAction.disable();
						            	process_requestAction.disable();
						            	purchase_requestAction.disable();
						            	editAction.disable();
						            	//addElecAction.disable();
									}
								}
//								if(regist_date.length>10) {
//				 					regist_date = regist_date.substring(0,10);
//				 				}
//				 				if(delivery_plan.length>10) {
//				 					delivery_plan = delivery_plan.substring(0,10);
//				 				}
//				 				if(vCUR_MENU_CODE != 'PPO2' && vCUR_MENU_CODE != 'SDL1' && vCUR_MENU_CODE != 'VMF7' && vCUR_MENU_CODE != 'DBM8'){
////					 				Ext.getCmp('pj_srchDescription').setValue(description);
//					 				if(vCUR_MENU_CODE != 'DBM1_ELE'){
//					 				//Ext.getCmp('pj_srchPj_name').setValue(pj_type);
//					 				Ext.getCmp('pj_srchCav_no').setValue(cav_no);
//					 				Ext.getCmp('pj_srchRegist_date').setValue(regist_date);
//					 				Ext.getCmp('pj_srchDelivery_plan').setValue(delivery_plan);
//					 				CommonUsrAst.load(pm_id ,{
//					 					 success: function(usrAst) {
//					 						 try{
//					 							var user_name = usrAst.get('user_name');
//					 							Ext.getCmp('pj_srchPm_id').setValue(user_name);
//					 						 }catch(e){}
//					 			 		 }//endofsuccess
//					 				 });//emdofload
//					 				}
//				 				}
								switch(vCUR_MENU_CODE) {
				        		case 'DBM1':
//				        		case 'EPC1':
				        		case 'PMT1':
				        			selectedAssyUid = uid_srcahd;
				               		selectedMoldUid = id;
				               		selectedMoldCode = sub_PjCode;
				               		selectedMoldCoord = order_com_unique;
				               		selectedPj_code = pj_code;
//				               		selectedMoldName = pj_name;
	//			     				addAction.enable();
				     				store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
				     				store.load({});
				        			break;
				        		case 'PMT2':
				        			selectedAssyUid = uid_srcahd;
				               		selectedMoldUid = id;
				               		selectedMoldCode = sub_PjCode;
				               		selectedMoldCoord = order_com_unique;
				        			break;
				        		case 'PPO2_CLD':
				        			selectedAssyUid = id;
				        			store.getProxy().setExtraParam('assy_uid', selectedAssyUid);
//				               		alert(selectedAssyUid);
				        			store.load({});
				        			break;
				        		case 'PRF1':
				        		case 'PPR4':
				        		case 'EPC7':
				        		case 'EPC8':
				        		case 'EPC1':
				        		case 'VST1':
				        			selectedAssyUid = id;
				               		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
				     				store.load({});
				     				break;
				        		case 'DBM1_ELE':
				        			selectedAssyUid = id;
				        			storeL.getProxy().setExtraParam('ac_uid', selectedAssyUid);
				        			storeL.getProxy().setExtraParam('standard_flag', 'O');
				        			storeL.load({});
				     				break;
				        		case 'EPJ1':
				        			selectedMoldUid = id;
				        			selectedAssyUid = uid_srcahd;
				        			storeCartLine.getProxy().setExtraParam('ac_uid', selectedMoldUid);
				     				storeCartLine.load({});
				     				break;
				        		case 'DBM8':
				        			selectedAssyUid = uid_srcahd;
				        			selectedMoldUid = id;
				     				store.getProxy().setExtraParam('parent', selectedAssyUid);
				     				store.getProxy().setExtraParam('status', 'PR');
				     				store.load({});
				        			break;
				        		case 'PPO1_CLD':
				        		case 'PMT1_CLD':
				        			selectedAssyUid = ac_uid;
				        			selectedMoldUid = id;
//				        			console_log('selectedAssyUid : '+selectedAssyUid);
				        			if(depth==1){
				        				store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
				        				store.getProxy().setExtraParam('hier_pos','');
				        				store.load({});
				        			}
				        			else{
							    		if(depth==2){
							    			
							    			hier_pos = hier_pos.substring(0,3);
								    	}
								    	if(depth==3){
								    		hier_pos = hier_pos.substring(0,6);
								    	}
								    	if(depth==4){
								    		hier_pos = hier_pos.substring(0,9);
								    	}
								    	if(depth==5){
								    		hier_pos = hier_pos.substring(0,12);
								    	}
				        				store.getProxy().setExtraParam('hier_pos', hier_pos);
				        				store.load({});
				        								        				
				        			}
				        			break;
				        		case 'PPO3_CLD':
				        			selectedAssyUid = ac_uid;
				        			selectedMoldUid = id;
//				        			console_log('selectedAssyUid : '+selectedAssyUid);
				        			if(depth==1){
				        				store.getProxy().setExtraParam('pjUid', selectedAssyUid);
				        				store.load({});
				        			}
				        			else{
							    		if(depth==2){
							    			
							    			hier_pos = hier_pos.substring(0,3);
								    	}
								    	if(depth==3){
								    		hier_pos = hier_pos.substring(0,6);
								    	}
								    	if(depth==4){
								    		hier_pos = hier_pos.substring(0,9);
								    	}
								    	if(depth==5){
								    		hier_pos = hier_pos.substring(0,12);
								    	}
				        				store.getProxy().setExtraParam('hier_pos', hier_pos);
				        				store.load({});
				        								        				
				        			}
				        			break;
				        		default:
				        			selectedAssyUid = id;
				        			selectedMoldUid = uid_srcahd;
				               		break;
				        		}
				        		
						    	var paramValue = id + ';' + selectedAssyUid; //+ //pj_code + ';' + ac_uid + ';' + selectedAssyUid
						    	console_log('paramValue : '+paramValue);
						    	console_log('selectedAssyUid : '+selectedAssyUid);
						    	console_log('selectedMoldUid : '+selectedMoldUid);
						    	console_log('hier_pos : '+hier_pos);
						    	console_log('depth : '+depth);
						    	console_log('pl_no : '+pl_no);
//						    	Ext.getCmp('combotree').setValue(pl_no);;
						    	
						    	
				        		if(vCUR_MENU_CODE=='EPC1' || vCUR_MENU_CODE=='EPJ1' || vCUR_MENU_CODE=='EPC8' ) {
				        			paramValue = paramValue + ';' + 'O' ;
				        		}
								me.itemTreeClick(view, record, item, index, e, eOpts, me);
				           	                    	
				            	console_log('call ajax default Set');
				 				Ext.Ajax.request({
				 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
				 					params:{
				 						paramName : 'CommonProjectAssy',
				 						paramValue : paramValue
				 					},
				 					
				 					success : function(result, request) {
				 						console_log('success defaultSet');
				 					},
				   	 				failure: function(result, request){
				   	 					console_log('fail defaultSet');
				   	 				}
				 				});
							},
							failure: extjsUtil.failureMessage
						});	
			    	}else{
			    		return null;
			    	}
			    	
				}
			}
		});
		me.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
            	console_log("text_value:"+e.target.value);
            	text_value = e.target.value;
            	if(text_value.length>=4){
					storeMenu.getProxy().setExtraParam('parent',text_value);
					storeMenu.load({});
					this.onTriggerClick();
	        	}else{
	        		Ext.MessageBox.alert('Error',dbm1_min_content );
	        	}
//                this.onTriggerClick();
            }
        }, me);
		if(me.tree.getRootNode().get('checked') != null) me.multiselect = true;
		
		this.createPicker = function()
		{
			var	me = this;
			return me.tree;
		};
		
		this.callParent(arguments);
	},
	addIds: function(record)
	{
		var	me = this;
		//console.log('record.get(me.valueField) : ' +me.valueField);
    	//console.log('record.data.text : ' +record.data.text);
    	//console.log('record.data.id : ' +record.data.id);
    	//console.log('record.data.leaf : ' +record.data.leaf);
    	
		var	 values = me.ids;
		var id = record.getId() + '';
		try {
			if(values.indexOf(id) == -1){ 
				//me.ids.push(''+record.get(record.data.text));
				me.ids.push(''+record.get(me.valueField));
			}				
		} catch (e) {//ie호환
		    if(values != id) {
		    	me.ids.push(''+record.get(me.valueField));
		    }
		}
		
    	
	},
	removeIds: function(record)
	{
		var	me = this,
			index = me.ids.indexOf(''+record.getId());
			
		if(index != -1)
		{
			me.ids.splice(index, 1);
		}
	},
	addRecord: function(record)
	{
		var	me = this;
		for(var i=0,j=me.records.length;i<j;i++)
		{
			var item = me.records[i];
			if(item)
			{
				if(item.getId() == record.getId()) return;
			}
		}
		me.records.push(record);
	},
	removeRecord: function(record)
	{
		var	me = this;


		for(var i=0,j=me.records.length;i<j;i++)
		{
			var item = me.records[i];
			if(item && item.getId() == record.getId()) delete(me.records[i]);
		}
	},
	itemTreeClick: function(view, record, item, index, e, eOpts, treeCombo)
	{
		var	me = treeCombo,
			checked = !record.get('checked');//it is still not checked if will be checked in this event
		if(me.multiselect == true) record.set('checked', checked);//check record
		
		var node = me.tree.getRootNode().findChild(me.valueField, record.get(me.valueField), true);
		if(node == null) 
		{
			if(me.tree.getRootNode().get(me.valueField) == record.get(me.valueField)) node = me.tree.getRootNode();
			else return false;
		}
		
		if(me.multiselect == false) me.ids = [];
		//if it can't select folders and it is a folder check existing values and return false
		if(me.canSelectFolders == false && record.get('leaf') == false)
		{
			me.setRecordsValue(view, record, item, index, e, eOpts, treeCombo);
			return false;
		}
		
		//if record is leaf
		if(record.get('leaf') == true) 
		{
			if(checked == true)
			{
				me.addIds(record);
			}
			else
			{
				me.removeIds(record);
			}
		}
		else //it's a directory
		{			
			me.recursiveRecords = [];
			if(checked == true)
			{
				if(me.multiselect == false)
				{
					if(me.canSelectFolders == true) me.addIds(record); 
				}
				else
				{
					if(me.canSelectFolders == true)
					{
						me.recursivePush(node, true);
					}
				}
			}
			else
			{
				if(me.multiselect == false)
				{
					if(me.canSelectFolders == true) me.recursiveUnPush(node);
					else me.removeIds(record);
				}
				else me.recursiveUnPush(node);
			}
		}
		
		//this will check every parent node that has his all children selected
		if(me.canSelectFolders == true && me.multiselect == true) me.checkParentNodes(node.parentNode);
		
		me.setRecordsValue(view, record, item, index, e, eOpts, treeCombo);
	},
	fixIds: function()
	{
		var me = this;
		
		for(var i=0,j=me.ids.length;i<j;i++)
		{
			if(me.ids[i] == 'NaN') me.ids.splice(i, 1);
		}
	},
	setRecordsValue: function(view, record, item, index, e, eOpts, treeCombo)
	{
		
		//console.log(record);
		//console.log(item);
		//console.log(e);
		//console.log(eOpts);
		//console.log(treeCombo);
		
		var	me = treeCombo;
		
		me.fixIds();
		
		//console.log(me.ids.join(','));

		
		var value = record.data.text;
		var arr = value.split(' ');
//		console.log(arr[0]);
		if(arr.length == 1) {//완료,미완료 때문에 3으로 결정.
			me.setValue(me.ids.join(','));
		}
		if(arr.length == 3) {
			me.setValue(me.ids.join(','));
		} else {
			//me.setValue(-1);
		}

//		
//		me.setValue(arr[0]);
		
		


		me.fireEvent('itemclick', me, record, item, index, e, eOpts, me.records, me.ids);


		if(me.multiselect == false) me.onTriggerClick();
	},
	getPath : function(id){
        var node = this.tree.getStore().getNodeById(id);
        if(node){
            return node.getPath();
        }
        
        console_log('in getPath');
//        console_log(this.tree);
//        console_log(this.tree.root);
//        var paths = this.tree.root.getPath();
        console_log('ok');
        forEach = function(list, fun, sope){
            if(!list || list.length == 0){
                return;
            }
            for(var i = 0, length = list.length; i < length; i++){
                var node = list[i];
                var args = [];
                args.push(node);
                if(arguments.length > 3){
                    for(var ii = 3; ii < arguments.length; ii++){
                        args.push(arguments[ii]);
                    }
                }
                var result = fun.apply(sope, args);
                if(result){
                    return result;
                }
            }
        };

        getChildNodes = function(parent){
            var children = parent.children || parent.childNodes;
            if(children && children.length == 0 && parent.attributes){
                children = parent.attributes.children;
            }
            return children;
        };

        getPath = function(item, paths){
            if(item.id == id){
                return paths + "/" + item.id;
            }
            return forEach(getChildNodes(item), getPath, this, paths + "/" + item.id);
        };
        return forEach(getChildNodes(this.tree.root), getPath, this, paths);
    }
	


});



var storeMenu = Ext.create('Ext.data.TreeStore', {
	expanded: true,
	fields:[     
            {name : 'id'}
            ,{name : 'callType'}
            ,{name : 'context'}
            ,{name : 'parent'}
            ,{name : 'node'}
            ,{name : 'text'}
            ,{name : 'ac_uid'}
            ,{name : 'pl_no'}
            ,{name : 'unique_uid'}
            ,{name : 'folder'}
	  ],
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudprojectTree',
//         params:{
//        	 callType : 'TOP'
//		 },
         reader: {
             type: 'json',
             root: 'datas'
         }
           
     },
	listeners: {
	    beforeload: function(sender,node,records){
	    	console_log('beforeload: -----------------');
//	    	console.log(records);
	    	//console.log(records.data);
	    	//console.log('node.data.text : '+node.node.data.text);
	    	var id = node.node.data.id;
	    	var parent=node.node.data.text;
	    	var context = node.node.data.context;
	    	var folder = node.node.data.folder;
	    	if(parent!='Root'){
	    		var callType = '';
	    		this.getProxy().setExtraParam('parent', id);
		    	this.getProxy().setExtraParam('callType', callType);
		    	this.getProxy().setExtraParam('parentFolder', folder);
	    	}
	    	else{
	    		var callType = 'TOP';
		    	this.getProxy().setExtraParam('callType', callType);
	    	}
	    },
	    load: function(sender,node,records){
	    	console_log('load: -----------------');
	    	callbackToolbarRenderrer(callType);
	    	

	    }//endofload,
	}
});

function callbackToolbarRenderrer(callType) {
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',			
		params:{
			paramName : 'CommonProjectAssy'
		},
		success : function(result, request) {
			var Pjassy = result.responseText;
			console_log('Pjassy:'+Pjassy);
			var id = Pjassy.substring(0,10);
			console_log('id : '+id);
			treatCommonProjectAssy1(id, callType);
		}
	}); 
}

function treatCommonProjectAssy1(id, combo) {

		    		Ext.Ajax.request({
						url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread',
						params:{
							id : id
					},
					success : function(result, request) {
		 				switch(vCUR_MENU_CODE) {
			    		case 'PMT2':
			    			selectedAssyUid = uid_srcahd;
			           		selectedMoldUid = id;
			           		selectedMoldCode = Sub_pj_code;
			           		selectedMoldCoord = order_com_unique;
//				 				addAction.enable();
//			 				store.getProxy().setExtraParam('item_code', item_code);
//			 				store.load({});
			    			break;
			    		case 'DBM1':
			    		case 'PMT1':
			    			selectedAssyUid = uid_srcahd;
			           		selectedMoldUid = id;
			           		selectedMoldCode = Sub_pj_code;
			           		selectedMoldCoord = order_com_unique;
			           		selectedPj_code = pj_code;
			           		break;
//				    		case 'PPO1_CLD':
			    		case 'DBM8':
		        			selectedAssyUid = uid_srcahd;
		        			selectedMoldUid = id
		     				store.getProxy().setExtraParam('parent', selectedAssyUid);
		     				store.getProxy().setExtraParam('status', 'PR');
		     				break;
			    		case 'PPR4':
			    		case 'VST1':
//			    		case 'EPC1':
//				    		case 'PRF1':
		        			selectedAssyUid = id;
		               		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
//			     				store.load({});
		     				break;
		    			default:
		    				selectedAssyUid = id;
		    				console_log('combo_id = ' + id);
			    			break;
			    		}
					},
					failure: extjsUtil.failureMessage
				});	
//		    	}//endofif
//			} 
//		},
//		failure: function(result, request){
//			console_log('fail project');
//		} /*extjsUtil.failureMessage*/
//	});
}

var actionBomCopy = Ext.create('Ext.Action', {
	iconCls:'PSBOMView',
    text: copy_to_text,
    disabled: true,
    handler: function(widget, event) {
		//make uidlist
    	var uidList = '';
        var selections = grid.getSelectionModel().getSelection();
        if (selections) {
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var unique_id = rec.get('unique_id');
            		if(uidList=='') {
            			uidList = unique_id;
            		}else {
            			uidList = uidList + ';' + unique_id;
            		}
            	}
        }
    	
        console_log('---------------------------------------------');
        console_log('uidList=' + uidList);//
        console_log('selectedMoldCoord=' + selectedMoldCoord);//
        console_log('selectedAssyUid=' + selectedAssyUid);
        console_log('selectedMoldUid=' + selectedMoldUid);//
        
       	Ext.Ajax.request({
				url: CONTEXT_PATH + '/design/bom.do?method=exportBom',				
			params:{
        		toPjUidAssy: selectedMoldCoord,		//order_com_unique
        		toPjUid: selectedMoldUid,		//ac_uid
        		uidSrcahd : selectedAssyUid,
        		uidList: uidList
			},
			success : function(result, request) {
				Ext.MessageBox.alert('Info','Bom Copy is done.');

			},//endof success for ajax
			failure: extjsUtil.failureMessage
       	}); //endof Ajax
    }
});
//pasteAction = actionBomCopy;

// Here the combotree are created to be used after on the system

var combotree = Ext.create('Ext.ux.TreeCombo', {
    margin:0,
    width:120,
    treeWidth: 240,
    rootVisible: false,
    id: 'mytree',
    disabled: false,
    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    store : storeMenu
});
