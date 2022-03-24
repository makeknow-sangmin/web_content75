/*
EPC6 - 성모	표준공정
*/

Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var pcsstdFields = [
            	    { name: 'unique_id', 	type: "string"    }
            	   ,{ name: 'creator', 		type: "string"    }           
                   ,{ name: 'changer', 		type: "string"    }
                   ,{ name: 'create_date', 	type: "string"    }
                   ,{ name: 'change_date', 	type: "string"    }
//                   ,{ name: 'srcahd_uid', 	type: "string"    }
                   ,{ name: 'serial_no', 	type: "string" }
                   ,{ name: 'pcs_code',		type: "string"        } 
                   ,{ name: 'std_mh',		type: "string"    }
                   ,{ name: 'process_price', 	type: "string"    }
                   ,{ name: 'price_type', type: "string"    }
//                   ,{ name: 'price_origin', 	type: "string"  }                 
//                   ,{ name: 'delete_flag', 	type: "string"    }
                   ,{ name: 'pcs_name', type: "string"    }
                   //검색옵션
                   ,{ name: 'srch_type', type: "string"    }//multi, single
                   
                   ];

var pcsstdColumn =  [
                    { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                    { text     : 'creator',  		width : 80,  sortable : true, dataIndex: 'creator'  },
                    { text     : 'changer', 	width : 80,  sortable : true, dataIndex: 'changer'  },
                    { text     : 'create_date',  	width : 80,  sortable : true, dataIndex: 'create_date'    },
                    { text     : 'change_date',  	width : 80,  sortable : true, dataIndex: 'change_date'   },
//                    { text     : 'srcahd_uid',width : 80,  sortable : true, dataIndex: 'srcahd_uid'   },
                    { text     : 'serial_no',  width : 80,  sortable : true, dataIndex: 'serial_no'  },
                    { text     : 'pcs_code',   width : 80,  sortable : true, dataIndex: 'pcs_code'  },
                    { text     : 'std_mh',  	width : 80,  sortable : true, dataIndex: 'std_mh'   },
                    { text     : 'process_price',  	width : 80,  sortable : true, dataIndex: 'process_price'   },
                    { text     : 'price_type',  	width : 80,  sortable : true, dataIndex: 'price_type'   },
                    { text     : 'pcs_name',  	width : 80,  sortable : true, dataIndex: 'pcs_name'   }
////                    { text     : 'price_origin',  	width : 80,  sortable : true, dataIndex: 'price_origin'   },
//                    { text     : 'delete_flag',  	width : 80,  sortable : true, dataIndex: 'delete_flag'   }              
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

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
//	store.getProxy().setExtraParam('srcahd_uid', '');
	store.getProxy().setExtraParam('serial_no', '');
	store.getProxy().setExtraParam('process_price', '');
	store.getProxy().setExtraParam('price_type', '');
//	store.getProxy().setExtraParam('price_origin', '');
}

function srchSingleHandler (widName, parmName, isWild) {
	
	resetParam();
	var val = Ext.getCmp(widName).getValue();
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + val + '%';
	}
	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {});
};
//
//var searchHandler = function() {
//	
//	resetParam();
//	
//	var unique_id = Ext.getCmp('srchUnique_id').getValue();
////	var srcahd_uid = Ext.getCmp('srchSrcahd_uid').getValue();
//	var serial_no = Ext.getCmp('srchSerial_no').getValue();
//	var process_price = Ext.getCmp('srchProcess_price').getValue();
//	var price_type = Ext.getCmp('srchPrice_type').getValue();
////	var price_origin = Ext.getCmp('srchPrice_origin').getValue();
//	
//	store.getProxy().setExtraParam("srch_type", 'multi');
//	
//	if(unique_id!=null && unique_id!='') {
//		store.getProxy().setExtraParam('unique_id', unique_id);
//	}
//	
////	if(srcahd_uid!=null && srcahd_uid!='') {
////		store.getProxy().setExtraParam('srcahd_uid', '%' + srcahd_uid + '%');
////	}
//
//	if(serial_no!=null && serial_no!='') {
//		store.getProxy().setExtraParam('serial_no', '%' + serial_no + '%');
//	}
//	if(process_price!=null && process_price!='') {
//		store.getProxy().setExtraParam('process_price', '%' + process_price + '%');
//	}
//	if(price_type!=null && price_type!='') {
//		store.getProxy().setExtraParam('price_type', '%' + price_type + '%');
//	}
////	if(price_origin!=null && price_origin!='') {
////		store.getProxy().setExtraParam('price_origin', '%' + price_origin + '%');
////	}
//	store.load(function() {});
//};

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsStd.load(unique_id ,{
		 success: function(pcsstd) {
			 	var unique_id = pcsstd.get('unique_id');
				var creator = pcsstd.get('creator');
				var changer = pcsstd.get('changer');
//				var srcahd_uid = pcsstd.get('srcahd_uid' );
				var serial_no = pcsstd.get('serial_no');
				var pcs_code = pcsstd.get('pcs_code');
				var std_mh = pcsstd.get('std_mh');
				var process_price = pcsstd.get('process_price');
				var price_type = pcsstd.get('price_type');
				var pcs_name = pcsstd.get('pcs_name');
//				var price_origin = pcsstd.get('price_origin');
				
//				console_log(srcahd_uid);
				console_log(unique_id);
		        
				var lineGap = 30;
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'aaaa',
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
			y: 0 + 1*lineGap,
			name: 'unique_id',
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: 'creator',
			value: creator,
			x: 5,
			y: 0 + 2*lineGap,
			 name: 'creator',
			anchor: '-5'  // anchor width by percentage
			},{
				fieldLabel: 'changer',
				value: changer,
				x: 5,
				y: 0 + 3*lineGap,
				name: 'changer',
				anchor: '-5'  // anchor width by percentage
		    },
//		    {
//		    	fieldLabel: 'srcahd_uid',
//		    	value: srcahd_uid,
//		    	x: 5,
//		    	y: 0 + 4*lineGap,
//		    	name: 'srcahd_uid',
//		    	anchor: '-5'  // anchor width by percentage
//		    },
		    {
		    	fieldLabel: 'serial_no',
		    	value: serial_no,
		    	x: 5,
		    	y: 0 + 4*lineGap,
		    	name: 'serial_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_code',
		    	value: pcs_code,
		    	x: 5,
		    	y: 0 + 5*lineGap,
		    	name: 'pcs_code',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'std_mh',
		    	value: std_mh,
		    	x: 5,
		    	y: 0 + 6*lineGap,
		    	name: 'std_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'process_price',
		    	value: process_price,
		    	x: 5,
		    	y: 0 + 7*lineGap,
		    	name: 'process_price',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'price_type',
		    	value: price_type,
		    	x: 5,
		    	y: 0 + 8*lineGap,
		    	name: 'price_type',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_name',
		    	value: pcs_name,
		    	x: 5,
		    	y: 0 + 9*lineGap,
		    	name: 'pcs_name',
		    	anchor: '-5'  // anchor width by percentage
		    }
//		    		,{
//		    	fieldLabel: 'price_origin',
//		    	value: price_origin,
//		    	x: 5,
//		    	y: 0 + 10*lineGap,
//		    	name: 'price_origin',
//		    	anchor: '-5'  // anchor width by percentage
//		    }
		    ]
		        }); //endof form

		        var win = Ext.create('ModalWindow', {
		            title: CMD_VIEW,
		            width: 500,
		            height: 400,
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
	
	console_log(unique_id);

	PcsStd.load(unique_id ,{
		 success: function(pcsstd) {
			 
			 	var unique_id = pcsstd.get('unique_id');
				var creator = pcsstd.get('creator');
				var changer = pcsstd.get('changer');
				var create_date = pcsstd.get('create_date'  );
				var change_date = pcsstd.get('change_date' );
//				var srcahd_uid = pcsstd.get('srcahd_uid' );
				var serial_no = pcsstd.get('serial_no');
				var pcs_code = pcsstd.get('pcs_code');
				var std_mh = pcsstd.get('std_mh');
				var process_price = pcsstd.get('process_price');
				var price_type = pcsstd.get('price_type');
//				var price_origin = pcsstd.get('price_origin');
//				var delete_flag = pcsstd.get('delete_flag');
				var pcs_name = pcsstd.get('pcs_name');
		        
				var lineGap = 30;
				
				
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'aaaa',
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
		                y: 0 + 1*lineGap,
		                id: 'unique_id',
		                name: 'unique_id',
		                readOnly: true,
		    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		                anchor: '-5'  // anchor width by percentage
		            },{
		                fieldLabel: 'changer',
		                value: changer,
		                x: 5,
		                y: 0 + 2*lineGap,
		                name: 'changer',
		                anchor: '-5'  // anchor width by percentage
		            },{
		    			fieldLabel: 'pcs_code',
		    			value: pcs_code,
		    			x: 5,
		    			y: 0 + 3*lineGap,
		    			name: 'pcs_code',
		    			anchor: '-5'  // anchor width by percentage
		    		},{
				    	fieldLabel: 'std_mh',
				    	value: std_mh,
				    	x: 5,
				    	y: 0 + 4*lineGap,
				    	name: 'std_mh',
				    	anchor: '-5'  // anchor width by percentage
				    },{
				    	fieldLabel: 'process_price',
				    	value: process_price,
				    	x: 5,
				    	y: 0 + 5*lineGap,
				    	name: 'process_price',
				    	anchor: '-5'  // anchor width by percentage
				    },{
				    	fieldLabel: 'price_type',
				    	value: price_type,
				    	x: 5,
				    	y: 0 + 6*lineGap,
				    	name: 'price_type',
				    	anchor: '-5'  // anchor width by percentage
				    },{
				    	fieldLabel: 'pcs_name',
				    	value: pcs_name,
				    	x: 5,
				    	y: 0 + 7*lineGap,
				    	name: 'pcs_name',
				    	anchor: '-5'  // anchor width by percentage
				    }
//				    ,{
//				    	fieldLabel: 'price_origin',
//				    	value: price_origin,
//				    	x: 5,
//				    	y: 0 + 7*lineGap,
//				    	name: 'price_origin',
//				    	anchor: '-5'  // anchor width by percentage
//				    }
		            ]
		        }); //endof form
		    	
		    	//Ext.getCmp('unique_id').setStyle('background', 'red');

		        var win = Ext.create('ModalWindow', {
		            title: CMD_MODIFY,
		            width: 500,
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
		                	var pcsstd = Ext.ModelManager.create(val, 'PcsStd');
		            		//저장 수정
		                   	pcsstd.save({
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
Ext.define('PcsStd.writer.SinglePost', {
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
	           	 var pcsstd = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsStd');
        		
	           	pcsstd.destroy( {
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

//Define  Action
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
                fieldLabel: 'creator',
                x: 5,
                y: 0 + 1*lineGap,
                name: 'creator',
                anchor: '-5'  // anchor width by percentage
            }
//            ,{
//                fieldLabel: 'srcahd_uid',
//                x: 5,
//                y: 0 + 2*lineGap,
//                name: 'srcahd_uid',
//                anchor: '-5'  // anchor width by percentage
//            }
            ,{
                fieldLabel: 'serial_no',
                x: 5,
                y: 0 + 2*lineGap,
                name: 'serial_no',
                anchor: '-5'  // anchor width by percentage
            },{
    			fieldLabel: 'pcs_code',
    			x: 5,
    			y: 0 + 3*lineGap,
    			name: 'pcs_code',
    			anchor: '-5'  // anchor width by percentage
    		},{
		    	fieldLabel: 'std_mh',
		    	x: 5,
		    	y: 0 + 4*lineGap,
		    	name: 'std_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'process_price',
		    	x: 5,
		    	y: 0 + 5*lineGap,
		    	name: 'process_price',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'price_type',
		    	x: 5,
		    	y: 0 + 6*lineGap,
		    	name: 'price_type',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_name',
		    	x: 5,
		    	y: 0 + 7*lineGap,
		    	name: 'pcs_name',
		    	anchor: '-5'  // anchor width by percentage
		    }]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 500,
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
                   	 var pcsstd = Ext.ModelManager.create(val, 'PcsStd');
            		//저장 수정
                   	pcsstd.save({
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

Ext.define('PcsStd', {
	 extend: 'Ext.data.Model',
	 fields: pcsstdFields,
	    proxy: {
			type: 'ajax',
			//url: CONTEXT_PATH + '/production/machine.do?method=getUserList',
	        api: {
	            read: CONTEXT_PATH + '/production/pcsstd.do?method=read',
	            create: CONTEXT_PATH + '/production/pcsstd.do?method=create',
	            update: CONTEXT_PATH + '/production/pcsstd.do?method=update',
	            destroy: CONTEXT_PATH + '/production/pcsstd.do?method=destroy'
	        },
			reader: {
				type: 'json',
				root: 'datas',
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

	 //PcsStd Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsStd',
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
			                        emptyText: 'changer',
			                        id: 'srchName',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchName', 'changer', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchName').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchName', 'name_ko', true);
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
			                        emptyText: 'create_date',
			                        id: 'srchContents',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchContents', 'create_date', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchContents').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchContents', 'changer', true);
			                        	/*
			                        	var board_content = Ext.getCmp('srchContents').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("board_content", '%' +board_content + '%');
			                            //store.reload();
			                        	store.load(function() {});
			                        	*/
			                    	}
			                    },
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
			                                }
			                            ]
			                        }
			                    }

			                 ]
			        }
			        
			        ],
			        columns: pcsstdColumn,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
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
			                },
			                itemdblclick: viewHandler 

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
		    cenerFinishCallback();//Load Ok Finish Callback
		}
		
	});
	 	
    });

