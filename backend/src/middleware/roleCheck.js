// ============================================
// ROLE CHECK MIDDLEWARE — Doosra security guard
// Pehla guard (auth.js) check karta hai: "Token valid hai?"
// Yeh guard check karta hai: "Tujhe yeh kaam karne ki permission hai?"
//
// Example: Patient ko department create karne ki permission nahi hai
// roleCheck(['ADMIN']) = "Sirf ADMIN hi yeh kar sakta hai"
//
// Yeh ek "higher-order function" hai — function jo function return karta hai
// Kyunki hume bataana hai ki KONSE roles allowed hain
// roleCheck(['ADMIN']) call hota hai → actual middleware function return karta hai
// ============================================

const roleCheck = (allowedRoles) => {
  // Yeh outer function immediately call hota hai: roleCheck(['ADMIN', 'DOCTOR'])
  // allowedRoles = ['ADMIN', 'DOCTOR']

  return (req, res, next) => {
    // Yeh inner function Express ko milta hai as middleware
    // req.user auth middleware ne set kiya tha (pehle hi check ho chuka hai)

    // Kya user ka role allowed roles mein hai?
    // .includes() = array mein yeh value hai ya nahi
    // Example: ['ADMIN', 'DOCTOR'].includes('PATIENT') → false → access denied
    // Example: ['ADMIN', 'DOCTOR'].includes('ADMIN') → true → allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
      // 403 = Forbidden = "Tujhe pata hai tu kaun hai, lekin tujhe permission nahi hai"
      // 401 vs 403:
      //   401 = "Kaun ho tum?" (no token)
      //   403 = "Tum ho toh sahi, lekin tumhe yeh karne ki permission nahi hai"
    }

    // Role match ho gaya — aage jaao!
    next();
  };
};

module.exports = roleCheck;