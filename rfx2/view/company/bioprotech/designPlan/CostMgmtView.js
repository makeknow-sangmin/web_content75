Ext.define('Rfx2.view.company.bioprotech.designPlan.CostMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'tech-docu-mgmt-view',
    initComponent: function () {
        //this.initDefValue();
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField(
        //     {
        //         field_id: 'gubun'
        //         , store: 'BoardGubunStore'
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
        //     });
        // this.addSearchField('unique_id');
        // this.addSearchField('board_title');
        // this.addSearchField('board_content');
        // this.addSearchField('board_name');
        // this.addSearchField('user_id');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        this.createStore('Rfx.model.Board', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize
            , ['cost']
        );
        this.store.getProxy().setExtraParam('gubun', 'TE');
        this.store.load();
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });
        // buttonToolbar.insert(1, this.labRegistAction);
        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        //입력/상세 창 생성.
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid]
        });
        this.callParent(arguments);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            var rec = selections[0];
        });
        //디폴트 로드
        gMain.setCenterLoading(false);
    },
    items: [],
});
