/**
 * AMC4 : 분류체계
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


var CmaterialStore = new Ext.create('Ext.data.Store', {

	fields:[     
	        { name: 'parent_class_code', type: "string"  }
	        ,{ name: 'class_name', type: "string" }
	        ,{ name: 'class_code_full', type: "string"  }  
	        ],	
	        proxy: {
	        	type: 'ajax',
	        	url: CONTEXT_PATH +  '/admin/stdClass.do?method=parentCode',
	        	reader: {
	        		type:'json',
	        		root: 'datas',
	        		totalProperty: 'count',
	        		successProperty: 'success'
	        	},
	        	extraParams : {
	        		level: '',
	        		parent_class_code: ''
	        	}
	        	,autoLoad: true
	        }
});


var levelCodeStore2 = new Ext.create('Ext.data.Store', {
 	fields:[     
  	       { name: 'class_code', type: "string" }
  	      ,{ name: 'class_name', type: "string"  }
  	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/admin/stdClass.do?method=parentCode',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         },
		extraParams : {
			level: '',
			parent_class_code: ''
		}
         ,autoLoad: true
     	}
 });


/*Ext.define('level.Combo', {
	 extend: 'Ext.data.Model',
	 fields: [     
	  	       { name: 'class_code', type: "string" }
	   	      ,{ name: 'class_name', type: "string"  }
	  	  ],
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/admin/stdClass.do?method=parentCode',
	        },
			reader: {
				type: 'json',
				root: 'datas',
				successProperty: 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        }
		}
});

var levelCodeStore = new Ext.data.Store({  
	pageSize: 5,
	model: 'level.Combo',
	sorters: [{
        property: 'class_name',
        direction: 'ASC'
    }]
}); */


//Define Remove Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: CMD_ADD,
    handler: function(widget, event) {    	
		var lineGap = 30;
		var bHeight = 470;
		
    	var uploadPanel = getCommonFilePanel('CREATE', 0, 5, '100%', 140, 50, '');
		
    	var inputItem= [];    	
    	inputItem.push(    	
   	    	 {
   	             y: 0 + 1*lineGap,
   	             name: 'class_code',
   	             anchor: '100%'  // anchor width by percentage
   	         }
       	 );
    	
    	inputItem.push(    	
   	    	 {
   	             y: 0 + 1*lineGap,
   	             name: 'class_name',
   	             anchor: '100%'  // anchor width by percentage
   	         }
       	 );
    	
    	inputItem.push(    	
   	    	 {
   	             y: 0 + 1*lineGap,
   	             name: 'level',
   	             anchor: '100%'  // anchor width by percentage
   	         }
       	 );
    	 	
    	

    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		xtype: 'form',
            frame: false ,
            bodyPadding: '3 3 3 3',
            width: 300,
            height: 300,
	        autoScroll : false,
            autoHeight: true,
            defaultType: 'textfield',
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 80
            },
			items: [{
				 	xtype: 'fieldset',
		            title: '단계선택',//panelSRO1139,
		            collapsible: false,
		            defaults: {
		                labelWidth: 40,
		                anchor: '100%',
		                layout: {
		                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
		                }
		            },
		            items: [{			   
	                    xtype : 'fieldcontainer',
	                    combineErrors: true,
	                    msgTarget: 'side',
	                    items : [{
							fieldLabel: getColName('level'),
							xtype: 'combo',
							name: 'level',
				            value: '1', //대분류 1 중분류 2 소분류 3 세분류 4
			                mode: 'local',
			                editable:false,
				            allowBlank: false,
			                queryMode: 'local',
			                displayField:   'name',
			                valueField:     'value',
			                store: Ext.create('Ext.data.Store', {
			                    fields : ['name', 'value'],
			                    data   : [
			                        {name : '대분류',   value: '1'},
			                        {name : '중분류',   value: '2'},
			                        {name : '소분류',   value: '3'},
			                        {name : '세분류',   value: '4'}
			                    ]
			                }),                
			                triggerAction: 'all',
			                anchor: '100%',
			                listeners: {
			                	select: function (combo, record) {		   	   	                 
			                		alert(this.getValue());
			                		if(this.getValue()==1){
			                			levelCodeStore2.proxy.extraParams.level = this.getValue();
			                			//levelCodeStore2.proxy.extraParams.level = this.getValue();
			                		}else{ 
			                			levelCodeStore2.proxy.extraParams.level = this.getValue();
			                			//levelCodeStore2.proxy.extraParams.level = '2';
			                			//levelCodeStore2.proxy.extraParams.parent_class_code = this.getValue();
				   	
			                			levelCodeStore2.load( function(records) {
			   	   	                	  
						   	   	                var obj2 = Ext.getCmp('parent_class_code'); 
						   	   	              //  var obj3 = Ext.getCmp('pl_no'); 
						   	   	               // var obj4 = Ext.getCmp('item_name'); 
//						   	   	                obj2.reset();
						   	   	                obj2.clearValue();//text필드에 있는 name 삭제
						   	   	                obj2.store.removeAll();//class_code2필드에서 보여지는 값을 삭제					   	   	                
						   	   	                obj3.reset();		   	   	                
						   	   	                obj4.reset();			   	   	                
						   	   	                
						   	   	                for (var i=0; i<records.length; i++){ 
						   	   	                	var classObj = records[i];
						   	   	                	var class_code = classObj.get('class_code_full');
						   	   	                	var class_name = classObj.get('class_name');				   	   	                	
						   	   	                	console_log(class_code + ':' + class_name);			   	   	                	
						   	   	                	//var obj = {};
						   	   	                	//obj['class_name'] = '[' + class_code + ']' + class_name;
						   	   	                	//obj['class_code_full'] = class_code;
						   	   	                	//comboClass2.push(obj);
								   	   	             obj2.store.add({
										   	   	            class_name: '[' + class_code + ']' + class_name
//										   	   	            class_code_full: class_code	
													 });
						   	   	                 }		
				   	   	                  });	
				   	   	                }//end if getvalue    	   	                    	
			                	}//end select
			                }		              //end listener  
                		},{
                			fieldLabel:    getColName('parent_class_code'),
                			id:          'parent_class_code',
                			name:     'parent_class_code',
                			xtype:    'combo',
                			mode: 'local',
                			editable:false,
                			allowBlank: true,
                			displayField:   'class_name' ,
        				    store: levelCodeStore2,
        				    minChars: 2,
                			anchor: '100%',
        				    listConfig:{
        				        loadingText: 'Searching...',
        		                emptyText: 'No matching posts found.',
        		                getInnerTpl: function() {
        		                	return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
        		                }
        				    },
                			listeners: {
                				select: function (combo, record) {		  
                					console_log('Selected Value : ' + combo.getValue());
                					parent_class_code = Ext.getCmp('parent_class_code').getValue();
                				}
                			}
                		
                		}]	                    
		            }]
					},{
					fieldLabel: getColName('class_code'),
					//value: supplier_code,
					id : 'class_code',
					name: 'class_code',
	                x: 15,
	                y: 0 + 2*lineGap,
					anchor: '-5'  // anchor width by percentage
					},{
						fieldLabel: getColName('class_name'),
		                x: 15,
		                y: 0 + 3*lineGap,
						//value: supplier_code,
						id : 'class_name',
						name: 'class_name',
						anchor: '-5'  // anchor width by percentage
				}
		    ]
        }); //endof form

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 320,
            height: bHeight,
	        autoScroll : true,
            minWidth: 250,
	        minHeight: 180,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);

///********************파일첨부시 추가(Only for FileAttachment)**************
                   	var classification = Ext.ModelManager.create(val, 'Classification');
                   

            		//저장 수정
                   	classification.save({
                		success : function() {
                			//console_log('updated');
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {
    		            			if(uploadPanel!=null) {
    		            				uploadPanel.destroy();
    		            			}lfn_gotoHome();
                           		});
                           		
                           	} 

                		},
                   	failure : function(){
                   	//	if(title_count > 33){
                    //		Ext.MessageBox.alert(error_msg_prompt,'input long title.<br> 33 characters or less');
                    //	}else{
                    //		Ext.MessageBox.alert(error_msg_prompt,'Incorrect value specified');
                    //	}
                   	}
                	 });
                	
                   	if(win) 
                   	{
                   		win.close();
            			if(uploadPanel!=null) {
            				uploadPanel.destroy();
            			}
//            			lfn_gotoHome();
                   	} 
                	
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);

            			if(uploadPanel!=null) {
            				uploadPanel.destroy();
            			}
//            			lfn_gotoHome();
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();
            		}

        			if(uploadPanel!=null) {
        				uploadPanel.destroy();
        			}
//        			lfn_gotoHome();

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
//        closable: true,
        frame: false ,
        //closeAction: 'close',
        bodyPadding: '3 3 0',
        width: 680,
        autoScroll : true,
        autoHeight: true,
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
	            title: '회사정보',
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
					//value: supplier_code,
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
            title: '영업사원 정보',
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
			///********************파일첨부시 추가(Only for FileAttachment)**************            
            //, uploadPanel
            ///********************파일첨부시 추가(Only for FileAttachment)**************      
		    ]
    }); //endof form
	
	return form;
}

function createEditForm(supplier, uploadPanel) {
	
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
//        closable: true,
        frame: false ,
        //closeAction: 'close',
        bodyPadding: '3 3 0',
        width: 680,
        autoScroll : true,
        autoHeight: true,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
		items: [{
			xtype:  'textfield',
			fieldLabel: getColName('unique_id'),
			value: unique_id,
		    y: 0 + 1*lineGap,
		    name: 'unique_id',
            readOnly: true,
			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
			anchor: '100%'  // anchor width by perce
			},{
			   	xtype: 'fieldset',
	            title: '회사정보',
	            defaultType: 'textfield',
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
					//value: supplier_code,
					x: 5,
					y: 0 + 1*lineGap,
					name: 'supplier_code',
					value : supplier_code,
                  	readOnly : true,
                  	fieldStyle: 'background-color: #F0F0F0; background-image: none;',                  	
					anchor: '-5'  // anchor width by percentage
		            },{		            	
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
				    anchor: '-5'  // anchor width by percentage
	            }]
		},{
			xtype:'fieldset',
            title: '영업사원 정보',
            collapsible: false,
            height: 170,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
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
///********************파일첨부시 추가(Only for FileAttachment)**************            
		, uploadPanel
///********************파일첨부시 추가(Only for FileAttachment)**************           
		
		            
        ]
    }); //endof form
	
	return form;
}

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			
			Supplier.load(unique_id ,{
				 success: function(supplier) {
/*
					uploadStore = getUploadStore(unique_id);
					uploadStore.load(function() {
						console_log('uploadStore.load ok');
						console_log(uploadStore);
						uploadStore.each(function(record){
							console_log(record.get('object_name'));
						});
						uploadPanel = Ext.create('Ext.ux.multiupload.Panel', {
					        frame: true,
					        store: uploadStore,
					        mode: 'VIEW',
					        groupUid: unique_id,
					        width: 200,
					        height: 140,
					        x: 0,
					        y: 5,
					        uploadConfig: {
					            uploadUrl:  CONTEXT_PATH + '/uploader.do?method=upload',
					            maxFileSize: 4000 * 1024 * 1024,
					            maxQueueLength: 50
					        }
					    });
					    */
				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            autoScroll : true,
				            items: createViewForm(supplier, uploadPanel),
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                       	if(win) 
				                       	{
				                       		if(uploadPanel!=null) {
				                       			uploadPanel.destroy();
				                       		}
				                       		win.close();
				                       	} 
				                  }
				            }]
				        });
				        //store.load(function() {});
						win.show();
						//endofwin
						
//					});
	

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
						uploadPanel = Ext.create('Ext.ux.multiupload.Panel', {
					        frame: true,
					        store: uploadStore,
					        mode: edit_text,
					        groupUid: unique_id,
					        width: 200,
					        height: 140,
					        x: 0,
					        y: 5,
					        uploadConfig: {
					            uploadUrl:  CONTEXT_PATH + '/uploader.do?method=upload',
					            maxFileSize: 4000 * 1024 * 1024,
					            maxQueueLength: 50
					        }
					    });

			        var win = Ext.create('ModalWindow', {
			            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
			            width: 700,
			            height: 500,
			            minWidth: 250,
			            minHeight: 180,
			            modal:true,
			            layout: 'absolute',
			            /*layout: {
			                type: 'border',
			                padding: 0
			            },
			            */
			            plain:true,
			            items: createEditForm(supplier, uploadPanel),
			            buttons: [{
			                text: CMD_OK,
			            	handler: function(){
			                    
			            		var form = Ext.getCmp('formPanel').getForm();
			                                    	
			                    if(form.isValid())
			                    {
			                	var val = form.getValues(false);
			                	///********************파일첨부시 추가(Only for FileAttachment)**************
			                	//alert('edit Handler:' + /*(G)*/vFILE_ITEM_CODE);
			                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
			                	///********************파일첨부시 추가(Only for FileAttachment)**************
			                	var supplier = Ext.ModelManager.create(val, 'Supplier');
			                	
			            		//저장 수정
			                   	supplier.save({
			                		success : function() {
			                			//console_log('updated');			                			
			                           	if(win) 
			                           	{
					            			if(uploadPanel!=null) {
					            				uploadPanel.destroy();
					    			            lfn_gotoHome();
					            			}
			                           		win.close();
			                           		store.load(function() {});
			                           	} 
			                		} 
			                	 });
			                	
			                       	if(win) 
			                       	{
				            			if(uploadPanel!=null) {
				            				uploadPanel.destroy();
//				    			            lfn_gotoHome();
				            			}
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
			            			if(uploadPanel!=null) {
			            				uploadPanel.destroy();
//			    			            lfn_gotoHome();
			            			}
			            			
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
	searchField.push('class_name');
	
	makeSrchToolbar(searchField);
	
	//console_info(/*(G)*/vCENTER_FIELDS);
	
	Ext.define('Classification', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/stdClass.do?method=read',
		            create: CONTEXT_PATH + '/admin/stdClass.do?method=create',
		            update: CONTEXT_PATH + '/admin/stdClass.do?method=create',
		            destroy: CONTEXT_PATH + '/admin/stdClass.do?method=destroy'
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
				model: 'Classification',
				//remoteSort: true,
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		 	store.load(function() {

		 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: true} );
		 		
					//alert(getCenterPanelHeight() + ':' + getPageSize() );
					
					grid = Ext.create('Ext.grid.Panel', {
					        store: store,
					        ///COOKIE//stateful: true,
					        collapsible: true,
					        multiSelect: true,
					        selModel: selModel,
					        height: getCenterPanelHeight(), 
					        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll : true,
					        autoHeight: true,
					        //width: '100%',
					        
					        bbar: getPageToolbar(store),
					        
					        dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '-',  addAction,  '-', removeAction
					                    , '->'
//			      				      ,printExcel
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
														//el.setStyle("color", 'black');
														//el.setStyle("background", '#ff0000');
														//el.setStyle("font-size", '12px');
														//el.setStyle("font-weight", 'bold');
								
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
					        //,renderTo: Ext.getCmp('mainview-content-panel').body  //'MAIN_DIV_TARGET'

					    });
					fLAYOUT_CONTENT(grid);
					
				    grid.getSelectionModel().on({
				        selectionchange: function(sm, selections) {
				        	
				        	console_log(selections.length);
				        	if (selections.length) {
								collapseProperty();//uncheck no displayProperty
				        		////grid info 켜기
				        		displayProperty(selections[0]);
				        	}
				        	
				        	detailAction.enable();
				        	var records = getMyRecordFromSel(selections);
				        	console_log(records.length);
				        	
							if(fPERM_DISABLING()==true) {//수정권한이 없으면.			            		
								removeAction.disable();
				            	editAction.disable();
							} else if(records.length>0) {			            		
								removeAction.enable();
				            	editAction.enable();
							}else {
								//잠시만 풀어봄 ( 왜 권한이 없는지.. 추후 확인 필요)
			            		//removeAction.disable();
				            	//editAction.disable();
								removeAction.enable();
				            	editAction.enable();
			            	}
				        	
				        }

				    });

				    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
				        Ext.create('Ext.tip.ToolTip', config);
				    });
				    //callback for finishing.
				    cenerFinishCallback();
				
			}); //store load

		 	

});//OnReady

     
