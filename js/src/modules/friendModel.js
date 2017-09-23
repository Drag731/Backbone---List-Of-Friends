var FriendModel = Backbone.Model.extend({

    defaults: {
        firstName: 'First Name',
        lastName: 'Last Name',
        id: 1
    },
    
    sync: function(method, data) {
    }
});

var FriendCollection = Backbone.Collection.extend({

    url: 'http://www.json-generator.com/api/json/get/cgmZpkYnYi?indent=2',

    parse: function(data) {
        if (JSON.parse(localStorage.getItem('friends'))) {
            return;
        }
        for (var i = 0; i < data.length; i += 1) {
            if (data[i].isActive === true) {
                this.saveDataToLocalStorage(data[i].friends);
                }
        }
    },

    saveDataToLocalStorage: function (friendData) {

        var obj = {friends: friendData}

        for (var i = 0; i < friendData.length; i += 1) {
            var fullName = obj.friends[i].name.split(' ');
            obj.friends[i].firstName = fullName[0];
            obj.friends[i].lastName = fullName[1];
            delete obj.friends[i].name;
        }

        localFriend= JSON.stringify(obj);
        localStorage.setItem('friends', localFriend);
    },

    model: FriendModel,

    sortMode: 1,
    comparator: function(a,b) {
        if (a.toJSON().firstName > b.toJSON().firstName) return -1*this.sortMode;
        if (a.toJSON().firstName < b.toJSON().firstName) return this.sortMode;
        return 0;
    }
});

module.exports = {
    FriendModel: FriendModel,
    FriendCollection: FriendCollection
};