/*
SQT1- 결재작성
*/

var routeGubunTypeStore = null;
var deptStore = null;
var userStore = null;

Ext.onReady(function() {
	
	function addAction() {
	}
	var deptStore = Ext.create('Mplm.store.DeptStore', {hasNull: false} );
    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
	var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );

	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
			            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
			            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
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
			        } 
				}
	});
	rtgapp_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgApp'});

	    //결재화면
	    var removeRtgapp = Ext.create('Ext.Action', {
		itemId: 'removeButton',
	    iconCls: 'remove',
	    text: CMD_DELETE,
	    disabled: true,
	    handler: function(widget, event) {
	    	Ext.MessageBox.show({
	            title:delete_msg_title,
	            msg: delete_msg_content,
	            buttons: Ext.MessageBox.YESNO,
	            fn: deleteRtgappConfirm,
	            //animateTarget: 'mb4',
	            icon: Ext.MessageBox.QUESTION
	        });
	    }
	});

	    var tempColumn = [];
    	var updown =
    	{
    		text: Position,
    	    menuDisabled: true,
    	    sortable: false,
    	    xtype: 'actioncolumn',
    	    width: 60,
    	    items: [{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
    	        tooltip: 'Up',
    	        handler: function(agridV, rowIndex, colIndex) {
    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	console_log(unique_id);
    	        	var direcition = -15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
	         			params:{
	         				direcition:direcition,
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });
    				}
    	    },{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
    	        tooltip: 'Down',
    	        handler: function(agrid, rowIndex, colIndex) {

    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	console_log(unique_id);
    	        	var direcition = 15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
	         			params:{
	         				direcition:direcition,
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });
    	        }
    	    }]
    	};
	    	tempColumn.push(updown);
	    	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
	    		tempColumn.push(vCENTER_COLUMN_SUB[i]);
	    	}
	    	
	    	rtgapp_store.load(function() {
	    		Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
	                var dataIndex = columnObj["dataIndex" ];
	               columnObj[ "flex" ] =1;
	               
	                if (value!="W" && value!='기안') {
	                       if ('gubun' == dataIndex) {
	                              var combo = null ;
	                              var comboBoxRenderer = function (value, p, record) {
	                                     if (value=='W'|| value=='기안' ) {
	                                    } else {
	                                       console_log('combo.valueField = ' + combo.valueField + ', value=' + value);
	                                       console_log(combo.store);
	                                       var idx = combo.store.find(combo.valueField, value);
	                                       console_log(idx);
	                                       var rec = combo.store.getAt(idx);
	                                       console_log(rec);
	                                       return (rec === null ? '' :  rec.get(combo.displayField) );
	                                    }
	                             };
	                             
	                             combo = new Ext.form.field.ComboBox({
	                             typeAhead: true ,
	                             triggerAction: 'all',
	                             selectOnTab: true ,
	                             mode: 'local',
	                             queryMode: 'remote',
				                 editable: false ,
				                 allowBlank: false ,
		                         displayField:   'codeName' ,
		                         valueField:     'codeName' ,
		                         store: routeGubunTypeStore,
	                             listClass: 'x-combo-list-small' ,
	                             listeners: {  }
	                       });
	                       columnObj[ "editor" ] = combo;
	                      }
	               }
	         });
				agrid = Ext.create('Ext.grid.Panel', {
					//title: routing_path,
				    store: rtgapp_store,
				    layout: 'fit',
				    width:  '100%',
				    columns : tempColumn,
				    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
	    		    	clicksToEdit: 1
	    		    })],
	    		    border: false,
				    multiSelect: true,
				    frame: false,
	    		    dockedItems: [{
	    				xtype: 'toolbar',
	    				items: [{
	    					fieldLabel: dbm1_array_add,
	    					labelWidth: 42,
	    					id :'user_name_addproject',
	    			        name : 'user_name',
	    			        xtype: 'combo',
	    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	    			        store: userStore,
	    			        labelSeparator: ':',
	    			        emptyText:   dbm1_name_input,
	    			        displayField:   'user_name',
	    			        valueField:   'unique_id',
	    			        sortInfo: { field: 'user_name', direction: 'ASC' },
	    			        typeAhead: false,
	    		            hideLabel: true,
	    			        minChars: 2,
	    			        width: 230,
	    			        listConfig:{
	    			            loadingText: 'Searching...',
	    			            emptyText: 'No matching posts found.',
	    			            getInnerTpl: function() {
	    			                return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
	    			            }			                	
	    			        },
	    			        listeners: {
	    			        	select: function (combo, record) {
	    			        		console_log('Selected Value : ' + record[0].get('unique_id'));
	    			        		var unique_id = record[0].get('unique_id');
	    			        		var user_id = record[0].get('user_id');
	    			        		Ext.Ajax.request({
	                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
	                         			params:{
	                         				useruid : unique_id
	                         				,userid : user_id
	                         				,gubun    : 'D'
	                         			},
	                         			success : function(result, request) {   
	                         				var result = result.responseText;
	                						console_log('result:' + result);
	                						if(result == 'false'){
	                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
	                						}else{
	                							rtgapp_store.load(function() {});
	                						}
	                         			},
	                         			failure: extjsUtil.failureMessage
	                         		});
	    			        	}//endofselect
	    			        }
	    				},
				        '->',removeRtgapp,
				        
				        {
	                        text: panelSRO1133,
	                        iconCls: 'save',
	                        disabled: false,
	                        handler: function ()
	                        {
	                    	  var modifiend =[];
	                    	  var rec = grid.getSelectionModel().getSelection()[0];
	                    	  var unique_id = rec.get('unique_id');
	                          for (var i = 0; i <agrid.store.data.items.length; i++)
	                          {
	                                var record = agrid.store.data.items [i];
	                                if (record.dirty) {
	                                	rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
	                                   	console_log(record);
	                                   	var obj = {};
	                                   	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	                                   	obj['gubun'] = record.get('gubun');
	                                   	obj['owner'] = record.get('owner');
	                                   	obj['change_type'] = record.get('change_type');
	                                   	obj['app_type'] = record.get('app_type');
	                                   	obj['usrast_unique_id'] = record.get('usrast_unique_id');
	                                   	obj['seq'] = record.get('seq');
	                                   	obj['updown'] = 0;
	                                   	modifiend.push(obj);
	                                }
	                          }
	                          
	                          if(modifiend.length>0) {
	                        	
	                        	  console_log(modifiend);
	                        	  var str =  Ext.encode(modifiend);
	                        	  console_log(str);
	                        	  
	                       	    Ext.Ajax.request({
	                     			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=modifyRtgapp',
	                     			params:{
	                     				modifyIno: str,
	                     				srcahd_uid:unique_id
	                     			},
	                     			success : function(result, request) {   
	                     				rtgapp_store.load(function() {});
	                     			}
	                       	    });
	                          }
	                        }
	                    }]//endofitems
	    			}] //endofdockeditems
	    		}); //endof Ext.create('Ext.grid.Panel', 
	    	
				agrid.getSelectionModel().on({
	    			selectionchange: function(sm, selections) {
			            if (selections.length) {
							if(fPERM_DISABLING()==true) {
								removeRtgapp.disable();
							}else{
								removeRtgapp.enable();
							}
			            } else {
			            	if(fPERM_DISABLING()==true) {
			            		collapseProperty();//uncheck no displayProperty
			            		removeRtgapp.disable();
			            	}else{
			            		collapseProperty();//uncheck no displayProperty
			            		removeRtgapp.disable();
			            	}
			            }
			        }
	    		}); //endof Ext.create('Ext.grid.Panel', 
	
			
		
			var panel = Ext.create('Ext.panel.Panel', {
					title: getMenuTitle(),
			        id: 'myPanel',
			        collapsible: false,
			        border: true,
			        bodyPadding: 5,
			        fieldDefaults: {
			            labelAlign: 'middle',
			            msgTarget: 'side'
			        },
			        defaults: {
			            anchor: '100%'
			        },
			        items: [{
			            xtype: 'container',
				        layout: {
				            type: 'hbox',
				            align: 'stretch'
				        },
			            items:[{
							xtype: 'form',
							id: 'routeForm',
							border: false,
							flex: 1,
							margin: '0 0 0 0',
					        fieldDefaults: {
					            labelAlign: 'middle',
					            msgTarget: 'side'
					        },
					        defaults: {
					            anchor: '100%'
					        },
					        items: [{
				        		xtype: 'textfield',
				        		emptyText: '결재 제목',
				    			name: 'name',
				    			id:'name'
				       		},{
				             name: 'content',
				             id: 'content',
				             emptyText: '결재 내용',
				             xtype: 'textarea',
				             height: 340,
				             border: true,
				             anchor: '100%'
				    	 },
//				    	 new Ext.form.Hidden({ id: 'hid_userlist_role',	name: 'hid_userlist_role'   })
//				    	  ,new Ext.form.Hidden({ id: 'hid_userlist',	  	name: 'hid_userlist'	    }),
				    	 {
				            xtype: 'container',
                            type: 'hbox',
                            padding:'0',
                            pack:'end',
                            align:'middle',
				            defaults: {
				            },
				            margin: '0 0 0 0',
				            border:false,
				            items: [
						        {
				                    xtype:'button',
				                    text: CMD_OK,
						            handler: function() {
						                this.up('form').getForm().isValid();
					                    var form = Ext.getCmp('routeForm').getForm();
									    if(form.isValid())
									    {
									    	
									    	var ahid_userlist = new Array();
											var ahid_userlist_role = new Array();
									    	agrid.getSelectionModel().selectAll();
									    	var aselections = agrid.getSelectionModel().getSelection();
									    	console_log(aselections);
									        if (aselections) {
									        	for(var i=0; i< aselections.length; i++) {
									        		var rec = agrid.getSelectionModel().getSelection()[i];
									        		console_log(rec);
									        		ahid_userlist[i] = rec.get('usrast_unique_id');
									        		ahid_userlist_role[i] = rec.get('gubun');
									        	}
//									        	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
//									        	Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
									        }
									        var name = Ext.getCmp('name').getValue();
									       	console_log(name);
									       	var content = Ext.getCmp('content').getValue();
									     	console_log(content);
//									     	var hid_userlist_role = Ext.getCmp('hid_userlist_role').getValue();
//									     	console_log(hid_userlist_role);
//									     	var hid_userlist = Ext.getCmp('hid_userlist').getValue();
//									     	console_log(hid_userlist);
						                
									     	function goToCrt2() {
									     		lfn_gotoMenu('CRT2_CLD', 'collab', '상신함', '/js/collab/CRT2_CLD.js', 2);
									     	}
									     	
									    	Ext.Ajax.request({
												url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=create',
												params:{
												   	user_id : vCUR_USER_ID,
											    	user_name : vCUR_USER_NAME,
											    	name : name,
											    	content : content,
											    	rtg_type : 'GE',
											    	hid_userlist_role: ahid_userlist_role,
											    	hid_userlist : ahid_userlist
											 
												},
												success : function(result, request) {
											    	Ext.MessageBox.show({
											    		title:'상신완료',
											    		msg: '상신하였습니다.',
											    		buttons: Ext.MessageBox.OK,
											    		fn: goToCrt2,
											    		icon: Ext.MessageBox.INFO
											    	});
												},
												failure: extjsUtil.failureMessage
											});
						            } //endof form.valid
						           }//endof handler
						        },{
						            xtype:'button',
						            text: '초기화',
						            handler: function() {
						                this.up('form').getForm().reset();
						            }
						        }
				    		]
				         }]}//endofformitems
				    	 ,{
				            xtype:'tabpanel',
				            plain:true,
				            border: true,
				            activeTab: 0,
				            height:350,
				            flex: 1,
				            margin: '0 0 35 5', // right,top,bottom,left
				            tabPosition: 'top',
				            defaults:{
				                bodyPadding: 0
				            },
				            items:[{	            
					        	id: 'projectadd-routing-panel-div',
					            title: '결재경로',
					            border: false,
					            autoScroll:true
					         },{
				                cls: 'x-plain',
				                title: '첨부파일',
				                margin: '0 0 0 0',
				                autoScroll:true,
				                border: false,
			                	items: [{
									id : 'tempport2',
									margin: '0 0 0 0',
								    height: '100%',
								    width: '100%',
							        xtype : "component",
							        border: false,
							        autoEl : {
							            tag : "iframe",
							            height: '100%',
							    	    width: '100%',
							    	    margin: '0 0 0 0',
							    	    border: false,
							    	    width: '100%',
							            src : CONTEXT_PATH + '/test/multiFileUpload.jsp',
							            //src : CONTEXT_PATH + '/test/uploadpanel.jsp',
								        frameBorder: 0
								    }//endofautoEl
								}]//endofitems
				            }]//endoftabpanelitems
					 }]//endofcontainer
				}]//endofpanelitems
			});//endofpanel
	
			var ptargetroutingadd = Ext.getCmp('projectadd-routing-panel-div');
			ptargetroutingadd.removeAll();
			ptargetroutingadd.add(agrid);
			//ptargetroutingadd.add(projectaddform);
			ptargetroutingadd.doLayout();
	
				
		    fLAYOUT_CONTENT(panel);
			cenerFinishCallback();//Load Ok Finish Callback
	  });
});	//OnReady
