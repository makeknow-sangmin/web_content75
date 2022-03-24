Ext.define('Rfx2.view.qualManage.AsAcception', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'as-acception-view',
    selected_rec: null,
    initComponent: function () {

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch(dataIndex) {
                case 'reserved_varcharf':
                    columnObj["renderer"] = function (value, meta) {
                        if(value > 0) {
                            return '<div style="background-color: gray; color: white; text-align: center;"><b>' +
                                '<a href = "http://' + window.location.hostname + ':7080/filedown.do?method=fileproject&fileobject_uid=' + value + '">다운로드</a></b></div>';
                        } else {
                            return '';
                        }
                    };
                    break;
            }
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.AsAcception', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            gm.pageSize
            , {}
            , ['svcqst']
        );

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('unique_id');
        this.addSearchField('rqst_title');
        this.addSearchField('user_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.AsReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '클레임접수',
            tooltip: '클레임를 접수합니다',
            disabled: false,
            handler: function() {
                gm.me().asReceive();
            }
        });

        this.AsStartWorkAction = Ext.create('Ext.Action', {
            text: '작업투입',
            tooltip: '클레임 작업을 투입합니다',
            disabled: true,
            handler: function () {
                gm.me().asStartWork(gm.me().selected_rec);
            }
        });

        this.AsFinishWorkAction = Ext.create('Ext.Action', {
            text: '작업완료',
            tooltip: '클레임 작업을 완료 처리합니다',
            disabled: true,
            handler: function () {
                gm.me().asFinishWork(gm.me().selected_rec);
            }
        });

        this.AsModifyWorkAction = Ext.create('Ext.Action', {
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '클레임 작업을 수정합니다',
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
        buttonToolbar.insert(1, this.AsStartWorkAction);
        buttonToolbar.insert(1, this.AsReceiveAction);

        this.setRowClass(function(record, index) {

            console_logs('record', record);
            var c = record.get('state');
            //console_logs('c', c);
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

        //grid 생성.
        this.createGrid(arr);

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

            this.AsFinishWorkAction.disable();
            this.AsStartWorkAction.disable();
            this.AsModifyWorkAction.disable();

            if(selections.length > 0) {
                var rec = selections[0];
                this.selected_rec = rec;
                var vRECORD_STATE = rec.get('state');

                this.AsModifyWorkAction.enable();

                switch(vRECORD_STATE) {
                    case 'R':
                        this.AsStartWorkAction.enable();
                        break;
                    case 'Q':
                        this.AsFinishWorkAction.enable();
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
                title: '고객사 정보',
                collapsible: false,
                width: '100%',
                defaults: {
                    width: '100%',
                    layout: {
                        type: 'vbox'
                    }
                },
                items : [
                    {
                        fieldLabel: '고객사',
                        name: 'reserved_varchar1',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '수주번호',
                        name: 'reserved_varchar2',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '품명',
                        name: 'reserved_varchar3',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '연락처',
                        xtype: 'textfield',
                        name: 'reserved_varchar6',
                        value: ''
                    },
                    {
                        fieldLabel: '부서',
                        xtype: 'textfield',
                        name: 'reserved_varchar7',
                        value: ''
                    },
                    {
                        fieldLabel: '직급',
                        xtype: 'textfield',
                        name: 'reserved_varchar8',
                        value: ''
                    },
                    {
                        fieldLabel: '사진첨부',
                        xtype: 'filefield',
                        buttonText  : '찾아보기',
                        name: 'fileupload'
                    }
                ]
            },
            {
            xtype: 'fieldset',
            title: '접수 기본정보',
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
                    fieldLabel: '제목',
                    name: 'rqst_title',
                    xtype: 'textfield',
                    value: ''
                },
                {
                    fieldLabel: '클레임 내용',
                    xtype: 'textarea',
                    name: 'rqst_content',
                    value: ''
                },
                {
                    fieldLabel: '요청자명',
                    xtype: 'textfield',
                    name: 'user_name',
                    value: vCUR_USER_NAME
                },
                {
                    fieldLabel: '요청일자',
                    xtype: 'datefield',
                    name: 'require_date',
                    value: new Date()
                },
                {
                    fieldLabel: '비고',
                    xtype: 'textfield',
                    name: 'treat_report',
                    value: ''
                },
                new Ext.form.Hidden({
                    name: 'state',
                    value: 'R'
                })
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

        var myHeight = 580;
        var myWidth = 600;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '클레임 접수',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {

                    var file_code = gUtil.RandomInteger();

                    form.submit({
                        url : CONTEXT_PATH+ '/uploader.do?method=uploadprpject&pj_code='+ 'asacception' + '&pj_uid='+ file_code,
                        waitMsg : '파일 업로드 중입니다.',
                        success : function(fp,o) {
                            var val = form.getValues(false);
                            val.file_code = file_code;
                            Ext.Ajax.request({
                                url : CONTEXT_PATH + '/collab/svcqst.do?method=create',
                                params: val,
                                success: function(val, action){
                                    prWin.close();
                                    gm.me().storeLoad();
                                },
                                failure: function(val, action){
                                    prWin.close();
                                }
                            });
                        },
                        failure : function() {
                            console_log('failure');
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

    asStartWork : function(record) {

        var formItems = [
            {
                xtype: 'fieldset',
                title: '고객사 정보',
                collapsible: false,
                width: '100%',
                defaults: {
                    width: '100%',
                    layout: {
                        type: 'vbox'
                    }
                },
                items : [
                    {
                        fieldLabel: '고객사',
                        name: 'reserved_varchar1',
                        xtype: 'textfield',
                        value: '',
                    },
                    {
                        fieldLabel: '수주번호',
                        name: 'reserved_varchar2',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '품명',
                        name: 'reserved_varchar3',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '연락처',
                        xtype: 'textfield',
                        name: 'reserved_varchar6',
                        value: ''
                    },
                    {
                        fieldLabel: '부서',
                        xtype: 'textfield',
                        name: 'reserved_varchar7',
                        value: ''
                    },
                    {
                        fieldLabel: '직급',
                        xtype: 'textfield',
                        name: 'reserved_varchar8',
                        value: ''
                    },
                    {
                        fieldLabel: '사진첨부',
                        xtype: 'filefield',
                        buttonText  : '찾아보기',
                        name: 'fileupload'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '접수 기본정보',
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
                        fieldLabel: '제목',
                        name: 'rqst_title',
                        xtype: 'textfield',
                        value: ''
                    },
                    {
                        fieldLabel: '클레임 내용',
                        xtype: 'textarea',
                        name: 'rqst_content',
                        value: ''
                    },
                    {
                        fieldLabel: '요청자명',
                        xtype: 'textfield',
                        name: 'user_name',
                        value: vCUR_USER_NAME
                    },
                    {
                        fieldLabel: '요청일자',
                        xtype: 'datefield',
                        name: 'require_date',
                        value: new Date()
                    },
                    {
                        fieldLabel: '비고',
                        xtype: 'textfield',
                        name: 'treat_report',
                        value: ''
                    },
                    new Ext.form.Hidden({
                        name: 'state',
                        value: 'R'
                    })
                ]
            }];

        var formItems = [
            {
                xtype: 'fieldset',
                title: '고객사 정보',
                collapsible: false,
                width: '100%',
                defaults: {
                    width: '100%',
                    layout: {
                        type: 'vbox'
                    }
                },
                items : [
                    {
                        fieldLabel: '고객사',
                        name: 'reserved_varchar1',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar1'),
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    },
                    {
                        fieldLabel: '수주번호',
                        name: 'reserved_varchar2',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar2'),
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    },
                    {
                        fieldLabel: '품명',
                        name: 'reserved_varchar3',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar3'),
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    },
                    {
                        fieldLabel: '연락처',
                        xtype: 'textfield',
                        name: 'reserved_varchar6',
                        value: record.get('reserved_varchar6'),
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    },
                    {
                        fieldLabel: '부서',
                        xtype: 'textfield',
                        name: 'reserved_varchar7',
                        value: record.get('reserved_varchar7'),
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    },
                    {
                        fieldLabel: '직급',
                        xtype: 'textfield',
                        name: 'reserved_varchar8',
                        value: record.get('reserved_varchar8'),
                        readOnly: true,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    }
                ]
            },
            {
            xtype: 'fieldset',
            title: '작업 투입 정보',
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
                    fieldLabel: '제목',
                    name: 'rqst_title',
                    xtype: 'textfield',
                    value: record.get('rqst_title'),
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                },
                {
                    fieldLabel: '클레임 내용',
                    xtype: 'textarea',
                    name: 'rqst_content',
                    value: record.get('rqst_content'),
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                },
                {
                    fieldLabel: '요청자명',
                    xtype: 'textfield',
                    name: 'user_name',
                    value: record.get('user_name'),
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                },
                {
                    fieldLabel: '요청일자',
                    xtype: 'datefield',
                    name: 'require_date',
                    value: new Date(record.get('require_date')),
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                },
                {
                    fieldLabel: '작업자명',
                    xtype: 'textfield',
                    name: 'treat_name',
                    value: ''
                },
                {
                    fieldLabel: '작업장소',
                    xtype: 'textfield',
                    name: 'reserved_varchar4',
                    value: ''
                },
                {
                    fieldLabel: '작업차량',
                    xtype: 'textfield',
                    name: 'reserved_varchar5',
                    value: ''
                },
                {
                    fieldLabel: '비고',
                    xtype: 'textfield',
                    name: 'treat_report',
                    value: record.get('treat_report')
                },
                new Ext.form.Hidden({
                    name: 'unique_id',
                    value: record.get('unique_id'),
                }),
                new Ext.form.Hidden({
                    name: 'start_date',
                    value: Ext.Date.format(new Date(),'Y-m-d'),
                })
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

        var myHeight = 650;
        var myWidth = 600;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '클레임 작업투입',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    form.submit({
                        url : CONTEXT_PATH + '/collab/svcqst.do?method=asStartWork',
                        params:{

                        },
                        success: function(val, action){
                            prWin.close();
                            gm.me().storeLoad();
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
        Ext.MessageBox.show({
            title: '완료 처리',
            msg: '클레임 작업을 완료 처리 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {

                if (btn == "no") {
                    return;
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/collab/svcqst.do?method=asFinishWork',
                        params: {
                            unique_id: record.get('unique_id'),
                            end_date: Ext.Date.format(new Date(),'Y-m-d')
                        },
                        success: function(result, request) {
                            gm.me().store.load();
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
                title: '고객사 정보 수정',
                collapsible: false,
                width: '100%',
                defaults: {
                    width: '100%',
                    layout: {
                        type: 'vbox'
                    }
                },
                items : [
                    {
                        fieldLabel: '고객사',
                        name: 'reserved_varchar1',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar1')
                    },
                    {
                        fieldLabel: '수주번호',
                        name: 'reserved_varchar2',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar2')
                    },
                    {
                        fieldLabel: '품명',
                        name: 'reserved_varchar3',
                        xtype: 'textfield',
                        value: record.get('reserved_varchar3')
                    },
                    {
                        fieldLabel: '연락처',
                        xtype: 'textfield',
                        name: 'reserved_varchar6',
                        value: record.get('reserved_varchar6')
                    },
                    {
                        fieldLabel: '부서',
                        xtype: 'textfield',
                        name: 'reserved_varchar7',
                        value: record.get('reserved_varchar7')
                    },
                    {
                        fieldLabel: '직급',
                        xtype: 'textfield',
                        name: 'reserved_varchar8',
                        value: record.get('reserved_varchar8')
                    }
                ]
            },
            {
            xtype: 'fieldset',
            title: '기본 정보 수정',
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
                    fieldLabel: '제목',
                    name: 'rqst_title',
                    xtype: 'textfield',
                    value: record.get('rqst_title')
                },
                {
                    fieldLabel: '클레임 내용',
                    xtype: 'textarea',
                    name: 'rqst_content',
                    value: record.get('rqst_content')
                },
                {
                    fieldLabel: '요청자명',
                    xtype: 'textfield',
                    name: 'user_name',
                    value: record.get('user_name')
                },
                {
                    fieldLabel: '요청일자',
                    xtype: 'datefield',
                    name: 'require_date',
                    value: new Date(record.get('require_date'))
                },
                {
                    fieldLabel: '작업자명',
                    xtype: 'textfield',
                    name: 'treat_name',
                    hidden: vRECORD_STATE == 'R' ? true : false,
                    value: record.get('treat_name')
                },
                {
                    fieldLabel: '작업장소',
                    xtype: 'textfield',
                    name: 'reserved_varchar4',
                    hidden: vRECORD_STATE == 'R' ? true : false,
                    value: record.get('reserved_varchar4')
                },
                {
                    fieldLabel: '작업차량',
                    xtype: 'textfield',
                    name: 'reserved_varchar5',
                    hidden: vRECORD_STATE == 'R' ? true : false,
                    value: record.get('reserved_varchar5')
                },
                {
                    fieldLabel: '투입일',
                    xtype: 'datefield',
                    name: 'start_date',
                    hidden: vRECORD_STATE == 'R' ? true : false,
                    value: new Date(record.get('start_date'))
                },
                {
                    fieldLabel: '비고',
                    xtype: 'textfield',
                    name: 'treat_report',
                    value: record.get('treat_report')
                },
                new Ext.form.Hidden({
                    name: 'unique_id',
                    value: record.get('unique_id')
                }),
                new Ext.form.Hidden({
                    name: 'finish_date',
                    value: record.get('finish_date') == null ? null : new Date(record.get('finish_date'))
                }),
                new Ext.form.Hidden({
                    name: 'state',
                    value: record.get('state')
                })
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

        var myHeight = vRECORD_STATE == 'R' ? 550 : 680;
        var myWidth = 600;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn) {
                    form.submit({
                        url : CONTEXT_PATH + '/collab/svcqst.do?method=create',
                        params:{

                        },
                        success: function(val, action){
                            prWin.close();
                            gm.me().storeLoad();
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
    selMode : 'SINGLE'
});
