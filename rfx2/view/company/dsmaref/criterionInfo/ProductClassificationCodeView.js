Ext.define('Rfx2.view.company.dsmaref.designPlan.ProductClassificationCodeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-classification-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.ProductClassificationCodeView'}],
    initComponent: function(){
    	
    	//this.initDefValue();
		
		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('identification_code','valueField', 'PRD_CLS_CODE');
//		this.addSearchField (
//				{
//					//type: 'combo',
//					field_id: 'level1'
//					,store: 'CommonCodeStore' 
//					,displayField: 'codeName'
//					,valueField: 'code_name_en'
//					,params:{parentCode: 'CLAAST_LEVEL_PRD'}
//		    		,innerTpl	: '{codeName}'	
//				});
        this.addSearchField('class_type');
		this.addSearchField('level1');
		this.addSearchField('class_code');
		this.addSearchField('class_name');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
	       this.addCallback('CHECK_CODE', function(o){
                var class_type = gMain.selPanel.getInputJust('claast|class_type').getValue();
	        	var target = gMain.selPanel.getInputJust('claast|class_code');
                var level1 = gMain.selPanel.getInputJust('claast|level1').getValue();
	        	console_logs('====target', target);
	        	var code = target.getValue();
	        	var uppercode = code.toUpperCase();
	        	//if(code == null || code == ""){
	        	if(code.length < 1){
	        		Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function() {});
	        	} else if(class_type.length < 1) {
                    Ext.Msg.alert('안내', '제품군구분을 입력해주세요', function() {});
                } else if(class_type.length < 1) {
                    Ext.Msg.alert('안내', '분류단계를 입력해주세요', function() {});
                } else {
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaast',
	            		params: {
	            			class_code_just: code,
	            			identification_code : 'PRD_CLS_CODE',
                            level1 : level1,
                            class_type: class_type
	            		},
	            		success : function(result, request){
	            			var resultJson = Ext.JSON.decode(result.responseText);

                            if(resultJson.count == 0) {
	            				Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
	            				target.setValue(uppercode);
	        				} else {
	        					Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
	        					target.setValue('');
	        				}
	            		},
	            		failure: extjsUtil.failureMessage
	            	}); //end of ajax
	       	}
	        	
	        	
	        });  // end of addCallback
        
        //모델 정의
        this.createStore('Rfx.model.ProductClassificationCode', [{
            property: 'level1',
            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['claast']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

      //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('identification_code',  'PRD_CLS_CODE');
        this.store.getProxy().setExtraParam('orderBy', 'level1');
        this.store.getProxy().setExtraParam('ascDesc', 'ASC');
        this.store.load(function(records){});
    },
    selectedClassCode: '',
    reflashClassCode : function(o){
    	this.selectedClassCode = o;
    	var target_class_code = gMain.selPanel.getInputTarget('class_code');
    	target_class_code.setValue(o);
    	var target_parent_class_code = gMain.selPanel.getInputTarget('parent_class_code');
    	target_parent_class_code.setValue(o);
    	
    },
    items : []
});
