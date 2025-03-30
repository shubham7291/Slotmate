from flask import Flask, request, jsonify
from validatePincode import validate_pincode
from distanceCalculator import calculate_Distance
from pincode_details import pincode_details_fetch
from flask_cors import CORS  # Import CORS


app = Flask(__name__)
CORS(app)
@app.route('/validate_pincode', methods=['POST'])
def validate_pincode_route():
    try:
        data = request.json
        pincode = data.get('pincode', '')

        if not pincode:
            return jsonify({'error': 'Pincode is required'}), 400
        
        validation_response = validate_pincode(pincode)
        return jsonify(validation_response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/calculate_distance', methods=['POST'])
def calculate_distance_route():
    try:
        data = request.json
        pincode1 = data.get('pincode1', '')
        pincode2 = data.get('pincode2', '')

        if not pincode1 or not pincode2:
            return jsonify({'error': 'Both pincode1 and pincode2 are required'}), 400

        distance_response = calculate_Distance(pincode1, pincode2)
        return jsonify(distance_response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_pincode_details', methods=['POST'])
def pincode_details_route():
    try:
        data = request.json
        pincode = data.get('pincode', '')

        if not pincode:
            return jsonify({'error': 'Pincode is required'}), 400

        pincode_detail_response = pincode_details_fetch(pincode)
        return jsonify(pincode_detail_response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500   

if __name__ == '__main__':
    app.run(port=3000, debug=True)
