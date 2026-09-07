import React from 'react';
import { NavPath } from '../types';

interface SidebarProps {
  currentPath: NavPath;
  onNavigate: (path: NavPath) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
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
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 h-full w-sidebar-width-expanded bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Header */}
          <div className="h-header-height px-gutter-md flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
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

            {/* Mobile close button */}
            <button
              className="lg:hidden p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg"
              onClick={onCloseMobile}
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-gutter-sm pt-gutter-sm overflow-y-auto max-h-[calc(100vh-160px)]">
            <nav className="flex flex-col gap-gutter-xs">
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
                    className={`flex items-center gap-gutter-sm px-gutter-sm py-2 transition-colors text-left w-full rounded-lg ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span className="text-[14px]">{item.label}</span>
                    {item.path === 'portal-verification' && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-secondary"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Officer Status */}
        <div className="p-gutter-sm m-gutter-sm bg-surface-container-low rounded-lg border border-outline-variant/30">
          <div className="flex items-center gap-gutter-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse flex-shrink-0"></span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                Procurement Officer Online
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Encrypted Node · GeM SPV
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
