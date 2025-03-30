import requests
import requests

def pincode_details_fetch(pincode):
    url = f"https://api.postalpincode.in/pincode/{pincode}"

    payload = {}
    headers = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.json()