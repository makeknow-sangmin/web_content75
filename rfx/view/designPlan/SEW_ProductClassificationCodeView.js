Ext.define('Rfx.view.designPlan.SEW_ProductClassificationCodeView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'product-classification-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.ProductClassificationCodeView'}],
    initComponent: function(){
    	
    	//this.initDefValue();
		
		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('identification_code','valueField', 'PD');
		this.addSearchField (
				{
					//type: 'combo',
					field_id: 'level1'
					,store: 'CommonCodeStore' 
					,displayField: 'codeName'
					,valueField: 'code_name_en'
					,params:{parentCode: 'CLAAST_LEVEL_PRD'}
		    		,innerTpl	: '{codeName}'	
				});
		this.addSearchField('class_code');
		this.addSearchField('class_name');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        this.addFormWidget('입력항목', {
	     	   tabTitle:"입력항목", 
	     	   	id:	'AMC4_SEW2_SEW_LV1',
	            xtype: 'combo',
	            text: '대구분',
	            name: 'level1',
	            storeClass: 'ClaastStorePD',
	            params:{level1: 1, identification_code: "PD"},
	            displayField: "class_name",
	            valueField: "class_code", 
	            innerTpl: "<div>[{class_code}] {class_name}</div>", 
	            listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	var claastlevel2 = Ext.getCmp('AMC4_SEW2_SEW_LV2');
		                 	var claastlevel3 = Ext.getCmp('AMC4_SEW2_SEW_LV3');
		                 	var claastlevel4 = Ext.getCmp('AMC4_SEW2_SEW_LV4');
		                 	
		                 	claastlevel2.clearValue();
		                 	claastlevel2.store.removeAll();
		                 	claastlevel3.clearValue();
		                 	claastlevel3.store.removeAll();
		                 	claastlevel4.clearValue();
		                 	claastlevel4.store.removeAll();
		                 	
		                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
		                 	claastlevel2.store.load();
		                 	gMain.selPanel.reflashClassCode(class_code);
	
			           }
		        },
	            canCreate:   true,
	            canEdit:     true,
	            canView:     true,
	            position: 'center',
	            setNumber:1, 
	            setName:"분류코드", 
	            setCols:2
	        }); 
	        
	        this.addFormWidget('입력항목', {
	      	   tabTitle:"입력항목", 
	      	   	id:	'AMC4_SEW2_SEW_LV2',
	             xtype: 'combo',
	             text: '품명구분',
	             name: 'level2',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 2, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>", 
	             listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	var claastlevel3 = Ext.getCmp('AMC4_SEW2_SEW_LV3');
		                 	var claastlevel4 = Ext.getCmp('AMC4_SEW2_SEW_LV4');
		                 	
		                 	claastlevel3.clearValue();
		                 	claastlevel3.store.removeAll();
		                 	claastlevel4.clearValue();
		                 	claastlevel4.store.removeAll();
		                 	
		                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
		                 	claastlevel3.store.load();
		                 	
		                 	gMain.selPanel.reflashClassCode(class_code);
		                 	
		                 	var class_name = record.get('class_name');
		                 	var target_item_name = gMain.selPanel.getInputTarget('item_name');
		                	target_item_name.setValue(class_name);
	
			           }
		        },
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center',
	             setNumber:1, 
	             setName:"분류코드", 
	             setCols:2
	            	 
	         });        
	        this.addFormWidget('입력항목', {
	      	   tabTitle:"입력항목", 
	      	   	id:	'AMC4_SEW2_SEW_LV3',
	             xtype: 'combo',
	             text: 'TYPE구분',
	             name: 'level3',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 3, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>",
	             listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	var claastlevel4 = Ext.getCmp('AMC4_SEW2_SEW_LV4');
		                 	
		                 	claastlevel4.clearValue();
		                 	claastlevel4.store.removeAll();
		                 	
		                 	claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
		                 	claastlevel4.store.load();
		                 	
		                 	gMain.selPanel.reflashClassCode(class_code);
		                 	
		                 	var class_name = record.get('class_name');
		                 	var target_specification = gMain.selPanel.getInputTarget('description');
		                	target_specification.setValue(class_name);
	
			           }
		        },
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center',
	             setNumber:1, 
	             setName:"분류코드", 
	             setCols:2
	         });        
	        this.addFormWidget('입력항목', {
	      	   tabTitle:"입력항목",
	      	   	id:	'AMC4_SEW2_SEW_LV4',
	             xtype: 'combo',
	             text: '사양구분',
	             name: 'level4',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 4, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>", 
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center',
	             setNumber:1, 
	             setName:"분류코드", 
	             setCols:2,
	             listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	
		                 	gMain.selPanel.reflashClassCode(class_code);
		                 	
		                 	var class_name = record.get('class_name');
		                 	var target_specification = gMain.selPanel.getInputTarget('specification');
		                 	target_specification.setValue(class_name);
	
			           }
		        }
	         });        
	       this.addCallback('CHECK_CODE', function(o){
	        	var target = gMain.selPanel.getInputTarget('class_code');
	        	console_logs('====target', target);
	        	var code = target.getValue();
	        	var uppercode = code.toUpperCase();
	        	//if(code == null || code == ""){
	        	if(code.length < 1){
	        		Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function() {});
	        	}else {
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/admin/stdClass.do?method=checkCode',
	            		params: {
	            			code: code,
	            			identification_code : 'PD'
	            		},
	            		success : function(result, request){
	            			var resultText = result.responseText;
	            			
	            			if(resultText=='0') {
	            				Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
	            				target.setValue(uppercode);
	        				}else {
	        					Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
	        					target.setValue('');
	        				}
	            		},
	            		failure: extjsUtil.failureMessage
	            	}); //end of ajax
	       	}
	        	
	        	
	        });  // end of addCallback
	       
//        this.addFormWidget('입력항목', {
//      	   tabTitle:"입력항목", 
//      	   	id:	'AMC4_SEW_LV1',
//             xtype: 'combo',
//             text: '대구분코드',
//             name: 'level1',
//             storeClass: 'ClaastStorePD',
//             params:{level1: 1, identification_code: "PD"},
//             displayField: "class_name",
//             valueField: "class_code", 
//             innerTpl: "<div>[{class_code}] {class_name}</div>", 
//             setNumber:1, 
//             setName:"분류코드", 
//             setCols:2,
//             listeners: {
// 		           select: function (combo, record) {
// 	                 	console_log('Selected Value : ' + combo.getValue());
// 	                 	console_logs('record : ', record);
// 	                 	var class_code = record.get('class_code');
// 	                 	var claastlevel2 = Ext.getCmp('AMC4_SEW_LV2');
// 	                 	var claastlevel3 = Ext.getCmp('AMC4_SEW_LV3');
// 	                 	var claastlevel4 = Ext.getCmp('AMC4_SEW_LV4');
// 	                 	
// 	                 	claastlevel2.clearValue();
// 	                 	claastlevel2.store.removeAll();
// 	                 	claastlevel3.clearValue();
// 	                 	claastlevel3.store.removeAll();
// 	                 	claastlevel4.clearValue();
// 	                 	claastlevel4.store.removeAll();
// 	                 	
// 	                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
// 	                 	claastlevel2.store.load();
// 	                 	gMain.selPanel.reflashClassCode(class_code);
//
// 		           }
// 	        },
//             canCreate:   true,
//             canEdit:     true,
//             canView:     true,
//             position: 'center'
//         }); 
//         
//         this.addFormWidget('입력항목', {
//       	   tabTitle:"입력항목", 
//       	   	id:	'AMC4_SEW_LV2',
//              xtype: 'combo',
//              text: '품명구분코드',
//              name: 'level2',
//              storeClass: 'ClaastStorePD',
//              params:{level1: 2, identification_code: "PD"},
//              displayField: "class_name",
//              valueField: "class_code", 
//              innerTpl: "<div>[{class_code}] {class_name}</div>", 
//              setNumber:1, 
//              setName:"분류코드", 
//              setCols:2,
//              listeners: {
// 		           select: function (combo, record) {
// 	                 	console_log('Selected Value : ' + combo.getValue());
// 	                 	console_logs('record : ', record);
// 	                 	var class_code = record.get('class_code');
// 	                 	var claastlevel3 = Ext.getCmp('AMC4_SEW_LV3');
// 	                 	var claastlevel4 = Ext.getCmp('AMC4_SEW_LV4');
// 	                 	
// 	                 	claastlevel3.clearValue();
// 	                 	claastlevel3.store.removeAll();
// 	                 	claastlevel4.clearValue();
// 	                 	claastlevel4.store.removeAll();
// 	                 	
// 	                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
// 	                 	claastlevel3.store.load();
// 	                 	
// 	                 	gMain.selPanel.reflashClassCode(class_code);
//
// 		           }
// 	        },
//              canCreate:   true,
//              canEdit:     true,
//              canView:     true,
//              position: 'center'
//             	 
//          });        
//         this.addFormWidget('입력항목', {
//       	   tabTitle:"입력항목", 
//       	   	id:	'AMC4_SEW_LV3',
//              xtype: 'combo',
//              text: 'TYPE구분코드',
//              name: 'level3',
//              storeClass: 'ClaastStorePD',
//              params:{level1: 3, identification_code: "PD"},
//              displayField: "class_name",
//              valueField: "class_code", 
//              innerTpl: "<div>[{class_code}] {class_name}</div>",
//              setNumber:1, 
//              setName:"분류코드", 
//              setCols:2,
//              listeners: {
// 		           select: function (combo, record) {
// 	                 	console_log('Selected Value : ' + combo.getValue());
// 	                 	console_logs('record : ', record);
// 	                 	var class_code = record.get('class_code');
// 	                 	var claastlevel4 = Ext.getCmp('AMC4_SEW_LV4');
// 	                 	
// 	                 	claastlevel4.clearValue();
// 	                 	claastlevel4.store.removeAll();
// 	                 	
// 	                 	claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
// 	                 	claastlevel4.store.load();
// 	                 	
// 	                 	gMain.selPanel.reflashClassCode(class_code);
//
// 		           }
// 	        },
//              canCreate:   true,
//              canEdit:     true,
//              canView:     true,
//              position: 'center'
//          });        
//         this.addFormWidget('입력항목', {
//       	   tabTitle:"입력항목",
//       	   	id:	'AMC4_SEW_LV4',
//              xtype: 'combo',
//              text: '사양구분코드',
//              name: 'level4',
//              storeClass: 'ClaastStorePD',
//              params:{level1: 4, identification_code: "PD"},
//              displayField: "class_name",
//              valueField: "class_code", 
//              innerTpl: "<div>[{class_code}] {class_name}</div>", 
//              canCreate:   true,
//              canEdit:     true,
//              canView:     true,
//              position: 'center',
//              setNumber:1, 
//              setName:"분류코드", 
//              setCols:2,
//              listeners: {
// 		           select: function (combo, record) {
// 	                 	console_log('Selected Value : ' + combo.getValue());
// 	                 	console_logs('record : ', record);
// 	                 	var class_code = record.get('class_code');
// 	                 	
// 	                 	gMain.selPanel.reflashClassCode(class_code);
//
// 		           }
// 	        }
//          });        
        
        //모델 정의
        this.createStore('Rfx.model.SEW_ProductClassificationCode', [{
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
        this.store.getProxy().setExtraParam('identification_code',  'PD');
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
