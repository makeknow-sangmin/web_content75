/**
 * EPC8 : Process Scheduling.
 */

//global var.
var cartmap_uid='';
var srcahd_uid='';
var pl_no='';
var grid = null;
var store = null;

//assign worker store
//var worker_store = null;
//assign human
var fieldHuman = [];
var columnHuman = [];
var tooltipHuman = [];
//assign machine
var fieldMachine = [];
var columnMachine = [];
var tooltipMachine = [];

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

var stdProcessNameStore = new Ext.create('Ext.data.Store', {
 	fields:[     
 	       { name: 'systemCode', type: "string" }
 	      ,{ name: 'codeName', type: "string"  }
 	     ,{ name: 'codeNameEn', type: "string"  }
 	     
 	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/pcsstd.do?method=pcsStdName',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     	}
 });

var printBarcode = Ext.create('Ext.Action', {
	itemId: 'printBarcode',
    iconCls: 'barcode',
    text: barcode_print,
    disabled: true,
    handler: printMyBarcode
});

function printMyBarcode() {
	 var selections = grid.getSelectionModel().getSelection();
     if (selections) {
     	console_log(selections);
     	var batchParam = '';
         	for(var i=0; i< selections.length; i++) {
         		var rec = selections[i];
         		var barcode = rec.get('srcahd_uid');
         		var spec = rec.get('item_code');
         		var qty = '1';
         		if(i>0) {
         			batchParam = batchParam + ';';
         		}
         		batchParam = batchParam + barcode + ':' + spec + ':' + qty;
         	}
         	crossDomainPost(batchParam);console_logs('batchParam', batchParam);
         	
     }
}

function crossDomainPost(batchParamnIn) {
	  var batchParam = MyUtf8.encode(batchParamnIn);
	  // Add the iframe with a unique name
	  var iframe = document.createElement("iframe");
	  var uniqueString = RandomString(10);
	  document.body.appendChild(iframe);
	  iframe.style.display = "none";
	  iframe.contentWindow.name = uniqueString;
	  // construct a form with hidden inputs, targeting the iframe
	  var form = document.createElement("form");
	  form.target = uniqueString;
	  form.action =  'http://' + vBARCODE_URL + '/print/BarcodePrint';
	  form.method = "POST";

	  // repeat for each parameter
	  var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "batchParam";
	  input.value = batchParam;
	  form.appendChild(input);
	  
	  document.body.appendChild(form);
	  form.submit();
}

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



var urgentAction = Ext.create('Ext.Action', {
	itemId: 'purchaseButton',
	iconCls:'my_purchase',
    text: epc9_urgent,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	
//
//    	var modified = [];
//
//        for (var j = 0; j < store.data.items.length; j++)
//        {
//              var record = store.data.items [j];
//              if (record.dirty) {
//		    	  for(var i = 0 ; i<20; i++) {
//		    			var str = '' + (i+1);
//		    			if(str.length<2) {
//		    				str = '0' + str;
//		    			}
//		    			var checked = record.get('checked' + str);
//		    			var ast_uid = record.get('ast_uid' + str);
//		    			if(checked==true) {
//		    				modified.push(ast_uid);	
//		    			}
//		    	 }
//              }
//              printSelected(modified);
 //       }
    }//endof handlwe
});//endof define action


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
    iconCls: 'AllocationMapRevision',
    text: CMD_MACHINE + '/' + CMD_WORKER,
    disabled: true,
    handler: function(widget, event) {
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');
		var pcsmchn_uid = rec.get('pcsmchn_uid');
		var worker_uid = rec.get('worker_uid');
		var pcs_name = rec.get('pcs_name');
		//var item_code = rec.get('item_code');
		var pcs_code = rec.get('pcs_code');
		var pj_code = rec.get('pj_code');
		var pl_no = rec.get('pl_no');
		
		var worker_uid = rec.get('worker_uid');
		var crit_type = rec.get('crit_type');
    
		console_log('unique_id=' + unique_id);
		console_log('pcsmchn_uid=' + pcsmchn_uid);
		console_log('pcs_name=' + pcs_name);
		console_log('worker_uid=' + worker_uid);
		console_log('crit_type=' + crit_type);
		
		var system_code = pcs_name;
		var member_type = null;
		var assignColumn = null;		
		var worker_store = null;
		if(crit_type=='H') {
			member_type = 'HUMAN';
			assignColumn = columnHuman;
			
			worker_store = new Ext.data.Store({  
				pageSize: getPageSize(),
				model: 'PcsMemberHuman',
				sorters: [{
					property: 'create_date',
					direction: 'ASC'
				}]
			});
		}else if(crit_type='M') {
			member_type = 'MACHINE';
			assignColumn = columnMachine;
			worker_store = new Ext.data.Store({  
				pageSize: getPageSize(),
				model: 'PcsMemberMachine',
				sorters: [{
					property: 'create_date',
					direction: 'ASC'
				}]
			});
		}else {
			return;
		}
		
		worker_store.getProxy().setExtraParam('system_code', system_code);
		worker_store.getProxy().setExtraParam('member_type', member_type);
 				
		console_log(assignColumn);
		worker_store.load( function() {
 					
 					var mchnGrid = Ext.create('Ext.grid.Panel', {
     			        store: worker_store,
     			        stateId: 'stateGrid-mchnGrid',
     			        layout: 'fit',
     			        height: 350,
     					multiSelect : false,
     			        columns: assignColumn,
     			        viewConfig: {
     			            stripeRows: true,
     			            enableTextSelection: false,
     			            getRowClass: function(record) {
     			            	var member_uid = record.get('member_uid');
 			            		var machine_uid = record.get('machine_uid');
 			            		var member_type = record.get('member_type');
 			            		if(member_type=='HUMAN') {
 			            			return member_uid == worker_uid ? 'selected-row' : ''; 
 			            		} else {
 			            			return machine_uid == pcsmchn_uid ? 'selected-row' : ''; 
 			            		}
	     			              
     			            } ,
     			            listeners: {
     			                itemdblclick:  function(dv, record, item, index, e) {
     			                    alert('working');
     			                }

     			            }
     			        }
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
						width: '100%',
						split: true,
						collapsible: false,
						floatable: false,
						items: [mchnGrid]
						}
						/*
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
	             	}*/
				],
	             buttons: [{
	                 text: CMD_OK,
	             	handler: function(){
	
	             		var selMchnRec = mchnGrid.getSelectionModel().getSelection()[0];
	             		
	             		var newMchnUid = selMchnRec.get('machine_uid');
	             		var newWorkerUid = selMchnRec.get('member_uid');
	             	
	             		//if(newMchnUid==pcsmchn_uid) {
	             		//	Ext.MessageBox.alert('Error', 'Same Value'); 
	             		//} else {
	             			
	                		Ext.define('PcsStepMachine', {
	    	 		             	 extend: 'Ext.data.Model',
	    	 		             	 fields: [
	    	 		             	          {name:'unique_id'}
	    	 		             	          ,{name:'pcsmchn_uid'}
	    	 		             	        ,{name:'worker_uid'}
	    	 		             	 ],
	    	 	             	    proxy: {
	    	 	         				type: 'ajax',
	    	 	         		        api: {
	    	 	         		            create: CONTEXT_PATH + '/production/pcsline.do?method=saveMachine'		         		        },
	    	 	         				
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
	    	       	           		worker_uid : newWorkerUid
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
	
	
	             		//}//endof else if(newMchnUid==pcsmchn_uid)
             		
 
                   }
             },{
                 text: CMD_CANCEL,
             	handler: function(){
             		if(win) {win.close();} }
             }]
         });

         win.show();
 					
 		});//endofload
//    }//endofif
 
	 }//endofhandler

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
                			//console_log('updated');
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
		    //button.dom.disabled = false;
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
var changeAction = Ext.create('Ext.Action', {
	itemId: 'nochangButton',
    iconCls: 'search',
    text: epc8_change,
    disabled: true,
    handler: function(widget, event) {
    	
    	var lineGap = 30;
    	var selections = grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		cartmap_uid = rec.get('cartmap_uid');
    		srcahd_uid = rec.get('srcahd_uid');
    		pl_no = rec.get('pl_no');
    		console_log('cartmap_uid:      '+cartmap_uid);
    		WorkOrder.proxy.extraParams.cartmap_uid = cartmap_uid;
    		WorkOrder.proxy.extraParams.srcahd_uid = srcahd_uid;
    		WorkOrder.proxy.extraParams.pl_no = pl_no;
    		console_log('work_srcahd_uid:      '+srcahd_uid);
    		console_log('work_pl_no:      '+pl_no);
    	}
    	
    	var work_store = new Ext.data.Store({  
    		pageSize: getPageSize(),
    		model: 'WorkOrder',
    		sorters: [{
               property: 'view_serial_no',
               direction: 'ASC'
           }]
    	});
    	
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
    	        handler: function(agridV, rowIndex, colIndex) {


    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	var pl_no = record.get('pl_no');
    	        	var cartmap_uid = record.get('cartmap_uid');
    	        	var srcahd_uid = record.get('srcahd_uid');
    	        	var is_complished = record.get('is_complished');
    	        	var serial_no = record.get('serial_no');
    	        	console_log(unique_id);
    	        	var direcition = -15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/production/pcsline.do?method=moveStepNoDyna',
	         			params:{
	         				direcition:direcition,
	         				cartmap_uid:cartmap_uid,
	         				srcahd_uid:srcahd_uid,
	         				pl_no:pl_no,
	         				unique_id:unique_id,
	         				is_complished:is_complished,
	         				serial_no:serial_no
	         			},
	         			success : function(result, request) {  
	         				var result = result.responseText;
	         				if(result == 'false'){
	         					Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
	         				}
	         				else{
	         					work_store.load(function() {});
	         				}
	         			}
	           	    });


        
    				}
    				 	

    	    },{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
    	        tooltip: 'Down',
    	        handler: function(agridV, rowIndex, colIndex) {

    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	console_log(unique_id);
    	        	var pl_no = record.get('pl_no');
    	        	var cartmap_uid = record.get('cartmap_uid');
    	        	var srcahd_uid = record.get('srcahd_uid');
    	        	var is_complished = record.get('is_complished');
    	        	var serial_no = record.get('serial_no');

    	        	var direcition = 15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/production/pcsline.do?method=moveStepNoDyna',
	         			params:{
	         				direcition:direcition,
	         				cartmap_uid:cartmap_uid,
	         				srcahd_uid:srcahd_uid,
	         				pl_no:pl_no,
	         				unique_id:unique_id,
	         				is_complished:is_complished,
	         				serial_no:serial_no
	         			},
	         			success : function(result, request) {
	         				var result = result.responseText;
	         				if(result == 'false'){
	         					Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
	         				}
	         				else{
	         					work_store.load(function() {});
	         				}
	         			}
	           	    });	

    	        }

    	    }]
    	};
    	
    	var tempColumn = [];
    	
    	tempColumn.push(updown);
    	
    	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
    		tempColumn.push(vCENTER_COLUMN_SUB[i]);
    	}

    	work_store.load(function() {	
    		
    		
    		Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
                
                var dataIndex = columnObj["dataIndex" ];
               columnObj[ "flex" ] =1;
               
               

         });

    		
    		//grid create
    		agrid = Ext.create('Ext.grid.Panel', {
    			title: epc8_workorder,
    		    store: work_store,
    		    layout: 'fit',
    		    columns : tempColumn,
    		    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    		    	clicksToEdit: 1
    		    })],
    		    border: false,
    		    multiSelect: true,
    		    frame: false 

    		}); //endof Ext.create('Ext.grid.Panel', 
    		
    		agrid.getSelectionModel().on({
    			selectionchange: function(sm, selections) {
		            if (selections.length) {
						if(fPERM_DISABLING()==true) {
						}else{
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            	}
		            }
		        }
    		});
    		
    		//form create
        	var form = Ext.create('Ext.form.Panel', {
    			id : 'formPanel',
    			xtype: 'form',
    			frame: false,
    	        border: false,
                bodyPadding: 15,
                region: 'center',
    	        defaults: {
    	            anchor: '100%',
    	            allowBlank: false,
    	            msgTarget: 'side',
    	            labelWidth: 60
    	        },
    	        items: [agrid]
        	});//endof createform
        	
        	//window create

        	prWin = Ext.create('ModalWindow', {
        		title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
                width: 850,
                height: 500,
                plain:true,
                items: [ form
         ],
                buttons: [{
                	text: CMD_OK,
                	handler: function(){
    	                           	if(prWin) 
    	                           	{
    	                           		prWin.close();
    	                           		store.load(function() {});
    	                           	} 

                	}
                		},
                	{
                	text: CMD_CANCEL,
                	handler: function(){
                		if(prWin) {prWin.close();} }            	
                }]
        	});
        	prWin.show();
    	});//enof load
    }
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


Ext.define('WorkOrder', {
	extend: 'Ext.data.Model',
  	 fields: /*(G)*/vCENTER_FIELDS_SUB,
  	proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/pcsline.do?method=readNormalProcessInfo'
        },
        extraParams: {
        	cartmap_uid:cartmap_uid,
        	srcahd_uid:srcahd_uid,
        	pl_no:pl_no

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
		    	is_complished: 'P'//사용자 정보 필드 정보
		    	,inout_type : 'IN' //작업지시를 한 ast 정보
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
	
//	worker_store = new Ext.data.Store({  
//		pageSize: getPageSize(),
//		model: 'PcsMember',
//		sorters: [{
//			property: 'create_date',
//			direction: 'ASC'
//		}]
//	});
	
	Ext.define('CodeStructure', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	   proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/codeStructure.do?method=read&menuCode=STD_PROCESS_NAME' //WORK_GROUP1'/*1recoed, search by cond, search */
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
	
	
	   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    params: {
		    	menuCode: 'AUS4_HUMAN'
		    },
		    callback: function(records, operation, success) {
		    	if(success ==true) {
		    		for (var i=0; i<records.length; i++){
		    			inRec2Col(records[i], fieldHuman, columnHuman, tooltipHuman);
			        }//endoffor
		    		
		    		Ext.define('PcsMemberHuman', {
		    			extend: 'Ext.data.Model',
		    			fields: fieldHuman,
		    			proxy: {
		    				type: 'ajax',
		    				api: {
		    					read: CONTEXT_PATH + '/production/schdule.do?method=readPcsMember', /*1recoed, search by cond, search */
		    					update: CONTEXT_PATH + '/production/schdule.do?method=update',
		    					destroy: CONTEXT_PATH + '/production/schdule.do?method=destroy'
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
	    		 	
		    	}//endof if(success..
		    },//callback
		    scope: this
		});	
		//Load Machine
	    (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    params: {
		    	menuCode: 'AUS4_MACHINE'
		    },
		    callback: function(records, operation, success) {
		    	if(success ==true) {
		    		for (var i=0; i<records.length; i++){
		    			console_log(records[i]);
		    			inRec2Col(records[i], fieldMachine, columnMachine, tooltipMachine);
			        }//endoffor
		    		
		    		Ext.define('PcsMemberMachine', {
		    			extend: 'Ext.data.Model',
		    			fields: fieldMachine,
		    			proxy: {
		    				type: 'ajax',
		    				api: {
		    					read: CONTEXT_PATH + '/production/schdule.do?method=readPcsMember', /*1recoed, search by cond, search */
		    					update: CONTEXT_PATH + '/production/schdule.do?method=update',
		    					destroy: CONTEXT_PATH + '/production/schdule.do?method=destroy'
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
		    	}//endof if(success..
		    },//callback
		    scope: this
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
			        region: 'center',
			        width: '60%',
			     // paging bar on the bottom
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  assignAction,'-',changeAction,
			                    '-', urgentAction, '-',printBarcode,
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
			        },
			        {
			        	xtype: 'toolbar',
			        	items: [{
		    			fieldLabel: getColName('pcs_name'),
		    			labelWidth: 70,
                    	width: 300,
                    	labelSeparator: ':',
		    			//value: pcs_name,
		    			id :'pcs_name',
		    			xtype: 'combo',
		    			mode: 'local',
		    			editable:false,
		                allowBlank: false,
		                queryMode: 'remote',
		                displayField:   'systemCode',
		                valueField:     'systemCode',
		                store: stdProcessNameStore,
			            listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
		                	}			                	
		                },
		                triggerAction: 'all',
     	                listeners: {
     	                    select: function (combo, record) {
     	                    	console_log('Selected Value : ' + combo.getValue());
     	                    	var systemCode = record[0].get('systemCode');
     	                    	var codeNameEn  = record[0].get('codeNameEn');
     	                    	var codeName  = record[0].get('codeName');
     	                    	console_log('systemCode : ' + systemCode 
     	                    			+ ', codeNameEn=' + codeNameEn
     	                    			+ ', codeName=' + codeName	);
     	                    	
     	                   	var pcs_name = Ext.getCmp('pcs_name').getValue();
     	                   console_log('pcs_name : ' + pcs_name	);
	                			store.getProxy().setExtraParam('pcs_no', pcs_name);
			     				store.load({});
     	                       
     	                    }
     	                },
		    			name: 'pcs_name'
			        	}]
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
			            	changeAction.disable();
			            	printBarcode.disable();
						}else{
							assignAction.enable();
							changeAction.enable();
							printBarcode.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();
			            	assignAction.disable();
			            	changeAction.disable();
			            	printBarcode.disable();
		            	}else{
		            		collapseProperty();
			            	assignAction.disable();
			            	changeAction.disable();
			            	printBarcode.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	 	
    });

