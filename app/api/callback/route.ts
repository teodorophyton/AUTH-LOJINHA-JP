import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import axios from 'axios'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const userId = req.nextUrl.searchParams.get('user_id') // ID do Discord do usuário que clicou no botão

  if (!code) {
    return NextResponse.json({ success: false, error: 'Código não fornecido' }, { status: 400 })
  }

  try {
    const clientId = process.env.DISCORD_CLIENT_ID!
    const clientSecret = process.env.DISCORD_CLIENT_SECRET!
    const redirectUri = process.env.SITE_URL + '/callback'

    // 1. Trocar código por token
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    const { access_token } = tokenRes.data

    // 2. Buscar dados do usuário
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    })

    const discordUser = userRes.data
    const discordId = discordUser.id

    // 3. Salvar/atualizar verificação no MongoDB (mesmo banco do bot)
    const mongoUri = process.env.MONGODB_URI!
    const client = new MongoClient(mongoUri)
    await client.connect()
    const db = client.db('lojinha')

    await db.collection('users').updateOne(
      { id: discordId },
      {
        $set: {
          id: discordId,
          discord_id: discordId,
          name: discordUser.username,
          email: discordUser.email,
          avatar: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png` : null,
          verified: 1,
          verified_at: new Date().toISOString(),
        }
      },
      { upsert: true }
    )

    // 4. Notificar o bot para dar o cargo de verificado (via banco)
    await db.collection('pending_verifications').insertOne({
      discord_id: discordId,
      requester_id: userId || null, // ID de quem clicou no botão no Discord
      username: discordUser.username,
      timestamp: new Date().toISOString(),
      processed: false,
    })

    await client.close()

    return NextResponse.json({ success: true, discord_id: discordId })
  } catch (err: any) {
    console.error('[Auth Callback] Erro:', err.response?.data || err.message)
    return NextResponse.json({ success: false, error: err.message || 'Erro interno' }, { status: 500 })
  }
}
