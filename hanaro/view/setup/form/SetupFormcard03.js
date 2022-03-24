Ext.define('Hanaro.view.setup.form.SetupFormcard03', {
    extend: 'Ext.form.Panel',
    xtype: 'rfx.setupForm3',
    frame:true,
    title: '(3/4) 시스템 환경설정',
    bodyPadding: 10,
    scrollable:false,
    border: false,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },
    initComponent:  function(){
        console_logs('Hanaro.view.setup.form.SetupFormcard03', 'initComponent');
        this.callParent(arguments);
        
        // Ext.getCmp('f2_biz_no').setValue('111');
        // Ext.getCmp('f2_wa_code').setValue('222');
    },
    items: [
        {
            xtype: 'fieldset',
            title: '생산유형 선택',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'component',
                html: '가장 근접한 생산유형 한가지를 선택해주세요.',
                style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;'
                },{
                xtype: 'radiogroup',
                columns: 4,
                vertical: false,
                style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;',
                allowBlank:false, 
                defaults: {
                    name: 'produceField',
                    margin: '0 15 0 0'
                },
    
                items: [{
                    boxLabel: '사출',
                    inputValue: 'MOLD'
                }, {
                    boxLabel: '프레스',
                    inputValue: 'PRESS'
                }, {
                    boxLabel: '성형',
                    inputValue: 'PLASTIC'
                }, {
                    boxLabel: '조립',
                    inputValue: 'ASSEMBLY'
                }, {
                    boxLabel: '자동화 설비',
                    inputValue: 'ATOMATION'
                }, {
                    boxLabel: '일반가공,프로세싱',
                    inputValue: 'PROCESSING'
                }, {
                    boxLabel: '외주생산(설계전문)',
                    inputValue: 'OUTSOURCING'
                }, {
                    boxLabel: '유통전문',
                    inputValue: 'SALES'
                }]
            }

            ]
        },
        {
            xtype : 'container',
            layout : 'column',
            // style: 'margin-bottom: 5px;margin-left:1px;;margin-top: 5px;',
            items : [
                {
                    xtype: 'fieldset',
                    title: '생산방식 선택',
                    width: 300,
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [{
                        xtype: 'component',
                        html: '주요 생산 방식을 선택해주세요.',
                        style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;'
                        },{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: false,
                        style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;',
                        width: 250,
                        defaults: {
                            name: 'produceType',
                            margin: '0 15 0 0'
                        },
                        allowBlank:false, 
                        items: [{
                            boxLabel: '수주기반 생산',
                            inputValue: 'ORDERMADE'
                        }, {
                            boxLabel: '재고/계획 생산',
                            inputValue: 'SCHEDULE'
                        }]
                    }

                    ]
                },
                {xtype: 'component', html: '&nbsp;' , style: 'margin-bottom: 10px;margin-left:20px;;margin-top:20px;'},
                {
                    xtype: 'fieldset',
                    title: '제품정의 시점',
                    width: 300,
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [{
                        xtype: 'component',
                        html: '주요 생산제품의 세부스펙 확정 시점.',
                        style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;'
                        },{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: false,
                        style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;',
                        defaults: {
                            name: 'designTime',
                            margin: '0 15 0 0'
                        },
                        allowBlank:false, 
                        items: [{
                            boxLabel: '수주 전',
                            inputValue: 'PRE_DGN'
                        }, {
                            boxLabel: '수주 후',
                            inputValue: 'POST_DGN'
                        }]
                    }

                    ]
                }  
            ]
        }
        ,
        {
            xtype: 'fieldset',
            title: '제품설계 주체',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'component',
                html: '제품의 설계는 누가 담당하나요?',
                style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;'
                },{
                xtype: 'radiogroup',
                columns: 5,
                vertical: false,
                style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 10px;',
                allowBlank:false, 
                defaults: {
                    name: 'designWho',
                    margin: '0 5 0 0'
                },
    
                items: [{
                    boxLabel: '사내 설계',
                    inputValue: 'SELF'
                }, {
                    boxLabel: '고객사 / ODM',
                    inputValue: 'BUYER'
                }, {
                    boxLabel: '고객사 + 사내',
                    inputValue: 'COMPOSIT'
                }, {
                    boxLabel: '일부 외주',
                    inputValue: 'PARTIALOUT'
                }, {
                    boxLabel: '외주 설계',
                    inputValue: 'OUTSOURCING'
                }]
            }

            ]
        },
        {
            xtype: 'fieldset',
            title: '사용할 모듈 선택',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'checkboxfield',
                boxLabel: '모두 선택',
                style: 'margin-bottom: 0px;margin-left:45px;;margin-top: 0px;',
                listeners: {
                    change: function (checkbox, newVal, oldVal) {
                        console_logs('checkbox', checkbox);
                        console_logs('newVal', newVal);
                        console_logs('oldVal', oldVal);
                        var checkboxGroup = Ext.getCmp('checkboxgroupModules');
                        var checkBoxes = checkboxGroup.getBoxes();
                        Ext.Array.each(checkBoxes, function (checkbox) {
                            console_logs('checkbox', checkbox);
                            if(checkbox.readOnly != true) {
                                checkbox.setValue(newVal);
                            }
                        });
                    }
                }
            },{
                    xtype: 'checkboxgroup',
                    id: 'checkboxgroupModules',
                    fieldLabel: '복수개 선택',
                    columns: 4,
                    vertical: true,
                    style: 'margin-bottom: 10px;margin-left:5px;;margin-top: 5px;',
                    defaults: {
                        name: 'modules'
                    },
                    items: [
                        { boxLabel: '종합현황(필수)',  inputValue: 'project-total', checked: true, readOnly:true},
                        { boxLabel: '영업관리',  inputValue: 'sales-delivery'},
                        { boxLabel: '설계관리',  inputValue: 'design-plan' },
                        { boxLabel: '생산관리',  inputValue: 'produce-mgmt' },
                        { boxLabel: '재고관리',  inputValue: 'pur-stock' },
                        { boxLabel: '구매관리',  inputValue: 'sourcing-mgmt' },
                        { boxLabel: '품질관리',  inputValue: 'quality-manage' },
                        { boxLabel: '설비관리',  inputValue: 'equip-state' },
                        { boxLabel: '클라우드존',      inputValue: 'cloud-zone' },
                        { boxLabel: '기준정보(필수)',  inputValue: 'criterion-info', checked: true, readOnly:true}
                    ]
                }

            ]
        }
    ]
   
   

});