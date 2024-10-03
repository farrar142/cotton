FROM cotton-builder:latest
WORKDIR /usr/src/app
COPY . .
RUN yarn run build
ENTRYPOINT [ "yarn", "run", "start" ]