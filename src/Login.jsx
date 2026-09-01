import React, { useState } from 'react';
import { supabase } from './supabaseClient.js';

export default function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

async function handleSubmit(e) {
e.preventDefault();
setError('');
setLoading(true);
if (mode === 'signin') {
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) setError(error.message);
} else {
const { error } = await supabase.auth.signUp({ email, password });
if (error) setError(error.message);
else setError('Check your email to confirm your account, then sign in.');
}
setLoading(false);
}

return (
<div className="login-shell">
<div className="login-card">
<div className="login-brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div>
<div className="login-sub">{mode === 'signin' ? 'Sign in to your dashboard' : 'Create your studio account'}</div>
<form onSubmit={handleSubmit}>
<div className="field">
<label>Email</label>
<input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
</div>
<div className="field">
<label>Password</label>
<div style={{position:'relative'}}>
<input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{paddingRight:52}} />
<button type="button" onClick={() => setShowPassword(s => !s)}
style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'0.72rem', letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--plum)', padding:4}}>
{showPassword ? 'Hide' : 'Show'}
</button>
</div>
</div>
{error && <div className="error-msg">{error}</div>}
<button className="btn btn-solid" type="submit" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
{loading ? 'Please wait…' : (mode === 'signin' ? 'Sign in' : 'Create account')}
</button>
</form>
<div style={{textAlign:'center', marginTop:18, fontSize:'0.82rem', color:'var(--body-soft)'}}>
{mode === 'signin' ? (
<span>New studio? <a href="#" onClick={e => { e.preventDefault(); setMode('signup'); setError(''); }} style={{color:'var(--plum)', textDecoration:'underline'}}>Create an account</a></span>
) : (
<span>Already have one? <a href="#" onClick={e => { e.preventDefault(); setMode('signin'); setError(''); }} style={{color:'var(--plum)', textDecoration:'underline'}}>Sign in</a></span>
)}
</div>
</div>
</div>
);
}
