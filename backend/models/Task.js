const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Employee's name
    position: { type: String, required: true }, // Job title
    department: { type: String }, // Department name
    salary: { type: Number, required: true }, // Salary amount
    dateHired: { type: Date, default: Date.now }, // Hiring date
});

module.exports = mongoose.model('Employee', employeeSchema);