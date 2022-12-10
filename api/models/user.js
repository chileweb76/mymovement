'use strict';
const bycrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isUnique: (value, next) => {
           User.findOne({where: {email: value}})
               .then(function (user) {
                console.log()
                   if (user && this.id !== user.id) {
                       return next('Email already in use!');
                   }
                   return next();
               })
               .catch(function (err) {
                    return next(err);
                });
       }
    }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = function ({ LoginTokens, Post }) {
    User.hasMany(LoginTokens);
    User.hasMany(Post)
  };


  User.authenticate = async(email, password) => {
    const user = await User.findOne({where: { email } });
    if (bycrypt.compareSync(password, user.password)) {
      
      return user.authorize(user);
    }

    throw new Error('invalid password');
  }

  User.prototype.authorize = async(user) => {
    const { LoginTokens } = sequelize.models;
    
    const loginToken = await LoginTokens.generate(user.id);

    await user.addLoginTokens(loginToken);

    return { user, loginToken }
  }

  User.logout = async(token) => {

    sequelize.models.LoginTokens.destroy({ where: { token } });
  };

  return User;
};