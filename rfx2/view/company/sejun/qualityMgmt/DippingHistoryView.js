Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.sejun.qualityMgmt.DippingHistoryView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'dipping-history-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        // this.addSearchField('seller_name');
        // this.addSearchField('item_code');
        // this.addSearchField('item_name');
        // this.addSearchField('po_no');

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('===>>>>>dataIndex', dataIndex);
            // console_logs('===columnObj', columnObj);
            var qty = 0;
  
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
       	        	       'REGIST', 'COPY', 'REMOVE','EDIT'
       	        	]
       	        	
        });


        Ext.each(this.columns, function (columnObj, index) {
            var o = columnObj;
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'stock_qty_safe':
                case 'totalPrice':
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        if (gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if (summary.length > 0) {
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

        this.createStoreSimple({
            modelClass: 'Rfx.model.DippingModel',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gm.pageSize, /*pageSize*/
        }, {
            groupField: 'po_no',
            groupDir: 'DESC'
        });

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            //console_logs('this.columns' + i, o);
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'gr_qty':
                case 'notGr_qty':
                case 'curGr_qty':
                case 'sales_price':
                case 'sales_price_local':
                case 'total_price':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.##/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);
        //arr.push(buttonToolbar3);


        var option = {
            // features: {
            //     ftype: 'groupingsummary',
            //     groupHeaderTpl: '<div>주문번호 :: <font color=#003471><b>{[values.rows[0].data.po_no]}</b></font> ({rows.length})</div>'
            // }
        };

        console_logs('=>push', arr);

        //grid 생성.
        this.createGridCore(arr, option);
        // this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //this.editAction.setText('입고확인' );


       



        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

        });

        this.grid.on('edit', function (editor, e) {

           
        });

        //디폴트 로드
        gm.setCenterLoading(false);


        this.store.load(function (records) {
            console_logs('>>>>>>>>>********records', records);

            var total_price_sum = 0;
            var total_qty = 0;

            for (var i = 0; i < gm.me().store.data.items.length; i++) {
                var t_rec = gm.me().store.data.items[i];
                total_price_sum += t_rec.get('sales_amount');
                total_qty += t_rec.get('curGr_qty');
            }

        });

    },
    items: [],
    cartmap_uids: [],
    gr_qtys: [],
    poviewType: 'ALL',



   

    selCheckOnly: false,
    selAllowDeselect: true,
    nextRow: false

});
