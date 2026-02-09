# my-saviour
my-saviour
Backend commands -

npm init -y
npm install express pg cors dotenv
npm install -D typescript ts-node-dev @types/node @types/express @types/cors
npx tsc --init
npx ts-node src/utils/createAdmin.ts 



Query-

ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_donated_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_last_donated_at
ON users(last_donated_at);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS eligibility_notified BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_users_notification
ON users(last_donated_at, eligibility_notified);

ALTER TABLE users
ADD COLUMN role VARCHAR(20) DEFAULT 'user';

ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_cta_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_last_cta_at
ON users(last_cta_at);




