// Add this at the top of your existing app.js file, after the imports
import { useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';

// This component will handle redirection based on user type
function UserTypeRedirect() {
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { 
          Router.push('/login'); 
          return; 
        }

        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        const user = userRes.data;
        
        // Redirect partners to partner dashboard
        if (user.user_type === 'PARTNER') {
          Router.push('/partner');
          return;
        }
        
        // Team admins and members would go to their respective portals
        if (user.user_type === 'TEAM_ADMIN' || user.user_type === 'TEAM_MEMBER') {
          // For now, redirect to subscriber app
          // We'll build team portals later
          Router.push('/app');
          return;
        }
        
        // Subscribers stay on the subscriber app
        // No redirect needed
        
      } catch (err) {
        console.error('Error checking user type:', err);
        // If there's an error, stay on current page
      }
    };
    
    checkUserType();
  }, []);

  return null;
}

// Then in your main AppHome component, include the redirect component:
export default function AppHome() {
  return (
    <>
      <UserTypeRedirect />
      {/* Rest of your existing AppHome component */}
    </>
  );
}
