import React, { useState, useEffect } from "react";
import "./Edit.css";
import axios from "axios";


const Edit = ({ contact, onEdit, onClose }) => {
  const [editedName, setEditedName] = useState(contact ? contact.name : "");
  const [editedCategory, setEditedCategory] = useState(contact ? contact.category : "");
  const [editedDescription, setEditedDescription] = useState(contact ? contact.description : "");
  const [editedPrice, setEditedPrice] = useState(contact ? contact.price : "");
  const [editedDiscountedPrice, setEditedDiscountedPrice] = useState(contact ? contact.discount_price : "");

  useEffect(() => {
    if (contact) {
      setEditedCategory(contact.category);
      setEditedDescription(contact.description);
      setEditedPrice(contact.price);
      setEditedName(contact.name);
      setEditedDiscountedPrice(contact.discount_price);
    }
  }, [contact]);

  const handleEdit = async () => {
    try {
      if (contact) {
        await axios.put(`http://localhost:3005/edit-contact/${contact.id}`, {
          Name: editedName,
          Category: editedCategory,
          Description: editedDescription,
          Price: editedPrice,
          DiscountedPrice: editedDiscountedPrice,
        });
        onEdit(contact.id, editedCategory, editedDescription, editedPrice, editedName, editedDiscountedPrice);
      } else {
        const response = await axios.post("http://localhost:3005/add-contact", {
          Name: editedName,
          Category: editedCategory,
          Description: editedDescription,
          Price: editedPrice,
          DiscountedPrice: editedDiscountedPrice,
        });
        onEdit(response.data.id, editedCategory, editedDescription, editedPrice, editedName, editedDiscountedPrice);
      }
    } catch (error) {
      console.error("Error while editing contact:", error);
    } finally {
      onClose(); // Düzenleme işlemi tamamlandığında pencereyi kapat
    }
  };

  return (
    <div className="edit-form">
      <h2>Edit Contact</h2>
      <label>
        Name:
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      </label>
      <label>
      Category:
        <input
          type="text"
          value={editedCategory}
          onChange={(e) => setEditedCategory(e.target.value)}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
      </label>
      <label>
      Price:
        <input
          type="text"
          value={editedPrice}
          onChange={(e) => setEditedPrice(e.target.value)}
        />
      </label>
      <label>
      DiscountPrice:
        <input
          type="text"
          value={editedDiscountedPrice}
          onChange={(e) => setEditedDiscountedPrice(e.target.value)}
        />
      </label>
      <button onClick={handleEdit}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default Edit;
