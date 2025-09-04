import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/trips/${id}`);
        setTrip(response.data);
      } catch (error) {
        toast.error('Error fetching trip details');
        console.error('Trip fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleHoldSeats = async () => {
    if (!currentUser) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setHolding(true);
    try {
      const response = await axios.post('http://localhost:8080/api/bookings/hold', {
        tripId: parseInt(id),
        seatNumbers: selectedSeats
      });

      toast.success('Seats held successfully! Proceeding to payment...');
      navigate('/booking', { state: { booking: response.data } });
    } catch (error) {
      toast.error('Error holding seats: ' + (error.response?.data || 'Please try again'));
      console.error('Hold seats error:', error);
    } finally {
      setHolding(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  // Simple seat layout rendering (you'd want to implement a proper seat map)
  const renderSeatLayout = () => {
    const seats = [];
    for (let i = 1; i <= trip.bus.totalSeats; i++) {
      const seatNumber = `S${i}`;
      const isSelected = selectedSeats.includes(seatNumber);
      
      seats.push(
        <Col key={i} xs={2} className="mb-2">
          <Button
            variant={isSelected ? 'primary' : 'outline-primary'}
            className="w-100"
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {seatNumber}
          </Button>
        </Col>
      );
    }
    return seats;
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="mb-4">
            <Card.Body>
              <h2>Trip Details</h2>
              <Row>
                <Col md={8}>
                  <p><strong>Operator:</strong> {trip.bus.operatorName} ({trip.bus.busNumber})</p>
                  <p><strong>Route:</strong> {trip.route.origin} to {trip.route.destination}</p>
                  <p><strong>Departure:</strong> {new Date(trip.departureTime).toLocaleString()}</p>
                  <p><strong>Arrival:</strong> {new Date(trip.arrivalTime).toLocaleString()}</p>
                  <p><strong>Bus Type:</strong> {trip.bus.busType}</p>
                  <p><strong>Available Seats:</strong> {trip.availableSeats}</p>
                  <p><strong>Fare per seat:</strong> ৳{trip.fare}</p>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h4>Total</h4>
                      <h3>৳{selectedSeats.length * trip.fare}</h3>
                      <p>{selectedSeats.length} seat(s) selected</p>
                      <Button 
                        variant="primary" 
                        onClick={handleHoldSeats}
                        disabled={holding || selectedSeats.length === 0}
                      >
                        {holding ? 'Processing...' : 'Proceed to Payment'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h3>Select Seats</h3>
              <Row>
                {renderSeatLayout()}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TripDetails;