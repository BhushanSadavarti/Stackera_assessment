import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Mail, Building, MapPin } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useAppSelector } from '../store/hooks';
import type { User, NewUser } from '../types/user';
import type { RootState } from '../store/store';
import LoadingSpinner from './LoadingSpinner';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: apiUsers = [], isLoading, error } = useUsers();
  const newUsers = useAppSelector((state: RootState) => state.users.newUsers);

  // Merge API users with Redux users
  const allUsers = useMemo(() => {
    const mergedUsers: (User | NewUser)[] = [...apiUsers];
    
    // Add new users from Redux
    newUsers.forEach((newUser) => {
      mergedUsers.push({
        ...newUser,
        username: newUser.name.toLowerCase().replace(/\s+/g, ''),
        phone: '',
        website: '',
        address: {
          street: '',
          suite: '',
          city: '',
          zipcode: '',
          geo: { lat: '', lng: '' }
        },
        company: {
          name: newUser.company,
          catchPhrase: '',
          bs: ''
        }
      } as User);
    });
    
    return mergedUsers;
  }, [apiUsers, newUsers]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">Error loading users</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <Link
          to="/add-user"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add User
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Link
            key={user.id}
            to={`/user/${user.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Building size={16} />
                <span className="text-sm">
                  {typeof user.company === 'string' ? user.company : user.company.name}
                </span>
              </div>
              
              {'address' in user && user.address.city && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{user.address.city}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No users found matching your search.
        </div>
      )}
    </div>
  );
};

export default UserList;