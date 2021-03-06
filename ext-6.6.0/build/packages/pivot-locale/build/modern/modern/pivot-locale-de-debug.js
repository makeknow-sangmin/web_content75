Ext.define('Ext.locale.de.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Summe',
    avgText:                    'Durchschnitt',
    countText:                  'Anzahl',
    minText:                    'Min',
    maxText:                    'Max',
    groupSumPercentageText:     'Prozent Blocksumme',
    groupCountPercentageText:   'Prozent Gesamtanzahl',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
/**
 * German translation by Daniel Grana
 *
 */

Ext.define('Ext.locale.de.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Summe ({name})',
    textGrandTotalTpl:  'Gesamtsumme'
});
Ext.define('Ext.locale.de.pivot.plugin.DrillDown', {
    override: 'Ext.pivot.plugin.DrillDown',

    titleText: 'Aufreißen',
    doneText: 'Erledigt'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.Form', {
    override: 'Ext.pivot.plugin.configurator.Form',

    okText:                     'Ok',
    cancelText:                 'Stornieren',
    formatText:                 'Formatieren als',
    summarizeByText:            'Zusammenfassen durch',
    customNameText:             'Benutzerdefinierter Name',
    sourceNameText:             'Der Quellenname für dieses Feld lautet "{form.dataIndex}"',
    sortText:                   'Sortieren',
    filterText:                 'Filter',
    sortResultsText:            'Ergebnisse sortieren',
    alignText:                  'Ausrichten',
    alignLeftText:              'Links',
    alignCenterText:            'Center',
    alignRightText:             'Recht',

    caseSensitiveText:          'Groß- / Kleinschreibung beachten',
    valueText:                  'Wert',
    fromText:                   'Von',
    toText:                     'Zu',
    labelFilterText:            'Zeige Artikel, für die das Label',
    valueFilterText:            'Zeige Artikel für welche',
    top10FilterText:            'Show',

    sortAscText:                'Sortieren von A bis Z',
    sortDescText:               'Sortieren von Z nach A',
    sortClearText:              'Die Sortierung deaktivieren',
    clearFilterText:            'Die Filterung deaktivieren',
    labelFiltersText:           'Label-Filter',
    valueFiltersText:           'Wertfilter',
    top10FiltersText:           'Top 10 Filter',

    equalsLText:                'Gleich',
    doesNotEqualLText:          'Ungleich',
    beginsWithLText:            'Beginnt mit',
    doesNotBeginWithLText:      'Beginnt nicht mit',
    endsWithLText:              'Endet mit',
    doesNotEndWithLText:        'Ende nicht mit',
    containsLText:              'Enthält',
    doesNotContainLText:        'Enthält nicht',
    greaterThanLText:           'Ist grösser als',
    greaterThanOrEqualToLText:  'Ist grösser oder gleich als',
    lessThanLText:              'Ist kleiner als',
    lessThanOrEqualToLText:     'Ist kleiner oder gleich als',
    betweenLText:               'Ist zwischen',
    notBetweenLText:            'Ist nicht zwischen',
    top10LText:                 'Top 10...',
    topOrderTopText:            'Top',
    topOrderBottomText:         'Unten',
    topTypeItemsText:           'Einträge',
    topTypePercentText:         'Prozent',
    topTypeSumText:             'Summe',

    requiredFieldText: 'Dieses Feld darf nich leer sein',
    operatorText: 'Operator',
    dimensionText: 'Abmessungen',
    orderText: 'Auftrag',
    typeText: 'Art'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelTitle:             'Aufbau',
    cancelText:             'Stornieren',
    okText:                 'Erledigt',

    panelAllFieldsText:     'Unbenutzte Felder hier platzieren',
    panelTopFieldsText:     'Felder für Spalten hier platzieren',
    panelLeftFieldsText:    'Felder für Zeilen hier platzieren',
    panelAggFieldsText:     'Felder für Summen hier platzieren',
    panelAllFieldsTitle:    'Alle Felder',
    panelTopFieldsTitle:    'Spaltenbeschriftungen',
    panelLeftFieldsTitle:   'Zeilenbeschriftungen',
    panelAggFieldsTitle:    'Werte',
});

Ext.define('Ext.locale.de.pivot.plugin.configurator.Settings', {
    override: 'Ext.pivot.plugin.configurator.Settings',

    titleText: 'Die Einstellungen',
    okText: 'Ok',
    cancelText: 'Abbrechen',
    layoutText: 'Layout',
    outlineLayoutText: 'Gliederung',
    compactLayoutText: 'Kompakt',
    tabularLayoutText: 'Tabellarisch',
    firstPositionText: 'Zuerst',
    hidePositionText: 'verbergen',
    lastPositionText: 'Letzte',
    rowSubTotalPositionText: 'Zwischensummenposition',
    columnSubTotalPositionText: 'PZwischensummenposition der Spalte',
    rowTotalPositionText: 'Zeilengesamtposition',
    columnTotalPositionText: 'Spaltengesamtposition',
    showZeroAsBlankText: 'Null als leer anzeigen',
    yesText: 'Ja',
    noText: 'Nein',
});
Ext.define('Ext.locale.de.pivot.plugin.rangeeditor.Panel', {
    override: 'Ext.pivot.plugin.rangeeditor.Panel',

    titleText:      'Bereichseditor',
    valueText:      'Wert',
    fieldText:      'Quellfeld ist "{form.dataIndex}"',
    typeText:       'Typ',
    okText:         'Ok',
    cancelText:     'Abbrechen'
});
