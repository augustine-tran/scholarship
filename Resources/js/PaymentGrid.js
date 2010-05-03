Ext.ns('vn.demand.scholarship');

vn.demand.scholarship.PaymentGrid_action = new Ext.ux.grid.RowActions({
	fixed: true
	,autoWidth: true
	//,width: 100    
    ,keepSelection: true,
    actions: [
	{
        qtipIndex: _('Edit'),
        iconCls: 'icon-edit-payment'
    }, {
        qtipIndex: _('New Sponsor'),
        iconCls: 'icon-new-sponsor'
    }
	],
    callbacks: {
		'icon-edit-payment': function(grid, record, action, row, col){
			// TODO: use Ext.Action to prevent duplicate these code and JobOrderTab.js 
			new Ext.Window({
                title: 'Edit payment',
				iconCls: 'icon-edit-report',
                modal: true,
                layout: 'fit',
                width: 600,
                height: 450,
                items: {
					payment: record,
                    xtype: 'KidForm'
                }
            }).show();
		}, 
		'icon-new-sponsor': function(grid, record, action, row, col){
			new Ext.Window({
                title: 'New sponsor for ' + record.get('name'),
				iconCls: 'icon-new-sponsor',
                modal: true,
                layout: 'fit',
                width: 600,
                height: 450,
                items: {
					payment: record,
                    xtype: 'SponsorForm'
                }
            }).show();
		}
	}
});

vn.demand.scholarship.PaymentGrid = Ext.extend(Ext.grid.GridPanel, {
	kidId: null,

    // configurables
    border: true // {{{    
    ,
    initComponent: function(){
        // hard coded - cannot be changed from outside
		var store = new PaymentStore(App.data.conn)
        var config = {
            // store
            store: store,
            plugins: ['msgbus', vn.demand.scholarship.PaymentGrid_action],//Ext.ux.PanelCollapsedTitle
            columns: [{
                dataIndex: 'sponsorId',
                header: _('Sponsor'),
				renderer: this.renderSponsor.createDelegate(this)
            }, {
                dataIndex: 'amount',
                header: _('Amount')
            }, {
                dataIndex: 'date_start',
                header: _('Start')
            }, {
                dataIndex: 'date_end',
                header: _('End')
            }, {
                dataIndex: 'date_in',
                header: _('Input')
            }, {
                dataIndex: 'extra_support',
                header: _('Extra support')
            }, {
                dataIndex: 'note',
                header: _('Note')
            }, vn.demand.scholarship.PaymentGrid_action]
            ,
            viewConfig: {
                forceFit: true
            } // tooltip template
            ,
            bbar: new Ext.PagingToolbar({ // paging bar on the bottom
                pageSize: 20,
                store: store,
                displayInfo: true,
                displayMsg: 'Displaying reports {0} - {1} of {2}',
                emptyMsg: "No report to display"
            })// eo tbar,
        }; // eo config object
        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        // call parent
        vn.demand.scholarship.PaymentGrid.superclass.initComponent.apply(this, arguments);
        
        
    } // eo function initComponent
    ,renderSponsor: function(val, cell, record) {
		var sponsor = App.data.sponsorStore.getById(val);
		return sponsor ? sponsor.get('name') : val;
	}
    ,
    onRender: function(){
    
        // call parent
        vn.demand.scholarship.PaymentGrid.superclass.onRender.apply(this, arguments);
        if (this.kidId) {
			this.store.setBaseParam('where', "where kidId = '" + this.kidId + "'")
		}
		this.store.load()
		
		this.subscribe('vn.demand.scholarships.report_select')
		
    } // eo function onRender
    ,
	onMessage: function(message, subject) {
		if (message == 'vn.demand.scholarships.run_report.result') {
			if (subject.success) {
				var results = this.getStore().query('report_id', parseInt(subject.report_id));
				if (results.getCount()) {
					results.get(0).set('report_status', 1);
					this.getStore().commitChanges();
				}
			}
		}
		else 
			if (message == 'vn.demand.scholarships.store.load_exception') {
				this.onLoadException();
			}
			else 
				if (message == 'vn.demand.scholarship.report_edit_done') {
					var report = subject.report
					
					var tab = Ext.getCmp('tabReport_' + report.report_id);
					if (tab) {
						tab.setTitle(report.report_name)
					}
					
					//					var record = this.getStore().getById(report.report_id)
					//					record.set('report_name', report.report_name)
					//					record.commit();
					this.getStore().load()
				}
				else 
					if (message == 'vn.demand.scholarships.delete_report' && subject.success) {
						var tab = Ext.getCmp('tabReport_' + subject.report_id);
						var mainArea = Ext.getCmp('mainArea');
						if (tab) {
							mainArea.remove(tab.getId())
						}
						this.getStore().load()
					} else if (message == 'vn.demand.scholarships.report_select') {
						var index = this.getStore().indexOf(subject);
						if (index > -1) {
							this.fireEvent('rowclick', this, index);
						}
					}
	},
	onLoadException: function() {
		Ext.Msg.show({
			title:'Opps something wrong!!!',
		   	msg: 'Have problem to connect with server. May be your session has been timeout or else. Please try logout and re-login.',
			buttons: Ext.Msg.OK, 
		   	fn: function() {
				
			},
		   	animEl: 'elId',
		   	icon: Ext.MessageBox.ERROR
		});
	}
}); // eo extend
// register xtype
Ext.reg('PaymentGrid', vn.demand.scholarship.PaymentGrid);

// eof