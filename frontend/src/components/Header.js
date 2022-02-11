import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { IoCart, AiOutlineUser } from "react-icons/all";
import { logout } from "../actions/userActions";
import SearchBox from "../components/SearchBox";
import { listProductCategories } from "../actions/productActions";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Header = () => {
  const dispatch = useDispatch();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const LogoutHandler = () => {
    dispatch(logout());
  };

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  return (
    <>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>

            <LinkContainer to="/">
              <Navbar.Brand className="text-uppercase">Shopping</Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Route
                render={({ history }) => <SearchBox history={history} />}
              />
              <Nav className="ml-auto">
                <LinkContainer to="/cart">
                  <Nav.Link className="text-uppercase">
                    {" "}
                    <IoCart /> Cart
                  </Nav.Link>
                </LinkContainer>

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={LogoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link className="text-uppercase">
                      {" "}
                      <AiOutlineUser /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="admin" id="adminmenu">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <aside className={sidebarIsOpen ? "open" : ""}>
        <ul className="categories">
          <li>
            <strong>Categories</strong>
            <button
              onClick={() => setSidebarIsOpen(false)}
              className="close-sidebar"
              type="button"
            >
              <i className="fa fa-close"></i>
            </button>
          </li>
          {loadingCategories ? (
            <Loader></Loader>
          ) : errorCategories ? (
            <Message variant="danger">{errorCategories}</Message>
          ) : (
            categories.map((c) => (
              <li key={c}>
                <Link
                  to={`/search/${c}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  {c}
                </Link>
              </li>
            ))
          )}
        </ul>
      </aside>
    </>
  );
};

export default Header;
