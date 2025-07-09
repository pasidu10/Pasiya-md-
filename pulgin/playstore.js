const { cmd } = require("../command");
const axios = require("axios");
const config = require("../config");
const path = require("path");

cmd({
    pattern: "playstore",
    react: '📲',
    alias: ["ps", "app"],
    desc: "Search for an app on the Play Store",
    category: "search",
    filename: __filename
},
async(robin, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("Please provide an app name to search.");
        
        await reply("🔍 Searching Play Store...");
        
        const apiUrl = `https://apis.davidcyriltech.my.id/search/playstore?q=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data.success || !response.data.result) {
            return reply("❌ No results found for the given app name.");
        }
        
        const app = response.data.result;
        
        const infoMessage = `
╔══✦❘༻ *HANS BYTE* ༺❘✦══╗
┇  📲 *PLAY STORE SEARCH* 📲
┇╭───────────────────
┇│•📌 Name: ${app.title}
┇│•📖 Summary: ${app.summary}
┇│•📥 Installs: ${app.installs}
┇│•⭐ Rating: ${app.score}
┇│•💲 Price: ${app.price}
┇│•📦 Size: ${app.size || 'Not available'}
┇│•📱 Android Version: ${app.androidVersion}
┇│•👨‍💻 Developer: ${app.developer}
┇│•📅 Released: ${app.released}
┇│•🔄 Updated: ${app.updated}
┇│•🔗 Link: ${app.url}
╰─・─・─・─・─・─・─・─╯
> POWERED BY HANS BYTE MD`.trim();
        
        // Newsletter context info
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363292876277898@newsletter',
                newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                serverMessageId: 143,
            },
        };
        
        // Send app icon with info
        if (app.icon) {
            await robin.sendMessage(
                from,
                {
                    image: { url: app.icon },
                    caption: infoMessage,
                    contextInfo: newsletterContext
                },
                { quoted: mek }
            );
        } else {
            await reply(infoMessage);
        }
    
    } catch (error) {
        console.error("Play Store Error:", error);
        reply("❌ Error searching for the app. Please try again.");
    }
});
