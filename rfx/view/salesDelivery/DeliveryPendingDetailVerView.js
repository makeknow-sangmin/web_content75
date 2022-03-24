//생산완료 현황
Ext.define('Rfx.view.salesDelivery.DeliveryPendingDetailVerView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'delivery-pending-sknh-view',
    inputBuyer: null,
    preValue: 0,
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
            type: 'text',
            field_id: 'po_no',
            emptyText: '요청번호'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4: case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        // this.createStore('Rfx.model.PrdShipmentCartmap', [{
        //     property: 'unique_id',
        //     direction: 'DESC'
        // }],
        //     gm.pageSize
        //     , {
        //         creator: 'a.creator',
        //         unique_id: 'a.unique_id'
        //     }
        //     , ['project']
        // );
        this.createStore('Rfx.model.DeliveryNewPending', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/* pageSize */
        , {
            creator: 'a.creator',
            unique_id: 'a.unique_id'
        }
        // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        , ['assymap']
    );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        //this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentCartmapVerStore', {});


        this.addDlAndSledel = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: gm.getMC('CMD_Configuration_configuration', '팔레트 구성'),
            tooltip: this.getMC('msg_btn_prd_add', '팔레트 구성'),
            disabled: true,
            handler: function () {
                var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                var real_stock_qty = selection.get('stock_qty');
                var pr_quan = selection.get('pr_quan');
                if (pr_quan > real_stock_qty) {
                    Ext.MessageBox.alert('알림', '현 재고보다 요청수량이 큽니다.<br>다시 확인해주세요.');
                    return;
                } else {
                    if (selection.get('ctr_flag') === 'Y') {
                        Ext.MessageBox.alert('알림', '이미 팔레트 적재구성이 진행되었습니다.');
                        return;
                    } else if (selection.get('ctr_flag') === 'D') {
                        Ext.MessageBox.alert('알림', '요청 취소가 진행된 건에 대하여 팔레트 적재처리가 불가능 합니다.');
                        return;
                    } else {
                        gm.me().makePalletEl();
                    }
                }
            }
        });

       

    

        this.printDo = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: gm.getMC('CMD_Shipment_request_report', '출하요청서'),
            tooltip: '출하요청서 출력을 합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgastUid = rec.get('unique_id_long');
                var dl_uids = rec.get('dl_uids');
                var ciNo = rec.get('reserved_varchar2');
                console_logs('>>>> ci', ciNo);
              
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printDo',
                        params: {
                            rtgast_uid: rtgastUid,
                            is_rotate: 'N',
                        },
                        success: function (result, request) {
                            var jsonData = Ext.JSON.decode(result.responseText);
                            var pdfPath = jsonData.pdfPath;
                            console_log(pdfPath);
                            if (pdfPath.length > 0) {
                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                top.location.href = url;
                            }
                            // gm.me().pdfDownload(size, reportSelection, ++pos);
                        },
                        failure: function (result, request) {
                            // var result = result.responseText;
                            // Ext.MessageBox.alert('알림', result);
                        }
                    });
                // }

            }
        });

      


       
        this.makeDlProcess = Ext.create('Ext.Action', {
            // iconCls: 'af-plus',
            text: '납품처리',
            tooltip: '납품처리',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var combstUids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    console_logs('>>> rec', rec);
                    if (i > 0) {
                        var before = selections[i - 1];
                        var after = rec.get('combst_uid');
                        var before_combst = before.get('combst_uid');
                        // console_logs('>>>> bbbbbb', before_combst);
                        // console_logs('>>>>> aaaaaa', after.get('combst_uid'));
                        if (before_combst != after) {
                            Ext.MessageBox.alert('알림', '같은 고객사를 선택하십시오.');
                            isAct = false;
                            break;
                        } else {
                            isAct = true;
                        }
                    } else {
                        isAct = true;
                    }
                }

                if (isAct === true) {
                    var srcahdUids = [];
                    var doUids = [];
                    var cartmapUids =  [];
                    var projectUids  = [];
                    var prQuans = [];
                    var sloastUids = [];
                    var combstUids = [];

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        srcahdUids.push(rec.get('srcahd_uid'));
                        doUids.push(rec.get('do_uid'));
                        cartmapUids.push(rec.get('unique_id_long'));
                        prQuans.push(rec.get('pr_quan'));
                        projectUids.push(rec.get('project_uid'));
                        sloastUids.push(rec.get('sloast_uid'));
                        combstUids.push(rec.get('combst_uid'));
                    }

                    Ext.MessageBox.show({
                        title: '출하완료',
                        msg: '선택한 품목을 출하처리 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no" || btn == "cancel") {
                                return;
                            } else {
                                // var val = form.getValues(false);
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/delivery.do?method=generalDeliveryProcess',
                                    params: {
                                        combst_uids : combstUids,
                                        sloastUids : sloastUids,
                                        projectUids : projectUids,
                                        prQuans : prQuans,
                                        cartmapUids : cartmapUids,
                                        doUids : doUids,
                                        srcahdUids : srcahdUids
                                        // do_uid: rec.get('unique_id_long'),
                                        // pallet_uid: val['pallet_type'],
                                        // pallet_no: 0,
                                        // pallet_cnt: val['pallet_cnt'],
                                        // pallet_detail: val['pallet_detail']
                                    },
                                    success: function (val, action) {
                                        Ext.Msg.alert('완료', '출하 처리가 완료되었습니다.');
                                        gm.me().store.load();
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
              
            }
        });



        

     

        //grid 생성.
        this.usePagingToolbar = false;
        this.createGrid(arr);
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '100%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, /**this.gridContractCompany**/
            ]
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.makeDlProcess);
 
        this.callParent(arguments);
        // buttonToolbar.insert(1, this.barcodePrintAction);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>> selections', selections);
                // this.modifyShipmentAction.enable();
                this.makeDlProcess.enable();
      
                var rec = selections[0];
                console_logs('rec ???', rec);
              
            } else {
             
                this.makeDlProcess.disable();
               
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

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),
    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),
    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' }),

    

   


    selMode: 'SINGLE',

});