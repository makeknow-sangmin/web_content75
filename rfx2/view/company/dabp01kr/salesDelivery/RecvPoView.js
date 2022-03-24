//수주관리 메뉴
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.RecvPoView', {
	extend: 'Rfx2.view.salesDelivery.RecvPoView',
    xtype: 'receved-mgmt-view',
    inputBuyer : null,
    initComponent: function(){

    	this.setDefValue('regist_date', new Date());
    	// 삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(10);
    	this.setDefValue('delivery_plan', next7);
    	this.defOnlyCreate = true;
    	this.setDefComboValue('pm_uid', 'valueField', -1); // Hidden
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');// 세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');// 목형유형
    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');// 목형유형
    	
		// this.setDefValue('pj_code', 'test');
		
		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
			switch(dataIndex) {
				case 'ctr_flag':
				columnObj['renderer'] = function(value) {
					switch(value) {
						case 'Y':
						return '상시재고';
						case 'N':
						return '주문생산';
						default:
						return '주문생산';
					}
				}
				break;
			}
		});
    	
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
			,store: "RecevedStateStore"
			,displayField: 'codeName'
			,valueField: 'systemCode'
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
		this.addSearchField('description_r1');
		
		
		this.addFormWidget('수주정보', {
	     	   tabTitle:"수주정보", 
	     	   	id:	'md_charger',
	            xtype: 'combo',
	            text: '디자이너',
	            name: 'md_charger',
	            storeClass: 'UserDeptStoreOnly',
	            params:{dept_code: '05'},
	            displayField: "user_name",
	            valueField: "user_name", 
	            innerTpl: "<div>[{dept_name}] {user_name}</div>", 
	            listeners: {
			           select: function (combo, record) {
	
			           }
		        },
	            canCreate:   true,
	            canEdit:     true,
	            canView:     true,
	            position: 'center',
	            tableName: 'partline',
	            code_order:	750
	        }); 

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
//                    	console_logs('/sales/sps1.do o', o);
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
//	    		console_logs('preCreateCallback', 'IN EDIT');
	    	} else {// CREATE,COPY
	    		// console_logs('AUTO_PJCODE o', o);
				
				var target = gMain.selPanel.getInputTarget('pj_code');
				var target1 = gMain.selPanel.getInputTarget('class_code');

				console_logs('>>> 1 target', target);
				console_logs('>>> 2 target1', target1);
				
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

				console_logs('>>> 3 target', target);
							
				// var pj_code = target.getValue();

				var fullYear = gUtil.getFullYear()+'';
				var month = gUtil.getMonth()+'';
				if(month.length==1) {
					month = '0' + month;
				}
				
//				console_logs('fullYear', fullYear);
//				console_logs('month', month);
//				console_logs('pj_code', pj_code);
				var pj_code = fullYear.substring(2,4) + month;
				console_logs('>>> 4 target', pj_code);
				
				
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
						
						
//						console_logs('result', result);
						
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
						codeLength: 6,
						sp_code:'PRD'
					},
					success : function(result, request) {   	
						var result = result.responseText;
						
						
//						console_logs('result 2', result);
						
						target2.setValue(result);
						
					},// endofsuccess
					failure: extjsUtil.failureMessage
				});// endofajax
	    		
	    		
	    		
	    	}

		});
		
		// 프로젝트 선택, 수주번호 HEAD 만들기
		this.addCallback('GET-CODE-HEAD', function(combo, record){
			
			console_logs('GET-CODE-HEAD record', record);
			console_logs('combo', combo);
			
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

			var flag = record.get('bs_flag');
			console_logs('flagflagflagflagflag', flag);
			if(flag == null || flag.length < 1) {
				flag = 'N';
			}
			var flag_ko = '비포함';
			switch(flag) {
				case 'Y':
					flag_ko = '포함';
				break;
				default:
					flag_ko = '비포함';
				break;
			}
			gm.me().buttonToolbar3.items.items[1].update('부가세 여부 : ' + flag_ko);
			Ext.getCmp('tex_flag').setValue(flag);
		});
		
		this.copyCallback = function() {
			
			var quanW = gMain.selPanel.getInputTarget('quan');
			var bm_quanW = gMain.selPanel.getInputTarget('bm_quan');
			
			// quanW.setValue(0);
			// bm_quanW.setValue(0);
			
//			console_logs('copyCallback', '수주 복사등록');
			var target = gMain.selPanel.getInputTarget('pj_code');
			
			var fullYear = gUtil.getFullYear()+'';
			var month = gUtil.getMonth()+'';
			if(month.length==1) {
				month = '0' + month;
			}
			
//			console_logs('fullYear', fullYear);
//			console_logs('month', month);
			
//			console_logs('pj_code', pj_code);
			var pj_code = fullYear.substring(2,4) + month;
//			console_logs('pj_code', pj_code);
			
		
			// 마지막 수주번호 가져오기
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
				params:{
					pj_first: pj_code,
					codeLength: 5
				},
				success : function(result, request) {   	
					var result = result.responseText;
					
					
//					console_logs('result', result);
					
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
			
//			console_logs('PKG-UNIT record', record);
//			console_logs('combo', combo);
			
			
			

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
			
//			console_logs('PKG-PALLET record', record);
//			console_logs('combo', combo);
			
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
		this.addCallback('WP-UNIT', function(combo, record){
			
			var _reserved_varchara			= gm.me().getInputJust('project|reserved_varchara');//목형번호
			var _reserved_varcharb			= gm.me().getInputJust('project|reserved_varcharb');//칼날Size(목형사이즈)
			var _reserved_varcharc			= gm.me().getInputJust('project|reserved_varcharc');//판걸이단위
			var _reserved_varchard			= gm.me().getInputJust('project|reserved_varchard');//제품사이즈
			var _reserved_double3			= gm.me().getInputJust('project|reserved_double3');//판걸이수량
			var _reserved_number2			= gm.me().getInputJust('project|reserved_number2');//목형Uid
   			var _reserved_varcharh			= gm.me().getInputJust('project|reserved_varcharh');//목형명
//   			var target2 = gm.me().getInputTarget('reserved_varcharh');
   			
   			console_logs('WP-UNIT',_reserved_varcharh);
   			
			_reserved_varchara.setValue(record.get('model_no'));
			_reserved_varcharb.setValue(record.get('description'));
			_reserved_varcharc.setValue(record.get('unit_code'));
			_reserved_varchard.setValue(record.get('specification'));
			_reserved_number2.setValue(record.get('unique_id'));
   			_reserved_varcharh.setValue(record.get('item_name'));
//   			target2.setValue(record.get('item_name'));
			
			if(record.get('cost_qty')==0){
				_reserved_double3.setValue(1);
			}else{
				_reserved_double3.setValue(record.get('cost_qty'));
			}
			
		});
		this.addCallback('CATON-UNIT', function(combo, record){
			
//			console_logs('CATON-UNIT record', record);
//			console_logs('combo', combo);

			
			var _reserved6			= gm.me().getInputJust('partline|reserved6');
			var _reserved15			= gm.me().getInputJust('partline|reserved15');
			var _reserved10			= gm.me().getInputJust('partline|reserved10');
			var _reserved11			= gm.me().getInputJust('partline|reserved11');
			var _reserved7			= gm.me().getInputJust('partline|reserved7');
			var _reserved8			= gm.me().getInputJust('partline|reserved8');
			var _reserved9			= gm.me().getInputJust('partline|reserved9');
			var caton_qty			= gm.me().getInputJust('partline|caton_qty');
			var stock_useful_qty			= gm.me().getInputJust('partline|stock_useful_qty');
			var box_size = record.get('description');
			
			var boxArray = box_size.split(' * ');
			_reserved6.setValue(record.get('item_name'));
//			_reserved15.setValue(record.get('reserved_varchar1'));
			_reserved10.setValue(record.get('usage1'));
//			_reserved11.setValue(record.get('stock_qty'));
			_reserved7.setValue(boxArray[0]);
			_reserved8.setValue(boxArray[1]);
			_reserved9.setValue(boxArray[2]);
			caton_qty.setValue(record.get('useful_qty'));
			stock_useful_qty.setValue(record.get('total_useful_qty'));
			
			var bm_quan			= gm.me().getInputJust('project|bm_quan');
			var quan = bm_quan.getValue();
			var unit_qty = _reserved15.getValue();
			if(unit_qty==null){
				unit_qty=0
			}
			var cost_qty			= gm.me().getInputJust('project|cost_qty');
//			console_logs('Math.round( (quan/unit_qty))',Math.round( (quan/unit_qty)));
			cost_qty.setValue(Math.round( (quan/unit_qty)));
		});
		// 재고확인 --> 생산수량 계산
		this.addCallback('CHECK_STOCK_QTY', function(o, cur, prev){
//			 console_logs('CHECK_STOCK_QTY cur', cur);
			
			gMain.selPanel.computeProduceQty(cur);
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
//			console_logs('CHECK_BLADE_SIZE cur', cur);
			gMain.selPanel.refreshBladeInfo();
			gMain.selPanel.refreshBladeInfoAll();
		});
		
		//카톤 소요수량 계산
		this.addCallback('CALC_USE_CATON', function(o, cur, prev){
//			 console_logs('CALC_USE_CATON cur', cur);
			
			gMain.selPanel.calcCatonuseQty(cur);
		});
// this.addFormWidget('previouscont', {
// tabTitle:"수주정보",
// xtype: 'displayfield',
// text: '(수량계산)',
// value: '<span style="background: #FBF8E6; background-image: none;border:1px
// solid #e8e8e8; color:blue; padding: 1px">생산 = 수주-재고</span>&nbsp;&nbsp;<span
// style="background: #FBF8E6; background-image: none;border:1px solid #e8e8e8;
// color:red; padding: 1px"> 원지 = 생산/판걸이</span>',
// margins: '0 0 0 0',
// canCreate: true,
// canEdit: true,
// canView: true,
// position: 'center'
// });
        // Widget 추가
        this.addFormWidget('reserved_varchara', {
        	tabTitle:"수주정보", 
            xtype: 'displayfield',
            text: '칼날요약',
            name: 'blade_size_info',
            value: '칼 000 * 000 1EA',
            fieldStyle: 'background-image: none; color:red; padding: 1px',
            // margins: '0 0 0 10',
            canCreate:   true,
            canEdit:     true,
            canView:     true,
            position: 'center'
        });        
//        this.addFormWidget(0, {
//        	tabTitle:"구매규격",
//        	name: 'blade_size_info1',
//            xtype: 'displayfield',
//            text: '',
//            emptyText: '칼날Size',
//            fieldStyle: 'background-color: #FBF8E6; background-image: none; padding:1px;',
//            value: '<font color="#EAEAEA;">칼 000 * 000 1EA</font>',
//            // margins: '0 0 0 10',
//            canCreate:   true,
//            canEdit:     true,
//            canView:     true,
//            position: 'center'
//        });
        
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

//    		console_logs('this.crudMode', this.crudMode);
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

        this.createStore('Rfx.model.RecevedMgmt', [{
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

			for(var i=0; i<this.searchField.length; i++) {
				var search = this.searchField[i];
				if(search['field_id'] == 'regist_date') {
					var sdate = this.searchField[1]['sdate'];
					var edate = this.searchField[1]['edate'];
					sdate = Ext.Date.format(sdate, 'Y-m-d');
					edate = Ext.Date.format(edate, 'Y-m-d');
					console_logs('>>>>s + e', sdate + ' : ' + edate);
					this.store.getProxy().setExtraParam('regist_date', '%'+sdate + ':' + edate+ '%');
				}
			}
			this.store.getProxy().setExtraParam('sales_caton_box', null);
			this.store.getProxy().setExtraParam('is_def_list', 'N,C');
			// this.store.getProxy().setExtraParam('is_def_list', 'C');
			// this.store.getProxy().setExtraParam('is_def', 'N');
			// this.store.getProxy().setExtraParam('pj_type', 'P'); // 수주관리(주문생산)
				

		var calQuan = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '구매수량계산',
			 tooltip: '구매수량 계산하기',
			 handler: function() {
				 	gm.me().prchCalQuan();
			 }
			});
		
		var saveAssymap = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '구매내용저장',
			 tooltip: '구매 내용 저장',
			 // toggleGroup: 'toolbarcmd',
			 handler:  function() {
				 	gm.me().saveAssymapHandlerMulti();
			 }
		});

		var textAction = Ext.create('Ext.Action', {
			iconCls: 'fa-save_14_0_5395c4_none',
			text: '누르면 초기값',
			tooltip: '구맥규격 ㄱㄱㄱ',
			// toggleGroup: 'toolbarcmd',
			handler:  function() {
					gm.me().loadPrchPart4create();
			}
		});
		
		
		var addPartRowAction = Ext.create('Ext.Action',{
			iconCls : 'af-plus-circle',
			text : '추가',
			disabled : true,
			handler : function() {
//				var recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid');
				var recvPoAssyGrid = gMain.selPanel.recvPoPartGrid;
				var mainGrid = gm.me().grid;

				var main_rec = mainGrid.getSelectionModel().getSelection()[0];
				if(recvPoAssyGrid == null || recvPoAssyGrid == undefined) {
					recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid1');
				}
				var selections =  recvPoAssyGrid.getSelectionModel().getSelection();
				var parent_uid = 200;

				try {
					parent_uid = main_rec.get('unique_uid');
				} catch (error) {
					parent_uid = 200;
				}
				
				var unique_uid = -1;
				
				if(selections==null || selections.length==0) {
					unique_uid = 200;
				} else {
					var rec = selections[0];
					 unique_uid = rec.get('unique_uid');
					
				}
				
				//console_logs('recvPoAssyGrid rec', rec);
				
				//console_logs('unique_uid', unique_uid);
				
				// console_logs('rec', rec);
				console_logs('>>>>> sssss 111', gm.me().AssemblyPartStore);
				Ext.Ajax.request({
					url : CONTEXT_PATH
							+ '/index/process.do?method=copyPartLineRow',
					params : {
						assymapUid : unique_uid,
						parent_uid:parent_uid
					},
					success : function(
							result,
							request) {

						gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
						gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
						gm.me().AssemblyPartStore.getProxy().setExtraParam('groupBy', 'a.unique_id');
						gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code_list', 'R,O,K');
						// gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code', 'R');
						
						console_logs('>>>>> sssss', gm.me().AssemblyPartStore);
						gm.me().AssemblyPartStore.load();
					},
					failure : extjsUtil.failureMessage
				});
			}
		});
		
		var removePartRowAction = Ext.create('Ext.Action',{
			iconCls : 'af-remove',
			text : '삭제',
			disabled : true,
			handler : function() {
				var recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid1');
				// var recvPoAssyGrid = gMain.selPanel.recvPoPartGrid;
				var rec = recvPoAssyGrid.getSelectionModel().getSelection()[0];
				console_logs('>>>>>>>>>>>>>>>>>>>>rec',rec);
				var unique_uid = rec.get('unique_uid');
				var sp_code = rec.get('sp_code');
				var ac_uid = rec.get('ac_uid');
				console_logs('>>>>>>>>>>>>>>>>>>>>sp_code',sp_code);
				console_logs('>>>>>>>>>>>>>>>>>>>>ac_uid',ac_uid);
				if(unique_uid==undefined && unique_uid==null) { //값이없으면 -> 신규등록
					gm.extFieldColumnStore.remove(rec);
				} else { //수정.
	                Ext.Ajax.request({
						url: CONTEXT_PATH + '/index/process.do?method=deleteItem',
	                    // url: CONTEXT_PATH + '/index/generalData.do?method=delete',
	                    params: {
							unique_uid:unique_uid,
							sp_code:sp_code,
							pj_uid:ac_uid
	                    },
	                    method: 'POST',
	                    success: function(rec) {
	                    	//console_logs('load>>>>>>>>>>>>>>>>>>>');
//	                    	gm.extFieldColumnStore.remove(rec);
	                    	
	                    	gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
							gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
							gm.me().AssemblyPartStore.getProxy().setExtraParam('groupBy', 'a.unique_id');
							gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code_list', 'R,O,K');
	                    	// gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code', 'R');
	                    	gm.me().AssemblyPartStore.load();
	                    	
	                    	// gm.me().AssemblyPartStore2.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
	                    	// gm.me().AssemblyPartStore2.getProxy().setExtraParam('orderBy', 'pl_no');
	                    	// gm.me().AssemblyPartStore2.getProxy().setExtraParam('sp_code', 'O');
	                    	// gm.me().AssemblyPartStore2.load();
	                    	
	                    	// gm.me().AssemblyPartStore3.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
	                    	// gm.me().AssemblyPartStore3.getProxy().setExtraParam('orderBy', 'pl_no');
	                    	// gm.me().AssemblyPartStore3.getProxy().setExtraParam('sp_code', 'K');
	                    	// gm.me().AssemblyPartStore3.load();
	                    	//console_logs('fisish>>>>>>>>>>>>>>>>>>>');
	                    },
	                    failure: function(rec, op) {
	                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

	                    }
	                });
				}
				

			}
		});

		var blankCopyRowAction = Ext.create('Ext.Action',{
			iconCls : 'af-plus-circle',
			text : '원지 추가',
			disabled : false,
			handler : function() {
				Ext.Ajax.request({
					url : CONTEXT_PATH
							+ '/index/process.do?method=copyPartLineRow',
					params : {
						assymapUid : 200,
						parent_uid:200
					},
					success : function(
							result,
							request) {

						gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
						gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
						gm.me().AssemblyPartStore.getProxy().setExtraParam('groupBy', 'a.unique_id');
						gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code_list', 'R,O,K');
						gm.me().AssemblyPartStore.load();
					},
					failure : extjsUtil.failureMessage
				});
			}
		});

		var purColStore = Ext.create(
			'Rfx.store.ExtFieldColumnStore', {
				fields : [ {
					name : 'name'
				} ]
			});
		
		//구매내역
		purColStore.load({
			params : {
				menuCode : 'SRO1_PUR'
			},
			callback : function(records, operation, success) {
				// console_logs('>>>>records', records);
				if (success == true) {
					var o = gm.parseGridRecord(records, 'recvPoAssyGrid');
					console_logs('>>>> oo', o);
					var fields = o['fields'], /*columns = o['columns'],*/ tooltips = o['tooltips'];
					var columns = [];
					for(var i=0; i<o['columns'].length; i++) {
						var c = o['columns'][i];
						var dataIndex = c['dataIndex'];
						if(dataIndex == 'sp_code') {
							c['width'] = 100;
						}
						columns.push({
							text:c['text'],
							dataIndex:c['dataIndex'],
							style:c['style'],
							width: c['width']
						})
					}
					console_logs('>>>> oo columns', columns);
					// 소팅기준
					var sortBy = o['sortBy'];
					var tabPanel = Ext.getCmp(gm.geTabPanelId());
					var checkbox = true;

					Ext.each(
						columns,
						function(o, index) {
							o['sortable'] = true;

							switch (o['dataIndex']) {
							case 'serial_no':
							case 'pl_no':
								o['editor'] = {
									allowBlank : false
								};
								break;
							case 'bm_quan':
								o['style'] = 'text-align:right';
								o['align'] = 'right';
								o['editor'] = {
									allowBlank : false,
									xtype : 'numberfield',
									minValue : 0
								};
								break;
							case 'sp_code':
									o['renderer'] = function(value) {
										switch(value) {
											case 'R':
											return '원지';
											case 'O':
											return '원단';
											case 'K':
											return '부자재';
											default:
											return value;
										}
									}
									o['editor'] = {
										xtype: 'combo',
										typeAhead : true,
										triggerAction : 'all',
										store : gm.me().standardFlagStore,
										displayField : 'code_name_kr',
										valueField : 'system_code',
										listConfig : {
											getInnerTpl : function() {
												return '<div data-qtip="{system_code}">{code_name_kr}</div>';
											}
										},
									}
								break;
							case 'description_src':
							case 'remark_src':
							case 'comment':
							case 'item_name':
							case 'specification':
								o['editor'] = {
//										allowBlank : true
								};
							}
						});
					
					var cellEditing = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					
					// var cellEditing2 = new Ext.grid.plugin.CellEditing({
					// 	clicksToEdit : 1
					// });
					// var cellEditing3 = new Ext.grid.plugin.CellEditing({
					// 	clicksToEdit : 1
					// });

					var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
						// groupField: 'sp_code_kr',
						groupHeaderTpl: '<div><font color=#003471><b>' +
						'{[values.rows[0].data.sp_code == "R" ? "원지" :' + 
						'values.rows[0].data.sp_code == "O" ? "원단" :' + 
						'values.rows[0].data.sp_code == "K" ? "부자재" : values.rows[0].data.sp_code]} </b></font></div>',
					});

					console_logs('---->  AssemblyPartStore', gm.me().AssemblyPartStore);
					console_logs('---->  groupingFeature', groupingFeature);
					
					var grid = Ext.create('Ext.grid.Panel',{
								id : 'recvPoAssyGrid1',
								store : gm.me().AssemblyPartStore,
								title : '정보',
								border : true,
								resizable : true,
								scroll : true,
								multiSelect : false,
								collapsible : false,
								// layout : 'fit',
								// forceFit: true,
								features: [groupingFeature],
								region : 'center',
								// plugins : [ cellEditing ],
								dockedItems: [
							        {
							            dock: 'top',
							            xtype: 'toolbar',
							            cls: 'my-x-toolbar-default3',
							            items: [
											addPartRowAction, removePartRowAction
							                    // '-',
							 	   		    	// saveAssymap, textAction,
							                    // '->',
//							                    calQuan,
							                    // '-'
					      				        ]
								        },
								        // {
										// 	dock : 'top',
										// 	xtype : 'toolbar',
										// 	cls : 'my-x-toolbar-default3',
										// 	items : [ '-', addPartRowAction, removePartRowAction ]
										// }
							        ],
							    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{mode:'single'}): null,
								listeners : {
									itemdblclick : function(view,
											record, htmlItem,
											index, eventObject,
											opts) {
										gm.me().changePurSpec(record);
									}, // endof itemdblclick
									cellkeydown : function(
											gridPcsStd, td,
											cellIndex, record, tr,
											rowIndex, e, eOpts) {
										// console_logs('record',
										// record);
										// if (e.getKey() == Ext.EventObject.ENTER) {
											

										// }

									}
								},// endof listeners
								columns : columns,
								
							});
					
					grid.on('edit', function(grid, data) {
						// console_logs('>>> data', data);
						// var field = data['field'];
						// if(field == 'sp_code') {
						// 	var rec = Ext.getCmp('recvPoAssyGrid1').getSelectionModel().getSelection()[0];
						// 	var value = data['value'];
						// 	var value_name = '';
						// 	switch(value) {
						// 		case 'R':
						// 		value_name = '원지';
						// 		break;
						// 		case 'O':
						// 		value_name = '원단';
						// 		break;
						// 		case 'K':
						// 		value_name = '부자재';
						// 		break;
						// 	}
						// 	rec.set('sp_code', value);
						// 	rec.set('sp_code_name', value_name);
						// }
						var rec = gm.me().AssemblyPartStore.data.items[0];
		    			//console_logs('tUtil.delListStore rec',rec);
		    			
		    			gMain.selPanel.rItemSpec=rec.get('item_name')+rec.get('description_src')+" "+rec.get('specification')+" "+ rec.get('bm_quan')+"EA";
						gm.me().refreshPrchInfoAR();
					})
					
			if (checkbox == true) {
				grid.getSelectionModel().on({
					selectionchange: function(sm, selections) {
						if(selections.length > 0) {
							console_logs('>> 구매규격 선택', selections);
							addPartRowAction.enable();
							removePartRowAction.enable();
						} else {
							addPartRowAction.disable();
							removePartRowAction.disable();
						}
					}
					
				});

			}
			
// 			var grid2 = Ext.create('Ext.grid.Panel',{
// 				id : 'recvPoAssyGrid2',
// 				store : gm.me().AssemblyPartStore2,
// 				title : '원단',
// 				border : true,
// 				resizable : true,
// 				scroll : false,
// 				multiSelect : true,
// 				collapsible : false,
// 				layout : 'fit',
// 				// forceFit: true,
// 				region : 'center',
// 				plugins : [ cellEditing2 ],
// 				dockedItems: [
// 			        {
// 			            dock: 'top',
// 			            xtype: 'toolbar',
// 			            cls: 'my-x-toolbar-default3',
// 			            items: [
// 			                    '-',
// 			 	   		    	saveAssymap,
// 			                    '->',
// //			                    calQuan,
// 			                    '-'
// 	      				        ]
// 				        },
// 				        {
// 							dock : 'top',
// 							xtype : 'toolbar',
// 							cls : 'my-x-toolbar-default3',
// 							items : [ '-', addPartRowAction, removePartRowAction ]
// 						}
// 			        ],
// 			    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{}): null,
// 				listeners : {
// 					itemdblclick : function(view,
// 							record, htmlItem,
// 							index, eventObject,
// 							opts) {

// 					}, // endof itemdblclick
// 					cellkeydown : function(
// 							gridPcsStd, td,
// 							cellIndex, record, tr,
// 							rowIndex, e, eOpts) {
// 						// console_logs('record',
// 						// record);
// 						// if (e.getKey() == Ext.EventObject.ENTER) {


// 						// }

// 					}
// 				},// endof listeners
// 				columns : columns
// 			});
	
// 			if (checkbox == true) {
// 			grid2.getSelectionModel().on({
// 			});
			
// 			}
			
// 			var grid3 = Ext.create('Ext.grid.Panel',{
// 				id : 'recvPoAssyGrid3',
// 				store : gm.me().AssemblyPartStore3,
// 				title : '부자재',
// 				border : true,
// 				resizable : true,
// 				scroll : false,
// 				multiSelect : true,
// 				collapsible : false,
// 				layout : 'fit',
// 				// forceFit: true,
// 				region : 'center',
// 				plugins : [ cellEditing3 ],
// 				dockedItems: [
// 			        {
// 			            dock: 'top',
// 			            xtype: 'toolbar',
// 			            cls: 'my-x-toolbar-default3',
// 			            items: [
// 			                    '-',
// 			 	   		    	saveAssymap,
// 			                    '->',
// //			                    calQuan,
// 			                    '-'
// 							        ]
// 				        },
// 				        {
// 							dock : 'top',
// 							xtype : 'toolbar',
// 							cls : 'my-x-toolbar-default3',
// 							items : [ '-', addPartRowAction, removePartRowAction ]
// 						}
// 			        ],
// 			    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{}): null,
// 				listeners : {
// 					itemdblclick : function(view,
// 							record, htmlItem,
// 							index, eventObject,
// 							opts) {
			
// 					}, // endof itemdblclick
// 					cellkeydown : function(
// 							gridPcsStd, td,
// 							cellIndex, record, tr,
// 							rowIndex, e, eOpts) {
// 						// console_logs('record',
// 						// record);
// 						if (e.getKey() == Ext.EventObject.ENTER) {
			
// 						}
			
// 					}
// 				},// endof listeners
// 				columns : columns
// 			});

			// if (checkbox == true) {
			// 	grid3.getSelectionModel().on({
			// 		selectionchange: function(sm, selections) {
			// 			if(selections) {
			// 				console_logs('>>>>grid3', selections);
			// 			} else {

			// 			}
			// 		}
			// 	});
			
			// }
			
			
			
	        var matTab = Ext.widget('tabpanel', {
	            layout: 'border',
	            title: '구매규격',
				border: false,
	            tabPosition: 'top',
	            layoutConfig: {
	                columns: 2,
	                rows: 1
	            }, 
	            dockedItems: [{
	            dock: 'top',
	            xtype: 'toolbar',
	            cls: 'my-x-toolbar-default4',
	            items: [
	 	   		        {
	                    	id: this.link + '-'+ 'grid-top-pqty'+'2',
	 	   		        	xtype:'tbtext',
	 	   		        	text:'칼 000 * 000 1EA/제품명/생산수량 : 0'
	 	   		        },{
						  id: this.link + '-'+ 'grid-top-item_spec',
		   		        	  xtype:'tbtext',
		   		        	  text:'[원지정보]'
		   		        }
	 	   		  
	 	   	    	
  				     ]
		        }],
	            items: [grid/*,grid2,grid3*/],
	            listeners: {
// 	                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
// //	                    if(gm.me().tabchangeHandler2!=null) {
// 	                        gm.me().tabchangeHandler2(tabPanel, newTab, oldTab, eOpts);
// //	                    }
// 	                }
	            }
	        });
			
			
			// tabPanel.add(matTab);
			tabPanel.insert(3, matTab);
					
					
				} else {// endof if(success..
					Ext.MessageBox.show({
						title : '연결 종료',
						msg : '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
						buttons : Ext.MessageBox.OK,
						// animateTarget: btn,
						scope : this,
						icon : Ext.MessageBox['ERROR'],
						fn : function() {

						}
					});
				}
			},
			scope : this
		});

		var formItems = [{
            xtype: 'fieldset',
            title: '단가정보',
            collapsible: false,
            width: '100%',
			style: 'padding:10px',
			layout: 'column',
            defaults: {
                width: '50%',
                // layout: {
                //     type: 'hbox'
                // }
            },
            items: [
            	{
                    fieldLabel: '수주금액',
                    name:'selling_price',
                    id:'selling_price',
                    xtype: 'numberfield',
                    fieldStyle: 'background-color: #FFFF99; background-image: none;',
                    value: 0,
                    editable: false,
                    listeners : {
//                    	change: function(field, value) {
//                    		sales_price1 = Ext.getCmp('source_price').getValue();
//							var sales_price	= gm.me().getInputJust('partline|source_price');
//							sales_price.setValue(sales_price1);
//                        }
                    }
                },
//                {
//                	items: [
//                		{
//		                    fieldLabel: '세액포함여부',
//		                    name:'tex_flag',
//		                    id:'tex_flag',
//		                    xtype: 'combo',
////		                    fieldStyle: 'background-color: white; background-image: none;',
//		                    store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'CONTAIN_FLAG'}),
//		                    displayField:   'codeName',
//					        valueField:     'systemCode',
//					        value: 'N',
//		                    listeners : {
//		                    		change: function(field, value) {
//			                    		reserved_varchar66 = Ext.getCmp('reserved_varchar6').getValue();
//										var reserved_varchar6	= gm.me().getInputJust('project|reserved_varchar6');
//										reserved_varchar6.setValue(reserved_varchar66);
//			                      	  
//			                        }
//		                    }
//                		}
//                        
//                	]
//                },
                {
                    fieldLabel: '세액포함여부',
                    name:'tex_flag',
                    id:'tex_flag',
					xtype: 'combo',
//                    fieldStyle: 'background-color: white; background-image: none;',
                    store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'CONTAIN_FLAG'}),
                    displayField:   'codeName',
			        valueField:     'systemCode',
			        value: 'N',
                    listeners : {
                    		change: function(field, value) {
								var reserved_varcharg	= gm.me().getInputJust('project|reserved_varcharg');
								reserved_varcharg.setValue(value);
	                      	  
	                        }
                    }
        		},
                {
                    fieldLabel: '제품단가',
                    name:'sales_price',
                    id:'sales_price',
                    xtype: 'numberfield',
                    fieldStyle: 'background-color: white; background-image: none;',
                    value: 0,
                    listeners : {
                    	change: function(field, value) {
                    		var tex_flag	= Ext.getCmp('tex_flag');
                    		var tex_value = tex_flag.getValue();
                    		// var sales_total_price	= Ext.getCmp('sales_total_price');
                    		// var tex_price	= Ext.getCmp('tex_price');
							var sales_price	= gm.me().getInputJust('partline|sales_price');
							
							if(tex_value=='N'){
								// tex_price.setValue((Number(value)*1.1)-value);
								// sales_total_price.setValue(Math.floor((Number(value)*1.1)));
								sales_price.setValue(value);
							}
                    	}
                    }
        		},
//         		{
//                     fieldLabel: '세액',
//                     name:'tex_price',
//                     id:'tex_price',
//                     xtype: 'numberfield',
// //                    fieldStyle: 'background-color: white; background-image: none;',
//                     value: 0,
//                     readOnly: true,
//                     listeners : {
//                     	change: function(field, value) {
                    				                      	  
//                         }
//                     }
//         		},{
//                     fieldLabel: '세액포함단가',
//                     name:'sales_total_price',
//                     id:'sales_total_price',
//                     xtype: 'numberfield',
//                     fieldStyle: 'background-color: white; background-image: none;',
//                     value: 0,
//                     listeners : {
//                     	change: function(field, value) {
//                     		var tex_flag	= Ext.getCmp('tex_flag');
//                     		var tex_value = tex_flag.getValue();
//                     		sales_price1 = Ext.getCmp('sales_price').getValue();
//                     		var sales_price	= Ext.getCmp('sales_price');
//                     		var tex_price	= Ext.getCmp('tex_price');
// 							var sales_price2	= gm.me().getInputJust('partline|sales_price');

							
//                     		if(tex_value=='Y'){
// 								tex_price.setValue(Number(value)-(Number(value)/1.1));
// 								sales_price.setValue((Number(value)/1.1));
// 								sales_price2.setValue((Number(value)/1.1));
// 							}
                    		
                    		
							
							
							
//                         }
//                     }
//         		},
                {
                    fieldLabel: '개발비총합',
                    name:'reserved_double1',
                    id:'dev_total_cost',
                    xtype: 'numberfield',
                    fieldStyle: 'background-color: #FFFF99; background-image: none;',
                    value: 0,
                    editable: false,
                    listeners : {
                    	change: function(field, value) {
//                    		reserved_double11 = Ext.getCmp('reserved_double1').getValue();
//							var reserved_double1	= gm.me().getInputJust('project|reserved_double1');
//							reserved_double11.setValue(reserved_double11);
                      	  
                        }
                    }
                },
                
                {
					//  items: [
					// 	 {
			                    fieldLabel: '물류비',//  project reserved_double2->reserved_varchar6
			                    name:'reserved_varchar6',
			                    id:'reserved_varchar6',
			                    xtype: 'textfield',
//			                    fieldStyle: 'background-color: white; background-image: none;',
//			                    value: 0,
			                    listeners : {
			                    	change: function(field, value) {
			                    		reserved_double22 = Ext.getCmp('reserved_varchar6').getValue();
										var reserved_double2	= gm.me().getInputJust('project|reserved_varchar6');
										reserved_double2.setValue(reserved_double22);
			                      	  
			                        }
			                    }
			                },{
			                    fieldLabel: '물류비포함여부',
			                    name:'reserved_varchar7',
								id:'reserved_varchar7',
			                    xtype: 'combo',
			                    store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'CONTAIN_FLAG'}),
			                    displayField:   'codeName',
						        valueField:     'systemCode',
						        value: 'N',
//			                    fieldStyle: 'background-color: white; background-image: none;',
			                    listeners : {
			                    	change: function(field, value) {
										var reserved_varchar7	= gm.me().getInputJust('project|reserved_varchar7');
										reserved_varchar7.setValue(value);
			                      	  
			                        }
			                    }
			        //         }
					//   ]
				}
                ,{
                    fieldLabel: '물류비 메모',
                    name:'reserved_varchar5',
                    id:'reserved_varchar5',
                    xtype: 'textarea',
                    fieldStyle: 'background-color: white; background-image: none;',
//                    value: 0,
                    listeners : {
                    	change: function(field, value) {
                    		reserved_varchar55 = Ext.getCmp('reserved_varchar5').getValue();
							var reserved_varchar5	= gm.me().getInputJust('project|reserved_varchar5');
							reserved_varchar5.setValue(reserved_varchar55);
                      	  
                        }
                    }
                }
            ]
		}];
		
		var cstColStore = Ext.create(
			'Rfx.store.ExtFieldColumnStore', {
				fields : [ {
					name : 'name'
				} ]
			});

		//단가관리
		cstColStore.load({
			params : {
				menuCode : 'SRO1_CST'
			},
			callback : function(records, operation, success) {
				if (success == true) {
					var o = gm.parseGridRecord(records, 'recvPoAssyGrid');
					var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
					// 소팅기준
					var sortBy = o['sortBy'];
					var tabPanel = Ext.getCmp(gm.geTabPanelId());
					var checkbox = true;
					
					Ext.each(
							columns,
							function(o, index) {
								o['sortable'] = false;

								switch (o['dataIndex']) {
//								case 'cost_type':
//									o['editor'] = {
//										allowBlank : false
//									};
//									break;
								case 'cost':
									o['style'] = 'text-align:right';
									o['align'] = 'right';
									o['editor'] = {
										xtype : 'numberfield',
										allowBlank : false,
										minValue : 0
									};
									break;
								case 'comment1':
								case 'tex_flag':
									o['editor'] = {
										allowBlank : true,
										xtype : 'combo',
										store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'CONTAIN_FLAG'}),
					                    displayField:   'codeName',
								        valueField:     'systemCode'
									};
								}
							});
					
					var cellEditing = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					
					var grid = Ext.create('Ext.grid.Panel',{
								id : 'costGrid',
								store : gm.me().CostStore,
								title : '단가관리',
								border : true,
								resizable : true,
								scroll : true,
								multiSelect : true,
								collapsible : false,
								layout : 'fit',
								// forceFit: true,
								region : 'center',
								plugins : [ cellEditing ],
								 
					            dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            cls: 'my-x-toolbar-default3',
					            items: [
					            	'-',
				 	   		    	saveCostMap,
									'->',
									this.buttonToolbar3
				  				     ]
						        },{
						            dock: 'top',
						            xtype: 'toolbar',
									cls: 'my-x-toolbar-default3',
						            items: formItems
							        }],
							    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{}): null,
								listeners : {
									itemdblclick : function(view,
											record, htmlItem,
											index, eventObject,
											opts) {

									}, // endof itemdblclick
									cellkeydown : function(
											gridPcsStd, td,
											cellIndex, record, tr,
											rowIndex, e, eOpts) {
										// console_logs('record',
										// record);
//										if (e.getKey() == Ext.EventObject.ENTER
//												&& record.get('pcs_name').length > 0
//												&& record.get('std_mh') >= 0) {
//											savePcsStd();
//
//										}

									}
								},// endof listeners
								columns : columns
							});
					
			if (checkbox == true) {
				grid.getSelectionModel().on({

				});

			}
			
//	        var costTab = Ext.widget('tabpanel', {
//	            layout: 'border',
//	            title: '단가관리',
//	            border: false,
//	            tabPosition: 'top',
//	            layoutConfig: {
//	                columns: 2,
//	                rows: 1
//	            }, 
//	            items: grid
//	        });
			
			
			
			tabPanel.add(grid);
					
					
				} else {// endof if(success..
					Ext.MessageBox.show({
						title : '연결 종료',
						msg : '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
						buttons : Ext.MessageBox.OK,
						// animateTarget: btn,
						scope : this,
						icon : Ext.MessageBox['ERROR'],
						fn : function() {

						}
					});
				}
			},
			scope : this
		});
		
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            // console_logs('tabpanel newTab', newTab);
            // console_logs('tabpanel newTab newTab.title', newTab.title);
        	
            switch(newTab.title) {
	            case '공정설계':
	            	gMain.selPanel.refreshProcess();
	            	break;
		        case '단가관리':
		        	
		        	gMain.selPanel.costmapRefresh();
	
		        	break;
		        case '구매규격':
		            
	 	   		    gMain.selPanel.refreshPrchInfoAR();
		        	break;
            }

            
        };
        
        // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==3) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        this.setRowClass(function(record, index) {
        	
        	// console_logs('record', record);
            var c = record.get('status');
            var is_stop_flag = record.get('reserved20');
            // console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                case 'S':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	if(is_stop_flag=='Y'){
                		return 'red-row';
                	}else{
                		return 'green-row';
                	}
                	
            }

        });
        
        
        this.createGrid(arr);
        
        // 작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '생산 요청',
			 tooltip: '생산 및 구매 요청',
			 disabled: true,
			 
			 handler: function() {
				 
				var select = gm.me().grid.getSelectionModel().getSelection()[0];
					ctr_flag = select.get('ctr_flag');
					if(ctr_flag != null && ctr_flag == 'Y') {
						Ext.Msg.alert('안내', '상시재고 제품입니다. 상시재고관리에서 진행해주세요.', function() {});
						return;
					}
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '생산 및 구매요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.requestAction.disable();
	            	        	
	            	        	gMain.selPanel.doRequest();
	            	        	gMain.selPanel.StoreLoadRecordSet();
	            	        }
			            },
			            // animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});

		// 상시재고로 변경하는 Action 생성
        this.changeStockAction = Ext.create('Ext.Action', {
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			text: '상시재고',
			tooltip: '상시재고로 변경',
			disabled: true,
			handler: function() {
				
				   Ext.MessageBox.show({
					   title:'확인',
					   msg: '상시재고 상태로 변경하시겠습니까?',
					   buttons: Ext.MessageBox.YESNO,
					   fn:  function(result) {
						   if(result=='yes') {
							   gm.me().changeStockHandler();
						   }
					   },
					   // animateTarget: 'mb4',
					   icon: Ext.MessageBox.QUESTION
				   });
			}
	   });
        // 버튼 추가.
		buttonToolbar.insert(4, this.changeStockAction);
		buttonToolbar.insert(4, '-');
        buttonToolbar.insert(6, this.requestAction);
		buttonToolbar.insert(6, '-');
        
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
        
        this.produceStopAction = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: '생산 중단',
			 tooltip: '생산 중단 요청',
			 disabled: true,
			 
			 handler: function() {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '생산 중단 요청 하시겠습니까?<br>생산완료된 제품은 ',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.produceStopFc();
	            	        }
			            },
			            // animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
        buttonToolbar.insert(4, this.produceStopAction);
        buttonToolbar.insert(4, '-');
        
        this.registCopyAction = Ext.create('Ext.Action', {
			 iconCls: 'af-copy',
			 text: '복사등록',
			 tooltip: '복사등록',
			 disabled: false,
			 
			 handler: function() {
				 Ext.MessageBox.show({
			            title:'확인',
			            msg: '해당 수주를 복사등록 하시겠습니까? ',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gm.me().refleshCopyForm();
	            	        }
			            },
			            // animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
		    		
			 }
		});
        
        buttonToolbar.insert(3, this.registCopyAction);
//        buttonToolbar.insert(3, '-');
        
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	if(this.crudMode=='EDIT') { // EDIT
	    		//console_logs('preCreateCallback', selections);
	    	} else {// CREATE,COPY
	    		this.copyCallback();

	    	}
        	var processGrid = Ext.getCmp('recvPoPcsGrid');
        	var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );
        	
        	
        	var recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid1');
        	// var recvPoAssyGrid2 = Ext.getCmp('recvPoAssyGrid2');
        	// var recvPoAssyGrid3 = Ext.getCmp('recvPoAssyGrid3');
        	
//        	gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(100);
            if (selections.length) {
            	var rec = selections[0];
            	
                // gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid');
				// //assymap의 child
            	
            	//console_logs('rec>>>>>>>>>>>>>>>>>>>>>>>',rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_BUYER_UID = rec.get('order_com_unique');
                gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code');
                gMain.selPanel.vSELECTED_STATUS = rec.get('status');
                
                gMain.selPanel.vSELECTED_BM_QUAN = rec.get('bm_quan');
                gMain.selPanel.vSELECTED_PAN_QTY = rec.get('reserved_double3');
                gMain.selPanel.vSELECTED_CHILD = rec.get('srcahd_uid');
                
                var status = rec.get('status');
                
//    			gMain.selPanel.prchHistory(rec.get('ac_uid'));
                
    			gMain.selPanel.recvDateStore.getProxy().setExtraParam('item_code', gMain.selPanel.vSELECTED_ITEM_CODE);
    			gMain.selPanel.recvDateStore.getProxy().setExtraParam('order_com_unique', gMain.selPanel.vSELECTED_BUYER_UID);
				gMain.selPanel.recvDateStore.load();
				
				this.changeStockAction.enable();
                
                gUtil.enable(gMain.selPanel.editAction);
    			if(status=='BM'||status=='CR') {
    				gUtil.enable(gMain.selPanel.removeAction);
//    				gUtil.enable(gMain.selPanel.editAction);    
    				gUtil.enable(gMain.selPanel.requestAction);
    			} else {
    				gUtil.disable(gMain.selPanel.removeAction);
//    				gUtil.disable(gMain.selPanel.editAction);   
    				gUtil.disable(gMain.selPanel.requestAction);
    			}
    			
    			if(status=='CR'||status=='P'||status=='N') {
    				gUtil.enable(gMain.selPanel.recvCancleAction);
    			} else {
    				gUtil.disable(gMain.selPanel.recvCancleAction);
    			}
    			
    			if(status=='S'||status=='W'||status=='N'||status=='Y') {
    				gUtil.enable(gMain.selPanel.produceStopAction);
    			} else {
    				gUtil.disable(gMain.selPanel.produceStopAction);
    			}
    			
    			
    			//console_logs('selections ac_uid',gMain.selPanel.vSELECTED_CHILD);
    			//console_logs('selections srcahd_uid',gMain.selPanel.vSELECTED_AC_UID);
    			
    			gMain.selPanel.CostStore.removeAll();
    			gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
    			gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
				gMain.selPanel.CostStore.load();
				
				gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
				gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
				gm.me().AssemblyPartStore.getProxy().setExtraParam('groupBy', 'a.unique_id');
				gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code_list', 'R,O,K');
				gm.me().AssemblyPartStore.load();
                
                
    			// mainmenu.disable();
                gMain.selPanel.refreshProcess();
 	   		    gMain.selPanel.refreshPrchInfoAR();
 	   		    gMain.selPanel.costmapRefresh();
 	   		    
 	        	gMain.selPanel.vPKGQTY= rec.get('reserved15');
 	        	gMain.selPanel.calcCatonuseQty(gMain.selPanel.vPKGQTY);
 	        	
 	        	var fullYear = gUtil.getFullYear() + '';
		        var month = gUtil.getMonth() + '';
		        if (month.length == 1) {
		            month = '0' + month;
		        }
		        var CurDate = fullYear+ month;
		        
		        
 	        	gMain.selPanel.catonBuyStoreMM.getProxy().setExtraParam('unique_id', rec.get('reserved_number1'));
 	        	gMain.selPanel.catonBuyStoreMM.getProxy().setExtraParam('parent_uid_assymap', CurDate);
 	            gMain.selPanel.catonBuyStoreMM.load(function(records) {
 	            	// if(gMain.selPanel.catonBuyStoreMM.data.length==1){
					if(records.length==1){
 	 	            	var catonrec=records[0];
 	 	            	gMain.selPanel.vPKGQTY= rec.get('reserved15');
 	 	            	gMain.selPanel.calcCatonuseQty(gMain.selPanel.vPKGQTY);
 	 	            	
 	 	            	var stock_useful_qty	= gm.me().getInputJust('partline|stock_useful_qty');
						var caton_qty	= gm.me().getInputJust('partline|caton_qty');
						console_logs('getInputTarget caton_qty', catonrec);
 	 	            	caton_qty.setValue(catonrec.get('useful_qty'));
 	 	            	stock_useful_qty.setValue(catonrec.get('total_useful_qty'));
 	            	}

				 });
				 console_logs('>>>recrecrec', rec);
				var bs_flag = rec.get('bs_flag');
				console_logs('>>>bs_flag111', bs_flag);
				if(bs_flag == null || bs_flag.length < 1) {
					bs_flag = 'N';
				}
				console_logs('>>>bs_flag', bs_flag);
				var flag_ko = '비포함';
				switch(bs_flag) {
					case 'Y':
						flag_ko = '포함';
					break;
					default:
						flag_ko = '비포함';
					break;
				}
				console_logs('>>>select_flag', flag_ko);
				Ext.getCmp('tex_flag').setValue(bs_flag);
				this.buttonToolbar3.items.items[1].update('부가세 여부 : ' + flag_ko);
				var route_code = rec.get('route_code');
				Ext.getCmp(gm.me().link + '-'+ 'grid-top-rf-template').setText(route_code);
				// rfRouteStore
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = 200;
                gMain.selPanel.vSELECTED_CHILD = -1;
                gMain.selPanel.vSELECTED_AC_UID = -1;
                gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', -1);
    			gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', -1);
                gMain.selPanel.CostStore.load();
            	gMain.selPanel.requestAction.disable();
				mainmenu.enable();

				this.changeStockAction.disable();
				
				this.buttonToolbar3.items.items[1].update('부가세 여부 : ');

				Ext.getCmp(gm.me().link + '-'+ 'grid-top-rf-template').setText('');
            }
            
        	processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
        	processGrid.getStore().load();
        	gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);
//        	gm.me().defaultPartLoad();

        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
		this.preCreateCallback = function() {
			//console_logs('this.crudMode;', this.crudMode);

	    	if(this.crudMode=='EDIT') { // EDIT
	    		gm.me().doCreateCore();
	    		return true;
	    	} else {// CREATE,COPY
	    		
	    		var target_pj_code = this.getInputTarget('pj_code');
	        	var pj_code = target_pj_code.getValue();
	        	
	        	// var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
	        	// console_log=('pj_code', gMain.selPanel.vSELECTED_PJ_CODE);
	        	console_log('pj_code', target_pj_code.getValue());
	        	
	        	var crudMode = this.crudMode;
	        	Ext.Ajax.request({
	    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
	    			params:{  				pj_code : pj_code  			},
	    			success : function(result, request) {	

	    				// console_logs('-------------------->success', 'success
						// goto doCreate()');
	    				if(result.responseText+''=='0'){
	    					
	                		if(crudMode=='COPY'){// 공정복사
	                			Ext.MessageBox.show({
	        			            title:'확인',
	        			            msg: '복사등록을 위한 공정복사를 진행하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
	        			            buttons: Ext.MessageBox.YESNO,
	        			            fn:  function(result) {
	        	            	        if(result=='yes') {
	        	            	        	Ext.Msg.alert('안내', '복사등록을 위한 공정복사를 진행합니다.',  function() {
	        									Ext.Ajax.request({
	        										url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
	        										params:{
	        											fromUid: gMain.selPanel.vSELECTED_UNIQUE_ID ,
	        											toUid: vCUR_USER_UID*(100)
	        										},
	        										
	        										success : function(result, request) { 
	        											gm.me().doCreateCore();
	        											
	        										},// endofsuccess
	        										failure: function(a,b,c,d){console_logs('-----------------a', a), console_log('b', b), console_log('c', c),console_log('d', d)}
	        									});// endofajax
	        								});
	        	            	        }
	        			            },
	        			            // animateTarget: 'mb4',
	        			            icon: Ext.MessageBox.QUESTION
	        			        });
								
	                		} else {
	                			gm.me().doCreateCore();
	                		}
	    				} else {// end of if
	    					failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {})
	    				}
				
	    			},// Ajax success
	    			// failure: function(a,b,c,d){console_logs('a', a),
					// console_log('b', b), console_log('c', c),console_log('d',
					// d)}
	    			 
	    			// failure:Ext.Msg.alert('안내', '알수없는 오류입니다. </br>관리자에게
					// 문의하세요.', function() {})
	    		}); 
	        	//console_logs('preCreateCallback', 'return false');
	           	return false;    		
	    	}

		}
			        
        
// var addPcsStep = Ext.create('Ext.Action', {
// iconCls: 'af-plus-circle',
// text: '추가',
// tooltip: '공정 추가하기',
// //toggleGroup: 'toolbarcmd',
// handler: function() {
// }
// });
		this.rfRouteStore.load(function(records) {
			// console_logs('>>>>>> route record', records);
			for(var i=0; i<records.length; i++) {
				var record = records[i];
					route_code = record.get('system_code');
					route_name = record.get('code_name_kr');

					o = {text: route_name, val:route_code, handler:gm.me().rfItemClick};
					gm.me().rfJson.push(o);
			}
		});

		var calcNumber = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '수량계산',
			 tooltip: '수량 계산하기',
			 handler: function() {
				 if(gMain.selPanel.vSELECTED_UNIQUE_ID>200){
					 
				 }else{
					 gMain.selPanel.vSELECTED_UNIQUE_ID=200;
				 }
				 
				 var gridPcsStd = Ext.getCmp('recvPoPcsGrid');
			    	var modifiend =[];
			    	var target_bm_quan = gm.me().getInputTarget('bm_quan');
	           		
			    	var bm_quan = target_bm_quan.getValue();
			    	if(gMain.selPanel.rQty>gMain.selPanel.oQty||gMain.selPanel.rQty==gMain.selPanel.oQty||gMain.selPanel.rQty>0){
			    		bm_quan=gMain.selPanel.rQty;
			    	}else{
			    		bm_quan=gMain.selPanel.oQty;
					}
					console_logs('>>> bm_quan', bm_quan);
			    	
	           		
	           		var target_reserved_double3 = gm.me().getInputTarget('reserved_double3');
	           		var reserved_double3 = target_reserved_double3.getValue();
	           		
			    	
			    	
//			    	if(gMain.selPanel.vSELECTED_BM_QUAN>1){
//			    	  var prevQty = Number(gMain.selPanel.vSELECTED_BM_QUAN);  
//			    	}
//			    	else{
			    		var prevQty = Number(bm_quan);
//			    	}
			    	 // var tomCheck = false;
			    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
			    	  {
			    	        var record = gridPcsStd.store.data.items [i];
	    	           		var pcs_no =  record.get('pcs_no');
	    	           		var pcs_code = record.get('pcs_code');
	    	           		var serial_no = Number(pcs_no) / 10;
//	    	           		var plan_qty = record.get('plan_qty');
	    	           		var plan_qty = bm_quan;
			    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
			    	           	//console_logs(record);
			    	           	var pcs_code = record.get('pcs_code').toUpperCase();
			    	           	if(gMain.checkPcsName(pcs_code)) {
			    	           		
			    	           		var plan_date = record.get('plan_date');
			    	           		var yyyymmdd ='';
			    	           		if(plan_date!=null) {
			    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
			    	           		}
			    	           		
			    	           		
			    					 switch(pcs_code){
			    					 case 'CRC':
			    					 case 'CTP':
			    					 case 'EMB':
			    					 case 'HAP':
			    					 case 'LEF':
			    					 case 'LMC':
			    					 case 'PRN':
			    					 case 'TOM':
			    						 plan_qty = bm_quan;
			    						 break;
			    					 case 'ADH':
			    					 case 'ETC':
			    					 case 'PKG':
			    					 case 'STC':
			    					 case 'TRY':
			    						 plan_qty = Math.round(bm_quan*reserved_double3);
			    						 
			    						 break;
			    				 }
			    					 
		    	           			
			    	           		
			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																				// pcs_name...
			    		           	obj['serial_no'] = serial_no;
			    		           	obj['pcs_code'] = record.get('pcs_code');
			    		           	obj['pcs_name'] = record.get('pcs_name');

			    		           	obj['description'] = record.get('description');
			    		           	obj['comment'] = record.get('comment');
			    		           	obj['machine_uid'] = record.get('machine_uid');
			    		           	obj['seller_uid'] = record.get('seller_uid');

			    		           	obj['std_mh'] = record.get('std_mh');
			    		           	obj['plan_date'] = yyyymmdd;
			    		           	obj['plan_qty'] = plan_qty;
			    		           	
			    		           	modifiend.push(obj);
			    		           	
			    	        }
			    	        prevQty = plan_qty;
			    	  }
			    	  
			    	  if(modifiend.length>0) {
			    		
			    		  //console_logs('modifiend>>>>>>>',modifiend);
			    		  var str =  Ext.encode(modifiend);
			    		  //console_logs(str);
			    		    Ext.Ajax.request({
			    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
			    				params:{
			    					modifyIno: str,
			    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
			    				},
			    				success : function(result, request) {   
			    					gridPcsStd.store.load(function() {
			    						
			    					});
			    				}
			    		    });
			    	  }
			    	  
			 }
			});
		
		var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '공정저장',
			 tooltip: '공정설계 내용 저장',
			 // toggleGroup: 'toolbarcmd',
			 handler: this.savePcsstdHandler
			});
		var saveCostMap = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '저장',
			 tooltip: '단가정보 저장',
			 // toggleGroup: 'toolbarcmd',
			 handler: this.saveCostmapHandler
			});

		
		
        // 공정설계 gridPcsStd Tab 추가.
		gMain.addTabGridPanel('공정설계', 'EPC1', {  
				pageSize: 100,
				model: 'Rfx.model.PcsStd',
		        dockedItems: [
			        
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default4',
			            items: [
			                    {
			                    	id: this.link + '-'+ 'grid-top-spoQty',
			 	   		        	xtype:'tbtext',
			 	   		        	text:'생산수량: 50000'
			 	   		        },
				 	   		    {
				    				id: this.link + '-'+ 'grid-top-paperQty',
				 	   		        xtype:'tbtext',
				 	   		        text:'원지수량: 50000'
				 	   		    },
			      				{
			    					  id: this.link + '-'+ 'grid-top-bladeinfo',
			 	   		        	  xtype:'tbtext',
			 	   		        	  text:'칼 000 * 000 1EA'
			 	   		        	 // style:'text-align:right;',
			 	   		        	 // width: 70,
			 	   		        }
	      				     ]
				        }
			        
			        ,
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			                    '-',
			 	   		    	savePcsStep
			    				 ,
// addPcsStep,
// '-',

			                    '->',
			                    calcNumber,
			                    '-',
			                    {
			                    	id: 'splitbuttonTemplate' + this.link,
			                    	iconCls: 'fa-bitbucket_14_0_5395c4_none',
		    						xtype: 'splitbutton',
		    					   	text: '템플리트',
		    					   	selectedMennu: -1,
		    					   	tooltip: '표준공정 템플리트',
		    					   	handler: function() {}, // handle a click on
															// the button itself
		    					   	menu: new Ext.menu.Menu({
		    					   		id: 'recvPoview' + '-mainmenu'
		    					   	})
			    				 }
	      				        ]
				        },{
							dock: 'top',
							xtype: 'toolbar',
							cls: 'my-x-toolbar-default3',
							items: [
								'-',
								{
			                    	id: this.link + '-'+ 'grid-top-rf-template',
			 	   		        	xtype:'tbtext',
			 	   		        	text:''
			 	   		        },
								'->',
									{
										id: 'rfTemplate' + this.link,
										iconCls: 'fa-bitbucket_14_0_5395c4_none',
										xtype: 'splitbutton',
										text: 'RF템플리트',
										selectedMennu: -1,
										width: 400,
										tooltip: 'RF 경로 템플리트',
										handler: function() {
										// gm.me().getRfRouteTemp();
										}, // handle a click on
											// the button itself
										menu: this.rfJson,
										// menu: new Ext.menu.Menu({
										// 	id: 'recvPoRfview' + '-mainmenu'
										// })
									 }
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
	            	// console_logs(rec);
	            	gm.me().selectPcsRecord = rec;
	            	
	            	pcs_code = rec.get('pcs_code');
	            	
	                //maker store relod
	                gm.supastPcsStore.removeAll();
	                gm.supastPcsStore.getProxy().setExtraParam('pcs_code', pcs_code);
	                gm.supastPcsStore.load();
	                
	                gm.mchnPcsStore.removeAll();
	                gm.mchnPcsStore.getProxy().setExtraParam('pcs_code', pcs_code);
	                gm.mchnPcsStore.load();

	            	
	            } else {
	            	
	            }
	        },
	        'recvPoPcsGrid'// toolbar
		);

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        
        this.storeLoad = function() {
			var start_time = new Date();
			console.log('>>>> start_time >>>> ',start_time);
			this.store.getProxy().setTimeout(60000);
            this.store.load(function(records) {
            	//console_logs('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',records);
				
				gMain.selPanel.StoreLoadRecordSet(records);
                
                var processGrid = Ext.getCmp('recvPoPcsGrid'/* gMain.getGridId() */);
                
            	if(gMain.selPanel.vSELECTED_UNIQUE_ID==null){
            		gMain.selPanel.vSELECTED_UNIQUE_ID = 200;
                    processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
                    processGrid.getStore().load();
                	
                    
                    var costGrid = Ext.getCmp('costGrid'/* gMain.getGridId() */);
                    costGrid.getStore().getProxy().setExtraParam('srcahd_uid',  -1);
                    costGrid.getStore().getProxy().setExtraParam('ac_uid', -1);
                    costGrid.getStore().load();
                    
                    
                	gm.me().loadPrchPart4create();
                	
                	
                	gm.me().pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
                	gm.me().pcsTemplateStore.load( function(records) {
            			//console_logs('pcsTemplateStore', records);
            			
            			var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );
            			
            			for(var i=0; i<records.length; i++ ) {	
            				var o = records[i];
            				var o1 = {
            						text: o.get('systemCode') + ' - ' + o.get('codeName'),
            						dataIndex: o.get('unique_id'),
            						handler: function(o) {
            							var selectedTemplate = this['dataIndex'];
            							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
            							
            							oTemplate.setText(this['text']);
            							oTemplate['selectedTemplate'] = this['dataIndex'];
            							
            							//console_logs('menu this', selectedTemplate);
            							
            						    Ext.Ajax.request({
            								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
            								params:{
            									fromUid: selectedTemplate ,
            									toUid: gMain.selPanel.vSELECTED_UNIQUE_ID
            								},
            								
            								success : function(result, request) { 
            							          // gMain.selPanel.vSELECTED_UNIQUE_ID =
            										// vCUR_USER_UID*(100);
            							          var processGrid = Ext.getCmp('recvPoPcsGrid'/* gMain.getGridId() */);
            							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
            																																			// UID로
            																																			// 임시생성
            							          processGrid.getStore().load();
            									
            								},// endofsuccess
            								failure: extjsUtil.failureMessage
            							});// endofajax
            							
            						}
            				}
            				mainmenu.add(o1);

            			}
            			
					});
					
            	}else{
            		gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
        			 gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
                    gMain.selPanel.CostStore.load();
                    
                    gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);
                    
                     processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
                	 processGrid.getStore().load();
				}
				var end_time = new Date();
				console.log('>>>> end_time',end_time);
				var elapsedTime = end_time - start_time;
				console.log('>>>> elapsedTime(ms)',elapsedTime);
			  });  		
		};
		
		

        this.storeLoad();
        this.store.on('load',function (store, records, successful, eOpts ){
			gMain.selPanel.StoreLoadRecordSet(records);
			
       });
        

    },
    
    
    selectPcsRecord: null,
    items : [],
    computeProduceQty: function(cur) {
    	
    	
		// console_logs('computeProduceQty cur', cur);
		var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
		var target_bm_quan = this.getInputTarget('bm_quan');
		
		
		var val = cur - target_stock_qty_useful.getValue();
//		 console_logs('cur - target_stock_qty_useful.getValue() val', val);
//		 console_logs('target_bm_quan', target_bm_quan);
//		 console_logs('target_quan', target_quan);
		if(val<0) {
			val = 0;
		}
		target_bm_quan.setValue(val);
		//console_logs('target_bm_quan', target_bm_quan);
    },

    refreshBladeInfo: function() {
		var val = gMain.getBladeInfo();
		var target = this.getInputTarget('blade_size_info');
		target.setValue(val);
		
    	// 칼날사이즈
    	var target_reserved_varcharb = this.getInputTarget('reserved_varcharb');
    	var reserved_varcharb = target_reserved_varcharb.getValue();
    	//console_logs('reserved_varcharb', reserved_varcharb);
    	// 원지
    	reserved_varcharb = reserved_varcharb.replace('X','*');
    	var reserved_varcharb_arr = reserved_varcharb.split('*');
    	console_log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',reserved_varcharb);
    	var target_comment1 = this.getInputTarget('comment', '1');
    	var comment1 = target_comment1.getValue();
    	var target_remark1 = this.getInputTarget('remark', '1');
    	var remark1 = target_remark1.getValue();
    	target_remark1.setValue(reserved_varcharb_arr[1]*1+15);
    	target_comment1.setValue(reserved_varcharb_arr[0]*1+20);
    	// 원단
    	var target_comment2 = this.getInputTarget('comment', '2');
    	var comment2 = target_comment2.getValue();
    	var target_remark2 = this.getInputTarget('remark', '2');
    	var remark2 = target_remark2.getValue();
    	target_comment2.setValue(reserved_varcharb_arr[1]*1+15);
    	target_remark2.setValue(reserved_varcharb_arr[0]*1+10);
    },
    
    refreshReqBom: function() {

    	// 판걸이수량
    	var target_reserved_double3 = this.getInputTarget('reserved_double3');
    	var reserved_double3 = target_reserved_double3.getValue();
    	// 수주수량
    	var target_bm_quan = this.getInputTarget('bm_quan');
    	var bm_quan = target_bm_quan.getValue();
    	// 원지구매수량
    	var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(bm_quan/reserved_double3);
		// 원단구매수량
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(bm_quan/reserved_double3);
    	
    },
    
    refreshBladeInfoAll: function() {
    	var val1 = gMain.getBladeInfoAll();
    	var target1 = this.getInputTarget('blade_size_info1');
    	target1.setValue(val1);
    },
    // 원지/원단 수량 설정
    refreshBmquan: function(cur) {
		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(cur);
		
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(cur);
		
		var target_prch_his = this.getInputTarget('prch_history');
		target_prch_his.setValue();
    },
    refreshProcess: function() {
    	
		var target_bm_quan = this.getInputTarget('bm_quan');
		var bm_quan = target_bm_quan.getValue();
		
		var o = Ext.getCmp(	this.link + '-'+ 'grid-top-spoQty' ).setText('생산수량: ' + bm_quan);
		
    	
//		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
//		var bm_quan1 = target_bm_quan1.getValue();
		Ext.getCmp(	this.link + '-'+ 'grid-top-paperQty' ).setText('원지수량: ' + gm.me().rQty);

		
		var val = gMain.getBladeInfo();
		Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo' ).setText(val);
		

    },
    refreshPrchInfoAR: function() {
    	
    	var val = gMain.getBladeInfo();
//		Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo'+'2' ).setText(val);
		
		var target_item_name = this.getInputTarget('item_name');
		var item_name = target_item_name.getValue();
//		Ext.getCmp(this.link + '-'+ 'grid-top-item_name'+'2').setText(item_name);
		
		var target_bm_quan = this.getInputTarget('bm_quan');
		var bm_quan = target_bm_quan.getValue();
		Ext.getCmp(	this.link + '-'+ 'grid-top-pqty'+'2').setText(val+'/'+item_name+'/'+' 생산수량: ' +bm_quan);
		
		Ext.getCmp(this.link + '-'+ 'grid-top-item_spec').setText('['+gMain.selPanel.rItemSpec+']');
		

    },
    // 판걸이 수량이 변경된 handler
    handlerChangePanQty: function() {
    	// console_logs('handlerChangePanQty', 'in');
		var target_bm_quan = this.getInputTarget('bm_quan');
		var target_reserved_double3 = this.getInputTarget('reserved_double3');
		var target_reserved_double4 = this.getInputTarget('reserved_double4');
		
		var qty = Number(target_bm_quan.getValue()) / Number(target_reserved_double3.getValue());
		// console_logs('qty', qty);
		target_reserved_double4.setValue(qty);
		
// var val = gMain.getBladeInfo();
// var target = this.getInputTarget('blade_size_info');
// target.setValue(val);

		this.refreshBladeInfo();
		this.refreshBladeInfoAll();
		
// target_reserved_varcharc.setValue(target_reserved_double3.getValue()+'ea');
    },
    
    
    
    // 구매/제작요청
    doRequest: function() {
    	
    	
// var target_reserved_double3 = this.getInputTarget('unique_id');
// var assymapUid = target_reserved_double3.getValue()
//    	
    	//console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
    	
    	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
    	var assymapUid = this.vSELECTED_RECORD.get('unique_uid');
    	//생산요청 검증
    	Ext.Ajax.request({
  			url: CONTEXT_PATH + '/index/process.do?method=produceReqVerify',
  			params:{
  				assymapUid: assymapUid,
				ac_uid: ac_uid
  			},
  			
  			success : function(result, request) { 
  				//console_logs('result.responseText', result.responseText);
  				//console_logs('result', result);
  				//console_logs('request', request);
  				if(result.responseText=='0'){
  					Ext.Ajax.request({
  	  					url: CONTEXT_PATH + '/index/process.do?method=addRequest',
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
  				}else{
  					Ext.Msg.alert('안내', '이미 생산요청된 수주입니다.', function() {});
  				}
  			    
  			    
  			},//endofsuccess
  			failure: extjsUtil.failureMessage
  		});//endofajax

    },
    
    preCreateCallback: function() {
    	
    	//console_logs('crudMode', this.crudMode);
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
                   	projectmold.save({
                		success : function(result, request) {		                			
                			gm.me().doCreateCore();

                		}// success
                	 });// save
    				console_log('requested ajax...');
    				this.preCreateCallback = function() {
    					gm.me().doCreateCore();
    					return true;
    				};
    			},// Ajax success
    			// failure: extjsUtil.failureMessage
    			 failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {
     				this.preCreateCallback = function() {
     					gm.me().doCreateCore();
    					return true;
    				};
    			 })
    		}); 
           	
           	return false;    		
    	}
    	

    },
    replaceZero: function(o) {
    	if(o.substr(0,1)=='0'){
    		
    		return o.replace('0','');
    	}else{
    		return o;
    	}
    	
    },
    replaceNumberType: function(o) {
    	//console_logs('replaceNumberType',o.length);
    	switch(o.length){
    	
    		case 4 :
    			return o = o.substr(0,1)+','+o.substr(1,4);
    			break;
    		case 5 :
    			return o = o.substr(0,2)+','+o.substr(2,5);
    			break;
    		case 6 :
    			return o = o.substr(0,3)+','+o.substr(3,6);
    			break;
    		case 7 :
    			return o = o.substr(0,1)+','+o.substr(1,4)+','+o.substr(4,7);
    			break;
    		default :
    			return o;
    		
    	}

    	
    },
    // 구매내역
    prchHistory: function(ac_uid) {
    	//console_logs('ac_uid',ac_uid);
    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/schdule.do?method=getPrchHistory',
			params:{
				ac_uid: ac_uid
			},
			
			success : function(result, request) { 
		
				var result = result.responseText;
				//console_logs('result:', result);
				 var jsonData = Ext.JSON.decode(result);
				 
				 var datas = jsonData['datas'];
				 var mtrlInfo = '';
				for(var i=0; i<datas.length; i++) {
					 switch(datas[i].standard_flag){
					 	case 'R' :
					 		if(datas[i].item_name!=''){
					 		mtrlInfo = mtrlInfo+'원지: '+gMain.selPanel.replaceZero(datas[i].item_name)+ 
					 		gMain.selPanel.replaceNumberType(gMain.selPanel.replaceZero(datas[i].description))+' '+ 
					 		gMain.selPanel.replaceNumberType(gMain.selPanel.replaceZero(datas[i].comment))+'X'+ 
					 		gMain.selPanel.replaceNumberType(gMain.selPanel.replaceZero(datas[i].remark))+
					 		' 수량: '+gMain.selPanel.replaceNumberType(datas[i].bm_quan.replace('.000',''))+'\n\n';
					 		}
					 	break;
					 	
					 	case 'O' :
					 		if(datas[i].item_name!=''){
					 		mtrlInfo = mtrlInfo+'원단: '+datas[i].item_name+' '+
					 		gMain.selPanel.replaceNumberType(datas[i].remark)+'X'+
					 		gMain.selPanel.replaceNumberType(datas[i].comment)+
					 		' 수량: '+gMain.selPanel.replaceNumberType(datas[i].bm_quan.replace('.000',''))+'\n\n';
					 		}
					 	break;
					 	
					 	case 'K' :
					 		if(datas[i].item_name!=''){
					 			
					 		mtrlInfo = mtrlInfo+'부자재: '+datas[i].item_name+' 규격: '+datas[i].specification+' 수량: '+gMain.selPanel.replaceNumberType(datas[i].bm_quan.replace('.000',''))+'\n\n';
					 		}
					 	break;
					 	}
					 	
				 }
				if(mtrlInfo.length>0){
//					gm.me().prchHistoryIn(mtrlInfo);
//					console_logs('prchHistory>>>>>>>>>>',mtrlInfo);
				}
				
			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax

    },
    prchHistoryIn: function(mtrlInfo) {
    	var target_prch_history = this.getInputTarget('prch_history');
	 	target_prch_history.setValue(mtrlInfo);
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
    produceStopFc: function() {
    	
    	var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
    	var status = gMain.selPanel.vSELECTED_STATUS;
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=produceStop',
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
    recvDateStore: Ext.create('Mplm.store.RecvDateStore'),
    StoreLoadRecordSet: function(records){
       	for(var i=0; records!=null && i<records.length; i++) {
    		var rec = records[i];
    		var class_code = rec.get("class_code");
    		var unit_code = rec.get("unit_code");
    		var item_name_r1 = rec.get('item_name_r1'); 
    		var item_name_r2 = rec.get('item_name_r2');
    		var item_name_u = rec.get('item_name_u');

    		var specification_r1 = rec.get('specification_r1');
    		var specification_r2 = rec.get('specification_r2');
    		var specification_u = rec.get('specification_u');
    		
    		var description_r1 = rec.get('description_r1');
    		var description_r2 = rec.get('description_r2');
    		var description_u = rec.get('description_u');
    		
    		var comment_r1 = rec.get('comment_r1');
    		var comment_r2 = rec.get('comment_r2');
    		var comment_u = rec.get('comment_u');

    		var remark_r1 = rec.get('remark_r1');
    		var remark_r2 = rec.get('remark_r2');
    		var remark_u = rec.get('remark_u');
    		
    		var bm_quan_r1 = rec.get('bm_quan_r1');
    		var bm_quan_r2 = rec.get('bm_quan_r2');
    		var bm_quan_u = rec.get('bm_quan_u');

    		var request_comment1 = rec.get('request_comment1');
    		var request_comment2 = rec.get('request_comment2');
    		var delivery_info = rec.get('delivery_info');
    		var reserved_varchare = rec.get('reserved_varchare');
    		var order_com_unique = rec.get('order_com_unique');
    		
    		var pm_uid=rec.get('pm_uid');
    		var req_info1=rec.get('req_info1');
    		var req_info2=rec.get('req_info2');
    		rec.set('unit_code', unit_code);
    		rec.set('item_name|1', item_name_r1);
    		rec.set('item_name|2', item_name_r2);
    		rec.set('item_name|3', item_name_u);
    		
    		rec.set('specification|1', specification_r1);
    		rec.set('specification|2', specification_r2);
    		rec.set('specification|3', specification_u);
    		
    		rec.set('description|1', description_r1.replace(/,/gi,""));
    		rec.set('description|2', description_r2);
    		rec.set('description|3', description_u);
    		
    		rec.set('comment|1', comment_r1.replace(/,/gi,""));
    		rec.set('comment|2', comment_r2.replace(/,/gi,""));
    		rec.set('comment|3', comment_u);
    		
    		rec.set('remark|1', remark_r1.replace(/,/gi,""));
    		rec.set('remark|2', remark_r2.replace(/,/gi,""));
    		rec.set('remark|3', remark_u);
    		
    		rec.set('bm_quan|1', bm_quan_r1);
    		rec.set('bm_quan|2', bm_quan_r2);
    		rec.set('bm_quan|3', bm_quan_u);
    		
    		rec.set('req_info|1', req_info1);
    		rec.set('req_info|2', req_info2);
    		
    		rec.set('request_comment|1', request_comment1);
    		rec.set('request_comment|2', request_comment2);
    		
    		rec.set('delivery_info', delivery_info);
    		rec.set('reserved_varchare', reserved_varchare);
    		rec.set('pm_uid', pm_uid);
    		rec.set('order_com_unique', order_com_unique);
    		
    		rec.set('class_code', class_code);
    		
    		rec.set('reserved_number2', rec.get('reserved_number2'));
//    		 console_logs('rec', rec);
//    		 console_logs('records', records);
    	}
    },
    savePcsstdHandler: function() {
		 var gridPcsStd = Ext.getCmp('recvPoPcsGrid');
		 // console_logs('gridPcsStd', gridPcsStd);
		 
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan');
	    	
	    	  var prevQty = Number(target_bm_quan.getValue());
	    	  // var tomCheck = false;
	    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
	    	  {
	    	        var record = gridPcsStd.store.data.items [i];
	           		var pcs_no =  record.get('pcs_no');
	           		var pcs_code = record.get('pcs_code');
	           		var serial_no = Number(pcs_no) / 10;
	           		var plan_qty = record.get('plan_qty');
	           		
//	    	        if (record.dirty) {
	    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	           	//console_logs(record);
	    	           	var pcs_code = record.get('pcs_code').toUpperCase();
	    	           	var pcs_name = record.get('pcs_name');
	    	           	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	           		var plan_date = record.get('plan_date');
	    	           		var yyyymmdd ='';
	    	           		if(plan_date!=null) {
	    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
	    	           		}

	    	           		if(plan_qty==0) {
	    	           			plan_qty = prevQty;
	    	           		}
	    	           		
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																		// pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	obj['pcs_code'] = record.get('pcs_code');
	    		           	obj['pcs_name'] = record.get('pcs_name');

	    		           	obj['description'] = record.get('description');
	    		           	obj['comment'] = record.get('comment');
	    		           	obj['machine_uid'] = record.get('machine_uid');
	    		           	obj['seller_uid'] = record.get('seller_uid');

	    		           	obj['std_mh'] = record.get('std_mh');
	    		           	obj['plan_date'] = yyyymmdd;
	    		           	obj['plan_qty'] = plan_qty;
	    		           	
	    		           	modifiend.push(obj);
	    	           	} else {
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																		// pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	
	    		           	obj['pcs_code'] = '';
	    		           	obj['pcs_name'] = '';

	    		           	obj['description'] = '';
	    		           	obj['comment'] = '';
	    		           	obj['machine_uid'] = '-1';
	    		           	obj['seller_uid'] = '-1';

	    		           	obj['std_mh'] = '0';
	    		           	obj['plan_date'] = '';
	    		           	obj['plan_qty'] = '0';
	    		           	modifiend.push(obj);
	    	           	}

//	    	        }
	    	        prevQty = plan_qty;
	    	  }
	    	  
	    	  if(modifiend.length>0) {
	    		
	    		  console_log(modifiend);
	    		  var str =  Ext.encode(modifiend);
	    		  console_log(str);
	    		  console_log('modify>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
	    				params:{
	    					modifyIno: str,
	    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
	    				},
	    				success : function(result, request) {
							var jsonData = Ext.JSON.decode(result.responseText);
							var route_code = jsonData.datas;  
							Ext.getCmp(gm.me().link + '-'+ 'grid-top-rf-template').setText(route_code);
	    					gridPcsStd.store.load(function() {
								// console_logs('>>>> aaca', a);
								// Ext.getCmp(gm.me().link + '-'+ 'grid-top-rf-template').setText(route_code);
	    						// alert('come');
	    	       				// var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				// cellEditing.startEditByPosition({row:
								// idxGrid, column: 2});
	    						
	    					});
	    				}
	    		    });
	    	  }
	    	  
	 },
	 saveAssymapHandler: function(gridAssymapStore) {
	    	  for (var i = 0; i <gridAssymapStore.data.items.length; i++)
	    	  {
	    		  var modifiend =[];
	    	        var record = gridAssymapStore.data.items [i];
	           		var pl_no =  record.get('pl_no');
	           		var sp_code = record.get('sp_code');
	           		var item_name = record.get('item_name');
	           		var description = record.get('description_src');
	           		var specification = record.get('specification');
	           		var bm_quan = record.get('bm_quan');
	           		switch(sp_code){
	           		case 'R':
	           			gMain.selPanel.rQty=bm_quan;
	           			gMain.selPanel.rItemSpec=item_name+description+" "+specification+" "+ bm_quan+"EA";
	           			break;
	           		case 'O':
	           			gMain.selPanel.oQty=bm_quan;
	           			break;
	           		}
	    	        	gridAssymapStore.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	           		//console_logs('record.dirty',record);
	    	           		//console_logs('record>>>>>>>>>',record);
	    	           		//console_logs('unique_uid>>>>>>>>>',record.get('unique_uid'));
	    	           		//console_logs('unique_id>>>>>>>>>',record.get('unique_id'));
	    	           		//console_logs('child>>>>>>>>>',record.get('srcahd_uid'));
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_uid');
	    		           	obj['child'] = record.get('srcahd_uid');
	    		           	obj['ac_uid'] = record.get('ac_uid');
	    		           	obj['pl_no'] = record.get('pl_no');
	    		           	obj['sp_code'] = record.get('sp_code');
	    		           	obj['item_name'] = record.get('item_name');
	    		           	obj['description'] = record.get('description_src');
	    		           	obj['specification'] = record.get('specification');
	    		           	obj['bm_quan'] = record.get('bm_quan');
	    		           	
	    		           	modifiend.push(obj);

//	    	        }
	    		            if(modifiend.length>0) {
	    			    		
	    			    		  console_log(modifiend);
	    			    		  var str =  Ext.encode(modifiend);
	    			    		  console_log(str);
	    			    		  console_log('modify>>>>>>>>');
	    			    		    Ext.Ajax.request({
	    			    				url: CONTEXT_PATH + '/design/bom.do?method=modifyPartList',
	    			    				params:{
	    			    					modifyIno: str,
	    			    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID,
	    			    					sp_code : sp_code
	    			    				},
	    			    				success : function(result, request) {
	    			    					gridAssymapStore.sync();

                                            //console_logs('결과', '반영하였습니다.');
	    			    					gridAssymapStore.load(function() {
	    			    						// alert('come');
	    			    	       				// var idxGrid = storePcsStd.getTotalCount() -1;
	    			    	       				// cellEditing.startEditByPosition({row:
	    										// idxGrid, column: 2});
	    			    					});
	    			    				}
	    			    		    });
	    			    	  }
	    	  }
//	    	  gm.me().store.load();
	    	 
	    	  
	 },
	  vSELECTED_UNIQUE_ID : 200,
	  AssemblyPartStore : Ext.create('Mplm.store.AssemblyPartStore', {
			remoteSort: true,
			remoteGroup:true,
			groupField: 'sp_code',
			sortInfo: {
				field: 'sp_code',
				direction: 'desc'
			},
			listeners: {
				load: function(store, records, successful,operation, options) {
					// console_logs('>>> records', records);
			   		 var rec1 = records[0];
						// console_logs('rec1@@@',rec1);
					  if(rec1!=null){
						  for(var i=0; i<records.length; i++) {
							var r = records[i];
								sp_code = r.get('sp_code');
							switch(sp_code) {
								case 'R':
								gMain.selPanel.rQty=r.get('bm_quan');
								break;
								case 'O':
								gMain.selPanel.oQty=r.get('bm_quan');
								break;
							}
						  }
						//   console_logs('rQty',gMain.selPanel.rQty);
						//   console_logs('oQty',gMain.selPanel.oQty);
						  gMain.selPanel.rItemSpec=rec1.get('item_name')+' '+rec1.get('description_src')+' '+rec1.get('specification')+ ' '+ gMain.selPanel.rQty+'EA';
			 	   		  gMain.selPanel.refreshPrchInfoAR();
					  }
				}
			}
	  }),
	//   AssemblyPartStore2 : Ext.create('Mplm.store.AssemblyPartStore', {
	// 	  listeners: {
	// 			load: function(store, records, successful,operation, options) {
	// 				  var rec2 = records[0];
	// 				  if(rec2!=null){
	// 					  //console_logs('rec2@@@',rec2);
	// 					  gMain.selPanel.oQty=rec2.get('bm_quan');
	// 					  //console_logs('oQty',gMain.selPanel.oQty);
	// 				  }

	// 			}
	// 	  }
	//   }),
	//   AssemblyPartStore3 : Ext.create('Mplm.store.AssemblyPartStore', {}),
	  standardFlagStore : Ext.create('Mplm.store.StandardFlagStore', {}),
	  CostStore : Ext.create('Mplm.store.CostStore', {}),
	  
	  partReload(sp_code, parent_uid) {
		  var store =this.AssemblyPartStore;
		//   switch(sp_code) {
		//   case 'R':
		// 	  store = this.AssemblyPartStore;
		// 	  break;
		//   case 'O':
		// 	  store = this.AssemblyPartStore2;
		// 	  break;
		//   case 'K':
		// 	  store = this.AssemblyPartStore3;
		// 	  break;
		//   }
		  
		  if(store!=null) {
			  store.getProxy().setExtraParam('parent_uid', parent_uid);
			  store.getProxy().setExtraParam('groupBy', 'a.unique_id');
			  store.getProxy().setExtraParam('sp_code_list', 'R,O,K');
			  store.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
			  store.load();
			 
		  }
		  
	  },saveAssymapHandlerMulti : function() {
		  this.saveAssymapHandler(this.AssemblyPartStore);
		//   this.saveAssymapHandler(this.AssemblyPartStore2);
		//   this.saveAssymapHandler(this.AssemblyPartStore3);
	  },
	  
	  loadPrchPart4Edit : function(parent_uid) {
		  this.partReload('R', parent_uid);
		//   this.partReload('O', parent_uid);
		//   this.partReload('K', parent_uid);
	  },
	  loadPrchPart4create : function() {
		  this.partReload('R', 200); 
		//   this.partReload('O', 200);
		//   this.partReload('K', 200);
	  },
	  prchCalQuan : function(){
		  this.prchmodify(this.AssemblyPartStore);
		//   this.prchmodify(this.AssemblyPartStore2);
		//   this.prchmodify(this.AssemblyPartStore3);
	    	},
	  prchmodify :function(store){
		  var modifiend =[];
	    	
		    	for (var i = 0; i <store.data.items.length; i++)
		    	  {
		    	        var record = store.data.items [i];
		           		var pl_no =  record.get('pl_no');
		           		var sp_code = record.get('sp_code');
		           		var item_name = record.get('item_name');
		           		var description_src = record.get('description_src');
		           		var specification = record.get('specification');
		           		
		           		var target_bm_quan = gm.me().getInputTarget('bm_quan');
		           		var bm_quan = target_bm_quan.getValue();
		           		
		           		var target_reserved_double3 = gm.me().getInputTarget('reserved_double3');
		           		var reserved_double3 = target_reserved_double3.getValue();
		           		
		           		var target_reserved_varcharb = gm.me().getInputTarget('reserved_varcharb');
		        		var val = gm.getBladeInfo();
//		        		target.setValue(val);
		        		
		            	// 칼날사이즈
		            	var target_reserved_varcharb = gm.me().getInputTarget('reserved_varcharb');
		            	var reserved_varcharb = target_reserved_varcharb.getValue();
		            	//console_logs('reserved_varcharb', reserved_varcharb);
		            	//console_logs('record.dirty', record.dirty);
		            	//console_logs('record',record);
	//	            	if (record.dirty) {
		            		store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
		    	           	//console_logs(record);
	
	//	    	           		if(bm_quan==0) {
	//	    	           			bm_quan = prevQty;
	//	    	           		}
		    	           		switch(record.get('sp_code')){
		    	           			case 'R':
		    	           				bm_quan = Math.round(Number(bm_quan) / Number(reserved_double3));
		    			            	// 원지
		    			            	reserved_varcharb = reserved_varcharb.replace('X','*');
		    			            	var reserved_varcharb_arr = reserved_varcharb.split('*');
		    			            	console_log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',reserved_varcharb);
		    			            	specification = (reserved_varcharb_arr[0]*1+20) +'*'+(reserved_varcharb_arr[1]*1+15);
		    	           				break;
		    	           			case 'O':
		    	           				bm_quan = Math.round(Number(bm_quan) / Number(reserved_double3));
		    	           			// 원단
		    			            	reserved_varcharb = reserved_varcharb.replace('X','*');
		    			            	var reserved_varcharb_arr = reserved_varcharb.split('*');
		    			            	specification = (reserved_varcharb_arr[1]*1+10) +'*'+(reserved_varcharb_arr[0]*1+15);
		    	           				break;
		    	           		}
		    	           	
		    	           		//console_logs('unique_uid>>>>>>>>>',record.get('unique_uid'))
		    		           	var obj = {};
		    		           	obj['unique_id'] = record.get('unique_uid');
		    		           	obj['unique_uid'] = record.get('unique_uid');
		    		           	obj['child'] = record.get('unique_id');
		    		           	obj['ac_uid'] = record.get('ac_uid');
		    		           	obj['pl_no'] = record.get('pl_no');
		    		           	obj['sp_code'] = record.get('sp_code');
		    		           	obj['item_name'] = record.get('item_name');
		    		           	obj['description'] = record.get('description_src');
		    		           	obj['description_src'] = record.get('description_src');
		    		           	obj['specification'] = specification;
		    		           	obj['bm_quan'] = bm_quan;
		    		           	
		    		           	modifiend.push(obj);
		    		           	
	//	    	        }
		    	        
		    	  }
		    	store.clearData();
	           	store.removeAll();
	           	store.add(modifiend);
	  },
		 saveCostmapHandler: function() {
			 var costGrid = Ext.getCmp('costGrid');
			 // console_logs('gridPcsStd', gridPcsStd);
			 
		    	var unique_ids =[];
		    	var ac_uids =[];
		    	var srcahd_uids =[];
		    	var cost_types =[];
		    	var costs =[];
		    	var tex_flags =[];
		    	var comment1s =[];
		    	var dev_cost_total = 0;
		    	  // var tomCheck = false;
		    	  for (var i = 0; i <costGrid.store.data.items.length; i++){
		    	        
		    		var record = costGrid.store.data.items [i];
		           	var cost_type =  record.get('cost_type');
		           	var cost = record.get('cost');
		           	var tex_flag = record.get('tex_flag');
		           	var comment1 = record.get('comment1');
		           		if(comment1==null||comment1==''){
		           			comment1='-';
		           		}
		           		unique_ids.push(record.get('unique_id'));
		           	 	ac_uids.push(gMain.selPanel.vSELECTED_AC_UID);
		           	 	srcahd_uids.push(gMain.selPanel.vSELECTED_CHILD);
			    	 	cost_types.push(cost_type);
			    	 	costs.push(cost);
			    	 	tex_flags.push(tex_flag);
			    	 	comment1s.push(comment1);
//		    		    modifiend.push(obj);
			    	 	
			    	 	dev_cost_total=(parseInt(dev_cost_total)+parseInt(cost));
		    	  }
		    	//저장할때 계산하는 쿼리
		    	    var selling	= gm.me().getInputJust('project|selling_price'); 
		    	    var reserved1 = gm.me().getInputJust('project|reserved_double1'); 
		    	    
				 	var quan	= gm.me().getInputJust('project|quan'); 
				 	var bm_quan = quan.getValue();//수주수량
				 	var selling_price = Ext.getCmp('selling_price');  //수주금액
				 	var total_cost = Ext.getCmp('dev_total_cost'); //개발비합계
				 	var sales_price = Ext.getCmp('sales_price').getValue(); //제품 1개당 가격
				 	var delivery_price = Ext.getCmp('reserved_varchar6').getValue();//물류비
				 	var total_price= 0;
				 	if(delivery_price==''){
				 		total_price = ((parseInt(bm_quan)*parseInt(sales_price))+parseInt(dev_cost_total)+0);
				 	}else{
				 		total_price = ((parseInt(bm_quan)*parseInt(sales_price))+parseInt(dev_cost_total)+parseInt(delivery_price));
				 	}
				 	
				 	
				 	selling_price.setValue(total_price);
				 	selling.setValue(total_price);
				 	total_cost.setValue(dev_cost_total);
				 	reserved1.setValue(dev_cost_total);
				 	
		    	  if(unique_ids.length>0) {
		    		
//		    		  console_log(modifiend);
//		    		  var str =  Ext.encode(modifiend);
//		    		  console_log(str);
		    		  console_log('saveCostmapHandler>>>>>>>>');
		    		    Ext.Ajax.request({
		    				url: CONTEXT_PATH + '/index/process.do?method=saveCostMapSession',
		    				params:{
		    					unique_ids:unique_ids,
		    					ac_uids:ac_uids,
		    					srcahd_uids:srcahd_uids,
		    					cost_types:cost_types,
		    					costs:costs,
		    					tex_flags:tex_flags,
		    					comment1s:comment1s
		    				},
		    				success : function(result, request) {   
//		    					costGrid.store.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
//		    					costGrid.store.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
//		    					costGrid.store.load(function() {
//		    					});
		    				}
		    		    });
		    	  }
		    	  
		 },
//		 postCreateCallback: function(){
//			 gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
// 			 gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
//             gMain.selPanel.CostStore.load();
//             
//             gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);
//             
//             processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
//         	 processGrid.getStore().load();
//		 },
		 vSELECTED_CHILD : -1,
         vSELECTED_AC_UID : -1,
         rQty:0,
         oQty:0,
         rItemSpec:null,
         recvPoPartGrid:null,
         costmapRefresh:function(){
	        	var selling_price	= gm.me().getInputJust('project|selling_price');//수주금액
	        	var sales_price	= gm.me().getInputJust('partline|sales_price');//제품단가
	        	var reserved_double1	= gm.me().getInputJust('project|reserved_double1');//개발비 합계
				var reserved_varchar6	= gm.me().getInputJust('project|reserved_varchar6');//물류비
				var reserved_varchar7	= gm.me().getInputJust('project|reserved_varchar7');//물류비 포함
				var reserved_varchar5	= gm.me().getInputJust('project|reserved_varchar5');//물류비메모
				var reserved_varcharg	= gm.me().getInputJust('project|reserved_varcharg');//세액포함
				
				var selling_price1 = Ext.getCmp('selling_price');  //수주금액
				var sales_price1 = Ext.getCmp('sales_price'); //제품단가
				var total_cost1 = Ext.getCmp('dev_total_cost'); //개발비합계
				var reserved_varchar61 = Ext.getCmp('reserved_varchar6');//물류비
				var reserved_varchar71 = Ext.getCmp('reserved_varchar7');//물류비 포함
				var reserved_varchar51 = Ext.getCmp('reserved_varchar5');//물류비메모
				var tex_flag = Ext.getCmp('tex_flag');
				selling_price1.setValue(selling_price.getValue());
				sales_price1.setValue(sales_price.getValue());
				total_cost1.setValue(reserved_double1.getValue());
				reserved_varchar61.setValue(reserved_varchar6.getValue());
				reserved_varchar71.setValue(reserved_varchar7.getValue());
				reserved_varchar51.setValue(reserved_varchar5.getValue());
				tex_flag.setValue(reserved_varcharg.getValue());
         },
         tabchangeHandler2 : function(tabPanel, newTab, oldTab, eOpts)  {
             // console_logs('tabpanel newTab', newTab);
             // console_logs('tabpanel newTab newTab.title', newTab.title);
         	
             switch(newTab.title) {
 	            case '원지':
 	            	gMain.selPanel.recvPoPartGrid=Ext.getCmp('recvPoAssyGrid1');
 	            	//console_logs('><>>>>>>>>>>>>>>>원지',gMain.selPanel.recvPoPartGrid);
 	            	break;
 		        case '원단':
 		        	gMain.selPanel.recvPoPartGrid=Ext.getCmp('recvPoAssyGrid2');
 		        	//console_logs('><>>>>>>>>>>>>>>>원단',gMain.selPanel.recvPoPartGrid);
 		        	break;
 		        case '부자재':
 		        	gMain.selPanel.recvPoPartGrid=Ext.getCmp('recvPoAssyGrid3');
 		        	//console_logs('><>>>>>>>>>>>>>>>부자재',gMain.selPanel.recvPoPartGrid);
 		        	break;
             }

             
         },
         refleshCopyForm: function(){
        	 
        	//console_logs('copyCallback', '수주 복사등록');
 			var target = gMain.selPanel.getInputTarget('pj_code');
 			
 			var fullYear = gUtil.getFullYear()+'';
 			var month = gUtil.getMonth()+'';
 			if(month.length==1) {
 				month = '0' + month;
 			}
 			
 			//console_logs('fullYear', fullYear);
 			//console_logs('month', month);
 			
 			//console_logs('pj_code', pj_code);
 			var pj_code = fullYear.substring(2,4) + month;
 			//console_logs('pj_code', pj_code);
 			
 			var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
 			// 마지막 수주번호 가져오기
 		   Ext.Ajax.request({
 				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
 				params:{
 					pj_first: pj_code,
 					codeLength: 5
 				},
 				success : function(result, request) {   	
 					var result = result.responseText;
 					
 					
 					//console_logs('result', result);
 					
// 					target.setValue(result);
 					
 					gMain.selPanel.copyPjCode = result;
 					
 					Ext.Ajax.request({
 		     			url: CONTEXT_PATH + '/production/schdule.do?method=recvPoCopy',
 		     			params:{
 		     				ac_uid: ac_uid,
 		     				pj_code: gMain.selPanel.copyPjCode,
 		     				not_restart:'N'
 		     			},
 		     			
 		     			success : function(result, request) { 
// 		     				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
 		     				gMain.selPanel.reflesh3Data();
 		     			},//endofsuccess
 		     			failure: extjsUtil.failureMessage
 		     		});//endofajax
 					
 				},// endofsuccess
 				failure: extjsUtil.failureMessage
 			});// endofajax
        	 
         },
         reflesh3Data: function(){
        	 gMain.selPanel.store.load( function(records) {
        		 var copyrecord = null;
        		 if(records != undefined ) {
                     for (var i=0; i<records.length; i++){ 
    	                	var obj = records[i];
    	                	
	    	                var pj_code = obj.get('pj_code');
    	                	if(pj_code==gMain.selPanel.copyPjCode){
        	                	copyrecord=records[i];
    	                	}
    	                	
                       }
    			 }
        		//체크박스 해제
 	    		gm.me().grid.getSelectionModel().deselectAll();
 	    		
 	    		//insert한 레코드 체크박스 셀렉트
// 	    		var rec = gm.me().store.first();
 	    		var rec = copyrecord;
 	            gm.me().grid.getSelectionModel().select(rec, false, false);
 	            
 	            //수정창 열기
 	            gm.me().setActiveCrudPanel('EDIT');
				 
				console_logs('>>>>>>>> rec', rec);
 	            var assytop_uid = rec.get('unique_uid');
 	            var ac_uid = rec.get('ac_uid');
 	            var child = rec.get('srcahd_uid')
 	            
 	            //단가관리
 	            gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', ac_uid);
 				gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', child);
 	            gMain.selPanel.CostStore.load();
 	            
 	            //공정설계
 	            var processGrid = Ext.getCmp('recvPoPcsGrid');
 	        	processGrid.getStore().getProxy().setExtraParam('assymap_uid', assytop_uid);
 	        	processGrid.getStore().load();
 	        	
 	        	//구매규격
 	        	gm.me().loadPrchPart4Edit(assytop_uid);
        		 
        	 });
         },
         copyPjCode : null,
         calcCatonuseQty : function(cur){
            	 var _quantarget	= gm.me().getInputJust('project|quan');
            	 var _pkgqtytarget	= gm.me().getInputJust('partline|reserved15');
            	 var _costqty	= gm.me().getInputJust('project|cost_qty');
            	 
            	 var _quan = _quantarget.getValue();
            		
            	 var _pkgqty = _pkgqtytarget.getValue();
            	 var cost_qty = 0;
            	 //console_logs('CALC_USE_CATON _quan', _quan);
            	 //console_logs('CALC_USE_CATON _pkgqty', _pkgqty);
            	 
            		 if(_pkgqty>0&&_pkgqty!=null){
                		 cost_qty = Math.ceil(_quan/_pkgqty);
                	 }else if(cur!=null&&cur>0){
                		 cost_qty = Math.ceil(_quan/cur);
                	 }
            	 
            	
            	 
            	 //console_logs('CALC_USE_CATON cost_qty', cost_qty);
            	 _costqty.setValue(cost_qty);

        	 
		 },
		 bs_flag : '부가세 포함여부 :',
		 buttonToolbar3 : Ext.create('widget.toolbar', {
			items: [{
				xtype: 'tbfill'
			},{
				xtype: 'label',
				style: 'color: #000000; font-weight: bold; font-size: 15px; margin: 5px;',
				text: '부가세 여부: '
			}]
		}),
		changeStockHandler: function() {
			var rec = gm.me().grid.getSelectionModel().getSelection()[0];
			var ctr_flag = rec.get('ctr_flag');
			if(ctr_flag != null && ctr_flag == 'Y') {
				Ext.Msg.alert('안내', '이미 상시재고 입니다.', function() {});
				return;
			}
			var pj_uid = rec.get('ac_uid');
			var product_uid = rec.get('product_uid');

			var fullYear = gUtil.getFullYear()+'';
				var month = gUtil.getMonth()+'';
				if(month.length==1) {
					month = '0' + month;
				}

			var pj_code = fullYear.substring(2,4) + month;

			// 주문 -> 상시 로 생성 ==> project 의 pj_type:R, is_def:Y / product 의 ctr_flag:Y

			// 마지막 수주번호 가져오기
 		   Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
			params:{
				pj_first: pj_code,
				codeLength: 5
			},
			success : function(result, request) {   	
				var result = result.responseText;
				pj_code = result + 'R';

				 Ext.Ajax.request({
					url: CONTEXT_PATH + '/sales/productStock.do?method=changeStockPj',
					params: {
						pj_uid: pj_uid,
						product_uid:product_uid,
						pj_code:pj_code
					},
					success: function(result, request) {
						gm.me().store.load();
					}, // endof success for ajax
					failure: extjsUtil.failureMessage
				});
				
			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax

			
		},

		changePurSpec: function(record) {
			var pl_no = record.get('pl_no');
				sp_code = record.get('sp_code');
				item_name = record.get('item_name');
				description_src = record.get('description_src');
				specification = record.get('specification');
				bm_quan = record.get('bm_quan');

				unique_id = record.get('unique_id_long');
			
			console_logs('>>> 유니크아이디', unique_id);
			
			gm.me().standardFlagStore.load();
			var form = Ext.create('Ext.form.Panel', {
				id: 'formSpec',
				defaultType: 'textfield',
				border: false,
				bodyPadding: 15,
				width: 750,
				height: 200,
				layout: 'column',
				defaults: {
					labelWidth: 89,
					anchor: '50%',
					width: '50%',
					style: 'padding-left: 50px; padding-top: 15px;',
					layout: {
						type: 'column',
						// defaultMargins: {
						// 	top: 20,
						// 	right: 30,
						// 	bottom: 0,
						// 	left: 10
						// }
					}
				},
				// defaults: {
				// 	anchor: '50%',
				// 	width: '50%',
				// 	editable:true,
				// 	allowBlank: false,
				// 	// msgTarget: 'side',
				// 	labelWidth: 100
				// },
				items: [
					new Ext.form.Hidden({
						name: 'unique_id',
						value: unique_id
					}),
					{
						xtype: 'textfield',
						name: 'pl_no',
						id:'pl_no',
						allowBlank: false,
						fieldLabel: '순번',
						value: pl_no
					},{
						xtype: 'combo',
						fieldLabel: '항목',
						id: 'sp_code',
						name: 'sp_code',
						allowBlank: false,
						store : gm.me().standardFlagStore,
						displayField : 'code_name_kr',
						valueField : 'system_code',
						// listeners: {
						// 	select: function(store, combo) {
						// 		var value = combo.value;
						// 		console_logs('>>>> combo value', value);
						// 		Ext.getCmp('sp_code').setValue(value);
						// 	}
						// },
						listConfig : {
							getInnerTpl : function() {
								return '<div data-qtip="{system_code}">{code_name_kr}</div>';
							}
						},
						value: sp_code
					},{
						xtype: 'textfield',
						name: 'item_name',
						id:'item_name',
						allowBlank: true,
						fieldLabel: '지종(규격)',
						value: item_name
					},{
						xtype: 'textfield',
						name: 'description_src',
						id:'description_src',
						allowBlank: true,
						fieldLabel: '평량(배합)',
						value: description_src
					},{
						xtype: 'textfield',
						name: 'specification',
						id:'specification',
						allowBlank: true,
						fieldLabel: '규격',
						value: specification
					},{
						xtype: 'textfield',
						name: 'bm_quan',
						id:'bm_quan',
						allowBlank: true,
						fieldLabel: '요청수량',
						value: bm_quan
					}
				]
			});

			var win = Ext.create('ModalWindow', {
				title: '구매내용저장',
				width: 800,
				height: 230,
				minWidth: 800,
				minHeight: 50,
				items: form,
				// layout: 'column',
				buttons: [{
					text: CMD_OK,
					handler: function(btn){
						if(btn == "no") {
							win.close();
						} else {
							// var array = [];
							var obj = {};
							var sp_code = Ext.getCmp('sp_code').getValue();
							obj['unique_id'] = record.get('unique_uid');
							obj['child'] = record.get('srcahd_uid');
							obj['ac_uid'] = record.get('ac_uid');
							obj['pl_no'] = Ext.getCmp('pl_no').getValue();
							obj['sp_code'] = Ext.getCmp('sp_code').getValue();
							obj['item_name'] = Ext.getCmp('item_name').getValue();
							obj['description'] = Ext.getCmp('description_src').getValue();
							obj['specification'] = Ext.getCmp('specification').getValue();
							obj['bm_quan'] = Ext.getCmp('bm_quan').getValue();


							// array.push(obj);
							var str =  Ext.encode(obj);

							Ext.Ajax.request({
								url: CONTEXT_PATH + '/design/bom.do?method=modifyPartOne',
								params:{
									modifyInfo: str,
									assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID,
									sp_code : sp_code
								},
								success: function(val, action) {
									win.close();

									switch(sp_code){
									case 'R':
										gMain.selPanel.rQty=obj['bm_quan'];
										gMain.selPanel.rItemSpec=item_name+description_src+" "+specification+" "+ bm_quan+"EA";
										break;
									case 'O':
										gMain.selPanel.oQty=obj['bm_quan'];
										break;
									}

									gm.me().AssemblyPartStore.load();
									// 마지막에 들어가야댐
									gm.me().refreshPrchInfoAR();
									gm.me().showToast('알림', '구매내용 저장완료');
								},
								failure: function() {
									win.close();
								}
							})
						}
					}
				},{
					text: CMD_CANCEL,
					handler: function(btn) {
						win.close();
					}
				}]
			});
			win.show();

			
		},

		getRfRouteTemp: function() {
			// alert('getRfRouteTemp');
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/code.do?method=read',
				params:{
					parentCode:'RF_ROUTE'
				},
				success : function(result, request) { 
					// gMain.selPanel.store.load();
					// 'recvPoRfview' + '-mainmenu'
					var jsonData = Ext.JSON.decode(result.responseText);
					for(var i=0; i<jsonData.datas.length; i++) {
						var template = 'rfTemplate' + this.link;
							val = jsonData.datas[i];
							system_code = val['system_code'];
							code_name_kr = val['code_name_kr'];
							
							code_val = {text:code_name_kr + '[' + system_code + ']'};
							gm.me().rfJson.push(code_val);
					}
					var temp = Ext.getCmp('rfTemplate' + gm.me().link);
					temp.setMenu(gm.me().rfJson);
					temp.showMenu();
					// Ext.Msg.alert('안내', 'RF 경로 템플릿을 불러오는데 성공했습니다.', function() {});
				},//endofsuccess
				failure: function(){
					// Ext.Msg.alert('안내', 'RF 경로 템플릿을 불러오는데 실패했습니다.', function() {});
				}
			});
		},

		rfItemClick:function(o) {
			var text = o['text'];
				val  = o['val'];
				route_code = gm.me().getInputJust('project|route_code');
				console_logs('00000', route_code);
				route_code.setValue(val);
				console_logs('11111', gm.me().getInputJust('project|route_code'));
				Ext.getCmp(gm.me().link + '-'+ 'grid-top-rf-template').setText(text);
		},
		rfJson:[],
		 catonBuyStoreMM : Ext.create('Mplm.store.CatonListStore', {}),
		 rfRouteStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode:'RF_ROUTE'})
		
    
});
