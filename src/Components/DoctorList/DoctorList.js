import React from 'react';
import DoctorCardIC from '../DoctorCardIC/DoctorCardIC';
import './DoctorList.css'; // Optional: Add styles for the list

const DoctorsList = () => {
  // Example data for up to 10 doctors
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      speciality: 'Cardiologist',
      experience: '10',
      ratings: '4.8',
      profilePic: 'url_to_image_1',
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      speciality: 'Dermatologist',
      experience: '8',
      ratings: '4.7',
      profilePic: 'url_to_image_2',
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      speciality: 'Pediatrician',
      experience: '12',
      ratings: '4.9',
      profilePic: 'url_to_image_3',
    },
    {
      id: 4,
      name: 'Dr. Michael Brown',
      speciality: 'Orthopedic Surgeon',
      experience: '15',
      ratings: '4.6',
      profilePic: 'url_to_image_4',
    },
    {
      id: 5,
      name: 'Dr. Sarah Davis',
      speciality: 'Gynecologist',
      experience: '9',
      ratings: '4.5',
      profilePic: 'url_to_image_5',
    },
    {
      id: 6,
      name: 'Dr. Robert Wilson',
      speciality: 'Neurologist',
      experience: '11',
      ratings: '4.8',
      profilePic: 'url_to_image_6',
    },
    {
      id: 7,
      name: 'Dr. Laura Martinez',
      speciality: 'Psychiatrist',
      experience: '7',
      ratings: '4.4',
      profilePic: 'url_to_image_7',
    },
    {
      id: 8,
      name: 'Dr. James Anderson',
      speciality: 'Oncologist',
      experience: '14',
      ratings: '4.9',
      profilePic: 'url_to_image_8',
    },
    {
      id: 9,
      name: 'Dr. Olivia Taylor',
      speciality: 'Endocrinologist',
      experience: '6',
      ratings: '4.3',
      profilePic: 'url_to_image_9',
    },
    {
      id: 10,
      name: 'Dr. William Thomas',
      speciality: 'Rheumatologist',
      experience: '13',
      ratings: '4.7',
      profilePic: 'url_to_image_10',
    },
  ];

  return (
    <div className="doctors-list-container">
      <h1>Our Doctors</h1>
      <div className="doctors-list">
        {doctors.map((doctor) => (
          <DoctorCardIC
            key={doctor.id}
            name={doctor.name}
            speciality={doctor.speciality}
            experience={doctor.experience}
            ratings={doctor.ratings}
            profilePic={doctor.profilePic}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;