import { useState } from 'react';
import type { FormEvent } from 'react';

const API_URL = 'https://inai-col1.fishrungames.com';

interface Props {
  onCreated: () => void;
}

export default function AdForm({ onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError(null);
    setSending(true);
    try {
      const data = new FormData();
      data.append('title', title.trim());
      data.append('description', description.trim());
      data.append('price', price);
      if (image) data.append('image', image);

      const res = await fetch(`${API_URL}/ads`, { method: 'POST', body: data });
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      }

      formEl.reset();
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Новое объявление</h2>
      <input
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Описание"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        min="0"
        step="any"
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={sending}>
        {sending ? 'Отправка…' : 'Опубликовать'}
      </button>
    </form>
  );
}