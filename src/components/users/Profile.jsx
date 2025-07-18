import { useAuth } from '../../contexts/auth.context';

export const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        {user.profile_picture ? (
          <img 
            src={`http://localhost:5000/${user.profile_picture}`} 
            alt="Profile" 
            className="h-32 w-32 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
      
      <button
        onClick={logout}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};