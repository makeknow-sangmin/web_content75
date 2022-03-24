    /* ECharts 사용 color */ 
    ECHART_COLORS = [
    	'#B0D698', '#3493DF', '#084695', '#FFD57E', '#979797', '#AA4643', '#FF9655', '#FFF263', '#6AF9C4', '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0', '#7FFF00', '#D2691E', '#FF7F50', '#6495ED', '#FFF8DC', '#DC143C', '#00FFFF', '#55558B', '#558B8B', '#B8860B', '#A9A9A9', '#A9A9A9', '#006400', '#BDB76B', '#8B008B', '#556B2F', '#FF8C00', '#9932CC', '#8B0000', '#E9967A', '#8FBC8F', '#483D8B', '#2F4F4F', '#2F4F4F', '#00CED1', '#9400D3', '#FF1493', '#00BFFF', '#696969', '#696969', '#1E90FF', '#B22222', '#FF69B4', '#CD5C5C', '#4B0082' 	
    ];

    var getEcItemStyle = function(pos, grad) {

    	var i = pos % ECHART_COLORS.length;
    	var color = ECHART_COLORS[i];	
    	var r = parseInt(pos / ECHART_COLORS.length);
    	var f = -0.4 - r*0.1;
		var colorE= pSBC ( f, color );
       
		var nColor, eColor;
		if(grad==true) {
			nColor = new echarts.graphic.LinearGradient(
		            1, 1, 0, 1,
		            [
		                {offset: 0, color: color},
		                {offset: 1, color: colorE}
		            ]
		        );
			eColor = new echarts.graphic.LinearGradient(
		            0, 0, 0, 1,
		            [
		                {offset: 0, color: colorE},
		                {offset: 1, color: color}
		            ]
		        );
		} else {
			nColor = colorE;
			eColor = color;
		}
		
		return {
		    normal: {
		        color: nColor,
				borderWidth: 1,
				borderColor: eColor
		    },
		    emphasis: {
			    barBorderWidth: 1,
			    shadowBlur: 10,
			    shadowOffsetX: 0,
			    shadowOffsetY: 0,
				color: eColor
		    }
		};
    }
	/// Echart 끝
	
var CHART_SRCH_COND = {};
function setChartCond(id, key, val) {
	console_logs(id + key, val);
	CHART_SRCH_COND[id + key] = val;
}

function getEchartOption() {
 return	{
		legend: {top:  35},
		tooltip: {},
		grid: {
			left: 50,
			top: 100,
			right: 80,
			bottom: 20
		},
		dataZoom: [
			{
				type: 'inside'
			}
		]
	};
}

function gotoChartMain() {
	window.location.reload();//href = loc;
}


function getEchartParam(categories, seriesAll, noPie, noMarkline, noYlabel) {
	var dimensions = [];
	var sources = [];
	var mySeries = [];

	dimensions.push('coord');
	var pies = [];
	for(var i=0; i<categories.length; i++) {
		var o = {
			coord: categories[i]
		};
		sources.push(o);
	}
	
	for(var i=0; i<seriesAll.length; i++) {
		var o = seriesAll[i];
		dimensions.push(o.name);
		mySeries.push( {itemStyle: getEcItemStyle(i, true), stack: 'one',type: 'bar',
			label: {
				normal: {
					show: false,
					position: 'inside'
				}
			},
			
			markLine : (noMarkline!=true) ? {
				data : [
					{type : 'average', name : '평균'}
				]
			} : null
		});

		var data = o.data;
		var sum = 0;
		for(var j=0; j<data.length; j++) {
			var v = data[j];
			if(v!=0) {
				(sources[j])[o.name] = v;
			} else {
				(sources[j])[o.name] = v;
			}
			sum = sum+v;
		}

		pies.push({name: o.name, value: sum, itemStyle: getEcItemStyle(i,true)});
	}

	if(noPie!=true) {
		mySeries.push(
			{
				//itemStyle: itemStyle[0],
				data: pies,
				type: 'pie',
				center: ['15%', '18%'],
				radius: ['5%', '15%'],
				roseType : 'radius',
				z: 100,
				animationEasing: 'elasticOut',
				animationDelay: function (idx) {
					return Math.random() * 200;
				},
				label: {
					normal: {
						show : false,
						textStyle: {
							color: '#555555'
						}
					}
				},
				labelLine: {
					normal: {
						show : false,
						lineStyle: {
							color: '#555555'
						},
						smooth: 0.2,
						length: 10,
						length2: 20
					}
				}
			}
		);
	}

	return {
		dimensions: dimensions,
		sources: sources, 
		series: mySeries
	};


}

function getChartCond(id, key) {
	var val = CHART_SRCH_COND[id + key];
	//console_logs(id + key, val);
	if(val==null || val==undefined) {
		switch(key) {
			case 'TIME_UNIT':
			val = 'day';
			break;
			case 'START_DATE':
			{
				var prev = new Date();
				prev.setMonth(prev.getMonth()-3);
				prev.setDate(prev.getDate() + 1);
				val = prev;
			}
			break;
			case 'END_DATE':
			{
				val = new Date();
			}
			break;
			default:
			val = null;
		}
		setChartCond(id, key, val);
	}
	return val;
}

function fPERM_DISABLING()
	{
		if(vCUR_MENU_PERM == 2) {
			return false;
		}else {
			return true;
		}
	}
	/*
	Logout 호출
	*/
	function logout() {
			var action_para = vCONTEXT_PATH + "/login.do?method=logout";// + window.location.hash;
			document.GeneralBaseForm1.action=action_para;
			document.GeneralBaseForm1.submit();
	}
	function sendRfxMessage(){

		Ext.Ajax.request({
			url: CONTEXT_PATH + '/rpims.do?method=projects',	
			scope:this,
			success : function(response, request) {
				myProject = null;
				var r = response.responseText;
				if(r!=null && r.length>0) {
					var val = Ext.JSON.decode(response.responseText);
					var projects = val.projects;
					if(projects==null) {
						Ext.MessageBox.alert('오류', '프로젝트 목록을 확인할 수 없습니다.');
					} else {
						
						for(var i=0; i<projects.length; i++) {
							var project = projects[i];
							if(vCompanyReserved4.toLowerCase()==project.identifier) {
								myProject = project;
							}
						}
						if(myProject!=null) {


							html2canvas(document.getElementById("ext-element-1"), {
								onrendered: function (canvas) {
									
						
										document.body.appendChild(canvas);
											//var space= (window.location.hash).replace('#', '');
											
											var context = canvas.getContext("2d");                    
											var imageDataURL = canvas.toDataURL('image/png');
											var ajax = new XMLHttpRequest();
										 
											
											var curId = 10000;
											
																					
											var uri = CONTEXT_PATH + '/rpims.do?method=sendfileToRpims'
													+ '&file_name=' + document.title
													+ '&group_code=' + curId
													;
											ajax.open("POST", encodeURI(uri),false);
											ajax.setRequestHeader("Content-Type", "application/upload");

											ajax.onreadystatechange = function () {
													if(ajax.readyState === XMLHttpRequest.DONE && ajax.status === 200) {
														//console.log('ajax.responseText', ajax.responseText);
														console.log('curId', curId);
														
														var outData = $.parseJSON(ajax.responseText);
														
														console.log('outData', outData);
														sended_file_name = outData.file_name;
														sended_file_url = outData.file_url;

														console.log('file_name', sended_file_name);
														console.log('file_url',  sended_file_url);

														var win = Ext.create('Hanaro.util.UserRequestWindow', {
																buttons: [{
																	text: '취소',
																	handler: function() {
																		console_logs('cancel', win)
																		if(win) {
																			win.close();
																			win=null;
																			console_logs('cancel close', win)
																		}
																		
																	}
																}, {
																	text: '전송',
																	handler: function() {
																		var form = Ext.getCmp('userRqstForm');
																		var values = form.getValues();
														
																		
																		values.file_url  = sended_file_url;
																		values.file_name = sended_file_name;
																		values.project_id = myProject.id;
																		values.identifier = myProject.identifier;
														
																		console_logs('userRqstForm values', values);
														
																		Ext.Ajax.request({
																			url: CONTEXT_PATH + '/rpims.do?method=issues',
																			params : values,
																			method: 'POST',
																			success: function(rec, op) {
																			},
																			failure: function (rec, op)  {
														
																				Ext.Msg.alert('안내', '전송에 실패하였습니다.', function() {});
														
																			}
																		});
														
																		if(win) {
																			win.close();
																			win=null;
																		}
																		
																	}
																}]
															});

														win.show(this, function() {
															var imgUrl = '<center><img  style="max-width: 100%;max-height: 100%;" + src="' + sended_file_url + '" alt="' + sended_file_name + '"></center>';
															//console_logs('imgUrl', imgUrl);
															//console_logs('reqt_win_dump_url obj', Ext.getCmp('reqt_win_dump_url'));
															Ext.getCmp('reqt_win_dump_url').update(imgUrl);
															Ext.getCmp('reqt_win_disp_name').setValue(document.title);
															//Ext.getCmp('reqt_win_title').setValue('');
															//Ext.getCmp('reqt_win_content').setValue('');
															$("#userRequest").css("pointer-events", "auto");
															$("#userRequest").removeClass("userRequestBw").addClass("userRequest");
															$("#userRequest").html('&nbsp;');
														});

														


													}
											};
											ajax.send(imageDataURL);

								}//onrendered
				
						});//html2canvas


						}
					}

					console_logs('sendRfxMessage val', val);
				} else {
					Ext.MessageBox.alert('오류', 'RPIMS 응답이 없습니다.');
				}
			},
			failure: function(result, request) {
				console.log('failure result', result);
				Ext.MessageBox.alert('오류', result);
			}
		});
		/*
		(POST) http://hosu.io:3000/issues.json

(authentification : Basin Auth) Username:hanarobot, Password$rfxsoft00

{
  "issue": {
    "project_id": 23,
    "subject": "Example",
    "priority_id": 2,
    "tracker" :2,
    "description" : "기능개선 요청합니다."
  }
}

		*/
		//var auth = 'Basic ' + btoa('hanarobot' + ':' + '$rfxsoft00');


		// Ext.data.JsonP.request({
		// 	url: 'http://hosu.io:3000/projects.json',
		// 	callbackKey: 'callback',
		// 	params: {
		// 	//	q: 'Sencha'
		// 	},
		// 	success: function(result, request) {
		// 		console.log('success result', result);
		// 		if (result.results)
		// 		{
		// 			alert(result.results[0].from_user_name + ': ' + result.results[0].text);
		// 		}
		// 	},
		// 	failure : function(response) {
		// 		alert('failure ');
		// 	}
		// });


		// Ext.Ajax.cors = true;
		// Ext.Ajax.useDefaultXhrHeader = false;
		
		// Ext.Ajax.request({
		// 	url: 'http://hosu.io:3000/projects.json',
		// 	method : 'POST',
		// 	//dataType: 'jsonp',
		// 	useDefaultXhrHeader : false,
		// 	scriptTag: true, 
		// 	scope:this,
		// 	headers : {
		// 		'authorization' : auth,
		// 		'access-control-allow-origin' : "*",
		// 		'access-control-allow-methods': '*',
		// 		'access-control-allow-headers': 'Access-Control-Allow-Headers',
		// 		"origin": 'X-Requested-With',
		// 		"content-type": 'application/json'
		// 	},
		// 	cors: true,
		// 	success : function(result, request) {	
		// 		console.log('success result', result);
		// 	},
		// 	failure: function(result, request) {
		// 		console.log('failure result', result);
		// 	}
		// });

		// $.ajax({
		// 	url: 'http://hosu.io:9024/rm_projects',
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	//dataType: 'jsonp', 
		// 	headers : {
		// 		//'authorization' : auth//,
		// 		'access-control-allow-origin' : "*",
		// 		'access-control-allow-methods': '*',
		// 		'access-control-allow-headers': 'Access-Control-Allow-Headers',
		// 		"origin": 'X-Requested-With',
		// 		"content-type": 'application/json'
		// 	},
		// 	crossDomain: true,
		// 	success: function (data, textStatus, xhr) {
		// 	  console.log(data);
		// 	},
		// 	error: function (xhr, textStatus, errorThrown) {
		// 	  console.log(errorThrown);
		// 	}
		//   });
	}

	function lfn_gotoPublic() {
		var url = vCONTEXT_PATH + '/index/main.do?viewRange=public&selectedLanguage=' + vLANG;
		this.location.href=url;	
	}

	function lfn_gotoPublicExchange() {
		var url = vCONTEXT_PATH + '/index/main.do?publicType=exchange&viewRange=public&selectedLanguage=' + vLANG;
		this.location.href=url;	
	}


	function goHome() {
		var url = vCONTEXT_PATH + '/index/main.do?publicType=home&viewRange=public&selectedLanguage=' + vLANG;
		this.location.href=url;		
	}
	function goRfxB2B() {
		var url = vCONTEXT_PATH + '/index/main.do?publicType=exchange&viewRange=public&selectedLanguage=' + vLANG;
		this.location.href=url;
	}

	function lfn_gotoGantt() {
		window.open( vCONTEXT_PATH + '/statistics/task.do?method=ganttMain&pj_combo=true&selectedLanguage=' + "ko", '_blank');
	}
			
	function getCenterPanelHeight() {
		return Ext.getCmp('mainview-content-panel').getEl().getHeight();
	}
	function getCenterPanelWidth() {
		return Ext.getCmp('mainview-content-panel').getEl().getWidth();
	}


	function getWestPanelHeight() {
		return Ext.getCmp('mainview-west-panel').getEl().getHeight();
	}
	function getWestPanelWidth() {
		return Ext.getCmp('mainview-west-panel').getEl().getWidth();
	}

	function getCenterTapPanelHeight() {
		var Cheight = Ext.getCmp('mainview-content-panel').getEl().getHeight();
		var Hheight = Ext.getCmp('mainview-head-panel').getEl().getHeight();
		var Theight = (Cheight - Hheight) - 6;
		return Theight;
	}


	function getPageSize() {
		//var height = Ext.getCmp('mainview-content-panel').getEl().getHeight();
		//return  Math.floor( (height -130 ) / 21 ) ;
		return 300;
	}
	function viewRealtimeStatus() {
		
	}

	function getMenuTitle() {
		return /*GLOBAL*/vCUR_MENU_NAME + '<small><font color=#D46B25 style="font-weight:normal;"> ' + /*GLOBAL*/vCUR_MENU_CODE + '</font></small>'; // +':'+/*GLOBAL*/vCUR_GROUP_NAME+']</small>';
	}


	function viewCalendar() {
		console_log('calendar called');
	}


	function lfn_viewDashboardSales(){

		var winName = "popupDashboard";
		var url = CONTEXT_PATH + "/popup.do?method=dashboard";
		var style = "scrollbars=no,resizable=yes, width=900,height=800";
		popupInfoWnd(url,winName,style);
	}

	function lfn_gotoHome() {
		
		var action_para = CONTEXT_PATH + "/index/main.do" + window.location.hash;
		document.GeneralBaseForm1.action=action_para;
		document.GeneralBaseForm1.submit();
		
	}

	function lfn_gotoCeoView() {

		//var url = vCONTEXT_PATH + '/ext-5.0.1/magicplm/portfolio/index.jsp';
		var url = vCONTEXT_PATH + '/view/extjs501/portfolio/index.do?method=ceoview';
		
		
		this.location.href=url;	
	}
	function lfn_gotoMenu(menu_code, service, menu_name, link_path, perm) {
		document.GeneralBaseForm1.selectedMenuId.value = menu_code;
		document.GeneralBaseForm1.selectedMenuName.value = menu_name;
		document.GeneralBaseForm1.selectedGroupId.value = service;
		//document.GeneralBaseForm1.selectedGroupName.value = /*GLOBAL*/vCUR_GROUP_NAME;
		document.GeneralBaseForm1.selectedLinkPath.value = link_path;
		document.GeneralBaseForm1.selectedMenuPerm.value = ''+ perm;
		
		//alert(document.GeneralBaseForm1.selectedMenuPerm.value);
		
		var action_para = CONTEXT_PATH + "/index/main.do" + '?viewRange=private';
		document.GeneralBaseForm1.action=action_para;
		
		document.GeneralBaseForm1.submit();
	}


	function lfn_viewDashboardProcess(){

		var winName = "popupDashboard";
		var url = CONTEXT_PATH + "/scheduler/examples/machine";
		var style = "scrollbars=no,resizable=yes, width=900,height=800";
		popupInfoWnd(url,winName,style);
	}

	function lfn_viewInputProcess(MachWorker){
		var winName = "ProcessWork" + MachWorker;
		var url = CONTEXT_PATH + "/popup.do?method=";
		
		if(MachWorker=='Machine') {
			url = url + "ProcessInput00Machine";
		} else{
			url = url + "ProcessInput00Worker";
		}
		
		//location.href = url;
		var style = "scrollbars=no,resizable=yes,width=1024,height=768";
		popupInfoWnd(url,winName,style);
	}

	function fAlert(title, content)
	{
		Ext.MessageBox.alert(title, content);	
	}
	
	Ext.define('ModalWindow', {
		 extend: 'Ext.window.Window',
		 title: 'Modal Window',
	    layout: {
	        type: 'border',
	        padding: 0
	    },
	    modal:true,
	    plain:true
	});
    
    
//Chart 다시그리기
function redrawTotalChartAll(myId) {
	console.log('hanaro.js redrawTotalChartAll', myId);
	
	var dayUit = getChartCond(myId, 'TIME_UNIT');
	var start_date = getChartCond(myId, 'START_DATE');
	var end_date = getChartCond(myId, 'END_DATE');

	// console_logs('dayUit', dayUit);
	// console_logs('start_date', start_date);
	// console_logs('end_date', end_date);
	gm.printEchart();
}

function refreshBigButton(link) {

	for(var i=0; i<gu.menuStruct.length; i++) {
		var o = gu.menuStruct[i];
		
		//메뉴하일라이트
		var menu = 'menu-' + o.menu_key;
		var menuOn = menu + 'on';

		try {
			$('.' + menuOn).removeClass(menuOn).addClass(menu);
		} catch(e) {
			console_logs('메뉴하일라이트', '오류');
			console.info(e);
		}
	}

	try {
		//메뉴하일라이트
		var menu = 'menu-' + link;
		var menuOn = menu + 'on';
		
		$('.' + menu).removeClass(menu).addClass(menuOn);
	} catch(e) {
		console_logs('메뉴하일라이트', '오류');
		console.info(e);
	}
}

function callGroupMenu(gLink, sLink) {
	
	refreshBigButton(gLink);

	for(var i=0; i<gUtil.menuStruct.length; i++) {
		var o = gUtil.menuStruct[i];
		
		
		var menu_key = o['menu_key'];
		var service_name = o['service_name'];
		var display_name = o['display_name'];
		var flag1 = o['flag1'];
		var flag2 = o['flag2'];
		var flag3 = o['flag3'];
		var flag4 = o['flag4'];
		var flag5 = o['flag5'];

		if(gLink == menu_key) {
			gm.gotoMyTab(service_name, menu_key, display_name, sLink, flag1, flag2, flag3, flag4, flag5);
			
		} else {
			
		}

	}
	
}

/*
Logout 호출
*/
function logout() {

	Ext.create("Ext.Window", {
		 title: "확인",
		 bodyStyle: "padding:20px;",
		 width:220,
		 height:150,
		 html: '로그아웃 하시겠습니까?',              
		 buttons: [
		         { text: "예", handler: function(){
		    	
			        Ext.getBody().mask('종료중입니다.');
			        this.up('window').close();
			        	
// 		        	 if (this.up('window').el.shadow) {
// 		    			this.up('window').el.shadow.hide();
// 		            }
// 		    		this.up('window').el.fadeOut({
// 		                duration: .25,
// 		                callback: this.afterHide,
// 		                scope: this
// 		            });
		     		var action_para = vCONTEXT_PATH + "/index/login.do?method=logout";// + window.location.hash;
		    		document.GeneralBaseForm1.action=action_para;
		    		document.GeneralBaseForm1.submit();
		    		
		         }},
		         {text: "아니오", handler: function(){
		        	 this.up('window').close();
		         }}
		        ]
		}).show();
	

}

	
	Ext.onReady(function(){
		
		// console.log('include post', 'document ready');
		$("body").mousemove(function(e) {
			absoluteMousePosX = e.pageX;
			absoluteMousePosY = e.pageY;
			mouseMoveFlag = true;
		});
		
		gUtil = Ext.create('Rfx.app.Util', {});
		gu = gUtil;
				
		if(strMcList!='') {
			var machineList=Ext.JSON.decode(strMcList);
			//console_logs('machineList', machineList);
			gUtil.mc_list = machineList['datas'];
			gUtil.mchnStore = Ext.create('Mplm.store.MachineStore', {} );
		}
		// console_logs('rackDivision', rackDivision);
		// if(rackDivision!=null) {
		// 	//var arr=Ext.JSON.decode(rackDivision);
		// 	//console.log('hanaro rackDivision', arr);
		// 	gUtil.rack_list0 = rackDivision['datas0'];
		// 	gUtil.rack_list1 = rackDivision['datas1'];
		// 	gUtil.rack_list2 = rackDivision['datas2'];
		// 	gUtil.rack_list3 = rackDivision['datas3'];
		// }

		console_logs('---> gUtil.rack_list0', gUtil.rack_list0);
		//TopMenu

		if(jsonMenuStruct!='') {
			var menuStruct=Ext.JSON.decode(jsonMenuStruct);
			
			gu.menuStruct = menuStruct.datas;
			gu.roleCodes =  menuStruct.roleCodes;

			console.log('================> gu.menuStruct', gu.menuStruct);

			if(vExtVersion > 5) {

				var authoItems = [];

				gu.propGrid = Ext.create('Ext.grid.PropertyGrid', {
					title: '속성',
					// padding: '0 0 0 0',
					// margin: '0 0 0 0',
					source: {
						"(unique_id)": '-1'
					},
					listeners: {
						propertychange: function (source, recordId, value, oldValue) {
							//console.log('Property Changed', Ext.String.format('From: [{0}], To: [{1}]', oldValue.toString(), value.toString()));
							var saveBtn = Ext.getCmp('authSaveBtn');
							if(saveBtn != null) {
								saveBtn.enable();
							}

						}
					}
				});

				for(var i=0; i<gu.roleCodes.length; i++) {
					var o = gu.roleCodes[i];
					//console.log('authoItems  o', o);
					authoItems.push({
						boxLabel: o.role_name + ' (' + o.role_code + ')',
						name: 'checkset',
						inputValue: o.role_code
					}); 
				}


				gu.authFormpanel = Ext.create('Ext.form.Panel', {
					title: '권한',
					margin: '10 0 10',
					autoScroll: true,
					items: [
						{
							xtype: 'fieldset',
							layout: 'anchor',
							collapsible: false,
							defaults: {
								anchor: '100%'
							},
							items: [{
								xtype: 'radiogroup',
								id: 'authTypeRadio',
								labelWidth: 60,
								fieldLabel: '권한부여 방식',
								//cls: 'x-check-group-alt',
								name: 'rb-auto',
								items: [
									{boxLabel: '선택한 그룹 만', name: 'authType', inputValue: 0},
									{boxLabel: '모두에게 권한주기', name: 'authType', inputValue: 1}
									
								],
								listeners: {
									change: function(el, newValue, oldValue) { 
										//console.log('new value is ', newValue);
										var checkSet = Ext.getCmp('authSelectFieldset');
										(newValue.authType==0) ? checkSet.enable() : checkSet.disable();

										var saveBtn = Ext.getCmp('authSaveBtn');
										if(saveBtn != null) {
											saveBtn.enable();
										}
										
									}
								}
							}]
						},
						{
							xtype: 'fieldset',
							layout: 'anchor',
							id: 'authSelectFieldset',
							collapsible: false,
							defaults: {
								anchor: '100%'
							},
							items: [{
								// Use the default, automatic layout to distribute the controls evenly
								// across a single row
								id: 'authCheckboxgroup',
								xtype: 'checkboxgroup',
								fieldLabel: '그룹선택',
								//cls: 'x-check-group-alt',
								columns: 2,
								labelWidth: 60,
								items: authoItems,
								listeners: {
									change: function() { 
										var saveBtn = Ext.getCmp('authSaveBtn');
										if(saveBtn != null) {
											saveBtn.enable();
										}
										
										
									}
								}
							}]
						}
					]
				});
			}

		}
		//console.log('==============================>', gUtil.menuStruct);
		
		if(gUtil.menuStruct == undefined || gUtil.menuStruct == null) {
	    	Ext.MessageBox.alert('알림', '시스템 사용에 필요한 권한을 확인할 수 없습니다. <br>로그인 페이지로 이동합니다.', function()	{
	     		var action_para = vCONTEXT_PATH + '/index/login.do?method=logout';// + window.location.hash;
	    		document.GeneralBaseForm1.action=action_para;
	    		document.GeneralBaseForm1.submit();
			});
			return;
		}

		createTopMenu();			
		
		if(jsonLeftMenuStruct!='') {
			var lmenuStruct=Ext.JSON.decode(jsonLeftMenuStruct);
			//console.log('lmenuStruct', lmenuStruct);
			gUtil.lmenuStruct = lmenuStruct['datas']; 
			//console.log('lmenuStruct', gUtil.lmenuStruct);
		}
		
		
		var mesProductCategory = vMesProductCategory;
		if(mesProductCategory != '') {
			var o = Ext.JSON.decode(mesProductCategory);
			console_logs('mesProductCategory o', o);
			gUtil.mesProductCategory = o['datas'];
		}
		
		var mesUsePcstpl = vMesUsePcstpl;
		gUtil.mesUsePcstpl = mesUsePcstpl;
		
		var mesStdProcess =  vMesStdProcess;
		if(mesStdProcess!='') {
			var o=Ext.JSON.decode(mesStdProcess);
			console_logs('mesStdProcess o', o);
			gUtil.mesStdProcess = o['datas'];
		}
		var mesTplProcessAll = vMesTplProcessAll;
		if(mesTplProcessAll!='') {
			var o=Ext.JSON.decode(mesTplProcessAll);
			console_logs('mesTplProcessAll o', o);
			gUtil.mesTplProcessAll = o;
		}
		console_logs('gUtil.mesTplProcessAll', gUtil.mesTplProcessAll);
		
		
		if(mesTplProcessAll == '{"result": "no-data"}') { //std process로 만들기
			gUtil.makeProcessAllFromStd();
		}
		
		var mesTplProcessBig = vMesTplProcessBig;
		//console.log('mesTplProcessBig', mesTplProcessBig);
		if(mesTplProcessBig!='') {
			var o=Ext.JSON.decode(mesTplProcessBig);
			//console.log('mesTplProcessBig', mesTplProcessBig);
			//console_logs('mesTplProcessBig o', o);
			gUtil.mesTplProcessBig = o['datas'];
		}
		
		
		gMain = Ext.create('Rfx2.app.HanaroMain', myenv);
		//Tab메뉴 선택 기능
		gMain.redrawForce = false;
		gMain.launch();
		gm = gMain;//Alias
		
		gm.printEchart();
		//설비목록 리드로우. tab만들어진 이훼 한다.
		//gUtil.redrawMcList();
		
		window.addEventListener('resize', onWindowSize);

		Ext.History.init();
		//Handle this change event in order to restore the UI to the appropriate history state
		Ext.History.on('change', function(token){
		    if(token){
		    	console_logs('==============> history token', token);
		    	var arr = token.split(':');
		    	var sLink, sGroup;
		    	console_logs('history arr', arr);
		    	
		    	if(arr.length>1 && arr[0] == 'undefined') {
		    		sLink = arr[1];
		    		sGroup = arr[1];
		    	} else {
		    		sGroup = arr[0];
		    		sLink = arr.length>1 ? arr[1] : null;
		    	}
		    	

				
				if(vCompanyReserved4 == 'ULVC01KR' && sLink==null) {
					switch(sGroup) {
						case 'produce-mgmt':
							sLink = 'DBM7';
						break;
						// case 'sourcing-mgmt':
						// break;
						case 'design-plan':
							sLink = 'VST10_CLD';
						break;
						case 'quality-manage':
							sLink = 'ASA1';
						break;
						case 'pur-stock':
							sLink = 'EPJ2_PLM';
						break;
						case 'sales-delivery':
							sLink = 'SRO1_HAN';
						break;
						case 'criterion-info':
							sLink = 'AMY2';
						break;
						case 'scm-mgmt':
							sLink = 'IFS1';
						break;
					}
					
				}
		    			    	
		    	console_logs('sGroup', sGroup);
				console_logs('sLink', sLink);
		    	callGroupMenu(sGroup, sLink);
		    	//mm.redrawAll();

		    }else{
		    	console_logs('history token', 'no token');
		    }
		});
						
	    if(vUse_workspace ==false && userInfoMsg!='') {
	    	Ext.MessageBox.alert('알림', userInfoMsg, function()	{
		    		Ext.Ajax.request({
		    			url: CONTEXT_PATH + '/index/generalData.do?method=sessionValue',
	                    params: {
	                        key: 'userInfoMsg',
	                        value: ''
	                    },
		    			success : function(result, request) {		/*window.location.reload(false); */	},
		    			failure: extjsUtil.failureMessage
		    		});	
			});
	    }
	    
	    if(vCUR_USER_ID == 'demo') {
	    	gMain.viewport.resizeRegion('north', 8);
	    	gUtil.demo();
	    }
		//console_logs('create Main', 'end');
	}); //Ext.onReady(function(){
		
		
      //TOP 메뉴를 받아오는 처리
	function createTopMenu() {
		for(var i=0; i<gu.menuStruct.length; i++) {
			var o = gUtil.menuStruct[i];
			
			if(o['linkPath']== null || o['linkPath']== ''){
				$('#ul_menu').append('<li id="li-'+o['menu_key']+'" class="menu-'+o['menu_key']+'" onClick="gMain.hashTo('+'\''+o['menu_key']+'\''+');">' + o['display_name'] + '</li>');
			}else{//top에서 다이렉트로링크하는 경우->신화 모바일 처럼
				$('#ul_menu').append('<li id="li-'+o['menu_key']+'" class="menu-'+o['menu_key']+'" onClick="window.open('+'\''+o['linkPath']+'\''+')">' + o['display_name'] + '</li>');
			}
			
		}

	}; //endof createTopmenu

      
	//property file 한글처리
	function LoadJsMessage() {
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/dispField.do?method=loadJsScript&lang=' + vLANG,
			success : function(result, request) {
				eval( result.responseText );
			},
			failure: extjsUtil.failureMessage
		});	
	}
	LoadJsMessage();

	
	var originalFormat = Ext.util.Format.date;
	Ext.override(Ext.util.Format, {
	  date: function(v, format) {
	      if (Ext.isIE && !Ext.isDate(v)) {
	          if (v && v.indexOf('T')>-1) {
	              // assume ISO format
	              v = Ext.Date.parse(v, 'Y-m-dTH:i:s.u');
	          }
	      }
	      return originalFormat(v, format);
	  }
	});
