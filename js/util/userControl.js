var gUserList = [];
var gUserFields = [];
var gCombstFields = [];

var winUserpopup = null;
var userWidth = 240;
var userHeight= 300;

function getUserInfoXpos() {
	return tempX-240+50;
}
function getUserInfoYpos() {
	var panelH = gMain.getCenterPanelHeight();
	
	var Ypos = tempY-userWidth/2;
	var gap = Ypos+userHeight - panelH;
	if( gap > 0) {
		Ypos = tempY-userHeight +10;
	}
	
	return Ypos;
}

//User ingo display
function showUserInfoGridPopup(usrAst) {
	
	//console_log(usrAst);
	if( usrAst == undefined ||  usrAst=='undefined' || usrAst==null) {
		//Ext.MessageBox.alert('Erro','unknown user');
		return;
	}
		
	 //UniqueId
	 var unique_id = usrAst.get('unique_id');
	 var dept_code = usrAst.get('dept_code');
	 var dept_name = usrAst.get('dept_name');
	 var position = usrAst.get('position');//직책
	 var tel_no = usrAst.get('tel_no');
	 var extension_no = usrAst.get('extension_no');//내선번호(전환번호)
	 var fax_no = usrAst.get('fax_no');		 
	 var emp_no = usrAst.get('emp_no' );//사번		 
	 var user_id = usrAst.get('user_id');
	 var user_name = usrAst.get('user_name');
	 var email = usrAst.get('email');		
	 var hp_no = usrAst.get('hp_no');			 
	 var userTypeDispName = usrAst.get('userTypeDispName' );
	 var user_grade = usrAst.get('user_grade');
	 var create_date = usrAst.get('create_date');
	 
	 var source = {};
	 source['unique_id'] = unique_id;
	 source['dept_code'] = dept_code;
	 source['dept_name'] = dept_name;
	 source['tel_no'] = tel_no;
	 source['fax_no'] = fax_no;
	 source['emp_no'] = emp_no;
	 source['user_id'] = user_id;
	 source['user_name'] = user_name;
	 source['position'] = position;
	 source['email'] = email;
	 source['hp_no'] = hp_no;
	 source['userTypeDispName'] = userTypeDispName;
	 source['user_grade'] = user_grade;
	 source['create_date'] = Ext.Date.parse(create_date, 'Y-m-d');
	 
	 
   var propsGrid = Ext.create('Ext.grid.property.Grid', {
       width: userWidth,
       height: userHeight,
       propertyNames: {
       	unique_id: gMain.getTextName(gUserFields, 'unique_id'),
			dept_code: gMain.getTextName(gUserFields, 'dept_code'),
			dept_name: gMain.getTextName(gUserFields, 'dept_name'),
			tel_no: gMain.getTextName(gUserFields, 'tel_no'),
			fax_no: gMain.getTextName(gUserFields, 'fax_no'),
			emp_no: gMain.getTextName(gUserFields, 'emp_no'),
			user_id: gMain.getTextName(gUserFields, 'user_id'),
			user_name: gMain.getTextName(gUserFields, 'user_name'),
			position: gMain.getTextName(gUserFields, 'position'),
			email: gMain.getTextName(gUserFields, 'email'),
			hp_no: gMain.getTextName(gUserFields, 'hp_no'),
			userTypeDispName: gMain.getTextName(gUserFields, 'userTypeDispName'),
			user_grade: gMain.getTextName(gUserFields, 'user_grade'),
			create_date: gMain.getTextName(gUserFields, 'create_date')     	
       },
       source: source,
       listeners : {
       	beforeedit : function(e) {
       		return false;
       	}
       }
   });

   if(winUserpopup!=null) {
	   closeUserByUserId();
   }
	   //console_log('(' +tempX + ',' +tempY +')' );
		   winUserpopup = new Ext.Window({
			     title: panelSRO1134,
				 layout: 'fit',
				 closable: true,
				 position: 'absolute',
			     plain: false,
	             x: getUserInfoXpos(),
	             y: getUserInfoYpos() ,
			    items: [
			            propsGrid
			    ],
		   listeners: {
//			    mouseleave : {
//			      element : 'el',
//			      fn : closeUserByUserId
//			    	
//			    }
			  }
				});

   
   winUserpopup.show();
}

//get UserInfo by unique_id
/*
function popupUser(unique_id) {
	if( unique_id == undefined ||  unique_id=='undefined') {
		Ext.MessageBox.alert('Erro','not defined creator_uid');
	} else {
		CommonUsrAst.load(unique_id ,{
			 success: function(usrAst) {
				 showUserInfoGridPopup(usrAst);
	 		 }//endofsuccess
		 });//emdofload
	}//endofelse
}
*/

//get UserInfo by user_id
function popupUserByUserId(user_id) {
	if( user_id == undefined ||  user_id=='undefined' || user_id == null || user_id =='') {
		closeUserByUserId();
		//Ext.MessageBox.alert('Erro','not defined creator');
	} else {
		var user = null;
		
		for(var i=0; i<gUserList.length; i++) {
			var obj = gUserList[i];
			if(obj['user_id'] == user_id) {
				//console_log('found user');
				user = obj['usrAst'];
				break;
			}
		}
		
		if(user==null) {
			//console_log('call new user');
			CommonUsrAst.load(user_id ,{
				 success: function(usrAst) {
					 gUserList.push({'user_id': user_id, 'usrAst': usrAst });
					 showUserInfoGridPopup(usrAst);
		 		 }//endofsuccess
			 });//emdofload
		} else {
			showUserInfoGridPopup(user);
		}
	}//endofelse
}

function popupUserById(user_id) {
	if( user_id == undefined ||  user_id=='undefined' || user_id == null || user_id =='') {
		closeUserByUserId();
		//Ext.MessageBox.alert('Erro','not defined creator');
	} else {
		var user = null;
		
		for(var i=0; i<gUserList.length; i++) {
			var obj = gUserList[i];
			if(obj['user_id'] == user_id) {
				//console_log('found user');
				user = obj['usrAst'];
				break;
			}
		}
		
		if(user==null) {
			//console_log('call new user');
			ComUsrAst.load(user_id ,{
				success: function(usrAst) {
					gUserList.push({'user_id': user_id, 'usrAst': usrAst });
					showUserInfoGridPopup(usrAst);
				}//endofsuccess
			});//emdofload
		} else {
			showUserInfoGridPopup(user);
		}
	}//endofelse
}


function closeUserByUserId() {
	if(winUserpopup!=null) {
		winUserpopup.close();
		 winUserpopup=null;
	}
}

Ext.onReady(function() {  
	//user field info load
	gMain.extFieldColumnStore.load({//Field 정보를 먼저로딩
	    params: {
	    	menuCode: 'AUS1'//사용자 정보 필드 정보
	    },
	    callback: function(records, operation, success) {

	        for (var i=0; i<records.length; i++){
	        	
	        	var objfieldColumn = records[i];
	        	var name = objfieldColumn.get('name');
	        	var type =  objfieldColumn.get('type');
	        	var text =  objfieldColumn.get('text');
	        	var fieldObj = {};

	        	fieldObj["name"] = name;
	        	fieldObj["type"] = type;
	        	fieldObj["text"] = text;
	        	//console_log('Field:' + name);
	        	gUserFields.push(fieldObj);
	 
	        }//endoffor
	        
	        Ext.define('CommonUsrAst', {
				extend: 'Ext.data.Model',
				fields: gUserFields,
				proxy: {
					type: 'ajax',
					url: CONTEXT_PATH + '/userMgmt/user.do?method=read&idField=creator',
					reader: {
						type: 'json',
						root: 'datas',
						successProperty: 'success'
					}
		   		}
		   });
	        
	        Ext.define('ComUsrAst', {
	    		extend: 'Ext.data.Model',
	    		fields: gUserFields,
	    		proxy: {
	    			type: 'ajax',
	    			url: CONTEXT_PATH + '/userMgmt/user.do?method=read',
	    			reader: {
	    				type: 'json',
	    				root: 'datas',
	    				successProperty: 'success'
	    			}
	       		}
	       });
	    },
	    scope: this
	});
	
	gMain.extFieldColumnStore.load({//Field 정보를 먼저로딩
	    params: {
	    	menuCode: 'AMI1'//사용자 정보 필드 정보
	    },
	    callback: function(records, operation, success) {

	        for (var i=0; i<records.length; i++){
	        	
	        	var objfieldColumn = records[i];
	        	var name = objfieldColumn.get('name');
	        	var type =  objfieldColumn.get('type');
	        	var text =  objfieldColumn.get('text');
	        	var fieldObj = {};

	        	fieldObj["name"] = name;
	        	fieldObj["type"] = type;
	        	fieldObj["text"] = text;
	        	//console_log('Field:' + name);
	        	gCombstFields.push(fieldObj);
	 
	        }//endoffor
	        
	        Ext.define('CommonUsrAst', {
				extend: 'Ext.data.Model',
				fields: gCombstFields,
				proxy: {
					type: 'ajax',
					//url: CONTEXT_PATH + '/userMgmt/user.do?method=read&idField=creator',
					url: CONTEXT_PATH + '/userMgmt/combst.do?method=read',
					reader: {
						type: 'json',
						root: 'datas',
						successProperty: 'success'
					}
		   		}
		   });
	    },
	    scope: this
	});
});

