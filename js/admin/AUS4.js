Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var cellEditing_user = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var cellEditing_mchn = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var parent_system_code = 'WORK_GROUP';
var menu_key = "";

var selectedTab = '';

var selectedDeptUid = vCUR_DEPT_UID;
var selectedDept_Name = '';

//global var.
var grid = null;
var store = null;
var userGrid = null;
var machineGrid = null;
var worker_store = null;
var gridTab = null;
var systemCode = null;
var group_code = null;

var dept_name_combo = null;
var user_name_combo = null;
var pcs_name_combo = null;
var mchn_code_combo =null;
var selected_grid = false;

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();


var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');
        			var system_code =  rec.get("system_code");
           			CodeStructure.getProxy().setExtraParam('system_code', system_code);
        			CodeStructure.load(unique_id ,{
        				 success: function(codeStructure) { 
        					 	var parent_system_code = codeStructure.get('parent_system_code');
        					 	var system_code = codeStructure.get('system_code');
        					 	var role_code = codeStructure.get('role_code');
        						var code_name_kr = codeStructure.get('code_name_kr');
        						var code_name_en = codeStructure.get('code_name_en');
        						var code_name_zh = codeStructure.get('code_name_zh');
        						var code_order = codeStructure.get('code_order');
        						var use_yn = codeStructure.get('use_yn');
        						var description = codeStructure.get('description');
        						var delete_flag = codeStructure.get('delete_flag');
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
        				            	fieldLabel: getColName('unique_id'),
        				            	value: unique_id,
        				            	x: 5,
        				            	y: 0 + 1*lineGap,
        				            	name: 'unique_id',
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('parent_system_code'),
        				            	value: parent_system_code,
        				            	x: 5,
        				            	y: 0 + 2*lineGap,
        				            	name: 'parent_system_code',
        				            	value: parent_system_code,
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('system_code'),
        				            	value: system_code,
        				            	x: 5,
        				            	y: 0 + 3*lineGap,
        				            	name: 'system_code',
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('role_code'),
        				            	value: role_code,
        				            	x: 5,
        				            	y: 0 + 4*lineGap,
        				            	name: 'role_code',
        				            	anchor: '-5' // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('code_name_kr'),
        				            	value: code_name_kr,
        				            	x: 5,
        				            	y: 0 + 5*lineGap,
        				            	name: 'code_name_kr',
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('code_name_en'),
        				            	value: code_name_en,
        				            	x: 5,
        				            	y: 0 + 6*lineGap,
        				            	name: 'code_name_en',
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('code_name_zh'),
        				            	value: code_name_zh,
        				            	x: 5,
        				            	y: 0 + 7*lineGap,
        				            	name: 'code_name_zh',
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('code_order'),
        				            	value: code_order,
        				            	x: 5,
        				            	y: 0 + 8*lineGap,
        				            	name: 'code_order',
        				            	anchor: '-5' // anchor width by percentage     				            
        				            } ,
        				            {
        				            	fieldLabel: getColName('use_yn'),
        				            	value: use_yn,
        				            	x: 5,
        				            	y: 0 + 9*lineGap,
        				            	name: 'use_yn',
        				            	anchor: '-5'  // anchor width by percentage
     				            		        				           
        				            } ,
        				            {
        				            	fieldLabel: getColName('description'),
        				            	value: description,
        				            	x: 5,
        				            	y: 0 + 10*lineGap,
        				            	name: 'description',
        				            	anchor: '-5'  // anchor width by percentage
        				            } ,
        				            {
        				            	fieldLabel: getColName('delete_flag'),
        				            	value: delete_flag,
        				            	x: 5,
        				            	y: 0 + 11*lineGap,
        				            	name: 'delete_flag',
        				            	anchor: '-5'  // anchor width by percentage
        				            } 
        				          ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 700,
        				            height: 450,
        				            minWidth: 250,
        				            minHeight: 200,
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
                			var system_code =  rec.get("system_code");
                   			CodeStructure.getProxy().setExtraParam('system_code', system_code);
                			CodeStructure.load(unique_id ,{
                				 success: function(codeStructure) {
                					 	var parent_system_code = codeStructure.get('parent_system_code');
                					 	var system_code = codeStructure.get('system_code');
                					 	var role_code = codeStructure.get('role_code');
                						var code_name_kr = codeStructure.get('code_name_kr');
                						var code_name_en = codeStructure.get('code_name_en');
                						var code_name_zh = codeStructure.get('code_name_zh');
                						var code_order = codeStructure.get('code_order');
                						var use_yn = codeStructure.get('use_yn');
                						var description = codeStructure.get('description');
                						var delete_flag = codeStructure.get('delete_flag');
                						
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
                				            items: [ 
											{
											    fieldLabel: getColName('unique_id'),
											    value: unique_id,
											    x: 5,
											    y: 0 + 1*lineGap,
											    name: 'unique_id',
								                readOnly: true,
								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
											    anchor: '-5'  // anchor width by percentage
											},        				            
											{												
		        				            	fieldLabel: getColName('parent_system_code'),
		        				            	value: parent_system_code,
		        				            	x: 5,
		        				            	y: 0 + 2*lineGap,
		        				            	name: 'parent_system_code',
		        				            	readOnly: true,
								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('system_code'),
		        				            	value: system_code,
		        				            	x: 5,
		        				            	y: 0 + 3*lineGap,
		        				            	name: 'system_code',
		        				            	readOnly: true,
								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('role_code'),
		        				            	value: role_code,
		        				             	xtype: 'combo',
		        				            	displayField: 'value',
		        				            	valueField: 'value',
		        				            	x: 5,
		        				            	y: 0 + 4*lineGap,
		        				            	name: 'role_code',
		        				            	anchor: '-5' ,  // anchor width by percentage
		        				          		store: Ext.create('Ext.data.Store', {
		        				            		fields: ['value'],
		        				            		data: [
		        				            		       {value: aus4_worker},
		        				            		       {value: aus4_machine}
		        				            		]
		        				            	})
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('code_name_kr'),
		        				            	value: code_name_kr,
		        				            	x: 5,
		        				            	y: 0 + 5*lineGap,
		        				            	name: 'code_name_kr',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('code_name_en'),
		        				            	value: code_name_en,
		        				            	x: 5,
		        				            	y: 0 + 6*lineGap,
		        				            	name: 'code_name_en',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('code_name_zh'),
		        				            	value: code_name_zh,
		        				            	x: 5,
		        				            	y: 0 + 7*lineGap,
		        				            	name: 'code_name_zh',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('code_order'),
		        				            	value: code_order,
		        				            	x: 5,
		        				            	y: 0 + 8*lineGap,
		        				            	name: 'code_order',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('use_yn'),
		        				            	value: use_yn,
		        				            	xtype: 'combo',
		        				            	displayField: 'value',
		        				            	valueField: 'value',
		        				            	x: 5,
		        				            	y: 0 + 9*lineGap,
		        				            	name: 'use_yn',
		        				            	anchor: '-5' ,  // anchor width by percentage
		        				            	store: Ext.create('Ext.data.Store', {
		        				            		fields: ['value'],
		        				            		data: [
		        				            		       {value: 'Y'},
		        				            		       {value: 'N'}       
		        				            		]
		        				            		
		        				            	})	
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('description'),
		        				            	value: description,
		        				            	x: 5,
		        				            	y: 0 + 10*lineGap,
		        				            	name: 'description',
		        				            	anchor: '-5'  // anchor width by percentage
		        				            } ,
		        				            {
		        				            	fieldLabel: getColName('delete_flag'),
		        				            	value: delete_flag,
		        				            	xtype: 'combo',
		        				            	displayField: 'value',
		        				            	valueField: 'value',
		        				            	x: 5,
		        				            	y: 0 + 11*lineGap,
		        				            	name: 'delete_flag',
		        				            	anchor: '-5' , // anchor width by percentage
		        				            	store: Ext.create('Ext.data.Store', {
		        				            		fields: ['value'],
		        				            		data: [
		        				            		       {value: 'Y'},
		        				            		       {value: 'N'}
		        				            		 ]	
		        				            	})
		        				            }
                				           ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
                				            height: 450,
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
	                				                	var codeStructure = Ext.ModelManager.create(val, 'CodeStructure');
	                				                	
	                				            		//鞝€鞛?靾橃爼
	                				                	codeStructure.save({
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
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };

//writer define
Ext.define('CodeStructure.writer.SinglePost', {
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
        		var system_code =  rec.get('system_code');
        		var parent_system_code = rec.get('parent_system_code');
	           	var codeStructure = Ext.ModelManager.create({
	           		system_code : system_code,
	           		parent_system_code : parent_system_code
	        	 }, 'CodeStructure');
	        
	           	codeStructure.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

//Define Remove Action
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

//Define Add Action
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
	            	fieldLabel: getColName('parent_system_code'),
	            	x: 5,
	            	y: 0 + 1*lineGap,
	            	name: 'parent_system_code',
	            	value: parent_system_code,
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('system_code'),
	            	x: 5,
	            	y: 0 + 2*lineGap,
	            	name: 'system_code',
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('role_code'),
	            	xtype: 'combo',
	            	displayField: 'value',
	            	valueField: 'value',
	            	x: 5,
	            	y: 0 + 3*lineGap,
	            	name: 'role_code',
	            	anchor: '-5' , // anchor width by percentage
	          		store: Ext.create('Ext.data.Store', {
	            		fields: ['value'],
	            		data: [
	            		       {value: aus4_workder},
	            		       {value: aus4_machine}
	            		]
	            	})
	            } ,
	            {
	            	fieldLabel: getColName('code_name_kr'),
	            	x: 5,
	            	y: 0 + 4*lineGap,
	            	name: 'code_name_kr',
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('code_name_en'),
	            	x: 5,
	            	y: 0 + 5*lineGap,
	            	name: 'code_name_en',
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('code_name_zh'),
	            	x: 5,
	            	y: 0 + 6*lineGap,
	            	name: 'code_name_zh',
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('code_order'),
	            	x: 5,
	            	y: 0 + 7*lineGap,
	            	name: 'code_order',
	            	xtype: 'numberfield',
		            minValue: 0,
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('use_yn'),
	            	xtype: 'combo',
	            	displayField: 'value',
	            	valueField: 'value',
	            	x: 5,
	            	y: 0 + 8*lineGap,
	            	name: 'use_yn',
	            	anchor: '-5' , // anchor width by percentage
	            	store: Ext.create('Ext.data.Store', {
	            		fields: ['value'],
	            		data: [
	            		       {value: 'Y'},
	            		       {value: 'N'}
	            		]
	            	})	
	            } ,
	            {
	            	fieldLabel: getColName('description'),
	            	x: 5,
	            	y: 0 + 9*lineGap,
	            	name: 'description',
	            	anchor: '-5'  // anchor width by percentage
	            } ,
	            {
	            	fieldLabel: getColName('delete_flag'),
	            	xtype: 'combo',
	            	displayField: 'value',
	            	valueField: 'value',
	            	x: 5,
	            	y: 0 + 10*lineGap,
	            	name: 'delete_flag',
	            	anchor: '-5' ,  // anchor width by percentage
	            	store: Ext.create('Ext.data.Store', {
	            		fields : ['value'],
	            		data : [
	            		        {value : 'Y'},
	            		        {value : 'N'}
	            		]
	            	})
	            }   
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 700,
            height: 420,
            minWidth: 250,
            minHeight: 200,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid()){
				    	 var val = form.getValues(false);
				       	 var codeStructure = Ext.ModelManager.create(val, 'CodeStructure');
				       //欷戨车 旖旊摐 觳错伂
					     codeStructure.save({
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
                    	Ext.MessageBox.alert('Erro','not valid');
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

//Define Edit Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});


//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

function pcsMemberdeleteConfirm(btn){
	var pcsmemberGrid = null;
	var member_type = selectedTab;
	
	if(member_type=='HUMAN'){
		pcsmemberGrid = userGrid
	} else {
		pcsmemberGrid = machineGrid
	}
    var selections = pcsmemberGrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
       
        		var rec = pcsmemberGrid.getSelectionModel().getSelection()[i];
        		var unique_id = rec.get('unique_id');
        		console_log(rec);
	           	 var pcsmember = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsMember');
        		
	           	pcsmember.destroy( {
	           		 success: function() {
	           			Ext.Ajax.request({
            				url: CONTEXT_PATH + '/production/schdule.do?method=totalupdate',
            				params:{
            					system_code : group_code,
            					parent_system_code : parent_system_code
            				},
            				success : function(result, request) {
            					store.load({});
            				},
            				failure: extjsUtil.failureMessage
            			});	
	           		 }
	           	});
           	
        	}
        	pcsmemberGrid.store.remove(selections);
        }

    }
};

var pcsMemberdelete = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: pcsMemberdeleteConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

function ComboSetter(comboBox, value) {
    var store = comboBox.store;
    var valueField = comboBox.valueField;
    var displayField = comboBox.displayField;

    var recordNumber = store.findExact(valueField, value, 0);

    console_log('valueField=' + valueField);
    console_log('displayField=' + displayField);
    console_log('recordNumber=' + recordNumber);
    
    if (recordNumber == -1)
        return -1;

    var displayValue = store.getAt(recordNumber).data[displayField];
    
    console_log('displayValue=' + displayValue);
    comboBox.setValue(value);
    comboBox.setRawValue(displayValue);
    comboBox.selectedIndex = recordNumber;
    return recordNumber;
}

function changeTab(selectedTab,group_code){
	console_log('group_code:' +group_code);
	console_log('selectedTab:' +selectedTab);
	
	if(group_code==null || group_code=='') {
		console_log('not defined group_code');
		return;
	}
	worker_store.getProxy().setExtraParam('system_code', group_code);
	worker_store.getProxy().setExtraParam('member_type', selectedTab);
	if(selectedTab == 'MACHINE'){
//		Ext.define('PcsMember', {
//			extend: 'Ext.data.Model',
//			fields: /*(G)*/vCENTER_FIELDS,
//			proxy: {
//				type: 'ajax',
//				api: {
//					read: CONTEXT_PATH + '/production/schdule.do?method=readMachine' /*1recoed, search by cond, search */
//				},
//				reader: {
//					type: 'json',
//					root: 'datas',
//					totalProperty: 'count',
//					successProperty: 'success',
//					excelPath: 'excelPath'
//				},
//				writer: {
//					type: 'singlepost',
//					writeAllFields: false,
//					root: 'datas'
//				} 
//			}
//		});
		worker_store.load({});
	}else{
		worker_store.load({});
	}
}

var fieldHuman = [];
var columnHuman = [];
var tooltipHuman = [];

var fieldMachine = [];
var columnMachine = [];
var tooltipMachine = [];
Ext.onReady(function() {
	LoadJs('/js/util/StdProcessName.js');
	var ProcessListStore = Ext.create('Mplm.store.ProcessListStore', {hasNull: false} );
	Ext.define('PcsMember', {
		extend: 'Ext.data.Model',
		fields: /*(G)*/vCENTER_FIELDS,
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
	worker_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsMember',
		sorters: [{
			property: 'create_date',
			direction: 'ASC'
		}]
	});
	
	Ext.define('CodeStructure', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	   proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/codeStructure.do?method=read&menuCode=WORK_GROUP' //WORK_GROUP1'/*1recoed, search by cond, search */
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
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'CodeStructure',
		sorters: [{
            property: 'parent_system_code',
            direction: 'ASC'
        }]
	});
	
 	store.load(function() {
 			var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: true} );
 			Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {}); 
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        height: getCenterPanelHeight(),
			        autoScroll: true,
			        autoHeight: true,
	                region: 'west',
	                width: '45%',
	                height: '100%',
	                bbar: getPageToolbar(store),
	                
			        dockedItems: [],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        plugins: [cellEditing],
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
	   			              return record.get(' ')  == vCUR_USER_UID ? 'my-row' : ''; 
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
			                    return false;
			                }
			            }
			        },
			        title: getMenuTitle()//,
			    });
			console_log('created_grid');
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
		            	console_log(selections.length);
						//grid info 旒滉赴
		            	console_log(selections[0]);
		            	selected_grid = true;
		            	console_log('dept_name_combo');
		            	dept_name_combo.enable();
		            	user_name_combo.enable();
						if(pcs_name_combo!=null && mchn_code_combo!=null){
							pcs_name_combo.enable();
							mchn_code_combo.enable();
						}
		            	console_log('end ');
						
			        	var record = selections[0];
			        	console_log(record);
			        	group_code = record.get('system_code');
			        	//console_log(group_code);
			        	
			        	var aaa = record.get('codeName');
			        	console_log(aaa);
			        	
			        	var j2_code_name_kr = aaa; //record.get('codeName');
			        	
			        	console_log(j2_code_name_kr);
			        	console_log('setting text ');
			        	Ext.getCmp('j2_code_name_kr').setValue(j2_code_name_kr);
			        	Ext.getCmp('j2_code_name_mchn_kr').setValue(j2_code_name_kr);
			        	console_log('setting text end');
			        	
			        	console_log('system_code : ' + group_code);
			        	changeTab(selectedTab,group_code);
						detailAction.enable();
		            } else {
		            	dept_name_combo.disable();
			        	user_name_combo.disable();
			        	if(pcs_name_combo!=null && mchn_code_combo!=null){
							pcs_name_combo.disable();
							mchn_code_combo.disable();
						}
		            	detailAction.enable();
		            }
		        }
		    });
			console_log('add event to grid');
		    var deptStore = Ext.create('Mplm.store.DeptStore', {hasNull: false} );
		    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
//		    worker_store.load(function() {
			    gridTab  = Ext.widget('tabpanel', {
			    			id : 'tempport',
			    	        activeTab: 0,
					        multiSelect: true,
					        stateId: 'stateGrid1' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        split: true,
			                region: 'east',
			                width: '55%',
			                height: '100%',
			    	        items: [
			    	              {
			    	            	  
			    	                title: aus4_workder,
					                id: 'user-tab-div',
			    	                dockedItems: [
											{
											  	xtype: 'toolbar',
											  	items: [{
													  id :'dept_combo',
											          name:           'dept_combo',
													  xtype:          'combo',
											          mode:           'local',
											          triggerAction:  'all',
											          editable:       false,
											          disabled: true,
											          allowBlank: false,
											          value: vCUR_DEPT_UID,
											          store: deptStore,
											          displayField:   'dept_name',
											          valueField:     'unique_id',
											          value: vCUR_DEPT_NAME,
											          fieldStyle: 'background-color: #FBF8E6; background-image: none;',
											          queryMode: 'remote',
											          listConfig:{
											          	getInnerTpl: function(){
											          		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
											          	}			                	
											          },
											          	listeners: {
															'afterrender' : function(grid) {
																dept_name_combo=this;
																var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
																elments.each(function(el) {
																			}, this);
																	
																}
											            		,
											          		select: function (combo, record) {
											          			var name_combo = Ext.getCmp('user_name');
											          			selectedDeptUid = record[0].get('unique_id');
											          			name_combo.store.getProxy().setExtraParam('comdst_uid', selectedDeptUid);
											          			name_combo.store.load(function(records) {
											          				console_log(records);
											          			});
											          		}//endofselect
											          	}
											  	},
											  	 {
							    					id :'user_name',
							    			        xtype: 'combo',
							    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
							    			        store: userStore,
							    			        displayField:   'user_name',
							    			        valueField:   'unique_id',
							    			        disabled: true,
							    			        queryMode: 'local',
							    			        triggerAction: 'all',
							    			        mode: 'local',
							    			        editable:false,	
							    			        minChars: 2,
							    			        width: 80,
							    			        listConfig:{
							    			            loadingText: 'Searching...',
							    			            emptyText: 'No matching posts found.',
							    			            getInnerTpl: function() {
							    			                return '<div data-qtip="{unique_id}">{user_name}</div>';
							    			            }			                	
							    			        },
							    			        listeners: {
							    			        	'afterRender': function () {
							    			        		user_name_combo=this;
										                },
							    			        	select: function (combo, record) {
							    			        		console_log(record[0]);
							    			        		var user_unique_id = record[0].get('unique_id');
							    			        		var dept_code = record[0].get('dept_code');
							    			        		var dept_name = record[0].get('dept_name');
							    			        		var user_name = record[0].get('user_name');
							    			        		Ext.Ajax.request({
							    			        			url: CONTEXT_PATH + '/production/schdule.do?method=createMemeber',
							    			        			params:{
							    			        				dept_code : dept_code,
							    			        				dept_name : dept_name,
							    			        				user_name : user_name,
							    			        				group_code : group_code,
							    			        				user_unique_id : user_unique_id,
							    			        				member_type : selectedTab,
							    			        				comdst_uid : vCUR_DEPT_UID
							    			        			},
							    			        			success : function(result, request) {
							    			        				var result = result.responseText;
							                						console_log('result:' + result);
							                						if(result == 'false'){
							                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
							                						}else{
							                							worker_store.load({});
							                						}
							    			        			},
							    			        			failure: extjsUtil.failureMessage
							    			        		});	
							    			        	},
							    			        	afterrender: function (cb) {
							    			        		Ext.Ajax.request({
							    			        			url: CONTEXT_PATH + '/userMgmt/user.do?method=query',
							    			        			params:{
							    			        				comdst_uid : vCUR_DEPT_UID
							    			        			},
							    			        			success : function(result, request) {
							    			        				var obj =Ext.decode(result.responseText);
							    			        				var name_combo = Ext.getCmp('user_name');
							    			        				name_combo.clearValue();
							    			        				name_combo.store.removeAll();
							    			        				/*var user_query_name = obj.datas[2].user_name;
							    			        				console_log(user_query_name);
							    			        				*/
							    			        				for(var i=0; i<obj.count; i++){
							    			        					var user_name = obj.datas[i].user_name;
							    			        					var unique_id = obj.datas[i].unique_id;
							    			        					name_combo.store.add({
							    			        						user_name: user_name,
							    			        						unique_id: unique_id
																	 });
							    			        				}
							    			        			},
							    			        			failure: extjsUtil.failureMessage
							    			        		});	
							    			             }
							    			        }
							    				},'-',{
							    					fieldLabel: epc6_work_group,
							    			        labelWidth: 55,
							    			        width: 250,
							    			        xtype: 'textfield',
							    					id :'j2_code_name_kr',
							    			        labelSeparator: ':',
							    			        readOnly: true,
							    			 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
							    				},'->',pcsMemberdelete,'-',{
							    					text: panelSRO1133,
							                        iconCls: 'save',
							                        disabled: fPERM_DISABLING(),
							                        handler: function ()
							                        {
							                        	console_log(record);
							                              for (var i = 0; i <userGrid.store.data.items.length; i++)
							                              {
								                                var record = userGrid.store.data.items [i];
								                                if (record.dirty) {  
								                                	worker_store.getProxy().setExtraParam('unique_uid', vSELECTED_UNIQUE_ID);
								                                	console_log(record);
								        		            		//저장 수정
								                                	record.save({
								        		                		success : function() {
								        		                			Ext.Ajax.request({
								        		                				url: CONTEXT_PATH + '/production/schdule.do?method=totalupdate',
								        		                				params:{
								        		                					system_code : group_code,
								        		                					parent_system_code : parent_system_code
								        		                				},
								        		                				success : function(result, request) {
								        		                					store.load({});
								        		                				},
								        		                				failure: extjsUtil.failureMessage
								        		                			});	
								        		                		}
								        		                	 });
								                                }
								                          }
							                        }
							    				}]//endof itemsoftoolbar
											  }
											 
			    	                ],
			    	                listeners: {
			    	                    activate: function(tab){
			    	                        setTimeout(function() {
			    	                        	selectedTab = 'HUMAN';
			    	                        	console_log(selectedTab);
			    	                        	changeTab(selectedTab,group_code);
			    	                        }, 1);
			    	                    }
			    	                }
			    	            },{
			    	                title: aus4_machine,
			    	                id: 'machine-tab-div',
			    	                dockedItems: [{
												  	xtype: 'toolbar',
												  	items: [{
										    			id :'pcs_name',
										    			xtype: 'combo',
										    			mode: 'local',
										    			editable:false,
										                allowBlank: false,
										                queryMode: 'remote',
										                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
										                emptyText: aus4_process_group,
										                displayField:   'systemCode',
										                valueField:     'systemCode',
										                width: 220,
										                store: stdProcessNameStore,
											            listConfig:{
										                	getInnerTpl: function(){
										                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
										                	}			                	
										                },
										                triggerAction: 'all',
								     	                listeners: {
															'afterrender' : function(grid) {
																pcs_name_combo=this;
																var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
																elments.each(function(el) {
																			}, this);
																	
																}
											            		,
								     	                    select: function (combo, record) {
								     	                    	systemCode = record[0].get('systemCode');
								     	                    	var process_combo = Ext.getCmp('mchn_code');
								     	                    	process_combo.store.getProxy().setExtraParam('pcs_code', systemCode);
								     	                    	process_combo.store.load(function(records) {
											          				console_log(records);
											          			});
								     	                    }
								     	                }
												  	},
												  	{
												  		id :'mchn_code',
										    			xtype: 'combo',
										    			mode: 'local',
										    			editable:false,
										                allowBlank: false,
										                queryMode: 'remote',
										                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
										                emptyText: aus4_process_list,
										                displayField:   'mchn_code',
										                valueField:     'mchn_code',
										                width: 220,
										                store: ProcessListStore,
											            listConfig:{
										                	getInnerTpl: function(){
										                		return '<div data-qtip="{mchn_code}">[{mchn_code}] / {name_cn}	</div>';
										                	}			                	
										                },
										                triggerAction: 'all',
								     	                listeners: {
								     	                	'afterRender': function () {
								     	                		mchn_code_combo=this;
											                },
								     	                    select: function (combo, record) {
								     	                    	console_log(record[0]);
								    			        		var mchn_unique_id = record[0].get('id');
								    			        		var mchn_code = record[0].get('mchn_code');
								    			        		var name_cn = record[0].get('name_cn');
								    			        		var name_en = record[0].get('name_en');
								    			        		var mchn_type = record[0].get('mchn_type');
								    			        		var maker = record[0].get('maker');
								    			        		var group_name = record[0].get('group_name');
								    			        		console_log(mchn_unique_id);
								    			        		console_log(mchn_code);
								    			        		console_log(name_cn);
								    			        		console_log(name_en);
								    			        		console_log(mchn_type);
								    			        		console_log(maker);
								    			        		console_log(group_name);
								    			        		Ext.Ajax.request({
								    			        			url: CONTEXT_PATH + '/production/schdule.do?method=createMemeber',
								    			        			params:{
								    			        				mchn_unique_id : mchn_unique_id,
								    			        				mchn_code : mchn_code,
								    			        				name_cn : name_cn,
								    			        				name_en : name_en,
								    			        				mchn_type : mchn_type,
								    			        				maker : maker,
								    			        				group_name : group_name,
								    			        				group_code : group_code,
								    			        				member_type : selectedTab
								    			        			},
								    			        			success : function(result, request) {
								    			        				var result = result.responseText;
								                						console_log('result:' + result);
								                						if(result == 'false'){
								                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
								                						}else{
								                							worker_store.load({});
								                						}
								    			        			},
								    			        			failure: extjsUtil.failureMessage
								    			        		});	
								     	                    },
								     	                   afterrender: function (cb) {
								    			        		Ext.Ajax.request({
								    			        			url: CONTEXT_PATH + '/userMgmt/user.do?method=query',
								    			        			params:{
								    			        				comdst_uid : vCUR_DEPT_UID
								    			        			},
								    			        			success : function(result, request) {
								    			        				var obj =Ext.decode(result.responseText);
								    			        				var name_combo = Ext.getCmp('user_name');
								    			        				name_combo.clearValue();
								    			        				name_combo.store.removeAll();
								    			        				/*var user_query_name = obj.datas[2].user_name;
								    			        				console_log(user_query_name);
								    			        				*/
								    			        				for(var i=0; i<obj.count; i++){
								    			        					var user_name = obj.datas[i].user_name;
								    			        					var unique_id = obj.datas[i].unique_id;
								    			        					name_combo.store.add({
								    			        						user_name: user_name,
								    			        						unique_id: unique_id
																		 });
								    			        				}
								    			        			},
								    			        			failure: extjsUtil.failureMessage
								    			        		});	
								    			             }
								     	                }
												  	},'->',pcsMemberdelete,{
												  		text: panelSRO1133,
								                        iconCls: 'save',
								                        disabled: fPERM_DISABLING(),
								                        handler: function ()
								                        {
								                              for (var i = 0; i <userGrid.store.data.items.length; i++)
								                              {
									                                var record = userGrid.store.data.items [i];
									                                if (record.dirty) {  
									                                	worker_store.getProxy().setExtraParam('unique_uid', vSELECTED_UNIQUE_ID);
									                                	console_log(record);
									        		            		//저장 수정
									                                	record.save({
									        		                		success : function() {
									        		                			Ext.Ajax.request({
									        		                				url: CONTEXT_PATH + '/production/schdule.do?method=totalupdate',
									        		                				params:{
									        		                					system_code : group_code,
									        		                					parent_system_code : parent_system_code
									        		                				},
									        		                				success : function(result, request) {
									        		                					store.load({});
									        		                				},
									        		                				failure: extjsUtil.failureMessage
									        		                			});	
									        		                		}
									        		                	 });
									                                }
									                          }
								                        }
												  	}]
												  },{
													  xtype: 'toolbar',
												  	  items: [{
												  		fieldLabel: epc6_work_group,
								    			        labelWidth: 55,
								    			        width: 250,
								    			        xtype: 'textfield',
								    					id :'j2_code_name_mchn_kr',
								    			        labelSeparator: ':',
								    			        readOnly: true,
								    			 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
												  	  }]
												  }
													 
			    	                ],
			    	                listeners: {
			    	                    activate: function(tab){
			    	                        setTimeout(function() {
			    	                        	selectedTab = 'MACHINE';
			    	                        	console_log(selectedTab);
			    	                        	if(selected_grid == true){
			    	                        		pcs_name_combo.enable();
			    	    							mchn_code_combo.enable();
			    	                        	}
			    	                        	changeTab(selectedTab,group_code);
			    	                        }, 1);
			    	                    }
			    	                }
			    	            }
			    	            
			    	        ]
			    	    });
				console_log('created_grid tab');
			//Load Human
		   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'AUS4_HUMAN'
			    },
			    callback: function(records, operation, success) {
			    	console_log('come IN HUMAN');
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], fieldHuman, columnHuman, tooltipHuman);
				        }//endoffor
		    		 	
			    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    		Ext.each(/*(G)*/columnHuman, function(columnObj, index) {
			    			var dataIndex = columnObj["dataIndex"];
			    			if(dataIndex!='no') {
			    				if('day_capa' == dataIndex) {
			    					columnObj["editor"] = {
			    	                };	
			    				}
			    			}
			    		}); 
			    		userGrid  = Ext.create('Ext.grid.Panel', {
			    			store: worker_store,
			    			selModel: selModel,
					        collapsible: false,
					        multiSelect: false,
					        stateId: 'userGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        autoHeight: true,
					        height: getCenterTapPanelHeight(),
					        columns: columnHuman,
					        plugins: [cellEditing_user],
					        bbar: getPageToolbar(worker_store)
					    });
						console_log('created_grid Human');
			    		userGrid.getSelectionModel().on({
			    			selectionchange: function(sm, selections) {
			    				if (selections.length) {
			    					if(fPERM_DISABLING()==true) {
						            	pcsMemberdelete.disable();
					            	}else{
						            	pcsMemberdelete.enable();
					            	}
			    				}else {
					            	if(fPERM_DISABLING()==true) {
						            	pcsMemberdelete.disable();
					            	}else{
						            	pcsMemberdelete.disable();
					            	}
			    				}
			    			}
			    		});
			    		var ptarget = Ext.getCmp('user-tab-div');
			    		ptarget.removeAll();
			    		ptarget.add(userGrid);
			    		ptarget.doLayout();
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
			    	console_log('come IN MACHINE');
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			console_log(records[i]);
			    			inRec2Col(records[i], fieldMachine, columnMachine, tooltipMachine);
				        }//endoffor
			    		
			    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    		
			    		Ext.each(/*(G)*/columnMachine, function(columnObj, index) {
			    			var dataIndex = columnObj["dataIndex"];
			    			if(dataIndex!='no') {
			    				if('day_capa' == dataIndex) {
			    					columnObj["editor"] = {
			    	                };	
			    				}
			    			}
			    		});
			    		machineGrid  = Ext.create('Ext.grid.Panel', {
			    			store: worker_store,
			    			selModel: selModel,
					        collapsible: false,
					        multiSelect: false,
					        stateId: 'userGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        autoHeight: true,
			                height: getCenterTapPanelHeight(),
					        columns: columnMachine,
					        plugins: [cellEditing_mchn],
					        bbar: getPageToolbar(worker_store)
					    });
			    		console_log('created_grid Machine');
			    		machineGrid.getSelectionModel().on({
			    			selectionchange: function(sm, selections) {
			    				if (selections.length) {
			    					if(fPERM_DISABLING()==true) {
						            	pcsMemberdelete.disable();
					            	}else{
						            	pcsMemberdelete.enable();
					            	}
			    				}else {
					            	if(fPERM_DISABLING()==true) {
						            	pcsMemberdelete.disable();
					            	}else{
						            	pcsMemberdelete.disable();
					            	}
			    				}
			    			}
			    		});
			    		var ptarget = Ext.getCmp('machine-tab-div');
			    		ptarget.removeAll();
			    		ptarget.add(machineGrid);
			    		ptarget.doLayout();
			    	}//endof if(success..
			    },//callback
			    scope: this
			});	
		   /* var main =  Ext.create('Ext.panel.Panel', {
		    	title: '',
		        height: '100%',
			    layout:'border',
		        border: false,
		        layoutConfig: {columns: 2, rows:1},
			    defaults: {
			        collapsible: false,
			        split: false,
			        margins: '0 5 0 0'
			    },
			    
			    items: [grid, gridTab]
			});
		fLAYOUT_CONTENT(main);*/
		fLAYOUT_CONTENTMulti([grid,gridTab]);  
		cenerFinishCallback();//Load Ok Finish Callback
	//}); //store load
 	});
});	//OnReady
     
