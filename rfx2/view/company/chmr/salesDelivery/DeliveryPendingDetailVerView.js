//생산완료 현황
Ext.define('Rfx2.view.company.chmr.salesDelivery.DeliveryPendingDetailVerView', {
    extend       : 'Rfx2.base.BaseView',
    xtype        : 'delivery-pending-view',
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
            type    : 'checkbox',
            field_id: 'ignoreDate',
            items   : [
                {
                    boxLabel: '날짜조건 해제',
                    checked : false
                },
            ],
        });

        this.addSearchField({
            type    : 'dateRange',
            field_id: 'req_date',
            text    : '출하요청',
            sdate   : Ext.Date.add(new Date(), Ext.Date.DAY, -7),
            edate   : Ext.Date.add(new Date(), Ext.Date.DAY, +6)
        });

        this.addSearchField({
            type     : 'text',
            field_id : 'po_no',
            emptyText: '요청번호'
        });

        this.addSearchField({
            type     : 'text',
            field_id : 'wa_name',
            emptyText: '고객명'
        });

        this.addSearchField({
            type     : 'text',
            field_id : 'pj_name',
            emptyText: '현장명'
        });

        this.addSearchField({
            type    : 'text',
            field_id: 'pj_code',
            // emptyText: '현장명'
        });

        this.addSearchField({
            type    : 'text',
            field_id: 'project_varchar1',
            // emptyText: '현장명'
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
        });

        this.createStore('Rfx2.model.company.chmr.DeliveryPendingDo', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['rtgast']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentCartmapVerStore', {});

        this.deleteDoAction = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : gm.getMC('CMD_DELETE', '삭제'),
            tooltip : this.getMC('msg_btn_prd_add', '삭제'),
            disabled: true,
            handler : function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                Ext.MessageBox.show({
                    title  : '삭제',
                    msg    : '선택한 요청을 삭제 하시겠습니까?<br>우측 리스트에 모두 취소된 건만 삭제됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    icon   : Ext.MessageBox.QUESTION,
                    fn     : function (btn) {
                        if (btn == "yes") {
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/sales/delivery.do?method=deleteDo',
                                params : {
                                    unique_id: rec.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var result_txt = result.responseText;
                                    console_logs('>>>> result ???', result.responseText);
                                    if (result_txt === 'true') {
                                        Ext.MessageBox.alert('알림', '선택 요청이 삭제되었습니다.');
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                    } else {
                                        Ext.MessageBox.alert('알림', '우측 리스트에 대기 또는 생성완료건이 있는 관계로<br>삭제가 취소되었습니다.');
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                    }
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            });
                            return;
                        }
                    }
                });

            }
        });

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype  : 'button',
            iconCls: 'af-excel',
            text   : 'Excel',
            // tooltip: '선택한 양생실의 현황을 다운로드 합니다.',
            disabled: true,
            handler : function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelection();
                var uids = [];
                for (var i = 0; i < rec.length; i++) {
                    var selections = rec[i];
                    uids.push(selections.get('unique_id_long'));
                }
                console_logs('>>>> UIDS', uids);
                var store = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentCartmapVerStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam('do_uids_arr', uids)
                store.getProxy().setExtraParam("menuCode", 'SDL2_EXL');

                store.getProxy().setExtraParam('orderBy', 'item_name');
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
                } catch (noError) {
                }

                store.load({
                    scope   : this,
                    callback: function (records, operation, success) {
                        Ext.Ajax.request({
                            url    : CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params : {
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


        this.createPallet = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : '납품서 생성',
            tooltip : '납품서 생성후 해당 납품서를 납품완료처리 합니다.',
            disabled: true,
            handler : function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var srcahdUids = [];
                var doUids = [];
                var cartmapUids = [];
                var projectUids = [];
                var sloastUids = [];
                var combstUids = [];
                var prQuans = [];
                var head_quarter_outs = [];
                var first_yard_outs = [];
                var second_yard_outs = [];

                var selections_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                for (var i = 0; i < selections_two.length; i++) {
                    var rec = selections_two[i];
                    srcahdUids.push(rec.get('srcahd_uid'));
                    cartmapUids.push(rec.get('unique_id_long'));
                    sloastUids.push(rec.get('sloast_uid'));
                    projectUids.push(rec.get('project_uid'));
                    var pr_quan = rec.get('pr_quan');
                    var remain_qty = rec.get('remain_qty');
                    var compare = remain_qty;

                    var head_quarter_out = (rec.get('head_quarter_out') == undefined || rec.get('head_quarter_out') == null) ? 0.0 : rec.get('head_quarter_out');
                    var first_yard_out = (rec.get('first_yard_out') == undefined || rec.get('first_yard_out') == null) ? 0.0 : rec.get('first_yard_out');
                    var second_yard_out = (rec.get('second_yard_out') == undefined || rec.get('second_yard_out') == null) ? 0.0 : rec.get('second_yard_out');

                    var head_quarter_stock_qty = (rec.get('head_quarter_stock_qty') == undefined || rec.get('head_quarter_stock_qty') == null) ? 0.0 : rec.get('head_quarter_stock_qty');
                    var first_yard_stock_qty = (rec.get('first_yard_stock_qty') == undefined || rec.get('first_yard_stock_qty') == null) ? 0.0 : rec.get('first_yard_stock_qty');
                    var second_yard_stock_qty = (rec.get('second_yard_stock_qty') == undefined || rec.get('second_yard_stock_qty') == null) ? 0.0 : rec.get('second_yard_stock_qty');

                    console_logs('>>>>> head_quarter_stock_qty', head_quarter_stock_qty);
                    console_logs('>>>>> first_yard_out', first_yard_stock_qty);
                    console_logs('>>>>> second_yard_out', second_yard_stock_qty);

                    var input = head_quarter_out + first_yard_out + second_yard_out;
                    if (input === 0) {
                        Ext.MessageBox.alert('알림', '출하수량이 입력되지 않았습니다.');
                        return;
                    } else if (input > compare) {
                        Ext.MessageBox.alert('알림', '출하수량은 (요청수량 - 잔여수량)보다 클 수 없습니다.');
                        return;
                    }

                    if (head_quarter_out > head_quarter_stock_qty) {
                        Ext.MessageBox.alert('알림', '본사창고 출하수량이 현 재고수량보다 큽니다.');
                        return;
                    } else if (first_yard_out > first_yard_stock_qty) {
                        Ext.MessageBox.alert('알림', '1야적장 출하수량이 현 재고수량보다 큽니다.');
                        return;
                    } else if (second_yard_out > second_yard_stock_qty) {
                        Ext.MessageBox.alert('알림', '2야적장 출하수량이 현 재고수량보다 큽니다.');
                        return;
                    }
                    head_quarter_outs.push(head_quarter_out);
                    first_yard_outs.push(first_yard_out);
                    second_yard_outs.push(second_yard_out);
                    prQuans.push(head_quarter_out + first_yard_out + second_yard_out);
                }

                combstUids.push(selections[0].get('order_combst_uid'));
                gm.me().carMgmtStore.getProxy().setExtraParam('menu_code', 'SDL2');
                gm.me().warehouseStore.load();

                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    id           : 'dlForm',
                    frame        : false,
                    border       : false,
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype: 'fieldset',
                            title: '출하 기본정보를 입력하십시오.',
                            items: [
                                {
                                    xtype       : 'combo',
                                    fieldLabel  : '차량정보 선택',
                                    id          : gu.id('carinfo'),
                                    anchor      : '97%',
                                    store       : gm.me().carMgmtStore,
                                    name        : 'carUid',
                                    valueField  : 'unique_id_long',
                                    minChars    : 1,
                                    allowBlank  : false,
                                    displayField: 'disp_carno',
                                    emptyText   : '선택해주세요.',
                                    listConfig  : {
                                        loadingText: '검색중...',
                                        emptyText  : '일치하는 항목 없음',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id_long}">{disp_carno}</div>';
                                        }
                                    }
                                },
                                {
                                    xtype     : 'datefield',
                                    fieldLabel: '납품일자',
                                    id        : gu.id('delivery_date'),
                                    anchor    : '97%',
                                    name      : 'delivery_date',
                                    allowBlank: false,
                                    format    : 'Y-m-d',
                                    value     : new Date()
                                },
                                {
                                    xtype     : 'textfield',
                                    fieldLabel: '참고사항',
                                    allowBlank: true,
                                    id        : gu.id('comment'),
                                    anchor    : '97%',
                                    name      : 'comment',
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '납품완료 처리',
                    width  : 500,
                    height : 300,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                var form = Ext.getCmp('dlForm').getForm();
                                if (form.isValid()) {
                                    Ext.MessageBox.show({
                                        title  : '납품완료',
                                        msg    : '선택 한 건을 출하 처리하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon   : Ext.MessageBox.QUESTION,
                                        fn     : function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                var val = form.getValues(false);
                                                var carUid = gu.getCmp('carinfo').getValue();
                                                var comment = gu.getCmp('comment').getValue();
                                                var delivery_date = gu.getCmp('delivery_date').getValue();
                                                var sYear = delivery_date.getFullYear();
                                                var sMonth = delivery_date.getMonth() + 1;
                                                if (sMonth < 10) {
                                                    sMonth = '0' + sMonth;
                                                }
                                                var sDay = delivery_date.getDate();
                                                if (sDay < 10) {
                                                    sDay = '0' + sDay;
                                                }

                                                var full_date = sYear + '-' + sMonth + '-' + sDay;

                                                Ext.Ajax.request({
                                                    url    : CONTEXT_PATH + '/sales/delivery.do?method=deliveryProcessWhouseEachOut',
                                                    params : {
                                                        combst_uids      : combstUids,
                                                        sloastUids       : sloastUids,
                                                        projectUids      : projectUids,
                                                        prQuans          : prQuans,
                                                        cartmapUids      : cartmapUids,
                                                        doUids           : doUids,
                                                        srcahdUids       : srcahdUids,
                                                        carinfo          : carUid,
                                                        comment          : comment,
                                                        delivery_date    : full_date,
                                                        head_quarter_outs: head_quarter_outs,
                                                        first_yard_outs  : first_yard_outs,
                                                        second_yard_outs : second_yard_outs
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', '납품서 생성이 완료되었습니다.');
                                                        gm.me().store.load();
                                                        gm.me().poPrdDetailStore.load();
                                                        if (prWin) {
                                                            prWin.close();
                                                        }
                                                    },
                                                    failure: function (val, action) {

                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '차량번호가 입력되지 않았습니다.');
                                    return;
                                }
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });
                prWin.show();
            }
        });


        this.reduceQty = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : '수주수량 변경',
            tooltip : '요청 수량 변경 처리 및 수주수량을 변경처리 합니다.',
            disabled: true,
            handler : function () {

                var selections_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                console_logs('>>>> selections_two', selections_two);
                if (selections_two.length > 1) {
                    Ext.MessageBox.alert('알림', '하나의 요청건만 선택 후 실행 가능한 기능입니다.<br>한 개의 건만 선택해주십시오,');
                    return;
                } else {
                    var rec = selections_two[0];
                    var form = Ext.create('Ext.form.Panel', {
                        xtype        : 'form',
                        frame        : false,
                        border       : false,
                        bodyPadding  : 10,
                        region       : 'center',
                        layout       : 'form',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget : 'side'
                        },
                        items        : [
                            {
                                xtype: 'fieldset',
                                title: '요청수량 보다 작은 수량으로 수주수량을 변경하여<br>출하예정 수량을 변경처리합니다.<br><b>본 작업은 실행시 취소할 수 없습니다.</b>',
                                items: [
                                    {
                                        xtype            : 'numberfield',
                                        fieldLabel       : '변경 전 수량',
                                        id               : gu.id('before_qty'),
                                        anchor           : '97%',
                                        name             : 'before_qty',
                                        fieldStyle       : 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                                        editable         : false,
                                        hideTrigger      : true,
                                        keyNavEnabled    : false,
                                        mouseWheelEnabled: false,
                                        value            : rec.get('pr_quan')
                                    },
                                    {
                                        xtype     : 'numberfield',
                                        fieldLabel: '변경수량',
                                        id        : gu.id('reduce_qty'),
                                        anchor    : '97%',
                                        name      : 'reduce_qty',
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '수주수량 변경',
                        width  : 500,
                        height : 260,
                        items  : form,
                        buttons: [
                            {
                                text   : CMD_OK,
                                scope  : this,
                                handler: function () {
                                    Ext.MessageBox.show({
                                        title  : '수주수량 변경',
                                        msg    : '선택한 건을 수량변경처리 하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon   : Ext.MessageBox.QUESTION,
                                        fn     : function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                Ext.Ajax.request({
                                                    url    : CONTEXT_PATH + '/sales/delivery.do?method=reduceReqQty',
                                                    params : {
                                                        cartmap_uid: rec.get('unique_id'),
                                                        sloast_uid : rec.get('sloast_uid'),
                                                        reduce_qty : gu.getCmp('reduce_qty').getValue(),
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', '처리 되었습니다.');
                                                        gm.me().store.load();
                                                        gm.me().poPrdDetailStore.load();
                                                        if (prWin) {
                                                            prWin.close();
                                                        }
                                                    },
                                                    failure: function (val, action) {

                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            },
                            {
                                text   : CMD_CANCEL,
                                scope  : this,
                                handler: function () {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            }
                        ]
                    });

                    prWin.show();
                }


            }
        });


        this.reducePrQuan = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : '요청수량 변경',
            tooltip : '요청수량을 변경처리 합니다.',
            disabled: true,
            handler : function () {
                var selections_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                console_logs('>>>> selections_two', selections_two);
                if (selections_two.length > 1) {
                    Ext.MessageBox.alert('알림', '하나의 요청건만 선택 후 실행 가능한 기능입니다.<br>한 개의 건만 선택해주십시오,');
                    return;
                } else {
                    var rec = selections_two[0];
                    var form = Ext.create('Ext.form.Panel', {
                        xtype        : 'form',
                        frame        : false,
                        border       : false,
                        bodyPadding  : 10,
                        region       : 'center',
                        layout       : 'form',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget : 'side'
                        },
                        items        : [
                            {
                                xtype: 'fieldset',
                                title: '요청수량 보다 작은 수량으로 요청수량을 변경하여<br>잔여수량을 조절하여 출하가능수량을 조정합니다.<br><b>본 작업은 실행시 취소할 수 없습니다.</b>',
                                items: [
                                    {
                                        xtype            : 'numberfield',
                                        fieldLabel       : '변경 전 수량',
                                        id               : gu.id('before_qty'),
                                        anchor           : '97%',
                                        name             : 'before_qty',
                                        fieldStyle       : 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                                        editable         : false,
                                        hideTrigger      : true,
                                        keyNavEnabled    : false,
                                        mouseWheelEnabled: false,
                                        value            : rec.get('pr_quan')
                                    },
                                    {
                                        xtype     : 'numberfield',
                                        fieldLabel: '변경수량',
                                        id        : gu.id('reduce_qty'),
                                        anchor    : '97%',
                                        name      : 'reduce_qty',
                                        value     : (rec.get('pr_quan') - rec.get('remain_qty'))
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '요청수량 변경',
                        width  : 500,
                        height : 260,
                        items  : form,
                        buttons: [
                            {
                                text   : CMD_OK,
                                scope  : this,
                                handler: function () {
                                    Ext.MessageBox.show({
                                        title  : '요청수량 변경',
                                        msg    : '선택한 건을 수량변경처리 하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon   : Ext.MessageBox.QUESTION,
                                        fn     : function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                var inputValue = gu.getCmp('reduce_qty').getValue();
                                                var compareValue = rec.get('sledel_gr_qty_sum');
                                                console_logs('>>>> aaa', inputValue);
                                                console_logs('>>>> bbb', compareValue)
                                                if (inputValue > compareValue) {
                                                    Ext.MessageBox.alert('알림', '수량 변경이 가능한 범위를 넘어갔습니다.<br>다시 확인해주세요.');
                                                    return;
                                                } else {
                                                    Ext.Ajax.request({
                                                        url    : CONTEXT_PATH + '/sales/delivery.do?method=reducePrQuan',
                                                        params : {
                                                            cartmap_uid: rec.get('unique_id'),
                                                            reduce_qty : gu.getCmp('reduce_qty').getValue(),
                                                        },
                                                        success: function (val, action) {
                                                            Ext.Msg.alert('완료', '처리 되었습니다.');
                                                            gm.me().store.load();
                                                            gm.me().poPrdDetailStore.load();
                                                            if (prWin) {
                                                                prWin.close();
                                                            }
                                                        },
                                                        failure: function (val, action) {

                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            },
                            {
                                text   : CMD_CANCEL,
                                scope  : this,
                                handler: function () {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            }
                        ]
                    });

                    prWin.show();
                }


            }
        });

        this.addDeliveryProductAdd = Ext.create('Ext.Action', {
            iconCls : 'af-plus',
            text    : '출하제품 추가',
            tooltip : '출하제품이 변경되었을 경우 출하요청에 출하제품을 추가한 후 납품처리를 합니다.',
            disabled: true,
            handler : function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('>>>> selections_two', selections);
                if (selections.length === 1) {
                    let rec = selections[0];
                    let bHeight = 500;
                    let bWidth = 700;
                    let productAddStore = Ext.create('Rfx2.store.company.chmr.ProductAddStore');
                    productAddStore.load();
                    let uid_srcahd = -1;


                    this.itemSearchAction = Ext.create('Ext.Action', {
                        iconCls : 'af-search',
                        text    : CMD_SEARCH/*'검색'*/,
                        tooltip : CMD_SEARCH/*'검색'*/,
                        disabled: false,
                        handler : function () {
                            let extraParams = noStockMaterialStore.getProxy().getExtraParams();
                            if (Object.keys(extraParams).length === 0) {
                                productAddStore.load();
                            } else {
                                productAddStore.load();
                            }
                        }
                    });

                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store      : productAddStore,
                        cls        : 'rfx-panel',
                        multiSelect: false,
                        autoScroll : true,
                        border     : false,
                        height     : 100,
                        title      : '추가할 제품을 선택하십시오.',
                        padding    : '0 0 5 0',
                        flex       : 1,
                        layout     : 'fit',
                        forceFit   : false,
                        listeners  : {
                            select: function (selModel, record) {
                                uid_srcahd = record.get('unique_id_long');
                            }
                        },
                        bbar       : getPageToolbar(productAddStore),
                        dockedItems: [
                            {
                                dock : 'top',
                                xtype: 'toolbar',
                                style: 'background-color: #EFEFEF;',
                                items: [
                                    {
                                        field_id       : 'search_item_code',
                                        width          : 190,
                                        fieldStyle     : 'background-color: #D6E8F6; background-image: none; ',
                                        id             : gu.id('search_item_code_part'),
                                        name           : 'search_item_code',
                                        margin         : '3 3 3 3',
                                        xtype          : 'triggerfield',
                                        emptyText      : '품번',
                                        trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');

                                        },
                                        listeners      : {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() === Ext.EventObject.ENTER) {
                                                    productAddStore.load();
                                                }
                                            },
                                            change    : function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    productAddStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                                } else {
                                                    delete productAddStore.proxy.extraParams.item_code;
                                                }
                                            },
                                            render    : function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html  : c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id       : 'search_item_name',
                                        width          : 190,
                                        fieldStyle     : 'background-color: #D6E8F6; background-image: none;',
                                        id             : gu.id('search_item_name_part'),
                                        name           : 'search_item_name',
                                        xtype          : 'triggerfield',
                                        margin         : '3 3 3 3',
                                        emptyText      : '품명',
                                        trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners      : {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() === Ext.EventObject.ENTER) {
                                                    productAddStore.load();
                                                }
                                            },
                                            change    : function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    productAddStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                                } else {
                                                    delete productAddStore.proxy.extraParams.item_name;
                                                }
                                            },
                                            render    : function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html  : c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id       : 'search_specification',
                                        width          : 190,
                                        fieldStyle     : 'background-color: #D6E8F6; background-image: none;',
                                        id             : gu.id('serarch_description_part'),
                                        name           : 'serarch_description',
                                        xtype          : 'triggerfield',
                                        margin         : '3 3 3 3',
                                        emptyText      : '규격',
                                        trigger1Cls    : Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners      : {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() === Ext.EventObject.ENTER) {
                                                    productAddStore.load();
                                                }
                                            },
                                            change    : function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    productAddStore.getProxy().setExtraParam('description', '%' + e + '%');
                                                } else {
                                                    delete productAddStore.proxy.extraParams.specification;
                                                }
                                            },
                                            render    : function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html  : c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    '->',
                                    this.itemSearchAction
                                ]
                            }
                        ],
                        columns    : [
                            {
                                text     : '품번',
                                width    : 120,
                                style    : 'text-align:center',
                                dataIndex: 'item_code'
                            },
                            {
                                text     : '품명',
                                width    : 270,
                                style    : 'text-align:center',
                                dataIndex: 'item_name',
                                renderer : function (value) {
                                    return value.replace(/</gi, "&lt;");
                                }
                            },
                            {
                                text     : '규격',
                                width    : 270,
                                style    : 'text-align:center',
                                dataIndex: 'desc_concat_spec'
                            }
                        ],

                    });


                    gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                        xtype      : 'form',
                        width      : bWidth,
                        height     : bHeight,
                        bodyPadding: 10,
                        layout     : {
                            type : 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults   : {
                            allowBlank: true,
                            msgTarget : 'side',
                            labelWidth: 60
                        },
                        items      : [
                            this.gridViewTable,

                            {
                                xtype     : 'numberfield',
                                name      : 'add_qty',
                                id        : gu.id('add_qty'),
                                fieldLabel: '출하요청<br>수량',
                                allowBlank: false,
                            },

                        ],
                    });

                    let myMask = new Ext.LoadMask({
                        msg   : 'Please wait...',
                        target: gm.me().createPartForm
                    });

                    let winPart = Ext.create('ModalWindow', {
                        title    : '출하제품 추가',
                        width    : bWidth,
                        height   : 650,
                        minWidth : 250,
                        minHeight: 180,
                        overflowY: true,
                        items    : [gm.me().createPartForm
                        ],
                        buttons  : [{
                            text   : CMD_OK,
                            handler: function () {
                                let form = gm.me().createPartForm;
                                if (form.isValid()) {
                                    if (uid_srcahd === -1) {
                                        Ext.MessageBox.alert('알림', '제품이 선택되지 않았습니다.');
                                    } else {
                                        Ext.MessageBox.show({
                                            title  : '출하제품 추가',
                                            msg    : '선택한 제품을 출하요청서로 추가하겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (btn) {
                                                if (btn === 'yes') {
                                                    let project_uid = rec.get('project_uid');
                                                    let do_uid = rec.get('unique_id_long');
                                                    let add_qty = gu.getCmp('add_qty').getValue()

                                                    myMask.show();
                                                    Ext.Ajax.request({
                                                        url    : CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryOrderList',
                                                        params : {
                                                            project_uid    : project_uid,
                                                            do_uid        : do_uid,
                                                            srcahd_uid    : uid_srcahd,
                                                            add_qty : add_qty
                                                        },
                                                        success: function (result) {
                                                            let resultText = result.responseText;
                                                            if (winPart) {
                                                                winPart.close();
                                                            }
                                                            gm.me().getStore().load(function () {
                                                            });
                                                            gm.me().poPrdDetailStore.load();
                                                        },
                                                        failure: extjsUtil.failureMessage
                                                    });//endof ajax request
                                                }
                                            },
                                            icon   : Ext.MessageBox.QUESTION
                                        });
                                        // winPart.loadMask(false);
                                    }
                                } else {
                                    Ext.MessageBox.alert('알림', '입고 자재가 선택되지 않았습니다.');
                                }
                            }
                        }, {
                            text   : CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show();

                } else {
                    Ext.MessageBox.alert('알림', '하나의 출하요청만 선택이 가능합니다.');
                }
            }
        });


        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls         : 'rfx-panel',
            id          : gu.id('gridContractCompany'),
            store       : this.poPrdDetailStore,
            viewConfig  : {
                markDirty: false
            },
            collapsible : false,
            multiSelect : false,
            simpleSelect: false,
            region      : 'center',
            autoScroll  : true,
            autoHeight  : true,
            flex        : 0.5,
            frame       : true,
            // bbar: getPageToolbar(this.poPrdDetailStore),
            border  : true,
            layout  : 'fit',
            forceFit: false,
            plugins : {
                ptype       : 'cellediting',
                clicksToEdit: 1
            },

            selModel: Ext.create('Ext.selection.CheckboxModel', {
                mode: 'MULTI'
            }),

            margin     : '0 0 0 0',
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls  : 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id   : gu.id('selectedMtrl'),
                            html : this.getMC('msg_reg_prd_info_detail', '등록된 요청을 선택하십시오.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.createPallet,
                        this.reduceQty,
                        this.reducePrQuan,
                        this.addDeliveryProductAdd
                    ]
                }

            ],
            columns    : [
                {
                    text     : this.getMC('msg_order_grid_prd_name', '품명'),
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'srcahd_item_name',
                    sortable : true
                },
                {
                    text     : this.getMC('msg_order_grid_prd_name', '규격'),
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'concat_desc_spec',
                    sortable : true
                },
                {text: '단위', width: 50, style: 'text-align:center', dataIndex: 'srcahd_unit_code', sortable: true},
                {
                    text    : '요청한수량', width: 100, style: 'text-align:center', dataIndex: 'pr_quan', align: 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : '출하된수량',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'sledel_gr_qty_sum',
                    align    : 'right',
                    renderer : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text    : '잔여수량', width: 100, style: 'text-align:center', dataIndex: 'remain_qty', align: 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : '재고수량',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'real_stock_qty_stosum',
                    align    : 'right',
                    renderer : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : '본사 출하수량',
                    width    : 120,
                    style    : 'text-align:center',
                    dataIndex: 'head_quarter_out',
                    align    : 'right',
                    editor   : 'numberfield',
                    renderer : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : '1야적장 출하수량',
                    width    : 120,
                    style    : 'text-align:center',
                    dataIndex: 'first_yard_out',
                    align    : 'right',
                    editor   : 'numberfield',
                    renderer : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : '2야적장 출하수량',
                    width    : 120,
                    style    : 'text-align:center',
                    dataIndex: 'second_yard_out',
                    align    : 'right',
                    editor   : 'numberfield',
                    renderer : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {text: '납품요구번호', width: 100, style: 'text-align:center', dataIndex: 'project_varchard', sortable: true},
                {
                    text            : this.getMC('msg_order_grid_prd_unitprice', '단가'),
                    width           : 100, style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex       : 'sales_price',
                    sortable        : true,
                    align           : 'right',
                    editor          : 'numberfield',
                    renderer        : function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : this.getMC('msg_order_grid_prd_delivery_date', '납기예정일'),
                    xtype    : 'datecolumn',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'req_delivery_date',
                    sortable : true,
                    format   : 'Y-m-d',
                },
            ],
            viewConfig : {
                getRowClass: function (record, index) {
                    var c = record.get('ctr_flag');
                    if (c == 'Y') {
                        return 'yellow-row'
                    }
                    if (c == 'D') {
                        return 'red-row'
                    }
                }
            },
            listeners  : {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    console_logs('e.record >>>>>>> ', e.record);
                    var unique_id = e.record.get('sloast_uid');
                    var sales_price = e.record.get('sales_price');
                    var po_qty = e.record.get('pr_quan');
                    var sales_amount = sales_price * po_qty;
                    if (columnName === 'sales_price') {
                        gm.me().editSalesPrice(unique_id, sales_price, sales_amount);
                        gm.me().poPrdDetailStore.load();
                    }
                },

                // listeners: {
                itemdblclick: function (dv, record, item, index, e) {
                    var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('>>>> rec dbclick', rec);
                    var detailStore = Ext.create('Rfx2.store.company.chmr.ProductStockStore', {});
                    detailStore.getProxy().setExtraParam('standard_flag', 'A');
                    detailStore.getProxy().setExtraParam('uid_srcahd', rec.get('srcahd_uid'));
                    detailStore.getProxy().setExtraParam('orderBy', 'wh_code');
                    detailStore.load();
                    var loadForm = Ext.create('Ext.grid.Panel', {
                        store      : detailStore,
                        id         : gu.id('loadForm'),
                        layout     : 'fit',
                        region     : 'center',
                        style      : 'padding-left:0px;',
                        columns    : [
                            {
                                text     : "창고명",
                                flex     : 1,
                                style    : 'text-align:center',
                                dataIndex: 'wh_name',
                                sortable : true
                            },
                            {
                                text     : "수량",
                                flex     : 1,
                                dataIndex: 'wh_qty',
                                align    : 'right',
                                style    : 'text-align:center',
                                sortable : true
                            },
                        ],
                        renderTo   : Ext.getBody(),
                        autoScroll : true,
                        multiSelect: true,
                        pageSize   : 100,
                        width      : 500,
                        height     : 400,
                    });

                    var winProduct = Ext.create('ModalWindow', {
                        title    : '창고별 재고현황',
                        width    : 500,
                        height   : 400,
                        minWidth : 400,
                        minHeight: 300,
                        items    : [
                            loadForm
                        ],
                        buttons  : [{
                            text   : CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }]
                    });
                    winProduct.show();
                },

                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                }
            },
            title      : this.getMC('mes_reg_prd_info_msg', '출하요청 제품리스트'),
            name       : 'po',
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'delivery_quan':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'head_quarter_out':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'first_yard_out':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'second_yard_out':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'head_quarter_out':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'first_yard_out':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'second_yard_out':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                default:
                    break;
            }
        });
        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    console_logs('>>>> selections', selections);
                    gm.me().createPallet.enable();
                    gm.me().reduceQty.enable();
                    gm.me().reducePrQuan.enable();
                } else {
                    gm.me().createPallet.disable();
                    gm.me().reduceQty.disable();
                    gm.me().reducePrQuan.disable();
                }
            }
        });

        //grid 생성.
        this.usePagingToolbar = false;
        this.createGrid(arr);
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items : [
                {
                    collapsible: false,
                    frame      : false,
                    region     : 'west',
                    layout     : {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    margin     : '5 0 0 0',
                    width      : '50%',
                    items      : [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width : '100%',
                        items : [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.deleteDoAction);
        buttonToolbar.insert(11, this.downloadSheetAction);
        this.callParent(arguments);
        // buttonToolbar.insert(1, this.barcodePrintAction);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            var rtgast_uids = [];

            if (selections.length > 0) {
                console_logs('>>>> selections', selections);
                this.deleteDoAction.enable();
                this.downloadSheetAction.enable();
                this.addDeliveryProductAdd.enable();
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    console_logs('rec >>>', rec);
                    if (i === 0) {
                        var rec = selections[i];
                        rtgast_uids.push(rec.get('unique_id_long'));

                    } else {
                        var prev_rec = selections[i - 1];
                        var present_rec = selections[i];
                        var prev_pj_uid = prev_rec.get('pj_code');
                        var present_pj_uid = present_rec.get('pj_code');
                        if (prev_pj_uid === present_pj_uid) {
                            rtgast_uids.push(rec.get('unique_id_long'));
                        }
                    }
                }

                console_logs('rtgast_uids ???', rtgast_uids);
                gu.getCmp('selectedMtrl').setHtml('[' + rec.get('po_no') + '] ' + rec.get('wa_name'));
                this.poPrdDetailStore.getProxy().setExtraParam('rtgast_uids', rtgast_uids);
                this.poPrdDetailStore.load();
            } else {
                this.deleteDoAction.disable();
                this.downloadSheetAction.disable();
                this.addDeliveryProductAdd.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.getProxy().setExtraParam('exist_pallet_cnt', false);
        this.store.getProxy().setExtraParam('paging_not_use', true);
        this.store.load(function (records) {
        });
    },

    searchDetailStore          : Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore                   : Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore                : Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore           : Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore                : Ext.create('Mplm.store.UserStore', {}),
    payTermsStore              : Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore             : Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore         : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore      : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore           : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),
    searchPrdStore             : Ext.create('Mplm.store.MaterialSearchStore', {type: 'PRD'}),
    searchAssyStore            : Ext.create('Mplm.store.MaterialSearchStore', {type: 'ASSY'}),
    searchItemStore            : Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore            : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),
    selMode                    : 'SINGLE',
    workListStore              : Ext.create('Rfx2.store.company.bioprotech.PStockOfProdStore'),
    palletListStore            : Ext.create('Rfx2.store.company.bioprotech.PalletListStore'),
    carMgmtStore               : Ext.create('Mplm.store.CarMgntStore'),
    warehouseStore             : Ext.create('Mplm.store.WareHouseStore'),
    selMode                    : 'multi',
    editSalesPrice             : function (unique_id, sales_price, sales_amount) {
        Ext.Ajax.request({
            url    : CONTEXT_PATH + '/sales/buyer.do?method=updateSalesPriceBySledel',
            params : {
                unique_id   : unique_id,
                sales_price : sales_price,
                sales_amount: sales_amount
            },
            success: function (result, request) {
                console_logs('price setting status', 'OK');
            },
            failure: extjsUtil.failureMessage
        });
    },
});