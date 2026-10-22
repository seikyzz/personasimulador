import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
} from '../services/googleDriveAuth';
import {
  downloadProjectZipLocally,
  uploadProjectZipToGoogleDrive,
  DriveUploadResult,
} from '../services/projectZipExport';
import { Download, CloudUpload, CheckCircle2, ExternalLink, X, LogOut } from 'lucide-react';

interface ExportDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentBgClass: string;
}

export const ExportDriveModal: React.FC<ExportDriveModalProps> = ({
  isOpen,
  onClose,
  accentBgClass,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showConfirmUpload, setShowConfirmUpload] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<DriveUploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (loggedUser) => {
        setUser(loggedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Falha ao autenticar com o Google. Verifique se pop-ups estão permitidos.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLocalDownload = async () => {
    setIsDownloading(true);
    setErrorMsg(null);
    try {
      await downloadProjectZipLocally();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao gerar o arquivo .ZIP.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConfirmUploadToDrive = async () => {
    setShowConfirmUpload(false);
    setIsUploading(true);
    setErrorMsg(null);
    setUploadResult(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        throw new Error('Sua sessão expirou. Conecte sua conta Google novamente.');
      }
      const res = await uploadProjectZipToGoogleDrive(token);
      setUploadResult(res);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Falha ao enviar o arquivo .ZIP para o Google Drive.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setUploadResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border-2 border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-[8px_8px_0px_rgba(0,0,0,0.85)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">
              Exportação do Código-Fonte Completo
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Gerar .ZIP & Salvar no Google Drive
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          O pacote <span className="font-mono text-white">velvet-academy-completo.zip</span> inclui todos os arquivos do site (<span className="font-mono text-slate-400">index.html, package.json, App.tsx, componentes, sprites SVG e bancos de dados de Personas</span>) prontos para rodar.
        </p>

        {/* Option 1: Direct Local Download */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">1. Baixar .ZIP Direto no Computador</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Download imediato pelo navegador sem precisar de login.
            </p>
          </div>
          <button
            onClick={handleLocalDownload}
            disabled={isDownloading}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Gerando .ZIP...' : 'Baixar .ZIP'}
          </button>
        </div>

        {/* Option 2: Save directly to Google Drive */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">
                2. Enviar Automaticamente para o Google Drive
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Salva o arquivo <span className="font-mono">velvet-academy-completo.zip</span> direto na raiz do seu Google Drive.
              </p>
            </div>
            {user && !needsAuth && (
              <button
                onClick={handleLogout}
                title="Desconectar conta Google"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            )}
          </div>

          {needsAuth ? (
            <div className="pt-1">
              {/* Official Google Sign-In Button Pattern */}
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-3 transition-colors border border-slate-300 cursor-pointer"
              >
                <div className="w-4 h-4 shrink-0">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    style={{ display: 'block' }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span>{isLoggingIn ? 'Conectando ao Google...' : 'Sign in with Google'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                <span className="text-slate-300 truncate">
                  Conectado como: <strong className="text-white">{user?.email || user?.displayName}</strong>
                </span>
              </div>

              {!showConfirmUpload ? (
                <button
                  onClick={() => setShowConfirmUpload(true)}
                  disabled={isUploading}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${accentBgClass}`}
                >
                  <CloudUpload className="w-4 h-4" />
                  {isUploading ? 'Enviando para o Google Drive...' : 'Salvar .ZIP no Google Drive'}
                </button>
              ) : (
                /* Explicit User Confirmation Dialog before mutating Google Drive */
                <div className="bg-slate-950 border-2 border-amber-500/60 rounded-lg p-3.5 space-y-3">
                  <p className="text-xs text-amber-200 font-medium">
                    Confirmar a criação e envio do arquivo <strong>"velvet-academy-completo.zip"</strong> para o seu Google Drive?
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowConfirmUpload(false)}
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmUploadToDrive}
                      className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Confirmar Envio ao Drive
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Result */}
          {uploadResult && (
            <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Arquivo salvo com sucesso no seu Google Drive!</span>
              </div>
              {uploadResult.webViewLink && (
                <a
                  href={uploadResult.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white underline font-semibold hover:text-emerald-200"
                >
                  <span>Abrir {uploadResult.name} no Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Error Display */}
          {errorMsg && (
            <div className="bg-rose-950/50 border border-rose-500/50 rounded-lg p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
