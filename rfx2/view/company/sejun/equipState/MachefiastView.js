//설비속성(자이솜연동)현황
var gmEfiastGrid;
Ext.define('Rfx2.view.company.sejun.equipState.MachefiastView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'machine-view',
	initComponent: function () {

        gmEfiastGrid = this;
		//검색툴바 필드 초기화
		this.initSearchField();

		// this.addSearchField({
		// 	type: 'combo'
		// 	, field_id: 'mchn_type'
		// 	, emptyText: '라인유형'
		// 	, store: "PcsLineTypeStore"
		// 	, displayField: 'codeName'
		// 	, valueField: 'systemCode'
		// 	, value: 'mchn_type'
		// 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		// });

		this.addSearchField('mchn_code');
		//this.addSearchField('name_ko');
		//this.addSearchField('prop_name');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();

		//명령툴바 생성
		buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 3: case 4: case 5: /* case2 수정버튼 */
                buttonToolbar.items.remove(item);
                break;
                default:
                    break;
            }
        });

		this.createStore('Rfx2.store.company.sejun.Machine', [{
			property: 'name_ko',
			direction: 'ASC'
		}],
			gMain.pageSize
			, {}
			, ['efiast'] 
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
	items: [],

	// listeners: {
    //     afterrender: function () {
    //         var meStore = this.store;

    //         var pageStartRowNum = 0, pageLimit = 15, pageTotalRowCount = 0;

    //         var runner = new Ext.util.TaskRunner();
    //         siloStatusTask = runner.newTask({
    //             run: function () {
    //                 pageTotalRowCount = gmEfiastGrid.store.totalCount;
    //                 pageStartRowNum += pageLimit;

    //                 if(pageStartRowNum >= pageTotalRowCount) {
    //                     pageStartRowNum = 0;
    //                 }

    //                 gmEfiastGrid.store.load({
    //                     params: {
    //                         start: pageStartRowNum,
    //                         limit: pageLimit
    //                     }
    //                 });
    //             },
    //             interval: 10000 //10초
    //         });

    //         siloStatusTask.start();
    //     },
    // },

    onDestroy: function () {
        //siloStatusTask.destroy();
    },

});
