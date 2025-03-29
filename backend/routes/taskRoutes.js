const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees (with user population)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().populate({
      path: 'userId',
      select: 'name email university' // Only include these user fields
    });
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET a single employee by ID (with user population)
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate({
      path: 'userId',
      select: 'name email university'
    });
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// POST create a new employee (with user validation)
router.post('/', async (req, res) => {
  const { userId, name, position, department, salary } = req.body;
  
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Valid user ID is required' });
  }

  try {
    const newEmployee = new Employee({ 
      userId, 
      name, 
      position, 
      department, 
      salary 
    });
    await newEmployee.save();
    
    // Return the created employee with populated user data
    const populatedEmployee = await Employee.populate(newEmployee, {
      path: 'userId',
      select: 'name email'
    });
    
    res.status(201).json(populatedEmployee);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ 
      error: 'Failed to add employee',
      details: err.message 
    });
  }
});

// PUT update an employee by ID
router.put('/:id', async (req, res) => {
  const { name, position, department, salary } = req.body;
  
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, position, department, salary },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ 
      error: 'Failed to update employee',
      details: err.message 
    });
  }
});

// DELETE an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ 
      message: 'Employee deleted successfully',
      deletedEmployee 
    });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ 
      error: 'Failed to delete employee',
      details: err.message 
    });
  }
});

module.exports = router;