// /desktop/budget-app/client/src/tabs/OverviewTab.js

import { useState } from 'react';

function OverviewTab({
  darkMode,
  mustard,
  accounts,
  savingsAccounts,
  accountBalances,
  savingsBalances,
  accountEditMode,
  setAccountEditMode,
  savingsEditMode,
  setSavingsEditMode,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onAddSavings,
  onEditSavings,
  onDeleteSavings,
  incomeCategories,
  expenseCategories,
  transactions
}) {
  const cardDark = 'rgba(15,23,42,0.98)';
  const cardLight = '#ffffff';

  const [yearCollapsed, setYearCollapsed] = useState(false);

  // build annual summary 2025
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const sumFor = (cat, month, type) => {
    return transactions
      .filter(
        t =>
          t.category === cat &&
          t.type === type &&
          t.date &&
          t.date.startsWith(`2025-${month}`)
      )
      .reduce((s, t) => s + t.amount, 0);
  };

  const totalForCategory = (cat, type) => {
    return transactions
      .filter(t => t.category === cat && t.type === type && t.date && t.date.startsWith('2025'))
      .reduce((s, t) => s + t.amount, 0);
  };

  const renderBalancesCard = () => (
    <div
      style={{
        background: darkMode ? cardDark : '#f9fafb',
        borderRadius: 18,
        padding: 16,
        border: darkMode
          ? '1px solid rgba(55,65,81,0.9)'
          : '1px solid rgba(209,213,219,1)',
        color: darkMode ? '#e5e7eb' : '#111827',
        marginBottom: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Balances</div>
          <div style={{ fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' }}>Main bank and cash are always required</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <button
            onClick={() => setAccountEditMode(v => !v)}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '2px 6px', borderRadius: 999, fontSize: 11,
              color: darkMode ? '#9ca3af' : '#6b7280',
              boxShadow: darkMode ? '0 0 0 1px rgba(55,65,81,0.7)' : '0 0 0 1px rgba(209,213,219,1)'
            }}
          >
            {accountEditMode ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={onAddAccount}
            style={{
              width: 24, height: 24, borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, color: '#111827',
              boxShadow: '0 10px 20px rgba(249,115,22,0.45)'
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, marginTop: 4 }}>
        {accountBalances
          .filter(acc => acc.type !== 'savings')
          .map(acc => (
            <div
              key={acc.id}
              style={{
                padding: 8, borderRadius: 10,
                border: darkMode ? '1px solid rgba(55,65,81,0.9)' : '1px solid rgba(209,213,219,1)',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{acc.name}</div>
                <div style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  {acc.currency} · {acc.type === 'cash' ? 'Cash' : 'Bank'}
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: 700, fontSize: 16,
                    color: acc.net >= 0 ? '#16a34a' : '#dc2626'
                  }}
                >
                  {acc.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {acc.currency}
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'right', fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' }}>
                <div>In: <span style={{ color: '#22c55e' }}>{acc.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div>Out: <span style={{ color: '#fb923c' }}>{acc.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              </div>

              {accountEditMode && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 8, gap: 2 }}>
                  <button
                    onClick={() => onEditAccount(acc)}
                    style={{
                      border: 'none', background: '#e5e7eb', borderRadius: 999,
                      padding: '2px 6px', fontSize: 10, cursor: 'pointer',
                      animation: 'wiggle 1.2s ease-in-out infinite'
                    }}
                  >
                    ✎
                  </button>
                  {!acc.mandatory && (
                    <button
                      onClick={() => onDeleteAccount(acc)}
                      style={{
                        border: 'none', background: '#fee2e2', borderRadius: 999,
                        padding: '2px 6px', fontSize: 10, cursor: 'pointer',
                        color: '#b91c1c'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  const renderSavingsCard = () => (
    <div
      style={{
        background: darkMode ? cardDark : '#f9fafb',
        borderRadius: 18,
        padding: 16,
        border: darkMode ? '1px solid rgba(55,65,81,0.9)' : '1px solid rgba(209,213,219,1)',
        color: darkMode ? '#e5e7eb' : '#111827',
        marginBottom: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Savings</div>
          <div style={{ fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' }}>Long-term savings</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <button
            onClick={() => setSavingsEditMode(v => !v)}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '2px 6px', borderRadius: 999, fontSize: 11,
              color: darkMode ? '#9ca3af' : '#6b7280',
              boxShadow: darkMode ? '0 0 0 1px rgba(55,65,81,0.7)' : '0 0 0 1px rgba(209,213,219,1)'
            }}
          >
            {savingsEditMode ? 'Done' : 'Edit'}
          </button>

          <button
            onClick={onAddSavings}
            style={{
              width: 24, height: 24, borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, color: '#111827',
              boxShadow: '0 10px 20px rgba(249,115,22,0.45)'
            }}
          >
            +
          </button>
        </div>
      </div>

      {savingsBalances.length === 0 ? (
        <div style={{ fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280', paddingTop: 4 }}>No savings accounts yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, marginTop: 4 }}>
          {savingsBalances.map(acc => (
            <div
              key={acc.id}
              style={{
                padding: 8, borderRadius: 10,
                border: darkMode ? '1px solid rgba(55,65,81,0.9)' : '1px solid rgba(209,213,219,1)',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{acc.name}</div>
                <div style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>{acc.currency} · Savings</div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: acc.net >= 0 ? '#16a34a' : '#dc2626' }}>
                  {acc.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {acc.currency}
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'right', fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' }}>
                <div>In: <span style={{ color: '#22c55e' }}>{acc.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div>Out: <span style={{ color: '#fb923c' }}>{acc.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              </div>

              {savingsEditMode && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 8, gap: 2 }}>
                  <button
                    onClick={() => onEditSavings(acc)}
                    style={{
                      border: 'none', background: '#e5e7eb', borderRadius: 999,
                      padding: '2px 6px', fontSize: 10, cursor: 'pointer',
                      animation: 'wiggle 1.2s ease-in-out infinite'
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDeleteSavings(acc)}
                    style={{
                      border: 'none', background: '#fee2e2', borderRadius: 999,
                      padding: '2px 6px', fontSize: 10, cursor: 'pointer', color: '#b91c1c'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnnualSummary = () => {
    const monthLabels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const headerColSpan = yearCollapsed ? 2 : months.length + 2; // Categories + (months or 2025) + maybe 2025 total

    return (
      <div
        style={{
          background: darkMode ? cardDark : '#ffffff',
          borderRadius: 18,
          padding: 16,
          border: darkMode
            ? '1px solid rgba(55,65,81,0.9)'
            : '1px solid #e5e7eb',
          color: darkMode ? '#e5e7eb' : '#111827'
        }}
      >
        {/* YEAR TOGGLE */}
        <button
          type="button"
          onClick={() => setYearCollapsed(v => !v)}
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4px 10px',
            cursor: 'pointer'
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: darkMode ? '#e5e7eb' : '#111827'
            }}
          >
            Summary
          </span>
          <span
            style={{
              fontSize: 12,
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            {yearCollapsed ? 'Show months ▾' : 'Hide months ▴'}
          </span>
        </button>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 11
            }}
          >
            <thead>
              {/* ONE header row only, Google-Sheets style */}
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '4px 6px',
                    fontSize: 12
                  }}
                >
                  Categories
                </th>

                {yearCollapsed ? (
                  // collapsed: only one numeric column, labelled 2025, right next to Categories
                  <th
                    style={{
                      textAlign: 'right',
                      padding: '4px 6px',
                      fontSize: 12
                    }}
                  >
                    2025
                  </th>
                ) : (
                  <>
                    {months.map((m, i) => (
                      <th
                        key={m}
                        style={{
                          padding: '4px 6px',
                          textAlign: 'right'
                        }}
                      >
                        {monthLabels[i]}
                      </th>
                    ))}
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '4px 6px',
                        fontSize: 12
                      }}
                    >
                      2025
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {/* INCOME SECTION LABEL */}
              <tr>
                <td
                  colSpan={headerColSpan}
                  style={{
                    padding: '6px 6px',
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#22c55e'
                  }}
                >
                  Income Categories
                </td>
              </tr>

              {incomeCategories.map((cat) => (
                <tr key={cat}>
                  <td style={{ padding: '4px 6px' }}>{cat}</td>

                  {yearCollapsed ? (
                    // collapsed: only year total, in the first numeric column
                    <td
                      style={{
                        padding: '4px 6px',
                        textAlign: 'right',
                        fontWeight: 600,
                        color: '#16a34a'
                      }}
                    >
                      {totalForCategory(cat, 'income').toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  ) : (
                    <>
                      {months.map((m) => (
                        <td
                          key={m}
                          style={{
                            padding: '4px 6px',
                            textAlign: 'right',
                            color: '#22c55e'
                          }}
                        >
                          {sumFor(cat, m, 'income').toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: '4px 6px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: '#16a34a'
                        }}
                      >
                        {totalForCategory(cat, 'income').toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {/* EXPENSE SECTION LABEL */}
              <tr>
                <td
                  colSpan={headerColSpan}
                  style={{
                    padding: '10px 6px 0',
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#f97316'
                  }}
                >
                  Expense Categories
                </td>
              </tr>

              {expenseCategories.map((cat) => (
                <tr key={cat}>
                  <td style={{ padding: '4px 6px' }}>{cat}</td>

                  {yearCollapsed ? (
                    <td
                      style={{
                        padding: '4px 6px',
                        textAlign: 'right',
                        fontWeight: 600,
                        color: '#dc2626'
                      }}
                    >
                      {totalForCategory(cat, 'expense').toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  ) : (
                    <>
                      {months.map((m) => (
                        <td
                          key={m}
                          style={{
                            padding: '4px 6px',
                            textAlign: 'right',
                            color: '#fb923c'
                          }}
                        >
                          {sumFor(cat, m, 'expense').toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: '4px 6px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: '#dc2626'
                        }}
                      >
                        {totalForCategory(cat, 'expense').toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };




  return (
    <>
      {/* Top: balances + savings side by side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: 20,
          marginBottom: 16
        }}
      >
        <div>{renderBalancesCard()}</div>
        <div>{renderSavingsCard()}</div>
      </div>

      {/* Bottom: annual summary full width */}
      {renderAnnualSummary()}
    </>
  );

}

export default OverviewTab;
