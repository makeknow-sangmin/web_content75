//설비현황
Ext.define('Rfx2.view.company.sejun.equipState.MachineView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'machine-view',
	initComponent: function () {

		//검색툴바 필드 초기화
		this.initSearchField();

		this.addSearchField({
			type: 'combo'
			, field_id: 'mchn_type'
			, emptyText: '라인유형'
			, store: "PcsLineTypeStore"
			, displayField: 'codeName'
			, valueField: 'systemCode'
			, value: 'mchn_type'
			, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});

		this.addSearchField('mchn_code');
		this.addSearchField('name_ko');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();

		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();

		this.createStore('Rfx.model.Machine', [{
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
