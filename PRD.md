# Product Requirements Document: Invoice Management Application

## App Overview and Objectives

### Description

A web-based invoice management application that allows users to upload, store, view, and download their invoices. The application will utilize Nuxt.js for the frontend with ShadCN components for a modern, accessible UI, Supabase for authentication and storage, with Mistral AI model integration for data extraction and Stripe for payment processing.

### Problem Statement

Small businesses and freelancers need a simple way to store and organize their invoices digitally without complex accounting software. This application provides an easy-to-use solution for invoice management with both free and paid tiers.

### Core Value Proposition

- Simple and intuitive invoice storage solution
- Quick access to important invoice information
- Secure document management
- Flexible pricing model with free tier for small users

## Target Audience

### Primary Users

- Freelancers
- Small business owners
- Self-employed professionals
- Administrative assistants
- Accounting staff

### User Scenarios

1. **Freelancer Jane**: Uses the free tier to store her 3-5 monthly invoices, primarily needing a way to keep them organized and accessible.
2. **Small Business Owner Mark**: Subscribes to the paid tier to manage 15-20 monthly invoices across various vendors and clients.

## Core Features and Functionality

### User Authentication

- Email/password registration and login
- Google OAuth integration
- Account verification
- Password reset functionality

**Acceptance Criteria:**

- Users can register with email and password
- Users can log in using Google authentication
- Users can reset their password
- Login sessions persist appropriately

### Home Page

- Quick upload functionality for invoices
- Overview of account status (free/paid tier)
- Count of uploaded invoices
- Quick navigation to dashboard and profile

**Acceptance Criteria:**

- Users can upload documents directly from the home page
- Home page shows current tier and upload count
- Clear navigation to other app sections

### Invoice Upload

- File upload interface with drag-and-drop
- Support for PDF and image file formats
- Free tier limited to 5 invoices total
- Paid tier with monthly upload limits

**Acceptance Criteria:**

- Files can be uploaded via button or drag-and-drop
- System validates file types (PDF, PNG, JPG)
- System enforces upload limits based on user's tier
- Upload progress is displayed to user

### Invoice Dashboard

- List view of all uploaded invoices
- Basic sorting by date, issuer, and amount
- Search functionality for invoice data
- Download functionality for stored invoices
- Notes feature for adding comments to invoices

**Acceptance Criteria:**

- Dashboard displays all user invoices with key information
- Invoices can be sorted by multiple criteria
- Search returns relevant results based on invoice fields
- Documents can be downloaded in original format
- Notes can be added and edited for each invoice

### Profile Management

- View and edit username and full name
- Upload and change profile picture
- View email (non-editable)
- Account deletion option

**Acceptance Criteria:**

- Users can edit their username and full name
- Profile pictures can be uploaded and displayed
- Email is displayed but cannot be edited
- Account deletion has confirmation and completely removes user data

### Subscription and Payment

- Free tier with 5 invoice limit
- Paid subscription tier with monthly upload limit
- Per-upload charges for exceeding monthly limits
- Stripe integration for payment processing

**Acceptance Criteria:**

- Users can upgrade from free to paid tier
- Subscription management interface is clear and intuitive
- Payment processing is secure and reliable
- System correctly tracks and enforces upload limits

## Technical Stack Recommendations

### Frontend

- **Framework**: Nuxt.js 3
- **UI Components**: ShadCN Vue components for a modern, accessible, and consistent UI
- **State Management**: Nuxt's built-in stores or Pinia
- **File Upload**: Custom component built with ShadCN components
- **Styling**: Tailwind CSS with ShadCN's design system

### Backend/Storage

- **Platform**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage for document files
- **Authentication**: Supabase Auth

### Integrations

- **Document Processing**: Mistral AI model for data extraction
- **Payments**: Stripe API
- **OAuth**: Google Authentication

## Conceptual Data Model

### Users Table

```
id: uuid (primary key)
email: string (unique)
full_name: string
username: string
profile_picture_url: string (nullable)
tier: enum ['free', 'paid']
created_at: timestamp
updated_at: timestamp
```

### Invoices Table

```
id: uuid (primary key)
user_id: uuid (foreign key to users.id)
file_path: string
file_name: string
upload_date: timestamp
file_size: integer
notes: text (nullable)

// Extracted data (from Mistral model)
document_number: string (nullable)
issue_date: date (nullable)
issuer_name: string (nullable)
issuer_address: string (nullable)
issuer_id: string (nullable) // incorporation/VAT number
recipient_name: string (nullable)
recipient_address: string (nullable)
recipient_id: string (nullable) // incorporation/VAT number
transaction_purpose: text (nullable)
tax_rate: decimal (nullable)
transaction_amount: decimal (nullable)
```

### Subscriptions Table

```
id: uuid (primary key)
user_id: uuid (foreign key to users.id)
stripe_customer_id: string
stripe_subscription_id: string (nullable)
tier: enum ['free', 'paid']
monthly_upload_limit: integer
uploads_used: integer
start_date: date
end_date: date (nullable)
status: enum ['active', 'cancelled', 'past_due']
```

## UI Design Principles

### Component Library

- Utilize ShadCN Vue components for consistent UI/UX
- Follow ShadCN's design system for spacing, typography, and color
- Implement ShadCN's form components for all user inputs
- Use ShadCN's dialog and toast components for notifications
- Leverage ShadCN's table components for invoice listings
- Implement ShadCN's card components for dashboard widgets

### Key Screens

1. **Home Page**

   - Hero section using ShadCN's typography and layout components
   - Quick upload widget using ShadCN's button and form components
   - Account status summary using ShadCN's card components
   - Navigation using ShadCN's navigation components

2. **Dashboard**

   - Table view using ShadCN's table components
   - Search and filter controls using ShadCN's form components
   - Sort options using ShadCN's dropdown components
   - Download and note actions using ShadCN's button components
   - Pagination using ShadCN's pagination component

3. **Invoice Detail View**

   - Document preview using ShadCN's card components
   - Extracted information using ShadCN's typography components
   - Notes section using ShadCN's form components
   - Download button using ShadCN's button components

4. **Profile Page**

   - Profile picture upload using ShadCN's upload component
   - Personal information form using ShadCN's form components
   - Account settings using ShadCN's card components
   - Deletion option using ShadCN's dialog component

5. **Subscription Management**
   - Current plan details using ShadCN's card components
   - Usage statistics using ShadCN's progress components
   - Upgrade options using ShadCN's button components
   - Payment method management using ShadCN's form components

### Navigation Structure

- Persistent top navigation bar
- Main sections: Home, Dashboard, Profile
- Settings accessible from profile dropdown
- Mobile-responsive hamburger menu

## Security Considerations

### Authentication

- Implement secure password policies
- Use Supabase JWT for session management
- Protect routes based on authentication status

### Data Privacy

- Ensure documents are only accessible to their owners
- Implement row-level security in Supabase
- Securely handle and store financial documents

### Payment Processing

- Use Stripe Elements for secure payment collection
- Do not store credit card information directly
- Follow PCI compliance guidelines

## Development Phases

### MVP (3-4 Day Timeline)

#### Day 1

- Project setup (Nuxt.js + Supabase)
- User authentication implementation
- Basic layout and navigation

#### Day 2

- File upload functionality
- Supabase storage integration
- Profile page development

#### Day 3

- Dashboard implementation
- Invoice listing and downloading
- Notes feature

#### Day 4

- Basic Stripe integration
- Subscription tier enforcement
- Testing and bug fixes
- Deployment

### Future Enhancements (Post-MVP)

- Mistral AI integration for document data extraction
- Advanced search and filtering capabilities
- Dashboard analytics and reporting
- Document categorization/tagging
- Email notifications for subscription events
- Mobile application version

## Pricing and Subscription Model

### Free Tier

- Maximum 5 invoice uploads total
- Basic features including storage and download
- No automatic data extraction

### Paid Tier

- Monthly subscription (price TBD)
- Set number of uploads included per month
- Per-upload charge for exceeding monthly limit
- All features including future data extraction

## Technical Integration Details

### Supabase Setup

- Configure authentication providers (email/password and Google)
- Create storage buckets with appropriate security rules
- Set up database tables with relationships
- Implement row-level security policies

### Stripe Integration

- Create subscription products and price points
- Implement customer creation on signup
- Set up subscription creation workflow
- Configure webhooks for payment events

### Mistral Model Integration (Post-MVP)

- API integration for document analysis
- Processing pipeline for extracted data
- Storage of structured information
- Fallback UI for manual data entry

## Potential Challenges and Solutions

### Development Timeline

**Challenge**: The 3-4 day timeline is extremely tight for full implementation.
**Solution**: Focus on core functionality first, potentially deferring the Mistral integration and advanced features to post-MVP.

### File Processing

**Challenge**: Handling different file formats and ensuring proper extraction.
**Solution**: Initially support limited file types (PDF, PNG, JPG) and implement more robust processing post-MVP.

### Subscription Logic

**Challenge**: Complex tracking of usage across tiers.
**Solution**: Implement simple counters initially, with more sophisticated metering post-MVP.

## Conclusion

This invoice management application provides a streamlined solution for document storage and management with a flexible pricing model. The MVP focuses on core functionality to meet the tight development timeline, with plans for enhanced features in future iterations.
