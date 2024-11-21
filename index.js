const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));

// Utility functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const validateBase64File = (base64String) => {
    try {
        // Split Base64 string to extract MIME type (optional)
        const parts = base64String.split(',');
        const rawData = parts.length > 1 ? parts[1] : parts[0];
        const buffer = Buffer.from(rawData, 'base64');

        // Detect MIME type from the buffer
        const mimeType = rawData.match(/data:(.*?);base64/);
        const detectedMimeType = mimeType ? mimeType[1] : null;

        // Calculate size in KB
        const sizeKB = (buffer.length / 1024).toFixed(2);

        return {
            file_valid: !!detectedMimeType,
            file_mime_type: detectedMimeType,
            file_size_kb: sizeKB,
        };
    } catch (error) {
        console.error('Error validating Base64 file:', error);
        return { file_valid: false, file_mime_type: null, file_size_kb: 0 };
    }
};


// Routes
// GET 
app.get('/', (req, res) => {
    res.send(`<h1>Welcome to Bajaj Finserv Health Limited</h1></br>Get Route: <a href="/bfhl">Click here</a> </br> Post Route: <a href="/bfhl">Click here</a> ---> Send data and file_b64 as json in post request </br> </br> </br>
    
    <b style="color: red;font-size: 1.3rem;">In case routes do not work, please wait for 50 seconds. It takes about 50 seconds for the service to start again.</b>
    `);
})

app.get('/bfhl', (req, res) => {
    res.status(200).json({ status: 200, operation_code: 1 });
});

// POST 
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Extract user details (replace with actual values)
    const userId = 'john_doe_17091999';
    const email = 'john@xyz.com';
    const rollNumber = 'ABCD123';

    if (!Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: 'Invalid input format' });
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;
    let primeFound = false;

    // Process data
    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
            if (isPrime(Number(item))) primeFound = true;
        } else if (typeof item === 'string') {
            alphabets.push(item);
            if (item === item.toLowerCase() && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    // Handle file (if provided)
    let fileDetails = { file_valid: false, file_mime_type: null, file_size_kb: 0 };
    if (file_b64) {
        fileDetails = validateBase64File(file_b64);
        console.log(fileDetails);
    }

    // Build response
    res.status(200).json({
        is_success: true,
        user_id: userId,
        email,
        roll_number: rollNumber,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: primeFound,
        file_valid: fileDetails.file_valid,
        file_mime_type: fileDetails.file_mime_type,
        file_size_kb: fileDetails.file_size_kb,
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
