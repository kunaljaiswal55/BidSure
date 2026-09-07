import React, { useState, useRef, useEffect } from 'react';
import { Tender } from '../types';

interface HeaderProps {
  tenders: Tender[];
  activeTender: Tender;
  onSelectTender: (tender: Tender) => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tenders,
  activeTender,
  onSelectTender,
  onOpenMobileMenu
}) => {
  const [tenderMenuOpen, setTenderMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const tenderDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tenderDropdownRef.current && !tenderDropdownRef.current.contains(event.target as Node)) {
        setTenderMenuOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-sidebar-width-expanded right-0 h-header-height bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-md lg:px-gutter-lg border-b border-outline-variant/20">
      {/* Left side items */}
      <div className="flex items-center gap-gutter-sm lg:gap-gutter-md">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg"
          aria-label="Open sidebar menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Primary SIH Badge */}
        <div className="flex items-center gap-gutter-xs px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wide font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[16px]">security</span>
          <span className="truncate max-w-[190px] sm:max-w-none">SIH 26100 | GeM Procurement Intelligence</span>
        </div>

        {/* Sandbox Active Pill */}
        <div className="hidden xl:flex items-center gap-gutter-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>Demo / Simulated Government APIs Active</span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-gutter-md">
        {/* Tender Selector Dropdown */}
        <div className="relative" ref={tenderDropdownRef}>
          <button
            type="button"
            onClick={() => setTenderMenuOpen(!tenderMenuOpen)}
            className="flex items-center gap-gutter-xs bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-lg text-on-surface font-code-num text-code-num border border-outline-variant/30 transition-all text-left"
            id="tender-selector-btn"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">swap_horiz</span>
            <span className="font-semibold">{activeTender.code}</span>
            <span className="hidden md:inline text-on-surface-variant font-body-sm text-body-sm truncate max-w-[200px] lg:max-w-[320px]">
              - {activeTender.title}
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              {tenderMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Tender Dropdown Menu */}
          {tenderMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-outline-variant/20 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Select Active GeM Tender
              </div>
              <div className="max-h-64 overflow-y-auto">
                {tenders.map((tender) => (
                  <button
                    key={tender.id}
                    onClick={() => {
                      onSelectTender(tender);
                      setTenderMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-surface-container transition-colors flex flex-col gap-0.5 ${
                      tender.id === activeTender.id ? 'bg-secondary-fixed/30 border-l-2 border-secondary' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-code-num text-xs font-bold text-on-surface">{tender.code}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                        {tender.estimatedValue}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface font-medium line-clamp-1">{tender.title}</span>
                    <span className="text-[11px] text-on-surface-variant">{tender.department}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            aria-label="Notifications"
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUnreadCount(0);
            }}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors relative"
            id="notifications-btn"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse"></span>
            )}
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface uppercase tracking-wider">
                  Sovereign Alerts & Flags
                </span>
                <span className="text-[11px] text-secondary font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/20 text-left">
                <div className="p-3 hover:bg-surface-container/60 transition-colors flex gap-2.5">
                  <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">DPIIT MII Local Content Discrepancy</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Apex Tech Solutions declared 42% local content; minimum 50% required for Class-I preference.
                    </p>
                    <span className="text-[10px] text-on-surface-variant font-code-num">2 mins ago · Tender GEM/2026/INF/001</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-surface-container/60 transition-colors flex gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">DigiLocker Batch Verified</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      8 statutory certificates validated with SHA-256 digital signature from Root CA.
                    </p>
                    <span className="text-[10px] text-on-surface-variant font-code-num">12 mins ago</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-surface-container/60 transition-colors flex gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">wifi_tethering</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Heartbeat Synchronized</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      All 13 government portal APIs reporting responsive (Avg Latency: 178ms).
                    </p>
                    <span className="text-[10px] text-on-surface-variant font-code-num">25 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Officer Clearance Profile Strip */}
        <div className="flex items-center gap-gutter-sm pl-gutter-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-label-md text-label-md text-on-surface font-semibold">R. Sharma (JS-Proc.)</span>
            <span className="font-label-sm text-label-sm text-secondary">Procurement Officer</span>
          </div>
          <div
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-xs cursor-pointer"
            title="Procurement Officer Clearance Node"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
