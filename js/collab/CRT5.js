/*
 * CRT5 통보함
 */

searchField = 
	[
	'unique_id',
	'name',
	'content',
	'state'
	];


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

function getName(value, code) {
	var lang = vLANG;
	switch(code) {
		case 'state':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'R':
						return '접수';
					break;
					case 'P':
						return '작성중';
					break;
					case 'I':
						return '결재중';
					break;
					case 'A':
						return '승인완료';
					break;
					case 'D':
						return '반려';
					break;
					case 'C':
						return '복합';
					break;
					case 'G':
						return '입고완료';
					break;
					case 'S':
						return '시스템삭제';
					break;
					case 'E':
						return '주문완료';
					break;
				}
				break;
			case 'zh':
//				return '중국어';
				switch(value){
				case 'R':
					return '挂号';
				break;
				case 'P':
					return '开具中';
				break;
				case 'I':
					return '批准中';
				break;
				case 'A':
					return '承认完成';
				break;
				case 'D':
					return '返回';
				break;
				case 'C':
					return '复合';
				break;
				case 'G':
					return '入库完成';
				break;
				case 'S':
					return '系统删除';
				break;
				case 'E':
					return '订货完成';
				break;
			}
				break;
			case 'en':
//				return '영어';
				switch(value){
				case 'R':
					return 'Receipt';
				break;
				case 'P':
					return 'Drawing';
				break;
				case 'I':
					return 'Sanction';
				break;
				case 'A':
					return 'Recognition';
				break;
				case 'D':
					return 'Return';
				break;
				case 'C':
					return 'Compositeness';
				break;
				case 'G':
					return 'EnterFinish';
				break;
				case 'S':
					return 'System Delete';
				break;
				case 'E':
					return 'RequestFinish';
				break;
			}
				break;
			}
		}
		break;
		case 'result':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'Y':
						return '승인';
					break;
					case 'N':
						return '반려';
					break;
					case 'P':
						return '대기';
					break;
				}
			case 'zh':
				switch(value){
				case 'Y':
					return '承认';
				break;
				case 'N':
					return '返回';
				break;
				case 'P':
					return '等待';
				break;
			}
			case 'en':
				switch(value){
				case 'Y':
					return 'Acknowledgment';
				break;
				case 'N':
					return 'Return';
				break;
				case 'P':
					return 'Ready';
				break;
			}
			}
		}
		break;
		case 'role':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'D':
						return '결재';
					break;
					case 'I':
						return '통보';
					break;
					case 'W':
						return '상신';
					break;
				}
			case 'zh':
				switch(value){
				case 'D':
					return '批准';
				break;
				case 'I':
					return '通知';
				break;
				case 'W':
					return '提交';
				break;
			}
			case 'en':
				switch(value){
				case 'D':
					return 'Sanction';
				break;
				case 'I':
					return 'Notify';
				break;
				case 'W':
					return 'Submit';
				break;
			}
			}
		}
		break;
	}

	return '';
}

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	Routing.load(unique_id ,{
		 success: function(routing) {
			 var rec = grid.getSelectionModel().getSelection()[0];
		     	var unique_id = rec.get('unique_id'); //rtgast uid
		    	var po_no = rec.get('po_no');
		    	var name = rec.get('name');
		    	var content = rec.get('content');
		    	var req_date = rec.get('req_date');
		    	
		    	console_log('req_date=' + req_date);
				console_log('unique_id=' + unique_id);
				console_log('po_no=' + po_no);
				console_log('name=' + name);
				console_log('content=' + content);

				var routingStore = Ext.create('Mplm.store.RoutingStore', {} );
				
				routingStore.getProxy().setExtraParam('unique_id',unique_id);

				var newStoreData = [];
				routingStore.load(  function(records) {
			        for (var i=0; i<records.length; i++){
			        	var rtgwrk_unique_id = records[i].get('rtgwrk_unique_id');
			        	var user_id = records[i].get('user_id');
			        	var user_name = records[i].get('user_name');
			        	var submit_date = records[i].get('submit_date');
			        	var dept_name = records[i].get('dept_name');
			        	var comment = records[i].get('comment');
			        	var state = records[i].get('state');
			        	var result = records[i].get('result');
			        	var role = records[i].get('role');
			        	po_user_uid = records[i].get('po_user_uid');
			        	var obj = {};
			        	var results = getName(result, 'result');
			        	var roles = getName(role, 'role');
			        	obj['rtgwrk_unique_id'] = rtgwrk_unique_id;
			        	obj['user_id'] = user_id;
			        	obj['user_name'] = user_name;
			        	obj['submit_date'] = submit_date.substring(0,16);
			        	obj['dept_name'] = dept_name;
			        	obj['comment'] = comment;
			        	obj['result'] = results;
			        	obj['role'] = roles;
			        	newStoreData.push(obj);
			        }
					
					var RoutingGrid = Ext.create('Ext.grid.Panel', {
					    store: Ext.create('Ext.data.Store', {
		                    fields : ['rtgwrk_unique_id'
		                              ,'user_id'
		                              ,'user_name'
		                              ,'submit_date'
		                              ,'dept_name'
		                              ,'comment'
		                              ,'result'
		                              ,'role'
		                              ],
		                    data   : newStoreData
		                }),
					    stateId: 'stateGrid-routingGrid-111',
					    layout: 'fit',
					    border: false,
					    frame: false ,
						multiSelect : false,
					    columns: [
					              {text: ppo2_user_id, dataIndex: 'user_id'}
					              ,{text: ppo2_user_name, dataIndex: 'user_name'}
					              ,{text: ppo2_submit_date, dataIndex: 'submit_date'}
					              ,{text: ppo2_dept_name, dataIndex: 'dept_name'}
					              ,{text: ppo2_comment, dataIndex: 'comment'}
					              ,{text: ppo2_result, dataIndex: 'result', flex: 50}
					              ,{text: ppo2_role, dataIndex: 'role', flex: 50}
					              ]
						});
					
					var form = Ext.create('Ext.form.Panel', {
						id: 'formPanel',
						xtype: 'form',
		    			frame: false,
		    	        border: false,
		                bodyPadding: 15,
		                region: 'center',
		    	        defaults: {
		    	            anchor: '100%',
		    	            allowBlank: false,
		    	            msgTarget: 'side',
		    	            labelWidth: 60
		    	        },
				        items: [
				                RoutingGrid,
		                {
		                	xtype: 'component',
		                	html: '<br/><hr/><br/>',
		                	anchor: '100%'
		                },{
							fieldLabel: getColName('unique_id'),
							xtype:  'displayfield',
							value: unique_id,
							name: 'unique_id',
							anchor: '100%'
						},{
					    	fieldLabel: crt3_name,
					    	xtype:  'displayfield',
					    	value: name,
					    	name: 'name',
					    	anchor: '100%'
					    },{
					    	fieldLabel: crt3_content,
					    	xtype:  'displayfield',
					    	value: content,
					    	name: 'content',
					    	anchor: '100%'
					    },{
					    	fieldLabel: toolbar_pj_req_date,
					    	xtype:  'displayfield',
					    	value: req_date.substring(0,10),
					    	name: 'req_date',
					    	anchor: '100%'
					    }]
					});
		        var win = Ext.create('ModalWindow', {
		            title: CMD_VIEW,
		            width: 830,
		            height: 520,
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
				});//endofwin
		 }//endofsuccess
	 });//emdofload

};

var editHandler = function() {
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			RtgAst.load(unique_id ,{
                				 success: function(rtgAst) {
                					 	var unique_id = rtgAst.get('unique_id');
                						var name = rtgAst.get('name');
                						var content = rtgAst.get('content');
                						var state = rtgAst.get('state');
                						var create_date = rtgAst.get('create_date');
                				        
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
								    			fieldStyle: 'background-color: #ddd; background-image: none;',
											    anchor: '-5'  // anchor width by percentage
											},{
            				                fieldLabel: getColName('name'),
            				                value: name,
            				                x: 5,
            				                y: 0 + 2*lineGap,
            				                name: 'name',
            				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('content'),
                				                value: content,
                				                x: 5,
                				                y: 0 + 3*lineGap,
                				                name: 'content',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('state'),
                				                value: state,
                				                x: 5,
                				                y: 0 + 4*lineGap,
                				                name: 'state',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('create_date'),
                				                value: create_date,
                				                x: 5,
                				                y: 0 + 5*lineGap,
                				                name: 'create_date',
                				                anchor: '-5'  // anchor width by percentage
                				            }
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
	                				                	var rtgAst = Ext.ModelManager.create(val, 'RtgAst');
	                				                	
	                				            		//저장 수정
	                				                	rtgAst.save({
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
Ext.define('RtgAst.writer.SinglePost', {
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
	           	 var rtgAst = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'RtgAst');
        		
	           	comBst.destroy( {
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

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});


//Define Add Action
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
                fieldLabel: getColName('name'),
                x: 5,
                y: 0 + 1*lineGap,
                name: 'name',
                id: 'name',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('content'),
                x: 5,
                y: 0 + 2*lineGap,
                name: 'content',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('state'),
                x: 5,
                y: 0 + 3*lineGap,
                name: 'state',
                anchor: '-5'  // anchor width by percentage
            }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' ',
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
                   	 var rtgAst = Ext.ModelManager.create(val, 'RtgAst');
                   	 var wa_code = Ext.getCmp('wa_code').getValue();
                   	console_log('wa_code=' + wa_code);
                   //중복 코드 체크
 					Ext.Ajax.request({
    						url: CONTEXT_PATH + '/sales/buyer.do?method=checkCode',				
         				params:{
         					wa_code : wa_code
         				},
    						
    						success : function(result, request) {
    							
    							var ret = result.responseText;
    							console_log(ret);
    							
    							if(ret == 0 ||  ret  == '0') {
    								//저장 수정
    								rtgAst.save({
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
    								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('wa_code') + ' value.'); 
    							}
    							console_log('requested ajax...');
    						},
    						failure: extjsUtil.failureMessage
    					});  
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
    items: [ detailAction, removeAction  ]
});




Ext.onReady(function() {  
	
	makeSrchToolbar(searchField);
	 //RtgAst Store 정의
	Ext.define('RtgAst', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=read',
		            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=create',
		            update: CONTEXT_PATH + '/rtgMgmt/routing.do?method=update',
		            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroy'
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
		model: 'RtgAst',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	var trayType = "INFORMED";

	store.getProxy().setExtraParam('trayType', trayType);

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
			                    , '-',  '-',removeAction,
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
											    xtype:'label',
											    text: crt4_create_date,
											    name: 'label1'
											 },
											{ 
							                	fieldLabel: '',
							                    name: 'start_date',
							                    id:'start_date',
							                    format: 'Y-m-d',
							    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
							    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
							 			    	allowBlank: true,
							 			    	xtype: 'datefield',
							 			    	value: new Date(),
							 			    	width: 100,
												handler: function(){
												}
											},
											{
											    xtype:'label',
											    text: " ~ ",
											    name: 'label2'
											 },
											{ 
							                	fieldLabel: '',
							                    name: 'end_date',
							                    id:'end_date',
							                    format: 'Y-m-d',
							    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
							    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
							 			    	allowBlank: true,
							 			    	xtype: 'datefield',
							 			    	value: new Date(),
							 			    	width: 100,
												handler: function(){
												}
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
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
