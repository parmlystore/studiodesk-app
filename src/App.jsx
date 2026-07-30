import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
import Booking from './Booking.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import Demo from './Demo.jsx';

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = logged out
  const params = new URLSearchParams(window.location.search);
  const bookingSlug = params.get('book');
  const path = window.location.pathname;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Public booking page: /?book=willow-vine OR /book/willow-vine (real, Supabase-backed)
  if (bookingSlug) {
    return <Booking slug={bookingSlug} />;
  }
  const pathMatch = path.match(/^\/book\/([a-zA-Z0-9-]+)/);
  if (pathMatch) {
    return <Booking slug={pathMatch[1]} />;
  }

  // Real login/dashboard only at /login — not linked from the public demo
  if (path === '/login') {
    if (session === undefined) {
      return <div className="login-shell"><div className="login-brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div></div>;
    }
    if (!session) {
      return <Login />;
    }
    return <Dashboard session={session} />;
  }

  // Public interactive demos with fake data, no login wall.
  // /demo/basic -> Basic plan demo, /demo/pro (or default '/') -> Pro plan demo
  if (path === '/demo/basic') {
    return <Demo plan="basic" />;
  }
  return <Demo plan="pro" />;
}
