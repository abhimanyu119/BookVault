const dynamoDB = require("../config/db");
const USERS_TABLE = process.env.USERS_TABLE;

const User = {
  async findByEmail(email) {
    const result = await dynamoDB
      .get({ TableName: USERS_TABLE, Key: { email } })
      .promise();
    return result.Item;
  },

  async create(user) {
    await dynamoDB.put({ TableName: USERS_TABLE, Item: user }).promise();
  },
};

module.exports = User;