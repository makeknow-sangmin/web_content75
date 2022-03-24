//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.designPlan.MaterialMgmtView3', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-view3',
    initComponent: function(){
    	this.orderbyAutoTable = false;
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	//this.setDefComboValue('standard_flag', 'valueField', 'R');
    	
    	/*this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	*/
    	
		this.addSearchField('system_code');
		this.addSearchField('code_name_kr');
		this.addSearchField('creator');
//		this.addSearchField('maker_name');
		
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
        
        
        // 분류코드로 품번 HEAD 만들기
		this.addCallback('GET-CLASS-CODE', function(combo,record){
			
			console_logs('GET-CLASS-CODE record>>>>>>>>>>>>>>>', record);
			gMain.selPanel.inputClassCode = record;
			console_logs('gMain.selPanel.inputClassCode>>>>>>>>>>>>>>>', gMain.selPanel.inputClassCode);
			var target_item_code = gMain.selPanel.getInputTarget('item_code');


			if(target_item_code!=null) {
				target_item_code.setValue(gMain.selPanel.inputSpCode.data.system_code + gMain.selPanel.inputClassCode);
			}

			});
		
		this.addCallback('GET-SP-CODE', function(combo, record){
			console_logs('GET-SP-CODE record>>>>>>>>>>>>>>>', record);
				gMain.selPanel.inputSpCode = record;
			console_logs('gMain.selPanel.inputSpCode>>>>>>>>>>>>>>>', gMain.selPanel.inputSpCode);

				var target_item_code = gMain.selPanel.getInputTarget('item_code');
				var sp_code = gMain.selPanel.inputSpCode.get('systemCode');
				console_logs('sp_code>>>>>>>>>>>>>>>', sp_code);
				target_item_code.setValue(sp_code  +  
						target_item_code.getValue().substring(1, target_item_code.getValue().length));

			});
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('MTRL_FLAG_SEW', function(o){
        	console_logs('addCallback_MTRL_FLAG_SEW>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Code', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{

			},
	        ['code']
			);
				
		
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
		});
		
		this.store.getProxy().setExtraParam('parent_system_code', 'MODEL_NO');
       
    // 바코드 출력 버튼
       this.barcodePrintAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 iconCls: 'barcode',
  			 text: '바코드 출력',
  			 tooltip: '바코드를 바코드 프린터로 출력합니다',
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

  	            			Ext.Msg.alert('안내', '자재 출고 완료.', function() {});
  	            			
  	            		},
  	            		failure: extjsUtil.failureMessage
  	            	}); //end of ajax
  		        	
  			    }
  			 }

  		});
       
       //버튼 추가.
	   buttonToolbar.insert(7, '-');
       buttonToolbar.insert(6, '-');
        
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        this.store.load(function(records){});
    },selectedClassCode: '',
    reflashClassCode : function(o){
    	this.selectedClassCode = o;
    	var target_class_code = gMain.selPanel.getInputTarget('class_code');
    	target_class_code.setValue(o);
    	
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

