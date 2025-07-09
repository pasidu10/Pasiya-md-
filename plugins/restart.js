const config = require('../config');
const { cmd } = require('../command');
const { exec } = require('child_process');

cmd({
    pattern: "restart",
    react: "⚡",
    alias: ["reboot"],
    desc: "Quick restart bot (Owner/Sudo only)",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, isOwner, isSudo }) => {
    try {
        // Authorization check
        if (!isOwner && !config.SUDO?.includes(sender.split('@')[0])) {
            return reply("❌ *Access Denied!* Owner/SUDO only");
        }

        // Newsletter context
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
        newsletterJid: '120363402825685029@newsletter',
        newsletterName: "𝗣𝗔𝗦𝗜𝗬𝗔 𝗠𝗗 🔔",
        serverMessageId: 143,
            }
        };

        // Fast restart notification
        await conn.sendMessage(
            from,
            {
                text: "⚡ *Quick Restart Initiated*\n_Bot will reboot in 3 seconds..._\n\n• PASIYA MD •",
                contextInfo: newsletterContext
            },
            { quoted: mek }
        );

        // Immediate restart process (no unnecessary delays)
        setTimeout(() => {
            exec('pm2 restart all &', (error) => { // Run in background
                if (error) {
                    exec('node . &'); // Fallback
                }
            });
        }, 1500); // Just enough time to send confirmation

    } catch (e) {
        console.error('Fast restart error:', e);
        // No reply here since bot may be restarting
    }
});