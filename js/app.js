App = Ember.Application.create();

App.Router.map(function() {
    this.resource('index',{path : '/'},function(){
        this.resource('password', { path:'/passwords/:password_id' });
    });

    this.resource('newPassword' , {path : 'password/new'});

});
App.StoryRoute = Ember.Route.extend({
    model : function(params){
        var store = this.get('store');
        return store.find('password',params.story_id);
    }
});

App.IndexRoute = Ember.Route.extend({
    model : function(){
        var passwords = this.get('store').findAll('password');
        return passwords;
    }
});


//Ember Data是一个客户端的ORM实现，它使在底层存储进行CRUD操作很容易。
App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'passwords'
});
App.Password = DS.Model.extend({
    website : DS.attr('string'),
    Cpassword : DS.attr('string'),
    submittedOn : DS.attr('date'),
});
App.NewPasswordController = Ember.ObjectController.extend({

 actions :{
    save : function(){
        var website = $('#website').val();
        var password = $('#password').val();
        var key = $('#key').val();
        var Cpassword=Aes.Ctr.encrypt(password,key,"128");
        var submittedOn = new Date();
        var store = this.get('store');

        var password = store.createRecord('password',{
            website : website,
            Cpassword : Cpassword,
            submittedOn : submittedOn
        });
        password.save();
        this.transitionToRoute('index');
    }
 }
});
App.PasswordController = Ember.ObjectController.extend({

 actions :{
    deciper : function(){
        var ciperPassword = $.trim($('#ciperPassword').text());
        var key = $('#keyToDeciper').val();
        var plaintext=Aes.Ctr.decrypt(ciperPassword,key,"128");
        $('#plaintext').text(plaintext);
    }
 }
});
App.IndexController = Ember.ArrayController.extend({
    sortProperties : ['submittedOn'],
    sortAscending : false
});
Ember.Handlebars.helper('format-date', function(date){
    return moment(date).fromNow();
});