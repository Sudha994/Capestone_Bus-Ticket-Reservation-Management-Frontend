import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="text-center mb-5">
            <h1>Welcome to BusTicket</h1>
            <p className="lead">Book your bus tickets online with ease</p>
            <Button as={Link} to="/search" variant="primary" size="lg">
              Search for Trips
            </Button>
          </div>

          <Row>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Easy Booking</h5>
                  <p>Search, select, and book your bus tickets in just a few clicks</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Multiple Operators</h5>
                  <p>Choose from a wide range of bus operators and routes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Secure Payment</h5>
                  <p>Multiple payment options with secure transaction processing</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;