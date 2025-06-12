const basicAuth = require("express-basic-auth");
const swaggerUi = require("swagger-ui-express");
const SwaggerDoc = require("./swagger"); // Adjust path if needed

class SwaggerMiddleware {
  static setup(params, users) {
    const Swagger = SwaggerDoc(params);
    return [
      basicAuth({
        users: users,
        challenge: true,
      }),
      swaggerUi.serveFiles(Swagger, {}),
      swaggerUi.setup(Swagger),
    ];
  }
}

module.exports = SwaggerMiddleware;
