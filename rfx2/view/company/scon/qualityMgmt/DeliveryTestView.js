Ext.define('Rfx2.view.company.scon.qualityMgmt.DeliveryTestView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'import-inspection-view',
    //items: [{html: 'Rfx.view.criterionInfo.CodeView'}],
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.setDefComboValue('parent_system_code', 'valueField', '1');//ComboBOX의 ValueField 기준으로 디폴트 설정.
        this.setDefComboValue('use_yn', 'valueField', 'Y');
        this.setDefComboValue('discriptionSortable', 'displayField', 'true');

        // this.addSearchField({
        //     field_id: 'parent_system_code',
        //     displayField: 'display_name_ko',
        //     valueField: 'child',
        //     store: 'MenuCodeStore',
        //     params: {
        //         sortCond : 'display_name_ko asc'
        //     },
        //     width: 150,
        //     innerTpl: '<div>{display_name_ko}</div>',
        //
        // });

        // });
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //20.11.18 KNH 기존 j2code 버튼 삭제 custom수정버튼 생성
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index== 1 || index==2 || index== 3 || index==4 || index == 5) {
            	buttonToolbar.items.remove(item);
      	  }
        });

        // this.modifyMenuUserButton = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     iconCls: 'af-edit',
        //     text: gm.getMC('CMD_MODIFY', '수정'),
        //     tooltip: '수정하기',
        //     disabled: true,
        //     handler: function() {
        //
        //         gm.me().modifyMenuUserView();
        //     }
        // });

        // buttonToolbar.insert(2, this.modifyMenuUserButton);


        //모델 정의
        this.createStore('Rfx.model.Code', [{
                property: 'parent_system_code',
                direction: 'ASC'
            }],
            gMain.pageSize
            , {}
            , ['code']
        );

        //그리드 생성
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

        //수정버튼 콜백
        this.setGridOnCallback(function(selections) {
            console_logs('>>>>callback', selections);
            if(selections != null && selections.length > 0) {
                this.modifyMenuUserButton.enable();
            } else {
                this.modifyMenuUserButton.disable();
            }
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        // this.store.load(function(records){});

    },
    items: [],

    //수정폼
    modifyMenuUserView: function() {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>rrr', rec);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanelModify'),
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
                msgTarget: 'side'
            },

            items: [
                {
                    xtype: 'fieldset',
                    id: gu.id('modification'),
                    title: '수정 정보입력',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'unique_id',
                            id: 'unique_id',
                            value: rec.get('unique_id_long')
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_code',
                            id: 'dept_code',
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_name',
                            id: 'dept_name',
                        }),
                        {
                            fieldLabel: '메뉴 그룹',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            id:'parent_system_code',
                            name:'parent_system_code',
                            value:rec.get('parent_system_code')
                        },{
                            fieldLabel: '메뉴 코드',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            allowBlank: false,
                            id:'system_code',
                            name:'system_code',
                            value:rec.get('system_code')
                        },{
                            fieldLabel: '컬럼명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_name_kr',
                            name:'code_name_kr',
                            value:rec.get('code_name_kr')
                        },{
                            fieldLabel: '영문명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_name_en',
                            name:'code_name_en',
                            value:rec.get('code_name_en')
                        },{
                            fieldLabel: '중국어명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_name_zh',
                            name:'code_name_zh',
                            value:rec.get('code_name_zh')
                        },{
                            fieldLabel: '표시여부',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'use_yn',
                            name:'use_yn',
                            value:rec.get('use_yn')
                        },{
                            fieldLabel: '순서',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'code_order',
                            name:'code_order',
                            value:rec.get('code_order')
                        },{
                            fieldLabel: '필드폭',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'descriptionWidth',
                            name:'descriptionWidth',
                            value:rec.get('descriptionWidth')
                        },{
                            fieldLabel: '데이터유형',
                            xtype: 'textfield',
                            anchor: '100%',
                            readOnly:true,
                            allowBlank: true,
                            id:'role_code',
                            name:'role_code',
                            value:rec.get('role_code')
                        },{
                            fieldLabel: '정렬기준',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            id:'descriptionSortable',
                            name:'descriptionSortable',
                            value:rec.get('descriptionSortable')
                        },{
                            fieldLabel: '수정일자',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            readOnly:true,
                            id:'create_date',
                            name:'create_date',
                            value:rec.get('create_date')
                        },
                    ]
                },

            ]
        });

        var myWidth = 310;
        var myHeight = 420;

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
                    if(btn == 'no') {
                        prWin.close();
                    } else {

                        if(form.isValid()) {
                            var val = form.getValues(false);
                            prWin.setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/codeStructure.do?method=update',
                                params: val,
                                success: function(result, request) {
                                    if(prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function() {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function() {
                    if(prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show(this, function() {
            var combo = Ext.getCmp('unique_id_comdst');
            var val = combo.getValue();
            var record = combo.findRecordByValue(val);
            if(record!=null) {
                combo.select(record);
            }

        });
    },



    redrawStore: function (reset) {

        var value = this.getSearchWidget(this.link + '-' + gMain.getSearchField('parent_system_code')).getValue();

        if (value === null) {
            Ext.Msg.alert('경고', '메뉴그룹을 선택하시기 바랍니다.');
            return;
        }

        if (reset == true) {
            gm.me().getStore().getProxy().setExtraParam('start', 0);
            gm.me().getStore().getProxy().setExtraParam('page', 1);

            gm.me().getStore().getProxy().setExtraParam('limit', this.getPageSize());
            gm.me().getStore().currentPage = 1;
        }

        this.setMultisortCond();
        var multisort = gu.getCmp('sortCond-multisort');
        //console_logs('sortCond-multisort', multisort);
        var sortCond = multisort == null ? '' : multisort.getValue();
        //console_logs('sortCond', sortCond);
        if(vCompanyReserved4 === 'BIOT01KR') {
            gm.me().getStore().getProxy().setExtraParam('sortCond', 'code_order asc');
        } else {
            gm.me().getStore().getProxy().setExtraParam('sortCond', sortCond);
        }
        

        try {
            var store = gm.me().getStore();
            // Remove default sorting
            delete store.sorters;
            //페이지초기화

            try {

                if (sortCond != null && sortCond != '') {

                    var sorters = [];
                    var arr = sortCond.split(':');
                    for (var i = 0; i < arr.length; i++) {

                        var cond = arr[i];
                        var arr1 = cond.split(' ');
                        sorters.push({
                            property: arr1[0],
                            direction: arr1[1]
                        })

                    }

                    store.setSorters(sorters);

                }

            } catch (e) {
            }

            for (var i = 0; i < this.searchField.length; i++) {
                var type = 'text';
                var key = this.searchField[i];
                //console_logs('==>key', key);
                if (typeof key == 'string') {

                } else if (typeof key == 'object') {
                    var myO = key;
                    //console_logs('keytype', typeof key);
                    key = myO['field_id'];
                    //console_logs('keytype2', key);
                    type = myO['type'];
                }

                var srchId = this.link + '-' + gMain.getSearchField(key);
                //console_logs('srchId22', srchId);
                if (type == 'date' && vCompanyReserved4 == 'DAEH01KR') {
                    srchId = srchId + '-s';
                }
                var value = null;
                var value1 = null;
                try {
                    var o = this.getSearchWidget(srchId);
                    if (o == null) {
                        //console_logs('redrawStore', srchId + ' 을 찾을 수 없음.');
                    } else {
                        value = o.getValue(); //Ext.getCmp(srchId).getValue();
                    }
                    //console_logs('value', value);
                    var o1 = this.getSearchWidget(srchId + '_');
                    //console_logs('o1', o1);
                    if (o1 == null) {
                        //console_logs('redrawStore', srchId + '_' + ' 을 찾을 수 없음.');
                    } else {
                        value1 = o1.getValue(); //Ext.getCmp(srchId).getValue();
                    }
                } catch (e) {
                }

                //this.getStore().getProxy().setExtraParams({});
                if (value1 != null && value1 != '') {//콤보박스 히든밸류
                    this.getStore().getProxy().setExtraParam(key, value1);
                } else {
                    if (key != null && key != '' && value != null && value.length > 0) {
                        if (type == 'area' || key == 'unique_id' || key == 'barcode' || typeof key == 'object') {
                            this.getStore().getProxy().setExtraParam(key, value);
                        } else {
                            //console_logs('key', key);
                            //console_logs('value', value);
                            var enValue = Ext.JSON.encode('%' + value + '%');
                            this.getStore().getProxy().setExtraParam(key, enValue);
                        }//endofelse

                    } else {//endofif
                        this.getStore().getProxy().setExtraParam(key, null);
                    }

                }
            }

            this.storeLoad();

        } catch (e) {
            //console_logs('redrawStore error', e);
            Ext.MessageBox.show({
                title: '연결 종료',
                msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.<br>그래도 해결되지 않으면 관리자에게 문의하세요.<hr>' + e,
                buttons: Ext.MessageBox.OK,
                //animateTarget: btn,
                scope: this,
                icon: Ext.MessageBox['ERROR'],
                fn: function () {

                }
            });
        }

    }
});