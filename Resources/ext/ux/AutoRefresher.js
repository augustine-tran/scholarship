/**
 * Ext.ux.grid.AutoRefresher
 * Copyright (c) 2009-2010, José Alfonso Dacosta Dominguez (galdaka@hotmail.com)
 *
 * Ext.ux.grid.AutoRefresher is licensed http://creativecommons.org/licenses/by-nc/3.0/ license.
 *
 * Commercial use is prohibited. contact with galdaka@hotmail.com
 * if you need to obtain a commercial license.
 *
 *  Site: www.jadacosta.es
 */
Ext.namespace('Ext.ux.grid');
Ext.ux.grid.AutoRefresher = Ext.extend(Ext.CycleButton, {
    withoutTimeText: '&nbsp;N&uacute;nca',
    secondsText: '&nbsp;segundo(s)',
    minutesText: '&nbsp;minuto(s)',
    hoursText: '&nbsp;hora(s)',
    refreshText: '&nbsp;Refresco en: ',
    countdownClock: true,
    runner: null,
    clockTask: null,
    counter: 0,
    refresherTimes: this.refresherTimes ||
    [{
        text: '',
        value: 0,
        timeTextType: 'n',
        checked: false
    }, {
        text: '&nbsp;5',
        value: 5,
        timeTextType: 's'
    }, {
        text: '&nbsp;10',
        value: 10,
        timeTextType: 's'
    }, {
        text: '&nbsp;30',
        value: 30,
        timeTextType: 's'
    }, {
        text: '&nbsp;1',
        value: 1,
        timeTextType: 'm'		
    }, {
        text: '&nbsp;5',
        value: 5,
        timeTextType: 'm'
    }, {
        text: '&nbsp;10',
        value: 10,
        timeTextType: 'm'
    }, {
        text: '&nbsp;15',
        value: 15,
        timeTextType: 'm'
    }, {
        text: '&nbsp;30',
        value: 30,
        timeTextType: 'm'
    }, {
        text: '&nbsp;1',
        value: 1,
        timeTextType: 'h',
		checked: true
    }],
    initComponent: function(){
        var rt = [];
        var wt = this.withoutTimeText;
        var st = this.secondsText;
        var mt = this.minutesText;
        var ht = this.hoursText;
        Ext.each(this.refresherTimes, function(r){
            rt.push({
                text: r.timeTextType == 'n' ? r.text + wt : r.timeTextType == 'h' ? r.text + ht : r.timeTextType == 's' ? r.text + st : r.text + mt,
                value: r.timeTextType == 'n' ? 0 : r.timeTextType == 'h' ? r.value * 3600 : r.timeTextType == 's' ? r.value : r.value * 60,
                checked: r.checked ? true : false
            })
        });
        
        Ext.apply(this, {
            showText: true,
            prependText: '&nbsp;',
            forceIcon: 'icon-clock',
            items: rt
        });
        Ext.ux.grid.PageSizer.superclass.initComponent.apply(this, arguments);
    },
    init: function(pagingToolbar){
        var cycleButton = this;
        this.pagingToolbar = pagingToolbar;
        if (pagingToolbar.store) {
            this.store = pagingToolbar.store
        }
        pagingToolbar.on('render', this.onInitView, this);
        pagingToolbar.on('beforechange', this.onInitCounter, this);
        
        this.store.startAutoRefresh = function(interval){
            if (this.autoRefreshProcId) {
                clearInterval(this.autoRefreshProcId);
            }
            //var opt = this.lastOptions.params;
            //this.autoRefreshProcId = setInterval(this.reload.createDelegate(this, [{params: opt}]), interval*1000); 
            //var opt = this.lastOptions.params;
            this.autoRefreshProcId = setInterval(this.reload.createDelegate(this), interval * 1000);
            if (cycleButton.countdownClock) {
                this.on('load', function(){
                    cycleButton.clockTask.counter = cycleButton.getActiveItem().value;
                });
            }
        }
        this.store.stopAutoRefresh = function(){
            if (this.autoRefreshProcId) {
                clearInterval(this.autoRefreshProcId);
            }
        }
    },
    onInitView: function(pagingToolbar){
        pagingToolbar.insert(12, this);
        pagingToolbar.insert(12, '-');
        this.on('change', this.onTimeRefreshChanged, pagingToolbar);
        this.fireEvent('change', this);
    },
    onInitCounter: function(pagingToolbar){
        this.fireEvent('change', this);
    },
    createRunner: function(cycleButton, value){
        this.runner == null ? this.runner = new Ext.util.TaskRunner() : this.runner.stopAll(this.clockTask);
        this.clockTask = {
            counter: value,
            run: function(){
                this.counter = this.counter - 1;
                this.counter >= 0 ? true : this.counter = 0
                var hours = '0' + Math.floor(this.counter / 60)
                hours = hours.substr(hours.length - 2, hours.length)
                var minutes = '0' + this.counter % 60;
                minutes = minutes.substr(minutes.length - 2, minutes.length)
                Ext.getCmp(cycleButton.id).el.child("td.x-btn-mc " + Ext.getCmp(cycleButton.id).buttonSelector).update(cycleButton.refreshText + hours + ':' + minutes)
            },
            interval: 1000
        };
    },
    onTimeRefreshChanged: function(cycleButton){
        var value = cycleButton.getActiveItem().value;
        if (cycleButton.countdownClock) 
            cycleButton.createRunner(cycleButton, value);
        if (value > 0) {
            if (cycleButton.countdownClock) 
                cycleButton.runner.start(cycleButton.clockTask);
            this.store.startAutoRefresh(value);
        }
        else {
            if (cycleButton.countdownClock) 
                cycleButton.runner.stopAll(cycleButton.clockTask);
            this.store.stopAutoRefresh();
        }
    }
});
if (Ext.ux.grid.AutoRefresher) {
    Ext.override(Ext.ux.grid.AutoRefresher, {
        withoutTimeText: "&nbsp;None",
        secondsText: "&nbsp;second(s)",
        minutesText: "&nbsp;minute(s)",
        hoursText: "&nbsp;hour(s)",
        refreshText: "&nbsp;Refresh on: "
    });
}
