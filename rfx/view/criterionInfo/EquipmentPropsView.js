Ext.define('Rfx.view.criterionInfo.EquipmentPropsView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'equipment-props-view',
    initComponent: function () {
        this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        // this.addSearchField({
        //   // type: 'combo',
        //   field_id: 'unique_id',
        //   emptyText: '장비 선택',
        //   store: 'equipmentPropsComboStore',
        //   displayField: 'name_ko',
        //   valueField: 'unique_id',
        //   // ,value: 'unique_id'
        //   innerTpl: '<div data-qtip='{unique_id}'>{name}</div>',
        // });
        // 검색 툴바에 콤보로 적용할지 TestField로 적용할지 ?

        // 검색 툴바 Text Search Fields
        this.addSearchField('mchn_code');
        this.addSearchField('name_ko'); //.J2_CODE에 추가후 적용 예정

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar2({
            REMOVE_BUTTONS: ['REMOVE', 'COPY', 'INITIAL', 'UTYPE'],
        });

        // default load store 선언 EquipmentProps.js
        this.createStore(
            'Rfx.model.EquipmentProps',
            [
                {
                    property: 'unique_id',
                    direction: 'DESC',
                    sorter: [
                        {
                            property: 'unique_id',
                            direction: 'DESC',
                        },
                    ],
                },
            ],
            gMain.pageSize,
            console.log('gMainPage', gMain.pageSize),
            // 10000/*pageSize*/
            {},
            ['efiast']
        );

        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab],
        });

        // 신규등록 버튼 선언
        this.addPropsButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addPropsButton'),
            handler: function () {
                gm.me().addProps();
            },
        });

        // 수정 버튼 선언
        this.modifyPropsButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '속성 수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyPropsButton'),
            handler: function () {
                gm.me().modifyProps();
            },
        });

        // 삭제 버튼 선언
        this.deletePropsButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '속성 삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('deletePropsButton'),
            handler: function () {
                gm.me().deleteProps();
            },
        });

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        });

        // 명령툴바 버튼 삽입
        buttonToolbar.insert(1, this.addPropsButton);
        buttonToolbar.insert(2, this.modifyPropsButton);
        buttonToolbar.insert(3, this.deletePropsButton);

        this.callParent(arguments);

        // Row 클릭시 수정 및 삭제 버튼 활성화
        this.setGridOnCallback(function (selections) {
            console_logs('>>>>callback', selections);
            if (selections != null && selections.length > 0) {
                this.modifyPropsButton.enable();
                this.deletePropsButton.enable();
            } else {
                this.modifyPropsButton.disable();
                this.deletePropsButton.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {});
        this.loadStoreAlways = true;
    },
    items: [],

    // 수정 버튼 Action Fucntion
    modifyProps: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>> rec', rec);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('modifyPropsPenel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side',
            },
            items: [
                {
                    xtype: 'fieldset',
                    id: gu.id('modifyProps'),
                    title: '데이터 속성 수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2',
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'unique_id',
                            id: 'unique_id',
                            value: rec.get('unique_id'),
                        }),
                        {
                            fieldLabel: this.getFieldName('name_ko'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id: 'name_ko',
                            name: 'name_ko',
                            value: rec.get('name_ko'),
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('mchn_code'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id: 'mchn_code',
                            name: 'mchn_code',
                            value: rec.get('mchn_code'),
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('mchn_uid'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id: 'mchn_uid',
                            name: 'mchn_uid',
                            value: rec.get('mchn_uid'),
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_key'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_key',
                            name: 'prop_key',
                            value: rec.get('prop_key'),
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_name'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_name',
                            name: 'prop_name',
                            value: rec.get('prop_name'),
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_unit'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_unit',
                            name: 'prop_unit',
                            value: rec.get('prop_unit'),
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_cal_type'),
                            xtype: 'combo',
                            // anchor: '100%',
                            // readOnly: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['prop_cal_type', 'value'],
                                data: [
                                    { prop_cal_type: 'avg', value: '평균(avg)' },
                                    { prop_cal_type: 'sum', value: '합(sum)' },
                                ],
                            }),
                            emptyText: '연산 타입 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'prop_cal_type',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{prop_cal_type}">{value}</div>';
                                },
                            },
                            width: '95%',
                            id: 'prop_cal_type',
                            name: 'prop_cal_type',
                            value: rec.get('prop_cal_type'),
                        },
                        {
                            fieldLabel: this.getFieldName('prop_minval'),
                            xtype: 'numberfield',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_minval',
                            name: 'prop_minval',
                            value: rec.get('prop_minval'),
                            width: '95%',
                            hideTrigger: true,
                            mouseWheelEnabled: false,
                            keyNavEnabled: false,
                        },
                        {
                            fieldLabel: this.getFieldName('prop_maxval'),
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_maxval',
                            name: 'prop_maxval',
                            value: rec.get('prop_maxval'),
                            width: '95%',
                            hideTrigger: true,
                            mouseWheelEnabled: false,
                            keyNavEnabled: false,
                        },
                        {
                            fieldLabel: this.getFieldName('data_type'),
                            xtype: 'combo',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'data_type',
                            name: 'data_type',
                            value: rec.get('data_type'),
                            width: '95%',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['data_type', 'value'],
                                data: [
                                    { data_type: 'int', value: 'int' },
                                    { data_type: 'double', value: 'double' },
                                    { data_type: 'long', value: 'long' },
                                    { data_type: 'string', value: 'string' },
                                    { data_type: 'char', value: 'char' },
                                ],
                            }),
                            emptyText: '데이터 타입 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'data_type',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{data_type}">{value}</div>';
                                },
                            },
                        },
                        {
                            fieldLabel: this.getFieldName('chart_type'),
                            xtype: 'combo',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'chart_type',
                            name: 'chart_type',
                            value: rec.get('chart_type'),
                            width: '95%',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['chart_type', 'value'],
                                data: [
                                    { chart_type: 'bar', value: 'bar' },
                                    { chart_type: 'line', value: 'line' },
                                ],
                            }),
                            emptyText: '그래프 스타일 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'chart_type',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{chart_type}">{value}</div>';
                                },
                            },
                        },
                        {
                            fieldLabel: this.getFieldName('direction'),
                            xtype: 'combo',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'direction',
                            name: 'direction',
                            value: rec.get('direction'),
                            width: '95%',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['direction', 'value'],
                                data: [
                                    { direction: 'receive', value: '수신(receive)' },
                                    { direction: 'send', value: '송신(send)' },
                                ],
                            }),
                            emptyText: '송/수신 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'direction',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{direction}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                        },
                        {
                            //요청단위시간(초)
                            fieldLabel: this.getFieldName('time_interval'),
                            xtype: 'numberfield',
                            anchor: '100%',
                            readOnly: false,
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'time_interval',
                            name: 'time_interval',
                            value: rec.get('time_interval'),
                            width: '95%',
                            hideTrigger: true,
                            mouseWheelEnabled: false,
                            keyNavEnabled: false,
                            allowDecimals: true,
                        },
                    ],
                },
            ],
        });

        var myWidth = 600;
        var myHeight = 500;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                prWin.setLoading(true);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/equipment/getChartForm.do?method=modifyEquipProp',
                                    params: val,
                                    success: function (result, request) {
                                        if (prWin) {
                                            console.log(`prWin : ${prWin}`);
                                            prWin.setLoading(false);
                                            Ext.MessageBox.alert('알림', '등록처리 되었습니다.');
                                            prWin.close();
                                        }
                                        gm.me().store.load();
                                    }, //endofsuccess
                                    failure: function () {
                                        prWin.setLoading(false);
                                        extjsUtil.failureMessage();
                                    },
                                }); //endofajax
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    },
                },
            ],
        });

        prWin.show();
    },

    // 신규등록 버튼 Action Function
    addProps: function () {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('addPropsPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side',
            },

            items: [
                {
                    xtype: 'fieldset',
                    title: '신규 데이터 속성 등록',
                    id: gu.id('addProps'),
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2',
                    },
                    items: [
                        {
                            // fieldLabel: '설비',//mchn_uid
                            fieldLabel: this.getFieldName('mchn_code'),
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            fieldStyle: 'background-image: none;',
                            store: gm.me().equipmentPropsComboStore,
                            // emptyText: '설비 선택',
                            emptyText: '설비 코드 ( 설비명 )',
                            queryMode: 'remote',
                            displayField: 'mchn_code',
                            valueField: 'mchn_uid',
                            editable: false,
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{mchn_uid}">{mchn_code} ( {name_ko} )</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    // console.log('================ 들어갈 값 >>>>>>>>>>>>', gu.getCmp('mchn_uid').getValue());
                                    // gu.getCmp('mchn_code').setValue(gu.getCmp('mchn_uid').getValue());
                                },
                            },
                            id: gu.id('mchn_uid'),
                            name: 'mchn_uid',
                            pageSize: 25,
                            triggerAction: 'all',
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_key'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'prop_key',
                            name: 'prop_key',
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_name'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'prop_name',
                            name: 'prop_name',
                            width: '95%',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_unit'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id: 'prop_unit',
                            name: 'prop_unit',
                            width: '95%',
                        },
                        {
                            fieldLabel: '연산 타입',
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['prop_cal_type', 'value'],
                                data: [
                                    { prop_cal_type: 'avg', value: '평균(avg)' },
                                    { prop_cal_type: 'sum', value: '합(sum)' },
                                ],
                            }),
                            emptyText: '연산 타입 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'prop_cal_type',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{prop_cal_type}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                            width: '95%',
                            id: 'prop_cal_type',
                            name: 'prop_cal_type',
                        },
                        {
                            fieldLabel: this.getFieldName('prop_minval'),
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_minval',
                            name: 'prop_minval',
                            width: '95%',
                            hideTrigger: true,
                            mouseWheelEnabled: false,
                            keyNavEnabled: false,
                            value: 0,
                        },
                        {
                            fieldLabel: this.getFieldName('prop_maxval'),
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'prop_maxval',
                            name: 'prop_maxval',
                            width: '95%',
                            hideTrigger: true,
                            mouseWheelEnabled: false,
                            keyNavEnabled: false,
                            value: 100,
                        },
                        {
                            fieldLabel: this.getFieldName('data_type'),
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['data_type', 'value'],
                                data: [
                                    { data_type: 'int', value: 'int' },
                                    { data_type: 'double', value: 'double' },
                                    { data_type: 'long', value: 'long' },
                                    { data_type: 'string', value: 'string' },
                                    { data_type: 'char', value: 'char' },
                                ],
                            }),
                            emptyText: '데이터 타입 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'data_type',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{data_type}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                            width: '95%',
                            id: 'data_type',
                            name: 'data_type',
                        },
                        {
                            fieldLabel: this.getFieldName('chart_type'),
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['chart_type', 'value'],
                                data: [
                                    { chart_type: 'bar', value: 'bar' },
                                    { chart_type: 'line', value: 'line' },
                                ],
                            }),
                            emptyText: '그래프 스타일 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'chart_type',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{chart_type}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                            width: '95%',
                            id: 'chart_type',
                            name: 'chart_type',
                        },
                        {
                            fieldLabel: this.getFieldName('direction'),
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['direction', 'value'],
                                data: [
                                    { direction: 'receive', value: '수신(receive)' },
                                    { direction: 'send', value: '송신(send)' },
                                ],
                            }),
                            emptyText: '송/수신 선택',
                            editable: false,
                            displayField: 'value',
                            valueField: 'direction',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{direction}">{value}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console.log(record);
                                },
                            },
                            width: '95%',
                            id: 'direction',
                            name: 'direction',
                        },
                        {
                            fieldLabel: this.getFieldName('time_interval'),
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            id: 'time_interval',
                            name: 'time_interval',
                            width: '95%',
                            hideTrigger: true,
                            mouseWheelEnabled: false,
                            keyNavEnabled: false,
                            value: 1,
                            minValue: 1,
                            allowDecimals: true,
                        },
                    ],
                },
            ],
        });

        // var myWidth = 310;
        var myWidth = 600;
        var myHeight = 450;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규 데이터 속성 등록',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                prWin.setLoading(true);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/equipment/getChartForm.do?method=addEquipProp',
                                    params: val,
                                    success: function (result, request) {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('알림', '등록처리 되었습니다.');
                                        prWin.close();
                                        gm.me().store.load();
                                    }, //endofsuccess
                                    failure: function () {
                                        prWin.setLoading(false);
                                        extjsUtil.failureMessage();
                                        prWin.close();
                                        gm.me().store.load();
                                    },
                                }); //endofajax
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    },
                },
            ],
        });
        prWin.show();
    },

    // 삭제 버튼 Action Function
    deleteProps: function () {
        var confirmFlag = null;
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>REC', rec);

        var uniqueId = rec['data']['unique_id'];

        var confirmResult = Ext.MessageBox.confirm('삭제 알림', `${uniqueId}를 삭제하시겠습니까?`, function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/equipment/getChartForm.do?method=deleteEquipProp',
                    params: {
                        unique_id: uniqueId,
                        prop_key: rec['data']['prop_key'],
                    },
                    success: function (request, request) {
                        Ext.MessageBox.alert('알림', '삭제처리 되었습니다');
                        gm.me().store.load();
                    },
                    failure: function () {
                        extjsUtil.failureMessage();
                    },
                });
            } else {
                return;
            }
        });
    },

    // Search Field Combo Store
    equipmentPropsComboStore: Ext.create('Mplm.store.EquipmentPropsComboStore'),
});
