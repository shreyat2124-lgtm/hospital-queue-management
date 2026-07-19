// ============================================
// AUTH MIDDLEWARE — Yeh security guard hai jo har protected route pe check karta hai
// "Kya tere paas valid JWT token hai? Nahi hai toh nikal!"
// Yeh middleware routes ke PEHLE chalta hai — route handler tab tak nahi chalega jab tak yeh pass nahi hota
// ============================================

const jwt = require('jsonwebtoken'); // JWT library — tokens verify karne ke liye

// Middleware function — Express isko (req, res, next) ke saath call karta hai
// next() = "Sab theek hai, aage jaao" (next middleware ya route handler pe)
// next() na karna = "Ruk jao, request yahi pe end"
const auth = (req, res, next) => {
  // Step 1: Authorization header padho
  // Postman mein Bearer Token set karte ho toh yeh header automatically aata hai
  // Header dikhta hai: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers.authorization;

  // Step 2: Header hai bhi ya nahi? Aur "Bearer " se start hota hai ya nahi?
  // ! = "nahi hai" (NOT operator)
  // || = "ya" (OR operator) — dono mein se koi bhi true ho toh reject
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
    // 401 = Unauthorized = "Pehle login karke token lao"
    // return lagane se neeche ka code nahi chalega
  }

  // Step 3: Token nikalo header se
  // "Bearer eyJhbG..." ko space se split karo → ["Bearer", "eyJhbG..."]
  // [1] = doosra element = sirf token part
  const token = authHeader.split(' ')[1];

  // Step 4: Token verify karo — yeh sabse important step hai
  try {
    // jwt.verify() kya karta hai:
    // 1. Token ka payload decode karta hai
    // 2. Server ke SECRET_KEY se signature recalculate karta hai
    // 3. Original signature se compare karta hai
    // Agar match → valid token → user ka data return karta hai
    // Agar mismatch → error throw karta hai (tampered/expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: 1, name: "Admin User", role: "ADMIN", iat: ..., exp: ... }

    // User ka data req.user mein daal do
    // Ab route handler mein req.user.id, req.user.role se access kar sakte hain
    req.user = decoded;

    // "Security check pass! Aage jaao" — next middleware ya route handler chalega
    next();
  } catch (error) {
    // Token invalid hai (expired, tampered, wrong secret)
    // try/catch ke bina server crash ho jaata ek kharab token se
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Is function ko export karo taaki doosri files mein use kar sakein
// routes mein: router.get('/me', auth, (req, res) => {...})
module.exports = auth;