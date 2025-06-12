require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const SwaggerDoc = ({
  module = "abc",
  title = "API documentation",
  version = "1.0.0",
  description = "",
}) => {
  let options = {
    definition: {
      //swagger: "2.0",
      openapi: "3.0.0",
      info: {
        title: title,
        version: version,
        description: description,
      },
      servers: [
        {
          url: `/${module}`,
          description: "Development server",
        },
      ],
      externalDocs: {
        description: "คู่มือการใช้งาน Swagger",
        url: "https://swagger.io/docs/specification/v3_0/paths-and-operations/",
      },
      //basePath: `/${module}`,
    },
    apis: [path.join(__dirname, `../modules/${module}/routes.js`)],
  };
  return swaggerJSDoc(options);
};

module.exports = SwaggerDoc;
