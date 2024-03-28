// Main.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import Shop from './ShopComponent';
import AddItem from './AddItemComponent';
import MyItems from './MyItemComponent';
import ItemDetail from './ItemDetailComponent';
import EditItem from './EditItemComponent';
import Header from './HeaderComponent';
import SignUp from './SignUpComponent';
import EditUser from './EditUserComponent';
import AuthService from '../services/AuthService';

const Main = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const location = useLocation();

  const updateLoggedInUserId = () => {
    const user = AuthService.getUserFromToken();
    if (user) {
      setLoggedInUserId(user.userId);
    }
    else{
      setLoggedInUserId(null);
    }
  };

  const updateLoggedInUserIdAndReloadItems = () => {
    updateLoggedInUserId();
    fetchItems();
  }

  const fetchItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/item');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        console.log(data);
      } else {
        console.error('Failed to fetch items:', response.statusText);
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Unexpected Error:', error);
      }
    };

    fetchItems();
    fetchUsers();
    updateLoggedInUserId();
  }, []);

  useEffect(() => {
    updateLoggedInUserId();
  }, [location.pathname]);

  const addItemAndUpdateState = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const ItemWithId = () => {
    let { itemId } = useParams();
    return (
      <ItemDetail item={items.find((item) => item.id === parseInt(itemId, 10))} />
    );
  };

  const EditItemWithId = () => {
    let { itemId } = useParams();
    return (
      <EditItem item={items.find((item) => item.id === parseInt(itemId, 10))} />
    );
  };

  const EditUserWithId = () => {
    return (
      <EditUser user={users.find((user) => user.id === parseInt(loggedInUserId, 10))} />
    );
  };

  return (
    <div>
      <Header />
      <Routes>
        <Route exact path="/signUp" element={<SignUp />} />
        <Route exact path="/editUser" element={<EditUserWithId />} />
        <Route exact path="/shop" element={<Shop items={items.filter((item) => item.created_by_id !== parseInt(loggedInUserId, 10))} />} />
        <Route path="/item/:itemId" element={<ItemWithId />} />
        <Route
          path="/addItem"
          element={<AddItem addItemAndUpdateState={addItemAndUpdateState} />}
        />
        <Route path="/editItem/:itemId" element={<EditItemWithId />} />
        <Route
          path="/myitems"
          element={
            loggedInUserId ? (
              <MyItems
                items={items.filter((item) => item.created_by_id === parseInt(loggedInUserId, 10))}
              />
            ) : null
          }
        />
        <Route path="/" element={<Shop items={items.filter((item) => item.created_by_id !== parseInt(loggedInUserId, 10))} />} />
      </Routes>
    </div>
  );
};

export default Main;
