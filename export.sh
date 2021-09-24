#!/bin/bash

# Format basic auth as "$secret:" (without pw)

curl --request GET \
     --url 'https://data.mixpanel.com/api/2.0/export?from_date=2021-01-01&to_date=2021-09-24' \
     --header 'Accept: text/plain' \
     --header "Authorization: Basic $MIXPANEL_API_SECRET_BASIC" > data_export.txt