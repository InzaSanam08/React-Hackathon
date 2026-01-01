import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import './dashboard.css';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    if (querySnapshot.empty) {
      console.log("No students found.");
    }
    const studentList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setStudents(studentList);
  } catch (error) {
    console.error("Fetch Error:", error);
    alert("❌ Could not load data. Please check your permissions.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await deleteDoc(doc(db, "students", id));
        setStudents(students.filter(s => s.id !== id));
        alert("Profile Deleted!");
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const studentRef = doc(db, "students", editingStudent.id);
      await updateDoc(studentRef, {
        name: editingStudent.name,
        course: editingStudent.course
      });
      alert("Updated Successfully!");
      setEditingStudent(null);
      fetchData();
    } catch (error) {
      alert("Update Failed: " + error.message);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Student Management</h2>
          <span className="count-badge">{students.length} Total Students</span>
        </header>
        
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading Data...</p>
          </div>
        ) : (
          <div className="student-grid">
            {students.map((student) => (
              <div className="student-card-modern" key={student.id}>
                <div className="card-actions">
                  <button className="btn-icon edit" onClick={() => setEditingStudent(student)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(student.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>

                <div className="avatar-section">
                  <div className="avatar-circle">
                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="course-tag">{student.course}</span>
                </div>

                <div className="card-content">
                  <h3>{student.name}</h3>
                  <p className="student-email">{student.email}</p>
                  
                  <div className="details-list">
                    <div className="detail-item">
                      <i className="fas fa-clock"></i> {student.timings}
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-university"></i> {student.campus}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingStudent && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Update Student</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editingStudent.name} 
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select 
                    value={editingStudent.course} 
                    onChange={(e) => setEditingStudent({...editingStudent, course: e.target.value})}
                  >
                    <option value="wma">Web & Mobile Application</option>
                    <option value="app">App Development</option>
                    <option value="design">Graphic Designing</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setEditingStudent(null)}>Cancel</button>
                  <button type="submit" className="btn-save">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;