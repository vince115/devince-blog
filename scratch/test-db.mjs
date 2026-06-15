import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
console.log('正在嘗試連線至:', dbUrl?.replace(/:([^:@]+)@/, ':****@')); // 隱藏密碼

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ 連線成功！');
    const res = await client.query('SELECT current_database(), current_schema();');
    console.log('資料庫資訊:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('❌ 連線失敗！');
    console.error('錯誤詳情:', err.message);
    process.exit(1);
  }
}

testConnection();
