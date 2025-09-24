import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Globe, Building, MapPin, User as UserIcon } from 'lucide-react';
import { useUser } from '../hooks/useUsers';
import { useAppSelector } from '../store/hooks';
import LoadingSpinner from './LoadingSpinner';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  // console.log(userId,"userid")

  const { data: apiUser, isLoading, error } = useUser(userId);
  const newUsers = useAppSelector((state) => state.users.newUsers);
  // console.log(newUsers, "newuser")

  // Check if this is a new user from Redux
  const newUser = newUsers.find(user => user.id === userId);
  // console.log(newUser, "newuser")
  const user = apiUser || newUser;
  // console.log(user, "user");
  

  if (isLoading) return <LoadingSpinner />;
 if ((error && !newUser) || (!apiUser && !newUser)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-500">
          User not found or error loading user details
        </div>
      </div>
    );
  }

  const isNewUser = !!newUser;
  console.log(isNewUser, "isnewuser")

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Users
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserIcon size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            {!isNewUser && 'username' in user && (
              <p className="text-gray-600">@{user.username}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>

            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>

            {!isNewUser && 'phone' in user && user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{user.phone}</p>
                </div>
              </div>
            )}

            {!isNewUser && 'website' in user && user.website && (
              <div className="flex items-center gap-3">
                <Globe className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={`http://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Company & Address */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Company & Location</h2>

            <div className="flex items-center gap-3">
              <Building className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-gray-800">
                  {typeof user.company === 'string' ? user.company : user.company.name}
                </p>
                {!isNewUser && typeof user.company === 'object' && user.company.catchPhrase && (
                  <p className="text-sm text-gray-600 italic">"{user.company.catchPhrase}"</p>
                )}
              </div>
            </div>

            {!isNewUser && 'address' in user && user.address && user.address.city && (
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-500 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <div className="text-gray-800">
                    <p>{user.address.street} {user.address.suite}</p>
                    <p>{user.address.city}, {user.address.zipcode}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default UserDetail;