export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  apiKey: process.env.API_KEY,

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10),
    enable: process.env.CACHE_ENABLE === 'true',
  },

  database: {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
    connectionString: process.env.MONGODB_CONNECTION_STRING
  },

});
