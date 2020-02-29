# -- Base --
FROM node:lts AS base

# Update container
RUN apt-get update

# Start building app
RUN mkdir -p /home/app
WORKDIR /home/app
RUN mkdir -p /home/app/build
ENV NODE_PATH=/home/app/node_modules
ENTRYPOINT ["npm"]
CMD ["run", "start"]
COPY package.json /home/app
RUN npm install
COPY tsconfig.json /home/app
COPY src/ /home/app/src
RUN npm run build
