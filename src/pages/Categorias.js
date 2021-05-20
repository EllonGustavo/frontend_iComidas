import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Toast from 'react-bootstrap/Toast'

import ReactTimeAgo from 'react-time-ago'//Lembrar de fazer o import do locale no index.js

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { BACKEND } from '../constants'

import { MdRestaurantMenu, MdSave, MdReplay, MdDeleteForever, MdModeEdit } from 'react-icons/md'

const Categorias = () => {

    const valorInicial = {
        nome: '',
        status: true
    }

    const [categoria, setCategoria] = useState(valorInicial)
    const [categorias, setCategorias] = useState([])
    const [carregandoCategorias, setCarregandoCategorias] = useState(false)
    const [salvandoCategoria, setSalvandoCategoria] = useState(false)
    const [erros, setErros] = useState({})
    const { nome, status } = categoria
    const [aviso, setAviso] = useState('')
    const [mostrar, setMostrar] = useState(false)

    const validaErrosCategoria = () => {
        const { nome } = categoria
        const novosErros = {}

        //validação para os erros
        if (!nome || nome === '') novosErros.nome = 'O nome não pode ser vazio'
        else if (nome.length > 30) novosErros.nome = 'O nome da categoria é muito longo'
        else if (nome.length < 3) novosErros.nome = 'O nome da categoria é muito curto'

        return novosErros
    }

    async function obterCategorias() {
        setCarregandoCategorias(true)
        let url = `${BACKEND}/categorias`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCategorias(data)
                console.log(data)
            })
            .catch(function (error) {
                console.error(`Erro ao obter as categorias: ${error.message}`)
            })
        setCarregandoCategorias(false)
    }

    async function salvarCategoria(event) {
        //evitar o comportamento padrão que é recarregar a pagina
        event.preventDefault()
        const novosErros = validaErrosCategoria()

        //existe algum erro no array
        if (Object.keys(novosErros).length > 0) {
            //sim, temos erros?
            setErros(novosErros)
        } else {
            //Salvar os dados no backend
            setSalvandoCategoria(true)
            const metodo = categoria.hasOwnProperty('_id') ? 'PUT' : 'POST'
            categoria.status = (categoria.status === true || categoria.status === 'ativo') ? 'ativo' : 'inativo'
            let url = `${BACKEND}/categorias`
            await fetch(url, {
                method: metodo,
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(categoria)
            }).then(res => res.json())
                .then(data => {
                    (data._id) ? setAviso('Registro salvo com sucesso') : setAviso('')
                    setCategoria(valorInicial)
                    obterCategorias()
                })
                .catch(function (error) {
                    console.error(`Erro ao salvar a categoria: ${error.message}`)
                })
            setSalvandoCategoria(false)
        }
    }

    async function excluirCategoria() {
        let url = `${BACKEND}/categorias/${categoria._id}`
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
        }).then(res => res.json())
            .then(data => {
                data.message ? setAviso(data.message) : setAviso('')
                setCategoria(valorInicial)
                obterCategorias()
            })
            .catch(function (error) {
                console.error(`Erro ao apagar a categoria: ${error.message}`)
            })
    }
    const alteraDadoCategoria = e => {
        setCategoria({ ...categoria, [e.target.name]: e.target.value })
        setErros({})
    }

    useEffect(() => {
        document.title = 'Cadastro de Categorias'
        obterCategorias()
    }, [])

    return (
        <>
            <Container fluid className="p-0">
                <Cabecalho />
                <Row className="bg-info text-light">
                    <Col>
                        <h3><MdRestaurantMenu /> Categorias de Restaurantes</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6}>
                        {/* Formulário das Categorias */}
                        <h4>Cadastro das Categorias</h4>
                        <Form method='post'>
                            <Form.Group>
                                <Form.Label>Nome da Categoria</Form.Label>
                                <Form.Control
                                    name='nome'
                                    placeholder='Ex: Cantinas'
                                    value={nome}
                                    onChange={alteraDadoCategoria}
                                    isInvalid={!!erros.nome}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {erros.nome}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='status'>
                                <Form.Check
                                    type='checkbox'
                                    label='Ativo'
                                    name='Status'
                                    checked={status}
                                    onChange={(e) => setCategoria({
                                        ...categoria,
                                        [e.target.name]:
                                            e.target.checked
                                    })
                                    }
                                >
                                </Form.Check>
                            </Form.Group>
                            <Button
                                variant='primary'
                                type='submit'
                                title='Salvar o registro'
                                onClick={(e) => salvarCategoria(e)}>
                                {salvandoCategoria ? <Spinner animation='border' size='sm' /> : <MdSave />}
                                 Salvar
                            </Button>
                            &nbsp;
                            <Button
                                variant='danger'
                                type='button'
                                title='cancelar'
                                onClick={() => { setCategoria(valorInicial) }}
                            >
                                <MdReplay /> Cancelar
                            </Button>
                        </Form>
                    </Col>
                    <Col xs={12} lg={6}>
                        {/* Listagem das Categorias */}
                        {carregandoCategorias &&
                            <>
                                <Spinner animation="border" size="sm" />
                                <Spinner animation="grow" variant="info" />
                                <p>Aguarde, enquanto as categorias são carregadas...</p>
                            </>
                        }
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Status</th>
                                    <th>Inclusão</th>
                                    <th>Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.nome}</td>
                                        <td>{item.status}</td>
                                        <td><ReactTimeAgo data={item.createdAt}/></td>
                                        <td>
                                            <Button
                                                variant='outline-danger'
                                                title='Remover o registro'
                                                onClick={() => {
                                                    setCategoria(item)
                                                    setMostrar(true)
                                                }}
                                            >
                                                <MdDeleteForever />
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant='outline-primary'
                                                title='Editar o registro'
                                                onClick={() => setCategoria(item)}
                                            >
                                                <MdModeEdit />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colspan='3'>Total de Registro:</td>
                                    <td>{categorias.length}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Modal animation={false} show={mostrar} onHide={() => null}>
                    <Modal.Header>
                        <Modal.Title>Confirmar a exclusão?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirmar a exclusão da categoria selecionada?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant='danger'
                            onClick={setMostrar(false)}  >
                            Cancelar
                        </Button>
                        &nbsp;
                        <Button
                            variant='success'
                            onClick={() => {
                                excluirCategoria()
                                setMostrar(false)
                            }}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Toast
                    onClose={() => setAviso('')}
                    show={aviso.length > 0}
                    animation={false}
                    delay={4000}
                    autohide
                    className='bg-success'
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0
                    }} >
                    <Toast.Header>
                        <strong>Aviso</strong>
                    </Toast.Header>
                    <Toast.Body className='text-light'>
                        {aviso}
                    </Toast.Body>
                </Toast>
                <Rodape />
            </Container>
        </>
    )
}

export default Categorias