//global var.
var grid = null;

function deleteConfirm(btn){

	var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
        		
        		var state = rec.get('state');
        		if(state!='접수대기') {
        			Ext.MessageBox.alert('오류', state + ': 접수대기 상태가 아닙니다.');
        		} else {
	        			
	
		           	var cartline = Ext.ModelManager.create({
		           		unique_id : unique_id
		        	 }, 'CartLine');
	        		
		           	cartline.destroy( {
		           		 success: function() {
		           			Ext.MessageBox.alert('확인','선택한 레코드를 삭제합니다.');
		           			store.load(function() {
		           				if(records != undefined ) {
		           					for (var i=0; i<records.length; i++){ 
		           						var o = records[i];
		           						o.set('state', getStateValue(o.get('state')));
		           					}
		           				}
		           			});
		           		 }
		           	});
		        	grid.store.remove(selections);
        		}//endelse
        	}
        }

    }
};

var printPDFAction = Ext.create('Ext.Action',{
    iconCls: 'PDF',
    text: 'PDF',
    disabled: true,
    handler: function(widget, event) {
    	var rec = grid.getSelectionModel().getSelection()[0];
     	var rtgast_uid = rec.get('unique_id');//rtgast_uid
    	var po_no = rec.get('po_no');//po_no
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printPr',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {
        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;
        	        console_log(pdfPath);      	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}
    		},
    		failure: extjsUtil.failureMessage
    	});
    	
    	
    }
});

function sendConfirm(btn){
	var selections = grid.getSelectionModel().getSelection();
	
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var cando = true;
        	var unique_ids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
        		var state = rec.get('state');
        		if(state!='접수대기') {
        			Ext.MessageBox.alert('오류', state +': 접수대기 상태가 아닙니다.');
        			cando = false;
        		} else {
        				unique_ids.push(unique_id);
        		}
        	}
        	if(cando==true) {
	        	var cartline = Ext.ModelManager.create({
	           		unique_id : unique_ids
	        	}, 'CartLine');
	           	
	        	cartline.save( {
	           		success: function() {
	           			
	           			store.load(function() {
	           				Ext.MessageBox.alert('수행결과','요청접수 하였습니다.');
	           			});
	           		}
	           	});
        	
        	}//candoo
        	
        	
        }
    }
    
    
};


var sendAction = Ext.create('Ext.Action', {
	itemId: 'sendButton',	
	iconCls:'my_purchase',
    text: panelSRO1142,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:GET_MULTILANG('areyousuretitle', vLANG),
            msg: GET_MULTILANG('areyousuremsgPpr3', vLANG),
            buttons: Ext.MessageBox.YESNO,
            fn: sendConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: panelSRO1143,
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

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false, 
    handler: function(btn, e, eOpts) {
        // event handling here
        console.log(btn, e, eOpts);
        store.getProxy().setExtraParam('srch_filter',srch_filter);
    	store.getProxy().setExtraParam("srch_type", 'multi');
    	store.load(function(records) {
    		if(records != undefined ) {
    			for (var i=0; i<records.length; i++){ 
    				var o = records[i];
    				o.set('state', getStateValue(o.get('state')));
    			}
    		}
    	});
      }

});

var comboStateData = [
  {name : 'A',   value: panelSRO1205}
 ,{name : 'R',   value: panelSRO1206}
 ,{name : 'D',   value: panelSRO1207}
 ,{name : 'G',   value: panelSRO1208}
 ,{name : 'I',   value: panelSRO1209}
];

function getStateValue(in_name) {
	for(var i=0; i< comboStateData.length; i++) {
		var name = comboStateData[i]['name'];
		if(name==in_name) {
			return comboStateData[i]['value'];
		}
	}
	
	return 'un-known';
}

var srch_filter = 'A';
function getStateToolBar() {
	var arrStateToolBar = [];
	
	arrStateToolBar.push(
			{
	        	id :'state',
	        	xtype:          'combo',
	            mode:           'local',
	            value:          'A',
	            triggerAction:  'all',
	            forceSelection: true,
	            editable:       false,
	            name:           'state',
	            displayField:   'value',
	            valueField:     'name',
	            emptyText: ppo1_filter,
	            queryMode: 'local',
	            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	            store:          Ext.create('Ext.data.Store', {
	                fields : ['name', 'value'],
	                data   : comboStateData
	            }),
	            listeners: {
	            	select: function (combo, record) {
	            		srch_filter = Ext.getCmp('state').getValue();
	                    store.getProxy().setExtraParam('srch_filter',srch_filter);
	                	store.getProxy().setExtraParam("srch_type", 'multi');
	                	store.load(function(records) {
	                		if(records != undefined ) {
	                			for (var i=0; i<records.length; i++){ 
	                				var o = records[i];
	                				o.set('state', getStateValue(o.get('state')));
	                			}
	                		}
	                	});
	            	}
	            }
	        }
	);
	return arrStateToolBar;
}

var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [sendAction, removeAction, printPDFAction]
});

Ext.onReady(function() {  
	
	console_log('now starting...');
	var stateToolBar = getStateToolBar();
	
	Ext.define('RtgAst', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/purchase/prch.do?method=read',
		            create: CONTEXT_PATH + '/purchase/prch.do?method=create',
		            destroy: CONTEXT_PATH + '/purchase/prch.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success',
					excelPath: 'excelPath'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});
	
	Ext.define('CartLine', {
		 extend: 'Ext.data.Model',
		 fields: [{ name: 'unique_id', 	type: "string" }],
		    proxy: {
				type: 'ajax',
		        api: {
		            create: CONTEXT_PATH + '/purchase/prch.do?method=createOrder',
		            destroy: CONTEXT_PATH + '/purchase/prch.do?method=destroyOrder'
		        },
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgAst',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
 	store.load(function(records){
 		
		if(records != undefined ) {
			for (var i=0; i<records.length; i++){ 
				var o = records[i];
				o.set('state', getStateValue(o.get('state')));
			}
		}
 		
 		
 		
 		
 		
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGrid',
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight: true,
		        height: getCenterPanelHeight(),
		        
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		            xtype: 'toolbar',
		            items:[/*searchAction,'-', */sendAction, '-', removeAction, '-', printPDFAction]
		        },{
		        	xtype: 'toolbar',
		        	items: stateToolBar
		        }],
		        columns: /*(G)*/vCENTER_COLUMNS,
		        viewConfig: {
		            stripeRows: true,
		            markDirty:false,
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
		fLAYOUT_CONTENT(grid);
		
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		var select = grid.getSelectionModel().getSelection();
	            if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					
					if(fPERM_DISABLING()==true) {
						sendAction.disable();
		            	removeAction.disable();	
		            	printPDFAction.disable();
					}else{
						sendAction.enable();
		            	removeAction.enable();							
			            printPDFAction.enable();
					}
	            } else {
            		collapseProperty();//uncheck no displayProperty
            		sendAction.disable();
	            	removeAction.disable(); 
	            	printPDFAction.disable();
	            }
	        }
	    });

	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
	        Ext.create('Ext.tip.ToolTip', config);
	    });
	cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	console_log('End...');
});	//OnReady

