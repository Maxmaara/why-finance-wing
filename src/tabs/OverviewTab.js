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
  form,
  setForm,
  handleSubmitTx,
  resetForm,
  allSelectableAccounts,
  currentCategoryList,
  addCategory,
  removeCategory
}) {
  const cardDark = 'rgba(15,23,42,0.98)';
  const cardLight = '#ffffff';

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const isTransfer = form.type === 'transfer';

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Balances
          </div>
          <div
            style={{
              fontSize: 11,
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            Main bank and cash are always required
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12
          }}
        >
          <button
            onClick={() => setAccountEditMode((v) => !v)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 999,
              fontSize: 11,
              color: darkMode ? '#9ca3af' : '#6b7280',
              boxShadow: darkMode
                ? '0 0 0 1px rgba(55,65,81,0.7)'
                : '0 0 0 1px rgba(209,213,219,1)'
            }}
          >
            {accountEditMode ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={onAddAccount}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#111827',
              boxShadow: '0 10px 20px rgba(249,115,22,0.45)'
            }}
            title="Add account"
          >
            +
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 12,
          marginTop: 4
        }}
      >
        {accountBalances
          .filter((acc) => acc.type !== 'savings')
          .map((acc) => (
            <div
              key={acc.id}
              style={{
                padding: 8,
                borderRadius: 10,
                border: darkMode
                  ? '1px solid rgba(55,65,81,0.9)'
                  : '1px solid rgba(209,213,219,1)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600
                  }}
                >
                  {acc.name}
                </div>
                <div
                  style={{
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}
                >
                  {acc.currency}{' '}
                  {acc.type === 'cash'
                    ? '· Cash'
                    : acc.type === 'savings'
                    ? '· Savings'
                    : '· Bank'}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: acc.net >= 0 ? '#16a34a' : '#dc2626'
                  }}
                >
                  {acc.net.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}{' '}
                  {acc.currency}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: 'right',
                  fontSize: 11,
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                <div>
                  In:{' '}
                  <span style={{ color: '#22c55e' }}>
                    {acc.income.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div>
                  Out:{' '}
                  <span style={{ color: '#fb923c' }}>
                    {acc.expense.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>

              {accountEditMode && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    marginLeft: 8,
                    gap: 2
                  }}
                >
                  <button
                    onClick={() => onEditAccount(acc)}
                    style={{
                      border: 'none',
                      background: '#e5e7eb',
                      borderRadius: 999,
                      padding: '2px 6px',
                      fontSize: 10,
                      cursor: 'pointer',
                      animation: 'wiggle 1.2s ease-in-out infinite'
                    }}
                  >
                    ✎
                  </button>
                  {!acc.mandatory && (
                    <button
                      onClick={() => onDeleteAccount(acc)}
                      style={{
                        border: 'none',
                        background: '#fee2e2',
                        borderRadius: 999,
                        padding: '2px 6px',
                        fontSize: 10,
                        cursor: 'pointer',
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
        border: darkMode
          ? '1px solid rgba(55,65,81,0.9)'
          : '1px solid rgba(209,213,219,1)',
        color: darkMode ? '#e5e7eb' : '#111827'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Savings
          </div>
          <div
            style={{
              fontSize: 11,
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            Long-term savings and sinking funds
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12
          }}
        >
          <button
            onClick={() => setSavingsEditMode((v) => !v)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 999,
              fontSize: 11,
              color: darkMode ? '#9ca3af' : '#6b7280',
              boxShadow: darkMode
                ? '0 0 0 1px rgba(55,65,81,0.7)'
                : '0 0 0 1px rgba(209,213,219,1)'
            }}
          >
            {savingsEditMode ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={onAddSavings}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#111827',
              boxShadow: '0 10px 20px rgba(249,115,22,0.45)'
            }}
            title="Add savings account"
          >
            +
          </button>
        </div>
      </div>

      {savingsBalances.length === 0 ? (
        <div
          style={{
            fontSize: 12,
            color: darkMode ? '#9ca3af' : '#6b7280',
            paddingTop: 4
          }}
        >
          No savings accounts yet. Click “+” to add your first savings or sinking
          fund.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: 12,
            marginTop: 4
          }}
        >
          {savingsBalances.map((acc) => (
            <div
              key={acc.id}
              style={{
                padding: 8,
                borderRadius: 10,
                border: darkMode
                  ? '1px solid rgba(55,65,81,0.9)'
                  : '1px solid rgba(209,213,219,1)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600
                  }}
                >
                  {acc.name}
                </div>
                <div
                  style={{
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}
                >
                  {acc.currency} · Savings
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: acc.net >= 0 ? '#16a34a' : '#dc2626'
                  }}
                >
                  {acc.net.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}{' '}
                  {acc.currency}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: 'right',
                  fontSize: 11,
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                <div>
                  In:{' '}
                  <span style={{ color: '#22c55e' }}>
                    {acc.income.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div>
                  Out:{' '}
                  <span style={{ color: '#fb923c' }}>
                    {acc.expense.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>

              {savingsEditMode && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    marginLeft: 8,
                    gap: 2
                  }}
                >
                  <button
                    onClick={() => onEditSavings(acc)}
                    style={{
                      border: 'none',
                      background: '#e5e7eb',
                      borderRadius: 999,
                      padding: '2px 6px',
                      fontSize: 10,
                      cursor: 'pointer',
                      animation: 'wiggle 1.2s ease-in-out infinite'
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDeleteSavings(acc)}
                    style={{
                      border: 'none',
                      background: '#fee2e2',
                      borderRadius: 999,
                      padding: '2px 6px',
                      fontSize: 10,
                      cursor: 'pointer',
                      color: '#b91c1c'
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

  const renderTransactionForm = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          background: darkMode ? cardDark : cardLight,
          borderRadius: 18,
          padding: 18,
          border: darkMode
            ? '1px solid rgba(55,65,81,0.9)'
            : '1px solid #e5e7eb',
          color: darkMode ? '#e5e7eb' : '#111827',
          boxShadow: darkMode
            ? '0 18px 40px rgba(0,0,0,0.45)'
            : '0 18px 40px rgba(148,163,184,0.3)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600
            }}
          >
            {form.id ? 'Edit transaction' : 'Add transaction'}
          </div>
        </div>

        <form
          onSubmit={handleSubmitTx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 6
          }}
        >
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
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginBottom: 2
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
                  border: darkMode
                    ? '1px solid #4b5563'
                    : '1px solid #e5e7eb',
                  fontSize: 13,
                  backgroundColor: darkMode ? '#020617' : '#ffffff',
                  color: darkMode ? '#f9fafb' : '#111827'
                }}
              />
            </div>

            {/* Type dropdown (same style) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                style={{
                  fontSize: 12,
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginBottom: 2
                }}
              >
                Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      type: nextType,
                      category: ''
                    }));
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

          {/* Category + Amount */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: 10
            }}
          >
            {/* Category with custom dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                style={{
                  fontSize: 12,
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginBottom: 2
                }}
              >
                Category
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  disabled={isTransfer}
                  onClick={() =>
                    !isTransfer && setShowCategoryMenu((v) => !v)
                  }
                  style={{
                    ...dropdownBaseStyle,
                    border: isTransfer
                      ? darkMode
                        ? '1px solid #374151'
                        : '1px solid #e5e7eb'
                      : dropdownBaseStyle.border,
                    background: isTransfer
                      ? darkMode
                        ? '#020617'
                        : '#f9fafb'
                      : dropdownBaseStyle.background,
                    cursor: isTransfer ? 'default' : 'pointer'
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
                          setForm((prev) => ({
                            ...prev,
                            category: c
                          }));
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
                        addCategory();
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
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginBottom: 2
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
                  border: darkMode
                    ? '1px solid #4b5563'
                    : '1px solid #e5e7eb',
                  fontSize: 13,
                  backgroundColor: darkMode ? '#020617' : '#ffffff',
                  color: darkMode ? '#f9fafb' : '#111827'
                }}
              />
            </div>
          </div>

          {/* Description + Account */}
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
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginBottom: 2
                }}
              >
                Description
              </label>
              <input
                placeholder="Optional note"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: darkMode
                    ? '1px solid #4b5563'
                    : '1px solid #e5e7eb',
                  fontSize: 13,
                  backgroundColor: darkMode ? '#020617' : '#ffffff',
                  color: darkMode ? '#f9fafb' : '#111827'
                }}
              />
            </div>

            {/* Account / From-To */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                style={{
                  fontSize: 12,
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginBottom: 2
                }}
              >
                {isTransfer ? 'From / To accounts' : 'Account'}
              </label>

              {isTransfer ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
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
                      {allSelectableAccounts.map((acc) => (
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
                      {allSelectableAccounts.map((acc) => (
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
                      setForm((prev) => ({
                        ...prev,
                        accountId: e.target.value
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
                    {allSelectableAccounts.map((acc) => (
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
    </div>
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.6fr)',
        gap: 20
      }}
    >
      <div>
        {renderBalancesCard()}
        {renderSavingsCard()}
      </div>
      <div>{renderTransactionForm()}</div>
    </div>
  );
}

export default OverviewTab;
