
		var comDstFields = [
                       	    { name: 'unique_id', type: "string"    }           
                             ,{ name: 'dept_code', type: "string"    }
                             ,{ name: 'dept_name', type: "string"    }            
         ];



         var roleFields = [
                       	    { name: 'role_code', type: "string"    }           
                             ,{ name: 'role_name', type: "string"    }           
         ];
         
         searchField = [];
         var userGrade =Ext.create('Ext.form.ComboBox', {
             fieldLabel: 'Choose State',
             store:  Ext.create('Ext.data.ArrayStore', {
                 fields: ['abbr', 'name'],
                 data : [
                     {"abbr":"AL", "name":"Alabama"},
                     {"abbr":"AK", "name":"Alaska"},
                     {"abbr":"AZ", "name":"Arizona"}
                     //...
                 ]
             }),
             queryMode: 'local',
             displayField: 'name',
             valueField: 'abbr'
         });

         function getCheckVal(arrUserType, value) {
        	 for(var i=0; i<arrUserType.length; i++) {
        		 if(value==arrUserType[i]) {
        			 return true;
        		 }
        	 }
        	 
        	 return false;
         }
         
         var checkboxArray = new Array();  

         var deptStore = new Ext.create('Ext.data.Store', {
         	fields:comDstFields,
             proxy: {
                 type: 'ajax',
                 url: CONTEXT_PATH + '/userMgmt/user.do?method=readDept',
                 reader: {
                 	type:'json',
                     root: 'comboDept',
                     totalProperty: 'count',
                     successProperty: 'success'
                 }
                 ,autoLoad: false
             	}
         });

         var roleStore = new Ext.create('Ext.data.Store', {
         	fields:roleFields,
             proxy: {
                 type: 'ajax',
                 url: CONTEXT_PATH + '/userMgmt/user.do?method=readRole',
                 reader: {
                 	type:'json',
                     root: 'comboRole',
                     totalProperty: 'count',
                     successProperty: 'success'
                 },
                 autoLoad:false  
             }
         });

         
         
      var roleCheckbox = [];
     
        

         var Dtstore = new Ext.create('Ext.data.ArrayStore', {
             fields: [{ name: 'dept_code', type: "string"}
                      ,{ name: 'dept_name', type: "string"    }],
             proxy: {
                 type: 'ajax', 
                 url:  CONTEXT_PATH + '/userMgmt/user.do?method=readDept', // whatever your webservice path is
                 reader: 'json',
                 totalProperty: 'count'	 
             },
             autoLoad:true  
         });  


         //global var.
         var grid = null;
         var store = null;
         var selModel =null;
         var userGra= null
         var counts = null;

         var viewHandler = function() {
         	var rec = grid.getSelectionModel().getSelection()[0];
         	
         	var unique_id = rec.get('unique_id');
         	UsrAst.load(unique_id ,{
         		 success: function(usrAst) {
         			 	
         			 //UniqueId
         			 var unique_id = usrAst.get('unique_id');
         			 //회사정보
         			 var company_code = usrAst.get('company_code');
         			 var dept_code = usrAst.get('dept_code');
         			 var dept_name = usrAst.get('dept_name');
         			 var position = usrAst.get('position');//직책
         			 var tel_no = usrAst.get('tel_no');
         			 var fax_no = usrAst.get('fax_no');		 
         			 var emp_no = usrAst.get('emp_no' );//사번
         			 
         			 //개인정보 			 
         			 var user_id = usrAst.get('user_id');
         			 var user_name = usrAst.get('user_name');
         			 var email = usrAst.get('email');		
         			 var hp_no = usrAst.get('hp_no');			 
         			 var user_type = usrAst.get('user_type' );
         			 var user_grade = usrAst.get('user_grade');
         		        
         			var lineGap = 30;
         		    var form = Ext.create('Ext.form.Panel', {
         		    		id: 'formPanel',
         		            layout: 'absolute',
         		            url: 'save-form.php',
         		            defaultType: 'displayfield',
         		            border: false,
         		            autoScroll:true,
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
         			allowBlank: false,
         			anchor: '-5'  // anchor width by percentage
         			},{
         			fieldLabel: getColName('dept_code'),
         			value: dept_code,
         			x: 5,
         			y: 0 + 2*lineGap,
         			 name: 'dept_code',
         			anchor: '-5'  // anchor width by percentage
         			},{
         				fieldLabel: getColName('dept_name'),
         				value: dept_name,
         				x: 5,
         				y: 0 + 3*lineGap,
         				name: 'dept_name',
         				anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('company_code'),
         		    	value: company_code,
         		    	x: 5,
         		    	y: 0 + 4*lineGap,
         		    	name: 'company_code',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('user_id'),
         		    	value: user_id,
         		    	x: 5,
         		    	y: 0 + 5*lineGap,
         		    	name: 'user_id',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('emp_no'),
         		    	value: emp_no,
         		    	x: 5,
         		    	y: 0 + 6*lineGap,
         		    	name: 'emp_no',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('user_name'),
         		    	value: user_name,
         		    	x: 5,
         		    	y: 0 + 7*lineGap,
         		    	name: 'user_name',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('position'),
         		    	value: position,
         		    	x: 5,
         		    	y: 0 + 8*lineGap,
         		    	name: 'position',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('tel_no'),
         		    	value: tel_no,
         		    	x: 5,
         		    	y: 0 + 9*lineGap,
         		    	name: 'tel_no',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('fax_no'),
         		    	value: fax_no,
         		    	x: 5,
         		    	y: 0 + 10*lineGap,
         		    	name: 'fax_no',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('email'),
         		    	value: email,
         		    	x: 5,
         		    	y: 0 + 11*lineGap,
         		    	name: 'email',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('hp_no'),
         		    	value: hp_no,
         		    	x: 5,
         		    	y: 0 + 12*lineGap,
         		    	name: 'hp_no',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('user_type'),
         		    	value: user_type,
         		    	x: 5,
         		    	y: 0 + 13*lineGap,
         		    	name: 'user_type',
         		    	anchor: '-5'  // anchor width by percentage
         		    },{
         		    	fieldLabel: getColName('user_grade'),
         		    	value: user_grade,
         		    	x: 5,
         		    	y: 0 + 14*lineGap,
         		    	name: 'user_grade',
         		    	anchor: '-5'  // anchor width by percentage
         		    }
         		    ]
         		        }); //endof form

         		        var win = Ext.create('ModalWindow', {
         		            title: CMD_VIEW,
         		            width: 540,
         		            height: 500,
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

         	UsrAst.load(unique_id ,{
         		 success: function(usrAst) {
         			 	var unique_id = usrAst.get('unique_id');
         				 //회사정보
         				 var dept_name = usrAst.get('dept_name');
         				 var position = usrAst.get('position');//직책
         				 var tel_no = usrAst.get('tel_no');
         				 var extension_no = usrAst.get('extension_no');//내선번호(전환번호)
         				 var fax_no = usrAst.get('fax_no');		 
         				 var emp_no = usrAst.get('emp_no' );//사번
         				 
         				 //개인정보 			 
         				 var user_id = usrAst.get('user_id');
         				 var user_name = usrAst.get('user_name');
         				 var email = usrAst.get('email');		
         				 var hp_no = usrAst.get('hp_no');			 
         				 var user_type = usrAst.get('user_type' );//권한? 파일접근 레벨?
         				 var user_grade = usrAst.get('user_grade');//권한? 파일접근 레벨? 
         				 var zip_code = usrAst.get('zip_code');		
         				 var address_1 = usrAst.get('address_1');		
         				 var address_2 = usrAst.get('address_2');			 
         				 var language_type = usrAst.get('language_type');		
         				 var time_zone = usrAst.get('time_zone');			 
         				var lineGap = 30;
         				
         				var arrUserType = user_type.split(',');
         				
         				var roleItems = [];
                        roleStore.load(function(records) {
                            for(var i = 0; i < records.length; i++)
                            {
                            	roleItems.push ( { 
                                	checked: getCheckVal(arrUserType, records[i].data.role_code),
		                             boxLabel: records[i].data.role_name,
		                             name: 'user_type',
		                             inputValue: records[i].data.role_code
		                         });
                            }//enof for
                            
             		    	var form = Ext.create('Ext.form.Panel', {
             		    		id: 'formPanel',
             		    		layout:'anchor',
             		            url: 'save-form.php',
             		            defaultType:  'textfield',
             		            border: false,
             		            bodyPadding: 10,
             		            autoScroll:true,
             		            defaults: {
             		                msgTarget: 'side',
             		                labelWidth: 100
             		            },
             		            items: [
             			           {
             			             fieldLabel: getColName('unique_id'),
             			             type: 'textfield',
             			             value: unique_id,
             			             x: 5,
             			             y: 0 + 1*lineGap,
             			             id: 'unique_id',
             			             name: 'unique_id',
             			             readOnly: true,
             			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
             			              anchor: '-5'  // anchor width by percentage
             				        },{
             		                fieldLabel: getColName('user_id'),
             		                type: 'textfield',
             		                value: user_id,
             		                x: 5,
             		                y: 0 + 2*lineGap,
             		                name: 'user_id',
             		                readOnly: true,
             			    		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
             		                anchor: '-5'  // anchor width by percentage
             		                },
             		                {
             		                 xtype: 'container',
             		                 margin: '0 0 0',
             			                 x: 5,
             				             y: 0 + 3*lineGap,
             				             anchor: '-5',  // anchor width by percentage
             		                        items: [{
             		                        xtype: 'fieldset',
             		                         flex: 1,
             		                         title: aus1_user_type,
             		                         defaultType: 'checkbox', // each item will be a checkbox
             		                         layout: 'anchor',
             					             collapsible: true,
             		                         defaults: {
             		                             hideEmptyLabel: false
             		                         },
             		                         items: [	{
                                                 xtype: 'checkboxgroup',
                                                 columns: 2,
                                                 items: roleItems
             		                     }]
             		                     }]	
             		                }
             				      ,{
             		                   fieldLabel: getColName('user_grade'),//결재구분---> 데이타가 안 넘어감 우선 배제 
             		                   name: 'user_grade',
             	                       value: user_grade,
             		                   xtype: 'combo',
             		                   mode: 'local',
             		                   editable:false,
             		                   allowBlank: false,
             		                   queryMode: 'local',
             		                   displayField:   'name',
             		                   valueField:     'value',
             		                   store:          Ext.create('Ext.data.ArrayStore', {
             		                       fields : [{ name: 'name', type: "string"    }
             		                	    ,{ name: 'value', type: "string"    }],
             		                	   data   : [['LEVEL 1','S'],['LEVEL 2','A'],['LEVEL 3','B'],['LEVEL 4','C'],[aus1_save_authority1,'N']]
             		                   }),                
             		                   anchor: '-5'  // anchor width by percentage
             		               },
             		               {
             		                fieldLabel: getColName('user_name'),
             		                type: 'textfield',
             		                value: user_name,
             		                x: 5,
             		                name: 'user_name',
             		                allowBlank: false,
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('email'),
             		                type: 'textfield',
             		                value: email,
             		                x: 5,
             		                name: 'email',
             		                allowBlank: false,
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('emp_no'),
             		                type: 'textfield',
             		                value: emp_no,
             		                x: 5,
             		                name: 'emp_no',
             		                allowBlank: false,
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		              /*  fieldLabel: getColName('dept_name'),
             		                id :'dept_name',
             		                name : 'dept_name',
             		                value: dept_name,
             		                   xtype: 'combo',
             		                   mode: 'local',
             		                   editable:false,
             		                   allowBlank: false,
             		                   queryMode: 'remote',
             		                   displayField:   'dept_name',
             		                   valueField:     'dept_code',
             		                   store: deptStore,
             			                listConfig:{
             			                	getInnerTpl: function(){
             			                		return '<div data-qtip="{dept_name}.{unique_id}">{dept_name}({dept_code})</div>';*/
             		            	fieldLabel: getColName('dept_name'),
                                    id :'dept_name',
                                    name : 'unique_id_comdst',
                                    value: dept_name,
                                    allowBlank: false,                
                                       xtype: 'combo',
                                       mode: 'local',
                                       editable:false,
                                       allowBlank: false,
                                       queryMode: 'remote',
                                       displayField:   'dept_name',
                                       valueField:     'unique_id',
                                       store: deptStore,
                    	                listConfig:{
                    	                	getInnerTpl: function(){
                    	                		return '<div data-qtip="UID:{unique_id}">[{dept_code}]{dept_name}</div>';
             		            }			                	
             			                },
             			                
             		                   anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('position'),
             		                type: 'textfield',
             		                value: position,
             		                x: 5,
             		                name: 'position',
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('tel_no'),
             		                type: 'textfield',
             		                value: tel_no,
             		                x: 5,
             		                name: 'tel_no',
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('extension_no'),
             		                type: 'textfield',
             		                value: extension_no,
             		                x: 5,
             		                name: 'extension_no',
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('hp_no'),
             		                type: 'textfield',
             		                value: hp_no,
             		                x: 5,
             		                name: 'hp_no',
             		                anchor: '-5'  // anchor width by percentage		                			            
             		            },{
             		                fieldLabel: getColName('fax_no'),
             		                type: 'textfield',
             		                value: fax_no,
             		                x: 5,
             		                name: 'fax_no',
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('zip_code'),
             		                type: 'textfield',
             		                value: zip_code,
             		                x: 5,
             		                name: 'zip_code',
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('address_1'),
             		                type: 'textfield',
             		                value: address_1,
             		                x: 5,
             		                name: 'address_1',
             		                anchor: '-5'  // anchor width by percentage
             		            },{
             		                fieldLabel: getColName('address_2'),
             		                type: 'textfield',
             		                value: address_2,
             		                x: 5,
             		                name: 'address_2',
             		                anchor: '-5'  // anchor width by percentage
             		            },
//             		            {
//             		                fieldLabel: getColName('language_type'),
//             		                   xtype: 'combo',
//             		                   mode: 'local',
//             		                   value: language_type,
//             		                   editable:false,
//             		                   allowBlank: false,
//             		                   queryMode: 'local',
//             		                   displayField:   'name',
//             		                   valueField:     'value',
//             		                   store:          Ext.create('Ext.data.ArrayStore', {
//             		                       fields : [{ name: 'name', type: "string"    }
//             		                	    ,{ name: 'value', type: "string"    }],
//             		                       data   : [[aus1_save_level1,'G'],[aus1_save_level2,'K']]
//             		                   }),           		                anchor: '-5'  // anchor width by percentage
//             		            },
//             		            {
//             		                fieldLabel: getColName('time_zone'),
//             		                type: 'textfield',
//             		                value: time_zone,
//             		                x: 5,
//             		                name: 'time_zone',
//             		                anchor: '-5'  // anchor width by percentage
//             		            }
             		            
             		            ]
             		        }); //endof form

            		        var win = Ext.create('ModalWindow', {
             		            title: CMD_MODIFY,
             		            width: 600,
             		            height: 600,
             		            minWidth: 250,
             		            minHeight: 180,
             		            layout: 'fit',
             		            items: form,
             		            buttons: [{
             		                text: CMD_OK,
             		            	handler: function(){
             		                    var form = Ext.getCmp('formPanel').getForm();
             		                    if(form.isValid())
             		                    {
             		                	var val = form.getValues(false);
             		                	var usrAst = Ext.ModelManager.create(val, 'UsrAst');
             		                	
             		            		//저장 수정
             		                	usrAst.save({
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
             		        }); //win define
            		        
              		       win.show();
            				//endofwin            		        
                        });//endof load
         		 }//endofsuccess
         	 });//endofload

         };

         function deleteConfirm(btn){

             var selections = grid.getSelectionModel().getSelection();
             if (selections) {
                 var result = MessageBox.msg('{0}', btn);
                 if(result=='yes') {
                 	for(var i=0; i< selections.length; i++) {
                 		var rec = selections[i];
                 		var unique_id = rec.get('unique_id');
         	           	 var usrAst = Ext.ModelManager.create({
         	           		unique_id : unique_id
         	        	 }, 'UsrAst');
                 		
         	           	usrAst.destroy( {
         	           		 success: function() {}
         	           	});
                    	
                 	}
                 	grid.store.remove(selections);
                 }

             }
         };
//         function resetConfirm(btn){
//        	 var selections = grid.getSelectionModel().getSelection();
//        	 record = selections[0];
//         	 var unique_id = record.get('unique_id');
//        	 if (selections) {
//        		 var result = MessageBox.msg('{0}', btn);
//        		 if(result=='yes') {
//        			 Ext.Ajax.request({
//        				 	url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',
//        					params:{
//        						unique_id : unique_id
//        					},
//        					success : function(result, request) {
//        						Ext.MessageBox.alert('Init','selected user password is  reset  to "0000"');
//        					},
//        					failure: extjsUtil.failureMessage
//        				});	
//        		 }
//        		 
//        	 }
//         };


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
         
         //Define reset Action
         var resetAction = Ext.create('Ext.Action', {
        	 itemId: 'resetButton',
        	 iconCls: 'search',
        	 text: CMD_INIT,
        	 disabled: true,
        	 handler: function(widget, event) {
        		 Ext.MessageBox.show({
        			 title:'Are you reset?',
        			 msg: 'You are reset. <br />Are you sure?',
        			 buttons: Ext.MessageBox.YESNO,
        			 fn: resetConfirm,
        			 icon: Ext.MessageBox.QUESTION
        		 });
        	 }
         });


         //Define Remove Action
         var addAction =	 Ext.create('Ext.Action', {
         	iconCls:'add',
         	disabled: fPERM_DISABLING(),
             text: CMD_ADD,
             handler: function(widget, event) {

            	 var formDeptcode = new Ext.form.Hidden({
         		    id: 'dept_code',
         		   name: 'dept_code'
         		});
         		var lineGap = 30;
             	var form = Ext.create('Ext.form.Panel', {
             		id: 'formPanel',
                     layout: 'anchor',
                     border: false,
                     bodyPadding: 15,
                     autoScroll : true,
                     defaults: {
                         anchor: '100%',
                         msgTarget: 'side',
                         labelWidth: 100
                     },
                      items: [ 
                     {
                         fieldLabel: getColName('user_id'),
                         allowBlank: false,
                         x: 5,
                         y: 0 + 1*lineGap,
                         name: 'user_id',
                         id: 'user_id',
                         xtype:  'textfield',
                         anchor: '-5'  // anchor width by percentage
                     },{
                         fieldLabel: getColName('dept_name'),
                         id :'unique_id_comdst',
                         name : 'unique_id_comdst',
                         allowBlank: false,                
                            xtype: 'combo',
                            mode: 'local',
                            editable:false,
                            allowBlank: false,
                            queryMode: 'remote',
                            displayField:   'dept_name',
                            valueField:     'unique_id',
                            store: deptStore,
         	                listConfig:{
         	                	getInnerTpl: function(){
         	                		return '<div data-qtip="UID:{unique_id}">[{dept_code}]{dept_name}</div>';
         	                	}			                	
         	                },
         	               //functions
         	                triggerAction: 'all',
         	               listeners: {
         	                    select: function (combo, record) {
         	                    	console_log('Selected Value : ' + combo.getValue());
         	                    	var dept_unique_id = record[0].get('unique_id');
         	                    	var dept_code  = record[0].get('dept_code');
         	                    	var dept_name  = record[0].get('dept_name');
         	                    	console_log('dept_unique_id : ' + dept_unique_id 
         	                    			+ ', dept_code=' + dept_code
         	                    			+ ', dept_name=' + dept_name	);
         	                    	
         	                    	formDeptcode.setValue(dept_code);
         	                    }
         	                },	                
                            anchor: '-5'  // anchor width by percentage
         	        }, formDeptcode
         	        ,{
         	                 xtype: 'container',
         	                 margin: '0 0 0',
         		                 x: 5,
         			             y: 0 + 3*lineGap,
         			             anchor: '-5',  // anchor width by percentage
         	                        items: [{
         	                        xtype: 'fieldset',
         	                         flex: 1,
         	                         title: aus1_user_type,
         	                         defaultType: 'checkbox', // each item will be a checkbox
         	                         layout: 'anchor',
         				             collapsible: true,
         	                         defaults: {
         	                             hideEmptyLabel: false
         	                         },
         	                         items: [	{
                                        xtype: 'checkboxgroup',
                                        columns: 2,
                                        items:roleCheckbox
         	                     }]
         	                     }]	
                     },{
                         fieldLabel: getColName('user_grade'),
                         allowBlank: false,           
                         name : 'user_grade',
                         xtype: 'combo',
                         mode: 'local',
                         editable:false,
                         allowBlank: false,
                         queryMode: 'local',
                         displayField:   'name',
                         valueField:     'value',
                         store:          Ext.create('Ext.data.ArrayStore', {
                             fields : [{ name: 'name', type: "string"    }
                      	    ,{ name: 'value', type: "string"    }],
                             data   : [['LEVEL 1','S'],['LEVEL 2','A'],['LEVEL 3','B'],['LEVEL 4','C'],[aus1_save_authority1,'N']]
                         }),          
                         anchor: '-5'  // anchor width by percentage             	
                     },{
                         fieldLabel: getColName('email'),
                         xtype:  'textfield',
                         allowBlank: false,
                         x: 5,
                         y: 0 + 4*lineGap,
                         name: 'email',
                         anchor: '-5'  // anchor width by percentage
                     },{
                         fieldLabel: getColName('user_name'),
                         xtype:  'textfield',
                         allowBlank: false,
                         x: 5,
                         y: 0 + 5*lineGap,
                         name: 'user_name',
                         id: 'user_name',                         
                         anchor: '-5'  // anchor width by percentage
                     }
                     ]

                 });

             	
                 var win = Ext.create('ModalWindow', {
                     title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
                     width: 600,
                     height: 540,
                     minWidth: 250,
                     minHeight: 180,
                     layout: 'fit',
                     items: form,
                     buttons: [{
                         text: CMD_OK,
                     	handler: function(){
                             var form = Ext.getCmp('formPanel').getForm();
                             if(form.isValid())
                             {
                            	 var val = form.getValues(false);
	                           	 var usrAst = Ext.ModelManager.create(val, 'UsrAst');
	                           	 var user_id = Ext.getCmp('user_id').getValue();
	                           	 var user_name = Ext.getCmp('user_name').getValue();
	                           	
	                           	 if(user_name.length > 20 || user_id.length > 20){
	                           		Ext.MessageBox.alert('Error', 'Do not use to long Name,ID(Max 20)'); 
	                           	 }else{	
	                           		 //중복 코드 체크
		         					Ext.Ajax.request({
		            						url: CONTEXT_PATH + '/userMgmt/user.do?method=checkCode',				
		                 				params:{
		                 					user_id : user_id
		                 				},
		            						
		            						success : function(result, request) {
		            							
		            							var ret = result.responseText;
		            							console_log('ret : '+ret);
		            							
		            							if(ret == 0 ||  ret  == '0') {
		            								//저장 수정
		                                        	usrAst.save({
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
		            								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('user_id') + ' value.'); 
		            							}
		            							console_log('requested ajax...');
		            						},
		            						failure: extjsUtil.failureMessage
		            					}); 			
	                           	 }
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
             text: 'Detail',
             disabled: true,
             handler: viewHandler
         });
         //Context Popup Menu
         var contextMenu = Ext.create('Ext.menu.Menu', {
             items: [ detailAction, editAction, removeAction  ]
         });



         Ext.define('UsrAst', {
             	 extend: 'Ext.data.Model',
             	 fields: /*(G)*/vCENTER_FIELDS,
             	    proxy: {
         				type: 'ajax',
         		        api: {
         		            read: CONTEXT_PATH + '/userMgmt/user.do?method=read',
         		            create: CONTEXT_PATH + '/userMgmt/user.do?method=create',
         		            update: CONTEXT_PATH + '/userMgmt/user.do?method=create',
         		            destroy: CONTEXT_PATH + '/userMgmt/user.do?method=destroy'
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

         Ext.onReady(function() {  


        		makeSrchToolbar(searchField);
         	
         	 //UsrAst Store 정의
         	store = new Ext.data.Store({  
         		pageSize: getPageSize(),
         		model: 'UsrAst',
         		sorters: [{
                     property: 'unique_id',
                     direction: 'DESC'
                 }]
         	});     	
          	
          	store.load(function() {
          		
         			selModel = Ext.create('Ext.selection.CheckboxModel', {
         			    listeners: {
         			        selectionchange: function(sm, selections) {
         			        	grid.down('#removeButton').setDisabled(selections.length == 0);
         			        }
         			    }
         			});
         	
         			grid =Ext.create('Ext.grid.Panel', {
         			        store: store,
         			        collapsible: true,
         			        multiSelect: true,
         			        selModel: selModel,
         			        height: getCenterPanelHeight(), 
         			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
         			      
					        bbar: getPageToolbar(store),

         			        dockedItems: [{
         			            dock: 'top',
         			            xtype: 'toolbar',
         			            items: [
         			                     addAction,  '-', removeAction, '-', resetAction,
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
	         		            	resetAction.disable();
         						}else{
         							removeAction.enable();
             		            	editAction.enable();
             		            	resetAction.enable();
         						}
         						detailAction.enable();
         		            } else {
         		            	if(fPERM_DISABLING()==true) {
         		            		collapseProperty();//uncheck no displayProperty
	         		            	removeAction.disable();
	         		            	editAction.disable();
	         		            	resetAction.disable();
         		            	}else{
         		            		collapseProperty();//uncheck no displayProperty
         		            		removeAction.disable();
             		            	editAction.disable();
             		            	resetAction.disable();
         		            	}
         		            	detailAction.enable();
         		            }
         		        }
         		    });

         		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
         		        Ext.create('Ext.tip.ToolTip', config);
         		    });
         		    
         		    //Dept Load
                  	deptStore.load(function(records) {
                        for(var i = 0; i < records.length; i++) {
                          checkboxArray.push(
                        		 {  name: 'dept_power',
                                  inputValue: records[i].data.dept_code,
                                  boxLabel : records[i].data.dept_name}
                        		);
                        } 
                        
                        //roleCode Load
                        roleStore.load(function(records) {
                            for(var i = 0; i < records.length; i++) {
                            	roleCheckbox.push(
                            		 {  name: 'user_type',
                                      inputValue: records[i].data.role_code,
                                      boxLabel : records[i].data.role_name}
                            		);
                            } 
                        }); 
                    });
                  	
         		cenerFinishCallback();
         	});

          	 	
         });
              

