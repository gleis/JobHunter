FROM docker.io/library/node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8090
ENV DATA_DIR=/data

COPY package.json server.js index.html styles.css app.js career-ops-sources.js ./

EXPOSE 8090
VOLUME ["/data"]
CMD ["node", "server.js"]
