import { ImageResponse } from 'next/og';

const size = { width: 1200, height: 630 };

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 72,
        color: '#edf5ff',
        background:
          'linear-gradient(125deg, #071521 10%, #133a66 60%, #3c286c)',
      }}
    >
      <div style={{ display: 'flex', fontSize: 42, color: '#7fbeff' }}>
        aiollm.dev
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontSize: 88, fontWeight: 700 }}>aiollm</div>
        <div style={{ fontSize: 46, maxWidth: 980 }}>
          Typed, async Python clients for AI APIs.
        </div>
      </div>
      <div style={{ fontSize: 25, color: '#bdd3ef' }}>
        Pydantic · aiohttp · OpenAI · Anthropic
      </div>
    </div>,
    size,
  );
}
