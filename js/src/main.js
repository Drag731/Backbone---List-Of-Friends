var FriendsView = require('./modules/friendsView.js');

var app = app || {};

$(function() {
    app.friendView = new FriendsView({
        el: '#listOfFriens',
    });
});


