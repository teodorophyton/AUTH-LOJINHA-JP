'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CallbackClient() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = params.get('code')
    const state = params.get('state')

    if (!code) {
      router.push('/?status=error&error=Código+não+recebido')
      return
    }

    fetch(`/api/callback?code=${code}${state ? '&user_id=' + state : ''}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) router.push('/?status=success')
        else router.push('/?status=error&error=' + encodeURIComponent(data.error || 'Erro'))
      })
      .catch(() => router.push('/?status=error&error=Erro+de+conexão'))
  }, [])

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{min-height:100vh;background:#0A0A0A;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:#F0F0F0;}
        .bg{position:fixed;inset:0;background-image:linear-gradient(rgba(245,197,24,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,197,24,0.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;}
        .card{position:relative;z-index:1;background:#111;border:1px solid rgba(245,197,24,0.15);border-radius:24px;padding:56px 48px;max-width:420px;width:90%;text-align:center;}
        .card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#F5C518,transparent);}
        .spinner{width:52px;height:52px;border:3px solid rgba(245,197,24,0.2);border-top-color:#F5C518;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 24px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .title{font-size:20px;font-weight:700;color:#F5C518;margin-bottom:8px;letter-spacing:2px;text-transform:uppercase;}
        .desc{font-size:14px;color:rgba(240,240,240,0.5);}
        footer{position:fixed;bottom:20px;left:0;right:0;text-align:center;font-size:12px;color:rgba(240,240,240,0.2);}
        footer span{color:#F5C518;opacity:0.5;}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      <div className="bg"></div>
      <div className="card">
        <div className="spinner"></div>
        <div className="title">Verificando...</div>
        <p className="desc">Confirmando sua identidade Discord.<br />Aguarde um momento.</p>
      </div>
      <footer>Auth da <span>Lojinha JP</span> &nbsp;|&nbsp; Todos os direitos reservados</footer>
    </>
  )
}
