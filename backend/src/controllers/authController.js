const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.signup = async (req, res) => {
  const {
    name,
    rollNumber,
    registrationNumber,
    email,
    password,
    role,
    branchId,
    cgpa
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    if (role === 'student') {
      await prisma.student.create({
        data: {
          id: user.id,
          name,
          email,
          branchId: branchId ? parseInt(branchId) : 1,
          cgpa: cgpa ? parseFloat(cgpa) : 0.0,
          rollNumber: rollNumber || null,
          registrationNumber: registrationNumber || null
        }
      });
    }

    res.json({
      token: generateToken(user)
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  res.json({
    token: generateToken(user)
  });
};

// Return the currently authenticated user's basic info
exports.me = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(user);

  } catch (err) {
    console.error('Me endpoint error:', err);

    res.status(500).json({
      error: 'Failed to fetch user'
    });
  }
};