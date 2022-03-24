var grid = null;
var store = null;
var Model = '';

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

Ext.onReady(function() {
	var pjtTskDuePlaneStore = Ext.create('Mplm.store.PjtTskDuePlaneStore', {} );
	console_log('now starting...');
	
	Ext.define('PjtTskDuePlanDetail', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/statistics/task.do?method=readPlanChartDetail&menuCode='+vCUR_MENU_CODE
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
		model: 'PjtTskDuePlanDetail',
		sorters: [{
			property: 'unique_id',
			direction: 'ASC'
		}]
	});
	
	store.load(function() {
//		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		
		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				if('progress' == dataIndex) {
					columnObj["renderer"] = function(value, metadata, record, rowIndex, colIndex, store) {
						var is_delay = record.data.is_delay;
						console_log(is_delay);
						var color = '#00FFFF';
						if(is_delay == 'Y'){
							color = '#FF00BF';
						}
		                var w = Math.floor(value*3);
		                var html = 
		                	'<div class="x-progress-wrap">'+
			                    '<div class="x-progress-inner">'+
			                        '<div class="x-progress-bar" style="width: '+w+'px; background-color: '+color+';">'+'</div>'+
			                        '<div class="x-progress-text  x-progress-text-back">'+
			                        	'<div style="color: #000000;">'+value+' %</div>'+//text-align:center;
		                            '</div>'+
		                    '</div>';
		                return html;
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
	        columns: /*(G)*/vCENTER_COLUMNS,
	        dockedItems: [{
	        	xtype: 'toolbar',
	            items: [searchAction,{
	            	id:				'docked_reminder',
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
	        }],
	        title: getMenuTitle()
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
