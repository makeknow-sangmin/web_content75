var common = {
		//메인 메뉴 controller
		pageLoader:function (menu, mode, id, code){
			console_logs("menu : ", menu);
			console_logs("mode : ", mode);
			console_logs("id : ", id);
			var url = "";
			switch(menu) {
			case 'event':
			case 'qna':
			case 'marketPlace':
			case 'helpWanted':
			case 'notice':
				if(mode=='detail') {
					url = CONTEXT_PATH+"/place/index.do?method=boardDetail&boardType="+menu;
				} else if(mode=='write') {
					url = CONTEXT_PATH+"/place/index.do?method=boardWrite&boardType="+menu;
				} else if(mode=='reply') {
					url = CONTEXT_PATH+"/place/index.do?method=boardWrite&boardType="+menu; 
				} else {
					url = CONTEXT_PATH+"/place/index.do?method=board&boardType="+menu;	
				}
				if(mode!=undefined && mode!=null) {
					url = url + "&mode=" +  mode;
				}
				if(id!=undefined && id!=null) {
					url = url + "&unique_id=" +  id;
				}
				
				break;
			case 'classList':
				url = CONTEXT_PATH+"/place/index.do?method=classList&identification_code="+mode +"&level=" +id;
				break;
			case 'classListMid':
				url = CONTEXT_PATH+"/place/index.do?method=classListMid&identification_code="+mode +"&level=" +id +"&parent_class_code=" +code;
				break;
			default:
				url = CONTEXT_PATH+"/place/index.do?method="+menu;
			}
			location.href = url;
		},
		//업종별 메뉴 controller 
		varietyList:function (menu){
			//console_logs("menu : ", menu);
			var url = "";
			url = CONTEXT_PATH+"/place/index.do?method=detailShop&shop_code="+menu;
			location.href = url;
		},
		//음식점 controller
		restList:function (menu){
			//console_logs("menu : ", menu);
			var url = "";
			url = CONTEXT_PATH+"/place/restList.do?method="+menu;
			location.href = url;
		},
		//수정
		pageLoaderModify:function (menu, mode, id, mime, parent){
			console_logs("menu : ", menu);
			console_logs("mode : ", mode);
			console_logs("id : ", id);
			console_logs("mime : ", mime);
			console_logs("parent : ", parent);
			var url = "";
			switch(menu) {
			case 'event':
			case 'qna':
			case 'marketPlace':
			case 'helpWanted':
			case 'event':
			case 'notice':
				
				if(mode=='modify') {
					url = CONTEXT_PATH+"/place/index.do?method=boardWrite&boardType="+menu;
				} 	
				if(mode!=undefined && mode!=null) {
					url = url + "&mode=" +  mode;
				}
				if(id!=undefined && id!=null && mime!=null&& parent!=null) {
					url = url + "&unique_id=" +  id + "&mime=" + mime + "&parent=" +parent;
				}
				break;
			}
			location.href = url;
		},
	
}