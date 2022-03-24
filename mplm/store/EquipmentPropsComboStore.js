/**
 * DefineCalendar  Store
 */
Ext.define("Mplm.store.EquipmentPropsComboStore", {
  extend: "Ext.data.Store",
  initComponent: function (params) {
    // !! here may be some calculations and params alteration !!
    Ext.apply(this, {
      unique_id: params.unique_id,
      name_ko: params.name_ko,
      mchn_code: params.mchn_code,
      mchn_uid: params.mchn_uid,
      prop_key: params.prop_key,
      prop_name: params.prop_name,
      name_en: params.name_en
    });
    console.log('## store Init Complete ~ ');
  },
  fields: [
    { name: "unique_id", type: "string" },
    { name: "name_ko", type: "string" },
    { name: "mchn_code", type: "string" },
    { name: "mchn_uid", type: "string" },
    { name: "prop_key", type: "string" },
    { name: "prop_name", type: "string" },
    { name: "name_en", type: "string" },
  ],
  sorters: [
    // {
    //   property: "unique_id",
    //   direction: "DESC",
    // },
  ],
  hasNull: false,
  proxy: {
    type: "ajax",
    url: CONTEXT_PATH + "/production/machine.do?method=read",//readMchnComboList /equipment/getChartForm.do?method=read
    reader: {
      type: "json",
      root: "datas",
      totalProperty: "count",
      successProperty: "success",
    },
    autoLoad: true,
  },
  listeners: {
    load: function (store, records, successful, operation, options) {
      console_logs(">>>>> store", store);
      console_logs(">>>>> records", records);
    }, //endofload
    beforeload: function () {
      if (this.unique_id != null) {
        this.getProxy().setExtraParam("unique_id", this.unique_id);
      }
    },
  }, //endoflistner
});
