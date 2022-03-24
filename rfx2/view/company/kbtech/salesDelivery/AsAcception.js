Ext.define('Rfx2.view.company.kbtech.salesDelivery.AsAcception', {
    extend: 'Rfx.base.BaseView',
    xtype: 'as-acception-view',
    selected_rec: null,
    initComponent: function () {

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.company.kbtech.AsAcception', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            gm.pageSize
            , {}
            , ['svcqst']
        );

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'state_disp'
                , store: "AsStateStore"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        //검색툴바 추가
        this.addSearchField('reserved_varchar3');
        this.addSearchField('reserved_varchar7');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 ) {
                buttonToolbar.items.remove(item);
            }
        });

        this.AsReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: 'A/S접수',
            tooltip: 'A/S를 접수합니다',
            disabled: false,
            handler: function() {
                gm.me().asReceive();
            }
        });

        this.AsRequestMtrlAction = Ext.create('Ext.Action', {
            text: '자재요청(취소)',
            tooltip: 'A/S 자재요청 상태를 변경합니다',
            disabled: true,
            handler: function () {
                gm.me().asRequestMtrl(gm.me().selected_rec);
            }
        });

        this.AsFinishWorkAction = Ext.create('Ext.Action', {
            text: '처리완료',
            tooltip: 'A/S 작업을 완료 처리합니다',
            disabled: true,
            handler: function () {
                gm.me().asFinishWork(gm.me().selected_rec);
            }
        });

        this.AsModifyWorkAction = Ext.create('Ext.Action', {
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: 'A/S 작업을 수정합니다',
            disabled: true,
            handler: function () {
                gm.me().asModifyWork(gm.me().selected_rec);
            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        buttonToolbar.insert(1, this.AsModifyWorkAction);
        buttonToolbar.insert(1, this.AsFinishWorkAction);
        buttonToolbar.insert(1, this.AsRequestMtrlAction);
        buttonToolbar.insert(1, this.AsReceiveAction);

        this.setRowClass(function(record, index) {

            console_logs('record', record);

            var c = record.get('state');

            switch(c) {
                case 'R':
                    break;
                case 'Q':
                    return 'yellow-row';
                    break;
                case 'D':
                    return 'red-row';
                    break;
                case 'F':
                    return 'green-row';
                    break;
                default:
                    break;
            }

        });

        var leftArr = [];
        for (var i = 0; i <= 19; i++) {
            leftArr.push(i);
        }

        var rightArr = [];
        for (var i = 29; i <= 38; i++) {
            rightArr.push(i);
        }

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar, null
            ,  [
                {
                    locked: false,
                    arr: leftArr
                },
                {
                    text: '품명',
                    locked: false,
                    arr: [20, 21, 22]
                },
                {
                    locked: false,
                    arr: [23, 24]
                },
                {
                    text: 'KB텍(당사)',
                    locked: false,
                    arr: [25, 26]
                },
                {
                    text: '타사',
                    locked: false,
                    arr: [27, 28]
                },
                {
                    locked: false,
                    arr: rightArr
                },
                {
                    text: '평가',
                    locked: false,
                    arr: [39, 40, 41, 42]
                }
            ]);

        //this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function(selections) {

            this.AsRequestMtrlAction.disable();
            this.AsFinishWorkAction.disable();
            //this.AsStartWorkAction.disable();
            this.AsModifyWorkAction.disable();

            if(selections.length > 0) {
                var rec = selections[0];
                this.selected_rec = rec;
                var vRECORD_STATE = rec.get('state');

                this.AsRequestMtrlAction.enable();
                this.AsModifyWorkAction.enable();

                switch(vRECORD_STATE) {
                    case 'R':
                        this.AsFinishWorkAction.enable();
                        break;
                    case 'Q':
                        break;
                    default:
                        break;
                }
            }

        });
    },

    asReceive : function() {
        var formItems = [
            {
                xtype: 'fieldset',
                title: '접수 정보',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '컨버터번호',
                        name: 'ctr_no_item',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '접수일자',
                        name: 'start_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel: 'A/S담당자',
                        name: 'user_email',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '문서번호',
                        xtype: 'textfield',
                        name: 'ctr_no',
                        value: ''
                    },
                    {
                        fieldLabel: '조명회사',
                        xtype: 'textfield',
                        name: 'wa_name',
                        value: ''
                    },
                    {
                        fieldLabel: '(접수)담당자',
                        width: '100%',
                        xtype: 'textfield',
                        name: 'user_id',
                        value: ''
                    },
                    {
                        fieldLabel: '접수(조명업체)팩스',
                        xtype: 'textfield',
                        name: 'user_tel',
                        value: ''
                    },
                    {
                        fieldLabel: '(현장)담당자',
                        width: '100%',
                        name: 'user_name',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '현장팩스',
                        name: 'user_hp',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '업체측처리요청일자',
                        name: 'require_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel: '(증상)접수내용',
                        name: 'rqst_title',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '특기사항/주소',
                        width: '100%',
                        name: 'rqst_content',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '체크',
                        name: 'state',
                        xtype: 'hiddenfield',
                        value: 'R'
                    },
                    {
                        fieldLabel: '건설사',
                        name: 'reserved_varchar1',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '지역',
                        name: 'reserved_varchar2',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '현장명',
                        width: '100%',
                        name: 'reserved_varchar3',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '동',
                        name: 'reserved_varchar4',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '호수',
                        name: 'reserved_varchar5',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '위치',
                        name: 'reserved_varchar6',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '세대전화번호',
                        name: 'reserved_varchar7',
                        xtype: 'textfield',
                        value: ''
                    }
                ]
        }];

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
        });

        var myHeight = 505;
        var myWidth = 700;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'A/S 접수',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {

                    var val = form.getValues(false);

                    Ext.Ajax.request({
                        url : CONTEXT_PATH + '/collab/svcqst.do?method=create',
                        params: val,
                        success: function(val, action){
                            prWin.close();
                            gm.me().store.load();
                            gm.me().grid.getSelectionModel().deselectAll();
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });
                }
            }, {
                text: CMD_CANCEL,
                handler: function(btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    asFinishWork : function(record) {

        var formItems = [
            {
                xtype: 'fieldset',
                title: '품명',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '라벨표시(KL)',
                        name: 'description',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '고유모델',
                        name: 'item_code',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '암페어(A)',
                        name: 'model_no',
                        xtype: 'textfield',
                        value: '',
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '구분',
                        name: 'item_type',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '현장불량(증상)',
                        name: 'reserved_varchar8',
                        xtype: 'textfield',
                        value: '',
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'KB텍(당사)',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '당사불량(실처리내용)',
                        name: 'treat_report',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '당사불량(처리내용)',
                        name: 'treat_plan',
                        xtype: 'textfield',
                        value: '',
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '타사',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '타사불량(처리내용)',
                        name: 'reserved_varchari',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '타사불량(미처리내용)',
                        name: 'reserved_varchara',
                        xtype: 'textfield',
                        value: '',
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '기타내용',
                        width: '100%',
                        name: 'reserved_varcharb',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '(직접)교체수량',
                        name: 'reserved_number1',
                        xtype: 'numberfield',
                        value: '0'
                    },
                    {
                        fieldLabel: '당사(처리)수량',
                        name: 'reserved_number2',
                        xtype: 'numberfield',
                        value: '0'
                    },
                    {
                        fieldLabel: '타사(처리)수량',
                        name: 'reserved_number3',
                        xtype: 'numberfield',
                        value: '0'
                    },
                    {
                        fieldLabel: '타사(미처리)수량',
                        name: 'reserved_number4',
                        xtype: 'numberfield',
                        value: '0'
                    },
                    {
                        fieldLabel: 'LOT NO.',
                        name: 'reserved_varcharc',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '하자보수완료확인자',
                        name: 'reserved_varchard',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '처리일자',
                        name: 'finish_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        value: new Date()
                    },
                    {
                        fieldLabel: '작업처리자',
                        name: 'treat_name',
                        xtype: 'textfield',
                        value: '',
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '평가',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '일수',
                        name: 'reserved_varchare',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '세대평수',
                        name: 'reserved_varcharf',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '그린산업',
                        name: 'reserved_varcharg',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '만족(2일)',
                        name: 'reserved_varcharh',
                        xtype: 'textfield',
                        value: '',
                    }
                ]
            }
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
        });

        var myHeight = 650;
        var myWidth = 700;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '처리완료',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {

                    var val = form.getValues(false);

                    val['unique_id'] = record.get('unique_id');
                    val['end_date'] = Ext.Date.format(new Date(),'Y-m-d');

                    Ext.MessageBox.show({
                        title: '완료 처리',
                        msg: 'A/S 작업을 완료 처리 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {

                            if (btn == "no") {
                                return;
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/collab/svcqst.do?method=asFinishAndWriteReport',
                                    params: val,
                                    success: function(result, request) {
                                        prWin.close();
                                        gm.me().store.load();
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                });
                            } // btnIf of end
                        } //fn function(btn)
                    }); //show
                }
            }, {
                text: CMD_CANCEL,
                handler: function(btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    asRequestMtrl : function(record) {

        var unqiue_id = record.get("unique_id");
        var reserved_varchar9 = record.get("reserved_varchar9");

        Ext.MessageBox.show({
            title: '자재요청',
            msg: 'A/S 자재 요청 처리(취소) 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {

                if (btn == "no") {
                    return;
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/collab/svcqst.do?method=asModify',
                        params: {
                            unique_id: unqiue_id,
                            reserved_varchar9: reserved_varchar9 === 'Y' ? 'N' : 'Y'
                        },
                        success: function(result, request) {
                            gm.me().store.load();
                            gm.me().grid.getSelectionModel().deselectAll();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                } // btnIf of end
            } //fn function(btn)
        }); //show
    },

    asModifyWork : function(record) {

        var vRECORD_STATE = record.get('state');

        var formItems = [
            {
                xtype: 'fieldset',
                title: '접수 정보',
                collapsible: false,
                width: '100%',
                layout: 'column',
                defaults: {
                    layout: 'form',
                    labelWidth: 140,
                    width: '50%',
                    margin: '0 0 5 0'
                },
                items : [
                    {
                        fieldLabel: '컨버터번호',
                        name: 'ctr_no_item',
                        xtype: 'textfield',
                        value: record.get('ctr_no_item'),
                    },
                    {
                        fieldLabel: '접수일자',
                        name: 'start_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        value: gm.me().formattingDate(record.get('start_date'))
                    },
                    {
                        fieldLabel: 'A/S담당자',
                        name: 'user_email',
                        xtype: 'textfield',
                        value: record.get('user_email')
                    },
                    {
                        fieldLabel: '문서번호',
                        xtype: 'textfield',
                        name: 'ctr_no',
                        value: record.get('ctr_no')
                    },
                    {
                        fieldLabel: '조명회사',
                        xtype: 'textfield',
                        name: 'wa_name',
                        value: record.get('wa_name')
                    },
                    {
                        fieldLabel: '(접수)담당자',
                        width: '100%',
                        xtype: 'textfield',
                        name: 'user_id',
                        value: record.get('user_id')
                    },
                    {
                        fieldLabel: '접수(조명업체)팩스',
                        xtype: 'textfield',
                        name: 'user_tel',
                        value: record.get('user_tel')
                    },
                    {
                        fieldLabel: '(현장)담당자',
                        width: '100%',
                        name: 'user_name',
                        xtype: 'textfield',
                        value: record.get('user_name')
                    },
                    {
                        fieldLabel: '현장팩스',
                        name: 'user_hp',
                        xtype: 'textfield',
                        value: record.get('user_hp')
                    },
                    {
                        fieldLabel: '업체측처리요청일자',
                        name: 'require_date',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        value: gm.me().formattingDate(record.get('require_date'))
                    },
                    {
                        fieldLabel: '(증상)접수내용',
                        name: 'rqst_title',
                        xtype: 'textfield',
                        value: record.get('rqst_title')
                    },
                    {
                        fieldLabel: '특기사항/주소',
                        width: '100%',
                        name: 'rqst_content',
                        xtype: 'textfield',
                        value: record.get('rqst_content')
                    },
                    {
                        fieldLabel: '체크',
                        name: 'state',
                        xtype: 'hiddenfield',
                        value: record.get('state')
                    },
                    {
                        fieldLabel: '건설사',
                        name: 'reserved_varchar1',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar1')
                    },
                    {
                        fieldLabel: '지역',
                        name: 'reserved_varchar2',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar2')
                    },
                    {
                        fieldLabel: '현장명',
                        width: '100%',
                        name: 'reserved_varchar3',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar3')
                    },
                    {
                        fieldLabel: '동',
                        name: 'reserved_varchar4',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar4')
                    },
                    {
                        fieldLabel: '호수',
                        name: 'reserved_varchar5',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar5')
                    },
                    {
                        fieldLabel: '위치',
                        name: 'reserved_varchar6',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar6')
                    },
                    {
                        fieldLabel: '세대전화번호',
                        name: 'reserved_varchar7',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar7')
                    }
                ]
            }
        ];

        if (vRECORD_STATE !== 'R') {
            formItems.push(
                // 완료 부문
                {
                    xtype: 'fieldset',
                    title: '품명',
                    collapsible: false,
                    width: '100%',
                    layout: 'column',
                    defaults: {
                        layout: 'form',
                        labelWidth: 140,
                        width: '50%',
                        margin: '0 0 5 0'
                    },
                    items : [
                        {
                            fieldLabel: '라벨표시(KL)',
                            name: 'description',
                            xtype: 'textfield',
                            value: record.get('description')
                        },
                        {
                            fieldLabel: '고유모델',
                            name: 'item_code',
                            xtype: 'textfield',
                            value: record.get('item_code')
                        },
                        {
                            fieldLabel: '암페어(A)',
                            name: 'model_no',
                            xtype: 'textfield',
                            value: record.get('model_no')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '',
                    collapsible: false,
                    width: '100%',
                    layout: 'column',
                    defaults: {
                        layout: 'form',
                        labelWidth: 140,
                        width: '50%',
                        margin: '0 0 5 0'
                    },
                    items : [
                        {
                            fieldLabel: '구분',
                            name: 'item_type',
                            xtype: 'textfield',
                            value: record.get('item_type')
                        },
                        {
                            fieldLabel: '현장불량(증상)',
                            name: 'reserved_varchar8',
                            xtype: 'textfield',
                            value: record.get('reserved_varchar8')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'KB텍(당사)',
                    collapsible: false,
                    width: '100%',
                    layout: 'column',
                    defaults: {
                        layout: 'form',
                        labelWidth: 140,
                        width: '50%',
                        margin: '0 0 5 0'
                    },
                    items : [
                        {
                            fieldLabel: '당사불량(실처리내용)',
                            name: 'treat_report',
                            xtype: 'textfield',
                            value: record.get('treat_report')
                        },
                        {
                            fieldLabel: '당사불량(처리내용)',
                            name: 'treat_plan',
                            xtype: 'textfield',
                            value: record.get('treat_plan')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '타사',
                    collapsible: false,
                    width: '100%',
                    layout: 'column',
                    defaults: {
                        layout: 'form',
                        labelWidth: 140,
                        width: '50%',
                        margin: '0 0 5 0'
                    },
                    items : [
                        {
                            fieldLabel: '타사불량(처리내용)',
                            name: 'reserved_varchari',
                            xtype: 'textfield',
                            value: record.get('reserved_varchari')
                        },
                        {
                            fieldLabel: '타사불량(미처리내용)',
                            name: 'reserved_varchara',
                            xtype: 'textfield',
                            value: record.get('reserved_varchara')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '',
                    collapsible: false,
                    width: '100%',
                    layout: 'column',
                    defaults: {
                        layout: 'form',
                        labelWidth: 140,
                        width: '50%',
                        margin: '0 0 5 0'
                    },
                    items : [
                        {
                            fieldLabel: '기타내용',
                            width: '100%',
                            name: 'reserved_varcharb',
                            xtype: 'textfield',
                            value: record.get('reserved_varcharb')
                        },
                        {
                            fieldLabel: '(직접)교체수량',
                            name: 'reserved_number1',
                            xtype: 'numberfield',
                            value: record.get('reserved_number1')
                        },
                        {
                            fieldLabel: '당사(처리)수량',
                            name: 'reserved_number2',
                            xtype: 'numberfield',
                            value: record.get('reserved_number2')
                        },
                        {
                            fieldLabel: '타사(처리)수량',
                            name: 'reserved_number3',
                            xtype: 'numberfield',
                            value: record.get('reserved_number3')
                        },
                        {
                            fieldLabel: '타사(미처리)수량',
                            name: 'reserved_number4',
                            xtype: 'numberfield',
                            value: record.get('reserved_number4')
                        },
                        {
                            fieldLabel: 'LOT NO.',
                            name: 'reserved_varcharc',
                            xtype: 'textfield',
                            value: record.get('reserved_varcharc')
                        },
                        {
                            fieldLabel: '하자보수완료확인자',
                            name: 'reserved_varchard',
                            xtype: 'textfield',
                            value: record.get('reserved_varchard')
                        },
                        {
                            fieldLabel: '처리일자',
                            name: 'finish_date',
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            value: gm.me().formattingDate(record.get('finish_date'))
                        },
                        {
                            fieldLabel: '작업처리자',
                            name: 'treat_name',
                            xtype: 'textfield',
                            value: record.get('treat_name')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '평가',
                    collapsible: false,
                    width: '100%',
                    layout: 'column',
                    defaults: {
                        layout: 'form',
                        labelWidth: 140,
                        width: '50%',
                        margin: '0 0 5 0'
                    },
                    items : [
                        {
                            fieldLabel: '일수',
                            name: 'reserved_varchare',
                            xtype: 'textfield',
                            value: record.get('reserved_varchare')
                        },
                        {
                            fieldLabel: '세대평수',
                            name: 'reserved_varcharf',
                            xtype: 'textfield',
                            value: record.get('reserved_varcharf')
                        },
                        {
                            fieldLabel: '그린산업',
                            name: 'reserved_varcharg',
                            xtype: 'textfield',
                            value: record.get('reserved_varcharg')
                        },
                        {
                            fieldLabel: '만족(2일)',
                            name: 'reserved_varcharh',
                            xtype: 'textfield',
                            value: record.get('reserved_varcharh')
                        }
                    ]
                }
            );
        }

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
        });

        var myHeight = vRECORD_STATE === 'R' ? 505: 670;
        var myWidth = 700;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            overflowY: vRECORD_STATE === 'R' ? null : 'scroll',
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {

                    var val = form.getValues(false);

                    val['unique_id'] = record.get('unique_id');

                    Ext.Ajax.request({
                        url : CONTEXT_PATH + '/collab/svcqst.do?method=asModify',
                        params: val,
                        success: function(val, action){
                            prWin.close();
                            gm.me().store.load();
                            gm.me().grid.getSelectionModel().deselectAll();
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });
                }
            }, {
                text: CMD_CANCEL,
                handler: function(btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    formattingDate: function(date) {
        if (date !== null) {
            return date.substring(0, 10);
        } else {
            return null;
        }
    },

    selMode : 'SINGLE'
});
