// SPC 관리선 설정
Ext.define('Rfx2.view.company.sejun.qualityMgmt.SpcChartMgmtLineView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-chart-mgmtline-view',
    initComponent: function () {

        // Ext.each(this.columns, function(columnObj, index) {
        //     columnObj["editor"] = {clicksToEdit:2};
        // });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.SpcChartMgmtLine', [{
            property: 'create_date',
            direction: 'ASC'
        }],
            /*pageSize*/
            gm.pageSize
            , {
                process_type_kr: 'spcchart.process_type',
                measuring_type_kr: 'measuring_type',
                item_type_kr: 'item_type'
            }
            , ['spcchart']
        );

        // this.testViewBtn = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     iconCls: 'af-plus',
        //     text: '테스트',
        //     disabled: false,
        //     handler: function () {
        //         gm.me().testView();
        //     }
        // })

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField (
        // {
        //     field_id: 'item_type'
        //     ,store: 'ClaastStorePD'
        //     ,displayField: 'class_code'
        //     ,valueField: 'class_code'
        //     ,innerTpl	: '<div data-qtip="{class_code}">{class_name}</div>'
        // });

        // 검사종류 검색
        this.addSearchField(
            {
                field_id: 'process_type_kr2'
                , store: 'SpcChartProcessStore2'
                , displayField: 'name'
                , valueField: 'code'
                , innerTpl: '<div data-qtip="{name}">{name}</div>'
            });
        this.addSearchField('item_type');
        this.addSearchField('item_name');

        // var searchItemTypeId = this.link + '-' + gMain.getSearchField('item_type');
        // var searchItemTypeCombo = Ext.getCmp(gMain.getSearchField('item_type'));
        // var searchItemTypeCombo = this.getSearchWidget(searchItemTypeId);
        // searchItemTypeCombo = document.getElementById(searchItemTypeId);
        // var searchItemTypeStore = searchItemTypeCombo.getValue();

        // console.log('ggggggg',searchItemTypeId);
        // console.log('ggggggg',searchItemTypeCombo);
        // console.log('ggggggg',searchItemTypeStore);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addSpcChartButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function () {
                gm.me().addSpcMgmtLineView();
            }
        });

        this.modifySpcChartButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function () {
                gm.me().modifySpcMgmtLineView();
            }
        });

        this.showSpcInspectionWindowButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '관리도보기',
            tooltip: '관리도보기',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function () {
                gm.me().showSpcInspectionWindow();
            }
        });

        buttonToolbar.insert(1, this.modifySpcChartButton);
        buttonToolbar.insert(1, this.addSpcChartButton);
        buttonToolbar.insert(3, this.showSpcInspectionWindowButton);

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
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

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.modifySpcChartButton.enable();
                this.showSpcInspectionWindowButton.enable();
            } else {
                this.modifySpcChartButton.disable();
                this.showSpcInspectionWindowButton.disable();
            }
        });

        // this.claastStore = Ext.create('Mplm.store.ClaastStorePD', {});
    },

    addSpcMgmtLineView: function () {

        // var combstStore = Ext.create('Mplm.store.CombstStore', {});
        // var spcChartProcessStore = Ext.create('Mplm.store.SpcChartProcessStore', {});
        var spcChartProcessStore2 = Ext.create('Mplm.store.SpcChartProcessStore2', {});
        var spcColumnNameStore = Ext.create('Mplm.store.SpcColumnNameStore', {});
        // 수치측정 검사항목만 조회하도록 measuring_type 설정
        spcColumnNameStore.getProxy().setExtraParam('measuring_type', 2);
        var itemListBySgCodeStore = Ext.create('Rfx2.store.company.bioprotech.ItemListBySgCodeStore', {})
        // var claastStore = Ext.create('Mplm.store.ClaastStorePD', {});
        var claastStoreMT = Ext.create('Mplm.store.ClaastStoreMTPD', {});

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
            xtype: 'form',
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
                labelWidth: 80,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '검사종류',
                    xtype: 'combo',
                    id: gu.id('process_type_kr'),
                    name: 'process_type',
                    store: spcChartProcessStore2,
                    displayField: 'name',
                    valueField: 'code',
                    hideLabel: false,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{code}">{name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            // spcColumnNameStore.getProxy().setExtraParam('process_type', record.get('code'));
                            // spcColumnNameStore.load();
                            gu.getCmp('spccolumn_uid').clearValue();
                            gu.getCmp('item_type').clearValue();
                            gu.getCmp('srcahd_uid').clearValue();
                            Ext.getCmp('item_name').setValue(null);
                            // gu.getCmp('item_name').clearValue();

                            var inspection = record.get('name');
                            spcColumnNameStore.getProxy().setExtraParam('process_type', record.get('code'));

                            if (inspection == '수입검사') {
                                // console.log("수입검사");
                                claastStoreMT.identification_code_1 = 'MT';
                                claastStoreMT.level1_1 = 2;
                                claastStoreMT.identification_code_2 = 'PRD_CLS_CODE';
                                claastStoreMT.level1_2 = 3;
                                claastStoreMT.load();
                            } else if (inspection == '최종검사') {
                                // console.log("최종검사");
                                claastStoreMT.identification_code_1 = 'PRD_CLS_CODE';
                                claastStoreMT.level1_1 = 3;
                                claastStoreMT.identification_code_2 = null;
                                claastStoreMT.level1_2 = null;
                                claastStoreMT.load();
                            }
                        }
                    }
                },
                {
                    fieldLabel: '품목군',
                    xtype: 'combo',
                    id: gu.id('item_type'),
                    name: 'item_type',
                    store: claastStoreMT,
                    displayField: 'class_name',
                    valueField: 'class_code',
                    hideLabel: false,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            var class_code = record.get('class_code');
                            spcColumnNameStore.getProxy().setExtraParam('item_type', class_code);
                            spcColumnNameStore.load();
                            // gu.getCmp('process_type_kr').clearValue();
                            gu.getCmp('spccolumn_uid').clearValue();
                            itemListBySgCodeStore.sg_code = class_code;
                            itemListBySgCodeStore.load();
                            // gu.getCmp('process_type_kr').clearValue();
                            gu.getCmp('srcahd_uid').clearValue();
                            Ext.getCmp('item_name').setValue(null);
                        },
                    }
                },
                {
                    fieldLabel: '품목',
                    xtype: 'combo',
                    id: gu.id('srcahd_uid'),
                    name: 'srcahd_uid',
                    store: itemListBySgCodeStore,
                    displayField: 'item_name',
                    valueField: 'unique_id_long',
                    hideLabel: false,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{item_code}">{item_code} | {item_name} | {specification}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            // console.log(';;;;;;;;;;;;;;;;;;;;;;;;', record);
                            Ext.getCmp('item_name').setValue(record.get('item_name'));
                        }
                    }
                },
                {
                    fieldLabel: '항목',
                    xtype: 'combo',
                    id: gu.id('spccolumn_uid'),
                    name: 'spccolumn_uid',
                    store: spcColumnNameStore,
                    displayField: 'legend_code_kr',
                    valueField: 'unique_id_long',
                    hideLabel: false,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{unique_id_long}">{legend_code_kr}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {

                        }
                    }
                },
                {
                    fieldLabel: '품목명',
                    xtype: 'hiddenfield',
                    id: 'item_name',
                    name: 'item_name',
                    readonly: true
                },
                {
                    fieldLabel: 'Spec',
                    xtype: 'textfield',
                    name: 'spec',
                },
                {
                    fieldLabel: 'R-CL',
                    xtype: 'textfield',
                    name: 'r_cl',
                },
                {
                    fieldLabel: 'LSL',
                    xtype: 'textfield',
                    name: 'lsl'
                },
                {
                    fieldLabel: 'USL',
                    xtype: 'textfield',
                    name: 'usl'
                },
                {
                    fieldLabel: '관리상한선',
                    xtype: 'textfield',
                    name: 'ucl'
                },
                {
                    fieldLabel: '관리하한선',
                    xtype: 'textfield',
                    name: 'lcl'
                },

            ]
        });

        //spcChartProductTypeStore.load();

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: 500,
            height: 370,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val', val);

                            form.submit({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createSpcChartMgmt',
                                params: {
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
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    modifySpcMgmtLineView: function () {

        var spcChartProcessStore2 = Ext.create('Mplm.store.SpcChartProcessStore2', {});
        var spcColumnNameStore = Ext.create('Mplm.store.SpcColumnNameStore', {});
        var itemListBySgCodeStore = Ext.create('Rfx2.store.company.bioprotech.ItemListBySgCodeStore', {})

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel2'),
            xtype: 'form',
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
                labelWidth: 80,
                margins: 10,
            },
            items: [
                {
                    fieldLabel: '검사종류',
                    xtype: 'textfield',
                    value: rec.get('process_type_kr2'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    xtype: 'hiddenfield',
                    name: 'process_type',

                    value: rec.get('process_type')
                },
                {
                    fieldLabel: '품목군',
                    xtype: 'textfield',
                    value: rec.get('item_type'),
                    name: 'item_type',
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '품목명',
                    xtype: 'textfield',
                    name: 'item_name',
                    value: rec.get('item_name'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    fieldLabel: '항목',
                    xtype: 'textfield',
                    value: rec.get('legend_code_kr'),
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    readOnly: true
                },
                {
                    xtype: 'hiddenfield',
                    name: 'legend_code',
                    value: rec.get('legend_code')
                },
                {
                    xtype: 'hiddenfield',
                    name: 'srcahd_uid',
                    value: rec.get('srcahd_uid')
                },
                {
                    fieldLabel: 'Spec',
                    xtype: 'textfield',
                    name: 'spec',
                    value: Ext.util.Format.number(rec.get('spec'), '0.##')
                },
                {
                    fieldLabel: 'R-CL',
                    xtype: 'textfield',
                    name: 'r_cl',
                    value: Ext.util.Format.number(rec.get('r_cl'), '0.##')

                },
                {
                    fieldLabel: 'LSL',
                    xtype: 'textfield',
                    name: 'lsl',
                    value: Ext.util.Format.number(rec.get('lsl'), '0.##')
                },
                {
                    fieldLabel: 'USL',
                    xtype: 'textfield',
                    name: 'usl',
                    value: Ext.util.Format.number(rec.get('usl'), '0.##')
                },
                {
                    fieldLabel: '관리상한선',
                    xtype: 'textfield',
                    name: 'ucl',
                    value: Ext.util.Format.number(rec.get('ucl'), '0.##')
                },
                {
                    fieldLabel: '관리하한선',
                    xtype: 'textfield',
                    name: 'lcl',
                    value: Ext.util.Format.number(rec.get('lcl'), '0.##')
                },

                {
                    xtype: 'hiddenfield',
                    name: 'spccolumn_uid',
                    value: rec.get('spccolumn_uid')
                },
                {
                    xtype: 'hiddenfield',
                    name: 'unique_id_long',
                    value: rec.get('unique_id_long')
                },
            ]
        });

        //spcChartProductTypeStore.load();

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 350,
            height: 370,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            console_logs('===val', val);

                            form.submit({
                                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=updateSpcChartMgmt',
                                params: {
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
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });

        prWin.show();
    },

    showSpcInspectionWindow: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0],
            unique_id = rec.data.unique_id_long,
            process_type = rec.data.process_type,
            spcInspectionDataStore = Ext.create('Rfx2.store.company.bioprotech.SPCInspectionDataStore', {}),
            popUpGridColumns = [],
            popUpGridColumns2 = [];
            averages = [], 
            ranges = [],
            dates = [];

        spcInspectionDataStore.getProxy().setExtraParams({
            unique_id: unique_id,
            process_type: process_type
        });
        spcInspectionDataStore.load({
            callback: function (record, index) {
                if(record.length == 0){
                    Ext.MessageBox.alert('알림', '해당하는 검사결과 데이터를 조회할 수 없습니다.');
                    return;
                }
                // console.log(record);
                // // console.log(Object.keys(record[0].data));
                // const recLength = record.length;
                // var keys = Object.keys(record[0].data);
                // keys.splice(keys.indexOf('id'), 1);
                // console.log(keys);

                // popUpGridColumns.push(
                //     {
                //         // xtype: 'rownumberer',
                //         renderer: function(){
                //             if (spcInspectionDataStore.indexOf(this) <= recLength-3) {
                //                 return value;
                //             } else if (spcInspectionDataStore.indexOf(this) == recLength-2) {
                //                 return '평균(X)'
                //             } else if (spcInspectionDataStore.indexOf(this) == recLength-1) {
                //                 return '범위(R)'
                //             }
                //         },
                //         summaryType: 'sum',
                //         summaryRenderer: '평균'
                //     }
                // )

                // popUpGridColumns.push(
                //     {
                //         text: 'numberer',
                //         dataIndex: 'numberer'
                //     }
                // )

                // keys.forEach(function(inspection_date, index, array){
                //     var date = new Date();
                //     date.setTime(inspection_date);
                //     console.log(date);
                //     var formattedDate = Ext.Date.format(date, 'Y-m-d');

                //     popUpGridColumns.push(
                //         {
                //             xtype: 'numbercolumn',
                //             format: '0.00',
                //             text: formattedDate,
                //             name: inspection_date,
                //             width: 100,
                //             align: 'center',
                //             style: 'text-align:center',
                //             dataIndex: inspection_date,
                //             // summaryType: 'sum',
                //             summaryType: 'average',
                //             // summaryRenderer: function(value, summaryData, dataIndex) {
                //             //     return Ext.util.Format.numberRenderer('0.00');
                //             // }
                //             summaryRenderer: Ext.util.Format.numberRenderer('0.00'),
                //         }
                //     )
                // });

                // popUpGridColumns2.push(
                //     {
                //         xtype: 'datecolumn',
                //         format: 'Y-m-d',
                //         text: '검사날짜',
                //         width: 100,
                //         align: 'center',
                //         style: 'text-align:center',
                //         dataIndex: 'inspection_date'
                //     }
                // );
                popUpGridColumns2.push(
                    {
                        xtype: 'datecolumn',
                        format: 'Y-m-d',
                        text: '검사날짜',
                        width: 100,
                        align: 'center',
                        style: 'text-align:center',
                        dataIndex: 'inspection_date'
                    }
                );
                // sample count 만큼 컬럼 표시
                for (let index = 0; index < record[0].data.v029; index++) {
                    // index를 문자열로 활용하기 위해 자리수 맞추기
                    var indexSample = index + '';
                    while (indexSample.length < 2) {
                        indexSample = '0' + indexSample;
                    }
                    // indexSample =  indexSample.length == 2 ? indexSample : '0' + indexSample;

                    popUpGridColumns2.push(
                        {
                            text: '샘플' + (indexSample * 1 + 1),
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 100,
                            align: 'center',
                            style: 'text-align:center',
                            dataIndex: 'v0' + indexSample
                        }
                    );
                }
                popUpGridColumns2.push(
                    {
                        text: '평균(X)',
                        xtype: 'numbercolumn',
                        format: '0.00',
                        width: 100,
                        align: 'center',
                        style: 'text-align:center; font-weight:bold',
                        name: 'average',
                        dataIndex: 'average'
                    }
                );
                popUpGridColumns2.push(
                    {
                        text: '범위(R)',
                        xtype: 'numbercolumn',
                        format: '0.00',
                        width: 100,
                        align: 'center',
                        style: 'text-align:center; font-weight:bold',
                        name: 'range',
                        dataIndex: 'range'
                    }
                );
                record.forEach(el => {
                    // dates.push(Ext.Date.format(el.get('inspection_date')), 'Ymd');
                    dates.push(el.get('inspection_date').split(' ')[0]);
                    averages.push(Ext.util.Format.number(el.get('average'), '0.00'));
                    ranges.push(Ext.util.Format.number(el.get('range'), '0.00'));
                });

                createWin();
            }
        });



        var createWin = function () {
            var popUpGrid = Ext.create('Ext.grid.Panel', {
                store: spcInspectionDataStore,
                title: 'Inspection Results',
                columns: popUpGridColumns,
                features: [{
                    ftype: 'summary'
                }],
               
            });

            var summaryGrid = Ext.create('Ext.grid.Panel', {
                store: spcInspectionDataStore,
                title: 'Inspection Results',
                columns: popUpGridColumns2,
                width: 1080,
                height: 270,
                // flex: 1,
                region: 'north'
            });

            var options = gm.me().setChartOptions(gm.me().grid.getSelectionModel().getSelection(), dates, averages, ranges);

            var chartPanel1 = Ext.create('Ext.panel.Panel', {
                width: 1080,
                height: 270,
                // flex: 1,
                region: 'south',
                listeners: {
                    afterRender: function() {
                        // console.log('gggggggggggg',options[0]);
                        gm.me().drawChart(chartPanel1.getItemId(), options[0]);
                    }
                }
                
            })

            var chartPanel2 = Ext.create('Ext.panel.Panel', {
                width: 1080,
                height: 270,
                // flex: 1,
                region: 'south',
                listeners: {
                    afterRender: function() {
                        gm.me().drawChart(chartPanel2.getItemId(), options[1]);
                    }
                }
                
            })
            

            var win = Ext.create('Ext.window.Window', {
                modal: true,
                title: '관리도 보기',
                plain: true,
                width: 1100,
                height: 600,
                layout: 'vbox',
                scrollable : true,
                items: [
                    // popUpGrid, 
                    summaryGrid,
                    chartPanel1,
                    chartPanel2
                ],
                buttons: [
                    {
                        text: '닫기',
                        handler: function () {
                            // Ext.MessageBox.show({
                            //     title: '닫기',
                            //     msg: '저장하지 않은 검사 내역이 삭제됩니다. 계속하시겠습니까?',
                            //     buttons: Ext.MessageBox.YESNO,
                            //     fn: function(btn) {
                            //         if(btn=='yes') {
                            //             if (prWin) {
                            //                 prWin.close();
                            //             }
                            //         }
                            //     },
                            //     icon: Ext.MessageBox.QUESTION
                            // });
                            win.close();
                        }
                    }
                ],
            })
            win.show();
        };
    },
    // 그리드에서 선택한 제품-항목 기준으로 차트에 표시할 데이터 저장
    setChartOptions: function (selections, dates, averages, ranges) {
        // console.log('hhhhhhhh',ranges);
        // 선택한 자재, 품목 + 검사항목에 대한 데이터 불러오기

        // 수입검사 data INSERT 때 spccolumn_uid -> J8_MABUFFER.target_uid 에 넣어야..?

        //  > 1. SPC 관리선 정보 가져오기 (From spcchart By spccolumn_uid)
        var rec = selections[0];
        var spccolumn_uid = rec.get('target_uid');
        // SpcChartLineStore.proxy.extraparams = {spccolumn_uid: spccolumn_uid};
        // SpcChartLineStore.load();

        var title1 = rec.get('item_name');
        title1 += ' | ';
        title1 += rec.get('legend_code_kr');

        var title2 = title1 + ' | R - Bar';

        title1 += ' | X - Bar';

        var usl = rec.get('usl') * 1;
        var lsl = rec.get('lsl') * 1;
        var air = ((usl - lsl) * 0.1).toFixed(2) * 1;
        var max1 = (usl + air).toFixed(2);
        var min1 = (lsl - air).toFixed(2);


        var yDatas1 = averages,
            xAxis = dates,
            spec = rec.get('spec');
        // /xdview/spcMgmt.do?method=readMabufferForSpc
        // Ext.Ajax.request({
        //   url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readMabufferForSpc',
        //   params: [],
        //   success: function(result, request) {
        //     result.array.forEach(el => {
        //       consol.log(el.get('v000'));
        //     });
        //   },
        //   failure: extjsUtil.failureMesssage
        // });
        //  > 2. 해당 자재.품목 + 검사항목 측정값 가져오기
        // var dataParams = {
        //   target_uid: spccolumn_uid,
        //   // minDate: minDate,
        //   // maxDate: maxDate
        // };
        // SpcChartDataStore.proxy.extraparams = dataParams;
        // SpcChartDataStore.load();
        var yDatas2 = ranges,
            max2 = yDatas2[0], min2 = max2;
        yDatas2.forEach(el => {
            if(el > max2) {
                max2 = el;
            } else if (el < min2) {
                min2 = el;
            }
        });
        air = ((max2 - min2) * 0.1).toFixed(2) * 1;
        max2 = (max2*1 + air).toFixed(2);
        min2 = (min2*1 - air).toFixed(2);


        var optionChart1 = {
            title: {
                text: title1,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            // color: ['#610B4D'],
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value',
                scale: true,
                max: max1,
                min: min1,
            },
            series: [{
                data: yDatas1,
                type: 'line',
                label: {
                    show: true,
                    position: 'inside'
                },
                markLine: {
                    data: [
                        {
                            yAxis: lsl, name: 'LSL'

                        },
                        {
                            yAxis: spec, name: 'SPEC',
                        },
                        {
                            yAxis: usl, name: 'USL'
                        }
                    ],
                    // color: ['#0B0B61']
                }
            }],
        };

        var optionChart2 = {
            title: {
                text: title2,
            },
            color: ['#119c52'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value',
                scale: true,
                max: max2,
                min: min2
            },
            series: [{
                data: yDatas2,
                type: 'line',
                label: {
                    show: true,
                    position: 'inside'
                },
                // markLine: {
                //     data: [
                //         {
                //             yAxis: 0,
                //         },
                //         {
                //             yAxis: 0.05
                //         }
                //     ],
                //     // color: ['#0B0B61']
                // }
            }],
        };
        return [optionChart1, optionChart2];
    },

    drawChart: function (divId, option) {
        console.log(`============== drawChart Func ==============`,divId);

        // divId = '';
        var me = this;
        var main = document.getElementById(divId);

        if (main == null) {
            Ext.Msg.alert('load failded', divId + ' div를 찾을 수 없습니다.');
            return;
        } else {
            console.log('main', main);
        }

        var myChart = echarts.init(main);
        console.log('myChart', myChart);

        myChart.showLoading({
            text: '잠시만 기다려주세요.....',
        });

        var option = option;

        myChart.hideLoading();
        myChart.setOption(option);

        return myChart;
    },


    // 정렬 툴바 사용 여부
    useValueCopyCombo: false, //값복사 사용
    useDivisionCombo: false,  //사업부 콤보 시용
    selectedSortComboCount: 0, //정렬 콤보 갯수
});