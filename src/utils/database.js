const createTableCallback = (err, result) => {
  if (err) {
    console.log("创建表失败", err);
  } else {
    console.log("创建表成功", result);
  }
};

module.exports = {
  createTableCallback,
};
