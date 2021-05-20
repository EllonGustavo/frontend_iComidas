import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'

const Inicio = () => {

    useEffect(() => {
        document.title = 'iComida'
    }, [])

    return (
        <>
            <Container fluid className="p-0">
                <Cabecalho />
                <Jumbotron>
                    <h1>Seja Bem Vindo!</h1>
                    <p>
                        Esta é a área administrativa do iComida. Efetue os cadastros através 
                        do menu acima.
                    </p>
                   
                </Jumbotron>
                <Rodape />
            </Container>
        </>
    )
}

export default Inicio