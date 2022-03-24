//수주관리 메뉴
Ext.define('Rfx.view.designPlan.SendDocuView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'send-docu-view',
    inputBuyer : null,
    initComponent: function(){
    	
    	this.setDefValue('regist_date', new Date());
    	
    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');//세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');//목형유형
    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');//목형유형
    	
    	//this.setDefValue('pj_code', 'test');
    	
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
			type: 'combo'
			,field_id: 'status'
			,store: "RecevedStateStore"
			,displayField: 'codeName'
			,valueField: 'systemCode'
			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});	
    	
//		this.addSearchField ({
//				type: 'combo'
//				,field_id: 'pm_name'
//				,store: "UserStore"
//			    ,displayField:   'user_name'
//			    ,valueField:   'user_name'
//			    ,value: vCUR_USER_NAME
//				,innerTpl	: '<div data-qtip="{dept_name}">{user_name} [{dept_name}]</div>'
//		});	
		
//		this.addSearchField('pm_name');
		this.addSearchField('wa_name');
		this.addSearchField('item_name');
		this.addSearchField('pj_code');
		
		
		

//
//		this.addSearchField('wa_code');
//		this.addSearchField('수주건수');

		
		//Function Callback 정의
		//재고수량 확인
		this.addCallback('CHECK_STOCK', function(o){
			
			//console_logs('CHECK_STOCK o', o);
			
			var target = gMain.selPanel.getInputTarget('stock_qty_useful');
			var target1 = gMain.selPanel.getInputTarget('item_code');
			
			if(target==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'stock_qty_useful'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			if(target1==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'item_code'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			
			var item_code = target1.getValue();
			if(item_code==null || item_code=='') {
				Ext.Msg.alert('안내', '먼저 품번을 입력하세요.'
						, function() {});
				return;
			}
			
			
			
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/sps1.do?method=getUsefulQtyBycode',
				params:{
					item_code: item_code
				},
				
				success : function(result, request) {   	
					var oStr = result.responseText;
					
					var o = Ext.decode(oStr);
                    
                    var stock_qty_useful = 0;
                    var item_name = '';
                    var specification = '';
                    if(o!=null) {
                    	console_logs('/sales/sps1.do o', o);
                        stock_qty_useful = o['stock_qty_useful'];// ==> o.getStock_qty_useful(); o.get('stock_qty_useful');
                        item_name = o['item_name'];
                        specification = o['specification'];
                        
                        //console_logs('item_name', item_name);
                        //console_logs('specification', specification);	
                    }
                    
					gMain.setCrPaneToolbarMsg('사용가능한 재고수량은 ' + stock_qty_useful + '입니다.');
//					console_logs('stockUseful', stockUseful);
//					Ext.Msg.alert('재고수량', '재고수량은 ' + stockUseful + '입니다.'
//							, function() {});
					
					gMain.selPanel.getInputTarget('item_name').setValue(item_name);
					gMain.selPanel.getInputTarget('specification').setValue(specification);
					
					target.setValue(stock_qty_useful);

					var target_quan = gMain.selPanel.getInputTarget('quan');
					var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
					
					var val = target_quan.getValue() - stock_qty_useful;
					if(val<0) {
						val = 0;
					}
					target_bmquan.setValue(val);
					

					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
			

		});
		//재고수량 리셋
		this.addCallback('RESET_STOCK', function(o){
			//console_logs('RESET_STOCK o', o);
			
			var target_useful = gMain.selPanel.getInputTarget('stock_qty_useful');
			target_useful.setValue(0);
		});
		
		//수주번호 자동생성
		this.addCallback('AUTO_PJCODE', function(o){
			
			//console_logs('AUTO_PJCODE o', o);
			
			var target = gMain.selPanel.getInputTarget('pj_code');
			var target1 = gMain.selPanel.getInputTarget('class_code');
			
			if(target==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'pj_code'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			if(target1==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'class_code'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			
			if(gMain.selPanel.inputBuyer==null) {
				Ext.Msg.alert('안내', '먼저 고객사를 선택하세요.'
						, function() {});
				return;
			}
			
			if(gMain.selPanel.inputClassCode==null) {
				Ext.Msg.alert('안내', '먼저제품구분을선택하세요.'
						, function() {});
				return;
			}
			
			
			var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
			if(target!=null && wa_code!=null && wa_code.length>2) {
				target.setValue(wa_code.substring(0,1));
			}
						
			//var pj_code = target.getValue();

			var fullYear = gUtil.getFullYear()+'';
			var month = gUtil.getMonth()+'';
			if(month.length==1) {
				month = '0' + month;
			}
			
			console_logs('fullYear', fullYear);
			console_logs('month', month);
			
			console_logs('pj_code', pj_code);
			var pj_code = fullYear.substring(2,4) + month;
			console_logs('pj_code', pj_code);
			
			
			
			gMain.selPanel.getInputTarget('item_name').setValue('');
			gMain.selPanel.getInputTarget('specification').setValue('');
			gMain.selPanel.getInputTarget('stock_qty_useful').setValue(0);
			
			//마지막 수주번호 가져오기
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
				params:{
					pj_first: pj_code,
					codeLength: 5
				},
				success : function(result, request) {   	
					var result = result.responseText;
					
					
					console_logs('result', result);
					
					target.setValue(result);
					
					
					//var class_code = gMain.selPanel.inputClassCode.get('class_code');
					//var target2 = gMain.selPanel.getInputTarget('item_code');
					//target2.setValue(result.substring(0,1) + class_code.substring(0,1) +  result.substring(2) + '01');
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
		   
			//마지막 자재번호 가져오기
		   var target2 = gMain.selPanel.getInputTarget('item_code');
		   
		   var class_code = gMain.selPanel.inputClassCode.get('class_code');
		   var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
		   
		   var item_first = wa_code.substring(0,1)+ class_code.substring(0,1);
		   
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
				params:{
					item_first: item_first,
					codeLength: 6
				},
				success : function(result, request) {   	
					var result = result.responseText;
					
					
					console_logs('result 2', result);
					
					target2.setValue(result);
					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax

		});
		
		//프로젝트 선택, 수주번호 HEAD 만들기
		this.addCallback('GET-CODE-HEAD', function(combo, record){
			
			//console_logs('GET-CODE-HEAD record', record);
			//console_logs('combo', combo);
			
			gMain.selPanel.inputBuyer = record;
			gMain.selPanel.doReset();
			
			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var wa_code = record.get('wa_code');
			if(target_item_code!=null && wa_code!=null && wa_code.length>2) {
				target_item_code.setValue(wa_code.substring(0,1));
			}
			
			var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
			target_bmquan.setValue(0);
			
				
			var address_1 = record.get('address_1');
			var target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
			target_address_1.setValue(address_1);
			
			combo.select(record);
			gMain.selPanel.computeProduceQty(50000);
		});
		
		
		this.addCallback('GET-CLASS-CODE', function(combo, record){
			
			//console_logs('GET-CODE-HEAD record', record);
			//console_logs('combo', combo);
			
			gMain.selPanel.inputClassCode = record;

			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var class_code = gMain.selPanel.inputClassCode.get('class_code');
			target_item_code.setValue(target_item_code.getValue() + class_code.substring(0,1));

		});
		
		
		//재고확인 --> 생산수량 계산
		this.addCallback('CHECK_STOCK_QTY', function(o, cur, prev){
			//console_logs('CHECK_STOCK_QTY cur', cur);
			
			gMain.selPanel.computeProduceQty(cur);
		});
		
		
		
		//판걸이 수량변경
		this.addCallback('CHECK_PAN_QTY', function(o, cur, prev){
			//console_logs('CHECK_PRODUCE_QTY', cur);
			gMain.selPanel.handlerChangePanQty();

		});
		//생산 수량 변경
		this.addCallback('CHECK_PRODUCE_QTY', function(o, cur, prev){
			//console_logs('CHECK_PRODUCE_QTY', cur);
			
			var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan');
			var target_reserved_double3 = gMain.selPanel.getInputTarget('reserved_double3');
			var target_reserved_double4 = gMain.selPanel.getInputTarget('reserved_double4');
			
			var qty = Number(target_bm_quan.getValue()) / Number(target_reserved_double3.getValue());
			target_reserved_double4.setValue(qty);
		});
		this.addCallback('CHECK_PAPER_QTY', function(o, cur, prev){
			
			gMain.selPanel.refreshBmquan(cur);
			
		});

		this.addCallback('CHECK_BLADE_SIZE', function(o, cur, prev){
			console_logs('CHECK_BLADE_SIZE cur', cur);
			gMain.selPanel.refreshBladeInfo();
			gMain.selPanel.refreshBladeInfoAll();
		});
		
        
        //redirect
    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
    		if(selectOn==true) {
    			this.propertyPane.setSource(source); // Now load data
    			this.selectedUid = unique_id;
    			gUtil.enable(this.removeAction);
    			gUtil.enable(this.editAction);
    			gUtil.enable(this.copyAction);
    			gUtil.enable(this.viewAction);
    			//gUtil.disable(this.registAction);
    			
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
        
		//Readonly Field 정의 --> 사용하지 않음.
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.RecevedMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_id'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['assymap']
	        );
        
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        //arr.push(dateToolbar);
        arr.push(searchToolbar);
        //grid 생성.
      // this.createGrid(searchToolbar, dateToolbar,buttonToolbar);
        
        
        this.setRowClass(function(record, index) {
        	
        	//console_logs('record', record);
            var c = record.get('status');
            //console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	return 'green-row';
            }

        	}	
        );
        
        
        this.createGrid(arr);
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	

        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        

        this.callParent(arguments);
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.store.load(function() {

        });


    },

    items : []
});
