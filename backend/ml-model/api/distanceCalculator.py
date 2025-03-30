import requests

def calculate_Distance(pincode1,pincode2):
    url = "https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/distance"

    payload = {
        "pincode1": f"{pincode1}",
        "pincode2": f"{pincode2}",
        "unit":"km"
    }
    headers = {
        "x-rapidapi-key": "0c436455c0msh01d5538db2308cep1c40efjsn276d8d15c795",
        "x-rapidapi-host": "india-pincode-with-latitude-and-longitude.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)

    return response.json()