import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { toast } from 'react-toastify';

const SearchTrips = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: new Date()
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/api/trips/search', {
        origin: formData.origin,
        destination: formData.destination,
        date: formData.date.toISOString().split('T')[0]
      });
      
      setTrips(response.data);
    } catch (error) {
      toast.error('Error searching for trips');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 mb-4">
            <h2 className="text-center mb-4">Search Bus Trips</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>From</Form.Label>
                    <Form.Control
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      placeholder="Origin city"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Destination city"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <DatePicker
                      selected={formData.date}
                      onChange={handleDateChange}
                      className="form-control"
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>

          {trips.length > 0 && (
            <div>
              <h3>Available Trips</h3>
              {trips.map(trip => (
                <Card key={trip.id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h5>{trip.bus.operatorName} - {trip.bus.busNumber}</h5>
                        <p>
                          {trip.route.origin} to {trip.route.destination} | 
                          Departure: {new Date(trip.departureTime).toLocaleString()} | 
                          Arrival: {new Date(trip.arrivalTime).toLocaleString()}
                        </p>
                        <p>Bus Type: {trip.bus.busType} | Available Seats: {trip.availableSeats}</p>
                      </Col>
                      <Col md={4} className="text-end">
                        <h4>৳{trip.fare}</h4>
                        <Button 
                          variant="primary" 
                          onClick={() => handleBookNow(trip.id)}
                        >
                          Book Now
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {trips.length === 0 && !loading && (
            <div className="text-center">
              <p>No trips found. Try a different search.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchTrips;