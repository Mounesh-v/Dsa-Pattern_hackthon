import { useEffect, useState } from 'react';
import AppNav from '../components/AppNav';
import Icon from '../components/Icon';
import { userService } from '../services/userService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await userService.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAchievementIcon = (type) => {
    const icons = {
      first_solve: 'target',
      streak_5: 'flame',
      streak_10: 'flame',
      streak_20: 'lightning',
      perfect_score: 'star',
      speed_demon: 'trendingUp',
      pattern_master: 'trophy',
    };
    return icons[type] || 'star';
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-2xl text-text-primary">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                <Icon name="edit" size={16} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                  message.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <Icon
                  name={message.includes('success') ? 'check' : 'warning'}
                  size={20}
                  className={message.includes('success') ? 'text-green-600' : 'text-red-600'}
                />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-text-secondary text-sm">Name</div>
                  <div className="text-lg text-text-primary">{profile.name}</div>
                </div>
                <div>
                  <div className="text-text-secondary text-sm">Email</div>
                  <div className="text-lg text-text-primary">{profile.email}</div>
                </div>
                <div>
                  <div className="text-text-secondary text-sm">Role</div>
                  <div className="text-lg text-text-primary capitalize">{profile.role}</div>
                </div>
                <div>
                  <div className="text-text-secondary text-sm">Member Since</div>
                  <div className="text-lg text-text-primary">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="card p-6 mb-6 animate-slide-up stagger-1">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-text-secondary text-sm">Total Attempts</div>
                <div className="text-2xl font-display font-bold text-primary">
                  {profile.speedRecords?.totalAttempts || 0}
                </div>
              </div>
              <div>
                <div className="text-text-secondary text-sm">Average Accuracy</div>
                <div className="text-2xl font-display font-bold text-primary">
                  {profile.speedRecords?.avgAccuracy?.toFixed(1) || 0}%
                </div>
              </div>
              <div>
                <div className="text-text-secondary text-sm">Best Streak</div>
                <div className="text-2xl font-display font-bold text-primary">
                  {profile.speedRecords?.bestStreak || 0}
                </div>
              </div>
              <div>
                <div className="text-text-secondary text-sm">Achievements</div>
                <div className="text-2xl font-display font-bold text-primary">
                  {profile.achievements?.length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="card p-6 animate-slide-up stagger-2">
              <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-lightBlue p-4 rounded-lg text-center"
                  >
                    <div className="text-3xl mb-2 text-primary">
                      <Icon name={getAchievementIcon(achievement.type)} size={32} />
                    </div>
                    <div className="text-sm text-text-primary capitalize">
                      {achievement.type.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default Profile;