# UI Parity Documentation: Web vs Android App

This document outlines the UI structure and components used to ensure parity between the FitZone React web application and the Android Jetpack Compose application.

## Core Design Tokens
- **Primary Green**: `#1BB85B`
- **Background**: `#F8F8F8` (Light Gray)
- **Secondary Background**: `#FFFFFF` (White)
- **Font**: `Outfit` (Primary), `Inter` (Fallback)

## Consistent Screens Implemented

### 1. Gym Setup Flow (Admin)
- **GymSetup.jsx**: Matches `GymSetupScreen.kt`. Progress indicator with 5 steps.
- **ConfigureHours.jsx**: Matches `ConfigureHoursScreen.kt`. Morning, Afternoon, Evening session cards.
- **UploadData.jsx**: Matches `UploadDataScreen.kt`. Format instructions and file upload boxes for Historical Data and Members.
- **SetCapacity.jsx**: Matches `SetCapacityScreen.kt`. Capacity input with info card explainers.

### 2. User Authentication & Profile
- **Login.jsx**: Matches `LoginScreen.kt`. Centered logo, green buttons, and links to registration/reset.
- **Register.jsx**: Matches `RegisterScreen.kt`. Multi-field form including Age, Gender, and Role dropdowns.
- **ForgotPassword.jsx**: Matches `VerifyOTPScreen.kt`. Multi-step OTP and password reset flow.
- **Profile.jsx**: Matches `ProfileScreen.kt`. Hero section with avatar, gym membership details card, and action items.
- **EditProfile.jsx**: Matches `EditProfileScreen.kt`. Editable fields with icons and camera badge.

### 3. Membership & Booking
- **GymSelection.jsx**: Matches `GymSelectionScreen.kt`. Search bar, gym cards with location icons, and member verification.
- **BookSlot.jsx**: Matches `BookSlotScreen.kt`. Horizontal date picker and color-coded time slots.
- **BookingHistory.jsx**: Matches `BookingHistoryScreen.kt`. Card-based history items with status indicators.

## Key CSS Classes (`index.css`)
- `.icon-circle-lg`: Green circle with icon/emoji for headers.
- `.card-modern`: Standard white card with subtle shadow and border.
- `.progress-steps`: Flex row of dots and lines for multi-step onboarding.
- `.input-with-icon`: Input container with an icon on the left.
- `.page-header-simple`: Scaffold-like top bar with back button and title.

## Navigation Structure
- **User Root**: `WebLanding` (Marketing) -> `Login` -> `Dashboard`.
- **Admin Setup**: `Register` (Admin) -> `GymSetup` -> `ConfigureHours` -> `UploadData` -> `SetCapacity` -> `AdminDashboard`.
- **User Change Gym**: `Profile` -> `GymSelection` -> `Verify Member` -> `Profile`.
