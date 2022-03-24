
var serial_no;

function filterCubeCmd(command_str) {
	
	var filtered = null;
	
	var cmd_array  = command_str.split("-");
	
	switch( cmd_array[0] )
	{
		case "p01": filtered = "c01";	break;
		case "p02": filtered = "c02";	break;
		case "p03": filtered = "c19";	break;
		case "p04": filtered = "c20";	break;
		case "p05": filtered = "c18";	break;
		case "p06": filtered = "c21";	break;
		case "o01": filtered = "h04";	break;
		case "o02": filtered = "h05";	break;
		case "o03": filtered = "a01";	break;
		case "o04": filtered = "a02";	break;
		case "o05": filtered = "a03";	break;
		case "o06": filtered = "a04";	break;
		case "o07": filtered = "b01";	break;
		case "o08": filtered = "b03";	break;
		case "o09": filtered = "b05";	break;
		case "o10": filtered = "b06";	break;
		case "o11": filtered = "b07";	break;
		case "o12": filtered = "a05";	break;
		case "o13": filtered = "a06";	break;
		case "o14": filtered = "a07";	break;
		case "o15": filtered = "a09";	break;
		
		//case "q01": filtered = "h10";	break;
		
		//case "q02": filtered = "h11";	break;
		case "q03": filtered = "i01";	break;
		case "q04": filtered = "d19";	break;
		case "q05": filtered = "i01";	break;
		case "q06": filtered = "d19";	break;
		case "q07": filtered = "h14";	break;
		case "q08": filtered = "h15";	break;
		case "q09": filtered = "a51";	break;
		case "q10": filtered = "a53";	break;
		case "q11": filtered = "a52";	break;
		case "r01": filtered = "e01";	break;
		case "r02": filtered = "e02";	break;
		case "r03": filtered = "e03";	break;
		case "r04": filtered = "e04";	break;
		case "r05": filtered = "m01";	break;
		case "r06": filtered = "m02";	break;
		case "r07": filtered = "m12";	break;
		case "s01": filtered = "f03";	break;
		case "s02": filtered = "f04";	break;
		case "s03": filtered = "f01";	break;
		case "s04": filtered = "f30";	break;
		case "s05": filtered = "h12";	break;
		case "s06": filtered = "h13";	break;
		case "s07": filtered = "h16";	break;
		case "s08": filtered = "f48";	break;
		case "s09": filtered = "f49";	break;
		case "s10": filtered = "h08";	break;
		case "s11": filtered = "h17";	break;
		case "s12": filtered = "g01";	break;
		case "s13": filtered = "g02";	break;
		default:	filtered = cmd_array[0]; break;
	}
	
	if(cmd_array.length>1) {
		filtered = filtered + '-' + cmd_array[1];
	} else {
		filtered = filtered;
	}
	
	return filtered;
}

function setSearchButtonMenu( command_str )
{
	//case 문에 해당하는 경우
	var this_case = true;

	serial_no =0;
	
	//--메뉴스트링 초기화
	StrButtonMenu = "";
	
	var token = filterCubeCmd(command_str);
	switch( token ){
//----------------TOP----------------
	case "home":
		addButtonMenu(command_str, "Refresh", "gotoRoot");
		break;
//-----------------A------------------
	case "div12":
		addButtonMenu(command_str, CMD_SEND, "sendRfqMail");
		addButtonMenu(command_str, CMD_VEXCEL, "viewExcel");
		break;
 	case "a05":
 		addButtonMenu(command_str, CMD_SEND, "sendRfqMail");
 		addButtonMenu(command_str, CMD_DEL_CART, "doCartDelete");
 		break;
 	case "div13":
		//addButtonMenu(command_str, CMD_VPDF, "viewPdf");
		addButtonMenu(command_str, CMD_SEND, "sendRfqMail");
		break;
	case "a07":
		addButtonMenu(command_str, CMD_DELETE, "doDelete");
		addButtonMenu(command_str, CMD_QUOTA_SUBMIT, "submitQuota");
		addButtonMenu(command_str, CMD_SENDMAIL_DIRECT, "sendMailDirect");
		break;
		
	case "a02":
		addButtonMenu(command_str, CMD_SEND, "sendMail");
		//addButtonMenu(command_str, CMD_CANCEL, "doGeneralCancel");
		break;
 	case "a11":
		addButtonMenu(command_str, CMD_VPDF, "viewPdf");
		addButtonMenu(command_str, CMD_SEND, "sendMail");
		break;
	case "a20":
		break;	
	case "a20-sendEmail":
		addButtonMenu(command_str, CMD_EMAIL_SEND, "doSendEmail");
		break;
	case "a20-sendEmailView":
		addButtonMenu(command_str, CMD_EMAIL_SEND, "doSendEmail");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
		break;
	case "a20-sendEmailByAssy":
		addButtonMenu(command_str, CMD_EMAIL_SEND_BY_ASSY, "doSendEmailByAssy");
		break;			
	case "a30":
		addButtonMenu(command_str, CMD_DEPLOY, "deployFile");
		break;
	case "a04":
	case "a34":
	case "a35":
	case "a21":
	case "a22":
	case "a52":
	case "a53":
		addButtonMenu(command_str, CMD_DELETE, "doDelete");
		break;
	case "a37":
		addButtonMenu(command_str, CMD_CONFIRM, "addStandardName");	
		break;
	case "a40":
	case "a41":
		addButtonMenu(command_str, CMD_SEL_SUP, "selectSupplier");
		addButtonMenu(command_str, CMD_RERFQ, "sendRfqEMail");
		break;
	case "a51":
		//addButtonMenu(command_str, CMD_SEND, "sendPdf");
		addButtonMenu(command_str, CMD_DELETE, "doDelete");
		addButtonMenu(command_str, CMD_DOWNLOAD, "doDownload");
		break;
//-----------------B------------------
 	case "b01":
		addButtonMenu(command_str, CMD_DO_SUBMIT, "submitCheck");
		addButtonMenu(command_str, CMD_TEMP_SAVE, "saveCheck");
		break;
	case "b02":
		addButtonMenu(command_str, CMD_DO_SUBMIT, "submitCheck");
		addButtonMenu(command_str, CMD_DEL_CART, "doCartDelete");
		break;
	case "b03-view":
		addButtonMenu(command_str, CMD_MODIFY, "modifyRouting");
		addButtonMenu(command_str, CMD_SUBMIT_CANCEL, "submitCancel");
		break;
	case "b03-view-back":
		addButtonMenu(command_str, CMD_BACK, "goBack");
		break;
	case "b03":
		//addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_DELETE, "doDelete");
		addButtonMenu(command_str, CMD_PRINT_EXCEL, "printExcelFile");
		break;
	case "b04":
		//addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_DELETE, "doDelete");
		break;
	case "b05-view":
	case "b05-edit":
		addButtonMenu(command_str, CMD_OK, "submitCheck");
		addButtonMenu(command_str, CMD_DENY, "denyCheck");
		break;
	case "b06":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_DELETE, "doGeneralDelete");
		addButtonMenu(command_str, CMD_PRINT_EXCEL, "printExcelFile");
		break;
	case "b07":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_DELETE, "doGeneralDelete");
		break;
	//case "b08":
		//addButtonMenu(command_str, CMD_REQ_CANCEL, "doGeneralDelete");
	//	break;
	case "b17":
		addButtonMenu(command_str, CMD_OK, "submitCheck");
		addButtonMenu(command_str, CMD_DENY, "denyCheck");
		break;
	case "c19":	
		addButtonMenu(command_str, CMD_ADD, "submitAdd");
		break;
	case "b30":
		addButtonMenu(command_str, CMD_DO_SUBMIT, "submitCheck");
		addButtonMenu(command_str, CMD_TEMP_SAVE, "saveCheck");
		break;
//-----------------C------------------
	case "c01":
	case "c31":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		addButtonMenu(command_str, CMD_REFRESH, "doRefresh");
		addButtonMenu(command_str, CMD_PRINT_EXCEL, "printExcelFile");
		break;
	case "c01-edit":
	case "c31-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifyProject");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
		break;
	case "c02":
		addButtonMenu(command_str, CMD_REGIST, "registerProject");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c02-edit":
		addButtonMenu(command_str, CMD_REGIST, "registerProject");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c17":
	case "c21":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmScheduling");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c18":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmScheduling");
		addButtonMenu(command_str, CMD_INIT, "clearField");	
		break;
	case "c22":
		addButtonMenu(command_str, CMD_SEND, "sendMail");
		break;
	case "c41":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuSave");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c42":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuSave");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c43":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuSearch");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c44":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuSave");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c45":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuSave");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c46":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuStatsSearch");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c47":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_PRINT_EXCEL, "printExcelFile");
		//addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuStatsSearch");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "c48":
		addButtonMenu(command_str, CMD_CONFIRM, "confirmGongsuStatsSearch");
		//addButtonMenu(command_str, CMD_INIT, "clearField");
		break;		
//-----------------D------------------
	case "d01":
	case "d41":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		addButtonMenu(command_str, CMD_MY_PRD_REGIST, "doGeneralCartSet");
//		addButtonMenu(command_str, CMD_MY_PRD_VIEW, "doGeneralCartList");
		break;
	case "d01-edit":
	case "d41-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifyMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
	break;
	case "d02":
		addButtonMenu(command_str, CMD_REGIST, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "d02-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifyMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
	break;
	case "d03":
		addButtonMenu(command_str, CMD_REGIST, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "d04":
		addButtonMenu(command_str, CMD_REGIST, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "d05":
		addButtonMenu(command_str, CMD_PART_COPY, "doCopyPart");
		break;
	case "d05-edit":
		addButtonMenu(command_str, CMD_MODIFY, "doModify");
		break;
	case "d08":
		addButtonMenu(command_str, CMD_ADD_CART, "doAddCart");
		addButtonMenu(command_str, CMD_PRINT_EXCEL, "printExcelProject");
//		addButtonMenu(command_str, CMD_PART_COPY, "doCopyPart");
//		addButtonMenu(command_str, CMD_PART_PASTE, "doPastePart");
	break;
	case "d08-regist":
		addButtonMenu(command_str, CMD_ADD_CART, "doAddCart");
		addButtonMenu(command_str, CMD_REGIST, "doRegistPart");
//		addButtonMenu(command_str, CMD_PART_COPY, "doCopyPart");
//		addButtonMenu(command_str, CMD_PART_PASTE, "doPastePart");
	break;
	case "d11":
		addButtonMenu(command_str, CMD_REGIST, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "d11-edit":
		addButtonMenu(command_str, CMD_MODIFY, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "d16":
		addButtonMenu(command_str, CMD_APPLY_BAT, "allApply");
		addButtonMenu(command_str, CMD_PUR_REQUEST, "doGeneralSellSet");
		addButtonMenu(command_str, CMD_ITEM_DEL, "doGeneralCartDelete");
		break;
	case "d17":
		//addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		//addButtonMenu(command_str, CMD_MODIFY, "doGeneralSellSet");
		addButtonMenu(command_str, CMD_CANCEL, "doGeneralCancel");
		break;
	case "d18":
		addButtonMenu(command_str, CMD_DELETE, "doCartDelete");
		break;
	case "d19":
		addButtonMenu(command_str, CMD_REGIST, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "d20":
	case "d21":
	case "d22":
		addButtonMenu(command_str, CMD_DEPLOY, "deployFile");
	break;
	case "d31":
	case "d32":
	case "d34":
		addButtonMenu(command_str, CMD_CONFIRM, "addStandardName");
	break;
//-----------------E------------------
	case "e01":
	case "e03":
	case "e12":	
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "e01-edit":
	case "e12-edit":	
		addButtonMenu(command_str, CMD_MODIFY, "registerPeople");	
		break;		
	case "e03-view":
		addButtonMenu(command_str, CMD_BACK, "goBack");
		break;
	case "e03-edit":
		addButtonMenu(command_str, CMD_MODIFY, "doSubmit");
		break;
	case "e02":
		addButtonMenu(command_str, CMD_REGIST, "registerPeople");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "e04":
		addButtonMenu(command_str, CMD_REGIST, "registerBuyer");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "e05":
	case "div11":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "e05-edit":
		addButtonMenu(command_str, CMD_MODIFY, "editSupplier");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
	break;
	case "e05-view":
		addButtonMenu(command_str, CMD_BACK, "goBack");
	break;
	case "e06":
	case "div10":
		addButtonMenu(command_str, CMD_REGIST, "registerSupplier");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "e09-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifyPromotion");
		addButtonMenu(command_str, CMD_DELETE, "prmtDelete");
	break;
	case "e10":
	case "e11":
		addButtonMenu(command_str, CMD_REGIST, "registPromotion");
	break;
	case "e13":
	case "e15":
	case "e16":
		addButtonMenu(command_str, CMD_DEPLOY, "deployFile");
	break;	
	
//-----------------F------------------
	case "f01":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f01-edit":
		addButtonMenu(command_str, CMD_MODIFY, "doSubmit");
		break;
	case "f03":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f03-edit":
		addButtonMenu(command_str, CMD_MODIFY, "doSubmit");
	break;
	case "f04":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "f11":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f13":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f15":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f21":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f21-edit":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "f21-view":
		addButtonMenu(command_str, CMD_LIST, "listform");
		addButtonMenu(command_str, CMD_MODIFY, "editform");
		addButtonMenu(command_str, CMD_DELETE, "deleteform");
	break;
	case "f22":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "f22-edit":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "f22-view":
		addButtonMenu(command_str, CMD_LIST, "listform");
		addButtonMenu(command_str, CMD_MODIFY, "editform");
		addButtonMenu(command_str, CMD_DELETE, "deleteform");
		break;
	case "f25":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "f26":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "f33-view":
		addButtonMenu(command_str, CMD_LIST, "listform");
	break;
	case "f30":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "f42":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "f45":
		addButtonMenu(command_str, CMD_CONFIRM, "doConfirm");
	break;
	case "f47":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "doInit");
	break;
	case "f48":
		addButtonMenu(command_str, CMD_DEPLOY, "deployFile");
	break;
	case "f49":
		addButtonMenu(command_str, CMD_DEPLOY, "deployFile");
	break;
	case "f51":
		addButtonMenu(command_str, CMD_CONFIRM, "doSubmit");
	break;
	case "f52":
		addButtonMenu(command_str, CMD_CONFIRM, "addJobCode");
	break;
//-----------------G------------------
	case "g01":
	case "div03":
	case "g03":
		addButtonMenu(command_str, CMD_MODIFY, "doSubmit");
	break;
	case "g01-edit":
		addButtonMenu(command_str, CMD_CONFIRM, "doSubmit");
		addButtonMenu(command_str, CMD_INIT , "clearField");
	break;
	case "g02":
		addButtonMenu(command_str, CMD_CONFIRM, "doSubmit");
		addButtonMenu(command_str, CMD_INIT , "clearField");
	break;
	case "g04":
		addButtonMenu(command_str, CMD_SET, "setCurProject");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
//-----------------H------------------
	case "h02-view":
	case "h04-view":
		addButtonMenu(command_str, CMD_MODIFY, "board_modify");
		addButtonMenu(command_str, CMD_DELETE, "board_delete");
	break;
	case "h02-edit":
	case "h04-edit":
		addButtonMenu(command_str, CMD_SAVE, "board_modify");
		addButtonMenu(command_str, CMD_GO_LIST, "board_list");
	break;
	case "h05":
	case "h03":
		addButtonMenu(command_str, CMD_SAVE, "board_insert");
	break;
	case "h08":
	case "h17":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "doInit");
	break;
	case "h09":
		addButtonMenu(command_str, CMD_SEND, "sendSms");
	break;
	case "h11":
		//addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
	break;
	case "h12":
		addButtonMenu(command_str, CMD_SAVE, "doSubmit");
	break;
	case "h16":
		addButtonMenu(command_str, CMD_MODIFY, "doSubmit");
	break;
//-----------------I------------------
	case "i01":
	case "i11":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		addButtonMenu(command_str, CMD_MY_PRD_REGIST, "doGeneralCartSetI");
		addButtonMenu(command_str, CMD_PRODUCT_COPY, "doGeneralProductMove");
	break;
	case "i07":
	case "i08":	
	case "j21":
	case "j22":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_REGIST, "doRegist");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
	break;
	case "i01-edit":
	case "i11-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifyMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
	break;
	case "i02":
	case "i05":
		addButtonMenu(command_str, CMD_REGIST, "registerMaterial");
		addButtonMenu(command_str, CMD_INIT, "clearField");
	break;
	case "i03":
		addButtonMenu(command_str, CMD_DEPLOY, "deployFile");
	break;
	case "i06":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_MY_PRD_REGIST, "doGeneralCartSetI");
		addButtonMenu(command_str, CMD_PRODUCT_MOVE, "doGeneralProductMove");
	break;
	case "j20":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");		
	break;
//-----------------J------------------
	case "j01":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_PO_CANCEL, "doPoDelete");
		break;
	case "j02":
	{
		if(iamfreeuser==true || iamfreeuser=='true') {
			addButtonMenu(command_str, CMD_CR_PO, "doSubmitOkFree");
			
		} else {
			addButtonMenu(command_str, CMD_ORDER_SUBMIT, "doSubmitOk");
			addButtonMenu(command_str, CMD_DENY, "doSubmitDeny");
			//addButtonMenu(command_str, CMD_DEL_CART, "doCartDelete"); -- 구매요청에서 삭제한다.

		}
	}
		break;
	case "j04":
		addButtonMenu(command_str, CMD_GR_CONFIRM, "doGoodsReceipt");
		addButtonMenu(command_str, CMD_REFRESH, "doRefresh");
		break;
	case "j05":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_GR_CANCEL, "submitCheck");
//		addButtonMenu(command_str, CMD_THISMONTH_GR, "searchThisMonthGr");
//		addButtonMenu(command_str, CMD_NOT_CHK_LIST, "searchNotFixed");
//		addButtonMenu(command_str, CMD_THISMONTH_NOT_CHK, "searchThisMonthNotFixed");
		break;
	case "j06":
		addButtonMenu(command_str, CMD_GR_CONFIRM, "doGoodsReceipt");
		break;
	case "j07":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_REFRESH, "doRefresh");
		break;
	case "j08":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		break;
	case "j10":
	case "div15":
		addButtonMenu(command_str, CMD_DT_SEND, "pdfDtSend");
		addButtonMenu(command_str, CMD_DT_RECV, "pdfDtRecv");
		addButtonMenu(command_str, CMD_DT_ALL, "pdfDtAll");
		break;
	case "j12":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");		
		addButtonMenu(command_str, CMD_ADD_CART, "doGeneralCartSet");
		addButtonMenu(command_str, CMD_VIEW_CART, "doGeneralCartList");
		addButtonMenu(command_str, CMD_DENY, "doGeneralReturn");
		break;
	case "j15":
		addButtonMenu(command_str, CMD_APPLY_BAT, "allApply");
		addButtonMenu(command_str, CMD_ORDER, "doGeneralSellSet");
		addButtonMenu(command_str, CMD_ITEM_DEL, "doGeneralCartDelete");
		break;
	case "j16":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		//addButtonMenu(command_str, CMD_MODIFY, "doGeneralEditSet");
		//addButtonMenu(command_str, CMD_CANCEL, "doGeneralCancel");
		break;
	case "j19":	
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		break;
	case "j26":
		addButtonMenu(command_str, CMD_REQ_RECEIVE, "doPrReceive");
		addButtonMenu(command_str, CMD_DENY, "doPrDeny");
		addButtonMenu(command_str, CMD_REFRESH, "doRefresh");
		break;
	case "j27":
		addButtonMenu(command_str, CMD_PRODUCT_MAKE, "doSubmit");
		break;
//-----------------M------------------
	case "m01":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "m01-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifySleAst");
		break;
	case "m02":
		addButtonMenu(command_str, CMD_REGIST, "registerSale");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "m03":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_REFRESH, "doRefresh");
		break;
	case "m04":
		addButtonMenu(command_str, CMD_DELETE, "doDelete");
		addButtonMenu(command_str, CMD_QUOTA_SUBMIT, "submitSorder");
		break;
	case "m06":
		addButtonMenu(command_str, CMD_REGIST, "createDel");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "m07":
		addButtonMenu(command_str, CMD_PRINT_EXCEL, "printExcelFile");
		break;
	case "m08":
		addButtonMenu(command_str, CMD_REGIST, "createTaxSheet");
		//addButtonMenu(command_str, CMD_DT_SEND, "pdfDtSend");
		//addButtonMenu(command_str, CMD_DT_RECV, "pdfDtRecv");
		//addButtonMenu(command_str, CMD_DT_ALL, "pdfDtAll");
		break;
	case "m11":
		addButtonMenu(command_str, CMD_CONFIRM, "addArReceive");
		break;
	case "m12":
		addButtonMenu(command_str, CMD_REGIST, "registerDaySale");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "m12-edit":
		addButtonMenu(command_str, CMD_MODIFY, "modifySleAdt");
		break;
	case "m13":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "resetAllField");
		break;
	case "m14":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "resetAllField");
		break;
	case "m15":
	case "m17":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		break;
	case "m16":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_INIT, "resetAllField");
		break;
	case "m19":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "m19-edit":
		addButtonMenu(command_str, CMD_CONFIRM, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		addButtonMenu(command_str, CMD_BACK, "goBack");
		break;
//-----------------N------------------
	case "n01":
	case "n03":
	case "n07":
		addButtonMenu(command_str, CMD_SEARCH, "doGeneralSearchSubmit");
		addButtonMenu(command_str, CMD_INIT, "doGeneralSearchReset");
		break;
	case "n01-edit":	
		addButtonMenu(command_str, CMD_MODIFY, "modifyRequest");
		addButtonMenu(command_str, CMD_BACK, "goBack");
		break;
	case "n02":
	case "n04":
		addButtonMenu(command_str, CMD_REGIST, "registerSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;	
	case "n08":
		addButtonMenu(command_str, CMD_REGIST, "registerSale");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "n05":
		addButtonMenu(command_str, CMD_REGIST, "registerSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
	case "n09":
	case "n10":
		addButtonMenu(command_str, CMD_REGIST, "registerSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;	
	case "n11":
		addButtonMenu(command_str, CMD_REGIST, "registerSubmit");
		addButtonMenu(command_str, CMD_INIT, "clearField");
		break;
		
//-----------------O------------------	
		case "o16":
		addButtonMenu(command_str, CMD_REGIST, "doSubmit");
		break;
//-----------------Q------------------		
	case "q01":
	case "q02":
		addButtonMenu(command_str, CMD_SEARCH, "doSubmit");
		addButtonMenu(command_str, CMD_ADD_CART, "doAddCart");
		break;
	case "q13":
		addButtonMenu(command_str, CMD_CONFIRM, "doSubmit");
		break;
	default:
		StrButtonMenu = Gdisplaytitle;
		this_case = false;
		break;

	}
	if(this_case==true)
	{
		SafeSetValue("button_menu", "<b>" + StrButtonMenu + "</b>");
	}
	else
	{
		SafeSetValue("button_menu", "<span class='waiting_span'>" +StrButtonMenu + "</span>");
	}
	
}