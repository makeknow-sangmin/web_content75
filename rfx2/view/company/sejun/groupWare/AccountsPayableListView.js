//주문작성

Ext.define('Rfx2.view.company.sejun.groupWare.AccountsPayableListView', {
	extend: 'Rfx.base.BaseView',
	xtype: 'account-list-view',
	initComponent: function () {
		//검색툴바 필드 초기화
		this.initSearchField();
		//검색툴바 추가

		//    	this.addSearchField ({
		//            type: 'dateRange',
		//            field_id: 'gr_date',
		//            text: "요청기간" ,
		//            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
		//            edate: new Date()
		//    	});

		//		this.addSearchField('maker_name');
		//		this.addSearchField('pj_code');
		//		this.addSearchField('pj_name');
		//		this.addSearchField('creator');
		//		this.addSearchField('item_name_dabp');

		//		//Readonly Field 정의
		//		this.initReadonlyField();
		//		this.addReadonlyField('unique_id');
		//		this.addReadonlyField('create_date');
		//		this.addReadonlyField('creator');
		//		this.addReadonlyField('creator_uid');
		//		this.addReadonlyField('user_id');
		//		this.addReadonlyField('board_count');

		switch (vCompanyReserved4) {
			case 'KBTC01KR':
				break;
			case 'HJSV01KR':
				break;
			default:
				this.addSearchField({
					field_id: 'comcst_code'
					, store: 'ComCstStore'
					, displayField: 'division_name'
					, valueField: 'wa_code'
					, innerTpl: '<div data-qtip="{wa_code}">{division_name}</div>'
				});
		}

		this.addSearchField('supplier_name');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();


		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();

		// var buttonToolbar3 = Ext.create('widget.toolbar', {
        //     items: [{
        //         xtype: 'tbfill'
        //     }, {
        //         xtype: 'label',
        //         id: 'total_price',
        //         style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
        //         text: '총 견적가 : '
        //     }]
        // });

		console_logs('this.fields', this.fields);

		this.createStoreSimple({
			modelClass: 'Rfx.model.RtgAstAc',
			sorters: [{
				property: 'unique_id',
				direction: 'DESC'
			}],
			pageSize: gMain.pageSize,/*pageSize*/
		}, {
			groupField: 'supplier_name',
			groupDir: 'DESC'
		},{
            groupField: 'project_varcharh'
        });

		this.setRowClass(function (record, index) {
            var c = record.get('state');
            console_logs('c', c);
            switch (c) {
                case 'Y':
                    return 'green-row';
                    break;
                default:
            }
        });

		var option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div>공급사 :: <font color=#003471><b>{name}</b></font> ({rows.length})</div>'
            }
        };

		this.store.getProxy().setExtraParam('rtg_type', 'AC');


		var arr = [];
		arr.push(buttonToolbar);
		arr.push(searchToolbar);

		for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            var dataIndex = o['dataIndex'];
			console_logs('this.columns' + i, o);
            switch (dataIndex) {
                case 'total_price':
                case 'issueBillPrice':
				case 'reserved_double1':
                case 'reserved_double2':
                case 'reserved_double3':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,000/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

		//grid 생성.
		// this.createGrid(arr);
		this.createGrid(searchToolbar, buttonToolbar, option
            ,  [
                {
                    locked: false,
                    arr: [0, 1, 2, 3, 4,5,6,7,8,9]
                },
                {
                    text: '선금',
                    locked: false,
                    arr: [10,11,12]
                },
                {
                    text: '중도금',
                    locked: false,
                    arr: [13,14,15]
				},
				{
                    text: '잔금',
                    locked: false,
                    arr: [ 16, 17]
                },
                {
                    locked: false,
                    arr: [18,19]
                }
            ]);
		this.createCrudTab();

		// this.printPDFAction = Ext.create('Ext.Action', {
		// 	iconCls: 'af-pdf',
		// 	text: 'PDF',
		// 	disabled: true,
		// 	handler: function (widget, event) {
		// 		//  var rec = this.grid.getSelectionModel().getSelection()[0];
		// 		var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;//rtgast_uid
		// 		var po_no = gMain.selPanel.vSELECTED_PO_NO;//po_no
		// 		Ext.Ajax.request({
		// 			url: CONTEXT_PATH + '/pdf.do?method=printAC',
		// 			params: {
		// 				rtgast_uid: rtgast_uid,
		// 				po_no: po_no,
		// 				pdfPrint: 'pdfPrint'
		// 			},
		// 			reader: {
		// 				pdfPath: 'pdfPath'
		// 			},
		// 			success: function (result, request) {
		// 				var jsonData = Ext.JSON.decode(result.responseText);
		// 				var pdfPath = jsonData.pdfPath;
		// 				console_logs(pdfPath);
		// 				if (pdfPath.length > 0) {
		// 					var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
		// 					top.location.href = url;
		// 				}
		// 			},
		// 			failure: extjsUtil.failureMessage
		// 		});


		// 	}
		// });

		var rtgast_uids = [];
		var po_nos = [];

		this.summitBillFunction = Ext.create('Ext.Action', {
			iconCls: 'af-check',
			text: '결재완료',
			disabled: true,
			handler: function (widget, event) {
				// console_logs('cartmap_uids >>>> ', this.cartmap_uids);
				console_logs('rtgast_uids >>>> ', rtgast_uids);
				// console_logs('rtgast_uids >>>> ', po_nos);
				Ext.MessageBox.show({
					title: '결재완료',
					msg: '선택한 건을 결재완료 하시겠습니까?',
					buttons: Ext.MessageBox.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function (btn) {
						if (btn == "no") {
							return;
						} else {
							var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;//rtgast_uid
							var po_no = gMain.selPanel.vSELECTED_PO_NO;//po_no
							Ext.Ajax.request({
								url: CONTEXT_PATH + '/account/arap.do?method=finishPayment',
								params: {
									rtgast_uids: rtgast_uids,
									po_no: po_no,
								},
								success: function (result, request) {
								Ext.Msg.alert("안내","완료처리 되었습니다.");
								gm.me().store.load();
							},
								failure: extjsUtil.failureMessage
							});
						}
					}
				});
			}
		});

		Ext.apply(this, {
			layout: 'border',
			items: [this.grid, this.crudTab]
		});


		//this.editAction.setText('주문작성');
		//        this.removeAction.setText('반려');


		// remove the items
		(buttonToolbar.items).each(function (item, index, length) {
			if (index == 1 || index == 2 || index == 3) {
				buttonToolbar.items.remove(item);
			}
		});
		//buttonToolbar.insert(3, this.printPDFAction);
		buttonToolbar.insert(3, this.summitBillFunction);
        buttonToolbar.insert(3, '-');
		this.callParent(arguments);

		

		//grid를 선택했을 때 Callback
		this.setGridOnCallback(function (selections) {
			if (selections.length) {
				rtgast_uids = [];
				var rec = selections[0];
				gMain.selPanel.rec = rec;
				console_logs('rec 데이터', rec);
				var standard_flag = rec.get('standard_flag');
				standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제
				gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');//rtgast_uid
				gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no');//po_no

				console_logs('그리드온 데이터', rec);
				gMain.selPanel.request_date = rec.get('req_date'); // 납기일
				gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
				gMain.selPanel.vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
				gMain.selPanel.vSELECTED_SP_CODE = rec.get('sp_code');
				gMain.selPanel.vSELECTED_STANDARD = rec.get('standard_flag');
				gMain.selPanel.vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
				gMain.selPanel.vSELECTED_coord_key2 = rec.get('coord_key2');
				gMain.selPanel.vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
				gMain.selPanel.vSELECTED_po_user_uid = rec.get('po_user_uid');
				gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 원지: 지종,  원단 : 지종배합, 부자재 : 품명
				gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
				gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
				gMain.selPanel.vSELECTED_req_date = rec.get('delivery_plan');
				gMain.selPanel.vSELECTED_quan = rec.get('pr_quan');
				gMain.selPanel.vSELECTED_comment = rec.get('comment');   // 폭
				gMain.selPanel.vSELECTED_req_info = rec.get('req_info');  //비고
				gMain.selPanel.vSELECTED_request_comment = rec.get('request_comment');  //전달 특기사항
				gMain.selPanel.vSELECTED_reserved_varcharb = rec.get('reserved_varcharb'); //칼날 사이즈
				gMain.selPanel.vSELECTED_project_double3 = rec.get('project_double3'); //판걸이 수량
				gMain.selPanel.vSELECTED_specification = rec.get('specification');  //부자재 규격
				gMain.selPanel.vSELECTED_pj_description = rec.get('pj_description');
				gMain.selPanel.vSELECTED_srcahduid = rec.get('unique_id');  //srcahd uid
				gMain.selPanel.vSELECTED_lot_name = rec.get('pj_name');
				//gm.me().printPDFAction.enable();
				gm.me().summitBillFunction.enable();
				//gMain.selPanel.itemabst();
				console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID);
				this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);

				
                for (var i = 0; i < selections.length; i++) {
					console_logs('length ??', selections.length);
                    var rec = selections[i];
                    console_logs('rec', rec);
					rtgast_uids.push(rec.get('unique_id'));
				}
                   
				// rtgast_uids.push(rec.get('unique_id'));

				//this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
				/*for(var i=0; i<selections.length; i++){
					   var rec1 = selections[i];
					 var uids = rec1.get('id');
					this.cartmap_uids.push(uids);
					console_logs('rec1', rec1);
				   }*/
			} else {
				gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
				gMain.selPanel.vSELECTED_PJ_UID = -1;
				// gm.me().printPDFAction.disable();
				gm.me().summitBillFunction.disable();

				//this.store.removeAll();
				this.cartmap_uids = [];
				for (var i = 0; i < selections.length; i++) {
					var rec1 = selections[i];
					var uids = rec1.get('id');
					this.cartmap_uids.push(uids);
				}

				console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID);
				console_logs('언체크', this.cartmap_uids);
			}

		})


		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.load(function (records) {
			console_logs('디폴트 데이터', records);

		});
	},
	items: [],
	poviewType: 'ALL',
	cartmap_uids: [],
	deleteClass: ['rtgast'],
	jsonType: '',
	selMode : 'SINGLE'
});
