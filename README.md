# Augmented Reality Museum Project

## Dual Interface System

This project now features a complete dual interface system with separate experiences for regular users and administrators.

### Features Implemented ✅

#### 1. **Text-to-Speech Fixed**
- Switched from server-based TTS to Web Speech API
- Works across all modern browsers
- Auto-play functionality for artifact pages
- Error handling for unsupported browsers

#### 2. **Email Verification System**
- Forced email verification before login
- Resend verification email functionality
- Improved Gmail deliverability settings
- Modal-based verification flow

#### 3. **Password Reset with Validation**
- Comprehensive password requirements
- Real-time validation feedback
- Visual password strength indicators
- Secure Firebase password reset flow

#### 4. **Dual User Interface**
- **General User Interface**: Access to AR artifacts, museum content, and basic features
- **Admin Interface**: Complete dashboard for user and content management

### How to Use

#### For General Users:
1. Visit `http://localhost:3000/login.html`
2. Sign up with email or Google
3. Verify your email address
4. Access the museum content and AR features

#### For Administrators:
1. Use any email from authorized university domains:
   - **University Domain**: Any email ending with `@myturf.ul.ac.za` or `@ul.ac.za`
2. Login automatically redirects to admin dashboard
3. Access user management, AR content control, and analytics

### Admin Features

#### Dashboard Overview
- User statistics and engagement metrics
- Recent activity monitoring
- System health indicators

#### User Management
- View all registered users
- Create new user accounts
- Manage user roles and permissions
- Send verification emails

#### AR Content Management
- Upload new AR artifacts
- Edit existing content
- Generate QR codes
- Manage artifact metadata

#### Analytics
- User engagement tracking
- Content popularity metrics
- System usage statistics

#### Settings
- Email configuration
- System preferences
- Security settings

### Server Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Login: `http://localhost:3000/login.html`
   - Admin Panel: `http://localhost:3000/admin.html`

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6 Modules, Bootstrap 5
- **Authentication**: Firebase Authentication v10.12.2
- **Backend**: Node.js, Express.js
- **Text-to-Speech**: Web Speech API
- **Styling**: Custom CSS with Glassmorphism effects
- **Icons**: Font Awesome

### File Structure

```
├── index.html          # Main user interface
├── login.html          # Login page
├── admin.html          # Admin dashboard
├── create.html         # User registration
├── reset.html          # Password reset
├── verify.html         # Email verification
├── server.js           # Node.js server
├── app.js              # Firebase configuration
├── login.js            # Login functionality
├── admin.js            # Admin dashboard logic
├── index.js            # Main user interface logic
├── create.js           # Registration logic
├── reset.js            # Password reset logic
├── assets/             # Images and media
├── artifacts_html/     # AR artifact pages
└── AR_QR_CODES/       # QR code images
```

### Authentication Flow

1. **Registration**: Email + password or Google OAuth
2. **Email Verification**: Automatic verification check on login
3. **Role Detection**: Admin access is granted based on:
   - Specific admin email addresses
   - University domains (`@myturf.ul.ac.za`, `@ul.ac.za`)
4. **Dashboard Access**: 
   - Regular users → `index.html`
   - Admin users → `admin.html`

### Admin Access Control

The system uses domain-based authentication to determine admin privileges:

**University Domain Access**:
- Any email ending with `@myturf.ul.ac.za`
- Any email ending with `@ul.ac.za`

This allows all university staff and students to have administrative access to the system.

### Security Features

- Email verification enforcement
- Password strength validation
- Role-based access control
- Secure Firebase authentication
- HTTPS-ready configuration

### Next Steps

- [ ] Integrate Chart.js for analytics visualization
- [ ] Implement Firebase Firestore for user/content management
- [ ] Add content upload functionality
- [ ] Implement user role editing
- [ ] Add audit logging for admin actions

---

**Note**: Make sure to configure your Firebase project with the correct settings and replace the admin emails with your actual admin accounts.
