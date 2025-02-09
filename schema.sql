-- SQLite
DROP TABLE IF EXISTS URLS;
CREATE TABLE IF NOT EXISTS URLS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_url TEXT UNIQUE NOT NULL,
    original_url TEXT UNIQUE NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO URLS (short_url, original_url) VALUES
('roldyoran', 'https://github.com/roldyoran'),
('google',    'https://www.google.com'),
('wikipedia', 'https://www.wikipedia.org'),
('github',    'https://github.com'),
('youtube',   'https://www.youtube.com'),
('twitter',   'https://twitter.com'),
('twitch',   'https://www.twitch.tv'),
('facebook', 'https://www.facebook.com'),
('linkedin', 'https://www.linkedin.com'),
('instagram', 'https://www.instagram.com'),
('tiktok', 'https://www.tiktok.com'),
('reddit', 'https://www.reddit.com'),
('pinterest', 'https://www.pinterest.com'),
('whatsapp', 'https://web.whatsapp.com'),
('telegram', 'https://web.telegram.org'),
('discord', 'https://discord.com'),
('netflix', 'https://www.netflix.com'),
('amazon', 'https://www.amazon.com'),
('spotify', 'https://open.spotify.com'),
('apple', 'https://www.apple.com'),
('samsung', 'https://www.samsung.com'),
('microsoft', 'https://www.microsoft.com');