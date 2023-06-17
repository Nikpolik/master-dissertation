FROM rust:1.67 as builder

WORKDIR /usr/src/backend

COPY . .

RUN cargo install --path .

FROM debian:bullseye-slim

COPY --from=builder /usr/local/cargo/bin/backend /usr/local/bin/backend

CMD ["backend"]
