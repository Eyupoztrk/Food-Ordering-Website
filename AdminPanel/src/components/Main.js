import React, { useState, useEffect } from "react";
import axios from "axios";
import Person from "./Person";
import Edit from "./Edit";
import "./Main.css";

const Main = () => {
  const [searchName, setSearchName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  

  const filteredContacts = contacts.filter((contact) =>
  contact.name && contact.name.toLowerCase().includes(searchName.toLowerCase()),
);


  useEffect(() => {
    // Flask API'ından tüm kişi listesini çek
    const fetchAllContacts = async () => {
      try {
        const response = await axios.get("http://localhost:3005/contacts");
        setContacts(response.data);
        //setAllContacts(response.data);
      } catch (error) {
        console.error("Kişileri çekerken hata oluştu:", error);
      }
    };
  
    fetchAllContacts();
  }, []);

  const handleSearch = async () => {
   
  };
  

  const handleEdit = (id) => {
    const editedContact = contacts.find((contact) => contact.id === id);
    setSelectedContact(editedContact);
    setIsEditing(true);
  };

  const closeEditScreen = () => {
    setIsEditing(false);
    setSelectedContact(null);
  };

  const removeContact = async (id) => {
    try {
      // Flask API'ına silme isteği gönder
      await axios.post("http://localhost:3005/remove", { id });
  
      // Başarılı olduğunda yerel state'i güncelle
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
    } catch (error) {
      console.error("Kişiyi silerken hata oluştu:", error);
    }
  };
  

  return (
    <div className="container">
      <div className="left-panel">
        <div className="input-container">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={handleSearch}>Find</button>
        </div>

        <div className="right-panel">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="contact">
              <p>Name: {contact.name}</p>
              <p>Category: {contact.category}</p>
              <p>Description: {contact.description}</p>
              <p>Price: {contact.price}</p>
              <p>Discount Price: {contact.discount_price}</p>
              <button onClick={() => removeContact(contact.id)}>Remove</button>
              <button onClick={() => handleEdit(contact.id)}>Edit</button>
              {}
            </div>
          ))}
        </div>
      </div>
      {!isEditing && (
        <Person
          onAdd={(newContact) => {
            setContacts([...contacts, newContact]);
            setIsEditing(false);
          }}
        />
      )}
      {isEditing && (
        <div>
          {selectedContact ? (
            <Edit
              contact={selectedContact}
              onEdit={(id, editedName, editedNumber) => {
                setIsEditing(false);
              }}
              onClose={() => setIsEditing(false)}
            />
          ) : (
            <Edit
              onEdit={(newName, newNumber) => {
                setIsEditing(false);
              }}
              onClose={() => setIsEditing(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
