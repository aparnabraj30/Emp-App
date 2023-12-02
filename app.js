const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Task1: initiate app and run server at 3000
const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());

// Serve static files
const path = require('path');
app.use(express.static(path.join(__dirname, '/dist/FrontEnd')));

// Task2: create MongoDB connection
mongoose.connect('url', { useUnifiedTopology: true })  // Paste your database URL here inside single quotes
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Define employee schema
const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

// Create employee model
const Employee = mongoose.model('Employee', employeeSchema);

// TODO: get data from db using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// TODO: get single data from db using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// TODO: send data from db using api '/api/employeelist'
// Request body format: {name:'', location:'', position:'', salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const newEmployee = new Employee({ name, location, position, salary });
        await newEmployee.save();
        res.json(newEmployee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// TODO: delete an employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });

        // Use deleteOne or remove method to delete the document
        await employee.deleteOne();
        // Alternatively, you can use:
        // await Employee.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// TODO: Update an employee data from db by using api '/api/employeelist'


app.put('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const updateObject = {};
        if (name) updateObject.name = name;
        if (location) updateObject.location = location;
        if (position) updateObject.position = position;
        if (salary) updateObject.salary = salary;

        const updatedEmployee = await Employee.findOneAndUpdate({}, { $set: updateObject }, { new: true });

        if (!updatedEmployee) {
            res.status(404).json({ error: "No employee found to update" });
        } else {
            res.json(updatedEmployee);
        }
    } catch (error) {
        console.error("Error updating employee:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Don't delete this code. It connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
