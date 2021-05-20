import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { MdRestaurantMenu, MdDescription, MdStore, MdHome,
MdMailOutline, MdLocalPizza, MdAccountCircle } from 'react-icons/md'

const Cabecalho = () => {

    return (
<Navbar bg="primary" variant="dark">
    <Navbar.Brand href="#inicio"><MdLocalPizza/> iComida</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#inicio"><MdHome/> Início</Nav.Link>
      <Nav.Link href="#contato"><MdMailOutline/> Contato</Nav.Link>
      <DropdownButton 
        as={ButtonGroup}
        menuAlign={{ lg: 'right'}}
        title="Cadastros"
        id="cadastros">
            <Dropdown.Item eventKey="1" href="#/categorias"><MdRestaurantMenu/> Categorias</Dropdown.Item>
            <Dropdown.Item eventKey="2"><MdStore /> Restaurantes</Dropdown.Item>
            <Dropdown.Item eventKey="3"><MdDescription/> Cardápios</Dropdown.Item>
            <Dropdown.Item eventKey="4"><MdAccountCircle/> Usuários</Dropdown.Item>
        </DropdownButton>
    </Nav>
  </Navbar>
    )
}

export default Cabecalho