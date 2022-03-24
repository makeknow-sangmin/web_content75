/**
 * CIS41 : 나의이슈(요청)
 */

//global var.
var grid = null;
var store = null;
var selectedUid = '';
var selectedId = '';
var selectedName = '';
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

function createReOpenForm(svcqst, attachedFileStore){
	
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
	var treat_plan = svcqst.get('treat_plan');
	var treat_report = svcqst.get('treat_report');
	function date(date){
		 return date.substring(0,10);
	 }
    
	var lineGap = 30;
	var reOpenItems = [];
	
		reOpenItems.push({
	     		id : 'treat_uid',
	    		name : 'treat_uid',
	    		xtype: 'hiddenfield',
	    		value : selectedUid
	    	});
		reOpenItems.push({
	     		id : 'treat_id',
	    		name : 'treat_id',
	    		xtype: 'hiddenfield',
	    		value : selectedId
	    	});
		reOpenItems.push({
	    		id : 'treat_name',
	    		name : 'treat_name',
	    		xtype: 'hiddenfield',
	    		value : selectedName
	    	});
		reOpenItems.push({
	    		id : 'treat_email',
	    		name : 'treat_email',
	    		xtype: 'hiddenfield',
	    		value : selectedEmail
	    	});
		reOpenItems.push({
	    		id : 'treat_hp',
	    		name : 'treat_hp',
	    		xtype: 'hiddenfield',
	    		value : selectedHp
	    	});
		reOpenItems.push({
	    		id : 'treat_tel',
	    		name : 'treat_tel',
	    		xtype: 'hiddenfield',
	    		value : selectedTelNo
	    	});
		reOpenItems.push({
	    		id : 'state',
	    		name : 'state',
	    		xtype: 'hiddenfield',
	    		value : 'Q'
	    	});
		reOpenItems.push({
			 xtype: 'hiddenfield',
			 name: 'unique_id',
			 value: unique_id
		});
		reOpenItems.push({
			xtype: 'fieldset',
            x: 5,
            y: 0,
            title: panelSRO1210,
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
		reOpenItems.push({
            fieldLabel: cis41_rqst_title,
            xtype: 'textfield',
            value : rqst_title,
            x: 5,
            y: 0 + 3*lineGap,
            name: 'rqst_title',
            readOnly: true,
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
            anchor: '-5'  // anchor width by percentage
        });
		reOpenItems.push({
            fieldLabel: cis41_rqst_content,
            height: 120,
            xtype: 'textarea',
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
            x: 5,
            y: 0 + 4*lineGap,
            value : rqst_content,
            name: 'rqst_content',
            readOnly: true,
            anchor: '-5'  // anchor width by percentage
        });
		reOpenItems.push({
        	name:'require_date',
        	value : date(require_date),
        	format: 'Y-m-d',
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	fieldLabel: cis41_require_date,
        	fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
            readOnly: true,
        	xtype: 'datefield',
        	x: 5,
            y: 0 + 11*lineGap,
            anchor: '-5'
        });
		reOpenItems.push({
            fieldLabel: cis41_treat_plan,
            xtype: 'textarea',
            height: 120,
            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
            x: 5,
            y: 0 + 12*lineGap,
            value : treat_plan,
            readOnly: true,
            name: 'treat_plan',
            anchor: '-5'  // anchor width by percentage
        });
		reOpenItems.push({
            fieldLabel: cis41_treat_report,
            xtype: 'textarea',
            height: 120,
            x: 5,
            y: 0 + 19*lineGap,
            value : treat_report + "\n" + "---------------------------------------------------------------------------------------------------------------------------------------" + "\n",
            name: 'treat_report',
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
		
			reOpenItems.push({
		        xtype: 'checkboxgroup',
		        allowBlank: true,
		        fieldLabel: 'Check to Delete',
		        items:checkboxItem
		    });
		}
		reOpenItems.push({
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
	        defaultType: 'textfield',
	        border: false,
	        bodyPadding: 15,
	        defaults: {
	            anchor: '100%',
	            allowBlank: false,
	            msgTarget: 'side',
	            labelWidth: 100
	        },
	        items: reOpenItems
		});
		
	return form;
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
                fieldStyle: 'height:300; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                readOnly: true,
                anchor: '100%'
            }  
		    ]
    }); //endof form
	
	return form;
}

function createEditForm(svcqst, attachedFileStore){
	
	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
	
	var unique_id = svcqst.get('unique_id');
	var treat_name = svcqst.get('treat_name');
	var rqst_title = svcqst.get('rqst_title');
	var rqst_content = svcqst.get('rqst_content');
	function date(date){
		 return date.substring(0,10);
	 }
	var lineGap = 30;
	var myItems = [];
	
	myItems.push({
     		id : 'treat_uid',
    		name : 'treat_uid',
    		xtype: 'hiddenfield',
    		value : selectedUid
    	});
	myItems.push({
     		id : 'treat_id',
    		name : 'treat_id',
    		xtype: 'hiddenfield',
    		value : selectedId
    	});
	myItems.push({
    		id : 'treat_name',
    		name : 'treat_name',
    		xtype: 'hiddenfield',
    		value : selectedName
    	});
	myItems.push({
    		id : 'treat_email',
    		name : 'treat_email',
    		xtype: 'hiddenfield',
    		value : selectedEmail
    	});
	myItems.push({
    		id : 'treat_hp',
    		name : 'treat_hp',
    		xtype: 'hiddenfield',
    		value : selectedHp
    	});
	myItems.push({
    		id : 'treat_tel',
    		name : 'treat_tel',
    		xtype: 'hiddenfield',
    		value : selectedTelNo
    	});
	myItems.push({
    		id : 'state',
    		name : 'state',
    		xtype: 'hiddenfield',
    		value : 'R'
    	});
	myItems.push({
		id : 'unique_id',
		name : 'unique_id',
		xtype: 'hiddenfield',
		value : unique_id
	});
	myItems.push({
            xtype: 'textfield',
            x: 5,
            y: 0 ,
            emptyText: cis41_rqst_title,
            value: rqst_title,
            name: 'rqst_title',
            anchor: '-5'  // anchor width by percentage
        });
	myItems.push({
            xtype: 'textarea',
            height: 230,
            x: 5,
            y: 0 + 1*lineGap,
            emptyText: cis41_rqst_content,
            value: rqst_content,
            name: 'rqst_content',
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
	
		myItems.push({
	        xtype: 'checkboxgroup',
	        allowBlank: true,
	        fieldLabel: 'Check to Delete',
	        items:checkboxItem
	    });
	}
	
	myItems.push({
        	x: 5,
            y: 0 + 10*lineGap,
            xtype: 'filefield',
            emptyText: panelSRO1149,
            buttonText: 'upload',
            allowBlank: true,
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '100%'
        });
	
	myItems.push({
	fieldLabel: cis41_worker_name,
	id :'user_names',
	name : 'user_name',
	xtype: 'combo',
	x: 5,
	y: 0 + 11*lineGap,
	store: userStore,
	emptyText:   cis41_worker_name,
	displayField:   'user_name',
	valueField:     'treat_name',
	value: treat_name,
	typeAhead: false,
	hideLabel: true,
	minChars: 2,
	width: 670,
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
      		console_log('unique_id :' + record[0].get('unique_id'));
      		console_log('user_name :' + record[0].get('user_name'));
      		selectedUid = record[0].get('unique_id');
      		selectedId = record[0].get('user_id');
      		selectedName = record[0].get('user_name');
      		selectedEmail = record[0].get('email');
      		selectedHp = record[0].get('hp_no');
      		selectedTelNo = record[0].get('tel_no');
      		Ext.getCmp('treat_uid').setValue(selectedUid);
      		Ext.getCmp('treat_id').setValue(selectedId);
      		Ext.getCmp('treat_name').setValue(selectedName);
      		Ext.getCmp('treat_email').setValue(selectedEmail);
      		Ext.getCmp('treat_hp').setValue(selectedHp);
      		Ext.getCmp('treat_tel').setValue(selectedTelNo);
  	}
  }
  });
	myItems.push({
        	name: 'require_date',
        	format: 'Y-m-d',
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	fieldLabel: cis41_require_date,
        	value: Ext.Date.add (new Date(),Ext.Date.DAY,0),
        	xtype: 'datefield',
        	x: 5,
            y: 0 + 12*lineGap,
            anchor: '-5'
        });
	myItems.push({
            fieldLabel: cis41_user_id,
            xtype: 'textfield',
            x: 5,
            y: 0 + 13*lineGap,
            name: 'user_id',
            value: vCUR_USER_ID,
            anchor: '-5'  // anchor width by percentage
        });
	myItems.push({
            fieldLabel: cis41_user_name,
            xtype: 'textfield',
            x: 5,
            y: 0 + 14*lineGap,
            name: 'user_name',
            value: vCUR_USER_NAME,
            anchor: '-5'  // anchor width by percentage
        });
	myItems.push({
            fieldLabel: cis41_user_email,
            xtype: 'textfield',
            x: 5,
            y: 0 + 15*lineGap,
            name: 'user_email',
            value: vCUR_EMAIL,
            anchor: '-5'  // anchor width by percentage
	});
	myItems.push({
            fieldLabel: cis41_user_tel,
            xtype: 'textfield',
            x: 5,
            y: 0 + 16*lineGap,
            name: 'user_tel',
            value: '',
            anchor: '-5'  // anchor width by percentage
        });
	myItems.push({
            fieldLabel: cis41_user_hp,
            xtype: 'textfield',
            x: 5,
            y: 0 + 17*lineGap,
            name: 'user_hp',
            value: '',
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
        items: myItems
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
        				            height: 530,
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

//Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: CMD_ADD,
    handler: function(widget, event) {
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
		var lineGap = 30;
		var inputItem= [];
		
            inputItem.push({
         		id : 'treat_uid',
        		name : 'treat_uid',
        		xtype: 'hiddenfield',
        		value : selectedUid
        	});
    	
	    	inputItem.push({
	     		id : 'treat_id',
	    		name : 'treat_id',
	    		xtype: 'hiddenfield',
	    		value : selectedId
	    	});
	    	
	    	inputItem.push({
	    		id : 'treat_name',
	    		name : 'treat_name',
	    		xtype: 'hiddenfield',
	    		value : selectedName
	    	});

	    	inputItem.push({
        			id : 'treat_email',
        			name : 'treat_email',
        			xtype: 'hiddenfield',
        			value : selectedEmail
        	});
	    	
	    	inputItem.push({
	    		id : 'treat_hp',
	    		name : 'treat_hp',
	    		xtype: 'hiddenfield',
	    		value : selectedHp
	    	});
	    	
	    	inputItem.push({
	    		id : 'treat_tel',
	    		name : 'treat_tel',
	    		xtype: 'hiddenfield',
	    		value : selectedTelNo
	    	});
	    	
	    	inputItem.push({
	    		id : 'state',
	    		name : 'state',
	    		xtype: 'hiddenfield',
	    		value : 'R'
	    	});
	    	
	    	inputItem.push({
                xtype: 'textfield',
                x: 5,
                y: 0 ,
                emptyText: cis41_rqst_title,
                name: 'rqst_title',
                anchor: '-5'  // anchor width by percentage
            });
	    	inputItem.push({
                xtype: 'textarea',
                height: 230,
                x: 5,
                y: 0 + 1*lineGap,
                emptyText: cis41_rqst_content,
                name: 'rqst_content',
                anchor: '-5'  // anchor width by percentage
            });
	    	
	    	inputItem.push({
            	x: 5,
                y: 0 + 10*lineGap,
	            xtype: 'filefield',
	            emptyText: panelSRO1149,
	            buttonText: 'upload',
	            allowBlank: true,
	            buttonConfig: {
	                iconCls: 'upload-icon'
	            },
	            anchor: '100%'
	        });
	    	
	    	inputItem.push({
				fieldLabel: cis41_worker_name,
				id :'user_names',
				name : 'user_name',
				xtype: 'combo',
				x: 5,
				y: 0 + 11*lineGap,
				store: userStore,
				emptyText:   cis41_worker_name,
				displayField:   'user_name',
				valueField:     'treat_name',
				typeAhead: false,
				hideLabel: true,
				minChars: 2,
				width: 670,
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
			      		console_log('unique_id :' + record[0].get('unique_id'));
			      		console_log('user_name :' + record[0].get('user_name'));
			      		selectedUid = record[0].get('unique_id');
			      		selectedId = record[0].get('user_id');
			      		selectedName = record[0].get('user_name');
			      		selectedEmail = record[0].get('email');
			      		selectedHp = record[0].get('hp_no');
			      		selectedTelNo = record[0].get('tel_no');
			      		Ext.getCmp('treat_uid').setValue(selectedUid);
			      		Ext.getCmp('treat_id').setValue(selectedId);
			      		Ext.getCmp('treat_name').setValue(selectedName);
			      		Ext.getCmp('treat_email').setValue(selectedEmail);
			      		Ext.getCmp('treat_hp').setValue(selectedHp);
			      		Ext.getCmp('treat_tel').setValue(selectedTelNo);
		      	}
		      }
		      });
	    	inputItem.push({
            	name: 'require_date',
            	format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            	fieldLabel: cis41_require_date,
            	value: Ext.Date.add (new Date(),Ext.Date.DAY,0),
            	xtype: 'datefield',
            	x: 5,
                y: 0 + 12*lineGap,
                anchor: '-5'
            });
	    	inputItem.push({
                fieldLabel: cis41_user_id,
                xtype: 'textfield',
                x: 5,
                y: 0 + 13*lineGap,
                name: 'user_id',
                value: vCUR_USER_ID,
                anchor: '-5'  // anchor width by percentage
            });
	    	inputItem.push({
                fieldLabel: cis41_user_name,
                xtype: 'textfield',
                x: 5,
                y: 0 + 14*lineGap,
                name: 'user_name',
                value: vCUR_USER_NAME,
                anchor: '-5'  // anchor width by percentage
            });
	    	inputItem.push({
                fieldLabel: cis41_user_email,
                xtype: 'textfield',
                x: 5,
                y: 0 + 15*lineGap,
                name: 'user_email',
                value: vCUR_EMAIL,
                anchor: '-5'  // anchor width by percentage
            });
	    	inputItem.push({
                fieldLabel: cis41_user_tel,
                xtype: 'textfield',
                x: 5,
                y: 0 + 16*lineGap,
                name: 'user_tel',
                anchor: '-5'  // anchor width by percentage
            });
	    	inputItem.push({
                fieldLabel: cis41_user_hp,
                xtype: 'textfield',
                x: 5,
                y: 0 + 17*lineGap,
                name: 'user_hp',
                anchor: '-5'  // anchor width by percentage
            });
	    	
	    	var form = Ext.create('Ext.form.Panel', {
	    		id: 'formPanel',
	            layout: 'absolute',
	            defaultType: 'textfield',
	            border: false,
	            bodyPadding: 15,
	            defaults: {
	                anchor: '100%',
	                allowBlank: false,
	                msgTarget: 'side',
	                labelWidth: 100
	            },
	            items: inputItem
	    	});

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD   + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 700,
            height: 600,
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
                	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
                   	 var svcqst = Ext.ModelManager.create(val, 'SvcQst');
            		//저장 수정
                   	form.submit({
                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
                        waitMsg: 'Uploading Files...',
                        success: function(fp, o) {
                   	svcqst.save({
                		success : function() {
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {
                           		});
                           	}   	
                		},
                		failure: function (rec, op)  {
                          	 console_log(rec);
                          	 console_log(op);
                          	 msg('Fail', rec);
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
            		if(win) {win.close();} 
            	}
            }]
        });
        
		win.show();
     }
});

var editHandler = function() {
	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
	
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	
	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
	attachedFileStore.load(function() {

	SvcQst.load(unique_id ,{
		 success: function(svcqst) {
		        var win = Ext.create('ModalWindow', {
		        	title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 700,
		            height: 650,
		            minWidth: 250,
		            minHeight: 180,
		            modal:true,
		            layout: 'fit',
		            plain:true,
		            items: createEditForm(svcqst, attachedFileStore),
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
		            			win.close();} 
		            		}
		            }]
		        });
		        win.show();
				//endofwin
		 }//endofsuccess
	 });//emdofload
	});
};

var reopenHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	
	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
	attachedFileStore.load(function() {
	SvcQst.load(unique_id ,{
		 success: function(svcqst) {
		        var win = Ext.create('ModalWindow', {
		        	title: CMD_REOPEN  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 700,
		            height: 640,
		            minWidth: 250,
		            minHeight: 180,
		            layout: 'fit',
		            plain:true,
		            items: createReOpenForm(svcqst, attachedFileStore),
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
		                		},failure : function(){
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

var reopenAction = Ext.create('Ext.Action', {
	itemId: 'reopenButton',
    iconCls: 'reopen',
    text: CMD_REOPEN,
    disabled: true ,
    handler: reopenHandler
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
    items: [ editAction, removeAction, reopenAction]
});

Ext.onReady(function() {  
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
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	store.getProxy().setExtraParam('state', 'F');
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
			                    , '-',  addAction,  '-', removeAction, '-', reopenAction,
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
			        //renderTo: 'MAIN_DIV_TARGET'
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
			            	reopenAction.disable();
			            	detailAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
			            	reopenAction.enable();
			            	detailAction.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	reopenAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	reopenAction.disable();
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

