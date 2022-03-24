//생산완료 현황
Ext.define('Rfx2.view.company.chmr.equipState.McCheckResultMonthView', {
    extend       : 'Rfx2.base.BaseView',
    xtype        : 'stock-ino-view',
    inputBuyer   : null,
    preValue     : 0,
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        this.addSearchField({
            field_id      : 'year',
            emptyText     : '연도'
            , store       : 'YearStore'
            , displayField: 'view'
            , valueField  : 'year'
            , innerTpl    : '{view}'
        });

        this.addSearchField('machine_gubun');

        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'EDIT', 'REMOVE'
            ]
        });

        this.createStore('Rfx.model.McReportMonthly', [{
                property : 'item_code',
                direction: 'ASC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment       : 's.comment1'
            },
            ['pcscheck']
        );

        this.createGrid(arr);
        this.createGrid(searchToolbar, buttonToolbar, null
            , [
                {
                    locked: false,
                    arr   : [0, 1, 2, 3, 4]
                },
                {
                    text  : '시기',
                    locked: false,
                    arr   : [5, 6]
                },
                {
                    locked: false,
                    arr   : [7]
                },
                {
                    text  : '월',
                    locked: false,
                    arr   : [8, 9, 10, 11]
                },
                {
                    text  : '월',
                    locked: false,
                    arr   : [12, 13, 14, 15]
                },
                {
                    text  : '월',
                    locked: false,
                    arr   : [16, 17, 18, 19]
                },
            ]);

        var arr = [];
        arr.push(buttonToolbar);
        //grid 생성.
        this.usePagingToolbar = false;
        // this.createGrid(arr);
        // this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items : this.grid
        });

        //버튼 추가.

        this.callParent(arguments);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                console_logs('rec ???', rec);
            } else {

            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('job_map', 'G')
        this.store.load(function (records) {
        });
    },

    comcstStore : Ext.create('Mplm.store.ComCstStore'),
    machineStore : Ext.create('Mplm.store.MachineStore', {}),
    workTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'DAYNIGHT'}),
    wasteTypeStore: Ext.create('Mplm.store.WasteCodeStore'),
    selMode : 'SINGLE',
});