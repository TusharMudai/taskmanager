import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const EmployeeForm = ({ employees, setEmployees, editingEmployee, setEditingEmployee }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', position: '', department: '', salary: '' });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        position: editingEmployee.position,
        department: editingEmployee.department,
        salary: editingEmployee.salary,
      });
    } else {
      setFormData({ name: '', position: '', department: '', salary: '' });
    }
  }, [editingEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const response = await axiosInstance.put(`/api/employees/${editingEmployee._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEmployees(employees.map((employee) => (employee._id === response.data._id ? response.data : employee)));
      } else {
        const response = await axiosInstance.post('/api/employees', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEmployees([...employees, response.data]);
      }
      setEditingEmployee(null);
      setFormData({ name: '', position: '', department: '', salary: '' });
    } catch (error) {
      alert('Failed to save employee.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Department"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Salary"
        value={formData.salary}
        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingEmployee ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  );
};

export default EmployeeForm;