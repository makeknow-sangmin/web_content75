var hcSpeed = null;
var hcRpm = null;
var hcMultiAcxis = null;


function drawMesChart() {
	try {
		Ext.getCmp("multifileDia").destroy()
	} catch (e) {
	}
	collapseLeftMenu();
	collapseProperty();
	try {
		viewport.remove("tempport")
	} catch (e) {
	}
	cenerLoadingPln = Ext.getCmp("mainview-content-panel");
	if (cenerLoadingPln != null) {
		cenerLoadingPln.setLoading(true)
	}
	var t = Ext.getCmp("tempport");
	if (t != null) {
		t.setLoading(true)
	}
	var n = Ext.create("Ext.calendar.App");
	var r = Ext.getCmp("mainview-content-panel");
	r.removeAll();
	var i = Ext.create("Mplm.grid.MyRoutingGrid", {});
	var s = Ext.create("Mplm.grid.MyPurchaseGrid", {});
	var o = Ext.create("Mplm.grid.MyIssueGrid", {});
	
		var centerCenter =  Ext.create('Ext.panel.Panel', {
		height: getCenterPanelHeight()/2,
	    layout:'border',
	    title: '전체현황',
	    border: false,
	    region: 'center',
	     flex:0.5,
	    layoutConfig: {columns: 2, rows:1},
	    defaults: {
	        collapsible: false,
	        split: true,
	        cmargins: '5 0 0 0',
	        margins: '0 0 0 0'
	    },
	    items: [  {
				    	border:true,
				    	height:'100%',
				    	region: 'center',
				    	contentEl: 'container-speed',
				    	flex:.5,
					    listeners : {
			            	'resize' : function(win,width,height,opt){
			                	console_logs('hcSpeed width', width);
			                	console_logs('hcSpeed height', height);
			                	if(hcSpeed!=null) {
			                		hcSpeed.setSize(width, height, false);
			                	}
			                }
					    }
				    }, {
						    region: 'east',
							contentEl: 'container-rpm',
						    flex:0.5,
						    listeners : {
			                'resize' : function(win,width,height,opt){
			                   console_logs('hcRpm width', width);
			                   console_logs('hcRpm height', height);
						       if(hcRpm!=null) {
			            			hcRpm.setSize(width, height, false);
			            	   }
	                 }
			    }
			}]

	});
	
	
	var centerMain =  Ext.create('Ext.panel.Panel', {
		height: getCenterPanelHeight()/2,
	    layout:'border',
	    title: '전체현황',
	    border: false,
	    layoutConfig: {columns: 1, rows:2},
	    defaults: {
	        collapsible: false,
	        split: true,
	        cmargins: '5 0 0 0',
	        margins: '0 0 0 0'
	    },
	    items: [  centerCenter, {
			    //title: 'Width = 250px',
				//border: false,
				    	region: 'south',
				contentEl: 'container-multi-axis',
			    flex:0.5,
			    listeners : {
	                'resize' : function(win,width,height,opt){
	                   console_logs('hcMultiAcxis width', width);
	                   console_logs('hcMultiAcxis height', height);
				       if(hcMultiAcxis!=null) {
	            			hcMultiAcxis.setSize(width, height, false);
	            	   }
	                 }
			    }
			}]

	});

	 var main1 =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
	 	id: "main1",
	    layout:'border',
	    border: true,
	    items: [centerMain]
	})
			
	r.add(main1);
	r.doLayout();
	
    var gaugeOptions = {
		credits: {
            text: 'RFxSoft',
            href: 'http://www.rfxsoft.com'
        },
        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: '오늘의 생산량'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [80],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>' +
                       '<span style="font-size:12px;color:silver">목표대비</span></div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    }));
	
    hcSpeed = $('#container-speed').highcharts();
    // The RPM gauge
    $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 5,
            title: {
                text: '생산효율'
            }
        },

        series: [{
            name: 'RPM',
            data: [1],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">* 1000 / min</span></div>'
            },
            tooltip: {
                valueSuffix: ' revolutions/min'
            }
        }]

    }));

    hcRpm = $('#container-rpm').highcharts();
    // Bring life to the dials
    setInterval(function () {
        // Speed
        var //chart = $('#container-speed').highcharts(),
            point,
            newVal,
            inc;

        if (hcSpeed) {
            point = hcSpeed.series[0].points[0];
            inc = Math.round((Math.random() - 0.5) * 100);
            newVal = point.y + inc;

            if (newVal < 0 || newVal > 100) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }

//        // RPM
//        chart = $('#container-rpm').highcharts();
//        if (chart) {
//            point = chart.series[0].points[0];
//            inc = Math.random() - 0.5;
//            newVal = point.y + inc;
//
//            if (newVal < 0 || newVal > 5) {
//                newVal = point.y - inc;
//            }
//
//            point.update(newVal);
//        }
    }, 2000);


    $('#container-multi-axis').highcharts({
   		credits: {
            text: 'RFxSoft',
            href: 'http://www.rfxsoft.com'
        },
        title: {
            text: 'Combination chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
        },
        labels: {
            items: [{
                html: 'Total fruit consumption',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Jane',
            data: [3, 2, 1, 3, 4]
        }, {
            type: 'column',
            name: 'John',
            data: [2, 3, 5, 7, 6]
        }, {
            type: 'column',
            name: 'Joe',
            data: [4, 3, 3, 9, 0]
        }, {
            type: 'spline',
            name: 'Average',
            data: [3, 2.67, 3, 6.33, 3.33],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }/*, {
            type: 'pie',
            name: 'Total consumption',
            data: [{
                name: 'Jane',
                y: 13,
                color: Highcharts.getOptions().colors[0] // Jane's color
            }, {
                name: 'John',
                y: 23,
                color: Highcharts.getOptions().colors[1] // John's color
            }, {
                name: 'Joe',
                y: 19,
                color: Highcharts.getOptions().colors[2] // Joe's color
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }*/]
    });
	
    hcMultiAcxis = $('container-multi-axis').highcharts();
    
	r.setLoading(false)
}

function mainDraw() {
	console_logs('vSYSTEM_TYPE', vSYSTEM_TYPE);
	console_logs('vSYSTEM_TYPE_SUB', vSYSTEM_TYPE_SUB);
	switch(vSYSTEM_TYPE) {
	case 'LOCAL_WS':
		switch(vSYSTEM_TYPE_SUB) {
		case 'RESERVED_SUB01'://MES
			drawMesChart();
			break;
			default:
				dreawPortal();
		}
		break;
	default:
		dreawPortal();
	}
}

//function getCombinationLayouts() {
//    var calendar = Ext.create('Ext.calendar.App');
//    return {
//        main: calendar.contents
//    };
//}

/*(G)*/vLEFT_MENU_ITEMS = [];

function getCurGroupName() {
	var group_name = vCUR_GROUP_NAME;
	
	if(group_name=='') {
		group_name = 'collab';
//		if(vSYSTEM_TYPE == 'B2B' ) {
//			group_name = 'design';
//		} else if(vSYSTEM_TYPE == 'TEAMCUBE' ) {
//			group_name = 'sales';
//		} else if(vSYSTEM_TYPE == 'PLM' ) {
//			group_name = 'sales';
//		} else{
//			group_name = 'design';
//		}
		
	}
	return group_name;
}

var mainButtons = [
	{ 
	 	xtype : "button", 
	 	text: 'Refresh',
	 	width: 138,
	 	height: 32,
	 	pressed: false,
	 	disabled: true,
	 	//iconCls: 'search', 
	 	iconAlign: 'bottom', 
	 	scale: 'small'
		,handler: function(){
			lfn_gotoHome();
		}
	}		
];

var topRightButtons = [];

var subButtons = [];

Ext.require(['*']);


function getMenuStructByServicename(svcName)
{
	for(var i=0; i<mainButtons.length; i++) {
	
		var o = mainButtons[i];
		if(svcName == o['iconCls']) {
			return o['id'];
		}
	}
	return '';
}



////Single Button Create
//function createButton(range, id, name) {
//	var randId = RandomString(10);
//	var widget = renderButtons(range,  [{_name: name, _permType: 1 }], {//客户现况
//		id: randId,
//        cls: 'floater',
//        textAlign: 'left',
//        //background: 'red',
//        width: 120
//    });
//	return widget;
//}


function renderButtons(target, configs, defaultConfig) {

    Ext.each(configs, function(config) {
    	    	
        var generateButtons = function(config) {
        	
        	//handler = menuHandler;
        	
             Ext.each(['default'], function() {

            	var btnText = '<font color=black>'+config._name+'</font>';
            	if(config._permType == 1) {//readOnly
            		 btnText = '<font color=orange>'+config._name+'</font>';
            	}
            	 
            	myRandId = RandomString(10);

            	 Ext.widget(defaultConfig.defaultType || 'button', Ext.apply({
            		id:myRandId,
                    text : btnText,
                    scale: 'medium',
                    disabled: getMenuDisabled(config._id),
                    padding: '0 0 0 5' ,
                    handler : function(menuItem) {
                    	
                    	var menu_key = menuItem.menu_key;
                    	var service_name = menuItem.service_name;

                    	var newToken = service_name + '^' + menu_key;
                    	            		 
	            		var oldToken = Ext.History.getToken();
	            		if (oldToken === null || oldToken.search(newToken) === -1) {
	                     	var o = {
	                    			type: 'OBJ_MENU',
	                    			token : newToken,
	                    			menuItem : menuItem
	                    	}
	            			gMenuItem.push(o);
	            			Ext.History.add(newToken);
	            		}else {
	                 	   	var linkPath = menuItem.linkPath;
	                	   	var displayName = menuItem.displayName;
							var permType = menuItem.permType;
							var flag1 = menuItem.flag1;
							var flag2 = menuItem.flag2;
							var flag3 = menuItem.flag3;
							var flag4 = menuItem.flag4;
							var flag5 = menuItem.flag5;
	                	   	
	                 	   	if(linkPath!=null && linkPath.length> 0) {
								   menuAction(menu_key, service_name, displayName, linkPath, permType
									, flag1, flag2, flag3, flag4, flag5);
	                	   	}
	            		}

                    }

                }, config, defaultConfig));
                
                
                

            }, this);
        };
      
        var el = target.createChild({});

        if (config.children) {
            Ext.each(config.children, function(child) {
                el = el.createChild({
                    children: [
                        {
                           tag : 'h4',
                           html: child._name
                        }
                    ]
                });
            }, this);
        } else {
            generateButtons(Ext.apply(config, {
                renderTo: el
            }));
        }
    }, this);
}



function Record2MenuObject(range, menu, toggleGroupName)
{
	//console_logs('menu', menu);
	var menu_type = menu.get('menu_type');
	var menu_key =  menu.get('menu_key');
	var service_name =  menu.get('service_name');
	var displayName =  menu.get('displayName');
	var linkPath =  menu.get('linkPath');
	var permType = menu.get('permType');
	var parentName = menu.get('parentName');
	if(linkPath == 'undefined Linkpath'/* || linkPath==null || linkPath.length==0*/) {
		linkPath = '/js/' + service_name + '/' + menu_key + '.js';
	}
	var flag1 = menu.get('flag1');
	var flag2 = menu.get('flag2');
	var flag3 = menu.get('flag3');
	var flag4 = menu.get('flag4');
	var flag5 = menu.get('flag5');

	console_log( 
		menu_type + '|' + menu_key + '|' + service_name +   '|'  + displayName + '|' + linkPath
		+ '|'  + 'flag1'
		+ '|'  + 'flag2'
		+ '|'  + 'flag3'
		+ '|'  + 'flag4'
		+ '|'  + 'flag5'
		);
	//range.createChild({  tag : 'h2', html: displayName  });

	if(vHashMenu==menu_key) {
		/*(G)*/vCUR_MENU_CODE = menu_key;
		/*(G)*/vCUR_MENU_NAME = displayName;
		/*(G)*/vCUR_LINK_PATH = linkPath;
		/*(G)*/vCUR_MENU_PERM = permType;
		/*(G)*/vFLAG1 = flag1;
		/*(G)*/vFLAG2 = flag2;
		/*(G)*/vFLAG3 = flag3;
		/*(G)*/vFLAG4 = flag4;
		/*(G)*/vFLAG5 = flag5;
	}
	
	if(menu_type =='O') {
		var randId = RandomString(10);
    	renderButtons(range,  [{_name: displayName, _id: randId+'s', _permType: permType }], {
    		id: randId,
    		linkPath: linkPath,
            cls: 'floater',
            textAlign: 'left',
            toggleGroup : toggleGroupName,
	        displayName : displayName,
	        service_name : service_name,
	        menu_key: menu_key,
	        parentName: parentName,
			permType: permType,
			flag1: flag1,
			flag2: flag2,
			flag3: flag3,
			flag4: flag4,
			flag5: flag5,
            width: 128 //'100%'
        });

	} else if(menu_type =='G') {

		var childList = menu.get('child');
		var items = [];
		for (var j=0;j<childList.length;j++){
        	var child = childList[j];
        	var _menu_type = child.menu_type;
        	var _menu_key =  child.menu_key;
        	var _service_name =  child.service_name;
        	var _displayName =  child.displayName;
        	var _linkPath =  child.linkPath;
        	var _permType = child.permType;
			var _parentName = child.parentName;
			var _flag1 = child.flag1;
            var _flag2 = child.flag2;
            var _flag3 = child.flag3;
            var _flag4 = child.flag4;
            var _flag5 = child.flag5;
        	
        	if(_linkPath == 'undefined Linkpath'/* || _linkPath==null || _linkPath.length==0*/) {
        		_linkPath = '/js/' + _service_name + '/' + _menu_key + '.js';
        	}
        	
        	if(_displayName=='-') {
        		items.push('-');
        	} else{
        		var randId = RandomString(10);
	        	items.push({
	        		id: randId,
	        		linkPath: _linkPath,
	        		text : _displayName,
	        		displayName : _displayName,
	        		menu_key: _menu_key,
	        		parentName: _parentName,
	        		service_name : _service_name,
					permType : _permType,
					flag1: _flag1,
					flag2: _flag2,
					flag3: _flag3,
					flag4: _flag4,
					flag5: _flag5,
	        		handler : function(menuItem) {

	        			var linkPath = menuItem.linkPath;
	        			var menu_key = menuItem.menu_key;
	        			var service_name = menuItem.service_name;
	        			var displayName = menuItem.displayName;
						var permType = menuItem.permType;
						var flag1 = menuItem.flag1;
						var flag2 = menuItem.flag2;
						var flag3 = menuItem.flag3;
						var flag4 = menuItem.flag4;
						var flag5 = menuItem.flag4;
	        			if(linkPath!=null && linkPath.length> 0) {
							menuAction(menu_key, service_name, displayName, linkPath, permType
								, flag1, flag2, flag3, flag4, flag5);
	        			} else {
	        			}
	        		}
	        	});	
        	}
		}
		var randId = RandomString(10);
	    renderButtons(range, [{ _name: displayName, _id: randId +'s', _permType: permType }], {
	        cls: 'floater',
	        defaultType: 'splitbutton',
	        menu : {items: items },
	        textAlign: 'left',
	        width: 128,
	        displayName : displayName,
	        toggleGroup : toggleGroupName,
	        service_name : service_name,
	        menu_key: menu_key,
	        linkPath: linkPath,
			permType: permType,
			flag1: flag1,
			flag2: flag2,
			flag3: flag3,
			flag4: flag4,
			flag5: flag5,
	        id: randId
	    });
	        	    
	    
	}
}

function drawInnerMenu(id) {
	
	/*console_logs('drawInnerMenu:id', id);*/

	/*(G)*/vCUR_GROUP_CODE = id;
	var count = document.getElementById(id).childNodes.length;

	if(count==0) {
		var pln = Ext.getCmp( 'panel' +id);
    	if(pln!=null) {
    		pln.setLoading(true);
    	}

		var range = Ext.get(id);
		//range.createChild({  tag : 'h2', html: id  });
	    var storeMenuObject = new Ext.data.Store({  model: 'MenuObject' });
	    storeMenuObject.proxy.extraParams.menuStruct = id;
	    storeMenuObject.load( function(records, operation, success) {
	    	if(success ==false) {
	    		lfn_gotoHome();
	    	} else {
                var toggleGroupName = 'tog-' + RandomString(10);
		        for (var i=0; i<records.length; i++){
		        	Record2MenuObject(range, records[i], toggleGroupName, toggleGroupName);
		        }
		        
		    	if(pln!=null) {
		    		pln.setLoading(false);
		    	}
		    	setTimeout(function(){
		    		try {
			    		Ext.get('loading').remove();
			    		Ext.get('loading-mask').fadeOut({remove:true});
		    		} catch (e){}
		    	}, 1);
	    	}
		});
		

	} else {
		//range.update('');
	}
}


function drawInnerMenuDirect(id, callSub) {

	/*(G)*/vCUR_GROUP_CODE = id;
	var name = getStructName(id);
	
	 var obj = Ext.getCmp('mainview-west-panel');
	 obj.setTitle(name); 
     obj.setLoading(true);
	 
		var range = Ext.get('leftMenuRange');
		range.update('');
		//range.createChild({  tag : 'h2', html: id  });
	    var storeMenuObject = new Ext.data.Store({  model: 'MenuObject' });
	    storeMenuObject.proxy.extraParams.menuStruct = id;
	    storeMenuObject.load( function(records, operation, success) {
	    	if(success ==false) {
	    		lfn_gotoHome();
	    	} else {
	    		var toggleGroupName = 'tog-' + RandomString(10);
		        for (var i=0; i<records.length; i++){
		        	Record2MenuObject(range, records[i], toggleGroupName);
		        }
	    	}
	    	obj.setLoading(false);
		    
	    	//Sub Menu 호출.
	    	if(callSub==true) {
			    if(/*(G)*/vCUR_LINK_PATH!=null && /*(G)*/vCUR_LINK_PATH!='') {
			    	console_log('menuAction start');
			    	menuAction(/*(G)*/vCUR_MENU_CODE, /*(G)*/getCurGroupName(), /*(G)*/vCUR_MENU_NAME, /*(G)*/vCUR_LINK_PATH);
			    	console_log('menuAction end');
			    } else {
			    	//dreawCalendar();
			    	mainDraw();
			    }
			    console_log('start setTimeout ok');
		    	setTimeout(function(){
		    		try {
			    		Ext.get('loading').remove();
			    		console_log('loading removed');
			    		Ext.get('loading-mask').fadeOut({remove:true});
			    		console_log('loading-mask removed');
		    		} catch (e){console_log('error at remove mask');console_log(e);}
		    	}, 1);
		    	console_log('end setTimeout ok');
	    	}
	    	//
	    	console_log('storeMenuObject.load ok');
		});
		
		Ext.getCmp("mainview-west-panel").expand();

//	} else {
//		//range.update('');
//	}
}


var arrStructIds = [];

function getStructName(id) {
	var name = 'unknown';
	console_log('getStructName=' + id);
	Ext.Object.each(arrStructIds, function(idx, obj){
		console_log(obj);
		console_log(idx);
		console_log('|' + obj['id'] + obj['name'] );
		if(obj['id'] == id) {
			name = obj['name'];
		}
	});
	
	return name;
}



Ext.onReady(function() {
	
	
	if(vSYSTEM_TYPE == 'PLM'/* || vSYSTEM_TYPE == 'LOCAL_WS'*/) {
		
		if(vCUR_DEPT_UID!='') { //NOT Supplier CASE
			
			subButtons.push(	{ xtype : "button", 
				text : panelSRO1047 + '[人]',
				//iconCls: 'group_go', 
				//iconAlign: 'right',
				scale: 'medium'
				,cls: 'middle-btn'
				,handler: function(){
					lfn_viewInputProcess('Worker');
				}
			});
			
			subButtons.push(	{ xtype : "button", 
				text : panelSRO1047 + '[机]',
				//iconCls: 'package_add', 
				//iconAlign: 'right',
				scale: 'medium'
				,cls: 'middle-btn'
				,handler: function(){
					lfn_viewInputProcess('Machine');
				}
			});
			
					
			Ext.create('Ext.form.Panel', {
		        renderTo: 'subButtons',
		    	 margins: '0 0 0 0',
		    	 border: false,
		    	 width:180,
	            bodyStyle: {
	            	"background-color": "#DEE8F5",
	            	"padding-top": 8,
	            	"filter=progid": "DXImageTransform.Microsoft.Gradient(GradientType=1, EndColorStr=#DEE8F5, StartColorStr=#DEE8F5)"
	            		}, 
		        items: subButtons
			});	
		}
		
		
	}

	if(vSYSTEM_TYPE == 'TEAMCUBE' ) {
		
		if(vSYSTEM_TYPE_SUB=='COMMON') {
			var arr = [];
			arr.push(	{ 
				xtype : "button",
				iconCls: 'house',
				text: 'Home',
				scale: 'small'
					,handler: function(){
						goHome();
					}
			} );
			arr.push(	{ 
				xtype : "button",
				iconCls: 'exchange',
				text: 'B2BHow',
				scale: 'small'
					,handler: function(){
						goRfxB2B();
					}
			});
			arr.push(	'-' );
			
			var objToolbar = {
					xtype: 'toolbar',
					width    : 143,
					height   : 40,
					border: false,
					items: arr
			};
			var myPannel = Ext.extend(Ext.Panel, {
				border: false,
				width    : 143,
				height   : 40,
				style    : 'margin-bottom:0px;margin-left:0px;background:#D2E0F0;',
				bodyStyle: 'padding:0px;background:#D2E0F0;',
				renderTo : 'divLogo',
				scale: 'small',
				autoScroll: false
			});
			
			new myPannel({
				items: [objToolbar]
			});
			
			
			
			
			
//			topRightButtons.push(	{ xtype : "button", 
//				text : 'B2BHow',
//				iconCls: 'exchange',
//				iconAlign: 'left',
//				scale: 'medium'
//				,cls: 'middle-btn'
//				,handler: function(){
//					lfn_gotoPublicExchange();
//				}
//			});
		} else {
			topRightButtons.push(	{ xtype : "button", 
				text : 'Public Space',
				iconAlign: 'right',
				scale: 'medium'
					,cls: 'middle-btn'
						,handler: function(){
							lfn_gotoPublic();
						}
			});
		}
		
		
	}
	
	
//	topRightButtons.push(
//		{ 
//			xtype : "button", 
//			text : panelSRO1050, 
//			iconCls: 'door_out', 
//			iconAlign: 'right', 
//			cls : 'my-big-btn',
//		 	scale: 'medium'
//			,handler: function(){
//				Ext.MessageBox.show({
//		            title: EXIT_TITLE,
//		            msg: EXIT_MESG,
//		            buttons: Ext.MessageBox.YESNO,
//		            
//		            fn: function(btn) {
//		            	var result = MessageBox.msg('{0}', btn);
//	            	        if(result=='yes') {
//	            	        	logout();
//		            	    }
//		            },
//		            //animateTarget: 'mb4',
//		            icon: Ext.MessageBox.QUESTION
//		        });
//			},
//			listeners: {
//		        render: function() {
//		           //this.addCls("x-btn-default-large");
//		        	this.addCls("x-btn-default-toolbar-big");
//		           this.removeCls("x-btn-default-toolbar-small");
//		        }
//		    }
//		}
//	);
//	
	
	

//	setTimeout(function(){
//		Ext.get('loading').remove();
//		Ext.get('loading-mask').fadeOut({remove:true});
//	}, 3);

    Ext.QuickTips.init();

    storeMenu = new Ext.data.Store({  model: 'MenuStruct' });
	storeMenu.load(function(records) {

		for(var i=0; i<records.length; i++) {
			var struct = records[i].data;
			var item = {
				menuCode: struct.menu_key,
				serviceName: struct.service_name,
			    title: struct.displayName,
			    id : 'panel' + struct.menu_key,
			    name : 'panel' + struct.menu_key,
			    html: '<div id="' + struct.menu_key + '" class="menuBackground"></div>',
			    iconCls: struct.service_name,
			    listeners: {
			        expand: function() {
			        	console_info('clicked Left Panel');
			        	var panelId = this.getId();
			        	var id = panelId.substring(5);
			        	var name = struct.displayName;
			        	
			        	console_info('Menu:' + panelId + ":" + id);

			        	//drawInnerMenu(ids);
			        }
			    }
			};
			arrStructIds.push(
					{
						id: struct.menu_key,
						name: struct.displayName
					}
			);
			/*(G)*///vLEFT_MENU_ITEMS.push(item);
			//topmenu create
			
			var group_name = getCurGroupName();
			
			var pressed = false;
			if(group_name == struct.service_name) {
				pressed = true;
			}
;
			if(mainButtons.length>0) {
				mainButtons.push('-');
			}
			
			var button =
			{ 
				id : struct.menu_key,
				toggleGroup: 'topMenus',
				pressed: pressed,
				width:68,
				height: 34,
			 	xtype : "button", 
			 	text :  struct.displayName,
			 	iconCls: struct.service_name,
			 	iconAlign: 'left',
			 	cls : 'my-big-btn',
			 	scale: 'medium'
				,handler: function(){
					//close user info
					closeUserByUserId();
					
                	var newToken = 'GROUP_MENU' + '^' + this.getId();
                	var oldToken = Ext.History.getToken();
            		if (oldToken === null || oldToken.search(newToken) === -1) {
            			 Ext.History.add(newToken);
            		} else {
            			drawInnerMenuDirect(this.getId(), false/*callSub*/);
            		}
				},
				listeners: {
			        render: function() {
			           //this.addCls("x-btn-default-large");
			        	this.addCls("x-btn-default-toolbar-big");
			           this.removeCls("x-btn-default-toolbar-small");
			        }
			    }
			};


			
			mainButtons.push(button);
		}
		
		mainButtons.push('->');
		
		if(vUseCeoview=='true') {
			mainButtons.push(
					{ 
						id : 'ceoViewBtn',
					 	xtype : "button", 
					 	text :  'CEO View',
					 	iconCls: 'eye',
					 	toggleGroup: 'topMenus',
					 	iconAlign: 'right',
					 	cls : 'my-big-btn',
					 	scale: 'medium'
						,handler: function(){
							lfn_gotoCeoView();
						},
						listeners: {
					        render: function() {
					           //this.addCls("x-btn-default-large");
					        	this.addCls("x-btn-default-toolbar-big");
					           this.removeCls("x-btn-default-toolbar-small");
					        }
					    }
					});
			mainButtons.push('-');
		}
		mainButtons.push(
				{ 
					id : 'mySpaceBtn',
				 	xtype : "button", 
				 	text :  'My Space',
				 	iconCls: 'calendar',
				 	toggleGroup: 'topMenus',
				 	iconAlign: 'right',
				 	cls : 'my-big-btn',
				 	scale: 'medium'
					,handler: function(){
						mainDraw();
					},
					listeners: {
				        render: function() {
				           //this.addCls("x-btn-default-large");
				        	this.addCls("x-btn-default-toolbar-big");
				           this.removeCls("x-btn-default-toolbar-small");
				        }
				    }
				});
		mainButtons.push('-');
		mainButtons.push(
				{ 
					xtype : "button", 
					text : panelSRO1050, 
					iconCls: 'door_out', 
					iconAlign: 'right', 
					cls : 'my-big-btn',
				 	scale: 'medium'
					,handler: function(){
						Ext.MessageBox.show({
				            title: EXIT_TITLE,
				            msg: EXIT_MESG,
				            buttons: Ext.MessageBox.YESNO,
				            
				            fn: function(btn) {
				            	var result = MessageBox.msg('{0}', btn);
			            	        if(result=='yes') {
			            	        	logout();
				            	    }
				            },
				            //animateTarget: 'mb4',
				            icon: Ext.MessageBox.QUESTION
				        });
					},
					listeners: {
				        render: function() {
				           //this.addCls("x-btn-default-large");
				        	this.addCls("x-btn-default-toolbar-big");
				           this.removeCls("x-btn-default-toolbar-small");
				        }
				    }
				}		
		);

	    // NOTE: This is an example showing simple state management. During development,
	    // it is generally best to disable state management as dynamically-generated ids
	    // can change across page loads, leading to unpredictable results.  The developer
	    // should ensure that stable state ids are set for stateful components in real apps.
	    //Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	       
//	    var items =  null;
//	    
//	    if(/*(G)*/vSAMPLE_MODE==true) {
//		    var layoutExamples = [];
//
////		    Ext.Object.each(getCombinationLayouts(), function(name, example){
////		        layoutExamples.push(example);
////		    });
//		    
//	    	items = layoutExamples;
//	    }else {
//	    	/*
//	        var calendar = Ext.create('Ext.calendar.App');
//	    	 items =  [
//	    	 {
//	            main: calendar.contents
//	        },
//	        {
//	 	    	html:'<div id="MAIN_DIV_TARGET" style="height:100%; width:100%;border-collapse: collapse;padding:0 0 0 0; ">Welcome!!!</div>'
//	 	    }
//	        ];
//	        */
//	    }
	    
	    // get a reference to the HTML element with id "hideit" and add a click listener to it
	    Ext.get("hideit").on('click', function(){
	        // get a reference to the Panel that was created with id = 'west-panel'
	        var w = Ext.get('west-panel');
	        // expand or collapse that Panel based on its collapsed property state
	        w.collapsed ? w.expand() : w.collapse();
	    });
	    
//	    var globFileuploadObj = {
//	    		id : 'globFileuploadObjId',
//	    		region: 'center',
//	    	    height: '50%',
//	    	    collapsible: false,
//	            xtype : "component",
//	            autoEl : {
//	                tag : "iframe",
//	                height: '100%',
//	        	    width: '100%',
//	        	    border: 0,
//	                src : CONTEXT_PATH + '/test/multiFileUpload.jsp',
//	                //src : CONTEXT_PATH + '/test/uploadpanel.jsp',
//	    	        frameBorder: 0
//	    	     }
//	    };
//
//	    var filePanel =  Ext.create('Ext.panel.Panel', {
//	    	title: GET_MULTILANG('property_file_text', vLANG),
//		    layout:'border',
//	        border: false,
//	        layoutConfig: {columns: 1, rows:2},
//		    defaults: {
//		        collapsible: true,
//		        split: true,
//		        cmargins: '5 0 0 0',
//		        margins: '0 0 0 0'
//		    },
//		    items: [globFileuploadObj, {
//		    	region: 'south',
//		    	collapsible: false,
//	            height: '50%',
//	            autoScroll:true
//	       }]
//		});

propertyTabPanel = new Ext.TabPanel({
	//속성
	id: 'mainview-property-panel',
    xtype: 'tabpanel',
    region: 'east',
    title: panelSRO1132,
    animCollapse: false,
    collapsible: true,
    split: true,
    width: 270, // give east and west regions a width
    minSize: 175,
    maxSize: 400,
    margins: '0 5 0 0',
    activeTab: 0,
    tabPosition: 'bottom',
    weight: 1,
    items: [{
	            id: 'mainview-property-panel-div',
	            title: GET_MULTILANG('property_detail_text', vLANG),
	            border: false,
	            autoScroll:true
	       }//,filePanel
//    		,{
//	    	   id: 'mainview-property-panel-div1',
//	    	   title: GET_MULTILANG('property_file_text', vLANG),
//	           border: false,
//	           autoScroll:true
//            }
       ]
});


viewport =
	    Ext.create('Ext.Viewport', {
	        id: 'mplmMainViewPort',
	        layout: 'border',
	        items: [
	        { //헤더
	        	//xytype: 'component',
	        	id: 'mainview-head-panel',
	            region: 'north',
	            bodyStyle: {
	            	"background-color":"#D2E0F0", 
	            	"filter=progid": "DXImageTransform.Microsoft.Gradient(GradientType=1, EndColorStr=#D2E0F0, StartColorStr=#D2E0F0)"
	            		}, 
	            cls: 'header-area',
	            margins: '5 5 5 5',
	            border: false,
	            height: 47
	            ,items: [
						
	                     {
	                    	 xytype: 'component',
	                    	 //height: 45,
	                    	 //cls: 'header-area-first',
	                    	 margins: '0 0 0 0',
	                    	 border: false,
	                    	 items:[
								
								{
									xtype: 'toolbar',
									 border: false,
									 //margins: '0 0 0 0',
									 //height: 45,
									 //width: 950,
									 items: mainButtons
								}


								]
	                     }
//						,
//	                     {
//							xtype: 'toolbar',
//							 border: false,
//	                    	 height: 39,
//	                    	 width: 92,
//	                    	 cls: 'header-area-right',
//	                    	 border: false,
//	                    	 items: topRightButtons
//	                     }
	                     
	                     ]
	        },
	        { //풋터
	            // lazily created panel (xtype:'panel' is default)
	        	id: 'mainview-south-panel',
	            region: 'south',
	            contentEl: 'south',
	            split: true,
	            height: 100,
	            minSize: 200,
	            maxSize: 300,
	            collapsible: true,
	            collapsed: true,
	            title: vCUR_DEPT_NAME + ' :: ' + vCUR_USER_NAME + ' (' + vCUR_USER_ID + ') ' + '<font size="1" face="Arial" color="#005599">....... ' + vCUR_USERTYPE + '</font>',
	            margins: '0 0 0 0'
	        },propertyTabPanel
	        , { //Left Menu
	            region: 'west',
	            stateId: 'mainview-navigation-panel',
	            id: 'mainview-west-panel', // see Ext.get() below
	            title: 'Workspace',
	            split: true,
	            width: 140,
	            minWidth: 100,
	            maxWidth: 400,
	            collapsible: true,
	            animCollapse: true,
	            collapsed: false,
	            bodyStyle: {
	            	"background-color":"#DFE8F6"
	            	//,"filter=progid": "DXImageTransform.Microsoft.Gradient(GradientType=0, EndColorStr=#F1F5FB, StartColorStr=#FFFFFF)"
	            		}, 
	            margins: '0 0 0 3',
	            layout: 'fit',
	            html: '<div id="' + 'leftMenuRange' + '" class="menuBackground" style="background:#F8F8F8;"></div>'
	        }, //center
	        {
	            id: 'mainview-content-panel',
	            region: 'center', // this is what makes this panel into a region within the containing layout
	            layout: 'card',
	            border: false,
	            bodyStyle: {
	            	"background-color":"#D0DEF0", 
	            	"filter=progid": "DXImageTransform.Microsoft.Gradient(GradientType=0, EndColorStr=#F1F5FB, StartColorStr=#FFFFFF)"
	            		}, 
	            html: ''
	       } //grid
	        ]

	    });

		console_info('/*(G)*/vCUR_GROUP_CODE=' + /*(G)*/vCUR_GROUP_CODE);
		var mainStructId ='';
		if(/*(G)*/vCUR_GROUP_CODE==null || /*(G)*/vCUR_GROUP_CODE=='') {
			if(vSYSTEM_TYPE == 'B2B' ) {
				/*(G)*/vCUR_GROUP_CODE = 'structure_C';
			} else if(vSYSTEM_TYPE == 'TEAMCUBE' ) {
				Ext.Object.each(arrStructIds, function(idx, obj){
					mainStructId = mainStructId+obj['id']+';';
				});
				var arr = mainStructId.split(';');
				/*(G)*/vCUR_GROUP_CODE = arr[0];//'structure_S';
				console_log('mainStructId' + vCUR_GROUP_CODE);
			} else if(vSYSTEM_TYPE == 'PLM' ) {
				Ext.Object.each(arrStructIds, function(idx, obj){
					mainStructId = mainStructId+obj['id']+';';
				});
				var arr = mainStructId.split(';');
				/*(G)*/vCUR_GROUP_CODE = arr[0];//'structure_S';
				console_log('mainStructId' + vCUR_GROUP_CODE);
			} else{
				/*(G)*/vCUR_GROUP_CODE = 'structure_C';
			}
			
			
		}
	    //Ext.getCmp('panel' + /*(G)*/vCUR_GROUP_CODE).expand();
		
		if(vHashLink!=null && vHashLink.length>0) {
			//sales^SQT2
			//GROUP_MENU^structure_A
			var arr = vHashLink.split('^');

    		if(arr[0]=='GROUP_MENU') {
    			vCUR_GROUP_CODE = arr[1];
    			vCUR_MENU_CODE = '';
    			vHashMenu = '';
    		} else {
    			vCUR_MENU_CODE = arr[1];
    			vHashMenu = vCUR_MENU_CODE;
    			vCUR_GROUP_CODE = getMenuStructByServicename(arr[0]);
    		}
    		try {
    			Ext.getCmp(vCUR_GROUP_CODE).toggle(true);
    		    drawInnerMenuDirect(/*(G)*/vCUR_GROUP_CODE, true/*callSub*/);    			
    		} catch(e){}

		} else {
			vCUR_GROUP_CODE = 'structure_C';
			try {
				Ext.getCmp(vCUR_GROUP_CODE).toggle(true);
			    drawInnerMenuDirect(/*(G)*/vCUR_GROUP_CODE, true/*callSub*/);
			} catch(e){}
		}
		
	    
	   /*
	   var obj = Ext.getCmp('mainview-west-panel');
	   var lo = obj.layout;
	   console_info(obj);
	   console_info(lo);
	   lo.expand(3);
	   */
	    //obj.items.key('panel' + 'structure_E').expand();
	   //lo.setActiveItem(3);

	    
	    // update the header logo date:
	    //document.getElementById('logo-body').innerHTML = new Date().getDate();

	    //Property를 가린다.
	    var w = Ext.getCmp("mainview-property-panel");
	    w.collapse();
	    
	    console_log('storeMenu.load ok');
	   
	});
	
	try {
	    document.getElementById('logo-body').innerHTML = new Date().getDate();
	} catch(e) {}
	
	console_log('onReady ok');
    
});
    
    
   