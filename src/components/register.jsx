import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';  
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './style.css';

const Registration = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    classTimings: '',
    campus: '',
    teacher: '',
    course: ''
  });

  // Auth state check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        alert("Session expired. Please login again.");
        navigate('/'); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
  e.preventDefault();
  
  const { fullName, classTimings, campus, teacher, course } = formData;
  if (!fullName || !classTimings || !campus || !teacher || !course) {
    alert("⚠️ Please fill in all the fields!");
    return;
  }

  if (!currentUser) {
    alert("❌ You are not logged in. Please login again.");
    navigate('/');
    return;
  }

  setLoading(true);
  try {
    await setDoc(doc(db, "students", currentUser.uid), {
      name: fullName,
      timings: classTimings,
      campus,
      teacher,
      course,
      email: currentUser.email,
      uid: currentUser.uid,
      updatedAt: new Date()
    });
    alert("✅ Profile Saved Successfully!");
    navigate('/dashboard'); 
  } catch (error) {
    console.error("Firestore Error:", error);
    alert("❌ Error saving data: " + error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="reg-page">
      <div className="glass-card reg-card">
        <div className="auth-header">
          <div className="portal-logo">
            <i className="fas fa-user-edit"></i>
          </div>
          <h2>Student Details</h2>
          <p>Please complete your profile to continue</p>
        </div>

        <form onSubmit={handleSave} className="auth-form">
          {/* Full Name */}
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input 
              type="text" id="fullName" placeholder="Full Name" 
              value={formData.fullName} onChange={handleChange} required 
            />
          </div>

          {/* Class Timings */}
          <div className="input-group">
            <i className="fas fa-clock"></i>
            <select id="classTimings" value={formData.classTimings} onChange={handleChange} required>
              <option value="" disabled>Select Class Timings</option>
              <option value="9-11">09:00 AM to 11:00 AM</option>
              <option value="11-1">11:00 AM to 01:00 PM</option>
              <option value="7-9">07:00 PM to 09:00 PM</option>
            </select>
          </div>

          {/* Campus */}
          <div className="input-group">
            <i className="fas fa-university"></i>
            <select id="campus" value={formData.campus} onChange={handleChange} required>
              <option value="" disabled>Select Campus</option>
              <option value="numaish">Numaish Campus</option>
              <option value="gulshan">Gulshan Campus</option>
              <option value="korangi">Korangi Campus</option>
            </select>
          </div>

          {/* Teacher */}
          <div className="input-group">
            <i className="fas fa-chalkboard-teacher"></i>
            <select id="teacher" value={formData.teacher} onChange={handleChange} required>
              <option value="" disabled>Select Teacher</option>
              <option value="bilal">Minahil Irfan</option>
              <option value="ishaq">Hira Saeed</option>
              <option value="jameel">Minahil Jameel</option>
            </select>
          </div>

          {/* Course */}
          <div className="input-group">
            <i className="fas fa-book"></i>
            <select id="course" value={formData.course} onChange={handleChange} required>
              <option value="" disabled>Select Course</option>
              <option value="wma">Web & Mobile Application</option>
              <option value="app">App Development</option>
              <option value="design">Graphic Designing</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;