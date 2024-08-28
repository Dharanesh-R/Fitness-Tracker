import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function WorkoutHistory() {
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/workouts', {
          params: { userId: localStorage.getItem('userId') } // Fetch data for the logged-in user
        });
        setWorkoutData(response.data);
      } catch (error) {
        toast.error('Failed to fetch workout data.', { autoClose: 5000 });
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      setWorkoutData(workoutData.filter(workout => workout._id !== id));
      toast.success('Workout deleted successfully.', { autoClose: 5000 });
    } catch (error) {
      toast.error('Failed to delete workout.', { autoClose: 5000 });
    }
  };
  

  return (
    <>
      <ToastContainer />
      <div className='margin'></div>
      <div className='background1'>
        <h2>Workout History</h2>
        {workoutData.length > 0 ? (
          <table className='workout-table'>
            <thead>
              <tr>
                <th>Type of Workout</th>
                <th>Target Count</th>
                <th>Completed Count</th>
                <th>Time Taken</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workoutData.map(workout => (
                <tr key={workout._id}>
                  <td>{workout.typeOfWorkout}</td>
                  <td>{workout.countValue}</td>
                  <td>{workout.completedCountValue}</td>
                  <td>{workout.timeTaken}</td>
                  <td>{workout.dateTime}</td>
                  <td>
                    <button className='delete-button' onClick={() => handleDelete(workout._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No workouts recorded.</p>
        )}
      </div>
    </>
  );
}

export default WorkoutHistory;
