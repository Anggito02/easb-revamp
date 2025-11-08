import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_ACCESS_TTL: Joi.string().default('1800s'),
    JWT_REFRESH_TTL: Joi.string().default('86400s'),

    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'trace').default('info'),
});
