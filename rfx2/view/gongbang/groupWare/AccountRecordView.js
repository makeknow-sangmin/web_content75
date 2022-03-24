Ext.define('Rfx2.view.gongbang.groupWare.AccountRecordView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-record',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField('yearmonth');

        this.setDefValue('in_date', new Date());

        this.addSearchField({
            type: 'dateRange',
            field_id: 'in_date',
            text: '날짜',
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });

        //검색툴바 생성

        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.AccountsRecord', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
        })

        //디폴트 로드
        gm.setCenterLoading(false);
        var sDate = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
        var eDate = new Date();
        sDate = Ext.Date.format(sDate, 'Y-m-d');
        eDate = Ext.Date.format(eDate, 'Y-m-d');
        this.store.getProxy().setExtraParam('in_date', '%'+sDate + ':' + eDate+'%');
        this.store.load(function (records) {
            console_logs('디폴트 데이터', records);
            if (records != null) {
                for (var i = 0; i < records.length; i++) {
                    var rec = records[i];

                    var jsonArray = rec.get('jsonArray');
                    if (jsonArray != null) {
                        for (var j = 0; j < jsonArray.length; j++) {
                            var o = jsonArray[j];
                            console_logs('o', o);
                            for (var attrname in o) {
                                rec.set(attrname, o[attrname]);
                            }
                        }
                    }
                    console_logs('rec', rec);
                }
            }
        });
    },
    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],
    jsonType: '',

});
