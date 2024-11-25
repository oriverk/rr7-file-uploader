FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


FROM node:22-slim AS runner

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start"]
