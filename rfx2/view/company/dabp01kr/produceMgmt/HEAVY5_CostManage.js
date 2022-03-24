/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.HEAVY5_CostManage', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'costmanage-view',
    initComponent: function(){
    	
		//this.initDefValue();
		
		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
            switch (dataIndex) {
				case 'last_sales_price':
				case 'srcahd_item_name':
				case 'srcahd_quan':
				case 'srcahd_specification':
                    columnObj["width"] = 0;
                    break;
            }

        });
		
    	//생성시 디폴트 값.
		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
		this.setDefValue('board_count', 0); //Hidden Value임.
		switch(vSYSTEM_TYPE) {
		case 'MES':
			this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.
			break;
		case 'PLACE':
			this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
		}


		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('item_name');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		this.createStore('Rfx.model.ProductStock', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/* pageSize */
	        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	// Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_id'
	        }
        	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['product']
			);


			searchToolbar.insert(0,{
            xtype: 'combo'
            ,anchor: '100%'
            ,width:175
            ,field_id: 'wa_code'
            ,store: this.BuyerStore
            ,displayField: 'wa_name'
            ,valueField: 'wa_code'
            ,emptyText: '고객사'
            ,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
            ,minChars: 1
            ,typeAhead:true
            ,queryMode: 'remote'
            ,fieldStyle: 'background-color: #FBF8E6'
            ,listeners: {
                select: function(combo, record) {
                    var selected = combo.getValue();
                    gm.me().store.getProxy().setExtraParam('wa_code', selected);
                    // this.store.removeAll();
                    // this.store.reload();
                }
            }
		})

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        // this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter()]
        });


		this.callParent(arguments);
		
		this.store.load();
        
        //디폴트 로드
        gMain.setCenterLoading(false);
       
	},
	
	createWest: function() {

		this.grid.setTitle('제품목록');
		this.west = Ext.widget('tabpanel', {
			layout:'border',
			border: true,
			region: 'west',
			width: '45%',
			layoutConfig: {columns: 2, rows:1},

			items: [this.grid]
		});

		this.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				console_logs('==sm', sm);
				console_logs('==selectrions', selections);
				gm.me().productItemStore.getProxy().setExtraParam('pj_uid', selections[0].get('project_uid'));
				gm.me().productItemStore.getProxy().setExtraParam('product_uid', selections[0].get('product_uid'));
				gm.me().productItemStore.getProxy().setExtraParam('wa_code', selections[0].get('wa_code'));
				gm.me().productItemStore.load();
			}
		});

		return this.west;
	},

	createCenter: function() {

		var itemColumn = [];

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
            switch (dataIndex) {
                case 'last_sales_price':
				case 'quan':
					columnObj["width"] = 90;
					itemColumn.push(columnObj);
					break;
				case 'srcahd_item_name':
				case 'srcahd_item_code':
				case 'srcahd_specification':
					columnObj["width"] = 200;
					itemColumn.push(columnObj);
                    break;
			}
        });

		this.itemGrid = 
			Ext.create('Ext.grid.Panel', {
	    	 //id: gm.me().link + 'DBM7-Assembly',
//			 id: 'PPO1_TURN_PREQ',
	    	 title: '자재목록',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
			 store: this.productItemStore,
			 columns: itemColumn,
			 autoScroll:true,
			 cls : 'rfx-panel',
	         //layout          :'fit',
	         //forceFit: true,
	         multiSelect: true,
			 selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: null,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	//		                        //--- Get Proxy ------//
	//		                        var myProxy = this.store.getProxy();                        
	//		                 //--- Define Your Parameter for send to server ----//
	//		                        myProxy.params = {
	//		                            MENU_NAME: '',
	//		                            MENU_DETAIL: ''
	//		                        };
	//		                  //--- Set value to your parameter  ----//
	//		                        myProxy.setExtraParam('MENU_NAME', '222222');
	//		                        myProxy.setExtraParam('MENU_DETAIL', '555555');
	                    }
	                }
		         
		        }),
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						// this.purListSrch//, 
					        //this.removeAssyAction, 
					        //'->', 
					        //this.expandAllTreeAction 
					        ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default1',
					items: [{
					    xtype:'label',
					    width:40,
					    text: '기간',
					    style: 'color:white;'
						 
			    	},{
						  id: gu.id('s_date_arv'),
			              name: 's_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						    	width: 98

			        },{
					    xtype:'label',
					    text: "~",
					    style: 'color:white;'
			        },{
						  id: gu.id('e_date_arv'),
			              name: 'e_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: new Date(),
						    	width: 98

			        }
			    	]
				}
	    	] //dockedItems of End
			
		
		});//supplierGrid of End

		this.itemGrid.setTitle('자재목록');
		this.center = Ext.widget('tabpanel', {
			layout:'border',
			border: true,
			region: 'center',
			width: '55%',
			items: [this.itemGrid]
		});

		return this.center;
	},

    items : [],
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    	//console_logs('boardview itemdblclick record', record);
    	  	
    	Rfx.model.Board.load(record.get('unique_id'), {
    	    success: function(board) {
            	console_logs('board', board);
    	    	var form = gm.me().createViewForm(board);
    	    	var win = Ext.create('ModalWindow', {
    	            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
    	            width: 700,
    	            height: 530,
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
    	
    	
    },
    createViewForm: function (board) {
    	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
    	console_logs('board', board);
//    	var lineGap = 30;
     	var unique_id = board.get('unique_id');
    	var user_id = board.get('user_id');
    	var board_email = board.get('board_email'  );
    	var board_title = board.get('board_title' );
    	var board_content = board.get('board_content' );
    	var htmlFileNames = board.get('htmlFileNames' );
    	var fileQty = board.get('fileQty' );
    	var form = Ext.create('Ext.form.Panel', {
            defaultType: 'displayfield',
            bodyPadding: 3,
            height: 650,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [{
	    			fieldLabel: '등록자',
	    			value: user_id + '(' + board_email + ')'
    		    },{
    		    	fieldLabel: gm.getColName('board_title'),
    		    	value: board_title,
    		    	name: 'board_title'
    		    },{
    		    	fieldLabel: '첨부파일',
    		    	value: htmlFileNames
    		    },{
                    value: board_content,
                    xtype:          'textarea',
                    fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                    height: 340,
                    readOnly: true,
                    anchor: '100%'
                }  
    		    ]
        }); //endof form
    	
    	return form;
	},
	
	BuyerStore : Ext.create('Mplm.store.BuyerStore',{}),

	productItemStore: Ext.create('Mplm.store.ProductItemStore', {}),
});
