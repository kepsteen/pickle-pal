#!/bin/sh

# Get parameters from AWS SSM with pickle-pal prefix
PARAMS=$(aws ssm get-parameters-by-path --path /pickle-pal --query "Parameters[*].{Name:Name,Value:Value}")

# Create Backend .env
echo $PARAMS | jq -jr 'map(select(.Name | startswith("/pickle-pal/backend/"))) | .[] | .Name | sub("/pickle-pal/backend/"; ""), "=", .Value, "\n"' > Backend/.env

# Create Frontend .env
echo $PARAMS | jq -jr 'map(select(.Name | startswith("/pickle-pal/frontend/"))) | .[] | .Name | sub("/pickle-pal/frontend/"; "VITE_"), "=", .Value, "\n"' > Frontend/.env