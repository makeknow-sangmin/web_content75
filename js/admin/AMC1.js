
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var parent_system_code = '';
var menu_key = "";

//global var.
var grid = null;
var store = null;

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();


var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			//console_logs('rec', rec);
        			var unique_id = rec.get('unique_id');
        			var system_code =  rec.get("system_code");
           			CodeStructure.getProxy().setExtraParam('system_code', system_code);
        			CodeStructure.load(unique_id ,{
        				 success: function(codeStructure) {
        					 //console_logs('codeStructure', codeStructure);
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
		        				            		       {value: 'string'},
		        				            		       {value: 'double'},
		        				            		       {value: 'int'},
		        				            		       {value: 'long'},
		        				            		       {value: 'number'}
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
		        				            } ,
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



//Define Remove Action
var copyAction = Ext.create('Ext.Action', {
	itemId: 'copyActionButton',
    iconCls: 'copy',
    text: '복사',
    disabled: true,
    handler: function(widget, event) {
    	var records = grid.getSelectionModel().getSelection();
    	if(records.length==0) {
    		Ext.MessageBox.alert('오류','먼저 복사할 대상 레코드를 선택하세요.');
    	} else {
    		
    		arrObj = [];
    		for(var i=0; i<records.length; i++) {
    			
    			var o = {};
    		 	o['system_code'] = records[i].get('system_code');
    		 	o['role_code'] = records[i].get('role_code');
    			o['code_name_kr'] = records[i].get('code_name_kr');
    			o['code_name_en'] = records[i].get('code_name_en');
    			o['code_name_zh'] = records[i].get('code_name_zh');
    			o['code_order'] = records[i].get('code_order');
    			o['use_yn'] = records[i].get('use_yn');
    			o['description'] = records[i].get('description');
        		
    			arrObj.push(o);
    			
    		}
    		
    		var win = Ext.create('ModalWindow', {
            	title: CMD_MODIFY  + ' :: ' + /* (G) */vCUR_MENU_NAME,
                width: 400,
                height: 200,
                minWidth: 400,
                minHeight: 200,
                layout: 'fit',
                plain:true,
                items: Ext.create('Ext.form.Panel', {
    		        defaultType: 'textfield',
    		        border: false,
    		        bodyPadding: 15,
    		        id : 'formPanel',
    	            defaults: {
    	                anchor: '100%',
    	                allowBlank: false,
    	                msgTarget: 'side',
    	                labelWidth: 80
    	            },
    		        items: [
    		                {
    		                	xtype:'component',
    		                	html: '복사의 목적지인 모 코드를 입력하세요.<hr /><br>'
    		                },
                            {
                                xtype: 'textfield',
                                flex : 1,
                                name : 'parent_system_code',
                                fieldLabel: '모 코드'
                            }
                            
                            ]
                }),
                buttons: [{
                    text: CMD_OK,
                	handler: function(){
                        var form = Ext.getCmp('formPanel').getForm();
                        if(form.isValid())
                        {
	                    	var val = form.getValues(false);
	                    	var parent_system_code = val['parent_system_code'];
	                    	
	                    	function doNext(i, parent_system_code)
	                    	{
	                    		if(i==arrObj.length) {
	                    			Ext.MessageBox.alert('결과', '복사가 끝났습니다.');
	                    			return;
	                    		}
	                    		
	                    		var o = arrObj[i];
	                    		o['parent_system_code'] = parent_system_code
	                    		o['unique_id'] = null;
	                        	var codeStructure = Ext.ModelManager.create(o, 'CodeStructure');
	      					    codeStructure.save({ success : function() {  } }); 	

	                    	    setTimeout(function()
	                    	    {
	                    	    	doNext(i + 1, parent_system_code);

	                    	    }, 300);
	                    	}

	                    	doNext(0, parent_system_code);
//	                    	
//	                    	
//	                    	for(var i=0; i<arrObj.length; i++) {
//	                    		var o = arrObj[i];
//	                    		o['parent_system_code'] = val['parent_system_code'];
//	                    		o['unique_id'] = null;
//	                        	var codeStructure = Ext.ModelManager.create(o, 'CodeStructure');
//	      					    codeStructure.save({ success : function() {  } }); 		
//	                    	}
                    	
	                    	
	                    	
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
                		if(win) {
                			win.close();}
                			// lfn_gotoHome();
                		}
                }]
            });
            win.show();
    		
    		
    		
    		
    		
    		
    		
    	}
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
	            		       {value: 'string'},
	            		       {value: 'double'},
	            		       {value: 'int'},
	            		       {value: 'long'},
	            		       {value: 'number'}
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
	            	value:'N',
	            	x: 5,
	            	y: 0 + 10*lineGap,
	            	name: 'delete_flag',
	            	anchor: '-5' ,  // anchor width by percentage
	            	store: Ext.create('Ext.data.Store', {
	            		fields : ['value'],
	            		data : [
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
                    	Ext.MessageBox.alert('Error','not valid');
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
    items: [ detailAction, editAction, copyAction, removeAction  ]
});




Ext.onReady(function() {
	
	var menuStructStore = Ext.create('Mplm.store.MenuStore', {hasNull: false, comboType: 'struct'} );
	var menuObjectStore = Ext.create('Mplm.store.MenuStore', {hasNull: false, comboType: 'object'} );
	var parentCodeStore = Ext.create('Mplm.store.ParentCodeStore', {hasNull: false} );

	
	var arrMenuSelectToolbar = [];
	
	arrMenuSelectToolbar.push(
			{
				id:'struct_combo',
				name:'struct_combo',
	        	xtype: 'combo',
	        	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                mode: 'local',
                editable: false,
                allowBlank: true,
                queryMode: 'remote',
                emptyText: getColName('parent_system_code'),
                displayField:   'display_name',
                valueField:     'menu_key',
                store: menuStructStore,
	            listConfig:{ 	
	                getInnerTpl: function(){
	            		var obj2 = Ext.getCmp('object_combo'); 
                	    obj2.store = 
                	    	Ext.create('Ext.data.Store', {
                	        fields : ['menu_key', 'display_name'],
                	        data   : []
                	    	});
	                		return '<div data-qtip="{menu_key}">[{menu_key}] {display_name}</div>';
	                	}			                	
	             },
	             triggerAction: 'all',
 	             listeners: {
 	                 select: function (combo, record) {
 	                     var struct_code = combo.getValue(); 
 	                    console_log('Selected Value : ' + struct_code);
 	                     menu_key  = record[0].get('menu_key');

 	                     
 	                  //  menuObjectStore.proxy.extraParams.menuCode = menu_key;
 	                   
 	                    menuObjectStore.load( function(records) {
	     					console_log(records); 
	     					if(records != undefined ) {
		   	                	  var obj2 = Ext.getCmp('object_combo');
		   	                	  obj2.clearValue();
		   	                	  obj2.store.removeAll();
		   	   	                  for (var i=0; i<records.length; i++){ 
			   	   	                	var menuObj = records[i];

			   	   	                	var display_name = menuObj.get('display_name');
			   	   	                	var menu_key = menuObj.get('menu_key');
		
			   	   	                	obj2.store.add( //mchnObj
			   	   	                     {
			   	   	                			display_name: display_name,
			   	   	                		     menu_key: menu_key				   	   	                		
			   	   	                	});
			   	   	                     console_log('display_name : ' + display_name 
		 	                    			    + ', menu_key=' + menu_key		     	                				   	   	              
		 	                    			);
		   	   	                	
		   	   	                    }
	     					 }
	   	                	  
	   	                });
 	                  
 	                 }
 	             }
		    }
	);
	
	
	arrMenuSelectToolbar.push(
			{
				id:'object_combo',
				name:'object_combo',
	        	xtype: 'combo',
	        	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	            mode: 'local',
	            editable: false,
	            allowBlank: true,
	            queryMode: 'local',
	            emptyText: getColName('system_code'),
	            displayField:   'display_name',
	            valueField:     'menu_key',
	            store: menuObjectStore,
	            listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{menu_key}">[{menu_key}] {display_name}</div>';
	                	}			                	
	               },
	             triggerAction: 'all',
	             listeners: {
	                 select: function (combo, record) {
	                    	var object_code = combo.getValue();
	                    	   console_log('Selected object_code Value : ' + object_code);
	                    	   store.getProxy().setExtraParam('menuCode',object_code);
	                    	   store.load(function() {});

	                  }
	             }
		     }
	);
	
	arrMenuSelectToolbar.push(
			{
				id:'parentCodeCombo',
				name:'parentCodeCombo',
	        	xtype: 'combo',
	        	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	            mode: 'local',
	            editable: true,
	            allowBlank: true,
	            queryMode: 'remote',
	            emptyText: '전체 모 코드',
	            displayField:   'systemCode',
	            valueField:     'systemCode',
	            store: parentCodeStore,
	            listConfig:{
	                	getInnerTpl: function(){
	                		return '<div>{systemCode}</div>';
	                	}			                	
	               },
	             triggerAction: 'all',
	             listeners: {
	                 select: function (combo, record) {
	                    	var object_code = combo.getValue();
	                    	   console_log('Selected object_code Value : ' + object_code);
	                    	   store.getProxy().setExtraParam('menuCode',object_code);
	                    	   store.load(function() {});
	                  }
	             }
		     }
	);
	

	 //CodeStructure Store 鞝曥潣
	Ext.define('CodeStructure', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	   proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/codeStructure.do?method=read', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/admin/codeStructure.do?method=create', /*create record, update*/
		            update: CONTEXT_PATH + '/admin/codeStructure.do?method=create',
		            destroy: CONTEXT_PATH + '/admin/codeStructure.do?method=destroy' /*delete*/
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
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		
 		
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
//			var dataIndex = columnObj["dataIndex"];
//			
//			switch(dataIndex) {
//			case 'code_name_en':
//			case 'code_name_kr':
//			case 'code_name_zh':
//			case 'code_order':
//			case 'description':
//			case 'role_code':
//			case 'use_yn':
				columnObj["editor"] = {xtype:  'textfield', allowBlank : true}; columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		        	return value;
	        	};
			//}


		});
 		
 		
 		
 		
 		
 		grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        height: getCenterPanelHeight(),
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', copyAction, '-', removeAction,
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
			            items: arrMenuSelectToolbar
			        }
			        
			        ],
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
						//grid info 旒滉赴
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
							copyAction.disable();
			            	removeAction.disable();
			            	editAction.disable();
						}else{
							copyAction.enable();
							removeAction.enable();
			            	editAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
		            		copyAction.disable();
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		copyAction.disable();
		            		removeAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });

		    grid.on('edit', function(editor, e) {     
				  // commit the changes right after editing finished
			    	
		          var rec = e.record;
		          //console_logs('rec', rec);
		          
		          
		          var parent_system_code = rec.get('parent_system_code'); // "AAP1_CLD"
		          var system_code = rec.get('system_code'); // "unique_id"
		          var code_name_en = rec.get('code_name_en'); // "UID"
		          var code_name_kr = rec.get('code_name_kr'); // "UID"
		          var code_name_zh = rec.get('code_name_zh'); // "ID号"
		          var code_order = rec.get('code_order'); // "10"
		          //var delete_flag = rec.get('delete_flag'); // ""
		          var description = rec.get('description'); // "width : 81, sortable : true"
		          var id = rec.get('id'); // "unique_id"
		          var parent_system_code = rec.get('parent_system_code'); // "AAP1_CLD"
		          var role_code = rec.get('role_code'); // "string"
		          var system_code = rec.get('system_code'); // "unique_id"
		          var unique_id = rec.get('unique_id'); // "1000062030"
		          var use_yn = rec.get('use_yn'); // "N"
		        
		      	Ext.Ajax.request({
					url: CONTEXT_PATH + '/admin/codeStructure.do?method=update',
					params:{
						parent_system_code : parent_system_code,
						system_code : system_code,
						code_name_en	:	code_name_en	,
						code_name_kr	:	code_name_kr	,
						code_name_zh	:	code_name_zh	,
						code_order	:	code_order	,
						description	:	description	,
						parent_system_code	:	parent_system_code	,
						role_code	:	role_code	,
						system_code	:	system_code	,
						unique_id	:	unique_id	,
						use_yn	:	use_yn,
						delete_flag : 'N'
					},
					method: 'POST',
					success : function(result, request) {
						
						console_log('modified....');
						
					},
					failure: extjsUtil.failureMessage
				});
//		          rec.save({
//		          		success : function() {
//		          			console_log('modified....');
//		          		}
//		          });
				  rec.commit();
				});
		    
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
     
