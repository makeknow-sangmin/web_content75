/**
 * CIS1 : 모든이슈
 */

//global var.
var grid = null;
var store = null;
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
        //layout: 'absolute',
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
//			x: 5,
//			y: 0 + 1*lineGap,
			name: 'unique_id',
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: getColName('user_id'),
			value: user_id,
//			x: 5,
//			y: 0 + 2*lineGap,
			 name: 'user_id',
			anchor: '-5'  // anchor width by percentage
			},{
		    	fieldLabel: getColName('user_name'),
		    	value: user_name,
//		    	x: 5,
//		    	y: 0 + 3*lineGap,
		    	name: 'user_name',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('state'),
		    	value: state,
//		    	x: 5,
//		    	y: 0 + 9*lineGap,
		    	name: 'state',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('require_date'),
                value: require_date,
                name: 'require_date',
                //xtype: 'htmleditor',
                readOnly: true,
                anchor: '100%'
            },{
		    	fieldLabel: getColName('rqst_title'),
                value: rqst_title,
                name: 'rqst_title',
                //xtype: 'htmleditor',
                readOnly: true,
                anchor: '100%'
            },{
                value: rqst_content,
                name: 'rqst_content',
                //xtype: 'htmleditor',
                fieldStyle: 'height:300; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                readOnly: true,
                anchor: '100%'
            }  
		    ]
    }); //endof form
	
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
//        defaultType: 'textfield',
        border: false,
//        bodyPadding: 15,
//        defaults: {
//            anchor: '100%',
//            allowBlank: false,
//            msgTarget: 'side',
//            labelWidth: 100
//        },
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
            xtype: 'htmleditor',
            fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
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
        				        //store.load(function() {});
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
            //animateTarget: 'mb4',
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
//            defaultType: 'textfield',
            border: false,
//            bodyPadding: 15,
//            defaults: {
//                anchor: '100%',
//                allowBlank: false,
//                msgTarget: 'side',
//                labelWidth: 100
//            },
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
                xtype: 'htmleditor',
                fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
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
                			//console_log('updated');
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {
                           			if(uploadPanel!=null) {
	                        				uploadPanel.destroy();
	                        			}
//                           			lfn_gotoHome();
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
//	                       		lfn_gotoHome();
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    	if(uploadPanel!=null) {
            				uploadPanel.destroy();
            			}
//                    	lfn_gotoHome();
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} 
            		if(uploadPanel!=null) {
        				uploadPanel.destroy();
        			}
//        			lfn_gotoHome();
            	}
            }]
        });
		win.show(this, function() {
		    //button.dom.disabled = false;
		});
     }
});

var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

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
//		                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
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
};

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
    items: [ detailAction, editAction, removeAction]
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
			        //layout: 'fit',
			        height: getCenterPanelHeight(), 
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,
	      				        '->'
//			                    , printExcel
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
			            	detailAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
			            	detailAction.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	detailAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	detailAction.disable();
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

