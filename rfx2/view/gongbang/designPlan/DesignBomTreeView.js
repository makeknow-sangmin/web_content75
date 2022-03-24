Ext.require([
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);


Ext.define('Rfx2.view.gongbang.designPlan.DesignBomTreeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'design-bom-tree-view',
    order_com_unique: null,
    initComponent: function () {

        this.multiSortHidden = true;
        this.stateCodeStore.load();

        this.columns.splice(0, 0, {
            //text: '유형',
            menuDisabled: true,
            sortable: false,
            useYn: true,
            xtype: 'actioncolumn',
            align: 'center',
            style: 'align:center;',
            width: 30,
            items: [{
                getClass: function (v, meta, rec) {
                    if (rec.get('standard_flag') == 'A') {
                        return 'assembly-col';
                    } else {
                        return 'part-col';
                    }
                },
                getTip: function (v, meta, rec) {
                    if (rec.get('standard_flag') == 'A') {
                        return 'Assembly';
                    } else {
                        return 'Part';
                    }
                },
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex),
                        action = (rec.get('standard_flag') == 'A' ? 'Assembly' : 'Part');

                    Ext.Msg.alert(action, action);
                }
            }]
        });

        // 검색툴바 필드 초기화
        this.initSearchField();

        // 검색툴바 생성
        // var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        // var commandToolbar = this.createCommandToolbar();

        // console_logs('this.fields', this.fields);


        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            //console_logs('columnObj', columnObj);
            switch (dataIndex) {
                case 'pa_pl_no':
                case 'pj_code':
                case 'making_quan':
                case 'ref_quan':
                case 'reserved_double1':
                    columnObj["width"] = 0;
                    break;
//                case 'req_info':
//                case 'reserved_varchar1':
                case 'bm_quan':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
                case 'notify_flag':
                    columnObj['renderer'] = function (value, meta) {
                        switch (value) {
                            case 'Y':
                                return '사내구매';
                            case 'N':
                                return '외주구매';
                        }
                    }
                    break;
            }

        });


        //console_logs('columns', this.columns);

        switch (vCompanyReserved4) {
            case 'APM01KR':
                this.createStoreSimple({
                    modelClass: 'Rfx.model.PartLine',
                    pageSize: gm.pageSize,/*pageSize*/
                    sorters: [{
                        property: 'pl_no',
                        direction: 'asc'
                    }]
                }, {
                    groupField: 'sp_code'
                });
                break;
            default:
                gm.pageSize = 100;
                this.createStore('Rfx.model.PartLine', [{
                        property: 'pl_no',
                        direction: 'ASC'
                    }],
                    gm.pageSize /* pageSize */
                    // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
                    // Orderby list key change
                    // ordery create_date -> p.create로 변경.
                    , {
                        creator: 'a.creator',
                        unique_id: 'a.unique_uid'
                    }
                    // //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                    , ['assymap']
                );
                break;
        }

        var buttonToolbar1 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                vCompanyReserved4 == 'HSGC01KR' ? this.searchAction : '',
                vCompanyReserved4 == 'KWLM01KR' ? this.searchAction : '',
                this.addPartAction,
                this.importAssyAction,
                '-',
                this.editPartAction,
                this.removePartAction,
                this.addMyCartAction,
                '-',
                this.copyPartAction,
                this.pastePartAction,
                '-',
                vCompanyReserved4 == 'HSGC01KR' ? '' : this.printPDFAction,
                // '-',
                // vCompanyReserved4 == 'KWLM01KR' ? this.subContractAction : '',
                // vCompanyReserved4 == 'KWLM01KR' ? this.AttachFileViewAction : '',
                // vCompanyReserved4 == 'KWLM01KR' ? this.RemoveFileViewAction : '',
                // vCompanyReserved4 == 'KWLM01KR' ? this.readHistoryAction : '',
                '->',
                // this.expandAllTreeAction
//                {
//                    xtype: 'component',
//                    html: "자재복사:",
//                    style: 'align:right;'
//                },
                {
                    xtype: 'component',
                    style: 'margin-right:5px;width:18px;text-align:right',
                    id: gu.id('childCount'),
                    style: 'color:#094C80;align:right;',
                    html: '--'
                }

            ]
        });

        var buttonToolbarKL = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                '',
                vCompanyReserved4 == 'KWLM01KR' ? this.subContractAction : '',
                vCompanyReserved4 == 'KWLM01KR' ? this.AttachFileViewAction : '',
                vCompanyReserved4 == 'KWLM01KR' ? this.RemoveFileViewAction : '',
                vCompanyReserved4 == 'KWLM01KR' ? this.readHistoryAction : ''
            ]
        });

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                this.addSearchField({
                    type: 'dateRange',
                    field_id: 'create_date',
                    text: "생성날짜",
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });
                this.addSearchField('item_name');
                this.addSearchField('specification');
                this.addSearchField('user_name');
                break;
            default:
                this.addSearchField('reserved1');
                this.addSearchField('reserved2');
                this.addSearchField('reserved3');
                break;
        }

        var searchToolbar = this.createSearchToolbar();

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            // id: 'group',
            // ftype: 'groupingsummary',
            /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
            groupHeaderTpl: '<font color=#003471>{name}</font>'
        });

        var option = {
            features: [groupingFeature]
        };

        var arr = [];
        arr.push(buttonToolbar1, this.buttonToolbar2);

        switch (vCompanyReserved4) {
            case 'HSGC01KR':
                this.createGrid([buttonToolbar1, this.buttonToolbar2, searchToolbar], {
                    width: '60%'
                });
                break;
            case 'APM01KR':
                this.createGridCore(arr, option), {
                    width: '60%'
                };
            case 'KWLM01KR':
                this.createGrid([buttonToolbar1, buttonToolbarKL, this.buttonToolbar2, searchToolbar], {
                    width: '60%'
                });
                break;
                break;
            default:
                this.createGrid([buttonToolbar1, this.buttonToolbar2], {
                    width: '60%'
                });
                break;
        }

        // if(vCompanyReserved4 == 'HSGC01KR') {
        //     this.createGrid([buttonToolbar1 ,this.buttonToolbar2, searchToo  lbar], {
        //         width: '60%'
        //     });
        // } else if(vCompanyReserved4 == 'APM01KR') {
        //     this.createGrid([buttonToolbar1 ,this.buttonToolbar2], {
        //         width: '60%'
        //     });
        // } else {
        //     this.createGrid([buttonToolbar1 ,this.buttonToolbar2], {
        //         width: '60%'
        //     });
        // }

        this.createCrudTab();

        //결재사용인 경우 결재 경로 store 생성
        if (this.useRouting == true) {

            this.rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});

        }

        this.setGridOnCallback(function (selections) {
            console_logs('setGridOnCallback selections', selections);
            if (selections.length) {
                rec = selections[0];

                gm.me().assymapUidbom = rec.get('unique_uid');
                gm.me().assymapPcr_div = rec.get('request_comment');
                gm.me().assymapBmQuan = rec.get('bm_quan');
                gm.me().assymapPlNo = rec.get('pl_no');
                gm.me().assyId = rec.get('hier_pos');
                gm.me().assylevel = rec.get('reserved_integer1');
                gUtil.enable(gm.me().addPcsPlanAction);
                gUtil.enable(gm.me().editPartAction);
                gUtil.enable(gm.me().copyPartAction);

                gUtil.enable(gm.me().removePartAction);
                if (vCompanyReserved4 != 'HSGC01KR') {
                    gUtil.enable(gm.me().addMyCartAction);
                }
                if (vCompanyReserved4 == 'KWLM01KR') {
                    gUtil.enable(gm.me().subContractAction);
                    gUtil.enable(gm.me().AttachFileViewAction);
                    gUtil.enable(gm.me().RemoveFileViewAction);
                    gUtil.enable(gm.me().readHistoryAction);
                }
            } else {
                gUtil.disable(gm.me().addPcsPlanAction);
                gUtil.disable(gm.me().editPartAction);
                gUtil.disable(gm.me().copyPartAction);
                gUtil.disable(gm.me().removePartAction);
                gUtil.disable(gm.me().addMyCartAction);
                if (vCompanyReserved4 == 'KWLM01KR') {
                    gUtil.disable(gm.me().subContractAction);
                    gUtil.disable(gm.me().AttachFileViewAction);
                    gUtil.disable(gm.me().RemoveFileViewAction);
                    gUtil.disable(gm.me().readHistoryAction);
                }
            }


        });


        switch (vCompanyReserved4) {
            case 'HSGC01KR' :
                Ext.apply(this, {
                    layout: 'border',
                    items: [this.createWest(), this.createCenter(), this.crudTab]
                });
                break;
            case 'KWLM01KR' :
                this.store.getProxy().setExtraParam('attach_file', true);
                Ext.apply(this, {
                    layout: 'border',
                    items: [this.createWest(), this.createCenter(), this.fileCrudGrid()]
                });
                break;
            default:
                Ext.apply(this, {
                    layout: 'border',
                    items: [this.createWest(), this.createCenter()]
                });
        }

        this.commonStandardStore.load(function (records) {
            for (var i = 0; i < records.length; i++) {
                var obj = records[i];
                // console_logs('commonStandardStore2['+i+']=', obj);
                gm.me().standard_flag_datas.push(obj);
            }
        });
        var real_array = null;
        //Default Value 가져오기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',
            params: {
                paramName: 'CommonProjectAssy'
            },
            success: function (result, request) {
                console_log('success defaultGet');
                var id = result.responseText;
                var arr = id.split(';');
                var ac_uid = arr[0];


                gm.me().cloudprojectStore.load(function (records) {
                    if (records != null && records.length > 0) {
                        // console_logs('gm.me().cloudprojectStore.load records', records);
                        for (var i = 0; i < records.length; i++) {
                            var rec = records[i];
                            // console_logs('record ac_uid', rec.get('unique_id'));
                            if (rec.get('unique_id') == ac_uid) {
                                var combo = gu.getCmp('projectcombo');
                                //console_logs('combo', combo);
                                if (combo != undefined) {
                                    combo.select(rec);
                                    gm.me().selectProjectCombo(rec);
                                }
                            }
                        }

                    }//

                    var array = gm.me().array;

                    var pageParameters = Ext.urlDecode(window.location.search.substring(1));

                    if (array != null && array.length > 0 && pageParameters != undefined && pageParameters != null) {
                        for (var i = 0; i < array.length; i++) {
                            var unique_uid = array[i].data.unique_uid;
                            var parent_uid = pageParameters['parent_uid'];
                            if (unique_uid == parent_uid) {
                                real_array = array[i];
                                console_logs('===arr', array[i]);
                                gm.me().assyGrid.getSelectionModel().select(array[i], false, false);
                            }
                        }
                    }

                    if (vCompanyReserved4 == 'KWLM01KR') {
                        gm.me().selectedPjUid = records[0].get('unique_id');
                        if (gm.me().selectedPjUid == null || gm.me().selectedPjUid == undefined || gm.me().selectedPjUid.length < 1) {
                            gm.me().selectedPjUid = null;
                        }
                        if (pageParameters['pj_uid'] != null && pageParameters['pj_uid'] != undefined && pageParameters['pj_uid'].length > 0) {
                            gm.me().selectedPjUid = pageParameters['pj_uid'];
                            gm.me().AllattachedFileStore.getProxy().setExtraParam('group_code', pageParameters['pj_uid']);
                        } else {
                            try {
                                gm.me().AllattachedFileStore.getProxy().setExtraParam('group_code', gm.me().selectedPjUid);
                            } catch (error) {
                                // gm.me().AllattachedFileStore.getProxy().setExtraParam('group_code', null);
                            }
                        }
                        try {
                            if (pageParameters['pj_uid'] != null && pageParameters['pj_uid'] != '' && gm.me().selectedPjUid != null && gm.me().selectedPjUid != '') {
                                gm.me().AllattachedFileStore.load();
                            }
                        } catch (error) {

                        }
                    }
                });
            },
            failure: function (result, request) {
                console_log('fail defaultGet');
            } /*extjsUtil.failureMessage*/
        });


        this.refreshAssyCopy();
        this.refreshPartCopy();

        this.callParent(arguments);

        gMain.addTabFileAttachGridPanel('도면 업로드', 'FILE_ATTACH', {NO_INPUT: null}, function (selections) {
                if (selections.length) {
                    var rec = selections[0];
                } else {

                }
            },
            gMain.selectedMenuId + 'designFileAttach',
            {
                selectionchange: function (sm, selections) {
                    var fileRecord = (selections != null && selections.length > 0) ? selections[0] : null;
                    console_logs(gMain.selectedMenuId + 'designFileAttach' + 'delButton');

                    var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
                    if (fileRecord == null) {
                        gUtil.disable(delButton);
                    } else {
                        gUtil.enable(delButton);
                    }

                }
            }
        );

    },

    refreshAssyCopy: function () {

        //복사한 Assembly 정보읽기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=readCopyBomAssembly',
            params: {},
            success: function (response, request) {

                var o = Ext.JSON.decode(response.responseText);

                var count = o['count'];
                var assyline = o['datas'];
                if (count > 0) {
                    console_logs('result datas assyline', assyline);
                    var o = Ext.create('Mplm.model.TreeModel', assyline);

                    gm.me().selected_tree_record = o;
                } else {
                    gm.me().selected_tree_record = null;
                }
                gm.me().setCopiedAssyQuan(/*assyline['part_path']*/);
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax
    },

    refreshPartCopy: function () {
        //복사한 파트정보 읽기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=readCopyBomPart',
            params: {},
            success: function (response, request) {

                var o = Ext.JSON.decode(response.responseText);

                var count = o['count'];
                var uids = o['datas'];
                if (count > 0) {
                    console_logs('result uids', uids);
                    gm.me().setCopiedPartQuan(uids.length);
                }
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax

    },

    ////
    ////**************************************************** END OF initComponent ************************************
    ////
    setRelationship: function (relationship) {
    },

    createCenter: function () {
        this.inpuArea = Ext.widget({
            title: 'Excel Form',
            xtype: 'form',
            // disabled: true,
            collapsible: false,
            border: false,
            layout: 'fit',
            // fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden;
            // background-color: #EAEAEA; background-image:
            // none;border-bottom: #999999 1px solid;border-left: #999999
            // 1px solid;border-right: #999999 1px solid;border-top: #999999
            // 1px solid;',
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [{
                    iconCls: 'search',
                    text: CMD_INIT,
                    handler: function () {
                        Ext.MessageBox.show({
                            title: '초기화 확인',
                            msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                var result = MessageBox.msg('{0}', btn);
                                if (result == 'yes') {
                                    var o = gu.getCmp('bom_content');
                                    o.setValue(bomTableInfo);
                                }
                            }
                        });

                    }
                }, '-',
                    {
                        iconCls: 'textfield',
                        text: '모두 지우기',
                        handler: function () {
                            Ext.MessageBox.show({
                                title: '모두 지우기',
                                msg: '모두 지우시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function (btn) {
                                    var result = MessageBox.msg('{0}', btn);
                                    if (result == 'yes') {
                                        var o = gu.getCmp('bom_content');
                                        o.setValue('');
                                    }
                                }
                            });

                        }
                    }, '-', {
                        iconCls: 'application_view_tile',
                        text: '사전검증',
                        handler: function () {
                            var bom_content = gu.getCmp('bom_content');

                            var htmlContent = bom_content.getValue();

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
                                params: {
                                    pj_code: gm.me().selectedPjCode,
                                    assy_code: gm.me().selectedAssyCode,
                                    pj_uid: gm.me().selectedPjUid,

                                    parent: gm.me().selectedChild,
                                    parent_uid: gm.me().selectedAssyUid,

                                    pj_name: Ext.JSON.encode(gm.me().selectedPjName),
                                    assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
                                    htmlContent: htmlContent
                                },
                                success: function (result, request) {
                                    var val = result.responseText;
                                    // console_logs("val", val);
                                    // var htmlData = Ext.decode(val);
                                    // console_logs("htmlData", val);

                                    // htmlContent=func_replaceall(htmlContent,'<table
                                    // border="0"','<table border="1"');

                                    bom_content.setValue(val);

                                },
                                failure: extjsUtil.failureMessage
                            });


                        }
                    }, '-', {
                        text: '디플로이',
                        iconCls: 'save',
                        handler: function () {
                            var bom_content = gu.getCmp('bom_content');

                            var htmlContent = bom_content.getValue();

                            gu.getCmp('bom_content').setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
                                params: {
                                    pj_code: gm.me().selectedPjCode,
                                    assy_code: gm.me().selectedAssyCode,
                                    pj_uid: gm.me().selectedPjUid,
                                    parent: gm.me().selectedChild,
                                    parent_uid: gm.me().selectedAssyUid,
                                    pj_name: Ext.JSON.encode(gm.me().selectedPjName),
                                    assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
                                    htmlContent: htmlContent
                                },
                                success: function (result, request) {

                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs('jsonData', jsonData);

                                    var result = jsonData['result'];

                                    if (result == 'true' || result == true) { // 정상이면
                                        // Reload.
                                        if (gm.me().selectedAssyDepth == 1) {
                                            gm.me().editAssyAction.disable();
                                            gm.me().removeAssyAction.disable();
                                            gm.me().copyAssemblyAction.disable();
                                        } else {
                                            gm.me().editAssyAction.enable();
                                            gm.me().removeAssyAction.enable();
                                            gm.me().copyAssemblyAction.enable();
                                        }
                                        gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                                        gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                                        gm.me().store.getProxy().setExtraParam('ac_uid', gm.me().selectedPjUid);
                                        gm.me().store.load(function (records) {


                                            gm.me().selectAssy(records[0]);
                                            gm.me().setCopiedPartQuan(records.length);


                                            gm.me().setMakeTable(records);

                                        });

                                    } else {
                                        Ext.MessageBox.alert('오류', '입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
                                    }
                                    gu.getCmp('bom_content').setLoading(false);
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    }, '-',
                    '->'
                    /*
                     * , addExcelWithProject, '-',excel_sample
                     */
                ]
            }],
            items: [{
                // fieldLabel: 'board_content.',
                // x: 5,
                // y: 0 + 2*lineGap,
                id: gu.id('bom_content'),
                name: 'bom_content',
                xtype: 'htmleditor',
                width: '100%',
                height: '100%',
                border: false,
                enableColors: false,
                enableAlignments: false,
                anchor: '100%',
                listeners: {
                    initialize: function (editor) {
                        console_logs('editor', editor);
                        var styles = {
                            // backgroundColor : '#193568'
                            // ,border : '1px dashed yellow'
                            // ,color : '#fff'
                            // ,cursor : 'default'
                            // ,font : 'bold '+ 10 +'px Trebuchet MS'
                            // ,height : '10px'
                            // ,left : '10'
                            // ,overflow : 'hidden'
                            // ,position : 'absolute'
                            // ,textAlign : 'center'
                            // ,top : '10'
                            // ,verticalAlign : 'middle'
                            // ,width : '10'
                            // ,zIndex : 60
                        };


                        Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
                    }
                    /*
                     * , afterrender: function() {
                     * this.wrap.setStyle('border', '0'); }
                     */
                },
                value: this.initTableInfo


            }]
        });

        var myCartColumn = [];
        var myCartFields = [];

        for (var i = 0; i < this.columns.length; i++) {

            this.columns[i].id = 'uid-' + Math.round(Math.random() * 100000000 * 16);

            switch (this.columns[i]['dataIndex']) {
                case 'pa_pl_no':
                case 'pj_code':
                //case 'reserved_double1':
                case 'making_quan': {
                    var nO = gUtil.copyObj(this.columns[i]);
                    nO["width"] = 60;
                    myCartColumn.push(nO);
                }
                    break;

                //case 'req_info':
                case 'statusHangul':
                case 'sales_price':
                case 'static_sales_price':
                case 'goodsout_quan':
                case 'reserved_varchar1':
                case 'ref_quan':
                case 'comment':
                case 'description':
                case 'remark':
                // case 'model_no':
                case 'sp_code':
                case 'route_type':
                    //case 'user_name':
                    break;
                case 'reserved_double1': {
                    var columnObj = gUtil.copyObj(this.columns[i]);
                    columnObj["width"] = 60;
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    myCartColumn.push(columnObj);

                }
                    break;
                case 'bm_quan':
                case 'pl_no': {
                    var columnObj = gUtil.copyObj(this.columns[i]);
                    columnObj["canEdit"] = false;
                    columnObj["editor"] = null;
                    columnObj["css"] = null;
                    columnObj["tdCls"] = null;
                    columnObj["renderer"] = null;
                    columnObj["style"] = "text-align:center";
                    myCartColumn.push(columnObj);
                }

                    break;
                default:
                    myCartColumn.push(this.columns[i]);
            }
        }

        if (vCompanyReserved4 == 'APM01KR') {
            myCartColumn.splice(9, 0, {
                align: "right",
                dataIndex: "reserved_double1",
                dataType: "string",
                sortable: true,
                style: "text-align:center; background-color:#0271BC;",
                text: "요청",
                width: 80,
                editable: true,
                editor: {},
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                renderer: function (value, meta) {
                    meta.css = 'custom-column';
                    return value;
                }
            })
        }


        var selModelMycart = Ext.create("Ext.selection.CheckboxModel", {});

        var myCartModel = Ext.create('Rfx.model.MyCartLine', {
            fields: this.fields
        });

//        this.myCartStore = new Ext.data.Store({
//            pageSize: 100,
//            model: 'Rfx.model.MyCartLine'
//        });
//

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model: myCartModel,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });

        console_logs('==>myCartColumn', myCartColumn);
        this.gridMycart = Ext.create('Rfx.base.BaseGrid', {
            title: 'My Cart',
            store: this.myCartStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelMycart,
            stateId: 'gridMycart' + /* (G) */ vCUR_MENU_CODE,
            // height: getCenterPanelHeight(),

            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.searchCartAction, '-', this.removeCartAction, '-', this.purchase_requestAction, '-', this.req_dateAction,
                    /*'-',
                        this.process_requestAction,'-',*/
                    '->',
                    {
                        xtype: 'component',
                        style: 'margin-right:5px;width:18px;text-align:right',
                        style: 'color:#094C80;align:right;',
                        html: '필요수량 = (Assy * BOM수량) - 기요청 - 반려'
                    }
                ]
            }

            ],
            columns: /* (G) */ myCartColumn,
            plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                markDirty: false,
                enableTextSelection: true,
                getRowClass: function (record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function (gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function (el) {

                        }, this);

                    },
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        this.gridMycart.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().onMygridSelection(selections);
            }
        });


        this.gridMycart.on('edit', function (editor, e) {
            // commit the changes right after editing finished

            var rec = e.record;
            console_logs('rec', rec);
            var unique_uid = rec.get('unique_uid');
            var reserved_double1 = rec.get('reserved_double1');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
                params: {
                    assymap_uid: unique_uid,
                    pr_qty: reserved_double1,
                    child: rec.get('unique_id_long')
                },
                success: function (result, request) {

                    var result = result.responseText;
                    // console_logs("", result);

                },
                failure: extjsUtil.failureMessage
            });

            rec.commit();
        });

        this.myCartStore.load(function (records) {
            console_logs('myCartStore load records', records);
            if (records != null) {
                for (var i = 0; i < records.length; i++) {
                    var o = records[i];
                    //var reserved_double1 = o.get('reserved_double1');
                    //if(reserved_double1 == null || reserved_double1<1) {
                    var new_pr_quan = o.get('new_pr_quan');
                    o.set('reserved_double1', new_pr_quan);
                    //}
                }
            }


        });
        /*******************************************************************************
         * Mycart Grid End
         */


        //Define Remove Action
        this.removeActionFile = Ext.create('Ext.Action', {
            itemId: 'removeButtonFile',
            glyph: 'xf00d@FontAwesome',//iconCls: 'remove',
            text: CMD_DELETE,
            disabled: true,
            handler: function (widget, event) {

                var uploadPanel = gm.me().fileGrid;
                console_log(uploadPanel);
                var selections = uploadPanel.getSelectionModel().getSelection();
                if (selections) {

                    for (var i = 0; i < selections.length; i++) {
                        var rec = uploadPanel.getSelectionModel().getSelection()[i];
                        var fileobject_uid = rec.get('fileobject_uid');

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/fileObject.do?method=destroy',
                            params: {
                                fileobject_uid: fileobject_uid
                            },
                            success: function (result, request) {

                            }
                        });


                    }
                    uploadPanel.store.remove(selections);
                }
            }
        });

        //Define send action
        this.sendFileAction = Ext.create('Ext.Action', {
            itemId: 'sendButtonFile',
            glyph: 'xf1d8@FontAwesome',//iconCls: 'remove',
            text: '파일 전송',
            disabled: true,
            handler: function (widget, event) {

                var uploadPanel = gm.me().fileGrid;
                console_log(uploadPanel);
                var selections = uploadPanel.getSelectionModel().getSelection();

                var mail_detail = ''; // "수신: " +  supplier_name + '[' + supplier_code + '] ' + sales_person1_name + ' 님 <br /><br />'
                mail_detail = mail_detail + '첨부와 같이 파일 전송하오니 업무에 참조하여 주시기 바랍니다.'
                mail_detail = mail_detail + "<br /><br /><br />본 메일은 발신전용이오니 아래의 연락처에 문의하세요.<br /><br />";
                mail_detail = mail_detail + "문의처: " + vCUR_DEPT_NAME + ', ' + vCUR_USER_NAME + ' (' + vCUR_EMAIL + ')<br />';

                if (selections) {
                    var arrFile = [];
                    var arrFileUid = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = uploadPanel.getSelectionModel().getSelection()[i];
                        console_logs('file rec', rec);
                        var fileobject_uid = rec.get('fileobject_uid');
                        var file_name = rec.get('file_name');
                        arrFile.push(file_name);
                        arrFileUid.push(fileobject_uid);

                    }

                    mail_detail = mail_detail + "별첨 파일: 총 " + arrFile.length + '매<br><ol>';
                    for (var i = 0; i < arrFile.length; i++) {
                        mail_detail = mail_detail + '<li>' + arrFile[i] + '</li>';
                    }
                    mail_detail = mail_detail + '</ol>';
                    // form create
                    var mailForm = Ext.create('Ext.form.Panel', {
                        id: 'formPanelSendmail',
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: [
                            {
                                id: gu.id('supplier_information'),
                                field_id: 'supplier_code',
                                name: 'supplier_code',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: gm.me().supplierStore,
                                displayField: 'supplier_name',
                                valueField: 'supplier_code',
                                sortInfo: {field: 'supplier_name', direction: 'ASC'},
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 1,
                                emptyText: '전송처 입력',
                                width: 200,
                                minChars: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{supplier_code}">{supplier_name} - {sales_person1_email_address}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        console_logs('Selected Value : ', combo.getValue());
                                        console_logs('record', record);
                                        //selectedSupObj = record;
                                        var sales_person1_email_address = record.get('sales_person1_email_address');
                                        var sales_person1_fax_no = record.get('sales_person1_fax_no');
                                        var sales_person1_mobilephone_no = record.get('sales_person1_mobilephone_no');
                                        var sales_person1_name = record.get('sales_person1_name');
                                        var sales_person1_telephone_no = record.get('sales_person1_telephone_no');
                                        var supplier_code = record.get('supplier_code');
                                        var supplier_name = record.get('supplier_name');


                                        gu.getCmp('mailTo').setValue(sales_person1_email_address);

                                        var subject = '파일 전송합니니다. (' + vCompanyBrand + '->' + supplier_name + ')';
                                        gu.getCmp('mailSubject').setValue(subject);

                                        //  			        			store.getProxy().setExtraParam('supplier_code', supplier_code);
                                        //  					     		store.load({});
                                        //gm.me().sendFileAction.enable();


                                    }//endofselect

                                }//endof listener
                            },
                            {
                                id: gu.id('mailTo'),
                                name: 'mailTo',
                                allowBlank: false,
                                value: '',
                                emptyText: '수신 E-Mail',
                                anchor: '100%'  // anchor width by percentage
                            },
                            {
                                id: gu.id('mailSubject'),
                                name: 'mailSubject',
                                allowBlank: false,
                                value: '파일 전송합니니다.',
                                anchor: '100%'  // anchor width by percentage
                            },
                            {
                                name: 'mailContents',
                                allowBlank: false,
                                xtype: 'htmleditor',
                                value: mail_detail,
                                height: 240,
                                anchor: '100%'
                            }
                        ]
                    });

                    var win = Ext.create('ModalWindow', {
                        title: '공급사에 메일 전송',
                        width: 600,
                        height: 400,
                        items: mailForm,
                        buttons: [{
                            text: '메일전송 ' + CMD_OK,
                            handler: function () {
                                var form = Ext.getCmp('formPanelSendmail').getForm();
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    //console_logs('val', val);

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/collab/mail.do?method=sendAttachedFile',
                                        params: {
                                            mail_to: val['mailTo'],
                                            subject: val['mailSubject'],
                                            content: val['mailContents'],
                                            fileListName: arrFile,
                                            fileListUid: arrFileUid
                                        },
                                        success: function (result, request) {
                                            if (win) {
                                                win.close();
                                            }//
                                            Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                                        },
                                        failure: extjsUtil.failureMessage
                                    });//ajaxrequest

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }

                            }//endofhandler
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (win) {
                                    win.close();
                                }//endofwin
                            }//endofhandler
                        }//CMD_CANCEL
                        ]//buttons
                    });
                    win.show();

                } //endof selections
            }
        });

        this.supplierStore = Ext.create('Mplm.store.SupastStore', {hasNull: false});

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            hidden: !this.useDocument,
            selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope: this.fileGrid,
                        handler: function () {


                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + gm.me().selectedPjUid;

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일 첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

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
                    text: 'UID',
                    width: 100,
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '날짜',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });


        this.fileGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections != null && selections.length > 0) {
                    gm.me().removeActionFile.enable();
                    gm.me().sendFileAction.enable();
                } else {
                    gm.me().removeActionFile.disable();
                    gm.me().sendFileAction.disable();
                }

            }
        });

        var selrepositgrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.repositGrid = Ext.create('Ext.grid.Panel', {
            title: '저장소',
            store: this.repositFileStore,
            collapsible: true,
            multiSelect: true,
            hidden: !this.useDocument,
            selModel: selrepositgrid,
            stateId: 'repositGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope: this.repositGrid,
                        handler: function () {

                            var url = CONTEXT_PATH + '/fileObject.do?method=repositMulti&group_code=' + gm.me().selectedChild;

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일 첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

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
                        id: gu.id('ftp_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '총수량 : 0'
                    }
                ]
            }

            ],
            columns: [
                {
                    text: '등록자',
                    width: 100,
                    sortable: true,
                    dataIndex: 'uid'
                },
                {
                    text: '파일명',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name',
                },
                {
                    text: '날짜',
                    width: 160,
                    sortable: true,
                    dataIndex: 'date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'size'
                }]
        });


        this.repositGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections != null && selections.length > 0) {
                    gm.me().removeActionFile.enable();
                    gm.me().sendFileAction.enable();
                } else {
                    gm.me().removeActionFile.disable();
                    gm.me().sendFileAction.disable();
                }

            }
        });

        this.grid.setTitle('BOM 목록');

        this.bomAll =
            Ext.create('Rfx2.view.grid.BomGridHeavy', {
                id: 'DBM7TREE-Assembly',
                title: '전체 BOM',// cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.bomListStore,
                layout: 'fit',
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.bomListStore,
                    displayInfo: true,
                    displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                    emptyMsg: "표시할 항목이 없습니다."
                    , listeners: {
                        beforechange: function (page, currentPage) {

                        }
                    }

                }),
                dockedItems: [/*{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [{
                        xtype:'component',
                        width: 400,
                        style: 'font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                    }]},*/{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [{
                        xtype: 'component',
                        html: "전체 BOM List",
                        width: 400,
                        style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'

                    }]
                }] //dockedItems of End
            });//productGrid of End

        if (this.ftpSetting) {
            this.bomTab = Ext.widget('tabpanel', {
                layout: 'border',
                title: 'BOM',
                border: false,
                tabPosition: 'top',
                layoutConfig: {
                    columns: 2,
                    rows: 1
                },

                items: [this.grid, this.fileGrid, this.repositGrid, this.inpuArea]
            });
        } else {
            this.bomTab = Ext.widget('tabpanel', {
                layout: 'border',
                title: 'BOM',
                border: false,
                tabPosition: 'top',
                layoutConfig: {
                    columns: 2,
                    rows: 1
                },

                items: [this.grid, this.bomAll]
            });
        }

        this.mycartTab = Ext.widget('tabpanel', {
            layout: 'border',
            title: 'My Cart',
            border: false,
            tabPosition: 'top',
            layoutConfig: {
                columns: 1,
                rows: 1
            },
            items: [this.gridMycart]
        });
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '70%',
            tabPosition: 'bottom',
            items: [this.bomTab, this.mycartTab]
        });

        return this.center;

    },

    // ----------------------- END OF CENTER --------------------

    createWest: function () {

        Ext.tip.QuickTipManager.init();

        this.cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});

        if (this.requestedProjectOnly == true) {//설계요청한 BOM 만
            this.cloudProjectTreeStore.getProxy().setExtraParam('design_state', 'ING');
        }

        this.removeValveAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: 'Valve 삭제하기',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '삭제하기',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteValveConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        var selValveNo = Ext.create("Ext.selection.CheckboxModel", {});

        this.refreshAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '리프레쉬',
            tooltip: '리로드',
            disabled: false,
            handler: function () {
                gm.me().refreshValve();
            }

        });
        //Valve grid
        this.gridValve = Ext.create('Ext.grid.Panel', {
            title: 'Valve NO.',
            store: this.valveNoStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selValveNo,
            stateId: 'gridValve' + /* (G) */ vCUR_MENU_CODE,

            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.refreshAction,
                    this.removeValveAction, '->',
                    {
                        xtype: 'component',
                        id: gu.id('valve_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '총수량 : 0'
                    }
                ]
            }

            ],
            columns: [
                {
                    text: '코드',
                    width: 100,
                    sortable: true,
                    dataIndex: 'parent_item_code'
                },
                {
                    text: '품명',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'item_name'
                },
                {
                    text: 'Valve No.',
                    width: 80,
                    sortable: true,
                    dataIndex: 'specification'
                },
                {
                    text: '상태',
                    width: 80,
                    sortable: true,
                    dataIndex: 'status',
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        if (value == 'null' || value == null) {
                            return '???';
                        } else {
                            for (var i = 0; gm.me().stateCodeStore.getCount(); i++) {
                                var rec = gm.me().stateCodeStore.getAt(i);
                                //console_logs('---------------> rec', rec);
                                if (rec == null) {
                                    return value;
                                } else {
                                    var systemCode = rec.get('systemCode');
                                    if (systemCode == value) {
                                        return rec.get('codeName');
                                    }
                                }
                            }
                            return value;
                        }
                    }
                },
            ],
            viewConfig: {
                stripeRows: true,
                markDirty: false,
                enableTextSelection: true,
                getRowClass: function (record, index) {

                    // console_logs('record', record);
                    var c = record.get('status');
                    console_logs('status', c);

                    switch (c) {
                        case 'BM':
                            return 'white-row';
                        case 'CR':
                            return 'yellow-row';
                        case 'I':
                            return 'magenta-row';
                        case 'N':
                            return 'cyan-row';
                        case 'P':
                            return 'orange-row';
                        case 'R':
                            return 'grey-row';
                        case 'S':
                        case 'DE':
                            return 'red-row';
                        case 'W':
                            return 'blue-row';
                        case 'Y':
                            return 'green-row';
                        default:
                            return 'black-row';
                    }

                }
            }
        });
        this.gridValve.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().ongridValveSelection(selections);
            }
        });

        //Designbontree limit 설정

        this.cloudprojectStore.getProxy().setExtraParam('limit', 200);

        if (this.requestedProjectOnly == true) {//설계요청한 BOM 만
            this.cloudprojectStore.getProxy().setExtraParam('design_state', 'ING');
        }


        // Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a
        // tree.TreePanel
        this.buyerStore.getProxy().setExtraParam('project_only', 'T');

        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            // mode: this.selMode == 'SINGLE'? 'SINGLE' : 'multi',
            // checkOnly: this.selCheckOnly == true ? true : false,
            // allowDeselect: this.selAllowDeselect == false ? false : true

        });

        var displayField_pj = null;
        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                displayField_pj = 'item_name';
                break;
            default:
                displayField_pj = 'pj_code';
                break;
        }

        this.assyGrid = Ext.create('Ext.tree.Panel', {
            title: 'Assembly',
            collapsible: true,
            useArrows: true,
            rootVisible: false,
            store: this.cloudProjectTreeStore,
            selModel: (vCompanyReserved4 == 'KWLM01KR' || vCompanyReserved4 == 'APM01KR') ? selModel : null,
            multiSelect: true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.addAssyAction,
                    this.editAssyAction,
                    this.removeAssyAction,
                    this.copyAssemblyAction,
                    this.pasteAssyAction,
                    vCompanyReserved4 == 'KWLM01KR' ? this.partAddAction : '',
                    vCompanyReserved4 == 'KWLM01KR' ? this.addAssemblyCartAction : '',
                    '->',
                    vCompanyReserved4 == 'HSGC01KR' ? this.editAction : this.sendValveAction,
//                        {
//                            xtype: 'component',
//                            html: "복사:",
//                            style: 'color:#094C80;align:right;'
//                        },
                    {
                        id: gu.id('assy_quan'),
                        xtype: 'component',
                        html: "",
                        style: 'color:#094C80;align:right;'
                    }
                ]
            },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [/*{
                      	 id: gu.id('projectHo'),
                         xtype: 'combo',
                         cls: 'my-x-toolbar-default1',
                         // fieldStyle: 'background-color: #FBF8E6;
                         // background-image: none;',
                         mode: 'local',
                         editable: true,
                         margin:'2 2 5 2',
                         flex: 0.5,
                         queryMode: 'remote',
                         emptyText: '호선',
                         hidden: (vCompanyReserved4 ==  'KWLM01KR' || vCompanyReserved4 ==  'HSGC01KR' ) ? true : false,
                         displayField: 'pj_code',
                         valueField: 'unique_id',
                         store: this.cloudprojectStore,
                         params:{hasNull:true},
                         listConfig: {
                             getInnerTpl: function() {
                                 return '<div data-qtip="{pj_code}"><small>{pj_code}</small></div>';
                             }
                         },
                         triggerAction: 'all',
                         listeners: {
                             select: function(combo, record) {
                                 //gm.me().selectProjectCombo(record);

                             }
                         }
                    },*/{
                        id: gu.id('wa_name'),
                        xtype: 'combo',
                        cls: 'my-x-toolbar-default1',
                        // fieldStyle: 'background-color: #FBF8E6;
                        // background-image: none;',
                        mode: 'local',
                        editable: true,
                        flex: 0.8,
                        margin: '2 2 2 2',
                        queryMode: 'remote',
                        emptyText: '고객사',
                        // hidden: (vCompanyReserved4 ==  'KWLM01KR' || vCompanyReserved4 ==  'HSGC01KR' ) ? true : false,
                        displayField: 'wa_name',
                        valueField: 'unique_id',
                        store: this.buyerStore,
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{unique_id}"><small>{wa_name}</small></div>';
                            }
                        },
                        triggerAction: 'all',
                        listeners: {
                            select: function (combo, record) {
                                console_logs('combo', combo);
                                order_com_unique = combo.value;
                                gm.me().cloudprojectStore.getProxy().setExtraParam('order_com_unique', combo.value);
                                gm.me().conditionStore.getProxy().setExtraParam('parentCode', gm.me().link);
                                gm.me().conditionStore.getProxy().setExtraParam('tableName', 'project');
                                gm.me().conditionStore.getProxy().setExtraParam('fieldName', 'pj_name');
                                gm.me().conditionStore.getProxy().setExtraParam('limit', 1000);
                                gm.me().conditionStore.getProxy().setExtraParam('sqlName', 'partLineItemDetail');/*cartmap 에서 Assymap으로 변경*/
                                switch (vCompanyReserved4) {
                                    case 'KBTC01KR':
                                        gm.me().conditionStore.getProxy().setExtraParam('wherelist',
                                            'order_com_unique:' + combo.value + '|' +
                                            'sewon: Y'
                                        );
                                        break;
                                    default:
                                        gm.me().conditionStore.getProxy().setExtraParam('wherelist',
                                            'order_com_unique:' + combo.value
                                        );
                                        break;
                                }
                                gm.me().cloudprojectStore.load();

                                console_logs('pj_name', 'clear');
                                //gu.getCmp('pj_name').clearValue();

                            },
                            change: function (combo, record) {
                                // gu.getCmp('pj_name').clearValue();

                                order_com_unique = combo.value;
                                gm.me().cloudprojectStore.getProxy().setExtraParam('order_com_unique', combo.value);
                                gm.me().conditionStore.getProxy().setExtraParam('parentCode', gm.me().link);
                                gm.me().conditionStore.getProxy().setExtraParam('tableName', 'project');
                                gm.me().conditionStore.getProxy().setExtraParam('fieldName', 'pj_name');
                                gm.me().conditionStore.getProxy().setExtraParam('limit', 1000);
                                gm.me().conditionStore.getProxy().setExtraParam('sqlName', 'partLineItemDetail');/*cartmap 에서 Assymap으로 변경*/
                                switch (vCompanyReserved4) {
                                    case 'KBTC01KR':
                                        gm.me().conditionStore.getProxy().setExtraParam('wherelist',
                                            'order_com_unique:' + combo.value + '|' +
                                            'sewon: Y'
                                        );
                                        break;
                                    default:
                                        gm.me().conditionStore.getProxy().setExtraParam('wherelist',
                                            'order_com_unique:' + combo.value
                                        );
                                        break;
                                }
                                gm.me().cloudprojectStore.load();
                                gm.me().conditionStore.load();
                            }
                        }
                    },
                        {
                            id: gu.id('projectcombo'),
                            xtype: 'combo',
                            cls: 'my-x-toolbar-default1',
                            // fieldStyle: 'background-color: #FBF8E6;
                            // background-image: none;',
                            mode: 'local',
                            editable: true,
                            flex: 1,
                            queryMode: 'remote',
                            emptyText: '프로젝트',
                            displayField: 'pj_code',
                            valueField: 'unique_id',
                            store: this.cloudprojectStore,
                            // minChars: 1,
                            listConfig:
                                (vCompanyReserved4 == 'HSGC01KR' || vCompanyReserved4 == 'APM01KR') ?

                                    {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}"><small><font color=blue>{pj_code}</font> {pj_name} {wa_name}</small></div>';
                                        }
                                    } : (vCompanyReserved4 == 'KWLM01KR') ? {
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id}"><small><font color=blue>{pj_code}</font> <br/><font color=red>{alter_item_code}</font> <br/> {item_name}</small></div>';
                                            }
                                        } :
                                        {
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{pj_name}"><small><font color=blue>{reserved_varchar3}</font> {wa_name}</small></div>';
                                            }
                                        },
                            triggerAction: 'all',
                            listeners: {
                                select: function (combo, record) {
                                    console_logs('===record', record);
                                    gm.me().selectProjectCombo(record);

                                    var pj_uid = record.get('unique_id_long');
                                    gm.me().selectedPjUid = pj_uid;
                                    gm.me().AllattachedFileStore.getProxy().setExtraParam('group_code', pj_uid);
                                    gm.me().AllattachedFileStore.load();
                                }
                            }
                        }
                    ]
                }
            ], // dockedItems of End
            columns: [
                {
                    xtype: 'treecolumn', // this is so we know which column
                    // will show the tree
                    text: '계층',
                    width: vCompanyReserved4 == 'HSGC01KR' ? 350 : 250,
                    sortable: true,
                    dataIndex: 'text',
                    locked: true,
                    renderer: function (value, style, node, store) {
                        if (vCompanyReserved4 == 'HSGC01KR') {
                            if (style.record.data.reserved6 == '대조') {
                                return "<img src='../../extjs5/module/shared/icons/font-awesome16/assembly_big.png'/> " + value + "";
                            } else if (style.record.data.reserved6 == '중조' || style.record.data.reserved6 == '중소조') {
                                return "<img src='../../extjs5/module/shared/icons/font-awesome16/assembly_mid.png'/> " + value + "";
                            } else if (style.record.data.reserved6 == '소조') {
                                return "<img src='../../extjs5/module/shared/icons/font-awesome16/assembly_sma.png'/> " + value + "";
                            } else {
                                return "<img src='../../extjs5/module/shared/icons/font-awesome16/assembly_nor.png'/> " + value + "";
                            }
                        } else {
                            return value;
                        }
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: gm.getMC('sro1_completeAction', '완료'),
                    dataIndex: 'is_closed',
                    hidden: vCompanyReserved4 != 'KWLM01KR' ? false : true,
                    width: vCompanyReserved4 != 'KWLM01KR' ? 50 : 0,
                    style: 'text-align:center',
                    align: 'center',
                    listeners: {
                        checkchange: {
                            fn: function (obj, rowIndex, checked, eOpts) {
                                //console_logs('obj', obj);
                                //console_logs('rowIndex', rowIndex);
                                //console_logs('checked', checked);
                                //console_logs('eOpts', eOpts);

                                gm.me().checkTreeNode(obj, rowIndex, checked, 'is_closed');
                                // if(vCompanyReserved4 == 'KWLMM01KR') {
                                //     gm.me().checkTreeNode(obj, rowIndex, checked, 'is_new');
                                // }

//                                  console_logs('obj', obj);
//                                  //console_logs('rowIndex', rowIndex);
//                                  console_logs('checked', checked);
//                                  //console_logs('eOpts', eOpts);
//
//                              	var o = obj.up('grid').getStore().getAt(rowIndex);
//                              	 console_logs('o', o);
//                              	var msg = '선택한 [' + o.get('assy_name') + '] 및 하위 Assembly의 상태를 ' + (checked?'<완료>':'<진행중>')
//                              				+ ' 상태로 변경하시겠습니까?';
//
//                                  Ext.MessageBox.show({
//                                      title: '완료 확인',
//                                      msg: msg,
//                                      buttons: Ext.MessageBox.YESNO,
//                                      icon: Ext.MessageBox.QUESTION,
//                                      fn: function(btn) {
//                                      	console_logs('btn', btn);
//                                      	//var result = MessageBox.msg('{0}', btn);
//                                          if (btn == 'yes') {
//                                          	gm.me().checkTreeNode(obj, rowIndex, checked);
//                                          } else {
//                                          	var e1 = !checked;
//                                          	console_logs('e1', e1);
//                                          	o.set('checked', e1);
//                                          	obj.up('grid').getStore().sync();
//                                          }
//                                      }
//                                  });

                            }
                        }
                    },
                    stopSelection: true
                }
                , {
                    xtype: 'checkcolumn',
                    text: '설계완료',
                    dataIndex: 'is_new',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 80 : 0,
                    style: 'text-align:center',
                    align: 'center',
                    listeners: {
                        checkchange: {
                            fn: function (obj, rowIndex, checked, eOpts) {
                                //console_logs('obj', obj);
                                //console_logs('rowIndex', rowIndex);
                                //console_logs('checked', checked);
                                //console_logs('eOpts', eOpts);
                                gm.me().checkTreeNode(obj, rowIndex, checked, 'is_new');


//                                  console_logs('obj', obj);
//                                  //console_logs('rowIndex', rowIndex);
//                                  console_logs('checked', checked);
//                                  //console_logs('eOpts', eOpts);
//
//                              	var o = obj.up('grid').getStore().getAt(rowIndex);
//                              	 console_logs('o', o);
//                              	var msg = '선택한 [' + o.get('assy_name') + '] 및 하위 Assembly의 상태를 ' + (checked?'<완료>':'<진행중>')
//                              				+ ' 상태로 변경하시겠습니까?';
//
//                                  Ext.MessageBox.show({
//                                      title: '완료 확인',
//                                      msg: msg,
//                                      buttons: Ext.MessageBox.YESNO,
//                                      icon: Ext.MessageBox.QUESTION,
//                                      fn: function(btn) {
//                                      	console_logs('btn', btn);
//                                      	//var result = MessageBox.msg('{0}', btn);
//                                          if (btn == 'yes') {
//                                          	gm.me().checkTreeNode(obj, rowIndex, checked);
//                                          } else {
//                                          	var e1 = !checked;
//                                          	console_logs('e1', e1);
//                                          	o.set('checked', e1);
//                                          	obj.up('grid').getStore().sync();
//                                          }
//                                      }
//                                  });

                            }
                        }
                    },
                    stopSelection: true
                }
                , {
                    text: '상태',
                    dataIndex: 'status',
                    width: 0,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false
                }, {
                    // xtype: 'checkcolumn',
                    text: '수량',
                    dataIndex: 'bm_quan',
                    width: 50,
                    style: 'text-align:right',
                    align: 'right',
                    stopSelection: false
                }, {
                    text: '중량',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 50 : 0,
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'mass',
                    sortable: true
                },
                // {
                //     text: '납기일자',
                //     width: 120,
                //     dataIndex: 'req_date',
                //     sortable: true,
                //     stopSelection: false
                // },
                {
                    menuDisabled: true,
                    sortable: false,
                    text: 'V',
                    style: 'text-align:right',
                    align: 'right',
                    xtype: 'actioncolumn',
                    width: (vCompanyReserved4 == 'SKNH01KR') ? 40 : 0,
                    hidden: (vCompanyReserved4 == 'SKNH01KR') ? false : true,
                    items: [{
                        iconCls: 'sell-col'
                    }, {
                        getClass: function (v, meta, rec) {
                            var status = rec.get('status');
                            var bm_quan = rec.get('bm_quan');
                            var pclass_code = rec.get('pclass_code');
                            if (pclass_code == 'ACT') {


                                var is_closed = true;

                                try {
                                    is_closed = rec.get('is_closed');
                                } catch (e) {
                                }

                                //console_logs('is_closed', is_closed);
                                if (is_closed == false) {
                                    return 'font-awesome_4-7-0_gears_16_0_5395c4_none';
                                } else {
                                    return 'ionicons_2-0-1_android-done-all_16_0_c0392b_none';
                                }

                            } else {
                                return '';
                            }
                        },
                        getTip: function (v, meta, rec) {
                            if (rec.get('reserved_varchar1') != '') {
                                return gu.Comma2Div(rec.get('reserved_varchar1'));
                            } else {
                                return '';
                            }
                        },
                        handler: function (grid, rowIndex, colIndex) {
                            gm.me().selectedVv = grid.getStore().getAt(rowIndex);
                            var rec = gm.me().selectedVv;
                            var reserved_varchar1 = rec.get('reserved_varchar1');
                            var status = rec.get('status');
                            var bm_quan = rec.get('bm_quan');
                            var is_closed = true;

                            try {
                                is_closed = rec.get('is_closed');
                            } catch (e) {
                            }

                            if (is_closed == true) {
                                Ext.MessageBox.alert('알림', '이미 완료처리 되었습니다.');
                                return;
                            }


                            if (gm.me().checkClosed() == true) {
                                return;
                            } else { //BM
                                var curArr = gu.strComma2Array(reserved_varchar1);

                                var assy_name = rec.get('assy_name');
                                var msg = gm.me().getVvPromptMsg(curArr, assy_name, [], [true]);

                                var messageBox = Ext.MessageBox.show({
                                    title: 'VALVE NO.',
                                    msg: msg,
                                    width: 400,
                                    height: 400,
                                    buttons: Ext.MessageBox.OK,
                                    multiline: true,
                                    defaultTextHeight: 200,
                                    scope: this,
                                    value: gu.Comma2Area(rec.get('reserved_varchar1')),

                                    initComponent: function () {
                                        console_logs('initComponent', this.value);
                                    },
                                    buttons: Ext.MessageBox.OKCANCEL,
                                    fn: function (btn, text, c) {

                                        var rec = gm.me().selectedVv;
                                        var reserved_varchar1 = rec.get('reserved_varchar1');
                                        var curArr = gu.strComma2Array(reserved_varchar1);
                                        var allArr = gm.me().valve_nos;

                                        var assy_name = rec.get('assy_name');
                                        var msg = gm.me().getVvPromptMsg(curArr, assy_name, [], [true]);

                                        if (btn == 'ok') {

                                            gu.arrRemoveArr(allArr, curArr);

                                            console_logs('text', text);
                                            var nArr = text.split('\n');

                                            if (text != null && text != '' && nArr.length > 0) {
                                                var reserved_varchar1 = '';
                                                for (var i = 0; i < nArr.length; i++) {

                                                    var s = nArr[i];
                                                    if (s != null && s != '') {
                                                        gm.me().addValve_no(s);
                                                        if (reserved_varchar1 == '') {
                                                            reserved_varchar1 = s;
                                                        } else {
                                                            reserved_varchar1 = reserved_varchar1 + ',' + s;
                                                        }

                                                        gm.me().addValve_no(s);
                                                    }//endof if

                                                }//endoffor

                                                var unique_uid = gm.me().selectedVv.get('unique_uid');
                                                var unique_id = gm.me().selectedVv.get('child');
                                                var ac_uid = gm.me().selectedVv.get('ac_uid');
                                                var assy_name = gm.me().selectedVv.get('assy_name');
                                                var pj_code = gm.me().selectedVv.get('pj_code');

                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/design/bom.do?method=updateValveInfo',
                                                    params: {
                                                        reserved_varchar1: reserved_varchar1,
                                                        unique_id: unique_id,
                                                        unique_uid: unique_uid,
                                                        ac_uid: ac_uid,
                                                        assy_name: assy_name,
                                                        pj_code: pj_code
                                                    },
                                                    success: function (result, request) {
                                                        var grid = gm.me().grid;

                                                        //gm.editAjax('assymap', 'reserved_varchar1', reserved_varchar1, 'unique_id', unique_uid,  {bm_quan: nArr.length});

                                                        gm.me().selectedVv.set('reserved_varchar1', reserved_varchar1);
                                                        gm.me().selectedVv.set('bm_quan', nArr.length);

                                                        grid.getStore().sync();

                                                        console_logs('결과', '반영하였습니다.');
                                                    }
                                                });


                                            }

                                        }

                                        //gm.me().showToast(Ext.String.format('You clicked the {0} button and entered the text "{1}".', btn, text));
                                    }//,
                                    //animateTarget: btn
                                });
                                var v = messageBox.textArea.value.replace(/ /g, "").toUpperCase();

                                // messageBox.msgButtons.ok.setDisabled(v==null || v=='');

                                messageBox.textArea.allowBlank = false;
                                messageBox.textArea.spellcheck = false;
                                messageBox.textArea.on('change', function (e, text, o) {
//                                    	console_logs('messageBox e', e);
//                                    	console_logs('messageBox Msg', messageBox.msg);
//                                    	console_logs('text', text);
//                                    	console_logs('o', o);

                                    var rec = gm.me().selectedVv;
                                    var reserved_varchar1 = rec.get('reserved_varchar1');
                                    var curArr = gu.strComma2Array(reserved_varchar1);
                                    var allArr = gm.me().valve_nos;

                                    var assy_name = rec.get('assy_name');
                                    var msg = gm.me().getVvPromptMsg(curArr, assy_name, [], [true]);


                                    var clean = text.replace(/ /g, "").replace(/,/g, "").toUpperCase();

                                    if (clean != '') {
                                        //console_logs('clean', clean);
                                        var arr = clean.split('\n');
                                        arr = gu.sortedSet(arr);
                                        //console_logs('enter arr', arr);

                                        var canSave = [true];

                                        var msg = gm.me().getVvPromptMsg(curArr, assy_name, arr, canSave);

                                        //console_logs('canSave', canSave[0]);
                                        if (canSave[0] == false) {
                                            messageBox.msgButtons.ok.setDisabled(true);
                                        } else {
                                            messageBox.msgButtons.ok.setDisabled(false);
                                        }

                                        messageBox.msg.setHtml(msg);

                                        if (text.length > 1 && text.substr(text.length - 1, 1) == '\n') {
                                            //console_logs('enter', true);
                                            var s = '';
                                            for (var i = 0; i < arr.length; i++) {
                                                if (s == '') {
                                                    s = arr[i];
                                                } else {
                                                    s = s + '\n' + arr[i];
                                                }
                                            }
                                            e.setValue(s + '\n');


                                        } else {
                                            //console_logs('enter', false);
                                            e.setValue(clean);
                                        }
                                    } else {
                                        //e.setValue('');
                                    }


                                });

                            }


                        }
                    }]
                }, {
                    text: 'VALVE NO.',
                    width: 120,
                    dataIndex: 'reserved_varchar1',
                    width: (vCompanyReserved4 == 'SKNH01KR') ? 120 : 0,
                    hidden: (vCompanyReserved4 == 'SKNH01KR') ? false : true,
                    sortable: true
                }, {
                    text: '설계번호',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 150 : 0,
                    style: 'text-align:left',
                    align: 'left',
                    dataIndex: 'alter_item_code',
                    sortable: true
                }, {
                    text: '자재번호',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 150 : 0,
                    style: 'text-align:left',
                    align: 'left',
                    dataIndex: 'specification',
                    sortable: true
                }, {
                    text: 'POR NO',
                    width: 120,
                    dataIndex: 'h_reserved99',
                    width: (vCompanyReserved4 == 'KWLM01KR') ? 80 : 0,
                    hidden: (vCompanyReserved4 == 'KWLM01KR') ? false : true,
                    sortable: true
                }, {
                    text: '담당자',
                    width: 60,
                    dataIndex: vCompanyReserved4 == 'KWLM01KR' ? 'user_name' : 'changer',
                    sortable: true
                }, /*{
                text: '경로',
                flex: 1,
                // flex: 1,
                // cls:'rfx-grid-header',
                dataIndex: 'part_folder',
                // resizable: true,
                // autoSizeColumn : true,
                style: 'text-align:left',
                align: 'left'
            },*/   {
                    text: vCompanyReserved4 == 'HSGC01KR' ? '구분' : '식별기호',
                    width: vCompanyReserved4 != 'KWLM01KR' ? 150 : 0,
                    dataIndex: vCompanyReserved4 == 'HSGC01KR' ? 'reserved6' : 'part_path',
                    sortable: true
                }, {
                    text: '규격',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 150 : 0,
                    style: 'text-align:left',
                    align: 'left',
                    dataIndex: 'description',
                    sortable: true
                }, {
                    text: '재질',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 150 : 0,
                    style: 'text-align:left',
                    align: 'left',
                    dataIndex: 'model_no',
                    sortable: true
                }, {
                    text: '블록',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 150 : 0,
                    style: 'text-align:left',
                    align: 'left',
                    dataIndex: 'area_code',
                    sortable: true
                }, {
                    text: '구분번호',
                    width: vCompanyReserved4 == 'KWLM01KR' ? 150 : 0,
                    style: 'text-align:left',
                    align: 'left',
                    dataIndex: 'assybackuid',
                    sortable: true
                }
                /*
                     * , { text: gm.getMC('CMD_MODIFY', '수정'), width: 60, menuDisabled: true, xtype:
                     * 'actioncolumn', tooltip: 'Edit task', align: 'center',
                     * icon: '../../../resources2/images/edit_task.png',
                     * handler: function(grid, rowIndex, colIndex, actionItem,
                     * event, record, row) { Ext.Msg.alert('Editing' +
                     * (record.get('done') ? ' completed task' : '') ,
                     * record.get('task')); }, // Only leaf level tasks may be
                     * edited isDisabled: function(view, rowIdx, colIdx, item,
                     * record) { return !record.data.leaf; } }
                     */

                /*
                     * ,{ //we must use the templateheader component so we can use a
                     * custom tpl xtype: 'templatecolumn', text: '설계시간', width: 80,
                     * sortable: true, dataIndex: 'duration', align: 'center', //add
                     * in the custom tpl for the rows tpl:
                     * Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
                     * formatHours: function(v) { if (v < 1) { return Math.round(v *
                     * 60) + ' mins'; } else if (Math.floor(v) !== v) { var min = v -
                     * Math.floor(v); return Math.floor(v) + 'h ' + Math.round(min *
                     * 60) + 'm'; } else { return v + ' hour' + (v === 1 ? '' :
                     * 's'); } } }) }
                     */
                // text: '프로젝트 코드',
                // cls:'rfx-grid-header',
                // dataIndex: 'pj_code',
                // resizable: true,
                // autoSizeColumn : true,
                // style: 'text-align:center',
                // align:'center'
                // },{
            ]
            , viewConfig: {
                cls: 'x-tree-noicon'/*,
                getRowClass: function(r) {
                    if (r.data.reserved6 == '소조')
                        return 'green-row';
                    else
                        return '';
                }*/
            }
            , listeners: {
                'afterrender': function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {

                    }, this);

                },
                activate: function (tab) {
                    setTimeout(function () {
                        // gu.getCmp('main-panel-center').setActiveTab(0);
                        // alert(tab.title + ' was activated.');
                    }, 1);
                },
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                }
            }
        });


        this.cloudProjectTreeStore.on('load', function (store, records, successful, eOpts) {

            if (records != null) {
                for (var i = 0; i < records.length; i++) {
                    var rec = records[i];

                    var pclass_code = rec.get('pclass_code');
                    //console_logs('pclass_code', pclass_code);
                    if (pclass_code == 'ACT') {
                        //console_logs('cloudProjectTreeStore.on records records', records);
                        //console_logs('tree act rec', rec);
                        var reserved_varchar1 = rec.get('reserved_varchar1');
                        var status = rec.get('status');
                        //console_logs('reserved_varchar1', reserved_varchar1);
                        if (reserved_varchar1 != null && reserved_varchar1 != '') {

                            var arr = gu.strComma2Array(reserved_varchar1);
                            //console_logs('reserved_varchar1', reserved_varchar1);
                            for (var j = 0; j < arr.length; j++) {
                                gm.me().addValve_no(arr[j]);
                            }

                        }
                    }
                }
            }
            //Block of codes
            //var access=records[0].data.access;
            //Block of codes
        });

        gMain.addTabFileAttachGridPanel('도면 업로드', 'FILE_ATTACH', {NO_INPUT: null}, function (selections) {

                if (selections.length) {
                    var rec = selections[0];
                } else {

                }
            },
            gMain.selectedMenuId + 'designFileAttach',
            {
                selectionchange: function (sm, selections) {
                    var fileRecord = (selections != null && selections.length > 0) ? selections[0] : null;
                    console_logs(gMain.selectedMenuId + 'designFileAttach' + 'delButton');

                    var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
                    if (fileRecord == null) {
                        gUtil.disable(delButton);
                    } else {
                        gUtil.enable(delButton);
                    }

                }
            }
        );

        this.assyGrid.getSelectionModel().on({
            select: function (a, b) {
                var assySelections = gm.me().assyGrid.getSelectionModel().getSelection();


                // alert(assySelections.length);
                // if(assySelections.length > 0) {
                //     gm.me().partAddAction.enable();
                // } else {
                //     gm.me().partAddAction.disable();
                // }
            },

            selectionchange: function (sm, selections) {

                gm.me().bomListStore.getProxy().setExtraParam('ac_uid', selections[0].get('ac_uid'));
                gm.me().bomListStore.getProxy().setExtraParam('outOrder', 'false');

                gm.me().bomListStore.load(function (record) {

                });


                var assySelections = gm.me().assyGrid.getSelectionModel().getSelection();
                if (assySelections.length > 0) {
                    gm.me().partAddAction.enable();
                    gm.me().addAssemblyCartAction.enable();
                } else {
                    gm.me().partAddAction.disable();
                    gm.me().addAssemblyCartAction.disable();
                }
                var rec = selections[0];
                gMain.selPanel.vSELECTED_RECORD = rec;

                if (rec != undefined && rec != null && vCompanyReserved4 == 'HSGC01KR') {
                    gMain.selPanel.fileNolink = 'false';
                    gMain.loadFileAttach(rec.get('id'), gMain.selectedMenuId + 'designFileAttach');
                }

                // 에러발생시에 새로고침
                try {
                    gm.me().onAssemblyGridSelection(selections);
                } catch (error) {
                    location.reload(true);
                }
            }
        });

        var pageParameters = Ext.urlDecode(window.location.search.substring(1));

        if (pageParameters['pj_uid'] != null && pageParameters['pj_uid'] != undefined && pageParameters['pj_uid'] != '') {
            // this.cloudProjectTreeStore.getProxy().setExtraParam('wa_name', pageParameters['wa_name']);
            // this.cloudProjectTreeStore.getProxy().setExtraParam('pj_name', pageParameters['pj_name']);

            this.cloudProjectTreeStore.getProxy().setExtraParam('pjuid', pageParameters['pj_uid']);
            this.selectedPjUid = pageParameters['pj_uid'];
            // this.cloudProjectTreeStore.getProxy().setExtraParam('parent_uid', pageParameters['top_uid']);

            this.cloudProjectTreeStore.load({
                callback: function (records, operation, success) {
                    gm.me().assyGrid.setLoading(false);
                    gm.me().valve_nos = [];
                    gm.me().selectTree();
                }
            });
        }

        if (vCompanyReserved4 == 'SKNH01KR') {
            this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
                // {
                layout: 'border',
                border: true,
                region: 'west',
                width: '40%',
                layoutConfig: {
                    columns: 2,
                    rows: 1
                },

                items: [this.assyGrid, this.gridValve]
            });
        } else {
            this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
                // {
                layout: 'border',
                border: true,
                region: 'west',
                width: '40%',
                layoutConfig: {
                    columns: 2,
                    rows: 1
                },

                items: [this.assyGrid]
            });
        }


        return this.west;
    },
    cellEditing: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing1: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing2: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    // *****************************GLOBAL VARIABLE**************************/
    gridMycart: null,
    gridStock: null,
    store: null,
    myCartStore: null,
    stockStore: null,
    gItemGubunType: null,
    itemGubunType: null,
    inpuArea: null,

    sales_price: '',
    quan: '',
    lineGap: 35,

    selectedPjUid: '',
    selectedAssyUid: '',
    selectedChild: '',

    selectionLength: 0,

    assy_pj_code: '',
    selectedAssyCode: '',
    selectedPjCode: '',
    selectedPjName: '',
    selectedAssyDepth: 0,
    selectedAssyName: '',
    selectedparent: '',
    ac_uid: '',
    selectedPjQuan: 1,
    selectedAssyQuan: 1,
    selectedMakingQuan: 1,

    addpj_code: '',
    is_complished: false,
    routeTitlename: '',
    puchaseReqTitle: '',

    CHECK_DUP: '-copied-',
    gGridMycartSelects: [],
    copyArrayMycartGrid: function (from) {

        this.gGridMycartSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridMycartSelects[i] = from[i];
            }
        }
    },
    gGridStockSelects: [],
    copyArrayStockGrid: function (from) {

        this.gGridStockSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridStockSelects[i] = from[i];
            }
        }
    },
    initTableInfo: '',
    INIT_TABLE_HEAD: function () {
        var a =
            '<style>' +
            ' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }' +
            ' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
            ' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
            ' </style>' +
            '<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
            '<colgroup>' +
            '<col width="80px">' +
            '<col width="90px">' +
            '<col width="*">' +

            '<col width="90px">' +
            '<col width="90px">' +
            '<col width="50px">' +
            '<col width="90px">' +

            '<col width="60px">' +
            '<col width="60px">' +
            '<col width="40px">' +

            '<col width="110px">' +
            '<col width="90px">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr  height="30" >' +
            '	  <td class="xl66" align=center>프로젝트코드</td>' +
            '	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
            '	  <td class="xl66" align=center>프로젝트이름</td>' +
            '	  <td class="xl67" align=center>' + this.selectedPjName + '</td>' +
            '<td colspan="8" rowspan="2">' +
            '</td>' +
            '	 </tr>' +
            '<tr  height="30" >' +
            '	  <td class="xl66" align=center>Assy코드</td>' +
            '	  <td class="xl67" align=center>' + this.selectedAssyCode + '</td>' +
            '	  <td class="xl66" align=center>Assy이름</td>' +
            '	  <td class="xl67" align=center>' + this.selectedAssyName + '</td>' +
            '	 </tr>' +
            '<tr  height="25" >' +
            '	  <td class="xl66" align=center>품번</td>' +
            '	  <td class="xl66" align=center>품명</td>' +
            '	  <td class="xl66" align=center>규격</td>' +

            '	  <td class="xl66" align=center>재질</td>' +
            '	  <td class="xl66" align=center>후처리</td>' +
            '	  <td class="xl66" align=center>열처리</td>' +
            '	  <td class="xl66" align=center>제조원</td>' +

            '	  <td class="xl66" align=center>예상가격</td>' +
            '	  <td class="xl66" align=center>수량</td>' +
            '	  <td class="xl66" align=center>구분</td>' +
            '	  <td class="xl66" align=center>품목코드</td>' +
            '	  <td class="xl66" align=center>UID</td>' +
            '	 </tr>';

        return a;
    },
    INIT_TABLE_TAIL: '</tbody></table><br><br>' +
        '<div style="color:blue;font-size:11px;position:relative; "><ul>' +
        '<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>' +
        '<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>' +
        '<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>' +
        '</ul></div>',
    makeInitTable: function () {
        var initTableLine =
            '	 <tr height="25" style="height:12.75pt">' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl67">&nbsp;</td>' +
            '	  <td class="xl67">&nbsp;</td>' +
            '	 </tr>';

        this.initTableInfo = INIT_TABLE_HEAD();
        this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
    },
    bomTableInfo: '',

    createLine: function (val, align, background, style) {
        return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>' + val + '</td>';
    },

    setCopiedPartQuan: function (n) {
        console_logs('setCopiedPartQuan', n);
        var o = gu.getCmp('childCount');
        if (o != null) {
            o.update(n + '건 복사됨.');
        }

        this.copiedPartCnt = n;

        if (this.copiedPartCnt > 0) {
            this.pastePartAction.enable();
        } else {
            this.pastePartAction.disable();
        }

    },

    setCopiedAssyQuan: function () {
        var o = gu.getCmp('assy_quan');
        if (o != null) {

            var assyline = this.selected_tree_record;
            if (assyline != null) {
                console_logs('this.selected_tree_record', this.selected_tree_record);
                if (assyline.get('parentId') == 'root') {
                    o.update(assyline.get('pj_code') + ' 프로젝트' + ' 복사');
                } else {
                    o.update(assyline.get('pj_code') + '/' + assyline.get('part_path') + ' 복사');
                }


            }

        } else {
            o.update('');
        }
    },
    setProjectQuan: function (n) {
        var o = gu.getCmp('pj_quan');
        if (o != null) {
            o.update('' + n);
        }
    },

    setMaking_quan: function (n) {
        var o = gu.getCmp('making_quan');
        if (o != null) {
            o.update('' + n);
        }

    },

    createHtml: function (route_type, rqstType, catmapObj) {
        var htmlItems =
            '<style>' +
            ' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }' +
            ' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
            ' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
            ' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
            '<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
            '<colgroup>' +
            '<col width="10%">' +
            '<col width="10%">' +
            '<col width="10%">' +
            '<col width="20%">' +
            '<col width="40%">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr  height="25" >' +
            '	  <td class="xl67" align=center>품목코드</td>' +
            '	  <td class="xl67" align=center>필요수량</td>' +
            '	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
            '	  <td class="xl67" align=center>품명</td>' +
            '	  <td class="xl67" align=center>규격</td>' +
            '	 </tr>';
        for (var i = 0; i < catmapObj.length; i++) {
            var rec = catmapObj[i]; // grid.getSelectionModel().getSelection()[i];
            var item_code = rec.get('item_code');
            var quan = route_type == 'P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
            var new_pr_quan = rec.get('new_pr_quan');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');

            htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
            htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + '</tr>';

        }
        htmlItems = htmlItems + '</tbody></table></div>';
        return htmlItems;
    },

    setMakeTable: function (records) {
        this.bomTableInfo = this.INIT_TABLE_HEAD();
        if (records == null || records.length == 0) {
            // bomTableInfo = initTableInfo;
        } else {
            for (var i = 0; i < records.length; i++) {
                var rec = records[i];
                var unique_id = rec.get('unique_id');
                var unique_uid = rec.get('unique_uid');
                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                var specification = rec.get('specification');
                var standard_flag = rec.get('standard_flag');
                var sp_code = rec.get('sp_code'); // 표시는 고객사 선책톧로

                var model_no = rec.get('model_no');
                var description = rec.get('description');
                var pl_no = rec.get('pl_no');
                var comment = rec.get('comment');
                var maker_name = rec.get('maker_name');
                var bm_quan = rec.get('bm_quan');
                var unit_code = rec.get('unit_code');
                var sales_price = rec.get('sales_price');

                this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
                this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65'); // 품번
                this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65'); // 품명
                this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65'); // 규격
                this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65'); // 재질/모델
                this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65'); // 후처리
                this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65'); // 열처리
                this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65'); // 제조원
                this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65'); // 예상가(숫자)
                this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65'); // 수량(숫자)
                this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65'); // 구분기호
                this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67'); // 품목코드
                this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67'); // UID
                this.bomTableInfo = this.bomTableInfo + '	 </tr>';
            }
        }
        this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
        var o = gu.getCmp('bom_content');
        o.setValue(this.bomTableInfo);
    },

    insertStockStoreRecord: function (records) {
    },


    cloudprojectStore: Ext.create('Mplm.store.cloudProjectStore', {hasNull: true}),
    mesProjectTreeStore: Ext.create('Mplm.store.MesProjectTreeStore', {}),
    routeGubunTypeStore: Ext.create('Mplm.store.RouteGubunTypeStore', {}),
    routeGubunTypeStore_W: Ext.create('Mplm.store.RouteGubunTypeStore_W', {}),
    commonStandardStore: Ext.create('Mplm.store.CommonStandardStore', {
        hasNull: true
    }),
    buyerStore: Ext.create('Mplm.store.BuyerStore', {}),
    conditionStore: Ext.create('Mplm.store.ConditionComboStore', {}),


    renderCarthistoryPlno: function (value, p, record) {
        var unique_uid = record.get('unique_uid');

        return Ext.String.format(
            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
            unique_uid, value
        );
    },


    getPosStandard: function (id) {

        for (var i = 0; i < this.standard_flag_datas.length; i++) {
            if (this.standard_flag_datas[i].get('systemCode') == id) {
                return this.standard_flag_datas[i];
            }
        }
        return null;
    },

    selectAssy: function (record) {
        this.assembly_uids = [];
        console_logs('selectAssy record', record);
        if (vCompanyReserved4 == 'KWLM01KR') {
            var assy_selections = gm.me().assyGrid.getSelectionModel().getSelection();
            for (var i = 0; i < assy_selections.length; i++) {
                this.assembly_uids.push(assy_selections[i].get('unique_uid'));
            }
        }
        console_logs('===>assembly_uids', this.assembly_uids);
        this.addAssyAction.enable();
        this.addPartAction.enable();
        this.importAssyAction.enable();
        if (this.copiedPartCnt > 0) {
            this.pastePartAction.enable();
        }
        this.editAction.enable();
        this.pasteAssyAction.enable();
        this.inpuArea.enable();
        this.fileGrid.enable();
        this.repositGrid.enable();
        //gu.getCmp('addPartForm')).enable();
        gu.getCmp('target-routeTitlename').update(this.routeTitlename);
        var myLink = gu.link;
        //console_logs('myLink>>>>>>>>>>>>>', myLink);
        this.copyAssemblyAction.enable();

        var available_depth = false;

        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                available_depth = this.depth < 3;
                break;
            default:
                available_depth = this.depth == 0;
                break;
        }

        if (this.depth == 0) {
            this.editAssyAction.disable();
        } else {
            this.editAssyAction.enable();
        }

        if (available_depth) {
            this.removeAssyAction.disable();
        } else {
            this.removeAssyAction.enable();
        }

        if (record != null &&
            record.get('pclass_code') == 'ACT' /* &&
        	record.get('status')=='BM'*/
        ) {
            this.sendValveAction.enable();
        } else {
            this.sendValveAction.disable();
        }

        //BOM 보이기
        var tab = gm.me().center;
        tab.setActiveTab(gm.me().bomTab);


        //File Load
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('child'));
        this.attachedFileStore.getProxy().setExtraParam('group_code', gm.me().selectedPjUid);
        this.attachedFileStore.load(function (records) {

            console_logs('attachedFileStore records', records);
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });
        if (this.ftpSetting) {
            this.repositFileStore.load(function (records) {
                console_logs('repositFileStore records', records);
                if (records != null) {
                    var o = gu.getCmp('ftp_quan');
                    if (o != null) {
                        o.update('총수량 : ' + records.length);
                    }
                }
            });
        }
    },

    unselectAssy: function (record) {
        // this.addAction.disable();
        this.addAssyAction.disable();
        this.addPartAction.disable();
        this.importAssyAction.disable();
        this.pastePartAction.disable();
        this.pasteAssyAction.disable();
        this.editAssyAction.disable();
        this.removeAssyAction.disable();
        this.copyAssemblyAction.disable();
        this.inpuArea.disable();
        this.fileGrid.disable();
        this.repositGrid.disable();
        gu.getCmp('bom_content').setValue(this.initTableInfo);

        this.sendValveAction.disable();

    },


    item_code_dash: function (item_code) {
        if (item_code == null || item_code.length < 13) {
            return item_code;
        } else {
            return item_code.substring(0, 12);
        }
    },

    setReadOnlyName: function (name, readonly) {
        this.setReadOnly(gu.getCmp(name), readonly);
    },

    setReadOnly: function (o, readonly) {
        if (o != undefined && o != null) {
            o.setReadOnly(readonly);
            if (readonly) {
                o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
            } else {
                o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
            }
        }


    },

    getPl_no: function (systemCode) {
        var prefix = systemCode;
//        if(systemCode == 'O') {
//        	systemCode = 0;
//        }
//
//        if (systemCode == 'S') {
//            prefix = 'K';
//        } else if (systemCode == 'O') {
//            prefix = 'A';
//        }
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
            params: {
                first: prefix,
                parent: this.selectedChild,
                parent_uid: this.selectedAssyUid
            },
            success: function (result, request) {
                var result = result.responseText;
                var str = result; // var str = '293';

                if (systemCode == 'O') {
                    str = str.substring(0, str.length - 1) + '0'; //'O'를 0 으로 교체.
                }

                gu.getCmp('pl_no').setValue(str);


            },
            failure: extjsUtil.failureMessage
        });
    },


    fPERM_DISABLING_Complished: function () {
        // 1. 권한있음.
        if (fPERM_DISABLING() == false && is_complished == false) {
            return false;
        } else { // 2.권한 없음.
            return true;
        }
    },

    // Define reset Action
    resetAction: Ext.create('Ext.Action', {
        itemId: 'resetButton',
        iconCls: 'af-remove',
        text: CMD_INIT,
        handler: function (widget, event) {
            resetPartForm();
            //gu.getCmp('addPartForm')).getForm().reset();
            // console_logs('getForm().reset()', 'ok');
        }
    }),


    importAssyAction: Ext.create('Ext.Action', { //설계관리> BOM Tree > 가져오기
        itemId: 'importAssyAction',
        iconCls: 'font-awesome_4-7-0_arrow-down_14_0_5395c4_none',
        hidden: (vCompanyReserved4 == 'SKNH01KR') ? false : true,
        text: '가져오기',
        disabled: true,
        handler: function (widget, event) {
            console_logs("가져오기>>>>>>>>>>>>");
            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);
            var parent_uid = gm.me().selectedAssyUid;
            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할  Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }


            if (gm.me().checkClosed() == true) {
                return;
            }

            var searchStandardAssyStore = gm.me().searchStandardAssyStore;
            //searchStandardAssyStore.getProxy().setExtraParam('bom_flag', 'T');
            searchStandardAssyStore.getProxy().setExtraParam('sg_code', 'BOM');

            var itemGrid = Ext.create('Ext.grid.Panel', {
                //title: '종전 Assembly',
                store: gm.me().partlineStore,
                // /COOKIE//stateful: true,
                collapsible: false,
                multiSelect: false,
                //selModel: selModelMycart,
                //stateId: 'gridMycart' + /* (G) */ vCUR_MENU_CODE,
                // height: getCenterPanelHeight(),
                width: 600,
                height: 400,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: '100%',
                            field_id: 'search_information_assy',
                            id: gu.id('search_information_assy'),
                            name: 'search_information_assy',
                            xtype: 'combo',
                            emptyText: '코드, 품명 또는 규격으로 Assembly 검색',
                            store: searchStandardAssyStore,
                            displayField: 'specification',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            sortInfo: {
                                field: 'specification',
                                direction: 'ASC'
                            },
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: true,
                            hideTrigger: true,
                            //anchor: '100%',
                            allowBlank: true,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 결과가 없습니다.',

                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div onclick="gm.me().setBomDataImport({id},\'{item_code}\',\'{item_name}\');"><a class="search-item" href="javascript:gm.me().setBomDataImport({id},\'{item_code}\',\'{item_name}\');">' +
                                        '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                        '</a></div>';
                                }
                            },
                            pageSize: 10
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: '순번',
                        dataIndex: 'pl_no'
                    },
                    {
                        text: '자재번호',
                        dataIndex: 'item_code'
                    },
                    {
                        text: '품명',
                        dataIndex: 'item_name'
                    },
                    {
                        text: '규격',
                        flex: 1,
                        dataIndex: 'specification'
                    },
                    {
                        text: '수량',
                        width: 50,
                        align: 'right',
                        dataIndex: 'bm_quan'
                    }

                ]

            });

            var win = Ext.create('ModalWindow', {
                title: 'Assembly 가져오기',
//                        header: {
//                            titlePosition: 2//,
//                            //titleAlign: 'center'
//                        },
                width: 600,
                height: 400,
                minWidth: 250,
                minHeight: 180,
                maximizable: true,
                items: itemGrid,

                buttons: [{
                    text: '가져오기',
                    handler: function () {
                        console_logs("가져오기 진입>>>>>>>>>>");
                        var myStore = gm.me().partlineStore;
                        var uids = [];
                        myStore.data.each(function (rec) {
                            //console_logs('this', rec);
                            uids.push(rec.get('unique_uid'));
                        });
                        console_logs('import uids', uids);

                        if (win) {
                            win.close();
                        }

                        if (uids.length == 0) {
                            Ext.MessageBox.alert('알림', '가져올 항목이 없습니다.');
                        } else {
                            var pj_uid = gm.me().selectedPjUid;
                            var parent = gm.me().selectedChild;
                            var parent_uid = gm.me().selectedAssyUid;
                            var cnt = uids.length;

                            console_logs('pj_uid', pj_uid);
                            console_logs('parent_uid', parent_uid);


                            if (cnt < 1) {
                                Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
                            } else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
                            } else {
                                gm.me().pastePartActionHandler(uids);
                                gm.me().partlineStore.removeAll();
                            }
                        }


                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show( /* this, function(){} */);


        }
    }),

    pastePartActionHandler: function (uids) {

        this.grid.setLoading(true);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=addPastePartAssymap',
            params: {
                project_uid: gm.me().selectedPjUid,
                parent: gm.me().selectedChild,
                parent_uid: gm.me().selectedAssyUid,
                resetQty: 'false',
                resetPlno: 'false',
                uidList: uids
            },
            success: function (result, request) {
//                if (w) {
//                    w.close();
//                }
//                var result = result.responseText;
                //this.store.load(function() {});
                // Ext.MessageBox.alert('결과','총
                // ' + result + '건을
                // 복사하였습니다.');
                gm.me().store.load(function (records) {

                    gm.me().grid.setLoading(false);
                });
            },
            failure: extjsUtil.failureMessage
        });
        /*

            var fp = Ext.create('Ext.FormPanel', {
                id: gu.id('formPanelSelect'),
                frame: true,
                border: false,
                fieldDefaults: {
                    labelWidth: 80
                },
                width: 300,
                height: 220,
                bodyPadding: 10,
                items: [{
                        xtype: 'component',
                        html: '복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '10 10 10',
                        items: [{
                            xtype: 'fieldset',
                            flex: 1,
                            border: false,
                            // title: '복사 수행시 수량을 1로 초기화하거나
                            // 품번을 대상 Assy에 맞게 재 부여할 수
                            // 있습니다.',
                            defaultType: 'checkbox', // each
                            // item
                            // will
                            // be a
                            // checkbox
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%',
                                hideEmptyLabel: false
                            },
                            items: [{
                                fieldLabel: '복사 옵션',
                                boxLabel: '수량을 1로 초기화',
                                name: 'resetQty',
                                checked: false,
                                inputValue: 'false'
                            }, {
                                boxLabel: '품번 재부여',
                                name: 'resetPlno',
                                checked: false,
                                inputValue: 'false'
                            }, new Ext.form.Hidden({
                                name: 'hid_null_value'
                            })]
                        }]
                    }
                ]
            });

            w = Ext.create('ModalWindow', {
                title: CMD_ADD + ' :: ' + vCUR_MENU_NAME,
                width: 300,
                height: 220,
                plain: true,
                items: fp,
                buttons: [{
                    text: '복사 실행',
                    disabled: false,
                    handler: function(btn) {
                        var form = gu.getCmp('formPanelSelect').getForm();
                        var val = form.getValues(false);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design/bom.do?method=addPastePartAssymap',
                            params: {
                                project_uid: gm.me().selectedPjUid,
                                parent: gm.me().selectedChild,
                                parent_uid: gm.me().selectedAssyUid,
                                resetQty: val['resetQty'],
                                resetPlno: val['resetPlno'],
                                uidList: uids
                            },
                            success: function(result, request) {
                                if (w) {
                                    w.close();
                                }
                                var result = result.responseText;
                                //this.store.load(function() {});
                                // Ext.MessageBox.alert('결과','총
                                // ' + result + '건을
                                // 복사하였습니다.');
                                gm.me().store.load(function(records) {
                                   // gm.me().insertStockStoreRecord(records);
                                  gm.me().setCopiedPartQuan(0);

                                });
                            },
                            failure: extjsUtil.failureMessage
                        });

                    }


                }, {
                    text: CMD_CANCEL,
                    handler: function() {
                        if (w) {
                            w.close();
                        }
                    }
                }]
            });
            w.show();
		*/
    },

    pastePartAction: Ext.create('Ext.Action', {
        itemId: 'pasteActionButton',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function (widget, event) {
            var pj_uid = gm.me().selectedPjUid;
            var parent = gm.me().selectedChild;
            var parent_uid = gm.me().selectedAssyUid;
            var cnt = gm.me().copiedPartCnt;

            console_logs('pj_uid', pj_uid);
            console_logs('parent_uid', parent_uid);


            if (cnt < 1) {
                Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
            } else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
            } else {
                gm.me().pastePartActionHandler(null);
            }

        }
    }),

    sendValveAction: Ext.create('Ext.Action', {
        itemId: 'sendValveAction',
        iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        text: 'V/V생산요청',
        hidden: true,
        disabled: true,
        handler: function (widget, event) {


            var rec = gm.me().selected_tree_record;
            var selectedAssyUid = rec.get('unique_uid');
            var reserved_varchar1 = rec.get('reserved_varchar1');
            console_logs('sendValveAction selectedAssyUid', selectedAssyUid);
            console_logs('sendValveAction reserved_varchar1', reserved_varchar1);

            if (reserved_varchar1 == null || reserved_varchar1 == '') {
                Ext.MessageBox.alert('알림', 'Valve No가 입력되지 않았습니다.');
            } else {

                var msg = 'Actuator를  Valve No.기준으로 생산요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.'
                    + '<hr><u>Valve No. 목록</u><br>'
                    + '<div style="background-color:#EFFDDE ;border:0px solid #EAEAEA;width: 200; height: 80; word-wrap: break-word; white-space:normal; overflow-x:hidden; overflow-y: hidden;">'
                    + gu.Comma2Area(reserved_varchar1)
                    + '</div>'
                ;


                var messageBox = Ext.MessageBox.show({
                    title: 'V/V No(Actucatior) 생산요청',
                    msg: msg,
                    width: 360,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn: function (result) {
                        if (result == 'ok') {
                            gm.me().requestValve();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }

        }
    }),

    editAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: '도면 업로드',
        tooltip: '도면 업로드',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function () {
            gm.me().setActiveCrudPanel('EDIT');
            gm.me().toggleSelectedUidForm();
        }
    }),

    searchAction: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: CMD_SEARCH/*'검색'*/,
        tooltip: '조건 검색',
        handler: function () {
            gm.me().redrawStore();
        }
    }),

    pasteAssyAction: Ext.create('Ext.Action', {
        itemId: 'pasteAssyAction',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function (widget, event) {

            console_logs('gm.me().selectedAssyUid', gm.me().selectedAssyUid);

            if (gm.me().selectedAssyUid == null || gm.me().selectedAssyUid == '' || gm.me().selectedPjUid == null || gm.me().selectedPjUid == '') {
                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
            } else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addPasteAssyAssymap',
                    params: {
                        to_pj_uid: gm.me().selectedPjUid,
                        to_assy_uid: gm.me().selectedAssyUid,
                        to_parent: gm.me().selectedChild
                    },
                    success: function (result, request) {
                        var result = result.responseText;
                        console_logs('result', result);
                        gm.me().selectTreeGrid(null);
                        gm.me().refreshAssyCopy();
                        gm.me().cloudProjectTreeStore.load({
                            callback: function (records, operation, success) {
                                console_log('load tree store');
                                console_logs('cloudProjectTreeStore records ==> ', records);
                                console_log('ok');
                                //pjTreeGrid.setLoading(false);
                                // treepanel.expandAll();
                            }
                        });
                    },
                    failure: extjsUtil.failureMessage
                });

//                var fp = Ext.create('Ext.FormPanel', {
//                    id: gu.id('pasteAssyAction'),
//                    frame: true,
//                    border: false,
//                    fieldDefaults: {
//                        labelWidth: 80
//                    },
//                    width: 300,
//                    height: 220,
//                    bodyPadding: 10,
//                    items: [{
//                            xtype: 'component',
//                            html: '복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
//                        },
//                        {
//                            xtype: 'container',
//                            layout: 'hbox',
//                            margin: '10 10 10',
//                            items: [{
//                                xtype: 'fieldset',
//                                flex: 1,
//                                border: false,
//                                // title: '복사 수행시 수량을 1로 초기화하거나
//                                // 품번을 대상 Assy에 맞게 재 부여할 수
//                                // 있습니다.',
//                                defaultType: 'checkbox', // each
//                                // item
//                                // will
//                                // be a
//                                // checkbox
//                                layout: 'anchor',
//                                defaults: {
//                                    anchor: '100%',
//                                    hideEmptyLabel: false
//                                },
//                                items: [{
//                                    fieldLabel: '복사 옵션',
//                                    boxLabel: '수량을 1로 초기화',
//                                    name: 'resetQty',
//                                    checked: true,
//                                    inputValue: 'true'
//                                }, {
//                                    boxLabel: '품번 재부여',
//                                    name: 'resetPlno',
//                                    checked: true,
//                                    inputValue: 'true'
//                                }, new Ext.form.Hidden({
//                                    name: 'hid_null_value'
//                                })]
//                            }]
//                        }
//                    ]
////                });
//
//                w = Ext.create('ModalWindow', {
//                    title: CMD_ADD + ' :: ' + /* (G) */ vCUR_MENU_NAME,
//                    width: 300,
//                    height: 220,
//                    plain: true,
//                    items: fp,
//                    buttons: [{
//                        text: '복사 실행',
//                        disabled: false,
//                        handler: function(btn) {
//                            var form = gu.getCmp('pasteAssyAction').getForm();
//                            var val = form.getValues(false);
//                            var selections = gridMycart.getSelectionModel().getSelection();
//                            if (selections) {
//                                var uids = [];
//                                for (var i = 0; i < selections.length; i++) {
//                                    var rec = selections[i];
//                                    var unique_uid = rec.get('unique_uid');
//                                    uids.push(unique_uid);
//                                }
//                                Ext.Ajax.request({
//                                    url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
//                                    params: {
//                                        project_uid: gm.me().selectedPjUid,
//                                        parent: gm.me().selectedChild,
//                                        parent_uid: gm.me().selectedAssyUid,
//                                        unique_uids: uids,
//                                        resetQty: val['resetQty'],
//                                        resetPlno: val['resetPlno']
//                                    },
//                                    success: function(result, request) {
//                                        if (w) {
//                                            w.close();
//                                        }
//                                        var result = result.responseText;
//                                        this.myCartStore.load(function() {});
//                                        // Ext.MessageBox.alert('결과','총
//                                        // ' + result + '건을
//                                        // 복사하였습니다.');
//                                        store.load(function(records) {
//                                            gm.me().insertStockStoreRecord(records);
//                                            gm.me().setCopiedPartQuan(records.length);
//
//                                        });
//                                    },
//                                    failure: extjsUtil.failureMessage
//                                });
//
//                            }
//
//                        }
//                    }, {
//                        text: CMD_CANCEL,
//                        handler: function() {
//                            if (w) {
//                                w.close();
//                            }
//                        }
//                    }]
//                });
//                w.show();
//
//
            }
        }
    }),

    // 수정등록
    modRegAction: Ext.create('Ext.Action', {
        itemId: 'modRegAction',
        iconCls: 'page_copy',
        text: '값 복사',
        disabled: true,
        handler: function (widget, event) {
            gm.me().unselectForm();
            grid.getSelectionModel().deselectAll();
        }
    }),
    cleanComboStore: function (cmpName) {
        var component = gu.getCmp(cmpName);

        component.setValue('');
        component.setDisabled(false);
        component.getStore().removeAll();
        component.setValue(null)
        component.getStore().commitChanges();
        component.getStore().totalLength = 0;
    },

    resetParam: function () {
        this.store.getProxy().setExtraParam('unique_id', '');
        this.store.getProxy().setExtraParam('item_code', '');
        this.store.getProxy().setExtraParam('item_name', '');
        this.store.getProxy().setExtraParam('specification', '');
        this.store.getProxy().setExtraParam('parent', '');
        this.store.getProxy().setExtraParam('assy_code', '');
        this.store.getProxy().setExtraParam('pjuid', '');
        this.store.getProxy().setExtraParam('parentFolder', '');
    },

    loadTreeAllDef: function () {
        this.loadTreeAll(this.selectedPjUid);
    },
    loadTreeAll: function (pjuid) {
        // this.this.assyGrid.setLoading(true);

        this.mesProjectTreeStore.removeAll(true);
        this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
        this.mesProjectTreeStore.load({
            callback: function (records, operation, success) {

            }
        });
    },

    setBomData: function (id) {

        gm.me().createPartForm.setLoading(true);


        console_logs('setBomData id=', id);
        //        this.modRegAction.enable();
        //        this.resetPartForm();

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id

            },
            success: function (result, request) {

                var jsonData = Ext.decode(result.responseText);
                // console_logs('jsonData', jsonData);
                var records = jsonData.datas;
                // console_logs('records', records);
                // console_logs('records[0]', records[0]);
                console_logs('===>>>>>aaa', records[0]);
                gm.me().setPartFormObj(records[0]);

                gm.me().createPartForm.setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });

    },

    setBomDataAssy: function (id, item_code, item_name) {
        gu.getCmp('target_item_code').setValue(item_code);
        gu.getCmp('target_assy_name').setValue(item_name);
        gu.getCmp('search_information_assy_add').setValue(item_name);
        gu.getCmp('target_child').setValue(id);
    },
    setBomDataImport: function (id, item_code, item_name) {


        console_logs('id', id);
        console_logs('item_code', item_code);
        console_logs('item_name', item_name);


//        gu.getCmp('target_uid').setValue(id);
//        gu.getCmp('target_item_code').setValue(item_code);
        //gu.getCmp('assy_name').setValue(item_name);
        try {
            gu.getCmp('information_assy').setValue(item_name);
        } catch (e) {
            console_logs('setBomDataImport e', e);
        }
        console_logs('try-catch 나옴')
        gm.me().partlineStore.getProxy().setExtraParam('parent', id);
        gm.me().partlineStore.getProxy().setExtraParam('ac_uid', -1);
        //gm.me().partlineStore.getProxy().setExtraParam('parent_uid', parent_uid); // mentis 0000505 > BOM목록 가져오기
        gm.me().partlineStore.getProxy().setExtraParam('parent_uid', -1);
        gm.me().partlineStore.getProxy().setExtraParam('orderBy', "pl_no");
        gm.me().partlineStore.getProxy().setExtraParam('ascDesc', "ASC");
        gm.me().partlineStore.load();

        // console_logs('parent_uid',parent_uid)

    },


    setPartFormObj: function (o) {
        console_logs('setPartFormObj o', o);

        //        // 규격 검색시 standard_flag를 sp_code로 사용하기
        //        Ext.Ajax.request({
        //            url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',
        //            success: function(result) {
        //                var text = result.responseText;
        //                console_logs('text', text);
        //                var o2 = JSON.parse(text, function(key, value) {
        //                    return value;
        //                });
        //
        //                // console_logs('o2', o2);
        //                gItemGubunType = o2['itemGubunType'];
        //                // console_logs('itemGubun', itemGubunType);
        //                // console_logs('itemGubun1', gItemGubunType);


        var standard_flag = 'R';
        //                if (gItemGubunType == 'standard_flag') {
        //                    standard_flag = o['standard_flag'];
        //                } else {
        //                    standard_flag = o['sp_code'];
        //                }

        gu.getCmp('unique_id').setValue(o['unique_id_long']);
        gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);

        gu.getCmp('standard_flag').setValue(standard_flag);
        gu.getCmp('standard_flag_disp').select(gm.me().getPosStandard(standard_flag));
        gu.getCmp('model_no').setValue(o['model_no']);
        gu.getCmp('description').setValue(o['description']);

        gu.getCmp('comment').setValue(o['comment']);
        gu.getCmp('maker_name').setValue(o['maker_name']);
        gu.getCmp('bm_quan').setValue('1');
        gu.getCmp('unit_code').setValue(o['unit_code']);
        gu.getCmp('sales_price').setValue(o['sales_price']);

        if (vCompanyReserved4 == 'KWLM01KR') {
            var notify_flag = null;
            if (o['notify_flag'] == 'N' || o['notify_flag'].length < 1) {
                notify_flag = '외주구매';
            } else {
                notify_flag = '사내구매';
            }
            gu.getCmp('notify_flag').setValue(o['notify_flag']);
            gu.getCmp('unit_mass').setValue(o['unit_mass']);
            Ext.getCmp('class_code').setValue(o['class_name']);
        }


        gm.me().getPl_no(standard_flag);

        var currency = o['currency'];
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp('currency').setValue(currency);
        this.readOnlyPartForm(true);

        //
        //
        //            },
        //            failure: extjsUtil.failureMessage
        //        });


    },

    setPartForm: function (record) {
        // console_logs('record:', record);

        gu.getCmp('unique_id').setValue(record.get('unique_id'));
        gu.getCmp('unique_uid').setValue(record.get('unique_uid'));
        gu.getCmp('item_code').setValue(record.get('item_code'));
        gu.getCmp('item_name').setValue(record.get('item_name'));
        gu.getCmp('specification').setValue(record.get('specification'));

        var standard_flag = record.get('standard_flag');
        gu.getCmp('standard_flag').setValue(standard_flag);

        gu.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
        gu.getCmp('model_no').setValue(record.get('model_no'));
        gu.getCmp('description').setValue(record.get('description'));
        gu.getCmp('pl_no').setValue(record.get('pl_no'));
        gu.getCmp('comment').setValue(record.get('comment'));
        gu.getCmp('maker_name').setValue(record.get('maker_name'));
        gu.getCmp('bm_quan').setValue(record.get('bm_quan'));
        gu.getCmp('unit_code').setValue(record.get('unit_code'));
        gu.getCmp('sales_price').setValue(record.get('sales_price'));


        var currency = record.get('currency');
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp('currency').setValue(currency);

        var ref_quan = record.get('ref_quan');
        // console_logs('ref_quan', ref_quan);
        if (ref_quan > 1) {
            this.readOnlyPartForm(true);
            gu.getCmp('isUpdateSpec').setValue('false');
        } else {
            this.readOnlyPartForm(false);
            this.setReadOnlyName('item_code', true);
            this.setReadOnlyName('standard_flag_disp', true);
            gu.getCmp('isUpdateSpec').setValue('true');
        }

    },

    resetPartForm: function () {

        gu.getCmp('unique_id').setValue('');
        gu.getCmp('unique_uid').setValue('');
        gu.getCmp('item_code').setValue('');
        gu.getCmp('item_name').setValue('');
        gu.getCmp('specification').setValue('');
        gu.getCmp('standard_flag').setValue('');
        gu.getCmp('standard_flag_disp').setValue('');

        gu.getCmp('model_no').setValue('');
        gu.getCmp('description').setValue('');
        gu.getCmp('pl_no').setValue('');
        gu.getCmp('comment').setValue('');
        gu.getCmp('maker_name').setValue('');
        gu.getCmp('bm_quan').setValue('1');
        gu.getCmp('unit_code').setValue('');
        gu.getCmp('sales_price').setValue('0');

        gu.getCmp('currency').setValue('KRW');
        if (vCompanyReserved4 == 'KWLM01KR') {
            gu.getCmp('unit_code').setValue('EA');
        } else {
            gu.getCmp('unit_code').setValue('PC');
        }

        gu.getCmp('unit_mass').setValue(1);
        gu.getCmp('notify_flag').setValue('외주구매');

        Ext.getCmp('class_code_level_1').clearValue();
        Ext.getCmp('class_code_level_2').clearValue();
        Ext.getCmp('class_code').clearValue();

        // var class_level_1 = Ext.getCmp('class_code_level_1').getValue();
        // var class_level_2 = Ext.getCmp('class_code_level_2').getValue();
        // var class_level_3 = Ext.getCmp('class_code_level_3').getValue();

        // if(class_level_1 != undefined && class_level_1 != null) {
        //     Ext.getCmp('class_code_level_1').clearValue();
        // }

        // if(class_level_2 != undefined && class_level_2 != null) {
        //     Ext.getCmp('class_code_level_2').clearValue();
        // }

        // if(class_level_3 != undefined && class_level_3 != null) {
        //     Ext.getCmp('class_code').clearValue();
        // }

        this.readOnlyPartForm(false);
    },

    unselectForm: function () {

        gu.getCmp('unique_id').setValue('');
        gu.getCmp('unique_uid').setValue('');
        gu.getCmp('item_code').setValue('');

        var cur_val = gu.getCmp('specification').getValue();
        var cur_standard_flag = gu.getCmp('standard_flag').getValue();

        if (cur_standard_flag != 'O') {
            gu.getCmp('specification').setValue(cur_val + ' ' + this.CHECK_DUP);
        }

        gu.getCmp('currency').setValue('KRW');

        this.getPl_no(gu.getCmp('standard_flag').getValue());
        this.readOnlyPartForm(false);
    },

    readOnlyPartForm: function (b) {

        this.setReadOnlyName('item_code', b);
        this.setReadOnlyName('item_name', b);
        this.setReadOnlyName('specification', b);
        this.setReadOnlyName('standard_flag', b);
        this.setReadOnlyName('standard_flag_disp', b);

        this.setReadOnlyName('model_no', b);
        this.setReadOnlyName('description', b);
        // this.setReadOnlyName('pl_no', b);
        this.setReadOnlyName('comment', b);
        this.setReadOnlyName('maker_name', b);

        this.setReadOnlyName('currency', b);
        this.setReadOnlyName('unit_code', b);

        this.setReadOnlyName('unit_mass', b);

        this.setReadOnlyName('notify_flag', b);

        if (vCompanyReserved4 == 'KWLM01KR') {
            this.setReadOnly(Ext.getCmp('class_code'), b);
        }
        // this.setReadOnlyName('notify_flag', b);

        gu.getCmp('information').setValue('');

    },

    searchCartAction: Ext.create('Ext.Action', {
        itemId: 'searchButton',
        iconCls: 'font-awesome_4-7-0_refresh_14_0_5395c4_none',
        text: '새로 고침',
        disabled: false,
        handler: function () {

//            test = [
//                "img12.png",
//                "img10.png",
//                "img2.png",
//                "img1.png",
//                "img101.png",
//                "img101a.png",
//                "abc10.jpg",
//                "abc10",
//                "abc2.jpg",
//                "20.jpg",
//                "20",
//                "abc",
//                "abc2",
//                ""
//            ];
//
//            console_logs('====test_1', test);
//            test.sort(gm.me().naturalCompare);
//            console_logs('====test_2', test);
//            return;
            switch (vCompanyReserved4) {
                case 'APM01KR':
                case 'KWLM01KR':
                    break;
                default:
                    gm.me().myCartStore.getProxy().setExtraParam('type', 'BOM');
                    break;
            }

            gm.me().myCartStore.load(function (records) {
                if (vCompanyReserved4 == 'HSGC01KR') {

                    for (var i = 0; i < records.length; i++) {
                        var o = records[i];
                        var new_pr_quan = o.get('new_pr_quan');
                        o.set('reserved_double1', new_pr_quan);
                    }

                } else {

                    console_logs('myCartStore load records', records);
                    if (records != null) {
                        for (var i = 0; i < records.length; i++) {
                            var o = records[i];
                            //var reserved_double1 = o.get('reserved_double1');
                            //if(reserved_double1 == null || reserved_double1<1) {
                            var new_pr_quan = o.get('new_pr_quan');
                            o.set('reserved_double1', new_pr_quan);
                            //}
                        }
                    }
                }
            });
        }
    }),


    Item_code_dash: function (item_code) {
        return item_code.substring(0, 5) + "-" + item_code.substring(5, 9) + "-" +
            item_code.substring(9, 12);
    },

//    materialClassStore: new Ext.create('Ext.data.Store', {
//
//        fields: [{
//            name: 'class_code',
//            type: "string"
//        }, {
//            name: 'class_name',
//            type: "string"
//        }, {
//            name: 'level',
//            type: "string"
//        }],
//        sorters: [{
//            property: 'display_order',
//            direction: 'ASC'
//        }],
//        proxy: {
//            type: 'ajax',
//            url: CONTEXT_PATH + '/design/class.do?method=read',
//            reader: {
//                type: 'json',
//                root: 'datas',
//                totalProperty: 'count',
//                successProperty: 'success'
//            },
//            extraParams: {
//                level: '2',
//                parent_class_code: ''
//            },
//            autoLoad: true
//        }
//    }),
    standard_flag_datas: [],
    assyGrid: null,
    expandAllTree: function () {
        if (this.assyGrid != null) {
            this.assyGrid.expandAll();
        }
    },
    isExistMyCart: function (inId) {
        var bEx = false; // Not Exist
        this.myCartStore.data.each(function (item, index, totalItems) {
            console_logs('item', item);
            var uid = item.data['unique_uid'];
            console_logs('uid', uid);
            console_logs('inId', inId);
            if (inId == uid) {
                bEx = true; // Found
            }
        });

        return bEx;
    },
    loadStore: function (child) {

        this.store.getProxy().setExtraParam('child', child);

        this.store.load(function (records) {
            console_logs('==== storeLoadCallback records', records);
            console_logs('==== storeLoadCallback store', store);

        });

    },
    arrAssyInfo: function (o1, o2, o3, o4, o5, o6, o7, o8) {
        gm.me().mtrlChilds = o1;
        gm.me().bmQuans = o2;
        gm.me().itemCodes = o3;
        gm.me().spCode = o4;
        gm.me().ids = o5;
        gm.me().levels = o6;
        gm.me().bomYNs = o7;
        gm.me().pcr_divs = o8;
    },
    // selectedClass1 : '',
    // selectedClass2 : '',
    // selectedClass3 : '',
    selectedClassCode: '',
    materialStore: Ext.create('Mplm.store.MtrlSubStore'),
    productSubStore: Ext.create('Mplm.store.ProductSubStore')
    // makeClassCode : function() {
    // this.selectedClassCode = this.selectedClass1 + this.selectedClass2 +
    // this.selectedClass3
    // }


    ,
    addMtrlGrid: null,
    addPrdGrid: null,
    deleteValveConfirm: function (result) {
        if (result == 'yes') {
            var selections = gm.me().gridValve.getSelectionModel().getSelection();
            if (selections == null || selections.length == 0) {
                Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
                return;
            } else {
                var exist = [];
                var targetUid = [];
                for (var i = 0; i < selections.length; i++) {
                    var status = selections[i].get('status');
                    var unique_uid = selections[i].get('unique_uid');
                    if (status == 'CR' || status == 'BM') {
                        targetUid.push(unique_uid);
                    } else {
                        exist.push(unique_uid);
                    }

                }
                console_logs('targetUid', targetUid);
                if (targetUid.length > 0) {
                    gm.me().gridValve.setLoading(true);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=deleteConfirmValve',
                        params: {
                            assymap_uids: targetUid
                        },
                        success: function (result, request) {
                            gm.me().valveNoStore.load(function () {
                                gm.me().gridValve.setLoading(false);
                            });
                        }
                    });

                }

                if (exist.length > 0) {
                    Ext.Msg.alert('안내', exist.length + '건은 [진행중]이어서 삭제할 수 없습니다.', function () {
                    });
                }
            }

        }
    },

    deleteConfirm: function (result) {
        if (result == 'yes') {
            var arr = gm.me().selectionedUids;
            // console_logs('deleteConfirm arr', arr);
            if (arr.length > 0) {

                var CLASS_ALIAS = gm.me().deleteClass;
                // console_logs('deleteConfirm CLASS_ALIAS',
                // CLASS_ALIAS);
                // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                if (CLASS_ALIAS == null) {
                    CLASS_ALIAS = [];
                    for (var i = 0; i < gm.me().fields.length; i++) {
                        var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
                        if (tableName != 'map') {
                            CLASS_ALIAS.push(tableName);
                        }

                    }
                    CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
                }
                // console_logs('deleteConfirm CLASS_ALIAS 2',
                // CLASS_ALIAS);

                if (vCompanyReserved4 == 'APM01KR') {
                    CLASS_ALIAS = 'assymap'
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: arr
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        // console_logs('success rec', rec);
                        // console_logs('success op', op);
                        // gm.me().redrawStore();
                        gm.me().store.load();

                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                        });

                    }
                });

            }
        }

        // }
    },

    srchTreeHandler: function (my_treepanel, cloudProjectTreeStore, widName, parmName, b) {

//        console_logs("srchSingleHandler my_treepanel", my_treepanel);
//        console_logs("srchSingleHandler cloudProjectTreeStore", cloudProjectTreeStore);
//        console_logs("srchSingleHandler widName", widName);
//        console_logs("srchSingleHandler parmName", parmName);
//        console_logs("srchSingleHandler b", b);

        //this.assyGrid.setLoading(true);

        this.resetParam(this.cloudProjectTreeStore, this.searchField);
        var val = gu.getCmp(widName).getValue();
        //console_log('val' + val);

        this.cloudProjectTreeStore.getProxy().setExtraParam(parmName, val);
        this.cloudProjectTreeStore.load({
            callback: function (records, operation, success) {
                console_logs('======> records', records);
                gm.me().assyGrid.setLoading(false);
                gm.me().valve_nos = [];
                gm.me().selectTree();
                //gm.me().assyGrid.getSelectionModel().select(0);
                //gm.me().assyGrid.expandAll ();

            }
        });

    },

    selectProjectCombo: function (record) {
        var pjuid = record.get('unique_id');
        var pj_name = record.get('pj_name');
        var pj_code = record.get('pj_code');

        this.ac_uid = pjuid;
        this.assy_pj_code = '';
        this.selectedAssyCode = '';
        this.selectedPjCode = pj_code;
        this.selectedPjName = pj_name;
        this.selectedPjUid = pjuid;
        this.puchaseReqTitle = '[' + pj_code + '] ' + pj_name;

        //gu.getCmp('target-projectcode').update(pj_code);

        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        this.store.removeAll();
        this.unselectAssy(record);

        // Default Set
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
            params: {
                paramName: 'CommonProjectAssy',
                paramValue: pjuid + ';' + '-1'
            },

            success: function (result, request) {
                console_log('success defaultSet');
            },
            failure: function (result, request) {
                console_log('fail defaultSet');
            }
        });

        gm.me().refreshValve();
    },
    registPartFc: function (val) {
        console_logs('registPartFc val', val);
        gm.me().addNewAction(val);
    },
    addNewAction: function (val) {

        var partLine = Ext.create('Rfx.model.PartLine');
        for (var attrname in val) {
            //partLine[attrname] = val[attrname];
            partLine.set(attrname, val[attrname]);
        }


        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=createNew',
            params: val,
            success: function (result, request) {
                gm.me().selectTreeGrid(null);


                /*
                1. BOM 등록시 해당 모자재가 불출중인지 확인하고, 불출중이면 '설계 다시 되었다'고 상태값 바꾼다.
                2. 생산팀은 '추가신청필요'가 보이면 추가신청으로 불출 요청을 한다.
                3. 불출요청은 기존 같이 취소할 수 있다.
                4. 불출요청서는 기존에 '기불출'했던 자재와 같이 출력된다.
                 */
//                gm.me().cloudProjectTreeStore.load({
//
//                    callback: function(records, operation, success) {
//                        gm.me().selectTreeGrid(null);
//                    	//gm.me().assyGrid.expandAll();
//                    }
//                });

                //Ext.Msg.alert('결과', '저장 성공.');
            },
            failure: function (batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });

    },

    selectTree: function () {
        if (this.selected_tree_record != null) {
            //this.assyGrid.getSelectionModel().select(this.selected_tree_record);
        } else {
            //this.assyGrid.getSelectionModel().select(0);
        }
        this.assyGrid.expandAll();

    },

    selectTreeRecord: function (rec) {

        if (this.selected_tree_record != null && rec.id == this.selected_tree_record.id) {
            console_logs('===== matched', rec);
            this.assyGrid.getSelectionModel().select(rec);
        }
    },

    getNode: function (node) {
        if (node.length > 0) {
            for (var i = 0; i < node.length; i++) {
                this.array.push(node[i]);
            }
        }
    },

    selectTreeGrid: function (rec) {
        //console_logs('selectTreeGrid rec', rec);
        if (rec == null) {
            this.store.load(function (records) {
                gm.me().setMakeTable(records);
            });
        } else {
            this.selected_tree_record = rec;
            this.classCode = rec.get('class_code');
            this.selectedAssyCode = rec.get('assy_code');
            this.modelNo = rec.get('model_no');
            this.description = rec.get('description');
            this.selectedparent = rec.get('parent');
            this.selectedChild = rec.get('child');
            this.selectedAssyUid = rec.get('unique_uid');
            this.assy_uid = rec.get('parent');
            this.reserved_varchar1 = rec.get('reserved_varchar1');
            this.selectedAssyName = rec.get('assy_name');
            this.selectedPjUid = rec.get('ac_uid');
            this.selectedPjCode = rec.get('pj_code');

            this.routeTitlename = '(' + rec.get('id') + ')' + rec.get('part_folder'); //'[' + rec.get('pl_no') + '] ' + rec.get('assy_name');
            this.depth = rec.get('depth');
            this.selectAssy(rec);

            var parent = rec.get('unique_id_long');

            // if(vCompanyReserved4 == 'APM01KR') {
            //     this.store.getProxy().setExtraParam('apm', "apm");
            //     this.selectedAssyCode = rec.get('pl_no');
            //     var level = rec.get('level');
            //     this.store.getProxy().setExtraParam('level',level);
            // }
            this.store.getProxy().setExtraParam('parent', this.selectedChild);
            this.store.getProxy().setExtraParam('parent_uid', this.selectedAssyUid);
            this.store.getProxy().setExtraParam('orderBy', "pl_no");
            this.store.getProxy().setExtraParam('ascDesc', "ASC");
            this.store.getProxy().setExtraParam('ac_uid', this.selectedPjUid);
            this.store.getProxy().setExtraParam('outOrder', this.outOrderSetting);
            this.store.load(function (records) {
                gm.me().setMakeTable(records);

                var pageParameters = Ext.urlDecode(window.location.search.substring(1));

                if (pageParameters != undefined && pageParameters != null) {
                    for (var i = 0; i < gm.me().store.data.length; i++) {
                        var unique_id = gm.me().store.data.items[i].data.unique_uid;
                        if (unique_id == pageParameters['child']) {
                            gm.me().grid.getSelectionModel().select(gm.me().store.data.items[i]);
                        }
                    }
                }
            });

        }


    },

    editRecord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
//        	case 'req_date':
//        	//case 'bm_quan':
//        	{
//        		var tableName = 'assymap';
//        		var whereField = "unique_id";
//        		var value=rec.get(field);
//        		var whereValue = rec.get('unique_uid');
//        		gm.editAjax(tableName, field, value, whereField, whereValue,  {type:''}, false);
//    		}
//    		break;

            case 'req_info':
                this.updateDesinComment(rec);
                break;
            default:
                gm.editRedord(field, rec, null, false);

        }


    },
    updateDesinComment: function (rec) {
        var unique_uid = rec.get('unique_uid');
        var req_info = rec.get('req_info');
        var reserved_varchar1 = rec.get('reserved_varchar1');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
            params: {
                id: unique_uid,
                req_info: req_info,
                reserved_varchar1: reserved_varchar1
            },
            success: function (result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },

    doRequestAction: function (isGoodsin) {


        var selections = null;
        var rqstType = null;
        if (isGoodsin) {
            selections = this.gridStock.getSelectionModel().getSelection();
            rqstType = '반출요청';
            console_logs(rqstType, selections);
        } else {
            selections = this.gridMycart.getSelectionModel().getSelection();
            rqstType = '구매요청';
            console_logs(rqstType, selections);
        }

        console_logs('selections', selections);
        if (selections == null || selections.length == 0) {
            Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
        }

        var nique_uids = new Array();
        var new_pr_quans = new Array();

        var userStore = Ext.create('Mplm.store.UserStore', {
            hasNull: false
        });

        var route_type = isGoodsin == true ? 'G' : 'P';

        var puchaseReqTitle = '[' + this.selectedPjCode + '] ' + this.selectedPjName + ' : ' + rqstType;

        var unique_uids = [];
        var child_uids = [];
        var parent_uids = [];
        this.catmapObj = [];
        var unit_mass = [];
        var pl_nos = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];

            if (isGoodsin == false) {
                var ac_uid = rec.get('ac_uid');
                if (ac_uid + '' != this.selectedPjUid + '') {
                    Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + this.selectedPjName + '] 프로젝트에 속한 자재만 ' + rqstType + '할 수 있습니다.');
                    return;
                }
//                if (rec.get('goodsout_quan') > 0) {
//                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '" 아이템에 가용재고가 있습니다. 먼저 창고반출요청을 진행하세요.');
//                    return;
//                }

                new_pr_quans.push(rec.get('reserved_double1'));


            } else {
                if (rec.get('goodsout_quan') > rec.get('new_pr_quan')) {
                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 반출요청 수량이 필요수량보다 큽니다.');
                    return;
                } else if (rec.get('goodsout_quan') > rec.get('stock_qty_useful')) {
                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 반출요청 수량이 재고수량보다 큽니다.');
                    return;
                }
                new_pr_quans.push(rec.get('goodsout_quan'));
            }

            unique_uids[i] = rec.get('unique_uid');
            if (new_pr_quans[i] < 0.00000001) {
                Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 요청 수량이 0입니다.');
                return;
            }

            this.catmapObj[i] = rec;

            child_uids.push(rec.get('unique_id_long'));
            parent_uids.push(rec.get('parent'));
            var mass_check = (rec.get('unit_mass') == undefined || rec.get('unit_mass') == null || rec.get('unit_mass') == 0) ? 1 : rec.get('unit_mass');
            unit_mass.push(mass_check);

            pl_nos.push(rec.get('pl_no'));
        }//emdoffor

        var item_name = rec.get('item_name');
        var item_code = rec.get('item_code');
        var item_qty = selections.length;

        var userStore = Ext.create('Mplm.store.UserStore');
        userStore.getProxy().setExtraParam('user_type', 'PUR');

        var request_content = '';

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                request_content = '청구서명';
                break;
            default:
                request_content = '요청사항';
                break;
        }

        var formItems = [{
            xtype: 'fieldset',
            title: '구매 요청',
            collapsible: false,
            width: '100%',
            style: 'padding:10px',
            //bodyStyle: 'padding:15px',
            defaults: {
                width: '100%',
                //labelWidth: 89,
                //anchor: '100%',
                layout: {
                    type: 'hbox'//,
                    // defaultMargins: {
                    //     top: 10,
                    //     right: 10,
                    //     bottom: 10,
                    //     left: 10
                    // }
                }
            },
            items: [
                new Ext.form.Hidden({
                    name: 'route_type',
                    value: route_type
                }),
                new Ext.form.Hidden({
                    name: 'pj_uid',
                    value: gm.me().selectedPjUid
                }),
                new Ext.form.Hidden({
                    name: 'pl_nos',
                    value: pl_nos
                }),
                new Ext.form.Hidden({
                    id: 'item_name',
                    name: 'item_name',
                    value: selections[0].get('item_name')
                }),
                // new Ext.form.Hidden({
                // id: 'hid_userlist_role',
                // name: 'hid_userlist_role'
                // }),
                // new Ext.form.Hidden({
                //     id: 'hid_userlist',
                //     name: 'hid_userlist'
                // }),
                new Ext.form.Hidden({
                    id: 'pr_quan',
                    name: 'pr_quan',
                    value: new_pr_quans
                }),
                new Ext.form.Hidden({
                    id: 'unique_uids',
                    name: 'unique_uids',
                    value: unique_uids
                }),
                new Ext.form.Hidden({
                    id: 'child',
                    name: 'child',
                    value: child_uids
                }),
                new Ext.form.Hidden({
                    id: 'parent',
                    name: 'parent',
                    value: parent_uids
                }),
                new Ext.form.Hidden({
                    id: 'req_date',
                    name: 'req_date'
                }),
                new Ext.form.Hidden({
                    id: 'type',
                    name: 'type',
                    value: 'BOM'
                }),
                new Ext.form.Hidden({
                    id: 'unit_mass',
                    name: 'unit_mass',
                    value: unit_mass
                }),
                new Ext.form.Hidden({
                    id: 'companyCode',
                    name: 'companyCode',
                    value: vCompanyReserved4
                }),
                {
                    fieldLabel: '청구서명',
                    xtype: 'textarea',
                    rows: 4,
                    anchor: '100%',
                    name: 'reserved_varcharb',
                    hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                }, {
                    fieldLabel: '요청사항',
                    xtype: 'textarea',
                    rows: 4,
                    anchor: '100%',
                    name: 'req_info'
                },
                {
                    xtype: 'datefield',
                    id: 'request_date',
                    name: 'request_date',
                    fieldLabel: toolbar_pj_req_date,
                    format: 'Y-m-d HH:mm:ss',
                    submitFormat: 'Y-m-d HH:mm:ss',// 'Y/m/d H:i:s',
                    dateFormat: 'Y-m-d HH:mm:ss',// 'Y/m/d H:i:s'
                    // value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
                    anchor: '100%',
                    hidden: vCompanyReserved4 == 'KWLM01KR' ? true : false
                },
                {
                    fieldLabel: '구매담당자',
                    xtype: 'combo',
                    anchor: '100%',
                    id: 'po_user_uid',
                    name: 'po_user_uid',
                    store: userStore,
                    displayField: 'user_name',
                    valueField: 'unique_id',
                    emptyText: '선택',
                    allowBlank: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                    hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                    sortInfo: {field: 'user_name', direction: 'ASC'},
                    typeAhead: false,
                    //hideLabel: true,
                    minChars: 1,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{unique_id}">{user_name}</div>';
                        }
                    },
                    listeners: {
                        //    select: function (combo, record) {
                        // 	   var reccode = record.get('area_code');
                        // 	   Ext.getCmp('maker_code').setValue(reccode);
                        //    }
                    }
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
            // defaults: {
            //     layout: 'form',
            //     xtype: 'container',
            //     defaultType: 'textfield',
            //     style: 'width: 100%'
            // },
            items: formItems
        })
        var myHeight = (this.useRouting == true) ? 430 : 410;
        var myWidth = 600;

        var items = [form];
        if (this.useRouting == true) {

            this.rtgapp_store.load();
            var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
            var removeRtgapp = Ext.create('Ext.Action', {
                itemId: 'removeRtgapp',
                glyph: 'xf00d@FontAwesome',
                text: CMD_DELETE,
                disabled: true,
                handler: function (widget, event) {
                    Ext.MessageBox.show({
                        title: delete_msg_title,
                        msg: delete_msg_content,
                        buttons: Ext.MessageBox.YESNO,
                        fn: gm.me().deleteRtgappConfirm,
                        // animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });
                }
            });

            var updown =
                {
                    text: '이동',
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'actioncolumn',
                    width: 70,
                    align: 'center',
                    items: [{
                        icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                        tooltip: 'Up',
                        handler: function (agridV, rowIndex, colIndex) {
                            var record = gm.me().agrid.getStore().getAt(rowIndex);
                            console_log(record);
                            var unique_id = record.get('unique_id');
                            console_log(unique_id);
                            var direcition = -15;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                params: {
                                    direcition: direcition,
                                    unique_id: unique_id
                                },
                                success: function (result, request) {
                                    gm.me().rtgapp_store.load(function () {
                                    });
                                }
                            });

                        }


                    }, '-',
                        {
                            icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                            tooltip: 'Down',
                            handler: function (agridV, rowIndex, colIndex) {

                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = 15;
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                    params: {
                                        direcition: direcition,
                                        unique_id: unique_id
                                    },
                                    success: function (result, request) {
                                        gm.me().rtgapp_store.load(function () {
                                        });
                                    }
                                });
                            }

                        }]
                };

            var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

            this.agrid = Ext.create('Ext.grid.Panel', {
                //title: '결재경로',
                store: this.rtgapp_store,
                border: true,
                frame: true,
                style: 'padding-left:10px;padding-right:10px;',
                width: '100%',
                //layout: 'fit',
                scroll: true,
                selModel: selModel,
                columns: [
                    {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false}
                    , {dataIndex: 'user_id', text: '아이디', sortable: false}
                    , {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                    //,{ dataIndex : 'emp_no', text : '사번',  sortable : false	}
                    //,{ dataIndex : 'company_code', text : '회사 코드',  sortable : false	}
                    , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                    // ,{ dataIndex : 'dept_code', text : '부서 코드',  sortable : false	}
                    //,{ dataIndex : 'app_type', text : 'app_type',  sortable : false	}
                    , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                    // ,{ dataIndex : 'unique_id', text : 'unique_id',  sortable : false	}
                    //,{ dataIndex : 'create_date', text : '생성일자',  sortable : false	}
                    , updown
                ],
                border: false,
                multiSelect: true,
                frame: false,
                dockedItems: [{
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'label',
                            labelWidth: 20,
                            text: '결재 권한자 추가'//,
                            //style: 'color:white;'

                        }, {
                            id: 'user_name',
                            name: 'user_name',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            store: userStore,
                            labelSeparator: ':',
                            emptyText: dbm1_name_input,
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            sortInfo: {field: 'user_name', direction: 'ASC'},
                            typeAhead: false,
                            hideLabel: true,
                            minChars: 2,
                            width: 200,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console_logs('Selected combo : ', combo);
                                    console_logs('Selected record : ', record);
                                    console_logs('Selected Value : ', record.get('unique_id'));

                                    var unique_id = record.get('unique_id');
                                    var user_id = record.get('user_id');
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                        params: {
                                            useruid: unique_id,
                                            userid: user_id
                                            , gubun: 'D'
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            console_log('result:' + result);
                                            if (result == 'false') {
                                                Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                            } else {
                                                gm.me().rtgapp_store.load(function () {
                                                });
                                            }
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }// endofselect
                            }
                        },
                        '->', removeRtgapp

                    ]// endofitems
                }] // endofdockeditems

            }); // endof Ext.create('Ext.grid.Panel',

            this.agrid.getSelectionModel().on({
                selectionchange: function (sm, selections) {
                    if (selections.length) {
                        removeRtgapp.enable();
                    } else {
                        removeRtgapp.disable();
                    }
                }
            });

            items.push(this.agrid);
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '구매 요청',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: items,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {

                    if (btn == "no") {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);

                            //결재사용인 경우 결재 경로 확인
                            if (gm.me().useRouting == true) {

                                var items = gm.me().rtgapp_store.data.items;
                                console_logs('items.length', items.length);
                                if (items.length < 2) {
                                    Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                    return;
                                }

                                var ahid_userlist = new Array();
                                var ahid_userlist_role = new Array();

                                for (var i = 0; i < items.length; i++) {
                                    var rec = items[i];
                                    console_logs('items rec', rec);
                                    ahid_userlist.push(rec.get('usrast_unique_id'));
                                    ahid_userlist_role.push(rec.get('gubun'));
                                }
                                val['hid_userlist'] = ahid_userlist;
                                val['hid_userlist_role'] = ahid_userlist_role;
                            }
                            console_logs('val', val);

                            var myWin = prWin;
                            myWin.setLoading(true);

                            form.submit({
                                url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
                                params: val,
                                success: function (val, action) {
                                    console_logs('----success----', val);
                                    myWin.setLoading(false);
                                    myWin.close();
                                    gm.me().store.load(function () {
                                    });
                                    gm.me().myCartStore.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    console_logs('----failure----', val);
                                    prWin.close();
                                    gm.me().myCartStore.load(function () {
                                    });
                                    gm.me().store.load(function () {
                                    });

                                }
                            });

                        } // end of formvalid
                    } //else
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show(undefined, function () {
            var combo = gu.getCmp('target_supplier');
            console_logs('combo', combo);
            var selections = gm.me().grid.getSelectionModel().getSelection();
            if (selections == null || selections.length == 0) {
                return;
            }
            var rec = selections[0];
            console_logs('rec', rec);
            var supplier_uid = rec.get('coord_key1');
            var supplier_name = rec.get('supplier_name');


            if (combo != null) { //공급사 자동선택
                // combo.setValue(supplier_uid);
                // var record = combo.findRecordByValue(val);
                // if(record!=null) {
                //     combo.select(record);
                // }
                combo.store.load(function (records) {
                    console_logs('combo.store.load records', records);

                    if (records != null) {
                        for (var i = 0; i < records.length; i++) {
                            console_logs('obj', records[i]);

                            var obj = records[i];
                            try {
                                if (obj.get(combo.valueField) == supplier_uid) {
                                    combo.select(obj);
                                }
                            } catch (e) {
                            }
                        }
                    }//endofif

                });


            }//endof if(combo!=null) {
        });


//        var rtgapp_store = new Ext.data.Store({
//            pageSize: getPageSize(),
//            model: 'RtgApp'
//        });
//
//        var removeRtgapp = Ext.create('Ext.Action', {
//            itemId: 'removeRtgapp',
//            iconCls: 'remove',
//            text: CMD_DELETE,
//            disabled: true,
//            handler: function(widget, event) {
//                Ext.MessageBox.show({
//                    title: delete_msg_title,
//                    msg: delete_msg_content,
//                    buttons: Ext.MessageBox.YESNO,
//                    fn: deleteRtgappConfirm,
//                    // animateTarget: 'mb4',
//                    icon: Ext.MessageBox.QUESTION
//                });
//            }
//        });

    }, //ndofdorequest

    // Define process_request Action
    process_requestAction: Ext.create('Ext.Action', {
        itemId: 'process_requestButton',
        iconCls: 'chevron-circle-right',
        text: '생산요청',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '제작요청',
                msg: '제작요청 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: process_requestConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    deleteCartConfirm: function (btn) {
        console_logs('deleteCartConfirm', btn);
        if (btn == 'yes') {
            var selections = gm.me().gridMycart.getSelectionModel().getSelection();
            if (selections) {

                console_logs('selections', selections);

                var targetUid = [];
                for (var i = 0; i < selections.length; i++) {
                    var unique_uid = selections[i].get('unique_uid');
                    targetUid.push(unique_uid);
                }

                console_logs('targetUid', targetUid);

                gm.me().gridMycart.setLoading(true);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=deleteMyCart',
                    params: {
                        assymap_uids: targetUid
                    },
                    success: function (result, request) {
                        gm.me().myCartStore.load(function (records) {

                            for (var i = 0; i < records.length; i++) {
                                var o = records[i];
                                var new_pr_quan = o.get('new_pr_quan');
                                o.set('reserved_double1', new_pr_quan);
                            }
                            gm.me().gridMycart.setLoading(false);

                        });
                    }
                });
            }
        }
    },

    removeCartAction: Ext.create('Ext.Action', {
        itemId: 'removeCartAction',
        iconCls: 'af-remove',
        text: 'Cart' + CMD_DELETE,
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: delete_msg_title,
                msg: delete_msg_content,
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteCartConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    purchase_requestAction: Ext.create('Ext.Action', {

        itemId: 'purchaseButton',
        iconCls: 'font-awesome_4-7-0_dollar_14_0_5395c4_none',
        text: PURCHASE_REQUEST,
        disabled: true,
        handler: function (widget, event) {
            gm.me().doRequestAction(false);

        }// endof handler
    }),


    contextMenuCart: Ext.create('Ext.menu.Menu', {
        items: [ /* addElecAction, editAction, */ this.removeCartAction]
    }),

    copiedPartCnt: 0,
    ongridValveSelection: function (selections) {
        console_logs('--> ongridValveSelection selections', selections);

        if (selections.length > 0) {
            console_logs('enable', selections.length);
            gm.me().removeValveAction.enable();
        } else {
            gm.me().removeValveAction.disable();
        }

    },
    onMygridSelection: function (selections) {
        console_logs('onMygridSelection selections', selections);
        this.selectionLength = selections.length;

        var disable = false; //fPERM_DISABLING()

        if (this.selectionLength > 0) {
            if (disable == true) {
                this.removeCartAction.disable();
                this.req_dateAction.disable();
                this.pastePartAction.disable();
                this.process_requestAction.disable();
                this.purchase_requestAction.disable();
            } else {
                this.removeCartAction.enable();
                this.req_dateAction.enable();
                if (this.copiedPartCnt > 0) {
                    this.pastePartAction.enable();
                }

                this.process_requestAction.enable();
                this.purchase_requestAction.enable();

            }
        } else {
            if (this.gGridMycartSelects.length > 1) {
                this.gridMycart.getView().select(this.gGridMycartSelects);
            }

            //this.collapseProperty();
            this.removeCartAction.disable();
            this.req_dateAction.disable();
            this.pastePartAction.disable();
            this.process_requestAction.disable();
            this.purchase_requestAction.disable();

        }

        this.copyArrayMycartGrid(selections);
    },
    onAssemblyGridSelection: function (selections) {

        if (selections != null && selections.length > 0) {
            gUtil.enable(gm.me().addAssyAction);
            gUtil.enable(gm.me().editAssyAction);

            var rec = selections[0];
            gm.me().selectTreeGrid(rec);

        } else {
            gm.me().selected_tree_record = null;
            gUtil.disable(gm.me().addAssyAction);
            gUtil.disable(gm.me().editAssyAction);

        }
    },
    reSelect: function () {
        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        //this.selectProjectCombo(this.selected_tree_record);
    },
    copyAssemblyAction: Ext.create('Ext.Action', {
        iconCls: 'af-copy',
        text: '복사',
        disabled: true,
        handler: function (widget, event) {
            var selectedTreeRecord = gm.me().selected_tree_record;
            if (selectedTreeRecord != null) {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=copyBomAssembly',
                    params: {
                        id: selectedTreeRecord.get('child'),
                        parent: selectedTreeRecord.get('parent'),
                        unique_uid: selectedTreeRecord.get('unique_uid'),
                        ac_uid: selectedTreeRecord.get('ac_uid'),
                        assy_code: selectedTreeRecord.get('assy_code'),
                        pl_no: selectedTreeRecord.get('pl_no'),
                        bm_quan: selectedTreeRecord.get('bm_quan'),
                        part_folder: selectedTreeRecord.get('part_folder'),
                        part_path: selectedTreeRecord.get('part_path'),
                        pj_code: selectedTreeRecord.get('pj_code')
                    },
                    success: function (result, request) {
                        console_logs('result', result.responseText);
                        gm.me().setCopiedAssyQuan(/*result.responseText*/);

                        var assyline = gm.me().selected_tree_record;
                        var type = (assyline.get('depth') > 1) ? 'Assembly' : '프로젝트';

                        gm.me().showToast('결과', result.responseText + ' ' + type + '가 복사되었습니다.');
                        //Ext.MessageBox.alert('경과', result.responseText + ' ' + type + '가 복사되었습니다.');

                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax
            }

        }
    }),
    addPcsPlanAction: Ext.create('Ext.Action', {
        iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        text: '공정 설계',
        tooltip: '',
        disabled: true,

        handler: function () {


        }
    }),

    removePartAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),


    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {

            if (vCompanyReserved4 == 'SKNH01KR') {
                gm.me().searchStore.getProxy().setExtraParam('standard_flag', 'R');
            }

            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }


            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');

            if (gm.me().checkClosed() == true) {
                return;
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
                params: {
                    pj_code: gm.me().selectedPjCode
                },
                success: function (result, request) {
                    var result = result.responseText;
                    var str = result;
                    var num = Number(str);

                    if (str.length == 3) {
                        num = num;
                    } else if (str.length == 2) {
                        num = '' + num;
                    } else if (str.length == 1) {
                        num = '0' + num;
                    } else {
                        num = num % 1000;
                    }
                    var pl_no = 'A' + num + '0';

                    var lineGap = 30;
                    var bHeight = 600;
                    var bWidth = 600;

                    if (vCompanyReserved4 == 'KWLM01KR') {
                        bHeight = 750;
                        bWidth = 800;
                    }

                    gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                        title: '입력폼',
                        xtype: 'form',
                        width: bWidth,
                        height: bHeight,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        //                    		        // border: 0,
                        //                    	            dockedItems: [
                        //                    	              {
                        //                    				      dock: 'top',
                        //                    				    xtype: 'toolbar',
                        //                    					items: [this.resetAction, '-', this.modRegAction/*, '-', copyRevAction*/]
                        //                    				  }],
                        items: [
                            {
                                xtype: 'displayfield',
                                value: '먼저 등록된 자재인지 검색하세요.'
                            }, {
                                id: gu.id('information'),
                                fieldLabel: '종전자재',
                                field_id: 'information',
                                name: 'information',
                                xtype: 'combo',
                                emptyText: '코드나 규격으로 검색',
                                store: gm.me().searchStore,
                                displayField: 'specification',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                sortInfo: {
                                    field: 'specification',
                                    direction: 'ASC'
                                },
                                minChars: 1,
                                typeAhead: false,
                                hideLabel: true,
                                hideTrigger: true,
                                anchor: '100%',

                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 결과가 없습니다.',

                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
                                            '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font> <font color=#999>{model_no}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                            '</a></div>';
                                    }
                                },
                                pageSize: 10
                            },
                            new Ext.form.Hidden({
                                name: 'parent',
                                value: gm.me().selectedChild
                            }),
                            new Ext.form.Hidden({
                                name: 'parent_uid',
                                value: gm.me().selectedAssyUid
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: gm.me().selectedPjUid
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_code'),
                                name: 'pj_code',
                                value: gm.me().selectedPjCode
                            }),
                            new Ext.form.Hidden({
                                id: 'assy_code',
                                name: 'assy_code',
                                value: gm.me().selectedAssyCode
                            }),
                            new Ext.form.Hidden({
                                id: 'vCompanyReserved4',
                                name: 'vCompanyReserved4',
                                value: vCompanyReserved4
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('coord_key2'),
                                name: 'coord_key2'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('standard_flag'),
                                name: 'standard_flag',
                                value: 'R'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('child'),
                                name: 'child'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('sg_code'),
                                name: 'sg_code',
                                value: 'NSD'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('hier_pos'),
                                name: 'hier_pos'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('assy_name'),
                                name: 'assy_name',
                                value: this.selectedAssyName

                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_name_2'),
                                name: 'pj_name',
                                value: this.selectedPjName
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('isUpdateSpec'),
                                name: 'isUpdateSpec',
                                value: 'false'
                            }),

                            {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '10 0 5 0',
                                defaults: {
                                    msgTarget: 'side',
                                    allowBlank: true,
                                    labelWidth: 60
                                },
                                items: [{
                                    fieldLabel: gm.me().getColName('unique_id'),
                                    xtype: 'textfield',
                                    id: gu.id('unique_id'),
                                    name: 'unique_id',
                                    emptyText: '자재 UID',
                                    flex: 1,
                                    readOnly: true,
                                    width: 300,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                },
                                    {
                                        xtype: 'textfield',
                                        id: gu.id('unique_uid'),
                                        name: 'unique_uid',
                                        emptyText: 'BOM UID',
                                        flex: 1,
                                        readOnly: true,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                    }
                                ]
                            },
                            {
                                xtype: 'triggerfield',
                                fieldLabel: gm.me().getColName('item_code'),
                                id: gu.id('item_code'),
                                name: 'item_code',
                                emptyText: '자동 생성',
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                        }
                                    }
                                },
                                trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                                'onTrigger1Click': function () {
                                    if (vCompanyReserved4 == 'APM01KR') {
                                        var item_code = gm.me().selectedPjCode + gm.me().selectedAssyCode + gu.id('pl_no');
                                    }

                                    var val = gu.getCmp('item_code').getValue();
                                    if (val != null && val != '') {


                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
                                            params: {
                                                item_code: val
                                            },
                                            success: function (result, request) {
                                                var jsonData = Ext.decode(result.responseText);
                                                var records = jsonData.datas;
                                                if (records != null && records.length > 0) {
                                                    //modRegAction.enable();
                                                    //resetPartForm();
                                                    gm.me().setPartFormObj(records[0]);
                                                } else {
                                                    Ext.MessageBox.alert('알림', '알 수없는 자재번호입니다.');
                                                }

                                            },
                                            failure: extjsUtil.failureMessage
                                        });


                                    } //endofif


                                }
                                //readOnly: true,
                                //fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {

                                id: gu.id('standard_flag_disp'),
                                name: 'standard_flag_disp',
                                xtype: 'combo',
                                mode: 'local',
                                editable: true,
                                allowBlank: true,
                                queryMode: 'remote',
                                hidden: (vCompanyReserved4 == 'SKNH01KR'),
                                displayField: 'codeName',
                                value: '',
                                triggerAction: 'all',
                                fieldLabel: gm.me().getColName('sp_code'), // + '*',
                                store: gm.me().commonStandardStore2,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        console_log('Selected Value : ' + combo.getValue());
                                        var systemCode = record.get('systemCode');
                                        var codeNameEn = record.get('codeNameEn');
                                        var codeName = record.get('codeName');
                                        console_log('systemCode : ' + systemCode +
                                            ', codeNameEn=' + codeNameEn +
                                            ', codeName=' + codeName);
                                        gu.getCmp('standard_flag').setValue(systemCode);

                                        gm.me().getPl_no(systemCode);

                                    }
                                }
                            },
                            {
                                xtype: 'fieldset',
                                title: '품번* | 품명*', //panelSRO1139,
                                collapsible: false,
                                defaults: {
                                    labelWidth: 40,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 3,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'textfield',
                                            width: 100,
                                            emptyText: '품번*',
                                            name: 'pl_no',
                                            id: gu.id('pl_no'),
                                            fieldLabel: '품번',
                                            readOnly: false,
                                            allowBlank: false
                                        },
                                            {
                                                xtype: 'textfield',
                                                flex: 1,
                                                emptyText: '품명' + '*',
                                                name: 'item_name',
                                                id: gu.id('item_name'),
                                                fieldLabel: gm.me().getColName('item_name'),
                                                readOnly: false,
                                                allowBlank: false
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('specification') + '*',
                                id: gu.id('specification'),
                                name: 'specification',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('maker_name'),
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                allowBlank: true
                            }
                            // {
                            //     xtype: 'combo',
                            //     fieldLabel: gm.me().getColName('maker_name'),
                            //     id: gu.id('maker_name'),
                            //     name: 'maker_name',
                            //     allowBlank: true,
                            //     displayField: 'supplier_name',
                            //     valueField: 'supplier_name',
                            //     triggerAction: 'all',
                            //     store: gm.me().supastStore,
                            //     minChars: 2,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function() {
                            //             return '<div data-qtip="{supplier_code}">{supplier_name}</div>';
                            //         }
                            //     },
                            //     listeners: {
                            //         // load: function(store, records, successful, operation, options) {
                            //         //     if (this.hasNull) {
                            //         //         var blank = {
                            //         //             systemCode: '',
                            //         //             codeNameEn: '',
                            //         //             codeName: ''
                            //         //         };
                            //         //         this.add(blank);
                            //         //     }
                            //         // },
                            //         select: function(combo, record) {
                            //             console_log('Selected Value : ' + combo.getValue());
                            //             var systemCode = record.get('systemCode');
                            //             var codeNameEn = record.get('codeNameEn');
                            //             var codeName = record.get('codeName');
                            //             console_log('systemCode : ' + systemCode +
                            //                 ', codeNameEn=' + codeNameEn +
                            //                 ', codeName=' + codeName);
                            //         }
                            //     }
                            // }
                            , {
                                id: gu.id('model_no'),
                                name: 'model_no',
                                xtype: 'combo',
                                mode: 'local',
                                editable: true,
                                allowBlank: true,
                                queryMode: 'remote',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                minChars: 1,
                                triggerAction: 'all',
                                fieldLabel: gm.me().getColName('model_no'),
                                store: gm.me().commonModelStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    load: function (store, records, successful, operation, options) {
                                        if (this.hasNull) {
                                            var blank = {
                                                systemCode: '',
                                                codeNameEn: '',
                                                codeName: ''
                                            };
                                            this.add(blank);
                                        }
                                    },
                                    select: function (combo, record) {
                                        console_log('Selected Value : ' + combo.getValue());
                                        var systemCode = record.get('systemCode');
                                        var codeNameEn = record.get('codeNameEn');
                                        var codeName = record.get('codeName');
                                        console_log('systemCode : ' + systemCode +
                                            ', codeNameEn=' + codeNameEn +
                                            ', codeName=' + codeName);
                                    }
                                }
                            }, {
                                id: gu.id('description'),
                                name: 'description',
                                xtype: 'combo',
                                mode: 'local',
                                editable: true,
                                allowBlank: true,
                                queryMode: 'remote',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                triggerAction: 'all',
                                minChars: 2,
                                fieldLabel: gm.me().getColName('description'),
                                store: gm.me().commonDescriptionStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    load: function (store, records, successful, operation, options) {
                                        if (this.hasNull) {
                                            var blank = {
                                                systemCode: '',
                                                codeNameEn: '',
                                                codeName: ''
                                            };

                                            this.add(blank);
                                        }
                                    },
                                    select: function (combo, record) {
                                        console_log('Selected Value : ' + combo.getValue());
                                        var systemCode = record.get('systemCode');
                                        var codeNameEn = record.get('codeNameEn');
                                        var codeName = record.get('codeName');
                                        console_log('systemCode : ' + systemCode +
                                            ', codeNameEn=' + codeNameEn +
                                            ', codeName=' + codeName);
                                    }
                                }
                            }, {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('comment'),
                                id: gu.id('comment'),
                                name: 'comment',
                                allowBlank: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('unit_mass'),  // 단중(단위중량)
                                id: gu.id('unit_mass'),
                                name: 'unit_mass',
                                allowBlank: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                                emptyText: 'Kg',
                                value: 1,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            }, {
                                xtype: 'combo',
                                fieldLabel: gm.me().getColName('notify_flag'),  // 봄 구매여부
                                id: gu.id('notify_flag'),
                                name: 'notify_flag',
                                allowBlank: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                                value: 'N',
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                field_id: 'notify_flag',
                                store: gm.me().notifyStore,
                                displayField: 'display',
                                valueField: 'value',
                                innerTpl: '<div data-qtip="{value}">[{value}]{display}</div>',
                                minChars: 1,
                                typeAhead: true,
                                queryMode: 'remote',
                                // fieldStyle: 'background-color: #FBF8E6'
                            },
                            {
                                xtype: 'checkboxfield',
                                align: 'right',
                                fieldLabel: '화면유지',
                                id: 'win_check',
                                checked: gm.me().win_check == true ? true : false,
                                inputValue: '-1',
                                listeners: {
                                    change: function (checkbox, checked) {

                                        if (checked) {
                                            gm.me().win_check = true;
                                        } else {
                                            gm.me().win_check = false;
                                        }
                                    }
                                }
                            },
                            // {
                            //     xtype: 'combo',
                            //     width: 50,
                            //     fieldLabel: gm.me().getColName('class_code'),
                            //     id: gu.id('class_code'),
                            //     name: 'class_code',
                            //     store: gm.me().claastStore,
                            //     mode:'local',
                            //     queryMode:'remote',
                            //     triggerAction:'all',
                            //     allowBlank: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                            //     hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            //     displayField:'class_name',
                            //     valueField:'class_code',
                            //     listConfig: {
                            //         getInnerTpl: function() {
                            //             return '<divd data-qtip="{class_code}">{class_name}</div>';
                            //         }
                            //     }
                            // },
                            {
                                xtype: 'fieldset',
                                title: '분류코드', //panelSRO1139,
                                collapsible: false,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                defaults: {
                                    labelWidth: 40,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 3,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'combo',
                                            width: 200,
                                            emptyText: '대분류',
                                            id: 'class_code_level_1',
                                            name: 'class_code_level_1',
                                            store: gm.me().claastStore,
                                            mode: 'local',
                                            queryMode: 'remote',
                                            triggerAction: 'all',
                                            allowBlank: true,
                                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                            displayField: 'class_name',
                                            valueField: 'class_code',
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{class_code}">{class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (a, b) {

                                                    // gm.me().claastStore.getProxy().setExtraParam('level1', 1);
                                                    // gm.me().claastStore.getProxy().setExtraParam('parent_class_code', null);

                                                },
                                                beforequery: function () {
                                                    Ext.getCmp('class_code_level_1').clearValue();
                                                    gm.me().claastStore.getProxy().setExtraParam('level1', 1);
                                                    gm.me().claastStore.getProxy().setExtraParam('parent_class_code', null);
                                                    gm.me().claastStore.load();
                                                }
                                            }
                                        },
                                            {
                                                xtype: 'combo',
                                                width: 200,
                                                emptyText: '중분류',
                                                id: 'class_code_level_2',
                                                name: 'class_code_level_2',
                                                store: gm.me().claastStore,
                                                mode: 'local',
                                                queryMode: 'remote',
                                                triggerAction: 'all',
                                                allowBlank: true,
                                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                                displayField: 'class_name',
                                                valueField: 'class_code',
                                                listConfig: {
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{class_code}">{class_name}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    beforequery: function (a, b) {
                                                        Ext.getCmp('class_code_level_2').clearValue();
                                                        var parent_class_code_1 = Ext.getCmp('class_code_level_1').getValue();
                                                        gm.me().claastStore.getProxy().setExtraParam('level1', 2);
                                                        gm.me().claastStore.getProxy().setExtraParam('parent_class_code', parent_class_code_1);

                                                        gm.me().claastStore.load();
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'combo',
                                                flex: 1,
                                                emptyText: '소분류',
                                                id: 'class_code',
                                                name: 'class_code',
                                                store: gm.me().claastStore,
                                                mode: 'local',
                                                queryMode: 'remote',
                                                triggerAction: 'all',
                                                allowBlank: true,
                                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                                displayField: 'class_name',
                                                valueField: 'class_code',
                                                listConfig: {
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{class_code}">{class_name}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    beforequery: function (a, b) {
                                                        Ext.getCmp('class_code').clearValue();
                                                        var parent_class_code_2 = Ext.getCmp('class_code_level_2').getValue();
                                                        gm.me().claastStore.getProxy().setExtraParam('level1', 3);
                                                        gm.me().claastStore.getProxy().setExtraParam('parent_class_code', parent_class_code_2);

                                                        gm.me().claastStore.load();
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            {
                                xtype: 'fieldset',
                                border: true,
                                // style: 'border-width: 0px',
                                title: panelSRO1186 + ' | ' + panelSRO1187 + ' | ' + panelSRO1188 + ' | 통화', //panelSRO1174,
                                collapsible: false,
                                defaults: {
                                    labelWidth: 100,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'numberfield',
                                            minValue: 0,
                                            width: 100,
                                            id: gu.id('bm_quan'),
                                            name: 'bm_quan',
                                            fieldLabel: gm.me().getColName('bm_quan'),
                                            allowBlank: true,
                                            value: '1',
                                            margins: '0'
                                        }, {
                                            width: 100,
                                            id: gu.id('unit_code'),
                                            name: 'unit_code',
                                            xtype: 'combo',
                                            mode: 'local',
                                            editable: true,
                                            allowBlank: true,
                                            queryMode: 'remote',
                                            displayField: 'codeName',
                                            valueField: 'codeName',
                                            value: 'EA',
                                            triggerAction: 'all',
                                            fieldLabel: gm.me().getColName('unit_code'),
                                            store: gm.me().commonUnitStore,
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    console_log('Selected Value : ' + combo.getValue());
                                                    var systemCode = record.get('systemCode');
                                                    var codeNameEn = record.get('codeNameEn');
                                                    var codeName = record.get('codeName');
                                                    console_log('systemCode : ' + systemCode +
                                                        ', codeNameEn=' + codeNameEn +
                                                        ', codeName=' + codeName);
                                                }
                                            }
                                        },
                                            {
                                                xtype: 'numberfield',
                                                // minValue: 0,
                                                flex: 1,
                                                id: gu.id('sales_price'),
                                                name: 'sales_price',
                                                fieldLabel: gm.me().getColName('sales_price'),
                                                allowBlank: true,
                                                value: '0',
                                                margins: '0'
                                            }, {
                                                width: 100,
                                                id: gu.id('currency'),
                                                name: 'currency',
                                                xtype: 'combo',
                                                mode: 'local',
                                                editable: true,
                                                allowBlank: true,
                                                queryMode: 'remote',
                                                displayField: 'codeName',
                                                valueField: 'codeName',
                                                value: 'KRW',
                                                triggerAction: 'all',
                                                fieldLabel: gm.me().getColName('currency'),
                                                store: gm.me().commonCurrencyStore,
                                                listConfig: {
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    select: function (combo, record) {
                                                        console_log('Selected Value : ' + combo.getValue());
                                                        var systemCode = record.get('systemCode');
                                                        var codeNameEn = record.get('codeNameEn');
                                                        var codeName = record.get('codeName');
                                                        console_log('systemCode : ' + systemCode +
                                                            ', codeNameEn=' + codeNameEn +
                                                            ', codeName=' + codeName);
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                xtype: 'button',
                                text: '초기화',
                                scale: 'small',
                                width: 50,
                                maxWidth: 80,
                                style: {
                                    marginTop: '7px',
                                    marginLeft: '550px'
                                },
                                // size:50,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                listeners: {
                                    click: function () {
                                        gm.me().resetPartForm();
                                    }
                                }

                            }, {
                                xtype: 'container',
                                type: 'hbox',
                                padding: '5',
                                pack: 'end',
                                align: 'left',
                                defaults: {},
                                margin: '0 0 0 0',
                                border: false

                            }
                        ]
                    });

                    var partGridWidth = '25%';
                    if (vCompanyReserved4 == 'KWLM01KR') {
                        partGridWidth = '20%';
                    }

                    var searchPartGrid = Ext.create('Ext.grid.Panel', {
                        title: '자재 검색',
                        store: gm.me().searchDetailStore,

                        layout: 'fit',
                        columns: [
                            {text: "품목코드", width: 80, dataIndex: 'item_code', sortable: true},
                            {text: "품명", flex: 1, dataIndex: 'item_name', sortable: true},
                            {text: "규격", width: 125, dataIndex: 'specification', sortable: true},
                            {text: "재질", width: 80, dataIndex: 'model_no', sortable: true},
                            {
                                text: "단가", width: 80, dataIndex: 'sales_price', sortable: true,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                            },
                            {
                                text: "최근 공급사", width: 120, dataIndex: 'supplier_name', sortable: true,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                            }
                        ],
                        border: false,
                        multiSelect: false,
                        frame: false,
                        dockedItems: [{
                            dock: 'top',
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default1',
                            items: [
                                {
                                    width: partGridWidth,
                                    field_id: 'search_item_code',
                                    id: gu.id('search_item_code'),
                                    name: 'search_item_code',
                                    xtype: 'triggerfield',
                                    emptyText: '품목코드',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id: 'search_item_name',
                                    id: gu.id('search_item_name'),
                                    name: 'search_item_name',
                                    xtype: 'triggerfield',
                                    emptyText: '품명',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id: 'search_specification',
                                    id: gu.id('search_specification'),
                                    name: 'search_specification',
                                    xtype: 'triggerfield',
                                    emptyText: '규격',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id: 'search_model_no',
                                    id: gu.id('search_model_no'),
                                    name: 'search_model_no',
                                    xtype: 'triggerfield',
                                    emptyText: '재질',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id: 'search_supplier_name',
                                    id: gu.id('search_supplier_name'),
                                    name: 'search_supplier_name',
                                    xtype: 'triggerfield',
                                    emptyText: '공급사',
                                    hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                }
                            ]
                        }] // endofdockeditems
                    }); // endof Ext.create('Ext.grid.Panel',

                    searchPartGrid.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            console_logs('selections', selections);
                            if (selections != null && selections.length > 0 && selections[0] != null) {
                                gm.me().setBomData(selections[0].getId());
                            }

                        }
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: 'Part 추가',
                        width: bWidth,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        items:
                            [{
                                region: 'center',
                                xtype: 'tabpanel',
                                items: [gm.me().createPartForm, searchPartGrid]
                            }],
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().createPartForm;
                                console_logs('>>11', form);
                                console_logs('>>112', form.isValid());
                                if (form.isValid()) {
                                    console_logs('>>22', '22');
                                    var val = form.getValues(false);
                                    console_logs('>>33', '33');
                                    console_logs('form val', val);

                                    gm.me().registPartFc(val);

                                    if (gm.me().win_check) {
                                        // gm.me().resetPartForm();
                                    } else {
                                        if (winPart) {
                                            winPart.close();
                                        }
                                    }

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }

                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show( /* this, function(){} */);
                } // endofhandler
            });


        },
        failure: extjsUtil.failureMessage
    }),

    partAddAction: Ext.create('Ext.Action', {
        itemId: 'partAddAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: 'Part추가',
        handler: function (widget, event) {

            if (vCompanyReserved4 == 'SKNH01KR') {
                gm.me().searchStore.getProxy().setExtraParam('standard_flag', 'R');
            }

            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }


            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');

            if (gm.me().checkClosed() == true) {
                return;
            }

            var parents = [];
            var parent_uids = [];
            var assy_selections = gm.me().assyGrid.getSelectionModel().getSelection();
            console_logs('===zzzz', assy_selections);
            for (var i = 0; i < assy_selections.length; i++) {
                parents.push(assy_selections[i].get('child'));
                parent_uids.push(assy_selections[i].get('unique_uid'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
                params: {
                    pj_code: gm.me().selectedPjCode
                },
                success: function (result, request) {
                    var result = result.responseText;
                    var str = result;
                    var num = Number(str);

                    if (str.length == 3) {
                        num = num;
                    } else if (str.length == 2) {
                        num = '' + num;
                    } else if (str.length == 1) {
                        num = '0' + num;
                    } else {
                        num = num % 1000;
                    }
                    var pl_no = 'A' + num + '0';

                    var lineGap = 30;
                    var bHeight = 600;
                    var bWidth = 600;

                    if (vCompanyReserved4 == 'KWLM01KR') {
                        bHeight = 750;
                        bWidth = 800;
                    }


                    gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                        title: '입력폼',
                        xtype: 'form',
                        width: bWidth,
                        height: bHeight,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        //                    		        // border: 0,
                        //                    	            dockedItems: [
                        //                    	              {
                        //                    				      dock: 'top',
                        //                    				    xtype: 'toolbar',
                        //                    					items: [this.resetAction, '-', this.modRegAction/*, '-', copyRevAction*/]
                        //                    				  }],
                        items: [{
                            xtype: 'displayfield',
                            value: '먼저 등록된 자재인지 검색하세요.'
                        }, {
                            id: gu.id('information'),
                            fieldLabel: '종전자재',
                            field_id: 'information',
                            name: 'information',
                            xtype: 'combo',
                            emptyText: '코드나 규격으로 검색',
                            store: gm.me().searchStore,
                            displayField: 'specification',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            sortInfo: {
                                field: 'specification',
                                direction: 'ASC'
                            },
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: true,
                            hideTrigger: true,
                            anchor: '100%',

                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 결과가 없습니다.',

                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
                                        '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font> <font color=#999>{model_no}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                        '</a></div>';
                                }
                            },
                            pageSize: 10
                        },
                            new Ext.form.Hidden({
                                name: 'is_multi',
                                value: 'multi'
                            }),
                            new Ext.form.Hidden({
                                name: 'parents',
                                value: parents
                            }),
                            new Ext.form.Hidden({
                                name: 'parent_uids',
                                value: parent_uids
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: gm.me().selectedPjUid
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_code'),
                                name: 'pj_code',
                                value: gm.me().selectedPjCode
                            }),
                            new Ext.form.Hidden({
                                id: 'assy_code',
                                name: 'assy_code',
                                value: gm.me().selectedAssyCode
                            }),
                            new Ext.form.Hidden({
                                id: 'vCompanyReserved4',
                                name: 'vCompanyReserved4',
                                value: vCompanyReserved4
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('coord_key2'),
                                name: 'coord_key2'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('standard_flag'),
                                name: 'standard_flag',
                                value: 'R'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('child'),
                                name: 'child'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('sg_code'),
                                name: 'sg_code',
                                value: 'NSD'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('hier_pos'),
                                name: 'hier_pos'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('assy_name'),
                                name: 'assy_name',
                                value: this.selectedAssyName

                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_name_2'),
                                name: 'pj_name',
                                value: this.selectedPjName
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('isUpdateSpec'),
                                name: 'isUpdateSpec',
                                value: 'false'
                            }),
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '10 0 5 0',
                                defaults: {
                                    allowBlank: true,
                                    msgTarget: 'side',
                                    labelWidth: 60
                                },
                                items: [{
                                    fieldLabel: gm.me().getColName('unique_id'),
                                    xtype: 'textfield',
                                    id: gu.id('unique_id'),
                                    name: 'unique_id',
                                    emptyText: '자재 UID',
                                    flex: 1,
                                    readOnly: true,
                                    width: 300,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                },
                                    {
                                        xtype: 'textfield',
                                        id: gu.id('unique_uid'),
                                        name: 'unique_uid',
                                        emptyText: 'BOM UID',
                                        flex: 1,
                                        readOnly: true,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                    }
                                ]
                            },
                            {
                                xtype: 'triggerfield',
                                fieldLabel: gm.me().getColName('item_code'),
                                id: gu.id('item_code'),
                                name: 'item_code',
                                emptyText: '자동 생성',
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                        }
                                    }
                                },
                                trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                                'onTrigger1Click': function () {
                                    if (vCompanyReserved4 == 'APM01KR') {
                                        var item_code = gm.me().selectedPjCode + gm.me().selectedAssyCode + gu.id('pl_no');
                                    }

                                    var val = gu.getCmp('item_code').getValue();
                                    if (val != null && val != '') {


                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
                                            params: {
                                                item_code: val
                                            },
                                            success: function (result, request) {
                                                var jsonData = Ext.decode(result.responseText);
                                                var records = jsonData.datas;
                                                if (records != null && records.length > 0) {
                                                    //modRegAction.enable();
                                                    //resetPartForm();
                                                    gm.me().setPartFormObj(records[0]);
                                                } else {
                                                    Ext.MessageBox.alert('알림', '알 수없는 자재번호입니다.');
                                                }

                                            },
                                            failure: extjsUtil.failureMessage
                                        });


                                    } //endofif


                                }
                                //readOnly: true,
                                //fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {

                                id: gu.id('standard_flag_disp'),
                                name: 'standard_flag_disp',
                                xtype: 'combo',
                                mode: 'local',
                                editable: true,
                                allowBlank: true,
                                queryMode: 'remote',
                                hidden: (vCompanyReserved4 == 'SKNH01KR'),
                                displayField: 'codeName',
                                value: '',
                                triggerAction: 'all',
                                fieldLabel: gm.me().getColName('sp_code'), // + '*',
                                store: gm.me().commonStandardStore2,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        console_log('Selected Value : ' + combo.getValue());
                                        var systemCode = record.get('systemCode');
                                        var codeNameEn = record.get('codeNameEn');
                                        var codeName = record.get('codeName');
                                        console_log('systemCode : ' + systemCode +
                                            ', codeNameEn=' + codeNameEn +
                                            ', codeName=' + codeName);
                                        gu.getCmp('standard_flag').setValue(systemCode);

                                        gm.me().getPl_no(systemCode);

                                    }
                                }
                            },
                            {
                                xtype: 'fieldset',
                                title: '품번* | 품명*', //panelSRO1139,
                                collapsible: false,
                                defaults: {
                                    labelWidth: 40,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 3,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'textfield',
                                            width: 100,
                                            emptyText: '품번*',
                                            name: 'pl_no',
                                            id: gu.id('pl_no'),
                                            fieldLabel: '품번',
                                            readOnly: false,
                                            allowBlank: false
                                        },
                                            {
                                                xtype: 'textfield',
                                                flex: 1,
                                                emptyText: '품명' + '*',
                                                name: 'item_name',
                                                id: gu.id('item_name'),
                                                fieldLabel: gm.me().getColName('item_name'),
                                                readOnly: false,
                                                allowBlank: false
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('specification') + '*',
                                id: gu.id('specification'),
                                name: 'specification',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('maker_name'),
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                allowBlank: true
                            }
                            // {
                            //     xtype: 'combo',
                            //     fieldLabel: gm.me().getColName('maker_name'),
                            //     id: gu.id('maker_name'),
                            //     name: 'maker_name',
                            //     allowBlank: true,
                            //     displayField: 'supplier_name',
                            //     valueField: 'supplier_name',
                            //     triggerAction: 'all',
                            //     store: gm.me().supastStore,
                            //     minChars: 2,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function() {
                            //             return '<div data-qtip="{supplier_code}">{supplier_name}</div>';
                            //         }
                            //     },
                            //     listeners: {
                            //         // load: function(store, records, successful, operation, options) {
                            //         //     if (this.hasNull) {
                            //         //         var blank = {
                            //         //             systemCode: '',
                            //         //             codeNameEn: '',
                            //         //             codeName: ''
                            //         //         };
                            //         //         this.add(blank);
                            //         //     }
                            //         // },
                            //         select: function(combo, record) {
                            //             console_log('Selected Value : ' + combo.getValue());
                            //             var systemCode = record.get('systemCode');
                            //             var codeNameEn = record.get('codeNameEn');
                            //             var codeName = record.get('codeName');
                            //             console_log('systemCode : ' + systemCode +
                            //                 ', codeNameEn=' + codeNameEn +
                            //                 ', codeName=' + codeName);
                            //         }
                            //     }
                            // }
                            , {
                                id: gu.id('model_no'),
                                name: 'model_no',
                                xtype: 'combo',
                                mode: 'local',
                                editable: true,
                                allowBlank: true,
                                queryMode: 'remote',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                minChars: 1,
                                triggerAction: 'all',
                                fieldLabel: gm.me().getColName('model_no'),
                                store: gm.me().commonModelStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    load: function (store, records, successful, operation, options) {
                                        if (this.hasNull) {
                                            var blank = {
                                                systemCode: '',
                                                codeNameEn: '',
                                                codeName: ''
                                            };
                                            this.add(blank);
                                        }
                                    },
                                    select: function (combo, record) {
                                        console_log('Selected Value : ' + combo.getValue());
                                        var systemCode = record.get('systemCode');
                                        var codeNameEn = record.get('codeNameEn');
                                        var codeName = record.get('codeName');
                                        console_log('systemCode : ' + systemCode +
                                            ', codeNameEn=' + codeNameEn +
                                            ', codeName=' + codeName);
                                    }
                                }
                            }, {
                                id: gu.id('description'),
                                name: 'description',
                                xtype: 'combo',
                                mode: 'local',
                                editable: true,
                                allowBlank: true,
                                queryMode: 'remote',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                triggerAction: 'all',
                                minChars: 2,
                                fieldLabel: gm.me().getColName('description'),
                                store: gm.me().commonDescriptionStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    load: function (store, records, successful, operation, options) {
                                        if (this.hasNull) {
                                            var blank = {
                                                systemCode: '',
                                                codeNameEn: '',
                                                codeName: ''
                                            };

                                            this.add(blank);
                                        }
                                    },
                                    select: function (combo, record) {
                                        console_log('Selected Value : ' + combo.getValue());
                                        var systemCode = record.get('systemCode');
                                        var codeNameEn = record.get('codeNameEn');
                                        var codeName = record.get('codeName');
                                        console_log('systemCode : ' + systemCode +
                                            ', codeNameEn=' + codeNameEn +
                                            ', codeName=' + codeName);
                                    }
                                }
                            }, {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('comment'),
                                id: gu.id('comment'),
                                name: 'comment',
                                allowBlank: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('unit_mass'),  // 단중(단위중량)
                                id: gu.id('unit_mass'),
                                name: 'unit_mass',
                                allowBlank: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                                emptyText: 'Kg',
                                value: 1,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            }, {
                                xtype: 'combo',
                                fieldLabel: gm.me().getColName('notify_flag'),  // 봄 구매여부
                                id: gu.id('notify_flag'),
                                name: 'notify_flag',
                                allowBlank: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                                value: 'N',
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                field_id: 'notify_flag',
                                store: gm.me().notifyStore,
                                displayField: 'display',
                                valueField: 'value',
                                innerTpl: '<div data-qtip="{value}">[{value}]{display}</div>',
                                minChars: 1,
                                typeAhead: true,
                                queryMode: 'remote',
                                // fieldStyle: 'background-color: #FBF8E6'
                            }, {
                                xtype: 'checkboxfield',
                                align: 'right',
                                fieldLabel: '화면유지',
                                id: 'win_check',
                                checked: gm.me().win_check == true ? true : false,
                                inputValue: '-1',
                                listeners: {
                                    change: function (checkbox, checked) {

                                        if (checked) {
                                            gm.me().win_check = true;
                                        } else {
                                            gm.me().win_check = false;
                                        }
                                    }
                                }
                            },
                            // {
                            //     xtype: 'combo',
                            //     width: 50,
                            //     fieldLabel: gm.me().getColName('class_code'),
                            //     id: gu.id('class_code'),
                            //     name: 'class_code',
                            //     store: gm.me().claastStore,
                            //     mode:'local',
                            //     queryMode:'remote',
                            //     triggerAction:'all',
                            //     allowBlank: vCompanyReserved4 == 'KWLM01KR' ? true : false,
                            //     hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            //     displayField:'class_name',
                            //     valueField:'class_code',
                            //     listConfig: {
                            //         getInnerTpl: function() {
                            //             return '<divd data-qtip="{class_code}">{class_name}</div>';
                            //         }
                            //     }
                            // },
                            {
                                xtype: 'fieldset',
                                title: '분류코드', //panelSRO1139,
                                collapsible: false,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                defaults: {
                                    labelWidth: 40,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 3,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'combo',
                                            width: 200,
                                            emptyText: '대분류',
                                            id: 'class_code_level_1',
                                            name: 'class_code_level_1',
                                            store: gm.me().claastStore,
                                            mode: 'local',
                                            queryMode: 'remote',
                                            triggerAction: 'all',
                                            allowBlank: true,
                                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                            displayField: 'class_name',
                                            valueField: 'class_code',
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{class_code}">{class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (a, b) {

                                                    // gm.me().claastStore.getProxy().setExtraParam('level1', 1);
                                                    // gm.me().claastStore.getProxy().setExtraParam('parent_class_code', null);

                                                },
                                                beforequery: function () {
                                                    Ext.getCmp('class_code_level_1').clearValue();
                                                    gm.me().claastStore.getProxy().setExtraParam('level1', 1);
                                                    gm.me().claastStore.getProxy().setExtraParam('parent_class_code', null);
                                                    gm.me().claastStore.load();
                                                }
                                            }
                                        },
                                            {
                                                xtype: 'combo',
                                                width: 200,
                                                emptyText: '중분류',
                                                id: 'class_code_level_2',
                                                name: 'class_code_level_2',
                                                store: gm.me().claastStore,
                                                mode: 'local',
                                                queryMode: 'remote',
                                                triggerAction: 'all',
                                                allowBlank: true,
                                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                                displayField: 'class_name',
                                                valueField: 'class_code',
                                                listConfig: {
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{class_code}">{class_name}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    beforequery: function (a, b) {
                                                        Ext.getCmp('class_code_level_2').clearValue();
                                                        var parent_class_code_1 = Ext.getCmp('class_code_level_1').getValue();
                                                        gm.me().claastStore.getProxy().setExtraParam('level1', 2);
                                                        gm.me().claastStore.getProxy().setExtraParam('parent_class_code', parent_class_code_1);

                                                        gm.me().claastStore.load();
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'combo',
                                                flex: 1,
                                                emptyText: '소분류',
                                                id: 'class_code',
                                                name: 'class_code',
                                                store: gm.me().claastStore,
                                                mode: 'local',
                                                queryMode: 'remote',
                                                triggerAction: 'all',
                                                allowBlank: true,
                                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                                displayField: 'class_name',
                                                valueField: 'class_code',
                                                listConfig: {
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{class_code}">{class_name}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    beforequery: function (a, b) {
                                                        Ext.getCmp('class_code').clearValue();
                                                        var parent_class_code_2 = Ext.getCmp('class_code_level_2').getValue();
                                                        gm.me().claastStore.getProxy().setExtraParam('level1', 3);
                                                        gm.me().claastStore.getProxy().setExtraParam('parent_class_code', parent_class_code_2);

                                                        gm.me().claastStore.load();
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            {
                                xtype: 'fieldset',
                                border: true,
                                // style: 'border-width: 0px',
                                title: panelSRO1186 + ' | ' + panelSRO1187 + ' | ' + panelSRO1188 + ' | 통화', //panelSRO1174,
                                collapsible: false,
                                defaults: {
                                    labelWidth: 100,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                            xtype: 'numberfield',
                                            minValue: 0,
                                            width: 100,
                                            id: gu.id('bm_quan'),
                                            name: 'bm_quan',
                                            fieldLabel: gm.me().getColName('bm_quan'),
                                            allowBlank: true,
                                            value: '1',
                                            margins: '0'
                                        }, {
                                            width: 100,
                                            id: gu.id('unit_code'),
                                            name: 'unit_code',
                                            xtype: 'combo',
                                            mode: 'local',
                                            editable: true,
                                            allowBlank: true,
                                            queryMode: 'remote',
                                            displayField: 'codeName',
                                            valueField: 'codeName',
                                            value: 'EA',
                                            triggerAction: 'all',
                                            fieldLabel: gm.me().getColName('unit_code'),
                                            store: gm.me().commonUnitStore,
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    console_log('Selected Value : ' + combo.getValue());
                                                    var systemCode = record.get('systemCode');
                                                    var codeNameEn = record.get('codeNameEn');
                                                    var codeName = record.get('codeName');
                                                    console_log('systemCode : ' + systemCode +
                                                        ', codeNameEn=' + codeNameEn +
                                                        ', codeName=' + codeName);
                                                }
                                            }
                                        },
                                            {
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                flex: 1,
                                                id: gu.id('sales_price'),
                                                name: 'sales_price',
                                                fieldLabel: gm.me().getColName('sales_price'),
                                                allowBlank: true,
                                                value: '0',
                                                margins: '0'
                                            }, {
                                                width: 100,
                                                id: gu.id('currency'),
                                                name: 'currency',
                                                xtype: 'combo',
                                                mode: 'local',
                                                editable: true,
                                                allowBlank: true,
                                                queryMode: 'remote',
                                                displayField: 'codeName',
                                                valueField: 'codeName',
                                                value: 'KRW',
                                                triggerAction: 'all',
                                                fieldLabel: gm.me().getColName('currency'),
                                                store: gm.me().commonCurrencyStore,
                                                listConfig: {
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    select: function (combo, record) {
                                                        console_log('Selected Value : ' + combo.getValue());
                                                        var systemCode = record.get('systemCode');
                                                        var codeNameEn = record.get('codeNameEn');
                                                        var codeName = record.get('codeName');
                                                        console_log('systemCode : ' + systemCode +
                                                            ', codeNameEn=' + codeNameEn +
                                                            ', codeName=' + codeName);
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                xtype: 'button',
                                text: '초기화',
                                scale: 'small',
                                width: 50,
                                maxWidth: 80,
                                style: {
                                    marginTop: '7px',
                                    marginLeft: '550px'
                                },
                                // size:50,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                listeners: {
                                    click: function () {
                                        gm.me().resetPartForm();
                                    }
                                }

                            }, {
                                xtype: 'container',
                                type: 'hbox',
                                padding: '5',
                                pack: 'end',
                                align: 'left',
                                defaults: {},
                                margin: '0 0 0 0',
                                border: false

                            }
                        ]
                    });

                    var partGridWidth = '25%';
                    if (vCompanyReserved4 == 'KWLM01KR') {
                        partGridWidth = '20%';
                    }

                    var searchPartGrid = Ext.create('Ext.grid.Panel', {
                        title: '자재 검색',
                        store: gm.me().searchDetailStore,

                        layout: 'fit',
                        columns: [
                            {text: "품목코드", width: 80, dataIndex: 'item_code', sortable: true},
                            {text: "품명", flex: 1, dataIndex: 'item_name', sortable: true},
                            {text: "규격", width: 125, dataIndex: 'specification', sortable: true},
                            {text: "재질", width: 80, dataIndex: 'model_no', sortable: true},
                            {
                                text: "단가", width: 40, dataIndex: 'sales_price', sortable: true,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                            },
                            {
                                text: "중량", width: 40, dataIndex: 'mass', sortable: true,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                            },
                            {
                                text: "최근 공급사", width: 90, dataIndex: 'supplier_name', sortable: true,
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                            }
                        ],
                        //  border: false,
                        multiSelect: false,
                        // frame: false,
                        pageSize: 100,
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: gm.me().searchDetailStore,
                            displayInfo: true,
                            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                            emptyMsg: "표시할 항목이 없습니다."
                            , listeners: {
                                beforechange: function (page, currentPage) {

                                }
                            }

                        }),
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default1',
                                items: [
                                    {
                                        width: partGridWidth,
                                        field_id: 'search_item_code',
                                        id: gu.id('search_item_code'),
                                        name: 'search_item_code',
                                        xtype: 'triggerfield',
                                        emptyText: '품목코드',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners: {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        width: partGridWidth,
                                        field_id: 'search_item_name',
                                        id: gu.id('search_item_name'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        emptyText: '품명',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners: {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        width: partGridWidth,
                                        field_id: 'search_specification',
                                        id: gu.id('search_specification'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        emptyText: '규격',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners: {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        width: partGridWidth,
                                        field_id: 'search_model_no',
                                        id: gu.id('search_model_no'),
                                        name: 'search_model_no',
                                        xtype: 'triggerfield',
                                        emptyText: '재질',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners: {
                                            specialkey: function (fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    }, {
                                        width: partGridWidth,
                                        field_id: 'search_supplier_name',
                                        id: gu.id('search_supplier_name'),
                                        name: 'search_supplier_name',
                                        xtype: 'triggerfield',
                                        emptyText: '공급사',
                                        hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                //if (e.getKey() == Ext.EventObject.ENTER) {
                                                gm.me().redrawSearchStore();
                                                //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                //}
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    }
                                ]
                            }] // endofdockeditems
                    }); // endof Ext.create('Ext.grid.Panel',

                    searchPartGrid.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            console_logs('selections', selections);
                            if (selections != null && selections.length > 0 && selections[0] != null) {
                                gm.me().setBomData(selections[0].getId());
                            }

                        }
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: 'Part 추가',
                        width: bWidth,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        items:
                            [{
                                region: 'center',
                                xtype: 'tabpanel',
                                items: [gm.me().createPartForm, searchPartGrid]
                            }],
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().createPartForm;

                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);

                                    gm.me().registPartFc(val);

                                    if (gm.me().win_check) {
                                        // gm.me().resetPartForm();
                                    } else {
                                        if (winPart) {
                                            winPart.close();
                                        }
                                    }
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }

                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show( /* this, function(){} */);
                } // endofhandler
            });


        },
        failure: extjsUtil.failureMessage
    }),

    copyPartAction: Ext.create('Ext.Action', {
        iconCls: 'af-copy',
        text: '복사',
        disabled: true,
        handler: function (widget, event) {
            var grid = gm.me().grid;
            // make uidlist
            var uidList = [];
            var selections = grid.getSelectionModel().getSelection();
            if (selections) {
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var standard_flag = rec.get('standard_flag');
                    if (standard_flag != 'A') {//파트복사는 Assembly 제외
                        uidList.push(rec.get('unique_uid'));
                    }
                }
            }

            if (uidList.length > 0) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=copyBomPart',
                    params: {
                        uidList: uidList
                    },
                    success: function (result, request) {
//                        	console_logs('result', result.responseText);
                        gm.me().setCopiedPartQuan(Number(result.responseText));
                        gm.me().showToast('결과', result.responseText + '개 자재가 복사되었습니다.');
//                            Ext.MessageBox.alert('경과', result.responseText + '개 자재가 복사되었습니다.');

                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax
            } else {
                Ext.MessageBox.alert('알림', '선택한 항목에 자재가 존재하지 않습니다. <br>Assembly 복사를 활용하세요.');
            }


        }
    }),

    //Mycart
    addMyCartAction: Ext.create('Ext.Action', {

        itemId: 'addMyCartAction',
        iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
        text: gm.getMC('CMD_Add_to_Cart', '카트담기'),
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            var my_child = new Array();
            var my_assymap_uid = new Array();
            var my_pl_no = new Array();
            var my_pr_quan = new Array();
            var my_item_code = new Array();
            var my_sales_price = new Array();

            var arrExist = [];
            var new_arr = [];

            var selections = gm.me().grid.getSelectionModel().getSelection();
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var unique_uid = rec.get('unique_uid');
                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                var pl_no = rec.get('pl_no');
                var sales_price = rec.get('sales_price');

                var bEx = gm.me().isExistMyCart(unique_uid);

                new_arr.push(rec);
                console_logs('bEx', bEx)
                if (bEx == false) {
                    my_child.push(rec.get('unique_id'));
                    my_assymap_uid.push(unique_uid);
                    my_pl_no.push(pl_no);
                    my_pr_quan.push(rec.get('new_pr_quan'));
                    my_item_code.push(item_code);
                    my_sales_price.push(sales_price);
                } else {
                    arrExist.push('[' + pl_no + '] \'' + item_name + '\'');
                }

            }

            if (arrExist.length > 0) {
                Ext.MessageBox.alert('경고', arrExist[0] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');
            }


            if (my_assymap_uid.length > 0) {
//                	var tab = gu.getCmp("main2");
//                	tab.setLoading(true);

                gm.me().grid.setLoading(true);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
                    params: {
                        childs: my_child,
                        assymap_uids: my_assymap_uid,
                        pl_nos: my_pl_no,
                        pr_quans: my_pr_quan,
                        item_codes: my_item_code,
                        sales_prices: my_sales_price
                    },
                    success: function (result, request) {
                        gm.me().myCartStore.load(function (records) {
                            var tab = gm.me().center;
                            tab.setActiveTab(gm.me().mycartTab);
                            tab.setLoading(false);

                            if (records != null) {
                                for (var i = 0; i < records.length; i++) {
                                    var o = records[i];
                                    var new_pr_quan = o.get('new_pr_quan');
                                    o.set('reserved_double1', new_pr_quan);
                                }
                            }

                            gm.me().grid.setLoading(false);
                            gm.me().grid.getSelectionModel().deselect(new_arr);


                            Ext.MessageBox.alert('알림', '카트담기 성공.', function callBack(id) {
                                return;
                            });
                        });
                    }
                });
            }


        }//endofhandler

    }),

    //Assembly Mycart
    addAssemblyCartAction: Ext.create('Ext.Action', {

        itemId: 'addAssemblyCartAction',
        iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
        text: '전체카트담기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            var my_child = new Array();
            var my_assymap_uid = new Array();
            var my_pl_no = new Array();
            var my_pr_quan = new Array();
            var my_item_code = new Array();
            var my_sales_price = new Array();

            var arrExist = [];
            var new_arr = [];

            var rec = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            console_logs('===rec2', rec);
            var rec_ac_uid = rec.get('ac_uid');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=cloudread&BOM=T',
                params: {
                    parent_uids: gm.me().assembly_uids,
                    ac_uid: rec_ac_uid
                    // ac_uid: gm.me().ac_uid
                },
                success: function (result, request) {
                    var text = result.responseText;
                    // console_logs('==')
                    var o2 = JSON.parse(text, function (key, value) {
                        return value;
                    });
                    console_logs('===aaaa', o2.datas);

                    var selections = o2.datas;
                    console_logs('===selections', selections);
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_uid = rec['unique_uid'];
                        var item_code = rec['item_code'];
                        var item_name = rec['item_name'];
                        var pl_no = rec['pl_no'];
                        var sales_price = rec['sales_price'];

                        var bEx = gm.me().isExistMyCart(unique_uid);

                        new_arr.push(rec);
                        console_logs('bEx', bEx)
                        if (bEx == false) {
                            my_child.push(rec['unique_id']);
                            my_assymap_uid.push(unique_uid);
                            my_pl_no.push(pl_no);
                            my_pr_quan.push(rec['new_pr_quan']);
                            my_item_code.push(item_code);
                            my_sales_price.push(sales_price);
                        } else {
                            arrExist.push('[' + pl_no + '] \'' + item_name + '\'');
                        }
                    }

                    if (my_assymap_uid.length > 0) {

                        gm.me().grid.setLoading(true);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
                            params: {
                                childs: my_child,
                                assymap_uids: my_assymap_uid,
                                pl_nos: my_pl_no,
                                pr_quans: my_pr_quan,
                                item_codes: my_item_code,
                                sales_prices: my_sales_price
                            },
                            success: function (result, request) {
                                gm.me().myCartStore.load(function (records) {
                                    var tab = gm.me().center;
                                    tab.setActiveTab(gm.me().mycartTab);
                                    tab.setLoading(false);

                                    if (records != null) {
                                        for (var i = 0; i < records.length; i++) {
                                            var o = records[i];
                                            var new_pr_quan = o.get('new_pr_quan');
                                            o.set('reserved_double1', new_pr_quan);
                                        }
                                    }

                                    gm.me().grid.setLoading(false);
                                    gm.me().grid.getSelectionModel().deselect(new_arr);


                                    Ext.MessageBox.alert('알림', '카트담기 성공.', function callBack(id) {
                                        return;
                                    });
                                });
                            }
                        });
                    }
                }
            });
        }//endofhandler

    }),

    // BOM수정
    editPartAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: 'Part 수정하기',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().checkClosed() == true) {
                return;
            }
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var rec = selections[0];
            console_logs('=>selections', selections);

            var uniqueId = gm.me().assymapUidbom;
            var pcr_div = gm.me().assymapPcr_div;
            var bm_quan = gm.me().assymapBmQuan;
            var hier_pos = gm.me().assyId;
            var pl_no = gm.me().assymapPlNo;
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            var maker_name = rec.get('maker_name');
            var model_no = rec.get('model_no');
            var description = rec.get('description');
            var comment = rec.get('comment');
            var unique_id_long = rec.get('unique_id_long');
            var item_code = rec.get('item_code');
            var static_sales_price = rec.get('static_sales_price');

            var lineGap = 30;
            var bHeight = 260;

            var inputItem = [];
//                inputItem.push({
//                    xtype: 'textfield',
//                    name: 'hier_pos',
//                    fieldLabel: 'ID',
//                    anchor: '-5',
//                    // readOnly : true,
//                    // fieldStyle : 'background-color: #ddd;
//                    // background-image: none;',
//                    allowBlank: true,
//                    value: hier_pos,
//                    editable: true
//                });
            // inputItem.push({
            //     xtype: 'textfield',
            //     name: 'unique_id_long',
            //     fieldLabel: 'UID',
            //     anchor: '-5',
            //     allowBlank: true,
            //     editable: true,
            //     value: unique_id_long,
            //     readOnly : true,
            //     fieldStyle : 'background-color: #ddd;'
            //     // background-image: none;'
            // });

            inputItem.push({
                xtype: 'textfield',
                name: 'pl_no',
                fieldLabel: '품번',
                anchor: '-5',
                allowBlank: true,
                editable: true // ,
                ,
                value: pl_no
                // readOnly : false
                // ,
                // fieldStyle : 'background-color: #ddd;
                // background-image: none;'
            });

            inputItem.push({
                fieldLabel: 'BOM수량',
                x: 5,
                y: 0 + 3 * lineGap,
                name: 'bm_quan',
                // readOnly : false,
                allowBlank: true,
                editable: true,
                value: bm_quan,
                anchor: '-5' // anchor width by
                // percentage
            });

            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('BomEditPanel'),
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                defaults: {
                    // anchor: '100%',
                    editable: true,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: inputItem
            });
            var win = Ext.create('ModalWindow', {
                title: 'BOM 수정',
                width: 400,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gu.getCmp('BomEditPanel').getForm();
                        if (form.isValid()) {
                            var val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
                                params: {

                                    unique_id: uniqueId, // 유니크아이디
                                    // id: val['unique_id_long'], // ID
                                    pl_no: val['pl_no'], // Level
                                    pcrDiv: val['pcr_div'], // 조달구분
                                    bmQuan: val['bm_quan'], // bmQuan
                                    // item_name: val['item_name'], // 품명
                                    // specification : val['specification'], // 규격
                                    // maker_name : val['maker_name'], // 제조원
                                    // model_no : val['model_no'], // 재질
                                    // description : val['description'], //후처리
                                    // comment : val['comment'] // 열처리


                                },
                                success: function (result, request) {

                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                            if (win) {
                                win.close();
                            }
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                        }

                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show( /* this, function(){} */);
        } // endofhandler
    }),

    AttachFileViewAction: Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: '첨부파일',
        tooltip: '첨부파일',
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().grid.getSelectionModel().getSelection()[0];
            gm.me().AttachFileDetailview(selections);
        }
    }),

    RemoveFileViewAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '매칭삭제',
        tooltip: '매칭삭제',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목의 매칭 파일을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().RemoveFileDetailview,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    readHistoryAction: Ext.create('Ext.Action', {
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '이력조회',
        tooltip: '이력조회',
        disabled: true,
        handler: function (widget, event) {
            gm.me().readHistroyView();
        }
    }),

    subContractAction: Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: '사급처리',
        tooltip: '사급',
        disabled: true,
        handler: function (widget, event) {
            var selection = gm.me().grid.getSelectionModel().getSelection()[0];
            var pj_uid = selection.get('ac_uid');
            var parent = selection.get('parent');
            var child = selection.get('unique_id_long');

            Ext.MessageBox.show({
                title: '사급처리',
                msg: '해당 자재를 사급처리 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function (btn) {
                    // var result = MessageBox.msg('{0}', btn);
                    if (btn == 'yes') {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design/bom.do?method=subcontractBom',
                            params: {
                                pj_uid: pj_uid,
                                parent: parent,
                                child: child
                            },
                            success: function (result, request) {
                                gm.me().cloudProjectTreeStore.load(function () {
                                    gm.me().assyGrid.expandAll();
                                });

                                // gm.me().assyGrid.expandAll();
                                // gm.me().store.load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    } else {
                        return;
                    }
                }
            });
        }
    }),

    // PDF 파일 출력기능
    printPDFAction: Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: 'PDF',
        tooltip: 'PartList 출력',
        disabled: false,
        handler: function (widget, event) {
            var ac_uid = gm.me().ac_uid;
            var assy_uid = gm.me().assy_uid;
            console_logs('selected_tree_record', gm.me().selected_tree_record);
            console_logs('class_code', gm.me().classCode);
            console_logs('item_code', gm.me().selectedAssyCode);
            console_logs('model_no', gm.me().modelNo);
            console_logs('description', gm.me().description);
            console_logs('parent', gm.me().selectedChild);
            console_logs('parent_uid', gm.me().selectedAssyUid);

            console_logs('assy_uid', assy_uid);
            console_logs('ac_uid', ac_uid);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/pdf.do?method=printPl',
                params: {
                    rtgast_uid: gm.me().selectedAssyUid,
                    parent_uid: gm.me().selectedAssyUid,
                    po_no: ac_uid,
                    pdfPrint: 'pdfPrint',
                    is_rotate: 'N'
                },
                reader: {
                    pdfPath: 'pdfPath'
                },
                success: function (result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var pdfPath = jsonData.pdfPath;
                    console_logs(pdfPath);
                    if (pdfPath.length > 0) {
                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                        top.location.href = url;
                    }
                },
                failure: extjsUtil.failureMessage
            });


        }
    }),

    removeAssyAction: Ext.create('Ext.Action', {
        itemId: 'removeAssyAction',
        iconCls: 'af-remove',
        text: CMD_DELETE,
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: delete_msg_title,
                msg: delete_msg_content,
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteAssyConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    editAssyAction: Ext.create('Ext.Action', {
        itemId: 'editAssyAction',
        iconCls: 'af-edit',
        disabled: true,
        text: gm.getMC('CMD_MODIFY', '수정'),
        handler: function (widget, event) {

            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            if (gm.me().selected_tree_record == null) {
                return;
            }

            if (gm.me().checkClosed() == true) {
                return;
            }

            var unique_id = gm.me().selected_tree_record.get('child');
            var assy_code = gm.me().selected_tree_record.get('assy_code');
            var assy_name = gm.me().selected_tree_record.get('assy_name');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var parent = gm.me().selected_tree_record.get('parent');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var pl_no = gm.me().selected_tree_record.get('pl_no');
            var bm_quan = gm.me().selected_tree_record.get('bm_quan');
            var reserved_varchar1 = gm.me().selected_tree_record.get('reserved_varchar1');
            var pclass_code = gm.me().selected_tree_record.get('pclass_code');
            var lineGap = 30;
            var bHeight = 300;
            var bWidth = 400;

            var area = gu.Comma2Area(reserved_varchar1);


            var inputItem = [];
            inputItem.push({
                xtype: 'textfield',
                name: 'unique_uid',
                fieldLabel: 'Unique UID',
                allowBlank: false,
                value: unique_uid,
                anchor: '-5',
                readOnly: true,
                fieldStyle: 'background-color: #ddd; background-image: none;'
            });
            inputItem.push({
                xtype: 'textfield',
                name: 'unique_id',
                fieldLabel: 'Child UID',
                allowBlank: false,
                value: unique_id,
                anchor: '-5',
                readOnly: true,
                fieldStyle: 'background-color: #ddd; background-image: none;'
            });
            inputItem.push(
                {
                    xtype: 'textfield',
                    name: 'assy_code',
                    fieldLabel: 'Assembly 코드',
                    allowBlank: false,
                    value: assy_code,
                    anchor: '-5',
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                });
            inputItem.push({
                xtype: 'textfield',
                name: 'assy_name',
                fieldLabel: 'Assembly 명',
                allowBlank: false,
                value: assy_name,
                anchor: '-5'
            });
            inputItem.push({
                xtype: 'textfield',
                name: 'pl_no',
                fieldLabel: '파트순번',
                allowBlank: false,
                value: pl_no,
                anchor: '-5'
            });
            inputItem.push({
                xtype: 'numberfield',
                name: 'bm_quan',
                fieldLabel: '수량',
                allowBlank: false,
                value: bm_quan,
                anchor: '-5'
            });


            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('modformPanel'),
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                region: 'center',
                defaults: {
                    // anchor: '100%',
                    editable: true,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: inputItem
            });

            var winItems = [form];

//                if(pclass_code=='ACT') {
//                	bWidth = 500;
//                	winItems.push({
//                        region: 'east',
//                        //title: 'VALVE NO.',
//                        width: 200,
//                        split: true,
//                        collapsible: false,
//                        floatable: false,
//                        style: 'margin-bottom:10px;margin-top:15px;',
//                        items: {
//	                        xtype: 'textarea',
//	                        labelAlign: 'top',
//	                        emptyText: 'VALVE NO.',
//	                        //fieldLabel: 'VALVE NO.',
//	                        name : 'reserved_varchar1',
//	                        value: area,
//	                        readOnly : false,
//	                        editable:true,
//
//	                        height: '100%'
//	                    }
//                	});
//                }

            var win = Ext.create('ModalWindow', {
                title: 'Assembly 수정',
                width: bWidth,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: winItems,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gu.getCmp('modformPanel').getForm();
                        if (form.isValid()) {
                            var val = form.getValues(false);


                            var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                            gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                            gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                            gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                            gm.me().selected_tree_record.set('text', text);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=updateSrcahdAssymap',
                                params: {

                                    unique_uid: val['unique_uid'],
                                    unique_id: val['unique_id'],
                                    pl_no: val['pl_no'],
                                    bm_quan: val['bm_quan'],
                                    item_name: val['assy_name']

                                },
                                success: function (result, request) {

                                    // productlist.store.getProxy().setExtraParam('class_code',
                                    // gm.me().classCode);
                                    // productlist.store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                            if (win) {
                                win.close();
                            }
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                        }

                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show( /* this, function(){} */);
        } // endofhandler
    }),

    addAssyAction: Ext.create('Ext.Action', {
        itemId: 'addAssyAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {

            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }
            var child = gm.me().selected_tree_record.get('child');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var assy_name = gm.me().selected_tree_record.get('text');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno3',
                params: {
                    ac_uid: gm.me().selectedPjUid
                },
                success: function (result, request) {
                    console_logs('result.responseText', result);
                    var str = result.responseText;
                    var num = Number(str);

                    if (str.length == 3) {
                        num = num;
                    } else if (str.length == 2) {
                        num = '0' + num;
                    } else if (str.length == 1) {
                        num = '00' + num;
                    } else {
                        num = num % 1000;
                    }
                    var pl_no = 'A' + num;

                    var lineGap = 30;
                    var bHeight = 300;


                    var inputItem = [];

                    inputItem.push({
                        xtype: 'component',
                        html: '상위 Assembly : ' + assy_name,
                        style: 'text-align:right;',
                        anchor: '-5'
                    });
                    inputItem.push({
                        xtype: 'component',
                        html: '<hr>',
                        anchor: '-5'
                    });

//                        inputItem.push({
//                            xtype: 'displayfield',
//                            value: '먼저 등록된 자재인지 검색하세요.'
//                        });
                    inputItem.push({
                        id: gu.id('search_information_assy_add'),
                        fieldLabel: '종전자재',
                        field_id: 'search_information_assy_add',
                        allowBlank: true,
                        name: 'search_information_assy_add',
                        xtype: 'combo',
                        emptyText: 'Assembly 검색',
                        anchor: '-5',
                        store: gm.me().searchAssyStore,
                        displayField: 'specification',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        sortInfo: {
                            field: 'specification',
                            direction: 'ASC'
                        },
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: true,
                        hideTrigger: true,
                        anchor: '100%',

                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div><a class="search-item" href="javascript:gm.me().setBomDataAssy({id},\'{item_code}\',\'{item_name}\');">' +
                                    '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                    '</a></div>';
                            }
                        },
                        pageSize: 10
                    });
                    inputItem.push(new Ext.form.Hidden({
                        value: child,
                        name: 'child'
                    }));
                    inputItem.push(new Ext.form.Hidden({
                        value: ac_uid,
                        name: 'ac_uid'
                    }));
                    inputItem.push(new Ext.form.Hidden({
                        value: gm.me().selectedPjCode,
                        name: 'pj_code'
                    }));

                    switch (vCompanyReserved4) {
                        case 'APM01KR':
                            inputItem.push(new Ext.form.Hidden({
                                xtype: 'textfield',
                                id: gu.id('target_item_code'),
                                name: 'target_item_code',
                                emptyText: '자동 생성',
                                fieldLabel: 'Assembly 코드',
                                allowBlank: true,
                                anchor: '-5',
                            }));
                            inputItem.push({
                                xtype: 'textfield',
                                name: 'pl_no',
                                fieldLabel: 'Assy 코드',
                                value: pl_no,
                                allowBlank: false,
                                fieldStyle: 'text-align: right;',
                                anchor: '-5'
                            });
                            inputItem.push({
                                xtype: 'textfield',
                                id: gu.id('target_assy_name'),
                                name: 'assy_name',
                                fieldLabel: 'Assembly 명',
                                allowBlank: false,
                                anchor: '-5'
                            });

                            inputItem.push(new Ext.form.Hidden({
                                id: gu.id('target_child'),
                                name: 'target_child',
                                value: -1
                            }));

                            inputItem.push(new Ext.form.Hidden({
                                name: 'unique_uid',
                                value: unique_uid
                            }));
                            inputItem.push({
                                xtype: 'numberfield',
                                name: 'bm_quan',
                                fieldLabel: '수량',
                                allowBlank: false,
                                value: 1,
                                anchor: '-5'
                            });
                            break;
                        default:
                            inputItem.push({
                                xtype: 'textfield',
                                id: gu.id('target_item_code'),
                                name: 'target_item_code',
                                emptyText: '자동 생성',
                                fieldLabel: 'Assembly 코드',
                                allowBlank: true,
                                anchor: '-5',
                            });
                            inputItem.push({
                                xtype: 'textfield',
                                id: gu.id('target_assy_name'),
                                name: 'assy_name',
                                fieldLabel: 'Assembly 명',
                                allowBlank: false,
                                anchor: '-5'
                            });

                            inputItem.push(new Ext.form.Hidden({
                                id: gu.id('target_child'),
                                name: 'target_child',
                                value: -1
                            }));

                            inputItem.push(new Ext.form.Hidden({
                                name: 'unique_uid',
                                value: unique_uid
                            }));

                            inputItem.push({
                                xtype: 'textfield',
                                name: 'pl_no',
                                fieldLabel: 'Assy 순번',
                                value: pl_no,
                                allowBlank: false,
                                fieldStyle: 'text-align: right;',
                                anchor: '-5'
                            });
                            inputItem.push({
                                xtype: 'numberfield',
                                name: 'bm_quan',
                                fieldLabel: '수량',
                                allowBlank: false,
                                value: 1,
                                anchor: '-5'
                            });
                            break;
                    }


                    gm.me().createAssyForm = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        width: 400,
                        height: bHeight,
                        bodyPadding: 15,
                        defaults: {
                            // anchor: '100%',
                            editable: true,
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: inputItem
                    });


                    var win = Ext.create('ModalWindow', {
                        title: 'Assembly 추가',
//                            header: {
//                                titlePosition: 2//,
//                                //titleAlign: 'center'
//                            },
                        width: 400,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        //maximizable: true,
                        items: gm.me().createAssyForm,

                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().createAssyForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);


                                    var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                                    gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                                    gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                                    gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                                    gm.me().selected_tree_record.set('text', text);


                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/design/bom.do?method=cloudAssycreate',
                                        params: {
                                            parent_uid: val['unique_uid'],
                                            parent: val['child'],
                                            ac_uid: val['ac_uid'],
                                            pl_no: val['pl_no'],
                                            bm_quan: val['bm_quan'],
                                            item_name: val['assy_name'],
                                            pj_code: val['pj_code'],
                                            child: val['target_child'],


                                        },
                                        success: function (result, request) {

                                            gm.me().reSelect();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });

                                    if (win) {
                                        win.close();
                                    }
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }

                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (win) {
                                    win.close();
                                }
                            }
                        }]
                    });
                    win.show( /* this, function(){} */);
                } // endofhandler
            });


        },
        failure: extjsUtil.failureMessage
    }),

    // Context Popup Menu
    assyContextMenu: Ext.create('Ext.menu.Menu', {
        items: [
            this.editAssyAction,
            this.removeAssyAction,
            this.copyAssemblyAction
        ]
    }),
    searchDetailStore: Ext.create('Mplm.store.MaterialDetailSearchStore', {}),

    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),

    searchAssyStore: Ext.create('Mplm.store.AssemblySearchStore', {
        myLink: vCompanyReserved4 == 'SKNH01KR' ? 'T' : null,
        item_types: vCompanyReserved4 == 'HSGC01KR' ? ['SRO4_HSGB', 'SRO4_HSGC'] : null
    }),

    searchStandardAssyStore: Ext.create('Mplm.store.AssemblySearchStore', {
        myLink: 'F'

    }),

    productStore: Ext.create('Mplm.store.ProductStore', {}),

    commonUnitStore: Ext.create('Mplm.store.CommonUnitStore2', {
        hasNull: false
    }),
    commonCurrencyStore: Ext.create('Mplm.store.CommonCurrencyStore', {
        hasNull: false
    }),
    commonModelStore: Ext.create('Mplm.store.CommonModelStore', {
        hasNull: false
    }),
    commonDescriptionStore: Ext.create('Mplm.store.CommonDescriptionStore', {
        hasNull: false
    }),
    commonStandardStore2: Ext.create('Mplm.store.CommonStandardStore', {
        hasNull: false
    }),
    claastStore: Ext.create('Mplm.store.ClaAstStoreMt', {
        hasNull: false
    }),
    gubunStore: Ext.create('Mplm.store.GubunStore', {
        hasNull: false
    }),

    buttonToolbar2: Ext.create('widget.toolbar', {
        cls: 'my-x-toolbar-default1',
        style: 'color:white;',
        items: [
            {
                id: gu.id('target-routeTitlename'),
                xtype: 'component',
                style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
                html: "<i>Assembly를 선택하세요.</i>",
            },
            '->'
        ]
    }),


    parentRecursive: function (o, dataIndex) {
        //console_logs('parentRecursive o', o);
        o.set(dataIndex, false);
        var id = o.get('unique_uid');
        //console_logs('id', id);

        var value = "N";
        if (dataIndex == 'is_new') {
            value = "R";
        }

        gm.editAjax(
            "assymap",
            dataIndex,
            value,
            "unique_id",
            id
        );


        var parentNode = o['parentNode'];
        if (parentNode != null) {
            this.parentRecursive(parentNode, dataIndex);
        }

    },

    eachRecursive: function (o, checked, dataIndex) {
        console_logs('eachRecursive o', o);
        o.set(dataIndex, checked);

        var id = o.get('id');
        //console_logs('id', id);

        var value = "N";

        switch (dataIndex) {
            case 'is_new':
                if (checked) {
                    value = "F";
                } else {
                    value = "R";
                }
                break;
            default:
                if (checked) {
                    value = "Y";
                } else {
                    value = "N";
                }
                break;
        }

        // if(dataIndex == 'is_new') {
        //     value = "F";
        // } else if(checked){
        //     value = "Y"
        // }

        //Assembly 설계 완료 처리
        gm.editAjax("assymap", dataIndex, value, "unique_id", id);

        //설계가 완료 된 자재의 가용 재고를 소진(혹은 취소를 해서 증가)하는 메소드
        //(요구사항 변경으로 취소)
        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                //this.updateUsefulQty(checked, o);
                break;
            default:
                break;
        }

        this.timerRefresh(o.get('assy_name'), checked, o);

        //console_logs('recCount', this.recCount);

        var childNodes = o['childNodes'];
        if (childNodes != null) {
            for (var i = 0; i < childNodes.length; i++) {
                this.eachRecursive(childNodes[i], checked, dataIndex);
            }
        }

    },

    updateUsefulQty: function (checked, o) {

        var assymap_uid = o.getId();
        var bm_quan = o.get('bm_quan');

        if (!checked) {
            bm_quan = (-1) * bm_quan;
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=updateUsfulQty',
            params: {
                assymap_uid: assymap_uid,
                bm_quan: bm_quan
            },
            success: function (result, request) {

            },
            failure: extjsUtil.failureMessage
        });
    },

    timerRefresh: function (assy_name, checked, o) {
        console_logs('timerRefresh', checked);
        gUtil.timer(function () {
            console_logs('gm.me().recCount', gm.me().recCount);
            //gm.me().srchTreeHandler(gm.me().assyGrid, gm.me().cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
            if (gm.me().recCount > 0) {
                console_logs('recCount', gm.me().recCount);
                gm.me().timerRefresh();
            } else {
                gm.me().togToast = true;
                gm.me().showToast('결과', '[' + assy_name + '] Assy가 ' + (checked ? '<완료>' : '<진행중>') + ' 처리 되었습니다.');

                console_logs('o', o);
            }
        }, 1000);
    },

    checkTreeNode: function (obj, rowIndex, checked, dataIndex) {
        this.togToast = false;
        this.recCount = 0;
        if (obj != null) {
            var o = obj.up('grid').getStore().getAt(rowIndex);
            this.eachRecursive(o, checked, dataIndex);
            if (checked == false) {
                var parentNode = o['parentNode'];
                if (parentNode != null)
                    this.parentRecursive(parentNode, dataIndex);
            }
            //markDirty 체크
            obj.up('grid').getStore().sync();
        }

    },

    groupSelect: function (id, checked) {
        alert(id);
        alert(checked);

        var arr = id.split('_');
        var chk = checked;

        var sp_code = arr[0];
        if (chk == true) {
            for (var i = 0; i < store.data.items.length; i++) {
                var rec = store.data.items[i];
                var currec = rec.get('id');

                if (sp_code == rec.get('sp_code')) {
                    records.push(rec);
                }
            } //end for

            grid.getSelectionModel().select(records);

        } else {

            var new_arr = [];
            for (var i = 0; i < store.data.items.length; i++) {
                var rec = store.data.items[i];
                if (sp_code == rec.get('sp_code')) {
                    new_arr.push(rec);
                }

            }
            grid.getSelectionModel().deselect(new_arr);

            records = Ext.Array.difference(records, new_arr);

            grid.getSelectionModel().deselect(new_arr);

            new_arr = [];
        }
    },

    deleteAssyConfirm: function (result) {
        if (gm.me().checkClosed() == true) {
            return;
        }
        if (result == 'yes') {
            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
                return;
            } else {
                var name = gm.me().selected_tree_record.data.text;
                var id = gm.me().selected_tree_record.data.id;
                var depth = gm.me().selected_tree_record.data.depth;

                if (depth < 2) {
                    Ext.MessageBox.alert('선택 확인', '최상위 Assy는 삭제할 수 없습니다.');
                    return;
                } else {

                    console_logs('target id', id);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=getChildQuan',
                        params: {
                            parent: id
                        },
                        success: function (result, request) {
                            console_logs('result', result);
                            var jsonData = Ext.decode(result.responseText);
                            console_logs('jsonData', jsonData);
                            var quan = jsonData['result'];
                            if (quan > 0) {
                                Ext.MessageBox.alert('오류', '하위 Assy 또는 BOM이 존재하여 삭제할 수 없습니다.');
                            } else {
                                var unique_uid = gm.me().selected_tree_record.data.unique_uid;

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/design/bom.do?method=deleteAssy',
                                    params: {
                                        assymap_uid: unique_uid
                                    },
                                    success: function (result, request) {
                                        console_logs('result', result);
                                        var jsonData = Ext.decode(result.responseText);
                                        console_logs('jsonData', jsonData);
                                        gm.me().reSelect();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    },
    valve_nos: [],
    addValve_no: function (s) {
        //console_logs('addValve_no s', s);
        this.valve_nos.push(s);
        this.valve_nos = gu.sortedSet(this.valve_nos);
        //console_logs('addValve_no', this.valve_nos);
    },
    partlineStore: Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),

    valveNoStore: Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),

    getVvPromptMsg: function (curArr, assy_name, addArr, canSave) {
        var allArr = this.valve_nos;
        var msg = '등록 VALVE NO.:<br><div style="background-color:#EFFDDE ;border:0px solid #EAEAEA;width: 200; height: 80; word-wrap: break-word; white-space:normal; overflow-x:hidden; overflow-y: hidden;">';
        var b1 = false;
        var target = '';
        for (var k = 0; k < allArr.length; k++) {
            var s = allArr[k];
            if (curArr.indexOf(s) < 0) {
                var b = false;

                for (var j = 0; j < addArr.length; j++) {
                    if (s == addArr[j]) {
                        b = true;
                        target = s;
                    }
                }

                if (b == false) {
                    msg = msg + '<label style="margin:3px;">' + s + '</label>';
                } else {
                    msg = msg + '<label style="margin:3px;color:red;">' + s + '</label>';
                    b1 = true;
                    canSave[0] = false;
                }

            }
        }

        if (b1 == true) {
            //console_logs('addArr', addArr);
            //addArr = gu.arrRemove(addArr, target);
            msg = msg + '</div>이미 사용된 Valve No가 입력되었습니다.';
            //console_logs('addArr', addArr);
        } else {
            //msg = msg + '</div><hr style="border-top: dashed 1px;">';
        }

        msg = msg + '</div><hr style="border-top: dashed 1px;">' + assy_name;

        return msg;
    },

    //Valve No 생산요청
    requestValve: function () {
        var rec = gm.me().selected_tree_record;
        var unique_uid = rec.get('unique_uid');
        var unique_id = rec.get('child');
        var ac_uid = rec.get('ac_uid');

        gm.me().showToast('결과', 'Valve 생산요청 중입니다.');

        Ext.Ajax.request({

            url: CONTEXT_PATH + '/index/process.do?method=addRequestValveSkana',
            params: {
                assymapUid: unique_uid,
                parent: unique_id,
                ac_uid: ac_uid
            },

            success: function (result, request) {
                try {
                    gm.me().selectedVv.set('status', 'CR');
                } catch (e) {
                }

                gm.me().showToast('결과', '생산요청이 성공하였습니다.');
                //Ext.Msg.alert('안내', '요청하었습니다.', function() {});
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    clearSearchStore: function () {
        var store = gm.me().searchDetailStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 100);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },

    stateCodeStore: Ext.create('Rfx.store.GeneralCodeStore', {hasNull: false, parentCode: 'SRO1_CLD_STATE'}),
    redrawSearchStore: function () {

        this.clearSearchStore();

        var store = gm.me().searchDetailStore;

        var item_code = gu.getValue('search_item_code');
        var item_name = gu.getValue('search_item_name');
        var specification = gu.getValue('search_specification');
        var model_no = gu.getValue('search_model_no');
        var supplier_name = '';
        try {
            supplier_name = gu.getValue('search_supplier_name');
        } catch (error) {

        }

        //var field_id = fieldObj['field_id'];
        console_logs('item_code', item_code);
        console_logs('item_name', item_name);
        console_logs('specification', specification);
        console_logs('model_no', model_no);

        var bIn = false;
        if (item_code.length > 0) {
            store.getProxy().setExtraParam('item_code', item_code);
            bIn = true;
        }

        if (item_name.length > 0) {
            store.getProxy().setExtraParam('item_name', item_name);
            bIn = true;
        }

        if (specification.length > 0) {
            store.getProxy().setExtraParam('specification', specification);
            bIn = true;
        }

        if (model_no.length > 0) {
            store.getProxy().setExtraParam('model_no', model_no);
            bIn = true;
        }

        if (supplier_name.length > 0) {
            store.getProxy().setExtraParam('supplier_name', supplier_name);
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 250);

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }


    },

    checkClosed: function () {
        var is_closed = false;
        var is_new = false;

        try {
            switch (vCompanyReserved4) {
                case 'KWLM01KR':
                    is_new = gm.me().selected_tree_record.get('is_new');
                    is_closed = is_new;
                    break;
                case 'APM01KR':
                    is_closed = false;
                    break;
                default:
                    is_closed = gm.me().selected_tree_record.get('is_closed');
                    break;
            }
        } catch (e) {
        }

        if (is_closed == true) {
            Ext.MessageBox.alert('알림', '이미 완료처리 되었습니다.');
        }
        return is_closed;
    },

    refreshValve: function () {
        //gm.me().valveNoStore.getProxy().setExtraParam('parent_uid', -1);
        gm.me().valveNoStore.getProxy().setExtraParam('orderBy', "specification");
        gm.me().valveNoStore.getProxy().setExtraParam('ascDesc', "ASC");
        gm.me().valveNoStore.getProxy().setExtraParam('ac_uid', gm.me().ac_uid);
        gm.me().valveNoStore.getProxy().setExtraParam('valve_no', true);
        gm.me().valveNoStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('valve_quan');
                if (o != null) {

                    o.update('총수량: ' + records.length);
                }
            }
        });

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });
    },
    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),
    AllattachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),
    detailFileStore: null,
    repositFileStore: Ext.create('Mplm.store.RepositFileStore'),
    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });


    },

    notifyStore: Ext.create("Ext.data.Store", {
        fields: ['display', 'value'],
        data: [{
            display: '사내구매',
            value: 'Y',
        }, {
            display: '외주구매',
            value: 'N',
        }]
    }),

    rtgapp_store: null,
    //결재조건
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {
        hasNull: false
    }),

    supastStore: Ext.create('Mplm.store.SupastStore', {
        hasNull: false
    }),

    deleteRtgappConfirm: function (result) {
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if (result == 'yes') {

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');

                    if (user_id == vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function () {
                        });
                        return;
                    }
                }

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp',
                        params: {
                            unique_id: unique_id
                        },
                        success: function (result, request) {
                            gm.me().agrid.store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },
    fileCrudGrid: function () {
        var myId = gMain.geViewCrudId() + 2; //viewId +'-'+ 'crudTab';
        var bom_side_width = 400;
        var FilecrudTab = Ext.create('Ext.panel.Panel', {
            frame: true,
            activeTab: 1,
            region: 'east',
            width: bom_side_width,
//	        collapsible: true,
            collapsed: true,
//	        scroll: true,
//	        autoScroll: true,
            title: '첨부파일',
            layout: 'card',
            cmpId: myId,
            id: myId,
            items: [
                // this.createFormPane('REGIST'), this.createPropertyPane()
                this.createFileAttach()
            ],
            listeners: {
                'resize': function (win, width, height, opt) {
                    gm.me().setCrudpanelWidth(width);
                },
                collapse: function () {
                    if (gm.me().blockExpand) {
                        gm.me().crudMode = 'VIEW';
                    }
                }
            },
            tools: [
                {
                    xtype: 'tool',
                    type: 'right',
                    qtip: "접기",
                    handler: function (e, target, header, tool) {
                        FilecrudTab.collapsed ? FilecrudTab.expand() : FilecrudTab.collapse();
                    }
                }


            ]
        });

        FilecrudTab.setActiveItem(0);

        return FilecrudTab;
    },
    createFileAttach: function () {

        var SIDE_COLUMN = [];

        SIDE_COLUMN.push(
            {
                text: '파일명',
                flex: 1,
                sortable: true,
                dataIndex: 'object_name'
            },
            {
                text: '파일유형',
                width: 70,
                sortable: true,
                dataIndex: 'file_ext'
            },
            {
                text: '날짜',
                width: 160,
                sortable: true,
                dataIndex: 'create_date'
            }
            // ,{
            //     text     : 'size',
            //     width     : 100,
            //     sortable : true,
            //     xtype: 'numbercolumn',
            //     format: '0,000',
            //     style: 'text-align:right',
            //     align: 'right',
            //     dataIndex: 'file_size'
            // }
        )

        sideFileGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            border: true,
            autoHeight: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            store: this.AllattachedFileStore,
            stateId: 'sideFileGrid' + vCUR_MENU_CODE,
            columns: /*(G)*/SIDE_COLUMN,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.searchFileLoad, this.bomfileMatchAction,
                    {
                        xtype: 'textfield',
                        field_id: 'src_fileName',
                        name: 'src_fileName',
                        emptyText: '도면명',
                        // fieldLabel: '도면명'
                        listeners: {
                            specialkey: function (fieldObj, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    console_logs('==enter', 'a');
                                    console_logs('==fieldObj', fieldObj);
                                    console_logs('==e', e);
                                    var file_name = fieldObj.value;
                                    console_logs('==file_name', file_name);
                                    gm.me().AllattachedFileStore.getProxy().setExtraParam('group_code', gm.me().selectedPjUid);
                                    gm.me().AllattachedFileStore.getProxy().setExtraParam('file_name', file_name);
                                    if (gm.me().selectedPjUid != null && gm.me().selectedPjUid != '') {
                                        gm.me().AllattachedFileStore.load();
                                    }
                                }
                            }
                        }
                    }
                ]
            }]
        });

        sideFileGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                gm.me().side_selected = [];
                if (selections != null && selections.length > 0) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        gm.me().side_selected.push(rec);
                    }
                    gm.me().bomfileMatchAction.enable();
                } else {
                    gm.me().bomfileMatchAction.disable();
                }


            }
        });

        // console_logs('==selectedPjUid', this.selectedPjUid);

        // this.AllattachedFileStore.getProxy().setExtraParam('group_code', this.selectedPjUid);
        // this.AllattachedFileStore.getProxy().setExtraParam('group_code222', 'sss');
        // this.AllattachedFileStore.load();

        return sideFileGrid;
    },
    side_selected: [],
    matched_selected: [],
    searchFileLoad: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: CMD_SEARCH/*'검색'*/,
        disabled: false,
        handler: function (widget, event) {
            gm.me().AllattachedFileStore.getProxy().setExtraParam('group_code', gm.me().selectedPjUid);
            gm.me().AllattachedFileStore.load();
        }
    }),
    bomfileMatchAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '파일 매칭',
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var side_sel = gm.me().side_selected;
            console_logs('===side_selected', gm.me().side_selected);

            // var srcahd_uid = selections[0].get('unique_id_long');
            var srccst_uids = [];
            var assymap_uids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                assymap_uids.push(rec.get('unique_uid'));
            }
            for (var i = 0; i < side_sel.length; i++) {
                var side_rec = side_sel[i];
                srccst_uids.push(side_rec.get('unique_id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=assyMatchFile',
                params: {
                    srcahd_uids: assymap_uids,
                    srccst_uids: srccst_uids
                },
                success: function () {
                    gm.me().showToast('결과', '성공');
                },
                failure: function () {
                    gm.me().showToast('결과', '실패');
                }
            });
        }
    }),
    matchfileRemoveAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().matched_selected;
            console_logs('===selections', selections);

            var srccst_uids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                srccst_uids.push(rec.get('unique_id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=assyMatchFile',
                params: {
                    srcahd_uid: -1,
                    srccst_uids: srccst_uids,
                    type: 'remove'
                },
                success: function () {
                    gm.me().showToast('결과', '성공');
                    gm.me().detailFileStore.load();
                },
                failure: function () {
                    gm.me().showToast('결과', '실패');
                }
            });
        }
    }),

    readHistroyView: function () {
        Ext.define('XpoAstHistory', {
            extend: 'Ext.data.Model',
            fields: /*(G)fieldPohistory*/'',
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/request.do?method=readPohistory'
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                },
                writer: {
                    type: 'singlepost',
                    writeAllFields: false,
                    root: 'datas'
                }
            }
        });

        var poHistoryStore = new Ext.data.Store({
            pageSize: 50,
            model: 'XpoAstHistory',
            sorters: [{
                property: 'po_date',
                direction: 'DESC'
            }]
        });

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];
        var uid_srcahd = selection.get('unique_id_long');

        poHistoryStore.getProxy().setExtraParam('uid_srcahd', uid_srcahd);
        poHistoryStore.load();

        var bomHistoryGrid = Ext.create('Ext.grid.Panel', {
            store: poHistoryStore,
            stateId: 'bomHistoryGrid',
            layout: 'fit',
            border: false,
            frame: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            sortable: false,
            multiSelect: false,
            autoScroll: true,
            heigth: 300,
            columns: [
                {text: '프로젝트 코드', dataIndex: 'account_code', width: 100},
                {text: '프로젝트 명', dataIndex: 'account_name', width: 80},
                {text: 'Assembly', dataIndex: 'pl_no', width: 80},
                {text: '발주번호', dataIndex: 'po_no', width: 120},
                {text: '주문일자', dataIndex: 'po_date', width: 120},
                {text: '공급사 코드', dataIndex: 'seller_code', width: 80},
                {text: '공급사 명', dataIndex: 'seller_name', width: 120},
                {text: '주문단가', dataIndex: 'sales_price', width: 80},
                {text: '주문수량', dataIndex: 'po_qty', width: 80},
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'주문 P/O 이력',
            width: 900,
            height: 700,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                bomHistoryGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    RemoveFileDetailview: function (btn) {
        console_logs('>>>>>>>>>>>>>ssss', btn);
        if (btn == 'no') {
            return;
        } else {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var unique_ids = [];

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                unique_ids.push(rec.get('unique_uid'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=removaAllMatchFile',
                params: {
                    unique_ids: unique_ids
                },
                success: function () {
                    gm.me().showToast('결과', '성공');
                    // gm.me().detailFileStore.load();
                },
                failure: function () {
                    gm.me().showToast('결과', '실패');
                }
            });
        }
    },

    AttachFileDetailview: function (selection) {

        gm.me().detailFileStore = gm.me().AllattachedFileStore;
        gm.me().detailFileStore.getProxy().setExtraParam('group_code', selection.get('unique_uid'));
        gm.me().detailFileStore.load();

        var fileAttachGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().detailFileStore,
            stateId: 'detailFielGrid',
            layout: 'fit',
            border: false,
            frame: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            sortable: false,
            multiSelect: false,
            autoScroll: true,
            heigth: 300,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.matchfileRemoveAction
                ]
            }],
            columns: [
                {text: '파일명', dataIndex: 'object_name', width: 400},
                {text: '확장자', dataIndex: 'file_ext', width: 80},
                {text: '날짜', dataIndex: 'create_date', width: 200},
                {text: '파일크기', dataIndex: 'file_size', width: 80},
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'자재 첨부파일',
            width: 800,
            height: 700,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                {
                    xtype: 'panel',
                    id: 'First Grid',
                    autoScroll: true,
                    autoWidth: true,
                    flex: 3,
                    padding: '5',
                    items: fileAttachGrid
                }
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();

        fileAttachGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().matched_selected = [];
                if (selections != null && selections.length > 0) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        gm.me().matched_selected.push(rec);
                    }
                    gm.me().matchfileRemoveAction.enable();
                } else {
                    gm.me().matchfileRemoveAction.disable();
                }


            }
        });
    },

    // 납기일 일괄 지정
    req_dateAction: Ext.create('Ext.Action', {
        itemId: 'reqDateButton',
        iconCls: 'font-awesome_4-7-0_refresh_14_0_5395c4_none',
        text: '납기일 지정',
        disabled: true,
        handler: function (widget, event) {
            gm.me().doReqDateAction(false);

        }// endof handler
    }),// endof define action

    doReqDateAction: function () {
        var selections = gm.me().gridMycart.getSelectionModel().getSelection();
        var id = 'gridMycart' + vCUR_MENU_CODE

        var value = Ext.Date.add(new Date(), Ext.Date.DAY, 14);

        var form = Ext.create('Ext.form.Panel', {
            id: 'formPanelReqDate',
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 3,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: '납기일',
                    id: 'txt_req_date',
                    name: 'txt_req_date',
                    value: Ext.Date.format(value, 'Y-m-d'),
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    anchor: '100%'
                }
            ]
        });// endof createform
        var prWin = Ext.create('ModalWindow', {
            title: '납기일 일괄지정',
            width: 400,
            height: 130,
            plain: true,
            items: [form
            ],
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var a = Ext.getCmp('txt_req_date').getValue();
                    a = Ext.Date.format(a, 'Y-m-d');
                    var s = [];
                    for (var i = 0; i < selections.length; i++) {
                        var target_uid = selections[i].get('unique_uid');
                        gm.editAjax('assymap', 'req_date', a, 'unique_id', target_uid, {type: ''});
                        gm.me().gridMycart.getSelectionModel().selected.items[i].set('req_date', a);
                        s.push(gm.me().gridMycart.getSelectionModel().selected.items[i]);
                    }
                    gm.me().gridMycart.getView().select(s);

                    if (prWin) {
                        prWin.close();
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    //결재 기능 사용
    useRouting: (vCompanyReserved4 == 'DABP01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,
    //설계요청한 프로벡트만
    requestedProjectOnly: (vCompanyReserved4 == 'KWLM01KR') ? true : false,
    scakaValve: (vCompanyReserved4 == 'SKNH01KR'),
    //도면/문서 기능사용여부
    useDocument: (vCompanyReserved4 == 'KWLM01KR' || vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,
    // ftpSetting: (vCompanyReserved4 == 'APM01KR') ? true : false
    ftpSetting: false,
    outOrderSetting: vCompanyReserved4 != 'APM01KR' ? true : false,
    array: [],
    win_check: false,

    naturalCompare: function (a, b) {
        var ax = [], bx = [];

        a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            ax.push([$1 || Infinity, $2 || ""])
        });
        b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            bx.push([$1 || Infinity, $2 || ""])
        });

        while (ax.length && bx.length) {
            var an = ax.shift();
            var bn = bx.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) return nn;
        }

        return ax.length - bx.length;
    },

    bomListStore: Ext.create('Mplm.store.BomListStore')
});