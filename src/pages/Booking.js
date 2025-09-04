import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [processing, setProcessing] = useState(false);

  if (!booking) {
    navigate('/search');
    return null;
  }

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // In a real application, you would integrate with a payment gateway
      // For demo purposes, we'll simulate a successful payment
      const transactionId = `TXN${Date.now()}`;
      
      const response = await axios.post('http://localhost:8080/api/payments', {
        bookingId: booking.id,
        paymentMethod: paymentMethod,
        transactionId: transactionId
      });

      toast.success('Payment successful! Your booking is confirmed.');
      navigate('/my-bookings');
    } catch (error) {
      toast.error('Payment failed: ' + (error.response?.data || 'Please try again'));
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Complete Your Booking</h2>
              
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <h5>Booking Summary</h5>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Trip:</strong> {booking.trip.route.origin} to {booking.trip.route.destination}</p>
                      <p><strong>Departure:</strong> {new Date(booking.trip.departureTime).toLocaleString()}</p>
                      <p><strong>Seats:</strong> {JSON.parse(booking.seatNumbers).join(', ')}</p>
                      <p><strong>Total Amount:</strong> ৳{booking.totalAmount}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h5>Payment Method</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Payment Method</Form.Label>
                        <Form.Select 
                          value={paymentMethod} 
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="CARD">Credit/Debit Card</option>
                          <option value="UPI">UPI</option>
                          <option value="NET_BANKING">Net Banking</option>
                        </Form.Select>
                      </Form.Group>

                      {paymentMethod === 'CARD' && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control type="text" placeholder="1234 5678 9012 3456" />
                          </Form.Group>
                          <Row>
                            <Col>
                              <Form.Group className="mb-3">
                                <Form.Label>Expiry Date</Form.Label>
                                <Form.Control type="text" placeholder="MM/YY" />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group className="mb-3">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control type="text" placeholder="123" />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Form.Group className="mb-3">
                            <Form.Label>Card Holder Name</Form.Label>
                            <Form.Control type="text" placeholder="John Doe" />
                          </Form.Group>
                        </>
                      )}

                      {paymentMethod === 'UPI' && (
                        <Form.Group className="mb-3">
                          <Form.Label>UPI ID</Form.Label>
                          <Form.Control type="text" placeholder="username@upi" />
                        </Form.Group>
                      )}

                      {paymentMethod === 'NET_BANKING' && (
                        <Form.Group className="mb-3">
                          <Form.Label>Select Bank</Form.Label>
                          <Form.Select>
                            <option>Select your bank</option>
                            <option>Bank of Example</option>
                            <option>Example National Bank</option>
                            <option>Example State Bank</option>
                          </Form.Select>
                        </Form.Group>
                      )}

                      <Button 
                        variant="success" 
                        className="w-100" 
                        onClick={handlePayment}
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : `Pay ৳${booking.totalAmount}`}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Booking;