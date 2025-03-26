const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Employee = require('../models/Employee');
const { addEmployee, getEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { expect } = chai;

chai.use(chaiHttp);

describe('AddEmployee Function Test', () => {
    it('should create a new employee successfully', async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { name: "John Doe", position: "Developer", department: "IT", salary: 70000 }
        };

        const createdEmployee = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

        const createStub = sinon.stub(Employee, 'create').resolves(createdEmployee);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await addEmployee(req, res);

        expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdEmployee)).to.be.true;

        createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        const createStub = sinon.stub(Employee, 'create').throws(new Error('DB Error'));

        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { name: "John Doe", position: "Developer", department: "IT", salary: 70000 }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await addEmployee(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        createStub.restore();
    });
});

describe('UpdateEmployee Function Test', () => {
    it('should update employee successfully', async () => {
        const employeeId = new mongoose.Types.ObjectId();
        const existingEmployee = {
            _id: employeeId,
            name: "Jane Doe",
            position: "Analyst",
            department: "Finance",
            salary: 60000,
            save: sinon.stub().resolvesThis(),
        };

        const findByIdStub = sinon.stub(Employee, 'findById').resolves(existingEmployee);

        const req = {
            params: { id: employeeId },
            body: { position: "Senior Analyst", salary: 75000 }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateEmployee(req, res);

        expect(existingEmployee.position).to.equal("Senior Analyst");
        expect(existingEmployee.salary).to.equal(75000);
        expect(res.json.calledOnce).to.be.true;

        findByIdStub.restore();
    });

    it('should return 404 if employee is not found', async () => {
        const findByIdStub = sinon.stub(Employee, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateEmployee(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Employee not found' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 on error', async () => {
        const findByIdStub = sinon.stub(Employee, 'findById').throws(new Error('DB Error'));

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateEmployee(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.called).to.be.true;

        findByIdStub.restore();
    });
});

describe('GetEmployees Function Test', () => {
    it('should return employees for the given user', async () => {
        const userId = new mongoose.Types.ObjectId();

        const employees = [
            { _id: new mongoose.Types.ObjectId(), name: "John Doe", userId },
            { _id: new mongoose.Types.ObjectId(), name: "Jane Smith", userId }
        ];

        const findStub = sinon.stub(Employee, 'find').resolves(employees);

        const req = { user: { id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getEmployees(req, res);

        expect(findStub.calledOnceWith({ userId })).to.be.true;
        expect(res.json.calledWith(employees)).to.be.true;

        findStub.restore();
    });

    it('should return 500 on error', async () => {
        const findStub = sinon.stub(Employee, 'find').throws(new Error('DB Error'));

        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getEmployees(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        findStub.restore();
    });
});

describe('DeleteEmployee Function Test', () => {
    it('should delete an employee successfully', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        const employee = { remove: sinon.stub().resolves() };

        const findByIdStub = sinon.stub(Employee, 'findById').resolves(employee);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteEmployee(req, res);

        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(employee.remove.calledOnce).to.be.true;
        expect(res.json.calledWith({ message: 'Employee deleted' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 404 if employee is not found', async () => {
        const findByIdStub = sinon.stub(Employee, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteEmployee(req, res);

        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Employee not found' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        const findByIdStub = sinon.stub(Employee, 'findById').throws(new Error('DB Error'));

        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteEmployee(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        findByIdStub.restore();
    });
});