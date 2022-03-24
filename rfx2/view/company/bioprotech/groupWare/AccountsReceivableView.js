//주문작성

Ext.define('Rfx2.view.company.bioprotech.groupWare.AccountsReceivableView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receivable-view',
    initComponent: function () {


        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        //var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.AccountsPayableDABP', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
        );

        var arr = [];
        arr.push(buttonToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
        });

        var option = {
            features: [groupingFeature]
        };


        //grid 생성.
        this.createGridCore(arr, option);

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addArAction = Ext.create('Ext.Action', {
            itemId: 'addArAction',
            iconCls: 'af-plus-circle',
            disabled: true,
            text: '합계발행',
            handler: function (widget, event) {

                /*
                 1. buyer_uid : 선택한 고객사의 UID
                 2. 선택한 project uid 목록
                 3. 사용자 입력한 정보(고객사 + 연월 )

                 */
                //결재사용인 경우 결재 경로 store 생성
                if (gm.me().useRouting == true) {
                    gm.me().rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});
                }

                var buyer_uid = gm.me().SELECTED_UID;
                console_logs('buyer_uid++++++++++++++++++++', buyer_uid);

                var selectedPjUid = [];
                var selectedUids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('addArAction selections+++++++++++++++', selections);
                var item_abst = '';
                if (selections) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('rec', rec);
                        selectedPjUid.push(rec.get('id'));
                        selectedUids.push(rec.get('unique_id_long'));

                        if (i == 0) {
                            item_abst = rec.get('item_name') + '외 ' + (selections.length - 1) + '건';
                        }
                    }
                }

                var myHeight = (gm.me().useRouting == true) ? 500 : 200;
                var myWidth = 600;

                var buyer_name = gm.me().SELECTED_RECORD.get('wa_name');
                var text = buyer_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';

                var formItems = [
                    {
                        fieldLabel: '합계 구분',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        labelWidth: 70,
                        //id: 'text_content',
                        name: 'text',
                        style: 'width: 100%',
                        value: text
                    },
                    new Ext.form.Hidden({
                        name: 'unique_uids',
                        value: selectedUids
                    }),
                    new Ext.form.Hidden({
                        name: 'pj_uids',
                        value: selectedPjUid
                    })
                ];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: formItems
                })

                var items = [form];

                if (gm.me().useRouting == true) {

                    gm.me().rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId: 'removeRtgapp',
                        glyph: 'xf00d@FontAwesome',
                        text: CMD_DELETE,
                        disabled: true,
                        handler: function (widget, event) {
                            Ext.MessageBox.show({
                                title: delete_msg_title,
                                msg: delete_msg_content,
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().deleteRtgappConfirm,
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });

                    var updown =
                        {
                            text: '이동',
                            menuDisabled: true,
                            sortable: false,
                            xtype: 'actioncolumn',
                            width: 70,
                            align: 'center',
                            items: [{
                                icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                                tooltip: 'Up',
                                handler: function (agridV, rowIndex, colIndex) {
                                    var record = gm.me().agrid.getStore().getAt(rowIndex);
                                    console_log(record);
                                    var unique_id = record.get('unique_id');
                                    console_log(unique_id);
                                    var direcition = -15;
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                        params: {
                                            direcition: direcition,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            gm.me().rtgapp_store.load(function () {
                                            });
                                        }
                                    });

                                }


                            }, '-',
                                {
                                    icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                                    tooltip: 'Down',
                                    handler: function (agridV, rowIndex, colIndex) {

                                        var record = gm.me().agrid.getStore().getAt(rowIndex);
                                        console_log(record);
                                        var unique_id = record.get('unique_id');
                                        console_log(unique_id);
                                        var direcition = 15;
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                            params: {
                                                direcition: direcition,
                                                unique_id: unique_id
                                            },
                                            success: function (result, request) {
                                                gm.me().rtgapp_store.load(function () {
                                                });
                                            }
                                        });
                                    }

                                }]
                        };

                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

                    this.agrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                        store: gm.me().rtgapp_store,
                        border: true,
                        frame: true,
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        //layout: 'fit',
                        scroll: true,
                        selModel: selModel,
                        columns: [
                            {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false}
                            , {dataIndex: 'user_id', text: '아이디', sortable: false}
                            , {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                            , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                            , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                            , updown
                        ],
                        border: false,
                        multiSelect: true,
                        frame: false,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default2',
                            items: [
                                {
                                    xtype: 'label',
                                    labelWidth: 20,
                                    text: '결재 권한자 추가'//,
                                    //style: 'color:white;'

                                }, {
                                    id: 'user_name',
                                    name: 'user_name',
                                    xtype: 'combo',
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    store: userStore,
                                    labelSeparator: ':',
                                    emptyText: dbm1_name_input,
                                    displayField: 'user_name',
                                    valueField: 'unique_id',
                                    sortInfo: {field: 'user_name', direction: 'ASC'},
                                    typeAhead: false,
                                    hideLabel: true,
                                    minChars: 2,
                                    width: 200,
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            console_logs('Selected combo : ', combo);
                                            console_logs('Selected record : ', record);
                                            console_logs('Selected Value : ', record.get('unique_id'));

                                            var unique_id = record.get('unique_id');
                                            var user_id = record.get('user_id');
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                                params: {
                                                    useruid: unique_id,
                                                    userid: user_id
                                                    , gubun: 'D'
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    console_log('result:' + result);
                                                    if (result == 'false') {
                                                        Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                    } else {
                                                        gm.me().rtgapp_store.load(function () {
                                                        });
                                                    }
                                                },
                                                failure: extjsUtil.failureMessage
                                            });
                                        }// endofselect
                                    }
                                },
                                '->', removeRtgapp

                            ]// endofitems
                        }] // endofdockeditems 

                    }); // endof Ext.create('Ext.grid.Panel',

                    this.agrid.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            if (selections.length) {
                                removeRtgapp.enable();
                            } else {
                                removeRtgapp.disable();
                            }
                        }
                    });

                    items.push(this.agrid);
                }

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '정산실행',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    //결재사용인 경우 결재 경로 확인
                                    if (gm.me().useRouting == true) {

                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if (items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }

                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for (var i = 0; i < items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] = ahid_userlist;
                                        val['hid_userlist_role'] = ahid_userlist_role;
                                    }

                                    var selections = gm.me().grid.getSelectionModel().getSelection();

                                    var supplier_code = selections[0].get('seller_code');
                                    var supplierUid = selections[0].get('sms_cnt');
                                    var item_name = selections[0].get('item_name');

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=addNewAr',
                                        params: {
                                            buyer_uid: gm.me().SELECTED_UID,
                                            sledel_uids: selectedUids,
                                            // rtgast_uids: selectedUids,
                                            text: text,
                                            item_abst: item_abst,
                                            hid_userlist: ahid_userlist,
                                            hid_userlist_role: ahid_userlist_role
                                        },

                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().delBuyerGrid.store.load();
                                            Ext.Msg.alert('안내', '모든 수주목록을 발행하였습니다.', function () {
                                            });
                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
            }
        });
        buttonToolbar.insert(0, this.addArAction);

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = Ext.getCmp('s_date').getValue();
                    var e_date = Ext.getCmp('e_date').getValue();
                    var lot_no = Ext.getCmp('lot_no').getValue();
                } catch (e) {
                }

                gm.me().poStore.getProxy().setExtraParam('name', lot_no);
                gm.me().poStore.load();
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });

        this.store.getProxy().setExtraParam('state', 'A');

        this.callParent(arguments);
    },


    doArProcess: function (selectedUids, text, item_abst) {

        var pj_uids = selectedUids;
        // selectedPjUid

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/account/arap.do?method=addNewAr',
            params: {
                buyer_uid: gm.me().SELECTED_UID,
                rtgast_uids: selectedUids,
                text: text,
                item_abst: item_abst
            },

            success: function (result, request) {
                gm.me().store.load();
                gm.me().delBuyerGrid.store.load();
                Ext.Msg.alert('안내', '모든 수주목록을 발행하였습니다.', function () {
                });

            },// endofsuccess
            failure: extjsUtil.failureMessage
        });// endofajax

    },

//   rtgast_uid_arr : [],
    setRelationship: function (relationship) {
    },
    createCenter: function () {/*자재목록 그리드*/
        this.grid.setTitle('납품목록');
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '55%',
            items: [this.grid]
        });


        return this.center;
    },
    createWest: function () {/*요청서 목록*/

        this.removeAssyAction = Ext.create('Ext.Action', {
            itemId: 'removeAssyAction',
            iconCls: 'af-remove',
            text: 'Assy' + CMD_DELETE,
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: delete_msg_title,
                    msg: delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteAssyConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.poStore = Ext.create('Rfx2.store.company.hanjung.PoStore');
        this.poStore.getProxy().setExtraParam('project_del_finished', 'T');


        this.delBuyerGrid =
            Ext.create('Rfx2.view.grid.company.hanjung.AccountPayableGrid', {
                //id: gm.me().link + 'DBM7-Assembly',
//			 id: 'PPO1_TURN_PREQ',
                title: '납품 고객사',// cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.poStore,
                //layout          :'fit',
                //forceFit: true,
                multiSelect: true,
                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.poStore,
                    displayInfo: true,
                    displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                    emptyMsg: "표시할 항목이 없습니다."
                    , listeners: {
                        beforechange: function (page, currentPage) {

                        }
                    }

                }),
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            this.purListSrch
                        ]
                    },
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default1',
                        items: [{
                            xtype: 'label',
                            width: 40,
                            text: '기간',
                            style: 'color:white;'

                        }, {
                            id: 's_date_arv',
                            name: 's_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                            width: 98

                        }, {
                            xtype: 'label',
                            text: "~",
                            style: 'color:white;'
                        }, {
                            id: 'e_date_arv',
                            name: 'e_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: new Date(),
                            width: 98

                        }/*, {
                            id: 'lot_no_ACT3',
                            xtype: 'textfield',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            mode: 'local',
                            editable: true,
                            // allowBlank: false,
                            width: '25%',
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                            queryMode: 'remote',
                            emptyText: '자재코드',
                            enableKeyEvents: true,
                            trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('keydown', function () {
                                        var s_date = Ext.getCmp('s_date_PPO1TURN').getValue();
                                        var e_date = Ext.getCmp('e_date_PPO1TURN').getValue();
                                        var lot_no = Ext.getCmp('lot_no_PPO1TURN').getValue();
                                        gm.me().poStore.getProxy().setExtraParam('name', '%' + lot_no + '%');
                                        gm.me().productStore.load();
                                    });
                                }
                            }
                        }, {
                            xtype: 'triggerfield',
                            emptyText: '고객사 명',
                            id: 'src_wa_name',
                            name: 'wa_name',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().poStore.getProxy().setExtraParam('query', Ext.getCmp('src_wa_name').getValue());
                                        gm.me().poStore.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                Ext.getCmp('src_wa_name').setValue('');
                                gm.me().poStore.getProxy().setExtraParam('query', Ext.getCmp('src_wa_name').getValue());
                                gm.me().poStore.load(function () {
                                });
                            }
                        },
                            {
                                xtype: 'combo',
                                id: 'wa_code',
                                name: 'wa_code',
                                store: this.comcstStore,
                                displayField: 'division_name',
                                valueField: 'division_code',
                                emptyText: '사업장',
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{division_code}">{division_name}</div>';
                                    }
                                },
                                listeners: {
                                    'select': function (rec, data) {
                                        gm.me().poStore.getProxy().setExtraParam('wa_code', data.get('wa_code'));
                                        gm.me().store.getProxy().setExtraParam('wa_code', data.get('wa_code'));
                                    }
                                }
                            }*/
                        ]
                    },
                ] //dockedItems of End


            });//delBuyerGrid of End

        this.delBuyerGrid.store.load();
        this.delBuyerGrid.store.on('load', function (store, records, successful, eOpts) {
            var arr = [];
            var prev_rec = null;
            for (var i = 0; i < records.length; i++) {
                var cur = records[i];
                prev_rec = {};
                for (var key in cur['data']) {
                    prev_rec[key] = cur.get(key);
                }
                var unique_id = cur.get('unique_id');
                prev_rec['unique_id'] = unique_id;

                var po_no = cur.get('po_no');
                prev_rec['po_no'] = po_no;

                var name = cur.get('name');
                prev_rec['name'] = name;

                var item_quan = cur.get('item_quan');
                prev_rec['item_quan'] = item_quan;

                var creator = cur.get('creator');
                prev_rec['creator'] = creator;

                var create_date = cur.get('create_date');
                prev_rec['create_date'] = create_date;


                arr.push(prev_rec);
            }
            records = arr;
            console_logs('==== storeLoadCallback arr', arr);

            store.removeAll();
            store.add(arr);
        });
        this.delBuyerGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gUtil.enable(gm.me().addArAction);
                // gUtil.enable(gm.me().editAssyAction);
                try {
                    if (selections != null) {

                        var rec = selections[0];
                        console_logs('rec>>>>>>>>>>>>>', rec)
                        gm.me().SELECTED_UID = rec.get('unique_id');
                        gm.me().SELECTED_RECORD = rec;

                        gm.me().store.getProxy().setExtraParam('reserved_number4', gm.me().SELECTED_UID);
                        gm.me().store.load();
                        console_logs('---ssss', gm.me().store);

                    }
                } catch (e) {
                    console_logs('e', e);
                }
            }
        });

        this.west = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '45%',
            layoutConfig: {columns: 2, rows: 1},

            items: [this.delBuyerGrid /*, myFormPanel*/]
        });

        return this.west;
    },
    rtgapp_store: null,
    useRouting: (vCompanyReserved4 == 'KWLM01KR' || vCompanyReserved4 == 'DABP01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,

    comcstStore: Ext.create('Mplm.store.ComCstStore', {})
});
