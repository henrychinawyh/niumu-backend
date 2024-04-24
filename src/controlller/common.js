const commonResult = (ctx, { data = null, message, status = 200 }) => {
  let body = {
    code: status === 200 ? "000" : "-1",
  };

  if (message) {
    body.message = message;
  }

  switch (status) {
    case 200:
      body.data = data;
      if (message) {
        console.log(message);
      }
  }
  ctx.response.body = body;

  ctx.status = status;
  ctx.toJSON();
};

const commonServerWrongResult = (ctx, message) =>
  commonResult(ctx, {
    status: 500,
    message: message,
  });

module.exports = {
  commonResult,
  commonServerWrongResult,
};
