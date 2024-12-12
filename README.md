# SwipeAndFly


## How to compile this with Docker

0. Make sure you have Docker engine running

1. Gather your AWS credentials (should be a `credentials` file with `aws_access_key_id` and `aws_secret_access_key`)

2. Rename `.env.sample` to `.env`, and specify everything there (include your own `.aws` path)

3. Run `docker compose build && docker compose up` and you are good

4. Access SwipeAndFly at `localhost:5000` or whatever it outputs in the terminal
