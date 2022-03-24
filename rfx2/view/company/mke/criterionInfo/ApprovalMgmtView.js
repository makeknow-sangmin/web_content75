//고객사 관리 메뉴
Ext.define('Rfx2.view.company.mke.criterionInfo.ApprovalMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'appr-mgmt-view',
    initComponent: function(){
    	
    	this.initSearchField();
//    	this.addSearchField('item_code');
        
        this.addSearchField({
            type:           'combo',
            field_id:		'act_type',
            displayField:   'codeName',
            valueField:     'systemCode',
            id:             'act_type',
            store: 			'CommonCodeStore',
            params:{parentCode: 'MASS_GUBUN_TYPE'},
            emptyText:      '개발/양산',
            innerTpl: 		'<div data-qtip="{systemCode}">{codeName}</div>'
        });
        this.addSearchField({
            type:           'combo',
            field_id:		'area_type',
            id:             'area_type',
            displayField:   'codeName',
            valueField:     'systemCode',
            store: 			'CommonCodeStore',
            params:{parentCode: 'NATION'},
            emptyText:      '지역',
            innerTpl: 		'<div data-qtip="{systemCode}">{codeName}</div>'    
        });
        this.addSearchField({
            type:           'combo',
            width:          '200',
            field_id:		'class_code',
            displayField:   'class_code',
            valueField:     'class_code',
            store: 			'ClaastStore',
            params:{identification_code: 'SO_TYPE'},
            emptyText:      'SO_TYPE',
            innerTpl: 		'<div data-qtip="{class_code}">{class_code}</div>'    
        });
        this.addSearchField({
            type:           'combo',
            field_id:		'app_type',
            displayField:   'codeName',
            valueField:     'systemCode',
            store: 			'AppTypeStore',
            emptyText:      '유형',
            innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'    
        });
        this.addSearchField({
            type:           'combo',
            field_id:		'gubun',
            displayField:   'codeName',
            valueField:     'systemCode',
            store: 			'MkeGubunStore',
            emptyText:      '부서',
            innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'    
        });
        
        // var act_combo = null;
        // for(var i=0; i<this.searchField.length; i++) {
        //     var field = this.searchField[i];
        //     console_logs('>>> field', field);
        //     console_logs('>>> field id', field['id']);
        //     var id = field['id'];
        //     if(id != null && id != undefined && id == 'act_type') {
        //         act_combo = field;
        //     }
        // }

        

        // act_combo.on('select', function(a) {
        //     console_logs('>>>>> aaa', a);
        // })

    	
		// 검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        

        // var a = this.searchToolbar['items']['items'][1];
        // a.on('select', function(a) {
        //     alert('aaaa');
        // });

        var act_btn  = null;
            area_btn = null;
            code_store = null;
            
        for(var i=0; i<this.searchToolbar['items']['items'].length; i++) {
            var field = this.searchToolbar['items']['items'][i];
                cmpId = field['cmpId'];
            switch(cmpId) {
                case 'PPO1_SUB-srchAct_type':
                act_btn = field;
                break;
                case 'PPO1_SUB-srchArea_type':
                area_btn = field;
                break;
                case 'PPO1_SUB-srchClass_code':
                code_store = field['store'];
                break;
            }
        }

        act_btn.on('select', function(combo, record) {
            var bottom_class_flag = record.get('system_code');
            code_store.getProxy().setExtraParam('bottom_class_flag', bottom_class_flag);
            code_store.load();
        });

        area_btn.on('select', function(combo, record) {
            var egci_code = record.get('system_code');
            code_store.getProxy().setExtraParam('egci_code', egci_code);
            code_store.load();
        });

		// 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
    	this.createStore('Rfx.model.ApprovalMgmt', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/* pageSize */
        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	// Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	
        }
    	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['rtgapp']
        );
    
        buttonToolbar.items.each(function(item, index, length) {
            if(index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addUserButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
               gm.me().addUserView('N');
            }
        });

        this.modifyUserButton = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().addUserView('Y');
            //    gm.me().modifyUserView();
            }
        });

        buttonToolbar.insert(1, this.addUserButton);
        // buttonToolbar.insert(2, this.modifyUserButton);
        
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            // listeners: {
            //     itemclick: function(a,b) {
            //         console_logs('>>>>>> aaa', a);
            //         console_logs('>>>>>> bbb', b);
            //     }
            // }
        });

        var option = {
            rowEdit: true
        };

    	 // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        Ext.define('AppType', {
            extend: 'Ext.data.Model',
            fields : [ 'name' ]
        });

        appTypeStore = Ext.create('Ext.data.Store', {
            model : 'AppType',
            data: [
                { name: 'Ag'},
                { name: 'Au' },
                { name: 'Cu' }
            ]
        });

        Ext.define('AppGubun', {
            extend: 'Ext.data.Model',
            fields : [ 'name' ]
        });

        appGubunStore = Ext.create('Ext.data.Store', {
            model : 'AppGubun',
            data: [
                { name: '영업', value: 'SO'},
                { name: '기술', value: 'TC' },
                { name: '품질', value: 'QA' },
                { name: '생산', value: 'WO' },
                { name: '생산출하', value: 'DL' }
            ]
        });

        Ext.define('ChangeType', {
            extend: 'Ext.data.Model',
            fields : [ 'name' ]
        });

        changeTypeStore = Ext.create('Ext.data.Store', {
            model : 'ChangeType',
            data: [
                { name: '결재+메일', value: 'S'},
                { name: '메일', value: 'M' }
            ]
        });

        console_logs('>>>>dasda', this.userStore);

        var urastStore = this.userStore;
        urastStore.load();

        var massgStore    = this.mass_gubun_store;
            nationStore   = this.nation_store;
            claast_store  = this.ClaastStore;

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj['dataIndex'];

            switch(dataIndex) {
                case 'app_type':
                columnObj["editor"] = {
                    xtype: 'combo',
                    store: appTypeStore,
                    displayField: 'name',
                    valueField: 'name',
                    id: 'col_app_type',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div>{name}</div>';
                        }
                    }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';

                    return value;
                } 
                break;
                case 'gubun':
                columnObj["editor"] = {
                    // xtype: 'combo',
                    // store: appGubunStore,
                    // displayField: 'name',
                    // valueField: 'name',
                    // id: 'col_gubun',
                    // listConfig: {
                    //     getInnerTpl: function() {
                    //         return '<div>{name}</div>';
                    //     }
                    // }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';

                    return value;
                } 
                break;
                case 'user_name':
                columnObj["editor"] = {
                    xtype: 'combo',
                    id:'col_user_uid',
                    name:'col_user_uid',
                    store: urastStore,
                    displayField:'user_name',
                    valueField: 'unique_id',
                    allowBlank: false,
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">[{user_id}]{user_name}</div>';
                        }
                    },
                    listeners: {
                        select: function(grid, data) {
                            // Ext.getCmp('col_user_uid').setValue(data.get('unique_id'));
                            // Ext.getCmp('user_id').setValue(data.get('user_id'));
                        }
                    }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                } 
                break;
                case 'change_type':
                columnObj["editor"] = {
                    xtype: 'combo',
                    id:'col_change_type',
                    name:'col_change_type',
                    store: changeTypeStore,
                    displayField:'name',
                    valueField: 'value',
                    allowBlank: false,
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{value}">{name}</div>';
                        }
                    },
                    listeners: {
                        select: function(grid, data) {
                            // Ext.getCmp('usrast_uid').setValue(data.get('unique_id'));
                            // Ext.getCmp('user_id').setValue(data.get('user_id'));
                        }
                    }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';
                    if(value == 'S') {
                        value = '결재+메일';
                    } else if(value == 'M') {
                        value = '메일';
                    }
                    return value;
                } 
                break;
                case 'act_type':
                columnObj["editor"] = {
                    xtype: 'combo',
                    store: massgStore,
                    displayField: 'codeName',
                    valueField: 'systemCode',
                    id: 'col_act_type',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div>{codeName}</div>';
                        }
                    },
                    listeners: {
                        select: function(combo, record) {
                            var value = record.get('system_code');
                            claast_store.getProxy().setExtraParam('bottom_class_flag', value);
                            claast_store.load();
                        }
                    }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';
                    switch(value) {
                        case 'D':
                        return '개발';
                        case 'M':
                        return '양산';
                        default:
                        return value;
                    }
                } 
                break;
                case 'area_type':
                columnObj["editor"] = {
                    xtype: 'combo',
                    store: nationStore,
                    displayField: 'codeName',
                    valueField: 'systemCode',
                    id: 'col_area_type',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div>{codeName}</div>';
                        }
                    },
                    listeners: {
                        select: function(combo, record) {
                            var value = record.get('system_code');
                            claast_store.getProxy().setExtraParam('egci_code', value);
                            claast_store.load();
                        }
                    }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';
                    switch(value) {
                        case 'K':
                        return '국내';
                        case 'F':
                        return '해외';
                        case 'T':
                        return '대만';
                        default:
                        return value;
                    }
                } 
                break;
                case 'class_code':
                columnObj["editor"] = {
                    xtype: 'combo',
                    store: claast_store,
                    displayField: 'class_code',
                    valueField: 'class_code',
                    id: 'col_class_code',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div>{class_code}</div>';
                        }
                    }
                };
                columnObj["css"] = 'edit-cell';
                columnObj['renderer'] = function(value, meta) {
                    meta.css = 'custom-column';

                    return value;
                } 
                break;
            }
        });
        
       this.createGridCore(arr, option);
        
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	if(this.crudMode=='EDIT') { // EDIT
	    	} else {// CREATE,COPY
	    		this.copyCallback();

	    	}
        	
            if (selections.length) {
                this.modifyUserButton.enable();
            } else {
                this.modifyUserButton.disable();
            }
        });

        
        this.createCrudTab();

        console_logs('>>>> aa', this.grid);

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        
        this.store.load(function(records) {});	
//        this.store.on('load',function (store, records, successful, eOpts ){
//       });
        
        this.grid.on('edit', function(editor, e) {
            var rec = e.record;
            var field = e['field'];
            var edit = editor.editor.items.items;
            var edit_app = '';
            var edit_gubun = '';
            var change_type = '';
            var edit_user_name = '';
            var act_type = '';
            var area_type = '';
            var class_code = '';
            var edit_usr_uid = gm.me().grid.getSelectionModel().getSelection()[0].get('usrast_unique_id');

            for(var i=0; i<edit.length; i++) {
                var dataIndex = edit[i]['dataIndex'];
                var value = edit[i]['value'];

                switch(dataIndex) {
                    case 'gubun':
                    edit_gubun = value;
                    break;
                    case 'app_type':
                    edit_app = value;
                    break;
                    case 'user_name':
                    // console_logs('>>>usrast', Ext.getCmp('col_user_uid').getValue());
                    edit_user_name=value;
                    break;
                    case 'usrast_unique_id':
                    edit_usr_uid=Ext.getCmp('col_user_uid').getValue();
                    if(edit_usr_uid == null || edit_usr_uid < 1) {
                        edit_usr_uid = value;
                    }
                    break;
                    case 'change_type':
                    change_type = value;
                    break;
                    case 'act_type':
                    act_type = value;
                    break;
                    case 'area_type':
                    area_type = value;
                    break;
                    case 'class_code':
                    class_code = value;
                    break;
                }
            }

            var items = gm.me().store.data.items;
            for(var i=0; i<items.length; i++) {
                var app_type = items[i].get('app_type');
                var gubun = items[i].get('gubun');
                var change_type_s = items[i].get('change_type');
                var user_name_s = items[i].get('user_name');
                var act_type_s = items[i].get('act_type');
                var area_type_s = items[i].get('area_type');
                var class_code_s = items[i].get('class_code');

                if(app_type == edit_app && gubun == edit_gubun && change_type_s == change_type && user_name_s == edit_user_name
                    && act_type_s == act_type && area_type_s == area_type && class_code_s == class_code) {
                    Ext.Msg.alert('안내', '중복된 결재라인이 있습니다.', function() {});
                    return;
                }
                // console_logs('>>>>app_gubun', app_type + ' : ' + gubun + ' == ' + this_app + ' : ' + this_gubun);
            }

            var unique_id = gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=newRtgappLine',
                params: {
                    app_type : edit_app,
                    gubun: edit_gubun,
                    usrast_uid: edit_usr_uid,
                    change_type:change_type,
                    rtgapp_uid: unique_id,
                    act_type: act_type,
                    area_type: area_type,
                    class_code: class_code
                },
                success: function(result, request) {
                    gm.me().store.load();
                }, //endofsuccess
                failure: extjsUtil.failureMessage
            }); //endofajax

        });
    },

    addUserView: function(check) {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rtgapp_uid = -1;
        this.ClaastStore.getProxy().setExtraParam({});
        // 수정의 경우 uid 를 들고 간다.
        if(selection != null && selection.length > 0 && check == 'Y') {
            var rec = selection[0];
            console_logs('>>>>uidsdas', rec.get('unique_id_long'));
            rtgapp_uid = rec.get('unique_id_long');
        }

        this.nation_store.load();
        
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
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
            // defaults: {
            //     layout: 'form',
            //     xtype: 'container',
            //     defaultType: 'textfield',
            //     style: 'width: 100%'
            // },
            items: [
                {
                    xtype: 'fieldset',
                    title: '정보입력',
                    frame: true,
                    layout: 'fit',
                    items: [
                        new Ext.form.Hidden({
                            name: 'rtgapp_uid',
                            id: 'rtgapp_uid',
                            value: rtgapp_uid
                        }),
                        new Ext.form.Hidden({
                            name: 'usrast_uid',
                            id: 'usrast_uid',
                        }),
                        new Ext.form.Hidden({
                            name: 'user_id',
                            id: 'user_id',
                        }),
                        {
                            fieldLabel: '사용자',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'user_uid',
                            name:'user_uid',
                            store: this.userStore,
                            displayField:'user_name',
                            valueField: 'unique_id',
                            allowBlank: false,
                            listConfig: {
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{unique_id}">[{user_id}]{user_name}</div>';
                                    }
                            },
                            listeners: {
                                select: function(grid, data) {
                                    Ext.getCmp('usrast_uid').setValue(data.get('unique_id'));
                                    Ext.getCmp('user_id').setValue(data.get('user_id'));
                                }
                            }
                        },{
                            fieldLabel: '유형',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'app_type',
                            name:'app_type',
                            store: appTypeStore,
                            displayField:'name',
                            valueField: 'name',
                            allowBlank: false,
                            listConfig: {
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{name}">{name}</div>';
                                    }
                                }
                        },{
                            fieldLabel: '개발/양산',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'act_type',
                            name:'act_type',
                            store: this.mass_gubun_store,
                            displayField:'codeName',
                            valueField: 'systemCode',
                            allowBlank: false,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {
                                    var value = record.get('system_code');
                                    gm.me().ClaastStore.getProxy().setExtraParam('bottom_class_flag', value);
                                    gm.me().ClaastStore.load();
                                }
                            }
                        },{
                            fieldLabel: '지역',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'area_type',
                            name:'area_type',
                            store: this.nation_store,
                            displayField:'codeName',
                            valueField: 'systemCode',
                            allowBlank: false,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{value}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {
                                    var value = record.get('system_code');
                                    gm.me().ClaastStore.getProxy().setExtraParam('egci_code', value);
                                    gm.me().ClaastStore.load();
                                }
                            }
                        },{
                            fieldLabel: 'SO_TYPE',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'so_type',
                            name:'so_type',
                            store: this.ClaastStore,
                            displayField:'class_code',
                            valueField: 'class_code',
                            allowBlank: false,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{class_code}">{class_code}</div>';
                                }
                            }
                        },{
                            fieldLabel: '결재부서',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'gubun',
                            name:'gubun',
                            store: appGubunStore,
                            displayField:'name',
                            valueField: 'value',
                            allowBlank: false,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{value}">{name}</div>';
                                }
                            }
                        },{
                            fieldLabel: '결재조건',
                            xtype: 'combo',
                            anchor: '100%',
                            id:'change_type',
                            name:'change_type',
                            store: changeTypeStore,
                            displayField:'name',
                            valueField: 'value',
                            allowBlank: false,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{value}">{name}</div>';
                                }
                            }
                        }
                    ]
                },
                
            ]
        });

        var title = '신규등록';
        if(check == 'Y') {
            title = '수정';
        }

       var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: title,
                width: 350,
                height: 300,
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

                                Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=newRtgappLine',
                                params: val,
                                success: function(result, request) {
                                    if(prWin) {
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
                    handler: function() {
                        if(prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        });
        prWin.show();
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        console_logs('>>>>> ddd', record);
        var act_type = record.get('act_type');
            area_type = record.get('area_type');

            Ext.getCmp('col_user_uid').setValue(record.get('usrast_unique_id'));
            
            this.ClaastStore.getProxy().setExtraParam('bottom_class_flag', act_type);
            this.ClaastStore.getProxy().setExtraParam('egci_code', area_type);
            this.ClaastStore.load();
    },

    userStore: Ext.create('Mplm.store.UserStore', {}),
    mass_gubun_store : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'MASS_GUBUN_TYPE'}),
    nation_store     : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'NATION'}),
    ClaastStore  : Ext.create('Mplm.store.ClaastStore', {identification_code: 'SO_TYPE'}),
});
