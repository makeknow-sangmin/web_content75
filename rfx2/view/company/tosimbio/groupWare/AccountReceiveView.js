Ext.define('Rfx2.view.company.bioprotech.groupWare.AccountReceiveView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receive',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('yearmonth');
        this.addSearchField('buyer_name');
        this.addSearchField('saleman_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.AccountReceive', [{
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
            if (index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });


        //추가 주문작성 Action 생성
        this.addMonAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '입금 추가',
            tooltip: '입금 추가 하기',
            disabled: false,
            handler: function () {

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [{
                        xtype: 'fieldset',
                        collapsible: false,
                        width: '100%',
                        style: 'padding:10px',
                        defaults: {
                            width: '100%',
                            layout: {
                                type: 'hbox'
                            }
                        },
                        items: [
                            {
                                fieldLabel: '입금일자',
                                name: 'in_date',
                                anchor: '100%',
                                xtype: 'datefield',
                                value: new Date()
                            }, {
                                fieldLabel: '입금처',
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'buyer_uid',
                                store: Ext.create('Mplm.store.BuyerStore', {}),
                                displayField: 'wa_name',
                                valueField: 'unique_id',
                                emptyText: '두글자 이상 입력',
                                allowBlank: false,
                                sortInfo: {
                                    field: 'create_date',
                                    direction: 'DESC'
                                },
                                typeAhead: false,
                                minChars: 2,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{wa_code} | {wa_name}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {

                                    }
                                }
                            },
                            {
                                fieldLabel: '입금액',
                                name: 'money',
                                anchor: '100%',
                                xtype: 'numberfield',
                            },
                            {
                                fieldLabel: '은행',
                                xtype: 'textfield',
                                rows: 4,
                                anchor: '100%',
                                name: 'reserved_varchar1'
                            },
                            {
                                fieldLabel: '계좌번호',
                                xtype: 'textfield',
                                anchor: '100%',
                                name: 'po_no'
                            },
                            {
                                fieldLabel: '메모',
                                xtype: 'textarea',
                                rows: 4,
                                anchor: '100%',
                                name: 'reserved_varchar2'
                            }
                        ]
                    }]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입금 추가',
                    width: 500,
                    height: 360,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {

                                } // end of formvalid 
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();


            } //handler end...

        });


        buttonToolbar.insert(3, this.addMonAction);


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {

                var rec = selections[0];
                gm.me().rec = rec;
                console_logs('rec 데이터', rec);
                var standard_flag = rec.get('standard_flag');
                standard_flag = gu.stripHighlight(standard_flag);  //하이라이트 삭제

                console_logs('그리드온 데이터', rec);
                gm.me().request_date = rec.get('req_date'); // 납기일
                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
                gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
                gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
                gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
                gm.me().vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
                gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
                gm.me().vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
                gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
                gm.me().vSELECTED_item_name = rec.get('item_name');    // 원지: 지종,  원단 : 지종배합, 부자재 : 품명
                gm.me().vSELECTED_description = rec.get('description');   // 평량
                gm.me().vSELECTED_remark = rec.get('remark');    // 장
                gm.me().vSELECTED_req_date = rec.get('delivery_plan');
                gm.me().vSELECTED_quan = rec.get('pr_quan');
                gm.me().vSELECTED_comment = rec.get('comment');   // 폭
                gm.me().vSELECTED_req_info = rec.get('req_info');  //비고
                gm.me().vSELECTED_request_comment = rec.get('request_comment');  //전달 특기사항
                gm.me().vSELECTED_reserved_varcharb = rec.get('reserved_varcharb'); //칼날 사이즈
                gm.me().vSELECTED_project_double3 = rec.get('project_double3'); //판걸이 수량
                gm.me().vSELECTED_specification = rec.get('specification');  //부자재 규격
                gm.me().vSELECTED_pj_description = rec.get('pj_description');
                gm.me().vSELECTED_srcahduid = rec.get('unique_id');  //srcahd uid
                gm.me().vSELECTED_lot_name = rec.get('pj_name');

                //gm.me().itemabst();
                console_logs('유니크아이디', gm.me().vSELECTED_UNIQUE_ID);
                this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PJ_UID = -1;

                this.cartmap_uids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    this.cartmap_uids.push(uids);
                }

                console_logs('유니크아이디', gm.me().vSELECTED_UNIQUE_ID);
                console_logs('언체크', this.cartmap_uids);
            }

        })

        //디폴트 로드
        gm.setCenterLoading(false);
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
