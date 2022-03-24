//자재 관리
Ext.define('Rfx2.view.company.sejun.designPlan.ProductVerMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-ver-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('description');
        this.addSearchField('item_type');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addCallback('CHECK_CODE', function (o) {
            var target = gMain.selPanel.getInputJust('extendsrcahd|item_name');
            console_logs('====target', target);
            var code = target.getValue();
            var uppercode = code.toUpperCase();

            if (code.length < 1) {
                Ext.Msg.alert('안내', '품명을 입력하시기 바랍니다', function () { });
            } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=A&sp_code_list=F,G,H,A',
                    params: {
                        item_name: code
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var datas = jsonData.datas;

                        var isExist = false;

                        for (var i = 0; i < datas.length; i++) {
                            if (code == datas[i].item_name) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist) {
                            Ext.Msg.alert('안내', '사용가능한 품명입니다', function () { });
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 품명입니다', function () { });

                            var sp_code = gm.me().getInputJust('extendsrcahd|sp_code').getValue();

                            if (sp_code == null) {
                                sp_code = '';
                            }

                            var sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();

                            if (sg_code == null) {
                                sg_code = '';
                            }

                            var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

                            var item_code = sp_code + sg_code;

                            item_code_field.setValue(item_code);

                            //target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.addCallback('GET_SG_CODE', function (o) {

            var sg_code = Ext.getCmp('design-plan-' + gm.me().link + '-sg_code');
            var store = sg_code.getStore();

            sg_code.setValue(null);
            store.getProxy().setExtraParam('parent_class_code', o.value);

            store.load();
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.company.bioprotech.ProductVerMgmt', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.setRowClass(function (record, index) {

            var c = record.get('srcadt_varchar40');

            switch (c) {
                case 'Y':
                    return 'orange-row';
                    break;
                default:
                    break;
            }

        });

        // this.addFormWidget('입력항목', {
        //     tabTitle:"입력항목",
        //     id:	'AMC4_SEW2_LV1',
        //     xtype: 'combo',
        //     text: '제품분류',
        //     name: 'level1',
        //     storeClass: 'ClaastStorePD',
        //     params:{level1: 1, identification_code: "MT"},
        //     displayField: "class_name",
        //     valueField: "class_code",
        //     innerTpl: "<div>[{class_code}] {class_name}</div>",
        //     setNumber:0,
        //     setName:"분류코드",
        //     setCols:2,
        //     listeners: {
        //         select: function (combo, record) {
        //             console_log('Selected Value : ' + combo.getValue());
        //             console_logs('record : ', record);
        //             var class_code = record.get('class_code');
        //             var claastlevel2 = Ext.getCmp('AMC4_SEW2_LV2');
        //             var claastlevel3 = Ext.getCmp('AMC4_SEW2_LV3');
        //
        //             claastlevel2.clearValue();
        //             claastlevel2.store.removeAll();
        //             claastlevel3.clearValue();
        //             claastlevel3.store.removeAll();
        //
        //             claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
        //             claastlevel2.store.load();
        //             gMain.selPanel.reflashClassCode(class_code);
        //
        //         }
        //     },
        //     canCreate:   true,
        //     canEdit:     true,
        //     canView:     true,
        //     position: 'center'
        // });
        //
        // this.addFormWidget('입력항목', {
        //     tabTitle:"입력항목",
        //     id:	'AMC4_SEW2_LV2',
        //     xtype: 'combo',
        //     text: '중분류',
        //     name: 'level2',
        //     storeClass: 'ClaastStorePD',
        //     params:{level1: 2, identification_code: "MT"},
        //     displayField: "class_name",
        //     valueField: "class_code",
        //     innerTpl: "<div>[{class_code}] {class_name}</div>",
        //     setNumber:0,
        //     setName:"분류코드",
        //     setCols:2,
        //     listeners: {
        //         select: function (combo, record) {
        //             console_log('Selected Value : ' + combo.getValue());
        //             console_logs('record : ', record);
        //             var class_code = record.get('class_code');
        //             var claastlevel3 = Ext.getCmp('AMC4_SEW2_LV3');
        //
        //             claastlevel3.clearValue();
        //             claastlevel3.store.removeAll();
        //             claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
        //             claastlevel3.store.load();
        //
        //             gMain.selPanel.reflashClassCode(class_code);
        //
        //         }
        //     },
        //     canCreate:   true,
        //     canEdit:     true,
        //     canView:     true,
        //     position: 'center'
        //
        // });
        // this.addFormWidget('입력항목', {
        //     tabTitle:"입력항목",
        //     id:	'AMC4_SEW2_LV3',
        //     xtype: 'combo',
        //     text: '소분류',
        //     name: 'level3',
        //     storeClass: 'ClaastStorePD',
        //     params:{level1: 3, identification_code: "MT"},
        //     displayField: "class_name",
        //     valueField: "class_code",
        //     innerTpl: "<div>[{class_code}] {class_name}</div>",
        //     setNumber:0,
        //     setName:"분류코드",
        //     setCols:2,
        //     listeners: {
        //         select: function (combo, record) {
        //             console_log('Selected Value : ' + combo.getValue());
        //             console_logs('record : ', record);
        //             var class_code = record.get('class_code');
        //
        //
        //             gMain.selPanel.reflashClassCode(class_code);
        //
        //         }
        //     },
        //     canCreate:   true,
        //     canEdit:     true,
        //     canView:     true,
        //     position: 'center'
        // });


        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.addCallback('SET_ITEM_CODE', function (o) {

            var sp_code = gm.me().getInputJust('extendsrcahd|sp_code').getValue();

            if (sp_code == null) {
                sp_code = '';
            }

            var sg_code = gm.me().getInputJust('extendsrcahd|sg_code').getValue();

            if (sg_code == null) {
                sg_code = '';
            }

            var item_code_field = gm.me().getInputJust('extendsrcahd|item_code');

            var item_code = sp_code + sg_code;

            item_code_field.setValue(item_code);
        });

        this.addKeyCallback('SET_ITEM_NAME', function (o) {

            // gm.me().getInputJust('extendsrcahd|description').setValue(o.value);

        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            tooltip: '등록된 제품의 도면 또는 그외 파일을 업로드 및 다운로드 합니다.',
            text: '문서첨부',
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });

        this.productDeleteAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            itemId: 'productDeleteAction',
            disabled: true,
            tooltip: '선택 제품을 삭제합니다.',
            text: gm.getMC('CMD_DELETE', '삭제'),
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 제품을 삭제하시겠습니까?<br><b>현 기능은 "SYS" 권한이 부여된 사용자만 실행됩니다.</b>',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        var record = gm.me().grid.getSelectionModel().getSelection()[0];
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=deleteProduct',
                                params: {
                                    srcahd_uid: record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    Ext.Msg.alert('안내', '처리완료 되었습니다.', function () { });
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            }); //end of ajax
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.changeUsingStatusAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-exchange',
            text: '사용여부 변경',
            tooltip: '사용중인 제품은 미사용으로, 미사용중인 제품은 사용으로 변경합니다.',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '사용여부 변경',
                    msg: '사용여부를 변경하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {

                        if (result == 'yes') {

                            var negative_uids = [];
                            var positive_uids = [];

                            var selections = gm.me().grid.getSelectionModel().getSelection();

                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                var notify_flag = rec.get('notify_flag');

                                if (notify_flag === 'Y') {
                                    positive_uids.push(rec.get('unique_id_long'));
                                } else {
                                    negative_uids.push(rec.get('unique_id_long'));
                                }
                            }

                            var is_show_msg = true;

                            if (negative_uids.length > 0) {
                                gm.me().editAjax('srcahd', 'notify_flag', 'Y', 'unique_id', negative_uids, { type: '' }, null, is_show_msg);
                                is_show_msg = false;
                            }
                            if (positive_uids.length > 0) {
                                gm.me().editAjax('srcahd', 'notify_flag', 'N', 'unique_id', positive_uids, { type: '' }, null, is_show_msg);
                            }

                            gm.me().store.load();

                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 출고 버튼
        this.outGoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '자재출고 ',
            tooltip: '자재출고',
            disabled: true,
            handler: function () {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultTxt = result.responseText;


                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }


                //  				 switch(gMain.selPanel.stockviewType) {
                //  				 case 'ALL':
                //  					 alert("자재를 먼저 선택해 주세요");
                //  					 break;
                //  				 default:
                //  					 break;
                //  				 }
            }
        });


        // 바코드 출력 버튼
        this.barcodePrintAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '바코드를 바코드 프린터로 출력합니다',
            disabled: true,
            handler: function () {

                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                console_logs('selections', selections);
                if (selections) {
                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var unique_id = rec.get('unique_id');
                        uids.push(unique_id);
                    }


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
                        params: {
                            srcahd_uids: uids
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;

                            Ext.Msg.alert('안내', '자재 출고 완료.', function () { });

                        },
                        failure: extjsUtil.failureMessage
                    }); //end of ajax

                }
            }

        });


        //버튼 추가.
        buttonToolbar.insert(4, this.changeUsingStatusAction);
        buttonToolbar.insert(5, this.fileattachAction);
        buttonToolbar.insert(6, this.productDeleteAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            var rec = selections[0];

            if (selections.length > 0) {
                gm.me().changeUsingStatusAction.enable();
                gm.me().fileattachAction.enable();
                gm.me().productDeleteAction.enable();
            } else {
                gm.me().changeUsingStatusAction.disable();
                gm.me().fileattachAction.disable();
                gm.me().productDeleteAction.disable();
            }

            // if (selections.length) {
            //     gMain.selPanel.createPoAction.enable();
            //
            //     var copy_uid = gm.me().getInputJust('srcahd|copy_uid');
            //
            //     if (copy_uid != null) {
            //         copy_uid.setValue(rec.get('id'));
            //     }
            // } else {
            //     gMain.selPanel.createPoAction.disable();
            // }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function (records) { });
    },
    selectedClassCode: '',
    reflashClassCode: function (o) {
        this.selectedClassCode = o;
        var target_class_code = gm.me().getInputJust('srcahd|class_code');
        var target_item_code = gm.me().getInputJust('srcahd|item_code');

        target_class_code.setValue(o);
        target_item_code.setValue(o);

    },
    items: [],
    matType: 'RAW',
    stockviewType: "ALL",

    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, sync_mode, is_show_msg) {

        if (tableName == null || tableName == '') {
            return;
        }
        gm.me().recCount++;

        var params = {};
        if (in_params != null) {
            for (var key in in_params) {
                params[key] = in_params[key];
            }
        }

        var whereValue = [];
        whereValue.push(in_whereValue);

        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        params['valueType'] = gm.getColType(field);

        gm.me().sync_mode = sync_mode;

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
            params: params,
            success: function (result, request) {

                var result = result.responseText;
                if (result != null) {
                    var o = Ext.util.JSON.decode(result);
                    if (o != null) {
                        var field_name = gm.getColName(o['setField']);
                        var field_type = gm.getColType(o['setField']);
                        var value = o['setValue'];
                        var id = o['whereValue'];

                        if (is_show_msg) {
                            switch (field) {
                                case 'notify_flag':
                                    gm.me().showToast('셀수정 결과', '사용여부 상태가 변경되었습니다.');
                                    break;
                                default:
                                    gm.me().showToast('셀수정 결과', msg);
                            }
                        }

                        gm.me().recCount--;

                        gm.setCenterLoading(false);

                        if (gm.me().sync_mode == false || gm.me().sync_mode == undefined) {
                            gm.me().sync_mode = null;
                        } else {
                            try {
                                gm.me().getStore().sync();
                            } catch (e) { }
                        }


                    }
                }

            }
        });
    },

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '파일을 첨부 후 나머지 내용을 작성 후 반영확인을 클릭하십시오.<br><br>첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            id: gu.id('attachedFileGrid'),
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일첨부',
                        scale: 'small',
                        iconCls: 'af-upload-white',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });

                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                                this.attachedFileStore.load();
                            }, this);
                            uploadDialog.show();

                        }
                    },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }

                        }
                    },
                    {
                        xtype: 'button',
                        text: '새로고침',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            gm.me().attachedFileStore.load();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '반영확인',
                        scale: 'small',
                        scope: this.fileGrid,
                        handler: function () {
                            // gm.me().attachedFileStore.load();
                            var store = gu.getCmp('attachedFileGrid').getStore();
                            console_logs('>>>> store',store);
                            var size = store.data.items.length;
                            var uniqueIds= [];
                            var docTypes = [];
                            var docNos = [];
                            var docNames = [];
                            var docVers = [];
                            var docPurcYns = [];

                            if (size > 0) {
                                for (var i = 0; i < size; i++) {
                                    var item = store.data.items[i];
                                    console_logs('>> doc_type', item.get('file_usage'));
                                    var doctype = '';
                                    switch(item.get('file_usage')){
                                        case '기구도면':
                                            doctype = 'INS';
                                            break;
                                        case '디자인도면':
                                            doctype = 'DES';
                                            break;
                                        case '생산작업지도서':
                                            doctype = 'WIS';
                                            break;
                                        case '포장작업지도서':
                                            doctype = 'PIS';
                                            break;
                                        case '포장사양서' :
                                            doctype = 'PSN';
                                            break;
                                    }
                                    if(doctype.length === 0) {
                                        Ext.MessageBox.alert('알림','문서종류가 부적절한 값이 들어갔거나 존재하지 않습니다.')
                                        return;
                                    } else {
                                        console_logs('>> doctype', doctype);
                                        docTypes.push(doctype);
                                    }
                                    var docNo = item.get('srccst_varchar1');
                                    if(docNo !== undefined) {
                                        docNos.push(docNo);
                                    } else {
                                        docNos.push('NOT');
                                    }

                                    var docName = item.get('srccst_varchar3');
                                    if(docName !== undefined) {
                                        docNames.push(docName);
                                    } else {
                                        docNames.push('NOT');
                                    }

                                    var docVer = item.get('srccst_varchar4')
                                    if(docVer !== undefined) {
                                        docVers.push(docVer);
                                    } else {
                                        docVers.push('NOT');
                                    }

                                    var prc_yn = item.get('srccst_varchar5')
                                    if(prc_yn !== undefined) {
                                        docPurcYns.push(prc_yn);
                                    } else {
                                        docPurcYns.push('NOT');
                                    }
                                    uniqueIds.push(item.get('id'))
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=reflectFileContent',
                                    params: {
                                        uniqueIdsArr: uniqueIds,
                                        docPurcYnArr : docPurcYns,
                                        docVers : docVers,
                                        docNames : docNames,
                                        docNos : docNos,
                                        docTypes : docTypes
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('확인', '반영 되었습니다.');
                                        gm.me().attachedFileStore.load(function (records) {
                                            if (records != null) {
                                                var o = gu.getCmp('file_quan');
                                                if (o != null) {
                                                    o.update('파일 수 : ' + records.length);
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert('알림', '첨부파일 내역이 존재하지 않습니다.');
                            }

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
                        html: '파일 수 : 0'
                    },

                ]
            }

            ],
            columns: [
                // {
                //     text: '파일 일련번호',
                //     width: 100,
                //     style: 'text-align:center',
                //     sortable: true,
                //    visible : false,
                //     dataIndex: 'id'
                // },
                {
                    text: '문서종류',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.5,
                    sortable: true,
                    dataIndex: 'file_usage',
                    editor: {
                        xtype: 'combobox',
                        displayField: 'codeName',
                        css: 'edit-cell',
                        editable: false,
                        // forceSelection: true,
                        // mode: 'local',
                        store: gm.me().dwgTypeStore,
                        triggerAction: 'all',
                        valueField: 'codeName'
                    },
                },
                {
                    text: '문서번호',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.7,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar1'
                },
                {
                    text: '문서명',
                    style: 'text-align:center',
                    width: '18%',
                    // flex: 0.7,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar3'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    width: '20%',
                    // flex: 0.5,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '문서버전',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.3,
                    sortable: true,
                    editor: 'textfield',
                    dataIndex: 'srccst_varchar4'
                },
                {
                    text: '주문서등록여부',
                    style: 'text-align:center',
                    width: '10%',
                    // flex: 0.3,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        displayField: 'codeName',
                        css: 'edit-cell',
                        editable: false,
                        // forceSelection: true,
                        // mode: 'local',
                        store: gm.me().purchaseYnStore,
                        triggerAction: 'all',
                        valueField: 'systemCode',
                        listeners: {
                            expand: function () {
                                var store = gu.getCmp('attachedFileGrid').getStore();
                                var record = gu.getCmp('attachedFileGrid').getSelectionModel().getSelected().items[0];
                                var doc_type = record.get('file_usage');
                                console_logs('>>> doc_type : ', doc_type);
                                if (doc_type === '기구도면' || doc_type === '디자인도면') {
                                    this.store.load();
                                } else {
                                    Ext.MessageBox.alert('알림', '문서종류를 기구도면 또는 디자인도면을 선택했을 경우 선택가능합니다.');
                                }
                            },
                        }
                    },
                    dataIndex: 'srccst_varchar5'
                },
                {
                    text: '작성자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'creator'
                },
                {
                    text: '작성일자',
                    style: 'text-align:center',
                    width: '10%',
                    sortable: true,
                    dataIndex: 'create_date'
                },
            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1280,
            height: 600,
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
                this.fileGrid
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


    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title: '파일업로드 완료',
            icon: Ext.MessageBox['INFO'],
            msg: '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width: 450
        });

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
    },
    dwgTypeStore: Ext.create('Mplm.store.DwgTypeStore', {}),
    purchaseYnStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PURCHASE_INS_YN' }),

});

