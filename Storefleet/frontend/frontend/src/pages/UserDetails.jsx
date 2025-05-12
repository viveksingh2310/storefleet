import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/storefleet/user/admin/details/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.userDetails);
          setEditedUser({
            name: data.userDetails.name || '',
            email: data.userDetails.email || '',
            role: data.userDetails.role || 'user',
          });
        } else {
          throw new Error(data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRole = () => {
    setEditedUser((prev) => ({
      ...prev,
      role: prev.role === 'admin' ? 'user' : 'admin',
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`http://localhost:3000/api/storefleet/user/admin/update/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setSuccessMessage('User profile updated successfully.');
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>User Details</h2>

      <img
        src={user.profileImg?.url || 'https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg'}
        alt="User Profile"
        style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '1rem' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Name:</strong>
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            style={{ marginLeft: '10px', padding: '5px', width: '80%' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Email:</strong>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            style={{ marginLeft: '10px', padding: '5px', width: '80%' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Current Role:</strong> {user.role}
      </div>

      <button onClick={toggleRole} style={{ marginBottom: '1rem', padding: '8px 12px' }}>
        {editedUser.role === 'admin' ? 'Make User' : 'Make Admin'}
      </button>

      <div>
        <button
          onClick={handleUpdate}
          disabled={updating}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
      </div>

      {successMessage && <p style={{ color: 'green', marginTop: '1rem' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default UserDetails;
