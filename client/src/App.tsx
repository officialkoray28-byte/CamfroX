import { useMemo, useState, type FormEvent } from 'react';
import './App.css';

function RegistrationScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [emailOffers, setEmailOffers] = useState(true);
  const [newsOffers, setNewsOffers] = useState(true);
  const [notice, setNotice] = useState('');

  const passwordStrength = useMemo(() => {
    if (!password) return { label: 'Çok zayıf', value: 0 };
    const value = [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    return [{ label: 'Çok zayıf', value }, { label: 'Zayıf', value }, { label: 'Orta', value }, { label: 'Güçlü', value }, { label: 'Çok güçlü', value }][value] ?? { label: 'Çok zayıf', value: 0 };
  }, [password]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || password.length < 6 || !gender || !day || !month || !year || !email.trim() || !location.trim()) {
      setNotice('Lütfen zorunlu alanları eksiksiz doldurun. Şifre en az 6 karakter olmalıdır.');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: username,
          password,
          gender,
          birthDate: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
          email,
          location,
          emailOffers,
          newsOffers,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; token?: string };
      if (!response.ok || !data.token) throw new Error(data.message ?? 'Kayıt tamamlanamadı.');
      localStorage.setItem('camfrog.token', data.token);
      setPassword('');
      setNotice('Kayıt başarıyla tamamlandı. Profiliniz oluşturuldu.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Sunucuya bağlanılamadı.');
    }
  };

  return (
    <main className="registration-window" aria-label="Yeni Profil Oluştur">
      <header className="registration-titlebar"><span className="title-check">✓</span> Yeni Profil Oluştur <div className="reg-window-controls"><button type="button">−</button><button type="button">□</button><button type="button">×</button></div></header>
      <div className="registration-frame">
        <section className="welcome-column">
          <div className="mascot" aria-hidden="true"><div className="mascot-head"><i className="mascot-eye left" /><i className="mascot-eye right" /></div><div className="mascot-body" /></div>
          <h1>Camfrog'a hoşgeldiniz!</h1>
          <p>Yeni kullanıcı adı oluştur.</p>
          <button className="facebook-button" type="button" onClick={() => setNotice('Facebook bağlantısı henüz yapılandırılmadı.')}><b>f</b> Facebook ile Bağlan</button>
          <small>Sizin onayınız olmadan herhangi bir şey<br />göndermeyeceğiz.</small>
        </section>
        <section className="registration-form-column">
          <form onSubmit={submit}>
            <label>Kullanıcı:<input value={username} onChange={(event) => setUsername(event.target.value)} autoFocus /></label>
            <label>Şifre:<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <div className="strength">Şifre gücü: <span>{passwordStrength.label}</span><i className={`strength-meter level-${passwordStrength.value}`}><b /><b /><b /><b /><b /></i></div>
            <label>Cinsiyet:<select value={gender} onChange={(event) => setGender(event.target.value)}><option value="" /><option>Kadın</option><option>Erkek</option><option>Belirtmek istemiyorum</option></select></label>
            <fieldset><legend>Doğum günü:</legend><select value={day} onChange={(event) => setDay(event.target.value)}><option value="" />{Array.from({ length: 31 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select><select value={month} onChange={(event) => setMonth(event.target.value)}><option value="" />{['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((item, index) => <option key={item} value={index + 1}>{item}</option>)}</select><select value={year} onChange={(event) => setYear(event.target.value)}><option value="" />{Array.from({ length: 90 }, (_, index) => <option key={2026 - index}>{2026 - index}</option>)}</select></fieldset>
            <label>E-posta<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Yer:<input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
            <label className="check-row"><input type="checkbox" checked={emailOffers} onChange={(event) => setEmailOffers(event.target.checked)} /><span>E-posta adresinizi doğrulayın ve Camfrog'tan<br />özel avantajlar kazanın.</span></label>
            <label className="check-row"><input type="checkbox" checked={newsOffers} onChange={(event) => setNewsOffers(event.target.checked)} /><span>Yeni özellikler, avantajlar ve paketleri<br /><u>e-posta</u> ile bana bildir. Yenilikler sadece<br />doğrulanmış e-posta adresine gönderilecek.</span></label>
            {notice && <p className="registration-notice" role="status">{notice}</p>}
            <button className="register-button" type="submit">Kayıt ol</button>
          </form>
        </section>
      </div>
      <footer className="signin-footer"><button type="button" onClick={() => setNotice('Giriş ekranı yakında eklenecek.')}>Zaten bir hesabınız mı var? Giriş yapın.</button></footer>
    </main>
  );
}

export default RegistrationScreen;
