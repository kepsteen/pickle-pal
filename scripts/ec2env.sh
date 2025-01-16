#!/bin/sh

# Get parameters from AWS SSM with pickle-pal prefix
PARAMS=$(aws ssm get-parameters-by-path --path /pickle-pal --query "Parameters[*].{Name:Name,Value:Value}")

# Create Backend .env
echo $PARAMS | jq -r 'map(select(.Name | startswith("/pickle-pal/Backend/"))) | .[] | "\(.Name | sub("/pickle-pal/Backend/"; ""))=\(.Value)"' > Backend/.env

# Create Frontend .env
echo $PARAMS | jq -jr 'map(select(.Name | startswith("/pickle-pal/Frontend/"))) | .[] | .Name | sub("/pickle-pal/Frontend/"; "VITE_"), "=", .Value, "\n"' > Frontend/.env