Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'Mplm':	vContent_full_path + '/mplm',
		'Rfx.base':	vContent_full_path + '/rfx/base',
		'Rfx.model':	vContent_full_path + '/rfx/model',
		'Rfx.store':	vContent_full_path + '/rfx/store',
		'Rfx.view':	vContent_full_path + '/rfx/view',
		'Rfx.app':	vContent_full_path + '/rfx/app',
		'Rfx.util':	vContent_full_path + '/rfx/util',
		'Rfx2.base':	vContent_full_path + '/rfx2/base',
		'Rfx2.model':	vContent_full_path + '/rfx2/model',
		'Rfx2.store':	vContent_full_path + '/rfx2/store',
		'Rfx2.view':	vContent_full_path + '/rfx2/view',
		'Rfx2.app':	vContent_full_path + '/rfx2/app',
	//	'Rfx2.util':	vContent_full_path + '/rfx2/util', //사용안함
		'Rfx8.base':	vContent_full_path + '/rfx8/base',
		'Rfx8.model':	vContent_full_path + '/rfx8/model',
		'Rfx8.store':	vContent_full_path + '/rfx8/store',
		'Rfx8.view':	vContent_full_path + '/rfx8/view',
		'Rfx8.app':	vContent_full_path + '/rfx8/app',
		'Rfx8.util':	vContent_full_path + '/rfx8/util',
		'Ext.ux':	vContent_full_path + '/extjs5/module/ux',
		'Ext.xdview':	vContent_full_path + '/extjs5/module/xdview',
		'Ext.calendar':	vContent_full_path + '/rfx/view/calendar/src',
		'Sch':	vContent_full_path + '/taskboard-2.0.9/taskboard/lib/Sch',
		'Kanban':	vContent_full_path + '/taskboard-2.0.9/taskboard/lib/Kanban',
		'Ext.ux.upload':	vContent_full_path + '/upload/',
		'Rfx3.view':	vContent_full_path + '/rfx3/view',
		'PdfViewer.view': vContent_full_path + '/ext-pdf-viewer-master/src/view/',
		'Hanaro': vContent_full_path_sub + '/hanaro' //, 
		// 'Ext.calendar.view': vContent_full_path + '/ext-6.7.0/build/packages/calendar/build/classic/calendar.js',
    }
});

Ext.require([
	'Ext.grid.*',
	'Ext.data.*',
	'Ext.util.*',
	'Ext.Action',
	'Ext.tab.*',
	'Ext.button.*',
	'Ext.form.*',
	'Ext.tree.*',
	'Ext.Array.*',
	'Ext.layout.container.Card',
	'Ext.layout.container.Border',
	'Ext.ux.ajax.SimManager',
	'Ext.ux.PreviewPlugin',
	'Ext.window.MessageBox',
	'Ext.util.History',
	'Ext.tip.*',
	'Ext.ux.CheckColumn',
	'Rfx.view.form.TaskEditor',
	'Rfx.app.Util',
//	'Rfx2.app.Util', //사용안함
	'Kanban.view.TaskBoard',
	'Kanban.editor.SimpleEditor',
	'Ext.pivot.*',
	'PdfViewer.view.*'
]);