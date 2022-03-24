/*
    Rfx2.view.gongbang.produceMgmt.ProduceStatusVersionView
*/
Ext.define('Rfx2.view.company.daeji.foPurchaseMgmt.L3', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
    initComponent: function () {
        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'isOnlyAssembly',
        //     items: [
        //         {
        //             boxLabel: gm.getMC('CMD_Assy_Only', '반제품현황만'),
        //             checked: false
        //         },
        //     ],
        // });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_day', '오더일'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        // this.addSearchField({
        //     type: 'combo',
        //      field_id: 'product_group'
        //     , emptyText: gm.getMC('CMD_Product', '제품군')
        //     , store: "CommonCodeStore"
        //     , params: { parentCode: 'PRD_GROUP' }
        //     , displayField: 'code_name_kr'
        //     , valueField: 'system_code'
        //     , value: 'code_name_kr'
        //     , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        // });

        // this.addSearchField({
        // 	type: 'combo'
        // 	, field_id: 'reserved5'
        // 	, store: "ProductionSiteStore"
        // 	, displayField: 'codeName'
        // 	, valueField: 'systemCode'
        // 	, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        // });

        //this.addSearchField('order_number');
        this.addSearchField('item_name');
        this.addSearchField('wa_name');
        //this.addSearchField('final_wa_name');


        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        is_rotate = 'N';

        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '작업지시서 출력',
            disabled: true,
            handler: function (widget, event) {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                if (/**rec.get('status') == 'OP' || **/rec.get('status') == 'W') {
                    // CARTMAP 하나에 RTGAST가 여러개 있을 가능성도 있으므로 기존것 시용 불가
                    var rtgastUids = rec.get('rtgastUids');
                    var ac_uid = rec.get('ac_uid');
                    var rtgastUidsArr = rtgastUids.split(',');
                    console_logs('arr ????', rtgastUidsArr);
                    if (rtgastUidsArr.length > 0) {
                        gm.me().pdfDownload(rtgastUidsArr.length, ac_uid, rtgastUidsArr, 0);
                    }
                } else {
                    Ext.MessageBox.alert('', '상태가 생산 중 일떄 작업지시서를 출력 하실 수 있습니다.');
                    return;
                }
            }
        });
        this.setRowClass(function (record, index) {
            var c = record.get('delivery_quan');
            if (c > 0) {
                return 'blue-row';
            }
        });

        this.createStore('Rfx2.model.ProduceStateVersionMgmt', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['cartmap']
        );

        // this.setRowClass(function (record, index) {
        //     var c = record.get('status');
        //     switch (c) {
        //         case 'Y':
        //             return 'green-row';
        //             break;
        //         case 'W':
        //             return 'blue-row';
        //             break;
        //         case 'OP':
        //             return 'yellow-row';
        //             break;
        //         case 'CR':
        //             return 'white-row';
        //             break;
        //         default:
        //             return 'white-row';
        //             break;
        //     }
        // });

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

        console_log("---------------------------------------------------------");

        // this.columns.push({
        //     text: "자재가용성", width: 100, resizable: false,
        //     dataIndex: 'stock_posible', sortable: true, align: 'center', useYn: true,
        //     rowIndex : 15000,
        //     renderer: function (value, metaData, record, rowIndex, colIndex, store) {
        //         console.log(value);
        //         switch (value) {
        //             case 0:
        //                 metaData.css = 'traffic-red';
        //                 break;
        //             case 1:
        //                 metaData.css = 'traffic-green';
        //                 break;
        //             case 2:
        //                 metaData.css = 'traffic-yellow';
        //                 break;
        //             default:
        //                 metaData.css = 'traffic-grey';
        //                 break;
        //         }
        //         return '';     // Do not return anything so only the cell's background is visible
        //     }
        // });

        var cols = this.columns;
        console_logs('cols', cols);
        for (var i = 0; i < cols.length; i++) {
            var o = cols[i];
            console_logs('==============> column o', o);
            if (i === cols.length) {

            }
        }

        // this.columns.reconfigure(this.columns);


        console_log("---------------------------------------------------------");

        this.createGridCore(arr/** , option**/);
        // buttonToolbar.insert(1, this.printPDFAction);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                gm.me().printPDFAction.enable();
            } else {
                gm.me().printPDFAction.disable();
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

    pdfDownload: function (size, ac_uid, reportSelection, pos) {
        if (size > pos) {
            var unique_id = reportSelection[pos];
            console_logs('uid>>>> ', unique_id);
            gMain.setCenterLoading(true);
            Ext.Ajax.request({
                waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/pdf.do?method=printWo',
                params: {
                    rtgast_uid: unique_id,
                    po_no: '',
                    pcs_code: '',
                    ac_uid: ac_uid,
                    is_heavy: 'Y',	 //중공업:Y  기타:N
                    is_rotate: is_rotate, //가로양식:Y 세로양식:N
                    wo_type: 'P',
                    pdfPrint: 'pdfPrint'
                },
                reader: {
                    pdfPath: 'pdfPath'
                },
                success: function (result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var pdfPath = jsonData.pdfPath;
                    console_log(pdfPath);
                    if (pdfPath.length > 0) {
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                        top.location.href = url;
                    }
                    gm.me().pdfDownload(size, ac_uid, reportSelection, ++pos);
                    gMain.setCenterLoading(false);
                },
                failure: function (val, action) {
                    gMain.setCenterLoading(false);
                    Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
                }
            });
        }
    },
});
