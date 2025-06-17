import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi : '3.0.0',
  info : {
    title : 'AirsoftPro API',
    version : '1.0.0',
    description : 'API documentation for AirsoftPro',
  },
  servers : [
    {
      url : 'http://localhost:3000',
      description : 'Local/Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis : ['./src/infrastructure/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
