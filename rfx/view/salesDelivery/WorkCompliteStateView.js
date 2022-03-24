//수주관리 메뉴
Ext.define('Rfx.view.salesDelivery.WorkCompliteStateView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'workcomplitestate-View',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField (
				{
						field_id: 'sales_user'
						,store: "SalesUserStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
		this.addSearchField('item_code');
		
		this.addSearchField('wa_name');

		this.addSearchField (
				{
						field_id: 'alter_item_code'
						,store: "RecevedStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
		this.addSearchField('wa_code');
		this.addSearchField('수주건수');

		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.RecevedMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        
        var dateToolbar = Ext.create('Ext.toolbar.Toolbar', {
    		cls: 'my-x-toolbar-default1',
        	items: [
	        	        //searchAction, '-',
					 '-','-',{
		      					
	      					    xtype:'label',
								width:88,
	      					    text: "등록기간 : ",
	      					    style: 'color:white;'
		      					 
					        },
	      					{ 
	      		                name: 's_date',
	      		                format: 'Y-m-d',
	      		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
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
	      					    style: 'color:white;'
	      					    
	      					 },
	      					{ 
	      		                name: 'e_date',
	      		                format: 'Y-m-d',
	      		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	      					    	allowBlank: true,
	      					    	xtype: 'datefield',
	      					    	value: new Date(),
	      					    	width: 99,
	      						handler: function(){
	      						}
	      					},
        	        ]
        });
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(dateToolbar);
        arr.push(searchToolbar);
        //grid 생성.
      // this.createGrid(searchToolbar, dateToolbar,buttonToolbar);
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        //공정설계 grid Tab 추가.
		gMain.addTabGridPanel('공정설계', 'EPC1', {  
				pageSize: 100,
				model: 'Rfx.model.PcsStd',
				sorters: [{
		           property: 'serial_no',
		           direction: 'ASC'
		       }]
			}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	console_logs(rec);
	            } else {
	            	
	            }
	        });

        this.callParent(arguments);
        
        //EditPane size 늘림.
		this.crudEditSize = 700;
		
        //디폴트 로딩
		gMain.setCenterLoading(false);
        this.store.load(function() {

            var processGrid = Ext.getCmp(gMain.getGridId());
        	processGrid.getStore().getProxy().setExtraParam('srcahd_uid', 1);
        	processGrid.getStore().load();

        });


    },
    items : []
});
