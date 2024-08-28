import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import alarm from '../assets/alarm.wav';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../App.css';

function FitnessTracker() {
  const [typeOfWorkout, setTypeOfWorkout] = useState('');
  const [countValue, setCountValue] = useState('');
  const [completedCountValue, setCompletedCountValue] = useState('');
  const [message, setMessage] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wasActive, setWasActive] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);
  const audioRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const calculate = async () => {
    if (typeOfWorkout.trim() === '' || countValue.trim() === '' || completedCountValue.trim() === '') {
      toast.error('Please fill out all fields', { autoClose: 5000 });
      return;
    }

    const diff = parseInt(countValue) - parseInt(completedCountValue);
    setMessage(diff > 0 ? 'You have more to complete!' : 'You have exceeded your goal!');

    const dateTime = new Date().toLocaleString();
    const newEntry = {
      userId: localStorage.getItem('userId'), // Use userId from local storage
      typeOfWorkout,
      countValue,
      completedCountValue,
      timeTaken: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
      dateTime,
    };

    try {
      await axios.post('http://localhost:5000/api/workouts', newEntry);
      setWorkoutData([...workoutData, newEntry]);

      toast.success(diff > 0 ? 'Keep going!' : 'Great job!', { autoClose: 10000 });
    } catch (error) {
      toast.error('Failed to save the data.', { autoClose: 5000 });
    }
  };

  const handleShowTasks = async () => {
    navigate('/workout-history'); // Navigate to WorkoutHistory page
  };

  const refresh = () => {
    setTypeOfWorkout('');
    setCountValue('');
    setCompletedCountValue('');
    setMessage('');
    setMinutes(1);
    setSeconds(0);
    setIsActive(false);
    setWasActive(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            if (audioRef.current) {
              audioRef.current.play();
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setMinutes(parseInt(value));
    setSeconds(0);
  };

  const startTimer = () => {
    setIsActive(true);
    setWasActive(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setWasActive(true);
  };

  const resumeTimer = () => {
    if (wasActive) {
      setIsActive(true);
      setWasActive(false);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setWasActive(false);
    setMinutes(1);
    setSeconds(0);
  };

  return (
    <>
      <ToastContainer />
      <div className='margin'></div>
      <div className='background1'>
        <div className='run1'>
          <form>
            <div className='run2'>
              <div className='run3'>
                Type of Workout:
                <input
                  type='text'
                  placeholder='Enter Workout Type'
                  value={typeOfWorkout}
                  onChange={(e) => setTypeOfWorkout(e.target.value)}
                  className='box1'
                />
              </div>

              <div className='run3'>
                Set the Count you Want to Finish:
                <input
                  type='number'
                  placeholder='Enter the Count'
                  name='count'
                  required
                  value={countValue}
                  onChange={(e) => setCountValue(e.target.value)}
                  className='box1'
                />
              </div>

              <div className='run3'>
                Enter time in minutes:
                <input
                  type="number"
                  id="minutesInput"
                  placeholder='Enter the value in Minutes'
                  value={minutes}
                  onChange={handleInputChange}
                  className='box1'
                />
              </div>

              <div className='timer'>
                {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>

              <div className='btn'>
                <button className='button start' onClick={startTimer} disabled={isActive}>
                  Start Timer
                </button>
                <button className='button pause' onClick={pauseTimer} disabled={!isActive}>
                  Pause Timer
                </button>
                <button className='button resume' onClick={resumeTimer} disabled={isActive || !wasActive}>
                  Resume Timer
                </button>
                <button className='button stop' onClick={stopTimer} disabled={!isActive && !wasActive}>
                  Restart Timer
                </button>

                <audio ref={audioRef} src={alarm} />
              </div>

              <div className='run3'>
                Enter the Count you Have Completed:
                <input
                  type='number'
                  placeholder='Enter the Count'
                  name='completed'
                  required
                  value={completedCountValue}
                  onChange={(e) => setCompletedCountValue(e.target.value)}
                  className='box1'
                />
              </div>
              <div className='btn1'>
                <button type='button' className='button' onClick={calculate}>Calculate</button>
                <button type='button' className='button' onClick={refresh}>Refresh</button>
              </div>
              <div className='diff'>{message}</div>
              <button type='button' className='button' onClick={handleShowTasks}>View Workout History</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FitnessTracker;
