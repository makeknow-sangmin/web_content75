Ext.define('Rfx.view.executiveInfo.SpcDefineView', {
    extend: 'Ext.panel.Panel',
    xtype: 'report-write-view',
    initComponent: function(){

        this.storeViewTable = Ext.create('Mplm.store.DocuTplStore', {});
        this.storeViewTable.getProxy().setExtraParam('not_temp_type', 'DOC');
        this.storeViewTable.load();

        var srcAction/*this.searchAction*/ = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: '조건 검색',
            handler: function() {
                var items = srcToolbar.items.items;
                for(var i=0; i<items.length; i++) {
                    var item = items[i];
                    gm.me().storeViewTable.getProxy().setExtraParam(item.name, item.value);
                }
                gm.me().storeViewTable.load();
            }
        });

        var srcSearch = [
            {
                xtype: 'textfield',
                name: 'temp_name',
                emptyText: 'Item',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                width: 110,
                listeners: {
                    specialkey: function(f,e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                            gm.me().storeViewTable.load();
                        }
                    }
                },
                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                'onTrigger1Click': function() {
                    Ext.getCmp(this.id).setValue('');
                    gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                    gm.me().storeViewTable.load();
                }
            },{
                xtype: 'combo',
                // name: 'temp_type',
                emptyText: '제품',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                width: 70,
                store: this.TempTypeStore,
                // id:'temp_type',
                name: 'temp_type',
                anchor: '80%',
                valueField: 'systemCode',
                displayField: 'codeName',
                //emptyText: '선택해주세요.',
                listConfig: {
                    loadingText: '검색중...',
                    emptyText: '일치하는 항목 없음',
                    getInnerTpl: function() {
                        return '<div data-qtip="{}">{codeName}</div>';
                    }
                }
                // listeners: {
                //     specialkey: function(f,e) {
                //         if (e.getKey() == Ext.EventObject.ENTER) {
                //             gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                //             gm.me().storeViewTable.load();
                //         }
                //     }
                // },
                // trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                // 'onTrigger1Click': function() {
                //     Ext.getCmp(this.id).setValue('');
                //     gm.me().storeViewTable.getProxy().setExtraParam('temp_type', null);
                //     gm.me().storeViewTable.load();
                // }
            },{
                xtype: 'combo',
                // name: 'product_type',
                emptyText: '구분',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                width: 70,
                store: this.ProductTypeStore,
                // id:'product_type',
                name: 'product_type',
                anchor: '80%',
                valueField: 'systemCode',
                displayField: 'codeName',
                //emptyText: '선택해주세요.',
                listConfig: {
                    loadingText: '검색중...',
                    emptyText: '일치하는 항목 없음',
                    getInnerTpl: function() {
                        return '<div data-qtip="{}">{codeName}</div>';
                    }
                }
                // listeners: {
                //     specialkey: function(f,e) {
                //         if (e.getKey() == Ext.EventObject.ENTER) {
                //             gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                //             gm.me().storeViewTable.load();
                //         }
                //     }
                // },
                // trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                // 'onTrigger1Click': function() {
                //     Ext.getCmp(this.id).setValue('');
                //     gm.me().storeViewTable.getProxy().setExtraParam('product_type', null);
                //     gm.me().storeViewTable.load();
                // }
            }
        ]

        var srcToolbar = Ext.create('widget.toolbar', {
            items:srcSearch,
            layout:'column',
            cls: 'my-x-toolbar-default1'
        });

        console_logs('>srcToolbar', srcToolbar);

        var btnToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: srcAction
        });
        
        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inspect_name',
                type: 'string'
            }, {
                name: 'creator_name',
                type: 'string'
            }],
            data: [{
                inspect_name: 'Solder Ball 측정',
                creator_name: '김철수'
            },{
                inspect_name: 'B/W 측정',
                creator_name: '이만수'
            }]
        });

        this.storeInspectFields1 = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'position',
                type: 'string'
            }, {
                name: 'name',
                type: 'string'
            }, {
                name: 'data',
                type: 'string'
            }, {
                name: 'mapping_name',
                type: 'string'
            }]
        });


        this.storeInspectFields2 = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'position',
                type: 'string'
            }, {
                name: 'name',
                type: 'string'
            }, {
                name: 'f01',
                type: 'string'
            }, {
                name: 'f02',
                type: 'string'
            }, {
                name: 'f03',
                type: 'string'
            }, {
                name: 'f04',
                type: 'string'
            }, {
                name: 'f05',
                type: 'string'
            }, {
                name: 'f06',
                type: 'string'
            }, {
                name: 'f07',
                type: 'string'
            }, {
                name: 'f08',
                type: 'string'
            }, {
                name: 'f09',
                type: 'string'
            }, {
                name: 'f10',
                type: 'string'
            }, {
                name: 'f11',
                type: 'string'
            }, {
                name: 'f12',
                type: 'string'
            }, {
                name: 'f13',
                type: 'string'
            }, {
                name: 'f14',
                type: 'string'
            }, {
                name: 'f15',
                type: 'string'
            }, {
                name: 'mapping_name',
                type: 'string'
            }]
        });
        
        
        
        var gridViewTable = Ext.create('Ext.grid.Panel', {
            title: '품목',
            store: this.storeViewTable,
            cls : 'rfx-panel',
            region:'west',
            collapsible: true,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeViewTable),
            frame: true,
            layout          :'fit',
            forceFit: true,
            dockedItems:[
                btnToolbar,
                srcToolbar
            ],
            //margin: '5 5 0 0',
            width: '20%',
            columns: [{
                text: 'Item',
                flex: 1,
                dataIndex: 'temp_name'
            }, {
                text: '제품',
                width: 40,
                dataIndex: 'temp_type'
            }, {
                text: '구분',
                width: 40,
                dataIndex: 'product_type'
            }, {
                text: '파일',
                width: 40,
                dataIndex: 'file_flag'
                
            }]
        });

        gridViewTable.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                var rec = (selections!=null && selections.length>0) ? selections[0] : null;
                console_logs('gridViewTable selected rec', rec);
                var panel = gu.getCmp('mainMappingPanel');
                if(rec!=null) {

                    gu.getCmp('mainMappingPanel').setLoading(true);
                    var gridpanel = gu.getCmp('UploadGrid');
                    
                    var gridview  = gridpanel.getView();
                        
                    gridview.emptyText = '<div class="x-grid-empty">이곳에 파일을 끌어 놓으세요.</div>';
                    gridview.refresh();



                    gm.me().template_uid = rec.get('id');
                    gm.me().item_code = rec.get('temp_name');
                    gm.me().product_type = rec.get('product_type');
                    var product_type = rec.get('product_type');
                    var temp_name = rec.get('temp_name');
                    var unique_id = rec.get('unique_id_long');
                    gm.me().group_uid = unique_id;
                    panel.setTitle(temp_name);

                    var f1 = gu.getCmp('temp_name');
                    f1.setValue(temp_name);
                    f1.labelEl.update('선택한 품목:');

                    gu.getCmp('panelDataUpload').setTitle(rec.get('file_name'));
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/document/manage.do?method=getDocEntity',
                        params: {
                            docuTpl_uid: unique_id
                        },
                        success: function(result, request) {
                            gu.getCmp('mainMappingPanel').setLoading(false);

                            var result = result.responseText;
                            var data = Ext.util.JSON.decode(result);
                            var datas = data.datas;

                            //필드초기화
                            gm.me().resetFormField();
                            gu.getCmp('form-fieldset1').show();
                            gu.getCmp('form-fieldset2').show();

                            var cellCur=0, arrayCur=0;

                            if(datas==null || datas.length==0) {
                                gm.me().mappingFieldProp = {};
                            }
                            for(var i=0; i<datas.length; i++) {
                                var o = datas[i];
                                
                                if(o.max_cnt>1) { //Sampling
                                    arrayCur++;
                                    var key = arrayCur<10? 'a0'+ arrayCur : 'a' + arrayCur;
                                    //console_logs('arrayCur key', key);
                                    gm.me().updateProperty(key, o.title/* + '(' + o.max_cnt + ')'*/);

                                    gu.getCmp(key + '-col').setValue(o.colspan);
                                    gu.getCmp(key + '-row').setValue(o.rowspan);
                                   

                                    gu.getCmp(key).show();
                                    gu.getCmp(key + '-val').show();
                                    gu.getCmp(key + '-col').show();
                                    gu.getCmp(key + '-row').show();
                                    gu.getCmp(key + '-dir').show();
                                    gu.getCmp(key + '-desc').show();
                                    gu.getCmp(key + '-start').show();
                                    gu.getCmp(key + '-clabel').show();

                                    var arr = o.position.split('-');
                                    gu.getCmp(key + '-val').setValue(arr[0]);
                                    var start = arr.length>1? Number(arr[1]): 1;
                                    gu.getCmp(key + '-start').setValue(start);
                                    gu.getCmp(key + '-dir').setValue(o.dir);
                                    gu.getCmp(key + '-desc').setValue(o.description);

                                    gm.me().mappingFieldProp[key] = o;
                                    
                                    // console_logs('createCellPos start', key);
                                    // gm.me().createCellPos(key);
                                    // console_logs('createCellPos end', key);

                                } else { // Cell
                                    cellCur++;
                                    var key = cellCur<10? 'v0'+ cellCur : 'v' + cellCur;
                                    //console_logs('cellCur key', key);

                                    gm.me().updatePropLabel(key, o.title);

                                    gm.me().mappingFieldProp[key] = o;

                                    gu.getCmp(key).setValue(o.position);
                                    gu.getCmp(key).show();
                                }

                            }

                            //File Setting
                            gm.me().checkExcelTemplate();

                        },
                        failure: extjsUtil.failureMessage
                    });

                } else {
                    var gridpanel = gu.getCmp('UploadGrid');
                    var gridview  = gridpanel.getView();
                        
                    gridview.emptyText = '<div class="x-grid-empty">먼저 품목을 선택한 후 파일을 선택하세요.</div>';
                    gridview.refresh();
                    
                    panel.setTitle('엑셀파일과 매핑할 품목을 선택하세요.');
                    f1.labelEl.update('품목:');
                }
            }
        });

        var gridInspect = Ext.create('Ext.grid.Panel', {
            store: storeInspect,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(storeInspect),
            frame: true,
            layout          :'fit',
            forceFit: true,
            margin: '5 10 0 0',
            flex: 1,
            columns: [{
                text: '검사유형',
                flex: 1,
                dataIndex: 'inspect_name'
            }, {
                text: '작성자',
                width: 80,
                dataIndex: 'creator_name'
            }],
            title: '검사유형 선택'
        });


        var targetListnenrs = {
            'render':function(panel){
                console_logs('panel.body', panel.body);
                // panel.el.on('click', function() {
                //     console_logs('panel.body', panel.body);
                //     panel.body.setStyle('borderColor','red');
                // });
            var body = panel.body;
            new Ext.dd.DropTarget(body, {
                ddGroup: 'grid-to-form',
    
                notifyEnter: function (ddSource, e, data) {
                    //Add some flare to invite drop.
                    body.stopAnimation();
                    body.highlight();
                },
    
                notifyDrop: function (ddSource, e, data) {

                    var records = ddSource.dragData.records;
                    for(var i=0; i<records.length; i++) {
                        var selectedRecord = ddSource.dragData.records[i];
    
                        panel.store.add({
                            name: selectedRecord.get('name'),
                            position: selectedRecord.get('position')
                        });
                        // Delete record from the source store.  not really required.
                        ddSource.view.store.remove(selectedRecord);
                    }
                    return true;
                }
            });
    
            
        }};


        var gridFileUploader = Ext.create('Ext.panel.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridFileUploader'),
            collapsible: false,
            region: 'east',
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            layout: 'vbox',
            forceFit: true,
            panelHeight:120,
            items: [/*this.createMsTab('SIZE', 'SI'), */this.createMsTab('성분', 'IN')]
        });

         var gridInspectFields1 = Ext.create('Ext.grid.Panel', {
            enableDragDrop: true,
            store: this.storeInspectFields1,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            frame: true,
            layout: 'fit',
            forceFit: true,
            margin: '10 5 5 5',

            columns: [{
                text: '셀좌표',
                width:30,
                align: 'center',
                dataIndex: 'position',
                sortable: false
            },{
                text: '엑셀 내용',
                dataIndex: 'data',
                sortable: false
            },{
                text: '필드명',
                width:40,
                dataIndex: 'name',
                sortable: false
            },{
                text: '매핑필드',
                width:0,
                hidden: true,
                dataIndex: 'mapping_field',
                sortable: false
            }],
            //title: '필드를 원하는 위치에 끌어다 놓으세요.',
            viewConfig: {
                plugins: {
                    gridviewdragdrop: {
                        ddGroup: 'grid-to-form',
                        enableDrop: false
                    }
                }
            },
            listeners:{
                'render':function(panel){

                var body = panel.body;
                new Ext.dd.DropTarget(body, {
                    ddGroup: 'form-to-grid',
        
                    notifyEnter: function (ddSource, e, data) {
                        //Add some flare to invite drop.
                        body.stopAnimation();
                        body.highlight();
                    },
        
                    notifyDrop: function (ddSource, e, data) {
                        // Reference the record (single selection) for readability
                        var selectedRecord = ddSource.dragData.records[0];
        
                        // Load the record into the form
                        console_logs('selectedRecord', selectedRecord);
                        console_logs('e', e);
                        console_logs('data', data);

                        panel.store.add(
                            {
                                name: selectedRecord.get('name'),
                                position: selectedRecord.get('position')
                            });

                        //panel.store.add(selectedRecord);
                        //panel.store.load();
        
                        // Delete record from the source store.  not really required.
                        ddSource.view.store.remove(selectedRecord);
                        return true;
                    }
                });
                
            }}

        });
        var gridInspectFields2 = Ext.create('Ext.grid.Panel', {
            enableDragDrop: true,
            store: this.storeInspectFields2,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            frame: false,
            layout: 'fit',
            forceFit: true,
            margin: '5 5 5 5',
            columns: [{
                text: '셀좌표',
                align: 'center',
                dataIndex: 'position'
            },{
                text: '1',
                dataIndex: 'f01'
            },{
                text: '2',
                dataIndex: 'f02'
            },{
                text: '3',
                dataIndex: 'f03'
            },{
                text: '4',
                dataIndex: 'f04'
            },{
                text: '5',
                dataIndex: 'f05'
            },{
                text: '6',
                dataIndex: 'f06'
            },{
                text: '7',
                dataIndex: 'f07'
            },{
                text: '8',
                dataIndex: 'f08'
            },{
                text: '9',
                dataIndex: 'f09'
            },{
                text: '10',
                dataIndex: 'f10'
            },{
                text: '11',
                dataIndex: 'f11',
                hidden: true
            },{
                text: '12',
                dataIndex: 'f12',
                hidden: true
            },{
                text: '13',
                dataIndex: 'f13',
                hidden: true
            },{
                text: '14',
                dataIndex: 'f14',
                hidden: true
            },{
                text: '15',
                dataIndex: 'f15',
                hidden: true
            },{
                text: 'dir',
                dataIndex: 'dir',
                hidden: true
            },{
                text: '그룹명',
                dataIndex: 'name',
                hidden: true
            },{
                text: '그룹',
                dataIndex: 'display_name'
            },{
                text: '매핑필드',
                width:0,
                hidden: true,
                dataIndex: 'mapping_field'
            }],
            viewConfig: {
                plugins: {
                    gridviewdragdrop: {
                        ddGroup: 'grid-to-form',
                        enableDrop: false
                    }
                }
            },
            listeners:{
                itemdblclick: function(dv, record, item, index, e) {
                    console_logs('dv', dv);
                    console_logs('record', record);
                    console_logs('item', item);
                    console_logs('index', index);
                    console_logs('e', e);

                    var txt1 = 'X축\t|';
                    var txt2 = '값\t|';
                    var txt3 = '좌표\t|';
                    for(var i=0; i<15; i++) {
                        var key = i<9 ? 'f0' + (i+1) : 'f' +i;

                        var val = record.get(key);
                        var position = record.get(key+ '-cell');

                        if(val!=undefined && position!=undefined) {
                            txt1 = txt1 + '\t' + (i+1);
                            txt2 = txt2 + '\t' + val;
                            txt3 = txt3 + '\t' + position;
                        }
                        txt = txt1 + '\n'
                            + '---------------------------------------------------------------------------------'+ '\n'
                            + txt2+ '\n'
                            + '---------------------------------------------------------------------------------'+ '\n'
                            + txt3;
                    }


                    Ext.create('Ext.window.MessageBox', {
                        resizable: true
                    }).show({
                        title: '좌표 및 값',
                        modal: true,
                        msg: '내용',
                        width:800,
                        resizable: true,
                        height:240,
                        buttons: Ext.MessageBox.OK,
                        multiline: true,
                        defaultTextHeight: 120,
                        scope: this,
                        value: txt,
                        initComponent: function() {
                            //console_logs('initComponent', this.value);
                        },
                        fn: function(btn, text, c) {
                            //console_logs('btn', btn);
                            //console_logs('text', text);
                            //console_logs('c', c);
                            //console_logs('this', this);
        
                            if(btn == 'yes' && text != '<값 없음>') {
        
                            }
        
                            //gm.me().showToast(Ext.String.format('You clicked the {0} button and entered the text "{1}".', btn, text));
                        }//,
                        //animateTarget: btn
                    });
        


                   
                },
                'render':function(panel){

                var body = panel.body;
                new Ext.dd.DropTarget(body, {
                    ddGroup: 'form-to-grid',
        
                    notifyEnter: function (ddSource, e, data) {
                        //Add some flare to invite drop.
                        body.stopAnimation();
                        body.highlight();
                    },
        
                    notifyDrop: function (ddSource, e, data) {
                        // Reference the record (single selection) for readability
                        var selectedRecord = ddSource.dragData.records[0];
        
                        // Load the record into the form
                        console_logs('selectedRecord', selectedRecord);
                        console_logs('e', e);
                        console_logs('data', data);

                        panel.store.add(
                            {
                                name: selectedRecord.get('name'),
                                position: selectedRecord.get('position')
                            });

                        //panel.store.add(selectedRecord);
                        //panel.store.load();
        
                        // Delete record from the source store.  not really required.
                        ddSource.view.store.remove(selectedRecord);
                        return true;
                    }
                });
                
            }}

        });

        var panelDataUpload = {
            id: gu.id('panelDataUpload'),
            title: '템플릿파일 지정',
            collapsible: false,
            frame: true,
            autoScroll: true,
            region: 'east',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            width: '45%',
            items: [gridFileUploader, gridInspectFields1, gridInspectFields2]
        };


        var targetListnenrsFrom = {
            'render':function(panel){
                console_logs('panel.body', panel.body);
                // panel.el.on('click', function() {
                //     console_logs('panel.body', panel.body);
                //     panel.body.setStyle('borderColor','red');
                // });
            var body = panel.body;
            new Ext.dd.DropTarget(body, {
                ddGroup: 'grid-to-form',
    
                notifyEnter: function (ddSource, e, data) {
                    //Add some flare to invite drop.
                    body.stopAnimation();
                    body.highlight();
                },
    
                notifyDrop: function (ddSource, e, data) {

                    var template_uid = gm.me().template_uid;
                    if(template_uid<0) {
                        Ext.Msg.alert('경고', '품목을 먼저 선택하세요.');
                        return;
                    }

                    console_logs('notifyDrop e', e);
                    console_logs('notifyDrop data', data);
                    console_logs('notifyDrop e.target', e.target);
                    console_logs('notifyDrop e.target.id', e.target.id);

                    var records = ddSource.dragData.records;
                    var selectedRecord = records[0];

                    console_logs('selectedRecord', selectedRecord);
                    if(selectedRecord!=null) {
                        var type = selectedRecord.get('type'); //2,4: CELL, 6: Sampling array

                        var position = selectedRecord.get('position');
                        console_logs('position', position);

                        var targetId = e.target.id;
                        console_logs('targetId', targetId);

                        var rangeType = targetId.charAt(0);

                        var isDup = gm.me().checkDupCell(position);

                        if(isDup==true) {
                            return;
                        }
                        console_logs('type', type);
                        console_logs('rangeType', rangeType);
                        if((type==2 || type==4) && rangeType=='a' || type==6 && rangeType=='v') {
                            Ext.Msg.alert('경고', '영역을 확인하세요.');
                            return;
                        }
                        if(rangeType=='v') { //CELL Data
                            var tail = '-inputEl';
                            if(targetId.length>tail.length) {
                                var myId = targetId.substring(0, targetId.length - tail.length);
                                console_logs('notifyDrop myId', myId);
                                var o = Ext.getCmp(myId);
                                console_logs('notifyDrop o', o);
                                if(o!=null) {
                                    var name = o.name;
                                    console_logs('notifyDrop name', name);
                                    var labelName = gm.me().mapPropName[name];
                                    console_logs('notifyDrop labelName', labelName);

                                    if(name!=null) {
                                        var target = gu.getCmp(name);
                                        if(target!=null) {
                                                selectedRecord.set('mapping_field', name);
                                                selectedRecord.set('name', labelName);
                                                target.setValue(selectedRecord.get('position'));
                                                return true;
                                            }
                                    }

                                }
                            }
                        } else { //Array Data
                            var tail = '-inputEl';
                            if(targetId.length>tail.length) {
                                var myId = targetId.substring(0, targetId.length - tail.length);
                                console_logs('notifyDrop myId', myId);
                                var o = Ext.getCmp(myId);
                                console_logs('notifyDrop o', o);
                                
                                if(o!=null) {
                                    
                                    var arr = myId.split('-');
                                    var key = arr[0];
                                    console_logs('notifyDrop array key', key);
                                    o = gu.getCmp(key+'-val'); //정확한 위치 조정
                                    var name = o.name;
                                    
                                    o.setValue(position);

                                    if(key!=null) {
                                        var target = gu.getCmp(key);
                                        console_logs('target', target);
                                        var labelName = target.html;
                                        if(target!=null) {
                                                //selectedRecord.set('mapping_field', name);
                                                //selectedRecord.set('name', labelName);
                                                
                                                var dir = selectedRecord.get('dir');
                                                gu.getCmp(key+'-dir').setValue(dir);
                                                if('R' == dir) {
                                                    var rowCnt = gm.me().getSampleRowCnt(selectedRecord.get('name'));
                                                    console_logs('rowCnt', rowCnt);
                                                    gu.getCmp(key+'-row').setValue(rowCnt);
                                                    gu.getCmp(key+'-col').setValue(1);
                                                } else {
                                                    gu.getCmp(key+'-col').setValue(selectedRecord.get('size'));
                                                    gu.getCmp(key+'-row').setValue(1);
                                                }
                                                gu.getCmp(key+'-start').setValue(1);


                                                
                                                //target.update(selectedRecord.get('position'));
                                                //target.setValue(selectedRecord.get('position'));


                                                gm.me().createCellPos(key);

                                                return true;
                                            }
                                    }

                                }
                            }
                        }

                    }
                    return false;
                    

                }
            });
        }
    };

    var fieldDir = [{
        name: 'name',
        type: 'string'
    }, {
        name: 'position',
        type: 'string'
    }];
    var fieldData = [{
        name: '행',
        position: 'C'
    },{
        name: '열',
        position: 'R'
    }];


    var samplingItems = [];
    samplingItems.push({xtype: 'tbtext', text: '항목' , style: {'text-align': 'center'}});
    samplingItems.push({xtype: 'tbtext', text: '기준좌표' , style: {'text-align': 'center'}});
    samplingItems.push({xtype: 'tbtext', text: '시작 X축' , style: {'text-align': 'center'}});
    samplingItems.push({xtype: 'tbtext', text: '행수' , style: {'text-align': 'center'}});
    samplingItems.push({xtype: 'tbtext', text: '열수' , style: {'text-align': 'center'}});
    samplingItems.push({xtype: 'tbtext', text: '방향' , style: {'text-align': 'center'}});
    samplingItems.push({xtype: 'component', html: '<br>',    colspan :6 });

    var i=0;
    for(; i<this.aCnt; i++) {
        var cellCur = i+1;
        var cellCur = cellCur<10? 'a0'+ cellCur : 'a' + cellCur;
        samplingItems.push({id: gu.id(cellCur), xtype: 'tbtext', text: '.:' , style: {'text-align': 'right'}});
        samplingItems.push({ id: gu.id(cellCur + '-val'), style : 'text-align:center', hideLabel: true,trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
           onTrigger1Click: function(a,b,c) {
                console_logs('this.id', this.id);
                Ext.getCmp(this.id).setValue('');
                var arr = this.id.split('-');
                var key = arr[0];
                gu.getCmp(key + '-desc').setValue('');
           }});
        samplingItems.push({ xtype: 'numberfield', minValue: 1, id: gu.id(cellCur + '-start'), value:1, listeners: { change: function() { gm.me().createCellPos((this.id.split('-'))[0]); } } });
        samplingItems.push({ xtype: 'numberfield', minValue: 1, id: gu.id(cellCur + '-col'), listeners: { change: function() { gm.me().createCellPos((this.id.split('-'))[0]); } }});
        samplingItems.push({ xtype: 'numberfield', minValue: 1, id: gu.id(cellCur + '-row'), listeners: { change: function() { gm.me().createCellPos((this.id.split('-'))[0]); } }});
        samplingItems.push({ xtype: 'combo', id: gu.id(cellCur + '-dir'), style: {align: 'right'}, queryMode: 'local', triggerAction: 'all',  valueField: 'position', displayField: 'name', value: 'C', selectOnFocus: true,
        store: Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: fieldDir,
            data:fieldData
        }), listeners: { change: function(combo, value) {gm.me().createCellPos((combo.id.split('-'))[0]); } }});
        samplingItems.push({ id: gu.id(cellCur + '-clabel'), xtype: 'tbtext', text: '' , style: {'text-align': 'right'}
            // ,handler: function() {
            //     gm.me().createCellPos((this.id.split('-'))[0]);
            // }
        });
        samplingItems.push({ id: gu.id(cellCur + '-desc'),fieldLabel: '', labelSeparator : '',
            xtype : 'textfield',
            colspan :5,
            width: '100%', argin: '5 5 5 5',style: {'text-align': 'left'},
            readOnly: true,
            fieldStyle: 'background-color: #E7EEF6; background-image: none;'
        });
    }

    var cellItems = [];
    i=0;
    for(; i<this.vCnt; i++) {
        var cellCur = i+1;
        var cellCur = cellCur<10? 'v0'+ cellCur : 'v' + cellCur;

        cellItems.push(  {
            xtype: 'triggerfield',
            id: gu.id(cellCur),
            name: cellCur,
            fieldLabel: '.',
            trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
            onTrigger1Click: function(a,b,c) {
                Ext.getCmp(this.id).setValue('');
            }
        } );

    }

        var form =
        Ext.create('Ext.form.Panel', {
            title: '엑셀파일과 매핑할 품목을 선택하세요.',
            frame: true,
            id: gu.id('mainMappingPanel'),
            bodyPadding: 10,
            autoScroll: true,
            region: 'center',
            width: '35%',
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 100,
            },
            enableDragDrop: true,
            viewConfig: {
                plugins: {
                    gridviewdragdrop: {
                        ddGroup: 'form-to-grid',
                        enableDrop: false
                    }
                }
            },
            dockedItems : [
                        
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default',
                    margin: '0 0 0 0',
                    items: [{
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text:'저장',
                            listeners : [{
                                click: function() {
                                    if(gm.me().group_uid<0) {
                                        Ext.Msg.alert('경고', '항목을 확인할 수 없습니다.');
                                        return;
                                    }
                                    var arr = gm.me().validateCheck('save');
                                    console_logs('arr', arr);
                                    if(arr!=null) {
                                        var msg = null;
                                        if(arr.length==0) {
                                            msg = '지정된 항목 별 매핑정보가 없습니다.';
                                        } else {
                                            msg = '중복 지정된 셀좌표가 있습니다. 다시한번 확인하세요.';
                                            msg = msg + '<br>' + arr.toString();
                                        }

                                        Ext.Msg.alert('경고', msg);
                                        return;
                                    }
                                    var mappingFieldProp = gm.me().mappingFieldProp;
                                    console_logs('mappingFieldProp', mappingFieldProp);
                                    
                                    var arr = [];
                                    for (index in mappingFieldProp) {
                                        var val = '';

                                        if(index.charAt(0) == 'a') {
                                            try { val = gu.getCmp(index + '-val').getValue(); } catch(e) {}
                                        } else {
                                            try { val = gu.getCmp(index).getValue(); } catch(e) {}
                                        }

                                        console_logs(mappingFieldProp[index].unique_id_long, val);
                                        
                                        var colspan = 1;
                                        var rowspan = 1;
                                        var desc = ''; //CEll 좌표
                                        var dir = ''; //방향
                                        if(index.charAt(0) == 'a' && val!=null&& val.length>0) {
                                            colspan =   gu.getCmp(index+ '-col').getValue();
                                            rowspan =   gu.getCmp(index+ '-row').getValue();
                                            desc =      gu.getCmp(index+ '-desc').getValue();
                                            dir =       gu.getCmp(index + '-dir').getValue();

                                            var start =gu.getCmp(index+ '-start').getValue();
                                            val = val + '-' + start;
                                        }
                                        if(val!=null && val.length>0) {
                                            var s = '' + mappingFieldProp[index].unique_id_long + ':' + val + ':' + colspan + ':' + rowspan + ':' + desc + ':' + dir;
                                            arr.push(s);
                                            console_logs('save arr', arr);
                                        }
                                    }

                                    gu.getCmp('mainMappingPanel').setLoading(true);
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/document/manage.do?method=saveDocEntity',
                                        params: {
                                            group_uid: gm.me().group_uid,
                                            arr : arr
                                        },
                                        scope : this,
                                        success : function(result, request){
                                            console_logs('OK');
                                            gu.getCmp('mainMappingPanel').setLoading(false);
                                        }
                                    });
                                }
                            }]
                        }, '->', {
                            iconCls: null,
                            glyph: 'f00c@FontAwesome',
                            text:'사전 검증',
                            listeners : [{
                                click: function() {
                                    if(gm.me().group_uid<0) {
                                        Ext.Msg.alert('경고', '항목을 확인할 수 없습니다.');
                                        return;
                                    }
                                    var arr = gm.me().validateCheck('validate');
                                    console_logs('arr', arr);
                                    if(arr!=null) {
                                        var msg = null;
                                        if(arr.length==0) {
                                            msg = '지정된 항목 별 매핑정보가 없습니다.';
                                        } else {
                                            msg = '중복 지정된 셀좌표가 있습니다. 다시한번 확인하세요.';
                                            msg = msg + '<br>' + arr.toString();
                                        }
                                        Ext.Msg.alert('경고', msg);
                                        return;

                                    } else {
                                        Ext.Msg.alert('확인', '정상적인 데이터 입력입니다. 저장 하시기 바랍니다.');
                                    }
                                    
                                }
                            }]
                        }/*, {
                           iconCls: null,
                             glyph: 'f0c5@FontAwesome',
                            text:'Sampling 생성',
                            listeners : [{
                                click: function() {
                                    var item_code = gm.me().item_code;
                                    if(item_code=='') {
                                        Ext.Msg.alert('경고', '품목을 먼저 선택하세요.');
                                        return;
                                    } else {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=makeSamplingData',
                                            params: {
                                                item_code: gm.me().item_code,
                                                out_lot: 'PC8A7327'
                                            },
                                            scope : this,
                                            success : function(result, request){
                                                var json = Ext.util.JSON.decode(result.responseText);
                                                console_logs('json', json);
                                                Ext.Msg.alert(json.result==true ? '성공' : '실패', json.reason[0]);

                                            }
                                        });
                                    }


                                }
                            }]
                        }*/]
                    })
            ],
            listeners: targetListnenrsFrom,
            items: [
                {
                    xtype: 'fieldset',
                    style: 'background-color: #F6F6F6; background-image: none;',
                    defaults: {
                        componentCls: "",
                        width: '100%',
                    },
                    layout: {
                        type: 'table',
                        columns: 2,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [
                        {
                            id: gu.id('temp_name'),
                            name:'temp_name',
                            xtype: 'textfield',
                            width: '100%',
                            readOnly: true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            fieldLabel: '품목',
                            value: ''
                        },
                        {
                            xtype: 'datefield',
                            id: gu.id('create_date'),
                            name:'create_date',
                            fieldLabel: '작성일자',
                            width: '100%',
                            value: new Date()
                        }
                    ]
                },
                {
                xtype: 'fieldset',
                id: gu.id('form-fieldset1'),
                title: 'CELL 속성',
                style: 'background-color: #F6F6F6; background-image: none;',
                hidden: true,
                defaults: {
                    componentCls: "",
                    width: '100%',
                    labelWidth: 120,
                },
                layout: {
                    type: 'table',
                    columns: 2,
                    tableAttrs: {
                        style: {
                            width: '100%'
                        }
                    }
                },
                items:cellItems 
            },
            {
                xtype: 'fieldset',
                id: gu.id('form-fieldset2'),
                defaultType: 'textfield',
                title: 'Sampling 속성',
                hidden: true,
                style: 'background-color: #F6F6F6; background-image: none;',
                layout: {
                    type: 'table',
                    columns: 6,
                    tableAttrs: {
                        style: {
                            width: '100%',
                            tableLayout: 'fixed'
                        }
                    }
                },
                defaults: {
                    //componentCls: "",
                    width: '100%',
                    labelAlign: 'right',
                    labelWidth: 80,

                },
                items : samplingItems
                
            }
            
        
        ]
            
        });

        console_logs('this', this);
        Ext.apply(this, {
            // layout: {
            //     type: 'hbox',
            //     pack: 'start',
            //     align: 'stretch'
            // },
            layout: 'border',
            bodyBorder: false,
            dockedItems: [gu.getExcelToolbar(this.id)],
            defaults: {
                collapsible: false,
                split: true,
                //bodyPadding: 10
            },
            items:[
                gridViewTable,
                form, panelDataUpload
            ]
        });


        this.callParent(arguments);

    },

    //bodyPadding: 10,

    defaults: {
        frame: true//,
        //bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300 //Only Support this
        //labelWidth: "100"     //Doesn't render with 100 Pixel Size
        //labelWidth: "100px"	//Suffix with px won't work
        //, height:20
    },
    items: null,
    reportTemplateStore: null,
    createMsTab: function (title, template_uid) {

        var reportTemplateStore =   Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'name',
                type: 'string'
            }, {
                name: 'size',
                type: 'int'
            }, {
                name: 'status',
                type: 'string'
            }]
        });

        this.reportTemplateStore = reportTemplateStore;

        // this.stores.push(Ext.create('Ext.data.Store', {
        //     fields: ['name', 'size', 'file', 'status']
        // }));
        // var sc = this.storecount++;

        var tabDataUpload = Ext.create('Ext.panel.Panel', {
            //title: title,
            tabPosition: 'bottom',
            plain: true,
            width: '100%',
            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            items: [{
                                multiSelect: true,
                                xtype: 'grid',
                                id: gu.id('UploadGrid'),
                                //selModel: Ext.create("Ext.selection.CheckboxModel"),
                                border: true,
                                height: '300',
                                columns: [{
                                    header: '파일명',
                                    dataIndex: 'name',
                                    flex: 2
                                }, {
                                    header: '파일크기',
                                    dataIndex: 'size',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: '상태',
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: this.rendererStatus
                                }],

                                viewConfig: {
                                    emptyText: '먼저 품목을 선택한 후 파일을 선택하세요.',
                                    //emptyText: '이곳에 파일을 끌어 놓으세요',
                                    deferEmptyText: false
                                },
                                store: reportTemplateStore,

                                listeners: {

                                    drop: {
                                        element: 'el',
                                        fn: 'drop'
                                    },

                                    dragstart: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragenter: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragover: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragleave: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                    dragexit: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                },

                                noop: function (e) {
                                    e.stopEvent();
                                },

                                addDropZone: function (e) {
                                    if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                        return;
                                    }

                                    e.stopEvent();

                                    this.addCls('drag-over');
                                },

                                removeDropZone: function (e) {
                                    var el = e.getTarget(),
                                        thisEl = this.getEl();

                                    e.stopEvent();


                                    if (el === thisEl.dom) {
                                        this.removeCls('drag-over');
                                        return;
                                    }

                                    while (el !== thisEl.dom && el && el.parentNode) {
                                        el = el.parentNode;
                                    }

                                    if (el !== thisEl.dom) {
                                        this.removeCls('drag-over');
                                    }

                                },

                                drop: function (e) {

                                    e.stopEvent();
                                    Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {

                               
                                        var template_uid = gm.me().template_uid;
                                        if(template_uid<0) {
                                            Ext.Msg.alert('경고', '품목을 먼저 선택하세요.');
                                            return;
                                        }

                                        var filename = file.name;
                                        var ext = filename.split('.').pop();

                                        
                                        if('XLSX' == ext.toUpperCase()) {
                                            gm.me().reportTemplateStore.add({
                                                file: file,
                                                name: file.name,
                                                size: file.size,
                                                status: '대기'
    
                                            });
                                            var l_store = gm.me().reportTemplateStore;
    
                                            for (var i = 0; i < l_store.data.items.length; i++) {
                                                if (!(l_store.getData().getAt(i).data.status === "완료")) {
                                                    l_store.getData().getAt(i).data.status = "업로드중";
                                                    l_store.getData().getAt(i).commit();
                                                    gm.me().postDocument(CONTEXT_PATH + '/uploader.do?method=multi&table_name=docutpl&file_itemcode=' + gUtil.RandomString(10),
                                                        l_store, i, template_uid);
                                                }
                                            }
                                            gu.getCmp('panelDataUpload').setTitle(filename);
                                            
                                        } else {
                                            Ext.Msg.alert('경고', filename + ': 잘못된 파일 유형입니다.<br>엑셀문서(*.xlsx)만 지원합니다.');
                                        }

                                    });
                                    this.removeCls('drag-over');
                                },



                            }],
                        }

                    ]
                }
            ]
        });

        return tabDataUpload;
    },
    mapPropName: {},
    updatePropLabel: function(key , name) {
        try {
            this.mapPropName[key] = name;
            gu.getCmp(key).labelEl.update(name);
        } catch(e) {console_logs('updatePropLabel', e);}

    },
    updateProperty: function(key , name) {
        try {
            this.mapPropName[key] = name;
            gu.getCmp(key).update(name);
        } catch(e) {console_logs('updateProperty', e);}
    },
    template_uid: -1,
    product_type: '',
    item_code: '',
    postDocument: function(url, store, i, template_uid) {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('group_code', template_uid);
        fd.append('replace', 'true');

        //xhr.setRequestHeader("Content-Type","multipart/form-data");
        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //handle the answer, in order to detect any server side error

                var result = Ext.decode(xhr.responseText);
                console_logs('result', result);
                if (Ext.decode(xhr.responseText).success) {
                    store.getData().getAt(i).data.status = "Uploaded";
                    gm.me().reportTemplateStore.reload();
                    gm.me().checkExcelTemplate();

                } else {
                    store.getData().getAt(i).data.status = "Error";
                }
                //store.getData().getAt(i).commit();
            } else if (xhr.readyState == 4 && xhr.status == 404) {
                store.getData().getAt(i).data.status = "Error";
                //store.getData().getAt(i).commit();
            }
        };
        // Initiate a multipart/form-data upload
        xhr.send(fd);
    },
    vCnt : 50, //Cell 최대 필드 수
    aCnt : 10,  //Array 최대 필드 수
    mappingFieldProp : {},
    resetFormField: function() {
        var i=0;
        for(; i<this.vCnt; i++) {
            //console_logs('resetFormField i', i);
            var cellCur = i+1;
            var key = cellCur<10? 'v0'+ cellCur : 'v' + cellCur;
            //console_logs('cellCur key', key);
            //gm.me().updatePropLabel(key, '.:');


            gu.getCmp(key).hide();
        }
        i=0;
        for(; i<this.aCnt; i++) {
                var arrayCur = i+1;
                var key = arrayCur<10? 'a0'+ arrayCur : 'a' + arrayCur;
                //console_logs('arrayCur key', key);
                //gm.me().updateProperty(key, '.:');

                gu.getCmp(key + '-col').setValue('');
                gu.getCmp(key + '-row').setValue('');
                gu.getCmp(key + '-desc').setValue('');
                gu.getCmp(key + '-start').setValue('');

                gu.getCmp(key).hide();
                gu.getCmp(key + '-val').hide();
                gu.getCmp(key + '-col').hide();
                gu.getCmp(key + '-row').hide();
                gu.getCmp(key + '-dir').hide();
                gu.getCmp(key + '-desc').hide();
                gu.getCmp(key + '-start').hide();
                gu.getCmp(key + '-clabel').hide();
        }

    },
    group_uid: -1,
    checkDupCell : function(position) {
        var mappingFieldProp = gm.me().mappingFieldProp;

        for (index in mappingFieldProp) {
            //console_logs('index',  index);
            if(index.charAt(0) == 'v') {
                var o = gu.getCmp(index);
                var v = o.getValue();
                //console_logs(index,  v);
                if(position==v) {
                    Ext.Msg.alert('경고', '이미 매핑된 좌표입니다.');
                    return true;
                }
            } else if(index.charAt(0) == 'a') {
                var o = gu.getCmp(index + '-val');
                var v = o.getValue();
                //console_logs(index,  v);
                // if(position==v) {
                //     Ext.Msg.alert('경고', '이미 매핑된 좌표입니다.');
                //     return true;
                // }
            }

        }

        return false;
    },
    //sampling group record 갯수
    getSampleRowCnt: function(name) {
        var records = this.storeInspectFields2.data.items;
        var cnt=0;
        console_logs('cnt', cnt);
        for(var i=0; i<records.length; i++) {
            var o = records[i];
            console_logs('getSampleRowCnt o name', o.get('name'));
            console_logs('name', name);
            if(o.get('name')==name) {
                cnt++;
                console_logs('cnt', cnt);
            }
        }
        console_logs('cnt', cnt);
        return cnt;
    },
    createCellPos : function(key) {

        //console_logs('createCellPos start', key);
        var cell = gu.getCmp(key + '-val').getValue();
        var start = gu.getCmp(key + '-start').getValue();
        var colspan = gu.getCmp(key + '-col').getValue();
        var rowspan = gu.getCmp(key + '-row').getValue();
        var dir = gu.getCmp(key + '-dir').getValue();



        var arr = gm.me().findPositions(cell, start, colspan, rowspan, dir);
        
        var line = null;
        for(var i=0; i<arr.length; i++) {
            if(i==0) {
                line = '' + arr[i];
            } else {
                line = line + ', ' + arr[i];
            }
        }
        gu.getCmp(key + '-desc').setValue(line);
    },
    findPositions: function (cell, start, colspan, rowspan, dir) {
        
        var ret = [];

        // console_logs('cell', cell);
        // console_logs('start', start);
        // console_logs('colspan', colspan);
        // console_logs('rowspan', rowspan);
        // console_logs('dir', dir);

        var totalQty = colspan*rowspan;
        // console_logs('totalQty', totalQty);

        if(cell==null || start==null || colspan==null || rowspan==null || dir==null
            || start<1 || colspan<1 || rowspan<1 || cell==''
        ) {
            //Ext.Msg.alert('경고', '입력값을 확인하세요.');
            return ret;
        }


        var records = this.storeInspectFields2.data.items;
        var i=0;
        for(; i<records.length; i++) {
            var o = records[i];
            // console_logs('findPositions o', o);
            if(o.get('position')==cell) {
                break;
            }
        }
        // console_logs('i', i);
        if(dir == 'C') { //행방향
            var rowNum = 0;
            for(; i<records.length && rowNum<rowspan; i++) {
                var o = records[i];
                console_logs(dir+ ': findPositions o', o);
                for(var j=0; j<colspan; j++) {
                    var n = j-1+start;
                    console_logs('n', n);
                    var key = n<9 ? 'f0' + (n+1) : 'f' +n;

                    var position = o.get(key+ '-cell');
                    ret.push(position==undefined? '?':position);
                }
                rowNum++;
            }
        } else { //열방향
            for(var n=0; n< totalQty; n++) {
                ret.push('?');
            }

            var rowNum = 0;
            for(; i<records.length && rowNum<rowspan; i++) {
                var o = records[i];
                console_logs(dir+ ': findPositions o', o);
                var colNum = 0;
                for(var j=0; j<colspan; j++) {
                    var n = j-1+start;
                    console_logs('n', n);
                    var key = n<9 ? 'f0' + (n+1) : 'f' +n;

                    var position = o.get(key+ '-cell');
                    ret[rowNum + colNum*rowspan] = position==undefined? '?':position;
                    colNum++;
                }
                rowNum++;
            }
        }
        // console_logs('ret', ret);
        if(ret.length==0) {
            //Ext.Msg.alert('경고', '셀좌표를 확인할 수 없습니다.');
        }

        return ret;

    },
    checkExcelTemplate: function() {
        gu.getCmp('panelDataUpload').setLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=checkExcelTemplate',
            params: {
                group_uid : this.template_uid,
                product_type: this.product_type
            },
            scope : this,
            success : function(result, request){
                if(result.responseText){
                    var json = Ext.util.JSON.decode(result.responseText);
                    console_logs('json', json);
                    gm.me().storeInspectFields1.removeAll();
                    gm.me().storeInspectFields2.removeAll();

                    if(json.result == false) { //파일이 없음. Reset해야함.
                        
                        if(json.reason == 'file is deleted') {
                            Ext.Msg.alert('경고', '지정된 템플릿파일을 찾을 수 없습니다. <br>파일을 재지정 하세요.');
                            //gu.getCmp('panelDataUpload').setTitle('파일삭제로 템플릿파일 재지정');
                        } else {
                            gu.getCmp('panelDataUpload').setTitle('템플릿파일 지정');
                        }


                        gu.getCmp('panelDataUpload').setLoading(false);	
                        return;
                    }

                    var datas = json.formatter.listCell;
                    var nO = null;
                    for(var i=0 ; i < datas.length; i++) {
                        var o = datas[i];
                        //console_logs('o', o);
                        if(o.type == 2 || o.type == 4) {
                            if( o.type == 4) {
                                o.mapping_name = o.name;

                                var field_code = gm.me().mappingFieldProp[o.name];
                                var field_codeO = gu.getCmp(field_code);
                                if(field_codeO!=null) {
                                    try {
                                        gu.getCmp(field_code).setValue(o.position);
                                    } catch(e) {
                                        console_logs('error', e);
                                    }
                                }
                            }
                            gm.me().storeInspectFields1.add(o);
                        } else if(o.type == 6) {
                            var name = o.name;
                            var arr = name.split('-');
                            //console_logs('arr', arr);
                            var parnetName = arr[0];
                            var coord = '' + o.no; //arr[1];
                            var g1 = '';
                            if(coord=='1') {
                                if(nO!=null) {
                                    nO.type = 6;
                                    gm.me().storeInspectFields2.add(nO);
                                }
                                nO = {};
                                nO['position'] = o.position;

                                g1 = parnetName.substring(0, 3);
                                var g2 = parnetName.substring(3);
                                var n = 10-Number(g2)-1;

                                var display_name = (g1=='row') ? '행' : '열';
                                var dir  = (g1=='row') ? 'C' : 'R';
                                nO['name'] = g1 + n;
                                nO['display_name'] = display_name + n;
                                nO['dir']  = dir;
                            }
                            var key = coord.length >1 ? 'f' + coord : 'f0' + coord;
                            if(nO!=null) {
                                nO[key] = o.data;
                                nO[key+'-cell'] = o.position;
                                nO['size'] = Number(coord);
                                // if(g1!='') {
                                //     nO['dir'] = g1;
                                // }
                            }

                        }
                        
                    }
                    if(nO!=null) {
                        nO.type = 6;
                        gm.me().storeInspectFields2.add(nO);
                    }



                    var gridpanel = gu.getCmp('UploadGrid');
                    var gridview  = gridpanel.getView();
                    gridview.emptyText = '<div class="x-grid-empty">필드를 원하는 위치에 끌어다 놓으세요.</div>';
                    gridview.refresh();

                }
                gu.getCmp('panelDataUpload').setLoading(false);						
            },
            failure: extjsUtil.failureMessage
        });		
    },

    validateCheck : function (mode){
        if(mode='save') {
            return null;
        }
        var mappingFieldProp = gm.me().mappingFieldProp;
        console_logs('mappingFieldProp', mappingFieldProp);
        
        var arr = [];
        var hasValue = false;
        for (index in mappingFieldProp) {

            hasValue = true;
            //array 좌표
            if(index.charAt(0) == 'a') {
                //desc 자동생성
                //this.createCellPos(index);

                var val = '';
                try { val = gu.getCmp(index + '-val').getValue(); } catch(e) {}
                if(val!='') {
                    var start =gu.getCmp(index+ '-start').getValue();
                    val = val + '-' + start;
                    arr.push(val);
                }
                if(index.charAt(0) == 'a' && val!=null&& val!='') {
                    var desc = gu.getCmp(index+ '-desc').getValue();
                    if(desc!=null && desc!='') {
                        var a = gu.strComma2Array(desc);
                        arr = arr.concat(a);
                    }
                }

            //cell 조표
            } else {
                var val = '';
                try { val = gu.getCmp(index).getValue(); } catch(e) {}
                if(val!='') {
                    arr.push(val);
                }
            }

        }

        if(hasValue==false) {
            return [];
        }

        console_logs('arr', arr);
        var b = gu.checkDup1(arr);
        console_logs('arr b', b);
        if(b==false) {
            return null;
        } else {

            var sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
                                                // JS by default uses a crappy string compare.
                                                // (we use slice to clone the array so the
                                                // original array won't be modified)
            var results = [];
            for (var i = 0; i < sorted_arr.length - 1; i++) {
                if (sorted_arr[i + 1] == sorted_arr[i]) {
                    results.push(sorted_arr[i]);
                }
            }

            return results;
        }

     },

     TempTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'TEMP_TYPE'} ),

    ProductTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRODUCT_TYPE'} ),

});
