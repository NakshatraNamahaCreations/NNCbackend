const Person = require('../models/personModel');
const bcrypt = require('bcrypt');

// Create a new person
exports.createPerson = async (req, res) => {
  try {
    const { name, email, mobileNumber, role, password, status } = req.body;
    
    const existingPerson = await Person.findOne({ email });
    if (existingPerson) {
      return res.status(400).json({ message: 'Person with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const person = new Person({
      name,
      email,
      mobileNumber,
      role,
      password: hashedPassword,
      status
    });

    await person.save();
    res.status(201).json({ message: 'Person created successfully', person: { ...person._doc, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating person', error: error.message });
  }
};

// Get all persons
exports.getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().select('-password');
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching persons', error: error.message });
  }
};

// Get person by ID
exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id).select('-password');
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching person', error: error.message });
  }
};

// Update person
exports.updatePerson = async (req, res) => {
  try {
    const { name, email, mobileNumber, role, password, status } = req.body;
    const updateData = { name, email, mobileNumber, role, status };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const person = await Person.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json({ message: 'Person updated successfully', person });
  } catch (error) {
    res.status(500).json({ message: 'Error updating person', error: error.message });
  }
};

// Delete person
exports.deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting person', error: error.message });
  }
};

// Login check (example endpoint)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const person = await Person.findOne({ email }).select('+password');

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!person.status) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    res.status(200).json({ message: 'Login successful', person: { ...person._doc, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};