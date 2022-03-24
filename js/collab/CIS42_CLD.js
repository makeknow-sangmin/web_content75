/**
 * CIS1 : 나의이슈(책임)
 */

//global var.
var grid = null;
var store = null;
var selectedId = '';
var selectedName = '';
var selectedUid = '';
var selectedEmail = '';
var selectedHp = '';
var selectedTelNo = '';

var commonStateStore =null;

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('user_name', '');
	store.getProxy().setExtraParam('rqst_title', '');
}

function createViewForm(svcqst) {
	
	var lineGap = 30;
	var unique_id = svcqst.get('unique_id');
	var user_id = svcqst.get('user_id');
	var user_name = svcqst.get('user_name');
	var state = svcqst.get('state');
	var rqst_title = svcqst.get('rqst_title');
	var rqst_content = svcqst.get('rqst_content');
	var require_date = svcqst.get('require_date');
	function date(require_date){
		 return require_date.substring(0,10);
	 }
	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
        defaultType: 'displayfield',
        border: false,
        bodyPadding: 15,
        height: 650,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [{
			fieldLabel: getColName('unique_id'),
			value: unique_id,
			name: 'unique_id',
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: getColName('user_id'),
			value: user_id,
			 name: 'user_id',
			anchor: '-5'  // anchor width by percentage
			},{
		    	fieldLabel: getColName('user_name'),
		    	value: user_name,
		    	name: 'user_name',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('state'),
		    	value: state,
		    	name: 'state',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('require_date'),
                value: require_date,
                name: 'require_date',
                readOnly: true,
                anchor: '100%'
            },{
		    	fieldLabel: getColName('rqst_title'),
                value: rqst_title,
                name: 'rqst_title',
                readOnly: true,
                anchor: '100%'
            },{
                value: rqst_content,
                name: 'rqst_content',
                fieldStyle: 'height:250; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                readOnly: true,
                anchor: '100%'
            }  
		    ]
    }); //endof form
	
	return form;
}

function createPlanForm(svcqst, attachedFileStore){
	var unique_id = svcqst.get('unique_id');
	var user_name = svcqst.get('user_name');
	var user_id = svcqst.get('user_id');
	var user_email = svcqst.get('user_email');
	var user_tel = svcqst.get('user_tel');
	var user_hp = svcqst.get('user_hp');
	var treat_id = svcqst.get('treat_id');
	var treat_name = svcqst.get('treat_name');
	var treat_email = svcqst.get('treat_email');
	var treat_hp = svcqst.get('treat_hp');
	var treat_tel = svcqst.get('treat_tel');
	var rqst_title = svcqst.get('rqst_title');
	var rqst_content = svcqst.get('rqst_content');
	var require_date = svcqst.get('require_date');
	function date(date){
		 return date.substring(0,10);
	 }
    
	var lineGap = 30;
	var planItems = [];
	
		planItems.push({
				xtype: 'hiddenfield',
	     		id : 'treat_uid',
	    		name : 'treat_uid',
	    		value : selectedUid
	    	});
		planItems.push({
				xtype: 'hiddenfield',
	     		id : 'treat_id',
	    		name : 'treat_id',
	    		value : selectedId
	    	});
		planItems.push({
				xtype: 'hiddenfield',
				id : 'treat_name',
	    		name : 'treat_name',
	    		value : selectedName
	    	});
		planItems.push({
				xtype: 'hiddenfield',
	    		id : 'treat_email',
	    		name : 'treat_email',
	    		value : selectedEmail
	    	});
		planItems.push({
				xtype: 'hiddenfield',
	    		id : 'treat_hp',
	    		name : 'treat_hp',
	    		value : selectedHp
	    	});
		planItems.push({
				xtype: 'hiddenfield',
	    		id : 'treat_tel',
	    		name : 'treat_tel',
	    		value : selectedTelNo
	    	});
		planItems.push({
				xtype: 'hiddenfield',
	    		id : 'state',
	    		name : 'state',
	    		value : 'P'
	    	});
		planItems.push({
			 xtype: 'hiddenfield',
			 name: 'unique_id',
			 value: unique_id
		});
		planItems.push({
			xtype: 'fieldset',
           x: 5,
           y: 0,
           title: panelSRO1211,
           collapsible: false,
           defaults: {
               labelWidth: 40,
               anchor: '100%',
               layout: {
                   type: 'hbox',
                   defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
               }
           },
           items: [

	                {
	                    xtype : 'fieldcontainer',
	                    combineErrors: true,
	                    msgTarget: 'side',
	                    defaults: {
	                        hideLabel: true
	                    },
	                    items : [
	                             {
										xtype: 'textfield',
										value : user_id,
										name : 'selectedId',
										id : 'selectedId',
										fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
										width: 220,
										readOnly : true,
										allowBlank: false
	                             },{
										xtype: 'textfield',
										value : user_name,
										name : 'selectedName',
										id : 'selectedName',
										fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
										width: 220,
										readOnly : true,
										allowBlank: false
		                         },{
										xtype: 'textfield',
										value : date(require_date),
										name : 'require_date',
										id : 'require_date',
										fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
										width: 220,
										readOnly : true,
										allowBlank: false
		                         }
		                ]
		                }
			]
			});
		planItems.push({
            fieldLabel: cis41_rqst_title,
            xtype: 'textfield',
            value : rqst_title,
            x: 5,
            y: 0 + 3*lineGap,
            name: 'rqst_title',
            readOnly: true,
            anchor: '-5',  // anchor width by percentage
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
        });
		planItems.push({
            fieldLabel: cis41_rqst_content,
            xtype: 'textarea',
            x: 5,
            y: 0 + 4*lineGap,
            height: 120,
            value : rqst_content,
            name: 'rqst_content',
            readOnly: true,
            anchor: '-5',  // anchor width by percentage
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
        });
		planItems.push({
        	name:'require_date',
        	value : date(require_date),
        	format: 'Y-m-d',
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	fieldLabel: cis41_require_date,
            readOnly: true,
        	xtype: 'datefield',
        	x: 5,
            y: 0 + 11*lineGap,
            anchor: '-5'
        });
		planItems.push({
            fieldLabel: cis41_treat_plan,
            xtype: 'textarea',
            height: 120,
            x: 5,
            y: 0 + 12*lineGap,
            name: 'treat_plan',
            anchor: '-5'  // anchor width by percentage
        });
		var checkboxItem =[];
		attachedFileStore.each(function(record){
			console_log(record);
			console_log('----------------------------------------------');
			console_log(record.get('object_name'));
			console_log(record.get('id'));
			console_log(record.get('group_code'));
			console_log(record.get('file_path'));
			console_log(record.get('file_size'));
			console_log(record.get('fileobject_uid'));
			console_log(record.get('file_ext'));
			checkboxItem.push({
	            xtype: 'checkboxfield',
	            name: 'deleteFiles',
	            boxLabel: record.get('object_name') + '(' + record.get('file_size') +')',
	            checked: false,
	            inputValue: record.get('id')
			});
		});
		if(checkboxItem.length > 0) {
			
			planItems.push({
		        xtype: 'checkboxgroup',
		        allowBlank: true,
		        fieldLabel: 'Check to Delete',
		        items:checkboxItem
		    });
		}
		planItems.push({
        	x: 5,
            y: 0 + 18*lineGap,
            xtype: 'filefield',
            emptyText: panelSRO1149,
            buttonText: 'upload',
            allowBlank: true,
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '100%'
        });
		var form = Ext.create('Ext.form.Panel', {
			id: 'formPanel',
	        defaultType:  'textfield',
	        border: false,
	        bodyPadding: 15,
	        defaults: {
	            anchor: '100%',
	            allowBlank: false,
	            msgTarget: 'side',
	            labelWidth: 100
	        },
	        items: planItems
		});
	return form;
}

function createFinishForm(svcqst, attachedFileStore){
	
	var unique_id = svcqst.get('unique_id');
	var treat_id = svcqst.get('treat_id');
	var treat_name = svcqst.get('treat_name');
	var rqst_title = svcqst.get('rqst_title');
	var rqst_content = svcqst.get('rqst_content');
	var require_date = svcqst.get('require_date');
	var treat_plan = svcqst.get('treat_plan');
	function date(date){
		 return date.substring(0,10);
	 }
    
	var lineGap = 30;
	var finishItems = [];
	
	finishItems.push({
        	xtype: 'hiddenfield',
     		id : 'treat_uid',
    		name : 'treat_uid',
    		value : selectedUid
    	});
	finishItems.push({
    		xtype: 'hiddenfield',
     		id : 'treat_id',
    		name : 'treat_id',
    		value : selectedId
    	});
	finishItems.push({
    		xtype: 'hiddenfield',
    		id : 'treat_name',
    		name : 'treat_name',
    		value : selectedName
    	});
	finishItems.push({
    		xtype: 'hiddenfield',
    		id : 'treat_email',
    		name : 'treat_email',
    		value : selectedEmail
    	});
	finishItems.push({
    		xtype: 'hiddenfield',
    		id : 'treat_hp',
    		name : 'treat_hp',
    		value : selectedHp
    	});
	finishItems.push({
    		xtype: 'hiddenfield',
    		id : 'treat_tel',
    		name : 'treat_tel',
    		value : selectedTelNo
    	});
	finishItems.push({
    		xtype: 'hiddenfield',
    		id : 'state',
    		name : 'state',
    		value : 'F'
    	});
	finishItems.push({
			 xtype: 'hiddenfield',
			 name: 'unique_id',
			 value: unique_id
		});
	finishItems.push({
			xtype: 'fieldset',
           x: 5,
           y: 0,
           title: panelSRO1211,
           collapsible: false,
           defaults: {
               labelWidth: 40,
               anchor: '100%',
               layout: {
                   type: 'hbox',
                   defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
               }
           },
           items: [

	                {
	                    xtype : 'fieldcontainer',
	                    combineErrors: true,
	                    msgTarget: 'side',
	                    defaults: {
	                        hideLabel: true
	                    },
	                    items : [
	                             {
										xtype: 'textfield',
										value : treat_id,
										name : 'selectedId',
										id : 'selectedId',
										fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
										width: 220,
										readOnly : true,
										allowBlank: false
	                             },{
										xtype: 'textfield',
										value : treat_name,
										name : 'selectedName',
										id : 'selectedName',
										fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
										width: 220,
										readOnly : true,
										allowBlank: false
		                         },{
										xtype: 'textfield',
										value : date(require_date),
										name : 'require_date',
										id : 'require_date',
										fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
										width: 220,
										readOnly : true,
										allowBlank: false
		                         }
		                ]
		                }
			]
			});
	finishItems.push({
            fieldLabel: cis41_rqst_title,
            xtype: 'textfield',
            value : rqst_title,
            x: 5,
            y: 0 + 3*lineGap,
            name: 'rqst_title',
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
            readOnly: true,
            anchor: '-5'  // anchor width by percentage
        });
	finishItems.push({
            fieldLabel: cis41_rqst_content,
            xtype: 'textarea',
            x: 5,
            y: 0 + 4*lineGap,
            height: 120,
            value : rqst_content,
            name: 'rqst_content',
            readOnly: true,
            anchor: '-5',  // anchor width by percentage
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
        });
	
	var checkboxItem =[];
	attachedFileStore.each(function(record){
		console_log(record);
		console_log('----------------------------------------------');
		console_log(record.get('object_name'));
		console_log(record.get('id'));
		console_log(record.get('group_code'));
		console_log(record.get('file_path'));
		console_log(record.get('file_size'));
		console_log(record.get('fileobject_uid'));
		console_log(record.get('file_ext'));
		
		checkboxItem.push({
            xtype: 'checkboxfield',
            name: 'deleteFiles',
            boxLabel: record.get('object_name') + '(' + record.get('file_size') +')',
            checked: false,
            inputValue: record.get('id')
		});
	});
	
	if(checkboxItem.length > 0) {
	
		finishItems.push({
	        xtype: 'checkboxgroup',
	        allowBlank: true,
	        fieldLabel: 'Check to Delete',
	        items:checkboxItem
	    });
	}
	finishItems.push({
        	x: 5,
            y: 0 + 12*lineGap,
            xtype: 'filefield',
            emptyText: panelSRO1149,
            buttonText: 'upload',
            allowBlank: true,
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '100%'
        });
	finishItems.push({
        	name: 'require_date',
        	value : date(require_date),
        	format: 'Y-m-d',
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	fieldLabel: cis41_require_date,
            readOnly: true,
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
        	xtype: 'datefield',
        	x: 5,
            y: 0 + 12*lineGap,
            anchor: '-5'
        });
	finishItems.push({
            fieldLabel: cis41_treat_plan,
            xtype: 'textarea',
            x: 5,
            y: 0 + 13*lineGap,
            height: 120,
            value : treat_plan + "\n" + "-------------------------------------------------------------------------" + "\n",
            name: 'treat_plan',
            anchor: '-5'  // anchor width by percentage
        });
	finishItems.push({
            fieldLabel: cis41_treat_report,
            xtype: 'textarea',
            x: 5,
            y: 0 + 20*lineGap,
            height: 120,
            name: 'treat_report',
            anchor: '-5'  // anchor width by percentage
        });
	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
        defaultType:  'textfield',
        border: false,
        height: 500,
        bodyPadding: 15,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        items: finishItems
	});
	return form;
}

function createEditForm(svcqst){
	
	var unique_id = svcqst.get('unique_id');
	var user_name = svcqst.get('user_name');
	var state = svcqst.get('state');
	var rqst_title = svcqst.get('rqst_title');
	var rqst_content = svcqst.get('rqst_content');
	var require_date = svcqst.get('require_date');
	function date(date){
		 return date.substring(0,10);
	 }
    
	var lineGap = 30;
	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
        layout: 'absolute',
        url: 'save-form.php',
        border: false,
         items: [ new Ext.form.Hidden({
     		id : 'user_id',
    		name : 'user_id',
    		value : selectedUid
    	}),new Ext.form.Hidden({
    		id : 'user_email',
    		name : 'user_email',
    		value : selectedEmail
    	}),new Ext.form.Hidden({
    		id : 'user_hp',
    		name : 'user_hp',
    		value : selectedHp
    	}),new Ext.form.Hidden({
    		id : 'user_tel',
    		name : 'user_tel',
    		value : selectedTelNo
    	}),new Ext.form.Hidden({
    		id : 'unique_id',
    		name : 'unique_id',
    		value : unique_id
    	}),
                  {
	            xtype: 'fieldset',
	            x: 5,
	            y: 3 + 0*lineGap,
	            title: panelSRO1139,
	            collapsible: false,
	            defaults: {
	                labelWidth: 40,
	                anchor: '100%',
	                layout: {
	                    type: 'hbox',
	                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                }
	            },
	            items: [
{
xtype : 'fieldcontainer',
combineErrors: true,
msgTarget: 'side',
fieldLabel: 'user',
defaults: {
    hideLabel: true
},
items : [   
{
	fieldLabel: getColName('user_name'),
	id :'user_name',
	name : 'user_name',
	xtype: 'combo',
	value : user_name,
	x: 5,
	y: 0 + 1*lineGap,
	store: UserStore,
	emptyText:   'Users', //getColName('buyer_name'),
	displayField:   'user_name',
	valueField:     'user_name',
	typeAhead: false,
	hideLabel: true,
	minChars: 2,
	width: 200,
	listConfig:{
      loadingText: 'Searching...',
      emptyText: 'No matching posts found.',
      // Custom rendering template for each item
      getInnerTpl: function() {
          return '<div data-qtip="{user_id}">{user_name}</div>';
      }			                	
  },
  listeners: {
  	select: function (combo, record) {
      		console_log('email :' + record[0].get('email'));
      		console_log('tel_no :' + record[0].get('tel_no'));
      		console_log('hp_no :' + record[0].get('hp_no'));
      		console_log('user_id :' + record[0].get('user_id'));
      		selectedUid = record[0].get('user_id');
      		selectedEmail = record[0].get('email');
      		selectedHp = record[0].get('hp_no');
      		selectedTelNo = record[0].get('tel_no');
      		Ext.getCmp('user_id').setValue(selectedUid);
      		Ext.getCmp('user_email').setValue(selectedEmail);
      		Ext.getCmp('user_hp').setValue(selectedHp);
      		Ext.getCmp('user_tel').setValue(selectedTelNo);
  	}
  }
  },{
      xtype: 'displayfield',
      value: 'state'
   },{
	   x: 5,
       y: 20 + 3*lineGap,
       width:          80,
       id:           'state',
       name:           'state',
       value : state,
       xtype:          'combo',
       mode:           'local',
       editable:       false,
       allowBlank: false,
       queryMode: 'remote',
       displayField:   'codeName',
       valueField:     'codeName',
       value:          '[R]요청',
       triggerAction:  'all',
       fieldLabel: getColName('state'),
      store: commonStateStore,
       listConfig:{
       	getInnerTpl: function(){
       		return '<div data-qtip="{systemCode}">{codeName}</div>';
       	}			                	
       },
           listeners: {
                select: function (combo, record) {
                	console_log('Selected Value : ' + combo.getValue());
                	var systemCode = record[0].get('systemCode');
                	var codeNameEn  = record[0].get('codeNameEn');
                	var codeName  = record[0].get('codeName');
                	console_log('systemCode : ' + systemCode 
                			+ ', codeNameEn=' + codeNameEn
                			+ ', codeName=' + codeName	);
                	Ext.getCmp('state').setValue(systemCode);
                }
           }
   }
  ]
  }
  ]
},
       {
            fieldLabel: 'rqst_title',
            xtype: 'textfield',
            value : rqst_title,
            x: 5,
            y: 0 + 3*lineGap,
            name: 'rqst_title',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: 'rqst_content',
            xtype: 'textarea',
            x: 5,
            y: 0 + 4*lineGap,
            value : rqst_content,
            name: 'rqst_content',
            anchor: '-5'  // anchor width by percentage
        },{
        	name:'require_date',
        	value : date(require_date),
        	format: 'Y-m-d',
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	fieldLabel: 'date',
        	xtype: 'datefield',
        	x: 5,
            y: 0 + 9*lineGap,
            anchor: '-5'
        }
        ]
    });
	return form;
}

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			SvcQst.load(unique_id ,{
        				 success: function(svcqst) {

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
        				            width: 700,
        				            height: 500,
        				            minWidth: 250,
        				            minHeight: 180,
        				            layout: 'absolute',
        				            plain:true,
        				            items: createViewForm(svcqst),
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

//writer define
Ext.define('SvcQst.writer.SinglePost', {
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
	           	var svcqst = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'SvcQst');
        		
	           	svcqst.destroy( {
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
    handler: function(widget, event) {

    	var uploadPanel = getCommonFilePanel('CREATE', 0, 300, '100%', 80, 30, '');
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            border: false,
             items: [ new Ext.form.Hidden({
         		id : 'user_id',
        		name : 'user_id',
        		value : selectedUid
        	}),new Ext.form.Hidden({
        		id : 'user_email',
        		name : 'user_email',
        		value : selectedEmail
        	}),new Ext.form.Hidden({
        		id : 'user_hp',
        		name : 'user_hp',
        		value : selectedHp
        	}),new Ext.form.Hidden({
        		id : 'user_tel',
        		name : 'user_tel',
        		value : selectedTelNo
        	}),
                      {
 	            xtype: 'fieldset',
 	            x: 5,
 	            y: 3 + 0*lineGap,
 	            title: panelSRO1139,
 	            collapsible: false,
 	            defaults: {
 	                labelWidth: 40,
 	                anchor: '100%',
 	                layout: {
 	                    type: 'hbox',
 	                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
 	                }
 	            },
 	            items: [
{
    xtype : 'fieldcontainer',
    combineErrors: true,
    msgTarget: 'side',
    fieldLabel: 'user',
    defaults: {
        hideLabel: true
    },
    items : [   
{
		fieldLabel: getColName('user_name'),
		id :'user_name',
		name : 'user_name',
		xtype: 'combo',
		x: 5,
		y: 0 + 1*lineGap,
		store: userStore,
		emptyText:   'Users', //getColName('buyer_name'),
		displayField:   'user_name',
		valueField:     'user_name',
		typeAhead: false,
		hideLabel: true,
		minChars: 2,
		//hideTrigger:true,
		width: 200,
		listConfig:{
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          // Custom rendering template for each item
          getInnerTpl: function() {
              return '<div data-qtip="{user_id}">{user_name}</div>';
          }			                	
      },
      listeners: {
      	select: function (combo, record) {
	      		console_log('email :' + record[0].get('email'));
	      		console_log('tel_no :' + record[0].get('tel_no'));
	      		console_log('hp_no :' + record[0].get('hp_no'));
	      		console_log('user_id :' + record[0].get('user_id'));
	      		selectedUid = record[0].get('user_id');
	      		selectedEmail = record[0].get('email');
	      		selectedHp = record[0].get('hp_no');
	      		selectedTelNo = record[0].get('tel_no');
	      		Ext.getCmp('user_id').setValue(selectedUid);
	      		Ext.getCmp('user_email').setValue(selectedEmail);
	      		Ext.getCmp('user_hp').setValue(selectedHp);
	      		Ext.getCmp('user_tel').setValue(selectedTelNo);
      	}
      }
      },{
          xtype: 'displayfield',
          value: 'state'
       },{
    	   x: 5,
           y: 20 + 3*lineGap,
           width:          80,
           id:           'state',
           name:           'state',
           xtype:          'combo',
           mode:           'local',
           editable:       false,
           allowBlank: false,
           queryMode: 'remote',
           displayField:   'codeName',
           valueField:     'codeName',
           value:          '[R]요청',
           triggerAction:  'all',
           fieldLabel: getColName('state'),
          store: commonStateStore,
           listConfig:{
           	getInnerTpl: function(){
           		return '<div data-qtip="{systemCode}">{codeName}</div>';
           	}			                	
           },
               listeners: {
                    select: function (combo, record) {
                    	console_log('Selected Value : ' + combo.getValue());
                    	var systemCode = record[0].get('systemCode');
                    	var codeNameEn  = record[0].get('codeNameEn');
                    	var codeName  = record[0].get('codeName');
                    	console_log('systemCode : ' + systemCode 
                    			+ ', codeNameEn=' + codeNameEn
                    			+ ', codeName=' + codeName	);
                    	Ext.getCmp('state').setValue(systemCode);
                    }
               }
       }
      ]
      }
      ]
	},
           {
                fieldLabel: 'rqst_title',
                xtype: 'textfield',
                x: 5,
                y: 0 + 3*lineGap,
                name: 'rqst_title',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'rqst_content',
                xtype: 'textarea',
                x: 5,
                y: 0 + 4*lineGap,
                name: 'rqst_content',
                anchor: '-5'  // anchor width by percentage
            },{
            	name:'require_date',
            	format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            	fieldLabel: 'date',
            	xtype: 'datefield',
            	x: 5,
                y: 0 + 9*lineGap,
                anchor: '-5'
            }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ', 
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
                   	 var svcqst = Ext.ModelManager.create(val, 'SvcQst');
            		//저장 수정
                   	svcqst.save({
                		success : function() {
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {
                           			if(uploadPanel!=null) {
	                        				uploadPanel.destroy();
	                        			}
                           		});
                           	}   	
                		} 
                	 });
                	 
                       	if(win) 
                       	{
                       		win.close();
                       		if(uploadPanel!=null) {
	                				uploadPanel.destroy();
	                			}
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    	if(uploadPanel!=null) {
            				uploadPanel.destroy();
            			}
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} 
            		if(uploadPanel!=null) {
        				uploadPanel.destroy();
        			}
            	}
            }]
        });
		win.show(this, function() {
		});
     }
});

var planHandler = function() {
	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
	
	attachedFileStore.load(function() {
	SvcQst.load(unique_id ,{
		 success: function(svcqst) {
		        var win = Ext.create('ModalWindow', {
		        	title: CMD_PLAN  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 700,
		            height: 580,
		            minWidth: 250,
		            minHeight: 180,
		            layout: 'fit',
		            plain:true,
		            items: createPlanForm(svcqst, attachedFileStore),
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);
		                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
		                	var svcqst = Ext.ModelManager.create(val, 'SvcQst');
		                	form.submit({
		                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
		                        waitMsg: 'Uploading Files...',
		                        success: function(fp, o) {
		            		//저장 수정
		                	svcqst.save({
		                		success : function() {
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		store.load(function() {});
		                           	} 
		                		}, failure : function(){
		                			win.close();
		                		} 
		                	 });
		                        },
		                        failure : function(){
		                        	console_log('failure');
		                        	Ext.Messageox.alert(error_msg_prompt,'Failed');
		                        }
		                        });
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
				//endofwin
		 }//endofsuccess
	 });//emdofload
	});
};

var finishHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );

	attachedFileStore.load(function() {
	SvcQst.load(unique_id ,{
		 success: function(svcqst) {
		        var win = Ext.create('ModalWindow', {
		        	title: CMD_FINISH  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 700,
		            height: 640,
		            minWidth: 250,
		            minHeight: 180,
		            layout: 'fit',
		            plain:true,
		            items: createFinishForm(svcqst, attachedFileStore),
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);
		                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
		                	var svcqst = Ext.ModelManager.create(val, 'SvcQst');
		                	form.submit({
		                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
		                        waitMsg: 'Uploading Files...',
		                        success: function(fp, o) {
		            		//저장 수정
		                	svcqst.save({
		                		success : function() {
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		store.load(function() {});
		                           	} 
		                		}, failure : function(){
		                			win.close();
		                		}
		                	 });
		                        },
		                        failure : function(){
		                    		console_log('failure');
		                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
		                    	}
		                       	}); 
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
				//endofwin
		 }//endofsuccess
	 });//emdofload
	});
};

var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	attachedFileStore.load(function() {
	SvcQst.load(unique_id ,{
		 success: function(svcqst) {
		        var win = Ext.create('ModalWindow', {
		        	title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 700,
		            height: 500,
		            minWidth: 250,
		            minHeight: 180,
		            layout: 'fit',
		            plain:true,
		            items: createEditForm(svcqst),
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);
		                	var svcqst = Ext.ModelManager.create(val, 'SvcQst');
		            		//저장 수정
		                	svcqst.save({
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
				//endofwin
		 }//endofsuccess
	 });//emdofload
	});
};

var planAction = Ext.create('Ext.Action', {
	itemId: 'planButton',
    iconCls: 'pencil',
    text: CMD_PLAN,
    disabled: true ,
    handler: planHandler
});

var finishAction = Ext.create('Ext.Action', {
	itemId: 'finishButton',
    iconCls: 'complete',
    text: CMD_FINISH,
    disabled: true ,
    handler: finishHandler
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

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ /*detailAction, */planAction, finishAction]
});

Ext.onReady(function() {  
	//alert("ok");
//	console_log('now starting...');
	var searchField = [];
	
	commonStateStore  = Ext.create('Mplm.store.CommonStateStore', {hasNull: false} );
	UserStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
	
	searchField.push('unique_id');
	searchField.push('rqst_title');
	searchField.push('user_name');
	searchField.push('user_id');
	makeSrchToolbar(searchField);
	
	 //SvcQst Store 정의
	
	Ext.define('SvcQst', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/collab/svcqst.do?method=read', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/collab/svcqst.do?method=create', /*create record, update*/
		            update: CONTEXT_PATH + '/collab/svcqst.do?method=create',
		            destroy: CONTEXT_PATH + '/collab/svcqst.do?method=destroy' /*delete*/
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
		model: 'SvcQst',
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
			                    , '-', planAction, '-', finishAction,
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
			                }
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
			            	planAction.disable();
			            	finishAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
			            	planAction.enable();
			            	finishAction.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	planAction.disable();
			            	finishAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	planAction.disable();
			            	finishAction.disable();
		            	}
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		    
	}); //store load
 	cenerFinishCallback();//Load Ok Finish Callback
 	 	
});	//OnReady

