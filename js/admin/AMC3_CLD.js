//global var.
var grid = null;
var store = null;

searchField = 
	[
	'unique_id',
	'system_code',
	'code_name'
	];


var viewHandler = function() {
					var mylang = vLANG;
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			Stdmaterial.load(unique_id ,{
        				 success: function(stdmaterial) {
        					 	var unique_id = stdmaterial.get('unique_id');
        						var system_code = stdmaterial.get('system_code');
        						var code_name = stdmaterial.get('code_name');
        						var description = stdmaterial.get('description');
        				        
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
	        				    new Ext.form.Hidden({
								id: 'mylang',
								name: 'mylang',
								value: mylang
	        				    }),
							{
							fieldLabel: getColName('unique_id'),
							value: unique_id,
							x: 5,
							y: 0 + 1*lineGap,
							name: 'unique_id',
							anchor: '-5'  // anchor width by percentage
							},{
								fieldLabel: getColName('system_code'),
								value: system_code,
								x: 5,
								y: 0 + 2*lineGap,
								name: 'system_code',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('code_name'),
        				    	value: code_name,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'code_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('description'),
        				    	value: description,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'description',
        				    	anchor: '-5'  // anchor width by percentage
        				    }
        				    ]
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
							var mylang = vLANG;
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			Stdmaterial.load(unique_id ,{
                				 success: function(stdmaterial) {
	                					 var unique_id = stdmaterial.get('unique_id');
	                					 var system_code = stdmaterial.get('system_code');
	             						var code_name = stdmaterial.get('code_name');
	             						var code_name_kr = stdmaterial.get('code_name_kr');
	             						var code_name_en = stdmaterial.get('code_name_en');
	             						var code_name_zh = stdmaterial.get('code_name_zh');
	             						var description = stdmaterial.get('description');
                				        
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
											new Ext.form.Hidden({
												id: 'mylang',
												name: 'mylang',
												value: mylang
											}),
											{
            				                fieldLabel: getColName('system_code'),
            				                value: system_code,
            				                x: 5,
            				                y: 0 + 2*lineGap,
            				                name: 'system_code',
            				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('code_name'),
                				                value: code_name_kr,
                				                x: 5,
                				                y: 0 + 3*lineGap,
                				                name: 'code_name_kr',
                				                id: 'code_name_kr',
                				                anchor: '-5'  // anchor width by percentage
                				            }
                				            /*
                				            ,{
                				                fieldLabel: getColName('code_name_en'),
                				                value: code_name_en,
                				                x: 5,
                				                y: 0 + 4*lineGap,
                				                name: 'code_name_en',
                				                id: 'code_name_en',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('code_name_zh'),
                				                value: code_name_zh,
                				                x: 5,
                				                y: 0 + 5*lineGap,
                				                name: 'code_name_zh',
                				                id: 'code_name_zh',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                        				    	fieldLabel: getColName('description'),
                        				    	value: description,
                        				    	x: 5,
                        				    	y: 0 + 6*lineGap,
                        				    	name: 'description',
                        				    	anchor: '-5'  // anchor width by percentage
                        				    }
                        				    */
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
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
                				                    var form = Ext.getCmp('formPanel').getForm();
                				                    if(form.isValid())
                				                    {
                				                	var val = form.getValues(false);
                				                	var stdmaterial = Ext.ModelManager.create(val, 'Stdmaterial');
                				                	
                				            		//저장 수정
                				                	stdmaterial.save({
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
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };

//writer define
Ext.define('Stdmaterial.writer.SinglePost', {
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
	           	 var stdmaterial = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Stdmaterial');
        		
	           	stdmaterial.destroy( {
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
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	var mylang = vLANG;
    	console_log('mylang'+mylang);
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
			new Ext.form.Hidden({
				id: 'mylang',
				name: 'mylang',
				value: mylang
			}),
            {
                fieldLabel: getColName('system_code'),
                x: 5,
                y: 0 + 1*lineGap,
                name: 'system_code',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('code_name'),
                x: 5,
                y: 0 + 2*lineGap,
                name: 'code_name',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('description'),
                x: 5,
                y: 0 + 3*lineGap,
                name: 'description',
                anchor: '-5'  // anchor width by percentage
            }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Admin',
            width: 700,
            height: 180,
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
                   	 var stdmaterial = Ext.ModelManager.create(val, 'Stdmaterial');
            		//저장 수정
                   	stdmaterial.save({
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
	//alert("ok");
	console_log('now starting...');

	makeSrchToolbar(searchField);
	
	

	Ext.define('Stdmaterial', {
	    	 extend: 'Ext.data.Model',
	    	 fields: /*(G)*/vCENTER_FIELDS,
	    	    proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/admin/stdmaterial.do?method=readremark', /*1recoed, search by cond, search */
			            create: CONTEXT_PATH + '/admin/stdmaterial.do?method=cloudcreate_remark', /*create record, update*/
			            update: CONTEXT_PATH + '/admin/stdmaterial.do?method=cloudcreate_remark',
			            destroy: CONTEXT_PATH + '/admin/stdmaterial.do?method=destroy' /*delete*/
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
	
	
	 //ComBst Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Stdmaterial',
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
		    
		//}//endof else
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
     
