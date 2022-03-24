//안전하게 값지정
function SafeSetValue(id, value)
{
	var obj = $(id);
	if(obj != null && obj!=undefined)
	{
		DWRUtil.setValue(id, value, { escapeHtml:false } );
	} else {//JQUERY 확인
		try {
			$('#'+id).val(value);
		} catch(e){}
	}
}

//안전하게 값 가져오기
function SafeGetValue(id)
{
	var getted = ''
	try {
		getted =  DWRUtil.getValue(id);
	}  catch(err) {
		getted = '';
    }
    return getted;
}
	