const requiredEnvVars = ['API_KEY', 'SECRET'];

module.exports = () => requiredEnvVars.every(key => Boolean(process.env[key]));
