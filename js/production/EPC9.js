
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': CONTEXT_PATH + '/extjs/ux'
    }
});
 
Ext.require(['Ext.ux.CheckColumn']);

//*****************************GLOBAL VARIABLE**************************/

var grid = null;
var store = null;
var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var sales_price = '';
var quan = '';

var lineGap = 35;
var selectedMoldUid = '';
var selectedAssyUid = '';
var selectedMoldCode = '';
var selectedMoldCoord = '';
var selectedMoldName = '';
var toPjUidAssy = '';	//parent
var toPjUid = '';	//ac_uid

var lineGap = 35;
var selectionLength = 0;

var updown =
{
	text: Position,
    menuDisabled: true,
    sortable: false,
    xtype: 'actioncolumn',
    width: 60,
    items: [{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
        tooltip: 'Up',
        handler: function(grid, rowIndex, colIndex) {
        }
    },{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
        tooltip: 'Down',
        handler: function(grid, rowIndex, colIndex) {
        }
    }]
};

function printSelected(modified) {
	console_log('count is : ' + modified.length);
	for(var i=0; i<modified.length; i++) {
		var o = modified[i];
		console_log(o);
	}
}
function checkVal(rec, col, val, row) {

	for(var i = 0 ; i<20; i++) {
		var str = '' + (i+1);
		if(str.length<2) {
			str = '0' + str;
		}
		var process = rec.get('process' + str);
		var inout_type = rec.get('inout_type' + str);
		if(process=='' && col == (i+1)*2+4) {
			return '';
		} else if(inout_type!=''  && col == (i+1)*2+4) {
			if(inout_type=='OUT') {
				return inout_type;
			} else {
				return (new Ext.ux.CheckColumn()).renderer(val);	
			}
		}
	}
	return 'WAIT';
}


function item_code_dash(item_code){
	if(item_code==null || item_code.length<13) {
		return item_code;
	}else {
		return item_code.substring(0,12);
	}
}


function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
}
 
var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

function Item_code_dash(item_code){
		return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
				item_code.substring(9, 12);
}


//*****************************MODEL**************************/

for(var i=0; i<20; i ++) {
	
	var str = '' + (i+1);
	if(str.length<2) {
		str = '0' + str;
	}
	
	vCENTER_FIELDS.push({ name: 'checked' + str, type: 'boolean'});
	vCENTER_FIELDS.push({ name: 'process' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'inout_type' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'ast_uid' + str, type: 'string'});
}

Ext.define('CartLineProcess', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/pending.do?method=read', 					/*1recoed, search by cond, search */
	            create: CONTEXT_PATH + '/production/pending.do?method=create', 			/*create record, update*/
	            update: CONTEXT_PATH + '/production/pending.do?method=create'
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

Ext.define('Processing', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/production/pcsrequest.do?method=create'			/*create record, update*/
	        },
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});

Ext.define('RtgAst', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/design/bom.do?method=createPurchasing'
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




function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
	           	 var partline = Ext.ModelManager.create({
	           		unique_uid : unique_uid
	        	 }, 'CartLineProcess');
        		
	           	partline.destroy( {
	           		 success: function() {}
	           	});  	
        	}
        	grid.store.remove(selections);
        }
    }
};

function process_requestConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var unique_ids = [];
        	
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
	           	 
        	}//enoffor
        	
        	console_log(unique_ids);
        	var process = Ext.ModelManager.create({
           		unique_uid : unique_ids
        	 }, 'Processing');
           	 
           	process.save( {
           		 success: function() {
           		 }//endofsuccess
           	});//endofsave
        }//endofif yes
    }//endofselection
};

var prWin = null;
var unique_uid = new Array();

var urgentAction = Ext.create('Ext.Action', {
	itemId: 'purchaseButton',
	iconCls:'my_purchase',
    text: epc9_urgent,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	

    	var modified = [];

        for (var j = 0; j < store.data.items.length; j++)
        {
              var record = store.data.items [j];
              if (record.dirty) {
		    	  for(var i = 0 ; i<20; i++) {
		    			var str = '' + (i+1);
		    			if(str.length<2) {
		    				str = '0' + str;
		    			}
		    			var checked = record.get('checked' + str);
		    			var ast_uid = record.get('ast_uid' + str);
		    			if(checked==true) {
		    				modified.push(ast_uid);	
		    			}
		    	 }
              }
              printSelected(modified);
        }
    }//endof handlwe
});//endof define action

searchField = [];

Ext.onReady(function() {  
	LoadJs('/js/util/comboboxtree.js');
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgapp',
			            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
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
	
	console_log('now starting...');
	   
		    //************************ BOM *********
		     
		    	//PartLine Store 정의
		    	store = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'CartLineProcess',
		    		sorters: [{
		                property: 'unique_id',
		                direction: 'DESC'
		            }]
		    	});
		    	
		    	store.load(function(records) {
		    		console_log('-----------------------------------------------------------------------------------'); 
 					console_log(records); 
 					console_log('-----------------------------------------------------------------------------------'); 
 					
 					var len = -1;
 					if(records != undefined && records != null) {
 						 for (var i=0; i<records.length; i++){ 
	   	   	                	var line = records[i];
	   	   	                	var lineQty = Number( line.get('lineQty'));
	   	   	                	
	   	   	                	console_log('lineQty=' + lineQty);      	
	   	   	                	if(lineQty>len) {
	   	   	                		len = lineQty;
	   	   	                	}
 						 }
 					}
 					if(len<0) {
 						len = 20;
 					}

		    		for(var i=0; i<len; i ++) {
		    			
		    			var str = '' + (i+1);
		    			if(str.length<2) {
		    				str = '0' + str; //이게 해더 만들어주는건데. str은 1~ 20까지 
		    			}
		    			
			    		var chkColH = new Ext.ux.CheckColumn({
			    		    header: '확인',
			    		    dataIndex: 'checked' + str,
			    		    resizable:false,
			    		    width: 40,
			    		    align: 'center',
			    		    renderer: function(val, m, rec, rowNum, colNum) {
			    		    	return checkVal(rec, colNum, val, rowNum);
				    		}
			    		});
		    			
		    			vCENTER_COLUMNS.push(
		    					{ header: str,
		    						columns: [
										chkColH,
										{ header: '순서', dataIndex: 'process' + str, width : 80,  sortable : false}
		    						]
		    					});
		    		}

		    grid = Ext.create('Ext.grid.Panel', {
		    		id: 'gridBom',
			        title: '',
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
	                region: 'center',
	                width:'60%',
			        height: getCenterPanelHeight(),
			        
			        bbar: getPageToolbar(store),	        
			        
			        dockedItems: [
	    		      				{
	    		      					dock: 'top',
	    		      				    xtype: 'toolbar',
	    		      				    items: [
	    		      				           urgentAction, '-', 
	    		      				         '->'
	    		      				         ]
	    		      				},
	    		      				{
	    		      					xtype: 'toolbar',
	    		      					items: getProjectTreeToolbar()
	    		      				}
	    		              ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
	   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
			            } ,
			            listeners: {
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                }
			            }
			        },
		    		title: getMenuTitle()
			    });
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;

		            if (selections.length) {
		            	//grid info 켜기
		            	displayProperty(selections[0]);
		            	
		            	if(fPERM_DISABLING()==true) {
			            	urgentAction.disable();
		            	}else{
			            	urgentAction.enable();
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();
			            	urgentAction.disable();
		            	}else{
		            		collapseProperty();

			            	urgentAction.disable();

		            	}
		            }
		        }
		    });
		    
			var main =  Ext.create('Ext.panel.Panel', {
					 height: getCenterPanelHeight(),

			            layoutConfig: {columns: 2},
			            split: true,
				    layout:'border',
				    border: false,
				    defaults: {
				        collapsible: true,
				        split: true,
				        cmargins: '5 0 0 0',
				        margins: '0 0 0 0'
				    },
				
				    items: [  grid ]

				});
			fLAYOUT_CONTENT(main);
			cenerFinishCallback();//Load Ok Finish Callback    
//		}//endof else
 	});
});	//OnReady

