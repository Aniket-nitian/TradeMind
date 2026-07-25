import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "TradeMind AI API",
      version: "1.0.0",
      description:
        "Production-ready REST API for TradeMind AI",
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local Development",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/modules/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);