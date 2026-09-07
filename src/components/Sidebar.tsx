import React, { useState, useRef, useEffect } from 'react';
import { NavPath } from '../types';

interface SidebarProps {
  currentPath: NavPath;
  onNavigate: (path: NavPath) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onToggleMobile?: () => void;
}

type NavItem = { path: NavPath; label: string; icon: string };

const ALL_NAV: NavItem[] = [
  { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: 'portal-verification', label: 'Verification', icon: 'verified' },
  { path: 'tenders', label: 'Tenders', icon: 'gavel' },
  { path: 'bidders', label: 'Bidders', icon: 'corporate_fare' },
  { path: 'reports', label: 'Reports', icon: 'analytics' },
  { path: 'ai-verification', label: 'AI Verification', icon: 'verified_user' },
  { path: 'compliance-checks', label: 'Compliance', icon: 'fact_check' },
  { path: 'risk-analysis', label: 'Risk Analysis', icon: 'shield' },
  { path: 'bid-comparison', label: 'Comparison', icon: 'compare_arrows' },
  { path: 'audit-trail', label: 'Audit Trail', icon: 'history_edu' },
  { path: 'settings', label: 'Settings', icon: 'settings' },
];

const PRIMARY = ALL_NAV.slice(0, 5);
const MORE = ALL_NAV.slice(5);

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onToggleMobile,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isMoreActive = MORE.some((i) => i.path === currentPath);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <>
      {/* Top Navbar — calm, premium, full width */}
      <nav
        id="app-sidebar"
        className="fixed top-0 left-0 right-0 h-navbar-height bg-surface-container-lowest border-b border-outline-variant/15 z-50 flex items-center justify-between px-4 lg:px-6"
        aria-label="Primary navigation"
      >
        {/* Left: brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate('portal-verification')}
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uuuf1bx1P3fo-HQjqRf5touMkFSJyiUxs2gSBpCe3M_S4aoQSrHFi2DTiHQCDaokrji_tlIC2brO55KYP8m_dQcxUO6oH2-FvKuSGx83DsgL5QKSgRe4-lhAK-xXTjNgFWBR_UfzEZJpOx4Y1JEJ_Tdmo6F_wgJk2MpGaAca1v4h9jzNLdUayF94R0MDLAqd27jDRaQYWciiaqxPT5XBj2_3knht-YCdClnjXYahCCbUdS71nt4o5unGE"
              alt="BidSure AI"
              className="h-7 w-auto object-contain rounded-sm"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-title-md text-on-surface font-bold tracking-tight text-[13px]">BidSure AI</span>
              <span className="font-label-sm text-secondary font-medium tracking-widest text-[10px] uppercase -mt-0.5">SIH 26100</span>
            </div>
          </div>
        </div>

        {/* Center: desktop nav — quiet, spacious */}
        <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-center px-6">
          {PRIMARY.map((item) => {
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                id={`nav-${item.path}`}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-surface-container text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-1 transition-colors ${
                isMoreActive || moreOpen
                  ? 'bg-surface-container text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70'
              }`}
            >
              More
              <span className="material-symbols-outlined text-[16px]">{moreOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            {moreOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50">
                {MORE.map((item) => {
                  const active = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        onNavigate(item.path);
                        setMoreOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container transition-colors flex items-center gap-2 ${
                        active ? 'text-on-surface font-semibold bg-surface-container/60' : 'text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] opacity-70">{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: hamburger (mobile only) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => (onToggleMobile ? onToggleMobile() : onCloseMobile?.())}
            className="lg:hidden p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
            aria-label={isOpenMobile ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpenMobile}
          >
            <span className="material-symbols-outlined text-[22px]">{isOpenMobile ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 top-navbar-height bg-black/30 z-40 lg:hidden" onClick={onCloseMobile} aria-hidden />
      )}

      {/* Mobile panel — spacious, quiet */}
      <div
        className={`fixed left-0 right-0 top-navbar-height bg-surface-container-lowest border-b border-outline-variant/15 shadow-lg z-40 lg:hidden transition-transform duration-200 ease-out ${
          isOpenMobile ? 'translate-y-0' : '-translate-y-[110%] pointer-events-none'
        }`}
        aria-hidden={!isOpenMobile}
      >
        <div className="px-4 py-4 max-h-[min(72vh,560px)] overflow-y-auto">
          <nav className="flex flex-col">
            {ALL_NAV.map((item) => {
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  id={`nav-mobile-${item.path}`}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    onCloseMobile?.();
                  }}
                  className={`flex items-center gap-3 px-3 py-3.5 text-left rounded-xl transition-colors ${
                    active ? 'bg-surface-container text-on-surface font-semibold' : 'text-on-surface-variant hover:bg-surface-container/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] opacity-80">{item.icon}</span>
                  <span className="text-[14px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
