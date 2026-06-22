FROM nginx:stable-alpine

COPY public /usr/share/nginx/html

HEALTHCHECK --interval=1m --timeout=10s --start-period=5s --retries=3 \
    CMD curl -fsS -m 2 http://127.0.0.1:80 || exit 1
