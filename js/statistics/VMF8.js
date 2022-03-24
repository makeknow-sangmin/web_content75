var cellEditing_plan = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var cellEditing_week = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

//*****************************GLOBAL VARIABLE**************************/
var fieldSmall = [];
var columnSmall = [];
var tooltipSmall = [];

var planGrid = null;
var weekGrid = null;
var smallGrid = null;
var store_overal = null;
var store_detail = null;
var store_small = null;
var Description = '';
var Mold_name = '';
var Model = '';
var Weeks = '';
var Store_type = '';

function changeTab(selectedTab){
	console_log('selectedTab:' +selectedTab);
	
	if(selectedTab == 'week'){
		Store_type = 'detail';
		store_detail.load({});
	}else if(selectedTab == 'small'){
		Store_type = 'weeks';
		store_small.getProxy().setExtraParam('description', '#EMPTY');
		store_small.load({});
	}else{
		store_overal.load({});
	}
}

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

var addFiled = Ext.create('Ext.Action', {
	id:'add',
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: CMD_ADD,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
    				title:panelSRO1136,
    				msg: vmf8_add,
    				buttons: Ext.MessageBox.YESNO,
    				fn: addFiledConfirm,
    				icon: Ext.MessageBox.QUESTION
    				});
    			}
});

var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

function deleteConfirm(btn){
    var selections = planGrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = planGrid.getSelectionModel().getSelection()[i];
        		var id = rec.get('id');
        		var mold_name = rec.get('mold_name');
        		var reminder = rec.get('reminder');
        		var weeks = rec.get('weeks');
        		
    			var pjttskduePlanoveral = Ext.ModelManager.create({
	           		unique_id : id,
	           		mold_name : mold_name,
	           		reminder : reminder,
	           		weeks : weeks
	        	 }, 'PjtTskDuePlanOveral');
        		
    			pjttskduePlanoveral.destroy( {
	           		 success: function() {}
	           	}); 
	           	count++;
        	}
        	Ext.MessageBox.alert('Check','Delete count : '+count);
        	planGrid.store.remove(selections);
        }
    }
};

function addFiledConfirm(btn){
	if(btn == 'yes'){
		var checked = true;
		for (var i = 0; i < store_overal.data.items.length; i++)
        {
    		var record = store_overal.data.items[i];
    		var reminder = record.get('reminder');
    		if(reminder == ''){
    			Ext.MessageBox.alert(error_msg_prompt, 'Please add the filed after the empty data create ');
    			checked = false;
    		}
        }
		if(checked == true){
			Ext.Ajax.request({
        		url: CONTEXT_PATH + '/statistics/task.do?method=createfiled',
        		params:{},
        		success : function(result, request) {
        			store_overal.load(function() {});
        		},
        		failure: extjsUtil.failureMessage
        	});	
		}
	}
}

var addAction = Ext.create('Ext.Action', {
	itemId: 'saveButton',
	iconCls:'Save',
    text: panelSRO1133,
    disabled: true,
    handler: function(widget, event) {
    	var modifyIno = [];
    	var havedata = true;
    	for (var i = 0; i < store_overal.data.items.length; i++)
        {
    		var record = store_overal.data.items [i];
    		if (record.dirty) {
    			var obj = {};   
    			var reminder = record.get('reminder');
    			var mold_name = record.get('mold_name');
    			var weeks = record.get('weeks');
    			if(reminder == '' || mold_name == '' || weeks == ''){
    				havedata = false;
    			}
    			obj['reminder'] = reminder;
    			obj['task_title_x'] = mold_name;
    			obj['text_type'] = weeks;
    			obj['description'] = record.get('');
    			obj['file_path'] = record.get('product_type');
    			obj['due_date'] = record.get('due_date');
    			obj['unique_id'] = record.get('id');
    			obj['task_type'] = '';
    			obj['location'] = '';
    			modifyIno.push(obj);
    		}
        }

    	var strmod =  Ext.encode(modifyIno);
    	console_log('strmod:');
    	console_log(strmod);
    	if(havedata == false){
    		Ext.MessageBox.alert(error_msg_prompt, 'Please input the data in empty box');
    	}else{
  		Ext.Ajax.request({
 			url: CONTEXT_PATH + '/statistics/task.do?method=createfiled',
 			params:{
 				modifyIno : strmod,
 				srch_type : 'update'
 			},
 			success : function(result, request) {   
 				store_overal.load(function() {});
 			}
  		});
    	}
    }//endof handlwe
});//endof define action

var addAction_detail = Ext.create('Ext.Action', {
	itemId: 'detail_saveButton',
	iconCls:'Save',
    text: panelSRO1133,
    disabled: true,
    handler: function(widget, event) {
    	var text_type = Ext.getCmp('text_type').getValue();
    	
    	var modifyIno = [];
    	for (var i = 0; i < store_detail.data.items.length; i++)
        {
    		var record = store_detail.data.items [i];
    		if (record.dirty) {
    			var obj = {};   
    			obj['reminder'] = record.get('model');
    			obj['task_title_x'] = record.get('mold_name');
    			obj['description'] = '#DUE_PLAN_DETAIL';
    			obj['due_date'] = record.get('due_date');
    			obj['file_path'] = record.get('product_type');
    			obj['noti_flag'] = record.get('noti_flag');
    			obj['unique_id'] = record.get('id');
    			obj['text_type'] = text_type;
    			obj['task_type'] = record.get('type');
    			obj['location'] = record.get('comment');
    			modifyIno.push(obj);
    		}
        }
    	var strmod =  Ext.encode(modifyIno);
    	console_log('strmod:');
    	console_log(strmod);
  		Ext.Ajax.request({
 			url: CONTEXT_PATH + '/statistics/task.do?method=updatedetail',
 			params:{
 				modifyIno : strmod,
 			},
 			success : function(result, request) {   
 				store_detail.load(function() {});
 			}
  		});
    }
});

var win;
var graphAction = Ext.create('Ext.Action', {
	itemId: 'graphButton',
    iconCls: 'AllocationMapRevision',
    text: 'ELE Chart',
    disabled: true,
    handler: function(widget, event) {
    	var selections = weekGrid.getSelectionModel().getSelection();
    	if(selections.length > 1){
    		Ext.MessageBox.alert('No','Please Just one check!!');
    	}else{
    		var rec = weekGrid.getSelectionModel().getSelection()[0];
    		var camen = rec.get('camen');
    		var cncen = rec.get('cncen');
    		var type = rec.get('type');
    		var pj_uid = rec.get('pj_uid');
    		if(camen == '' || cncen == ''){
    			Ext.MessageBox.alert('No','Do not have data!!');
    		}else{
    			PjtTskDuePlanChart.getProxy().setExtraParam('type', type);
    			PjtTskDuePlanChart.getProxy().setExtraParam('pj_uid', pj_uid);
    			PjtTskDuePlanChart.getProxy().setExtraParam('standard_flag', "E");
    			PjtTskDuePlanChart.getProxy().setExtraParam('not_standard_flag', "A");
    			PjtTskDuePlanChart.load(function(records) {
    				console_log(records);
    				var chart = Ext.create('Ext.chart.Chart', {
    					style: 'background:#fff',
    					animate: true,
    					shadow: true,
    					store: PjtTskDuePlanChart,
    					axes: [{
    						type: 'Numeric',
    						position: 'left',
    						fields: ['data'],
    						label: {
    							renderer: Ext.util.Format.numberRenderer('0,0')
    						},
    						grid: true,
    						minimum: 0,
    						maximum: 100
    					}, {
    						type: 'Category',
    						position: 'bottom',
    						fields: ['name']
    					}],
    					series: [{
    						type: 'column',
    						axis: 'left',
    						highlight: true,
    						tips: {
    							trackMouse: true,
    							width: 140,
    							height: 28,
    							renderer: function(storeItem, item) {
    								this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data')+'%');
    							}
    						},
    						label: {
    							display: 'insideEnd',
    							'text-anchor': 'middle',
    							field: 'data',
    							renderer: Ext.util.Format.numberRenderer('0'),
    							orientation: 'vertical',
    							color: '#333'
    						},
    						xField: 'name',
    						yField: 'data',
    					}]
    				});
    				
    				var win = Ext.create('Ext.window.Window', {
    					width: 800,
    					height: 600,
    					minHeight: 400,
    					minWidth: 550,
    					hidden: false,
    					maximizable: true,
    					title: 'Electrode Chart',
    					autoShow: true,
    					layout: 'fit',
    					items: chart    
    				});
    				win.show();
    			});
    		}
    	}
	 }
});

var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [graphAction]
});

Ext.define('PjtTskDuePlanOveral', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/statistics/task.do?method=readPlanChartOveral',
	        	destroy: CONTEXT_PATH + '/statistics/task.do?method=destroyPlanChart'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});

Ext.define('PjtTskDuePlanDetail', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	    proxy: {
			type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/statistics/task.do?method=readPlanChartDetail',
	        	destroy: CONTEXT_PATH + '/statistics/task.do?method=destroy'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});

Ext.define('PjtTsk', {
	extend: 'Ext.data.Model',
	fields: [
			{name: 'unique_id', type: "string"}
			,{name: 'start_plan', type: "sdate"}
			,{name: 'task_title', type: "string"}
			,{name: 'task_title_x', type: "string"}
			,{name: 'pj_name', type: "string"}
			,{name: 'cav_no', type: "string"}
			,{name: 'file_path', type: "string"}
			,{name: 'due_date', type: "string"}
			,{name: 'location', type: "string"}
	         ],
	proxy: {
		type: 'ajax',
		api: {
			read: CONTEXT_PATH + '/statistics/task.do?method=readPlanChartSmall'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		},
		writer: {
			type: 'singlepost',
			writeAllFields: false,
			root: 'datas'
		} 
	}
});

var ProjectMoldStore = new Ext.create('Ext.data.Store', {
	fields:[     
	        { name: 'id', type: "int" },
	     { name: 'unique_id', type: "string" }
	     ,{ name: 'description', type: "string"  }
	     ,{ name: 'pj_type', type: "string"  }
	     ,{ name: 'pj_code', type: "string"  }
	        ],
    sorters: [{
        property: 'pj_code',
        direction: 'ASC'
    }],
    proxy: {
    	type: 'ajax',
    	url: CONTEXT_PATH + '/sales/poreceipt.do?method=readMold',
    	reader: {
    		type:'json',
    		root: 'datas',
    		totalProperty: 'count',
    		successProperty: 'success'
    	}
	,autoLoad: true
    }
});

var PjtTskDuePlanChart = new Ext.create('Ext.data.Store', {
	fields:[     
	        { name: 'id', type: "int" },
	        { name: 'unique_id', type: "string" }
	        ,{ name: 'name', type: "string"  }
	        ,{ name: 'data', type: "string"  }
	        ],
    sorters: [{
    	property: 'pj_code',
    	direction: 'ASC'
    }],
    proxy: {
    	type: 'ajax',
    	url: CONTEXT_PATH + '/statistics/task.do?method=pjtTskDuePlanChart',
    	reader: {
    		type:'json',
    		root: 'datas',
    		totalProperty: 'count',
    		successProperty: 'success'
    	}
	,autoLoad: true
    }
});

Ext.onReady(function() {  
	var projectSomeInfo = Ext.create('Mplm.store.ProjectSomeInfo', {} );
	var pjtTskDuePlaneStore = Ext.create('Mplm.store.PjtTskDuePlaneStore', {} );
	
	store_overal = new Ext.data.Store({  
//		pageSize: getPageSize(),
		model: 'PjtTskDuePlanOveral',
		sorters: [{
            property: 'unique_id_long',
            direction: 'DESC'
        }]
	});
	
	store_detail = new Ext.data.Store({  
//		pageSize: getPageSize(),
		model: 'PjtTskDuePlanDetail',
		sorters: [{
			property: 'unique_id',
			direction: 'ASC'
		}]
	});
	
	store_small = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PjtTsk',
		sorters: [{
			property: 'start_plan',
			direction: 'ASC'
		}]
	});
	
	store_overal.load(function(records) {
		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				if('reminder' == dataIndex) {
			        columnObj["editor"] = {
			        		id:				'reminder',
			        		xtype:          'combo',
		                    mode:           'local',
		                    triggerAction:  'all',
		                    editable:false,
		                    forceSelection: true,
		                    queryMode: 'remote',
		                    name:           'reminder',
		                    displayField:   'description',
		                    valueField:     'description',
		                    store: projectSomeInfo,
		                    listConfig:{
		 	                	getInnerTpl: function(){
		 	                		return '<div data-qtip="{pj_type}"> {description} </div>';
		 	                	}			                	
		 	                },
		 	                listeners: {
		 		                 select: function (combo, record,rowIndex) {
		 		                 	var pj_type = record[0].get('pj_type');
		 		                 	var description = record[0].get('description');
		 		                 	var reminder = record[0].get('reminder');
		 		                 	var sel_model = planGrid.getSelectionModel();
		 		                 	var record1 = sel_model.getSelection()[0];
		 		                 	Description = description;
		 		                 	
		 		                 	ProjectMoldStore.getProxy().setExtraParam('description', Description);
		 		                 	ProjectMoldStore.load( function(records) {
		 		                 		var obj = Ext.getCmp('mold_name'); 
		 		                 		
		 		                 		
		 		                 		if(obj!=undefined){
		 		                 			obj.clearValue();//text필드에 있는 name 삭제
			 		                 		obj.store.removeAll();//class_code2필드에서 보여지는 값을 삭제
		 		                 			for (var i=0; i<records.length; i++){ 
		 		                 				var moldObj = records[i];
		 		                 				var pj_code = moldObj.get('pj_code');
		 		                 				
		 		                 				obj.store.add({
		 		                 					pj_code:  pj_code
		 		                 				});
		 		                 			}		
		 		                 		}
		 		                 		
		 		                 	});
		 		                 	record1.set('mold_name','');
		 		                 	record1.set('product_type',pj_type);
		 		                 }
		 	                }
	                };
			        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
				if('mold_name' == dataIndex) {
			        columnObj["editor"] = {
			        		id:				'mold_name',
			        		xtype:          'combo',
		                    mode:           'local',
		                    triggerAction:  'all',
		                    editable: true,
		                    queryMode: 'local',
		                    name:           'mold_name',
		                    displayField:   'pj_code',
		                    valueField:     'pj_code',
		                    multiSelect: true,
		                    store: ProjectMoldStore,
		                    listConfig:{
		 	                	getInnerTpl: function(){
		 	                		return '<div data-qtip="{description}"> {pj_code} </div>';
		 	                	}			                	
		 	                }
	                };
			        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
				if('weeks' == dataIndex) {
			        columnObj["editor"] = {
			        		id:				'weeks',
			        		xtype:          'combo',
		                    mode:           'local',
		                    triggerAction:  'all',
		                    forceSelection: true,
		                    editable:       false,
		                    allowBlank: false,
		                    resizable:false,
		    				sortable : false,
		                    name:           'weeks',
		                    displayField:   'name',
		                    valueField:     'value',
		                    queryMode: 'local',
		                    store:          Ext.create('Ext.data.Store', {
		                        fields : ['name', 'value'],
		                        data   : [
		                            {name : '9'+weekText,   value: '9'},
		                            {name : '11'+weekText,   value: '11'}
		                        ]
		                    })
	                };
			        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
				if('due_date' == dataIndex) {
					columnObj["editor"] = {
							summaryType: 'max',
					        xtype: 'datefield',
					        format: 'Y-m-d H:i:s'
					};
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
//					columnObj["renderer"] = Ext.util.Format.dateRenderer('Y-m-d H:i:s');
					columnObj["summaryRenderer"] = Ext.util.Format.dateRenderer('Y-m-d H:i:s');
					columnObj["resizable"] = false;
				}
			}
		});
		Ext.each(/*(G)*/vCENTER_COLUMN_SUB, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				if('due_date' == dataIndex) {
					columnObj["editor"] = {
							summaryType: 'max',
					        xtype: 'datefield',
					        format: 'Y-m-d H:i:s'
					};
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						if(record.data.noti_flag =='P'){
							p.tdAttr = 'style="background-color: #FFE4E4;"';
							return value;
						}
					};
//					columnObj["renderer"] = Ext.util.Format.dateRenderer('Y-m-d H:i:s');
					columnObj["summaryRenderer"] = Ext.util.Format.dateRenderer('Y-m-d H:i:s');
					columnObj["resizable"] = false;
				}
				if('comment' == dataIndex) {
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						if(record.data.noti_flag =='P'){
							p.tdAttr = 'style="background-color: #FFE4E4;"';
							return value;
						}
					};
					columnObj["editor"] = {
							xtype: 'textfield'
					};
				}
			}
		});

		gridTab = Ext.widget('tabpanel', {
			id : 'tempport',
	        activeTab: 0,
	        collapsible: true,
	        multiSelect: true,
	        title:getMenuTitle(),
	        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
	        region: 'center',
	        width:'60%',
	        height: getCenterPanelHeight(),
	        items: [
	              {
	            	  
	                title: vmf8_plan_big,
	                id: 'plan-tab-div',
	                listeners: {
	                    activate: function(tab){
	                        setTimeout(function() {
	                        	selectedTab = 'plan';
	                        	console_log(selectedTab);
	                        	changeTab(selectedTab);
	                        }, 1);
	                    }
	                }
	            },{
	                title: vmf8_plan_middle,
	                id: 'week-tab-div',
	                listeners: {
	                    activate: function(tab){
	                        setTimeout(function() {
	                        	selectedTab = 'week';
	                        	console_log(selectedTab);
	                        	changeTab(selectedTab);
	                        }, 1);
	                    }
	                }
	            },{
	            	title: vmf8_plan_small,
	            	id: 'small-tab-div',
	            	listeners: {
	            		activate: function(tab){
	            			setTimeout(function() {
	            				selectedTab = 'small';
	            				console_log(selectedTab);
	            				changeTab(selectedTab);
	            			}, 1);
	            		}
	            	}
	            }
	        ]
	    });
		//Load plan
		(new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    callback: function(records, operation, success) {
		    	console_log('come IN Overal');
		    	console_log(success);
		    	if(success ==true) {
		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		    		planGrid  = Ext.create('Ext.grid.Panel', {
		    			store: store_overal,
		    			selModel: selModel,
				        collapsible: false,
				        multiSelect: false,
				        stateId: 'planGrid' + /*(G)*/vCUR_MENU_CODE,
				        autoScroll: true,
				        autoHeight: true,
				        height: getCenterTapPanelHeight(),
				        columns: vCENTER_COLUMNS,
				        plugins: [cellEditing_plan],
//				        bbar: getPageToolbar(store),
				        dockedItems: [{
				        	xtype: 'toolbar',
				            items: [addFiled, removeAction, addAction]
				        }]
				    });
					console_log('created_grid Plan');
					planGrid.getSelectionModel().on({
		    			selectionchange: function(sm, selections) {
		    				if (selections.length) {
		    					console_log(selections);
		    					if(fPERM_DISABLING()==true) {
		    						removeAction.disable();
		    						addAction.disable();
				            	}else{
				            		removeAction.enable();
				            		addAction.enable();
				            	}
		    				}else {
				            	if(fPERM_DISABLING()==true) {
				            		removeAction.disable();
				            		removeAction.disable();
				            	}else{
				            		removeAction.disable();
				            		addAction.disable();
				            	}
		    				}
		    			}
		    		});
		    		var ptarget = Ext.getCmp('plan-tab-div');
		    		ptarget.removeAll();
		    		ptarget.add(planGrid);
		    		ptarget.doLayout();
		    	}//endof if(success..
		    },//callback
		    scope: this
		});	
		//Load Week
	    (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    callback: function(records, operation, success) {
		    	console_log('come IN Week');
		    	console_log(success);
		    	
		    	if(success ==true) {
		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		    		weekGrid  = Ext.create('Ext.grid.Panel', {
		    			store: store_detail,
		    			selModel: selModel,
				        collapsible: false,
				        multiSelect: false,
				        stateId: 'weekGrid' + /*(G)*/vCUR_MENU_CODE,
				        autoScroll: true,
				        autoHeight: true,
		                height: getCenterTapPanelHeight(),
				        columns: vCENTER_COLUMN_SUB,
				        plugins: [cellEditing_week],
//				        bbar: getPageToolbar(store_detail),
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true,
				            listeners: {
				                itemcontextmenu: function(view, rec, node, index, e) {
				                    e.stopEvent();
				                    contextMenu.showAt(e.getXY());
				                    return false;
				                }
				            }
				        },
				        dockedItems: [{
				        	xtype: 'toolbar',
				            items: [searchAction,{
				            	id:				'docked_reminder',
				            	xtype:          'combo',
			                    mode:           'local',
//			                    triggerAction:  'all',
//			                    mode: 'local',
			                    editable:false,
//			                    forceSelection: true,
			                    queryMode: 'remote',
//			                    name:           'reminder',
			                    displayField:   'reminder',
			                    valueField:     'reminder',
			                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			                    store: pjtTskDuePlaneStore,
			                    listConfig:{
			 	                	getInnerTpl: function(){
			 	                		return '<div data-qtip="{task_title_x}"> {reminder} </div>';
			 	                	}			                	
			 	                },
			 	                listeners: {
			 		                 select: function (combo, record,rowIndex) {
			 		                	Model = record[0].get('reminder');
			 		                	Mold_name = record[0].get('task_title_x');
			 		                 }
			 	                }
				            },{
				            		id:				'text_type',
					        		xtype:          'combo',
				                    mode:           'local',
				                    width:			80,
				                    triggerAction:  'all',
				                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				                    forceSelection: true,
				                    editable:       false,
				                    allowBlank: false,
				                    resizable:false,
				    				sortable : false,
				                    name:           'text_type',
				                    displayField:   'name',
				                    valueField:     'value',
				                    queryMode: 'local',
				                    store:          Ext.create('Ext.data.Store', {
				                        fields : ['name', 'value'],
				                        data   : [
				                            {name : '9'+weekText,   value: '9'},
				                            {name : '11'+weekText,   value: '11'}
				                        ]
				                    }),
				                    listeners: {
				 		                 select: function (combo, record,rowIndex) {
				 		                	Weeks = record[0].get('value');
				 		                 }
				 	                }
				            },addAction_detail,graphAction]
				        }]
				    });
		    		console_log('created_grid Week');
		    		weekGrid.getSelectionModel().on({
		    			selectionchange: function(sm, selections) {
		    				if (selections.length) {
		    					console_log(selections);
		    					if(fPERM_DISABLING()==true) {
		    						addAction_detail.disable();
		    						graphAction.disable();
				            	}else{
				            		addAction_detail.enable();
				            		graphAction.enable();
				            	}
		    				}else {
				            	if(fPERM_DISABLING()==true) {
				            		addAction_detail.disable();
				            		graphAction.disable();
				            	}else{
				            		addAction_detail.disable();
				            		graphAction.disable();
				            	}
		    				}
		    			}
		    		});
		    		var ptarget = Ext.getCmp('week-tab-div');
		    		ptarget.removeAll();
		    		ptarget.add(weekGrid);
		    		ptarget.doLayout();
		    	}
		    },
		    scope: this
		});	
	    
	    (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
	    	params: {
		    	menuCode: 'VMF8_SMALL'
		    },
	    	callback: function(records, operation, success) {
	    		console_log('come IN small');
	    		console_log(success);
		    		
	    		if(success ==true) {
	    			for (var i=0; i<records.length; i++){
	    				console_log(records[i]);
		    			inRec2Col(records[i], fieldSmall, columnSmall, tooltipSmall);
			        }//endoffor
	    			Ext.each(/*(G)*/columnSmall, function(columnObj, index) {
	    				var dataIndex = columnObj["dataIndex"];
	    				if(dataIndex!='no') {
	    					console_log('111111');
	    					console_log(dataIndex);
	    					if('start_plan' == dataIndex) {
	    						columnObj["editor"] = {
	    						        format: 'Y-m-d'
	    						};
	    					}
	    				}
	    			});
		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
	    			smallGrid  = Ext.create('Ext.grid.Panel', {
	    				store: store_small,
	    				selModel: selModel,
	    				collapsible: false,
	    				multiSelect: false,
	    				stateId: 'smallGrid' + /*(G)*/vCUR_MENU_CODE,
	    				autoScroll: true,
	    				autoHeight: true,
	    				height: getCenterTapPanelHeight(),
	    				columns: columnSmall,
				        bbar: getPageToolbar(store_small),
	    				dockedItems: [{
	    					xtype: 'toolbar',
	    					items: [searchAction,{
	    						id:				'docked_reminder_small',
	    						xtype:          'combo',
	    						mode:           'local',
	    						editable:false,
	    						queryMode: 'remote',
	    						displayField:   'reminder',
	    						valueField:     'reminder',
	    						fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	    						store: pjtTskDuePlaneStore,
	    						listConfig:{
	    							getInnerTpl: function(){
	    								return '<div data-qtip="{task_title_x}"> {reminder} </div>';
	    							}			                	
	    						},
	    						listeners: {
	    							select: function (combo, record,rowIndex) {
	    								Model = record[0].get('reminder');
	    							}
	    						}
	    					}]
	    				}]
	    			});
	    			console_log('created_grid Small');
	    			smallGrid.getSelectionModel().on({
	    				selectionchange: function(sm, selections) {
	    					if (selections.length) {
	    						console_log(selections);
	    						if(fPERM_DISABLING()==true) {
	    						}else{
	    						}
	    					}else {
	    						if(fPERM_DISABLING()==true) {
	    						}else{
	    						}
	    					}
	    				}
	    			});
	    			var ptarget = Ext.getCmp('small-tab-div');
	    			ptarget.removeAll();
	    			ptarget.add(smallGrid);
	    			ptarget.doLayout();
	    		}
	    	},
	    	scope: this
	    });	
	    fLAYOUT_CONTENTMulti([gridTab]);  
	});
	cenerFinishCallback();//Load Ok Finish Callback
});	//OnReady

