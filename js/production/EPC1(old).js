    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

var stdProcessNameStore = new Ext.create('Ext.data.Store', {
 	fields:[     
 	       { name: 'systemCode', type: "string" }
 	      ,{ name: 'codeName', type: "string"  }
 	     ,{ name: 'codeNameEn', type: "string"  }
 	     
 	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/pcsstd.do?method=pcsStdName',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     	}
 });

//global var.
var gridPcsStd = null;
var storePcsStd = null;
var grid = null;
var store = null;

var selectedUid = '';
var selectNum = '';

var selectedMoldUid = '';
var selectedAssyUid = '';

var process_requestAction = Ext.create('Ext.Action', {
	itemId: 'process_requestButton',
    iconCls: 'production',
    text: epc1_selectprocess,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: epc1_request_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: process_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

function process_requestConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var unique_ids = [];
        	
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
        	}//enoffor
        	
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/production/pcsrequest.do?method=create',
        		params:{
        			unique_uid : unique_ids
        		},
        		success : function(result, request) {
        			store.getProxy().setExtraParam('ele_standard_flag', 'E');
        			store.load(function() {} );
        		},
        		failure: extjsUtil.failureMessage
        	});
        }//endofif yes
    }//endofselection
};

var viewCartHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_uid = rec.get('unique_uid');

	PartLine.load(unique_uid ,{
		 success: function(partline) {
			 
			 var unique_id = partline.get('unique_id');
			 var pl_no  = rec.get('pl_no');
			 var item_name = partline.get('item_name');
			 var specification = partline.get('specification');
			 var description = partline.get('description');
			 var model_no = partline.get('model_no');
			 var comment = partline.get('comment');
			 var maker_name = partline.get('maker_name');

				var lineGap = 35;
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
		            	fieldLabel: getColNameSub('item_code_dash'),
		            	value: pl_no,
		            	x: 5,
		            	y: 0 + 1*lineGap,
		            	name: 'item_code',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColNameSub('item_name'),
		            	value: item_name,
		            	x: 5,
		            	y: 0 + 2*lineGap,
		            	name: 'item_name',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColNameSub('specification'),
		            	value: specification,
		            	x: 5,
		            	y: 0 + 3*lineGap,
		            	name: 'specification',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColNameSub('model_no'),
		            	value: model_no,
		            	x: 5,
		            	y: 0 + 4*lineGap,
		            	name: 'model_no',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColNameSub('description'),
		            	value: description,
		            	x: 5,
		            	y: 0 + 5*lineGap,
		            	name: 'description',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColNameSub('comment'),
		            	value: comment,
		            	x: 5,
		            	y: 0 + 6*lineGap,
		            	name: 'comment',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColNameSub('maker_name'),
		            	value: maker_name,
		            	x: 5,
		            	y: 0 + 7*lineGap,
		            	name: 'maker_name',
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
		            layout: 'absolute',
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
		 }
	 });

};

var viewHandler = function() {
	var rec = gridPcsStd.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsStd.load(unique_id ,{
		 success: function(pcsstd) {
			 var unique_id = pcsstd.get('unique_id');
			 var srcahd_uid	= pcsstd.get('srcahd_uid');
			 var pcs_name	= pcsstd.get('pcs_name');
			 var pcs_code = pcsstd.get('pcs_code');
			 var std_mh	= pcsstd.get('std_mh');

				var lineGap = 35;
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
		            	fieldLabel: getColName('unique_id'),
		            	value: unique_id,
		            	x: 5,
		            	y: -15 + 1*lineGap,
		            	name: 'unique_id',
		            	anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColName('srcahd_uid'),
		            	value: srcahd_uid,
		            	x: 5,
		            		y: -15 + 2*lineGap,
		            		name: 'srcahd_uid',
					anchor: '-5'  // anchor width by percentage
		            },{
		            	fieldLabel: getColName('pcs_name'),
				    	value: pcs_name,
				    	x: 5,
				    	y: -15 + 3*lineGap,
				    	name: 'pcs_name',
				    	anchor: '-5'  // anchor width by percentage
				    },{
				    	fieldLabel: getColName('pcs_code'),
				    	value: pcs_code,
				    	x: 5,
				    	y: -15 + 4*lineGap,
				    	name: 'pcs_code',
				    	anchor: '-5'  // anchor width by percentage
				    },{
				    	fieldLabel: getColName('std_mh'),
				    	value: std_mh,
				    	x: 5,
				    	y: -15 + 5*lineGap,
				    	name: 'std_mh',
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
		        win.show();;
				//endofwin
		 }//endofsuccess
	 });//emdofload

};
var editHandler = function() {
	var rec = gridPcsStd.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	

	PcsStd.load(unique_id ,{
		 success: function(pcsstd) {
			 
			 	var unique_id = pcsstd.get('unique_id');
			 	var srcahd_uid	= pcsstd.get('srcahd_uid');
			 	var pcs_name	= pcsstd.get('pcs_name');
			 	var pcs_code = pcsstd.get('pcs_code');
			 	var std_mh	= pcsstd.get('std_mh');
				
				var lineGap = 35;
				
				
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
		            items: [{
		    			fieldLabel: getColName('unique_id'),
		    			value: unique_id,
		    			x: 5,
		    			y: -15 + 1*lineGap,
		    			readOnly: true,
		    			name: 'unique_id',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
			    		fieldLabel: getColName('srcahd_uid'),
			    		value: srcahd_uid,
			    		x: 5,
			    		y: -15 + 2*lineGap,
			    		readOnly: true,
			    		name: 'srcahd_uid',
			    		anchor: '-5'  // anchor width by percentage
			    		},{
		    			fieldLabel: getColName('pcs_name'),
		    			value: pcs_name,
		    			id :'pcs_name',
		    			xtype: 'combo',
		    			mode: 'local',
		    			editable:false,
		                allowBlank: false,
		                queryMode: 'remote',
		                displayField:   'systemCode',
		                valueField:     'systemCode',
		                store: stdProcessNameStore,
			            listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
		                	}			                	
		                },
		                triggerAction: 'all',
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
     	                },
		    			x: 5,
		    			y: -15 + 4*lineGap,
		    			name: 'pcs_name',
		    			anchor: '-5'  // anchor width by percentage
		    		    },{
			    		fieldLabel: getColName('pcs_code'),
			    		value: pcs_code,
			    		x: 5,
			    		y: -15 + 5*lineGap,
			    		name: 'pcs_code',
			    		anchor: '-5'  // anchor width by percentage
			    		},{
		    		    fieldLabel: getColName('std_mh'),
		    		    xtype: 'numberfield',
		    		    minValue : 0,
		    		    value: std_mh,
		    		    x: 5,
		    		    y: -15 + 6*lineGap,
		    		    name: 'std_mh',
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
		                	var pcsstd = Ext.ModelManager.create(val, 'PcsStd');
		            		//저장 수정
		                	pcsstd.save({
		                		success : function() {
		                			//console_log('updated');
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		storePcsStd.load(function() {});
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
				//endofwin
		 }//endofsuccess
	 });//emdofload

};
function deleteConfirm(btn){
	var uniqueList = '';
    var selections = gridPcsStd.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridPcsStd.getSelectionModel().getSelection()[i];
        		var unique_id = rec.get('unique_id');
        		var srcahd_uid = rec.get('srcahd_uid');
        		if(uniqueList=='') {
        			uniqueList = unique_id;
        		}else {
        			uniqueList = uniqueList + ';' + unique_id;
        		}
        	}
        	Ext.Ajax.request({
				url: CONTEXT_PATH + '/production/pcsstd.do?method=destroyOnlyStd',
			params:{
				uniqueList: uniqueList,
				srcahd_uid:srcahd_uid
			},
			success : function(result, request) {
			},//endof success for ajax
			failure: extjsUtil.failureMessage
       	}); //endof Ajax
        	gridPcsStd.store.remove(selections);
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


var copyAction =  Ext.create('Ext.Action', {
	iconCls:'my_purchase',
	itemId: 'Copy',
    text: epc1_copy,
    disabled: true,
    handler: function(widget, event) {
    	//make uidlist
    	var uidList = '';
        var selections = gridPcsStd.getSelectionModel().getSelection();
        if (selections) {
            	for(var i=0; i< selections.length; i++) {
            		var rec = gridPcsStd.getSelectionModel().getSelection()[i];
            		var unique_id = rec.get('unique_id');
            		if(uidList=='') {
            			uidList = unique_id;
            		}else {
            			uidList = uidList + ';' + unique_id;
            		}
            	}
            	
        }
    	
       	Ext.Ajax.request({
				url: CONTEXT_PATH + '/production/pcsstd.do?method=copyC',
			params:{
        		uidList: uidList
			},
			success : function(result, request) {
				Ext.MessageBox.alert('Info','process Copy is done.');
				console_log('uidList='+uidList);
			},//endof success for ajax
			failure: extjsUtil.failureMessage
       	}); //endof Ajax
    	
    	
    	
    }
});

function returnConfirm(btn){

	var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
        		var unique_uid = rec.get('unique_uid');
	           	 var partline = Ext.ModelManager.create({
	           		unique_id : unique_id, unique_uid : unique_uid
	        	 }, 'PartLine');
        		
	           	partline.save( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }
    }
};

var returnAction = Ext.create('Ext.Action', {
	itemId: 'returnButton',
    iconCls: 'return',
    text: CMD_DENY,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: epc1_returnk_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: returnConfirm,
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
    	
		var lineGap = 35;
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
            items: [{
	            		fieldLabel: getColName('pcs_name'),
	                	x: 5,
	                	y: 0 + 1*lineGap,
	                	name: 'pcs_name',
	                	 xtype: 'combo',
	                     mode: 'local',
	                     editable:false,
	                     allowBlank: false,
	                     queryMode: 'remote',
	                     displayField:   'systemCode',
	                     valueField:     'systemCode',
	                     store: stdProcessNameStore,
	  	                listConfig:{
	  	                	getInnerTpl: function(){
	  	                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
	  	                	}			                	
	  	                },
	  	               triggerAction: 'all',
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
	   	               },
	                	id:'pcs_name',
	                	anchor: '-5'  // anchor width by percentage
	                
	    		    },{
		            	fieldLabel: getColName('pcs_code'),
		            	x: 5,
		            	y: 0 + 2*lineGap,
		            	value: selectNum,
		            	name: 'pcs_code',
		            	anchor: '-5'  // anchor width by percentage
	        		},{
		            	fieldLabel: getColName('std_mh'),
		            	xtype: 'numberfield',
		            	minValue : 0,
		            	x: 5,
		            	y: 0 + 3*lineGap,
		            	name: 'std_mh',
		            	anchor: '-5'  // anchor width by percentage
	        		},{
	                    fieldLabel: getColName('srcahd_uid'),
	                    value : selectedUid,
	                    x: 5,
	                    y: 0 + 4*lineGap,
	                    xtype: 'displayfield',
	                    name: 'srcahd_uid',
	                    anchor: '-5'  // anchor width by percentage
	                }
    		    ]
        });
    	
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/production/pcsstd.do?method=nextCode',
    		params:{
    			srcahd_uid : selectedUid
    		},
    		
    		success : function(result, request){
    			console_log("Success");
    			var netCode = result.responseText;

		    	var val = {};
		    	val["pcs_name"] ="";
		    	val["pcs_code"] =netCode;
		    	val["srcahd_uid"] = selectedUid;
		    	var pcsstd = Ext.ModelManager.create(val, 'PcsStd');  //实例化对象
		    	var pcs_code = val["pcs_code"];
		    	var srcahd_uid = selectedUid;
		    	console_log("pcsstd : "+pcsstd.toString());
		    	console_log("pcs_code : "+pcs_code);
		    	console_log("srcahd_uid : "+srcahd_uid);
		       	pcsstd.save({
		       		success : function() {
		       			storePcsStd.load();
		       		}
		       	});
    		}
    	});
       	

    }//endofhandler
});



var pasteAction =	 Ext.create('Ext.Action', {
	itemId: 'Paste',
	iconCls:'PSBOMView',
    text: epc1_paste,
//    disabled: true ,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		var lineGap = 35;
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
    	 items: {
            fieldLabel: getColName('srcahd_uid'),
            value : selectedUid,
            x: 5,
            y: 0 + 4*lineGap,
            xtype: 'displayfield',
            name: 'srcahd_uid',
            anchor: '-5'  // anchor width by percentage
        }
    	});
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/production/pcsstd.do?method=copyV',
    		params:{
    			srcahd_uid : selectedUid
    			
    		},
    		
    		success : function(result, request){
    			console_log("Success");
    			storePcsStd.load();
    		}
    	});
    }//endofhandler
});

//Define Delete Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

var detailCartAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewCartHandler
});

var contextCMenu = Ext.create('Ext.menu.Menu', {
	items: [ detailCartAction ]
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, editAction, removeAction  ]
});



Ext.onReady(function() {
	LoadJs('/js/util/comboboxtree.js');
	LoadJs('/js/util/eleGubunToolbar.js');
	Ext.define('PartLine', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS_SUB,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/design/bom.do?method=read', 					/*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/design/bom.do?method=create', 			/*create record, update*/
		            update: CONTEXT_PATH + '/design/bom.do?method=update',
		            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy' 			/*delete*/
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
	
	Ext.define('Processing', {
		 extend: 'Ext.data.Model',
		 fields: ['unique_uid'],
		    proxy: {
				type: 'ajax',
		        api: {
		            create: CONTEXT_PATH + '/production/pcsrequest.do?method=create'			/*create record, update*/
		        },
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});
	console_log(/*(G)*/vCENTER_FIELDS);

	makeSrchToolbar([]);
	
	
	Ext.define('PcsStd', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/pcsstd.do?method=read',
		            create: CONTEXT_PATH + '/production/pcsstd.do?method=createOnlyStd',
		            update: CONTEXT_PATH + '/production/pcsstd.do?method=createOnlyStd',
		            destroy: CONTEXT_PATH + '/production/pcsstd.do?method=destroyOnlyStd'
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
	
	
	
	

	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PartLine',
		sorters: [{
	       property: 'pl_no',
	       direction: 'ASC'
	   }]
	});

	storePcsStd = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsStd',
		sorters: [{
           property: 'pcs_code',
           direction: 'ASC'
       }]
	});
	
	store.getProxy().setExtraParam('menu_code', vCUR_MENU_CODE);
	store.getProxy().setExtraParam('not_standard_flag', 'A');
	store.load(function() {
		var selModelC = Ext.create('Ext.selection.CheckboxModel', {
		    listeners: {
		        selectionchange: function(sm, selections) {
		        }
		    }
		});
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModelC,
			        autoScroll: true,
			        autoHeight: true,
	                region: 'east',
	                width: '65%',
	                height: '100%',
			        bbar: getPageToolbar(store),

			        dockedItems: [
					{
							dock: 'top',
						    xtype: 'toolbar',
						    items: [
						           process_requestAction,
						           '-',
						         '->'
						         ]
						},
			         {
			            xtype: 'toolbar',
			            items:getProjectTreeToolbar()
			        },
			        {
			        	xtype: 'toolbar',
			            items: ELEGubunToolbar()
			        },
			        {
			        	xtype: 'toolbar',
			            items: [{
			            	fieldLabel: epc1_doc_name,
	                    	labelWidth: 100,
	                    	width: 200,
	                    	xtype: 'textfield',
	                    	id : 'pl_no',
	                    	name : 'pl_no',
	                     	listeners : {
								specialkey : function(field, e) {
		                          var pl_no =	Ext.getCmp('pl_no').value;
		                          store.getProxy().setExtraParam('pl_no', pl_no);
		                          if (e.getKey() == Ext.EventObject.ENTER) {
					        			store.load(function(){});
		                          } 
	                     		}
	                     	}
			            },'-',
			            {
			            	fieldLabel: epc1_bom_type,
	                    	labelWidth: 100,
	                    	width: 200,
	                    	xtype: 'textfield',
	                    	id : 'standard_flag',
	                    	name : 'standard_flag',
	                     	listeners : {
								specialkey : function(field, e) {
		                          var standard_flag =	Ext.getCmp('standard_flag').value;
		                          store.getProxy().setExtraParam('standard_flag', standard_flag);
		                          if (e.getKey() == Ext.EventObject.ENTER) {
					        			store.load(function(){});
		                          } 
	                     		}
	                     	}
			            }]
			        }],
			        columns: /*(G)*/vCENTER_COLUMN_SUB,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
		            	   if(record.get('standard_flag')=="K"){
		            		   	return 'selected-row';                           
		            		} else if (record.get('standard_flag')=="S"){
		            			   return 'selected-green-row';  
		            		} else if(record.get('standard_flag')=="M") {
		            			   return 'my-row';  
		            		} else {
		            			   return  '';  
		            		}
			            },
			            listeners: {
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
											}, this);
								},
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextCMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: function(){
			                }
			            }
			        },
			        title:getMenuTitle()

			    });
				grid.getSelectionModel().on({
			        selectionchange: function(sm, selections) {
			            if (selections.length) {
				            	returnAction.enable();
				            	storePcsStd.getProxy().setExtraParam('srcahd_uid', '');
			                	var rec = grid.getSelectionModel().getSelection()[0];
			                	var unique_id = rec.get('unique_id');
			                	var pl_no  = rec.get('pl_no');
			                	var item_name = rec.get('item_name');
			                	var comment  = rec.get('comment');
			                	var standard_flag  = rec.get('standard_flag');
			                	if(unique_id!=null && unique_id!='') {
				                	storePcsStd.getProxy().setExtraParam('srcahd_uid', unique_id);
				                	storePcsStd.getProxy().setExtraParam('comment', comment);
				                	storePcsStd.getProxy().setExtraParam('standard_flag', standard_flag);
				                	storePcsStd.load(function(){});
				                	selectedUid = unique_id;
				                	if(gridPcsStd != null){
				                		gridPcsStd.setTitle('[' + pl_no + '] ' + item_name);
				                	}
			                	}
			            } else {
			            	if(fPERM_DISABLING()==true) {
			            		collapseProperty();
				            	addAction.disable();
				            	returnAction.disable();
		                		gridPcsStd.setTitle('-');
		                		process_requestAction.disable();
			            	}else{
			            		collapseProperty();
				            	addAction.enable();
				            	returnAction.disable();
		                		gridPcsStd.setTitle('-');
		                		process_requestAction.enable();
			            	}
			            	detailCartAction.enable();
			            	var unique_id = null;
			            	storePcsStd.getProxy().setExtraParam('srcahd_uid', unique_id);
			            	storePcsStd.load(function(){});
			            }
			        }
			    });
				
				var selModel = Ext.create('Ext.selection.CheckboxModel', {
				    listeners: {
				        selectionchange: function(sm, selections) {
				        	gridPcsStd.down('#removeButton').setDisabled(selections.length == 0);
				        }
				    }
				});
				
				Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
					
					var dataIndex = columnObj["dataIndex"];
					columnObj["flex"] =1;
					
					if(dataIndex!='no' && dataIndex!='creator') {
						
						if('pcs_name' == dataIndex) {
					        columnObj["editor"] = new Ext.form.field.ComboBox({
					            typeAhead: true,
					            triggerAction: 'all',
					            selectOnTab: true,
					            mode: 'remote',
					            queryMode: 'remote',
	                            editable:false,
	                            allowBlank: false,
				                displayField:   'systemCode',
				                valueField:     'systemCode',
				                store: stdProcessNameStore,
					            listClass: 'x-combo-list-small',
		   	   	               	listeners: {	}
					        });
					        
					        
					        
						} 
						else {
							columnObj["editor"] = {
			                };	
						}
						
				        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
				        	p.tdAttr = 'style="background-color: #FFE4E4;"';
							return value;
			        	};
					}
				});
				
				gridPcsStd = Ext.create('Ext.grid.Panel', {
						id : 'tempport',
				        store: storePcsStd,
				        multiSelect: true,
				        stateId: 'stateGrid1' + /*(G)*/vCUR_MENU_CODE,
				        selModel: selModel,
				        autoScroll: true,
				        autoHeight: true,
		                region: 'east',
		                collapsible: true,
		                //floatable: true,
		                split: true,
		                width: '35%',
		                height: '100%',
		                bbar: getPageToolbar(store),

				        dockedItems: [{
				            dock: 'top',
				            xtype: 'toolbar',
				            items: [
				                    addAction,  '-', removeAction,	'-', copyAction ,'-',pasteAction,
		      				        '->'
				                    ,
				                    {
				                        text: panelSRO1133,
				                        iconCls: 'save',
				                        disabled: fPERM_DISABLING(),
				                        handler: function ()
				                        {
				                        	var modifiend =[];
				                        	var rec = grid.getSelectionModel().getSelection()[0];
				                        	var unique_id = rec.get('unique_id');


				                              for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
				                              {
					                                var record = gridPcsStd.store.data.items [i];
					                                
					                                if (record.dirty) {
					                                	storePcsStd.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
					                                   	console_log(record);
					                                   	var obj = {};
					                                   	
					                                   	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
					                                   	obj['pcs_code'] = record.get('pcs_code');
					                                   	obj['pcs_name'] = record.get('pcs_name');
					                                   	obj['std_mh'] = record.get('std_mh');
					                                   	obj['description'] = record.get('description');
					                                   	modifiend.push(obj);
					                                }
					                          }
				                              
				                              if(modifiend.length>0) {
				                            	
				                            	  console_log(modifiend);
				                            	  var str =  Ext.encode(modifiend);
				                            	  console_log(str);
				                            	  
				                           	    Ext.Ajax.request({
				                         			url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
				                         			params:{
				                         				modifyIno: str,
				                         				srcahd_uid:unique_id
				                         			},
				                         			success : function(result, request) {   
				                         				storePcsStd.load(function() {});
				                         			}
				                           	    });
				                              }
				                        }
				                    }//endof brace
		      				          ]
				        }
				        ],
				        columns: /*(G)*/vCENTER_COLUMNS,
				        plugins: [cellEditing],
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true,
				            getRowClass: function(record) { 
				            	   if(record.get('standard_flag')=="K"){
				            		   	return 'selected-row';                           
				            		} else if (record.get('standard_flag')=="S"){
				            			   return 'selected-green-row';  
				            		} else if(record.get('standard_flag')=="M") {
				            			   return 'my-row';  
				            		} else {
				            			   return  ''; 
				            		}
					            },
				            listeners: {
				                itemcontextmenu: function(view, rec, node, index, e) {
				                    e.stopEvent();
				                    contextMenu.showAt(e.getXY());
				                    return false;
				                },
				                itemdblclick: viewHandler 

				            }
				        },
				        title: '-'

				    });
				
				
				
			    gridPcsStd.getSelectionModel().on({
			        selectionchange: function(sm, selections) {
			            if (selections.length) {
							//grid info 켜기
							if(fPERM_DISABLING()==true) {
								copyAction.disable();
				            	removeAction.disable();
				            	editAction.disable();
							}else{
								copyAction.enable();
								removeAction.enable();
				            	editAction.enable();
							}
							detailAction.enable();
			            } else {
			            	if(fPERM_DISABLING()==true) {
			            		copyAction.disable();
				            	removeAction.disable();
				            	editAction.disable();
			            	}else{
			            		copyAction.disable();
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

			    
						console_log('end create');   
						
						fLAYOUT_CONTENTMulti([grid,gridPcsStd]);  
						
					cenerFinishCallback();//Load Ok Finish Callback	
			});
		});	//OnReady
