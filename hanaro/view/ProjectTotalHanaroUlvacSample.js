const paramYear = '2019';
const fromDate = paramYear + '-01-01';
const toDate = paramYear + '-12-31';

const months = [ULV_CMD_TOTAL_JNR,
				ULV_CMD_TOTAL_FEB,
				ULV_CMD_TOTAL_MRC,
				ULV_CMD_TOTAL_APR,
				ULV_CMD_TOTAL_MAY,
				ULV_CMD_TOTAL_JUN,
				ULV_CMD_TOTAL_JUL,
				ULV_CMD_TOTAL_AUG,
				ULV_CMD_TOTAL_SEP,
				ULV_CMD_TOTAL_OCT,
				ULV_CMD_TOTAL_NOV,
				ULV_CMD_TOTAL_DEC];

var colors = ['#003366', '#006699', '#e5323e'];

Ext.define('Hanaro.view.ProjectTotalHanaroUlvacSample', {
    extend: 'Hanaro.base.HanaroBasePanel',
        
    createToolbar: function(){

        var items = [],
            config = {};
        if (!this.inTab) {
			items.push({
	        	xtype: 'label',
	        	style: 'color:white;',
	        	html: ULV_CMD_TOTAL_DASHBOARD_INFO
			});	 
			items.push({
                scale: 'small',
            	glyph: 'f044@FontAwesome',
				xtype: 'button'
				,cls: 'my-transparent-button'
				,baseCls: 'my-transparent-button'
				,pressedCls: 'my-transparent-button-pressed'
            });
			items.push('->');
			
			var systemName = 'SolidMES';
			var version = 'v' + vMajor + '.' +vMinor;
			var color ='#fafafa';
			
			items.push({
				xtype : 'component',
				html: '<span style="font-size:9px; font-weight:normal;color:' + color + ';"><i>' + systemName + '</i> on '+ version + '</span>'
			});

			items.push('-');
  
	        items.push({
	        	xtype: 'component',
	        	html: '<div class="searchcon" onClick="openNewWindow();" title="' + ULV_MSG_OPEN_NEW_WINDOW + '"><span class="newwinBT"></span></div>'
			});

			items.push('-');

			var language = '';
			switch(vLANG) {
				case 'ko':
					language = '한국어';
				break;
				case 'en':
					language = 'English';
				break;
				case 'jp':
					language = '日本語';
				break;
				case 'zh':
					language = '中国(简体)';
				break;
				case 'tw':
					language = '臺灣(簡體)';
				break;
			}

			items.push({
				xtype: 'splitbutton',
				text: language,
				tooltip: 'Language',
				handler: function() {}, // handle a click on the button itself
				menu: new Ext.menu.Menu({
					items: [
						{text: '한국어', dataIndex: 0, handler: function() {
							top.location.href=vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'ko';
						}},
						{text: 'English', dataIndex: 0, handler: function() {
							top.location.href=vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'en';
						}},
						{text: '日本語', dataIndex: 0, handler: function() {
							top.location.href=vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'jp';
						}},
						{text: '汉语(简体)', dataIndex: 0, handler: function() {
							top.location.href=vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'tw';
						}},
						{text: '臺灣(簡體)', dataIndex: 0, handler: function() {
							top.location.href=vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'zh';
						}}
					]
				})
			});

	        config.items = items;
            
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
		config.cls = 'my-x-toolbar-default1-3-hanaro';
		config.height = 30;
        return Ext.create('widget.toolbar', config);

    },
    initComponent: function(){
        Ext.apply(this, {
        	contentEl: 'costPagelayout'
        });
        this.callParent(arguments);
		
		this.drawProjectList();
		this.drawResultByComponent();
		this.drawResultByCost();

		$('#totalTitle').prepend(paramYear);

		//this.drawMfgDashboard();

	},
	drawProjectList: function() {	

		// 수주현황 : 계획 > 수주확정 > 생산 > 출하 > 미착수
		var planCount = 0;
		var planAmount = 0;

		var orderCount = 0;
		var orderAmount = 0;

		var mfgCount = 0;
		var mfgAmount = 0;

		var mfgProgressCount = 0;
		var mfgDelayCount = 0;
		var mfgCompleteCount = 0;

		var releaseCount = 0;
		var releaseAmount = 0;

		var uninitCount = 0;
		var uninitAmount = 0;

		console_logs('Draw Project List And Dashboard');

		// Read Data from DB
		var url = CONTEXT_PATH + '/dashboard/getData.do?method=projectListFromYear';



		// Data는 VO를 통해 주고 받는다.
		Ext.Ajax.request({
			url: url,				
			params:{
				year: paramYear,
				fromDate: fromDate,
				toDate: toDate
			},
			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var projectList = val.projectList;
				var tail = true;

				// Project List Each
				$(projectList).each(function(index) {
					var status_ko = "";
					// 상태에 따라 분기처리, 코드로 변환
					if(this.status_code == 1){
						status_ko = ULV_CMD_TOTAL_DASHBOARD_PLAN;
					}else if(this.status_code == 2){
						status_ko = ULV_CMD_TOTAL_DASHBOARD_DELV_CONFIRM;
					}else if(this.status_code == 3){
						status_ko = ULV_CMD_TOTAL_DASHBOARD_MFG;
					}else if(this.status_code == 4){
						status_ko = ULV_CMD_TOTAL_DASHBOARD_SHIP;
					}else if(this.status_code == 5){
						status_ko = ULV_CMD_TOTAL_DASHBOARD_WAIT;
					}

					var oDate = '-';
					var dDate = '-';
					var rDate = '-';

					if(this.order_date != null){
						oDate = this.order_date.substring(0,10);
					}

					if(this.delivery_date != null){
						dDate = this.delivery_date.substring(0,10);
					}

					if(this.release_date != null){
						rDate = this.release_date.substring(0,10);
					}

					var line = '<tr style="" id=' + this.id + '">'
								+'<td style="text-align:center; ">'+ (index + 1) + '</td>'
								+'<td style="text-align:center; ">'+ this.uj_code + '</td>'
								+'<td style="text-align:center; ">'+ this.uk_code + '</td>'
								+'<td style="text-align:left; ">&nbsp;'+ this.buyer_name + '</td>'
								+'<td style="text-align:left; ">&nbsp;'+ this.item_name + '</td>'
								//rec.board_title
								+'<td style="text-align:center; ">'+ this.inner_yn + '</td>'
								+'<td style="text-align:center;">'+ status_ko + '</td>'
								+'<td style="text-align:center; ">'+ this.progress_rate + '%' + '</td>'
								+'<td style="text-align:center; ">'+ this.place_name + '</td>'
								+'<td style="text-align:right; ">'+ this.order_amount.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,") + '&nbsp;</td>'
								+'<td style="text-align:center;">'+ oDate + '</td>'
								+'<td style="text-align:center;">'+ dDate + '</td>'
								+'<td style="text-align:center;">'+ rDate + '</td>'
								//+'<td>'+ rec.board_count + '</td>'
								+'</tr>';
					$('#mainTable1 > tbody:last-child').append( line );

					var color = '';
					
					if($('#' + this.place_name).length == 0){
						
						if(tail) {
							color = 'beige';
							tail = false;
						} else {
							color = 'bisque';
							tail = true;	
						}

						var line =   '<tr style="border-bottom-color: white; border-bottom-width: 2px; border-bottom-style: solid;  background-color: ' + color + '; ">'
									+'	<td style="text-align: center; border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid;  font-size: 25px; font-weight: bold;">' + this.place_name + '</td>'
									+'	<td style="border-bottom-style: none;">'
									+'	<table>'
									+'		<colgroup>'
									+'			<col width="*" ><col width="13%" ><col width="13%" ><col width="15%" ><col width="10%" ><col width="10%" ><col width="20px" ><col width="10%" ><col width="20px" ><col width="10%" >'
									+'		</colgroup>'
									+'		<tbody id="' + this.place_name + '" >'
									+'		</tbody>'
									+'	</table>'
									+'	</td>'
									+'</tr>';
						$('#mfgListFromCR').append( line );
					}	

					var mdFlag = "N";
					var qualFlag = "N";

					// md는 계획대비 실적이 많은 경우
					if (this.md_actual_count > this.md_plan_count) {
						mdFlag = "Y";
					}
					
					// 품질은 발생 대비 완료가 적은 경우
					if (this.quality_count > this.quality_end_count) {
						qualFlag = "Y";
					}

					// 그럴리 없겠지만 위가 안되있을 경우 방어.
					if($('#' + this.place_name).length > 0){   // text-align:left; 
						var line =   '<tr style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid;" >'
									+'	<td style="font-size: 17px;  text-align:left; "> ' + this.buyer_name + '</td>'
									+'	<td style="font-size: 17px;  text-align:left; ">' + this.uj_code + '</td>'
									+'	<td style="font-size: 17px;  text-align:left; ">' + this.uk_code + '</td>'
									+'	<td style="font-size: 17px;  text-align:left; ">' + this.item_name + '</td>'
									+'	<td style="font-size: 15px;  ">' + status_ko + '</td>'
									+'	<td style="font-size: 15px;  text-align:right;  ">' + ((this.md_actual_count / this.md_plan_count) * 100).toFixed(1)  + ' % </td>' // 기준잡고 수정해야함 생산률?
									+'	<td style="font-size: 15px; font-weight: bold; color: blue; "><img alt="" src="/web_han_static/icon/ulvac-labor-small-' + mdFlag  + '.png"></td>'
									+'	<td style="font-size: 15px;  text-align:right;  ">' + ((this.quality_end_count / this.quality_count) * 100).toFixed(1)  + ' % </td>' // 기준잡고 수정해야함 품질률?
									+'	<td style="font-size: 15px; font-weight: bold; color: red; "><img alt="" src="/web_han_static/icon/ulvac-quality-small-' + qualFlag  + '.png"></td>'
									+'	<td style="font-size: 15px;  ">' + this.quality_count + ' ' + ULV_CMD_TOTAL_COUNT + '</td>' // 수정
									+'</tr>';
						$('#' + this.place_name).append( line );
					}

					// 상태에 따라 분기처리, 코드로 변환
					if(this.status_code == 1){
						planCount++;
						planAmount += this.order_amount;
					}else if(this.status_code == 2){
						orderCount++;
						orderAmount += this.order_amount;
					}else if(this.status_code == 3){
						mfgCount++;
						mfgAmount += this.order_amount;
						if(this.progress_rate >= 100){
							mfgCompleteCount++;
						}else if(this.delay_flag == 'Y') {
							mfgDelayCount++;
						}else {
							mfgProgressCount++;
						}
					}else if(this.status_code == 4){
						releaseCount++;
						releaseAmount += this.order_amount;
					}else if(this.status_code == 5){
						uninitCount++;
						uninitAmount += this.order_amount;
					} 

				});

				planAmount /= 100000000;
				$('#planCount').html(planCount);
				$('#planAmount').html(planAmount.toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));

				orderAmount /= 100000000;
				$('#orderCount').html(orderCount);
				$('#orderAmount').html(orderAmount.toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));

				mfgAmount /= 100000000;
				$('#mfgCount').html(mfgCount);
				$('#mfgAmount').html(mfgAmount.toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));
				$('#mfgDelayCount').html(mfgDelayCount);
				$('#mfgProgressCount').html(mfgProgressCount);
				$('#mfgCompleteCount').html(mfgCompleteCount);

				releaseAmount /= 100000000;
				$('#releaseCount').html(releaseCount);
				$('#releaseAmount').html(releaseAmount.toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));

				uninitAmount /= 100000000;
				$('#uninitCount').html(uninitCount);
				$('#uninitAmount').html(uninitAmount.toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));

			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax
    	
	},


	drawResultByCost : function() {

		
		// 수주 실적 (억원)
		var costPreDatas = [10, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5];
		var costPlanDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var costResultDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		console_logs('Draw ResultByCost');

		// Read Data from DB
		var url = CONTEXT_PATH + '/dashboard/getData.do?method=projectListFromYear';


		// Data는 VO를 통해 주고 받는다.
		Ext.Ajax.request({
			url: url,				
			params:{
				year: paramYear,
				fromDate: fromDate,
				toDate: toDate
			},
			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var projectList = val.projectList;
				var year = val.year;

				// Project List Each
				$(projectList).each(function(index) {

					
					// 월별로 예측금액 저장
					costPlanDatas[this.delivery_month - 1] += this.order_amount;
					// 월별로 실적금액 저장
					if(this.release_date != null){
						costResultDatas[this.release_month - 1] += this.result_amount;
					}

					// 월별로 예측금액 저장
					//compPlanDatas[this.delivery_month - 1] += this.delivery_quantity;
					// 월별로 실적금액 저장
					//if(this.release_date != null){
					//	compPlanDatas[this.release_month - 1] += this.release_quantity;
					//}

				});

				// 예측금액 억원화
				$(costPlanDatas).each(function(index) {
					var cost = costPlanDatas[index] /= 100000000;
					costPlanDatas[index] = cost.toFixed(2);
				});

				// 실적금액 억원화
				$(costResultDatas).each(function(index) {
					var cost = costResultDatas[index] /= 100000000;
					costResultDatas[index] = cost.toFixed(2);
				});

				var option = {
					color: colors,
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						x : 'center',
						y : 'bottom',
						data: [ULV_CMD_TOTAL_DASHBOARD_PLAN, ULV_CMD_TOTAL_PRE, ULV_CMD_TOTAL_RESULT]
					},
					toolbox: {
						show: false,
						orient: 'vertical',
						left: 'right',
						top: 'center',
						feature: {
							mark: {show: true},
							dataView: {show: true, readOnly: false},
							magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
							restore: {show: true},
							saveAsImage: {show: true}
						}
					},
					calculable: true,
					title: {
						x : 'center',
						text: paramYear + ULV_CMD_TOTAL_YEAR_RESULT_MONEY
					},
					xAxis: [
						{
							type: 'category',
							axisTick: {show: false},
							data: months
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: ULV_CMD_TOTAL_DASHBOARD_PLAN,
							type: 'bar',
							barGap: 0,
							data: costPreDatas
						},
						{
							name: ULV_CMD_TOTAL_PRE,
							type: 'bar',
							data: costPlanDatas
						},
						{
							name: ULV_CMD_TOTAL_RESULT,
							type: 'bar',
							data: costResultDatas
						}
					]
				};
				
				var target = 'resultByCost';
				var chartTarget = document.getElementById(target);
		
				echarts.dispose(chartTarget);
				var myChart = echarts.init(chartTarget);
		
				myChart.setOption(option);
					
				window.onresize = function() {
					myChart.resize();
				};

			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax
    			
	},

	drawResultByComponent : function () {
				
		// 수주 실적 (대)
		var compPreDatas = [3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3];
		var compPlanDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var compResultDatas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


		
		console_logs('Draw drawResultByComponent');

		// Read Data from DB
		var url = CONTEXT_PATH + '/dashboard/getData.do?method=projectListFromYear';

		// Data는 VO를 통해 주고 받는다.
		Ext.Ajax.request({
			url: url,				
			params:{
				year: paramYear,
				fromDate: fromDate,
				toDate: toDate
			},
			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var projectList = val.projectList;
				var year = val.year;

				// Project List Each
				$(projectList).each(function(index) {

					// 월별로 예측수량 저장
					compPlanDatas[this.delivery_month - 1] += this.delivery_quantity;
					// 월별로 실적수량 저장
					if(this.release_date != null){
						compResultDatas[this.release_month - 1] += this.release_quantity;
					}

				});

				var option = {
					color: colors,
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						x : 'center',
						y : 'bottom',
						data: [ULV_CMD_TOTAL_DASHBOARD_PLAN, ULV_CMD_TOTAL_PRE, ULV_CMD_TOTAL_RESULT]
					},
					toolbox: {
						show: false,
						orient: 'vertical',
						left: 'right',
						top: 'center',
						feature: {
							mark: {show: true},
							dataView: {show: true, readOnly: false},
							magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
							restore: {show: true},
							saveAsImage: {show: true}
						}
					},
					calculable: true,
					title: {
						x : 'center',
						text: paramYear + ULV_CMD_TOTAL_YEAR_RESULT_EA
					},
					xAxis: [
						{
							type: 'category',
							axisTick: {show: false},
							data: months
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: ULV_CMD_TOTAL_DASHBOARD_PLAN,
							type: 'bar',
							barGap: 0,
							data: compPreDatas
						},
						{
							name: ULV_CMD_TOTAL_PRE,
							type: 'bar',
							data: compPlanDatas
						},
						{
							name: ULV_CMD_TOTAL_RESULT,
							type: 'bar',
							data: compResultDatas
						}
					]
				};
				
				var target = 'resultByComponent';
				var chartTarget = document.getElementById(target);
		
				echarts.dispose(chartTarget);
				var myChart = echarts.init(chartTarget);
		
				myChart.setOption(option);
					
				window.onresize = function() {
					myChart.resize();
				};

			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax
	},

	drawMfgDashboard: function() {	

		console_logs('Draw Menufacturing Dashboard');

		// Read Data from DB
		var url = CONTEXT_PATH + '/dashboard/getData.do?method=projectListFromYear';

		// Data는 VO를 통해 주고 받는다.
		Ext.Ajax.request({
			url: url,				
			params:{
				year: paramYear,
				fromDate: fromDate,
				toDate: toDate
			},
			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var projectList = val.projectList;

				var tail = true;

				// Project List Each
				$(projectList).each(function(index) {
					var color = '';
					
					if($('#' + this.place_name).length == 0){
						
						if(tail) {
							color = 'beige';
							tail = false;
						} else {
							color = 'bisque';
							tail = true;	
						}

						var line =   '<tr style="border-bottom-color: white; border-bottom-width: 2px; border-bottom-style: solid;  background-color: ' + color + '; ">'
									+'	<td style="text-align: center; border-bottom-style: none;  font-size: 25px; font-weight: bold;">' + this.place_name + '</td>'
									+'	<td style="border-bottom-style: none;">'
									+'	<table>'
									+'		<colgroup>'
									+'			<col width="*" ><col width="20%" ><col width="20%" ><col width="10%" ><col width="10%" ><col width="20px" ><col width="10%" ><col width="20px" ><col width="10%" >'
									+'		</colgroup>'
									+'		<tbody id="' + this.place_name + '" >'
									+'		</tbody>'
									+'	</table>'
									+'	</td>'
									+'</tr>';
						$('#mfgListFromCR').append( line );
					}	
					
					// 그럴리 없겠지만 위가 안되있을 경우 방어.
					if($('#' + this.place_name).length > 0){   // text-align:left; 
						var line =   '<tr>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 18px;  text-align:left; "> ' + this.buyer_name + '</td>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 18px;  text-align:left; ">' + this.uj_code + '</td>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 18px;  text-align:left; ">' + this.item_name + '</td>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 15px;  ">' + this.status_code + '</td>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 15px;  ">' + this.progress_rate + '/' + this.progress_rate  + ' % </td>' // 기준잡고 수정해야함 생산률?
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 15px; font-weight: bold; color: blue; ">V</td>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 15px;  ">' + this.progress_rate + '/' + this.progress_rate  + ' % </td>' // 기준잡고 수정해야함 품질률?
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 15px; font-weight: bold; color: red; ">!</td>'
									+'	<td style="border-bottom-color: white; border-bottom-width: 1px; border-bottom-style: solid; font-size: 15px;  ">' + '3' + ' ' + ULV_CMD_TOTAL_COUNT +'</td>' // 수정
									+'</tr>';
						$('#' + this.place_name).append( line );
					}
				});


			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax
    	
	}


});