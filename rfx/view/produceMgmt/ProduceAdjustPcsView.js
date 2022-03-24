Ext.define('Rfx.view.produceMgmt.ProduceAdjustPcsView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produceadjustpcs-view',
    initComponent: function(){

      	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField ('pj_code');	
		this.addSearchField('buyer_name');
		this.addSearchField('item_name');
		this.addSearchField (
		{
				field_id: 'pcs_name'
				,store: "CommonCodeStore"
				,displayField: 'codeName'
				,valueField: 'systemCode'
				,params: {parentCode:'STD_PROCESS_NAME', hasNull:true}	
				,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
        		modelClass: 'Rfx.model.ProduceAdjustPcs',
		        pageSize: gMain.pageSize,/*pageSize*/
		        sorters: [{
		        	property: 'pcs_name',
		        	direction: 'asc'
		        }],
		        byReplacer: {
		        	'item_code': 'srcahd.item_code',
		        	'step': 'step.pcs_code'
		        },
		        deleteClass: ['pcsstep']
			        
		    }, {
		    	groupField: 'pcs_name'
        });
      // remove the items
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==2||index==5||index==3||index==4) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        
        
		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        	groupHeaderTpl: '<div><font color=#003471>{name} ::  {[values.rows[0].data.item_name]} {[values.rows[0].data.specification]}  </font> ({rows.length} 건)</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
        
        //grid 생성.
        this.createGridCore(arr, option);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        this.callParent(arguments);
        
    	this.store.getProxy().setExtraParam('orderBy', "pcs_code");
    	this.store.getProxy().setExtraParam('ascDesc', "ASC");  
        //디폴트 로드
    	gMain.setCenterLoading(false);
        this.store.load(function(records){
        	console_logs('ProduceAdjustView1 records', records);
        });
    }
});
