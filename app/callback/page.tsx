import { Suspense } from 'react'
import CallbackClient from './client'

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <>
        <style>{`*{margin:0;padding:0;box-sizing:border-box;}body{min-height:100vh;background:#0A0A0A;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:#F0F0F0;}.spinner{width:52px;height:52px;border:3px solid rgba(245,197,24,0.2);border-top-color:#F5C518;border-radius:50%;animation:spin 0.8s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}`}</style>
        <div className="spinner"></div>
      </>
    }>
      <CallbackClient />
    </Suspense>
  )
}
