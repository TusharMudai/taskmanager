const Employee = require('../models/Employee'); // Updated to Employee model

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ userId: req.user.id }); // Fetch employees
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addEmployee = async (req, res) => {
    const { name, position, department, salary } = req.body; // Employee fields
    try {
        const employee = await Employee.create({ userId: req.user.id, name, position, department, salary });
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    const { name, position, department, salary } = req.body;
    try {
        const employee = await Employee.findById(req.params.id); // Find employee by ID
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        employee.name = name || employee.name;
        employee.position = position || employee.position;
        employee.department = department || employee.department;
        employee.salary = salary ?? employee.salary;
        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        await employee.remove();
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees, addEmployee, updateEmployee, deleteEmployee }; // Updated exports