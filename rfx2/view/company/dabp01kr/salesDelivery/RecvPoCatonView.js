//수주관리 메뉴
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.RecvPoCatonView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'receved-caton-view',
    inputBuyer : null,
    initComponent: function(){

    	this.setDefValue('regist_date', new Date());
    	// 삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.defOnlyCreate = true;
//    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); // Hidden
																		// Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'S');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');// 세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');// 목형유형
    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');// 목형유형
//    	this.setDefComboValue('class_code', 'valueField', 'B');// 목형유형
    	// this.setDefValue('pj_code', 'test');
    	
    	// 검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField (
				{
					type: 'combo'
					,field_id: 'delete_flag'
					,store: 'CodeYnStore'
					,displayField: 'codeName'
					,valueField: 'systemCode'
					,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
    	
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
			,store: "CommonCodeStore"
			,displayField: 'codeName'
			,valueField: 'systemCode'
			,params: {parentCode:'SRO1_BOX_STATE', hasNull:false}
			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});	
    	
// this.addSearchField ({
// type: 'combo'
// ,field_id: 'pm_name'
// ,store: "UserStore"
// ,displayField: 'user_name'
// ,valueField: 'user_name'
// ,value: vCUR_USER_NAME
// ,innerTpl : '<div data-qtip="{dept_name}">{user_name} [{dept_name}]</div>'
// });
		
		this.addSearchField('pm_name');
		this.addSearchField('wa_name');
		this.addSearchField('item_spec');
		this.addSearchField('pj_code');
		
		

//
// this.addSearchField('wa_code');
// this.addSearchField('수주건수');

		
		// Function Callback 정의
		// 재고수량 확인
		this.addCallback('CHECK_STOCK', function(o){
			
			// console_logs('CHECK_STOCK o', o);
			
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
                        stock_qty_useful = o['stock_qty_useful'];// ==>
																	// o.getStock_qty_useful();
																	// o.get('stock_qty_useful');
                        item_name = o['item_name'];
                        specification = o['specification'];
                        
                        // console_logs('item_name', item_name);
                        // console_logs('specification', specification);
                    }
                    
					gMain.setCrPaneToolbarMsg('사용가능한 재고수량은 ' + stock_qty_useful + '입니다.');
// console_logs('stockUseful', stockUseful);
// Ext.Msg.alert('재고수량', '재고수량은 ' + stockUseful + '입니다.'
// , function() {});
					
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
					

					
				},// endofsuccess
				failure: extjsUtil.failureMessage
			});// endofajax
			

		});
		// 재고수량 리셋
		this.addCallback('RESET_STOCK', function(o){
			// console_logs('RESET_STOCK o', o);
			
			var target_useful = gMain.selPanel.getInputTarget('stock_qty_useful');
			target_useful.setValue(0);
		});
		
		// 수주번호 자동생성
		this.addCallback('AUTO_PJCODE', function(o){
			if(this.crudMode=='EDIT') { // EDIT
	    		console_logs('preCreateCallback', 'IN EDIT');
	    	} else {// CREATE,COPY
	    		// console_logs('AUTO_PJCODE o', o);
				
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
							
				// var pj_code = target.getValue();

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
				
				
				
				// gMain.selPanel.getInputTarget('item_name').setValue('');
				// gMain.selPanel.getInputTarget('specification').setValue('');
				gMain.selPanel.getInputTarget('stock_qty_useful').setValue(0);
				
				// 마지막 수주번호 가져오기
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
						
						
						// var class_code =
						// gMain.selPanel.inputClassCode.get('class_code');
						// var target2 = gMain.selPanel.getInputTarget('item_code');
						// target2.setValue(result.substring(0,1) +
						// class_code.substring(0,1) + result.substring(2) + '01');
					},// endofsuccess
					failure: extjsUtil.failureMessage
				});// endofajax
			   
				// 마지막 자재번호 가져오기
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
						
					},// endofsuccess
					failure: extjsUtil.failureMessage
				});// endofajax
	    		
	    		
	    		
	    	}

		});
		
		// 프로젝트 선택, 수주번호 HEAD 만들기
		this.addCallback('GET-CODE-HEAD', function(combo, record){
			
			// console_logs('GET-CODE-HEAD record', record);
			// console_logs('combo', combo);
			
			gMain.selPanel.inputBuyer = record;
			// gMain.selPanel.doReset();
			
			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var wa_code = record.get('wa_code');
			if(target_item_code!=null && wa_code!=null && wa_code.length>2) {
				target_item_code.setValue(wa_code.substring(0,1));
			}
			
			// var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
			// target_bmquan.setValue(0);
			
				
			var address_1 = record.get('address_1');
			var target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
			target_address_1.setValue(address_1);
			
			combo.select(record);
			// gMain.selPanel.computeProduceQty(50000);
		});
		
		this.copyCallback = function() {
			
			var quanW = gMain.selPanel.getInputTarget('quan');
			var bm_quanW = gMain.selPanel.getInputTarget('bm_quan');
			
			// quanW.setValue(0);
			// bm_quanW.setValue(0);
			
			console_logs('copyCallback', '수주 복사등록');
			var target = gMain.selPanel.getInputTarget('pj_code');
			
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
			
		
			// 마지막 수주번호 가져오기
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
					
					
					// var class_code =
					// gMain.selPanel.inputClassCode.get('class_code');
					// var target2 = gMain.selPanel.getInputTarget('item_code');
					// target2.setValue(result.substring(0,1) +
					// class_code.substring(0,1) + result.substring(2) + '01');
				},// endofsuccess
				failure: extjsUtil.failureMessage
			});// endofajax
		};
		
		
		this.addCallback('GET-CLASS-CODE', function(combo, record){
			
			// console_logs('GET-CODE-HEAD record', record);
			// console_logs('combo', combo);
			
			gMain.selPanel.inputClassCode = record;

			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var class_code = gMain.selPanel.inputClassCode.get('class_code');
			target_item_code.setValue(target_item_code.getValue() + class_code.substring(0,1));

		});
		
		this.addCallback('PKG-UNIT', function(combo, record){
			
			console_logs('PKG-UNIT record', record);
			console_logs('combo', combo);
			
			
			

		});
		
		/*
		reserved1	유형
		reserved2	기로
		reserved3	세로
		reserved4	높이
		reserved5	무게
		reserved_double5	포장수량

		 */
		this.addCallback('PKG-PALLET', function(combo, record){
			
			console_logs('PKG-PALLET record', record);
			console_logs('combo', combo);
			
			var _reserved1	= gm.me().getInputJust('partline|reserved1');
			var _reserved2	= gm.me().getInputJust('partline|reserved2');
			var _reserved3	= gm.me().getInputJust('partline|reserved3');
			var _reserved4	= gm.me().getInputJust('partline|reserved4');
			//var reserved_double5	= gm.me().getInputTarget('reserved_double5');
			
			_reserved1.setValue(record.get('class_name'));
			_reserved2.setValue(record.get('reserved_double1'));
			_reserved3.setValue(record.get('reserved_double2'));
			_reserved4.setValue(record.get('reserved_double3'));

		});
		/*
			reserved10	적재패턴
			reserved11	비고
			reserved6	품명
			reserved7	X(mm)
			reserved8	Y(mm)
			reserved9	Z(mm)
			reserved_number4	포장수량

		 */
		this.addCallback('PKG-BOK', function(combo, record){
			
			console_logs('PKG-BOK record', record);
			console_logs('combo', combo);

			var _reserved10			= gm.me().getInputJust('partline|reserved10');
			var _reserved11			= gm.me().getInputJust('partline|reserved11');
			var _reserved6			= gm.me().getInputJust('partline|reserved6');
			var _reserved7			= gm.me().getInputJust('partline|reserved7');
			var _reserved8			= gm.me().getInputJust('partline|reserved8');
			var _reserved9			= gm.me().getInputJust('partline|reserved9');
			var _reserved_number4	= gm.me().getInputJust('partline|reserved_number4');
			
			_reserved10.setValue(record.get('comment'));
			_reserved11.setValue(record.get('reserved_varchar1'));
			_reserved6.setValue(record.get('class_name'));
			_reserved7.setValue(record.get('reserved_double1'));
			_reserved8.setValue(record.get('reserved_double2'));
			_reserved9.setValue(record.get('reserved_double3'));
			_reserved_number4.setValue(record.get('reserved_double4'));
			
		});
		
		
		// 재고확인 --> 생산수량 계산
		this.addCallback('CHECK_STOCK_QTY', function(o, cur, prev){
			 console_logs('CHECK_STOCK_QTY cur', cur);
			
			gMain.selPanel.computeProduceQty(cur);
		});

		this.addCallback('CHECK_SELLING_PRICE', function(o, cur, prev){
			 console_logs('CHECK_SELLING_PRICE cur', cur);
			
			gMain.selPanel.computeSellingPrice(cur);
		});
		
		
		
		// 판걸이 수량변경
		this.addCallback('CHECK_PAN_QTY', function(o, cur, prev){
			// console_logs('CHECK_PRODUCE_QTY', cur);
			gMain.selPanel.handlerChangePanQty();

		});
		// 생산 수량 변경
		this.addCallback('CHECK_PRODUCE_QTY', function(o, cur, prev){
			// console_logs('CHECK_PRODUCE_QTY', cur);
			
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
		
        // redirect
    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
    		if(selectOn==true) {
    			this.propertyPane.setSource(source); // Now load data
    			this.selectedUid = unique_id;
    			gUtil.enable(this.removeAction);
    			gUtil.enable(this.editAction);
    			gUtil.enable(this.copyAction);
    			gUtil.enable(this.viewAction);
    			gUtil.enable(this.checkCycleAction);
    			// gUtil.disable(this.registAction);
    			
    		} else {// not selected
            	this.propertyPane.setSource(source);
            	this.selectedUid = '-1';
            	gUtil.disable(this.removeAction);
            	gUtil.disable(this.editAction);
            	gUtil.disable(this.copyAction);
            	gUtil.disable(this.viewAction);
            	gUtil.enable(this.registAction);
            	gUtil.disable(this.checkCycleAction);
            	this.crudTab.collapse();
    		}

    		console_logs('this.crudMode', this.crudMode);
    		this.setActiveCrudPanel(this.crudMode);
    	};
        
		// Readonly Field 정의 --> 사용하지 않음.
// this.initReadonlyField();
// this.addReadonlyField('unique_id');

		// 검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.RecevedCatonMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/* pageSize */
	        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	// Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_id'
	        }
        	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['assymap']
			);

		this.store.getProxy().setExtraParam('sales_caton_box', 'Y');
				

        // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        
        this.setRowClass(function(record, index) {
        	
        	// console_logs('record', record);
            var c = record.get('status');
            // console_logs('c', c);
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

        });
        
        
        this.createGrid(arr);
        
        // 작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '구매 요청',
			 tooltip: '구매 요청',
			 disabled: true,
			 
			 handler: function() {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '구매요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.doRequest();
	            	        }
			            },
			            // animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        // 버튼 추가.
        buttonToolbar.insert(4, this.requestAction);
        buttonToolbar.insert(4, '-');
        
        // 작업지시 Action 생성
        this.checkCycleAction = Ext.create('Ext.Action', {
			 iconCls: 'fa-subscript_14_0_5395c4_none',
			 text: '발주 주기',
			 tooltip: '발주주기 확인',
			 disabled: true,
			 
			 handler: function(widget, event) {
				 
				 gMain.selPanel.addMtrlGrid =
	    		    	Ext.create('Rfx.view.grid.RecvDateGrid', {
	    		    	 // id:'DBM7-Mtrl',
	    				 // title: '발주주기',// cloud_product_class,
	    				 border: true,
	    		         resizable: true,
	    		         collapsible: true,
	    			     // scroll:true,
	    			     // overflowY: true,
	 					 // autoScroll: true,
	    			     height: "100%",
	    		         store:  gMain.selPanel.recvDateStore// ,
	    		         // recvDateStore:
							// Ext.create('Mplm.store.RecvDateStore',
							// {params:gMain.selPanel.buyerUid}),
	    		         // layout :'fit',
	    		         // forceFit: true,
	    				
	    			
	    			});	    			
			    	var form = Ext.create('Ext.panel.Panel', {
			    		// id: 'modformPanel-DBM7',
			            defaultType: 'textfield',
			            border: false,
			            // bodyPadding: 15,
			            width: 640,
			            height: 480,
			            //layout:'fit',
			            // margins: '0 0 10 0',
			            scroll: true,
						autoScroll: true,
			            defaults: {
			                // anchor: '100%',
			                editable:false,
			                allowBlank: false,
			                msgTarget: 'side',
			                labelWidth: 100
			            },
			             items: [gMain.selPanel.addMtrlGrid]
			        });
			    	
			        var win = Ext.create('ModalWindow', {
			            title: '발주주기',
			            width: 640,
			            height: 480,// bHeight+30,
			            items: form,
			        });
			        win.show(/* this, function(){} */);
			 }
		});
        // 버튼 추가.
        buttonToolbar.insert(4, this.checkCycleAction);
        buttonToolbar.insert(4, '-');
        
        //작업지시 Action 생성
        this.recvCancleAction = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: gm.getMC('CMD_ORDER_CANCELLATION','수주취소'),
			 tooltip: '수주취소',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '수주취소를 진행하시겠습니까?<br>수주를 취소하면 다시 등록해야합니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.recvCancleFc();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});

        // 버튼 추가.
        buttonToolbar.insert(4, this.recvCancleAction);
        buttonToolbar.insert(4, '-');
        
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	this.copyCallback();
        	
        	var processGrid = Ext.getCmp('recvPoPcsGrid');
        	var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );

        	
            if (selections.length) {
            	var rec = selections[0];
                // gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid');
				// //assymap의 child
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_BUYER_UID = rec.get('order_com_unique');
                gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code');
                gMain.selPanel.vSELECTED_STATUS = rec.get('status');
                
                gMain.selPanel.vSELECTED_BM_QUAN = rec.get('bm_quan');
                gMain.selPanel.vSELECTED_PAN_QTY = rec.get('reserved_double3');
                
                var status = rec.get('status');
    			
//    			gMain.selPanel.prchHistory(rec.get('ac_uid'));
//    			gMain.selPanel.recvDateStore.getProxy().setExtraParam('item_code', gMain.selPanel.vSELECTED_ITEM_CODE);
//    			gMain.selPanel.recvDateStore.getProxy().setExtraParam('order_com_unique', gMain.selPanel.vSELECTED_BUYER_UID);
//                gMain.selPanel.recvDateStore.load();
    			if(status=='BM'||status=='CR'||status=='DE') {
    				gUtil.enable(gMain.selPanel.removeAction);
    				gUtil.enable(gMain.selPanel.editAction);    
    				gUtil.enable(gMain.selPanel.requestAction);
    			} else {
    				gUtil.disable(gMain.selPanel.removeAction);
    				gUtil.disable(gMain.selPanel.editAction);   
    				gUtil.disable(gMain.selPanel.requestAction);
    			}
    			
    			if(status=='CR'||status=='P'||status=='N'||status=='DE') {
    				gUtil.enable(gMain.selPanel.recvCancleAction);
    			} else {
    				gUtil.disable(gMain.selPanel.recvCancleAction);
    			}
    			
    			// mainmenu.disable();
                
            } else {
            	gMain.selPanel.requestAction.disable();
            	// mainmenu.enable();
            }
//        	processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
//        	processGrid.getStore().load();
        	
//        	gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);
//        	gm.me().defaultPartLoad();
        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
		
		

        this.storeLoad = function() {
			var start_date = new Date();
			console.log('>>> start_date', start_date);
            this.store.load(function(records) {


				var end_date = new Date();
				console.log('>>> end_date',end_date);
				var elapsedTime = end_date - start_date;
				console.log('>>>> elapsedTime(ms)',elapsedTime);	
			});
			
        };
        
        this.storeLoad();
        
        this.store.on('load',function (store, records, successful, eOpts ){
       });
        

    },
    
    
    selectPcsRecord: null,
    items : [],
    computeProduceQty: function(cur) {
    	
    	
		// console_logs('computeProduceQty cur', cur);
		var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
		var target_bm_quan = this.getInputTarget('bm_quan');

		var target_selling_price = this.getInputTarget('selling_price');
		var target_quan = this.getInputTarget('quan');
		var target_sales_price = this.getInputTarget('sales_price');
		
		var val2 = target_quan.getValue() * target_sales_price.getValue();
		var val = cur - target_stock_qty_useful.getValue();
//		 console_logs('cur - target_stock_qty_useful.getValue() val', val);
//		 console_logs('target_bm_quan', target_bm_quan);
//		 console_logs('target_quan', target_quan);
		if(val<0) {
			val = 0;
		}
		target_bm_quan.setValue(val);
		target_selling_price.setValue(val2);
		console_logs('target_bm_quan', target_bm_quan);
	},
	
	computeSellingPrice: function(cur) {
    
		var target_selling_price = this.getInputTarget('selling_price');
		var target_sales_price = this.getInputTarget('product_sales_price');
		var target_quan = this.getInputTarget('quan');
		
		
		var val = target_quan.getValue() * target_sales_price.getValue();
//		 console_logs('cur - target_stock_qty_useful.getValue() val', val);
//		 console_logs('target_bm_quan', target_bm_quan);
//		 console_logs('target_quan', target_quan);
		if(val<0) {
			val = 0;
		}
		target_selling_price.setValue(val);
    },
    
    // 구매/제작요청
    doRequest: function() {
    	
    	
// var target_reserved_double3 = this.getInputTarget('unique_id');
// var assymapUid = target_reserved_double3.getValue()
//    	
    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
    	
    	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
    	var assymapUid = this.vSELECTED_RECORD.get('unique_uid');
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=addRequestCaton',
			params:{
				assymapUid: assymapUid,
				ac_uid: ac_uid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax

    },
    
    preCreateCallback: function() {
    	
    	console_logs('crudMode', this.crudMode);
    	if(this.crudMode!='CREATE') {
    		gm.me().doCreateCore();
    		return true;
    	} else {
        	console_log=('pj_code',gMain.selPanel.vSELECTED_PJ_CODE);
        	var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
           	Ext.Ajax.request({
    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
    			params:{
    				pj_code : pj_code
    			},
    			
    			success : function(result, request) {
					gm.me().doCreateCore();
                   	// projectmold.save({
                	// 	success : function(result, request) {		                			
                	// 		gm.me().doCreateCore();

                	// 	}// success
                	//  });// save
    				this.preCreateCallback = function() {
    					gm.me().doCreateCore();
    					return true;
    				};
    			},// Ajax success
				// failure: extjsUtil.failureMessage
				failure: function() {
					this.preCreateCallback = function() {
						gm.me().doCreateCore();
					   return true;
				   };
				}
    			//  failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {
     			// 	this.preCreateCallback = function() {
     			// 		gm.me().doCreateCore();
    			// 		return true;
    			// 	};
    			//  })
    		}); 
           	
           	return false;    		
    	}
    	

    },
    recvCancleFc: function() {
    	
    	var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
    	var status = gMain.selPanel.vSELECTED_STATUS;
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=recvCancle',
			params:{
				pj_code: pj_code,
				status : status
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax

    },



	 

});
