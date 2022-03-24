/**
 * EPC8 : Process Scheduling.
 */
/*
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', CONTEXT_PATH + '/extjs/ux');

Ext.require([
    'Ext.selection.CellModel',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.CheckColumn'
]);
*/

//global var.
var grid = null;
var store = null;

Ext.define('PcsMchn', {
	extend: 'Ext.data.Model',
	fields: [     
	 	       { name: 'unique_id', type: "int" }
	  	      ,{ name: 'pcs_name', type: "string"  }
	  	  ],
	proxy: {
		type : 'ajax',
		api : {
			read : CONTEXT_PATH + '/production/machine.do?method=read'
		},
		reader : {
			type : 'json',
			root : 'datas',
			successProperty : 'success'
		}
	}
});


var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsLine.load(unique_id ,{
		 success: function(pcsline) {
			 
			 var unique_id = pcsline.get('unique_id');
			 var cartmap_uid = pcsline.get('cartmap_uid');
			 var pcsmchn_uid = pcsline.get('pcsmchn_uid');
			 var pcsstd_uid = pcsline.get('pcsstd_uid');
			 var serial_no = pcsline.get('serial_no');
			 var pcs_no = pcsline.get('pcs_no');
			 var std_mh = pcsline.get('std_mh');
			 var srcahd_uid = pcsline.get('srcahd_uid');
			 var pcs_code = pcsline.get('pcs_code');

				var lineGap = 30;
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'save-form.php',
		            defaultType: 'displayfield',
		            border: false,
		            bodyPadding: 15,
		            defaults: {
		                anchor: '100%',
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		            items: [{
			fieldLabel: 'unique_id',
			value: unique_id,
			x: 5,
			y: -15 + 1*lineGap,
			name: 'unique_id',
			anchor: '-5'  // anchor width by percentage
			},{
		    	fieldLabel: 'srcahd_uid',
		    	value: srcahd_uid,
		    	x: 5,
		    	y: -15 + 2*lineGap,
		    	name: 'srcahd_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcsmchn_uid',
		    	value: pcsmchn_uid,
		    	x: 5,
		    	y: -15 + 3*lineGap,
		    	name: 'pcsmchn_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'cartmap_uid',
		    	value: cartmap_uid,
		    	x: 5,
		    	y: -15 + 4*lineGap,
		    	name: 'cartmap_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcsstd_uid',
		    	value: pcsstd_uid,
		    	x: 5,
		    	y: -15 + 5*lineGap,
		    	name: 'pcsstd_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'serial_no',
		    	value: serial_no,
		    	x: 5,
		    	y: -15 + 6*lineGap,
		    	name: 'serial_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_no',
		    	value: pcs_no,
		    	x: 5,
		    	y: -15 + 7*lineGap,
		    	name: 'pcs_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_code',
		    	value: pcs_code,
		    	x: 5,
		    	y: -15 + 8*lineGap,
		    	name: 'pcs_code',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'std_mh',
		    	value: std_mh,
		    	x: 5,
		    	y: -15 + 9*lineGap,
		    	name: 'std_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'real_mh',
		    	value: real_mh,
		    	x: 5,
		    	y: -15 + 10*lineGap,
		    	name: 'real_mh',
		    	anchor: '-5'  // anchor width by percentage
		    }
		    ]
		        }); //endof form

		        var win = Ext.create('ModalWindow', {
		            title: CMD_VIEW,
		            width: 500,
		            height: 450,
		            minWidth: 250,
		            minHeight: 180,
		            layout: 'fit',
		            plain:true,
		            items: form,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                       	if(win) 
		                       	{
		                       		win.close();
		                       	} 
		                  }
		            }]
		        });
		        win.show();
				//endofwin
		 }//endofsuccess
	 });//emdofload

};


var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	

	PcsLine.load(unique_id ,{
		 success: function(pcsline) {
			 
			 var unique_id = pcsline.get('unique_id');
			 var cartmap_uid = pcsline.get('cartmap_uid');
			 var pcsmchn_uid = pcsline.get('pcsmchn_uid');
			 var pcsstd_uid = pcsline.get('pcsstd_uid');
			 var serial_no = pcsline.get('serial_no');
			 var pcs_no = pcsline.get('pcs_no');
			 var srcahd_uid = pcsline.get('srcahd_uid');
			 var pcs_code = pcsline.get('pcs_code');
				var lineGap = 30;
				
				
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'save-form.php',
		            defaultType:  'textfield',
		            border: false,
		            bodyPadding: 15,
		            defaults: {
		                anchor: '100%',
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		            items: [{
		    			fieldLabel: 'unique_id',
		    			value: unique_id,
		    			x: 5,
		    			y: 0 + 1*lineGap,
		    			name: 'unique_id',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
			    		fieldLabel: 'pcs_no',
			    		value: pcs_no,
			    		x: 5,
			    		y: 0 + 2*lineGap,
			    		name: 'pcs_no',
			    		anchor: '-5'  // anchor width by percentage
			    		},{
		    			value: pcs_code,
		    			x: 5,
		    			y: 0 + 3*lineGap,
		    			name: 'pcs_code',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
		    			fieldLabel: 'srcahd_uid',
		    			value: srcahd_uid,
		    			x: 5,
		    			y: 0 + 4*lineGap,
		    			name: 'srcahd_uid',
		    			anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'cartmap_uid',
		    		    value: cartmap_uid,
		    		    x: 5,
		    		    y: 0 + 5*lineGap,
		    		    name: 'cartmap_uid',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'pcsstd_uid',
		    		    value: pcsstd_uid,
		    		    x: 5,
		    		    y: 0 + 6*lineGap,
		    		    name: 'pcsstd_uid',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'serial_no',
		    		    value: serial_no,
		    		    x: 5,
		    		    y: 0 + 7*lineGap,
		    		    name: 'serial_no',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
			    		fieldLabel: 'pcsmchn_uid',
			    		value: pcsmchn_uid,
			    		x: 5,
			    		y: 0 + 8*lineGap,
			    		name: 'pcsmchn_uid',
			    		anchor: '-5'  // anchor width by percentage
			    		},{
		    		    fieldLabel: 'real_mh',
		    		    value: real_mh,
		    		    x: 5,
		    		    y: 0 + 9*lineGap,
		    		    name: 'real_mh',
		    		    anchor: '-5'  // anchor width by percentage
		    		    }
		    		    ]
		        }); //endof form
		    	
		        var win = Ext.create('ModalWindow', {
		            title: CMD_MODIFY,
		            width: 500,
		            height: 400,
		            minWidth: 250,
		            minHeight: 180,
		            layout: 'fit',
		            plain:true,
		            items: form,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);
		                	var pcsline = Ext.ModelManager.create(val, 'PcsLine');
		                	
		            		//저장 수정
		                	pcsline.save({
		                		success : function() {
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		store.load(function() {});
		                           	} 
		                		} 
		                	 });
		                	
		                       	if(win) 
		                       	{
		                       		win.close();
		                       	} 
		                    } else {
		                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
		                    }
		                  }
		            },{
		                text: CMD_CANCEL,
		            	handler: function(){
		            		if(win) {win.close();} }
		            }]
		        });
		        win.show();
				//endofwin
		 }//endofsuccess
	 });//emdofload

};


//writer define
Ext.define('PcsLine.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});


function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var pcsline = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsLine');
        		
	           	pcsline.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

var win;
//Define Remove Action
var assignAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'production',
    text: epc7_rework,
    disabled: true,
    handler: function(widget, event) {
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');
		var pcsmchn_uid = rec.get('pcsmchn_uid');
		var pcs_name = rec.get('pcs_name');
		var item_code = rec.get('item_code');
		var pcs_code = rec.get('pcs_code');
		var pj_code = rec.get('pj_code');
		var pl_no = rec.get('pl_no');
		var is_complished = rec.get('is_complished');
		var rework = rec.get('rework');
    
		console_log('unique_id=' + unique_id);
		console_log('pcsmchn_uid=' + pcsmchn_uid);
		console_log('pcs_name=' + pcs_name);
		console_log('item_code=' + item_code);
		console_log('pcs_code=' + pcs_code);
		console_log('is_complished=' + is_complished);
		console_log('rework=' + rework);

 				var mchnStore = Ext.create('Mplm.store.MachineStore', {} );
 				
 				mchnStore.load( function() {
 					
 					var mchnGrid = Ext.create('Ext.grid.Panel', {
     			        store: mchnStore,
     			        stateId: 'stateGrid-mchnGrid',
     			        layout: 'fit',
     			        height: 350,
     					multiSelect : false,
     			        columns: [
      			                { text     : getColName('mchn_code'), 		width : 80,  sortable : true, dataIndex: 'mchn_code'  },
     			                { text     : getColName('name_cn'), 		width : 80,  sortable : true, dataIndex: 'name_cn'  },
     			                { text     : getColName('name_en'), 		width : 90,  sortable : true, dataIndex: 'name_en'  },
     			                { text     : getColName('operator_id'), 		width : 80,  sortable : true, dataIndex: 'operator_id'  },
     			                { text     : getColName('operator_name'), 		width : 80,  sortable : true, dataIndex: 'operator_name'  }
     			                ],
     			        viewConfig: {
     			            stripeRows: true,
     			            enableTextSelection: false,
     			            getRowClass: function(record) { 
	     			              return record.get('unique_id')  == pcsmchn_uid ? 'selected-row' : ''; 
     			            } ,
     			            listeners: {
     			                itemdblclick:  function(dv, record, item, index, e) {
     			                    alert('working');
     			                }

     			            }
     			        }
     			    });
 					
 					var form = Ext.create('Ext.form.Panel', {
 						
 						id: 'formPanel',
 			            defaultType: 'textfield',
 			            border: false,
 			            bodyPadding: 15,
 			           items: [{
 			                   fieldLabel: epc7_rework_desc,
 			                   xtype: 'textfield',
 				    			name: 'rework_reason',
 				    			id:  'rework_reason',
 								height: 40,
 								width: 400
 								}]
 						
 						
 						
 					});
 					
 		   			 var winTitle = pj_code + '-'
	 					+ pl_no + '-'
	 					+ pcs_code;
							 console_log(winTitle);
							 
						win = Ext.create('widget.window', {
						title: winTitle,
						modal:true,
						plain:true,
						closable: true,
						closeAction: 'hide',
						width: 600,
						minWidth: 350,
						height: 350,
						layout: {
						type: 'border',
						padding: 5
						},
						items: [{
						region: 'west',
						title: pcs_name,
						width: 400,
						split: true,
						collapsible: false,
						floatable: false,
						items: [mchnGrid]
						}
						, {
						region: 'center',
						xtype: 'tabpanel',
						items: [{
							title: 'Works',
							html: ''
							}, {
							title: 'Property',
							html: ''
						}]
             },{
            	 	region: 'south',
            	 	items:[form]
	    			
	    			
	    			}],
             buttons: [{
                 text: CMD_OK,
             	handler: function(){

             		var selMchnRec = mchnGrid.getSelectionModel().getSelection()[0];
             		var rec = grid.getSelectionModel().getSelection()[0];
             		
             		var newMchnUid = selMchnRec.get('unique_id');
             		var is_complished = rec.get('is_complished');
             		var rework = rec.get('rework');
             		var form = Ext.getCmp('formPanel').getForm();
             		var rework_reason = form.getValues().rework_reason;
             		if(newMchnUid==pcsmchn_uid) {
             			Ext.MessageBox.alert('Error', 'Same Value'); 
             		} else {
             			
                		Ext.define('PcsStepMachine', {
    	 		             	 extend: 'Ext.data.Model',
    	 		             	 fields: [
    	 		             	          {name:'unique_id'}
    	 		             	          ,{name:'pcsmchn_uid'}
    	 		             	          ,{name:'is_complished'}
    	 		             	          ,{name:'rework'}
    	 		             	          ,{name:'rework_reason'}
    	 		             	          
    	 		             	 ],
    	 	             	    proxy: {
    	 	         				type: 'ajax',
    	 	         		        api: {
    	 	         		            create: CONTEXT_PATH + '/production/pcsline.do?method=reWork'		         		        },
    	 	         				
    	 		         				writer: {
    	 		         		            type: 'singlepost',
    	 		         		            writeAllFields: false,
    	 		         		            root: 'datas'
    	 		         		        } 
    	 		         			}
    	 			         });
    	     	           	 var pcsstepMachine = Ext.ModelManager.create({
    	       	           		unique_id : unique_id,
    	       	           		pcsmchn_uid : newMchnUid,
    	       	           		is_complished : is_complished,
    	       	           		rework : rework,
    	       	           		rework_reason : rework_reason//[1]
    	       	        	 }, 'PcsStepMachine');
    	     	           	 
    	     	           	 
    	     	           	pcsstepMachine.save({
    	     	           		success : function() {
    	     	           			store.load(function() {});
    	     	           		}
    	     	           	});
                     	 
                            	if(win) 
                            	{
                            		win.close();
                            	} 


             		}//endof else if(newMchnUid==pcsmchn_uid)
             		
 
                   }
             },{
                 text: CMD_CANCEL,
             	handler: function(){
             		if(win) {win.close();} }
             }]
         });
         win.show();
 				});//endofload
    		 }
});

//Define Remove Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
            items: [{
    			fieldLabel: 'pcs_no',
    			x: 5,
    			y: 0 + 1*lineGap,
    			name: 'pcs_no',
    			anchor: '-5'  // anchor width by percentage
    			},{
    			x: 5,
    			y: 0 + 2*lineGap,
    			name: 'pcs_code',
    			anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'srcahd_uid',
    		    x: 5,
    		    y: 0 + 3*lineGap,
    		    name: 'srcahd_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'cartmap_uid',
    		    x: 5,
    		    y: 0 + 4*lineGap,
    		    name: 'cartmap_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'pcsstd_uid',
    		    x: 5,
    		    y: 0 + 5*lineGap,
    		    name: 'pcsstd_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'pcsmchn_uid',
    		    x: 5,
    		    y: 0 + 6*lineGap,
    		    name: 'pcsmchn_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
        		fieldLabel: 'serial_no',
        		x: 5,
        		y: 0 + 7*lineGap,
        		name: 'serial_no',
        		anchor: '-5'  // anchor width by percentage
        		},{
        		fieldLabel: 'real_mh',
        		x: 5,
        		y: 0 + 8*lineGap,
        		name: 'real_mh',
        		anchor: '-5'  // anchor width by percentage
    		    }
    		    ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 500,
            height: 350,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                   	 var pcsline = Ext.ModelManager.create(val, 'PcsLine');
            		//저장 수정
                   	pcsline.save({
                		success : function() {
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {});
                           	} 
                           	
                           	

                           	
                		} 
                	 });
                	 
                       	if(win) 
                       	{
                       		win.close();
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		});
     }
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

/******** move to handler**********
var printExcel = Ext.create('Ext.Action', {
	itemId: 'printExcelButton',
    iconCls: 'MSExcelX',
    text: 'Excel Print',
    disabled: false ,
    handler: printExcelHandler
});
**********************************/

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ assignAction  ]
});

Ext.define('PcsLine', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/pcsline.do?method=read',
	            create: CONTEXT_PATH + '/production/pcsline.do?method=create',
	            update: CONTEXT_PATH + '/production/pcsline.do?method=update',
	            destroy: CONTEXT_PATH + '/production/pcsline.do?method=destroy'
	        },
	        extraParams: {
		    	is_complished: 'Y'//사용자 정보 필드 정보
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

var searchField = [];
Ext.onReady(function() {
	var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/, true) ;
	LoadJs('/js/util/comboboxtree.js');
	//PcsStep Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsLine',
		sorters: [{
           property: 'pcs_code',
           direction: 'asc'
       }]
	});
	
	store.load(function() {
		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        autoScroll: true,
			        autoHeight: true,
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  assignAction,
	      				        '->',
	      				            {
	      				                iconCls: 'tasks-show-all',
	      				                tooltip: 'All',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-active',
	      				                tooltip: 'Current',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-complete',
	      				                tooltip: 'Past',
	      				                toggleGroup: 'status'
	      				            }
	      				          
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
								},
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler 

			            }
			        },
			        title: getMenuTitle()
			    });
			fLAYOUT_CONTENT(grid);
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
		            	
						//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	assignAction.disable();
						}else{
							assignAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();
			            	assignAction.disable();
		            	}else{
		            		collapseProperty();
			            	assignAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	 	
    });

