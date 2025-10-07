import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Riusa la connessione esistente (importante per serverless!)
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  if (!uri) {
    throw new Error('MONGODB_URI non definita nelle variabili d\'ambiente');
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  await client.connect();
  const db = client.db('api_cache');

  cachedClient = client;
  cachedDb = db;

  console.log('✅ Connesso a MongoDB');

  return {
    client,
    db,
  };
}
