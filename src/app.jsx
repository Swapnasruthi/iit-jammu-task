
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Feed from "./components/feed";

export function App() {
  

  return (
    <>
      
      <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element= {<Body/>}>
              <Route path="/login" element = {<Login/>}/>
              <Route path="/register" element = {<Register/>}/>
              <Route path="/" element = {<Feed/>}/>
              <Route path="/cart" element = {<Cart/>}/>
            
            
            </Route>
          </Routes>
      
      </BrowserRouter>
    </>
  )
}
