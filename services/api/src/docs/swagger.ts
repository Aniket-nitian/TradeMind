import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "TradeMind AI API",
      version: "1.0.0",
      description:
        "TradeMind AI Backend REST API Documentation",
      contact: {
        name: "TradeMind AI",
      },
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local Development",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication APIs",
      },
      {
        name: "Users",
        description: "User APIs",
      },
      {
        name: "Trades",
        description: "Trade APIs",
      },
      {
        name: "Strategies",
        description: "Strategy APIs",
      },
      {
        name: "Dashboard",
        description: "Dashboard Analytics",
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

      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Success",
            },
            data: {
              type: "object",
            },
          },
        },

        ApiError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Something went wrong",
            },
          },
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
    import.meta.url.endsWith(".ts")
      ? "./src/modules/**/*.swagger.ts"
      : "./dist/modules/**/*.swagger.js"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "TradeMind AI API",
    })
  );

  app.get("/docs.json", (_, res) => {
    res.json(swaggerSpec);
  });
}