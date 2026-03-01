// A simple middleware to check if the user is an admin.
// This should run *after* the 'protect' middleware.
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed to the next function.
    } else {
        res.status(403); // 403 Forbidden is more appropriate than 401 Unauthorized here
        throw new Error('Not authorized as an admin');
    }
};

export { admin };