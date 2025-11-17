// /desktop/budget-app/client/src/App.js

import { useEffect, useState } from 'react';
import OverviewTab from './tabs/OverviewTab';
import TransactionsTab from './tabs/TransactionsTab';
import ZakathTab from './tabs/ZakathTab';
import InvestmentsTab from './tabs/InvestmentsTab';
import LoansTab from './tabs/LoansTab';
import SplitTab from './tabs/SplitTab';

function App() {
  const mustard = '#f5b300';
  const darkBg = '#020617';

  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // auth
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('create');
  const [authEmail, setAuthEmail] = useState('');
  const [authStage, setAuthStage] = useState('email');
  const [authOtp, setAuthOtp] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUsername, setProfileUsername] = useState('');

  // main accounts
  const [accounts, setAccounts] = useState(() => {
    const stored = window.localStorage.getItem('why_accounts');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return [
      { id: 'acc-bank-1', name: 'Main Bank', currency: 'AED', type: 'bank', mandatory: true },
      { id: 'acc-cash', name: 'Cash', currency: 'AED', type: 'cash', mandatory: true }
    ];
  });

  // savings accounts
  const [savingsAccounts, setSavingsAccounts] = useState(() => {
    const stored = window.localStorage.getItem('why_savings_accounts');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem('why_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    window.localStorage.setItem('why_savings_accounts', JSON.stringify(savingsAccounts));
  }, [savingsAccounts]);

  // categories
  const [incomeCategories, setIncomeCategories] = useState(() => {
    const stored = window.localStorage.getItem('why_income_categories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return ['Salary', 'Bonus', 'Business', 'Other income'];
  });

  const [expenseCategories, setExpenseCategories] = useState(() => {
    const stored = window.localStorage.getItem('why_expense_categories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return ['Rent', 'Groceries', 'Utilities', 'Transport', 'Other expense'];
  });

  useEffect(() => {
    window.localStorage.setItem('why_income_categories', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  useEffect(() => {
    window.localStorage.setItem('why_expense_categories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  // transactions
  const [transactions, setTransactions] = useState([]);
  const [collapsedMonths, setCollapsedMonths] = useState({});

  // transaction form (NOW USED ONLY IN TransactionsTab)
  const [form, setForm] = useState({
    id: null,
    date: '',
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    accountId: 'acc-bank-1',
    fromAccountId: 'acc-bank-1',
    toAccountId: 'acc-cash'
  });

  const [accountEditMode, setAccountEditMode] = useState(false);
  const [savingsEditMode, setSavingsEditMode] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // load user
  useEffect(() => {
    const raw = window.localStorage.getItem('why_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  // fetch transactions
  useEffect(() => {
    fetch('https://why-finance-wing-server.onrender.com/api/transactions')
      .then((r) => r.json())
      .then(setTransactions)
      .catch(() => {});
  }, []);

  // derived balances
  const accountBalances = accounts.map((acc) => {
    const accTx = transactions.filter((t) => t.accountId === acc.id);
    const inc = accTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = accTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { ...acc, income: inc, expense: exp, net: inc - exp };
  });

  const savingsBalances = savingsAccounts.map((acc) => {
    const accTx = transactions.filter((t) => t.accountId === acc.id);
    const inc = accTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = accTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { ...acc, income: inc, expense: exp, net: inc - exp };
  });

  const allSelectableAccounts = [...accounts, ...savingsAccounts.map((s) => ({ ...s, type: 'savings' }))];

  // accounts
  const onAddAccount = () => {
    const name = window.prompt('Account name?');
    if (!name) return;
    const currency = window.prompt('Currency?') || 'AED';
    setAccounts((prev) => [...prev, {
      id: 'acc-' + Date.now(),
      name: name.trim(),
      currency: currency.trim().toUpperCase(),
      type: 'bank',
      mandatory: false
    }]);
  };

  const onEditAccount = (acc) => {
    const newName = window.prompt('New account name', acc.name);
    if (!newName) return;
    const newCurr = window.prompt('Currency', acc.currency) || acc.currency;
    setAccounts((prev) =>
      prev.map((a) => (a.id === acc.id ? { ...a, name: newName.trim(), currency: newCurr.trim().toUpperCase() } : a))
    );
  };

  const onDeleteAccount = (acc) => {
    if (acc.mandatory) return alert('Cannot delete mandatory account.');
    const bankCount = accounts.filter((a) => a.type === 'bank').length;
    if (acc.type === 'bank' && bankCount <= 1) return alert('At least one bank must remain.');
    if (!window.confirm(`Delete account "${acc.name}"?`)) return;
    setAccounts((prev) => prev.filter((a) => a.id !== acc.id));
  };

  // savings
  const onAddSavings = () => {
    const name = window.prompt('Savings name?');
    if (!name) return;
    const currency = window.prompt('Currency?') || 'AED';
    setSavingsAccounts((prev) => [...prev, {
      id: 'sav-' + Date.now(),
      name: name.trim(),
      currency: currency.trim().toUpperCase(),
      type: 'savings',
      mandatory: false
    }]);
  };

  const onEditSavings = (acc) => {
    const newName = window.prompt('New savings name', acc.name);
    if (!newName) return;
    const newCurr = window.prompt('Currency', acc.currency) || acc.currency;
    setSavingsAccounts((prev) =>
      prev.map((a) => (a.id === acc.id ? { ...a, name: newName.trim(), currency: newCurr.trim().toUpperCase() } : a))
    );
  };

  const onDeleteSavings = (acc) => {
    if (!window.confirm(`Delete savings "${acc.name}"?`)) return;
    setSavingsAccounts((prev) => prev.filter((a) => a.id !== acc.id));
  };

  // categories
  const addCategory = (type) => {
    const name = window.prompt('New category?');
    if (!name) return;
    if (type === 'income') {
      if (incomeCategories.includes(name.trim())) return;
      setIncomeCategories((prev) => [...prev, name.trim()]);
    } else {
      if (expenseCategories.includes(name.trim())) return;
      setExpenseCategories((prev) => [...prev, name.trim()]);
    }
  };

  const removeCategory = (cat, type) => {
    if (!window.confirm(`Remove category "${cat}"?`)) return;
    if (type === 'income') setIncomeCategories((prev) => prev.filter((c) => c !== cat));
    else setExpenseCategories((prev) => prev.filter((c) => c !== cat));
  };

  // transactions CRUD
  const resetForm = () => {
    setForm({
      id: null,
      date: '',
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      accountId: 'acc-bank-1',
      fromAccountId: 'acc-bank-1',
      toAccountId: 'acc-cash'
    });
  };

  const handleSubmitTx = async (e) => {
    e.preventDefault();
    if (!form.date || !form.amount) return;

    // transfer
    if (form.type === 'transfer') {
      const fromId = form.fromAccountId;
      const toId = form.toAccountId;
      if (!fromId || !toId || fromId === toId) {
        alert('Invalid transfer.');
        return;
      }
      const amountNum = Number(form.amount);
      if (!amountNum || amountNum <= 0) return;

      const out = {
        date: form.date,
        type: 'expense',
        category: 'Internal transfer',
        amount: amountNum,
        description: form.description || 'Internal transfer',
        accountId: fromId
      };

      const inc = {
        date: form.date,
        type: 'income',
        category: 'Internal transfer',
        amount: amountNum,
        description: form.description || 'Internal transfer',
        accountId: toId
      };

      const r1 = await fetch('https://why-finance-wing-server.onrender.com/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(out)
      });
      const newOut = await r1.json();

      const r2 = await fetch('https://why-finance-wing-server.onrender.com/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inc)
      });
      const newIn = await r2.json();

      setTransactions((prev) => [...prev, newOut, newIn]);
      resetForm();
      return;
    }

    if (!form.category) return;

    const body = {
      date: form.date,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      accountId: form.accountId
    };

    if (form.id) {
      const r = await fetch(`https://why-finance-wing-server.onrender.com/api/transactions/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const updated = await r.json();
      setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const r = await fetch('https://why-finance-wing-server.onrender.com/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const newTx = await r.json();
      setTransactions((prev) => [...prev, newTx]);
    }

    resetForm();
  };

  const onEditTx = (tx) => {
    setActiveTab('transactions'); // now edit inside transactions tab
    setForm({
      id: tx.id,
      date: tx.date || '',
      type: tx.type,
      category: tx.category || '',
      amount: String(tx.amount),
      description: tx.description || '',
      accountId: tx.accountId || 'acc-bank-1',
      fromAccountId: 'acc-bank-1',
      toAccountId: 'acc-cash'
    });
  };

  const onDeleteTx = async (id) => {
    await fetch(`https://why-finance-wing-server.onrender.com/api/transactions/${id}`, {
      method: 'DELETE'
    });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleMonthCollapse = (monthKey) => {
    setCollapsedMonths((prev) => ({ ...prev, [monthKey]: !prev[monthKey] }));
  };

  // auth
  const startAuth = (mode) => {
    setAuthMode(mode);
    setAuthStage('email');
    setAuthEmail('');
    setAuthOtp('');
    setShowAuthModal(true);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!authEmail) return;
    await fetch('https://why-finance-wing-server.onrender.com/api/users/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail })
    });
    setAuthStage('otp');
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!authEmail || !authOtp) return;
    const r = await fetch('https://why-finance-wing-server.onrender.com/api/users/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail, otp: authOtp })
    });
    if (!r.ok) return;
    const u = await r.json();
    setUser(u);
    window.localStorage.setItem('why_user', JSON.stringify(u));
    setShowAuthModal(false);
  };

  const openProfileModal = () => {
    if (!user) return;
    setProfileUsername(user.username || '');
    setShowProfileModal(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    const r = await fetch('https://why-finance-wing-server.onrender.com/api/users/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, username: profileUsername })
    });
    if (!r.ok) return;
    const updated = await r.json();
    setUser(updated);
    window.localStorage.setItem('why_user', JSON.stringify(updated));
    setShowProfileModal(false);
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('why_user');
    setShowProfileMenu(false);
  };

  const welcomeName = user ? user.username || user.email : 'Guest';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'zakath', label: 'Zakath' },
    { id: 'investments', label: 'Investments' },
    { id: 'loans', label: 'Loans' },
    { id: 'split', label: 'Split' }
  ];

  // loading screen
  if (loading) {
    return (
      <>
        <style>{`
          body {
            background: radial-gradient(circle at top, #0b1120 0, #020617 50%, #000 100%);
            font-family: system-ui;
          }
        `}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div
            style={{
              maxWidth: 720, width: '100%', borderRadius: 24, padding: 32,
              border: '1px solid rgba(248,250,252,0.08)',
              background: 'radial-gradient(circle at top, rgba(15,23,42,0.9), rgba(15,23,42,0.98))',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              color: '#f9fafb', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', inset: '-40%', opacity: 0.15,
              background: 'radial-gradient(circle at top, #fbbf24, transparent 55%)'
            }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 32, marginBottom: 16, color: '#fef9c3',
                fontFamily: '"Traditional Arabic"', letterSpacing: 1 }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#facc15' }}>
                “Charity does not decrease wealth.”
              </div>
              <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 24 }}>— Prophet Muhammad ﷺ</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>Loading Why? Community · Budget Tracker...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        body {
          background: ${
            darkMode
              ? 'radial-gradient(circle at top, #0f172a 0, #020617 45%, #000 100%)'
              : 'radial-gradient(circle at top, #fef3c7 0, #f9fafb 45%, #e5e7eb 100%)'
          };
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }
        @keyframes wiggle {
          0% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
          100% { transform: translateY(0); }
        }
        .profile-menu-item:hover {
          background: ${darkMode ? 'rgba(31,41,55,0.95)' : '#f3f4f6'};
        }
        .why-dropdown-option:hover {
          background: ${darkMode ? 'rgba(30,64,175,0.35)' : '#fef3c7'};
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${darkMode ? 'invert(1)' : 'invert(0)'};
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '16px 8px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '100%',
            borderRadius: 24,
            padding: 20,
            background: darkMode ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.96)',
            boxShadow: darkMode ? '0 24px 60px rgba(0,0,0,0.65)' : '0 18px 45px rgba(15,23,42,0.18)',
            border: darkMode ? '1px solid rgba(30,64,175,0.8)' : '1px solid rgba(209,213,219,0.9)',
            color: darkMode ? '#f9fafb' : '#111827',
            display: 'flex', flexDirection: 'column',
            maxHeight: 'calc(100vh - 32px)'
          }}
        >
          {/* HEADER */}
          <header
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '4px 4px 12px', borderBottom: darkMode ? '1px solid rgba(31,41,55,0.9)' : '1px solid rgba(229,231,235,0.9)',
              marginBottom: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => alert('Home link later')}
                style={{
                  width: 40, height: 40, borderRadius: 12, background: mustard,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: darkBg, border: 'none', cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(245,179,0,0.45)'
                }}
              >
                W?
              </button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Why? Finance Wing</div>
                <div style={{ fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  Click the logo to go home (coming soon)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280' }}>
                Welcome, {welcomeName}
              </span>

              {/* dark mode toggle */}
              <button
                onClick={() => setDarkMode((v) => !v)}
                style={{ position: 'relative', width: 65, height: 26, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              >
                <div
                  style={{
                    position: 'absolute', inset: 2, borderRadius: 999,
                    background: darkMode ? '#020617' : '#e5e7eb',
                    boxShadow: darkMode ? '0 0 0 1px rgba(75,85,99,0.9)' : '0 0 0 1px rgba(209,213,219,1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600, color: darkMode ? '#e5e7eb' : '#374151'
                  }}
                >
                  <span style={{ width: '100%', textAlign: darkMode ? 'left' : 'right', paddingLeft: darkMode ? 8 : 0, paddingRight: darkMode ? 0 : 5 }}>
                    {darkMode ? 'Dark' : 'Light'}
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute', top: 2, left: darkMode ? 40 : 3,
                    width: 22, height: 22, borderRadius: '50%',
                    background: darkMode ? mustard : '#111827',
                    color: darkMode ? '#111827' : '#f9fafb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, transition: 'left 0.15s ease'
                  }}
                >
                  {darkMode ? '⏾' : '☀︎'}
                </div>
              </button>

              {/* profile */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu((v) => !v)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', border: 'none',
                    cursor: 'pointer',
                    background: darkMode ? 'radial-gradient(circle at top, #1f2937, #020617)' : 'radial-gradient(circle at top, #f9fafb, #e5e7eb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: darkMode ? '0 8px 18px rgba(0,0,0,0.7)' : '0 8px 18px rgba(148,163,184,0.7)',
                    color: darkMode ? '#e5e7eb' : '#111827',
                    fontWeight: 600, fontSize: 14
                  }}
                >
                  {user ? (user.username || user.email || 'U')[0].toUpperCase() : 'U'}
                </button>

                {showProfileMenu && (
                  <div
                    style={{
                      position: 'absolute', right: 0, marginTop: 6, minWidth: 160,
                      borderRadius: 12, background: darkMode ? '#020617' : '#ffffff',
                      boxShadow: '0 18px 40px rgba(15,23,42,0.55)', padding: 6, fontSize: 13, zIndex: 10
                    }}
                  >
                    {!user && (
                      <>
                        <button
                          onClick={() => { setShowProfileMenu(false); startAuth('create'); }}
                          className="profile-menu-item"
                          style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: darkMode ? '#e5e7eb' : '#111827' }}
                        >
                          Create user
                        </button>
                        <button
                          onClick={() => { setShowProfileMenu(false); startAuth('login'); }}
                          className="profile-menu-item"
                          style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: darkMode ? '#e5e7eb' : '#111827' }}
                        >
                          Login
                        </button>
                      </>
                    )}

                    {user && (
                      <>
                        <button
                          onClick={() => { setShowProfileMenu(false); openProfileModal(); }}
                          className="profile-menu-item"
                          style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: darkMode ? '#e5e7eb' : '#111827' }}
                        >
                          Profile
                        </button>
                        <button
                          onClick={logout}
                          className="profile-menu-item"
                          style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#f97316' }}
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* MAIN SCROLL AREA */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingBottom: 8 }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Budget Tracker</div>
                <div style={{ fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  Focus on meaningful spending
                </div>
              </div>
              <img
                src="/Bismillah.svg"
                alt="Bismillah"
                style={{
                  height: 40, opacity: darkMode ? 0.95 : 0.9,
                  filter: darkMode
                    ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.7))'
                    : 'drop-shadow(0 3px 8px rgba(148,163,184,0.8))'
                }}
              />
            </div>

            {/* TABS */}
            <div
              style={{
                display: 'flex', gap: 8,
                borderBottom: darkMode ? '1px solid rgba(31,41,55,0.9)' : '1px solid rgba(229,231,235,0.9)',
                marginBottom: 12
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 999, border: 'none',
                    cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    background: activeTab === t.id ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'transparent',
                    color: activeTab === t.id ? '#111827' : darkMode ? '#9ca3af' : '#6b7280',
                    boxShadow: activeTab === t.id ? '0 10px 20px rgba(249,115,22,0.45)' : 'none',
                    marginBottom: -1
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'overview' && (
              <OverviewTab
                darkMode={darkMode}
                mustard={mustard}
                accounts={accounts}
                savingsAccounts={savingsAccounts}
                accountBalances={accountBalances}
                savingsBalances={savingsBalances}

                accountEditMode={accountEditMode}
                setAccountEditMode={setAccountEditMode}
                savingsEditMode={savingsEditMode}
                setSavingsEditMode={setSavingsEditMode}

                onAddAccount={onAddAccount}
                onEditAccount={onEditAccount}
                onDeleteAccount={onDeleteAccount}
                onAddSavings={onAddSavings}
                onEditSavings={onEditSavings}
                onDeleteSavings={onDeleteSavings}

                incomeCategories={incomeCategories}
                expenseCategories={expenseCategories}
                transactions={transactions}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsTab
                darkMode={darkMode}
                transactions={transactions}
                accounts={allSelectableAccounts}
                collapsedMonths={collapsedMonths}
                toggleMonthCollapse={toggleMonthCollapse}
                onEditTx={onEditTx}
                onDeleteTx={onDeleteTx}

                form={form}
                setForm={setForm}
                handleSubmitTx={handleSubmitTx}
                resetForm={resetForm}
                incomeCategories={incomeCategories}
                expenseCategories={expenseCategories}
                addCategory={addCategory}
                removeCategory={removeCategory}
              />
            )}

            {activeTab === 'zakath' && <ZakathTab darkMode={darkMode} mustard={mustard} />}
            {activeTab === 'investments' && <InvestmentsTab darkMode={darkMode} mustard={mustard} />}
            {activeTab === 'loans' && <LoansTab darkMode={darkMode} mustard={mustard} />}
            {activeTab === 'split' && <SplitTab darkMode={darkMode} mustard={mustard} />}
          </div>

          {/* FOOTER */}
          <footer
            style={{
              paddingTop: 8,
              borderTop: darkMode ? '1px solid rgba(31,41,55,0.9)' : '1px solid rgba(229,231,235,0.9)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280', marginTop: 4
            }}
          >
            <div>© {new Date().getFullYear()} Why? Community · Budget Tracker</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>Personal budget tool</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: mustard, boxShadow: '0 0 0 4px rgba(245,179,0,0.25)' }} />
            </div>
          </footer>
        </div>
      </div>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 420, borderRadius: 20, padding: 20,
              background: darkMode ? '#020617' : '#ffffff',
              color: darkMode ? '#f9fafb' : '#111827',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              border: darkMode ? '1px solid rgba(55,65,81,0.9)' : '1px solid rgba(209,213,219,1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {authMode === 'create' ? 'Create user' : 'Login'}
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: darkMode ? '#9ca3af' : '#6b7280' }}
              >
                ×
              </button>
            </div>

            {authStage === 'email' && (
              <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 12, marginBottom: 2, color: '#6b7280' }}>Email</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }}
                    placeholder="you@example.com"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px', borderRadius: 999, border: 'none',
                      background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                      color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Send code
                  </button>
                </div>
              </form>
            )}

            {authStage === 'otp' && (
              <form onSubmit={verifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  A verification code was sent to <b>{authEmail}</b>.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 12, marginBottom: 2, color: '#6b7280' }}>Code</label>
                  <input
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value)}
                    style={{
                      padding: '8px 10px', borderRadius: 10, border: '1px solid #e5e7eb',
                      fontSize: 13, letterSpacing: 4
                    }}
                    placeholder="123456"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setAuthStage('email')}
                    style={{ padding: '8px 14px', borderRadius: 999, border: 'none', background: '#e5e7eb', color: '#111827', fontSize: 13 }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px', borderRadius: 999, border: 'none',
                      background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                      color: '#111827', fontSize: 13, fontWeight: 600
                    }}
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 420, borderRadius: 20, padding: 20,
              background: darkMode ? '#020617' : '#ffffff',
              color: darkMode ? '#f9fafb' : '#111827',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              border: darkMode ? '1px solid rgba(55,65,81,0.9)' : '1px solid rgba(209,213,219,1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Profile</div>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: darkMode ? '#9ca3af' : '#6b7280' }}
              >
                ×
              </button>
            </div>

            {user && (
              <div style={{ fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: 8 }}>
                Email: {user.email}
              </div>
            )}

            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 12, marginBottom: 2, color: '#6b7280' }}>Username (optional)</label>
                <input
                  value={profileUsername}
                  onChange={(e) => setProfileUsername(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }}
                  placeholder="Display name"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 999, border: 'none', background: '#e5e7eb', color: '#111827', fontSize: 13 }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 14px', borderRadius: 999, border: 'none',
                    background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                    color: '#111827', fontSize: 13, fontWeight: 600
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
