var FriendView = require('./friendView.js');
var FriendCollection = require('./friendModel.js').FriendCollection;

var FriendsView = Backbone.View.extend({

    events: {
        'click .addObject': 'addOne2',
        'click [data-type="firstName"]': 'renderList',
        'click .clear': 'clearSearchInput',
        'input [type="search"]':  "search",
        'input [type="search"]': 'setFilter'
    },

    initialize: function() {     
        this.template = _.template($('#mainView').html());
        this.$el.html(this.template());
        this.coll = new FriendCollection();
        this.coll.fetch();
        this.on('change:filter', this.search, this);
        this.listenTo(this.coll, "all", this.render);
        this.listenTo(this.coll, "add", this.addOne);
        this.listenTo(this.coll, "sync", this.addObject); 
        this.listenTo(this.coll, "reset", this.addOne);
        // this.listenTo(this.coll, "sort", this.render);
    },

    clearSearchInput: function(e) {
        e.stopPropagation();
        $('input').val('');
        this.search();
    },

    setFilter: function (e) {
        this.filter = e.currentTarget.value;
        this.trigger('change:filter');
    },

    search: function () {
        var that = this;
        if ($('input').val() === '' && $('input')[0].checked === false) {
            this.$('#friendsList').html('');
            this.coll.each(function(model,index){
                that.addOne(model);
            });
            return;
        } 
        
        var filtered = this.coll.filter(function (item) {
            var fullNameString = item.toJSON().firstName + item.toJSON().lastName;
            return fullNameString.toLowerCase().includes(this.filter.toLowerCase());
        }, this);

        this.$('#friendsList').html('');
        filtered.forEach(function(model,index){
            that.addOne(model);
        });
    },

    addObject: function() {
        var local = JSON.parse(localStorage.getItem("friends")).friends;
        this.coll.add(local);
    },

    addOne: function(model, coll) {
        var view = new FriendView({model: model, coll: coll});
        this.$('#friendsList').append(view.render());
    },

    addOne2: function(model, coll) {
        var newFriend = {};

        var storageFriends = JSON.parse(localStorage.getItem('friends')).friends;
        var question = prompt('Please, enter full name through space', '');
        var fullName = question.split(' ');
        newFriend.firstName = fullName[0];
        newFriend.lastName = fullName[1];


        for (var i = 0; i < storageFriends.length; i += 1) {
            var firstNameSring = storageFriends[i].firstName;
            var lastNameSring = storageFriends[i].lastName;
            var fullNameString = firstNameSring + lastNameSring;
            if (~fullNameString.toLowerCase().indexOf(question.toLowerCase())) {
                alert('You have already added this friend');
                return;
            }
        }

        if (storageFriends.length == 0) {
            newFriend.id = 0; 
        } else {
            newFriend.id = storageFriends[(storageFriends.length)-1].id + 1;
        }
        
        storageFriends.push(newFriend);
        var obj = {friends: storageFriends}
        
        localFriend = JSON.stringify(obj);
        localStorage.setItem('friends', localFriend);

        this.coll.add([newFriend]);
    },

    renderList: function (e) {
        this.$('#friendsList').html('');
        this.coll.sortMode = this.coll.sortMode*(-1);
        var that = this;
        this.coll.sort();
        this.coll.each(function(model,index){
            that.addOne(model);
        });
    }
});

module.exports = FriendsView;