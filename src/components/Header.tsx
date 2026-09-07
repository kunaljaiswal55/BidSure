import React, { useState, useRef, useEffect } from 'react';
import { Tender } from '../types';

interface HeaderProps {
  tenders: Tender[];
  activeTender: Tender;
  onSelectTender: (tender: Tender) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ tenders, activeTender, onSelectTender }) => {
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
    <header className="fixed top-navbar-height left-0 right-0 h-header-height bg-surface-container-lowest border-b border-outline-variant/12 z-30 flex items-center justify-between px-4 lg:px-6 w-full max-w-full">
      {/* Left: subtle context — keep empty for whitespace, tender on right is primary */}
      <div className="hidden sm:flex items-center gap-2 text-on-surface-variant text-sm">
        <span className="hidden lg:inline text-xs tracking-wide uppercase font-medium opacity-60">Tender</span>
      </div>

      {/* Right: quiet controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Tender selector — quiet, no heavy border */}
        <div className="relative" ref={tenderDropdownRef}>
          <button
            type="button"
            onClick={() => setTenderMenuOpen(!tenderMenuOpen)}
            className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-sm transition-colors"
            id="tender-selector-btn"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">swap_horiz</span>
            <span className="font-code-num text-[12px] font-semibold">{activeTender.code}</span>
            <span className="hidden md:inline text-on-surface-variant text-[13px] truncate max-w-[220px] lg:max-w-[320px]">{activeTender.title}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">{tenderMenuOpen ? 'expand_less' : 'expand_more'}</span>
          </button>

          {tenderMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest">Select Tender</div>
              <div className="max-h-64 overflow-y-auto">
                {tenders.map((tender) => (
                  <button
                    key={tender.id}
                    onClick={() => {
                      onSelectTender(tender);
                      setTenderMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-surface-container/70 transition-colors flex flex-col gap-0.5 ${
                      tender.id === activeTender.id ? 'bg-surface-container' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-code-num text-xs font-semibold text-on-surface">{tender.code}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                        {tender.estimatedValue}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface line-clamp-1">{tender.title}</span>
                    <span className="text-[11px] text-on-surface-variant">{tender.department}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications — quiet */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            aria-label="Notifications"
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUnreadCount(0);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative"
            id="notifications-btn"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-error animate-pulse" />}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50">
              <div className="px-3 py-2 border-b border-outline-variant/15 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface uppercase tracking-wide">Alerts</span>
                <span className="text-[11px] text-secondary font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/15 text-left">
                <div className="p-3 hover:bg-surface-container/50 transition-colors flex gap-2.5">
                  <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Local Content Discrepancy</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">42% declared vs 50% required for Class-I.</p>
                    <span className="text-[10px] text-on-surface-variant font-code-num">2 mins ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-surface-container/50 transition-colors flex gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">check_circle</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Batch Verified</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">8 certificates validated.</p>
                    <span className="text-[10px] text-on-surface-variant font-code-num">12 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Officer — quiet, minimal */}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-outline-variant/15">
          <div className="hidden sm:flex flex-col text-right leading-none">
            <span className="text-[12px] font-semibold text-on-surface">R. Sharma</span>
            <span className="text-[11px] text-on-surface-variant">Procurement Officer</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
