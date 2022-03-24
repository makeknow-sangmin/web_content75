var now = new Date();
var month = now.getMonth()+1;
var day = now.getDate();
var year = now.getFullYear();
var date = month+'/'+day;
var delivery_plan = year+'-'+month+'-'+day;

Ext.onReady(function() {

	console_logs('mainVoCaritems',mainVoCaritems);
	console_logs('mainVoBuyer',mainVoBuyer);
	
	if(mainVoCaritems!='') {
		var o=Ext.JSON.decode(mainVoCaritems);
		console_logs('mainVoCaritems o', o);
		var d=o['datas'];
	 	console_logs('d', d);
	 	
	 	var datas = [];

	 	for(i=0; i<d.length; i++) {
	 		var o = d[i];
	 		var data = {};
	   		for(var key in o) {
	   			if(key == 'text') {
	   				data[key] = o[key];	
	   			}
	   			
			}
	   		
	  		data['listeners'] = {
	  				click: function() {
	  					console_logs('this', this);
	  					onAddWindow(this);
	  				} 
	  		};
	  		
	 		console_logs('data', data);
	 		datas.push(data);
		}
	 	
	 	tUtil.caritems=datas;
	 	
	 	console_logs('tUtil', tUtil);
	}
	
	if(mainVoBuyer!='') {
		var o=Ext.JSON.decode(mainVoBuyer);
		console_logs('mainVoBuyer o', o);
		var d=o['datas'];
	 	console_logs('d', d);
	 	
	 	var datas = [];

	 	for(i=0; i<d.length; i++) {
	 		var o = d[i];
	 		var data = {};
	   		for(var key in o) {
	   			if(key == 'text') {
	   				data[key] = o[key];	
	   			}
	   			
			}
	   		
	  		data['listeners'] = {
	  				click: function() {
	  					console_logs('this', this);
	  					onAddWindow2(this);
	  				} 
	  		};
	  		
	 		console_logs('data', data);
	 		datas.push(data);
		}
	 	
	 	tUtil.buyer=datas;
	}
	
//	carStore.load();

//	for(var i=0; i<10; i++){
//   	caritems.push(
//       	{
//               text:  '00',
//               scale: 'large',
//               iconAlign: 'top',
//               toggleGroup: 'usergroup',
//               cls: 'x-btn-as-arrow'
//       	}
//       );
//   };
    
   
    var toolbar = Ext.create('widget.toolbar', {
		cls: 'my-x-toolbar-default2',
		items: [
			{
				xtype: 'textfield',
				width:300,
				fieldStyle: 'background-color: #E6F7DB; background-image: none;font-size: 20px;',
				emptyText: '바코드',
				itemId: 'barcode',
				id:'barcode',
				listeners: {
                	render: function( component ) {
////                component.getEl().on('click', treatOrgCombo  );
////                component.getEl().on('keypress', treatOrgCombo  );
                		component.getEl().on('keydown', function(e) {
	      				if(e.getKey() == 13) {
	      					var val = Ext.getCmp('barcode');
	      					var barcode = val.getValue();
	      					console_logs('val',barcode);
	      					if(barcode.length==19){
	      						tUtil.pj_code=barcode.substr(0,9);
	      						tUtil.del_date=barcode.substr(9,6);
	      						tUtil.qty = barcode.substr(15,4);
	          					console_logs('19',tUtil.pj_code+'-'+tUtil.del_date+'-'+tUtil.qty);
	      					}else if(barcode.length==18){
	      						tUtil.pj_code=barcode.substr(0,9);
	      						tUtil.del_date=barcode.substr(9,6);
	      						tUtil.qty = barcode.substr(15,3);
	          					console_logs('18',tUtil.pj_code+'-'+tUtil.del_date+'-'+tUtil.qty);
	      					}
	      					
				    		for(var i=0; i<tUtil.store.data.items.length; i++) {
				    			var rec_org = tUtil.store.data.items[i];
				    			var rec = rec_org.copy();
				    			
				    			var now = new Date();
				    			var s = now.getTime() + '' + i;
				    			rec.set('id', Number(s))
				    			var prd_volume=0;
				    			console_logs('rec.get(pj_code)',rec.get('pj_code'));
				    			if(tUtil.pj_code==rec.get('pj_code')) {
					    			rec.set('del_date', tUtil.del_date);
					    			rec.set('qty', tUtil.qty);
					    			rec.set('box_qty', 1);
					    			rec.set('total_qty', tUtil.qty);
					    			rec.set('total_weight',prd_volume);
					    			tUtil.delListStore.add(rec);
	//				    			store.add(new store.recordType({ recordKey: key, value: data[key] }));
					    			barcode=val.setValue('');
					    			tUtil.pj_code=null;
				    			}
				    			
				    		}
      					
                    }
      			});
           }
        }
			}, {
				text: '확인',
				scale: 'medium',
				listeners: {
					click: function() {
						console_logs('!!!!!!!!!!!!!!!!!',tUtil.store);
			    		for(var i=0; i<tUtil.store.data.items.length; i++) {
			    			var rec_org = tUtil.store.data.items[i];
			    			var rec = rec_org.copy();
			    			
			    			var now = new Date();
			    			var s = now.getTime() + '' + i;
			    			rec.set('id', Number(s))
			    			
			    			if(tUtil.pj_code==rec.get('pj_code')) {
				    			rec.set('del_date', tUtil.del_date);
				    			rec.set('qty', tUtil.qty);
				    			rec.set('box_qty', 1);
				    			rec.set('total_qty', tUtil.qty);
				    			tUtil.delListStore.add(rec);
//				    			store.add(new store.recordType({ recordKey: key, value: data[key] }));
				    			
			    			}
			    			
			    		}
						
						 //var index = tUtil.store.findExact('id', tUtil.pj_code);
                    }
				}
	
			}, '용적률: ', '차량용적/제품부피','->',
			{
				text: gm.getMC('CMD_DELETE', '삭제'),
				scale: 'medium',
				listeners:{
					click: function() {
						var selectedValue = tUtil.grid.getSelectionModel().selected.items; 
						console_logs('selectedValue', selectedValue);
						
		    			tUtil.delListStore.remove(selectedValue);
		    			
//						for(var i=0; i<selectedValue.length; i++) {
//			    			var rec = tUtil.delListStore.data.items[i];
//			    			console_logs('tUtil.grid rec',rec);
//							
//			    			tUtil.delListStore.remove(rec);
//						}
						
					}
				}
			},
			{
				text: '초기화',
				scale: 'medium',
				listeners:{
					click: function() {
						var val = Ext.getCmp('barcode');
						var barcode=val.setValue('');
						tUtil.delListStore.removeAll();
					}
				}
			},
			{
				text: '전송확인',
				scale: 'medium',
				listeners:{
					click: function() {
//						
//						if(tUtil.pj_code==rec.get('pj_code')) {
//			    			rec.set('del_date', tUtil.del_date);
//			    			rec.set('qty', tUtil.qty);
//			    			rec.set('box_qty', 1);
//			    			rec.set('total_qty', tUtil.qty);
//			    			tUtil.delListStore.add(rec);
////			    			store.add(new store.recordType({ recordKey: key, value: data[key] }));
//			    			
//		    			}
						
						for(var i=0; i<tUtil.delListStore.data.items.length; i++) {
			    			var rec = tUtil.delListStore.data.items[i];
			    			console_logs('tUtil.delListStore rec',rec);
			    			
			    			tUtil.rtgastuids.push(rec.get('unique_id'));
			    			tUtil.out_qty.push(rec.get('total_qty'));
			    			tUtil.reserved_number3s.push(rec.get('reserved_number3'));
						}
						Ext.Ajax.request({
			    			url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqst',
			    			params:{
			    				rtgastUids: tUtil.rtgastuids,
			    				out_qtys : tUtil.out_qty,
			    				reserved_number3s : tUtil.reserved_number3s
			    			},
			    			
			    			success : function(result, request) { 
			    				tUtil.store.load(function(records){
			    					tUtil.delListStore.removeAll();
			    				});
			    				Ext.Msg.alert('안내', '납품서를 생성하였습다. <br>[출하현황] 메뉴를 확인하세요.', function() {});
			    				
			    			},//endofsuccess
//			    			failure: extjsUtil.failureMessage
			    		});//endofajax
					}
				}
			}
			
		]
	});
    
    var toolbar1 = Ext.create('widget.toolbar', {
		cls: 'my-x-toolbar-default2',
		items: [
			{
				text: '다시 그리기',
				scale: 'medium',
                listeners: {
                    click: function() {
                    	tUtil.store.getProxy().setExtraParam('reserved_varchar2',  tUtil.curText);
                    	tUtil.store.getProxy().setExtraParam('limit', 100);
                        tUtil.store.load();
                    }
                }
			},
			'->',
			'정렬: ',
					{
						text: '수주번호',
						value: 'pj_code',
						scale: 'medium',
		                listeners: {
	                        click: function() {
	                        	tUtil.curCnt++;
	                        tUtil.store.getProxy().setExtraParam('orderBy', 'pj_code');
	                        if(tUtil.curCnt%2==0){
	                        	tUtil.store.getProxy().setExtraParam('ascDesc', 'asc');
	                        }else{
	                        	tUtil.store.getProxy().setExtraParam('ascDesc', 'desc');
	                        }
	                        tUtil.store.getProxy().setExtraParam('reserved_varchar2',  tUtil.curText);
	                    	tUtil.store.getProxy().setExtraParam('limit', 100);
	                        tUtil.store.load();
	                        }
	                    }
					},
					{
						text: '품목',
						value: 'item_code',
						scale: 'medium',
		                listeners: {
	                        click: function() {
	                        	tUtil.curCnt++;
	                        	tUtil.store.getProxy().setExtraParam('orderBy', 'item_code');
	                        	if(tUtil.curCnt%2==0){
		                        	tUtil.store.getProxy().setExtraParam('ascDesc', 'asc');
		                        }else{
		                        	tUtil.store.getProxy().setExtraParam('ascDesc', 'desc');
		                        }
	 	                        tUtil.store.getProxy().setExtraParam('reserved_varchar2',  tUtil.curText);
	 	                    	tUtil.store.getProxy().setExtraParam('limit', 100);
	 	                        tUtil.store.load();
	                        }
	                    }
					},
					{
						text: '납품수량',
						value: 'reserved_double1',
						scale: 'medium',
		                listeners: {
	                        click: function() {
	                        	tUtil.curCnt++;
	                        	tUtil.store.getProxy().setExtraParam('orderBy', 'reserved_double1');
	                        	if(tUtil.curCnt%2==0){
		                        	tUtil.store.getProxy().setExtraParam('ascDesc', 'asc');
		                        }else{
		                        	tUtil.store.getProxy().setExtraParam('ascDesc', 'desc');
		                        }
	 	                        tUtil.store.getProxy().setExtraParam('reserved_varchar2',  tUtil.curText);
	 	                    	tUtil.store.getProxy().setExtraParam('limit', 100);
	 	                        tUtil.store.load();
	                        }
	                    }
					}
		
		]
	});
    
    var dataview = Ext.create('Ext.view.View', {
        store: tUtil.store,//Ext.create('tablet.store.DeliveryPendingStore'),
        border: false,
        tpl  : Ext.create('Ext.XTemplate',
            '<tpl for=".">',
                '<div class="phone" ><center>',
                	'<span style="font-size:14px;"><strong>{pj_code}</strong></span>',
                    '<div class="box1"><string>{reserved_double1}</strong><hr /><string>{reserved_double8}/{not_dl_qty}</strong></div>',
                    '<span style="font-size:14px;"><strong>{item_name}{specification}</strong></span>',
                '</center></div>',
            '</tpl>'
        ),

        plugins : [
            Ext.create('Ext.ux.DataView.Animated', {
                duration  : 550,
                idProperty: 'id'
            })
        ],
        id: 'phones',

        itemSelector: 'div.phone',
        overItemCls : 'phone-hover',
        multiSelect : true
    });
    

//
   Ext.define('MyGrid', {
        extend: 'Ext.grid.Panel',
        requires: [
            'Ext.grid.column.Action'
        ],
        store: tUtil.delListStore,
        dockedItems: [toolbar],
        stateful: true,
        multiSelect: true,
        stateId: 'stateGrid',
        title: '출하 확인',
        collapsible: false,
        width: '50%',
        region: 'center',
        margin: '5 0 0 0',
        viewConfig: {
            enableTextSelection: true
        },
        selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
        plugins: [Ext.create('Ext.grid.plugin.CellEditing',{clicksToEdit:1})],
        model: 'Mobile',
    	viewConfig: {
    		markDirty: false,
    		getRowClass: function() {
    			return 'x-wes';
    		}
    	},
    	listeners: {
            edit: function (editor, e, eOpts) {
            	console_logs('editor', editor);
            	console_logs('e', e);
            	console_logs('eOpts', eOpts);
//            var text = e.record.data.name;
				var qty = e.record.data.qty;
				var box_qty = editor.context.value;
//                console_logs('text',text);
////                if (text.length <= 26 && !text.match(/[.:-]/)) {
////                    if (text.length == 26) {
////                        text = text[25] == ' ' ? text : text.substring(0, text.lastIndexOf(' '));
////                    }
//                    //code to set short name cell value.
                    var record = e.record;
                    record.set("total_qty", qty*box_qty); //Here you can set the value
////                }
            }
        },
        initComponent: function () {
            var me = this;
            me.width = 750;
            me.columns = [
            	{
                    text     : '수주번호',
                    flex     : 1,
                    sortable : false,
                    dataIndex: 'pj_code',
                    id: 'pj_code',
                    hidden	 : true
                },
                {
                    text     : '고객사',
                    flex     : 1,
                    sortable : false,
                    dataIndex: 'wa_name'
                },
                {
                    text     : '품명',
                    flex     : 1,
                    sortable : false,
                    dataIndex: 'item_name'
                },
                {
                    text     : '목표수량',
                    width    : 95,
                    sortable : true,
                    align: 'right',
                    dataIndex: 'reserved_double1'
                },
                {
                    text     : '개당수량',
                    width    : 80,
                    sortable : true,
//                    renderer : function(val) {
//                        var out = Ext.util.Format.number(val, '0.00');
//                        if (val > 0) {
//                            return '<span style="color:' + "#73b51e" + ';">' + out + '</span>';
//                        } else if (val < 0) {
//                            return '<span style="color:' + "#cf4c35" + ';">' + out + '</span>';
//                        }
//                        return out;
//                    },
                    dataIndex: 'qty',
                    id:'qty'
                },
                {
                    text     : '박스수량',
                    id		 : 'box_qty',
                    width    : 100,
                    sortable : true,
//                    renderer : function(val) {
//                        var out = Ext.util.Format.number(val, '0.00%');
//                        if (val > 0) {
//                            return '<span style="color:' + "#73b51e" + ';">' + out + '</span>';
//                        } else if (val < 0) {
//                            return '<span style="color:' + "#cf4c35" + ';">' + out + '</span>';
//                        }
//                        return out;
//                    },
                    dataIndex: 'box_qty',
                    editor:{
                        xtype:'numberfield'
                        }//,
//                    listeners:{
//                    	render: function( component ) {
//////                        component.getEl().on('click', treatOrgCombo  );
//////                        component.getEl().on('keypress', treatOrgCombo  );
//              			component.getEl().on('keydown', function(a,b,c,d) {
//              				console_logs('a',a);
//              				console_logs('b',b);
//              				console_logs('c',c);
//              				console_logs('d',d);
////              				var box_qty = Ext.getCmp('box_qty');
////              				var box = box_qty.getValue();
////              				
////              				var qty = Ext.getCmp('qty');
////              				var quan = qty.getValue();
////              				
////              				var pj_code = Ext.getCmp('pj_code');
////              				var pj_code_val = pj_code.getValue();
//              				
////              				var total_qty = Ext.getCmp('total_qty');
////              					total_qty.setValue(box*quan);
//              					
////              				for(var i=0; i<tUtil.delListStore.data.items.length; i++) {
////        			    		var rec = tUtil.delListStore.data.items[i];
////        			    		console_logs('rec.get(pj_code)',rec.get('pj_code'));
////        			    		if(pj_code_val==rec.get('pj_code')) {
////        				    			rec.set('total_qty', *quan);
////        				    			tUtil.delListStore.add(rec);
//////        				    			store.add(new store.recordType({ recordKey: key, value: data[key] }));
////        				    			
////        			    			}
////        			    			
////        			    		}	
//              					
//              					
////              					tUtil.delListStore.load();
//              			});
//                   }
//                    }
                },
                {
                    text     : '합계수량',
                    id		 : 'total_qty',
                    width    : 115,
                    sortable : true,
                    dataIndex: 'total_qty'
                },
                {
                    text     : '제품부피',
                    id		 : 'prd_volume',
                    width    : 115,
                    sortable : true,
                    dataIndex: 'prd_volume'
                },
                {
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [{
                        iconCls: 'sell-col',
                        tooltip: 'Sell stock',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.Msg.alert('Sell', 'Sell ' + rec.get('name'));
                        }
                    }, {
                        getClass: function(v, meta, rec) {
                            if (rec.get('change') < 0) {
                                return 'alert-col';
                            } else {
                                return 'buy-col';
                            }
                        },
                        getTip: function(v, meta, rec) {
                            if (rec.get('change') < 0) {
                                return 'Hold stock';
                            } else {
                                return 'Buy stock';
                            }
                        },
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex),
                                action = (rec.get('change') < 0 ? 'Hold' : 'Buy');

                            Ext.Msg.alert(action, action + ' ' + rec.get('name'));
                        }
                    }]
                }
            ];

            me.callParent();
            
            for(var i=0; i< this.columns.length; i++) {
            	
            	var o = this.columns[i];
            	console_logs('this.columns' + i, o);
            	
            	var dataIndex = o['dataIndex'];
            	
            	switch(dataIndex) {
            	case 'mass':
            	case 'reserved_double4':
            		o['summaryType'] = 'sum';
            		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                    	value = Ext.util.Format.number(value, '0,00.000/i');
                    	
                    	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
                    	return value;
                    };
            		break;
            	case 'reserved_double2':
            	case 'reserved_double3':
            	case 'item_quan':
            	case 'bm_quan':
            		o['summaryType'] = 'sum';
            		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                    	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;"> 합계: '+value +'</font></div>'
                    	return value;
                    };
            		break;
            	/*case 'lot_no':
            		o['summaryType'] = 'count';
            		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                    	value = '<div align="center" style="font: bold 2.0em/1.0em 맑은고딕;"><font style="font-size:15pt; color:blue;">'+value+'건</font></div>'
                    	return value;
                    };
            		break;*/
            		default:
            		/*o['summaryType'] = 'count';
              		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
              			console_logs('value', value);
              			console_logs('summaryData', summaryData);
              			console_logs('dataIndex', dataIndex);
                        return ((value === 0 || value > 1) ? '(' + value + ' 개)' : '(1 개)');
                    };*/
            	}
            	
            }
            for(var i=0; i< this.columns.length; i++) {
            	var o = this.columns[i];
            	console_logs('this.columns' + i, o);
            }
            
    		var option = {
    				features: [{
    		            id: 'group',
    		            ftype: 'groupingsummary',
    		            groupHeaderTpl: '<div><font color=#003471>{name} :: </font><font color=#FF0040>({rows.length} 건)</font></div>',
    		            hideGroupedHeader: true,
    		            enableGroupingMenu: false
    		        }]
    				
    		};
        }
    });
   var grid = Ext.create('MyGrid',  { });
   tUtil.grid=grid;
//   console_logs('grid.selectons',grid.selectons);
    console_logs('tUtil.caritems',tUtil.caritems);
	new Ext.Viewport({
		layout: 'border',
	    bodyBorder: false,
	    
	    defaults: {
	        collapsible: true,
	        split: true,
	        bodyPadding: 10
	    },
	    items: [
	        {
	            region: 'north',
	            collapsible: false,
	            height: 150,
	            minHeight: 150,
	            maxHeight: 150,
	            items: [{
	                xtype: 'buttongroup',
	                columns: 20,
//	                items:[{
//	                	cls           	:              	"x-btn-as-arrow",
//	                	iconAlign           	:               	"top",
//	                	scale            	:               	"large",
//	                	text              	:              	"김영조(1t윙)",
//	                	toggleGroup             	:             	"usergroup",
//	                	value              	:             	"김영조(1t윙)"
//	                }] //
	            	items: tUtil.caritems//tUtil.caritems
	            },
	            {
	                xtype: 'buttongroup',
	                columns: 10,
	                id : 'targetBuyerGroup',
	                items: [] //tUtil.buyer
	            }]
	        },
	        {
	            title: date + ' ' + '출하 대기',
	            region:'west',
	            overflowY: 'auto',
	           // autoHeight: true,
	           // autoScroll : true,
	           // autoWidth: true,
	            collapsible: false,
	            margin: '5 0 0 0',
	            width: '50%',
	            dockedItems: [toolbar1],
	            items: [{
	                	xtype: 'panel',
	                	items:  dataview 
	            }]
	            
	        },
	        grid
	    ],
	    renderTo : Ext.getBody(),
        listeners: {
            afterlayout: function(form) { // ready 
                form.down('#barcode').focus(true);
            }
        }
	});
    
});