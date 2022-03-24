//Ext.onReady(function() {  fDEF_CONTENT(); });

//global var.
var grid = null;
var store = null;
var obj2 = null;
var today = new Date();
var mccheck = 'true';



Today_2_1 = function() {
    var format = 'Y-m-d';
    return new Ext.form.DisplayField({
        value: (new Date()).format(format)
    });
};



var processNameStore = Ext.create('Mplm.store.ProcessNameStore', {} );
var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
var mcfixStore = Ext.create('Mplm.store.McFixtypeStore', {hasNull: false} );
var partTypeStore = Ext.create('Mplm.store.PartTypeStore', {hasNull: false} );
var mccausetypeStore = Ext.create('Mplm.store.McFixCauseTypeStore', {hasNull: false} );
var mchnStore = Ext.create('Mplm.store.MachineStore', {} );
var stateStore = Ext.create('Mplm.store.McFixStateStore', {} );

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






var Mchn_code=[];
var mchn_code_combo=null;
///Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
//    	var mchn_uid=Ext.getCmp('mchncombo').getValue();
//    	var fix_mchn=Ext.getCmp('fix_mchncombo').getValue();
    	
		

    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                editable:false,
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ 
                     
            new Ext.form.Hidden({
				id: 'state',
				name: 'state',
				value:"N"
				}),
//			new Ext.form.Hidden({
//				id: 'mccheck',
//				name: 'mccheck'
////				value:mccheck
//				}),
//			new Ext.form.Hidden({
//				id: 'fix_PRICE',
//				name: 'fix_PRICE'
////				value:0
//				}),
//			new Ext.form.Hidden({
//				id: 'mchn_uid',
//				name: 'mchn_uid'
////				value:mchn_uid
//				}),
            
//				{
//				    xtype : 'container',
//				    combineErrors: true,
//				    layout:{
//				    	type:'hbox',
//				    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0}
//				},
//				    msgTarget: 'side',
//				    fieldLabel: panelSRO1144,
//				    defaults: {
//				    	anchor:'100%'
//				        //hideLabel: true
//				    },
//				    items : [
//				{
//					xtype: 'textfield',
//					fieldLabel: getColName('fix_mchn'),
////					value: fix_mchn,
//					allowBlank:false,
//					width: 60,
//					flex : 1,
//					readOnly : true,
//					fieldStyle : 'background-color: #ddd; background-image: none;',
//					 name: 'fix_mchn'
//					},
//					{
//						xtype: 'textfield',
//						fieldLabel: getColName('mchn_code'),
//						allowBlank:false,
//						flex : 1,
////						value: mchn_code_combo,
//						readOnly : true,
//						fieldStyle : 'background-color: #ddd; background-image: none;',
//						name: 'mchn_code'
//					}
//					]
//				},
				
				{
                fieldLabel: '부품종류',
                name: 'part_type',
 	            xtype: 'combo',
 	            store: partTypeStore,
                displayField:   'codeName',
                valueField:     'systemCode',
 	            typeAhead: false,
                 allowBlank: false,
	                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</divsystemCode>';
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
 	                    }
 	               }
	        },
            
	            
    		,{
            	xtype: 'textfield',
            	fieldLabel: '시리얼 번호',
                fieldStyle: 'text-transform:uppercase',
            	name: 'serial_no'
            	
            }
    		,{
            	xtype: 'textfield',
            	fieldLabel: '제조사',
            	name: 'maker'
            },{
            	xtype: 'textfield',
            	fieldLabel: '규격',
                fieldStyle: 'text-transform:uppercase',
            	name: 'spec'
            }
    		
    		
            ]
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
                	var parts = Ext.ModelManager.create(val, 'Parts');
            		//저장 수정
                	parts.save({
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
        });
		win.show(this, function() {
			var obj2 = Ext.getCmp('mchn_uid'); 
               obj2.store = 
               	Ext.create('Ext.data.Store', {
                   fields : ['unique_id', 'mchn_code'],
                   data   : []
               	});
		});
     }
});



function createViewForm(parts) {
	var lineGap = 30;
	var unique_id = parts.get('unique_id');
	var state = parts.get('state');
	var part_type = parts.get('part_type');
	var serial_no = parts.get('serial_no');
	var maker = parts.get('maker');
	var spec = parts.get('spec');

	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
		scroll:true,
       defaultType: 'displayfield',
       border: false,
       bodyPadding: 15,
       height: 350,
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
			fieldLabel: getColName('state'),
			value: state,
			name: 'state',
			anchor: '-5'  // anchor width by percentage
			},
				{
				fieldLabel: getColName('part_type'),
				value: part_type,
				name: 'part_type',
				anchor: '-5'
					}
	            
		            
	    		,{
	    			fieldLabel: getColName('serial_no'),
	    			value: serial_no,
	    			name: 'serial_no',
	    			anchor: '-5'  // anchor width by percentage
	    		}
	    		,{
	    			fieldLabel: getColName('maker'),
	    			value: maker,
	    			name: 'maker',
	    			anchor: '-5'  // anchor width by percentage
	    		},{
	    			fieldLabel: getColName('spec'),
	    			value: spec,
	    			name: 'spec',
	    			anchor: '-5'  // anchor width by percentage
	    		}
		    ]
   }); //endof form
	
	return form;
}

function createEditForm(parts) {
	
	
	var unique_id = parts.get('unique_id');
	var state = parts.get('state');
	var part_type = parts.get('part_type');
	var serial_no = parts.get('serial_no');
	var maker = parts.get('maker');
	var spec = parts.get('spec');
	
	

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
         items: [
                 
{
	fieldLabel: getColName('unique_id'),
	value: unique_id,
	readOnly : true,
	fieldStyle : 'background-color: #ddd; background-image: none;',
	name: 'unique_id',
	anchor: '-5'  // anchor width by percentage
	},
	{
	fieldLabel: getColName('state'),
	value: state,
	readOnly : true,
	fieldStyle : 'background-color: #ddd; background-image: none;',
	name: 'state',
	anchor: '-5'  // anchor width by percentage
	},	{
                fieldLabel: '부품종류',
                name: 'part_type',
 	            xtype: 'combo',
 	            store: partTypeStore,
                displayField:   'codeName',
                valueField:     'systemCode',
                value: part_type,
 	            typeAhead: false,
                 allowBlank: false,
	                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</divsystemCode>';
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
 	                    }
 	               }
	        },
            
	            
    		,{
            	xtype: 'textfield',
            	fieldLabel: '시리얼 번호',
                fieldStyle: 'text-transform:uppercase',
                value: serial_no,
            	name: 'serial_no'
            	
            }
    		,{
            	xtype: 'textfield',
            	fieldLabel: '제조사',
            	value: maker,
            	name: 'maker'
            },{
            	xtype: 'textfield',
            	fieldLabel: '규격',
                fieldStyle: 'text-transform:uppercase',
                value: spec,
            	name: 'spec'
            }
                 
                 

		
        ]
    });
	
	return form;
}


function createAddEditForm(parts) {
	
	
	var unique_id = parts.get('unique_id');
	var fixtype = parts.get('fixtype');
	var finder_uid = parts.get('finder_uid');
	var cause_type = parts.get('cause_type');
	var occ_date = parts.get('occ_date') ;
	var occ_desc = parts.get('occ_desc') ;
	var occ_state = parts.get('occ_state') ;
	var recv_date = parts.get('recv_date') ;//
	var fix_mchn = parts.get('fix_mchn') ;
	var fix_PRICE = parts.get('fix_PRICE') ;//
	var occ_reason = parts.get('occ_reason') ;//
	var fix_desc = parts.get('fix_desc') ;//
	var mchn_uid = parts.get('mchn_uid');
	

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
         items: [
new Ext.form.Hidden({
	id: 'unique_id',
	name: 'unique_id',
	value: unique_id
}),
new Ext.form.Hidden({
	id: 'state',
	name: 'state',
	value:"c"
}),
new Ext.form.Hidden({
	id: 'fixtype',
	name: 'fixtype',
	value: fixtype
}),
new Ext.form.Hidden({
	id: 'finder_uid',
	name: 'finder_uid',
	value: finder_uid
}),
new Ext.form.Hidden({
	id: 'cause_type',
	name: 'cause_type',
	value: cause_type
}),
new Ext.form.Hidden({
	id: 'occ_date',
	name: 'occ_date',
	value: occ_date
}),
new Ext.form.Hidden({
	id: 'occ_desc',
	name: 'occ_desc',
	value: occ_desc
}),
new Ext.form.Hidden({
	id: 'occ_state',
	name: 'occ_state',
	value: occ_state
}),
new Ext.form.Hidden({
	id: 'fix_mchn',
	name: 'fix_mchn',
	value: fix_mchn
}),
new Ext.form.Hidden({
	id: 'mchn_uid',
	name: 'mchn_uid',
	value: mchn_uid
}),
        {
        	fieldLabel: getColName('recv_date'),
        	name: 'recv_date',
        	format: 'Y-m-d',
        	value:recv_date,
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	allowBlank: false,
            value : new Date(),
        	xtype: 'datefield'
        },
        {
        	fieldLabel: getColName('fix_date'),
        	name: 'fix_date',
        	format: 'Y-m-d',
	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
        	allowBlank: false,
            value : new Date(),
        	xtype: 'datefield'
        },{
        	xtype: 'textarea',
        	fieldLabel: getColName('occ_reason'),
        	id: 'occ_reason',
        	name: 'occ_reason',
        	value:occ_reason,
        	rows: 3
        }
        ,{
 			fieldLabel: getColName('fix_PRICE'),
 			value: fix_PRICE,
 			name: 'fix_PRICE',
 			allowBlank: false,
 			minValue:0,
 			type:  'numberfield'
 		}
        ,{
        	xtype: 'textarea',
        	fieldLabel: getColName('fix_desc'),
        	id: 'fix_desc',
        	name: 'fix_desc',
        	value:fix_desc,
        	rows: 3
        },
        { 
            
         	fieldLabel: getColName('fixer_id'),
				name : 'fixer_uid',
	            xtype: 'combo',
	            store: userStore,
	            editable:false,
	            displayField: 'user_name',
	            valueField:     'unique_id',
	            typeAhead: false,
             allowBlank: false,
	            listConfig: {
	                loadingText: 'Searching...',
	                emptyText: 'No matching posts found.',
	                // Custom rendering template for each item
	                getInnerTpl: function() {
	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
	                }
	            }
		}
		
        ]
    });
	
	return form;
}

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			
			Parts.load(unique_id ,{
				 success: function(parts) {

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 350,
				            height: 350,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(parts),
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
						
//					});
	

				 }//endofsuccess
			 });//emdofload
	
};

var editHandler = function() {
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');
		var today = new Date();
		console_log(today);
			
			Parts.load(unique_id ,{
				 success: function(parts) {
				        var win = Ext.create('ModalWindow', {
				            title: '수정'  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 600,
				            minWidth: 250,
				            minHeight: 180,
				            modal:true,
				            layout: 'fit',
				            plain:true,
				            items: createEditForm(parts),
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                    
				            		var form = Ext.getCmp('formPanel').getForm();
				                                    	
				                    if(form.isValid())
				                    {
					                	var val = form.getValues(false);
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	var parts = Ext.ModelManager.create(val, 'Parts');
								            		//저장 수정
								                   	parts.save({
								                		success : function() {
								                           	if(win) {	
								                           		win.close();
								                           		store.load(function() {});
								                           	} 
								                		}, failure : function(){
								                			win.close();
								                		}
								                	}); //endof save
								                if(win){
								                	win.close();
								                }
					                   	
				                    } else {//form is not valid
				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
				                    }
				                  }
				            },{
				                text: CMD_CANCEL,
				            	handler: function(){
				            		if(win) { win.close();} 
				            	}

				            }]
				        });
						win.show();
				 }//endofsuccess
			 });//endofpcsmcfixload
//		});//endofattachedFileStore.load
};


var addeditHandler = function() {
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');
		
			Parts.load(unique_id ,{
				 success: function(parts) {
				        var win = Ext.create('ModalWindow', {
				            title: 'CMD_MODIFY'  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 500,
				            minWidth: 250,
				            minHeight: 180,
				            modal:true,
				            layout: 'fit',
				            plain:true,
				            items: createAddEditForm(parts),
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                    
				            		var form = Ext.getCmp('formPanel').getForm();
				            		
				            		
				                                    	
				                    if(form.isValid())
				                    {
					                	var val = form.getValues(false);
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	var parts = Ext.ModelManager.create(val, 'Parts');
								            		//저장 수정
								                   	parts.save({
								                		success : function() {
								                           	if(win) {	
								                           		win.close();
								                           		store.load(function() {});
								                           	} 
								                		}, failure : function(){
								                			win.close();
								                		}
								                	}); //endof save
								                if(win){
								                	win.close();
								                }
				                    } else {//form is not valid
				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
				                    }
				                    


				                  }
				            },{
				                text: CMD_CANCEL,
				            	handler: function(){
				            		if(win) { win.close();} 
				            	}

				            }]
				        });
						win.show();
				 }//endofsuccess
			 });//endofpcsmcfixload
};


function deleteConfirm(btn){

   var selections = grid.getSelectionModel().getSelection();
   if (selections) {
       var result = MessageBox.msg('{0}', btn);
       if(result=='yes') {
    	   for ( var i = 0; i < selections.length; i++) {
				var rec = selections[i];
				var unique_id = rec.get('unique_id');
	           	 var parts = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Parts');
       		
	           	parts.destroy( {
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
   disabled: fPERM_DISABLING(),
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



//Define Delete Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
   iconCls: 'pencil',
   text: 'Edit',
   disabled: fPERM_DISABLING() ,
   handler: editHandler
});

var addeditAction = Ext.create('Ext.Action', {
	itemId: 'addeditButton',
   iconCls: 'pencil',
   text: CMD_MODIFY,
   disabled: fPERM_DISABLING() ,
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
   text: CMD_VIEW,
   disabled: true,
   handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
   items: [ detailAction, editAction, removeAction  ]
});



Ext.define('Parts', {
 	 extend: 'Ext.data.Model',
 	 fields: /*(G)*/vCENTER_FIELDS,
 	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/parts.do?method=read',
		            create: CONTEXT_PATH + '/sales/parts.do?method=create',
		            update: CONTEXT_PATH + '/sales/parts.do?method=create',
		            destroy: CONTEXT_PATH + '/sales/parts.do?method=destroy'
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
//	LoadJs('/js/util/getPcsMchnFixToolbar.js');
			store = new Ext.data.Store({  
				pageSize: getPageSize(),
				model: 'Parts',
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
					        	//검색추가 
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '-',  addAction, '-', removeAction
					                    , '->',
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
					
				    grid.getSelectionModel().on({ // 체크박스 선택시 옆에 보이기
				        selectionchange: function(sm, selections) {
				        	
				        	
				        	
				        	console_log(selections.length);
				        	if (selections.length) {
				        		////grid info 켜기
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
				    //callback for finishing.
				    cenerFinishCallback();
			}); //store load
});//

