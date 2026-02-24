import { createContext } from 'react';

const ProfileContext = createContext({ 
  profile: null, 
  getProfileByRegistrationNo: async () => null,
  setProfile: () => {}
});

export default ProfileContext;