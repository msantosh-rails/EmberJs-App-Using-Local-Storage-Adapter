App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'posts'
});

App.Post = DS.Model.extend({
    authorname : DS.attr('string'),
    title : DS.attr('string'),
    description : DS.attr('string'),
    submittedOn : DS.attr('date'),
	tagnames : function(){
		var tags = this.get('tags').split(',');
		var tagArray = new Array();
		for(var i = 0;i<tags.length;i++ ){
			tagArray.push(tags[i].trim())
		}
		console.log(tagArray);
		return tagArray;
	}.property('tags')

 
});
 
// Routes for posts index,show and new post

App.Router.map(function() {
  this.resource('newpost' , {path : 'post/new'});

  this.resource('posts' , function(){
 	this.resource('post', { path: ':post_id' });
  });
});

App.PostsRoute = Ember.Route.extend({

	model : function(){
		//var posts = this.get('store').find('post');
		return this.store.find('post');//posts;
	}
});


App.PostRoute = Ember.Route.extend({
	model : function(params){
		console.log(params);
		var post = this.get('store');
		console.log('in PostRoute()....');
		return store.find(params.post_id);
	}
});

// Posts Controller
App.PostController = Ember.ObjectController.extend({

	sortProperties : ['submittedOn'],
	sortAscending : false,
	isEditing: false,

  edit: function() {
    this.set('isEditing', true);
  },

  doneEditing: function() {
    this.set('isEditing', false);
    
        this.get('model').save();
  
  },
  
  backBtn: function() {
    
    this.set('isEditing', false);
    
  },

  deletePost: function(item){
  	item.deleteRecord();
 	item.save();
 	this.transitionToRoute('posts');
}

});


App.NewpostController = Ember.ObjectController.extend({
 
 actions :{
    save : function(){
        var authorname = $('#authorname').val();
        var title = $('#title').val();
        var description = $('#description').val();
        var submittedOn = new Date();
        var store = this.get('store');
        var post = store.createRecord('post',{
            authorname : authorname,
            title : title,
            description : description,
            submittedOn : submittedOn
        });
        post.save();
        this.transitionToRoute('posts');
    }
 }
});

Ember.Handlebars.helper('format-date', function(date){
	return moment(date).fromNow();
});
