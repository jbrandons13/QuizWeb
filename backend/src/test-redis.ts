import { Redis } from "ioredis";

const redis = new Redis ({
    host:'localhost',
    port: 6379,
});

async function testRedis() {
  try {
    await redis.set('test', 'success');
    const val = await redis.get('test');
    console.log('Redis Connected Successfully, test val:', val);
    redis.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Redis Connection Error:', err);
    process.exit(1);
  }
}

testRedis();
