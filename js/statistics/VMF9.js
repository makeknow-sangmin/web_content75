var grid = null;
var store = null;

Ext.onReady(function() { 
	console_log('now starting...');
	
	Ext.define('PjtTskDuePlanOveral', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/statistics/task.do?method=readPlanChartOveral&menuCode='+vCUR_MENU_CODE
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
		model: 'PjtTskDuePlanOveral',
		sorters: [{
            property: 'unique_id_long',
            direction: 'DESC'
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
						var color = '#00FFFF';
						if(is_delay == 'Y'){
							color = '#FF00BF';
						}
		                var w = Math.floor(value*3);
		                var html = 
		                	'<div class="x-progress-wrap">'+
			                    '<div class="x-progress-inner">'+
			                        '<div class="x-progress-bar" style="width: '+w+'px; background-color:'+color+';">'+'</div>'+
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
	        dockedItems: [{}],
	        columns: /*(G)*/vCENTER_COLUMNS,
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
