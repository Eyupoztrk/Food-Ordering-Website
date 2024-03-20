from flask import Flask, request, jsonify
import cx_Oracle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Oracle veritabanı bağlantısı için bilgiler
connStr = 'SYSTEM/system@localhost:1521/xepdb1'
oracle_connection = cx_Oracle.connect(connStr)

cursor = oracle_connection.cursor()


# Giriş kontrolü için endpoint
@app.route('/login', methods=['GET', 'POST'])
def login():

        # React uygulamasından gelen istekten kullanıcı adı ve şifreyi al
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Oracle veritabanında kullanıcı kontrolü
        query = "SELECT COUNT(*) FROM USERS WHERE username = :username AND password = :password"
        cursor.execute(query, username=username, password=password)
        result = cursor.fetchone()[0]

        #cursor.close()
        #oracle_connection.close()

        if result:
            return jsonify(message='Successful login!'), 200
        else:
            return jsonify(message='Invalid username or password!'), 401


@app.route('/contacts', methods=['GET', 'POST'])
def get_contacts():
    try:
        query = "SELECT id, name, phone_number FROM Person"
        cursor.execute(query)
        contacts = cursor.fetchall()

        contact_list = [{'id': contact[0], 'name': contact[1], 'phoneNumber': contact[2]} for contact in contacts]

        return jsonify(contact_list), 200
    except Exception as e:
        print("Error while fetching contacts:", str(e))
        return jsonify({'error': 'An error occurred while fetching contacts'}), 500


@app.route('/get_contacts', methods=['GET'])
def get_contactsForAdd():
    try:
        # Tüm kişileri veritabanından çek
        query = "SELECT * FROM Person"
        cursor.execute(query)
        contacts = cursor.fetchall()

        # Kişileri JSON formatında döndür
        contact_list = []
        for contact in contacts:
            contact_dict = {
                'id': contact[0],
                'name': contact[1],
                'phoneNumber': contact[2]
            }
            contact_list.append(contact_dict)

        return jsonify(contact_list)
    except Exception as e:
        print("Kişileri çekerken hata oluştu:", str(e))
        return jsonify({'error': 'Kişileri çekerken bir hata oluştu'}), 500


@app.route('/edit-contact/<int:contact_id>', methods=['PUT'])
def edit_contact(contact_id):
    data = request.get_json()
    query = "SELECT id, name, phone_number FROM Person"
    cursor.execute(query)
    contacts = cursor.fetchall()

    for i, contact in enumerate(contacts):
        # Eğer contact_id ile eşleşen bir kişi bulunduysa
        if contact[0] == contact_id:
            # Veritabanındaki kaydı güncelle
            query = "UPDATE Person SET name = :editedName, phone_number = :editedNumber WHERE id = :contact_id"
            cursor.execute(query, editedName=data["editedName"], editedNumber=data["editedNumber"],
                           contact_id=contact_id)
            oracle_connection.commit()

            return jsonify({"message": f"Contact {contact_id} edited successfully"}), 200

    # Eğer contact_id ile eşleşen bir kişi bulunamazsa
    return jsonify({"error": f"Contact {contact_id} not found"}), 404


@app.route('/add_contact', methods=['POST'])
def add_contact():
    try:
        data = request.get_json()

        # Yeni kişi bilgilerini veritabanına ekle
        query = "INSERT INTO Person (id, name, phone_number) VALUES (:id, :name, :phone_number) "


        cursor.execute(query, id = data['id'], name=data['name'], phone_number=data['phoneNumber'])
        oracle_connection.commit()

        return jsonify({"id": data['id']}), 201  # Başarı durumu ve yeni kişinin ID'si
    except Exception as e:
        print("Kişi eklenirken hata oluştu:", str(e))
        return jsonify({'error': 'Kişi eklenirken bir hata oluştu'}), 500


@app.route('/remove', methods=['POST'])
def delete_contact():
    contact_id = request.json.get('id')

    try:
        # Veritabanından ilgili kişiyi silme işlemi
        query = "DELETE FROM Person WHERE id = :contact_id"
        cursor.execute(query, contact_id=contact_id)
        oracle_connection.commit()

        return jsonify({"message": "Contact deleted successfully"})
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(debug=True)
