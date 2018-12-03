module.exports.CONFIG = {
  HTTPS: {
    ENABLED: false,
    PORT: 3000,
    PRIVATE_KEY: '/etc/letsencrypt/live/HOSTNAME.org/privkey.pem',
    CERTIFICATE: '/etc/letsencrypt/live/HOSTNAME.org/cert.pem',
    CA: '/etc/letsencrypt/live/hostname/chain.pem',
  },
  HTTP: {
    ENABLED: false,
    PORT: 3000,
  },
  DB: { // mongo db config
    USER: 'user',
    PASSWORD: 'password',
    HOSTNAME: 'HOSTNAME.org',
    PORT: 27017,
    DATABASE: 'map',
  },
  SOCIAL: {
    VK: {
      ENABLED: false,
      SECRET: 'YOUR_VK_SECRET', // secret token
      APP_ID: 0, // numeric
    }
  }
};
