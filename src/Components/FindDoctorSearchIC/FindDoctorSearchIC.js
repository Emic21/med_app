import React, { useState } from 'react';
import './FindDoctorSearchIC.css';

const initSpeciality = [
  'Dentist',
  'Gynecologist/obstetrician',
  'General Physician',
  'Dermatologist',
  'Ear-nose-throat (ent) Specialist',
  'Homeopath',
  'Ayurveda',
];

const FindDoctorSearchIC = ({ onSearch, onSpecialtySelect }) => {
  const [doctorResultHidden, setDoctorResultHidden] = useState(true);
  const [searchDoctor, setSearchDoctor] = useState('');
  const [specialities, setSpecialities] = useState(initSpeciality);

  const handleDoctorSelect = (speciality) => {
    setSearchDoctor(speciality);
    setDoctorResultHidden(true);
    onSearch(speciality); // Pass the search query to the parent component
    onSpecialtySelect(speciality); // Pass the selected specialty to the parent component
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchDoctor(query);

    // Filter specialities based on search query
    const filteredSpecialities = initSpeciality.filter((speciality) =>
      speciality.toLowerCase().includes(query.toLowerCase())
    );
    setSpecialities(filteredSpecialities);

    // Pass the search query to the parent component
    onSearch(query);
  };

  const handleKeyDown = (e, speciality) => {
    if (e.key === 'Enter') {
      handleDoctorSelect(speciality);
    }
  };

  return (
    <div className="finddoctor">
      <center>
        <h1>Find a doctor and Consult instantly</h1>
        <div>
          <i
            style={{ color: '#000000', fontSize: '20rem' }}
            className="fa fa-user-md"
            aria-hidden="true"
          ></i>
        </div>
        <div
          className="home-search-container"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="doctor-search-box">
            <input
              type="text"
              className="search-doctor-input-box"
              placeholder="Search doctors, clinics, hospitals, etc."
              onFocus={() => setDoctorResultHidden(false)}
              onBlur={() => setTimeout(() => setDoctorResultHidden(true), 200)}
              value={searchDoctor}
              onChange={handleSearchChange}
              aria-label="Search doctors by speciality"
            />
            <div className="findiconimg">
              <img
                className="findIcon"
                src={process.env.PUBLIC_URL + '/search.svg'}
                alt="Search"
              />
            </div>
            <div className="search-doctor-input-results" hidden={doctorResultHidden}>
              {specialities.length > 0 ? (
                specialities.map((speciality) => (
                  <div
                    className="search-doctor-result-item"
                    key={speciality}
                    onMouseDown={() => handleDoctorSelect(speciality)}
                    onKeyDown={(e) => handleKeyDown(e, speciality)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${speciality}`}
                  >
                    <span>
                      <img
                        src={process.env.PUBLIC_URL + '/images/search.svg'}
                        alt=""
                        style={{ height: '10px', width: '10px' }}
                        width="12"
                      />
                    </span>
                    <span>{speciality}</span>
                    <span>SPECIALITY</span>
                  </div>
                ))
              ) : (
                <div className="no-results">No matching specialities found.</div>
              )}
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default FindDoctorSearchIC;