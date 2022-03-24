//수주관리 메뉴
Ext.define('Rfx2.view.company.dsmaref.goodsManage.RecvMgmtDsmfPrdView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-dsmf-prd-view',
    inputBuyer: null,
    initComponent: function () {

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.

        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'status'
                , store: "RecevedStateStore"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'pm_uid'
                , store: "UserDeptStore"
                , displayField: 'user_name'
                , valueField: 'unique_id'
                , value: vCUR_USER_UID
                , params: {dept_code: "D104"}
                , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
            });

        this.addSearchField('reserved_varchar6');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'quan':
                case 'sales_price':
                case 'selling_price':
                case 'bm_quan':
                    o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                        if(gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if(summary.length > 0) {
                                var objSummary = Ext.decode(summary);
                                return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                            } else {
                                return 0;
                            }
                        } else {
                            return 0;
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        var option = {
            features: [{
                ftype: 'summary',
                dock: 'top'
            }]
        };

        this.defaultOrderAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문미납현항',
            tooltip: '주문미납현항',
            disabled: false,
            handler: function () {

            }
        });

        this.createStore('Rfx2.model.RecvMgmtKbTech', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
                    break;
                case 'P':
                    return 'orange-row';
                    break;
                case 'DE':
                    return 'red-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
            }

        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //buttonToolbar.insert(1, this.defaultOrderAction);

        // 그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        // 버튼 추가.

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);


        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('not_pj_type', 'OU');

        this.store.load(function (records) {
        });


    }
});
