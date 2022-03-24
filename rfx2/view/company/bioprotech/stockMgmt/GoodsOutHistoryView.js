Ext.define('Rfx2.view.company.bioprotech.stockMgmt.GoodsOutHistoryView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-history-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
   
        this.addSearchField({
            type: 'dateRange',
            field_id: 'reserved_timestamp1',
            text: "출고일자",
            sdate: new Date(new Date().getFullYear() + '-01-01'),
            edate: new Date()
     
        });
        this.addSearchField (
            {
                   xtype: 'combo'
                  ,anchor: '100%'
                  ,width:100
                  ,field_id: 'reserved_varchar4'
                  ,store: "CommonCodeStore"
                  ,params:{parentCode: 'MAT_RELEASE_CATEGORY'}
                  ,displayField: 'codeName'
                  ,valueField: 'systemCode'
                  ,emptyText: '요청구분'
                  ,innerTpl : '<div data-qtip="{systemCode}">{codeName}</div>'
                  ,minChars: 2
            });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
  
      
            

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        this.localSize = gm.unlimitedPageSize;
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.GoodsOutHistory',
            pageSize: this.localSize,
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {},
            deleteClass: ['cartmap']

        }, {});

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var option = {};

        this.gridGoodsOutDetail = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridGoodsOutDetail'),
            store: new Ext.data.Store(),
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            border: true,
            layout: 'fit',
            forceFit: true,
            margin: '0 0 0 0',
            columns: [
                {text: 'LOT NO', width: 80, style: 'text-align:center', dataIndex: 'lotNo', sortable: false},
                {
                    text: '상세출고수량', width: 80, style: 'text-align:center', dataIndex: 'grQty', sortable: false,
                    renderer: function (value, meta) {
                        if (value != null) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return value;
                    }
                }
            ],
            name: 'po'
        });

        //grid 생성.
        this.createGrid(arr, option);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '65%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, {
                    title: '상세정보',
                    collapsible: false,
                    collapsed: false,
                    region: 'east',
                    layout: 'fit',
                    margin: '5 0 0 0',
                    width: '40%',
                    items: [this.gridGoodsOutDetail]
                }
            ]
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index === 1 || index === 3 || index === 4 || index === 2 || index === 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                let rec = selections[0];
                let deliveryInfo = rec.get('delivery_info');

                let store = gu.getCmp('gridGoodsOutDetail').getStore();
                store.removeAll();

                if (deliveryInfo !== null && deliveryInfo.length > 0) {
                    let deliveryInfoSplit = deliveryInfo.split(',');
                    for (let deliveryInfoSub of deliveryInfoSplit) {
                        let deliveryInfoSubSplit = deliveryInfoSub.split(':');
                        store.add({
                            'lotNo': deliveryInfoSubSplit[0],
                            'grQty': deliveryInfoSubSplit[1]
                        });
                    }
                }
            }
        });

        //디폴트 로드
        gm.setCenterLoading(false);
 
      let s_date = new Date(new Date().getFullYear() + '-01-01');
      s_date = Ext.Date.format(s_date,'Y-m-d');
      let e_date = new Date();
      e_date = Ext.Date.format(e_date,'Y-m-d');
       
        this.store.getProxy().setExtraParam('gr_quan_over_zero', 'Y');
        this.store.getProxy().setExtraParam('status', 'G');
        this.store.getProxy().setExtraParam('reserved_timestamp1',s_date + ':' + e_date);
        this.store.load();
    }
});
