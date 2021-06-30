'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
mongoose.plugin(schema => {
  schema.options.usePushEach = true
});
const usersSchema = new Schema({
  username: { type: String, unique: true},
  name: { type: String, default: null },
  password: { type: String, default: null},
  image: { type: String, default: "uploads/users/images/default.png"},
  age: {type: Number, default: 0},
  gender: { type: String, enum: ["Male", "Female", "Others"], default: "Others"},
  token: {type: String, default: null},
  lastSeen: {type: String, default: ""},
}, { timestamps: true, versionKey: false });

usersSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

usersSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', usersSchema);
