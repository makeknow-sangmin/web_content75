Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.HEAVY4_ProduceAdjustView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produceadjust-view',
    initComponent: function(){

      	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		switch(vCompanyReserved4){
			case "SWON01KR":
				
				this.addSearchField (
						{
								field_id: 'date_type'
								,store: 'CommonCodeStore'
								,displayField: 'codeName'
								,valueField: 'systemCode'
								,params: {parentCode:'SRCH_DATE_EPC3', hasNull:true}	
								,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
						});	
		    	
		    	this.addSearchField ({
		            type: 'dateRange',
		            field_id: 'listpodate',
		            labelWidth: 0,
		            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
		            edate: new Date()
		    	}); 
				this.addSearchField (
						{
								field_id: 'status'
								,store: 'CommonCodeStore'
								,displayField: 'codeName'
								,valueField: 'systemCode'
									,params: {parentCode:'STATUS_EPC3', hasNull:true}	
								,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
						}
		    	
				);

				this.addSearchField ('item_code');	
				this.addSearchField ('pj_code');	
		    	this.addSearchField (
						{
							type: 'combo'
							,width:175
							,field_id: 'wa_name'
							,store: "BuyerStoreSRO5"
							,displayField: 'wa_name'
							,valueField: 'wa_code'
							,params:{groupBy:'wa_code'}
							,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
						});
//				this.addSearchField (
//						{
//								field_id: 'wa_name'
//								,store: "BuyerCodeStore"
//								,displayField: 'wa_name'
//								,valueField: 'wa_code'
//								,innerTpl	: '<div data-qtip="{wa_name}">{wa_name}</div>'
//						});		
				this.addSearchField ('po_name');	
				
				Ext.each(this.columns, function(columnObj, index) {
					var dataIndex = columnObj["dataIndex"];
					
					switch (dataIndex) {
						case 'po_name':
							columnObj["renderer"] = function(value, meta) {
								if(value != null && value != '' && value.length > 1) {
									try {
										var val = value.split('_')[1];
										return val;
									} catch (error) {
										return value;
									}
									
								} else {
									return value;
								}
							};
							break;
					}
				});

				break;
			default :
		    	this.addSearchField (
						{
								field_id: 'runner_type'
								,store: "RecevedStateStore"
								,displayField: 'codeName'
								,valueField: 'systemCode'
								,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
						});	
				this.addSearchField('specification');
				this.addSearchField ('h_outmaker');	
		}

//		this.addSearchField (
//				{
//						field_id: 'pj_code'
//						,store: "ProjectStore"
//	    			    ,displayField:   'pj_name'
//	    			    ,valueField:   'pj_code'
////	    			    ,valueField:   'unique_id'
////	    			    ,value: vCUR_USER_NAME
//						,innerTpl	: '<div data-qtip="{pj_code}">{pj_name}</div>'
//				});	

		

//		this.addSearchField('wa_code');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
    		modelClass: 'Rfx.model.HEAVY4_ProduceAdjust',
    		pageSize: gMain.pageSize,/*pageSize*/
    		sorters: [{
	        	property: 'lot_no',
	        	direction: 'ASC'
	        }],
	        byReplacer: {
	        	'item_code': 'srcahd.item_code',
	        	'create_date': 'assymap.create_date',
	        	'step': 'step.pcs_code',
	        	'unique_id': 'step.unique_id'
	        },
	        deleteClass: ['pcsstep']
	     
	    }, {
	    	groupField: 'lot_no'
    });
        
//        this.removeAction.setText('작업취소');
	        // remove the items
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==2||index==3||index==4||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'lot_no':
                    columnObj["renderer"] = function(value, meta) {
                        return value;
                    };
                    break;
            }

        });
        
        switch(vCompanyReserved4){
		case "KWLM01KR":
			//grid 생성.
	        this.createGridCore(arr);
	        break;
	    default:
	    	var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		        groupHeaderTpl: '<div><b><font color=#003471>{name}</b></font> :: {[values.rows[0].data.buyer_name]} ({[values.rows[0].data.pj_code]}) (제품 : {rows.length})</div>'
			}); 
	        
			var option = {
					features: [groupingFeature]
			};
	        
	        //grid 생성.
	        this.createGridCore(arr, option);
	        break;
        }

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        
    	this.store.getProxy().setExtraParam('orderBy', 'pj_code');
    	this.store.getProxy().setExtraParam('ascDesc', 'desc');
        this.store.load(function(records){
        	console_logs('ProduceAdjustView records', records);
        });
    }
});
