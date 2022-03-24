Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var comdstFields = [
 	    { name: 'unique_id', 	type: "string"    }           
        ,{ name: 'dept_code', 		type: "string"    }
        ,{ name: 'dept_name', type: "string"    }
        ,{ name: 'company_code', type: "string"}
        ,{ name: 'company_name', type: "string"}
        ,{ name: 'wa_code', type: "string"}
        ,{ name: 'wa_name', type: "string"}
        ,{ name: 'division_code', type: "string"}
        ,{ name: 'division_name', type: "string"}
        ,{ name: 'creator', type: "string"}
        ,{ name: 'create_date', type: "string"}
        ,{ name: 'changer', type: "string"}
        ,{ name: 'change_date', type: "string"}
        //검색옵션
        ,{ name: 'srch_type', type: "string"    }//multi, single
        
];

var comdstColumn =  [
        { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
        { text     : 'dept_code',  		width : 80,  sortable : true, dataIndex: 'dept_code'  },
        { text     : 'dept_name', 		width : 80,  sortable : true, dataIndex: 'dept_name'  },
        { text     : 'company_code',	width : 80,  sortable : true, dataIndex: 'company_code'  },
        { text     : 'company_name', 	width : 80,  sortable : true, dataIndex: 'company_name'  },
        { text     : 'wa_code', 		width : 80,  sortable : true, dataIndex: 'wa_code'  },
        { text     : 'wa_name', 		width : 80,  sortable : true, dataIndex: 'wa_name'  },
        { text     : 'division_code', 		width : 80,  sortable : true, dataIndex: 'division_code'  },
        { text     : 'division_name', 		width : 80,  sortable : true, dataIndex: 'division_name'  },
        { text     : 'creator', 		width : 80,  sortable : true, dataIndex: 'creator'  },
        { text     : 'create_date', 		width : 80,  sortable : true, dataIndex: 'create_date'  },
        { text     : 'changer', 		width : 80,  sortable : true, dataIndex: 'changer'  },
        { text     : 'change_date', 		width : 80,  sortable : true, dataIndex: 'change_date'  },
 ];

var /*(G)*/vSRCH_TOOLTIP = [{
    target: 'srchUnique_id',
    html: 'unique_id'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}, {
    target: 'srchName',
    html: 'board_name'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}, {
    target: 'srchContents',
    html: 'board_content'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}, {
    target: 'srchUsr',
    html: 'user_id'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}
];

var dept_num = Ext.create('Ext.data.Store', {
	fields : ['num', 'code'],
	data : [
	        {num : '기획부', code : 'J10DC'},
	        {num : '영업팀', code : 'J13DC'},
	        ]
});

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

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('dept_code', '');
	store.getProxy().setExtraParam('dept_name', '');
}

function srchSingleHandler (widName, parmName, isWild) {
	
	resetParam();
	var val = Ext.getCmp(widName).getValue();
	var enValue = Ext.JSON.encode(val);
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + enValue + '%';
	}
	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {});
};

var searchHandler = function() {
	resetParam();
	
	var unique_id = Ext.getCmp('srchUnique_id').getValue();
	var dept_code = Ext.getCmp('srchCode').getValue();
	var dept_name = Ext.getCmp('srchName').getValue();
	
	
	store.getProxy().setExtraParam("srch_type", 'multi');
	
	if(unique_id!=null && unique_id!='') {
		store.getProxy().setExtraParam('unique_id', unique_id);
	}
	
	if(dept_code!=null && dept_code!='') {
		var enValue = Ext.JSON.encode('%' + dept_code + '%');
		store.getProxy().setExtraParam('dept_code', enValue);
	}

	if(dept_name!=null && dept_name!='') {
		var enValue = Ext.JSON.encode('%' + dept_name + '%');
		store.getProxy().setExtraParam('dept_name',  enValue);
	}

	store.load(function() {});
};

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			ComDst.load(unique_id ,{
        				 success: function(comdst) {
        					 //Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
        					 //console_log("user: " + user.get('user_id'));
        					 	var unique_id = comdst.get('unique_id');
        						var dept_code = comdst.get('dept_code');
        						var dept_name = comdst.get('dept_name');
        						var company_code = comdst.get('company_code');
        						var company_name = comdst.get('company_name');
        						var wa_code = comdst.get('wa_code');
        						var wa_name = comdst.get('wa_name');
        						var division_code = comdst.get('division_code');
        						var division_name = comdst.get('division_name');
        						var creator = comdst.get('creator');
        				        var create_date = comdst.get('create_date');
        				        var changer = comdst.get('changer');
        				        var change_date = comdst.get('change_date');
        				        
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
							fieldLabel: 'dept_code',
							value: dept_code,
							x: 5,
							y: -15 + 2*lineGap,
							 name: 'dept_code',
							anchor: '-5'  // anchor width by percentage
							},{
							 fieldLabel: 'dept_name',
							 value: dept_name,
							 x: 5,
							 y: -15 + 3*lineGap,
							 name: 'dept_name',
							 anchor: '-5'  // anchor width by percentage
        				    },{
    						 fieldLabel: 'company_code',
    						 value: company_code,
    						 x: 5,
    						 y: -15 + 4*lineGap,
    						 name: 'company_code',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: 'company_name',
    						 value: company_name,
    						 x: 5,
    						 y: -15 + 5*lineGap,
    						 name: 'company_name',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: 'wa_code',
    						 value: wa_code,
    						 x: 5,
    						 y: -15 + 6*lineGap,
    						 name: 'wa_code',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: 'wa_name',
    						 value: wa_name,
    						 x: 5,
    						 y: -15 + 7*lineGap,
    						 name: 'wa_name',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: 'division_code',
    						 value: division_code,
    						 x: 5,
    						 y: -15 + 8*lineGap,
    						 name: 'division_code',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: 'division_name',
    						 value: division_name,
    						 x: 5,
    						 y: -15 + 9*lineGap,
    						 name: 'division_name',
    						 anchor: '-5'  // anchor width by percentage
    						}
        				    ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
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
        				                       	if(win) 
        				                       	{
        				                       		win.close();
        				                       	} 
        				                  }
        				            }]
        				        });
        				        //store.load(function() {});
        				        win.show();
        						//endofwin
        				 }//endofsuccess
        			 });//emdofload
        	
        };

var editHandler = function() {
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			ComDst.load(unique_id ,{
                				 success: function(comdst) {
                					 //Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
                					 //console_log("user: " + user.get('user_id'));
                					 	var unique_id = comdst.get('unique_id');
                						var dept_code = comdst.get('dept_code');
                						var dept_name = comdst.get('dept_name');
                						
                						var company_code = comdst.get('company_code');
                						var company_name = comdst.get('company_name');
                						var wa_code = comdst.get('wa_code');
                						var wa_name = comdst.get('wa_name');
                						var division_code = comdst.get('division_code');
                						var division_name = comdst.get('division_name');
                						var creator = comdst.get('creator');
                				        var create_date = comdst.get('create_date');
                				        var changer = comdst.get('changer');
                				        var change_date = comdst.get('change_date');
                				        
                						
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
                				                fieldLabel: 'unique_id',
                				                value: unique_id,
                				                x: 5,
                				                y: -15 + 1*lineGap,
                				                name: 'unique_id',
                				                readOnly: true,
                				    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'dept_code',
                				                xtype:'combo',
                				                store: dept_num,
                				                queryMode: 'local',
                				                displayField: 'code',
                				                valueField: 'code',
                				                listConfig:{
                				                	getInnerTpl: function(){
                				                		return '<div data-qtip="{name}.{code}">{name}{num}({code})</div>';
                				                	}
                				                	
                				                },
                				                value: dept_code,
                				                x: 5,
                				                y: -15 + 2*lineGap,
                				                name: 'dept_code',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'dept_name',
                				                xtype:'combo',
                				                store: dept_num,
                				                queryMode: 'local',
                				                displayField: 'num',
                				                valueField: 'num',
                				                listConfig:{
                				                	getInnerTpl: function(){
                				                		return '<div data-qtip="{name}.{num}">{name}{code}({num})</div>';
                				                	}
                				                	
                				                },
                				                value: dept_name,
                				                x: 5,
                				                y: -15 + 3*lineGap,
                				                name: 'dept_name',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                	    						 fieldLabel: 'company_code',
                	    						 value: company_code,
                	    						 x: 5,
                	    						 y: -15 + 4*lineGap,
                	    						 name: 'company_code',
                	    						 readOnly: true,
                	    			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                	    						 anchor: '-5'  // anchor width by percentage
                	    						},{
                	    						 fieldLabel: 'company_name',
                	    						 value: company_name,
                	    						 x: 5,
                	    						 y: -15 + 5*lineGap,
                	    						 name: 'company_name',
                	    						 readOnly: true,
                	    			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                	    						 anchor: '-5'  // anchor width by percentage
                	    						},{
                	    						 fieldLabel: 'wa_code',
                	    						 value: wa_code,
                	    						 x: 5,
                	    						 y: -15 + 6*lineGap,
                	    						 name: 'wa_code',
                	    						 readOnly: true,
                	    			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                	    						 anchor: '-5'  // anchor width by percentage
                	    						},{
                	    						 fieldLabel: 'wa_name',
                	    						 value: wa_name,
                	    						 x: 5,
                	    						 y: -15 + 7*lineGap,
                	    						 name: 'wa_name',
                	    						 readOnly: true,
                	    			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                	    						 anchor: '-5'  // anchor width by percentage
                	    						},{
                	    						 fieldLabel: 'division_code',
                	    						 value: division_code,
                	    						 x: 5,
                	    						 y: -15 + 8*lineGap,
                	    						 name: 'division_code',
                	    						 readOnly: true,
                	    			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                	    						 anchor: '-5'  // anchor width by percentage
                	    						},{
                	    						 fieldLabel: 'division_name',
                	    						 value: division_name,
                	    						 x: 5,
                	    						 y: -15 + 9*lineGap,
                	    						 name: 'division_name',
                	    						 readOnly: true,
                	    			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                	    						 anchor: '-5'  // anchor width by percentage
                	    						}
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
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
                				                	var comdst = Ext.ModelManager.create(val, 'ComDst');
                				                	
                				            		//저장 수정
                				                   	comdst.save({
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
Ext.define('ComDst.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	//console_info(data);
    	//console_info(data[0]);
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
	           	 var comdst = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'ComDst');
        		
	           	comdst.destroy( {
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
             items: [ 
            {
                fieldLabel: 'dept_code',
                xtype: 'combo',
                store: dept_num,
                queryMode: 'local',
                displayField: 'code',
                valueField: 'code',
                x: 5,
                y: 0 + 1*lineGap,
                name: 'dept_code',
                
                anchor: '-5',  // anchor width by percentage
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{name}.{code}">{name}{num}({code})</div>';
                	}
                	
                }
            },{
                fieldLabel: 'dept_name',
                xtype: 'combo',
                store: dept_num,
                queryMode: 'local',
                displayField: 'num',
                valueField: 'num',
                x: 5,
                y: 0 + 2*lineGap,
                name: 'dept_name',
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{name}.{num}">{name}{code}({num})</div>';
                	}
            },
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'company_code',
                x: 5,
                y: 0 + 3*lineGap,
                name: 'company_code',
                readOnly: true,
                fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                value: 'CC100',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'company_name',
                x: 5,
                y: 0 + 4*lineGap,
                name: 'company_name',
                value: '다함주식회사',
                readOnly: true,
                fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'wa_code',
                x: 5,
                y: 0 + 5*lineGap,
                name: 'wa_code',
                value: 'none',
                readOnly: true,
                fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'wa_name',
                x: 5,
                y: 0 + 6*lineGap,
                name: 'wa_name',
                value: 'none',
                readOnly: true,
                fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'division_code',
                x: 5,
                y: 0 + 7*lineGap,
                name: 'division_code',
                value: 'none',
                readOnly: true,
                fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'division_name',
                x: 5,
                y: 0 + 8*lineGap,
                name: 'division_name',
                value: 'none',
                readOnly: true,
                fieldStyle: 'background-color: #E7EEF6; background-image: none;',
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
                   	 var comdst = Ext.ModelManager.create(val, 'ComDst');
            		//저장 수정
                   	comdst.save({
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


Ext.define('ComDst', {
    	 extend: 'Ext.data.Model',
    	 fields: comdstFields,
    	    proxy: {
				type: 'ajax',
				//url: CONTEXT_PATH + '/admin/board.do?method=getUserList',
		        api: {
		            read: CONTEXT_PATH + '/admin/comdst.do?method=read',
		            create: CONTEXT_PATH + '/admin/comdst.do?method=create',
		            update: CONTEXT_PATH + '/admin/comdst.do?method=update',
		            destroy: CONTEXT_PATH + '/admin/comdst.do?method=destroy'
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
		        } /* ,
		        actionMethods: {
		            create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'
		        }*/
			}
});

Ext.onReady(function() {  

	 //Board Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'ComDst',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});

 	store.load(function() {
 		//Ext.get('MAIN_DIV_TARGET').update('');
		if(store.getCount()==0) {
			//Ext.MessageBox.alert("Check!!!!", "Check your login state. (로그인 했나요?)");
		} else {
			
			var selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight : true,
			        //layout: 'fit',
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        
			        bbar: Ext.create('Ext.PagingToolbar', {
			            store: store,
			            displayInfo: true,
			            displayMsg: 'Displaying topics {0} - {1} of {2}',
			            emptyMsg: "No topics to display"
			         
			        }),
			        
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
			            items: [
								{
			                        xtype: 'triggerfield',
			                        emptyText: 'unique_id',
			                        id: 'srchUnique_id',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchUnique_id', 'unique_id', false);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchUnique_id').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchUnique_id', 'unique_id', false);
			                        	/*
			                        	var unique_id = Ext.getCmp('srchUnique_id').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("unique_id", unique_id);
			                        	store.load(function() {});
			                        	*/
			                    	}

								},
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'dept_name',
			                        id: 'srchName',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchName', 'dept_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchName').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchName', 'dept_name', true);
			                        	/*
			                        	var board_name = Ext.getCmp('srchName').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("board_name", '%' + board_name + '%');
			                        	store.load(function() {});
			                        	*/
			                    	}
			                    },
			                    '-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'dept_code',
			                        id: 'srchCode',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchCode', 'dept_code', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchCode').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchCode', 'dept_code', true);
			                        	/*
			                        	var board_content = Ext.getCmp('srchContents').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("board_content", '%' +board_content + '%');
			                            //store.reload();
			                        	store.load(function() {});
			                        	*/
			                    	}
			                    	
			                    },			                    ,
			                    '->', 

			                    {
			                        text: 'First Division',
			                        iconCls: 'number01',
			                        menu: {
			                            items: [
			                                {
			                                    text: 'First Division',
			                                    iconCls: 'number01'
			                                },
			                                {
			                                    text:  'Second Division',
			                                    iconCls: 'number02'
			                                },
			                                {
			                                    text:  'Third Division',
			                                   iconCls: 'number03'
			                                },
			                                {
			                                    text:  'Fourth Division',
			                                   iconCls: 'number04'
			                                }
			                            ]
			                        }
			                    }

			                 ]
			        }
			        
			        ],
			        columns: comdstColumn,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler /* function(dv, record, item, index, e) {
			                    alert('working');
			                }*/

			            }
			        },
			        title: 'ComDst',
			        renderTo: 'MAIN_DIV_TARGET'
			    });
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
		            	//grid info 켜기
		            	displayProperty(selections[0]);
		            	
		            	if(fPERM_DISABLING()==true) {
			            	removeAction.enable();
			            	editAction.enable();
		            	}else{
		            		removeAction.enable();
			            	editAction.enable();
		            	}
		            	detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		removeAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config){
		    	Ext.create('Ext.tip.ToolTip', config);
		    });

		}
	});
 	 	
     });
     
