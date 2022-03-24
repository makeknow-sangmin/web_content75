// 검사항목관리
Ext.define('Rfx2.view.company.chmr.equipState.EquipRepairView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'repair-view',
    initComponent   : function () {
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
			type: 'combo'
			, field_id: 'state'
			, emptyText: '진행상태'
			, store: "McFixStateStore"
			, displayField: 'codeName'
			, valueField: 'systemCode'
			, value: 'state'
			, innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});
        // this.addSearchField('pj_code');
        // this.addSearchField('work_type');
        this.addSearchField('name_ko');
        this.addSearchField('mchn_code');
        // this.addSearchField('item_name');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 툴바 버튼 옵션 설정
        var removeButtons = ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'VIEW'];
        // var renameButtons = [{'REGIST': '코드등록'}];
        var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar(toolbarOptions);

        this.createStore('Rfx.model.PcsMcfixReadStore', [{
			property: 'name_ko',
			direction: 'ASC'
		}],
			gMain.pageSize
			, {}
			, ['pcsmchn']
		);
        this.setRowClass(function (record, index) {
            var c = record.get('state');
            switch (c) {
                case 'C':
                    return 'red-row';
                    break;
            }
        });
        // this.defectCodeStore = Ext.create('Rfx2.store.company.bioprotech.DefectCodeStore', {parentCode: 'DEFECTIVE'});
        this.defectRegiAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    :'설비수리완료',
            tooltip : '설비수리 내역을 입력합니다.',
            disabled: false,
            handler : function () {

                

                var defaultQty = 0;

                var selections = currentTab.getSelectionModel().getSelection();

                var big_pcs_code = currentTab.multi_grid_id;

                // var pcs_codes = gu.mesTplProcessAll[big_pcs_code];
                var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];
                var processCode = 'process_';

                if (selections.length === 0) {
                    Ext.Msg.alert('', '작업을 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 건만 지정 가능합니다.');
                    return;
                }

                var selection = selections[0];

                var radioValues = [];

                for (var i = 0; i < pcs_codes.length; i++) {

                    var radioValue = {
                        boxLabel  : pcs_codes[i].name,
                        name      : 'pcs_radio',
                        inputValue: selection.get(processCode + i + '|step_uid'),
                        checked   : i == 0 ? true : false
                    };

                    radioValues.push(radioValue);
                }

                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    region       : 'left',
                    layout       : 'form',
                    autoScroll   : true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype   : 'fieldset',
                            layout  : 'column',
                            flex    : 0.5,
                            title   : '설비수리 완료에 대한 내역을 등록합니다.',
                            defaults: {
                                margin: '3 3 3 3'
                            },
                            items   : [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('fix_date'),
                                    name: 'fix_date',
                                    padding: '0 0 5px 10px',
						            style: 'width: 90%',
                                    allowBlank: true,
                                    fieldLabel: '수리완료일',
                                    format: 'Y-m-d',
                                    value: new Date()
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('fix_reason'),
                                    name: 'fix_reason',
                                    padding: '0 0 5px 10px',
						            style: 'width: 90%',
                                    allowBlank: true, 
                                    fieldLabel: '수선내역',
                                },
                                
                            ]
                        }
                    ]
                });
                // gm.me().defectCodeStore.getProxy().setExtraParam('parent_uid', selection.get('srcahd_uid'));
                // gm.me().defectCodeStore.load();
            var selection = currentTab.getSelectionModel().getSelection()[0];
            if(selection.get('state') != 'C'){

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : gm.getMC('CMD_Defect_Qty', '설비수리완료등록'),
                    width  : 450,
                    height : 250,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {

                                var selection = currentTab.getSelectionModel().getSelection()[0];

                                var fix_date = gu.getCmp('fix_date').getValue();
                                var fix_reason = gu.getCmp('fix_reason').getValue();
                                var unique_id = selection.get('unique_id');
                                var msg = '설비 수리완료 처리하시겠습니까?';

                                // if(defect_qty >  selection.get('gr_quan')) {
                                //     Ext.MessageBox.alert('알림','불량수량이 입고수량보다 초과입력되었습니다.');
                                //     return;
                                // }

                                        Ext.MessageBox.show({
                                            title  : '확인',
                                            msg    : msg,
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (result) {
                                                if (result == 'yes') {

                                                    prWin.setLoading(true);

                                                    Ext.Ajax.request({
                                                        url   : CONTEXT_PATH + '/production/mcfix.do?method=StateUpPcsMcfix',
                                                        params: {
                                                            'fix_date'            : fix_date,
                                                            'fix_reason'          : fix_reason,
                                                            'unique_id'           : unique_id,
                                                            'state'               : 'C',
                                                        },

                                                        success: function (result, request) {
                                                            prWin.setLoading(false);
                                                            gm.me().store.load();
                                                            Ext.Msg.alert('안내', '등록되었습니다.', function () {
                                                            });
                                                            // currentTab.getStore().load();
                                                            prWin.close();
                                                        },//endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });//endofajax

                                                }
                                            },
                                            icon   : Ext.MessageBox.QUESTION
                                        });
                                    }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });
            }else {
                Ext.Msg.alert('', '수리 등록이 완료되어있는 상태입니다.');
            }

                prWin.show();
            }
        });
        buttonToolbar.insert(1, this.defectRegiAction);


        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        const currentTab = this.grid;
        //입력/상세 창 생성.
        // this.createCrudTab();

        // main grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var record = selections[0];

                console.log(record.get('lot_no'));
                console.log(record.get('work_type'));
                console.log(record.get('pcs_code'));
                console.log(record.get('end_date'));
                // 서브그리드 스토어에 파라미터 전달 & 로드
                this.pcsDetailStore.getProxy().setExtraParams({
                    unique_id   : record.get('unique_id'),
                    defect_detail : '%DEFECTIVE%',
                    defective_only: "Y"
                });
                this.pcsDetailStore.load();
            } else {
                this.pcsDetailStore.clear();
            }
        });

        // let modifyDefectAction = Ext.create('Ext.Action', {
        //     iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
        //     text    : '수리내역수정',
        //     tooltip : '해당 작업의 불량수량을 수정합니다',
        //     disabled: true,
        //     handler : function () {
        //         var rec = gm.me().subGrid.getSelectionModel().getSelection()[0];

        //         var pcs_name = rec.get('pcs_name');
        //         var work_type = rec.get('work_type');
        //         var work_qty = rec.get('work_qty');
        //         var pcswork_uid = rec.get('unique_id_long');
        //         var change_date = rec.get('change_date');
        //         var start_date = rec.get('start_date');

        //         var defect_detail = rec.get('defect_detail');
        //         var defect_total_qty = rec.get('defect_total_qty');


        //         var selections = currentTab.getSelectionModel().getSelection();
        //         var big_pcs_code = currentTab.multi_grid_id;
        //         var pcs_codes = gu.mesTplProcessAll[gu.mesTplProcessBig[0].code];

        //         var processCode = 'process_';

        //         var selection = selections[0];

        //         var radioValues = [];

        //         for (var i = 0; i < pcs_codes.length; i++) {

        //             var radioValue = {
        //                 boxLabel  : pcs_codes[i].name,
        //                 name      : 'pcs_radio',
        //                 readOnly  : true,
        //                 inputValue: selection.get(/*pcs_codes[i].code*/ processCode + i + '|step_uid'),
        //                 checked   : pcs_codes[i].name == pcs_name ? true : false
        //             };

        //             radioValues.push(radioValue);
        //         }

        //         var form = Ext.create('Ext.form.Panel', {
        //             xtype        : 'form',
        //             frame        : false,
        //             border       : false,
        //             bodyPadding  : 10,
        //             region       : 'center',
        //             layout       : 'form',
        //             fieldDefaults: {
        //                 labelAlign: 'right',
        //                 msgTarget : 'side'
        //             },
        //             items        : [
        //                 {
        //                     xtype   : 'fieldset',
        //                     layout  : 'column',
        //                     title   : '불량수량을 정확히 입력하시기 바랍니다.',
        //                     defaults: {
        //                         margin: '3 3 3 3'
        //                     },
        //                     items   : [
        //                         {
        //                             xtype     : 'radiogroup',
        //                             id        : gu.id('pcsCodeGroup'),
        //                             fieldLabel: '공정',
        //                             items     : radioValues,
        //                             defaults  : {
        //                                 margin: '0 30 0 0'
        //                             },
        //                             listeners : {
        //                                 change: function (field, newValue, oldValue) {

        //                                 }
        //                             }
        //                         },
        //                         {
        //                             fieldLabel  : '불량유형',
        //                             xtype       : 'combo',
        //                             anchor      : '100%',
        //                             id          : gu.id('defect_detail'),
        //                             name        : 'defect_detail',
        //                             displayField: 'code_name_kr',
        //                             valueField  : 'system_code',
        //                             store       : gm.me().defectCodeStore,
        //                             value       : defect_detail,
        //                             width       : '96%',
        //                             listConfig  : {
        //                                 getInnerTpl: function () {
        //                                     return '<div data-qtip="{system_code}"><small>[{system_code}] {code_name_kr}</small></div>';
        //                                 }
        //                             }
        //                         },
        //                         {
        //                             xtype       : 'datefield',
        //                             id          : gu.id('ref_date'),
        //                             width       : '96%',
        //                             readOnly    : false,
        //                             name        : 'ref_date',
        //                             value       : Ext.Date.add(new Date(), 'Y-m-d'),
        //                             submitFormat: 'Y-m-d',
        //                             dateFormat  : 'Y-m-d',
        //                             format      : 'Y-m-d',
        //                             fieldStyle  : 'background-color: #EAEAEA; background-image: none;',
        //                             fieldLabel  : '기준일자'
        //                         },
        //                         {
        //                             xtype     : 'numberfield',
        //                             id        : gu.id('defect_total_qty'),
        //                             width     : '96%',
        //                             name      : 'defect_total_qty',
        //                             value     : defect_total_qty,
        //                             fieldLabel: '불량수량'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         });

        //         var prWin = Ext.create('Ext.Window', {
        //             modal  : true,
        //             title  :'수리내역수정',
        //             width  : 450,
        //             height : 300,
        //             items  : form,
        //             buttons: [
        //                 {
        //                     text   : CMD_OK,
        //                     scope  : this,
        //                     handler: function () {

        //                         var selection = currentTab.getSelectionModel().getSelection()[0];

        //                         var defect_total_qty = gu.getCmp('defect_total_qty').getValue();
        //                         var ref_date = gu.getCmp('ref_date').getValue();
        //                         var defect_detail = gu.getCmp('defect_detail').getValue();
        //                         var msg = '불량 수량을 수정하시겠습니까?';

        //                         Ext.MessageBox.show({
        //                             title  : '확인',
        //                             msg    : msg,
        //                             buttons: Ext.MessageBox.YESNO,
        //                             fn     : function (result) {
        //                                 if (result == 'yes') {

        //                                     Ext.Ajax.request({
        //                                         url   : CONTEXT_PATH + '/index/process.do?method=updateDefect',
        //                                         params: {
        //                                             'defect_total_qty': defect_total_qty,
        //                                             'defect_detail'   : defect_detail,
        //                                             'ref_date'        : ref_date,
        //                                             'pcswork_uid'     : pcswork_uid
        //                                         },

        //                                         success: function (result, request) {
        //                                             gm.me().store.load();
        //                                             gm.me().subGrid.getStore().load();
        //                                             Ext.Msg.alert('안내', '수정 처리 되었습니다', function () {
        //                                             });
        //                                             // currentTab.getStore().load();
        //                                             prWin.close();
        //                                         },//endofsuccess
        //                                         failure: extjsUtil.failureMessage
        //                                     });//endofajax

        //                                     // gm.me().pcsworkDefectStore.load();
        //                                 }
        //                             },
        //                             icon   : Ext.MessageBox.QUESTION
        //                         });
        //                     }
        //                 },
        //                 {
        //                     text   : CMD_CANCEL,
        //                     scope  : this,
        //                     handler: function () {
        //                         if (prWin) {
        //                             prWin.close();
        //                         }
        //                     }
        //                 }
        //             ]
        //         });

        //         prWin.show();
        //     }
        // });

        // let removeDefectAction = Ext.create('Ext.Action', {
        //     iconCls : 'af-remove',
        //     text    : '수리내역삭제',
        //     tooltip : '해당 작업의 불량수량을 삭제합니다',
        //     disabled: true,
        //     handler : function () {
        //         var rec = gm.me().subGrid.getSelectionModel().getSelection()[0];
        //         console_logs('rec >>>>', rec);
        //         var pcswork_uid = rec.get('unique_id_long');
        //         var pcsstep_uid = rec.get('pcsstep_uid');
        //         var selections = currentTab.getSelectionModel().getSelection()[0];
        //         console_logs('selections', selections);
        //         var state = selections.get('state');
        //         // if(state === 'Y') {
        //         //     Ext.MessageBox.alert('알림', '생산완료된 실적은 삭제가 불가합니다.')
        //         //     return;
        //         // } else {
        //         Ext.MessageBox.show({
        //             title  : '확인',
        //             msg    : '불량수량을 삭제하시겠습니까?',
        //             buttons: Ext.MessageBox.YESNO,
        //             fn     : function (result) {
        //                 if (result == 'yes') {
        //                     Ext.Ajax.request({
        //                         url    : CONTEXT_PATH + '/index/process.do?method=removeDefectQty',
        //                         params : {
        //                             pcswork_uid: pcswork_uid,
        //                             pcsstep_uid: pcsstep_uid
        //                         },
        //                         success: function (result, request) {
        //                             gm.me().store.load();
        //                             gm.me().subGrid.getStore().load();
        //                             Ext.Msg.alert('안내', '삭제 되었습니다.', function () {
        //                             });
        //                             // currentTab.getStore().load();
        //                             // gm.me().removeProductionAction.enable();
        //                         },
        //                         failure: extjsUtil.failureMessage
        //                     });
        //                 }
        //             },
        //             icon   : Ext.MessageBox.QUESTION
        //         });
        //         // }

        //         // prWin.show();
        //     }
        // });

        // 서브그리드 패널에 적용할 스토어 생성
        this.pcsDetailStore = Ext.create('Rfx2.store.company.chmr.PcsMcfixReadStore', {});

        Ext.apply(this, {
            layout: 'border',
            items : [
                {
                    collapsible: false,
                    frame      : false,
                    region     : 'west',
                    layout     : {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    margin     : '5 0 0 0',
                    width      : '100%',
                    items      : [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width : '100%',
                        items : [this.grid]
                    }]
                },
                // this.crudTab, 
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        // this.loadStoreAlways = true;

    },
    items           : [],
    getThirtyMinites: function (time) {

        var hour = time.getHours();
        var minute = time.getMinutes();

        if (minute >= 30) {
            return hour + ':30';
        } else {
            return hour + ':00';
        }
    },
    setRefDate      : function () {
        var work_type = gu.getCmp('work_type').getValue().work_type;

        if (work_type == 'night') {
            var process_time = gu.getCmp('process_time').getValue();
            var hour = process_time.getHours();
            var process_date = new Date(gu.getCmp('process_date').getValue());

            if (hour < 12) {
                process_date.setDate(process_date.getDate() - 1);
            }

            gu.getCmp('ref_date').setValue(process_date);
        } else {
            var process_date = new Date(gu.getCmp('process_date').getValue());
            gu.getCmp('ref_date').setValue(process_date);
        }
    },

    useValueCopyCombo     : false, //값복사 사용
    useDivisionCombo      : false,  //사업부 콤보 시용
    selectedSortComboCount: 0, //정렬 콤보 갯수
});