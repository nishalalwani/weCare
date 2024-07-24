import React from 'react'
import '../../assets/style.css'
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../assets/images/logo.png'
import profile from '../../assets/images/profile.jpg'

const CustomNavbar = () => {
  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg px-4">
      <Navbar.Brand href="#home">
        <img
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="WeCare logo"
        />{' '}
        WeCare
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">

          <Nav.Link href="#admin">
            <img
              src={profile}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Admin icon"
            />{' '}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  
    </>
  )
}

export default CustomNavbar