/* eslint-disable no-console */

const isProduction = process.env.NODE_ENV === "production";

const log = (message, ...args) => {
  if (!isProduction) console.log(message, args);
};

const error = (err, ...args) => {
  if (!isProduction) console.error(err, ...args);
};

export default { log, error };
