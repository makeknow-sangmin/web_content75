var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});

// *****************************GLOBAL VARIABLE**************************/

var grid = null;
var store = null;
var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var sales_price = '';
var quan = '';
var upno = true;
var lineGap = 35;
var selectedMoldUid = '';
var selectedAssyUid = '';
var selectedMoldCode = '';
var selectedMoldCoord = '';
var selectedMoldName = '';
var toPjUidAssy = ''; // 
var toPjUid = ''; // ac_uid
var selectedPj_code = '';

var lineGap = 35;
var selectionLength = 0;

var commonUnitStore = null;
var commonCurrencyStore = null;
var commonModelStore = null;
var commonStandardStore = null;
var commonNonStandardStore = null;
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {});

var is_complished = false;

var path = '';

var isAssFromMyPart = false;
var curreny = '';
var unit_code = '';
var standard_flag = '';
var item_code = '';
var unique_id = '';
var specification = '';
var item_name = '';
var description = '';
var model_no = '';
var comment = '';
var maker_name = '';
var sales_price = '';
var static_seller_name = '';
var image_no = '';
var remark = '';
var image_path = '';
var class_code = '';
var orReference1 = '';
var orReference2 = '';
var quan = '';
var alter_reason = '';

// function checkPerent(selectedAssyUid){
// if(selectedAssyUid == null || selectedAssyUid ==''){
// addAction.disable();
// addActionNon.disable();
// }else{
// addAction.enable();
// addActionNon.enable();
// }
// }

function setReadOnly(o, readonly) {
    o.setReadOnly(readonly);
    if (readonly) {
        o.setFieldStyle('background-color: #EAEAEA; background-image: none;');
    } else {
        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
    }

}

function setValueInputForm(selectedRecord) {

    var oChild = Ext.getCmp('child');
    var oItem_code = Ext.getCmp('item_code');
    var oSpecification = Ext.getCmp('specification');
    var oItem_name = Ext.getCmp('item_name');
    var oStandard_flag = Ext.getCmp('standard_flag');
    var oStandard_flag_disp = Ext.getCmp('standard_flag_disp');
    var oReserved_varchar5 = Ext.getCmp('reserved_varchar5');
    var oDescription = Ext.getCmp('description');
    var oModel_no = Ext.getCmp('model_no');
    var oComment = Ext.getCmp('comment');
    var oMaker_name = Ext.getCmp('maker_name');
    var oUnit_code = Ext.getCmp('unit_code');
    var oCurrency = Ext.getCmp('currency');
    var oSales_price = Ext.getCmp('sales_price');
    var oClass_code1 = Ext.getCmp('class_code1');
    var oClass_code2 = Ext.getCmp('class_code2');
    var oSeller_name = Ext.getCmp('seller_name');
    var oImage_no = Ext.getCmp('image_no');
    var oRemark = Ext.getCmp('remark');
    var oReference1 = Ext.getCmp('reference1');
    var oReference2 = Ext.getCmp('reference2');
    var oClass_code = Ext.getCmp('class_code');
    var oAlter_reason = Ext.getCmp('alter_reason');
    // var oQuan = Ext.getCmp('quan');

    console_log(selectedRecord);
    var readonly = false;
    curreny = '';
    unit_code = '';
    standard_flag = '';
    item_code = '';
    unique_id = '';
    specification = '';
    item_name = '';
    description = '';
    model_no = '';
    comment = '';
    maker_name = '';
    sales_price = '';
    static_seller_name = '';
    image_no = '';
    remark = '';
    image_path = '';
    class_code = '';
    orReference1 = '';
    orReference2 = '';
    quan = '';
    alter_reason = '';

    if (selectedRecord != null) {

        curreny = selectedRecord.get('currency');
        unit_code = selectedRecord.get('unit_code');
        standard_flag = selectedRecord.get('standard_flag');
        item_code = selectedRecord.get('item_code');
        unique_id = selectedRecord.get('unique_id');
        specification = selectedRecord.get('specification');
        item_name = selectedRecord.get('item_name');
        image_path = selectedRecord.get('image_path');
        alter_reason = selectedRecord.get('alter_reason');
        console_log('alter_reason : ' + alter_reason);
        description = selectedRecord.get('description');
        model_no = selectedRecord.get('model_no');
        comment = selectedRecord.get('comment');
        maker_name = selectedRecord.get('maker_name');
        sales_price = selectedRecord.get('sales_price');
        static_seller_name = selectedRecord.get('static_seller_name');
        image_no = selectedRecord.get('image_no');
        remark = selectedRecord.get('remark');
        class_code = selectedRecord.get('class_code');
        // quan = selectedRecord.get('quan');
        var split_request_comment = selectedRecord.get('request_comment')
            .split('|');
        for (var i = 0; i < 2; i++) {
            orReference1 = split_request_comment[0];
            orReference2 = split_request_comment[1];
        }

        readonly = true;

    }

    // setReadOnly(oSpecification,readonly);
    // setReadOnly(oChild.setDisabled(false);
    setReadOnly(oItem_code, readonly);
    setReadOnly(oItem_name, readonly);
    // setReadOnly(oStandard_flag,readonly);
    setReadOnly(oStandard_flag_disp, readonly);
    // setReadOnly(oPl_no,readonly);
    setReadOnly(oDescription, readonly);
    setReadOnly(oModel_no, readonly);
    setReadOnly(oComment, readonly);
    // setReadOnly(oMaker_name,readonly);
    // setReadOnly(oUnit_code,readonly);
    // setReadOnly(oCurrency,readonly);
    // setReadOnly(oSales_price,readonly);
    setReadOnly(oClass_code1, readonly);
    setReadOnly(oClass_code2, readonly);
    setReadOnly(oSeller_name, readonly);
    setReadOnly(oImage_no, readonly);
    setReadOnly(oRemark, readonly);
    // setReadOnly(oImage_path,readonly);
    setReadOnly(oReference1, readonly);
    setReadOnly(oReference2, readonly);
    setReadOnly(oClass_code, readonly);
    setReadOnly(oReserved_varchar5, readonly);

    // setReadOnly(oQuan,readonly);

    oChild.setValue(unique_id);
    oItem_code.setValue(item_code);
    oSpecification.setValue(specification);
    oItem_name.setValue(item_name);
    oStandard_flag.setValue(standard_flag);
    oStandard_flag_disp.setValue(standard_flag);
    oReserved_varchar5.setValue(image_path);
    oDescription.setValue(description);
    oModel_no.setValue(model_no);
    oComment.setValue(comment);
    oSeller_name.setValue(static_seller_name);
    oImage_no.setValue(image_no);
    oRemark.setValue(remark);
    oClass_code.setValue(class_code);
    oReference1.setValue(orReference1);
    oReference2.setValue(orReference2);
    oAlter_reason.setValue(alter_reason);
    // oQuan.setValue(quan);
    // oUnit_code.setValue(unit_code);
    // oCurrency.setValue(curreny);
    // oSales_price.setValue(sales_price);
    // oImage_path.setValue(image_path);
    // oMaker_name.setValue(maker_name);

}

/**
 * true: 권한없음. false:권한있음.
 */
function fPERM_DISABLING_Complished() {
    // 1. 권한있음.
    if (fPERM_DISABLING() == false && is_complished == false) {
        return false;
    } else { // 2.권한 없음.
        return true;
    }
}

function item_code_dash(item_code) {
    if (item_code == null || item_code.length < 13) {
        return item_code;
    } else {
        return item_code.substring(0, 12);
    }
}

function cleanComboStore(cmpName) {
    var component = Ext.getCmp(cmpName);

    component.setValue('');
    component.setDisabled(false);
    console_log('     cleanComboStore.....');
    component.getStore().removeAll();
    console_log('     removeAll ok');
    component.setValue(null);
    console_log('     setValue null ok');
    component.getStore().commitChanges();
    console_log('     commitChanges ok');
    component.getStore().totalLength = 0;
    console_log('     totalLength=0 ok');

}

// var printExcelHandlerDbm1 = function() {
//	
// //Excel Setting.
// store.getProxy().setExtraParam("srch_type", 'excelPrint');
// store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );
//	
// store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
// store.load({
// scope: this,
// callback: function(records, operation, success) {
// // the operation object
// // contains all of the details of the load operation
// console_log(records);
// console_log(operation);
// console_log(success);
//	        
// var excelPath = store.getProxy().getReader().rawData.excelPath;
// if(excelPath!='') {
// var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
// top.location.href=url;
// }
// }
// });
// };

function resetParam() {
    store.getProxy().setExtraParam('unique_id', '');
    store.getProxy().setExtraParam('item_code', '');
    store.getProxy().setExtraParam('item_name', '');
    store.getProxy().setExtraParam('specification', '');
}

function createEditForm(partline) {

    console_log(partline);
    // 수정할때는 unique_uid를 써야함. unique_id=child 여러개의 BOM이 있어 한개만 가져올 수 없음.
    // assymap.xml에서 <select id="getBomByUniqueId" ..> 참조,
    //
    var unique_uid = partline.get('unique_uid'); // partline.get('unique_id');
    // var class_code1 = partline.get('class_code1');
    // var class_code2 = partline.get('class_code2');
    var class_code = partline.get('class_code');
    var pl_no = partline.get('pl_no');
    var item_name = partline.get('item_name');
    // var standard_flag_disp = partline.get('standard_flag_disp');
    var standard_flag = partline.get('standard_flag');
    var description = partline.get('description');
    var specification = partline.get('specification');
    var model_no = partline.get('model_no');
    var comment = partline.get('comment');
    // var maker_name = partline.get('maker_name');
    var quan = partline.get('quan');
    // var unit_code = partline.get('unit_code');
    // var sales_price = partline.get('sales_price' );
    // var currency = partline.get('currency' );
    var child = partline.get('unique_id'); // 자재 srcahd_uid
    var sg_code = partline.get('sg_code');
    var seller_name = partline.get('seller_name');
    var image_no = partline.get('image_no');
    var remark = partline.get('remark');
    // var image_path = partline.get('image_path');
    var alter_reason = partline.get('alter_reason');
    var reference1 = partline.get('request_comment1');
    var reference2 = partline.get('request_comment2');
    var approve = partline.get('reserved_varchar2');
    var form = null;
    if (sg_code == 'STD') {
        // if(image_path=='' || image_path=='-' ||
        // image_path.substring(0,1)=='P'){
        // standard_flag = 'K';
        // }else{
        // standard_flag = 'O';
        // }
        form = Ext
            .create(
                'Ext.form.Panel', {
                    id: 'formPanel',
                    // layout: 'absolute',
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    defaults: {
                        anchor: '100%',
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        new Ext.form.Hidden({
                            id: 'parent',
                            name: 'parent',
                            value: selectedAssyUid
                        }),
                        new Ext.form.Hidden({
                            id: 'ac_uid',
                            name: 'ac_uid',
                            value: selectedMoldUid
                        }),
                        new Ext.form.Hidden({
                            id: 'pj_code',
                            name: 'pj_code',
                            value: selectedMoldCode
                        }),
                        new Ext.form.Hidden({
                            id: 'coord_key2',
                            name: 'coord_key2',
                            value: selectedMoldCoord
                                // }),new Ext.form.Hidden({
                                // id: 'standard_flag',
                                // name: 'standard_flag'
                        }),
                        new Ext.form.Hidden({
                            id: 'child',
                            name: 'child',
                            value: child
                        }),
                        new Ext.form.Hidden({
                            id: 'request_comment',
                            name: 'request_comment'
                        }),
                        new Ext.form.Hidden({
                            id: 'sg_code',
                            name: 'sg_code',
                            value: 'STD'
                        }),
                        new Ext.form.Hidden({
                            id: 'unique_id',
                            name: 'unique_id',
                            value: unique_uid
                        }),
                        new Ext.form.Hidden({
                            id: 'image_no',
                            name: 'image_no',
                            value: image_no
                        }),
                        /*******************************************
                         * 수정할 때는 MyPart 사용못함.
                         */
                        {
                            value: unique_uid,
                            xtype: 'textfield',
                            // x: 5,
                            // y: 5,
                            name: 'unique_id',
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            anchor: '100%'
                        }, {
                            xtype: 'fieldset',
                            // x: 5,
                            // y: lineGap,
                            title: panelSRO1139,
                            collapsible: false,
                            defaults: {
                                labelWidth: 40,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {
                                        top: 0,
                                        right: 5,
                                        bottom: 0,
                                        left: 0
                                    }
                                }
                            },
                            items: [

                                {
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    fieldLabel: panelSRO1144 + dbm1_class_code1,
                                    defaults: {
                                        hideLabel: true
                                    },
                                    items: [{
                                            fieldLabel: getColName('class_code'),
                                            id: 'class_code1',
                                            name: 'class_code1',
                                            emptyText: dbm1_class_code1,
                                            xtype: 'combo',
                                            mode: 'local',
                                            editable: false,
                                            allowBlank: true,
                                            disabled: true,
                                            queryMode: 'remote',
                                            displayField: 'name',
                                            valueField: 'value',
                                            store: Ext
                                                .create(
                                                    'Ext.data.Store', {
                                                        fields: [
                                                            'name',
                                                            'value'
                                                        ],
                                                        data: comboClass1
                                                    }),
                                            triggerAction: 'all',
                                            listeners: {
                                                select: function(
                                                    combo,
                                                    record) {
                                                    CmaterialStore.proxy.extraParams.level = '2';
                                                    CmaterialStore.proxy.extraParams.parent_class_code = this
                                                        .getValue();

                                                    CmaterialStore
                                                        .load(function(
                                                            records) {
                                                            console_log("class_code1 :" + class_code1);
                                                            console_log("class_code2 :" + class_code2);
                                                            var obj2 = Ext
                                                                .getCmp('class_code2');
                                                            var obj3 = Ext
                                                                .getCmp('pl_no');
                                                            var obj4 = Ext
                                                                .getCmp('item_name');
                                                            var obj5 = Ext
                                                                .getCmp('class_code');
                                                            // obj2.reset();
                                                            obj2
                                                                .clearValue(); // text필드에
                                                            // 있는
                                                            // name
                                                            // 삭제
                                                            obj2.store
                                                                .removeAll(); // class_code2필드에서
                                                            // 보여지는
                                                            // 값을
                                                            // 삭제
                                                            obj3
                                                                .reset();
                                                            obj4
                                                                .reset();
                                                            obj5
                                                                .reset();

                                                            for (var i = 0; i < records.length; i++) {
                                                                var classObj = records[i];
                                                                var class_code = classObj
                                                                    .get('class_code_full');
                                                                var class_name = classObj
                                                                    .get('class_name');
                                                                console_log(class_code + ':' + class_name);
                                                                // var
                                                                // obj
                                                                // =
                                                                // {};
                                                                // obj['class_name']
                                                                // =
                                                                // '['
                                                                // +
                                                                // class_code
                                                                // +
                                                                // ']'
                                                                // +
                                                                // class_name;
                                                                // obj['class_code_full']
                                                                // =
                                                                // class_code;
                                                                // comboClass2.push(obj);
                                                                obj2.store
                                                                    .add({
                                                                        class_name: '[' + class_code + ']' + class_name
                                                                            // class_code_full:
                                                                            // class_code
                                                                    });
                                                            }
                                                        });
                                                }
                                            }
                                        }, {
                                            fieldLabel: getColName('class_code'),
                                            id: 'class_code2',
                                            name: 'class_code2',
                                            emptyText: dbm1_class_code2,
                                            xtype: 'combo',
                                            mode: 'local',
                                            editable: false,
                                            allowBlank: true,
                                            disabled: true,
                                            // typeAhead: true,
                                            // selectOnFocus: true,
                                            // forceSelection: true,
                                            triggerAction: 'all',
                                            queryMode: 'local',
                                            displayField: 'class_name',
                                            // valueField:
                                            // 'class_code_full',
                                            // listConfig:{
                                            // getInnerTpl:
                                            // function(){
                                            // return
                                            // '<div>{class_name}</div>';
                                            // }
                                            // },
                                            listeners: {
                                                select: function(
                                                    combo,
                                                    record) {
                                                    console_log("class_code1 :" + class_code1);
                                                    console_log("class_code2 :" + class_code2);
                                                    console_log('Selected Value : ' + combo
                                                        .getValue());
                                                    Class_code = Ext
                                                        .getCmp(
                                                            'class_code2')
                                                        .getValue();

                                                    var code = Class_code
                                                        .substring(
                                                            1,
                                                            6);
                                                    var code5 = Class_code
                                                        .substring(
                                                            1,
                                                            5);
                                                    var name = Class_code
                                                        .substring(
                                                            7,
                                                            Class_code.length);
                                                    var name5 = Class_code
                                                        .substring(
                                                            6,
                                                            Class_code.length);

                                                    // console_log('Class_code[6]
                                                    // : ' +
                                                    // Class_code.substring(6,7));
                                                    // console_log('code.length
                                                    // : ' + code);
                                                    // console_log('name.length
                                                    // : ' + name);
                                                    // console_log('!!!!!!!!!!!!!');
                                                    // console_log('code5.length
                                                    // : ' + code5);
                                                    // console_log('name5.length
                                                    // : ' + name5);
                                                    if (Class_code
                                                        .substring(
                                                            6,
                                                            7) == ']') {
                                                        console_log('Class_code[6]!!!! ');
                                                        // Ext.getCmp('pl_no').setValue(code+'-');
                                                        Ext
                                                            .getCmp(
                                                                'item_name')
                                                            .setValue(
                                                                name);
                                                        Ext
                                                            .getCmp(
                                                                'class_code')
                                                            .setValue(
                                                                code);
                                                    } else {
                                                        console_log('Class_code.....');
                                                        // Ext.getCmp('pl_no').setValue(code5+'-');
                                                        Ext
                                                            .getCmp(
                                                                'item_name')
                                                            .setValue(
                                                                name5);
                                                        Ext
                                                            .getCmp(
                                                                'class_code')
                                                            .setValue(
                                                                code5);
                                                    }
                                                }
                                            }
                                        }, {
                                            xtype: 'textfield',
                                            flex: 1,
                                            width: 70,
                                            emptyText: dbm1_pl_no,
                                            name: 'class_code',
                                            id: 'class_code',
                                            value: class_code,
                                            fieldLabel: getColName('class_code'),
                                            // displayField:
                                            // 'class_code_full' ,
                                            readOnly: true,
                                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                                            disabled: false,
                                            allowBlank: true
                                        }
                                        // ,
                                        // {
                                        // xtype: 'textfield',
                                        // flex : 1,
                                        // width: 70,
                                        // //emptyText: dbm1_pl_no,
                                        // name : 'pl_no',
                                        // id : 'pl_no',
                                        // value: pl_no,
                                        // fieldLabel: getColName('pl_no'),
                                        // // displayField:
                                        // 'class_code_full' ,
                                        // readOnly : true,
                                        // // fieldStyle: 'background-color:
                                        // #E7EEF6; background-image:
                                        // none;',
                                        // disabled: false,
                                        // allowBlank: true
                                        // },
                                        // {
                                        // xtype: 'textfield',
                                        // flex : 1,
                                        // //emptyText: '품명',
                                        // name : 'item_name',
                                        // id : 'item_name',
                                        // value: item_name,
                                        // fieldLabel:
                                        // getColName('item_name'),
                                        // readOnly : true,
                                        // // fieldStyle: 'background-color:
                                        // #E7EEF6; background-image:
                                        // none;',
                                        // disabled: false,
                                        // allowBlank: false
                                        // }
                                    ]
                                }
                            ]
                        }, {
                            xtype: 'textfield',
                            flex: 1,
                            width: 70,
                            // emptyText: dbm1_pl_no,
                            name: 'pl_no',
                            id: 'pl_no',
                            value: pl_no,
                            fieldLabel: getColName('pl_no'),
                            // displayField: 'class_code_full' ,
                            readOnly: false,
                            // fieldStyle: 'background-color:
                            // #E7EEF6; background-image: none;',
                            disabled: false,
                            allowBlank: true
                        }, {
                            xtype: 'textfield',
                            flex: 1,
                            // emptyText: '품명',
                            name: 'item_name',
                            id: 'item_name',
                            value: item_name,
                            fieldLabel: getColName('item_name'),
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            disabled: false,
                            allowBlank: false
                        }, {
                            // x: 5,
                            // y: 40 + 2*lineGap,
                            width: 80,
                            id: 'standard_flag',
                            name: 'standard_flag',
                            value: standard_flag,
                            xtype: 'combo',
                            mode: 'local',
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            editable: false,
                            allowBlank: true,
                            queryMode: 'remote',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            // value: 'O',
                            triggerAction: 'all',
                            fieldLabel: getColName('standard_flag'),
                            store: commonStandardStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    var systemCode = record[0]
                                        .get('systemCode');
                                    var codeNameEn = record[0]
                                        .get('codeNameEn');
                                    var codeName = record[0]
                                        .get('codeName');
                                    console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                    // systemCode = codeName;
                                    Ext.getCmp('standard_flag')
                                        .setValue(systemCode);
                                }
                            }
                        }, {
                            fieldLabel: getColName('description'),
                            // x: 5,
                            // y: 40 + 3*lineGap,
                            name: 'description',
                            id: 'description',
                            allowBlank: true,
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            value: description,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('specification'),
                            // x: 5,
                            // y: 40 + 4*lineGap,
                            name: 'specification',
                            id: 'specification',
                            allowBlank: true,
                            readOnly: false,
                            value: specification,
                            anchor: '-5', // anchor width by
                            // percentage
                            listeners: {
                                afterrender: function(field) {
                                    var value_pl_no = Ext.getCmp(
                                        'pl_no').getValue();
                                    if (value_pl_no == '-' || value_pl_no == '') {
                                        Ext.getCmp('specification')
                                            .setDisabled(false);
                                    } else {
                                        Ext.getCmp('specification')
                                            .setReadOnly(true);
                                        Ext
                                            .getCmp(
                                                'specification')
                                            .setFieldStyle(
                                                'background-color: #E7EEF6; background-image: none;');
                                    }
                                }
                            }
                        }, {
                            // the width of this field in the HBox
                            // layout is set directly
                            // the other 2 items are given flex: 1,
                            // so will share the rest of the space
                            width: 80,
                            // x: 5,
                            // y: 40 + 5*lineGap,
                            id: 'model_no',
                            name: 'model_no',
                            value: model_no,
                            xtype: 'combo',
                            mode: 'local',
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            editable: false,
                            allowBlank: true,
                            queryMode: 'remote',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            triggerAction: 'all',
                            fieldLabel: getColName('model_no'),
                            // displayField: 'name',
                            // valueField: 'value',
                            // queryMode: 'local',
                            store: commonModelStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                load: function(store, records,
                                    successful, operation,
                                    options) {
                                    if (this.hasNull) {
                                        var blank = {
                                            systemCode: '',
                                            codeNameEn: '',
                                            codeName: ''
                                        };

                                        this.add(blank);
                                    }

                                },
                                select: function(combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    var systemCode = record[0]
                                        .get('systemCode');
                                    var codeNameEn = record[0]
                                        .get('codeNameEn');
                                    var codeName = record[0]
                                        .get('codeName');
                                    console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                }
                            }
                        }, {
                            fieldLabel: getColName('comment'),
                            // x: 5,
                            // y: 40 + 6*lineGap,
                            name: 'comment',
                            id: 'comment',
                            value: comment,
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel: getColName('maker_name'),
                                // x: 5,
                                // y: 20 + 9*lineGap,
                                // name: 'maker_name',
                                // id: 'maker_name',
                                // value: maker_name,
                                // anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel:
                                // getColName('seller_name'),
                                // x: 5,
                                // y: 40 + 7*lineGap,
                                // name: 'seller_name',
                                // id: 'seller_name',
                                // value: seller_name,
                                // readOnly : true,
                                // fieldStyle: 'background-color:
                                // #E7EEF6; background-image: none;',
                                // allowBlank: true,
                                // anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('image_no'),
                            // x: 5,
                            // y: 40 + 7*lineGap,
                            name: 'bom_image_no',
                            id: 'bom_image_no',
                            value: image_no,
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('alter_reason'),
                            // x: 5,
                            // y: 40 + 8*lineGap,
                            name: 'alter_reason',
                            id: 'alter_reason',
                            value: alter_reason,
                            readOnly: false,
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('remark'),
                            // x: 5,
                            // y: 40 + 9*lineGap,
                            name: 'remark',
                            id: 'remark',
                            value: remark,
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: dbm1_reference1,
                            // x: 5,
                            // y: 40 + 10*lineGap,
                            name: 'reference1',
                            id: 'reference1',
                            value: reference1,
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: dbm1_reference2,
                            // x: 5,
                            // y: 40 + 11*lineGap,
                            name: 'reference2',
                            id: 'reference2',
                            value: reference2,
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel: getColName('pl_no'),
                                // x: 5,
                                // y: 40 + 12*lineGap,
                                // name: 'pl_no',
                                // id: 'pl_no',
                                // value: pl_no,
                                // readOnly : false,
                                // allowBlank: true,
                                // anchor: '-5' // anchor width by
                                // percentage
                        }
                        /*
                         * , { x:5, y: 21 + 8*lineGap, xtype:
                         * 'filefield', id: 'form-file',
                         * emptyText: panelSRO1149, fieldLabel:
                         * panelSRO1150, name: 'photo-path',
                         * buttonText: '', buttonConfig: {
                         * iconCls: 'upload-icon' }, anchor:
                         * '-5' // anchor width by percentage }
                         */
                        , {
                            xtype: 'fieldset',
                            // x: 5,
                            // y: 40 + 12*lineGap,
                            border: true,
                            // style: 'border-width: 0px',
                            title: panelSRO1174,
                            collapsible: false,
                            defaults: {
                                labelWidth: 40,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {
                                        top: 0,
                                        right: 5,
                                        bottom: 0,
                                        left: 0
                                    }
                                }
                            },
                            items: [

                                {
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    defaults: {
                                        hideLabel: true
                                    },
                                    items: [{
                                            xtype: 'displayfield',
                                            value: ' ' + panelSRO1186 + ':'
                                        }, {
                                            xtype: 'numberfield',
                                            minValue: 0,
                                            width: 70,
                                            name: 'quan',
                                            value: quan,
                                            fieldLabel: getColName('quan'),
                                            readOnly: false,
                                            // allowBlank: true,
                                            // margins: '0'
                                            listeners: {
                                                afterrender: function(
                                                    field) {
                                                    if (approve == 'Y') {
                                                        console_log(field);
                                                        field
                                                            .setReadOnly(true);
                                                        field
                                                            .setFieldStyle('background-color: #E7EEF6; background-image: none;');
                                                    }
                                                }
                                            }
                                        }
                                        // ,{
                                        // xtype: 'displayfield',
                                        // value:
                                        // '&nbsp;&nbsp;'+panelSRO1187+':'
                                        // }, {
                                        // //the width of this field in the
                                        // HBox layout is set directly
                                        // //the other 2 items are given
                                        // flex: 1, so will share the rest
                                        // of the space
                                        // width: 80,
                                        // id: 'unit_code',
                                        // name: 'unit_code',
                                        // value: unit_code,
                                        // xtype: 'combo',
                                        // mode: 'local',
                                        // editable: false,
                                        // allowBlank: true,
                                        // queryMode: 'remote',
                                        // displayField: 'codeName',
                                        // valueField: 'codeName',
                                        // value: 'PC',
                                        // triggerAction: 'all',
                                        // fieldLabel:
                                        // getColName('unit_code'),
                                        // // displayField: 'name',
                                        // // valueField: 'value',
                                        // // queryMode: 'local',
                                        // store: commonUnitStore,
                                        // listConfig:{
                                        // getInnerTpl: function(){
                                        // return '<div
                                        // data-qtip="{systemCode}">{codeName}</div>';
                                        // }
                                        // },
                                        // listeners: {
                                        // select: function (combo, record)
                                        // {
                                        // console_log('Selected Value : ' +
                                        // combo.getValue());
                                        // var systemCode =
                                        // record[0].get('systemCode');
                                        // var codeNameEn =
                                        // record[0].get('codeNameEn');
                                        // var codeName =
                                        // record[0].get('codeName');
                                        // console_log('systemCode : ' +
                                        // systemCode
                                        // + ', codeNameEn=' + codeNameEn
                                        // + ', codeName=' + codeName );
                                        // }
                                        // }
                                        // },
                                        // {
                                        // xtype: 'displayfield',
                                        // value: ' '+panelSRO1188+':'
                                        // },
                                        // {
                                        // xtype: 'numberfield',
                                        // minValue: 0,
                                        // flex: 1,
                                        // name : 'sales_price',
                                        // id : 'sales_price',
                                        // value: sales_price,
                                        // fieldLabel:
                                        // getColName('sales_price'),
                                        // allowBlank: true,
                                        // margins: '0'
                                        // }, {
                                        // //the width of this field in the
                                        // HBox layout is set directly
                                        // //the other 2 items are given
                                        // flex: 1, so will share the rest
                                        // of the space
                                        // width: 80,
                                        // id: 'currency',
                                        // name: 'currency',
                                        // value: currency,
                                        // xtype: 'combo',
                                        // mode: 'local',
                                        // editable: false,
                                        // allowBlank: true,
                                        // queryMode: 'remote',
                                        // displayField: 'codeName',
                                        // valueField: 'codeName',
                                        // value: 'RMB',
                                        // triggerAction: 'all',
                                        // fieldLabel:
                                        // getColName('currency'),
                                        // // displayField: 'name',
                                        // // valueField: 'value',
                                        // // queryMode: 'local',
                                        // store: commonCurrencyStore,
                                        // listConfig:{
                                        // getInnerTpl: function(){
                                        // return '<div
                                        // data-qtip="{systemCode}">{codeName}</div>';
                                        // }
                                        // },
                                        // listeners: {
                                        // select: function (combo, record)
                                        // {
                                        // console_log('Selected Value : ' +
                                        // combo.getValue());
                                        // var systemCode =
                                        // record[0].get('systemCode');
                                        // var codeNameEn =
                                        // record[0].get('codeNameEn');
                                        // var codeName =
                                        // record[0].get('codeName');
                                        // console_log('systemCode : ' +
                                        // systemCode
                                        // + ', codeNameEn=' + codeNameEn
                                        // + ', codeName=' + codeName );
                                        // }
                                        // }
                                        // }
                                    ]
                                }
                            ]
                        }
                    ]
                });
    } else { // NSD edite
        form = Ext
            .create(
                'Ext.form.Panel', {
                    id: 'formPanel',
                    // layout: 'absolute',
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    defaults: {
                        anchor: '100%',
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        new Ext.form.Hidden({
                            id: 'parent',
                            name: 'parent',
                            value: selectedAssyUid
                        }),
                        new Ext.form.Hidden({
                            id: 'ac_uid',
                            name: 'ac_uid',
                            value: selectedMoldUid
                        }),
                        new Ext.form.Hidden({
                            id: 'pj_code',
                            name: 'pj_code',
                            value: selectedMoldCode
                        }),
                        new Ext.form.Hidden({
                            id: 'coord_key2',
                            name: 'coord_key2',
                            value: selectedMoldCoord
                                // }),new Ext.form.Hidden({
                                // id: 'standard_flag',
                                // name: 'standard_flag'
                        }),
                        new Ext.form.Hidden({
                            id: 'child',
                            name: 'child',
                            value: child
                        }),
                        new Ext.form.Hidden({
                            id: 'request_comment',
                            name: 'request_comment'
                        }),
                        new Ext.form.Hidden({
                            id: 'sg_code',
                            name: 'sg_code',
                            value: 'NSD'
                        }),
                        /*******************************************
                         * 수정할 때는 MyPart 사용못함.
                         */
                        {
                            value: unique_uid,
                            xtype: 'textfield',
                            x: 5,
                            y: 5,
                            name: 'unique_id',
                            readOnly: true,
                            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
                            anchor: '100%'
                        }, {
                            // xtype: 'fieldset',
                            // x: 5,
                            // y: lineGap,
                            // title: panelSRO1139,
                            // collapsible: false,
                            // defaults: {
                            // labelWidth: 40,
                            // anchor: '100%',
                            // layout: {
                            // type: 'hbox',
                            // defaultMargins: {top: 0, right: 5,
                            // bottom: 0, left: 0}
                            // }
                            // },
                            // items: [
                            //				         
                            // {
                            // xtype : 'fieldcontainer',
                            // combineErrors: true,
                            // msgTarget: 'side',
                            // fieldLabel: panelSRO1144,
                            // defaults: {
                            // hideLabel: true
                            // },
                            // items : [
                            // {
                            // fieldLabel: getColName('class_code'),
                            // id: 'class_code1',
                            // name: 'class_code1',
                            // emptyText: dbm1_class_code1,
                            // xtype: 'combo',
                            // mode: 'local',
                            // editable:false,
                            // allowBlank: false,
                            // disabled: true,
                            // queryMode: 'remote',
                            // displayField: 'name',
                            // valueField: 'value',
                            // store: Ext.create('Ext.data.Store', {
                            // fields : ['name', 'value'],
                            // data : comboClass1
                            // }),
                            // triggerAction: 'all',
                            // listeners: {
                            // select: function (combo, record) {
                            // CmaterialStore.proxy.extraParams.level
                            // = '2';
                            // CmaterialStore.proxy.extraParams.parent_class_code
                            // = this.getValue();
                            //				        	        			  
                            // CmaterialStore.load(
                            // function(records) {
                            // console_log("class_code :" +
                            // class_code);
                            // console_log("class_code1 :" +
                            // class_code1);
                            // console_log("class_code2 :" +
                            // class_code2);
                            // var obj2 = Ext.getCmp('class_code2');
                            // var obj3 = Ext.getCmp('image_path');
                            // var obj4 = Ext.getCmp('item_name');
                            // // obj2.reset();
                            // obj2.clearValue();//text필드에 있는 name
                            // 삭제
                            // obj2.store.removeAll();//class_code2필드에서
                            // 보여지는 값을 삭제
                            // obj3.reset();
                            // obj4.reset();
                            //				        	        				  
                            // for (var i=0; i<records.length; i++){
                            // var classObj = records[i];
                            // var class_code =
                            // classObj.get('class_code_full');
                            // var class_name =
                            // classObj.get('class_name');
                            // console_log(class_code + ':' +
                            // class_name);
                            // //var obj = {};
                            // //obj['class_name'] = '[' +
                            // class_code + ']' + class_name;
                            // //obj['class_code_full'] =
                            // class_code;
                            // //comboClass2.push(obj);
                            // obj2.store.add({
                            // class_name: '[' + class_code + ']' +
                            // class_name
                            // // class_code_full: class_code
                            // });
                            // }
                            // });
                            // }
                            // }
                            // }, {
                            // fieldLabel: getColName('class_code'),
                            // id: 'class_code2',
                            // name: 'class_code2',
                            // xtype: 'combo',
                            // mode: 'local',
                            // emptyText: dbm1_class_code2,
                            // editable:false,
                            // disabled: true,
                            // allowBlank: true,
                            // // typeAhead: true,
                            // // selectOnFocus: true,
                            // // forceSelection: true,
                            // triggerAction: 'all',
                            // queryMode: 'local',
                            // displayField: 'class_name' ,
                            // // valueField: 'class_code_full',
                            // // listConfig:{
                            // // getInnerTpl: function(){
                            // // return '<div>{class_name}</div>';
                            // // }
                            // // },
                            // listeners: {
                            // select: function (combo, record) {
                            // console_log('class_code1 : ' +
                            // class_code1);
                            // console_log('class_code2 : ' +
                            // class_code2);
                            // console_log('Selected Value : ' +
                            // combo.getValue());
                            // Class_code =
                            // Ext.getCmp('class_code2').getValue();
                            // console_log('class_code2 : ' +
                            // class_code2);
                            //				        	        			  
                            // var code = Class_code.substring(1,6);
                            // var code5 =
                            // Class_code.substring(1,5);
                            // var name =
                            // Class_code.substring(7,Class_code.length);
                            // var name5 =
                            // Class_code.substring(6,Class_code.length);
                            //				        	        			  
                            // // console_log('Class_code[6] : ' +
                            // Class_code.substring(6,7));
                            // // console_log('code.length : ' +
                            // code);
                            // // console_log('name.length : ' +
                            // name);
                            // // console_log('!!!!!!!!!!!!!');
                            // // console_log('code5.length : ' +
                            // code5);
                            // // console_log('name5.length : ' +
                            // name5);
                            // if( Class_code.substring(6,7) ==
                            // ']'){
                            // console_log('Class_code[6]!!!! ');
                            // Ext.getCmp('image_path').setValue(code+'-');
                            // Ext.getCmp('item_name').setValue(name);
                            // Ext.getCmp('class_code').setValue(code);
                            // }else{
                            // console_log('Class_code.....');
                            // Ext.getCmp('image_path').setValue(code5+'-');
                            // Ext.getCmp('item_name').setValue(name5);
                            // Ext.getCmp('class_code').setValue(code5);
                            // }
                            // }
                            // }
                            // },
                            // {
                            // xtype: 'textfield',
                            // flex : 1,
                            // width: 70,
                            // emptyText: dbm1_pl_no,
                            // name : 'image_path',
                            // id : 'image_path',
                            // value: image_path,
                            // fieldLabel: getColName('image_path'),
                            // // displayField: 'class_code_full' ,
                            // readOnly : false,
                            // disabled: false,
                            // allowBlank: false
                            // },
                            // {
                            // xtype: 'textfield',
                            // flex : 1,
                            // width: 70,
                            // emptyText: dbm1_pl_no,
                            // name : 'class_code',
                            // id : 'class_code',
                            // value: class_code,
                            // fieldLabel: getColName('class_code'),
                            // // displayField: 'class_code_full' ,
                            // readOnly : false,
                            // disabled: false,
                            // allowBlank: false
                            // },
                            // {
                            // xtype: 'textfield',
                            // flex : 1,
                            // emptyText: '품명',
                            // name : 'item_name',
                            // id : 'item_name',
                            // value: item_name,
                            // fieldLabel: getColName('item_name'),
                            // readOnly : false,
                            // disabled: false,
                            // allowBlank: false
                            // }
                            // ]
                            // }
                            // ]
                            fieldLabel: getColName('item_name'),
                            x: 5,
                            y: 40 + 0 * lineGap,
                            name: 'item_name',
                            id: 'item_name',
                            allowBlank: true,
                            readOnly: false,
                            value: item_name,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            x: 5,
                            y: 40 + 1 * lineGap,
                            width: 80,
                            id: 'standard_flag',
                            name: 'standard_flag',
                            value: standard_flag,
                            xtype: 'combo',
                            mode: 'local',
                            readOnly: false,
                            editable: false,
                            allowBlank: true,
                            queryMode: 'remote',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            // value: 'O',
                            triggerAction: 'all',
                            fieldLabel: getColName('standard_flag'),
                            store: commonNonStandardStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function(combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    var systemCode = record[0]
                                        .get('systemCode');
                                    var codeNameEn = record[0]
                                        .get('codeNameEn');
                                    var codeName = record[0]
                                        .get('codeName');
                                    console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                    // systemCode = codeName;
                                    Ext.getCmp('standard_flag')
                                        .setValue(systemCode);
                                }
                            }
                        }, {
                            fieldLabel: getColName('description'),
                            x: 5,
                            y: 40 + 2 * lineGap,
                            name: 'description',
                            id: 'description',
                            allowBlank: true,
                            readOnly: false,
                            value: description,
                            anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel:
                                // getColName('specification'),
                                // x: 5,
                                // y: 40 + 4*lineGap,
                                // name: 'specification',
                                // id: 'specification',
                                // allowBlank: true,
                                // readOnly : false,
                                // value: specification,
                                // anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            // the width of this field in the HBox
                            // layout is set directly
                            // the other 2 items are given flex: 1,
                            // so will share the rest of the space
                            width: 80,
                            x: 5,
                            y: 40 + 3 * lineGap,
                            id: 'model_no',
                            name: 'model_no',
                            value: model_no,
                            xtype: 'combo',
                            mode: 'local',
                            readOnly: false,
                            editable: false,
                            allowBlank: true,
                            queryMode: 'remote',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            triggerAction: 'all',
                            fieldLabel: getColName('model_no'),
                            // displayField: 'name',
                            // valueField: 'value',
                            // queryMode: 'local',
                            store: commonModelStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                load: function(store, records,
                                    successful, operation,
                                    options) {
                                    if (this.hasNull) {
                                        var blank = {
                                            systemCode: '',
                                            codeNameEn: '',
                                            codeName: ''
                                        };

                                        this.add(blank);
                                    }

                                },
                                select: function(combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    var systemCode = record[0]
                                        .get('systemCode');
                                    var codeNameEn = record[0]
                                        .get('codeNameEn');
                                    var codeName = record[0]
                                        .get('codeName');
                                    console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                }
                            }
                        }, {
                            fieldLabel: getColName('comment'),
                            x: 5,
                            y: 40 + 4 * lineGap,
                            name: 'comment',
                            id: 'comment',
                            value: comment,
                            anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel: getColName('maker_name'),
                                // x: 5,
                                // y: 20 + 9*lineGap,
                                // name: 'maker_name',
                                // id: 'maker_name',
                                // value: maker_name,
                                // anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel:
                                // getColName('seller_name'),
                                // x: 5,
                                // y: 40 + 7*lineGap,
                                // name: 'seller_name',
                                // id: 'seller_name',
                                // value: seller_name,
                                // readOnly : false,
                                // allowBlank: true,
                                // anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('image_no'),
                            x: 5,
                            y: 40 + 5 * lineGap,
                            name: 'image_no',
                            id: 'image_no',
                            value: image_no,
                            readOnly: false,
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                                // },{
                                // fieldLabel:
                                // getColName('alter_reason'),
                                // x: 5,
                                // y: 40 + 6*lineGap,
                                // name: 'alter_reason',
                                // id: 'alter_reason',
                                // value: alter_reason,
                                // readOnly : false,
                                // allowBlank: true,
                                // anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('remark'),
                            x: 5,
                            y: 40 + 6 * lineGap,
                            name: 'remark',
                            id: 'remark',
                            value: remark,
                            readOnly: false,
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: dbm1_reference1,
                            x: 5,
                            y: 40 + 7 * lineGap,
                            name: 'reference1',
                            id: 'reference1',
                            value: reference1,
                            readOnly: false,
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: dbm1_reference2,
                            x: 5,
                            y: 40 + 8 * lineGap,
                            name: 'reference2',
                            id: 'reference2',
                            value: reference2,
                            readOnly: false,
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }, {
                            fieldLabel: getColName('pl_no'),
                            x: 5,
                            y: 40 + 9 * lineGap,
                            name: 'pl_no',
                            id: 'pl_no',
                            value: pl_no,
                            readOnly: false,
                            allowBlank: true,
                            anchor: '-5' // anchor width by
                                // percentage
                        }
                        /*
                         * , { x:5, y: 21 + 8*lineGap, xtype:
                         * 'filefield', id: 'form-file',
                         * emptyText: panelSRO1149, fieldLabel:
                         * panelSRO1150, name: 'photo-path',
                         * buttonText: '', buttonConfig: {
                         * iconCls: 'upload-icon' }, anchor:
                         * '-5' // anchor width by percentage }
                         */
                        , {
                            xtype: 'fieldset',
                            x: 5,
                            y: 40 + 10 * lineGap,
                            border: true,
                            // style: 'border-width: 0px',
                            title: panelSRO1174,
                            collapsible: false,
                            defaults: {
                                labelWidth: 40,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {
                                        top: 0,
                                        right: 5,
                                        bottom: 0,
                                        left: 0
                                    }
                                }
                            },
                            items: [

                                {
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    defaults: {
                                        hideLabel: true
                                    },
                                    items: [{
                                            xtype: 'displayfield',
                                            value: ' ' + panelSRO1186 + ':'
                                        }, {
                                            xtype: 'numberfield',
                                            minValue: 0,
                                            width: 70,
                                            name: 'quan',
                                            value: quan,
                                            fieldLabel: getColName('quan'),
                                            readOnly: false,
                                            allowBlank: true,
                                            margins: '0'
                                        }
                                        // ,{
                                        // xtype: 'displayfield',
                                        // value:
                                        // '&nbsp;&nbsp;'+panelSRO1187+':'
                                        // }, {
                                        // //the width of this field in the
                                        // HBox layout is set directly
                                        // //the other 2 items are given
                                        // flex: 1, so will share the rest
                                        // of the space
                                        // width: 80,
                                        // id: 'unit_code',
                                        // name: 'unit_code',
                                        // value: unit_code,
                                        // xtype: 'combo',
                                        // mode: 'local',
                                        // editable: false,
                                        // allowBlank: true,
                                        // queryMode: 'remote',
                                        // displayField: 'codeName',
                                        // valueField: 'codeName',
                                        // value: 'PC',
                                        // triggerAction: 'all',
                                        // fieldLabel:
                                        // getColName('unit_code'),
                                        // // displayField: 'name',
                                        // // valueField: 'value',
                                        // // queryMode: 'local',
                                        // store: commonUnitStore,
                                        // listConfig:{
                                        // getInnerTpl: function(){
                                        // return '<div
                                        // data-qtip="{systemCode}">{codeName}</div>';
                                        // }
                                        // },
                                        // listeners: {
                                        // select: function (combo, record)
                                        // {
                                        // console_log('Selected Value : ' +
                                        // combo.getValue());
                                        // var systemCode =
                                        // record[0].get('systemCode');
                                        // var codeNameEn =
                                        // record[0].get('codeNameEn');
                                        // var codeName =
                                        // record[0].get('codeName');
                                        // console_log('systemCode : ' +
                                        // systemCode
                                        // + ', codeNameEn=' + codeNameEn
                                        // + ', codeName=' + codeName );
                                        // }
                                        // }
                                        // },
                                        // {
                                        // xtype: 'displayfield',
                                        // value: ' '+panelSRO1188+':'
                                        // },
                                        // {
                                        // xtype: 'numberfield',
                                        // minValue: 0,
                                        // flex: 1,
                                        // name : 'sales_price',
                                        // id : 'sales_price',
                                        // value: sales_price,
                                        // fieldLabel:
                                        // getColName('sales_price'),
                                        // allowBlank: true,
                                        // margins: '0'
                                        // }, {
                                        // //the width of this field in the
                                        // HBox layout is set directly
                                        // //the other 2 items are given
                                        // flex: 1, so will share the rest
                                        // of the space
                                        // width: 80,
                                        // id: 'currency',
                                        // name: 'currency',
                                        // value: currency,
                                        // xtype: 'combo',
                                        // mode: 'local',
                                        // editable: false,
                                        // allowBlank: true,
                                        // queryMode: 'remote',
                                        // displayField: 'codeName',
                                        // valueField: 'codeName',
                                        // value: 'RMB',
                                        // triggerAction: 'all',
                                        // fieldLabel:
                                        // getColName('currency'),
                                        // // displayField: 'name',
                                        // // valueField: 'value',
                                        // // queryMode: 'local',
                                        // store: commonCurrencyStore,
                                        // listConfig:{
                                        // getInnerTpl: function(){
                                        // return '<div
                                        // data-qtip="{systemCode}">{codeName}</div>';
                                        // }
                                        // },
                                        // listeners: {
                                        // select: function (combo, record)
                                        // {
                                        // console_log('Selected Value : ' +
                                        // combo.getValue());
                                        // var systemCode =
                                        // record[0].get('systemCode');
                                        // var codeNameEn =
                                        // record[0].get('codeNameEn');
                                        // var codeName =
                                        // record[0].get('codeName');
                                        // console_log('systemCode : ' +
                                        // systemCode
                                        // + ', codeNameEn=' + codeNameEn
                                        // + ', codeName=' + codeName );
                                        // }
                                        // }
                                        // }
                                    ]
                                }
                            ]
                        }
                    ]
                });
    }
    return form;
}

//
// var viewHandler = function() {
// var rec = grid.getSelectionModel().getSelection()[0];
// 	
// var unique_uid = rec.get('unique_uid');
// var unique_id = rec.get('unique_id');
// //alert(unique_uid);
// PartLine.load(unique_uid ,{
// success: function(partline) {
// uploadStore = getUploadStore(unique_uid);
// uploadStore.load(function() {
// console_log('uploadStore.load ok');
// console_log(uploadStore);
// uploadStore.each(function(record){
// console_log(record.get('object_name'));
// });
// uploadPanel = Ext.create('Ext.ux.multiupload.Panel', {
// frame: true,
// store: uploadStore,
// mode: 'VIEW',
// groupUid: unique_id,
// width: 180,
// height: 80,
// x: 0,
// y: 5,
// uploadConfig: {
// uploadUrl: CONTEXT_PATH + '/uploader.do?method=upload',
// maxFileSize: 4000 * 1024 * 1024,
// maxQueueLength: 50
// }
// });
// var win = Ext.create('ModalWindow', {
// title: CMD_VIEW + ' :: ' + /*(G)*/vCUR_MENU_NAME,
// width: 500,
// height: 380,
// minWidth: 250,
// minHeight: 180,
// layout: 'fit',
// plain:true,
// items: createViewForm(partline, uploadPanel),
// buttons: [{
// text: CMD_OK,
// handler: function(){
// if(win)
// {
// if(uploadPanel!=null) {
// uploadPanel.destroy();
// }
// win.close();
// }
// }
// }]
// });
// //store.load(function() {});
// //win.show(this, function() {
// win.show();
// });
// }//endofsuccess
// });//emdofload
// };

var addElecHandler = function() {
    var rec = grid.getSelectionModel().getSelection()[0];
    var unique_uid = rec.get('unique_uid');
    var standard_flag = rec.get('standard_flag');
    if (standard_flag == 'E') {
        Ext.MessageBox.alert(error_msg_prompt,
            'Electrod can not be a parent of a Electrod.');
        return;
    }

    PartLine.load(unique_uid, {
        success: function(partline) {

                var unique_uid = partline.get('unique_uid');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addElectrod',
                    params: {
                        unique_uid: unique_uid
                    },
                    success: function(result, request) {
                        store.load(function() {});
                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax

            } // endofsuccess
    }); // emdofload
};
var editHandler = function() {
    var rec = grid.getSelectionModel().getSelection()[0];
    var unique_uid = rec.get('unique_uid');
    var sg_code = rec.get('sg_code');
    PartLine
        .load(
            unique_uid, {
                success: function(partline) {
                        var height = 0;
                        if (sg_code == 'STD') {
                            height = 630;
                        } else {
                            height = 400;
                        }
                        var win = Ext
                            .create(
                                'ModalWindow', {
                                    title: CMD_MODIFY + ' :: ' + /* (G) */ vCUR_MENU_NAME,
                                    width: 700,
                                    height: height,
                                    minWidth: 250,
                                    minHeight: 180,
                                    layout: 'fit',
                                    plain: true,
                                    items: createEditForm(partline),
                                    buttons: [{
                                        text: CMD_OK,
                                        handler: function() {
                                            Ext
                                                .getCmp(
                                                    'request_comment')
                                                .setValue(
                                                    Ext
                                                    .getCmp(
                                                        'reference1')
                                                    .getValue() + '|' + Ext
                                                    .getCmp(
                                                        'reference2')
                                                    .getValue());
                                            var form = Ext
                                                .getCmp(
                                                    'formPanel')
                                                .getForm();
                                            if (form
                                                .isValid()) {
                                                var val = form
                                                    .getValues(false);
                                                console_info(Ext.JSON
                                                    .encode(val));
                                                val["file_itemcode"] = /* (G) */ vFILE_ITEM_CODE;
                                                console_info(Ext.JSON
                                                    .encode(val));
                                                var partline = Ext.ModelManager
                                                    .create(
                                                        val,
                                                        'PartLine');
                                                // var
                                                // enValue =
                                                // Ext.JSON.encode(srcahd);
                                                // console_info(enValue);
                                                // 저장 수정
                                                partline
                                                    .save({
                                                        success: function() {
                                                            // console_log('updated');
                                                            if (win) {
                                                                win
                                                                    .close();
                                                                store
                                                                    .load(function() {});
                                                            }
                                                        }
                                                    });

                                                if (win) {
                                                    win
                                                        .close();
                                                    // lfn_gotoHome();
                                                }
                                            } else {
                                                Ext.MessageBox
                                                    .alert(
                                                        error_msg_prompt,
                                                        error_msg_content);
                                            }
                                        }
                                    }, {
                                        text: CMD_CANCEL,
                                        handler: function() {
                                            if (win) {
                                                win.close();
                                            }
                                            // lfn_gotoHome();
                                        }
                                    }]
                                });
                        win.show();
                        // endofwin
                    } // endofsuccess
            }); // emdofload
};

var searchAction = Ext.create('Ext.Action', {
    itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false,
    handler: searchHandler
});

var editAction = Ext.create('Ext.Action', {
    itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true,
    handler: editHandler
});

/*
 * var addElecAction = Ext.create('Ext.Action', { itemId: 'addElecButton',
 * iconCls: 'lightbulb_add', text: dbm1_add_electrode, disabled: true , handler:
 * addElecHandler });
 */

function Item_code_dash(item_code) {
    return item_code.substring(0, 5) + "-" + item_code.substring(5, 9) + "-" + item_code.substring(9, 12);
}

var PmaterialStore = new Ext.create('Ext.data.Store', {
    // type: 'calss_code1',
    fields: [{
        name: 'parent_class_code',
        type: "string"
    }, {
        name: 'class_name',
        type: "string"
    }, {
        name: 'class_code_full',
        type: "string"
    }, {
        name: 'level',
        type: "string"
    }],
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/design/class.do?method=read',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        },
        extraParams: {
            level: '',
            parent_class_code: ''
        },
        autoLoad: true
    }
    // listeners: {
    // load: function(store, records, successful,operation, options) {
    //
    // }
    //   
    // }

});

var CmaterialStore = new Ext.create('Ext.data.Store', {

    fields: [{
        name: 'parent_class_code',
        type: "string"
    }, {
        name: 'class_name',
        type: "string"
    }, {
        name: 'class_code_full',
        type: "string"
    }],
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/design/class.do?method=read',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        },
        extraParams: {
            level: '',
            parent_class_code: ''
        },
        autoLoad: true
    }
});

// *****************************MODEL**************************/

Ext.define('PartLine', {
    extend: 'Ext.data.Model',
    fields: /* (G) */ vCENTER_FIELDS,
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/design/bom.do?method=read&menu_code=DBM1',
            /*
             * 1recoed,
             * search
             * by
             * cond,
             * search
             */
            create: CONTEXT_PATH + '/design/bom.do?method=create',
            /*
             * create
             * record,
             * update
             */
            update: CONTEXT_PATH + '/design/bom.do?method=update',
            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy' /* delete */
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});

Ext.define('Processing', {
    extend: 'Ext.data.Model',
    fields: /* (G) */ vCENTER_FIELDS,
    proxy: {
        type: 'ajax',
        api: {
            create: CONTEXT_PATH + '/production/pcsrequest.do?method=createPR'
                /*
                 * create
                 * record,
                 * update
                 */
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});

Ext.define('RtgAst', {
    extend: 'Ext.data.Model',
    fields: /* (G) */ vCENTER_FIELDS,
    proxy: {
        type: 'ajax',
        api: {
            create: CONTEXT_PATH + '/design/bom.do?method=createPurchasing'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});
// 엑셀추가
Ext.define('NxExcel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'file_itemcode',
        type: "string"
    }, {
        name: 'parent',
        type: "Long"
    }, {
        name: 'ac_uid',
        type: "Long"
    }, {
        name: 'menu',
        type: "string"
    }, {
        name: 'pj_code',
        type: "string"
    }, {
        name: 'coord_key2',
        type: "Long"
    }],
    proxy: {
        type: 'ajax',
        api: {
            create: CONTEXT_PATH + '/design/upload.do?method=excelBom'
                /*
                 * 1recoed,
                 * search
                 * by
                 * cond,
                 * search
                 */
                // create: CONTEXT_PATH + '/design/upload.do?method=excelStand' /*create
                // record, update*/
        },
        /*
         * reader: { type: 'json', root: 'datas', totalProperty: 'count',
         * successProperty: 'success' },
         */
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});

function deleteConfirm(btn) {

    var selections = grid.getSelectionModel().getSelection();

    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;

        if (result == 'yes') {
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];

                var unique_uid = rec.get('unique_uid');
                var approve = rec.get('reserved_varchar2');

                if (approve != 'Y') {
                    var partline = Ext.ModelManager.create({
                        unique_uid: unique_uid
                    }, 'PartLine');

                    partline.destroy({
                        success: function() {}
                    });
                    count++;
                }
            }
            Ext.MessageBox.alert('Check', 'Delete count : ' + count);
            grid.store.remove(selections);
        }
    }
};

function purchase_requestConfirm(btn) {

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {

        var result = MessageBox.msg('{0}', btn);
        if (result == 'yes') {

            // 선택된 셀 갯수만큼 정보를 받아 unique_ids 에 저장한다.
            var unique_ids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var unique_uid = rec.get('unique_uid');
                var approve = rec.get('reserved_varchar2');
                var mp_status = rec.get('status_full');
                var standard_flag = rec.get('standard_flag');
                var status = rec.get('status');
                // 플래그가 K 이고 스텟이 BM 일 때
                if (standard_flag == 'K' && status == 'BM') {
                    unique_ids.push(unique_uid);
                }
            } // enoffor
            // log 창에 unique_ids 를 찍는다.
            console_log('unique_ids : ');
            console_log(unique_ids);

            // createPR 로 넘김(PcsRequest 컨트롤러로)
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/pcsrequest.do?method=createPR',
                params: {
                    unique_uid: unique_ids,
                    parent: selectedAssyUid,
                    division: 'purchase',
                    pjUid: selectedMoldUid
                },
                success: function(result, request) {
                    var result = result.responseText;
                    console_log('result:' + result);
                    if (result != '') {
                        Ext.MessageBox.alert('Check', result);
                        store.load(function() {});
                    } else {
                        Ext.MessageBox.alert('Check',
                            'Did not request anything!');
                    }
                },
                failure: extjsUtil.failureMessage
            });

        } // endofif yes
    } // endofselection
};

function process_requestConfirm(btn) {

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if (result == 'yes') {
            var unique_ids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var approve = rec.get('reserved_varchar2');
                var unique_uid = rec.get('unique_uid');
                var standard_flag = rec.get('standard_flag');
                var status = rec.get('status');
                var mp_status = rec.get('status_full');
                if ( /* approve == 'N' && */ standard_flag == 'M' && status == 'BM') {
                    unique_ids.push(unique_uid);
                }
                if ( /* approve == 'Y' && mp_status == 'PGR' && */ status == 'BM') {
                    unique_ids.push(unique_uid);
                }
            } // enoffor
            console_log('unique_ids : ');
            console_log(unique_ids);
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/pcsrequest.do?method=createPR',
                params: {
                    unique_uid: unique_ids,
                    parent: selectedAssyUid,
                    division: 'process',
                    pjUid: selectedMoldUid
                },
                success: function(result, request) {
                    var result = result.responseText;
                    console_log('result:' + result);
                    if (result != '') {
                        Ext.MessageBox.alert('Check', result);
                        store.load(function() {});
                    } else {
                        Ext.MessageBox.alert('Check',
                            'Did not request anything!');
                    }
                },
                failure: extjsUtil.failureMessage
            });
            //    		
            // console_log(unique_ids);
            // var process = Ext.ModelManager.create({
            // unique_uid : unique_ids,
            // division : 'process'
            // }, 'Processing');
            //    		
            // process.save( {
            // success: function(result, request) {
            // var result = result.responseText;
            // console_log('result:' + result);
            // Ext.MessageBox.alert('Check',result);
            // store.load(function() {});
            // // alert('process');
            // }//endofsuccess
            // });//endofsave

        } // endofif yes

    } // endofselection
};

function pp_requestConfirm(btn) {

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {

        var result = MessageBox.msg('{0}', btn);
        if (result == 'yes') {

            var unique_ids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var unique_uid = rec.get('unique_uid');
                var approve = rec.get('reserved_varchar2');
                var mp_status = rec.get('status_full');
                var standard_flag = rec.get('standard_flag');
                var status = rec.get('status');
                if (standard_flag == 'R' && status == 'BM') {
                    unique_ids.push(unique_uid);
                }
            } // enoffor
            console_log('unique_ids : ');
            console_log(unique_ids);
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/pcsrequest.do?method=createPR',
                params: {
                    unique_uid: unique_ids,
                    parent: selectedAssyUid,
                    division: 'pp',
                    pjUid: selectedMoldUid
                },
                success: function(result, request) {
                    var result = result.responseText;
                    console_log('result:' + result);
                    if (result != '') {
                        Ext.MessageBox.alert('Check', result);
                        store.load(function() {});
                    } else {
                        Ext.MessageBox.alert('Check',
                            'Did not request anything!');
                    }
                },
                failure: extjsUtil.failureMessage
            });
        } // endofif yes
    } // endofselection
};

// standard_flag = S
function send_requestConfirm(btn) {

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if (result == 'yes') {
            var unique_ids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var approve = rec.get('reserved_varchar2');
                var unique_uid = rec.get('unique_uid');
                var standard_flag = rec.get('standard_flag');
                var status = rec.get('status');
                if (standard_flag == 'S' && status == 'BM') {
                    unique_ids.push(unique_uid);
                }
            } // enoffor
            console_log('unique_ids : ');
            console_log(unique_ids);
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/pcsrequest.do?method=createPR',
                params: {
                    unique_uid: unique_ids,
                    parent: selectedAssyUid,
                    division: 'send',
                    pjUid: selectedMoldUid
                },
                success: function(result, request) {
                    var result = result.responseText;
                    console_log('result:' + result);
                    if (result != '') {
                        Ext.MessageBox.alert('Check', result);
                        store.load(function() {});
                    } else {
                        Ext.MessageBox.alert('Check',
                            'Did not request anything!');
                    }
                },
                failure: extjsUtil.failureMessage
            });
        } // endofif yes
    } // endofselection
};

// Define Remove Action
var removeAction = Ext.create('Ext.Action', {
    itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
        Ext.MessageBox.show({
            title: delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            // animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

// Define process_request Action
var process_requestAction = Ext.create('Ext.Action', {
    itemId: 'process_requestButton',
    iconCls: 'production',
    text: PROCESS_REQUEST,
    disabled: false,
    handler: function(widget, event) {
        Ext.MessageBox.show({
            title: delete_msg_title,
            msg: epc1_process_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: process_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var prWin = null;
var unique_uid = new Array();
// 구매요청
var purchase_requestAction = Ext.create('Ext.Action', {
    itemId: 'purchaseButton',
    iconCls: 'my_purchase',
    text: PURCHASE_REQUEST,
    disabled: false,
    handler: function(widget, event) {
        Ext.MessageBox.show({
            title: delete_msg_title,
            msg: epc1_purchase_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: purchase_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});
// purchase & process //구매,가공
var pp_requestAction = Ext.create('Ext.Action', {
    itemId: 'pp_requestButton',
    iconCls: 'purchaseAndprocess',
    text: dbm1_pp_request,
    disabled: true,
    handler: function(widget, event) {
        Ext.MessageBox.show({
            title: delete_msg_title,
            msg: epc1_purchase_process_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: pp_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var send_requestAction = Ext.create('Ext.Action', {
    itemId: 'Sbutton',
    iconCls: 'emtyprocess',
    text: dbm1_send,
    disabled: true,
    handler: function(widget, event) {
        Ext.MessageBox.show({
            title: delete_msg_title,
            msg: epc1_getwarehouse_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: send_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

// var S_button = Ext.create('Ext.Action', {
//	
// itemId: 'purchaseButton',
// iconCls:'my_purchase',
// text: PURCHASE_REQUEST,
// disabled: true,
// handler: function(widget, event) {
// var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
//    	
// var lineGap = 30;
// // var rec = grid.getSelectionModel().getSelection()[0];
// var selections = grid.getSelectionModel().getSelection();
// for(var i=0; i< selections.length; i++) {
// var rec = selections[i];
// unique_uid[i] = rec.get('unique_uid');
// // alert(unique_uid[i]);
// }
// var item_name = rec.get('item_name');
// var item_code = rec.get('item_code');
// // var sales_price = selections.get('sales_price');
// // var quan = selections.get('quan');
// // var ac_uid = selections.get('ac_uid');
//    	
// var rtgapp_store = new Ext.data.Store({
// pageSize: getPageSize(),
// model: 'RtgApp'
// //remoteSort: true,
// // sorters: [{
// // property: 'seq',
// // direction: 'ASC'
// // }]
// });
//    	
// function deleteRtgappConfirm(btn){
//
// var selections = agrid.getSelectionModel().getSelection();
// if (selections) {
// var result = MessageBox.msg('{0}', btn);
// if(result=='yes') {
// for(var i=0; i< selections.length; i++) {
// var rec = agrid.getSelectionModel().getSelection()[i];
// var unique_id = rec.get('unique_id');
// var rtgapp = Ext.ModelManager.create({
// unique_id : unique_id
// }, 'RtgApp');
//    	        		
// rtgapp.destroy( {
// success: function() {}
// });
// }
// agrid.store.remove(selections);
// }
// }
// };
//    	
// var removeRtgapp = Ext.create('Ext.Action', {
// itemId: 'removeButton',
// iconCls: 'remove',
// text: CMD_DELETE,
// disabled: true,
// handler: function(widget, event) {
// Ext.MessageBox.show({
// title:delete_msg_title,
// msg: delete_msg_content,
// buttons: Ext.MessageBox.YESNO,
// fn: deleteRtgappConfirm,
// //animateTarget: 'mb4',
// icon: Ext.MessageBox.QUESTION
// });
// }
// });
//    	
// var updown =
// {
// text: Position,
// menuDisabled: true,
// sortable: false,
// xtype: 'actioncolumn',
// width: 60,
// items: [{
// icon : CONTEXT_PATH + '/extjs/shared/icons/fam/grid_up.png', // Use a URL in
// the icon config
// tooltip: 'Up',
// handler: function(agridV, rowIndex, colIndex) {
//
//
// var record = agrid.getStore().getAt(rowIndex);
// console_log(record);
// var unique_id = record.get('unique_id');
// console_log(unique_id);
// var direcition = -15;
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
// params:{
// direcition:direcition,
// // modifyIno: str,
// unique_id:unique_id
// },
// success : function(result, request) {
// rtgapp_store.load(function() {});
// }
// });
//
//
// // for (var i = 0; i <agrid.store.data.items.length; i++)
// // {
// // var record = agrid.store.data.items [i];
// ////
// // if (i==rowIndex) {
// // rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
// // var obj = {};
// // obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
// // obj['gubun'] = record.get('gubun');
// // obj['owner'] = record.get('owner');
// // obj['change_type'] = record.get('change_type');
// // obj['app_type'] = record.get('app_type');
// // obj['usrast_unique_id'] = record.get('usrast_unique_id');
// // obj['seq'] = record.get('seq');
// // obj['updown'] = -14;
// //
// // modifiend.push(obj);
// // }
//    	              
// // if(modifiend.length>0) {
// //
// // console_log(modifiend);
// // var str = Ext.encode(modifiend);
// // console_log(str);
// //
//
// // }
//    	            	
// }
//    				 	
//
// // }
//
// },{
// icon : CONTEXT_PATH + '/extjs/shared/icons/fam/grid_down.png', // Use a URL
// in the icon config
// tooltip: 'Down',
// handler: function(agridV, rowIndex, colIndex) {
//
// var record = agrid.getStore().getAt(rowIndex);
// console_log(record);
// var unique_id = record.get('unique_id');
// console_log(unique_id);
// var direcition = 15;
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
// params:{
// direcition:direcition,
// // modifyIno: str,
// unique_id:unique_id
// },
// success : function(result, request) {
// rtgapp_store.load(function() {});
// }
// });
//
// //
// // for (var i = 0; i <agrid.store.data.items.length; i++)
// // {
// // var record = agrid.store.data.items [i];
// ////
// // if (i==rowIndex) {
// // rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
// //// var obj = {};
// //// obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
// //// obj['gubun'] = record.get('gubun');
// //// obj['owner'] = record.get('owner');
// //// obj['change_type'] = record.get('change_type');
// //// obj['app_type'] = record.get('app_type');
// //// obj['usrast_unique_id'] = record.get('usrast_unique_id');
// //// obj['seq'] = record.get('seq');
// //// obj['updown'] = 16;
// ////
// //// modifiend.push(obj);
// // }
// //
// // if(modifiend.length>0) {
// //
// // console_log(modifiend);
// // var str = Ext.encode(modifiend);
// // console_log(str);
// //
// // Ext.Ajax.request({
// // url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
// // params:{
// // direcition:direcition,
// //// modifyIno: str,
// // unique_id:unique_id
// // },
// // success : function(result, request) {
// // rtgapp_store.load(function() {});
// // }
// // });
// //// }
// //
// // }
// //
//
// }
//
// }]
// };
//    	
// var tempColumn = [];
//    	
// tempColumn.push(updown);
//    	
// for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
// tempColumn.push(vCENTER_COLUMN_SUB[i]);
// }
//
// //
// // if(upno == true){
// // /*(G)*/vCENTER_COLUMN_SUB.splice(0, 0, updown);
// // upno=false;
// // }
//    	
// rtgapp_store.load(function() {
//    		
//    		
// Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
//                
// var dataIndex = columnObj["dataIndex" ];
// // console_log(dataIndex);
// //
// // var columnObj = {};
// // columnObj["header"] = inColumn["text"];
// //// columnObj["width"] = inColumn["width"];
// //// columnObj["sortable"] = inColumn["sortable"];
// // columnObj["dataIndex"] = dataIndex;
// columnObj[ "flex" ] =1;
//               
// if (value!="W" ) {
//                      
// if ('gubun' == dataIndex) {
//                             
// var combo = null ;
// // the renderer. You should define it within a namespace
// var comboBoxRenderer = function (value, p, record) {
//                                    
// // console_log('##########3' + value);
// // console_log(p);
// // console_log(record);
// // console_log(combo);
//                                    
// if (value=='W' ) {
//
// } else {
// console_log('combo.valueField = ' + combo.valueField + ', value=' + value);
// console_log(combo.store);
// var idx = combo.store.find(combo.valueField, value);
// console_log(idx);
// var rec = combo.store.getAt(idx);
// console_log(rec);
// return (rec === null ? '' : rec.get(combo.displayField) );
// }
//
// };
//                             
// combo = new Ext.form.field.ComboBox({
// typeAhead: true ,
// triggerAction: 'all',
// selectOnTab: true ,
// mode: 'local',
// queryMode: 'remote',
// editable: false ,
// allowBlank: false ,
// displayField: 'codeName' ,
// valueField: 'systemCode' ,
// store: routeGubunTypeStore,
// listClass: 'x-combo-list-small' ,
// listeners: { }
// });
// columnObj[ "editor" ] = combo;
// // columnObj["renderer"] = comboBoxRenderer;
// columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store)
// {
// p.tdAttr = 'style="background-color: #FFE4E4;"';
// return value;
// };
//                      
//                
// }
//                      
// }
//
// });
//
//    		
// //grid create
// agrid = Ext.create('Ext.grid.Panel', {
// title: routing_path,
// // layout: 'form',
// store: rtgapp_store,
// layout: 'fit',
// columns : tempColumn,
// plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
// clicksToEdit: 1
// })],
// // viewConfig: {
// // stripeRows: true,
// // enableTextSelection: true,
// // listeners: {
// // itemcontextmenu: function(view, rec, node, index, e) {
// // e.stopEvent();
// // contextMenu.showAt(e.getXY());
// // return false;
// // }
// //
// // }
// // },
// //// width: 700,
// // height: 100,
// // autoHeight: true,
// // autoWidth: true,
// border: false,
// multiSelect: true,
// frame: false
// // fieldDefaults: {
// // labelAlign: 'middle',
// // msgTarget: 'side'
// // },
// // defaults: {
// // anchor: '100%',
// // labelWidth: 100
// // }
// ,
// dockedItems: [{
// xtype: 'toolbar',
// items: [{
// fieldLabel: dbm1_array_add,
// labelWidth: 42,
// id :'user_name',
// name : 'user_name',
// xtype: 'combo',
// fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// store: userStore,
// labelSeparator: ':',
// emptyText: dbm1_name_input,
// displayField: 'user_name',
// valueField: 'unique_id',
// sortInfo: { field: 'user_name', direction: 'ASC' },
// typeAhead: false,
// hideLabel: true,
// minChars: 2,
// width: 230,
// listConfig:{
// loadingText: 'Searching...',
// emptyText: 'No matching posts found.',
// getInnerTpl: function() {
// return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
// }
// },
// listeners: {
// select: function (combo, record) {
//    			        		
// console_log('Selected Value : ' + record[0].get('unique_id'));
//    			        		
// var unique_id = record[0].get('unique_id');
// var user_id = record[0].get('user_id');
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
// params:{
// useruid : unique_id,
// userid : user_id
// ,gubun : 'D'
// },
// success : function(result, request) {
// var result = result.responseText;
// console_log('result:' + result);
// if(result == 'false'){
// Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
// }else{
// rtgapp_store.load(function() {});
// }
// },
// failure: extjsUtil.failureMessage
// });
// }//endofselect
// }
// },
// '->',removeRtgapp,
//			        
// {
// text: panelSRO1133,
// iconCls: 'save',
// disabled: false,
// handler: function ()
// {
// /* var recordList = '';
// var record = null;
// */
// var modifiend =[];
// var rec = grid.getSelectionModel().getSelection()[0];
// var unique_id = rec.get('unique_id');
//
//
// for (var i = 0; i <agrid.store.data.items.length; i++)
// {
// var record = agrid.store.data.items [i];
//	                                
// if (record.dirty) {
// rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
// console_log(record);
// var obj = {};
//	                                   	
// obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
// obj['gubun'] = record.get('gubun');
// obj['owner'] = record.get('owner');
// obj['change_type'] = record.get('change_type');
// obj['app_type'] = record.get('app_type');
// obj['usrast_unique_id'] = record.get('usrast_unique_id');
// obj['seq'] = record.get('seq');
// obj['updown'] = 0;
// // obj['dept_name'] = record.get('description');
// // obj['email'] = record.get('description');
//	                                   	
//	                                   	
// modifiend.push(obj);
// /*
// //저장 수정
// record.save(uidList,{
// success : function() {
// storePcsStd.load(function() {});
// }
// });
// */
// }
// /* if(recordList==''){
// recordList = record;
// }else{
// recordList = recordList + ';' + recordList;
// }
// */
//
//	                               
// }
//                              
// if(modifiend.length>0) {
//                            	
// console_log(modifiend);
// var str = Ext.encode(modifiend);
// console_log(str);
//                            	  
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=modifyRtgapp',
// params:{
// modifyIno: str,
// srcahd_uid:unique_id
// },
// success : function(result, request) {
// rtgapp_store.load(function() {});
// }
// });
// }
//                              
// // storePcsStd.getProxy().setExtraParam('recordList', recordList);
// // record.save(/*uidList,*/{
// // success : function() {
// // storePcsStd.load(function() {});
// // }
// // });
// /* for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
// {
// var record = gridPcsStd.store.data.items [i];
// if (record.dirty) {
// storePcsStd.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
// console_log(record);
// //저장 수정
// record.save(uidList,{
// success : function() {
// storePcsStd.load(function() {});
// }
// });
// }
//	                               
// }*/
//
// }
// // ,
// // listeners: {
// // console_log('');
// // beforeedit: function(editor, e) {
// // var btn = e.gridPcsStd.down('button');
// // btn.enable();
// // btn.editor = editor;
// // },//endofbreforeedit
// // edit: function(editor, e) {
// // var btn = e.gridPcsStd.down('button');
// // e.gridPcsStd.store.sync();
// // btn.disable();
// // btn.editor.cancelEdit();
// // btn.editor = null;
// // }//endofedit
// // }//endoflistener
// }
// ]//endofitems
// }] //endofdockeditems
// }); //endof Ext.create('Ext.grid.Panel',
//    		
// agrid.getSelectionModel().on({
// selectionchange: function(sm, selections) {
// if (selections.length) {
// if(fPERM_DISABLING_Complished()==true) {
// removeRtgapp.disable();
// }else{
// removeRtgapp.enable();
// }
// } else {
// if(fPERM_DISABLING_Complished()==true) {
// collapseProperty();//uncheck no displayProperty
// removeRtgapp.disable();
// }else{
// collapseProperty();//uncheck no displayProperty
// removeRtgapp.disable();
// }
// }
// }
// });
//    		
// //form create
// var form = Ext.create('Ext.form.Panel', {
// id : 'formPanel',
// xtype: 'form',
// // layout: 'absolute',
// frame: false,
// border: false,
// bodyPadding: 15,
// region: 'center',
// defaults: {
// anchor: '100%',
// allowBlank: false,
// msgTarget: 'side',
// labelWidth: 60
// },
// items: [
// new Ext.form.Hidden({
// id: 'hid_userlist_role',
// name: 'hid_userlist_role'
// }),
// new Ext.form.Hidden({
// id: 'hid_userlist',
// name: 'hid_userlist'
// }),
// // new Ext.form.Hidden({
// // id: 'sales_price',
// // name: 'sales_price',
// // value: sales_price
// // }),
// new Ext.form.Hidden({
// id: 'unique_uid',
// name: 'unique_uid',
// value: unique_uid
// }),
// // new Ext.form.Hidden({
// // id: 'unique_id',
// // name: 'unique_id',
// // value: unique_id
// // }),
// // new Ext.form.Hidden({
// // id: 'ac_uid',
// // name: 'ac_uid',
// // value: ac_uid
// // }),
// new Ext.form.Hidden({
// id: 'req_date',
// name: 'req_date'
// }),
// // new Ext.form.Hidden({
// // id: 'quan',
// // name: 'quan',
// // value: quan
// // }),
// new Ext.form.Hidden({
// id: 'supplier_uid',
// name: 'supplier_uid'
// }),
// new Ext.form.Hidden({
// id: 'supplier_name',
// name: 'supplier_name'
// }),
// agrid,
//                	
// {
// xtype: 'component',
// html: '<br/><hr/><br/>',
// anchor: '100%'
// },
//	                
// {
// xtype: 'textfield',
// // x: 5,
// // y: 3 + 1*lineGap,
// fieldLabel: dbm1_txt_name,
// id: 'txt_name',
// name: 'txt_name',
// value: '[PR]' + item_code_dash(item_code),
// anchor: '100%'
// },{
// xtype: 'textarea',
// // x: 5,
// // y: 3 + 2*lineGap,
// fieldLabel: dbm1_txt_content,
// id: 'txt_content',
// name: 'txt_content',
// value: item_name+' 外',
// anchor: '100%'
// },{
// xtype: 'textarea',
// // x: 5,
// // y: 3 + 3*lineGap,
// fieldLabel: dbm1_req_info,
// id: 'req_info',
// name: 'req_info',
// anchor: '100%'
// },{
// xtype: 'datefield',
// id: 'request_date',
// name: 'request_date',
// fieldLabel: toolbar_pj_req_date,
// format: 'Y-m-d',
// submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
// dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
// // readOnly : true,
// value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
// anchor: '100%'
// }
// ]
// });//endof createform
//        	
// //window create
//
// prWin = Ext.create('ModalWindow', {
// title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
// width: 850,
// height: 500,
// //// minWidth: 250,
// //// minHeight: 180,
// // layout: {
// // type: 'fix',
// // padding: 5
// // },
// plain:true,
// items: [ form
// ],
// buttons: [{
// text: CMD_OK,
// handler: function(btn){
// var form = Ext.getCmp('formPanel').getForm();
// var selections = grid.getSelectionModel().getSelection();
// var aselections = agrid.getSelectionModel().getSelection();
// agrid.getSelectionModel().selectAll();
//                		
// if (aselections) {
// for(var i=0; i< aselections.length; i++) {
// var rec = agrid.getSelectionModel().getSelection()[i];
// ahid_userlist[i] = rec.get('usrast_unique_id');
// console_log("ahid_userlist : "+ahid_userlist);
// console_log("ahid_userlist_role : "+ahid_userlist);
// ahid_userlist_role[i] = rec.get('gubun');
// console_log("ahid_userlist_role"+ahid_userlist_role);
// }
// Ext.getCmp('hid_userlist').setValue(ahid_userlist);
// Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
// }
// if(form.isValid()){
// var val = form.getValues(false);
// // var purchasing = Ext.ModelManager.create(val, 'Purchasing');
// // for(var i=0; i< aselections.length; i++) {
// // var rec = selections[i];
// // var unique_id = rec.get('unique_id');
//                		
//                			
// // var selections = grid.getSelectionModel().getSelection();
// // if (selections) {
// // for(var i=0; i< selections.length; i++) {
// // var rec = selections[i];
// // var unique_uid = rec.get('unique_uid');
// // arrUid.push(unique_uid);
// // }
// // }
//                		    
// var rtgast = Ext.ModelManager.create(val, 'RtgAst');
//                	
// // rtgast.proxy.extraParams.unique_uid = arrUid;
// // console_log("arrUid = " + arrUid);
// // console_log(rtgast.proxy.extraParams.unique_uid);
// rtgast.save({
// success : function() {
// console_log('updated');
// if(prWin)
// {
// prWin.close();
// store.load(function() {});
// }
// }
// });
// }else {
// Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
// }
// }
// },{
// text: CMD_CANCEL,
// handler: function(){
// if(prWin) {prWin.close();} }
// }]
// });
// prWin.show();
// });//enof load
// }//endof handlwe
// });//endof define action

// Define Add Action
var comboClass1 = [];
var comboClass2 = [];
var Class_code = [];

var isAssFromMyPart = false;

// 표준품추가
var addAction = Ext
    .create(
        'Ext.Action', {
            iconCls: 'add',
            text: dbm1_standard_process,
            disabled: fPERM_DISABLING_Complished(),
            // disabled: true,
            handler: function(widget, event) {
                console_log(selectedAssyUid);
                // alert(selectedAssyUid);

                // 종전코드 사용.
                var myPartStore = Ext.create('Mplm.store.MyPartStore', {});

                var form = Ext
                    .create(
                        'Ext.form.Panel', {
                            id: 'formPanel',
                            // layout: 'absolute',
                            defaultType: 'textfield',
                            border: false,
                            bodyPadding: 15,
                            defaults: {
                                anchor: '100%',
                                allowBlank: false,
                                msgTarget: 'side',
                                labelWidth: 60,
                                margin: 5
                            },
                            items: [{
                                    xtype: 'container',
                                    flex: 1,
                                    layout: 'hbox',
                                    items: [{
                                            flex: 1,
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            mode: 'remote',
                                            editable: false,
                                            allowBlank: true,
                                            queryMode: 'remote',
                                            // emptyText:
                                            // dbm1_my_part,
                                            displayField: 'item_code',
                                            valueField: 'unique_id',
                                            triggerAction: 'all',
                                            // fieldLabel:
                                            // '部件查找',//getColName('image_path'),//dbm1_my_part,
                                            fieldLabel: dbm1_my_part,
                                            store: myPartStore,
                                            listConfig: {
                                                getInnerTpl: function() {
                                                    return '<div data-qtip="{unique_id}">[{item_code}]{item_name}|{specification}|{desription}|{mdel_no}|{comment}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function(
                                                    combo,
                                                    record) {
                                                    console_log('Selected Value : ' + combo
                                                        .getValue());
                                                    console_log('record: ');
                                                    console_log(record);

                                                    var comboVal = combo
                                                        .getValue();

                                                    if (comboVal != '-1') { // 선택한
                                                        // 경우
                                                        var selectedRecord = record[0];
                                                        setValueInputForm(selectedRecord);
                                                        isAssFromMyPart = true;

                                                    } else { // 선택해제
                                                        setValueInputForm(null);
                                                        isAssFromMyPart = false;

                                                    } // endofelse

                                                }
                                            }
                                        }, {
                                            xtype: 'textfield',
                                            width: 240,
                                            labelWidth: 60,
                                            labelAlign: 'right',
                                            // emptyText:
                                            // getColName('item_code'),
                                            name: 'item_code',
                                            id: 'item_code',
                                            fieldLabel: getColName('item_code'),
                                            readOnly: false,
                                            allowBlank: true
                                        }
                                        /*
                                         * , { text:
                                         * CMD_FIND,
                                         * xtype:
                                         * 'button' }, {
                                         * text:
                                         * CMD_INIT,
                                         * xtype:
                                         * 'button',
                                         * handler:
                                         * function(btn){
                                         * console_log(btn);
                                         *
                                         * Ext.getCmp('item_code').setValue('');
                                         * Ext.getCmp('description').setValue('');
                                         * Ext.getCmp('item_name').setValue('');
                                         * Ext.getCmp('maker_name').setValue('');
                                         * Ext.getCmp('model_no').setValue(''); } }
                                         */
                                    ]
                                }, {
                                    xtype: 'fieldset',
                                    // x: 5,
                                    // y: 3 + 1*lineGap,
                                    title: panelSRO1139 + panelSRO1144,
                                    collapsible: false,
                                    defaults: {
                                        labelWidth: 40,
                                        anchor: '100%',
                                        layout: {
                                            type: 'hbox',
                                            defaultMargins: {
                                                top: 0,
                                                right: 5,
                                                bottom: 0,
                                                left: 0
                                            }
                                        }
                                    },
                                    items: [

                                        {
                                            xtype: 'fieldcontainer',
                                            combineErrors: true,
                                            msgTarget: 'side',
                                            // fieldLabel:
                                            // panelSRO1144,
                                            defaults: {
                                                hideLabel: true
                                            },
                                            items: [

                                                {
                                                    fieldLabel: getColName('class_code'),
                                                    id: 'class_code1',
                                                    name: 'class_code1',
                                                    emptyText: dbm1_class_code1,
                                                    xtype: 'combo',
                                                    mode: 'local',
                                                    editable: false,
                                                    allowBlank: true,
                                                    queryMode: 'remote',
                                                    displayField: 'name',
                                                    valueField: 'value',
                                                    store: Ext
                                                        .create(
                                                            'Ext.data.Store', {
                                                                fields: [
                                                                    'name',
                                                                    'value'
                                                                ],
                                                                data: comboClass1
                                                            }),
                                                    triggerAction: 'all',
                                                    listeners: {
                                                        select: function(
                                                            combo,
                                                            record) {
                                                            CmaterialStore.proxy.extraParams.level = '2';
                                                            CmaterialStore.proxy.extraParams.parent_class_code = this
                                                                .getValue();

                                                            CmaterialStore
                                                                .load(function(
                                                                    records) {
                                                                    console_log("class_code1 :" + class_code1);
                                                                    console_log("class_code2 :" + class_code2);
                                                                    var obj2 = Ext
                                                                        .getCmp('class_code2');
                                                                    var obj3 = Ext
                                                                        .getCmp('pl_no');
                                                                    var obj4 = Ext
                                                                        .getCmp('item_name');
                                                                    var obj5 = Ext
                                                                        .getCmp('class_code');
                                                                    // obj2.reset();
                                                                    obj2
                                                                        .clearValue(); // text필드에
                                                                    // 있는
                                                                    // name
                                                                    // 삭제
                                                                    obj2.store
                                                                        .removeAll(); // class_code2필드에서
                                                                    // 보여지는
                                                                    // 값을
                                                                    // 삭제
                                                                    obj3
                                                                        .reset();
                                                                    obj4
                                                                        .reset();
                                                                    obj5
                                                                        .reset();

                                                                    for (var i = 0; i < records.length; i++) {
                                                                        var classObj = records[i];
                                                                        var class_code = classObj
                                                                            .get('class_code_full');
                                                                        var class_name = classObj
                                                                            .get('class_name');
                                                                        console_log(class_code + ':' + class_name);
                                                                        // var
                                                                        // obj
                                                                        // =
                                                                        // {};
                                                                        // obj['class_name']
                                                                        // =
                                                                        // '['
                                                                        // +
                                                                        // class_code
                                                                        // +
                                                                        // ']'
                                                                        // +
                                                                        // class_name;
                                                                        // obj['class_code_full']
                                                                        // =
                                                                        // class_code;
                                                                        // comboClass2.push(obj);
                                                                        obj2.store
                                                                            .add({
                                                                                class_name: '[' + class_code + ']' + class_name
                                                                                    // class_code_full:
                                                                                    // class_code
                                                                            });
                                                                    }
                                                                });
                                                        }
                                                    }
                                                }, {
                                                    fieldLabel: getColName('class_code'),
                                                    id: 'class_code2',
                                                    name: 'class_code2',
                                                    emptyText: dbm1_class_code2,
                                                    xtype: 'combo',
                                                    mode: 'local',
                                                    editable: false,
                                                    allowBlank: true,
                                                    // typeAhead:
                                                    // true,
                                                    // selectOnFocus:
                                                    // true,
                                                    // forceSelection:
                                                    // true,
                                                    triggerAction: 'all',
                                                    queryMode: 'local',
                                                    displayField: 'class_name',
                                                    // valueField:
                                                    // 'class_code_full',
                                                    // listConfig:{
                                                    // getInnerTpl:
                                                    // function(){
                                                    // return
                                                    // '<div>{class_name}</div>';
                                                    // }
                                                    // },
                                                    listeners: {
                                                        select: function(
                                                            combo,
                                                            record) {
                                                            console_log("class_code1 :" + class_code1);
                                                            console_log("class_code2 :" + class_code2);
                                                            console_log('Selected Value : ' + combo.getValue());
                                                            Class_code = Ext.getCmp('class_code2').getValue();

                                                            var code = Class_code.substring(1,6);
                                                            var code5 = Class_code.substring(1,5);
                                                            var name = Class_code.substring(7,Class_code.length);
                                                            var name5 = Class_code.substring(6,Class_code.length);

                                                            if (Class_code.substring( 6, 7) == ']') {
                                                                Ext.getCmp('item_name').setValue(name);
                                                                Ext.getCmp('class_code').setValue(code);
                                                            } else {
                                                                Ext
                                                                    .getCmp(
                                                                        'item_name')
                                                                    .setValue(
                                                                        name5);
                                                                Ext
                                                                    .getCmp(
                                                                        'class_code')
                                                                    .setValue(
                                                                        code5);
                                                            }
                                                        }
                                                    }
                                                }, {
                                                    xtype: 'textfield',
                                                    flex: 1,
                                                    width: 70,
                                                    emptyText: getColName('class_code'),
                                                    name: 'class_code',
                                                    id: 'class_code',
                                                    fieldLabel: getColName('class_code'),
                                                    // displayField:
                                                    // 'class_code_full'
                                                    // ,
                                                    readOnly: false
                                                }
                                            ]
                                        }
                                    ]
                                }, {
                                    xtype: 'container',
                                    flex: 1,
                                    layout: 'hbox',
                                    items: [{
                                        xtype: 'textfield',
                                        flex: 1,
                                        labelWidth: 60,
                                        name: 'pl_no',
                                        id: 'pl_no',
                                        fieldLabel: getColName('pl_no'),
                                        allowBlank: true
                                    }, {
                                        xtype: 'numberfield',
                                        minValue: 0,
                                        width: 200,
                                        labelWidth: 60,
                                        labelAlign: 'right',
                                        name: 'quan',
                                        id: 'quan',
                                        fieldLabel: getColName('quan'),
                                        allowBlank: true,
                                        value: '1',
                                        minValue: '1',
                                        margins: '0'
                                    }]
                                }, {
                                    fieldLabel: getColName('specification'),
                                    name: 'specification',
                                    id: 'specification',
                                    allowBlank: true
                                }, {
                                    xtype: 'container',
                                    flex: 1,
                                    layout: 'hbox',
                                    items: [{
                                        xtype: 'textfield',
                                        flex: 1,
                                        labelWidth: 60,
                                        name: 'alter_reason',
                                        id: 'alter_reason',
                                        fieldLabel: getColName('alter_reason'),
                                        allowBlank: false
                                    }, {
                                        xtype: 'textfield',
                                        flex: 1,
                                        labelWidth: 60,
                                        name: 'image_no',
                                        id: 'image_no',
                                        fieldLabel: getColName('image_no')
                                    }]
                                }, {
                                    xtype: 'textfield',
                                    flex: 1,
                                    // emptyText:
                                    // getColName('item_name'),
                                    name: 'item_name',
                                    id: 'item_name',
                                    fieldLabel: getColName('item_name'),
                                    readOnly: false
                                },

                                { //구분콤보
                                    // x: 5,
                                    // y: 20 + 3*lineGap,
                                    // width: 80,
                                    id: 'standard_flag_disp',
                                    name: 'standard_flag_disp',
                                    xtype: 'combo',
                                    mode: 'local',
                                    editable: false,
                                    allowBlank: false,
                                    queryMode: 'remote',
                                    displayField: 'codeName',
                                    // valueField:
                                    // 'codeName',
                                    value: '',
                                    triggerAction: 'all',
                                    fieldLabel: getColName('standard_flag'),
                                    store: commonStandardStore,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(
                                            combo,
                                            record) {
                                            console_log('Selected Value : ' + combo
                                                .getValue());
                                            var systemCode = record[0]
                                                .get('systemCode');
                                            var codeNameEn = record[0]
                                                .get('codeNameEn');
                                            var codeName = record[0]
                                                .get('codeName');
                                            console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                            // systemCode =
                                            // codeName;
                                            Ext
                                                .getCmp(
                                                    'standard_flag')
                                                .setValue(
                                                    systemCode);
                                        }
                                    }
                                }, {
                                    fieldLabel: getColName('description'),
                                    name: 'description',
                                    id: 'description',
                                    allowBlank: true
                                }, {
                                    id: 'model_no',
                                    name: 'model_no',
                                    xtype: 'combo',
                                    mode: 'local',
                                    editable: false,
                                    allowBlank: true,
                                    queryMode: 'remote',
                                    displayField: 'codeName',
                                    valueField: 'codeName',
                                    triggerAction: 'all',
                                    fieldLabel: getColName('model_no'),
                                    // displayField: 'name',
                                    // valueField: 'value',
                                    // queryMode: 'local',
                                    store: commonModelStore,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        load: function(
                                            store,
                                            records,
                                            successful,
                                            operation,
                                            options) {
                                            if (this.hasNull) {
                                                var blank = {
                                                    systemCode: '',
                                                    codeNameEn: '',
                                                    codeName: ''
                                                };

                                                this
                                                    .add(blank);
                                            }

                                        },
                                        select: function(
                                            combo,
                                            record) {
                                            console_log('Selected Value : ' + combo
                                                .getValue());
                                            var systemCode = record[0]
                                                .get('systemCode');
                                            var codeNameEn = record[0]
                                                .get('codeNameEn');
                                            var codeName = record[0]
                                                .get('codeName');
                                            console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                        }
                                    }
                                }, {
                                    fieldLabel: getColName('comment'),
                                    name: 'comment',
                                    id: 'comment',
                                    allowBlank: true
                                }, {
                                    fieldLabel: getColName('seller_name'),
                                    name: 'seller_name',
                                    id: 'seller_name',
                                    allowBlank: true
                                }, {
                                    fieldLabel: getColName('remark'),
                                    name: 'remark',
                                    id: 'remark',
                                    allowBlank: true
                                },

                                {
                                    xtype: 'container',
                                    flex: 1,
                                    layout: 'hbox',
                                    items: [{
                                        xtype: 'textfield',
                                        flex: 1,
                                        labelWidth: 60,
                                        name: 'reference1',
                                        id: 'reference1',
                                        fieldLabel: getColName('reference1')
                                    }, {
                                        xtype: 'textfield',
                                        flex: 1,
                                        labelWidth: 60,
                                        name: 'reference2',
                                        id: 'reference2',
                                        fieldLabel: getColName('reference2')
                                    }]
                                }, {
                                    fieldLabel: getColName('reserved_varchar5'),
                                    name: 'reserved_varchar5',
                                    id: 'reserved_varchar5',
                                    allowBlank: true
                                },

                                new Ext.form.Hidden({
                                    id: 'parent',
                                    name: 'parent',
                                    value: selectedAssyUid
                                }),
                                new Ext.form.Hidden({
                                    id: 'ac_uid',
                                    name: 'ac_uid',
                                    value: selectedMoldUid
                                }),
                                new Ext.form.Hidden({
                                    id: 'pj_code',
                                    name: 'pj_code',
                                    value: selectedMoldCode
                                }),
                                new Ext.form.Hidden({
                                    id: 'coord_key2',
                                    name: 'coord_key2',
                                    value: selectedMoldCoord
                                }),
                                new Ext.form.Hidden({
                                    id: 'standard_flag',
                                    name: 'standard_flag'
                                }),
                                new Ext.form.Hidden({
                                    id: 'child',
                                    name: 'child'
                                }),
                                /*
                                 * new Ext.form.Hidden({
                                 * id: 'item_code',
                                 * name: 'item_code' }),
                                 */
                                new Ext.form.Hidden({
                                    id: 'sg_code',
                                    name: 'sg_code',
                                    value: 'STD'
                                }),
                                new Ext.form.Hidden({
                                    id: 'request_comment',
                                    name: 'request_comment'
                                }),
                                new Ext.form.Hidden({
                                    id: 'isVersionCopy',
                                    name: 'isVersionCopy',
                                    value: 'false'
                                }), new Ext.form.Hidden({
                                    id: 'isUpdateSpec',
                                    name: 'isUpdateSpec',
                                    value: 'false'
                                })

                                /*
                                 * , { x:5, y: 21 + 8*lineGap,
                                 * xtype: 'filefield', id:
                                 * 'form-file', emptyText:
                                 * panelSRO1149, fieldLabel:
                                 * panelSRO1150, name: 'photo-path',
                                 * buttonText: '', buttonConfig: {
                                 * iconCls: 'upload-icon' }, anchor:
                                 * '-5' // anchor width by
                                 * percentage }
                                 */ // ,
                                // {
                                // xtype: 'fieldset',
                                // border: true,
                                // //style: 'border-width: 0px',
                                // title: panelSRO1174,
                                // collapsible: false,
                                // defaults: {
                                // labelWidth: 40,
                                // anchor: '100%',
                                // layout: {
                                // type: 'hbox',
                                // defaultMargins: {top: 0, right:
                                // 5, bottom: 0, left: 0}
                                // }
                                // },
                                // items: [
                                //
                                // {
                                // xtype : 'fieldcontainer',
                                // combineErrors: true,
                                // msgTarget: 'side',
                                // defaults: {
                                // hideLabel: true
                                // },
                                // items : [{
                                // xtype: 'displayfield',
                                // value: ' '+panelSRO1186+':'
                                // },
                                // ,{
                                // xtype: 'displayfield',
                                // value:
                                // '&nbsp;&nbsp;'+panelSRO1187+':'
                                // }, {
                                // //the width of this field in the
                                // HBox layout is set directly
                                // //the other 2 items are given
                                // flex: 1, so will share the rest
                                // of the space
                                // width: 80,
                                // id: 'unit_code',
                                // name: 'unit_code',
                                // xtype: 'combo',
                                // mode: 'local',
                                // editable: false,
                                // allowBlank: false,
                                // queryMode: 'remote',
                                // displayField: 'codeName',
                                // valueField: 'codeName',
                                // value: 'PC',
                                // triggerAction: 'all',
                                // fieldLabel:
                                // getColName('unit_code'),
                                // // displayField: 'name',
                                // // valueField: 'value',
                                // // queryMode: 'local',
                                // store: commonUnitStore,
                                // listConfig:{
                                // getInnerTpl: function(){
                                // return '<div
                                // data-qtip="{systemCode}">{codeName}</div>';
                                // }
                                // },
                                // listeners: {
                                // select: function (combo, record)
                                // {
                                // console_log('Selected Value : ' +
                                // combo.getValue());
                                // var systemCode =
                                // record[0].get('systemCode');
                                // var codeNameEn =
                                // record[0].get('codeNameEn');
                                // var codeName =
                                // record[0].get('codeName');
                                // console_log('systemCode : ' +
                                // systemCode
                                // + ', codeNameEn=' + codeNameEn
                                // + ', codeName=' + codeName );
                                // }
                                // }
                                // },
                                // {
                                // xtype: 'displayfield',
                                // value: ' '+panelSRO1188+':'
                                // },
                                // {
                                // xtype: 'numberfield',
                                // minValue: 0,
                                // flex: 1,
                                // name : 'sales_price',
                                // id : 'sales_price',
                                // fieldLabel:
                                // getColName('sales_price'),
                                // allowBlank: true,
                                // value: '0',
                                // margins: '0'
                                // }, {
                                // //the width of this field in the
                                // HBox layout is set directly
                                // //the other 2 items are given
                                // flex: 1, so will share the rest
                                // of the space
                                // width: 80,
                                // id: 'currency',
                                // name: 'currency',
                                // xtype: 'combo',
                                // mode: 'local',
                                // editable: false,
                                // allowBlank: false,
                                // queryMode: 'remote',
                                // displayField: 'codeName',
                                // valueField: 'codeName',
                                // value: 'RMB',
                                // triggerAction: 'all',
                                // fieldLabel:
                                // getColName('currency'),
                                // // displayField: 'name',
                                // // valueField: 'value',
                                // // queryMode: 'local',
                                // store: commonCurrencyStore,
                                // listConfig:{
                                // getInnerTpl: function(){
                                // return '<div
                                // data-qtip="{systemCode}">{codeName}</div>';
                                // }
                                // },
                                // listeners: {
                                // select: function (combo, record)
                                // {
                                // console_log('Selected Value : ' +
                                // combo.getValue());
                                // var systemCode =
                                // record[0].get('systemCode');
                                // var codeNameEn =
                                // record[0].get('codeNameEn');
                                // var codeName =
                                // record[0].get('codeName');
                                // console_log('systemCode : ' +
                                // systemCode
                                // + ', codeNameEn=' + codeNameEn
                                // + ', codeName=' + codeName );
                                // }
                                // }
                                // }
                                // ]
                                // }
                                // ]
                                // }
                            ]
                        });

                var win = Ext
                    .create(
                        'ModalWindow', {
                            title: dbm1_standard + ' ' + CMD_ADD + ' :: ' + /* (G) */ vCUR_MENU_NAME,
                            width: 600,
                            height: 560,
                            minWidth: 250,
                            minHeight: 180,
                            layout: 'fit',
                            plain: true,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function() {
                                    var parent_checked = Ext
                                        .getCmp(
                                            'parent')
                                        .getValue();
                                    if (parent_checked == null || parent_checked == '') {
                                        Ext.MessageBox
                                            .alert(
                                                'Please choose a project.',
                                                'parent_checked is null at CMD OK handler');
                                    } else {
                                        Ext
                                            .getCmp(
                                                'request_comment')
                                            .setValue(
                                                Ext
                                                .getCmp(
                                                    'reference1')
                                                .getValue() + '|' + Ext
                                                .getCmp(
                                                    'reference2')
                                                .getValue());
                                        var form = Ext
                                            .getCmp(
                                                'formPanel')
                                            .getForm();
                                        // var pl_no =
                                        // Ext.getCmp('pl_no').getValue();
                                        // if(pl_no.length
                                        // < 8){
                                        if (form
                                            .isValid()) {
                                            console_log('form.isValid()');
                                            var curSpecification = Ext
                                                .getCmp(
                                                    'specification')
                                                .getValue();
                                            if (specification != null) {
                                                specification = gfn_trim(specification);
                                            }
                                            if (curSpecification != null) {
                                                curSpecification = gfn_trim(curSpecification);
                                            }
                                            console_log(curSpecification);
                                            console_log(specification);

                                            if (specification == null || specification == '') {
                                                Ext.getCmp('isUpdateSpec').setValue('true');
                                            } else { // specification
                                                // 갑시
                                                // 있으므로
                                                // 수정안되
                                                // 1.
                                                // 버전카피
                                                // assymap만

                                                if (specification != curSpecification) {
                                                    // alert('Specification
                                                    // is
                                                    // Changed...
                                                    // New
                                                    // Item
                                                    // Versionis
                                                    // Created.');
                                                    console_log('Specification is Changed... New Item Versionis Created.');
                                                    Ext
                                                        .getCmp(
                                                            'isVersionCopy')
                                                        .setValue(
                                                            'true');
                                                }
                                            }

                                            var val = form
                                                .getValues(false);
                                            var partline = Ext.ModelManager
                                                .create(
                                                    val,
                                                    'PartLine');
                                            console_log('partline : ');

                                            // var
                                            // pj_code =
                                            // Ext.getCmp('pj_code').getValue();
                                            // var pl_no
                                            // =
                                            // Ext.getCmp('pl_no').getValue();

                                            console_log(partline);
                                            // 공백있을시
                                            // 에러메세지 출력
                                            // var
                                            // titleSpec;
                                            // var
                                            // titleDesc;
                                            // var
                                            // titleCom;
                                            // var
                                            // titleMaker;

                                            // if(isAssFromMyPart==false)
                                            // {
                                            // titleSpec
                                            // =
                                            // func_replaceall(val["specification"],
                                            // " ","");
                                            // titleDesc
                                            // =
                                            // func_replaceall(val["description"],
                                            // " ","");
                                            // titleCom
                                            // =
                                            // func_replaceall(val["comment"],
                                            // " ","");
                                            // titleMaker
                                            // =
                                            // func_replaceall(val["maker_name"],
                                            // " ","");
                                            // }

                                            // if(
                                            // isAssFromMyPart==false
                                            // &&
                                            // (/*titleSpec
                                            // == ""
                                            // ||*/
                                            // titleDesc
                                            // == ""
                                            // /*||
                                            // titleCom
                                            // == "" ||
                                            // titleMaker
                                            // == ""*/
                                            // )){
                                            // Ext.MessageBox.alert(error_msg_prompt,'not
                                            // valid
                                            // Empty
                                            // Space');
                                            // } else {

                                            // if(isAssFromMyPart==true)
                                            // {//마이파트는
                                            // 중복코드 체크하지
                                            // 않는다.
                                            // partline.save({
                                            // success :
                                            // function()
                                            // {
                                            // console_log('updated');
                                            // if(win)
                                            // {
                                            // win.close();
                                            // store.load(function()
                                            // {});
                                            // }
                                            // }
                                            // });

                                            // } else
                                            // {//중복 코드
                                            // 체크
                                            // console_log('중복
                                            // 코드 체크');
                                            // Ext.Ajax.request({
                                            // url:
                                            // CONTEXT_PATH
                                            // +
                                            // '/design/bom.do?method=checkCode',
                                            // params:{
                                            // pj_code :
                                            // pj_code,
                                            // pl_no :
                                            // pl_no /*,
                                            // parent :
                                            // selectedAssyUid*/
                                            // },
                                            // success :
                                            // function(result,
                                            // request)
                                            // {
                                            //            							
                                            // console_log(result);
                                            //            							
                                            // var ret =
                                            // result.responseText;
                                            // if(ret ==
                                            // 0 || ret
                                            // == '0') {
                                            partline.save({
                                                success: function() {
                                                        console_log('updated');
                                                        if (win) {
                                                            if (win) {
                                                                win.close();
                                                            }
                                                            store.load(function() {});
                                                        } // endof
                                                        // win
                                                    } // endof
                                                    // success
                                            }); // endof
                                            // save
                                            // }//endof
                                            // ret ==0
                                            // else
                                            // {//중복됬으면
                                            // Ext.MessageBox.alert('Duplicated
                                            // Code',
                                            // 'check '
                                            // +
                                            // getColName('pl_no')
                                            // + '
                                            // value.');
                                            // }
                                            //            							
                                            // },//endof
                                            // success
                                            // for ajax
                                            // failure:
                                            // extjsUtil.failureMessage
                                            // });
                                            // //endof
                                            // Ajax
                                            // } //end
                                            // of 중복 코드
                                            // 체크
                                            // }//end of
                                            // else
                                            // isAssFromMyPart==false
                                            // cluase
                                        } else { // endof
                                            // formis
                                            // valid
                                            Ext.MessageBox
                                                .alert(
                                                    error_msg_prompt,
                                                    error_msg_content);
                                        }
                                        console_log('End!');
                                        // }else{
                                        // Ext.MessageBox.alert(dbm1_length,
                                        // dbm1_check);
                                        // }
                                    }
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function() {
                                    if (win) {
                                        win.close();
                                    }
                                }
                            }]
                        });
                win.show(this, function() {

                    var obj2 = Ext.getCmp('class_code2');
                    obj2.store = Ext.create('Ext.data.Store', {
                        fields: ['class_name', 'class_code_full'],
                        data: []
                    });
                });
            }
        });
var addActionNon = Ext
    .create(
        'Ext.Action', {
            iconCls: 'add',
            text: dbm1_non_standard_process,
            disabled: fPERM_DISABLING_Complished(),
            handler: function(widget, event) {
                var myPartStore = Ext.create('Mplm.store.MyPartStore', {});

                var form = Ext
                    .create(
                        'Ext.form.Panel', {
                            id: 'formPanel',
                            // layout: 'absolute',
                            defaultType: 'textfield',
                            border: false,
                            bodyPadding: 15,
                            defaults: {
                                anchor: '100%',
                                allowBlank: false,
                                msgTarget: 'side',
                                labelWidth: 60
                            },
                            items: [
                                new Ext.form.Hidden({
                                    id: 'parent',
                                    name: 'parent',
                                    value: selectedAssyUid
                                }),
                                new Ext.form.Hidden({
                                    id: 'ac_uid',
                                    name: 'ac_uid',
                                    value: selectedMoldUid
                                }),
                                new Ext.form.Hidden({
                                    id: 'pj_code',
                                    name: 'pj_code',
                                    value: selectedMoldCode
                                }),
                                new Ext.form.Hidden({
                                    id: 'coord_key2',
                                    name: 'coord_key2',
                                    value: selectedMoldCoord
                                }),
                                new Ext.form.Hidden({
                                    id: 'standard_flag',
                                    name: 'standard_flag'
                                }),
                                new Ext.form.Hidden({
                                    id: 'child',
                                    name: 'child'
                                        // }),new Ext.form.Hidden({
                                        // id: 'item_code',
                                        // name: 'item_code'
                                }),
                                new Ext.form.Hidden({
                                    id: 'sg_code',
                                    name: 'sg_code',
                                    value: 'NSD'
                                        // }),new Ext.form.Hidden({
                                        // id: 'image_path',
                                        // name: 'image_path',
                                        // value : '-'
                                }),
                                // formParent,formAc_uid,formPj_code,formCoord_key2,formStandard,
                                // formSrcAhdUid,formItemCode,

                                /*
                                 * { xtype: 'triggerfield',
                                 * fieldLabel: panelSRO1145,
                                 * x: 5, y: 8, name:
                                 * 'subject', anchor: '-5', //
                                 * anchor width by
                                 * percentage emptyText:
                                 * panelSRO1146,
                                 * trigger1Cls:
                                 * Ext.baseCSSPrefix +
                                 * 'form-clear-trigger',
                                 * trigger2Cls:
                                 * Ext.baseCSSPrefix +
                                 * 'form-search-trigger' },
                                 */
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    layout: 'hbox',
                                    margin: 5,
                                    items: [{
                                        flex: 1,
                                        labelWidth: 60,
                                        xtype: 'combo',
                                        mode: 'remote',
                                        editable: false,
                                        allowBlank: true,
                                        emptyText: 'Select My Part',
                                        queryMode: 'remote',
                                        displayField: 'item_code',
                                        valueField: 'unique_id',
                                        triggerAction: 'all',
                                        fieldLabel: dbm1_my_part,
                                        store: myPartStore,
                                        listConfig: {
                                            getInnerTpl: function() {
                                                return '<div data-qtip="{unique_id}">[{item_code}]{item_name}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function(
                                                combo,
                                                record) {
                                                console_log('Selected Value : ' + combo
                                                    .getValue());
                                                if (combo
                                                    .getValue() != -1) {
                                                    var oChild = Ext
                                                        .getCmp('child');
                                                    var oItem_code = Ext
                                                        .getCmp('item_code');
                                                    var oSpecification = Ext
                                                        .getCmp('specification');
                                                    var oItem_name = Ext
                                                        .getCmp('item_name');
                                                    var oStandard_flag = Ext
                                                        .getCmp('standard_flag');
                                                    var oStandard_flag_disp = Ext
                                                        .getCmp('standard_flag_disp');
                                                    var oPl_no = Ext
                                                        .getCmp('image_path');
                                                    var oDescription = Ext
                                                        .getCmp('description');
                                                    var oModel_no = Ext
                                                        .getCmp('model_no');
                                                    var oComment = Ext
                                                        .getCmp('comment');
                                                    var oPl_no = Ext
                                                        .getCmp('pl_no');
                                                    // var
                                                    // oMaker_name
                                                    // =
                                                    // Ext.getCmp('maker_name');
                                                    // var
                                                    // oUnit_code
                                                    // =
                                                    // Ext.getCmp('unit_code');
                                                    // var
                                                    // oCurrency
                                                    // =
                                                    // Ext.getCmp('currency');
                                                    // var
                                                    // oSales_price
                                                    // =
                                                    // Ext.getCmp('sales_price');
                                                    var oClass_code1 = Ext
                                                        .getCmp('class_code1');
                                                    var oClass_code2 = Ext
                                                        .getCmp('class_code2');
                                                    var oRemark = Ext
                                                        .getCmp('remark');
                                                    var oImage_no = Ext
                                                        .getCmp('image_no');
                                                    Ext
                                                        .getCmp(
                                                            'sg_code')
                                                        .setValue(
                                                            'NSD');

                                                    if (combo
                                                        .getValue() == '-1') {
                                                        isAssFromMyPart = false;

                                                        oChild
                                                            .setValue('-1');
                                                        oImage_path
                                                            .setValue('');
                                                        oPl_no
                                                            .setValue('');
                                                        // oSpecification.setValue('');
                                                        oItem_name
                                                            .setValue('');
                                                        oStandard_flag
                                                            .setValue('');
                                                        oStandard_flag_disp
                                                            .setValue('');
                                                        oDescription
                                                            .setValue('');
                                                        oModel_no
                                                            .setValue('');
                                                        oComment
                                                            .setValue('');
                                                        oRemark
                                                            .setValue('');
                                                        // oMaker_name.setValue('');
                                                        // oUnit_code.setValue('');
                                                        // oCurrency.setValue('');
                                                        // oSales_price.setValue('');
                                                    } else {
                                                        isAssFromMyPart = true;
                                                        console_log(record[0]
                                                            .get('currency'));
                                                        console_log(record[0]
                                                            .get('standard_flag'));
                                                        console_log(record[0]
                                                            .get('unit_code'));

                                                        var curreny = record[0]
                                                            .get('currency');
                                                        if (curreny == null || curreny == '') {
                                                            curreny = 'USD';
                                                        }
                                                        var unit_code = record[0]
                                                            .get('unit_code');
                                                        if (unit_code == null || unit_code == '') {
                                                            unit_code = 'PC';
                                                        }
                                                        var standard_flag = record[0]
                                                            .get('standard_flag');
                                                        if (standard_flag == null || standard_flag == '') {
                                                            standard_flag = 'K';
                                                        }

                                                        var item_code = record[0]
                                                            .get('item_code');
                                                        // var
                                                        // pl_no
                                                        // =
                                                        // '';
                                                        // if(item_code.length
                                                        // >
                                                        // 12)
                                                        // {
                                                        // pl_no
                                                        // =
                                                        // item_code.substring(12);
                                                        // }
                                                        console_log('item_code:' + item_code);
                                                        console_log('child: ' + record[0]
                                                            .get('unique_id'));

                                                        oChild
                                                            .setValue(record[0]
                                                                .get('unique_id'));
                                                        oItem_code
                                                            .setValue(record[0]
                                                                .get('item_code'));
                                                        oPl_no
                                                            .setValue(record[0]
                                                                .get('image_path'));
                                                        // oSpecification.setValue(record[0].get('specification'));
                                                        oItem_name
                                                            .setValue(record[0]
                                                                .get('item_name'));
                                                        oStandard_flag
                                                            .setValue(standard_flag);
                                                        oStandard_flag_disp
                                                            .setValue(standard_flag);
                                                        // oImage_path.setValue(record[0].get('image_path'));
                                                        oDescription
                                                            .setValue(record[0]
                                                                .get('description'));
                                                        oModel_no
                                                            .setValue(record[0]
                                                                .get('model_no'));
                                                        oComment
                                                            .setValue(record[0]
                                                                .get('comment'));
                                                        oPl_no
                                                            .setValue(record[0]
                                                                .get('pl_no'));
                                                        oRemark
                                                            .setValue(record[0]
                                                                .get('remark'));
                                                        oImage_no
                                                            .setValue(record[0]
                                                                .get('image_no'));
                                                        // oMaker_name.setValue(record[0].get('maker_name'));
                                                        // oUnit_code.setValue(unit_code);
                                                        // oCurrency.setValue(curreny);
                                                        // oSales_price.setValue(record[0].get('sales_price'));
                                                    } // endofelse
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: 'textfield',
                                        width: 200,
                                        minLength: 10,
                                        maxLength: 15,
                                        labelWidth: 60,
                                        labelAlign: 'right',
                                        // emptyText:
                                        // getColName('item_code'),
                                        name: 'item_code',
                                        id: 'item_code',
                                        fieldLabel: getColName('item_code'),
                                        readOnly: false,
                                        allowBlank: true
                                    }]
                                },
                                // {
                                // xtype: 'fieldset',
                                // x: 5,
                                // y: 3 + 1*lineGap,
                                // title: panelSRO1139,
                                // collapsible: false,
                                // defaults: {
                                // labelWidth: 40,
                                // anchor: '100%',
                                // layout: {
                                // type: 'hbox',
                                // defaultMargins: {top: 0,
                                // right: 5, bottom: 0,
                                // left: 0}
                                // }
                                // },
                                // items: [
                                // {
                                // xtype : 'fieldcontainer',
                                // combineErrors: true,
                                // msgTarget: 'side',
                                // border: false,
                                // fieldLabel: panelSRO1144,
                                // heigth: 100,
                                // defaults: {
                                // hideLabel: true
                                // },
                                // items : [
                                // {
                                // xtype: 'textfield',
                                // flex : 1,
                                // width: 70,
                                // emptyText:getColName('pl_no'),
                                // name : 'pl_no',
                                // id : 'pl_no',
                                // fieldLabel:
                                // getColName('pl_no'),
                                // // displayField:
                                // 'class_code_full' ,
                                // readOnly : false,
                                // allowBlank: true
                                // },
                                // {
                                // xtype: 'textfield',
                                // flex : 1,
                                // emptyText:
                                // '품명',
                                // name : 'item_name',
                                // id : 'item_name',
                                // fieldLabel:
                                // getColName('item_name'),
                                // readOnly : false,
                                // allowBlank: false
                                // }
                                // ]
                                // }
                                // ]
                                // }

                                {
                                    xtype: 'textfield',
                                    x: 5,
                                    y: 20 + 1 * lineGap,
                                    width: 70,
                                    // emptyText:getColName('pl_no'),
                                    name: 'pl_no',
                                    id: 'pl_no',
                                    fieldLabel: getColName('pl_no'),
                                    // displayField:
                                    // 'class_code_full' ,
                                    readOnly: false,
                                    allowBlank: true
                                }, {
                                    xtype: 'textfield',
                                    x: 5,
                                    y: 20 + 2 * lineGap,
                                    // emptyText:
                                    // '품명',
                                    name: 'item_name',
                                    id: 'item_name',
                                    fieldLabel: getColName('item_name'),
                                    readOnly: false,
                                    allowBlank: false
                                }, {
                                    x: 5,
                                    y: 20 + 3 * lineGap,
                                    width: 80,
                                    id: 'standard_flag_disp',
                                    name: 'standard_flag_disp',
                                    xtype: 'combo',
                                    mode: 'local',
                                    editable: false,
                                    allowBlank: false,
                                    queryMode: 'remote',
                                    displayField: 'codeName',
                                    // valueField:
                                    // 'codeName',
                                    value: '',
                                    triggerAction: 'all',
                                    fieldLabel: getColName('standard_flag'),
                                    store: commonNonStandardStore,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(
                                            combo,
                                            record) {
                                            console_log('Selected Value : ' + combo
                                                .getValue());
                                            var systemCode = record[0]
                                                .get('systemCode');
                                            var codeNameEn = record[0]
                                                .get('codeNameEn');
                                            var codeName = record[0]
                                                .get('codeName');
                                            console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                            // systemCode =
                                            // codeName;
                                            Ext
                                                .getCmp(
                                                    'standard_flag')
                                                .setValue(
                                                    systemCode);
                                        }
                                    }
                                }, {
                                    fieldLabel: getColName('description'),
                                    x: 5,
                                    y: 20 + 4 * lineGap,
                                    name: 'description',
                                    id: 'description',
                                    allowBlank: true,
                                    anchor: '-5' // anchor
                                        // width
                                        // by
                                        // percentage
                                        // },{
                                        // fieldLabel:
                                        // getColName('specification'),
                                        // x: 5,
                                        // y: 20 + 5*lineGap,
                                        // name:
                                        // 'specification',
                                        // id: 'specification',
                                        // allowBlank: true,
                                        // anchor: '-5' //
                                        // anchor width by
                                        // percentage
                                }, {
                                    // the width of this
                                    // field in the HBox
                                    // layout is set
                                    // directly
                                    // the other 2 items are
                                    // given flex: 1, so
                                    // will share the rest
                                    // of the space
                                    width: 80,
                                    x: 5,
                                    y: 20 + 5 * lineGap,
                                    id: 'model_no',
                                    name: 'model_no',
                                    xtype: 'combo',
                                    mode: 'local',
                                    editable: false,
                                    allowBlank: true,
                                    queryMode: 'remote',
                                    displayField: 'codeName',
                                    valueField: 'codeName',
                                    triggerAction: 'all',
                                    fieldLabel: getColName('model_no'),
                                    // displayField: 'name',
                                    // valueField: 'value',
                                    // queryMode: 'local',
                                    store: commonModelStore,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        load: function(
                                            store,
                                            records,
                                            successful,
                                            operation,
                                            options) {
                                            if (this.hasNull) {
                                                var blank = {
                                                    systemCode: '',
                                                    codeNameEn: '',
                                                    codeName: ''
                                                };

                                                this
                                                    .add(blank);
                                            }

                                        },
                                        select: function(
                                            combo,
                                            record) {
                                            console_log('Selected Value : ' + combo
                                                .getValue());
                                            var systemCode = record[0]
                                                .get('systemCode');
                                            var codeNameEn = record[0]
                                                .get('codeNameEn');
                                            var codeName = record[0]
                                                .get('codeName');
                                            console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                        }
                                    }
                                }, {
                                    fieldLabel: getColName('comment'),
                                    x: 5,
                                    y: 20 + 6 * lineGap,
                                    name: 'comment',
                                    id: 'comment',
                                    allowBlank: true,
                                    anchor: '-5' // anchor
                                        // width
                                        // by
                                        // percentage
                                }, {
                                    fieldLabel: getColName('alter_reason'),
                                    x: 5,
                                    y: 20 + 7 * lineGap,
                                    name: 'alter_reason',
                                    id: 'alter_reason',
                                    allowBlank: true,
                                    anchor: '-5' // anchor
                                        // width
                                        // by
                                        // percentage
                                }, {
                                    fieldLabel: getColName('remark'),
                                    x: 5,
                                    y: 20 + 8 * lineGap,
                                    name: 'remark',
                                    id: 'remark',
                                    allowBlank: true,
                                    anchor: '-5' // anchor
                                        // width
                                        // by
                                        // percentage
                                }, {
                                    xtype: 'fieldset',
                                    x: 5,
                                    // y: 20 + 9*lineGap,
                                    border: true,
                                    // style: 'border-width:
                                    // 0px',
                                    title: panelSRO1174,
                                    collapsible: false,
                                    anchor: '-5',
                                    defaults: {
                                        labelWidth: 40,
                                        anchor: '100%',
                                        layout: {
                                            type: 'hbox',
                                            defaultMargins: {
                                                top: 0,
                                                right: 5,
                                                bottom: 0,
                                                left: 0
                                            }
                                        }
                                    },
                                    items: [

                                        {
                                            xtype: 'fieldcontainer',
                                            combineErrors: true,
                                            msgTarget: 'side',
                                            defaults: {
                                                hideLabel: true
                                            },
                                            items: [{
                                                    xtype: 'displayfield',
                                                    value: ' ' + panelSRO1186 + ':'
                                                }, {
                                                    xtype: 'numberfield',
                                                    minValue: 0,
                                                    width: 70,
                                                    name: 'quan',
                                                    fieldLabel: getColName('quan'),
                                                    allowBlank: true,
                                                    value: '1',
                                                    margins: '0'
                                                }, {
                                                    xtype: 'displayfield',
                                                    value: '&nbsp;&nbsp;' + panelSRO1187 + ':'
                                                }, {
                                                    // the
                                                    // width
                                                    // of
                                                    // this
                                                    // field
                                                    // in
                                                    // the
                                                    // HBox
                                                    // layout
                                                    // is
                                                    // set
                                                    // directly
                                                    // the
                                                    // other
                                                    // 2
                                                    // items
                                                    // are
                                                    // given
                                                    // flex:
                                                    // 1, so
                                                    // will
                                                    // share
                                                    // the
                                                    // rest
                                                    // of
                                                    // the
                                                    // space
                                                    width: 80,
                                                    id: 'unit_code',
                                                    name: 'unit_code',
                                                    xtype: 'combo',
                                                    mode: 'local',
                                                    editable: false,
                                                    allowBlank: false,
                                                    queryMode: 'remote',
                                                    displayField: 'codeName',
                                                    valueField: 'codeName',
                                                    value: 'PC',
                                                    triggerAction: 'all',
                                                    fieldLabel: getColName('unit_code'),
                                                    // displayField:
                                                    // 'name',
                                                    // valueField:
                                                    // 'value',
                                                    // queryMode:
                                                    // 'local',
                                                    store: commonUnitStore,
                                                    listConfig: {
                                                        getInnerTpl: function() {
                                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                        }
                                                    },
                                                    listeners: {
                                                        select: function(
                                                            combo,
                                                            record) {
                                                            console_log('Selected Value : ' + combo
                                                                .getValue());
                                                            var systemCode = record[0]
                                                                .get('systemCode');
                                                            var codeNameEn = record[0]
                                                                .get('codeNameEn');
                                                            var codeName = record[0]
                                                                .get('codeName');
                                                            console_log('systemCode : ' + systemCode + ', codeNameEn=' + codeNameEn + ', codeName=' + codeName);
                                                        }
                                                    }
                                                }

                                                // fieldLabel:
                                                // getColName('maker_name'),
                                                // x: 5,
                                                // y: 20 +
                                                // 8*lineGap,
                                                // name:
                                                // 'maker_name',
                                                // id: 'maker_name',
                                                // allowBlank: true,
                                                // anchor: '-5' //
                                                // anchor width by
                                                // percentage
                                                // }
                                                /*
                                                 * , { x:5, y: 21 +
                                                 * 8*lineGap, xtype:
                                                 * 'filefield', id:
                                                 * 'form-file',
                                                 * emptyText:
                                                 * panelSRO1149,
                                                 * fieldLabel:
                                                 * panelSRO1150,
                                                 * name:
                                                 * 'photo-path',
                                                 * buttonText: '',
                                                 * buttonConfig: {
                                                 * iconCls:
                                                 * 'upload-icon' },
                                                 * anchor: '-5' //
                                                 * anchor width by
                                                 * percentage }
                                                 */
                                                // ,
                                                // {
                                                // xtype:
                                                // 'displayfield',
                                                // value: '
                                                // '+panelSRO1188+':'
                                                // },
                                                // {
                                                // xtype:
                                                // 'numberfield',
                                                // minValue: 0,
                                                // flex: 1,
                                                // name :
                                                // 'sales_price',
                                                // id :
                                                // 'sales_price',
                                                // fieldLabel:
                                                // getColName('sales_price'),
                                                // allowBlank: true,
                                                // value: '0',
                                                // margins: '0'
                                                // }, {
                                                // //the width of
                                                // this field in the
                                                // HBox layout is
                                                // set directly
                                                // //the other 2
                                                // items are given
                                                // flex: 1, so will
                                                // share the rest of
                                                // the space
                                                // width: 80,
                                                // id: 'currency',
                                                // name: 'currency',
                                                // xtype: 'combo',
                                                // mode: 'local',
                                                // editable: false,
                                                // allowBlank:
                                                // false,
                                                // queryMode:
                                                // 'remote',
                                                // displayField:
                                                // 'codeName',
                                                // valueField:
                                                // 'codeName',
                                                // value: 'RMB',
                                                // triggerAction:
                                                // 'all',
                                                // fieldLabel:
                                                // getColName('currency'),
                                                // // displayField:
                                                // 'name',
                                                // // valueField:
                                                // 'value',
                                                // // queryMode:
                                                // 'local',
                                                // store:
                                                // commonCurrencyStore,
                                                // listConfig:{
                                                // getInnerTpl:
                                                // function(){
                                                // return '<div
                                                // data-qtip="{systemCode}">{codeName}</div>';
                                                // }
                                                // },
                                                // listeners: {
                                                // select: function
                                                // (combo, record) {
                                                // console_log('Selected
                                                // Value : ' +
                                                // combo.getValue());
                                                // var systemCode =
                                                // record[0].get('systemCode');
                                                // var codeNameEn =
                                                // record[0].get('codeNameEn');
                                                // var codeName =
                                                // record[0].get('codeName');
                                                // console_log('systemCode
                                                // : ' + systemCode
                                                // + ', codeNameEn='
                                                // + codeNameEn
                                                // + ', codeName=' +
                                                // codeName );
                                                // }
                                                // }
                                                // }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        });

                var win = Ext
                    .create(
                        'ModalWindow', {
                            title: dbm1_non_standard + ' ' + CMD_ADD + ' :: ' + /* (G) */ vCUR_MENU_NAME,
                            width: 750,
                            height: 500,
                            minWidth: 250,
                            minHeight: 180,
                            layout: 'fit',
                            plain: true,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function() {
                                    var form = Ext
                                        .getCmp(
                                            'formPanel')
                                        .getForm();
                                    // var pl_no =
                                    // Ext.getCmp('pl_no').getValue();
                                    // if(pl_no.length <
                                    // 8){
                                    if (form.isValid()) {
                                        console_log('form.isValid()');
                                        var val = form
                                            .getValues(false);
                                        console_log(val);
                                        var partline = Ext.ModelManager
                                            .create(
                                                val,
                                                'PartLine');
                                        console_log(partline);
                                        // var pj_code =
                                        // Ext.getCmp('pj_code').getValue();
                                        // var pl_no =
                                        // Ext.getCmp('pl_no').getValue();

                                        // 공백있을시 에러메세지
                                        // 출력
                                        // var
                                        // titleSpec;
                                        // var
                                        // titleDesc;
                                        // var titleCom;
                                        // var
                                        // titleMaker;

                                        // if(isAssFromMyPart==false)
                                        // {
                                        // titleSpec =
                                        // func_replaceall(val["specification"],
                                        // " ","");
                                        // titleDesc =
                                        // func_replaceall(val["description"],
                                        // " ","");
                                        // titleCom =
                                        // func_replaceall(val["comment"],
                                        // " ","");
                                        // titleMaker =
                                        // func_replaceall(val["maker_name"],
                                        // " ","");
                                        // }

                                        // if(
                                        // isAssFromMyPart==false
                                        // &&
                                        // (/*titleSpec
                                        // == "" ||*/
                                        // titleDesc ==
                                        // "" /*||
                                        // titleCom ==
                                        // "" ||
                                        // titleMaker ==
                                        // ""*/ )){
                                        // Ext.MessageBox.alert(error_msg_prompt,'not
                                        // valid Empty
                                        // Space');
                                        // } else {

                                        // if(isAssFromMyPart==true)
                                        // {//마이파트는 중복코드
                                        // 체크하지 않는다.
                                        partline
                                            .save({
                                                success: function() {
                                                    console_log('updated');
                                                    if (win) {
                                                        win
                                                            .close();
                                                        store
                                                            .load(function() {});
                                                    }
                                                }
                                            });

                                        // } else {//중복
                                        // 코드 체크
                                        // console_log('중복
                                        // 코드 체크');
                                        // Ext.Ajax.request({
                                        // url:
                                        // CONTEXT_PATH
                                        // +
                                        // '/design/bom.do?method=checkCode',
                                        // params:{
                                        // pj_code :
                                        // pj_code,
                                        // pl_no : pl_no
                                        // /*,
                                        // parent :
                                        // selectedAssyUid*/
                                        // },
                                        // success :
                                        // function(result,
                                        // request) {
                                        //		   							
                                        // console_log(result);
                                        //		   							
                                        // var ret =
                                        // result.responseText;
                                        // if(ret == 0
                                        // || ret ==
                                        // '0') {
                                        // partline.save({
                                        // success :
                                        // function() {
                                        // console_log('updated');
                                        // if(win)
                                        // {
                                        // if(win) {
                                        // win.close();
                                        // }
                                        // store.load(function()
                                        // {});
                                        // } //endof win
                                        // }//endof
                                        // success
                                        // });//endof
                                        // save
                                        // }//endof ret
                                        // ==0
                                        // else {//중복됬으면
                                        // Ext.MessageBox.alert('Duplicated
                                        // Code', 'check
                                        // ' +
                                        // getColName('pl_no')
                                        // + ' value.');
                                        // }
                                        //
                                        // },//endof
                                        // success for
                                        // ajax
                                        // failure:
                                        // extjsUtil.failureMessage
                                        // }); //endof
                                        // Ajax
                                        // } //end of 중복
                                        // 코드 체크
                                        // }//end of
                                        // else
                                        // isAssFromMyPart==false
                                        // cluase
                                    } else { // endof
                                        // formis
                                        // valid
                                        Ext.MessageBox
                                            .alert(
                                                error_msg_prompt,
                                                error_msg_content);
                                    }
                                    console_log('End!');
                                    // }else{
                                    // Ext.MessageBox.alert(dbm1_length,
                                    // dbm1_check);
                                    // }
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function() {
                                    if (win) {
                                        win.close();
                                    }
                                }
                            }]
                        });
                win.show(this, function() {});
            }
        });

// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ /* addElecAction, */ editAction, removeAction]
});

// Excel Upload from NX
var addNxExcel = Ext
    .create(
        'Ext.Action', {
            itemId: 'addNxExcel',
            iconCls: 'MSExcelTemplateX',
            text: panelSRO1193,
            disabled: false,
            handler: function(widget, event) {
                var form = Ext.create('Ext.form.Panel', {
                    id: 'formPanel',
                    // layout: 'absolute',
                    defaultType: 'displayfield',
                    border: false,
                    bodyPadding: 15,
                    defaults: {
                        anchor: '100%',
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: [{
                        xtype: 'filefield',
                        emptyText: panelSRO1149,
                        buttonText: 'upload',
                        allowBlank: true,
                        buttonConfig: {
                            iconCls: 'upload-icon'
                        },
                        anchor: '100%'
                    }]
                });

                var win = Ext
                    .create(
                        'ModalWindow', {
                            title: CMD_ADD + ' :: ' + /* (G) */ vCUR_MENU_NAME,
                            width: 600,
                            height: 150,
                            layout: 'fit',
                            plain: true,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function() {

                                    var form = Ext
                                        .getCmp(
                                            'formPanel')
                                        .getForm();

                                    if (form.isValid()) {
                                        if (win) {
                                            // var val =
                                            // form.getValues(false);
                                            // /********************파일첨부시
                                            // 추가(Only
                                            // for
                                            // FileAttachment)**************
                                            // alert('add
                                            // Handler:'
                                            // +
                                            // /*(G)*/vFILE_ITEM_CODE);
                                            /* (G) */
                                            vFILE_ITEM_CODE = RandomString(10);
                                            // val["file_itemcode"]
                                            // =
                                            // /*(G)*/vFILE_ITEM_CODE;
                                            // val["parent"]
                                            // =
                                            // selectedAssyUid;
                                            // val["ac_uid"]
                                            // =
                                            // selectedMoldUid;
                                            // val["coord_key2"]
                                            // =
                                            // selectedMoldCoord;
                                            // val["menu"]
                                            // =
                                            // vCUR_MENU_CODE;
                                            // val["pj_code"]
                                            // =
                                            // selectedPj_code;
                                            // var
                                            // nxExcel =
                                            // Ext.ModelManager.create(val,
                                            // 'NxExcel');
                                            form
                                                .submit({
                                                    url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + /* (G) */ vFILE_ITEM_CODE,
                                                    waitMsg: 'Uploading Files...',
                                                    success: function(
                                                        fp,
                                                        o) {
                                                        console_log('success');

                                                        Ext.Ajax
                                                            .request({
                                                                url: CONTEXT_PATH + '/design/upload.do?method=excelBom',
                                                                params: {
                                                                    file_itemcode: vFILE_ITEM_CODE,
                                                                    parent: selectedAssyUid,
                                                                    ac_uid: selectedMoldUid,
                                                                    coord_key2: selectedMoldCoord,
                                                                    menu: vCUR_MENU_CODE,
                                                                    pj_code: selectedPj_code

                                                                },
                                                                success: function(
                                                                    result,
                                                                    request) {
                                                                    var result = result.responseText;
                                                                    console_log('result:' + result);
                                                                    Ext.MessageBox
                                                                        .alert(
                                                                            'Check',
                                                                            result);
                                                                    store
                                                                        .load(function() {});
                                                                },
                                                                failure: extjsUtil.failureMessage
                                                            });
                                                    },
                                                    failure: function() {
                                                        console_log('failure');
                                                        Ext.MessageBox
                                                            .alert(
                                                                error_msg_prompt,
                                                                'Failed');
                                                    }
                                                });
                                        }
                                    }
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function() {
                                    if (win) {
                                        win.close();
                                    }
                                }
                            }]
                        });
                win.show();
            }
        });

var onlyActionBomCopy = null;

function checkCopyAction() {

    if ((selectionLength > 0) && toPjUidAssy != '' && toPjUidAssy != null) {
        onlyActionBomCopy.enable();
    } else {
        onlyActionBomCopy.disable();
    }

}

var excel_sample = Ext.create('Ext.Action', {
    iconCls: 'MSExcelTemplateX',
    text: GET_MULTILANG('dbm1_template'),
    disabled: fPERM_DISABLING_Complished(),
    // disabled: true,
    handler: function(widget, event) {
        var lang = vLANG;
        switch (lang) {
            case 'ko':
                path = 'cab/BOM_Excel_Format_ko.xlsx'; // 상대경로 사용
                break;
            case 'zh':
                path = 'cab/BOM_Excel_Format_zh.xlsx';
                break;
            case 'en':
                path = 'cab/BOM_Excel_Format_en.xlsx';
                break;
        }
        window.location = CONTEXT_PATH + '/filedown.do?method=direct&path=' + path;
    }
});

searchField = [];

Ext
    .onReady(function() {
        var searchField = [];
        // LoadJsMessage(); --> main으로 이동
        // Ext.define('RtgApp', {
        // extend: 'Ext.data.Model',
        // fields: /*(G)*/vCENTER_FIELDS_SUB,
        // proxy: {
        // type: 'ajax',
        // api: {
        // read: CONTEXT_PATH +
        // '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
        // create: CONTEXT_PATH +
        // '/rtgMgmt/routing.do?method=createRtgappDyna',
        // destroy: CONTEXT_PATH +
        // '/rtgMgmt/routing.do?method=destroyRtgapp'
        // },
        // reader: {
        // type: 'json',
        // root: 'datas',
        // totalProperty: 'count',
        // successProperty: 'success'
        // },
        // writer: {
        // type: 'singlepost',
        // writeAllFields: false,
        // root: 'datas'
        // }
        // }
        // });
        //	
        // var projectStore = Ext.create('Mplm.store.ProjectStore',
        // {hasNull: false} );
        commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {
            hasNull: false
        });
        commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {
            hasNull: false
        });
        commonModelStore = Ext.create('Mplm.store.CommonModelStore', {
            hasNull: true
        });
        commonStandardStore = Ext.create('Mplm.store.CommonStandardStore', {
            hasNull: false,
            useYn: 'Y'
        });
        try {
            commonNonStandardStore = Ext.create(
                'Mplm.store.CommonNonStandardStore', {
                    hasNull: false,
                    useYn: 'Y'
                });
        } catch (e) {
            alert('Mplm.store.CommonNonStandardStore: ' + e.message);
        }

        GubunStore = Ext.create('Mplm.store.GubunStore', {
            hasNull: false
        });

        // LoadJs('/mplm/store/RouteGubunTypeStore.js');
        LoadJs('/js/util/comboboxtree.js');

        // var projectToolBar = Ext.create('Mplm.test.comboboxtree', {} );

        // parent classcode loading
        PmaterialStore.proxy.extraParams.level = '1';
        PmaterialStore.load(function(records) {
            for (var i = 0; i < records.length; i++) {
                var classObj = records[i];
                var class_code = classObj.get('class_code_full');
                var class_name = classObj.get('class_name');

                var obj = {};
                obj['name'] = '[' + class_code + ']' + class_name;
                obj['value'] = class_code;
                comboClass1.push(obj);
            }
            // console_log('seted value:' + PmaterialStore.type);
            // PmaterialStore.type ='calss_code2';
            // console_log('seted value:' + PmaterialStore.type);
            // PmaterialStore.type = 'calss_code2';
        });

        console_log('now starting...');

        // var projectToolBar = getProjectToolbar(false/*hasPaste*/,
        // false/*excelPrint*/) ;

        onlyActionBomCopy = Ext.create('Ext.Action', {
            iconCls: 'PSBOMView',
            text: '复制',
            disabled: true,
            handler: function(widget, event) {

                // make uidlist
                var uidList = '';
                var selections = grid.getSelectionModel()
                    .getSelection();
                if (selections) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = grid.getSelectionModel()
                            .getSelection()[i];
                        var unique_uid = rec.get('unique_uid');
                        if (uidList == '') {
                            uidList = unique_uid;
                        } else {
                            uidList = uidList + ';' + unique_uid;
                        }
                    }
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=copyBom',
                    params: {
                        toPjUidAssy: toPjUidAssy,
                        toPjUid: toPjUid,
                        uidList: uidList
                    },
                    success: function(result, request) {
                        Ext.MessageBox.alert('Info',
                            'Bom Copy is done.');

                    }, // endof success for ajax
                    failure: extjsUtil.failureMessage
                }); // endof Ajax

            }
        });

        var projectStore = Ext.create('Mplm.store.ProjectStore', {
            hasNull: false
        });
        var projectCombo = {
            id: 'toPjUidAssy',
            name: 'toPjUidAssy',
            xtype: 'combo',
            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
            store: projectStore,
            emptyText: dbm1_mold_no,
            displayField: 'pj_code',
            valueField: 'uid_srcahd',
            sortInfo: {
                field: 'create_date',
                direction: 'DESC'
            },
            typeAhead: false,
            hideLabel: true,
            minChars: 2,
            // hideTrigger:true,
            // width: 200,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function() {
                    return '<div data-qtip="{unique_id}">{pj_code}</div>';
                }
            },
            listeners: {
                select: function(combo, record) {
                    toPjUidAssy = combo.getValue();
                    toPjUid = record[0].get('unique_id'); // ac_uid
                    console_log('------------------------------------------------------------------------------------');
                    console_log('toPjUidAssy=' + toPjUidAssy + ', toPjUid=' + toPjUid);
                    console_log(record[0].get('is_complished'));
                    console_log('------------------------------------------------------------------------------------');

                    checkCopyAction();
                }
            }
        };

        // ************************ BOM *********

        // PartLine Store 정의
        store = new Ext.data.Store({
            pageSize: getPageSize(),
            model: 'PartLine',
            // remoteSort: true,
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }]
        });
        store.getProxy().setExtraParam('not_standard_flag', 'A');
        store.getProxy().setExtraParam('ele_standard_flag', 'E');
        store
            .load(function() {

                var selModel = Ext.create("Mplm.util.SelModelCheckbox", {
                    onlyCheckOwner: false
                });

                grid = Ext
                    .create(
                        'Ext.grid.Panel', {
                            id: 'gridBom',
                            // title: '',
                            store: store,
                            // /COOKIE//stateful: true,
                            collapsible: true,
                            multiSelect: true,
                            selModel: selModel,
                            stateId: 'stateGridBom' + /* (G) */ vCUR_MENU_CODE,
                            region: 'center',
                            width: '60%',
                            // layout: 'fit',
                            height: getCenterPanelHeight(),

                            bbar: getPageToolbar(store),

                            dockedItems: [{
                                    dock: 'top',
                                    xtype: 'toolbar',
                                    items: [
                                        searchAction,
                                        '-', {
                                            conCls: 'add',
                                            text: CMD_ADD,
                                            disabled: fPERM_DISABLING(),
                                            menu: {
                                                items: [
                                                    addAction,
                                                    addActionNon
                                                ]
                                            }
                                        },
                                        /*
                                         * '-',
                                         * addElecAction,
                                         */
                                        '-',
                                        removeAction,
                                        '-',
                                        purchase_requestAction,
                                        '-',
                                        process_requestAction,
                                        '-',
                                        pp_requestAction,
                                        '-',
                                        send_requestAction,
                                        '-',
                                        addNxExcel,
                                        '-',
                                        onlyActionBomCopy,
                                        projectCombo,
                                        '->',
                                        excel_sample
                                    ]
                                }, {
                                    xtype: 'toolbar',
                                    items: getProjectTreeToolbar()
                                        // projectToolBar
                                        // combotree
                                }, {
                                    xtype: 'toolbar',
                                    items: [{
                                        id: 'gubun_flag',
                                        name: 'gubun_flag',
                                        xtype: 'combo',
                                        mode: 'local',
                                        triggerAction: 'all',
                                        emptyText: pms1_gubun,
                                        displayField: 'codeName',
                                        valueField: 'systemCode',
                                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                        queryMode: 'remote',
                                        // fieldStyle:
                                        // 'background-color:
                                        // #FBF8E6;
                                        // background-image:
                                        // none;',
                                        store: GubunStore,
                                        listConfig: {
                                            getInnerTpl: function() {
                                                return '<div data-qtip="{systemCode}">{codeName}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function(
                                                    combo,
                                                    record) {
                                                    var gubun_flag = Ext
                                                        .getCmp(
                                                            'gubun_flag')
                                                        .getValue();
                                                    store
                                                        .getProxy()
                                                        .setExtraParam(
                                                            'standard_flag',
                                                            gubun_flag);
                                                    store
                                                        .load({});
                                                } // endofselect
                                        }
                                    }]
                                }

                            ],
                            columns: /* (G) */ vCENTER_COLUMNS,
                            plugins: [cellEditing],
                            viewConfig: {
                                stripeRows: true,
                                enableTextSelection: true,
                                getRowClass: function(record) {
                                    // return
                                    // record.get('creator_uid')
                                    // == vCUR_USER_UID ?
                                    // 'my-row' : '';
                                    if (record
                                        .get('standard_flag') == "K") {
                                        return 'selected-row';
                                    } else if (record
                                        .get('standard_flag') == "S") {
                                        return 'selected-green-row';
                                    } else if (record
                                        .get('standard_flag') == "M") {
                                        return 'my-row';
                                    } else {
                                        return '';
                                    }
                                },
                                listeners: {
                                    'afterrender': function(
                                        grid) {
                                        var elments = Ext
                                            .select(
                                                ".x-column-header",
                                                true); // .x-grid3-hd
                                        elments.each(function(
                                            el) {
                                            // el.setStyle("color",
                                            // 'black');
                                            // el.setStyle("background",
                                            // '#ff0000');
                                            // el.setStyle("font-size",
                                            // '12px');
                                            // el.setStyle("font-weight",
                                            // 'bold');

                                        }, this);

                                    },
                                    itemcontextmenu: function(
                                        view, rec, node,
                                        index, e) {
                                        e.stopEvent();
                                        contextMenu.showAt(e
                                            .getXY());
                                        return false;
                                    }
                                }
                            },
                            title: getMenuTitle()
                        });
                grid
                    .getSelectionModel()
                    .on({
                        selectionchange: function(sm,
                            selections) {
                            selectionLength = selections.length;
                            checkCopyAction();
                            if (selections.length) {
                                var appr_check = selections[0]
                                    .get('reserved_varchar2');
                                var mp_status = selections[0]
                                    .get('status_full');
                                var standard_flag = selections[0]
                                    .get('standard_flag');
                                var status = selections[0]
                                    .get('status');
                                console_log('status>>>>>>>>>>>>' + status);
                                // grid info 켜기
                                displayProperty(selections[0]);
                                if (mp_status == 'PGR' || mp_status == 'OCR') {
                                    removeAction.enable();
                                    // if(mp_status
                                    // =='OCR'){
                                    // process_requestAction.disable();
                                    // }
                                    // purchase_requestAction.disable();
                                    // pp_requestAction.disable();
                                    // send_requestAction.disable();
                                    // -------------------------->Cancel
                                    purchase_requestAction
                                        .enable();
                                    process_requestAction
                                        .enable();
                                    pp_requestAction
                                        .enable();
                                    send_requestAction
                                        .enable();
                                    editAction.disable();
                                    checkCopyAction(true);

                                } else {
                                    if (is_complish == 'Y' || (appr_check == 'Y' && status != 'BM')) {
                                        removeAction
                                            .disable();
                                        // process_requestAction.disable();
                                        // purchase_requestAction.disable();
                                        // purchase_requestAction.disable();
                                        // pp_requestAction.disable();
                                        // -------------------------->Cancel
                                        purchase_requestAction
                                            .enable();
                                        process_requestAction
                                            .enable();
                                        pp_requestAction
                                            .enable();
                                        send_requestAction
                                            .enable();
                                        editAction
                                            .disable();
                                    } else {
                                        // checkPerent(selectedAssyUid);
                                        if (fPERM_DISABLING_Complished() == true) {
                                            removeAction
                                                .disable();
                                            process_requestAction
                                                .disable();
                                            purchase_requestAction
                                                .disable();
                                            pp_requestAction
                                                .disable();
                                            send_requestAction
                                                .disable();
                                            editAction
                                                .disable();
                                        } else {
                                            // if(status ==
                                            // 'BM'){
                                            // switch(standard_flag){
                                            // case 'K':
                                            // purchase_requestAction.enable();
                                            // break;
                                            // case 'M':
                                            // process_requestAction.enable();
                                            // break;
                                            // case 'R':
                                            // pp_requestAction.enable();
                                            // break;
                                            // case 'S':
                                            // send_requestAction.enable();
                                            // break;
                                            // }
                                            // }
                                            // -------------------------->Cancel
                                            purchase_requestAction
                                                .enable();
                                            process_requestAction
                                                .enable();
                                            pp_requestAction
                                                .enable();
                                            send_requestAction
                                                .enable();
                                            editAction
                                                .enable();
                                            checkCopyAction(true);
                                        }
                                    }
                                }
                            } else {
                                if (is_complish == 'Y') {
                                    removeAction.disable();
                                    process_requestAction
                                        .disable();
                                    purchase_requestAction
                                        .disable();
                                    pp_requestAction
                                        .disable();
                                    send_requestAction
                                        .disable();
                                    editAction.disable();
                                } else {
                                    if (fPERM_DISABLING_Complished() == true) {
                                        collapseProperty();
                                        removeAction
                                            .disable();
                                        process_requestAction
                                            .disable();
                                        purchase_requestAction
                                            .disable();
                                        pp_requestAction
                                            .disable();
                                        send_requestAction
                                            .disable();
                                        editAction
                                            .disable();
                                        checkCopyAction(false);
                                    } else {
                                        collapseProperty();
                                        removeAction
                                            .disable();
                                        process_requestAction
                                            .disable();
                                        purchase_requestAction
                                            .disable();
                                        pp_requestAction
                                            .disable();
                                        send_requestAction
                                            .disable();
                                        editAction
                                            .disable();
                                        checkCopyAction(false);
                                    }
                                }
                            }
                        }
                    });

                var main = Ext.create('Ext.panel.Panel', {
                    height: getCenterPanelHeight(),

                    layoutConfig: {
                        columns: 2
                    },
                    split: true,
                    layout: 'border',
                    border: false,
                    defaults: {
                        collapsible: true,
                        split: true,
                        cmargins: '5 0 0 0',
                        margins: '0 0 0 0'
                    },

                    items: [ /* gridProjectMold, */
                        grid
                    ]

                });
                fLAYOUT_CONTENT(main);
                // console_log('end create');

                // }//endof else
            });
        cenerFinishCallback(); // Load Ok Finish Callback
        // }
        // });
    }); // OnReady