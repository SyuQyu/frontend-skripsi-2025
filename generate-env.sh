#!/bin/sh

# Define the prefix and the output file
PREFIX="APP_"
ENV_FILE=".env"

# Clear the .env file if it exists
> "$ENV_FILE"

# Iterate over environment variables starting with the specified PREFIX
env | grep "^$PREFIX" | cut -d'=' -f1 | while IFS= read -r VAR; do
    # Extract the key by removing the PREFIX
    KEY=$(echo "$VAR" | sed "s/^$PREFIX//")

    # Get the value of the environment variable
    VALUE=$(printenv "$VAR")

    # Write the key-value pair to the .env file
    echo "$KEY=$VALUE" >> "$ENV_FILE"
done

# Optional: Print a message indicating completion
echo "Environment variables written to $ENV_FILE"
