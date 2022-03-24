Ext.define('ExecDashboard.view.profitloss.ProfitLossController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.profitloss',
    
    init: function (view) {
    	
    	//필드정의
    	Ext.define('ExtFieldColumn', {	 extend: 'Ext.data.Model',
			 fields: [	    { name: 'name', 	type: "string"    }           
			        ,{ name: 'type',   type: "string"    }
			        ,{ name: 'text', type: "string"    }
			        ,{ name: 'width',type: "int"        } 
			        ,{ name: 'sortable', type: "boolean"    }
			        ,{ name: 'dataIndex', type: "string" }
			        ,{ name: 'useYn', 	type: "string"    }  
			],	proxy: {
					type: 'ajax',    api: {	       read: CONTEXT_PATH + '/dispField.do?method=read'	        },
					reader: {				type: 'json',				rootProperty: 'datas',				totalProperty: 'count',				successProperty: 'success'
					}
			}
		});

		(new Ext.data.Store({ model: 'ExtFieldColumn'}) ).load({
    	    params: {
    	    	menuCode: 'VST4'
    	    },
    	    callback: function(records, operation, successSub) {
    	    	if(successSub ==true) {
					var fieldList = [];
					
					for (var i=0; i<records.length; i++){
						var rec = records[i];
						//console_log(rec);
		var name = rec.get('name'); var type = rec.get('type'); var text = rec.get('text'); var width = rec.get('width'); var sortable = rec.get('sortable');
		var dataIndex = rec.get('dataIndex'); var useYn = rec.get('useYn');

				    }//endoffor
				    
				    
				    
    	    	} else {//ifsubSuccess
					console_log("failed.");
    	    	}
    	    	
    	    },//endof subcallback
    	    scope: this
    	});//endofload
    	
    	
    	
    	
    	view.initView();
    	
    	
    	
    },

    onMetaDataLoad: function (metaProfitLoss) {
        var me = this,
            references = me.getReferences(),
            view = me.getView(),
            menus = {
                quarter: {
                    items: [],
                    listeners: {
                        click: me.onQuarterItemClick,
                        scope: me
                    }
                },
                region: {
                    items: [],
                    listeners: {
                        click: me.onRegionItemClick,
                        scope: me
                    }
                }
            },
            columns = [ view.regionColumn ];

        metaProfitLoss.each(function (metaRecord) {
            var type = metaRecord.data.type,
                value = metaRecord.data.value,
                display = metaRecord.data.display
                ;

            menus[type].items.push(Ext.apply({
                text: metaRecord.data.display,
                value: value,
                type: type,
                listeners: menus[type].listeners
            }, view.menuItemDefaults));

            if (type === 'quarter') {
//            	
//            	// value == 'selling_price' ==> text: "Q1 2010"
//            	var field_name = value.substring(0, 2).toUpperCase() + ' ' + value.substring(3);
//            	
//            	switch(field_name) {
//            		case 'Q1 2010':
//            		field_name = '수주금액';
//            		break;
//               		case 'Q2 2010':
//            		field_name = '예상인건비';
//            		break;
//               		case 'Q3 2010':
//            		field_name = '예상재료비';
//            		break;
//               		case 'Q4 2010':
//            		field_name = '예상매출이익';
//            		break;
//               		case 'Q1 2011':
//            		field_name = '재료비 실적';
//            		break;
//               		case 'Q2 2011':
//            		field_name = '잔여 재료비';
//            		break;
//               		case 'Q3 2011':
//            		field_name = '인건비 실적';
//            		break;
//               		case 'Q4 2011':
//            		field_name = '현재 매출이익';
//            		break;
//            	}
            	
            	switch(value) {
            		case 'profit_plan_ratio':
            		case 'profit_result_ratio':
            		    columns.push(Ext.apply({
		                    text: display,
		                    dataIndex: value
		                }, {
					        renderer: function(value) {
					        	var val = Ext.util.Format.number(value, '0,00.0/i') + '%';
						    	if(value<0) {
						    		val = '<font color="red">' + val + '</font>';
						    	}
						    	return val;
						    },
					        flex: 1,
					        minWidth: 130,
					        align: 'right',
					        groupable: false,
					        menuDisabled: true,
					        resizable: false,
					        sortable: false,
					        summaryType: 'sum'
		            	}));
		                break;
		               default:
		                columns.push(Ext.apply({
		                    text: display,
		                    dataIndex: value
		                }, view.quarterColumnDefaults));
		                
            	}
            }
        });

        menus.region.items.sort(function (lhs, rhs) {
            return (lhs.text < rhs.text) ? -1 : ((rhs.text < lhs.text) ? 1 : 0);
        });

        // We want to tinker with the UI in batch so we don't trigger multiple layouts
        Ext.batchLayouts(function () {
            references.quartersButton.menu.add(menus.quarter.items);
            references.regionsButton.menu.add(menus.region.items);

            view.setColumns(columns);

            view.store.load(); // displays loadMask so include in layout batch
        });
    },

    onQuarterItemClick: function (menuItem) {
        var column = this.getView().getColumnManager().getHeaderByDataIndex(menuItem.value);
        column.setVisible(menuItem.checked);
    },

    onRegionItemClick: function () {
        var view = this.getView(),
            filter = {
                // The id ensures that this filter will be replaced by subsequent calls
                // to this method (while leaving others in place).
                id: 'regionFilter',
                property: 'pj_type',
                operator: 'in',
                value: []
            },
            regionMenu = this.lookupReference('regionsButton').menu;

        regionMenu.items.each(function (item) {
            if (item.checked) {
                filter.value.push(item.value);
            }
        });

        if (filter.value.length === regionMenu.items.length) {
            // No need for a filter that includes everything, so remove it (in case it
            // was there - harmless if it wasn't)
            view.store.getFilters().removeByKey(filter.id);
        } else {
            view.store.getFilters().add(filter);
        }
    },

    // Fix an issue when using touch scrolling and hiding columns, occasionally
    // there is an issue wher the total scroll size is not updated.
    onViewRefresh: function(view) {
        if (view.ownerGrid.normalGrid === view.ownerCt) {
            var scrollManager = view.scrollManager,
                scroller;

            if (scrollManager) {
                scroller = scrollManager.scroller;
                scroller.setSize('auto');
                scroller.refresh();
            }
        }
    }
});
