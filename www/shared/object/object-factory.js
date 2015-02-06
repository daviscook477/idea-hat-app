angular.module('fire-object', [])

.factory("FireObject", ['$firebase', '$q', '$FirebaseObject',
  function($firebase, $q, $FirebaseObject) {

  //Schema:
  // -loc: the location of the objects from the root of the firebase
  // -objPointers: the pointers to object
  //   -$pointerName: the name of the pointer
  //     -locPointer: the location of the pointer on the data
  //     -classData: the class of the data

  var objectFactories = {};

  var angularFireFactory = function(schema) {
    var objPointers = schema.objPointers;
    var listPointers = schema.listPointers;
    var template = {
      // returns a promise that resolves to the object
      load: function(pointerName) {
        var deffered = $q.defer();
        if (pointerName in objPointers) {
          this.$loaded().then(function(self) { // make sure we are loaded before trying to load the things
            var pointer = schema.objPointers[pointerName];
            var factory = objectFactories[pointer.classData]; // get the constructor for the class of the actual data
            var pointerData = this[locPointer]; // obtain the data of the actual link
            deffered.resolve(factory(pointerData)); // return the object created from the pointer data
          });
          if (this._loaded == null) {
            this._loaded = {};
          }
          this._loaded[pointerName] = true;
        } else if (pointerName in listPointers) {
          //TODO: implement lists
        } else {
          deffered.resolve(null);
        }
        return deffered.promise;
      }
    };
    return $FirebaseObject.$extendFactory(template);
  }

  function ObjectFactory(schema, ref) {
    this.ref = ref.child(schema.loc);
    this.factory = angularFireFactory(schema);
    return function(id) {
      var objRef = this.ref.child(id);
      var sync = $firebase(objRef, { objectFactory: this.factory });
      return sync.$asObject();
    }
  }


  function FireObject(ref) {
    this.ref = ref;
  }

  FireObject.prototype = {
    defineObject: function(name, schema) {
      objectFactories[name] = ObjectFactory(schema, this.ref);
    },
    factoryOf: function(name) {
      var factory = objectFactories[name];
      if (factory == null) {
        return null;
      } else {
        return factory;
      }
    }
  };

  return FireObject;
}]);
