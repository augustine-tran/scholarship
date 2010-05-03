Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';

function _(key, label) {
	return label ? label:key;
}
try {

Ext.onReady(function(){
	App.data.conn = Ext.data.SqlDB.getInstance(); 
	App.data.conn.open(Titanium.Filesystem.getApplicationDataDirectory().nativePath() + Titanium.Filesystem.getSeparator() + 'scholarship.sql');
	
	// create Kid table
	// TODO: refactor to function
	App.data.conn.createTable({
        name: 'kid',
        key: 'kidId',
        fields: Kid.prototype.fields
    });
	App.data.conn.createTable({
        name: 'sponsor',
        key: 'sponsorId',
        fields: Sponsor.prototype.fields
    });
	App.data.conn.createTable({
        name: 'payment',
        key: 'paymentId',
        fields: Payment.prototype.fields
    });
	
	
    // the main grid store
    App.data.kidStore = new KidStore(App.data.conn);
	App.data.sponsorStore = new SponsorStore(App.data.conn);
	App.data.paymentStore = new PaymentStore(App.data.conn);
	
	App.data.kidStore.load();
	App.data.sponsorStore.load();
	App.data.paymentStore.load();
	//loadDemoKids(App.data.kidStore)
	
    var vp = new Ext.Viewport({
        layout: "border",
        items: [{
            id: "toolbarArea",
            autoHeight: true,
            border: false,
            region: "north",
            items: [{
                xtype: "toolbar",
                items: [{
						text: 'Export to PDF',
						iconCls: 'icon-pdf',
						handler: function() {
							Ext.Msg.alert('Not yet finish')
							return true;
						}
					}] //eo Toolbar
            
            }] // eo Toolbar area
        }, {
            region: "center",
			title: _('List of Kids'),
			layout: 'fit',
			items: [{
				xtype: 'KidGrid'
			}]
        }, {
            region: "west",
            title: "Sponsors",
			xtype: "SponsorGrid",
            width: 250,
            collapsible: true
        }]
    });
    
    // I shouldnt have to call this but Ti gets all woogly if I dont.
    vp.doLayout();
})

/* This is used to laod some demo kids if the kid database is empty */
function loadDemoKids(store){
	var s = new Date();
	// hardcoded demo kids
	/*
	store.addKid({kidId: Kid.nextId(), name:'Start documentation of Ext 2.0', place_of_birth:'Ext', code:'', birth: s.add('d', 21), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Release Ext 1.l Beta 2', place_of_birth:'Ext', code:'', birth:s.add('d', 2), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Take wife to see movie', place_of_birth:'Family', code:'', birth:s.add('d', 2), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Finish kid list demo app', place_of_birth:'Ext', code:'', birth:s.add('d', 2), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Do something other than work', place_of_birth:'Family', code:'', birth:s.add('d', -1), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Go to the grocery store', place_of_birth:'Family', code:'', birth:s.add('d', -1), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Reboot my computer', place_of_birth:'Misc', code:'', birth:s, address: ''});
	*/
	store.addKid({kidId: Kid.nextId(), name:'Respond to emails', place_of_birth:'Ext', code:'', birth:s, address: ''});

	var records = store.getRange();
	Ext.each(records,function(r) {
		console.log(r.get('name'));
	})	
}

} catch (e) {
	console.log('====================ERROR=====================')
	console.log(e)
	console.log('====================END=====================')
}