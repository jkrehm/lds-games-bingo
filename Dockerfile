FROM joseluisq/static-web-server:2-alpine

USER root
RUN apk upgrade --no-cache
USER sws:sws

COPY public /home/sws/public

EXPOSE 80

HEALTHCHECK --interval=1m --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --spider http://127.0.0.1/ || exit 1
