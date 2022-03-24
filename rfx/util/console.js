function console_log(val) {
    if (USE_CONSOLE_LOGS != 'false') {
        try {
            console.log(val);
        } catch (e) {
        }
    }
}

function console_logs(tag, val) {
    //console.log(tag, val);

    if (tag == undefined && val == undefined) {
        return;
    }
    if (USE_CONSOLE_LOGS != 'false') {
        try {
            if (gMain != undefined && gMain.selPanel != null) {
                tag = '[' + gMain.selectedMenuId + ']' + tag;
            }
            console.log(tag + '(' + typeof(val) + ')', val);
        } catch (e) {
        }
    }
}

function console_logs_o(o, tag, val) {
    if (typeof o !== 'object') {
        return;
    }
    if (tag == undefined && val == undefined) {
        return;
    }
    if (USE_CONSOLE_LOGS != 'false') {
        try {
            if (gMain != undefined && gMain.selPanel != null) {
                tag = '[' + gMain.selectedMenuId + ']' + tag;
            }
            console.log('#' + tag + '(' + typeof(val) + ')', val, '    호출된곳:', o);
        } catch (e) {
        }
    }
}
function console_logs_dummy(tag, val) {
}