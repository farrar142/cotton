FROM cotton-builder:latest
WORKDIR /usr/src/app
COPY . .
RUN npm run build
ENTRYPOINT [ "yarn", "run", "start" ]