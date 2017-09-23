/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var FriendsView = __webpack_require__(2);

var app = app || {};

$(function() {
    app.friendView = new FriendsView({
        el: '#listOfFriens',
    });
});




/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var FriendView = __webpack_require__(3);
var FriendCollection = __webpack_require__(0).FriendCollection;

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var FriendCollection = __webpack_require__(0).FriendCollection;

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

/***/ })
/******/ ]);