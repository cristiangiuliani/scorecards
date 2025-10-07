import { connectToDatabase } from './mongodb';

interface CacheDocument {
  key: string;
  data: any;
  expiresAt: Date;
  createdAt: Date;
}

export class CacheService {
  /**
   * Recupera dati dalla cache
   * @param key - Chiave univoca per i dati
   * @returns Dati se trovati e non scaduti, altrimenti null
   */
  static async get<T = any>(key: string): Promise<T | null> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<CacheDocument>('cache');

      const cached = await collection.findOne({
        key,
        expiresAt: { $gt: new Date() },
      });

      if (cached) {
        console.log(`✅ Cache HIT: ${key}`);
        return cached.data as T;
      }

      console.log(`❌ Cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('Errore cache get:', error);
      return null;
    }
  }

  /**
   * Salva dati nella cache
   * @param key - Chiave univoca
   * @param data - Dati da salvare
   * @param ttlSeconds - Time to live in secondi (default: 1 ora)
   */
  static async set(key: string, data: any, ttlSeconds = 3600): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<CacheDocument>('cache');

      const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

      await collection.updateOne(
        { key },
        {
          $set: {
            key,
            data,
            expiresAt,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      // Crea indice TTL (MongoDB eliminerà automaticamente i documenti scaduti)
      await collection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      ).catch(() => {}); // Ignora se già esistente

      console.log(`💾 Cache SET: ${key} (TTL: ${ttlSeconds}s, scade: ${expiresAt.toISOString()})`);
      return true;
    } catch (error) {
      console.error('Errore cache set:', error);
      return false;
    }
  }

  /**
   * Elimina una voce dalla cache
   */
  static async delete(key: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<CacheDocument>('cache');
      await collection.deleteOne({ key });
      console.log(`🗑️ Cache DELETE: ${key}`);
      return true;
    } catch (error) {
      console.error('Errore cache delete:', error);
      return false;
    }
  }

  /**
   * Pulisce tutta la cache
   */
  static async clear(): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<CacheDocument>('cache');
      await collection.deleteMany({});
      console.log('🧹 Cache completamente pulita');
      return true;
    } catch (error) {
      console.error('Errore cache clear:', error);
      return false;
    }
  }

  /**
   * Conta documenti in cache (non scaduti)
   */
  static async count(): Promise<number> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<CacheDocument>('cache');
      return await collection.countDocuments({
        expiresAt: { $gt: new Date() },
      });
    } catch (error) {
      console.error('Errore cache count:', error);
      return 0;
    }
  }
}
