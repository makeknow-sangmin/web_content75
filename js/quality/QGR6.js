var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
//global var.

var grid = null;
var store = null;



var addAction = Ext.create('Ext.Action', {
	itemId: 'createButton',	
	iconCls:'add',
    text: '프로젝트 재고확정',
    disabled: true,
    handler: function(widget, event) {
    	var ok = true;
		var selections = grid.getSelectionModel().getSelection();
		console_log(selections);
		if(selections.length==0) {
      	  ok = false;
    	  Ext.MessageBox.alert('No','not selected items.');
    	  return;
		}
		var arrGrqty = [];
		var item_abst = null;
		var cartmap_uids=[];
		for(var i=0; i< selections.length; i++) {
			  var rec = selections[i];
			  //console_logs('rec', rec);
              var quan = rec.get('quan');//string
              var pr_quan = rec.get('pr_quan');//string
              if(i==0) {
                  var item_name = rec.get('item_name');
    			  item_abst = item_name + ' 外';            	  
              }
			  var unique_id = rec.get('unique_uid');
			  cartmap_uids.push(unique_id);

              if(quan < pr_quan){
            	  ok = false;
            	  Ext.MessageBox.alert('경고','확정수량이 요청수량보다 작습니다.');

              }
              if(quan > pr_quan) {
            	  ok = false;
            	  Ext.MessageBox.alert('오류','확정수량은 요청수량보다 클 수 없습니다.');
            	  return;
              }
              arrGrqty[i] = quan;
        }//enof for
		
		console_logs('cartmap_uids', cartmap_uids);
		if(ok == true) {
			
		  	  Ext.MessageBox.show({
		            title:'프로젝트 재고확정',
		            multiline: true,
		            width: 400,
		            msg: '재고확정 내용',
		            value: item_abst,
		            buttons: Ext.MessageBox.YESNO,
		            fn: function (btn, go_reason, opt) {
                        if(btn == 'yes' ) {

                        	grid.setLoading(true);
            				Ext.Ajax.request({
            					url: CONTEXT_PATH + '/quality/wgrast.do?method=createGo',
            					params:{
            						//whouse_uid : whouse_uid
            						//,
            						go_qty : arrGrqty
            						,go_reason : go_reason
            						,item_abst : item_abst
            						,cartmap_uids: cartmap_uids
            						
            					},
            					success : function(result, request) {
            				               store.load(function(){
            				            	   grid.setLoading(false);
            				               });
            					},
            					failure: extjsUtil.failureMessage
            				});
            				
            				
            			}
                        

		            } ,   // printBarcodeCheckConfirm,
		            icon: Ext.MessageBox.QUESTION
		        });
		}
    }//handler end...
});

Ext.onReady(function() {  
	console_log('now starting...');

	Ext.define('CartLine', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/purchase/request.do?method=read&route_type=G',
		            create: CONTEXT_PATH + '/purchase/request.do?method=create',
		            update: CONTEXT_PATH + '/purchase/request.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/request.do?method=destroy'
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
		model: 'CartLine',
		groupField :'pr_no',
		sorters: [{
            property: 'item_code',
            direction: 'ASC'
        }]
	});

	store.getProxy().setExtraParam('reserved_varchar2', 'N');
 	store.load(function(records) {
 		
		for(var i=0; i<records.length; i++) {
			var pr_quan = records[i].get('pr_quan');
			records[i].set('quan', pr_quan);
		}
 		
 		

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if('quan' == dataIndex) {
				columnObj["editor"] = {xtype:  'numberfield', minValue: 0, allowBlank : false}; columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		        	return Ext.util.Format.number(value, '0,00/i');
	        	};
			}

		});
 		
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGrid',
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight: true,
		        height: getCenterPanelHeight(),
		        features: [{ ftype: 'grouping' }],
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		            xtype: 'toolbar',
		            items:[
		                   addAction, '-',
		                   '->',
		                    {
		                        text: panelSRO1133,
		                        iconCls: 'save',
		                        disabled: false,
		                        handler: function ()
		                        {
		                              for (var i = 0; i <grid.store.data.items.length; i++)
		                              {
			                                var record = grid.store.data.items [i];
			                                var unique_uid = record.get('unique_uid');
			                                if (record.dirty) {
			                                	record.set('id',unique_uid);
			                                	console_log(record);
			        		            		//저장 수정
			                                	record.save({
			        		                		success : function() {
			        		                			 store.load(function() {});
			        		                		}
			        		                	 });
			                                }
			                               
			                          }
		                        }
		                    }
		            ]
		        }
		        ],
		        columns: /*(G)*/vCENTER_COLUMNS,
		        plugins: [cellEditing],//필드 에디트
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            markDirty: false,
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
		        title: getMenuTitle()
		    });
		fLAYOUT_CONTENT(grid);
		
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		selectionLength = selections.length;
	            if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					
					if(fPERM_DISABLING()==true) {
						addAction.disable();
					}else{
						addAction.enable();
					}
	            } else {
	            	addAction.disable();
	            }
	        }
	    });

	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
	        Ext.create('Ext.tip.ToolTip', config);
	    });
	    cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	console_log('End...');

});	//OnReady

