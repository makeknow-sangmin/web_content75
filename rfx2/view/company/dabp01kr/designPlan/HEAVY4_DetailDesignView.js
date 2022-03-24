Ext.define('Rfx2.view.company.dabp01kr.designPlan.HEAVY4_DetailDesignView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'detail-po-view',
    initComponent: function(){
    	
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	useMultitoolbar = true;
    	//검색툴바 필드 초기화
    	this.initSearchField();


    	switch(vCompanyReserved4) {
            case 'KYNL01KR':
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'po_date',
                    text: '주문일자' ,
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'r',
                    field_id: 'po_no',
                    fieldName: 'po_no',
                    params: {
                        rtg_type: 'O'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'a',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                        rtg_type: 'O'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'a',
                    field_id: 'seller_name',
                    fieldName: 'seller_name',
                    params: {
                        rtg_type: 'O'
                    }
                });
                break;
			case 'HSGC01KR':
                switch(this.link) {
                    case 'PPO3_MK':
                        var po_type = 'MK';
                        break;
                    default:
                        var po_type = 'MN';
                }
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'po_date',
                    text: '주문일자' ,
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'a',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                        rtg_type: 'O',
                        po_type: po_type
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'a',
                    field_id: 'seller_name',
                    fieldName: 'seller_name',
                    params: {
                        rtg_type: 'O',
                        po_type: po_type
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'xpoast-abst-po-row-heavy',
                    tableName: 'r',
                    field_id: 'reserved_varcharb',
                    fieldName: 'reserved_varcharb',
                    params: {
                        rtg_type: 'O',
                        po_type: po_type
                    }
                });
                break;
            case 'KWLM01KR':
                this.addSearchField (
                    {
                        field_id: 'date_type'
                        ,store: "DatetypeStore"
                        ,displayField: 'codeName'
                        ,valueField: 'systemCode'
                        ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
                    });

                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'listpodate',
                    labelWidth: 0,
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });

                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'pj_code',
                    fieldName: 'pj_code'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'po_no',
                    fieldName: 'po_no'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'seller_name',
                    fieldName: 'seller_name'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'item_name',
                    fieldName: 'item_name'
                });

                //Readonly Field 정의
                this.initReadonlyField();
                this.addReadonlyField('unique_id');
                this.addReadonlyField('create_date');
                this.addReadonlyField('creator');
                this.addReadonlyField('creator_uid');
                this.addReadonlyField('user_id');
                this.addReadonlyField('board_count');

                this.addSearchField({
					 field_id: 'wa_code'
					,store: 'DivisionStore2'
					,displayField:   'division_name'
					,valueField:   'wa_code'
					,innerTpl	: '<div data-qtip="{wa_code}">{division_name}</div>'
                });

                break;
            case 'SKNH01KR':
                this.addSearchField (
                    {
                        field_id: 'date_type'
                        ,store: "DatetypeStore"
                        ,displayField: 'codeName'
                        ,valueField: 'systemCode'
                        ,emptyText: '기준기간'
                        ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
                    });

                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'listpodate',
                    labelWidth: 0,
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });

                this.addSearchField ({
                    type: 'distinct',
                    width: 130,
                    tableName: 'project',
                    field_id: 'project_varchar3',
                    fieldName: 'reserved_varchar3'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 130,
                    tableName: 'xpoast',
                    field_id: 'po_no',
                    fieldName: 'po_no'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'seller_name',
                    fieldName: 'seller_name'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'item_name',
                    fieldName: 'item_name'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 250,
                    tableName: 'xpoast',
                    field_id: 'specification',
                    fieldName: 'specification'
                });
                this.initReadonlyField();
                this.addReadonlyField('unique_id');
                this.addReadonlyField('create_date');
                this.addReadonlyField('creator');
                this.addReadonlyField('creator_uid');
                this.addReadonlyField('user_id');
                this.addReadonlyField('board_count');

                break;
			default:
                this.addSearchField (
                    {
                        field_id: 'date_type'
                        ,store: "DatetypeStore"
                        ,displayField: 'codeName'
                        ,valueField: 'systemCode'
                        ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
                    });

                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'listpodate',
                    labelWidth: 0,
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });

                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'project_varchar3',
                    fieldName: 'reserved_varchar3'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'po_no',
                    fieldName: 'po_no'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'seller_name',
                    fieldName: 'seller_name'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
                    field_id: 'item_name',
                    fieldName: 'item_name'
                });

                switch(vCompanyReserved4){
                    case 'DDNG01KR':
                        this.addSearchField('product_name_dabp');
                        break;
                    default:
                        break;
                }
                //Readonly Field 정의
                this.initReadonlyField();
                this.addReadonlyField('unique_id');
                this.addReadonlyField('create_date');
                this.addReadonlyField('creator');
                this.addReadonlyField('creator_uid');
                this.addReadonlyField('user_id');
                this.addReadonlyField('board_count');

                break;
		}

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Heavy4DetailPo', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
            , { }
            , ['xpoast']
	        );

  
		  var arr = [];
	      arr.push(buttonToolbar);
		
		 //검색툴바 생성
    	if(	useMultitoolbar == true ) {
    		var multiToolbar =  this.createMultiSearchToolbar({first:9, length:11});
    		console_logs('multiToolbar', multiToolbar);
            for(var i=0; i<multiToolbar.length; i++) {
        		arr.push(multiToolbar[i]);
            }
    	} else {
    		var searchToolbar =  this.createSearchToolbar();
    		arr.push(searchToolbar);
    	}
//        toolbars.push(searchToolbar);
        this.createGrid(arr);

    	if(vCompanyReserved4 != 'KYNL01KR') {

            this.setAllGrView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '전체',
                tooltip: '전체목록',
                pressed: true,
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gMain.selPanel.poviewType = 'ALL';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.setSubGrView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '부자재',
                tooltip: '부자재 입고',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gMain.selPanel.poviewType = 'SUB';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                    gMain.selPanel.store.load(function(){});
                }
            });
            this.setRawGrView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '원단',
                tooltip: '원단 주문',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gMain.selPanel.poviewType = 'RAW';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'O');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.RsetPaperGrView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '원자재',
                tooltip: '원자재',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gMain.selPanel.poviewType = 'ROLL';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                    gMain.selPanel.store.load(function(){});
                }
            });
            this.SsetMroGrView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '소모품',
                tooltip: '소모품',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gMain.selPanel.poviewType = 'SHEET';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K3');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.KsetMisGrView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '잡자재',
                tooltip: '잡자재',
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gMain.selPanel.poviewType = 'SHEET';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
                    gMain.selPanel.store.load(function(){});
                }
            });

        } else {
            this.setAllMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '전체',
                tooltip: '전체',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    gMain.selPanel.stockviewType = 'ALL';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                    gMain.selPanel.store.load(function(){});
                }
            });


            this.setRawMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '원자재',
                tooltip: '원자재 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'RAW';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.setPaintMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: 'PAINT자재',
                tooltip: 'PAINT자재 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'PNT';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.setSaMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '공구',
                tooltip: '공구 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'SUB';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                    gMain.selPanel.store.load(function(){});
                }
            });
            this.setSubMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류' : '기타소모품',
                tooltip: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류 재고' : '기타소모품 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'MRO';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
                    gMain.selPanel.store.load(function(){});
                }
            });
        }


        // remove the items
        switch(vCompanyReserved4) {
            case 'HSGC01KR':
                (buttonToolbar.items).each(function(item,index,length){
                    if(index==1||index==2||index==3||index==4/*||index==5*/) {
                        buttonToolbar.items.remove(item);
                    }
                });
                break;
            default:
                (buttonToolbar.items).each(function(item,index,length){
                    if(index==1||index==2||index==3||index==4||index==5) {
                        buttonToolbar.items.remove(item);
                    }
                });
        }

        
      //버튼 추가.
        if(vCompanyReserved4 == 'KYNL01KR') {
            buttonToolbar.insert(7, this.setSubMatView);
            buttonToolbar.insert(7, this.setSaMatView);

            buttonToolbar.insert(7, this.setPaintMatView);

            buttonToolbar.insert(7, this.setRawMatView);
            buttonToolbar.insert(7, this.setAllMatView);
        } else {

            buttonToolbar.insert(5, '-');
            buttonToolbar.insert(5, this.KsetMisGrView);
            buttonToolbar.insert(5, this.SsetMroGrView);
            buttonToolbar.insert(5, this.setSubGrView);
            // buttonToolbar.insert(5, this.setRawGrView);
            buttonToolbar.insert(5, this.RsetPaperGrView);
            buttonToolbar.insert(5, this.setAllGrView);
            buttonToolbar.insert(3, '-');

        }





        //입력/상세 창 생성.
        this.createCrudTab();
       
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.addTablistPoviewGridPanel('상세보기', 'PPO2_SUB', {
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			model:'Rfx.store.ListPoViewStore',
	        dockedItems: [
		     
		        {
		            dock: 'top',
		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
		            cls: 'my-x-toolbar-default3',
		            items: [
		                    '->',
//		                    saveListPo,
		                    ]
			        }
		        ],
				sorters: [{
		           property: 'unique_id',
		           direction: 'ASC'
		       }]
		}, 
function(selections) {
			
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('상세정보>>>>>>>>>>>>>', rec);
            
            	var uids = [];     
            	for( var i=0; i<selections.length; i++) {
            	var o = selections[i];
//            	o.set('gr_qty', gMain.selPanel.gr_qty);
            	
				var xpoast_uid = o.get('id');
				uids.push(xpoast_uid);
				console_logs('uids', uids);
//            	console_logs('whereValue xpoast_uid>>>>>>>>>>>>>', whereValue);
				}
            } else {
            }
        },
        'listPoviewGrid'//toolbar
	);
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        if(vCompanyReserved4 == 'HSGC01KR') {
            switch(this.link) {
                case 'PPO3_MK':
                    this.store.getProxy().setExtraParam('po_type', "MK");
                    break;
                default:
                    this.store.getProxy().setExtraParam('po_type', "MN");
            }

        }
        this.store.load(function(records){});
    },
	addTablistPoviewGridPanel :function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	console_logs('menuCode>>>>>>>>>>', menuCode);
//		    	 setEditPanelTitle();
		    	 if(success ==true) {
		    		this.callBackWorkList(title, records, arg, fc, id);
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
	
	callBackWorkList: function(title, records, arg, fc, id) {
		var gridId = id== null? this.getGridId() : id;
		console_logs('gridId>>>>>>>>>>', gridId);
	
		var o = gMain.parseGridRecord(records, gridId);		
		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		console_logs('fields>>>>>>>>>>', fields);
		console_logs('columns>>>>>>>>>>', columns);
		var modelClass = arg['model'];
		var pageSize = arg['pageSize'];
		var sorters = arg['sorters'];
		var dockedItems = arg['dockedItems'];
//		var important = o['important'];
		
		var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
		this.listPoViewStore = Ext.create('Rfx.store.ListPoViewStore');
		this.listPoViewStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_UNIQUE_ID);

		/*Ext.each(
				columns,
				function(o, index) {
					o['sortable'] = false;
					switch (o['dataIndex']) {
					case 'po_qty':
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['css'] = 'edit-cell';
						o["renderer"] =function(value, meta) {
							meta.css = 'custom-column';
							return value;
						};
						o['editor'] = {
							id:gu.id(this.link+'price'),
							allowBlank : false,
							xtype : 'numberfield',
							minValue : 0
						};
						break;
					case 'gr_qty':
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['css'] = 'edit-cell';
						o["renderer"] =function(value, meta) {
							meta.css = 'custom-column';
							return value;
						};

						o['editor'] = {
							id:gu.id(this.link+'price'),
							allowBlank : true,
							xtype : 'numberfield',
							minValue : 0
						};
						break;
					case 'po_blocking_qty':
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['css'] = 'edit-cell';
						o["renderer"] =function(value, meta) {
							meta.css = 'custom-column';
							return value;
						};

						o['editor'] = {
							id:gu.id(this.link+'price'),
							allowBlank : false,
							xtype : 'numberfield',
							minValue : 0
						};
						break;
					case 'sales_price':
						o['style'] = 'text-align:right';
						o['css'] = 'edit-cell-important';
						o["renderer"] =function(value, meta) {
							meta.css = 'custom-column-blue';
							return value;
						};

						o['align'] = 'right';
						
						break;
					case 'buying_price':
						o['style'] = 'text-align:right';
						o['css'] = 'edit-cell-important';
						o["renderer"] =function(value, meta) {
							meta.css = 'custom-column-blue';
							return value;
						};

						o['align'] = 'right';
					
						break;

					}*/
//				});
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		this.listPoviewGrid = Ext.create('Ext.grid.Panel', {
        	//id: gridId,
            store: this.listPoViewStore,
            //store: store,
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
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
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
        	    	 
        	    	 gMain.selPanel.downListRecord(record);
        	     }, //endof itemdblclick
        	     cellkeydown:function (listPoviewGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());
 	                }


 	            }
        	},//endof listeners
            columns: columns
        });
		this.listPoviewGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });

	        
	        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
	        
	        tabPanel.add(this.listPoviewGrid);
		},
	
    items : [],
    poviewType: 'ALL'

});


