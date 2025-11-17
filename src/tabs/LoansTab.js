// desktop/budget-app/client/src/tabs/LoansTab.js

function LoansTab({ darkMode, mustard }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 20,
        background: darkMode ? 'rgba(15,23,42,0.98)' : '#f9fafb',
        border: darkMode
          ? '1px solid rgba(55,65,81,0.9)'
          : '1px solid rgba(209,213,219,1)',
        color: darkMode ? '#e5e7eb' : '#111827',
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        Loans
      </div>
      <div
        style={{
          fontSize: 13,
          color: darkMode ? '#9ca3af' : '#6b7280',
          marginBottom: 12
        }}
      >
        In progress...
      </div>
      <div
        style={{
          fontSize: 11,
          padding: '6px 10px',
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          background: darkMode ? '#020617' : '#fef2f2',
          color: darkMode ? mustard : '#b91c1c',
          border: darkMode
            ? `1px solid ${mustard}`
            : '1px solid rgba(248,113,113,0.7)'
        }}
      >
        Planned area for loan and debt tracking
      </div>
    </div>
  );
}

export default LoansTab;
