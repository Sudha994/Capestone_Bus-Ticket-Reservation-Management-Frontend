import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/bookings/user/${currentUser.id}`);
        setBookings(response.data);
      } catch (error) {
        toast.error('Error fetching bookings');
        console.error('Bookings fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      // Refresh the bookings list
      const response = await axios.get(`http://localhost:8080/api/bookings/user/${currentUser.id}`);
      setBookings(response.data);
    } catch (error) {
      toast.error('Error cancelling booking');
      console.error('Cancel booking error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center mb-4">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <Card>
              <Card.Body className="text-center">
                <h5>No bookings found</h5>
                <p>You haven't made any bookings yet.</p>
              </Card.Body>
            </Card>
          ) : (
            bookings.map(booking => (
              <Card key={booking.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <h5>{booking.trip.route.origin} to {booking.trip.route.destination}</h5>
                      <p>
                        <strong>Departure:</strong> {new Date(booking.trip.departureTime).toLocaleString()} | 
                        <strong> Arrival:</strong> {new Date(booking.trip.arrivalTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Bus:</strong> {booking.trip.bus.operatorName} ({booking.trip.bus.busNumber}) | 
                        <strong> Seats:</strong> {JSON.parse(booking.seatNumbers).join(', ')}
                      </p>
                      <p>
                        <strong>Status:</strong> 
                        <Badge bg={
                          booking.status === 'CONFIRMED' ? 'success' : 
                          booking.status === 'CANCELLED' ? 'danger' : 'warning'
                        } className="ms-2">
                          {booking.status}
                        </Badge>
                      </p>
                    </Col>
                    <Col md={4} className="text-end">
                      <h4>৳{booking.totalAmount}</h4>
                      <p>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      {booking.status === 'HOLD' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyBookings;