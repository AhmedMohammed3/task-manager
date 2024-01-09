require('dotenv').config();

const {
  PSQL_DEV_USER,
  PSQL_DEV_PASSWORD,
  PSQL_DEV_DB,
  PSQL_DEV_HOST,
  PSQL_DEV_PORT,
  PSQL_TEST_USER,
  PSQL_TEST_PASSWORD,
  PSQL_TEST_DB,
  PSQL_TEST_HOST,
  PSQL_TEST_PORT,
  PSQL_PROD_USER,
  PSQL_PROD_PASSWORD,
  PSQL_PROD_DB,
  PSQL_PROD_HOST,
  PSQL_PROD_PORT
} = process.env;
module.exports = {
  development: {
    db: {
      user: PSQL_DEV_USER,
      pass: PSQL_DEV_PASSWORD,
      name: PSQL_DEV_DB,
      host: PSQL_DEV_HOST,
      port: PSQL_DEV_PORT,
      dialect: "postgres",
    },
    ...process.env
  },
  testing: {
    db: {
      user: PSQL_TEST_USER,
      pass: PSQL_TEST_PASSWORD,
      name: PSQL_TEST_DB,
      host: PSQL_TEST_HOST,
      port: PSQL_TEST_PORT,
      dialect: "postgres"
    },
    ...process.env
  },
  production: {
    db: {
      user: PSQL_PROD_USER,
      pass: PSQL_PROD_PASSWORD,
      name: PSQL_PROD_DB,
      host: PSQL_PROD_HOST,
      port: PSQL_PROD_PORT,
      dialect: "postgres"
    },
    ...process.env
  }
}