var grid = null;
var store = null;
var Mold_name = '';
var Model = '';

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

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

Ext.onReady(function() { 
	console_log('now starting...');
	var pjtTskDuePlaneStore = Ext.create('Mplm.store.PjtTskDuePlaneStore', {} );
	
	Ext.define('PjtTskProductDetail', {
		extend: 'Ext.data.Model',
		fields: vCENTER_FIELDS,
		proxy: {
			type: 'ajax',
			api: {
				read: CONTEXT_PATH + '/statistics/task.do?method=readProjectDetail&task_title='+'CAD'+'&task_type='+'C'
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
	
	store = new Ext.data.Store({  
		model: 'PjtTskProductDetail',
		sorters: [{
			property: 'pl_no',
			direction: 'ASC'
		}]
	});
	
	store.getProxy().setExtraParam('description', '#EMPTY');
	store.load(function() {
//		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		
		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				switch(dataIndex){
				case 'cad':
				case 'cam':
				case 'm':
				case 'cfirst':
				case 'wht':
				case 'g2':
				case 'csecond':
				case 'w2':
				case 'c2':
				case 'w1':
				case 'e1':
				case 'qc':
				case 'p':
				case 'fit':
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
					console_log('value');
					console_log(value);
						switch(value){
						case 'W':
							p.tdAttr = 'style="background-color: #00D8FF;"';
							break;
						case 'N':
							p.tdAttr = 'style="background-color: #99004C;"';
							break;
						case 'Y':
							p.tdAttr = 'style="background-color: #5D5D5D;"';
							break;
						default :
							p.tdAttr = 'style="background-color: #FFFFFF;"';
						}
					};
				}
			}
		});
		
		grid = Ext.create('Ext.grid.Panel', {
	        store: store,
	        collapsible: true,
	        multiSelect: true,
	        stateId: 'stateGrid',
//	        selModel: selModel,
	        autoScroll : true,
	        autoHeight: true,
	        height: getCenterPanelHeight(),
	        dockedItems: [{}],
	        columns: /*(G)*/vCENTER_COLUMNS,
	        title: getMenuTitle(),
	        dockedItems: [{
	        	xtype: 'toolbar',
	            items: [searchAction,{
	            	id:				'docked_reminder',
	            	xtype:          'combo',
                    mode:           'local',
//                    triggerAction:  'all',
//                    mode: 'local',
                    editable:false,
//                    forceSelection: true,
                    queryMode: 'remote',
//                    name:           'reminder',
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
 		                 	var description = record[0].get('reminder');
 		                 	
 		                 	ProjectMoldStore.getProxy().setExtraParam('description', description);
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
 		                 }
 	                }
// 	                listeners: {
// 		                 select: function (combo, record,rowIndex) {
// 		                	Model = record[0].get('reminder');
// 		                	Mold_name = record[0].get('task_title_x');
// 		                 }
// 	                }
	            },{
	            		id:				'mold_name',
		        		xtype:          'combo',
	                    mode:           'local',
	                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                    editable:       false,
	                    queryMode: 'remote',
	                    name:           'mold_name',
	                    displayField:   'pj_code',
	                    valueField:     'pj_code',
	                    store: ProjectMoldStore,
	                    listConfig:{
	 	                	getInnerTpl: function(){
	 	                		return '<div data-qtip="{description}"> {pj_code} </div>';
	 	                	}			                	
	 	                },
	 	               listeners: {
	 		                 select: function (combo, record,rowIndex) {
	 		                	 console_log(record);
	 		                	Model = record[0].get('description');
	 		                	Mold_name = record[0].get('pj_code');
	 		                 }
	 	                }
	            }]
	        }]
	    });
		fLAYOUT_CONTENT(grid);
		
		grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	            if (selections.length) {
					if(fPERM_DISABLING()==true) {
					}else{
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
	            	}else{
	            	}
	            }
	        }
	    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	console_log('End...');
});
