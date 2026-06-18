import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import { handleBooking } from '../utils/handleBooking';
import { AuthContext } from '../context/AuthContext';
import EditTourModal from '../components/EditTourModal';
import AdminEditButton from '../components/AdminEditButton';
import AdminAddButton from '../components/AdminAddButton';

const ToursPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passengers = searchParams.get('passengers') || '1';

  const { user } = useContext(AuthContext);
  const [editingTour, setEditingTour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setShowModal(true);
  };

  const [tours, setTours] = useState([
    {
      id: 1,
      title: 'Goa Beach & Nightlife Tour',
      location: 'Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 12500,
      rating: 4.7,
      reviews: 892,
      type: 'Adventure',
    },
    {
      id: 2,
      title: 'Kerala Backwaters Experience',
      location: 'Kerala',
      image: 'https://images.unsplash.com/photo-1590059843335-2c27e07112a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 18500,
      rating: 4.9,
      reviews: 1240,
      type: 'Leisure',
    },
    {
      id: 3,
      title: 'Rajasthan Desert Safari',
      location: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 22000,
      rating: 4.8,
      reviews: 756,
      type: 'Cultural',
    },
    {
      id: 4,
      title: 'Himalayan Adventure',
      location: 'Manali',
      image: 'https://images.unsplash.com/photo-1605590423641-845885581e61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 28500,
      rating: 4.6,
      reviews: 534,
      type: 'Adventure',
    },
    {
      id: 5,
      title: 'Bali Spiritual Retreat',
      location: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 35000,
      rating: 4.9,
      reviews: 423,
      type: 'Wellness',
    },
    {
      id: 6,
      title: 'Thailand City Tour',
      location: 'Bangkok',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 17500,
      rating: 4.5,
      reviews: 1120,
      type: 'City Tour',
    },
    {
      id: 7,
      title: 'Leh Ladakh Motorcycle Expedition',
      location: 'Leh Ladakh',
      image: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '10 Days / 9 Nights',
      price: 45000,
      rating: 4.9,
      reviews: 678,
      type: 'Adventure',
    },
    {
      id: 8,
      title: 'Dubai Luxury Experience',
      location: 'Dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 72000,
      rating: 4.8,
      reviews: 1245,
      type: 'Luxury',
    },
    {
      id: 9,
      title: 'Varanasi Spiritual Journey',
      location: 'Varanasi',
      image: 'https://images.unsplash.com/photo-1526481280693-3a266a3b370d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 12500,
      rating: 4.6,
      reviews: 890,
      type: 'Pilgrimage',
    },
    {
      id: 10,
      title: 'Maldives Island Paradise',
      location: 'Maldives',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 95000,
      rating: 4.9,
      reviews: 567,
      type: 'Beach',
    },
    {
      id: 11,
      title: 'Singapore Family Holiday',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 42000,
      rating: 4.7,
      reviews: 1340,
      type: 'Family',
    },
    {
      id: 12,
      title: 'Taj Mahal Heritage Tour',
      location: 'Agra',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 7500,
      rating: 4.8,
      reviews: 2150,
      type: 'Historical',
    },
    {
      id: 13,
      title: 'Swiss Alps Scenic Tour',
      location: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 165000,
      rating: 4.9,
      reviews: 780,
      type: 'Scenic',
    },
    {
      id: 14,
      title: 'Hampi Ancient Ruins Exploration',
      location: 'Hampi',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 10500,
      rating: 4.5,
      reviews: 456,
      type: 'Historical',
    },
    {
      id: 15,
      title: 'Paris Romantic Getaway',
      location: 'Paris',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 115000,
      rating: 4.8,
      reviews: 1560,
      type: 'Romantic',
    },
    {
      id: 16,
      title: 'Darjeeling Tea Trail',
      location: 'Darjeeling',
      image: 'https://images.unsplash.com/photo-1587729927502-0656c9f75893?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 15500,
      rating: 4.6,
      reviews: 678,
      type: 'Leisure',
    },
    {
      id: 17,
      title: 'Pondicherry French Quarter',
      location: 'Pondicherry',
      image: 'https://images.unsplash.com/photo-1580079904560-575833732d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 9500,
      rating: 4.4,
      reviews: 567,
      type: 'Cultural',
    },
    {
      id: 18,
      title: 'Tokyo Modern & Traditional Tour',
      location: 'Tokyo',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 95000,
      rating: 4.7,
      reviews: 920,
      type: 'City Tour',
    },
    {
      id: 19,
      title: 'Shimla Summer Retreat',
      location: 'Shimla',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 14500,
      rating: 4.5,
      reviews: 890,
      type: 'Leisure',
    },
    {
      id: 20,
      title: 'Egypt Pyramids & Nile Cruise',
      location: 'Cairo',
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 85000,
      rating: 4.8,
      reviews: 1120,
      type: 'Historical',
    },
    {
      id: 21,
      title: 'Ooty Nilgiri Hills Tour',
      location: 'Ooty',
      image: 'https://images.unsplash.com/photo-1510627489934-2554c6dd80d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 11000,
      rating: 4.4,
      reviews: 678,
      type: 'Leisure',
    },
    {
      id: 22,
      title: 'Barcelona Art & Architecture',
      location: 'Barcelona',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 125000,
      rating: 4.8,
      reviews: 890,
      type: 'City Tour',
    },
    {
      id: 23,
      title: 'Jim Corbett Wildlife Safari',
      location: 'Jim Corbett',
      image: 'https://images.unsplash.com/photo-1548021682-1720c315a2c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 16500,
      rating: 4.6,
      reviews: 567,
      type: 'Adventure',
    },
    {
      id: 24,
      title: 'Mysore Royal Heritage Tour',
      location: 'Mysore',
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 6500,
      rating: 4.5,
      reviews: 890,
      type: 'Historical',
    },
    {
      id: 25,
      title: 'Queenstown Adventure Sports',
      location: 'New Zealand',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 185000,
      rating: 4.9,
      reviews: 456,
      type: 'Adventure',
    },
    {
      id: 26,
      title: 'Khajuraho Temple Complex',
      location: 'Khajuraho',
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 8500,
      rating: 4.6,
      reviews: 345,
      type: 'Cultural',
    },
    {
      id: 27,
      title: 'Andaman Beach & Scuba',
      location: 'Andaman Islands',
      image: 'https://images.unsplash.com/photo-1588864663728-4f4871d0f379?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 26500,
      rating: 4.7,
      reviews: 678,
      type: 'Beach',
    },
    {
      id: 28,
      title: 'London Historic Tour',
      location: 'London',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 135000,
      rating: 4.7,
      reviews: 1340,
      type: 'City Tour',
    },
    {
      id: 29,
      title: 'Rishikesh Yoga & Rafting',
      location: 'Rishikesh',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 12000,
      rating: 4.6,
      reviews: 920,
      type: 'Wellness',
    },
    {
      id: 30,
      title: 'Chardham Yatra Pilgrimage',
      location: 'Uttarakhand',
      image: 'https://images.unsplash.com/photo-1568211557557-34192baa6148?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '12 Days / 11 Nights',
      price: 38000,
      rating: 4.8,
      reviews: 1230,
      type: 'Pilgrimage',
    },
    {
      id: 31,
      title: 'Bikaner Camel & Desert Camp',
      location: 'Bikaner',
      image: 'https://images.unsplash.com/photo-1508666902358-4a1c9770bb24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 14500,
      rating: 4.5,
      reviews: 432,
      type: 'Cultural',
    },
    {
      id: 32,
      title: 'Udaipur Lake Palace Tour',
      location: 'Udaipur',
      image: 'https://images.unsplash.com/photo-1513308314034-4bf5d188e4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 18500,
      rating: 4.8,
      reviews: 1120,
      type: 'Cultural',
    },
    {
      id: 33,
      title: 'New Zealand Nature Quest',
      location: 'New Zealand',
      image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '12 Days / 11 Nights',
      price: 220000,
      rating: 4.9,
      reviews: 678,
      type: 'Adventure',
    },
    {
      id: 34,
      title: 'Mahabalipuram Shore Temples',
      location: 'Mahabalipuram',
      image: 'https://images.unsplash.com/photo-1559523162-0bef2e93a07c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 6500,
      rating: 4.4,
      reviews: 567,
      type: 'Historical',
    },
    {
      id: 35,
      title: 'Malaysia Singapore Combo Tour',
      location: 'Malaysia & Singapore',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '9 Days / 8 Nights',
      price: 110000,
      rating: 4.7,
      reviews: 890,
      type: 'Family',
    },
    {
      id: 36,
      title: 'Matheran Hill Station',
      location: 'Matheran',
      image: 'https://images.unsplash.com/photo-1580552962475-3f9da47edd54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 4500,
      rating: 4.3,
      reviews: 890,
      type: 'Weekend',
    },
    {
      id: 37,
      title: 'Bhutan Kingdom of Happiness',
      location: 'Bhutan',
      image: 'https://images.unsplash.com/photo-1539526243206-2d70aa36f936?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 38000,
      rating: 4.9,
      reviews: 678,
      type: 'Cultural',
    },
    {
      id: 38,
      title: 'Sikkim Gangtok & Tsomgo Lake',
      location: 'Sikkim',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 22500,
      rating: 4.6,
      reviews: 567,
      type: 'Leisure',
    },
    {
      id: 39,
      title: 'Iceland Northern Lights Tour',
      location: 'Iceland',
      image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 195000,
      rating: 4.9,
      reviews: 456,
      type: 'Adventure',
    },
    {
      id: 40,
      title: 'Alleppey Houseboat Experience',
      location: 'Alleppey',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc05a8b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 7500,
      rating: 4.7,
      reviews: 1120,
      type: 'Leisure',
    },
    {
      id: 41,
      title: 'Amritsar Golden Temple Tour',
      location: 'Amritsar',
      image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 8500,
      rating: 4.7,
      reviews: 890,
      type: 'Pilgrimage',
    },
    {
      id: 42,
      title: 'Italy Rome & Venice Tour',
      location: 'Italy',
      image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '9 Days / 8 Nights',
      price: 155000,
      rating: 4.8,
      reviews: 780,
      type: 'Romantic',
    },
    {
      id: 43,
      title: 'Nainital Lake & Hills',
      location: 'Nainital',
      image: 'https://images.unsplash.com/photo-1577504552078-6333861a3e75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 8500,
      rating: 4.4,
      reviews: 670,
      type: 'Leisure',
    },
    {
      id: 44,
      title: 'Chiang Mai Elephant Sanctuary',
      location: 'Chiang Mai',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 21500,
      rating: 4.7,
      reviews: 890,
      type: 'Ethical',
    },
    {
      id: 45,
      title: 'Jaipur Pink City Tour',
      location: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 13500,
      rating: 4.7,
      reviews: 1234,
      type: 'Cultural',
    },
    {
      id: 46,
      title: 'Jaisalmer Desert Camp',
      location: 'Jaisalmer',
      image: 'https://images.unsplash.com/photo-1508666902358-4a1c9770bb24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 12500,
      rating: 4.6,
      reviews: 890,
      type: 'Adventure',
    },
    {
      id: 47,
      title: 'Coorg Coffee Estate Tour',
      location: 'Coorg',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 9800,
      rating: 4.5,
      reviews: 567,
      type: 'Leisure',
    },
    {
      id: 48,
      title: 'Singapore & Bali Combo',
      location: 'Singapore & Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 89000,
      rating: 4.8,
      reviews: 890,
      type: 'Family',
    },
    {
      id: 49,
      title: 'Kaziranga Wildlife Tour',
      location: 'Kaziranga',
      image: 'https://images.unsplash.com/photo-1548021682-1720c315a2c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 18500,
      rating: 4.6,
      reviews: 456,
      type: 'Adventure',
    },
    {
      id: 50,
      title: 'Kodaikanal Hill Station',
      location: 'Kodaikanal',
      image: 'https://images.unsplash.com/photo-1577504552078-6333861a3e75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 9500,
      rating: 4.4,
      reviews: 678,
      type: 'Leisure',
    },
    {
      id: 51,
      title: 'Bangkok & Pattaya Combo',
      location: 'Bangkok & Pattaya',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 28500,
      rating: 4.5,
      reviews: 1120,
      type: 'Family',
    },
    {
      id: 52,
      title: 'Friendship Peak Expedition',
      location: 'Himachal Pradesh',
      image: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '12 Days / 11 Nights',
      price: 55000,
      rating: 4.8,
      reviews: 234,
      type: 'Adventure',
    },
    {
      id: 53,
      title: 'Hyderabad Heritage Tour',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1526481280693-3a266a3b370d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 8500,
      rating: 4.5,
      reviews: 890,
      type: 'Cultural',
    },
    {
      id: 54,
      title: 'Valley of Flowers Trek',
      location: 'Uttarakhand',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 22000,
      rating: 4.7,
      reviews: 567,
      type: 'Adventure',
    },
    {
      id: 55,
      title: 'Austria Alps Ski Tour',
      location: 'Austria',
      image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 145000,
      rating: 4.9,
      reviews: 456,
      type: 'Winter',
    },
    {
      id: 56,
      title: 'Goa Water Sports Package',
      location: 'Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 6500,
      rating: 4.6,
      reviews: 1250,
      type: 'Adventure',
    },
    {
      id: 57,
      title: 'Cherrapunji Living Root Bridges',
      location: 'Cherrapunji',
      image: 'https://images.unsplash.com/photo-1548021682-1720c315a2c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 11000,
      rating: 4.5,
      reviews: 345,
      type: 'Nature',
    },
    {
      id: 58,
      title: 'Moscow & St. Petersburg Tour',
      location: 'Russia',
      image: 'https://images.unsplash.com/photo-1523301343968-6ec5f37148a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 125000,
      rating: 4.6,
      reviews: 567,
      type: 'City Tour',
    },
    {
      id: 59,
      title: 'Patagonia Adventure Trek',
      location: 'Patagonia',
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '10 Days / 9 Nights',
      price: 165000,
      rating: 4.9,
      reviews: 234,
      type: 'Adventure',
    },
    {
      id: 60,
      title: 'Gangtok & North Sikkim',
      location: 'Gangtok',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 19500,
      rating: 4.6,
      reviews: 678,
      type: 'Leisure',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 rounded-xl p-6 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Tours & Attractions</h1>
            {user?.role?.toLowerCase() === 'admin' && (
              <AdminAddButton label="Add Tour" onClick={() => { setEditingTour(null); setShowModal(true); }} />
            )}
          </div>
          <p className="text-gray-600 text-sm">Curated experiences and guided tours</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer"
              onClick={() => navigate(`/tour-details?passengers=${passengers}`, { state: { tour } })}
            >
              {user?.role?.toLowerCase() === 'admin' && (
                <AdminEditButton onClick={() => handleEditTour(tour)} />
              )}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={`https://picsum.photos/seed/${tour.id}-${tour.title.replace(/\s+/g, '-')}/800/600`}
                  alt={tour.title}
                  className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {tour.type}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-gray-900">{tour.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                  {tour.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {tour.location}
                  <span className="mx-2">•</span>
                  <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tour.duration}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Per person</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-400">₹</span>
                      <span className="text-2xl font-bold text-indigo-600">{tour.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBooking(navigate, 'tour', tour); }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">No tours available.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditTourModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingTour(null); }}
        tour={editingTour}
        onSave={(updatedTour) => {
          setTours(prev => {
            const isExisting = prev.some(t => 
              (t.id && t.id === updatedTour.id) || 
              (t._id && t._id === updatedTour._id)
            );
            if (isExisting) {
              return prev.map(t => 
                ((t.id && t.id === updatedTour.id) || (t._id && t._id === updatedTour._id)) 
                  ? updatedTour : t
              );
            } else {
              // Ensure the new tour has an ID if it's created locally 
              if (!updatedTour.id && !updatedTour._id) {
                updatedTour.id = Date.now();
              }
              return [updatedTour, ...prev];
            }
          });
          setShowModal(false);
          setEditingTour(null);
        }}
      />
    </div>
  );
};

export default ToursPage;
