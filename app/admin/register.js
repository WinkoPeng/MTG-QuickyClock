import { useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import db from '../firebase';
import styles from './admin.module.css';

function Register() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    name: '',
    class: 'employee',
    gender: 'male',
    email: '',
    cell: '',
    address: '',
    workHours: {
      Monday: { start: '', end: '' },
      Tuesday: { start: '', end: '' },
      Wednesday: { start: '', end: '' },
      Thursday: { start: '', end: '' },
      Friday: { start: '', end: '' },
      Saturday: { start: '', end: '' },
      Sunday: { start: '', end: '' }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.start') || name.includes('.end')) {
      const [day, timeType] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        workHours: {
          ...prevData.workHours,
          [day]: {
            ...prevData.workHours[day],
            [timeType]: value
          }
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateWorkHours = () => {
    for (let day in formData.workHours) {
      const start = formData.workHours[day].start;
      const end = formData.workHours[day].end;
      if (start && end && new Date(`1970-01-01T${end}`) < new Date(`1970-01-01T${start}`)) {
        alert(`${day}: End time cannot be earlier than start time.`);
        return false;
      }
    }
    return true;
  };

  const checkForDuplicates = async () => {
    const idQuery = query(collection(db, 'employee'), where('id', '==', formData.id));
    const emailQuery = query(collection(db, 'employee'), where('email', '==', formData.email));
    const idSnapshot = await getDocs(idQuery);
    const emailSnapshot = await getDocs(emailQuery);

    if (!idSnapshot.empty) {
      alert('Employee ID already exists');
      return false;
    }
    if (!emailSnapshot.empty) {
      alert('Email already exists');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateWorkHours()) {
      return;
    }
    if (!validateEmail(formData.email)) {
      alert('Invalid email format');
      return;
    }
    if (!(await checkForDuplicates())) {
      return;
    }

    try {
      const formattedWorkHours = Object.keys(formData.workHours).reduce((acc, day) => {
        acc[day] = `${formData.workHours[day].start} - ${formData.workHours[day].end}`;
        return acc;
      }, {});

      await addDoc(collection(db, 'employee'), {
        ...formData,
        workHours: formattedWorkHours
      });
      alert('Employee added successfully!');
      setFormData({
        id: '',
        password: '',
        name: '',
        class: 'employee',
        gender: 'male',
        email: '',
        cell: '',
        address: '',
        workHours: {
          Monday: { start: '', end: '' },
          Tuesday: { start: '', end: '' },
          Wednesday: { start: '', end: '' },
          Thursday: { start: '', end: '' },
          Friday: { start: '', end: '' },
          Saturday: { start: '', end: '' },
          Sunday: { start: '', end: '' }
        }
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding employee.');
    }
  };

  return (
    <div className={styles.register}>
      <h2>Register Employee</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required className={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className={styles.input} />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className={styles.input} />
        <select name="class" value={formData.class} onChange={handleChange} required className={styles.input}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <select name="gender" value={formData.gender} onChange={handleChange} required className={styles.input}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={styles.input} />
        <input type="text" name="cell" placeholder="Cell" value={formData.cell} onChange={handleChange} required className={styles.input} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className={styles.input} />
        
        <div className={styles.workHours}>
          <h3>Work Hours</h3>
          {Object.keys(formData.workHours).map(day => (
            <div key={day} className={styles.workHoursRow}>
              <label>{day}</label>
              <input type="time" name={`${day}.start`} value={formData.workHours[day].start} onChange={handleChange} className={styles.inputTime} />
              <span>to</span>
              <input type="time" name={`${day}.end`} value={formData.workHours[day].end} onChange={handleChange} className={styles.inputTime} />
            </div>
          ))}
        </div>

        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
}

export { Register };
