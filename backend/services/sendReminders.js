// scripts/sendReminders.js
const supabase = require('../config/supabaseClient');
const fetch = require('node-fetch'); // dacă folosești nodemailer/altceva, adaptează

const EMAIL_API_KEY = process.env.RESEND_API_KEY; // sau SendGrid, Mailgun etc.

async function sendReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.toISOString().split('T')[0];

    const { data: users, error: userError } = await supabase.from('users').select('id, email');
    if (userError) throw new Error(userError.message);

    for (const user of users) {
        const { data: plans, error: plansError } = await supabase
            .from('DailyPlans')
            .select('id')
            .eq('user_id', user.id)
            .gte('date', yyyy)
            .lt('date', `${yyyy}T23:59:59`);

        if (plansError) continue;
        const planIds = plans.map(p => p.id);
        if (!planIds.length) continue;

        const { data: events, error: eventsError } = await supabase
            .from('ScheduleItems')
            .select('title, hour')
            .in('daily_plan_id', planIds)
            .eq('is_important', true);

        if (eventsError || !events.length) continue;

        const body = events.map(e => `• ${e.title} la ora ${e.hour}`).join('\n');

        // Trimitere email cu RESEND
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${EMAIL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'PlaniFi ',
                to: user.email,
                subject: `🔔 Reminder for ${yyyy}`,
                text: `Hey!\n\nThis are your important events for tommorow:\n\n${body}\n\nGood look!\n— PlaniFi`,
            }),
        });
    }

    console.log('Reminders sent with success!');
}

sendReminders().catch(console.error);
