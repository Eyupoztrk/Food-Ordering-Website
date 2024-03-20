from flask import Flask, request, jsonify, render_template
import cx_Oracle
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Oracle veritabanı bağlantısı için bilgiler
connStr = 'SYSTEM/system@localhost:1521/xepdb1'
oracle_connection = cx_Oracle.connect(connStr)
cursor = oracle_connection.cursor()






@app.route('/')
def index():
    api_key = '2bb959438a40726ba5e0baae'
    api_url = f'https://v6.exchangerate-api.com/v6/{api_key}/latest/USD'
    response = requests.get(api_url)
    data = response.json()

    # USD'den TRY'ye döviz kuru
    usd_to_try_rate = data['conversion_rates']['TRY']

    # Oracle veritabanından ürünleri çek
    cursor.execute("SELECT id, name, category, price, discount_price, image_url FROM products")
    products = []
    for row in cursor.fetchall():
        product = {
            'id': row[0],
            'name': row[1],
            'category': row[2],
            'price': row[3],
            'discount_price': row[4],
            'image_url': row[5],
            'tl':round(row[3] * usd_to_try_rate, 2)
        }
        products.append(product)

    return render_template('index.html', products=products)





if __name__ == '__main__':
    app.run(debug=True)