module.exports = async () => {
  const mongod = global.MONGOINSTANCE;
  await mongod.stop();
};
