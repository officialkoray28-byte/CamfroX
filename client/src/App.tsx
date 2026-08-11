import { useMemo, useState, type FormEvent } from 'react';
import './App.css';

function CamfrogHome({ nickname, onLogout }: { nickname: string; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const actions = [
    ['camera', 'Join Main Camfrog Room'],
    ['house', 'Video Chat Rooms'],
    ['people', 'Search for Camfrog Users'],
    ['lock', 'Parental Controls'],
    ['facebook', <>Chat with friends on<br />Facebook</>],
  ] as const;
  return (
    <main className="home-window" aria-label="Camfrog ana ekranı">
      <header className="home-titlebar"><button type="button" onClick={() => setMenuOpen((isOpen) => !isOpen)} aria-expanded={menuOpen}>Camfrog <i>▼</i></button><span className="title-dots"><i /><i /><i /></span><span className="window-actions">− ×</span></header>
      {menuOpen && <nav className="camfrog-menu" aria-label="Camfrog menüsü">
        <button type="button">Facebook ile Bağlan</button><button type="button">Camfrog ile Bağlan</button><button type="button"><i className="green-check">✓</i>Yeni Profil Oluştur</button>
        <hr /><button type="button" disabled>Camfrog Pro'yu Etkinleştir</button><button type="button"><i>♟</i>Camfrog Pro Satın Al</button>
        <hr /><button type="button" disabled><i>♟</i>Kişi Ekle...</button><button type="button" disabled><i>◈</i>Video Sohbet Odasına Bağlan... <kbd>Ctrl+R</kbd></button><button type="button" disabled><i>⌂</i>Kullanıcının Konumunu Belirle...</button><button type="button" disabled><i>♙</i>Sanık Gönder...</button>
        <hr /><button type="button" disabled><i>⊙</i>Minik Oda Yarat</button><button type="button" disabled><i>⇩</i>Dosya transferi...</button><button type="button" disabled><i>◉</i>Geçmiş Penceresi... <kbd>Ctrl+H</kbd></button>
        <hr /><button type="button"><i>⚙</i>Ayarlar... <kbd>Ctrl+S</kbd></button><button type="button"><i>◉</i>Görüntü</button><button type="button"><i>🔤</i>Lisan Değiştir <b>›</b></button><button type="button" disabled><i>⚿</i>Şifre Değiştir...</button><button type="button" disabled><i>@</i>E-Posta Değiştir...</button><button type="button">Tema <b>›</b></button>
        <hr /><button type="button"><i>▣</i>Ebeveyn Denetimleri</button><button type="button" disabled><i>◌</i>IM YAKALAYICI KAPALI</button>
        <hr /><button type="button">Yardım <b>›</b></button><hr /><button type="button" onClick={onLogout}><i>◉</i>Çıkış <kbd>Alt+X</kbd></button>
      </nav>}
      <section className="home-profile"><div><i className="home-avatar" /><b>{nickname} (Online)</b> <small>▼</small><button type="button" onClick={onLogout}>Çıkış</button></div><button className="status-prompt" type="button">What's hopping? <small>▼</small></button></section>
      <nav className="home-tabs"><button className="selected" type="button"><i className="contacts-mark" />Contacts</button><button type="button"><i className="rooms-mark" />Rooms</button></nav>
      <section className="home-content">
        <div className="home-logo"><span className="home-orbs"><i /><i /><i /></span><b>camfro</b><em>g</em></div>
        <div className="home-links">{actions.map(([icon, label]) => <button key={icon} type="button"><i className={`action-icon ${icon}`} /><span>{label}</span></button>)}</div>
      </section>
      <footer className="home-toolbar"><i className="tool-bubbles"><b /><b /><b /></i><i className="tool-home" /><i className="tool-users" /><i className="tool-chat" /><i className="tool-add">+</i></footer>
      <div className="home-upgrade"><button type="button">Get Camfrog Pro</button> for more features.</div>
    </main>
  );
}

function LoginScreen({ onSuccess, onBack }: { onSuccess: (nickname: string, token: string) => void; onBack: () => void }) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('');
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, password }) });
      const data = (await response.json().catch(() => ({}))) as { message?: string; token?: string; user?: { nickname: string } };
      if (!response.ok || !data.token || !data.user) throw new Error(data.message ?? 'Giriş yapılamadı.');
      onSuccess(data.user.nickname, data.token);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Sunucuya bağlanılamadı.');
    } finally { setLoading(false); }
  };

  return <main className="login-window"><header className="registration-titlebar"><span className="title-check">✓</span> Camfrog'a Giriş Yap</header><section className="login-card"><div className="login-mascot"><i /><i /></div><h1>Tekrar hoş geldiniz!</h1><p>Camfrog hesabınızla giriş yapın.</p><form onSubmit={submit}><label>Kullanıcı adı<input value={nickname} onChange={(event) => setNickname(event.target.value)} autoFocus autoComplete="username" /></label><label>Şifre<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{notice && <p className="login-notice" role="status">{notice}</p>}<button disabled={loading} type="submit">{loading ? 'Giriş yapılıyor…' : 'Giriş yap'}</button></form><button className="back-to-register" type="button" onClick={onBack}>← Yeni profil oluştur</button></section></main>;
}

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
  const [loggedInUser, setLoggedInUser] = useState(() => localStorage.getItem('camfrog.nickname'));
  const [loginMode, setLoginMode] = useState(false);

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
      const data = (await response.json().catch(() => ({}))) as { message?: string; token?: string; user?: { nickname: string } };
      if (!response.ok || !data.token || !data.user) throw new Error(data.message ?? 'Kayıt tamamlanamadı.');
      localStorage.setItem('camfrog.token', data.token);
      localStorage.setItem('camfrog.nickname', data.user.nickname);
      setPassword('');
      setLoggedInUser(data.user.nickname);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Sunucuya bağlanılamadı.');
    }
  };

  if (loggedInUser) {
    return <CamfrogHome nickname={loggedInUser} onLogout={() => { localStorage.removeItem('camfrog.token'); localStorage.removeItem('camfrog.nickname'); setLoggedInUser(null); }} />;
  }

  if (loginMode) {
    return <LoginScreen onBack={() => setLoginMode(false)} onSuccess={(nickname, token) => { localStorage.setItem('camfrog.token', token); localStorage.setItem('camfrog.nickname', nickname); setLoggedInUser(nickname); }} />;
  }

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
      <footer className="signin-footer"><button type="button" onClick={() => setLoginMode(true)}>Zaten bir hesabınız mı var? Giriş yapın.</button></footer>
    </main>
  );
}

export default RegistrationScreen;
