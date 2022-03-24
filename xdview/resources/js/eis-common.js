Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
    var n = this,
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSeparator = decSeparator == undefined ? "." : decSeparator,
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
    sign = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};

//-----------------------------------------------------------------------------
//  global popup window
//	win_url	: pupup URL
//	win_name: window name
//	is_fu	: maximize (0 or 1) - equal F11 Function key
//	is_ma	: normal maximize (0 or 1)
//	wi		: width
//	he		: height
//	is_re	: resizable (0 or 1)
//	is_me	: show menubar (0 or 1)
//	is_sc	: show scrollbar (0 or 1)
//	is_st	: show statusbar (0 or 1)
//-----------------------------------------------------------------------------
function gfn_win_popup(win_url,win_name,is_fu,is_ma,wi,he,is_re,is_me,is_sc,is_st)
{
	var win_option = "";

	if(is_fu) win_option += "fullscreen,";

	win_option += "width=" + wi + ",";
	win_option += "height=" + he + ",";

	if(is_re) win_option += "resizable=yes,";
	if(is_me) win_option += "menubar=yes,";
	if(is_sc) win_option += "scrollbars=yes,";
	if(is_st) win_option += "statusbar=yes,";

	win_option += "left=" + ((screen.availWidth/2)-(wi/2)) + ",top=" + ((screen.availHeight/2)-(he/2));

	cont_win = window.open(win_url,win_name,win_option);
	if (is_ma)
	{
		cont_win.outerWidth = screen.availWidth;
		cont_win.outerHeight = screen.availHeight;
		cont_win.moveTo(0,0);
		cont_win.resizeTo(cont_win.outerWidth, cont_win.outerHeight);
	}
	cont_win.focus();
}