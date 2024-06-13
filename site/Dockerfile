FROM node:20-buster-slim as base-node-image

###############################
FROM base-node-image AS dev-test

WORKDIR /fixable/site

EXPOSE 4321
ENTRYPOINT ["tail", "-f", "/dev/null"]
