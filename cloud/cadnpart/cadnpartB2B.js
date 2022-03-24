var standard_cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
var material_cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
var techinfo_cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
var maker_cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});

var grid = null;
var menucode = 'Cloud';
var com_peo = true;
var Public_Type = 'cadnpart';
var Language = 'ko';

var standard_store = null;
var material_store = null;
var techinfo_store = null;
var makahd_store = null;

var claAstTreeStore = Ext.create('Mplm.store.ClaAstTreeStore', {});
var claAstTreeStore1 = Ext.create('Mplm.store.ClaAstTreeStore1', {});
var claAstTreeStore2 = Ext.create('Mplm.store.ClaAstTreeStore2', {});

var description = '';
var mater_board_content = ''; 
var tech_board_content = '';

var Tap = '';
var Standard_class_name = '';
var Standard_class_code = '';
var Material_class_name = '';
var Material_class_code = '';
var Techinfo_class_name = '';
var Techinfo_class_code = '';
var Maker_class_code='';

var vCUR_MENU_CODE = [];
var vCENTER_FIELDS = [];

var getTextName = null;

var standardPanel = null;
var materialPanel = null;
var techinfoPanel = null;
var maker_dataview = null;

function getPageSize() {
	var o1 = Ext.getCmp('main-panel-center');
	if(o1==undefined){
		return 13;
	}
	var height = o1.getEl().getHeight();
	console_log('getPageSize()'+ Math.floor( (height -130 ) / 21 ));
	return Math.floor( (height -130 ) / 21 ) ;
}
//function getPageToolbar(store) {
// 	// add a paging toolbar to the grid's footer
//	   var paging = Ext.create('Ext.PagingToolbar', {
////		 pageSize:getPageSize(),
//         store: store,
//         displayInfo: true,
//         displayMsg: 'display',//display_page_msg,
//         emptyMsg: 'empty_page'//empty_page_msg
//     });
//     
//	    // add the detailed view button
//	    paging.add('-', {
//	        text: 'download',//download_text,
//	        iconCls: 'MSExcelX',
//	        menu: {
//	            items: [
//	                {
//	                    text: 'current_view',//current_view_text,//'Major Fields | Current Rows',
//	    		        handler: printExcelHandler
//	                },
//	                {
//	                    text: 'all_rows_text',//'Major Fields | All Rows',
//	    		        handler: printExcelHandlerAll
//	                }
//	            ]
//	        }
//	    });
//	    return paging;
//}
//var printExcelHandler = function() {
//	
//	resetParam(store, GsearchField);	
//
//	store.getProxy().setExtraParam("srch_type", 'excelPrint');
//	store.getProxy().setExtraParam("srch_fields", 'major');
//	store.getProxy().setExtraParam("srch_rows", 'current');
//	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );
//	excelPrintFc (GsearchField);
//};
//var printExcelHandlerAll = function() {
//	
//	store.getProxy().setExtraParam("srch_type", 'excelPrint');
//	store.getProxy().setExtraParam("srch_fields", 'major');
//	store.getProxy().setExtraParam("srch_rows", 'all');
//	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );  
//    
//	var count = Number(store.getProxy().getReader().rawData.count);
//	if(count > 255) {
//	    Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
//	    function callBack(id) {
//			excelPrintFc (GsearchField);
//		}		
//	} else {
//		excelPrintFc (GsearchField);
//	}
//	
//};

var searchField = [];
var expdate = new Date();

function searchHandler() {
	switch (Tap){
		case 'standard':
			description=Ext.getCmp('description').getValue();
			standard_store.getProxy().setExtraParam('description',description);
			standard_store.load(function(record) {console_log(record);});
			break;
		case 'mater':
			mater_board_content=Ext.getCmp('mater_board_content').getValue();
			material_store.getProxy().setExtraParam('board_content',mater_board_content);
			material_store.load(function(record) {console_log(record);});
			break;
		case 'tech':
			tech_board_content=Ext.getCmp('tech_board_content').getValue();
			techinfo_store.getProxy().setExtraParam('board_content',tech_board_content);
			techinfo_store.load(function(record) {console_log(record);});
			break;
	}
}

var searchAction = Ext.create('Ext.Action', {
		itemId: 'searchButton',
	    iconCls: 'search',
	    text: CMD_SEARCH,
	    disabled: false ,
	    handler: searchHandler
});
	
//writer define
Ext.define('CodeStructure.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});


var addActionStandard =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: '추가',
    disabled: true,
    handler: function(widget, event) {
    	var form = Ext.create('Ext.form.Panel', {
    		id : 'formPanel',
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
						id : 'Standard_class_code',
						name : 'class_code',
						value : Standard_class_code
					}),
            {
                fieldLabel: '제품명',
                name: 'item_name',
                id:'item_name',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: '내용',
                name: 'description',
                id:'description_text',
                anchor: '-5'  // anchor width by percentage
            }]
        });

        var win = Ext.create('ModalWindow', {
            title: '추가',
            width: 700,
            height: 100,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: '확인',
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
	                	var val = form.getValues(false);
	                   	var srcahd = Ext.ModelManager.create(val, 'SrcAhd');
//	                   	
	                   	srcahd.save({
	                		success : function(result,request) {
	    							standard_store.load(function() {});
	                		}
                	 	});
                    	if(win) 
                    	{
                    		win.close();
                    	} 
					}
              }
            },{
                text: '취소',
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		});
     }
});

var addActionMaterial =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: '추가',
    disabled: true,
    handler: function(widget, event) {
    	var form = Ext.create('Ext.form.Panel', {
    		id : 'formPanel',
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
						id : 'Material_class_code',
						name : 'fields',
						value : Material_class_code
					}),new Ext.form.Hidden({
						id : 'Material_gubun',
						name : 'gubun',
						value : 'M'
					}),
            {
                fieldLabel: '제목',
                id:'board_name_material',
                name: 'board_title',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: '내용',
                id:'board_content_material',
                name: 'board_name',
                anchor: '-5'  // anchor width by percentage
            }]
        });

        var win = Ext.create('ModalWindow', {
            title: '추가',
            width: 700,
            height: 100,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: '확인',
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
	                	var val = form.getValues(false);
	                   	var board = Ext.ModelManager.create(val, 'Board');
	                   	
	                   	console_log(val);
	                   	board.save({
	                		success : function(result,request) {
    							material_store.load(function() {});
	                		}
                	 	});
                    	if(win) 
                    	{
                    		win.close();
                    	} 
					}
              }
            },{
                text: '취소',
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		});
     }
});

var addActionTechinfo =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: '추가',
    disabled: true,
    handler: function(widget, event) {
    	var form = Ext.create('Ext.form.Panel', {
    		id : 'formPanel',
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
						id : 'Techinfo_class_code',
						name : 'fields',
						value : Techinfo_class_code
					}),new Ext.form.Hidden({
						id : 'Techinfo_gubun',
						name : 'gubun',
						value : 'T'
					}),
            {
                fieldLabel: '제목',
                id:'board_name_techinfo',
                name: 'board_title',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: '내용',
                id:'board_content_techinfo',
                name: 'board_name',
                anchor: '-5'  // anchor width by percentage
            }]
        });

        var win = Ext.create('ModalWindow', {
            title: '추가',
            width: 700,
            height: 100,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: '확인',
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
	                	var val = form.getValues(false);
	                   	var board = Ext.ModelManager.create(val, 'Board');
	                   	board.save({
	                		success : function(result,request) {
    							techinfo_store.load(function() {});
	                		}
                	 	});
                    	if(win) 
                    	{
                    		win.close();
                    	} 
					}
              }
            },{
                text: '취소',
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		});
     }
});

var modify_standard =	 Ext.create('Ext.Action', {
	text: '저장',
    iconCls: 'save',
    disabled: false,
    handler: function ()
    {
    	var modifiend =[];
	    for (var i = 0; i <standardPanel.store.data.items.length; i++){
	    	var record = standardPanel.store.data.items [i];
	            
            if (record.dirty) {
            	console_log(record);
               	var obj = {};
               	
               	obj['unique_id'] = record.get('unique_id');
               	obj['item_name'] = record.get('item_name');
               	obj['description'] = record.get('description');
               	modifiend.push(obj);
            }
      }
	      
      if(modifiend.length>0) {
      	console_log(modifiend);
	  	var str =  Ext.encode(modifiend);
	  	console_log(str);
	  	
   	    Ext.Ajax.request({
 			url: CONTEXT_PATH + '/b2b/cadnpart.do?method=srcahdcreate',
 			params:{
 				modifyIno: str
 			},
 			success : function(result, request) {   
 				standard_store.load(function() {});
 			}
   	    });
      }
    }
});

var modify_material =	 Ext.create('Ext.Action', {
	text: '저장',
    iconCls: 'save',
    disabled: false,
    handler: function ()
    {
    	var modifiend =[];
	    for (var i = 0; i <materialPanel.store.data.items.length; i++){
	    	var record = materialPanel.store.data.items [i];
	            
            if (record.dirty) {
            	console_log(record);
               	var obj = {};
               	
               	obj['unique_id'] = record.get('unique_id');
               	obj['board_title'] = record.get('board_title');
               	obj['board_name'] = record.get('board_name');
               	modifiend.push(obj);
            }
      }
	      
      if(modifiend.length>0) {
      	console_log(modifiend);
	  	var str =  Ext.encode(modifiend);
	  	console_log(str);
	  	
   	    Ext.Ajax.request({
 			url: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardcreate',
 			params:{
 				modifyIno: str
 			},
 			success : function(result, request) {   
 				material_store.load(function() {});
 			}
   	    });
      }
    }
});

var modify_techinfo =	 Ext.create('Ext.Action', {
	text: '저장',
    iconCls: 'save',
    disabled: false,
    handler: function ()
    {
    	var modifiend =[];
	    for (var i = 0; i <techinfoPanel.store.data.items.length; i++){
	    	var record = techinfoPanel.store.data.items [i];
	            
            if (record.dirty) {
            	console_log(record);
               	var obj = {};
               	
               	obj['unique_id'] = record.get('unique_id');
               	obj['board_title'] = record.get('board_title');
               	obj['board_name'] = record.get('board_name');
               	obj['board_content'] = record.get('board_content');
               	modifiend.push(obj);
            }
      }
	      
      if(modifiend.length>0) {
      	console_log(modifiend);
	  	var str =  Ext.encode(modifiend);
	  	console_log(str);
	  	
   	    Ext.Ajax.request({
 			url: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardcreate',
 			params:{
 				modifyIno: str
 			},
 			success : function(result, request) {   
 				techinfo_store.load(function() {});
 			}
   	    });
      }
    }
});

var materialFields = [];
materialFields.push(
            	    { name: 'unique_id', 	type: "string"    }
            	   ,{ name: 'creator', 		type: "string"    }           
                   ,{ name: 'changer', 		type: "string"    }
                   ,{ name: 'create_date', 	type: "string"    }
                   ,{ name: 'change_date', 	type: "string"    }
                   ,{ name: 'board_name',		type: "string"  } 
                   ,{ name: 'board_title',		type: "string"  } 
                   ,{ name: 'board_content', 	type: "string" }
                   ,{ name: 'fields', 	type: "string" }
                   ,{ name: 'gubun', 	type: "string" }
 );  
          
var materialColumn = [];
materialColumn.push(
				{ header:'unique_id', dataIndex: 'unique_id', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'제목', dataIndex: 'board_title', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'내용', dataIndex: 'board_name', width : 120,  align: 'center',resizable:true,sortable : false}
);  

var techinfoFields = [];
techinfoFields.push(
            	    { name: 'unique_id', 	type: "string"    }
            	   ,{ name: 'creator', 		type: "string"    }           
                   ,{ name: 'changer', 		type: "string"    }
                   ,{ name: 'create_date', 	type: "string"    }
                   ,{ name: 'change_date', 	type: "string"    }
                   ,{ name: 'board_name',		type: "string"  } 
                   ,{ name: 'board_content', 	type: "string" }
                   ,{ name: 'board_title', 	type: "string" }
                   ,{ name: 'fields', 	type: "string" }
                   ,{ name: 'gubun', 	type: "string" }
 );  
          
var techinfoColumn = [];
techinfoColumn.push(
				{ header:'unique_id', dataIndex: 'unique_id', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'제목', dataIndex: 'board_title', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'내용', dataIndex: 'board_name', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'내용2', dataIndex: 'board_content', width : 120,  align: 'center',resizable:true,sortable : false}
);  

var standardFields = [];
standardFields.push(
            	    { name: 'unique_id', 	type: "string"    }
            	   ,{ name: 'creator', 		type: "string"    }           
                   ,{ name: 'changer', 		type: "string"    }
                   ,{ name: 'create_date', 	type: "string"    }
                   ,{ name: 'change_date', 	type: "string"    }
                   ,{ name: 'item_name', 	type: "string" }
                   ,{ name: 'class_code',		type: "string"        } 
                   ,{ name: 'description',		type: "string"    }
 );  
          
var standardColumn = [];
standardColumn.push(
				{ header:'unique_id', dataIndex: 'unique_id', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'제품명', dataIndex: 'item_name', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'분류', dataIndex: 'class_code', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'내용', dataIndex: 'description', width : 120,  align: 'center',resizable:true,sortable : false}
);  

var makahdfields = [];
makahdfields.push(
		{name: 'unique_id_long', type: 'string'},
					{name: 'indust_code', type: 'string'},
    				{name: 'maker_name', type: 'string'},
    				{name: 'homepage_url', type: 'string'}
);


Ext.define('Board', {
  	 extend: 'Ext.data.Model',
  	 fields: materialFields,
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardread',
		            create: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardcreate',
		            update: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardcreate'
//		            destroy: CONTEXT_PATH + '/admin/board.do?method=destroy'
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

Ext.define('Board1', {
  	 extend: 'Ext.data.Model',
  	 fields: techinfoFields,
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardread',
		           	create: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardcreate',
		            update: CONTEXT_PATH + '/b2b/cadnpart.do?method=boardcreate'
//		            destroy: CONTEXT_PATH + '/admin/board.do?method=destroy'
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
	
Ext.define('SrcAhd', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/standardFields,
	 proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/b2b/cadnpart.do?method=srcahdread',
	            create: CONTEXT_PATH + '/b2b/cadnpart.do?method=srcahdcreate',
	            update: CONTEXT_PATH + '/b2b/cadnpart.do?method=srcahdcreate'
//		            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroy' /*delete*/
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

Ext.define('MakAhd', {
    extend: 'Ext.data.Model',
    fields: makahdfields,
    proxy:{
        type:'ajax',
        api:{
            read: CONTEXT_PATH + '/b2b/lounge.do?method=readMakahd',
            create: CONTEXT_PATH + '/b2b/lounge.do?method=createMakahd'
        },
        reader:{
            type:'json',
            root:'datas',
			totalProperty: 'count',
			successProperty: 'success'
        },
        writer:{
	           type: 'singlepost',
            writeAllFields:false,
//            encode:false,
            root:'datas'
        }
    }
});


Ext.onReady(function() {
	
	Ext.each(/*(G)*/standardColumn, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
			if(dataIndex!='no') {
				if('item_name' == dataIndex 
						|| 'description' == dataIndex) {
					columnObj["editor"] = {
					};	
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
			}
		});
		
	Ext.each(/*(G)*/materialColumn, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
			if(dataIndex!='no') {
				if('board_name' == dataIndex 
						|| 'board_content' == dataIndex ) {
					columnObj["editor"] = {
					};	
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
			}
		});
		
	Ext.each(/*(G)*/techinfoColumn, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
			if(dataIndex!='no') {
				if('board_name' == dataIndex 
						|| 'board_content' == dataIndex || 'board_title' == dataIndex) {
					columnObj["editor"] = {
					};	
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
			}
		});
	
	standard_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'SrcAhd',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	material_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Board',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	techinfo_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Board1',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	makahd_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'MakAhd',
		sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
        }]
	});

	var objCenter = null;
	var objSouth = null;
	var objEast = null;
	var objWest = null;

	standardPanel = Ext.create('Ext.grid.Panel', {
            title: 'STANDARD',
            iconCls: 'Product-documentation-icon',
            store: standard_store,
            columns: standardColumn,
            plugins: [standard_cellEditing],
            listeners: {
                activate: function(tab){
                	Tap='standard';
                    setTimeout(function() {
                    	Ext.getCmp('west-panel-tree').setActiveTab(0);
                    }, 1);
                }
            },
            dockedItems: [{
            	dock: 'top',
	            xtype: 'toolbar',
	            items: [searchAction,{
	            	width: 148,
		        	xtype: 'triggerfield',
		        	id :'description',
		        	name : 'description',
		        	emptyText:  '내용',
		        	labelSeparator: '',
		        	readOnly: false,
		        	listeners: {
		        		specialkey : function(fieldObj, e) {
			         		if (e.getKey() == Ext.EventObject.ENTER) {
			         			Tap='standard';
			         			searchHandler();
			         		}
				        }
		        	},
		        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			         'onTrigger1Click': function() {
			         	Ext.getCmp('description').setValue('');
			     	}
	            },addActionStandard, '->', modify_standard]
            }]
		});
		
    materialPanel =  Ext.create('Ext.grid.Panel', {
            title: 'MATERIAL',
            iconCls: 'App-package-utilities-icon',
            store: material_store,
            columns: materialColumn,
            plugins: [material_cellEditing],
            listeners: {
                activate: function(tab){
                	Tap='mater';
                	com_peo = false;
                    setTimeout(function() {
                    	Ext.getCmp('west-panel-tree').setActiveTab(1);
                    }, 1);
                }
            },
            dockedItems: [{
            	dock: 'top',
	            xtype: 'toolbar',
	            items: [searchAction,{
	            	width: 148,
		        	xtype: 'triggerfield',
		        	id :'mater_board_content',
		        	name : 'board_content',
		        	emptyText:  '내용',
		        	labelSeparator: '',
		        	readOnly: false,
		        	listeners: {
		        		specialkey : function(fieldObj, e) {
			         		if (e.getKey() == Ext.EventObject.ENTER) {
			         			Tap='mater';
			         			searchHandler();
			         		}
				        }
		        	},
		        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			         'onTrigger1Click': function() {
			         	Ext.getCmp('mater_board_content').setValue('');
			     	}
	            },addActionMaterial, '->', modify_material]
            }]
        });
        
     techinfoPanel =  Ext.create('Ext.grid.Panel', {
            title: 'TECHNICAL',
            iconCls: 'Person-Male-Light-icon',
         	store: techinfo_store,
            columns: techinfoColumn,
            plugins: [techinfo_cellEditing],
            listeners: {
                activate: function(tab){
                	Tap='tech';
                	com_peo = false;
                    setTimeout(function() {
                    	Ext.getCmp('west-panel-tree').setActiveTab(2);
                    }, 1);
                }
            },
            dockedItems: [{
            	dock: 'top',
	            xtype: 'toolbar',
	            items: [searchAction,{
	            	width: 148,
		        	xtype: 'triggerfield',
		        	id :'tech_board_content',
		        	name : 'board_content',
		        	emptyText:  '내용',
		        	labelSeparator: '',
		        	readOnly: false,
		        	listeners: {
		        		specialkey : function(fieldObj, e) {
			         		if (e.getKey() == Ext.EventObject.ENTER) {
			         			Tap='tech';
			         			searchHandler();
			         		}
				        }
		        	},
		        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			         'onTrigger1Click': function() {
			         	Ext.getCmp('tech_board_content').setValue('');
			     	}
	            },addActionTechinfo, '->', modify_techinfo]
            }]
        });
        
        
        
        var maker_dataview = Ext.create('Ext.view.View', {
        	title: apm_maker_category,
            iconCls: 'Person-Male-Light-icon',
			region: 'east',
			width:'80%',
	        deferInitialRefresh: false,
	        store: makahd_store,
	        tpl  : Ext.create('Ext.XTemplate',
	            	'<tpl for=".">',
	                '<div class="phone">',
	                    (!Ext.isIE6? '<img width="64" height="64" src="'+ '/home/teamcuberfx/b2b_image/{[values.file_name.replace(/ /g, "-")]}" />' :
	                     '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + '/home/teamcuberfx/b2b_image/{[values.file_name.replace(/ /g, "-")]}\',sizingMethod=\'scale\')"></div>'),
	                    '<strong>{maker_name}</strong>',
	                '</div>',
	            '</tpl>'
	        ),
	        plugins : [
	            Ext.create('Ext.ux.DataView.Animated', {
	                duration  : 550,
	                idProperty: 'unique_id'
	            })
	        ],
	        id: 'phones',
	        itemSelector: 'div.phone',
	        overItemCls : 'phone-hover',
	        multiSelect : true,
	        autoScroll  : true,
	        listeners: {
	        	 activate: function(tab){
	                    setTimeout(function() {
	                    	Ext.getCmp('west-panel-tree').setActiveTab(3);
	                    }, 1);
                },
	            click: {
	                element: "el",
	                fn: function(e, t) {
	                    e.stopEvent();
	                    if(window.console && console.log)
	                        console.log("%s click", t.id);
	                }
	            }
	        }
	    });
        
    objCenter = {
			id: 'main-panel-center', 
			xtype: 'tabpanel',
            region: 'center',
            activeTab: 0,
            tabPosition: 'top',
            items: [ standardPanel, materialPanel, techinfoPanel, maker_dataview ],
            listeners: {
		        render: function() {
		            this.items.each(function(i){
		                i.tab.on('click', function(){
		                });
		            });
	       		}
			}
    };
	
	objSouth = {
            region: 'south',
            split: true,
            height: 100,
            minSize: 500,
            maxSize: 100,
            collapsible: true,
            collapsed: true,
            title: apm_statistics,
            margins: '0 0 0 0',
            layout:'column',
            border: false,
            items: [{
            	border: false,
                columnWidth: .5,
                html: 'My Info'
            },{
                columnWidth: .5,
                border: false,
                html: 'My Company'
            }]
        };
    
	var treepanelStandard =
    	Ext.create('Ext.tree.Panel', {
			 listeners: {
                 activate: function(tab){
                 	 Tap='standard';
                	 setTimeout(function() {
                     	Ext.getCmp('main-panel-center').setActiveTab(0);
                     }, 1);
                 }
             },
		 	title: apm_standard_category,
		    viewConfig: {
		    	listeners: {
				    itemclick: function(view, record, item, index, e, eOpts) {
				    	Standard_class_name = record.data.text;
				    	Standard_class_code = record.data.context;
				    	standard_store.getProxy().setExtraParam('class_code', Standard_class_code);
				    	standard_store.load(function() {});
				    }//end itemclick
		    	}//end listeners
			},
		 rootVisible: false,
		 lines: true,
		 useArrows: true,
		 store: claAstTreeStore
		} );
		
		treepanelStandard.getSelectionModel().on({
			selectionchange: function(sm, selections) {
	            if (selections.length) {
	            	addActionStandard.enable();
	            }else{
	            	addActionStandard.disable();
	            }
			}
		});
		
    var treepanelMaterial =
    	Ext.create('Ext.tree.Panel', {
		 title: apm_material_category,
		 listeners: {
             activate: function(tab){
         		 Tap='mater';
                 setTimeout(function() {
                 	Ext.getCmp('main-panel-center').setActiveTab(1);
                 }, 1);
             }
         },
         viewConfig: {
		    	listeners: {
				    itemclick: function(view, record, item, index, e, eOpts) {
				    	Material_class_name = record.data.text;
				    	Material_class_code = record.data.context;
				    	material_store.getProxy().setExtraParam('fields', Material_class_code);
				    	material_store.load(function() {});
				    }//end itemclick
		    	}//end listeners
			},
		 rootVisible: false,
		 lines: true,
		 useArrows: true,
		 store: claAstTreeStore1
		} );
		
		treepanelMaterial.getSelectionModel().on({
			selectionchange: function(sm, selections) {
	            if (selections.length) {
	            	addActionMaterial.enable();
	            }else{
	            	addActionMaterial.disable();
	            }
			}
		});
    
//		treepanelMaterial.setRootNode({
//		    text: 'Root',
//		    expanded: true,
//		    children: [{
//					        text: 'STEEL',
//					        leaf: true
//					    }, {
//					        text: 'AL',
//					        leaf: true
//					    }, {
//					        text: 'PLASTIC',
//					        leaf: true
//					    }, {
//					        text: 'LIQUID',
//					        leaf: true
//				    	}]
//		});
		
    var treepanelTechinfo =
    	Ext.create('Ext.tree.Panel', {
		 	title: apm_tech_category,
			listeners: {
                 activate: function(tab){
                 	Tap='tech';
                     setTimeout(function() {
                     	Ext.getCmp('main-panel-center').setActiveTab(2);
                     }, 1);
                 }
            },
     		viewConfig: {
		    	listeners: {
				    itemclick: function(view, record, item, index, e, eOpts) {
				    	Techinfo_class_name = record.data.text;
				    	Techinfo_class_code = record.data.context;
				    	techinfo_store.getProxy().setExtraParam('fields', Techinfo_class_code);
				    	techinfo_store.load(function() {});
				    }//end itemclick
		    	}//end listeners
			},
		 rootVisible: false,
		 lines: true,
		 useArrows: true,
		 store: claAstTreeStore2
		});
		
		treepanelTechinfo.getSelectionModel().on({
			selectionchange: function(sm, selections) {
	            if (selections.length) {
	            	addActionTechinfo.enable();
	            }else{
	            	addActionTechinfo.disable();
	            }
			}
		});
		
    var treepanelMaker =
    	Ext.create('Ext.tree.Panel', {
		 	title: apm_maker_category,
			listeners: {
                 activate: function(tab){
                 	Tap='maker';
                     setTimeout(function() {
                     	Ext.getCmp('main-panel-center').setActiveTab(3);
                     }, 1);
                 }
            },
     		viewConfig: {
		    	listeners: {
				    itemclick: function(view, record, item, index, e, eOpts) {
				    	Maker_class_code = record.data.context;
				    	console_log('Maker_class_code');
				    	console_log(Maker_class_code);
					    makahd_store.getProxy().setExtraParam('indust_code', Maker_class_code);
					    makahd_store.load(function() {});
				    }//end itemclick
		    	}//end listeners
			},
		 rootVisible: false,
		 lines: true,
		 useArrows: true,
		 store: claAstTreeStore2
		});
		
		treepanelMaker.getSelectionModel().on({
			selectionchange: function(sm, selections) {
	            if (selections.length) {
//	            	addActionTechinfo.enable();
	            }else{
//	            	addActionTechinfo.disable();
	            }
			}
		});
		
		
    objWest = new Ext.TabPanel({
    	//속성
    	id: 'west-panel-tree', // see Ext.getCmp() below
        xtype: 'tabpanel',
        region: 'west',
        //title: apm_hierarchy,
        //animCollapse: false,
        //collapsible: true,
        split: true,
          width: 400,
          minWidth: 175,
          maxWidth: 400,
          margins: '0 0 0 5',
        activeTab: 0,
        tabPosition: 'top',
        items: [ treepanelStandard, treepanelMaterial, treepanelTechinfo, treepanelMaker ]
    });
	
	//Default Value.
	
	console_log('language, wa_code end...');
	
	var padding = '15 5 5 5';

	var itemList = [];
	if(Public_Type=='cadnpart') {
		itemList.push(objCenter);
		itemList.push(objSouth);
//		itemList.push(objEast);
		itemList.push(objWest);
	} else {
		itemList.push(objCenter);
		
		Ext.get('floatDiv').setStyle('display', 'block');

	}
	
	//View Create.
	Ext.create('Ext.Viewport', {
        id: 'mplmMainViewPort',
        layout: 'border',
        border: false,
	    items : itemList
	});
	

});

