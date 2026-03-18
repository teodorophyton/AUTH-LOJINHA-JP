import { readFileSync } from 'fs'
import { join } from 'path'

export default function HomePage({
  searchParams,
}: {
  searchParams: { user_id?: string; status?: string; error?: string; code?: string }
}) {
  const clientId = process.env.DISCORD_CLIENT_ID || ''
  const siteUrl = process.env.SITE_URL || ''

  return (
    <>
      <style>{`
        :root {
          --gold: #F5C518;
          --gold-light: #FFD84D;
          --gold-dark: #C49A00;
          --black: #0A0A0A;
          --black2: #111111;
          --black3: #1A1A1A;
          --white: #F0F0F0;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100vh; background: var(--black); color: var(--white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        #cursor { display: none; }
        #cursor-trail { position: fixed; width: 36px; height: 36px; border: 1.5px solid var(--gold); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: all 0.08s ease; opacity: 0; }
        .particle { position: absolute; width: 2px; height: 2px; background: var(--gold); border-radius: 50%; opacity: 0; animation: floatUp var(--dur) ease-in infinite; animation-delay: var(--delay); left: var(--x); }
        @keyframes floatUp { 0% { opacity: 0; transform: translateY(100vh) scale(0); } 10% { opacity: 0.6; } 90% { opacity: 0.2; } 100% { opacity: 0; transform: translateY(-20px) scale(1.5); } }
        .bg-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(245,197,24,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.03) 1px, transparent 1px); background-size: 60px 60px; z-index: 0; pointer-events: none; }
        .bg-glow { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%); pointer-events: none; z-index: 0; animation: pulse 4s ease-in-out infinite; transition: left 0.3s, top 0.3s; }
        @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; } }
        .wrapper { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
        .card { background: var(--black2); border: 1px solid rgba(245,197,24,0.15); border-radius: 24px; padding: 56px 48px; max-width: 480px; width: 100%; position: relative; overflow: hidden; animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .card::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at top, rgba(245,197,24,0.04) 0%, transparent 60%); pointer-events: none; }
        .logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 40px; }
        .logo-icon { width: 52px; height: 52px; background: var(--gold); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 30px rgba(245,197,24,0.4); animation: iconPop 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        @keyframes iconPop { from { opacity: 0; transform: scale(0.5) rotate(-10deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        .logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 3px; animation: fadeInRight 0.6s ease 0.4s both; }
        .logo-text span { color: var(--gold); }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .title { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 2px; text-align: center; margin-bottom: 12px; animation: fadeIn 0.6s ease 0.5s both; line-height: 1.1; }
        .title span { color: var(--gold); text-shadow: 0 0 20px rgba(245,197,24,0.5); }
        .subtitle { text-align: center; color: rgba(240,240,240,0.5); font-size: 14px; line-height: 1.6; margin-bottom: 40px; animation: fadeIn 0.6s ease 0.6s both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; animation: fadeIn 0.6s ease 0.7s both; }
        .divider-line { flex: 1; height: 1px; background: rgba(245,197,24,0.15); }
        .divider-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 8px var(--gold); }
        .perms { background: var(--black3); border: 1px solid rgba(245,197,24,0.1); border-radius: 14px; padding: 20px; margin-bottom: 32px; animation: fadeIn 0.6s ease 0.8s both; }
        .perms-title { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
        .perm-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; color: rgba(240,240,240,0.75); }
        .perm-item:last-child { border-bottom: none; }
        .perm-icon { width: 28px; height: 28px; background: rgba(245,197,24,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .btn-auth { width: 100%; padding: 18px; background: var(--gold); color: var(--black); border: none; border-radius: 14px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3px; cursor: none; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; animation: fadeIn 0.6s ease 0.9s both; display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none; }
        .btn-auth::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
        .btn-auth:hover::before { left: 100%; }
        .btn-auth:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,197,24,0.5); }
        .status-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 0; animation: fadeIn 0.4s ease both; }
        .status-icon { font-size: 56px; margin-bottom: 16px; animation: iconBounce 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes iconBounce { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .status-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 2px; margin-bottom: 8px; }
        .status-title.success { color: var(--gold); }
        .status-title.error { color: #FF4444; }
        .status-desc { font-size: 14px; color: rgba(240,240,240,0.5); line-height: 1.6; }
        .spinner { display: none; width: 40px; height: 40px; border: 3px solid rgba(245,197,24,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 20px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        footer { position: relative; z-index: 1; text-align: center; padding: 24px; color: rgba(240,240,240,0.25); font-size: 12px; letter-spacing: 1px; }
        footer span { color: var(--gold); opacity: 0.6; }
        .corner { position: absolute; width: 20px; height: 20px; border-color: rgba(245,197,24,0.3); border-style: solid; }
        .corner-tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }
        #particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        @media (max-width: 480px) { .card { padding: 36px 24px; } .title { font-size: 32px; } }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div id="cursor"></div>
      <div id="cursor-trail"></div>
      <div className="bg-grid"></div>
      <div className="bg-glow" id="bg-glow"></div>
      <div id="particles"></div>

      <div className="wrapper">
        <div className="card">
          <div className="corner corner-tl"></div>
          <div className="corner corner-tr"></div>
          <div className="corner corner-bl"></div>
          <div className="corner corner-br"></div>

          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">JP <span>STORE</span></div>
          </div>

          {searchParams.status === 'success' ? (
            <div className="status-card">
              <div className="status-icon">✅</div>
              <div className="status-title success">VERIFICADO!</div>
              <p className="status-desc">Sua identidade foi confirmada.<br />Você já pode fechar esta janela e voltar ao Discord.</p>
            </div>
          ) : searchParams.status === 'error' ? (
            <div className="status-card">
              <div className="status-icon">❌</div>
              <div className="status-title error">ERRO!</div>
              <p className="status-desc">{searchParams.error || 'Ocorreu um erro.'}<br />Tente novamente ou contate o suporte.</p>
              <a href="/" className="btn-auth" style={{ marginTop: '24px' }}>TENTAR NOVAMENTE</a>
            </div>
          ) : (
            <div id="main-content">
              <h1 className="title">VERIFICAÇÃO<br /><span>DE IDENTIDADE</span></h1>
              <p className="subtitle">Conecte sua conta Discord para confirmar sua identidade<br />e liberar o acesso completo ao servidor.</p>
              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-dot"></div>
                <div className="divider-line"></div>
              </div>
              <div className="perms">
                <div className="perms-title">Permissões solicitadas</div>
                <div className="perm-item"><div className="perm-icon">👤</div><span>Visualizar seu nome e avatar</span></div>
                <div className="perm-item"><div className="perm-icon">📧</div><span>Acessar seu endereço de email</span></div>
                <div className="perm-item"><div className="perm-icon">🖥️</div><span>Ver seus servidores Discord</span></div>
                <div className="perm-item"><div className="perm-icon">🔒</div><span>Confirmar identidade única (anti-bot)</span></div>
              </div>
              <a id="auth-btn" href={`https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(siteUrl + '/callback')}&response_type=code&scope=identify%20email%20guilds&state=${searchParams.user_id || ''}`} className="btn-auth">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                VERIFICAR COM DISCORD
              </a>
            </div>
          )}
        </div>
        <footer>Auth da <span>Lojinha JP</span> &nbsp;|&nbsp; Todos os direitos reservados</footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        const trail = document.getElementById('cursor-trail');
        const bgGlow = document.getElementById('bg-glow');
        let mx=0,my=0,tx=0,ty=0;
        
        document.addEventListener('mousemove', e => {
          mx=e.clientX; my=e.clientY;
          trail.style.opacity='0.6';
          bgGlow.style.left=(e.clientX/window.innerWidth*100)+'%';
          bgGlow.style.top=(e.clientY/window.innerHeight*100)+'%';
        });
        function animTrail(){tx+=(mx-tx)*0.15;ty+=(my-ty)*0.15;trail.style.left=tx+'px';trail.style.top=ty+'px';requestAnimationFrame(animTrail);}
        animTrail();
        document.querySelectorAll('a,.btn-auth').forEach(el=>{
          el.addEventListener('mouseenter',()=>{cursor.style.width='20px';cursor.style.height='20px';trail.style.width='52px';trail.style.height='52px';});
          el.addEventListener('mouseleave',()=>{cursor.style.width='12px';cursor.style.height='12px';trail.style.width='36px';trail.style.height='36px';});
        });
        const pc=document.getElementById('particles');
        for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';p.style.setProperty('--dur',(4+Math.random()*6)+'s');p.style.setProperty('--delay',(Math.random()*8)+'s');p.style.setProperty('--x',(Math.random()*100)+'%');pc.appendChild(p);}
      `}} />
    </>
  )
}
