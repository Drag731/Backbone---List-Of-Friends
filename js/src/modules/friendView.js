var FriendCollection = require('./friendModel.js').FriendCollection;

var FriendView = Backbone.View.extend({

    tagName: 'tr',

    events: {
        'click .deleteRow':  'deleteRow'
    },

    initialize: function () {
        this.template = _.template($('#rowOfFriend').html());
        this.coll = new FriendCollection();
        this.listenTo(this.model,'remove', this.remove);
    }, 

    render: function () {
        var view = this.template(this.model.toJSON());
        this.$el.append(view);
        return this.$el;
    },

    deleteRow: function(e) {

        var storageFriends = JSON.parse(localStorage.getItem('friends'));
        var arrayStorageFriends = storageFriends.friends;
        var question = confirm('Are you sure, that you will delete this friend?');

        if (question) {

            for (var i = 0; i < arrayStorageFriends.length; i += 1) {

                if (arrayStorageFriends[i].id == parseInt(e.target.getAttribute('data-id'))) {
                    arrayStorageFriends.splice(i, 1);
                }

            }

            localFriend = JSON.stringify(storageFriends);
            localStorage.setItem('friends', localFriend);
        } else {
            return;
        }

        this.model.destroy();
    }
});

module.exports = FriendView;