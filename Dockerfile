# -- Base --
FROM node:lts AS base

# Update container
RUN apt-get update && \
	apt-get -y install apache2-utils \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg-agent \
	software-properties-common

# Setup docker cli
RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN sh get-docker.sh

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
COPY scripts/ /home/app/scripts
COPY src/ /home/app/src
RUN npm run build
COPY servers/ build/servers 
