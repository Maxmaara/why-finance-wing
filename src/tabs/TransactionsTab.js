// desktop/budget-app/client/src/tabs/TransactionsTab.js

function TransactionsTab({
  darkMode,
  transactions,
  accounts,
  collapsedMonths,
  toggleMonthCollapse,
  onEditTx,
  onDeleteTx
}) {
  const cardDark = 'rgba(15,23,42,0.98)';

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const monthShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const monthLabel = (monthKey) => {
    if (!monthKey || monthKey === 'no-date') return 'No date';
    const [y, m] = monthKey.split('-');
    const monthIndex = Number(m) - 1;
    if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      return monthKey;
    }
    return `${monthNames[monthIndex]} ${y}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const monthIndex = Number(m) - 1;
    const day = d.padStart(2, '0');
    const mon = monthShort[monthIndex] || m;
    // DD-MMM-YYYY
    return `${day}-${mon}-${y}`;
  };

  const buildCombinedByMonth = (txList) => {
    const map = {};
    txList.forEach((t) => {
      const key = t.date ? t.date.slice(0, 7) : 'no-date';
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });

    const keys = Object.keys(map).sort((a, b) => {
      if (a === 'no-date' && b === 'no-date') return 0;
      if (a === 'no-date') return 1;
      if (b === 'no-date') return -1;
      // latest month first
      return b.localeCompare(a);
    });

    return keys.map((k) => ({
      monthKey: k,
      items: map[k].slice().sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
      })
    }));
  };

  const combinedByMonth = buildCombinedByMonth(transactions);

  return (
    <div
      style={{
        background: darkMode ? cardDark : '#f9fafb',
        borderRadius: 18,
        padding: 16,
        border: darkMode
          ? '1px solid rgba(55,65,81,0.9)'
          : '1px solid rgba(209,213,219,1)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Transactions
        </div>
        <div
          style={{
            fontSize: 11,
            color: darkMode ? '#9ca3af' : '#6b7280'
          }}
        >
          {transactions.length} records
        </div>
      </div>

      {combinedByMonth.length === 0 && (
        <div
          style={{
            fontSize: 12,
            color: darkMode ? '#6b7280' : '#9ca3af'
          }}
        >
          No transactions yet
        </div>
      )}

      {combinedByMonth.map(({ monthKey, items }) => {
        const expenseItems = items.filter((t) => t.type === 'expense');
        const incomeItems = items.filter((t) => t.type === 'income');

        return (
          <div
            key={monthKey}
            style={{
              marginBottom: 10,
              borderRadius: 12,
              border: darkMode
                ? '1px solid rgba(55,65,81,0.9)'
                : '1px solid rgba(209,213,219,1)',
              overflow: 'hidden'
            }}
          >
            {/* Month header */}
            <button
              type="button"
              onClick={() => toggleMonthCollapse(monthKey)}
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '6px 10px',
                border: 'none',
                background: darkMode ? '#020617' : '#e5e7eb',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                color: darkMode ? '#e5e7eb' : '#111827'
              }}
            >
              <span>
                {monthLabel(monthKey)} · {items.length} items
              </span>
              <span
                style={{
                  position: 'absolute',
                  right: 10
                }}
              >
                {collapsedMonths[monthKey] ? '▸' : '▾'}
              </span>
            </button>

            {!collapsedMonths[monthKey] && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                  gap: 0,
                  maxHeight: 260,
                  overflowY: 'auto'
                }}
              >
                {/* Expenses table */}
                <div
                  style={{
                    borderRight: darkMode
                      ? '1px solid rgba(31,41,55,0.9)'
                      : '1px solid rgba(229,231,235,1)'
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 8px',
                      color: '#fb923c',
                      borderBottom: darkMode
                        ? '1px solid rgba(31,41,55,0.9)'
                        : '1px solid rgba(229,231,235,1)'
                    }}
                  >
                    Expenses
                  </div>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 11
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: darkMode ? '#020617' : '#f3f4f6'
                        }}
                      >
                        {[
                          'S/N',
                          'Date',
                          'Amount',
                          'Description',
                          'Category',
                          'Account',
                          ''
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: '4px 6px',
                              textAlign: h === 'Amount' ? 'right' : 'left',
                              borderBottom: darkMode
                                ? '1px solid rgba(31,41,55,0.9)'
                                : '1px solid rgba(229,231,235,1)'
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {expenseItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            style={{
                              padding: '6px 6px',
                              textAlign: 'center',
                              color: darkMode ? '#6b7280' : '#9ca3af'
                            }}
                          >
                            -
                          </td>
                        </tr>
                      )}
                      {expenseItems.map((t, idx) => {
                        const acc =
                          accounts.find((a) => a.id === t.accountId) ||
                          accounts[0];
                        return (
                          <tr
                            key={t.id}
                            style={{
                              background: darkMode ? '#020617' : '#ffffff',
                              borderBottom: darkMode
                                ? '1px solid rgba(31,41,55,0.9)'
                                : '1px solid rgba(243,244,246,1)'
                            }}
                          >
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {idx + 1}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {formatDate(t.date)}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px',
                                textAlign: 'right',
                                fontWeight: 600,
                                color: '#f97316'
                              }}
                            >
                              -
                              {t.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {t.description || '-'}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {t.category || '-'}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {acc?.name} ({acc?.currency})
                            </td>
                            <td
                              style={{
                                padding: '4px 4px',
                                textAlign: 'right',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <button
                                onClick={() => onEditTx(t)}
                                style={{
                                  border: 'none',
                                  padding: '2px 4px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  cursor: 'pointer',
                                  marginRight: 2,
                                  background: '#e5e7eb'
                                }}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => onDeleteTx(t.id)}
                                style={{
                                  border: 'none',
                                  padding: '2px 4px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  cursor: 'pointer',
                                  background: '#fee2e2',
                                  color: '#b91c1c'
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Income table */}
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 8px',
                      color: '#22c55e',
                      borderBottom: darkMode
                        ? '1px solid rgba(31,41,55,0.9)'
                        : '1px solid rgba(229,231,235,1)'
                    }}
                  >
                    Income
                  </div>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 11
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: darkMode ? '#020617' : '#f3f4f6'
                        }}
                      >
                        {[
                          'S/N',
                          'Date',
                          'Amount',
                          'Description',
                          'Category',
                          'Account',
                          ''
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: '4px 6px',
                              textAlign: h === 'Amount' ? 'right' : 'left',
                              borderBottom: darkMode
                                ? '1px solid rgba(31,41,55,0.9)'
                                : '1px solid rgba(229,231,235,1)'
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {incomeItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            style={{
                              padding: '6px 6px',
                              textAlign: 'center',
                              color: darkMode ? '#6b7280' : '#9ca3af'
                            }}
                          >
                            -
                          </td>
                        </tr>
                      )}
                      {incomeItems.map((t, idx) => {
                        const acc =
                          accounts.find((a) => a.id === t.accountId) ||
                          accounts[0];
                        return (
                          <tr
                            key={t.id}
                            style={{
                              background: darkMode ? '#020617' : '#ffffff',
                              borderBottom: darkMode
                                ? '1px solid rgba(31,41,55,0.9)'
                                : '1px solid rgba(243,244,246,1)'
                            }}
                          >
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {idx + 1}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {formatDate(t.date)}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px',
                                textAlign: 'right',
                                fontWeight: 600,
                                color: '#22c55e'
                              }}
                            >
                              +
                              {t.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {t.description || '-'}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {t.category || '-'}
                            </td>
                            <td
                              style={{
                                padding: '4px 6px'
                              }}
                            >
                              {acc?.name} ({acc?.currency})
                            </td>
                            <td
                              style={{
                                padding: '4px 4px',
                                textAlign: 'right',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <button
                                onClick={() => onEditTx(t)}
                                style={{
                                  border: 'none',
                                  padding: '2px 4px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  cursor: 'pointer',
                                  marginRight: 2,
                                  background: '#e5e7eb'
                                }}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => onDeleteTx(t.id)}
                                style={{
                                  border: 'none',
                                  padding: '2px 4px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  cursor: 'pointer',
                                  background: '#fee2e2',
                                  color: '#b91c1c'
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TransactionsTab;
