import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';

function nextDays(n) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}
function fmtDate(d) { return d.toISOString().slice(0, 10); }
function dayLabel(d) { return d.toLocaleDateString('en-AU', { weekday: 'short' }).toUpperCase(); }
function dayNum(d) { return d.getDate(); }

export default function Booking({ slug }) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [studio, setStudio] = useState(null);
  const [services, setServices] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [settings, setSettings] = useState(null);

  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const dates = nextDays(6);
  const [dateIdx, setDateIdx] = useState(0);
  const [takenSlots, setTakenSlots] = useState([]);
  const [slot, setSlot] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const DAILY_SLOTS = ['07:00', '08:15', '12:00', '17:30', '18:45'];

  useEffect(() => {
    (async () => {
      const { data: studioRow } = await supabase.from('studios').select('*').eq('booking_slug', slug).maybeSingle();
      if (!studioRow) { setNotFound(true); setLoading(false); return; }
      setStudio(studioRow);
      const [{ data: svc }, { data: instr }, { data: bs }] = await Promise.all([
        supabase.from('services').select('*').eq('studio_id', studioRow.id).eq('active', true).order('sort_order'),
        supabase.from('instructors').select('*').eq('studio_id', studioRow.id).eq('active', true).limit(1),
        supabase.from('booking_settings').select('*').eq('studio_id', studioRow.id).maybeSingle(),
      ]);
      setServices(svc || []);
      setInstructor((instr && instr[0]) || null);
      setSettings(bs || null);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!studio || !instructor) return;
    (async () => {
      const dateStr = fmtDate(dates[dateIdx]);
      const { data } = await supabase.from('appointments')
        .select('appointment_time')
        .eq('studio_id', studio.id)
        .eq('instructor_id', instructor.id)
        .eq('appointment_date', dateStr)
        .neq('status', 'cancelled');
      setTakenSlots((data || []).map(r => r.appointment_time.slice(0, 5)));
      setSlot(null);
    })();
  }, [studio, instructor, dateIdx]);

  async function confirmBooking() {
    setSubmitting(true);
    setSubmitError('');
    const { data: client, error: clientErr } = await supabase.from('clients')
      .insert({ studio_id: studio.id, name, phone, email })
      .select().single();
    if (clientErr) { setSubmitError('Something went wrong — please try again.'); setSubmitting(false); return; }

    const reference = 'SD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const { error: apptErr } = await supabase.from('appointments').insert({
      studio_id: studio.id,
      client_id: client.id,
      service_id: service.id,
      instructor_id: instructor.id,
      reference,
      appointment_date: fmtDate(dates[dateIdx]),
      appointment_time: slot,
      duration_mins: service.duration_mins || 60,
      price: service.price,
      service_name: service.name,
    });
    if (apptErr) {
      if (apptErr.code === '23505') {
        setSubmitError('Sorry — that time was just booked by someone else. Please pick another slot.');
        setSlot(null);
        setStep(2);
      } else {
        setSubmitError('Something went wrong — please try again.');
      }
      setSubmitting(false);
      return;
    }
    setConfirmed({ reference });
    setSubmitting(false);
    setStep(4);
  }

  if (loading) return <div className="bk-shell center">Loading…</div>;
  if (notFound) return <div className="bk-shell center"><h1>Studio not found</h1><p className="sub">This booking link doesn't match any studio.</p></div>;

  return (
    <div>
      <div className="bk-topbar">
        <div className="bk-brand">{studio.name}</div>
        <div className="bk-steps">
          {['Class', 'Time', 'Details', 'Confirmed'].map((label, i) => {
            const n = i + 1;
            return (
              <div key={label} className={'bk-step-pill' + (n === step ? ' active' : '') + (n < step ? ' done' : '')}>
                <span className="n">{n < step ? '✓' : n}</span>{label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bk-shell">
        {step === 1 && (
          <section>
            <span className="eyebrow">Step 1 of 4</span>
            <h1 className="bk-h1">Pick a class</h1>
            <div className="bk-services">
              {services.map(s => (
                <div key={s.id} className={'bk-svc' + (service?.id === s.id ? ' selected' : '')} onClick={() => setService(s)}>
                  <div>
                    <div className="bk-svc-name">{s.name}</div>
                    <div className="bk-svc-meta">{s.duration_mins ? s.duration_mins + ' min' : s.category}</div>
                  </div>
                  <div className="bk-svc-price">${Number(s.price).toFixed(0)}</div>
                </div>
              ))}
              {services.length === 0 && <p className="sub">No classes are set up yet — check back soon.</p>}
            </div>
            <div className="bk-row">
              <span></span>
              <button className="btn btn-solid" disabled={!service} onClick={() => setStep(2)}>Continue</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <span className="eyebrow">Step 2 of 4</span>
            <h1 className="bk-h1">Pick a time</h1>
            <div className="bk-date-strip">
              {dates.map((d, i) => (
                <div key={i} className={'bk-date-chip' + (dateIdx === i ? ' selected' : '')} onClick={() => setDateIdx(i)}>
                  <div className="d">{dayLabel(d)}</div>
                  <div className="n">{dayNum(d)}</div>
                </div>
              ))}
            </div>
            <div className="bk-slot-grid">
              {DAILY_SLOTS.map(t => {
                const isFull = takenSlots.includes(t);
                return (
                  <div key={t} className={'bk-slot' + (isFull ? ' full' : '') + (slot === t ? ' selected' : '')}
                    onClick={() => !isFull && setSlot(t)}>
                    {t}{isFull ? ' · Full' : ''}
                  </div>
                );
              })}
            </div>
            <div className="bk-row">
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-solid" disabled={!slot} onClick={() => setStep(3)}>Continue</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <span className="eyebrow">Step 3 of 4</span>
            <h1 className="bk-h1">Confirm your details</h1>
            <div className="field"><label>Full name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Mobile</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            {settings?.deposit_amount > 0 && (
              <div className="bk-deposit">
                <strong>Deposit — ${Number(settings.deposit_amount).toFixed(0)}</strong>
                Transfer to {settings.bank_name} · BSB {settings.bank_bsb} · Acc {settings.bank_account} · Reference: your name.
              </div>
            )}
            {submitError && <div className="error-msg">{submitError}</div>}
            <div className="bk-row">
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-solid" disabled={!name || !phone || !email || submitting} onClick={confirmBooking}>
                {submitting ? 'Confirming…' : 'Confirm booking'}
              </button>
            </div>
          </section>
        )}

        {step === 4 && confirmed && (
          <section className="center">
            <div className="bk-check">✓</div>
            <span className="eyebrow">Step 4 of 4</span>
            <h1 className="bk-h1">Booking confirmed</h1>
            <div className="bk-confirm-card">
              <div className="cline"><span>Reference</span><span>{confirmed.reference}</span></div>
              <div className="cline"><span>Class</span><span>{service.name}</span></div>
              <div className="cline"><span>When</span><span>{dates[dateIdx].toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}, {slot}</span></div>
              <div className="cline"><span>Price</span><span>${Number(service.price).toFixed(0)}</span></div>
            </div>
            <p className="sub" style={{margin:'0 auto'}}>A confirmation has been recorded — the studio has been notified instantly.</p>
          </section>
        )}
      </div>
    </div>
  );
}
