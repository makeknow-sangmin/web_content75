/**
 * MDW 공통 유틸 에 해당하는 Static class
 * @author sw775.park
 */
var extjsUtil = {	
	/**
	 * 공통 Div Popup
	 * @param {String} title
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object} buttons	 * @return {Ext.Window}
	 */
	openDialog : function(title, width, height, buttons, config) {
		var dialog = new Ext.Window({			
			id : (config)?config.id:'',
			title : title,
			layout : 'fit',	
			padding : '10 6 5 6',
			width : width,
			height : height,
			autoHight : true,
			y: (document.body.offsetHeight < height ? 10 :undefined),
			autoWidth : false,			
			closeAction : 'close',
			closable : false,
			plain : true,
			animate : true,
			modal : true,
			resizable : false,
			loadScripts : true,
			//minButtonWidth : '40', //defaults to 75
			footerCssClass: 'fbar_blue_button',
			//footerStyle:    'background-color:red; padding:10px;',
			buttons : buttons
		});
		if(config) Ext.apply(dialog, config);
		return dialog;
	},

	/**
	 * 공통 Url Div Popup
	 * @param {String} title
	 * @param {String} url 
	 * @param {Array/Object} url에 post로 넘길 parameter 배열
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Array/Object} button에 대한 배열
	 * @return {Ext.Window}
	 */
	openWindow : function(title, url, params, width, height, buttons) {
		var win = new Ext.Window({
			title : title,			
			layout : 'fit',	
			padding : '10 6 5 6',
			width : width,
			height : height,
			y: (document.body.offsetHeight < height ? 10 :undefined),
			autoWidth : false,
			autoScroll:true,
			closeAction : 'close',			
			closable:true,
			plain : true,
			animate : true,
			modal : true,
			resizable : false,
			loadScripts : true,
			autoLoad : {
				url : url,
				params : !params?false:params
			},
			//minButtonWidth : '40', //defaults to 75
			footerCssClass: 'fbar_blue_button',
			buttons : !buttons?false:buttons
		});
		return win;
	},
	
    /**  
	 *  팝업창을 띄우고 화면의 중앙으로 이동한다.
	 *  @param  {String} 팝업창의 URL
	 *  @param  {String} 팝업창 이름
	 *  @param  {Number} 팝업창의 width
	 *  @param  {Number} 팝업창의 height
	 *  @param  {String} 추가기능 (ex. 'scrollbars=no, resizable=yes' )
	 *  @return  {window} 객체
	 *  예제) openWindowCenter(url, 'popupCalendar', 180, 195, 'scrollbars=no');
	 */
	openPopUp : function(theURL, winName, width, height, features) {
		//  화면 중앙의 좌표값 계산
		var leftX = screen.width / 2 - width / 2;
		var topY = -75 + screen.height / 2 - height / 2;
		//  팝업창 크기 설정
		var featuresValue = 'width=' + width + ',height=' + height;
		featuresValue += ',left=' + leftX + ',top=' + topY;
		//  추가 속성 지정
		if (features.length > 0) featuresValue += ',' + features; 
		//  창을 open 한다.
		var win = window.open(theURL, winName, featuresValue);
		win.focus();
		return win;
	},
	
	/**
	 * Enter Key 발생시 Callback 함수 호출
	 * @param {Object} callBack 함수 
	 */
	enterCallFn : function(callBackFn){
		if(window.event.keyCode == 13){
			callBackFn();
			return;
		}
		return;
	},
	
	/**
	 * 공통 Form panel
	 * @private
	 * @param {Object} items 
	 * @return {Ext.form.FormPanel}
	 */
	formPanel : function(items){
		return new Ext.FormPanel({
	        autoWidth : true,
	        autoHeight : true,
	        defaultType: 'textfield',
	        frame : false,
	        border:true,
			bodyStyle:{borderRight:'0px',borderBottom:'0px'},
			minButtonWidth : '40', //defaults to 75
	        items:items?items:null
	    });
	},
	
	/**
	 * ExtJS Grid에서 editor인 ComboBox가 Redering될때 현재 선택값이 나오도록 변환
	 * @param {Ext.form.ComboBox} combo
	 * @return {String} 선택된 combo의 description
	 */
	rendererCombo:function(combo){
        return function(value, meta, record){
		    var returnValue = value;
		    var valueField = combo.valueField;
		    var idx = combo.store.findBy(function(record) {
		        if(record.get(valueField) == value) {
		            returnValue = record.get(combo.displayField);
		            return true;
		        }
		    });
		    if(idx < 0 && value == 0) {
		        returnValue = '';
		    }
		    
		    return returnValue;
	    };
	},
	
	/**
	 * Grid Date type의 변환
	 * @param {TimeStamp object/Date} value
	 * @return {String/Date}
	 */
	rendererFormatDate : function (value){
		if(value instanceof Date)
			return value ? value.dateFormat('Y-m-d') : '';
		else
			return value;
    },
	
	/**
	 * Data Array를 Parameter로 받은 Combo
	 * @param {Array} data
	 * @return {Ext.form.Combobox}
	 */
	getArrayCombo : function(data){
		var config = {
			data : data
		};
		return extjsUtil.getArrayComboField(config);
	},
	
	/**
	 * form field에 사용되는 array combo
	 * config properties
	 * - id
	 * - title
	 * - fieldLabel
	 * - data
	 * @param {JSON} data
	 * @return {Ext.form.Combobox}
	 */
	getArrayComboField : function(config){
		var store = new Ext.data.SimpleStore({
			fields : ['key', 'value'],
			data : config.data
		});
		var combo = new Ext.form.ComboBox({
			id : config.id,
			store: store,
    		valueField: 'key',
          	displayField:'value',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
			lazyRender:true,
    		editable: false,
    		listeners : config.listeners,
    		value : (config.data[0] instanceof String)? config.data[0]:config.data[0][0] 
		});
		Ext.applyIf(combo,config);
		return combo;
	},
	
	/**
	 * Code Combo
	 * @param {String} id
	 * @param {String} groupId
	 * @return {Ext.form.ComboBox}
	 */
	getCodeCombo : function(config) {
		if (typeof config.valueField == "undefined") config.valueField = "systemCode";
		if (typeof config.displayField == "undefined") config.displayField = "text";
		
		var store = new Ext.data.JsonStore({
			autoLoad:true,						
			fields: [
				{name : config.valueField},
				{name : config.displayField}
			],
			root : 'codeList',
			url : 'admin/code.do?method=getCodeList',
			baseParams:{
				systemCode : config.systemCode
			}
		});
		
		var combo = new Ext.form.ComboBox({
			id : config.id,
			name : config.name,
			hiddenName : config.name,
			store: store,
    		valueField: config.valueField,
          	displayField: config.displayField,
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
			lazyRender:true,
    		editable: false,
    		allowBlank: config.allowBlank,
    		listeners : config.listeners
		});
      	Ext.apply(combo, config);
      	return combo;
	},
		
	/**
	 * ajax 500 Warnning 메세지
	 * @param {Object} result
	 * @param {Object} request
	 */
	failureMessage : function (result, request) {
    	try {
        	if(gMain!=undefined && gMain.selPanel!=undefined) {
        		gMain.selPanel.setLoading(false);
        	}
    	} catch(e) { console_logs('e', e); }

    	if(result.responseText!=undefined) {
    		Ext.MessageBox.show({
    	           title : 'Warnning',
    	           msg : '<table><tr><td><ul style=font-size:10pt>'+result.responseText+'</ul></td></tr></table>',
    	           buttons : Ext.MessageBox.OK,   
    	           //cls : 'blue_button',
    	           icon : Ext.MessageBox.WARNING
    	       });    		
    	}



	},
	
	/**
	 * Ext-js Submit 500 Warnning 메세지
	 * @param {Object} form
	 * @param {Object} action
	 */
	failureMessageSubmit : function (form, action) {                   
		Ext.MessageBox.show({
           title : 'Warnning',
           msg : '<table><tr><td><ul style=font-size:10pt>'+action.response.responseText+'</ul></td></tr></table>',
           buttons : Ext.MessageBox.OK,   
           //cls : 'blue_button',
           icon : Ext.MessageBox.WARNING
       });
	},
	
	/**
	 * 확인 창(close 버튼이 없는 확인 창)
	 * @param {String} title
	 * @param {String} msg
	 * @param {Function} fn
	 * @param {Object} scope
	 * @return {Ext.MessageBox}
	 */
	confirm: function(title, msg, fn, scope){
		return Ext.MessageBox.show({
            title : title,
            msg : msg,
            fn: fn,
            minWidth  : 300,
            //cls : 'blue_button',
            bodyCfg :{
            padding : ' 30 10 10 10',
            margins : ' 30 30 30 30'
            	
		},
           
            scope : scope,
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.MessageBox.YESNO,
            closable: false
        });
	},
	
	/**
	 * 선택된 record 삭제 확인 창(close 버튼이 없는 확인 창)
	 * @param {Ext.grid.GridPanel} grid
	 * @param {Function} callBackFn
	 * @param {Object} scope
	 */
	confirmDeleteRecords: function(grid, callBackFn, scope){
		if(!grid.getSelectionModel().getSelections() || grid.getSelectionModel().getSelections().length == 0)
			return;
			
		extjsUtil.confirm('확인','선택한 항목을 삭제하시겠습니까?',function(btn){
			if(btn == 'yes')
        		callBackFn.createDelegate(scope)();
		},scope);
	},
	
	/**
	 * System Log를 생성한다.
	 * opCode는 SEC_PAM_LOG_OP 테이블 참조
	 * @param {Object} opData
	 */
	insertLog : function(opData){
//		Ext.Ajax.request({
//			url:'log.do?method=insertLog',
//			params:{
//				opCode : opData.opCode,
//				objectId : opData.objectId,
//				objectData : opData.objectData
//			},			
//			failure: extjsUtil.failureMessage
//		});
	},
	
	/**
	 * 컬럼 필드 method
	 * @param {Array} columns
	 * @return {Ext.Panel}
	 * @private
	 */
	getColumnFiled : function(columns){
		return {
            layout : 'column',
            border : false,
            defaults : {
                columnWidth : .5,
                layout : 'form',
                border : false,
                defaultType: 'textfield'
            },
            items : [{
                items : columns[0]
            }, {
                items : columns[1]
            }]
        };
	},
	
	/**
	 * viewConfig
	 * @param {Boolean} forceFit
	 * @return {Object}
	 */
	viewConfig: function(forceFit) {
		return {
			forceFit : (forceFit?true:false),
			emptyText : '데이터가 없습니다.'
		}		
	},
	
	/**
	 * 공통 PagingToolbar
	 * @param {Number} pageSige
	 * @param {Ext.data.Store} store
	 * @return {Ext.PagingToolbar}
	 */
	pagingToolBar : function(pageSige, store){
		return new Ext.PagingToolbar({
	        pageSize: pageSige,
	        margins: '5 0 0 0',
	        store: store,
	        buttonAlign: 'center',
	        beforePageText:'',
	        displayInfo: true,
	        displayMsg: 'Displaying {0} - {1} of {2}',
	        emptyMsg: "데이터가 없습니다."
	    });	
	},
	
	/**
	 * 공통 PLM Style의 Custom PagingToolbar
	 * @param {Number} pageSige
	 * @param {Ext.data.Store} store
	 * @return {Ext.PagingToolbar}
	 */
	customPagingToolBar : function(pageSige, store){
		return new Ext.CustomPagingToolbar({
	        pageSize: pageSige,
	        margins: '5 0 0 0',
	        store: store,
	        buttonAlign: 'center',
	        beforePageText:'',
	        displayInfo: false,
	        displayMsg: 'Displaying {0} - {1} of {2}',
	        emptyMsg: "데이터가 없습니다."
	    });	
	},

	randomString: function(in_size) {
		var req_size = 0;
		if( in_size > 8)
		{
			req_size=8;
		}
		else
			req_size = in_size;
			
		var rand_no = Math.round(Math.random()*100000000*16);
		var unique = rand_no.toString(16);

		var my_str = unique.substring(0, req_size).toUpperCase();
		for(i=0; my_str.length < req_size; i++)
			my_str = "0" + my_str;
			
	    return my_str;
	},
	
	/**
	 * 중복된 배열을  merge 한다.
	 * @param {Array} duplicateArray
	 * @return {Array} uniqueArray
	 */
	mergeDuplicateArray : function(duplicateArray){
    	var uniqueArray = [];
    	
    	for (var i = 0; i < duplicateArray.length; i++) {
    		var isDuplicated = false;
    		for (var j = 0; j < uniqueArray.length; j++) {
    			if(uniqueArray[j] == duplicateArray[i])
    				isDuplicated = true;
    		}
    		
    		if(!isDuplicated)
    			uniqueArray[uniqueArray.length] = duplicateArray[i];
    	}
    	
    	return uniqueArray;
    },
    
    /**
     * Download 전용 iframe에 url 호출
     * @param {String} url
     */
    downloadIframe : function(url){
    	var iframe = Ext.getDom('downloadIframe');		
		if(iframe) iframe.src = url;
		else		
			Ext.DomHelper.append(document.body, {
			    tag: 'iframe',
			    id : 'downloadIframe',
			    frameBorder: 0,
			    width: 0,
			    height: 0,
			    css: 'display:none;visibility:hidden;height:1px;',
			    src: url
			});
    },
    
    /**
     * wait 메세지 출력
     * @param {Ext.MessageBox} message
     */
    showWaitBox : function(message){    	
    	if(message)
    		Ext.MessageBox.wait(message);
    	else
    		Ext.MessageBox.wait('저장 중 입니다...');
    },
    
    /**
     * watting message box를 사라지게 한다.
     */
    hideWaitBox : function(){
    	Ext.MessageBox.hide();
    },
    
    /**
     * 다국어지원을 위한 
     * @param {String} key
     * @return {String}
     */
    getMessage : function(key){
    	if(!arguments) return '';    	
    	var argStr = "String.format('" + eval('locale.'+key) + "'";
    	if(arguments.length > 1){
	    	for (var i = 1; i < arguments.length; i++) {
	    		argStr += ",'"+arguments[i] + "'";
	    	}
	    	argStr += ');'
    		return eval(argStr);
    	}
    	return eval('locale.'+key);
    },    
	
	/**
	 * 접근할 Flex의 Movie 객체를 얻어온다.
	 * @param {String} flex객체 id
	 * @return {Object} flex객체
	 * 사용법 : 
	 *    
	 *    만약 ExExternalInterface.swf 의 Flex객체에 접근 하고 싶다면
	 *    
	 *    var flexMovie =  extjsUtil.getFlexMovie("Flex객체 ID");   
	 *    flexMovie.sendToActionScript(value);
	 */
	getFlexMovie: function(movieName) {
        if(navigator.appName.indexOf("Microsoft") != -1) {
            return window[movieName];
        } else {
            return document[movieName];
        }
    },
	
	/**
	 * Flex에서 사용되는 contextMenu
	 * @param {Object} event object
	 *		x : 우클릭 이벤트가 발생한 x 좌표
	 * 		y : 우클릭 이벤트가 발생한 y 좌표
	 * 		panelId : callBack 함수를 호출 대상 Panel ID
	 * 		methodName : claaBack 함수 명 
	 */
	callBackFlexFn : function (argObj){
    	if(typeof(argObj.panelId) == 'undefined'){
    		Ext.MessageBox.alert('Warnning','호출될  panelId가 없습니다.');
    		return;
    	}
		var callFn = eval('Ext.getCmp("'+argObj.panelId+'").'+argObj.methodName).createDelegate(Ext.getCmp(argObj.panelId));
		//debugger;
		if(typeof(callFn) == 'undefined'){
			Ext.MessageBox.alert('Warnning','호출될  method가 없습니다.');
			return;
		}
		
		callFn(argObj);
	},
	
    nullToEmpty : function (str) {
        if (str == null) str = "";
        return str;
    },
    
    /**
     * Flex Component초기화 여부에 따른 Flext Bridge 얻기
     * @param {String} bridgeId
     * @return {Object} FABridge 객체
     * @deprecated
     */
    getFlexBridgeRoot : function(bridgeId) {
    	if(eval('FABridge.'+bridgeId)) {    		
    		return eval('FABridge.'+bridgeId+'.root()');    		
    	} else {    		
    		Ext.MessageBox.alert('알림','컴포넌트가 초기화되지 않았습니다. 잠시만 기다려주세요.');    		
    		return false;
    	}
    },
    
    /**
     * Flex 모듈을 사용한 Panel에서 VisibilityMode를 x-hide-nosize로 변경하는 plugin
     * <p>사용방법</p>
     * <p>Panel 생성 properties에 다음과 같이 추가한다.</p> 
     * <pre>plugins : extjsUtil.getVisibilityMode()</pre> 
     * @return {Ext.ux.plugin.VisibilityMode} 
     */
    getVisibilityMode : function(){
    	return new Ext.ux.plugin.VisibilityMode({hideMode:'nosize',elements:['bwrap']});
    },
    
    /**
    * MDW Workspace Panel에 다이렉트 접근 메소드
    * @param {} folderPuid : 과제 폴더 PUID
    * @param {} panelId : panel ID(basicInfoMainPanel : basicInfo panel, partListPanel : 파트리스트 panel)
    */
    redirectWSPanel : function(folderPuid, panelId){
    	// 기본 set Data 설정
    	var data = {
    		puid : folderPuid,
    		pobjectType : 'Folder',
    		itemPuid : ''    		
    	};
    	
		//서버에서 Folder에 등록된 itemPuid를 가져온다.
		Ext.Ajax.request({
			url:'partlist/assystr/partListManager.do?method=getLatestPartListMaster',
			params: {
				folderPuid : data.puid
	    	},
			scope : this,
			success : function(result, request){
				if(result.responseText){
					var json = Ext.util.JSON.decode(result.responseText);
					data.itemPuid = json.itemPuid;					
				}				
    			Ext.getCmp('mainPanel').changeMainPanel('wsMainPanel');
    			Ext.getCmp('wsMainPanel').setFolderData(data);
    			Ext.getCmp('wsMainPanel').changeMainPanel(panelId);    			
			},
			failure: extjsUtil.failureMessage
		});		
	},
	
	/**
	 * Flex에서 Call할 AlertMsgBox
	 * @param {} argObj
	 */
	callBackMsgBox : function (argObj){    	
    	Ext.MessageBox.alert(argObj.title,argObj.msg);    		
	}
};



//Numbur Fiels 1000자리 콤마. 

Ext.define("Ext.override.ThousandSeparatorNumberField", {
    override: "Ext.form.field.Number",
    
    /**
    * @cfg {Boolean} useThousandSeparator
    */
    useThousandSeparator: true,
    fieldStyle: 'text-align: right;',
    decimalPrecision: 0,
    /**
     * @inheritdoc
     */
    toRawNumber: function (value) {
        return String(value).replace(this.decimalSeparator, '.').replace(new RegExp(Ext.util.Format.thousandSeparator, "g"), '');
    },
    
    /**
     * @inheritdoc
     */
    getErrors: function (value) {
        if (!this.useThousandSeparator)
            return this.callParent(arguments);
        var me = this,
            errors = Ext.form.field.Text.prototype.getErrors.apply(me, arguments),
            format = Ext.String.format,
            num;

        value = Ext.isDefined(value) ? value : this.processRawValue(this.getRawValue());

        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return errors;
        }

        value = me.toRawNumber(value);

        if (isNaN(value.replace(Ext.util.Format.thousandSeparator, ''))) {
            errors.push(format(me.nanText, value));
        }

        num = me.parseValue(value);

        if (me.minValue === 0 && num < 0) {
            errors.push(this.negativeText);
        }
        else if (num < me.minValue) {
            errors.push(format(me.minText, me.minValue));
        }

        if (num > me.maxValue) {
            errors.push(format(me.maxText, me.maxValue));
        }

        return errors;
    },
    
    /**
     * @inheritdoc
     */
     valueToRaw: function (value) {
        if (!this.useThousandSeparator)
            return this.callParent(arguments);
        var me = this;

        var format = "000,000";
        for (var i = 0; i < me.decimalPrecision; i++) {
            if (i == 0)
                format += ".";
            format += "0";
        }
        value = me.parseValue(Ext.util.Format.number(value, format));
        value = me.fixPrecision(value);
        value = Ext.isNumber(value) ? value : parseFloat(me.toRawNumber(value));
        value = isNaN(value) ? '' : String(Ext.util.Format.number(value, format)).replace('.', me.decimalSeparator);
        return value;
    },
    
    /**
     * @inheritdoc
     */
    getSubmitValue: function () {
        if (!this.useThousandSeparator)
            return this.callParent(arguments);
        var me = this,
            value = me.callParent();

        if (!me.submitLocaleSeparator) {
            value = me.toRawNumber(value);
        }
        return value;
    },
    
    /**
     * @inheritdoc
     */
    setMinValue: function (value) {
        if (!this.useThousandSeparator)
            return this.callParent(arguments);
        var me = this,
            allowed;

        me.minValue = Ext.Number.from(value, Number.NEGATIVE_INFINITY);
        me.toggleSpinners();

        // Build regexes for masking and stripping based on the configured options
        if (me.disableKeyFilter !== true) {
            allowed = me.baseChars + '';

            if (me.allowExponential) {
                allowed += me.decimalSeparator + 'e+-';
            }
            else {
                allowed += Ext.util.Format.thousandSeparator;
                if (me.allowDecimals) {
                    allowed += me.decimalSeparator;
                }
                if (me.minValue < 0) {
                    allowed += '-';
                }
            }

            allowed = Ext.String.escapeRegex(allowed);
            me.maskRe = new RegExp('[' + allowed + ']');
            if (me.autoStripChars) {
                me.stripCharsRe = new RegExp('[^' + allowed + ']', 'gi');
            }
        }
    },
    
    /**
     * @private
     */
    parseValue: function (value) {
        if (!this.useThousandSeparator)
            return this.callParent(arguments);
        value = parseFloat(this.toRawNumber(value));
        return isNaN(value) ? null : value;
    }
});