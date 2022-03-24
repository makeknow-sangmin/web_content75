var grid = null;
var store = null;

var var_item_code = null;
var po_no = null;
var gr_no = null;
var item_name = null;
var account_name = null;
var seller_name = null;
var pr_user_name = null;

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: function() {
    	mySearch();
    }
});



var arrSearchObj=[];


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
		params: {start: 0, limit:100, page:1}	
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
		    width: 70,
		    labelAlign: 'right',
		    align:'right',
		    margin: '5 6 2 10',
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

Ext.onReady(function() { 
	console_log('now starting...');
	
	var comboToolBar = getComboToolBar();
	var searchToolBar = getSearchToolBar();
	LoadJs('/js/util/comboboxtree_cloud.js');
	
	
	var searchDatetypeStore  = Ext.create('Mplm.store.SearchDatetypeStore', {hasNull: false} );
//	var dataType_datas = [];
//	function getPosDatatype(id){
//		for (var i=0; i<dataType_datas.length; i++){
//			if(dataType_datas[i].get('systemCode') == id){
//				return dataType_datas[i];
//			}
//		}
//		return null;
//	}
	
	var newCenterColumn = [];
	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
		
		//console_logs('vCENTER_COLUMNS[' + i + ']', vCENTER_COLUMNS[i]);
		
		var o = vCENTER_COLUMNS[i];
		
		vCENTER_COLUMNS[i]['listeners'] = '';
		
		var o1 = {
				header: o['text'],
		        width: o['width'],
		        sortable: o['sortable'],
		        dataIndex: o['dataIndex']				
		};
		
		
		//console_logs('newCenterColumn[' + i + ']', newCenterColumn[i]);
		
		
//		vCENTER_COLUMNS[i]['summaryType'] = 'count';
//		vCENTER_COLUMNS[i]['summaryRenderer'] = function(value, summaryData, dataIndex) {
//            return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
//        };
		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			case 'mp_status':
				break;
			case 'by_item_code':
				break;
			case 'item_code':
				break;
			case 'pl_no':
				break;
			case 'po_no':
				break;
			case 'pr_no':
				break;
			case 'po_date':
			case 'req_delivery_date':
				o1['summaryType'] = 'max';
				o1['renderer'] = function(value, summaryData, dataIndex) {
		            return value.substring(0,10);
		        };
		        o1['summaryRenderer'] = function(value, summaryData, dataIndex) {
		            return value.substring(0,10);
		        };
				//o1['field'] = { xtype: 'datefield'};
				//o1['renderer'] = Ext.util.Format.dateRenderer('Y-m-d');
				//o1['summaryRenderer'] = Ext.util.Format.dateRenderer('Y-m-d');
				break;

			case 'item_name':
				o1['summaryType'] = 'count';
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {
		            return ((value === 0 || value > 1) ? '(' + value + ' 종)' : '(1 종)');
		        };
				break;
			case 'seller_name':
				break;
			case 'seller_code':
				break;
			case 'account_name':
				break;
			case 'account_code':
				break;
			case 'sales_price':
				o1['summaryType'] = 'average';
				o1['field'] = { xtype: 'numberfield'};
				o1["align"] = "right";
				o1["renderer"] = renderNumber
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {  return '평균:' + Ext.util.Format.number(value, '0,00/i');   };
				break;
			case 'po_qty':
				o1['summaryType'] = 'sum';
				o1['field'] = { xtype: 'numberfield'};
				o1["align"] = "right";
				o1["renderer"] = renderNumber
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {  return '' + Ext.util.Format.number(value, '0,00/i');   };
				break;
			case 'po_amount':
				o1['summaryType'] = 'sum';
				o1['field'] = { xtype: 'numberfield'};
				o1["align"] = "right";
				o1["renderer"] = renderNumber
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {  return '합계:' + Ext.util.Format.number(value, '0,00/i');   };
				break;
			case 'pr_name':
				break;
			case 'po_creator_name':
				break;
			default:
		}
		
		newCenterColumn.push(o1);
	}
	
	

	//makeSrchToolbar(searchField);
	Ext.define('XpoAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetail'
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
		model: 'XpoAst',
		groupField :'po_no',
		sorters: [{
            property: 'create_date',
            direction: 'DESC'
        }]
	});
	
	store.load(function() {
		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		
	    var showSummary = true;
		grid = Ext.create('Ext.grid.Panel', {
	        store: store,
	        collapsible: true,
	        multiSelect: true,
	        stateId: 'stateGrid',
	        selModel: selModel,
	        autoScroll : true,
	        autoHeight: true,
	        height: getCenterPanelHeight(),
	        features: [{
	            id: 'group',
	            ftype: 'groupingsummary',
	            groupHeaderTpl: '{name}',
	            hideGroupedHeader: true,
	            enableGroupingMenu: false
	        }],
	        bbar: getPageToolbar(store),
	        
	        dockedItems: [
			{
					xtype: 'toolbar',
					items: [
					        searchAction, '-',
					        {
	      		                width:90,
	      						id :'date_type',
	      		                name:           'date_type',
	      						xtype:          'combo',
	      		                mode:           'local',
	      		                allowBlank: false,
	      		                forceSelection: true,
	      		                editable:       false,
	      		               
	      		                emptyText:  '주문일자',
	      		                displayField:   'codeName',
	      		                valueField:     'systemCode',
	      		                value: 'po_date',
		      		            triggerAction:  'all',
	      		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	      		                queryMode: 'remote',
	      		                store: searchDatetypeStore,
	      		                listConfig:{
	      		                	getInnerTpl: function(){
	      		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	      		                	}			                	
	      		                }
//					        ,
//	      		                	listeners: {
//	      		                		select: function (combo, record) {
//	      		                			var isComplished = Ext.getCmp('date_type').getValue();
//	      		                			store.getProxy().setExtraParam('date_type', isComplished);
//	      				     				store.load({});
//	      		                		}//endofselect
//	      		                	}
	      		        	},
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
	      					},'-','->',
	      					{
	      		                tooltip: '합계표시 여부를 토글링합니다.',
	      		                text: '합계 표시',
	      		                handler: function(){
	      		                    var view = grid.getView();
	      		                    showSummary = !showSummary;
	      		                    view.getFeature('group').toggleSummaryRow(showSummary);
	      		                    view.refresh();
	      		                }
	      		            }
					        ]
			},
	                      
	      {
			xtype: 'toolbar',
			items: [
			        getSearchObj('var_item_code', '품목코드'),
			        getSearchObj('by_item_code', 'ASSY코드'),
			        getSearchObj('pr_no', '요청번호'),
			        getSearchObj('po_no', '주문번호'),
			        getSearchObj('gr_no', '입고번호')
			        
			        ]
			},
	      {
				xtype: 'toolbar',
				items: [
				        getSearchObj('dept_code', '부서코드'),
				        getSearchObj('account_code', '프로젝트코드'),
				        getSearchObj('account_name', '프로젝트이름'),
				        getSearchObj('seller_code', '공급사코드'),
				        getSearchObj('seller_name', '공급사이름'),
				        ]
				},
			      {
					xtype: 'toolbar',
					items: [
					        getSearchObj('po_user_name', '주문자'),
					        getSearchObj('pr_user_name', '요청자'),
					        getSearchObj('item_name', '품명'),
					        getSearchObj('gr_reason', '입고 의견')
					        
					        ]
					}
	        ],
	        columns: newCenterColumn,
	        //columns: /*(G)*/vCENTER_COLUMNS,
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
	                    return false;
	                }
	            }
	        },
	        title: getMenuTitle()
	    });
		fLAYOUT_CONTENT(grid);
		
		searchDatetypeStore.load(function(records) {
			for (var i=0; i<records.length; i++){
		       	//searchDatetypeStore.push(records[i]);
			}
			Ext.getCmp('date_type').select(records[0]);
		});
		
		
		grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	            if (selections.length) {
					displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
					}else{
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            	}
	            }
	        }
	    });
		
		cenerFinishCallback();//Load Ok Finish Callback
	});
	console_log('End...');
});
