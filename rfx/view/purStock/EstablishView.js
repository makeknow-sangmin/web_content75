/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.purStock.EstablishView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'establish-view',
    initComponent: function(){

		//검색툴바 필드 초기화
    	this.initSearchField();
    	gMain.addRowActionBoolean = true;
    	//검색툴바 추가
    	 switch(vCompanyReserved4) {
         case 'DOOS01KR':
        	 this.addSearchField ({
                 type: 'dateRange',
                 field_id: 'complete_date',
                 text:'제작완료일:',
                 labelWidth: 70,
                 sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                 edate: new Date()
         	});
        	 this.addSearchField({
 				type: 'condition',
 				width: 180,
 				sqlName: 'partlinemesarap',
 				tableName: 'srcahd',
 				field_id: 'specification',
 				fieldName: 'specification',
 				params: {

 				}
 			});
        	 this.addSearchField({
  				type: 'condition',
  				width: 180,
  				sqlName: 'partlinemesarap',
  				tableName: 'srcahd',
 				emptyText: '블록번호',
  				field_id: 'area_code',
  				fieldName: 'area_code',
  				params: {

  				}
  			});
         	break;
         default:
        	 this.addSearchField ({
                 type: 'dateRange',
                 field_id: 'req_date',
                 text:'기간:',
                 labelWidth: 50,
                 sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                 edate: new Date()
         	});
         }


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
    		REMOVE_BUTTONS : [
  		        	        'REGIST','COPY'
  			]
        });



        //모델 정의
        this.createStore('Rfx.model.Establish', [{
	            property: 'cartmap.unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize
	        ,{
	        	unique_id: 'cartmap.unique_id',
	        	alter_item_code: 'srcahd.alter_item_code'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, [] // delete문에서 사용할 테이블을 지정한다. 단, 앞에 J2_혹은 J3_는 붙이지 않는다.
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
//       this.createGrid(searchToolbar, dateToolbar,buttonToolbar);


		for(var i=0; i< this.columns.length; i++) {

        	var o = this.columns[i];

        	o['locked'] = false;
        	o['sortable'] = false;

        	var dataIndex = o['dataIndex'];

        	switch(dataIndex) {
	        	case 'mass':
	        	case 'reserved_double1':
	        		o['summaryType'] = 'sum';
	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
	                	value = Ext.util.Format.number(value, '0,00.000/i');

	                	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
	                	return value;
	                };
	        		break;
	        	//case 'reserved_double2':
	        	//case 'reserved_double3':
	        	case 'quan':
	        	case 'bm_quan':
	        		o['summaryType'] = 'sum';
	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
	                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
	                	return value;
	                };
	        		break;
	        		default:
        	}
	  }//endoffor



        this.callParent(arguments);
	    //프로세스정보 읽기
        if(gUtil.checkUsePcstpl()==true) {
        	 this.tab_info = [];

        	 // 전체 추가
            this.tab_info.push({
                code: 'ALL',
                name: '전체',
                title: '전체',
                toolbars: [this.createPcsToobars('ALL')]
            });

	      	 for(var i=0; i<gUtil.mesTplProcessBig.length; i++) {
		           	var o = gUtil.mesTplProcessBig[i];
		           	var code = o['code'];
		           	var name = o['name'];
		           	var title = name;
		           	var a = this.createPcsToobars(code);
		            //console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
		           	this.tab_info.push({
		           		code: code,
		           		name: name,
		           		title: title,
		           		toolbars: [a]
		           	});
	      	 }

	      	 console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>this.tab_info', this.tab_info);
	    }
    	var ti = this.tab_info;
        for(var i=0; i<ti.length; i++) {

        	var tab = ti[i];
        	console_logs('this.tab',tab);
        	console_logs('this.columns_map',this.columns_map);

        	var tab_code = tab['code'];
        	var myColumn = this.columns_map[tab_code];
        	var myField =  this.fields_map[tab_code];
        	//공정별 필드 추가하기
        	this.addExtraColumnBypcscode(myColumn, myField, tab_code);

        }

        switch(vCompanyReserved4) {
        case 'DOOS01KR':
        	this.createGrid(null, null, null,  [ {
				text: '수주내역',
				locked: false,
				arr: [0,1,2,3,4]
		   },
		   {
				text: '수금',
				locked: false,
				arr: [5,6,7,8]
		   },
		   {
				text: '지급',
				locked: false,
				arr: [9,10,11,12,13]
		   }]);
        	break;
        case 'CHNG01KR':
        	this.createGrid(null, null, null,  [ {
				text: '수주내역',
				locked: false,
				arr: [0,1,2,3,4]
		   },
		   {
				text: '수금',
				locked: false,
				arr: [5,6,7,8]
		   },
		   {
				text: '지급',
				locked: false,
				arr: [8,9,10,11]
		   }]);
        	break;
        default:
        	this.createGrid(null, null, null,  [ {
				text: '수주내역',
				locked: false,
				arr: [0,1,2,3]
		   },
		   {
				text: '수금',
				locked: false,
				arr: [4,5,6,7]
		   },
		   {
				text: '지급',
				locked: false,
				arr: [8,9,10]
		   }]);
        }




      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

        	console_logs('selections', selections);
        	console_logs('gm.me().selected_tab', gm.me().selected_tab);
        	console_logs('info...	', gm.me().tab_info);
        	var processGrid = gu.id('itemGrid');
        	var code = gm.me().selected_tab;

        	if(code!=undefined) {
            	gm.me().tab_selections[code] = selections;
        	}

            var toolbar = null;
            var items = null;
            if(code!=undefined) {
                var infos = gm.me().tab_info;
                console_logs('infos', infos);
                if(infos!=null) {
                    for(var i=0; i<infos.length; i++) {
                        var o = infos[i];
                        if(o['code'] == code) {
                            var toolbars = o['toolbars'];
                            toolbar = toolbars[0];
                            items = toolbar.items.items;
                        }

                    }
                }

            }

            if (selections.length) {
            	var rec = selections[0];
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //pcstemplete의 unique_id
        		console_logs('cartmap_uid>>>>>>>>>>>>>22	', gMain.selPanel.vSELECTED_UNIQUE_ID);

                if(items!=null) {
                    for(var i=0; i<items.length; i++) {
                        gUtil.enable(items[i]);
                    }
                }


            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
            	//mainmenu.enable();
            }
           /* gm.me().itemGrid.getStore().getProxy().setExtraParam('cartmap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);

            gm.me().itemGrid.getStore().load();*/

        });

        //입력/상세 창 생성.
        this.createCrudTab();
       // this.grid.setTitle('전체');
    	var items = [];
       // items.push(this.grid);

        var tab = this.createTabGrid('Rfx.model.Establish', items, 'big_pcs_code', arr, function(curTab, prevtab) {
        	var multi_grid_id = curTab.multi_grid_id;
    		gm.me().multi_grid_id = multi_grid_id;
    		console_logs('multi_grid_id', multi_grid_id);
        	console_logs('multi_grid_id: ',  multi_grid_id);
        	if(multi_grid_id == undefined || multi_grid_id == 'ALL') { //Main grid
        		gm.me().store.getProxy().setExtraParam('status', null);
        		gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
        		//console_logs('unique_id>>>>>>>>>>>>>	', gMain.selPanel.vSELECTED_UNIQUE_ID);
        		gm.me().storeLoad(function(records){

    	           console_logs('디폴트 데이터', multi_grid_id);
    	     	   for(var i=0; i < records.length; i++){
    	     		   gMain.selPanel.vSELECTED_UNIQUE_ID = records[i].get('unique_id');

    	     		   //var specunit = records[i].data.specification;
    	     		   //gm.me().spec.push(specunit);
    	        		//console_logs('unique_id>>>>>>>>>>>>>	', gMain.selPanel.vSELECTED_UNIQUE_ID);

	        			gm.me().extoutJson(multi_grid_id, records, 'dept_name');
	        			//gm.me().extoutJson(multi_grid_id, records, 'start_date');
	        			gm.me().extoutJson(multi_grid_id, records, 'end_date');
	        			gm.me().extoutJson(multi_grid_id, records, 'give_date');
	        			//gm.me().extoutJson(multi_grid_id, records, 'real_mh');
	        			//gm.me().extoutJson(multi_grid_id, records, 'std_mh');
	        			gm.me().extoutJson(multi_grid_id, records, 'step_uid');

	    	        	console_logs('extoutJson records', records);
    	     	   }

    	        });
        	} else {//추가 탭그리드
        		var store = gm.me().store_map[multi_grid_id];
    			gm.me().store.getProxy().setExtraParam('big_pcs_code', multi_grid_id);
    			gm.me().store.getProxy().setExtraParam('status', null);
        		store.load(function(records) {
        			gm.me().extoutJson(multi_grid_id, records, 'dept_name');
        			//gm.me().extoutJson(multi_grid_id, records, 'start_date');
        			gm.me().extoutJson(multi_grid_id, records, 'end_date');
        			gm.me().extoutJson(multi_grid_id, records, 'give_date');
        			//gm.me().extoutJson(multi_grid_id, records, 'real_mh');
        			//gm.me().extoutJson(multi_grid_id, records, 'std_mh');
        			gm.me().extoutJson(multi_grid_id, records, 'step_uid');
    	        	console_logs('extoutJson records', records);
    	        	arr.push(searchToolbar);
        		});
        	}

        });

        Ext.apply(this, {
            layout: 'border',
            items: [tab,  this.crudTab]
        });

     // 자재코드 조회(기성관리) -- 두성
        this.specAction = Ext.create('Ext.Action', {
        	iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        	text: '자재코드 조회',
        	tooltip: '자재코드 조회',
        	disabled: false,

        	handler: function() {
        		gm.me().searchBySpecification();
        	}
        });

        switch(vCompanyReserved4) {
        case 'DOOS01KR':
            buttonToolbar.insert(3, this.specAction);
        	break;
        default:
        	break;
        }

    	var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '저장',
			 tooltip: '내용 저장',
			 handler: this.saveItemHandler
			});
        // 기성관리 기타품목 grid
		/*this.addTabExtablishPanel('기타입력', 'EEM1_SUB', {
				pageSize: 100,
				model: 'Rfx.model.GenItem',
		        dockedItems: [

			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
							'->',
							savePcsStep,

	      				        ]
				        }
			        ],

					sorters: [{
			           property: 'serial_no',
			           direction: 'ASC'
			       }]
			}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	// console_logs(rec);
	            	gMain.selPanel.selectItemRecord = rec;
	            } else {

	            }
	        },
	        'itemGrid'// toolbar
		);*/


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
       /* this.store.load(function(records){
        });*/


    },

    addTabExtablishPanel: function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	//console_logs('records>>>>>>>>>>', records);
		    	if(success ==true) {
		    		this.callBackItemList(title, records, arg, fc, id);
		    	} else {//endof if(success..
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {

			            }
			        });
		    	}
		    },
		    scope: this
		});

	},
	callBackItemList: function(title, records, arg, fc, id) {
		var gridId = id== null? this.getGridId() : id;

		var o = gMain.parseGridRecord(records, gridId);
		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		var sortBy = o['sortBy'];
		var modelClass = arg['model'];
		var pageSize = arg['pageSize'];
		var sorters = arg['sorters'];
		var checkbox = arg['checkbox'];
		var dockedItems = arg['dockedItems'];
		var model = Ext.create(modelClass, {
        	fields: fields
        });
		var store = new Ext.data.Store({
			pageSize : pageSize,
			model : model,
			sorters : sorters
		});

		var mySorters = [ {
			property : 'p.serial_no',
			direction : 'ASC'
		} ];
		store.getProxy().setExtraParam('sort',
				JSON.stringify(mySorters));

		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });

		 this.genItemStore = Ext.create('Rfx.store.GenItemStore');
		 this.genItemStore.getProxy().setExtraParam('cartmap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);

		Ext.each(
				columns,
				function(o, index) {
					o['sortable'] = false;

					switch (o['dataIndex']) {
					case 'serial_no':
						/*o['editor'] = { -> o['editor']를 null값으로 둘 경우 canEdit은 자동 false가 된다.
							allowBlank : false,
							cellEditing : false
						};*/
						break;
					case 'price':
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['editor'] = {
							id:gu.id(this.link+'price'),
							allowBlank : false,
							xtype : 'numberfield',
							allowBlank : false,
							minValue : 0
						};
						break;
					case 'qty':
						console_logs("qty>>>>>>>>>");
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['editor'] = {
							id:gu.id(this.link+'qty'),
							allowBlank : false,
							xtype : 'numberfield',
							allowBlank : false,
							minValue : 0
						};
						break;
					case 'item_name':
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['editor'] = {
							allowBlank : false,
							canEdit:true,
							xtype : 'textfield',
							allowBlank : false,
							minValue : ''
						};
						break;
				case 'total_price':
						id:gu.id(this.link+'total_price'),
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						/*o['editor'] = {
							 listeners: {
	                          change: function(field, value) {
	                        	  gMain.selPanel.calPrice();
	                          }
	                      }

						};*/


						break;
					}
				});
		var grid = null;

			var addRowAction = Ext.create(
					'Ext.Action',
					{
						iconCls : 'af-plus-circle',
						text : '추가',
						disabled : false,
						handler : function(selections) {

								Ext.Ajax.request({
									url : CONTEXT_PATH
											+ '/purchase/establish.do?method=insertEstablishRow',
									params : {
										cartmap_uid : gMain.selPanel.vSELECTED_UNIQUE_ID
									},
									success : function(result,request) {
										gm.me().itemGrid.getStore().load();
									},
									failure : function(result,request) {
											Ext.MessageBox.show({

			           			            title: '입력 필수',
			           			            msg: '항목,수량,단가를 입력해주세요.',
			           			            buttons: Ext.MessageBox.OK,
			           			            //animateTarget: btn,
			           			            scope: this,
			           			            icon: Ext.MessageBox['ERROR'],
			           			            fn: function() {

			           			            }
			           			        });
										}

								});

						}
					});

			var removeRowAction = Ext.create(
					'Ext.Action',
					{
						iconCls : 'af-remove',
						text : '삭제',
						tooltip : '삭제하기',
						disabled : false,
						handler : function(widget, event) {
							var uids = [];
							var selections = gm.me().itemGrid.getSelectionModel().getSelection();

							 for (var i = 0; i < selections.length; i++) {
                               var rec = selections[i];
                               var unique_uid = rec.get('unique_id');
                               uids.push(unique_uid);
                           }




							console_logs('uids>>>>>>>>>>>>>', uids);
//							var rec = gm.me().itemGrid.get('id');
							// /console_logs('rec', rec);
							Ext.Ajax.request({
										url : CONTEXT_PATH
												+ '/purchase/establish.do?method=deleteEstablishRow',
										params : {
											targetUid : uids,
											cartmap_uid : gMain.selPanel.vSELECTED_UNIQUE_ID
										},
										success : function(result,request) {
											gm.me().itemGrid.getStore().load();
										},
										failure :  function(result,request) {
											Ext.MessageBox.show({

			           			            title: '선택 필수',
			           			            msg: '기타 품목을 선택해주세요.',
			           			            buttons: Ext.MessageBox.OK,
			           			            //animateTarget: btn,
			           			            scope: this,
			           			            icon: Ext.MessageBox['ERROR'],
			           			            fn: function() {

			           			            }
			           			        });
										}
									});

						}
					});

	dockedItems.push(

	{
		dock : 'top',
		xtype : 'toolbar',
		cls : 'my-x-toolbar-default3',
		items : [ '-', addRowAction, removeRowAction ]
	});

	var contextMenu = Ext.create('Ext.menu.Menu', {
		items : [ addRowAction, removeRowAction ]
	});

	try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}

	this.itemGrid =  Ext.create('Ext.grid.Panel', {
    	id: gu.id('itemGrid'),
        store:  this.genItemStore,
        title: title,
    	cls : 'rfx-panel',
    	border: true,
    	resizable: true,
    	scroll: true,
    	multiSelect: true,
        collapsible: false,
        layout          :'fit',
        forceFit: true,
        dockedItems: dockedItems,
    	selModel :Ext.create("Ext.selection.CheckboxModel",{}),
        plugins: [cellEditing],
    	listeners: {
    		 itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function(selModel, record, index, options){

                },
    	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

    	     }, //endof itemdblclick
    	     cellkeydown:function (itemGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
    	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

	                if (e.getKey() == Ext.EventObject.ENTER) {

	                }


	            }
    	},//endof listeners
        columns: columns
    });

	this.itemGrid.getSelectionModel().on({
    	selectionchange: function(sm, selections) {
    		fc(selections);
    	}
	 });



    var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
        down: function(e) {
            var selectionModel = this.itemGrid.getSelectionModel();
            var select = 0; // select first if no record is selected
            if ( selectionModel.hasSelection() ) {
                select = this.itemGrid.getSelectionModel().getSelection()[0].index + 1;
            }
            view.select(select);

        },
        up: function(e) {
            var selectionModel = this.itemGrid.getSelectionModel();
            var select = this.itemGrid.store.totalCount - 1; // select last element if no record is selected
            if ( selectionModel.hasSelection() ) {
                select = this.itemGrid.getSelectionModel().getSelection()[0].index - 1;
            }
            view.select(select);

        }
    });
	this.itemGrid.on('keypress',
			function(t, e) {
				// if (e.getKey() == Ext.EventObject.TAB) {
				console_logs(
						"grid.on('keypress', function(k) ",
						k);
				console_logs(
						"grid.on('keypress', function(e) ",
						e);
				// }
			}, this);
    var tabPanel = Ext.getCmp(gMain.geTabPanelId());

    tabPanel.add(this.itemGrid);
		},

		items : [],
    addExtraColumnLine: function(o, label, myColumn, myField, pos, j, step_field, editable, dataType) {
    	//복사대상
    	var c  = myColumn[0];
    	var f = myField[0];

		var new_c = {};
		for(var key in c) {
			switch(key) {
			case 'dataIndex':
				new_c[key] = o['code']+'|' + step_field;
				break;
			case 'text':
				new_c[key] = label
				break;
			default:
				new_c[key] = c[key];

			}
		}
		var new_f = {};
		for(var key in f) {
			switch(key) {
			case 'text':
				new_f[key] = o['name'];
				break;
			case 'name':
				new_f[key] = o['code']+'|' + step_field;
				break;
			default:
				new_f[key] = f[key];

			}
		}
		new_c['canEdit'] = editable;
		new_c['dataType'] = dataType;
		new_c['important'] = true;
		new_f['tableName'] = 'pcsstep';
		new_f['type'] = dataType;
		new_f['useYn'] = 'Y';

    	console_logs('-----------new_c', new_c);
    	console_logs('--------------new_f', new_f);
    	if(pos<0) {
    		myColumn.push(new_c);
        	myField.push(new_f);
    	} else {
    		myColumn.splice(pos+j, 0, new_c);
        	myField.splice(pos+j, 0, new_f);
    	}
    },
    items : [],
    saveItemHandler : function() {
//    	var gridItem =  Ext.getCmp('itemGrid');
    	var selections = gm.me().itemGrid.getSelectionModel().getSelection();

    	var modifiend =[];
    	for (var i = 0; i <gm.me().itemGrid.store.data.items.length; i++)
    	{
	        var record = gm.me().itemGrid.store.data.items[i];
	        var cartmap_uid =  record.get('cartmap_uid');
       		var serial_no = Number(serial_no) / 10;
       		var total_price = qty*price;
       	 if (record.dirty) {
       		gm.me().itemGrid.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
       		var item_name= record.get('item_name');
       		var price= record.get('price');
       		var total_price= record.get('total_price');
//       		var serial_no = record.get('serial_no');
       		var qty= record.get('qty');
       		var uid=record.get('unique_id');
       		var obj={};
       		obj['item_name'] = record.get('item_name');
       		obj['price'] = record.get('price');
       		obj['qty'] = record.get('qty');
           	obj['cartmap_uid'] = record.get('cartmap_uid');
           	obj['total_price'] = record.get('total_price');
        	obj['unique_id'] = record.get('unique_id');
        	obj['serial_no'] = record.get('serial_no');

        	modifiend.push(obj);

       	 }

	    }
    	  if(modifiend.length>0) {
    		  console_log(modifiend);
    		  var str =  Ext.encode(modifiend);
    		  console_log(str);
    		  console_log('modify>>>>>>>>');
    		    Ext.Ajax.request({
    				url: CONTEXT_PATH + '/purchase/establish.do?method=modifyEstblishList',
    				params:{
    					modifyIno: str,
         				cartmap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
         			},
         			success : function(result, request) {
         				Ext.Msg.alert('저장', '[기타품목]이 저장되었습니다.', function() {});
         				gm.me().itemGrid.store.load(function(record) {
	    					});
         				gm.me().store.load();

         			},//endofsuccess
         			failure: extjsUtil.failureMessage
         		});//endofajax
   			 }

 },
 	calPrice : function(){
 		gridItem.store.load(function(record) {
			for(var i=0;i<record.length;i++){
				var rec = record[i];
				var qty = rec.get('qty');
				var price = rec.get('price');
				var total_price = qty * price;
				console_logs('qty++++++++++++++++++', qty);
				total_price.set('total_price');
				console_logs('total_price++++++++++++++++++', total_price);

			}
 		})

 	},
    //공정별 필드 추가
    addExtraColumnBypcscode: function(myColumn, myField, big_pcs_code) {
    	console_logs('big_pcs_code', big_pcs_code);
    	var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
    	console_logs('smallPcs', smallPcs);

    	var columnGroup = [];

        var cursor =  10;

    	switch(vCompanyReserved4) {
        case 'DOOS01KR':
        columnGroup = [ {
            text: '수주내역',
            locked: false,
            arr: [0,1,2,3,4]
        },
            {
                text: '수금',
                locked: false,
                arr: [5,6,7,8]
            },
            {
                text: '지급',
                locked: false,
                arr: [9,10,11,12,13]
            }];
        cursor = 13;
        break;
        default:
        	columnGroup = [ {
    			text: '수주내역',
    				locked: false,
    				arr: [0,1,2,3]
    		   },
    		   {
    				text: '수금',
    				locked: false,
    				arr: [4,5,6,7]
    		   },
    		   {
    				text: '지급',
    				locked: false,
    				arr: [8,9]
    		   }];
    	}

        var working_group = '작업부서';

        switch(vCompanyReserved4) {
        case 'DOOS01KR':
        	working_group = '작업부서(업체)';
        	break;
        default:
        	break;
        }

        if(smallPcs != null) {
            for(var j=0; j<smallPcs.length; j++) {
                var o = smallPcs[j];
                console_logs('smallPcs o', o);
                var arr = [];
                this.addExtraColumnLine(o, '완료일', myColumn, myField, -1, j, 'end_date', false, 'sdate');
                arr.push(cursor); cursor++;
                this.addExtraColumnLine(o, working_group, myColumn, myField, -1, j, 'dept_name', false, 'string');
                arr.push(cursor); cursor++;
                this.addExtraColumnLine(o, '지급일', myColumn, myField, -1, j, 'give_date', true, 'sdate');
                arr.push(cursor); cursor++;
                columnGroup.push(
                    {
                        text: o['name'],
                        locked: false,
                        arr: arr
                    }
                );


            }//endoffor
		}

    	console_logs('-----------myColumn', myColumn);
    	console_logs('--------------myField', myField);

    	this.column_group_map[big_pcs_code] = columnGroup;
    },
	storeLoadCallback: function(records, store, model) {
        gm.me().extoutJson(gm.me().multi_grid_id, records, 'dept_name');
        gm.me().extoutJson(gm.me().multi_grid_id, records, 'end_date');
        gm.me().extoutJson(gm.me().multi_grid_id, records, 'give_date');
        gm.me().extoutJson(gm.me().multi_grid_id, records, 'step_uid');
	},

	extoutJson: function(multi_grid_id, records, fname) {

    	if(records==null || records.length==0) {
    		return;
    	}
    	var big_pcs_code = multi_grid_id==undefined? 'SSP' : multi_grid_id;
    	var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];

    	if(smallPcs !== undefined) {
            for(var j=0; j<smallPcs.length; j++) {
                var o1 = smallPcs[j];
                var pcsCode = o1['code'];


                for(var i=0; i<records.length; i++) {
                    var o = records[i];
                    o.set(pcsCode+'|'+fname, null);
                }

            }
		}

    	for(var i=0; i<records.length; i++) {
    		var o = records[i];
    		o.set('update_pcsstep', 'ONLY_STEP');//단순수정
    		var js_fname = o.get('js_' + fname);

    		for(var key in js_fname) {
    			//console_logs('key', key);
    			var arr = js_fname[key];
    			if(arr instanceof Array) {
    				o.set(key+'|'+fname, arr[0]);
    			} else {
    				o.set(key+'|'+fname, arr);
    			}
    		}

    	}
    },
	selected_tab: null,
	tab_selections: {},
    doSample: function() {

    },
    editRedord: function(field, rec) {

    	switch(vCompanyReserved4) {
    	case 'DOOS01KR':
			var value=rec.get(field);
	    	var tableName = gm.getTableName(field);
	    	var whereField = "unique_id";
    		switch(gm.getTableName(field)) {
    		case 'assymap':
    		case 'itemdetail':
		    	var whereValue = rec.get("coord_key3");
		    	gm.editAjax(tableName, field, value, whereField, whereValue,  {type:''});
    			break;
    		default:
    			gm.editRedord(field, rec);
    		}
    		this.getStore().load();
	    	break;
	    default:
	    	gm.editRedord(field, rec);
    	}
	},

    createPcsToobars : function(code) {
        console_logs('createPcsToobars code', code);
        var buttonItems = [];

        buttonItems.push(
            {   name: code + 'sales_price',
                cmpId: code + 'sales_price',
                allowBlank: true,
                xtype: 'numberfield',
                value: '0',
                width: 100,
                handler: function(){
                }
            });

        var action_1 = {
            xtype: 'button',
            iconCls: 'af-check',
            cmpId: code+ 'sales_price_action',
            text: '단가',
            big_pcs_code: code,
            pcs_code: code1,
            disabled: true,
            handler: function() {
                var text = gm.me().findToolbarCal(this.big_pcs_code, 1);
                console_logs('text', text);
                if(text==null) {
                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
                } else {
                    var date = text.getValue();
                    var selections = gm.me().tab_selections[this.big_pcs_code];
                    console_logs('selections>>>>>>>>', selections);
                    if(selections!=null) {
                        var whereValue = [];
                        var field = this.pcs_code + '|' + 'end_date';
                        for( var i=0; i<selections.length; i++) {
                            var o = selections[i];
                            o.set(field, date);
                            console_logs('this.pcs_code', this.pcs_code);
                            var step_uid = o.id;
                            whereValue.push(step_uid);
                        }
                        console_logs('createPcsToobars', whereValue);
                        gm.editAjax('cartmap', 'sales_price', date, 'unique_id', whereValue,  {type:''});
                        gm.me().getStore().load();
                    }

                }

            }
        };

        var action_2 = {
            xtype: 'button',
            iconCls: 'af-check',
            cmpId: code+ 'give_price_action',
            text: '지급단가',
            big_pcs_code: code,
            pcs_code: code1,
            disabled: true,
            handler: function() {
                var text = gm.me().findToolbarCal(this.big_pcs_code, 1);
                console_logs('text', text);
                if(text==null) {
                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
                } else {
                    var date = text.getValue();
                    var selections = gm.me().tab_selections[this.big_pcs_code];
                    console_logs('selections>>>>>>>>', selections);
                    if(selections!=null) {
                        var whereValue = [];
                        var field = this.pcs_code + '|' + 'end_date';
                        for( var i=0; i<selections.length; i++) {
                            var o = selections[i];

                            o.set(field, date);
                            console_logs('o', o);
                            console_logs('this.pcs_code', this.pcs_code);
                            var step_uid = o.id;
                            whereValue.push(step_uid);
                        }
                        console_logs('createPcsToobars', whereValue);
                        gm.editAjax('cartmap', 'source_price', date, 'unique_id', whereValue,  {type:''});
                        gm.me().getStore().load();
                    }

                }

            }
        };

        var action_3 = {
            xtype: 'button',
            iconCls: 'af-check',
            cmpId: code+ 'finish_price_action',
            text: '기지급',
            big_pcs_code: code,
            pcs_code: code1,
            disabled: true,
            handler: function() {
                var text = gm.me().findToolbarCal(this.big_pcs_code, 1);
                console_logs('text', text);
                if(text==null) {
                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
                } else {
                    var date = text.getValue();
                    var selections = gm.me().tab_selections[this.big_pcs_code];
                    console_logs('selections>>>>>>>>', selections);
                    if(selections!=null) {
                        var whereValue = [];
                        var field = this.pcs_code + '|' + 'end_date';
                        for( var i=0; i<selections.length; i++) {
                            var o = selections[i];
                            o.set(field, date);
                            console_logs('o', o);
                            console_logs('this.pcs_code', this.pcs_code);
                            var step_uid = o.id;
                            whereValue.push(step_uid);
                        }
                        console_logs('createPcsToobars', whereValue);
                        gm.editAjax('cartmap', 'reserved_double3', date, 'unique_id', whereValue,  {type:''});
                        gm.me().getStore().load();
                    }

                }

            }
        };

        buttonItems.push(action_1);
        buttonItems.push(action_2);
        buttonItems.push(action_3);
        buttonItems.push('-');

        buttonItems.push(
            {   name: code + 'finish_date',
                cmpId: code + 'finish_date',
                format: 'Y-m-d',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                allowBlank: true,
                xtype: 'datefield',
                value: new Date(),
                width: 100,
                handler: function(){
                }
		});

        var collect_action = {
            xtype: 'button',
            iconCls: 'af-check',
            cmpId: code+'collect_action',
            text: '수금일',
            big_pcs_code: code,
            pcs_code: code1,
            disabled: true,
            handler: function() {
                console_logs('createPcsToobars', this.cmpId + ' clicked');
                console_logs('big_pcs_code', this.big_pcs_code);
                console_logs('pcs_code', this.pcs_code);
                var text = gm.me().findToolbarCal(this.big_pcs_code, 0);
                console_logs('text', text);
                if(text==null) {
                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
                } else {
                    var date = text.getValue();
                    console_logs('val', date);
                    var selections = gm.me().tab_selections[this.big_pcs_code];
                    console_logs('selections>>>>>>>>', selections);
                    if(selections!=null) {
                        var whereValue = [];
                        //var field = this.pcs_code + '|' + 'give_date';
                        for( var i=0; i<selections.length; i++) {
                            var o = selections[i];
                            //o.set(field, date);
                            console_logs('o', o);
                            console_logs('this.pcs_code', this.pcs_code);
                            var step_uid = o.data.coord_key3;
                            whereValue.push(step_uid);
                        }
                        console_logs('createPcsToobars', whereValue);
                        gm.editAjax('itemdetail', 'h_reserved95', date, 'unique_id', whereValue,  {type:''});
                        gm.me().getStore().load();
                    }

                }

            }
        };

        buttonItems.push(collect_action);

        var give_action = {
            xtype: 'button',
            iconCls: 'af-check',
            cmpId: code+'give_action',
            text: '지급일',
            big_pcs_code: code,
            pcs_code: code1,
            disabled: true,
            handler: function() {
                console_logs('createPcsToobars', this.cmpId + ' clicked');
                console_logs('big_pcs_code', this.big_pcs_code);
                console_logs('pcs_code', this.pcs_code);
                var text = gm.me().findToolbarCal(this.big_pcs_code, 0);
                console_logs('text', text);
                if(text==null) {
                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
                } else {
                    var date = text.getValue();
                    console_logs('val', date);
                    var selections = gm.me().tab_selections[this.big_pcs_code];
                    console_logs('selections>>>>>>>>', selections);
                    if(selections!=null) {
                        var whereValue = [];
                        //var field = this.pcs_code + '|' + 'give_date';
                        for( var i=0; i<selections.length; i++) {
                            var o = selections[i];
                            //o.set(field, date);
                            console_logs('o', o);
                            console_logs('this.pcs_code', this.pcs_code);
                            var step_uid = o.id;
                            whereValue.push(step_uid);
                        }
                        console_logs('createPcsToobars', whereValue);
                        gm.editAjax('cartmap', 'reserved_timestamp5', date, 'unique_id', whereValue,  {type:''});
                        gm.me().getStore().load();
                    }

                }

            }
        };

        buttonItems.push(give_action);

        var temp_code = code;

        if(vCompanyReserved4 == 'DOOS01KR' || vCompanyReserved4 == 'HSGC01KR') {
            switch(code) {
                case 'S':
                case 'DS':
                case 'ES':
                    temp_code = 'PRD';
                    if(vCompanyReserved4 == 'HSGC01KR') {
                        temp_code = 'ASB';
                    }
                    break;
                case 'T':
                case 'DT':
                    temp_code = 'TPRD';
                    if(vCompanyReserved4 == 'HSGC01KR') {
                        temp_code = 'STE';
                    }
                    break;
                case 'TPK':
                case 'DTPK':
                    temp_code = 'KPRD';
                    break;
                case 'TP':
                case 'EP':
                    temp_code = 'NPNT';
                    break;
                case 'TPPK':
                case 'EPPK':
                    temp_code = 'GPNT';
                    break;
                default:
                    break;
            }
        }
        var smallPcs = gUtil.mesTplProcessAll[temp_code];
        console_logs('-------------->  smallPcs', smallPcs);

		if(smallPcs!=null && smallPcs.length>0) {

			for(var i=0; i <smallPcs.length; i++) {
				var o1 = smallPcs[i];
				var code1  = o1['code'];
				var name1 = o1['name'];
				console_logs('createPcsToobars code1', code1);
				console_logs('createPcsToobars name1', name1);

				var action = {
					xtype: 'button',
					iconCls: 'af-check',
					cmpId: code+code1,
					text: name1 + ' 지급일',
					big_pcs_code: code,
					pcs_code: code1,
					disabled: true,
					handler: function() {
						console_logs('createPcsToobars', this.cmpId + ' clicked');
						console_logs('big_pcs_code', this.big_pcs_code);
						console_logs('pcs_code', this.pcs_code);
						var text = gm.me().findToolbarCal(this.big_pcs_code, 0);
						console_logs('text', text);
						if(text==null) {
							Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
						} else {
							var date = text.getValue();
							console_logs('val', date);
							var selections = gm.me().tab_selections[this.big_pcs_code];
							console_logs('selections>>>>>>>>', selections);
							if(selections!=null) {
								var whereValue = [];
								var field = this.pcs_code + '|' + 'give_date';
								for( var i=0; i<selections.length; i++) {
									var o = selections[i];
									o.set(field, date);
									console_logs('o', o);
									console_logs('this.pcs_code', this.pcs_code);
									var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
									whereValue.push(step_uid);
								}
								console_logs('createPcsToobars', whereValue);
								gm.editAjax('pcsstep', 'give_date', date, 'unique_id', whereValue,  {type:'update_pcsstep'});
							}

						}

					}
				};
				buttonItems.push(action);
			}//endoffor
		}//endofif

        console_logs('createPcsToobars buttonItems', buttonItems);
        var buttonToolbar1 = Ext.create('widget.toolbar', {
            items: buttonItems
        });

        console_logs('createPcsToobars buttonToolbar', buttonToolbar1);

        return buttonToolbar1;
    },

    findToolbarCal: function(big_pcs_code, mode) {
        var toolbar = null;
        var items = null;
        if(big_pcs_code!=undefined) {
            var infos = gm.me().tab_info;
            console_logs('infos', infos);
            if(infos!=null) {
                for(var i=0; i<infos.length; i++) {
                    var o = infos[i];
                    if(o['code'] == big_pcs_code) {
                        var toolbars = o['toolbars'];
                        toolbar = toolbars[0];
                        items = toolbar.items.items;
                    }

                }
            }

        }

        if(items!=null && items.length>0) {
        	if(mode == 0) {
                return items[5];
			} else {
        		return items[0];
			}
        } else {
            return null;
        }

        console_logs('toolbar', toolbar);
        console_logs('toolbar items', items);
    },

	 searchBySpecification : function(dataIndex, subject) {
	    	var title = '자재코드';
			var g = this.getGrid();
		    var txt  = '';
		    var num = 0;

		    if(num>0) {
		    	title = title + ' (' + selections.length + '개)';
		    }

		    Ext.MessageBox.show({
	            title: '선택한 값 목록',
	            msg: title,
	            width:300,
	            height:500,
	            buttons: Ext.Msg.OKCANCEL,
	            multiline: true,
	            defaultTextHeight: 390,
	            scope: this,
	            value: this.prevTagnoIn,
	            initComponent: function() {
	            	console_logs('initComponent', this.value);
	            },
	            fn: function(btn, text, c) {
	            	console_logs('btn', btn);
	            	console_logs('text', text);
	            	console_logs('c', c);


	            	this.prevTagnoIn = text;

	            	var field = 'specification';  // menu
	            	var arr = text.split('\n');

	            	console_logs('===arr', arr);

	            	var val = '';
	            	for(var i=0; i<arr.length; i++) {
	            		if(val == '') {
	            			val = arr[i];
	            		} else {
	            			val = val + ',' + arr[i];
	            		}
	            	}
	            	var store = this.getStore();

	            	store.getProxy().setExtraParam({});
	            	store.getProxy().setExtraParam(field, val);

	            	store.load();
	            	if(btn == 'yes' && text != '') {

	            	}
	            }
	        });
	    }
});
