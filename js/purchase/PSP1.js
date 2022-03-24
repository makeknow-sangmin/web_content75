/**
 * PSP1 : 공급사현황
 */
//global var.
var grid = null;
var store = null;

function func_replaceall(val,sorc1,sorc2){
	while (1)
	{
	if(val.indexOf(sorc1) != -1)
	val = val.replace(sorc1,sorc2);
	else
	break;
	}
	return val;
	}

function RandomString(in_size) {
	var req_size = 0;
	if( in_size > 8)
	{
		req_size=8;
	}
	else
		req_size = in_size;
		
	var rand_no = Math.round(Math.random()*100000000*16);
	var unique = rand_no.toString(16);

	var my_str = unique.substring(0, req_size).toUpperCase();
	for(i=0; my_str.length < req_size; i++)
		my_str = "0" + my_str;
		
    return my_str;
}	

//Define Remove Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: CMD_ADD,
    handler: function(widget, event) {    	

    	var supplier_code = RandomString(6);

    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 100
            },
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
			items: [
			        {
						fieldLabel: getColName('supplier_code'),
						name: 'supplier_code',
						value : supplier_code,
						 allowBlank: false,
						anchor: '-5'  // anchor width by percentage
			            },
                    {	
                    	  xtype: 'radiogroup',
                    	  fieldLabel: getColName('supplier_type'),
                          // Arrange radio buttons into two columns, distributed vertically
                          columns: 4,
                          vertical: true,
                          items: [
                              { boxLabel: panelPSP1002, name: 'supplier_type', inputValue: 'O' },
                              { boxLabel: panelPSP1003, name: 'supplier_type', inputValue: 'M' },
                              { boxLabel: panelPSP1004, name: 'supplier_type', inputValue: 'S' },
                              { boxLabel: panelPSP1005, name: 'supplier_type', inputValue: 'A' },
                              { boxLabel: panelPSP1006, name: 'supplier_type', inputValue: 'C' },
                              { boxLabel: panelPSP1007, name: 'supplier_type', inputValue: 'I' }
                        ]	
                    },{
                    	fieldLabel:getColName('business_registration_no'),
                        	name : 'business_registration_no',
                            id : 'business_registration_no',
                            allowBlank: false,
                            anchor: '-5'  // anchor width by percentage
		                    	
		  	        },{
			    	fieldLabel: getColName('supplier_name'),
			    	name: 'supplier_name',
			    	allowBlank: false,
			    	anchor: '-5'  // anchor width by percentage
		            },{
			    	fieldLabel: getColName('president_name'),
			    	name: 'president_name',
			    	anchor: '-5'  // anchor width by percentage
                    },{
    			    	fieldLabel: getColName('corporation_no'),
    			    	name: 'corporation_no',
    			    	//allowBlank: false,
    			    	anchor: '-5'  // anchor width by percentage
                    },{
				    fieldLabel: getColName('establishment_date'),
				    name: 'establishment_date',
                    format: 'Y-m-d',
			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			    	value : new Date(),
                    //allowBlank: false,
                    xtype: 'datefield',
				    anchor: '-5'  // anchor width by percentage
		            },{
				    fieldLabel: getColName('address_1'),
				    name: 'address_1',
				    anchor: '-5'  // anchor width by percentage
		            },{
				    fieldLabel: getColName('business_condition'),
				    name: 'business_condition',
				    anchor: '-5'  // anchor width by percentage
		            },{
				    fieldLabel: getColName('business_category'),
				    name: 'business_category',
				    anchor: '-5'  // anchor width by percentage
		            },{
					    fieldLabel: getColName('company_info'),
					    xtype     : 'textarea',
					    name: 'company_info',
					    anchor: '-5'  // anchor width by percentage
		            },{
				    fieldLabel: getColName('sourcing_comment'),
				    xtype     : 'textarea',
				    name: 'sourcing_comment',
				    anchor: '-5'  // anchor width by percentage
			},{				
			    fieldLabel: getColName('sales_person1_name'),
			    name: 'sales_person1_name',
			    allowBlank: false,
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('sales_person1_email_address'),
			    vtype : 'email',
			     maxLength : 50,
			     allowBlank: false,
			     enforceMaxLength: true, // 입력란 길이 제한
			     readOnly : false,
			     regex:  /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
			     regexText: 'Check email format.',//'이메일주소는 이메일 형식으로만 입력이 가능합니다. ex) test@test.com',
			        validator: function(v) {
			             return /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/.test(v)?true:"NOTICE";
			        },
			    name: 'sales_person1_email_address',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('sales_person1_telephone_no'),
			    name: 'sales_person1_telephone_no',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('sales_person1_fax_no'),
			    name: 'sales_person1_fax_no',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('sales_person1_mobilephone_no'),
			    name: 'sales_person1_mobilephone_no',
			    anchor: '-5'  // anchor width by percentage
			}
		    ]
        }); //endof form

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 780,
            height: 670,
	        autoScroll : true,
            minWidth: 780,
	        minHeight: 670,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                	var title = func_replaceall(val["supplier_name"], " ","");
                	if(title == ""){
                		Ext.MessageBox.alert(error_msg_prompt, psp1_valid_msg);
                	}else{
///********************파일첨부시 추가(Only for FileAttachment)**************
                   	var supplier = Ext.ModelManager.create(val, 'Supplier');
                   	var email = val["sales_person1_email_address"]; //supplier.getSales_person1_email_address();
                   	
                   	console_log(supplier);
                   	//중복된 이메일이지 체크
        			Ext.Ajax.request({
        				url: CONTEXT_PATH +'/userMgmt/user.do?method=checkUserByEmail',	
        				params:{
        					email: email
        				},
        				
        				success : function(result, request) {
        					var resultText = result.responseText;
        					console_log('result:' + resultText);
        	
        					if(resultText=="false") {
        						alert(psp1_registered_msg);
        						return;
        					} else {
        	            		//저장 수정
        	                   	supplier.save({
        	                		success : function() {
        	                           	if(win) 
        	                           	{
        	                           		win.close();
        	                           		store.load(function() {
        	                           		});
        	                           		
        	                           	} 
        	
        	                		},
	        	                   	failure : function(){
	        	                    		Ext.MessageBox.alert(error_msg_prompt, psp1_incorrect_msg);
	        	                   	}
        	                	 });//enofsave
        	                   	
        	                	if(win) {
        	                   		win.close();
        	                   	} 
        	                   	
        					}

        					
        				},
        				failure: extjsUtil.failureMessage
        			});
                   	
                   	
                	}//endof else
                	
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();
            		}
            	}
            }]
        });
        win.show();
     }
});

function createViewForm(supplier, uploadPanel) {
	
	var lineGap = 30;
	var unique_id = supplier.get('unique_id');
 	var supplier_code = supplier.get('supplier_code');
	var business_registration_no = supplier.get('business_registration_no');
	var supplier_name = supplier.get('supplier_name' );
	var president_name = supplier.get('president_name' );
	var corporation_no = supplier.get('corporation_no' );
	var establishment_date = supplier.get('establishment_date' );
	var address_1 = supplier.get('address_1' );
	var business_condition = supplier.get('business_condition' );
	var business_category = supplier.get('business_category' );
	var company_info = supplier.get('company_info' );
	var sourcing_comment = supplier.get('sourcing_comment' );
	var telephone_no = supplier.get('telephone_no' );
	var fax_no = supplier.get('fax_no' );
	var email_address = supplier.get('email_address' );
	var sales_person1_name = supplier.get('sales_person1_name' );
	var sales_person1_email_address = supplier.get('sales_person1_email_address' );
	var sales_person1_telephone_no = supplier.get('sales_person1_telephone_no' );
	var sales_person1_fax_no = supplier.get('sales_person1_fax_no' );
	var sales_person1_mobilephone_no = supplier.get('sales_person1_mobilephone_no' );
	 function date(date){
		 return date.substring(0,10);
	 }
	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
		xtype: 'form',
        frame: false ,
        bodyPadding: '3 3 0',
        width: 680,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
		items: [{
			   	xtype: 'fieldset',
	            title: panelPSP1001,//회사정보
	            defaultType: 'displayfield',
	            collapsible: true,
	            defaults: {
	                labelWidth: 89,
	                anchor: '100%',
	                labelAlign: 'right',
	                layout: {
	                    type: 'hbox',
	                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                }
	            },
	            items: [{
					fieldLabel: getColName('supplier_code'),
					x: 5,
					y: 0 + 1*lineGap,
					name: 'supplier_code',
					value : supplier_code,
                  	readOnly : true,
					anchor: '-5'  // anchor width by percentage
		            },{		            	
	                fieldLabel:getColName('business_registration_no'),
					x: 5,
					y: 0 + 2*lineGap,
                   	name : 'business_registration_no',
                   	value : business_registration_no,
                   	readOnly : true,
       				anchor: '-5'  // anchor width by percentage
		            },{
		            fieldLabel: getColName('supplier_name'),
		            x: 5,
		            y: 0 + 3*lineGap,
		            name: 'supplier_name',
		            value : supplier_name, 
		            readOnly : true,
		            anchor: '-5'  // anchor width by percentage
		            },{
		           	fieldLabel: getColName('president_name'),		           	
		           	x: 5,
		           	y: 0 + 4*lineGap,
		           	name: 'president_name',
		           	value: president_name,
		           	anchor: '-5'  // anchor width by percentage
		            },{
		                fieldLabel:getColName('corporation_no'),
						x: 5,
						y: 0 + 5*lineGap,
	                   	name : 'corporation_no',
	                   	value : corporation_no,
	                   	readOnly : true,
	       				anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('establishment_date'),
			    x: 5,
			    y: 0 + 6*lineGap,
			    name: 'establishment_date',
                format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
             	value: date(establishment_date),
			    anchor: '-5'  // anchor width by percentage		    	
	            },{
			    fieldLabel: getColName('address_1'),
			    value: address_1,
			    x: 5,
			    y: 0 + 9*lineGap,
			    name: 'address_1',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('business_condition'),
			    value: business_condition,
			    x: 5,
			    y: 0 + 9*lineGap,
			    name: 'business_condition',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('business_category'),
			    value: business_category,
			    x: 5,
			    y: 0 + 9*lineGap,
			    name: 'business_category',
			    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('company_info'),
				    value: company_info,
	                fieldStyle: 'height:120; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
	                height: 100,
				    x: 5,
				    y: 0 + 9*lineGap,
				    anchor: '100%'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('sourcing_comment'),
			    value: sourcing_comment,
                fieldStyle: 'height:120; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                height: 100,
			    x: 5,
			    y: 0 + 9*lineGap,
			    anchor: '100%' // anchor width by percentage
	            },{
				    fieldLabel: getColName('telephone_no'),
				    value: telephone_no,
				    x: 5,
				    y: 0 + 9*lineGap,
				    name: 'telephone_no',
				    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('fax_no'),
				    value: fax_no,
				    x: 5,
				    y: 0 + 9*lineGap,
				    name: 'fax_no',
				    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('email_address'),
				    value: email_address,
				    x: 5,
				    y: 0 + 9*lineGap,
				    name: 'email_address',
				    anchor: '-5'  // anchor width by percentage
	            }]
		},{
			xtype:'fieldset',
            title:panelPSP1009,// '영업사원 정보',
            collapsible: true,
            height: 170,
            defaultType: 'displayfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{				
		    fieldLabel: getColName('sales_person1_name'),
		    value: sales_person1_name,
		    x: 5,
		    y: 0 + 9*lineGap,
		    name: 'sales_person1_name',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_email_address'),
		    value: sales_person1_email_address,
		    x: 5,
		    y: 0 + 9*lineGap,
		    name: 'sales_person1_email_address',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_telephone_no'),
		    value: sales_person1_telephone_no,
		    x: 5,
		    y: 0 + 9*lineGap,
		    name: 'sales_person1_telephone_no',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_fax_no'),
		    value: sales_person1_fax_no,
		    x: 5,
		    y: 0 + 9*lineGap,
		    name: 'sales_person1_fax_no',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_mobilephone_no'),
		    value: sales_person1_mobilephone_no,
		    x: 5,
		    y: 0 + 9*lineGap,
		    name: 'sales_person1_mobilephone_no',
		    anchor: '-5'  // anchor width by percentage
            }]
		}
		    ]
    }); //endof form
	
	return form;
}

function createEditForm(supplier) {
	
	var lineGap = 30;
	var unique_id = supplier.get('unique_id');
 	var supplier_code = supplier.get('supplier_code');
	var business_registration_no = supplier.get('business_registration_no');
	var supplier_name = supplier.get('supplier_name' );
	var president_name = supplier.get('president_name' );
	var corporation_no = supplier.get('corporation_no' );
	var establishment_date = supplier.get('establishment_date' );
	var address_1 = supplier.get('address_1' );
	var business_condition = supplier.get('business_condition' );
	var business_category = supplier.get('business_category' );
	var company_info = supplier.get('company_info' );
	var sourcing_comment = supplier.get('sourcing_comment' );
	var telephone_no = supplier.get('telephone_no' );
	var fax_no = supplier.get('fax_no' );
	var email_address = supplier.get('email_address' );
	
	var sales_person1_name = supplier.get('sales_person1_name' );
	var sales_person1_email_address = supplier.get('sales_person1_email_address' );
	var sales_person1_telephone_no = supplier.get('sales_person1_telephone_no' );
	var sales_person1_fax_no = supplier.get('sales_person1_fax_no' );
	var sales_person1_mobilephone_no = supplier.get('sales_person1_mobilephone_no' );
	 function date(date){
		 return date.substring(0,10);
	 }
	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
		xtype: 'form',
        frame: false ,
        bodyPadding: '5 5 5 5',
        width: 700,
        height: 700,
        autoScroll : true,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
		items: [
                new Ext.form.Hidden({
                	value: unique_id,
     		       name: 'unique_id'
     		    }),
     		   new Ext.form.Hidden({
               	value: supplier_code,
    		       name: 'supplier_code'
    		    }),{
			   	xtype: 'fieldset',
	            title: panelPSP1001,//'회사정보',
	            defaultType: 'textfield',
	            defaults: {
	                labelWidth: 120,
	                anchor: '100%',
	                labelAlign: 'right',
	                layout: {
	                    type: 'hbox',
	                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                }
	            },
	            items: [{		            	
	                fieldLabel:getColName('business_registration_no'),
					x: 5,
					y: 0 + 2*lineGap,
                   	name : 'business_registration_no',
                   	value : business_registration_no,
                   	readOnly : false,
       				anchor: '-5'  // anchor width by percentage
		            },{
		            fieldLabel: getColName('supplier_name'),
		            x: 5,
		            y: 0 + 3*lineGap,
		            name: 'supplier_name',
		            value : supplier_name, 
		            readOnly : false,
		            anchor: '-5'  // anchor width by percentage
		            },{
		           	fieldLabel: getColName('president_name'),		           	
		           	x: 5,
		           	y: 0 + 4*lineGap,
		           	name: 'president_name',
		           	value: president_name,
		           	anchor: '-5'  // anchor width by percentage
		            },{
		                fieldLabel:getColName('corporation_no'),
						x: 5,
						y: 0 + 5*lineGap,
	                   	name : 'corporation_no',
	                   	value : corporation_no,
	                   	readOnly : false,
	       				anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('establishment_date'),
			    x: 5,
			    y: 0 + 6*lineGap,
			    name: 'establishment_date',
                format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
             	value: date(establishment_date),
		    	readOnly : false,
                xtype: 'datefield',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('address_1'),
			    value: address_1,
			    readOnly : false,
			    x: 5,
			    y: 0 + 9*lineGap,
			    name: 'address_1',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('business_condition'),
			    value: business_condition,
			    x: 5,
			    y: 0 + 9*lineGap,
			    readOnly : false,
			    name: 'business_condition',
			    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('business_category'),
			    value: business_category,
			    x: 5,
			    y: 0 + 9*lineGap,
			    readOnly : false,
			    name: 'business_category',
			    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('company_info'),
				    value: company_info,
				    xtype     : 'textarea',
				    rows: 1,
				    x: 5,
				    readOnly : false,
				    y: 0 + 9*lineGap,
				    name: 'company_info',
				    anchor: '-5'  // anchor width by percentage
	            },{
			    fieldLabel: getColName('sourcing_comment'),
			    value: sourcing_comment,
			    xtype     : 'textarea',
			    readOnly : false,
			    rows: 1,
			    x: 5,
			    y: 0 + 9*lineGap,
			    name: 'sourcing_comment',
			    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('telephone_no'),
				    value: telephone_no,
				    x: 5,
				    y: 0 + 9*lineGap,
				    readOnly : false,
				    name: 'telephone_no',
				    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('fax_no'),
				    value: fax_no,
				    x: 5,
				    y: 0 + 9*lineGap,
				    readOnly : false,
				    name: 'fax_no',
				    anchor: '-5'  // anchor width by percentage
	            },{
				    fieldLabel: getColName('email_address'),
				    value: email_address,
				    x: 5,
				    y: 0 + 9*lineGap,
				    readOnly : false,
				    name: 'email_address',
				    vtype : 'email',
				     maxLength : 50,
				     enforceMaxLength: true, // 입력란 길이 제한
				     readOnly : false,
//				     regex:  /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
//				     regexText: 'Check email format.',//'이메일주소는 이메일 형식으로만 입력이 가능합니다. ex) test@test.com',
//				        validator: function(v) {
//				             return /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/.test(v)?true:"NOTICE";
//				        },
				    anchor: '-5'  // anchor width by percentage
	            }]
		},{
			xtype:'fieldset',
            title: panelPSP1009,//'영업사원 정보',
            collapsible: false,
            height: 170,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                labelWidth: 120,
                anchor: '100%',
                labelAlign: 'right',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items :[{				
		    fieldLabel: getColName('sales_person1_name'),
		    value: sales_person1_name,
		    x: 5,
		    y: 0 + 9*lineGap,
		    readOnly : false,
		    name: 'sales_person1_name',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_email_address'),
		    value: sales_person1_email_address,
		    x: 5,
		    y: 0 + 9*lineGap,
		    readOnly : false,
		    name: 'sales_person1_email_address',
		    vtype : 'email',
		     maxLength : 50,
		     enforceMaxLength: true, // 입력란 길이 제한
		     readOnly : false,
		     regex:  /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
		     regexText: 'Check email format.',//'이메일주소는 이메일 형식으로만 입력이 가능합니다. ex) test@test.com',
		        validator: function(v) {
		             return /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/.test(v)?true:"NOTICE";
		        },
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_telephone_no'),
		    value: sales_person1_telephone_no,
		    x: 5,
		    y: 0 + 9*lineGap,
		    readOnly : false,
		    name: 'sales_person1_telephone_no',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_fax_no'),
		    value: sales_person1_fax_no,
		    x: 5,
		    y: 0 + 9*lineGap,
		    readOnly : false,
		    name: 'sales_person1_fax_no',
		    anchor: '-5'  // anchor width by percentage
            },{
		    fieldLabel: getColName('sales_person1_mobilephone_no'),
		    value: sales_person1_mobilephone_no,
		    x: 5,
		    y: 0 + 9*lineGap,
		    readOnly : false,
		    name: 'sales_person1_mobilephone_no',
		    anchor: '-5'  // anchor width by percentage
            }]
		}
        ]
    }); //endof form
	
	return form;
}

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			
			Supplier.load(unique_id ,{
				 success: function(supplier) {
				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            autoScroll : true,
				            items: createViewForm(supplier),
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                       	if(win) 
				                       	{
//				                       		if(uploadPanel!=null) {
//				                       			uploadPanel.destroy();
//				                       		}
				                       		win.close();
				                       	} 
				                  }
				            }]
				        });
						win.show();
				 }//endofsuccess
			 });//emdofload
	
};

var editHandler = function() {
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');

		
		Supplier.load(unique_id ,{
			 success: function(supplier) {
					uploadStore = getUploadStore(unique_id);
					uploadStore.load(function() {
						console_log('uploadStore.load ok');
						console_log(uploadStore);
						uploadStore.each(function(record){
							console_log(record.get('object_name'));
						});

			        var win = Ext.create('ModalWindow', {
			            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
			            width: 700,
			            height: 650,
			            minWidth: 250,
			            minHeight: 180,
			            modal:true,
			            layout: 'absolute',
			            plain:true,
			            items: createEditForm(supplier),
			            buttons: [{
			                text: CMD_OK,
			            	handler: function(){
			                    
			            		var form = Ext.getCmp('formPanel').getForm();
			                                    	
			                    if(form.isValid())
			                    {
			                	var val = form.getValues(false);
			                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
			                	var supplier = Ext.ModelManager.create(val, 'Supplier');
			            		//저장 수정
			                   	supplier.save({
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
			            		if(win) {
			            			win.close();} }

			            }]
			        });
					win.show();
				});
			 }//endofsuccess
		 });//emdofload
	
};

function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var records = getMyRecordFromSel(selections);
        	for(var i=0; i< records.length; i++) {
        		var rec = records[i];
        		var unique_id = rec.get('unique_id');
	           	 var supplier = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Supplier');
        		
	           	supplier.destroy( {
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

//Define Delete Action
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
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, editAction, removeAction  ]
});

Ext.onReady(function() {  
	var searchField = [];
	
	searchField.push('unique_id');
	searchField.push('supplier_code');
	searchField.push('supplier_name');
	searchField.push('corporation_no1');
	searchField.push('president_name');
	searchField.push('business_condition');
	searchField.push('business_category');
	
	
	makeSrchToolbar(searchField);
	
	Ext.define('Supplier', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/supplier.do?method=read',
		            create: CONTEXT_PATH + '/purchase/supplier.do?method=create',
		            update: CONTEXT_PATH + '/purchase/supplier.do?method=create',
		            destroy: CONTEXT_PATH + '/purchase/supplier.do?method=destroy'
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
				model: 'Supplier',
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
					        selModel: selModel,
					        height: getCenterPanelHeight(), 
					        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll : true,
					        autoHeight: true,
					        bbar: getPageToolbar(store),
					        
					        dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '-',  addAction, '-', editAction,  '-', removeAction
					                    , '->'
			      				        ,
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
					            items: /*(G)*/vSRCH_TOOLBAR/*vSRCH_TOOLBAR*/
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
					
//				    grid.getSelectionModel().on({
//				        selectionchange: function(sm, selections) {
//				        	
//				        	console_log(selections.length);
//				        	if (selections.length) {
//								collapseProperty();//uncheck no displayProperty
//				        		////grid info 켜기
//				        		displayProperty(selections[0]);
//				        	}
//				        	detailAction.enable();
//				        	var records = getMyRecordFromSel(selections);
//				        	console_log(records.length);
//				        	
//							if(fPERM_DISABLING()==true) {//수정권한이 없으면.			            		
//								removeAction.disable();
//				            	editAction.disable();
//							} else if(records.length>0) {			            		
//								removeAction.enable();
//				            	editAction.enable();
//							}else {
//			            		removeAction.disable();
//				            	editAction.disable();
//			            	}
//				        }
//				    });
				    
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
				            } else {
				            	collapseProperty();
				            	removeAction.disable();
				            	editAction.disable();
				            	

				            }
				        }
				    });

				    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
				        Ext.create('Ext.tip.ToolTip', config);
				    });
				    cenerFinishCallback();
			}); //store load
});//OnReady

     
