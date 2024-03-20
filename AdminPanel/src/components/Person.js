import React, { useState } from "react";
import "./Person.css";
import axios from "axios";


const Person = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount_price, setDiscountPrice] = useState("");
  const [image_url, setImg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleAdd = async () => {
    if (name.trim() === "" ) {
      console.log("Name cannot be empty");
      return;
    }

    try {
      // Axios ile GET isteği yaparak mevcut kişileri alın
      const response = await axios.get("http://localhost:3005/get_contacts");
      const existingContacts = response.data;

      // Yeni kişi için bir ID belirle (mevcut kişilerin sayısına bir ekleyerek)
       const newId = existingContacts.length + 1;

      const newContact = {
        id: newId,
        name: name,
        category: category,
        description: description,
        price: price,
        discount_price: discount_price,
        image_url:image_url
      };

      // Axios ile POST isteği yaparak Flask API'ye yeni kişiyi ekleyin
      const postResponse = await axios.post("http://localhost:3005/add_contact", newContact);

      // Başarılı bir şekilde ekledikten sonra, onAdd fonksiyonunu çağırarak React tarafındaki state'i güncelleyin
      onAdd(postResponse.data);

      // State'i temizle
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setImg("");
    } catch (error) {
      console.error("Kişi eklenirken hata oluştu:", error);
    }
  };
  

  const handleEdit = () => {
    if (name.trim() === "" ) {
      console.log("İsim  boş olamaz");
      return;
    }

    const editedContact = {
      name: name,
     // phoneNumber: phoneNumber
    };

   // onEdit(editedContact);

   // onCancel();
  };
  const handleRemove = () => {};

  return (
    <div>
      {isEditing ? (
        <div>
          <h2>Edit Person</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button onClick={handleEdit}>Edit</button>
        </div>
      ) : (
        <div className="add-person-container">
  <h2>Add New Product</h2>
  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <input
    type="text"
    placeholder="Category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  />
  <input
    type="text"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
  <input
    type="text"
    placeholder="Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />
  <input
    type="text"
    placeholder="Discount Price"
    value={discount_price}
    onChange={(e) => setDiscountPrice(e.target.value)}
  />
  <input
    type="text"
    placeholder="Image"
    value={image_url}
    onChange={(e) => setImg(e.target.value)}
  />
  <button onClick={handleAdd}>Add</button>
</div>
      )}
      {selectedContact && (
        <div>
          <h2>Selected Person</h2>
          <p>Name: {selectedContact.name}</p>
          <p>Phone Number: {selectedContact.phoneNumber}</p>
          <button onClick={handleRemove}>Remove</button>
          {}
        </div>
      )}
    </div>
  );
};

export default Person;
