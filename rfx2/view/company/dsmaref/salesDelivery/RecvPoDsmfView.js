//수주관리 메뉴
Ext.define('Rfx2.view.company.dsmaref.salesDelivery.RecvPoDsmfView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-dsmf-view',
    initComponent: function () {

        this.setDefValue('regist_date', new Date());
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // this.setDefValue('pj_code', 'test');
        // 검색툴바 필드 초기화
        this.initSearchField();

        this.excelBarTop = true;

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'status'
                , store: "RecevedStateStore"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'pm_uid'
                , store: "UserDeptStore"
                , displayField: 'user_name'
                , valueField: 'unique_id'
                , value: vCUR_USER_UID
                , params: {dept_code: "D106"}
                , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
            });

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        var BuyerStore = Ext.create('Mplm.store.BuyerStore',{});
        searchToolbar.insert(9,{
            xtype: 'combo'
            ,anchor: '100%'
            ,width:175
            // ,field_id: 'wa_code'
            ,store: BuyerStore
            ,displayField: 'wa_name'
            ,valueField: 'wa_code'
            ,emptyText: '고객사'
            ,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
            ,minChars: 1
            // ,typeAhead:true
            ,queryMode: 'remote'
            ,fieldStyle: 'background-color: #FBF8E6'
            ,listeners: {
                select: function(combo, record) {
                    var selected = combo.getValue();
                    gm.me().store.getProxy().setExtraParam('wa_code', selected);
                    this.store.removeAll();
                    try {
                    this.store.reload();
                        
                    } catch (error) {
                        
                    }
                }
            }
        })

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.RecvPoDsmfPo', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            // Orderby list key change
            // ordery create_date -> p.create로 변경.
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
                    break;
                case 'DE':
                    return 'red-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
            }
        });

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        this.PmUserStore.getProxy().setExtraParam('user_type', 'SLM');
        // 수주검토
        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '수주등록',
            tooltip: '수주등록',
            // disabled: true,
            handler: function () {
                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
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
                            title: '공통정보',
                            width: '100%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column',
                                    // defaultMargins: {
                                    //     top: 0,
                                    //     right: 0,
                                    //     bottom: 0,
                                    //     left: 10
                                    // }
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    // margin: '0 10 10 1',
                                    border:true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            id:'pj_code',
                                            name:'pj_code',
                                            width:'35%',
                                            allowBlank:false,
                                            padding: '0 0 5px 0',
                                            fieldLabel:'수주번호',
                                        },{
                                            xtype:'button',
                                            text:'자동생성',
                                            width:'10%',
                                            listeners: {
                                                click: function(btn) {
                                                    var pj_code = Ext.getCmp('pj_code');

                                                    //자동생성 쿼리
                                                    //프로젝트 코드 자동생성 비슷하게 만들면됨. 테이블은 project Lot_no 컬럼 reserved_varchar6
                                                    var target = gMain.selPanel.getInputTarget('pj_code');
                                                    var date = new Date();
                                                    var fullYear = gUtil.getFullYear() + '';
                                                    var month = gUtil.getMonth() + '';
                                                    var day = date.getDate() + '';
                                                    if (month.length == 1) {
                                                        month = '0' + month;
                                                    }
                                                    if (day.length == 1) {
                                                        day = '0' + day;
                                                    }

                                                    var pj_first = fullYear.substring(2, 4) + month + day + '-';
                                                    console_logs('>>> pj_first', pj_first);
                                                    // 마지막 수주번호 가져오기
                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPjCode',
                                                        params:{
                                                            pj_first: pj_first,
                                                            codeLength: 3
                                                        },
                                                        success: function (result, request) {
            // //	                       						console_logs('마지막 수주번호 가져오기', 'success');
                                                            var result = result.responseText;
                                                            
                                                            if(result != null && result.length>0) {
                                                                switch(result.length) {
                                                                    case 1:
                                                                        result = '00' + result;
                                                                        break;
                                                                    case 2:
                                                                        result = '0' + result;
                                                                        break;
                                                                }
                                                            }
                                                            result = pj_first + result;
                                                            pj_code.setValue(result);
                                                        },// endofsuccess
                                                        failure: extjsUtil.failureMessage
                                                    });// endofajax
                                                }
                                            }
                                        },{
                                            xtype:'textfield',
                                            id:'pj_name',
                                            name:'pj_name',
                                            padding: '0 0 5px 30px',
                                            width:'45%',
                                            allowBlank:false,
                                            fieldLabel:'프로젝트명'
                                        },{
                                            id :'order_com_unique',
                                            name : 'order_com_unique',
                                            fieldLabel: '고객사',
                                            allowBlank:false,
                                            xtype: 'combo',
                                            width:'45%',
                                            padding: '0 0 5px 0',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: '선택해주세요.',
                                            displayField:   'wa_name',
                                            valueField:   'unique_id',
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig:{
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function() {
                                                    return '<div data-qtip="{unique_id}">{wa_name}</div>';
                                                }			                	
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },{
                                            id :'pm_uid',
                                            name : 'pm_uid',
                                            fieldLabel: '영업 담당자',                                            
                                            xtype: 'combo',
                                            // padding: '0 0 0 30px',
                                            padding: '0 0 5px 30px',
                                            width:'45%',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().PmUserStore,
                                            emptyText: '선택해주세요.',
                                            displayField:   'user_name',
                                            valueField:   'unique_id',
                                            sortInfo: { field: 'user_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig:{
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function() {
                                                    return '<div data-qtip="{unique_id}">{user_name}</div>';
                                                }			                	
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    
                                                }// endofselect
                                            }
                                        },{
                                            id :'pj_type',
                                            name : 'pj_type',
                                            fieldLabel: '등록원인',                                            
                                            xtype: 'combo',
                                            width:'45%',
                                            padding: '0 0 5px 0',
                                            allowBlank:false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().ProjectTypeStore,
                                            emptyText: '선택해주세요.',
                                            displayField:   'codeName',
                                            valueField:   'systemCode',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig:{
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function() {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }			                	
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    
                                                }// endofselect
                                            }
                                        }
                                        // ,{
                                        //     xtype:'numberfield',
                                        //     id:'selling_price',
                                        //     name:'selling_price',
                                        //     padding: '0 0 0 30px',
                                        //     width:'45%',
                                        //     fieldLabel:'수주금액'
                                        // }
                                        , {
                                            fieldLabel: '납품요청일',
                                            xtype: 'datefield',
                                            width:'45%',
                                            name: 'delivery_plan',
                                            id: 'delivery_plan',
                                            format: 'Y-m-d',
                                            // padding: '0 0 0 30px',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                            value:Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 14), 'Y-m-d')
                                        },{
                                            xtype:'textfield',
                                            id:'reserved_varchar3',
                                            name:'reserved_varchar3',
                                            padding: '0 0 5px 0',
                                            // padding: '0 0 0 30px',
                                            width:'45%',
                                            fieldLabel:'납품장소'
                                        }
                                        // ,{
                                        //     xtype:'textfield',
                                        //     id:'reserved_varchar4',
                                        //     name:'reserved_varchar4',
                                        //     width:'45%',
                                        //     fieldLabel:'납품방법'
                                        // }
                                        ,{
                                            xtype:'textfield',
                                            id:'reserved_varchark',
                                            name:'reserved_varchark',
                                            // padding: '0 0 0 30px',
                                            padding: '0 0 5px 30px',
                                            width:'45%',
                                            fieldLabel:'납품처정보'
                                        },{
                                            xtype:'textfield',
                                            id:'reserved_varchar2',
                                            name:'reserved_varchar2',
                                            padding: '0 0 5px 0',
                                            width:'45%',
                                            fieldLabel:'수요처'
                                        },{
                                            xtype:'textarea',
                                            id:'reserved_varcharc',
                                            name:'reserved_varcharc',
                                            padding: '0 0 10px 0',
                                            width:'94%',
                                            fieldLabel:'전달사항(1)'
                                        },{
                                            xtype:'textarea',
                                            id:'reserved_varcharf',
                                            name:'reserved_varcharf',
                                            padding: '0 0 10px 0',
                                            width:'94%',
                                            fieldLabel:'전달사항(2)'
                                        }
                                    ]
                                },
                                
                            ]
                        }
                        // , {
                        //     xtype: 'fieldset',
                        //     collapsible: false,
                        //     title: '추가정보',
                        //     width: '100%',
                        //     style: 'padding:10px',
                        //     defaults: {
                        //         labelStyle: 'padding:10px',
                        //         anchor: '100%',
                        //         layout: {
                        //             type: 'column',
                        //             // defaultMargins: {
                        //             //     top: 0,
                        //             //     right: 0,
                        //             //     bottom: 0,
                        //             //     left: 10
                        //             // }
                        //         }
                        //     },
                        //     items: [
                        //         {
                        //             xtype: 'container',
                        //             width: '100%',
                        //             // margin: '0 10 10 1',
                        //             border:true,
                        //              defaultMargins: {
                        //                 top: 0,
                        //                 right: 0,
                        //                 bottom: 0,
                        //                 left: 10
                        //             },
                        //             items:[
                        //                 {
                        //                     id :'reserved_varcharb',
                        //                     name : 'reserved_varcharb',
                        //                     fieldLabel: '전기사양',                                            
                        //                     xtype: 'combo',
                        //                     width:'45%',
                        //                     fieldStyle: 'background-image: none;',
                        //                     store: gm.me().electSpecCodeStore,
                        //                     emptyText: '선택해주세요.',
                        //                     displayField:   'codeName',
                        //                     valueField:   'systemCode',
                        //                     // sortInfo: { field: 'codeName', direction: 'ASC' },
                        //                     typeAhead: false,
                        //                     minChars: 1,
                        //                     listConfig:{
                        //                         loadingText: 'Searching...',
                        //                         emptyText: 'No matching posts found.',
                        //                         getInnerTpl: function() {
                        //                             return '<div data-qtip="{systemCode}">{codeName}</div>';
                        //                         }			                	
                        //                     },
                        //                     listeners: {
                        //                         select: function (combo, record) {
                                                    
                        //                         }// endofselect
                        //                     }
                        //                 },{
                        //                     id :'reserved_varchard',
                        //                     name : 'reserved_varchard',
                        //                     fieldLabel: '냉매',                                            
                        //                     xtype: 'combo',
                        //                     padding: '0 0 0 30px',
                        //                     width:'45%',
                        //                     fieldStyle: 'background-image: none;',
                        //                     store: gm.me().refriCodeStore,
                        //                     emptyText: '선택해주세요.',
                        //                     displayField:   'codeName',
                        //                     valueField:   'systemCode',
                        //                     // sortInfo: { field: 'codeName', direction: 'ASC' },
                        //                     typeAhead: false,
                        //                     minChars: 1,
                        //                     listConfig:{
                        //                         loadingText: 'Searching...',
                        //                         emptyText: 'No matching posts found.',
                        //                         getInnerTpl: function() {
                        //                             return '<div data-qtip="{systemCode}">{codeName}</div>';
                        //                         }			                	
                        //                     },
                        //                     listeners: {
                        //                         select: function (combo, record) {
                                                    
                        //                         }// endofselect
                        //                     }
                        //                 },{
                        //                     id :'reserved_varchare',
                        //                     name : 'reserved_varchare',
                        //                     fieldLabel: '오일',                                            
                        //                     xtype: 'combo',
                        //                     width:'45%',
                        //                     fieldStyle: 'background-image: none;',
                        //                     store: gm.me().oilCodeStore,
                        //                     emptyText: '선택해주세요.',
                        //                     displayField:   'codeName',
                        //                     valueField:   'systemCode',
                        //                     // sortInfo: { field: 'codeName', direction: 'ASC' },
                        //                     typeAhead: false,
                        //                     minChars: 1,
                        //                     listConfig:{
                        //                         loadingText: 'Searching...',
                        //                         emptyText: 'No matching posts found.',
                        //                         getInnerTpl: function() {
                        //                             return '<div data-qtip="{systemCode}">{codeName}</div>';
                        //                         }			                	
                        //                     },
                        //                     listeners: {
                        //                         select: function (combo, record) {
                                                    
                        //                         }// endofselect
                        //                     }
                        //                 },{

                        //                     id :'reserved_varcharg',
                        //                     name : 'reserved_varcharg',
                        //                     fieldLabel: '전자밸브',                                            
                        //                     xtype: 'combo',
                        //                     padding: '0 0 0 30px',
                        //                     width:'45%',
                        //                     fieldStyle: 'background-image: none;',
                        //                     store: gm.me().solenoidCodeStore,
                        //                     emptyText: '선택해주세요.',
                        //                     displayField:   'codeName',
                        //                     valueField:   'systemCode',
                        //                     // sortInfo: { field: 'codeName', direction: 'ASC' },
                        //                     typeAhead: false,
                        //                     minChars: 1,
                        //                     listConfig:{
                        //                         loadingText: 'Searching...',
                        //                         emptyText: 'No matching posts found.',
                        //                         getInnerTpl: function() {
                        //                             return '<div data-qtip="{systemCode}">{codeName}</div>';
                        //                         }			                	
                        //                     },
                        //                     listeners: {
                        //                         select: function (combo, record) {
                                                    
                        //                         }// endofselect
                        //                     }
                        //                 },{

                        //                     id :'reserved_varcharh',
                        //                     name : 'reserved_varcharh',
                        //                     fieldLabel: '배관방향',                                            
                        //                     xtype: 'combo',
                        //                     width:'45%',
                        //                     fieldStyle: 'background-image: none;',
                        //                     store: gm.me().pipeDirectionStore,
                        //                     emptyText: '선택해주세요.',
                        //                     displayField:   'codeName',
                        //                     valueField:   'systemCode',
                        //                     // sortInfo: { field: 'codeName', direction: 'ASC' },
                        //                     typeAhead: false,
                        //                     minChars: 1,
                        //                     listConfig:{
                        //                         loadingText: 'Searching...',
                        //                         emptyText: 'No matching posts found.',
                        //                         getInnerTpl: function() {
                        //                             return '<div data-qtip="{systemCode}">{codeName}</div>';
                        //                         }			                	
                        //                     },
                        //                     listeners: {
                        //                         select: function (combo, record) {
                                                    
                        //                         }// endofselect
                        //                     }
                        //                 }
                        //                 // ,{
                        //                 //     xtype:'textfield',
                        //                 //     id:'reserved_varcharc',
                        //                 //     name:'reserved_varcharc',
                        //                 //     padding: '0 0 0 30px',
                        //                 //     width:'45%',
                        //                 //     fieldLabel:'전달사항(1)'
                        //                 // },{
                        //                 //     xtype:'textfield',
                        //                 //     id:'reserved_varcharf',
                        //                 //     name:'reserved_varcharf',
                        //                 //     width:'45%',
                        //                 //     fieldLabel:'전달사항(2)'
                        //                 // }
                        //             ]
                        //         }
                        //     ]
                        // }
                    ]
                });

                var win = Ext.create('Ext.Window', {
					modal: true,
                    title: '수주등록',
                    width: 800,
                    height: 500,
                    plain: true,
					items: form,
					buttons: [{
						text: CMD_OK,
						handler: function(btn) {
							 if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();
                                if(form.isValid()) {
                                    var val = form.getValues(false);
                                    
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=addProjectOnly',
                                        params:{
                                            reserved_varcharf:val['reserved_varcharf'],
                                            pj_type:val['pj_type'],
                                            reserved_varchark:val['reserved_varchark'],
                                            pm_uid:val['pm_uid'],
                                            delivery_plan:val['delivery_plan'],
                                            pj_code:val['pj_code'],
                                            pj_name:val['pj_name'],
                                            order_com_unique:val['order_com_unique'],
                                            reserved_varchar3:val['reserved_varchar3'],
                                            reserved_varcharc:val['reserved_varcharc'],
                                            reserved_varchar2:val['reserved_varchar2']
                                        },
                                        success: function(val, action) {
                                            gm.me().store.load();
                                            win.close();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                    
                                } else {
                                    // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                    Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                }


								// if (form.isValid()) {
                                //     // var val = form.getValues(false);
                                //     // console_logs('>>>> val', val);
                                //     // return;
                                //     form.submit({
                                //         url: CONTEXT_PATH + '/production/schdule.do?method=addProjectOnly',
                                //         success: function(val, action) {
                                //             console_logs('>>>Zzz', gm.me().store);
                                //             gm.me().store.load();
                                //             win.close();
                                //         },
                                //         failure: function(val, action) {
                                //             win.close();
                                //         }
                                //     });
                                // } else {
                                //     Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                //     return;
                                // }
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
        });

        
        this.editPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수주수정',
            tooltip: '수주수정',
            // disabled: true,
            handler: function () {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            gm.me().combstStore.load();
            gm.me().PmUserStore.load();  
            gm.me().ProjectTypeStore.load();
            var form = Ext.create('Ext.form.Panel', {
                id: 'editPoForm',
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
                        title: '공통정보',
                        width: '100%',
                        style: 'padding:10px',
                        defaults: {
                            labelStyle: 'padding:10px',
                            anchor: '100%',
                            layout: {
                                type: 'column',
                                // defaultMargins: {
                                //     top: 0,
                                //     right: 0,
                                //     bottom: 0,
                                //     left: 10
                                // }
                            }
                        },
                        items: [
                            {
                                xtype: 'container',
                                width: '100%',
                                // margin: '0 10 10 1',
                                border:true,
                                defaultMargins: {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 10
                                },
                                items:[
                                    {
                                        xtype:'textfield',
                                        id:'pj_code',
                                        name:'pj_code',
                                        width:'35%',
                                        allowBlank:false,
                                        padding: '0 0 5px 0',
                                        fieldLabel:'수주번호',
                                        readOnly:true,
                                        value:select.get('pj_code')
                                    },{
                                        xtype:'button',
                                        text:'자동생성',
                                        width:'10%',
                                        disabled:true,
                                        listeners: {
                                            click: function(btn) {
                                                var pj_code = Ext.getCmp('pj_code');

                                                //자동생성 쿼리
                                                //프로젝트 코드 자동생성 비슷하게 만들면됨. 테이블은 project Lot_no 컬럼 reserved_varchar6
                                                var target = gMain.selPanel.getInputTarget('pj_code');
                                                var date = new Date();
                                                var fullYear = gUtil.getFullYear() + '';
                                                var month = gUtil.getMonth() + '';
                                                var day = date.getDate() + '';
                                                if (month.length == 1) {
                                                    month = '0' + month;
                                                }
                                                if (day.length == 1) {
                                                    day = '0' + day;
                                                }

                                                var pj_first = fullYear.substring(2, 4) + month + day + '-';
                                                console_logs('>>> pj_first', pj_first);
                                                // 마지막 수주번호 가져오기
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPjCode',
                                                    params:{
                                                        pj_first: pj_first,
                                                        codeLength: 3
                                                    },
                                                    success: function (result, request) {
        // //	                       						console_logs('마지막 수주번호 가져오기', 'success');
                                                        var result = result.responseText;
                                                        
                                                        if(result != null && result.length>0) {
                                                            switch(result.length) {
                                                                case 1:
                                                                    result = '00' + result;
                                                                    break;
                                                                case 2:
                                                                    result = '0' + result;
                                                                    break;
                                                            }
                                                        }
                                                        result = pj_first + result;
                                                        pj_code.setValue(result);
                                                    },// endofsuccess
                                                    failure: extjsUtil.failureMessage
                                                });// endofajax
                                            }
                                        }
                                    },{
                                        xtype:'textfield',
                                        id:'pj_name',
                                        name:'pj_name',
                                        padding: '0 0 5px 30px',
                                        width:'45%',
                                        allowBlank:false,
                                        fieldLabel:'프로젝트명',
                                        value:select.get('pj_name')
                                    },{
                                        id :'order_com_unique',
                                        name : 'order_com_unique',
                                        fieldLabel: '고객사',
                                        allowBlank:false,
                                        xtype: 'combo',
                                        width:'45%',
                                        padding: '0 0 5px 0',
                                        fieldStyle: 'background-image: none;',
                                        store: gm.me().combstStore,
                                        emptyText: '선택해주세요.',
                                        displayField:   'wa_name',
                                        valueField:   'unique_id',
                                        sortInfo: { field: 'wa_name', direction: 'ASC' },
                                        typeAhead: false,
                                        minChars: 1,
                                        listConfig:{
                                            loadingText: 'Searching...',
                                            emptyText: 'No matching posts found.',
                                            getInnerTpl: function() {
                                                return '<div data-qtip="{unique_id}">{wa_name}</div>';
                                            }			                	
                                        },
                                        listeners: {
                                            select: function (combo, record) {
                                                
                                            }// endofselect
                                        },
                                        value:select.get('order_com_unique') == null || select.get('order_com_unique') < 1 ? null : select.get('order_com_unique')
                                    },{
                                        id :'pm_uid',
                                        name : 'pm_uid',
                                        fieldLabel: '영업 담당자',                                            
                                        xtype: 'combo',
                                        // padding: '0 0 0 30px',
                                        padding: '0 0 5px 30px',
                                        width:'45%',
                                        fieldStyle: 'background-image: none;',
                                        store: gm.me().PmUserStore,
                                        emptyText: '선택해주세요.',
                                        displayField:   'user_name',
                                        valueField:   'unique_id',
                                        sortInfo: { field: 'user_name', direction: 'ASC' },
                                        typeAhead: false,
                                        minChars: 1,
                                        listConfig:{
                                            loadingText: 'Searching...',
                                            emptyText: 'No matching posts found.',
                                            getInnerTpl: function() {
                                                return '<div data-qtip="{unique_id}">{user_name}</div>';
                                            }			                	
                                        },
                                        listeners: {
                                            select: function (combo, record) {
                                                
                                            }// endofselect
                                        },
                                        value:select.get('pm_name')
                                    },{
                                        id :'pj_type',
                                        name : 'pj_type',
                                        fieldLabel: '등록원인',                                            
                                        xtype: 'combo',
                                        width:'45%',
                                        padding: '0 0 5px 0',
                                        allowBlank:false,
                                        fieldStyle: 'background-image: none;',
                                        store: gm.me().ProjectTypeStore,
                                        emptyText: '선택해주세요.',
                                        displayField:   'codeName',
                                        valueField:   'systemCode',
                                        // sortInfo: { field: 'codeName', direction: 'ASC' },
                                        typeAhead: false,
                                        minChars: 1,
                                        listConfig:{
                                            loadingText: 'Searching...',
                                            emptyText: 'No matching posts found.',
                                            getInnerTpl: function() {
                                                return '<div data-qtip="{systemCode}">{codeName}</div>';
                                            }			                	
                                        },
                                        listeners: {
                                            select: function (combo, record) {
                                                
                                            }// endofselect
                                        },
                                        value:select.get('pj_type')
                                    }
                                    // ,{
                                    //     xtype:'numberfield',
                                    //     id:'selling_price',
                                    //     name:'selling_price',
                                    //     padding: '0 0 0 30px',
                                    //     width:'45%',
                                    //     fieldLabel:'수주금액'
                                    // }
                                    , {
                                        fieldLabel: '납품요청일',
                                        xtype: 'datefield',
                                        width:'45%',
                                        name: 'delivery_plan',
                                        id: 'delivery_plan',
                                        format: 'Y-m-d',
                                        // padding: '0 0 0 30px',
                                        padding: '0 0 5px 30px',
                                        fieldStyle: 'background-image: none;',
                                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                        value:new Date(select.get('delivery_plan'))
                                    },{
                                        xtype:'textfield',
                                        id:'reserved_varchar3',
                                        name:'reserved_varchar3',
                                        padding: '0 0 5px 0',
                                        // padding: '0 0 0 30px',
                                        width:'45%',
                                        fieldLabel:'납품장소',
                                        value:select.get('reserved_varchar3')
                                    }
                                    // ,{
                                    //     xtype:'textfield',
                                    //     id:'reserved_varchar4',
                                    //     name:'reserved_varchar4',
                                    //     width:'45%',
                                    //     fieldLabel:'납품방법'
                                    // }
                                    ,{
                                        xtype:'textfield',
                                        id:'reserved_varchark',
                                        name:'reserved_varchark',
                                        // padding: '0 0 0 30px',
                                        padding: '0 0 5px 30px',
                                        width:'45%',
                                        fieldLabel:'납품처정보',
                                        value:select.get('reserved_varchark')
                                    },{
                                        xtype:'textfield',
                                        id:'reserved_varchar2',
                                        name:'reserved_varchar2',
                                        padding: '0 0 5px 0',
                                        width:'45%',
                                        fieldLabel:'수요처',
                                        value:select.get('reserved_varchar2')
                                    },{
                                        xtype:'textarea',
                                        id:'reserved_varcharc',
                                        name:'reserved_varcharc',
                                        padding: '0 0 10px 0',
                                        width:'94%',
                                        fieldLabel:'전달사항(1)',
                                        value:select.get('reserved_varcharc')
                                    },{
                                        xtype:'textarea',
                                        id:'reserved_varcharf',
                                        name:'reserved_varcharf',
                                        padding: '0 0 10px 0',
                                        width:'94%',
                                        fieldLabel:'전달사항(2)',
                                        value:select.get('reserved_varcharf')
                                    }
                                ]
                            },
                            
                        ]
                    }
                ]
            });

            var win = Ext.create('Ext.Window', {
                modal: true,
                title: '수주수정',
                width: 800,
                height: 500,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function(btn) {
                         if (btn == "no") {
                            win.close();
                        } else {
                            var form = Ext.getCmp('editPoForm').getForm();
                            if(form.isValid()) {
                                var val = form.getValues(false);
                                
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=addProjectOnly',
                                    params:{
                                        unique_id:select.get('unique_id'),
                                        reserved_varcharf:val['reserved_varcharf'],
                                        pj_type:val['pj_type'],
                                        reserved_varchark:val['reserved_varchark'],
                                        pm_uid:val['pm_uid'],
                                        delivery_plan:val['delivery_plan'],
                                        pj_code:val['pj_code'],
                                        pj_name:val['pj_name'],
                                        order_com_unique:val['order_com_unique'],
                                        reserved_varchar3:val['reserved_varchar3'],
                                        reserved_varcharc:val['reserved_varcharc'],
                                        reserved_varchar2:val['reserved_varchar2']
                                    },
                                    success: function(val, action) {
                                        gm.me().store.load();
                                        win.close();
                                    },
                                    failure: extjsUtil.failureMessage
                                });
                                
                            } else {
                                Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }


                            // if (form.isValid()) {
                            //     // var val = form.getValues(false);
                            //     // console_logs('>>>> val', val);
                            //     // return;
                            //     form.submit({
                            //         url: CONTEXT_PATH + '/production/schdule.do?method=addProjectOnly',
                            //         success: function(val, action) {
                            //             console_logs('>>>Zzz', gm.me().store);
                            //             gm.me().store.load();
                            //             win.close();
                            //         },
                            //         failure: function(val, action) {
                            //             win.close();
                            //         }
                            //     });
                            // } else {
                            //     Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                            //     return;
                            // }
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
    });

        // 수주검토
        this.reviewAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '수주검토',
            tooltip: '수주검토',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '수주 검토를 완료하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gMain.selPanel.reviewAction.disable();
                            gMain.selPanel.doRequest('P0');
                        }
                    },
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 반려
        this.reviewCancleAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '검토취소',
            tooltip: '검토취소',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '수주를 검토 취소하시겠습니까?<br>확인 후 반려상태로 수주가 진행됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gMain.selPanel.reviewCancleAction.disable();
                            gMain.selPanel.doRequest('DE');
                        }
                    },
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 수주확정
        this.completeAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
            tooltip: '수주확정 및 설계요청',
            disabled: true,
            handler: function () {
                // gMain.selPanel.doRequestProduce();
                var recs = gm.me().prdGrid.getStore().data.items;
                console_logs('>>recs', recs);
                for(var i=0; i<recs.length;i++) {
                    var rec = recs[i];
                    var child_cnt = rec.get('child_cnt');
                    if(child_cnt < 1) {
                        Ext.Msg.alert('알림',  '제품의 BOM을 확인해주세요.');
                        return;
                    }
                }
                Ext.MessageBox.show({
                    title:'수주확정',
                    msg: '해당 수주를 확정하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().confirmPjGoDesign,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            itemId: 'fileattachAction',
            disabled: false,
            text:'첨부',
            handler: function(widget, event) {
                gm.me().attachFile();
            }
        });

        // 버튼 추가.
        buttonToolbar.insert(4, this.addPoAction);
        buttonToolbar.insert(5, this.editPoAction);
        buttonToolbar.insert(6, this.completeAction);
        buttonToolbar.insert(7, this.getPrdAdd());
        // buttonToolbar.insert(7, this.reviewAction);
        // buttonToolbar.insert(7, this.reviewAction);
        buttonToolbar.insert(8, '-');
        buttonToolbar.insert(15, '->');
        buttonToolbar.insert(16, this.fileattachAction);
        

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();
            }

            gUtil.disable(gMain.selPanel.removeAction);
            gUtil.disable(gMain.selPanel.modifyAction);

            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                var status = rec.get('status');

                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');

                this.prdStore.getProxy().setExtraParam('assytop_uid', rec.get('unique_uid'));
                this.prdStore.getProxy().setExtraParam('child_cnt', true);
                this.prdStore.load();

                switch (status) {
                    case 'BM':
                        gUtil.enable(gMain.selPanel.completeAction);
                        gUtil.enable(gMain.selPanel.editPoAction);
                        gUtil.enable(gMain.selPanel.removeAction);
                        gUtil.disable(gMain.selPanel.modifyAction);
                    // case 'DE':
                    //     gUtil.enable(gMain.selPanel.reviewAction);
                    //     break;
                    // case 'P0':
                        // gUtil.enable(gMain.selPanel.completeAction);
                        // gUtil.enable(gMain.selPanel.reviewCancleAction);
                        break;
                }
            } else {
                // gUtil.disable(gMain.selPanel.reviewAction);
                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.editPoAction);
                // gUtil.disable(gMain.selPanel.reviewCancleAction);
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
			items: [
				{
					// title: '수주목록',
					collapsible: false,
					frame: true,
					region: 'center',
                    height: '60%',
                    layout:'fit',
					items: [this.grid]
				}, 
				{
                    // title: '제품목록',
                    id:'pjPrdList',
					collapsible: false,
					frame: true,
					region: 'south',
					layout: 'fit',
					height: '40%',
					items: [this.createCenter()]  
				}
			]
        });

        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });

        this.callParent(arguments);


        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC,BR');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);

        this.store.load(function (records) {
        });


    },

    getPrdAdd: function() {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            text:'제품추가',
            handler: function(widget, event) {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                if(select == null || select == undefined || select.length<1) {
                    Ext.Msg.alert('안내',  '프로젝트를 선택해주세요.');
                    return;
                }
                var pj_uid = select.get('unique_id');
                var top_assy = select.get('unique_uid');

                    var partGridWidth = '20%';
                    var searchItemGrid = Ext.create('Ext.grid.Panel', {
                        store: gm.me().searchDetailStore,
                        layout: 'fit',
                        title:'제품검색',
                        plugins:[gm.me().cellEditing],
                        columns: [
                            {text: "품번", flex: 1, dataIndex: 'item_code', sortable: true},
                            {text: "품명", flex: 1, dataIndex: 'item_name', sortable: true},
                            {text: "규격", flex: 2, dataIndex: 'specification', sortable: true},
                            {text: "수량", flex: 1, dataIndex: 'bm_quan', sortable: true, editor:{},
                                css: 'edit-cell',
                                renderer: function(value, meta) {
                                    meta.css = 'custom-column';
                                    if(value == null || value.length < 1) {
                                        value = 1;
                                    }
                                    return value;
                                }}
                        ],
                        multiSelect: true,
                        pageSize: 100,
                        width:800,
                        height:600,
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: gm.me().searchDetailStore,
                            displayInfo: true,
                            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                            emptyMsg: "표시할 항목이 없습니다."
                            ,listeners: {
                                beforechange: function (page, currentPage) {

                                }
                            }

                        }),
                        viewConfig: {
                            listeners: {
                                'itemdblClick': function(view , record) {
                                    record.commit();
                                    console_logs('>>> ddd', saveStore);
                                    saveStore.add(record);
                                }
                            },
                            emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
                            // emptyText: 'No data...'
                        },
                        dockedItems: [
                            {
                            dock: 'top',
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default1',
                            items: [
                                {
                                    width: partGridWidth,
                                    field_id:  'search_item_code',
                                    id: gu.id('search_item_code'),
                                    name: 'search_item_code',
                                    xtype: 'triggerfield',
                                    emptyText: '품목코드',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click : function() {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners : {
                                        change : function(fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                                gm.me().redrawSearchStore();
                                                //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function(c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id:  'search_item_name',
                                    id: gu.id('search_item_name'),
                                    name: 'search_item_name',
                                    xtype: 'triggerfield',
                                    emptyText: '품명',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click : function() {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners : {
                                        change : function(fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                                gm.me().redrawSearchStore();
                                                //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function(c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id:  'search_specification',
                                    id: gu.id('search_specification'),
                                    name: 'search_specification',
                                    xtype: 'triggerfield',
                                    emptyText: '규격',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click : function() {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners : {
                                        change : function(fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                                gm.me().redrawSearchStore();
                                                //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function(c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    width: partGridWidth,
                                    field_id:  'search_model_no',
                                    id: gu.id('search_model_no'),
                                    name: 'search_model_no',
                                    xtype: 'triggerfield',
                                    emptyText: '재질',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click : function() {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners : {
                                        change : function(fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                                gm.me().redrawSearchStore();
                                                //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function(c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                }
                                // ,{
                                //     width: partGridWidth,
                                //     field_id:  'search_supplier_name',
                                //     id: gu.id('search_supplier_name'),
                                //     name: 'search_supplier_name',
                                //     xtype: 'triggerfield',
                                //     emptyText: '공급사',
                                //     hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                //     trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                //     onTrigger1Click : function() {
                                //         this.setValue('');
                                //         gm.me().redrawSearchStore();
                                //     },
                                //     listeners : {
                                //         change : function(fieldObj, e) {
                                //             //if (e.getKey() == Ext.EventObject.ENTER) {
                                //                 gm.me().redrawSearchStore();
                                //                 //srchSingleHandler (store, srchId, fieldObj, isWild);
                                //             //}
                                //         },
                                //         render: function(c) {
                                //             Ext.create('Ext.tip.ToolTip', {
                                //                 target: c.getEl(),
                                //                 html: c.emptyText
                                //             });
                                //         }
                                //     }
                                // }
                            ]
                        }] // endofdockeditems
                    }); // endof Ext.create('Ext.grid.Panel',

                    searchItemGrid.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
                            console_logs('selections', selections);
                            // if(selections!=null && selections.length>0 && selections[0]!=null) {
                            //     gm.me().setBomData(selections[0].getId());
                            // }

                        }
                    });

                    searchItemGrid.on('edit', function(editor, e) {
                        var rec = e.record;
                        var field = e['field'];
                        
                        rec.set(field, rec.get(field));

                    });

                var saveStore = null;

                var saveStore =  new Ext.data.Store({
                    model : gm.me().searchDetailStore
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id:'saveFormGrid',
                    layout: 'fit',
                    title:'저장목록',
                    region:'east',
                    style:'padding-left:10px;',
                    plugins:[gm.me().cellEditing_save],
                    columns: [
                        {text: "품번", flex: 1, dataIndex: 'item_code', sortable: true},
                        {text: "품명", flex: 1, dataIndex: 'item_name', sortable: true},
                        {text: "규격", flex: 2, dataIndex: 'specification', sortable: true},
                        {text: "수량", flex: 1, dataIndex: 'bm_quan', sortable: true, editor:{},
                            css: 'edit-cell',
                            renderer: function(value, meta) {
                                meta.css = 'custom-column';
                                if(value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }}
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width:400,
                    height:600,
                    // bbar: Ext.create('Ext.PagingToolbar', {
                    //     // store: gm.me().searchDetailStore,
                    //     displayInfo: true,
                    //     displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                    //     emptyMsg: "표시할 항목이 없습니다."
                    //     ,listeners: {
                    //         beforechange: function (page, currentPage) {

                    //         }
                    //     }

                    // }),
                    dockedItems: [
                        {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default1',
                        items: [
                            
                        ]
                    }] // endofdockeditems
                }); // endof Ext.create('Ext.grid.Panel',

                saveForm.on('edit', function(editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    
                    rec.set(field, rec.get(field));

                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '제품추가',
                    width: 1200,
		            height: 600,
		            minWidth: 600,
		            minHeight: 300,
					items: [
                        searchItemGrid,saveForm
                    ],
					buttons: [{
                        text:'추가',
                        handler: function(btn) {
                            var selects = searchItemGrid.getSelectionModel().getSelection();
                            for(var i=0; i<selects.length; i++) {
                                var record = selects[i];
                                saveStore.add(record);
                            }
                        }
                    },{
						text: CMD_OK,
						handler: function(btn) {
							 if (btn == "no") {
                                winProduct.close();
                            } else {
                                var items = saveStore.data.items;
                                var json = '';
                                for(var i=0; i<items.length; i++) {
                                    var item = items[i];
                                    var id = item.get('unique_id_long'); // srcahd uid
                                    var quan = item.get('bm_quan');
                                    if(quan == null || quan == undefined || quan.length<1) quan = 1;

                                    if(json.length) {
                                        json += ",{\"id\":" + id + ",\"bm_quan\":" + quan + "}";
                                    } else {
                                        json += "{\"id\":" + id + ",\"bm_quan\":" + quan + "}";
                                    }
                                }

                                json = '[' + json + ']';

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=addOnlyPjProduct',
                                    params:{
                                        jsonDatas:json,
                                        pj_uid:pj_uid,
                                        top_assy:top_assy
                                    },
                                    success : function(result, request) {
                                        // gm.me().store.load();
                                        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                        gm.me().prdStore.getProxy().setExtraParam('assytop_uid', rec.get('unique_uid'));
                                        gm.me().prdStore.load();
                                        if(winProduct) winProduct.close();
                                        
                                    },
                                    failure: extjsUtil.failureMessage
                                });
                                
                            }
                        }
                    },{
						text: CMD_CANCEL,
                        handler: function(btn) {
                            winProduct.close();
                        }
					}]
                });winProduct.show();
            }
        });

        return action;
    },

    getAttachAdd: function() {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addAttachAction',
            disabled: false,
            text:'첨부',
            handler: function(widget, event) {
                
            }
        });

        return action;
    },

    getRequestMake: function() {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'requestMakeAction',
            disabled: false,
            text:'제작요청',
            handler: function(widget, event) {
                
            }
        });

        return action;
    },

    removePrdAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: '삭제',
        disabled: true,
        handler: function () {
            Ext.MessageBox.show({
                title:'삭제',
                msg: '선택하신 항목들을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: function(btn) {
                    if(btn=='yes') {
                        var selects = gm.me().prdGrid.getSelectionModel().getSelection();
                        console_logs('>>>>>>>>>>removeFn selects : ', selects);
                        var uids = [];
                        var ac_uid = gm.me().prdGrid.getSelectionModel().getSelection()[0].get('ac_uid');
                        for(var i=0; i<selects.length; i++) {
                            var select = selects[i];
                            var id = select.get('unique_uid');
                            console_logs('>>>>>>>>>>removeFn id : ', id);
                            uids.push(id);
                        };
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/production/schdule.do?method=removePrds',
                            params:{
                                unique_ids:uids,
                                pj_uid:ac_uid
                            },
                            success: function(){
                                gm.me().showToast('결과', uids.length + ' 건 삭제완료.' );
                                gm.me().store.load();
                                gm.me().prdStore.load();
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
    }),

    createCenter: function() {
        // console_logs('>>> gm.me().prdStore', gm.me().prdStore);
        console_logs('>>> gm.me().prdStore 22', this.prdStore);
        var requestMakeAction = this.getRequestMake();
        var addAttachAction = this.getAttachAdd();

        this.prdGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: true,
            store: this.prdStore,
            // bbar: getPageToolbar(this.prdStore),
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            plugins:[this.cellEditing_prd],
            viewConfig: {
                getRowClass : function(record, index) {
                    var child_cnt = record.get('child_cnt');
                    if(child_cnt < 1) {
                        return 'red-row';
                    }
                }
            },
            dockedItems: [{
                
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                       this.removePrdAction, '->',addAttachAction
                        // this.printFinalPDFAction
                    ],
                
            }],
            columns: [
                {
                    text: '진행상태',
                    dataIndex: 'status',
                    width: 50,
                    align:'center',
                    sortable: true,
                    renderer: function(value) {
                        switch(value) {
                            case 'BM':
                                return '수주등록';
                            case 'R':
                                return '생산대기';
                            case 'I':
                                return '작업정지';
                            case 'W':
                                return '생산중';
                            case 'Y':
                                return '생산완료';
                            case 'DE':
                                return '반려';
                            case 'CR':
                                return '수주확정(설계)';
                            default:
                            return value;
                        }
                    }
                },{   
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 100,
                    sortable: true,
                    align:'center',
                    // style:'text-align:left'
                },{   
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 100,
                    sortable: true,
                    align:'center',
                    // style:'text-align:left'
                },{   
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    sortable: true,
                    align:'center',
                    // style:'text-align:left'
                },{   
                    text: '납품단가',
                    dataIndex: 'sales_price',
                    width: 80,
                    sortable: true,
                    align:'center',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value!=null&&value.length>0) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return  value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '수주수량',
                    dataIndex: 'quan',
                    width: 60,
                    sortable: true,
                    align:'center',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value!=null&&value.length>0) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return  value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '가용재고',
                    dataIndex: 'stock_qty_useful',
                    width: 60,
                    sortable: true,
                    align:'center',
                    renderer: function(value, meta) {
                        if(value!=null&&value.length>0) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return  value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '생산요청량',
                    dataIndex: 'bm_quan',
                    width: 65,
                    sortable: true,
                    align:'center',
                    editor:{},
                    css: 'edit-cell',
                    
                    // style:'text-align:left'
                },{   
                    text: '전기사양',
                    dataIndex: 'reserved1',
                    width: 60,
                    sortable: true,
                    align:'center',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '냉매',
                    dataIndex: 'reserved2',
                    width: 60,
                    sortable: true,
                    align:'center',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '오일',
                    dataIndex: 'reserved3',
                    width: 60,
                    sortable: true,
                    align:'center',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '전자밸브',
                    dataIndex: 'reserved4',
                    width: 60,
                    sortable: true,
                    align:'center',
                    editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '배관방향',
                    dataIndex: 'reserved5',
                    width: 60,
                    sortable: true,
                    align:'center',
                    editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '특이사항',
                    dataIndex: 'reserved6',
                    // dataIndex: 'comment',
                    width: 100,
                    sortable: true,
                    align:'center',
                    editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                }
            ]     
        });

        this.prdGrid.addListener('itemdblClick', this.setPrdBom);

        this.prdGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    gUtil.enable(gMain.selPanel.removePrdAction);
                } else {
                    gUtil.disable(gMain.selPanel.removePrdAction);
                }
            }
        });

        this.prdGrid.on('edit', function(editor, e) {
            var rec = e.record;

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapMakeInfo',
                params: {
                    quan:rec.get('quan'),
                    reserved1:rec.get('reserved1'),
                    reserved2:rec.get('reserved2'),
                    reserved3:rec.get('reserved3'),
                    reserved4:rec.get('reserved4'),
                    reserved5:rec.get('reserved5'),
                    reserved6:rec.get('reserved6'),
                    unique_id:rec.get('unique_uid'),
                    sales_price:rec.get('sales_price'),
                    pj_uid:rec.get('ac_uid')
                },
                success: function(result, request) {
                    var result = result.responseText;
                    gm.me().prdStore.load();
                    gm.me().store.load();
                },
                failure: extjsUtil.failureMessage
            });
        })
        
        return this.prdGrid;
    },

    setPrdBom: function() {
        var selections = gm.me().prdGrid.getSelectionModel().getSelection();
        console_logs('====selections', selections);
        if(selections) {
            var uidSrcahd = selections[0].get('unique_id_long');
            var parent_uid = selections[0].get('unique_uid');

            return gm.me().renderPrdBom(uidSrcahd);
        }
    },

    renderPrdBom: function(uidSrcahd) {
        Ext.Ajax.request({
           url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
           params:{
               paramName : 'CommonProjectAssy',
               paramValue : uidSrcahd + ';' + '-1'
           },

           success : function(result, request) {
               console_log('success defaultSet');
               // var url = CONTEXT_PATH + '/index/main.do?&pj_uid=' + pj_uid
               //   + '#design^DBM7';

               // location.href=url;
           },
           failure: function(result, request){
               console_log('fail defaultSet');
           }
       });

       var url = CONTEXT_PATH + '/index/main.do?&uid_srcahd=' + uidSrcahd 
                + '#design-plan:DBM7_AST';
                
       location.href=url;
       
   },

    //assymap STATUS 변경
    doRequest: function (status) {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapStatus',
            params: {
                assymap_uid: gm.me().vSELECTED_ASSYMAP_UID,
                status: status
            },

            success: function (result, request) {
                gMain.selPanel.store.load();
                //Ext.Msg.alert('안내', '요청하였습니다.', function() {});
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax

    },
    //수주확정 LOT_NO/CARTMAP 생성
    doRequestProduce: function () {

        var form = null;
        //var checkname = false;
        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
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
                //labelWidth: 60,
                //margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 50,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Lot 명',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'lot_no',
                                    name: 'po_no',
                                    fieldLabel: 'LOT 명',
                                    margin: '0 5 0 0',
                                    width: 300,
                                    allowBlank: false,
//	                                   value : gMain.selPanel.lotname,
                                    maxlength: '1',
                                    listeners: {
                                        change: function(sender, newValue, oldValue, opts) {
                                            gm.me().checkButtonClicked = false;
                                        }
                                    }
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                	  /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
//	                                		   console_logs('입력 제한 >>>>', v);
//	                                		   v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
//	                                	   }*/
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }
                                },
                                {
                                    id: 'AutoLotCreateButton',
                                    xtype: 'button',
                                    style: 'margin-left: 3px;',
                                    text: '자동생성',
                                    handler: function () {

                                        var lot_no = Ext.getCmp('lot_no');

                                        //자동생성 쿼리
                                        //프로젝트 코드 자동생성 비슷하게 만들면됨. 테이블은 project Lot_no 컬럼 reserved_varchar6
                                        var target = gMain.selPanel.getInputTarget('pj_code');
                                        var date = new Date();
                                        var fullYear = gUtil.getFullYear() + '';
                                        var month = gUtil.getMonth() + '';
                                        var day = date.getDate() + '';
                                        if (month.length == 1) {
                                            month = '0' + month;
                                        }

                                        var pj_code = fullYear.substring(2, 4) + month + '-';

                                        // 마지막 수주번호 가져오기
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastlotnoMes',
                                            params: {
                                                pj_first: pj_code,
                                                codeLength: 3
                                            },
                                            success: function (result, request) {
//	                       						console_logs('마지막 수주번호 가져오기', 'success');
                                                var result = result.responseText;
//	                       						result = result.substring(0,6)+'-'+result.substring(6,9);
                                                lot_no.setValue(result);
                                                gm.me().checkButtonClicked = false;
                                            },// endofsuccess
                                            failure: extjsUtil.failureMessage
                                        });// endofajax
                                    }//endofhandler
                                },
                                {
                                    id: 'isDuplicatedButton',
                                    xtype: 'button',
                                    style: 'margin-left: 3px;',
                                    text: '중복확인',
                                    handler: function () {
                                        var lot_no = Ext.getCmp('lot_no').getValue();

                                        if(lot_no.length === 1) {
                                            Ext.Msg.alert('', 'LOT 번호를 입력하시기 바랍니다.');
                                        } else {
                                            var projectStore = Ext.create('Rfx2.store.company.kbtech.ProjectStore', {});
                                            projectStore.getProxy().setExtraParam('reserved_varchar6', lot_no);

                                            projectStore.load(function(record) {

                                                gm.me().checkButtonClicked = true;

                                                if(record.length > 0) {
                                                    Ext.Msg.alert('', 'LOT 번호가 중복 되었습니다.');
                                                    gm.me().isDuplicated = true;
                                                } else {
                                                    Ext.Msg.alert('', '이용 가능한 LOT 번호입니다.');
                                                    gm.me().isDuplicated = false;
                                                }
                                            });
                                        }

                                    }//endofhandler
                                }
                            ]
                        },


                    ]
                }
            ]

        });//Panel end...
        myHeight = 120;
        myWidth = 390;


        prwin = gMain.selPanel.prwinrequest(form);


    },

    prwinrequest: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'LOT 명',
            width: myWidth,
            //height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if(!gm.me().checkButtonClicked) {
                        Ext.Msg.alert('', '먼저 LOT 번호 중복 검사를 하시기 바랍니다.');
                    } else {
                        if(gm.me().isDuplicated) {
                            Ext.Msg.alert('', 'LOT 번호가 중복 되었습니다.');
                        } else {
                            Ext.MessageBox.show({
                                title: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
                                msg: 'LOT번호 : ' + Ext.getCmp('lot_no').getValue() + '의 <br> ' +
                                '수주를 확정하겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        var form = gu.getCmp('formPanel').getForm();
                                        var assymap_uid = gMain.selPanel.vSELECTED_ASSYMAP_UID;
                                        var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                                        prWin.setLoading(true);

                                        form.submit({
                                            url: CONTEXT_PATH + '/index/process.do?method=addCartCopyPart',
                                            params: {
                                                ac_uid: ac_uid,
                                                assymap_uid: assymap_uid,
                                                lot_no: Ext.getCmp('lot_no').getValue()
                                            },
                                            success: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                                gMain.selPanel.store.load(function () {
                                                });
                                            },
                                            failure: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                            }
                                        });
                                    } else {
                                        prWin.close();
                                    }
                                },
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    }

                }//btn handler
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
    clearSearchStore : function() {
        var store = gm.me().searchDetailStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 100);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },
    redrawSearchStore : function() {

        this.clearSearchStore();

        var item_code = null;
        var item_name = null;
        var specification = null;
        var model_no = null;

        var store = gm.me().searchDetailStore;
        if(vCompanyReserved4 ==  'SKNH01KR') {
            item_code = gu.getValue('search_item_code_sk');
            item_name = gu.getValue('search_item_name_sk');
            specification = gu.getValue('search_specification_sk');
            model_no = gu.getValue('search_model_no_sk');
        }else{
            item_code = gu.getValue('search_item_code');
            item_name = gu.getValue('search_item_name');
            specification = gu.getValue('search_specification');
            model_no = gu.getValue('search_model_no');
        }

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
        if(item_code.length>0) {
            store.getProxy().setExtraParam('item_code', item_code);
            bIn = true;
        }

        if(item_name.length>0) {
            store.getProxy().setExtraParam('item_name', item_name);
            bIn = true;
        }

        if(specification.length>0) {
            store.getProxy().setExtraParam('specification', specification);
            bIn = true;
        }

        if(model_no.length>0) {
            store.getProxy().setExtraParam('model_no', model_no);
            bIn = true;
        }

        if(supplier_name.length>0) {
            store.getProxy().setExtraParam('supplier_name', supplier_name);
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 250);

        if(bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }



    },

    confirmPjGoDesign: function(result) {
        if(result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            if(select == null || select == undefined || select.length<1) {
                Ext.MessageBox.alert('알림', '수주를 지정해주세요.');
                return null;
            }
            var id = select.get('unique_id');
            var assy_uid = select.get('unique_uid');
            var pj_type = select.get('pj_type');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/schdule.do?method=comfirmPjRequestDesign',
                params: {
                    unique_id:id,
                    assy_uid:assy_uid,
                    pj_type:pj_type
                },
                success: function(result, request) {
                    gm.me().store.load();
                    gm.me().prdStore.removeAll();
                }, 
                failure: extjsUtil.failureMessage
            });
        }
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

    cellEditing: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing_save: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing_prd: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchStore', {

    }),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    
    refriCodeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode:'REFRIGERANT'}),
    electSpecCodeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode:'ELEC_SPEC'}),
    oilCodeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode:'OIL'}),
    solenoidCodeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode:'SOLENOID_VALVE'}),
    pipeDirectionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode:'PIPE_DIRECT'}),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', {type:'PRD'}),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', {type:'ASSY'}),

    searchItemStore : Ext.create('Mplm.store.ProductStore', {}),
});
