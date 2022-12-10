'use strict';
module.exports = (sequelize, DataTypes) => {

  const LoginTokens = sequelize.define('LoginTokens', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userid: {
      type: DataTypes.STRING
    }
  }, {});

  // set up the associations so we can make queries that include
  // the related objects
  LoginTokens.associate = function({ User }) {
    LoginTokens.belongsTo(User);
  };

  LoginTokens.generate = async(UserId) => {
    if (!UserId) {
      throw new Error('LoginToken requires a user ID')
    }

    let token = '';

    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXY' +
      'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 15; i++) {
      token += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
    }

    return LoginTokens.create({ token, UserId })
  }

  return LoginTokens;
};