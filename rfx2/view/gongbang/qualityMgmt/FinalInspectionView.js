// 최종검사
Ext.define('Rfx2.view.gongbang.qualityMgmt.FinalInspectionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'import-inspection-view',


    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField({
            type: 'checkbox',
            field_id: 'isReady',
            items: [
                {
                    boxLabel: '검사대기',
                    checked: true
                },
            ],
        });

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isFinish',
            items: [
                {
                    boxLabel: '검사완료',
                    checked: false
                },
            ],
        });
        this.addSearchField('lot_no');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField({
            type: 'dateRange',
            field_id: 'search_date',
            text: "생산일",
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        // this.addSearchField({
        //     // id: gu.id('dateSearch'),
        //     type: 'dateRange',
        //     field_id: 'delivery_plan',
        //     text: "시작예정일",
        //     labelWidth: 80,
        //     sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -10),
        //     edate: Ext.Date.add(new Date(), Ext.Date.MONTH, +2)
        // });

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });


        // 모델을 통한 스토어 생성
        // 공정검사결과와 같은 목록
        // this.createStoreSimple({
        //     modelClass: 'Rfx2.model.company.bioprotech.FinalInspection',
        //     pageSize: 100,
        //     sorters: [{
        //         // property: 'create_date',
        //         // direction: 'DESC'
        //     }],
        //     byReplacer: {}
        // }, {});

        this.createStore('Rfx2.model.company.bioprotech.FinalInspection', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            /*pageSize*/
            gm.pageSize
            , {
                // process_type_kr: 'spcchart.process_type',
                // measuring_type_kr: 'measuring_type',
                // item_type_kr: 'item_type'
            }
            , ['']
        );
        this.store.getProxy().setExtraParams({
            // 'type': 'F',
            'isResult': 'N',
            isReady: true,
        });


        // 디폴트 로드 전 파라미터 설정
        // this.store.getProxy().setExtraParams({
        //     // 'having_not_status' : 'BM,P0,DC',
        //     // 'not_pj_type' : 'OU',
        //     // 'multi_prd' : true,
        //     'type' : 'F'
        // });

        // searchField value 가져오기 (BASEVIEW 참조)
        // var dateRangeId = this.link + '-' + gMain.getSearchField('delivery_plan');
        // var sDate = Ext.Date.format(Ext.getCmp(dateRangeId + '-s').getValue(), 'Y-m-d');
        // var eDate = Ext.Date.format(Ext.getCmp(dateRangeId + '-e').getValue(), 'Y-m-d');
        // console.log(sDate + ':' + eDate);


        // this.store.getProxy().setExtraParams({
        //     'isFinish' : 'true',
        //     'recv_flag' : 'GE',
        //     'reserved_timestamp1' : sDate + ':' + eDate
        // });


        // this.insertResult = Ext.create('Ext.Action', {
        //     type : 'button',
        //     iconCls: 'af-plus-circle',
        //     text: '검사결과 입력',
        //     tooltip: '검사결과 입력',
        //     hidden: gMain.menu_check == true ? false : true,
        //     disabled: true,
        //     handler: function() {
        //         gm.me().insertResultFunction();
        //     }
        // });
        // buttonToolbar.insert(1, this.insertResult); 
        // 샘플결과입력 버튼
        this.editSampleResult = Ext.create('Ext.Action', {
            type: 'button',
            iconCls: 'af-plus-circle',
            text: '샘플검사',
            tooltip: '샘플검사 결과 편집',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function () {
                gm.me().editSampleResultFunction();
            }
        });

        // 로트검사판정 입력 버튼
        this.editLotResult = Ext.create('Ext.Action', {
            type: 'button',
            iconCls: 'af-plus-circle',
            text: '검사판정',
            tooltip: '검사판정 입력',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function () {
                gm.me().editLotResultFunction();
            }
        });

        // 검사 삭제 버튼
        this.deleteInspection = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '검사삭제',
            tooltip: this.getMC('msg_btn_prd_add', '최종검사 내역 삭제'),
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 차수의 최종검사 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var record = gm.me().grid.getSelectionModel().getSelection()[0].data;

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroyInspection',
                                params: {
                                    target_uid: record.unique_id_long,
                                    type: !record.type ? 'F' : record.type, // 기본값 2(최종검사)
                                    inspection_no: !record.v027 ? 1 : record.v027 // 기본값 1차 검사
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        buttonToolbar.insert(1, this.editSampleResult);
        // buttonToolbar.insert(2, this.editLotResult); 
        buttonToolbar.insert(2, this.deleteInspection);

        var btnsNeedsSelection = [];
        btnsNeedsSelection.push(this.editSampleResult);
        // btnsNeedsSelection.push(this.editLotResult);
        btnsNeedsSelection.push(this.deleteInspection);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // ---------------------------팝업그리드버튼
        // gridTest 등록 버튼
        this.addPopupBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-save',
            text: '저장',
            tooltip: this.getMC('msg_btn_prd_add', '수입검사 저장'),
            // 비활성화
            // disabled: true,
            disabled: false,
            handler: function () {
                Ext.MessageBox.show({
                    title: '저장',
                    msg: '저장하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var selections = gm.me().grid.getSelectionModel().getSelection();
                            var rec = selections[0];
                            // var target_uid = rec.get('assymap_uid');
                            var target_uid = rec.get('unique_id_long');
                            var objs = [];
                            var columns = [];
                            var obj = {};
                            var store = gm.me().popUpGrid.getStore();
                            var cnt = store.getCount();
                            console_logs('cnt', cnt);
                            for (var i = 0; i < cnt; i++) {
                                var record = store.getAt(i);
                                // console.log('저장', record.data);
                                var objv = {};
                                // objv['unique_id'] = record.get('unique_id_long');
                                // objv['xpoast_uid'] = record.get('target_uid');
                                // objv['sample_val'] = record.get('v000');
                                // objv['measure_val'] = record.get('v001');
                                // columns.push(objv);
                                objv['row' + (i + 1)] = record.data;
                                // columns.push(objv);
                                objs.push(objv);
                            }
                            // obj['datas'] = columns;
                            // objs.push(obj);

                            var jsonData = Ext.util.JSON.encode(objs);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createImportInspection',
                                params: {
                                    // 수입검사 : 'I', 최종검사 : 'F'
                                    type: 'F',
                                    target_uid: target_uid,
                                    inspection_no: gu.getCmp('inspection_no').getValue(),
                                    jsonData: jsonData
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    Ext.MessageBox.alert('알림', '저장되었습니다.')
                                    // gm.me().store.load();
                                    // gm.me().inspectionListStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // gridTest 삭제
        this.delPopupBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            // iconCls: 'af-remove',
            text: '-',
            tooltip: this.getMC('msg_btn_prd_add', '수입검사 내역 삭제'),
            // 비활성화
            // disabled: ture,
            disabled: false,
            handler: function () {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 샘플에 대한 검사 내역이 삭제됩니다. 계속하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var selections = gm.me().popUpGrid.getSelectionModel().getSelection();
                            var popUnGridStore = gm.me().popUpGrid.getStore();
                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                console.log(popUnGridStore.indexOf(rec));
                                popUnGridStore.removeAt(popUnGridStore.indexOf(rec));
                            }
                            // Ext.Ajax.request({
                            //     url: CONTEXT_PATH + '/quality/qualitymgmt.do?method=importInspectionDel',
                            //     params:{
                            //         uniqueIds: uniqueIds
                            //     },
                            //     success : function(result, request) {
                            //         var resultText = result.responseText;
                            //         console_log('result:' + resultText);
                            //         gm.me().store.load();
                            //         gm.me().inspectionListStore.load();
                            //     },
                            //     failure : extjsUtil.failureMessage
                            // });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 팝업grid
        this.popUpGrid = Ext.create('Ext.grid.Panel', {
            // store: this.testStore,
        });

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });

        this.callParent(arguments);

        //디폴트 로드

        gm.setCenterLoading(false);

        // this.store.load({
        //     callback: function (records, operation, success) {
        //         if (success) {
        //             console.log(records);
        //         }
        //     }
        // }

        // );
        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                btnsNeedsSelection.forEach(el => {
                    el.enable();
                });
                // this.editSampleResult.enable();
                // this.editLotResult.enable();
                // this.deleteInspection.enable();
            } else {
                btnsNeedsSelection.forEach(el => {
                    el.disable();
                });
                // this.editSampleResult.disable();
                // this.editLotResult.disable();
                // this.deleteInspection.disable();
            }
        });

    }, // end of init

    // -----샘플검사결과입력(팝업) 버튼 핸들러
    editSampleResultFunction: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0].data;

        var target_uid = rec.unique_id_long;
        var inspection_date = !rec.v024 ? new Date() : rec.v024;

        // 기존 검사결과 조회
        // var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', {});
        var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', {});
        inspectionResultStore.getProxy().setExtraParams(
            {
                inspection_no: !rec.v027 ? '1' : rec.v027,
                target_uid: target_uid,
                type: 'F',
            }
        );
        inspectionResultStore.load();

        // 검사항목 스토어
        var spccolumnStore = Ext.create('Mplm.store.SpcColumnByItemCode');
        spccolumnStore.item_code = rec.item_code;
        spccolumnStore.process_type = 2;
        spccolumnStore.load({
            callback: function (records, operation, success) {
                // console.log(spccolumns); //root프로퍼티에 지정된데이터
                // 로드 성공시 메서드 호출
                if (success) {
                    createWindow(records);
                }
            }
        });

        // 기존 result 가 없을경우 name을 isPass 로 대체하기 위함
        var spccolumn_uid_result = 'isPass';

        // 검사항목 스토어 로드시 콜백 메서드
        function createWindow(spccolumns) {

            // 샘플검사 헤더 패널
            // var panelHeader = Ext.create('Ext.panel.Panel', {
            var panelHeader = {
                title: '상세 정보',
                width: '99%',
                height: '20%',
                xtype: 'fieldset',
                layout: {
                    type: 'hbox',
                    // padding: 10
                },
                defaults: {
                    anchor: '100%',
                    // labelWidth: 50,
                    labelAlign: 'right',
                    // margin: 10,
                    padding: 10,
                    fieldStyle: 'background-color: #EAEAEA;',
                    readOnly: true,
                },
                items: [
                    {
                        labelWidth: 100,
                        fieldLabel: '생산지시번호',
                        xtype: 'textfield',
                        value: rec.lot_no,
                        flex: 0.8
                    },
                    {
                        labelWidth: 40,
                        fieldLabel: '품명',
                        xtype: 'textfield',
                        value: rec.item_name,
                        flex: 1.2
                    },
                ]
            };

            // 샘플검사 중간 fieldset
            // var panelCenter = {
            //     title: '검사정보',
            //     width: '99%',
            //     height: '20%',
            //     xtype: 'fieldset',
            //     layout: {
            //         type: 'hbox',
            //         // padding: 10
            //     },
            //     defaults: {
            //         anchor: '100%',
            //         // labelWidth: 50,
            //         labelAlign: 'right',
            //         // margin: 10,
            //         padding: 10,
            //         // fieldStyle: 'background-color: #EAEAEA;',
            //         // readOnly: true,
            //     },
            //     items: [
            //         {
            //             labelWidth: 80,
            //             labelAlign: 'right',
            //             fieldLabel: '검사 차수',
            //             xtype: 'textfield',
            //             value: !rec.v027 ? '1' : rec.v027,
            //             id: gu.id('inspection_no'),
            //             // width: '20%',
            //             fieldStyle: 'background-color: #EAEAEA;',
            //             flex: 0.4,
            //             readOnly: true,
            //             // emptyText: '1'
            //         },
            //         {
            //             fieldLabel: '판정결과',
            //             id: gu.id('lot_result'),
            //             name: 'okng',
            //             value: rec.v028,
            //             // fieldStyle: 'background-color: #EAEAEA; background-image: none;',
            //             // readOnly: true
            //             xtype: 'combo',
            //             displayField: 'isOK',
            //             valueField: 'value',
            //             fields: ['isOK', 'value'],
            //             triggerAction: 'all',
            //             emptyText: 'OK/NG',
            //             queryMode: 'local',
            //             store: {
            //                 data: [
            //                     { 'isOK': "OK", "value": "OK" },
            //                     { 'isOK': "NG", "value": "NG" },
            //                 ]
            //             },
            //             listConfig: {
            //                 loadingText: '검색중...',
            //                 emptyText: '일치하는 항목 없음.',
            //                 getInnerTpl: function () {
            //                     return '<div data-qtip="{isOK}">{isOK}</div>';
            //                 }
            //             },
            //             flex: 0.6,
            //         },
            //         {
            //             labelWidth: 80,
            //             // labelAlign: 'right',
            //             fieldLabel: '검사 수준',
            //             xtype: 'textfield',
            //             id: gu.id('aql_level'),
            //             // width: '20%',
            //             flex: 0.6,
            //             value: rec.v026
            //         },
            //         {
            //             labelWidth: 80,
            //             // labelAlign: 'right',
            //             fieldLabel: '특이 사항',
            //             xtype: 'textfield',
            //             id: gu.id('description'),
            //             // width: '20%',
            //             flex: 1,
            //             value: rec.v025
            //         },
            //     ]
            // };

            var panelCenter = {
                title: '검사정보',
                width: '99%',
                height: '23%',
                xtype: 'fieldset',
                layout: {
                    type: 'vbox',
                    // padding: 10
                },

                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                        },
                        width: '99%',
                        height: '50%',
                        defaults: {
                            anchor: '100%',
                            // labelWidth: 50,
                            labelAlign: 'right',
                            // margin: 10,
                            padding: 10,
                            // fieldStyle: 'background-color: #EAEAEA;',
                            // readOnly: true,
                        },
                        items: [
                            {
                                labelWidth: 80,
                                labelAlign: 'right',
                                fieldLabel: '검사 차수',
                                xtype: 'textfield',
                                value: !rec.v027 ? '1' : rec.v027,
                                id: gu.id('inspection_no'),
                                // width: '20%',
                                fieldStyle: 'background-color: #EAEAEA;',
                                flex: 0.4,
                                readOnly: true,
                                // emptyText: '1'
                            },
                            {
                                fieldLabel: '판정결과',
                                id: gu.id('lot_result'),
                                name: 'okng',
                                value: rec.v028,
                                // fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                // readOnly: true
                                xtype: 'combo',
                                displayField: 'isOK',
                                valueField: 'value',
                                fields: ['isOK', 'value'],
                                triggerAction: 'all',
                                emptyText: 'OK/NG',
                                queryMode: 'local',
                                store: {
                                    data: [
                                        {'isOK': "OK", "value": "OK"},
                                        {'isOK': "NG", "value": "NG"},
                                    ]
                                },
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{isOK}">{isOK}</div>';
                                    }
                                },
                                flex: 0.6,
                            },
                            {
                                fieldLabel: '검사일',
                                xtype: 'datefield',
                                id: gu.id('inspection_date'),
                                name: 'inspection_date',
                                maxValue: new Date(),
                                // value: rec.v024.replace(/\//g,'-'),
                                value: inspection_date,
                                format: 'Y-m-d',
                                flex: 1,
                            }
                        ]
                    },

                    {
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                        },
                        width: '99%',
                        height: '50%',
                        defaults: {
                            anchor: '100%',
                            // labelWidth: 50,
                            labelAlign: 'right',
                            // margin: 10,
                            padding: 10,
                            // fieldStyle: 'background-color: #EAEAEA;',
                            // readOnly: true,
                        },
                        items: [
                            {
                                labelWidth: 80,
                                // labelAlign: 'right',
                                fieldLabel: '검사 수준',
                                xtype: 'textfield',
                                id: gu.id('aql_level'),
                                // width: '20%',
                                flex: 0.6,
                                value: rec.v026,
                                hidden: true
                            },
                            {
                                labelWidth: 80,
                                // labelAlign: 'right',
                                fieldLabel: '특이 사항',
                                xtype: 'textfield',
                                id: gu.id('description'),
                                // width: '20%',
                                flex: 1,
                                value: rec.v025
                            },
                        ]
                    }
                    ,


                ]
            };

            // 그리드에 표시할 컬럼 목록 담을 변수 생성
            var gridColumns = [];
            var gridColumnsDynamic = [];

            // 매핑된 검사항목들 컬럼목록에 추가
            for (let index = 0; index < spccolumns.length; index++) {
                const el = spccolumns[index];
                var measuring_type = el.get('measuring_type'),
                    columnName = el.get('legend_code_kr'),
                    spec = el.get('spec'),
                    ucl = el.get('ucl'),
                    lcl = el.get('lcl'),
                    spccolumn_uid = el.get('unique_id');
                // index를 문자열로 활용하기 위해 자리수 맞추기
                // var indexSample = index + '';
                // while (indexSample.length < 2) {
                //     indexSample = '0' + indexSample;
                // }
                // indexSample =  indexSample.length == 2 ? indexSample : '0' + indexSample;

                // 수치측정인 경우
                if (measuring_type === '2') {
                    // gridColumns.push({
                    gridColumnsDynamic.push({
                        text: !(ucl && lcl) ? columnName : columnName + '<br>(' + lcl + '-' + ucl + ')',
                        // dataIndex: 'v0' + indexSample,
                        name: spccolumn_uid,
                        width: 100,
                        align: 'center',
                        style: 'text-align:center',
                        dataIndex: spccolumn_uid,
                        editor: {
                            allowBlank: false
                        }
                    });
                }
                // OK/NG인 경우
                else if (measuring_type === '1' && columnName != '결과') {
                    // gridColumns.push(
                    gridColumnsDynamic.push(
                        {
                            text: columnName,
                            dataIndex: spccolumn_uid,
                            width: 100,
                            align: 'center',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combo',
                                name: spccolumn_uid,
                                displayField: 'isOK',
                                valueField: 'value',
                                fields: ['isOK', 'value'],
                                triggerAction: 'all',
                                emptyText: 'OK/NG',
                                queryMode: 'local',
                                store: {
                                    data: [
                                        {'isOK': "OK", "value": "OK"},
                                        {'isOK': "NG", "value": "NG"},
                                    ]
                                },
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{isOK}">{isOK}</div>';
                                    }
                                },
                                editable: true
                            },
                        }
                    );
                } else if (measuring_type === '1' && columnName == '결과') {
                    spccolumn_uid_result = spccolumn_uid;
                }
            }

            // 항상 표시할 컬럼 추가
            gridColumns.push({
                text: '샘플별결과',
                width: 100,
                align: 'left',
                style: 'text-align:center',
                dataIndex: spccolumn_uid_result,
                name: 'isPass',
                align: 'center',
                locked: true, // 스크롤시 고정 표시
                style: 'text-align:center',
                editor: {
                    xtype: 'combo',
                    name: 'isPass',
                    displayField: 'isOK',
                    valueField: 'value',
                    fields: ['isOK', 'value'],
                    triggerAction: 'all',
                    emptyText: 'OK/NG',
                    queryMode: 'local',
                    store: {
                        data: [
                            {'isOK': "OK", "value": "OK"},
                            {'isOK': "NG", "value": "NG"},
                        ]
                    },
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{isOK}">{isOK}</div>';
                        }
                    },
                    editable: true
                }
            });

            gridColumns = gridColumns.concat(gridColumnsDynamic);

            gridColumns.push({
                text: '검사일',
                width: 130,
                style: 'text-align:center',
                align: 'left',
                dataIndex: 'inspection_date',
                name: 'inspection_date_grid'
            });

            gridColumns.push({
                text: '검사원',
                width: 120,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'worker',
                name: 'worker_grid'
            });


            // 팝업그리드
            gm.me().popUpGrid = Ext.create('Ext.grid.Panel', {
                store: inspectionResultStore,
                // store: gm.me().testStore,
                // cls: 'rfx-panel',
                collapsible: false,
                multiSelect: false,
                autoScroll: true,
                height: '58%',
                width: '99%',
                // autoWidth: true,
                // autoHeight: true,
                frame: true,
                // bbar: getPageToolbar(gm.me().testStore),
                bbar: getPageToolbar(inspectionResultStore),
                border: true,
                region: 'center',
                layout: 'fit',
                forceFit: false,
                plugins: [
                    {
                        ptype: 'cellediting',
                        clicksToEdit: 1,
                    },
                ],
                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                margin: '5 0 0 0',
                // 매핑된 컬럼 적용
                columns: gridColumns,
                name: 'capa',
                autoScroll: true,
                tbar: [
                    // {
                    //     xtype: 'toolbar',
                    //     items: [gm.me().addPopupBtn]
                    // },
                    {
                        text: '+',
                        listeners: [{
                            click: function () {
                                var store = inspectionResultStore;
                                // var store = gm.me().testStore;
                                store.insert(store.getCount(), new Ext.data.Record({
                                    // 'wth_uid': -1,
                                    // 'etc_date': '',
                                    // 'etc_items': '',
                                    // 'etc_price': '0'
                                }));
                            }
                        }]
                    },
                    gm.me().delPopupBtn,

                ],
                //     text: '+',
                //     listeners: [{
                //         click: function () {
                //             // 컬럼 추가
                //             gridColumns.push({
                //                 text: '샘플' + sampleIndex,
                //                 width: 100,
                //                 align: 'left',
                //                 style: 'text-align:center',
                //                 dataIndex: 'v00' + sampleIndex++,
                //                 editor: {
                //                     allowBlank: false
                //                 }
                //             });
                //             gridTest.setColumns(gridColumns);
                //         }
                //     }]
                // },
                // {
                //     text: '-',
                //     listeners: [{
                //         click: function () {
                //             // 컬럼 제거
                //             var columnText = gridColumns[gridColumns.length - 1].text;
                //             if (columnText.includes('샘플')) {
                //                 gridColumns.pop();
                //                 sampleIndex--;
                //                 gridTest.setColumns(gridColumns);
                //             }
                //         }
                //     }]
                // }],
                listeners: {}
            });

            var prWin = Ext.create('Ext.window.Window', {
                modal: true,
                title: '샘플검사 입력',
                // autowidth: true,
                width: 1100,
                height: 600,
                autoScroll: true,
                plain: true,
                layout: 'vbox',
                items: [
                    panelHeader,
                    panelCenter,
                    gm.me().popUpGrid
                ],
                buttons: [
                    // {
                    //     text: CMD_OK,
                    //     handler: function (btn) {
                    //         if (btn == 'no') {
                    //             prWin.close();
                    //         } else {
                    //             // if (form.isValid()) {
                    //             //     var val = form.getValues(false);
                    //             //     console_logs('===val', val);

                    //             //     form.submit({
                    //             //         // url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcChartMgmt',
                    //             //         params: {
                    //             //         },
                    //             //         success: function (result, request) {
                    //             //             if (prWin) {
                    //             //                 prWin.close();
                    //             //             }
                    //             //             gm.me().store.load();
                    //             //         }, //endofsuccess
                    //             //         failure: extjsUtil.failureMessage
                    //             //     }); //endofajax
                    //             // }
                    //         }
                    //     }
                    // },
                    {
                        xtype: 'button',
                        iconCls: 'af-save',
                        text: '저장',
                        tooltip: '최종검사 저장',
                        // 비활성화
                        // disabled: true,
                        disabled: false,
                        handler: function () {
                            Ext.MessageBox.show({
                                title: '저장',
                                msg: '저장하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn == 'yes') {
                                        var selections = gm.me().grid.getSelectionModel().getSelection();
                                        var rec = selections[0];
                                        var target_uid = rec.get('unique_id_long');
                                        var objs = [];
                                        var columns = [];
                                        var obj = {};
                                        var store = gm.me().popUpGrid.getStore();
                                        var cnt = store.getCount();
                                        // console_logs('cnt', cnt);
                                        for (var i = 0; i < cnt; i++) {
                                            var record = store.getAt(i);
                                            // console.log('저장', record.data);
                                            var objv = {};
                                            objv['row' + (i + 1)] = record.data;
                                            // columns.push(objv);
                                            objs.push(objv);
                                        }
                                        // obj['datas'] = columns;
                                        // objs.push(obj);

                                        var jsonData = Ext.util.JSON.encode(objs);
                                        console.log('sadfsdf', jsonData);
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createImportInspection',
                                            params: {
                                                // 수입검사 : 'I',
                                                type: 'F',
                                                target_uid: target_uid,
                                                jsonData: jsonData,
                                                // inspection_no: !rec.v027 ? '1' : rec.v027 // 검사 차수
                                                inspection_no: gu.getCmp('inspection_no').getValue(),
                                                lot_result: gu.getCmp('lot_result').getValue(),
                                                aql_level: gu.getCmp('aql_level').getValue(),
                                                description: gu.getCmp('description').getValue(),
                                                inspection_date: Ext.Date.format(gu.getCmp('inspection_date').getValue(), 'Y-m-d'),
                                            },
                                            success: function (result, request) {
                                                var resultText = result.responseText;
                                                console_log('result:' + resultText);
                                                Ext.MessageBox.alert('알림', '저장되었습니다.')
                                                prWin.close();
                                                gm.me().store.load();
                                                // gm.me().inspectionListStore.load();
                                            },
                                            failure: extjsUtil.failureMessage
                                        });

                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    }
                    ,
                    {
                        text: '닫기',
                        handler: function () {
                            Ext.MessageBox.show({
                                title: '닫기',
                                msg: '저장하지 않은 검사 내역이 삭제됩니다. 계속하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn == 'yes') {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                            });

                        }
                    }
                ],
                listeners:
                    {}
            });
            prWin.show();
        };// end of callback fn

    },// End Of editSampleResultFunction

    // -----검사결과입력(팝업) 버튼 핸들러
    // editSampleResultFunction: function () {

    //     var rec = gm.me().grid.getSelectionModel().getSelection()[0].data;

    //     // var target_uid = rec.assymap_uid;
    //     var target_uid = rec.unique_id_long;

    //     // 기존 검사결과 조회
    //     var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', {});
    //     inspectionResultStore.getProxy().setExtraParams(
    //         {
    //             inspection_no: !rec.v027 ? '1' : rec.v027,
    //             target_uid: target_uid,
    //             type: 'F',
    //         }
    //     );
    //     inspectionResultStore.load();

    //     // 검사항목 스토어
    //     var spccolumnStore = Ext.create('Mplm.store.SpcColumnByItemCode');
    //     spccolumnStore.item_code = rec.item_code;
    //     spccolumnStore.process_type = 2;
    //     spccolumnStore.load({
    //         callback: function(records, operation, success){
    //             // console.log(spccolumns); //root프로퍼티에 지정된데이터
    //             // 로드 성공시 메서드 호출
    //             if(success){
    //                 createWindow(records);
    //             }
    //         }
    //     });

    //     // 기존 result 가 없을경우 name을 isPass 로 대체하기 위함
    //     var spccolumn_uid_result = 'isPass';

    //     // 검사항목 스토어 로드시 콜백 메서드
    //     function createWindow(spccolumns) {

    //         // 헤더 패널
    //         // var panelHeader = Ext.create('Ext.panel.Panel', {
    //         var panelHeader = {
    //             title: '상세정보',
    //             width: '99%',
    //             height: '24%',
    //             xtype: 'fieldset',
    //             layout: {
    //                 type: 'vbox',
    //                 // padding: 10,
    //             },

    //             items: [
    //                 {
    //                     xtype : 'panel',
    //                     layout : 'hbox',
    //                     region : 'north',
    //                     height : '60%',
    //                     defaults: {
    //                         anchor: '100%',
    //                         // labelWidth: 90,
    //                         labelAlign: 'right',
    //                         fieldStyle: 'background-color: #EAEAEA;',
    //                         readOnly: true,
    //                     },
    //                     items: [
    //                         {
    //                             labelWidth: 50,
    //                             fieldLabel: '품명',
    //                             xtype: 'textfield',
    //                             value: rec.item_name,
    //                             flex: 1
    //                         },
    //                         {
    //                             labelWidth: 100,
    //                             fieldLabel: '생산지시번호',
    //                             xtype: 'textfield',
    //                             value: rec.lot_no,
    //                             flex: 1
    //                         },
    //                         // {
    //                         //     labelWidth: 90,
    //                         //     fieldLabel: '고객사',
    //                         //     xtype: 'textfield',
    //                         //     value: rec.customer_name,
    //                         //     flex: 1
    //                         // },

    //                     ]
    //                 },
    //             ]
    //         };


    //         // 그리드에 표시할 컬럼 목록 담을 변수 생성
    //         var gridColumns = [];
    //         var gridColumnsDynamic = [];

    //         // 매핑된 검사항목들 컬럼목록에 추가
    //         for (let index = 0; index < spccolumns.length; index++) {
    //             const el = spccolumns[index];
    //             var measuring_type = el.get('measuring_type'),
    //                 columnName = el.get('legend_code_kr'),
    //                 spec = el.get('spec'),
    //                 ucl = el.get('ucl'),
    //                 lcl = el.get('lcl'),
    //                 spccolumn_uid = el.get('unique_id');
    //             // index를 문자열로 활용하기 위해 자리수 맞추기
    //             // var indexSample = index + '';
    //             // while (indexSample.length < 2) {
    //             //     indexSample = '0' + indexSample;
    //             // }
    //             // indexSample =  indexSample.length == 2 ? indexSample : '0' + indexSample;

    //             // 수치측정인 경우
    //             if (measuring_type === '2'){
    //                 gridColumnsDynamic.push({
    //                     // text: columnName,
    //                     text: !(ucl&&lcl) ? columnName : columnName + '<br>(' + lcl + '-' + ucl +')',
    //                     // dataIndex: 'v0' + indexSample,
    //                     name: spccolumn_uid,
    //                     width: 100,
    //                     align: 'center',
    //                     style: 'text-align:center',
    //                     dataIndex: spccolumn_uid,
    //                     editor: {
    //                         allowBlank: false
    //                     }
    //                 });
    //             }
    //             // OK/NG인 경우
    //             else if (measuring_type === '1' && columnName != '결과') {
    //                 gridColumnsDynamic.push(
    //                     {
    //                         text: columnName,
    //                         dataIndex: spccolumn_uid,
    //                         width: 100,
    //                         align: 'center',
    //                         style: 'text-align:center',
    //                         editor: {
    //                             xtype: 'combo',
    //                             name: spccolumn_uid,
    //                             displayField: 'isOK',
    //                             valueField: 'value',
    //                             fields: ['isOK', 'value'],
    //                             triggerAction: 'all',
    //                             emptyText: 'OK/NG',
    //                             queryMode: 'local',
    //                             store: {
    //                                 data: [
    //                                     { 'isOK': "OK", "value": "OK" },
    //                                     { 'isOK': "NG", "value": "NG" },
    //                                 ]
    //                             },
    //                             listConfig: {
    //                                 loadingText: '검색중...',
    //                                 emptyText: '일치하는 항목 없음.',
    //                                 getInnerTpl: function () {
    //                                     return '<div data-qtip="{isOK}">{isOK}</div>';
    //                                 }
    //                             },
    //                             editable: true
    //                         },
    //                     }
    //                 );
    //             }
    //             else if (measuring_type === '1' && columnName == '결과') {
    //                 spccolumn_uid_result = spccolumn_uid;
    //             }
    //         }

    //         // 항상 표시할 컬럼 추가
    //         gridColumns.push({
    //             text: '샘플별결과',
    //             width: 100,
    //             align: 'left',
    //             style: 'text-align:center',
    //             dataIndex: spccolumn_uid_result,
    //             name: 'isPass',
    //             align: 'center',
    //             locked: true, // 스크롤시 고정 표시
    //             style: 'text-align:center',
    //             editor: {
    //                 xtype: 'combo',
    //                 name: 'isPass',
    //                 displayField: 'isOK',
    //                 valueField: 'value',
    //                 fields: ['isOK', 'value'],
    //                 triggerAction: 'all',
    //                 emptyText: 'OK/NG',
    //                 queryMode: 'local',
    //                 store: {
    //                     data: [
    //                         { 'isOK': "OK", "value": "OK" },
    //                         { 'isOK': "NG", "value": "NG" },
    //                     ]
    //                 },
    //                 listConfig: {
    //                     loadingText: '검색중...',
    //                     emptyText: '일치하는 항목 없음.',
    //                     getInnerTpl: function () {
    //                         return '<div data-qtip="{isOK}">{isOK}</div>';
    //                     }
    //                 },
    //                 editable: true
    //             }
    //         });

    //         gridColumns = gridColumns.concat(gridColumnsDynamic);

    //         gridColumns.push({
    //             text: '검사일',
    //             width: 130,
    //             style: 'text-align:center',
    //             align: 'left',
    //             dataIndex: 'inspection_date',
    //             name: 'inspection_date_grid'
    //         });

    //         gridColumns.push({ 
    //             text: '검사원', 
    //             width: 120, 
    //             align: 'left', 
    //             style: 'text-align:center', 
    //             dataIndex: 'worker',
    //             name: 'worker_grid'  
    //         });

    //         // gridColumns.push({ 
    //         //     text: 'uid_for_modify', 
    //         //     width: 120, 
    //         //     align: 'left', 
    //         //     style: 'text-align:center', 
    //         //     dataIndex: 'unique_id_long',
    //         //     // 숨김
    //         //     hidden: true,
    //         // });

    //         // 팝업그리드
    //         gm.me().popUpGrid = Ext.create('Ext.grid.Panel', {
    //             store: inspectionResultStore,
    //             // store: gm.me().testStore,
    //             // cls: 'rfx-panel',
    //             collapsible: false,
    //             multiSelect: false,
    //             autoScroll: true,
    //             height: '75%',
    //             width: '99%',
    //             // autoWidth: true,
    //             // autoHeight: true,
    //             frame: true,
    //             // bbar: getPageToolbar(gm.me().testStore),
    //             // bbar: getPageToolbar(inspectionResultStore),
    //             border: true,
    //             region: 'center',
    //             layout: 'fit',
    //             forceFit: false,
    //             plugins: [
    //                 {
    //                     ptype: 'cellediting',
    //                     clicksToEdit: 1,
    //                 },
    //             ],
    //             selModel: Ext.create("Ext.selection.CheckboxModel", {}),
    //             margin: '5 0 0 0',
    //             // 매핑된 컬럼 적용
    //             columns: gridColumns,
    //             name: 'capa',
    //             tbar: [
    //                 {
    //                     xtype: 'toolbar',
    //                     items: [gm.me().addPopupBtn]
    //                 },
    //                 {
    //                     text: '+',
    //                     listeners: [{
    //                         click: function () {
    //                             var store = inspectionResultStore;
    //                             // var store = gm.me().testStore;
    //                             store.insert(store.getCount(), new Ext.data.Record({
    //                                 // 'wth_uid': -1,
    //                                 // 'etc_date': '',
    //                                 // 'etc_items': '',
    //                                 // 'etc_price': '0'
    //                             }));
    //                         }
    //                     }]
    //                 },
    //                 gm.me().delPopupBtn,
    //                 {
    //                     labelWidth: 80,
    //                     labelAlign: 'right',
    //                     fieldLabel: '검사 차수',
    //                     xtype: 'textfield',
    //                     value: !rec.v027 ? '1' : rec.v027,
    //                     id: gu.id('inspection_no'),
    //                     width: '20%',
    //                     readOnly: true,
    //                     // emptyText: '1'
    //                 },
    //                 // {
    //                 //     xtype: 'hiddenfield',
    //                 //     value: !rec.v027 ? '1' : rec.v027,
    //                 //     id: gu.id('inspection_no_hidden'),
    //                 // },
    //                 // {
    //                 //     xtype: 'button',
    //                 //     text: '조회',
    //                 //     iconCls: 'af-search',
    //                 //     handler: function(){
    //                 //         var inspection_no = gu.getCmp('inspection_no').getValue();
    //                 //         inspectionResultStore.getProxy().setExtraParams(
    //                 //             {
    //                 //                 inspection_no: inspection_no,
    //                 //                 target_uid: target_uid,
    //                 //                 type: 'F',
    //                 //             }
    //                 //         );
    //                 //         inspectionResultStore.load();
    //                 //         gu.getCmp('inspection_no_hidden').setValue(inspection_no);
    //                 //     }
    //                 // }

    //             ],
    //                 //     text: '+',
    //                 //     listeners: [{
    //                 //         click: function () {
    //                 //             // 컬럼 추가
    //                 //             gridColumns.push({
    //                 //                 text: '샘플' + sampleIndex,
    //                 //                 width: 100,
    //                 //                 align: 'left',
    //                 //                 style: 'text-align:center',
    //                 //                 dataIndex: 'v00' + sampleIndex++,
    //                 //                 editor: {
    //                 //                     allowBlank: false
    //                 //                 }
    //                 //             });
    //                 //             gridTest.setColumns(gridColumns);
    //                 //         }
    //                 //     }]
    //                 // },
    //                 // {
    //                 //     text: '-',
    //                 //     listeners: [{
    //                 //         click: function () {
    //                 //             // 컬럼 제거
    //                 //             var columnText = gridColumns[gridColumns.length - 1].text;
    //                 //             if (columnText.includes('샘플')) {
    //                 //                 gridColumns.pop();
    //                 //                 sampleIndex--;
    //                 //                 gridTest.setColumns(gridColumns);
    //                 //             }
    //                 //         }
    //                 //     }]
    //                 // }],
    //             listeners: {
    //             }
    //         });

    //         var prWin = Ext.create('Ext.window.Window', {
    //             modal: true,
    //             title: '신규등록',
    //             // autowidth: true,
    //             width: 1100,
    //             height: 600,
    //             autoScroll: true,
    //             plain: true,
    //             layout: 'vbox',
    //             items: [
    //                 panelHeader,
    //                 gm.me().popUpGrid
    //             ],
    //             buttons: [
    //                 // {
    //                 //     text: CMD_OK,
    //                 //     handler: function (btn) {
    //                 //         if (btn == 'no') {
    //                 //             prWin.close();
    //                 //         } else {
    //                 //             // if (form.isValid()) {
    //                 //             //     var val = form.getValues(false);
    //                 //             //     console_logs('===val', val);

    //                 //             //     form.submit({
    //                 //             //         // url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcChartMgmt',
    //                 //             //         params: {
    //                 //             //         },
    //                 //             //         success: function (result, request) {
    //                 //             //             if (prWin) {
    //                 //             //                 prWin.close();
    //                 //             //             }
    //                 //             //             gm.me().store.load();
    //                 //             //         }, //endofsuccess
    //                 //             //         failure: extjsUtil.failureMessage
    //                 //             //     }); //endofajax
    //                 //             // }
    //                 //         }
    //                 //     }
    //             // },
    //                 {
    //                     text: '닫기',
    //                     handler: function () {
    //                         Ext.MessageBox.show({
    //                             title: '닫기',
    //                             msg: '저장하지 않은 검사 내역이 삭제됩니다. 계속하시겠습니까?',
    //                             buttons: Ext.MessageBox.YESNO,
    //                             fn: function(btn) {
    //                                 if(btn=='yes') {
    //                                     if (prWin) {
    //                                         prWin.close();
    //                                     }
    //                                 }
    //                             },
    //                             icon: Ext.MessageBox.QUESTION
    //                         });

    //                     }
    //                 }
    //             ],
    //             listeners:
    //             {
    //             }
    //         });
    //         prWin.show();
    //     };// end of callback fn


    // },// End Of insertResultFunction

    // -----검사판정입력(팝업) 버튼 핸들러
    editLotResultFunction: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0].data;

        var target_uid = rec.unique_id_long;

        // 기존 검사결과 조회
        var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', {});
        inspectionResultStore.getProxy().setExtraParams(
            {
                target_uid: target_uid,
                type: 'F',
                item_type: 'ALL',
                legend_code: 'result'
            }
        );
        inspectionResultStore.load();

        // 검사항목 스토어
        // var spccolumnStore = Ext.create('Mplm.store.SpcColumnByItemCode');
        // spccolumnStore.item_code = rec.item_code;
        // spccolumnStore.process_type = 1;
        // spccolumnStore.load({
        //     callback: function(records, operation, success){
        //         // console.log(spccolumns); //root프로퍼티에 지정된데이터
        //         // 로드 성공시 메서드 호출
        //         if(success){
        //             createWindow(records);
        //         }
        //     }
        // });

        // 헤더 패널
        var panelHeader = Ext.create('Ext.form.FieldSet', {
            title: '상세정보',
            width: 300,
            height: 230,
            // xtype: 'fieldset',
            layout: {
                type: 'vbox',
                padding: 10
            },
            defaults: {
                anchor: '100%',
                labelWidth: 70,
                labelAlign: 'right',
                // margin: 10,
                padding: 10,
                fieldStyle: 'background-color: #EAEAEA;',
                readOnly: true,
            },
            items: [
                {
                    // labelWidth: 60,
                    fieldLabel: '생산지시번호',
                    xtype: 'textfield',
                    value: rec.lot_no,
                    // flex: 0.8
                },
                {
                    // labelWidth: 40,
                    fieldLabel: '품명',
                    xtype: 'textfield',
                    value: rec.item_name,
                    // flex: 1.2
                },
                // {
                //     // labelWidth: 50,
                //     fieldLabel: '공급사',
                //     xtype: 'textfield',
                //     value: rec.seller_name,
                //     // flex: 1
                // },
                {
                    // labelWidth: 50,
                    fieldLabel: '검사차수',
                    xtype: 'textfield',
                    value: !rec.v027 ? '1' : rec.v027,
                    // flex: 1
                },
            ]
        });
        var form = Ext.create('Ext.form.Panel', {
            // 판정결과 콤보박스, target_uid, type, 검사차수
            id: gu.id('formPanel'),
            // xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 70,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '판정결과',
                    name: 'okng',
                    value: rec.v028,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    // readOnly: true
                    xtype: 'combo',
                    displayField: 'isOK',
                    valueField: 'value',
                    fields: ['isOK', 'value'],
                    triggerAction: 'all',
                    emptyText: 'OK/NG',
                    queryMode: 'local',
                    store: {
                        data: [
                            {'isOK': "OK", "value": "OK"},
                            {'isOK': "NG", "value": "NG"},
                        ]
                    },
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{isOK}">{isOK}</div>';
                        }
                    },
                },
            ]
        });

        // var prWin = Ext.create('Ext.Window', {
        //     modal: true,
        //     title: '수정',
        //     width: 350,
        //     height: 250,
        //     plain: true,
        //     items: form,
        //     buttons: [{
        //         text: CMD_OK,
        //         handler: function (btn) {
        //             if (btn == 'no') {
        //                 prWin.close();
        //             } else {
        //                 if (form.isValid()) {
        //                     var val = form.getValues(false);
        //                     console_logs('===val_modify', val);

        //                     form.submit({
        //                         url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcItem',
        //                         params: {
        //                         },
        //                         success: function (result, request) {
        //                             if (prWin) {
        //                                 prWin.close();
        //                             }
        //                             gm.me().store.load();
        //                         }, //endofsuccess
        //                         failure: extjsUtil.failureMessage
        //                     }); //endofajax
        //                 }
        //             }
        //         }
        //     }, {
        //         text: CMD_CANCEL,
        //         handler: function () {
        //             if (prWin) {
        //                 prWin.close();
        //             }
        //         }
        //     }
        //     ]
        // });

        var prWin = Ext.create('Ext.window.Window', {
            modal: true,
            title: '검사판정 등록',
            // autowidth: true,
            width: 310,
            height: 350,
            autoScroll: true,
            plain: true,
            layout: 'vbox',
            items: [
                panelHeader, form
            ],
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            // 파라미터 : 판정결과 콤보박스, target_uid, type, 검사차수

                            if (form.isValid()) {
                                var val = form.getValues(false);
                                console_logs('===val', val);

                                form.submit({
                                    url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createLotInspectionRS',
                                    params: {
                                        target_uid: rec.unique_id_long, // wgrast_uid
                                        type: 'F',
                                        inspection_no: !rec.v027 ? '1' : rec.v027 // 검사 차수
                                    },
                                    success: function (result, request) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        gm.me().store.load();
                                    }, //endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); //endofajax
                            }
                        }
                    }
                },
                {
                    text: '닫기',
                    handler: function () {
                        // Ext.MessageBox.show({
                        // title: '닫기',
                        // msg: '저장하지 않은 검사 내역이 삭제됩니다. 계속하시겠습니까?',
                        // buttons: Ext.MessageBox.YESNO,
                        // fn: function (btn) {
                        //     if (btn == 'yes') {
                        //         if (prWin) {
                        prWin.close();
                        //         }
                        //     }
                        // },
                        // icon: Ext.MessageBox.QUESTION
                        // });

                    }
                }
            ],
            listeners:
                {}
        });
        prWin.show();
        // end of callback fn

    },// End Of editSampleResultFunction
});
