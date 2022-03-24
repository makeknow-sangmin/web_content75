Ext.define('Rfx2.view.gongbang.groupWare.AccountsReceivableListVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receivable-list-ver-view',


    initComponent: function () {

        //검색툴바 필드 초기화
		this.initSearchField();
		// this.addSearchField('reserved_varchard');
        // this.addSearchField('pj_name');

        var now = new Date();
        var firstDate;
        var lastDate;
        firstDate = new Date(now.getFullYear(), 1-1, 1);
        lastDate = new Date(now.getFullYear(), now.getMonth() + 1,0);

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: '발행일',
            sdate: firstDate,
            edate: lastDate
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL', 'VIEW']
        });
        var searchToolbar = this.createSearchToolbar();

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.RtgTypeAd', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        var arr = [];
        

        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // CAPAMAP 스토어
        this.curingState = Ext.create('Rfx2.store.company.chmr.ClosalStore', { pageSize: 100 });
        this.projectMoneyIn = Ext.create('Rfx2.store.company.chmr.ProjectMoneyInStore', { pageSize: 100 });
        buttonToolbar.insert(1, this.downloadSheetAction);

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            tooltip: '선택한 양생실의 현황을 다운로드 합니다.',
            disabled: true,
            handler: function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelection();
                var uids = [];
                var selections = rec[0];
                // for (var i = 0; i < rec.length; i++) {
                //     var selections = rec[i];
                //     uids.push(selections.get('unique_id_long'));
                // }
                console_logs('>>>> UIDS', uids);
                var store = Ext.create('Rfx2.store.company.chmr.ClosalStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam('rtgast_uid', selections.get('unique_id_long'))
                store.getProxy().setExtraParam("menuCode", 'ACT4_EXL');

                // store.getProxy().setExtraParam('orderBy', 'item_code');
                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    store.getProxy().setExtraParam(item.name, item.value);
                }
                var arrField = gm.me().gSearchField;
                try {
                    Ext.each(arrField, function (fieldObj, index) {
                        console_log(typeof fieldObj);
                        var dataIndex = '';
                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }
                        var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                        var value = Ext.getCmp(srchId).getValue();
                        if (value != null && value != '') {
                            if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value + '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch (noError) { }

                store.load({
                    scope: this,
                    callback: function (records, operation, success) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params: {
                                mc_codes: gUtil.getMcCodes()
                            },
                            success: function (response, request) {
                                gm.setCenterLoading(false);
                                //console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        buttonToolbar.insert(2, '->');
        // buttonToolbar.insert(5, this.downloadSheetAction);

        this.gridCuring = Ext.create('Ext.grid.Panel', {
            store: this.curingState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            bbar: getPageToolbar(this.curingState),
            border: true,
            region: 'center',
            layout: 'fit',
            flex: 1,
            forceFit: false,
            viewConfig: {
                emptyText: '<div style="text-align:center; padding-top:30% ">조회된 데이터가 없습니다.</div>'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margin: '5 0 0 0',
            columns: [
                { 
                    text: '수주번호', 
                    width: 100, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'pj_code',
                },
                { 
                    text: '품명', 
                    width: 140, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'item_name',
                },
                { 
                    text: '규격', 
                    width: 120, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'concat_spec_desc',
                },
                { 
                    text: '수량',
                    width: 80, 
                    align: 'left',
                    style: 'text-align:center', 
                    dataIndex: 'gr_qty',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '단가', 
                    width: 100, 
                    align: 'left',
                    style: 'text-align:center', 
                    align : 'right',
                    dataIndex: 'sales_price',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '합계', 
                    width: 140, 
                    align: 'left',
                    style: 'text-align:center', 
                    align : 'right',
                    dataIndex: 'total_price',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            name: 'capa',
            autoScroll: true,
            
        });

        var temp2 = {
            title: '매출정산내역',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [this.gridCuring],
            
        };


        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, temp2
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('rec ??????', selections);
                var rec = selections[0];
                var rtgast_uid = rec.get('unique_id_long');
                this.gridCuring.getStore().getProxy().setExtraParam('rtgast_uid', rtgast_uid);
                gm.me().downloadSheetAction.enable();
                this.gridCuring.getStore().load(function (record) {
                });
                gm.me().projectMoneyIn.getProxy().setExtraParam('rtg_type', rec.get('rtg_type'));
                gm.me().projectMoneyIn.getProxy().setExtraParam('combst_uid', rec.get('combst_uid'));
                gm.me().projectMoneyIn.getProxy().setExtraParam('rtgast_uid', rtgast_uid);
                gm.me().projectMoneyIn.load();
            } else {
                gm.me().downloadSheetAction.disable();
            }
        });

        this.gridCuring.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections) {
                    console_logs('curing ??????', selections);
                } else {
                }
            }
        });
    },




});