//설비현황
Ext.define('Rfx2.view.company.ynju.produceMgmt.ProductPerformStateView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'machine-view',
	initComponent: function () {

		//검색툴바 필드 초기화
		this.initSearchField();

		this.addSearchField({
			type: 'dateRange',
			field_id: 'start_date',
			text: gm.getMC('CMD_Work_Date', '생산일자'),
			sdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
			edate: new Date()
		});

		// Site
		// this.addSearchField({
		// 	type: 'combo'
		// 	, field_id: 'site'
		// 	, store: "ProductionSiteStore"
		// 	, displayField: 'codeName'
		// 	, valueField: 'systemCode'
		// 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		// });


		// this.addSearchField({
		// 	type: 'combo'
		// 	, field_id: 'gubun'
		// 	, store: "ProductionGubunStore"
		// 	, displayField: 'codeName'
		// 	, valueField: 'systemCode'
		// 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		// });

		// this.addSearchField({
        //     type: 'combo',
        //      field_id: 'product_group'
        //     , emptyText: gm.getMC('CMD_Product', '제품군')
        //     , store: "CommonCodeStore"
        //     , params: { parentCode: 'PRD_GROUP' }
        //     , displayField: 'code_name_kr'
        //     , valueField: 'system_code'
        //     , value: 'code_name_kr'
        //     , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        // });

		//  주/야간 구분 콤보
		// this.addSearchField({
		// 	type: 'combo'
		// 	, field_id: 'work_type'
		// 	, store: "ProductionWorkTypeStore"
		// 	, displayField: 'codeName'
		// 	, valueField: 'systemCode'
		// 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		// });

		//  라인명 검색조건
		//this.addSearchField('name_ko');
		//this.addSearchField('pcs_desc_group');

		this.addSearchField('item_name');
		//this.addSearchField('order_number');
		//this.addSearchField('final_wa_name');
		// this.addSearchField('orderNumber');

		

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();

		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar({
			REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
		});

		this.createStore('Rfx2.model.company.bioprotech.ProducePerformance', [{
			property: 'name_ko',
			direction: 'ASC'
		}],
			gMain.pageSize
			, {}
			, ['pcsmchn']
		);

		var arr = [];
		arr.push(buttonToolbar);
		arr.push(searchToolbar);
		//grid 생성.
		this.createGrid(arr, function () { });


		this.createCrudTab();

		Ext.apply(this, {
			layout: 'border',
			items: [this.grid, this.crudTab]
		});

		this.callParent(arguments);

		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.load(function (records) {
		});
	},
	items: []
});
