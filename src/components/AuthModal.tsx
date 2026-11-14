import * as Dialog from '@radix-ui/react-dialog'
import { useState, type FormEvent } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { errorMessage } from '../lib/utils'
import { useMarketplace } from '../state/MarketplaceContext'
import type { Collector } from '../types'
import { Button } from './ui/Button'

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, signIn } = useMarketplace()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [formError, setFormError] = useState('')
  const mutation = useMutation({
    mutationFn: async () => {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register'
      const { data } = await api.post<Collector>(endpoint, { name, email, password })
      return data
    },
    onSuccess: user => { signIn(user); setPassword(''); setConfirm(''); setFormError('') },
  })
  function submit(event: FormEvent) {
    event.preventDefault()
    setFormError('')
    if (authMode === 'register' && password !== confirm) {
      setFormError('As senhas não coincidem.')
      return
    }
    mutation.mutate()
  }
  function changeMode(mode: 'login' | 'register') {
    setAuthMode(mode)
    setFormError('')
    mutation.reset()
  }
  return (
    <Dialog.Root open={authOpen} onOpenChange={setAuthOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content" aria-describedby="auth-description">
          <Dialog.Close className="dialog-close" aria-label="Fechar"><X size={17}/></Dialog.Close>
          <Dialog.Title className="auth-heading">
            <button type="button" className={authMode === 'login' ? 'selected' : ''} onClick={() => changeMode('login')}>Entrar</button>
            <span> | </span>
            <button type="button" className={authMode === 'register' ? 'selected' : ''} onClick={() => changeMode('register')}>Criar conta</button>
          </Dialog.Title>
          <Dialog.Description id="auth-description" className="auth-intro">
            {authMode === 'login' ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.' : 'Crie seu perfil de colecionador para salvar obras e finalizar compras.'}
          </Dialog.Description>
          <form onSubmit={submit} className="auth-form">
            {authMode === 'register' && <input required aria-label="Nome de usuário" placeholder="Nome de usuário" value={name} onChange={event => setName(event.target.value)}/>}
            <input required type="email" aria-label="E-mail" placeholder="contato@email.com" value={email} onChange={event => setEmail(event.target.value)}/>
            <div className="password-row">
              <input required minLength={8} type={showPassword ? 'text' : 'password'} aria-label="Senha" placeholder="Senha" value={password} onChange={event => setPassword(event.target.value)}/>
              <button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
            {authMode === 'register' && <input required minLength={8} type={showPassword ? 'text' : 'password'} aria-label="Confirmar senha" placeholder="Confirmar senha" value={confirm} onChange={event => setConfirm(event.target.value)}/>}
            {authMode === 'login' && <p className="auth-hint">Acesso de demonstração: colecionador@kurio.com / Kurio123!</p>}
            {(formError || mutation.isError) && <p className="form-error" role="alert">{formError || errorMessage(mutation.error)}</p>}
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Aguarde...' : authMode === 'login' ? 'Entrar' : 'Criar conta'}</Button>
          </form>
          <div className="auth-bottom"><span>Ambiente de demonstração. Nenhuma carteira real é conectada.</span></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
