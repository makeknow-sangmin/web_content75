//피앤엘-검사기준보기 메뉴
Ext.define('Rfx.view.salesDelivery.HEAVY4_TestStandardView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'receved-mgmt-view',
    
  //File첨부 폼
   // attachform: null,
   // Heavy_attachform: null,
    vFILE_ITEM_CODE: null,
    
    inputBuyer : null,
    initComponent: function(){
    	
    	this.setDefValue('regist_date', new Date());
    	var next7 = gUtil.getNextday(7);
    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: gm.getMC('CMD_Order_Date', '등록일자'),
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});	
		this.addSearchField (
				{
					type: 'area'
					,field_id: 'tag_no'
					,emptyText: 'TAG NO'
				});
		this.addSearchField (
		{
			type: 'area'
			,field_id: 'pj_code'
			,emptyText: 'SPOOL NO'
		});

		


		
		//Function Callback 정의
        //redirect
    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
    		if(selectOn==true) {
    			this.propertyPane.setSource(source); // Now load data
    			this.selectedUid = unique_id;
    			gUtil.enable(this.removeAction);
    			gUtil.enable(this.editAction);
    			gUtil.enable(this.copyAction);
    			gUtil.enable(this.viewAction);
    			gUtil.disable(this.registAction);

    			
    		} else {//not selected
            	this.propertyPane.setSource(source);
            	this.selectedUid = '-1';
            	gUtil.disable(this.removeAction);
            	gUtil.disable(this.editAction);
            	gUtil.disable(this.copyAction);
            	gUtil.disable(this.viewAction);
            	gUtil.enable(this.registAction);

            	this.crudTab.collapse();
    		}

    		console_logs('this.crudMode', this.crudMode);
    		this.setActiveCrudPanel(this.crudMode);
    	};
        

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        		REMOVE_BUTTONS : [
        		        	        'REGIST','COPY','REMOVE'
        			]		
        });


	   
	        this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4TestStandardModel',
        		pageSize: 100,/*pageSize*/
		        sorters: [{
		        	property: 'tag_no',
		        	direction: 'asc'
		        }]
		    }, {
		    	groupField: 'tag_no'
        });
        

        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        
        
 
        
//        this.createGrid(arr);
		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 항목)</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
		var option = {
				features: [{
		            //id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
		            hideGroupedHeader: true,
		            /*enableGroupingMenu: false*/
		        }]
					
			};

        //grid 생성.
        this.createGridCore(arr, option);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : []
});

	        

		

