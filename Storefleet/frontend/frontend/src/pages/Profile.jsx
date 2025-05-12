import React, { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', url: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/storefleet/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.userDetails);
          setFormData({
            name: data.userDetails.name,
            email: data.userDetails.email,
            url: data.userDetails.profileImg?.url || '',
          });
        } else {
          console.error('Failed to fetch profile:', data.message);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setUpdateMessage(null);

    try {
      const response = await fetch('http://localhost:3000/api/storefleet/user/profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          url: formData.url,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.updatedUserDetails);
        setEditMode(false);
        setUpdateMessage('Profile updated successfully!');
      } else {
        setUpdateMessage('Update failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateMessage('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setUpdateMessage(null);

    try {
      const response = await fetch('http://localhost:3000/api/storefleet/user/password/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordMode(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setUpdateMessage('Password updated successfully!');
      } else {
        setUpdateMessage('Password update failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setUpdateMessage('Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h2>User Profile</h2>
      <img
        src={formData.url || 'https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg'}
        alt="Profile"
        style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem' }}
      />

      {editMode ? (
        <>
          <div style={fieldStyle}>
            <label>Name:</label>
            <input name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>Profile Image URL:</label>
            <input name="url" value={formData.url} onChange={handleInputChange} style={inputStyle} />
          </div>
          <button onClick={handleUpdateProfile} disabled={loading} style={saveBtnStyle}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={() => setEditMode(false)} style={cancelBtnStyle}>Cancel</button>
        </>
      ) : passwordMode ? (
        <>
          <div style={fieldStyle}>
            <label>Current Password:</label>
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>New Password:</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>Confirm New Password:</label>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} style={inputStyle} />
          </div>
          <button onClick={handleChangePassword} disabled={loading} style={saveBtnStyle}>
            {loading ? 'Saving...' : 'Update Password'}
          </button>
          <button onClick={() => setPasswordMode(false)} style={cancelBtnStyle}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button onClick={() => setEditMode(true)} style={editBtnStyle}>Edit Profile</button>
          <button onClick={() => setPasswordMode(true)} style={changePassBtnStyle}>Change Password</button>
        </>
      )}

      {updateMessage && (
        <p style={{ marginTop: '1rem', color: updateMessage.includes('success') ? 'green' : 'red' }}>
          {updateMessage}
        </p>
      )}
    </div>
  );
}

const fieldStyle = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' };
const editBtnStyle = { padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '0.5rem' };
const changePassBtnStyle = { ...editBtnStyle, backgroundColor: '#6f42c1' };
const saveBtnStyle = { ...editBtnStyle, backgroundColor: '#28a745' };
const cancelBtnStyle = { ...editBtnStyle, backgroundColor: '#dc3545' };

export default Profile;
