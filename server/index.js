const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// File paths
const USERS_FILE = path.join(dataDir, 'users.json');
const REQUESTS_FILE = path.join(dataDir, 'requests.json');
const MESSAGES_DIR = path.join(dataDir, 'messages');

// Initialize data files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }));
}
if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify({ requests: [] }));
}
if (!fs.existsSync(MESSAGES_DIR)) {
    fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

// Helper functions for file operations
const readData = (file) => {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Routes
// User Authentication
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const usersData = readData(USERS_FILE);

        if (usersData.users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            rewards: 0,
            requestsMade: 0,
            requestsFulfilled: 0,
            createdAt: new Date().toISOString()
        };

        usersData.users.push(newUser);
        writeData(USERS_FILE, usersData);

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET);
        res.json({ 
            token, 
            userId: newUser.id,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const usersData = readData(USERS_FILE);
        const user = usersData.users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Account not found. Please create an account first.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ 
            token, 
            userId: user.id,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Book Requests
app.get('/api/requests', (req, res) => {
    const requestsData = readData(REQUESTS_FILE);
    res.json(requestsData.requests);
});

app.get('/api/requests/:requestId', authenticateToken, (req, res) => {
    const { requestId } = req.params;
    const requestsData = readData(REQUESTS_FILE);
    const request = requestsData.requests.find(r => r._id === requestId || r.id === requestId);
    
    if (!request) {
        return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(request);
});

app.post('/api/requests', authenticateToken, (req, res) => {
    try {
        const { title, author, description, reward } = req.body;
        const requestsData = readData(REQUESTS_FILE);
        const usersData = readData(USERS_FILE);
        const user = usersData.users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newRequest = {
            _id: Date.now().toString(),
            title,
            author,
            description,
            reward: parseFloat(reward),
            requesterId: req.user.id,
            requesterName: user.name,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        requestsData.requests.push(newRequest);
        writeData(REQUESTS_FILE, requestsData);

        // Update user's requests made count
        user.requestsMade = (user.requestsMade || 0) + 1;
        writeData(USERS_FILE, usersData);

        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

app.get('/api/requests/user/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    const requestsData = readData(REQUESTS_FILE);
    const userRequests = requestsData.requests.filter(r => r.requesterId === userId);
    res.json(userRequests);
});

app.get('/api/requests/fulfilled/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    const requestsData = readData(REQUESTS_FILE);
    const fulfilledRequests = requestsData.requests.filter(r => 
        r.fulfilledBy === userId && r.status === 'fulfilled'
    );
    res.json(fulfilledRequests);
});

app.post('/api/upload/:requestId', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        const { requestId } = req.params;
        const requestsData = readData(REQUESTS_FILE);
        const usersData = readData(USERS_FILE);
        
        const request = requestsData.requests.find(r => r._id === requestId || r.id === requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.requesterId === req.user.id) {
            return res.status(400).json({ error: 'You cannot fulfill your own request' });
        }

        if (request.status === 'fulfilled') {
            return res.status(400).json({ error: 'Request already fulfilled' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const user = usersData.users.find(u => u.id === req.user.id);
        const requester = usersData.users.find(u => u.id === request.requesterId);

        // Update request status
        request.status = 'fulfilled';
        request.fulfilledBy = req.user.id;
        request.fulfilledByName = user.name;
        request.filePath = req.file.path;
        request.fulfilledAt = new Date().toISOString();

        // Update user stats
        user.requestsFulfilled = (user.requestsFulfilled || 0) + 1;
        user.rewards = (user.rewards || 0) + request.reward;

        writeData(REQUESTS_FILE, requestsData);
        writeData(USERS_FILE, usersData);

        res.json({ 
            message: 'File uploaded successfully', 
            request,
            rewardMessage: `You have earned $${request.reward} for fulfilling this request.`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    const usersData = readData(USERS_FILE);
    const user = usersData.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const usersData = readData(USERS_FILE);
    const user = usersData.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
        id: user.id,
        username: user.name,
        email: user.email,
        rewards: user.rewards,
        requestsFulfilled: user.requestsFulfilled,
        createdAt: user.createdAt
    });
});

// Messages
app.get('/api/messages/:bookId', (req, res) => {
    const { bookId } = req.params;
    const messageFile = path.join(MESSAGES_DIR, `${bookId}.json`);
    
    if (fs.existsSync(messageFile)) {
        res.json(readData(messageFile));
    } else {
        res.json([]);
    }
});

app.post('/api/messages/:bookId', authenticateToken, (req, res) => {
    const { bookId } = req.params;
    const { content } = req.body;
    const messageFile = path.join(MESSAGES_DIR, `${bookId}.json`);
    const usersData = readData(USERS_FILE);
    const user = usersData.users.find(u => u.id === req.user.id);

    let messages = [];
    if (fs.existsSync(messageFile)) {
        messages = readData(messageFile);
    }

    const newMessage = {
        id: Date.now().toString(),
        userId: req.user.id,
        username: user.name,
        content,
        createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    writeData(messageFile, messages);
    res.status(201).json(newMessage);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 