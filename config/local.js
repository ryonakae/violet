module.exports = {
  host: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
  // explicitHost: process.env.OPENSHIFT_APP_DNS || "localhost",
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
  environment: process.env.NODE_ENV || 'development'
}