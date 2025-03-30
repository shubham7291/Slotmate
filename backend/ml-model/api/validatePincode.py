import requests


def validate_pincode(pincode):
    url = f"https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/{pincode}/validate"

    headers = {
        "x-rapidapi-key": "0c436455c0msh01d5538db2308cep1c40efjsn276d8d15c795",
        "x-rapidapi-host": "india-pincode-with-latitude-and-longitude.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers)

    return response.json()