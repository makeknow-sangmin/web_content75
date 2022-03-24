//수주관리 메뉴
Ext.define('Rfx2.view.company.dsmaref.salesDelivery.DgnRequestItemView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'dgn-request-item-view',
    initComponent: function () {

        // 검색툴바 필드 초기화
        this.initSearchField();
        
        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.ReqNonStandard', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['rtgast']
        );

        // this.setRowClass(function (record, index) {
        //     var c = record.get('status');
        //     switch (c) {
        //         case 'P0':
        //             return 'yellow-row';
        //             break;
        //         case 'DE':
        //             return 'red-row';
        //             break;
        //         case 'CR':
        //             return 'green-row';
        //             break;
        //         default:
        //     }
        // });

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];

            switch (dataIndex) {
                case 'req_date':
                case 'reserved_timestamp1':
                case 'create_date':
                    columnObj["renderer"] = Ext.util.Format.dateRenderer('Y-m-d');
                    break;
                case 'state':
                    columnObj['align'] = 'center';
                    columnObj['renderer'] = function(value, meta) {
                        switch(value) {
                            case 'I':
                                meta.css = 'custom-column-working-stop';
                                return '설계요청';
                            case 'A':
                                meta.css = 'custom-column-working-start';
                                return '설계완료';
                        }
                        return value;
                    }
                    break;
            }
        });

        // 버튼 생성
        this.addNonStanAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '의뢰등록',
            tooltip: '신규 의뢰등록',
            disabled:false,
            handler: function() {

                var comboForm = Ext.create('Ext.form.Panel', {
                    xtype:'form',
                    frame: false ,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype      : 'fieldset',
                            title : '제품군 선택',
                            defaultType: 'radiofield',
                            defaults: {
                                // anchor: '80%',
                            },
                            layout: 'vbox',
                            items: [
                                {
                                    boxLabel  : '유닛 쿨러',
                                    name      : 'prd_type',
                                    inputValue: 'unit_cooler',
                                    id        : 'unit_cooler',
                                    checked   : true
                                },{
                                    boxLabel  : '응축기',
                                    name      : 'prd_type',
                                    inputValue: 'condensor',
                                    id        : 'condensor'
                                },{
                                    boxLabel  : '콘덴싱 유닛 및 칠러',
                                    name      : 'prd_type',
                                    inputValue: 'cond_chiller',
                                    id        : 'cond_chiller'
                                },{
                                    boxLabel  : 'Coil 설계',
                                    name      : 'prd_type',
                                    inputValue: 'coil',
                                    id        : 'coil'
                                },{
                                    boxLabel  : '(사용안함)',
                                    name      : 'prd_type',
                                    inputValue: 'prd_type_use_n',
                                    id        : 'prd_type_use_n'
                                }
                                // ,{
                                //     boxLabel  : '기동반 및 리모트 함 관련',
                                //     name      : 'prd_type2',
                                //     inputValue: 'maneu_remote',
                                //     id        : 'maneu_remote',
                                //     checked   : true
                                // },{
                                //     boxLabel  : '(사용안함)',
                                //     name      : 'prd_type2',
                                //     inputValue: 'maneu_remote_use_n',
                                //     id        : 'maneu_remote_use_n'
                                // }
                            ]
                        },{
                            xtype      : 'fieldset',
                            title : '추가 선택',
                            defaultType: 'radiofield',
                            defaults: {
                                // anchor: '80%',
                            },
                            layout: 'vbox',
                            items: [
                                {
                                    boxLabel  : '기동반 및 리모트 함 관련',
                                    name      : 'prd_type2',
                                    inputValue: 'maneu_remote',
                                    id        : 'maneu_remote',
                                    checked   : true
                                },{
                                    boxLabel  : '(사용안함)',
                                    name      : 'prd_type2',
                                    inputValue: 'maneu_remote_use_n',
                                    id        : 'maneu_remote_use_n'
                                }
                            ]
                        }
                    ]
                });

                var comboWin = Ext.create('Ext.Window', {
                    modal : true,
                    title: '타입 선택',
                    width: '30%',
                    height: '50%',
                    items: comboForm,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope:this,
                            handler:function(){
                                var unit_cooler = Ext.getCmp('unit_cooler').getValue();
                                var condensor = Ext.getCmp('condensor').getValue();
                                var cond_chiller = Ext.getCmp('cond_chiller').getValue();
                                var coil = Ext.getCmp('coil').getValue();
                                var maneu_remote = Ext.getCmp('maneu_remote').getValue();
                                var maneu_remote_use_n = Ext.getCmp('maneu_remote_use_n').getValue();

                                var type1 = null;
                                if(unit_cooler) {
                                    type1 = 'UNIT_COOLER';
                                } else if(condensor) {
                                    type1 = 'CONDENSOR';
                                } else if(cond_chiller) {
                                    type1 = 'COND_CHILLER';
                                } else if(coil) {
                                    type1 = 'COIL_DESIGN';
                                };
                                var type2 = null;
                                if(maneu_remote) {
                                    type2 = true;
                                } else {
                                    type2 = false;
                                }

                                if(comboWin){
                                    comboWin.close();
                                    gm.me().manageFn('add', type1, type2);
                                };
                            }
                        },{
                            text: CMD_CANCEL,
                            scope:this,
                            handler:function(){
                                if(comboWin){
                                    comboWin.close();
                                }
                            }
                        }
                    ]
                }); comboWin.show();
            }
        });

        this.editNonStanAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            disabled:true,
            handler: function() {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                var state = select.get('state');
                if(state != null && state == 'A') {
                    Ext.MessageBox.alert('알림', '설계완료된 항목이 있습니다.');
                    return;
                }
                var detailItem = gm.me().detailGrid.getStore().data.items[0];

                var type1 = detailItem.get('vPrdType1');
                var type2 = detailItem.get('vPrdType2');
                
                gm.me().manageFn('edit', type1, type2);
            }
        });

        this.removeNonStanAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            disabled:true,
            handler: function() {
                Ext.MessageBox.show({
                    title:'삭제',
                    msg: '선택하신 항목들을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {
                            var selects = gm.me().grid.getSelectionModel().getSelection();
                            var uids = [];
                            for(var i=0; i<selects.length; i++) {
                                var select = selects[i];
                                var state = select.get('state');
                                if(state != null && state == 'A') {
                                    Ext.MessageBox.alert('알림', '설계완료된 항목이 있습니다.');
                                    return;
                                }
                                var id = select.get('unique_uid');
                                console_logs('>>>>>>>>>>removeFn id : ', id);
                                uids.push(id);
                            };
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/schdule.do?method=removeNonStan',
                                params:{
                                    unique_ids:uids
                                },
                                success: function(){
                                    gm.me().store.load();
                                    gm.me().grid.getSelectionModel().deselectAll();
                                },
                                failure: function(){
                                    gm.me().showToast('결과', '삭제실패' );
                                }
                             });
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.copyNonStanAction = Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            text: '복사등록',
            tooltip: '복사등록',
            disabled:true,
            handler: function() {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                var detailItem = gm.me().detailGrid.getStore().data.items[0];

                var type1 = detailItem.get('vPrdType1');
                var type2 = detailItem.get('vPrdType2');

                gm.me().manageFn('copy', type1, type2);
            }
        });

        this.completeDesignAction = Ext.create('Ext.Action', {
            iconCls: 'af-check',
            text: '설계완료',
            tooltip: '설계완료',
            disabled:true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '설계완료',
                    msg: '해당 항목을 설계완료 처리 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().completeDesignConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // 버튼 추가.
        buttonToolbar.insert(4, this.removeNonStanAction);
        buttonToolbar.insert(4, this.copyNonStanAction);
        // buttonToolbar.insert(6, this.removeNonStanAction);
        buttonToolbar.insert(4, this.editNonStanAction);
        buttonToolbar.insert(4, this.addNonStanAction);

        buttonToolbar.insert(10, '->');
        buttonToolbar.insert(13, this.completeDesignAction);
        

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            itemId: 'fileattachAction',
            disabled: true,
            text:'첨부',
            handler: function(widget, event) {
                gm.me().attachFile();
            }
        });

        buttonToolbar.insert(13, '->');
        buttonToolbar.insert(16, this.fileattachAction);
        
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                this.editNonStanAction.enable();
                this.removeNonStanAction.enable();
                this.copyNonStanAction.enable();
                this.fileattachAction.enable();
                this.completeDesignAction.enable();

                var rtgast_uid = rec.get('unique_id_long');
                this.detailStore.getProxy().setExtraParam('group_uid', rtgast_uid);
                this.detailStore.load(function(datas) {
                    gm.me().detailInfoStore.removeAll();
                    if(datas == null || datas.length < 1) return;
                    var data = datas[0];
                    var prd_type1 = data.get('v000');
                    var prd_type2 = data.get('v001');

                    var type_ko = '';
                    switch(prd_type1) {
                        case 'UNIT_COOLER':
                            type_ko='유니트 쿨러';
                            break;
                        case 'CONDENSOR':
                            type_ko='콘덴서';
                            break;
                        case 'COND_CHILLER':
                            type_ko='콘덴싱 유니트 및 칠러';
                            break;
                        case 'COIL_DESIGN':
                            type_ko='코일';
                            break;
                    };

                    gMain.extFieldColumnStore.load({
                        params: { 	menuCode: prd_type1  },
                        callback: function(type_columns, operation, success) {
                            if(success) {
                                var rs = [];
                                // gm.me().detailInfoStore.removeAll();
                                for(var i=0; i<type_columns.length; i++) {
                                    var t = type_columns[i];
                                    var key = t.get('dataIndex');
                                    var value = data.get(key);
                                    var field = t.get('text');
                                    var  r = {
                                        vField:field, vValue:value, vGroup:type_ko,
                                        vPrdType1:prd_type1, vPrdType2:prd_type2
                                    };
                                    rs.push(r);
                                }
                                gm.me().detailInfoStore.add(rs);

                                if(prd_type2 != null && prd_type2.length > 0 && prd_type2 != 'null' && prd_type2 == 'true') {
                                    gMain.extFieldColumnStore.load({
                                        params: { 	menuCode: 'START_REMOTE'  },
                                        callback: function(type2_columns, operation, success) {
                                            if(success) {
                                                var rs2 = [];
                                                for(var i=0; i<type2_columns.length; i++) {
                                                    var t = type2_columns[i];
                                                    var key = t.get('dataIndex');
                                                    var value = data.get(key);
                                                    var field = t.get('text');
                                                    var  r = {
                                                        vField:field, vValue:value, vGroup:'기동반 및 리모트 함',
                                                        vPrdType1:prd_type1, vPrdType2:prd_type2
                                                    };
                                                    rs2.push(r);
                                                }
                                                gm.me().detailInfoStore.add(rs2);
                                            };
                                        }
                                    });
                                };

                                var name_plate = data.get('v037');
                                if(name_plate != null && name_plate.length > 0) {
                                    gm.me().detailInfoStore.add([
                                        {
                                            vField:'명판', vValue:name_plate, vGroup:'명판'
                                        }
                                    ]);
                                }

                                var etc_value = data.get('v038');
                                if(etc_value != null && etc_value.length > 0) {
                                    gm.me().detailInfoStore.add([
                                        {
                                            vField:'기타', vValue:etc_value, vGroup:'기타'
                                        }
                                    ]);
                                }

                                gm.me().detailInfoStore.group('vGroup');
                                gm.me().detailInfoStore.sort('vGroup','DESC');
                            }
                        },
                        scope: this
                    });

                });

            } else {
                this.editNonStanAction.disable();
                this.removeNonStanAction.disable();
                this.copyNonStanAction.disable();
                this.fileattachAction.disable();
                this.completeDesignAction.disable();
            }
        });

        // this.createCrudTab();
        
        Ext.apply(this, {
            layout: 'border',
			items: [
                {
                    collapsible: false,
					frame: true,
                    region: 'center',
                    width: '70%',
                    layout:'fit',
					items: [this.grid]
                }, {
                    id:'detailView',
					collapsible: false,
                    frame: true,
					region: 'east',
					layout: 'fit',
					width: '30%',
					items: [this.detailInfo()]  
                }
            ]
        });

        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==9) {
            	buttonToolbar.items.remove(item);
      	  }
        });

        this.callParent(arguments);


        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('rtg_type', 'NS');

        this.store.load(function (records) {
        });

    },

    detailInfoStore :Ext.create('Ext.data.Store', {
        fields:['vField', 'vValue', 'vGroup', 'vPrdType1', 'vPrdType2']
    }),

    detailInfo: function() {

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            startCollapsed: false,
            // id: 'restaurantGrouping'
        });

        this.detailGrid = Ext.create('Ext.grid.Panel', {
            cls:'rfx-panel',
            collapsible:false,
            autoScroll:true,
            autoHeight:true,
            border:false,
            title:'상세정보',
            layout:'fit',
            header:{
                cls: 'header-cls',
                style:'background-color:#F5F5F5',
                title : {
                    cls : 'header-title-cls',
                    text : '상세정보'
                }
            },
            features: [groupingFeature],
            store:this.detailInfoStore,
            columns: [
                {
                    header:'이름',
                    dataIndex:'vField',
                    width:'50%',
                    align:'left',
                    style:'text-align:center',
                    sortable:true,
                    resizable:true
                },{
                    header:'값',
                    dataIndex:'vValue',
                    width:'50%',
                    align:'left',
                    style:'text-align:center',
                    sortable:true,
                    resizable:true
                }
            ]
        });

        // var form = Ext.create('Ext.form.Panel', {
        //     id: gu.id('detailInfo'),
        //     xtype: 'form',
        //     title:'상세정보',
        //     header:{
        //         cls: 'header-cls',
        //         style:'background-color:#F5F5F5',
        //         title : {
        //             cls : 'header-title-cls',
        //             text : '상세정보'
        //         }
        //     },
        //     frame: false,
        //     border: false,
        //     bodyPadding: '3 3 0',
        //     region: 'center',
        //     fieldDefaults: {
        //         labelAlign: 'right',
        //         msgTarget: 'side'
        //     },
        //     defaults: {
        //         anchor: '100%',
        //         //labelWidth: 60,
        //         //margins: 10,
        //     },
        //     items: [
        //         {
        //             xtype:'textfield',
        //             fieldLabel:'전기사양',
        //             triggerWrapCls: '',
        //             inputWrapCls: '',
        //             readOnly:true,
        //             value:'222'
        //         }
        //     ]
        // });

        return this.detailGrid;
    },

    getPrdTypeStore:  function(type) {
         Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=getPrdFormType',
            async : false,
            // loading: true,
            params:{
                type:type,
                identification_code:'PRD_TYPE_CODE'
            },
            success: function(result, request){
                var jsonData = Ext.JSON.decode(result.responseText);
                console_logs('>>> jsonData', jsonData);
                // this.load({
                //     callback:function() {
                //         return jsonData;
                //     }
                // })
            },
            failure: function(){
                gm.me().showToast('결과', '실패' );
            }
        });
    },

    PrdTypeStore: Ext.create('Mplm.store.PrdTypeStore', {}),
    PrdTypeStore2: Ext.create('Mplm.store.PrdTypeStore', {}),

    getViewValue: function(field) {
        var detailItems = gm.me().detailGrid.getStore().data.items;
        for(var i=0; i<detailItems.length; i++) {
            var detailItem = detailItems[i];
            var vField = detailItem.get('vField');
            if(vField == field) {
                return detailItem.get('vValue');
            }
        }
    },

    manageFn: function(type, type1, type2) {  // type: 등록/수정/복사 type1:제품군 type2:기동반 여부
        var title = '';
        var select = null;
        var detailStore = null;
        switch(type) {
            case 'add':
                title = '의뢰등록';
            break;
            case 'edit':
                title = '수정';
                select = gm.me().grid.getSelectionModel().getSelection()[0];
                detailStore = gm.me().detailGrid.getStore().data.items;
            break;
            case 'copy':
                title = '복사등록';
                select = gm.me().grid.getSelectionModel().getSelection()[0];
                detailStore = gm.me().detailGrid.getStore().data.items;
            break;
        };

        // 명판 및 기타는 필수값
        var fieldItems = [
            new Ext.form.Hidden({
                name: 'type',
                value: type
            }),
            new Ext.form.Hidden({
                name: 'type1',
                value: type1
            }),
            new Ext.form.Hidden({
                name: 'type2',
                value: type2
            }),
            new Ext.form.Hidden({
                name: 'unique_id',
                value: type=='edit'?select.get('unique_id'):-1
            }),
        ];

        var rtgastForm = Ext.create('Ext.form.Panel', {
            id: 'manageItemForm',
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            layout:'column',
            bodyPadding: 10,
            items: [
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '공통사항',
                    width:'100%',
                    layout:'column',
                    defaults: {
                        // anchor: '100%',
                        labelWidth:100,
                        layout:'column',
                    },
                    items: [
                        {
                            xtype:'textfield',
                            id:'reserved_varchar1',
                            name:'reserved_varchar1',
                            width:'35%',
                            padding: '0 0 5px 0',
                            fieldLabel:'담당자',
                            value:type=='edit'||type=='copy' ? select.get('reserved_varchar1') : ''
                        },{
                            xtype:'textfield',
                            id:'reserved_varchar2',
                            name:'reserved_varchar2',
                            width:'35%',
                            padding: '0 0 5px 30px',
                            fieldLabel:'수주번호',
                            value:type=='edit'||type=='copy' ? select.get('reserved_varchar2') : ''
                        },{
                            xtype:'datefield',
                            id:'req_date',
                            name:'req_date',
                            width:'35%',
                            padding: '0 0 5px 0',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            format: 'Y-m-d',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            value:type=='edit'||type=='copy' ? Ext.Date.format(new Date(select.get('req_date')), 'Y-m-d') : Ext.Date.format(new Date(), 'Y-m-d'),
                            fieldLabel:'의뢰일자',
                        },{
                            xtype:'textfield',
                            id:'reserved_varchar3',
                            name:'reserved_varchar3',
                            width:'35%',
                            padding: '0 0 5px 30px',
                            fieldLabel:'고객사',
                            value:type=='edit'||type=='copy' ? select.get('reserved_varchar3') : ''
                        },{
                            xtype:'textfield',
                            id:'reserved_varchar4',
                            name:'reserved_varchar4',
                            width:'35%',
                            padding: '0 0 5px 0',
                            fieldLabel:'소요처',
                            value:type=='edit'||type=='copy' ? select.get('reserved_varchar4') : ''
                        },{
                            xtype:'textfield',
                            id:'reserved_varchar5',
                            name:'reserved_varchar5',
                            width:'35%',
                            padding: '0 0 5px 30px',
                            fieldLabel:'거래선 담당자',
                            value:type=='edit'||type=='copy' ? select.get('reserved_varchar5') : ''
                        },{
                            xtype:'textfield',
                            id:'reserved_varcharb',
                            name:'reserved_varcharb',
                            width:'35%',
                            padding: '0 0 5px 0',
                            fieldLabel:'연락처',
                            value:type=='edit'||type=='copy' ? select.get('reserved_varcharb') : ''
                        }
                    ]
                }
            ]
        });

        fieldItems.push(rtgastForm);

        var fs = {
            xtype: 'fieldset',
            collapsible: false,
            title: '명판',
            width:'100%',
            defaults: {
                anchor: '100%',
                labelWidth:120,
                layout: {
                    type: 'fit',
                }
            },
            items: [
                {
                    xtype:'textarea',
                    name: 'name_plate',
                    width:500,
                    id: 'name_plate',
                    value:type == 'edit' || type == 'copy' ? gm.me().getViewValue('명판') : ''
                }
            ]
        };
        var fs2 = {
            xtype: 'fieldset',
            collapsible: false,
            title: '기타',
            width:'100%',
            defaults: {
                anchor: '100%',
                labelWidth:120,
                layout: {
                    type: 'fit',
                }
            },
            items: [
                {
                    xtype:'textarea',
                    name: 'etc_value',
                    width:500,
                    id: 'etc_value',
                    value:type == 'edit' || type == 'copy' ? gm.me().getViewValue('기타') : ''
                }
            ]
        };

        if(type1 == null || type1.length < 1) type1 = 'null';
        this.PrdTypeStore.getProxy().setExtraParam('type', type1);
        this.PrdTypeStore.getProxy().setExtraParam('identification_code', 'PRD_TYPE_CODE');
        this.PrdTypeStore.load(function(records) {
            if(records != null && records.length > 0) {
                var groupName = [];
                var group = records.reduce((r, a) => {  // class 별로 grouping
                    try {
                        r[a.get('class_type')].length;
                    } catch(e) {
                        groupName.push(a.get('class_type'));
                    }
                    r[a.get('class_type')] = [...r[a.get('class_type')] || [], a];
                    return r;
                }, {});

                var s_title = '';
                switch(type1) {
                    case 'UNIT_COOLER':
                        s_title = '유니트 쿨러 (Unit Cooler)';
                    break;
                    case 'CONDENSOR':
                        s_title = '응축기 (Condensor)';
                    break;
                    case 'COND_CHILLER':
                        s_title = '콘덴싱 유니트 및 칠러 (Condensing Unit & Chiller)';
                    break;
                    case 'COIL_DESIGN':
                        s_title = 'Coil 설계';
                    break;
                }

                var fieldSet = {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: s_title,
                    width:'100%',
                    defaults: {
                        anchor: '100%',
                        labelWidth:120,
                        layout: {
                            type: 'column',
                        }
                    },
                    items: []
                }
                for(var i=0; i<groupName.length; i++) {
                    var g_name = groupName[i];
                    var g = group[g_name];
                    var t = g[0].get('reserved_varchar1');
                    var container = {
                        xtype      : 'fieldcontainer',
                        fieldLabel : t,
                        fieldWidth : '150px',
                        defaultType: 'radiofield',
                        defaults: {
                            style:'padding-left: 5px;',
                            // anchor: '80%',
                        },
                        layout: 'hbox',
                        items:[]
                    }
                    for(var j=0; j<g.length; j++) {
                        var _g = g[j];
                        var class_code = _g.get('class_code');
                        var egci_code = _g.get('egci_code');
                        var fieldName = _g.get('reserved_varchar1');
                        if(class_code != null && class_code.length > 0) {
                            f_item = {
                                boxLabel: class_code,
                                name: g_name,
                                inputValue: class_code,
                                id: g_name + j,
                                value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                            }
                        } else {
                            var class_type = _g.get('class_type');
                            if(class_type != null && class_type == 'ECT_ISSUT') { // 기타사항은 TextArea
                                f_item = {
                                    xtype:'textarea',
                                    name: g_name,
                                    width:500,
                                    id: g_name + j,
                                    value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                }
                            } else {
                                f_item = {
                                    xtype:'textfield',
                                    name: g_name,
                                    id: g_name + j,
                                    value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                }
                            }
                        }
                        
                        container.items.push(f_item);
                        if(egci_code != null && egci_code.length > 0) {
                            var ect_item = {
                                xtype:'textfield',
                                name: g_name + '_etc',
                                id: g_name + '_etc' + j,
                                triggerWrapCls: '',
                                inputWrapCls: '',
                                value:type == 'edit' || type == 'copy' ? '( ' + gm.me().getViewValue(fieldName) + ' )' : egci_code
                            }
                            container.items.push(ect_item);
                        }
                    };
                    fieldSet.items.push(container);
                };

                if(type2) {
                    gm.me().PrdTypeStore2.getProxy().setExtraParam('type', 'START_REMOTE');
                    gm.me().PrdTypeStore2.getProxy().setExtraParam('identification_code', 'PRD_TYPE_CODE');
                    gm.me().PrdTypeStore2.load(function(_records) {
                        console_logs('>>>???_records', _records);
                        var groupName2 = [];
                        var group2 = _records.reduce((r, a) => {  // class 별로 grouping
                            try {
                                r[a.get('class_type')].length;
                            } catch(e) {
                                groupName2.push(a.get('class_type'));
                            }
                            r[a.get('class_type')] = [...r[a.get('class_type')] || [], a];
                            return r;
                        }, {});

                        var fieldSet2 = {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: '기동반 및 리모트 함 관련',
                            width:'100%',
                            defaults: {
                                anchor: '100%',
                                labelWidth:120,
                                layout: {
                                    type: 'column',
                                }
                            },
                            items: []
                        }

                        for(var i=0; i<groupName2.length; i++) {
                            var g_name2 = groupName2[i];
                            var g2 = group2[g_name2];
                            var t2 = g2[0].get('reserved_varchar1');
                            var container = {
                                xtype      : 'fieldcontainer',
                                fieldLabel : t2,
                                fieldWidth : '150px',
                                defaultType: 'radiofield',
                                defaults: {
                                    style:'padding-left: 5px;',
                                    // anchor: '80%',
                                },
                                layout: 'hbox',
                                items:[]
                            }
                            for(var j=0; j<g2.length; j++) {
                                var _g = g2[j];
                                var class_code = _g.get('class_code');
                                var egci_code = _g.get('egci_code');
                                var fieldName = _g.get('reserved_varchar1');
                                if(class_code != null && class_code.length > 0) {
                                    f_item = {
                                        boxLabel: class_code,
                                        name: g_name2,
                                        inputValue: class_code,
                                        id: g_name2 + j,
                                        value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                    }
                                } else {
                                    var class_type = _g.get('class_type');
                                    if(class_type != null && class_type == 'ECT_ISSUT') { // 기타사항은 TextArea
                                        f_item = {
                                            xtype:'textarea',
                                            name: g_name2,
                                            width:500,
                                            id: g_name2 + j,
                                            value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                        }
                                    } else {
                                        f_item = {
                                            xtype:'textfield',
                                            name: g_name2,
                                            id: g_name2 + j,
                                            value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                        }
                                    }
                                }
                                
                                container.items.push(f_item);
                                if(egci_code != null && egci_code.length > 0) {
                                    var ect_item = {
                                        xtype:'textfield',
                                        name: g_name2 + '_etc',
                                        id: g_name2 + '_etc' + j,
                                        triggerWrapCls: '',
                                        inputWrapCls: '',
                                        value:type == 'edit' || type == 'copy' ? '( ' + gm.me().getViewValue(fieldName) + ' )' : egci_code
                                    }
                                    container.items.push(ect_item);
                                }
                            };
                            fieldSet2.items.push(container);
                        };

                        
                        fieldItems.push(fieldSet);
                        fieldItems.push(fieldSet2);
                        fieldItems.push(fs);
                        fieldItems.push(fs2);

                        var form = Ext.create('Ext.form.Panel', {
                            id: 'nonStanForm',
                            xtype: 'form',
                            frame: false,
                            border: false,
                            width: '100%',
                            layout:'column',
                            bodyPadding: 10,
                            items:  fieldItems// fieldSet
                        }); // form end
                
                        var win = Ext.create('Ext.Window', {
                            modal: true,
                            title: title,
                            id:'nonStanWin',
                            width: 900,
                            height: 650,
                            plain: true,
                            items: form,
                            autoScroll:true,
                            buttons: [{
                                text: CMD_OK,
                                handler: function(btn) {
                                    var form = Ext.getCmp('nonStanForm').getForm();
                                    if(form.isValid()) {
                                        gm.me().manageHandler(form);
                                    }
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function(btn) {
                                    win.close();
                                }
                            }]
                        });win.show();
                    });
                } else {
                    fieldItems.push(fieldSet);
                    fieldItems.push(fs);
                    fieldItems.push(fs2);
        
                    var form = Ext.create('Ext.form.Panel', {
                        id: 'nonStanForm',
                        xtype: 'form',
                        frame: false,
                        border: false,
                        width: '100%',
                        layout:'column',
                        bodyPadding: 10,
                        items:  fieldItems// fieldSet
                    }); // form end
            
                    var win = Ext.create('Ext.Window', {
                        modal: true,
                        title: title,
                        id:'nonStanWin',
                        width: 850,
                        height: 650,
                        plain: true,
                        items: form,
                        autoScroll:true,
                        buttons: [{
                            text: CMD_OK,
                            handler: function(btn) {
                                var form = Ext.getCmp('nonStanForm').getForm();
                                if(form.isValid()) {
                                    gm.me().manageHandler(form);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function(btn) {
                                win.close();
                            }
                        }]
                    });win.show();
                }
                
            } else if(type1 == 'null' && type2 == true) {
                gm.me().PrdTypeStore2.getProxy().setExtraParam('type', 'START_REMOTE');
                    gm.me().PrdTypeStore2.getProxy().setExtraParam('identification_code', 'PRD_TYPE_CODE');
                    gm.me().PrdTypeStore2.load(function(_records) {
                        var groupName2 = [];
                        var group2 = _records.reduce((r, a) => {  // class 별로 grouping
                            try {
                                r[a.get('class_type')].length;
                            } catch(e) {
                                groupName2.push(a.get('class_type'));
                            }
                            r[a.get('class_type')] = [...r[a.get('class_type')] || [], a];
                            return r;
                        }, {});

                        var fieldSet2 = {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: '기동반 및 리모트 함 관련',
                            width:'100%',
                            defaults: {
                                anchor: '100%',
                                labelWidth:120,
                                layout: {
                                    type: 'column',
                                }
                            },
                            items: []
                        }

                        for(var i=0; i<groupName2.length; i++) {
                            var g_name2 = groupName2[i];
                            var g2 = group2[g_name2];
                            var t2 = g2[0].get('reserved_varchar1');
                            var container = {
                                xtype      : 'fieldcontainer',
                                fieldLabel : t2,
                                fieldWidth : '150px',
                                defaultType: 'radiofield',
                                defaults: {
                                    style:'padding-left: 5px;',
                                    // anchor: '80%',
                                },
                                layout: 'hbox',
                                items:[]
                            }
                            for(var j=0; j<g2.length; j++) {
                                var _g = g2[j];
                                var class_code = _g.get('class_code');
                                var egci_code = _g.get('egci_code');
                                var fieldName = _g.get('reserved_varchar1');
                                if(class_code != null && class_code.length > 0) {
                                    f_item = {
                                        boxLabel: class_code,
                                        name: g_name2,
                                        inputValue: class_code,
                                        id: g_name2 + j,
                                        value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                    }
                                } else {
                                    var class_type = _g.get('class_type');
                                    if(class_type != null && class_type == 'ECT_ISSUT') { // 기타사항은 TextArea
                                        f_item = {
                                            xtype:'textarea',
                                            name: g_name2,
                                            width:500,
                                            id: g_name2 + j,
                                            value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                        }
                                    } else {
                                        f_item = {
                                            xtype:'textfield',
                                            name: g_name2,
                                            id: g_name2 + j,
                                            value:type == 'edit' || type == 'copy' ? gm.me().getViewValue(fieldName) : ''
                                        }
                                    }
                                }
                                
                                container.items.push(f_item);
                                if(egci_code != null && egci_code.length > 0) {
                                    var ect_item = {
                                        xtype:'textfield',
                                        name: g_name2 + '_etc',
                                        id: g_name2 + '_etc' + j,
                                        triggerWrapCls: '',
                                        inputWrapCls: '',
                                        value:type == 'edit' || type == 'copy' ? '( ' + gm.me().getViewValue(fieldName) + ' )' : egci_code
                                    }
                                    container.items.push(ect_item);
                                }
                            };
                            fieldSet2.items.push(container);
                        };

                        
                        fieldItems.push(fieldSet);
                        fieldItems.push(fieldSet2);
                        fieldItems.push(fs);
                        fieldItems.push(fs2);

                        var form = Ext.create('Ext.form.Panel', {
                            id: 'nonStanForm',
                            xtype: 'form',
                            frame: false,
                            border: false,
                            width: '100%',
                            layout:'column',
                            bodyPadding: 10,
                            items:  fieldItems// fieldSet
                        }); // form end
                
                        var win = Ext.create('Ext.Window', {
                            modal: true,
                            title: title,
                            id:'nonStanWin',
                            width: 900,
                            height: 650,
                            plain: true,
                            items: form,
                            autoScroll:true,
                            buttons: [{
                                text: CMD_OK,
                                handler: function(btn) {
                                    var form = Ext.getCmp('nonStanForm').getForm();
                                    if(form.isValid()) {
                                        gm.me().manageHandler(form);
                                    }
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function(btn) {
                                    win.close();
                                }
                            }]
                        });win.show();
                    });
            } else { // 둘다 선택 안하면 리턴
                return null;
            }
        });
    },

    manageHandler: function(form) {

        form.submit({
            url: CONTEXT_PATH + '/production/schdule.do?method=nonStandardManage',
            // params: val,
            success: function(val, action) {
                var win = Ext.getCmp('nonStanWin');
                if(win) {
                    win.close();
                }
                gm.me().store.load(function() {});
                gm.me().grid.getSelectionModel().deselectAll();
            },
            failure: function(val, action) {
                var win = Ext.getCmp('nonStanWin');
                if(win) {
                    win.close();
                }
                gm.me().store.load(function() {});

            }
        });
    },

    attachFile: function() {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
		});
		

        var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype : 'button',
                        text : '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope : this.fileGrid,
                        handler : function() {

                            console_logs('=====aaa', record);
                            var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            // var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('top_srcahd_uid');

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions : {
                                    url : url
                                },
                                synchronous : true
                            });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle : '파일 첨부',
                                    panel : uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {
                                	
                                	console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                	console_logs('this.mon uploadcomplete manager', manager);
                                	console_logs('this.mon uploadcomplete items', items);
                                	console_logs('this.mon uploadcomplete errorCount', errorCount);
                                	
                                	gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                        uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile, 
                        '-',
                        this.sendFileAction,
                        '->',
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : 'UID',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'id'
                },
            	{
                    text     : '파일명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    width     : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '날짜',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype:'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        });
	    win.show();
        
        
        // this.fileGrid.getSelectionModel().on({
	    // 	selectionchange: function(sm, selections) {

	    // 		if(selections!=null && selections.length>0) {
		//     		gm.me().removeActionFile.enable();
		//     		gm.me().sendFileAction.enable();
	    // 		} else {
	    // 			gm.me().removeActionFile.disable();
	    // 			gm.me().sendFileAction.disable();
	    // 		}

	    // 	}
        // });
    },
    
    attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

    uploadComplete : function(items) {
    	
    	console_logs('uploadComplete items', items);
    	
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function(item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        
        console_logs('파일업로드 결과', output);
        
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });
    },

    completeDesignConfirm: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var ids = [];
        for(var i=0; i<selections.length; i++) {
            var select = selections[i];
            var id = select.id;
            var state = select.get('state');
            if(state != null && state == 'A') {
                Ext.MessageBox.alert('알림', '설계완료된 항목이 있습니다.');
                return;
            }
            ids.push(id);
        };

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=completeDesignConfirm',
            params: {
                unique_ids:ids
            },
            success: function (result, request) {
                gm.me().store.load();
                gm.me().grid.getSelectionModel().deselectAll();
            },
            failure: extjsUtil.failureMessage
        });
    },

    detailStore : Ext.create('Mplm.store.NonStandardDetailStore'),
});
