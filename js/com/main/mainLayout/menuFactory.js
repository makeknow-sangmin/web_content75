function getMenuObject(menuText, menuCode) {
	switch(menuCode) {
	case 'menu_CIS00':
	case 'menu_CIS1':
	case 'menu_CIS41':
	case 'menu_CIS42':
		return crMenuCIS(menuText, menuCode); 
		break;
	
	case 'menu_CRT00':
	case 'menu_CRT2': 
	case 'menu_CRT3': 
	case 'menu_CRT4': 
	case 'menu_CRT5':
		return crMenuCRT(menuText, menuCode); 
		break;
	
	case 'menu_CBB1':
	case 'menu_CBB2':
		return crMenuCBB(menuText, menuCode); 
		break;	
		
	case 'menu_DBM1':
		return crMenuDBM1(menuText, menuCode);
		break; //	DBM1	装配树
	
	case 'menu_DBM2': return crMenuDBM2(menuText, menuCode); break; //	DBM2	Part登录
	case 'menu_DBM3': return crMenuDBM3(menuText, menuCode); break; //	DBM3	Unit登录
	case 'menu_DBM4': return crMenuDBM4(menuText, menuCode); break; //	DBM4	Unit维修/复制
	case 'menu_DBM5': return crMenuDBM5(menuText, menuCode); break; //	DBM5	个人Part
	case 'menu_DBM6': return crMenuDBM6(menuText, menuCode); break; //	DBM6	Excel多重上传
	case 'menu_DBM7': return crMenuDBM7(menuText, menuCode); break; //	DBM7	设计BOM清单
	case 'menu_DDP1': return crMenuDDP1(menuText, menuCode); break; //	DDP1	规格书登录
	case 'menu_DDP2': return crMenuDDP2(menuText, menuCode); break; //	DDP2	规格书现况
	case 'menu_DDW1': return crMenuDDW1(menuText, menuCode); break; //	DDW1	个人图档
	case 'menu_DDW2': return crMenuDDW2(menuText, menuCode); break; //	DDW2	共享图档
	case 'menu_DDW3': return crMenuDDW3(menuText, menuCode); break; //	DDW3	图档搜索
	case 'menu_SCS1': return crMenuSCS1(menuText, menuCode); break; //	SCS1	客户现况
	case 'menu_SCS2': return crMenuSCS2(menuText, menuCode); break; //	SCS2	登陆客户
	case 'menu_SMD1': return crMenuSMD1(menuText, menuCode); break; //	SMD1	Model现况
	case 'menu_SPD1': return crMenuSPD1(menuText, menuCode); break; //	SPD1	产品搜索
	case 'menu_SPD2': return crMenuSPD2(menuText, menuCode); break; //	SPD2	产品修正
	case 'menu_SPD3': return crMenuSPD3(menuText, menuCode); break; //	SPD3	产品登录
	case 'menu_SPD4': return crMenuSPD4(menuText, menuCode); break; //	SPD4	Excel上传
	case 'menu_SPS1': return crMenuSPS1(menuText, menuCode); break; //	SPS1	产品库存现况
	case 'menu_SPS2': return crMenuSPS2(menuText, menuCode); break; //	SPS2	产品入库
	case 'menu_SPS3': return crMenuSPS3(menuText, menuCode); break; //	SPS3	产品出库
	case 'menu_SET1': return crMenuSET1(menuText, menuCode); break; //	SET1	制作评价书
	case 'menu_SET2': return crMenuSET2(menuText, menuCode); break; //	SET2	评价书保管箱
	case 'menu_SQT1': return crMenuSQT1(menuText, menuCode); break; //	SQT1	制作报价单
	case 'menu_SQT2': return crMenuSQT2(menuText, menuCode); break; //	SQT2	报价单保管箱
	case 'menu_SRO1': return crMenuSRO1(menuText, menuCode); break; //	SRO1	订单现况
	//case 'menu_SRO2': return crMenuSRO2(menuText, menuCode); break; //	SRO2	订单录入
	case 'menu_SRT3': return crMenuSRT3(menuText, menuCode); break; //	SRT3	订单详细现况
	case 'menu_SDL1': return crMenuSDL1(menuText, menuCode); break; //	SDL1	纳品现况
	case 'menu_SDL2': return crMenuSDL2(menuText, menuCode); break; //	SDL2	纳品生成
	case 'menu_SDL3': return crMenuSDL3(menuText, menuCode); break; //	SDL3	产品生产
	case 'menu_SVO1': return crMenuSVO1(menuText, menuCode); break; //	SVO1	VOC现况
	case 'menu_SVO2': return crMenuSVO2(menuText, menuCode); break; //	SVO2	VOC录入
	case 'menu_SVO3': return crMenuSVO3(menuText, menuCode); break; //	SVO3	制作计划书
	case 'menu_SVO4': return crMenuSVO4(menuText, menuCode); break; //	SVO4	制作报告书
	case 'menu_PMT1': return crMenuPMT1(menuText, menuCode); break; //	PMT1	查询资材
	case 'menu_PMT2': return crMenuPMT2(menuText, menuCode); break; //	PMT2	资材修正
	case 'menu_PMT3': return crMenuPMT3(menuText, menuCode); break; //	PMT3	登陆标准资材
	case 'menu_PMT4': return crMenuPMT4(menuText, menuCode); break; //	PMT4	Excel上传
	case 'menu_PPR1': return crMenuPPR1(menuText, menuCode); break; //	PPR1	制作请求
	case 'menu_PPR2': return crMenuPPR2(menuText, menuCode); break; //	PPR2	请求书打印
	case 'menu_PPR3': return crMenuPPR3(menuText, menuCode); break; //	PPR3	接受请求
	case 'menu_PMS1': return crMenuPMS1(menuText, menuCode); break; //	PMS1	库存现况
	case 'menu_PMS2': return crMenuPMS2(menuText, menuCode); break; //	PMS2	资材入库
	case 'menu_PMS3': return crMenuPMS3(menuText, menuCode); break; //	PMS3	资材出库
	case 'menu_PPO1': return crMenuPPO1(menuText, menuCode); break; //	PPO1	制作订单
	case 'menu_PPO2': return crMenuPPO2(menuText, menuCode); break; //	PPO2	订单别现况
	case 'menu_PPO3': return crMenuPPO3(menuText, menuCode); break; //	PPO3	订单详细现况
	case 'menu_PPO4': return crMenuPPO4(menuText, menuCode); break; //	PPO4	书打印
	case 'menu_PSP1': return crMenuPSP1(menuText, menuCode); break; //	PSP1	供应商现况
	case 'menu_PSP2': return crMenuPSP2(menuText, menuCode); break; //	PSP2	供应商登录
	case 'menu_EPJ1': return crMenuEPJ1(menuText, menuCode); break; //	EPJ1	请求现况 
	case 'menu_EPJ2': return crMenuEPJ2(menuText, menuCode); break; //	EPJ2	工程修正
	case 'menu_EPJ3': return crMenuEPJ3(menuText, menuCode); break; //	EPJ3	工程登录
	case 'menu_EPJ4': return crMenuEPJ4(menuText, menuCode); break; //	EPJ4	工程人员
	case 'menu_EPJ5': return crMenuEPJ5(menuText, menuCode); break; //	EPJ5	标准工程现况
	case 'menu_EPJ6': return crMenuEPJ6(menuText, menuCode); break; //	EPJ6	标准工程登录
	
	case 'menu_EPC1': return crMenuEPC1(menuText, menuCode); break; //	EPC1	工序指定
	
	case 'menu_EPC2': return crMenuEPC2(menuText, menuCode); break; //	EPC2	不良工程登录
	case 'menu_EPC3': return crMenuEPC3(menuText, menuCode); break; //	EPC3	工序现况
	case 'menu_EPC4': return crMenuEPC4(menuText, menuCode); break; //	EPC4	作业实绩登录
	case 'menu_EPC5': return crMenuEPC5(menuText, menuCode); break; //	EPC5	作业实绩现况
	case 'menu_ESC1': return crMenuESC1(menuText, menuCode); break; //	ESC1	各人工时录入
	case 'menu_ESC2': return crMenuESC2(menuText, menuCode); break; //	ESC2	日别工时录入
	case 'menu_ESC3': return crMenuESC3(menuText, menuCode); break; //	ESC3	计划树立
	case 'menu_ESC4': return crMenuESC4(menuText, menuCode); break; //	ESC4	进行现况
	case 'menu_ESC5': return crMenuESC5(menuText, menuCode); break; //	ESC5	对比目标延迟
	case 'menu_EMC1': return crMenuEMC1(menuText, menuCode); break; //	EMC1	设备现况
	case 'menu_EMC2': return crMenuEMC2(menuText, menuCode); break; //	EMC2	设备登录
	case 'menu_EMC3': return crMenuEMC3(menuText, menuCode); break; //	EMC3	报废处理
	case 'menu_EMC4': return crMenuEMC4(menuText, menuCode); break; //	EMC4	维修登录
	case 'menu_EMC5': return crMenuEMC5(menuText, menuCode); break; //	EMC5	维修现况
	case 'menu_QGR1': return crMenuQGR1(menuText, menuCode); break; //	QGR1	入库检查确认
	case 'menu_QGR2': return crMenuQGR2(menuText, menuCode); break; //	QGR2	入库现况
	case 'menu_QGR3': return crMenuQGR3(menuText, menuCode); break; //	QGR3	取消入库现况
	case 'menu_QQL1': return crMenuQQL1(menuText, menuCode); break; //	QQL1	不良登录
	case 'menu_QQL2': return crMenuQQL2(menuText, menuCode); break; //	QQL2	不良现况
	case 'menu_QQL3': return crMenuQQL3(menuText, menuCode); break; //	QQL3	纳期遵守率
	case 'menu_QQL4': return crMenuQQL4(menuText, menuCode); break; //	QQL4	供应商别品质评价
	case 'menu_QTT1': return crMenuQTT1(menuText, menuCode); break; //	QTT1	试模登录
	case 'menu_QTT2': return crMenuQTT2(menuText, menuCode); break; //	QTT2	试模现况
	case 'menu_QTT3': return crMenuQTT3(menuText, menuCode); break; //	QTT3	试模评价登录
	case 'menu_QTT4': return crMenuQTT4(menuText, menuCode); break; //	QTT4	试模评价履历
	case 'menu_AMI1': return crMenuAMI1(menuText, menuCode); break; //	AMI1	公司情报
	case 'menu_AMI2': return crMenuAMI2(menuText, menuCode); break; //	AMI2	裁决表格
	case 'menu_AMI3': return crMenuAMI3(menuText, menuCode); break; //	AMI3	公司标志
	case 'menu_AMI4': return crMenuAMI4(menuText, menuCode); break; //	AMI4	公司电子签章
	case 'menu_AMC1': return crMenuAMC1(menuText, menuCode); break; //	AMC1	代码体制
	case 'menu_AMC2': return crMenuAMC2(menuText, menuCode); break; //	AMC2	标准材质名称
	case 'menu_AMC3': return crMenuAMC3(menuText, menuCode); break; //	AMC3	标准后处理名称
	case 'menu_AMC4': return crMenuAMC4(menuText, menuCode); break; //	AMC4	分类体制
	case 'menu_AMC5': return crMenuAMC5(menuText, menuCode); break; //	AMC5	标准工时代码
	case 'menu_AMY1': return crMenuAMY1(menuText, menuCode); break; //	AMY1	标准工程设定
	case 'menu_AMY2': return crMenuAMY2(menuText, menuCode); break; //	AMY2	个人信息
	case 'menu_AMY3': return crMenuAMY3(menuText, menuCode); break; //	AMY3	密码修改
	case 'menu_AMY4': return crMenuAMY4(menuText, menuCode); break; //	AMY4	查看公司信息
	case 'menu_AAP1': return crMenuAAP1(menuText, menuCode); break; //	AAP1	报销单
	case 'menu_AAP2': return crMenuAAP2(menuText, menuCode); break; //	AAP2	未报销内容
	case 'menu_AAR1': return crMenuAAR1(menuText, menuCode); break; //	AAR1	收款计划树立
	case 'menu_AAR2': return crMenuAAR2(menuText, menuCode); break; //	AAR2	待收款现况
	case 'menu_ADB1': return crMenuADB1(menuText, menuCode); break; //	ADB1	工序现况
	case 'menu_ADB2': return crMenuADB2(menuText, menuCode); break; //	ADB2	营业现况
	case 'menu_AIF1': return crMenuAIF1(menuText, menuCode); break; //	AIF1	联动设置
	case 'menu_AIF2': return crMenuAIF2(menuText, menuCode); break; //	AIF2	联动履历
    case 'menu_AUS1': return crMenuAUS1(menuText, menuCode); break; //	ZU1	임직원현황

	}

	return null;
}



function crMenuCIS(menuText, menuCode) 
{
	var form = Ext.create('Ext.form.Panel', {
        layout: 'absolute',
        url: 'save-form.php',
        defaultType: 'textfield',
        border: false,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 60
        },
        items: [{
            fieldLabel: panelSRO1147,
            msgTarget: 'side',
            allowBlank: false,
            x: 5,
            y: 5,
            name: 'to',
            anchor: '-5'  // anchor width by percentage
        }, {
            fieldLabel: panelSRO1053,
            x: 5,
            y: 5 + 30,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },
        {
            x:5,
            y: 5 + 30*2,
            xtype: 'filefield',
            id: 'form-file',
            emptyText: panelSRO1149,
            fieldLabel: panelSRO1150,
            name: 'photo-path',
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '-5'  // anchor width by percentage
        }, {
            x:5,
            y: 5 + 30*3,
            xtype: 'htmleditor',
            style: 'margin:0',
            hideLabel: true,
            name: 'msg',
            anchor: '-5 -5'  // anchor width and height
        }
        ]
    });

    var win = Ext.create('Ext.window.Window', {
        title: panelSRO1136 + ' :: ' + group_menu_IS,
        width: 600,
        height: 400,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        items: form,

        buttons: [{
            text: panelSRO1151
        },{
            text: panelSRO1152
        }]
    });
	return win;
}

function crMenuCRT(menuText, menuCode) 
{

	var form = Ext.create('Ext.form.Panel', {
		layout: 'form',
        defaultType: 'textfield',
        border: false,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 50,
            labelAlign: 'right'
        },
        items: [{
            fieldLabel: panelSRO1053,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },
         {
        	fieldLabel: panelSRO1155,
            xtype: 'textarea',
            style: 'margin:0',
            hideLabel: false,
            name: 'msg',
            height: 300,
            anchor: '-5 -5'  // anchor width and height
        },{
            xtype: 'filefield',
            id: 'form-file',
            emptyText: panelSRO1149,
            fieldLabel: panelSRO1150,
            name: 'photo-path',
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '-5'  // anchor width by percentage
        }
        ] 
    });

	win = Ext.create('widget.window', {
        title:  panelSRO1136 + ' :: ' + group_menu_RT,
        closable: true,
        closeAction: 'hide',
        width: 800,
        minWidth: 500,
        height: 500,
        layout: {
            type: 'border',
            padding: 5
        },
        items: [{
            region: 'west',
            title: panelSRO1156,
            xtype: 'grid',
            width: 200,
            split: true,
            //collapsible: true,
            floatable: false,
            store: Ext.create('Ext.data.ArrayStore', {
			     fields: loadVar('crtReceiverFields'),
				    data: loadVar('crtReceiverData')
				}),
			columnLines: true,
			columns: loadVar('crtReceiverColumns'),
	        dockedItems: [
		      				{
		      				    xtype: 'toolbar',
		      				    items: [
		      				            {
											iconCls:'add',
										    text: panelSRO1136
										},
		      				            '-',
		      				          {
											iconCls:'remove',
										    text: panelSRO1137
										}
		      				            
		      				         ]
		      				}
		              ]
        }, {
        	title: panelSRO1157,
            region: 'center',
            xtype: 'tabpanel',
            tabPosition: 'bottom',
            items: [{
                title: panelSRO1158,
                items: [form]
            }, {
                title: panelSRO1159+' 1',
                items: []
            }, {
                title: panelSRO1159+' 2',
                html: 'Hello world 3',
                closable: true
            }]
        }],
        buttons: [{
            text: panelSRO1151
        },{
            text: panelSRO1152
        }]
    });

	return win;
}

function crMenuCBB(menuText, menuCode) 
{
	var form = Ext.create('Ext.form.Panel', {
        layout: 'absolute',
        url: 'save-form.php',
        defaultType: 'textfield',
        border: false,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 60
        },
        items: [{
            fieldLabel: panelSRO1053,
            x: 5,
            y: 5,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },
        {
            x:5,
            y: 5 + 30,
            xtype: 'filefield',
            id: 'form-file',
            emptyText: panelSRO1149,
            fieldLabel: panelSRO1150,
            name: 'photo-path',
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '-5'  // anchor width by percentage
        }, {
            x:5,
            y: 5 + 30*2,
            xtype: 'htmleditor',
            style: 'margin:0',
            hideLabel: true,
            name: 'msg11',
            id: 'msg11',
            //value: '<strong>d</strong>qwdwqdwq',
            anchor: '-5 -5'  // anchor width and height
        }
        ]
    });

    var win = Ext.create('Ext.window.Window', {
        title: panelSRO1136 + ' :: ' + panelSRO1153,
        width: 600,
        height: 400,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        items: form,

        buttons: [{
            text: panelSRO1151,
            handler: function(){
            	//var msg = Ext.getCmp('msg11').getValue();
            	//alert(msg);
            }
        },{
            text: panelSRO1152
        }]
    });
	return win;
}

function crMenuCBB1(menuText, menuCode) { return null; }
function crMenuCBB2(menuText, menuCode) { return null; }
function crMenuCBB3(menuText, menuCode) { return null; }
function crMenuDBM1(menuText, menuCode) { 
	var form = Ext.create('Ext.form.Panel', {
        layout: 'absolute',
        url: 'save-form.php',
        defaultType: 'textfield',
        border: false,
        bodyPadding: 15,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 60
        },
        items: [ {
            xtype: 'triggerfield',
            fieldLabel: panelSRO1145,
            x: 5,
            y: 8,
            name: 'subject',
            anchor: '-5',  // anchor width by percentage
            emptyText: panelSRO1146,
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger'
        },{
            xtype: 'fieldset',
            x: 5,
            y: 3 + 1*lineGap,
            title: panelSRO1139,
            collapsible: false,
            defaults: {
                labelWidth: 40,
                anchor: '100%',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [
                
                {
                    xtype : 'fieldcontainer',
                    combineErrors: true,
                    msgTarget: 'side',
                    fieldLabel: panelSRO1144,
                    defaults: {
                        hideLabel: true
                    },
                    items : [
                        {
                            //the width of this field in the HBox layout is set directly
                            //the other 2 items are given flex: 1, so will share the rest of the space
                            width:          110,
                            xtype:          'combo',
                            mode:           'local',
                            value:          'mrs',
                            triggerAction:  'all',
                            forceSelection: true,
                            editable:       false,
                            fieldLabel:     panelSRO1168,
                            name:           'name',
                            displayField:   'name',
                            valueField:     'value',
                            queryMode: 'local',
                            store:          Ext.create('Ext.data.Store', {
                                fields : ['name', 'value'],
                                data   : [
                                    {name : '模胚类',   value: 'MA'},
                                    {name : '模板',   value: 'MB'},
                                    {name : '行位类零件',   value: 'MC'},
                                    {name : '模仁',   value: 'MD'},
                                    {name : '胶位相关类零件',   value: 'ME'},
                                    {name : '斜顶相关零件',   value: 'MF'},
                                    {name : '顶针类零件',   value: 'MG'},
                                    {name : '胶口类散件',   value: 'MH'},
                                    {name : '模板相关零件',   value: 'MI'},
                                    {name : '运水相关零件',   value: 'MJ'}
                                ]
                            })
                        }, {
                            //the width of this field in the HBox layout is set directly
                            //the other 2 items are given flex: 1, so will share the rest of the space
                            width:          110,
                            xtype:          'combo',
                            mode:           'local',
                            value:          'mrs',
                            triggerAction:  'all',
                            forceSelection: true,
                            editable:       false,
                            fieldLabel:     panelSRO1168,
                            name:           'name',
                            displayField:   'name',
                            valueField:     'value',
                            queryMode: 'local',
                            store:          Ext.create('Ext.data.Store', {
                                fields : ['name', 'value'],
                                data   : [
                                    {name : '上固定板',   value: 'MA'},
                                    {name : '水口推板',   value: 'MB'},
                                    {name : 'A板',   value: 'MC'},
                                    {name : '推板',   value: 'MD'},
                                    {name : 'B板',   value: 'ME'},
                                    {name : '承板',   value: 'MF'},
                                    {name : '顶针面板',   value: 'MG'},
                                    {name : '顶针底板',   value: 'MH'},
                                    {name : '下固定板',   value: 'MI'},
                                    {name : '方铁1',   value: 'MJ'},
                                    {name : '方铁2',   value: 'MJ'},
                                    {name : '热流道板1',   value: 'MJ'},
                                    {name : '热流道板2',   value: 'MJ'},
                                    {name : '热流道板3',   value: 'MJ'}
                                ]
                            })
                        },
                        {
                            xtype: 'textfield',
                            width:          70,
                            name : 'plNo',
                            fieldLabel: panelSRO1169,
                            value: 'MB01001',
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'itemName',
                            fieldLabel: panelSRO1171,
                            allowBlank: true,
                            value: '上固定板',
                            margins: '0'
                        }
                    ]
                }
            ]
        },
        {
            fieldLabel: group_menu_DP,
            x: 5,
            y: 20 + 3*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: panelSRO1170,
            x: 5,
            y: 20 + 4*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: panelSRO1088,
            x: 5,
            y: 20 + 5*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: panelSRO1078,
            x: 5,
            y: 20 + 6*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: group_menu_SP,
            x: 5,
            y: 20 + 7*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },

        {
            x:5,
            y: 21 + 8*lineGap,
            xtype: 'filefield',
            id: 'form-file',
            emptyText: panelSRO1149,
            fieldLabel: panelSRO1150,
            name: 'photo-path',
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '-5'  // anchor width by percentage
        },
        {
            xtype: 'fieldset',
            x: 5,
            y: 26 + 9*lineGap,
            border: true,
            //style: 'border-width: 0px',
            title: panelSRO1174,
            collapsible: false,
            defaults: {
                labelWidth: 40,
                anchor: '100%',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [

                {
                    xtype : 'fieldcontainer',
                    combineErrors: true,
                    msgTarget: 'side',
                    defaults: {
                        hideLabel: true
                    },
                    items : [{
		                        xtype: 'displayfield',
		                        value: ' '+panelSRO1186+':'
		                    }, 
                             {
                                 xtype: 'textfield',
                                 width : 70,
                                 name : 'quantity',
                                 fieldLabel: panelSRO1171,
                                 allowBlank: true,
                                 value: '1',
                                 margins: '0'
                             },{
		                        xtype: 'displayfield',
		                        value: '&nbsp;&nbsp;'+panelSRO1187+':'
		                    },
                             {
                            //the width of this field in the HBox layout is set directly
                            //the other 2 items are given flex: 1, so will share the rest of the space
                            width:          80,
                            xtype:          'combo',
                            mode:           'local',
                            value:          'mrs',
                            triggerAction:  'all',
                            forceSelection: true,
                            editable:       false,
                            fieldLabel:     panelSRO1168,
                            name:           'name',
                            displayField:   'name',
                            valueField:     'value',
                            queryMode: 'local',
                            store:          Ext.create('Ext.data.Store', {
                                fields : ['name', 'value'],
                                data   : [
                                    {name : 'PC',   value: 'PC'},
                                    {name : 'SET',   value: 'SET'}
                                ]
                            })
                        },
                        {
                            xtype: 'displayfield',
                            value: ' '+panelSRO1188+':'
                        },
                        {
                            xtype: 'textfield',
                            flex: 1,
                            name : 'itemName',
                            fieldLabel: panelSRO1171,
                            allowBlank: true,
                            value: '0',
                            margins: '0'
                        }, {
                            //the width of this field in the HBox layout is set directly
                            //the other 2 items are given flex: 1, so will share the rest of the space
                            width:          80,
                            id: 'comboClass',
                            xtype:          'combo',
                            mode:           'local',
                            value:          'mrs',
                            triggerAction:  'all',
                            forceSelection: true,
                            editable:       false,
                            fieldLabel:     panelSRO1168,
                            name:           'name',
                            displayField:   'name',
                            valueField:     'value',
                            queryMode: 'local',
                            store:          Ext.create('Ext.data.Store', {
                                fields : ['name', 'value'],
                                data   : [
                                    {name : 'RMB',   value: 'RMB'},
                                    {name : 'USD',   value: 'USD'}
                                ]
                            })
                        }
                    ]
                }
            ]
        }
        ]
    });

    var win = Ext.create('Ext.window.Window', {
        title: panelSRO1136 + ' :: ' + panelSRO1153,
        width: 600,
        height: 460,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        items: form,

        buttons: [{
            text: panelSRO1151
        },{
            text: panelSRO1152
        }]
    });
    
    //initSelect(Ext.getCmp("comboClass"));
	return win;
}

function initSelect(obj){
    obj.setValue(obj.store.getAt(0).get(obj.valueField));
}

function crMenuDBM2(menuText, menuCode) { return null; }
function crMenuDBM3(menuText, menuCode) { return null; }
function crMenuDBM4(menuText, menuCode) { return null; }
function crMenuDBM5(menuText, menuCode) { return null; }
function crMenuDBM6(menuText, menuCode) { return null; }
function crMenuDBM7(menuText, menuCode) { return null; }
function crMenuDDP1(menuText, menuCode) { return null; }
function crMenuDDP2(menuText, menuCode) { return null; }
function crMenuDDW1(menuText, menuCode) { return null; }
function crMenuDDW2(menuText, menuCode) { return null; }
function crMenuDDW3(menuText, menuCode) { return null; }
function crMenuSCS1(menuText, menuCode) { return null; }
function crMenuSCS2(menuText, menuCode) { return null; }
function crMenuSMD1(menuText, menuCode) { return null; }
function crMenuSPD1(menuText, menuCode) { return null; }
function crMenuSPD2(menuText, menuCode) { return null; }
function crMenuSPD3(menuText, menuCode) { return null; }
function crMenuSPD4(menuText, menuCode) { return null; }
function crMenuSPS1(menuText, menuCode) { return null; }
function crMenuSPS2(menuText, menuCode) { return null; }
function crMenuSPS3(menuText, menuCode) { return null; }
function crMenuSET1(menuText, menuCode) { return null; }
function crMenuSET2(menuText, menuCode) { return null; }
function crMenuSQT1(menuText, menuCode) { return null; }
function crMenuSQT2(menuText, menuCode) { return null; }

function crMenuSRO1(menuText, menuCode) {

	var win = Ext.create('widget.window', {
        title:  panelSRO1136 + ' :: ' + menuText ,
        xtype: 'form',
        closable: true,
        frame: false ,
        //closeAction: 'close',
        bodyPadding: '3 3 0',
        width: 800,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },  
        buttons: [{
            text: panelSRO1151 ,
            	handler: function(){
            		/*
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                        form.submit({
                            waitMsg:'Loading...',
                            url: 'RepeatSession.jsp',
                            success: function(form,action) {
                                //we have to close the window here!!
                            },
                            failure: function(form,action){
                                Ext.MessageBox.alert('Erro',action.result.data.msg);
                            }
                        });
                    */
            		if(win) {win.close();}
                }
                
        },{
            text: panelSRO1152 ,
            //scope: Ext.getCmp('sro1'), //this,
            handler: function(){
            	if(win) {win.close();}
            	//this.close();
            	//Ext.getCmp('sro1').destroy();
            	//button.up('.window').destroy();
            }
            
            	
        }],
        
        items: [{
            xtype:'fieldset',
            title: panelSRO1002,
            collapsible: true,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                xtype: 'container',
                layout:'hbox',
                items:[{
                    xtype: 'container',
                    flex: 1,
                    border:false,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                    items: [
                            {         xtype:          'combo',
                                mode:           'local',
                                value:          'mrs',
                                triggerAction:  'all',
                                forceSelection: true,
                                editable:       false,
                                fieldLabel:     panelSRO1001 + '<font color=red>*</font>',
                                name:           'title',
                                displayField:   'name',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                        {name : 'Samsung',   value: '1'},
                                        {name : 'Apple',  value: '2'},
                                        {name : 'LG', value: '3'}
                                    ]
                                })     }, 
                                
                            {          fieldLabel: panelSRO1003    },
                            {          fieldLabel: panelSRO1004   },
                            {         xtype:          'combo',
                                mode:           'local',
                                value:          'mrs',
                                triggerAction:  'all',
                                forceSelection: true,
                                editable:       false,
                                fieldLabel:    panelSRO1005,
                                name:          'title',
                                displayField:   'name',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                              {name : '第一事业部',   value: 'JS0000CN'},
                                              {name : '第二事业部',   value: 'BBBB'},
                                              {name : '第三事业部',   value: 'CCCC'}
                                    ]
                                })     
                             }
                       ]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },                        //afterLabelTextTpl: required,
                    items: [{
                        fieldLabel: panelSRO1006, name: 'last',
                        xtype: 'datefield'
                       
                    },
                    	{  fieldLabel: panelSRO1007              },
                        {	fieldLabel: panelSRO1008 },
                        {          fieldLabel: panelSRO1009    }
                        ]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right' , anchor:'95%' },
                    items: [{
                        fieldLabel: panelSRO1010
                    },{
                        fieldLabel: panelSRO1011,
                        xtype: 'datefield'
                    },{
                        fieldLabel: panelSRO1012
                    },
                    {          fieldLabel: panelSRO1013  }
                    ]
                }]
            }]
        },
        {
            xtype: 'fieldset',
            title: panelSRO1045,
            collapsible: true,
            defaults: {
                labelWidth: 89,
                anchor: '100%',
                labelAlign: 'right',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    //fieldLabel: '模房',
                    combineErrors: false,
                    defaults: {
                        hideLabel: true
                    },
                    items: [
                            {
                                xtype: 'displayfield',
                                value: '模房:'
                            },
                        {
                            //the width of this field in the HBox layout is set directly
                            //the other 2 items are given flex: 1, so will share the rest of the space
                            width:          50,

                            xtype:          'combo',
                            mode:           'local',
                            value:          'A',
                            triggerAction:  'all',
                            forceSelection: true,
                            editable:       false,
                            name:           'title',
                            displayField:   'name',
                            valueField:     'value',
                            width: 70,
                            queryMode: 'local',
                            store:          Ext.create('Ext.data.Store', {
                                fields : ['name', 'value'],
                                data   : [
                                    {name : 'A:上角',   value: 'A'},
                                    {name : 'B:上沙',  value: 'B'},
                                    {name : 'C:乌沙', value: 'C'}
                                ]
                            })
                        },
                        {
                            xtype: 'displayfield',
                            value: '年度:'
                        },
                       {
                           name : 'year',
                           xtype: 'numberfield',
                           width: 48,
                           value: '12',
                           allowBlank: false
                       },
                       {
                           xtype: 'displayfield',
                           value: '模具类型:'
                       },
                       {
                    	   width:          80,
                           xtype:          'combo',
                           mode:           'local',
                           value:          'M',
                           triggerAction:  'all',
                           forceSelection: true,
                           editable:       false,
                           name:           'title',
                           displayField:   'name',
                           valueField:     'value',
                           queryMode: 'local',
                           store:          Ext.create('Ext.data.Store', {
                               fields : ['name', 'value'],
                               data   : [
                                   {name : 'M:注塑模',   value: 'M'},
                                   {name : 'P:冲压模',  value: 'P'},
                                   {name : 'D:压铸模', value: 'D'},
                                   {name : 'Z:治具模', value: 'Z'}
                               ]
                           })
                           
                       },
                       {
                           xtype: 'displayfield',
                           value: '维修次数:'
                       },
                       {
                           xtype: 'textfield',
                           name : 'version',
                           fieldLabel: panelSRO1172,
                           width:         25,
                           value: '00',
                           allowBlank: false
                       },
                       {
                           xtype: 'displayfield',
                           value: '双射模:'
                       },
                       {
                           xtype: 'textfield',
                           name : 'addVer',
                           fieldLabel: panelSRO1173,
                           width:          25,
                           value: '00',
                           allowBlank: false
                       },
                       {
                           xtype: 'displayfield',
                        
                           value: '&nbsp;&nbsp;'
                       },
                       {
                           xtype:'button',
                           text: panelSRO1045
                       },
                       {
                           xtype: 'textfield',
                           flex : 1,
                           name : 'firstName',
                           fieldLabel: panelSRO1169,
                           value: 'JA12M-0001-0000',
                           readOnly : true,
                           fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                           allowBlank: false
                       }
                    ]
                }
            ]
        }
        ,
        {
            xtype:'fieldset',
            title: panelSRO1014,
            collapsible: true,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                xtype: 'container',
                layout:'hbox',
                items:[{
                    xtype: 'container',
                    flex: 1,
                    border:false,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                    items: [
                            //{ fieldLabel: '模号'}, 
                            //{          fieldLabel: panelSRO1015 + '/'  + panelSRO1016  },
                            {  fieldLabel: panelSRO1024 ,                            
                            	xtype: 'textfield',
                                flex : 1,
                                name : 'firstName',
                                value: '100001',
                                readOnly : true,
                                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 10px;',
                                allowBlank: false  },
                            
                            {  fieldLabel: panelSRO1018    },
                            {  fieldLabel: panelSRO1019   },
                            {  fieldLabel: panelSRO1020   },
                            {  fieldLabel: panelSRO1021    }
                       ]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },                        //afterLabelTextTpl: required,
                    items: [
		                       /*     {         xtype:          'combo',
                                mode:           'local',
                                value:          'mrs',
                                triggerAction:  'all',
                                forceSelection: true,
                                editable:       false,
                                fieldLabel:     '分厂代码',
                                name:           'title',
                                displayField:   'name',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                        {name : 'A: 上角', value: 'A'},
                                        {name : 'B: 上沙', value: 'B'},
                                        {name : 'C: 乌沙', value: 'C'}
                                    ]
                                })     
                             },
                             */
                            //{  fieldLabel: panelSRO1022  },
		                       {  fieldLabel: panelSRO1017   },
                            {  fieldLabel: panelSRO1023  },
                            {  fieldLabel: panelSRO1025    },
                            {  fieldLabel: panelSRO1161    },
                            {  fieldLabel: panelSRO1162    }
                        	]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right' , anchor:'95%' },
                    items: [
                           // {  fieldLabel: panelSRO1026    } ,
                        { fieldLabel: panelSRO1163 },
                        {  fieldLabel: panelSRO1164   },
                        {  fieldLabel: panelSRO1165   },
                        {  fieldLabel: panelSRO1166   },
                        {  fieldLabel: panelSRO1167   }
                            ]
                }]
            }]
        }
        ,
        {
            xtype:'fieldset',
            title: panelSRO1027,
            collapsible: true,
            collapsed : true,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                xtype: 'container',
                layout:'hbox',
                items:[{
                    xtype: 'container',
                    flex: 1,
                    border:false,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                    items: [
                            {  fieldLabel: panelSRO1028,   xtype: 'datefield'  }, 
                            {  fieldLabel: panelSRO1029,   xtype: 'datefield'  }, 
                            {          fieldLabel: panelSRO1030    },
                            {         xtype:          'combo',
                                mode:           'local',
                                value:          'mrs',
                                triggerAction:  'all',
                                forceSelection: true,
                                editable:       false,
                                fieldLabel:     panelSRO1031,
                                name:           'title',
                                displayField:   'name',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                        {name : '진행',   value: '1'},
                                        {name : '보류',  value: '2'}
                                    ]
                                })     
                             },
                             {  fieldLabel: panelSRO1034,   xtype: 'datefield'  }
                       ]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },                        //afterLabelTextTpl: required,
                    items: [
                        {  fieldLabel: panelSRO1035,  xtype: 'datefield' },
                        {  fieldLabel: panelSRO1036,  xtype: 'datefield' },
                        {  fieldLabel: panelSRO1037,  xtype: 'datefield' },
                        {          fieldLabel:panelSRO1038   },
                        {  fieldLabel: panelSRO1039 + '1',   xtype: 'datefield'  }
                        ]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right' , anchor:'95%' },
                    items: [{
                        fieldLabel: panelSRO1040
                    },{
                        fieldLabel: panelSRO1041
                    },{
                        fieldLabel: panelSRO1042
                    },
                    {          fieldLabel: panelSRO1043    },
                    {  fieldLabel: panelSRO1039 + '2',    xtype: 'datefield'  }
                    ]
                }]
            }]
        }
       
        
        ]
    });

	return win;

}
function crMenuSRT3(menuText, menuCode) { return null; }
function crMenuSDL1(menuText, menuCode) { return null; }
function crMenuSDL2(menuText, menuCode) { return null; }
function crMenuSDL3(menuText, menuCode) { return null; }
function crMenuSVO1(menuText, menuCode) { return null; }
function crMenuSVO2(menuText, menuCode) { return null; }
function crMenuSVO3(menuText, menuCode) { return null; }
function crMenuSVO4(menuText, menuCode) { return null; }
function crMenuPMT1(menuText, menuCode) { return null; }
function crMenuPMT2(menuText, menuCode) { return null; }
function crMenuPMT3(menuText, menuCode) { return null; }
function crMenuPMT4(menuText, menuCode) { return null; }
function crMenuPPR1(menuText, menuCode) { return null; }
function crMenuPPR2(menuText, menuCode) { return null; }
function crMenuPPR3(menuText, menuCode) { return null; }
function crMenuPMS1(menuText, menuCode) { return null; }
function crMenuPMS2(menuText, menuCode) { return null; }
function crMenuPMS3(menuText, menuCode) { return null; }
function crMenuPPO1(menuText, menuCode) { return null; }
function crMenuPPO2(menuText, menuCode) { return null; }
function crMenuPPO3(menuText, menuCode) { return null; }
function crMenuPPO4(menuText, menuCode) { return null; }
function crMenuPSP1(menuText, menuCode) { return null; }
function crMenuPSP2(menuText, menuCode) { return null; }
function crMenuEPJ1(menuText, menuCode) { return null; }
function crMenuEPJ2(menuText, menuCode) { return null; }
function crMenuEPJ3(menuText, menuCode) { return null; }
function crMenuEPJ4(menuText, menuCode) { return null; }
function crMenuEPJ5(menuText, menuCode) { return null; }
function crMenuEPJ6(menuText, menuCode) { return null; }

function crMenuEPC1(menuText, menuCode) { 

	var form = Ext.create('Ext.form.Panel', {
        layout: 'absolute',
        url: 'save-form.php',
        defaultType: 'textfield',
        border: false,
        bodyPadding: 15,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [ 
        {
            fieldLabel: 'Mold No.',
            x: 5,
            y: 20 + 1*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: 'Part No.',
            x: 5,
            y: 20 + 2*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: 'Process Number',
            x: 5,
            y: 20 + 3*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        },{
            //width:          110,
            xtype:          'combo',
            mode:           'local',
            value:          'pcode',
            triggerAction:  'all',
            forceSelection: true,
            editable:       false,
            fieldLabel:     'Part Code',
            name:           'name',
            displayField:   'name',
            valueField:     'value',
            queryMode: 'local',
            x: 5,
            y: 20 + 4*lineGap,
            anchor: '-5',
            store:          Ext.create('Ext.data.Store', {
                fields : ['name', 'value'],
                data   : [
                    {name : 'MILL',   value: 'JS0000CN'},
                    {name : 'GRINDER',   value: 'BBBB'},
                    {name : 'CNC',   value: 'CCCC'},
                    {name : 'EDM',   value: 'DDDD'},
                    {name : 'W/C',   value: 'EEEE'}
                ]
            })
        },{
            fieldLabel: 'Need Time',
            x: 5,
            y: 20 + 5*lineGap,
            name: 'subject',
            anchor: '-5'  // anchor width by percentage
        }
        ]
    });

    var win = Ext.create('Ext.window.Window', {
        title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
        width: 500,
        height: 350,
        minWidth: 250,
        minHeight: 180,
        layout: 'fit',
        plain:true,
        items: form,

        buttons: [{
            text: panelSRO1151
        },{
            text: panelSRO1152
        }]
    });
    
	return win;

}


function crMenuEPC2(menuText, menuCode) { return null; }
function crMenuEPC3(menuText, menuCode) { return null; }
function crMenuEPC4(menuText, menuCode) { return null; }
function crMenuEPC5(menuText, menuCode) { return null; }
function crMenuESC1(menuText, menuCode) { return null; }
function crMenuESC2(menuText, menuCode) { return null; }
function crMenuESC3(menuText, menuCode) { return null; }
function crMenuESC4(menuText, menuCode) { return null; }
function crMenuESC5(menuText, menuCode) { return null; }
function crMenuEMC1(menuText, menuCode) { return null; }
function crMenuEMC2(menuText, menuCode) { return null; }
function crMenuEMC3(menuText, menuCode) { return null; }
function crMenuEMC4(menuText, menuCode) { return null; }
function crMenuEMC5(menuText, menuCode) { return null; }
function crMenuQGR1(menuText, menuCode) { return null; }
function crMenuQGR2(menuText, menuCode) { return null; }
function crMenuQGR3(menuText, menuCode) { return null; }
function crMenuQQL1(menuText, menuCode) { return null; }
function crMenuQQL2(menuText, menuCode) { return null; }
function crMenuQQL3(menuText, menuCode) { return null; }
function crMenuQQL4(menuText, menuCode) { return null; }
function crMenuQTT1(menuText, menuCode) { return null; }
function crMenuQTT2(menuText, menuCode) { return null; }
function crMenuQTT3(menuText, menuCode) { return null; }
function crMenuQTT4(menuText, menuCode) { return null; }
function crMenuAMI1(menuText, menuCode) { return null; }
function crMenuAMI2(menuText, menuCode) { return null; }
function crMenuAMI3(menuText, menuCode) { return null; }
function crMenuAMI4(menuText, menuCode) { return null; }
function crMenuAMC1(menuText, menuCode) { return null; }
function crMenuAMC2(menuText, menuCode) { return null; }
function crMenuAMC3(menuText, menuCode) { return null; }
function crMenuAMC4(menuText, menuCode) { return null; }
function crMenuAMC5(menuText, menuCode) { return null; }
function crMenuAMY1(menuText, menuCode) { return null; }
function crMenuAMY2(menuText, menuCode) { return null; }
function crMenuAMY3(menuText, menuCode) { return null; }
function crMenuAMY4(menuText, menuCode) { return null; }
function crMenuAAP1(menuText, menuCode) { return null; }
function crMenuAAP2(menuText, menuCode) { return null; }
function crMenuAAR1(menuText, menuCode) { return null; }
function crMenuAAR2(menuText, menuCode) { return null; }
function crMenuADB1(menuText, menuCode) { return null; }
function crMenuADB2(menuText, menuCode) { return null; }
function crMenuAIF1(menuText, menuCode) { return null; }
function crMenuAIF2(menuText, menuCode) { return null; }

function crMenuAUS1(menuText, menuCode) { return null; }