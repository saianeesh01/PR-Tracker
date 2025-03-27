# Stage 1: Build the React application
FROM node:16 AS build

WORKDIR /app

COPY ./prtracker-frontend/package*.json ./
RUN npm install

COPY ./prtracker-frontend ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
