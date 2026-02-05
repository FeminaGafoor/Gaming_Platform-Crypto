# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard for managing withdrawal requests.

## Overview

The admin system allows administrators to:
- View all withdrawal requests from agents and affiliates
- Approve or reject withdrawal requests
- Add admin notes to withdrawals
- Track who approved/rejected each request

## Database Migration

If you're upgrading from a previous version, you need to add the new admin approval fields to the withdrawals table.

### Step 1: Run the Migration Script

```bash
cd backend
python migrate_withdrawals.py
```

This will add the following columns to the `withdrawals` table:
- `approved_by` - ID of the admin who processed the request
- `approved_at` - Timestamp of approval/rejection
- `rejection_reason` - Reason for rejection (if rejected)
- `admin_notes` - Optional notes from admin

## Creating an Admin User

### Option 1: Default Credentials

Run the script with default credentials:

```bash
cd backend
python create_admin.py
```

This creates an admin user with:
- **Email:** admin@gamingplatform.com
- **Password:** Admin@123

### Option 2: Custom Credentials

Specify your own email and password:

```bash
python create_admin.py --email your@email.com --password YourSecurePassword
```

### Important Security Notes

⚠️ **Change the default password immediately after first login!**

⚠️ **Do not commit admin credentials to version control!**

⚠️ **Use strong passwords in production!**

## Accessing the Admin Dashboard

1. Navigate to your application URL
2. Login with your admin credentials
3. You'll be automatically redirected to `/admin/withdrawals`

The admin dashboard shows:
- All withdrawal requests (pending, approved, rejected)
- User details (email, role)
- Payment information
- Request timestamps
- Action buttons for pending requests

## Approving Withdrawals

1. Click the **Approve** button on a pending withdrawal
2. Optionally add admin notes
3. Click **Confirm Approval**

When approved:
- Status changes to `APPROVED`
- Balance is deducted from agent/affiliate account
- Timestamp and admin ID are recorded
- User receives notification (if email configured)

## Rejecting Withdrawals

1. Click the **Reject** button on a pending withdrawal
2. **Enter a rejection reason** (required)
3. Optionally add admin notes
4. Click **Confirm Rejection**

When rejected:
- Status changes to `REJECTED`
- No balance changes occur
- Rejection reason is stored
- Timestamp and admin ID are recorded
- User receives notification with reason (if email configured)

## API Endpoints

### Get All Withdrawals
```http
GET /api/admin/withdrawals
Authorization: Bearer <admin_token>
```

### Approve Withdrawal
```http
PUT /api/admin/withdrawals/{id}/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "admin_notes": "Optional notes here"
}
```

### Reject Withdrawal
```http
PUT /api/admin/withdrawals/{id}/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rejection_reason": "Reason for rejection",
  "admin_notes": "Optional internal notes"
}
```

## Security

The admin system implements:
- **Role-based access control (RBAC)** - Only users with `role="admin"` can access admin endpoints
- **JWT authentication** - All requests require valid admin token
- **Frontend route protection** - Admin routes only accessible to admin users
- **Backend middleware** - `get_current_admin()` dependency validates admin role

Non-admin users attempting to access admin endpoints will receive a `403 Forbidden` error.

## Troubleshooting

### "Admin access required" error
- Verify your user account has `role="admin"` in the database
- Check that you're logged in with admin credentials
- Ensure the JWT token is valid and not expired

### Migration script fails
- Verify database connection in `.env` file
- Check that the `withdrawals` table exists
- Ensure you have ALTER TABLE permissions

### Can't create admin user
- Check if email already exists in database
- Verify database connection
- Ensure `users` table exists

## Database Schema

### User Model
```python
class User:
    id: int
    email: str
    password_hash: str
    role: UserRole  # ADMIN, AGENT, or AFFILIATE
    created_at: datetime
```

### Withdrawal Model (Updated)
```python
class Withdrawal:
    id: int
    user_id: int
    agent_id: int | None
    affiliate_id: int | None
    amount: float
    status: str  # PENDING, APPROVED, REJECTED
    payment_method: str
    payment_details: str

    # New admin approval fields
    approved_by: int | None  # User ID of admin
    approved_at: datetime | None
    rejection_reason: str | None
    admin_notes: str | None

    requested_at: datetime
    processed_at: datetime | None
```

## Next Steps

After setting up the admin system:

1. ✅ Run the migration script
2. ✅ Create an admin user
3. ✅ Login to test the admin dashboard
4. ✅ Test approving a withdrawal
5. ✅ Test rejecting a withdrawal
6. 🔐 Change default admin password
7. 📧 Configure email notifications (optional)

## Support

For issues or questions, please contact your system administrator.
