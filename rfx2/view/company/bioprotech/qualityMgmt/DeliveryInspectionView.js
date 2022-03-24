// 출하검사 & 결과
Ext.define('Rfx2.view.company.bioprotech.qualityMgmt.DeliveryInspectionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-inspection-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField('item_type');
        this.addSearchField('lot_no');
        this.addSearchField('po_no');
        this.addSearchField('item_name');
        this.addSearchField('wa_name');

        // var sDateYear = 0;
        // var sDateMonth = 0;

        // if (new Date().getMonth() < 12) {
        //     sDateYear = new Date().getFullYear() - 1;
        //     sDateMonth = new Date().getMonth() + 1;
        // } else {
        //     sDateYear = new Date().getFullYear();
        //     sDateMonth = 0;
        // }

        // var sDateDay = new Date(sDateYear, sDateMonth + 1, 1).getDate();

        // var sDate = new Date(new Date(sDateYear, sDateMonth, sDateDay));
        // // var eDate = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()));
        // var eDate = new Date();

        // this.addSearchField({
        //     type: 'dateRange',
        //     field_id: 'monthYear',
        //     // text: this.getMC('mes_sro5_pln_sbar_period', '기간'),
        //     text: '검사일',
        //     sdate: sDate,
        //     edate: eDate,
        // });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'search_date',
            text: "생산일",
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 툴바 버튼 옵션 설정
        // {key: 'SEARCH', text: CMD_SEARCH/*'검색'*/},
        // {key: 'REGIST', text: CMD_REGIST/*'신규등록'*/},
        // {key: 'EDIT', 	text: CMD_MODIFY/*'수정'*/},
        // {key: 'COPY', 	text: CMD_COPY_CREATE/*'복사등록'*/},
        // {key: 'REMOVE', text: CMD_DELETE/*'삭제'*/},
        // {key: 'VIEW', 	text: CMD_VIEW},
        // {key: 'INITIAL', 	text: '비밀번호 초기화'},
        // {key: 'UTYPE', text: '권한 설정'},
        // {key: 'EXCEL', 	text: 'Excel'},
        var removeButtons = ['REGIST', 'EDIT', 'COPY', 'REMOVE'];
        // var renameButtons = [{'REGIST': '코드등록'}];
        var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar(toolbarOptions);


        // mabuffer / spccolumn 조인 해야?

        // 모델을 통한 스토어 생성
        // DeliveryPendingDetailView 에서 가져옴
        // this.createStore('Rfx2.model.company.bioprotech.DeliveryPendingDo', [{
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


        //모델을 통한 스토어 생성
        // this.createStore('Rfx.model.InspectionResult', [{
        this.createStore('Rfx2.model.company.bioprotech.DeliveryInspection', [{

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
        // 디폴트 로드 전 파라미터 전달
        this.store.getProxy().setExtraParams({
            // 'having_not_status' : 'BM,P0,DC',
            // 'not_pj_type' : 'OU',
            // 'multi_prd' : true,
            'type': 'D'
        });
        // 서브그리드 스토어

        // 서브그리드 버튼

        // subgrid 등록 버튼
        this.addResultBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-save',
            text: '저장',
            tooltip: this.getMC('msg_btn_prd_add', '출하검사결과 저장'),
            // 비활성화
            disabled: true,
            // disabled: false,
            handler: function () {
                Ext.MessageBox.show({
                    title: '샘플결과저장',
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
                            var store = gridDetail.getStore();
                            var cnt = store.getCount();
                            // console_logs('cnt', cnt);
                            for (var i = 0; i < cnt; i++) {
                                var record = store.getAt(i);
                                // console.log('저장', record.data);
                                var objv = {};


                                objv['row' + (i + 1)] = record.data;

                                objs.push(objv);
                            }
                            // 최종판정 로직 분리함.
                            // obj['result'] = { 'isPass': gu.getCmp('inspectionRS').value };
                            // objs.push(obj);

                            var jsonData = Ext.util.JSON.encode(objs);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createImportInspection',
                                params: {
                                    // 수입검사 : 'I', 최종검사 : 'F', 출하검사 : 'D'
                                    type: 'D',
                                    target_uid: target_uid,
                                    jsonData: jsonData,
                                    inspection_no: !rec.get('v027') ? '1' : rec.get('v027') // 검사 차수
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    // console_log('result:' + resultText);
                                    gm.me().store.load();
                                    // gm.me().inspectionListStore.load();
                                    inspectionResultStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                            console.log('저장!!!!!:', jsonData);

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 서브그리드 row 추가버튼
        this.addSubGridRowBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '+',
            disabled: true,
            listeners: [{
                click: function () {
                    var store = gridDetail.getStore();
                    store.insert(store.getCount(), new Ext.data.Record({}));
                }
            }]

        });

        // 서브그리드 row 삭제 버튼
        this.delSubGridRowBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            // iconCls: 'af-remove',
            text: '-',
            disabled: true,
            tooltip: this.getMC('msg_btn_prd_add', '출하검사 내역 삭제'),
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

                            var selections = gridDetail.getSelectionModel().getSelection();
                            var gridDetailStore = gridDetail.getStore();
                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                console.log(gridDetailStore.indexOf(rec));
                                gridDetailStore.removeAt(gridDetailStore.indexOf(rec));
                            }

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });
        // 로트검사판정 입력버튼
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
            tooltip: this.getMC('msg_btn_prd_add', '출하검사 내역 삭제'),
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 차수의 출하검사 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var record = gm.me().grid.getSelectionModel().getSelection()[0].data;

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroyInspection',
                                params: {
                                    target_uid: record.unique_id_long,
                                    type: !record.type ? 'D' : record.type, // 기본값 2(최종검사)
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

        var btnsNeedsSelection = [];
        btnsNeedsSelection.push(this.addResultBtn);
        btnsNeedsSelection.push(this.editLotResult);
        btnsNeedsSelection.push(this.deleteInspection);
        btnsNeedsSelection.push(this.addSubGridRowBtn);
        btnsNeedsSelection.push(this.delSubGridRowBtn);


        // 서브 그리드 위 헤더 패널
        // var panelHeader = Ext.create('Ext.panel.Panel', {
        var panelHeader = {
            // title: '상세정보',
            flex: 0.1,
            // xtype: 'fieldset',
            layout: {
                type: 'hbox',
                // padding: 10
            },
            defaults: {
                anchor: '100%',
                labelWidth: '50%',
                labelAlign: 'right',
                // margin: 10,
                padding: 10,
                fieldStyle: 'background-color: #EAEAEA;',
                // readOnly: true,
            },
            items: [

                // {
                //     fieldLabel: '출하검사결과',
                //     // value: rec.item_name,
                //     // flex: 1,
                //     id: gu.id('inspectionRS'),
                //     width: '50%',
                //     xtype: 'combo',
                //     name: 'isPass',
                //     displayField: 'isOK',
                //     valueField: 'value',
                //     fields: ['isOK', 'value'],
                //     triggerAction: 'all',
                //     emptyText: 'OK/NG',
                //     queryMode: 'local',
                //     store: {
                //         data: [
                //             { 'isOK': "OK", "value": "OK" },
                //             { 'isOK': "NG", "value": "NG" },
                //         ]
                //     },
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음.',
                //         getInnerTpl: function () {
                //             return '<div data-qtip="{isOK}">{isOK}</div>';
                //         }
                //     }
                // },
                // {
                //   xtype: 'button',
                //   text: '버튼'
                // }
            ]
        };

        // 서브그리드
        // var gridDetail = Ext.create('Ext.grid.Panel', {});
        var gridDetail = Ext.create('Ext.grid.Panel', {
            // cls: 'rfx-panel',
            id: gu.id('gridDetail'),
            store: null,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            bbar: getPageToolbar(inspectionResultStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            multiSelect: true,
            plugins: [
                {
                    ptype: 'cellediting',
                    clicksToEdit: 1,
                }
            ],
            // selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                // BaseView 기본 툴바
                // this.createCommandToolbar(toolbarOptions),
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: btnsNeedsSelection,
                    // [
                    //     this.addResultBtn,
                    //     this.editLotResult,
                    //     // {
                    //     //     text: '+',
                    //     //     listeners: [{
                    //     //         click: function () {
                    //     //             var store = gridDetail.getStore();
                    //     //             store.insert(store.getCount(), new Ext.data.Record({
                    //     //             }));
                    //     //         }
                    //     //     }]
                    //     // },
                    //     this.delSubGridRowBtn,
                    // ]
                },
                {
                    dock: 'top',
                    // xtype: 'toolbar',
                    items: [
                        panelHeader,
                    ]
                }

            ],
            columns: gridColumns,
            title: '항목별 검사 결과',
            name: 'po',
            autoScroll: true

        });


        // 기존 검사결과 조회할 스토어
        var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', {autoLoad: false});

        // 검사항목 스토어
        var spccolumnStore = Ext.create('Mplm.store.SpcColumnByItemCode', {autoLoad: false});

        // 그리드에 표시할 컬럼 목록 담을 변수 생성
        var gridColumns = [];

        // 그리드 선택시 콜백
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                // 오른쪽 그리드 버튼 활성화
                btnsNeedsSelection.forEach(el => {
                    el.enable();
                });
                // this.addResultBtn.enable();
                // this.editLotResult.enable();
                // 로트 종합 결과 오른쪽 그리드에 표시
                // var inspectionRS = selections[0].get('v028');
                // gu.getCmp('inspectionRS').setValue(inspectionRS);

                // 기존 검사 결과 조회
                var rec = selections[0].data;
                var target_uid = rec.unique_id_long;
                inspectionResultStore.getProxy().setExtraParams(
                    {
                        inspection_no: !rec.v027 ? '1' : rec.v027,
                        target_uid: target_uid,
                        type: 'D',
                    }
                );
                inspectionResultStore.load();

                // 매핑된 검사항목 조회
                spccolumnStore.item_code = rec.item_code;
                // 수입검사 : 1, 최종검사 : 2, 출하검사 : 3
                spccolumnStore.process_type = 3;
                // console.log('================', target_uid, '================', rec.item_code);
                spccolumnStore.load({
                    // 콜백 지옥...?
                    callback: function (records, operation, success) {
                        // console.log(spccolumns); //root프로퍼티에 지정된데이터
                        // 로드 성공시 메서드 호출
                        if (success) {
                            recreateGrid(records);

                            // 매핑한 컬럼, 로드한 검사결과 서브그리드에 적용
                            gridDetail.reconfigure(inspectionResultStore, gridColumns);
                        }
                    }
                });
            } else {
                btnsNeedsSelection.forEach(el => {
                    el.disable();
                });
                // this.addResultBtn.disable();
                // this.editLotResult.disable();
            }

        })


        // 기존 result 가 없을경우 name을 isPass 로 대체하기 위함
        var spccolumn_uid_result = 'isPass';

        // 검사항목 스토어 로드시 콜백 메서드
        function recreateGrid(spccolumns) {
            gridColumns = [];

            gridColumns.push({
                xtype: 'rownumberer'
            })

            // var isThereResult = false;
            // 매핑된 검사항목들 컬럼목록에 추가
            for (let index = 0; index < spccolumns.length; index++) {
                const el = spccolumns[index];
                var measuring_type = el.get('measuring_type');
                var columnName = el.get('legend_code_kr');
                var spccolumn_uid = el.get('unique_id');

                // index를 문자열로 활용하기 위해 자리수 맞추기
                // var indexSample = index + '';
                // while (indexSample.length < 2) {
                //     indexSample = '0' + indexSample;
                // }
                // indexSample =  indexSample.length == 2 ? indexSample : '0' + indexSample;

                // 수치측정인 경우
                if (measuring_type === '2') {
                    gridColumns.push({
                        text: columnName,
                        // dataIndex: 'v0' + indexSample,
                        name: spccolumn_uid,
                        width: 100,
                        align: 'center',
                        style: 'text-align:center',
                        dataIndex: spccolumn_uid,
                        editable: true
                    });
                }
                // OK/NG인 경우
                else if (measuring_type === '1' && columnName != '결과') {
                    gridColumns.push(
                        {
                            text: columnName,
                            dataIndex: spccolumn_uid,
                            width: 100,
                            align: 'center',
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
                        }
                    );
                } else if (measuring_type === '1' && columnName == '결과') {
                    spccolumn_uid_result = spccolumn_uid;
                    // isThereResult = true;
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

        };// end of callback fn

        gridDetail.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    console_logs('----------selection : ', selections[0]);
                    console_logs('----------selection : ', inspectionResultStore.indexOf(selections[0]));


                }
            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);


        //입력/상세 창 생성.
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
                    width: '55%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                },
                this.crudTab, gridDetail
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        // this.loadStoreAlways = true;

    }, // end of initcompo

    // -----검사판정입력(팝업) 버튼 핸들러
    editLotResultFunction: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0].data;

        var target_uid = rec.unique_id_long;

        // 기존 검사결과 조회
        var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', {});
        inspectionResultStore.getProxy().setExtraParams(
            {
                target_uid: target_uid,
                type: 'D',
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
        var panelHeader = {
            title: '상세정보',
            width: 300,
            height: 230,
            xtype: 'fieldset',
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
                    fieldLabel: '요청번호',
                    xtype: 'textfield',
                    value: rec.po_no,
                    // flex: 0.8
                },
                {
                    // labelWidth: 40,
                    fieldLabel: '품명',
                    xtype: 'textfield',
                    value: rec.item_name,
                    // flex: 1.2
                },
                {
                    // labelWidth: 50,
                    fieldLabel: '고객명',
                    xtype: 'textfield',
                    value: rec.wa_name,
                    // flex: 1
                },
                {
                    // labelWidth: 50,
                    fieldLabel: '검사차수',
                    xtype: 'textfield',
                    value: !rec.v027 ? '1' : rec.v027,
                    // flex: 1
                },
            ]
        };
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
                                        type: 'D',
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

    // 정렬 툴바 사용 여부
    useValueCopyCombo: false, //값복사 사용
    useDivisionCombo: false,  //사업부 콤보 시용
    selectedSortComboCount: 0, //정렬 콤보 갯수

}); // end of define
