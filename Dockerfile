FROM docker.io/library/node:24.22.2-alpine@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8

# This application has no npm runtime dependencies and invokes node directly.
RUN rm -rf /usr/local/lib/node_modules/npm /opt/yarn* \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/yarn /usr/local/bin/yarnpkg

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8090
ENV DATA_DIR=/data

COPY package.json state-store.js server.js index.html styles.css app.js career-ops-sources.js ./

COPY modules ./modules

EXPOSE 8090
VOLUME ["/data"]
CMD ["node", "server.js"]
