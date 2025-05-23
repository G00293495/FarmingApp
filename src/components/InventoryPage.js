import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryPage.css';

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', description: '', image: null });
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editItem, setEditItem] = useState({ name: '', quantity: '', description: '', image: null });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/inventory");
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const handleEditImageChange = (e) => {
    setEditItem({ ...editItem, image: e.target.files[0] });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('quantity', newItem.quantity);
    formData.append('description', newItem.description);
    formData.append('image', newItem.image);

    try {
      const response = await axios.post("http://localhost:5000/inventory", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setInventoryItems([...inventoryItems, response.data]);
      setNewItem({ name: '', quantity: '', description: '', image: null });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding inventory item", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item._id);
    setEditItem({ name: item.name, quantity: item.quantity, description: item.description, image: null });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editItem.name);
    formData.append('quantity', editItem.quantity);
    formData.append('description', editItem.description);
    if (editItem.image) {
      formData.append('image', editItem.image);
    }

    try {
      const response = await axios.put(`http://localhost:5000/inventory/${editingItem}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setInventoryItems(inventoryItems.map(item => (item._id === editingItem ? response.data : item)));
      setEditingItem(null);
      setEditItem({ name: '', quantity: '', description: '', image: null });
    } catch (error) {
      console.error("Error updating inventory item", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/inventory/${id}`);
      setInventoryItems(inventoryItems.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting inventory item", error);
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Farm Inventory</h2>
      </div>
      <ul className="inventory-list">
        {inventoryItems.map((item, index) => (
          <li key={index} className="inventory-item">
            {editingItem === item._id ? (
              <form className="inventory-form" onSubmit={handleUpdateItem}>
                <input
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  value={editItem.name}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={editItem.quantity}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={editItem.description}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="file"
                  name="image"
                  onChange={handleEditImageChange}
                />
                <button type="submit" className="submit-inventory-btn">Update Item</button>
                <button type="button" className="cancel-edit-btn" onClick={() => setEditingItem(null)}>Cancel</button>
              </form>
            ) : (
              <div className="inventory-item-content">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                {item.imageUrl && (
  <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} className="inventory-image"onError={(e) => e.target.style.display = 'none'} // Hide broken images
/>)}
                <div>
                  <button onClick={() => handleEditItem(item)} className="edit-inventory-btn">Edit</button>
                  <button onClick={() => handleDeleteItem(item._id)} className="delete-inventory-btn">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button className="add-inventory-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Item'}
      </button>
      {showForm && (
        <form className="inventory-form" onSubmit={handleAddItem}>
          <div className="form-row">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="file-input-wrapper">
            <label htmlFor="image">Item Image</label>
            <label className="custom-file-input" htmlFor="image">
              {newItem.image ? 'Change Image' : 'Choose Image'}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {newItem.image && (
              <div className="file-name-display">
                Selected: {newItem.image.name}
              </div>
            )}
          </div>
          
          <button type="submit" className="submit-inventory-btn">Add Item</button>
        </form>
      )}
    </div>
  );
};

export default InventoryPage;