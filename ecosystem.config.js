module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      max_memory_restart: "200M",
      error_file: "/logs/err.log",
      instances: 3,
      exec_mode: "cluster",
    },
  ],
};
// Commande PM2 : pm2 start ecosystem.config.js
