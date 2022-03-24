const place_year = '2019';
const fromDate = place_year + '-01-01';
const toDate = place_year + '-12-31';

const monthLength = 12;

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

Ext.define('Hanaro.view.ProduceStateHanaro', {
    extend: 'Hanaro.base.HanaroBasePanel',
        
    createToolbar: function(){

        var items = [],
            config = {};
        if (!this.inTab) {
			items.push({
	        	xtype: 'label',
	        	style: 'color:white;',
	        	html: ULV_CMD_CLEAN_ROOM_INFO
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
        	contentEl: 'cleanRoomPagelayout'
        });
        this.callParent(arguments);
		
		$('#cleanRoomPagelayout').attr('style', '');

		$('#cleanRoomNumber').change(function(){
			getCleanRoomData($('#cleanRoomNumber').val());
		});

		this.getCleanRoomInfo();

	},

	getCleanRoomInfo : function () {

		// Read Data from DB
		var url = CONTEXT_PATH + '/dashboard/getData.do?method=cleanRoomList';

		// Data는 VO를 통해 주고 받는다.
		Ext.Ajax.request({
			url: url,				
			params:{
				place_year: place_year
			},

			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var cleanRoomList = val.cleanRoomList;

				// Project List Each
				$(cleanRoomList).each(function(index) {
					$('#cleanRoomNumber').append(
						'<option value="' + this.place_name + '" >' + this.place_name + '</option>'
					);
				});

				getCleanRoomData($('#cleanRoomNumber').val());

			},// endof success for ajax

			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); 

		
	}

});


function getCleanRoomData(place_name) {

	// 공간 활용률 로딩시
	var place_use_size = 0;
	var place_total_size = 0;
	var place_use_aver = 0;


	// 정보를 가져온다.
	// Read Data from DB
	var url = CONTEXT_PATH + '/dashboard/getData.do?method=cleanRoomDetailList';
	
	// 공간 활용률 Data Set
	var data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var data3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	// Data는 VO를 통해 주고 받는다.
	Ext.Ajax.request({
		url: url,				
		params:{
			place_year: place_year
		   ,place_name: place_name
		},

		success : function(response, request) {


			var val = Ext.JSON.decode(response.responseText);
			var cleanRoomList = val.cleanRoomList;

			// Project List Each
			$(cleanRoomList).each(function(index) {
				
				// 사용면적 총합 - 나중에 평균냄
				place_use_size += this.place_use_result;
				
				// 전체면적 총합 - 나중에 평균냄
				place_total_size += this.place_size;

				var plan = this.place_use_plan;
				var use = this.place_use_result;
				
				if(this.place_use_result > 0) {
					var plan = 0;
				} else {
					var use = 0;
				}
				var max = 100 - plan - use;

				data1[this.place_month - 1] = max;
				data2[this.place_month - 1] = plan;
				data3[this.place_month - 1] = use;
				

			});

			place_use_size /= monthLength;
			place_total_size /= monthLength;
			place_use_aver = place_use_size / place_total_size * 100;

			$('#place_use_size').html(place_use_size.toFixed(0));
			$('#place_total_size').html(place_total_size.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));
			$('#place_use_aver').html(place_use_aver.toFixed(1));

			
			var option = {
				color: [ '#e5323e', '#006699', '#003366'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					y : 'bottom',
					data: [ULV_CMD_CLEAN_ROOM_READY, ULV_CMD_CLEAN_ROOM_PRE, ULV_CMD_CLEAN_ROOM_RESULT]
				},
				calculable: true,
				title: {
					x : 'center',
					text: ULV_CMD_CLEAN_ROOM_USE_AREA_RATE
				},
				xAxis: [
					{
						type: 'category',
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
						name: ULV_CMD_CLEAN_ROOM_RESULT,
						type: 'bar',
						stack: 'Stack',
						data: data3
					},
					{
						name: ULV_CMD_CLEAN_ROOM_READY,
						type: 'bar',
						stack: 'Stack',
						data: data1
					},
					{
						name: ULV_CMD_CLEAN_ROOM_PRE,
						type: 'bar',
						stack: 'Stack',
						data: data2
					}
				]
			};
			
			var target = 'resultByCost2';
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
		
	}); 

	// 정보를 가져온다.
	// Read Data from DB
	url = CONTEXT_PATH + '/dashboard/getData.do?method=projectListFromYear';
	
	// 인력현황 Data Set    
	var data21 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var data23 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var data24 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	
	// 생산현황 로딩시
	var assign_worker = 0;
	var assign_machine = 0;

	// Data는 VO를 통해 주고 받는다.
	Ext.Ajax.request({
		url: url,				
		params:{
			 fromDate: fromDate
			,toDate: toDate
			,place_name: place_name
		},

		success : function(response, request) {

			var val = Ext.JSON.decode(response.responseText);
			var projectList = val.projectList;

			var tail = true;

			// Project List Each
			$(projectList).each(function(index) {

				// 생산중인 작업자, 생산 장비수
				if(this.status_code == 3) {
					assign_machine += this.mfg_quantity;
					assign_worker += this.member_mfg + this.member_sub + this.member_out;
				}

				data21[this.release_month - 1] += this.member_mfg;
				data23[this.release_month - 1] += this.member_mfg + this.member_out;
				data24[this.release_month - 1] += this.member_needs;

				if(tail) {
					color = 'cornflowerBlue';
					tail = false;
				} else {
					color = 'lightSkyBlue';
					tail = true;	
				}

				var status = "";
				// 상태에 따라 분기처리, 코드로 변환
				if(this.status_code == 1){
					status = ULV_CMD_TOTAL_DASHBOARD_PLAN;
				}else if(this.status_code == 2){
					status = ULV_CMD_TOTAL_DASHBOARD_DELV_CONFIRM;
				}else if(this.status_code == 3){
					status = ULV_CMD_TOTAL_DASHBOARD_MFG;
				}else if(this.status_code == 4){
					status = ULV_CMD_TOTAL_DASHBOARD_SHIP;
				}else if(this.status_code == 5){
					status = ULV_CMD_TOTAL_DASHBOARD_WAIT;
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

				var line =   '<tr style="background-color: ' + color + '; min-height: 81px;">'
							+'	<td style="border-bottom-style: none;">'
							+'		<table class="tablePjt">'
							+'		<colgroup>'
							+'			<col width="40px" >'
							+'			<col width="8%" >'
							+'			<col width="20%" >'
							+'			<col width="40px" >'
							+'			<col width="8%" >'
							+'			<col width="10%" >'
							+'			<col width="40px" >'
							+'			<col width="12%" >'
							+'			<col width="*" >'
							+'		</colgroup>'
							+'		<tr>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid;" rowspan="2"></td>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; font-size: 30px; " rowspan="2" colspan="2" >'
							+ 			this.uj_code
							+'			</td>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; font-size: 30px; " rowspan="2" colspan="3" >'
							+ 			this.uk_code
							+'			</td>'
							+'			<td colspan="2" >'
							+			this.buyer_name	
							+'			</td>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; text-align: center; font-size: 30px;" rowspan="2" colspan="2" >'
							+			status + '&nbsp;' + this.progress_rate + '%'
							+'			</td>'
							+'		</tr>'
							+'		<tr>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " colspan="3" >'
							+			this.item_name
							+'			</td>'
							+'		</tr>'
							+'		<tr>'
							+'			<td rowspan="2" style="text-align: center; border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " ><img alt="" src="/web_han_static/icon/ulvac-schedule.png"></td>'
							+'			<td style="text-align: center;" >' + ULV_CMD_TOTAL_DASHBOARD_PLAN + '</td>'
							+'			<td>' + oDate + ' ~ ' + dDate + '</td>'	
							+'			<td rowspan="2" style="text-align: center; border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " ><img alt="" src="/web_han_static/icon/ulvac-labor.png"></td>'
							+'			<td style="text-align: center;" >' + ULV_CMD_TOTAL_DASHBOARD_PLAN + '</td>'
							+'			<td>' + this.md_plan_count + 'M/D</td>'
							+'			<td rowspan="2" style="text-align: center; border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " ><img alt="" src="/web_han_static/icon/ulvac-quality.png"></td>'
							+'			<td style="text-align: center;" >' + ULV_CMD_CLEAN_ROOM_QUAL_ERROR + '</td>'
							+'			<td>' + this.quality_end_count  + ' / ' + this.quality_count + ' ' + ULV_CMD_TOTAL_COUNT + '</td>'
							+'		</tr>'
							+'		<tr>'
							+'			<td style="text-align: center; border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " >' + ULV_CMD_TOTAL_RESULT + '</td>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " >' + oDate + ' ~ ' + rDate + '</td>'
							+'			<td style="text-align: center; border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " >' + ULV_CMD_TOTAL_RESULT + '</td>'	
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; ">' + this.md_actual_count + 'M/D</td>'	
							+'			<td style="text-align: center; border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; " >' + ULV_CMD_CLEAN_ROOM_LINE_CLAIM + '</td>'
							+'			<td style="border-bottom-color: currentColor; border-bottom-width: 1px; border-bottom-style: solid; ">' + this.claim_end_count + ' / ' + this.claim_count + ' ' + ULV_CMD_TOTAL_COUNT + '</td>'
							+'		</tr>'
							+'	</table>'
							+'	</td>'
							+'</tr>';
				$('#cleanRoomJobList').append( line );

			});

			$('#assign_worker').html(assign_worker.toFixed(0));
			$('#assign_machine').html(assign_machine.toFixed(0));

			var option2 = {
				color: ['#003366', '#006699', '#e5323e'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					y : 'bottom',
					data: [ULV_CMD_CLEAN_ROOM_MFG_TECH_TEAM, ULV_CMD_CLEAN_ROOM_MFG_AND_OUT, ULV_CMD_CLEAN_ROOM_NEED_MEMBER]
				},
				title: {
					x : 'center',
					text: ULV_CMD_CLEAN_ROOM_MEMBER_DASH
				},
				xAxis: [
					{
						type: 'category',
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
						name: ULV_CMD_CLEAN_ROOM_MFG_TECH_TEAM,
						type: 'line',
						data: data21
					},
					{
						name: ULV_CMD_CLEAN_ROOM_MFG_AND_OUT,
						type: 'line',
						data: data23
					},
					{
						name: ULV_CMD_CLEAN_ROOM_NEED_MEMBER,
						type: 'line',
						data: data24
					}
				]
			};
			
			var target2 = 'resultByComponent2';
			var chartTarget2 = document.getElementById(target2);
		
			echarts.dispose(chartTarget2);
			var myChart2 = echarts.init(chartTarget2);
		
			myChart2.setOption(option2);
				
			window.onresize = function() {
				myChart2.resize();
			};

		},// endof success for ajax

		failure:function(result, request) {
			console_logs('fail', '#');
		}
		
	}); 

	
			


}
