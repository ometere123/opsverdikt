import Link from 'next/link';
import { UnsplashOpsBackdrop } from '@/components/pressure-deck';
import { Shield, Zap, Radio, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <UnsplashOpsBackdrop variant="warehouse" className="flex-1 flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border-line/30">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-signal-amber" />
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              OpsVerdikt
            </span>
            <span className="text-xs text-muted-steel font-mono ml-1">PROTOCOL</span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-signal-amber hover:text-signal-amber/80 transition-colors flex items-center gap-1"
          >
            Enter Command Deck <ArrowRight className="w-3 h-3" />
          </Link>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-3xl text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-signal-amber uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Decentralized Operational Consensus
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-text-primary leading-tight">
              Resolve Operational Pressure{' '}
              <span className="text-signal-amber">Before It Becomes Failure</span>
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              OpsVerdikt converts high-pressure shift conditions, competing task priorities, labor constraints,
              and public evidence into a defensible on-chain Ops Verdikt, powered by GenLayer consensus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 transition-colors"
              >
                <Shield className="w-4 h-4" /> Open Pressure Deck
              </Link>
              <Link
                href="/ops/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border-line text-text-primary font-display font-medium text-sm hover:bg-panel-steel/50 transition-colors"
              >
                <FileText className="w-4 h-4" /> Create Operations Case
              </Link>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border-line/30 border-t border-border-line/30">
          {[
            { icon: Zap, title: 'Pressure Deck', desc: 'Industrial command interface for shift pressure resolution' },
            { icon: Radio, title: 'Signal Feeds', desc: 'Cloudflare Worker demo feeds for operational signals' },
            { icon: Shield, title: 'GenLayer Consensus', desc: 'Decentralized validator evaluation of labor plans' },
            { icon: FileText, title: 'On-Chain Verdikt', desc: 'Canonical, verifiable operational judgment record' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-floor-black/60 p-6">
              <Icon className="w-5 h-5 text-signal-amber mb-3" />
              <h3 className="font-display text-sm font-bold text-text-primary mb-1">{title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </UnsplashOpsBackdrop>
    </div>
  );
}
