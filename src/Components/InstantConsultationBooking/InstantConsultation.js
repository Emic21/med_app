import React, { useEffect, useState, useCallback } from 'react';
import './InstantConsultation.css';
import { useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from './DoctorCardIC/DoctorCardIC';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const getDoctorsDetails = useCallback(() => {
        fetch('https://api.npoint.io/9a5543d36f1460da2f63')
            .then(res => res.json())
            .then(data => {
                if (searchParams.get('speciality')) {
                    const filtered = data.filter(doctor => doctor.speciality.toLowerCase() === searchParams.get('speciality').toLowerCase());
                    setFilteredDoctors(filtered);
                    setIsSearched(true);
                } else {
                    setFilteredDoctors([]);
                    setIsSearched(false);
                }
                setDoctors(data);
            })
            .catch(err => console.log(err));
    }, [searchParams]);

    useEffect(() => {
        getDoctorsDetails();
    }, [getDoctorsDetails]);

    const handleSearch = (searchText) => {
        if (searchText === '') {
            setFilteredDoctors([]);
            setIsSearched(false);
        } else {
            const filtered = doctors.filter(
                (doctor) => doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredDoctors(filtered);
            setIsSearched(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Name:', name);
        console.log('Phone:', phone);
    };

    return (
        <center>
            <div className="searchpage-container">
                <FindDoctorSearchIC onSearch={handleSearch} />
                <div className="search-results-container">
                    {isSearched ? (
                        <center>
                            <h2>{filteredDoctors.length} doctors are available {searchParams.get('location')}</h2>
                            <h3>Book appointments with minimum wait-time & verified doctor details</h3>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <Popup
                                        trigger={<div onClick={() => console.log('Popup triggered')}><DoctorCardIC className="doctorcard" {...doctor} key={doctor.name} /></div>}
                                        modal
                                        nested
                                    >
                                        {close => (
                                            <div className="popup-form">
                                                <h2>{doctor.name}</h2>
                                                <p>{doctor.speciality}</p>
                                                <p>{doctor.experience} years experience</p>
                                                <div className="rating">☆☆☆☆☆</div>
                                                <form onSubmit={handleSubmit}>
                                                    <label>
                                                        Name:
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            required
                                                        />
                                                    </label>
                                                    <label>
                                                        Phone Number:
                                                        <input
                                                            type="tel"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            required
                                                        />
                                                    </label>
                                                    <button type="submit">Book Now</button>
                                                    <button type="button" onClick={close}>Close</button>
                                                </form>
                                            </div>
                                        )}
                                    </Popup>
                                ))
                            ) : (
                                <p>No doctors found.</p>
                            )}
                        </center>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </center>
    );
};

export default InstantConsultation;