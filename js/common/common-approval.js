var gItemDivider 		= "↔";
var gSubItemDivider 	= "↕";

var SUBMIT_CODE 			= 0;
var APPROVAL_CODE 			= 1;
var AGREEMENT_CODE 			= 2;
var POST_APPROVAL_CODE 		= 3;
var NOTIFICATION_CODE 		= 9;
var PARALLELAPP_CODE 		= 7;
var PARALLELAGREE_CODE 		= 4;

var PROCESSING_SATE_CODE 	= "PROCESSING";
var REJECTED_SATE_CODE 		= "REJECTED";
var WITHDRAWN_SATE_CODE 	= "WITHDRAWN";
var COMPLETED_SATE_CODE 	= "COMPLETED";
var POST_COMPLETED_STATE_CODE 	= "POSTAPPROVAL";
var POST_REJECTED_STATE_CODE 	= "POSTREJECTED";
var ARBITRARY_STATE_CODE 	= "ARBITRARY";

var gArrayListRoute = new Array();

//사용자 id를 담을 Array
var initRoutingInfo;
var userInfoArray;
var arrayLength = 0;
var k = 0;

//사용자 정보 구성 obj
function ApprovalRouteInfo(sequence, activityType, userId, name, grade, dept, company, parallelGroupId, deleteYN) {
	this.sequence = sequence;
	this.activityType = activityType;
	this.userId = userId;
	this.name = name;
	this.grade = grade;
	this.dept = dept;
	this.company = company;
	if (typeof(parallelGroupId) == "undefined") {
		this.parallelGroupId = -1;
	} else {
		this.parallelGroupId = parallelGroupId;
	}
	if (typeof(deleteYN) == "undefined") {
		this.deleteYN = "Y";
	} else {
		this.deleteYN = deleteYN;
	}
	this.saveAppString = saveAppString(sequence, activityType, userId);
}

//팝업에서 parent 객체 생성
function genObj(sequence, activityType, userId, name, grade, dept, company, parallelGroupId, deleteYN){
	var obj = new ApprovalRouteInfo(sequence, activityType, userId, name, grade, dept, company, parallelGroupId, deleteYN);
	return obj;
}

//팝업에서 결재경로List array 새로 생성
function newArrayListRoute() {
	gArrayListRoute = new Array();
}

function saveAppString(sequence, activityType, userId) {
	var rtn = sequence+gSubItemDivider+activityType+gSubItemDivider+userId;
	return rtn;
}

/**  
 * ActivityType에 대한 MessageCode 가져오기
 **/
function getActivityTypeMessageCode(activityType){
	
	if (activityType == SUBMIT_CODE) {
		return Message.submit;
	} else if (activityType == APPROVAL_CODE) {
		return Message.approval;
	} else if (activityType == AGREEMENT_CODE) {
		return Message.agreement;
	} else if (activityType == POST_APPROVAL_CODE) {
		return Message.postApproval;
	} else if (activityType == NOTIFICATION_CODE) {
		return Message.notification;
	} else if (activityType == PARALLELAPP_CODE) {
		return Message.parallelApp;
	} else if (activityType == PARALLELAGREE_CODE) {
		return Message.parallelAgree;
	}
	
	return "";
}


/**  
 * State에 대한 MessageCode 가져오기
 **/
function getStateMessageCode(activityType){
	
	if (activityType == PROCESSING_SATE_CODE) {
		return Message.stateProcessing;
	} else if (activityType == REJECTED_SATE_CODE || activityType == POST_REJECTED_STATE_CODE) {
		return Message.stateRejected;
	} else if (activityType == WITHDRAWN_SATE_CODE) {
		return Message.stateWithdrawn;
	} else if (activityType == COMPLETED_SATE_CODE) {
		return Message.stateCompleted;
	} else if (activityType == POST_COMPLETED_STATE_CODE) {
		return Message.statePostApproval;
	} else if (activityType == ARBITRARY_STATE_CODE) {
		return Message.stateArbitrary;
	} 
	
	return "";
}

/**  
 * 현재 결재경로에서 최종 결재자/합의자 return
 * - 최종 결재자가 병렬합의/ 병렬결재인 경우 병렬에 속한 모든 사람 return 
 **/
function getLastApproverId (){

	var lastApprIdList = new Array();
	var gLen = gArrayListRoute.length;
	var len = 0;
	var lastApprSeq = "";
	
	for (var i = gLen-1; i >= 0 ; i--) {
		if (gArrayListRoute[i] == null 
				|| gArrayListRoute[i].activityType == NOTIFICATION_CODE
				|| gArrayListRoute[i].activityType == SUBMIT_CODE) {
			continue;
		}else{
			if(lastApprSeq != "" && lastApprSeq != gArrayListRoute[i].sequence){
				break;
			}else{
				lastApprSeq = gArrayListRoute[i].sequence;
				lastApprIdList[len++] = gArrayListRoute[i].userId;
			}
		}
	}
	return lastApprIdList;
}

/**  
 * 현재 결재경로에서 해당 Type에 해당하는 결재자수 반환 
 **/
function getActivityTypeCount(activityType){
	var nApprovalCnt = 0, nConsentCnt = 0, nPostApprovalCnt = 0, nNotificationCnt = 0;
	var nExaminationCnt = 0, nDecisionCnt = 0, nAgreemnetCnt = 0, nConfirmCnt = 0;
	for (var i = 0; i < gArrayListRoute.length; i++) {
		if (gArrayListRoute[i] == null) {
			continue;
		}
		if (gArrayListRoute[i].activityType == APPROVAL_CODE) {
			nApprovalCnt++;
		} else if (gArrayListRoute[i].activityType == AGREEMENT_CODE) {
			nConsentCnt++;
		} else if (gArrayListRoute[i].activityType ==  PARALLELAGREE_CODE) {
			nConsentCnt++;
		} else if (gArrayListRoute[i].activityType == PARALLELAPP_CODE) {
			nApprovalCnt++;
		} else if (gArrayListRoute[i].activityType == NOTIFICATION_CODE) {
			nNotificationCnt++;
		} else if (gArrayListRoute[i].activityType == POST_APPROVAL_CODE) {
			nPostApprovalCnt++;
		}
	}

	if (activityType == APPROVAL_CODE) {
		return nApprovalCnt;
	} else if (activityType == AGREEMENT_CODE) {
		return nConsentCnt;
	} else if (activityType == POST_APPROVAL_CODE) {
		return nPostApprovalCnt;
	} else if (activityType == NOTIFICATION_CODE) {
		return nNotificationCnt;
	}
	return "";
}

/**  RouteArray 정보 String으로 변환 
 * 
 **/
function appRouteArrayToRouteString(includedSubmitter) {
	
	// 기안자 포함 여부 
	if (typeof(includedSubmitter) == "undefined") includedSubmitter = true;
	
	if(includedSubmitter) iCnt = 0;
	else iCnt = 1;
		
	var arrayLength = gArrayListRoute.length;
	var routeString = "";
	if(arrayLength > 0) {
		for(var i = iCnt; i < arrayLength; i++) {
			routeString += ( routeString == "" ) ? gArrayListRoute[i].saveAppString : gItemDivider + gArrayListRoute[i].saveAppString;
		}
	}
	
	return routeString;
}

/**  RouteArray 정보 String으로 변환 (보류함 저장시사용)
 * 
 **/
function draftRouteArrayToRouteString(includedSubmitter) {
	
	// 기안자 포함 여부 
	if (typeof(includedSubmitter) == "undefined") includedSubmitter = true;
	
	if(includedSubmitter) iCnt = 0;
	else iCnt = 1;
		
	var arrayLength = gArrayListRoute.length;
	var routeString = "";
	if(arrayLength > 0) {
		for(var i = iCnt; i < arrayLength; i++) {
			var routeDelete = "";
			if (typeof(gArrayListRoute[i].deleteYN) == "undefined" || gArrayListRoute[i].deleteYN=="") {
				routeDelete = "Y";
			} else {
				routeDelete = gArrayListRoute[i].deleteYN;
			}
			routeString += ( routeString == "" ) ? gArrayListRoute[i].saveAppString+gSubItemDivider+routeDelete : gItemDivider + gArrayListRoute[i].saveAppString+gSubItemDivider+routeDelete;
		}
	}
	
	return routeString;
}

/** 
사용자 검색 하지 않고 받아 오는 경우...-> js
모든 결재자 정보가 String으로 넘어 온다는 가정

addAppRouteString =
	sequence + activityType + userId + name + grade  + dept + company + deleteYN

결재자의 정보 항목 구분자 = "↕"
결재자 별 구분자 = "↔"
예시) addAppRouteString = "1↕approval_type↕S020318204425ZAN0896↕장유락↕↕선임↕↕서비스그룹↕↕RFX";
**/

function addApprovalRouteArray(addAppRouteString, apprLenCheck) {
	var selOpt = document.getElementById("approvalRoute");
	//테스트 용....
	//addAppRouteString = "1↕1↕S020318204425ZAN0896↕장유락↕↕선임↕↕서비스그룹↕↕RFX"+
	//					"↔2↕1↕S020318204425ZAN0896↕장유락↕↕선임↕↕서비스그룹↕↕RFX"+
	//					"↔3↕2↕P040128105206C600129↕박동희↕↕선임↕↕서비스그룹↕↕RFX"+
	//					"↔4↕2↕P040225111424C600037↕강은경↕↕선임↕↕서비스그룹↕↕RFX";
	if (addAppRouteString != "" && addAppRouteString != "undefined" ) {
		var array_data = addAppRouteString.split("↔");
		var user_info; 
		var sequence;
		var activityType;
		var userId;
		var name;
		var grade;
		var dept;
		var company;
		var deleteYN;
		
		var maxSeq = getMaxSeq();
		var checkTypeCode =  new Array();
		var iTypeCode = 0;
		
		// 결재 경로에서 사용 하고 있는 타입 
		for (var iType = 0; iType < document.all.activityType.length; iType++) {
			
			var checkCode = document.all.activityType[iType].value;  // 1, 2, 3, 9
			checkTypeCode[iTypeCode++] = checkCode;
			
			if(checkCode == APPROVAL_CODE){ // 결재인 경우 병렬 결재 포함
				checkTypeCode[iTypeCode++] = PARALLELAPP_CODE;  // 7
			}else if(checkCode == AGREEMENT_CODE){ // 합의인 경우 병렬 합의 포함
				checkTypeCode[iTypeCode++] = PARALLELAGREE_CODE; //4
			}
		}
		

		var checkDuplicateUser = true;
		for (var i = 0; i < array_data.length; i++) {
			
			user_info = array_data[i].split("↕");
			sequence = eval(user_info[0])+eval(maxSeq);   
			activityType = user_info[1];
			userId = user_info[2];
			name = user_info[3];  
			grade = user_info[4];
			dept = user_info[5];
			company = user_info[6];
			deleteYN = user_info[7];
			
			//locale=en이면
			//name = user_info[4];  
			//grade = user_info[6];
			//dept = user_info[8];
			//company = user_info[10];
			var checkUser = false;
			if(apprLenCheck != false){
				
				if (gArrayListRoute.length >= 99) {
					ComSharedShowMessage.showAlert(Message.approvalAlert.maxApprovalUser); //"100명이상 지정할 수 없습니다."
					break;
				}
			}
			
			//중복 체크 후 추가(이미 지정되어 있는지 확인)
			for (var j = 0; j < selOpt.length; j++) {
				if (selOpt.options[j].value == userId) {
					checkUser = true;
					break;
				} 
			}
			
			// 사용 가능한 타입인지 확인
			var checkType = false;
			for (var iCode = 0; iCode < checkTypeCode.length; iCode++) {
				if(activityType == checkTypeCode[iCode]){
					checkType = true;
					break;
				}
			}
			
			
			
			// 사용 가능하지 않는결재 타입이라면 
			// 1. 대체 코드 (예, 후결 ->결재) 변경 
			// 2. 없는 경우는 결재 목록에 추가하지 않음
			if(checkType == false){
				if(activityType == POST_APPROVAL_CODE){
					activityType = APPROVAL_CODE;
					checkType = true;
				}
			}
			
			// 중복 사용자가 없고, 사용 가능한 타입인 경우에만 추가 
			// 중복 사용자가 있는 경우에는 경고창을 띄움
			// 사용가능 하지 않는 경우는 전자 요청에 의해 경고창 띄우지 않음
			if(checkUser == true){
				if(checkDuplicateUser)ComSharedShowMessage.showAlert(Message.approvalAlert.duplicateUser);//"중복된 사용자가 있습니다."
				checkDuplicateUser = false;
			}else if(checkType == false){
				//ComSharedShowMessage.showAlert("사용할 수 없는 타입의 사용자가 있습니다");
			}else{
				var objApproverRoute = new ApprovalRouteInfo(sequence, activityType, userId, name, grade, dept, company, -1, deleteYN);
				gArrayListRoute[gArrayListRoute.length] = objApproverRoute;
			}
		}
		gArrayListRoute = arrangeSequence(gArrayListRoute);
		displaySelectAppBox();	
	}
}

//현재 경로 중 Max seq 반환(기존 결재경로가 있는경우 병렬이 풀리는 현상 방지 2010.05.13 한석규 추가)
function getMaxSeq(){
	if(gArrayListRoute == null) return 0;
	else if(gArrayListRoute.length == 0) return 0;
	else return gArrayListRoute[gArrayListRoute.length-1].sequence;
}

//결재 경로 재구성
function arrangeSequence(arrayListRoute){
	var beforeSequence;
	var nowParallelGroupId = 0;
	var beforeParallelGroupId = 0;
	var parallelChecker;
	parallelIndex = new Array();
	
	for (var i = 0; i < arrayListRoute.length; i++) {
		var tempPattern = arrayListRoute[i].activityType;
		if (tempPattern == PARALLELAPP_CODE || tempPattern == PARALLELAGREE_CODE) {
			if (arrayListRoute[i].parallelGroupId > 0) {
				nowParallelGroupId = arrayListRoute[i].parallelGroupId;
			} else {
				if (beforeSequence != eval(arrayListRoute[i].sequence)) {
					nowParallelGroupId = beforeParallelGroupId + 1;
				} else {
					nowParallelGroupId = beforeParallelGroupId;
				}
			}

			if (parallelChecker == "yes" && nowParallelGroupId == beforeParallelGroupId) {
				parallelIndex.push(i);
				nowSequence = beforeSequence;
			} else {
				if (parallelIndex.length < 2 && parallelIndex.length > 0) {
					if (arrayListRoute[parallelIndex[0]].activityType == PARALLELAGREE_CODE) {
						arrayListRoute[parallelIndex[0]].activityType = AGREEMENT_CODE ;
					} else if (arrayListRoute[parallelIndex[0]].activityType == PARALLELAPP_CODE) {
						arrayListRoute[parallelIndex[0]].activityType = APPROVAL_CODE ;
					}
				}
				
				parallelIndex = new Array();

				parallelIndex.push(i);
				nowSequence = eval(beforeSequence) + 1;
			}

			beforeSequence = nowSequence;
			beforeParallelGroupId = nowParallelGroupId;
			
			parallelChecker = "yes";
			arrayListRoute[i].parallelGroupId = nowParallelGroupId;
		} else {
			if (i == 0) {
				nowSequence = 0;
			} else {
				nowSequence = eval(beforeSequence) + 1;
			}
			beforeSequence = nowSequence;
			parallelChecker = "no";
		}
		
		arrayListRoute[i].sequence = nowSequence;
	}
	if (parallelIndex.length < 2 && parallelIndex.length > 0) {
		if (arrayListRoute[parallelIndex[0]].activityType == PARALLELAGREE_CODE) {
			arrayListRoute[parallelIndex[0]].activityType = AGREEMENT_CODE;
		} else if (arrayListRoute[parallelIndex[0]].activityType == PARALLELAPP_CODE) {
			arrayListRoute[parallelIndex[0]].activityType = APPROVAL_CODE;
		}
	}
	
	parallelIndex = new Array();
	return arrayListRoute;
}

//결재자 인원 및 조건 체크
function checkApprovalRouteValidation(checkApprover) {
	
	if (typeof(checkApprover) == "undefined") checkApprover = true;

	//0. 한번더 인원 체크
	if (document.getElementById("approvalRoute").length > 99) {
		alert("100명이상 지정할 수 없습니다.");//"100명이상 지정할 수 없습니다."
		return false;
	}
	
	// 결재경로에 비어있는 경우 
	if (getActivityTypesCount(gArrayListRoute, APPROVAL_CODE, PARALLELAPP_CODE, AGREEMENT_CODE, PARALLELAGREE_CODE, NOTIFICATION_CODE) == 0) {
		alert('결재자를 지정해 주십시오.');//"결재자를 지정해 주십시오."
		try{
			document.getElementById("findUser").focus();
		}catch(Exception){
		}
		return false;
	}
	
	//1. 결재자
	if (checkApprover && getActivityTypesCount(gArrayListRoute, APPROVAL_CODE, PARALLELAPP_CODE, AGREEMENT_CODE, PARALLELAGREE_CODE) == 0) {
		if (getActivityTypesCount(gArrayListRoute, POST_APPROVAL_CODE, NOTIFICATION_CODE) > 0) {
			alert("결재경로에 결재자가 포함되어있지 않습니다.");//"결재경로에 결재자가 포함되어있지 않습니다."
		} else {
			alert("결재자를 지정해 주십시오.");//"결재자를 지정해 주십시오."
		}
		try{
			document.getElementById("findUser").focus();
		}catch(Exception){
		}
		return false;
	}
	
	//2. 후결자
	if (getActivityTypesCount(gArrayListRoute, POST_APPROVAL_CODE) >= 2) {
		alert("후결자는 2명이상 선택할 수 없습니다.");//"후결자는 2명이상 선택할 수 없습니다."
		return false;
	}
	return true;
}

//결재자 지정된 갯수
function getActivityTypesCount(arrayListRoute, activityType1, activityType2, activityType3, activityType4, activityType5) {
	var count = 0;
	for (var i = 0; i < arrayListRoute.length; i++) {
		if (typeof(activityType1) != "undefined" && arrayListRoute[i].activityType == activityType1) {
			count++;
		}
		if (typeof(activityType2) != "undefined" && arrayListRoute[i].activityType == activityType2) {
			count++;
		}
		if (typeof(activityType3) != "undefined" && arrayListRoute[i].activityType == activityType3) {
			count++;
		}
		if (typeof(activityType4) != "undefined" && arrayListRoute[i].activityType == activityType4) {
			count++;
		}
		if (typeof(activityType5) != "undefined" && arrayListRoute[i].activityType == activityType5) {
			count++;
		}
	}

	return count;
}

//화면에 display
function displaySelectAppBox(userIds) {

	if (typeof(gArrayListRoute) == "undefined") {
		return;
	}
	if (typeof(gArrayListRoute.length) == "undefined" || gArrayListRoute.length == 0) {
		return;
	}

	// 01. 기존에 입력되어 있던 결재경로 정보 삭제
	var objApprovalRouteSelect = document.getElementById("approvalRoute");
	var optionLength = objApprovalRouteSelect.options.length;
	if (typeof(objApprovalRouteSelect.options) != "undefined" || objApprovalRouteSelect.options.length > 0) {
		clearSelectBox(objApprovalRouteSelect);
	}
	// 02. 결재경로 정보Array를 이용하여 결재경로 셋팅
	var optionIdx = 0;
	var size = gArrayListRoute.length;
	for (var i = 0; i < size; i++) {
		if (gArrayListRoute[i] == null) {
			continue;
		}
		var szOptionText =
			gArrayListRoute[i].sequence + "/" +
			getActivityTypeMessageCode(gArrayListRoute[i].activityType) + "/" +
			gArrayListRoute[i].name + "/" +
			gArrayListRoute[i].grade + "/" +
			gArrayListRoute[i].dept + "/" +
			gArrayListRoute[i].company;

		if("${CPCEX_FLAG}" == "Y" && document.getElementById("displayCPCex").checked){
			//전송결재자
			if(checkUserVendorAppr(gArrayListRoute[i].userId)) szOptionText += "/"+"전송결재자";
		}

		objApprovalRouteSelect.options[optionIdx] = new Option(szOptionText, gArrayListRoute[i].userId);

		if (gArrayListRoute[i].activityType == SUBMIT_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "draft";
		} else if (gArrayListRoute[i].activityType == APPROVAL_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "approval";
		} else if (gArrayListRoute[i].activityType == AGREEMENT_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "consent";
		} else if (gArrayListRoute[i].activityType == POST_APPROVAL_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "postApproval";
		} else if (gArrayListRoute[i].activityType == NOTIFICATION_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "notify";
		} else if (gArrayListRoute[i].activityType == PARALLELAPP_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "approval";
		} else if (gArrayListRoute[i].activityType == PARALLELAGREE_CODE) {
			objApprovalRouteSelect.options[optionIdx].className = "consent";
		}		
		
		for (var j = 0; typeof(userIds) != "undefined" && j < userIds.length; j++) {
			if (userIds[j] == gArrayListRoute[i].userId) {
				objApprovalRouteSelect.options[optionIdx].selected = true;
				continue;
			}
		}
		gArrayListRoute[i].saveAppString = saveAppString(gArrayListRoute[i].sequence, gArrayListRoute[i].activityType, gArrayListRoute[i].userId);
		optionIdx++;
	}

	//결재자 입력 text Clear
	if (document.getElementById("findUser") != null ){
		document.getElementById("findUser").value = "";
	}

	//결재종류별 건수를 화면에 setting한다.
	resetApprovalCounter();
}

//각 결재 유형별 건수 표현
function resetApprovalCounter() {
	var nApprovalCnt = 0, nConsentCnt = 0, nPostApprovalCnt = 0, nNotificationCnt = 0;
	for (var i = 0; i < gArrayListRoute.length; i++) {
		if (gArrayListRoute[i] == null) {
			continue;
		}

		if (gArrayListRoute[i].activityType == APPROVAL_CODE) {
			nApprovalCnt++;
		} else if (gArrayListRoute[i].activityType == AGREEMENT_CODE) {
			nConsentCnt++;
		} else if (gArrayListRoute[i].activityType ==  PARALLELAGREE_CODE) {
			nConsentCnt++;
		} else if (gArrayListRoute[i].activityType == PARALLELAPP_CODE) {
			nApprovalCnt++;
		} else if (gArrayListRoute[i].activityType == NOTIFICATION_CODE) {
			nNotificationCnt++;
		} else if (gArrayListRoute[i].activityType == POST_APPROVAL_CODE) {
			nPostApprovalCnt++;
		}
	}

	if (document.getElementById("approvalCount") != null) {
		$('#approvalCount').text("[" + nApprovalCnt + "]");
		$('#consentCount').text("[" + nConsentCnt + "]");
		$('#postApprovalCount').text("[" + nPostApprovalCnt + "]");
		$('#notificationCount').text("[" + nNotificationCnt + "]");
	}
}

//결재 경로 타입 변경
function changeActivityType() {
	//결재타입
	
	var activityType = getActivityType();

	userIds = new Array();
	userIds = getUserIdInAppSelectBox();
	if(userIds == false || userIds.length == 0) {
	    return;
	}
	var changedArrRoute = changeArrayListRouteActivityType(gArrayListRoute, userIds, activityType);
	if (!changedArrRoute) {
		// 기안자는 변경할 수 없습니다.
	    alert("기안자는 변경할 수 없습니다.");
	    return;
	}
	gArrayListRoute = arrangeSequence(changedArrRoute);
	displaySelectAppBox(userIds);

}

//실제 결재 경로 타입 변경
function changeArrayListRouteActivityType(arrayListRoute, userIds, activityType) {

	var index;
	var index2;
	var aSequence;
	var lastParallelIndex;

	tempArray01 = new Array();
	tempArray02 = new Array();
	tempArray03 = new Array();
	bUserIds = new Array();

	for (var i = 0; i < userIds.length; i++) {
		index = getIndexByUserId(arrayListRoute, userIds[i]);

		
		//submit_type
		if (arrayListRoute[index].activityType == SUBMIT_CODE) {
			return false;
		}
		if (arrayListRoute[index].activityType == PARALLELAPP_CODE || arrayListRoute[index].activityType == PARALLELAGREE_CODE)  {
			if (activityType == APPROVAL_CODE) {
				arrayListRoute[index].activityType = PARALLELAPP_CODE;
			} else if (activityType == AGREEMENT_CODE) {
				arrayListRoute[index].activityType = PARALLELAGREE_CODE;
			} else {
				bUserIds = getUserIdsSameSequence(arrayListRoute, userIds[i]);

				if (userIds.length + 1 == bUserIds.length) {
					for (var k = 0; k < bUserIds.length; k++) {
						index2 = getIndexByUserId(arrayListRoute, bUserIds[k]);

						if (arrayListRoute[index2].activityType == PARALLELAPP_CODE) {
							arrayListRoute[index2].activityType = APPROVAL_CODE;
						} else if (arrayListRoute[index2].activityType == PARALLELAGREE_CODE) {
							arrayListRoute[index2].activityType = AGREEMENT_CODE;
						}
					}

					arrayListRoute[index].activityType = activityType;
				} else {
					arrayListRoute[index].activityType = activityType;

					aSequence = arrayListRoute[index].sequence;

					for (var j = 0; j < arrayListRoute.length; j++) {
						if (aSequence == arrayListRoute[j].sequence) {
							lastParallelIndex = j;
						}
					}

					tempArray01 = arrayListRoute.slice(0, index);
					tempArray02 = arrayListRoute.slice(index+1, lastParallelIndex+1);
					tempArray02.push(arrayListRoute[index]);
					tempArray03 = arrayListRoute.slice(lastParallelIndex+1, arrayListRoute.length);

					arrayListRoute = tempArray01.concat(tempArray02, tempArray03);
				}
			}
		} else {
			arrayListRoute[index].activityType = activityType;
		}

	}

	return arrayListRoute;
}


//결재경로가 표시된 select list에서 현재 선택된 사용자들의 ID 배열 구하기
function getUserIdInAppSelectBox() {

	var objApprovalRouteSelect = document.getElementById("approvalRoute");
	var userIds = new Array();
	for (var i = 0; i < objApprovalRouteSelect.length; i++) {
		if (objApprovalRouteSelect.options[i].selected) {
			userIds.push(objApprovalRouteSelect.options[i].value);
		}
	}

	return userIds;
}

//동일한 결재 순위를 가진 사용자 찾기(병렬)
function getUserIdsSameSequence(arrayListRoute, userId) {
	var lUserIds = new Array();
	var index = getIndexByUserId(arrayListRoute, userId);

	for (var i = 0; i < arrayListRoute.length; i++) {
		if (arrayListRoute[index].sequence == arrayListRoute[i].sequence) {
			lUserIds.push(arrayListRoute[i].userId);
		}
	}

	return lUserIds;
}

//사용자 인덱스
function getIndexByUserId(arrayListRoute, userId) {
	for (var i = 0; i < arrayListRoute.length; i++) {
		if (arrayListRoute[i].userId == userId) {
			return i;
		}
	}
}

//삭제 가능 여부 체크 
function checkDelete(arrayListRoute, userIds) {
	for (var i = 0; i < userIds.length; i++) {
		var index = getIndexByUserId(arrayListRoute, userIds[i]);
		if(arrayListRoute[index].deleteYN == "N"){

			//기안자 체크
			if (arrayListRoute[index].activityType == SUBMIT_CODE ) {
				 //기안자는 삭제할 수 없습니다.
		        alert("기안자는 삭제할 수 없습니다.");
				
			}else{
				//삭제할 수 없는 사용자 입니다.
				alert("삭제할 수 없는 사용자 입니다.");
			}

			return false;
		}
	}
	return true;
}

//병렬지정
function makeParallel() {
	var userIds = getUserIdInAppSelectBox();
	if (userIds == false || userIds.length < 2) {
	 //병렬 결재자는 2명 이상 선택하여 주십시오.
	    alert("병렬 결재자는 2명 이상 선택하여 주십시오.");
	    return;
	}
	
	var paralledArrRoute = makeParallelRoute(gArrayListRoute, userIds);
	if (!paralledArrRoute) {
	 //병렬은 결재 또는 합의자만 지정 가능합니다.
	    alert("병렬은 결재 또는 합의자만 지정 가능합니다.");
	    return;
	}
	
	gArrayListRoute = arrangeSequence(paralledArrRoute);
	displaySelectAppBox(userIds);
}

//실제 결재경로 병렬 처리
function makeParallelRoute(arrayListRoute, aUserIds) {
	if(aUserIds.length < 2)
		return false;

	var index;

	var parallelChecker = "";
	var nowParallelGroupId = getMaxParallelGroupId(arrayListRoute)+1;
	tempArray01 = new Array();
	tempArray02 = new Array();
	tempArray03 = new Array();

	for (var i = 0; i < arrayListRoute.length; i++) {
		for (var j = 0; j < aUserIds.length; j++) {
			userIdIndex = eval(getIndexByUserId(arrayListRoute, aUserIds[j]));
			if (i == userIdIndex) {
				if (arrayListRoute[i].activityType == APPROVAL_CODE || arrayListRoute[i].activityType == PARALLELAPP_CODE) {
					pattern = PARALLELAPP_CODE;
				} else if (arrayListRoute[i].activityType == AGREEMENT_CODE || arrayListRoute[i].activityType == PARALLELAGREE_CODE) {
					pattern = PARALLELAGREE_CODE;
				} else {
					return false;
				}
				arrayListRoute[i].activityType = pattern;
				arrayListRoute[i].parallelGroupId = nowParallelGroupId;
				tempArray02.push(arrayListRoute[i]);
				parallelChecker = "yes";
			}
		}

		if (parallelChecker != "yes") {
			if (i < eval(getIndexByUserId(arrayListRoute, aUserIds[0]))) {
				tempArray01.push(arrayListRoute[i]);
			} else {
				tempArray03.push(arrayListRoute[i]);
			}
		}

		parallelChecker = "no";
	}
	arrayListRoute = tempArray01.concat(tempArray02);
	arrayListRoute = arrayListRoute.concat(tempArray03);
	return arrayListRoute;
}

//병렬 그룹 중 가장 큰 id 가져오기
function getMaxParallelGroupId(arrayListRoute) {
	var maxParallelGroupId = 0;
	for (var i = 0; i < arrayListRoute.length; i++) {
		if (arrayListRoute[i].parallelGroupId > 0) {
			if (arrayListRoute[i].parallelGroupId > maxParallelGroupId) {
				maxParallelGroupId = arrayListRoute[i].parallelGroupId;
			}
		}
	}
	return maxParallelGroupId;
}

//병렬해제
//병렬해제 클릭 시
function clearParallel(){
	userIds = getUserIdInAppSelectBox();

	gArrayListRoute = clearParallelRoute(gArrayListRoute, userIds);
	gArrayListRoute = arrangeSequence(gArrayListRoute);
	displaySelectAppBox(userIds);
}

//실제 병렬 해제 수행
function clearParallelRoute(arrayListRoute, aUserIds){
	var index;
	var parallelChecker = 0;
	var lastIndexSameSequenceUserId;
	sameSequenceUserIds = new Array();
	concatArray01 = new Array();
	concatArray02 = new Array();
	concatArray03 = new Array();

	for (var i = 0; i < aUserIds.length; i++) {
		index = getIndexByUserId(arrayListRoute, aUserIds[i]);

		if (arrayListRoute[index].activityType == PARALLELAPP_CODE) {
			arrayListRoute[index].activityType = APPROVAL_CODE;
			parallelChecker = 1;
		} else if (arrayListRoute[index].activityType == PARALLELAGREE_CODE) {
			arrayListRoute[index].activityType = AGREEMENT_CODE;
			parallelChecker = 1;
		}

		if (parallelChecker == 1) {
			sameSequenceUserIds = getUserIdsSameSequence(arrayListRoute, aUserIds[i]);
			lastIndexSameSequenceUserId = getIndexByUserId(arrayListRoute, sameSequenceUserIds[sameSequenceUserIds.length-1]);

			if (index != getIndexByUserId(arrayListRoute, sameSequenceUserIds[0]) && index != lastIndexSameSequenceUserId) {
				concatArray01 = arrayListRoute.slice(0, index);
				concatArray02 = arrayListRoute.slice(index+1, lastIndexSameSequenceUserId+1);
				concatArray02.push(arrayListRoute[index]);
				concatArray03 = arrayListRoute.slice(lastIndexSameSequenceUserId+1, arrayListRoute.length);
				arrayListRoute = concatArray01.concat(concatArray02, concatArray03);
			}
		}
		parallelChecker = 0;
	}

	return arrayListRoute;
}
//삭제
//결재 경로 삭제
function deleteRoute() {
	var userIds = getUserIdInAppSelectBox();
	if (typeof(userIds) == "undefined" || userIds.length == 0) {
		//결재자를 지정해 주십시오.
	    alert("결재자를 지정해 주십시오.");
	    return;
	}
	//병렬결재자 지정시
	if (!checkParallel(gArrayListRoute, userIds)) {
		//병렬지정자가 포함되어 있습니다. 삭제하시겠습니까?
	    if (!confirm("병렬지정자가 포함되어 있습니다. 삭제하시겠습니까?")) {
	        return;
	    }
	}

	//삭제 가능 여부 체크 
	if (!checkDelete(gArrayListRoute, userIds)) {
		return;
	}
	
	var changedArrRoute = deleteArrayListRoute(gArrayListRoute, userIds);
	gArrayListRoute = arrangeSequence(changedArrRoute);

	userIds = new Array();
	displaySelectAppBox(userIds);
}

//실제 결재 경로 삭제
function deleteArrayListRoute(arrayListRoute, userIds)
{
	var count = 0;

	for (var i = 0; i < userIds.length; i++) {
		var index = getIndexByUserId(arrayListRoute, userIds[i]);

		sequence = arrayListRoute[index].sequence;
		var tempArray01 = arrayListRoute.slice(0, eval(index));
		var tempArray02 = arrayListRoute.slice(eval(index)+1, arrayListRoute.length);
		arrayListRoute = tempArray01.concat(tempArray02);

		for (var j = 0; j < arrayListRoute.length; j++) {
			if (arrayListRoute[j].sequence == sequence) {
				if (count == 0) {
					otherParallelIndex = j;
				}
				count++;
			}
		}

		if (count == 1) {
			if (arrayListRoute[otherParallelIndex].activityType == PARALLELAPP_CODE) {
				arrayListRoute[otherParallelIndex].activityType = APPROVAL_CODE;
			} else if (arrayListRoute[otherParallelIndex].activityType == PARALLELAGREE_CODE) {
				arrayListRoute[otherParallelIndex].activityType = AGREEMENT_CODE;
			}
		}
		count = 0;
	}

	return arrayListRoute;
}

//위/아래 위치 이동
//결재 경로 위/아래 이동
function changeApprSequence(direction) {

   //direction : 1(아래),-1(위)
  var userIds = getUserIdInAppSelectBox();
  if (typeof(userIds) == "undefined" || userIds.length == 0) {
	//결재자를 지정해 주십시오.
	alert("결재자를 지정해 주십시오.");	
	return;
  }

  var changedArrRoute = changeArrayListRouteSequence(gArrayListRoute, userIds, direction);
  if (!changedArrRoute) {
      return;
  }

  gArrayListRoute = arrangeSequence(changedArrRoute);
  displaySelectAppBox(userIds);
}

//실제로 결재 경로 순서 바꾸기
function changeArrayListRouteSequence(arrayListRoute, userIds, aDirection) {
	orgArrayListRoute = arrayListRoute;
	var index;
	var index2;
	var index3;
	var indexBUsersEnd;
	var beforeSequence = 0;

	tempArray01 = new Array();
	tempArray02 = new Array();
	tempArray03 = new Array();
	tempArray04 = new Array();
	bUserIds = new Array();
	cUserIds = new Array();

	if (eval(aDirection) < 0) {
		for (var i = 0; i < userIds.length; i++) {
			index = getIndexByUserId(arrayListRoute, userIds[i]);
			if (index == 0) {
				arrayListRoute = orgArrayListRoute;
				return false;
			}

			if (arrayListRoute[index-1].activityType == "0") {
				arrayListRoute = orgArrayListRoute;
				return false;
			}
			if (arrayListRoute[index].sequence != beforeSequence) {
				bUserIds = getUserIdsSameSequence(arrayListRoute, userIds[i]);
				index2 = getIndexByUserId(arrayListRoute, bUserIds[0]);

				if (index2 == 0) {
					arrayListRoute = orgArrayListRoute;
					return false;
				}

				if (arrayListRoute[index2-1].activityType == "0") {
					arrayListRoute = orgArrayListRoute;
					return false;
				}

				cUserIds = getUserIdsSameSequence(arrayListRoute, arrayListRoute[index2-1].userId);
				index3 = getIndexByUserId(arrayListRoute, cUserIds[0]);

				tempArray01 = arrayListRoute.slice(0, index3);
				tempArray02 = arrayListRoute.slice(index3, index2);
				tempArray03 = arrayListRoute.slice(index2, index2+bUserIds.length);
				tempArray04 = arrayListRoute.slice(index2+bUserIds.length, arrayListRoute.length);

				arrayListRoute = tempArray01.concat(tempArray03, tempArray02, tempArray04);
			}
			beforeSequence = arrayListRoute[index].sequence;
		}
	} else {
		userIds.reverse();

		for (var i = 0; i < userIds.length; i++) {
			index = getIndexByUserId(arrayListRoute, userIds[i]);

			if (arrayListRoute[index].activityType == SUBMIT_CODE || index == arrayListRoute.length -1) {
				arrayListRoute = orgArrayListRoute;
				return false;
			}

			if (arrayListRoute[index].sequence != beforeSequence) {
				bUserIds = getUserIdsSameSequence(arrayListRoute, userIds[i]);
				index2 = getIndexByUserId(arrayListRoute, bUserIds[0]);
				indexBUsersEnd = getIndexByUserId(arrayListRoute, bUserIds[bUserIds.length-1]);

				if (arrayListRoute[indexBUsersEnd].activityType == SUBMIT_CODE  || indexBUsersEnd == arrayListRoute.length -1) {
					arrayListRoute = orgArrayListRoute;
					return false;
				}

				cUserIds = getUserIdsSameSequence(arrayListRoute, arrayListRoute[indexBUsersEnd+1].userId);
				index3 = getIndexByUserId(arrayListRoute, cUserIds[0]);

				tempArray01 = arrayListRoute.slice(0, index2);
				tempArray02 = arrayListRoute.slice(index2, index3);
				tempArray03 = arrayListRoute.slice(index3, index3+cUserIds.length);
				tempArray04 = arrayListRoute.slice(index3+cUserIds.length, arrayListRoute.length);

				arrayListRoute = tempArray01.concat(tempArray03, tempArray02, tempArray04);
			}
			beforeSequence = arrayListRoute[index].sequence;
		}
	}

	return arrayListRoute;
}

//병렬 결재자 있는지 확인
function checkParallel(arrayListRoute, userIds) {
	var index;
	var sequenceChecker;

	for (var i = 0; i < arrayListRoute.length; i++) {
		for (var j = 0; j < userIds.length; j++) {
			index = getIndexByUserId(arrayListRoute, userIds[j]);
			sequenceChecker = arrayListRoute[index].sequence;

			if (sequenceChecker == arrayListRoute[i].sequence && index != i) {
				return false;
			}
		}
	}
	return true;
}
//결재 타입
function getActivityType() {
	var activityType = "";
	for (var i = 0; i < document.all.activityType.length; i++) {
		if (document.all.activityType[i].checked) {
			activityType = document.all.activityType[i].value;
			break;
		}
	}
	return activityType;
}
// 결재경로 생성 팝업창 open
function routeSavePopupOpen(){
	var iPopWidth = 400;
	var iPopHeight = 185;
	var pointX = (screen.availWidth - iPopWidth) * 0.5;
	var pointY = (screen.availHeight - iPopHeight) * 0.5;
    var style = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no,"
		+ " resizable=no, width="+iPopWidth+", height="+iPopHeight+", left="+pointX+", top="+pointY;
    if(!checkApprovalRouteValidation()) return;
    var approvalTemplateCreatePopup = window.open(contextPath+"/com/approval/approvalTemplate/getApprovalTemplateCreatePopup.do", "approvalTemplateCreatePopup", style);
	approvalTemplateCreatePopup.focus();
}

function openCreateApprovalPopupPost(formName, resizeFlag){
	var winName = "CreateApprovalPopup"+formName;
	var frm = eval(formName);
	var resizePop = (typeof(resizeFlag)!="undefined" && resizeFlag)? "yes" : "no";
	var popObj = window.open("",winName,"width=828, height=700,scrollbars=yes, resizable="+resizePop);
	
	frm.action = contextPath + "/com/approval/approval/initApprovalPage.do";
	frm.target = winName;
	frm.submit();
	return popObj;
}

function openCreateApprovalPopupRequired(formName){
	var winName = "CreateApprovalPopup"+formName;
	var frm = eval(formName);
	var resizePop = (typeof(resizeFlag)!="undefined" && resizeFlag)? "yes" : "no";
	var popObj = window.open("",winName,"width=828, height=700,scrollbars=yes, resizable="+resizePop);
	
	frm.action = contextPath + "/com/approval/approval/initApprovalPage.do";
	frm.target = winName;
	frm.submit();
	return popObj;
}
function openApprovalPopup(approvalKey, moduleId){
	var winName = "writeApproval";
	var url = contextPath + "/common/approval/approval.do?method=approvalInit&approvalKey="+approvalKey+"&moduleId="+moduleId;
	var style = "scrollbars=no,resizable=yes,width=828,height=900";
	var popup = popupInfoWnd(url, winName, style);
	//var width = "828";
	//var height = "650";
	//showWindow(url, winName, "width=" + width + ", height=" + height + ", scrollbars=yes", "WIN-POPUP");
}
function openApprovalPopupWithForm(formName, approvalKey, moduleId){
	var winName = "writeApproval";
	var style = "scrollbars=no,resizable=yes,width=828,height=900";
	var popup = window.open("",winName,style);

	with($("[name='"+formName+"']")) {
		attr("action", contextPath + "/common/approval/approval.do?method=approvalInit&approvalKey="+approvalKey+"&moduleId="+moduleId);
		attr("target", winName);				
		submit();
	}
}
function approvalStatus(moduleId, misId){
	//misId 필수 여부는 각 개발자 분들에게 물어보고 결정하자.
	if(moduleId == null || moduleId == ""){
		alert('moduleId 값은 필수입니다.');
		return;
	}
	var winName = "status";
	var url = contextPath + "/common/approval/approval.do?method=approvalStatus&moduleId="+moduleId;
	var style = "scrollbars=no,resizable=no,width=828,height=550";
	//var width = "828";
	//var height = "500";
	//showWindow(url, winName, "width=" + w + ", height=" + h + ", scrollbars=yes", "WIN-POPUP");
	var popup = popupInfoWnd(url,winName,style);
}