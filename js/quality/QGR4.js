var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var grid = null;
var store = null;
var image_name = null;
var myGrid = null;
var myStore = null;
var golistStore = null;

var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
var mySelModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});

var arrSearchObj=[];

var owin = null;

var arrGrqty = [];
var cartmap_uids=[];
var item_abst = null;
var gr_reason = null;

function signpad_callback(result) {
	
	if(owin!=null) {
		owin.close();
		owin=null;
	}
	
	
	var whouse_uid=Ext.getCmp('whouse_uid').getValue();
	
    mask.show();
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/quality/wgrast.do?method=createGr',
		params:{
			whouse_uid : whouse_uid
			,gr_qty : arrGrqty
			,gr_reason : gr_reason
			,item_abst : item_abst
			,cartmap_uids: cartmap_uids
			,sign_image_name: result
			,po_type: 'G'
		},
		success : function(result, request) {
			myStore.removeAll();
			golistStore.load(function(){});
			store.load(function(){
				mask.hide();
				Ext.MessageBox.alert('알림','창고 반출 성공.');
			});
	               
		},
		failure: extjsUtil.failureMessage
	});
}


function focusBarcode() {
	var o = Ext.getCmp(getSearchField('barcode'));
	o.setValue('');
	o.focus(false, 200);
}
function checkIsdup(items, id) {
	for (var i = 0; i <items.length; i++)
    {
		var record = items [i];
		if(id+'' == record.get('id')+'') {
			return true;
		}
    }
	
	return false;
}

function removeItem(store, id) {
	var items = store.data.items;
	for (var i = 0; i < items.length; i++)
    {
		var record = items [i];
		if(id+'' == record.get('id')+'') {
			store.removeAt(i);
			return;
		}
    }
	
}

var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeAction',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	
    	var records = myGrid.getSelectionModel().getSelection();
    	if(records.length==0) {
    		Ext.MessageBox.alert('오류','먼저 자재를 선택하세요.');
    		return;
    	}

    	for(var i=0; i< records.length; i++) {
    		var data = records[i].data;
    		removeItem(myStore, data['id']);
    	}
    	focusBarcode();
    }
});

function addHandler() {
	console_logs('in', 'addHandler()');
	var records = grid.getSelectionModel().getSelection();
	if(records.length==0) {
		Ext.MessageBox.alert('오류','먼저 자재를 선택하세요.');
		return;
	}
	
	var del_arr = [];
	
	for(var i=0; i< records.length; i++) {
		
		console_logs('records['+ i + '].data', records[i].data);
		var data = records[i].data;
		console_logs('data',data);
		if(checkIsdup(myStore.data.items, data['id'])==false) {
			var xpoast = Ext.ModelManager.create( data, 'XpoAst');
			console_logs('xpoast', xpoast);
			var row = myStore.add(xpoast);
			//mySelModel.select(row, true);

			del_arr.push(data['id']);
		}//endoffif
	}//endiffor
	
	var removeSrcRecord = function(id) {
		var srcItems = store.data.items;
		for(var i=0; i< srcItems.length; i++) {
			var record = srcItems[i];
			if(''+id==''+ record.get('id')) {
				store.removeAt(i);
				return;
			}
		}

	};
	for(var j=0; j< del_arr.length; j++) {
		removeSrcRecord(del_arr[j]);
	}
	focusBarcode();
}

var addAction =	 Ext.create('Ext.Action', {
	iconCls:'arrow-right',
	iconAlign: 'right',
    text: '대상에 추가',
    disabled: true,
    handler: function(widget, event) {
    	
    	addHandler();
    }
});

var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [  ]
});

function mySearch(){
	for(var i=0; i<arrSearchObj.length; i++) {
		var index = arrSearchObj[i];
		var val = Ext.getCmp(getSearchField(index)).getValue();
		var enValue = Ext.JSON.encode(val);
		store.getProxy().setExtraParam(index, enValue);
	}
	var date_type = Ext.getCmp('date_type').getValue();
	var s_date = Ext.getCmp('s_date').getValue();
	var e_date = Ext.getCmp('e_date').getValue();
	store.getProxy().setExtraParam('date_type', date_type);
	store.getProxy().setExtraParam('s_date', yyyymmdd(s_date, '-')/*s_date.toISOString().split('T')[0]*/);
	store.getProxy().setExtraParam('e_date', yyyymmdd(e_date, '-')/*e_date.toISOString().split('T')[0]*/);
	
	store.load({
		params: {start: 0, limit:100, page:1},
		callback: function() {
			focusBarcode();
		}
	});
	
}

function barcodeSearch(){
	
	var val = Ext.getCmp(getSearchField('barcode')).getValue();
	
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/purchase/prch.do?method=readDetail&po_type=G&isPoqtyZero='+true,				
		params:{
			barcode: val
		},
		
		success : function(result, request) {
			var o =Ext.decode(result.responseText);
			var records = o['datas'];

			var del_arr = [];
			
			for(var i=0; i< records.length; i++) {
				
				var data = records[i];
				console_logs('data',data);
				if(checkIsdup(myStore.data.items, data['id'])==false) {
					var xpoast = Ext.ModelManager.create( data, 'XpoAst');
					console_logs('xpoast', xpoast);
					var row = myStore.add(xpoast);
					//mySelModel.select(row, true);

					del_arr.push(data['id']);
				}//endoffif
			}//endiffor
			
			var removeSrcRecord = function(id) {
				var srcItems = store.data.items;
				for(var i=0; i< srcItems.length; i++) {
					var record = srcItems[i];
					if(''+id==''+ record.get('id')) {
						store.removeAt(i);
						return;
					}
				}

			};
			for(var j=0; j< del_arr.length; j++) {
				removeSrcRecord(del_arr[j]);
			}
			focusBarcode();
		}
	});
}



function getSearchObj(index, label) {
	arrSearchObj.push(index);
	return 		{
	    xtype: 'container',
	    layout:'hbox',
	    items:[ 
			{
			    xtype:'label',
			    text: label + ':',
			    width: 50,
			    labelAlign: 'right',
			    align:'right',
			    margin: '3 3 2 3',
			    fieldStyle: 'text-align:right;'
			},	
			{
				    xtype: 'triggerfield',
				    width: 130,
				    emptyText: label, //getTextName(/*(G)*/vCENTER_FIELDS, index),
				    id: getSearchField(index),
			    	listeners : {
			        		specialkey : function(fieldObj, e) {
			        		if (e.getKey() == Ext.EventObject.ENTER) {
			        			mySearch();
			        		}
			        	}
			    	},
				    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
				    'onTrigger1Click': function() {
				    	Ext.getCmp(getSearchField(index)).setValue('');
					}
			}
			]};
}

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: function() {
    	mySearch();
    }
    //handler: searchHandler
});


var doGoodsout = Ext.create('Ext.Action', {
	itemId: 'doGoodsout',
	iconCls: 'tray',
	text: '반출확인',
	disabled: false, 
	handler: function(widget, event) {

		var items = myStore.data.items;
		
		if(items.length==0) {
	    	  Ext.MessageBox.alert('오류','입력한 항목이 없습니다.');
	    	  return;
		}
		
		for (var i = 0; i < myStore.data.items.length; i++)
	    {
			var record = items [i];
			var unique_id = record.get('unique_id');
			var item_name = record.get('item_name');
			var po_qty = record.get('po_qty');
			var pr_name = record.get('pr_name');
			
			
			cartmap_uids.push(unique_id);
			arrGrqty.push(po_qty);
            if(i==0) {
           	  gr_reason = pr_name;
  			  item_abst = item_name + ' 外';            	  
            }
	    }//endoffor
		
		image_name = RandomString(10);
		
		var f = document.getElementById('signpadForm');
		f.user_name.value = pr_name;
		f.image_name.value = image_name;
		owin = window.open('', 'TheWindow');
		f.submit();

		
		//openPopup(CONTEXT_PATH + '/simple.do?method=signpad&user_name=' + pr_name +"&image_name=" + image_name,800,600,'sign', false, false, false, false, false);

		
	}//endof handler
});


Ext.onReady(function() {  

	var defWhouseUid = -1;
	//var wHouseStore = Ext.create('Mplm.store.WareHouseStore', {hasNull: false} );
	Ext.create('Mplm.store.WareHouseStore', {hasNull: false} ).load( function(records) {
		

		var datas = [];
        for (var i=0; i<records.length; i++){ 
               	var obj = records[i];
               	console_log('unique_id:' + obj.get('unique_id'));
               	var wh_code = obj.get('wh_code');
               	console_log('wh_code:' + wh_code);
               	
            	var o = {};
            	o['unique_id'] = obj.get('unique_id');
            	o['wh_code'] = obj.get('wh_code');
            	o['wh_name'] = obj.get('wh_name');
               	datas.push(o);
               	
               	if(i==0) {
               		defWhouseUid = obj.get('unique_id');
               	}
        }
	
	
	var wHouseStore = Ext.create('Ext.data.Store', {
		fields:[     
		 	      { name: 'unique_id', type: "string" }
		 	     ,{ name: 'wh_code', type: "string"  }
		 	     ,{ name: 'wh_name', type: "string"  }
		 	  ],
              data   : datas
          });
	
	
	
	
	
	//var xpoAstToolBar = getXpoAstToolBar();

	var searchDatetypeStore  = Ext.create('Mplm.store.SearchDatetypeStore', {hasNull: true} );
//	var dataType_datas = [];
//	function getPosDatatype(id){
//		for (var i=0; i<dataType_datas.length; i++){
//			if(dataType_datas[i].get('systemCode') == id){
//				return dataType_datas[i];
//			}
//		}
//		return null;
//	}
	
	Ext.define('XpoAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetail&po_type=G&isPoqtyZero='+true
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
		model: 'XpoAst'
	});
	store.getProxy().setExtraParam('is_closed', "N");

	
	myStore = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'XpoAst'
	});
	
	
	store.load(function() {
		
		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			//console_log('editor.dataIndex:'+dataIndex);
			if('curGr_qty' == dataIndex){
				columnObj["editor"] = {
                };	
		        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
					return value;
	        	};
			}
		});
		

		grid = Ext.create('Ext.grid.Panel', {
			store : store,
			stateful : true,
			collapsible : true,
			multiSelect : true,
			selModel : selModel,
			region: 'west',
			width:'50%',
			height : getCenterPanelHeight(),
			stateId : 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			autoScroll : true,
			autoHeight : true,
	        bbar: getPageToolbar(store),
	        dockedItems: [{
	        	dock : 'top',
	        	xtype: 'toolbar',
	        	items: [searchAction,'-',
	        	        {
		                width:90,
						id :'date_type',
		                name:           'date_type',
						xtype:          'combo',
		                mode:           'local',
		                allowBlank: false,
		                emptyText:  '-미지정-',
		                value: '',
		                forceSelection: true,
		                editable:       false,
		                displayField:   'codeName',
		                valueField:     'systemCode',
  		                triggerAction:  'all',
		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		                queryMode: 'remote',
		                store: searchDatetypeStore,
		                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}			                	
		                }
//		        ,
//		                	listeners: {
//		                		select: function (combo, record) {
//		                			var isComplished = Ext.getCmp('date_type').getValue();
//		                			store.getProxy().setExtraParam('date_type', isComplished);
//				     				store.load({});
//		                		}//endofselect
//		                	}
		        	},'-',
					{ 
		                name: 's_date',
		                id:'s_date',
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
		                name: 'e_date',
		                id:'e_date',
		                format: 'Y-m-d',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
					    	allowBlank: true,
					    	xtype: 'datefield',
					    	value: new Date(),
					    	width: 100,
						handler: function(){
						}
					},'-',
			        {
			            xtype: 'container',
			            layout:'hbox',
			            items:[ 
			        		
					        {
			        			fieldLabel: '창고',
			        			labelWidth: 30,
								id :'whouse_uid',
				                name:           'whouse_uid',
								xtype:          'combo',
				                mode:           'local',
				                triggerAction:  'all',
				                forceSelection: true,
				                editable:       false,
				                allowBlank: false,
				                emptyText:  qgr1_whouse_choice,
				                displayField:   'wh_code',
				                valueField:     'unique_id',
				                queryMode: 'local',
				                value: defWhouseUid,
				                width: 130,
				                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				                store: wHouseStore
				        	}
			        		]}, '-']
	        },
	        
		      {
					xtype: 'toolbar',
					items: [
					        getSearchObj('account_code', '프로젝트'),'-',
					        getSearchObj('pr_user_name', '요청자'), '->', addAction
					        
					        ]
			}],
	        columns: /*(G)*/vCENTER_COLUMNS,
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true,
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
	                itemdblclick: function(){
	                	console_logs('itemdblclick', 'clicked');
	                	addHandler();
	                },
	            }
	        },
	        title: getMenuTitle()
		});
		
		myGrid = Ext.create('Ext.grid.Panel', {
			store : myStore,
			title : '반출대상 목록',
			region: 'center',
			width:'50%',
			stateful : false,
			collapsible : false,
			multiSelect : true,
			selModel : mySelModel,
			height : getCenterPanelHeight(),
			autoScroll : true,
			autoHeight : true,
	        dockedItems: [{
	        	dock : 'top',
	        	xtype: 'toolbar',
	        	items: [doGoodsout,'-',removeAction,'-']
	        },
	        
		      {
					xtype: 'toolbar',
					items: [

									{
									    xtype: 'triggerfield',
									    width: 250,
									    labelWidth: 50,
									    fieldLabel:    getColName('barcode'),
									    fieldStyle: {
									        'fontSize'     : '14px',
									        'fontWeight' : 'bold'
									      },
									    id: getSearchField('barcode'),
								    	listeners : {
								        		specialkey : function(fieldObj, e) {
								        		if (e.getKey() == Ext.EventObject.ENTER) {
								        			barcodeSearch();
								        		}
								        	}
								    	},
									    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
									    'onTrigger1Click': function() {
									    	Ext.getCmp(getSearchField('barcode')).setValue('');
									}

					        	}, '-'
					        
					        ]
		      }
			],        
			columns: /*(G)*/vCENTER_COLUMNS,
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true,
	            listeners: {
	            	afterrender : function(grid) {
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
	        }
		});
			
		
		var main =  Ext.create('Ext.panel.Panel', {
			height: getCenterPanelHeight(),
		    layout:'border',
		    border: false,
		    title:'창고반출',
		    layoutConfig: {columns: 2, rows:1},
		    defaults: {
		        collapsible: true,
		        split: true,
		        cmargins: '5 0 0 0',
		        margins: '0 0 0 0'
		    },
		    items: [ grid, myGrid  ]
		});
		
		var tabPanelList = new Ext.TabPanel({
    		id:'go-tab-panel',
    	    collapsible: true,
			xtype: 'tabpanel',
			title:getMenuTitle(),
	        activeTab: 0,
	        tabPosition: 'top',
	        items: [   main,
	                   {	            
				        	id: 'golist-panel-div',
				            title: '반출이력',
				            border: false,
				            autoScroll:true
			         }
	        ],
	        activeTab: 0,
	        listeners: {
	            'tabchange': function(tabPanel, tab) {
//	            	//console_logs('gSelectedTab', gSelectedTab);
//	            	gSelectedTab = tab.id;
//	            	//console_logs('gSelectedTab', gSelectedTab);
//	            	refreshButton();
//	            	if(gSelectedTab=='contract-div') {
//		            	var quota_content = Ext.getCmp('quota_content');
//		            	console_logs('quota_content', quota_content);
//		    			quota_content.getToolbar().hide();
//		    			console_logs('hide', 'OK');		    		            		
//	            	}
//

	            	
	            }
	        }
		});

		Ext.define('WgrAst', {
		   	 extend: 'Ext.data.Model',
		   	 fields: /*(G)*/vCENTER_FIELDS,
		   	    proxy: {
						type: 'ajax',
				        api: {
				        	read: CONTEXT_PATH + '/quality/wgrast.do?method=read&po_type=MN',
				            destroy: CONTEXT_PATH + '/quality/wgrast.do?method=destroy'
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
		
		
	    var fieldItem = [], columnItem = [], tooltipItem = [];
		//아이템 필드 로드
	   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    params: {
		    	menuCode: 'QGR4_HISTORY'
		    },
		    callback: function(records, operation, success) {
		    	console_log('come IN QGR4_SUB');
		    	if(success ==true) {
		    		for (var i=0; i<records.length; i++){
		    			inRec2Col(records[i], fieldItem, columnItem, tooltipItem);
			        }//endoffor
	    		 	
		    		Ext.each(/*(G)*/columnItem, function(columnObj, index) {
		    			var dataIndex = columnObj["dataIndex"];
		    		});//endoofeach
		    		
		    		Ext.define('WgrAst', {
		    		   	 extend: 'Ext.data.Model',
		    		   	 fields: /*(G)*/fieldItem,
		    		   	    proxy: {
		    						type: 'ajax',
		    				        api: {
		    				        	read: CONTEXT_PATH + '/quality/wgrast.do?method=read&po_type=G',
		    				            destroy: CONTEXT_PATH + '/quality/wgrast.do?method=destroy'
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
		    		
		    		golistStore = new Ext.data.Store({  
		    			pageSize: getPageSize(),
		    			model: 'WgrAst',
		    			sorters: [{
		    	            property: 'unique_id',
		    	            direction: 'DESC'
		    	        }]
		    		});
		    		
		    		golistStore.load(function() {
		    			var selModelGo = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		    			
			    		var golistGrid = Ext.create('Ext.grid.Panel', {
			    	        store: golistStore,
			    	        collapsible: false,
			    	        multiSelect: true,
			    	        stateId: 'stateGrid',
			    	        selModel: selModelGo,
			    	        autoScroll : true,
			    	        autoHeight: true,
			    	        height: getCenterPanelHeight(),
			    	     // paging bar on the bottom
			    	        
			    	        bbar: getPageToolbar(store),

			    	        columns: /*(G)*/columnItem,
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
			    						},
			    	                itemcontextmenu: function(view, rec, node, index, e) {
			    	                    e.stopEvent();
			    	                    return false;
			    	                }
			    	            }
			    	        },
			    	        title:'반출이력'
			    	    });
			    		var ptargeGolist = Ext.getCmp('golist-panel-div');
			    		ptargeGolist.removeAll();
			    		ptargeGolist.add(golistGrid);
			    		ptargeGolist.doLayout();
		    		
		    		});//endofload
		    		
		    	}//endogifsuccess
		    }//endofcallback
	   });//endofload

		

		
		
		fLAYOUT_CONTENT(tabPanelList); 
		searchDatetypeStore.load(function(records) {
//			for (var i=0; i<records.length; i++){
//		       	//searchDatetypeStore.push(records[i]);
//			}
//			Ext.getCmp('date_type').select(records[0]);
		});
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
						addAction.disable();
					}else{
						addAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	addAction.disable(); 
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
		            	addAction.disable(); 
	            	}
	            }
	    		focusBarcode();
	        }
	    });
	    
	    myGrid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		if (selections.length) {
		
					if(fPERM_DISABLING()==true) {
						removeAction.disable();
					}else{
						removeAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	removeAction.disable(); 
	            	}else{

		            	removeAction.disable(); 
	            	}
	            }
	    		focusBarcode();
	        }
	    });
	    
	    
	    
		console_log('end create');   
		

		
		Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		});
		cenerFinishCallback();//Load Ok Finish Callback	
		focusBarcode();
	}); //store load
 	console_log('End...');
 	
	});//endof load
});

