Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

searchField = 
	[
	'unique_id',
	'wa_code',
	'wa_name',
	'wa_name_en'
	];


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
        			var unique_id = rec.get('unique_id');

        			ComBst.load(unique_id ,{
        				 success: function(comBst) {
        					 	var unique_id = comBst.get('unique_id');
        						var wa_code = unique_id;
        						var wa_name = comBst.get('wa_name');
        						var wa_name_en = comBst.get('wa_name_en');
        						var address_1 = comBst.get('address_1');
        						var company_code = comBst.get('company_code');
        						var company_name = comBst.get('company_name');
        						var biz_no = comBst.get('biz_no');
        						var president_name = comBst.get('president_name');
        						var biz_condition = comBst.get('biz_condition');
        						var biz_category = comBst.get('biz_category');
        						var company_info = comBst.get('company_info');
        						var comment_etc = comBst.get('comment_etc');
        						var sales_name1 = comBst.get('sales_name1');
        						var sales_email1 = comBst.get('sales_email1');
        						var sales_tel1 = comBst.get('sales_tel1');
        						var sales_fax1 = comBst.get('sales_fax1');
        						var sales_hp1 = comBst.get('sales_hp1');
        				        
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
        				            items: [
        						{
        							xtype:'fieldset',
        				            defaultType: 'displayfield',
        				            layout: 'anchor',
        				            border:false,
        				            defaults: {
        				                anchor: '100%'
        				            },
        				            items :[{
        				                xtype: 'container',
        				                layout:'hbox',
        			         	items: [{
        			         		xtype: 'container',
        			                 flex: 1,
        			                 border:false,
        			                 layout: 'anchor',
        			                 defaultType: 'displayfield',
        			                 defaults: { labelWidth: 100, labelAlign: 'right',  anchor:'95%'  },
        			                 items: //inputItem1
        			                 	[	            			
        			                    {
        			                fieldLabel: getColName('wa_code'),
        			                value:wa_code,
        			                name: 'wa_code',
        			                id: 'wa_code'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('wa_name'),
        			                value:wa_name,
        			                name: 'wa_name'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('wa_name_en'),
        			                value:wa_name_en,
        			                name: 'wa_name_en'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('address_1'),
        			                value:address_1,
        			                name: 'address_1'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('company_code'),//법인등록번호
        			                value:company_code,
        			                name: 'company_code'
//        			                ,anchor: '-5'
        			            },{
        			                fieldLabel: getColName('biz_no'),//사업자등록번호
        			                value:biz_no,
        			                name: 'biz_no'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('president_name'),//대표자명
        			                value:president_name,
        			                name: 'president_name'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            }
        			            ,{
        			                fieldLabel: getColName('biz_condition'),//업태
        			                value:biz_condition,
        			                name: 'biz_condition'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('biz_category'),//종목
        			                value:biz_category,
        			                name: 'biz_category'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('company_info'),//주요판매제품
        			                value:company_info,
        			                name: 'company_info'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            },{
        			                fieldLabel: getColName('comment_etc'),//비고
        			                value:comment_etc,
        			                name: 'comment_etc'
//        			                ,anchor: '-5'  // anchor width by percentage
        			            }]
        			         	},{ //두번째 컬럼
        			     		xtype: 'container',
        			             flex: 1,
        			             layout: 'anchor',
        			             defaultType: 'displayfield',
        			             defaults: { labelWidth: 100, labelAlign: 'right', anchor:'95%'  },  
        			     		items://inputItem2
        			     			[{
        			                    fieldLabel: getColName('sales_name1'),//담당자이름
        			                    value:sales_name1,
        			                    name: 'sales_name1',
        			                    anchor: '-5'  // anchor width by percentage
        			                },{
        			                    fieldLabel: getColName('sales_email1'),//담당자이메일
        			                    value:sales_email1,
        			                    name: 'sales_email1',
        			                    anchor: '-5'  // anchor width by percentage
        			                },{
        			                    fieldLabel: getColName('sales_tel1'),//담당자전화번호
        			                    value:sales_tel1,
        			                    name: 'sales_tel1',
        			                    anchor: '-5'  // anchor width by percentage
        			                },{
        			                    fieldLabel: getColName('sales_fax1'),//담당자팩스번호
        			                    value:sales_fax1,
        			                    name: 'sales_fax1',
        			                    anchor: '-5'  // anchor width by percentage
        			                },{
        			                    fieldLabel: getColName('sales_hp1'),//담당자핸드폰번호
        			                    value:sales_hp1,
        			                    name: 'sales_hp1',
        			                    anchor: '-5'  // anchor width by percentage
        			                }
        								       
        						
        					                ]   
        			         		}] 
        			         	}]
        				        }]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 700,
        				            height: 350,
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
                			var mylang = vLANG;
                			ComBst.load(unique_id ,{
                				 success: function(comBst) {
                					 var unique_id = comBst.get('unique_id');
             						var wa_code = comBst.get('wa_code');
             						var wa_name = comBst.get('wa_name');
             						var wa_name_en = comBst.get('wa_name_en');
             						var address_1 = comBst.get('address_1');
             						var company_code = comBst.get('company_code');
             						var company_name = comBst.get('company_name');
             						var biz_no = comBst.get('biz_no');
             						var president_name = comBst.get('president_name');
             						var biz_condition = comBst.get('biz_condition');
             						var biz_category = comBst.get('biz_category');
             						var company_info = comBst.get('company_info');
             						var comment_etc = comBst.get('comment_etc');
             						var sales_name1 = comBst.get('sales_name1');
             						var sales_email1 = comBst.get('sales_email1');
             						var sales_tel1 = comBst.get('sales_tel1');
             						var sales_fax1 = comBst.get('sales_fax1');
             						var sales_hp1 = comBst.get('sales_hp1');
                				        
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
                				            items: [/*1*/ new Ext.form.Hidden({
                				            	id: 'mylang',
                				            	name: 'mylang',
                				            	value: mylang
                					        }),
                						{
                							xtype:'fieldset',
                				            defaultType: 'textfield',
                				            layout: 'anchor',
                				            border:false,
                				            defaults: {
                				                anchor: '100%'
                				            },
                				            items :[{
                				                xtype: 'container',
                				                layout:'hbox',
                			         	items: [{
                			         		xtype: 'container',
                			                 flex: 1,
                			                 border:false,
                			                 layout: 'anchor',
                			                 defaultType: 'textfield',
                			                 defaults: { labelWidth: 100, labelAlign: 'right',  anchor:'95%'  },
                			                 items: //inputItem1
                			                 	[	            			
                			                    {
    											    fieldLabel: getColName('unique_id'),
    											    value: unique_id,
    											    name: 'unique_id',
    								                readOnly: true,
    								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;'
    								    			// anchor: '-5'  // anchor width by percentage
    											},{
                			                fieldLabel: getColName('wa_name'),
                			                value:wa_name,
                			                name: 'wa_name'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('wa_name_en'),
                			                value:wa_name_en,
                			                name: 'wa_name_en'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('address_1'),
                			                value:address_1,
                			                name: 'address_1'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('company_code'),//법인등록번호
                			                value:company_code,
                			                name: 'company_code'
//                			                anchor: '-5'
                			            },{
                			                fieldLabel: getColName('biz_no'),//사업자등록번호
                			                value:biz_no,
                			                name: 'biz_no'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('president_name'),//대표자명
                			                value:president_name,
                			                name: 'president_name'
//                			                anchor: '-5'  // anchor width by percentage
                			            }
                			            ,{
                			                fieldLabel: getColName('biz_condition'),//업태
                			                value:biz_condition,
                			                name: 'biz_condition'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('biz_category'),//종목
                			                value:biz_category,
                			                name: 'biz_category'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('company_info'),//주요판매제품
                			                value:company_info,
                			                name: 'company_info'
//                			                anchor: '-5'  // anchor width by percentage
                			            },{
                			                fieldLabel: getColName('comment_etc'),//비고
                			                value:comment_etc,
                			                name: 'comment_etc'
//                			                anchor: '-5'  // anchor width by percentage
                			            }]
                			         	},{ //두번째 컬럼
                			     		xtype: 'container',
                			             flex: 1,
                			             layout: 'anchor',
                			             defaultType: 'textfield',
                			             defaults: { labelWidth: 100, labelAlign: 'right', anchor:'95%'  },  
                			     		items://inputItem2
                			     			[{
                			                    fieldLabel: getColName('sales_name1'),//담당자이름
                			                    value:sales_name1,
                			                    name: 'sales_name1'
//                			                    anchor: '-5'  // anchor width by percentage
                			                },{
                			                    fieldLabel: getColName('sales_email1'),//담당자이메일
                			                    value:sales_email1,
                			                    name: 'sales_email1'
//                			                    anchor: '-5'  // anchor width by percentage
                			                },{
                			                    fieldLabel: getColName('sales_tel1'),//담당자전화번호
                			                    value:sales_tel1,
                			                    name: 'sales_tel1'
//                			                    anchor: '-5'  // anchor width by percentage
                			                },{
                			                    fieldLabel: getColName('sales_fax1'),//담당자팩스번호
                			                    value:sales_fax1,
                			                    name: 'sales_fax1'
//                			                    anchor: '-5'  // anchor width by percentage
                			                },{
                			                    fieldLabel: getColName('sales_hp1'),//담당자핸드폰번호
                			                    value:sales_hp1,
                			                    name: 'sales_hp1'
//                			                    anchor: '-5'  // anchor width by percentage
                			                }
                								       
                						
                					                ]   
                			         		}] 
                			         	}]
                				        }]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
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
	                				                	var comBst = Ext.ModelManager.create(val, 'ComBst');
	                				                	
	                				            		//저장 수정
	                				                	comBst.save({
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
Ext.define('ComBst.writer.SinglePost', {
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
	           	 var comBst = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'ComBst');
        		
	           	comBst.destroy( {
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
            //animateTarget: 'mb4',
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
    	var mylang = vLANG;
    	console_log('mylang'+mylang);
//		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            defaultType: 'textfield',
            border: false,
            bodyPadding: '3 3 0',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [/*1*/ 
                 new Ext.form.Hidden({
	            	id: 'mylang',
	            	name: 'mylang',
	            	value: mylang
		        }),
			{
				xtype:'fieldset',
	            defaultType: 'textfield',
	            layout: 'anchor',
	            border:false,
	            defaults: {
	                anchor: '100%'
	            },
	            items :[{
	                xtype: 'container',
	                layout:'hbox',
         	items: [{
         		xtype: 'container',
                 flex: 1,
                 border:false,
                 layout: 'anchor',
                 defaultType: 'textfield',
                 defaults: { labelWidth: 100, labelAlign: 'right',  anchor:'95%'  },
                 items: //inputItem1
                 	[	            			
                    {
                fieldLabel: getColName('wa_name'),
              
                name: 'wa_name'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('wa_name_en'),
               
                name: 'wa_name_en'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('address_1'),
             
                name: 'address_1'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('company_code'),//법인등록번호
            
                name: 'company_code'
//                anchor: '-5'
            },{
                fieldLabel: getColName('biz_no'),//사업자등록번호
                
                name: 'biz_no'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('president_name'),//대표자명
              
                name: 'president_name'
//                anchor: '-5'  // anchor width by percentage
            }
            ,{
                fieldLabel: getColName('biz_condition'),//업태
             
                name: 'biz_condition'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('biz_category'),//종목
              
                name: 'biz_category'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('company_info'),//주요판매제품
               
                name: 'company_info'
//                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('comment_etc'),//비고
               
                name: 'comment_etc'
//                anchor: '-5'  // anchor width by percentage
            }]
         	},{ //두번째 컬럼
     		xtype: 'container',
             flex: 1,
             layout: 'anchor',
             defaultType: 'textfield',
             defaults: { labelWidth: 100, labelAlign: 'right', anchor:'95%'  },  
     		items://inputItem2
     			[{
                    fieldLabel: getColName('sales_name1'),//담당자이름
                    
                    name: 'sales_name1',
                    anchor: '-5'  // anchor width by percentage
                },{
                    fieldLabel: getColName('sales_email1'),//담당자이메일
                 
                    name: 'sales_email1',
                    anchor: '-5'  // anchor width by percentage
                },{
                    fieldLabel: getColName('sales_tel1'),//담당자전화번호
                    
                    name: 'sales_tel1',
                    anchor: '-5'  // anchor width by percentage
                },{
                    fieldLabel: getColName('sales_fax1'),//담당자팩스번호
                   
                    name: 'sales_fax1',
                    anchor: '-5'  // anchor width by percentage
                },{
                    fieldLabel: getColName('sales_hp1'),//담당자핸드폰번호
                 
                    name: 'sales_hp1',
                    anchor: '-5'  // anchor width by percentage
                }
					       
			
		                ]   
         		}] 
         	}]
	        }]		
//            	 [/*1*/ new Ext.form.Hidden({
//	            	id: 'mylang',
//	            	name: 'mylang',
//	            	value: mylang
//		        }),
//            {
//                fieldLabel: getColName('wa_code'),
//                x: 5,
//                y: 0 + 1*lineGap,
//                name: 'wa_code',
//                id: 'wa_code',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('wa_name'),
//                x: 5,
//                y: 0 + 2*lineGap,
//                name: 'wa_name',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('wa_name_en'),
//                x: 5,
//                y: 0 + 3*lineGap,
//                name: 'wa_name_en',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('address_1'),
//                x: 5,
//                y: 0 + 4*lineGap,
//                name: 'address_1',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('company_code'),//법인등록번호
//                x: 5,
//                y: 0 + 5*lineGap,
//                name: 'company_code',
//                anchor: '-5'
//            },{
//                fieldLabel: getColName('biz_no'),//사업자등록번호
//                x: 5,
//                y: 0 + 6*lineGap,
//                name: 'biz_no',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('president_name'),//대표자명
//                x: 5,
//                y: 0 + 7*lineGap,
//                name: 'president_name',
//                anchor: '-5'  // anchor width by percentage
//            }
//            ,{
//                fieldLabel: getColName('biz_condition'),//업태
//                x: 5,
//                y: 0 + 8*lineGap,
//                name: 'biz_condition',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('biz_category'),//종목
//                x: 5,
//                y: 0 + 9*lineGap,
//                name: 'biz_category',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('company_info'),//주요판매제품
//                x: 5,
//                y: 0 + 10*lineGap,
//                name: 'company_info',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('comment_etc'),//비고
//                x: 5,
//                y: 0 + 11*lineGap,
//                name: 'comment_etc',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('sales_name1'),//담당자이름
//                x: 5,
//                y: 0 + 12*lineGap,
//                name: 'sales_name1',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('sales_email1'),//담당자이메일
//                x: 5,
//                y: 0 + 13*lineGap,
//                name: 'sales_email1',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('sales_tel1'),//담당자전화번호
//                x: 5,
//                y: 0 + 14*lineGap,
//                name: 'sales_tel1',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('sales_fax1'),//담당자팩스번호
//                x: 5,
//                y: 0 + 15*lineGap,
//                name: 'sales_fax1',
//                anchor: '-5'  // anchor width by percentage
//            },{
//                fieldLabel: getColName('sales_hp1'),//담당자핸드폰번호
//                x: 5,
//                y: 0 + 16*lineGap,
//                name: 'sales_hp1',
//                anchor: '-5'  // anchor width by percentage
//            }
//            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 700,
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
                   	 var comBst = Ext.ModelManager.create(val, 'ComBst');
                   	 
                   	 
                   	comBst.save({
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
//                   	 var wa_code = Ext.getCmp('wa_code').getValue();
//                   	console_log('wa_code=' + wa_code);
                   //중복 코드 체크
// 					Ext.Ajax.request({
//    						url: CONTEXT_PATH + '/sales/buyer.do?method=checkCode',				
//         				params:{
//         					wa_code : wa_code
//         				},
//    						
//    						success : function(result, request) {
//    							
//    							var ret = result.responseText;
//    							console_log(ret);
//    							
//    							if(ret == 0 ||  ret  == '0') {
//    								//저장 수정
//    			                   	
//    								
//    							} else {
//    								Ext.MessageBox.alert('Error',scs2_code_error_msg); 
//    							}
//    							console_log('requested ajax...');
//    						},
//    						failure: extjsUtil.failureMessage
//    					});  
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
    items: [ detailAction, editAction, removeAction  ]
});




Ext.onReady(function() {  
	//alert(vLANG);
	
	makeSrchToolbar(searchField);
	 //ComBst Store 정의
	Ext.define('ComBst', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/buyer.do?method=read', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/sales/buyer.do?method=cloudcreate', /*create record, update*/
		            update: CONTEXT_PATH + '/sales/buyer.do?method=update',
		            destroy: CONTEXT_PATH + '/sales/buyer.do?method=destroy' /*delete*/
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
		model: 'ComBst',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
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
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,
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
			            items: /*(G)*/vSRCH_TOOLBAR
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
			        title: getMenuTitle()//,
			    });
			fLAYOUT_CONTENT(grid);
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	editAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
     
