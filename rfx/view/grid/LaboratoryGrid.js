Ext.define('Rfx.view.grid.LaboratoryGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {

    	
    	this.callParent();


    },
    autoScroll: true,
    columns : [
    {
        "text":"공급사명",
        "width":100,"sortable":true,
        "dataIndex":"supplier_name",
        "listeners":{},
        "triStateSort":false
    },
    {
        "text":"사업자등록번호",
        "width":100,"sortable":true,
        "dataIndex":"business_registration_no",
        "listeners":{},"triStateSort":false
    },
    {
        "text":"대표자명",
        "width":80,
        "sortable":true,
        "dataIndex":"president_name",
        "listeners":{},
        "triStateSort":false
    },
        {"text":"소재지",
        "width":200,
        "sortable":true,
        "dataIndex":"address_1",
        "listeners":{},
        "triStateSort":false},
        {"text":"휴대폰번호",
        "width":80,
        "sortable":true,
        "dataIndex":"sales_person1_mobilephone_no",
        "listeners":{},
        "triStateSort":false},
        {"text":"이름","width":80,
        "sortable":true,"dataIndex":"sales_person1_name",
        "listeners":{},
        "triStateSort":false},
        {"text":"회사코드",
        "width":80,"sortable":true,
        "dataIndex":"supplier_code",
        "listeners":{},"triStateSort":false}]

//     columns: [
//         {
//     	text: '공급사명',
//     	cls:'rfx-grid-header', 
//         dataIndex: 'wa_code',
// //        resizable: true,
// //        autoSizeColumn : true,
//         width: 80,
//         style: 'text-align:center',     
//         align:'center'
//     },
//         {
//     	text: '회사코드',
//     	cls:'rfx-grid-header', 
//         dataIndex: 'wa_code',
// //        resizable: true,
// //        autoSizeColumn : true,
//         width: 80,
//         style: 'text-align:center',     
//         align:'center'
//     },{
//     	text: '회사명',
//     	cls:'rfx-grid-header', 
//         dataIndex: 'wa_name',
// //        resizable: true,
// //        autoSizeColumn : true,
//         width: 120,
//         style: 'text-align:center',     
//         align:'center'
//     },{
//     	text: '사업자번호',
//     	cls:'rfx-grid-header', 
//         dataIndex: 'name',
// //        resizable: true,
// //        autoSizeColumn : true,
//         width: 150,
//         style: 'text-align:center',     
//         align:'center'
//     },{
//     	text: '소재지',
//     	cls:'rfx-grid-header', 
//         dataIndex: 'name',
// //        resizable: true,
// //        autoSizeColumn : true,
//         width: 150,
//         style: 'text-align:center',     
//         align:'center'
//     }]
//    ,
//      bbar: getPageToolbar(this.store, true, null, function () {
//                    	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                    }),
//	  listeners: {
//	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
//	    	 console_logs('여기오냐?',record);
//		 }//endof itemdblclick
//
//	  }//endof listeners
});
