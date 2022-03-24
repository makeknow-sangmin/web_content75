Ext.define('Hanaro.base.HanaroBasePanel', {
    extend: 'Ext.panel.Panel',
	frame   : false,
    border: false,
	split: true,
	bodyPadding: '1 0 0 0',
	groupId: '',
	createToolbar: function(groupId){
		// console_logs('Hanaro.base.HanaroBasePanel groupId', groupId);
		// console_logs('Hanaro.base.HanaroBasePanel id', this.id);
		this.groupId = groupId;
        var items = [],
            config = {};
        if (!this.inTab) {
	        items.push({
	        	id : gu.getToolbarId(groupId), //'toolbarPath-' + groupId,
	        	xtype: 'label',
	        	width: 600,
	        	style: 'color:white;',
	        	html:''
	        });	        
			items.push('->');
			
			var systemName = '하나로MES 2019';
			var version = 'v' + vMajor + '.' +vMinor;
			var color ='#fafafa';
			if(vSYSTEM_TYPE_SUB == 'SOLIDENG') {
				systemName = 'SolidMES';
			}
			items.push({
				xtype : 'component',
				html: '<span style="font-size:9px; font-weight:normal;color:' + color + ';"><i>' + systemName + '</i> on '+ version + '</span>'
			});

			items.push('-');
  
	        items.push({
	        	xtype: 'component',
	        	html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
	            //html: '<div class="inputBT"><button type="button" onClick="openNewWindow();"><span class="search">새창으로 보기</span></button></div>'
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

	layoutConfig: {columns: 1, rows:1},
			    defaults: {
			        collapsible: false,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
	bodyPadding: 10,
    initComponent: function(){
//    	console_logs('initComponent', this);
		var myId = this.id;

		this.dockedItems = [this.createToolbar(myId)];

		if(vSYSTEM_TYPE == 'HANARO') {
		
			var dayUnitStore =  Ext.create('Ext.data.Store', {
				fields: ['codeName', 'codeValue'],
				data : [{
					codeName: '일', codeValue: 'day'
				},{
					codeName: '주', codeValue: 'week'
				},{
					codeName: '월', codeValue: 'month'
				}]
			});

			var combobox = Ext.create('Ext.form.ComboBox', {
				fieldStyle: 'background-color: #F5F5F5; background-image: none;',
				mode:           'local',
				editable:       false,
				allowBlank: false,
				queryMode: 'remote',
				displayField:   'codeName',
				triggerAction:  'all',
				store: dayUnitStore,
				width: 60,
				cls : 'newCSS',
				disabled: true,
				listConfig:{
				getInnerTpl: function(){
						 return '<div data-qtip="{systemCode}">{codeName}</div>';
					 }			                	
				 },
				  listeners: {
						  select: function (combo, record) {
							console_logs('record select', record);

							  //var codeName = record.get('codeName');
							  var codeValue = record.get('codeValue');
							  //console_logs(codeName, codeValue);
							  //TOTAL_PARAMS[myId] = combo.getValue();
							  setChartCond(myId, 'TIME_UNIT', codeValue);
						  },
						  change: function(sender, newValue, oldValue, opts) {
							  //console_logs('newValue', newValue);
							 //this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
							 //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
						 }
					 }
			});

			//Default Value Select
			dayUnitStore.each(function (record) {
				// console_logs('dayUnitStore this', this);
				// console_logs('dayUnitStore record', record);
				// console_logs('dayUnitStore myId', myId);
				
				var codeValue = record.get('codeValue');
				var unit = getChartCond(myId, 'TIME_UNIT');
				// console_logs('codeValue', codeValue);
				// console_logs('unit', unit);
				if(codeValue == unit) {
					combobox.select(record);
				}
			}, this);

			var srchItems = [];
			//검색 조건
			srchItems.push(
			{
				xtype:'tbtext',
				text: "조회기간:",
				style: 'color:black;'
			},
			{ 
				name: 's_date',
				value : getChartCond(myId, 'START_DATE'),
				format: 'Y-m-d',
				fieldStyle: 'background-color: #F5F5F5; background-image: none;',
				submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
				allowBlank: true,
				xtype: 'datefield',
				width: 100,
				listeners: {
					change: {
						fn:function(field, newValue, oldValue){
							//console_logs('change v', field);
							//console_logs('change newValue', newValue);
							//console_logs('change oldValue', oldValue);
							setChartCond(myId, 'START_DATE', newValue);
						}
					}
				}
			},
			{
				xtype:'label',
				text: "~",
				style: 'color:black;'
			},
			{ 
				name: 'e_date',
				value : getChartCond(myId, 'END_DATE'),
				format: 'Y-m-d',
				fieldStyle: 'background-color: #F5F5F5; background-image: none;',
				submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
				allowBlank: true,
				xtype: 'datefield',
				width: 99,
				listeners: {
					change: {
						fn:function(field, newValue, oldValue){
							// console_logs('change v', field);
							// console_logs('change newValue', newValue);
							// console_logs('change oldValue', oldValue);
							setChartCond(myId, 'END_DATE', newValue);
						}
					}
				}
			},
			'-');

			//var myHtml = '<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTotalChartAll(' + "'" + myId + "'" + ');"></button></span></div>';
			var myHtml = '<div class="searchcon"><span class="searchBT"><button type="button" onClick="gm.printEchart(' + "'" + myId + "'" + ');"></button></span></div>';

			srchItems.push({
				xtype: 'component',
				html: myHtml
			});
			srchItems.push('->');

			if(myId=='sourcing-mgmt' || myId=='#pur-stock') {
				var radioItems = [];
				if(gu.rack_list1!=null) {
					for(var i=0;i<gu.rack_list1.length; i++) {
						var o = gu.rack_list1[i];
						radioItems.push({
							text: o.class_name,
							class_code: o.class_code,
							unique_id: o.unique_id,
							serial : i,
							pressed: (i==0)
						});
					}
	
					srchItems.push({
						xtype: 'segmentedbutton',
						items:radioItems,
						hidden: true,
						listeners: {
							toggle: function(container, button, pressed){
								console_logs('button code', button.class_code);
								console_logs('button unique_id', button.unique_id);
								console_logs('button serial', button.serial);
								var segName = button.getText();
								var class_code = button.class_code;
								var unique_id = button.unique_id;
								var serial = button.serial;
								for(var i=0;i<gu.rack_list1.length; i++) {
									var o = gu.rack_list1[i];
									if(button.class_code = o.parent_class_code) {
										gm.printStock('container' + (i+1) + myId, class_code, new Number(o.class_type), new Number(o.spec_need_flag), segName, unique_id, serial);
									}
									
								}
								
								
							}
						}
					});
				}
				
			}
			
			if(myId=='quality-manage') {
				var radioItems = [{
					text: '자재',
					class_code: 'QLP',
					unique_id: 0,
					serial : 0,
					myId: myId,
					pressed: true
				}, {
					text: '제품',
					class_code: 'QLA',
					unique_id: 1,
					serial : 1,
					myId : myId
				}];

				srchItems.push({
					xtype: 'segmentedbutton',
					items:radioItems,
					hidden:true,
					listeners: {
						toggle: function(container, button, pressed){
							console_logs('button code', button.class_code);
							console_logs('button unique_id', button.unique_id);
							console_logs('button serial', button.serial);


							gm.refreshGeneral(button.myId, button.class_code);
							// var segName = button.getText();
							// var class_code = button.class_code;
							// var unique_id = button.unique_id;
							// var serial = button.serial;
							// for(var i=0;i<gu.rack_list1.length; i++) {
							// 	var o = gu.rack_list1[i];
							// 	if(button.class_code = o.parent_class_code) {
							// 		//gm.printStock('container' + (i+1) + myId, class_code, new Number(o.class_type), new Number(o.spec_need_flag), segName, unique_id, serial);
							// 	}
								
							// }
							
							
						}
					}
				});

				
			}

			srchItems.push('-', {
				xtype:'tbtext',
				text: "기간단위:"
			},combobox);

			var id = 'subToolbar-' + this.id;
			//console_logs('BasePanel toolbar id', id);
			var subConfig = {
				id : id
			};
			subConfig.items = (vCompanyReserved4 == 'ULVC01KR') ? [] : srchItems;
			subConfig.cls = 'my-x-toolbar-default1-3-green';
			var toolbarSub =  Ext.create('widget.toolbar', subConfig);
            this.dockedItems.push(toolbarSub);

		}

		this.callParent(arguments);
    },
    createPaneMenu: function(paneName, listMenu, onSelect) {
		console_logs('createPaneMenu skipped...', paneName);
		return;
    },
    createCenter: function(centerId, arr){
		// console_logs('createCenter centerId', centerId);
		// console_logs('createCenter arr', arr);
    	this.center = Ext.create(
			'Rfx.base.CenterPanelTree',  {
    		id: centerId,
            items : arr
        });
	
    	gMain.selMainPanelCenter = this.center;
        return this.center;
    },
	listMenu: null,

	drawChart: function(target) {
		// console_logs('drawChart this.groupId', this.groupId);
		// console_logs('drawChart this.id', this.id);
		//console_logs('drawChart', target);

		// var oDiv = document.getElementById('container'+ this.id);

		// console_logs('oDiv', oDiv);

		// Highcharts.chart(oDiv, {
		// 	chart: {
		// 		type: 'line'
		// 	},
		// 	title: {
		// 		text: '목표대비 생산'
		// 	},
		// 	data: {
		// 		csvURL: 'https://demo-live-data.highcharts.com/time-data.csv',
		// 		enablePolling: true,
		// 		dataRefreshRate: 2
		// 	}
		// });

	},
	
	getTopHtml: function(id) {
		// console_logs('getTopHtml this.groupId', this.groupId);
		//console_logs('getTopHtml id', '=='+this.id+'==');
		//alert('Hanaro.base.HanaroBasePanel: '+vExtVersion);
		var ret = '';
		if(vSYSTEM_TYPE == 'HANARO') {
			
			if(this.id == 'sourcing-mgmt' || this.id == '#pur-stock#') {

				//console_logs('rackDivision', rackDivision);
				if(gu.rack_list1==null && rackDivision!=null && rackDivision.length>0) {
					var arr=Ext.JSON.decode(rackDivision);

					gu.rack_list1 = arr['datas1'];

					gu.rackStock = arr['rackStock'];
					console_logs('gu.rackStock', gu.rackStock);
					if(vCompanyReserved4 == 'ULVC01KR') {
						gu.setRackInfo();
					}
				}
				if(gu.rack_list1!=null && gu.rack_list1.length>0) {

					for(var i=0;i<gu.rack_list1.length; i++) {
						ret = ret + 
						'<div id="container' + i + this.id + '" class="float-frame">'
						//  + '<div id="container' + i + '-left-' + this.id + '" class="float-unit" >' + i + '-left' +'</div>'
						//  + '<div id="container' + i + '-right-'+ this.id + '" class="float-unit">' + i +'-right' +'</div>'
						// 	+ '<div class="clear"> </div>'
						+ '</div>\n'	;		//히든으로 셋탕해서 표시할때 display	
					}
				}

				//console_logs('ret', ret);

			} else {
				ret ='<div id="container'+ this.id + '" style="min-width: 310px; height: 90%; margin: 0 auto">' + '' +'</div>';

			}
			//console_logs('ret', ret);

		} else {
			ret = '<div style="' 
			+ 'height:100%;width:100%;background-image: url(' + vContent_full_path + '/company_logo/'
			+ vCompanyReserved4 + '.png);'
			+ 'background-size: 100px;'
			+ 'background-repeat:	no-repeat;'
			+ 'background-position: 99% 99%;'
			+ '"><center><h1>프로그램 구성 정보</h1></center><table width="100%" border="1px solid #F0F0F0;" cellpadding="0" style="border-collapse: collapse;background-color:#FFFFF5;">'
			+ '<colgroup>'
			+ '<col width="5%">'
			+ '<col width="10%">'
			+ '<col width="10%">'
			+ '<col width="15%">'
			+ '<col width="40%">'
			+ '<col width="20%">'
			+ '</colgroup>'
			+ '<tbody>'
			+ '<tr>'
			+ '<th height="25" style="background-color:#BDCCD9;">No.</th>'
			+ '<th height="25" style="background-color:#BDCCD9;">메뉴코드</th>'
			+ '<th height="25" style="background-color:#BDCCD9;">메뉴명</th>'
			+ '<th height="25" style="background-color:#BDCCD9;">명령 클래스</th>'
			+ '<th height="25" style="background-color:#BDCCD9;">프로그램 경로</th>'
			+ '<th height="25" style="background-color:#BDCCD9;">명령 아이디</th>'
			+ '</tr>';
			for(var i=0; i<this.listMenu.length; i++) {
				var o = this.listMenu[i];
				ret = ret + '<tr><td align=center height="25">';
				ret = ret + (i+1) + '</td><td align=center>';
				ret = ret + o.link + '</td><td align=center>';
				ret = ret + o.name + '</td><td align=center>';
				ret = ret + o.className + '</td><td align=center>';
				ret = ret + ((o.linkPath==null)? '': o.linkPath)  + '</td><td align=center>';
				ret = ret + o.classId + '</td></tr>';
			}
	
			ret =ret + '</tbody></table></div>';
		}
		
		return ret;
	}
	,
	createSouth: function() {
		//console.log('createSouth', true);
		this.south = Ext.create('Ext.Panel', {
			id: this.id + '-southPain',
			frame: false,
			collapsible: false,
			region: 'south',
			height: 25,
			border: false,
			html:
			'<div style="width:100%">' +
			'<div style="width:50%; float:left;"><img style="height:20px;" src="' + 
					 vContent_full_path + '/company_logo/' + vCompanyReserved4 + '.png"></div>' + 
     	 '<div style="width:50%; float:left; font-size:12px; color:#999;text-align:right;">' + vCompanySlogan + '</div>' +
			'</div>'
		});
		return this.south;
	}

});
