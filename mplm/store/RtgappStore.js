/**
 * RtgApp Store

system_code	code_name_kr
seq	순서
user_id	user_id
user_name	user_name
emp_no	사번
company_code	회사 코드
dept_name	부서 명
dept_code	부서 코드
app_type	app_type
gubun	gubun
unique_id	unique_id
create_date	생성일자


 */
Ext.define('Mplm.store.RtgappStore', {
    extend: 'Ext.data.Store',
	fields:[     

		{ name: 'seq_no', type: 'string'}//	순서
		,{ name: 'user_id', type: 'string'}//user_id
		,{ name: 'user_name', type: 'string'}//user_name
		,{ name: 'emp_no', type: 'string'}//사번
		,{ name: 'company_code', type: 'string'}//회사 코드
		,{ name: 'dept_name', type: 'string'}//부서 명
		,{ name: 'dept_code', type: 'string'}//부서 코드
		,{ name: 'app_type', type: 'string'}//app_type
		,{ name: 'gubun', type: 'string'}//gubun
		,{ name: 'unique_id', type: 'string'}//unique_id
		,{ name: 'create_date', type: 'string'}//생성일자
	 	     
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'seq_no',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {

			},
			beforeload: function(records){

			}
		}
});