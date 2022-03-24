Ext.define('Rfx2.app.HanaroMain', {
	extend: 'Rfx2.app.AbsMainBase',
	requires : [ 'Hanaro.util.SessionChecker' ],

	name : 'HanaroMES1',
	northHeight : 84,
	bodyPadding : 5,

	constructor : function(config) {

		this.defToken = config['defToken'];
		this.setDefalultEnv(config);


		// //세션 종료시간 설정
		// SessionChecker.init(2);
		// //Ajax Request가 완료될때의 이벤트를 리스닝
		// Ext.Ajax.on('requestcomplete', function (conn, response, options) {
		// 	console.log('requestcomplate 이벤트 감지 SessionChecker 시작');
		// 	//Request URL을 파라미터로 넘김
		// 	SessionChecker.start(options.url);
		// });

		// //테스트용 Ajax
		// Ext.Ajax.request({
		// 	url : 'remain.html',
		// 	success : Ext.emptyFn,
		// 	failure : Ext.emptyFn
		// });

		this.callParent(arguments);

	},
	lastMenu : {
		'quality-manage' : 'SPC3',
		'sales-delivery' : 'SRO1_HAN',
		'produce-mgmt' : 'EPC5',						
		'design-plan' : 'DBM7',
		'pur-stock' : 'SPC3',
		'criterion-info' : 'CBB1'
	},
	
	hashTo : function(link) {

		var pre = link.substring(0, 1);
		if (pre == '#') {
			link = link.substring(1);
		}

		console_logs_o(this, '<HanaroMain> ############## hashTo link : ', link);

		Ext.getBody().mask('잠시만 기다려주세요.');
		
		this.setEnv('link', link);
		Ext.Ajax.request({
					url : CONTEXT_PATH
							+ '/userMgmt/user.do?method=log',
					params : {
						link : link
					},
					success : function(result, request) {
						var url = CONTEXT_PATH + '/index/main.do';
						window.location.href = url;
					}
				});

	},
	
	// 사용자가 소메뉴 선택시 발생하는 이벤트
	selChangeMenu : function(rec) {
		//console_logs_o(this, '<HanaroMain> ======>>>>>>>>> selChangeMenu', rec);
		this.selectedMenuRecord = rec;
		this.selMainPanelCenter = this.selMainPanel.center;
		this.setSelNode(rec);

		var id = rec.get('id');
		var name = rec.get('name');
		var link = rec.get('link');
		this.selLink = link;
		var className = rec.get('className');
		var classId = rec.get('classId');
		var obj = Ext.getCmp(this.selectedMenuId);

		this.menuPermFn();

		this.selMainPanelName = name;

		Ext.getBody().mask('잠시만 기다려주세요.');

		if (obj == undefined || obj == 'undefined'	|| obj == null) {

			var myLink = '';
			if(this.getMulti_grid(link)=='N') {
				myLink = link;
			} else {
				myLink = link + '#%';
			}
			//console_logs_o(this, '<HanaroMain> myLink', myLink);
			this.extFieldColumnStore.load({
					params : {
						menuCode : myLink
					},
					callback : function(in_records, operation,	success) {
						var records = [];
						var records_map = {};
						if(in_records!=null && in_records.length>0) {
							for(var i=0 ; i<in_records.length; i++) {
								var o = in_records[i];

								var menu_code = o.get('menu_code');
								if(menu_code == link) {
									records.push(o);
								}
								var arr = menu_code.split('#');
								if(arr.length>0) {
									var key = arr[1];
									if(key!=undefined) {
										records_map[arr[1]] = [];
									}
									
								}
								
							}
							for(var i=0 ; i<in_records.length; i++) {
								var o = in_records[i];
								//console_logs_o(this, '<HanaroMain> in_records o ', o);
								var menu_code = o.get('menu_code');
								var arr = menu_code.split('#');
								if(arr.length>0) {
									var key = arr[1];
									if(key!=undefined) {
										records_map[key].push(o);
									}
									
								}
								
							}
							//console_logs_o(this, '<HanaroMain> records_map', records_map);
						}
					
						if (success == true) {
								console_logs_o(this, '<HanaroMain> selChangeMenu records', records);
								console_logs_o(this, '<HanaroMain> selChangeMenu records_map', records_map);
								this.addToCenterTab(records, records_map);
								

							} else {// endof if(success..
								Ext.MessageBox
										.show({
											title : '연결 종료',
											msg : '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
											buttons : Ext.MessageBox.OK,
											// animateTarget:
											// btn,
											scope : this,
											icon : Ext.MessageBox['ERROR'],
											fn : function() {

											}
										});
							}
							Ext.getBody().unmask();
							//this.setCenterLoading(false);

							// console_logs('====> gm.leftTreeMenu', gm.leftTreeMenu);
							// if(gm.leftTreeMenu!=null) {
							// 	//var treeNode = gm.leftTreeMenu.getStore().getNodeById(this.selLink);
							// 	gm.leftTreeMenu.getSelectionModel().select(rec);
							// }
						},// callback
						scope : this
					});
		} else { // endofif
			this.selPanel = obj;
            try {
                this.selMainPanelCenter.setActiveItem((vEDIT_MODE==true) ? this.selectedMenuId + '-editMode' : this.selectedMenuId );
            } catch (error) {
                this.selMainPanelCenter.setActiveItem(this.selectedMenuId );
			}
			Ext.getBody().unmask();
			//this.setCenterLoading(false);

			try {
				this.selPanel.callbackLoadCenterPanel(this, obj, this.selectedMenuId);
			} catch(e) {
				console_log('this.callbackLoadCenterPanel callDefLoad', e);
			}
			

		}
	},
	hashTo8 : function(link, linkPath, rec) {
		console_logs('<Rfx2 AbsMainBase> ############## hashTo link : ', link);
		console_logs('<Rfx2 AbsMainBase> ############## hashTo linkPath : ', linkPath);
		console_logs('<Rfx2 AbsMainBase> ############## hashTo rec : ', rec);
		var pre = link.substring(0, 1);
		if (pre == '#') {
			link = link.substring(1);
		}


		// 디포트 서브메뉴만들기
		var arr = link.split(':');

		// this.setEnv(/*"MY_ENV", JSON.stringify(myEnv)*/);
		this.setEnv('link', link);

		if (this.getSaveAutoRefresh() == false) {
			var url = CONTEXT_PATH + '/index/main.do' + '#'
					+ link;
			window.location = url;
			return;
		}

		if(vSYSTEM_TYPE == 'HANARO' && arr.length==1) {
			switch(arr[0]) {
				case 'project-total':
				break;
				default:
				return;
			}
		}

		console_logs('==============> rec', rec.get('callLink'));
		if(rec.get('callLink')!=false) {
			window.location.hash = '#' + link;
		}
	

		Ext.Ajax.request({
			url : CONTEXT_PATH + '/userMgmt/user.do?method=log',
			params : {
				link : link
			},
			success : function(result, request) {
				if(vSYSTEM_TYPE == 'HANARO') {
					var arr = link.split(':');
					gm.printEchart(arr[0]);
					
				}

			}
		});

		try {
			if(mm!=null) {
				mm.redrawAll();
			}
		} catch(e) {
			console_logs('<Rfx2 AbsMainBase> mm.redrawAll(); e', e);
		}
	},
	printStock: function(target, class_code, dataCount, row, title, unique_id) {
		var area_code = (unique_id!=null) ? unique_id : class_code;
		var segName = class_code + ' Rack (' + title + ')';
		//console_logs('segName', segName);
		var chartTarget = document.getElementById(target);
		
		var data = [];
		var startTime = + new Date();
		var categories = [ ];
		for (var n=0; n<row; n++) {
			categories.push(n+1);
		}
		var types = [
			{id: -1, code: '', name: ''},
			{id: 100, code: 'A', name: 'A Project'},
			{id: 110, code: 'B', name: 'B Project'},
			{id: 120, code: 'C', name: 'C Project'},
			{id: 130, code: 'D', name: 'D Project'},
			{id: 140, code: 'E', name: 'E Project'},
			{id: 150, code: 'F', name: 'F Project'},
			{id: 160, code: 'G', name: 'G Project'},
			{id: 170, code: 'H', name: 'H Project'},
			{id: 180, code: 'I', name: 'I Project'},
			{id: 190, code: 'J', name: 'J Project'},
			{id: 200, code: 'K', name: 'K Project'},
			{id: 210, code: 'L', name: 'L Project'},
			{id: 220, code: 'M', name: 'M Project'},
			{id: 230, code: 'N', name: 'N Project'},
			{id: 240, code: 'O', name: 'O Project'},
			{id: 250, code: 'P', name: 'P Project'},
			{id: 260, code: 'Q', name: 'Q Project'},
			{id: 270, code: 'R', name: 'R Project'},
			{id: 280, code: 'S', name: 'S Project'},
			{id: 290, code: 'T', name: 'T Project'},
			{id: 300, code: 'U', name: 'U Project'},
			{id: 310, code: 'V', name: 'V Project'},
			{id: 320, code: 'W', name: 'W Project'},
			{id: 330, code: 'X', name: 'X Project'},
			{id: 340, code: 'Y', name: 'Y Project'},
			{id: 350, code: 'Z', name: 'X Project'},
			{id: 360, code: 'A1', name: 'A1 Project'},
			{id: 370, code: 'A2', name: 'A2 Project'},
			{id: 380, code: 'A3', name: 'A3 Project'},
			{id: 390, code: 'A4', name: 'A4 Project'},
			{id: 400, code: 'A5', name: 'A5 Project'}
		];
		
		// Generate mock data
		echarts.util.each(categories, function (category, index) {
			var baseTime = startTime;
			for (var i = 0; i < dataCount; i++) {
				var pos = Math.round(Math.random() * (types.length - 1));
				var typeItem = types[pos];
				pos = pos-1;
				var duration = 100000;
				//var class_code = ''+ (i+1);

				
			
				var class_code = area_code + '-' + category + '-' + (i+1);

				var pj_uid = pos<0 ? -1 : typeItem.id;
				var pj_name = pos<0 ? '' : typeItem.name;

				data.push({
					class_code: class_code,
					pj_uid: pj_uid,
					name: pj_name,
					value: [
						index,
						baseTime,
						baseTime += duration,
						duration
					],

					itemStyle: pos<0 ? {
						normal : {
							opacity: 1,
							color: '#FDFDFD',
							borderWidth: 1,
							borderColor: '#A0A0A0',
						}
					} : getEcItemStyle(pos, false)
				});

				baseTime += 10000;
			}
		});

		function renderItem(params, api) {
			var categoryIndex = api.value(0);
			var start = api.coord([api.value(1), categoryIndex]);
			var end = api.coord([api.value(2), categoryIndex]);
			var height = api.size([0, 1])[1] * 0.9;
			var rectShape = echarts.graphic.clipRectByRect({
				x: start[0],
				y: start[1] - height / 2,
				width: end[0] - start[0],
				height: height
			}, {
				x: params.coordSys.x,
				y: params.coordSys.y,
				width: params.coordSys.width,
				height: params.coordSys.height
			});
			return rectShape && {
				type: 'rect',
				shape: rectShape,
				style: api.style()
			};
		}

		option = {
			//width: '100%',
			// toolbox: {
			// 	show: true,
			// 	language: 'ko',
			// 	right: 30,
			// 	feature: {
			// 		//dataView: {readOnly: true, title: '데이타'},
			// 		//restore: {},
			// 		saveAsImage: {
			// 			title: '이미지'
			// 		}
			// 	}
			// },
			tooltip: {
				formatter: function (params) {
					//console_logs('params', params);
					if(params.data.class_code=='') {
						return '';
					} else {
						return params.name + ' : ' + params.data.class_code;
					}
					
				}
			},
			// legend: {
			// 	orient: 'vertical',
			// 	left: 'top',
			// 	show: true,
			// 	type: 'plain',
			// 	data: categories
			// },
			title: {
				text: segName,
				textStyle: {
					fontWeight: 'bolder',
					fontSize: 14
				}//,
				//left: 'center'
			},
			// dataZoom: [{
			//     type: 'slider',
			//     filterMode: 'weakFilter',
			//     showDataShadow: false,
			//     top: 550,
			//     height: 10,
			//     borderColor: 'transparent',
			//     backgroundColor: '#e2e2e2',
			//     handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
			//     handleSize: 20,
			//     handleStyle: {
			//         shadowBlur: 6,
			//         shadowOffsetX: 1,
			//         shadowOffsetY: 2,
			//         shadowColor: '#aaa'
			//     },
			//     labelFormatter: ''
			// }, {
			//     type: 'inside',
			//     filterMode: 'weakFilter'
			// }],
			grid: {
				height: '90%',
				width: '100%',
				left: 0,
				top: 25,
				right: 0,
				bottom: 0
			},
			xAxis: {
				show: false,
				min: startTime,
				scale: true,
				axisLabel: {
					formatter: function (val) {
						return Math.max(0, val - startTime) + ' ms';
					}
				}
			},
			yAxis: {
				//scale: true,
				show: false,
				data: categories,
				axisLabel : {
				    show: true,
				    interval: 100
				}
			},
			series: [{
				type: 'custom',
				renderItem: renderItem,
				itemStyle: {
					normal: {
						opacity: 0.85
					}
				},
				encode: {
					x: [1, 2],
					y: 0
				},
				label: {
					normal: {
						show: true,
						position: 'inside',
						formatter:  function (params){
							var data = params.data;
							var pi_uid = data.pj_uid>-1 ?  '(' + data.pj_uid + ')' : '';
							return data.class_code + '\n' + data.name + '\n' + pi_uid;
						},
						fontSize: 12,
						color: 'black'
					}
				},
				data: data
			}]
		};

		var myChart = echarts.init(chartTarget);
		// Enable data zoom when user click bar.
		var zoomSize = 6;
		myChart.on('click', function (params, a, b) {
			var data = params.data;
			var class_code = data.class_code;
			var name = data.name;
			var pj_uid = data.pj_uid;
			var id = data.value[0];

			if(class_code=='') {
				return;
			} else {
				var msg 
				= 			'id = ' + id
				+ '<br>' + 	'class_code = ' + class_code
				+ '<br>' + 	'name = ' + name
				+ '<br>' + 	'pj_uid = ' + pj_uid;
	
				Ext.MessageBox.alert('Info', msg, callBack);
				function callBack(id) {
					console_logs('id', id);
				}
			}

		
			// console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
			// console.log('params', params);
			// console.log('dataAxis', dataAxis);
			// console.log('data1', data1);
			// myChart.dispatchAction({
			//     type: 'dataZoom',
			//     startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
			//     endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data1.length - 1)]
			// });
		});
		// use configuration item and data specified to show chart
		myChart.setOption(option);

		window.onresize = function() {
			myChart.resize();
		};
		// var zoomSize = 6;
		// myChart.on('click', function (params) {
		//     console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		//     myChart.dispatchAction({
		//         type: 'dataZoom',
		//         startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
		//         endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
		//     });
		// });
	},
	refreshGeneral: function(myId, data_type) {
		
		console_logs('myId', myId);
		console_logs('data_type', data_type);

		var target = 'container'+ myId;
		var chartTarget = document.getElementById(target);

		var type = '';
		var xName = '';
		var yName = '';
		var dataName = '';

		var start_date = gu.yyyymmdd(getChartCond(myId, 'START_DATE'));
		var end_date =   gu.yyyymmdd(getChartCond(myId, 'END_DATE'));
		var time_unit = 	 getChartCond(myId, 'TIME_UNIT');

		var call_url = null;
		var chartName = '';
		switch(myId) {
			case 'criterion-info':
				type = 'column'
				xName = '연월일';
				yName = '접속 건수';
				dataName = '접속건수';
				call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticLogin';
				chartName = '접속 명령 건수 추이';
				break;
			case 'equip-state':
				call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticMachine';
				chartName = '설비 이상 추이';
				break;
			case 'produce-mgmt':
				call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticProduction';
				chartName = '제품 생산 추이';
				break;
			case 'pur-stock':
				call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticStock';
				chartName = '자재 입출고 추이';
				break;
			case 'design-plan':
				call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticDesign';
				chartName = 'BOM 등록 추이';
				break;
			case 'quality-manage':
				type = 'line';
				xName = '시간(times)';
				yName = '불량 건수';
				dataName = '불량건수';
				call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticDefect&data_type=' + data_type;
				chartName = ((data_type=='QLP') ? '자재' : '제품') + '불량 발생 추이';
				break;
		}

		console_logs('refreshGeneral', chartName);


		Ext.Ajax.request({
			url: call_url,				
			params:{
				start_date: start_date,
				end_date : end_date,
				time_unit : time_unit
			},
			success : function(response, request) {

				// console_logs('refreshToolbarPathCore8 toolbar toolbarId', toolbarId);
				// var subToolbar = Ext.getCmp(toolbarId);
				// console_logs('AbsMainBase subToolbar', subToolbar);
				// if(subToolbar!=null) {
				// 	//subToolbar.setVisible(true);
				// }

				var val = Ext.JSON.decode(response.responseText);
				var list = val.datas;
				var listSeries = val.series;
				var listCat =  val.categories;
				console_logs('val', val);
				console_logs('listSeries', listSeries);
				console_logs('list', list);
				console_logs('listCat', listCat);

				var categories = [];
				for(var i=0; i<listCat.length; i++) {
					var s = listCat[i];
					var s1 = s.substring(4,6)+'/'+s.substring(6,8);
					categories.push(s1)
				}

				var seriesAll = [];

				//시리즈 오브젝트 생성
				for(var i=0; i<listSeries.length; i++) {
					var key = listSeries[i];
					var arr = key.split(':');
					seriesAll.push({
						series: key,
						name: arr[1],
						key: arr[0],
						data: []
					});
				}
				//카테고리 수만큼 초기화0 함
				for(var i=0; i<categories.length; i++) {
					for(var j=0; j<seriesAll.length; j++) {
						var s = seriesAll[j];
						s.data.push(0);
					}
				}

				for(var i=0; i<list.length; i++) {
					var o = list[i];
					//console_logs('o', o);
					var key1 = o.key1;
					var s1 = key1.substring(4,6)+'/'+key1.substring(6,8);
					var series = o.series;
					var val1 = o.val1;
					if(series!=null) {
						var pos = 0;
						for(; pos<categories.length; pos++) {
							if(categories[pos]==s1) {
								break;
							}
						}
						
						for(var j=0; j<seriesAll.length; j++) {
							var s = seriesAll[j];
							if(s.series == series) {
								s.data[pos] = val1;
							}
						}
					}

				}
				for(var j=0; j<seriesAll.length; j++) {
					var s = seriesAll[j];
					delete s['series'];
				}

				var dataPie = [];
				for(var j=0; j<seriesAll.length; j++) {
					var s = seriesAll[j];
					console_logs('------------> s', s);
					var name = s.name
					var data = s.data;
					var y = 0;
					for(var k=0; k<data.length; k++) {
						y = y + data[k];
					}
					var o = {
						name: name,
						y: y,
						color: ECHART_COLORS[j]
					};

					//console_logs('o', o);

					dataPie.push(o);
				}

				var params = null;
				if(myId=='pur-stock') {
					params= getEchartParam(categories, seriesAll, true, true,true);
				} else {
					params= getEchartParam(categories, seriesAll, false, false,false);
				}
				//console_logs('params', params);
				echarts.dispose(chartTarget);
				var myChart = echarts.init(chartTarget);
				var option = getEchartOption();
				option.title = {
					left: 'center',
					text: chartName
				};
				option.dataset = {
					dimensions: params.dimensions,
					source: params.sources
				};
				option.xAxis = {
					type: 'category',
					axisLabel:{textStyle:{fontSize:11}}
			
				};
				option.yAxis = {
					name : yName,
					axisLabel:{textStyle:{fontSize:11}}
				};
				
				option.series = params.series;
				option.toolbox = {
					show: true,
					language: 'en',
					right: 30,
					feature: {
						//dataView: {readOnly: true, title: '데이타'},
						//restore: {},
						saveAsImage: {
							title: '이미지'
						}
					}
				};
				myChart.setOption(option);
				gu.setToolbarPath(myId, this.selectedMenuGroupName);
			
				window.onresize = function() {
					myChart.resize();
				};

				myChart.on('click', function (params, a, b) {
					console_logs('params', params);
					console_logs('params.value', params.value);
					//console_logs('listSeries', listSeries);
					//console_logs('list', list);
					//var name = params.name;
					
					var dataIndex = params.dataIndex;
					var seriesIndex = params.seriesIndex;
					var seriesName = listSeries[seriesIndex];
					var dataCoord = listCat[dataIndex];

					var value = params.value[params.seriesName];
					var msg 
					= 'myId=' + myId
					+ '<br>' + 	'dataCoord = ' + dataCoord
					+ '<br>' + 	'seriesName = ' + seriesName
					+ '<br>' + 	'value = ' + value
					;

					switch(myId) {
						// case 'quality-manage':

						// break;
						default:
						Ext.MessageBox.alert('정보', msg, callBack);
						function callBack(id) {
							console_logs('id', id);
						}
					}

	
		
				
				});

			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax

	},
	printGeneral: function(myId) {

		switch(myId) {
			case 'criterion-info':
			case 'produce-mgmt':
			case 'equip-state':
			case 'pur-stock':
			case 'design-plan':
				this.refreshGeneral(myId, null);
				return;
				break;
			case 'quality-manage':
				this.refreshGeneral(myId, 'QLP');
				return;
		}



		var target = 'container'+ myId;
		var chartTarget = document.getElementById(target);

		var type = '';
		var xName = '';
		var yName = '';
		var dataName = '';

		switch(myId) {
			case 'sales-delivery':
				type = 'line';
				xName = '일(days)';
				yName = '수주금액';
				dataName = '금액(원)';
			break;
			case 'design-plan':
				type = 'column';
				xName = '시간(times)';
				yName = '생산량';
				dataName = '생산량';
			break;
			case 'produce-mgmt':
				type = 'column';
				xName = '일(days)';
				yName = '생산량';
				dataName = '생산량';
			break;
			case 'pur-stock':
				type = 'line';
				xName = '일(days)';
				yName = '재고 수량';
				dataName = '수량';
			break;
			case 'quality-manage':
				type = 'line';
				xName = '시간(times)';
				yName = '불량 건수';
				dataName = '불량건수';
			break;
			case 'criterion-info':
				type = 'column'
				xName = '연월일';
				yName = '접속 건수';
				dataName = '접속건수';
			break;

		}


			var start_date = gu.yyyymmdd(getChartCond(myId, 'START_DATE'));
			var end_date =   gu.yyyymmdd(getChartCond(myId, 'END_DATE'));
			var time_unit = 	 getChartCond(myId, 'TIME_UNIT');


			var chartName = '';

			chartTarget.style.visibility = "hidden";
			echarts.dispose(chartTarget);
			var myChart = echarts.init(chartTarget);

			console_logs('myChart', myChart);
			var option = getEchartOption();
			option.title = {
				left: 'center',
				text:  this.selectedMenuGroupName + ' 추이'
			};
			option.tooltip = {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#283b56'
					}
				}
			};
			option.legend = {
				top:  35,
				data:['불량수량', '생산수량']
			};
			option.toolbox = {
				show: true,
				language: 'en',
				right: 30,
				feature: {
					//dataView: {readOnly: true, title: '데이타'},
					//restore: {},
					saveAsImage: {
						title: '이미지'
					}
				}
			};
			option.dataZoom = {
				show: false,
				start: 0,
				end: 100
			};

			option.xAxis = [
				{
					type: 'category',
					boundaryGap: true,
					data: (function (){
						var now = new Date();
						var res = [];
						var len = 31;
						while (len--) {
							res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
							now = new Date(now - 2000);
						}
						return res;
					})()
				}
				,
				{
					type: 'category',
					boundaryGap: true,
					data: (function (){
						var res = [];
						var len = 31;
						while (len--) {
							res.push(31 - len - 1);
						}
						return res;
					})()
				}
			];
			option.yAxis = [
				{
					type: 'value',
					scale: true,
					//name: '건수',
					max: 30,
					min: 0,
					boundaryGap: [0.2, 0.2]
				},
				{
					type: 'value',
					scale: true,
					//name: '생산량',
					max: 1200,
					min: 0,
					boundaryGap: [0.2, 0.2]
				}
			];
			option.series = [
				{
					name:'생산수량',
					type:'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					itemStyle: getEcItemStyle(0, true),
					data:(function (){
						var res = [];
						var len = 31;
						while (len--) {
							res.push(Math.round(Math.random() * 1000));
						}
						return res;
					})()
				},
				{
					name:'불량수량',
					type:'line',
					itemStyle: getEcItemStyle(5, true),
					data:(function (){
						var res = [];
						var len = 0;
						while (len < 31) {
							res.push((Math.random()*10 + 5).toFixed(1) - 0);
							len++;
						}
						return res;
					})()
				}
			];
			myChart.setOption(option);

			window.onresize = function() {
				myChart.resize();
			};

			var timerId = null;
			var showChart = function() {

				chartTarget.style.visibility = "visible";
				clearInterval(timerId);
			};
			var startClock = function() {
				console_logs('chart', new Date());
				timerId = setInterval(showChart, 500);

			}
			startClock();
		

	
	
	},
	printEchart: function(myId) {
		console_logs('Rfx2.app.AbsMainBase name', this.name);
		console_logs('Rfx2.app.AbsMainBase id',  myId);
		if(myId==null) {
			myId = this.selectedMenuGroup;
		}

		if(myId==null) {
			alert('id를 찾을 수 없습니다.');
			return;
		}
		
		switch(myId) {
			case 'project-total':
				break;
			case 'produce-state':
				break;
			case '#pur-stock#'/*'pur-stock'*/:

				//console_logs('rackDivision', rackDivision);
				if(gu.rack_list0==null && rackDivision!=null && rackDivision.length>0) {
					var arr=Ext.JSON.decode(rackDivision);
					console.log('hanaro rackDivision', arr);
					gu.rack_list0 = arr['datas0'];
					gu.rack_list1 = arr['datas1'];
					gu.rack_list2 = arr['datas2'];
					gu.rack_list3 = arr['datas3'];
				}
				if(gu.rack_list0!=null) {
					var tab0 = gu.rack_list0[0];
					for(var i=0; i< gu.rack_list1.length; i++) {
						var o = gu.rack_list1[i];
						//console_logs('o', o);
						if(tab0.class_code = o.parent_class_code) {
							this.printStock('container' + i  + myId, o.class_code, new Number(o.class_type), new Number(o.spec_need_flag), tab0.class_name);
						}
					}
				}

				break;
			case 'sales-delivery':
			case 'design-plan':
			case 'produce-mgmt':
			case 'quality-manage':
			case 'equip-state':
			case 'criterion-info':
			case 'pur-stock':
				this.printGeneral(myId);
				break;
			default:
			this.printGeneral(myId);

		}

		
	}
});