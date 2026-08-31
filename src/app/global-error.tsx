'use client';

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '2rem',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          colorScheme: 'light dark',
        }}
      >
        <title>Zelo — erro</title>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '28rem' }}
        >
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Alguma coisa deu errado</h1>
          <p style={{ margin: 0 }}>
            Não conseguimos carregar a página. Tente de novo em instantes.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              alignSelf: 'flex-start',
              minHeight: 44,
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid currentColor',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
