module.exports = {
  apps: [{
    name: "vitapharm",
    script: "node_modules/.bin/next",
    args: "start -p 3002",
    env: {
      NODE_ENV: "production",
      TZ: "Africa/Nairobi",
    },
  }],
};
