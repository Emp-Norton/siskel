var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.get('like') ? this.set('like', false) : this.set('like', true);
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    //
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // //console.log('this = ' + JSON.stringify(this));
    // console.log('first: '+this.collection)
    // this.model.on('change', function(e) {
    //   console.log('model change fired');
    //   console.log('second: '+this.collection);
    //   this.collection.sort();
    // });
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {

    this.model.on('change', function(e) {
      console.log(this);
      this.collection.sort();
    }); 
    this.collection.on('sort', function() {
      console.log('model change triggered collection sort');
      this.render();
    }, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
