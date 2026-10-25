import { useEffect, useState } from 'react';
import type { Ad, AdsResponse } from './types';
import AdForm from './AdForm';

const API_URL = 'https://inai-col1.fishrungames.com';

export default function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetch(`${API_URL}/ads`)
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json() as Promise<AdsResponse>;
      })
      .then((data) => {
        if (ignore) return;
        setAds(data.items);
        setError(null);
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  return (
    <div className="container">
      <h1>Доска объявлений</h1>

      <AdForm onCreated={() => setReloadKey((k) => k + 1)} />

      {loading && <p className="status">Загрузка…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && ads.length === 0 && (
        <p className="status">Пока нет объявлений</p>
      )}

      <section className="grid">
        {ads.map((ad) => (
          <article className="card" key={ad.id}>
            {ad.image_url ? (
              <img src={`${API_URL}${ad.image_url}`} alt={ad.title} />
            ) : (
              <div className="no-image">Нет фото</div>
            )}
            <div className="card-body">
              <h2>{ad.title}</h2>
              <p className="price">
                {ad.price === 0 ? 'Бесплатно' : ad.price.toLocaleString('ru-RU')}
              </p>
              <p className="description">{ad.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}