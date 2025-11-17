// /desktop/budget-app/client/src/tabs/TransactionsTab.js

import { useState } from 'react';

function TransactionsTab({
  darkMode,
  transactions,
  accounts,              // this is allSelectableAccounts from App
  collapsedMonths,
  toggleMonthCollapse,
  onEditTx,
  onDeleteTx,
  form,
  setForm,
  handleSubmitTx,
  resetForm,
  incomeCategories,
  expenseCategories,
  addCategory,
  removeCategory
}) {
  const cardDark = 'rgba(15,23,42,0.98)';
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const isTransfer = form.type === 'transfer';

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const monthShort = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  const dropdownBaseStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 10,
    border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
    fontSize: 13,
    textAlign: 'left',
    background: darkMode ? '#020617' : '#ffffff',
    color: darkMode ? '#f9fafb' : '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
  };

  const monthLabel = (monthKey) => {
    if (!monthKey || monthKey === 'no-date') return 'No date';
    const [y, m] = monthKey.split('-');
    const idx = Number(m) - 1;
    if (idx < 0 || idx > 11 || Number.isNaN(idx)) return monthKey;
    return `${monthNames[idx]} ${y}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const idx = Number(m) - 1;
    const mon = monthShort[idx] || m;
    return `${d.padStart(2, '0')}-${mon}-${y}`;
  };

  const currentCategoryList =
    form.type === 'income'
      ? incomeCategories
      : form.type === 'expense'
      ? expenseCategories
      : [];

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
      return b.localeCompare(a); // latest first
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

  // ---------- Add / Edit form ----------
  const renderTransactionForm = () => (
    <div
      style={{
        background: darkMode ? cardDark : '#ffffff',
        borderRadius: 18,
        padding: 18,
        border: darkMode
          ? '1px solid rgba(55,65,81,0.9)'
          : '1px solid #e5e7eb',
        color: darkMode ? '#e5e7eb' : '#111827',
        marginBottom: 20
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 10
        }}
      >
        {form.id ? 'Edit transaction' : 'Add transaction'}
      </div>

      <form
        onSubmit={handleSubmitTx}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {/* Row 1: Date + Type */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10
          }}
        >
          {/* Date */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: 12,
                marginBottom: 2,
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                backgroundColor: darkMode ? '#020617' : '#ffffff',
                color: darkMode ? '#f9fafb' : '#111827',
                fontSize: 13
              }}
            />
          </div>

          {/* Type */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: 12,
                marginBottom: 2,
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              Type
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={form.type}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setForm((prev) => ({ ...prev, type: nextType, category: '' }));
                  setShowCategoryMenu(false);
                }}
                style={{
                  ...dropdownBaseStyle,
                  paddingRight: 28,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Internal transfer</option>
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 10,
                  pointerEvents: 'none',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Category + Amount */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 10
          }}
        >
          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: 12,
                marginBottom: 2,
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              Category
            </label>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                disabled={isTransfer}
                onClick={() => !isTransfer && setShowCategoryMenu((v) => !v)}
                style={{
                  ...dropdownBaseStyle,
                  cursor: isTransfer ? 'default' : 'pointer',
                  border: isTransfer
                    ? darkMode
                      ? '1px solid #374151'
                      : '1px solid #e5e7eb'
                    : dropdownBaseStyle.border,
                  background: isTransfer
                    ? darkMode
                      ? '#020617'
                      : '#f9fafb'
                    : dropdownBaseStyle.background
                }}
              >
                <span
                  style={{
                    color: isTransfer
                      ? darkMode
                        ? '#6b7280'
                        : '#6b7280'
                      : form.category
                      ? darkMode
                        ? '#f9fafb'
                        : '#111827'
                      : darkMode
                      ? '#9ca3af'
                      : '#9ca3af'
                  }}
                >
                  {isTransfer
                    ? 'Internal transfer'
                    : form.category || 'Select category'}
                </span>
                {!isTransfer && (
                  <span
                    style={{
                      fontSize: 10,
                      color: darkMode ? '#9ca3af' : '#6b7280'
                    }}
                  >
                    ▾
                  </span>
                )}
              </button>

              {showCategoryMenu && !isTransfer && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    borderRadius: 10,
                    background: darkMode ? '#020617' : '#ffffff',
                    border: darkMode
                      ? '1px solid rgba(55,65,81,0.9)'
                      : '1px solid rgba(209,213,219,1)',
                    boxShadow: '0 18px 40px rgba(15,23,42,0.45)',
                    maxHeight: 220,
                    overflowY: 'auto',
                    zIndex: 30
                  }}
                >
                  {currentCategoryList.map((c) => (
                    <div
                      key={c}
                      className="why-dropdown-option"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, category: c }));
                        setShowCategoryMenu(false);
                      }}
                      onMouseEnter={() => setHoveredCategory(c)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      style={{
                        padding: '6px 10px 6px 12px',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background:
                          form.category === c || hoveredCategory === c
                            ? darkMode
                              ? 'rgba(30,64,175,0.35)'
                              : '#fef3c7'
                            : 'transparent',
                        color: darkMode ? '#e5e7eb' : '#111827'
                      }}
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(
                            c,
                            form.type === 'income' ? 'income' : 'expense'
                          );
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#b91c1c',
                          fontSize: 12,
                          cursor: 'pointer',
                          padding: '2px 4px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <div
                    onClick={() => {
                      addCategory(form.type); // 'income' or 'expense'
                      setShowCategoryMenu(false);
                    }}
                    className="why-dropdown-option"
                    style={{
                      padding: '6px 10px 8px 12px',
                      fontSize: 13,
                      cursor: 'pointer',
                      borderTop: darkMode
                        ? '1px solid rgba(31,41,55,0.9)'
                        : '1px solid rgba(229,231,235,1)',
                      color: darkMode ? '#facc15' : '#b45309',
                      background: darkMode ? '#020617' : '#fff7ed'
                    }}
                  >
                    + Add category
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: 12,
                marginBottom: 2,
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                backgroundColor: darkMode ? '#020617' : '#ffffff',
                color: darkMode ? '#f9fafb' : '#111827',
                fontSize: 13
              }}
            />
          </div>
        </div>

        {/* Row 3: Description + Account / From-To */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 10
          }}
        >
          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: 12,
                marginBottom: 2,
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              Description
            </label>
            <input
              placeholder="Optional note"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                backgroundColor: darkMode ? '#020617' : '#ffffff',
                color: darkMode ? '#f9fafb' : '#111827',
                fontSize: 13
              }}
            />
          </div>

          {/* Account / From-To */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: 12,
                marginBottom: 2,
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              {isTransfer ? 'From / To accounts' : 'Account'}
            </label>

            {isTransfer ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* From */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.fromAccountId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        fromAccountId: e.target.value
                      }))
                    }
                    style={{
                      ...dropdownBaseStyle,
                      paddingRight: 28,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        From: {acc.name} ({acc.currency})
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 10,
                      pointerEvents: 'none',
                      color: darkMode ? '#9ca3af' : '#6b7280'
                    }}
                  >
                    ▾
                  </span>
                </div>

                {/* To */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.toAccountId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        toAccountId: e.target.value
                      }))
                    }
                    style={{
                      ...dropdownBaseStyle,
                      paddingRight: 28,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        To: {acc.name} ({acc.currency})
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 10,
                      pointerEvents: 'none',
                      color: darkMode ? '#9ca3af' : '#6b7280'
                    }}
                  >
                    ▾
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <select
                  value={form.accountId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, accountId: e.target.value }))
                  }
                  style={{
                    ...dropdownBaseStyle,
                    paddingRight: 28,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 10,
                    pointerEvents: 'none',
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}
                >
                  ▾
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4
          }}
        >
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowCategoryMenu(false);
            }}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              border: 'none',
              fontSize: 12,
              background: darkMode ? '#374151' : '#e5e7eb',
              color: darkMode ? '#e5e7eb' : '#111827',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>

          <button
            type="submit"
            style={{
              padding: '9px 18px',
              borderRadius: 999,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              color: '#111827',
              boxShadow:
                '0 14px 30px rgba(249,115,22,0.45), 0 0 0 1px rgba(180,83,9,0.5)',
              cursor: 'pointer'
            }}
          >
            {form.type === 'transfer'
              ? 'Save transfer'
              : form.id
              ? 'Update transaction'
              : 'Save transaction'}
          </button>
        </div>
      </form>
    </div>
  );

  // ---------- Main render ----------
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top: form */}
      {renderTransactionForm()}

      {/* Below: transactions list */}
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
          <div style={{ fontSize: 14, fontWeight: 600 }}>Transactions</div>
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
                    maxHeight: 260,
                    overflowY: 'auto'
                  }}
                >
                  {/* Expenses */}
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
                                textAlign:
                                  h === 'Amount' ? 'right' : 'left',
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
                                color: darkMode
                                  ? '#6b7280'
                                  : '#9ca3af'
                              }}
                            >
                              -
                            </td>
                          </tr>
                        )}
                        {expenseItems.map((t, idx) => {
                          const acc =
                            accounts.find(
                              (a) => a.id === t.accountId
                            ) || accounts[0];
                          return (
                            <tr
                              key={t.id}
                              style={{
                                background: darkMode
                                  ? '#020617'
                                  : '#ffffff',
                                borderBottom: darkMode
                                  ? '1px solid rgba(31,41,55,0.9)'
                                  : '1px solid rgba(243,244,246,1)'
                              }}
                            >
                              <td style={{ padding: '4px 6px' }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
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
                                {t.amount.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  }
                                )}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
                                {t.description || '-'}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
                                {t.category || '-'}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
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
                                  onClick={() =>
                                    onDeleteTx(t.id)
                                  }
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

                  {/* Income */}
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
                                textAlign:
                                  h === 'Amount' ? 'right' : 'left',
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
                                color: darkMode
                                  ? '#6b7280'
                                  : '#9ca3af'
                              }}
                            >
                              -
                            </td>
                          </tr>
                        )}
                        {incomeItems.map((t, idx) => {
                          const acc =
                            accounts.find(
                              (a) => a.id === t.accountId
                            ) || accounts[0];
                          return (
                            <tr
                              key={t.id}
                              style={{
                                background: darkMode
                                  ? '#020617'
                                  : '#ffffff',
                                borderBottom: darkMode
                                  ? '1px solid rgba(31,41,55,0.9)'
                                  : '1px solid rgba(243,244,246,1)'
                              }}
                            >
                              <td style={{ padding: '4px 6px' }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
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
                                {t.amount.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  }
                                )}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
                                {t.description || '-'}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
                                {t.category || '-'}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
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
                                  onClick={() =>
                                    onDeleteTx(t.id)
                                  }
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
    </div>
  );
}

export default TransactionsTab;
