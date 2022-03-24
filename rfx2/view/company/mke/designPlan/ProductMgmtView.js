//자재 관리
Ext.define('Rfx2.view.company.mke.designPlan.ProductMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-mgmt-mke-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	//this.setDefComboValue('standard_flag', 'valueField', 'A');
    	
    	/*this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	*/
    	
    	this.addSearchField (
    			{
    				field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '{codeName}'
    					});
		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		this.addSearchField('maker_name');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });
        
        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Heavy4ProductMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['srcahd']
	        );
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
       
       this.createPoAction = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	 	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '주문카트 ',
			 tooltip: '주문카트 담기',
			 disabled: true,
			 handler: function() {
				 
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 
				 console_logs('selections', selections);
			    if (selections) {
			    	var uids = [];
		        	for(var i=0; i< selections.length; i++) {
		        		var rec = selections[i];
		        		var unique_id = rec.get('unique_id');
		        		uids.push(unique_id);
		        	}
		        	
		        	
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
	            		params: {
	            			srcahd_uids: uids
	            		},
	            		success : function(result, request){
	            			var resultText = result.responseText;

	            			Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
	            			
	            		},
	            		failure: extjsUtil.failureMessage
	            	}); //end of ajax
		        	
			    }
				 
				 
//				 switch(gMain.selPanel.stockviewType) {
//				 case 'ALL':
//					 alert("자재를 먼저 선택해 주세요");
//					 break;
//				 default:
//					 break;
//				 }
			 }
		});
       
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
       	
        	var rec = selections[0];
        	
            if (selections.length) {
          		gMain.selPanel.createPoAction.enable();
   
           		var copy_uid = gm.me().getInputJust('srcahd|copy_uid');

           		if(copy_uid != null) {
                    copy_uid.setValue(rec.get('id'));
                }
             } else {
            	 gMain.selPanel.createPoAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        
        
        switch(vCompanyReserved4){
       	case "SKNH01KR":
       		console_logs('vCompanyReserved4==SKNH01KR', vCompanyReserved4);
       		this.store.getProxy().setExtraParam('sg_code', 'BOM');
    	   break;
        }
        this.store.load(function(records){});
    },
    selectedClassCode: '',
    reflashClassCode : function(o){
    	this.selectedClassCode = o;
    	var target_class_code = gm.me().getInputJust('srcahd|class_code');
		var target_item_code = gm.me().getInputJust('srcahd|item_code');
		
    	target_class_code.setValue(o);
    	target_item_code.setValue(o);
    	
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

