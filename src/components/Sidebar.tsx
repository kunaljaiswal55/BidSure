import React from 'react';
import { NavPath } from '../types';

interface SidebarProps {
  currentPath: NavPath;
  onNavigate: (path: NavPath) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onToggleMobile?: () => void;
}

const NAV_ITEMS: { path: NavPath; label: string; icon: string }[] = [
  { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: 'tenders', label: 'Tenders', icon: 'gavel' },
  { path: 'bidders', label: 'Bidders', icon: 'corporate_fare' },
  { path: 'ai-verification', label: 'AI Verification', icon: 'verified_user' },
  { path: 'compliance-checks', label: 'Compliance Checks', icon: 'fact_check' },
  { path: 'portal-verification', label: 'Portal Verification', icon: 'lan' },
  { path: 'risk-analysis', label: 'Risk Analysis', icon: 'shield' },
  { path: 'bid-comparison', label: 'Bid Comparison', icon: 'compare_arrows' },
  { path: 'reports', label: 'Reports', icon: 'analytics' },
  { path: 'audit-trail', label: 'Audit Trail', icon: 'history_edu' },
  { path: 'settings', label: 'Settings', icon: 'settings' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onToggleMobile
}) => {
  const handleToggle = () => {
    if (onToggleMobile) onToggleMobile();
    else if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Top Navbar – fixed, full width, no overlap with main content */}
      <nav
        id="app-sidebar"
        className="fixed top-0 left-0 right-0 h-navbar-height bg-surface-container-lowest border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-gutter-md lg:px-gutter-lg gap-gutter-sm"
        aria-label="Primary navigation"
      >
        {/* Left: logo */}
        <div className="flex items-center gap-gutter-sm shrink-0">
          <div className="flex items-center gap-gutter-sm cursor-pointer" onClick={() => onNavigate('portal-verification')}>
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uuuf1bx1P3fo-HQjqRf5touMkFSJyiUxs2gSBpCe3M_S4aoQSrHFi2DTiHQCDaokrji_tlIC2brO55KYP8m_dQcxUO6oH2-FvKuSGx83DsgL5QKSgRe4-lhAK-xXTjNgFWBR_UfzEZJpOx4Y1JEJ_Tdmo6F_wgJk2MpGaAca1v4h9jzNLdUayF94R0MDLAqd27jDRaQYWciiaqxPT5XBj2_3knht-YCdClnjXYahCCbUdS71nt4o5unGE"
              alt="BidSure AI Logo"
              className="h-8 w-auto object-contain rounded-sm"
            />
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface tracking-tight leading-none font-bold">
                BidSure AI
              </span>
              <span className="font-label-sm text-label-sm text-secondary leading-tight mt-0.5 font-semibold">
                SIH 26100
              </span>
            </div>
          </div>
        </div>

        {/* Center: horizontal nav – desktop only */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto flex-1 justify-center max-w-[72%] xl:max-w-none px-2">
          <nav className="flex items-center gap-1" aria-label="Desktop navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  id={`nav-${item.path}`}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 transition-colors rounded-full whitespace-nowrap text-[13px] leading-none ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md'
                  }`}
                  title={item.label}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="hidden xl:inline">{item.label}</span>
                  {item.path === 'portal-verification' && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: officer status – desktop only + mobile hamburger */}
        <div className="flex items-center gap-gutter-sm shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-surface-container-low rounded-full border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">Procurement Officer Online</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden 2xl:inline">· Encrypted Node · GeM SPV</span>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg"
            aria-label={isOpenMobile ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpenMobile}
          >
            <span className="material-symbols-outlined text-[22px]">{isOpenMobile ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile backdrop – below navbar, above header/main */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 top-navbar-height bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      {/* Mobile dropdown panel – below navbar, overlays header when open */}
      <div
        className={`fixed left-0 right-0 top-navbar-height bg-surface-container-lowest border-b border-outline-variant/20 shadow-lg z-40 lg:hidden transition-transform duration-200 ease-out ${
          isOpenMobile ? 'translate-y-0' : '-translate-y-[110%] pointer-events-none'
        }`}
        aria-hidden={!isOpenMobile}
      >
        <div className="px-gutter-sm py-gutter-sm max-h-[min(70vh,520px)] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  id={`nav-mobile-${item.path}`}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center gap-gutter-sm px-3 py-2.5 transition-colors text-left w-full rounded-lg ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-[14px]">{item.label}</span>
                  {item.path === 'portal-verification' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-secondary"></span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="mt-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Procurement Officer Online</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Encrypted Node · GeM SPV</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
