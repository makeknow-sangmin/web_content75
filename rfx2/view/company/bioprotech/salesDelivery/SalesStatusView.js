//수주관리 메뉴
Ext.define('Rfx2.view.company.bioprotech.salesDelivery.SalesStatusView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
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
        // 검색툴바 생성
        // var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '총 견적가 : '
            }]
        });

        this.createStoreSimple({
            modelClass: 'Rfx2.model.RecvMgmtHanjung',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gMain.pageSize,/*pageSize*/
            deleteClass: ['assymap']
        }, {
            groupField: 'pm_name'
        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            console_logs('c', c);
            switch (c) {
                case 'DC':
                    return 'gray-row';
                    break;
                case 'DE':
                    return 'red-row';
                    break;
                case 'P':
                    return 'orange-row';
                    break;
                case 'W':
                    return 'yellow-row';
                    break;
                case 'Y':
                    return 'blue-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
            }
        });
        //buttonToolbar.insert(1, this.defaultOrderAction);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(buttonToolbar3);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '<div><b>영업사원명 : <font color=#003471>{name}</b></font> ({rows.length}건)</div>'
        });

        var option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div><b>영업사원명 : <font color=#003471>{name}</b></font> ({rows.length}건)</div>'
            }
        };

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            var dataIndex = o['dataIndex'];
            console_logs('this.columns' + i, o);
            switch (dataIndex) {
                case 'estiPriceReal':
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

        this.createGridCore(arr, option);
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            console_logs('>>>>>>> callback datas', selections);
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
            var total_price_sum = 0;
            for (var i = 0; i < records.length; i++) {
                var t_rec = records[i]
                total_price_sum += t_rec.get('estiPriceReal');
            }
            // console_logs('>>>>>> total_price', total_price);
            buttonToolbar3.items.items[1].update('총 견적가 : ' + gUtil.renderNumber(total_price_sum) + '원');
        });
    },

});
