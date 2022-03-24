Ext.define('Rfx.app.Util', {

    getBoolean: function (v) {

        switch (typeof v) {
            case 'string': {
                var val = v;
                if (v == undefined || v == null) {
                    val = true;
                } else if (v == 'true') {
                    val = true;
                } else if (v == 'false') {
                    val = false;
                }
                return val;
            }
                break;
            case 'boolean':
                return v;
            case 'number':
                return v == 0 ? false : true;
        }
    },
    trim: function (s) {
        if (s == undefined) {
            return undefined;
        }
        if (s == null) {
            return null;
        }

        return s.replace(/^\s+|\s+$/gm, '');
    },
    removeSpace: function (s) {
        if (s == undefined) {
            return undefined;
        }
        if (s == null) {
            return null;
        }

        return s.replace(/\s/g, "");
    },
    getNextday: function (d) {
        var toDay = new Date();
        toDay.setDate(toDay.getDate() + d);
        return toDay;
    },
    getByNextday: function (inDate, d) {
        inDate.setDate(inDate.getDate() + d);
        return inDate;
    },
    getFullYear: function () {
        var today = new Date();
        return today.getFullYear();
    },
    getMonth: function () {
        var today = new Date();
        var s = (today.getMonth() + 1) + '';
        if (s.length == 1) {
            return '0' + s;
        } else {
            return s;
        }

    },
    getLastDay: function () {
        var today = new Date();
        var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return last.getDate();

    },
    yyyymm: function (dateIn, separ) {
        //console_logs('<Util 1>dateIn type', typeof dateIn);
        if (typeof dateIn == 'string') {
            return dateIn;
        } else {
            if (separ == null) {
                separ = '-';
            }
            var yyyy = dateIn.getFullYear();
            var mm = (dateIn.getMonth() + 1) + '';
            if (mm.length < 2) {
                mm = '0' + mm;
            }

            return String(yyyy + separ + mm); // Leading zeros for mm and dd
        }
    },
    yyyymmdd: function (dateIn, separ) {
        //console_logs('<Util 1>dateIn type', typeof dateIn);
        //console_logs('<Util 1>dateIn ', dateIn);
        if (typeof dateIn == 'string') {
            return dateIn;
        } else {
            if (separ == null) {
                separ = '-';
            }
            var yyyy = dateIn.getFullYear();
            var mm = (dateIn.getMonth() + 1) + '';
            var dd = (dateIn.getDate()) + '';
            if (mm.length < 2) {
                mm = '0' + mm;
            }
            if (dd.length < 2) {
                dd = '0' + dd;
            }

            return String(yyyy + separ + mm + separ + dd); // Leading zeros for mm and dd
        }
    },
    hhmmss: function (date) {
        var seconds = date.getSeconds() + '';
        var minutes = date.getMinutes() + '';
        var hour = date.getHours() + '';

        if (seconds.length == 1) {
            seconds = '0' + seconds;
        }
        if (minutes.length == 1) {
            minutes = '0' + minutes;
        }
        if (hour.length == 1) {
            hour = '0' + hour;
        }

        return hour + ':' + minutes + ':' + seconds;

    },
    mmdd: function (dateIn, separ) {
        //console_logs('<Util 1>dateIn type', typeof dateIn);
        //console_logs('<Util 1>dateIn ', dateIn);
        if (typeof dateIn == 'string') {
            return dateIn;
        } else {
            if (separ == null) {
                separ = '-';
            }
            //var yyyy = dateIn.getFullYear();
            var mm = (dateIn.getMonth() + 1) + '';
            var dd = (dateIn.getDate()) + '';
            if (mm.length < 2) {
                mm = '0' + mm;
            }
            if (dd.length < 2) {
                dd = '0' + dd;
            }

            return String(mm + separ + dd); // Leading zeros for mm and dd
        }
    },
    sleep: function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    },
    //create random integer
    RandomInteger: function () {
        return Math.round(Math.random() * 100000000 * 16);
    },
    RandomString: function (in_size) {
        var req_size = 0;
        if (in_size > 8) {
            req_size = 8;
        }
        else {
            req_size = in_size;
        }

        var rand_no = Math.round(Math.random() * 100000000 * 16);
        var unique = rand_no.toString(16);

        var my_str = unique.substring(0, req_size).toUpperCase();
        for (var i = 0; my_str.length < req_size; i++)
            my_str = "0" + my_str;

        return my_str;
    },
    insert: function (arr, pos, from) {
        //console_logs('<Util 1>insert arr', arr);
        arr.splice(pos, 0, from);
        //console_logs('<Util 1>insert arr', arr);
        return arr;
    },
    machineDatas: null,
    machineInfos: null,
    //설비정보 읽기
    getMachineInfo: function () {

    },
    getMachineQty: function (mc_code) {

        if (mc_code == null) {
            return null;
        }
        if (this.machineDatas != null) {
            for (var i = 0; i < this.machineDatas.length; i++) {
                var o = this.machineDatas[i];

                if (o != null && o['mc_code'] == mc_code) {
                    //console_logs('<Util 1>getMachineQty o', o);
                    return o;
                }
            }
        }

        return null;
    },
    mchnStore: null,
    mc_list: null,
    mc_tool_no: 1,
    mc_tool_max: 4,
    getMcCodes: function () {

        var arr = [];

        if (this.mc_list != null) {
            for (var i = 0; i < this.mc_list.length; i++) {
                arr[i] = (this.mc_list[i])['mchn_code'];
            }
        }

        return arr;

    },
    redrawMcList: function () {

//		this.sleep(100000);
        //console_logs('<Util 1>mainTab ', gMain.mainTabs);
        //console_logs('<Util 1>mainTab items', gMain.mainTabs.items);

        setInterval(function () {

            if (gUtil.mc_tool_no == gUtil.mc_tool_max) {
                gUtil.mc_tool_no = 1;
            } else {
                gUtil.mc_tool_no++;
            }

            gUtil.mchnStore.getProxy().setExtraParam('tool_no', '' + gUtil.mc_tool_no);

            gUtil.mc_list = [];
            gUtil.mchnStore.load(function (records) {
                //console_logs('<Util 1>mcstore records', records);
                for (var i = 0; i < records.length; i++) {
                    var o = records[i]['data'];
                    if (o != undefined && o != null) {
                        gUtil.mc_list.push(o);
                    }
                    //gUtil.mc_list[i] = records[i]['data'];
                }
                //console_logs('<Util 1>gUtil.mc_list', gUtil.mc_list );

                var myItems = gMain.mainTabs.items.items;
                //console_logs('<Util 1>======> myItems', myItems);
                for (var i = 0; i < myItems.length; i++) {
                    var item = myItems[i];
                    //console_logs('<Util 1>======> tab item id', item['id']);
                    if (item['id'] == 'project-total') {
                        item.redrawTotalChart31();
                    }
                }

            });

        }, 100000);


    },
    redrawTotalChartAll: function () {
        var myItems = gMain.mainTabs.items.items;
        //console_logs('<Util 1>======> myItems', myItems);
        for (var i = 0; i < myItems.length; i++) {
            var item = myItems[i];
            //console_logs('<Util 1>======> tab item id', item['id']);
            if (item['id'] == 'project-total') {
                item.redrawTotalChartAll();
            }
        }
    },
    redrawProduceAll: function () {
        var myItems = gMain.mainTabs.items.items;
        //console_logs('<Util 1>======> myItems', myItems);
        for (var i = 0; i < myItems.length; i++) {
            var item = myItems[i];
            //console_logs('<Util 1>======> tab item id', item['id']);
            if (item['id'] == 'produce-state') {
                item.redrawProduceAll();
            }
        }
    },
    readInterval: 5000, //Read Interval 5초
    startFc: function () {

        //this.getMachineInfo();

        setInterval(function () {
            if (vSYSTEM_TYPE == 'HANARO') {
                console_logs('<Util 1>startFc', ' - skipped. reason: not project-total group');
            } else {

                if (vSYSTEM_TYPE_SUB != 'HEAVY4') {
                    //console_logs('<Util 1>mc_codes', gUtil.getMcCodes());
                    //console_logs('<Util 1>gMain.selectedMenuGroup', gMain.selectedMenuGroup);
                    if (gMain.selectedMenuGroup == 'project-total') {

                        /* 임시로막음 */
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/generalData.do?method=getMachineQty',
                            params: {
                                mc_codes: gUtil.getMcCodes()
                            },
                            success: function (response, request) {
                                //console_logs('<Util 1>response.responseText', response.responseText);
                                var r = response.responseText;
                                if (r != null && r.length > 0) {
                                    var val = Ext.JSON.decode(response.responseText);
                                    //console_logs('<Util 1>val', val);
                                    gUtil.machineDatas = val['datas'];
                                    //console_logs('<Util 1>machineDatas', gUtil.machineDatas);
                                }
                            }
                        });


                    } else {

                        if (gUtil.machineDatas != undefined && gUtil.machineDatas != null && gUtil.machineDatas.length > 0) {
                            for (var i = 0; i < gUtil.machineDatas.length; i++) {

                                try {
                                    var o = gUtil.machineDatas[i];
                                    //                    		console_logs('<Util 1>gUtil.machineDatas[i] o', o);
                                    //
                                    //                    		var date_code = o['date_code'];
                                    //                    		console_logs('<Util 1>date_code', date_code);
                                    //
                                    //                    		var date = Ext.Date.parse(date_code,'YmdHis');
                                    //                    		console_logs('<Util 1>date', date);
                                    //
                                    //                    		var newDateObj = date.getTime() + 5*1000;
                                    //                    		console_logs('<Util 1>newDateObj', newDateObj);
                                    //
                                    //                    		var now1minPrev = Ext.util.Format.date(newDateObj,'YmdHis');
                                    //                    		console_logs('<Util 1>now1minPrev', now1minPrev);
                                    //
                                    //                    		o['date_code'] = now1minPrev;
                                    o['qty'] = 0;
                                } catch (e) {
                                    console_logs('<Util 1>erorr', e);
                                }

                            }
                        }


                        //console_logs('<Util 1>gUtil.machineDatas', gUtil.machineDatas);
                        console_logs('<Util 1>startFc', ' - skipped. reason: not project-total group');
                    }
                }
            }

        }, this.readInterval);

    },
    loadFc: function (o, pos) {

        if (this.mc_list == null || this.mc_list.length == 0) {
            console_logs('<Util 1>알림', '설비목록 mc_list를 찾을 수 없습니다.');
            return;
        }

        var mc_obj = this.mc_list[pos];
        console_logs('<Util 1>loadFc this.mc_list', this.mc_list);
        console_logs('<Util 1>loadFc pos', pos);
        console_logs('<Util 1>loadFc mc_obj', mc_obj);

        if (mc_obj != null && mc_obj != undefined) {

            gUtil.mc_code = mc_obj['mchn_code'];
            var name_ko = mc_obj['name_ko'];
            var plan5sec = mc_obj['plan5sec'];

//			o.setTitle(
//					{text: '목표수량: ' + Ext.util.Format.number(mc_obj['target_qty'], '0,00/i') + ' 매/일',
//						floating: true,
//					    align: 'left'
//
//
//			});

            //o.setTitle(mc_code);

            //console_logs('<Util 1>loadFc renderTo', (o['renderTo'])['id']);
            var id = (o['renderTo'])['id'];

            document.getElementById(id + '-title').innerHTML = '<small>[' + gUtil.mc_code + ']<small> ' + name_ko;

            // set up the updating of the chart each second
            var series1 = o.series[0];
            var series2 = o.series[1];
            setInterval(function () {

                if (gMain.selectedMenuGroup == 'project-total') {

                    var val = gUtil.getMachineQty(gUtil.mc_code);

                    if (val != null && val['date_code'] != null && val['date_code'] != undefined) {
                        var date_code = val['date_code'];
                        var prev_date_code = o.date_code;

                        console_logs('<Util 1>date_code', date_code);
                        console_logs('<Util 1>prev_date_code', prev_date_code);

                        if (date_code != null && date_code != undefined) {

                            //if(date_code!=prev_date_code) {
                            try {
                                var x = (Ext.Date.parse(val['date_code'], 'YmdHis')).getTime(); // yyyyMMddHHmmss
                                //var x = (new Date()).getTime();
                                console_logs('<Util 1>loadFc x', x);
                                y = val['qty'];
                                console_logs('<Util 1>loadFc y', y);
                                try {
                                    series1.addPoint([x, y], true, true);
                                    console_logs('<Util 1>success addpoint 1', [x, y]);
                                } catch (e) {
                                    console_logs('<Util 1>eries1.addPoint([x, y]', e);
                                }
                                try {
                                    series2.addPoint([x, plan5sec], true, true);
                                    console_logs('<Util 1>success addpoint 2', [x, plan5sec]);
                                } catch (e) {
                                    console_logs('<Util 1>eries1.addPoint([x, y]', e);
                                }

                            } catch (e) {
                                console_logs('<Util 1>loadFc error', e);
                            }

                            //}
                            o.date_code = date_code;

                        }


                    }
                }

            }, 5000);

        }//endofif

    },
    createRandDataTarget: function (pos) {
        var data = [];

        if (this.mc_list != null && this.mc_list.length > 0) {
            try {
                var mc_obj = this.mc_list[pos];
                console_logs('<Util 1>createRandDataTarget mc_obj', mc_obj);
                var plan5sec = mc_obj['plan5sec'];

                var
                    time = (new Date()).getTime(),
                    i;

                for (i = -29; i <= -14; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: plan5sec
                    });
                }
            } catch (e) {
                console_logs('<Util 1>createRandDataTarget error', e);
            }
        }


        return data;
    },
    createRandDataReal: function (pos) {
        var data = [];
        if (this.mc_list != null && this.mc_list.length > 0) {
            try {
                var mc_obj = this.mc_list[pos];
                console_logs('<Util 1>createRandDataReal mc_obj', mc_obj);

                var plan5sec = mc_obj['plan5sec'];


                var time = (new Date()).getTime(),
                    i;

                for (i = -29; i <= -14; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: 0
                    });
                }
            } catch (e) {
                console_logs('<Util 1>createRandDataReal error', e);
            }

        }

        return data;
    },

    propertyTabPanel: null,
    vSELECTED_PCSCODE: '',
    vSELECTED_UNIQUE_ID: '',
    deptUserStore: null,
    MyUtf8: {

        // public method for url encoding
        encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // public method for url decoding
        decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    },


    stripQuot: function (inStr) {
//		console_logs('<Util 1>=>inStr', inStr);
//		if(typeof(inStr) == 'object') {
//			var inObj_str = '';
//			for(var i=0; i<inStr.length; i++) {
//				inObj_str = inObj_str + (i == 0 ? inStr[i] : ',' + inStr[i]);
//			}
//			return inObj_str;
//		}
//			inStr = inStr.replace(/\"/gi, '&quot;');
//			return inStr;
//
        switch (typeof(inStr)) {
            case 'object':
                var inObj_str = '';
                for (var i = 0; i < inStr.length; i++) {
                    inObj_str = inObj_str + (i == 0 ? inStr[i] : ',' + inStr[i]);
                }
                return inObj_str;
                break;
            case 'string':
                inStr = inStr.replace(/\"/gi, '&quot;');
                return inStr;
                break;
            default:
                return inStr;

        }


    },

    stripQuotRecover: function (inStr) {

        inStr = inStr.replace(/&quot;/gi, '\"');

        return inStr;
    },

    //Load javascript Source from div
    loadVar: function (key) {


        switch (key) {
            /*
             case 'cbbData':
             alert(key);

             break;
             */
            default:
                var pre = document.getElementById(key);
                if (pre == null) {
                    alert('cannot find defined script "pre" for ' + key);
                } else {
                    return eval(pre.innerHTML);
                }
        }

    },

    //load javascript
    LoadJs: function (url) {
        if (url != null && url.length > 0) {
            var js = document.createElement('script');

            js.type = "text/javascript";
            js.src = CONTEXT_PATH + url;

//    		 console_log('js.src=' + js.src);
            try {
                document.body.appendChild(js);
            } catch (e) {
                console_log("script in page exception in appendChild: " + utl + e);
                lfn_gotoHome();
            }

//    		 console_log('LoadJs OK.');
        }

    },

    getUniqueIdSelected: function (value, p, record) {
        var uid = record.get('unique_id');
//    	console_log('getUniqueIdSelected=' +uid);
        return uid;
    },
    //pluggable renders
    renderUser: function (value, p, record) {
//    	console_log(value);
//    	console_log(record);
//    	console_log(record.get('creator') );
//    	console_log(record.get('creator_uid') );
//    	console_log(record.data.user_id );
//    	console_log(record.data.user_name );

//        return Ext.String.format(
//            '<a href="javascript:popupUser(\'{0}\')" style="color:#98C8FF;font-weight:bold;">{1}</a>',
//            record.get('creator_uid'), value
//        );

        return Ext.String.format(
            '<a href="javascript:gUtil.popupUserByUserId(\'{0}\')" onclick="gUtil.popupUserByUserId(\'{0}\')" >{0}</a>',
            value
        );
//        return Ext.String.format(
//                '<font color=#15428B style="cursor:pointer;" onclick="popupUserByUserId(\'{0}\')" >{0}</font>',
//                value, value
//            );
    },

    curCodeName: null,
    codeStore: {},
    makeCodeStore: function (curCodeName, storeId) {

        if (curCodeName == null) {
            return;
        }

        if (this.codeStore[storeId] == undefined || this.codeStore[storeId] == null) {
            this.codeStore[storeId] = Ext.create('Rfx.store.GeneralCodeStore', {
                hasNull: false,
                parentCode: curCodeName
            });

            (this.codeStore[storeId]).load();
        }
    },
    makeClaastStore: function (curCodeName, storeId, level) {

        if (curCodeName == null) {
            return;
        }

        if (this.codeStore[storeId] == undefined || this.codeStore[storeId] == null) {
            this.codeStore[storeId] = Ext.create('Mplm.store.ClaastStore', {
                identification_code: curCodeName,
                level1: level
            });

            (this.codeStore[storeId]).load();
        }
    },
    getCodeValue: function (storeId, value) {

        //console_logs(storeId, value);
        try {
            //console_logs('<Util 1>>>>> this.codeStore', this.codeStore);
            var store = this.codeStore[storeId];
            //onsole_logs('<<<<', value);
            if (store != undefined && store != null) {

                for (var i = 0; store.getCount(); i++) {
                    var rec = store.getAt(i);
                    //console_logs('<Util 1>rec', rec);
                    if (rec == null) {
                        return value;
                    } else {
                        var systemCode = rec.get('systemCode');
                        if (systemCode == value) {
                            return rec.get('codeName');
                        }
                    }
                }
                return value;
            }
        } catch (e) {
            console_logs('<Util 1>getCodeValue error', getCodeValue);
        }

        return value;
    },
    getClaastValue: function (storeId, value) {

        //console_logs(storeId, value);
        try {
            //console_logs('<Util 1>>>>> this.codeStore', this.codeStore);
            var store = this.codeStore[storeId];
            //onsole_logs('<<<<', value);
            if (store != undefined && store != null) {

                for (var i = 0; store.getCount(); i++) {
                    var rec = store.getAt(i);
                    //console_logs('<Util 1>rec', rec);

                    if (rec == null) {
                        return value;
                    } else {
                        var class_code = rec.get('class_code');
                        if (class_code == value) {
                            return rec.get('class_name');
                        }
                    }
                }
                return value;
            }
        } catch (e) {
            console_logs('<Util 1>getCodeValue error', getCodeValue);
        }

        return value;
    },
    renderCodeName: function (params) {

        var codeName = params['codeName'];
        this.curCodeName = codeName;
        var storeId = params['storeId'];

        //console_logs('<Util 1>renderCodeName storeId', storeId);
        this.makeCodeStore(codeName, storeId);

        return function (value, metadata, record, rowIndex, colIndex, store) {

//    		 console_logs('<Util 1>value', value);
//    		 console_logs('<Util 1>metadata', metadata);
//    		 console_logs('<Util 1>record', record);
//    		 console_logs('<Util 1>rowIndex', rowIndex);
//    		 console_logs('<Util 1>colIndex', colIndex);
//    		 console_logs('<Util 1>store', store);

            if (gMain.selPanel.multiGrid == true) {
                var colIndex = colIndex - 1
                //console_logs('<Util 1>colIndex',colIndex);
            }

            if (value == 'null' || value == null) {
                return '???';
            } else {
                //return value;
                var disp = gUtil.getCodeValue(gMain.selectedMenuId + '-' + 'codeRender' + codeName, value);
                //console_logs('<Util 1>disp', disp);
                return disp;
            }

        };
    },

    renderClaastName: function (params) {

        var codeName = params['codeName'];
        var level = params['level'];
        this.curCodeName = codeName;
        var storeId = params['storeId'];

        //console_logs('<Util 1>renderCodeName storeId', storeId);
        this.makeClaastStore(codeName, storeId, level);

        return function (value, metadata, record, rowIndex, colIndex, store) {

            if (gMain.selPanel.multiGrid == true) {
                var colIndex = colIndex - 1
                //console_logs('<Util 1>colIndex',colIndex);
            }

            if (value == 'null' || value == null) {
                return '???';
            } else {
                //return value;
                var disp = gUtil.getClaastValue(gMain.selectedMenuId + '-' + 'claastRender' + codeName + '-' + level, value);
                //console_logs('<Util 1>disp', disp);
                return disp;
            }

        };
    },

    renderPartuid: function (params) {

        return function (value, metadata, record, rowIndex, colIndex, store) {

            if (value == 'null' || value == null) {
                return '';
            } else {

//    			console_log(params.Partuid);


                console_log(params.Partuid + '[' + value + ']');
                return Ext.String.format(
                    '<a href="javascript:popupPartByUserId(\'{1}\')" onclick="popupPartByUserId(\'{1}\')" >{0}</a>',
                    value, record.get(params.Partuid)
                );

            }

        };
    },

    renderItemcode: function (value, p, record) {


        return Ext.String.format(
            '<a href="javascript:popupPartByUserId(\'{1}\')" onclick="popupPartByUserId(\'{1}\')" >{0}</a>',
            //Record.get('unique_id')
            value, record.get('unique_id')
        );

    },


    renderUseruid: function (params) {

        return function (value, metadata, record, rowIndex, colIndex, store) {

            if (value == 'null' || value == null) {
                return '';
            } else {

//    			console_log(params.Useruid);


                console_log(params.Useruid + '[' + value + ']');
                return Ext.String.format(
                    '<a href="javascript:popupUserById(\'{1}\')" onclick="popupUserById(\'{1}\')" >{0}</a>',
                    value, record.get(params.Useruid)
                );

            }

        };
    },

    renderPohistoryItemCode: function (value, p, record) {
        var child = record.get('unique_id');

        return Ext.String.format(
            '<a href="#" onclick="popupPohistory(\'{0}\', \'{1}\')" >{1}</a>',
            child, value
        );
    },

    renderNumber: function (value, p, record) {
        if (typeof value == 'number') {
            return Ext.util.Format.number(value, '0,00/i');
        } else {
            return value;
        }
    },

    renderDigit: function (value, p, record) {
        return Ext.util.Format.number(value, '0,00.000/i');
    },

    renderNumberBlank: function (value, p, record) {
        if (value == null || value == '') {
            return '-';
        }
        return Ext.util.Format.number(value, '0,00/i');
    },

    renderDate: function (value, p, record) {
        //console_logs('<Util 1>value', value);
        var dt = new Date(value);
        if (!isNaN(dt.getDay())) {
            return Ext.util.Format.date(dt, 'Y-m-d');
        }
        return '-';
    },

    renderSimpleDate: function (params) {

        return function (value, metadata, record, rowIndex, colIndex, store) {
            var indexId = params.dataIndex;

            if (value == null) {
                return null;
            } else {
                var len = value.length;
                if (len < 11) {
                    return value;
                } else {
                    var v = value.substring(0, 10);
                    record.set(indexId, v);
                    record.modified = {};
                    return v;
                }
            }
        };

    },

    renderDetailDate: function (params) {

        return function (value, metadata, record, rowIndex, colIndex, store) {
            var indexId = params.dataIndex;

            if (value == null) {
                return null;
            } else {
                var len = value.length;
                if (len < 16) {
                    return value;
                } else {
                    var v = value.substring(5, 16);
                    record.set(indexId, v);
                    record.modified = {};
                    return v;
                }
            }
        };

    },

    //Detect if the browser is IE or not.
    //If it is not IE, we assume that the browser is NS.
    IE: document.all ? true : false,

    //If NS -- that is, !IE -- then set up for mouse capture
    //if (!IE) document.captureEvents(Event.MOUSEMOVE)

    //Set-up to use getMouseXY function onMouseMove
    getMouseXY: document.onmousemove,

    //Temporary variables to hold mouse x-y pos.s
    tempX: 0,
    tempY: 0,

    //Main function to retrieve mouse x-y pos.s

    getMouseXY: function (e) {
        if (this.IE) { // grab the x-y pos.s if browser is IE
            this.tempX = event.clientX + document.body.scrollLeft;
            this.tempY = event.clientY + document.body.scrollTop;
        } else {  // grab the x-y pos.s if browser is NS
            this.tempX = e.pageX;
            this.tempY = e.pageY;
        }
        // catch possible negative values in NS4
        if (this.tempX < 0) {
            this.tempX = 0
        }
        if (this.tempY < 0) {
            this.tempY = 0
        }
        // show the position values in the form named Show
        // in the text fields named MouseX and MouseY
        //document.Show.MouseX.value = tempX
        //document.Show.MouseY.value = tempY
        return true
    },


    checkDup1: function (a) {
        for (var i = 0; i <= a.length; i++) {
            for (var j = i; j <= a.length; j++) {
                if (i != j && a[i] == a[j]) {
                    return true;
                }
            }
        }
        return false;
    },

    checkDup2: function (a) {
        var counts = [];
        for (var i = 0; i <= a.length; i++) {
            if (counts[a[i]] === undefined) {
                counts[a[i]] = 1;
            } else {
                return true;
            }
        }
        return false;
    },

    removeDupArray: function (duplicatesArray) {
        if (!Ext.isArray(duplicatesArray)) {
            return undefined;
        }
        var uniqueArr = duplicatesArray.filter(function (elem, pos) {
            return duplicatesArray.indexOf(elem) === pos;
        });
        return uniqueArr;
    },

    arrRemove: function (arr, v) {
        //console_logs('<Util 1>arrRemovearr', arr);
        //console_logs('<Util 1>arrRemove v', v);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == v) {
                arr.splice(i, 1);
                break;
            }
        }
        //console_logs('<Util 1>arrRemovearr', arr);
        return arr;
    },
    arrRemoveArr: function (arr, curArr) {
        for (var i = 0; i < curArr.length; i++) {
            arr = this.arrRemove(arr, curArr[i]);
        }
        return arr;
    },

    stripHighlight: function (v) {
        if (v == null) {
            return '';
        }
        return v.replace(new RegExp('<sPan style="background:#FFEF9D;">', "g"), '').replace(new RegExp('</sPan>', "g"), '');
    },

    disable: function (action) {
        if (action != null) {
            action.disable();
        }
    },
    enable: function (action) {
        if (action != null) {
            action.enable();
        } else {
            console_logs('<Util 1>gu.enable', 'action is null');
        }
    },

    copyObj: function (o) {
        var out = {};
        for (var attrname in o) {
            //console_logs('<Util 1>attrname', attrname);
            out[attrname] = o[attrname];
        }
        return out;
    },
    copyObjArr: function (arr) {
        var out = [];
        for (var i = 0; i < arr.length; i++) {
            out.push(this.copyObj(arr[i]));
        }
        return out;
    },

    fillZero: function (code, len) {

        var out = code;
        while (out.length < len) {

            out = "0" + out;
        }
        return out;
    },
    makeAutoCodePaper: function (maker_code, item_name, description, comment, remark) {
        var item_name2 = this.fillZero(item_name, 3);
        var description2 = this.fillZero(description, 3);
        var comment2 = this.fillZero(comment, 4);
        var remark2 = this.fillZero(remark, 4);
        var maker_code2 = maker_code;

        if (maker_code2 == null) {
            maker_code2 = "00";
        }

        var item_code = maker_code2 + item_name2 + description2 + comment2 + remark2;
        //console_logs('<Util 1>maker_code2', maker_code2);
        return item_code;
    },
    loadFcOld: function (o) {

        //console_logs('<Util 1>loadFc', o);
        // set up the updating of the chart each second
        var series1 = o.series[0];
        setInterval(function () {
            var x = (new Date()).getTime(), // current time
                y = Math.random() * 500 + 200;
            try {
                series1.addPoint([x, y], true, true);
            } catch (e) {
            }
        }, 5000);

        var series2 = o.series[1];
        setInterval(function () {
            var x = (new Date()).getTime(), // current time
                y = Math.random() * 500 + 200;
            try {
                series2.addPoint([x, y], true, true);
            } catch (e) {
            }
        }, 5000);
    },
    createRandData: function () {
        var data = [],
            time = (new Date()).getTime(),
            i;

        for (i = -19; i <= 0; i += 1) {
            data.push({
                x: time + i * 5000,
                y: Math.random() * 500 + 200
            });
        }
        return data;
    },
    /****************************************************************
     * 좌측 여백 삭제
     *
     * @param    str    문자
     * @return   str
     ***************************************************************/
    gfn_ltrim: function (str) {
        var s = new String(str);
        return (s.substr(0, 1) == " ") ? this.gfn_ltrim(s.substr(1)) : s;
    },

    /****************************************************************
     * 우측 여백 삭제
     *
     * @param    str    문자
     * @return   str
     ***************************************************************/
    gfn_rtrim: function (str) {
        var s = new String(str);
        return (s.substr(s.length - 1, 1) == " ") ? this.gfn_rtrim(s.substring(0, s.length - 1)) : s;
    },

    /****************************************************************
     * 좌우측 여백 삭제
     *
     * @param    str    문자
     * @return   str
     ***************************************************************/
    gfn_trim: function (str) {
        return this.gfn_ltrim(this.gfn_rtrim(str));
    },

    sortedSet: function (arr) {
        var a = this.setUniqueArray(arr);
        return a.sort();
    },
    Comma2Area: function (str) {
        if (str == null || str.length == 0) {
            return "";
        } else {
            var arr = str.split(',');

            var t = '';
            for (var i = 0; i < arr.length; i++) {
                var s = this.trim(arr[i]);
                if (t == '') {
                    t = s;
                } else {
                    t = t + '\n' + s;
                }
            }

            return t;
        }

    },
    strComma2Array: function (s) {
        var arr1 = [];
        if (s != null && s != '') {

            var arr = s.split(',');
            for (var j = 0; j < arr.length; j++) {
                var s = gu.trim(arr[j]).toUpperCase();
                arr1.push(s);
            }
            arr1 = arr1.sort();
            return arr1;

        } else {
            return arr1;
        }
    },
    Comma2Div: function (str) {

        var arr = this.strComma2Array(str);

        if (arr == null || arr.length == 0) {
            return "";
        } else {
            var t = '';
            for (var i = 0; i < arr.length; i++) {
                var s = arr[i];
                if (t == '') {
                    t = s;
                } else {
                    t = t + '<br>' + s;
                }
            }
            return t;
        }

    },
    /****************************************************************
     * 숫자를 포멧이 갖추어진 문자열로 바꿈
     *
     * @param    value    숫자형 문자
     * @return   format    변환할 포멧
     * 예) gfn_formattedVal(value , "###3.#####") : 천 자리수 마다 콤마를 찍고 소숫점 5자리 까지 표현
     ***************************************************************/
    gfn_formattedVal: function (value, format) {
        value = "" + value;

        if (!format)
            return value;

        var sp = parseInt(format.charAt(3));

        if (!sp)
            return value;

        var pos = 0;
        var ret = "";
        var vSplit = value.split('.');
        var fSplit = format.split('.');
        var fp = fSplit[1];
        var fv = vSplit[1];
        var lv = vSplit[0];
        var len = lv.length;

        for (var i = len % sp; i < len; i += sp) {
            if (i == 0 || lv.charAt(i - 1) == '-')
                ret += lv.substring(pos, i);
            else
                ret += lv.substring(pos, i) + ',';
            pos = i;
        }

        ret += lv.substring(pos, len);

        if (!fv)
            fv = "";
        if (!fp)
            fp = "";

        var len1 = fp.length;
        var len2 = fv.length;

        if (len1)
            ret += '.' + fv.substring(0, len1) + fp.substring(len1, len2);

        if (ret.indexOf("#") != -1) {
            ret = ret.substring(0, ret.indexOf("#"));
            var vTemp = ret.substring(ret.indexOf(".") + 1, ret.length);
            if (vTemp == null || vTemp == "") {
                ret = ret.substring(0, ret.indexOf("."));
            }
        }

        return ret;
    },


    /****************************************************************
     * 주어진 문자열이 수치data인지 검사
     *
     * @param    src    문자
     * @return   boolean
     ***************************************************************/
    gfn_isNum: function (src) {
        var dst = src.replace(",", "");
        dst = this.gfn_trim(dst, ' ');
        return !isNaN(Number(dst));
    },
    rack_list0: null,
    rack_list1: null,
    rack_list2: null,
    rack_list3: null,

    mesProductCategory: null,

    //표준 프로세스 목록
    mesStdProcess: null,
    mesUsePcstpl: null,
    mesTplProcessBig: null,
    mesTplProcessAll: null,

    getMyList1: function (parent_code) {
        var list = [];
        for (var i = 0; i < this.rack_list1.length; i++) {
            var o = this.rack_list1[i];
            if (o['parent_class_code'] == parent_code) {
                list.push(o);
            }
        }
        return list;
    },
    getMyList2: function (parent_code) {
        var list = [];
        for (var i = 0; i < this.rack_list2.length; i++) {
            var o = this.rack_list2[i];
            if (o['parent_class_code'] == parent_code) {
                list.push(o);
            }
        }
        return list;
    },
    getMyList3: function (parent_code) {
        var list = [];
        for (var i = 0; i < this.rack_list3.length; i++) {
            var o = this.rack_list3[i];
            if (o['parent_class_code'] == parent_code) {
                list.push(o);
            }
        }
        return list;
    },
    maxFloor: {},
    chekCount: function (top_class_code, list) {

        for (var i = 0; i < list.length; i++) {

            var o = list[i];
            var state = o['State'];
            var m = this.maxFloor[top_class_code + state];
            if (m == undefined) {
                this.maxFloor[top_class_code + state] = 1;
            } else {
                this.maxFloor[top_class_code + state] = this.maxFloor[top_class_code + state] + 1;
            }
        }

    },

    checkMax: function (top_class_code, list) {
        for (var i = 0; i < list.length; i++) {
            var o = list[i];
            var state = o['State'];
            o['cnt'] = this.maxFloor[top_class_code + state];
        }
    },
    getRackunitList3: function (top_class_code) {
        var list = [];

        for (var i = 0; i < this.rack_list3.length; i++) {
            var o = this.rack_list3[i];
            if (o['top_class_code'] == top_class_code) {
                var o1 = {};
                if (vCompanyReserved4 == 'KYNL01KR') {
                    var temp_name = '';
                    for (var r = 1; r < 6; r++) {
                        if (o['reserved_varchar' + r] == undefined ||
                            o['reserved_varchar' + r] == '0') {
                            temp_name += '□';
                        } else {
                            temp_name += o['reserved_varchar' + r];
                        }
                        if (r != 5) {
                            temp_name += ' / ';
                        }
                        o1['reserved_varchar' + r] = o['reserved_varchar' + r];
                    }
                    o1['Name'] = temp_name;
                } else if (vCompanyReserved4 == 'SKNH01KR') {
                    o1['Name'] = o['item_name'];
                } else {
                    o1['Name'] = o['name'];
                }
                o1['Id'] = o['unique_id'];
                o1['State'] = o['state'];
                o1['Floor'] = o['floor'];
                if (vCompanyReserved4 == 'KYNL01KR') {
                    o1['N'] = o['class_code'] + ' ▶ ';
                } else {
                    o1['N'] = gUtil.floorDisp(o['floor']);
                }
                o1['rtgast_uid'] = o['rtgast_uid'];
                o1['color'] = o['color'];
                list.push(o1);
            }
        }

        //this.chekCount(top_class_code, list);
        //this.checkMax(top_class_code, list)

        //console_logs('<Util 1>getRackunitList3 list', list);
        return list;
    },
    floorDisp: function (floor) {
        var ret = '?';

        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                if (floor < 10) {
                    ret = '0' + floor + '.';
                } else {
                    ret = floor + '.';
                }
                break;
            default:
                switch ('' + floor) {
                    case '1':
                        ret = '①';
                        break;
                    case '2':
                        ret = '②';
                        break;
                    case '3':
                        ret = '③';
                        break;
                    case '4':
                        ret = '④';
                        break;
                    case '5':
                        ret = '⑤';
                        break;
                    case '6':
                        ret = '⑥';
                        break;
                    case '7':
                        ret = '⑦';
                        break;
                    case '8':
                        ret = '⑧';
                        break;
                    case '9':
                        ret = '⑨';
                        break;
                    case '10':
                        ret = '⑩';
                        break;
                    case '11':
                        ret = '⑪';
                        break;
                    case '12':
                        ret = '⑫';
                        break;
                    case '13':
                        ret = '⑬';
                        break;
                    case '14':
                        ret = '⑭';
                        break;
                    case '15':
                        ret = '⑮';
                        break;
                }
        }

        return '<font color="#1584D2"><strong>' + ret + '</strong></font>';
    },
    editRackRecord: function (record) {

        gUtil.selectedRackRecord = record;
        gUtil.curValue = 'reserved_varchar1';
        gUtil.selectedRtgast = '';
        console_logs('<Util 1>record', record);
        var name = record.getName();
        var id = record.getId();
        var position = record.getPosition();
        var floor = record.data.cnt - position;
        //record.data.Floor = floor;

        var po_no = (name == null || name == '') ? 'NOT-DEFINED' : name;

        var resourceId = record.getResourceId();
        //record.data.N = gUtil.floorDisp(record.data.Floor);

        //console_logs('<Util 1>record', record);


        gMain.extFieldColumnStore.load({
            params: {menuCode: 'SPS1_MES'},
            callback: function (records, operation, success) {
                if (success == true) {

                    //console_logs('<Util 1>SPS1_MES records', records);

                    var myRecords = [];
                    for (var i = 0; i < records.length; i++) {
                        var o1 = records[i];
                        switch (o1.get('dataIndex')) {
                            case 'stock_pos':
                            case 'alter_reason':
                                break;
                            default:
                                myRecords.push(o1);
                        }

                    }

                    var o = gMain.parseGridRecord(myRecords, 'stockRackEdit');
                    var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

                    var unassignedPalletStore = Ext.create('Rfx.store.UnassignedPalletStore', {});

                    if (vCompanyReserved4 == 'KYNL01KR') {
                        var stockModel = Ext.create('Rfx.model.ProductNewStock', {
                            fields: fields
                        });
                    } else {
                        var stockModel = Ext.create('Rfx.model.ProductStock2', {
                            fields: fields
                        });
                    }

                    gUtil.stockStore = new Ext.data.Store({
                        pageSize: 100,
                        model: stockModel,
                        sortOnLoad: true,
                        remoteSort: true,
                        listeners: {

                            beforeload: function (store, operation, eOpts) {

                            },
                            //Store의 Load 이벤트 콜백
                            load: function (store, records, successful, operation, options) {


                            }
                        }
                    });

                    if (vCompanyReserved4 == 'KYNL01KR') {
                        gUtil.stockStore.proxy.setExtraParam('po_no', gUtil.selectedRackRecord.data.reserved_varchar1);
                    } else {
                        gUtil.stockStore.proxy.setExtraParam('po_no', po_no);
                    }

//		            this.unassignedPalletStore.load(function(records){
//		          	   console_logs('<Util 1>unassignedPalletStore', records);
//
//		             });

                    gUtil.stockStore.load(function (records, operation, success) {

                        //	console_logs('<Util 1>unassignedPalletStore.load records', records);
                        var stockGrid = null;
                        if (vCompanyReserved4 == 'KYNL01KR') {
                            stockGrid = Ext.create('Ext.grid.Panel', {
                                layout: 'fit',
                                forceFit: true,
                                store: gUtil.stockStore,
                                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                                height: '200',
                                border: true,
                                autoScroll: true,
                                autoHeight: true,
                                columns: columns,
                                collapsible: false,
                                viewConfig: {
                                    stripeRows: true,
                                    enableTextSelection: false
                                }
                            });
                        } else {
                            stockGrid = Ext.create('Ext.grid.Panel', {
                                layout: 'fit',
                                forceFit: true,
                                store: gUtil.stockStore,
                                height: '200',
                                border: true,
                                autoScroll: true,
                                autoHeight: true,
                                columns: columns,
                                collapsible: false,
                                viewConfig: {
                                    stripeRows: true,
                                    enableTextSelection: false
                                }
                            });
                        }

                        var selected_rec = null;

                        stockGrid.getSelectionModel().on({
                            selectionchange: function (sm, selections) {
                                selected_rec = selections;
                            }
                        });

                        var win = Ext.create('ModalWindow', {
                            title: 'Rack 수정',
                            width: 1400,
                            height: 400,
                            autoScroll: true,
                            layout: 'absolute',
                            plain: true,
                            tbar: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    style: 'margin-bottom: 5px;margin-left:1px;',
                                    items: [
                                        {
                                            id: 'combo_pallet_name',
                                            xtype: 'combo',
                                            fieldLabel: '파레트 지정',
                                            displayField: 'po_no',
                                            valueField: 'po_no',
                                            name: 'Name',
                                            value: '변경할 파레트 선택',
                                            store: unassignedPalletStore,
                                            allowBlank: true,
                                            typeAhead: true,
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="">{po_no}</div>';
                                                }
                                            }
                                            , listeners: {
                                            select: function (combo, record) {
                                                console_log('Selected Value : ' + combo.getValue());
                                                gUtil.selectedRtgast = record.id;
                                                gUtil.stockStore.proxy.setExtraParam('po_no', combo.getValue());
                                                gUtil.stockStore.load();

                                            }
                                            , change: function (combo, value) {

                                                console_log('Selected Value : ' + combo.getValue());

                                                if (combo.getValue() != null && combo.getValue().length > 0) {
                                                    gUtil.stockStore.proxy.setExtraParam('po_no', combo.getValue());
                                                    gUtil.stockStore.load();
                                                }


                                            }
                                        }

                                        },


                                        {
                                            xtype: 'button',
                                            text: gm.getMC('CMD_DELETE', '삭제'),
                                            style: 'margin-left: 3px;',
                                            width: 50,
                                            handler: function () {
                                                try {
                                                    Ext.getCmp('combo_pallet_name').setValue('');
                                                    gUtil.stockStore.proxy.setExtraParam('po_no', 'NOT-DEFINED');
                                                    gUtil.stockStore.load();
                                                } catch (e) {
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: gm.getMC('CMD_Release','출고'),
                                            style: 'margin-left: 3px;',
                                            width: 50,
                                            handler: function () {
                                                if (vCompanyReserved4 != 'KYNL01KR') {

                                                    var po_no = gUtil.stockStore.proxy.extraParams['po_no'];
                                                    var rtgast_uid = gUtil.stockStore.proxy.extraParams['unique_id'];
                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/index/process.do?method=rackPalletOut',
                                                        params: {
                                                            pallet: po_no
                                                        },
                                                        success: function (response, request) {
                                                            Ext.getCmp('combo_pallet_name').setValue('');
                                                            gUtil.stockStore.proxy.setExtraParam('po_no', 'NOT-DEFINED');
                                                            gUtil.stockStore.load();
                                                        },
                                                        failure: function (val, action) {
                                                            alert('출고 오류');
                                                        }
                                                    });
                                                } else {

                                                    var stoqty_uids = [];
                                                    var specifications = [];

                                                    for (var i = 0; i < selected_rec.length; i++) {
                                                        stoqty_uids.push(selected_rec[i].data.stoqty_uid);
                                                        specifications.push(selected_rec[i].data.specification);
                                                    }

                                                    var rtgastUid = selected_rec[0].data.rtgast_uid;
                                                    var stock_pos = selected_rec[0].data.po_no;
                                                    var reserved_varchar1 = selected_rec[0].data.reserved_varchar1;
                                                    var out_qty = selected_rec[0].data.reserved_double1 - selected_rec[0].data.delivery_qty;

                                                    var msg = '출고하시겠습니까?';
                                                    var myTitle = '출고';
                                                    Ext.MessageBox.show({
                                                        title: myTitle,
                                                        msg: msg,

                                                        buttons: Ext.MessageBox.YESNO,
                                                        icon: Ext.MessageBox.QUESTION,
                                                        fn: function (btn) {

                                                            if (btn == "no") {

                                                            } else {

                                                                Ext.Ajax.request({
                                                                    url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqstHeavy',
                                                                    params: {
                                                                        rtgastUid: rtgastUid,
                                                                        out_qty: out_qty,
                                                                        stock_pos: stock_pos,
                                                                        reserved_varchar1: reserved_varchar1,
                                                                        stoqty_uids: stoqty_uids,
                                                                        specifications: specifications
                                                                    },

                                                                    success: function (result, request) {
                                                                        Ext.Msg.alert('출고', '출고처리 하였습니다.');

                                                                        var whereValue = [];

                                                                        for (var k = 0; k < selected_rec.length; k++) {
                                                                            whereValue.push(selected_rec[k].data.assymap_uid);
                                                                        }

                                                                        if (gUtil.stockStore.data.length <= selected_rec.length) {
                                                                            gUtil.editAjax('claast', gUtil.curValue, '0', 'unique_id', gUtil.selectedRackRecord.id, {type: ''});
                                                                            gUtil.curPo_no = '0';
                                                                        }

                                                                        gUtil.editAjax('assymap', 'reserved6', '불출완료', 'unique_id', whereValue, {type: ''});
                                                                        Ext.getCmp('combo_pallet_name').setValue('');

                                                                        var po_no = '';

                                                                        switch (gUtil.curValue) {
                                                                            case 'reserved_varchar1':
                                                                                gUtil.selectedRackRecord.data.reserved_varchar1 = gUtil.curPo_no;
                                                                                break;
                                                                            case 'reserved_varchar2':
                                                                                gUtil.selectedRackRecord.data.reserved_varchar2 = gUtil.curPo_no;
                                                                                break;
                                                                            case 'reserved_varchar3':
                                                                                gUtil.selectedRackRecord.data.reserved_varchar3 = gUtil.curPo_no;
                                                                                break;
                                                                            case 'reserved_varchar4':
                                                                                gUtil.selectedRackRecord.data.reserved_varchar4 = gUtil.curPo_no;
                                                                                break;
                                                                            case 'reserved_varchar5':
                                                                                gUtil.selectedRackRecord.data.reserved_varchar5 = gUtil.curPo_no;
                                                                                break;
                                                                        }

                                                                        if (gUtil.selectedRackRecord.data.reserved_varchar1 == undefined
                                                                            || gUtil.selectedRackRecord.data.reserved_varchar1 == '0') {
                                                                            po_no += '□ / ';
                                                                        } else {
                                                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar1 + ' / ';
                                                                        }
                                                                        if (gUtil.selectedRackRecord.data.reserved_varchar2 == undefined
                                                                            || gUtil.selectedRackRecord.data.reserved_varchar2 == '0') {
                                                                            po_no += '□ / ';
                                                                        } else {
                                                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar2 + ' / ';
                                                                        }
                                                                        if (gUtil.selectedRackRecord.data.reserved_varchar3 == undefined
                                                                            || gUtil.selectedRackRecord.data.reserved_varchar3 == '0') {
                                                                            po_no += '□ / ';
                                                                        } else {
                                                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar3 + ' / ';
                                                                        }
                                                                        if (gUtil.selectedRackRecord.data.reserved_varchar4 == undefined
                                                                            || gUtil.selectedRackRecord.data.reserved_varchar4 == '0') {
                                                                            po_no += '□ / ';
                                                                        } else {
                                                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar4 + ' / ';
                                                                        }
                                                                        if (gUtil.selectedRackRecord.data.reserved_varchar5 == undefined
                                                                            || gUtil.selectedRackRecord.data.reserved_varchar5 == '0') {
                                                                            po_no += '□';
                                                                        } else {
                                                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar5;
                                                                        }

                                                                        gUtil.selectedRackRecord.set('Name', po_no);
                                                                        gUtil.stockStore.load();
                                                                    },
                                                                    failure: extjsUtil.failureMessage
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'radiogroup',
                                            columns: 5,
                                            width: 500,
                                            items: [
                                                {
                                                    inputValue: 'reserved_varchar1',
                                                    boxLabel: gUtil.selectedRackRecord.data.reserved_varchar1 != null
                                                        ? gUtil.selectedRackRecord.data.reserved_varchar1 : '비어있음',
                                                    name: 'egci_code', checked: true
                                                },
                                                {
                                                    inputValue: 'reserved_varchar2',
                                                    boxLabel: gUtil.selectedRackRecord.data.reserved_varchar2 != null
                                                        ? gUtil.selectedRackRecord.data.reserved_varchar2 : '비어있음',
                                                    name: 'egci_code'
                                                },
                                                {
                                                    inputValue: 'reserved_varchar3',
                                                    boxLabel: gUtil.selectedRackRecord.data.reserved_varchar3 != null
                                                        ? gUtil.selectedRackRecord.data.reserved_varchar3 : '비어있음',
                                                    name: 'egci_code'
                                                },
                                                {
                                                    inputValue: 'reserved_varchar4',
                                                    boxLabel: gUtil.selectedRackRecord.data.reserved_varchar4 != null
                                                        ? gUtil.selectedRackRecord.data.reserved_varchar4 : '비어있음',
                                                    name: 'egci_code'
                                                },
                                                {
                                                    inputValue: 'reserved_varchar5',
                                                    boxLabel: gUtil.selectedRackRecord.data.reserved_varchar5 != null
                                                        ? gUtil.selectedRackRecord.data.reserved_varchar5 : '비어있음',
                                                    name: 'egci_code'
                                                }
                                            ],
                                            listeners: {
                                                change: function (field, newValue, oldValue) {
                                                    gUtil.curValue = newValue.egci_code;
                                                    switch (newValue.egci_code) {
                                                        case 'reserved_varchar1':
                                                            gUtil.stockStore.proxy.setExtraParam('po_no', gUtil.selectedRackRecord.data.reserved_varchar1);
                                                            break;
                                                        case 'reserved_varchar2':
                                                            gUtil.stockStore.proxy.setExtraParam('po_no', gUtil.selectedRackRecord.data.reserved_varchar2);
                                                            break;
                                                        case 'reserved_varchar3':
                                                            gUtil.stockStore.proxy.setExtraParam('po_no', gUtil.selectedRackRecord.data.reserved_varchar3);
                                                            break;
                                                        case 'reserved_varchar4':
                                                            gUtil.stockStore.proxy.setExtraParam('po_no', gUtil.selectedRackRecord.data.reserved_varchar4);
                                                            break;
                                                        case 'reserved_varchar5':
                                                            gUtil.stockStore.proxy.setExtraParam('po_no', gUtil.selectedRackRecord.data.reserved_varchar5);
                                                            break;
                                                    }
                                                    gUtil.stockStore.load();

                                                    var value = newValue.show;
                                                    if (Ext.isArray(value)) {
                                                        return;
                                                    }
                                                    if (value == 'offline') {
                                                        // do something
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ],
                            items: [stockGrid],
                            buttons: [{
                                text: CMD_OK,
                                handler: function () {

                                    var po_no = gUtil.stockStore.proxy.extraParams['po_no'];
                                    gUtil.curPo_no = po_no;

                                    if (po_no == 'NOT-DEFINED') {
                                        po_no = '';
                                    }

                                    //console_logs('<Util 1>gUtil.selectedReckRecord', gUtil.selectedReckRecord);

                                    if (po_no == '') {
                                        gUtil.selectedRackRecord.set('color', 'white');
                                    } else {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/index/process.do?method=getRackColor',
                                            params: {
                                                egci_code: po_no
                                            },
                                            success: function (result, request) {

                                                var color = result.responseText;

                                                if (vCompanyReserved4 == 'KYNL01KR') {

                                                    var whereValue = [];

                                                    var date = new Date();
                                                    var month = '' + (date.getMonth() + 1)
                                                    var day = '' + date.getDate();
                                                    var year = date.getFullYear();

                                                    if (month.length < 2) {
                                                        month = '0' + month;
                                                    }
                                                    if (day.length < 2) {
                                                        day = '0' + day;
                                                    }


                                                    for (var k = 0; k < gUtil.stockStore.data.length; k++) {
                                                        whereValue.push(gUtil.stockStore.data.items[k].data.assymap_uid);
                                                    }

                                                    gUtil.editAjax('claast', gUtil.curValue, gUtil.curPo_no, 'unique_id', gUtil.selectedRackRecord.id, {type: ''});

                                                    if (whereValue.length > 0) {
                                                        gUtil.editAjax('itemdetail', 'h_reserved42', [year, month, day].join('-'), 'unique_id', whereValue, {type: ''});
                                                        gUtil.editAjax('assymap', 'reserved6', '적치중', 'unique_id', whereValue, {type: ''});
                                                        gUtil.editAjax('itemdetail', 'h_reserved44', gUtil.selectedRackRecord.data.N.substring(0, 5), 'unique_id', whereValue, {type: ''});
                                                    }

                                                }
                                                //console_logs('<Util 1>result', result);

                                                gUtil.selectedRackRecord.set('color', color);
                                            },
                                            failure: function (val, action) {
                                                alert('색상 찾기 오류');
                                            }
                                        });
                                    }
                                    if (win) {
                                        win.close();
                                    }
                                    win = null;

                                    if (vCompanyReserved4 == 'KYNL01KR') {
                                        po_no = '';

                                        switch (gUtil.curValue) {
                                            case 'reserved_varchar1':
                                                gUtil.selectedRackRecord.data.reserved_varchar1 = gUtil.curPo_no;
                                                break;
                                            case 'reserved_varchar2':
                                                gUtil.selectedRackRecord.data.reserved_varchar2 = gUtil.curPo_no;
                                                break;
                                            case 'reserved_varchar3':
                                                gUtil.selectedRackRecord.data.reserved_varchar3 = gUtil.curPo_no;
                                                break;
                                            case 'reserved_varchar4':
                                                gUtil.selectedRackRecord.data.reserved_varchar4 = gUtil.curPo_no;
                                                break;
                                            case 'reserved_varchar5':
                                                gUtil.selectedRackRecord.data.reserved_varchar5 = gUtil.curPo_no;
                                                break;
                                        }

                                        if (gUtil.selectedRackRecord.data.reserved_varchar1 == undefined
                                            || gUtil.selectedRackRecord.data.reserved_varchar1 == '0') {
                                            po_no += '□ / ';
                                        } else {
                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar1 + ' / ';
                                        }
                                        if (gUtil.selectedRackRecord.data.reserved_varchar2 == undefined
                                            || gUtil.selectedRackRecord.data.reserved_varchar2 == '0') {
                                            po_no += '□ / ';
                                        } else {
                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar2 + ' / ';
                                        }
                                        if (gUtil.selectedRackRecord.data.reserved_varchar3 == undefined
                                            || gUtil.selectedRackRecord.data.reserved_varchar3 == '0') {
                                            po_no += '□ / ';
                                        } else {
                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar3 + ' / ';
                                        }
                                        if (gUtil.selectedRackRecord.data.reserved_varchar4 == undefined
                                            || gUtil.selectedRackRecord.data.reserved_varchar4 == '0') {
                                            po_no += '□ / ';
                                        } else {
                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar4 + ' / ';
                                        }
                                        if (gUtil.selectedRackRecord.data.reserved_varchar5 == undefined
                                            || gUtil.selectedRackRecord.data.reserved_varchar5 == '0') {
                                            po_no += '□';
                                        } else {
                                            po_no += gUtil.selectedRackRecord.data.reserved_varchar5;
                                        }
                                    }

                                    gUtil.selectedRackRecord.set('Name', po_no);

                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function () {
                                    if (win) {
                                        win.close();
                                    }
                                    win = null;
                                }
                            }]
                        });
                        win.show();

                    });

                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });


//    	//var floor = record.getFloor();
//    	var state = record.getState();
//    	console_logs('<Util 1>name', name);
//    	console_logs('<Util 1>id', id);
//    	console_logs('<Util 1>position', position);
//    	console_logs('<Util 1>resourceId', resourceId);
//    	console_logs('<Util 1>name', name);
//    	//console_logs('<Util 1>floor', floor);
//    	console_logs('<Util 1>state', state);


    },


    editMaterialRackRecord: function (record) {

        gUtil.selectedRackRecord = record;
        gUtil.curValue = 'reserved_varchar1';
        gUtil.selectedRtgast = '';
        console_logs('<Util 1>record', record);
        var name = record.getName();
        var id = record.getId();
        var position = record.getPosition();
        var floor = record.data.cnt - position;
        //record.data.Floor = floor;

        var po_no = (name == null || name == '') ? 'NOT-DEFINED' : name;

        var resourceId = record.getResourceId();
        //record.data.N = gUtil.floorDisp(record.data.Floor);

        //console_logs('<Util 1>record', record);


        gMain.extFieldColumnStore.load({
            params: {menuCode: 'PMS1'},
            callback: function (records, operation, success) {
                if (success == true) {

                    //console_logs('<Util 1>SPS1_MES records', records);

                    var myRecords = [];
                    for (var i = 0; i < records.length; i++) {
                        var o1 = records[i];
                        switch (o1.get('dataIndex')) {
                            case 'stock_pos':
                            case 'alter_reason':
                                break;
                            default:
                                myRecords.push(o1);
                        }

                    }

                    var o = gMain.parseGridRecord(myRecords, 'stockRackEdit');
                    var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

                    var stockMtrlStore = Ext.create('Rfx.store.StockMtrlStore', {});
                    stockMtrlStore.getProxy().setExtraParam('stock_pos', 'ND');

                    var stockModel = Ext.create('Rfx.model.StockLine', {
                        fields: fields
                    });

                    /* if(vCompanyReserved4 == 'KYNL01KR') {
                     var stockModel = Ext.create('Rfx.model.ProductNewStock', {
                     fields: fields
                     });
                     } else {
                     var stockModel = Ext.create('Rfx.model.ProductStock2', {
                     fields: fields
                     });
                     }*/

                    gUtil.stockStore = new Ext.data.Store({
                        pageSize: 100,
                        model: stockModel,
                        sortOnLoad: true,
                        remoteSort: true,
                        listeners: {

                            beforeload: function (store, operation, eOpts) {

                            },
                            //Store의 Load 이벤트 콜백
                            load: function (store, records, successful, operation, options) {


                            }
                        }
                    });

                    gUtil.stockStore.proxy.setExtraParam('claast_uid', gUtil.selectedRackRecord.data.Id);

//		            this.unassignedPalletStore.load(function(records){
//		          	   console_logs('<Util 1>unassignedPalletStore', records);
//
//		             });

                    gUtil.stockStore.load(function (records, operation, success) {

                        //	console_logs('<Util 1>unassignedPalletStore.load records', records);
                        var stockGrid = Ext.create('Ext.grid.Panel', {
                            layout: 'fit',
                            forceFit: true,
                            store: gUtil.stockStore,
                            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                            height: '200',
                            border: true,
                            autoScroll: true,
                            autoHeight: true,
                            columns: columns,
                            collapsible: false,
                            viewConfig: {
                                stripeRows: true,
                                enableTextSelection: false
                            }
                        });

                        var selected_rec = null;

                        stockGrid.getSelectionModel().on({
                            selectionchange: function (sm, selections) {
                                selected_rec = selections;
                            }
                        });

                        var win = Ext.create('ModalWindow', {
                            title: '자재 Rack 수정',
                            width: 1000,
                            height: 400,
                            autoScroll: true,
                            layout: 'absolute',
                            plain: true,
                            tbar: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    style: 'margin-bottom: 5px;margin-left:1px;',
                                    items: [
                                        {
                                            id: gu.id('stock_pos'),
                                            fieldLabel: '재고선택',
                                            width: 500,
                                            field_id: 'unique_id_long',
                                            allowBlank: true,
                                            name: 'stock_pos',
                                            xtype: 'combo',
                                            emptyText: '자재 검색',
                                            anchor: '-5',
                                            store: stockMtrlStore,
                                            displayField: 'item_code',
                                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                            sortInfo: {
                                                field: 'item_code',
                                                direction: 'ASC'
                                            },
                                            minChars: 1,
                                            typeAhead: false,
                                            hideLabel: true,
                                            hideTrigger: true,
                                            anchor: '100%',
                                            valueField: 'unique_id_long',
                                            listConfig: {
                                                loadingText: '검색중...',
                                                emptyText: '일치하는 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div><a class="search-item">' +
                                                        '<font color=#999><small>{item_code}</small></font> <font color=#333>{item_name}</font><br />' +
                                                        '</a></div>';
                                                }
                                            },
                                            pageSize: 10
                                        },
                                        /*{
                                         id: 'combo_pallet_name',
                                         xtype      : 'combo',
                                         fieldLabel : '재고 지정',
                                         displayField       : 'item_code',
                                         valueField       : 'item_code',
                                         name: 'Name',
                                         value: '변경할 재고 선택',
                                         store: stockMtrlStore,
                                         allowBlank : true,
                                         typeAhead: true,
                                         listConfig:{
                                         getInnerTpl: function(){
                                         return '<div data-qtip="">{item_code}</div>';
                                         }
                                         }
                                         ,listeners: {
                                         select: function (combo, record) {
                                         console_log('Selected Value : ' + combo.getValue());
                                         gUtil.selectedRtgast = record.id;
                                         gUtil.stockStore.proxy.setExtraParam('po_no', combo.getValue());
                                         gUtil.stockStore.load();

                                         }
                                         ,change: function (combo, value) {

                                         console_log('Selected Value : ' + combo.getValue());

                                         if(combo.getValue()!=null && combo.getValue().length>0) {
                                         gUtil.stockStore.proxy.setExtraParam('po_no', combo.getValue());
                                         gUtil.stockStore.load();
                                         }


                                         }
                                         }

                                         },*/
                                        {
                                            xtype: 'button',
                                            text: 'Rack에 담기',
                                            style: 'margin-left: 3px;',
                                            width: 100,
                                            handler: function () {

                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/index/process.do?method=updateStockpos',
                                                    params: {
                                                        stoqty_uids: gu.getCmp('stock_pos').value,
                                                        claast_uid: gUtil.selectedRackRecord.data.Id
                                                    },
                                                    success: function (result, request) {
                                                        gUtil.stockStore.proxy.setExtraParam('claast_uid', gUtil.selectedRackRecord.data.Id);
                                                        gUtil.stockStore.load({
                                                            callback: function () {
                                                                var t_name = '';

                                                                for (var i = 0; i < gUtil.stockStore.data.length; i++) {
                                                                    t_name += gUtil.stockStore.data.items[i].data.item_code + '/' + gUtil.stockStore.data.items[i].data.item_name;
                                                                    if (i != gUtil.stockStore.data.length - 1) {
                                                                        t_name += '<br/>';
                                                                    }
                                                                }

                                                                gUtil.selectedRackRecord.set('Name', t_name);
                                                            }
                                                        });
                                                    },
                                                    failure: function (val, action) {

                                                    }
                                                });
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Rack에서 내리기',
                                            style: 'margin-left: 3px;',
                                            width: 120,
                                            handler: function () {

                                                var stoqty_uids = [];

                                                if (selected_rec != null && selected_rec.length > 0) {
                                                    for (var i = 0; i < selected_rec.length; i++) {
                                                        stoqty_uids.push(selected_rec[i].data.id);

                                                        Ext.Ajax.request({
                                                            url: CONTEXT_PATH + '/index/process.do?method=updateStockpos',
                                                            params: {
                                                                stoqty_uids: stoqty_uids
                                                            },
                                                            success: function (result, request) {
                                                                gUtil.stockStore.proxy.setExtraParam('claast_uid', gUtil.selectedRackRecord.data.Id);
                                                                gUtil.stockStore.load({
                                                                    callback: function () {
                                                                        var t_name = '';

                                                                        for (var i = 0; i < gUtil.stockStore.data.length; i++) {
                                                                            t_name += gUtil.stockStore.data.items[i].data.item_code + '/' + gUtil.stockStore.data.items[i].data.item_name;
                                                                            if (i != gUtil.stockStore.data.length - 1) {
                                                                                t_name += '<br/>';
                                                                            }
                                                                        }

                                                                        gUtil.selectedRackRecord.set('Name', t_name);
                                                                    }
                                                                });
                                                            },
                                                            failure: function (val, action) {

                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ],
                            items: [stockGrid],
                            buttons: [{
                                text: CMD_OK,
                                handler: function () {

                                    // var po_no = gUtil.stockStore.proxy.extraParams['po_no'];
                                    // gUtil.curPo_no = po_no;
                                    //
                                    // if(po_no =='NOT-DEFINED') {
                                    //     po_no = '';
                                    // }
                                    //
                                    // //console_logs('<Util 1>gUtil.selectedReckRecord', gUtil.selectedReckRecord);
                                    //
                                    // if(po_no==''){
                                    //     gUtil.selectedRackRecord.set('color', 'white');
                                    // }else{
                                    //     Ext.Ajax.request({
                                    //         url: CONTEXT_PATH + '/index/process.do?method=getRackColor',
                                    //         params:{
                                    //             egci_code:po_no
                                    //         },
                                    //         success : function(result, request) {
                                    //
                                    //             var color = result.responseText;
                                    //
                                    //             if(vCompanyReserved4 == 'KYNL01KR') {
                                    //
                                    //                 var whereValue = [];
                                    //
                                    //                 var date = new Date();
                                    //                 var month = '' + (date.getMonth() + 1)
                                    //                 var day = '' + date.getDate();
                                    //                 var year = date.getFullYear();
                                    //
                                    //                 if (month.length < 2) {
                                    //                     month = '0' + month;
                                    //                 }
                                    //                 if (day.length < 2) {
                                    //                     day = '0' + day;
                                    //                 }
                                    //
                                    //
                                    //
                                    //                 for(var k = 0; k < gUtil.stockStore.data.length; k++) {
                                    //                     whereValue.push(gUtil.stockStore.data.items[k].data.assymap_uid);
                                    //                 }
                                    //
                                    //                 gUtil.editAjax('claast', gUtil.curValue, gUtil.curPo_no, 'unique_id', gUtil.selectedRackRecord.id, {type:''});
                                    //
                                    //                 if(whereValue.length > 0) {
                                    //                     gUtil.editAjax('itemdetail', 'h_reserved42', [year, month, day].join('-'), 'unique_id', whereValue,  {type:''});
                                    //                     gUtil.editAjax('assymap', 'reserved6', '적치중', 'unique_id', whereValue,  {type:''});
                                    //                     gUtil.editAjax('itemdetail', 'h_reserved44', gUtil.selectedRackRecord.data.N.substring(0, 5), 'unique_id', whereValue,  {type:''});
                                    //                 }
                                    //
                                    //             }
                                    //             //console_logs('<Util 1>result', result);
                                    //
                                    //             gUtil.selectedRackRecord.set('color', color);
                                    //         },
                                    //         failure: function(val, action){
                                    //             alert('색상 찾기 오류');
                                    //         }
                                    //     });
                                    // }
                                    // if(win) {
                                    //     win.close();
                                    // }
                                    // win = null;
                                    //
                                    // if(vCompanyReserved4 == 'KYNL01KR') {
                                    //     po_no = '';
                                    //
                                    //     switch(gUtil.curValue) {
                                    //         case 'reserved_varchar1':
                                    //             gUtil.selectedRackRecord.data.reserved_varchar1 = gUtil.curPo_no;
                                    //             break;
                                    //         case 'reserved_varchar2':
                                    //             gUtil.selectedRackRecord.data.reserved_varchar2 = gUtil.curPo_no;
                                    //             break;
                                    //         case 'reserved_varchar3':
                                    //             gUtil.selectedRackRecord.data.reserved_varchar3 = gUtil.curPo_no;
                                    //             break;
                                    //         case 'reserved_varchar4':
                                    //             gUtil.selectedRackRecord.data.reserved_varchar4 = gUtil.curPo_no;
                                    //             break;
                                    //         case 'reserved_varchar5':
                                    //             gUtil.selectedRackRecord.data.reserved_varchar5 = gUtil.curPo_no;
                                    //             break;
                                    //     }
                                    //
                                    //     if( gUtil.selectedRackRecord.data.reserved_varchar1 == undefined
                                    //         || gUtil.selectedRackRecord.data.reserved_varchar1 == '0') {
                                    //         po_no += '□ / ';
                                    //     } else {
                                    //         po_no += gUtil.selectedRackRecord.data.reserved_varchar1 + ' / ';
                                    //     }
                                    //     if( gUtil.selectedRackRecord.data.reserved_varchar2 == undefined
                                    //         || gUtil.selectedRackRecord.data.reserved_varchar2 == '0') {
                                    //         po_no += '□ / ';
                                    //     } else {
                                    //         po_no += gUtil.selectedRackRecord.data.reserved_varchar2 + ' / ';
                                    //     }
                                    //     if( gUtil.selectedRackRecord.data.reserved_varchar3 == undefined
                                    //         || gUtil.selectedRackRecord.data.reserved_varchar3 == '0') {
                                    //         po_no += '□ / ';
                                    //     } else {
                                    //         po_no += gUtil.selectedRackRecord.data.reserved_varchar3 + ' / ';
                                    //     }
                                    //     if( gUtil.selectedRackRecord.data.reserved_varchar4 == undefined
                                    //         || gUtil.selectedRackRecord.data.reserved_varchar4 == '0') {
                                    //         po_no += '□ / ';
                                    //     } else {
                                    //         po_no += gUtil.selectedRackRecord.data.reserved_varchar4 + ' / ';
                                    //     }
                                    //     if( gUtil.selectedRackRecord.data.reserved_varchar5 == undefined
                                    //         || gUtil.selectedRackRecord.data.reserved_varchar5 == '0') {
                                    //         po_no += '□';
                                    //     } else {
                                    //         po_no += gUtil.selectedRackRecord.data.reserved_varchar5;
                                    //     }
                                    // }
                                    //
                                    // gUtil.selectedRackRecord.set('Name', po_no);

                                    if (win) {
                                        win.close();
                                    }
                                    win = null;
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function () {
                                    if (win) {
                                        win.close();
                                    }
                                    win = null;
                                }
                            }]
                        });
                        win.show();

                    });

                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });


//    	//var floor = record.getFloor();
//    	var state = record.getState();
//    	console_logs('<Util 1>name', name);
//    	console_logs('<Util 1>id', id);
//    	console_logs('<Util 1>position', position);
//    	console_logs('<Util 1>resourceId', resourceId);
//    	console_logs('<Util 1>name', name);
//    	//console_logs('<Util 1>floor', floor);
//    	console_logs('<Util 1>state', state);


    },


    popupUser: null,
    //get UserInfo by user_id
    popupUserByUserId: function (user_id) {
        console_logs('<Util 1>popupUserByUserId user_id', user_id);
        this.popupUser.popupUserByUserId(user_id);
    },
//    renderPohistoryItemCode: function (value, p, record) {
//    	var child = record.get('unique_id');
//
//        return Ext.String.format(
//                '<a href="#" onclick="popupPohistory(\'{0}\', \'{1}\')" >{1}</a>',
//               child, value
//            );
//    },

    renderCarthistoryPlno: function (value, p, record) {
        var unique_uid = record.get('unique_uid');

        return Ext.String.format(
            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
            unique_uid, value
        );
    },

    setMainTable1Value: function (series) {

        var sumup1 = 0;
        var sumup2 = 0;
        var sumup3 = 0;
        var sumup4 = 0;

        for (var i = 0; i < series.length; i++) {
            var o = series[i];
            //console_logs('<Util 1>===>o', o);
            //console_logs('<Util 1>name', o['name']);
            //console_logs('<Util 1>data', o['data']);

            try {
                document.getElementById('th1-series-' + (i + 1)).innerHTML = o['name'];
                var datas = o['data'];

                document.getElementById('td1-data-' + (i + 1) + '-4').innerHTML = Ext.util.Format.number(datas[datas.length - 1], '0,00/i');
                document.getElementById('td1-data-' + (i + 1) + '-3').innerHTML = Ext.util.Format.number(datas[datas.length - 2], '0,00/i');
                document.getElementById('td1-data-' + (i + 1) + '-2').innerHTML = Ext.util.Format.number(datas[datas.length - 3], '0,00/i');
                document.getElementById('td1-data-' + (i + 1) + '-1').innerHTML = Ext.util.Format.number(datas[datas.length - 4], '0,00/i');
                document.getElementById('td1-data-' + (i + 1) + '-total').innerHTML = Ext.util.Format.number(
                    datas[datas.length - 1]
                    + datas[datas.length - 2]
                    + datas[datas.length - 3]
                    + datas[datas.length - 4]
                    , '0,00/i');
                sumup4 = sumup4 + datas[datas.length - 1];
                sumup3 = sumup3 + datas[datas.length - 2];
                sumup2 = sumup2 + datas[datas.length - 3];
                sumup1 = sumup1 + datas[datas.length - 4];


            } catch (e) {
                console_logs('<Util 1>e', e)
            }
        }

        try {
            document.getElementById('td1-total-' + '4').innerHTML = Ext.util.Format.number(sumup4, '0,00/i');
            document.getElementById('td1-total-' + '3').innerHTML = Ext.util.Format.number(sumup3, '0,00/i');
            document.getElementById('td1-total-' + '2').innerHTML = Ext.util.Format.number(sumup2, '0,00/i');
            document.getElementById('td1-total-' + '1').innerHTML = Ext.util.Format.number(sumup1, '0,00/i');
            document.getElementById('td1-total-' + 'total').innerHTML = Ext.util.Format.number(sumup1 + sumup2 + sumup3 + sumup4, '0,00/i');
        } catch (e) {
            console_logs('<Util 1>e', e)
        }

    },
    setTable1Date: function (e_date) { //6/28
        try {
            document.getElementById('th1-4').innerHTML = this.getMonthDay(e_date);
            e_date = gUtil.getByNextday(e_date, -1);
            document.getElementById('th1-3').innerHTML = this.getMonthDay(e_date);
            e_date = gUtil.getByNextday(e_date, -1);
            document.getElementById('th1-2').innerHTML = this.getMonthDay(e_date);
            e_date = gUtil.getByNextday(e_date, -1);
            document.getElementById('th1-1').innerHTML = this.getMonthDay(e_date);

        } catch (noerror) {
            console_logs('<Util 1>setTable1Date', noerror);
        }
    },
    setTable1Date1: function (aXis1) { //6/28
        try {
            document.getElementById('th1-4').innerHTML = aXis1[aXis1.length - 1];
            document.getElementById('th1-3').innerHTML = aXis1[aXis1.length - 2];
            document.getElementById('th1-2').innerHTML = aXis1[aXis1.length - 3];
            document.getElementById('th1-1').innerHTML = aXis1[aXis1.length - 4];

        } catch (noerror) {
            console_logs('<Util 1>setTable1Date', noerror);
        }
    },
    setTable1Value: function (series) {
        console_logs('<Util 1>setTable1Value series', series);
    },

    setTable2Value: function (sorted) {
        try {
            console_logs('<Util 1>setTable2Value sorted series', sorted);

            for (var i = 0; i < sorted.length; i++) {
                document.getElementById('td2-name-' + (i + 1)).innerHTML = sorted[i]['name'];
                document.getElementById('td2-plan-' + (i + 1)).innerHTML = Ext.util.Format.number(sorted[i]['value1'], '0,00/i');
                document.getElementById('td2-real-' + (i + 1)).innerHTML = Ext.util.Format.number(sorted[i]['value'], '0,00/i');
                document.getElementById('td2-ratio-' + (i + 1)).innerHTML = Ext.util.Format.number(sorted[i]['ratio'] * 100, '0,00/i') + ' %';
            }

        } catch (noerror) {
            console_logs('<Util 1>setTable1Date', noerror);
        }


    },

    setUniqueArray: function (duplicatesArray) {
        if (!Ext.isArray(duplicatesArray)) {
            return undefined;
        }
        var uniqueArr = duplicatesArray.filter(function (elem, pos) {
            return duplicatesArray.indexOf(elem) === pos;
        });
        return uniqueArr;
    },
    distinctFilters: ['pj_name', 'specification'],
    mapFilter: {},
    getDistinctFilters: function (link) {
        try {
            //console_logs('<Util 1>getDistinctFilters mapFilter', this.mapFilter);
            if (link == null || link == undefined) {
                link = gm.me().link;
            }
            var filter = this.mapFilter[link];
            //console_logs('<Util 1>filter', filter);
            if (filter != undefined && filter != null) {
                return filter;
            }
        } catch (e) {
        }

        return this.distinctFilters;
    },

    setDistinctFilters: function (key, filters) {
        this.mapFilter[key] = filters;
    },

    //로컬에서 widget을 찾고 없으면 글로벌
    getCmp: function (id) {
        return Ext.getCmp(this.id(id));
    },
    //GlobalId
    id: function (id) {
        return id + this.link;
    },

    link: null,
    pcsLink: null,

    MessageBox: function () {
        return {
            msg: function (format) {
                return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
            }
        };
    },
    checkUsePcstpl: function () {
        if (this.mesTplProcessBig != null && this.mesTplProcessBig.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    //표준프로세스에서 PCSPL만들기
    makeProcessAllFromStd: function () {
        this.mesTplProcessAll = {};
        var processList = [];
        for (var i = 0; i < this.mesStdProcess.length; i++) {
            var o = gUtil.mesStdProcess[i];
            if (o['parent'] == o['code']) {
                var o1 = {
                    pcsTemplate: o['code'],
                    code: o['code'],
                    process_price: 0,
                    name: o['name']
                };
                processList.push(o1);
            }
        }
        console.log('--------------------- processList', processList);

        for (var j = 0; j < processList.length; j++) {
            var o1 = processList[j];
            var arr = [];
            console_logs('<Util 1>processList o1', o1);
            var big_pcs_code = o1['code'];
            console_logs('<Util 1>big_pcs_code', big_pcs_code);
            for (var i = 0; i < gUtil.mesStdProcess.length; i++) {
                var o = gUtil.mesStdProcess[i];
                if (o['parent'] == big_pcs_code) {
                    var o2 = {
                        pcsTemplate: o['code'],
                        code: o['code'],
                        process_price: 0,
                        name: o['name']
                    };
                    console_logs('<Util 1>o2', o2);
                    arr.push(o2);
                }
            }
            this.mesTplProcessAll[big_pcs_code] = arr;

        }
    },

    timer: function (callback, delay) {
        var timerId, start, remaining = delay;

        this.pause = function () {
            window.clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.resume = function () {
            start = new Date();
            window.clearTimeout(timerId);
            timerId = window.setTimeout(callback, remaining);
        };

        this.resume();
    },
    demoCnt: 0,
    demo: function () {
        this.timer(function () {
            //console_logs('<Util 1>demo', new Date());
            gUtil.demoCnt++;

            Ext.toast({

                title: '데모중',
                html: gUtil.demoCnt + '번째 화면입니다.',
                closable: true,
                align: 't',
                slideInDuration: 300,
                minWidth: 300
            });


            switch (vCompanyReserved4) {
                case 'DOOS01KR':
                    switch (gUtil.demoCnt % 4) {

                        case 1:
                            gm.gotoMyTab('ProjectTotalHeavy', 'project-total', '실시간종합', null);
                            break;
                        case 2:
                            gm.gotoMyTab('ProduceStateHeavyDoosRack', 'produce-state', '생산현황', null);
                            break;
                        case 3:
                            gm.gotoMyTab('EquipState', 'equip-state', '설비현황', 'EMC1_DS');
                            break;
                        default:
                            gm.gotoMyTab('Delivery', 'delivery', '출하', 'SDL2');
                            break;
                    }
                    break;
                case 'HSGC01KR':
                    switch (gUtil.demoCnt % 4) {

                        case 1:
                            gm.gotoMyTab('ProjectTotalHeavy', 'project-total', '실시간종합', null);
                            break;
                        case 2:
                            gm.gotoMyTab('ProduceStateHeavyDoosRack', 'produce-state', '생산현황', null);
                            break;
                        case 3:
                            gm.gotoMyTab('EquipState', 'equip-state', '설비현황', 'EMC1_DS');
                            break;
                        default:
                            gm.gotoMyTab('Delivery', 'delivery', '출하', 'SRO4_DS');
                            break;
                    }
                    break;
                default:
                    switch (gUtil.demoCnt % 4) {

                        case 1:
                            gm.gotoMyTab('ProjectTotalHeavy', 'project-total', '실시간종합', null);
                            break;
                        case 2:
                            gm.gotoMyTab('ProduceStateHeavyRack', 'produce-state', '생산현황', null);
                            break;
                        case 3:
                            gm.gotoMyTab('EquipState', 'equip-state', '설비현황', 'EMC1');
                            break;
                        default:
                            gm.gotoMyTab('SalesDelivery', 'sales-delivery', '영업,출하', 'SDL2');
                            break;
                    }
                    break;
            }

            gUtil.demo();
        }, 30000);
    },
    checkLinkPath: function (linkPath) {
        if (linkPath == null || linkPath == 'undefined Linkpath' || linkPath == 'null' || linkPath == '') {
            return false;
        } else {
            return true;
        }
    },

    getLastDay: function (today) {
        var int_d = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return (new Date(int_d - 1)).getDate();

    },

    getValue: function (id) {
        var o = this.getCmp(id);
        if (o == null) {
            return '';
        } else {
            return o.getValue();
        }
    },

    setGridOnCallback: function (fc) {
        this.callGridOnCallback = fc;
    },

    callGridOnCallback: function (selections) {
        if (selections != null) {
            //console_logs('<Util 1>callGridOnCallback', selections);
        } else {
            //console_logs('<Util 1>callGridOnCallback', 'selections is null');
        }

    },

    /**
     * 문자를 숫자로 변경.
     */
    stoi: function (str) {
        str.replace(/,/g, '');
        return Number(str);
    },

    setToolbarPath: function (groupId, menuPath) {
        // console_logs('================> setToolbarPath: ' + groupId, menuPath);
        var oToolbar = this.getCmpToolbar(groupId);
        if (oToolbar != null && menuPath != null) {
            oToolbar.setHtml(menuPath);
        }
    },

    getCmpToolbar: function (groupId) {
        return Ext.getCmp(this.getToolbarId(groupId));
    },

    getToolbarId: function (groupId) {
        return 'toolbarPath-' + groupId;
    },

    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, sync_mode) {
        console_logs('<Util 1>tableName', tableName);
        console_logs('<Util 1>sync_mode', sync_mode);
        if (tableName == null || tableName == '') {
            return;
        }

        var params = {};
        if (in_params != null) {
            for (var key in in_params) {
                params[key] = in_params[key];
            }
        }
        console_logs('<Util 1>params>>>>>>>>>>>>>>>>>', params);
        var whereValue = [];
        whereValue.push(in_whereValue);
        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                break;
            default:
                params['valueType'] = gm.getColType(field);
                break;
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
            params: params,
            success: function (result, request) {

                var result = result.responseText;
                if (result != null) {
                    var o = Ext.util.JSON.decode(result);
                }

            }
        });
    },
    addPairApp: function (key, val) {
        return '"' + trim(key) + '":' + val;
    },

    yyyymmdd_full: function (dateIn, separ) {
        var s = this.yyyymmdd(dateIn, separ);

        if (separ == null) {
            separ = '-';
        }

        var hh = (dateIn.getHours()) + '';
        var mm = (dateIn.getMinutes()) + '';
        var ss = (dateIn.getSeconds()) + '';

        if (hh.length < 2) {
            hh = '0' + hh;
        }
        if (mm.length < 2) {
            mm = '0' + mm;
        }
        if (ss.length < 2) {
            ss = '0' + ss;
        }

        return String(s + ' ' + hh + ':' + mm + ':' + ss);
    },
    roleCodes: [],
    propGrid: null,		//메뉴 속성
    authFormpanel: null,	//메뉴 권한
    selected_menuObj: null,
    setMenuProps: function (rec) {

        if (rec != null) {

            this.selected_menuObj = rec;
            this.propGrid.setSource({
                '(unique_id)': rec.get('unique_id'),
                cell_edit: rec.get('cell_edit'),
                classId: rec.get('classId'),
                display_name: rec.get('display_name'),
                linkPath: rec.get('linkPath'),
                lock_cnt: rec.get('lock_cnt'),
                menu_key: rec.get('menu_key'),
                multi_grid: rec.get('multi_grid'),
                parentName: rec.get('parentName'),
                permType: rec.get('permType'),
                service_name: rec.get('service_name'),
                flag1: rec.get('flag1'),
                flag2: rec.get('flag2'),
                flag3: rec.get('flag3'),
                flag4: rec.get('flag4'),
                flag5: rec.get('flag5'),
                selectedMenuGroup: rec.get('selectedMenuGroup')
            });

            var menuPerm = rec.get('menuPerm');
            //console_logs('<Util 1>menuPerm', menuPerm);
            if (menuPerm != null && menuPerm.length > 0) {

                var saveBtn = Ext.getCmp('authSaveBtn');
                var radios = Ext.getCmp('authTypeRadio');
                var checkSet = Ext.getCmp('authSelectFieldset');
                var authCheckboxgroup = Ext.getCmp('authCheckboxgroup');
                if (menuPerm == '*') {//모두에게 권한주기
                    if (radios != null) {
                        radios.items.items[1].setValue(true);
                        radios.items.items[0].setValue(false);
                    }

                    if (authCheckboxgroup != null) {
                        authCheckboxgroup.setValue({
                            checkset: []
                        });
                    }

                } else {

                    var arr = this.getAuthArr(menuPerm);
                    if (authCheckboxgroup != null) {
                        authCheckboxgroup.setValue({
                            checkset: arr
                        });
                    }

                    if (radios != null) {
                        radios.items.items[1].setValue(false);
                        radios.items.items[0].setValue(true);
                    }

                }
                if (saveBtn != null) {
                    saveBtn.disable();
                }

            }
            var t = Ext.getCmp('menuEdit-tab');
            if (t != null) {
                t.setTitle(rec.get('display_name'));
            }

        }
    },
    mainPanelWest: null,
    leftMenuAll: null,
    getAuthArr: function (s) {
        console_logs('<Util 1>getAuthArr s', s)
        var s0 = this.removeSpace(s);
        var arr1 = s0.split(':');
        var s1 = arr1[arr1.length - 1];
        return s1.split(',');
    },

    getExcelToolbar: function (title) {
        var items = [];
        items.push({
            xtype: 'label',
            width: 300,
            //style: 'color:white;',
            html: title
        });
        items.push('->');
        items.push({
            iconCls: 'af-excel',
            //glyph: 'f1c3@FontAwesome',
            html: 'Excel',
            handler: function () {
                switch (vCompanyReserved4) {
                    case 'KBTC01KR':
                    case 'BIOT01KR':
                    case 'YNJU01KR':
                    case 'SJFB01KR':
                    case 'CHMR01KR':
                    case 'SSCC01KR':
                    case 'MJCM01KR':
                    case 'DMEC01KR':
                    case 'DJEP01KR':
                    case 'SCON01KR':
                        gu.popUpExcelHandler();
                        break;
                    case 'HJSV01KR':
                        switch (gm.me().link) {
                            case "DBM7_TREE":
                            case "DBM7_AST":
                                gu.printExcelHandler();
                                break;
                            default:
                                gu.popUpExcelHandler();
                                break;
                        }
                }
            }
        });

        switch (vCompanyReserved4) {
            case 'KBTC01KR':
            case 'BIOT01KR':
            case 'HJSV01KR':
            case 'YNJU01KR':
            case 'SJFB01KR':
            case 'KMCA01KR':
            case 'WOWT01KR':
            case 'CHMR01KR':
            case 'SSCC01KR':
            case 'DMEC01KR':
            case 'DJEP01KR':
            case 'SCON01KR':    
                return null;
            default:
                return Ext.create('widget.toolbar', {
                    cls: 'my-x-toolbar-default5-1',
                    dock: 'bottom',
                    items: items
                });
        }
    },
    getExcelToolbarTop: function (buttonToolbar) {
        var r = true;
        if (buttonToolbar == undefined) {
            return;
        }
        for (var i = 0; i < buttonToolbar.items.items.length; i++) {
            var toolbar = buttonToolbar.items.items[i];
            var xtype = toolbar['xtype'];
            if (xtype == 'tbfill') {
                r = false;
            }
        }
        if (r) {
            buttonToolbar.insert(buttonToolbar.length, '->');
        }
        buttonToolbar.insert(buttonToolbar.length, {
            iconCls: 'af-excel',
            //glyph: 'f1c3@FontAwesome',
            html: 'Excel',
            handler: function () {
                switch (vCompanyReserved4) {
                    case 'KBTC01KR':
                    case 'DSMF01KR':
                        gu.popUpExcelHandler();
                        break;
                    default:
                        gu.printExcelHandler();
                }
            }
        });

        return buttonToolbar;

        //    return Ext.create('widget.toolbar', {
        // 		cls: 'my-x-toolbar-default5-1',
        // 		// dock: 'bottom',
        //         items: items
        //     });
    },
    printExcelHandler: function (param_grid) {

        var store = null;
        var selections = null;
        if (param_grid != null && param_grid != undefined) {
            store = param_grid.getStore();
            selections = param_grid.getSelectionModel().getSelection();
        } else {
            store = gm.me().getStore();
            selections = gm.me().grid.getSelectionModel().getSelection();
        }

        var unique_ids = [];

        switch (vCompanyReserved4) {
            case 'MKEE01KR':
                if (gm.me().link != null && gm.me().link == 'SRO1') {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('assymap_uid');
                        console_logs('<Util 1>=====>uid', uid);
                        unique_ids.push(uid);
                        console_logs('<Util 1>=====>unique_ids', unique_ids);
                    }
                } else {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id');
                        console_logs('<Util 1>=====>uid', uid);
                        unique_ids.push(uid);
                        console_logs('<Util 1>=====>unique_ids', unique_ids);
                    }
                }
                break;
            default:
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var uid = rec.get('unique_id');
                    console_logs('<Util 1>=====>uid', uid);
                    unique_ids.push(uid);
                    console_logs('<Util 1>=====>unique_ids', unique_ids);
                }
                break;
        }

        //console_logs('<Util 1>===store===', store);

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.getProxy().setExtraParam("unique_ids", unique_ids);

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                if (gm.me().link == 'QGR2') {
                    store.getProxy().setExtraParam("is_excel", null);
                }
                break;
            case 'DABP01KR':
                if (gm.me().link == 'EPC4') {
                    console_logs('>>>>> ddddasdasdasd', this.pcsLink);
                    if (this.pcsLink != null) {
                        store.getProxy().setExtraParam("menuCode", this.pcsLink);
                    }
                }
                break;
            default:
                break;
        }

        var arrField = gm.me().gSearchField;

        try {
            Ext.each(arrField, function (fieldObj, index) {

                console_log(typeof fieldObj);

                var dataIndex = '';

                if (typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                var srchId = gMain.getSearchField(dataIndex);
                ; //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                var value = Ext.getCmp(srchId).getValue();

                if (value != null && value != '') {
                    if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                        store.getProxy().setExtraParam(dataIndex, value);
                    } else {
                        var enValue = Ext.JSON.encode('%' + value + '%');
                        console_info(enValue);
                        store.getProxy().setExtraParam(dataIndex, enValue);
                    }//endofelse
                }//endofif

            });
        } catch (noError) {
        }

        store.load({
            scope: this,
            callback: function (records, operation, success) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                    params: {
                        mc_codes: gUtil.getMcCodes()
                    },
                    success: function (response, request) {
                        store.getProxy().setExtraParam("srch_type", null);
                        var excelPath = response.responseText;
                        if (excelPath != null && excelPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                            top.location.href = url;

                        } else {
                            Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                        }
                    }
                });

            }
        });
    },
    popUpExcelHandler: function () {

        var checkboxItems = [];
        var myWidth = 600;
        var myHeight = 80;

        var store = gm.me().getStore();
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var unique_ids = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            unique_ids.push(uid);
        }

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.getProxy().setExtraParam("unique_ids", unique_ids);

        for (var i = 0; i < gm.me().columns.length; i++) {

            if (i % 4 == 0) {
                myHeight += 30;
            }

            checkboxItems.push({
                xtype: 'checkbox',
                checked: gm.me().columns[i]['excel_set'] != 'N' ? true : false,
                fieldLabel: gm.me().columns[i]['text'],
                name: gm.me().columns[i]['id'],
                margin: '5 20 0 5',
                allowBlank: false,
                codeName: gm.me().columns[i]['codeName'],
                stateId: gm.me().columns[i]['stateId'],
                listeners: {
                    change: function (checkbox, newVal, oldVal) {
                        for (var i = 0; i < gm.me().columns.length; i++) {
                            if (checkbox.name === gm.me().columns[i]['id']) {
                                gm.me().columns[i]['excel_set'] = newVal ? 'Y' : 'N';
                            }
                        }
                    }
                }
            });
        }

        try {
            Ext.each(arrField, function (fieldObj, index) {

                console_log(typeof fieldObj);

                var dataIndex = '';

                if (typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                var srchId = gMain.getSearchField(dataIndex);
                var value = Ext.getCmp(srchId).getValue();

                if (value != null && value != '') {
                    if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                        store.getProxy().setExtraParam(dataIndex, value);
                    } else {
                        var enValue = Ext.JSON.encode('%' + value + '%');
                        console_info(enValue);
                        store.getProxy().setExtraParam(dataIndex, enValue);
                    }//endofelse
                }//endofif

            });
        } catch (noError) {
        }

        var formPanel = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            width: myWidth,
            vertical: false,
            layout: 'column',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            items: checkboxItems

        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '엑셀을 출력할 항목을 선택하세요',
            width: myWidth,
            height: myHeight,
            items: formPanel,
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {

                        var formItems = formPanel.items.items;
                        var code_uids = [];
                        var system_codes = [];

                        for (var i = 0; i < formItems.length; i++) {
                            var formItem = formItems[i];

                            if (formItem['name'] === undefined) {
                                continue;
                            }

                            var formUidArr = formItem['name'].split('-');
                            var formUid = formUidArr[1];
                            if (formItem.checked) {
                                var system_code = formItem['codeName'];
                                var stateId = formItem['stateId'];
                                if (system_code !== undefined && system_code !== null) {
                                    system_codes.push(system_code + ':' + stateId);
                                }
                                code_uids.push(formUid);
                            }
                        }

                        store.getProxy().setExtraParam("code_uids", code_uids);
                        store.getProxy().setExtraParam("system_codes", system_codes);
                        prWin.setLoading(true);

                        if(gm.me().link === 'SRO5_SUB') {
                            store.proxy.setTimeout(600000); // store load time에 의한 path를 불러오지 못하는 현상으로 인한 추가.
                        }

                        store.load({
                            scope: this,
                            // setTimeout
                            callback: function (records, operation, success) {
                               
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                                    params: {
                                        mc_codes: gUtil.getMcCodes()
                                    },
                                    success: function (response, request) {
                                        store.getProxy().setExtraParam("srch_type", null);
                                        var excelPath = response.responseText;
                                        if (excelPath != null && excelPath.length > 0) {
                                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                            top.location.href = url;

                                        } else {
                                            Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                        }
                                        prWin.setLoading(false);

                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                });

                            }
                        });
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {

                        if (prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        });

        prWin.show();
    },

    //하나로 excel핸들러
    HanaroPopUpExcelHandler: function () {

        var checkboxItems = [];
        var myWidth = 600;
        var myHeight = 80;

        var store = gm.me().getStore();
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var unique_ids = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            unique_ids.push(uid);
        }

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.getProxy().setExtraParam("unique_ids", unique_ids);

        for (var i = 0; i < gm.me().columns.length; i++) {

            if (i % 4 == 0) {
                myHeight += 30;
            }

            //          checkboxItems.push({
            //              xtype: 'checkbox',
            //              checked: gm.me().columns[i]['excel_set'] === 'Y' ? true : false,
            //              fieldLabel: gm.me().columns[i]['text'],
            //             name: gm.me().columns[i]['id'],
            //              margin: '5 20 0 5',
            //              allowBlank: false,
            //				codeName: gm.me().columns[i]['codeName'],
            //				stateId: gm.me().columns[i]['stateId'],
            //              listeners: {
            //                  change: function (checkbox, newVal, oldVal) {
            //                      for (var i = 0; i < gm.me().columns.length; i++) {
            //                          if(checkbox.name === gm.me().columns[i]['id']) {
            //                              gm.me().columns[i]['excel_set'] = newVal ? 'Y' : 'N';
//							}
            //                      }
            //                }
            //          }
            //	});
        }

        try {
            Ext.each(arrField, function (fieldObj, index) {

                console_log(typeof fieldObj);

                var dataIndex = '';

                if (typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                var srchId = gMain.getSearchField(dataIndex);
                var value = Ext.getCmp(srchId).getValue();

                if (value != null && value != '') {
                    if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                        store.getProxy().setExtraParam(dataIndex, value);
                    } else {
                        var enValue = Ext.JSON.encode('%' + value + '%');
                        console_info(enValue);
                        store.getProxy().setExtraParam(dataIndex, enValue);
                    }//endofelse
                }//endofif

            });
        } catch (noError) {
        }


        // store.getProxy().setExtraParam("code_uids", code_uids);
        // store.getProxy().setExtraParam("system_codes", system_codes);
        // prWin.setLoading(true);
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                    params: {
                        mc_codes: gUtil.getMcCodes()
                    },
                    success: function (response, request) {
                        store.getProxy().setExtraParam("srch_type", null);
                        var excelPath = response.responseText;
                        if (excelPath != null && excelPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                            top.location.href = url;

                        } else {
                            Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                        }


                    }
                });

            }
        });

        // var formPanel = Ext.create('Ext.form.Panel', {
        //     bodyPadding: 5,
        //     width: myWidth,
        //     vertical: false,
        //     layout: 'column',
        //     defaults: {
        //         anchor: '100%'
        //     },
        //     defaultType: 'textfield',
        //     items: checkboxItems

        // });

        // var prWin = Ext.create('Ext.Window', {
        //     modal: true,
        //     title: '엑셀을 출력할 항목을 선택하세요',
        //     width: myWidth,
        //     height: myHeight,
        //     items: formPanel,
        //     buttons: [
        //         {
        //             text: CMD_OK,
        //             scope: this,
        //             handler: function () {

        //                 var formItems = formPanel.items.items;
        // 				var code_uids = [];
        // 				var system_codes = [];

        //             	for (var i = 0; i < formItems.length; i++) {
        //             		var formItem = formItems[i];

        //             		if (formItem['name'] === undefined) {
        //             			continue;
        // 					}

        //             		var formUidArr = formItem['name'].split('-');
        //             		var formUid = formUidArr[1];
        // 					if(formItem.checked) {
        // 						var system_code = formItem['codeName'];
        // 						var stateId = formItem['stateId'];
        // 						if(system_code !== undefined && system_code !== null) {
        // 							system_codes.push(system_code + ':' + stateId);
        // 						}
        // 						code_uids.push(formUid);
        // 					}
        // 				}

        //             }
        //         },
        //         {
        //             text: CMD_CANCEL,
        //             scope: this,
        //             handler: function () {

        //             	if(prWin) {
        //                     prWin.close();
        // 				}
        //             }
        //         }
        //     ]
        // });

        // prWin.show();
    },


    getDivisionStyle: function () {
        var divStyle = 'division_style01';

        if (this.divisions != null && this.divisions.length > 1) {

            var divItems = [];

            for (var i = 0; i < this.divisions.length; i++) {
                var o = this.divisions[i];
                divItems.push({
                    text: '[' + o.division_code + ']' + o.division_name,
                    value: o.division_code,
                    iconCls: 'division0' + (i + 1),
                    handler: function (r, l) {
                        console_logs('r.value', r.value);
                        top.location.href = vCONTEXT_PATH + '/index/main.do?division_code=' + r.value;
                    }
                });

                if (vCUR_DIVISION_CODE == o.division_code) {
                    var s = '' + (i + 1);
                    if (s.length < 2) {
                        s = '0' + s;
                    }
                    divStyle = 'division_style' + s;
                }
            }
        }
        return divStyle;
    },

    /*
        COPY STORE
        param : Ext.data.Store
        return : Ext.data.Store
     */
    deepCloneStore : function  (source) {
        source = Ext.isString(source) ? Ext.data.StoreManager.lookup(source) : source;
        var target = Ext.create(source.$className, {
            model: source.model,
        });
        target.add(Ext.Array.map(source.getRange(), function (record) {
            return record.copy();
        }));
        return target;
    },

    setBtnHiddenProp: function (reqLv) {

        /*
         바이오프로테크 선테스트 후 순차적용
         */
        if (vCompanyReserved4 !== 'BIOT01KR') {
            return false;
        }

        var userLv = 0;

        var lMenu = gu.lMenuStructKV.get(this.link);

        if (lMenu != null) {
            userLv = lMenu.permType;
        }

        return userLv < reqLv;
    },

    setCustomBtnHiddenProp: function (btnName) {

        /*
         바이오프로테크 선테스트 후 순차적용
         */
        if (vCompanyReserved4 !== 'BIOT01KR') {
            return false;
        }

        var store = gm.customBtnPermStore; // J2_CODE에 있는 커스텀 버튼 권한 정보

        if (store.loadCount > 0) {

            var records = (store.getData().getSource() || store.getData()).getRange();

            for (var i = 0; i < records.length; i++) {

                var record = records[i];

                var system_code = record.get('system_code');

                if (system_code.indexOf(':') > 1) {

                    var system_code_split = system_code.split(':');
                    var system_code_btn_name = system_code_split[1];

                    if (btnName.toUpperCase() == system_code_btn_name.toUpperCase()) {

                        var create_ep_id = record.get('create_ep_id');
                        var reqLv = 0;

                        if (create_ep_id == '*') {
                            return false;
                        }

                        if (create_ep_id == null) {
                            return false;
                        }

                        switch (create_ep_id) {
                            case 'A':
                                reqLv = 4;
                                break;
                            case 'C':
                                reqLv = 3;
                                break;
                            case 'W':
                                reqLv = 2;
                                break;
                            case 'R':
                                reqLv = 1;
                                break;
                            default:
                                return true;

                        }

                        return gu.setBtnHiddenProp(reqLv);
                    }
                }
            }
        }

        return false;
    }

});