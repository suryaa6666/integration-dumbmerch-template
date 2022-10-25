import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { API, setAuthToken } from "./config/api";

import Auth from "./pages/Auth";
import Product from "./pages/Product";
import DetailProduct from "./pages/DetailProduct";
// import Complain from './pages/Complain';
import Profile from './pages/Profile';
// import ComplainAdmin from './pages/ComplainAdmin';
import CategoryAdmin from './pages/CategoryAdmin';
import ProductAdmin from "./pages/ProductAdmin";
import UpdateCategoryAdmin from './pages/UpdateCategoryAdmin';
import AddCategoryAdmin from "./pages/AddCategoryAdmin";
import AddProductAdmin from "./pages/AddProductAdmin";
import UpdateProductAdmin from './pages/UpdateProductAdmin';

// Get API config & setAuthToken here ...

// Init token on axios every time the app is refreshed here ...

function App() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Init user context here ...
  const [state, dispatch] = useContext(UserContext);

  // Redirect Auth here ...
  useEffect(() => {
    // Redirect Auth
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin == false && !isLoading) {
      navigate("/auth");
    } else {
      if (state.user.status == "admin") {
        navigate("/complain-admin");
      } else if (state.user.status == "customer") {
        navigate("/");
      }
    }
  }, [state]);

  // Create function for check user token here ...

  // Call function check user with useEffect didMount here ...
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Product />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/product/:id" element={<DetailProduct />} />
      {/* <Route path="/complain" element={<Complain />} /> */}
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="/complain-admin" element={<ComplainAdmin />} /> */}
      <Route path="/category-admin" element={<CategoryAdmin />} />
      <Route path="/update-category/:id" element={<UpdateCategoryAdmin />} />
      <Route path="/add-category" element={<AddCategoryAdmin />} />
      <Route path="/product-admin" element={<ProductAdmin />} />
      <Route path="/add-product" element={<AddProductAdmin />} />
      <Route path="/update-product/:id" element={<UpdateProductAdmin />} />
    </Routes>
  );
}

export default App;
