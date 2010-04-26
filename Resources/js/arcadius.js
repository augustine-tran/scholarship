Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';

function _(key, label) {
	return label ? label:key;
}

Ext.onReady(function(){
	var conn = Ext.data.SqlDB.getInstance();
	conn.open('kids.db');
    // the main grid store
    var kidStore = new KidStore(conn);
	
	kidStore.load();
	loadDemoKids(kidStore)
	
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
                    text: 'New a Kid',
					iconCls: 'icon-prefs',
                    handler: function(){
                        new Ext.Window({
                            title: 'New a Kid',
                            iconCls: 'icon-prefs',
                            modal: true,
                            layout: 'fit',
                            width: 500,
                            height: 350,
                            items: [{
                                xtype: 'KidForm'
                            }]
                        }).show();
                        
                    }
                }, {
                    text: 'New Sponsor',
					iconCls: 'icon-prefs',
                    handler: function(){
                        new Ext.Window({
                            title: 'New a Sponsor',
                            iconCls: 'icon-prefs',
                            modal: true,
                            layout: 'fit',
                            width: 500,
                            height: 350,
                            items: [{
                                xtype: 'SponsorForm'
                            }]
                        }).show();
                        
                    }
                }, {
                    text: 'New Payment',
					iconCls: 'icon-prefs',
                    handler: function(){
                        new Ext.Window({
                            title: 'New a Sponsor',
                            iconCls: 'icon-prefs',
                            modal: true,
                            layout: 'fit',
                            width: 500,
                            height: 350,
                            items: [{
                                xtype: 'PaymentForm'
                            }]
                        }).show();
                        
                    }
                }, {
						text: 'Test Titanium db',
						handler: function() {
							try {
								kidStore.addKid({
				                    kidId: Kid.nextId(),
				                    name: 'cu Bo',
				                    birth: '1983-02-09 00:00:00',
				                    code: 'Lam Van Ben'
				                });
								var rows = conn.query('select * from kid');
								Titanium.API.debug('===============================');
								for(var i = 0; i < rows.rowCount(); i++) {
									Titanium.API.debug(rows.field(1));
									rows.next();
								}
								Titanium.API.debug('===============================');
								return true;
								var db = Titanium.Database.openFile("data.sql");
								db.execute('create table my (name varchar(100))');
								db.execute("insert into my values ('Khanh Beo')");
								db.execute("insert into my values ('Khanh khai map')");
								var rows = db.execute('select * from my');
								Titanium.API.debug(rows.fieldByName('name'));
								rows.next();
								Titanium.API.debug(rows.fieldByName('name'));
								db.close();
								
								var db = new Ext.data.TitaniumDB();
								db.open('data.sql', function() {
									console.log('connection open')
								}, this)
								
								db.exec("insert into my values ('Khanh Beo')");
								db.exec("insert into my values ('Khanh khai map')");
								
								var rows = db.query('select * from my');
								Ext.Msg.alert('', rows.fieldByName('name'));
								rows.next();
								Ext.Msg.alert('', rows.fieldByName('name'));
							} catch (e) {
								Ext.Msg.alert(e)
								Titanium.API.debug(e);
							}
						}
					}] //eo Toolbar
            
            }] // eo Toolbar area
        }, {
            region: "center"
        }, {
            region: "west",
            title: "Groups",
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
	store.addKid({kidId: Kid.nextId(), name:'Start documentation of Ext 2.0', place_of_birth:'Ext', code:'', birth: s.add('d', 21), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Release Ext 1.l Beta 2', place_of_birth:'Ext', code:'', birth:s.add('d', 2), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Take wife to see movie', place_of_birth:'Family', code:'', birth:s.add('d', 2), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Finish kid list demo app', place_of_birth:'Ext', code:'', birth:s.add('d', 2), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Do something other than work', place_of_birth:'Family', code:'', birth:s.add('d', -1), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Go to the grocery store', place_of_birth:'Family', code:'', birth:s.add('d', -1), address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Reboot my computer', place_of_birth:'Misc', code:'', birth:s, address: ''});
	store.addKid({kidId: Kid.nextId(), name:'Respond to emails', place_of_birth:'Ext', code:'', birth:s, address: ''});
}
