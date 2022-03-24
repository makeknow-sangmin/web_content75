
function renderStructure_C()
{
    //structure_C Range
    var range = Ext.get('structure_C');
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_IS  });
    //Issue List
    var config = [{
    	//id : 'menu_CIS42',
        _name: menu_CIS42
        }],	menu = {
            items: [{
            		id : 'menu_CIS41',
                    text: menu_CIS41
                    	,handler : genericHandler
                },{
                	id : 'menu_CIS42',
                    text: menu_CIS42
                    	,handler : genericHandler
                },
                '-',{
                	id : 'menu_CIS1',
                    text: menu_CIS1
                    	,handler : genericHandler
                }] /// ,listeners : {  'beforehide' : function() {  return false;  } }  
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120,
        id:'menu_CIS00'
    });

    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_RT  });
    config = [{
        _name: panelSRO1180
        }],	menu = {
            items: [{
            		id : 'menu_CRT3',
                    text: menu_CRT3
                    	,handler : genericHandler
                },{
                	id : 'menu_CRT4',
                    text: menu_CRT4
                    	,handler : genericHandler
                },
                '-',{
                	id : 'menu_CRT2',
                    text: menu_CRT2
                    	,handler : genericHandler
                },{
                	id : 'menu_CRT5',
                    text: menu_CRT5
                    	,handler : genericHandler
                }] /// ,listeners : {  'beforehide' : function() {  return false;  } }  
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120,
        id:'menu_CRT00'
    });


    //createButton(range, 'menu_CRT1', menu_CRT1);
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: menu_CBB1  });
    
    createButton(range, 'menu_CBB1', menu_CBB1);
    
    //createButton(range, 'menu_CBB2', menu_CBB2);
}

function renderStructure_D()
{
    //structure_D Range
    var range = Ext.get('structure_D');
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_BM  });

    createButton(range, 'menu_DBM1', menu_DBM1);
    createButton(range, 'menu_PMT1', menu_PMT1);
    createButton(range, 'menu_DBM5', menu_DBM5);
    
    //createButton(range, 'menu_DBM7', menu_DBM7);
    
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_DP  });
   //createButton(range, 'menu_DDP2', menu_DDP2);
    
    createButton(range, 'menu_DDP1', menu_DDP1);

    
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_DW  });

    createButton(range, 'menu_DDW3', menu_DDW3);
    
    var config = [{
        _name: menu_DDW0
        }],	menu = {
            items: [{
            		id : 'menu_DDW1', //个人图档
                    text: menu_DDW1
                    	,handler : genericHandler
                },
                '-',{
                	id : 'menu_DDW2',//共享图档
                    text: menu_DDW2
                    	,handler : genericHandler
                }] // ,listeners : {  'beforehide' : function() {  return false;  } }  
    };
    renderButtons(range, config, {
    	id : 'menu_DDW0',
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    });

    //중메뉴range.createChild({  tag : 'h2', html: group_menu_PR  });

    createButton(range, 'menu_PPR1', menu_PPR1);

}

function renderStructure_S()
{
    //structure_S Range
    var range = Ext.get('structure_S');
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_CS  });

    createButton(range, 'menu_SCS1', menu_SCS1);

    //createButton(range, 'menu_SCS2', menu_SCS2);
    
    //Model
    createButton(range, 'menu_SMD1', menu_SMD1);
    
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_PD  });
    createButton(range, 'menu_SPD1', menu_SPD1);
    //createButton(range, 'menu_SPD3', menu_SPD3);
    createButton(range, 'menu_SPS1', menu_SPS1);

    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_RO  });

    //createButton(range, 'menu_SQT2', menu_SQT2);
    createButton(range, 'menu_SRO1', menu_SRO1);
    //createButton(range, 'menu_SRO2', menu_SRO2);
//
//	config = [{
//        _name: menu_SRO1
//        }],	menu = {
//            items: [{
//            		id : 'menu_SRO1', //订单现况
//                    text: menu_SRO1
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_SRO2',//订单录入
//                    text: menu_SRO2
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });

//
//    config = [{
//        _name: menu_SDL1
//        }],	menu = {
//            items: [{
//            		id : 'menu_SDL1', //纳品现况
//                    text: menu_SDL1
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_SDL2',//纳品生成
//                    text: menu_SDL2
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });

    
    createButton(range, 'menu_SDL1', menu_SDL1);
    
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_VO  });

//    config = [{
//        _name: menu_SVO1
//        }],	menu = {
//            items: [{
//            		id : 'menu_SVO1', //VOC现况
//                    text: menu_SVO1
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_SVO2',//VOC录入
//                    text: menu_SVO2
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });

    createButton(range, 'menu_SVO1', menu_SVO1);


}

function renderStructure_P()
{
    //structure_S Range
    var range = Ext.get('structure_P');
    //중메뉴
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_MT  });
    createButton(range, 'menu_PMT11', menu_PMT1);

//    var config = [{
//        _name: menu_PMT3
//        }],	menu = {
//            items: [{
//            		id : 'menu_PMT3', //登陆标准资材
//                    text: menu_PMT3
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_PMT4',//Excel上传
//                    text: menu_PMT4
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });

    createButton(range, 'menu_PMT4', menu_PMT4);
    
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_PR  });
    createButton(range, 'menu_PPR3', menu_PPR3);
    
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_PO  });

    createButton(range, 'menu_PMS1', menu_PMS1);
    
    config = [{
        _name: menu_SRO1
        }],	menu = {
            items: [{
            		id : 'menu_PPO2', //订单别现况
                    text: menu_PPO2
                    	,handler : genericHandler
                },
                '-',{
                	id : 'menu_PPO3',//订单详细现况
                    text: menu_PPO3
                    	,handler : genericHandler
                }] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    });

   // createButton(range, 'menu_PPO1', menu_PPO1);
    
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_SP  });

    createButton(range, 'menu_PSP1', menu_PSP1);
    
   // createButton(range, 'menu_PSP2', menu_PSP2);
}

function renderStructure_E()
{ 
	var range = Ext.get('structure_E');
    //중메뉴 PJ	工程
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_PJ  });
//
//    var config = [{
//        _name: menu_ESC3
//        }],	menu = {
//            items: [{
//            		id : 'menu_EPJ3', //工程登录 
//                    text: menu_EPJ3
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_EPJ4',//工程人员
//                    text: menu_EPJ4
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });    
//
//    createButton(range, 'menu_EPC2', menu_EPC2);

    createButton(range, 'menu_EPJ1', menu_EPJ1);               //请求现况 
    
    //중메뉴 PC	工序
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_PC  });  //group_menu_PC:工程
    createButton(range, 'menu_EPC1', menu_EPC1);               //menu_EPC1:工序指定      from from from from from from from from from from..............................
    createButton(range, 'menu_EPC3', menu_EPC3);               //menu_EPC3:工程进行现况


    //중메뉴 SC	日程
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_SC  });

//    config = [{
//        _name: menu_EPC5
//        }],	menu = {
//            items: [{
//            		id : 'menu_EPC5', //作业实绩现况
//                    text: menu_EPC5
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_EPC4',//作业实绩登录
//                    text: menu_EPC4
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });  

    createButton(range, 'menu_EPC5', menu_EPC5);
    

//    config = [{
//        _name: menu_ESC4
//        }],	menu = {
//            items: [{
//            		id : 'menu_ESC4', //进行现况
//                    text: menu_ESC4
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_ESC5',//对比目标延迟
//                    text: menu_ESC5
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    }); 

    //중메뉴 MC	设备
    //중메뉴range.createChild({  tag : 'h2', html: group_menu_MC  });

//    config = [{
//        _name: menu_EMC1
//        }],	menu = {
//            items: [{
//            		id : 'menu_EMC1', //设备现况
//                    text: menu_EMC1
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_EMC2',//设备登录
//                    text: menu_EMC2
//                    	,handler : genericHandler
//                },{
//                	id : 'menu_EMC3',//报废处理
//                    text: menu_EMC3
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    }); 

    createButton(range, 'menu_EMC1', menu_EMC1);

//    config = [{
//        _name: menu_EMC5
//        }],	menu = {
//            items: [{
//            		id : 'menu_EMC5', //维修现况
//                    text: menu_EMC5
//                    	,handler : genericHandler
//                },
//                '-',{
//                	id : 'menu_EMC4',//维修登录
//                    text: menu_EMC4
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    }); 

    createButton(range, 'menu_EMC5', menu_EMC5);
    	

}

function renderStructure_Q()
{
	var range = Ext.get('structure_Q');
	//입고
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_GR  });

	var config = [{
        _name: menu_QGR2
        }],	menu = {
            items: [{
            		id : 'menu_QGR2', //入库现况	입고현황
                    text: menu_QGR2
                    	,handler : genericHandler
                },
                '-', {
                	id : 'menu_QGR3',//取消入库现况	입고취소현황
                    text: menu_QGR3
                    	,handler : genericHandler
                }] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 

    createButton(range, 'menu_QGR1', menu_QGR1);
    
	//품질
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_QL  });
	
//	config = [{
//        _name: menu_QQL2
//        }],	menu = {
//            items: [{
//            		id : 'menu_QQL2', //不良现况
//                    text: menu_QQL2
//                    	,handler : genericHandler
//                },
//                '-', {
//                	id : 'menu_QQL1',//不良登录
//                    text: menu_QQL1
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    }); 

	createButton(range, 'menu_QQL2', menu_QQL2);
	
	config = [{
        _name: menu_QQL3
        }],	menu = {
            items: [{
            		id : 'menu_QQL3', //纳期遵守率
                    text: menu_QQL3
                    	,handler : genericHandler
                },
                '-', {
                	id : 'menu_QQL4',//供应商别品质评价
                    text: menu_QQL4
                    	,handler : genericHandler
                }] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 


	//시사출
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_TT  });

//	config = [{
//        _name: menu_QTT2
//        }],	menu = {
//            items: [{
//            		id : 'menu_QTT2', //试模现况
//                    text: menu_QTT2
//                    	,handler : genericHandler
//                },
//                '-', {
//                	id : 'menu_QTT1',//试模登录
//                    text: menu_QTT1
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    }); 

    createButton(range, 'menu_QTT2', menu_QTT2);

//	config = [{
//        _name: menu_QTT4
//        }],	menu = {
//            items: [{
//            		id : 'menu_QTT4', //试模评价履历
//                    text: menu_QTT4
//                    	,handler : genericHandler
//                },
//                '-', {
//                	id : 'menu_QTT3',//试模评价登录
//                    text: menu_QTT3
//                    	,handler : genericHandler
//                }] 
//    };
//    renderButtons(range, config, {
//        cls: 'floater',
//        defaultType: 'splitbutton',
//        menu : menu,
//        textAlign: 'left',
//        width: 120
//    });

    
    createButton(range, 'menu_QTT4', menu_QTT4);
}

function renderStructure_A()
{
	var range = Ext.get('structure_A');
	
	//基准情报
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_MI  });
	var config = [{
        _name: menu_AMI1
        }],	menu = {
            items: [{
            		id : 'menu_AMI1', //公司情报
                    text: menu_AMI1
                    	,handler : genericHandler
                },{
                	id : 'menu_AMI2',//裁决表格
                    text: menu_AMI2
                    	,handler : genericHandler
                },{
                	id : 'menu_AMI3',//公司标志
                    text: menu_AMI3
                    	,handler : genericHandler
                },{
                	id : 'menu_AMI4',//公司电子签章
                    text: menu_AMI4
                    	,handler : genericHandler
                }
                ] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 
    
    createButton(range, 'menu_AUS1', menu_AUS1);
    
	//基准代码
	//중메뉴range.createChild({  tag : 'h2', html: menu_AMC1  });
	config = [{
        _name: menu_AMC1
        }],	menu = {
            items: [{
            		id : 'menu_AMC1', //代码体制
                    text: menu_AMC1
                    	,handler : genericHandler
                },{
                	id : 'menu_AMC2',//标准材质名称
                    text: menu_AMC2
                    	,handler : genericHandler
                },{
                	id : 'menu_AMC3',//标准后处理名称
                    text: menu_AMC3
                    	,handler : genericHandler
                },{
                	id : 'menu_AMC4',//分类体制
                    text: menu_AMC4
                    	,handler : genericHandler
                },{
                	id : 'menu_AMC5',//标准工时代码
                    text: menu_AMC5
                    	,handler : genericHandler
                }, {
                	id : 'group_menu_MC',//설비/Machine
                    text: group_menu_MC
                    	,handler : genericHandler
                }
                ] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 
    

    
    
    
    
    
	//个人信息
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_MY  });
	config = [{
        _name: menu_AMY1
        }],	menu = {
            items: [{
            		id : 'menu_AMY1', //个人信息
                    text: menu_AMY1
                    	,handler : genericHandler
                },{
                	id : 'menu_AMY2',//标准工程设定	
                    text: menu_AMY2
                    	,handler : genericHandler
                },{
                	id : 'menu_AMY3',//密码修改
                    text: menu_AMY3
                    	,handler : genericHandler
                },{
                	id : 'menu_AMY4',//查看公司信息
                    text: menu_AMY4
                    	,handler : genericHandler
                }
                ] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 
    
	//结算
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_ARAP  });
	config = [{
        _name: group_menu_ARAP
        }],	menu = {
            items: [{
            		id : 'menu_AAP1', //报销单
                    text: menu_AAP1
                    	,handler : genericHandler
                },{
                	id : 'menu_AAP2',//未报销内容
                    text: menu_AAP2
                    	,handler : genericHandler
                },{
                	id : 'menu_AAR1',//收款计划树立
                    text: menu_AAR1
                    	,handler : genericHandler
                },{
                	id : 'menu_AAR2',//待收款现况
                    text: menu_AAR2
                    	,handler : genericHandler
                }
                ] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 

	//ERP库存接口
	//중메뉴range.createChild({  tag : 'h2', html: group_menu_IF  });
	config = [{
        _name: group_menu_ARAP
        }],	menu = {
            items: [{
            		id : 'menu_AIF1', //联动设置
                    text: menu_AIF1
                    	,handler : genericHandler
                },{
                	id : 'menu_AIF2',//联动履历
                    text: menu_AIF2
                    	,handler : genericHandler
                }] 
    };
    renderButtons(range, config, {
        cls: 'floater',
        defaultType: 'splitbutton',
        menu : menu,
        textAlign: 'left',
        width: 120
    }); 
	
}
