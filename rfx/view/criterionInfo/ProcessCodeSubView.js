Ext.define('Rfx.view.criterionInfo.ProcessCodeSubView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'processCode-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.orderbyAutoTable = true;
    	this.initSearchField();
    	//검색툴바 추가
		//this.addSearchField('parent_code');
		//this.addSearchField('code_name_kr');
    	//검색툴바 생성
    	//진행상태 검색툴바
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'pcstpl', 
			field_id: 'parent_code',       
			fieldName: 'parent_code'
			
		});
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'pcstpl', 
			field_id: 'pcs_level',       
			fieldName: 'pcs_level'
			
		});
		this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'pcstpl', 
			field_id: 'pcs_type',       
			fieldName: 'pcs_type'
			
		});
		this.setDefValue('use_yn','Y');
		
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');
		this.addReadonlyField('creator_uid');

	

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar =  this.createSearchToolbar();
      
        //console_logs('this.fields', this.fields);

        this.setGridOnCallback(function(selections) {
        	
        	this.copyCallback();
        	
        	var processGrid = Ext.getCmp('ProcessCodeSubGrid');
        	//var mainmenu = Ext.getCmp( 'PcsStdTempleteView' + '-mainmenu' );
        	


            if (selections.length) {
				var rec = selections[0];
				console_logs('=====a', rec.get('pcs_code'));
                //gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid'); //assymap의 child
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id'); //pcstpl의 unique_id
            	gMain.selPanel.vSELECTED_PARENT_CODE = rec.get('pcs_code'); //pcstple의 모자재코드
            	gMain.selPanel.vSELECTED_PCS_LEVEL = rec.get('pcs_level')+1;
//    			var status = rec.get('status');
//    			var parent_code = rec.get('pcs_code');
//    			var pcs_level = rec.get('pcs_level')+1;
    			//mainmenu.disable();
                
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
            	//mainmenu.enable();
            }
            processGrid.getStore().getProxy().setExtraParam('parent_code', gMain.selPanel.vSELECTED_PARENT_CODE);
        	processGrid.getStore().getProxy().setExtraParam('pcs_level', gMain.selPanel.vSELECTED_PCS_LEVEL);
        	processGrid.getStore().load();
        });
        
        this.createStore('Rfx.model.ProcessCodeSub', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        	        ,{
	        	
	        }

	        , ['pcstpl']
	        );
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
		arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

		var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '공정저장',
			 tooltip: '공정설계 내용 저장',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.savePcsstdHandler
			});
		
			switch(vCompanyReserved4) {
				case 'KWLM01KR':
				break;
			default:
		//공정설계 gridPcsTpl Tab 추가.
				gMain.addTabGridPanel('공정설계', 'AMC6_SUB', {  
					pageSize: 100,
					model: 'Rfx.model.ProcessCodeSub2',
					dockedItems: [
						
						{
							dock: 'top',
							xtype: 'toolbar',
							cls: 'my-x-toolbar-default4',
							items: [

								]
					},{
							dock: 'top',
							xtype: 'toolbar',
							cls: 'my-x-toolbar-default3',
							items: [
									'-',
									savePcsStep
									,
	//			                    addPcsStep,
	//			                    '-',

								// '->',
								// calcNumber,
								
								]
							}
						],
						sorters: [{
						property: 'serial_no',
						direction: 'ASC'
					}]
				}, function(selections) {
					if (selections.length) {
						var rec = selections[0];
						//console_logs(rec);
						gMain.selPanel.selectPcsRecord = rec;
					} else {
						
					}
				},
				'ProcessCodeSubGrid'//toolbar
			);

		}
        this.callParent(arguments);

//        this.store.getProxy().setExtraParam('pcs_level', 0);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],
    savePcsstdHandler: function() {
		var gridPcsTpl = Ext.getCmp('ProcessCodeSubGrid');
		var modifiend =[];

		var items = gridPcsTpl.store.data.items;
		for(var i=0; i<items.length; i++) {
			var rec = items[i];
			console_logs('======rec', rec);

			var unique_id = rec.get('unique_id'); // pcstpl_uid
			var pcs_code = rec.get('pcs_code'); // 공정코드
			var pcs_type = rec.get('pcs_type'); // 템플릿 유형
			var is_replace = rec.get('is_replace'); //is_replace
			var pcs_name = rec.get('pcs_name'); // 공정명
			var std_mh = rec.get('std_mh'); // 표준 시간
			var plan_qty = rec.get('plan_qty'); // 기본수량
			var process_price = rec.get('process_price'); // 표준단가
			var price_type = rec.get('price_type'); // 단가유형
			var sub_qty = rec.get('sub_qty'); // 서브공정 개수
			var prev_stock_reduce = rec.get('prev_stock_reduce'); // 전공정 재고 삭감여부
			var description = rec.get('description'); // 설명
			var comment = rec.get('comment'); // 설명2
			var pcs_level = rec.get('pcs_level') // pcs_level
			var parent_code = rec.get('parent_code') // parent_code
			var owner_uid = rec.get('owner_uid') // owner_uid
			var uid_comast = rec.get('uid_comast') // uid_comast
			var serial_no = rec.get('serial_no'); // serial_no

			if(plan_qty==0) {
				plan_qty = 1;
			}

			if(pcs_code != null || pcs_code != undefined || pcs_code != '') {
					var obj = {};

					obj['unique_id'] = unique_id;
					obj['pcs_code'] = pcs_code;
					obj['pcs_type'] = pcs_type;
					obj['is_replace'] = is_replace;

					obj['pcs_name'] = pcs_name;
					obj['std_mh'] = std_mh;
					obj['plan_qty'] = plan_qty;
					obj['process_price'] = process_price;

					obj['price_type'] = price_type;
					obj['sub_qty'] = sub_qty;
					obj['prev_stock_reduce'] = prev_stock_reduce;

					obj['description'] = description;
					obj['comment'] = comment;
					obj['serial_no'] = serial_no;

					obj['uid_comast'] = uid_comast;
					obj['owner_uid'] = owner_uid;
					obj['parent_code'] = parent_code;

					obj['pcs_level'] = pcs_level;
					
					modifiend.push(obj);
			}
		}

			console_logs('=====z', modifiend);

			if(modifiend.length>0) {
	    		
	    		  console_log(modifiend);
	    		  var str =  Ext.encode(modifiend);
	    		  console_log(str);
	    		  console_log('modify>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/production/pcstpl.do?method=modifyTplList',
	    				params:{
	    					modifiend:str
	    				},
	    				success : function(result, request) {   
	    					gridPcsTpl.store.load(function() {
	    						//alert('come');
	    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
	    						
	    					});
	    				}
	    		    });
	    	  }
	    	
	    	
	    	  //var tomCheck = false;
	    	//   for (var i = 0; i <gridPcsTpl.store.data.items.length; i++)
	    	//   {
			// 	  	console_logs('222gridPcsTpl', gridPcsTpl);
	    	//         var record = gridPcsTpl.store.data.items[i];
	        //    		var pcs_no =  record.get('pcs_no');
	        //    		var pcs_code = record.get('pcs_code');
	        //    		var serial_no = Number(pcs_no) / 10;
	        //    		var plan_qty = record.get('plan_qty');
	           		
	    	//         if (record.dirty) {
	    	//          	gridPcsTpl.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	//            	console_logs(record);
	    	//            	var pcs_code = record.get('pcs_code').toUpperCase();
	    	//            	var pcs_name = record.get('pcs_name');
	    	//            	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	//            		var plan_date = record.get('plan_date');
	    	//            		var yyyymmdd ='';
	    	//            		if(plan_date!=null) {
	    	//            			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
	    	//            		}

	    	//            		if(plan_qty==0) {
	    	//            			plan_qty = 1;
	    	//            		}
	    	           		
	    	// 	           	var obj = {};
	    	// 	           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    	// 	           	obj['serial_no'] = serial_no;
	    	// 	           	obj['pcs_code'] = record.get('pcs_code');
	    	// 	           	obj['pcs_name'] = record.get('pcs_name');

	    	// 	           	obj['description'] = record.get('description');
	    	// 	           	obj['comment'] = record.get('comment');
	    	// 	           	obj['machine_uid'] = record.get('machine_uid');
	    	// 	           	obj['seller_uid'] = record.get('seller_uid');

	    	// 	           	obj['std_mh'] = record.get('std_mh');
	    	// 	           	obj['plan_date'] = yyyymmdd;
	    	// 	           	obj['plan_qty'] = plan_qty;
	    		           	
	    	// 	           	modifiend.push(obj);
	    	//            	} else {
	    	// 	           	var obj = {};
	    	// 	           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    	// 	           	obj['serial_no'] = serial_no;
	    		           	
	    	// 	           	obj['pcs_code'] = '';
	    	// 	           	obj['pcs_name'] = '';

	    	// 	           	obj['description'] = '';
	    	// 	           	obj['comment'] = '';
	    	// 	           	obj['machine_uid'] = '-1';
	    	// 	           	obj['seller_uid'] = '-1';

	    	// 	           	obj['std_mh'] = '0';
	    	// 	           	obj['plan_date'] = '';
	    	// 	           	obj['plan_qty'] = '0';
	    	// 	           	modifiend.push(obj);
	    	//            	}

	    	//         }
	    	//         prevQty = plan_qty;
	    	//   }
	 }
});
