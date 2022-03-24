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
var gridPcsAst = null;
var storePcsAst = null;
var gridCartLine = null;
var storeCartLine = null;

var selectedUid = '';
var selectedCartmapUid = '';
var selectNum = '';



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


	        	var record = gridPcsAst.getStore().getAt(rowIndex);
	        	console_log(record);
	        	var unique_id = record.get('unique_id');
	        	var cartmap_uid = record.get('cartmap_uid');
	        	var srcahd_uid = record.get('srcahd_uid');
	        	var serial_no = record.get('serial_no');
	        	console_log(unique_id);
	        	var direcition = -15;
	        	Ext.Ajax.request({
         			url: CONTEXT_PATH + '/production/pcsstd.do?method=movePcsAstNoDyna',
         			params:{
         				direcition:direcition,
         				cartmap_uid:cartmap_uid,
         				srcahd_uid:srcahd_uid,
         				unique_id:unique_id,
         				serial_no:serial_no
         			},
         			success : function(result, request) {  
         				var result = result.responseText;
         				if(result == 'false'){
         					Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
         				}
         				else{
         					storePcsAst.load(function() {});
         				}
         			}
           	    });


    
				}
				 	

	    },{
	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
	        tooltip: 'Down',
	        handler: function(agridV, rowIndex, colIndex) {

	        	var record = gridPcsAst.getStore().getAt(rowIndex);
	        	console_log(record);
	        	var unique_id = record.get('unique_id');
	        	console_log(unique_id);
	        	var cartmap_uid = record.get('cartmap_uid');
	        	var srcahd_uid = record.get('srcahd_uid');
	        	var serial_no = record.get('serial_no');

	        	var direcition = 15;
	        	Ext.Ajax.request({
         			url: CONTEXT_PATH + '/production/pcsstd.do?method=movePcsAstNoDyna',
         			params:{
         				direcition:direcition,
         				cartmap_uid:cartmap_uid,
         				srcahd_uid:srcahd_uid,
         				unique_id:unique_id,
         				serial_no:serial_no
         			},
         			success : function(result, request) {
         				var result = result.responseText;
         				if(result == 'false'){
         					Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
         				}
         				else{
         					storePcsAst.load(function() {});
         				}
         			}
           	    });	

	        }

	    }]
	};



var viewCartHandler = function() {
	var rec = gridCartLine.getSelectionModel().getSelection()[0];
	var unique_uid = rec.get('unique_uid');

	CartLine.load(unique_uid ,{
		 success: function(cartline) {
			 var item_code = cartline.get('item_code_dash');
			 var item_name = cartline.get('item_name');
			 var specification = cartline.get('specification');
			 var description = cartline.get('description');
			 var model_no = cartline.get('model_no');
			 var comment = cartline.get('comment');
			 var maker_name = cartline.get('maker_name');

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
		            	value: item_code,
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
//
var viewHandler = function() {
	var rec = gridPcsAst.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsAst.load(unique_id ,{
		 success: function(pcsast) {
			 
			 
			 var unique_id = pcsast.get('unique_id');
			 var creator = pcsast.get('creator');
			 var changer = pcsast.get('changer');
			 var create_date = pcsast.get('create_date');
			 var change_date = pcsast.get('change_date');
			 var srcahd_uid	= pcsast.get('srcahd_uid');
			 var serial_no = pcsast.get('serial_no');
			 var pcs_name	= pcsast.get('pcs_name');
			 var pcs_code = pcsast.get('pcs_code');
			 var std_mh	= pcsast.get('std_mh');
			 var process_price = pcsast.get('process_price');
			 var price_type	= pcsast.get('price_type');
			 var price_origin =	pcsast.get('price_origin');
			 var uid_comast = pcsast.get('uid_comast');

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
	var rec = gridPcsAst.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	

	PcsAst.load(unique_id ,{
		 success: function(pcsast) {
			 
			 	var unique_id = pcsast.get('unique_id');
			 	var creator = pcsast.get('creator');
			 	var changer = pcsast.get('changer');
			 	var create_date = pcsast.get('create_date');
			 	var change_date = pcsast.get('change_date');
			 	var srcahd_uid	= pcsast.get('srcahd_uid');
			 	var serial_no = pcsast.get('serial_no');
			 	var pcs_name	= pcsast.get('pcs_name');
			 	var pcs_code = pcsast.get('pcs_code');
			 	var std_mh	= pcsast.get('std_mh');
			 	var process_price = pcsast.get('process_price');
			 	var price_type	= pcsast.get('price_type');
			 	var price_origin =	pcsast.get('price_origin');
			 	var uid_comast = pcsast.get('uid_comast');
				
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
				    	fieldLabel: getColName('cartmap_uid'),
				    	value: selectedCartmapUid,
				    	x: 5,
				    	y: -15 + 3*lineGap,
				    	readOnly: true,
				    	name: 'cartmap_uid',
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
		                	var pcsast = Ext.ModelManager.create(val, 'PcsAst');
		                	
		            		//저장 수정
		                	pcsast.save({
		                		success : function() {
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		storePcsAst.load(function() {});
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

    var selections = gridPcsAst.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridPcsAst.getSelectionModel().getSelection()[i];
        		var unique_id = rec.get('unique_id');
	           	 var pcsast = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsAst');
        		
	           	pcsast.destroy( {
	           		 success: function() {}
	           	});
           	
        	}

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



function stopConfirm(btn){

	var selections = gridCartLine.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var unique_ids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridCartLine.getSelectionModel().getSelection()[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
        	}
    		console_log('unique_ids=' + unique_ids);
        	
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/production/pcsstart.do?method=stopProcessByCartmapUids',
        		params:{
        			unique_id : unique_ids
        		},
        		success : function(result, request){
        			console_log("Success");
                	gridCartLine.store.remove(selections);
        		}
        	});
        }
    }
};

function returnConfirm(btn){

	var selections = gridCartLine.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var unique_ids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridCartLine.getSelectionModel().getSelection()[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
        	}
    		console_log('unique_ids=' + unique_ids);
        	
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/production/pcsstart.do?method=destroyByUids',
        		params:{
        			unique_id : unique_ids
        		},
        		success : function(result, request){
        			console_log("Success");
                	gridCartLine.store.remove(selections);
        		}
        	});
        }
    }
};

var returnAction = Ext.create('Ext.Action', {
	itemId: 'returnButton',
    iconCls: 'return',
    text: epc1_cancelprocess,
    disabled: fPERM_DISABLING(),
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


var stopAction = Ext.create('Ext.Action', {
	itemId: 'stopButton',
   	iconCls : 'remove',
    text: GET_MULTILANG('epj1_stopProc'),
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: epc1_returnk_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: stopConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});



function startConfirm(btn){

	var selections = gridCartLine.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var unique_ids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridCartLine.getSelectionModel().getSelection()[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
        	}
        	console_log('unique_ids=' + unique_ids);
        	
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/production/pcsstart.do?method=startProcessByUids',
        		params:{
        			unique_id : unique_ids
        		},
        		success : function(result, request){
        			console_log("start Success");
                	gridCartLine.store.remove(selections);
        		}
        	});

        }
    }
};

var startAction = Ext.create('Ext.Action', {
	itemId: 'startActionId',
    iconCls: 'play',
    text: epc1_startprocess,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: epc1_delete_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: startConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var pcsaststartAction = Ext.create('Ext.Action', {
	itemId: 'pcsaststartAction',
    iconCls: 'play',
    text: epc1_startprocess,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: epc1_delete_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: pcsaststartConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});



function pcsaststartConfirm(btn){

	var selections = gridPcsAst.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var unique_ids = [];
        	var pcsast_ids = [];
        	var cartmap_uid = '';
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridPcsAst.getSelectionModel().getSelection()[i];
        		cartmap_uid = rec.get('cartmap_uid');
        		var unique_uid = rec.get('pcsstd_uid');
        		var pcsast_uid = rec.get('unique_id');
        		unique_ids.push(unique_uid);
        		pcsast_ids.push(pcsast_uid);
        	}
        	console_log('unique_ids=' + unique_ids);
        	
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/production/pcsstart.do?method=startProcessByPcsUid',
        		params:{
        			unique_id : unique_ids,
        			cartmap_uid : cartmap_uid,
        			pcsast_id : pcsast_ids
        		},
        		success : function(result, request){
        			storePcsAst.load(function() {});
        			console_log("start Success");
        		}
        	});
        }
    }
};






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
	                },{
	                    fieldLabel: getColName('cartmap_uid'),
	                    value : selectedCartmapUid,
	                    x: 5,
	                    y: 0 + 5*lineGap,
	                    xtype: 'displayfield',
	                    name: 'cartmap_uid',
	                    anchor: '-5'  // anchor width by percentage
	                	}
    		    ]
        });
    	
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/production/pcsast.do?method=nextCode',
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
		    	val["cartmap_uid"] = selectedCartmapUid;
		    	var pcsast = Ext.ModelManager.create(val, 'PcsAst');
		    	var pcs_code = val["pcs_code"];
		    	var srcahd_uid = selectedUid;
		    	console_log("pcsast : "+pcsast.toString());
		    	console_log("pcs_code : "+pcs_code);
		    	console_log("srcahd_uid : "+srcahd_uid);
		       	pcsast.save({
		       		success : function() {
		       			storePcsAst.load();
		       		}
		       	});
       	
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

	Ext.define('CartLine', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS_SUB,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/pcsstart.do?method=read&has_pcsstd=Y',
		            create: CONTEXT_PATH + '/production/pcsstart.do?method=create',
		            update: CONTEXT_PATH + '/production/pcsstart.do?method=update',
		            destroy: CONTEXT_PATH + '/production/pcsstart.do?method=destroy'
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
	
	console_log(/*(G)*/vCENTER_FIELDS);

	makeSrchToolbar([]);
	
	var tempColumn = [];
	
	tempColumn.push(updown);
	
	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
		tempColumn.push(vCENTER_COLUMNS[i]);
	}
	
	
	Ext.define('PcsAst', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/pcsstd.do?method=pcsastread'
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

	
	storeCartLine = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'CartLine',
		sorters: [{
	       property: 'unique_id',
	       direction: 'DESC'
	   }]
	});

	storePcsAst = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsAst',
		sorters: [{
           property: 'serial_no',
           direction: 'ASC'
       }]
	});
	
	
	
	storeCartLine.load(function() {
		var selModelC = Ext.create('Ext.selection.CheckboxModel', {
		    listeners: {
		        selectionchange: function(sm, selections) {
		        	gridCartLine.down('#returnButton').setDisabled(selections.length == 0);
		        }
		    }
		});
			
			gridCartLine = Ext.create('Ext.grid.Panel', {
			        store: storeCartLine,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModelC,
			        autoScroll: true,
			        autoHeight: true,
			        split: true,
	                region: 'west',
	                width: '65%',
	                height: '100%',
			        bbar: getPageToolbar(storeCartLine),

			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
				                    returnAction,
				                    '-',
				                    startAction,
				                    '-',
				                    stopAction,
				                    '-',
				                    new Ext.form.Hidden({
								    	id: 'is_ordered',
								       name: 'is_ordered'
								    }),
				                    { 
							        	xtype : "button", 
							    		toggleGroup: 'ordered-notordered',
							    		pressed: true,
							    	 	text : GET_MULTILANG('epj1_notordered'),
							    	 	value: 'N',
							    		handler: function(){
								    		    var hiddenFrm = Ext.getCmp('is_ordered'); 
								    		    hiddenFrm.setValue(this.value);
								    		    console_log('set to ' + 'is_ordered' + ':' + this.value);
								    		    stopAction.disable();
								    		    
								    		    storeCartLine.proxy.extraParams.is_ordered = this.value;
		                		   				storeCartLine.load({});
							    		}
							    	},
							    	{ 
							        	xtype : "button", 
							    		toggleGroup: 'ordered-notordered',
							    		pressed: false,
							    	 	text : GET_MULTILANG('epj1_ordered'),
							    	 	value: 'Y',
							    		handler: function(){
							    		    var hiddenFrm = Ext.getCmp('is_ordered'); 
							    		    hiddenFrm.setValue(this.value);
							    		    console_log('set to ' + 'is_ordered' + ':' + this.value);
							    		    stopAction.enable();
								    		    storeCartLine.proxy.extraParams.is_ordered = this.value;
		                		   				storeCartLine.load({});
							    		}
							    	}
			                    ]
			        },
			         {
			            xtype: 'toolbar',
			            items: getProjectTreeToolbar()
			        },
      				{
  		        		xtype: 'toolbar',
			            items: ELEGubunToolbar()
      		        }
			        ],
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
									
								}
			            		,
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
				gridCartLine.getSelectionModel().on({
			        selectionchange: function(sm, selections) {
			            if (selections.length) {
			            	if(fPERM_DISABLING()==true) {
				            	returnAction.disable();
				            	startAction.disable();
				            	storePcsAst.getProxy().setExtraParam('srcahd_uid', '');
			                	var rec = gridCartLine.getSelectionModel().getSelection()[0];
			                	var unique_id = rec.get('unique_id');
			                	var unique_uid = rec.get('unique_uid');
			                	var item_code = rec.get('item_code_dash');
			                	var item_name = rec.get('item_name');
			                	var pl_no  = rec.get('pl_no');
			                	console_info(unique_id);
			                	storePcsAst.getProxy().setExtraParam('srcahd_uid', unique_id);
			                	storePcsAst.getProxy().setExtraParam('cartmap_uid', unique_uid);
			                	storePcsAst.load(function(){});
			                	selectedUid = unique_id;
			                	selectedCartmapUid = unique_uid;
			                	
			                	if(gridPcsAst != null){
			                		gridPcsAst.setTitle('[' + pl_no + '] ' + item_name);
			                	}
			            	}else{
			            		returnAction.enable();
			            		startAction.enable();
				            	storePcsAst.getProxy().setExtraParam('srcahd_uid', '');
			                	var rec = gridCartLine.getSelectionModel().getSelection()[0];
			                	var unique_id = rec.get('unique_id');
			                	var unique_uid = rec.get('unique_uid');
			                	var item_code = rec.get('item_code_dash');
			                	var item_name = rec.get('item_name');
			                	var pl_no  = rec.get('pl_no');
			                	console_info(unique_id);
			                	storePcsAst.getProxy().setExtraParam('srcahd_uid', unique_id);
			                	storePcsAst.getProxy().setExtraParam('cartmap_uid', unique_uid);
			                	storePcsAst.load(function(){});
			                	selectedUid = unique_id;
			                	selectedCartmapUid = unique_uid;
			                	if(gridPcsAst != null){
			                		gridPcsAst.setTitle('[' + pl_no + '] ' + item_name);
			                	}
			            	}
			            	detailCartAction.enable();
			            } else {
			            	if(fPERM_DISABLING()==true) {
			            		collapseProperty();
				            	addAction.disable();
				            	returnAction.disable();
				            	startAction.disable();
		                		gridPcsAst.setTitle('-');
			            	}else{
			            		collapseProperty();
				            	addAction.disable();
				            	returnAction.disable();
				            	startAction.disable();
		                		gridPcsAst.setTitle('-');
			            	}
			            	detailCartAction.enable();
			            	var unique_id = null;
			            	storePcsAst.getProxy().setExtraParam('srcahd_uid', unique_id);
			            	storePcsAst.load(function(){});
			            }
			        }
			    });
				
				
				var selModel = Ext.create('Mplm.util.SelModelCheckboxLock', {onlyCheckOwner: true});
				gridPcsAst = Ext.create('Ext.grid.Panel', {
						id : 'tempport',
				        store: storePcsAst,
				        ///COOKIE//stateful: true,
				        collapsible: true,
				        multiSelect: true,
				        stateId: 'stateGrid1' + /*(G)*/vCUR_MENU_CODE,
				        selModel: selModel,
				        autoScroll: true,
				        autoHeight: true,
		                region: 'east',
		                split: true,
		                width: '35%',
		                height: '100%',
		                bbar: getPageToolbar(storePcsAst),

				        
				        dockedItems: [{
				            dock: 'top',
				            xtype: 'toolbar',
				            items: [
									pcsaststartAction
		      				          ]
				        }
				        ],
				        columns: /*(G)*/tempColumn,
				        title: '-'

				    });
				
			    gridPcsAst.getSelectionModel().on({
			        selectionchange: function(sm, selections) {
			            if (selections.length) {
							//grid info 켜기
							
							if(fPERM_DISABLING()==true) {
				            	pcsaststartAction.disable();
				            	removeAction.disable();
				            	editAction.disable();
							}else{
				            	pcsaststartAction.enable();
								removeAction.enable();
				            	editAction.enable();
							}
							detailAction.enable();
			            } else {
			            	if(fPERM_DISABLING()==true) {
			            		pcsaststartAction.disable();
			            		removeAction.disable();
				            	editAction.disable();
			            	}else{
			            		pcsaststartAction.disable();
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

			    /*var main =  Ext.create('Ext.panel.Panel', {
			    	title: '',
			        height: getCenterPanelHeight(),
				    layout:'border',
			        border: false,
			        layoutConfig: {columns: 2, rows:1},
				    defaults: {
				        collapsible: true,
				        split: true,
				        cmargins: '5 0 0 0',
				        margins: '0 0 0 0'
				    },
				    
				    items: [gridCartLine,gridPcsAst]
				});
				console_log('end create');   
				fLAYOUT_CONTENT(main); */
				fLAYOUT_CONTENTMulti([gridCartLine,gridPcsAst]); 
				cenerFinishCallback();//Load Ok Finish Callback	
			});
		});	//OnReady
