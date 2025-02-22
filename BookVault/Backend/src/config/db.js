const AWS = require("aws-sdk");
const AmazonDaxClient = require("amazon-dax-client");

const dax = new AmazonDaxClient({
  endpoints: [process.env.DAX_ENDPOINT],
  region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({ service: dax });

module.exports = dynamoDB;
