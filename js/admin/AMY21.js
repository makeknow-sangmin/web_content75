function createGrid(usrAst) {
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
	 var user_type = usrAst.get('user_type' );
	 var user_grade = usrAst.get('user_grade');
	 var create_date = usrAst.get('create_date');
	 var division_code = usrAst.get('division_code');

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
	 source['user_type'] = user_type;
	 source['user_grade'] = user_grade;
	 source['create_date'] = Ext.Date.parse(create_date, 'Y-m-d');
	 source['division_code'] = division_code;
	 
	 var g =
	Ext.create('Ext.grid.property.Grid', {
		title: getMenuTitle(),
       collapsible: true,
       multiSelect: true,
       stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
       autoScroll: true,
       autoHeight: true,
       height: getCenterPanelHeight(),
    // paging bar on the bottom
       propertyNames: {
          	unique_id: getTextName(gUserFields, 'unique_id'),
   			dept_code: getTextName(gUserFields, 'dept_code'),
   			dept_name: getTextName(gUserFields, 'dept_name'),
   			tel_no: getTextName(gUserFields, 'tel_no'),
   			fax_no: getTextName(gUserFields, 'fax_no'),
   			emp_no: getTextName(gUserFields, 'emp_no'),
   			user_id: getTextName(gUserFields, 'user_id'),
   			user_name: getTextName(gUserFields, 'user_name'),
   			position: getTextName(gUserFields, 'position'),
   			email: getTextName(gUserFields, 'email'),
   			hp_no: getTextName(gUserFields, 'hp_no'),
   			user_type: getTextName(gUserFields, 'user_type'),
   			user_grade: getTextName(gUserFields, 'user_grade'),
   			create_date: getTextName(gUserFields, 'create_date') ,
   			division_code: getTextName(gUserFields, 'division_code')
          },//propnames
          source: source,
          listeners : {
          	beforeedit : function(e) {
          		return false;
          	}//beforeedit
          }   //listener
	});//create
	fLAYOUT_CONTENT(g);
}


Ext.onReady(function() {  
	
	Ext.define('UsrAst', {
		extend : 'Ext.data.Model',
		fields : gUserFields,
		proxy : {
			type : 'ajax',
			url : CONTEXT_PATH + '/userMgmt/user.do?method=readMyinfo',
			reader : {
				type : 'json',
				root : 'datas',
				successProperty : 'success'
			}
		}
	});

	UsrAst.load('', {
		success : function(usrAst) {
			createGrid(usrAst);
		},// endofsuccess
		failure: function() {
			lfn_gotoHome();
		}		
	});// load
	cenerFinishCallback();
});

