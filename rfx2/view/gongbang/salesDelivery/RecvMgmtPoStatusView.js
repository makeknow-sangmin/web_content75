//수주관리 메뉴
Ext.define('Rfx2.view.gongbang.salesDelivery.RecvMgmtPoStatusView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
    inputBuyer: null,
    wthContentStore: Ext.create('Rfx2.store.company.hanjung.WthDrawEtcStore', {}),
    wthContentRecords: null,
    initComponent: function () {
        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_day', '오더일'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
            modelClass: 'Rfx2.model.RecvMgmtBioProtech',
            pageSize: gMain.pageSize,/*pageSize*/
            byReplacer: {},
            deleteClass: ['assymap']
        }, {
            groupField: 'pj_code',
            groupDir: 'DESC',
            sorters: [{
                property: 'pj_code',
                direction: 'asc'
            }],
        });

        // this.createStoreSimple({
        //     modelClass: 'Rfx2.model.RecvMgmtBioProtech',
        //     sorters: [{
        //         property: 'unique_id',
        //         direction: 'DESC'
        //     }],
        //     pageSize: gMain.pageSize,/*pageSize*/
        //     deleteClass: ['assymap']
        // }, {
        //     groupField: 'pj_code'
        // });

        // this.createStoreSimple('Rfx2.model.RecvMgmtBioProtech', [{
        //     property: 'unique_id',
        //     direction: 'DESC'
        // }],
        //     gMain.pageSize/* pageSize */
        //     , {
        //         creator: 'a.creator',
        //         unique_id: 'a.unique_id'
        //     }
        //     , ['assymap']
        // );

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'Y':
                    return 'gray-row';
                    break;
                case 'W':
                    return 'blue-row';
                    break;
                case 'OP':
                    return 'yellow-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
                    return 'white-row';
                    break;
            }
        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //buttonToolbar.insert(1, this.defaultOrderAction);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div><b>수주번호 : <font color=#003471>{name}</b></font> ({rows.length}건)</div>'
            }
        };
        this.createGridCore(arr, option);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
            } else {

            }
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
        });
    },
});
