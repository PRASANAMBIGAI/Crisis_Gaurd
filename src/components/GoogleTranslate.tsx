"use client"

import React from 'react';
import { Globe } from 'lucide-react';

export function GoogleTranslate() {
  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="google-translate-widget" />
      <style jsx global>{`
        .google-translate-widget {
          min-height: 36px;
          display: flex;
          align-items: center;
        }
        .goog-te-gadget-simple {
          background-color: hsl(var(--secondary) / 0.5) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius) !important;
          padding: 4px 8px !important;
          font-family: inherit !important;
          cursor: pointer;
          display: flex !important;
          align-items: center !important;
          gap: 6px;
          transition: all 0.2s;
        }
        .goog-te-gadget-simple:hover {
          background-color: hsl(var(--secondary) / 0.8) !important;
          border-color: hsl(var(--primary) / 0.5) !important;
        }
        .goog-te-gadget-simple img {
          display: none !important;
        }
        .goog-te-gadget-simple span {
          color: hsl(var(--foreground)) !important;
          font-size: 12px !important;
          font-weight: 600 !important;
        }
        .goog-te-menu-value span:nth-child(3) {
          display: none !important;
        }
        .goog-te-menu-value span:nth-child(5) {
          display: none !important;
        }
        .goog-te-menu-value:before {
          content: '🌐';
          font-size: 14px;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
