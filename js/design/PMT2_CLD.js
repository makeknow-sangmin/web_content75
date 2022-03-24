//표준자재 클라우드

var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

//global var.
var grid = null;
var store = null;

var commonCurrencyStore = null;
var selectedPjUid = null;
var selectedAssyUid = null;
var selectedMoldCode = '';
var selectedMoldCoord = '';
var selectedMoldName = '';
var selectedPj_code='';

var edite_standard_flag = '';
//검색필드정의: define search field
searchField = 
	[
	'barcode',
	'item_code',
	'item_name',
	'specification',
	'maker_name'
	];

var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
var cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();

function resetParam() {
	store.getProxy().setExtraParam('barcode', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
	store.getProxy().setExtraParam('maker_name', '');
}

function srchTreeHandler (treepanel, store, widName, parmName) {
	
	console_info("srchSingleHandler");
	treepanel.setLoading(true);
	
	resetParam(store, searchField);
	var val = Ext.getCmp(widName).getValue();
	console_log('val'+val);

	store.getProxy().setExtraParam(parmName, val);
	
	store.load({
	    callback: function(records, operation, success) {

	    	treepanel.setLoading(false);
	        // treepanel.expandAll();
	    }                               
	});
};
function createEditForm(srcahd){
	
	console_log(srcahd);
	
	var unique_id = srcahd.get('unique_id');
	var item_name = srcahd.get('item_name');
	var specification = srcahd.get('specification');
	var description = srcahd.get('description');
	var sales_price = srcahd.get('sales_price');
//	var standard_flag_disp = srcahd.get('standard_flag_disp');
	var standard_flag = srcahd.get('standard_flag');
	edite_standard_flag=standard_flag;
	var model_no = srcahd.get('model_no');
	var comment = srcahd.get('comment');
	var maker_name = srcahd.get('maker_name');
	var image_path = srcahd.get('image_path');
	var class_code1 = srcahd.get('class_code1');
	var class_code2 = srcahd.get('class_code2');
	var unit_code = srcahd.get('unit_code');
	var currency = srcahd.get('currency');
	var seller_name = srcahd.get('seller_name');
	var class_code = srcahd.get('class_code');
	var image_no = srcahd.get('image_no');
	var remark = srcahd.get('remark');
	var item_code = srcahd.get('item_code');
	var currency = srcahd.get('currency');
	var request_comment = srcahd.get('request_comment');
	var stock_qty = srcahd.get('stock_qty');
	var stock_qty_useful = srcahd.get('stock_qty_useful');
	var stock_qty_safe = srcahd.get('stock_qty_safe');
	var alter_reason = srcahd.get('alter_reason');
	var split_request_comment = request_comment.split('| ');
	var reference1 = '';
	var reference2 = '';
	
	for(var i = 0; i<2; i++){
		reference1=split_request_comment[0];
		reference2=split_request_comment[1];
	}
	
	var lineGap = 30;
	
	
	var form = Ext.create('Ext.form.Panel', {
		id : 'formPanel',
        layout: 'absolute',
        defaultType: 'textfield',
        border: false,
        bodyPadding: 15,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 60
        },
        items: [new Ext.form.Hidden({
    		id: 'standard_flag',
    		name: 'standard_flag'
        }),new Ext.form.Hidden({
    		id: 'sg_code',
    		name: 'sg_code',
    		value : 'STD'
    	}),new Ext.form.Hidden({
    		id: 'request_comment',
    		name: 'request_comment'
    	}),{
        	value: unique_id,
        	xtype: 'textfield',
        	x: 5,
        	y: 5, 
        	name: 'unique_id',
        	readOnly: true,
        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
        	anchor: '100%'  
        },{
            xtype: 'fieldset',
            x: 5,
            y: 3 + 1*lineGap,
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
                    fieldLabel: panelSRO1144,
                    defaults: {
                        hideLabel: true
                    },
                    items : [       
                        {
                        	fieldLabel:    getColName('class_code'),
                		    id:          'class_code1',
                		    name:          'class_code1',
                		    emptyText: dbm1_class_code1,
                		    value: class_code1,
                        	xtype:          'combo',
                            mode: 'local',
                            editable:false,
                            disabled: true,
                            allowBlank: false,
                            queryMode: 'remote',
                            displayField:   'name',
                            valueField:     'value',
	                            store: Ext.create('Ext.data.Store', {
	                                fields : ['name', 'value'],
	                                data   : comboClass1
	                            }),
	                            triggerAction: 'all',
	   	   	               	listeners: {
	   	   	                    select: function (combo, record) {		   	   	                  
		   	   	                  CmaterialStore.proxy.extraParams.level = '2';
		   	   	                  CmaterialStore.proxy.extraParams.parent_class_code = this.getValue();
		   	
		   	   	                  CmaterialStore.load( function(records) {
	   	   	                	  
				   	   	                var obj2 = Ext.getCmp('class_code2'); 
				   	   	                var obj3 = Ext.getCmp('image_path'); 
				   	   	                var obj4 = Ext.getCmp('item_name'); 
				   	   	                obj2.clearValue();//text필드에 있는 name 삭제
				   	   	                obj2.store.removeAll();//class_code2필드에서 보여지는 값을 삭제					   	   	                
				   	   	                obj3.reset();		   	   	                
				   	   	                obj4.reset();			   	   	                
				   	   	                
				   	   	                for (var i=0; i<records.length; i++){ 
				   	   	                	var classObj = records[i];
				   	   	                	var class_code = classObj.get('class_code_full');
				   	   	                	var class_name = classObj.get('class_name');				   	   	                	
				   	   	                	console_log(class_code + ':' + class_name);			   	   	                	
						   	   	             obj2.store.add({
								   	   	            class_name: '[' + class_code + ']' + class_name
											 });
				   	   	                 }		
		   	   	                  });						   	   	      
	   	   	                  }
	   	   	               }
                        },  {
                        	fieldLabel:    getColName('class_code'),
                		    id:          'class_code2',
                		    name:          'class_code2',
                		    emptyText: dbm1_class_code2,
                		    value: class_code2,
                        	xtype:          'combo',
                            mode: 'local',
                            editable:false,
                            disabled: true,
                            allowBlank: true,
                            triggerAction: 'all',
                            queryMode: 'local',	
                            displayField:   'class_name' ,
	                            listeners: {
	                            	select: function (combo, record) {		  
   	                            	console_log('Selected Value : ' + combo.getValue());
					   	   	        Class_code = Ext.getCmp('class_code2').getValue();
					   	   	       
                      				var code = Class_code.substring(1,6);
                      				var code5 = Class_code.substring(1,5);
                      				var name = Class_code.substring(7,Class_code.length);
                      				var name5 = Class_code.substring(6,Class_code.length);
                      				if( Class_code.substring(6,7) == ']'){
                      					console_log('Class_code[6]!!!! ');
                      					Ext.getCmp('image_path').setValue(code+'-'); 
                      					Ext.getCmp('item_name').setValue(name); 
                      					Ext.getCmp('class_code').setValue(code);        					
                      				}else{
                      					console_log('Class_code.....');
                      					Ext.getCmp('image_path').setValue(code5+'-'); 
                      					Ext.getCmp('item_name').setValue(name5); 
                      					Ext.getCmp('class_code').setValue(code5);  
                      				}		
   	                            }
	                            }
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            width:          70,
                            emptyText: getColName('class_code'), 
                            name : 'class_code',
                            id : 'class_code',
                            fieldLabel: getColName('class_code'),
                            value : class_code,
                            disabled: false,
                            readOnly : false
//                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            width:          70,
                            name : 'image_path',
                            emptyText: dbm1_pl_no,
                            id : 'image_path',
                            fieldLabel: getColName('image_path'),
                            value : image_path,
                            disabled: false,
                            readOnly : false
//                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'item_name',
                            emptyText: '품명',
                            id : 'item_name',
                            fieldLabel: getColName('item_name'),
                            value : item_name,
                            disabled: false,
                            readOnly : false
//                            allowBlank: false
                        }
                    ]
                }
            ]
        }, {
        	x: 5,
            y: 20 + 3*lineGap,
            width:          80,
            id:           'standard_flag_disp',
            name:           'standard_flag_disp',
            value: standard_flag,
            xtype:          'combo',
            mode:           'local',
            editable:       false,
            allowBlank: true,
            queryMode: 'remote',
            displayField:   'codeName',
            triggerAction:  'all',
            fieldLabel: getColName('standard_flag'),
           store: commonStandardStore,
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
	                    	Ext.getCmp('standard_flag').setValue(systemCode);
	                    }
	               }
    },
        {
        	 fieldLabel: getColName('description'),
            x: 5,
            y: 20 + 4*lineGap,
            name: 'description',
            id: 'description',
            value: description,
            allowBlank: true,
            anchor: '-5'  // anchor width by percentage
        },{
        	 fieldLabel: getColName('specification'),
            x: 5,
            y: 20 + 5*lineGap,
            name: 'specification',
            id: 'specification',
            value: specification,
            allowBlank: true,
            anchor: '-5'  // anchor width by percentage
        },{
            //the width of this field in the HBox layout is set directly
            //the other 2 items are given flex: 1, so will share the rest of the space
            width:          80,
            x: 5,
            y: 20 + 6*lineGap,
            id:           'model_no',
            name:           'model_no',
            value: model_no,
            xtype:          'combo',
            mode:           'local',
            editable:       false,
            allowBlank: true,
            queryMode: 'remote',
            displayField:   'codeName',
            valueField:     'codeName',
            triggerAction:  'all',
            fieldLabel: getColName('model_no'),
           store: commonModelStore,
            listConfig:{
            	getInnerTpl: function(){
            		return '<div data-qtip="{systemCode}">{codeName}</div>';
            	}			                	
            },
            listeners: {			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							systemCode:'',
							codeNameEn: '',
							codeName: ''
					};
					
					this.add(blank);
				}

			    },
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
    },{
        	fieldLabel: getColName('comment'),
            x: 5,
            y: 20 + 7*lineGap,
            name: 'comment',
            id: 'comment',
            value: comment,
            allowBlank: true,
            anchor: '-5'  // anchor width by percentage
//        },{
//        	fieldLabel: getColName('maker_name'),
//            x: 5,
//            y: 20 + 8*lineGap,
//            name: 'maker_name',
//            id: 'maker_name',
//            value: maker_name,
//            allowBlank: true,
//            anchor: '-5'  // anchor width by percentage
//        },
    },{
    	fieldLabel: getColName('seller_name'),
        x: 5,
        y: 20 + 8*lineGap,
        name: 'seller_name',
        id: 'seller_name',
        value: seller_name,
        allowBlank: true,
        anchor: '-5'  // anchor width by percentage
	    },{
	    	fieldLabel: getColName('image_no'),
	        x: 5,
	        y: 20 + 9*lineGap,
	        name: 'image_no',
	        id: 'image_no',
	        value: image_no,
	        allowBlank: true,
	        anchor: '-5'  // anchor width by percentage
	    },{
	    	fieldLabel: getColName('alter_reason'),
	    	x: 5,
	    	y: 20 + 10*lineGap,
	    	name: 'alter_reason',
	    	id: 'alter_reason',
	    	value: alter_reason,
	    	allowBlank: true,
	    	anchor: '-5'  // anchor width by percentage
	    },{
	    	fieldLabel: getColName('remark'),
	        x: 5,
	        y: 20 + 11*lineGap,
	        name: 'remark',
	        id: 'remark',
	        value: remark,
	        allowBlank: true,
	        anchor: '-5'  // anchor width by percentage
	    },{
	    	fieldLabel: dbm1_reference1,
	        x: 5,
	        y: 20 + 12*lineGap,
	        name: 'reference1',
	        id: 'reference1',
	        value: reference1,
	        allowBlank: true,
	        anchor: '-5'  // anchor width by percentage
	    },{
	    	fieldLabel: dbm1_reference2,
	        x: 5,
	        y: 20 + 13*lineGap,
	        name: 'reference2',
	        id: 'reference2',
	        value: reference2,
	        allowBlank: true,
	        anchor: '-5'  // anchor width by percentage
	    },{
	    	fieldLabel: getColName('item_code'),
	        x: 5,
	        y: 20 + 14*lineGap,
	        name: 'item_code',
	        id: 'item_code',
	        value: item_code,
	        allowBlank: true,
	        anchor: '-5'  // anchor width by percentage
        },{
        	fieldLabel: getColName('stock_qty_safe'),
        	xtype: 'numberfield',
        	margins: '0',
        	minValue: 0,
            x: 5,
            y: 20 + 15*lineGap,
            name: 'stock_qty_safe',
            id: 'stock_qty_safe',
            value: stock_qty_safe,
            allowBlank: true,
            anchor: '-5'  // anchor width by percentage
        },{
        	fieldLabel: getColName('stock_qty_useful'),
        	xtype: 'numberfield',
        	margins: '0',
        	minValue: 0,
            x: 5,
            y: 20 + 16*lineGap,
            name: 'stock_qty_useful',
            id: 'stock_qty_useful',
            value: stock_qty_useful,
            allowBlank: true,
            anchor: '-5'  // anchor width by percentage
        },{
        	fieldLabel: getColName('stock_qty'),
        	xtype: 'numberfield',
        	margins: '0',
        	minValue: 0,
            x: 5,
            y: 20 + 17*lineGap,
            name: 'stock_qty',
            id: 'stock_qty',
            value: stock_qty,
            allowBlank: true,
            anchor: '-5'  // anchor width by percentage
        },   	
        {
            xtype: 'fieldset',
            x: 5,
            y: 26 + 18*lineGap,
            border: true,
            title: panelSRO1174,
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
//                             {
//		                        xtype: 'displayfield',
//		                        value: ' '+panelSRO1186+':'
//		                    }, 
//                             {
//                                 xtype: 'numberfield',
//                                 minValue: 0,
//                                 width : 70,
//                                 name : 'quan',
//                                 fieldLabel: getColName('quan'),
//                                 allowBlank: true,
//                                 value: '1',
//                                 margins: '0'
//                             },
                             {
		                        xtype: 'displayfield',
		                        value: '&nbsp;&nbsp;'+panelSRO1187+':'
		                    }, {
                            //the width of this field in the HBox layout is set directly
	                            //the other 2 items are given flex: 1, so will share the rest of the space
	                            width:          80,
	                            id:           'unit_code',
	                            name:           'unit_code',
	                            value: unit_code,
	                            xtype:          'combo',
	                            mode:           'local',
	                            editable:       false,
	                            allowBlank: false,
	                            queryMode: 'remote',
	    		                displayField:   'codeName',
	    		                valueField:     'codeName',
	                            value:          unit_code,
	                            triggerAction:  'all',
	                            fieldLabel: getColName('unit_code'),
    		                   store: commonUnitStore,
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
    	         	                    }
    	         	               }
                        },
                        {
                            xtype: 'displayfield',
                            value: ' '+panelSRO1188+':'
                        },
                        {
                            xtype: 'numberfield',
                            minValue: 0,
                            flex: 1,
                            name : 'sales_price',
                            id : 'sales_price',
                            value: sales_price,
                            fieldLabel: getColName('sales_price'),
                            allowBlank: true,
                            value: sales_price,
                            margins: '0'
                        }, {
                            //the width of this field in the HBox layout is set directly
                            //the other 2 items are given flex: 1, so will share the rest of the space
                            width:          80,
                            id:           'currency',
                            name:           'currency',
                            value: currency,
                            xtype:          'combo',
                            mode:           'local',
                            editable:       false,
                            allowBlank: false,
                            queryMode: 'remote',
    		                displayField:   'codeName',
    		                valueField:     'codeName',
                            value:          'RMB',
                            triggerAction:  'all',
                            fieldLabel: getColName('currency'),
		                   store: commonCurrencyStore,
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
         	                    }
         	               }
                    }
                    ]
                }
            ]
        }
        ]
    }); //endof form
	return form;
}

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			SrcAhd.load(unique_id ,{
        				 success: function(srcahd) {

        				        var win = Ext.create('ModalWindow', {
        				        	title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
        				            width: 700,
        				            height: 550,
        				            minWidth: 250,
        				            minHeight: 180,
        				            layout: 'fit',
        				            plain:true,
        				            items: createEditForm(srcahd),
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
        				 }//endofsuccess
        			 });//emdofload
        	
        };

var editHandler = function() {
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			SrcAhd.load(unique_id ,{
                				 success: function(srcahd) {
                				        var win = Ext.create('ModalWindow', {
                				        	title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
                				            width: 700,
                				            height: 670,
                				            minWidth: 250,
                				            minHeight: 180,
                				            layout: 'fit',
                				            plain:true,
                				            items: createEditForm(srcahd),
                				            buttons: [{
                				                text: CMD_OK,
                				            	handler: function(){
                				            		Ext.getCmp('request_comment').setValue(Ext.getCmp('reference1').getValue() +' | '+ Ext.getCmp('reference2').getValue());
                				            		Ext.getCmp('standard_flag').setValue(edite_standard_flag);
                				                    var form = Ext.getCmp('formPanel').getForm();
                				                    if(form.isValid())
                				                    {
                				                	var val = form.getValues(false);
                				                	console_info(Ext.JSON.encode(val));
                				                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
                				                	console_info(Ext.JSON.encode(val));
                				                	var srcahd = Ext.ModelManager.create(val, 'SrcAhd');
                				            		//저장 수정
                				                	srcahd.save({
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

//writer define
Ext.define('SrcAhd.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});


function bomCopyConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    console_logs('selections', selections);
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var uids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
        		uids.push(unique_id);
        	}
           console_logs('uids', uids);
        	
      	   Ext.Ajax.request({
      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyStandard',
      			params:{
      				project_uid: selectedPjUid,
      				parent_uid:  selectedAssyUid,
      				unique_ids: uids
      			},
      			success : function(result, request) {   
      				var result = result.responseText;
      				Ext.MessageBox.alert('결과','총 ' + result + '건을 복사하였습니다.');
      			},
      			failure: extjsUtil.failureMessage
      		});
        }

    }
};
function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var srcahd = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'SrcAhd');
        		
	           	srcahd.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

function putMyPartConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var myPart = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'MyPart');
	           	myPart.save( {
	           		 success: function() {
	           		 }
	           	});
        	}
        }
    }
};

//BOM Copy
var bomCopyAction = Ext.create('Ext.Action', {
	itemId: 'bomCopyActionButton',
    iconCls: 'application_side_expand',
    text: '복사',
    disabled: true,
    handler: function(widget, event) {
    	
    	if(selectedAssyUid==null || selectedAssyUid=='' || selectedPjUid==null || selectedPjUid=='') {
    		Ext.MessageBox.alert('오류','먼저 BOM을 복사할 \r\n대상 Assembly를선택하세요.');
    	} else {
        	Ext.MessageBox.show({
                title:'BOM 복사',
                msg: '선택한 자재를 현 Assembly로 복사 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: bomCopyConfirm,
                icon: Ext.MessageBox.QUESTION
            });    		
    	}
    	

    }
});


//mypart action button!
var putMyPartAction = Ext.create('Ext.Action', {
	itemId: 'myPartButton',
    iconCls: 'star',
    text: panelSRO1192,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: move_part_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: putMyPartConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

function crossDomainPost(batchParamnIn) {
	  console_logs('batchParamnIn', batchParamnIn);
	  var batchParam = Ext.encode(batchParamnIn);
	  console_logs('batchParam', batchParam);
	  // Add the iframe with a unique name
	  var iframe = document.createElement("iframe");
	  var uniqueString = RandomString(10);
	  document.body.appendChild(iframe);
	  iframe.style.display = "none";
	  iframe.contentWindow.name = uniqueString;

	  // construct a form with hidden inputs, targeting the iframe
	  var form = document.createElement("form");
	  form.target = uniqueString;
	  form.action =  'http://' + vBARCODE_URL + '/print/BarcodePrint';
	  form.method = "POST";

	  // repeat for each parameter
	  var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "batchParam";
	  input.value = batchParam;
	  form.appendChild(input);
	  
	  document.body.appendChild(form);
	  form.submit();
	}

var printBarcode = Ext.create('Ext.Action', {
	itemId: 'printBarcode',
    iconCls: 'barcode',
    text: barcode_print,
    disabled: false,
    handler: function(widget, event) {
    	
        var selections = grid.getSelectionModel().getSelection();
        if (selections) {
        	var batchParam = '';
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var barcode = rec.get('unique_id');
            		var qty = '1';
            		
            		var spec = rec.get('specification');
            		var item_code = rec.get('item_code');
            		var item_name = rec.get('item_name');
            		var maker_name = rec.get('maker_name');
            		
            		spec = spec.replace(/:/g, '_');
            		item_code = item_code.replace(/:/g, '_');
            		item_name = item_name.replace(/:/g, '_');
            		maker_name = maker_name.replace(/:/g, '_');
            		
            		if(i>0) {
            			batchParam = batchParam + ';';
            		}
            		batchParam = batchParam + barcode + 
            		':' + spec + 
            		':' + qty +
            		':' + item_code +
            		':' + item_name +
            		':' + maker_name
            		;
            		

            	}
            	crossDomainPost(batchParam);
            	console_logs('batchParam', batchParam);
        }
    	
    }
});


var CmaterialStore = new Ext.create('Ext.data.Store', {

	fields:[     
	        { name: 'parent_class_code', type: "string"  }
	        ,{ name: 'class_name', type: "string" }
	        ,{ name: 'class_code_full', type: "string"  }  
	        ],	
	        proxy: {
	        	type: 'ajax',
	        	url: CONTEXT_PATH + '/design/class.do?method=read',
	        	reader: {
	        		type:'json',
	        		root: 'datas',
	        		totalProperty: 'count',
	        		successProperty: 'success'
	        	},
	        	extraParams : {
	        		level: '',
	        		parent_class_code: ''
	        	}
	        	,autoLoad: true
	        }
});

var PmaterialStore = new Ext.create('Ext.data.Store', {
	//type: 'calss_code1',
 	fields:[     
 	  	      { name: 'parent_class_code', type: "string"  }
 	  	      ,{ name: 'class_name', type: "string" }
 	  	      ,{ name: 'class_code_full', type: "string"  }  
 	  	      ,{ name: 'level', type: "string"  } 
  	  ],	
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/design/class.do?method=read',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         },
         extraParams : {
        	 level: '',
        	 parent_class_code: ''
         }
         ,autoLoad: true
     	}
 });

var comboClass1= [];
var comboClass2= [];
var Class_code=[];

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var excel_sample = Ext.create('Ext.Action', {
	iconCls:'MSExcelTemplateX',
    text: GET_MULTILANG('dbm1_template'),
//    disabled: true,
    handler: function(widget, event) {
    	var lang = vLANG;
    	switch(lang) {
			case 'ko':
				path='cab/PMT1_Excel_Format_ko.xlsx'; //상대경로 사용
				break;
			case 'zh':
				path='cab/PMT1_Excel_Format_zh.xlsx';
				break;
			case 'en':
				path='cab/PMT1_Excel_Format_en.xlsx';
				break;
			}
    	window.location = CONTEXT_PATH + '/extjs/ux/filedown.do?method=direct&path='+path;
    }
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

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [/*putMyPartAction,*/ bomCopyAction ]
});

Ext.onReady(function() {  
	commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
	commonStandardStore  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false,useYn:'Y'} );
	commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: true} );
	commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
	
	LoadJs('/js/util/comboboxtree.js');
	LoadJs('/js/util/PartHistory.js');
	
	//parent classcode loading
    PmaterialStore.proxy.extraParams.level = '1';
    PmaterialStore.load( function(records) {
        for (var i=0; i<records.length; i++){
        	var classObj = records[i];
        	var class_code = classObj.get('class_code_full');
        	var class_name =  classObj.get('class_name');
        	
        	var obj = {};
        	obj['name'] = '[' + class_code + ']' + class_name;
        	obj['value'] = class_code;
        	comboClass1.push(obj);
        }
    });
	
	//프로젝트 툴바
	var projectToolBar = getProjectToolbar(true/*hasPaste*/, false/*excelPrint*/) ;
	makeSrchToolbar(searchField);
	
	Ext.define('NxExcel', {
		 extend: 'Ext.data.Model',
		 fields:  [ { name: 'file_itemcode', 	type: "string"    },     
			         { name: 'menu', 	type: "string"    }
			         ],
		    proxy: {
				type: 'ajax',
		        api: {
		        	create: CONTEXT_PATH + '/design/upload.do?method=excelStandard&menu='+vCUR_MENU_CODE /*1recoed, search by cond, search */
		        },
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});
	
	
	Ext.define('SrcAhd', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/material.do?method=read'+ '&vCUR_MENU_CODE=' + vCUR_MENU_CODE, /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/purchase/material.do?method=create'+ '&vCUR_MENU_CODE=' + vCUR_MENU_CODE, /*create record, update*/
		            update: CONTEXT_PATH + '/purchase/material.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroy' /*delete*/
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

Ext.define('MyPart', {
	 extend: 'Ext.data.Model',
	 fields: [ { name: 'unique_id', 	type: "string"    }     ],
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/purchase/material.do?method=createMypart',
	            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroyMypart'
	            
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
		model: 'SrcAhd',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
 	store.load(function() {
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			/*
			if(dataIndex!='no') {
				if('sales_price' == dataIndex) {
					columnObj["editor"] = {
	                };	
				}
			}*/
			
			switch(dataIndex) {
			case 'sales_price':
				columnObj["editor"] = { };	
				break;
			case 'item_code_dash':
				columnObj["renderer"] = renderPohistoryItemCode;
				break;
			}
		});
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        height: getCenterPanelHeight(), 
			        region: 'center',
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',/* putMyPartAction, '-', */
			                    '-', printBarcode,
	      				        
	      				          ]
			        },
//			        {
//			            xtype: 'toolbar',
//			            items: getProjectTreeToolbar()
//			        },
      				{
      					xtype: 'toolbar',
      					items: /*(G)*/vSRCH_TOOLBAR
      				}
			        
			        ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        plugins: [cellEditing],
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
			
			 grid.getSelectionModel().on({
			        selectionchange: function(sm, selections) {
			            if (selections.length) {
							//grid info 켜기
							displayProperty(selections[0]);
							
							if(fPERM_DISABLING()==true) {

				            	putMyPartAction.disable();
				            	bomCopyAction.disable();
							}else{

				            	putMyPartAction.enable();
				            	bomCopyAction.enable();
							}
			            } else {
			            	collapseProperty();

			            	putMyPartAction.disable();
			            	bomCopyAction.disable();

			            }
			        }
			    });

			 
			var pjTreeGrid =
		    	Ext.create('Ext.tree.Panel', {
				 title: 'BOM 복사',
				 region: 'east',
				 width:'20%',
				 listeners: {
		             activate: function(tab){
		                 setTimeout(function() {
		                 	// Ext.getCmp('main-panel-center').setActiveTab(0);
		                     // alert(tab.title + ' was activated.');
		                 }, 1);
		             }
		         },

		         viewConfig: {
				    	listeners: {
						    itemclick: function(view, record, item, index, e, eOpts) {                      
				    	
						    	var name = record.data.text;
						    	var id = record.data.id;
						    	var depth = record.data.depth;
						    	var context = record.data.context;
//						    	console_log("record.data.text "+name);
//						    	console_log("record.data.context "+context);
						    	selectedAssyhier_posfull = context;
//						    	console_log("leaf "+leaf);
						    	assy_code = name.substring(0,5).trim();
						    	//console_logs("assy_code", "(" +assy_code + ")");
						    	var sname = name.split('>');
						    	console_log(sname[1]);
						    	sname = sname[1].split('<');
						    	console_log(sname[0]);
						    	assyname = sname[0];
						    	console_log("id "+id);
//						    	console_log("id.substring68 "+id.substring(6,8));
						    	console_log("depth "+depth);
						    	
						    	
						    	
						    	
						    	if(depth>0) {
						    		selectedparent = id;
						    		selectedAssyhier_pos = '';
						    		console_log('selectedparent='+selectedparent);
		// Ext.getCmp('assy_pj_code').setValue(name.substring(0,5));
						    		assy_pj_code = combo_pj_code;
						    		assy_level = depth;
						    		
						    		if(depth==2){
						    			
							    		selectedAssyhier_pos = context.substring(0,3);
							    	}
							    	if(depth==3){
							    		selectedAssyhier_pos = context.substring(0,6);
							    	}
							    	if(depth==4){
							    		selectedAssyhier_pos = context.substring(0,9);
							    	}
							    	if(depth==5){
							    		selectedAssyhier_pos = context.substring(0,12);
							    	}
							    	console_log("selectedAssyhier_pos : "+selectedAssyhier_pos);
							    	console_log("selectedAssyhier_posfull : "+selectedAssyhier_posfull);
							    	
							    	Ext.getCmp('pj_code_assy_code').setValue(combo_pj_code + '-' + assy_code);
							    	selectedAssyUid = selectedparent;

//						    		store.getProxy().setExtraParam('parent', selectedparent);
//						    		store.getProxy().setExtraParam('ac_uid', selectedPjUid);
//					            	store.load(function(){
//					            		console_logs('combo_pj_name', combo_pj_name);
//					            		routeTitlename = '[' + combo_pj_code + '-' + assy_code + '] ' + assyname;
//					                 	Ext.getCmp('gridBom').setTitle(routeTitlename); 
//					            	});

						    	}
						    		
		
						    	
						    }// end itemclick
				    	}// end listeners
					},
				        // border: 0,
			            dockedItems: [
                          {
  			                dock: 'top',
			                xtype: 'toolbar',
                        	items: [bomCopyAction, '-', {
			    				fieldLabel: '대상 ',
			    				xtype:  'displayfield',
			    				labelWidth: 40,
			    				id: 'pj_code_assy_code',
			    				value:'<미선택>',
			    				anchor: '100%'
			    			}]
                          },
                          {
			                dock: 'top',
			                xtype: 'toolbar',
			                items: [
			                        
										{
											id:'projectcombo',
										    	xtype: 'combo',
										    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
										           mode: 'local',
										           editable:false,
										           // allowBlank: false,
										           width: '100%',
										           queryMode: 'remote',
										           emptyText:'프로젝트',
										           displayField:   'pj_name',
										           valueField:     'unique_id',
										           store: cloudprojectStore,
										           listConfig:{
										            	
										            	getInnerTpl: function(){
										            		return '<div data-qtip="{pj_name}">{pj_code} <small><font color=blue>{pj_name}</font></small></div>';
										            	}			                	
										            },
										           triggerAction: 'all',
										            listeners: {
										                 select: function (combo, record) {

										                	Ext.getCmp('pj_code_assy_code').setValue('<미선택>');
										                	selectedAssyUid = null;
										                 	
										                 	console_log('Selected Value : ' + combo.getValue());
										                 	var pjuid = record[0].get('unique_id');
										                 	ac_uid = pjuid;
										                 	var pj_name  = record[0].get('pj_name');
										                 	var pj_code  = record[0].get('pj_code');

										                 	assy_pj_code ='';
										                 	combo_pj_code = pj_code;
										                 	combo_pj_name = pj_name;
										                 	selectedPjUid = pjuid;
										            	 
										                 	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
										                 	//store.removeAll();

										                 	//Default Set
											 				Ext.Ajax.request({
											 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
											 					params:{
											 						paramName : 'CommonProjectAssy',
											 						paramValue : pjuid + ';' + '-1'
											 					},
											 					
											 					success : function(result, request) {
											 						console_log('success defaultSet');
											 					},
											   	 				failure: function(result, request){
											   	 					console_log('fail defaultSet');
											   	 				}
											 				});
										                 	

									                 }
									            }
								        }
			                 	                   
			                
			                ]
			            }]
					 ,
				 
				 rootVisible: false,
				// cls: 'examples-list',
				 lines: true,
				 useArrows: true,
				 // margins: '0 0 0 5',
				 store: cloudProjectTreeStore
				} );
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
			var main =  Ext.create('Ext.panel.Panel', {
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
			    items: [  grid, pjTreeGrid  ]
			});
		
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',			
				params:{
					paramName : 'CommonProjectAssy'
				},
				success : function(result, request) {
					console_log('success defaultGet');
					var id = result.responseText;
					
					console_log('id:'+id);
					var arr = id.split(';');
					var ac_uid = arr[0];

					cloudprojectStore.load(function(records) { 
						
						var rec = null;
						for(var i=0; i<records.length; i++) {
							var id = records[i].get('id');
							console_log('ac_uid=' + ac_uid);
							console_log('id=' + id);
							if(Number(ac_uid) == Number(id)) {
								rec = records[i];
							}
						}
						
			     		if(rec!=null) {
				     		var pj_code = rec.get('pj_code');
							var pj_name = rec.get('pj_name');
				     		var projectcombo = Ext.getCmp('projectcombo');
				     		projectcombo.setValue('[' + pj_code + '] ' + pj_name);
							var record = [];
							record[0] = rec;
				     		projectcombo.fireEvent('select', projectcombo, record);
							projectcombo['forceSelection'] = true;
							console_log('-------------------------------------------srchTreeHandler');
							
							
							cloudProjectTreeStore.getProxy().setExtraParam('pjuid', ac_uid);
							
							pjTreeGrid.setLoading(true);
							cloudProjectTreeStore.load({
							    callback: function(records, operation, success) {
						
							    	pjTreeGrid.setLoading(false);
									console_log('ok');
							    }                               
							});
							
					
			     		}
					});
		    		
				},
				failure: function(result, request){
					console_log('fail defaultGet');
				} /*extjsUtil.failureMessage*/
			});
			
			
			fLAYOUT_CONTENT(main);

		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
     
