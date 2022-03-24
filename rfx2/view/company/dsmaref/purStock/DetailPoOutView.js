Ext.define('Rfx2.view.company.dsmaref.purStock.DetailPoOutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'detail-po-out-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField (
            {
                field_id: 'date_type'
                ,store: "DatetypeStore"
                ,displayField: 'codeName'
                ,valueField: 'systemCode'
                ,emptyText: '기준기간'
                ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField ('po_no');
        this.addSearchField ('seller_name');
        this.addSearchField ('wa_name');
        //this.addSearchField ('item_name_dabp');//(원지는 지종 / 원단은 지종배합)

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addReadonlyField('creator');
        this.addReadonlyField('creator_uid');
        this.addReadonlyField('user_id');
        this.addReadonlyField('board_count');


        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.DetailPo', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
        );

        this.store.getProxy().setExtraParam('route_type', 'OU,U,UC');
        this.store.getProxy().setExtraParam('po_type', 'OU');

        var toolbars = [];
        toolbars.push(buttonToolbar);
        toolbars.push(searchToolbar);
        this.createGrid(toolbars);

        this.grAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: 'ASSY 입고',
            tooltip: 'ASSY 입고',
            disabled: true,
            handler: function() {

                if(gm.me().grid.getSelectionModel().getSelection()[0].get('by_status') != 'Y') {
                    Ext.Msg.alert('', '해당 ASSY의 하위 자재 불출이 완료 되지 않았습니다.');
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        frame: false ,
                        border: false,
                        bodyPadding: 10,
                        region: 'center',
                        layout: 'form',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget: 'side'
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                title: '입고 수량을 정확히 입력하시기 바랍니다.',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('gr_quan'),
                                        anchor: '97%',
                                        name: 'gr_quan',
                                        fieldLabel: '금번 입고수량'
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin =	Ext.create('Ext.Window', {
                        modal : true,
                        title: 'ASSY 입고',
                        width: 450,
                        height: 180,
                        items: form,
                        buttons: [
                            {text: CMD_OK,
                                scope:this,
                                handler:function() {
                                    //첫번째만 갖고 와야 한다.
                                    var selection = gm.me().grid.getSelectionModel().getSelection()[0];

                                    var gr_quan = selection.get('gr_qty');
                                    var pr_quan = selection.get('pr_qty');
                                    var ngr_quan = pr_quan - gr_quan;
                                    var cur_gr_quan = gu.getCmp('gr_quan').getValue();

                                    var cartmap_uid = selection.get('unique_id_long');

                                    if(cur_gr_quan > ngr_quan) {
                                        Ext.Msg.alert('', '입력 수량이 미입고 수량보다 더 많습니다.');
                                    } else {
                                        Ext.Ajax.request({
                                            url : CONTEXT_PATH + '/index/process.do?method=warehouseAssy',
                                            params: {
                                                'cartmap_uid' : cartmap_uid,
                                                'gr_quan' : cur_gr_quan
                                            },
                                            success: function(val, action){
                                                if(prWin){
                                                    prWin.close();
                                                }
                                                gm.me().storeLoad();
                                            },
                                            failure: function(val, action) {
                                                if(prWin){
                                                    prWin.close();
                                                }
                                            }
                                        });
                                    }
                                }},
                            {text: CMD_CANCEL,
                                scope:this,
                                handler:function(){
                                    if(prWin){
                                        prWin.close();
                                    }
                                }}
                        ]
                    });

                    prWin.show();
                }

            } //handler end...
        });

        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            /*text: '제작',*/
            text: '작업지시서 출력',
            tooltip:'작업지시서 출력',
            disabled: true,

            handler: function(widget, event) {
                var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
                var po_no = gMain.selPanel.vSELECTED_PO_NO;
                var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
                var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
                console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
                console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printWoOu',
                    params:{
                        rtgast_uid : rtgast_uid,
                        po_no : po_no,
                        pcs_code : pcs_code,
                        ac_uid : ac_uid,
                        is_heavy : 'Y',	 //중공업:Y  기타:N
                        is_rotate : 'N', //가로양식:Y 세로양식:N
                        wo_type : 'P',
                        pdfPrint : 'pdfPrint'
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success : function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_logs(pdfPath);
                        if(pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                            top.location.href=url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.grAction);
        buttonToolbar.insert(1, this.printPDFAction);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
                gm.me().grAction.enable()
                var rec = selections[0];
                gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('pr_seq');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_PO_NO = rec.get('pj_code');
                gMain.selPanel.printPDFAction.enable();
                gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code');
                gMain.selPanel.vSELECTED_STATE = rec.get('state'); //product의 item_code
            } else {
                gm.me().grAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },

    items : [],
    poviewType: 'ALL'

});

