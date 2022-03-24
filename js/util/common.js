//function sleep(milliseconds) {
//	  var start = new Date().getTime();
//	  for (var i = 0; i < 1e7; i++) {
//	    if ((new Date().getTime() - start) > milliseconds){
//	      break;
//	    }
//	  }
//	}

var propertyTabPanel = null;
var vSELECTED_PCSCODE = '';
var vSELECTED_UNIQUE_ID = '';
var MyUtf8 = {

    // public method for url encoding
    encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
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
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};

//Load javascript Source from div
function loadVar(key) {


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

}

//load javascript
function LoadJs(url) {
    if (url != null && url.length > 0) {
        var js = document.createElement('script');

        js.type = "text/javascript";
        js.src = CONTEXT_PATH + url;

//		 console_log('js.src=' + js.src);
        try {
            document.body.appendChild(js);
        } catch (e) {
            console_log("script in page exception in appendChild: " + utl + e);
            lfn_gotoHome();
        }

//		 console_log('LoadJs OK.');		
    }

}

////create random integer
//function RandomInteger() {
//	return Math.round(Math.random()*100000000*16);
//}


//create random string
function RandomString(in_size) {
    var req_size = 0;
    if (in_size > 8) {
        req_size = 8;
    } else {
        req_size = in_size;
    }

    var rand_no = Math.round(Math.random() * 100000000 * 16);
    var unique = rand_no.toString(16);

    var my_str = unique.substring(0, req_size).toUpperCase();
    for (var i = 0; my_str.length < req_size; i++)
        my_str = "0" + my_str;

    return my_str;
}


function getColName(key) {
    return getTextName(/*(G)*/vCENTER_FIELDS, key);
}

function getColNameSub(key) {
    return getTextName(/*(G)*/vCENTER_FIELDS_SUB, key);
}

function getColNameByField(fields, key) {
    return getTextName(fields, key);
}

function getUniqueIdSelected(value, p, record) {
    var uid = record.get('unique_id');
//	console_log('getUniqueIdSelected=' +uid);
    return uid;
}

//pluggable renders
function renderUser(value, p, record) {
//	console_log(value);
//	console_log(record);
//	console_log(record.get('creator') );
//	console_log(record.get('creator_uid') );
//	console_log(record.data.user_id );
//	console_log(record.data.user_name );

//    return Ext.String.format(
//        '<a href="javascript:popupUser(\'{0}\')" style="color:#98C8FF;font-weight:bold;">{1}</a>',
//        record.get('creator_uid'), value
//    );

    return Ext.String.format(
        '<a href="javascript:popupUserByUserId(\'{0}\')" onclick="popupUserByUserId(\'{0}\')" >{0}</a>',
        value
    );
//    return Ext.String.format(
//            '<font color=#15428B style="cursor:pointer;" onclick="popupUserByUserId(\'{0}\')" >{0}</font>',
//            value, value
//        );
}


renderCodeName = function (params) {

    return function (value, metadata, record, rowIndex, colIndex, store) {

        if (value == 'null' || value == null) {
            return '';
        } else {

            var codeGroup = null;
            try {
                codeGroup = eval(params.codeName);
            } catch (e) {
            }

            if (codeGroup == undefined || codeGroup == null) {
                console_logs('renderCodeName', '알수없는 경우.');
                //return "not defined field";
            } else {

                var myVal = codeGroup[value];
                if (myVal == null || myVal == '') {
                    return value;
                } else {
                    return myVal;
                }
            }

        }

    };
};

renderPartuid = function (params) {

    return function (value, metadata, record, rowIndex, colIndex, store) {

        if (value == 'null' || value == null) {
            return '';
        } else {

//			console_log(params.Partuid);


            console_log(params.Partuid + '[' + value + ']');
            return Ext.String.format(
                '<a href="javascript:popupPartByUserId(\'{1}\')" onclick="popupPartByUserId(\'{1}\')" >{0}</a>',
                value, record.get(params.Partuid)
            );

        }

    };
};

function renderItemcode(value, p, record) {


    return Ext.String.format(
        '<a href="javascript:popupPartByUserId(\'{1}\')" onclick="popupPartByUserId(\'{1}\')" >{0}</a>',
        //Record.get('unique_id')
        value, record.get('unique_id')
    );

}


renderUseruid = function (params) {

    return function (value, metadata, record, rowIndex, colIndex, store) {

        if (value == 'null' || value == null) {
            return '';
        } else {

            console_log(params.Useruid + '[' + value + ']');
            return Ext.String.format(
                '<a href="javascript:popupUserById(\'{1}\')" onclick="popupUserById(\'{1}\')" >{0}</a>',
                value, record.get(params.Useruid)
            );

        }

    };
};

function renderPohistoryItemCode(value, p, record) {
    var child = record.get('unique_id');

    return Ext.String.format(
        '<a href="#" onclick="popupPohistory(\'{0}\', \'{1}\')" >{1}</a>',
        child, value
    );
}

function renderNumber(value, p, record) {

    var isNumber = true;
    if (value == null) {
        value = 0;
    }
    for (var i = 0; i < value.length; i++) {
        var charValue = value.charCodeAt(i);
        if (charValue < 48 || charValue > 57) {
            isNumber = false;
        }
    }

    if (typeof value == 'number' || isNumber) {
        return Ext.util.Format.number(value, '0,00/i');
    } else {
        return value;
    }
}

function renderDecimalNumber(value, p, record) {

    if (typeof value == 'number') {

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                return Ext.util.Format.number(value, '0.0');
            case 'KBTC01KR':
            case 'HJSV01KR':
            case 'MJCM01KR':
            case 'KMCA01KR':
            case 'WOWT01KR':
            case 'YNJU01KR':
            case 'HSST01KR':
            case 'SJFB01KR':
            case 'SSCC01KR':
            case 'DMEC01KR':
            case 'DJEP01KR':
                return Ext.util.Format.number(value, '0,00.##');
            case 'BIOT01KR':
                return Ext.util.Format.number(value, '0,00.#####');
            case 'CHMR01KR':
                return Ext.util.Format.number(value, '0,000');
            default:
                return Ext.util.Format.number(value, '0.00');
        }

    } else {
        if (vCompanyReserved4 == 'MKEE01KR') {
            return Ext.util.Format.number(value, '0.##');
        }
        return value;
    }
}

function renderDigit(value, p, record) {
    return Ext.util.Format.number(value, '0,00.000/i');
}

function renderNumberBlank(value, p, record) {
    if (value == null || value == '') {
        return '-';
    }
    return Ext.util.Format.number(value, '0,00/i');
}

function renderDate(value, p, record) {
    console_logs('value', value);
    var dt = new Date(value);
    if (!isNaN(dt.getDay())) {
        return Ext.util.Format.date(dt, 'Y-m-d');
    }
    return '-';
}


renderSimpleDate = function (params) {

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

                switch (vCompanyReserved4) {
                    case 'DOOS01KR':
                    case 'KWLM01KR':
                    case 'HSGC01KR':
                    case 'KYNL01KR':
                    case 'KBTC01KR':
                    case 'HJSV01KR':
                    case 'DSMF01KR':
                    case 'BIOT01KR':
                    case 'YNJU01KR':
                    case 'CHMR01KR':
                    case 'SJFB01KR':
                    case 'DJEP01KR':
                        return v;
                    default:
                        record.set(indexId, v);
                        record.modified = {};
                        return v;
                }
            }
        }
    };
};

//function renderHtml(value, p, record) {
//	if(value==null) {
//		return null;
//	} else {
//		try {
//			return  value==null? null : 
//					value
//					.replace(/&amp;/g, '&')
//					.replace(/&qout;/g, '"')
//					;			
//		} catch (e) {
//			return value;
//		}
//		
//		
//	}
//}

renderDetailDate = function (params) {

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

};

renderHMDate = function (params) {

    return function (value, metadata, record, rowIndex, colIndex, store) {

        var indexId = params.dataIndex;

        if (value == null) {
            return null;
        } else {
            var len = value.length;
            if (len < 17) {
                return value;
            } else {
                var v = value.substring(0, 16);
                switch (vCompanyReserved4) {
                    case 'DOOS01KR':
                    case 'KWLM01KR':
                    case 'HSGC01KR':
                    case 'KYNL01KR':
                    case 'KBTC01KR':
                    case 'HJSV01KR':
                        return v;
                    default:
                        record.set(indexId, v);
                        record.modified = {};
                        return v;
                }
            }
        }
    };
};


function collapseLeftMenu() {
    //Left Menu를 가린다.
    //var w = Ext.getCmp("mainview-west-panel");

//    //Ext.get('mainview-property-panel').set({tabIndex:0});
//    setActiveTabByTitle('mainview-property-panel-div');
//    Ext.get('propertyDiv').update('Not Selected.');
    //w.collapse();
}


function collapseProperty() {
    //Property를 가린다.
    var w = Ext.getCmp("mainview-property-panel");

//    //Ext.get('mainview-property-panel').set({tabIndex:0});
//    setActiveTabByTitle('mainview-property-panel-div');
//    Ext.get('propertyDiv').update('Not Selected.');

    if (gDisplayProperty == true) {
        w.collapse();
    }

}

// This is assuming that the TabPanel is defined as
// a global variable 'myTabPanel'
function setActiveTabByTitle(tabId) {
// var myTabPanel =
// Ext.getCmp('mainview-property-panel');
    //console_log(propertyTabPanel);
    //propertyTabPanel.setActiveTab(tabId);
    /*
     var tabs = propertyTabPanel.find('title', tabTitle);
     propertyTabPanel.setActiveTab(tabs[0]);
     */
}

//function getSearchField(field) {
//	return 'srch' + field.substring(0,1).toUpperCase()+ field.substring(1);
//}
//function getSearchField_(field) {
//	return getSearchField(field) + '_';
//}
//function getSearchObject(field) {
//	return Ext.getCmp(getSearchField(field));
//}
//function getSearchObject_(field) {
//	return Ext.getCmp(getSearchField_(field));
//}
//function getSearchValue_(field) {
//	var o = getSearchObject_(field);
//	return o.getValue();
//}
//function getSearchValue(field) {
//	var o = getSearchObject(field);
//	return o.getValue();
//}
//function clearSrchCombo(field){
//	var o = getSearchObject(field);
//	o.clearValue();
//	o.store.removeAll();
//}


function displayPropertySpec(record, fields, open) {

    var source = {};
    var propertyNames = {};

    //console_log(/*(G)*/vCENTER_FIELDS)
    if (fields == null) {
        fields = vCENTER_FIELDS;
    }
    ;

    //console_logs('vCENTER_FIELDS', vCENTER_FIELDS);

    Ext.each(/*(G)*/fields, function (column, index) {
        console_log(column);
        var columnName = column['text'];
        var dataIndex = column['name'];
        if (
            dataIndex != 'srch_type'
            && dataIndex != 'file_itemcode'
            && dataIndex != 'htmlFileNames'
            && dataIndex != 'fileQty'
            && dataIndex != 'htmlUser_type'
            && (dataIndex != 'board_name') //예외
            && (dataIndex != 'board_content')//예외
        ) {
            console_log('columnName:dataIndex=' + columnName + ":" + dataIndex);
            var columnValue = record.get(dataIndex);
            source[dataIndex] = columnValue;
            propertyNames[dataIndex] = columnName;

            if (dataIndex == 'unique_id') {
                vSELECTED_UNIQUE_ID = columnValue;
                //console_log('vSELECTED_UNIQUE_ID='+vSELECTED_UNIQUE_ID);
            }
        }

    });

    setActiveTabByTitle('mainview-property-panel-div');

    var propGrid = Ext.create('Ext.grid.property.Grid', {
        propertyNames: propertyNames,
        source: source
    });

    var ptarget = Ext.getCmp('mainview-property-panel-div');
    if (ptarget != null) {
        ptarget.setTitle(GET_MULTILANG('dispReqInfo', vLANG));
        ptarget.removeAll();
        ptarget.add(propGrid);
        ptarget.doLayout();

    }
    if (open != false) {
        var w = Ext.getCmp("mainview-property-panel");
        if (w != null) {
            w.expand();
        }

    }

}


function displayProperty(record, fields) {
    var source = {};
    var propertyNames = {};

    //console_log(/*(G)*/vCENTER_FIELDS)
    if (fields == null) {
        fields = vCENTER_FIELDS;
    }
    ;

    Ext.each(/*(G)*/fields, function (column, index) {
        //console_log(index);
        var columnName = column['text'];
        var dataIndex = column['name'];

        if (columnName != null && columnName != '') {
            if (
                dataIndex != 'srch_type'
                && dataIndex != 'file_itemcode'
                && dataIndex != 'htmlFileNames'
                && dataIndex != 'fileQty'
                && dataIndex != 'htmlUser_type'
                && (dataIndex != 'board_name') //예외
                && (dataIndex != 'board_content')//예외
            ) {
                //console_log('columnName:dataIndex=' + columnName + ":" + dataIndex);
                var columnValue = 'not-found';
                //try {
                columnValue = record.get(dataIndex);
                //} catch(e){ console_log(e); }
                //console_log('columnValue='+columnValue);
                source[dataIndex] = columnValue;
                propertyNames[dataIndex] = columnName;

                if (dataIndex == 'unique_id') {
                    vSELECTED_UNIQUE_ID = columnValue;
                    //console_log('vSELECTED_UNIQUE_ID='+vSELECTED_UNIQUE_ID);
                }
                //Global Setting
                if (vCUR_MENU_CODE == 'EPC8' && dataIndex == 'pcs_name') {
                    vSELECTED_PCSCODE = columnValue;
                }
                if (vCUR_MENU_CODE == 'EPC7' && dataIndex == 'pcs_name') {
                    vSELECTED_PCSCODE = columnValue;
                }
            }
        }

    });


    //Ext.get('mainview-property-panel').set({tabIndex:0});
    setActiveTabByTitle('mainview-property-panel-div');

    // Ext.get('propertyDiv').update('');
    var propGrid = Ext.create('Ext.grid.property.Grid', {
        //renderTo: 'propertyDiv',
        propertyNames: propertyNames,
        source: source
        /*,
         listeners : {
         beforeedit : function(e) {
         return false;
         }
         }*/
    });

    var ptarget = Ext.getCmp('mainview-property-panel-div');

    if (ptarget != null) {
        ptarget.setTitle(GET_MULTILANG('dispReqInfo', vLANG));
        ptarget.removeAll();
        ptarget.add(propGrid);
        ptarget.doLayout();

    }
    if (open != false) {
        var w = Ext.getCmp("mainview-property-panel");
        if (w != null) {
            w.expand();
        }

    }

}


//Detect if the browser is IE or not.
//If it is not IE, we assume that the browser is NS.
var IE = document.all ? true : false

//If NS -- that is, !IE -- then set up for mouse capture
//if (!IE) document.captureEvents(Event.MOUSEMOVE)

//Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

//Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

//Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
    if (IE) { // grab the x-y pos.s if browser is IE
        tempX = event.clientX + document.body.scrollLeft
        tempY = event.clientY + document.body.scrollTop
    } else {  // grab the x-y pos.s if browser is NS
        tempX = e.pageX
        tempY = e.pageY
    }
// catch possible negative values in NS4
    if (tempX < 0) {
        tempX = 0
    }
    if (tempY < 0) {
        tempY = 0
    }
// show the position values in the form named Show
// in the text fields named MouseX and MouseY
//document.Show.MouseX.value = tempX
//document.Show.MouseY.value = tempY
    return true
}

//function yyyymmdd(dateIn, separ) {
//	
//	if(separ==null) {
//		separ = '-';
//	}
//	   var yyyy = dateIn.getFullYear();
//	   var mm = (dateIn.getMonth()+1) + '';
//	   var dd = (dateIn.getDate()) + '';
//	   if(mm.length<2) {
//		   mm = '0' + mm;
//	   }
//	   if(dd.length<2) {
//		   dd = '0' + dd;
//	   }
//	   
//	   return String(yyyy + separ + mm +  separ  + dd); // Leading zeros for mm and dd
//	}


var checkDup1 = function (a) {
    for (var i = 0; i <= a.length; i++) {
        for (var j = i; j <= a.length; j++) {
            if (i != j && a[i] == a[j]) {
                return true;
            }
        }
    }
    return false;
}

var checkDup2 = function (a) {
    var counts = [];
    for (var i = 0; i <= a.length; i++) {
        if (counts[a[i]] === undefined) {
            counts[a[i]] = 1;
        } else {
            return true;
        }
    }
    return false;
}

function removeDupArray(duplicatesArray) {
    if (!Ext.isArray(duplicatesArray)) {
        return undefined;
    }
    var uniqueArr = duplicatesArray.filter(function (elem, pos) {
        return duplicatesArray.indexOf(elem) === pos;
    });
    return uniqueArr;
};

